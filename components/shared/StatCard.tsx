"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type StatCardColor =
  | "blue"
  | "green"
  | "red"
  | "purple"
  | "orange"
  | "cyan"
  | "amber"
  | "indigo"
  | "emerald"
  | "gray"
  | "teal"
  | "pink";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: StatCardColor;
  badge?: ReactNode;
  subtitle?: string;
  currencySymbol?: string;
  href?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  color,
  badge,
  subtitle,
  currencySymbol
}: StatCardProps) {
  const colorVariants: Record<StatCardColor, {
    bg: string;
    iconBg: string;
    iconColor: string;
    labelColor: string;
    valueColor: string;
    badgeColor: string;
    badgeBg: string;
  }> = {
    blue: {
      bg: "bg-blue-50/80 dark:bg-blue-950/30 midnight:bg-blue-950/30 purple:bg-blue-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
      labelColor: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
      valueColor: "text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100",
      badgeColor: "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300",
      badgeBg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
    },
    green: {
      bg: "bg-green-50/80 dark:bg-green-950/30 midnight:bg-green-950/30 purple:bg-green-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
      labelColor: "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
      valueColor: "text-green-900 dark:text-green-100",
      badgeColor: "text-green-700 dark:text-green-300",
      badgeBg: "bg-green-100 dark:bg-green-900/30",
    },
    red: {
      bg: "bg-red-50/80 dark:bg-red-950/30 midnight:bg-red-950/30 purple:bg-red-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
      labelColor: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
      valueColor: "text-red-900 dark:text-red-100",
      badgeColor: "text-red-700 dark:text-red-300",
      badgeBg: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
    },
    purple: {
      bg: "bg-purple-50/80 dark:bg-purple-950/30 midnight:bg-purple-950/30 purple:bg-pink-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400",
      labelColor: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400",
      valueColor: "text-purple-900 dark:text-purple-100 midnight:text-purple-100 purple:text-pink-100",
      badgeColor: "text-purple-700 dark:text-purple-300 midnight:text-purple-300 purple:text-pink-300",
      badgeBg: "bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30",
    },
    orange: {
      bg: "bg-orange-50/80 dark:bg-orange-950/30 midnight:bg-orange-950/30 purple:bg-orange-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-orange-600 dark:text-orange-400",
      labelColor: "text-orange-600 dark:text-orange-400",
      valueColor: "text-orange-900 dark:text-orange-100",
      badgeColor: "text-orange-700 dark:text-orange-300",
      badgeBg: "bg-orange-100 dark:bg-orange-900/30",
    },
    cyan: {
      bg: "bg-cyan-50/80 dark:bg-cyan-950/30 midnight:bg-cyan-950/30 purple:bg-cyan-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      labelColor: "text-cyan-600 dark:text-cyan-400",
      valueColor: "text-cyan-900 dark:text-cyan-100",
      badgeColor: "text-cyan-700 dark:text-cyan-300",
      badgeBg: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    amber: {
      bg: "bg-amber-50/80 dark:bg-amber-950/30 midnight:bg-amber-950/30 purple:bg-amber-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
      labelColor: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
      valueColor: "text-amber-900 dark:text-amber-100",
      badgeColor: "text-amber-700 dark:text-amber-300",
      badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    },
    indigo: {
      bg: "bg-indigo-50/80 dark:bg-indigo-950/30 midnight:bg-indigo-950/30 purple:bg-indigo-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      labelColor: "text-indigo-600 dark:text-indigo-400",
      valueColor: "text-indigo-900 dark:text-indigo-100",
      badgeColor: "text-indigo-700 dark:text-indigo-300",
      badgeBg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    emerald: {
      bg: "bg-emerald-50/80 dark:bg-emerald-950/30 midnight:bg-emerald-950/30 purple:bg-emerald-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      labelColor: "text-emerald-600 dark:text-emerald-400",
      valueColor: "text-emerald-900 dark:text-emerald-100",
      badgeColor: "text-emerald-700 dark:text-emerald-300",
      badgeBg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    gray: {
      bg: "bg-gray-50/80 dark:bg-gray-950 midnight:bg-[#070d1a] purple:bg-[#150a28]/30 midnight:bg-gray-950/30 purple:bg-gray-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300",
      labelColor: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300",
      valueColor: "text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50",
      badgeColor: "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200",
      badgeBg: "bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30",
    },
    teal: {
      bg: "bg-teal-50/80 dark:bg-teal-950/30 midnight:bg-teal-950/30 purple:bg-teal-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-teal-600 dark:text-teal-400",
      labelColor: "text-teal-600 dark:text-teal-400",
      valueColor: "text-teal-900 dark:text-teal-100",
      badgeColor: "text-teal-700 dark:text-teal-300",
      badgeBg: "bg-teal-100 dark:bg-teal-900/30",
    },
    pink: {
      bg: "bg-pink-50/80 dark:bg-pink-950/30 midnight:bg-pink-950/30 purple:bg-pink-950/30",
      iconBg: "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50",
      iconColor: "text-pink-600 dark:text-pink-400",
      labelColor: "text-pink-600 dark:text-pink-400",
      valueColor: "text-pink-900 dark:text-pink-100",
      badgeColor: "text-pink-700 dark:text-pink-300",
      badgeBg: "bg-pink-100 dark:bg-pink-900/30",
    },
  };

  const style = colorVariants[color];

  return (
    <div
      className={`
        relative
        ${style.bg}
        rounded-2xl
        p-3 sm:p-4
        transition-all duration-300
        hover:shadow-xl hover:-translate-y-0.5
        border border-white/20 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20
        backdrop-blur-sm
        overflow-hidden
        group
        h-[100px] sm:h-[110px]
        flex flex-col
        justify-between
        min-w-0
      `}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex items-center justify-between">
        <div className={`
          ${style.badgeBg}
          w-8 h-8 sm:w-9 sm:h-9 rounded-lg
          flex items-center justify-center flex-shrink-0
          shadow-md shadow-black/5
          ring-1 ring-white/10
          transition-transform duration-300 group-hover:scale-110
        `}>
          <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${style.badgeColor}`} />
        </div>
        {badge && (
          <div className={`flex-shrink-0 text-[9px] font-bold ${style.badgeColor} ${style.badgeBg} px-1.5 py-0.5 rounded-md ring-1 ring-white/10`}>
            {badge}
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-col gap-0.5 min-w-0">
        <p className={`text-[9px] sm:text-[10px] font-semibold ${style.labelColor} uppercase tracking-wide opacity-80 whitespace-nowrap truncate`}>
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          {currencySymbol && (
            <span className={`text-base sm:text-lg font-bold ${style.valueColor}`}>
              {currencySymbol}
            </span>
          )}
          <p className={`text-xl sm:text-2xl font-bold ${style.valueColor} leading-none tracking-tight`}>
            {value}
          </p>
        </div>
        {subtitle && (
          <p className="text-[9px] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
