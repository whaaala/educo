/**
 * Block VARIATIONS (presets) + the factory that builds a fresh block for a palette kind. A preset is a
 * plain patch applied to a node (via the inspector "Styles" gallery or the palette add-time picker), so
 * users pick a look — Filled/Outline button, Display/Eyebrow heading, 2/3/4 columns, Dashed divider, a
 * Card container — without touching individual properties. Pure + theme-aware.
 */

import { type BoxNode, type BoxType, createContainer, createGrid, createElement, cloneBox, GRID_MAX } from "@/lib/box-model";
import { buildCatalogueComponent, addChoices, applyPresetVariant } from "@/lib/component-catalogue";
import type { SiteTheme } from "@/lib/site-storage";

export type Preset = { id: string; label: string; patch: Partial<BoxNode> };

const T = "#00000000"; // transparent

/** Which preset family a selected node uses (grid vs plain container vs the element type). */
export function presetKindFor(node: BoxNode): string {
  // A grid takes the CONTAINER looks. "Styles" means how a block looks everywhere else in the panel, and a
  // grid's shape is not a look — it has a dedicated Columns control that re-cuts the row without moving its
  // blocks. The old grid presets set `columns` straight, so picking one from the Styles gallery would have
  // left every span pointing at tracks that no longer existed.
  if (node.type === "container") return "container";
  return node.type;
}

/** The style variations offered for a block kind (theme-aware where colours are involved). */
export function getPresets(kind: string, theme: SiteTheme): Preset[] {
  switch (kind) {
    case "button": return [
      { id: "filled", label: "Filled", patch: { background: theme.primary, color: "#ffffff", borderWidth: 0, radius: 999 } },
      { id: "outline", label: "Outline", patch: { background: T, color: theme.primary, borderWidth: 2, borderColor: theme.primary, radius: 999 } },
      { id: "ghost", label: "Ghost", patch: { background: T, color: theme.primary, borderWidth: 0, radius: 999 } },
      { id: "square", label: "Square", patch: { background: theme.primary, color: "#ffffff", radius: 8, borderWidth: 0 } },
      { id: "soft", label: "Soft", patch: { background: theme.primary, color: "#ffffff", radius: 999, shadow: "md" } },
      { id: "large", label: "Large", patch: { fontSize: 18 } },
      { id: "small", label: "Small", patch: { fontSize: 12 } },
    ];
    case "heading": return [
      { id: "display", label: "Display", patch: { fontSize: 52, bold: true, lineHeight: 1.05 } },
      { id: "title", label: "Title", patch: { fontSize: 36, bold: true, lineHeight: 1.1 } },
      { id: "subtitle", label: "Subtitle", patch: { fontSize: 24, bold: true } },
      { id: "eyebrow", label: "Eyebrow", patch: { fontSize: 13, bold: true, textTransform: "uppercase", letterSpacing: 1.5, color: theme.primary } },
    ];
    case "text": return [
      { id: "body", label: "Body", patch: { fontSize: 16, italic: false, textTransform: "none" } },
      { id: "lead", label: "Lead", patch: { fontSize: 20, lineHeight: 1.6 } },
      { id: "caption", label: "Caption", patch: { fontSize: 12, color: theme.textMuted } },
      { id: "quote", label: "Quote", patch: { fontSize: 20, italic: true, borderWidth: 3, borderColor: theme.primary, borderStyle: "solid", paddingLeft: 16 } },
    ];
    // A GRID has no style presets of its own: its SHAPE is the Arrange panel's Columns control (which re-cuts
    // the row without moving anything), its COMBINATION is picked when it is added (see GRID_LAYOUTS), and its
    // LOOK is the container looks — which `presetKindFor` now sends it to. Two controls that both set
    // `columns`, one of them without carrying the spans across, is precisely how this area drifts.
    case "grid": return [];
    case "divider": return [
      { id: "solid", label: "Solid", patch: { borderStyle: "solid", borderWidth: 2 } },
      { id: "dashed", label: "Dashed", patch: { borderStyle: "dashed", borderWidth: 2 } },
      { id: "dotted", label: "Dotted", patch: { borderStyle: "dotted", borderWidth: 3 } },
      { id: "thick", label: "Thick", patch: { borderStyle: "solid", borderWidth: 6 } },
    ];
    case "image": return [
      { id: "square", label: "Square", patch: { radius: 0 } },
      { id: "rounded", label: "Rounded", patch: { radius: 16 } },
      { id: "circle", label: "Circle", patch: { radius: 999, width: "160px", height: "160px" } },
      { id: "shadow", label: "Shadow", patch: { radius: 12, shadow: "lg" } },
    ];
    case "video": return [
      { id: "wide", label: "16:9", patch: { height: "315px" } },
      { id: "tall", label: "Portrait", patch: { height: "480px" } },
      { id: "rounded", label: "Rounded", patch: { radius: 16 } },
    ];
    case "icon": return [
      { id: "sm", label: "Small", patch: { fontSize: 24 } },
      { id: "md", label: "Medium", patch: { fontSize: 40 } },
      { id: "lg", label: "Large", patch: { fontSize: 64 } },
      { id: "accent", label: "Accent", patch: { color: theme.primary } },
    ];
    case "container": return [
      { id: "plain", label: "Plain", patch: { background: undefined, borderWidth: 0, shadow: undefined, radius: 0 } },
      { id: "card", label: "Card", patch: { background: theme.surface, radius: 16, shadow: "md", borderWidth: 1, borderColor: "#0000000f", padding: 24 } },
      { id: "outline", label: "Outline", patch: { background: T, borderWidth: 1, borderColor: "#00000018", radius: 12, padding: 24 } },
      { id: "tinted", label: "Tinted", patch: { background: theme.surface, radius: 16, borderWidth: 0, padding: 32 } },
    ];
    default: return [];
  }
}

