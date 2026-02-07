"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Video,
  Phone,
  Users,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommunication } from "@/contexts/CommunicationContext";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  getCommunicationManager,
  CallSession,
  ChatMessage,
} from "@/lib/services/communication";
import { stopAllMediaTracks } from "@/lib/utils/stopAllMedia";
import CallSettings, { CallSettingsState } from "./CallSettings";
import {
  CallHeader,
  ParticipantsPanel,
  LiveChatPanel,
  ControlBar,
  type Participant,
  type ChatMessage as UIChatMessage,
} from "./call-ui";

interface VoiceCallRoomProps {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isHost?: boolean;
  recipientName?: string;
  recipientAvatar?: string;
  meetingTitle?: string;
  onCallEnd?: () => void;
  onSwitchToVideo?: () => void;
  onError?: (error: Error) => void;
}

export default function VoiceCallRoom({
  roomId,
  userId,
  userName,
  userAvatar,
  isHost = false,
  recipientName,
  recipientAvatar,
  meetingTitle,
  onCallEnd,
  onSwitchToVideo,
  onError,
}: VoiceCallRoomProps) {
  const { settings, getBestAvailablePlatform } = useCommunication();
  const { settings: schoolSettings, currentTenant } = useSchoolSettings();
  const manager = getCommunicationManager();

  // Get tenant branding
  const primaryColor = currentTenant?.branding.primaryColor || "#2563eb";
  const secondaryColor = currentTenant?.branding.secondaryColor || "#1e40af";
  const tenantLogo = currentTenant?.branding.logo;
  const tenantName = currentTenant?.name || schoolSettings.schoolName;

  // State
  const [session, setSession] = useState<CallSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Audio controls
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);

  // UI panels
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Audio visualizer
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const animationRef = useRef<number | null>(null);

  // Store local stream reference for cleanup
  const localStreamRef = useRef<MediaStream | null>(null);

  // Call timer
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (session?.state === "connected" && session.startedAt) {
      interval = setInterval(() => {
        const startTime = new Date(session.startedAt!).getTime();
        const now = Date.now();
        setCallDuration(Math.floor((now - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session?.state, session?.startedAt]);

  // Audio visualizer animation
  useEffect(() => {
    if (session?.state === "connected" && !isMuted) {
      const interval = setInterval(() => {
        setAudioLevels(prev =>
          prev.map(() => 20 + Math.random() * 60)
        );
      }, 100);
      return () => {
        clearInterval(interval);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    } else {
      setAudioLevels([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
  }, [session?.state, isMuted]);

  // Initialize call
  useEffect(() => {
    const initCall = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        if (settings) {
          manager.setSettings(settings);
        }

        const platform = getBestAvailablePlatform("voice");

        const callSession = await manager.startCall(
          {
            roomId,
            userId,
            userName,
            userAvatar,
            isHost,
            type: "voice",
            enableVideo: false,
            enableAudio: true,
          },
          platform || undefined
        );

        setSession(callSession);
        setIsConnecting(false);

        const service = manager.getCurrentService();
        if (service) {
          // Store local stream reference for cleanup
          const webrtcService = service as { getLocalStream?: () => MediaStream | null };
          if (webrtcService.getLocalStream) {
            const localStream = webrtcService.getLocalStream();
            if (localStream) {
              localStreamRef.current = localStream;
            }
          }

          service.onParticipantJoined((participant) => {
            setSession((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                participants: [...prev.participants, participant],
              };
            });
          });

          service.onParticipantLeft((participantId) => {
            setSession((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                participants: prev.participants.filter((p) => p.id !== participantId),
              };
            });
          });

          service.onChatMessage((message) => {
            setMessages((prev) => [...prev, message]);
          });

          service.onCallStateChanged((state) => {
            if (state === "ended" || state === "failed") {
              onCallEnd?.();
            }
          });
        }
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        setIsConnecting(false);
        onError?.(error);
      }
    };

    initCall();

    return () => {
      // Cleanup on unmount - use nuclear option to stop ALL media
      console.log('[VoiceCallRoom] Component unmounting - calling nuclear cleanup');
      stopAllMediaTracks();
      localStreamRef.current = null;
    };
  }, [roomId, userId, userName, userAvatar, isHost, settings, getBestAvailablePlatform, onCallEnd, onError]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const service = manager.getCurrentService();
    if (service) {
      service.toggleAudio(!isMuted);
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // End call - SYNCHRONOUSLY stop all tracks first, then notify parent
  const endCall = useCallback(() => {
    console.log('[VoiceCallRoom] endCall triggered - starting immediate cleanup');

    // NUCLEAR OPTION FIRST: Stop ALL media tracks globally
    stopAllMediaTracks();

    // Clear stored ref
    localStreamRef.current = null;

    // Stop from service - call leaveRoom for signaling cleanup
    const service = manager.getCurrentService();
    if (service) {
      service.leaveRoom();
    }

    console.log('[VoiceCallRoom] endCall cleanup complete - calling parent callback');

    // Now safe to call parent callback
    onCallEnd?.();
  }, [onCallEnd]);

  // Send chat message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !session) return;

    const service = manager.getCurrentService();
    if (service) {
      await service.sendChatMessage({
        roomId: session.roomId,
        senderId: userId,
        senderName: userName,
        senderAvatar: userAvatar,
        content: content.trim(),
        type: "text",
        isRead: false,
      });
    }
  }, [session, userId, userName, userAvatar]);

  // Copy room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  // Handle settings save
  const handleSettingsSave = (settingsData: CallSettingsState) => {
    console.log("Settings saved:", settingsData);
  };

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Convert messages to UI format
  const uiMessages: UIChatMessage[] = messages.map((m) => ({
    id: m.id,
    senderId: m.senderId,
    senderName: m.senderName,
    senderAvatar: m.senderAvatar,
    content: m.content,
    timestamp: new Date(m.timestamp),
  }));

  // Convert participants to UI format
  const uiParticipants: Participant[] = session?.participants.map((p) => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    role: p.role,
    isMuted: p.isMuted,
    isVideoOff: true, // Voice call - no video
    isSpeaking: p.isSpeaking,
    isHost: p.id === session?.hostId,
  })) || [];

  // Unread message count
  const unreadMessageCount = messages.filter(
    (m) => !m.isRead && m.senderId !== userId
  ).length;

  // Loading state
  if (isConnecting) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}22 0%, ${secondaryColor}22 100%)`,
        }}
      >
        <div className="text-center">
          {/* Tenant Logo */}
          {tenantLogo && (
            <img
              src={tenantLogo}
              alt={tenantName}
              className="h-12 w-auto mx-auto mb-6 opacity-80"
            />
          )}

          {/* Calling Animation */}
          <div className="relative mb-4 sm:mb-6">
            {recipientAvatar ? (
              <img
                src={recipientAvatar}
                alt={recipientName || "Calling"}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full mx-auto shadow-2xl object-cover ring-2 ring-white/20"
              />
            ) : (
              <div
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-2 ring-white/20"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                <span className="text-3xl sm:text-4xl font-semibold text-white">
                  {(recipientName || "?").charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Ripple Effect */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="absolute -inset-3 rounded-full animate-pulse opacity-15"
              style={{ backgroundColor: primaryColor }}
            />
          </div>

          <p className="text-gray-800 dark:text-white text-xl font-semibold mb-1">
            Calling...
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {recipientName || "User"}
          </p>

          {/* Powered by branding */}
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-500">
            Powered by {tenantName}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}11 0%, ${secondaryColor}11 100%)`,
        }}
      >
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl mx-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <PhoneOff className="w-10 h-10" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-3">
            Connection Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={onCallEnd}
            className="px-8 py-3 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Get active participant (for 1:1 call display)
  const remoteParticipants = session?.participants.filter((p) => p.id !== userId) || [];
  const activeParticipant = remoteParticipants[0];

  return (
    <div className="relative flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <CallHeader
        title={meetingTitle || "Voice Call"}
        callType="voice"
        duration={callDuration}
        participantCount={session?.participants.length || 0}
        isRecording={false}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onClose={endCall}
        onSettings={() => setShowSettings(true)}
        onCopyRoomId={copyRoomId}
        roomId={roomId}
        className="z-10"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Main Voice Call Area */}
        <div
          className={cn(
          "flex-1 flex flex-col items-center justify-center relative",
          "transition-all duration-300",
          "bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
            (showParticipants || showChat) && "lg:mr-80"
          )}
        >
          {/* Avatar with Audio Visualizer */}
          <div className="relative mb-4 sm:mb-6">
            {/* Subtle animated ring */}
            <div
              className="absolute -inset-3 sm:-inset-4 rounded-full opacity-20 animate-pulse"
              style={{
                background: `radial-gradient(circle, ${primaryColor}40 0%, transparent 70%)`,
              }}
            />

            {/* Audio bars */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-end justify-center gap-0.5 h-24 w-24 sm:h-32 sm:w-32">
                {audioLevels.map((level, i) => (
                  <div
                    key={i}
                    className="w-0.5 sm:w-1 rounded-full transition-all duration-150 ease-out"
                    style={{
                      height: `${Math.max(8, level * 0.6)}%`,
                      background: primaryColor,
                      opacity: 0.25,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Avatar */}
            <div className="relative">
              {(activeParticipant?.avatar || recipientAvatar) ? (
                <img
                  src={activeParticipant?.avatar || recipientAvatar}
                  alt={activeParticipant?.name || recipientName || "User"}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-2xl ring-2 ring-gray-200 dark:ring-white/10 object-cover"
                />
              ) : (
                <div
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-gray-200 dark:ring-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  <span className="text-3xl sm:text-4xl font-semibold text-white">
                    {(activeParticipant?.name || recipientName || "?").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Speaking indicator */}
              {activeParticipant?.isSpeaking && (
                <div
                  className="absolute -inset-1 rounded-full animate-pulse"
                  style={{
                    boxShadow: `0 0 20px ${primaryColor}60`,
                    border: `2px solid ${primaryColor}60`,
                  }}
                />
              )}

              {/* Muted badge */}
              {activeParticipant?.isMuted && (
                <div className="absolute -bottom-0.5 -right-0.5 p-1.5 bg-red-500 rounded-full shadow-lg">
                  <MicOff className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Name and status */}
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1.5 text-center px-4">
            {activeParticipant?.name || recipientName || "Waiting..."}
          </h2>

          {/* Call status indicator */}
          <div
            className="px-2.5 sm:px-3 py-1 rounded-full text-gray-700 dark:text-white/80 text-xs sm:text-sm font-medium border border-gray-200 dark:border-transparent"
            style={{ backgroundColor: `${primaryColor}25` }}
          >
            {session?.state === "connected" ? "Connected" : "Connecting..."}
          </div>

          {/* Muted indicator */}
          {activeParticipant?.isMuted && (
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mt-3 bg-gray-200/60 dark:bg-gray-800/40 px-3 py-1.5 rounded-full">
              <MicOff className="w-3.5 h-3.5" />
              <span className="text-xs">Microphone muted</span>
            </div>
          )}

          {/* Multiple participants indicator */}
          {remoteParticipants.length > 1 && (
            <button
              onClick={() => setShowParticipants(true)}
              className="flex items-center gap-1.5 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white bg-gray-200/50 dark:bg-white/5 hover:bg-gray-300/50 dark:hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors mt-4 text-sm"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+{remoteParticipants.length - 1} more</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Extra Controls - Speaker & Switch to Video */}
          <div className="flex items-center gap-3 mt-8">
            {/* Speaker Toggle */}
            <button
              onClick={() => setIsSpeakerOff(!isSpeakerOff)}
              className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all",
                isSpeakerOff
                  ? "bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/30"
                  : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/80 hover:bg-gray-300 dark:hover:bg-white/15 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-white/10"
              )}
            >
              {isSpeakerOff ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {isSpeakerOff ? "Speaker Off" : "Speaker On"}
              </span>
            </button>

            {/* Switch to Video */}
            {onSwitchToVideo && (
              <button
                onClick={onSwitchToVideo}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-white border border-transparent hover:border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                <Video className="w-5 h-5" />
                <span className="text-sm font-medium">Switch to Video</span>
              </button>
            )}
          </div>
        </div>

        {/* Participants Panel - Desktop */}
        {showParticipants && (
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-80 z-20">
            <ParticipantsPanel
              participants={uiParticipants}
              currentUserId={userId}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              onClose={() => setShowParticipants(false)}
              className="h-full"
            />
          </div>
        )}

        {/* Chat Panel - Desktop */}
        {showChat && !showParticipants && (
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-80 z-20">
            <LiveChatPanel
              messages={uiMessages}
              currentUserId={userId}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              onClose={() => setShowChat(false)}
              onSendMessage={sendMessage}
              className="h-full"
            />
          </div>
        )}
      </div>

      {/* Mobile Panels - Full screen overlay */}
      {(showParticipants || showChat) && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900">
          {showParticipants && (
            <ParticipantsPanel
              participants={uiParticipants}
              currentUserId={userId}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              onClose={() => setShowParticipants(false)}
              className="h-full"
            />
          )}
          {showChat && !showParticipants && (
            <LiveChatPanel
              messages={uiMessages}
              currentUserId={userId}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              onClose={() => setShowChat(false)}
              onSendMessage={sendMessage}
              className="h-full"
            />
          )}
        </div>
      )}

      {/* Control Bar */}
      <ControlBar
        isMuted={isMuted}
        isVideoOff={true}
        isScreenSharing={false}
        isFullscreen={isFullscreen}
        isRecording={false}
        showChat={showChat}
        showParticipants={showParticipants}
        participantCount={session?.participants.length || 0}
        unreadMessageCount={unreadMessageCount}
        callType="voice"
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onToggleMute={toggleMute}
        onToggleVideo={() => {}} // Not applicable for voice
        onToggleScreenShare={() => {}} // Not applicable for voice
        onToggleFullscreen={toggleFullscreen}
        onToggleRecording={() => {}}
        onToggleChat={() => {
          setShowChat(!showChat);
          if (!showChat) setShowParticipants(false);
        }}
        onToggleParticipants={() => {
          setShowParticipants(!showParticipants);
          if (!showParticipants) setShowChat(false);
        }}
        onEndCall={endCall}
        onChangeLayout={() => {}}
        className="z-30"
      />

      {/* Settings Modal */}
      <CallSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsSave}
        showVideoSettings={false}
      />
    </div>
  );
}
