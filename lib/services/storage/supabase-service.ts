/**
 * Supabase Storage Service
 *
 * Implements IStorageService using Supabase Storage.
 * This is the PRIMARY storage provider — no OAuth needed, works automatically.
 *
 * File structure within a tenant bucket:
 *   tenant-{tenantId}/
 *     {userId}/
 *       documents/
 *       images/
 *       ...
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";
import type {
  IStorageService,
  StorageItem,
  StorageListResult,
  StorageUploadOptions,
  StorageUploadResult,
  StorageShareOptions,
  StorageShareResult,
  StorageUserInfo,
  StorageOAuthTokens,
} from "./types";

// ── Config ──

export interface SupabaseStorageConfig {
  tenantId: string;
  userId: string;
  /** Override bucket name (defaults to `tenant-{tenantId}`) */
  bucketName?: string;
}

// ── Helpers ──

/** Map a Supabase FileObject to our StorageItem format */
function mapSupabaseObject(
  obj: { name: string; id?: string; metadata?: Record<string, unknown>; created_at?: string; updated_at?: string },
  basePath: string,
  bucketName: string,
  userPrefix: string,
): StorageItem {
  const isFolder = !obj.metadata?.mimetype && !obj.metadata?.size;
  const cleanBase = basePath.replace(/^\/+|\/+$/g, "");
  const userPath = cleanBase
    ? `/${cleanBase.replace(new RegExp(`^${userPrefix}/?`), "")}/${obj.name}`
    : `/${obj.name}`;

  return {
    id: `supabase:${obj.id || obj.name}`,
    name: obj.name,
    path: userPath,
    type: isFolder ? "folder" : "file",
    size: (obj.metadata?.size as number) || undefined,
    mimeType: (obj.metadata?.mimetype as string) || undefined,
    modifiedAt: (obj.updated_at || obj.created_at || new Date().toISOString()),
    createdAt: obj.created_at || undefined,
    isShared: false,
    parentPath: cleanBase ? `/${cleanBase.replace(new RegExp(`^${userPrefix}/?`), "")}` : "/",
  };
}

/** Get MIME type from file name */
function getMimeType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const mimeMap: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    txt: "text/plain",
    csv: "text/csv",
    zip: "application/zip",
    json: "application/json",
  };
  return mimeMap[ext] || "application/octet-stream";
}

// ── Service ──

export class SupabaseStorageService implements IStorageService {
  private config: SupabaseStorageConfig;
  private supabase: SupabaseClient;
  private _initialized = false;

  constructor(config: SupabaseStorageConfig) {
    this.config = config;
    this.supabase = getSupabaseClient();
    // Supabase doesn't need explicit initialization like OAuth providers
    this._initialized = true;
  }

  get bucketName(): string {
    return this.config.bucketName || `tenant-${this.config.tenantId}`;
  }

  get userPrefix(): string {
    return this.config.userId;
  }

  /** Convert a user-facing path to the full storage path (userId/path) */
  private fullPath(path: string): string {
    const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
    return clean ? `${this.userPrefix}/${clean}` : this.userPrefix;
  }

  // ── IStorageService: Initialization ──

  async initialize(): Promise<void> {
    // No-op: Supabase doesn't need token-based initialization
    this._initialized = true;
  }

  isInitialized(): boolean {
    return this._initialized;
  }

  destroy(): void {
    this._initialized = false;
  }

  // ── IStorageService: OAuth (not applicable for Supabase) ──

  getAuthorizationUrl(): string {
    throw new Error("Supabase Storage does not use OAuth. No authorization URL needed.");
  }

  async exchangeCodeForTokens(): Promise<StorageOAuthTokens> {
    throw new Error("Supabase Storage does not use OAuth tokens.");
  }

  async refreshAccessToken(): Promise<StorageOAuthTokens> {
    throw new Error("Supabase Storage does not use OAuth tokens.");
  }

  // ── IStorageService: User Info ──

  async getCurrentUser(): Promise<StorageUserInfo> {
    const usedBytes = await this.getUsedBytes();

    return {
      displayName: this.config.userId,
      email: "",
      quotaUsed: usedBytes,
      quotaTotal: undefined, // Quota managed by HybridService
    };
  }