// Design-system components (Card/Quote/Stat/Badge/Rating) and the bespoke ones (Accordion/Alert) are ALL
// built by the COMPONENT CATALOGUE now — one entry per component, listing it in the palette, building it here
// and feeding both invariant harnesses. See lib/component-catalogue.ts for why the two construction strategies
// (editable tree vs `component` node) both exist and are both correct.

/**
 * THE LAYOUT COMBINATIONS a row can be added as — the answer to "how do I get a 8/4 split?".
 *
 * Before this the palette offered "2 · 3 · 4 columns", all EQUAL, so every unequal layout — a sidebar, a
 * feature beside two cards, a wide article with a narrow rail — had to be built by adding a row and then
 * editing each block's width by hand. The most common shapes on a school site were the ones the builder made
 * hardest, which is backwards.
 *
 * Every one is stated in twelfths and every one adds to twelve, so the row is a real twelve-column grid from
 * the moment it lands and the per-block controls all read the same units. The cells are empty containers —
 * the same block the "Section" tile adds — so a user fills them exactly as they fill anything else.
 *
 * These are ADD-TIME only. Applying one to a row that already has content would replace that content, so they
 * are deliberately not in `getPresets`, which feeds the inspector's restyle gallery.
 */
export const GRID_LAYOUTS: { id: string; label: string; spans: number[] }[] = [
  { id: "two", label: "Two equal · 6 · 6", spans: [6, 6] },
  { id: "three", label: "Three equal · 4 · 4 · 4", spans: [4, 4, 4] },
  { id: "four", label: "Four equal · 3 × 4", spans: [3, 3, 3, 3] },
  { id: "sidebar-left", label: "Sidebar left · 4 · 8", spans: [4, 8] },
  { id: "sidebar-right", label: "Sidebar right · 8 · 4", spans: [8, 4] },
  { id: "feature-two", label: "Feature + two · 6 · 3 · 3", spans: [6, 3, 3] },
  { id: "wide-narrow", label: "Wide + narrow · 7 · 5", spans: [7, 5] },
  { id: "narrow-wide", label: "Narrow + wide · 5 · 7", spans: [5, 7] },
];

