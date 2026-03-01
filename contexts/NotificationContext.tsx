"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ============================================
// TYPES
// ============================================

export type NotificationType =
  | "general"
  | "performance"
  | "appointment"
  | "record"
  | "leave_submitted"
  | "leave_approved"
  | "leave_rejected"
  | "meeting_scheduled"
  | "meeting_cancelled"
  | "payment"
  | "message"
  | "alert"
  | "success"
  | "warning"
  | "info"
  | "document_shared";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  priority: NotificationPriority;
  // Optional fields for specific notification types
  avatar?: string;
  userName?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  // For targeting specific users/roles
  targetUserId?: string;
  targetRole?: "admin" | "parent" | "teacher" | "student" | "all";
}

export interface NotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  avatar?: string;
  userName?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  targetUserId?: string;
  targetRole?: "admin" | "parent" | "teacher" | "student" | "all";
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: NotificationInput) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
  getNotificationsByRole: (role: string) => Notification[];
  getUnreadNotifications: () => Notification[];
}

// ============================================
// CONTEXT
// ============================================

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ============================================
// STORAGE KEY
// ============================================

const STORAGE_KEY = "educo_notifications";

// ============================================
// INITIAL MOCK NOTIFICATIONS
// ============================================

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-001",
    type: "appointment",
    title: "Appointment Added",
    message: "Sylvia added appointment on 02:00 PM",
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 mins ago
    read: false,
    priority: "normal",
    avatar: "https://i.pravatar.cc/300?img=1",
    userName: "Sylvia",
    targetRole: "all",
  },
  {
    id: "notif-002",
    type: "performance",
    title: "Performance Alert",
    message: "Shawn's performance in Math is below the threshold.",
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(), // 6 mins ago
    read: false,
    priority: "high",
    avatar: "https://i.pravatar.cc/300?img=12",
    userName: "Shawn",
    targetRole: "admin",
  },
  {
    id: "notif-003",
    type: "record",
    title: "New Teacher Record",
    message: "A new teacher record for John has been created",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hr ago
    read: true,
    priority: "normal",
    avatar: "https://i.pravatar.cc/300?img=15",
    userName: "John",
    targetRole: "admin",
  },
  {
    id: "notif-004",
    type: "record",
    title: "New Student Record",
    message: "New student record George is created by Teressa",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hrs ago
    read: true,
    priority: "normal",
    avatar: "https://i.pravatar.cc/300?img=33",
    userName: "George",
    targetRole: "admin",
  },
  {
    id: "notif-005",
    type: "general",
    title: "Exam Time Table",
    message: "Exam time table has been added to the system",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hr ago
    read: true,
    priority: "normal",
    avatar: "https://i.pravatar.cc/300?img=51",
    userName: "Admin",
    targetRole: "all",
  },
  {
    id: "notif-006",
    type: "meeting_scheduled",
    title: "Meeting Request",
    message: "James requested a parent-teacher meeting",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hrs ago
    read: false,
    priority: "normal",
    avatar: "https://i.pravatar.cc/300?img=17",
    userName: "James",
    actionUrl: "/admin/meetings",
    targetRole: "admin",
  },
];

// ============================================
// PROVIDER
// ============================================

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
        } else {
          // Use initial mock notifications if nothing stored
          setNotifications(INITIAL_NOTIFICATIONS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        }
      } catch (error) {
        console.error("Error loading notifications from localStorage:", error);
        setNotifications(INITIAL_NOTIFICATIONS);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when notifications change
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  // Generate unique ID
  const generateId = () => `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add notification
  const addNotification = useCallback((input: NotificationInput): string => {
    const id = generateId();
    const newNotification: Notification = {
      id,
      type: input.type,
      title: input.title,
      message: input.message,
      createdAt: new Date().toISOString(),
      read: false,
      priority: input.priority || "normal",
      avatar: input.avatar,
      userName: input.userName,
      actionUrl: input.actionUrl,
      metadata: input.metadata,
      targetUserId: input.targetUserId,
      targetRole: input.targetRole || "all",
    };

    setNotifications((prev) => [newNotification, ...prev]);
    return id;
  }, []);

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get notifications by type
  const getNotificationsByType = useCallback(
    (type: NotificationType) => {
      return notifications.filter((n) => n.type === type);
    },
    [notifications]
  );

  // Get notifications by role
  const getNotificationsByRole = useCallback(
    (role: string) => {
      return notifications.filter((n) => n.targetRole === role || n.targetRole === "all");
    },
    [notifications]
  );

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter((n) => !n.read);
  }, [notifications]);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsByRole,
    getUnreadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function formatTimeAgo(dateString: string): string {
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
}

export function getNotificationTypeConfig(type: NotificationType) {
  const configs: Record<NotificationType, { label: string; color: string; bgColor: string; borderColor: string }> = {
    general: {
      label: "General",
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50/80 dark:bg-gray-500/10",
      borderColor: "border-gray-100/50 dark:border-gray-500/20",
    },
    performance: {
      label: "Performance",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50/80 dark:bg-amber-500/10",
      borderColor: "border-amber-100/50 dark:border-amber-500/20",
    },
    appointment: {
      label: "Appointment",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50/80 dark:bg-purple-500/10",
      borderColor: "border-purple-100/50 dark:border-purple-500/20",
    },
    record: {
      label: "Record",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50/80 dark:bg-blue-500/10",
      borderColor: "border-blue-100/50 dark:border-blue-500/20",
    },
    leave_submitted: {
      label: "Leave Request",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50/80 dark:bg-cyan-500/10",
      borderColor: "border-cyan-100/50 dark:border-cyan-500/20",
    },
    leave_approved: {
      label: "Leave Approved",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50/80 dark:bg-emerald-500/10",
      borderColor: "border-emerald-100/50 dark:border-emerald-500/20",
    },
    leave_rejected: {
      label: "Leave Rejected",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50/80 dark:bg-rose-500/10",
      borderColor: "border-rose-100/50 dark:border-rose-500/20",
    },
    meeting_scheduled: {
      label: "Meeting",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50/80 dark:bg-indigo-500/10",
      borderColor: "border-indigo-100/50 dark:border-indigo-500/20",
    },
    meeting_cancelled: {
      label: "Meeting Cancelled",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50/80 dark:bg-rose-500/10",
      borderColor: "border-rose-100/50 dark:border-rose-500/20",
    },
    payment: {
      label: "Payment",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50/80 dark:bg-green-500/10",
      borderColor: "border-green-100/50 dark:border-green-500/20",
    },
    message: {
      label: "Message",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50/80 dark:bg-blue-500/10",
      borderColor: "border-blue-100/50 dark:border-blue-500/20",
    },
    alert: {
      label: "Alert",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50/80 dark:bg-red-500/10",
      borderColor: "border-red-100/50 dark:border-red-500/20",
    },
    success: {
      label: "Success",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50/80 dark:bg-emerald-500/10",
      borderColor: "border-emerald-100/50 dark:border-emerald-500/20",
    },
    warning: {
      label: "Warning",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50/80 dark:bg-amber-500/10",
      borderColor: "border-amber-100/50 dark:border-amber-500/20",
    },
    info: {
      label: "Info",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50/80 dark:bg-blue-500/10",
      borderColor: "border-blue-100/50 dark:border-blue-500/20",
    },
  };

  return configs[type] || configs.general;
}
