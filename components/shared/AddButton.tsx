"use client";

import { Plus } from "lucide-react";

interface AddButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export default function AddButton({
  label,
  onClick,
  className = "",
}: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 sm:gap-2 px-5 sm:px-4 py-3 sm:py-2 rounded-lg sm:rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white transition-all duration-200 shadow-lg sm:shadow-md hover:shadow-xl active:scale-[0.98] cursor-pointer ${className}`}
    >
      <Plus className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" />
      <span className="text-base sm:text-sm font-semibold sm:font-medium whitespace-nowrap">{label}</span>
    </button>
  );
}
