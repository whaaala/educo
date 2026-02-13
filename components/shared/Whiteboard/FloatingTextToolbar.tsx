"use client";

import { useRef } from "react";
import type { FontFamily, TextAlign, WhiteboardElement, Viewport } from "./whiteboard-types";
import { getBoundingBox } from "./whiteboard-utils";
import TextFormatToolbar from "../TextFormatToolbar";
import type { TextFormatState } from "../TextFormatToolbar";

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
  const toolbarRef = useRef<HTMLDivElement>(null);

  const bbox = getBoundingBox(element);
  if (!bbox) return null;

  // Center the toolbar above the element
  const elCenterX = bbox.x * viewport.zoom + viewport.x + (bbox.width * viewport.zoom) / 2;
  const TOOLBAR_BASE_OFFSET = 54; // existing visual alignment
  const TOOLBAR_GAP = 32; // extra breathing room between toolbar and text box
  const TOOLBAR_MARGIN = 12; // keep away from container edges

  const preferredTopY = bbox.y * viewport.zoom + viewport.y - (TOOLBAR_BASE_OFFSET + TOOLBAR_GAP);
  const fallbackBelowY =
    bbox.y * viewport.zoom + viewport.y + bbox.height * viewport.zoom + TOOLBAR_GAP;

  // If there's not enough room above, render below the element.
  const topY = preferredTopY < TOOLBAR_MARGIN ? fallbackBelowY : preferredTopY;

  const format: TextFormatState = {
    fontFamily: activeFontFamily,
    fontSize: activeFontSize,
    fontWeight: activeFontWeight,
    fontStyle: activeFontStyle,
    textDecoration: activeTextDecoration,
    textAlign: activeTextAlign,
  };

  const handleChange = (updates: Partial<TextFormatState>) => {
    if (updates.fontFamily) onFontFamilyChange(updates.fontFamily);
    if (updates.fontSize !== undefined) onFontSizeChange(updates.fontSize);
    if (updates.fontWeight) onFontWeightToggle();
    if (updates.fontStyle) onFontStyleToggle();
    if (updates.textDecoration) onTextDecorationToggle();
    if (updates.textAlign) onTextAlignChange(updates.textAlign);
  };

  return (
    <div
      ref={toolbarRef}
      className="absolute z-[70] px-2 py-1.5 bg-white dark:bg-gray-800 midnight:bg-[#111827] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-xl shadow-xl shadow-black/15 dark:shadow-black/40 select-none"
      style={{
        left: elCenterX,
        top: topY,
        transform: "translateX(-50%)",
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <TextFormatToolbar
        format={format}
        onChange={handleChange}
      />
    </div>
  );
}
