"use client";

import { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  onClick?: (() => void) | (() => Promise<void>);
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  title?: string;
  isLoading?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
  icon,
  isLoading = false,
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0f1115] midnight:focus:ring-offset-[#0a0e27] purple:focus:ring-offset-[#1a0b2e] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variantClasses = {
    primary: [
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500",
      "dark:bg-[#1a1d24] dark:hover:bg-[#22262e] dark:text-gray-100 dark:border dark:border-gray-700",
      "midnight:bg-cyan-500/15 midnight:text-cyan-400 midnight:border midnight:border-cyan-500/30 midnight:hover:bg-cyan-500/25 midnight:hover:text-cyan-300 midnight:focus:ring-cyan-500",
      "purple:bg-pink-500/15 purple:text-pink-400 purple:border purple:border-pink-500/30 purple:hover:bg-pink-500/25 purple:hover:text-pink-300 purple:focus:ring-pink-500",
    ].join(" "),
    secondary: [
      "bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm focus:ring-gray-400",
      "dark:bg-[#1a1d24] dark:hover:bg-[#22262e] dark:text-gray-200 dark:border dark:border-gray-700",
      "midnight:bg-cyan-500/10 midnight:text-cyan-200 midnight:border midnight:border-cyan-500/20 midnight:hover:bg-cyan-500/20 midnight:focus:ring-cyan-500",
      "purple:bg-pink-500/10 purple:text-pink-200 purple:border purple:border-pink-500/20 purple:hover:bg-pink-500/20 purple:focus:ring-pink-500",
    ].join(" "),
    outline: [
      "border border-gray-300 hover:bg-gray-100 text-gray-700 focus:ring-gray-400",
      "dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#22262e]",
      "midnight:border-cyan-500/30 midnight:text-cyan-300 midnight:hover:bg-cyan-500/10 midnight:focus:ring-cyan-500",
      "purple:border-pink-500/30 purple:text-pink-300 purple:hover:bg-pink-500/10 purple:focus:ring-pink-500",
    ].join(" "),
    ghost: [
      "hover:bg-gray-100 text-gray-700 focus:ring-gray-400",
      "dark:text-gray-200 dark:hover:bg-[#22262e]",
      "midnight:text-cyan-300 midnight:hover:bg-cyan-500/10 midnight:focus:ring-cyan-500",
      "purple:text-pink-300 purple:hover:bg-pink-500/10 purple:focus:ring-pink-500",
    ].join(" "),
    danger: [
      "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500",
      "dark:bg-[#1a1d24] dark:hover:bg-[#22262e] dark:text-red-400 dark:border dark:border-red-500/30",
      "midnight:bg-red-500/15 midnight:text-red-400 midnight:border midnight:border-red-500/30 midnight:hover:bg-red-500/25",
      "purple:bg-red-500/15 purple:text-red-400 purple:border purple:border-red-500/30 purple:hover:bg-red-500/25",
    ].join(" "),
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {isLoading ? (
        <span className="animate-spin mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : icon ? (
        <span className="mr-2 flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
