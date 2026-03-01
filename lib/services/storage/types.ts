// Cloud Storage Service Types
// Used by all storage provider implementations (Dropbox, Google Drive, OneDrive, etc.)

import type { StorageProviderType } from "@/types/school";

// ── File & Folder Types ──

export type StorageItemType = "file" | "folder";
export type SortField = "name" | "modified" | "size";
export type SortDirection = "asc" | "desc";

export interface StorageItem {
  /** Provider-specific ID (e.g., Dropbox file ID like "id:abc123") */
  id: string;
  name: string;
  /** Full path (e.g., "/Educo/documents/homework.pdf") */
  path: string;
  type: StorageItemType;
  /** File size in bytes (undefined for folders) */
  size?: number;
  mimeType?: string;
  /** ISO timestamp */
  modifiedAt: string;
  createdAt?: string;
  isShared: boolean;
  sharedLink?: string;
  thumbnailUrl?: string;
  /** Parent folder path */
  parentPath: string;
}

// ── List / Search Results ──

export interface StorageListResult {
  items: StorageItem[];
  /** Pagination cursor (Dropbox uses cursors for list_folder/continue) */
  cursor?: string;
  hasMore: boolean;
}

// ── Upload ──

export interface StorageUploadOptions {
  /** Destination path (e.g., "/Educo/documents/report.pdf") */
  path: string;
  file: File | Blob;
  /** Overwrite existing file at the same path */
  overwrite?: boolean;
  /** Auto-rename on conflict (Dropbox-style) */
  autorename?: boolean;
}

export interface StorageUploadResult {
  item: StorageItem;
  contentHash?: string;
}

// ── Sharing ──

export interface StorageShareOptions {
  path: string;
  access: "viewer" | "editor";
  /** Email addresses of people to share with */
  members?: string[];
  /** Just create a shared link (no individual invites) */
  linkOnly?: boolean;
}

export interface StorageShareResult {
  sharedLink: string;
  accessLevel: string;
}

// ── User Info ──

export interface StorageUserInfo {
  displayName: string;
  email: string;
  profilePhotoUrl?: string;
  /** Bytes used */
  quotaUsed?: number;
  /** Bytes total */
  quotaTotal?: number;
  /** Provider-specific account ID */
  accountId?: string;
}

// ── OAuth Tokens ──

export interface StorageOAuthTokens {
  accessToken: string;
  refreshToken: string;
  /** ISO timestamp when the access token expires */
  expiresAt: string;
  tokenType: string;
  scope?: string;
  provider: StorageProviderType;
  /** Educo user ID this token belongs to */
  userId: string;
  /** Provider-specific account ID */
  providerAccountId?: string;
}

// ── Storage Service Interface ──
// Each provider (Dropbox, Google Drive, OneDrive) implements this interface

export interface IStorageService {
  // Initialization
  initialize(tokens: StorageOAuthTokens): Promise<void>;
  isInitialized(): boolean;
  destroy(): void;

  // OAuth Authentication
  getAuthorizationUrl(state: string): string;
  exchangeCodeForTokens(code: string, codeVerifier?: string): Promise<StorageOAuthTokens>;
  refreshAccessToken(refreshToken: string): Promise<StorageOAuthTokens>;

  // User info
  getCurrentUser(): Promise<StorageUserInfo>;

  // File operations
  listFolder(path: string, cursor?: string): Promise<StorageListResult>;
  search(query: string, path?: string): Promise<StorageListResult>;
  getMetadata(path: string): Promise<StorageItem>;
  download(path: string): Promise<Blob>;
  getDownloadUrl(path: string): Promise<string>;
  upload(options: StorageUploadOptions): Promise<StorageUploadResult>;
  deleteItem(path: string): Promise<void>;
  move(fromPath: string, toPath: string): Promise<StorageItem>;
  copy(fromPath: string, toPath: string): Promise<StorageItem>;
  createFolder(path: string): Promise<StorageItem>;

  // Sharing
  createSharedLink(options: StorageShareOptions): Promise<StorageShareResult>;
  revokeSharedLink(url: string): Promise<void>;
}
