"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useCommunication, CommunicationPlatform, AgoraConfigMode, WhatsAppConfigMode, CommunicationSettings } from "@/contexts/CommunicationContext";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";

// Platform info
const PLATFORM_INFO = {
  webrtc: {
    name: "Educo Meet (WebRTC)",
    description: "Free built-in video calling using WebRTC technology. No external account required.",
    icon: Video,
    color: "blue",
    docsUrl: "https://webrtc.org/",
    features: ["Free", "No account needed", "Peer-to-peer", "Built-in"],
    setupDifficulty: "None",
  },
  agora: {
    name: "Agora",
    description: "Enterprise-grade real-time video, voice, and messaging platform.",
    icon: Zap,
    color: "cyan",
    docsUrl: "https://www.agora.io/en/",
    features: ["HD Video", "Low Latency", "Scalable", "Recording"],
    setupDifficulty: "Medium",
  },
  zoom: {
    name: "Zoom",
    description: "Industry-standard video conferencing solution with embedded SDK.",
    icon: Video,
    color: "blue",
    docsUrl: "https://developers.zoom.us/",
    features: ["Familiar UI", "Recording", "Breakout Rooms", "Enterprise"],
    setupDifficulty: "Medium",
  },
  "google-meet": {
    name: "Google Meet",
    description: "Google's video conferencing integrated with Google Workspace.",
    icon: Video,
    color: "green",
    docsUrl: "https://developers.google.com/meet",
    features: ["Google Integration", "Calendar Sync", "External Link"],
    setupDifficulty: "Medium",
  },
  whatsapp: {
    name: "WhatsApp",
    description: "Popular messaging platform for calls and messages via deep links.",
    icon: Phone,
    color: "emerald",
    docsUrl: "https://developers.facebook.com/docs/whatsapp/",
    features: ["Popular", "Easy Access", "External App", "Deep Links"],
    setupDifficulty: "Easy",
  },
};

