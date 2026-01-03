"use client";

import { useState } from "react";
import { Video, Phone, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic imports to avoid SSR issues with WebRTC
const VideoCallRoom = dynamic(
  () => import("@/components/communication/VideoCallRoom"),
  { ssr: false, loading: () => <LoadingScreen text="Loading Video Call..." /> }
);

const VoiceCallRoom = dynamic(
  () => import("@/components/communication/VoiceCallRoom"),
  { ssr: false, loading: () => <LoadingScreen text="Loading Voice Call..." /> }
);

const ChatRoom = dynamic(
  () => import("@/components/communication/ChatRoom"),
  { ssr: false, loading: () => <LoadingScreen text="Loading Chat..." /> }
);

function LoadingScreen({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
        <p className="text-white">{text}</p>
      </div>
    </div>
  );
}

type CallMode = "none" | "video" | "voice" | "chat";

export default function TestCallPage() {
  const [callMode, setCallMode] = useState<CallMode>("none");
  const [roomId, setRoomId] = useState("test-room-123");
  const [userName, setUserName] = useState("Test User");

  // Mock user data
  const userId = `user-${Date.now()}`;
  const userAvatar = `https://i.pravatar.cc/150?u=${userId}`;

  const handleEndCall = () => {
    setCallMode("none");
  };

  // Show call interface
  if (callMode === "video") {
    return (
      <VideoCallRoom
        roomId={roomId}
        userId={userId}
        userName={userName}
        userAvatar={userAvatar}
        isHost={true}
        callType="video"
        onCallEnd={handleEndCall}
        onError={(error) => {
          console.error("Call error:", error);
          alert(`Error: ${error.message}`);
          handleEndCall();
        }}
      />
    );
  }

  if (callMode === "voice") {
    return (
      <VoiceCallRoom
        roomId={roomId}
        userId={userId}
        userName={userName}
        userAvatar={userAvatar}
        isHost={true}
        recipientName="Other Participant"
        onCallEnd={handleEndCall}
        onError={(error) => {
          console.error("Call error:", error);
          alert(`Error: ${error.message}`);
          handleEndCall();
        }}
      />
    );
  }

  if (callMode === "chat") {
    return (
      <div className="h-screen flex flex-col">
        <ChatRoom
          roomId={roomId}
          userId={userId}
          userName={userName}
          userAvatar={userAvatar}
          roomName="Test Chat Room"
          roomType="group"
          participants={[
            { id: userId, name: userName, avatar: userAvatar, isOnline: true },
          ]}
          onStartVideoCall={() => setCallMode("video")}
          onStartVoiceCall={() => setCallMode("voice")}
          onBack={handleEndCall}
        />
      </div>
    );
  }

  // Selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Communication Test Page</h1>
          <p className="text-gray-400 mt-2">
            Test video calls, voice calls, and chat using WebRTC (no API keys required)
          </p>
        </div>

        {/* Settings */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Room ID</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter room ID"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Tip: Use the same Room ID in two browser windows/tabs to test peer-to-peer communication
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Video Call */}
          <button
            onClick={() => setCallMode("video")}
            className="flex flex-col items-center gap-3 p-8 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-blue-500/25"
          >
            <Video className="w-12 h-12" />
            <div className="text-center">
              <p className="font-semibold text-lg">Video Call</p>
              <p className="text-blue-200 text-sm">Start a video meeting</p>
            </div>
          </button>

          {/* Voice Call */}
          <button
            onClick={() => setCallMode("voice")}
            className="flex flex-col items-center gap-3 p-8 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-emerald-500/25"
          >
            <Phone className="w-12 h-12" />
            <div className="text-center">
              <p className="font-semibold text-lg">Voice Call</p>
              <p className="text-emerald-200 text-sm">Start an audio call</p>
            </div>
          </button>

          {/* Chat */}
          <button
            onClick={() => setCallMode("chat")}
            className="flex flex-col items-center gap-3 p-8 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-purple-500/25"
          >
            <MessageSquare className="w-12 h-12" />
            <div className="text-center">
              <p className="font-semibold text-lg">Chat</p>
              <p className="text-purple-200 text-sm">Start a chat room</p>
            </div>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-3">How to Test</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
            <li>Enter your name and a room ID above</li>
            <li>Click one of the call buttons to start</li>
            <li>
              <strong>To test with another person:</strong> Open the same URL in another browser
              window/tab with a different name but the <strong>same Room ID</strong>
            </li>
            <li>Both participants should be able to see/hear each other</li>
            <li>Use the controls to mute, toggle video, share screen, or chat</li>
          </ol>
        </div>

        {/* Technical Info */}
        <div className="mt-4 text-center text-gray-500 text-xs">
          <p>Using WebRTC for peer-to-peer communication</p>
          <p>No server required - works directly between browsers on the same network</p>
        </div>
      </div>
    </div>
  );
}
