"use client";

import { ReactNode, createElement, isValidElement } from "react";
import type { LucideIcon } from "lucide-react";

export type ActionButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ActionButtonColor = "blue" | "emerald" | "purple" | "amber" | "red" | "gray";
type ActionButtonSize = "sm" | "md" | "lg";

export interface ActionButtonProps {
  children?: ReactNode;
  label?: string; // Alias for children
  /**
   * Icon can be either a React element (`<Plus />`) OR a Lucide icon component (`Plus`).
   * Some parts of the codebase pass icon components; rendering them as-is causes:
   * "Objects are not valid as a React child (found: object with keys {$$typeof, render})"
   */
  icon?: ReactNode | LucideIcon;
  onClick?: () => void;
  variant?: ActionButtonVariant;
  color?: ActionButtonColor;
  size?: ActionButtonSize;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const colorStyles = {
  blue: {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30",
    secondary: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 border border-blue-200/60 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500/40 hover:border-blue-300 dark:hover:border-blue-600 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 hover:shadow-md hover:shadow-blue-500/10",
    outline: "border-2 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300",
    ghost: "hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30",
    iconBg: "bg-blue-100 dark:bg-blue-800/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/50",
    iconBgPrimary: "bg-white/20 group-hover:bg-white/30",
    iconColor: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
    shimmer: "from-blue-500/0 via-blue-500/5 to-blue-500/0",
    shimmerPrimary: "from-white/0 via-white/20 to-white/0",
  },
  emerald: {
    primary: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30",
    secondary: "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-700/40 hover:border-emerald-300 dark:hover:border-emerald-600 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 hover:shadow-md hover:shadow-emerald-500/10",
    outline: "border-2 border-emerald-300 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    ghost: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-800/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700/50",
    iconBgPrimary: "bg-white/20 group-hover:bg-white/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    shimmer: "from-emerald-500/0 via-emerald-500/5 to-emerald-500/0",
    shimmerPrimary: "from-white/0 via-white/20 to-white/0",
  },
  purple: {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/30",
    secondary: "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-700/40 hover:border-purple-300 dark:hover:border-purple-600 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 hover:shadow-md hover:shadow-purple-500/10",
    outline: "border-2 border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    ghost: "hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30",
    iconBg: "bg-purple-100 dark:bg-purple-800/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-700/50",
    iconBgPrimary: "bg-white/20 group-hover:bg-white/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    shimmer: "from-purple-500/0 via-purple-500/5 to-purple-500/0",
    shimmerPrimary: "from-white/0 via-white/20 to-white/0",
  },
  amber: {
    primary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30",
    secondary: "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-700/40 hover:border-amber-300 dark:hover:border-amber-600 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 hover:shadow-md hover:shadow-amber-500/10",
    outline: "border-2 border-amber-300 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    ghost: "hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30",
    iconBg: "bg-amber-100 dark:bg-amber-800/50 group-hover:bg-amber-200 dark:group-hover:bg-amber-700/50",
    iconBgPrimary: "bg-white/20 group-hover:bg-white/30",
    iconColor: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
    shimmer: "from-amber-500/0 via-amber-500/5 to-amber-500/0",
    shimmerPrimary: "from-white/0 via-white/20 to-white/0",
  },
  red: {
    primary: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30",
    secondary: "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-700/40 hover:border-red-300 dark:hover:border-red-600 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/50 dark:hover:to-rose-900/50 hover:shadow-md hover:shadow-red-500/10",
    outline: "border-2 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300",
    ghost: "hover:bg-red-50 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30",
    iconBg: "bg-red-100 dark:bg-red-800/50 group-hover:bg-red-200 dark:group-hover:bg-red-700/50",
    iconBgPrimary: "bg-white/20 group-hover:bg-white/30",
    iconColor: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
    shimmer: "from-red-500/0 via-red-500/5 to-red-500/0",
    shimmerPrimary: "from-white/0 via-white/20 to-white/0",
  },
  gray: {
    primary: "bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white shadow-md shadow-gray-500/25 hover:shadow-lg hover:shadow-gray-500/30",
    secondary: "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/30 dark:to-slate-800/30 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-800/50 dark:hover:to-slate-800/50 hover:shadow-md hover:shadow-gray-500/10",
    outline: "border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200",
    ghost: "hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30",
    iconBg: "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 group-hover:bg-gray-200 dark:group-hover:bg-gray-600/50",
    iconBgPrimary: "bg-white/20 group-hover:bg-white/30",
    iconColor: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300",
    shimmer: "from-gray-500/0 via-gray-500/5 to-gray-500/0",
    shimmerPrimary: "from-white/0 via-white/20 to-white/0",
  },
};

const sizeStyles = {
  sm: {
    button: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    icon: "w-4 h-4 rounded",
    iconInner: "w-2.5 h-2.5",
  },
  md: {
    button: "px-4 py-2 text-xs rounded-xl gap-2",
    icon: "w-5 h-5 rounded-md",
    iconInner: "w-3 h-3",
  },
  lg: {
    button: "px-5 py-2.5 text-sm rounded-xl gap-2.5",
    icon: "w-6 h-6 rounded-md",
    iconInner: "w-3.5 h-3.5",
  },
};

export default function ActionButton({
  children,
  label,
  icon,
  onClick,
  variant = "primary",
  color = "blue",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}: ActionButtonProps) {
  // Use label as fallback for children
  const displayText = children || label;
  const colorStyle = colorStyles[color];
  const sizeStyle = sizeStyles[size];
  const isPrimary = variant === "primary";

  const renderedIcon = (() => {
    if (!icon) return null;
    if (isValidElement(icon)) return icon;

    // LucideIcon (forwardRef) is an object with $$typeof/render; also allow function components.
    if (typeof icon === "function" || (typeof icon === "object" && icon !== null)) {
      return createElement(icon as unknown as LucideIcon, { className: "w-full h-full" });
    }

    // Strings/numbers/etc are valid ReactNode
    return icon;
  })();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center font-medium transition-all duration-300 cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyle.button} ${colorStyle[variant]} ${className}`}
    >
      {/* Shimmer effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${isPrimary ? colorStyle.shimmerPrimary : colorStyle.shimmer} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700`}
      />

      {/* Icon container */}
      {renderedIcon && (
        <div
          className={`relative flex items-center justify-center ${sizeStyle.icon} ${isPrimary ? colorStyle.iconBgPrimary : colorStyle.iconBg} transition-colors duration-300`}
        >
          <div className={`${sizeStyle.iconInner} ${isPrimary ? "" : colorStyle.iconColor}`}>
            {renderedIcon}
          </div>
        </div>
      )}

      {/* Text */}
      <span className="relative">{displayText}</span>
    </button>
  );
}
