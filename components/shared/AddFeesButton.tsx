"use client";

interface AddFeesButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  currency?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function AddFeesButton({
  onClick,
  currency = "₦",
  label = "Add Fees",
  size = "md",
  className = "",
}: AddFeesButtonProps) {
  // Size variants
  const sizeClasses = {
    sm: "px-2 py-1 text-[10px] gap-1",
    md: "px-3 py-1.5 text-xs gap-1.5",
    lg: "px-4 py-2 text-sm gap-2",
  };

  const iconSizes = {
    sm: "text-[11px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        rounded-lg
        bg-blue-50/50 hover:bg-blue-100/70
        dark:bg-blue-900/10 dark:hover:bg-blue-900/20
        midnight:bg-cyan-900/10 midnight:hover:bg-cyan-900/20
        purple:bg-pink-900/10 purple:hover:bg-pink-900/20
        text-blue-700 hover:text-blue-800
        dark:text-blue-400 dark:hover:text-blue-300
        midnight:text-cyan-400 midnight:hover:text-cyan-300
        purple:text-pink-400 purple:hover:text-pink-300
        border border-blue-200/40 hover:border-blue-300/60
        dark:border-blue-700/20 dark:hover:border-blue-700/30
        midnight:border-cyan-700/20 midnight:hover:border-cyan-700/30
        purple:border-pink-700/20 purple:hover:border-pink-700/30
        font-medium
        transition-all duration-200
        hover:shadow-sm
        active:scale-95
        whitespace-nowrap
        cursor-pointer
        ${className}
      `}
      title={label}
    >
      <span className={`font-bold leading-none ${iconSizes[size]}`}>
        {currency}
      </span>
      <span className="leading-none">{label}</span>
    </button>
  );
}
