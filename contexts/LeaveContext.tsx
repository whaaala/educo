"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LeaveRequest, CreateLeaveRequest } from "@/types/leave";

interface LeaveContextType {
  requests: LeaveRequest[];
  addLeaveRequest: (staffData: {
    staffId: string;
    staffName: string;
    staffEmail: string;
    staffDepartment: string;
    staffPosition: string;
  }, leaveData: CreateLeaveRequest) => void;
  updateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => void;
  getStaffLeaves: (staffId: string) => LeaveRequest[];
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

const STORAGE_KEY = "educo_leave_requests";
const VERSION_KEY = "educo_leave_requests_version";
const CURRENT_VERSION = "1"; // Increment this to force clear old data

export function LeaveProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load requests from localStorage on mount
  useEffect(() => {
    try {
      const version = localStorage.getItem(VERSION_KEY);

      // Clear old data if version mismatch
      if (version !== CURRENT_VERSION) {
        console.log("LeaveContext: Version mismatch, clearing old data");
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        setRequests([]);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log("LeaveContext: Loaded requests from localStorage", parsed);
          setRequests(parsed);
        }
      }
    } catch (error) {
      console.error("LeaveContext: Error loading from localStorage", error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsHydrated(true);
  }, []);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
        console.log("LeaveContext: Saved requests to localStorage", requests);
      } catch (error) {
        console.error("LeaveContext: Error saving to localStorage", error);
      }
    }
  }, [requests, isHydrated]);

  const addLeaveRequest = (
    staffData: {
      staffId: string;
      staffName: string;
      staffEmail: string;
      staffDepartment: string;
      staffPosition: string;
    },
    leaveData: CreateLeaveRequest
  ) => {
    // Generate unique ID using timestamp and random number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const uniqueId = `LR${timestamp}${random}`;

    // Calculate number of days
    const start = new Date(leaveData.startDate);
    const end = new Date(leaveData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

    const newRequest: LeaveRequest = {
      id: uniqueId,
      staffId: staffData.staffId,
      staffName: staffData.staffName,
      staffEmail: staffData.staffEmail,
      staffDepartment: staffData.staffDepartment,
      staffPosition: staffData.staffPosition,
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      numberOfDays,
      reason: leaveData.reason,
      requestedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      priority: leaveData.priority || "normal",
      notes: leaveData.notes,
      managerId: "manager-001", // In production, get from staff data
      managerName: "Dr. Adeyemi (Principal)", // In production, get from staff data
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("LeaveContext: Creating new request", newRequest);
    setRequests(prev => {
      const updated = [newRequest, ...prev];
      console.log("LeaveContext: Updated requests array", updated);
      return updated;
    });
  };

  const updateLeaveRequest = (id: string, updates: Partial<LeaveRequest>) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, ...updates, updatedAt: new Date().toISOString() }
          : req
      )
    );
  };

  const getStaffLeaves = (staffId: string) => {
    return requests.filter(req => req.staffId === staffId);
  };

  return (
    <LeaveContext.Provider value={{ requests, addLeaveRequest, updateLeaveRequest, getStaffLeaves }}>
      {children}
    </LeaveContext.Provider>
  );
}

export function useLeaves() {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error("useLeaves must be used within a LeaveProvider");
  }
  return context;
}
