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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white transition-colors shadow-md cursor-pointer ${className}`}
    >
      <Plus className="w-4 h-4" />
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
    </button>
  );
}
