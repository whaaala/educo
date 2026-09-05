import { createComponent, createContainer, createElement, type BoxNode } from "@/lib/box-model";

/**
 * THE COMPONENT CATALOGUE — the one place that answers "what components exist, and how is each one built".
 *
 * Before this there were six answers, and they disagreed. `COMPONENT_REGISTRY` claimed in its own header to be
 * the single source of truth and that "the palette, canvas, export and inspector all read from this registry" —
 * none of which was true. The palette hardcoded its own seven entries; `box-presets` decided construction and
 * silently overrode the registry for five of them; and two test harnesses each kept a hand-typed array with a
 * comment asking the next person to remember. The registry's render path for Card/Quote/Stat/Badge/Rating was
 * fully built, fully tested, and unreachable from the product.
 *
 * The fix is to separate two questions that were being conflated:
 *   • WHAT can a user add?  → one list. There is no good reason for six. That is this file.
 *   • HOW is each one built? → legitimately differs, and that difference is a feature (see below).
 *
 * TWO CONSTRUCTION STRATEGIES, both deliberate:
 *   • `component` nodes (accordion, alert) — a bespoke model with inline item editing.
 *   • EDITABLE TREES (card, quote, stat, badge, rating) — a ready-made tree whose every inner piece is a real,
 *     individually-selectable BoxNode. Click a card's heading and you get the full heading inspector. That is
 *     RULE I (CRUD on every item, on the canvas) satisfied for free, which a single opaque node cannot do
 *     without rebuilding the parts machinery. This is why we did NOT convert them to registry components.
 *
 * ADDING A FUTURE COMPONENT — one entry here is the whole job:
 *   the Blocks palette lists it, `blockForKind` builds it, `ALL_COMPONENTS` includes it, and BOTH browser
 *   invariant harnesses cover it (canvas + export, at every viewport) automatically. A unit test fails if this
 *   list and the palette ever diverge, so the coverage cannot quietly lapse.
 */

/**
 * A design in a tree component's gallery. `apply` is STYLE-ONLY by contract — it never touches text, images or
 * structure, so switching designs cannot destroy what the user has written. Enforced by a unit test.
 */
export type PresetVariant = { id: string; label: string; apply: (node: BoxNode) => BoxNode };

/**
 * ASK-ON-ADD (Rule F) — what the palette offers when you pick this component, so a user starts from the look
 * they actually want instead of the default plus a hunt through the inspector.
 *
 * Deliberately a SHORT list of meaningful starting points, not a cartesian product: the Alert alone has
 * 6 severities x 4 forms x 7 treatments, and a menu of 168 entries is not a choice, it is an obstacle.
 */
export type AddChoice = { id: string; label: string; patch: Partial<BoxNode> };

export type CatalogueEntry = {
  /** The `kind` the palette inserts and the name stored on the node. */
  name: string;
  label: string;
  hint: string;
  /** A lucide export name; the palette maps it to the icon component (this file stays React-free). */
  icon: string;
  /** How this component is constructed. The only builder the product uses. */
  build: () => BoxNode;
  /** Design gallery for a tree component. `component` nodes get theirs from COMPONENT_REGISTRY instead. */
  variants?: PresetVariant[];
  /** Ask-on-add options. Omit and a tree component derives them from its `variants`. */
  choices?: AddChoice[];
};

/**
 * Map every DESCENDANT of a given type, at any depth, numbering them in document order.
 *
 * Depth matters: when a tree is inserted, the canvas wraps each element in its own container, so a real card on
 * the page is container > container > heading, not container > heading. Matching only direct children looked
 * correct in a unit test built straight from `build()` and did nothing at all on an actual card — a variant
 * that silently no-ops. The root itself is never matched, so a variant cannot retype the component.
 */
function mapType(node: BoxNode, type: string, fn: (n: BoxNode, i: number) => BoxNode): BoxNode {
  let seen = 0;
  const walk = (n: BoxNode): BoxNode => {
    const self = n.type === type ? fn(n, seen++) : n;
    return self.children ? { ...self, children: self.children.map(walk) } : self;
  };
  return { ...node, children: (node.children ?? []).map(walk) };
}

/** Patch every descendant of a given element type — how a variant reaches "the card's heading". */
const kidsOfType = (node: BoxNode, type: string, patch: Partial<BoxNode>): BoxNode =>
  mapType(node, type, (n) => ({ ...n, ...patch }));

// ── the tree builders ─────────────────────────────────────────────────────────────────────────────
// Every colour is a design token (var(--eu-color-*)) so these re-theme with the site and pass WCAG.
// `preset` tags the tree with the component it came from — that is what lets the inspector offer a gallery for
// a node that is, structurally, just a container.

