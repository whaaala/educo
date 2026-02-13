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
  const toolbarRef = useRef<HTMLDivElement>(null);

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

  // Center the toolbar above the element
  const elCenterX = bbox.x * viewport.zoom + viewport.x + (bbox.width * viewport.zoom) / 2;
  const topY = bbox.y * viewport.zoom + viewport.y - 54;

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

  return (
    <div
      ref={toolbarRef}
      className="absolute z-[70] flex items-center gap-1 px-2 py-1.5 bg-white dark:bg-gray-800 midnight:bg-[#111827] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-xl shadow-xl shadow-black/15 dark:shadow-black/40 select-none"
      style={{
        left: elCenterX,
        top: topY,
        transform: "translateX(-50%)",
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Font family dropdown */}
      <div ref={fontRef} className="relative">
        <button
          onClick={() => { setShowFontDropdown(!showFontDropdown); setShowSizeDropdown(false); }}
          className="flex items-center gap-1 px-2.5 h-8 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-gray-50 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-100 dark:hover:bg-gray-600 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer min-w-[100px]"
          style={{ fontFamily: `${activeFontFamily}, system-ui, sans-serif` }}
          title="Font family"
        >
          <span className="truncate">{activeFontFamily}</span>
          <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 opacity-60 transition-transform ${showFontDropdown ? "rotate-180" : ""}`} />
        </button>
        {showFontDropdown && (
          <div className="absolute left-0 top-full mt-1.5 z-[80] w-[180px] max-h-[240px] overflow-y-auto scrollbar-thin bg-white dark:bg-gray-800 midnight:bg-[#111827] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/25 purple:border-pink-500/25 rounded-xl shadow-2xl shadow-black/20 dark:shadow-black/50">
            {FONT_FAMILIES.map((font) => (
              <button
                key={font}
                onClick={() => { onFontFamilyChange(font); setShowFontDropdown(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                  activeFontFamily === font
                    ? "bg-blue-50 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
                style={{ fontFamily: `${font}, system-ui, sans-serif` }}
              >
                {font}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 midnight:bg-cyan-500/20 purple:bg-pink-500/20 mx-0.5" />

      {/* Font size */}
      <div ref={sizeRef} className="relative flex items-center gap-0.5">
        <button
          onClick={decrease}
          className="flex items-center justify-center w-7 h-8 rounded-lg text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
          title="Decrease font size"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => { setShowSizeDropdown(!showSizeDropdown); setShowFontDropdown(false); }}
          className="flex items-center justify-center min-w-[38px] h-8 px-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-gray-50 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          {activeFontSize}
        </button>
        <button
          onClick={increase}
          className="flex items-center justify-center w-7 h-8 rounded-lg text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
          title="Increase font size"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        {showSizeDropdown && (
          <div className="absolute left-0 top-full mt-1.5 z-[80] w-[70px] max-h-[200px] overflow-y-auto scrollbar-thin bg-white dark:bg-gray-800 midnight:bg-[#111827] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 rounded-xl shadow-2xl shadow-black/20 dark:shadow-black/50">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => { onFontSizeChange(size); setShowSizeDropdown(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  activeFontSize === size
                    ? "bg-blue-50 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 midnight:bg-cyan-500/20 purple:bg-pink-500/20 mx-0.5" />

      {/* B / I / U */}
      <ToolbarButton active={activeFontWeight === "bold"} onClick={onFontWeightToggle} title="Bold">
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton active={activeFontStyle === "italic"} onClick={onFontStyleToggle} title="Italic">
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton active={activeTextDecoration === "underline"} onClick={onTextDecorationToggle} title="Underline">
        <Underline className="w-4 h-4" />
      </ToolbarButton>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 midnight:bg-cyan-500/20 purple:bg-pink-500/20 mx-0.5" />

      {/* Alignment */}
      <ToolbarButton active={activeTextAlign === "left"} onClick={() => onTextAlignChange("left")} title="Align left">
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton active={activeTextAlign === "center"} onClick={() => onTextAlignChange("center")} title="Align center">
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton active={activeTextAlign === "right"} onClick={() => onTextAlignChange("right")} title="Align right">
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-100 cursor-pointer ${
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
