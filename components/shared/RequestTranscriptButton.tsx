"use client";

import { FileSpreadsheet } from "lucide-react";

interface RequestTranscriptButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function RequestTranscriptButton({
  onClick,
  className = "",
  disabled = false,
}: RequestTranscriptButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:from-cyan-600 midnight:to-cyan-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800 purple:from-pink-600 purple:to-pink-700 purple:hover:from-pink-700 purple:hover:to-pink-800 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
    >
      <FileSpreadsheet className="w-4 h-4" />
      <span>Request Transcript</span>
    </button>
  );
}
