"use client";

import React from "react";
import {
  X,
  Share2,
  Search,
  Bell,
  MoreVertical,
  Settings,
  Copy,
  UserPlus,
  PhoneOff,
  Video,
  Phone,
  Users,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CallHeaderProps {
  title: string;
  callType: "video" | "voice";
  duration: number;
  participantCount: number;
  invitedCount?: number;
  isRecording?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  onClose: () => void;
  onSettings?: () => void;
  onCopyRoomId?: () => void;
  onAddParticipant?: () => void;
  onShare?: () => void;
  roomId?: string;
  className?: string;
}

export function CallHeader({
  title,
  callType,
  duration,
  participantCount,
  invitedCount = 0,
  isRecording = false,
  primaryColor = "#2563eb",
  secondaryColor = "#1e40af",
  onClose,
  onSettings,
  onCopyRoomId,
  onAddParticipant,
  onShare,
  roomId,
  className,
}: CallHeaderProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyRoomId = () => {
    if (onCopyRoomId) {
      onCopyRoomId();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowMenu(false);
  };

  const CallIcon = callType === "video" ? Video : Phone;

  return (
    <header
      className={cn(
        "bg-white dark:bg-[#0f1115] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] border-b border-gray-200 dark:border-[#1a1d24] midnight:border-cyan-500/20 purple:border-pink-500/20",
        "px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3",
        "flex items-center justify-between gap-2 sm:gap-4",
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            "p-1.5 sm:p-2 rounded-lg transition-all duration-200",
            "hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20",
            "active:scale-95 cursor-pointer",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          )}
          title="End call"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70" />
        </button>

        {/* Call Icon & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <CallIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: primaryColor }} />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
              {title}
            </h1>
          </div>
        </div>

        {/* Duration Badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-100 dark:bg-[#1a1d24] midnight:bg-cyan-900/20 purple:bg-pink-900/20 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-xs sm:text-sm font-semibold flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
        >
          {isRecording && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Center spacer */}
      <div className="flex-1" />

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Share Button */}
        {onShare && (
          <button
            onClick={onShare}
            className={cn(
              "hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg",
              "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-cyan-900/20 purple:bg-pink-900/20",
              "hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-900/30 purple:hover:bg-pink-900/30",
              "active:scale-95 cursor-pointer",
              "transition-all duration-200",
              "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 text-sm font-medium"
            )}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden lg:inline">Share link</span>
          </button>
        )}

        {/* More Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg",
              "hover:bg-gray-100 dark:hover:bg-[#22262e]",
              "active:scale-95 cursor-pointer",
              "transition-all duration-200",
              "text-gray-500 dark:text-gray-400"
            )}
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#1a1d24] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden z-50 py-1">
                {onSettings && (
                  <button
                    onClick={() => {
                      onSettings();
                      setShowMenu(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5",
                      "text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200",
                      "hover:bg-gray-50 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20",
                      "cursor-pointer transition-colors"
                    )}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                )}
                {onCopyRoomId && (
                  <button
                    onClick={handleCopyRoomId}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5",
                      "text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200",
                      "hover:bg-gray-50 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20",
                      "cursor-pointer transition-colors"
                    )}
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? "Copied!" : "Copy Room ID"}</span>
                  </button>
                )}
                {onAddParticipant && (
                  <button
                    onClick={() => {
                      onAddParticipant();
                      setShowMenu(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5",
                      "text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200",
                      "hover:bg-gray-50 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20",
                      "cursor-pointer transition-colors"
                    )}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Participant</span>
                  </button>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 my-1" />
                <button
                  onClick={() => {
                    onClose();
                    setShowMenu(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5",
                    "text-sm text-red-600 dark:text-red-400",
                    "hover:bg-red-50 dark:hover:bg-red-500/10 midnight:hover:bg-red-500/10 purple:hover:bg-red-500/10",
                    "cursor-pointer transition-colors"
                  )}
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default CallHeader;
