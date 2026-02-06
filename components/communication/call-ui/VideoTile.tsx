"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { MicOff, VideoOff, Monitor, Pin, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VideoTileProps {
  name: string;
  avatar?: string;
  isVideoOff?: boolean;
  isMuted?: boolean;
  isSpeaking?: boolean;
  isScreenSharing?: boolean;
  isPinned?: boolean;
  isLocal?: boolean;
  showName?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "full";
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  onClick?: () => void;
  onPin?: () => void;
}

export const VideoTile = forwardRef<HTMLVideoElement, VideoTileProps>(
  (
    {
      name,
      avatar,
      isVideoOff,
      isMuted,
      isSpeaking,
      isScreenSharing,
      isPinned,
      isLocal,
      showName = true,
      size = "md",
      primaryColor = "#2563eb",
      secondaryColor = "#1e40af",
      className,
      onClick,
      onPin,
    },
    ref
  ) => {
    const sizeClasses = {
      xs: "w-16 h-12 sm:w-20 sm:h-16",
      sm: "w-24 h-20 sm:w-32 sm:h-24",
      md: "w-40 h-32 sm:w-48 sm:h-36",
      lg: "w-60 h-44 sm:w-72 sm:h-52",
      full: "w-full h-full",
    };

    const avatarSizes = {
      xs: "w-6 h-6 text-xs",
      sm: "w-10 h-10 text-sm",
      md: "w-16 h-16 text-xl",
      lg: "w-24 h-24 text-3xl",
      full: "w-28 h-28 sm:w-32 sm:h-32 text-4xl",
    };

    return (
      <div
        className={cn(
          "relative rounded-xl sm:rounded-2xl overflow-hidden group",
          "bg-gray-900 dark:bg-gray-800",
          sizeClasses[size],
          isSpeaking && "ring-2 sm:ring-3",
          onClick && "cursor-pointer",
          className
        )}
        style={isSpeaking ? { ringColor: primaryColor } : {}}
        onClick={onClick}
      >
        {/* Video Element (or placeholder) */}
        {!isVideoOff ? (
          <video
            ref={ref}
            autoPlay
            muted={isLocal}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                width={128}
                height={128}
                className={cn("rounded-full object-cover", avatarSizes[size])}
              />
            ) : (
              <div
                className={cn(
                  "rounded-full flex items-center justify-center font-semibold text-white",
                  avatarSizes[size]
                )}
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Speaking Indicator - Animated border glow */}
        {isSpeaking && (
          <div
            className="absolute inset-0 pointer-events-none animate-pulse"
            style={{
              boxShadow: `inset 0 0 0 2px ${primaryColor}, 0 0 20px ${primaryColor}40`,
            }}
          />
        )}

        {/* Top Right - Pin/More Actions */}
        {size !== "xs" && (
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onPin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin();
                }}
                className={cn(
                  "p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors",
                  isPinned
                    ? "bg-white/90 text-gray-900"
                    : "bg-black/50 text-white hover:bg-black/70"
                )}
              >
                <Pin className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
            <button className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors">
              <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

        {/* Bottom Left - Name Badge */}
        {showName && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1.5 sm:gap-2">
            <span
              className={cn(
                "px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg bg-black/60 backdrop-blur-sm",
                "text-white font-medium truncate max-w-[120px] sm:max-w-[150px]",
                size === "xs" ? "text-[9px]" : size === "sm" ? "text-[10px]" : "text-xs sm:text-sm"
              )}
            >
              {isLocal ? "You" : name}
            </span>
          </div>
        )}

        {/* Bottom Right - Status Icons */}
        <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 flex items-center gap-1">
          {isMuted && (
            <span className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-red-500/90">
              <MicOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </span>
          )}
          {isScreenSharing && (
            <span
              className="p-1 sm:p-1.5 rounded-md sm:rounded-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <Monitor className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </span>
          )}
        </div>

        {/* Connection Quality Indicator (optional) */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-0.5">
            <div className="w-0.5 h-1.5 sm:w-1 sm:h-2 bg-green-500 rounded-full" />
            <div className="w-0.5 h-2 sm:w-1 sm:h-2.5 bg-green-500 rounded-full" />
            <div className="w-0.5 h-2.5 sm:w-1 sm:h-3 bg-green-500 rounded-full" />
          </div>
        </div>
      </div>
    );
  }
);

VideoTile.displayName = "VideoTile";

export default VideoTile;