export default function TenantCommunicationSettingsPage() {
  const {
    settings,
    updateSettings,
    updateAgoraCredentials,
    updateZoomCredentials,
    updateGoogleMeetCredentials,
    updateWhatsAppCredentials,
    updateWebRTCConfig,
    saveTenantSettings,
    isConfigured,
    getAvailablePlatforms,
    isInitialized,
  } = useCommunication();

  const { settings: schoolSettings } = useSchoolSettings();

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<CommunicationPlatform>("webrtc");
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

  // Load settings into form
  useEffect(() => {
    if (isInitialized && settings) {
      setAgoraForm({
        configMode: settings.agora.configMode || "platform",
        appId: settings.agora.appId,
        appCertificate: settings.agora.appCertificate || "",
        enabled: settings.agora.enabled,
      });

      setZoomForm({
        clientId: settings.zoom.clientId,
        clientSecret: settings.zoom.clientSecret,
        sdkKey: settings.zoom.sdkKey || "",
        sdkSecret: settings.zoom.sdkSecret || "",
        enabled: settings.zoom.enabled,
      });

      setGoogleMeetForm({
        clientId: settings.googleMeet.clientId,
        clientSecret: settings.googleMeet.clientSecret,
        enabled: settings.googleMeet.enabled,
      });

      setWhatsAppForm({
        configMode: settings.whatsApp.configMode || "platform",
        businessPhoneNumber: settings.whatsApp.businessPhoneNumber,
        businessAccountId: settings.whatsApp.businessAccountId || "",
        accessToken: settings.whatsApp.accessToken || "",
        webhookVerifyToken: settings.whatsApp.webhookVerifyToken || "",
        appId: settings.whatsApp.appId || "",
        appSecret: settings.whatsApp.appSecret || "",
        enabled: settings.whatsApp.enabled,
      });

      setWebrtcForm({
        enabled: settings.webrtc.enabled,
        stunServers: settings.webrtc.stunServers,
      });

      setGeneralSettings({
        defaultVideoPlatform: settings.defaultVideoPlatform,
        defaultVoicePlatform: settings.defaultVoicePlatform,
        defaultChatPlatform: settings.defaultChatPlatform,
        enableInAppCalling: settings.enableInAppCalling,
        enableInAppChat: settings.enableInAppChat,
        enableScreenSharing: settings.enableScreenSharing,
        enableRecording: settings.enableRecording,
      });
    }
  }, [isInitialized, settings]);

  const toggleShowSecret = (field: string) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Build full settings
      const tenantId = schoolSettings.tenantId || "default";
      const fullSettings: CommunicationSettings = {
        tenantId,
        schoolName: schoolSettings.schoolName,
        agora: agoraForm,
        zoom: zoomForm,
        googleMeet: googleMeetForm,
        whatsApp: whatsAppForm,
        webrtc: webrtcForm,
        ...generalSettings,
        updatedAt: new Date().toISOString(),
      };

      // Save for this tenant
      saveTenantSettings(tenantId, fullSettings);

      // Update current context
      updateAgoraCredentials(agoraForm);
      updateZoomCredentials(zoomForm);
      updateGoogleMeetCredentials(googleMeetForm);
      updateWhatsAppCredentials(whatsAppForm);
      updateWebRTCConfig(webrtcForm);
      updateSettings({
        ...generalSettings,
        tenantId: schoolSettings.tenantId,
        schoolName: schoolSettings.schoolName,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }

    setIsSaving(false);
  };

  const availablePlatforms = getAvailablePlatforms();

  const tabs: CommunicationPlatform[] = ["webrtc", "agora", "zoom", "google-meet", "whatsapp"];

  return (
    <DashboardPage
      title="Communication Settings"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Settings", href: "/settings" },
        { label: "Communication", isActive: true },
      ]}
      loadingText="Loading Communication Settings"
      afterStats={
        <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Communication Settings
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure video, voice, and chat platforms for {schoolSettings.schoolName}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Video className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Video Platforms</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {availablePlatforms.filter((p) => ["webrtc", "agora", "zoom", "google-meet"].includes(p)).length} Active
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Voice Platforms</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {availablePlatforms.filter((p) => ["webrtc", "agora", "whatsapp"].includes(p)).length} Active
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chat Platforms</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {availablePlatforms.filter((p) => ["webrtc", "agora", "whatsapp"].includes(p)).length} Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {tabs.map((tab) => {
                const info = PLATFORM_INFO[tab];
                const configured = isConfigured(tab);

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <info.icon className="w-4 h-4" />
                    {info.name}
                    {configured && (
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* WebRTC Tab */}
              {activeTab === "webrtc" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Free Built-in Communication
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        WebRTC is enabled by default and provides free peer-to-peer video, voice, and chat.
                        No external account or API keys required. Perfect for getting started!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Enable WebRTC</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use built-in WebRTC for in-app communication
                      </p>
                    </div>
                    <button
                      onClick={() => setWebrtcForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        webrtcForm.enabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          webrtcForm.enabled ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Agora Tab */}
              {activeTab === "agora" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                    <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-cyan-900 dark:text-cyan-100">
                        Enterprise Video Platform
                      </h4>
                      <p className="text-sm text-cyan-700 dark:text-cyan-300 mt-1">
                        Agora provides enterprise-grade real-time communication with HD video, low latency,
                        and advanced features like recording and analytics.
                      </p>
                      <a
                        href="https://console.agora.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-cyan-600 dark:text-cyan-400 hover:underline mt-2"
                      >
                        Get Agora Credentials <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Enable Agora</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use Agora for video, voice, and chat
                      </p>
                    </div>
                    <button
                      onClick={() => setAgoraForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        agoraForm.enabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          agoraForm.enabled ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Configuration Mode */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Configuration Mode
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Choose how Agora credentials are managed for your school.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setAgoraForm((prev) => ({ ...prev, configMode: "platform" }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          agoraForm.configMode === "platform"
                            ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              agoraForm.configMode === "platform"
                                ? "border-cyan-500"
                                : "border-gray-300 dark:border-gray-500"
                            }`}
                          >
                            {agoraForm.configMode === "platform" && (
                              <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Platform Account</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                          Use Educo&apos;s shared Agora account. No setup required - just enable and start using.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAgoraForm((prev) => ({ ...prev, configMode: "tenant" }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          agoraForm.configMode === "tenant"
                            ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              agoraForm.configMode === "tenant"
                                ? "border-cyan-500"
                                : "border-gray-300 dark:border-gray-500"
                            }`}
                          >
                            {agoraForm.configMode === "tenant" && (
                              <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">School Account</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                          Use your own Agora account. More control over usage and billing.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Credentials - only show if using tenant mode */}
                  {agoraForm.configMode === "tenant" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        App ID *
                      </label>
                      <input
                        type="text"
                        value={agoraForm.appId}
                        onChange={(e) => setAgoraForm((prev) => ({ ...prev, appId: e.target.value }))}
                        placeholder="Enter your Agora App ID"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        App Certificate (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets["agoraCert"] ? "text" : "password"}
                          value={agoraForm.appCertificate}
                          onChange={(e) =>
                            setAgoraForm((prev) => ({ ...prev, appCertificate: e.target.value }))
                          }
                          placeholder="Enter your App Certificate"
                          className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowSecret("agoraCert")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showSecrets["agoraCert"] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              )}

              {/* WhatsApp Tab */}
              {activeTab === "whatsapp" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
                        WhatsApp Business API Integration
                      </h4>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                        Integrate WhatsApp Business Cloud API for in-app messaging. Requires a Meta Business
                        account and WhatsApp Business API access.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Enable WhatsApp</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use WhatsApp Business API for messaging
                      </p>
                    </div>
                    <button
                      onClick={() => setWhatsAppForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        whatsAppForm.enabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          whatsAppForm.enabled ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Configuration Mode */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Configuration Mode
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Choose how WhatsApp Business credentials are managed for your school.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setWhatsAppForm((prev) => ({ ...prev, configMode: "platform" }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          whatsAppForm.configMode === "platform"
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              whatsAppForm.configMode === "platform"
                                ? "border-emerald-500"
                                : "border-gray-300 dark:border-gray-500"
                            }`}
                          >
                            {whatsAppForm.configMode === "platform" && (
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Platform Account</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                          Use Educo&apos;s shared WhatsApp Business account. No setup required.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWhatsAppForm((prev) => ({ ...prev, configMode: "tenant" }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          whatsAppForm.configMode === "tenant"
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              whatsAppForm.configMode === "tenant"
                                ? "border-emerald-500"
                                : "border-gray-300 dark:border-gray-500"
                            }`}
                          >
                            {whatsAppForm.configMode === "tenant" && (
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">School Account</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                          Use your own WhatsApp Business account. More control over branding.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Credentials - only show if using tenant mode */}
                  {whatsAppForm.configMode === "tenant" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number ID *
                      </label>
                      <input
                        type="text"
                        value={whatsAppForm.businessPhoneNumber}
                        onChange={(e) =>
                          setWhatsAppForm((prev) => ({ ...prev, businessPhoneNumber: e.target.value }))
                        }
                        placeholder="123456789012345"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Access Token *
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets["whatsappToken"] ? "text" : "password"}
                          value={whatsAppForm.accessToken}
                          onChange={(e) =>
                            setWhatsAppForm((prev) => ({ ...prev, accessToken: e.target.value }))
                          }
                          placeholder="Enter access token"
                          className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowSecret("whatsappToken")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showSecrets["whatsappToken"] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              )}

              {/* Zoom Tab - Simplified */}
              {activeTab === "zoom" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Video className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Zoom Integration
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Embed Zoom meetings directly in your application.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Enable Zoom</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use Zoom for video meetings
                      </p>
                    </div>
                    <button
                      onClick={() => setZoomForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        zoomForm.enabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          zoomForm.enabled ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Google Meet Tab - Simplified */}
              {activeTab === "google-meet" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Video className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        Google Meet Integration
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Generate Google Meet links for video calls.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Enable Google Meet</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use Google Meet for video meetings
                      </p>
                    </div>
                    <button
                      onClick={() => setGoogleMeetForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        googleMeetForm.enabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          googleMeetForm.enabled ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* General Settings */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Default Platforms
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Video Platform
                </label>
                <select
                  value={generalSettings.defaultVideoPlatform}
                  onChange={(e) =>
                    setGeneralSettings((prev) => ({
                      ...prev,
                      defaultVideoPlatform: e.target.value as CommunicationPlatform,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="webrtc">Educo Meet (WebRTC)</option>
                  <option value="agora" disabled={!agoraForm.enabled}>
                    Agora {!agoraForm.enabled && "(Not enabled)"}
                  </option>
                  <option value="zoom" disabled={!zoomForm.enabled}>
                    Zoom {!zoomForm.enabled && "(Not enabled)"}
                  </option>
                  <option value="google-meet" disabled={!googleMeetForm.enabled}>
                    Google Meet {!googleMeetForm.enabled && "(Not enabled)"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Voice Platform
                </label>
                <select
                  value={generalSettings.defaultVoicePlatform}
                  onChange={(e) =>
                    setGeneralSettings((prev) => ({
                      ...prev,
                      defaultVoicePlatform: e.target.value as CommunicationPlatform,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="webrtc">Educo Meet (WebRTC)</option>
                  <option value="agora" disabled={!agoraForm.enabled}>
                    Agora {!agoraForm.enabled && "(Not enabled)"}
                  </option>
                  <option value="whatsapp" disabled={!whatsAppForm.enabled}>
                    WhatsApp {!whatsAppForm.enabled && "(Not enabled)"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Chat Platform
                </label>
                <select
                  value={generalSettings.defaultChatPlatform}
                  onChange={(e) =>
                    setGeneralSettings((prev) => ({
                      ...prev,
                      defaultChatPlatform: e.target.value as CommunicationPlatform,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="webrtc">Educo Meet (WebRTC)</option>
                  <option value="agora" disabled={!agoraForm.enabled}>
                    Agora {!agoraForm.enabled && "(Not enabled)"}
                  </option>
                  <option value="whatsapp" disabled={!whatsAppForm.enabled}>
                    WhatsApp {!whatsAppForm.enabled && "(Not enabled)"}
                  </option>
                </select>
              </div>
            </div>

            {/* Feature Toggles */}
            <h4 className="text-md font-medium text-gray-900 dark:text-white mt-6 mb-4">
              Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: "enableInAppCalling",
                  label: "In-App Calling",
                  description: "Allow video and voice calls within the app",
                },
                {
                  key: "enableInAppChat",
                  label: "In-App Chat",
                  description: "Allow messaging within the app",
                },
                {
                  key: "enableScreenSharing",
                  label: "Screen Sharing",
                  description: "Allow participants to share their screen",
                },
                {
                  key: "enableRecording",
                  label: "Call Recording",
                  description: "Allow recording of video and voice calls",
                },
              ].map((feature) => (
                <div
                  key={feature.key}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">{feature.label}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                  <button
                    onClick={() =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        [feature.key]: !prev[feature.key as keyof typeof prev],
                      }))
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      generalSettings[feature.key as keyof typeof generalSettings]
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        generalSettings[feature.key as keyof typeof generalSettings] ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        </>
      }
    />
  );
}
