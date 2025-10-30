"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCheck, Trash2 } from "lucide-react";
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
  const [expandedPosition, setExpandedPosition] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Ensure client-side only rendering for hover effects
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate position to keep expanded avatar within viewport
  const handleMouseEnter = () => {
    if (!isMounted || typeof window === 'undefined') return;

    setIsAvatarHovered(true);
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      const expandedWidth = 224; // 56 * 4 = 224px (w-56)
      const expandedHeight = 224 + 60; // 224px + name card height
      const margin = 16; // ml-4 = 16px

      // Calculate horizontal position (prefer right side)
      let left = rect.right + margin;
      const spaceOnRight = window.innerWidth - rect.right;
      if (spaceOnRight < (expandedWidth + margin + 20)) {
        // Not enough space on right, position to fit within viewport
        left = window.innerWidth - expandedWidth - 20; // 20px padding from edge
      }

      // Calculate vertical position (align with avatar top, but adjust if needed)
      let top = rect.top;
      const bottomMargin = 40; // Margin from bottom edge
      const spaceBelow = window.innerHeight - rect.top;
      if (spaceBelow < expandedHeight + bottomMargin) {
        // Not enough space below, adjust upward with bottom margin
        top = Math.max(20, window.innerHeight - expandedHeight - bottomMargin);
      }

      setExpandedPosition({ top, left });
    }
  };

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
    ? "bg-transparent"
    : "bg-gray-50/50 dark:bg-[#1e2128]/50 midnight:bg-[#141b2e]/50 purple:bg-[#231533]/50";

  // Don't render anything until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <div className={`${bgColor} rounded-xl shadow-sm border border-gray-200 dark:border-gray-800/50 h-24 animate-pulse`}></div>
    );
  }

  return (
    <div
      className={`${bgColor} rounded-xl shadow-sm border ${
        unread
          ? "border-blue-200 dark:border-blue-500/30 midnight:border-cyan-500/30 purple:border-pink-500/30"
          : "border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20"
      } hover:shadow-md transition-all duration-200 group`}
      suppressHydrationWarning
    >
      <div className="p-4" suppressHydrationWarning>
        <div className="flex gap-3" suppressHydrationWarning>
          {/* Avatar */}
          <div
            ref={avatarRef}
            className="flex-shrink-0 relative group/avatar cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsAvatarHovered(false)}
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getNotificationColor(
                type
              )} flex items-center justify-center text-white font-bold text-lg shadow-md relative transition-all overflow-hidden`}
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt={userName || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                userName ? getInitials(userName) : "N"
              )}
              {unread && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-[#252930] z-10"></div>
              )}
            </div>

            {/* Expanded Avatar Preview on Hover */}
            {isMounted && isAvatarHovered && (
              <div
                className="fixed z-[100] pointer-events-none"
                style={{
                  top: `${expandedPosition.top}px`,
                  left: `${expandedPosition.left}px`
                }}
              >
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
          <div className="flex-1 min-w-0" suppressHydrationWarning>
            {/* Message and Actions Row */}
            <div className="flex items-start justify-between gap-4 mb-0.5" suppressHydrationWarning>
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
            {isMounted && actions && actions.length > 0 && (
              <div className="flex gap-2">
                {actions.map((action, index) => (
                  <button
                    key={`${id}-${action.label}-${index}`}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-95 ${
                      action.variant === "primary"
                        ? "text-white bg-blue-600 hover:bg-blue-700 ring-1 ring-blue-600 hover:ring-blue-700"
                        : "text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 ring-1 ring-gray-300 dark:ring-gray-600"
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