/**
 * One empty cell of a layout preset.
 *
 * Full width of its column and no inset, for the same reason the grid itself has none: spacing is a decision
 * the user makes in one control, not a default they have to discover and undo. A cell that arrived with 24px
 * of padding made every nested layout narrower than the one holding it, compounding at each level.
 */
const gridCell = (colSpan: number): BoxNode =>
  createContainer("column", { width: "100%", padding: 0, gap: 0, align: "stretch", colSpan });

/**
 * The LARGEST number of equal columns the twelve can express exactly, at or below `cols`.
 *
 * Five across cannot be twelfths — 12/5 is 2.4 — so a pick of five would have to round, and a row of five
 * where two are slightly wider is worse than a row of four. The picker only offers the counts that divide,
 * so this never has to round in practice; it exists so a value arriving from anywhere else still lands on a
 * row the rest of the system can describe.
 */
export const fitColumns = (cols: number): number => {
  const n = Math.min(GRID_MAX, Math.max(1, Math.round(cols)));
  for (let c = n; c >= 1; c--) if (GRID_MAX % c === 0) return c;
  return 1;
};

/** The column counts a table picker can offer exactly: the divisors of twelve. */
export const PICKER_COLUMNS = Array.from({ length: GRID_MAX }, (_, i) => i + 1).filter((c) => GRID_MAX % c === 0);

/**
 * Build a layout the way a person inserts a TABLE: pick how many across and how many down.
 *
 * This is the front door to the whole layout system. Choosing "4 across, 3 down" gives twelve empty cells in
 * a real twelve-column grid — each one spanning three of the twelve — so the shape is picked by pointing at
 * it, and every finer control still applies afterwards: widen one cell to seven twelfths, offset another,
 * reorder them on a phone. The picker is the easy path; the twelve underneath is the ceiling.
 *
 * Rows are the CELL COUNT rather than a track definition: the grid flows into as many rows as it needs, so a
 * cell later made wider simply pushes the ones after it down, which is what a person expects from a table.
 */
export function tableGrid(cols: number, rows: number): BoxNode {
  const c = fitColumns(cols);
  const r = Math.max(1, Math.round(rows));
  const span = GRID_MAX / c;
  return createGrid(GRID_MAX, { children: Array.from({ length: c * r }, () => gridCell(span)) });
}

/** One photograph, as chosen and already downscaled by `importPhoto`. */
export type GalleryPhoto = { src: string; imgW?: number; imgH?: number; alt?: string };

/**
 * A finished photo gallery — an ORDINARY GRID of ordinary cells, each holding an ordinary Image block.
 *
 * Deliberately not a component. A component's content is a flat `ComponentItem` (title, body, one `media`
 * URL) with no `BoxNode` in it, so a cell could never be a box you design — no background, no caption you
 * style, no nested layout, no per-cell anything — and the twelve-column grid would stop applying inside
 * it, switching off spans, offsets, order, per-cell resize and Row heights. What a component would have
 * bought is discoverability and a guided setup, and the palette tile buys both without the cost.
 *
 * So this function's whole job is to remove the TYPING, not the freedom: twelve photographs become twelve
 * real cells in one step instead of twelve drags and twelve file dialogs, and every control that works on
 * a grid still works on the result.
 */
export function photoGallery(photos: GalleryPhoto[], opts: { across: number; stagger?: boolean; gap?: number } = { across: 3 }): BoxNode {
  const across = fitColumns(Math.max(1, Math.round(opts.across)));
  const span = GRID_MAX / across;
  const cells = photos.map((p) => {
    const cell = gridCell(span);
    cell.children = [createElement("image", {
      src: p.src, imgW: p.imgW, imgH: p.imgH,
      // Alt text is the visitor-facing half of a gallery and the one people forget. Carried through when
      // the importer could derive it (the file name), empty when it could not — never a fabricated caption.
      alt: p.alt ?? "",
      width: "100%",
      // "Show the whole picture" — a gallery's photographs keep their own proportions rather than being
      // cropped to a common height. With Row heights on Even they still line up; with Follow the picture
      // they stagger. Either way nothing is cut off without the user choosing it.
      height: "auto",
    })];
    return cell;
  });
  return createGrid(GRID_MAX, {
    children: cells,
    // Spacing is a decision, never a default (the standing rule) — so this is whatever the setup showed
    // the user, and the setup starts at zero. It is passed through rather than invented here.
    gap: Math.max(0, Math.round(opts.gap ?? 0)),
    padding: 0,
    ...(opts.stagger ? { rowFlow: "masonry" as const } : {}),
  });
}

