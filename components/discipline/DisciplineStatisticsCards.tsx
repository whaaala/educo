"use client";

import { AlertTriangle, Clock, Search, CheckCircle, AlertOctagon, AlertCircle } from "lucide-react";
import { DisciplinaryAction } from "@/types/discipline";
import StatCard, { StatCardColor } from "@/components/shared/StatCard";

interface DisciplineStatisticsCardsProps {
  actions: DisciplinaryAction[];
}

export default function DisciplineStatisticsCards({ actions = [] }: DisciplineStatisticsCardsProps) {
  const stats = {
    total: actions.length,
    reported: actions.filter(a => a.status === "reported").length,
    investigating: actions.filter(a => a.status === "under-investigation").length,
    resolved: actions.filter(a => a.status === "resolved").length,
    critical: actions.filter(a => a.severity === "critical").length,
    serious: actions.filter(a => a.severity === "serious").length,
  };

  const cards: Array<{ label: string; value: number; icon: typeof AlertTriangle; color: StatCardColor }> = [
    {
      label: "Total Cases",
      value: stats.total,
      icon: AlertTriangle,
      color: "blue",
    },
    {
      label: "Reported",
      value: stats.reported,
      icon: Clock,
      color: "amber",
    },
    {
      label: "Investigating",
      value: stats.investigating,
      icon: Search,
      color: "blue",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Critical",
      value: stats.critical,
      icon: AlertOctagon,
      color: "red",
    },
    {
      label: "Serious",
      value: stats.serious,
      icon: AlertCircle,
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
