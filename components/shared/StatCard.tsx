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
  | "emerald";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: StatCardColor;
  badge?: ReactNode;
  subtitle?: string;
  currencySymbol?: string;
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
      iconBg: "bg-white dark:bg-gray-800/50",
      iconColor: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
      labelColor: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
      valueColor: "text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100",
      badgeColor: "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300",
      badgeBg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
    },
    green: {
      bg: "bg-green-50/80 dark:bg-green-950/30 midnight:bg-green-950/30 purple:bg-green-950/30",
      iconBg: "bg-white dark:bg-gray-800/50",
      iconColor: "text-green-600 dark:text-green-400",
      labelColor: "text-green-600 dark:text-green-400",
      valueColor: "text-green-900 dark:text-green-100",
      badgeColor: "text-green-700 dark:text-green-300",
      badgeBg: "bg-green-100 dark:bg-green-900/30",
    },
    red: {
      bg: "bg-red-50/80 dark:bg-red-950/30 midnight:bg-red-950/30 purple:bg-red-950/30",
      iconBg: "bg-white dark:bg-gray-800/50",
      iconColor: "text-red-600 dark:text-red-400",
      labelColor: "text-red-600 dark:text-red-400",
      valueColor: "text-red-900 dark:text-red-100",
      badgeColor: "text-red-700 dark:text-red-300",
      badgeBg: "bg-red-100 dark:bg-red-900/30",
    },
    purple: {
      bg: "bg-purple-50/80 dark:bg-purple-950/30 midnight:bg-purple-950/30 purple:bg-pink-950/30",
      iconBg: "bg-white dark:bg-gray-800/50",
      iconColor: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400",
      labelColor: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400",
      valueColor: "text-purple-900 dark:text-purple-100 midnight:text-purple-100 purple:text-pink-100",
      badgeColor: "text-purple-700 dark:text-purple-300 midnight:text-purple-300 purple:text-pink-300",
      badgeBg: "bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30",
    },
    orange: {
      bg: "bg-orange-50/80 dark:bg-orange-950/30 midnight:bg-orange-950/30 purple:bg-orange-950/30",
      iconBg: "bg-white dark:bg-gray-800/50",
      iconColor: "text-orange-600 dark:text-orange-400",
      labelColor: "text-orange-600 dark:text-orange-400",
      valueColor: "text-orange-900 dark:text-orange-100",
      badgeColor: "text-orange-700 dark:text-orange-300",
      badgeBg: "bg-orange-100 dark:bg-orange-900/30",
    },
    cyan: {
      bg: "bg-cyan-50/80 dark:bg-cyan-950/30 midnight:bg-cyan-950/30 purple:bg-cyan-950/30",
      iconBg: "bg-white dark:bg-gray-800/50",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      labelColor: "text-cyan-600 dark:text-cyan-400",
      valueColor: "text-cyan-900 dark:text-cyan-100",
      badgeColor: "text-cyan-700 dark:text-cyan-300",
      badgeBg: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    amber: {
      bg: "bg-amber-50/80 dark:bg-amber-950/30 midnight:bg-amber-950/30 purple:bg-amber-950/30",
      iconBg: "bg-white dark:bg-gray-800/50",
      iconColor: "text-amber-600 dark:text-amber-400",
      labelColor: "text-amber-600 dark:text-amber-400",
      valueColor: "text-amber-900 dark:text-amber-100",
      badgeColor: "text-amber-700 dark:text-amber-300",
      badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    },
    indigo: {
      bg: "bg-indigo-50/80 dark:bg-indigo-950/30 midnight:bg-indigo-950/30 purple:bg-indigo-950/30",
      iconBg: "bg-white dark:bg-gray-800/50",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      labelColor: "text-indigo-600 dark:text-indigo-400",
      valueColor: "text-indigo-900 dark:text-indigo-100",
      badgeColor: "text-indigo-700 dark:text-indigo-300",
      badgeBg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    emerald: {
      bg: "bg-emerald-50/80 dark:bg-emerald-950/30 midnight:bg-emerald-950/30 purple:bg-emerald-950/30",
      iconBg: "bg-white dark:bg-gray-800/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      labelColor: "text-emerald-600 dark:text-emerald-400",
      valueColor: "text-emerald-900 dark:text-emerald-100",
      badgeColor: "text-emerald-700 dark:text-emerald-300",
      badgeBg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
  };

  const style = colorVariants[color];

  return (
    <div
      className={`
        ${style.bg}
        rounded-xl
        p-3 sm:p-3.5
        transition-all duration-200
        hover:shadow-md
        h-[88px] sm:h-[92px]
        flex flex-col
        min-w-0
      `}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className={`
          ${style.badgeBg}
          w-7 h-7 rounded-lg
          flex items-center justify-center flex-shrink-0
        `}>
          <Icon className={`w-3.5 h-3.5 ${style.badgeColor}`} />
        </div>
        {badge && (
          <div className={`flex-shrink-0 text-[10px] font-semibold ${style.badgeColor} ${style.badgeBg} px-1.5 py-0.5 rounded-full`}>
            {badge}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <p className={`text-[9px] sm:text-[10px] font-semibold ${style.labelColor} uppercase tracking-wide mb-0.5`}>
          {label}
        </p>
        <div className="flex items-baseline gap-0.5">
          {currencySymbol && (
            <span className={`text-sm sm:text-base font-bold ${style.valueColor}`}>
              {currencySymbol}
            </span>
          )}
          <p className={`text-base sm:text-lg font-bold ${style.valueColor} truncate leading-none`}>
            {value}
          </p>
        </div>
        {subtitle && (
          <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
