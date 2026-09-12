"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Video, Phone, MessageSquare, Users } from "lucide-react";
import dynamic from "next/dynamic";
import { stopAllMediaTracks } from "@/lib/utils/stopAllMedia";
import { useSidebar } from "@/contexts/SidebarContext";
import type { VideoCallRoomProps } from "./VideoCallRoom";

// Dynamic import for initial/direct video calls (SSR-safe)
const DynamicVideoCallRoom = dynamic(() => import("./VideoCallRoom"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 dark:bg-gray-950 midnight:bg-[#060a1a] purple:bg-[#120622]" />
  ),
});

const VoiceCallRoom = dynamic(() => import("./VoiceCallRoom"), {
  ssr: false,
  loading: () => <LoadingScreen text="Loading Voice Call..." />,
});

const ChatRoom = dynamic(() => import("./ChatRoom"), {
  ssr: false,
  loading: () => <LoadingScreen text="Loading Chat..." />,
});

function LoadingScreen({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#060a1a] purple:bg-[#120622]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
        <p className="text-ink">{text}</p>
      </div>
    </div>
  );
}

export type CallType = "video" | "voice" | "chat";

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  phone?: string;
  email?: string;
}

export interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Primary participant (the person being called)
  participant: Participant;
  // Additional participants for conference calls
  additionalParticipants?: Participant[];
  // Current user info
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  // Call configuration
  callType?: CallType;
  roomId?: string;
  // If true, shows selection screen first
  showTypeSelection?: boolean;
  // Context for the call (e.g., "Meeting with parent", "Teacher conference")
  callContext?: string;
}

