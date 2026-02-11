"use client";

import { Check } from "lucide-react";
import type { WhiteboardTool } from "./whiteboard-types";
import { DEFAULT_COLORS, FILL_COLORS, FILL_TOOLS, STICKY_COLORS, STROKE_WIDTHS } from "./whiteboard-types";

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
    <div className="flex flex-col gap-3 p-3 bg-white dark:bg-gray-800 midnight:bg-[#0f1729] purple:bg-[#2a1a3e] border-r border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm w-[60px] items-center">
      {/* Color picker */}
      <div className="flex flex-col gap-1.5 items-center">
        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50">
          Color
        </span>
        <div className="flex flex-col gap-1">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-150 cursor-pointer hover:scale-125 ${
                activeColor === color
                  ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 scale-110"
                  : "border-gray-200 dark:border-gray-600 midnight:border-gray-700 purple:border-gray-700"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            >
              {activeColor === color && (
                <Check className={`w-3 h-3 mx-auto ${color === "#ffffff" || color === "#fef08a" ? "text-gray-800" : "text-white"}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fill color picker */}
      {showFillColors && (
        <div className="flex flex-col gap-1.5 items-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50">
            Fill
          </span>
          <div className="flex flex-col gap-1">
            {FILL_COLORS.map((color, idx) => (
              <button
                key={color ?? "no-fill"}
                onClick={() => onFillColorChange(color)}
                className={`w-5 h-5 rounded-full border-2 transition-all duration-150 cursor-pointer hover:scale-125 ${
                  activeFillColor === color
                    ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 scale-110"
                    : "border-gray-200 dark:border-gray-600 midnight:border-gray-700 purple:border-gray-700"
                }`}
                style={{ backgroundColor: color ?? "transparent" }}
                title={color ?? "No fill"}
              >
                {color === null ? (
                  /* Diagonal strikethrough for "no fill" */
                  <svg
                    viewBox="0 0 20 20"
                    className="w-3 h-3 mx-auto"
                  >
                    <line
                      x1="4" y1="16" x2="16" y2="4"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  activeFillColor === color && (
                    <Check className={`w-3 h-3 mx-auto ${color === "#ffffff" || color === "#fefce8" ? "text-gray-800" : "text-gray-600"}`} />
                  )
                )}
                {color === null && activeFillColor === null && (
                  <Check className="w-2.5 h-2.5 mx-auto -mt-2.5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            ))}
          </div>
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
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
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
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
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
          <div className="flex flex-col gap-1">
            {STICKY_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onStickyColorChange(color)}
                className={`w-5 h-5 rounded border-2 transition-all duration-150 cursor-pointer hover:scale-125 ${
                  activeStickyColor === color
                    ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 scale-110"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                style={{ backgroundColor: color }}
                title="Sticky color"
              >
                {activeStickyColor === color && (
                  <Check className="w-3 h-3 mx-auto text-gray-700" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
