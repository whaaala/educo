"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function ActionButton({
  children,
  onClick,
  href,
  target,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  disabled = false,
  loading = false,
  className = "",
}: ActionButtonProps) {
  const variantStyles = {
    primary: cn(
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      "dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800",
      "midnight:from-cyan-500 midnight:to-cyan-600 midnight:hover:from-cyan-600 midnight:hover:to-cyan-700",
      "purple:from-pink-500 purple:to-pink-600 purple:hover:from-pink-600 purple:hover:to-pink-700",
      "text-white shadow-lg shadow-blue-500/25",
      "dark:shadow-blue-600/25 midnight:shadow-cyan-500/25 purple:shadow-pink-500/25",
      "hover:shadow-blue-500/40 dark:hover:shadow-blue-600/40 midnight:hover:shadow-cyan-500/40 purple:hover:shadow-pink-500/40"
    ),
    secondary: cn(
      "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]",
      "hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10",
      "text-gray-900 dark:text-white midnight:text-white purple:text-white",
      "border border-transparent midnight:border-cyan-500/20 purple:border-pink-500/20"
    ),
    ghost: cn(
      "bg-transparent",
      "hover:bg-gray-100 dark:hover:bg-[#22262e]/50 midnight:hover:bg-cyan-500/5/50 purple:hover:bg-pink-500/5/50",
      "text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300"
    ),
    danger: cn(
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      "text-white shadow-lg shadow-red-500/25"
    ),
    success: cn(
      "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
      "text-white shadow-lg shadow-emerald-500/25"
    ),
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm gap-1.5 rounded-lg",
    md: "px-4 py-2.5 text-sm gap-2 rounded-xl",
    lg: "px-6 py-3 text-base gap-2.5 rounded-xl",
  };

  const baseStyles = cn(
    "inline-flex items-center justify-center font-medium cursor-pointer",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2",
    "dark:focus:ring-offset-gray-800 midnight:focus:ring-cyan-500/50 purple:focus:ring-pink-500/50",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && icon}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} target={target} className={baseStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={baseStyles}
    >
      {content}
    </button>
  );
}
