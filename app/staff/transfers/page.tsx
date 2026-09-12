"use client";

import { useState } from "react";
import { StaffTransferRequest } from "@/types/staffTransfer";
import DataManagementPage from "@/components/pages/DataManagementPage";
import StaffTransferTable from "@/components/staff/transfers/StaffTransferTable";
import NewTransferRequestModal from "@/components/staff/transfers/NewTransferRequestModal";
import { exportStaffTransfersToPDF, exportStaffTransfersToExcel } from "@/utils/exportStaffTransfers";
import {
  transferFilterFields,
  transferSortOptions,
  transferStats,
  filterTransferRequests,
  sortTransferRequests,
  searchTransferRequests,
} from "./config";

// Mock data
const mockTransferRequests: StaffTransferRequest[] = [
  {
    id: "TRN001",
    staffId: "STF001",
    staffName: "John Doe",
    staffEmail: "john.doe@school.com",
    profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
    currentDepartment: "Mathematics",
    currentDesignation: "Senior Teacher",
    currentBranch: "Main Campus",
    currentLocation: "Lagos",
    transferType: "department",
    newDepartment: "Science",
    transferDate: "2025-01-15",
    effectiveDate: "2025-02-01",
    reason: "Need for science teachers in new campus expansion",
    status: "approved",
    requestedBy: "ADMIN001",
    requestedByName: "HR Manager",
    requestedAt: "2025-01-10T09:00:00Z",
    approvedBy: "ADMIN002",
    approvedByName: "Principal",
    approvedAt: "2025-01-12T14:00:00Z",
    approvalComments: "Approved to support campus expansion initiative",
  },
  {
    id: "TRN002",
    staffId: "STF002",
    staffName: "Jane Smith",
    staffEmail: "jane.smith@school.com",
    profilePhoto: "https://randomuser.me/api/portraits/women/44.jpg",
    currentDepartment: "English",
    currentDesignation: "Teacher",
    currentBranch: "Main Campus",
    currentLocation: "Lagos",
    transferType: "branch",
    newBranch: "Annex Campus",
    newLocation: "Ikeja",
    transferDate: "2025-01-12",
    effectiveDate: "2025-01-20",
    reason: "Request for transfer closer to residence",
    remarks: "Staff requested this transfer for personal reasons",
    status: "approved",
    requestedBy: "ADMIN001",
    requestedByName: "HR Manager",
    requestedAt: "2025-01-08T10:30:00Z",
    approvedBy: "ADMIN002",
    approvedByName: "Principal",
    approvedAt: "2025-01-09T14:00:00Z",
    approvalComments: "Approved. Good staff retention measure.",
  },
  {
    id: "TRN003",
    staffId: "STF003",
    staffName: "Michael Johnson",
    staffEmail: "michael.johnson@school.com",
    profilePhoto: "https://randomuser.me/api/portraits/men/17.jpg",
    currentDepartment: "ICT",
    currentDesignation: "ICT Coordinator",
    currentBranch: "Main Campus",
    currentLocation: "Lagos",
    transferType: "designation",
    newDesignation: "Head of ICT",
    transferDate: "2025-01-05",
    effectiveDate: "2025-01-15",
    reason: "Promotion to Head of Department",
    status: "approved",
    requestedBy: "ADMIN001",
    requestedByName: "HR Manager",
    requestedAt: "2025-01-02T11:00:00Z",
    approvedBy: "ADMIN002",
    approvedByName: "Principal",
    approvedAt: "2025-01-03T09:00:00Z",
    approvalComments: "Well deserved promotion",
  },
  {
    id: "TRN004",
    staffId: "STF004",
    staffName: "Sarah Williams",
    staffEmail: "sarah.williams@school.com",
    profilePhoto: "https://randomuser.me/api/portraits/women/68.jpg",
    currentDepartment: "Biology",
    currentDesignation: "Teacher",
    currentBranch: "Annex Campus",
    currentLocation: "Ikeja",
    transferType: "department",
    newDepartment: "Chemistry",
    transferDate: "2025-01-18",
    effectiveDate: "2025-02-05",
    reason: "Staff specialization in Chemistry",
    status: "rejected",
    requestedBy: "ADMIN001",
    requestedByName: "HR Manager",
    requestedAt: "2025-01-15T08:00:00Z",
    rejectedBy: "ADMIN002",
    rejectedByName: "Principal",
    rejectedAt: "2025-01-16T15:30:00Z",
    rejectionReason: "Need to maintain Biology teacher count at Annex Campus",
  },
  {
    id: "TRN005",
    staffId: "STF005",
    staffName: "David Brown",
    staffEmail: "david.brown@school.com",
    profilePhoto: "https://randomuser.me/api/portraits/men/52.jpg",
    currentDepartment: "Sports",
    currentDesignation: "Sports Coordinator",
    currentBranch: "Main Campus",
    currentLocation: "Lagos",
    transferType: "branch",
    newBranch: "Lekki Campus",
    newLocation: "Lekki",
    transferDate: "2024-12-01",
    effectiveDate: "2024-12-15",
    reason: "Establish sports program at new campus",
    status: "completed",
    requestedBy: "ADMIN001",
    requestedByName: "HR Manager",
    requestedAt: "2024-11-20T10:00:00Z",
    approvedBy: "ADMIN002",
    approvedByName: "Principal",
    approvedAt: "2024-11-22T11:00:00Z",
    approvalComments: "Critical for new campus operations",
    completedAt: "2024-12-15T08:00:00Z",
    completedBy: "ADMIN001",
    completionNotes: "Successfully transferred. Orientation completed.",
  },
];

