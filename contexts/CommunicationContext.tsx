"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Communication platform types
export type CommunicationPlatform = "agora" | "zoom" | "google-meet" | "whatsapp" | "webrtc";

// Agora configuration mode
// "platform" = Use platform-wide Agora account (shared across all schools)
// "tenant" = Each school uses their own Agora account
export type AgoraConfigMode = "platform" | "tenant";

// Agora credentials (for Educo Meet - in-app video/voice/chat)
export interface AgoraCredentials {
  // Configuration mode
  configMode: AgoraConfigMode;

  // For "platform" mode: Platform provides Agora (schools share the platform's account)
  // For "tenant" mode: School provides their own Agora credentials
  appId: string;
  appCertificate?: string; // Optional - only needed for token-based auth

  // Optional: Custom token server URL (if school wants to use their own)
  tokenServerUrl?: string;

  enabled: boolean;
}

// Zoom credentials (for embedded Zoom meetings)
export interface ZoomCredentials {
  clientId: string;
  clientSecret: string;
  sdkKey?: string; // For Zoom Video SDK (embedded)
  sdkSecret?: string;
  enabled: boolean;
}

// Google Meet credentials (for generating meet links)
export interface GoogleMeetCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  enabled: boolean;
}

// WhatsApp configuration mode
// "platform" = Use platform-wide WhatsApp Business account (shared across all schools)
// "tenant" = Each school uses their own WhatsApp Business account
export type WhatsAppConfigMode = "platform" | "tenant";

// WhatsApp Business API credentials
export interface WhatsAppCredentials {
  // Configuration mode
  configMode: WhatsAppConfigMode;

  // For "platform" mode: Platform provides WhatsApp (schools share the platform's account)
  // For "tenant" mode: School provides their own WhatsApp Business credentials
  businessPhoneNumber: string; // WhatsApp Business Phone Number ID (from Meta Business)
  businessAccountId?: string; // WhatsApp Business Account ID
  accessToken?: string; // System User Access Token (permanent token)
  webhookVerifyToken?: string; // Token for webhook verification
  appId?: string; // Meta App ID (for webhook setup)
  appSecret?: string; // Meta App Secret
  enabled: boolean;
}

// WebRTC configuration (fallback/free option)
export interface WebRTCConfig {
  stunServers: string[];
  turnServers?: {
    urls: string;
    username?: string;
    credential?: string;
  }[];
  enabled: boolean;
}

// All communication settings for a school
export interface CommunicationSettings {
  // School/tenant identifier
  tenantId: string;
  schoolName: string;

  // Platform credentials
  agora: AgoraCredentials;
  zoom: ZoomCredentials;
  googleMeet: GoogleMeetCredentials;
  whatsApp: WhatsAppCredentials;
  webrtc: WebRTCConfig;

  // Default platform preference
  defaultVideoPlatform: CommunicationPlatform;
  defaultVoicePlatform: CommunicationPlatform;
  defaultChatPlatform: CommunicationPlatform;

  // Feature toggles
  enableInAppCalling: boolean;
  enableInAppChat: boolean;
  enableScreenSharing: boolean;
  enableRecording: boolean;

  // Updated timestamp
  updatedAt: string;
}

// Default credentials (empty - school must configure)
const defaultAgoraCredentials: AgoraCredentials = {
  configMode: "platform", // Default to platform-wide (shared) account
  appId: "",
  appCertificate: "",
  tokenServerUrl: "",
  enabled: false,
};

const defaultZoomCredentials: ZoomCredentials = {
  clientId: "",
  clientSecret: "",
  sdkKey: "",
  sdkSecret: "",
  enabled: false,
};

const defaultGoogleMeetCredentials: GoogleMeetCredentials = {
  clientId: "",
  clientSecret: "",
  enabled: false,
};

const defaultWhatsAppCredentials: WhatsAppCredentials = {
  configMode: "platform", // Default to platform-wide (shared) account
  businessPhoneNumber: "",
  businessAccountId: "",
  accessToken: "",
  webhookVerifyToken: "",
  appId: "",
  appSecret: "",
  enabled: false,
};

const defaultWebRTCConfig: WebRTCConfig = {
  stunServers: [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
  ],
  enabled: true, // WebRTC is enabled by default as it's free
};

