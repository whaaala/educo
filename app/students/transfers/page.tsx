"use client";

import { useState, useEffect } from "react";
import { TransferRequest } from "@/types/transfer";
import DataManagementPage from "@/components/pages/DataManagementPage";
import TransferRequestsTable from "@/components/transfers/TransferRequestsTable";
import TransferRequestDetailModal from "@/components/transfers/TransferRequestDetailModal";
import { useTransfers } from "@/contexts/TransferContext";
import { exportTransfersToExcel, exportTransfersToPDF } from "@/lib/export-utils";
import {
  transferFilterFields,
  transferSortOptions,
  transferStats,
  filterTransferRequests,
  sortTransferRequests,
} from "./config";

// Mock data - replace with actual API call
const mockTransferRequests: TransferRequest[] = [
  {
    id: "TR001",
    studentId: "AD9892302",
    studentName: "Aaliyah Griffin",
    studentAdmissionNumber: "AD9892302",
    studentClass: "JSS 1",
    studentSection: "A",
    profilePhoto: "https://i.pravatar.cc/150?img=1",
    transferType: "section-change",
    requestedDate: "2024-01-15",
    effectiveDate: "2024-02-01",
    reason: "Student performance better suited for Section B teaching style",
    sourceClass: "JSS 1",
    sourceSection: "A",
    destinationClass: "JSS 1",
    destinationSection: "B",
    status: "pending",
    priority: "normal",
    financialClearance: "cleared",
    requestedBy: "user123",
    requestedByName: "Mrs. Johnson",
    requestedByRole: "Class Teacher",
    parentNotified: true,
    parentNotifiedDate: "2024-01-15",
    documentsMigrated: false,
    feeStructureUpdated: false,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "TR002",
    studentId: "AD9892419",
    studentName: "Amanda Thomas IV",
    studentAdmissionNumber: "AD9892419",
    studentClass: "Primary 1",
    studentSection: "A",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    transferType: "cross-branch",
    requestedDate: "2024-01-14",
    effectiveDate: "2024-02-01",
    reason: "Family relocated to Lekki area",
    sourceBranchId: "main-campus",
    sourceBranchName: "Main Campus",
    sourceClass: "Primary 1",
    sourceSection: "A",
    destinationBranchId: "lekki-branch",
    destinationBranchName: "Lekki Branch",
    destinationClass: "Primary 1",
    destinationSection: "B",
    status: "approved",
    priority: "high",
    financialClearance: "cleared",
    requestedBy: "parent456",
    requestedByName: "Mr. Thomas",
    requestedByRole: "Parent",
    approvedBy: "admin789",
    approvedByName: "Dr. Williams",
    approvedDate: "2024-01-16T14:20:00Z",
    parentNotified: true,
    parentNotifiedDate: "2024-01-16",
    documentsMigrated: false,
    feeStructureUpdated: true,
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "TR003",
    studentId: "AD9892533",
    studentName: "Amelia Jackson",
    studentAdmissionNumber: "AD9892533",
    studentClass: "Primary 1",
    studentSection: "B",
    profilePhoto: "https://i.pravatar.cc/150?img=9",
    transferType: "class-change",
    requestedDate: "2024-01-12",
    effectiveDate: "2024-01-20",
    reason: "Student demonstrates advanced academic ability, recommended for acceleration",
    sourceClass: "Primary 1",
    sourceSection: "B",
    destinationClass: "Primary 2",
    destinationSection: "A",
    status: "completed",
    priority: "normal",
    financialClearance: "cleared",
    requestedBy: "teacher101",
    requestedByName: "Miss Anderson",
    requestedByRole: "Class Teacher",
    approvedBy: "admin789",
    approvedByName: "Dr. Williams",
    approvedDate: "2024-01-13T11:00:00Z",
    processedBy: "admin789",
    processedByName: "Dr. Williams",
    processedDate: "2024-01-20T08:00:00Z",
    parentNotified: true,
    parentNotifiedDate: "2024-01-13",
    documentsMigrated: true,
    feeStructureUpdated: true,
    createdAt: "2024-01-12T13:45:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
    completedAt: "2024-01-20T08:00:00Z",
  },
];

