/**
 * Block VARIATIONS (presets) + the factory that builds a fresh block for a palette kind. A preset is a
 * plain patch applied to a node (via the inspector "Styles" gallery or the palette add-time picker), so
 * users pick a look — Filled/Outline button, Display/Eyebrow heading, 2/3/4 columns, Dashed divider, a
 * Card container — without touching individual properties. Pure + theme-aware.
 */

import { type BoxNode, type BoxType, createContainer, createGrid, createElement, createComponent } from "@/lib/box-model";
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

// ── Design-system components as EDITABLE TREES (Card, Quote, Stat, Badge, Rating) ──
// Each is a ready-made tree whose EVERY inner piece is a real, individually-selectable, fully-editable BoxNode
// (click a card's heading → the full heading inspector; a badge's text → the full text inspector; …). The
// component's OWN container is the box (no extra wrapper). EVERY colour is a design token (var(--eu-color-*))
// so they re-theme with the site + pass WCAG. The Accordion stays a `component` (its items edit inline).
function makeCard(): BoxNode {
  return createContainer("column", { width: "100%", padding: 24, gap: 12, radius: 16, shadow: "md", borderWidth: 1, borderColor: "var(--eu-color-border)", background: "var(--eu-color-surface)", align: "stretch", children: [
    createElement("image", { width: "100%", height: "160px", radius: 12 }),
    createElement("heading", { text: "Card title", fontSize: 22, bold: true, width: "100%", color: "var(--eu-color-text)" }),
    createElement("text", { text: "A short description for this card goes right here.", width: "100%", color: "var(--eu-color-muted)" }),
    createElement("button", { text: "Learn more", background: "var(--eu-color-brand)", color: "var(--eu-color-on-brand)" }),
  ] });
}
function makeQuote(): BoxNode {
  return createContainer("column", { width: "100%", padding: 20, paddingLeft: 24, gap: 8, borderWidth: 0, align: "start", children: [
    createElement("text", { text: "“This changed everything for us — we couldn't be happier.”", fontSize: 22, italic: true, width: "100%", color: "var(--eu-color-text)" }),
    createElement("text", { text: "— Happy Customer", fontSize: 14, width: "100%", color: "var(--eu-color-muted)" }),
  ] });
}
function makeStat(): BoxNode {
  return createContainer("column", { width: "auto", padding: 16, gap: 4, align: "center", children: [
    createElement("heading", { text: "1,000+", fontSize: 44, bold: true, textAlign: "center", color: "var(--eu-color-brand)" }),
    createElement("text", { text: "Happy customers", textAlign: "center", color: "var(--eu-color-muted)" }),
  ] });
}
function makeBadge(): BoxNode {
  // A single editable text element styled as a pill — click it and change everything (text, colour, size, radius…).
  return createElement("text", { text: "New", fontSize: 12, bold: true, width: "auto", textAlign: "center", color: "var(--eu-color-brand)", background: "var(--eu-color-primary-50)", radius: 999, paddingTop: 6, paddingBottom: 6, paddingLeft: 12, paddingRight: 12 });
}
function makeRating(): BoxNode {
  const star = (on: boolean) => createElement("icon", { icon: "Star", fontSize: 24, color: on ? "var(--eu-color-warning)" : "var(--eu-color-neutral-300)" });
  return createContainer("row", { width: "auto", padding: 4, gap: 4, align: "center", justify: "start", wrap: false, children: [star(true), star(true), star(true), star(true), star(false)] });
}
const COMPOSITES: Record<string, () => BoxNode> = { card: makeCard, quote: makeQuote, stat: makeStat, badge: makeBadge, rating: makeRating };

/** Build a fresh block for a palette kind. Card/Quote/Stat/Badge/Rating are EDITABLE TREES; the accordion is a
 *  `component` (inline-editable items); everything else is a primitive element / container. */
export function blockForKind(kind: string, patch: Partial<BoxNode> = {}): BoxNode {
  const base =
    COMPOSITES[kind] ? COMPOSITES[kind]()
    : kind === "accordion" ? createComponent(kind)
    : kind === "row" ? createContainer("row")
    : kind === "grid" ? createGrid(3)
    : kind === "container" ? createContainer("column", { width: "100%", padding: 24, gap: 0, align: "stretch" })
    : createElement(kind as Exclude<BoxType, "container">);
  return Object.assign(base, patch);
}
