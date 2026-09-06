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
import { LAYOUT_CSS, RUNG_PX, RUNG_EM, RUNG_MEASURE } from "./layout";

/**
 * The breakpoint ladder now lives in `layout.ts`, named for what each rung IS rather than for a t-shirt size.
 * These two are re-exported so the rest of the app has one import site, but there is only ONE ladder — the
 * Tailwind-shaped 640/768/1024/1280/1536 that used to live here is gone, along with the second and third
 * ladders that had grown up beside it.
 */
export { RUNG_PX as BREAKPOINTS, RUNG_EM as BREAKPOINTS_EM };

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

/* ── Fluid layout primitives ───────────────────────────────────────────────── */
/* Containers, bands and the space tiers live in the layout layer — see layout.ts. */
${LAYOUT_CSS}

/* A whole utility layer used to sit here — .eu-grid, .eu-stack, .eu-cluster, .eu-center, .eu-media,
 * .eu-surface, .eu-p-*, .eu-round, .eu-shadow, .eu-hidden, .eu-truncate, .eu-clamp-*, .eu-text-*, .eu-upper,
 * .eu-underline, .eu-list-reset, .eu-table, .eu-scroll-x, .eu-columns, .eu-ratio-*, .eu-cover, .eu-contain,
 * .eu-full, .eu-transition, .eu-safe, .eu-no-print, .eu-visually-hidden and the .eu-cq-* container-query
 * scaffolding. Thirty-six classes, and NOTHING could apply any of them: the builder emits markup from the
 * node tree, and a user cannot type a class name anywhere in the product. They shipped in styles.css to
 * every page of every school site and could not affect one pixel.
 *
 * The rules worth keeping were the ones addressed by ELEMENT rather than by class (tables, images, links),
 * and those are still here, scoped under .eu-root. The rest return when a control emits them.
 */

/* ── Basic user interface + accessibility ──────────────────────────────────── */
.eu-root :focus-visible { outline: 2px solid var(--eu-color-brand); outline-offset: 2px; border-radius: 3px; }
.eu-root :focus:not(:focus-visible) { outline: none; }
.eu-root ::selection { background: var(--eu-color-primary-200); color: var(--eu-color-text); }
.eu-root ::placeholder { color: var(--eu-color-muted); opacity: 1; }
.eu-root :is(button, [role="button"], summary, label[for]) { cursor: pointer; }

/* ── Forms & embedded content: inherit type, never overflow ────────────────── */
.eu-root button, .eu-root input, .eu-root select, .eu-root textarea { font: inherit; color: inherit; letter-spacing: inherit; }
.eu-root textarea { resize: vertical; }
.eu-root iframe, .eu-root embed, .eu-root object { max-width: 100%; }

/* ── Responsive text: never let a long word cause horizontal scroll ────────── */
.eu-root { overflow-wrap: break-word; }
.eu-root :is(h1, h2, h3, h4) { overflow-wrap: break-word; }

/* ── Tables ────────────────────────────────────────────────────────────────── */
/* Addressed by ELEMENT, not by a class: a table block emits a plain table tag, so an .eu-table class would
   never be on it. Scoped under .eu-root so it cannot reach the editor chrome. */
.eu-root table { width: 100%; border-collapse: collapse; }
.eu-root :is(th, td) { padding: var(--eu-space-2) var(--eu-space-3); border-bottom: 1px solid var(--eu-color-border); text-align: start; }
.eu-root th { font-weight: var(--eu-weight-semibold); color: var(--eu-color-muted); }

/* ── Motion (token-driven; respects reduced-motion below) ──────────────────── */
.eu-root :is(a, button) { transition-property: color, background-color, border-color, box-shadow, transform, opacity; transition-duration: var(--eu-dur-fast); transition-timing-function: var(--eu-ease-standard); }

/* ── Print ─────────────────────────────────────────────────────────────────── */
@media print {
  .eu-root { background: #fff; color: #000; }
  .eu-root :is(h1, h2, h3) { break-after: avoid; }
  .eu-root :is(img, table, figure) { break-inside: avoid; }
  .eu-root a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.85em; color: #555; }
}

/* (Two breakpoint utilities used to sit here, prefixed eu-md and eu-lg. No renderer ever emitted them, so they
   were bytes on every page that could not affect one — removed with the second ladder they belonged to. The
   real breakpoints are the rungs in layout.ts, applied by the container measures above.) */

/* ── Accessibility: honour reduced-motion ──────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .eu-root *, .eu-root *::before, .eu-root *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
`.trim();

/** The complete Educo UI stylesheet for a theme: token variables + base rules + component styles. */
export function stylesheet(theme: SiteTheme): string {
  return `${tokensToCss(tokensFromTheme(theme))}\n${BASE_CSS}\n${COMPONENT_CSS}`;
}
