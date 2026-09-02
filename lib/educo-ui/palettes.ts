/**
 * Educo UI — curated palette library. A big set of ready-made brand starting points, grouped by mood.
 * Each palette patches a SiteTheme (primary + accent, and for dark palettes the surfaces/text too); the
 * token engine then auto-generates the full 50–950 ramps from the seed. Pure DATA (colour values, like
 * ColorPalettePicker's palettes) — reused by the token playground now and the Theme Editor later.
 */

import type { SiteTheme } from "@/lib/site-storage";

export type PaletteCategory = "Professional" | "Vibrant" | "Fresh" | "Warm" | "Duotone" | "Dark themes";

export interface Palette {
  name: string;
  category: PaletteCategory;
  patch: Partial<SiteTheme>;
}

/** Category display order. */
export const PALETTE_CATEGORIES: PaletteCategory[] = ["Professional", "Vibrant", "Fresh", "Warm", "Duotone", "Dark themes"];

export const PALETTES: Palette[] = [
  // ── Professional ────────────────────────────────────────────────────────────
  { name: "Corporate Blue", category: "Professional", patch: { primary: "#2563eb", accent: "#0ea5e9" } },
  { name: "Slate", category: "Professional", patch: { primary: "#475569", accent: "#0ea5e9" } },
  { name: "Graphite", category: "Professional", patch: { primary: "#334155", accent: "#64748b" } },
  { name: "Navy", category: "Professional", patch: { primary: "#1e3a8a", accent: "#3b82f6" } },
  { name: "Teal Pro", category: "Professional", patch: { primary: "#0f766e", accent: "#14b8a6" } },
  { name: "Indigo Pro", category: "Professional", patch: { primary: "#4338ca", accent: "#6366f1" } },

  // ── Vibrant ──────────────────────────────────────────────────────────────────
  { name: "Indigo", category: "Vibrant", patch: { primary: "#4f46e5", accent: "#7c3aed" } },
  { name: "Violet", category: "Vibrant", patch: { primary: "#7c3aed", accent: "#a855f7" } },
  { name: "Purple", category: "Vibrant", patch: { primary: "#9333ea", accent: "#c026d3" } },
  { name: "Fuchsia", category: "Vibrant", patch: { primary: "#c026d3", accent: "#db2777" } },
  { name: "Pink", category: "Vibrant", patch: { primary: "#db2777", accent: "#f472b6" } },
  { name: "Rose", category: "Vibrant", patch: { primary: "#e11d48", accent: "#f43f5e" } },
  { name: "Crimson", category: "Vibrant", patch: { primary: "#be123c", accent: "#e11d48" } },
  { name: "Red", category: "Vibrant", patch: { primary: "#dc2626", accent: "#f97316" } },
  { name: "Orange", category: "Vibrant", patch: { primary: "#ea580c", accent: "#f59e0b" } },
  { name: "Amber", category: "Vibrant", patch: { primary: "#d97706", accent: "#eab308" } },

  // ── Fresh ────────────────────────────────────────────────────────────────────
  { name: "Emerald", category: "Fresh", patch: { primary: "#059669", accent: "#10b981" } },
  { name: "Teal", category: "Fresh", patch: { primary: "#0d9488", accent: "#14b8a6" } },
  { name: "Cyan", category: "Fresh", patch: { primary: "#0891b2", accent: "#06b6d4" } },
  { name: "Sky", category: "Fresh", patch: { primary: "#0284c7", accent: "#38bdf8" } },
  { name: "Blue", category: "Fresh", patch: { primary: "#2563eb", accent: "#60a5fa" } },
  { name: "Lime", category: "Fresh", patch: { primary: "#65a30d", accent: "#84cc16" } },
  { name: "Green", category: "Fresh", patch: { primary: "#16a34a", accent: "#22c55e" } },
  { name: "Mint", category: "Fresh", patch: { primary: "#14b8a6", accent: "#34d399" } },

  // ── Warm ─────────────────────────────────────────────────────────────────────
  { name: "Sunset", category: "Warm", patch: { primary: "#f97316", accent: "#db2777" } },
  { name: "Coral", category: "Warm", patch: { primary: "#f43f5e", accent: "#fb7185" } },
  { name: "Peach", category: "Warm", patch: { primary: "#fb923c", accent: "#f472b6" } },
  { name: "Terracotta", category: "Warm", patch: { primary: "#c2410c", accent: "#ea580c" } },
  { name: "Marigold", category: "Warm", patch: { primary: "#d97706", accent: "#f59e0b" } },
  { name: "Rust", category: "Warm", patch: { primary: "#9a3412", accent: "#c2410c" } },

  // ── Duotone ──────────────────────────────────────────────────────────────────
  { name: "Ocean", category: "Duotone", patch: { primary: "#2563eb", accent: "#06b6d4" } },
  { name: "Grape", category: "Duotone", patch: { primary: "#7c3aed", accent: "#d946ef" } },
  { name: "Berry", category: "Duotone", patch: { primary: "#e11d48", accent: "#9333ea" } },
  { name: "Citrus", category: "Duotone", patch: { primary: "#d97706", accent: "#84cc16" } },
  { name: "Flamingo", category: "Duotone", patch: { primary: "#ec4899", accent: "#f97316" } },
  { name: "Aurora", category: "Duotone", patch: { primary: "#14b8a6", accent: "#6366f1" } },
  { name: "Candy", category: "Duotone", patch: { primary: "#d946ef", accent: "#0ea5e9" } },
  { name: "Ember", category: "Duotone", patch: { primary: "#dc2626", accent: "#f59e0b" } },

  // ── Dark themes (also set surfaces + text) ────────────────────────────────────
  { name: "Slate Night", category: "Dark themes", patch: { primary: "#6366f1", accent: "#8b5cf6", background: "#0b1020", surface: "#141a30", text: "#e6e9f5", textMuted: "#9aa3c0" } },
  { name: "Deep Space", category: "Dark themes", patch: { primary: "#22d3ee", accent: "#818cf8", background: "#050814", surface: "#0e1424", text: "#e2e8f0", textMuted: "#94a3b8" } },
  { name: "Midnight Blue", category: "Dark themes", patch: { primary: "#3b82f6", accent: "#06b6d4", background: "#0a1226", surface: "#111a33", text: "#dbeafe", textMuted: "#93a5c9" } },
  { name: "Wine", category: "Dark themes", patch: { primary: "#f43f5e", accent: "#fb7185", background: "#1a0a12", surface: "#2a1420", text: "#ffe4ec", textMuted: "#c99aab" } },
  { name: "Forest Dark", category: "Dark themes", patch: { primary: "#34d399", accent: "#10b981", background: "#06140f", surface: "#0e2019", text: "#d1fae5", textMuted: "#86b3a3" } },
  { name: "Charcoal", category: "Dark themes", patch: { primary: "#a78bfa", accent: "#f472b6", background: "#0d0d10", surface: "#17171c", text: "#ececf0", textMuted: "#9a9aa6" } },
];

