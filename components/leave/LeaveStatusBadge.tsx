import { LeaveStatus } from "@/types/leave";
import { Clock, CheckCircle, XCircle, Ban } from "lucide-react";

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
  size?: "sm" | "md" | "lg";
}

export default function LeaveStatusBadge({ status, size = "md" }: LeaveStatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 midnight:bg-yellow-900/20 midnight:text-yellow-400 midnight:border-yellow-800 purple:bg-yellow-900/20 purple:text-yellow-400 purple:border-yellow-800",
    },
    approved: {
      icon: CheckCircle,
      label: "Approved",
      className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 midnight:bg-green-900/20 midnight:text-green-400 midnight:border-green-800 purple:bg-green-900/20 purple:text-green-400 purple:border-green-800",
    },
    rejected: {
      icon: XCircle,
      label: "Rejected",
      className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 midnight:bg-red-900/20 midnight:text-red-400 midnight:border-red-800 purple:bg-red-900/20 purple:text-red-400 purple:border-red-800",
    },
    cancelled: {
      icon: Ban,
      label: "Cancelled",
      className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-[#0f1115]/20 dark:text-gray-400 dark:border-[#1a1d24] midnight:bg-[#0a0e27]/20 midnight:text-gray-400 midnight:border-gray-800 purple:bg-[#1a0b2e]/20 purple:text-gray-400 purple:border-gray-800",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeClasses[size]} ${config.className}`}
      style={size === "sm" ? { fontSize: '11.8px' } : undefined}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  );
}
