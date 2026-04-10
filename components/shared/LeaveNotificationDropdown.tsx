"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  X,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";
import { useChildLeaves, LeaveNotification } from "@/contexts/ChildLeaveContext";

interface LeaveNotificationDropdownProps {
  parentId?: string;
  isAdmin?: boolean;
}

export default function LeaveNotificationDropdown({
  parentId,
  isAdmin = false,
}: LeaveNotificationDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    notifications,
    getUnreadNotifications,
    markNotificationAsRead,
    clearNotifications,
    getLeaveById,
  } = useChildLeaves();

  // Get relevant notifications based on role
  const relevantNotifications = parentId
    ? isAdmin
      ? notifications.filter((n) => n.type === "leave_submitted") // Admin sees new leave submissions
      : notifications.filter((n) => n.parentId === parentId && n.type !== "leave_submitted") // Parent sees approval/rejection
    : notifications;

  const unreadNotifications = relevantNotifications.filter((n) => !n.read);
  const unreadCount = unreadNotifications.length;

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
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const markAllAsRead = () => {
    if (parentId) {
      clearNotifications(parentId);
    } else {
      relevantNotifications.forEach((n) => markNotificationAsRead(n.id));
    }
  };

  const handleNotificationClick = (notification: LeaveNotification) => {
    markNotificationAsRead(notification.id);
    setIsOpen(false);

    // Navigate based on notification type and role
    if (isAdmin) {
      // Navigate to parent profile or leaves page
      const leave = getLeaveById(notification.leaveId);
      if (leave) {
        router.push(`/admin/parents/${leave.parentId}`);
      }
    } else {
      // Navigate to parent leaves page
      router.push("/parents/leaves");
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const getNotificationIcon = (type: LeaveNotification["type"]) => {
    switch (type) {
      case "leave_submitted":
        return FileText;
      case "leave_approved":
        return CheckCircle2;
      case "leave_rejected":
        return XCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: LeaveNotification["type"]) => {
    switch (type) {
      case "leave_submitted":
        return {
          icon: "text-blue-500",
          bg: "bg-blue-50 dark:bg-blue-500/10",
          gradient: "from-blue-500 to-cyan-500",
        };
      case "leave_approved":
        return {
          icon: "text-emerald-500",
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          gradient: "from-emerald-500 to-green-500",
        };
      case "leave_rejected":
        return {
          icon: "text-rose-500",
          bg: "bg-rose-50 dark:bg-rose-500/10",
          gradient: "from-rose-500 to-red-500",
        };
      default:
        return {
          icon: "text-gray-500",
          bg: "bg-gray-50 dark:bg-gray-500/10",
          gradient: "from-gray-500 to-gray-600",
        };
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 rounded-xl transition-all duration-200 cursor-pointer group"
        aria-label="Leave Notifications"
        aria-expanded={isOpen}
      >
        <CalendarCheck className="w-5 h-5 text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 group-hover:scale-110 transition-transform" />
        {/* Notification Badge with Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-[10px] font-bold rounded-full ring-2 ring-white dark:ring-gray-900 shadow-lg">
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
              style={dropdownStyle}
              className="w-[380px] bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/50 z-[9999] transition-colors duration-300 overflow-hidden flex flex-col"
              role="menu"
              aria-orientation="vertical"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-cyan-500 to-blue-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20">
                      <CalendarCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Leave Notifications
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
                <div className="px-5 py-2.5 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 bg-gray-50/50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
              )}

              {/* Notifications List */}
              <div className="max-h-[360px] overflow-y-auto">
                {relevantNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex items-center justify-center mb-4">
                      <CalendarCheck className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                      No leave notifications
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-1 text-center">
                      {isAdmin
                        ? "New leave requests will appear here"
                        : "Updates on your leave requests will appear here"}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 space-y-2">
                    {relevantNotifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      const colors = getNotificationColor(notification.type);

                      return (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                            notification.read
                              ? "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/30 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
                              : `${colors.bg} border-transparent hover:shadow-md`
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div
                              className={`p-2 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg flex-shrink-0`}
                            >
                              <Icon className="w-4 h-4 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 line-clamp-2 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeAgo(notification.createdAt)}</span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {relevantNotifications.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 bg-gray-50/50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push(isAdmin ? "/admin/leaves" : "/parents/leaves");
                    }}
                    className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    View All Leave Requests
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
