import { describe, expect, it, vi, beforeEach } from "vitest";
import { HybridStorageService } from "@/lib/services/storage/hybrid-service";
import { StorageQuotaExceededError } from "@/lib/services/storage/errors";
import type { IStorageService, StorageUploadResult } from "@/lib/services/storage/types";

// Hoisted mocks survive vitest's mockReset between tests
const { mockStorageBucket, mockGetSupabaseClient } = vi.hoisted(() => {
  const mockStorageBucket = {
    list: vi.fn(),
    upload: vi.fn(),
    download: vi.fn(),
    remove: vi.fn(),
    move: vi.fn(),
    copy: vi.fn(),
    createSignedUrl: vi.fn(),
  };
  return {
    mockStorageBucket,
    mockGetSupabaseClient: vi.fn(),
  };
});

// Mock supabase client
vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: mockGetSupabaseClient,
  isSupabaseConfigured: vi.fn().mockReturnValue(true),
  resetSupabaseClient: vi.fn(),
}));

function makeMockDropboxService(): IStorageService {
  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    isInitialized: vi.fn().mockReturnValue(true),
    destroy: vi.fn(),
    getAuthorizationUrl: vi.fn().mockReturnValue("https://dropbox.com/auth"),
    exchangeCodeForTokens: vi.fn(),
    refreshAccessToken: vi.fn(),
    getCurrentUser: vi.fn().mockResolvedValue({
      displayName: "Test User",
      email: "test@example.com",
      quotaUsed: 1024,
      quotaTotal: 2 * 1024 * 1024 * 1024,
    }),
    listFolder: vi.fn().mockResolvedValue({
      items: [
        { id: "dbx-file-1", name: "overflow.pdf", path: "/overflow.pdf", type: "file" as const, size: 5000, modifiedAt: new Date().toISOString(), isShared: false, parentPath: "/" },
      ],
      hasMore: false,
    }),
    search: vi.fn().mockResolvedValue({ items: [], hasMore: false }),
    getMetadata: vi.fn(),
    download: vi.fn().mockResolvedValue(new Blob(["dropbox-content"])),
    getDownloadUrl: vi.fn().mockResolvedValue("https://dropbox.com/dl/file"),
    upload: vi.fn().mockResolvedValue({
      item: { id: "dbx-uploaded", name: "test.txt", path: "/test.txt", type: "file" as const, size: 100, modifiedAt: new Date().toISOString(), isShared: false, parentPath: "/" },
    } as StorageUploadResult),
    deleteItem: vi.fn().mockResolvedValue(undefined),
    move: vi.fn(),
    copy: vi.fn(),
    createFolder: vi.fn(),
    createSharedLink: vi.fn().mockResolvedValue({ sharedLink: "https://dropbox.com/share", accessLevel: "viewer" }),
    revokeSharedLink: vi.fn().mockResolvedValue(undefined),
  };
}

