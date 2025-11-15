"use client";

import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function ActionButton({
  label,
  icon: Icon,
  onClick,
  className = "",
  variant = "primary",
}: ActionButtonProps) {
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors shadow-md cursor-pointer";

  const variantClasses = variant === "primary"
    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700"
    : "bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 midnight:bg-gray-600 midnight:hover:bg-gray-700 purple:bg-gray-600 purple:hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
    </button>
  );
}
