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

// Feature: StorageManager singleton for managing storage providers
describe("StorageManager", () => {
  let getStorageManager: typeof import("@/lib/services/storage").getStorageManager;
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
  });

  describe("singleton pattern", () => {
    // Scenario: Manager returns the same instance on repeated calls
    it("getStorageManager returns the same instance", () => {
      // When getStorageManager is called twice
      const a = getStorageManager();
      const b = getStorageManager();

      // Then both references should be the same instance
      expect(a).toBe(b);
    });
  });

  describe("getService", () => {
    // Scenario: Getting a service for the supabase provider
    it("returns a service for supabase provider", () => {
      // Given a manager with settings configured
      const manager = getStorageManager();
      manager.setSettings(mockSettings);

      // When a supabase service is requested
      const service = manager.getService("supabase");

      // Then a service should be returned
      expect(service).toBeDefined();
      // And the current provider should be supabase
      expect(manager.getCurrentProvider()).toBe("supabase");
    });

    // Scenario: Getting a service for the dropbox provider
    it("returns a service for dropbox provider", () => {
      // Given a manager with settings configured
      const manager = getStorageManager();
      manager.setSettings(mockSettings);

      // When a dropbox service is requested
      const service = manager.getService("dropbox");

      // Then a service should be returned
      expect(service).toBeDefined();
      // And the current provider should be dropbox
      expect(manager.getCurrentProvider()).toBe("dropbox");
    });

    // Scenario: Google Drive falls back to dropbox
    it("falls back to dropbox for google-drive", () => {
      // Given a manager with settings configured
      const manager = getStorageManager();
      manager.setSettings(mockSettings);

      // When a google-drive service is requested
      const service = manager.getService("google-drive");

      // Then a service should be returned
      expect(service).toBeDefined();
      // And the current provider should fall back to dropbox
      expect(manager.getCurrentProvider()).toBe("dropbox");
    });

    // Scenario: Local provider is not supported
    it("throws for local provider", () => {
      // Given a manager with settings configured
      const manager = getStorageManager();
      manager.setSettings(mockSettings);

      // When a local service is requested
      // Then it should throw an error
      expect(() => manager.getService("local")).toThrow("not supported");
    });
  });

  describe("getHybridService", () => {
    // Scenario: Getting a HybridStorageService instance
    it("returns a HybridStorageService", () => {
      // Given a manager with settings configured
      const manager = getStorageManager();
      manager.setSettings(mockSettings);

      // When a hybrid service is requested for a user
      const hybrid = manager.getHybridService("user1", 100 * 1024 * 1024);

      // Then the hybrid service should be defined and initialized
      expect(hybrid).toBeDefined();
      expect(hybrid.isInitialized()).toBe(true);
    });

    // Scenario: Hybrid service is cached per user and tenant
    it("returns same instance for same user and tenant", () => {
      // Given a manager with settings configured
      const manager = getStorageManager();
      manager.setSettings(mockSettings);

      // When a hybrid service is requested twice for the same user
      const a = manager.getHybridService("user1", 100 * 1024 * 1024);
      const b = manager.getHybridService("user1", 100 * 1024 * 1024);

      // Then both references should be the same instance
      expect(a).toBe(b);
    });
  });

  describe("isProviderConfigured", () => {
    // Scenario: Supabase is configured when settings are loaded
    it("returns true for supabase when configured", () => {
      // Given a manager with settings configured
      const manager = getStorageManager();
      manager.setSettings(mockSettings);

      // Then supabase should be reported as configured
      expect(manager.isProviderConfigured("supabase")).toBe(true);
    });

    // Scenario: Local provider is always available
    it("returns true for local (always available)", () => {
      // Given a manager with settings configured
      const manager = getStorageManager();
      manager.setSettings(mockSettings);

      // Then local should be reported as configured
      expect(manager.isProviderConfigured("local")).toBe(true);
    });

    // Scenario: Provider is not configured when no settings are loaded
    it("returns false when no settings loaded", () => {
      // Given a manager without settings
      const manager = getStorageManager();

      // Then dropbox should not be reported as configured
      expect(manager.isProviderConfigured("dropbox")).toBe(false);
    });
  });

  describe("getAvailableProviders", () => {
    // Scenario: Available providers include supabase and local
    it("includes supabase and local", () => {
      // Given a manager with settings configured
      const manager = getStorageManager();
      manager.setSettings(mockSettings);

      // When available providers are retrieved
      const providers = manager.getAvailableProviders();

      // Then the list should include supabase and local
      expect(providers).toContain("supabase");
      expect(providers).toContain("local");
    });
  });
});
