"use client";

import { useState } from "react";
import { Trash2, CheckCheck } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import NotificationCard from "@/components/notifications/NotificationCard";

interface Notification {
  id: string;
  type: "performance" | "appointment" | "record" | "general";
  title: string;
  message: string;
  fullMessage?: string;
  time: string;
  avatar?: string;
  userName?: string;
  unread: boolean;
  actions?: { label: string; variant?: "primary" | "secondary" }[];
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "appointment",
    title: "Appointment Added",
    message: "added appointment on 02:00 PM",
    fullMessage: "Sylvia added appointment on 02:00 PM",
    time: "4 mins ago",
    avatar: "https://i.pravatar.cc/300?img=1",
    userName: "Sylvia",
    unread: true,
    actions: [
      { label: "Decline", variant: "secondary" },
      { label: "Accept", variant: "primary" },
    ],
  },
  {
    id: "2",
    type: "performance",
    title: "Performance Alert",
    message: "performance in Math is below the threshold.",
    fullMessage: "Shawn performance in Math is below the threshold.",
    time: "6 mins ago",
    avatar: "https://i.pravatar.cc/300?img=12",
    userName: "Shawn",
    unread: true,
  },
  {
    id: "3",
    type: "record",
    title: "New Teacher Record",
    message: "A new teacher record for John",
    fullMessage: "A new teacher record for John has been created",
    time: "09:45 am",
    avatar: "https://i.pravatar.cc/300?img=15",
    userName: "John",
    unread: false,
  },
  {
    id: "4",
    type: "record",
    title: "New Student Record",
    message: "is created by Teressa",
    fullMessage: "New student record George is created by Teressa",
    time: "2 hrs ago",
    avatar: "https://i.pravatar.cc/300?img=33",
    userName: "George",
    unread: false,
  },
  {
    id: "5",
    type: "record",
    title: "New Staff Record",
    message: "New staff record is created",
    fullMessage: "New staff record is created",
    time: "10 mins ago",
    avatar: "https://i.pravatar.cc/300?img=68",
    userName: "Staff",
    unread: false,
  },
  {
    id: "6",
    type: "general",
    title: "Exam Time Table",
    message: "Exam time table added",
    fullMessage: "Exam time table has been added to the system",
    time: "1 hr ago",
    avatar: "https://i.pravatar.cc/300?img=51",
    userName: "Admin",
    unread: false,
  },
  {
    id: "7",
    type: "performance",
    title: "Grade Updated",
    message: "received an A in Physics",
    fullMessage: "Emma received an A in Physics",
    time: "3 hrs ago",
    avatar: "https://i.pravatar.cc/300?img=5",
    userName: "Emma",
    unread: false,
  },
  {
    id: "8",
    type: "appointment",
    title: "Meeting Request",
    message: "requested a parent-teacher meeting",
    fullMessage: "James requested a parent-teacher meeting",
    time: "5 hrs ago",
    avatar: "https://i.pravatar.cc/300?img=17",
    userName: "James",
    unread: true,
    actions: [
      { label: "Decline", variant: "secondary" },
      { label: "Accept", variant: "primary" },
    ],
  },
];

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notificationList.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotificationList((prev) =>
      prev.map((notification) => ({ ...notification, unread: false }))
    );
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      setNotificationList([]);
    }
  };

  const handleDelete = (id: string) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const filteredNotifications =
    filter === "unread"
      ? notificationList.filter((n) => n.unread)
      : notificationList;

  return (
    <MainLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
            Notifications
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
            You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
          </p>
        </div>

        {/* Filter Tabs & Actions */}
        <div className="bg-white dark:bg-[#252930] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                All ({notificationList.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  filter === "unread"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={notificationList.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete all
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List Container */}
        <div className="bg-white dark:bg-[#252930] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <CheckCheck className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
                  No notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                  {filter === "unread"
                    ? "You don't have any unread notifications"
                    : "You're all caught up!"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <NotificationCard
                  key={notification.id}
                  id={notification.id}
                  type={notification.type}
                  message={notification.fullMessage || notification.message}
                  time={notification.time}
                  avatar={notification.avatar}
                  userName={notification.userName}
                  unread={notification.unread}
                  actions={notification.actions}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  isOdd={index % 2 === 0}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
