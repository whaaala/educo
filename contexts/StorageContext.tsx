"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import type { StorageProviderType } from "@/types/school";
import { isSupabaseConfigured } from "@/lib/supabase";
import { HybridStorageService } from "@/lib/services/storage/hybrid-service";
import { getStorageManager } from "@/lib/services/storage";

// ── Config Mode ──
// "platform" = Use platform-wide cloud storage app (shared across all schools)
// "tenant" = Each school uses their own cloud storage app credentials
export type StorageConfigMode = "platform" | "tenant";

// ── Per-Provider Credential Interfaces ──

export interface DropboxCredentials {
  configMode: StorageConfigMode;
  appKey: string;
  // appSecret is NEVER stored client-side — it lives in env vars / server-side API
  enabled: boolean;
}

export interface GoogleDriveCredentials {
  configMode: StorageConfigMode;
  clientId: string;
  enabled: boolean;
}

export interface OneDriveCredentials {
  configMode: StorageConfigMode;
  clientId: string;
  tenantId?: string; // Azure AD tenant ID
  enabled: boolean;
}

// ── User-level OAuth Connection State ──

export interface UserStorageConnection {
  provider: StorageProviderType;
  connected: boolean;
  accountEmail?: string;
  accountName?: string;
  profilePhotoUrl?: string;
  connectedAt?: string;
  /** Whether the stored token is still valid (not expired/revoked) */
  hasValidToken: boolean;
  /** Bytes used / total */
  quotaUsed?: number;
  quotaTotal?: number;
}

// ── Tenant-level Storage Settings ──

export interface StorageSettings {
  tenantId: string;
  schoolName: string;

  // Provider credentials (tenant-level)
  dropbox: DropboxCredentials;
  googleDrive: GoogleDriveCredentials;
  oneDrive: OneDriveCredentials;

  // Default provider preference
  defaultProvider: StorageProviderType;

  // Feature toggles
  enableFileSharing: boolean;
  enableFolderSharing: boolean;
  maxUploadSizeMb: number;
  allowedFileTypes: string[];

  // Per-user Supabase quota in MB (default 100, 0 = unlimited)
  supabaseUserQuotaMb: number;

  // Dropbox overflow enabled
  dropboxOverflowEnabled: boolean;

  // User connection state (keyed by userId)
  userConnections: Record<string, UserStorageConnection>;

  // Updated timestamp
  updatedAt: string;
}

// ── Defaults ──

const defaultDropboxCredentials: DropboxCredentials = {
  configMode: "platform",
  appKey: "",
  enabled: true, // Dropbox is enabled as overflow by default
};

const defaultGoogleDriveCredentials: GoogleDriveCredentials = {
  configMode: "platform",
  clientId: "",
  enabled: false,
};

const defaultOneDriveCredentials: OneDriveCredentials = {
  configMode: "platform",
  clientId: "",
  enabled: false,
};

const _isSupabaseReady = typeof window !== "undefined" && isSupabaseConfigured();

const defaultSettings: StorageSettings = {
  tenantId: "",
  schoolName: "",
  dropbox: defaultDropboxCredentials,
  googleDrive: defaultGoogleDriveCredentials,
  oneDrive: defaultOneDriveCredentials,
  defaultProvider: _isSupabaseReady ? "supabase" : "dropbox",
  enableFileSharing: true,
  enableFolderSharing: true,
  maxUploadSizeMb: 100,
  supabaseUserQuotaMb: 100, // 100 MB default per user
  dropboxOverflowEnabled: true,
  allowedFileTypes: [
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".jpg", ".jpeg", ".png", ".gif", ".svg",
    ".mp4", ".mp3", ".wav",
    ".txt", ".csv", ".zip",
  ],
  userConnections: {},
  updatedAt: new Date().toISOString(),
};

// ── Context Type ──

interface StorageContextType {
  settings: StorageSettings;

  // Current tenant
  currentTenantId: string | null;

  // All tenant settings (for admin view)
  allTenantSettings: Record<string, StorageSettings>;

  // Update methods
  updateSettings: (newSettings: Partial<StorageSettings>) => void;
  updateDropboxCredentials: (credentials: Partial<DropboxCredentials>) => void;
  updateGoogleDriveCredentials: (credentials: Partial<GoogleDriveCredentials>) => void;
  updateOneDriveCredentials: (credentials: Partial<OneDriveCredentials>) => void;

