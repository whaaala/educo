"use client";

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Users,
  Settings,
  Maximize2,
  Minimize2,
  MoreVertical,
  X,
  Copy,
  UserPlus,
  Grid,
  Sparkles,
  Circle,
  Pin,
  Check,
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
import { cn } from "@/lib/utils";
import CallSettings, {
  CallSettingsState,
  VIRTUAL_BACKGROUNDS,
  VIDEO_QUALITY_PRESETS,
  VirtualBackground,
  VideoQualityPreset,
} from "./CallSettings";
import AddParticipantModal from "./AddParticipantModal";

// Import new call UI components
import {
  CallHeader,
  ParticipantsPanel,
  LiveChatPanel,
  ControlBar,
  JoinRequestNotification,
  type JoinRequest,
  type ChatMessage as UIChatMessage,
  type Participant,
} from "./call-ui";
import { ReactionOverlay, useReactionOverlay } from "./call-ui/ReactionOverlay";
import { WhiteboardPanel } from "./call-ui/WhiteboardPanel";
import { WhiteboardThumbnail } from "@/components/shared/Whiteboard";
import type { WhiteboardElement } from "@/components/shared/Whiteboard";
import CallConnecting from "./CallConnecting";

export interface VideoCallRoomProps {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isHost?: boolean;
  callType?: "video" | "voice";
  meetingTitle?: string;
  recipientName?: string;
  recipientAvatar?: string;
  /** When true, skip the "Connecting to call..." loading screen (e.g. upgrading from voice call) */
  isUpgradeFromVoice?: boolean;
  onCallEnd?: () => void;
  onError?: (error: Error) => void;
}

