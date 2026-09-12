"use client";

import { IncidentStatus, StaffIncidentStatus } from "@/types/discipline";
import { AlertTriangle, Search, CheckCircle, XCircle, ArrowUpCircle } from "lucide-react";

interface DisciplineStatusBadgeProps {
  status: IncidentStatus | StaffIncidentStatus;
  size?: "sm" | "md" | "lg";
}

export default function DisciplineStatusBadge({ status, size = "md" }: DisciplineStatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const getStatusConfig = () => {
    switch (status) {
      case "reported":
        return {
          label: "Reported",
          icon: AlertTriangle,
          bgClass: "bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/10 purple:bg-amber-900/10",
          textClass: "text-amber-700 dark:text-amber-300 midnight:text-amber-400 purple:text-amber-400",
          borderClass: "border-amber-200 dark:border-amber-800/30 midnight:border-amber-700/30 purple:border-amber-700/30",
          iconClass: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        };
      case "under-investigation":
        return {
          label: "Investigating",
          icon: Search,
          bgClass: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/10 purple:bg-pink-900/10",
          textClass: "text-blue-700 dark:text-blue-300 midnight:text-cyan-400 purple:text-pink-400",
          borderClass: "border-blue-200 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30",
          iconClass: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
        };
      case "resolved":
        return {
          label: "Resolved",
          icon: CheckCircle,
          bgClass: "bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/10 purple:bg-green-900/10",
          textClass: "text-green-700 dark:text-green-300 midnight:text-green-400 purple:text-green-400",
          borderClass: "border-green-200 dark:border-green-800/30 midnight:border-green-700/30 purple:border-green-700/30",
          iconClass: "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
        };
      case "closed":
        return {
          label: "Closed",
          icon: XCircle,
          bgClass: "bg-gray-50 dark:bg-[#0f1115]/20 midnight:bg-[#0a0e27]/10 purple:bg-[#1a0b2e]/10",
          textClass: "text-gray-700 dark:text-gray-300 midnight:text-gray-400 purple:text-gray-400",
          borderClass: "border-gray-200 dark:border-[#1a1d24]/30 midnight:border-gray-700/30 purple:border-gray-700/30",
          iconClass: "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
        };
      case "escalated":
        return {
          label: "Escalated",
          icon: ArrowUpCircle,
          bgClass: "bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/10 purple:bg-red-900/10",
          textClass: "text-red-700 dark:text-red-300 midnight:text-red-400 purple:text-red-400",
          borderClass: "border-red-200 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30",
          iconClass: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        };
      default:
        return {
          label: status,
          icon: AlertTriangle,
          bgClass: "bg-gray-50 dark:bg-[#0f1115]/20 midnight:bg-[#0a0e27]/10 purple:bg-[#1a0b2e]/10",
          textClass: "text-gray-700 dark:text-gray-300 midnight:text-gray-400 purple:text-gray-400",
          borderClass: "border-gray-200 dark:border-[#1a1d24]/30 midnight:border-gray-700/30 purple:border-gray-700/30",
          iconClass: "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-lg border
        ${sizeClasses[size]}
        ${config.bgClass}
        ${config.textClass}
        ${config.borderClass}
        transition-all duration-200
      `}
    >
      <Icon className={`${iconSizes[size]} ${config.iconClass}`} />
      {config.label}
    </span>
  );
}
