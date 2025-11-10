"use client";

import { useState } from "react";
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

// Mock data - replace with actual API call
const mockTransferRequests: TransferRequest[] = [
  {
    id: "TR001",
    studentId: "AD9892302",
    studentName: "Aaliyah Griffin",
    studentAdmissionNumber: "AD9892302",
    studentClass: "JSS 1",
    studentSection: "A",
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
  const [requests, setRequests] = useState<TransferRequest[]>(mockTransferRequests);
  const [selectedRequest, setSelectedRequest] = useState<TransferRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<TransferStatus | "all">("all");
  const [filterType, setFilterType] = useState<TransferType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesType = filterType === "all" || request.transferType === filterType;
    const matchesSearch = searchQuery === "" ||
      request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.studentAdmissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: "approved",
            approvedBy: "current-user",
            approvedByName: "Current User",
            approvedDate: new Date().toISOString(),
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
            status: "rejected",
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
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: "completed",
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
              {
                label: "Refresh",
                icon: RefreshCw,
                onClick: () => window.location.reload(),
                variant: "primary",
              },
            ]}
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
          {
            label: "Type Filter",
            value: filterType,
            onChange: (value) => setFilterType(value as TransferType | "all"),
            options: [
              { label: "All Types", value: "all" },
              { label: "Section Change", value: "section-change" },
              { label: "Class Change", value: "class-change" },
              { label: "Internal Transfer", value: "internal" },
              { label: "Cross-Branch", value: "cross-branch" },
              { label: "External Transfer", value: "external" },
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
