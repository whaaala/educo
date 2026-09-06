/**
 * The Alert's looks, as SEPARATE AXES rather than one exclusive list.
 *
 * WHY IT IS NOT ONE LIST OF 54 (corrected 2026-09-05). The first cut put all 54 into a single `variant` field,
 * which meant they were mutually exclusive: a user could pick "Ticket" OR "Compact", never both. But only ~22
 * of them are distinct LOOKS; the rest are MODIFIERS — a corner shape, a border style, an icon treatment, a
 * density, an alignment — and every one of those is orthogonal to the look. Presenting a modifier as a design
 * is misleading twice over: the tiles are not meaningfully different from each other, and the combination the
 * user actually wants is unreachable.
 *
 * Split this way the same CSS yields ~22 × 6 × 8 × 8 × 3 × 4 × 7 reachable combinations instead of 54, and each
 * control is small enough to understand on its own. It is also how the design systems we studied model it —
 * Carbon has a variant AND a contrast, not one list of everything.
 *
 * RULE T follows from this: every entry in a DESIGN gallery must be visibly different from every other, and a
 * browser test asserts it by rendering them all and comparing what the browser actually computes.
 *
 * Every id is a class suffix; the CSS lives in `components.ts` under `.eu-alert<id>`. All of it paints with
 * `--al-c` (the severity colour) so one rule serves all six severities and re-themes with the site.
 */

export type AlertOption = { id: string; label: string };
export type AlertDesignGroup = { group: string; items: AlertOption[] };

/**
 * THE DESIGN AXIS — 22 genuinely distinct looks. Each changes the whole impression of the alert, not one
 * property of it. This is what the design gallery shows.
 */
export const ALERT_DESIGNS: AlertDesignGroup[] = [
  { group: "Filled & tinted", items: [
    { id: "", label: "Soft" },
    { id: "--solid", label: "Solid" },
    { id: "--gradient", label: "Gradient" },
    { id: "--duotone", label: "Duotone" },
    { id: "--inset", label: "Inset" },
    { id: "--quiet", label: "Quiet" },
  ] },
  { group: "Outlined & ruled", items: [
    { id: "--outline", label: "Outline" },
    { id: "--frame", label: "Framed" },
    { id: "--accent", label: "Left accent" },
    { id: "--top", label: "Top accent" },
    { id: "--underline", label: "Underline" },
    { id: "--bracket", label: "Bracket" },
    { id: "--stripe", label: "Striped edge" },
  ] },
  { group: "Raised & layered", items: [
    { id: "--card", label: "Card" },
    { id: "--elevated", label: "Elevated" },
    { id: "--shadowed", label: "Hard shadow" },
    { id: "--glass", label: "Glass" },
    { id: "--note", label: "Sticky note" },
  ] },
  { group: "Shaped & characterful", items: [
    { id: "--split", label: "Icon panel" },
    { id: "--ribbon", label: "Ribbon" },
    { id: "--ticket", label: "Ticket" },
    { id: "--bubble", label: "Speech bubble" },
    { id: "--terminal", label: "Terminal" },
  ] },
];

/** How the corners are cut. Orthogonal to the design — any look can be sharp or pill-shaped. */
export const ALERT_SHAPES: AlertOption[] = [
  { id: "", label: "Default" },
  { id: "--sharp", label: "Sharp" },
  { id: "--round", label: "Rounded" },
  { id: "--pill", label: "Pill" },
  { id: "--cut", label: "Cut corner" },
  { id: "--lean", label: "Leaning" },
];

/** The border treatment. Orthogonal: a Card can be dashed, a Soft alert can have a thick left edge. */
export const ALERT_BORDERS: AlertOption[] = [
  { id: "", label: "Default" },
  { id: "--hairline", label: "Hairline" },
  { id: "--dashed", label: "Dashed" },
  { id: "--dotted", label: "Dotted" },
  { id: "--double", label: "Double" },
  { id: "--thick-left", label: "Thick left" },
  { id: "--thick-top", label: "Thick top" },
  { id: "--thick-bottom", label: "Thick bottom" },
];

/** How the icon is presented. */
export const ALERT_ICON_STYLES: AlertOption[] = [
  { id: "", label: "Plain" },
  { id: "--icon-square", label: "Tile" },
  { id: "--icon-circle", label: "Circle" },
  { id: "--icon-outline", label: "Ring" },
  { id: "--icon-big", label: "Large" },
  { id: "--icon-top", label: "Above the text" },
  { id: "--icon-right", label: "On the right" },
  { id: "--no-icon", label: "No icon" },
];

/** How much room it takes. */
export const ALERT_DENSITIES: AlertOption[] = [
  { id: "", label: "Default" },
  { id: "--compact", label: "Compact" },
  { id: "--spacious", label: "Spacious" },
];

/** How loudly the words are set. */
export const ALERT_EMPHASIS: AlertOption[] = [
  { id: "", label: "Default" },
  { id: "--large", label: "Large text" },
  { id: "--strong-title", label: "Strong title" },
  { id: "--caps-title", label: "Small caps title" },
  { id: "--loud", label: "Loud" },
];

/**
 * How the parts are arranged.
 *
 * There is no "Full width" here: an alert is already full width by default, so the option set
 * `max-inline-size: none` and did precisely nothing. RULE T's distinctness test caught it as a duplicate of
 * the default — which is what a dud option always is.
 */
export const ALERT_LAYOUTS: AlertOption[] = [
  { id: "", label: "Default" },
  { id: "--centred", label: "Centred" },
  { id: "--end", label: "Right aligned" },
  { id: "--inline-title", label: "Title inline" },
  { id: "--narrow", label: "Narrow" },
  { id: "--flush", label: "Edge to edge" },
];

/** Every axis except the design, for the inspector and for the tests that check each has CSS. */
export const ALERT_AXES = [
  { key: "alertShape", label: "Shape", options: ALERT_SHAPES, hint: "corners" },
  { key: "alertBorder", label: "Border", options: ALERT_BORDERS, hint: "the edge" },
  { key: "alertIconStyle", label: "Icon", options: ALERT_ICON_STYLES, hint: "how it is framed" },
  { key: "alertDensity", label: "Density", options: ALERT_DENSITIES, hint: "room it takes" },
  { key: "alertEmphasis", label: "Emphasis", options: ALERT_EMPHASIS, hint: "how loud" },
  { key: "alertLayout", label: "Layout", options: ALERT_LAYOUTS, hint: "arrangement" },
] as const;

export type AlertAxisKey = (typeof ALERT_AXES)[number]["key"];

/** How many distinct designs the gallery offers. */
export const ALERT_DESIGN_COUNT = ALERT_DESIGNS.reduce((n, g) => n + g.items.length, 0);

/** Every design id — used by the tests that check each one has CSS and renders differently. */
export const ALERT_DESIGN_IDS = ALERT_DESIGNS.flatMap((g) => g.items.map((i) => i.id));

/** Every id across every axis, design included. */
export const ALERT_ALL_IDS = [...ALERT_DESIGN_IDS, ...ALERT_AXES.flatMap((a) => a.options.map((o) => o.id))];

/** How many looks are actually reachable by combining the axes — the number that matters to a user. */
export const ALERT_COMBINATIONS = ALERT_AXES.reduce((n, a) => n * a.options.length, ALERT_DESIGN_COUNT);