/** The layout combinations as add-time presets. Built fresh each call so two adds never share an id. */
const gridLayoutChoices = (): Preset[] =>
  GRID_LAYOUTS.map((l) => ({ id: l.id, label: l.label, patch: { columns: GRID_MAX, children: l.spans.map(gridCell) } }));

/** One named uneven split as a patch, fresh cells each call. Null for an id that no longer exists. */
export function gridLayoutPatch(id: string): Partial<BoxNode> | null {
  const l = GRID_LAYOUTS.find((g) => g.id === id);
  return l ? { columns: GRID_MAX, children: l.spans.map(gridCell) } : null;
}

/** Build a fresh block for a palette kind — the ONE insertion path the product uses (palette click and drag).
 *  Components come from the catalogue; everything else is a primitive element / container. */
export function blockForKind(kind: string, patch: Partial<BoxNode> = {}): BoxNode {
  const base =
    buildCatalogueComponent(kind) ??
    (kind === "row" ? createContainer("row")
    // A grid arrives WITH A CELL, and with exactly ONE. Two things are wrong with any other default:
    // `createGrid(3)` on its own is three columns and nothing in them — an empty shell with no cell to click,
    // nothing to resize and nowhere to put anything; and starting at two cells SPLITS the section into a
    // shape nobody asked for. One full-width cell divides nothing and is still a real cell.
    // Both palette routes now ask instead of assuming (see GridLayoutMenu), so this is the answer only for a
    // path that adds a grid without a shape — and the honest answer there is "undivided".
    : kind === "grid" ? tableGrid(1, 1)
    // A gallery with no photographs yet — the setup popup always replaces this wholesale. It exists so a
    // path that somehow adds one without asking still gets a real, empty grid rather than nothing.
    : kind === "gallery" ? photoGallery([], { across: 3 })
    // A Section starts flush too — space is added on the side you want it, not removed from a default. The
    // Card and Outline STYLE presets still carry their own padding, because there it is part of the look
    // somebody chose rather than something they have to discover and undo.
    : kind === "container" ? createContainer("column", { width: "100%", padding: 0, gap: 0, align: "stretch" })
    : createElement(kind as Exclude<BoxType, "container">));
  const node = Object.assign(base, patch);
  // Children that arrived in a PATCH are re-idded. A preset object is built once per render and can be
  // clicked twice, so without this the second "Sidebar left" would carry the same cell ids as the first and
  // the tree would hold duplicates — every lookup by id then finds whichever comes first.
  if (patch.children) node.children = patch.children.map(cloneBox);
  // A design picked at add time has to be APPLIED, not just recorded: for a tree component the variant id is
  // only a label until `applyPresetVariant` restyles the tree. (For `component` nodes the id IS the CSS class
  // suffix, and applyPresetVariant leaves a node without a `preset` untouched, so this is safe for both.)
  return node.variant ? applyPresetVariant(node, node.variant) : node;
}

/**
 * What the palette offers when adding a block — ASK-ON-ADD (Rule F).
 *
 * Components answer from the catalogue, so every component we have and every future one gets this for free;
 * primitives keep their existing style presets. Before this, `getPresets` returned [] for every component, so
 * the one kind of block with the most looks to choose from was the only kind that never asked.
 */
export function getAddChoices(kind: string, theme: SiteTheme): Preset[] {
  // A ROW is the one kind whose add-time choice is a LAYOUT rather than a look — see GRID_LAYOUTS.
  if (kind === "grid") return gridLayoutChoices();
  const fromCatalogue = addChoices(kind);
  return fromCatalogue.length ? fromCatalogue : getPresets(kind, theme);
}
