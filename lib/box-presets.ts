/**
 * Block VARIATIONS (presets) + the factory that builds a fresh block for a palette kind. A preset is a
 * plain patch applied to a node (via the inspector "Styles" gallery or the palette add-time picker), so
 * users pick a look — Filled/Outline button, Display/Eyebrow heading, 2/3/4 columns, Dashed divider, a
 * Card container — without touching individual properties. Pure + theme-aware.
 */

import { type BoxNode, type BoxType, createContainer, createGrid, createElement } from "@/lib/box-model";
import { buildCatalogueComponent, addChoices, applyPresetVariant } from "@/lib/component-catalogue";
import type { SiteTheme } from "@/lib/site-storage";

export type Preset = { id: string; label: string; patch: Partial<BoxNode> };

const T = "#00000000"; // transparent

/** Which preset family a selected node uses (grid vs plain container vs the element type). */
export function presetKindFor(node: BoxNode): string {
  if (node.type === "container") return node.layout === "grid" ? "grid" : "container";
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
    case "grid": return [
      { id: "c2", label: "2 columns", patch: { columns: 2 } },
      { id: "c3", label: "3 columns", patch: { columns: 3 } },
      { id: "c4", label: "4 columns", patch: { columns: 4 } },
    ];
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

/** Build a fresh block for a palette kind — the ONE insertion path the product uses (palette click and drag).
 *  Components come from the catalogue; everything else is a primitive element / container. */
export function blockForKind(kind: string, patch: Partial<BoxNode> = {}): BoxNode {
  const base =
    buildCatalogueComponent(kind) ??
    (kind === "row" ? createContainer("row")
    : kind === "grid" ? createGrid(3)
    : kind === "container" ? createContainer("column", { width: "100%", padding: 24, gap: 0, align: "stretch" })
    : createElement(kind as Exclude<BoxType, "container">));
  const node = Object.assign(base, patch);
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
  const fromCatalogue = addChoices(kind);
  return fromCatalogue.length ? fromCatalogue : getPresets(kind, theme);
}
