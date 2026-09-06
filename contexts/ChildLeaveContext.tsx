"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// ============================================
// TYPES
// ============================================

export type ChildLeaveType = "Medical" | "Family" | "Personal" | "Religious" | "Sports" | "Other" | "sick" | "family_emergency" | "vacation" | "religious" | "other";
export type ChildLeaveStatus = "pending" | "approved" | "rejected" | "declined";

export interface ChildLeaveRequest {
  id: string;
  parentId: string;
  childId: string;
  childName: string;
  childClass: string;
  childPhoto?: string;
  leaveType: ChildLeaveType;
  startDate: string;
  endDate: string;
  fromDate?: string;
  toDate?: string;
  days: number;
  reason: string;
  status: ChildLeaveStatus;
  requestedAt: string;
  appliedDate?: string;
  processedAt?: string;
  processedBy?: string;
  approvedBy?: string;
  approvedDate?: string;
  adminNotes?: string;
  remarks?: string;
  documents?: string[];
}

export interface LeaveNotification {
  id: string;
  type: "leave_submitted" | "leave_approved" | "leave_rejected";
  leaveId: string;
  parentId: string;
  childName: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface ChildLeaveContextType {
  // Leave requests
  leaveRequests: ChildLeaveRequest[];

  // Actions
  addLeaveRequest: (leave: Omit<ChildLeaveRequest, "id" | "status" | "requestedAt">) => ChildLeaveRequest;
  approveLeaveRequest: (leaveId: string, processedBy: string, notes?: string) => void;
  rejectLeaveRequest: (leaveId: string, processedBy: string, reason: string) => void;

  // Queries
  getLeavesByParentId: (parentId: string) => ChildLeaveRequest[];
  getLeavesByChildId: (childId: string) => ChildLeaveRequest[];
  getPendingLeaves: () => ChildLeaveRequest[];
  getLeaveById: (leaveId: string) => ChildLeaveRequest | undefined;

  // Notifications
  notifications: LeaveNotification[];
  getUnreadNotifications: (parentId: string) => LeaveNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: (parentId: string) => void;

  // State
  isInitialized: boolean;
}

const ChildLeaveContext = createContext<ChildLeaveContextType | undefined>(undefined);

const STORAGE_KEY = "educo_child_leave_requests";
const NOTIFICATIONS_KEY = "educo_leave_notifications";
const DATA_VERSION = "1.0";

export function ChildLeaveProvider({ children }: { children: ReactNode }) {
  const [leaveRequests, setLeaveRequests] = useState<ChildLeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<LeaveNotification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        // Load leave requests
        const savedLeaves = localStorage.getItem(STORAGE_KEY);
        if (savedLeaves) {
          const parsed = JSON.parse(savedLeaves);
          if (parsed.version === DATA_VERSION && Array.isArray(parsed.data)) {
            setLeaveRequests(parsed.data);
          }
        }

        // Load notifications
        const savedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
        if (savedNotifications) {
          const parsed = JSON.parse(savedNotifications);
          if (parsed.version === DATA_VERSION && Array.isArray(parsed.data)) {
            setNotifications(parsed.data);
          }
        }
      } catch (error) {
        console.error("Failed to load child leave data:", error);
      }
      setIsInitialized(true);
    };

    loadData();
  }, []);

  // Save leave requests to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          version: DATA_VERSION,
          data: leaveRequests,
        }));
      } catch (error) {
        console.error("Failed to save child leave requests:", error);
      }
    }
  }, [leaveRequests, isInitialized]);

  // Save notifications to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify({
          version: DATA_VERSION,
          data: notifications,
        }));
      } catch (error) {
        console.error("Failed to save leave notifications:", error);
      }
    }
  }, [notifications, isInitialized]);

  // Add a new leave request
  const addLeaveRequest = useCallback((leave: Omit<ChildLeaveRequest, "id" | "status" | "requestedAt">): ChildLeaveRequest => {
    const newLeave: ChildLeaveRequest = {
      ...leave,
      id: `leave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      requestedAt: new Date().toISOString(),
      appliedDate: new Date().toISOString(),
    };

    setLeaveRequests(prev => [newLeave, ...prev]);

    // Create notification for admin (we'll use a generic admin notification)
    const notification: LeaveNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "leave_submitted",
      leaveId: newLeave.id,
      parentId: leave.parentId,
      childName: leave.childName,
      title: "New Leave Request",
      message: `Leave request submitted for ${leave.childName} (${leave.leaveType}) - ${leave.days} day(s)`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);

    return newLeave;
  }, []);

  // Approve a leave request
  const approveLeaveRequest = useCallback((leaveId: string, processedBy: string, notes?: string) => {
    setLeaveRequests(prev => prev.map(leave => {
      if (leave.id === leaveId) {
        const updatedLeave = {
          ...leave,
          status: "approved" as const,
          processedAt: new Date().toISOString(),
          processedBy,
          approvedBy: processedBy,
          approvedDate: new Date().toISOString(),
          adminNotes: notes,
        };

        // Create notification for parent
        const notification: LeaveNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "leave_approved",
          leaveId,
          parentId: leave.parentId,
          childName: leave.childName,
          title: "Leave Request Approved",
          message: `Your leave request for ${leave.childName} has been approved by ${processedBy}`,
          createdAt: new Date().toISOString(),
          read: false,
        };

        setNotifications(prev => [notification, ...prev]);

        return updatedLeave;
      }
      return leave;
    }));
  }, []);

  // Reject a leave request
  const rejectLeaveRequest = useCallback((leaveId: string, processedBy: string, reason: string) => {
    setLeaveRequests(prev => prev.map(leave => {
      if (leave.id === leaveId) {
        const updatedLeave = {
          ...leave,
          status: "rejected" as const,
          processedAt: new Date().toISOString(),
          processedBy,
          approvedBy: processedBy,
          approvedDate: new Date().toISOString(),
          adminNotes: reason,
          remarks: reason,
        };

        // Create notification for parent
        const notification: LeaveNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "leave_rejected",
          leaveId,
          parentId: leave.parentId,
          childName: leave.childName,
          title: "Leave Request Rejected",
          message: `Your leave request for ${leave.childName} has been rejected. Reason: ${reason}`,
          createdAt: new Date().toISOString(),
          read: false,
        };

        setNotifications(prev => [notification, ...prev]);

        return updatedLeave;
      }
      return leave;
    }));
  }, []);

  // Get leaves by parent ID
  const getLeavesByParentId = useCallback((parentId: string): ChildLeaveRequest[] => {
    return leaveRequests.filter(leave => leave.parentId === parentId);
  }, [leaveRequests]);

  // Get leaves by child ID
  const getLeavesByChildId = useCallback((childId: string): ChildLeaveRequest[] => {
    return leaveRequests.filter(leave => leave.childId === childId);
  }, [leaveRequests]);

  // Get all pending leaves
  const getPendingLeaves = useCallback((): ChildLeaveRequest[] => {
    return leaveRequests.filter(leave => leave.status === "pending");
  }, [leaveRequests]);

  // Get leave by ID
  const getLeaveById = useCallback((leaveId: string): ChildLeaveRequest | undefined => {
    return leaveRequests.find(leave => leave.id === leaveId);
  }, [leaveRequests]);

  // Get unread notifications for a parent
  const getUnreadNotifications = useCallback((parentId: string): LeaveNotification[] => {
    return notifications.filter(n => n.parentId === parentId && !n.read);
  }, [notifications]);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, []);

  // Clear all notifications for a parent
  const clearNotifications = useCallback((parentId: string) => {
    setNotifications(prev => prev.map(n =>
      n.parentId === parentId ? { ...n, read: true } : n
    ));
  }, []);

  return (
    <ChildLeaveContext.Provider
      value={{
        leaveRequests,
        addLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        getLeavesByParentId,
        getLeavesByChildId,
        getPendingLeaves,
        getLeaveById,
        notifications,
        getUnreadNotifications,
        markNotificationAsRead,
        clearNotifications,
        isInitialized,
      }}
    >
      {children}
    </ChildLeaveContext.Provider>
  );
}

export function useChildLeaves() {
  const context = useContext(ChildLeaveContext);
  if (context === undefined) {
    throw new Error("useChildLeaves must be used within a ChildLeaveProvider");
  }
  return context;
}
