/**
 * Educo UI — base stylesheet (Phase 0.2). Turns the responsive-design principles into the builder's
 * OUTPUT layer: a reset, a user-respecting root, a fluid `clamp()` type scale, `max-width` containers,
 * an auto-fit responsive grid, flexible-image defaults, and container-query scaffolding — all scoped
 * under `.eu-root` so it never touches the editor chrome. Reads everything from the `--eu-*` tokens.
 *
 * The four ingredients, in code:
 *   1. Fluid layouts   → %/fr widths, flexbox/grid + gap, `.eu-container` (width:100% + max-width)
 *   2. Responsive units → rem tokens + `clamp()` fluid type; root font-size:100% respects the user
 *   3. Flexible images  → `max-width:100%`, `height:auto`, `aspect-ratio`, `object-fit`
 *   4. Media queries    → mobile-first `min-width` breakpoints (+ container queries for blocks)
 */

import type { SiteTheme } from "@/lib/site-storage";
import { tokensFromTheme, tokensToCss } from "./tokens";
import { COMPONENT_CSS } from "./components";

/** Mobile-first breakpoints (min-width), in px. Blocks prefer container queries; pages use these. */
export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 } as const;

export const BASE_CSS = `
/* ── Reset ─────────────────────────────────────────────────────────────────── */
.eu-root *, .eu-root *::before, .eu-root *::after { box-sizing: border-box; }
.eu-root * { margin: 0; }
.eu-root { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

/* ── Responsive units: respect the user's browser font size (percentage, never fixed px) ── */
:root { font-size: 100%; } /* 1rem = the user's base (16px default); scales with their preference */

/* ── Root surface + typography ─────────────────────────────────────────────── */
.eu-root {
  font-family: var(--eu-font-body);
  font-size: var(--eu-text-base);
  line-height: var(--eu-leading-normal);
  color: var(--eu-color-text);
  background: var(--eu-color-bg);
  accent-color: var(--eu-color-brand); /* checkboxes, radios, range, progress */
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.eu-root h1, .eu-root h2, .eu-root h3, .eu-root h4, .eu-root h5, .eu-root h6 {
  font-family: var(--eu-font-heading);
  font-weight: var(--eu-weight-bold);
  line-height: var(--eu-leading-tight);
  letter-spacing: var(--eu-tracking-tight);
  text-wrap: balance;
}
/* Fluid type scale: smoothly interpolate between a mobile min and a desktop max — no media query. */
.eu-root h1 { font-size: clamp(var(--eu-text-3xl), 4vw + 1rem, var(--eu-text-6xl)); }
.eu-root h2 { font-size: clamp(var(--eu-text-2xl), 3vw + 1rem, var(--eu-text-4xl)); }
.eu-root h3 { font-size: clamp(var(--eu-text-xl), 2vw + 1rem, var(--eu-text-3xl)); }
.eu-root p  { max-width: 68ch; } /* comfortable measure */
.eu-root a  { color: var(--eu-color-brand); }
.eu-root code, .eu-root pre { font-family: var(--eu-font-mono); }

/* ── Flexible images / media ───────────────────────────────────────────────── */
.eu-root img, .eu-root picture, .eu-root video, .eu-root svg { max-width: 100%; height: auto; display: block; }
.eu-media { width: 100%; object-fit: cover; aspect-ratio: 16 / 9; border-radius: var(--eu-radius-md); }

/* ── Fluid layout primitives ───────────────────────────────────────────────── */
/* Container: full width, capped, centred, with fluid side padding. */
.eu-container { width: 100%; max-width: var(--eu-container-max, 1200px); margin-inline: auto; padding-inline: clamp(1rem, 4vw, 3rem); }
/* Intrinsic responsive grid: columns wrap on their own — zero media queries. */
.eu-grid { display: grid; gap: var(--eu-space-6); grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--eu-col-min, 16rem)), 1fr)); }
/* Vertical rhythm (fluid layout, the flow way). */
.eu-stack > * + * { margin-block-start: var(--eu-space-4); }
/* Wrapping row of items. */
.eu-cluster { display: flex; flex-wrap: wrap; gap: var(--eu-space-3); align-items: center; }
/* Center a thing with a max measure. */
.eu-center { box-sizing: content-box; max-width: 65ch; margin-inline: auto; padding-inline: var(--eu-space-4); }

/* ── Container queries: blocks respond to THEIR container, not the viewport ──── */
.eu-container-ctx { container-type: inline-size; }
@container (min-width: 34rem) {
  .eu-cq-row { display: flex; gap: var(--eu-space-4); align-items: center; }
  .eu-cq-2   { grid-template-columns: repeat(2, 1fr); }
}
@container (min-width: 52rem) {
  .eu-cq-3   { grid-template-columns: repeat(3, 1fr); }
}

/* ── A few token-driven utilities (0.3 adds full component styles) ──────────── */
.eu-surface { background: var(--eu-color-surface); border: 1px solid var(--eu-color-border); border-radius: var(--eu-radius-lg); }
.eu-muted { color: var(--eu-color-muted); }
.eu-p-4 { padding: var(--eu-space-4); } .eu-p-6 { padding: var(--eu-space-6); } .eu-p-8 { padding: var(--eu-space-8); }
.eu-round { border-radius: var(--eu-radius-lg); }
.eu-shadow { box-shadow: var(--eu-shadow-md); }
.eu-hidden { display: none; }

/* ── Basic user interface + accessibility ──────────────────────────────────── */
.eu-root :focus-visible { outline: 2px solid var(--eu-color-brand); outline-offset: 2px; border-radius: 3px; }
.eu-root :focus:not(:focus-visible) { outline: none; }
.eu-root ::selection { background: var(--eu-color-primary-200); color: var(--eu-color-text); }
.eu-root ::placeholder { color: var(--eu-color-muted); opacity: 1; }
.eu-root :is(button, [role="button"], summary, label[for]) { cursor: pointer; }
/* Screen-reader-only (visually hidden but accessible). */
.eu-visually-hidden { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0; }

/* ── Forms & embedded content: inherit type, never overflow ────────────────── */
.eu-root button, .eu-root input, .eu-root select, .eu-root textarea { font: inherit; color: inherit; letter-spacing: inherit; }
.eu-root textarea { resize: vertical; }
.eu-root iframe, .eu-root embed, .eu-root object { max-width: 100%; }

/* ── Responsive text: never let a long word cause horizontal scroll ────────── */
.eu-root { overflow-wrap: break-word; }
.eu-root :is(h1, h2, h3, h4) { overflow-wrap: break-word; }
.eu-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.eu-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.eu-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.eu-text-center { text-align: center; } .eu-text-right { text-align: right; }
.eu-upper { text-transform: uppercase; letter-spacing: var(--eu-tracking-wide); }
.eu-underline { text-decoration: underline; text-underline-offset: 0.15em; }

/* ── Lists & tables ────────────────────────────────────────────────────────── */
.eu-list-reset { list-style: none; padding: 0; margin: 0; }
.eu-table { width: 100%; border-collapse: collapse; }
.eu-table :is(th, td) { padding: var(--eu-space-2) var(--eu-space-3); border-bottom: 1px solid var(--eu-color-border); text-align: start; }
.eu-table th { font-weight: var(--eu-weight-semibold); color: var(--eu-color-muted); }
/* Wide content (tables, code) scrolls inside its own box — the page never scrolls sideways. */
.eu-scroll-x { overflow-x: auto; overscroll-behavior-x: contain; }

/* ── Multi-column text ─────────────────────────────────────────────────────── */
.eu-columns { column-width: 18rem; column-gap: var(--eu-space-8); }
.eu-columns > * { break-inside: avoid; }

/* ── Ratios & sizing helpers ───────────────────────────────────────────────── */
.eu-ratio-square { aspect-ratio: 1; } .eu-ratio-video { aspect-ratio: 16 / 9; } .eu-ratio-portrait { aspect-ratio: 3 / 4; }
.eu-cover { object-fit: cover; } .eu-contain { object-fit: contain; }
.eu-full { width: 100%; } .eu-full-h { block-size: 100%; }

/* ── Motion (token-driven; respects reduced-motion below) ──────────────────── */
.eu-transition { transition: color, background-color, border-color, box-shadow, transform, opacity; transition-duration: var(--eu-dur-base); transition-timing-function: var(--eu-ease-standard); }
.eu-root :is(a, button, .eu-transition) { transition-property: color, background-color, border-color, box-shadow, transform, opacity; transition-duration: var(--eu-dur-fast); transition-timing-function: var(--eu-ease-standard); }

/* ── Mobile safe-area (notches) — opt-in ───────────────────────────────────── */
.eu-safe { padding-inline: max(clamp(1rem, 4vw, 3rem), env(safe-area-inset-left)) max(clamp(1rem, 4vw, 3rem), env(safe-area-inset-right)); }

/* ── Print ─────────────────────────────────────────────────────────────────── */
@media print {
  .eu-root { background: #fff; color: #000; }
  .eu-no-print { display: none !important; }
  .eu-root :is(h1, h2, h3) { break-after: avoid; }
  .eu-root :is(img, table, figure) { break-inside: avoid; }
  .eu-root a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.85em; color: #555; }
}

/* ── Mobile-first breakpoints (min-width): build up, never down ─────────────── */
@media (min-width: ${BREAKPOINTS.md}px) { .eu-md\\:eu-hidden { display: none; } .eu-md\\:show { display: revert; } }
@media (min-width: ${BREAKPOINTS.lg}px) { .eu-lg\\:cols-3 { grid-template-columns: repeat(3, 1fr); } }

/* ── Accessibility: honour reduced-motion ──────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .eu-root *, .eu-root *::before, .eu-root *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
`.trim();

/** The complete Educo UI stylesheet for a theme: token variables + base rules + component styles. */
export function stylesheet(theme: SiteTheme): string {
  return `${tokensToCss(tokensFromTheme(theme))}\n${BASE_CSS}\n${COMPONENT_CSS}`;
}