export default function StaffTransfersPage() {
  const [requests, setRequests] = useState<StaffTransferRequest[]>(mockTransferRequests);
  const [_selectedRequest, setSelectedRequest] = useState<StaffTransferRequest | null>(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: "approved" as const,
            approvedBy: "current-user",
            approvedByName: "Current User",
            approvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : req
    ));
  };

  const handleReject = (requestId: string, reason: string) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: "rejected" as const,
            rejectedBy: "current-user",
            rejectedByName: "Current User",
            rejectionReason: reason,
            rejectedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : req
    ));
  };

  const handleProcess = (requestId: string) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: "in-progress" as const,
            updatedAt: new Date().toISOString(),
          }
        : req
    ));
  };

  return (
    <DataManagementPage<StaffTransferRequest>
      title="Staff Transfers"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Staff", href: "/staff" },
        { label: "Transfer Requests", isActive: true },
      ]}
      data={requests}
      getRowKey={(item) => item.id}
      columns={[]}
      stats={transferStats}
      statsColumns={{ default: 1, sm: 2, md: 3, lg: 6 }}
      filterFields={transferFilterFields}
      sortOptions={transferSortOptions}
      filterFn={filterTransferRequests}
      sortFn={sortTransferRequests}
      searchFn={searchTransferRequests}
      addButtonConfig={{
        label: "New Transfer Request",
        onClick: () => setIsNewRequestModalOpen(true),
      }}
      onExportPDF={(items) => exportStaffTransfersToPDF(items)}
      onExportExcel={(items) => exportStaffTransfersToExcel(items)}
      enableViewToggle={false}
      enableSelection={false}
      enablePagination={false}
      showTableSearch={false}
      itemLabel="transfer request"
      itemLabelPlural="transfer requests"
      customListComponent={
        <StaffTransferTable
          requests={requests}
          onViewDetails={(request) => setSelectedRequest(request)}
          onApprove={handleApprove}
          onReject={handleReject}
          onProcess={handleProcess}
        />
      }
    >
      {/* New Transfer Request Modal */}
      <NewTransferRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        onSubmit={(data) => {
          console.log("New transfer request submitted:", data);
        }}
      />
    </DataManagementPage>
  );
}
