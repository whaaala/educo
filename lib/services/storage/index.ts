/**
 * Storage Service Manager
 *
 * Singleton manager for cloud storage providers.
 * Follows the CommunicationManager pattern from lib/services/communication/index.ts.
 *
 * Primary: Supabase Storage (zero-config, automatic)
 * Overflow: Dropbox (when Supabase quota exceeded, user-initiated OAuth)
 */

export * from "./types";
export * from "./dropbox-service";
export * from "./supabase-service";
export * from "./hybrid-service";
export * from "./errors";

import type { StorageProviderType } from "@/types/school";
import type { StorageSettings } from "@/contexts/StorageContext";
import type { IStorageService } from "./types";
import { getDropboxService, resetDropboxService, type DropboxConfig } from "./dropbox-service";
import { getSupabaseService, resetSupabaseService, type SupabaseStorageConfig } from "./supabase-service";
import { HybridStorageService, type HybridStorageConfig } from "./hybrid-service";
import { isSupabaseConfigured } from "@/lib/supabase";

export class StorageManager {
  private settings: StorageSettings | null = null;
  private currentService: IStorageService | null = null;
  private currentProvider: StorageProviderType | null = null;
  private tenantId: string | null = null;
  private hybridServiceInstance: HybridStorageService | null = null;

  setSettings(settings: StorageSettings): void {
    this.settings = settings;
    this.tenantId = settings.tenantId || null;
  }

  setTenantId(tenantId: string): void {
    this.tenantId = tenantId;
  }

  /** Get the storage service for a provider (defaults to tenant's default provider) */
  getService(provider?: StorageProviderType): IStorageService {
    const targetProvider = provider || this.settings?.defaultProvider || "supabase";
    return this.getServiceForProvider(targetProvider);
  }

  private getServiceForProvider(provider: StorageProviderType): IStorageService {
    switch (provider) {
      case "supabase": {
        const config: SupabaseStorageConfig = {
          tenantId: this.tenantId || "",
          userId: "anonymous",
        };
        const service = getSupabaseService(config);
        this.currentService = service;
        this.currentProvider = "supabase";
        return service;
      }

      case "dropbox": {
        const appKey = (this.settings?.dropbox.configMode === "tenant" && this.settings.dropbox.appKey)
          ? this.settings.dropbox.appKey
          : process.env.NEXT_PUBLIC_DROPBOX_APP_KEY || "";

        const config: DropboxConfig = {
          appKey,
          redirectUri: typeof window !== "undefined"
            ? `${window.location.origin}/api/storage/callback`
            : "/api/storage/callback",
        };

        const service = getDropboxService(config);
        this.currentService = service;
        this.currentProvider = "dropbox";
        return service;
      }

      case "google-drive":
      case "onedrive":
        // Future providers — fall back to Dropbox for now
        console.warn(`${provider} not yet implemented, falling back to Dropbox`);
        return this.getServiceForProvider("dropbox");

      case "local":
      default:
        throw new Error(`Provider "${provider}" is not supported yet`);
    }
  }

  /** Get the hybrid service (Supabase primary + Dropbox overflow) */
  getHybridService(userId: string, quotaBytes: number): HybridStorageService {
    // Reuse if same config
    if (
      this.hybridServiceInstance &&
      this.hybridServiceInstance["config"].tenantId === (this.tenantId || "") &&
      this.hybridServiceInstance["config"].userId === userId
    ) {
      return this.hybridServiceInstance;
    }

    const config: HybridStorageConfig = {
      tenantId: this.tenantId || "",
      userId,
      quotaBytes,
    };

    this.hybridServiceInstance = new HybridStorageService(config);
    return this.hybridServiceInstance;
  }

  /** Check if a provider has valid credentials configured */
  isProviderConfigured(provider: StorageProviderType): boolean {
    if (!this.settings) return false;

    switch (provider) {
      case "supabase":
        return isSupabaseConfigured();
      case "dropbox":
        return this.settings.dropbox.enabled && (
          this.settings.dropbox.configMode === "platform"
            ? !!process.env.NEXT_PUBLIC_DROPBOX_APP_KEY
            : !!this.settings.dropbox.appKey
        );
      case "google-drive":
        return this.settings.googleDrive.enabled && (
          this.settings.googleDrive.configMode === "platform"
            ? !!process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID
            : !!this.settings.googleDrive.clientId
        );
      case "onedrive":
        return this.settings.oneDrive.enabled && (
          this.settings.oneDrive.configMode === "platform"
            ? !!process.env.NEXT_PUBLIC_ONEDRIVE_CLIENT_ID
            : !!this.settings.oneDrive.clientId
        );
      case "local":
        return true;
      default:
        return false;
    }
  }

  /** Get all providers that are enabled and configured */
  getAvailableProviders(): StorageProviderType[] {
    const providers: StorageProviderType[] = [];
    if (this.isProviderConfigured("supabase")) providers.push("supabase");
    if (this.isProviderConfigured("dropbox")) providers.push("dropbox");
    if (this.isProviderConfigured("google-drive")) providers.push("google-drive");
    if (this.isProviderConfigured("onedrive")) providers.push("onedrive");
    providers.push("local");
    return providers;
  }

  /** Get the currently active service (if any) */
  getCurrentService(): IStorageService | null {
    return this.currentService;
  }

  /** Get the currently active provider */
  getCurrentProvider(): StorageProviderType | null {
    return this.currentProvider;
  }

  /** Clean up all services */
  cleanup(): void {
    resetDropboxService();
    resetSupabaseService();
    if (this.hybridServiceInstance) {
      this.hybridServiceInstance.destroy();
      this.hybridServiceInstance = null;
    }
    this.currentService = null;
    this.currentProvider = null;
    this.settings = null;
    this.tenantId = null;
  }
}

// Singleton instance
let managerInstance: StorageManager | null = null;

export function getStorageManager(): StorageManager {
  if (!managerInstance) {
    managerInstance = new StorageManager();
  }
  return managerInstance;
}

export function resetStorageManager(): void {
  if (managerInstance) {
    managerInstance.cleanup();
    managerInstance = null;
  }
}
