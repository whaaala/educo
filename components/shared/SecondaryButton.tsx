"use client";

import { LucideIcon } from "lucide-react";

interface SecondaryButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  hideTextOnMobile?: boolean;
}

export default function SecondaryButton({
  label,
  icon: Icon,
  onClick,
  className = "",
  hideTextOnMobile = true,
}: SecondaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-white dark:bg-gray-800 midnight:bg-gray-800/80 purple:bg-gray-800/80 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm font-medium ${className}`}
    >
      <Icon className="w-4 h-4" />
      <span className={hideTextOnMobile ? "hidden sm:inline" : ""}>{label}</span>
    </button>
  );
}
