"use client";

/**
 * TextFormatToolbar — Shared floating toolbar for text formatting.
 * Used by textbox, table cell, and shape text editing in the slide editor.
 * Respects all available themes.
 */

import React from "react";
import { createPortal } from "react-dom";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { ColorPickerPopover } from "@/components/shared/ColorPalettePicker";

// ── Font options ──

export const FONT_OPTIONS = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Arial Black", value: "Arial Black, sans-serif" },
  { label: "Calibri", value: "Calibri, sans-serif" },
  { label: "Cambria", value: "Cambria, serif" },
  { label: "Comic Sans MS", value: "Comic Sans MS, cursive" },
  { label: "Consolas", value: "Consolas, monospace" },
  { label: "Courier New", value: "Courier New, monospace" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Impact", value: "Impact, sans-serif" },
  { label: "Lucida Console", value: "Lucida Console, monospace" },
  { label: "Palatino", value: "Palatino Linotype, serif" },
  { label: "Segoe UI", value: "Segoe UI, sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];

export const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

// ── Shared style constants ──

const activeBtn = "bg-blue-100 text-blue-700 dark:bg-[#22262e] dark:text-gray-100 dark:border dark:border-gray-600 midnight:bg-cyan-500/15 midnight:text-cyan-400 midnight:border midnight:border-cyan-500/30 purple:bg-pink-500/15 purple:text-pink-400 purple:border purple:border-pink-500/30";
const inactiveBtn = "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5";
const divider = "w-px h-6 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]";

// ── Props ──

export interface TextFormatToolbarProps {
  /** Anchor element rect — toolbar positions above this */
  anchorRect: DOMRect;
  /** Current values */
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  textColor?: string;
  fillColor?: string;
  wrap?: boolean;
  /** Which controls to show */
  showFontFamily?: boolean;
  showFontSize?: boolean;
  showBold?: boolean;
  showItalic?: boolean;
  showUnderline?: boolean;
  showAlign?: boolean;
  showVerticalAlign?: boolean;
  showWrap?: boolean;
  showTextColor?: boolean;
  showFillColor?: boolean;
  showClose?: boolean;
  /** Callbacks */
  onFontFamilyChange?: (v: string) => void;
  onFontSizeChange?: (v: number) => void;
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  onAlignChange?: (v: "left" | "center" | "right") => void;
  onVerticalAlignChange?: (v: "top" | "middle" | "bottom") => void;
  onWrapToggle?: () => void;
  onTextColorChange?: (c: string) => void;
  onFillColorChange?: (c: string) => void;
  onClose?: () => void;
}

export default function TextFormatToolbar({
  anchorRect,
  fontFamily = "Inter, sans-serif",
  fontSize = 18,
  bold = false,
  italic = false,
  align = "left",
  verticalAlign = "top",
  textColor = "#1a1a2e",
  fillColor = "transparent",
  wrap = true,
  showFontFamily = true,
  showFontSize = true,
  showBold = true,
  showItalic = true,
  showUnderline = false,
  showAlign = true,
  showVerticalAlign = true,
  showWrap = true,
  showTextColor = true,
  showFillColor = true,
  showClose = true,
  onFontFamilyChange,
  onFontSizeChange,
  onBold,
  onItalic,
  onUnderline,
  onAlignChange,
  onVerticalAlignChange,
  onWrapToggle,
  onTextColorChange,
  onFillColorChange,
  onClose,
}: TextFormatToolbarProps) {
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left?: number; right?: number } | null>(null);

  // Measure toolbar after render and position above the anchor
  React.useEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;
    const toolbarW = el.offsetWidth;
    const toolbarH = el.offsetHeight;
    // Always above the anchor's top edge, clamped to viewport top (never below)
    const top = Math.max(4, anchorRect.top - toolbarH - 8);
    // Horizontal: clamp so toolbar stays within viewport
    let left = anchorRect.left;
    if (left + toolbarW > window.innerWidth - 8) left = window.innerWidth - toolbarW - 8;
    if (left < 8) left = 8;
    setPos({ top, left });
  }, [anchorRect.top, anchorRect.left, anchorRect.bottom, anchorRect.right]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={toolbarRef}
      className="fixed z-[10002] rounded-xl bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? 0,
        maxWidth: "calc(100vw - 16px)",
        visibility: pos ? "visible" : "hidden",
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1 px-2 py-1.5">
        {/* Font family */}
        {showFontFamily && onFontFamilyChange && (
          <CustomDropdown
            value={fontFamily}
            options={FONT_OPTIONS}
            onChange={(v) => onFontFamilyChange(String(v))}
            className="w-[130px]"
          />
        )}

        {/* Font size */}
        {showFontSize && onFontSizeChange && (
          <CustomDropdown
            value={fontSize}
            options={FONT_SIZES.map(s => ({ label: `${s}`, value: s }))}
            onChange={(v) => onFontSizeChange(Number(v))}
            className="w-[64px]"
          />
        )}

        {(showFontFamily || showFontSize) && <div className={divider} />}

        {/* Bold */}
        {showBold && onBold && (
          <button onMouseDown={(e) => { e.preventDefault(); onBold(); }}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold cursor-pointer transition-all ${bold ? activeBtn : inactiveBtn}`}
            title="Bold (Ctrl+B)">B</button>
        )}

        {/* Italic */}
        {showItalic && onItalic && (
          <button onMouseDown={(e) => { e.preventDefault(); onItalic(); }}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] italic cursor-pointer transition-all ${italic ? activeBtn : inactiveBtn}`}
            title="Italic (Ctrl+I)">I</button>
        )}

        {/* Underline */}
        {showUnderline && onUnderline && (
          <button onMouseDown={(e) => { e.preventDefault(); onUnderline(); }}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] underline cursor-pointer transition-all ${inactiveBtn}`}
            title="Underline (Ctrl+U)">U</button>
        )}

        {(showBold || showItalic || showUnderline) && <div className={divider} />}

        {/* Horizontal alignment */}
        {showAlign && onAlignChange && (["left", "center", "right"] as const).map(a => (
          <button key={a} onMouseDown={(e) => { e.preventDefault(); onAlignChange(a); }}
            className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all ${align === a ? activeBtn : inactiveBtn}`}
            title={`Align ${a}`}>
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {a === "left" && <><line x1="1" y1="4" x2="15" y2="4"/><line x1="1" y1="8" x2="10" y2="8"/><line x1="1" y1="12" x2="13" y2="12"/></>}
              {a === "center" && <><line x1="1" y1="4" x2="15" y2="4"/><line x1="3.5" y1="8" x2="12.5" y2="8"/><line x1="2" y1="12" x2="14" y2="12"/></>}
              {a === "right" && <><line x1="1" y1="4" x2="15" y2="4"/><line x1="6" y1="8" x2="15" y2="8"/><line x1="3" y1="12" x2="15" y2="12"/></>}
            </svg>
          </button>
        ))}

        {/* Wrap toggle */}
        {showWrap && onWrapToggle && (
          <>
            <div className={divider} />
            <button onMouseDown={(e) => { e.preventDefault(); onWrapToggle(); }}
              className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all ${wrap ? activeBtn : inactiveBtn}`}
              title="Text wrap">
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="1" y1="4" x2="15" y2="4"/><line x1="1" y1="8" x2="11" y2="8"/><path d="M11 8 C14 8 14 12 11 12 L6 12" /><polyline points="8,10 6,12 8,14" />
              </svg>
            </button>
          </>
        )}

        {/* Vertical alignment */}
        {showVerticalAlign && onVerticalAlignChange && (
          <>
            <div className={divider} />
            {(["top", "middle", "bottom"] as const).map(va => (
              <button key={va} onMouseDown={(e) => { e.preventDefault(); onVerticalAlignChange(va); }}
                className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all ${verticalAlign === va ? activeBtn : inactiveBtn}`}
                title={`Vertical ${va}`}>
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  {va === "top" && <><rect x="2" y="2" width="12" height="12" rx="1.5" strokeWidth="1" /><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="9" y2="8"/></>}
                  {va === "middle" && <><rect x="2" y="2" width="12" height="12" rx="1.5" strokeWidth="1" /><line x1="5" y1="6.5" x2="11" y2="6.5"/><line x1="5" y1="9.5" x2="9" y2="9.5"/></>}
                  {va === "bottom" && <><rect x="2" y="2" width="12" height="12" rx="1.5" strokeWidth="1" /><line x1="5" y1="8" x2="9" y2="8"/><line x1="5" y1="11" x2="11" y2="11"/></>}
                </svg>
              </button>
            ))}
          </>
        )}

        {(showTextColor || showFillColor) && <div className={divider} />}

        {/* Text color */}
        {showTextColor && onTextColorChange && (
          <ColorPickerPopover selectedColor={textColor} onSelect={onTextColorChange} mode="matrix" label="Text Color" align="right" width={272}>
            <button className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer ${inactiveBtn} relative`} title="Text color">
              <span className="text-[13px] font-bold" style={{ color: textColor }}>A</span>
              <div className="absolute bottom-1 left-2 right-2 h-[2.5px] rounded-full" style={{ backgroundColor: textColor }} />
            </button>
          </ColorPickerPopover>
        )}

        {/* Fill color */}
        {showFillColor && onFillColorChange && (
          <ColorPickerPopover selectedColor={fillColor} onSelect={onFillColorChange} mode="matrix" label="Fill" align="right" width={272}>
            <button className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer ${inactiveBtn}`} title="Fill color">
              <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30" style={{ backgroundColor: fillColor }} />
            </button>
          </ColorPickerPopover>
        )}

        {/* Close */}
        {showClose && onClose && (
          <>
            <div className={divider} />
            <button onMouseDown={(e) => { e.preventDefault(); onClose(); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              title="Close (Esc)">
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
