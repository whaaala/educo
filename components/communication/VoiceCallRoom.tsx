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
  Copy,
  Monitor,
  MonitorOff,
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
import AddParticipantModal from "./AddParticipantModal";
import {
  CallHeader,
  ParticipantsPanel,
  LiveChatPanel,
  ControlBar,
  type Participant,
  type ChatMessage as UIChatMessage,
} from "./call-ui";
import { ReactionOverlay, useReactionOverlay } from "./call-ui/ReactionOverlay";
import { WhiteboardPanel } from "./call-ui/WhiteboardPanel";
import { WhiteboardThumbnail } from "@/components/shared/Whiteboard";
import type { WhiteboardElement } from "@/components/shared/Whiteboard";
import CallConnecting from "./CallConnecting";

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
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [invitedParticipants, setInvitedParticipants] = useState<{ id: string; name: string; avatar?: string }[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Recording, screen sharing, layout
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [layout, setLayout] = useState<"spotlight" | "grid">("spotlight");
  const screenShareStreamRef = useRef<MediaStream | null>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement | null>(null);

  // Reactions
  const { reactions: floatingReactions, addReaction } = useReactionOverlay();

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Audio visualizer
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const animationRef = useRef<number | null>(null);

  // Store local stream reference for cleanup
  const localStreamRef = useRef<MediaStream | null>(null);

  // Track whether we're switching to video (to skip nuclear cleanup on unmount)
  const isSwitchingToVideoRef = useRef(false);

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
      if (isSwitchingToVideoRef.current) {
        // Upgrading to video - skip nuclear cleanup so VideoCallRoom can reuse the connection
        console.log('[VoiceCallRoom] Switching to video - skipping nuclear cleanup');
      } else {
        // Normal unmount - use nuclear option to stop ALL media
        console.log('[VoiceCallRoom] Component unmounting - calling nuclear cleanup');
        stopAllMediaTracks();
      }
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
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(!!document.fullscreenElement);
    }
  }, []);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => !prev);
  }, []);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach((track) => track.stop());
        screenShareStreamRef.current = null;
      }
      setScreenShareStream(null);
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenShareStreamRef.current = stream;
        setScreenShareStream(stream);
        setIsScreenSharing(true);

        // Listen for user stopping share via browser UI
        stream.getVideoTracks()[0]?.addEventListener("ended", () => {
          screenShareStreamRef.current = null;
          setScreenShareStream(null);
          setIsScreenSharing(false);
        });
      } catch (err) {
        // User cancelled or error - do nothing
        console.warn("Screen share cancelled or failed:", err);
      }
    }
  }, [isScreenSharing]);

  // Callback ref that sets srcObject whenever a video element mounts (handles layout switches)
  const setScreenShareVideoRef = useCallback(
    (el: HTMLVideoElement | null) => {
      screenShareVideoRef.current = el;
      if (el && screenShareStream) {
        el.srcObject = screenShareStream;
        el.play().catch(() => {});
      }
    },
    [screenShareStream]
  );

  // Stable callback ref for the screen share thumbnail video (separate from the main one)
  const setScreenShareThumbRef = useCallback(
    (el: HTMLVideoElement | null) => {
      if (el && screenShareStream) {
        el.srcObject = screenShareStream;
        el.play().catch(() => {});
      }
    },
    [screenShareStream]
  );

  // Clean up screen share on unmount
  useEffect(() => {
    return () => {
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach((track) => track.stop());
        screenShareStreamRef.current = null;
      }
    };
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
      <CallConnecting
        callType="voice"
        recipientName={recipientName}
        recipientAvatar={recipientAvatar}
        tenantName={tenantName}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 midnight:from-[#060a1a] midnight:via-[#0f1729] midnight:to-[#060a1a] purple:from-[#120622] purple:via-[#2a1a3e] purple:to-[#120622]"
      >
        <div className="text-center max-w-md p-8 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-3xl shadow-2xl mx-4 midnight:border midnight:border-cyan-500/20 purple:border purple:border-pink-500/20">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <PhoneOff className="w-10 h-10" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-2xl font-bold mb-3">
            Connection Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-6">{error}</p>
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

  // Compute who should be shown in the main spotlight view
  const spotlightPerson = (() => {
    if (focusedId === "local") {
      return { id: userId, name: userName, avatar: userAvatar, isMuted, isSpeaking: false, isWaiting: false, isLocal: true };
    }
    if (focusedId === "recipient") {
      return { id: "recipient", name: recipientName || "Participant", avatar: recipientAvatar, isMuted: false, isSpeaking: false, isWaiting: true, isLocal: false };
    }
    if (focusedId) {
      const remote = remoteParticipants.find(p => p.id === focusedId);
      if (remote) return { id: remote.id, name: remote.name, avatar: remote.avatar || undefined, isMuted: remote.isMuted, isSpeaking: remote.isSpeaking, isWaiting: false, isLocal: false };
      const invited = invitedParticipants.find(p => p.id === focusedId);
      if (invited) return { id: invited.id, name: invited.name, avatar: invited.avatar, isMuted: false, isSpeaking: false, isWaiting: true, isLocal: false };
    }
    // Default: show active participant or waiting recipient
    if (activeParticipant) return { id: activeParticipant.id, name: activeParticipant.name, avatar: activeParticipant.avatar || recipientAvatar, isMuted: activeParticipant.isMuted, isSpeaking: activeParticipant.isSpeaking, isWaiting: false, isLocal: false };
    return { id: "recipient", name: recipientName || "Participant", avatar: recipientAvatar, isMuted: false, isSpeaking: false, isWaiting: true, isLocal: false };
  })();

  return (
    <div className="relative flex flex-col h-full bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#060a1a] purple:bg-[#120622]">
      {/* Header */}
      <CallHeader
        title={meetingTitle || "Voice Call"}
        callType="voice"
        duration={callDuration}
        participantCount={session?.participants.length || 0}
        isRecording={isRecording}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onClose={endCall}
        onSettings={() => setShowSettings(true)}
        onAddParticipant={() => setShowAddParticipant(true)}
        onCopyRoomId={copyRoomId}
        roomId={roomId}
        className="z-10"
      />

      {/* Floating Reaction Overlay */}
      <ReactionOverlay reactions={floatingReactions} />

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col p-2 sm:p-3 lg:p-4 overflow-hidden">
          {/* Whiteboard View (replaces primary area, keeps thumbnails) */}
          {showWhiteboard && !focusedId && (
            <div className="flex-1 flex gap-2 sm:gap-3 lg:gap-4 min-h-0">
              <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4 min-h-0">
                {/* Whiteboard (main area) */}
                <div className="flex-1 relative rounded-xl sm:rounded-2xl overflow-hidden min-h-0 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0f1a] purple:bg-[#120622] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <WhiteboardPanel
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    onClose={() => setShowWhiteboard(false)}
                    onChange={(state) => setWhiteboardElements(state.elements)}
                  />
                </div>

                {/* Thumbnail strip (right side on desktop) */}
                <div className="hidden lg:flex lg:flex-col gap-2 overflow-y-auto lg:w-40 xl:w-48 p-1">
                  {/* Whiteboard active thumbnail */}
                  <div
                    className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer bg-white dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33]"
                    style={{ boxShadow: `0 0 0 2px ${primaryColor}` }}
                  >
                    <WhiteboardThumbnail elements={whiteboardElements} className="w-full h-full" />
                    <div className="absolute bottom-1.5 left-1.5">
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                        Board
                      </span>
                    </div>
                  </div>

                  {/* Screen share thumbnail (when active) */}
                  {screenShareStream && (
                    <div
                      onClick={() => { setFocusedId("screen-share"); }}
                      className="relative flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <video
                        ref={(el) => {
                          if (el && screenShareStream) {
                            el.srcObject = screenShareStream;
                          }
                        }}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1.5 left-1.5">
                        <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white flex items-center gap-1">
                          <Monitor className="w-2.5 h-2.5" />
                          Screen
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Local user thumbnail */}
                  <div
                    onClick={() => { setFocusedId("local"); }}
                    className={cn(
                      "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all",
                      "w-full aspect-video"
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                      {userAvatar ? (
                        <img src={userAvatar} alt={userName} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                        >
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white">You</span>
                      {isMuted && (
                        <span className="p-1 bg-red-500 rounded-md"><MicOff className="w-2.5 h-2.5 text-white" /></span>
                      )}
                    </div>
                  </div>

                  {/* Recipient waiting thumbnail */}
                  {remoteParticipants.length === 0 && (
                    <div
                      onClick={() => { setFocusedId("recipient"); }}
                      className="relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {recipientAvatar ? (
                          <img src={recipientAvatar} alt={recipientName || "Recipient"} className="w-12 h-12 rounded-full object-cover opacity-50" />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white opacity-50"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          >
                            {(recipientName || "?").charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                          {recipientName || "Participant"}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* Remote participants thumbnails */}
                  {remoteParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      onClick={() => { setFocusedId(participant.id); }}
                      className="relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {participant.avatar ? (
                          <img src={participant.avatar} alt={participant.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          >
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                          {participant.name}
                        </span>
                        {participant.isMuted && (
                          <span className="p-1 bg-red-500 rounded-md"><MicOff className="w-2.5 h-2.5 text-white" /></span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Invited participants thumbnails */}
                  {invitedParticipants.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => { setFocusedId(p.id); }}
                      className="relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {p.avatar ? (
                          <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover opacity-50" />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white opacity-50"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          >
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                          {p.name}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Screen Share View (spotlight layout) */}
          {(!showWhiteboard || focusedId) && screenShareStream && layout === "spotlight" && (
            <div className="flex-1 flex gap-2 sm:gap-3 lg:gap-4 min-h-0">
              {/* Main view: screen share (default) or focused person */}
              {(!focusedId || focusedId === "screen-share") ? (
                <div className="flex-1 relative bg-gray-200 dark:bg-[#0f1115] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl sm:rounded-2xl overflow-hidden">
                  <video
                    ref={setScreenShareVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <div
                      className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-white text-xs sm:text-sm font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">You are sharing</span>
                      <span className="sm:hidden">Sharing</span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2">
                    <button
                      onClick={toggleScreenShare}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-medium shadow-lg cursor-pointer"
                    >
                      <MonitorOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Stop Sharing</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 relative bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl sm:rounded-2xl overflow-hidden min-h-0">
                  {!spotlightPerson.isWaiting ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="flex items-end justify-center gap-1 h-48 w-48 sm:h-56 sm:w-56">
                            {audioLevels.map((level, i) => (
                              <div key={i} className="w-1 sm:w-1.5 rounded-full transition-all duration-150 ease-out" style={{ height: `${Math.max(8, level * 0.6)}%`, background: primaryColor, opacity: 0.15 }} />
                            ))}
                          </div>
                        </div>
                        {spotlightPerson.avatar ? (
                          <img src={spotlightPerson.avatar} alt={spotlightPerson.name} className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full relative z-10 object-cover" />
                        ) : (
                          <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white relative z-10" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                            {spotlightPerson.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2">
                        <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {spotlightPerson.name}{spotlightPerson.isLocal ? " (You)" : ""}
                        </span>
                        {spotlightPerson.isMuted && (
                          <span className="p-1 sm:p-1.5 bg-red-500 rounded-lg"><MicOff className="w-3 h-3 sm:w-4 sm:h-4 text-white" /></span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {spotlightPerson.avatar ? (
                          <img src={spotlightPerson.avatar} alt={spotlightPerson.name} className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full object-cover opacity-50" />
                        ) : (
                          <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white opacity-50" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                            {spotlightPerson.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16 sm:translate-y-20">
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 dark:bg-black/60 backdrop-blur rounded-full">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-gray-600 dark:text-white/70 text-xs sm:text-sm">Waiting to join...</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                        <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{spotlightPerson.name}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Sidebar thumbnails during screen share */}
              <div className="hidden sm:flex w-44 lg:w-52 flex-col gap-2 lg:gap-3 overflow-y-auto p-1">
                {/* Screen share thumbnail */}
                <div
                  onClick={() => setFocusedId("screen-share")}
                  className={cn(
                    "relative aspect-video bg-gray-900 rounded-xl overflow-hidden flex-shrink-0 shadow-lg cursor-pointer transition-all",
                    (!focusedId || focusedId === "screen-share") && "ring-2 ring-blue-500"
                  )}
                >
                  <video
                    ref={(focusedId && focusedId !== "screen-share") ? setScreenShareVideoRef : setScreenShareThumbRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-contain cursor-pointer"
                  />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] lg:text-xs font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <Monitor className="w-2.5 h-2.5" />
                      Screen
                    </span>
                  </div>
                </div>

                {/* Whiteboard thumbnail (click to switch to whiteboard view) */}
                {showWhiteboard && (
                  <div
                    onClick={() => { setFocusedId(null); }}
                    className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all bg-white dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33]"
                  >
                    <WhiteboardThumbnail elements={whiteboardElements} className="w-full h-full" />
                    <div className="absolute bottom-1.5 left-1.5">
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                        Board
                      </span>
                    </div>
                  </div>
                )}

                {/* Local user */}
                <div
                  onClick={() => setFocusedId(focusedId === "local" ? "screen-share" : "local")}
                  className={cn(
                    "relative aspect-video bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden flex-shrink-0 shadow-lg cursor-pointer transition-all",
                    focusedId === "local" && "ring-2 ring-blue-500"
                  )}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-lg lg:text-xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] lg:text-xs font-medium text-gray-900 dark:text-white">You</span>
                    {isMuted && (<span className="p-1 bg-red-500 rounded-md"><MicOff className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" /></span>)}
                  </div>
                </div>

                {/* Recipient waiting thumbnail */}
                {remoteParticipants.length === 0 && (
                  <div
                    onClick={() => setFocusedId(focusedId === "recipient" ? null : "recipient")}
                    className={cn(
                      "relative aspect-video bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden flex-shrink-0 shadow-lg cursor-pointer transition-all",
                      focusedId === "recipient" && "ring-2 ring-blue-500"
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                      {recipientAvatar ? (
                        <img src={recipientAvatar} alt={recipientName || "Recipient"} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover opacity-50" />
                      ) : (
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-lg lg:text-xl font-bold text-white opacity-50" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                          {(recipientName || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] lg:text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">{recipientName || "Participant"}</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Remote participants */}
                {remoteParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    onClick={() => setFocusedId(focusedId === participant.id ? null : participant.id)}
                    className={cn(
                      "relative aspect-video bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden flex-shrink-0 shadow-lg cursor-pointer transition-all",
                      focusedId === participant.id ? "ring-2 ring-blue-500" : participant.isSpeaking && "ring-2 ring-green-500"
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                      {participant.avatar ? (
                        <img src={participant.avatar} alt={participant.name} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-lg lg:text-xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] lg:text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">{participant.name}</span>
                      {participant.isMuted && (<span className="p-1 bg-red-500 rounded-md"><MicOff className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" /></span>)}
                    </div>
                  </div>
                ))}

                {/* Invited participants */}
                {invitedParticipants.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setFocusedId(focusedId === p.id ? null : p.id)}
                    className={cn(
                      "relative aspect-video bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden flex-shrink-0 shadow-lg cursor-pointer transition-all",
                      focusedId === p.id && "ring-2 ring-blue-500"
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                      {p.avatar ? (
                        <img src={p.avatar} alt={p.name} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover opacity-50" />
                      ) : (
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-lg lg:text-xl font-bold text-white opacity-50" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] lg:text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">{p.name}</span>
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voice Call - Spotlight Layout */}
          {(!showWhiteboard || focusedId) && !screenShareStream && layout === "spotlight" && (
            <div className="flex-1 flex gap-2 sm:gap-3 lg:gap-4 min-h-0">
              <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4 min-h-0">
                {/* Primary Tile (large) */}
                <div className="flex-1 relative bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl sm:rounded-2xl overflow-hidden min-h-0">
                  {!spotlightPerson.isWaiting ? (
                    <>
                      {/* Focused person avatar */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {/* Audio visualizer bars behind avatar */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="flex items-end justify-center gap-1 h-48 w-48 sm:h-56 sm:w-56">
                            {audioLevels.map((level, i) => (
                              <div
                                key={i}
                                className="w-1 sm:w-1.5 rounded-full transition-all duration-150 ease-out"
                                style={{
                                  height: `${Math.max(8, level * 0.6)}%`,
                                  background: primaryColor,
                                  opacity: 0.15,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        {spotlightPerson.avatar ? (
                          <img
                            src={spotlightPerson.avatar}
                            alt={spotlightPerson.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full relative z-10 object-cover"
                          />
                        ) : (
                          <div
                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white relative z-10"
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                            }}
                          >
                            {spotlightPerson.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      {/* Name badge */}
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2">
                        <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {spotlightPerson.name}{spotlightPerson.isLocal ? " (You)" : ""}
                        </span>
                        {spotlightPerson.isMuted && (
                          <span className="p-1 sm:p-1.5 bg-red-500 rounded-lg">
                            <MicOff className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </span>
                        )}
                        {spotlightPerson.isSpeaking && (
                          <span
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full animate-pulse"
                            style={{ backgroundColor: primaryColor }}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    // Waiting person - show with reduced opacity
                    <>
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {spotlightPerson.avatar ? (
                          <img
                            src={spotlightPerson.avatar}
                            alt={spotlightPerson.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full object-cover opacity-50"
                          />
                        ) : (
                          <div
                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white opacity-50"
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                            }}
                          >
                            {spotlightPerson.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      {/* Waiting badge */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16 sm:translate-y-20">
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 dark:bg-black/60 backdrop-blur rounded-full">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-gray-600 dark:text-white/70 text-xs sm:text-sm">
                            Waiting to join...
                          </span>
                        </div>
                      </div>
                      {/* Name badge */}
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2">
                        <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {spotlightPerson.name}
                        </span>
                      </div>
                      {/* Room ID at bottom */}
                      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-white/50 text-xs">
                          <span className="hidden sm:inline">Room ID:</span>
                          <code className="px-2 py-1 bg-gray-200/80 dark:bg-black/40 backdrop-blur rounded text-xs text-gray-700 dark:text-gray-300">
                            {roomId.slice(0, 12)}...
                          </code>
                          <button
                            onClick={copyRoomId}
                            className="p-1 hover:bg-gray-300/50 dark:hover:bg-white/10 rounded transition-colors text-gray-500 dark:text-white/50"
                            title="Copy Room ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                </div>

                {/* Thumbnail strip (right side on desktop) */}
                <div className="hidden lg:flex lg:flex-col gap-2 overflow-y-auto lg:w-40 xl:w-48 p-1">
                  {/* Whiteboard thumbnail (click to switch to whiteboard view) */}
                  {showWhiteboard && (
                    <div
                      onClick={() => { setFocusedId(null); }}
                      className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all bg-white dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33]"
                    >
                      <WhiteboardThumbnail elements={whiteboardElements} className="w-full h-full" />
                      <div className="absolute bottom-1.5 left-1.5">
                        <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                          Board
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Local user thumbnail */}
                  <div
                    onClick={() => setFocusedId(focusedId === "local" ? null : "local")}
                    className={cn(
                      "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all",
                      "w-full aspect-video",
                      focusedId === "local" && "ring-2 ring-blue-500"
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                          }}
                        >
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white">
                        You
                      </span>
                      {isMuted && (
                        <span className="p-1 bg-red-500 rounded-md">
                          <MicOff className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recipient waiting thumbnail - shown when alone */}
                  {remoteParticipants.length === 0 && (
                    <div
                      onClick={() => setFocusedId(focusedId === "recipient" ? null : "recipient")}
                      className={cn(
                        "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer transition-all",
                        focusedId === "recipient" && "ring-2 ring-blue-500"
                      )}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {recipientAvatar ? (
                          <img src={recipientAvatar} alt={recipientName || "Recipient"} className="w-12 h-12 rounded-full object-cover opacity-50" />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white opacity-50"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          >
                            {(recipientName || "?").charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                          {recipientName || "Participant"}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* Remote participants thumbnails */}
                  {remoteParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      onClick={() => setFocusedId(focusedId === participant.id ? null : participant.id)}
                      className={cn(
                        "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all",
                        "w-full aspect-video",
                        focusedId === participant.id ? "ring-2 ring-blue-500" : participant.isSpeaking && "ring-2 ring-green-500"
                      )}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {participant.avatar ? (
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                            }}
                          >
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                          {participant.name}
                        </span>
                        {participant.isMuted && (
                          <span className="p-1 bg-red-500 rounded-md">
                            <MicOff className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Invited participants thumbnails */}
                  {invitedParticipants.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setFocusedId(focusedId === p.id ? null : p.id)}
                      className={cn(
                        "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer transition-all",
                        focusedId === p.id && "ring-2 ring-blue-500"
                      )}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {p.avatar ? (
                          <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover opacity-50" />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white opacity-50"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          >
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                          {p.name}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      </div>
                    </div>
                  ))}

                  {/* More participants indicator */}
                  {remoteParticipants.length > 4 && (
                    <button
                      onClick={() => setShowParticipants(true)}
                      className="relative flex-shrink-0 bg-gray-200/80 dark:bg-[#1a1d24]/80 midnight:bg-[#0d1220]/80 purple:bg-[#1f0d33]/80 rounded-xl overflow-hidden shadow-lg cursor-pointer w-full aspect-video flex items-center justify-center hover:bg-gray-300/80 dark:hover:bg-[#22262e]/80 midnight:hover:bg-cyan-900/30 purple:hover:bg-pink-900/30 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <div className="text-center">
                        <div
                          className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                            boxShadow: `0 4px 14px ${primaryColor}40`,
                          }}
                        >
                          +{remoteParticipants.length - 4}
                        </div>
                        <span className="text-gray-600 dark:text-white/70 midnight:text-cyan-200/70 purple:text-pink-200/70 text-xs mt-1.5 block font-medium">
                          more
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Voice Call - Grid Layout */}
          {(!showWhiteboard || focusedId) && layout === "grid" && (() => {
            // Count rendered tiles: local user + remotes + invited + waiting placeholder if alone + screen share if active
            const baseCount = remoteParticipants.length === 0
              ? 2 + invitedParticipants.length  // local user + "waiting for others" placeholder + invited
              : 1 + remoteParticipants.length + invitedParticipants.length;  // local user + remotes + invited
            const gridItemCount = baseCount + (screenShareStream ? 1 : 0);
            return (
            <div className="flex-1 flex gap-2 sm:gap-3 lg:gap-4 min-h-0">
            <div
              className={cn(
                "flex-1 grid gap-2 sm:gap-3 lg:gap-4 min-h-0 auto-rows-fr",
                gridItemCount <= 1 && "grid-cols-1",
                gridItemCount === 2 && "grid-cols-1 sm:grid-cols-2",
                gridItemCount >= 3 && gridItemCount <= 4 && "grid-cols-2",
                gridItemCount >= 5 && gridItemCount <= 6 && "grid-cols-2 lg:grid-cols-3",
                gridItemCount >= 7 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
              )}
            >
              {/* Local user tile */}
              <div className="relative bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl sm:rounded-2xl overflow-hidden min-h-0">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                  {/* Audio visualizer for local user */}
                  {!isMuted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex items-end justify-center gap-0.5 h-24 w-24 sm:h-32 sm:w-32">
                        {audioLevels.slice(0, 5).map((level, i) => (
                          <div
                            key={i}
                            className="w-1 rounded-full transition-all duration-150 ease-out"
                            style={{
                              height: `${Math.max(8, level * 0.4)}%`,
                              background: primaryColor,
                              opacity: 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover relative z-10"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white relative z-10"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-2">
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-[10px] sm:text-xs font-medium text-gray-900 dark:text-white">
                    {userName} (You)
                  </span>
                  {isMuted && (
                    <span className="p-0.5 sm:p-1 bg-red-500 rounded-md">
                      <MicOff className="w-3 h-3 text-white" />
                    </span>
                  )}
                </div>
              </div>

              {/* Remote participant tiles */}
              {remoteParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className={cn(
                    "relative bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl sm:rounded-2xl overflow-hidden min-h-0",
                    participant.isSpeaking && "ring-2 ring-green-500"
                  )}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-[10px] sm:text-xs font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                      {participant.name}
                    </span>
                    {participant.isMuted && (
                      <span className="p-0.5 sm:p-1 bg-red-500 rounded-md">
                        <MicOff className="w-3 h-3 text-white" />
                      </span>
                    )}
                    {participant.isSpeaking && (
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: primaryColor }}
                      />
                    )}
                  </div>
                </div>
              ))}

              {/* Screen share tile (shown in grid when screen sharing) */}
              {screenShareStream && (
                <div className="relative bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden min-h-0">
                  <video
                    ref={setScreenShareVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>You are sharing</span>
                    </div>
                  </div>
                  {isScreenSharing && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <button
                        onClick={toggleScreenShare}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-medium shadow-lg cursor-pointer"
                      >
                        <MonitorOff className="w-3.5 h-3.5" />
                        <span>Stop Sharing</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Invited participant tiles */}
              {invitedParticipants.map((p) => (
                <div
                  key={p.id}
                  className="relative bg-gray-200/60 dark:bg-[#1a1d24]/50 midnight:bg-[#0d1220]/50 purple:bg-[#1f0d33]/50 rounded-xl sm:rounded-2xl overflow-hidden min-h-0 border-2 border-dashed border-gray-300 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    {p.avatar ? (
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover opacity-50"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white opacity-50"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                        {p.name} — invited
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Recipient tile - waiting to join (only when alone) */}
              {remoteParticipants.length === 0 && (
                <div className="relative bg-gray-200/60 dark:bg-[#1a1d24]/50 midnight:bg-[#0d1220]/50 purple:bg-[#1f0d33]/50 rounded-xl sm:rounded-2xl overflow-hidden min-h-0 border-2 border-dashed border-gray-300 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    {recipientAvatar ? (
                      <img
                        src={recipientAvatar}
                        alt={recipientName || "Recipient"}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover opacity-40"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white opacity-40"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        {(recipientName || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                        {recipientName || "Participant"} — waiting to join
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail strip (right side on desktop) */}
            <div className="hidden lg:flex lg:flex-col gap-2 overflow-y-auto lg:w-36 xl:w-44 p-1">
              {/* Whiteboard thumbnail (click to switch to whiteboard view) */}
              {showWhiteboard && (
                <div
                  onClick={() => { setFocusedId(null); }}
                  className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all bg-white dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33]"
                >
                  <WhiteboardThumbnail elements={whiteboardElements} className="w-full h-full" />
                  <div className="absolute bottom-1.5 left-1.5">
                    <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                      Board
                    </span>
                  </div>
                </div>
              )}

              {/* Screen share thumbnail (shown in grid when screen sharing) */}
              {screenShareStream && (
                <div className="relative flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden shadow-lg w-full aspect-video">
                  <video
                    ref={setScreenShareThumbRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <Monitor className="w-2.5 h-2.5" /> Screen
                    </span>
                  </div>
                </div>
              )}

              {/* Local user thumbnail */}
              <div
                className={cn(
                  "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg",
                  "w-full aspect-video"
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white">
                    You
                  </span>
                  {isMuted && (
                    <span className="p-1 bg-red-500 rounded-md">
                      <MicOff className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </div>
              </div>

              {/* Recipient waiting thumbnail - shown when alone */}
              {remoteParticipants.length === 0 && (
                <div className="relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg w-full aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                    {recipientAvatar ? (
                      <img src={recipientAvatar} alt={recipientName || "Recipient"} className="w-12 h-12 rounded-full object-cover opacity-50" />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white opacity-50"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                      >
                        {(recipientName || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                      {recipientName || "Participant"}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Remote participants thumbnails */}
              {remoteParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className={cn(
                    "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg",
                    "w-full aspect-video",
                    participant.isSpeaking && "ring-2 ring-green-500"
                  )}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                      {participant.name}
                    </span>
                    {participant.isMuted && (
                      <span className="p-1 bg-red-500 rounded-md">
                        <MicOff className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Invited participants thumbnails */}
              {invitedParticipants.map((p) => (
                <div key={p.id} className="relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg w-full aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover opacity-50" />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white opacity-50"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                      {p.name}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                </div>
              ))}

              {/* More participants indicator */}
              {remoteParticipants.length > 4 && (
                <button
                  onClick={() => setShowParticipants(true)}
                  className="relative flex-shrink-0 bg-gray-200/80 dark:bg-[#1a1d24]/80 midnight:bg-[#0d1220]/80 purple:bg-[#1f0d33]/80 rounded-xl overflow-hidden shadow-lg cursor-pointer w-full aspect-video flex items-center justify-center hover:bg-gray-300/80 dark:hover:bg-[#22262e]/80 midnight:hover:bg-cyan-900/30 purple:hover:bg-pink-900/30 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <div className="text-center">
                    <div
                      className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        boxShadow: `0 4px 14px ${primaryColor}40`,
                      }}
                    >
                      +{remoteParticipants.length - 4}
                    </div>
                    <span className="text-gray-600 dark:text-white/70 midnight:text-cyan-200/70 purple:text-pink-200/70 text-xs mt-1.5 block font-medium">
                      more
                    </span>
                  </div>
                </button>
              )}
            </div>
            </div>
            );
          })()}
        </div>

        {/* Side Panels */}
        {(showParticipants || showChat) && (
          <div className="hidden sm:flex flex-col w-80 lg:w-[320px] border-l border-gray-200 dark:border-[#1a1d24] midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#0f1115] midnight:bg-[#0f1729] purple:bg-[#2a1a3e]">
            {showParticipants && (
              <ParticipantsPanel
                participants={uiParticipants}
                currentUserId={userId}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                onClose={() => setShowParticipants(false)}
                onAddParticipant={() => setShowAddParticipant(true)}
                className="flex-1"
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
                className="flex-1"
              />
            )}
          </div>
        )}
      </div>

      {/* Mobile Panels (full screen overlays) */}
      {showParticipants && (
        <div className="sm:hidden fixed inset-0 z-50 bg-white dark:bg-[#0f1115] midnight:bg-[#0f1729] purple:bg-[#2a1a3e]">
          <ParticipantsPanel
            participants={uiParticipants}
            currentUserId={userId}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onClose={() => setShowParticipants(false)}
            onAddParticipant={() => setShowAddParticipant(true)}
          />
        </div>
      )}

      {showChat && (
        <div className="sm:hidden fixed inset-0 z-50 bg-white dark:bg-[#0f1115] midnight:bg-[#0f1729] purple:bg-[#2a1a3e]">
          <LiveChatPanel
            messages={uiMessages}
            currentUserId={userId}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onClose={() => setShowChat(false)}
            onSendMessage={sendMessage}
          />
        </div>
      )}

      {/* Control Bar */}
      <ControlBar
        isMuted={isMuted}
        isVideoOff={true}
        isScreenSharing={isScreenSharing}
        isFullscreen={isFullscreen}
        isRecording={isRecording}
        showChat={showChat}
        showParticipants={showParticipants}
        showWhiteboard={showWhiteboard}
        participantCount={session?.participants.length || 0}
        unreadMessageCount={unreadMessageCount}
        callType="voice"
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onToggleMute={toggleMute}
        onToggleVideo={() => {
          isSwitchingToVideoRef.current = true;
          onSwitchToVideo?.();
        }}
        onToggleScreenShare={toggleScreenShare}
        onToggleFullscreen={toggleFullscreen}
        onToggleChat={() => {
          setShowChat(!showChat);
          if (!showChat) { setShowParticipants(false); }
        }}
        onToggleParticipants={() => {
          setShowParticipants(!showParticipants);
          if (!showParticipants) { setShowChat(false); }
        }}
        onToggleWhiteboard={() => {
          if (!showWhiteboard) {
            setShowWhiteboard(true);
            setFocusedId(null);
          } else {
            setShowWhiteboard(false);
          }
        }}
        onToggleRecording={toggleRecording}
        onEndCall={endCall}
        onSettings={() => setShowSettings(true)}
        onChangeLayout={() => setLayout(layout === "spotlight" ? "grid" : "spotlight")}
        onReaction={addReaction}
        className="z-30"
      />

      {/* Settings Modal */}
      <CallSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsSave}
        showVideoSettings={false}
      />

      {/* Add Participant Modal */}
      <AddParticipantModal
        isOpen={showAddParticipant}
        onClose={() => setShowAddParticipant(false)}
        roomId={roomId}
        meetingTitle={meetingTitle}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onAddParticipant={(participant) => {
          setInvitedParticipants((prev) => {
            if (prev.some((p) => p.id === participant.id)) return prev;
            return [...prev, { id: participant.id, name: participant.name, avatar: participant.avatar }];
          });
        }}
      />
    </div>
  );
}
