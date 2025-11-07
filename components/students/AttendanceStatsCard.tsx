"use client";

import { UserCheck, UserX, Clock, UserMinus } from "lucide-react";

interface AttendanceStatsCardProps {
  type: "present" | "absent" | "halfday" | "late";
  count: number;
}

export default function AttendanceStatsCard({ type, count }: AttendanceStatsCardProps) {
  const variants = {
    present: {
      icon: UserCheck,
      label: "Present",
      bg: "bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/15 midnight:from-blue-950/20 midnight:to-indigo-950/15 purple:from-blue-950/20 purple:to-indigo-950/15",
      border: "border-blue-200/50 dark:border-blue-900/30 midnight:border-blue-900/30 purple:border-blue-900/30",
      iconBg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
      textColor: "text-blue-900 dark:text-blue-200 midnight:text-blue-200 purple:text-blue-200",
      countColor: "text-blue-700 dark:text-blue-300 midnight:text-blue-300 purple:text-blue-300",
    },
    absent: {
      icon: UserX,
      label: "Absent",
      bg: "bg-gradient-to-br from-red-50/80 to-rose-50/60 dark:from-red-950/20 dark:to-rose-950/15 midnight:from-red-950/20 midnight:to-rose-950/15 purple:from-red-950/20 purple:to-rose-950/15",
      border: "border-red-200/50 dark:border-red-900/30 midnight:border-red-900/30 purple:border-red-900/30",
      iconBg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
      textColor: "text-red-900 dark:text-red-200 midnight:text-red-200 purple:text-red-200",
      countColor: "text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300",
    },
    halfday: {
      icon: UserMinus,
      label: "Half Day",
      bg: "bg-gradient-to-br from-cyan-50/80 to-sky-50/60 dark:from-cyan-950/20 dark:to-sky-950/15 midnight:from-cyan-950/20 midnight:to-sky-950/15 purple:from-cyan-950/20 purple:to-sky-950/15",
      border: "border-cyan-200/50 dark:border-cyan-900/30 midnight:border-cyan-900/30 purple:border-cyan-900/30",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400",
      textColor: "text-cyan-900 dark:text-cyan-200 midnight:text-cyan-200 purple:text-cyan-200",
      countColor: "text-cyan-700 dark:text-cyan-300 midnight:text-cyan-300 purple:text-cyan-300",
    },
    late: {
      icon: Clock,
      label: "Late",
      bg: "bg-gradient-to-br from-amber-50/80 to-yellow-50/60 dark:from-amber-950/20 dark:to-yellow-950/15 midnight:from-amber-950/20 midnight:to-yellow-950/15 purple:from-amber-950/20 purple:to-yellow-950/15",
      border: "border-amber-200/50 dark:border-amber-900/30 midnight:border-amber-900/30 purple:border-amber-900/30",
      iconBg: "bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
      textColor: "text-amber-900 dark:text-amber-200 midnight:text-amber-200 purple:text-amber-200",
      countColor: "text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300",
    },
  };

  const style = variants[type];
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:scale-[1.02]`}
    >
      <div className="flex items-center gap-4">
        <div className={`${style.iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${style.iconColor}`} />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${style.textColor} mb-1`}>
            {style.label}
          </p>
          <p className={`text-2xl font-bold ${style.countColor}`}>
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}
