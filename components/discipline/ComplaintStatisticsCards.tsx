"use client";

import { MessageSquare, FileText, Eye, Search, CheckCircle, AlertTriangle, UserX } from "lucide-react";
import { Complaint } from "@/types/discipline";
import StatCard, { StatCardColor } from "@/components/shared/StatCard";

interface ComplaintStatisticsCardsProps {
  complaints: Complaint[];
}

export default function ComplaintStatisticsCards({ complaints = [] }: ComplaintStatisticsCardsProps) {
  const stats = {
    total: complaints.length,
    submitted: complaints.filter(c => c.status === "submitted").length,
    reviewing: complaints.filter(c => c.status === "reviewing").length,
    investigating: complaints.filter(c => c.status === "investigating").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    urgent: complaints.filter(c => c.priority === "urgent").length,
    anonymous: complaints.filter(c => c.isAnonymous).length,
  };

  const cards: Array<{ label: string; value: number; icon: typeof MessageSquare; color: StatCardColor }> = [
    {
      label: "Total",
      value: stats.total,
      icon: MessageSquare,
      color: "blue",
    },
    {
      label: "Submitted",
      value: stats.submitted,
      icon: FileText,
      color: "amber",
    },
    {
      label: "Reviewing",
      value: stats.reviewing,
      icon: Eye,
      color: "purple",
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
      label: "Urgent",
      value: stats.urgent,
      icon: AlertTriangle,
      color: "red",
    },
    {
      label: "Anonymous",
      value: stats.anonymous,
      icon: UserX,
      color: "gray",
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
