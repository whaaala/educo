"use client";

interface InPageSpinnerProps {
  loadingText?: string;
  subText?: string;
}

export default function InPageSpinner({
  loadingText = "Loading",
  subText = "Please wait a moment...",
}: InPageSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 midnight:border-cyan-900/30 purple:border-pink-900/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 midnight:border-t-cyan-400 purple:border-t-pink-400 rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2 animate-pulse">
          <p className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            {loadingText}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
            {subText}
          </p>
        </div>
      </div>
    </div>
  );
}
