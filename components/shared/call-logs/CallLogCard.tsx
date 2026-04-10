"use client";

import Image from "next/image";
import {
  User,
  Video,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  Trash2,
  Play,
  RotateCcw,
} from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";
import { CallLog, CALL_STATUS_CONFIG, formatDuration } from "./types";

export interface CallLogCardProps {
  call: CallLog;
  formatTime: (timestamp: string) => string;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onView: (call: CallLog) => void;
  onDelete: (call: CallLog) => void;
  onCallback?: (call: CallLog) => void;
}

// Helper to get status badge
export function getCallStatusBadge(status: CallLog["callStatus"]): React.ReactNode {
  const config = CALL_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

export default function CallLogCard({
  call,
  formatTime,
  isSelected,
  onSelect,
  onView,
  onDelete,
  onCallback,
}: CallLogCardProps) {
  const isCompleted = call.callStatus === "completed";
  const isMissed = call.callStatus === "missed" || call.callStatus === "no_answer";

  return (
    <div
      className={`bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/20"
          : isMissed
          ? "border-red-200 dark:border-red-500/30"
          : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      } shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer`}
      onClick={() => onView(call)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <div className="flex items-start justify-between gap-2 mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(call.id, e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer mt-1"
          />
          <div className="flex items-center gap-2">
            {/* Call Type Icon */}
            <div
              className={`p-1.5 rounded-lg ${
                call.callType === "video"
                  ? "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                  : "bg-emerald-100 dark:bg-emerald-900/30"
              }`}
            >
              {call.callType === "video" ? (
                <Video className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              ) : (
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            {getCallStatusBadge(call.callStatus)}
          </div>
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
            {call.recipientAvatar ? (
              <Image
                src={call.recipientAvatar}
                alt={call.recipientName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {call.callDirection === "incoming" ? (
                <PhoneIncoming
                  className={`w-4 h-4 flex-shrink-0 ${
                    isMissed ? "text-red-500" : "text-green-500"
                  }`}
                />
              ) : (
                <PhoneOutgoing
                  className={`w-4 h-4 flex-shrink-0 ${
                    isMissed ? "text-red-500" : "text-blue-500"
                  }`}
                />
              )}
              <p
                className={`text-sm truncate ${
                  isMissed
                    ? "font-semibold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                    : "font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                }`}
              >
                {call.recipientName}
              </p>
            </div>
            {call.recipientEmail && (
              <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
                {call.recipientEmail}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Duration */}
        {isCompleted && call.duration && (
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
              Duration: {formatDuration(call.duration)}
            </span>
          </div>
        )}

        {/* Recording indicator */}
        {call.recordingUrl && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Recording available</span>
          </div>
        )}

        {call.childName && (
          <p className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mb-3">Re: {call.childName}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            {formatTime(call.startTime)}
          </span>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {call.recordingUrl && (
              <Tooltip content="Play Recording">
                <button
                  onClick={() => onView(call)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </button>
              </Tooltip>
            )}
            {onCallback && (
              <Tooltip content="Call Back">
                <button
                  onClick={() => onCallback(call)}
                  className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </button>
              </Tooltip>
            )}
            <Tooltip content="Delete">
              <button
                onClick={() => onDelete(call)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
