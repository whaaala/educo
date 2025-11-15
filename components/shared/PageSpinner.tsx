"use client";

import { Loader2 } from "lucide-react";

interface PageSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function PageSpinner({ message = "Loading...", size = "md" }: PageSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <div className="relative">
        {/* Spinning loader */}
        <Loader2
          className={`${sizeClasses[size]} animate-spin text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400`}
        />

        {/* Pulsing circle background */}
        <div className="absolute inset-0 -z-10">
          <div className="w-full h-full rounded-full bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-500/10 purple:bg-pink-500/10 animate-pulse" />
        </div>
      </div>

      {/* Loading message */}
      {message && (
        <p className={`mt-4 ${textSizes[size]} font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 animate-pulse`}>
          {message}
        </p>
      )}
    </div>
  );
}