export default function CallModal({
  isOpen,
  onClose,
  participant,
  additionalParticipants = [],
  currentUser,
  callType: initialCallType,
  roomId: providedRoomId,
  showTypeSelection = true,
  callContext,
}: CallModalProps) {
  const [selectedCallType, setSelectedCallType] = useState<CallType | null>(
    showTypeSelection ? null : initialCallType || null
  );
  const [isInCall, setIsInCall] = useState(!showTypeSelection);
  const [isUpgradingFromVoice, setIsUpgradingFromVoice] = useState(false);

  // Eagerly loaded VideoCallRoom component (bypasses next/dynamic loading fallback)
  const eagerVideoCallRoomRef = useRef<React.ComponentType<VideoCallRoomProps> | null>(null);
  const [_eagerVideoLoaded, setEagerVideoLoaded] = useState(false);

  // Preload VideoCallRoom when modal opens so it's ready instantly for voice→video upgrade
  useEffect(() => {
    if (isOpen && !eagerVideoCallRoomRef.current) {
      import("./VideoCallRoom").then((mod) => {
        eagerVideoCallRoomRef.current = mod.default;
        setEagerVideoLoaded(true);
      });
    }
  }, [isOpen]);

  // Get sidebar state to position the call correctly
  const { isCollapsed } = useSidebar();
  // Calculate sidebar width: 80px when collapsed, 288px when expanded (on desktop)
  const sidebarWidth = isCollapsed ? 80 : 288;

  // Sync state with props when modal opens or call type changes
  useEffect(() => {
    if (isOpen) {
      if (showTypeSelection) {
        setSelectedCallType(null);
        setIsInCall(false);
      } else if (initialCallType) {
        setSelectedCallType(initialCallType);
        setIsInCall(true);
      }
    } else {
      // Modal is closing - ensure all media is cleaned up
      console.log('[CallModal] Modal closing - calling nuclear cleanup');
      stopAllMediaTracks();
    }
  }, [isOpen, showTypeSelection, initialCallType]);

  // Generate a unique room ID if not provided
  const roomId =
    providedRoomId ||
    `call-${participant.id}-${currentUser.id}-${Date.now()}`.replace(/\s/g, "-");

  // All participants including the primary one
  const allParticipants = [
    { ...participant, isOnline: true },
    ...additionalParticipants.map((p) => ({ ...p, isOnline: true })),
  ];

  const handleStartCall = (type: CallType) => {
    setSelectedCallType(type);
    setIsInCall(true);
  };

  const handleEndCall = useCallback(() => {
    console.log('[CallModal] handleEndCall triggered - calling nuclear cleanup');
    // Nuclear cleanup first - ensure ALL media is stopped immediately
    stopAllMediaTracks();

    // Then update state
    setIsInCall(false);
    setSelectedCallType(null);
    setIsUpgradingFromVoice(false);
    onClose();
  }, [onClose]);

  const handleBack = useCallback(() => {
    if (showTypeSelection) {
      setIsInCall(false);
      setSelectedCallType(null);
    } else {
      onClose();
    }
  }, [showTypeSelection, onClose]);

  if (!isOpen) return null;

  // Show the active call interface
  // Position next to sidebar on desktop (lg breakpoint), full screen on mobile
  if (isInCall && selectedCallType) {
    if (selectedCallType === "video") {
      // Use eagerly loaded component if available (instant switch from voice),
      // otherwise fall back to next/dynamic (initial page load)
      const VideoCallRoom = eagerVideoCallRoomRef.current || DynamicVideoCallRoom;
      return (
        <div
          className="fixed top-[64px] bottom-0 right-0 z-30 bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#060a1a] purple:bg-[#120622] left-0 lg:left-[var(--sidebar-width)]"
          style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
        >
          <VideoCallRoom
            roomId={roomId}
            userId={currentUser.id}
            userName={currentUser.name}
            userAvatar={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`}
            isHost={true}
            callType="video"
            recipientName={participant.name}
            recipientAvatar={participant.avatar}
            isUpgradeFromVoice={isUpgradingFromVoice}
            onCallEnd={handleEndCall}
            onError={(error) => {
              // Don't use console.error as it triggers Next.js error overlay
              // The VideoCallRoom component already shows a nice error UI
              console.warn("Video call error:", error.message);
            }}
          />
        </div>
      );
    }

    if (selectedCallType === "voice") {
      return (
        <div
          className="fixed top-[64px] bottom-0 right-0 z-30 bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#060a1a] purple:bg-[#120622] left-0 lg:left-[var(--sidebar-width)]"
          style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
        >
          <VoiceCallRoom
            roomId={roomId}
            userId={currentUser.id}
            userName={currentUser.name}
            userAvatar={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`}
            isHost={true}
            recipientName={participant.name}
            recipientAvatar={participant.avatar}
            onCallEnd={handleEndCall}
            onSwitchToVideo={() => {
              // Switch from voice to video call - mark as upgrade to skip loading screen
              setIsUpgradingFromVoice(true);
              setSelectedCallType("video");
            }}
            onError={(error) => {
              // Don't use console.error as it triggers Next.js error overlay
              // The VoiceCallRoom component already shows a nice error UI
              console.warn("Voice call error:", error.message);
            }}
          />
        </div>
      );
    }

    if (selectedCallType === "chat") {
      return (
        <div
          className="fixed top-[64px] bottom-0 right-0 z-30 bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#060a1a] purple:bg-[#120622] left-0 lg:left-[var(--sidebar-width)]"
          style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
        >
          <ChatRoom
            roomId={roomId}
            userId={currentUser.id}
            userName={currentUser.name}
            userAvatar={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`}
            roomName={callContext || `Chat with ${participant.name}`}
            roomType={allParticipants.length > 1 ? "group" : "direct"}
            participants={[
              {
                id: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`,
                isOnline: true,
              },
              ...allParticipants,
            ]}
            onStartVideoCall={() => handleStartCall("video")}
            onStartVoiceCall={() => handleStartCall("voice")}
            onBack={handleBack}
          />
        </div>
      );
    }
  }

  // Show call type selection screen
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1d24] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Start Communication</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Participant Info */}
          <div className="flex items-center gap-4">
            {participant.avatar ? (
              <img
                src={participant.avatar}
                alt={participant.name}
                className="w-16 h-16 rounded-full border-2 border-white/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                <span className="text-2xl font-bold">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{participant.name}</h3>
              {participant.role && (
                <p className="text-blue-100">{participant.role}</p>
              )}
              {callContext && (
                <p className="text-blue-200 text-sm mt-1">{callContext}</p>
              )}
            </div>
          </div>

          {/* Additional Participants */}
          {additionalParticipants.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-blue-100 text-sm mb-2">
                <Users className="w-4 h-4" />
                <span>
                  +{additionalParticipants.length} other participant
                  {additionalParticipants.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex -space-x-2">
                {additionalParticipants.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center"
                    title={p.name}
                  >
                    {p.avatar ? (
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <span className="text-xs font-bold">
                        {p.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
                {additionalParticipants.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/30 flex items-center justify-center">
                    <span className="text-xs font-bold">
                      +{additionalParticipants.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Call Type Options */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Choose how you want to connect:
          </p>

          <div className="space-y-3">
            {/* Video Call */}
            <button
              onClick={() => handleStartCall("video")}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 rounded-xl border border-blue-200/50 dark:border-blue-700/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:scale-105 transition-all">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Video Call
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Face-to-face conversation
                </p>
              </div>
            </button>

            {/* Voice Call */}
            <button
              onClick={() => handleStartCall("voice")}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-900/50 dark:hover:to-green-900/50 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:scale-105 transition-all">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Voice Call
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Audio-only conversation
                </p>
              </div>
            </button>

            {/* Chat */}
            <button
              onClick={() => handleStartCall("chat")}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-900/50 dark:hover:to-violet-900/50 rounded-xl border border-purple-200/50 dark:border-purple-700/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:scale-105 transition-all">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Chat
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Send instant messages
                </p>
              </div>
            </button>
          </div>

          {/* Room Info */}
          <div className="mt-6 p-3 bg-gray-50 dark:bg-[#0f1115]/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Room ID: <span className="font-mono">{roomId.slice(0, 20)}...</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
              Share this ID with participants to join
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
