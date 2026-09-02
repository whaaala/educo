"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardPage } from "@/components/pages";
import {
  Video,
  Phone,
  MessageSquare,
  Settings,
  Save,
  CheckCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Shield,
  Zap,
  Building2,
  ChevronDown,
  Search,
  Check,
  Globe,
  Radio,
  Wifi,
} from "lucide-react";
import { useCommunication, CommunicationPlatform, AgoraConfigMode, WhatsAppConfigMode, CommunicationSettings } from "@/contexts/CommunicationContext";
import { getAllTenants } from "@/lib/mockTenants";
import { Tenant } from "@/types/school";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";

// Platform configurations
const PLATFORMS = {
  webrtc: {
    id: "webrtc",
    name: "Educo Meet",
    subtitle: "WebRTC",
    description: "Free built-in video calling. No setup required.",
    icon: Wifi,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20",
    features: ["Free", "Built-in", "P2P"],
  },
  agora: {
    id: "agora",
    name: "Agora",
    subtitle: "Enterprise",
    description: "Enterprise-grade HD video, voice & messaging.",
    icon: Zap,
    color: "cyan",
    gradient: "from-cyan-500 to-teal-600",
    lightBg: "bg-cyan-50 dark:bg-cyan-900/20",
    features: ["HD Video", "Low Latency", "Recording"],
  },
  zoom: {
    id: "zoom",
    name: "Zoom",
    subtitle: "Video SDK",
    description: "Industry-standard video conferencing.",
    icon: Video,
    color: "indigo",
    gradient: "from-indigo-500 to-blue-600",
    lightBg: "bg-indigo-50 dark:bg-indigo-900/20",
    features: ["Familiar UI", "Breakout Rooms"],
  },
  "google-meet": {
    id: "google-meet",
    name: "Google Meet",
    subtitle: "Workspace",
    description: "Google video conferencing integration.",
    icon: Video,
    color: "green",
    gradient: "from-green-500 to-emerald-600",
    lightBg: "bg-green-50 dark:bg-green-900/20",
    features: ["Calendar Sync", "Google SSO"],
  },
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp",
    subtitle: "Business API",
    description: "Popular messaging for calls & messages.",
    icon: Phone,
    color: "emerald",
    gradient: "from-emerald-500 to-green-600",
    lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
    features: ["Popular", "Deep Links"],
  },
};

