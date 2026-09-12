import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import type { PerformanceReview } from "@/types/performance";
import { Star, Clock, Zap, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

// Filter fields configuration
export const performanceFilterFields: FilterField[] = [
  {
    id: "year",
    label: "Year",
    options: ["2025", "2024", "2023"],
    width: "half",
  },
  {
    id: "period",
    label: "Review Period",
    options: ["quarterly", "half-yearly", "annual", "probation"],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: ["scheduled", "in-progress", "completed", "overdue"],
    width: "half",
  },
];

// Sort options configuration
export const performanceSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "name_asc", label: "Name A-Z" },
  { id: "name_desc", label: "Name Z-A" },
  { id: "highest_score", label: "Highest Score" },
  { id: "lowest_score", label: "Lowest Score" },
];

// Stats configuration
export const performanceStats: StatCardConfig<PerformanceReview>[] = [
  {
    icon: Star,
    label: "Total Reviews",
    getValue: (data) => data.length,
    color: "blue",
  },
  {
    icon: Clock,
    label: "Scheduled",
    getValue: (data) => data.filter((r) => r.status === "scheduled").length,
    color: "amber",
  },
  {
    icon: Zap,
    label: "In Progress",
    getValue: (data) => data.filter((r) => r.status === "in-progress").length,
    color: "blue",
  },
  {
    icon: CheckCircle,
    label: "Completed",
    getValue: (data) => data.filter((r) => r.status === "completed").length,
    color: "green",
  },
  {
    icon: AlertCircle,
    label: "Overdue",
    getValue: (data) => data.filter((r) => r.status === "overdue").length,
    color: "red",
  },
  {
    icon: Star,
    label: "Avg Rating",
    getValue: (data) => {
      const completed = data.filter((r) => r.status === "completed");
      if (completed.length === 0) return "0.0";
      return (
        completed.reduce((sum, r) => sum + r.averageScore, 0) / completed.length
      ).toFixed(1);
    },
    color: "purple",
  },
  {
    icon: Sparkles,
    label: "Outstanding",
    getValue: (data) =>
      data.filter((r) => r.overallRating === "outstanding").length,
    color: "amber",
  },
];

// Filter function
export const filterPerformanceReviews = (
  data: PerformanceReview[],
  filters: Record<string, string[]>
): PerformanceReview[] => {
  return data.filter((review) => {
    const hasFilters = Object.values(filters).some(
      (values) => values && values.length > 0
    );
    if (!hasFilters) return true;

    const matchesYear =
      !filters.year ||
      filters.year.length === 0 ||
      filters.year.includes(review.reviewYear);

    const matchesPeriod =
      !filters.period ||
      filters.period.length === 0 ||
      filters.period.includes(review.reviewPeriod);

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.includes(review.status);

    return matchesYear && matchesPeriod && matchesStatus;
  });
};

// Sort function
export const sortPerformanceReviews = (
  data: PerformanceReview[],
  sortOption: string
): PerformanceReview[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
        );
      case "oldest":
        return (
          new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime()
        );
      case "name_asc":
        return a.staffName.localeCompare(b.staffName);
      case "name_desc":
        return b.staffName.localeCompare(a.staffName);
      case "highest_score":
        return b.averageScore - a.averageScore;
      case "lowest_score":
        return a.averageScore - b.averageScore;
      default:
        return 0;
    }
  });
};

// Search function
export const searchPerformanceReviews = (
  data: PerformanceReview[],
  query: string
): PerformanceReview[] => {
  if (!query) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(
    (review) =>
      review.staffName.toLowerCase().includes(lowerQuery) ||
      review.staffPosition.toLowerCase().includes(lowerQuery) ||
      review.id.toLowerCase().includes(lowerQuery)
  );
};
