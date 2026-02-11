"use client";

import { Sparkles, Phone, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CallConnectingProps {
  /** "voice" or "video" — determines icon and default text */
  callType: "voice" | "video";
  /** Name of the person being called (shown for voice calls) */
  recipientName?: string;
  /** Avatar URL of the recipient */
  recipientAvatar?: string;
  /** Video quality label (e.g. "Full HD 1080p") — shown for video calls */
  qualityLabel?: string;
  /** Tenant/school name for "Powered by" footer */
  tenantName?: string;
}

export default function CallConnecting({
  callType,
  recipientName,
  recipientAvatar,
  qualityLabel,
  tenantName,
}: CallConnectingProps) {
  const isVoice = callType === "voice";
  const CallIcon: LucideIcon = isVoice ? Phone : Video;

  return (
    <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 midnight:bg-[#0a0f1a] purple:bg-[#120622] animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6 px-4">
        {/* Avatar or Spinner */}
        {isVoice && (recipientAvatar || recipientName) ? (
          <div className="relative">
            {recipientAvatar ? (
              <img
                src={recipientAvatar}
                alt={recipientName || "Calling"}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg object-cover ring-3 ring-blue-200 dark:ring-blue-800 midnight:ring-cyan-700 purple:ring-pink-700"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg bg-blue-100 dark:bg-blue-900/40 midnight:bg-cyan-900/40 purple:bg-pink-900/40 ring-3 ring-blue-200 dark:ring-blue-800 midnight:ring-cyan-700 purple:ring-pink-700">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                  {(recipientName || "?").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Subtle pulse ring */}
            <div className="absolute -inset-2 rounded-full border-2 border-blue-400/30 dark:border-blue-400/20 midnight:border-cyan-400/20 purple:border-pink-400/20 animate-ping" />
          </div>
        ) : (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 midnight:border-cyan-900/30 purple:border-pink-900/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 midnight:border-t-cyan-400 purple:border-t-pink-400 rounded-full animate-spin" />
          </div>
        )}

        {/* Text */}
        <div className="text-center space-y-1.5">
          <p className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            {isVoice ? "Calling..." : "Connecting to call..."}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
            {isVoice && recipientName
              ? recipientName
              : "Setting up your session"}
          </p>
        </div>

        {/* Quality badge (video) or call type badge (voice) */}
        {qualityLabel ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700 rounded-full">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
              {qualityLabel}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700 rounded-full">
            <CallIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
              {isVoice ? "Voice Call" : "Video Call"}
            </span>
          </div>
        )}

        {/* Powered by */}
        {tenantName && (
          <p className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 mt-2">
            Powered by {tenantName}
          </p>
        )}
      </div>
    </div>
  );
}
