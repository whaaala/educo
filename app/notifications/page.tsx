"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Trash2, CheckCheck, Bell, Filter } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageLoader from "@/components/shared/PageLoader";
import NotificationCard from "@/components/notifications/NotificationCard";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useNotifications, formatTimeAgo, NotificationType } from "@/contexts/NotificationContext";
import { useUser } from "@/contexts/UserContext";

type FilterType = "all" | "unread" | NotificationType;

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "performance", label: "Performance" },
  { value: "appointment", label: "Appointments" },
  { value: "record", label: "Records" },
  { value: "leave_submitted", label: "Leave Requests" },
  { value: "meeting_scheduled", label: "Meetings" },
  { value: "payment", label: "Payments" },
  { value: "message", label: "Messages" },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [isMounted, setIsMounted] = useState(false);
  const isLoading = usePageLoad(600);

  const { isParent, isAnyAdmin } = useUser();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter notifications based on selected filter and user role
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filter by role (admin sees admin notifications, parent sees parent notifications)
    if (isParent) {
      filtered = filtered.filter(
        (n) => n.targetRole === "parent" || n.targetRole === "all"
      );
    } else if (isAnyAdmin) {
      filtered = filtered.filter(
        (n) => n.targetRole === "admin" || n.targetRole === "all"
      );
    }

    // Apply type/status filter
    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter !== "all") {
      filtered = filtered.filter((n) => n.type === filter);
    }

    return filtered;
  }, [notifications, filter, isParent, isAnyAdmin]);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const handleNotificationClick = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification) {
      markAsRead(id);
      if (notification.actionUrl) {
        router.push(notification.actionUrl);
      }
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      clearAllNotifications();
    }
  };

  if (!isMounted) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Loading Screen */}
      <PageLoader isLoading={isLoading} loadingText="Loading Notifications" />

      {/* Main Content - Fades in after loading */}
      <div className={`transition-opacity duration-500 space-y-6 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 midnight:bg-gray-900/80 purple:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-700/30 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20">
                <Bell className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mt-0.5">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                    : "All caught up!"}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-blue-50/80 dark:bg-blue-500/10 border border-blue-100/50 dark:border-blue-500/20">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {notifications.length} Total
                </span>
              </div>
              {unreadCount > 0 && (
                <div className="px-4 py-2 rounded-xl bg-red-50/80 dark:bg-red-500/10 border border-red-100/50 dark:border-red-500/20">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    {unreadCount} Unread
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs & Actions */}
        <div className="bg-white/80 dark:bg-gray-800/80 midnight:bg-gray-900/80 purple:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-700/30 shadow-sm p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 mr-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Filter:</span>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 dark:bg-gray-900/50 rounded-xl flex-wrap">
                {FILTER_OPTIONS.slice(0, 4).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      filter === option.value
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {option.label}
                    {option.value === "unread" && unreadCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {/* More filters dropdown could go here */}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50/80 dark:hover:bg-blue-500/10 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={notifications.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white/80 dark:bg-gray-800/80 midnight:bg-gray-900/80 purple:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-700/30 shadow-sm overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
                {filter === "unread" ? "No unread notifications" : "No notifications"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 max-w-xs mx-auto">
                {filter === "unread"
                  ? "You've read all your notifications"
                  : filter !== "all"
                    ? `No ${FILTER_OPTIONS.find(o => o.value === filter)?.label.toLowerCase() || ''} notifications`
                    : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100/80 dark:divide-gray-700/30">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  id={notification.id}
                  type={notification.type}
                  message={notification.message}
                  time={formatTimeAgo(notification.createdAt)}
                  avatar={notification.avatar}
                  userName={notification.userName}
                  unread={!notification.read}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  onClick={notification.actionUrl ? () => handleNotificationClick(notification.id) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
