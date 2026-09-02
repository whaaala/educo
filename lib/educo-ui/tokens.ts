/**
 * Educo UI — design tokens.
 *
 * A "theme" is a set of tokens: colour ramps (auto-generated from the brand colour), typography (families +
 * a rem size scale + weights + line-height/spacing), spacing, radius and shadow. Every Educo UI component
 * reads these, so switching a theme restyles the whole site. Pure: `tokensFromTheme(theme)` builds the token
 * set from our existing SiteTheme; `tokensToCss(tokens)` emits them as CSS custom properties (`--eu-*`).
 */

import type { SiteTheme } from "@/lib/site-storage";
import { type Ramp, type Shade, SHADES, rampFromHex, hexToOklch, oklchToHex } from "./color";
import { LETTER_SPACING } from "./fonts";

export interface EducoTokens {
  color: {
    primary: Ramp; accent: Ramp; neutral: Ramp;
    success: string; warning: string; danger: string; info: string;
    // semantic roles (what components actually reference)
    bg: string; surface: string; text: string; muted: string; border: string;
    brand: string; onBrand: string;
  };
  font: { heading: string; body: string; mono: string };
  text: Record<string, string>;   // rem type scale
  weight: Record<string, string>;
  leading: Record<string, string>;
  tracking: Record<string, string>;
  space: Record<string, string>;  // rem spacing scale
  radius: Record<string, string>;
  shadow: Record<string, string>;
  duration: Record<string, string>; // motion durations
  easing: Record<string, string>;   // named easing curves
}

const TYPE_SCALE: Record<string, string> = {
  xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem",
  "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem", "6xl": "3.75rem",
};
const WEIGHTS: Record<string, string> = { normal: "400", medium: "500", semibold: "600", bold: "700" };
const LEADING: Record<string, string> = { tight: "1.15", snug: "1.3", normal: "1.5", relaxed: "1.7" };
const TRACKING: Record<string, string> = Object.fromEntries(LETTER_SPACING.map((l) => [l.name, l.em]));
const SPACE: Record<string, string> = {
  "0": "0", "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem", "5": "1.25rem",
  "6": "1.5rem", "8": "2rem", "10": "2.5rem", "12": "3rem", "16": "4rem", "20": "5rem", "24": "6rem",
};
const DURATION: Record<string, string> = { fast: "120ms", base: "200ms", slow: "320ms", slower: "500ms" };
// Named easings (see easings.net): standard for most UI, in/out for enter/exit, spring-ish for playful.
const EASING: Record<string, string> = {
  standard: "cubic-bezier(0.2, 0, 0, 1)", in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)", "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1.2)",
};
const SHADOW: Record<string, string> = {
  sm: "0 1px 2px rgba(0,0,0,0.08), 0 1px 1px rgba(0,0,0,0.06)",
  md: "0 4px 8px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)",
  lg: "0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)",
  xl: "0 24px 48px rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.10)",
};

/** A brand-tinted neutral: the brand's hue at a tiny chroma → greys that lean subtly toward the brand. */
function neutralRamp(brandHex: string): Ramp {
  const { h } = hexToOklch(brandHex);
  return rampFromHex(oklchToHex({ L: 0.6, C: 0.012, h }));
}

/** Build the full token set from our existing SiteTheme (brand colour + surfaces + fonts + radius). */
export function tokensFromTheme(theme: SiteTheme): EducoTokens {
  const primary = rampFromHex(theme.primary);
  const accent = rampFromHex(theme.accent);
  const neutral = neutralRamp(theme.primary);
  const r = Math.max(0, theme.radius);
  return {
    color: {
      primary, accent, neutral,
      success: "#16a34a", warning: "#d97706", danger: "#dc2626", info: "#0284c7",
      bg: theme.background, surface: theme.surface, text: theme.text, muted: theme.textMuted, border: neutral[200],
      brand: theme.primary, onBrand: "#ffffff",
    },
    font: { heading: theme.headingFont, body: theme.bodyFont, mono: "'IBM Plex Mono', ui-monospace, monospace" },
    text: TYPE_SCALE, weight: WEIGHTS, leading: LEADING, tracking: TRACKING, space: SPACE,
    radius: { sm: `${Math.round(r * 0.375)}px`, md: `${Math.round(r * 0.75)}px`, lg: `${r}px`, xl: `${Math.round(r * 1.5)}px`, full: "9999px" },
    shadow: SHADOW, duration: DURATION, easing: EASING,
  };
}

/** Emit the tokens as CSS custom properties under `selector` (default `:root`). Framework-safe (`--eu-*`). */
export function tokensToCss(t: EducoTokens, selector = ":root"): string {
  const lines: string[] = [];
  const ramp = (name: string, r: Ramp) => SHADES.forEach((s: Shade) => lines.push(`--eu-color-${name}-${s}:${r[s]};`));
  ramp("primary", t.color.primary); ramp("accent", t.color.accent); ramp("neutral", t.color.neutral);
  lines.push(`--eu-color-success:${t.color.success};`, `--eu-color-warning:${t.color.warning};`, `--eu-color-danger:${t.color.danger};`, `--eu-color-info:${t.color.info};`);
  lines.push(`--eu-color-bg:${t.color.bg};`, `--eu-color-surface:${t.color.surface};`, `--eu-color-text:${t.color.text};`, `--eu-color-muted:${t.color.muted};`, `--eu-color-border:${t.color.border};`, `--eu-color-brand:${t.color.brand};`, `--eu-color-on-brand:${t.color.onBrand};`);
  lines.push(`--eu-font-heading:${t.font.heading};`, `--eu-font-body:${t.font.body};`, `--eu-font-mono:${t.font.mono};`);
  Object.entries(t.text).forEach(([k, v]) => lines.push(`--eu-text-${k}:${v};`));
  Object.entries(t.weight).forEach(([k, v]) => lines.push(`--eu-weight-${k}:${v};`));
  Object.entries(t.leading).forEach(([k, v]) => lines.push(`--eu-leading-${k}:${v};`));
  Object.entries(t.tracking).forEach(([k, v]) => lines.push(`--eu-tracking-${k}:${v};`));
  Object.entries(t.space).forEach(([k, v]) => lines.push(`--eu-space-${k}:${v};`));
  Object.entries(t.radius).forEach(([k, v]) => lines.push(`--eu-radius-${k}:${v};`));
  Object.entries(t.shadow).forEach(([k, v]) => lines.push(`--eu-shadow-${k}:${v};`));
  Object.entries(t.duration).forEach(([k, v]) => lines.push(`--eu-dur-${k}:${v};`));
  Object.entries(t.easing).forEach(([k, v]) => lines.push(`--eu-ease-${k}:${v};`));
  return `${selector}{${lines.join("")}}`;
}
