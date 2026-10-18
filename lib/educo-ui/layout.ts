/**
 * Educo UI — the LAYOUT layer (Phase 1b).
 *
 * Everything about how a page is divided up lives here, so there is exactly ONE ladder and ONE set of
 * containers. Before this module the system had three: `BREAKPOINTS` in base.ts (a Tailwind-shaped
 * 640/768/1024/1280/1536), hand-typed container queries at 34rem and 52rem, and a `--eu-container-max`
 * variable that nothing ever set. Three ladders is the same as none — a section could not be told to run
 * edge-to-edge, and "wide" meant something different in each place.
 *
 * THE RUNGS are named for what they ARE, not for a device that was popular the year they were written. They
 * come from screen-resolution statistics rather than device marketing: a phone, a tablet held either way, a
 * desktop, and a stop that keeps a page from stretching to absurdity on a television.
 *
 * WHY `em` AND NOT `px`. A px breakpoint ignores a reader who has enlarged their browser font; an em one
 * respects them. For a school audience — parents reading on a phone at arm's length, staff on old machines —
 * that is the difference between a usable page and one they have to pinch. Bootstrap chooses px deliberately;
 * this is a deliberate divergence from it.
 *
 * WHY TIERS AND NOT A FLAT SCALE. A single six-step spacer makes every gap a number a person has to choose.
 * Space instead carries meaning: a lot between SECTIONS, less between GROUPS, least between ELEMENTS. That is
 * the Law of Proximity — the more things belong together, the closer they sit — and expressing it as three
 * named tiers lets the builder be right by default rather than asking a teacher to guess a number.
 */

import LAYOUT from "../../config/layout.json";

/** The five rungs, as configured in `config/layout.json` (RULE CFG). Every other form is derived — never re-type a number. */
export type RungName = keyof typeof LAYOUT.rungs;
const RUNGS = LAYOUT.rungs as { [K in RungName]: { from: number; label: string; words: string; measure: string | null } };

/** The rungs' first px, in order. Validated where the config is read: phone at 0, each rung wider than the last. */
export const RUNG_PX = Object.fromEntries(Object.entries(RUNGS).map(([k, r]) => [k, r.from])) as { [K in RungName]: number };
Object.values(RUNG_PX).forEach((px, i, all) => {
  if (!Number.isFinite(px) || (i === 0 ? px !== 0 : px <= all[i - 1])) throw new Error(`config/layout.json: rung ${i} "from" ${px} — phone must be 0 and each rung wider than the one before`);
});

/** The HEIGHT classes, first px of each (A-2 (2)): a phone held sideways is under `medium`. */
export type HeightClass = keyof typeof LAYOUT.heights;
export const HEIGHT_PX = LAYOUT.heights as { [K in HeightClass]: number };
Object.values(HEIGHT_PX).forEach((px, i, all) => {
  if (!Number.isFinite(px) || (i === 0 ? px !== 0 : px <= all[i - 1])) throw new Error(`config/layout.json: height ${i} ${px} — compact must be 0 and each class taller than the one before`);
});
export type Shell = "bar" | "rail" | "sidebar";
export interface WindowClass { width: RungName; height: HeightClass; shell: Shell; panes: 1 | 2; /** how many places a bar holds legibly here (≥ 2, ≤ shell.barMax) */ barFits: number }
const last = <K extends string>(steps: { [k in K]: number }, v: number) => (Object.keys(steps) as K[]).filter((k) => v >= steps[k]).pop() as K;
const SHELL = LAYOUT.shell as { barBelow: { width: RungName; height: HeightClass }; sidebarFrom: RungName; barMax: number; barItemMin: number };
const SPLIT_FROM = LAYOUT.listDetail.splitFrom as RungName;
for (const [what, name, set] of [["shell.barBelow.width", SHELL.barBelow.width, RUNG_PX], ["shell.sidebarFrom", SHELL.sidebarFrom, RUNG_PX], ["listDetail.splitFrom", SPLIT_FROM, RUNG_PX], ["shell.barBelow.height", SHELL.barBelow.height, HEIGHT_PX]] as const) {
  if (!(name in set)) throw new Error(`config/layout.json: ${what} "${name}" is not one of ${Object.keys(set).join(" / ")}`);
}
/**
 * What a window of `width` × `height` CSS px is (A-2 (2)) — read by the web app and `apps/mobile/` alike, so a phone, a turned
 * phone, a tablet and a desktop get the same answer everywhere. The navigation follows M3's NavigationSuiteScaffold: a bar
 * when the width OR the height is compact, a sidebar from `shell.sidebarFrom`, a rail between; a list and its detail sit
 * side by side from `listDetail.splitFrom`; a bar holds `barFits` places. Every line is in `config/layout.json` (RULE CFG). The width
 * and height are in the unit the CSS rungs use — CSS px at the reader's text size (web: px ÷ 1em × 16; app: dp ÷ fontScale).
 */
