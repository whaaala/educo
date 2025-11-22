// Staff Transfer Types

export type TransferStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

export type TransferType =
  | "department"
  | "branch"
  | "designation"
  | "promotion"
  | "location";

export interface StaffTransferRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  profilePhoto?: string;

  // Current Details
  currentDepartment: string;
  currentDesignation: string;
  currentBranch: string;
  currentLocation: string;

  // Transfer To
  transferType: TransferType;
  newDepartment?: string;
  newDesignation?: string;
  newBranch?: string;
  newLocation?: string;

  // Promotion-specific fields
  isPromotion?: boolean;
  currentSalary?: number;
  newSalary?: number;
  salaryIncrease?: number;
  salaryIncreasePercentage?: number;
  newResponsibilities?: string;

  // Transfer Details
  transferDate: string; // YYYY-MM-DD
  effectiveDate: string; // YYYY-MM-DD
  reason: string;
  remarks?: string;

  // Workflow
  status: TransferStatus;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string; // ISO timestamp

  // Approval Chain
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewComments?: string;

  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  approvalComments?: string;

  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: string;
  rejectionReason?: string;

  // Completion
  completedAt?: string;
  completedBy?: string;
  completionNotes?: string;

  updatedAt?: string;
  attachments?: string[];
}

export interface TransferStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface TransferFilters {
  status: string;
  transferType: string;
  department: string;
  branch: string;
  dateRange: string;
  searchQuery: string;
}

export interface BulkTransferAction {
  action: "approve" | "reject" | "cancel";
  staffIds: string[];
  comments?: string;
  actionBy: string;
  actionByName: string;
}

export interface TransferFormData {
  staffId: string;
  transferType: TransferType;
  newDepartment?: string;
  newDesignation?: string;
  newBranch?: string;
  newLocation?: string;
  transferDate: string;
  effectiveDate: string;
  reason: string;
  remarks?: string;
}
