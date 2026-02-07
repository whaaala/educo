"use client";

import React from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  MessageSquare,
  Users,
  Maximize2,
  Minimize2,
  Grid,
  Circle,
  Settings,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ControlBarProps {
  // Media states
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isFullscreen: boolean;
  isRecording?: boolean;

  // Panel states
  showChat: boolean;
  showParticipants: boolean;

  // Counts
  participantCount: number;
  unreadMessageCount?: number;

  // Call type
  callType: "video" | "voice";

  // Colors
  primaryColor?: string;
  secondaryColor?: string;

  // Handlers
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleFullscreen: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onToggleRecording?: () => void;
  onEndCall: () => void;
  onSettings?: () => void;
  onChangeLayout?: () => void;

  className?: string;
}

interface ControlButtonProps {
  icon: React.ReactNode;
  label?: string;
  isActive?: boolean;
  isDestructive?: boolean;
  badge?: number;
  onClick: () => void;
  primaryColor?: string;
  className?: string;
  hideOnMobile?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

function ControlButton({
  icon,
  label,
  isActive,
  isDestructive,
  badge,
  onClick,
  primaryColor = "#2563eb",
  className,
  hideOnMobile,
  disabled,
  tooltip,
}: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip || label}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1",
        "transition-all duration-200 ease-out",
        "cursor-pointer select-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
        "active:scale-95",
        hideOnMobile && "hidden sm:flex",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Circle Button */}
      <div
        className={cn(
          "relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center",
          "transition-all duration-200 ease-out",
          "shadow-sm hover:shadow-lg hover:scale-105",
          isDestructive
            ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/25"
            : isActive
            ? "text-white shadow-lg"
            : "bg-white dark:bg-gray-800 midnight:bg-[#0d1220] purple:bg-[#1f0d33] text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-900/30 purple:hover:bg-pink-900/30 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
        )}
        style={
          isActive && !isDestructive
            ? {
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                boxShadow: `0 4px 14px ${primaryColor}40`,
              }
            : {}
        }
      >
        {icon}

        {/* Active indicator ring */}
        {isActive && !isDestructive && (
          <div
            className="absolute inset-0 rounded-full animate-pulse opacity-30"
            style={{ boxShadow: `0 0 0 3px ${primaryColor}` }}
          />
        )}
      </div>

      {/* Label */}
      {label && (
        <span
          className={cn(
            "text-[10px] sm:text-xs font-medium transition-colors duration-200",
            isDestructive
              ? "text-red-500 dark:text-red-400"
              : isActive
              ? "text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70"
          )}
        >
          {label}
        </span>
      )}

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0",
            "min-w-[18px] h-[18px] px-1 rounded-full",
            "text-[10px] font-bold text-white",
            "flex items-center justify-center",
            "shadow-sm",
            "animate-in fade-in zoom-in duration-200"
          )}
          style={{ backgroundColor: primaryColor }}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

// Divider component for visual separation
function ControlDivider() {
  return (
    <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-700 midnight:bg-cyan-500/20 purple:bg-pink-500/20 mx-1" />
  );
}

export function ControlBar({
  isMuted,
  isVideoOff,
  isScreenSharing,
  isFullscreen,
  isRecording,
  showChat,
  showParticipants,
  participantCount,
  unreadMessageCount,
  callType,
  primaryColor = "#2563eb",
  secondaryColor = "#1e40af",
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleFullscreen,
  onToggleChat,
  onToggleParticipants,
  onToggleRecording,
  onEndCall,
  onSettings,
  onChangeLayout,
  className,
}: ControlBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-6 py-3 sm:py-4",
        "bg-white/98 dark:bg-gray-900/98 midnight:bg-[#0f1729]/98 purple:bg-[#2a1a3e]/98 backdrop-blur-xl",
        "border-t border-gray-100 dark:border-gray-800 midnight:border-cyan-500/20 purple:border-pink-500/20",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {/* Primary Controls - Audio/Video */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mute */}
        <ControlButton
          icon={isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          label={isMuted ? "Unmute" : "Mute"}
          isActive={isMuted}
          onClick={onToggleMute}
          primaryColor="#ef4444"
          tooltip={isMuted ? "Turn on microphone" : "Turn off microphone"}
        />

        {/* Video (only for video calls) */}
        {callType === "video" && (
          <ControlButton
            icon={isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            label={isVideoOff ? "Start" : "Stop"}
            isActive={isVideoOff}
            onClick={onToggleVideo}
            primaryColor="#ef4444"
            tooltip={isVideoOff ? "Turn on camera" : "Turn off camera"}
          />
        )}
      </div>

      <ControlDivider />

      {/* Secondary Controls - Recording/Sharing */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Record */}
        {onToggleRecording && (
          <ControlButton
            icon={
              <Circle
                className={cn(
                  "w-5 h-5 transition-all",
                  isRecording && "fill-current text-red-500"
                )}
              />
            }
            label="Record"
            isActive={isRecording}
            onClick={onToggleRecording}
            primaryColor="#ef4444"
            hideOnMobile
            tooltip={isRecording ? "Stop recording" : "Start recording"}
          />
        )}

        {/* Screen Share */}
        {callType === "video" && (
          <ControlButton
            icon={
              isScreenSharing ? (
                <MonitorOff className="w-5 h-5" />
              ) : (
                <Monitor className="w-5 h-5" />
              )
            }
            label="Share"
            isActive={isScreenSharing}
            onClick={onToggleScreenShare}
            primaryColor={primaryColor}
            hideOnMobile
            tooltip={isScreenSharing ? "Stop sharing screen" : "Share your screen"}
          />
        )}

        {/* Layout Toggle */}
        {callType === "video" && onChangeLayout && (
          <ControlButton
            icon={<LayoutGrid className="w-5 h-5" />}
            label="Layout"
            onClick={onChangeLayout}
            hideOnMobile
            tooltip="Change layout"
          />
        )}
      </div>

      <ControlDivider />

      {/* End Call - Prominent */}
      <div className="mx-1 sm:mx-2">
        <ControlButton
          icon={<PhoneOff className="w-5 h-5" />}
          label="End"
          isDestructive
          onClick={onEndCall}
          tooltip="End call"
        />
      </div>

      <ControlDivider />

      {/* Tertiary Controls - Panels */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Chat */}
        <ControlButton
          icon={<MessageSquare className="w-5 h-5" />}
          label="Chat"
          isActive={showChat}
          badge={unreadMessageCount}
          onClick={onToggleChat}
          primaryColor={primaryColor}
          hideOnMobile
          tooltip="Toggle chat panel"
        />

        {/* Participants */}
        <ControlButton
          icon={<Users className="w-5 h-5" />}
          label={participantCount.toString()}
          isActive={showParticipants}
          badge={participantCount}
          onClick={onToggleParticipants}
          primaryColor={primaryColor}
          hideOnMobile
          tooltip="Toggle participants panel"
        />

        {/* Fullscreen */}
        <ControlButton
          icon={
            isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )
          }
          onClick={onToggleFullscreen}
          hideOnMobile
          tooltip={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        />

        {/* Settings (if provided) */}
        {onSettings && (
          <ControlButton
            icon={<Settings className="w-5 h-5" />}
            onClick={onSettings}
            hideOnMobile
            tooltip="Open settings"
          />
        )}
      </div>
    </div>
  );
}

export default ControlBar;