  // Tenant management
  loadTenantSettings: (tenantId: string) => void;
  saveTenantSettings: (tenantId: string, settings: StorageSettings) => void;
  getTenantSettings: (tenantId: string) => StorageSettings;

  // User connection management (Dropbox overflow)
  connectUser: (userId: string, connection: UserStorageConnection) => void;
  disconnectUser: (userId: string) => void;
  getUserConnection: (userId: string) => UserStorageConnection | null;

  // Utility methods
  isConfigured: (provider: StorageProviderType) => boolean;
  getAvailableProviders: () => StorageProviderType[];
  getDefaultProvider: () => StorageProviderType;

  // Supabase + Hybrid
  isSupabaseConfigured: boolean;
  supabaseQuotaUsed: number;
  supabaseQuotaTotal: number;
  isSupabaseQuotaExceeded: boolean;
  refreshSupabaseQuota: () => Promise<void>;

  // Dropbox overflow
  isDropboxOverflowConnected: (userId: string) => boolean;
  connectDropboxOverflow: (userId: string) => void;

  // Hybrid service
  getHybridService: (userId: string) => HybridStorageService | null;

  // Connection state
  isInitialized: boolean;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const STORAGE_KEY = "educo_storage_settings";
const ALL_TENANTS_KEY = "educo_all_tenant_storage_settings";

export function StorageProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StorageSettings>(defaultSettings);
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const [allTenantSettings, setAllTenantSettings] = useState<Record<string, StorageSettings>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Supabase quota tracking
  const [supabaseQuotaUsed, setSupabaseQuotaUsed] = useState(0);
  const supabaseQuotaTotal = (settings.supabaseUserQuotaMb || 100) * 1024 * 1024; // Convert MB to bytes
  const isSupabaseQuotaExceeded = supabaseQuotaTotal > 0 && supabaseQuotaUsed >= supabaseQuotaTotal;

  // Hybrid service ref (persists across renders)
  const hybridServiceRef = useRef<HybridStorageService | null>(null);

  const _supabaseConfigured = typeof window !== "undefined" && isSupabaseConfigured();

  // Helper function to merge settings with defaults
  const mergeWithDefaults = (parsed: Partial<StorageSettings>): StorageSettings => ({
    ...defaultSettings,
    ...parsed,
    dropbox: { ...defaultDropboxCredentials, ...(parsed.dropbox || {}) },
    googleDrive: { ...defaultGoogleDriveCredentials, ...(parsed.googleDrive || {}) },
    oneDrive: { ...defaultOneDriveCredentials, ...(parsed.oneDrive || {}) },
  });

  // Load all tenant settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load all tenant settings
        const allSettings = localStorage.getItem(ALL_TENANTS_KEY);
        if (allSettings) {
          const parsed = JSON.parse(allSettings) as Record<string, StorageSettings>;
          const merged: Record<string, StorageSettings> = {};
          Object.entries(parsed).forEach(([tenantId, tenantSettings]) => {
            merged[tenantId] = mergeWithDefaults(tenantSettings);
          });
          setAllTenantSettings(merged);
        }

