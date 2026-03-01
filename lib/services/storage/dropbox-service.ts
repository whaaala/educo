/**
 * Dropbox Storage Service
 *
 * Implements IStorageService using Dropbox HTTP API v2.
 * Uses OAuth2 with PKCE for authentication.
 * All token exchanges go through server-side API routes (/api/storage/token).
 *
 * Dropbox API Reference: https://www.dropbox.com/developers/documentation/http/documentation
 */

import type {
  IStorageService,
  StorageOAuthTokens,
  StorageUserInfo,
  StorageListResult,
  StorageItem,
  StorageUploadOptions,
  StorageUploadResult,
  StorageShareOptions,
  StorageShareResult,
} from "./types";

export interface DropboxConfig {
  /** Dropbox App Key (NEXT_PUBLIC_DROPBOX_APP_KEY) */
  appKey: string;
  /** OAuth redirect URI (/api/storage/callback) */
  redirectUri: string;
}

// PKCE helpers
function generateCodeVerifier(): string {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 128);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Map Dropbox file metadata to StorageItem
function mapDropboxEntry(entry: Record<string, unknown>): StorageItem {
  const tag = entry[".tag"] as string;
  const path = (entry.path_display || entry.path_lower || "") as string;
  const parentParts = path.split("/");
  parentParts.pop();
  const parentPath = parentParts.join("/") || "/";

  return {
    id: (entry.id || path) as string,
    name: (entry.name || "") as string,
    path,
    type: tag === "folder" ? "folder" : "file",
    size: tag === "file" ? (entry.size as number) : undefined,
    modifiedAt: tag === "file"
      ? (entry.client_modified as string) || new Date().toISOString()
      : new Date().toISOString(),
    isShared: !!(entry.sharing_info),
    parentPath,
  };
}

export class DropboxService implements IStorageService {
  private config: DropboxConfig;
  private tokens: StorageOAuthTokens | null = null;
  private _initialized = false;

  constructor(config: DropboxConfig) {
    this.config = config;
  }

  // ── Initialization ──

  async initialize(tokens: StorageOAuthTokens): Promise<void> {
    this.tokens = tokens;
    this._initialized = true;
  }

  isInitialized(): boolean {
    return this._initialized && this.tokens !== null;
  }

  destroy(): void {
    this.tokens = null;
    this._initialized = false;
  }

  // ── Internal: API call with auto-refresh ──

