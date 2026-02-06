"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  UserPlus,
  MicOff,
  VideoOff,
  Monitor,
  Crown,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  username?: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isScreenSharing?: boolean;
  isSpeaking?: boolean;
  isHost?: boolean;
}

export interface ParticipantsPanelProps {
  participants: Participant[];
  currentUserId: string;
  primaryColor?: string;
  secondaryColor?: string;
  onClose: () => void;
  onAddParticipant?: () => void;
  className?: string;
}

export function ParticipantsPanel({
  participants,
  currentUserId,
  primaryColor = "#2563eb",
  secondaryColor = "#1e40af",
  onClose,
  onAddParticipant,
  className,
}: ParticipantsPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-gray-900",
        "w-full h-full",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Participants
          </h3>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {participants.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer active:scale-95"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto py-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5",
              "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer",
              participant.isSpeaking && "bg-green-50/50 dark:bg-green-900/10"
            )}
          >
            {/* Avatar with online indicator */}
            <div className="relative flex-shrink-0">
              {participant.avatar ? (
                <Image
                  src={participant.avatar}
                  alt={participant.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  {participant.name.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
            </div>

            {/* Name and Username */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                  {participant.name}
                </span>
                {participant.isHost && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: "#f59e0b" }}
                  >
                    Host
                  </span>
                )}
                {participant.id === currentUserId && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">(You)</span>
                )}
              </div>
              {/* Username - like @johnwayne */}
              <span className="text-xs text-gray-400 dark:text-gray-500 truncate block">
                @{participant.username || participant.name.toLowerCase().replace(/\s+/g, '')}
              </span>
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {participant.isSpeaking && (
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "#22c55e" }}
                />
              )}
              {participant.isMuted && (
                <div className="p-1 rounded bg-red-100 dark:bg-red-900/30">
                  <MicOff className="w-3 h-3 text-red-500" />
                </div>
              )}
              {participant.isVideoOff && (
                <div className="p-1 rounded bg-gray-100 dark:bg-gray-700">
                  <VideoOff className="w-3 h-3 text-gray-400" />
                </div>
              )}
              {participant.isScreenSharing && (
                <div
                  className="p-1 rounded"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Monitor className="w-3 h-3" style={{ color: primaryColor }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Participant Button */}
      {onAddParticipant && (
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onAddParticipant}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-lg cursor-pointer active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              boxShadow: `0 4px 14px ${primaryColor}30`,
            }}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Participant</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ParticipantsPanel;
