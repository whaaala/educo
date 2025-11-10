"use client";

import { DisciplineIncident } from "@/types/discipline";
import StatCard, { StatCardColor } from "@/components/shared/StatCard";
import { FileText, AlertCircle, AlertTriangle, ShieldAlert, Users, TrendingUp } from "lucide-react";

interface DisciplineStatisticsCardsProps {
  incidents: DisciplineIncident[];
}

export default function DisciplineStatisticsCards({ incidents }: DisciplineStatisticsCardsProps) {
  const stats = {
    total: incidents.length,
    minor: incidents.filter(i => i.severity === "minor").length,
    moderate: incidents.filter(i => i.severity === "moderate").length,
    major: incidents.filter(i => i.severity === "major").length,
    critical: incidents.filter(i => i.severity === "critical").length,
    active: incidents.filter(i => i.status === "reported" || i.status === "under-review").length,
    resolved: incidents.filter(i => i.status === "resolved" || i.status === "closed").length,
    uniqueStudents: new Set(incidents.map(i => i.studentId)).size,
  };

  const cards: Array<{ label: string; value: number; icon: typeof FileText; color: StatCardColor }> = [
    {
      label: "Total Incidents",
      value: stats.total,
      icon: FileText,
      color: "blue",
    },
    {
      label: "Active Cases",
      value: stats.active,
      icon: TrendingUp,
      color: "orange",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: ShieldAlert,
      color: "green",
    },
    {
      label: "Students Involved",
      value: stats.uniqueStudents,
      icon: Users,
      color: "purple",
    },
    {
      label: "Minor",
      value: stats.minor,
      icon: AlertCircle,
      color: "amber",
    },
    {
      label: "Moderate",
      value: stats.moderate,
      icon: AlertTriangle,
      color: "orange",
    },
    {
      label: "Major",
      value: stats.major,
      icon: ShieldAlert,
      color: "red",
    },
    {
      label: "Critical",
      value: stats.critical,
      icon: ShieldAlert,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
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
