"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Columns,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useCommunication } from "@/contexts/CommunicationContext";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  getCommunicationManager,
  CallSession,
  CallParticipant,
  ChatMessage,
} from "@/lib/services/communication";
import { stopAllMediaTracks, registerStream, stopStream } from "@/lib/utils/stopAllMedia";
import CallSettings, {
  CallSettingsState,
  VIRTUAL_BACKGROUNDS,
  VIDEO_QUALITY_PRESETS,
  VirtualBackground,
  VideoQualityPreset,
} from "./CallSettings";
import AddParticipantModal from "./AddParticipantModal";

export interface VideoCallRoomProps {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isHost?: boolean;
  callType?: "video" | "voice";
  recipientName?: string;
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

  // UI panels
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  // Layout
  const [layout, setLayout] = useState<"grid" | "spotlight">("grid");

  // Video settings
  const [selectedBackground, setSelectedBackground] = useState<VirtualBackground>(VIRTUAL_BACKGROUNDS[0]);
  const [selectedQuality, setSelectedQuality] = useState<VideoQualityPreset>(VIDEO_QUALITY_PRESETS[1]); // Default 1080p

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store local stream reference for cleanup
  const localStreamRef = useRef<MediaStream | null>(null);

  // Participant streams
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

  // Screen share stream (local or remote)
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [screenShareParticipantId, setScreenShareParticipantId] = useState<string | null>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareStreamRef = useRef<MediaStream | null>(null);
  const isTogglingScreenShare = useRef(false);

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

  // Initialize call with HD video
  useEffect(() => {
    const initCall = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        // Set settings in manager
        if (settings) {
          manager.setSettings(settings);
        }

        // Get best available platform
        const platform = getBestAvailablePlatform(callType === "video" ? "video" : "voice");

        // Start call with HD video constraints
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
            // HD Video constraints
            videoConstraints: {
              width: { ideal: selectedQuality.width, min: 1280 },
              height: { ideal: selectedQuality.height, min: 720 },
              frameRate: { ideal: selectedQuality.frameRate, min: 24 },
              facingMode: "user",
            },
          },
          platform || undefined
        );

        setSession(callSession);
        setIsConnecting(false);

