"use client";

interface LeaveStatsCardProps {
  title: string;
  total: number;
  used: number;
  available: number;
  variant: "medical" | "casual" | "maternity" | "paternity";
}

export default function LeaveStatsCard({
  title,
  total,
  used,
  available,
  variant,
}: LeaveStatsCardProps) {
  const variants = {
    medical: {
      bg: "bg-gradient-to-br from-red-50/80 to-rose-50/60 dark:from-red-950/20 dark:to-rose-950/15 midnight:from-red-950/20 midnight:to-rose-950/15 purple:from-red-950/20 purple:to-rose-950/15",
      border: "border-red-200/50 dark:border-red-900/30 midnight:border-red-900/30 purple:border-red-900/30",
      titleColor: "text-red-900 dark:text-red-200 midnight:text-red-200 purple:text-red-200",
      textColor: "text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300",
      labelColor: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
    },
    casual: {
      bg: "bg-gradient-to-br from-blue-50/80 to-cyan-50/60 dark:from-blue-950/20 dark:to-cyan-950/15 midnight:from-blue-950/20 midnight:to-cyan-950/15 purple:from-blue-950/20 purple:to-cyan-950/15",
      border: "border-blue-200/50 dark:border-blue-900/30 midnight:border-blue-900/30 purple:border-blue-900/30",
      titleColor: "text-blue-900 dark:text-blue-200 midnight:text-cyan-200 purple:text-blue-200",
      textColor: "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-blue-300",
      labelColor: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-blue-400",
    },
    maternity: {
      bg: "bg-gradient-to-br from-purple-50/80 to-pink-50/60 dark:from-purple-950/20 dark:to-pink-950/15 midnight:from-purple-950/20 midnight:to-pink-950/15 purple:from-purple-950/20 purple:to-pink-950/15",
      border: "border-purple-200/50 dark:border-purple-900/30 midnight:border-purple-900/30 purple:border-purple-900/30",
      titleColor: "text-purple-900 dark:text-purple-200 midnight:text-purple-200 purple:text-pink-200",
      textColor: "text-purple-700 dark:text-purple-300 midnight:text-purple-300 purple:text-pink-300",
      labelColor: "text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400",
    },
    paternity: {
      bg: "bg-gradient-to-br from-green-50/80 to-emerald-50/60 dark:from-green-950/20 dark:to-emerald-950/15 midnight:from-green-950/20 midnight:to-emerald-950/15 purple:from-green-950/20 purple:to-emerald-950/15",
      border: "border-green-200/50 dark:border-green-900/30 midnight:border-green-900/30 purple:border-green-900/30",
      titleColor: "text-green-900 dark:text-green-200 midnight:text-green-200 purple:text-green-200",
      textColor: "text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300",
      labelColor: "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02]`}
    >
      <h3 className={`text-sm font-bold ${style.titleColor} mb-3`}>
        {title}
      </h3>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className={`text-xs font-medium ${style.labelColor}`}>
              Used :
            </span>
            <span className={`text-sm font-bold ${style.textColor}`}>
              {used}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className={`text-xs font-medium ${style.labelColor}`}>
              Available :
            </span>
            <span className={`text-sm font-bold ${style.textColor}`}>
              {available}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
