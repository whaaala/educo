"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Bell,
  Clock,
  X,
  CheckCheck,
  ChevronRight,
  FileText,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  AlertTriangle,
  CreditCard,
  MessageSquare,
  Info,
} from "lucide-react";
import { useNotifications, formatTimeAgo, Notification, NotificationType } from "@/contexts/NotificationContext";

export default function NotificationDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // Show only the first 6 notifications in dropdown
  const displayNotifications = notifications.slice(0, 6);

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (isOpen && buttonRef.current && typeof window !== "undefined") {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: `${rect.bottom + 8}px`,
        right: `${window.innerWidth - rect.right}px`,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideButton = menuRef.current && !menuRef.current.contains(target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);

      // Only close if click is outside both the button and the dropdown
      if (isOutsideButton && isOutsideDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleViewAll = () => {
    setIsOpen(false);
    router.push("/notifications");
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      setIsOpen(false);
      router.push(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    const icons: Record<NotificationType, typeof Bell> = {
      general: Bell,
      performance: AlertTriangle,
      appointment: Calendar,
      record: Users,
      leave_submitted: FileText,
      leave_approved: CheckCircle2,
      leave_rejected: XCircle,
      meeting_scheduled: Calendar,
      meeting_cancelled: XCircle,
      payment: CreditCard,
      message: MessageSquare,
      alert: AlertTriangle,
      success: CheckCircle2,
      warning: AlertTriangle,
      info: Info,
    };
    return icons[type] || Bell;
  };

  const getNotificationColors = (type: NotificationType) => {
    const colors: Record<NotificationType, { bg: string; text: string; gradient: string }> = {
      general: { bg: "bg-gray-100 dark:bg-gray-700/50", text: "text-gray-600 dark:text-gray-400", gradient: "from-gray-500 to-gray-600" },
      performance: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", gradient: "from-amber-500 to-orange-500" },
      appointment: { bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", gradient: "from-purple-500 to-pink-500" },
      record: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", gradient: "from-blue-500 to-indigo-500" },
      leave_submitted: { bg: "bg-cyan-50 dark:bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", gradient: "from-cyan-500 to-blue-500" },
      leave_approved: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", gradient: "from-emerald-500 to-green-500" },
      leave_rejected: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", gradient: "from-rose-500 to-red-500" },
      meeting_scheduled: { bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", gradient: "from-indigo-500 to-purple-500" },
      meeting_cancelled: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", gradient: "from-rose-500 to-red-500" },
      payment: { bg: "bg-green-50 dark:bg-green-500/10", text: "text-green-600 dark:text-green-400", gradient: "from-green-500 to-emerald-500" },
      message: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", gradient: "from-blue-500 to-cyan-500" },
      alert: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400", gradient: "from-red-500 to-rose-500" },
      success: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", gradient: "from-emerald-500 to-green-500" },
      warning: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", gradient: "from-amber-500 to-yellow-500" },
      info: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", gradient: "from-blue-500 to-indigo-500" },
      document_shared: { bg: "bg-sky-50 dark:bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", gradient: "from-sky-500 to-blue-500" },
    };
    return colors[type] || colors.general;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 cursor-pointer group"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
        {/* Notification Badge with Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-bold rounded-full ring-2 ring-white dark:ring-gray-900 shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu - Rendered via Portal */}
      {typeof window !== "undefined" &&
        isOpen &&
        createPortal(
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-[100] bg-black/20"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <div
              ref={dropdownRef}
              style={dropdownStyle}
              className="w-[380px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/50 z-[9999] transition-colors duration-300 overflow-hidden flex flex-col"
              role="menu"
              aria-orientation="vertical"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Notifications
                      </h3>
                      <p className="text-xs text-white/70">
                        {unreadCount > 0
                          ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                          : "All caught up!"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Mark All as Read */}
              {unreadCount > 0 && (
                <div className="px-5 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all as read
                  </button>
                </div>
              )}

              {/* Notifications List */}
              <div className="max-h-[360px] overflow-y-auto">
                {displayNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      No notifications
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      You&apos;re all caught up!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100/80 dark:divide-gray-700/30">
                    {displayNotifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      const colors = getNotificationColors(notification.type);

                      return (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full text-left p-4 transition-all duration-200 cursor-pointer group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 ${
                            !notification.read
                              ? "bg-gradient-to-r from-blue-50/50 via-transparent to-transparent dark:from-blue-500/5 dark:via-transparent"
                              : ""
                          }`}
                        >
                          {/* Unread indicator line */}
                          {!notification.read && (
                            <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                          )}

                          <div className="flex items-start gap-3 relative">
                            {/* Avatar / Icon */}
                            <div className="flex-shrink-0 relative">
                              {notification.avatar ? (
                                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-2 ring-white/80 dark:ring-gray-700/50">
                                  <Image
                                    src={notification.avatar}
                                    alt={notification.userName || "User"}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ) : (
                                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shadow-sm`}>
                                  <Icon className={`w-4 h-4 ${colors.text}`} />
                                </div>
                              )}
                              {/* Unread dot */}
                              {!notification.read && (
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  {notification.userName && (
                                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                      {notification.userName}{" "}
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {notification.message}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeAgo(notification.createdAt)}</span>
                              </div>
                            </div>

                            {/* Arrow */}
                            {notification.actionUrl && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAll();
                    }}
                    className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
