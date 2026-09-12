import type { FilterField, SortOption } from "@/types/components";
import type { Teacher } from "@/lib/mockTeachers";

// Staff categories for filtering
export const getStaffCategories = (staff: Teacher[]) => [
  { value: "all", label: "All Personnel", count: staff.length },
  { value: "Academic Staff", label: "Academic Staff", count: staff.filter(s => s.jobCategory === "Academic Staff").length },
  { value: "Non-Academic Staff", label: "Administrative", count: staff.filter(s => s.jobCategory === "Non-Academic Staff").length },
  { value: "Finance & Accounting", label: "Finance", count: staff.filter(s => s.jobCategory === "Finance & Accounting").length },
  { value: "Technical & ICT", label: "ICT", count: staff.filter(s => s.jobCategory === "Technical & ICT").length },
  { value: "Operations & Facility", label: "Operations", count: staff.filter(s => s.jobCategory === "Operations & Facility").length },
];

// Filter fields configuration
export const staffFilterFields: FilterField[] = [
  {
    id: "department",
    label: "Department",
    options: ["Administration", "IT", "HR", "Finance", "Operations"],
    width: "half",
  },
  {
    id: "role",
    label: "Role",
    options: ["Admin", "Support", "Management"],
    width: "half",
  },
  {
    id: "employmentType",
    label: "Employment Type",
    options: ["Full-Time", "Part-Time", "Contract"],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: ["Active", "On Leave", "Suspended", "Terminated"],
    width: "half",
  },
];

// Sort options configuration
export const staffSortOptions: SortOption[] = [
  { id: "ascending", label: "Ascending" },
  { id: "descending", label: "Descending" },
  { id: "recently_added", label: "Recently Added" },
];

// Parse date helper for date range filtering
export const parseDate = (dateStr: string): Date | null => {
  try {
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    const month = parseInt(parts[0]) - 1;
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
    return new Date(year, month, day);
  } catch {
    return null;
  }
};

// Helper function to get consistent color for a name
export const getRandomColor = (name: string): string => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Sort function for staff
export const sortStaff = (data: Teacher[], sortOption: string): Teacher[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "ascending":
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case "descending":
        return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
      case "recently_added":
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      default:
        return 0;
    }
  });
};

// Category filter function
export const filterByCategory = (data: Teacher[], category: string): Teacher[] => {
  if (category === "all") return data;
  return data.filter(s => s.jobCategory === category);
};

// Filter function for staff (compatible with DataManagementPage filterFn signature)
export const filterStaff = (
  data: Teacher[],
  filters: Record<string, string[]>,
): Teacher[] => {
  return data.filter((staffMember) => {
    // Check other filters
    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters) return true;

    const matchesDepartment = !filters.department || filters.department.length === 0 || filters.department.includes(staffMember.department);
    const matchesRole = !filters.role || filters.role.length === 0 || filters.role.includes(staffMember.role);
    const matchesEmploymentType = !filters.employmentType || filters.employmentType.length === 0 || filters.employmentType.includes(staffMember.employmentType);
    const matchesStatus = !filters.status || filters.status.length === 0 || filters.status.includes(staffMember.employmentStatus);

    return matchesDepartment && matchesRole && matchesEmploymentType && matchesStatus;
  });
};
