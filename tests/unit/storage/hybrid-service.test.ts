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
    it("is initialized by default (Supabase needs no OAuth)", () => {
      expect(service.isInitialized()).toBe(true);
    });

    it("reports Dropbox not connected by default", () => {
      expect(service.isDropboxConnected()).toBe(false);
    });

    it("connects Dropbox overflow", () => {
      service.connectDropbox(makeMockDropboxService());
      expect(service.isDropboxConnected()).toBe(true);
    });

    it("disconnects Dropbox overflow", () => {
      service.connectDropbox(makeMockDropboxService());
      service.disconnectDropbox();
      expect(service.isDropboxConnected()).toBe(false);
    });
  });

  describe("quota management", () => {
    it("returns configured quota bytes", () => {
      expect(service.getQuotaBytes()).toBe(100 * 1024 * 1024);
    });

    it("getSupabaseUsage returns a number", async () => {
      const usage = await service.getSupabaseUsage();
      expect(typeof usage).toBe("number");
    });

    it("caches usage results", async () => {
      const usage1 = await service.getSupabaseUsage();
      const usage2 = await service.getSupabaseUsage();
      expect(usage1).toBe(usage2);
    });

    it("invalidateCache does not throw", () => {
      service.invalidateCache();
      expect(true).toBe(true);
    });
  });

  describe("upload routing", () => {
    it("uploads to Supabase when under quota", async () => {
      const file = new File(["hello"], "test.txt", { type: "text/plain" });
      const result = await service.upload({ path: "/test.txt", file });
      expect(result.item).toBeDefined();
      expect(result.item.id).toContain("supabase:");
    });

    it("throws StorageQuotaExceededError when over quota and no Dropbox", async () => {
      const tinyService = new HybridStorageService({
        tenantId: "test-tenant",
        userId: "user1",
        quotaBytes: 1, // 1 byte
      });

      const file = new File(["hello world content"], "test.txt", { type: "text/plain" });
      await expect(tinyService.upload({ path: "/test.txt", file })).rejects.toThrow(StorageQuotaExceededError);
    });

    it("uploads to Dropbox when over quota and Dropbox connected", async () => {
      const tinyService = new HybridStorageService({
        tenantId: "test-tenant",
        userId: "user1",
        quotaBytes: 1,
      });

      const mockDropbox = makeMockDropboxService();
      tinyService.connectDropbox(mockDropbox);

      const file = new File(["hello world content"], "test.txt", { type: "text/plain" });
      const result = await tinyService.upload({ path: "/test.txt", file });
      expect(mockDropbox.upload).toHaveBeenCalled();
      expect(result.item.id).toContain("dropbox:");
    });

    it("skips quota check when quotaBytes is 0 (unlimited)", async () => {
      const unlimited = new HybridStorageService({
        tenantId: "test-tenant",
        userId: "user1",
        quotaBytes: 0,
      });

      const file = new File(["hello"], "test.txt", { type: "text/plain" });
      const result = await unlimited.upload({ path: "/test.txt", file });
      expect(result.item).toBeDefined();
    });
  });

  describe("listing", () => {
    it("lists Supabase items when no Dropbox", async () => {
      const result = await service.listFolder("/");
      expect(result).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("merges Dropbox items when connected", async () => {
      service.connectDropbox(makeMockDropboxService());
      const result = await service.listFolder("/");
      expect(result).toBeDefined();

      const dropboxItems = result.items.filter((i) => i.id.startsWith("dropbox:"));
      expect(dropboxItems.length).toBeGreaterThan(0);
    });

    it("returns Supabase results when Dropbox listing fails", async () => {
      const mockDropbox = makeMockDropboxService();
      (mockDropbox.listFolder as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("fail"));
      service.connectDropbox(mockDropbox);

      const result = await service.listFolder("/");
      expect(result).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  describe("OAuth delegation", () => {
    it("throws when no Dropbox for getAuthorizationUrl", () => {
      expect(() => service.getAuthorizationUrl("state")).toThrow("No overflow provider configured");
    });

    it("delegates getAuthorizationUrl to Dropbox", () => {
      const mockDropbox = makeMockDropboxService();
      service.connectDropbox(mockDropbox);
      expect(service.getAuthorizationUrl("test")).toBe("https://dropbox.com/auth");
    });

    it("throws when no Dropbox for exchangeCodeForTokens", async () => {
      await expect(service.exchangeCodeForTokens("code")).rejects.toThrow("No overflow provider configured");
    });

    it("throws when no Dropbox for refreshAccessToken", async () => {
      await expect(service.refreshAccessToken("token")).rejects.toThrow("No overflow provider configured");
    });
  });

  describe("sharing", () => {
    it("creates shared link", async () => {
      const result = await service.createSharedLink({ path: "/test.pdf", access: "viewer" });
      expect(result.sharedLink).toBeDefined();
    });
  });

  describe("folder creation", () => {
    it("creates folder in Supabase", async () => {
      const result = await service.createFolder("/new-folder");
      expect(result).toBeDefined();
      expect(result.type).toBe("folder");
    });
  });

  describe("download fallback", () => {
    it("downloads from Supabase", async () => {
      const blob = await service.download("/test.txt");
      expect(blob).toBeDefined();
    });
  });

  describe("cleanup", () => {
    it("destroys Dropbox service on destroy()", () => {
      const mockDropbox = makeMockDropboxService();
      service.connectDropbox(mockDropbox);
      service.destroy();
      expect(mockDropbox.destroy).toHaveBeenCalled();
    });
  });
});