export function windowClass(width: number, height: number): WindowClass {
  const w = last(RUNG_PX, width), h = last(HEIGHT_PX, height);
  const shell: Shell = width < RUNG_PX[SHELL.barBelow.width] || height < HEIGHT_PX[SHELL.barBelow.height] ? "bar" : width >= RUNG_PX[SHELL.sidebarFrom] ? "sidebar" : "rail";
  // a bar holds as many places as are legible at this text size (A2-22: at 200 % a 375 phone has room for two, not five)
  const barFits = Math.max(2, Math.min(SHELL.barMax, Math.floor(width / SHELL.barItemMin)));
  return { width: w, height: h, shell, panes: width >= RUNG_PX[SPLIT_FROM] ? 2 : 1, barFits };
}

/** The Educo app home's quick-action tiles: as many across as fit at minWidth each (dp at the reader's text size), up to maxAcross. */
export const APP_TILES: Readonly<{ minWidth: number; maxAcross: number }> = LAYOUT.appTiles;
/** The narrowest phone a row must still fit, in px (RULE AF). */
export const NARROWEST_PHONE_PX: number = LAYOUT.narrowestPhone;
/** A video's proportions — its height follows its width (RX3-2). */
export const MEDIA: Readonly<{ videoRatio: string; portraitRatio: string; portraitWidthRem: number; pagerDotFill: string; pagerDotRing: string; pagerArrowFill: string; pagerArrowEdge: string }> = LAYOUT.media;
/** AC-9 · the site's one content width (rem): its slider's bounds, start and step (RULE CFG). */
export const CONTENT_WIDTH: Readonly<{ minRem: number; maxRem: number; startRem: number; stepRem: number }> = LAYOUT.contentWidth;
if (!(CONTENT_WIDTH.minRem > 0 && CONTENT_WIDTH.minRem <= CONTENT_WIDTH.startRem && CONTENT_WIDTH.startRem <= CONTENT_WIDTH.maxRem && CONTENT_WIDTH.stepRem > 0)) throw new Error("config/layout.json: contentWidth needs 0 < minRem ≤ startRem ≤ maxRem and stepRem > 0");
/** The editor's own chrome line: from here its panels dock beside the canvas. Not a rung. */
export const EDITOR_DOCK_PX: number = LAYOUT.editor.dockFrom;
/** The narrowest a column in a row is drawn, rem — untouched, sized by hand, a page-grid block below the tablet rung (RULE CFG, L5-3). */
export const COLUMN_FLOORS_REM: Readonly<{ reflowFloorRem: number; handFloorRem: number; blockFloorRem: number }> = LAYOUT.columns;
/** The editor's edge-drag thresholds (RULE CFG, L5-3) — see `resize.$comment` in config/layout.json. */
export const RESIZE: Readonly<{ hugSnapPx: number; neighbourMinTracks: number; minRowPx: number; wrapPullPx: number }> = LAYOUT.resize;
/** The Educo web app's breakpoints (Tailwind's xs / sm / md / lg / xl / 2xl), in px — the same numbers its classes use. */
export const WEB_SCREEN_PX: Readonly<Record<keyof typeof LAYOUT.webApp.screens, number>> = LAYOUT.webApp.screens;
/** How the Page check names each rung's screens. */
export const RUNG_WORDS = Object.fromEntries(Object.entries(RUNGS).map(([k, r]) => [k, r.words])) as { [K in RungName]: string };