// Toggle Switch Component
function ToggleSwitch({
  enabled,
  onChange,
  size = "md"
}: {
  enabled: boolean;
  onChange: () => void;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { track: "w-9 h-5", thumb: "w-3.5 h-3.5", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "w-4 h-4", translate: "translate-x-5" },
    lg: { track: "w-14 h-7", thumb: "w-5 h-5", translate: "translate-x-7" },
  };
  const s = sizes[size];

  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex ${s.track} items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${
        enabled
          ? "bg-gradient-to-r from-green-500 to-emerald-500"
          : "bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]"
      }`}
    >
      <span
        className={`inline-block ${s.thumb} transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
          enabled ? s.translate : "translate-x-1"
        }`}
      />
    </button>
  );
}

// Config Mode Selector Component
function ConfigModeSelector({
  value,
  onChange,
}: {
  value: "platform" | "tenant";
  onChange: (mode: "platform" | "tenant") => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange("platform")}
        className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
          value === "platform"
            ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 dark:border-cyan-500"
            : "border-line hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 bg-surface"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
            value === "platform" ? "border-cyan-500 dark:border-cyan-400" : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
          }`}>
            {value === "platform" && <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Globe className={`w-4 h-4 ${value === "platform" ? "text-cyan-500" : "text-gray-400"}`} />
              <span className="font-medium text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Platform Account</span>
            </div>
            <p className="text-xs text-muted mt-1">
              Use Educo&apos;s shared account. No setup required.
            </p>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onChange("tenant")}
        className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
          value === "tenant"
            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500"
            : "border-line hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 bg-surface"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
            value === "tenant" ? "border-emerald-500 dark:border-emerald-400" : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
          }`}>
            {value === "tenant" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Building2 className={`w-4 h-4 ${value === "tenant" ? "text-emerald-500" : "text-gray-400"}`} />
              <span className="font-medium text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">School Account</span>
            </div>
            <p className="text-xs text-muted mt-1">
              Use your own account for full control.
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

// Platform Card Component
function PlatformCard({
  platform,
  isActive,
  isSelected,
  onSelect,
  onToggle,
}: {
  platform: typeof PLATFORMS.webrtc;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const Icon = platform.icon;

  const colorClasses: Record<string, { ring: string; iconBg: string; iconText: string; featureBg: string; featureText: string }> = {
    blue: {
      ring: "ring-blue-400 dark:ring-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
      iconText: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
      featureBg: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20",
      featureText: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
    },
    cyan: {
      ring: "ring-cyan-400 dark:ring-cyan-500",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
      iconText: "text-cyan-600 dark:text-cyan-400",
      featureBg: "bg-cyan-50 dark:bg-cyan-900/20",
      featureText: "text-cyan-600 dark:text-cyan-400",
    },
    indigo: {
      ring: "ring-indigo-400 dark:ring-indigo-500",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      iconText: "text-indigo-600 dark:text-indigo-400",
      featureBg: "bg-indigo-50 dark:bg-indigo-900/20",
      featureText: "text-indigo-600 dark:text-indigo-400",
    },
    green: {
      ring: "ring-green-400 dark:ring-green-500",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconText: "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
      featureBg: "bg-green-50 dark:bg-green-900/20",
      featureText: "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
    },
    emerald: {
      ring: "ring-emerald-400 dark:ring-emerald-500",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconText: "text-emerald-600 dark:text-emerald-400",
      featureBg: "bg-emerald-50 dark:bg-emerald-900/20",
      featureText: "text-emerald-600 dark:text-emerald-400",
    },
  };

  const colors = colorClasses[platform.color] || colorClasses.blue;

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 ${
        isSelected
          ? `ring-2 ${colors.ring} ring-offset-1 dark:ring-offset-gray-900 midnight:ring-offset-[#0d1526] purple:ring-offset-[#1f1035]`
          : ""
      }`}
      onClick={onSelect}
    >
      <div className={`
        relative overflow-hidden rounded-xl border transition-all duration-200
        ${isSelected
          ? "border-transparent shadow-md"
          : "border-line hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
        }
        bg-surface
      `}>
        {/* Gradient Header Line */}
        <div className={`h-1.5 bg-gradient-to-r ${platform.gradient} ${isActive ? 'opacity-100' : 'opacity-30'}`} />

        <div className="p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className={`p-2 rounded-lg ${colors.iconBg}`}>
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.iconText}`} />
            </div>
            <div onClick={(e) => { e.stopPropagation(); onToggle(); }}>
              <ToggleSwitch enabled={isActive} onChange={onToggle} size="sm" />
            </div>
          </div>

          {/* Title */}
          <div className="mb-1.5 sm:mb-2">
            <h3 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">{platform.name}</h3>
            <p className="text-[0.625rem] sm:text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">{platform.subtitle}</p>
          </div>

          {/* Description - hidden on very small screens */}
          <p className="hidden sm:block text-xs text-muted mb-2 sm:mb-3 line-clamp-2">
            {platform.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {platform.features.map((feature) => (
              <span
                key={feature}
                className={`text-[0.5625rem] sm:text-[0.625rem] px-1.5 sm:px-2 py-0.5 rounded-full font-medium ${colors.featureBg} ${colors.featureText}`}
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Status Indicator */}
          {isActive && (
            <div className="absolute top-2.5 right-12 sm:right-14 flex items-center gap-1">
              <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommunicationSettingsPage() {
  const {
    settings,
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
    isInitialized,
  } = useCommunication();

  // Get all tenants
  const allTenants = useMemo(() => getAllTenants(), []);

  // Tenant selection state
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [tenantSearchQuery, setTenantSearchQuery] = useState("");

  // Get selected tenant
  const selectedTenant = useMemo(() => {
    return allTenants.find(t => t.id === selectedTenantId) || null;
  }, [allTenants, selectedTenantId]);

  // Filter tenants by search query
  const filteredTenants = useMemo(() => {
    if (!tenantSearchQuery) return allTenants;
    const query = tenantSearchQuery.toLowerCase();
    return allTenants.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.shortName?.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query)
    );
  }, [allTenants, tenantSearchQuery]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<CommunicationPlatform>("webrtc");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Form states
  const [agoraForm, setAgoraForm] = useState({
    configMode: "platform" as AgoraConfigMode,
    appId: "",
    appCertificate: "",
    enabled: false,
  });

  const [zoomForm, setZoomForm] = useState({
    clientId: "",
    clientSecret: "",
    sdkKey: "",
    sdkSecret: "",
    enabled: false,
  });

  const [googleMeetForm, setGoogleMeetForm] = useState({
    clientId: "",
    clientSecret: "",
    enabled: false,
  });

  const [whatsAppForm, setWhatsAppForm] = useState({
    configMode: "platform" as WhatsAppConfigMode,
    businessPhoneNumber: "",
    businessAccountId: "",
    accessToken: "",
    webhookVerifyToken: "",
    appId: "",
    appSecret: "",
    enabled: false,
  });

  const [webrtcForm, setWebrtcForm] = useState({
    enabled: true,
    stunServers: ["stun:stun.l.google.com:19302"],
  });

  const [generalSettings, setGeneralSettings] = useState({
    defaultVideoPlatform: "webrtc" as CommunicationPlatform,
    defaultVoicePlatform: "webrtc" as CommunicationPlatform,
    defaultChatPlatform: "webrtc" as CommunicationPlatform,
    enableInAppCalling: true,
    enableInAppChat: true,
    enableScreenSharing: true,
    enableRecording: false,
  });

  // Helper to load form from settings
  const loadFormFromSettings = (tenantSettings: CommunicationSettings) => {
    setAgoraForm({
      configMode: tenantSettings.agora.configMode || "platform",
      appId: tenantSettings.agora.appId,
      appCertificate: tenantSettings.agora.appCertificate || "",
      enabled: tenantSettings.agora.enabled,
    });

    setZoomForm({
      clientId: tenantSettings.zoom.clientId,
      clientSecret: tenantSettings.zoom.clientSecret,
      sdkKey: tenantSettings.zoom.sdkKey || "",
      sdkSecret: tenantSettings.zoom.sdkSecret || "",
      enabled: tenantSettings.zoom.enabled,
    });

    setGoogleMeetForm({
      clientId: tenantSettings.googleMeet.clientId,
      clientSecret: tenantSettings.googleMeet.clientSecret,
      enabled: tenantSettings.googleMeet.enabled,
    });

    setWhatsAppForm({
      configMode: tenantSettings.whatsApp.configMode || "platform",
      businessPhoneNumber: tenantSettings.whatsApp.businessPhoneNumber,
      businessAccountId: tenantSettings.whatsApp.businessAccountId || "",
      accessToken: tenantSettings.whatsApp.accessToken || "",
      webhookVerifyToken: tenantSettings.whatsApp.webhookVerifyToken || "",
      appId: tenantSettings.whatsApp.appId || "",
      appSecret: tenantSettings.whatsApp.appSecret || "",
      enabled: tenantSettings.whatsApp.enabled,
    });

    setWebrtcForm({
      enabled: tenantSettings.webrtc.enabled,
      stunServers: tenantSettings.webrtc.stunServers,
    });

    setGeneralSettings({
      defaultVideoPlatform: tenantSettings.defaultVideoPlatform,
      defaultVoicePlatform: tenantSettings.defaultVoicePlatform,
      defaultChatPlatform: tenantSettings.defaultChatPlatform,
      enableInAppCalling: tenantSettings.enableInAppCalling,
      enableInAppChat: tenantSettings.enableInAppChat,
      enableScreenSharing: tenantSettings.enableScreenSharing,
      enableRecording: tenantSettings.enableRecording,
    });
  };

  // Load settings when tenant is selected
  useEffect(() => {
    if (selectedTenantId && isInitialized) {
      const tenantSettings = getTenantSettings(selectedTenantId);
      loadFormFromSettings(tenantSettings);
      loadTenantSettings(selectedTenantId);
    }
  }, [selectedTenantId, isInitialized]);

  // Initial load of settings (fallback to current settings)
  useEffect(() => {
    if (isInitialized && settings && !selectedTenantId) {
      loadFormFromSettings(settings);
    }
  }, [isInitialized, settings, selectedTenantId]);

  const toggleShowSecret = (field: string) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    if (!selectedTenantId) {
      alert("Please select a school/tenant first");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const fullSettings: CommunicationSettings = {
        tenantId: selectedTenantId,
        schoolName: selectedTenant?.name || "",
        agora: agoraForm,
        zoom: zoomForm,
        googleMeet: googleMeetForm,
        whatsApp: whatsAppForm,
        webrtc: webrtcForm,
        ...generalSettings,
        updatedAt: new Date().toISOString(),
      };

      saveTenantSettings(selectedTenantId, fullSettings);

      updateAgoraCredentials(agoraForm);
      updateZoomCredentials(zoomForm);
      updateGoogleMeetCredentials(googleMeetForm);
      updateWhatsAppCredentials(whatsAppForm);
      updateWebRTCConfig(webrtcForm);
      updateSettings({
        ...generalSettings,
        tenantId: selectedTenantId,
        schoolName: selectedTenant?.name || "",
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }

    setIsSaving(false);
  };

  const handleSelectTenant = (tenant: Tenant) => {
    setSelectedTenantId(tenant.id);
    setTenantDropdownOpen(false);
    setTenantSearchQuery("");
  };

  const hasTenantSettings = (tenantId: string): boolean => {
    const tenantSettings = allTenantSettings[tenantId];
    if (!tenantSettings) return false;
    return (
      tenantSettings.agora?.enabled ||
      tenantSettings.zoom?.enabled ||
      tenantSettings.googleMeet?.enabled ||
      tenantSettings.whatsApp?.enabled ||
      tenantSettings.webrtc?.enabled
    );
  };

  // Get platform status
  const getPlatformEnabled = (platformId: string): boolean => {
    switch (platformId) {
      case "webrtc": return webrtcForm.enabled;
      case "agora": return agoraForm.enabled;
      case "zoom": return zoomForm.enabled;
      case "google-meet": return googleMeetForm.enabled;
      case "whatsapp": return whatsAppForm.enabled;
      default: return false;
    }
  };

  const togglePlatform = (platformId: string) => {
    switch (platformId) {
      case "webrtc":
        setWebrtcForm(prev => ({ ...prev, enabled: !prev.enabled }));
        break;
      case "agora":
        setAgoraForm(prev => ({ ...prev, enabled: !prev.enabled }));
        break;
      case "zoom":
        setZoomForm(prev => ({ ...prev, enabled: !prev.enabled }));
        break;
      case "google-meet":
        setGoogleMeetForm(prev => ({ ...prev, enabled: !prev.enabled }));
        break;
      case "whatsapp":
        setWhatsAppForm(prev => ({ ...prev, enabled: !prev.enabled }));
        break;
    }
  };

  const activePlatformCount = [webrtcForm.enabled, agoraForm.enabled, zoomForm.enabled, googleMeetForm.enabled, whatsAppForm.enabled].filter(Boolean).length;

  return (
    <DashboardPage
      title="Communication Settings"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Communication", isActive: true },
      ]}
      loadingText="Loading Communication Settings"
      afterStats={
        <>
      <div className="flex flex-col h-full bg-canvas">
        {/* Header - Subtle styling */}
        <div className="flex-shrink-0 bg-surface border-b border-line">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
                    Communication Settings
                  </h1>
                  <p className="text-xs sm:text-sm text-muted mt-0.5">
                    Configure video, voice, and chat platforms
                  </p>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving || !selectedTenantId}
                className={`
                  flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium text-sm
                  transition-all duration-200 w-full sm:w-auto shadow-lg
                  ${saveSuccess
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : saveSuccess ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="sm:inline">{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* School Selector Card */}
            <div className="bg-surface rounded-xl shadow-sm border border-line">
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Select School</h2>
                    <p className="text-xs sm:text-sm text-muted">
                      Choose a school to configure
                    </p>
                  </div>
                </div>

                {/* Tenant Dropdown */}
                <div className="relative" style={{ zIndex: 100 }}>
                  <button
                    type="button"
                    onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                    className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 border rounded-lg transition-all duration-200 ${
                      selectedTenantId
                        ? "bg-surface border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-300"
                        : "bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-400"
                    }`}
                  >
                    {selectedTenant ? (
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                          style={{ backgroundColor: selectedTenant.branding?.primaryColor || "#6b7280" }}
                        >
                          {selectedTenant.shortName?.substring(0, 2) || selectedTenant.name.substring(0, 2)}
                        </div>
                        <div className="text-left min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">{selectedTenant.name}</p>
                            {hasTenantSettings(selectedTenant.id) && (
                              <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 text-[0.625rem] font-medium rounded">
                                Configured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted truncate">
                            {selectedTenant.config.institutionType} • {selectedTenant.contact?.address?.city || "N/A"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Select a school...</span>
                      </div>
                    )}
                    <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${tenantDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {tenantDropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown when clicking outside */}
                      <div
                        className="fixed inset-0"
                        style={{ zIndex: 99 }}
                        onClick={() => setTenantDropdownOpen(false)}
                      />
                      <div
                        className="absolute left-0 right-0 mt-2 bg-surface border border-line rounded-xl shadow-lg"
                        style={{ zIndex: 100 }}
                      >
                        {/* Search */}
                        <div className="p-2 sm:p-3 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-surface">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={tenantSearchQuery}
                              onChange={(e) => setTenantSearchQuery(e.target.value)}
                              placeholder="Search schools..."
                              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-ink text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {/* Tenant List */}
                        <div className="max-h-60 sm:max-h-72 overflow-y-auto p-1.5 sm:p-2 bg-surface">
                          {filteredTenants.length === 0 ? (
                            <div className="p-4 text-center text-muted text-sm">
                              No schools found
                            </div>
                          ) : (
                            filteredTenants.map((tenant) => (
                              <button
                                key={tenant.id}
                                type="button"
                                onClick={() => handleSelectTenant(tenant)}
                                className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 ${
                                  selectedTenantId === tenant.id
                                    ? "bg-surface-2"
                                    : "hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                                }`}
                              >
                                <div
                                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0"
                                  style={{ backgroundColor: tenant.branding?.primaryColor || "#6b7280" }}
                                >
                                  {tenant.shortName?.substring(0, 2) || tenant.name.substring(0, 2)}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                  <p className="font-medium text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">{tenant.name}</p>
                                  <p className="text-[0.625rem] sm:text-xs text-muted truncate">
                                    {tenant.config.institutionType} • {tenant.contact?.address?.city || "N/A"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {hasTenantSettings(tenant.id) && (
                                    <span className="hidden sm:inline px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 text-[0.625rem] font-medium rounded">
                                      Configured
                                    </span>
                                  )}
                                  {selectedTenantId === tenant.id && (
                                    <Check className="w-4 h-4 text-green-500" />
                                  )}
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Stats for Selected Tenant */}
                {selectedTenant && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 rounded-lg">
                      <p className="text-[0.625rem] sm:text-xs font-medium text-muted uppercase tracking-wide">Type</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mt-0.5">{selectedTenant.config.institutionType}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 rounded-lg">
                      <p className="text-[0.625rem] sm:text-xs font-medium text-muted uppercase tracking-wide">Region</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mt-0.5">{selectedTenant.config.region}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 rounded-lg">
                      <p className="text-[0.625rem] sm:text-xs font-medium text-muted uppercase tracking-wide">Plan</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mt-0.5 capitalize">{selectedTenant.subscription?.plan || "N/A"}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 rounded-lg">
                      <p className="text-[0.625rem] sm:text-xs font-medium text-muted uppercase tracking-wide">Status</p>
                      <span className={`inline-flex mt-0.5 px-1.5 py-0.5 rounded text-[0.625rem] sm:text-xs font-medium ${
                        selectedTenant.status === "Active"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                          : "bg-gray-100 text-gray-500 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                      }`}>
                        {selectedTenant.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Configuration */}
            {!selectedTenantId ? (
              <div className="bg-surface rounded-xl shadow-sm border border-line p-8 sm:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-2">
                    Select a School
                  </h3>
                  <p className="text-sm text-muted">
                    Choose a school from the dropdown above to configure its communication settings.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Row - Hidden on mobile, simplified */}
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-surface rounded-lg border border-line p-3">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-muted">Active</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mt-1">{activePlatformCount}</p>
                  </div>
                  <div className="bg-surface rounded-lg border border-line p-3">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-muted">Video</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mt-1">{[webrtcForm.enabled, agoraForm.enabled, zoomForm.enabled, googleMeetForm.enabled].filter(Boolean).length}</p>
                  </div>
                  <div className="bg-surface rounded-lg border border-line p-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-muted">Voice</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mt-1">{[webrtcForm.enabled, agoraForm.enabled, whatsAppForm.enabled].filter(Boolean).length}</p>
                  </div>
                  <div className="bg-surface rounded-lg border border-line p-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-muted">Chat</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mt-1">{[webrtcForm.enabled, agoraForm.enabled, whatsAppForm.enabled].filter(Boolean).length}</p>
                  </div>
                </div>

                {/* Platform Cards Grid */}
                <div className="bg-surface rounded-xl shadow-sm border border-line p-4 sm:p-6">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-4">Available Platforms</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                    {Object.values(PLATFORMS).map((platform) => (
                      <PlatformCard
                        key={platform.id}
                        platform={platform}
                        isActive={getPlatformEnabled(platform.id)}
                        isSelected={selectedPlatform === platform.id}
                        onSelect={() => setSelectedPlatform(platform.id as CommunicationPlatform)}
                        onToggle={() => togglePlatform(platform.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Selected Platform Configuration */}
                <div className="bg-surface rounded-xl shadow-sm border border-line overflow-hidden">
                  {/* Platform Header */}
                  <div className={`p-4 sm:p-5 bg-gradient-to-r ${PLATFORMS[selectedPlatform]?.gradient || 'from-gray-500 to-gray-600'} border-b border-line`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        {(() => {
                          const Icon = PLATFORMS[selectedPlatform]?.icon || Settings;
                          return <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white">{PLATFORMS[selectedPlatform]?.name || "Platform"} Configuration</h3>
                        <p className="text-xs text-white/80 hidden sm:block">{PLATFORMS[selectedPlatform]?.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* WebRTC Config */}
                    {selectedPlatform === "webrtc" && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">Free Built-in Communication</h4>
                            <p className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-1">
                              WebRTC provides free peer-to-peer video, voice, and chat. No setup required.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Enable Educo Meet</h4>
                            <p className="text-xs text-muted">Use built-in WebRTC</p>
                          </div>
                          <ToggleSwitch
                            enabled={webrtcForm.enabled}
                            onChange={() => setWebrtcForm(prev => ({ ...prev, enabled: !prev.enabled }))}
                          />
                        </div>
                      </div>
                    )}

                    {/* Agora Config */}
                    {selectedPlatform === "agora" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Enable Agora</h4>
                            <p className="text-xs text-muted">Video, voice, and chat</p>
                          </div>
                          <ToggleSwitch
                            enabled={agoraForm.enabled}
                            onChange={() => setAgoraForm(prev => ({ ...prev, enabled: !prev.enabled }))}
                          />
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-3 flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-gray-400" />
                            Configuration Mode
                          </h4>
                          <ConfigModeSelector
                            value={agoraForm.configMode}
                            onChange={(mode) => setAgoraForm(prev => ({ ...prev, configMode: mode }))}
                          />
                        </div>

                        {agoraForm.configMode === "tenant" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg">
                            <FormInput
                              label="App ID"
                              icon={<Zap className="w-full h-full" />}
                              value={agoraForm.appId}
                              onChange={(value) => setAgoraForm(prev => ({ ...prev, appId: value }))}
                              placeholder="Enter Agora App ID"
                              required
                            />
                            <div className="relative">
                              <FormInput
                                label="App Certificate"
                                icon={<Shield className="w-full h-full" />}
                                value={agoraForm.appCertificate}
                                onChange={(value) => setAgoraForm(prev => ({ ...prev, appCertificate: value }))}
                                placeholder="Enter App Certificate"
                                type={showSecrets["agoraCert"] ? "text" : "text"}
                              />
                              <button
                                type="button"
                                onClick={() => toggleShowSecret("agoraCert")}
                                className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                              >
                                {showSecrets["agoraCert"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        )}

                        <a
                          href="https://console.agora.io/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                        >
                          Get Agora Credentials <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* WhatsApp Config */}
                    {selectedPlatform === "whatsapp" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Enable WhatsApp</h4>
                            <p className="text-xs text-muted">Business API for messaging</p>
                          </div>
                          <ToggleSwitch
                            enabled={whatsAppForm.enabled}
                            onChange={() => setWhatsAppForm(prev => ({ ...prev, enabled: !prev.enabled }))}
                          />
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-3 flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-gray-400" />
                            Configuration Mode
                          </h4>
                          <ConfigModeSelector
                            value={whatsAppForm.configMode}
                            onChange={(mode) => setWhatsAppForm(prev => ({ ...prev, configMode: mode }))}
                          />
                        </div>

                        {whatsAppForm.configMode === "tenant" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg">
                            <FormInput
                              label="Phone Number ID"
                              icon={<Phone className="w-full h-full" />}
                              value={whatsAppForm.businessPhoneNumber}
                              onChange={(value) => setWhatsAppForm(prev => ({ ...prev, businessPhoneNumber: value }))}
                              placeholder="123456789012345"
                              required
                            />
                            <FormInput
                              label="Business Account ID"
                              icon={<Building2 className="w-full h-full" />}
                              value={whatsAppForm.businessAccountId}
                              onChange={(value) => setWhatsAppForm(prev => ({ ...prev, businessAccountId: value }))}
                              placeholder="Business Account ID"
                            />
                            <FormInput
                              label="Access Token"
                              icon={<Shield className="w-full h-full" />}
                              value={whatsAppForm.accessToken}
                              onChange={(value) => setWhatsAppForm(prev => ({ ...prev, accessToken: value }))}
                              placeholder="Enter Access Token"
                              required
                            />
                            <FormInput
                              label="Webhook Verify Token"
                              icon={<Shield className="w-full h-full" />}
                              value={whatsAppForm.webhookVerifyToken}
                              onChange={(value) => setWhatsAppForm(prev => ({ ...prev, webhookVerifyToken: value }))}
                              placeholder="Verify token"
                            />
                          </div>
                        )}

                        <a
                          href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                        >
                          Get WhatsApp Credentials <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Zoom Config */}
                    {selectedPlatform === "zoom" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Enable Zoom</h4>
                            <p className="text-xs text-muted">Video SDK for meetings</p>
                          </div>
                          <ToggleSwitch
                            enabled={zoomForm.enabled}
                            onChange={() => setZoomForm(prev => ({ ...prev, enabled: !prev.enabled }))}
                          />
                        </div>

                        {zoomForm.enabled && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg">
                            <FormInput
                              label="Client ID"
                              icon={<Video className="w-full h-full" />}
                              value={zoomForm.clientId}
                              onChange={(value) => setZoomForm(prev => ({ ...prev, clientId: value }))}
                              placeholder="Enter Client ID"
                              required
                            />
                            <FormInput
                              label="Client Secret"
                              icon={<Shield className="w-full h-full" />}
                              value={zoomForm.clientSecret}
                              onChange={(value) => setZoomForm(prev => ({ ...prev, clientSecret: value }))}
                              placeholder="Enter Client Secret"
                              required
                            />
                            <FormInput
                              label="SDK Key"
                              icon={<Zap className="w-full h-full" />}
                              value={zoomForm.sdkKey}
                              onChange={(value) => setZoomForm(prev => ({ ...prev, sdkKey: value }))}
                              placeholder="Enter SDK Key"
                            />
                            <FormInput
                              label="SDK Secret"
                              icon={<Shield className="w-full h-full" />}
                              value={zoomForm.sdkSecret}
                              onChange={(value) => setZoomForm(prev => ({ ...prev, sdkSecret: value }))}
                              placeholder="Enter SDK Secret"
                            />
                          </div>
                        )}

                        <a
                          href="https://marketplace.zoom.us/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                          Get Zoom Credentials <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Google Meet Config */}
                    {selectedPlatform === "google-meet" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Enable Google Meet</h4>
                            <p className="text-xs text-muted">Generate Meet links</p>
                          </div>
                          <ToggleSwitch
                            enabled={googleMeetForm.enabled}
                            onChange={() => setGoogleMeetForm(prev => ({ ...prev, enabled: !prev.enabled }))}
                          />
                        </div>

                        {googleMeetForm.enabled && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg">
                            <FormInput
                              label="Client ID"
                              icon={<Video className="w-full h-full" />}
                              value={googleMeetForm.clientId}
                              onChange={(value) => setGoogleMeetForm(prev => ({ ...prev, clientId: value }))}
                              placeholder="Enter Google Client ID"
                              required
                            />
                            <FormInput
                              label="Client Secret"
                              icon={<Shield className="w-full h-full" />}
                              value={googleMeetForm.clientSecret}
                              onChange={(value) => setGoogleMeetForm(prev => ({ ...prev, clientSecret: value }))}
                              placeholder="Enter Client Secret"
                              required
                            />
                          </div>
                        )}

                        <a
                          href="https://console.cloud.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 hover:text-green-700 dark:hover:text-green-300"
                        >
                          Get Google Credentials <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Default Platforms & Features */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {/* Default Platforms */}
                  <div className="bg-surface rounded-xl shadow-sm border border-line p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-4">Default Platforms</h3>
                    <div className="space-y-3">
                      <FormDropdown
                        label="Default Video Platform"
                        icon={<Video className="w-full h-full" />}
                        value={generalSettings.defaultVideoPlatform}
                        onChange={(value) => setGeneralSettings(prev => ({ ...prev, defaultVideoPlatform: value as CommunicationPlatform }))}
                        options={[
                          { value: "webrtc", label: "Educo Meet" },
                          { value: "agora", label: `Agora ${!agoraForm.enabled ? "(Off)" : ""}` },
                          { value: "zoom", label: `Zoom ${!zoomForm.enabled ? "(Off)" : ""}` },
                          { value: "google-meet", label: `Google Meet ${!googleMeetForm.enabled ? "(Off)" : ""}` },
                        ]}
                      />
                      <FormDropdown
                        label="Default Voice Platform"
                        icon={<Phone className="w-full h-full" />}
                        value={generalSettings.defaultVoicePlatform}
                        onChange={(value) => setGeneralSettings(prev => ({ ...prev, defaultVoicePlatform: value as CommunicationPlatform }))}
                        options={[
                          { value: "webrtc", label: "Educo Meet" },
                          { value: "agora", label: `Agora ${!agoraForm.enabled ? "(Off)" : ""}` },
                          { value: "whatsapp", label: `WhatsApp ${!whatsAppForm.enabled ? "(Off)" : ""}` },
                        ]}
                      />
                      <FormDropdown
                        label="Default Chat Platform"
                        icon={<MessageSquare className="w-full h-full" />}
                        value={generalSettings.defaultChatPlatform}
                        onChange={(value) => setGeneralSettings(prev => ({ ...prev, defaultChatPlatform: value as CommunicationPlatform }))}
                        options={[
                          { value: "webrtc", label: "Educo Meet" },
                          { value: "agora", label: `Agora ${!agoraForm.enabled ? "(Off)" : ""}` },
                          { value: "whatsapp", label: `WhatsApp ${!whatsAppForm.enabled ? "(Off)" : ""}` },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bg-surface rounded-xl shadow-sm border border-line p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-4">Features</h3>
                    <div className="space-y-2">
                      {[
                        { key: "enableInAppCalling", label: "In-App Calling", description: "Video and voice calls", icon: Phone },
                        { key: "enableInAppChat", label: "In-App Chat", description: "Messaging", icon: MessageSquare },
                        { key: "enableScreenSharing", label: "Screen Sharing", description: "Share screen", icon: Video },
                        { key: "enableRecording", label: "Recording", description: "Record calls", icon: Radio },
                      ].map((feature) => (
                        <div
                          key={feature.key}
                          className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg"
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 bg-gray-100 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded">
                              <feature.icon className="w-3.5 h-3.5 text-muted" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 text-xs sm:text-sm">{feature.label}</h5>
                              <p className="text-[0.625rem] sm:text-xs text-muted hidden sm:block">{feature.description}</p>
                            </div>
                          </div>
                          <ToggleSwitch
                            enabled={generalSettings[feature.key as keyof typeof generalSettings] as boolean}
                            onChange={() => setGeneralSettings(prev => ({
                              ...prev,
                              [feature.key]: !prev[feature.key as keyof typeof prev],
                            }))}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
        </>
      }
    />
  );
}