const defaultSettings: CommunicationSettings = {
  tenantId: "",
  schoolName: "",
  agora: defaultAgoraCredentials,
  zoom: defaultZoomCredentials,
  googleMeet: defaultGoogleMeetCredentials,
  whatsApp: defaultWhatsAppCredentials,
  webrtc: defaultWebRTCConfig,
  defaultVideoPlatform: "webrtc",
  defaultVoicePlatform: "webrtc",
  defaultChatPlatform: "webrtc",
  enableInAppCalling: true,
  enableInAppChat: true,
  enableScreenSharing: true,
  enableRecording: false,
  updatedAt: new Date().toISOString(),
};

interface CommunicationContextType {
  settings: CommunicationSettings;

  // Current tenant
  currentTenantId: string | null;

  // All tenant settings (for admin view)
  allTenantSettings: Record<string, CommunicationSettings>;

  // Update methods
  updateSettings: (newSettings: Partial<CommunicationSettings>) => void;
  updateAgoraCredentials: (credentials: Partial<AgoraCredentials>) => void;
  updateZoomCredentials: (credentials: Partial<ZoomCredentials>) => void;
  updateGoogleMeetCredentials: (credentials: Partial<GoogleMeetCredentials>) => void;
  updateWhatsAppCredentials: (credentials: Partial<WhatsAppCredentials>) => void;
  updateWebRTCConfig: (config: Partial<WebRTCConfig>) => void;

  // Tenant management
  loadTenantSettings: (tenantId: string) => void;
  saveTenantSettings: (tenantId: string, settings: CommunicationSettings) => void;
  getTenantSettings: (tenantId: string) => CommunicationSettings;

  // Utility methods
  isConfigured: (platform: CommunicationPlatform) => boolean;
  getAvailablePlatforms: () => CommunicationPlatform[];
  getBestAvailablePlatform: (type: "video" | "voice" | "chat") => CommunicationPlatform | null;

  // Connection state
  isInitialized: boolean;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

const STORAGE_KEY = "educo_communication_settings";

const ALL_TENANTS_KEY = "educo_all_tenant_settings";

export function CommunicationProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CommunicationSettings>(defaultSettings);
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const [allTenantSettings, setAllTenantSettings] = useState<Record<string, CommunicationSettings>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to merge settings with defaults
  const mergeWithDefaults = (parsed: Partial<CommunicationSettings>): CommunicationSettings => ({
    ...defaultSettings,
    ...parsed,
    agora: { ...defaultAgoraCredentials, ...(parsed.agora || {}) },
    zoom: { ...defaultZoomCredentials, ...(parsed.zoom || {}) },
    googleMeet: { ...defaultGoogleMeetCredentials, ...(parsed.googleMeet || {}) },
    whatsApp: { ...defaultWhatsAppCredentials, ...(parsed.whatsApp || {}) },
    webrtc: { ...defaultWebRTCConfig, ...(parsed.webrtc || {}) },
  });

  // Load all tenant settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load all tenant settings
        const allSettings = localStorage.getItem(ALL_TENANTS_KEY);
        if (allSettings) {
          const parsed = JSON.parse(allSettings) as Record<string, CommunicationSettings>;
          // Merge each tenant's settings with defaults
          const merged: Record<string, CommunicationSettings> = {};
          Object.entries(parsed).forEach(([tenantId, tenantSettings]) => {
            merged[tenantId] = mergeWithDefaults(tenantSettings);
          });
          setAllTenantSettings(merged);
        }

