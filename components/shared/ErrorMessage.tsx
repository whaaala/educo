"use client";

import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";

interface ErrorMessageProps {
  message: string | ReactNode;
  className?: string;
}

export default function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-2 mt-1.5 text-sm text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

