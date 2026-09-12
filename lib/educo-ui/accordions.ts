/**
 * The Accordion's looks, as SEPARATE AXES rather than one exclusive list of 55.
 *
 * Same correction as the Alert's, for the same reason (RULE T, 2026-09-05). Of the 55 entries, 29 were genuinely
 * distinct DESIGNS — Timeline, Folder tabs, Chat bubble, Dark glossy, Two-column — and 26 were MODIFIERS: which
 * indicator marks a row, how the items are framed, how they are spaced, what colour an open row takes, whether
 * rows are numbered, how dense they are. Every one of those is orthogonal to the design, but a single `variant`
 * field made them mutually exclusive: a user could have "Timeline" OR "Numbered", never both.
 *
 * Split this way the same CSS yields 29 × 7 × 6 × 6 × 7 × 3 × 3 reachable looks instead of 55, and the design
 * gallery finally contains only things that are actually different from each other.
 *
 * Each `id` is a class suffix; the CSS lives in `components.ts` under `.eu-accordion<id>`.
 */

export type AccordionOption = { id: string; label: string };
export type AccordionDesignGroup = { group: string; items: AccordionOption[] };

/** THE DESIGN AXIS — looks that change the whole character of the accordion. */
export const ACCORDION_DESIGNS: AccordionDesignGroup[] = [
  { group: "Signature — distinct designs", items: [
    { id: "", label: "Boxed" },
    { id: "--horizontal", label: "Horizontal" }, { id: "--panel", label: "Solid panel" }, { id: "--index", label: "Index tile" },
    { id: "--bignum", label: "Big number" }, { id: "--ring", label: "Ring step" }, { id: "--bubble", label: "Chat bubble" },
    { id: "--qa", label: "Q & A" }, { id: "--callout", label: "Callout" }, { id: "--float", label: "Float" },
    { id: "--folder", label: "Folder tabs" }, { id: "--news", label: "Editorial" }, { id: "--menu", label: "Menu pills" },
    { id: "--enclosed", label: "Enclosed card" }, { id: "--invert", label: "Dark glossy" }, { id: "--grid", label: "Two-column" },
    { id: "--quote", label: "Quote" }, { id: "--glass", label: "Glass" }, { id: "--timeline", label: "Timeline" },
    { id: "--alt", label: "Alternating" }, { id: "--stripe", label: "Colour stripe" }, { id: "--spotlight", label: "Spotlight" },
    { id: "--corner", label: "Folded corner" }, { id: "--split", label: "Split (media panel)" },
  ] },
  { group: "Quiet & minimal", items: [
    { id: "--ghost", label: "Ghost" }, { id: "--line", label: "Line" }, { id: "--minimal", label: "Minimal" },
    { id: "--underline", label: "Underline" }, { id: "--soft", label: "Soft" },
  ] },
];

/** Which marker tells a reader a row opens. Orthogonal — any design can use any indicator. */
export const ACCORDION_INDICATORS: AccordionOption[] = [
  { id: "", label: "Default" },
  { id: "--chevron", label: "Chevron" }, { id: "--arrow", label: "Arrow" }, { id: "--plus-circle", label: "Plus circle" },
  { id: "--tag", label: "Tag dot" }, { id: "--switch", label: "Switch" }, { id: "--left", label: "On the left" },
];

/** How each row is framed. */
export const ACCORDION_FRAMES: AccordionOption[] = [
  { id: "", label: "Default" },
  { id: "--outline", label: "Outline" }, { id: "--elevated", label: "Elevated" }, { id: "--dashed", label: "Dashed" },
  { id: "--pill", label: "Pill" }, { id: "--square", label: "Square" },
];

/** How the rows are spaced and separated. */
export const ACCORDION_RHYTHMS: AccordionOption[] = [
  { id: "", label: "Default" },
  { id: "--flush", label: "Flush" }, { id: "--separated", label: "Separated" }, { id: "--divided", label: "Divided" },
  { id: "--zebra", label: "Zebra" }, { id: "--rail", label: "Rail" },
];

/** What colour an OPEN row takes. */
export const ACCORDION_OPEN_COLOURS: AccordionOption[] = [
  { id: "", label: "Default" },
  { id: "--filled", label: "Filled" }, { id: "--accent", label: "Accent edge" }, { id: "--brand-header", label: "Brand header" },
  { id: "--body-tint", label: "Body tint" }, { id: "--gradient", label: "Gradient when open" }, { id: "--gradient-full", label: "Gradient bars" },
];

/** Whether rows carry a number. */
export const ACCORDION_NUMBERING: AccordionOption[] = [
  { id: "", label: "None" }, { id: "--numbered", label: "Numbered" }, { id: "--stepper", label: "Stepper" },
];

/** How much room each row takes. */
export const ACCORDION_DENSITIES: AccordionOption[] = [
  { id: "", label: "Default" }, { id: "--large", label: "Large" }, { id: "--compact", label: "Compact" },
];

/** Every axis except the design — for the inspector, and for the tests that check each option has CSS. */
export const ACCORDION_AXES = [
  { key: "accIndicator", label: "Indicator", options: ACCORDION_INDICATORS, hint: "the open marker" },
  { key: "accFrame", label: "Frame", options: ACCORDION_FRAMES, hint: "each row's edge" },
  { key: "accRhythm", label: "Rhythm", options: ACCORDION_RHYTHMS, hint: "spacing between rows" },
  { key: "accOpenColour", label: "Open colour", options: ACCORDION_OPEN_COLOURS, hint: "an open row" },
  { key: "accNumbering", label: "Numbering", options: ACCORDION_NUMBERING, hint: "row numbers" },
  { key: "accDensity", label: "Density", options: ACCORDION_DENSITIES, hint: "room per row" },
] as const;

export type AccordionAxisKey = (typeof ACCORDION_AXES)[number]["key"];

/** How many distinct designs the gallery offers. */
export const ACCORDION_DESIGN_COUNT = ACCORDION_DESIGNS.reduce((n, g) => n + g.items.length, 0);

export const ACCORDION_DESIGN_IDS = ACCORDION_DESIGNS.flatMap((g) => g.items.map((i) => i.id));

/** Every id across every axis, design included. */
export const ACCORDION_ALL_IDS = [...ACCORDION_DESIGN_IDS, ...ACCORDION_AXES.flatMap((a) => a.options.map((o) => o.id))];

/** How many looks are reachable by combining the axes — the number that matters to a user. */
export const ACCORDION_COMBINATIONS = ACCORDION_AXES.reduce((n, a) => n * a.options.length, ACCORDION_DESIGN_COUNT);
