import { LucideIcon } from "lucide-react";
import MenuIcon from "./MenuIcon";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  className?: string;
}

export default function MenuItem({
  icon,
  label,
  onClick,
  variant = "default",
  className = "",
}: MenuItemProps) {
  const baseClasses = "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer";

  const variantClasses = {
    default: "text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-[#252930] midnight:hover:bg-[#1a3a52] purple:hover:bg-[#3d1f5c]",
    danger: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 midnight:hover:bg-red-500/10 purple:hover:bg-red-500/10",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role="menuitem"
    >
      <MenuIcon icon={icon} variant={variant} />
      <span>{label}</span>
    </button>
  );
}
