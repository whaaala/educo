"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Attendance status types
export type AttendanceStatus = "present" | "absent" | "late" | "halfday" | "holiday";

// Absence reason types - categorized for reporting and analytics
export type AbsenceReason =
  | "sick"              // Illness or medical condition
  | "medical_appointment" // Doctor/hospital visit
  | "family_emergency"  // Family-related emergency
  | "bereavement"       // Death in the family
  | "religious_holiday" // Religious observance
  | "travel"            // Family travel
  | "suspension"        // Disciplinary suspension
  | "truancy"           // Unexcused/skipping
  | "weather"           // Severe weather conditions
  | "transport_issue"   // Transportation problems
  | "unknown"           // No reason provided
  | "other";            // Other reason with notes

// Predefined absence reasons for dropdown
export const ABSENCE_REASONS = [
  { value: "sick", label: "Sick / Illness" },
  { value: "medical_appointment", label: "Medical Appointment" },
  { value: "family_emergency", label: "Family Emergency" },
  { value: "bereavement", label: "Bereavement" },
  { value: "religious_holiday", label: "Religious Holiday" },
  { value: "travel", label: "Family Travel" },
  { value: "suspension", label: "Suspension" },
  { value: "truancy", label: "Truancy / Unexcused" },
  { value: "weather", label: "Severe Weather" },
  { value: "transport_issue", label: "Transportation Issue" },
  { value: "unknown", label: "Unknown / Not Specified" },
  { value: "other", label: "Other (See Notes)" },
] as const;

// Attendance record for a student on a specific date
export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  date: string; // Format: YYYY-MM-DD
  lateMinutes?: number;
  absenceReason?: AbsenceReason; // Reason for absence
  absenceExcused?: boolean; // Whether absence is excused (with documentation)
  remarks?: string;
  class: string;
  section: string;
  teacher?: string;
  subject?: string;
  period?: number; // For lesson-level attendance
}

// Attendance context state
interface AttendanceContextState {
  attendanceRecords: Map<string, AttendanceRecord>; // Key: studentId-date
  saveAttendance: (records: AttendanceRecord[]) => void;
  getStudentAttendance: (studentId: string, startDate?: string, endDate?: string) => AttendanceRecord[];
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  clearAttendance: () => void;
}

const AttendanceContext = createContext<AttendanceContextState | undefined>(undefined);

const STORAGE_KEY = "educo_attendance_records";

// Helper function to generate unique key
const generateKey = (studentId: string, date: string): string => {
  return `${studentId}-${date}`;
};

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [attendanceRecords, setAttendanceRecords] = useState<Map<string, AttendanceRecord>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load attendance records from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AttendanceRecord[];
          const recordsMap = new Map<string, AttendanceRecord>();
          parsed.forEach((record) => {
            const key = generateKey(record.studentId, record.date);
            recordsMap.set(key, record);
          });
          setAttendanceRecords(recordsMap);
        }
      } catch (error) {
        console.error("Error loading attendance records from localStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Save attendance records to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        const recordsArray = Array.from(attendanceRecords.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recordsArray));
      } catch (error) {
        console.error("Error saving attendance records to localStorage:", error);
      }
    }
  }, [attendanceRecords, isLoaded]);

  // Save attendance records (upsert)
  const saveAttendance = (records: AttendanceRecord[]) => {
    setAttendanceRecords((prev) => {
      const newMap = new Map(prev);
      records.forEach((record) => {
        const key = generateKey(record.studentId, record.date);
        newMap.set(key, record);
      });
      return newMap;
    });
  };

  // Get attendance for a specific student with optional date range
  const getStudentAttendance = (studentId: string, startDate?: string, endDate?: string): AttendanceRecord[] => {
    const records = Array.from(attendanceRecords.values()).filter((record) => {
      if (record.studentId !== studentId) return false;

      if (startDate && record.date < startDate) return false;
      if (endDate && record.date > endDate) return false;

      return true;
    });

    return records.sort((a, b) => a.date.localeCompare(b.date));
  };

  // Get all attendance for a specific date
  const getAttendanceByDate = (date: string): AttendanceRecord[] => {
    return Array.from(attendanceRecords.values()).filter((record) => record.date === date);
  };

  // Clear all attendance records
  const clearAttendance = () => {
    setAttendanceRecords(new Map());
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        saveAttendance,
        getStudentAttendance,
        getAttendanceByDate,
        clearAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

// Custom hook to use attendance context
export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
}
