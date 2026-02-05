import type { FilterField, SortOption } from "@/types/components";

// Discipline tab filter fields
export const disciplineFilterFields: FilterField[] = [
  {
    id: "status",
    label: "Status",
    options: [
      "reported",
      "under-investigation",
      "resolved",
      "closed",
      "escalated",
    ],
    width: "half",
  },
  {
    id: "severity",
    label: "Severity",
    options: ["minor", "moderate", "serious", "critical"],
    width: "half",
  },
];

// Complaints tab filter fields
export const complaintsFilterFields: FilterField[] = [
  {
    id: "status",
    label: "Status",
    options: [
      "submitted",
      "reviewing",
      "investigating",
      "resolved",
      "closed",
      "rejected",
    ],
    width: "half",
  },
  {
    id: "priority",
    label: "Priority",
    options: ["low", "medium", "high", "urgent"],
    width: "half",
  },
];

// Sort options (shared between both tabs)
export const disciplineSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "name_asc", label: "Name A-Z" },
  { id: "name_desc", label: "Name Z-A" },
];
