import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import { CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react";

export type LeaveStatus = "approved" | "pending" | "declined";
export type LeaveType = "Medical" | "Family" | "Personal" | "Religious" | "Sports" | "Other";

export interface ChildLeaveRequest {
  id: string;
  childId: string;
  childName: string;
  childPhoto?: string;
  classLevel: string;
  reason: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  remarks?: string;
  documents?: string[];
}

export interface Child {
  id: string;
  name: string;
  classLevel: string;
  section: string;
  photo: string;
}

export const leaveSortOptions: SortOption[] = [
  { id: "applied_newest", label: "Applied (Newest)" },
  { id: "applied_oldest", label: "Applied (Oldest)" },
  { id: "from_newest", label: "From Date (Newest)" },
  { id: "from_oldest", label: "From Date (Oldest)" },
  { id: "child_asc", label: "Child (A-Z)" },
  { id: "status", label: "Status" },
  { id: "type", label: "Type" },
];

export function getLeaveFilterFields(children: Child[]): FilterField[] {
  return [
    {
      id: "childId",
      label: "Child",
      options: children.map((c) => ({ value: c.id, label: c.name })),
      width: "half",
    },
    {
      id: "status",
      label: "Status",
      options: ["approved", "pending", "declined"],
      width: "half",
    },
    {
      id: "leaveType",
      label: "Type",
      options: ["Medical", "Family", "Personal", "Religious", "Sports", "Other"],
      width: "half",
    },
  ];
}

export const filterLeaves = (
  data: ChildLeaveRequest[],
  filters: Record<string, string[]>
): ChildLeaveRequest[] => {
  const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
  if (!hasFilters) return data;

  return data.filter((leave) => {
    const matchesChild =
      !filters.childId || filters.childId.length === 0 || filters.childId.includes(leave.childId);

    const matchesStatus =
      !filters.status || filters.status.length === 0 || filters.status.includes(leave.status);

    const matchesType =
      !filters.leaveType ||
      filters.leaveType.length === 0 ||
      filters.leaveType.includes(leave.leaveType);

    return matchesChild && matchesStatus && matchesType;
  });
};

export const sortLeaves = (data: ChildLeaveRequest[], sortOption: string): ChildLeaveRequest[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "applied_newest":
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      case "applied_oldest":
        return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
      case "from_newest":
        return new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime();
      case "from_oldest":
        return new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime();
      case "child_asc":
        return a.childName.localeCompare(b.childName);
      case "status":
        return a.status.localeCompare(b.status);
      case "type":
        return a.leaveType.localeCompare(b.leaveType);
      default:
        return 0;
    }
  });
};

export const searchLeaves = (data: ChildLeaveRequest[], query: string): ChildLeaveRequest[] => {
  const q = query.toLowerCase();
  return data.filter(
    (leave) =>
      leave.reason.toLowerCase().includes(q) ||
      leave.childName.toLowerCase().includes(q) ||
      leave.leaveType.toLowerCase().includes(q)
  );
};

export const getLeaveStats = (): StatCardConfig<ChildLeaveRequest>[] => [
  {
    icon: CalendarDays,
    label: "Total Leaves",
    color: "blue",
    getValue: (data) => data.length.toString(),
  },
  {
    icon: CheckCircle2,
    label: "Approved",
    color: "green",
    getValue: (data) => data.filter((l) => l.status === "approved").length.toString(),
  },
  {
    icon: Clock,
    label: "Pending",
    color: "amber",
    getValue: (data) => data.filter((l) => l.status === "pending").length.toString(),
  },
  {
    icon: XCircle,
    label: "Declined",
    color: "red",
    getValue: (data) => data.filter((l) => l.status === "declined").length.toString(),
  },
];