function makeCard(): BoxNode {
  return createContainer("column", { preset: "card", width: "100%", padding: 24, gap: 12, radius: 16, shadow: "md", borderWidth: 1, borderColor: "var(--eu-color-border)", background: "var(--eu-color-surface)", align: "stretch", children: [
    createElement("image", { width: "100%", height: "160px", radius: 12 }),
    createElement("heading", { text: "Card title", fontSize: 22, bold: true, width: "100%", color: "var(--eu-color-text)" }),
    createElement("text", { text: "A short description for this card goes right here.", width: "100%", color: "var(--eu-color-muted)" }),
    createElement("button", { text: "Learn more", background: "var(--eu-color-brand)", color: "var(--eu-color-on-brand)" }),
  ] });
}

function makeQuote(): BoxNode {
  return createContainer("column", { preset: "quote", width: "100%", padding: 20, paddingLeft: 24, gap: 8, borderWidth: 0, align: "start", children: [
    createElement("text", { text: "“This changed everything for us — we couldn't be happier.”", fontSize: 22, italic: true, width: "100%", color: "var(--eu-color-text)" }),
    createElement("text", { text: "— Happy Customer", fontSize: 14, width: "100%", color: "var(--eu-color-muted)" }),
  ] });
}

function makeStat(): BoxNode {
  return createContainer("column", { preset: "stat", width: "auto", padding: 16, gap: 4, align: "center", children: [
    createElement("heading", { text: "1,000+", fontSize: 44, bold: true, textAlign: "center", color: "var(--eu-color-brand)" }),
    createElement("text", { text: "Happy customers", textAlign: "center", color: "var(--eu-color-muted)" }),
  ] });
}

function makeBadge(): BoxNode {
  // A pill: a small container (which is what carries the padding) around an editable text element — click the
  // text and change everything, click the pill and restyle it.
  //
  // It used to be a SINGLE text element with padding on it. That padding was dead data: `paddingCSS` is only
  // applied by `containerStyle`, so elements never render it — which is why the inspector correctly offers
  // "Inner spacing" for containers and components only. The result was a pill with no breathing room whose
  // text was CLIPPED by 4px (the wrapper hugged to 27px, the text needed 31px, and the wrapper clips overflow).
  // Caught by the layout invariants the first time the badge was tested through the real insertion path.
  return createContainer("row", { preset: "badge", width: "auto", align: "center", justify: "center", gap: 0, wrap: false,
    paddingTop: 6, paddingBottom: 6, paddingLeft: 12, paddingRight: 12, radius: 999, borderWidth: 0,
    background: "var(--eu-color-primary-50)", children: [
      createElement("text", { text: "New", fontSize: 12, bold: true, width: "auto", textAlign: "center", color: "var(--eu-color-brand)" }),
    ] });
}

function makeRating(): BoxNode {
  const star = (on: boolean) => createElement("icon", { icon: "Star", fontSize: 24, color: on ? "var(--eu-color-warning)" : "var(--eu-color-neutral-300)" });
  return createContainer("row", { preset: "rating", width: "auto", padding: 4, gap: 4, align: "center", justify: "start", wrap: false, children: [star(true), star(true), star(true), star(true), star(false)] });
}

// ── the designs each tree component offers ────────────────────────────────────────────────────────

/**
 * Every card design sets EVERY property any other card design touches — including the media size, which only
 * "Side by side" cares about. Leaving a property out does not mean "unchanged", it means "whatever the previous
 * design left behind": switching Side by side → Raised kept the image at 40% and produced a card that matches
 * no design in the gallery. Guarded by the independence test (applying A then B must equal applying B alone).
 */
const cardLook = (patch: Partial<BoxNode>, media: Partial<BoxNode>): ((n: BoxNode) => BoxNode) => (n) =>
  kidsOfType({ ...n, direction: "column", align: "stretch", gap: 12, ...patch }, "image", media);

const STACKED_MEDIA: Partial<BoxNode> = { width: "100%", height: "160px" };

const CARD_VARIANTS: PresetVariant[] = [
  { id: "", label: "Default", apply: cardLook({ background: "var(--eu-color-surface)", borderWidth: 1, borderColor: "var(--eu-color-border)", shadow: "md", radius: 16, padding: 24 }, STACKED_MEDIA) },
  { id: "raised", label: "Raised", apply: cardLook({ background: "var(--eu-color-surface)", borderWidth: 0, borderColor: undefined, shadow: "xl", radius: 20, padding: 24 }, STACKED_MEDIA) },
  { id: "flat", label: "Flat", apply: cardLook({ background: "var(--eu-color-surface)", borderWidth: 1, borderColor: "var(--eu-color-border)", shadow: undefined, radius: 12, padding: 20 }, STACKED_MEDIA) },
  { id: "tinted", label: "Tinted", apply: cardLook({ background: "var(--eu-color-primary-50)", borderWidth: 0, borderColor: undefined, shadow: "sm", radius: 16, padding: 24 }, STACKED_MEDIA) },
  { id: "horizontal", label: "Side by side", apply: (n) =>
      kidsOfType({ ...n, direction: "row", align: "center", gap: 16, background: "var(--eu-color-surface)", borderWidth: 1, borderColor: "var(--eu-color-border)", shadow: "sm", radius: 16, padding: 16 }, "image", { width: "40%", height: "120px" }) },
];

