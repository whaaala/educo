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
} from "lucide-react";
import type { FontFamily, TextAlign, WhiteboardElement, Viewport } from "./whiteboard-types";
import { FONT_FAMILIES, FONT_SIZES } from "./whiteboard-types";
import { getBoundingBox } from "./whiteboard-utils";

interface FloatingTextToolbarProps {
  element: WhiteboardElement;
  viewport: Viewport;
  activeFontFamily: FontFamily;
  activeFontSize: number;
  activeFontWeight: "normal" | "bold";
  activeFontStyle: "normal" | "italic";
  activeTextDecoration: "none" | "underline";
  activeTextAlign: TextAlign;
  onFontFamilyChange: (font: FontFamily) => void;
  onFontSizeChange: (size: number) => void;
  onFontWeightToggle: () => void;
  onFontStyleToggle: () => void;
  onTextDecorationToggle: () => void;
  onTextAlignChange: (align: TextAlign) => void;
}

export default function FloatingTextToolbar({
  element,
  viewport,
  activeFontFamily,
  activeFontSize,
  activeFontWeight,
  activeFontStyle,
  activeTextDecoration,
  activeTextAlign,
  onFontFamilyChange,
  onFontSizeChange,
  onFontWeightToggle,
  onFontStyleToggle,
  onTextDecorationToggle,
  onTextAlignChange,
}: FloatingTextToolbarProps) {
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const fontRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fontRef.current && !fontRef.current.contains(e.target as Node)) {
        setShowFontDropdown(false);
      }
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) {
        setShowSizeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const bbox = getBoundingBox(element);
  if (!bbox) return null;

  // Position above the element
  const left = bbox.x * viewport.zoom + viewport.x;
  const top = bbox.y * viewport.zoom + viewport.y - 44;

  const decrease = () => {
    const idx = FONT_SIZES.findIndex((s) => s >= activeFontSize);
    const prev = idx > 0 ? FONT_SIZES[idx - 1] : FONT_SIZES[0];
    onFontSizeChange(prev);
  };

  const increase = () => {
    const idx = FONT_SIZES.findIndex((s) => s > activeFontSize);
    const next = idx >= 0 ? FONT_SIZES[idx] : FONT_SIZES[FONT_SIZES.length - 1];
    onFontSizeChange(next);
  };

  const btnBase = "flex items-center justify-center w-7 h-7 rounded-md transition-all duration-100 cursor-pointer";
  const btnActive = "bg-blue-500/15 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400";
  const btnInactive = "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10";

  return (
    <div
      className="absolute z-[55] flex items-center gap-0.5 px-1.5 py-1 bg-white/95 dark:bg-gray-800/95 midnight:bg-[#0d1526]/95 purple:bg-[#1f1035]/95 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/60 midnight:border-cyan-500/15 purple:border-pink-500/15 rounded-xl shadow-lg shadow-black/8 dark:shadow-black/30 select-none"
      style={{ left, top }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Font family */}
      <div ref={fontRef} className="relative">
        <button
          onClick={() => { setShowFontDropdown(!showFontDropdown); setShowSizeDropdown(false); }}
          className="flex items-center gap-0.5 px-1.5 h-7 rounded-md text-[10px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer max-w-[80px]"
          style={{ fontFamily: `${activeFontFamily}, system-ui, sans-serif` }}
          title="Font family"
        >
          <span className="truncate">{activeFontFamily}</span>
          <ChevronDown className="w-2.5 h-2.5 flex-shrink-0 opacity-50" />
        </button>
        {showFontDropdown && (
          <div className="absolute left-0 top-full mt-1 z-[60] w-[140px] max-h-[200px] overflow-y-auto scrollbar-thin bg-white dark:bg-gray-800 midnight:bg-[#0d1526] purple:bg-[#1f1035] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
            {FONT_FAMILIES.map((font) => (
              <button
                key={font}
                onClick={() => { onFontFamilyChange(font); setShowFontDropdown(false); }}
                className={`w-full text-left px-2 py-1 text-[10px] cursor-pointer ${
                  activeFontFamily === font
                    ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                style={{ fontFamily: `${font}, system-ui, sans-serif` }}
              >
                {font}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

      {/* Font size */}
      <div ref={sizeRef} className="relative flex items-center">
        <button onClick={decrease} className={`${btnBase} ${btnInactive} w-5 text-[11px] font-bold`} title="Decrease">−</button>
        <button
          onClick={() => { setShowSizeDropdown(!showSizeDropdown); setShowFontDropdown(false); }}
          className="flex items-center justify-center min-w-[28px] h-6 px-0.5 text-[10px] font-bold text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          {activeFontSize}
        </button>
        <button onClick={increase} className={`${btnBase} ${btnInactive} w-5 text-[11px] font-bold`} title="Increase">+</button>
        {showSizeDropdown && (
          <div className="absolute left-0 top-full mt-1 z-[60] w-[60px] max-h-[160px] overflow-y-auto scrollbar-thin bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => { onFontSizeChange(size); setShowSizeDropdown(false); }}
                className={`w-full text-left px-2 py-0.5 text-[10px] cursor-pointer ${
                  activeFontSize === size
                    ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

      {/* B / I / U */}
      <button onClick={onFontWeightToggle} className={`${btnBase} ${activeFontWeight === "bold" ? btnActive : btnInactive}`} title="Bold">
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button onClick={onFontStyleToggle} className={`${btnBase} ${activeFontStyle === "italic" ? btnActive : btnInactive}`} title="Italic">
        <Italic className="w-3.5 h-3.5" />
      </button>
      <button onClick={onTextDecorationToggle} className={`${btnBase} ${activeTextDecoration === "underline" ? btnActive : btnInactive}`} title="Underline">
        <Underline className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

      {/* Alignment */}
      <button onClick={() => onTextAlignChange("left")} className={`${btnBase} ${activeTextAlign === "left" ? btnActive : btnInactive}`} title="Left">
        <AlignLeft className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onTextAlignChange("center")} className={`${btnBase} ${activeTextAlign === "center" ? btnActive : btnInactive}`} title="Center">
        <AlignCenter className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onTextAlignChange("right")} className={`${btnBase} ${activeTextAlign === "right" ? btnActive : btnInactive}`} title="Right">
        <AlignRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
