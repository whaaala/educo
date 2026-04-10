"use client";

import { Printer } from "lucide-react";

interface PrintButtonProps {
  onPrint: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export default function PrintButton({
  onPrint,
  size = "md",
  className = "",
  disabled = false,
}: PrintButtonProps) {
  const sizeClasses = {
    sm: "w-7 h-7 p-1.5",
    md: "w-9 h-9 p-2",
    lg: "w-11 h-11 p-2.5",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={onPrint}
      disabled={disabled}
      title="Print"
      className={`
        ${sizeClasses[size]}
        relative flex items-center justify-center
        rounded-lg
        bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]
        border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30
        text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400
        hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10
        hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/50 purple:hover:border-pink-500/50
        hover:text-gray-800 dark:hover:text-gray-200 midnight:hover:text-cyan-300 purple:hover:text-pink-300
        active:scale-95
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow-md
        ${className}
      `}
    >
      <Printer className={`${iconSizes[size]}`} />
    </button>
  );
}
