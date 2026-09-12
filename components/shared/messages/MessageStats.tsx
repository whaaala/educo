"use client";

import { MessageSquare, Inbox, Send, AlertCircle } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { MessageStats as MessageStatsType } from "./types";

export interface MessageStatsProps {
  stats: MessageStatsType;
}

export default function MessageStats({ stats }: MessageStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-100 ease-out">
      <StatCard
        icon={MessageSquare}
        label="Total Messages"
        value={stats.total.toString()}
        color="blue"
      />
      <StatCard
        icon={Inbox}
        label="Received"
        value={stats.received.toString()}
        color="purple"
        badge={stats.unread > 0 ? `${stats.unread} Unread` : undefined}
      />
      <StatCard
        icon={Send}
        label="Sent"
        value={stats.sent.toString()}
        color="green"
      />
      <StatCard
        icon={AlertCircle}
        label="High Priority"
        value={stats.highPriority.toString()}
        color={stats.highPriority > 0 ? "red" : "amber"}
      />
    </div>
  );
}

// Helper function to calculate message stats
export function calculateMessageStats(messages: Array<{ type: string; isRead: boolean; priority: string }>): MessageStatsType {
  const total = messages.length;
  const received = messages.filter((m) => m.type === "received").length;
  const sent = messages.filter((m) => m.type === "sent").length;
  const unread = messages.filter((m) => !m.isRead && m.type === "received").length;
  const highPriority = messages.filter((m) => m.priority === "high").length;
  return { total, received, sent, unread, highPriority };
}
