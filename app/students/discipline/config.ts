import type { FilterField, SortOption, StatCardConfig, FilterValues } from "@/types/components";
import type { DisciplineIncident } from "@/types/discipline";
import {
  AlertTriangle,
  Clock,
  Search,
  CheckCircle,
  AlertOctagon,
  AlertCircle,
} from "lucide-react";

// Filter fields configuration
export const disciplineFilterFields: FilterField[] = [
  {
    id: "class",
    label: "Class",
    options: [
      { value: "JSS 1", label: "JSS 1" },
      { value: "JSS 2", label: "JSS 2" },
      { value: "JSS 3", label: "JSS 3" },
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
    id: "category",
    label: "Category",
    options: [
      { value: "disruptive-behavior", label: "Disruptive Behavior" },
      { value: "attendance", label: "Attendance" },
      { value: "academic-dishonesty", label: "Academic Dishonesty" },
      { value: "bullying", label: "Bullying" },
      { value: "violence", label: "Violence" },
      { value: "property-damage", label: "Property Damage" },
      { value: "substance-abuse", label: "Substance Abuse" },
      { value: "dress-code", label: "Dress Code" },
      { value: "technology-misuse", label: "Technology Misuse" },
      { value: "other", label: "Other" },
    ],
    width: "full",
  },
  {
    id: "severity",
    label: "Severity",
    options: [
      { value: "minor", label: "Minor" },
      { value: "moderate", label: "Moderate" },
      { value: "major", label: "Major" },
      { value: "critical", label: "Critical" },
    ],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: [
      { value: "reported", label: "Reported" },
      { value: "under-review", label: "Under Review" },
      { value: "resolved", label: "Resolved" },
      { value: "appealed", label: "Appealed" },
      { value: "closed", label: "Closed" },
    ],
    width: "half",
  },
];

// Sort options configuration
export const disciplineSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "name_asc", label: "Student A-Z" },
  { id: "name_desc", label: "Student Z-A" },
  { id: "severity_high", label: "Severity (High-Low)" },
  { id: "severity_low", label: "Severity (Low-High)" },
];

// Stats configuration
export const disciplineStats: StatCardConfig<DisciplineIncident>[] = [
  {
    icon: AlertTriangle,
    label: "Total Cases",
    getValue: (data) => data.length,
    color: "blue",
  },
  {
    icon: Clock,
    label: "Reported",
    getValue: (data) => data.filter((i) => i.status === "reported").length,
    color: "orange",
  },
  {
    icon: Search,
    label: "Investigating",
    getValue: (data) =>
      data.filter(
        (i) =>
          i.status === "under-review" ||
          i.status === "investigating"
      ).length,
    color: "blue",
  },
  {
    icon: CheckCircle,
    label: "Resolved",
    getValue: (data) => data.filter((i) => i.status === "resolved").length,
    color: "green",
  },
  {
    icon: AlertOctagon,
    label: "Critical",
    getValue: (data) => data.filter((i) => i.severity === "critical").length,
    color: "red",
  },
  {
    icon: AlertCircle,
    label: "Serious",
    getValue: (data) =>
      data.filter((i) => i.severity === "serious" || i.severity === "major")
        .length,
    color: "orange",
  },
];

// Severity order for sorting
const severityOrder: Record<string, number> = {
  critical: 4,
  major: 3,
  serious: 3,
  moderate: 2,
  minor: 1,
};

// Filter function
export const filterDisciplineIncidents = (
  data: DisciplineIncident[],
  filters: FilterValues
): DisciplineIncident[] => {
  return data.filter((incident) => {
    const hasFilters = Object.values(filters).some(
      (values) => values && values.length > 0
    );
    if (!hasFilters) return true;

    const matchesCategory =
      !filters.category ||
      filters.category.length === 0 ||
      filters.category.includes(incident.category);

    const matchesSeverity =
      !filters.severity ||
      filters.severity.length === 0 ||
      filters.severity.includes(incident.severity);

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.includes(incident.status);

    const matchesClass =
      !filters.class ||
      filters.class.length === 0 ||
      filters.class.includes(incident.studentClass);

    const matchesYear =
      !filters.year ||
      filters.year.length === 0 ||
      filters.year.includes(
        new Date(incident.incidentDate).getFullYear().toString()
      );

    return (
      matchesCategory &&
      matchesSeverity &&
      matchesStatus &&
      matchesClass &&
      matchesYear
    );
  });
};

// Sort function
export const sortDisciplineIncidents = (
  data: DisciplineIncident[],
  sortOption: string
): DisciplineIncident[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.incidentDate).getTime() -
          new Date(a.incidentDate).getTime()
        );
      case "oldest":
        return (
          new Date(a.incidentDate).getTime() -
          new Date(b.incidentDate).getTime()
        );
      case "name_asc":
        return a.studentName.localeCompare(b.studentName);
      case "name_desc":
        return b.studentName.localeCompare(a.studentName);
      case "severity_high":
        return (
          (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0)
        );
      case "severity_low":
        return (
          (severityOrder[a.severity] || 0) - (severityOrder[b.severity] || 0)
        );
      default:
        return 0;
    }
  });
};
