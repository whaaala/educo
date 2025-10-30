"use client";

import { useState } from "react";
import { Clock, CheckCheck, Trash2 } from "lucide-react";
import Image from "next/image";

interface NotificationCardProps {
  id: string;
  type: "performance" | "appointment" | "record" | "general";
  message: string;
  time: string;
  avatar?: string;
  userName?: string;
  unread: boolean;
  actions?: { label: string; variant?: "primary" | "secondary" }[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  isOdd?: boolean;
}

export default function NotificationCard({
  id,
  type,
  message,
  time,
  avatar,
  userName,
  unread,
  actions,
  onMarkAsRead,
  onDelete,
  isOdd = false,
}: NotificationCardProps) {
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "performance":
        return "from-red-500 to-orange-500";
      case "appointment":
        return "from-purple-500 to-pink-500";
      case "record":
        return "from-blue-500 to-indigo-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const bgColor = isOdd
    ? "bg-white dark:bg-[#252930] midnight:bg-[#0f1729] purple:bg-[#2a1a3e]"
    : "bg-gray-50 dark:bg-[#1e2128] midnight:bg-[#141b2e] purple:bg-[#231533]";

  return (
    <div
      className={`${bgColor} rounded-xl shadow-sm border ${
        unread
          ? "border-blue-200 dark:border-blue-500/30 midnight:border-cyan-500/30 purple:border-pink-500/30"
          : "border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20"
      } hover:shadow-md transition-all duration-200 group`}
    >
      <div className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div
            className="flex-shrink-0 relative group/avatar cursor-pointer"
            onMouseEnter={() => setIsAvatarHovered(true)}
            onMouseLeave={() => setIsAvatarHovered(false)}
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getNotificationColor(
                type
              )} flex items-center justify-center text-white font-bold text-lg shadow-md relative transition-all`}
            >
              {userName ? getInitials(userName) : "N"}
              {unread && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-[#252930]"></div>
              )}
            </div>

            {/* Expanded Avatar Preview on Hover */}
            {isAvatarHovered && (
              <div className="absolute left-full ml-4 top-0 z-50 pointer-events-none">
                <div className="relative w-56 h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
                  {/* Profile Image or Gradient Background */}
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={userName || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${getNotificationColor(
                        type
                      )} flex items-center justify-center relative`}
                    >
                      {/* Decorative pattern background */}
                      <div className="absolute inset-0 opacity-20">
                        <svg width="100%" height="100%" className="text-white">
                          <pattern id={`pattern-${id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="40" y2="40" stroke="currentColor" strokeWidth="1"/>
                            <line x1="40" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="1"/>
                          </pattern>
                          <rect width="100%" height="100%" fill={`url(#pattern-${id})`} />
                        </svg>
                      </div>
                      {/* Large initials */}
                      <span className="relative text-white font-bold text-8xl z-10">
                        {userName ? getInitials(userName) : "N"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {userName || "User"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {type}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Message and Actions Row */}
            <div className="flex items-start justify-between gap-4 mb-0.5">
              <p className="text-base font-normal text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 leading-tight">
                {message}
              </p>

              {/* Quick Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {unread && onMarkAsRead && (
                  <button
                    onClick={() => onMarkAsRead(id)}
                    className="p-1.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all cursor-pointer"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(id)}
                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Time */}
            <div className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 mb-3">
              {time}
            </div>

            {/* Action Buttons */}
            {actions && actions.length > 0 && (
              <div className="flex gap-2.5">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                      action.variant === "primary"
                        ? "text-white bg-blue-600 hover:bg-blue-700"
                        : "text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
