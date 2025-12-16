"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Smile } from "lucide-react";
import type { EmojiClickData, Theme } from "emoji-picker-react";

// Dynamically import emoji picker to avoid SSR issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="w-[350px] h-[400px] flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading emojis...</span>
      </div>
    </div>
  ),
});

interface EmojiPickerPopoverProps {
  onEmojiSelect: (emoji: string) => void;
  position?: "top" | "bottom" | "top-right" | "bottom-right";
  theme?: "light" | "dark" | "auto";
  buttonClassName?: string;
  pickerWidth?: number;
  pickerHeight?: number;
  disabled?: boolean;
}

export default function EmojiPickerPopover({
  onEmojiSelect,
  position = "top",
  theme = "auto",
  buttonClassName,
  pickerWidth = 350,
  pickerHeight = 400,
  disabled = false,
}: EmojiPickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setIsOpen(false);
  };

  // Determine picker position classes
  const positionClasses = {
    top: "bottom-full left-0 mb-2",
    bottom: "top-full left-0 mt-2",
    "top-right": "bottom-full right-0 mb-2",
    "bottom-right": "top-full right-0 mt-2",
  };

  // Determine theme
  const getTheme = (): Theme => {
    if (theme === "auto") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "light";
    }
    return theme;
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={
          buttonClassName ||
          `p-2 rounded-lg transition-colors cursor-pointer ${
            isOpen
              ? "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
        }
        aria-label="Open emoji picker"
      >
        <Smile className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${positionClasses[position]} z-50 animate-in fade-in slide-in-from-bottom-2 duration-200`}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={pickerWidth}
            height={pickerHeight}
            theme={getTheme()}
            searchPlaceHolder="Search emojis..."
            previewConfig={{
              showPreview: true,
              defaultCaption: "Pick an emoji",
              defaultEmoji: "1f60a",
            }}
            skinTonesDisabled={false}
            lazyLoadEmojis={true}
          />
        </div>
      )}
    </div>
  );
}
