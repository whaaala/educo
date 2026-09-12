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

/** The five rungs, in px. Every other form is derived — never re-type a number. */
export const RUNG_PX = {
  phone: 0,
  tabletPortrait: 600,
  tabletLandscape: 900,
  desktop: 1200,
  wide: 1800,
} as const;

export type RungName = keyof typeof RUNG_PX;

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
export const RUNG_MEASURE: { [K in RungName]: string | null } = {
  phone: null, // no cap — the page gutters already hold it in
  tabletPortrait: "34rem",
  tabletLandscape: "52rem",
  desktop: "68rem",
  wide: "76rem",
};

/** Human labels, so the builder's device chips and this ladder can never disagree. */
export const RUNG_LABEL: { [K in RungName]: string } = {
  phone: "Phone",
  tabletPortrait: "Tablet portrait",
  tabletLandscape: "Tablet landscape",
  desktop: "Desktop",
  wide: "Big desktop",
};

export const RUNG_ORDER = Object.keys(RUNG_PX) as RungName[];

/** A mobile-first media query for a rung. The phone rung has none — it IS the base. */
export function mediaFrom(rung: RungName): string | null {
  return rung === "phone" ? null : `@media (min-width: ${RUNG_EM[rung]}em)`;
}

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
@SCOPE@ {
  --eu-gutter-page:    clamp(1rem, 4vw, 3rem);
  --eu-gap-section:    clamp(2.5rem, 6vw, 6rem);
  --eu-gap-group:      clamp(1.25rem, 2.5vw, 2.5rem);
  --eu-gap-element:    clamp(0.5rem, 1vw, 1rem);
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
@CONTAINED_SEL@ { padding-inline: max(var(--eu-gutter-page), (100% - var(--eu-measure, 100%)) / 2) !important; }
`.trim();

/** The layout layer as the export ships it. */
export const LAYOUT_CSS = layoutCss();