  // ── IStorageService: File Operations ──

  async listFolder(path: string, _cursor?: string): Promise<StorageListResult> {
    const storagePath = path === "/" || path === "" ? this.userPrefix : this.fullPath(path);

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .list(storagePath, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      // If bucket doesn't exist or path not found, return empty
      if (error.message?.includes("not found") || error.message?.includes("does not exist")) {
        return { items: [], hasMore: false };
      }
      throw new Error(`Failed to list folder: ${error.message}`);
    }

    const items: StorageItem[] = (data || [])
      .filter((obj) => obj.name !== ".keep") // Hide folder placeholder files
      .map((obj) => mapSupabaseObject(obj, storagePath, this.bucketName, this.userPrefix));

    return { items, hasMore: false };
  }

  async search(query: string, path?: string): Promise<StorageListResult> {
    // Supabase Storage has no server-side search — list recursively and filter
    const searchPath = path || "/";
    const allItems = await this.listAllRecursive(searchPath);
    const lowerQuery = query.toLowerCase();

    const filtered = allItems.filter((item) =>
      item.name.toLowerCase().includes(lowerQuery)
    );

    return { items: filtered, hasMore: false };
  }

  async getMetadata(path: string): Promise<StorageItem> {
    // Supabase doesn't have a direct metadata endpoint — download headers
    const storagePath = this.fullPath(path);

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .list(storagePath.split("/").slice(0, -1).join("/"), { limit: 1000 });

    if (error) throw new Error(`Failed to get metadata: ${error.message}`);

    const fileName = storagePath.split("/").pop() || "";
    const file = data?.find((f) => f.name === fileName);
    if (!file) throw new Error(`File not found: ${path}`);

    return mapSupabaseObject(
      file,
      storagePath.split("/").slice(0, -1).join("/"),
      this.bucketName,
      this.userPrefix,
    );
  }

  async download(path: string): Promise<Blob> {
    const storagePath = this.fullPath(path);

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .download(storagePath);

    if (error) throw new Error(`Failed to download: ${error.message}`);
    if (!data) throw new Error("Download returned no data");

    return data;
  }

  async getDownloadUrl(path: string): Promise<string> {
    const storagePath = this.fullPath(path);

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (error) throw new Error(`Failed to create download URL: ${error.message}`);
    if (!data?.signedUrl) throw new Error("No signed URL returned");

    return data.signedUrl;
  }

  async upload(options: StorageUploadOptions): Promise<StorageUploadResult> {
    const storagePath = this.fullPath(options.path);

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(storagePath, options.file, {
        upsert: options.overwrite || false,
        contentType: options.file instanceof File ? options.file.type : getMimeType(options.path),
      });

    if (error) {
      // Handle duplicate — if autorename, try with timestamp suffix
      if (error.message?.includes("already exists") && options.autorename) {
        const ext = options.path.includes(".") ? `.${options.path.split(".").pop()}` : "";
        const base = options.path.replace(ext, "");
        const newPath = `${base}_${Date.now()}${ext}`;
        return this.upload({ ...options, path: newPath, autorename: false });
      }
      throw new Error(`Failed to upload: ${error.message}`);
    }

    const fileName = storagePath.split("/").pop() || "";
    const parentPath = storagePath.split("/").slice(0, -1).join("/");

    const item: StorageItem = {
      id: `supabase:${data?.path || storagePath}`,
      name: fileName,
      path: options.path,
      type: "file",
      size: options.file.size,
      mimeType: options.file instanceof File ? options.file.type : getMimeType(options.path),
      modifiedAt: new Date().toISOString(),
      isShared: false,
      parentPath: `/${parentPath.replace(new RegExp(`^${this.userPrefix}/?`), "")}` || "/",
    };

    return { item };
  }

  async deleteItem(path: string): Promise<void> {
    const storagePath = this.fullPath(path);

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([storagePath]);

    if (error) throw new Error(`Failed to delete: ${error.message}`);
  }

