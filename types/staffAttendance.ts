// Staff Attendance Types

export type StaffAttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "half-day"
  | "on-leave"
  | "work-from-home"
  | "holiday";

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  department: string;
  designation: string;
  profilePhoto?: string;
  date: string; // YYYY-MM-DD
  status: StaffAttendanceStatus;
  checkInTime?: string; // HH:MM AM/PM
  checkOutTime?: string; // HH:MM AM/PM
  lateBy?: number; // minutes
  earlyLeaveBy?: number; // minutes
  workingHours?: number; // decimal hours
  overtimeHours?: number; // decimal hours
  remarks?: string;
  markedBy: string; // Admin/Manager ID
  markedByName: string;
  markedAt: string; // ISO timestamp
  location?: string; // GPS/Biometric location
  updatedAt?: string;
}

export interface StaffAttendanceStats {
  totalStaff: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  onLeave: number;
  workFromHome: number;
  notMarked: number;
}

export interface StaffAttendanceFilters {
  date: string;
  department: string;
  status: string;
  searchQuery: string;
}

export interface BulkAttendanceData {
  staffId: string;
  status: StaffAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}
