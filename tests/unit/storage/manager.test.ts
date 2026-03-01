import { describe, expect, it, vi, beforeEach } from "vitest";
import type { StorageSettings } from "@/contexts/StorageContext";

// Hoisted mocks survive vitest's mockReset between tests
const {
  mockStorageBucket,
  mockIsSupabaseConfigured,
  mockGetSupabaseClient,
  mockResetSupabaseClient,
  mockDropboxInstance,
  mockGetDropboxService,
  mockResetDropboxService,
} = vi.hoisted(() => {
  const mockStorageBucket = {
    list: vi.fn(),
    upload: vi.fn(),
    download: vi.fn(),
    remove: vi.fn(),
    move: vi.fn(),
    copy: vi.fn(),
    createSignedUrl: vi.fn(),
  };

  const mockDropboxInstance = {
    initialize: vi.fn(),
    isInitialized: vi.fn(),
    destroy: vi.fn(),
    getAuthorizationUrl: vi.fn(),
    exchangeCodeForTokens: vi.fn(),
    refreshAccessToken: vi.fn(),
    getCurrentUser: vi.fn(),
    listFolder: vi.fn(),
    search: vi.fn(),
    getMetadata: vi.fn(),
    download: vi.fn(),
    getDownloadUrl: vi.fn(),
    upload: vi.fn(),
    deleteItem: vi.fn(),
    move: vi.fn(),
    copy: vi.fn(),
    createFolder: vi.fn(),
    createSharedLink: vi.fn(),
    revokeSharedLink: vi.fn(),
  };

  return {
    mockStorageBucket,
    mockIsSupabaseConfigured: vi.fn(),
    mockGetSupabaseClient: vi.fn(),
    mockResetSupabaseClient: vi.fn(),
    mockDropboxInstance,
    mockGetDropboxService: vi.fn(),
    mockResetDropboxService: vi.fn(),
  };
});

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: mockIsSupabaseConfigured,
  getSupabaseClient: mockGetSupabaseClient,
  resetSupabaseClient: mockResetSupabaseClient,
}));

vi.mock("@/lib/services/storage/dropbox-service", () => ({
  getDropboxService: mockGetDropboxService,
  resetDropboxService: mockResetDropboxService,
  DropboxService: vi.fn(),
}));

const mockSettings: StorageSettings = {
  tenantId: "test-school",
  schoolName: "Test School",
  dropbox: { configMode: "platform", appKey: "test-key", enabled: true },
  googleDrive: { configMode: "platform", clientId: "", enabled: false },
  oneDrive: { configMode: "platform", clientId: "", enabled: false },
  defaultProvider: "supabase",
  enableFileSharing: true,
  enableFolderSharing: true,
  maxUploadSizeMb: 100,
  supabaseUserQuotaMb: 100,
  dropboxOverflowEnabled: true,
  allowedFileTypes: [".pdf", ".doc"],
  userConnections: {},
  updatedAt: new Date().toISOString(),
};

describe("StorageManager", () => {
  let getStorageManager: typeof import("@/lib/services/storage").getStorageManager;
  let resetStorageManager: typeof import("@/lib/services/storage").resetStorageManager;

  beforeEach(async () => {
    // Re-establish mock return values (vitest mockReset clears them between tests)
    mockIsSupabaseConfigured.mockReturnValue(true);
    mockStorageBucket.list.mockResolvedValue({ data: [], error: null });
    mockStorageBucket.upload.mockResolvedValue({ data: { path: "test" }, error: null });
    mockStorageBucket.download.mockResolvedValue({ data: new Blob(), error: null });
    mockStorageBucket.remove.mockResolvedValue({ error: null });
    mockStorageBucket.move.mockResolvedValue({ error: null });
    mockStorageBucket.copy.mockResolvedValue({ error: null });
    mockStorageBucket.createSignedUrl.mockResolvedValue({ data: { signedUrl: "https://url" }, error: null });
    mockGetSupabaseClient.mockReturnValue({
      storage: { from: vi.fn().mockReturnValue(mockStorageBucket) },
    });
    mockGetDropboxService.mockReturnValue(mockDropboxInstance);
    mockDropboxInstance.isInitialized.mockReturnValue(false);

    vi.resetModules();
    const mod = await import("@/lib/services/storage");
    getStorageManager = mod.getStorageManager;
    resetStorageManager = mod.resetStorageManager;
  });

  describe("singleton pattern", () => {
    it("getStorageManager returns the same instance", () => {
      const a = getStorageManager();
      const b = getStorageManager();
      expect(a).toBe(b);
    });
  });

  describe("getService", () => {
    it("returns a service for supabase provider", () => {
      const manager = getStorageManager();
      manager.setSettings(mockSettings);
      const service = manager.getService("supabase");
      expect(service).toBeDefined();
      expect(manager.getCurrentProvider()).toBe("supabase");
    });

    it("returns a service for dropbox provider", () => {
      const manager = getStorageManager();
      manager.setSettings(mockSettings);
      const service = manager.getService("dropbox");
      expect(service).toBeDefined();
      expect(manager.getCurrentProvider()).toBe("dropbox");
    });

    it("falls back to dropbox for google-drive", () => {
      const manager = getStorageManager();
      manager.setSettings(mockSettings);
      const service = manager.getService("google-drive");
      expect(service).toBeDefined();
      expect(manager.getCurrentProvider()).toBe("dropbox");
    });

    it("throws for local provider", () => {
      const manager = getStorageManager();
      manager.setSettings(mockSettings);
      expect(() => manager.getService("local")).toThrow("not supported");
    });
  });

  describe("getHybridService", () => {
    it("returns a HybridStorageService", () => {
      const manager = getStorageManager();
      manager.setSettings(mockSettings);
      const hybrid = manager.getHybridService("user1", 100 * 1024 * 1024);
      expect(hybrid).toBeDefined();
      expect(hybrid.isInitialized()).toBe(true);
    });

    it("returns same instance for same user and tenant", () => {
      const manager = getStorageManager();
      manager.setSettings(mockSettings);
      const a = manager.getHybridService("user1", 100 * 1024 * 1024);
      const b = manager.getHybridService("user1", 100 * 1024 * 1024);
      expect(a).toBe(b);
    });
  });

  describe("isProviderConfigured", () => {
    it("returns true for supabase when configured", () => {
      const manager = getStorageManager();
      manager.setSettings(mockSettings);
      expect(manager.isProviderConfigured("supabase")).toBe(true);
    });

    it("returns true for local (always available)", () => {
      const manager = getStorageManager();
      manager.setSettings(mockSettings);
      expect(manager.isProviderConfigured("local")).toBe(true);
    });

    it("returns false when no settings loaded", () => {
      const manager = getStorageManager();
      expect(manager.isProviderConfigured("dropbox")).toBe(false);
    });
  });

  describe("getAvailableProviders", () => {
    it("includes supabase and local", () => {
      const manager = getStorageManager();
      manager.setSettings(mockSettings);
      const providers = manager.getAvailableProviders();
      expect(providers).toContain("supabase");
      expect(providers).toContain("local");
    });
  });
});
