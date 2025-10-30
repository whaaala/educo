"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Bell, Clock } from "lucide-react";

interface Notification {
  id: string;
  type: "performance" | "appointment" | "record" | "general";
  title: string;
  message: string;
  time: string;
  avatar?: string;
  userName?: string;
  unread: boolean;
  actions?: { label: string; variant?: "primary" | "secondary" }[];
}

interface NotificationDropdownProps {
  notifications?: Notification[];
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    type: "performance",
    title: "Performance Alert",
    message: "performance in Math is below the threshold.",
    time: "Just Now",
    avatar: "https://i.pravatar.cc/300?img=12",
    userName: "Shawn",
    unread: true,
  },
  {
    id: "2",
    type: "appointment",
    title: "Appointment Added",
    message: "added appointment on 02:00 PM",
    time: "10 mins ago",
    avatar: "https://i.pravatar.cc/300?img=1",
    userName: "Sylvia",
    unread: true,
    actions: [
      { label: "Deny", variant: "secondary" },
      { label: "Approve", variant: "primary" },
    ],
  },
  {
    id: "3",
    type: "record",
    title: "New Student Record",
    message: "is created by Teressa",
    time: "2 hrs ago",
    avatar: "https://i.pravatar.cc/300?img=33",
    userName: "George",
    unread: false,
  },
  {
    id: "4",
    type: "performance",
    title: "Grade Updated",
    message: "received an A in Physics",
    time: "3 hrs ago",
    avatar: "https://i.pravatar.cc/300?img=5",
    userName: "Emma",
    unread: false,
  },
  {
    id: "5",
    type: "appointment",
    title: "Meeting Request",
    message: "requested a parent-teacher meeting",
    time: "5 hrs ago",
    avatar: "https://i.pravatar.cc/300?img=17",
    userName: "James",
    unread: true,
    actions: [
      { label: "Deny", variant: "secondary" },
      { label: "Approve", variant: "primary" },
    ],
  },
  {
    id: "6",
    type: "record",
    title: "Attendance Updated",
    message: "marked absent for today",
    time: "6 hrs ago",
    avatar: "https://i.pravatar.cc/300?img=10",
    userName: "Olivia",
    unread: false,
  },
  {
    id: "7",
    type: "performance",
    title: "Assignment Submitted",
    message: "submitted Chemistry assignment late",
    time: "1 day ago",
    avatar: "https://i.pravatar.cc/300?img=19",
    userName: "Liam",
    unread: false,
  },
  {
    id: "8",
    type: "appointment",
    title: "Event Reminder",
    message: "scheduled Sports Day event tomorrow",
    time: "1 day ago",
    avatar: "https://i.pravatar.cc/300?img=9",
    userName: "Sophia",
    unread: false,
  },
];

export default function NotificationDropdown({
  notifications = defaultNotifications,
}: NotificationDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

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
    console.log("Mark all as read");
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push("/notifications");
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

  return (
    <div className="relative" ref={menuRef}>
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2d3139] midnight:hover:bg-blue-900/20 purple:hover:bg-purple-900/20 rounded-lg transition-all duration-200 cursor-pointer group"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 group-hover:scale-110 transition-transform" />
        {/* Notification Badge with Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white dark:ring-[#1a1d23] midnight:ring-[#0f1729] purple:ring-[#2a1a3e] shadow-lg">
            {unreadCount}
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
              className="w-[370px] bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 z-[9999] transition-colors duration-300 overflow-hidden flex flex-col"
              role="menu"
              aria-orientation="vertical"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Notifications ({unreadCount})
                  </h3>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                  You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              </div>

              {/* Notifications Grid - Shows 3 items at a time with scrolling */}
              <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No notifications</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You&apos;re all caught up!</p>
                  </div>
                ) : (
                  notifications.map((notification, index) => {
                    // Odd/Even coloring - odd items get colored, even items stay neutral
                    const isOdd = index % 2 === 0;
                    const bgColor = isOdd
                      ? notification.type === 'performance'
                        ? 'from-blue-50 to-blue-100/50 dark:from-blue-500/10 dark:to-blue-500/5 midnight:from-blue-500/20 midnight:to-blue-500/10 purple:from-blue-500/15 purple:to-blue-500/5'
                        : notification.type === 'appointment'
                        ? 'from-purple-50 to-purple-100/50 dark:from-purple-500/10 dark:to-purple-500/5 midnight:from-purple-500/20 midnight:to-purple-500/10 purple:from-pink-500/15 purple:to-pink-500/5'
                        : 'from-indigo-50 to-indigo-100/50 dark:from-indigo-500/10 dark:to-indigo-500/5 midnight:from-indigo-500/20 midnight:to-indigo-500/10 purple:from-indigo-500/15 purple:to-indigo-500/5'
                      : 'from-gray-50 to-gray-50 dark:from-gray-800/30 dark:to-gray-800/30 midnight:from-gray-700/20 midnight:to-gray-700/20 purple:from-gray-700/20 purple:to-gray-700/20';

                    return (
                      <div
                        key={notification.id}
                        className={`relative p-4 rounded-xl bg-gradient-to-br ${bgColor} border border-gray-200/50 dark:border-gray-700/30 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:shadow-md transition-all duration-200 cursor-pointer group`}
                      >
                        <div className="flex gap-3">
                          {/* Avatar with colored background */}
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center text-white font-bold text-sm shadow-lg relative`}>
                              {notification.userName ? getInitials(notification.userName) : "N"}
                              {/* Unread indicator */}
                              {notification.unread && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1d23]"></div>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 mb-1.5">
                              <span className="font-bold">{notification.userName}</span>{" "}
                              <span className="font-normal text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
                                {notification.message}
                              </span>
                            </p>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="font-medium">{notification.time}</span>
                            </div>

                            {/* Action Buttons */}
                            {notification.actions && (
                              <div className="flex gap-2 mt-3">
                                <button className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                  Deny
                                </button>
                                <button className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                  Approve
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-2.5 p-4 border-t border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-white dark:bg-[#252930] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] border-2 border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2d3139] midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
                >
                  Close
                </button>
                <button
                  onClick={handleViewAll}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  View All
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
