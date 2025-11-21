"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Download,
  RefreshCw
} from "lucide-react";
import { TransferRequest, TransferStatus, TransferType } from "@/types/transfer";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import TransferRequestsTable from "@/components/transfers/TransferRequestsTable";
import TransferStatisticsCards from "@/components/transfers/TransferStatisticsCards";
import TransferRequestDetailModal from "@/components/transfers/TransferRequestDetailModal";
import { useTransfers } from "@/contexts/TransferContext";
import { exportTransfersToExcel, exportTransfersToPDF } from "@/lib/export-utils";

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
  const [filterStatus, setFilterStatus] = useState<TransferStatus | "all">("all");
  const [filterType, setFilterType] = useState<TransferType | "all">("all");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize with mock data and merge with context requests
  useEffect(() => {
    console.log("Transfer Requests Page: Context requests changed", contextRequests);
    // Merge context requests with mock requests, avoiding duplicates
    const merged = [
      ...contextRequests,
      ...mockTransferRequests.filter(
        mock => !contextRequests.some(ctx => ctx.id === mock.id)
      )
    ];
    console.log("Transfer Requests Page: Merged requests", merged);

    // Only update if the merged array is different from current requests
    setRequests(prev => {
      // Don't reset if we're just getting the same context data
      if (contextRequests.length === 0 && prev.length > 0) {
        // Keep existing data if context is empty and we have local updates
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

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesType = filterType === "all" || request.transferType === filterType;
    const matchesClass = filterClass === "all" || request.studentClass === filterClass;

    // Extract year from requested date
    const requestYear = new Date(request.requestedDate).getFullYear().toString();
    const matchesYear = filterYear === "all" || requestYear === filterYear;

    const matchesSearch = searchQuery === "" ||
      request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.studentAdmissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesClass && matchesYear && matchesSearch;
  });

  const handleApprove = (requestId: string) => {
    console.log("Page handleApprove called", { requestId });

    // Update in context (which syncs to localStorage)
    updateTransferRequest(requestId, {
      status: "approved",
      approvedBy: "current-user",
      approvedByName: "Current User",
      approvedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Also update local state for immediate UI update
    setRequests(prev => {
      const updated = prev.map(req =>
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
      );
      console.log("Page handleApprove: Updated requests", updated);
      return updated;
    });
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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with Breadcrumbs and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <PageHeader
            title="Transfer Requests"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Students", href: "/students" },
              { label: "Transfer Requests", isActive: true },
            ]}
          />
          <PageActions
            actions={[
              {
                label: "Export",
                icon: Download,
                onClick: () => console.log("Export clicked"),
                variant: "secondary",
              },
            ]}
            onExportPDF={() => exportTransfersToPDF(filteredRequests, "transfer-requests")}
            onExportExcel={() => exportTransfersToExcel(filteredRequests, "transfer-requests")}
            exportDescription="Download transfer requests data"
          />
        </div>

      {/* Statistics Cards */}
      <TransferStatisticsCards requests={requests} />

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by student name, admission number, or request ID..."
        filters={[
          {
            label: "Class Filter",
            value: filterClass,
            onChange: (value) => setFilterClass(value as string),
            options: [
              { label: "All Classes", value: "all" },
              { label: "JSS 1", value: "JSS 1" },
              { label: "JSS 2", value: "JSS 2" },
              { label: "JSS 3", value: "JSS 3" },
              { label: "Primary 1", value: "Primary 1" },
              { label: "Primary 2", value: "Primary 2" },
              { label: "SS 1", value: "SS 1" },
              { label: "SS 2", value: "SS 2" },
              { label: "SS 3", value: "SS 3" },
            ],
          },
          {
            label: "Year Filter",
            value: filterYear,
            onChange: (value) => setFilterYear(value as string),
            options: [
              { label: "All Years", value: "all" },
              { label: "2025", value: "2025" },
              { label: "2024", value: "2024" },
              { label: "2023", value: "2023" },
              { label: "2022", value: "2022" },
            ],
          },
          {
            label: "Type Filter",
            value: filterType,
            onChange: (value) => setFilterType(value as TransferType | "all"),
            options: [
              { label: "All Types", value: "all" },
              { label: "Section Change", value: "section-change" },
              { label: "Class Change", value: "class-change" },
              { label: "Internal Transfer", value: "internal" },
              { label: "Promotion", value: "promotion" },
              { label: "Cross-Branch", value: "cross-branch" },
              { label: "External Transfer", value: "external" },
            ],
          },
          {
            label: "Status Filter",
            value: filterStatus,
            onChange: (value) => setFilterStatus(value as TransferStatus | "all"),
            options: [
              { label: "All Status", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
              { label: "Rejected", value: "rejected" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
        ]}
      />

      {/* Transfer Requests Table */}
      <TransferRequestsTable
        requests={filteredRequests}
        onViewDetails={(request) => setSelectedRequest(request)}
        onApprove={handleApprove}
        onReject={handleReject}
        onProcess={handleProcess}
        filterKey={`${filterStatus}-${filterType}-${searchQuery}`}
      />

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
      </div>
    </MainLayout>
  );
}
