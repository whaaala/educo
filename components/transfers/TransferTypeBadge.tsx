import { TransferType } from "@/types/transfer";
import { ArrowRight, Building2, GraduationCap, Users, ExternalLink } from "lucide-react";

interface TransferTypeBadgeProps {
  type: TransferType;
  size?: "sm" | "md" | "lg";
}

export default function TransferTypeBadge({ type, size = "md" }: TransferTypeBadgeProps) {
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

  const typeConfig = {
    "section-change": {
      icon: Users,
      label: "Section Change",
      className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    },
    "class-change": {
      icon: GraduationCap,
      label: "Class Change",
      className: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
    },
    "internal": {
      icon: ArrowRight,
      label: "Internal Transfer",
      className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    },
    "cross-branch": {
      icon: Building2,
      label: "Cross-Branch",
      className: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800",
    },
    "external": {
      icon: ExternalLink,
      label: "External Transfer",
      className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
    },
  };

  const config = typeConfig[type];
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
