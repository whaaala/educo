import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import type { StaffAttendanceRecord } from "@/types/staffAttendance";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Coffee,
  FileText,
  Home,
} from "lucide-react";

// Filter fields configuration
export const attendanceFilterFields: FilterField[] = [
  {
    id: "department",
    label: "Department",
    options: ["Mathematics", "English", "Science", "Administration", "IT"],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: [
      "present",
      "absent",
      "late",
      "half-day",
      "on-leave",
      "work-from-home",
    ],
    width: "half",
  },
];

// Sort options configuration
export const attendanceSortOptions: SortOption[] = [
  { id: "name_asc", label: "Name A-Z" },
  { id: "name_desc", label: "Name Z-A" },
  { id: "department", label: "Department" },
];

// Stats configuration
export const attendanceStats: StatCardConfig<StaffAttendanceRecord>[] = [
  {
    icon: Users,
    label: "Total Staff",
    getValue: (data) => data.length,
    color: "blue",
  },
  {
    icon: CheckCircle,
    label: "Present",
    getValue: (data) => data.filter((r) => r.status === "present").length,
    color: "green",
  },
  {
    icon: XCircle,
    label: "Absent",
    getValue: (data) => data.filter((r) => r.status === "absent").length,
    color: "red",
  },
  {
    icon: Clock,
    label: "Late",
    getValue: (data) => data.filter((r) => r.status === "late").length,
    color: "orange",
  },
  {
    icon: Coffee,
    label: "Half Day",
    getValue: (data) => data.filter((r) => r.status === "half-day").length,
    color: "amber",
  },
  {
    icon: FileText,
    label: "On Leave",
    getValue: (data) => data.filter((r) => r.status === "on-leave").length,
    color: "purple",
  },
  {
    icon: Home,
    label: "WFH",
    getValue: (data) =>
      data.filter((r) => r.status === "work-from-home").length,
    color: "teal",
  },
];

// Filter function
export const filterAttendanceRecords = (
  data: StaffAttendanceRecord[],
  filters: Record<string, string[]>
): StaffAttendanceRecord[] => {
  return data.filter((record) => {
    const hasFilters = Object.values(filters).some(
      (values) => values && values.length > 0
    );
    if (!hasFilters) return true;

    const matchesDepartment =
      !filters.department ||
      filters.department.length === 0 ||
      filters.department.includes(record.department);

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.includes(record.status);

    return matchesDepartment && matchesStatus;
  });
};

// Sort function
export const sortAttendanceRecords = (
  data: StaffAttendanceRecord[],
  sortOption: string
): StaffAttendanceRecord[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "name_asc":
        return a.staffName.localeCompare(b.staffName);
      case "name_desc":
        return b.staffName.localeCompare(a.staffName);
      case "department":
        return a.department.localeCompare(b.department);
      default:
        return 0;
    }
  });
};

// Search function
export const searchAttendanceRecords = (
  data: StaffAttendanceRecord[],
  query: string
): StaffAttendanceRecord[] => {
  if (!query) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(
    (record) =>
      record.staffName.toLowerCase().includes(lowerQuery) ||
      record.staffEmail.toLowerCase().includes(lowerQuery) ||
      record.staffId.toLowerCase().includes(lowerQuery)
  );
};