export default function VideoCallRoom({
  roomId,
  userId,
  userName,
  userAvatar,
  isHost = false,
  callType = "video",
  meetingTitle = "Video Call",
  recipientName,
  recipientAvatar,
  isUpgradeFromVoice = false,
  onCallEnd,
  onError,
}: VideoCallRoomProps) {
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

  // Media controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType !== "video");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // UI panels
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [invitedParticipants, setInvitedParticipants] = useState<{ id: string; name: string; avatar?: string }[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // Layout
  const [layout, setLayout] = useState<"grid" | "spotlight">("spotlight");

  // Reactions
  const { reactions: floatingReactions, addReaction } = useReactionOverlay();
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);

  // Video settings
  const [selectedBackground, setSelectedBackground] = useState<VirtualBackground>(VIRTUAL_BACKGROUNDS[0]);
  const [selectedQuality, setSelectedQuality] = useState<VideoQualityPreset>(VIDEO_QUALITY_PRESETS[1]);

  // Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Join requests
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localThumbnailVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareSidebarVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);

  // Store local stream reference for cleanup
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenShareStreamRef = useRef<MediaStream | null>(null);
  const isTogglingScreenShare = useRef(false);

  // Participant streams
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [screenShareParticipantId, setScreenShareParticipantId] = useState<string | null>(null);
  const [localStreamReady, setLocalStreamReady] = useState(false);

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

  // Initialize call with HD video
  useEffect(() => {
    const initCall = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        if (settings) {
          manager.setSettings(settings);
        }

        const platform = getBestAvailablePlatform(callType === "video" ? "video" : "voice");

        const callSession = await manager.startCall(
          {
            roomId,
            userId,
            userName,
            userAvatar,
            isHost,
            type: callType,
            enableVideo: callType === "video",
            enableAudio: true,
            videoConstraints: {
              width: { ideal: selectedQuality.width },
              height: { ideal: selectedQuality.height },
              frameRate: { ideal: selectedQuality.frameRate },
              facingMode: "user",
            },
          },
          platform || undefined
        );

        setSession(callSession);
        setIsConnecting(false);

        const service = manager.getCurrentService();
        if (service) {
          const webrtcService = service as { getLocalStream?: () => MediaStream | null };
          if (webrtcService.getLocalStream) {
            const localStream = webrtcService.getLocalStream();
            if (localStream) {
              localStreamRef.current = localStream;
              setLocalStreamReady(true);
              // Connect to video element if available
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
              }
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
            setRemoteStreams((prev) => {
              const next = new Map(prev);
              next.delete(participantId);
              return next;
            });
          });

          service.onRemoteStream((participantId, stream) => {
            setRemoteStreams((prev) => {
              const next = new Map(prev);
              next.set(participantId, stream);
              return next;
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
      console.log("[VideoCallRoom] Component unmounting - calling nuclear cleanup");
      stopAllMediaTracks();
      localStreamRef.current = null;
    };
  }, [roomId, userId, userName, userAvatar, isHost, callType, settings, getBestAvailablePlatform, onCallEnd, onError, selectedQuality]);

  // Function to connect local stream to video elements
  const connectLocalStream = useCallback(() => {
    if (!localStreamRef.current) return;
    const stream = localStreamRef.current;

    // Connect to main local video
    if (localVideoRef.current && localVideoRef.current.srcObject !== stream) {
      localVideoRef.current.srcObject = stream;
    }

    // Connect to thumbnail video (normal view)
    if (localThumbnailVideoRef.current && localThumbnailVideoRef.current.srcObject !== stream) {
      localThumbnailVideoRef.current.srcObject = stream;
    }

    // Connect to screen share sidebar video
    if (screenShareSidebarVideoRef.current && screenShareSidebarVideoRef.current.srcObject !== stream) {
      screenShareSidebarVideoRef.current.srcObject = stream;
    }
  }, []);

  // Attach local stream to all local video elements - use useLayoutEffect for immediate DOM updates
  useLayoutEffect(() => {
    if (localStreamReady) {
      // Connect immediately
      connectLocalStream();

      // Also connect after a short delay to catch any elements that mount later
      const timeoutId = setTimeout(connectLocalStream, 100);
      const timeoutId2 = setTimeout(connectLocalStream, 500);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(timeoutId2);
      };
    }
  }, [localStreamReady, session, isVideoOff, screenShareStream, connectLocalStream]);

  // Attach remote streams to video elements
  useEffect(() => {
    remoteStreams.forEach((stream, participantId) => {
      const videoElement = remoteVideoRefs.current.get(participantId);
      if (videoElement && videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }
    });
  }, [remoteStreams]);

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

  // Toggle functions
  const toggleMute = useCallback(() => {
    const service = manager.getCurrentService();
    if (service) {
      service.toggleAudio(!isMuted);
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    const service = manager.getCurrentService();
    if (service) {
      service.toggleVideo(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  }, [isVideoOff]);

  const stopScreenShare = useCallback(async () => {
    const currentStream = screenShareStreamRef.current;
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
    }
    screenShareStreamRef.current = null;
    setScreenShareStream(null);
    setScreenShareParticipantId(null);
    setIsScreenSharing(false);
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (isTogglingScreenShare.current) return;
    isTogglingScreenShare.current = true;

    try {
      if (screenShareStreamRef.current || isScreenSharing) {
        await stopScreenShare();
        return;
      }

      const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      if (!newScreenStream || newScreenStream.getTracks().length === 0) {
        return;
      }

      screenShareStreamRef.current = newScreenStream;
      setScreenShareStream(newScreenStream);
      setScreenShareParticipantId(userId);
      setIsScreenSharing(true);

      const videoTrack = newScreenStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => stopScreenShare();
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name !== "NotAllowedError" && error.name !== "AbortError") {
        console.error("Screen share failed:", err);
      }
    } finally {
      isTogglingScreenShare.current = false;
    }
  }, [userId, isScreenSharing, stopScreenShare]);

  const endCall = useCallback(() => {
    console.log("[VideoCallRoom] endCall triggered");
    stopAllMediaTracks();
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    localStreamRef.current = null;
    const service = manager.getCurrentService();
    if (service) {
      service.leaveRoom();
    }
    setScreenShareStream(null);
    setScreenShareParticipantId(null);
    onCallEnd?.();
  }, [onCallEnd]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!containerRef.current) return;
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(!!document.fullscreenElement);
    }
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!session) return;

      const newChatMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        roomId: session.roomId,
        senderId: userId,
        senderName: userName,
        senderAvatar: userAvatar,
        content,
        type: "text",
        timestamp: new Date(),
        isRead: true,
      };

      setMessages((prev) => [...prev, newChatMessage]);

      const service = manager.getCurrentService();
      if (service) {
        try {
          await service.sendChatMessage({
            roomId: session.roomId,
            senderId: userId,
            senderName: userName,
            senderAvatar: userAvatar,
            content,
            type: "text",
            isRead: false,
          });
        } catch (err) {
          console.error("Failed to send message:", err);
        }
      }
    },
    [session, userId, userName, userAvatar]
  );

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  const handleSettingsSave = (settingsData: CallSettingsState) => {
    setSelectedBackground(settingsData.selectedBackground);
    setSelectedQuality(settingsData.selectedQuality);
  };

  const handleAcceptJoinRequest = (id: string) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRejectJoinRequest = (id: string) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== id));
  };

  // Derived data
  const remoteParticipants = useMemo(
    () => session?.participants.filter((p) => p.id !== userId) || [],
    [session?.participants, userId]
  );
  const totalParticipants = session?.participants.length || 1;

  // Compute who should be shown in the main spotlight view
  const spotlightPerson = (() => {
    if (focusedId === "local") {
      return { id: userId, name: userName, avatar: userAvatar, isMuted, isVideoOff, isSpeaking: false, isWaiting: false, isLocal: true };
    }
    if (focusedId === "recipient") {
      return { id: "recipient", name: recipientName || "Participant", avatar: recipientAvatar, isMuted: false, isVideoOff: true, isSpeaking: false, isWaiting: true, isLocal: false };
    }
    if (focusedId) {
      const remote = remoteParticipants.find(p => p.id === focusedId);
      if (remote) return { id: remote.id, name: remote.name, avatar: remote.avatar || undefined, isMuted: remote.isMuted, isVideoOff: remote.isVideoOff, isSpeaking: remote.isSpeaking, isWaiting: false, isLocal: false };
      const invited = invitedParticipants.find(p => p.id === focusedId);
      if (invited) return { id: invited.id, name: invited.name, avatar: invited.avatar, isMuted: false, isVideoOff: true, isSpeaking: false, isWaiting: true, isLocal: false };
    }
    // Default: show first remote participant or local (waiting)
    if (remoteParticipants.length > 0) {
      const p = remoteParticipants[0];
      return { id: p.id, name: p.name, avatar: p.avatar || undefined, isMuted: p.isMuted, isVideoOff: p.isVideoOff, isSpeaking: p.isSpeaking, isWaiting: false, isLocal: false };
    }
    return { id: userId, name: userName, avatar: userAvatar, isMuted, isVideoOff, isSpeaking: false, isWaiting: false, isLocal: true };
  })();

  const uiMessages: UIChatMessage[] = useMemo(
    () =>
      messages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        senderName: m.senderName,
        senderAvatar: m.senderAvatar,
        content: m.content,
        timestamp: m.timestamp,
      })),
    [messages]
  );

  const uiParticipants: Participant[] = useMemo(
    () =>
      session?.participants.map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        role: p.role,
        isMuted: p.isMuted,
        isVideoOff: p.isVideoOff,
        isScreenSharing: p.isScreenSharing,
        isSpeaking: p.isSpeaking,
        isHost: p.id === userId && isHost,
      })) || [],
    [session?.participants, userId, isHost]
  );

  const unreadMessageCount = messages.filter(
    (m) => !m.isRead && m.senderId !== userId
  ).length;

  // Loading state (skip when upgrading from voice call - show main UI while connecting)
  if (isConnecting && !isUpgradeFromVoice) {
    return (
      <div ref={containerRef} className="h-full">
        <CallConnecting
          callType="video"
          qualityLabel={selectedQuality.name}
          tenantName={tenantName}
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 midnight:from-[#060a1a] midnight:via-[#0f1729] midnight:to-[#060a1a] purple:from-[#120622] purple:via-[#2a1a3e] purple:to-[#120622]"
      >
        <div className="text-center max-w-md p-6 sm:p-8 bg-white/80 dark:bg-[#1a1d24]/80 midnight:bg-[#0f1729]/90 purple:bg-[#2a1a3e]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl mx-4 border border-gray-200 dark:border-white/10 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <PhoneOff className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Connection Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 text-sm sm:text-base mb-4 sm:mb-6">{error}</p>
          <button
            onClick={onCallEnd}
            className="px-6 sm:px-8 py-2.5 sm:py-3 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
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

  // Main Call UI
  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-full bg-gray-100 dark:bg-gray-950 midnight:bg-[#060a1a] purple:bg-[#120622] overflow-hidden"
    >
      {/* Header */}
      <CallHeader
        title={meetingTitle}
        callType={callType}
        duration={callDuration}
        participantCount={totalParticipants}
        invitedCount={0}
        isRecording={isRecording}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onClose={endCall}
        onSettings={() => setShowSettings(true)}
        onCopyRoomId={copyRoomId}
        onAddParticipant={() => setShowAddParticipant(true)}
        onShare={copyRoomId}
        roomId={roomId}
      />

      {/* Floating Reaction Overlay */}
      <ReactionOverlay reactions={floatingReactions} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid Area */}
        <div className="flex-1 flex flex-col p-2 sm:p-3 lg:p-4 overflow-hidden">
          {/* Join Requests */}
          {joinRequests.length > 0 && (
            <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-20 space-y-2">
              {joinRequests.slice(0, 2).map((request) => (
                <JoinRequestNotification
                  key={request.id}
                  request={request}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  onAccept={handleAcceptJoinRequest}
                  onReject={handleRejectJoinRequest}
                />
              ))}
            </div>
          )}

          {/* Whiteboard View (replaces primary video, keeps thumbnails) */}
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

                  {/* Local user video thumbnail */}
                  <div
                    onClick={() => { setFocusedId("local"); }}
                    className={cn(
                      "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all",
                      "w-full aspect-video"
                    )}
                  >
                    <video
                      ref={(el) => {
                        if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                          el.srcObject = localStreamRef.current;
                        }
                      }}
                      autoPlay
                      muted
                      playsInline
                      className={cn("w-full h-full object-cover", isVideoOff && "hidden")}
                    />
                    {isVideoOff && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {userAvatar ? (
                          <Image src={userAvatar} alt={userName} width={48} height={48} className="w-12 h-12 rounded-full" />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          >
                            {userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white">You</span>
                      {isMuted && (
                        <span className="p-1 bg-red-500 rounded-md"><MicOff className="w-2.5 h-2.5 text-white" /></span>
                      )}
                    </div>
                  </div>

                  {/* Recipient waiting thumbnail - shown when alone */}
                  {remoteParticipants.length === 0 && recipientName && (
                    <div
                      onClick={() => { setFocusedId("recipient"); }}
                      className="relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {recipientAvatar ? (
                          <img src={recipientAvatar} alt={recipientName} className="w-12 h-12 rounded-full object-cover opacity-50" />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white opacity-50"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          >
                            {recipientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                          {recipientName}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* Remote participants thumbnails */}
                  {remoteParticipants.map((participant) => {
                    const participantStream = remoteStreams.get(participant.id);
                    const hasVideoStream = participantStream && participantStream.getVideoTracks().length > 0 && participantStream.getVideoTracks()[0].enabled;
                    const showVideo = !participant.isVideoOff && hasVideoStream;
                    return (
                      <div
                        key={participant.id}
                        onClick={() => { setFocusedId(participant.id); }}
                        className="relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg w-full aspect-video cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                      >
                        <video
                          ref={(el) => {
                            if (el && participantStream && el.srcObject !== participantStream) {
                              el.srcObject = participantStream;
                            }
                          }}
                          autoPlay
                          playsInline
                          className={cn("w-full h-full object-cover", !showVideo && "hidden")}
                        />
                        {!showVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                            {participant.avatar ? (
                              <Image src={participant.avatar} alt={participant.name} width={48} height={48} className="w-12 h-12 rounded-full" />
                            ) : (
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                              >
                                {participant.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-medium text-gray-900 dark:text-white truncate max-w-[90px]">
                            {participant.name}
                          </span>
                          {participant.isMuted && (
                            <span className="p-1 bg-red-500 rounded-md"><MicOff className="w-2.5 h-2.5 text-white" /></span>
                          )}
                        </div>
                      </div>
                    );
                  })}

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

          {/* Screen Share View (spotlight mode) */}
          {(!showWhiteboard || focusedId) && screenShareStream && layout === "spotlight" && (
            <div className="flex-1 flex gap-2 sm:gap-3 lg:gap-4 min-h-0">
              {/* Main view — screen share by default, or focused person when focusedId is set */}
              <div className="flex-1 relative bg-gray-200 dark:bg-[#0f1115] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl sm:rounded-2xl overflow-hidden">
                {(!focusedId || focusedId === "screen-share") ? (
                  <>
                    {/* Screen share as main view */}
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
                        <span className="hidden sm:inline">
                          {screenShareParticipantId === userId ? "You are sharing" : "Screen sharing"}
                        </span>
                        <span className="sm:hidden">Sharing</span>
                      </div>
                    </div>
                    {screenShareParticipantId === userId && (
                      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2">
                        <button
                          onClick={stopScreenShare}
                          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-medium shadow-lg cursor-pointer"
                        >
                          <MonitorOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Stop Sharing</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : spotlightPerson.isWaiting ? (
                  // Focused person is waiting (invited/recipient)
                  <>
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                      {spotlightPerson.avatar ? (
                        <Image src={spotlightPerson.avatar} alt={spotlightPerson.name} width={160} height={160} className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full opacity-50" />
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
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2">
                      <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {spotlightPerson.name}
                      </span>
                    </div>
                  </>
                ) : spotlightPerson.isLocal ? (
                  // Focused person is local user
                  <>
                    <video
                      ref={(el) => {
                        localVideoRef.current = el;
                        if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                          el.srcObject = localStreamRef.current;
                        }
                      }}
                      autoPlay
                      muted
                      playsInline
                      className={cn("w-full h-full object-cover", isVideoOff && "hidden")}
                    />
                    {isVideoOff && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {userAvatar ? (
                          <Image src={userAvatar} alt={userName} width={160} height={160} className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full" />
                        ) : (
                          <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                            {userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2">
                      <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {userName} (You)
                      </span>
                      {isMuted && (
                        <span className="p-1 sm:p-1.5 bg-red-500 rounded-lg">
                          <MicOff className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  // Focused person is a remote participant
                  (() => {
                    const focusedStream = remoteStreams.get(spotlightPerson.id);
                    const hasVideo = focusedStream && focusedStream.getVideoTracks().length > 0 && focusedStream.getVideoTracks()[0].enabled;
                    const showVideo = !spotlightPerson.isVideoOff && hasVideo;
                    return (
                      <>
                        <video
                          ref={(el) => {
                            if (el) {
                              remoteVideoRefs.current.set(spotlightPerson.id, el);
                              if (focusedStream && el.srcObject !== focusedStream) {
                                el.srcObject = focusedStream;
                              }
                            }
                          }}
                          autoPlay
                          playsInline
                          className={cn("w-full h-full object-cover", !showVideo && "hidden")}
                        />
                        {!showVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                            {spotlightPerson.avatar ? (
                              <Image src={spotlightPerson.avatar} alt={spotlightPerson.name} width={160} height={160} className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full" />
                            ) : (
                              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                                {spotlightPerson.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2">
                          <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {spotlightPerson.name}
                          </span>
                          {spotlightPerson.isMuted && (
                            <span className="p-1 sm:p-1.5 bg-red-500 rounded-lg">
                              <MicOff className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </span>
                          )}
                          {spotlightPerson.isSpeaking && (
                            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                          )}
                        </div>
                      </>
                    );
                  })()
                )}
              </div>

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
                      <Monitor className="w-2.5 h-2.5" /> Screen
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

                {/* Local video thumbnail */}
                <div
                  onClick={() => setFocusedId(focusedId === "local" ? "screen-share" : "local")}
                  className={cn(
                    "relative aspect-video bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden flex-shrink-0 shadow-lg cursor-pointer transition-all",
                    focusedId === "local" ? "ring-2 ring-blue-500" : isSpeaking && "ring-2 ring-green-500"
                  )}
                >
                  <video
                    ref={(el) => {
                      screenShareSidebarVideoRef.current = el;
                      if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                        el.srcObject = localStreamRef.current;
                      }
                    }}
                    autoPlay
                    muted
                    playsInline
                    className={cn("w-full h-full object-cover", isVideoOff && "hidden")}
                  />
                  {isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                      {userAvatar ? (
                        <Image src={userAvatar} alt={userName} width={56} height={56} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full" />
                      ) : (
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-lg lg:text-xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] lg:text-xs font-medium text-gray-900 dark:text-white">
                      You
                    </span>
                    {isMuted && (
                      <span className="p-1 bg-red-500 rounded-md">
                        <MicOff className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Recipient waiting thumbnail - shown when alone */}
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
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] lg:text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">
                        {recipientName || "Participant"}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Remote participants */}
                {remoteParticipants.map((participant) => {
                  const participantStream = remoteStreams.get(participant.id);
                  const hasVideoStream = participantStream && participantStream.getVideoTracks().length > 0 && participantStream.getVideoTracks()[0].enabled;
                  const showVideo = !participant.isVideoOff && hasVideoStream;

                  return (
                    <div
                      key={participant.id}
                      onClick={() => setFocusedId(focusedId === participant.id ? null : participant.id)}
                      className={cn(
                        "relative aspect-video bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden flex-shrink-0 shadow-lg cursor-pointer transition-all",
                        focusedId === participant.id ? "ring-2 ring-blue-500" : participant.isSpeaking && "ring-2 ring-green-500"
                      )}
                    >
                      <video
                        ref={(el) => {
                          if (el) {
                            remoteVideoRefs.current.set(participant.id, el);
                            if (participantStream && el.srcObject !== participantStream) {
                              el.srcObject = participantStream;
                            }
                          }
                        }}
                        autoPlay
                        playsInline
                        className={cn("w-full h-full object-cover", !showVideo && "hidden")}
                      />
                      {!showVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                          {participant.avatar ? (
                            <Image src={participant.avatar} alt={participant.name} width={56} height={56} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full" />
                          ) : (
                            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-lg lg:text-xl font-bold text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                              {participant.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] lg:text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">
                          {participant.name}
                        </span>
                        {participant.isMuted && (
                          <span className="p-1 bg-red-500 rounded-md">
                            <MicOff className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Invited participants thumbnails */}
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
                      <span className="px-2 py-0.5 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-md text-[10px] lg:text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">
                        {p.name}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Normal Video Grid (when not screen sharing) */}
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
              <div
                className={cn(
                  "relative bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl sm:rounded-2xl overflow-hidden min-h-0",
                  isSpeaking && "ring-2 ring-green-500"
                )}
              >
                <video
                  ref={(el) => {
                    localVideoRef.current = el;
                    if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                      el.srcObject = localStreamRef.current;
                    }
                  }}
                  autoPlay
                  muted
                  playsInline
                  className={cn("w-full h-full object-cover", isVideoOff && "hidden")}
                />
                {isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                    {userAvatar ? (
                      <Image src={userAvatar} alt={userName} width={120} height={120} className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full" />
                    ) : (
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                      >
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 flex items-center gap-2">
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {userName} (You)
                  </span>
                  {isMuted && (
                    <span className="p-1 bg-red-500 rounded-lg">
                      <MicOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </span>
                  )}
                </div>
              </div>

              {/* Remote participant tiles */}
              {remoteParticipants.map((participant) => {
                const participantStream = remoteStreams.get(participant.id);
                const hasVideoStream = participantStream && participantStream.getVideoTracks().length > 0 && participantStream.getVideoTracks()[0].enabled;
                const showVideo = !participant.isVideoOff && hasVideoStream;

                return (
                  <div
                    key={participant.id}
                    className={cn(
                      "relative bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl sm:rounded-2xl overflow-hidden min-h-0",
                      participant.isSpeaking && "ring-2 ring-green-500"
                    )}
                  >
                    <video
                      ref={(el) => {
                        if (el) {
                          remoteVideoRefs.current.set(participant.id, el);
                          if (participantStream && el.srcObject !== participantStream) {
                            el.srcObject = participantStream;
                          }
                        }
                      }}
                      autoPlay
                      playsInline
                      className={cn("w-full h-full object-cover", !showVideo && "hidden")}
                    />
                    {!showVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {participant.avatar ? (
                          <Image src={participant.avatar} alt={participant.name} width={120} height={120} className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full" />
                        ) : (
                          <div
                            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          >
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 flex items-center gap-2">
                      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                        {participant.name}
                      </span>
                      {participant.isMuted && (
                        <span className="p-1 bg-red-500 rounded-lg">
                          <MicOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                        </span>
                      )}
                      {participant.isSpeaking && (
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                      )}
                    </div>
                  </div>
                );
              })}

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
                      <span>{screenShareParticipantId === userId ? "You are sharing" : "Screen sharing"}</span>
                    </div>
                  </div>
                  {screenShareParticipantId === userId && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <button
                        onClick={stopScreenShare}
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
                      <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 text-xs sm:text-sm">
                        {p.name} — invited
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* "Waiting for recipient" shown when alone in grid */}
              {remoteParticipants.length === 0 && (
                <div className="relative bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl sm:rounded-2xl overflow-hidden min-h-0">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                    {recipientAvatar ? (
                      <img
                        src={recipientAvatar}
                        alt={recipientName || "Recipient"}
                        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover opacity-50"
                      />
                    ) : (
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white opacity-50"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                      >
                        {(recipientName || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 text-sm font-medium">
                        {recipientName || "Participant"} — waiting to join
                      </p>
                    </div>
                  </div>
                </div>
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
                  "w-full aspect-video",
                  isSpeaking && "ring-2 ring-green-500"
                )}
              >
                <video
                  ref={(el) => {
                    if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                      el.srcObject = localStreamRef.current;
                    }
                  }}
                  autoPlay
                  muted
                  playsInline
                  className={cn("w-full h-full object-cover", isVideoOff && "hidden")}
                />
                {isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                    {userAvatar ? (
                      <Image src={userAvatar} alt={userName} width={48} height={48} className="w-12 h-12 rounded-full" />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                      >
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
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

              {/* Recipient waiting thumbnail */}
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

              {/* Remote participant thumbnails */}
              {remoteParticipants.map((participant) => {
                const participantStream = remoteStreams.get(participant.id);
                const hasVideoStream = participantStream && participantStream.getVideoTracks().length > 0 && participantStream.getVideoTracks()[0].enabled;
                const showVideo = !participant.isVideoOff && hasVideoStream;

                return (
                  <div
                    key={participant.id}
                    className={cn(
                      "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg",
                      "w-full aspect-video",
                      participant.isSpeaking && "ring-2 ring-green-500"
                    )}
                  >
                    <video
                      ref={(el) => {
                        if (el) {
                          remoteVideoRefs.current.set(participant.id, el);
                          if (participantStream && el.srcObject !== participantStream) {
                            el.srcObject = participantStream;
                          }
                        }
                      }}
                      autoPlay
                      playsInline
                      className={cn("w-full h-full object-cover", !showVideo && "hidden")}
                    />
                    {!showVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {participant.avatar ? (
                          <Image src={participant.avatar} alt={participant.name} width={48} height={48} className="w-12 h-12 rounded-full" />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                          >
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    )}
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
                );
              })}

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
                        boxShadow: `0 4px 14px ${primaryColor}40`
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

          {/* Spotlight View (when not screen sharing) */}
          {(!showWhiteboard || focusedId) && !screenShareStream && layout === "spotlight" && (
            <div className="flex-1 flex gap-2 sm:gap-3 lg:gap-4 min-h-0">
              <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4 min-h-0">
                {/* Primary Video (large) */}
                <div className="flex-1 relative bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl sm:rounded-2xl overflow-hidden min-h-0">
                  {spotlightPerson.isWaiting ? (
                    // Waiting person (invited participant or recipient)
                    <>
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {spotlightPerson.avatar ? (
                          <Image
                            src={spotlightPerson.avatar}
                            alt={spotlightPerson.name}
                            width={160}
                            height={160}
                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full opacity-50"
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
                    </>
                  ) : spotlightPerson.isLocal ? (
                    // Local user video
                    <>
                      <video
                        ref={(el) => {
                          localVideoRef.current = el;
                          if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                            el.srcObject = localStreamRef.current;
                          }
                        }}
                        autoPlay
                        muted
                        playsInline
                        className={cn(
                        "w-full h-full object-cover",
                          isVideoOff && "hidden"
                        )}
                      />
                      {isVideoOff && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                          {userAvatar ? (
                            <Image
                              src={userAvatar}
                              alt={userName}
                              width={160}
                              height={160}
                              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full"
                            />
                          ) : (
                            <div
                              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white"
                              style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                              }}
                            >
                              {userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Name badge for local user */}
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2">
                        <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {userName} (You)
                        </span>
                        {isMuted && (
                          <span className="p-1 sm:p-1.5 bg-red-500 rounded-lg">
                            <MicOff className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </span>
                        )}
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
                  ) : (
                    // Remote participant video
                    <>
                      <video
                        ref={(el) => {
                          if (el) {
                            remoteVideoRefs.current.set(spotlightPerson.id, el);
                            const stream = remoteStreams.get(spotlightPerson.id);
                            if (stream) el.srcObject = stream;
                          }
                        }}
                        autoPlay
                        playsInline
                        className={cn(
                        "w-full h-full object-cover",
                          spotlightPerson.isVideoOff && "hidden"
                        )}
                      />
                      {spotlightPerson.isVideoOff && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                          {spotlightPerson.avatar ? (
                            <Image
                              src={spotlightPerson.avatar}
                              alt={spotlightPerson.name}
                              width={160}
                              height={160}
                              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full"
                            />
                          ) : (
                            <div
                              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white"
                              style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                              }}
                            >
                              {spotlightPerson.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Name badge */}
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center gap-2">
                        <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 dark:bg-black/60 backdrop-blur rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {spotlightPerson.name}
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

                  {/* Local user video thumbnail - always visible */}
                  <div
                    onClick={() => setFocusedId(focusedId === "local" ? null : "local")}
                    className={cn(
                    "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all",
                    "w-full aspect-video",
                      focusedId === "local" ? "ring-2 ring-blue-500" : isSpeaking && "ring-2 ring-green-500"
                    )}
                  >
                    <video
                      ref={(el) => {
                        localThumbnailVideoRef.current = el;
                        if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
                          el.srcObject = localStreamRef.current;
                        }
                      }}
                      autoPlay
                      muted
                      playsInline
                      className={cn(
                      "w-full h-full object-cover",
                        isVideoOff && "hidden"
                      )}
                    />
                    {isVideoOff && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                        {userAvatar ? (
                          <Image
                            src={userAvatar}
                            alt={userName}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full"
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
                    )}
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
                          <img
                            src={recipientAvatar}
                            alt={recipientName || "Recipient"}
                            className="w-12 h-12 rounded-full object-cover opacity-50"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white opacity-50"
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                            }}
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

                  {/* All remote participants video thumbnails */}
                  {remoteParticipants.map((participant) => {
                    const participantStream = remoteStreams.get(participant.id);
                    const hasVideoStream = participantStream && participantStream.getVideoTracks().length > 0 && participantStream.getVideoTracks()[0].enabled;
                    const showVideo = !participant.isVideoOff && hasVideoStream;

                    return (
                      <div
                        key={participant.id}
                        onClick={() => setFocusedId(focusedId === participant.id ? null : participant.id)}
                        className={cn(
                        "relative flex-shrink-0 bg-gray-200 dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all",
                        "w-full aspect-video",
                          focusedId === participant.id ? "ring-2 ring-blue-500" : participant.isSpeaking && "ring-2 ring-green-500"
                        )}
                      >
                        <video
                          ref={(el) => {
                            if (el) {
                              remoteVideoRefs.current.set(participant.id, el);
                              if (participantStream && el.srcObject !== participantStream) {
                                el.srcObject = participantStream;
                              }
                            }
                          }}
                          autoPlay
                          playsInline
                          className={cn(
                          "w-full h-full object-cover",
                            !showVideo && "hidden"
                          )}
                        />
                        {!showVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 midnight:from-[#0a0f1f] midnight:to-[#0d1220] purple:from-[#150a28] purple:to-[#1f0d33]">
                            {participant.avatar ? (
                              <Image
                                src={participant.avatar}
                                alt={participant.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full"
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
                        )}
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
                    );
                  })}

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
                            boxShadow: `0 4px 14px ${primaryColor}40`
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
                onSendMessage={handleSendMessage}
                className="flex-1"
              />
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <ControlBar
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        isFullscreen={isFullscreen}
        isRecording={isRecording}
        showChat={showChat}
        showParticipants={showParticipants}
        showWhiteboard={showWhiteboard}
        participantCount={totalParticipants}
        unreadMessageCount={unreadMessageCount}
        callType={callType}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
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
        onToggleRecording={() => setIsRecording(!isRecording)}
        onEndCall={endCall}
        onSettings={() => setShowSettings(true)}
        onChangeLayout={() => setLayout(layout === "spotlight" ? "grid" : "spotlight")}
        onReaction={addReaction}
      />

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
            onSendMessage={handleSendMessage}
          />
        </div>
      )}

      {/* Settings Modal */}
      <CallSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsSave}
        initialSettings={{
          selectedBackground,
          selectedQuality,
        }}
        showVideoSettings={true}
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
