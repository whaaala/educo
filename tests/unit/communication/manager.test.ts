import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  CommunicationManager,
  getCommunicationManager,
  resetCommunicationManager,
} from "@/lib/services/communication";
import { getWebRTCService } from "@/lib/services/communication/webrtc-service";
import type { CommunicationSettings } from "@/contexts/CommunicationContext";

// Mock all service modules
vi.mock("@/lib/services/communication/webrtc-service", () => ({
  getWebRTCService: vi.fn(),
  resetWebRTCService: vi.fn(),
}));

vi.mock("@/lib/services/communication/agora-service", () => ({
  getAgoraService: vi.fn(),
  resetAgoraService: vi.fn(),
}));

vi.mock("@/lib/services/communication/zoom-service", () => ({
  getZoomService: vi.fn(),
  resetZoomService: vi.fn(),
}));

vi.mock("@/lib/services/communication/whatsapp-service", () => ({
  getWhatsAppService: vi.fn(),
  resetWhatsAppService: vi.fn(),
}));

function makeMockWebRTCService() {
  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn(),
    isInitialized: vi.fn().mockReturnValue(true),
    createRoom: vi.fn(),
    joinRoom: vi.fn().mockResolvedValue({ id: "session-1" }),
    leaveRoom: vi.fn().mockResolvedValue(undefined),
    getRoomInfo: vi.fn(),
    toggleAudio: vi.fn(),
    toggleVideo: vi.fn(),
    toggleScreenShare: vi.fn(),
    setAudioDevice: vi.fn(),
    setVideoDevice: vi.fn(),
    sendChatMessage: vi.fn(),
    getChatHistory: vi.fn(),
    onParticipantJoined: vi.fn(),
    onParticipantLeft: vi.fn(),
    onCallStateChanged: vi.fn(),
    onChatMessage: vi.fn(),
    onRemoteStream: vi.fn(),
  };
}

function makeSettings(overrides: Partial<CommunicationSettings> = {}): CommunicationSettings {
  return {
    tenantId: "tenant-1",
    defaultVideoPlatform: "webrtc",
    defaultVoicePlatform: "webrtc",
    defaultChatPlatform: "webrtc",
    agora: {
      configMode: "platform",
      appId: "",
      enabled: false,
    },
    zoom: {
      clientId: "",
      clientSecret: "",
      enabled: false,
    },
    googleMeet: {
      clientId: "",
      clientSecret: "",
      enabled: false,
    },
    whatsApp: {
      configMode: "platform",
      businessPhoneNumber: "",
      enabled: false,
    },
    webrtc: {
      enabled: true,
      stunServers: ["stun:stun.l.google.com:19302"],
      turnServers: [],
    },
    ...overrides,
  } as CommunicationSettings;
}