/** The same ladder in `em`, which is what a media query should use. Derived, so it cannot drift. */
export const RUNG_EM = Object.fromEntries(
  Object.entries(RUNG_PX).map(([k, px]) => [k, px / 16]),
) as { [K in RungName]: number };

/**
 * The measure each rung caps a contained column at.
 *
 * A container is not simply "as wide as it can be": past roughly 75 characters a line of text becomes hard to
 * track back to the start of, so each rung earns a cap rather than inheriting the viewport.
 */
export const RUNG_MEASURE = Object.fromEntries(Object.entries(RUNGS).map(([k, r]) => [k, r.measure])) as { [K in RungName]: string | null }; // phone: null — the page gutters already hold it in

/** Human labels, so the builder's device chips and this ladder can never disagree. */
export const RUNG_LABEL = Object.fromEntries(Object.entries(RUNGS).map(([k, r]) => [k, r.label])) as { [K in RungName]: string };

export const RUNG_ORDER = Object.keys(RUNG_PX) as RungName[];

/** A mobile-first media query for a rung. The phone rung has none — it IS the base. */
export function mediaFrom(rung: RungName): string | null {
  return rung === "phone" ? null : `@media (min-width: ${RUNG_EM[rung]}em)`;
}

/** The query for every width UNDER `px` (the last em before it), for the editor's own `matchMedia`. */
export const mediaBelow = (px: number) => `(max-width: ${px / 16 - 0.01}em)`;

/** Wrap declarations in the query for a rung, or return them bare on the phone rung. */
export function atRung(rung: RungName, css: string): string {
  const q = mediaFrom(rung);
  return q ? `${q} {\n${css}\n}` : css;
}

/**
 * The measure is set on the ROOT, not on `.eu-container`, so anything can read it — a contained band needs it
 * to work out its own padding, and a component that wants to line up with the page column needs it too. It is
 * a value the whole page shares, so it belongs where the whole page can inherit it.
 */
const measureSteps = (scope: string) =>
  RUNG_ORDER.filter((r) => r !== "phone")
    .map((r) => `${mediaFrom(r)} { ${scope} { --eu-measure: ${RUNG_MEASURE[r]}; } }`)
    .join("\n");

/**
 * The layout layer, for a given root scope.
 *
 * The export's root is `.eu-root`; the BUILDER CANVAS root is `.eu-tokens`, because the canvas is React nodes
 * rather than an exported document. Both need the same variables or a contained band is contained in the
 * export and full-bleed on the canvas — the canvas≠export trap this project keeps re-learning.
 */
export function layoutCss(scope = ".eu-root"): string {
  return LAYOUT_TEMPLATE
    .split("@SCOPE@").join(scope)
    .split("@CONTAINED_SEL@").join(within(scope, ".eu-band--contained"))
    .split("@ONE_SEL@").join(within(scope, ".eu-band--contained.eu-band--one"))
    .split("@ONE_KID_SEL@").join(within(scope, ".eu-band--contained.eu-band--one > *"))
    .replace("@MEASURE_STEPS@", measureSteps(scope));
}

/**
 * Write a selector as a descendant of every root in the scope list.
 *
 * This exists for specificity, not tidiness. Every block also gets its own generated `.bx-<id>` rule, and a
 * band's carries `padding: 0`. A bare `.eu-band--contained` ties with that on specificity, so whichever is
 * written later wins — and that is the block's rule, which meant a contained band rendered pixel-identically
 * to a full-bleed one. The browser was the only thing that could catch it: the classes were all correct.
 *
 * (Consequence, deliberate: a padding set by hand on a CONTAINED band no longer applies horizontally — the
 * centred column IS the horizontal padding. Padding on a full-bleed band, and on anything inside the column,
 * behaves exactly as before.)
 */