        // Load current/default settings
        const savedSettings = localStorage.getItem(STORAGE_KEY);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings) as CommunicationSettings;
          setSettings(mergeWithDefaults(parsed));
          if (parsed.tenantId) {
            setCurrentTenantId(parsed.tenantId);
          }
        }
      } catch (error) {
        console.error("Failed to load communication settings:", error);
      }
      setIsInitialized(true);
    };

    loadSettings();

    // Listen for tenant changes
    const handleTenantChange = (event: CustomEvent<{ tenantId: string }>) => {
      const tenantId = event.detail.tenantId;
      setCurrentTenantId(tenantId);

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
        console.error("Failed to save communication settings:", error);
      }
    }
  }, [settings, isInitialized]);

  // Save allTenantSettings to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && Object.keys(allTenantSettings).length > 0) {
      try {
        localStorage.setItem(ALL_TENANTS_KEY, JSON.stringify(allTenantSettings));
      } catch (error) {
        console.error("Failed to save all tenant settings:", error);
      }
    }
  }, [allTenantSettings, isInitialized]);

  // Load settings for a specific tenant
  const loadTenantSettings = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    const tenantSettings = allTenantSettings[tenantId];
    if (tenantSettings) {
      setSettings(tenantSettings);
    } else {
      // Create new settings for this tenant
      const newSettings: CommunicationSettings = {
        ...defaultSettings,
        tenantId,
      };
      setSettings(newSettings);
    }
  };

  // Save settings for a specific tenant
  const saveTenantSettings = (tenantId: string, newSettings: CommunicationSettings) => {
    const updatedSettings = {
      ...newSettings,
      tenantId,
      updatedAt: new Date().toISOString(),
    };
    setAllTenantSettings((prev) => ({
      ...prev,
      [tenantId]: updatedSettings,
    }));
    // If this is the current tenant, also update current settings
    if (tenantId === currentTenantId) {
      setSettings(updatedSettings);
    }
  };

  // Get settings for a specific tenant
  const getTenantSettings = (tenantId: string): CommunicationSettings => {
    return allTenantSettings[tenantId] || { ...defaultSettings, tenantId };
  };

  const updateSettings = (newSettings: Partial<CommunicationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateAgoraCredentials = (credentials: Partial<AgoraCredentials>) => {
    setSettings((prev) => ({
      ...prev,
      agora: { ...prev.agora, ...credentials },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateZoomCredentials = (credentials: Partial<ZoomCredentials>) => {
    setSettings((prev) => ({
      ...prev,
      zoom: { ...prev.zoom, ...credentials },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateGoogleMeetCredentials = (credentials: Partial<GoogleMeetCredentials>) => {
    setSettings((prev) => ({
      ...prev,
      googleMeet: { ...prev.googleMeet, ...credentials },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateWhatsAppCredentials = (credentials: Partial<WhatsAppCredentials>) => {
    setSettings((prev) => ({
      ...prev,
      whatsApp: { ...prev.whatsApp, ...credentials },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateWebRTCConfig = (config: Partial<WebRTCConfig>) => {
    setSettings((prev) => ({
      ...prev,
      webrtc: { ...prev.webrtc, ...config },
      updatedAt: new Date().toISOString(),
    }));
  };

  const isConfigured = (platform: CommunicationPlatform): boolean => {
    switch (platform) {
      case "agora":
        return settings.agora.enabled && !!settings.agora.appId;
      case "zoom":
        return settings.zoom.enabled && !!settings.zoom.clientId && !!settings.zoom.sdkKey;
      case "google-meet":
        return settings.googleMeet.enabled && !!settings.googleMeet.clientId;
      case "whatsapp":
        return settings.whatsApp.enabled && !!settings.whatsApp.businessPhoneNumber;
      case "webrtc":
        return settings.webrtc.enabled;
      default:
        return false;
    }
  };

  const getAvailablePlatforms = (): CommunicationPlatform[] => {
    const platforms: CommunicationPlatform[] = [];
    if (isConfigured("agora")) platforms.push("agora");
    if (isConfigured("zoom")) platforms.push("zoom");
    if (isConfigured("google-meet")) platforms.push("google-meet");
    if (isConfigured("whatsapp")) platforms.push("whatsapp");
    if (isConfigured("webrtc")) platforms.push("webrtc");
    return platforms;
  };

  const getBestAvailablePlatform = (type: "video" | "voice" | "chat"): CommunicationPlatform | null => {
    const available = getAvailablePlatforms();

    if (available.length === 0) return null;

    // Priority order for each type
    const priorities: Record<string, CommunicationPlatform[]> = {
      video: ["agora", "zoom", "webrtc", "google-meet"],
      voice: ["agora", "webrtc", "whatsapp", "zoom"],
      chat: ["agora", "webrtc", "whatsapp"],
    };

    const priority = priorities[type] || priorities.video;

    // Return first available platform in priority order
    for (const platform of priority) {
      if (available.includes(platform)) {
        return platform;
      }
    }

    return available[0] || null;
  };

  return (
    <CommunicationContext.Provider
      value={{
        settings,
        currentTenantId,
        allTenantSettings,
        updateSettings,
        updateAgoraCredentials,
        updateZoomCredentials,
        updateGoogleMeetCredentials,
        updateWhatsAppCredentials,
        updateWebRTCConfig,
        loadTenantSettings,
        saveTenantSettings,
        getTenantSettings,
        isConfigured,
        getAvailablePlatforms,
        getBestAvailablePlatform,
        isInitialized,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
}

export function useCommunication() {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error("useCommunication must be used within a CommunicationProvider");
  }
  return context;
}
