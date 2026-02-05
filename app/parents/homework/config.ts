import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import { BookOpen, Clock, ClipboardList, CheckCircle2, AlertTriangle } from "lucide-react";

export interface Homework {
  id: string;
  childId: string;
  childName: string;
  childPhoto: string;
  class: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  teacher: string;
  assignedDate: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  submissionDate?: string;
  grade?: string;
  score?: number;
  maxScore?: number;
  feedback?: string;
}

export const homeworkSortOptions: SortOption[] = [
  { id: "due_soon", label: "Due Soonest" },
  { id: "due_late", label: "Due Latest" },
  { id: "assigned_newest", label: "Assigned (Newest)" },
  { id: "assigned_oldest", label: "Assigned (Oldest)" },
  { id: "child_asc", label: "Child (A-Z)" },
  { id: "subject_asc", label: "Subject (A-Z)" },
  { id: "status", label: "Status" },
];

export function getHomeworkFilterFields(data: Homework[]): FilterField[] {
  const children = Array.from(
    new Map(
      data.map((hw) => [hw.childId, { value: hw.childId, label: hw.childName }])
    ).values()
  );

  const subjects = Array.from(new Set(data.map((hw) => hw.subject))).sort((a, b) =>
    a.localeCompare(b)
  );

  const years = Array.from(
    new Set(data.map((hw) => new Date(hw.dueDate).getFullYear().toString()))
  ).sort((a, b) => b.localeCompare(a));

  return [
    { id: "childId", label: "Child", options: children, width: "half" },
    { id: "year", label: "Year", options: years, width: "half" },
    { id: "subject", label: "Subject", options: subjects, width: "half" },
    {
      id: "status",
      label: "Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "submitted", label: "Submitted" },
        { value: "graded", label: "Graded" },
        { value: "overdue", label: "Overdue" },
      ],
      width: "half",
    },
  ];
}

export const filterHomework = (
  data: Homework[],
  filters: Record<string, string[]>
): Homework[] => {
  return data.filter((hw) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters) return true;

    const dueYear = new Date(hw.dueDate).getFullYear().toString();

    const matchesChild =
      !filters.childId ||
      filters.childId.length === 0 ||
      filters.childId.includes(hw.childId);

    const matchesYear =
      !filters.year || filters.year.length === 0 || filters.year.includes(dueYear);

    const matchesSubject =
      !filters.subject ||
      filters.subject.length === 0 ||
      filters.subject.includes(hw.subject);

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.includes(hw.status);

    return matchesChild && matchesYear && matchesSubject && matchesStatus;
  });
};

export const sortHomework = (data: Homework[], sortOption: string): Homework[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "due_soon":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "due_late":
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      case "assigned_newest":
        return new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime();
      case "assigned_oldest":
        return new Date(a.assignedDate).getTime() - new Date(b.assignedDate).getTime();
      case "child_asc":
        return a.childName.localeCompare(b.childName);
      case "subject_asc":
        return a.subject.localeCompare(b.subject);
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
};

export const searchHomework = (data: Homework[], query: string): Homework[] => {
  const q = query.toLowerCase();
  return data.filter(
    (hw) =>
      hw.title.toLowerCase().includes(q) ||
      hw.subject.toLowerCase().includes(q) ||
      hw.teacher.toLowerCase().includes(q) ||
      hw.childName.toLowerCase().includes(q)
  );
};

export const getHomeworkStats = (): StatCardConfig<Homework>[] => [
  {
    icon: BookOpen,
    label: "Total",
    color: "blue",
    getValue: (data) => data.length.toString(),
  },
  {
    icon: Clock,
    label: "Pending",
    color: "amber",
    getValue: (data) => data.filter((hw) => hw.status === "pending").length.toString(),
  },
  {
    icon: ClipboardList,
    label: "Submitted",
    color: "indigo",
    getValue: (data) => data.filter((hw) => hw.status === "submitted").length.toString(),
  },
  {
    icon: CheckCircle2,
    label: "Graded",
    color: "green",
    getValue: (data) => data.filter((hw) => hw.status === "graded").length.toString(),
  },
  {
    icon: AlertTriangle,
    label: "Overdue",
    color: "red",
    getValue: (data) => data.filter((hw) => hw.status === "overdue").length.toString(),
  },
];