  async move(fromPath: string, toPath: string): Promise<StorageItem> {
    const from = this.fullPath(fromPath);
    const to = this.fullPath(toPath);

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .move(from, to);

    if (error) throw new Error(`Failed to move: ${error.message}`);

    return this.getMetadata(toPath);
  }

  async copy(fromPath: string, toPath: string): Promise<StorageItem> {
    const from = this.fullPath(fromPath);
    const to = this.fullPath(toPath);

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .copy(from, to);

    if (error) throw new Error(`Failed to copy: ${error.message}`);

    return this.getMetadata(toPath);
  }

  async createFolder(path: string): Promise<StorageItem> {
    // Supabase Storage is object-based — create a .keep placeholder
    const keepPath = this.fullPath(`${path}/.keep`);

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(keepPath, new Blob([""]), {
        contentType: "application/octet-stream",
        upsert: true,
      });

    if (error) throw new Error(`Failed to create folder: ${error.message}`);

    const folderName = path.split("/").filter(Boolean).pop() || path;
    const parentPath = path.split("/").slice(0, -1).join("/") || "/";

    return {
      id: `supabase:folder:${path}`,
      name: folderName,
      path: `/${path.replace(/^\/+/, "")}`,
      type: "folder",
      modifiedAt: new Date().toISOString(),
      isShared: false,
      parentPath: parentPath.startsWith("/") ? parentPath : `/${parentPath}`,
    };
  }

  // ── IStorageService: Sharing ──

  async createSharedLink(options: StorageShareOptions): Promise<StorageShareResult> {
    const storagePath = this.fullPath(options.path);

    // Create a signed URL (expires in 7 days)
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUrl(storagePath, 7 * 24 * 60 * 60); // 7 days

    if (error) throw new Error(`Failed to create shared link: ${error.message}`);
    if (!data?.signedUrl) throw new Error("No signed URL returned");

    return {
      sharedLink: data.signedUrl,
      accessLevel: options.access || "viewer",
    };
  }

  async revokeSharedLink(): Promise<void> {
    // Supabase signed URLs are time-based — they expire automatically.
    // No explicit revocation mechanism.
  }

  // ── Quota Tracking ──

  /** Calculate total bytes used by this user in the tenant bucket */
  async getUsedBytes(): Promise<number> {
    let totalBytes = 0;

    const countBytes = async (path: string) => {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list(path, { limit: 1000 });

      if (error || !data) return;

      for (const item of data) {
        if (item.metadata?.size) {
          totalBytes += item.metadata.size as number;
        } else if (!item.metadata?.mimetype) {
          // Likely a folder — recurse
          await countBytes(`${path}/${item.name}`);
        }
      }
    };

    await countBytes(this.userPrefix);
    return totalBytes;
  }

  // ── Helpers ──

  /** List all files recursively for search */
  private async listAllRecursive(path: string): Promise<StorageItem[]> {
    const storagePath = path === "/" || path === "" ? this.userPrefix : this.fullPath(path);
    const allItems: StorageItem[] = [];

    const recurse = async (currentPath: string) => {
      const { data } = await this.supabase.storage
        .from(this.bucketName)
        .list(currentPath, { limit: 1000 });

      if (!data) return;

      for (const obj of data) {
        if (obj.name === ".keep") continue;

        const item = mapSupabaseObject(obj, currentPath, this.bucketName, this.userPrefix);
        allItems.push(item);

        if (item.type === "folder") {
          await recurse(`${currentPath}/${obj.name}`);
        }
      }
    };

    await recurse(storagePath);
    return allItems;
  }
}

// ── Singleton ──

let serviceInstance: SupabaseStorageService | null = null;

export function getSupabaseService(config: SupabaseStorageConfig): SupabaseStorageService {
  if (!serviceInstance || serviceInstance["config"].tenantId !== config.tenantId || serviceInstance["config"].userId !== config.userId) {
    serviceInstance = new SupabaseStorageService(config);
  }
  return serviceInstance;
}

export function resetSupabaseService(): void {
  if (serviceInstance) {
    serviceInstance.destroy();
    serviceInstance = null;
  }
}
