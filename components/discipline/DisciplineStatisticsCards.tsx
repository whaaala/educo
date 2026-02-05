"use client";

import { AlertTriangle, Clock, Search, CheckCircle, AlertOctagon, AlertCircle } from "lucide-react";
import { DisciplinaryAction, DisciplineIncident } from "@/types/discipline";
import StatCard, { StatCardColor } from "@/components/shared/StatCard";

interface DisciplineStatisticsCardsProps {
  actions?: DisciplinaryAction[];
  incidents?: DisciplineIncident[];
}

export default function DisciplineStatisticsCards({ actions = [], incidents = [] }: DisciplineStatisticsCardsProps) {
  // Support both staff actions and student incidents
  const data = actions.length > 0 ? actions : incidents;
  const stats = {
    total: data.length,
    reported: data.filter(a => a.status === "reported").length,
    investigating: data.filter(a => a.status === "under-investigation" || a.status === "under-review" || a.status === "investigating").length,
    resolved: data.filter(a => a.status === "resolved").length,
    critical: data.filter(a => a.severity === "critical").length,
    serious: data.filter(a => a.severity === "serious" || a.severity === "major").length,
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
