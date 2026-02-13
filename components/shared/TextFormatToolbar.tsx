"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";
import type { FontFamily, TextAlign } from "../shared/Whiteboard/whiteboard-types";
import { FONT_FAMILIES, FONT_SIZES } from "../shared/Whiteboard/whiteboard-types";

// ─── Toolbar Toggle Button ─────────────────────────────────────────────

export function ToolbarButton({
  active,
  onClick,
  title,
  children,
  size = "md",
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center ${sizeClass} rounded-lg transition-all duration-100 cursor-pointer ${
        active
          ? "bg-blue-100 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400 midnight:bg-cyan-500/25 midnight:text-cyan-400 purple:bg-pink-500/25 purple:text-pink-400 ring-1 ring-blue-400/30 dark:ring-blue-500/30 midnight:ring-cyan-500/30 purple:ring-pink-500/30"
          : "text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
      }`}
      title={title}
    >
      {children}
    </button>
  );
}

// ─── Text Format Controls ───────────────────────────────────────────────

export interface TextFormatState {
  fontFamily: FontFamily;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textDecoration: "none" | "underline";
  textAlign: TextAlign;
}

interface TextFormatToolbarProps {
  /** Current formatting state */
  format: TextFormatState;
  /** Called when any formatting changes */
  onChange: (updates: Partial<TextFormatState>) => void;
  /** Compact mode for embedding inside panels */
  compact?: boolean;
  /** Available font sizes (defaults to FONT_SIZES from types) */
  fontSizes?: number[];
  /** Show +/- buttons around font size */
  showSizeButtons?: boolean;
}

/**
 * Shared text formatting toolbar with font family, size, B/I/U, and alignment controls.
 * Can be used standalone or embedded inside other panels.
 */
export default function TextFormatToolbar({
  format,
  onChange,
  compact = false,
  fontSizes = FONT_SIZES,
  showSizeButtons = true,
}: TextFormatToolbarProps) {
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const fontRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!showFontDropdown && !showSizeDropdown) return;
    const handler = (e: MouseEvent) => {
      if (showFontDropdown && fontRef.current && !fontRef.current.contains(e.target as Node)) {
        setShowFontDropdown(false);
      }
      if (showSizeDropdown && sizeRef.current && !sizeRef.current.contains(e.target as Node)) {
        setShowSizeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showFontDropdown, showSizeDropdown]);

  const decrease = () => {
    const idx = fontSizes.findIndex((s) => s >= format.fontSize);
    const prev = idx > 0 ? fontSizes[idx - 1] : fontSizes[0];
    onChange({ fontSize: prev });
  };

  const increase = () => {
    const idx = fontSizes.findIndex((s) => s > format.fontSize);
    const next = idx >= 0 ? fontSizes[idx] : fontSizes[fontSizes.length - 1];
    onChange({ fontSize: next });
  };

  const btnSize = compact ? "sm" : "md";
  const iconClass = compact ? "w-3.5 h-3.5" : "w-4 h-4";
  const dividerClass = compact
    ? "w-px h-5 bg-gray-200 dark:bg-gray-600 midnight:bg-cyan-500/20 purple:bg-pink-500/20"
    : "w-px h-6 bg-gray-300 dark:bg-gray-600 midnight:bg-cyan-500/20 purple:bg-pink-500/20 mx-0.5";

  return (
    <div className={`flex ${compact ? "flex-wrap" : ""} items-center gap-1`}>
      {/* Font family dropdown */}
      <div ref={fontRef} className="relative">
        <button
          onClick={() => { setShowFontDropdown(!showFontDropdown); setShowSizeDropdown(false); }}
          className={`flex items-center gap-0.5 rounded-${compact ? "md" : "lg"} text-${compact ? "[10px]" : "xs"} ${compact ? "font-medium" : "font-semibold"} text-gray-${compact ? "600" : "700"} dark:text-gray-${compact ? "300" : "200"} midnight:text-cyan-${compact ? "200" : "100"} purple:text-pink-${compact ? "200" : "100"} bg-gray-50 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer ${compact ? "px-1.5 py-1 max-w-[90px]" : "px-2.5 h-8 min-w-[100px]"} truncate`}
          style={{ fontFamily: `${format.fontFamily}, system-ui, sans-serif` }}
          title="Font family"
        >
          <span className="truncate">{format.fontFamily}</span>
          <ChevronDown className={`${compact ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} flex-shrink-0 opacity-60 transition-transform ${showFontDropdown ? "rotate-180" : ""}`} />
        </button>
        {showFontDropdown && (
          <div className={`absolute left-0 top-full mt-1 z-[80] ${compact ? "w-[160px]" : "w-[180px]"} max-h-[200px] overflow-y-auto scrollbar-thin bg-white dark:bg-gray-800 midnight:bg-[#111827] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/25 purple:border-pink-500/25 rounded-lg shadow-xl`}>
            {FONT_FAMILIES.map((font) => (
              <button
                key={font}
                onClick={() => { onChange({ fontFamily: font }); setShowFontDropdown(false); }}
                className={`w-full text-left px-2.5 py-1.5 text-[11px] transition-colors cursor-pointer ${
                  format.fontFamily === font
                    ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 midnight:bg-cyan-500/15 midnight:text-cyan-400 purple:bg-pink-500/15 purple:text-pink-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                style={{ fontFamily: `${font}, system-ui, sans-serif` }}
              >
                {font}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font size */}
      <div ref={sizeRef} className="relative flex items-center gap-0.5">
        {showSizeButtons && (
          <button
            onClick={decrease}
            className={`flex items-center justify-center ${compact ? "w-5 h-5" : "w-7 h-8"} rounded-lg text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer`}
            title="Decrease font size"
          >
            <Minus className={compact ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} />
          </button>
        )}
        <button
          onClick={() => { setShowSizeDropdown(!showSizeDropdown); setShowFontDropdown(false); }}
          className={`flex items-center justify-center ${compact ? "px-1 py-1 w-[36px] text-[10px]" : "min-w-[38px] h-8 px-1.5 text-xs"} font-bold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-gray-50 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-${compact ? "md" : "lg"} cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
        >
          {format.fontSize}
        </button>
        {showSizeButtons && (
          <button
            onClick={increase}
            className={`flex items-center justify-center ${compact ? "w-5 h-5" : "w-7 h-8"} rounded-lg text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer`}
            title="Increase font size"
          >
            <Plus className={compact ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} />
          </button>
        )}
        {showSizeDropdown && (
          <div className={`absolute left-0 top-full mt-1 z-[80] w-[60px] max-h-[200px] overflow-y-auto scrollbar-thin bg-white dark:bg-gray-800 midnight:bg-[#111827] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl`}>
            {fontSizes.map((size) => (
              <button
                key={size}
                onClick={() => { onChange({ fontSize: size }); setShowSizeDropdown(false); }}
                className={`w-full text-center px-2 py-1.5 text-[11px] transition-colors cursor-pointer ${
                  format.fontSize === size
                    ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className={dividerClass} />

      {/* B / I / U */}
      <ToolbarButton
        active={format.fontWeight === "bold"}
        onClick={() => onChange({ fontWeight: format.fontWeight === "bold" ? "normal" : "bold" })}
        title="Bold"
        size={btnSize}
      >
        <Bold className={iconClass} />
      </ToolbarButton>
      <ToolbarButton
        active={format.fontStyle === "italic"}
        onClick={() => onChange({ fontStyle: format.fontStyle === "italic" ? "normal" : "italic" })}
        title="Italic"
        size={btnSize}
      >
        <Italic className={iconClass} />
      </ToolbarButton>
      <ToolbarButton
        active={format.textDecoration === "underline"}
        onClick={() => onChange({ textDecoration: format.textDecoration === "underline" ? "none" : "underline" })}
        title="Underline"
        size={btnSize}
      >
        <Underline className={iconClass} />
      </ToolbarButton>

      {/* Divider */}
      <div className={dividerClass} />

      {/* Alignment */}
      <ToolbarButton
        active={format.textAlign === "left"}
        onClick={() => onChange({ textAlign: "left" })}
        title="Align left"
        size={btnSize}
      >
        <AlignLeft className={iconClass} />
      </ToolbarButton>
      <ToolbarButton
        active={format.textAlign === "center"}
        onClick={() => onChange({ textAlign: "center" })}
        title="Align center"
        size={btnSize}
      >
        <AlignCenter className={iconClass} />
      </ToolbarButton>
      <ToolbarButton
        active={format.textAlign === "right"}
        onClick={() => onChange({ textAlign: "right" })}
        title="Align right"
        size={btnSize}
      >
        <AlignRight className={iconClass} />
      </ToolbarButton>
    </div>
  );
}