const within = (scope: string, sel: string) =>
  scope.split(",").map((s) => `${s.trim()} ${sel}`).join(", ");

const LAYOUT_TEMPLATE = `
/* ── Space tiers: meaning, not numbers ─────────────────────────────────────── */
/* Between SECTIONS ≫ between GROUPS ≫ between ELEMENTS (Law of Proximity). Fluid, so they scale with the
   viewport without a media query, and clamped so they never collapse on a phone or run away on a television. */
/* cqw, NOT vw (#117): a viewport unit reads the BROWSER WINDOW, and in the editor that is the whole screen, not the
   frame the page is drawn in — so at the Mobile preset on a 1520px window the page gutter came out 3rem (4vw = 61px,
   capped) where a visitor at 375px gets 1rem: every contained section was 74% wide on the canvas and 91.5% in the
   Preview, measured on every dressed page. The editor's frame is a size container, so cqw reads the frame there; a
   published page has no container above its root, where cqw falls back to the viewport — the same number as before. */
/* …and a rem IN THE IDEAL TERM (Core Rule 16; decided 2026-09-28): a bare container term ignores the reader's own text
   size between the bounds — measured before, a 24px browser setting moved the gutter 0px. Split so the value at a 16px
   reader stays within a few px of the old one: 375px 19 (was 16) · 768px 31 (31) · 1280px 46 (48). */
@SCOPE@ {
  --eu-gutter-page:    clamp(1rem, 0.5rem + 3cqw, 3rem);
  --eu-gap-section:    clamp(2.5rem, 1rem + 4.5cqw, 6rem);
  --eu-gap-group:      clamp(1.25rem, 0.5rem + 1.8cqw, 2.5rem);
  --eu-gap-element:    clamp(0.5rem, 0.25rem + 0.7cqw, 1rem);
}
/* The tiers are shipped as TOKENS, not as utility classes.
 *
 * A class is only worth its bytes if something can put it on an element, and nothing can: the builder emits
 * markup from the node tree, and a user cannot type a class name anywhere. Utility classes for these
 * (.eu-gap-*, .eu-flow-*, .eu-container and its variants, .eu-band--scrim) were written first and shipped in
 * styles.css to every page of every school site with no possible way to be applied — the same defect as the
 * --eu-container-max variable that nothing set, which this module was created to remove. They come back in
 * Phase 2, in the same change as the controls that emit them.
 *
 * The tokens below stay, and are genuinely reachable: a user CAN write var(--eu-gap-section) in a block's
 * Advanced CSS, and the components read them.
 */

/* ── The page measure, per rung ────────────────────────────────────────────── */
@MEASURE_STEPS@

/* ── Bands ─────────────────────────────────────────────────────────────────── */
/* Runs edge to edge. */
.eu-band { width: 100%; max-width: none; margin-inline: 0; }

/* A CONTAINED band: the background still runs edge to edge, but the content sits on the page's measure —
   the single most common section on a school site, and the thing the builder could not express at all.
   Done with padding rather than an inner wrapper: a wrapper would become the band's only flex child and
   collapse the row of sections inside it. The max() keeps the page gutter on a screen narrower than the
   measure, so the text never touches the edge on a phone. */
/* Marked important for the same reason the hover effects are: the CANVAS writes its box as an inline style
   attribute, and an inline style beats any stylesheet rule at any specificity. Without it the band was
   contained in the published site and full-bleed while you edited it — every class name still read correct. */
/* LE-3 (AC-9): with the SITE's content width the floor is 0 (--eu-measure-floor, set on the page root) and the band's own side space
   rides on top (--bx-side-l / -r, written by pageBandInset only then) — so the space at the sides is the page's side space below the
   width, and every kind of row is the width less its side space above it. Without a site width both are unset: exactly as before. */
@CONTAINED_SEL@ {
  padding-left: calc(max(var(--eu-measure-floor, var(--eu-gutter-page)), (100% - var(--eu-measure, 100%)) / 2) + var(--bx-side-l, 0rem)) !important;
  padding-right: calc(max(var(--eu-measure-floor, var(--eu-gutter-page)), (100% - var(--eu-measure, 100%)) / 2) + var(--bx-side-r, 0rem)) !important;
}
/* L6-2 (the user, 2026-10-16: "colour edge to edge"): a contained band holding ONE plain section moves that padding INTO the
   section, so the section's own colour fills the band edge to edge and its words stay on the measure: what this option promises.
   The colour is on the section because a band is invisible scaffolding no one can select; padded from outside, the colour sat in
   the column with white strips either side. A section with a card look keeps the band's padding (see bandClasses). */
@ONE_SEL@ { padding-inline: 0 !important; }
/* RX3-28 (measured HEADED 2026-10-16): the measure is the FLOOR and the section's own left / right inner spacing rides on top of it
   (--bx-pad-l / --bx-pad-r, written by paddingCSS only when the person set some). Replacing it drew Inner spacing 3 / 0.5 as 96 / 96. */
@ONE_KID_SEL@ {
  padding-left: calc(max(var(--eu-measure-floor, var(--eu-gutter-page)), (100% - var(--eu-measure, 100%)) / 2) + var(--bx-pad-l, 0rem) + var(--bx-side-l, 0rem)) !important;
  padding-right: calc(max(var(--eu-measure-floor, var(--eu-gutter-page)), (100% - var(--eu-measure, 100%)) / 2) + var(--bx-pad-r, 0rem) + var(--bx-side-r, 0rem)) !important;
}
`.trim();