        // Get current service and setup event listeners
        const service = manager.getCurrentService();
        if (service) {
          // Local stream - store in ref for cleanup
          const webrtcService = service as { getLocalStream?: () => MediaStream | null };
          if (webrtcService.getLocalStream && localVideoRef.current) {
            const localStream = webrtcService.getLocalStream();
            if (localStream) {
              localStreamRef.current = localStream; // Store for cleanup
              localVideoRef.current.srcObject = localStream;
            }
          }

          // Participant events
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

          // Remote streams
          service.onRemoteStream((participantId, stream) => {
            setRemoteStreams((prev) => {
              const next = new Map(prev);
              next.set(participantId, stream);
              return next;
            });
          });

          // Chat messages
          service.onChatMessage((message) => {
            setMessages((prev) => [...prev, message]);
          });

          // Call state changes
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
      console.log('[VideoCallRoom] Component unmounting - calling nuclear cleanup');
      stopAllMediaTracks();
      localStreamRef.current = null;
    };
  }, [roomId, userId, userName, userAvatar, isHost, callType, settings, getBestAvailablePlatform, onCallEnd, onError, selectedQuality]);

  // Attach remote streams to video elements
  useEffect(() => {
    remoteStreams.forEach((stream, participantId) => {
      const videoElement = remoteVideoRefs.current.get(participantId);
      if (videoElement && videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }
    });
  }, [remoteStreams]);

  // Attach screen share stream to video element
  useEffect(() => {
    if (screenShareVideoRef.current && screenShareStream) {
      screenShareVideoRef.current.srcObject = screenShareStream;
      // Ensure video plays after stream is attached
      screenShareVideoRef.current.play().catch(err => {
        console.error("Screen share video play failed:", err);
      });
    }
  }, [screenShareStream]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const service = manager.getCurrentService();
    if (service) {
      service.toggleAudio(!isMuted);
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    const service = manager.getCurrentService();
    if (service) {
      service.toggleVideo(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  }, [isVideoOff]);

  // Stop screen share helper
  const stopScreenShare = useCallback(async () => {
    const service = manager.getCurrentService();
    const currentStream = screenShareStreamRef.current;

    if (currentStream) {
      console.log("Stopping screen share");
      currentStream.getTracks().forEach(track => track.stop());
    }

    screenShareStreamRef.current = null;
    setScreenShareStream(null);
    setScreenShareParticipantId(null);
    setIsScreenSharing(false);

    if (service) {
      try {
        await service.toggleScreenShare(false);
      } catch (e) {
        // Ignore errors when stopping
      }
    }
  }, []);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    // Prevent multiple rapid clicks
    if (isTogglingScreenShare.current) {
      console.log("Screen share toggle already in progress");
      return;
    }

    isTogglingScreenShare.current = true;

    try {
      // Check if currently sharing using ref (most reliable)
      if (screenShareStreamRef.current) {
        await stopScreenShare();
        return;
      }

      // Also check if isScreenSharing state is true (backup check)
      if (isScreenSharing) {
        await stopScreenShare();
        return;
      }

      const service = manager.getCurrentService();
      if (!service) {
        return;
      }

      console.log("Starting new screen share");
      // Start screen sharing
      const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Check if user cancelled (stream has no tracks)
      if (!newScreenStream || newScreenStream.getTracks().length === 0) {
        console.log("Screen share cancelled by user");
        return;
      }

      // Store in ref immediately for reliable checking
      screenShareStreamRef.current = newScreenStream;

      // Set the screen share stream for display
      setScreenShareStream(newScreenStream);
      setScreenShareParticipantId(userId);
      setIsScreenSharing(true);

      // Handle when user stops sharing via browser UI (clicking "Stop sharing")
      const videoTrack = newScreenStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          console.log("Screen share ended via browser UI");
          stopScreenShare();
        };
      }

      // Note: We don't call service.toggleScreenShare(true) here because
      // we already have the stream and the service would try to call getDisplayMedia again.
      console.log("Screen share started successfully");
    } catch (err: unknown) {
      // User cancelled the picker or permission denied - this is expected, don't log as error
      const error = err as Error;
      if (error.name === "NotAllowedError" || error.name === "AbortError") {
        // User clicked Cancel - this is normal, don't show any error
        console.log("Screen share picker was cancelled");
      } else {
        console.error("Screen share failed:", err);
      }
    } finally {
      isTogglingScreenShare.current = false;
    }
  }, [userId, isScreenSharing, stopScreenShare]);

  // End call - SYNCHRONOUSLY stop all tracks first, then notify parent
  const endCall = useCallback(() => {
    console.log('[VideoCallRoom] endCall triggered - starting immediate cleanup');

    // NUCLEAR OPTION FIRST: Stop ALL media tracks globally
    // This is the most aggressive approach to ensure camera/mic are released instantly
    stopAllMediaTracks();

    // Also do targeted cleanup for completeness
    // 1. Clear local video element
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    // 2. Clear stored ref
    localStreamRef.current = null;

    // 3. Stop from service - call leaveRoom for signaling cleanup
    const service = manager.getCurrentService();
    if (service) {
      service.leaveRoom();
    }

    // 4. Clear screen share state
    setScreenShareStream(null);
    setScreenShareParticipantId(null);

    console.log('[VideoCallRoom] endCall cleanup complete - calling parent callback');

    // Now safe to call parent callback
    onCallEnd?.();
  }, [onCallEnd]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Send chat message
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !session) return;

    const messageContent = newMessage.trim();
    const newChatMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      roomId: session.roomId,
      senderId: userId,
      senderName: userName,
      senderAvatar: userAvatar,
      content: messageContent,
      type: "text",
      timestamp: new Date(),
      isRead: true,
    };

    // Add message locally immediately for instant feedback
    setMessages((prev) => [...prev, newChatMessage]);
    setNewMessage("");

    // Also send through service for other participants
    const service = manager.getCurrentService();
    if (service) {
      try {
        await service.sendChatMessage({
          roomId: session.roomId,
          senderId: userId,
          senderName: userName,
          senderAvatar: userAvatar,
          content: messageContent,
          type: "text",
          isRead: false,
        });
      } catch (err) {
        console.error("Failed to send message through service:", err);
      }
    }
  }, [newMessage, session, userId, userName, userAvatar]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!showChat && !showParticipants && !showSettings && !showMoreMenu && !showBackgroundMenu) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [showChat, showParticipants, showSettings, showMoreMenu, showBackgroundMenu]);

  // Copy room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setShowMoreMenu(false);
  };

  // Handle settings save
  const handleSettingsSave = (settingsData: CallSettingsState) => {
    setSelectedBackground(settingsData.selectedBackground);
    setSelectedQuality(settingsData.selectedQuality);
    console.log("Settings saved:", settingsData);
  };

  // Get background style
  const getBackgroundStyle = (bg: VirtualBackground): React.CSSProperties => {
    switch (bg.type) {
      case "gradient":
        return { background: bg.gradient };
      case "pattern":
        return {
          backgroundColor: bg.backgroundColor,
          backgroundImage: bg.pattern,
          backgroundSize: bg.patternSize,
        };
      case "image":
        return { backgroundImage: `url(${bg.url})`, backgroundSize: "cover", backgroundPosition: "center" };
      default:
        return {};
    }
  };

  // Loading state
  if (isConnecting) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
        }}
      >
        <div className="text-center">
          {/* Tenant Logo */}
          {tenantLogo && (
            <img
              src={tenantLogo}
              alt={tenantName}
              className="h-12 w-auto mx-auto mb-8 opacity-80"
            />
          )}

          {/* Modern loading animation */}
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto">
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  background: `conic-gradient(${primaryColor}, ${secondaryColor}, ${primaryColor})`,
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #fff calc(100% - 4px))",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #fff calc(100% - 4px))",
                }}
              />
            </div>
          </div>

          <p className="text-white text-xl font-semibold mb-2">Connecting to call...</p>
          <p className="text-gray-400 text-sm">Room: {roomId.slice(0, 12)}...</p>

          {/* Quality indicator */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white/80 text-sm">{selectedQuality.name}</span>
          </div>

          {/* Powered by */}
          <div className="mt-8 text-sm text-gray-500">
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
          background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
        }}
      >
        <div className="text-center max-w-md p-8 bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl mx-4 border border-white/10">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <PhoneOff className="w-10 h-10" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-white text-2xl font-bold mb-3">Connection Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
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

  // Get participants excluding self
  const remoteParticipants = session?.participants.filter((p) => p.id !== userId) || [];
  const totalParticipants = (session?.participants.length || 0);

  // Calculate grid layout
  const getGridClass = () => {
    if (layout === "spotlight" && remoteParticipants.length > 0) {
      return "grid-cols-1";
    }
    const count = remoteParticipants.length + 1;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2 grid-rows-2";
    if (count <= 6) return "grid-cols-3 grid-rows-2";
    return "grid-cols-3 grid-rows-3";
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-full text-white overflow-hidden"
      style={{
        background: selectedBackground.type !== "none" && selectedBackground.type !== "blur"
          ? undefined
          : `linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
        ...getBackgroundStyle(selectedBackground),
      }}
    >
      {/* Header Section - Matches PageHeader pattern */}
      <div
        className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 py-3 sm:py-4 z-20 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
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
              <Video className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: primaryColor }} />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Video Call
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

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Quality badge - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/10 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-gray-700 dark:text-white/80 text-xs font-medium">{selectedQuality.name}</span>
            </div>

            {/* Layout toggle - Hidden on mobile */}
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setLayout("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  layout === "grid"
                    ? "bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-white/60 hover:text-gray-700 dark:hover:text-white"
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout("spotlight")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  layout === "spotlight"
                    ? "bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-white/60 hover:text-gray-700 dark:hover:text-white"
                }`}
                title="Spotlight view"
              >
                <Columns className="w-4 h-4" />
              </button>
            </div>

            {/* More options */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <MoreVertical className="w-5 h-5 text-gray-500 dark:text-white/70" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden z-[100]">
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Call Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowBackgroundMenu(!showBackgroundMenu);
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer text-sm"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Change Background</span>
                  </button>
                  <button
                    onClick={copyRoomId}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Room ID</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowAddParticipant(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Participant</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-white/10" />
                  <button
                    onClick={endCall}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer text-sm"
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
            Video Call
          </span>
        </div>
      </div>

      {/* Background selector dropdown */}
      {showBackgroundMenu && (
        <div className="absolute top-[72px] sm:top-[80px] right-2 sm:right-4 w-72 sm:w-80 bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-3 sm:p-4 z-30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Virtual Background</h3>
            <button
              onClick={() => setShowBackgroundMenu(false)}
              className="p-1 hover:bg-white/10 rounded-full"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {VIRTUAL_BACKGROUNDS.slice(0, 12).map((bg) => (
              <button
                key={bg.id}
                onClick={() => {
                  setSelectedBackground(bg);
                }}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  selectedBackground.id === bg.id
                    ? "border-blue-500 ring-2 ring-blue-500/30"
                    : "border-transparent hover:border-white/30"
                }`}
              >
                {bg.type === "none" ? (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-400" />
                  </div>
                ) : bg.type === "blur" ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700" />
                ) : bg.preview ? (
                  bg.type === "image" ? (
                    <img src={bg.preview} alt={bg.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ background: bg.preview }} />
                  )
                ) : null}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="flex-1 p-2 sm:p-4 pb-24 sm:pb-28">
        {/* Screen Share Display - Takes priority when active */}
        {screenShareStream && (
          <div className="h-full flex gap-4">
            {/* Main screen share view */}
            <div className="flex-1 relative bg-gray-900/80 backdrop-blur rounded-2xl overflow-hidden border border-white/10">
              <video
                ref={screenShareVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
              />
              {/* Screen share indicator badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Monitor className="w-4 h-4" />
                  <span>
                    {screenShareParticipantId === userId
                      ? "You are sharing your screen"
                      : `${session?.participants.find(p => p.id === screenShareParticipantId)?.name || "Someone"} is sharing`}
                  </span>
                </div>
              </div>

              {/* Stop sharing button (only for local share) */}
              {screenShareParticipantId === userId && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button
                    onClick={stopScreenShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium shadow-lg shadow-red-500/30 transition-all"
                  >
                    <MonitorOff className="w-4 h-4" />
                    <span>Stop Sharing</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar with participants during screen share */}
            <div className="w-56 flex flex-col gap-3 overflow-y-auto">
              {/* Self view */}
              <div className="relative aspect-video bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden flex-shrink-0">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
                />
                {isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-black/60 rounded-md text-xs font-medium">You</span>
                  {isMuted && (
                    <span className="p-1 bg-red-500 rounded-md">
                      <MicOff className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Remote participants */}
              {remoteParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="relative aspect-video bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden flex-shrink-0"
                >
                  <video
                    ref={(el) => {
                      if (el) {
                        remoteVideoRefs.current.set(participant.id, el);
                        const stream = remoteStreams.get(participant.id);
                        if (stream) {
                          el.srcObject = stream;
                        }
                      }
                    }}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${participant.isVideoOff ? "hidden" : ""}`}
                  />
                  {participant.isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-1.5 left-1.5">
                    <span className="px-2 py-0.5 bg-black/60 rounded-md text-xs font-medium">{participant.name}</span>
                  </div>
                  {participant.isMuted && (
                    <div className="absolute bottom-1.5 right-1.5">
                      <span className="p-1 bg-red-500 rounded-md">
                        <MicOff className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Normal Video Grid (when not screen sharing) */}
        {!screenShareStream && layout === "spotlight" && remoteParticipants.length > 0 ? (
          // Spotlight layout
          <div className="h-full flex gap-4">
            {/* Main speaker */}
            <div className="flex-1 relative bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden">
              <video
                ref={(el) => {
                  if (el && remoteParticipants[0]) {
                    remoteVideoRefs.current.set(remoteParticipants[0].id, el);
                    const stream = remoteStreams.get(remoteParticipants[0].id);
                    if (stream) {
                      el.srcObject = stream;
                    }
                  }
                }}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${
                  remoteParticipants[0]?.isVideoOff ? "hidden" : ""
                }`}
              />
              {remoteParticipants[0]?.isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {remoteParticipants[0].avatar ? (
                    <Image
                      src={remoteParticipants[0].avatar}
                      alt={remoteParticipants[0].name}
                      width={160}
                      height={160}
                      className="w-40 h-40 rounded-full"
                    />
                  ) : (
                    <div
                      className="w-40 h-40 rounded-full flex items-center justify-center text-5xl font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    >
                      {remoteParticipants[0].name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              {/* Name badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1.5 bg-black/60 backdrop-blur rounded-lg text-sm font-medium">
                  {remoteParticipants[0]?.name}
                </span>
                {remoteParticipants[0]?.isMuted && (
                  <span className="p-1.5 bg-red-500 rounded-lg">
                    <MicOff className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>

            {/* Sidebar with other participants + self */}
            <div className="w-48 flex flex-col gap-3">
              {/* Self view */}
              <div className="relative aspect-video bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden group">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
                />
                {isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-black/60 rounded text-xs">You</span>
                  {isMuted && (
                    <span className="p-1 bg-red-500 rounded">
                      <MicOff className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Other remote participants */}
              {remoteParticipants.slice(1).map((participant) => (
                <div
                  key={participant.id}
                  className="relative aspect-video bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden"
                >
                  <video
                    ref={(el) => {
                      if (el) {
                        remoteVideoRefs.current.set(participant.id, el);
                        const stream = remoteStreams.get(participant.id);
                        if (stream) {
                          el.srcObject = stream;
                        }
                      }
                    }}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${participant.isVideoOff ? "hidden" : ""}`}
                  />
                  {participant.isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1">
                    <span className="px-2 py-0.5 bg-black/60 rounded text-xs">{participant.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !screenShareStream ? (
          // Grid layout (only when not screen sharing)
          <div className={`grid gap-4 h-full ${getGridClass()}`}>
            {/* Local video */}
            <div className="relative bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden group">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1.5 bg-black/60 backdrop-blur rounded-lg text-sm font-medium">
                  {userName} (You)
                </span>
                {isMuted && (
                  <span className="p-1.5 bg-red-500 rounded-lg">
                    <MicOff className="w-4 h-4" />
                  </span>
                )}
              </div>

              {/* Video quality indicator on hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-2 py-1 bg-black/60 backdrop-blur rounded-lg flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-white/80">{selectedQuality.name}</span>
                </div>
              </div>
            </div>

            {/* Remote participants */}
            {remoteParticipants.map((participant) => (
              <div
                key={participant.id}
                className="relative bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden"
              >
                <video
                  ref={(el) => {
                    if (el) {
                      remoteVideoRefs.current.set(participant.id, el);
                      const stream = remoteStreams.get(participant.id);
                      if (stream) {
                        el.srcObject = stream;
                      }
                    }
                  }}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${participant.isVideoOff ? "hidden" : ""}`}
                />
                {participant.isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {participant.avatar ? (
                      <Image
                        src={participant.avatar}
                        alt={participant.name}
                        width={112}
                        height={112}
                        className="w-28 h-28 rounded-full shadow-2xl"
                      />
                    ) : (
                      <div
                        className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-black/60 backdrop-blur rounded-lg text-sm font-medium">
                    {participant.name}
                  </span>
                  {participant.isMuted && (
                    <span className="p-1.5 bg-red-500 rounded-lg">
                      <MicOff className="w-4 h-4" />
                    </span>
                  )}
                  {participant.isSpeaking && (
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Empty state */}
            {remoteParticipants.length === 0 && (
              <div className="flex items-center justify-center bg-gray-800/30 backdrop-blur rounded-2xl border border-white/10">
                <div className="text-center p-8">
                  <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70 text-lg mb-2">Waiting for others to join...</p>
                  <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                    <span>Room ID:</span>
                    <code className="px-2 py-1 bg-white/10 rounded">{roomId.slice(0, 12)}...</code>
                    <button
                      onClick={copyRoomId}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Controls Bar - Modern Pill Design */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 transition-all duration-300 ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex justify-center">
          <div className="bg-gray-900/90 backdrop-blur-2xl rounded-full px-2 sm:px-3 py-2 sm:py-2.5 shadow-2xl border border-white/10 flex items-center gap-1 sm:gap-1.5 md:gap-2">
            {/* Mute - Pill button */}
            <button
              onClick={toggleMute}
              className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                isMuted
                  ? "bg-red-500/90 text-white shadow-lg shadow-red-500/20"
                  : "bg-white/10 hover:bg-white/15 text-white/90 hover:text-white"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Mic className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
              <span className="hidden md:inline text-xs font-medium">{isMuted ? "Unmute" : "Mute"}</span>
            </button>

            {/* Video toggle - Pill button */}
            {callType === "video" && (
              <button
                onClick={toggleVideo}
                className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isVideoOff
                    ? "bg-red-500/90 text-white shadow-lg shadow-red-500/20"
                    : "bg-white/10 hover:bg-white/15 text-white/90 hover:text-white"
                }`}
                title={isVideoOff ? "Turn on camera" : "Turn off camera"}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Video className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
                <span className="hidden md:inline text-xs font-medium">{isVideoOff ? "Start" : "Stop"}</span>
              </button>
            )}

            {/* Screen share - Pill button - hidden on mobile */}
            <button
              onClick={isScreenSharing ? stopScreenShare : toggleScreenShare}
              className={`hidden sm:flex group relative items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                isScreenSharing
                  ? "text-white shadow-lg"
                  : "bg-white/10 hover:bg-white/15 text-white/90 hover:text-white"
              }`}
              style={isScreenSharing ? { backgroundColor: primaryColor, boxShadow: `0 4px 12px ${primaryColor}40` } : {}}
              title={isScreenSharing ? "Stop sharing" : "Share screen"}
            >
              {isScreenSharing ? <MonitorOff className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Monitor className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
              <span className="hidden md:inline text-xs font-medium">{isScreenSharing ? "Stop" : "Share"}</span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 sm:h-8 bg-white/10 mx-0.5 sm:mx-1" />

            {/* End call - Prominent pill */}
            <button
              onClick={endCall}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/40 cursor-pointer"
              title="End call"
            >
              <PhoneOff className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white" />
              <span className="hidden md:inline text-xs font-medium text-white">End</span>
            </button>

            {/* Divider - hidden on very small screens */}
            <div className="hidden sm:block w-px h-6 sm:h-8 bg-white/10 mx-0.5 sm:mx-1" />

            {/* Chat - Pill button - hidden on very small screens */}
            <button
              onClick={() => {
                setShowChat(!showChat);
                setShowParticipants(false);
              }}
              className={`hidden sm:flex group relative items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
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

            {/* Participants - Pill button - hidden on very small screens */}
            <button
              onClick={() => {
                setShowParticipants(!showParticipants);
                setShowChat(false);
              }}
              className={`hidden sm:flex group relative items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
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
                {totalParticipants}
              </span>
            </button>

            {/* Fullscreen - Icon only pill - hidden on very small screens */}
            <button
              onClick={toggleFullscreen}
              className="hidden sm:flex p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/15 transition-all duration-200 text-white/90 hover:text-white cursor-pointer"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Maximize2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="absolute right-0 top-[72px] sm:top-[80px] bottom-0 w-full sm:w-80 md:w-96 bg-gray-900/98 backdrop-blur-xl border-l border-white/10 flex flex-col z-10">
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
                className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                className="px-5 py-3 text-white rounded-xl transition-all hover:opacity-90 cursor-pointer"
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
        <div className="absolute right-0 top-[72px] sm:top-[80px] bottom-0 w-full sm:w-80 md:w-96 bg-gray-900/98 backdrop-blur-xl border-l border-white/10 flex flex-col z-10">
          <div className="p-3 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold text-white text-base sm:text-lg">
              Participants ({totalParticipants})
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
                  <Image
                    src={participant.avatar}
                    alt={participant.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full ring-2 ring-white/10"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ring-2 ring-white/10"
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
                  {participant.isVideoOff && <VideoOff className="w-4 h-4 text-red-400" />}
                  {participant.isScreenSharing && (
                    <Monitor className="w-4 h-4" style={{ color: primaryColor }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add participant button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                setShowParticipants(false);
                setShowAddParticipant(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl transition-all hover:opacity-90 cursor-pointer"
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
        meetingTitle="Video Call"
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onAddParticipant={(participant) => {
          console.log("Invited participant:", participant);
          // In a real app, this would send an invite notification to the participant
        }}
      />

      {/* Click outside to close menus */}
      {(showMoreMenu || showBackgroundMenu) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowMoreMenu(false);
            setShowBackgroundMenu(false);
          }}
        />
      )}
    </div>
  );
}
