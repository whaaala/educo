/**
 * palette — a modern, single-accent colour system for charts.
 *
 * Design intent (inspired by modern presentation decks, not copied): one brand
 * accent drives the whole chart. Series are tints/shades of that accent across a
 * narrow hue band so the result looks *designed*, not a rainbow. Each fill gets a
 * subtle top-light → bottom-deep gradient.
 */

export interface HSL { h: number; s: number; l: number }

export function hexToHsl(hex: string): HSL {
  let c = (hex || "#3b82f6").replace("#", "");
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  const r = parseInt(c.slice(0, 2), 16) / 255, g = parseInt(c.slice(2, 4), 16) / 255, b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
}

export const css = (c: HSL) => `hsl(${Math.round(c.h)}, ${Math.round(c.s)}%, ${Math.round(c.l)}%)`;
export const lighten = (c: HSL, by: number): HSL => ({ h: c.h, s: c.s, l: Math.min(96, c.l + by) });
export const darken = (c: HSL, by: number): HSL => ({ h: c.h, s: Math.min(100, c.s + by * 0.3), l: Math.max(8, c.l - by) });

/**
 * A categorical palette derived from a single accent. Hue rotates very gently and
 * lightness fans out symmetrically, keeping every colour in the same family.
 */
export function categorical(accent: string, n: number): HSL[] {
  const base = hexToHsl(accent);
  if (n <= 1) return [base];
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);              // 0..1
    return {
      h: (base.h + (t - 0.5) * 34 + 360) % 360,
      s: Math.max(46, Math.min(92, base.s - i * 2)),
      l: Math.round(Math.max(40, Math.min(74, base.l + (t - 0.5) * 26))),
    };
  });
}

/**
 * Monochrome ramp of one accent (stacked bars / funnel). Lightness stays in a
 * tight 40–70 band so even the lightest shade reads clearly against a white card
 * (a wider ramp washed the top segment out).
 */
export function mono(accent: string, n: number): HSL[] {
  const base = hexToHsl(accent);
  if (n <= 1) return [base];
  return Array.from({ length: n }, (_, i) => ({
    h: base.h,
    s: Math.max(46, base.s - i * 3),
    l: Math.round(42 + (i / (n - 1)) * 28),   // 42 → 70
  }));
}

/** Neutral chrome colours (grid, axes, label text, tracks) per surface mode. */
export interface ChartTheme {
  grid: string;
  axis: string;
  labelStrong: string;
  label: string;
  labelSoft: string;
  track: string;
  onAccent: string;   // text drawn on top of an accent fill (pie %, funnel values)
}

export type ChartThemeName = "light" | "dark" | "midnight" | "purple";

// Gridlines are kept subtle but clearly VISIBLE — the old #eef1f5 was almost invisible
// on a white slide, so toggling Grid looked like it did nothing.
const LIGHT: ChartTheme = {
  grid: "#d7dde5", axis: "#94a3b8",
  labelStrong: "#334155", label: "#64748b", labelSoft: "#94a3b8",
  track: "#e9edf3", onAccent: "#ffffff",
};
const DARK: ChartTheme = {
  grid: "rgba(148,163,184,0.32)", axis: "rgba(148,163,184,0.6)",
  labelStrong: "#e2e8f0", label: "#94a3b8", labelSoft: "#64748b",
  track: "rgba(148,163,184,0.2)", onAccent: "#ffffff",
};
const MIDNIGHT: ChartTheme = {
  grid: "rgba(120,140,170,0.32)", axis: "rgba(120,140,170,0.6)",
  labelStrong: "#dbe4f0", label: "#8aa0bd", labelSoft: "#5b6f8c",
  track: "rgba(120,140,170,0.2)", onAccent: "#ffffff",
};
const PURPLE: ChartTheme = {
  grid: "rgba(196,170,235,0.32)", axis: "rgba(196,170,235,0.62)",
  labelStrong: "#ece4fb", label: "#b9a6dd", labelSoft: "#8b78b3",
  track: "rgba(196,170,235,0.22)", onAccent: "#ffffff",
};

export function chartTheme(name?: ChartThemeName): ChartTheme {
  switch (name) {
    case "dark": return DARK;
    case "midnight": return MIDNIGHT;
    case "purple": return PURPLE;
    default: return LIGHT;
  }
}

/** Back-compat light defaults (kept for any external importers). */
export const neutral = LIGHT;

/** A unique gradient id helper so multiple charts on a page don't collide. */
export function gradId(uid: string, key: string): string {
  return `cg-${uid}-${key}`;
}
