import { TransferRequest, TransferHistory } from "@/types/transfer";

/**
 * Mock Transfer Data
 * Sample transfer requests and history for development
 */

export const mockTransferRequests: TransferRequest[] = [
  {
    id: "TRF-001",
    studentId: "AD9892302",
    studentName: "Adebayo Okonkwo",
    studentAdmissionNumber: "AD9892302",
    studentClass: "JSS 2",
    studentSection: "A",
    profilePhoto: "/images/students/student1.jpg",

    transferType: "class-change",
    requestedDate: "2025-01-05T10:30:00Z",
    effectiveDate: "2025-01-15T00:00:00Z",
    reason: "Student performance indicates readiness for advanced class",

    sourceBranchId: "main-campus",
    sourceBranchName: "Main Campus",
    sourceClass: "JSS 2",
    sourceSection: "A",

    destinationBranchId: "main-campus",
    destinationBranchName: "Main Campus",
    destinationClass: "JSS 3",
    destinationSection: "A",

    status: "pending",
    priority: "normal",

    financialClearance: "cleared",

    requestedBy: "parent-001",
    requestedByName: "Mr. Okonkwo",
    requestedByRole: "Parent",

    notes: "Student has shown exceptional performance and is ready for advancement.",
    parentNotified: true,
    parentNotifiedDate: "2025-01-05T11:00:00Z",
    documentsMigrated: false,
    feeStructureUpdated: false,

    createdAt: "2025-01-05T10:30:00Z",
    updatedAt: "2025-01-05T10:30:00Z",
  },
  {
    id: "TRF-002",
    studentId: "AD8734521",
    studentName: "Chidinma Nwosu",
    studentAdmissionNumber: "AD8734521",
    studentClass: "SSS 1",
    studentSection: "B",

    transferType: "cross-branch",
    requestedDate: "2025-01-03T14:20:00Z",
    effectiveDate: "2025-02-01T00:00:00Z",
    reason: "Family relocated to new area, requesting transfer to branch closer to home",

    sourceBranchId: "main-campus",
    sourceBranchName: "Main Campus",
    sourceClass: "SSS 1",
    sourceSection: "B",

    destinationBranchId: "ikeja-branch",
    destinationBranchName: "Ikeja Branch",
    destinationClass: "SSS 1",
    destinationSection: "A",

    status: "approved",
    priority: "high",

    financialClearance: "cleared",

    requestedBy: "parent-002",
    requestedByName: "Mrs. Nwosu",
    requestedByRole: "Parent",

    approvedBy: "admin-001",
    approvedByName: "Principal Adeyemi",
    approvedDate: "2025-01-04T09:15:00Z",

    notes: "Family residence changed due to job relocation. Transfer approved for convenience.",
    parentNotified: true,
    parentNotifiedDate: "2025-01-04T09:30:00Z",
    documentsMigrated: true,
    feeStructureUpdated: true,

    createdAt: "2025-01-03T14:20:00Z",
    updatedAt: "2025-01-04T09:15:00Z",
  },
  {
    id: "TRF-003",
    studentId: "AD7623451",
    studentName: "Ibrahim Yusuf",
    studentAdmissionNumber: "AD7623451",
    studentClass: "JSS 1",
    studentSection: "C",

    transferType: "section-change",
    requestedDate: "2024-12-20T11:45:00Z",
    effectiveDate: "2025-01-10T00:00:00Z",
    reason: "Student having difficulty with current teaching style, parent requests section change",

    sourceBranchId: "main-campus",
    sourceBranchName: "Main Campus",
    sourceClass: "JSS 1",
    sourceSection: "C",

    destinationBranchId: "main-campus",
    destinationBranchName: "Main Campus",
    destinationClass: "JSS 1",
    destinationSection: "A",

    status: "completed",
    priority: "normal",

    financialClearance: "not-required",

    requestedBy: "parent-003",
    requestedByName: "Alhaji Yusuf",
    requestedByRole: "Parent",

    approvedBy: "admin-002",
    approvedByName: "Vice Principal Okafor",
    approvedDate: "2024-12-21T08:00:00Z",

    processedBy: "admin-002",
    processedByName: "Vice Principal Okafor",
    processedDate: "2025-01-10T07:30:00Z",

    notes: "Section change approved. Student adjusted well to new section.",
    parentNotified: true,
    parentNotifiedDate: "2024-12-21T08:15:00Z",
    documentsMigrated: true,
    feeStructureUpdated: false,

    createdAt: "2024-12-20T11:45:00Z",
    updatedAt: "2025-01-10T07:30:00Z",
    completedAt: "2025-01-10T07:30:00Z",
  },
  {
    id: "TRF-004",
    studentId: "AD6512340",
    studentName: "Blessing Eze",
    studentAdmissionNumber: "AD6512340",
    studentClass: "SSS 2",
    studentSection: "A",

    transferType: "external",
    requestedDate: "2024-12-15T16:00:00Z",
    effectiveDate: "2025-01-31T00:00:00Z",
    reason: "Family traveling abroad, student transferring to international school",

    sourceBranchId: "main-campus",
    sourceBranchName: "Main Campus",
    sourceClass: "SSS 2",
    sourceSection: "A",

    destinationSchoolName: "International Academy Lagos",

    status: "in-progress",
    priority: "urgent",

    financialClearance: "pending",
    outstandingFees: 45000,
    financialNotes: "Outstanding balance for third term fees",

    requestedBy: "parent-004",
    requestedByName: "Dr. Eze",
    requestedByRole: "Parent",

    approvedBy: "admin-001",
    approvedByName: "Principal Adeyemi",
    approvedDate: "2024-12-16T10:00:00Z",

    notes: "Transfer certificate and academic records being prepared. Awaiting financial clearance.",
    parentNotified: true,
    parentNotifiedDate: "2024-12-16T10:20:00Z",
    documentsMigrated: false,
    feeStructureUpdated: false,

    createdAt: "2024-12-15T16:00:00Z",
    updatedAt: "2024-12-16T10:00:00Z",
  },
  {
    id: "TRF-005",
    studentId: "AD5401239",
    studentName: "Fatima Mohammed",
    studentAdmissionNumber: "AD5401239",
    studentClass: "Primary 5",
    studentSection: "B",

    transferType: "class-change",
    requestedDate: "2024-12-10T09:00:00Z",
    effectiveDate: "2024-12-15T00:00:00Z",
    reason: "Teacher recommendation: Student struggling with current class level",

    sourceBranchId: "main-campus",
    sourceBranchName: "Main Campus",
    sourceClass: "Primary 5",
    sourceSection: "B",

    destinationBranchId: "main-campus",
    destinationBranchName: "Main Campus",
    destinationClass: "Primary 4",
    destinationSection: "A",

    status: "rejected",
    priority: "normal",

    financialClearance: "cleared",

    requestedBy: "teacher-001",
    requestedByName: "Mrs. Adeleke",
    requestedByRole: "Teacher",

    rejectedBy: "admin-001",
    rejectedByName: "Principal Adeyemi",
    rejectionReason: "After review, student needs additional support in current class rather than demotion. Extra lessons arranged.",
    rejectionDate: "2024-12-11T14:00:00Z",

    notes: "Alternative solution: Assigned remedial teacher for Mathematics and English.",
    parentNotified: true,
    parentNotifiedDate: "2024-12-11T14:30:00Z",
    documentsMigrated: false,
    feeStructureUpdated: false,

    createdAt: "2024-12-10T09:00:00Z",
    updatedAt: "2024-12-11T14:00:00Z",
  },
];

