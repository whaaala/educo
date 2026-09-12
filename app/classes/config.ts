import type { FilterField, SortOption } from "@/types/components";

// Type for class data (matches ClassTable's ClassData export)
export interface ClassData {
  id: string;
  name: string;
  level: "Primary" | "Secondary" | "Junior Secondary" | "Tertiary";
  section?: string;
  subjects?: { name: string; teacher: { id: string; name: string; image: string; subject?: string } }[];
  teachers?: { id: string; name: string; image: string; subject?: string }[];
  students: number;
  capacity: number;
  room: string;
  schedule?: string;
  academicYear: string;
  term?: string;
  status: "Active" | "Inactive" | "Archived";
  averageGrade?: number;
  attendanceRate?: number;
  stream?: string;
  faculty?: string;
  department?: string;
  programme?: string;
  courseLevel?: string;
  semester?: string;
  branch?: string;
  classTeacher?: { id: string; name: string; image: string };
  maxStudents?: number;
  enabledFeatures?: {
    lms?: boolean;
    digitalDiary?: boolean;
    transport?: boolean;
    hostel?: boolean;
    rfid?: boolean;
    onlineClasses?: boolean;
    library?: boolean;
    gradebook?: boolean;
  };
  transportZone?: string;
  hostelEligibility?: boolean;
}

// Dynamic filter fields based on settings
export const getClassFilterFields = (supportedLevels: string[]): FilterField[] => [
  {
    id: "level",
    label: "Education Level",
    options: supportedLevels.includes("Primary")
      ? ["Primary", "Junior Secondary", "Secondary", "Tertiary"]
      : supportedLevels,
    width: "half",
  },
  {
    id: "section",
    label: "Section",
    options: ["A", "B", "C"],
    width: "half",
  },
  {
    id: "academicYear",
    label: "Academic Year",
    options: ["2024/2025", "2023/2024", "2022/2023"],
    width: "half",
  },
  {
    id: "term",
    label: "Term/Semester",
    options: supportedLevels.includes("Tertiary")
      ? ["First Term", "Second Term", "Third Term", "First Semester", "Second Semester", "SIWES"]
      : ["First Term", "Second Term", "Third Term"],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: ["Active", "Inactive", "Archived"],
    width: "full",
  },
];

// Sort options
export const classSortOptions: SortOption[] = [
  { id: "ascending", label: "Ascending" },
  { id: "descending", label: "Descending" },
  { id: "recently_added", label: "Recently Added" },
];

// Sort function
export const sortClasses = (data: ClassData[], sortOption: string): ClassData[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "ascending":
        return a.name.localeCompare(b.name);
      case "descending":
        return b.name.localeCompare(a.name);
      case "recently_added":
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });
};

// Filter function
export const filterClasses = (
  data: ClassData[],
  filters: Record<string, string[]>,
): ClassData[] => {
  return data.filter((cls) => {
    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters) return true;

    const matchesLevel = !filters.level || filters.level.length === 0 || filters.level.includes(cls.level);
    const matchesSection = !filters.section || filters.section.length === 0 || filters.section.includes(cls.section || "");
    const matchesStatus = !filters.status || filters.status.length === 0 || filters.status.includes(cls.status);
    const matchesAcademicYear = !filters.academicYear || filters.academicYear.length === 0 || filters.academicYear.includes(cls.academicYear);
    const matchesTerm = !filters.term || filters.term.length === 0 ||
      filters.term.includes(cls.term || "") ||
      filters.term.includes(cls.semester || "");

    return matchesLevel && matchesSection && matchesStatus && matchesAcademicYear && matchesTerm;
  });
};

// Filter by tenant supported levels
export const filterByTenantLevels = (data: ClassData[], supportedLevels: string[]): ClassData[] => {
  if (!supportedLevels || supportedLevels.length === 0) return [];
  return data.filter((cls) => supportedLevels.some(level => level === cls.level));
};
