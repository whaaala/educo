"use client";

import { Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Users } from "lucide-react";
import { TransferRequest } from "@/types/transfer";
import StatCard, { StatCardColor } from "@/components/shared/StatCard";

interface TransferStatisticsCardsProps {
  requests: TransferRequest[];
}

export default function TransferStatisticsCards({ requests }: TransferStatisticsCardsProps) {
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    completed: requests.filter(r => r.status === "completed").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    inProgress: requests.filter(r => r.status === "in-progress").length,
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
      label: "Completed",
      value: stats.completed,
      icon: TrendingUp,
      color: "emerald",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: AlertCircle,
      color: "orange",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "red",
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
