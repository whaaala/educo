"use client";

import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { StaffTransferRequest, TransferStatus, TransferType } from "@/types/staffTransfer";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import StaffTransferTable from "@/components/staff/transfers/StaffTransferTable";
import StaffTransferStatisticsCards from "@/components/staff/transfers/StaffTransferStatisticsCards";
import NewTransferRequestModal from "@/components/staff/transfers/NewTransferRequestModal";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { exportStaffTransfersToPDF, exportStaffTransfersToExcel } from "@/utils/exportStaffTransfers";

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
  const isLoading = usePageLoad(600);
  const [requests, setRequests] = useState<StaffTransferRequest[]>(mockTransferRequests);
  const [selectedRequest, setSelectedRequest] = useState<StaffTransferRequest | null>(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TransferStatus | "all">("all");
  const [filterType, setFilterType] = useState<TransferType | "all">("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesType = filterType === "all" || request.transferType === filterType;
    const matchesDepartment = filterDepartment === "all" || request.currentDepartment === filterDepartment;
    const matchesBranch = filterBranch === "all" || request.currentBranch === filterBranch;

    const matchesSearch = searchQuery === "" ||
      request.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.staffEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesDepartment && matchesBranch && matchesSearch;
  });

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
    <MainLayout>
      <PageLoader isLoading={isLoading} loadingText="Loading Staff Transfers" />

      <div
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="space-y-6">
          {/* Header with Breadcrumbs and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <PageHeader
              title="Staff Transfers"
              breadcrumbs={[
                { label: "Dashboard", href: "/" },
                { label: "Staff", href: "/staff" },
                { label: "Transfer Requests", isActive: true },
              ]}
            />
            <PageActions
              actions={[
                {
                  label: "New Transfer Request",
                  icon: Plus,
                  onClick: () => setIsNewRequestModalOpen(true),
                  variant: "primary",
                },
                {
                  label: "Export",
                  icon: Download,
                  onClick: () => console.log("Export clicked"),
                  variant: "secondary",
                },
              ]}
              onExportPDF={() => exportStaffTransfersToPDF(filteredRequests)}
              onExportExcel={() => exportStaffTransfersToExcel(filteredRequests)}
              exportDescription="Download staff transfer requests data"
            />
          </div>

          {/* Statistics Cards */}
          <StaffTransferStatisticsCards requests={requests} />

          {/* Search and Filters */}
          <SearchFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by staff name, email, or transfer ID..."
            filters={[
              {
                label: "Status",
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
                label: "Transfer Type",
                value: filterType,
                onChange: (value) => setFilterType(value as TransferType | "all"),
                options: [
                  { label: "All Types", value: "all" },
                  { label: "Department", value: "department" },
                  { label: "Branch", value: "branch" },
                  { label: "Designation", value: "designation" },
                  { label: "Location", value: "location" },
                ],
              },
              {
                label: "Department",
                value: filterDepartment,
                onChange: (value) => setFilterDepartment(value as string),
                options: [
                  { label: "All Departments", value: "all" },
                  { label: "Mathematics", value: "Mathematics" },
                  { label: "English", value: "English" },
                  { label: "Science", value: "Science" },
                  { label: "ICT", value: "ICT" },
                  { label: "Biology", value: "Biology" },
                  { label: "Sports", value: "Sports" },
                ],
              },
              {
                label: "Branch",
                value: filterBranch,
                onChange: (value) => setFilterBranch(value as string),
                options: [
                  { label: "All Branches", value: "all" },
                  { label: "Main Campus", value: "Main Campus" },
                  { label: "Annex Campus", value: "Annex Campus" },
                  { label: "Lekki Campus", value: "Lekki Campus" },
                ],
              },
            ]}
          />

          {/* Transfer Requests Table */}
          <StaffTransferTable
            requests={filteredRequests}
            onViewDetails={(request) => setSelectedRequest(request)}
            onApprove={handleApprove}
            onReject={handleReject}
            onProcess={handleProcess}
            filterKey={`${filterStatus}-${filterType}-${searchQuery}`}
          />
        </div>
      </div>

      {/* New Transfer Request Modal */}
      <NewTransferRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        onSubmit={(data) => {
          console.log("New transfer request submitted:", data);
          // Here you would typically add the new request to the list
          // For now, just log it
        }}
      />
    </MainLayout>
  );
}
