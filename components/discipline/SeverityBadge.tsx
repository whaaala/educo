import { IncidentSeverity } from "@/types/discipline";
import { AlertCircle, AlertTriangle, ShieldAlert, Flame } from "lucide-react";

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  size?: "sm" | "md" | "lg";
}

export default function SeverityBadge({ severity, size = "md" }: SeverityBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const severityConfig = {
    minor: {
      icon: AlertCircle,
      label: "Minor",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    },
    moderate: {
      icon: AlertTriangle,
      label: "Moderate",
      className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
    },
    major: {
      icon: ShieldAlert,
      label: "Major",
      className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    },
    critical: {
      icon: Flame,
      label: "Critical",
      className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeClasses[size]} ${config.className}`}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  );
}
