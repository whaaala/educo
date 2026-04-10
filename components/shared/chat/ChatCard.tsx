"use client";

import Image from "next/image";
import { User, Circle, CheckCheck, MessageCircle, Trash2 } from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";
import { ChatConversation } from "./types";

export interface ChatCardProps {
  chat: ChatConversation;
  formatTime: (timestamp: string) => string;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onView: (chat: ChatConversation) => void;
  onDelete: (chat: ChatConversation) => void;
}

// Helper to format chat timestamp
export function formatChatTime(timestamp: string): string {
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
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function ChatCard({
  chat,
  formatTime,
  isSelected,
  onSelect,
  onView,
  onDelete,
}: ChatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border ${
        isSelected ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      } shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer`}
      onClick={() => onView(chat)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <div className="flex items-start justify-between gap-2 mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(chat.id, e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer mt-1"
          />
          <div className="flex items-center gap-2">
            {chat.unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">
                {chat.unreadCount}
              </span>
            )}
            {chat.isOnline && (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                <Circle className="w-2 h-2 fill-current" />
                Online
              </span>
            )}
          </div>
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
            {chat.recipientAvatar ? (
              <Image
                src={chat.recipientAvatar}
                alt={chat.recipientName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
            {chat.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 rounded-full" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm truncate ${
                chat.unreadCount > 0
                  ? "font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                  : "font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
              }`}
            >
              {chat.recipientName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">{chat.recipientEmail}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-3">
          {chat.lastMessageFrom === "admin" && (
            <CheckCheck
              className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                chat.unreadCount === 0 ? "text-blue-500" : "text-gray-400"
              }`}
            />
          )}
          <p
            className={`text-sm line-clamp-2 ${
              chat.unreadCount > 0
                ? "font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
            }`}
          >
            {chat.lastMessage}
          </p>
        </div>

        {chat.childName && (
          <p className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mb-3">Re: {chat.childName}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            {formatTime(chat.lastMessageTime)}
          </span>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Tooltip content="Open Chat">
              <button
                onClick={() => onView(chat)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button
                onClick={() => onDelete(chat)}
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
