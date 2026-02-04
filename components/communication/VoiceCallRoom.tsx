"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Users,
  Volume2,
  VolumeX,
  X,
  Settings,
  Phone,
  MoreVertical,
  UserPlus,
  Copy,
  Video,
  ChevronRight,
} from "lucide-react";
import { useCommunication } from "@/contexts/CommunicationContext";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  getCommunicationManager,
  CallSession,
  CallParticipant,
  ChatMessage,
} from "@/lib/services/communication";
import { stopAllMediaTracks } from "@/lib/utils/stopAllMedia";
import CallSettings, { CallSettingsState } from "./CallSettings";

interface VoiceCallRoomProps {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isHost?: boolean;
  recipientName?: string;
  recipientAvatar?: string;
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
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Audio visualizer
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const animationRef = useRef<number | null>(null);

  // Store local stream reference for cleanup
  const localStreamRef = useRef<MediaStream | null>(null);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
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
      const animate = () => {
        setAudioLevels(prev =>
          prev.map(() => Math.random() * 100)
        );
        animationRef.current = requestAnimationFrame(animate);
      };
      // Slower animation
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

  // Format duration
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !session) return;

    const service = manager.getCurrentService();
    if (service) {
      await service.sendChatMessage({
        roomId: session.roomId,
        senderId: userId,
        senderName: userName,
        senderAvatar: userAvatar,
        content: newMessage.trim(),
        type: "text",
        isRead: false,
      });
      setNewMessage("");
    }
  }, [newMessage, session, userId, userName, userAvatar]);

  // Copy room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setShowMoreMenu(false);
  };

  // Handle settings save
  const handleSettingsSave = (settingsData: CallSettingsState) => {
    // Apply settings to call
    console.log("Settings saved:", settingsData);
  };

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

            {/* Ripple Effect - More subtle */}
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
    <div
      className="relative flex flex-col h-full"
      style={{
        background: `linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
      }}
    >
      {/* Header Section - Matches PageHeader pattern */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 py-3 sm:py-4 z-10">
        {/* Main row with title and actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Back button, Title, Duration */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Back/Close Button */}
            <button
              onClick={endCall}
              className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              title="End call and go back"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-white/70 hover:text-gray-700 dark:hover:text-white" />
            </button>

            {/* Page Title */}
            <div className="flex items-center gap-2 min-w-0">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: primaryColor }} />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Voice Call
              </h1>
              {session?.state === "connected" && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium text-white flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {formatDuration(callDuration)}
                </span>
              )}
            </div>
          </div>

          {/* Right: Recipient Info & More Options */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Recipient Info - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/10 rounded-lg">
              {recipientAvatar ? (
                <img
                  src={recipientAvatar}
                  alt={recipientName || "Recipient"}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                >
                  {(recipientName || "?").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-gray-700 dark:text-white/80 text-sm">{recipientName || "Calling..."}</span>
            </div>

            {/* More Options */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <MoreVertical className="w-5 h-5 text-gray-500 dark:text-white/70" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden py-1 z-[100]">
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={copyRoomId}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Room ID</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Participant</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-white/10 my-1" />
                  <button
                    onClick={endCall}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumbs row */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 ml-9 sm:ml-11">
          <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">
            Dashboard
          </span>
          <span>/</span>
          <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">
            Communication
          </span>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            Voice Call
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 pb-28 sm:pb-32">
        {/* Avatar with subtle Audio Visualizer */}
        <div className="relative mb-4 sm:mb-6">
          {/* Subtle animated ring */}
          <div
            className="absolute -inset-3 sm:-inset-4 rounded-full opacity-20 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${primaryColor}40 0%, transparent 70%)`,
            }}
          />

          {/* Audio bars - more subtle */}
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
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-2xl ring-2 ring-white/10 object-cover"
              />
            ) : (
              <div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-white/10"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                <span className="text-3xl sm:text-4xl font-semibold text-white">
                  {(activeParticipant?.name || recipientName || "?").charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Speaking indicator - subtle glow */}
            {activeParticipant?.isSpeaking && (
              <div
                className="absolute -inset-1 rounded-full animate-pulse"
                style={{
                  boxShadow: `0 0 20px ${primaryColor}60`,
                  border: `2px solid ${primaryColor}60`,
                }}
              />
            )}

            {/* Muted badge - smaller */}
            {activeParticipant?.isMuted && (
              <div className="absolute -bottom-0.5 -right-0.5 p-1.5 bg-red-500 rounded-full shadow-lg">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Name and status */}
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1.5 text-center px-4">
          {activeParticipant?.name || recipientName || "Waiting..."}
        </h2>

        {/* Call duration - sleeker */}
        <div
          className="px-2.5 sm:px-3 py-1 rounded-full text-white/80 text-xs sm:text-sm font-medium"
          style={{ backgroundColor: `${primaryColor}25` }}
        >
          {session?.state === "connected" ? formatDuration(callDuration) : "Connecting..."}
        </div>

        {/* Muted indicator - smaller */}
        {activeParticipant?.isMuted && (
          <div className="flex items-center gap-1.5 text-gray-400 mt-3 bg-gray-800/40 px-3 py-1.5 rounded-full">
            <MicOff className="w-3.5 h-3.5" />
            <span className="text-xs">Microphone muted</span>
          </div>
        )}

        {/* Multiple participants indicator */}
        {remoteParticipants.length > 1 && (
          <button
            onClick={() => setShowParticipants(true)}
            className="flex items-center gap-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors mt-4 text-sm"
          >
            <Users className="w-3.5 h-3.5" />
            <span>+{remoteParticipants.length - 1} more</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Controls - Modern Pill Design */}
      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 pb-4 sm:pb-6 md:pb-8">
        <div className="flex justify-center">
          <div className="bg-gray-900/90 backdrop-blur-2xl rounded-full px-2 sm:px-3 py-2 sm:py-2.5 shadow-2xl border border-white/10 flex items-center gap-1 sm:gap-1.5 md:gap-2">
            {/* Mute - Pill button */}
            <button
              onClick={toggleMute}
              className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 ${
                isMuted
                  ? "bg-red-500/90 text-white shadow-lg shadow-red-500/20"
                  : "bg-white/10 hover:bg-white/15 text-white/90 hover:text-white"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Mic className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
              <span className="hidden md:inline text-xs font-medium">{isMuted ? "Unmute" : "Mute"}</span>
            </button>

            {/* Speaker - Pill button */}
            <button
              onClick={() => setIsSpeakerOff(!isSpeakerOff)}
              className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 ${
                isSpeakerOff
                  ? "bg-red-500/90 text-white shadow-lg shadow-red-500/20"
                  : "bg-white/10 hover:bg-white/15 text-white/90 hover:text-white"
              }`}
              title={isSpeakerOff ? "Speaker on" : "Speaker off"}
            >
              {isSpeakerOff ? <VolumeX className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Volume2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
              <span className="hidden md:inline text-xs font-medium">Speaker</span>
            </button>

            {/* Switch to Video - Pill button */}
            {onSwitchToVideo && (
              <button
                onClick={onSwitchToVideo}
                className="group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 bg-white/10 hover:bg-white/15 text-white/90 hover:text-white"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}40, ${secondaryColor}40)`,
                }}
                title="Switch to video call"
              >
                <Video className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <span className="hidden md:inline text-xs font-medium">Video</span>
              </button>
            )}

            {/* Divider */}
            <div className="w-px h-6 sm:h-8 bg-white/10 mx-0.5 sm:mx-1" />

            {/* End call - Prominent pill */}
            <button
              onClick={endCall}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/40"
              title="End call"
            >
              <PhoneOff className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white" />
              <span className="hidden md:inline text-xs font-medium text-white">End</span>
            </button>

            {/* Divider - hidden on very small screens */}
            <div className="hidden sm:block w-px h-6 sm:h-8 bg-white/10 mx-0.5 sm:mx-1" />

            {/* Chat - Pill button - hidden on very small screens, icon only on small */}
            <button
              onClick={() => {
                setShowChat(!showChat);
                setShowParticipants(false);
              }}
              className={`hidden sm:flex group relative items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 ${
                showChat
                  ? "text-white shadow-lg"
                  : "bg-white/10 hover:bg-white/15 text-white/90 hover:text-white"
              }`}
              style={showChat ? { backgroundColor: primaryColor, boxShadow: `0 4px 12px ${primaryColor}40` } : {}}
              title="Chat"
            >
              <MessageSquare className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline text-xs font-medium">Chat</span>
              {messages.filter((m) => !m.isRead && m.senderId !== userId).length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] bg-red-500 rounded-full text-[9px] sm:text-[10px] flex items-center justify-center font-semibold px-0.5 sm:px-1">
                  {messages.filter((m) => !m.isRead && m.senderId !== userId).length}
                </span>
              )}
            </button>

            {/* Participants - Pill button (show only if more than 2) - hidden on small screens */}
            {session && session.participants.length > 2 && (
              <button
                onClick={() => {
                  setShowParticipants(!showParticipants);
                  setShowChat(false);
                }}
                className={`hidden md:flex group relative items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 ${
                  showParticipants
                    ? "text-white shadow-lg"
                    : "bg-white/10 hover:bg-white/15 text-white/90 hover:text-white"
                }`}
                style={showParticipants ? { backgroundColor: primaryColor, boxShadow: `0 4px 12px ${primaryColor}40` } : {}}
                title="Participants"
              >
                <Users className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <span
                  className="min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] rounded-full text-[9px] sm:text-[10px] flex items-center justify-center font-semibold text-white px-0.5 sm:px-1"
                  style={{ backgroundColor: showParticipants ? 'rgba(255,255,255,0.2)' : primaryColor }}
                >
                  {session.participants.length}
                </span>
              </button>
            )}

            {/* Settings - Icon only pill - hidden on very small screens */}
            <button
              onClick={() => setShowSettings(true)}
              className="hidden sm:flex p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/15 transition-all duration-200 text-white/90 hover:text-white"
              title="Settings"
            >
              <Settings className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="absolute right-0 top-[72px] sm:top-[80px] bottom-0 w-full sm:w-80 md:w-96 bg-gray-900/98 backdrop-blur-xl border-l border-white/10 flex flex-col">
          <div className="p-3 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold text-white text-base sm:text-lg">Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p className="text-lg">No messages yet</p>
                <p className="text-sm mt-1">Start the conversation</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.senderId === userId
                        ? "text-white"
                        : "bg-white/10 text-white"
                    }`}
                    style={
                      message.senderId === userId
                        ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }
                        : {}
                    }
                  >
                    {message.senderId !== userId && (
                      <p className="text-xs text-white/70 mb-1 font-medium">{message.senderName}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-white/50 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRing: primaryColor } as any}
              />
              <button
                onClick={sendMessage}
                className="px-5 py-3 text-white rounded-xl transition-all hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participants Panel */}
      {showParticipants && (
        <div className="absolute right-0 top-[72px] sm:top-[80px] bottom-0 w-full sm:w-80 md:w-96 bg-gray-900/98 backdrop-blur-xl border-l border-white/10 flex flex-col">
          <div className="p-3 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold text-white text-base sm:text-lg">
              Participants ({session?.participants.length || 0})
            </h3>
            <button
              onClick={() => setShowParticipants(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {session?.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
              >
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full ring-2 ring-white/10 object-cover"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white/10 text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    }}
                  >
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-white">
                    {participant.name}
                    {participant.id === userId && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{participant.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  {participant.isMuted && <MicOff className="w-4 h-4 text-red-400" />}
                  {participant.isSpeaking && (
                    <div
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add participant button */}
          <div className="p-4 border-t border-white/10">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl transition-all hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              <UserPlus className="w-5 h-5" />
              Add Participant
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <CallSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsSave}
        showVideoSettings={false}
      />

      {/* Click outside to close more menu */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMoreMenu(false)}
        />
      )}
    </div>
  );
}
