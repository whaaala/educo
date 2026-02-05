import type { FilterField, SortOption } from "@/types/components";
import type { Student } from "@/components/students/StudentCard";
import { detectEducationLevelFromClass } from "@/utils/educationLevel";

// Sort options configuration
export const studentSortOptions: SortOption[] = [
  { id: "ascending", label: "Ascending" },
  { id: "descending", label: "Descending" },
  { id: "recently_viewed", label: "Recently Viewed" },
  { id: "recently_added", label: "Recently Added" },
];

// Parse date string in format "DD MMM YYYY" to Date object
export const parseJoinedOnDate = (dateStr: string): Date | null => {
  try {
    const months: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const parts = dateStr.trim().split(" ");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    if (isNaN(day) || month === undefined || isNaN(year)) return null;
    return new Date(year, month, day);
  } catch {
    return null;
  }
};

// Parse date string in format "MM/DD/YYYY" to Date object
export const parseDateRangeDate = (dateStr: string): Date | null => {
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

// Sort function for students
export const sortStudents = (data: Student[], sortOption: string): Student[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "ascending":
        return a.name.localeCompare(b.name);
      case "descending":
        return b.name.localeCompare(a.name);
      case "recently_viewed":
        return b.id.localeCompare(a.id);
      case "recently_added": {
        const dateA = parseJoinedOnDate(a.joinedOn);
        const dateB = parseJoinedOnDate(b.joinedOn);
        if (!dateA || !dateB) return 0;
        return dateB.getTime() - dateA.getTime();
      }
      default: {
        const defaultDateA = parseJoinedOnDate(a.joinedOn);
        const defaultDateB = parseJoinedOnDate(b.joinedOn);
        if (!defaultDateA || !defaultDateB) return 0;
        return defaultDateA.getTime() - defaultDateB.getTime();
      }
    }
  });
};

// Filter function for students
export const filterStudents = (
  data: Student[],
  filters: Record<string, string[]>,
  dateRange?: { start: string | null; end: string | null } | null
): Student[] => {
  return data.filter((student) => {
    // Check date range filter
    if (dateRange && dateRange.start && dateRange.end) {
      const joinedDate = parseJoinedOnDate(student.joinedOn);
      const startDate = parseDateRangeDate(dateRange.start);
      const endDate = parseDateRangeDate(dateRange.end);

      if (joinedDate && startDate && endDate) {
        const joinedDateNormalized = new Date(joinedDate.getFullYear(), joinedDate.getMonth(), joinedDate.getDate());
        const startDateNormalized = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateNormalized = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        if (joinedDateNormalized < startDateNormalized || joinedDateNormalized > endDateNormalized) {
          return false;
        }
      }
    }

    // If no filters are active, show all
    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters) return true;

    const matchesClass =
      !filters.class || filters.class.length === 0 ||
      filters.class.some((cls) => student.class.startsWith(cls));

    const matchesSection =
      !filters.section || filters.section.length === 0 ||
      filters.section.some((section) => student.class.includes(section));

    const matchesName =
      !filters.name || filters.name.length === 0 ||
      filters.name.some((range) => {
        const firstLetter = student.name.charAt(0).toUpperCase();
        if (range === "A-E") return firstLetter >= "A" && firstLetter <= "E";
        if (range === "F-J") return firstLetter >= "F" && firstLetter <= "J";
        if (range === "K-O") return firstLetter >= "K" && firstLetter <= "O";
        if (range === "P-T") return firstLetter >= "P" && firstLetter <= "T";
        if (range === "U-Z") return firstLetter >= "U" && firstLetter <= "Z";
        return false;
      });

    const matchesGender =
      !filters.gender || filters.gender.length === 0 || filters.gender.includes(student.gender);

    const matchesStatus =
      !filters.status || filters.status.length === 0 || filters.status.includes(student.status);

    const matchesEducationLevel =
      !filters.educationLevel || filters.educationLevel.length === 0 ||
      filters.educationLevel.some((level) => {
        const studentLevel = student.educationLevel || detectEducationLevelFromClass(student.class);
        return studentLevel === level;
      });

    const matchesBranch =
      !filters.branch || filters.branch.length === 0 ||
      filters.branch.some((branch) => {
        const studentBranch = student.branch || "Main Campus";
        return studentBranch === branch;
      });

    return matchesClass && matchesSection && matchesName && matchesGender && matchesStatus && matchesEducationLevel && matchesBranch;
  });
};

// Dynamic filter fields based on feature flags and settings
export const getStudentFilterFields = (options: {
  canUseBranchHierarchy: boolean;
  supportsMultipleLevels: boolean;
  isSuperAdmin: boolean;
  supportedLevels: string[];
}): FilterField[] => {
  return [
    ...(options.canUseBranchHierarchy ? [{
      id: "branch",
      label: "Branch/Campus",
      options: ["Main Campus", "North Campus", "South Campus", "East Campus", "West Campus"],
      width: "full" as const,
    }] : []),
    {
      id: "class",
      label: "Class",
      options: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"],
      width: "half",
    },
    {
      id: "section",
      label: "Section",
      options: ["A", "B"],
      width: "half",
    },
    ...(options.supportsMultipleLevels && options.isSuperAdmin ? [{
      id: "educationLevel",
      label: "Education Level",
      options: options.supportedLevels,
      width: "full" as const,
    }] : []),
    {
      id: "name",
      label: "Name",
      options: ["A-E", "F-J", "K-O", "P-T", "U-Z"],
      width: "full",
    },
    {
      id: "gender",
      label: "Gender",
      options: ["Male", "Female"],
      width: "half",
    },
    {
      id: "status",
      label: "Status",
      options: ["Active", "Inactive"],
      width: "half",
    },
  ];
};

// Helper to get consistent color for a name (for avatar backgrounds)
export const getRandomColor = (name: string): string => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
