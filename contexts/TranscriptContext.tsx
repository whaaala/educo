"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TranscriptRequest } from "@/types/transcript";

interface TranscriptContextType {
  requests: TranscriptRequest[];
  addTranscriptRequest: (request: TranscriptRequest) => void;
  updateTranscriptRequest: (id: string, updates: Partial<TranscriptRequest>) => void;
  getStudentTranscripts: (studentId: string) => TranscriptRequest[];
}

const TranscriptContext = createContext<TranscriptContextType | undefined>(undefined);

const STORAGE_KEY = "educo_transcript_requests";
const VERSION_KEY = "educo_transcript_requests_version";
const CURRENT_VERSION = "1"; // Increment this to force clear old data

export function TranscriptProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<TranscriptRequest[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load requests from localStorage on mount
  useEffect(() => {
    try {
      const version = localStorage.getItem(VERSION_KEY);

      // Clear old data if version mismatch
      if (version !== CURRENT_VERSION) {
        console.log("TranscriptContext: Version mismatch, clearing old data");
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        setRequests([]);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log("TranscriptContext: Loaded requests from localStorage", parsed);
          setRequests(parsed);
        }
      }
    } catch (error) {
      console.error("TranscriptContext: Error loading from localStorage", error);
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
        console.log("TranscriptContext: Saved requests to localStorage", requests);
      } catch (error) {
        console.error("TranscriptContext: Error saving to localStorage", error);
      }
    }
  }, [requests, isHydrated]);

  const addTranscriptRequest = (request: TranscriptRequest) => {
    console.log("TranscriptContext: Creating new request", request);
    setRequests(prev => {
      const updated = [request, ...prev];
      console.log("TranscriptContext: Updated requests array", updated);
      return updated;
    });
  };

  const updateTranscriptRequest = (id: string, updates: Partial<TranscriptRequest>) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, ...updates, updatedAt: new Date().toISOString() }
          : req
      )
    );
  };

  const getStudentTranscripts = (studentId: string) => {
    return requests.filter(req => req.studentId === studentId || req.studentAdmissionNumber === studentId);
  };

  return (
    <TranscriptContext.Provider value={{ requests, addTranscriptRequest, updateTranscriptRequest, getStudentTranscripts }}>
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscripts() {
  const context = useContext(TranscriptContext);
  if (context === undefined) {
    throw new Error("useTranscripts must be used within a TranscriptProvider");
  }
  return context;
}
