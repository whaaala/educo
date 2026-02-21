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
}: ColorGridProps) {
  const size = swatchSize === "sm" ? "w-6 h-6" : "w-7 h-7";

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {allowNoFill && (
        <button
          onClick={onNoFill}
          className={`${size} rounded-md border cursor-pointer hover:scale-110 transition-transform flex items-center justify-center ${
            noFillSelected
              ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800"
              : "border-gray-200 dark:border-gray-600"
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
              ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800"
              : "border-gray-200 dark:border-gray-600"
          }`}
          style={{ background: colorToCSS(c) }}
        />
      ))}
    </div>
  );
}

// ─── Tabbed Color Palette (Solid / Gradient) ────────────────────────────

interface TabbedColorPaletteProps {
  selectedColor?: string | null;
  onSelect: (color: string) => void;
  solidColors?: string[];
  gradientColors?: string[];
  columns?: number;
  swatchSize?: "sm" | "md";
}

/**
 * Color palette with Solid / Gradient tab switcher.
 * Does NOT handle dropdown/popover positioning — just the content.
 */
export function TabbedColorPalette({
  selectedColor,
  onSelect,
  solidColors = SOLID_COLORS,
  gradientColors = GRADIENT_COLORS,
  columns = 6,
  swatchSize = "sm",
}: TabbedColorPaletteProps) {
  const [tab, setTab] = useState<"solid" | "gradient">(
    selectedColor?.startsWith("gradient:") ? "gradient" : "solid"
  );

  const currentPalette = tab === "solid" ? solidColors : gradientColors;

  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        <button
          onClick={() => setTab("solid")}
          className={`flex-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
            tab === "solid"
              ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Solid
        </button>
        <button
          onClick={() => setTab("gradient")}
          className={`flex-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
            tab === "gradient"
              ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Gradient
        </button>
      </div>
      <ColorGrid
        colors={currentPalette}
        selectedColor={selectedColor}
        onSelect={onSelect}
        columns={columns}
        swatchSize={swatchSize}
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
  /** Which palettes to show: "solid" | "gradient" | "both" | "text" */
  mode?: "solid" | "gradient" | "both" | "text";
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

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSelect = (color: string) => {
    onSelect(color);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      {isOpen && (
        <div
          className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full mt-1 z-[80] p-2 bg-white dark:bg-gray-800 midnight:bg-[#111827] purple:bg-[#1a0b2e] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/25 purple:border-pink-500/25 rounded-lg shadow-xl`}
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
