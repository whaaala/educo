"use client";

import { useMemo } from "react";
import { FileText, Clock, CheckCircle, Package, XCircle, DollarSign, Calendar } from "lucide-react";
import { TranscriptRequest, TranscriptStatistics } from "@/types/transcript";
import StatCard from "@/components/shared/StatCard";

interface TranscriptStatisticsCardsProps {
  requests: TranscriptRequest[];
}

export default function TranscriptStatisticsCards({ requests }: TranscriptStatisticsCardsProps) {
  const stats: TranscriptStatistics = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const processing = requests.filter((r) => r.status === "processing").length;
    const ready = requests.filter((r) => r.status === "ready").length;
    const delivered = requests.filter((r) => r.status === "delivered").length;
    const rejected = requests.filter((r) => r.status === "rejected").length;
    const unpaid = requests.filter((r) => r.payment.status === "unpaid").length;

    // Delivered this month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const deliveredThisMonth = requests.filter((r) => {
      if (!r.deliveredDate) return false;
      const deliveryDate = new Date(r.deliveredDate);
      return (
        deliveryDate.getMonth() === currentMonth && deliveryDate.getFullYear() === currentYear
      );
    }).length;

    // Revenue this month
    const revenueThisMonth = requests
      .filter((r) => {
        if (!r.payment.paymentDate) return false;
        const paymentDate = new Date(r.payment.paymentDate);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear &&
          r.payment.status === "paid"
        );
      })
      .reduce((sum, r) => sum + r.payment.amount, 0);

    return {
      total,
      pending,
      processing,
      ready,
      delivered,
      rejected,
      unpaid,
      deliveredThisMonth,
      revenueThisMonth,
    };
  }, [requests]);

  const cards = [
    {
      label: "Total Requests",
      value: stats.total,
      icon: FileText,
      color: "blue" as const,
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "amber" as const,
    },
    {
      label: "Processing",
      value: stats.processing,
      icon: Package,
      color: "indigo" as const,
    },
    {
      label: "Ready",
      value: stats.ready,
      icon: CheckCircle,
      color: "green" as const,
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      color: "emerald" as const,
    },
    {
      label: "Unpaid",
      value: stats.unpaid,
      icon: XCircle,
      color: "red" as const,
    },
    {
      label: "This Month",
      value: stats.deliveredThisMonth,
      icon: Calendar,
      color: "purple" as const,
    },
    {
      label: "Revenue (MTD)",
      value: `₦${stats.revenueThisMonth.toLocaleString()}`,
      icon: DollarSign,
      color: "green" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
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
