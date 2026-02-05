import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import { BookOpen, Target, CheckCircle2, Trophy } from "lucide-react";

export interface ExamResult {
  id: string;
  childId: string;
  childName: string;
  childPhoto: string;
  class: string;
  section: string;
  examType: string;
  examDate: string;
  academicYear: string;
  term: string;
  percentage: number;
  status: "pass" | "fail";
}

export const resultSortOptions: SortOption[] = [
  { id: "date_newest", label: "Exam Date (Newest)" },
  { id: "date_oldest", label: "Exam Date (Oldest)" },
  { id: "score_high", label: "Score (Highest)" },
  { id: "score_low", label: "Score (Lowest)" },
  { id: "child_asc", label: "Child (A-Z)" },
  { id: "exam_asc", label: "Exam Type (A-Z)" },
  { id: "status", label: "Status" },
];

export function getResultFilterFields(data: ExamResult[]): FilterField[] {
  const children = Array.from(
    new Map(data.map((r) => [r.childId, { value: r.childId, label: r.childName }])).values()
  );

  const years = Array.from(new Set(data.map((r) => r.academicYear))).sort((a, b) =>
    b.localeCompare(a)
  );

  const terms = Array.from(new Set(data.map((r) => r.term))).sort((a, b) => a.localeCompare(b));

  const examTypes = Array.from(new Set(data.map((r) => r.examType))).sort((a, b) =>
    a.localeCompare(b)
  );

  return [
    { id: "childId", label: "Child", options: children, width: "half" },
    { id: "academicYear", label: "Year", options: years, width: "half" },
    { id: "examType", label: "Exam Type", options: examTypes, width: "half" },
    { id: "term", label: "Term", options: terms, width: "half" },
  ];
}

export const filterResults = (
  data: ExamResult[],
  filters: Record<string, string[]>
): ExamResult[] => {
  return data.filter((r) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters) return true;

    const matchesChild =
      !filters.childId || filters.childId.length === 0 || filters.childId.includes(r.childId);

    const matchesYear =
      !filters.academicYear ||
      filters.academicYear.length === 0 ||
      filters.academicYear.includes(r.academicYear);

    const matchesExamType =
      !filters.examType || filters.examType.length === 0 || filters.examType.includes(r.examType);

    const matchesTerm = !filters.term || filters.term.length === 0 || filters.term.includes(r.term);

    return matchesChild && matchesYear && matchesExamType && matchesTerm;
  });
};

export const sortResults = (data: ExamResult[], sortOption: string): ExamResult[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "date_newest":
        return new Date(b.examDate).getTime() - new Date(a.examDate).getTime();
      case "date_oldest":
        return new Date(a.examDate).getTime() - new Date(b.examDate).getTime();
      case "score_high":
        return b.percentage - a.percentage;
      case "score_low":
        return a.percentage - b.percentage;
      case "child_asc":
        return a.childName.localeCompare(b.childName);
      case "exam_asc":
        return a.examType.localeCompare(b.examType);
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
};

export const searchResults = (data: ExamResult[], query: string): ExamResult[] => {
  const q = query.toLowerCase();
  return data.filter(
    (r) =>
      r.childName.toLowerCase().includes(q) ||
      r.examType.toLowerCase().includes(q) ||
      r.class.toLowerCase().includes(q) ||
      r.term.toLowerCase().includes(q) ||
      r.academicYear.toLowerCase().includes(q)
  );
};

export const getResultStats = (): StatCardConfig<ExamResult>[] => [
  {
    icon: BookOpen,
    label: "Total Exams",
    color: "blue",
    getValue: (data) => data.length.toString(),
  },
  {
    icon: Target,
    label: "Average Score",
    color: "indigo",
    getValue: (data) => {
      if (data.length === 0) return "0%";
      const avg = Math.round(data.reduce((sum, r) => sum + r.percentage, 0) / data.length);
      return `${avg}%`;
    },
  },
  {
    icon: CheckCircle2,
    label: "Passed",
    color: "green",
    getValue: (data) => {
      const passCount = data.filter((r) => r.status === "pass").length;
      return `${passCount}/${data.length}`;
    },
  },
  {
    icon: Trophy,
    label: "Highest Score",
    color: "amber",
    getValue: (data) => {
      if (data.length === 0) return "0%";
      const highest = Math.max(...data.map((r) => r.percentage));
      return `${highest}%`;
    },
  },
];

