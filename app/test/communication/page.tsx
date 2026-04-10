"use client";

import React, { useState, useEffect } from "react";
import { Video, Phone, MessageSquare, Settings, CheckCircle, XCircle } from "lucide-react";
import { useCommunication } from "@/contexts/CommunicationContext";
import VideoCallRoom from "@/components/communication/VideoCallRoom";
import VoiceCallRoom from "@/components/communication/VoiceCallRoom";
import ChatRoom from "@/components/communication/ChatRoom";
import { DashboardPage } from "@/components/pages";

export default function CommunicationTestPage() {
  const { isConfigured, getAvailablePlatforms, getBestAvailablePlatform } = useCommunication();

  const [activeTest, setActiveTest] = useState<"none" | "video" | "voice" | "chat">("none");
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Generate IDs only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setRoomId(`test-room-${Date.now()}`);
    setUserId(`user-${Math.random().toString(36).substr(2, 9)}`);
    setUserName(`Test User ${Math.floor(Math.random() * 1000)}`);
  }, []);

  const bestVideoPlatform = getBestAvailablePlatform("video");
  const bestVoicePlatform = getBestAvailablePlatform("voice");
  const bestChatPlatform = getBestAvailablePlatform("chat");

  // Show loading while client-side values are generated
  if (!isClient) {
    return (
      <DashboardPage
        title="Communication System Test"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Communication Test", isActive: true },
        ]}
        loadingText="Loading test page..."
      />
    );
  }

  const platforms = [
    { name: "Agora", key: "agora" as const, configured: isConfigured("agora") },
    { name: "Zoom", key: "zoom" as const, configured: isConfigured("zoom") },
    { name: "Google Meet", key: "google-meet" as const, configured: isConfigured("google-meet") },
    { name: "WhatsApp", key: "whatsapp" as const, configured: isConfigured("whatsapp") },
    { name: "WebRTC", key: "webrtc" as const, configured: isConfigured("webrtc") },
  ];

  if (activeTest === "video") {
    return (
      <div className="h-screen">
        <VideoCallRoom
          roomId={roomId}
          userId={userId}
          userName={userName}
          isHost={true}
          recipientName="Test Recipient"
          onCallEnd={() => setActiveTest("none")}
        />
      </div>
    );
  }

  if (activeTest === "voice") {
    return (
      <div className="h-screen">
        <VoiceCallRoom
          roomId={roomId}
          userId={userId}
          userName={userName}
          isHost={true}
          recipientName="Test Recipient"
          onCallEnd={() => setActiveTest("none")}
        />
      </div>
    );
  }

  if (activeTest === "chat") {
    return (
      <div className="h-screen">
        <ChatRoom
          roomId={roomId}
          userId={userId}
          userName={userName}
          roomName="Test Chat Room"
          roomType="group"
          onBack={() => setActiveTest("none")}
        />
      </div>
    );
  }

  return (
    <DashboardPage
      title="Communication System Test"
      description="Test video calls, voice calls, and chat functionality"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Communication Test", isActive: true },
      ]}
      loadingText="Loading Communication Test"
      afterStats={
        <div className="mt-6 max-w-4xl mx-auto">

        {/* Platform Status */}
        <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Platform Configuration Status
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.key}
                className={`p-4 rounded-xl border-2 ${
                  platform.configured
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {platform.configured ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm">
                    {platform.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                  {platform.configured ? "Ready" : "Not configured"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200">
              <strong>Best platforms:</strong> Video: {bestVideoPlatform || "None"} |
              Voice: {bestVoicePlatform || "None"} |
              Chat: {bestChatPlatform || "None"}
            </p>
          </div>
        </div>

        {/* Room Configuration */}
        <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
            Test Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-xl bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                placeholder="Enter room ID"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use the same Room ID in another tab/device to join the same room
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
                Your Info
              </label>
              <div className="px-4 py-2 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-xl">
                <p className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  <strong>User ID:</strong> {userId}
                </p>
                <p className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  <strong>Name:</strong> {userName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTest("video")}
            className="flex items-center justify-center gap-3 p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors shadow-lg"
          >
            <Video className="w-8 h-8" />
            <div className="text-left">
              <p className="font-semibold text-lg">Video Call</p>
              <p className="text-blue-200 text-sm">Using {bestVideoPlatform || "WebRTC"}</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTest("voice")}
            className="flex items-center justify-center gap-3 p-6 bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-colors shadow-lg"
          >
            <Phone className="w-8 h-8" />
            <div className="text-left">
              <p className="font-semibold text-lg">Voice Call</p>
              <p className="text-green-200 text-sm">Using {bestVoicePlatform || "WebRTC"}</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTest("chat")}
            className="flex items-center justify-center gap-3 p-6 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-colors shadow-lg"
          >
            <MessageSquare className="w-8 h-8" />
            <div className="text-left">
              <p className="font-semibold text-lg">Chat Room</p>
              <p className="text-purple-200 text-sm">Using {bestChatPlatform || "WebRTC"}</p>
            </div>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            How to Test
          </h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
            <li>Copy the <strong>Room ID</strong> shown above</li>
            <li>Open this page in another browser tab or on another device</li>
            <li>Paste the same Room ID</li>
            <li>Click the same test button (Video, Voice, or Chat) in both windows</li>
            <li>You should connect and see/hear each other!</li>
          </ol>

          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-800/30 rounded-xl">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> For WebRTC without Agora, both tabs must be in the same browser.
              For cross-device testing, configure Agora in{" "}
              <a href="/admin/settings/communication" className="underline">
                Admin Settings
              </a>
              .
            </p>
          </div>
        </div>
        </div>
      }
    />
  );
}