export default function TransferRequestsPage() {
  const { requests: contextRequests, updateTransferRequest } = useTransfers();
  const [requests, setRequests] = useState<TransferRequest[]>(mockTransferRequests);
  const [selectedRequest, setSelectedRequest] = useState<TransferRequest | null>(null);

  // Initialize with mock data and merge with context requests
  useEffect(() => {
    // Merge context requests with mock requests, avoiding duplicates
    const merged = [
      ...contextRequests,
      ...mockTransferRequests.filter(
        mock => !contextRequests.some(ctx => ctx.id === mock.id)
      )
    ];

    // Only update if the merged array is different from current requests
    setRequests(prev => {
      if (contextRequests.length === 0 && prev.length > 0) {
        return prev;
      }
      return merged;
    });
  }, [contextRequests]);

  // Update selected request when requests change
  useEffect(() => {
    if (selectedRequest) {
      const updated = requests.find(req => req.id === selectedRequest.id);
      if (updated) {
        setSelectedRequest(updated);
      }
    }
  }, [requests]);

  const handleApprove = (requestId: string) => {
    // Update in context (which syncs to localStorage)
    updateTransferRequest(requestId, {
      status: "approved",
      approvedBy: "current-user",
      approvedByName: "Current User",
      approvedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Also update local state for immediate UI update
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: "approved" as const,
            approvedBy: "current-user",
            approvedByName: "Current User",
            approvedDate: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : req
    ));
  };

  const handleReject = (requestId: string, reason: string) => {
    // Update in context (which syncs to localStorage)
    updateTransferRequest(requestId, {
      status: "rejected",
      rejectedBy: "current-user",
      rejectedByName: "Current User",
      rejectionReason: reason,
      rejectionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Also update local state for immediate UI update
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: "rejected" as const,
            rejectedBy: "current-user",
            rejectedByName: "Current User",
            rejectionReason: reason,
            rejectionDate: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : req
    ));
  };

  const handleProcess = (requestId: string) => {
    // Update in context (which syncs to localStorage)
    updateTransferRequest(requestId, {
      status: "completed",
      processedBy: "current-user",
      processedByName: "Current User",
      processedDate: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documentsMigrated: true,
    });

    // Also update local state for immediate UI update
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: "completed" as const,
            processedBy: "current-user",
            processedByName: "Current User",
            processedDate: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            documentsMigrated: true,
          }
        : req
    ));
  };

  const handleExportPDF = (items: TransferRequest[]) => {
    exportTransfersToPDF(items, "transfer-requests");
  };

  const handleExportExcel = (items: TransferRequest[]) => {
    exportTransfersToExcel(items, "transfer-requests");
  };

  return (
    <DataManagementPage<TransferRequest>
      title="Transfer Requests"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Students", href: "/students" },
        { label: "Transfer Requests", isActive: true },
      ]}
      data={requests}
      getRowKey={(item) => item.id}
      columns={[]} // Using customListComponent instead
      stats={transferStats}
      statsColumns={{ default: 2, sm: 3, md: 6 }}
      filterFields={transferFilterFields}
      sortOptions={transferSortOptions}
      defaultSort="newest"
      filterFn={filterTransferRequests}
      sortFn={sortTransferRequests}
      enableViewToggle={false}
      enableSelection={false}
      enableExport={true}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
      itemLabel="request"
      itemLabelPlural="requests"
      showTableSearch={false}
      customListComponent={
        <TransferRequestsTable
          requests={requests}
          onViewDetails={(request) => setSelectedRequest(request)}
          onApprove={handleApprove}
          onReject={handleReject}
          onProcess={handleProcess}
        />
      }
    >
      {/* Detail Modal */}
      {selectedRequest && (
        <TransferRequestDetailModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onProcess={handleProcess}
        />
      )}
    </DataManagementPage>
  );
}
