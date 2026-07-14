"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  BarChart3,
  LineChart,
  PieChart,
  X,
  Type,
} from "lucide-react";
import type { WhiteboardElement, Viewport, FontFamily } from "./whiteboard-types";
import { getBoundingBox } from "./whiteboard-utils";
import {
  SOLID_COLORS,
  TEXT_COLORS,
  colorToCSS,
  colorToSolid,
  isLightColor,
  TabbedColorPalette,
  ColorGrid,
} from "../ColorPalettePicker";
import TextFormatToolbar from "../TextFormatToolbar";

// Re-export for backwards compatibility
export { colorToCSS, colorToSolid };

const TITLE_FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36];

// Default palette used for auto-assigning
const CHART_COLOR_PALETTE = SOLID_COLORS.slice(0, 12);

interface FloatingChartEditorProps {
  element: WhiteboardElement;
  viewport: Viewport;
  onUpdate: (id: string, updates: Partial<WhiteboardElement>) => void;
  onClose: () => void;
}

export default function FloatingChartEditor({
  element,
  viewport,
  onUpdate,
  onClose,
}: FloatingChartEditorProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [colorPickerIndex, setColorPickerIndex] = useState<number | null>(null);
  const [showTitleColorPicker, setShowTitleColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const titleColorPickerRef = useRef<HTMLDivElement>(null);

  // Derive local state from element
  const chartType = element.chartType || "bar";
  const data = element.chartData || { labels: ["A", "B", "C", "D"], values: [40, 70, 30, 90] };
  const labels = data.labels || [];
  const values = data.values || [];
  const colors = data.colors || CHART_COLOR_PALETTE.slice(0, values.length);
  const title = element.chartTitle || "";
  const titleColor = element.chartTitleColor || "#374151";
  const titleFontFamily = element.chartTitleFontFamily || "Inter";
  const titleFontSize = element.chartTitleFontSize || 14;
  const titleFontWeight = element.chartTitleFontWeight || "bold";
  const titleFontStyle = element.chartTitleFontStyle || "normal";
  const titleTextDecoration = element.chartTitleTextDecoration || "none";
  const titleTextAlign = element.chartTitleTextAlign || "center";

  // Close color pickers on outside click
  useEffect(() => {
    if (colorPickerIndex === null && !showTitleColorPicker) return;
    const handler = (e: MouseEvent) => {
      if (colorPickerIndex !== null && colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setColorPickerIndex(null);
      }
      if (showTitleColorPicker && titleColorPickerRef.current && !titleColorPickerRef.current.contains(e.target as Node)) {
        setShowTitleColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [colorPickerIndex, showTitleColorPicker]);

  const update = useCallback(
    (updates: Partial<WhiteboardElement>) => {
      onUpdate(element.id, updates);
    },
    [onUpdate, element.id]
  );

  const handleTitleChange = (newTitle: string) => {
    update({ chartTitle: newTitle || undefined });
  };

  const handleTitleColorChange = (color: string) => {
    update({ chartTitleColor: color });
    setShowTitleColorPicker(false);
  };

  const handleTypeChange = (type: "bar" | "line" | "pie") => {
    update({ chartType: type });
  };

  const handleLabelChange = (index: number, label: string) => {
    const newLabels = [...labels];
    newLabels[index] = label;
    update({ chartData: { labels: newLabels, values, colors } });
  };

  const handleValueChange = (index: number, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const newValues = [...values];
    newValues[index] = Math.max(0, num);
    update({ chartData: { labels, values: newValues, colors } });
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    while (newColors.length < values.length) {
      newColors.push(CHART_COLOR_PALETTE[newColors.length % CHART_COLOR_PALETTE.length]);
    }
    newColors[index] = color;
    update({ chartData: { labels, values, colors: newColors } });
    setColorPickerIndex(null);
  };

  const handleAddPoint = () => {
    const newLabels = [...labels, `Item ${labels.length + 1}`];
    const newValues = [...values, 50];
    const newColors = [...colors];
    while (newColors.length < newValues.length) {
      newColors.push(CHART_COLOR_PALETTE[newColors.length % CHART_COLOR_PALETTE.length]);
    }
    update({ chartData: { labels: newLabels, values: newValues, colors: newColors } });
  };

  const handleRemovePoint = (index: number) => {
    if (values.length <= 2) return;
    const newLabels = labels.filter((_, i) => i !== index);
    const newValues = values.filter((_, i) => i !== index);
    const newColors = colors.filter((_, i) => i !== index);
    update({ chartData: { labels: newLabels, values: newValues, colors: newColors } });
  };

  // Positioning: to the right of the chart element
  const bbox = getBoundingBox(element);
  if (!bbox) return null;

  const rightEdgeX = (bbox.x + bbox.width) * viewport.zoom + viewport.x + 12;
  const topY = bbox.y * viewport.zoom + viewport.y;

  return (
    <div
      ref={panelRef}
      className="absolute z-[70] w-[280px] bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-xl shadow-xl shadow-black/15 dark:shadow-black/40 select-none overflow-hidden"
      style={{ left: rightEdgeX, top: topY }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">
          Chart Editor
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-3 max-h-[460px] overflow-y-auto scrollbar-thin">
        {/* Title + Title Color + Formatting */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 midnight:text-cyan-500/40 purple:text-pink-500/40 mb-1 block">
            Title
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Chart title..."
              className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-xs text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 outline-none focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            {/* Title color swatch */}
            <div className="relative" ref={showTitleColorPicker ? titleColorPickerRef : undefined}>
              <button
                onClick={() => setShowTitleColorPicker(!showTitleColorPicker)}
                className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer hover:scale-110 transition-transform flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: titleColor }}
                title="Title color"
              >
                <Type className="w-3 h-3" style={{ color: isLightColor(titleColor) ? "#374151" : "#ffffff" }} />
              </button>
              {showTitleColorPicker && (
                <div className="absolute right-0 top-full mt-1 z-[80] p-2 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/25 purple:border-pink-500/25 rounded-lg shadow-xl w-[160px]">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 midnight:text-cyan-500/40 purple:text-pink-500/40 mb-1.5">
                    Title Color
                  </div>
                  <ColorGrid
                    colors={TEXT_COLORS}
                    selectedColor={titleColor}
                    onSelect={handleTitleColorChange}
                    columns={5}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Title Formatting Toolbar */}
          <div className="mt-1.5">
            {/* Inline mode — this panel positions the toolbar itself (no portal / anchorRect). */}
            <TextFormatToolbar
              inline
              fontFamily={titleFontFamily}
              fontSize={titleFontSize}
              bold={titleFontWeight === "bold"}
              italic={titleFontStyle === "italic"}
              align={titleTextAlign}
              showFontFamily
              showFontSize
              showBold
              showItalic
              showUnderline
              showAlign
              showVerticalAlign={false}
              showWrap={false}
              showTextColor={false}
              showFillColor={false}
              onFontFamilyChange={(v) => update({ chartTitleFontFamily: v as FontFamily })}
              onFontSizeChange={(v) => update({ chartTitleFontSize: v })}
              onBold={() => update({ chartTitleFontWeight: titleFontWeight === "bold" ? "normal" : "bold" })}
              onItalic={() => update({ chartTitleFontStyle: titleFontStyle === "italic" ? "normal" : "italic" })}
              onUnderline={() => update({ chartTitleTextDecoration: titleTextDecoration === "underline" ? "none" : "underline" })}
              onAlignChange={(v) => update({ chartTitleTextAlign: v })}
            />
          </div>
        </div>

        {/* Chart Type */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 midnight:text-cyan-500/40 purple:text-pink-500/40 mb-1 block">
            Type
          </label>
          <div className="flex items-center gap-1">
            {([
              { type: "bar" as const, Icon: BarChart3, label: "Bar" },
              { type: "line" as const, Icon: LineChart, label: "Line" },
              { type: "pie" as const, Icon: PieChart, label: "Pie" },
            ]).map(({ type, Icon, label }) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150 cursor-pointer ${
                  chartType === type || (chartType === "column" && type === "bar")
                    ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400 ring-1 ring-blue-500/15 dark:ring-blue-500/25"
                    : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Points */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 midnight:text-cyan-500/40 purple:text-pink-500/40 mb-1.5 block">
            Data
          </label>
          <div className="space-y-1.5">
            {values.map((val, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {/* Color swatch */}
                <div className="relative" ref={colorPickerIndex === i ? colorPickerRef : undefined}>
                  <button
                    onClick={() => setColorPickerIndex(colorPickerIndex === i ? null : i)}
                    className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
                    style={{ background: colorToCSS(colors[i] || CHART_COLOR_PALETTE[i % CHART_COLOR_PALETTE.length]) }}
                    title="Change color"
                  />
                  {colorPickerIndex === i && (
                    <div className="absolute left-0 top-full mt-1 z-[80] p-2 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/25 purple:border-pink-500/25 rounded-lg shadow-xl w-[200px]">
                      <TabbedColorPalette
                        selectedColor={colors[i]}
                        onSelect={(c) => handleColorChange(i, c)}
                        columns={6}
                      />
                    </div>
                  )}
                </div>

                {/* Label input */}
                <input
                  type="text"
                  value={labels[i] || ""}
                  onChange={(e) => handleLabelChange(i, e.target.value)}
                  placeholder="Label"
                  className="flex-1 min-w-0 px-1.5 py-1 rounded-md text-[11px] text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 outline-none focus:ring-1 focus:ring-blue-500/40 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />

                {/* Value input */}
                <input
                  type="number"
                  value={val}
                  onChange={(e) => handleValueChange(i, e.target.value)}
                  min={0}
                  className="w-14 px-1.5 py-1 rounded-md text-[11px] text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 outline-none focus:ring-1 focus:ring-blue-500/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                {/* Delete button */}
                <button
                  onClick={() => handleRemovePoint(i)}
                  disabled={values.length <= 2}
                  className="p-1 rounded-md text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  title="Remove data point"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add data point */}
          <button
            onClick={handleAddPoint}
            className="flex items-center gap-1 mt-2 px-2 py-1.5 rounded-lg text-[10px] font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Add data point
          </button>
        </div>
      </div>
    </div>
  );
}
