import { LucideIcon } from "lucide-react";

interface MenuIconProps {
  icon: LucideIcon;
  variant?: "default" | "danger";
  className?: string;
}

export default function MenuIcon({
  icon: Icon,
  variant = "default",
  className = "",
}: MenuIconProps) {
  const variantClasses = {
    default: "w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400",
    danger: "w-4 h-4",
  };

  return <Icon className={`${variantClasses[variant]} ${className}`} />;
}
