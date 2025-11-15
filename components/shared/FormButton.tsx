"use client";

import { ReactNode } from "react";

interface FormButtonProps {
  children: ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  className?: string;
}

export default function FormButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  icon,
  className = "",
}: FormButtonProps) {
  const baseClasses = "px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2";

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 midnight:from-cyan-600 midnight:to-purple-600 midnight:hover:from-cyan-700 midnight:hover:to-purple-700 purple:from-pink-600 purple:to-purple-600 purple:hover:from-pink-700 purple:hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
    secondary: "border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
      {icon && icon}
    </button>
  );
}
