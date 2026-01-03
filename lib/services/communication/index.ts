// Communication Services - Export all services and types

export * from "./types";
export * from "./webrtc-service";
export * from "./agora-service";
export * from "./zoom-service";
export * from "./whatsapp-service";

import { CommunicationPlatform, CommunicationSettings } from "@/contexts/CommunicationContext";
import { CallOptions, CallSession, ICommunicationService } from "./types";
import { getWebRTCService, resetWebRTCService } from "./webrtc-service";
import { getAgoraService, resetAgoraService, AgoraConfig } from "./agora-service";
import { getZoomService, resetZoomService, ZoomConfig } from "./zoom-service";
import { getWhatsAppService, resetWhatsAppService, WhatsAppConfig } from "./whatsapp-service";

// Communication Manager - Handles platform switching and service management
// Supports both platform-wide (single App ID) and per-tenant (per-school App ID) configurations
export class CommunicationManager {
  private settings: CommunicationSettings | null = null;
  private currentService: ICommunicationService | null = null;
  private currentPlatform: CommunicationPlatform | null = null;
  private tenantId: string | null = null;

  setSettings(settings: CommunicationSettings): void {
    this.settings = settings;
    this.tenantId = settings.tenantId || null;
  }

  setTenantId(tenantId: string): void {
    this.tenantId = tenantId;
  }

  // Get the best service based on settings and requested type
  // Priority: Agora (if configured) > Zoom (if configured) > WebRTC (always available)
  async getService(
    platform?: CommunicationPlatform,
    type?: "video" | "voice" | "chat"
  ): Promise<ICommunicationService> {
    // If platform is specified, use it
    if (platform) {
      return this.getServiceForPlatform(platform);
    }

    // Otherwise, use default based on type or settings
    if (this.settings) {
      if (type === "video" && this.settings.defaultVideoPlatform) {
        return this.getServiceForPlatform(this.settings.defaultVideoPlatform);
      }
      if (type === "voice" && this.settings.defaultVoicePlatform) {
        return this.getServiceForPlatform(this.settings.defaultVoicePlatform);
      }
      if (type === "chat" && this.settings.defaultChatPlatform) {
        return this.getServiceForPlatform(this.settings.defaultChatPlatform);
      }
    }

    // Smart fallback: Try Agora first, then WebRTC
    if (this.isPlatformConfigured("agora")) {
      return this.getServiceForPlatform("agora");
    }

    // Fallback to WebRTC (always available)
    return this.getServiceForPlatform("webrtc");
  }

