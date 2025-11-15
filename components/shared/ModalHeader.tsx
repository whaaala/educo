"use client";

import { X, LucideIcon } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  icon: LucideIcon;
  onClose: () => void;
  variant?: "blue" | "red" | "green" | "purple" | "orange";
}

export default function ModalHeader({
  title,
  icon: Icon,
  onClose,
  variant = "blue",
}: ModalHeaderProps) {
  const variants = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20",
      border: "border-blue-100 dark:border-blue-800/30 midnight:border-cyan-700/30 purple:border-pink-700/30",
      iconPing: "bg-blue-500 dark:bg-blue-400 midnight:bg-cyan-400 purple:bg-pink-400",
      iconBg: "bg-blue-500 dark:bg-blue-600 midnight:bg-cyan-600 purple:bg-pink-600",
      closeHover: "hover:bg-blue-100 dark:hover:bg-blue-800/40 midnight:hover:bg-cyan-800/40 purple:hover:bg-pink-800/40",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20",
      border: "border-red-100 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30",
      iconPing: "bg-red-500 dark:bg-red-400",
      iconBg: "bg-red-500 dark:bg-red-600 midnight:bg-red-600 purple:bg-red-600",
      closeHover: "hover:bg-red-100 dark:hover:bg-red-800/40 midnight:hover:bg-red-800/40 purple:hover:bg-red-800/40",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20",
      border: "border-green-100 dark:border-green-800/30 midnight:border-green-700/30 purple:border-green-700/30",
      iconPing: "bg-green-500 dark:bg-green-400 midnight:bg-green-400 purple:bg-green-400",
      iconBg: "bg-green-500 dark:bg-green-600 midnight:bg-green-600 purple:bg-green-600",
      closeHover: "hover:bg-green-100 dark:hover:bg-green-800/40 midnight:hover:bg-green-800/40 purple:hover:bg-green-800/40",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-pink-900/20",
      border: "border-purple-100 dark:border-purple-800/30 midnight:border-purple-700/30 purple:border-pink-700/30",
      iconPing: "bg-purple-500 dark:bg-purple-400 midnight:bg-purple-400 purple:bg-pink-400",
      iconBg: "bg-purple-500 dark:bg-purple-600 midnight:bg-purple-600 purple:bg-pink-600",
      closeHover: "hover:bg-purple-100 dark:hover:bg-purple-800/40 midnight:hover:bg-purple-800/40 purple:hover:bg-pink-800/40",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20 midnight:bg-orange-900/20 purple:bg-orange-900/20",
      border: "border-orange-100 dark:border-orange-800/30 midnight:border-orange-700/30 purple:border-orange-700/30",
      iconPing: "bg-orange-500 dark:bg-orange-400 midnight:bg-orange-400 purple:bg-orange-400",
      iconBg: "bg-orange-500 dark:bg-orange-600 midnight:bg-orange-600 purple:bg-orange-600",
      closeHover: "hover:bg-orange-100 dark:hover:bg-orange-800/40 midnight:hover:bg-orange-800/40 purple:hover:bg-orange-800/40",
    },
  };

  const style = variants[variant];

  return (
    <div className={`${style.bg} px-6 pt-4 pb-3 rounded-t-2xl border-b ${style.border} relative`}>
      <div className="flex justify-center mb-2">
        {/* Icon with animated rings */}
        <div className="relative">
          <div className={`absolute inset-0 ${style.iconPing} rounded-full opacity-20 animate-ping`}></div>
          <div className={`relative w-9 h-9 ${style.iconBg} rounded-full flex items-center justify-center`}>
            <Icon className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>
      <h2 className="text-sm font-bold text-center text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
        {title}
      </h2>
      {/* Close button - positioned absolutely */}
      <button
        onClick={onClose}
        className={`absolute top-4 right-4 p-2 rounded-lg ${style.closeHover} transition-all duration-200 hover:rotate-90 active:scale-95 cursor-pointer`}
        aria-label="Close modal"
      >
        <X className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
      </button>
    </div>
  );
}
