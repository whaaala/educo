"use client";

import { UserCheck, UserX, Clock, UserMinus } from "lucide-react";

interface StaffAttendanceStatsCardProps {
  type: "present" | "absent" | "halfday" | "late";
  count: number;
}

export default function StaffAttendanceStatsCard({ type, count }: StaffAttendanceStatsCardProps) {
  const variants = {
    present: {
      icon: UserCheck,
      label: "Present",
      bg: "bg-gradient-to-br from-cyan-50/80 to-sky-50/60 dark:from-cyan-950/20 dark:to-sky-950/15 midnight:from-cyan-950/20 midnight:to-sky-950/15 purple:from-cyan-950/20 purple:to-sky-950/15",
      border: "border-cyan-200/50 dark:border-cyan-900/30 midnight:border-cyan-900/30 purple:border-cyan-900/30",
      hoverBorder: "hover:border-cyan-300/70 dark:hover:border-cyan-800/50 midnight:hover:border-cyan-800/50 purple:hover:border-cyan-800/50",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400",
      textColor: "text-cyan-900 dark:text-cyan-200 midnight:text-cyan-200 purple:text-cyan-200",
      countColor: "text-cyan-700 dark:text-cyan-300 midnight:text-cyan-300 purple:text-cyan-300",
      ring: "hover:ring-cyan-300/30 dark:hover:ring-cyan-700/20",
    },
    absent: {
      icon: UserX,
      label: "Absent",
      bg: "bg-gradient-to-br from-red-50/80 to-rose-50/60 dark:from-red-950/20 dark:to-rose-950/15 midnight:from-red-950/20 midnight:to-rose-950/15 purple:from-red-950/20 purple:to-rose-950/15",
      border: "border-red-200/50 dark:border-red-900/30 midnight:border-red-900/30 purple:border-red-900/30",
      hoverBorder: "hover:border-red-300/70 dark:hover:border-red-800/50 midnight:hover:border-red-800/50 purple:hover:border-red-800/50",
      iconBg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
      textColor: "text-red-900 dark:text-red-200 midnight:text-red-200 purple:text-red-200",
      countColor: "text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300",
      ring: "hover:ring-red-300/30 dark:hover:ring-red-700/20",
    },
    halfday: {
      icon: UserMinus,
      label: "Half Day",
      bg: "bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/15 midnight:from-blue-950/20 midnight:to-indigo-950/15 purple:from-blue-950/20 purple:to-indigo-950/15",
      border: "border-blue-200/50 dark:border-blue-900/30 midnight:border-blue-900/30 purple:border-blue-900/30",
      hoverBorder: "hover:border-blue-300/70 dark:hover:border-blue-800/50 midnight:hover:border-blue-800/50 purple:hover:border-blue-800/50",
      iconBg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
      textColor: "text-blue-900 dark:text-blue-200 midnight:text-blue-200 purple:text-blue-200",
      countColor: "text-blue-700 dark:text-blue-300 midnight:text-blue-300 purple:text-blue-300",
      ring: "hover:ring-blue-300/30 dark:hover:ring-blue-700/20",
    },
    late: {
      icon: Clock,
      label: "Late",
      bg: "bg-gradient-to-br from-amber-50/80 to-yellow-50/60 dark:from-amber-950/20 dark:to-yellow-950/15 midnight:from-amber-950/20 midnight:to-yellow-950/15 purple:from-amber-950/20 purple:to-yellow-950/15",
      border: "border-amber-200/50 dark:border-amber-900/30 midnight:border-amber-900/30 purple:border-amber-900/30",
      hoverBorder: "hover:border-amber-300/70 dark:hover:border-amber-800/50 midnight:hover:border-amber-800/50 purple:hover:border-amber-800/50",
      iconBg: "bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
      textColor: "text-amber-900 dark:text-amber-200 midnight:text-amber-200 purple:text-amber-200",
      countColor: "text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300",
      ring: "hover:ring-amber-300/30 dark:hover:ring-amber-700/20",
    },
  };

  const style = variants[type];
  const Icon = style.icon;

  return (
    <div
      className={`
        ${style.bg} ${style.border} ${style.hoverBorder} ${style.ring}
        relative overflow-hidden border-2 rounded-xl sm:rounded-2xl
        p-3 sm:p-4 md:p-3 lg:p-4 xl:p-4 2xl:p-4
        backdrop-blur-sm
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30
        hover:scale-[1.03] hover:-translate-y-1
        hover:ring-2
        cursor-pointer
        group
      `}
    >
      {/* Multiple layered gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent dark:from-white/8 dark:via-white/3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tl from-black/5 via-transparent to-transparent dark:from-black/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2 sm:gap-3 md:gap-2 lg:gap-3 xl:gap-3 2xl:gap-3">
        {/* Icon Container with enhanced styling */}
        <div className={`
          ${style.iconBg}
          w-10 h-10 sm:w-12 sm:h-12 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-12 xl:h-12 2xl:w-12 2xl:h-12
          rounded-lg sm:rounded-xl
          flex items-center justify-center flex-shrink-0
          shadow-lg shadow-black/10 dark:shadow-black/30 group-hover:shadow-xl
          transition-all duration-500
          group-hover:scale-[1.15] group-hover:rotate-3
          ring-2 ring-white/50 dark:ring-white/10
        `}>
          <Icon className={`
            w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-6 2xl:h-6
            ${style.iconColor}
            transition-transform duration-500
            group-hover:scale-110 group-hover:-rotate-3
            drop-shadow-sm
          `} />
        </div>

        {/* Text Content with improved typography */}
        <div className="flex-1 min-w-0">
          <p className={`
            text-[10px] sm:text-xs md:text-[10px] lg:text-xs xl:text-xs 2xl:text-xs
            font-semibold sm:font-bold
            ${style.textColor}
            mb-0.5 sm:mb-1 md:mb-0.5 lg:mb-1 xl:mb-1 2xl:mb-1
            leading-tight
            tracking-wide
            uppercase text-opacity-90
          `}>
            {style.label}
          </p>
          <div className="flex items-baseline gap-1">
            <p className={`
              text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl
              font-extrabold
              ${style.countColor}
              leading-none
              transition-all duration-500
              group-hover:scale-110
              tracking-tight
            `}>
              {count}
            </p>
            <span className={`
              text-[10px] sm:text-xs md:text-[10px] lg:text-xs xl:text-xs 2xl:text-xs
              font-medium
              ${style.textColor}
              opacity-60
            `}>
              days
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced decorative elements */}
      <div className={`absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 2xl:w-16 2xl:h-16 ${style.iconBg} rounded-full opacity-15 blur-2xl group-hover:opacity-25 group-hover:scale-125 transition-all duration-500`} />
      <div className={`absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 2xl:w-12 2xl:h-12 ${style.iconBg} rounded-full opacity-10 blur-xl group-hover:opacity-20 group-hover:scale-110 transition-all duration-500`} />

      {/* Corner accent lines */}
      <div className={`absolute top-0 right-0 w-12 h-0.5 ${style.iconBg} opacity-30 group-hover:opacity-50 group-hover:w-16 transition-all duration-500`} />
      <div className={`absolute top-0 right-0 w-0.5 h-12 ${style.iconBg} opacity-30 group-hover:opacity-50 group-hover:h-16 transition-all duration-500`} />
    </div>
  );
}
