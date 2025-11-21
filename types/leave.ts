/**
 * Staff Leave Request Types
 * Handles all leave-related data structures for staff leave requests
 */

export type LeaveType =
  | "Annual Leave"
  | "Medical Leave"
  | "Casual Leave"
  | "Maternity Leave"
  | "Paternity Leave"
  | "Special Leave"
  | "Sick Leave"
  | "Study Leave"
  | "Bereavement Leave"
  | "Unpaid Leave";

export type LeaveStatus =
  | "pending"           // Leave request submitted, awaiting manager approval
  | "approved"          // Leave approved by manager
  | "rejected"          // Leave request rejected
  | "cancelled";        // Leave request cancelled

export type LeavePriority = "low" | "normal" | "high" | "urgent";

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  staffDepartment: string;
  staffPosition: string;
  profilePhoto?: string;

  // Leave Details
  leaveType: LeaveType;
  startDate: string;            // ISO date string
  endDate: string;              // ISO date string
  numberOfDays: number;         // Calculated from start and end dates
  reason: string;               // Detailed reason for leave

  // Request Details
  requestedDate: string;        // ISO date string - when request was submitted
  status: LeaveStatus;
  priority: LeavePriority;

  // Manager/Approval
  managerId?: string;           // ID of staff's manager
  managerName?: string;         // Name of manager
  approvedBy?: string;          // User ID who approved
  approvedByName?: string;
  approvedDate?: string;        // ISO date string

  rejectedBy?: string;
  rejectedByName?: string;
  rejectionReason?: string;
  rejectionDate?: string;

  // Additional Information
  notes?: string;               // Additional notes from staff
  managerNotes?: string;        // Notes from manager
  attachments?: string[];       // URLs to supporting documents (medical certificates, etc.)

  // Leave Balance Impact
  leaveBalance?: {
    annual: number;
    medical: number;
    casual: number;
    special: number;
  };

  // Metadata
  createdAt: string;            // ISO date string
  updatedAt: string;            // ISO date string
}

export interface LeaveStatistics {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;

  byType: {
    [key in LeaveType]?: number;
  };

  averageProcessingTime: number;  // in days
  approvalRate: number;            // percentage
}

// Form data for creating a new leave request
export interface CreateLeaveRequest {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  notes?: string;
  priority?: LeavePriority;
}

// Approval/Rejection data
export interface LeaveApproval {
  leaveRequestId: string;
  approved: boolean;
  approverName: string;
  approverRole: string;
  comments?: string;
  rejectionReason?: string;
}

// Leave reason options
export const LEAVE_REASONS = [
  { value: "personal", label: "Personal Reasons" },
  { value: "medical", label: "Medical/Health Issues" },
  { value: "family_emergency", label: "Family Emergency" },
  { value: "vacation", label: "Vacation/Holiday" },
  { value: "maternity", label: "Maternity" },
  { value: "paternity", label: "Paternity" },
  { value: "bereavement", label: "Bereavement" },
  { value: "study", label: "Study/Training" },
  { value: "religious", label: "Religious Observance" },
  { value: "other", label: "Other" },
] as const;
