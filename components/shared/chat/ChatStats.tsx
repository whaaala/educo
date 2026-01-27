"use client";

import { MessageCircle, Circle, MessageSquare, Users } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { ChatStats as ChatStatsType } from "./types";

export interface ChatStatsProps {
  stats: ChatStatsType;
  recipientLabel?: string; // e.g., "Parents", "Teachers"
}

export default function ChatStats({ stats, recipientLabel = "Recipients" }: ChatStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-100 ease-out">
      <StatCard
        icon={MessageCircle}
        label="Total Chats"
        value={stats.total.toString()}
        color="blue"
      />
      <StatCard
        icon={Circle}
        label="Active Now"
        value={stats.active.toString()}
        color="green"
        badge={`${stats.active} Online`}
      />
      <StatCard
        icon={MessageSquare}
        label="Unread Chats"
        value={stats.unread.toString()}
        color="purple"
        badge={stats.totalUnreadMessages > 0 ? `${stats.totalUnreadMessages} messages` : undefined}
      />
      <StatCard
        icon={Users}
        label={recipientLabel}
        value={stats.total.toString()}
        color="amber"
      />
    </div>
  );
}

// Helper function to calculate chat stats
export function calculateChatStats(
  conversations: Array<{ isOnline: boolean; unreadCount: number }>
): ChatStatsType {
  const total = conversations.length;
  const active = conversations.filter((c) => c.isOnline).length;
  const unread = conversations.filter((c) => c.unreadCount > 0).length;
  const totalUnreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  return { total, active, unread, totalUnreadMessages };
}