/** The quote's own look, plus the size of its FIRST text — the only thing "Large" changes. */
const quoteLook = (patch: Partial<BoxNode>, quoteSize: number): ((n: BoxNode) => BoxNode) => (n) =>
  mapType({ ...n, paddingLeft: 24, ...patch }, "text", (c, i) => (i === 0 ? { ...c, fontSize: quoteSize } : c));

const QUOTE_VARIANTS: PresetVariant[] = [
  { id: "", label: "Plain", apply: quoteLook({ background: undefined, borderWidth: 0, borderColor: undefined, shadow: undefined, radius: 0, padding: 20 }, 22) },
  { id: "boxed", label: "Boxed", apply: quoteLook({ background: "var(--eu-color-surface)", borderWidth: 1, borderColor: "var(--eu-color-border)", shadow: "sm", radius: 16, padding: 24 }, 22) },
  { id: "tinted", label: "Tinted", apply: quoteLook({ background: "var(--eu-color-primary-50)", borderWidth: 0, borderColor: undefined, shadow: undefined, radius: 16, padding: 24 }, 22) },
  { id: "large", label: "Large", apply: quoteLook({ background: undefined, borderWidth: 0, borderColor: undefined, shadow: undefined, radius: 0, padding: 24 }, 30) },
];

/** A stat's look plus how its number and label align — every design states both. */
const statLook = (patch: Partial<BoxNode>, textAlign: "left" | "center"): ((n: BoxNode) => BoxNode) => (n) => {
  const aligned = kidsOfType(kidsOfType({ ...n, align: textAlign === "center" ? "center" : "start", ...patch }, "heading", { textAlign }), "text", { textAlign });
  return aligned;
};

const STAT_VARIANTS: PresetVariant[] = [
  { id: "", label: "Centred", apply: statLook({ background: undefined, borderWidth: 0, borderColor: undefined, shadow: undefined, radius: 0, padding: 16 }, "center") },
  { id: "left", label: "Left", apply: statLook({ background: undefined, borderWidth: 0, borderColor: undefined, shadow: undefined, radius: 0, padding: 16 }, "left") },
  { id: "tinted", label: "Tinted", apply: statLook({ background: "var(--eu-color-primary-50)", borderWidth: 0, borderColor: undefined, shadow: undefined, radius: 16, padding: 24 }, "center") },
  { id: "boxed", label: "Boxed", apply: statLook({ background: "var(--eu-color-surface)", borderWidth: 1, borderColor: "var(--eu-color-border)", shadow: "sm", radius: 16, padding: 24 }, "center") },
];

/** The pill's fill lives on the container; its ink lives on the text child. */
const badgeLook = (background: string | undefined, ink: string, border = 0): ((n: BoxNode) => BoxNode) => (n) =>
  kidsOfType({ ...n, background, borderWidth: border, borderColor: border ? ink : undefined }, "text", { color: ink });

const BADGE_VARIANTS: PresetVariant[] = [
  { id: "", label: "Soft", apply: badgeLook("var(--eu-color-primary-50)", "var(--eu-color-brand)") },
  { id: "solid", label: "Solid", apply: badgeLook("var(--eu-color-brand)", "var(--eu-color-on-brand)") },
  { id: "outline", label: "Outline", apply: badgeLook(undefined, "var(--eu-color-brand)", 1) },
  { id: "neutral", label: "Neutral", apply: badgeLook("var(--eu-color-neutral-100)", "var(--eu-color-text)") },
];

/** Rating designs recolour the stars while preserving WHICH ones are filled (that is content, not style). */
const ratingRecolour = (on: string, off: string, size?: number): ((n: BoxNode) => BoxNode) => (n) =>
  mapType(n, "icon", (c) => {
    const wasOn = c.color !== "var(--eu-color-neutral-300)" && c.color !== "var(--eu-color-neutral-200)";
    return { ...c, color: wasOn ? on : off, ...(size ? { fontSize: size } : {}) };
  });

const RATING_VARIANTS: PresetVariant[] = [
  { id: "", label: "Gold", apply: ratingRecolour("var(--eu-color-warning)", "var(--eu-color-neutral-300)", 24) },
  { id: "brand", label: "Brand", apply: ratingRecolour("var(--eu-color-brand)", "var(--eu-color-neutral-300)", 24) },
  { id: "muted", label: "Muted", apply: ratingRecolour("var(--eu-color-muted)", "var(--eu-color-neutral-200)", 24) },
  { id: "large", label: "Large", apply: ratingRecolour("var(--eu-color-warning)", "var(--eu-color-neutral-300)", 36) },
];

