"use client";

interface NameLabelProps {
  name: string;
  className?: string;
  variant?: "default" | "compact" | "large";
}

export default function NameLabel({
  name,
  className = "",
  variant = "default",
}: NameLabelProps) {
  // Size variants
  const sizeClasses = {
    compact: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base",
  };

  return (
    <div
      className={`
        inline-block
        ${sizeClasses[variant]}
        rounded-lg
        bg-gray-900 dark:bg-[#1a1d24]
        midnight:bg-gray-950 purple:bg-gray-950
        text-white
        font-medium
        shadow-md
        whitespace-nowrap
        ${className}
      `}
    >
      {name}
    </div>
  );
}