  // Get the token server URL (for Agora authentication)
  private getTokenServerUrl(): string {
    // Use the internal API route for token generation
    // This supports both platform-wide and per-tenant configurations
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/api/agora/token`;
  }

  private async getServiceForPlatform(platform: CommunicationPlatform): Promise<ICommunicationService> {
    switch (platform) {
      case "agora": {
        if (!this.settings?.agora.enabled) {
          console.warn("Agora not enabled, falling back to WebRTC");
          return getWebRTCService();
        }

        // Determine App ID based on config mode
        let appId = this.settings.agora.appId;
        let appCertificate = this.settings.agora.appCertificate;
        let tokenServerUrl = this.settings.agora.tokenServerUrl || this.getTokenServerUrl();

        // If platform mode and no tenant-specific credentials, use platform credentials
        if (this.settings.agora.configMode === "platform" && !appId) {
          // Platform credentials are stored in environment variables
          // The token server will use these automatically
          appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || "";
        }

        if (!appId) {
          console.warn("Agora App ID not configured, falling back to WebRTC");
          return getWebRTCService();
        }

        const config: AgoraConfig = {
          appId,
          appCertificate,
          tokenServerUrl,
          useRtm: true, // Enable RTM for chat
        };

        console.log(`[CommunicationManager] Using Agora in ${this.settings.agora.configMode} mode`);

        const service = getAgoraService(config);
        await service.initialize();
        this.currentService = service;
        this.currentPlatform = "agora";
        return service;
      }

      case "zoom": {
        if (!this.settings?.zoom.enabled || !this.settings.zoom.sdkKey) {
          console.warn("Zoom not configured, falling back to WebRTC");
          return getWebRTCService();
        }
        const config: ZoomConfig = {
          sdkKey: this.settings.zoom.sdkKey,
          sdkSecret: this.settings.zoom.sdkSecret || "",
        };
        const service = getZoomService(config);
        await service.initialize();
        this.currentService = service;
        this.currentPlatform = "zoom";
        return service;
      }

      case "google-meet": {
        // Google Meet doesn't support embedded meetings
        // We'll create a link and open in new tab
        console.log("Google Meet selected - will open external link");
        // Return WebRTC for fallback
        return getWebRTCService();
      }

      case "whatsapp": {
        // WhatsApp uses deep links
        console.log("WhatsApp selected - will use deep links");
        // Return WebRTC for fallback
        return getWebRTCService();
      }

      case "webrtc":
      default: {
        const iceServers = this.settings?.webrtc.enabled
          ? this.settings.webrtc.stunServers.map((url) => ({ urls: url }))
          : undefined;
        const service = getWebRTCService(iceServers);
        await service.initialize();
        this.currentService = service;
        this.currentPlatform = "webrtc";
        return service;
      }
    }
  }

  getCurrentService(): ICommunicationService | null {
    return this.currentService;
  }

  getCurrentPlatform(): CommunicationPlatform | null {
    return this.currentPlatform;
  }

  // Clean up all services
  cleanup(): void {
    resetWebRTCService();
    resetAgoraService();
    resetZoomService();
    resetWhatsAppService();
    this.currentService = null;
    this.currentPlatform = null;
  }

  // Start a call
  async startCall(options: CallOptions, platform?: CommunicationPlatform): Promise<CallSession> {
    const service = await this.getService(platform, options.type);
    return service.joinRoom(options);
  }

  // End current call
  async endCall(): Promise<void> {
    if (this.currentService) {
      await this.currentService.leaveRoom();
    }
  }

  // Generate external meeting links (for Google Meet, WhatsApp, etc.)
  generateExternalLink(platform: CommunicationPlatform, roomId: string, phoneNumber?: string): string {
    switch (platform) {
      case "google-meet":
        // Google Meet links require OAuth authentication to create
        // This is a placeholder - actual implementation requires backend
        return `https://meet.google.com/${roomId}`;

      case "whatsapp":
        if (phoneNumber) {
          // WhatsApp deep link for direct call
          return `https://wa.me/${phoneNumber}?text=Join%20our%20meeting`;
        }
        return "";

      default:
        return "";
    }
  }

  // Check if a platform supports in-app calling
  supportsInAppCalling(platform: CommunicationPlatform): boolean {
    switch (platform) {
      case "webrtc":
      case "agora":
      case "zoom":
        return true;
      case "google-meet":
      case "whatsapp":
        return false;
      default:
        return false;
    }
  }

  // Check if a platform is configured
  isPlatformConfigured(platform: CommunicationPlatform): boolean {
    if (!this.settings) return platform === "webrtc";

    switch (platform) {
      case "agora":
        return this.settings.agora.enabled && !!this.settings.agora.appId;
      case "zoom":
        return this.settings.zoom.enabled && !!this.settings.zoom.sdkKey;
      case "google-meet":
        return this.settings.googleMeet.enabled && !!this.settings.googleMeet.clientId;
      case "whatsapp":
        return this.settings.whatsApp.enabled && !!this.settings.whatsApp.businessPhoneNumber;
      case "webrtc":
        return this.settings.webrtc.enabled;
      default:
        return false;
    }
  }

  // Get list of available platforms
  getAvailablePlatforms(): CommunicationPlatform[] {
    const platforms: CommunicationPlatform[] = ["webrtc"]; // Always available

    if (this.isPlatformConfigured("agora")) platforms.push("agora");
    if (this.isPlatformConfigured("zoom")) platforms.push("zoom");
    if (this.isPlatformConfigured("google-meet")) platforms.push("google-meet");
    if (this.isPlatformConfigured("whatsapp")) platforms.push("whatsapp");

    return platforms;
  }
}

// Singleton instance
let managerInstance: CommunicationManager | null = null;

export function getCommunicationManager(): CommunicationManager {
  if (!managerInstance) {
    managerInstance = new CommunicationManager();
  }
  return managerInstance;
}

export function resetCommunicationManager(): void {
  if (managerInstance) {
    managerInstance.cleanup();
    managerInstance = null;
  }
}
