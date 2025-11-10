import { IncidentStatus } from "@/types/discipline";
import { Clock, Search, CheckCircle, Scale, XCircle } from "lucide-react";

interface IncidentStatusBadgeProps {
  status: IncidentStatus;
  size?: "sm" | "md" | "lg";
}

export default function IncidentStatusBadge({ status, size = "md" }: IncidentStatusBadgeProps) {
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

  const statusConfig = {
    reported: {
      icon: Clock,
      label: "Reported",
      className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    },
    "under-review": {
      icon: Search,
      label: "Under Review",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    },
    resolved: {
      icon: CheckCircle,
      label: "Resolved",
      className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    },
    appealed: {
      icon: Scale,
      label: "Appealed",
      className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    },
    closed: {
      icon: XCircle,
      label: "Closed",
      className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
    },
  };

  const config = statusConfig[status];
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
