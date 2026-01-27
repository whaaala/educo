"use client";

import { Phone, Video, PhoneCall, PhoneMissed, Clock } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { CallLogStats as CallLogStatsType, CallLog, formatDuration } from "./types";

export interface CallLogStatsProps {
  stats: CallLogStatsType;
}

export default function CallLogStats({ stats }: CallLogStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-100 ease-out">
      <StatCard
        icon={PhoneCall}
        label="Total Calls"
        value={stats.total.toString()}
        color="blue"
      />
      <StatCard
        icon={Video}
        label="Video Calls"
        value={stats.videoCalls.toString()}
        color="purple"
      />
      <StatCard
        icon={Phone}
        label="Voice Calls"
        value={stats.voiceCalls.toString()}
        color="green"
      />
      <StatCard
        icon={PhoneMissed}
        label="Missed"
        value={stats.missed.toString()}
        color={stats.missed > 0 ? "red" : "amber"}
      />
      <div className="col-span-2 sm:col-span-1">
        <StatCard
          icon={Clock}
          label="Total Duration"
          value={formatDuration(stats.totalDuration)}
          color="amber"
        />
      </div>
    </div>
  );
}

// Helper function to calculate call log stats
export function calculateCallLogStats(calls: CallLog[]): CallLogStatsType {
  const total = calls.length;
  const videoCalls = calls.filter((c) => c.callType === "video").length;
  const voiceCalls = calls.filter((c) => c.callType === "voice").length;
  const completed = calls.filter((c) => c.callStatus === "completed").length;
  const missed = calls.filter((c) => c.callStatus === "missed" || c.callStatus === "no_answer").length;
  const totalDuration = calls
    .filter((c) => c.duration)
    .reduce((sum, c) => sum + (c.duration || 0), 0);
  return { total, videoCalls, voiceCalls, completed, missed, totalDuration };
}
