"use client";

import Image from "next/image";
import { Inbox, Send, User, AlertCircle, Eye, Reply, Trash2 } from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";
import { AdminMessage, CATEGORY_CONFIG, MessageCategory } from "./types";

export interface MessageCardProps {
  message: AdminMessage;
  formatTime: (timestamp: string) => string;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onView: (message: AdminMessage) => void;
  onReply: (message: AdminMessage) => void;
  onDelete: (message: AdminMessage) => void;
}

// Helper to get category badge
export function getCategoryBadge(category: MessageCategory): React.ReactNode {
  const config = CATEGORY_CONFIG[category];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {category}
    </span>
  );
}

// Helper to format message timestamp
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
}

export default function MessageCard({
  message,
  formatTime,
  isSelected,
  onSelect,
  onView,
  onReply,
  onDelete,
}: MessageCardProps) {
  const isReceived = message.type === "received";

  return (
    <div
      className={`bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border ${
        isSelected
          ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20"
          : !message.isRead && isReceived
          ? "border-blue-300 dark:border-blue-500/50"
          : "border-gray-200 dark:border-gray-700"
      } shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {/* Checkbox for bulk selection */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(message.id, e.target.checked)}
              className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            />
            {isReceived ? (
              <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Inbox className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
            ) : (
              <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                <Send className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
            )}
            {getCategoryBadge(message.category)}
          </div>
          <div className="flex items-center gap-1.5">
            {message.priority === "high" && <AlertCircle className="w-4 h-4 text-red-500" />}
            {!message.isRead && isReceived && <span className="w-2 h-2 rounded-full bg-blue-500" />}
          </div>
        </div>

        {/* From/To */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            {message.senderAvatar ? (
              <Image
                src={message.senderAvatar}
                alt={message.senderName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm truncate ${
                !message.isRead && isReceived
                  ? "font-semibold text-gray-900 dark:text-white"
                  : "font-medium text-gray-700 dark:text-gray-300"
              }`}
            >
              {message.senderName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">To: {message.recipientName}</p>
          </div>
        </div>

        {/* Subject */}
        <p
          className={`text-sm truncate ${
            !message.isRead && isReceived
              ? "font-semibold text-gray-900 dark:text-white"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {message.subject}
        </p>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{message.preview}</p>

        {message.childName && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">Re: {message.childName}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(message.timestamp)}</span>
          <div className="flex items-center gap-1">
            <Tooltip content="View">
              <button
                type="button"
                onClick={() => onView(message)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </Tooltip>
            <Tooltip content="Reply">
              <button
                type="button"
                onClick={() => onReply(message)}
                className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <Reply className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button
                type="button"
                onClick={() => onDelete(message)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
