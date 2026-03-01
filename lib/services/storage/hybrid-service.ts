/**
 * Hybrid Storage Service
 *
 * Orchestrates between Supabase (primary) and Dropbox (overflow).
 *
 * Upload logic:
 *   1. Check Supabase quota (cached 5 min)
 *   2. If fits → upload to Supabase
 *   3. If over quota + Dropbox connected → upload to Dropbox
 *   4. If over quota + no Dropbox → throw StorageQuotaExceededError
 *
 * Listing logic:
 *   - Fetch from Supabase first
 *   - If Dropbox connected, merge Dropbox items (tagged with "dropbox:" prefix)
 *
 * Download/delete/move: try Supabase first, fall back to Dropbox
 */

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
import { SupabaseStorageService, type SupabaseStorageConfig } from "./supabase-service";
import { StorageQuotaExceededError } from "./errors";

// ── Config ──

export interface HybridStorageConfig {
  tenantId: string;
  userId: string;
  /** Per-user quota in bytes (from tenant settings) */
  quotaBytes: number;
  /** Override Supabase bucket name */
  bucketName?: string;
}

// ── Service ──

export class HybridStorageService implements IStorageService {
  private supabaseService: SupabaseStorageService;
  private dropboxService: IStorageService | null = null;
  private config: HybridStorageConfig;
  private cachedUsage: { bytes: number; updatedAt: number } | null = null;

  constructor(config: HybridStorageConfig) {
    this.config = config;

    const supabaseConfig: SupabaseStorageConfig = {
      tenantId: config.tenantId,
      userId: config.userId,
      bucketName: config.bucketName,
    };

    this.supabaseService = new SupabaseStorageService(supabaseConfig);
  }

  // ── Dropbox Overflow Management ──

  /** Connect a Dropbox service for overflow storage */
  connectDropbox(service: IStorageService): void {
    this.dropboxService = service;
  }

  /** Check if Dropbox overflow is connected */
  isDropboxConnected(): boolean {
    return this.dropboxService?.isInitialized() ?? false;
  }

  /** Disconnect Dropbox overflow */
  disconnectDropbox(): void {
    this.dropboxService = null;
  }

  // ── Quota Management ──

  /** Get cached Supabase usage (recalculates every 5 min) */
  async getSupabaseUsage(): Promise<number> {
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    if (this.cachedUsage && Date.now() - this.cachedUsage.updatedAt < CACHE_TTL) {
      return this.cachedUsage.bytes;
    }

    const bytes = await this.supabaseService.getUsedBytes();
    this.cachedUsage = { bytes, updatedAt: Date.now() };
    return bytes;
  }

  /** Get quota limit in bytes */
  getQuotaBytes(): number {
    return this.config.quotaBytes;
  }

  /** Check if quota is exceeded */
  async isQuotaExceeded(): Promise<boolean> {
    if (this.config.quotaBytes === 0) return false; // 0 = unlimited
    const used = await this.getSupabaseUsage();
    return used >= this.config.quotaBytes;
  }

  /** Invalidate the cached usage (e.g., after upload/delete) */
  invalidateCache(): void {
    this.cachedUsage = null;
  }

  // ── IStorageService: Initialization ──

  async initialize(tokens: StorageOAuthTokens): Promise<void> {
    // Supabase is always initialized; only Dropbox needs tokens
    if (this.dropboxService) {
      await this.dropboxService.initialize(tokens);
    }
  }

  isInitialized(): boolean {
    // Hybrid service is initialized as long as Supabase is ready
    return this.supabaseService.isInitialized();
  }

  destroy(): void {
    this.supabaseService.destroy();
    if (this.dropboxService) {
      this.dropboxService.destroy();
    }
    this.cachedUsage = null;
  }

  // ── IStorageService: OAuth (delegate to Dropbox) ──

  getAuthorizationUrl(state: string): string {
    if (this.dropboxService) {
      return this.dropboxService.getAuthorizationUrl(state);
    }
    throw new Error("No overflow provider configured for OAuth");
  }

  async exchangeCodeForTokens(code: string, codeVerifier?: string): Promise<StorageOAuthTokens> {
    if (this.dropboxService) {
      return this.dropboxService.exchangeCodeForTokens(code, codeVerifier);
    }
    throw new Error("No overflow provider configured for OAuth");
  }

  async refreshAccessToken(refreshToken: string): Promise<StorageOAuthTokens> {
    if (this.dropboxService) {
      return this.dropboxService.refreshAccessToken(refreshToken);
    }
    throw new Error("No overflow provider configured for OAuth");
  }

  // ── IStorageService: User Info ──

  async getCurrentUser(): Promise<StorageUserInfo> {
    const supabaseUsed = await this.getSupabaseUsage();

    let dropboxInfo: StorageUserInfo | null = null;
    if (this.dropboxService?.isInitialized()) {
      try {
        dropboxInfo = await this.dropboxService.getCurrentUser();
      } catch {
        // Dropbox may fail silently
      }
    }

    return {
      displayName: dropboxInfo?.displayName || this.config.userId,
      email: dropboxInfo?.email || "",
      quotaUsed: supabaseUsed + (dropboxInfo?.quotaUsed || 0),
      quotaTotal: this.config.quotaBytes + (dropboxInfo?.quotaTotal || 0),
    };
  }

  // ── IStorageService: File Operations ──

