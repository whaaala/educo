"use client";

import React, { useState } from "react";
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
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmojiReactionBar } from "./EmojiReactionBar";

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
  onToggleScreenShare?: () => void;
  onToggleFullscreen: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onToggleRecording?: () => void;
  onEndCall: () => void;
  onSettings?: () => void;
  onChangeLayout?: () => void;

  // Reactions
  onReaction?: (emoji: string) => void;
  onGiphy?: (gif: { url: string; title: string }) => void;
  giphyApiKey?: string;

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
  disabled,
  tooltip,
}: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip || label}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-0.5 sm:gap-1",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "cursor-pointer select-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
        "active:scale-[0.92]",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {/* Button circle */}
      <div
        className={cn(
          "relative w-9 h-9 sm:w-[46px] sm:h-[46px] rounded-full flex items-center justify-center",
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "group-hover:scale-110",
          isDestructive
            ? "bg-red-500 text-white shadow-[0_4px_16px_rgba(239,68,68,0.4)] group-hover:bg-red-400 group-hover:shadow-[0_6px_24px_rgba(239,68,68,0.5)]"
            : isActive
            ? "text-white shadow-lg"
            : [
                "bg-gray-50 dark:bg-white/[0.08] midnight:bg-white/[0.06] purple:bg-white/[0.06]",
                "text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200",
                "group-hover:bg-gray-100 dark:group-hover:bg-white/[0.14] midnight:group-hover:bg-white/[0.1] purple:group-hover:bg-white/[0.1]",
                "group-hover:text-gray-900 dark:group-hover:text-white",
                "group-hover:shadow-md dark:group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]",
              ]
        )}
        style={
          isActive && !isDestructive
            ? {
                background: primaryColor,
                boxShadow: `0 4px 18px ${primaryColor}45`,
              }
            : {}
        }
      >
        <div className="transition-transform duration-200 ease-out">
          {icon}
        </div>

        {/* Subtle active ring */}
        {isActive && !isDestructive && (
          <div
            className="absolute -inset-[2px] rounded-full opacity-25"
            style={{ border: `2px solid ${primaryColor}` }}
          />
        )}
      </div>

      {/* Label */}
      {label && (
        <span
          className={cn(
            "hidden sm:block text-[10px] sm:text-[11px] font-medium tracking-wide transition-all duration-300",
            "group-hover:tracking-wider",
            isDestructive
              ? "text-red-500 dark:text-red-400 group-hover:text-red-400"
              : isActive
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 group-hover:text-gray-700 dark:group-hover:text-gray-200"
          )}
        >
          {label}
        </span>
      )}

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-gray-900 midnight:ring-[#0f1729] purple:ring-[#2a1a3e]"
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
    <div className="hidden sm:block w-px h-7 bg-gray-200 dark:bg-gray-700/50 midnight:bg-cyan-500/15 purple:bg-pink-500/15 mx-1.5 rounded-full" />
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
  onReaction,
  onGiphy,
  giphyApiKey,
  className,
}: ControlBarProps) {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-wrap items-center justify-center gap-1 sm:gap-2 lg:gap-3 px-2 sm:px-6 py-2 sm:py-4",
        "bg-white/98 dark:bg-gray-900/98 midnight:bg-[#0f1729]/98 purple:bg-[#2a1a3e]/98 backdrop-blur-xl",
        "border-t border-gray-100 dark:border-gray-800 midnight:border-cyan-500/20 purple:border-pink-500/20",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {/* Emoji Reaction Bar (floating above) */}
      {onReaction && (
        <EmojiReactionBar
          isOpen={showReactions}
          onClose={() => setShowReactions(false)}
          onReaction={(emoji) => {
            onReaction(emoji);
            setShowReactions(false);
          }}
          onGiphy={onGiphy}
          primaryColor={primaryColor}
          giphyApiKey={giphyApiKey}
        />
      )}
      {/* Primary Controls - Audio/Video */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mute */}
        <ControlButton
          icon={isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
          label={isMuted ? "Unmute" : "Mute"}
          isActive={isMuted}
          onClick={onToggleMute}
          primaryColor="#ef4444"
          tooltip={isMuted ? "Turn on microphone" : "Turn off microphone"}
        />

        {/* Video */}
        <ControlButton
          icon={isVideoOff ? <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Video className="w-4 h-4 sm:w-5 sm:h-5" />}
          label={isVideoOff ? "Start" : "Stop"}
          isActive={isVideoOff}
          onClick={onToggleVideo}
          primaryColor="#ef4444"
          tooltip={isVideoOff ? "Turn on camera" : "Turn off camera"}
        />
      </div>

      <ControlDivider />

      {/* Secondary Controls - Recording/Sharing */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Record */}
        {onToggleRecording && (
          <ControlButton
            icon={
              <Circle
                className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5 transition-all",
                  isRecording && "fill-current text-red-500"
                )}
              />
            }
            label="Record"
            isActive={isRecording}
            onClick={onToggleRecording}
            primaryColor="#ef4444"
            tooltip={isRecording ? "Stop recording" : "Start recording"}
          />
        )}

        {/* Screen Share */}
        {onToggleScreenShare && (
          <ControlButton
            icon={
              isScreenSharing ? (
                <MonitorOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
              )
            }
            label="Share"
            isActive={isScreenSharing}
            onClick={onToggleScreenShare}
            primaryColor={primaryColor}
            tooltip={isScreenSharing ? "Stop sharing screen" : "Share your screen"}
          />
        )}

        {/* Layout Toggle */}
        {onChangeLayout && (
          <ControlButton
            icon={<LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="Layout"
            onClick={onChangeLayout}
            tooltip="Change layout"
          />
        )}

        {/* Reactions */}
        {onReaction && (
          <ControlButton
            icon={<Smile className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="React"
            isActive={showReactions}
            onClick={() => setShowReactions(!showReactions)}
            primaryColor={primaryColor}
            tooltip="Send a reaction"
          />
        )}
      </div>

      <ControlDivider />

      {/* End Call - Prominent */}
      <div className="mx-0.5 sm:mx-2">
        <ControlButton
          icon={<PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="End"
          isDestructive
          onClick={onEndCall}
          tooltip="End call"
        />
      </div>

      <ControlDivider />

      {/* Tertiary Controls - Panels */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Chat */}
        <ControlButton
          icon={<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Chat"
          isActive={showChat}
          badge={unreadMessageCount}
          onClick={onToggleChat}
          primaryColor={primaryColor}
          tooltip="Toggle chat panel"
        />

        {/* Participants */}
        <ControlButton
          icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
          label={participantCount.toString()}
          isActive={showParticipants}
          badge={participantCount}
          onClick={onToggleParticipants}
          primaryColor={primaryColor}
          tooltip="Toggle participants panel"
        />

        {/* Fullscreen */}
        <ControlButton
          icon={
            isFullscreen ? (
              <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )
          }
          onClick={onToggleFullscreen}
          tooltip={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        />

        {/* Settings (if provided) */}
        {onSettings && (
          <ControlButton
            icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5" />}
            onClick={onSettings}
            tooltip="Open settings"
          />
        )}
      </div>
    </div>
  );
}

export default ControlBar;
