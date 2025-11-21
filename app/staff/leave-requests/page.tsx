"use client";

import { useState, useEffect } from "react";
import {
  Download,
} from "lucide-react";
import { LeaveRequest, LeaveStatus, LeaveType } from "@/types/leave";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import LeaveRequestsTable from "@/components/leave/LeaveRequestsTable";
import LeaveStatisticsCards from "@/components/leave/LeaveStatisticsCards";
import LeaveRequestDetailModal from "@/components/leave/LeaveRequestDetailModal";
import { useLeaves } from "@/contexts/LeaveContext";
import { exportLeaveRequestsToExcel, exportLeaveRequestsToPDF } from "@/lib/export-utils";

// Mock data - replace with actual API call
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "LR001",
    staffId: "STF001",
    staffName: "Mrs. Sarah Johnson",
    staffEmail: "sarah.johnson@school.com",
    staffDepartment: "Mathematics",
    staffPosition: "Senior Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    leaveType: "Annual Leave",
    startDate: "2024-12-20",
    endDate: "2024-12-27",
    numberOfDays: 8,
    reason: "Family vacation during Christmas holidays",
    requestedDate: "2024-11-15",
    status: "pending",
    priority: "normal",
    managerId: "MGR001",
    managerName: "Dr. Adeyemi - Principal",
    createdAt: "2024-11-15T10:30:00Z",
    updatedAt: "2024-11-15T10:30:00Z",
  },
  {
    id: "LR002",
    staffId: "STF002",
    staffName: "Mr. David Chen",
    staffEmail: "david.chen@school.com",
    staffDepartment: "Science",
    staffPosition: "Biology Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=12",
    leaveType: "Medical Leave",
    startDate: "2024-11-20",
    endDate: "2024-11-22",
    numberOfDays: 3,
    reason: "Medical checkup and follow-up appointment",
    requestedDate: "2024-11-10",
    status: "approved",
    priority: "high",
    managerId: "MGR001",
    managerName: "Dr. Adeyemi - Principal",
    approvedBy: "MGR001",
    approvedByName: "Dr. Adeyemi",
    approvedDate: "2024-11-11T14:20:00Z",
    createdAt: "2024-11-10T09:15:00Z",
    updatedAt: "2024-11-11T14:20:00Z",
  },
  {
    id: "LR003",
    staffId: "STF003",
    staffName: "Miss Amaka Okafor",
    staffEmail: "amaka.okafor@school.com",
    staffDepartment: "English",
    staffPosition: "English Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=9",
    leaveType: "Casual Leave",
    startDate: "2024-11-05",
    endDate: "2024-11-05",
    numberOfDays: 1,
    reason: "Personal family matter",
    requestedDate: "2024-11-03",
    status: "rejected",
    priority: "normal",
    managerId: "MGR001",
    managerName: "Dr. Adeyemi - Principal",
    rejectedBy: "MGR001",
    rejectedByName: "Dr. Adeyemi",
    rejectionReason: "Insufficient coverage for classes during this period. Please reschedule.",
    rejectionDate: "2024-11-04T11:00:00Z",
    createdAt: "2024-11-03T13:45:00Z",
    updatedAt: "2024-11-04T11:00:00Z",
  },
];

export default function LeaveRequestsPage() {
  const { requests: contextRequests, updateLeaveRequest } = useLeaves();
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<LeaveStatus | "all">("all");
  const [filterType, setFilterType] = useState<LeaveType | "all">("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize with mock data and merge with context requests
  useEffect(() => {
    console.log("Leave Requests Page: Context requests changed", contextRequests);
    // Merge context requests with mock requests, avoiding duplicates
    const merged = [
      ...contextRequests,
      ...mockLeaveRequests.filter(
        mock => !contextRequests.some(ctx => ctx.id === mock.id)
      )
    ];
    console.log("Leave Requests Page: Merged requests", merged);

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
    const matchesType = filterType === "all" || request.leaveType === filterType;

    // Extract year from requested date
    const requestYear = new Date(request.requestedDate).getFullYear().toString();
    const matchesYear = filterYear === "all" || requestYear === filterYear;

    const matchesSearch = searchQuery === "" ||
      request.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.staffPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesYear && matchesSearch;
  });

  const handleApprove = (requestId: string) => {
    console.log("Page handleApprove called", { requestId });

    // Update in context (which syncs to localStorage)
    updateLeaveRequest(requestId, {
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
    updateLeaveRequest(requestId, {
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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with Breadcrumbs and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <PageHeader
            title="Leave Requests"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Staff", href: "/staff" },
              { label: "Leave Requests", isActive: true },
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
            onExportPDF={() => exportLeaveRequestsToPDF(filteredRequests, "leave-requests")}
            onExportExcel={() => exportLeaveRequestsToExcel(filteredRequests, "leave-requests")}
            exportDescription="Download leave requests data"
          />
        </div>

      {/* Statistics Cards */}
      <LeaveStatisticsCards requests={requests} />

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by staff name, position, or request ID..."
        filters={[
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
            onChange: (value) => setFilterType(value as LeaveType | "all"),
            options: [
              { label: "All Types", value: "all" },
              { label: "Annual Leave", value: "Annual Leave" },
              { label: "Medical Leave", value: "Medical Leave" },
              { label: "Casual Leave", value: "Casual Leave" },
              { label: "Maternity Leave", value: "Maternity Leave" },
              { label: "Paternity Leave", value: "Paternity Leave" },
              { label: "Special Leave", value: "Special Leave" },
              { label: "Sick Leave", value: "Sick Leave" },
              { label: "Study Leave", value: "Study Leave" },
              { label: "Bereavement Leave", value: "Bereavement Leave" },
              { label: "Unpaid Leave", value: "Unpaid Leave" },
            ],
          },
          {
            label: "Status Filter",
            value: filterStatus,
            onChange: (value) => setFilterStatus(value as LeaveStatus | "all"),
            options: [
              { label: "All Status", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
        ]}
      />

      {/* Leave Requests Table */}
      <LeaveRequestsTable
        requests={filteredRequests}
        onViewDetails={(request) => setSelectedRequest(request)}
        onApprove={handleApprove}
        onReject={handleReject}
        filterKey={`${filterStatus}-${filterType}-${searchQuery}`}
      />

      {/* Detail Modal */}
      {selectedRequest && (
        <LeaveRequestDetailModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
      </div>
    </MainLayout>
  );
}