  async listFolder(path: string, cursor?: string): Promise<StorageListResult> {
    // Always list Supabase first
    let supabaseResult: StorageListResult;
    try {
      supabaseResult = await this.supabaseService.listFolder(path, cursor);
    } catch {
      supabaseResult = { items: [], hasMore: false };
    }

    // If Dropbox is connected, merge items
    if (this.dropboxService?.isInitialized()) {
      try {
        const dropboxResult = await this.dropboxService.listFolder(path, cursor);

        // Tag Dropbox items so UI can identify the source
        const taggedDropboxItems = dropboxResult.items.map((item) => ({
          ...item,
          id: item.id.startsWith("dropbox:") ? item.id : `dropbox:${item.id}`,
        }));

        return {
          items: [...supabaseResult.items, ...taggedDropboxItems],
          hasMore: supabaseResult.hasMore || dropboxResult.hasMore,
          cursor: dropboxResult.cursor,
        };
      } catch {
        // If Dropbox fails, still return Supabase results
      }
    }

    return supabaseResult;
  }

  async search(query: string, path?: string): Promise<StorageListResult> {
    let supabaseResult: StorageListResult;
    try {
      supabaseResult = await this.supabaseService.search(query, path);
    } catch {
      supabaseResult = { items: [], hasMore: false };
    }

    if (this.dropboxService?.isInitialized()) {
      try {
        const dropboxResult = await this.dropboxService.search(query, path);
        const taggedItems = dropboxResult.items.map((item) => ({
          ...item,
          id: item.id.startsWith("dropbox:") ? item.id : `dropbox:${item.id}`,
        }));

        return {
          items: [...supabaseResult.items, ...taggedItems],
          hasMore: false,
        };
      } catch {
        // Dropbox search failure is non-fatal
      }
    }

    return supabaseResult;
  }

  async getMetadata(path: string): Promise<StorageItem> {
    // Try Supabase first
    try {
      return await this.supabaseService.getMetadata(path);
    } catch {
      // Fall back to Dropbox
      if (this.dropboxService?.isInitialized()) {
        return this.dropboxService.getMetadata(path);
      }
      throw new Error(`File not found: ${path}`);
    }
  }

  async download(path: string): Promise<Blob> {
    // Try Supabase first
    try {
      return await this.supabaseService.download(path);
    } catch {
      // Fall back to Dropbox
      if (this.dropboxService?.isInitialized()) {
        return this.dropboxService.download(path);
      }
      throw new Error(`File not found in any storage provider: ${path}`);
    }
  }

  async getDownloadUrl(path: string): Promise<string> {
    try {
      return await this.supabaseService.getDownloadUrl(path);
    } catch {
      if (this.dropboxService?.isInitialized()) {
        return this.dropboxService.getDownloadUrl(path);
      }
      throw new Error(`Cannot generate download URL: ${path}`);
    }
  }

  async upload(options: StorageUploadOptions): Promise<StorageUploadResult> {
    const fileSize = options.file.size;

    // Check quota (0 = unlimited)
    if (this.config.quotaBytes > 0) {
      const currentUsage = await this.getSupabaseUsage();

      if (currentUsage + fileSize > this.config.quotaBytes) {
        // Over quota — try Dropbox overflow
        if (this.dropboxService?.isInitialized()) {
          const result = await this.dropboxService.upload(options);
          // Tag the result so UI knows it's in Dropbox
          result.item.id = result.item.id.startsWith("dropbox:")
            ? result.item.id
            : `dropbox:${result.item.id}`;
          return result;
        }

        // No Dropbox — throw quota error
        throw new StorageQuotaExceededError(currentUsage, this.config.quotaBytes, fileSize);
      }
    }

    // Fits in Supabase — upload there
    const result = await this.supabaseService.upload(options);
    this.invalidateCache(); // Bust quota cache after upload
    return result;
  }

  async deleteItem(path: string): Promise<void> {
    // Try Supabase first
    try {
      await this.supabaseService.deleteItem(path);
      this.invalidateCache();
      return;
    } catch {
      // Fall back to Dropbox
      if (this.dropboxService?.isInitialized()) {
        await this.dropboxService.deleteItem(path);
        return;
      }
      throw new Error(`Cannot delete: ${path}`);
    }
  }

  async move(fromPath: string, toPath: string): Promise<StorageItem> {
    try {
      const result = await this.supabaseService.move(fromPath, toPath);
      return result;
    } catch {
      if (this.dropboxService?.isInitialized()) {
        return this.dropboxService.move(fromPath, toPath);
      }
      throw new Error(`Cannot move: ${fromPath}`);
    }
  }

  async copy(fromPath: string, toPath: string): Promise<StorageItem> {
    try {
      const result = await this.supabaseService.copy(fromPath, toPath);
      this.invalidateCache();
      return result;
    } catch {
      if (this.dropboxService?.isInitialized()) {
        const result = this.dropboxService.copy(fromPath, toPath);
        return result;
      }
      throw new Error(`Cannot copy: ${fromPath}`);
    }
  }

  async createFolder(path: string): Promise<StorageItem> {
    // Always create folders in Supabase (primary)
    return this.supabaseService.createFolder(path);
  }

  // ── IStorageService: Sharing ──

  async createSharedLink(options: StorageShareOptions): Promise<StorageShareResult> {
    try {
      return await this.supabaseService.createSharedLink(options);
    } catch {
      if (this.dropboxService?.isInitialized()) {
        return this.dropboxService.createSharedLink(options);
      }
      throw new Error(`Cannot create shared link: ${options.path}`);
    }
  }

  async revokeSharedLink(url: string): Promise<void> {
    // Supabase signed URLs auto-expire, but try Dropbox
    if (this.dropboxService?.isInitialized()) {
      await this.dropboxService.revokeSharedLink(url);
    }
  }
}
