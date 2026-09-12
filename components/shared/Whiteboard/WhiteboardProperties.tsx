"use client";

import type { WhiteboardTool } from "./whiteboard-types";
import { DEFAULT_COLORS, FILL_COLORS, FILL_TOOLS, STICKY_COLORS, STROKE_WIDTHS } from "./whiteboard-types";
import { ColorGrid } from "@/components/shared/ColorPalettePicker";

interface WhiteboardPropertiesProps {
  activeTool: WhiteboardTool;
  activeColor: string;
  activeStrokeWidth: number;
  activeFontSize: number;
  activeStickyColor: string;
  activeFillColor: string | null;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onFontSizeChange: (size: number) => void;
  onStickyColorChange: (color: string) => void;
  onFillColorChange: (color: string | null) => void;
}

export default function WhiteboardProperties({
  activeTool,
  activeColor,
  activeStrokeWidth,
  activeFontSize,
  activeStickyColor,
  activeFillColor,
  onColorChange,
  onStrokeWidthChange,
  onFontSizeChange,
  onStickyColorChange,
  onFillColorChange,
}: WhiteboardPropertiesProps) {
  // Don't show properties for select, eraser, or hand
  if (activeTool === "select" || activeTool === "eraser" || activeTool === "hand") return null;

  const showStrokeWidth = [
    "pen", "highlighter", "line", "arrow", "double-arrow", "connector",
    "rectangle", "circle", "triangle", "diamond", "star", "hexagon",
    "rounded-rect", "cylinder", "parallelogram",
    "flowchart-process", "flowchart-decision", "flowchart-terminal",
    "flowchart-data", "flowchart-document",
  ].includes(activeTool);
  const showFontSize = activeTool === "text";
  const showStickyColors = activeTool === "sticky";
  const showFillColors = FILL_TOOLS.includes(activeTool);

  return (
    <div className="flex flex-col gap-3 p-3 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] border-r border-line shadow-sm w-[60px] items-center">
      {/* Color picker */}
      <div className="flex flex-col gap-1.5 items-center">
        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50">
          Color
        </span>
        <ColorGrid colors={DEFAULT_COLORS} selectedColor={activeColor} onSelect={onColorChange} columns={2} />
      </div>

      {/* Fill color picker */}
      {showFillColors && (
        <div className="flex flex-col gap-1.5 items-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50">
            Fill
          </span>
          <ColorGrid
            colors={FILL_COLORS.filter((c): c is string => c !== null)}
            selectedColor={activeFillColor}
            onSelect={onFillColorChange}
            columns={2}
            allowNoFill
            noFillSelected={activeFillColor === null}
            onNoFill={() => onFillColorChange(null)}
          />
        </div>
      )}

      {/* Stroke width */}
      {showStrokeWidth && (
        <div className="flex flex-col gap-1.5 items-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50">
            Size
          </span>
          <div className="flex flex-col gap-1">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => onStrokeWidthChange(w)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  activeStrokeWidth === w
                    ? "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                    : "hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
                title={`${w}px`}
              >
                <div
                  className="rounded-full bg-gray-700 dark:bg-gray-300 midnight:bg-cyan-300 purple:bg-pink-300"
                  style={{ width: Math.min(w * 1.5, 18), height: Math.min(w * 1.5, 18) }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Font size */}
      {showFontSize && (
        <div className="flex flex-col gap-1.5 items-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50">
            Font
          </span>
          <div className="flex flex-col gap-1">
            {[12, 16, 20, 28, 36].map((size) => (
              <button
                key={size}
                onClick={() => onFontSizeChange(size)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-150 cursor-pointer ${
                  activeFontSize === size
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 midnight:bg-cyan-900/30 midnight:text-cyan-400 purple:bg-pink-900/30 purple:text-pink-400"
                    : "text-muted hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
                title={`${size}px`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sticky note colors */}
      {showStickyColors && (
        <div className="flex flex-col gap-1.5 items-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50">
            Note
          </span>
          <ColorGrid colors={STICKY_COLORS} selectedColor={activeStickyColor} onSelect={onStickyColorChange} columns={2} />
        </div>
      )}
    </div>
  );
}
