import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import type { LeaveRequest } from "@/types/leave";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";

// Filter fields configuration
export const leaveFilterFields: FilterField[] = [
  {
    id: "year",
    label: "Year",
    options: ["2025", "2024", "2023", "2022"],
    width: "half",
  },
  {
    id: "leaveType",
    label: "Leave Type",
    options: [
      "Annual Leave",
      "Medical Leave",
      "Casual Leave",
      "Maternity Leave",
      "Paternity Leave",
      "Special Leave",
      "Sick Leave",
      "Study Leave",
      "Bereavement Leave",
      "Unpaid Leave",
    ],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: ["pending", "approved", "rejected", "cancelled"],
    width: "half",
  },
];

// Sort options configuration
export const leaveSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "name_asc", label: "Name A-Z" },
  { id: "name_desc", label: "Name Z-A" },
];

// Stats configuration
export const leaveStats: StatCardConfig<LeaveRequest>[] = [
  {
    icon: Users,
    label: "Total Requests",
    getValue: (data) => data.length,
    color: "blue",
  },
  {
    icon: Clock,
    label: "Pending",
    getValue: (data) => data.filter((r) => r.status === "pending").length,
    color: "amber",
  },
  {
    icon: CheckCircle,
    label: "Approved",
    getValue: (data) => data.filter((r) => r.status === "approved").length,
    color: "green",
  },
  {
    icon: XCircle,
    label: "Rejected",
    getValue: (data) => data.filter((r) => r.status === "rejected").length,
    color: "red",
  },
];

// Filter function
export const filterLeaveRequests = (
  data: LeaveRequest[],
  filters: Record<string, string[]>
): LeaveRequest[] => {
  return data.filter((request) => {
    const hasFilters = Object.values(filters).some(
      (values) => values && values.length > 0
    );
    if (!hasFilters) return true;

    const requestYear = new Date(request.requestedDate)
      .getFullYear()
      .toString();

    const matchesYear =
      !filters.year || filters.year.length === 0 || filters.year.includes(requestYear);

    const matchesType =
      !filters.leaveType ||
      filters.leaveType.length === 0 ||
      filters.leaveType.includes(request.leaveType);

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.includes(request.status);

    return matchesYear && matchesType && matchesStatus;
  });
};

// Sort function
export const sortLeaveRequests = (
  data: LeaveRequest[],
  sortOption: string
): LeaveRequest[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.requestedDate).getTime() -
          new Date(a.requestedDate).getTime()
        );
      case "oldest":
        return (
          new Date(a.requestedDate).getTime() -
          new Date(b.requestedDate).getTime()
        );
      case "name_asc":
        return a.staffName.localeCompare(b.staffName);
      case "name_desc":
        return b.staffName.localeCompare(a.staffName);
      default:
        return 0;
    }
  });
};

// Search function
export const searchLeaveRequests = (
  data: LeaveRequest[],
  query: string
): LeaveRequest[] => {
  if (!query) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(
    (request) =>
      request.staffName.toLowerCase().includes(lowerQuery) ||
      request.staffPosition.toLowerCase().includes(lowerQuery) ||
      request.id.toLowerCase().includes(lowerQuery)
  );
};
