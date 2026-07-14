"use client";

import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

// ─── Shared Color Palettes ──────────────────────────────────────────────

/** 30 solid colors (6 columns × 5 rows) */
export const SOLID_COLORS = [
  // Row 1: Bright primaries
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  // Row 2: Cool tones
  "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
  // Row 3: Purples & pinks
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#e11d48",
  // Row 4: Muted / earth tones
  "#78716c", "#92400e", "#b45309", "#a16207", "#4d7c0f", "#15803d",
  // Row 5: Deep / dark
  "#0f766e", "#0e7490", "#1d4ed8", "#4338ca", "#7c3aed", "#be185d",
];

/** 18 gradient colors stored as "gradient:#from:#to" */
export const GRADIENT_COLORS = [
  "gradient:#3b82f6:#06b6d4",   // Blue → Cyan
  "gradient:#8b5cf6:#ec4899",   // Purple → Pink
  "gradient:#ef4444:#f97316",   // Red → Orange
  "gradient:#f59e0b:#22c55e",   // Amber → Green
  "gradient:#10b981:#3b82f6",   // Emerald → Blue
  "gradient:#6366f1:#a855f7",   // Indigo → Purple
  "gradient:#ec4899:#f43f5e",   // Pink → Rose
  "gradient:#06b6d4:#22c55e",   // Cyan → Green
  "gradient:#f97316:#eab308",   // Orange → Yellow
  "gradient:#d946ef:#6366f1",   // Fuchsia → Indigo
  "gradient:#0ea5e9:#8b5cf6",   // Sky → Violet
  "gradient:#22c55e:#eab308",   // Green → Yellow
  "gradient:#1d4ed8:#ec4899",   // Blue → Pink
  "gradient:#ef4444:#8b5cf6",   // Red → Purple
  "gradient:#14b8a6:#f59e0b",   // Teal → Amber
  "gradient:#f43f5e:#f97316",   // Rose → Orange
  "gradient:#7c3aed:#0ea5e9",   // Violet → Sky
  "gradient:#e11d48:#d946ef",   // Rose → Fuchsia
];

/** Simple text color palette (20 colors) */
export const TEXT_COLORS = [
  "#000000", "#374151", "#6b7280", "#9ca3af",
  "#ef4444", "#f97316", "#f59e0b", "#22c55e",
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899",
  "#0ea5e9", "#06b6d4", "#10b981", "#e11d48",
  "#ffffff", "#1e293b", "#4338ca", "#be185d",
];