// ── the catalogue ─────────────────────────────────────────────────────────────────────────────────

/** A handful of real starting points for the accordion — not all 54 designs. */
const ACCORDION_CHOICES: AddChoice[] = [
  { id: "qa", label: "Q & A", patch: { variant: "--qa" } },
  { id: "panel", label: "Solid panel", patch: { variant: "--panel" } },
  { id: "split", label: "Split (media)", patch: { variant: "--split" } },
  { id: "timeline", label: "Timeline", patch: { variant: "--timeline" } },
  { id: "enclosed", label: "Enclosed card", patch: { variant: "--enclosed" } },
];

/** The Alert's starting points are the JOBS it does, not every combination of its knobs. */
const ALERT_CHOICES: AddChoice[] = [
  { id: "info", label: "Information", patch: { alertSeverity: "info", alertForm: "inline" } },
  { id: "success", label: "Success", patch: { alertSeverity: "success", alertForm: "inline" } },
  { id: "warning", label: "Warning", patch: { alertSeverity: "warning", alertForm: "inline" } },
  { id: "error", label: "Error", patch: { alertSeverity: "danger", alertForm: "inline" } },
  { id: "banner", label: "Announcement bar", patch: { alertSeverity: "brand", alertForm: "banner", width: "fill" } },
  { id: "callout", label: "Docs callout", patch: { alertSeverity: "neutral", alertForm: "callout" } },
];

export const COMPONENT_CATALOGUE: CatalogueEntry[] = [
  { name: "accordion", label: "Accordion", icon: "PanelTopOpen", hint: "Expandable Q&A / FAQ — 54 designs", build: () => createComponent("accordion"), choices: ACCORDION_CHOICES },
  { name: "alert", label: "Alert", icon: "BellRing", hint: "Message / notice — 6 severities, dismissible", build: () => createComponent("alert"), choices: ALERT_CHOICES },
  { name: "card", label: "Card", icon: "LayoutGrid", hint: "Image + title + text + button", build: makeCard, variants: CARD_VARIANTS },
  { name: "quote", label: "Quote", icon: "MessageSquareQuote", hint: "A testimonial quote", build: makeQuote, variants: QUOTE_VARIANTS },
  { name: "stat", label: "Stat", icon: "Hash", hint: "A big number + label", build: makeStat, variants: STAT_VARIANTS },
  { name: "badge", label: "Badge", icon: "BadgeCheck", hint: "A small pill label", build: makeBadge, variants: BADGE_VARIANTS },
  { name: "rating", label: "Rating", icon: "Star", hint: "Five stars", build: makeRating, variants: RATING_VARIANTS },
];

/**
 * EVERY component a user can add — derived, never re-typed, so "this applies to all components and future ones"
 * is a fact the code enforces rather than a promise someone has to remember.
 */
export const ALL_COMPONENTS: string[] = COMPONENT_CATALOGUE.map((e) => e.name);

/**
 * What the palette asks when this component is added. A tree component derives its options from its design
 * gallery, so a future component gets ask-on-add by declaring designs — nothing extra to wire.
 *
 * The empty-id (default) design is left out on purpose: the palette menu already offers "Default", and two
 * entries both labelled Default is a worse menu, not a more complete one.
 */
export function addChoices(name?: string): AddChoice[] {
  const entry = catalogueEntry(name);
  if (!entry) return [];
  if (entry.choices) return entry.choices;
  return (entry.variants ?? []).filter((v) => v.id !== "").map((v) => ({ id: v.id, label: v.label, patch: { variant: v.id } }));
}

export function catalogueEntry(name?: string): CatalogueEntry | undefined {
  return name ? COMPONENT_CATALOGUE.find((e) => e.name === name) : undefined;
}

/** Build a component by name, or null if the name is not in the catalogue. */
export function buildCatalogueComponent(name: string): BoxNode | null {
  const entry = catalogueEntry(name);
  return entry ? entry.build() : null;
}

/** The designs a TREE component offers (empty for `component` nodes, which use COMPONENT_REGISTRY). */
export function presetVariants(preset?: string): PresetVariant[] {
  return catalogueEntry(preset)?.variants ?? [];
}

/**
 * Apply a design from a tree component's gallery. Returns the node unchanged when the preset or variant is
 * unknown, so an older saved document can never be mangled by a design that no longer exists.
 */
export function applyPresetVariant(node: BoxNode, variantId: string): BoxNode {
  const variant = presetVariants(node.preset).find((v) => v.id === variantId);
  return variant ? { ...variant.apply(node), variant: variantId } : node;
}
