import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import type { StaffTransferRequest } from "@/types/staffTransfer";
import { Users, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";

// Filter fields configuration
export const transferFilterFields: FilterField[] = [
  {
    id: "status",
    label: "Status",
    options: [
      "pending",
      "approved",
      "in-progress",
      "completed",
      "rejected",
      "cancelled",
    ],
    width: "half",
  },
  {
    id: "transferType",
    label: "Transfer Type",
    options: ["department", "branch", "designation", "location"],
    width: "half",
  },
  {
    id: "department",
    label: "Department",
    options: [
      "Mathematics",
      "English",
      "Science",
      "ICT",
      "Biology",
      "Sports",
    ],
    width: "half",
  },
  {
    id: "branch",
    label: "Branch",
    options: ["Main Campus", "Annex Campus", "Lekki Campus"],
    width: "half",
  },
];

// Sort options configuration
export const transferSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "name_asc", label: "Name A-Z" },
  { id: "name_desc", label: "Name Z-A" },
];

// Stats configuration
export const transferStats: StatCardConfig<StaffTransferRequest>[] = [
  {
    icon: Users,
    label: "Total Requests",
    getValue: (data) => data.length,
    color: "blue",
  },
  {
    icon: Clock,
    label: "Pending Approval",
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
    icon: AlertCircle,
    label: "In Progress",
    getValue: (data) => data.filter((r) => r.status === "in-progress").length,
    color: "blue",
  },
  {
    icon: TrendingUp,
    label: "Completed",
    getValue: (data) => data.filter((r) => r.status === "completed").length,
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
export const filterTransferRequests = (
  data: StaffTransferRequest[],
  filters: Record<string, string[]>
): StaffTransferRequest[] => {
  return data.filter((request) => {
    const hasFilters = Object.values(filters).some(
      (values) => values && values.length > 0
    );
    if (!hasFilters) return true;

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.includes(request.status);

    const matchesType =
      !filters.transferType ||
      filters.transferType.length === 0 ||
      filters.transferType.includes(request.transferType);

    const matchesDepartment =
      !filters.department ||
      filters.department.length === 0 ||
      filters.department.includes(request.currentDepartment);

    const matchesBranch =
      !filters.branch ||
      filters.branch.length === 0 ||
      filters.branch.includes(request.currentBranch);

    return matchesStatus && matchesType && matchesDepartment && matchesBranch;
  });
};

// Sort function
export const sortTransferRequests = (
  data: StaffTransferRequest[],
  sortOption: string
): StaffTransferRequest[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.requestedAt).getTime() -
          new Date(a.requestedAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.requestedAt).getTime() -
          new Date(b.requestedAt).getTime()
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
export const searchTransferRequests = (
  data: StaffTransferRequest[],
  query: string
): StaffTransferRequest[] => {
  if (!query) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(
    (request) =>
      request.staffName.toLowerCase().includes(lowerQuery) ||
      request.staffEmail.toLowerCase().includes(lowerQuery) ||
      request.id.toLowerCase().includes(lowerQuery)
  );
};
