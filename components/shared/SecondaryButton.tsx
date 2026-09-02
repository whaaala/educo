"use client";

import { ReactNode, isValidElement, createElement } from "react";
import { LucideIcon } from "lucide-react";

interface SecondaryButtonProps {
  label?: string;
  children?: ReactNode;
  icon?: LucideIcon | ReactNode;
  onClick?: () => void;
  className?: string;
  hideTextOnMobile?: boolean;
}

export default function SecondaryButton({
  label,
  children,
  icon,
  onClick,
  className = "",
  hideTextOnMobile = true,
}: SecondaryButtonProps) {
  // Support both label prop and children
  const displayText = children || label;

  // Render icon - support both LucideIcon component and rendered JSX element
  const renderIcon = () => {
    if (!icon) return null;

    // If it's already a rendered element, use it as-is
    if (isValidElement(icon)) {
      return icon;
    }

    // If it's a LucideIcon component, render it
    if (typeof icon === "function") {
      return createElement(icon as LucideIcon, { className: "w-4 h-4" });
    }

    return null;
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330]/80 purple:bg-[#251340]/80 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 rounded-lg border border-line hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm font-medium ${className}`}
    >
      {renderIcon()}
      {displayText && (
        <span className={hideTextOnMobile ? "hidden sm:inline" : ""}>{displayText}</span>
      )}
    </button>
  );
}
