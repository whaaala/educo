"use client";

import { ReactNode, useRef, useEffect } from "react";

interface FormTextareaProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  optional?: boolean;
}

export default function FormTextarea({
  label,
  icon,
  iconBgColor = "bg-gray-100 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50",
  iconColor = "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400",
  value,
  onChange,
  placeholder = "",
  rows = 4,
  optional = false,
}: FormTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate minimum height based on rows (approximately 2.5rem per row including padding)
  const minHeight = rows * 40; // 40px per row (2.5rem base + padding)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to calculate scrollHeight correctly
      textarea.style.height = "auto";
      // Set height to scrollHeight or minimum height, whichever is larger
      const newHeight = Math.max(textarea.scrollHeight, minHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value, minHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
        <div className={`w-4 h-4 rounded ${iconBgColor} flex items-center justify-center flex-shrink-0 opacity-70`}>
          <div className={`w-2.5 h-2.5 ${iconColor}`}>{icon}</div>
        </div>
        <span>{label}</span>
        {optional && (
          <span className="text-xs text-gray-400 dark:text-gray-500">(Optional)</span>
        )}
      </label>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          style={{ minHeight: `${minHeight}px` }}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 midnight:placeholder:text-cyan-400/50 purple:placeholder:text-pink-400/50 placeholder:font-normal focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 midnight:focus:ring-cyan-500/10 purple:focus:ring-pink-500/10 focus:border-blue-400 dark:focus:border-blue-500 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-y overflow-hidden"
        />
      </div>
    </div>
  );
}
