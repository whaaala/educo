import type { FilterField, SortOption, StatCardConfig, FilterValues } from "@/types/components";
import type { TransferRequest } from "@/types/transfer";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
} from "lucide-react";

// Filter fields configuration
export const transferFilterFields: FilterField[] = [
  {
    id: "class",
    label: "Class",
    options: [
      { value: "JSS 1", label: "JSS 1" },
      { value: "JSS 2", label: "JSS 2" },
      { value: "JSS 3", label: "JSS 3" },
      { value: "Primary 1", label: "Primary 1" },
      { value: "Primary 2", label: "Primary 2" },
      { value: "SS 1", label: "SS 1" },
      { value: "SS 2", label: "SS 2" },
      { value: "SS 3", label: "SS 3" },
    ],
    width: "half",
  },
  {
    id: "year",
    label: "Year",
    options: [
      { value: "2025", label: "2025" },
      { value: "2024", label: "2024" },
      { value: "2023", label: "2023" },
      { value: "2022", label: "2022" },
    ],
    width: "half",
  },
  {
    id: "type",
    label: "Type",
    options: [
      { value: "section-change", label: "Section Change" },
      { value: "class-change", label: "Class Change" },
      { value: "internal", label: "Internal Transfer" },
      { value: "promotion", label: "Promotion" },
      { value: "cross-branch", label: "Cross-Branch" },
      { value: "external", label: "External Transfer" },
    ],
    width: "full",
  },
  {
    id: "status",
    label: "Status",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "in-progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
      { value: "rejected", label: "Rejected" },
      { value: "cancelled", label: "Cancelled" },
    ],
    width: "full",
  },
];

// Sort options configuration
export const transferSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "name_asc", label: "Student A-Z" },
  { id: "name_desc", label: "Student Z-A" },
];

// Stats configuration
export const transferStats: StatCardConfig<TransferRequest>[] = [
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
    color: "orange",
  },
  {
    icon: CheckCircle,
    label: "Approved",
    getValue: (data) => data.filter((r) => r.status === "approved").length,
    color: "green",
  },
  {
    icon: TrendingUp,
    label: "Completed",
    getValue: (data) => data.filter((r) => r.status === "completed").length,
    color: "green",
  },
  {
    icon: AlertCircle,
    label: "In Progress",
    getValue: (data) => data.filter((r) => r.status === "in-progress").length,
    color: "orange",
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
  data: TransferRequest[],
  filters: FilterValues
): TransferRequest[] => {
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
      !filters.type ||
      filters.type.length === 0 ||
      filters.type.includes(request.transferType);

    const matchesClass =
      !filters.class ||
      filters.class.length === 0 ||
      filters.class.includes(request.studentClass);

    const matchesYear =
      !filters.year ||
      filters.year.length === 0 ||
      filters.year.includes(
        new Date(request.requestedDate).getFullYear().toString()
      );

    return matchesStatus && matchesType && matchesClass && matchesYear;
  });
};

// Sort function
export const sortTransferRequests = (
  data: TransferRequest[],
  sortOption: string
): TransferRequest[] => {
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
        return a.studentName.localeCompare(b.studentName);
      case "name_desc":
        return b.studentName.localeCompare(a.studentName);
      default:
        return 0;
    }
  });
};