export const mockTransferHistory: Record<string, TransferHistory> = {
  "AD9892302": {
    studentId: "AD9892302",
    totalTransfers: 2,
    transfers: [
      {
        id: "TRF-001",
        transferType: "class-change",
        status: "pending",
        requestedDate: "2025-01-05T10:30:00Z",
        effectiveDate: "2025-01-15T00:00:00Z",
        from: {
          branchId: "main-campus",
          branchName: "Main Campus",
          class: "JSS 2",
          section: "A",
        },
        to: {
          branchId: "main-campus",
          branchName: "Main Campus",
          class: "JSS 3",
          section: "A",
        },
        reason: "Student performance indicates readiness for advanced class",
        requestedBy: "Mr. Okonkwo (Parent)",
        notes: "Student has shown exceptional performance and is ready for advancement.",
      },
      {
        id: "TRF-000",
        transferType: "section-change",
        status: "completed",
        requestedDate: "2024-09-01T08:00:00Z",
        effectiveDate: "2024-09-05T00:00:00Z",
        completedDate: "2024-09-05T08:30:00Z",
        from: {
          branchId: "main-campus",
          branchName: "Main Campus",
          class: "JSS 2",
          section: "B",
        },
        to: {
          branchId: "main-campus",
          branchName: "Main Campus",
          class: "JSS 2",
          section: "A",
        },
        reason: "Parent request for section with different teacher",
        requestedBy: "Mr. Okonkwo (Parent)",
        approvedBy: "Principal Adeyemi",
        notes: "Transfer completed at start of new term",
      },
    ],
  },
  "AD8734521": {
    studentId: "AD8734521",
    totalTransfers: 1,
    transfers: [
      {
        id: "TRF-002",
        transferType: "cross-branch",
        status: "approved",
        requestedDate: "2025-01-03T14:20:00Z",
        effectiveDate: "2025-02-01T00:00:00Z",
        from: {
          branchId: "main-campus",
          branchName: "Main Campus",
          class: "SSS 1",
          section: "B",
        },
        to: {
          branchId: "ikeja-branch",
          branchName: "Ikeja Branch",
          class: "SSS 1",
          section: "A",
        },
        reason: "Family relocated to new area, requesting transfer to branch closer to home",
        requestedBy: "Mrs. Nwosu (Parent)",
        approvedBy: "Principal Adeyemi",
        notes: "Family residence changed due to job relocation. Transfer approved for convenience.",
      },
    ],
  },
};

/**
 * Get all transfer requests
 */
export function getTransferRequests(): TransferRequest[] {
  return mockTransferRequests;
}

/**
 * Get transfer requests by status
 */
export function getTransferRequestsByStatus(status: TransferRequest["status"]): TransferRequest[] {
  return mockTransferRequests.filter((req) => req.status === status);
}

/**
 * Get transfer request by ID
 */
export function getTransferRequestById(id: string): TransferRequest | undefined {
  return mockTransferRequests.find((req) => req.id === id);
}

/**
 * Get transfer requests for a student
 */
export function getStudentTransferRequests(studentId: string): TransferRequest[] {
  return mockTransferRequests.filter((req) => req.studentId === studentId);
}

/**
 * Get transfer history for a student
 */
export function getStudentTransferHistory(studentId: string): TransferHistory | null {
  return mockTransferHistory[studentId] || null;
}

/**
 * Get pending transfer requests count
 */
export function getPendingTransfersCount(): number {
  return mockTransferRequests.filter((req) => req.status === "pending").length;
}

/**
 * Check if student has pending transfer
 */
export function hasStudentPendingTransfer(studentId: string): boolean {
  return mockTransferRequests.some(
    (req) => req.studentId === studentId && req.status === "pending"
  );
}