/** A full hue spectrum of seed colours — each is fed through the engine to show a 50–950 ramp,
 *  giving a Tailwind-scale reference palette (22 ramps) generated entirely by our OKLCH engine. */
export const SPECTRUM: { name: string; hex: string }[] = [
  { name: "Red", hex: "#ef4444" }, { name: "Orange", hex: "#f97316" }, { name: "Amber", hex: "#f59e0b" },
  { name: "Yellow", hex: "#eab308" }, { name: "Lime", hex: "#84cc16" }, { name: "Green", hex: "#22c55e" },
  { name: "Emerald", hex: "#10b981" }, { name: "Teal", hex: "#14b8a6" }, { name: "Cyan", hex: "#06b6d4" },
  { name: "Sky", hex: "#0ea5e9" }, { name: "Blue", hex: "#3b82f6" }, { name: "Indigo", hex: "#6366f1" },
  { name: "Violet", hex: "#8b5cf6" }, { name: "Purple", hex: "#a855f7" }, { name: "Fuchsia", hex: "#d946ef" },
  { name: "Pink", hex: "#ec4899" }, { name: "Rose", hex: "#f43f5e" }, { name: "Slate", hex: "#64748b" },
  { name: "Gray", hex: "#6b7280" }, { name: "Zinc", hex: "#71717a" }, { name: "Stone", hex: "#78716c" },
  { name: "Brown", hex: "#92693e" },
];

/** Palettes grouped by category, in display order. */
export function palettesByCategory(): Record<PaletteCategory, Palette[]> {
  const out = Object.fromEntries(PALETTE_CATEGORIES.map((c) => [c, [] as Palette[]])) as Record<PaletteCategory, Palette[]>;
  for (const p of PALETTES) out[p.category].push(p);
  return out;
}