        // Load current/default settings
        const savedSettings = localStorage.getItem(STORAGE_KEY);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings) as StorageSettings;
          setSettings(mergeWithDefaults(parsed));
          if (parsed.tenantId) {
            setCurrentTenantId(parsed.tenantId);
          }
        }
      } catch (error) {
        console.error("Failed to load storage settings:", error);
      }
      setIsInitialized(true);
    };

    loadSettings();

    // Listen for tenant changes
    const handleTenantChange = (event: CustomEvent<{ tenantId: string }>) => {
      const tenantId = event.detail.tenantId;
      setCurrentTenantId(tenantId);
      // Invalidate hybrid service on tenant switch
      hybridServiceRef.current = null;

      // Load settings for this tenant
      setAllTenantSettings((prev) => {
        const tenantSettings = prev[tenantId];
        if (tenantSettings) {
          setSettings(tenantSettings);
        } else {
          const newSettings = { ...defaultSettings, tenantId };
          setSettings(newSettings);
        }
        return prev;
      });
    };

    window.addEventListener("tenantChanged", handleTenantChange as EventListener);

    return () => {
      window.removeEventListener("tenantChanged", handleTenantChange as EventListener);
    };
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        // Also update allTenantSettings if tenantId is set
        if (settings.tenantId) {
          setAllTenantSettings((prev) => ({
            ...prev,
            [settings.tenantId]: settings,
          }));
        }
      } catch (error) {
        console.error("Failed to save storage settings:", error);
      }
    }
  }, [settings, isInitialized]);

  // Save allTenantSettings to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && Object.keys(allTenantSettings).length > 0) {
      try {
        localStorage.setItem(ALL_TENANTS_KEY, JSON.stringify(allTenantSettings));
      } catch (error) {
        console.error("Failed to save all tenant storage settings:", error);
      }
    }
  }, [allTenantSettings, isInitialized]);

  // Ensure tenant bucket exists on mount (lazy setup)
  useEffect(() => {
    if (!isInitialized || !_supabaseConfigured || !settings.tenantId) return;

    const ensureBucket = async () => {
      try {
        await fetch("/api/storage/supabase/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenantId: settings.tenantId }),
        });
      } catch {
        // Bucket setup failure is non-fatal — may already exist
      }
    };

    ensureBucket();
  }, [isInitialized, _supabaseConfigured, settings.tenantId]);

  // Load settings for a specific tenant
  const loadTenantSettings = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    hybridServiceRef.current = null;
    const tenantSettings = allTenantSettings[tenantId];
    if (tenantSettings) {
      setSettings(tenantSettings);
    } else {
      const newSettings: StorageSettings = {
        ...defaultSettings,
        tenantId,
      };
      setSettings(newSettings);
    }
  };

  // Save settings for a specific tenant
  const saveTenantSettings = (tenantId: string, newSettings: StorageSettings) => {
    const updatedSettings = {
      ...newSettings,
      tenantId,
      updatedAt: new Date().toISOString(),
    };
    setAllTenantSettings((prev) => ({
      ...prev,
      [tenantId]: updatedSettings,
    }));
    if (tenantId === currentTenantId) {
      setSettings(updatedSettings);
    }
  };

  // Get settings for a specific tenant
  const getTenantSettings = (tenantId: string): StorageSettings => {
    return allTenantSettings[tenantId] || { ...defaultSettings, tenantId };
  };

  const updateSettings = (newSettings: Partial<StorageSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateDropboxCredentials = (credentials: Partial<DropboxCredentials>) => {
    setSettings((prev) => ({
      ...prev,
      dropbox: { ...prev.dropbox, ...credentials },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateGoogleDriveCredentials = (credentials: Partial<GoogleDriveCredentials>) => {
    setSettings((prev) => ({
      ...prev,
      googleDrive: { ...prev.googleDrive, ...credentials },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateOneDriveCredentials = (credentials: Partial<OneDriveCredentials>) => {
    setSettings((prev) => ({
      ...prev,
      oneDrive: { ...prev.oneDrive, ...credentials },
      updatedAt: new Date().toISOString(),
    }));
  };

  // User connection management (for Dropbox overflow)
  const connectUser = (userId: string, connection: UserStorageConnection) => {
    setSettings((prev) => ({
      ...prev,
      userConnections: {
        ...prev.userConnections,
        [userId]: connection,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const disconnectUser = (userId: string) => {
    setSettings((prev) => {
      const { [userId]: _, ...rest } = prev.userConnections;
      return {
        ...prev,
        userConnections: rest,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const getUserConnection = (userId: string): UserStorageConnection | null => {
    return settings.userConnections[userId] || null;
  };

  const isConfigured = (provider: StorageProviderType): boolean => {
    switch (provider) {
      case "supabase":
        return _supabaseConfigured;
      case "dropbox":
        return settings.dropbox.enabled && (
          settings.dropbox.configMode === "platform"
            ? !!process.env.NEXT_PUBLIC_DROPBOX_APP_KEY
            : !!settings.dropbox.appKey
        );
      case "google-drive":
        return settings.googleDrive.enabled && (
          settings.googleDrive.configMode === "platform"
            ? !!process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID
            : !!settings.googleDrive.clientId
        );
      case "onedrive":
        return settings.oneDrive.enabled && (
          settings.oneDrive.configMode === "platform"
            ? !!process.env.NEXT_PUBLIC_ONEDRIVE_CLIENT_ID
            : !!settings.oneDrive.clientId
        );
      case "local":
        return true;
      default:
        return false;
    }
  };

  const getAvailableProviders = (): StorageProviderType[] => {
    const providers: StorageProviderType[] = [];
    if (_supabaseConfigured) providers.push("supabase");
    if (settings.dropbox.enabled) providers.push("dropbox");
    if (settings.googleDrive.enabled) providers.push("google-drive");
    if (settings.oneDrive.enabled) providers.push("onedrive");
    providers.push("local");
    return providers;
  };

  const getDefaultProvider = (): StorageProviderType => {
    if (_supabaseConfigured) return "supabase";
    return settings.defaultProvider || "dropbox";
  };

  // ── Supabase Quota ──

  const refreshSupabaseQuota = useCallback(async () => {
    if (!_supabaseConfigured || !hybridServiceRef.current) return;
    try {
      const usage = await hybridServiceRef.current.getSupabaseUsage();
      setSupabaseQuotaUsed(usage);
    } catch {
      // Quota check failure is non-fatal
    }
  }, [_supabaseConfigured]);

  // ── Dropbox Overflow ──

  const isDropboxOverflowConnected = useCallback((userId: string): boolean => {
    const connection = settings.userConnections[userId];
    return !!(connection?.connected && connection.hasValidToken && connection.provider === "dropbox");
  }, [settings.userConnections]);

  const connectDropboxOverflow = useCallback((userId: string) => {
    // Initiate Dropbox OAuth for overflow
    const appKey = settings.dropbox.configMode === "tenant" && settings.dropbox.appKey
      ? settings.dropbox.appKey
      : process.env.NEXT_PUBLIC_DROPBOX_APP_KEY || "";

    if (!appKey) {
      console.error("Dropbox App Key not configured");
      return;
    }

    const state = btoa(JSON.stringify({
      provider: "dropbox",
      tenantId: settings.tenantId,
      userId,
      returnUrl: typeof window !== "undefined" ? window.location.pathname : "/",
      purpose: "overflow",
    }));

    const params = new URLSearchParams({
      client_id: appKey,
      redirect_uri: typeof window !== "undefined"
        ? `${window.location.origin}/api/storage/callback`
        : "/api/storage/callback",
      response_type: "code",
      token_access_type: "offline",
      state,
    });

    if (typeof window !== "undefined") {
      window.location.href = `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
    }
  }, [settings]);

  // ── Hybrid Service ──

  const getHybridService = useCallback((userId: string): HybridStorageService | null => {
    if (!_supabaseConfigured) return null;

    // Reuse if same config
    if (
      hybridServiceRef.current &&
      hybridServiceRef.current["config"]?.tenantId === (settings.tenantId || "") &&
      hybridServiceRef.current["config"]?.userId === userId
    ) {
      return hybridServiceRef.current;
    }

    const manager = getStorageManager();
    manager.setSettings(settings);

    const quotaBytes = (settings.supabaseUserQuotaMb || 100) * 1024 * 1024;
    const service = manager.getHybridService(userId, quotaBytes);

    // Connect Dropbox overflow if user has a valid connection
    if (settings.dropboxOverflowEnabled && isDropboxOverflowConnected(userId)) {
      try {
        const dropboxService = manager.getService("dropbox");
        service.connectDropbox(dropboxService);
      } catch {
        // Dropbox setup failure is non-fatal
      }
    }

    hybridServiceRef.current = service;
    return service;
  }, [_supabaseConfigured, settings, isDropboxOverflowConnected]);

  return (
    <StorageContext.Provider
      value={{
        settings,
        currentTenantId,
        allTenantSettings,
        updateSettings,
        updateDropboxCredentials,
        updateGoogleDriveCredentials,
        updateOneDriveCredentials,
        loadTenantSettings,
        saveTenantSettings,
        getTenantSettings,
        connectUser,
        disconnectUser,
        getUserConnection,
        isConfigured,
        getAvailableProviders,
        getDefaultProvider,
        // Supabase + Hybrid
        isSupabaseConfigured: _supabaseConfigured,
        supabaseQuotaUsed,
        supabaseQuotaTotal,
        isSupabaseQuotaExceeded,
        refreshSupabaseQuota,
        // Dropbox overflow
        isDropboxOverflowConnected,
        connectDropboxOverflow,
        // Hybrid service
        getHybridService,
        isInitialized,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
}
