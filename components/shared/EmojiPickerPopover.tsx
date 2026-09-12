"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Smile } from "lucide-react";
import type { EmojiClickData, Theme } from "emoji-picker-react";
import Portal from "./Portal";

// Dynamically import emoji picker to avoid SSR issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="w-[350px] h-[400px] flex items-center justify-center bg-surface rounded-2xl border border-line shadow-xl">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted">Loading emojis...</span>
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
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Calculate picker position based on button position
  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top = 0;
    let left = 0;

    // Calculate vertical position
    if (position === "top" || position === "top-right") {
      // Position above the button
      top = buttonRect.top - pickerHeight - 8;
      // If not enough space above, position below
      if (top < 10) {
        top = buttonRect.bottom + 8;
      }
    } else {
      // Position below the button
      top = buttonRect.bottom + 8;
      // If not enough space below, position above
      if (top + pickerHeight > viewportHeight - 10) {
        top = buttonRect.top - pickerHeight - 8;
      }
    }

    // Calculate horizontal position
    if (position === "top-right" || position === "bottom-right") {
      // Align to right edge of button
      left = buttonRect.right - pickerWidth;
      // If goes off left edge, align to left edge of button
      if (left < 10) {
        left = buttonRect.left;
      }
    } else {
      // Align to left edge of button
      left = buttonRect.left;
      // If goes off right edge, align to right edge of button
      if (left + pickerWidth > viewportWidth - 10) {
        left = buttonRect.right - pickerWidth;
      }
    }

    // Ensure picker stays within viewport
    top = Math.max(10, Math.min(top, viewportHeight - pickerHeight - 10));
    left = Math.max(10, Math.min(left, viewportWidth - pickerWidth - 10));

    setPickerPosition({ top, left });
  }, [position, pickerWidth, pickerHeight]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        pickerRef.current &&
        !pickerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", calculatePosition);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [isOpen, calculatePosition]);

  // Calculate position when opening
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen, calculatePosition]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    if (!disabled) {
      if (!isOpen) {
        calculatePosition();
      }
      setIsOpen(!isOpen);
    }
  };

  // Determine theme
  const getTheme = (): Theme => {
    if (theme === "auto") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" as Theme : "light" as Theme;
      }
      return "light" as Theme;
    }
    return theme as Theme;
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className={
          buttonClassName ||
          `p-2 rounded-lg transition-colors cursor-pointer ${
            isOpen
              ? "text-blue-600 bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
        }
        aria-label="Open emoji picker"
      >
        <Smile className="w-5 h-5" />
      </button>

      {isOpen && (
        <Portal>
          <div
            ref={pickerRef}
            className="fixed z-[99999] animate-in fade-in zoom-in-95 duration-200"
            style={{
              top: pickerPosition.top,
              left: pickerPosition.left,
            }}
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
        </Portal>
      )}
    </>
  );
}