/** Extended text color matrix — 10 columns per row, organized by hue + shade (dark→light) */
export const TEXT_COLORS_MATRIX: string[][] = [
  // Grayscale
  ["#000000", "#1a1a1a", "#333333", "#4d4d4d", "#666666", "#808080", "#999999", "#b3b3b3", "#d9d9d9", "#ffffff"],
  // Red
  ["#7f1d1d", "#991b1b", "#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2", "#fef2f2"],
  // Orange
  ["#7c2d12", "#9a3412", "#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5", "#fff7ed"],
  // Amber
  ["#713f12", "#854d0e", "#a16207", "#ca8a04", "#eab308", "#facc15", "#fde047", "#fef08a", "#fef9c3", "#fefce8"],
  // Green
  ["#14532d", "#166534", "#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce7", "#f0fdf4"],
  // Teal
  ["#134e4a", "#115e59", "#0f766e", "#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#ccfbf1", "#f0fdfa"],
  // Blue
  ["#1e3a8a", "#1e40af", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe", "#eff6ff"],
  // Indigo
  ["#312e81", "#3730a3", "#4338ca", "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff", "#eef2ff"],
  // Purple
  ["#581c87", "#6b21a8", "#7e22ce", "#9333ea", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff", "#f3e8ff", "#faf5ff"],
  // Pink
  ["#831843", "#9d174d", "#be185d", "#db2777", "#ec4899", "#f472b6", "#f9a8d4", "#fbcfe8", "#fce7f3", "#fdf2f8"],
];

/** Gradient presets for text (stored as "gradient:#from:#to") */
export const TEXT_GRADIENT_COLORS = [
  // Warm
  "gradient:#ef4444:#f97316",   // Red → Orange
  "gradient:#f97316:#eab308",   // Orange → Amber
  "gradient:#eab308:#22c55e",   // Amber → Green
  "gradient:#dc2626:#ec4899",   // Red → Pink
  "gradient:#f59e0b:#ef4444",   // Amber → Red
  "gradient:#f43f5e:#f97316",   // Rose → Orange
  // Cool
  "gradient:#3b82f6:#06b6d4",   // Blue → Cyan
  "gradient:#6366f1:#3b82f6",   // Indigo → Blue
  "gradient:#8b5cf6:#6366f1",   // Purple → Indigo
  "gradient:#06b6d4:#22c55e",   // Cyan → Green
  "gradient:#0ea5e9:#8b5cf6",   // Sky → Violet
  "gradient:#10b981:#3b82f6",   // Emerald → Blue
  // Vivid
  "gradient:#8b5cf6:#ec4899",   // Purple → Pink
  "gradient:#ec4899:#f43f5e",   // Pink → Rose
  "gradient:#d946ef:#6366f1",   // Fuchsia → Indigo
  "gradient:#7c3aed:#0ea5e9",   // Violet → Sky
  "gradient:#e11d48:#d946ef",   // Rose → Fuchsia
  "gradient:#1d4ed8:#ec4899",   // Blue → Pink
  // Special
  "gradient:#667eea:#764ba2",   // Periwinkle → Amethyst
  "gradient:#f093fb:#f5576c",   // Orchid → Coral
  "gradient:#4facfe:#00f2fe",   // Azure → Aqua
  "gradient:#43e97b:#38f9d7",   // Emerald → Mint
  "gradient:#fa709a:#fee140",   // Rose → Sunflower
  "gradient:#a18cd1:#fbc2eb",   // Lavender → Pink
];

/** Glossy / metallic gradient presets (stored as "gradient:#from:#to") */
export const GLOSSY_COLORS = [
  // Gold
  "gradient:#FFD700:#B8860B",
  "gradient:#F5CF52:#C49B17",
  "gradient:#FFE066:#DAA520",
  // Rose Gold
  "gradient:#E0BFB8:#B76E79",
  "gradient:#F4C2C2:#C88EA7",
  "gradient:#EDAFB8:#D4848C",
  // Silver
  "gradient:#E8E8E8:#A0A0A0",
  "gradient:#C0C0C0:#808080",
  "gradient:#D1D1D1:#9E9E9E",
  // Bronze / Copper
  "gradient:#CD853F:#8B6914",
  "gradient:#B87333:#8B4513",
  "gradient:#DA8A67:#A0522D",
  // Platinum / Chrome
  "gradient:#E5E4E2:#B0B0B0",
  "gradient:#C9D6FF:#A3BDED",
  "gradient:#89ABE3:#637AB7",
  // Emerald Gloss
  "gradient:#50C878:#1B813E",
  "gradient:#2ECC71:#196F3D",
  // Ruby Gloss
  "gradient:#E0115F:#9B111E",
  "gradient:#DC143C:#8B0000",
  // Sapphire Gloss
  "gradient:#0F52BA:#082567",
  "gradient:#1560BD:#003171",
  // Amethyst Gloss
  "gradient:#9966CC:#663399",
  "gradient:#B19CD9:#7851A9",
  // Onyx / Obsidian
  "gradient:#353839:#1a1a2e",
  "gradient:#2c3e50:#1a1a2e",
];

/** Border color palette — 8 neutrals + 48 hue colors */
export const BORDER_COLORS = [
  // Neutrals
  "#000000","#374151","#6b7280","#9ca3af","#d1d5db","#e5e7eb","#f3f4f6","#ffffff",
  // Hue palette (3 saturation rows × 8 hues)
  "#ef4444","#f97316","#f59e0b","#eab308","#84cc16","#22c55e","#14b8a6","#06b6d4",
  "#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef","#ec4899","#f43f5e",
  "#dc2626","#ea580c","#d97706","#ca8a04","#65a30d","#16a34a","#0d9488","#0891b2",
  "#0284c7","#2563eb","#4f46e5","#7c3aed","#9333ea","#c026d3","#db2777","#e11d48",
  "#991b1b","#9a3412","#92400e","#854d0e","#3f6212","#166534","#115e59","#155e75",
  "#075985","#1e40af","#3730a3","#5b21b6","#6b21a8","#86198f","#9d174d","#9f1239",
];

/** Cell background color palette — 8 neutrals + 64 light tints */
export const CELL_BG_COLORS = [
  // Neutrals (light to dark)
  "#ffffff","#f9fafb","#f3f4f6","#e5e7eb","#d1d5db","#9ca3af","#6b7280","#374151",
  // Light tints (8 rows × 8 hues)
  "#fef2f2","#fff7ed","#fffbeb","#fefce8","#f7fee7","#f0fdf4","#f0fdfa","#ecfeff",
  "#fecaca","#fed7aa","#fde68a","#fef08a","#d9f99d","#bbf7d0","#99f6e4","#a5f3fc",
  "#fca5a5","#fdba74","#fcd34d","#facc15","#bef264","#86efac","#5eead4","#67e8f9",
  "#f87171","#fb923c","#fbbf24","#eab308","#a3e635","#4ade80","#2dd4bf","#22d3ee",
  "#ef4444","#f97316","#f59e0b","#d97706","#84cc16","#22c55e","#14b8a6","#06b6d4",
  "#bfdbfe","#c7d2fe","#ddd6fe","#e9d5ff","#f5d0fe","#fbcfe8","#fecdd3","#e2e8f0",
  "#93c5fd","#a5b4fc","#c4b5fd","#d8b4fe","#f0abfc","#f9a8d4","#fda4af","#cbd5e1",
  "#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef","#ec4899","#f43f5e","#64748b",
];

// ─── Utility Functions ──────────────────────────────────────────────────

/** Convert a color value to CSS string for display (handles gradients) */
export function colorToCSS(color: string): string {
  if (color.startsWith("gradient:")) {
    const parts = color.split(":");
    return `linear-gradient(135deg, ${parts[1]}, ${parts[2]})`;
  }
  return color;
}

/** Get the first solid color from a potentially gradient color */
export function colorToSolid(color: string): string {
  if (color.startsWith("gradient:")) {
    return color.split(":")[1];
  }
  return color;
}

/** Check if a hex color is light (for contrast text) */
export function isLightColor(hex: string): boolean {
  if (!hex.startsWith("#")) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

// ─── Native Color Picker Guard ───────────────────────────────────────────
// Module-level flag: set when <input type="color"> is opened, cleared ONLY on blur.
// While the native picker is open, onChange fires on every drag — the flag stays true
// so that parent onSelect callbacks can avoid closing the container.
let _nativeColorPickerOpen = false;
export function isNativeColorPickerOpen(): boolean { return _nativeColorPickerOpen; }

// ─── Custom Hex Input Row ────────────────────────────────────────────────

function CustomHexRow({ color, onSelect }: { color: string; onSelect: (c: string) => void }) {
  const nativeVal = color.startsWith("gradient:") ? color.split(":")[1] : color;
  const [hexText, setHexText] = useState(color);
  const [isFocused, setIsFocused] = useState(false);

  // Sync external color changes when not actively editing
  useEffect(() => {
    if (!isFocused) setHexText(color);
  }, [color, isFocused]);

  return (
    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20" onMouseDown={(e) => e.stopPropagation()}>
      <label className="relative cursor-pointer">
        <input
          type="color"
          value={nativeVal}
          onMouseDown={() => { _nativeColorPickerOpen = true; }}
          onFocus={() => { _nativeColorPickerOpen = true; }}
          onChange={(e) => { _nativeColorPickerOpen = true; onSelect(e.target.value); }}
          // Clear on the NEXT tick, not after a full second. Deferring by one task is enough to
          // survive the trailing click that dismisses the native OS picker (which would otherwise
          // close the parent dropdown), while a 1000ms hold left click-outside dead for a whole
          // second after picking any colour.
          onBlur={() => { setTimeout(() => { _nativeColorPickerOpen = false; }, 0); }}
          onClick={() => { _nativeColorPickerOpen = true; }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 shadow-inner" style={{ background: color.startsWith("gradient:") ? colorToCSS(color) : color }}>
          <div className="w-full h-full rounded-lg" style={{ background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)", opacity: 0.3 }} />
        </div>
      </label>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">Custom</span>
      <input
        type="text"
        value={hexText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); setHexText(color); }}
        onChange={(e) => {
          const v = e.target.value;
          setHexText(v);
          if (/^#[0-9a-fA-F]{6}$/.test(v)) onSelect(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && /^#[0-9a-fA-F]{6}$/.test(hexText)) {
            onSelect(hexText);
          }
        }}
        className="flex-1 px-2 py-1 text-[11px] font-mono rounded-md border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 outline-none focus:border-blue-400"
        maxLength={7}
        spellCheck={false}
      />
    </div>
  );
}

// ─── Inline Color Grid (no dropdown, just the grid) ─────────────────────

interface ColorGridProps {
  colors: string[];
  selectedColor?: string | null;
  onSelect: (color: string) => void;
  columns?: number;
  swatchSize?: "sm" | "md";
  allowNoFill?: boolean;
  noFillSelected?: boolean;
  onNoFill?: () => void;
  showCustomHex?: boolean;
}

/**
 * A simple grid of color swatches. Does NOT handle popover/dropdown logic.
 * Use this when you want to embed a color grid inline.
 */
export function ColorGrid({
  colors,
  selectedColor,
  onSelect,
  columns = 6,
  swatchSize = "sm",
  allowNoFill = false,
  noFillSelected = false,
  onNoFill,
  showCustomHex = false,
}: ColorGridProps) {
  const size = swatchSize === "sm" ? "w-6 h-6" : "w-7 h-7";

  return (
    <div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {allowNoFill && (
          <button
            onClick={onNoFill}
            className={`${size} rounded-md border cursor-pointer hover:scale-110 transition-transform flex items-center justify-center ${
              noFillSelected
                ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800 midnight:ring-offset-[#111827] purple:ring-offset-[#2a1447]"
                : "border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
            }`}
            style={{ backgroundColor: "transparent" }}
            title="No fill"
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4">
              <line x1="4" y1="16" x2="16" y2="4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className={`${size} rounded-md border cursor-pointer hover:scale-110 transition-transform ${
              selectedColor === c
                ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800 midnight:ring-offset-[#111827] purple:ring-offset-[#2a1447]"
                : "border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
            }`}
            style={{ background: colorToCSS(c) }}
          />
        ))}
      </div>
      {showCustomHex && (
        <CustomHexRow color={selectedColor ?? "#000000"} onSelect={onSelect} />
      )}
    </div>
  );
}

// ─── Color Matrix Grid (10 cols × hue rows, like Google Slides) ────────

interface ColorMatrixGridProps {
  matrix?: string[][];
  selectedColor?: string | null;
  onSelect: (color: string) => void;
  /** Called when color changes from custom hex/native picker (doesn't close popover) */
  onCustomSelect?: (color: string) => void;
  showCustomHex?: boolean;
}

/**
 * A 10-column color grid organized by hue (dark→light per row).
 * Matches Google Slides / Google Docs color picker layout.
 */
export function ColorMatrixGrid({
  matrix = TEXT_COLORS_MATRIX,
  selectedColor,
  onSelect,
  onCustomSelect,
  showCustomHex = true,
}: ColorMatrixGridProps) {
  return (
    <div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(10, 1fr)" }}>
        {matrix.flat().map((c, i) => (
          <button
            key={`${c}-${i}`}
            onClick={() => onSelect(c)}
            className={`w-[22px] h-[22px] rounded-[4px] border cursor-pointer hover:scale-115 transition-transform ${
              selectedColor === c
                ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-[#0f1115] midnight:ring-offset-[#0a0e27] purple:ring-offset-[#1a0b2e] scale-110"
                : "border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/15 purple:border-pink-500/15 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>
      {showCustomHex && (
        <CustomHexRow color={selectedColor ?? "#000000"} onSelect={onCustomSelect || onSelect} />
      )}
    </div>
  );
}

// ─── Full Color Picker Panel (Matrix + Gradient tabs, like Google Slides) ──

interface FullColorPickerProps {
  selectedColor?: string | null;
  onSelect: (color: string) => void;
  /** Called from custom hex/native picker — doesn't close the popover */
  onCustomSelect?: (color: string) => void;
  showGradients?: boolean;
  gradientColors?: string[];
  glossyColors?: string[];
  matrix?: string[][];
}

/**
 * Full color picker with Solid (matrix) / Gradient / Glossy tabs.
 * Designed to look like Google Slides' color picker.
 */
export function FullColorPicker({
  selectedColor,
  onSelect,
  onCustomSelect,
  showGradients = true,
  gradientColors = GRADIENT_COLORS,
  glossyColors,
  matrix = TEXT_COLORS_MATRIX,
}: FullColorPickerProps) {
  const tabs = showGradients
    ? glossyColors ? ["Solid", "Gradient", "Glossy"] : ["Solid", "Gradient"]
    : ["Solid"];
  const [tab, setTab] = useState(
    selectedColor?.startsWith("gradient:") ? "Gradient" : "Solid"
  );

  return (
    <div>
      {/* Tabs — only show if more than one */}
      {tabs.length > 1 && (
        <div className="flex mb-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 text-[11px] font-medium transition-colors cursor-pointer relative ${
                tab === t
                  ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  : "text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {t}
              {tab === t && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-blue-500 dark:bg-blue-400 midnight:bg-cyan-400 purple:bg-pink-400 rounded-full" />}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {tab === "Solid" && (
        <ColorMatrixGrid matrix={matrix} selectedColor={selectedColor} onSelect={onSelect} onCustomSelect={onCustomSelect} showCustomHex />
      )}
      {tab === "Gradient" && (
        <ColorGrid colors={gradientColors} selectedColor={selectedColor} onSelect={onSelect} columns={6} swatchSize="sm" showCustomHex />
      )}
      {tab === "Glossy" && glossyColors && (
        <ColorGrid colors={glossyColors} selectedColor={selectedColor} onSelect={onSelect} columns={6} swatchSize="sm" showCustomHex />
      )}
    </div>
  );
}

// ─── Tabbed Color Palette (Solid / Gradient) ────────────────────────────

type ColorTabName = "solid" | "gradient" | "glossy";

interface TabbedColorPaletteProps {
  selectedColor?: string | null;
  onSelect: (color: string) => void;
  solidColors?: string[];
  gradientColors?: string[];
  glossyColors?: string[];
  columns?: number;
  swatchSize?: "sm" | "md";
  showCustomHex?: boolean;
}

/**
 * Color palette with Solid / Gradient / Glossy tab switcher.
 * Shows Glossy tab only when glossyColors is provided.
 */
export function TabbedColorPalette({
  selectedColor,
  onSelect,
  solidColors = SOLID_COLORS,
  gradientColors = GRADIENT_COLORS,
  glossyColors,
  columns = 6,
  swatchSize = "sm",
  showCustomHex = false,
}: TabbedColorPaletteProps) {
  const tabs: ColorTabName[] = glossyColors
    ? ["solid", "gradient", "glossy"]
    : ["solid", "gradient"];

  const [tab, setTab] = useState<ColorTabName>(
    selectedColor?.startsWith("gradient:") ? "gradient" : "solid"
  );

  const currentPalette =
    tab === "solid" ? solidColors :
    tab === "glossy" && glossyColors ? glossyColors :
    gradientColors;

  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer capitalize ${
              tab === t
                ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <ColorGrid
        colors={currentPalette}
        selectedColor={selectedColor}
        onSelect={onSelect}
        columns={columns}
        swatchSize={swatchSize}
        showCustomHex={showCustomHex}
      />
    </div>
  );
}

// ─── Color Picker Popover ───────────────────────────────────────────────

interface ColorPickerPopoverProps {
  /** The currently selected color */
  selectedColor: string;
  /** Called when a color is selected */
  onSelect: (color: string) => void;
  /** The trigger element (color swatch button) */
  children: React.ReactNode;
  /** Which palettes to show: "solid" | "gradient" | "both" | "text" | "matrix" */
  mode?: "solid" | "gradient" | "both" | "text" | "matrix";
  /** Custom solid colors (overrides defaults) */
  solidColors?: string[];
  /** Custom gradient colors (overrides defaults) */
  gradientColors?: string[];
  /** Custom text colors (overrides defaults) */
  textColors?: string[];
  /** Grid columns */
  columns?: number;
  /** Popover alignment */
  align?: "left" | "right";
  /** Label shown in popover header */
  label?: string;
  /** Popover width */
  width?: number;
}

/**
 * Full color picker popover with trigger button management.
 * Handles open/close state, outside click, and positioning.
 */
export function ColorPickerPopover({
  selectedColor,
  onSelect,
  children,
  mode = "both",
  solidColors = SOLID_COLORS,
  gradientColors = GRADIENT_COLORS,
  textColors = TEXT_COLORS,
  columns = 6,
  align = "left",
  label,
  width = 200,
}: ColorPickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(`cpicker-${Math.random().toString(36).slice(2)}`);

  // Close when another dropdown/popover opens (shared event with CustomDropdown)
  useEffect(() => {
    const handleOtherOpen = (e: Event) => {
      if (_nativeColorPickerOpen) return;
      if ((e as CustomEvent).detail !== idRef.current) setIsOpen(false);
    };
    window.addEventListener("dropdown-open", handleOtherOpen);
    return () => window.removeEventListener("dropdown-open", handleOtherOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      // Don't close if native color picker is open
      if (_nativeColorPickerOpen) return;
      // Don't close if any input[type=color] in the document is focused
      const activeEl = document.activeElement as HTMLInputElement | null;
      if (activeEl?.type === "color") return;
      // Don't close if click target is inside the popover
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close popover when selecting from grid swatches
  const handleSelect = (color: string) => {
    onSelect(color);
    setIsOpen(false);
  };
  // Don't close popover when using custom/native picker — just update color
  const handleCustomSelect = (color: string) => {
    onSelect(color);
  };

  const popoverRef = useRef<HTMLDivElement>(null);
  const [openAbove, setOpenAbove] = useState(false);

  // Check if popover would overflow viewport bottom, flip above if needed
  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const triggerRect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - triggerRect.bottom - 16; // 16px margin
    const estimatedHeight = mode === "matrix" ? 380 : 300;
    setOpenAbove(spaceBelow < estimatedHeight && triggerRect.top > estimatedHeight);
  }, [isOpen, mode]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => {
        const opening = !isOpen;
        if (opening) window.dispatchEvent(new CustomEvent("dropdown-open", { detail: idRef.current }));
        setIsOpen(opening);
      }}>{children}</div>
      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute ${align === "right" ? "right-0" : "left-0"} ${openAbove ? "bottom-full mb-1" : "top-full mt-1"} z-[10003] p-2.5 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/25 purple:border-pink-500/25 rounded-xl shadow-2xl max-h-[min(420px,calc(100vh-100px))] overflow-y-auto`}
          style={{ width }}
        >
          {label && (
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 midnight:text-cyan-500/40 purple:text-pink-500/40 mb-1.5">
              {label}
            </div>
          )}
          {mode === "both" ? (
            <TabbedColorPalette
              selectedColor={selectedColor}
              onSelect={handleSelect}
              solidColors={solidColors}
              gradientColors={gradientColors}
              columns={columns}
            />
          ) : mode === "text" ? (
            <ColorGrid
              colors={textColors}
              selectedColor={selectedColor}
              onSelect={handleSelect}
              columns={5}
            />
          ) : mode === "matrix" ? (
            <FullColorPicker
              selectedColor={selectedColor}
              onSelect={handleSelect}
              onCustomSelect={handleCustomSelect}
              showGradients
              gradientColors={gradientColors}
              glossyColors={GLOSSY_COLORS}
            />
          ) : (
            <ColorGrid
              colors={mode === "solid" ? solidColors : gradientColors}
              selectedColor={selectedColor}
              onSelect={handleSelect}
              columns={columns}
            />
          )}
        </div>
      )}
    </div>
  );
}
