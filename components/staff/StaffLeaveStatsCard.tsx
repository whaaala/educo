"use client";

interface StaffLeaveStatsCardProps {
  title: string;
  total: number;
  used: number;
  available: number;
  variant: "medical" | "casual" | "annual" | "special";
}

export default function StaffLeaveStatsCard({
  title,
  total,
  used,
  available,
  variant,
}: StaffLeaveStatsCardProps) {
  const variants = {
    medical: {
      // Gradient backgrounds with glass effect
      bg: "bg-gradient-to-br from-red-50 via-rose-50 to-red-50/80 dark:from-red-950/30 dark:via-rose-950/20 dark:to-red-950/30 midnight:from-red-950/30 midnight:via-rose-950/20 midnight:to-red-950/30 purple:from-red-950/30 purple:via-rose-950/20 purple:to-red-950/30",
      // Border with glow effect on hover
      border: "border-red-200/60 dark:border-red-800/40 midnight:border-red-800/40 purple:border-red-800/40",
      hoverBorder: "hover:border-red-300/80 dark:hover:border-red-700/60 midnight:hover:border-red-700/60 purple:hover:border-red-700/60",
      // Title with gradient
      titleColor: "text-red-800 dark:text-red-200 midnight:text-red-200 purple:text-red-200",
      // Stats text colors
      textColor: "text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300",
      // Label colors
      labelColor: "text-red-600/80 dark:text-red-400/80 midnight:text-red-400/80 purple:text-red-400/80",
      // Icon background
      iconBg: "bg-red-100 dark:bg-red-900/40 midnight:bg-red-900/40 purple:bg-red-900/40",
      // Progress bar
      progressBg: "bg-red-200/30 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20",
      progressFill: "bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-600 dark:to-rose-600",
      // Ring color for hover effect
      ring: "hover:ring-red-300/50 dark:hover:ring-red-700/30",
    },
    casual: {
      bg: "bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50/80 dark:from-blue-950/30 dark:via-cyan-950/20 dark:to-blue-950/30 midnight:from-blue-950/30 midnight:via-cyan-950/20 midnight:to-blue-950/30 purple:from-blue-950/30 purple:via-cyan-950/20 purple:to-blue-950/30",
      border: "border-blue-200/60 dark:border-blue-800/40 midnight:border-blue-800/40 purple:border-blue-800/40",
      hoverBorder: "hover:border-blue-300/80 dark:hover:border-blue-700/60 midnight:hover:border-cyan-700/60 purple:hover:border-blue-700/60",
      titleColor: "text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-blue-200",
      textColor: "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-blue-300",
      labelColor: "text-blue-600/80 dark:text-blue-400/80 midnight:text-cyan-400/80 purple:text-blue-400/80",
      iconBg: "bg-blue-100 dark:bg-blue-900/40 midnight:bg-blue-900/40 purple:bg-blue-900/40",
      progressBg: "bg-blue-200/30 dark:bg-blue-900/20 midnight:bg-blue-900/20 purple:bg-blue-900/20",
      progressFill: "bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
      ring: "hover:ring-blue-300/50 dark:hover:ring-blue-700/30 midnight:hover:ring-cyan-700/30",
    },
    annual: {
      bg: "bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50/80 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-purple-950/30 midnight:from-purple-950/30 midnight:via-pink-950/20 midnight:to-purple-950/30 purple:from-purple-950/30 purple:via-pink-950/20 purple:to-purple-950/30",
      border: "border-purple-200/60 dark:border-purple-800/40 midnight:border-purple-800/40 purple:border-purple-800/40",
      hoverBorder: "hover:border-purple-300/80 dark:hover:border-purple-700/60 midnight:hover:border-purple-700/60 purple:hover:border-pink-700/60",
      titleColor: "text-purple-800 dark:text-purple-200 midnight:text-purple-200 purple:text-pink-200",
      textColor: "text-purple-700 dark:text-purple-300 midnight:text-purple-300 purple:text-pink-300",
      labelColor: "text-purple-600/80 dark:text-purple-400/80 midnight:text-purple-400/80 purple:text-pink-400/80",
      iconBg: "bg-purple-100 dark:bg-purple-900/40 midnight:bg-purple-900/40 purple:bg-purple-900/40",
      progressBg: "bg-purple-200/30 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-purple-900/20",
      progressFill: "bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600",
      ring: "hover:ring-purple-300/50 dark:hover:ring-purple-700/30 purple:hover:ring-pink-700/30",
    },
    special: {
      bg: "bg-gradient-to-br from-green-50 via-emerald-50 to-green-50/80 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-green-950/30 midnight:from-green-950/30 midnight:via-emerald-950/20 midnight:to-green-950/30 purple:from-green-950/30 purple:via-emerald-950/20 purple:to-green-950/30",
      border: "border-green-200/60 dark:border-green-800/40 midnight:border-green-800/40 purple:border-green-800/40",
      hoverBorder: "hover:border-green-300/80 dark:hover:border-green-700/60 midnight:hover:border-green-700/60 purple:hover:border-green-700/60",
      titleColor: "text-green-800 dark:text-green-200 midnight:text-green-200 purple:text-green-200",
      textColor: "text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300",
      labelColor: "text-green-600/80 dark:text-green-400/80 midnight:text-green-400/80 purple:text-green-400/80",
      iconBg: "bg-green-100 dark:bg-green-900/40 midnight:bg-green-900/40 purple:bg-green-900/40",
      progressBg: "bg-green-200/30 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20",
      progressFill: "bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600",
      ring: "hover:ring-green-300/50 dark:hover:ring-green-700/30",
    },
  };

  const style = variants[variant];

  // Calculate percentage for progress bar
  const usedPercentage = total > 0 ? (used / total) * 100 : 0;

  return (
    <div
      className={`
        ${style.bg} ${style.border} ${style.hoverBorder} ${style.ring}
        relative overflow-hidden rounded-lg sm:rounded-xl
        border backdrop-blur-sm
        p-3 sm:p-2.5 lg:p-3 2xl:p-2.5
        transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20
        hover:scale-[1.02] hover:-translate-y-0.5
        hover:ring-2
        cursor-default
        group
      `}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 space-y-2 sm:space-y-1.5 lg:space-y-2.5 2xl:space-y-1.5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 sm:gap-1.5 lg:gap-2.5 2xl:gap-2">
          <h3 className={`text-xs sm:text-[10px] lg:text-sm xl:text-base 2xl:text-sm font-bold ${style.titleColor} leading-tight flex-1`}>
            {title}
          </h3>
          {/* Total badge */}
          <div className={`${style.iconBg} px-2 py-1 sm:px-1.5 sm:py-0.5 lg:px-2.5 lg:py-1 2xl:px-2 2xl:py-0.5 rounded-md sm:rounded lg:rounded-lg 2xl:rounded-md`}>
            <span className={`text-xs sm:text-[9px] sm:text-[10px] lg:text-sm xl:text-base 2xl:text-sm font-bold ${style.textColor}`}>
              {total}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 sm:space-y-1 lg:space-y-2 2xl:space-y-1.5">
          <div className={`${style.progressBg} h-1 sm:h-0.5 sm:h-1 lg:h-1.5 2xl:h-1 rounded-full overflow-hidden`}>
            <div
              className={`${style.progressFill} h-full rounded-full transition-all duration-500 ease-out shadow-sm`}
              style={{ width: `${usedPercentage}%` }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-1.5 sm:gap-2 lg:gap-4 xl:gap-5 2xl:gap-3">
            {/* Used */}
            <div className="flex flex-col">
              <span className={`text-[10px] sm:text-[8px] sm:text-[9px] lg:text-[11px] xl:text-xs 2xl:text-[10px] font-semibold uppercase tracking-wide ${style.labelColor} mb-1 sm:mb-0.5 lg:mb-1 2xl:mb-0.5`}>
                Used
              </span>
              <div className="flex items-baseline gap-1 sm:gap-0.5 lg:gap-1 2xl:gap-0.5">
                <span className={`text-base sm:text-xs sm:text-sm lg:text-xl xl:text-2xl 2xl:text-lg font-bold ${style.textColor} leading-none`}>
                  {used}
                </span>
                <span className={`text-[10px] sm:text-[8px] sm:text-[9px] lg:text-xs xl:text-sm 2xl:text-xs ${style.labelColor}`}>
                  days
                </span>
              </div>
            </div>

            {/* Available */}
            <div className="flex flex-col">
              <span className={`text-[10px] sm:text-[8px] sm:text-[9px] lg:text-[11px] xl:text-xs 2xl:text-[10px] font-semibold uppercase tracking-wide ${style.labelColor} mb-1 sm:mb-0.5 lg:mb-1 2xl:mb-0.5`}>
                Available
              </span>
              <div className="flex items-baseline gap-1 sm:gap-0.5 lg:gap-1 2xl:gap-0.5">
                <span className={`text-base sm:text-xs sm:text-sm lg:text-xl xl:text-2xl 2xl:text-lg font-bold ${style.textColor} leading-none`}>
                  {available}
                </span>
                <span className={`text-[10px] sm:text-[8px] sm:text-[9px] lg:text-xs xl:text-sm 2xl:text-xs ${style.labelColor}`}>
                  days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner element - smaller */}
      <div className={`absolute -top-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 2xl:w-12 2xl:h-12 ${style.iconBg} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
    </div>
  );
}
