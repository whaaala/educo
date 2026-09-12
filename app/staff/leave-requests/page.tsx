"use client";

import { useState, useEffect } from "react";
import { LeaveRequest } from "@/types/leave";
import DataManagementPage from "@/components/pages/DataManagementPage";
import LeaveRequestsTable from "@/components/leave/LeaveRequestsTable";
import LeaveRequestDetailModal from "@/components/leave/LeaveRequestDetailModal";
import { useLeaves } from "@/contexts/LeaveContext";
import { exportLeaveRequestsToExcel, exportLeaveRequestsToPDF } from "@/lib/export-utils";
import {
  leaveFilterFields,
  leaveSortOptions,
  leaveStats,
  filterLeaveRequests,
  sortLeaveRequests,
  searchLeaveRequests,
} from "./config";

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

  // Initialize with mock data and merge with context requests
  useEffect(() => {
    console.log("Leave Requests Page: Context requests changed", contextRequests);
    const merged = [
      ...contextRequests,
      ...mockLeaveRequests.filter(
        mock => !contextRequests.some(ctx => ctx.id === mock.id)
      )
    ];
    console.log("Leave Requests Page: Merged requests", merged);

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
    console.log("Page handleApprove called", { requestId });

    updateLeaveRequest(requestId, {
      status: "approved",
      approvedBy: "current-user",
      approvedByName: "Current User",
      approvedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

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
    updateLeaveRequest(requestId, {
      status: "rejected",
      rejectedBy: "current-user",
      rejectedByName: "Current User",
      rejectionReason: reason,
      rejectionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

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
    <DataManagementPage<LeaveRequest>
      title="Leave Requests"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Staff", href: "/staff" },
        { label: "Leave Requests", isActive: true },
      ]}
      data={requests}
      getRowKey={(item) => item.id}
      columns={[]}
      stats={leaveStats}
      statsColumns={{ default: 1, sm: 2, md: 4, lg: 4 }}
      filterFields={leaveFilterFields}
      sortOptions={leaveSortOptions}
      filterFn={filterLeaveRequests}
      sortFn={sortLeaveRequests}
      searchFn={searchLeaveRequests}
      onExportPDF={(items) => exportLeaveRequestsToPDF(items, "leave-requests")}
      onExportExcel={(items) => exportLeaveRequestsToExcel(items, "leave-requests")}
      enableViewToggle={false}
      enableSelection={false}
      enablePagination={false}
      showTableSearch={false}
      itemLabel="leave request"
      itemLabelPlural="leave requests"
      customListComponent={
        <LeaveRequestsTable
          requests={requests}
          onViewDetails={(request) => setSelectedRequest(request)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      }
    >
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
    </DataManagementPage>
  );
}
