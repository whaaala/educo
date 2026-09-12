"use client";

import { Clock, Zap, CheckCircle, AlertCircle, Star, Sparkles } from "lucide-react";
import { PerformanceReview } from "@/types/performance";
import StatCard, { StatCardColor } from "@/components/shared/StatCard";

interface PerformanceStatisticsCardsProps {
  reviews: PerformanceReview[];
}

export default function PerformanceStatisticsCards({ reviews }: PerformanceStatisticsCardsProps) {
  const stats = {
    total: reviews.length,
    scheduled: reviews.filter(r => r.status === "scheduled").length,
    inProgress: reviews.filter(r => r.status === "in-progress").length,
    completed: reviews.filter(r => r.status === "completed").length,
    overdue: reviews.filter(r => r.status === "overdue").length,
    averageRating: reviews.filter(r => r.status === "completed").length > 0
      ? reviews.filter(r => r.status === "completed").reduce((sum, r) => sum + r.averageScore, 0) / reviews.filter(r => r.status === "completed").length
      : 0,
    outstanding: reviews.filter(r => r.overallRating === "outstanding").length,
  };

  const cards: Array<{ label: string; value: number | string; icon: typeof Star; color: StatCardColor }> = [
    {
      label: "Total Reviews",
      value: stats.total,
      icon: Star,
      color: "blue",
    },
    {
      label: "Scheduled",
      value: stats.scheduled,
      icon: Clock,
      color: "amber",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Zap,
      color: "blue",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "red",
    },
    {
      label: "Avg Rating",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: "purple",
    },
    {
      label: "Outstanding",
      value: stats.outstanding,
      icon: Sparkles,
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          color={card.color}
        />
      ))}
    </div>
  );
}