// Feature: HybridStorageService combining Supabase and Dropbox overflow
describe("HybridStorageService", () => {
  let service: HybridStorageService;

  beforeEach(() => {
    // Re-establish mock return values (vitest mockReset clears them between tests)
    mockStorageBucket.list.mockResolvedValue({ data: [], error: null });
    mockStorageBucket.upload.mockResolvedValue({ data: { path: "user1/test.txt" }, error: null });
    mockStorageBucket.download.mockResolvedValue({ data: new Blob(["test"]), error: null });
    mockStorageBucket.remove.mockResolvedValue({ error: null });
    mockStorageBucket.move.mockResolvedValue({ error: null });
    mockStorageBucket.copy.mockResolvedValue({ error: null });
    mockStorageBucket.createSignedUrl.mockResolvedValue({ data: { signedUrl: "https://signed.url" }, error: null });

    mockGetSupabaseClient.mockReturnValue({
      storage: { from: vi.fn().mockReturnValue(mockStorageBucket) },
    });

    service = new HybridStorageService({
      tenantId: "test-tenant",
      userId: "user1",
      quotaBytes: 100 * 1024 * 1024, // 100 MB
    });
  });

  describe("initialization", () => {
    // Scenario: Service is initialized by default since Supabase needs no OAuth
    it("is initialized by default (Supabase needs no OAuth)", () => {
      // Then the service should report as initialized
      expect(service.isInitialized()).toBe(true);
    });

    // Scenario: Dropbox is not connected by default
    it("reports Dropbox not connected by default", () => {
      // Then Dropbox should not be connected
      expect(service.isDropboxConnected()).toBe(false);
    });

    // Scenario: Connecting Dropbox overflow provider
    it("connects Dropbox overflow", () => {
      // When Dropbox service is connected
      service.connectDropbox(makeMockDropboxService());

      // Then Dropbox should be reported as connected
      expect(service.isDropboxConnected()).toBe(true);
    });

    // Scenario: Disconnecting Dropbox overflow provider
    it("disconnects Dropbox overflow", () => {
      // Given Dropbox is connected
      service.connectDropbox(makeMockDropboxService());

      // When Dropbox is disconnected
      service.disconnectDropbox();

      // Then Dropbox should no longer be connected
      expect(service.isDropboxConnected()).toBe(false);
    });
  });

  describe("quota management", () => {
    // Scenario: Retrieving configured quota
    it("returns configured quota bytes", () => {
      // Then the quota should match the configured value
      expect(service.getQuotaBytes()).toBe(100 * 1024 * 1024);
    });

    // Scenario: Getting Supabase storage usage
    it("getSupabaseUsage returns a number", async () => {
      // When Supabase usage is retrieved
      const usage = await service.getSupabaseUsage();

      // Then the result should be a number
      expect(typeof usage).toBe("number");
    });

    // Scenario: Usage results are cached
    it("caches usage results", async () => {
      // When Supabase usage is retrieved twice
      const usage1 = await service.getSupabaseUsage();
      const usage2 = await service.getSupabaseUsage();

      // Then both calls should return the same value
      expect(usage1).toBe(usage2);
    });

    // Scenario: Invalidating cache does not throw
    it("invalidateCache does not throw", () => {
      // When the cache is invalidated
      service.invalidateCache();

      // Then no error should be thrown
      expect(true).toBe(true);
    });
  });

  describe("upload routing", () => {
    // Scenario: Uploading a file when under quota routes to Supabase
    it("uploads to Supabase when under quota", async () => {
      // Given a small file within quota limits
      const file = new File(["hello"], "test.txt", { type: "text/plain" });

      // When the file is uploaded
      const result = await service.upload({ path: "/test.txt", file });

      // Then the result should be a Supabase-prefixed item
      expect(result.item).toBeDefined();
      expect(result.item.id).toContain("supabase:");
    });

    // Scenario: Uploading over quota without Dropbox throws error
    it("throws StorageQuotaExceededError when over quota and no Dropbox", async () => {
      // Given a service with a 1-byte quota and no Dropbox connected
      const tinyService = new HybridStorageService({
        tenantId: "test-tenant",
        userId: "user1",
        quotaBytes: 1, // 1 byte
      });

      // When a file larger than the quota is uploaded
      const file = new File(["hello world content"], "test.txt", { type: "text/plain" });

      // Then a StorageQuotaExceededError should be thrown
      await expect(tinyService.upload({ path: "/test.txt", file })).rejects.toThrow(StorageQuotaExceededError);
    });

    // Scenario: Uploading over quota with Dropbox connected routes to Dropbox
    it("uploads to Dropbox when over quota and Dropbox connected", async () => {
      // Given a service with a 1-byte quota and Dropbox connected
      const tinyService = new HybridStorageService({
        tenantId: "test-tenant",
        userId: "user1",
        quotaBytes: 1,
      });
      const mockDropbox = makeMockDropboxService();
      tinyService.connectDropbox(mockDropbox);

      // When a file larger than the quota is uploaded
      const file = new File(["hello world content"], "test.txt", { type: "text/plain" });
      const result = await tinyService.upload({ path: "/test.txt", file });

      // Then the upload should be delegated to Dropbox
      expect(mockDropbox.upload).toHaveBeenCalled();
      // And the result should be a Dropbox-prefixed item
      expect(result.item.id).toContain("dropbox:");
    });

    // Scenario: Uploading with unlimited quota (0) skips quota check
    it("skips quota check when quotaBytes is 0 (unlimited)", async () => {
      // Given a service with unlimited quota (0 bytes)
      const unlimited = new HybridStorageService({
        tenantId: "test-tenant",
        userId: "user1",
        quotaBytes: 0,
      });

      // When a file is uploaded
      const file = new File(["hello"], "test.txt", { type: "text/plain" });
      const result = await unlimited.upload({ path: "/test.txt", file });

      // Then the upload should succeed
      expect(result.item).toBeDefined();
    });
  });

  describe("listing", () => {
    // Scenario: Listing items when no Dropbox is connected
    it("lists Supabase items when no Dropbox", async () => {
      // When listing the root folder
      const result = await service.listFolder("/");

      // Then the result should contain an array of items
      expect(result).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });

    // Scenario: Listing items merges Dropbox items when connected
    it("merges Dropbox items when connected", async () => {
      // Given Dropbox is connected
      service.connectDropbox(makeMockDropboxService());

      // When listing the root folder
      const result = await service.listFolder("/");

      // Then the result should include Dropbox-prefixed items
      expect(result).toBeDefined();
      const dropboxItems = result.items.filter((i) => i.id.startsWith("dropbox:"));
      expect(dropboxItems.length).toBeGreaterThan(0);
    });

    // Scenario: Listing falls back to Supabase results when Dropbox fails
    it("returns Supabase results when Dropbox listing fails", async () => {
      // Given Dropbox is connected but its listFolder rejects
      const mockDropbox = makeMockDropboxService();
      (mockDropbox.listFolder as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("fail"));
      service.connectDropbox(mockDropbox);

      // When listing the root folder
      const result = await service.listFolder("/");

      // Then Supabase results should still be returned
      expect(result).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  describe("OAuth delegation", () => {
    // Scenario: Getting authorization URL without Dropbox throws
    it("throws when no Dropbox for getAuthorizationUrl", () => {
      // When getAuthorizationUrl is called without Dropbox connected
      // Then it should throw an error about no overflow provider
      expect(() => service.getAuthorizationUrl("state")).toThrow("No overflow provider configured");
    });

    // Scenario: Getting authorization URL delegates to Dropbox
    it("delegates getAuthorizationUrl to Dropbox", () => {
      // Given Dropbox is connected
      const mockDropbox = makeMockDropboxService();
      service.connectDropbox(mockDropbox);

      // When getAuthorizationUrl is called
      // Then it should return the Dropbox authorization URL
      expect(service.getAuthorizationUrl("test")).toBe("https://dropbox.com/auth");
    });

    // Scenario: Exchanging code without Dropbox throws
    it("throws when no Dropbox for exchangeCodeForTokens", async () => {
      // When exchangeCodeForTokens is called without Dropbox connected
      // Then it should reject with an error about no overflow provider
      await expect(service.exchangeCodeForTokens("code")).rejects.toThrow("No overflow provider configured");
    });

    // Scenario: Refreshing token without Dropbox throws
    it("throws when no Dropbox for refreshAccessToken", async () => {
      // When refreshAccessToken is called without Dropbox connected
      // Then it should reject with an error about no overflow provider
      await expect(service.refreshAccessToken("token")).rejects.toThrow("No overflow provider configured");
    });
  });

  describe("sharing", () => {
    // Scenario: Creating a shared link for a file
    it("creates shared link", async () => {
      // When a shared link is created for a file
      const result = await service.createSharedLink({ path: "/test.pdf", access: "viewer" });

      // Then the result should contain a shared link URL
      expect(result.sharedLink).toBeDefined();
    });
  });

  describe("folder creation", () => {
    // Scenario: Creating a folder in Supabase
    it("creates folder in Supabase", async () => {
      // When a folder is created
      const result = await service.createFolder("/new-folder");

      // Then the result should be a folder item
      expect(result).toBeDefined();
      expect(result.type).toBe("folder");
    });
  });

  describe("download fallback", () => {
    // Scenario: Downloading a file from Supabase
    it("downloads from Supabase", async () => {
      // When a file is downloaded
      const blob = await service.download("/test.txt");

      // Then the result should be defined
      expect(blob).toBeDefined();
    });
  });

  describe("cleanup", () => {
    // Scenario: Destroying the service cleans up Dropbox
    it("destroys Dropbox service on destroy()", () => {
      // Given Dropbox is connected
      const mockDropbox = makeMockDropboxService();
      service.connectDropbox(mockDropbox);

      // When the service is destroyed
      service.destroy();

      // Then the Dropbox service should be destroyed
      expect(mockDropbox.destroy).toHaveBeenCalled();
    });
  });
});
