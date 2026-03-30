import { describe, it, expect, beforeEach, vi } from "vitest";
import { permissionRequests } from "@/lib/permission-requests";

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });

const baseRequest = {
  presentationId: "pres-123",
  presentationTitle: "Test Presentation",
  permission: "copy" as const,
  requesterUsername: "john.doe",
  requesterFullName: "John Doe",
  requesterEmail: "john@school.edu",
  ownerUsername: "admin",
  ownerFullName: "System Admin",
};

describe("permission-requests", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("request()", () => {
    it("creates a permission request with pending status", () => {
      const req = permissionRequests.request(baseRequest);
      expect(req.id).toMatch(/^req-/);
      expect(req.status).toBe("pending");
      expect(req.permission).toBe("copy");
      expect(req.requesterFullName).toBe("John Doe");
    });

    it("creates a notification for the owner", () => {
      permissionRequests.request(baseRequest);
      const notifs = permissionRequests.getNotificationsFor("admin");
      expect(notifs.length).toBe(1);
      expect(notifs[0].type).toBe("request");
      expect(notifs[0].message).toContain("John Doe");
      expect(notifs[0].message).toContain("Copy");
    });

    it("prevents duplicate pending requests", () => {
      const req1 = permissionRequests.request(baseRequest);
      const req2 = permissionRequests.request(baseRequest);
      expect(req1.id).toBe(req2.id);
    });

    it("allows request for different permission types", () => {
      const req1 = permissionRequests.request(baseRequest);
      const req2 = permissionRequests.request({ ...baseRequest, permission: "print" });
      expect(req1.id).not.toBe(req2.id);
    });
  });

  describe("approve()", () => {
    it("changes request status to approved", () => {
      const req = permissionRequests.request(baseRequest);
      permissionRequests.approve(req.id);
      const updated = permissionRequests.getByRequester("john.doe");
      expect(updated[0].status).toBe("approved");
      expect(updated[0].respondedAt).toBeDefined();
    });

    it("sends approval notification to requester", () => {
      const req = permissionRequests.request(baseRequest);
      permissionRequests.approve(req.id);
      const notifs = permissionRequests.getNotificationsFor("john.doe");
      expect(notifs.length).toBe(1);
      expect(notifs[0].type).toBe("approved");
      expect(notifs[0].message).toContain("granted");
    });
  });

  describe("deny()", () => {
    it("changes request status to denied", () => {
      const req = permissionRequests.request(baseRequest);
      permissionRequests.deny(req.id);
      const updated = permissionRequests.getByRequester("john.doe");
      expect(updated[0].status).toBe("denied");
    });

    it("sends denial notification to requester", () => {
      const req = permissionRequests.request(baseRequest);
      permissionRequests.deny(req.id);
      const notifs = permissionRequests.getNotificationsFor("john.doe");
      expect(notifs.length).toBe(1);
      expect(notifs[0].type).toBe("denied");
      expect(notifs[0].message).toContain("denied");
    });
  });

  describe("hasPermission()", () => {
    it("returns false when no approved request exists", () => {
      expect(permissionRequests.hasPermission("pres-123", "copy", "john.doe")).toBe(false);
    });

    it("returns true after request is approved", () => {
      const req = permissionRequests.request(baseRequest);
      permissionRequests.approve(req.id);
      expect(permissionRequests.hasPermission("pres-123", "copy", "john.doe")).toBe(true);
    });

    it("returns false after request is denied", () => {
      const req = permissionRequests.request(baseRequest);
      permissionRequests.deny(req.id);
      expect(permissionRequests.hasPermission("pres-123", "copy", "john.doe")).toBe(false);
    });
  });

  describe("getPendingForPresentation()", () => {
    it("returns only pending requests for a presentation", () => {
      const req1 = permissionRequests.request(baseRequest);
      permissionRequests.request({ ...baseRequest, permission: "print" });
      permissionRequests.approve(req1.id);
      const pending = permissionRequests.getPendingForPresentation("pres-123");
      expect(pending.length).toBe(1);
      expect(pending[0].permission).toBe("print");
    });
  });

  describe("notifications", () => {
    it("tracks unread count", () => {
      permissionRequests.request(baseRequest);
      expect(permissionRequests.getUnreadCount("admin")).toBe(1);
    });

    it("marks notification as read", () => {
      permissionRequests.request(baseRequest);
      const notifs = permissionRequests.getNotificationsFor("admin");
      permissionRequests.markRead(notifs[0].id);
      expect(permissionRequests.getUnreadCount("admin")).toBe(0);
    });
  });
});