  private async apiCall<T>(
    url: string,
    options: RequestInit = {},
    isContentEndpoint = false
  ): Promise<T> {
    if (!this.tokens) throw new Error("Dropbox service not initialized");

    // Check if token is expired, refresh if needed
    if (new Date(this.tokens.expiresAt) <= new Date()) {
      await this.refreshAccessToken(this.tokens.refreshToken);
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.tokens.accessToken}`,
      ...(options.headers as Record<string, string> || {}),
    };

    if (!isContentEndpoint) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, { ...options, headers });

    // Handle expired token (401)
    if (response.status === 401 && this.tokens.refreshToken) {
      await this.refreshAccessToken(this.tokens.refreshToken);
      headers.Authorization = `Bearer ${this.tokens!.accessToken}`;
      const retryResponse = await fetch(url, { ...options, headers });
      if (!retryResponse.ok) {
        throw new Error(`Dropbox API error: ${retryResponse.status}`);
      }
      return retryResponse.json() as T;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Dropbox API error (${response.status}): ${errorText}`);
    }

    return response.json() as T;
  }

  // ── OAuth2 + PKCE ──

  getAuthorizationUrl(state: string): string {
    // Generate PKCE code verifier and store in sessionStorage
    const codeVerifier = generateCodeVerifier();
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("dropbox_code_verifier", codeVerifier);
    }

    // We'll compute the code challenge synchronously via a workaround:
    // The actual challenge is computed async, so we use the authorization URL builder pattern
    const params = new URLSearchParams({
      client_id: this.config.appKey,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      token_access_type: "offline",
      state,
    });

    return `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
  }

  /** Call this to get the auth URL with PKCE (async for SHA-256 hashing) */
  async getAuthorizationUrlWithPKCE(state: string): Promise<string> {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("dropbox_code_verifier", codeVerifier);
    }

    const params = new URLSearchParams({
      client_id: this.config.appKey,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      token_access_type: "offline",
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    return `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, codeVerifier?: string): Promise<StorageOAuthTokens> {
    const response = await fetch("/api/storage/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "dropbox",
        code,
        codeVerifier: codeVerifier || (typeof sessionStorage !== "undefined"
          ? sessionStorage.getItem("dropbox_code_verifier") || undefined
          : undefined),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Token exchange failed: ${err}`);
    }

    const tokens = await response.json() as StorageOAuthTokens;
    this.tokens = tokens;
    this._initialized = true;

    // Clean up stored verifier
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem("dropbox_code_verifier");
    }

    return tokens;
  }

  async refreshAccessToken(refreshToken: string): Promise<StorageOAuthTokens> {
    const response = await fetch("/api/storage/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "dropbox",
        refreshToken,
        grantType: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const tokens = await response.json() as StorageOAuthTokens;
    this.tokens = {
      ...this.tokens!,
      accessToken: tokens.accessToken,
      expiresAt: tokens.expiresAt,
    };

    return this.tokens;
  }

  // ── User Info ──

  async getCurrentUser(): Promise<StorageUserInfo> {
    const data = await this.apiCall<Record<string, unknown>>(
      "https://api.dropboxapi.com/2/users/get_current_account",
      { method: "POST" }
    );

    // Get space usage
    let quotaUsed = 0;
    let quotaTotal = 0;
    try {
      const usage = await this.apiCall<Record<string, unknown>>(
        "https://api.dropboxapi.com/2/users/get_space_usage",
        { method: "POST" }
      );
      quotaUsed = (usage.used as number) || 0;
      const allocation = usage.allocation as Record<string, unknown>;
      if (allocation) {
        quotaTotal = (allocation.allocated as number) || 0;
      }
    } catch { /* quota info is optional */ }

    const name = data.name as Record<string, string> | undefined;

    return {
      displayName: name?.display_name || "",
      email: (data.email as string) || "",
      profilePhotoUrl: (data.profile_photo_url as string) || undefined,
      quotaUsed,
      quotaTotal,
      accountId: (data.account_id as string) || undefined,
    };
  }

  // ── File Operations ──

  async listFolder(path: string, cursor?: string): Promise<StorageListResult> {
    const url = cursor
      ? "https://api.dropboxapi.com/2/files/list_folder/continue"
      : "https://api.dropboxapi.com/2/files/list_folder";

    const body = cursor
      ? { cursor }
      : { path: path === "/" ? "" : path, recursive: false, include_mounted_folders: true };

    const data = await this.apiCall<{
      entries: Record<string, unknown>[];
      cursor: string;
      has_more: boolean;
    }>(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return {
      items: data.entries.map(mapDropboxEntry),
      cursor: data.cursor,
      hasMore: data.has_more,
    };
  }

  async search(query: string, path?: string): Promise<StorageListResult> {
    const options: Record<string, unknown> = {};
    if (path) {
      options.path = path;
    }

    const data = await this.apiCall<{
      matches: Array<{ metadata: { metadata: Record<string, unknown> } }>;
      has_more: boolean;
      cursor?: string;
    }>("https://api.dropboxapi.com/2/files/search_v2", {
      method: "POST",
      body: JSON.stringify({
        query,
        options: Object.keys(options).length ? options : undefined,
      }),
    });

    return {
      items: data.matches.map((m) => mapDropboxEntry(m.metadata.metadata)),
      cursor: data.cursor,
      hasMore: data.has_more,
    };
  }

  async getMetadata(path: string): Promise<StorageItem> {
    const data = await this.apiCall<Record<string, unknown>>(
      "https://api.dropboxapi.com/2/files/get_metadata",
      {
        method: "POST",
        body: JSON.stringify({ path }),
      }
    );
    return mapDropboxEntry(data);
  }

  async download(path: string): Promise<Blob> {
    if (!this.tokens) throw new Error("Not initialized");

    const response = await fetch("https://content.dropboxapi.com/2/files/download", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.tokens.accessToken}`,
        "Dropbox-API-Arg": JSON.stringify({ path }),
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    return response.blob();
  }

  async getDownloadUrl(path: string): Promise<string> {
    const data = await this.apiCall<{ link: string }>(
      "https://api.dropboxapi.com/2/files/get_temporary_link",
      {
        method: "POST",
        body: JSON.stringify({ path }),
      }
    );
    return data.link;
  }

  async upload(options: StorageUploadOptions): Promise<StorageUploadResult> {
    if (!this.tokens) throw new Error("Not initialized");

    const mode = options.overwrite
      ? { ".tag": "overwrite" }
      : options.autorename
        ? { ".tag": "add", autorename: true }
        : { ".tag": "add" };

    const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.tokens.accessToken}`,
        "Dropbox-API-Arg": JSON.stringify({
          path: options.path,
          mode,
          autorename: options.autorename ?? true,
          mute: false,
        }),
        "Content-Type": "application/octet-stream",
      },
      body: options.file,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await response.json();
    return {
      item: mapDropboxEntry(data),
      contentHash: data.content_hash,
    };
  }

  async deleteItem(path: string): Promise<void> {
    await this.apiCall("https://api.dropboxapi.com/2/files/delete_v2", {
      method: "POST",
      body: JSON.stringify({ path }),
    });
  }

  async move(fromPath: string, toPath: string): Promise<StorageItem> {
    const data = await this.apiCall<{ metadata: Record<string, unknown> }>(
      "https://api.dropboxapi.com/2/files/move_v2",
      {
        method: "POST",
        body: JSON.stringify({
          from_path: fromPath,
          to_path: toPath,
          autorename: true,
        }),
      }
    );
    return mapDropboxEntry(data.metadata);
  }

  async copy(fromPath: string, toPath: string): Promise<StorageItem> {
    const data = await this.apiCall<{ metadata: Record<string, unknown> }>(
      "https://api.dropboxapi.com/2/files/copy_v2",
      {
        method: "POST",
        body: JSON.stringify({
          from_path: fromPath,
          to_path: toPath,
          autorename: true,
        }),
      }
    );
    return mapDropboxEntry(data.metadata);
  }

  async createFolder(path: string): Promise<StorageItem> {
    const data = await this.apiCall<{ metadata: Record<string, unknown> }>(
      "https://api.dropboxapi.com/2/files/create_folder_v2",
      {
        method: "POST",
        body: JSON.stringify({ path, autorename: false }),
      }
    );
    return mapDropboxEntry(data.metadata);
  }

  // ── Sharing ──

  async createSharedLink(options: StorageShareOptions): Promise<StorageShareResult> {
    const settings: Record<string, unknown> = {};
    if (options.access === "viewer") {
      settings.requested_visibility = { ".tag": "public" };
    } else {
      settings.requested_visibility = { ".tag": "public" };
      settings.access = { ".tag": "editor" };
    }

    try {
      const data = await this.apiCall<{ url: string; link_permissions: Record<string, unknown> }>(
        "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
        {
          method: "POST",
          body: JSON.stringify({
            path: options.path,
            settings,
          }),
        }
      );

      return {
        sharedLink: data.url,
        accessLevel: options.access,
      };
    } catch (err) {
      // If a shared link already exists, retrieve it
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes("shared_link_already_exists")) {
        const existing = await this.apiCall<{
          links: Array<{ url: string }>;
        }>("https://api.dropboxapi.com/2/sharing/list_shared_links", {
          method: "POST",
          body: JSON.stringify({ path: options.path, direct_only: true }),
        });
        if (existing.links.length > 0) {
          return {
            sharedLink: existing.links[0].url,
            accessLevel: options.access,
          };
        }
      }
      throw err;
    }
  }

  async revokeSharedLink(url: string): Promise<void> {
    await this.apiCall("https://api.dropboxapi.com/2/sharing/revoke_shared_link", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }
}

// ── Singleton ──

let dropboxInstance: DropboxService | null = null;

export function getDropboxService(config?: DropboxConfig): DropboxService {
  if (!dropboxInstance && config) {
    dropboxInstance = new DropboxService(config);
  }
  if (!dropboxInstance) throw new Error("Dropbox service not initialized — call with config first");
  return dropboxInstance;
}

export function resetDropboxService(): void {
  if (dropboxInstance) {
    dropboxInstance.destroy();
    dropboxInstance = null;
  }
}
