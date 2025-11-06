"use client";

import { Clock, LucideIcon } from "lucide-react";

interface BreakCardProps {
  label: string;
  time: string;
  icon?: LucideIcon;
  variant?: "blue" | "orange" | "purple" | "green";
}

export default function BreakCard({
  label,
  time,
  icon: Icon,
  variant = "blue",
}: BreakCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return {
          badgeBg: "bg-blue-600 dark:bg-blue-600 midnight:bg-blue-600 purple:bg-blue-600",
          badgeText: "text-white",
        };
      case "orange":
        return {
          badgeBg: "bg-orange-500 dark:bg-orange-500 midnight:bg-orange-500 purple:bg-orange-500",
          badgeText: "text-white",
        };
      case "purple":
        return {
          badgeBg: "bg-purple-600 dark:bg-purple-600 midnight:bg-purple-600 purple:bg-purple-600",
          badgeText: "text-white",
        };
      case "green":
        return {
          badgeBg: "bg-green-600 dark:bg-green-600 midnight:bg-green-600 purple:bg-green-600",
          badgeText: "text-white",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg sm:rounded-xl border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 p-3 sm:p-3.5 transition-all duration-200 hover:shadow-md hover:border-gray-300/80 dark:hover:border-gray-600/80 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      <div className="flex flex-col gap-2 sm:gap-2.5">
        {/* Label Badge */}
        <div className={`${styles.badgeBg} ${styles.badgeText} px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-bold w-fit`}>
          {label}
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 stroke-[2.5]" />
          <span className="text-xs sm:text-[13px] font-semibold leading-none whitespace-nowrap">
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
