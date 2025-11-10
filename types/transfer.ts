/**
 * Student Transfer Types
 * Handles all transfer-related data structures for student transfers
 */

export type TransferType =
  | "cross-branch"      // Transfer between different branches
  | "class-change"      // Change class within same branch
  | "section-change"    // Change section within same class
  | "internal"          // Internal transfer (combined class/section)
  | "external";         // Transfer to different school

export type TransferStatus =
  | "pending"           // Transfer request submitted, awaiting approval
  | "approved"          // Transfer approved, not yet executed
  | "in-progress"       // Transfer is being processed
  | "completed"         // Transfer successfully completed
  | "rejected"          // Transfer request rejected
  | "cancelled";        // Transfer request cancelled

export type FinancialClearanceStatus =
  | "cleared"           // All fees paid, no outstanding balance
  | "pending"           // Clearance pending verification
  | "outstanding"       // Has outstanding fees
  | "waived"            // Financial obligations waived
  | "not-required";     // No financial clearance needed

export interface TransferRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentAdmissionNumber: string;
  studentClass: string;
  studentSection: string;
  profilePhoto?: string;

  // Transfer Details
  transferType: TransferType;
  requestedDate: string;          // ISO date string
  effectiveDate: string;           // ISO date string - when transfer should take effect
  reason: string;                  // Detailed reason for transfer

  // Source (Current)
  sourceBranchId?: string;
  sourceBranchName?: string;
  sourceClass: string;
  sourceSection: string;

  // Destination (Target)
  destinationBranchId?: string;
  destinationBranchName?: string;
  destinationClass?: string;
  destinationSection?: string;
  destinationSchoolName?: string;  // For external transfers

  // Status & Workflow
  status: TransferStatus;
  priority: "low" | "normal" | "high" | "urgent";

  // Financial
  financialClearance: FinancialClearanceStatus;
  outstandingFees?: number;
  financialNotes?: string;

  // Approval & Processing
  requestedBy: string;             // User ID who requested
  requestedByName: string;         // Name of requester
  requestedByRole: string;         // Role: Parent, Admin, Teacher, etc.

  approvedBy?: string;             // User ID who approved
  approvedByName?: string;
  approvedDate?: string;           // ISO date string

  processedBy?: string;            // User ID who processed
  processedByName?: string;
  processedDate?: string;          // ISO date string

  rejectedBy?: string;
  rejectedByName?: string;
  rejectionReason?: string;
  rejectionDate?: string;

  // Additional Information
  notes?: string;                  // General notes
  parentNotified: boolean;         // Whether parent has been notified
  parentNotifiedDate?: string;
  documentsMigrated: boolean;      // Academic records transferred
  feeStructureUpdated: boolean;    // New fee structure applied

  // Metadata
  createdAt: string;               // ISO date string
  updatedAt: string;               // ISO date string
  completedAt?: string;            // ISO date string
}

export interface TransferHistory {
  studentId: string;
  transfers: TransferRecord[];
  totalTransfers: number;
}

export interface TransferRecord {
  id: string;
  transferType: TransferType;
  status: TransferStatus;
  requestedDate: string;
  effectiveDate: string;
  completedDate?: string;

  from: {
    branchId?: string;
    branchName?: string;
    class: string;
    section: string;
  };

  to: {
    branchId?: string;
    branchName?: string;
    class?: string;
    section?: string;
    schoolName?: string;
  };

  reason: string;
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
}

export interface TransferStatistics {
  totalTransfers: number;
  pendingTransfers: number;
  approvedTransfers: number;
  completedTransfers: number;
  rejectedTransfers: number;

  byType: {
    [key in TransferType]: number;
  };

  averageProcessingTime: number;  // in days
  successRate: number;             // percentage
}

// Form data for creating a new transfer request
export interface CreateTransferRequest {
  studentId: string;
  transferType: TransferType;
  effectiveDate: string;
  reason: string;

  destinationBranchId?: string;
  destinationClass?: string;
  destinationSection?: string;
  destinationSchoolName?: string;

  priority?: "low" | "normal" | "high" | "urgent";
  notes?: string;
  notifyParent?: boolean;
}

// Approval/Rejection data
export interface TransferApproval {
  transferId: string;
  approved: boolean;
  approverName: string;
  approverRole: string;
  comments?: string;
  rejectionReason?: string;
}

// Quick class/section change (simplified transfer)
export interface QuickClassChange {
  studentId: string;
  newClass: string;
  newSection: string;
  effectiveDate: string;
  reason: string;
  notifyParent?: boolean;
}
