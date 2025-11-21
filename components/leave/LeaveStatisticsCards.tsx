"use client";

import { Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Users } from "lucide-react";
import { LeaveRequest } from "@/types/leave";
import StatCard, { StatCardColor } from "@/components/shared/StatCard";

interface LeaveStatisticsCardsProps {
  requests: LeaveRequest[];
}

export default function LeaveStatisticsCards({ requests }: LeaveStatisticsCardsProps) {
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    cancelled: requests.filter(r => r.status === "cancelled").length,
  };

  const cards: Array<{ label: string; value: number; icon: typeof Users; color: StatCardColor }> = [
    {
      label: "Total Requests",
      value: stats.total,
      icon: Users,
      color: "blue",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "amber",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