/** The layout layer as the export ships it. */
export const LAYOUT_CSS = layoutCss();

/** BATCH LE-12 · the Proportion gallery's shapes (SZ-4), Custom's first value, and the card width "As many as fit" starts at (GR-2) — config/layout.json `sizes`. */
export const SIZES: Readonly<{ ratios: readonly { value: string; label: string }[]; customStart: string; autoFitStart: string }> = LAYOUT.sizes;
if (!SIZES.ratios.length || SIZES.ratios.some((r) => !/^\d+(\.\d+)? \/ \d+(\.\d+)?$/.test(r.value))) throw new Error("config/layout.json: sizes.ratios need a value written \"w / h\"");

/** BATCH LE-13 · how words flow round a picture (FL-3), a sideways strip's blocks (FL-6), and the overlap steps (PO-4) — config/layout.json `flow`. */
export const FLOW: Readonly<{ wrapWidth: string; wrapGapRem: number; wrapBelowRem: number; wrapMeasureShare: number; shapeThreshold: number; outlineRows: number; stripCard: string; overlapSteps: readonly number[] }> = LAYOUT.flow;
if (!(FLOW.shapeThreshold > 0 && FLOW.shapeThreshold < 1) || !(Number.isInteger(FLOW.outlineRows) && FLOW.outlineRows >= 4)) throw new Error("config/layout.json: flow.shapeThreshold needs a number between 0 and 1, flow.outlineRows a whole number of 4 or more");
if (!FLOW.overlapSteps.length || FLOW.overlapSteps.some((n, i) => !(n > 0) || (i > 0 && n <= FLOW.overlapSteps[i - 1]))) throw new Error("config/layout.json: flow.overlapSteps need positive rem numbers, smallest first");
if (!(FLOW.wrapGapRem >= 0) || !(FLOW.wrapBelowRem > 0) || !(FLOW.wrapMeasureShare > 0 && FLOW.wrapMeasureShare < 1)) throw new Error("config/layout.json: flow.wrapGapRem, flow.wrapBelowRem and flow.wrapMeasureShare (0 … 1) need numbers");
