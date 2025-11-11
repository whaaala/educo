"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TransferRequest } from "@/types/transfer";
import { TransferFormData } from "@/components/shared/TransferModal";

interface TransferContextType {
  requests: TransferRequest[];
  addTransferRequest: (studentData: {
    studentId: string;
    studentName: string;
    studentAdmissionNumber: string;
    studentClass: string;
    studentSection: string;
  }, transferData: TransferFormData) => void;
  updateTransferRequest: (id: string, updates: Partial<TransferRequest>) => void;
  getStudentTransfers: (studentId: string) => TransferRequest[];
}

const TransferContext = createContext<TransferContextType | undefined>(undefined);

const STORAGE_KEY = "educo_transfer_requests";
const VERSION_KEY = "educo_transfer_requests_version";
const CURRENT_VERSION = "2"; // Increment this to force clear old data

export function TransferProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load requests from localStorage on mount
  useEffect(() => {
    try {
      const version = localStorage.getItem(VERSION_KEY);

      // Clear old data if version mismatch
      if (version !== CURRENT_VERSION) {
        console.log("TransferContext: Version mismatch, clearing old data");
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        setRequests([]);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log("TransferContext: Loaded requests from localStorage", parsed);
          setRequests(parsed);
        }
      }
    } catch (error) {
      console.error("TransferContext: Error loading from localStorage", error);
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
        console.log("TransferContext: Saved requests to localStorage", requests);
      } catch (error) {
        console.error("TransferContext: Error saving to localStorage", error);
      }
    }
  }, [requests, isHydrated]);

  const addTransferRequest = (
    studentData: {
      studentId: string;
      studentName: string;
      studentAdmissionNumber: string;
      studentClass: string;
      studentSection: string;
    },
    transferData: TransferFormData
  ) => {
    // Generate unique ID using timestamp and random number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const uniqueId = `TR${timestamp}${random}`;

    const newRequest: TransferRequest = {
      id: uniqueId,
      studentId: studentData.studentId,
      studentName: studentData.studentName,
      studentAdmissionNumber: studentData.studentAdmissionNumber,
      studentClass: studentData.studentClass,
      studentSection: studentData.studentSection,
      transferType: transferData.transferType,
      requestedDate: new Date().toISOString().split("T")[0],
      effectiveDate: transferData.effectiveDate,
      reason: transferData.reason,
      notes: transferData.notes,
      sourceClass: studentData.studentClass,
      sourceSection: studentData.studentSection,
      destinationClass: transferData.destinationClass,
      destinationSection: transferData.destinationSection,
      destinationSchoolName: transferData.destinationSchoolName,
      destinationSchoolAddress: transferData.destinationSchoolAddress,
      status: "pending",
      priority: "normal",
      financialClearance: "pending",
      requestedBy: "current-user",
      requestedByName: "Current User",
      requestedByRole: "Teacher",
      parentNotified: false,
      documentsMigrated: false,
      feeStructureUpdated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("TransferContext: Creating new request", newRequest);
    setRequests(prev => {
      const updated = [newRequest, ...prev];
      console.log("TransferContext: Updated requests array", updated);
      return updated;
    });
  };

  const updateTransferRequest = (id: string, updates: Partial<TransferRequest>) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, ...updates, updatedAt: new Date().toISOString() }
          : req
      )
    );
  };

  const getStudentTransfers = (studentId: string) => {
    return requests.filter(req => req.studentId === studentId || req.studentAdmissionNumber === studentId);
  };

  return (
    <TransferContext.Provider value={{ requests, addTransferRequest, updateTransferRequest, getStudentTransfers }}>
      {children}
    </TransferContext.Provider>
  );
}

export function useTransfers() {
  const context = useContext(TransferContext);
  if (context === undefined) {
    throw new Error("useTransfers must be used within a TransferProvider");
  }
  return context;
}