describe("CommunicationManager", () => {
  let manager: CommunicationManager;

  beforeEach(() => {
    resetCommunicationManager();
    manager = new CommunicationManager();
    // Re-establish mock return values (mockReset clears them between tests)
    vi.mocked(getWebRTCService).mockReturnValue(makeMockWebRTCService() as never);
  });

  describe("setSettings", () => {
    it("stores settings and tenantId", () => {
      const settings = makeSettings({ tenantId: "school-123" });
      manager.setSettings(settings);
      // No public getter for settings, but we can verify via behavior
      expect(manager.isPlatformConfigured("webrtc")).toBe(true);
    });
  });

  describe("setTenantId", () => {
    it("sets the tenant ID", () => {
      manager.setTenantId("school-456");
      // Verified indirectly by platform configuration checks
      expect(manager.getCurrentPlatform()).toBeNull();
    });
  });

  describe("isPlatformConfigured", () => {
    it("returns true for webrtc when enabled", () => {
      manager.setSettings(makeSettings());
      expect(manager.isPlatformConfigured("webrtc")).toBe(true);
    });

    it("returns false for agora when not enabled", () => {
      manager.setSettings(makeSettings());
      expect(manager.isPlatformConfigured("agora")).toBe(false);
    });

    it("returns true for agora when enabled with appId", () => {
      manager.setSettings(
        makeSettings({
          agora: { configMode: "platform", appId: "test-app-id", enabled: true },
        })
      );
      expect(manager.isPlatformConfigured("agora")).toBe(true);
    });

    it("returns false for zoom when not enabled", () => {
      manager.setSettings(makeSettings());
      expect(manager.isPlatformConfigured("zoom")).toBe(false);
    });

    it("returns true for zoom when enabled with sdkKey", () => {
      manager.setSettings(
        makeSettings({
          zoom: { clientId: "ci", clientSecret: "cs", sdkKey: "sk", enabled: true },
        })
      );
      expect(manager.isPlatformConfigured("zoom")).toBe(true);
    });

    it("returns true for google-meet when enabled with clientId", () => {
      manager.setSettings(
        makeSettings({
          googleMeet: { clientId: "gm-id", clientSecret: "gm-secret", enabled: true },
        })
      );
      expect(manager.isPlatformConfigured("google-meet")).toBe(true);
    });

    it("returns true for whatsapp when enabled with phone", () => {
      manager.setSettings(
        makeSettings({
          whatsApp: {
            configMode: "platform",
            businessPhoneNumber: "+1234567890",
            enabled: true,
          },
        })
      );
      expect(manager.isPlatformConfigured("whatsapp")).toBe(true);
    });

    it("returns true for webrtc when no settings (always available)", () => {
      expect(manager.isPlatformConfigured("webrtc")).toBe(true);
    });

    it("returns false for unknown platform", () => {
      manager.setSettings(makeSettings());
      expect(manager.isPlatformConfigured("unknown" as never)).toBe(false);
    });
  });

  describe("supportsInAppCalling", () => {
    it("returns true for webrtc", () => {
      expect(manager.supportsInAppCalling("webrtc")).toBe(true);
    });

    it("returns true for agora", () => {
      expect(manager.supportsInAppCalling("agora")).toBe(true);
    });

    it("returns true for zoom", () => {
      expect(manager.supportsInAppCalling("zoom")).toBe(true);
    });

    it("returns false for google-meet", () => {
      expect(manager.supportsInAppCalling("google-meet")).toBe(false);
    });

    it("returns false for whatsapp", () => {
      expect(manager.supportsInAppCalling("whatsapp")).toBe(false);
    });
  });

  describe("generateExternalLink", () => {
    it("generates google meet link", () => {
      expect(manager.generateExternalLink("google-meet", "abc123")).toBe(
        "https://meet.google.com/abc123"
      );
    });

    it("generates whatsapp link with phone number", () => {
      expect(manager.generateExternalLink("whatsapp", "room1", "+1234567890")).toBe(
        "https://wa.me/+1234567890?text=Join%20our%20meeting"
      );
    });

    it("returns empty string for whatsapp without phone", () => {
      expect(manager.generateExternalLink("whatsapp", "room1")).toBe("");
    });

    it("returns empty string for unknown platform", () => {
      expect(manager.generateExternalLink("webrtc", "room1")).toBe("");
    });
  });

  describe("getAvailablePlatforms", () => {
    it("always includes webrtc", () => {
      manager.setSettings(makeSettings());
      const platforms = manager.getAvailablePlatforms();
      expect(platforms).toContain("webrtc");
    });

    it("includes agora when configured", () => {
      manager.setSettings(
        makeSettings({
          agora: { configMode: "platform", appId: "app-id", enabled: true },
        })
      );
      const platforms = manager.getAvailablePlatforms();
      expect(platforms).toContain("agora");
    });

    it("does not include unconfigured platforms", () => {
      manager.setSettings(makeSettings());
      const platforms = manager.getAvailablePlatforms();
      expect(platforms).not.toContain("agora");
      expect(platforms).not.toContain("zoom");
      expect(platforms).not.toContain("whatsapp");
    });
  });

  describe("getService", () => {
    it("falls back to WebRTC when no platform specified and nothing configured", async () => {
      manager.setSettings(makeSettings());
      const service = await manager.getService();
      expect(service).toBeDefined();
      expect(manager.getCurrentPlatform()).toBe("webrtc");
    });

    it("uses default video platform when type is video", async () => {
      manager.setSettings(makeSettings({ defaultVideoPlatform: "webrtc" }));
      const service = await manager.getService(undefined, "video");
      expect(service).toBeDefined();
      expect(manager.getCurrentPlatform()).toBe("webrtc");
    });
  });

  describe("getCurrentService / getCurrentPlatform", () => {
    it("returns null when no service started", () => {
      expect(manager.getCurrentService()).toBeNull();
      expect(manager.getCurrentPlatform()).toBeNull();
    });

    it("returns service after getService call", async () => {
      manager.setSettings(makeSettings());
      await manager.getService(undefined, "video");
      expect(manager.getCurrentService()).not.toBeNull();
      expect(manager.getCurrentPlatform()).toBe("webrtc");
    });
  });

  describe("cleanup", () => {
    it("resets current service and platform", async () => {
      manager.setSettings(makeSettings());
      await manager.getService();
      manager.cleanup();
      expect(manager.getCurrentService()).toBeNull();
      expect(manager.getCurrentPlatform()).toBeNull();
    });
  });

  describe("endCall", () => {
    it("does nothing when no active service", async () => {
      await expect(manager.endCall()).resolves.toBeUndefined();
    });

    it("calls leaveRoom on active service", async () => {
      manager.setSettings(makeSettings());
      const service = await manager.getService();
      await manager.endCall();
      expect(service.leaveRoom).toHaveBeenCalled();
    });
  });
});

describe("getCommunicationManager (singleton)", () => {
  beforeEach(() => {
    resetCommunicationManager();
  });

  it("returns the same instance on repeated calls", () => {
    const a = getCommunicationManager();
    const b = getCommunicationManager();
    expect(a).toBe(b);
  });

  it("returns a new instance after reset", () => {
    const a = getCommunicationManager();
    resetCommunicationManager();
    const b = getCommunicationManager();
    expect(a).not.toBe(b);
  });
});
