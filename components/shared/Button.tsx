"use client";

import { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  onClick?: (() => void) | (() => Promise<void>);
  variant?: "primary" | "secondary" | "outline" | "ghost";
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
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variantClasses = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-sm focus:ring-purple-500 dark:bg-purple-500 dark:hover:bg-purple-600",
    secondary: "bg-neutral-600 hover:bg-neutral-700 text-white shadow-sm focus:ring-neutral-500 dark:bg-neutral-500 dark:hover:bg-neutral-600",
    outline: "border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:ring-neutral-500",
    ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:ring-neutral-500",
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
