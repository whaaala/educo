/**
 * Unified box model for the website builder (Framer/Webflow/Wix-style).
 *
 * Everything on the page is a **BoxNode** in a tree:
 *  - a **container** lays out its children with flexbox (row/column, gap, align, justify, wrap)
 *  - an **element** is a leaf (text, heading, button, image).
 *
 * Because layout is pure flow (flex), boxes can NEVER overlap and reflow responsively by design —
 * the two rules the product cares about. All tree operations here are pure/immutable so they are
 * trivially testable and safe to use with React state + undo.
 */

import type { CSSProperties } from "react";
import { isRegistryComponent, defaultComponentFields, defaultComponentWidth, componentIsColumn } from "@/lib/educo-ui/registry";

export type BoxType = "container" | "text" | "heading" | "button" | "image" | "video" | "icon" | "divider" | "list" | "embed" | "spacer" | "component";

/** One row of an accordion component (title + body, plus optional media thumbnail / right-aligned meta). */
export interface AccordionItem {
  id: string;
  title: string;
  body: string;
  meta?: string;    // right-aligned price / count / badge
  media?: string;   // leading thumbnail (URL / data URL)
  open?: boolean;   // open by default
}

export type FlexDir = "row" | "column";
export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexJustify = "start" | "center" | "end" | "between" | "around";

/** Responsive breakpoints. "base" = desktop (the default the tree stores); tablet + mobile hold OVERRIDES
 *  that cascade down (mobile inherits tablet inherits base). */
export type Breakpoint = "base" | "tablet" | "mobile";
/** A per-breakpoint style/geometry override — a shallow patch of style props (never structure/children). */
export type ResponsiveOverride = Partial<Omit<BoxNode, "id" | "type" | "children" | "responsive">>;

export interface BoxNode {
  id: string;
  type: BoxType;

  // ── container layout (ignored on elements) ──
  layout?: "flex" | "grid"; // layout engine for children (default flex)
  direction?: FlexDir;      // flex-direction (default column) — flex only
  gap?: number;             // px between children (both engines)
  align?: FlexAlign;        // align-items (cross axis)
  alignSelf?: "flex-start" | "flex-end" | "center" | "stretch"; // this box's OWN cross-axis alignment (overrides parent align) — set by edge-anchored resize to pin the far edge
  justify?: FlexJustify;    // justify-content (main axis) — flex only
  wrap?: boolean;           // flex-wrap — flex only
  columns?: number;         // grid: number of equal columns
  padding?: number;         // px inner padding (all sides)
  paddingTop?: number; paddingRight?: number; paddingBottom?: number; paddingLeft?: number; // per-side overrides
  margin?: number;          // px outer margin (all sides)
  marginTop?: number; marginRight?: number; marginBottom?: number; marginLeft?: number;     // per-side overrides
  radius?: number;          // px corner radius (all corners)
  radiusTopLeft?: number; radiusTopRight?: number; radiusBottomRight?: number; radiusBottomLeft?: number; // per-corner overrides
  opacity?: number;         // 0–100 (%), default 100 (fully opaque)
  rotate?: number;          // rotation in degrees (visual only; doesn't affect flow)
  // ── border + shadow ──
  borderWidth?: number;     // px; 0/undefined = no border
  borderColor?: string;     // hex/gradient token (solid colour used for the border)
  borderStyle?: "solid" | "dashed" | "dotted";
  shadow?: "sm" | "md" | "lg" | "xl"; // preset drop shadow (undefined = none)
  // ── background (layered: base fill → image → overlay, content renders on top) ──
  background?: string;      // base fill: colour hex or "gradient:#a:#b"
  bgImage?: string;         // background image (data URL)
  bgSize?: "cover" | "contain"; // background-size for the image (default cover)
  bgOverlay?: string;       // overlay drawn over the image (colour hex or gradient) for readability

  // ── sizing (any node) ──
  width?: string;           // "auto" | "fill" | "<n>%" | "<n>px" — flex child
  height?: string;          // "auto" | "fill" | "<n>px"
  minHeight?: number;       // px
  colSpan?: number;         // grid child: columns to span
  rowSpan?: number;         // grid child: rows to span
  clip?: boolean;           // allow sizing SMALLER than content (min:0) and hide overflow; default off = hug content
  baseFont?: number;        // page root only: the global base unit in px (default 10); rendered as rem so it scales with the browser font size (WCAG)
  rowBand?: boolean;        // structural ROW band: a direct child of the page root that lays its sections out side-by-side (the page is a vertical stack of these)

  // ── free / floating position (escape the flow: lift a section onto its OWN layer to OVERLAP others) ──
  position?: "flow" | "absolute"; // default "flow" (in the row-band stack); "absolute" = free-floating layer
  left?: number;            // absolute only: X offset as % of the positioning parent's content box (responsive)
  top?: number;             // absolute only: Y offset as % of the positioning parent's content box
  zIndex?: number;          // absolute only: stacking order among floating siblings (higher = on top)
  locked?: boolean;         // EDITOR-ONLY: freeze position + size (no drag / no resize / no nudge). Still selectable + content-editable. No effect on the exported site.
  group?: boolean;          // this container is a GROUP (created via "Group") — moves/locks as one unit; ungroup dissolves it.
  contentX?: "start" | "center" | "end"; // component only: horizontal position of the content inside the component
  contentY?: "start" | "center" | "end"; // component only: vertical position of the content inside the component

  // ── responsive ──
  hidden?: boolean;         // hide this box (per breakpoint via `responsive`, or everywhere at the base)
  responsive?: { tablet?: ResponsiveOverride; mobile?: ResponsiveOverride }; // per-breakpoint style overrides

  // ── element content ──
  text?: string;
  href?: string;          // button/link target: external URL, "#anchor", or "page:<id>"
  newTab?: boolean;       // open the link in a new tab
  anchor?: string;        // a named anchor on ANY box — rendered as its id so links can scroll to it
  src?: string;           // image / video URL (data URL for uploads)
  icon?: string;          // lucide icon name (icon element)
  html?: string;          // raw HTML/iframe (embed element)
  listItems?: string[];   // list element items
  listStyle?: "bullet" | "number"; // list element marker
  color?: string;
  fontSize?: number;
  bold?: boolean;
  textAlign?: "left" | "center" | "right";
  // ── typography (text / heading / button) ──
  fontFamily?: string;      // CSS font-family stack; falls back to the theme font
  fontWeight?: number;      // 100–900; overrides the bold boolean when set
  lineHeight?: number;      // unitless multiplier (e.g. 1.5)
  letterSpacing?: number;   // px (can be negative)
  italic?: boolean;
  underline?: boolean;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";

  // ── Educo UI design-system component instance (type === "component") ──
  // A component reads its whole look from CSS tokens (--eu-color-*, --eu-radius-*, …), so a single set of
  // per-instance `tokenOverrides` re-skins ANY component — including ones not built yet — with no extra code.
  component?: string;                       // which eu-component: "accordion" | "card" | "tabs" | …
  variant?: string;                         // design variant class suffix, e.g. "--panel" ("" = default look)
  accItems?: AccordionItem[];               // accordion content (component === "accordion")
  accMultiOpen?: boolean;                   // accordion: allow more than one panel open at once
  componentFields?: Record<string, string | number>; // registry-component content (card/quote/stat/badge/rating/…)
  tokenOverrides?: Record<string, string>;  // CSS custom-property overrides, e.g. { "--eu-color-brand": "#5b5bd6" }
  advancedCss?: string;                     // raw CSS declarations applied to the instance (sanitized before export)

  // ── children (containers only) ──
  children?: BoxNode[];
}

let _seq = 0;
/** Unique-ish id. Timestamp keeps ids sortable; the counter guarantees uniqueness within a tick. */
export function newBoxId(): string {
  _seq = (_seq + 1) % 1_000_000;
  return `box-${Date.now().toString(36)}-${_seq.toString(36)}`;
}

export function isContainer(node: BoxNode): boolean {
  return node.type === "container";
}

/** Lifted out of the flow onto its own free-floating layer (can overlap siblings)? */
export function isFloating(node: BoxNode): boolean {
  return node.position === "absolute";
}

/**
 * Responsive Field Guide — "STACK on narrow": a floating box collapses back into normal flow (full-width,
 * content-height) on MOBILE, so it can never clip its content or exceed its parent on a phone. The one
 * exception is when the user has DELIBERATELY re-pinned it on mobile (set left/top/position in the mobile
 * override) — then we honour their explicit placement instead of auto-stacking.
 */
export function floatStacksOnMobile(node: BoxNode): boolean {
  if (!isFloating(node)) return false;
  const m = node.responsive?.mobile;
  const pinned = !!m && (m.left != null || m.top != null || m.position != null || m.width != null || m.height != null);
  return !pinned;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** A box with nothing inside — no children, no text, no image. It can shrink to ~1px. */
export function isEmptyBox(node: BoxNode): boolean {
  return (node.children?.length ?? 0) === 0 && !node.text && !node.src && node.type !== "component";
}

// ── Factories ───────────────────────────────────────────────────────────────

export function createContainer(direction: FlexDir = "column", overrides: Partial<BoxNode> = {}): BoxNode {
  return {
    id: newBoxId(),
    type: "container",
    layout: "flex",
    direction,
    gap: 16,
    align: "stretch",
    justify: "start",
    wrap: direction === "row",
    padding: 24,
    width: "fill",
    children: [],
    ...overrides,
  };
}

/** A grid container with `columns` equal columns. Children can span via colSpan/rowSpan. */
export function createGrid(columns = 3, overrides: Partial<BoxNode> = {}): BoxNode {
  return createContainer("row", { layout: "grid", columns, wrap: false, ...overrides });
}

export function createElement(type: Exclude<BoxType, "container">, overrides: Partial<BoxNode> = {}): BoxNode {
  const base: BoxNode = { id: newBoxId(), type, width: "auto" };
  switch (type) {
    case "heading": return { ...base, text: "New heading", fontSize: 32, bold: true, ...overrides };
    case "button": return { ...base, text: "Button", href: "#", ...overrides };
    case "image": return { ...base, src: "", width: "100%", height: "260px", ...overrides };
    case "video": return { ...base, src: "", width: "100%", height: "315px", ...overrides };
    case "icon": return { ...base, icon: "Star", fontSize: 32, ...overrides };
    case "divider": return { ...base, width: "fill", ...overrides };
    case "list": return { ...base, listStyle: "bullet", listItems: ["First item", "Second item", "Third item"], fontSize: 16, ...overrides };
    case "embed": return { ...base, width: "100%", height: "260px", html: "", ...overrides };
    case "spacer": return { ...base, width: "100%", height: "48px", ...overrides };
    default: return { ...base, type: "text", text: "New text — click to edit.", ...overrides };
  }
}

// ── Educo UI components ──────────────────────────────────────────────────────

/** Three starter rows for a fresh accordion. */
export function defaultAccordionItems(): AccordionItem[] {
  return [
    { id: newBoxId(), title: "What is your return policy?", body: "Answer — click to edit. Returns are accepted within 30 days of purchase.", open: true },
    { id: newBoxId(), title: "How long does shipping take?", body: "Answer — click to edit. Most orders arrive within 3–5 business days." },
    { id: newBoxId(), title: "Do you ship internationally?", body: "Answer — click to edit. Yes, we ship to most countries worldwide." },
  ];
}

/** Create an Educo UI component instance (type "component"). Component-specific defaults live here.
 *  Accordion keeps its bespoke item model; every other component draws its default content fields from the
 *  registry, so ADDING a future component needs no change here — just a registry entry + its CSS. */
export function createComponent(component: string, overrides: Partial<BoxNode> = {}): BoxNode {
  const base: BoxNode = { id: newBoxId(), type: "component", component, variant: "", width: "100%" };
  if (component === "accordion") return { ...base, accItems: defaultAccordionItems(), accMultiOpen: false, ...overrides };
  if (isRegistryComponent(component)) return { ...base, width: defaultComponentWidth(component), componentFields: defaultComponentFields(component), ...overrides };
  return { ...base, ...overrides };
}

/**
 * The user's TYPOGRAPHY (font family / weight / capitalisation / style / spacing — NOT size) as CSS declarations,
 * to inject as a HIGH-SPECIFICITY rule on a component's text so the inspector's controls actually override the
 * component's own built-in styling (e.g. a card title's bold heading font). Size is handled separately (the
 * component's text is `em`-based, so it scales from the wrapper's font-size). Only user-set props are emitted.
 */
export function componentTextCss(node: BoxNode): string {
  const d: string[] = [];
  if (node.fontFamily) d.push(`font-family:${node.fontFamily}`);
  if (node.fontWeight) d.push(`font-weight:${node.fontWeight}`);
  else if (node.bold) d.push(`font-weight:700`);
  if (node.textTransform && node.textTransform !== "none") d.push(`text-transform:${node.textTransform}`);
  if (node.italic) d.push(`font-style:italic`);
  if (node.letterSpacing != null) d.push(`letter-spacing:${node.letterSpacing}px`);
  if (node.lineHeight) d.push(`line-height:${node.lineHeight}`);
  return d.join(";");
}

/**
 * The user's BOX styling (border, corner radius, shadow, background, rotation) as CSS declarations, to inject
 * directly onto the component's OWN element (`.eu-<component>`) instead of a surrounding wrapper box — so the
 * inspector's Design controls style the component ITSELF (the card, the pill, the quote…), not a container
 * around it. Only user-set props are emitted (defaults keep the component's built-in look).
 */
export function componentBoxCss(node: BoxNode): string {
  const d: string[] = [];
  // SIZE: the component element FILLS its box when the box is given a definite size (Full / Custom width, or a
  // resized height) so resizing the block actually resizes the component. When width is "auto" (Fit) it keeps
  // hugging its content. box-sizing so an added border never overflows the box.
  // INNER SPACING: padding applies to the component's OWN element (with border-box so it stays INSIDE the box —
  // the component still fills the node box exactly, so the selection edges match). Per-side falls back to `padding`.
  const pt = node.paddingTop ?? node.padding, pr = node.paddingRight ?? node.padding, pb = node.paddingBottom ?? node.padding, pl = node.paddingLeft ?? node.padding;
  const hasPad = [pt, pr, pb, pl].some((v) => v != null);
  const sized = (node.width && node.width !== "auto") || node.height || node.minHeight;
  if (node.borderWidth || sized || hasPad) d.push("box-sizing:border-box");
  if (hasPad) d.push(`padding:${u(pt ?? 0)} ${u(pr ?? 0)} ${u(pb ?? 0)} ${u(pl ?? 0)}`);
  if (node.width && node.width !== "auto") d.push("width:100%");
  if (node.height) d.push("height:100%");
  if (node.minHeight) d.push("min-height:100%");
  if (node.borderWidth) d.push(`border:${node.borderWidth}px ${node.borderStyle ?? "solid"} ${node.borderColor ?? "rgba(0,0,0,0.15)"}`);
  const br = radiusCSS(node); if (br) d.push(`border-radius:${br}`);
  if (node.shadow) d.push(`box-shadow:${SHADOW_CSS[node.shadow]}`);
  if (node.background) d.push(`background:${node.background}`);
  if (node.bgImage) d.push(`background-image:url("${node.bgImage}");background-size:${node.bgSize ?? "cover"};background-position:center;background-repeat:no-repeat`);
  if (node.rotate) d.push(`transform:rotate(${node.rotate}deg)`);
  if (node.opacity !== undefined && node.opacity !== 100) d.push(`opacity:${node.opacity / 100}`);
  // CONTENT POSITION: place the content inside the component (X = horizontal, Y = vertical) regardless of whether
  // the component stacks in a column or a row — map X/Y to the right flex axis (justify vs align) per component.
  if (node.contentX || node.contentY) {
    const flex = (v?: string) => (v === "center" ? "center" : v === "end" ? "flex-end" : "flex-start");
    const col = componentIsColumn(node.component);
    if (node.contentX) d.push(`${col ? "align-items" : "justify-content"}:${flex(node.contentX)}`);
    if (node.contentY) d.push(`${col ? "justify-content" : "align-items"}:${flex(node.contentY)}`);
  }
  return d.join(";");
}

/** Immutably patch one accordion item on a component node. */
export function updateAccItem(node: BoxNode, itemId: string, patch: Partial<AccordionItem>): BoxNode {
  return { ...node, accItems: (node.accItems ?? []).map((it) => (it.id === itemId ? { ...it, ...patch } : it)) };
}
/** Append a fresh accordion item. */
export function addAccItem(node: BoxNode): BoxNode {
  const item: AccordionItem = { id: newBoxId(), title: "New question", body: "Answer — click to edit." };
  return { ...node, accItems: [...(node.accItems ?? []), item] };
}
/** Remove an accordion item (keeps at least zero; UI guards the last one). */
export function removeAccItem(node: BoxNode, itemId: string): BoxNode {
  return { ...node, accItems: (node.accItems ?? []).filter((it) => it.id !== itemId) };
}
/** Move an accordion item one step up (-1) or down (+1). */
export function moveAccItem(node: BoxNode, itemId: string, dir: -1 | 1): BoxNode {
  const items = [...(node.accItems ?? [])];
  const i = items.findIndex((it) => it.id === itemId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= items.length) return node;
  [items[i], items[j]] = [items[j], items[i]];
  return { ...node, accItems: items };
}

/**
 * Sanitize a block of raw CSS DECLARATIONS (what a user types in the Advanced-CSS box) so it is safe to inline.
 * We keep only `property: value;` pairs and hard-reject anything that could break out of the declaration
 * context or fetch remotely: braces/at-rules/selectors, `</…>`, `expression()`, `javascript:` and any `url(…)`
 * that isn't a `data:` URL. Returns a normalized "prop: val; prop: val;" string (never null).
 */
export function sanitizeCssDeclarations(raw?: string): string {
  if (!raw) return "";
  return raw
    .split(";")
    .map((decl) => decl.trim())
    .filter(Boolean)
    .filter((decl) => {
      if (/[{}<>]/.test(decl)) return false;                 // no selectors / at-rules / tag breakouts
      if (/@|expression\s*\(|javascript:|<\/?/i.test(decl)) return false;
      if (/url\s*\(/i.test(decl) && !/url\s*\(\s*['"]?data:/i.test(decl)) return false; // only data: urls
      const idx = decl.indexOf(":");
      if (idx <= 0) return false;                            // must be property: value
      const prop = decl.slice(0, idx).trim();
      return /^-{0,2}[a-zA-Z][a-zA-Z0-9-]*$/.test(prop);     // a plausible CSS property / custom property
    })
    .map((decl) => decl + ";")
    .join(" ");
}

/** Turn a YouTube/Vimeo URL into an embeddable iframe src; null for a direct video file (use <video>). */
export function videoEmbedSrc(url?: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

/** A blank page root: a single column container filling the canvas. */
export function createRoot(): BoxNode {
  return createContainer("column", { padding: 0, gap: 0, width: "fill", minHeight: 600 });
}

/** Deep-clone a subtree, assigning fresh ids to every node (for duplicate). */
export function cloneBox(node: BoxNode): BoxNode {
  return { ...node, id: newBoxId(), children: node.children?.map(cloneBox) };
}

/** Insert a duplicate of `id` right after it in its parent. Returns the new tree (+ new node id). */
export function duplicateBox(root: BoxNode, id: string): BoxNode {
  const info = findParent(root, id);
  const node = findBox(root, id);
  if (!info || !node) return root;
  return insertBox(root, info.parent.id, info.index + 1, cloneBox(node));
}

// ── Pure tree operations (immutable) ─────────────────────────────────────────

/** Depth-first search for a node by id. */
export function findBox(root: BoxNode, id: string): BoxNode | null {
  if (root.id === id) return root;
  for (const c of root.children ?? []) {
    const found = findBox(c, id);
    if (found) return found;
  }
  return null;
}

/** Locate a node's parent + index within the parent's children. Returns null for the root/missing. */
export function findParent(root: BoxNode, id: string): { parent: BoxNode; index: number } | null {
  for (const [i, c] of (root.children ?? []).entries()) {
    if (c.id === id) return { parent: root, index: i };
    const deeper = findParent(c, id);
    if (deeper) return deeper;
  }
  return null;
}

/** True if `ancestorId` is `id` or contains it (guards against dropping a node into itself). */
export function isAncestor(root: BoxNode, ancestorId: string, id: string): boolean {
  const a = findBox(root, ancestorId);
  return !!a && !!findBox(a, id);
}

/** Return a new tree with `patch` merged onto the node with `id`. */
export function updateBox(root: BoxNode, id: string, patch: Partial<BoxNode>): BoxNode {
  if (root.id === id) return { ...root, ...patch };
  if (!root.children) return root;
  return { ...root, children: root.children.map((c) => updateBox(c, id, patch)) };
}

/** Insert `node` into `parentId` at `index` (clamped). No-op if the parent is missing. */
export function insertBox(root: BoxNode, parentId: string, index: number, node: BoxNode): BoxNode {
  if (root.id === parentId) {
    const children = [...(root.children ?? [])];
    const at = Math.max(0, Math.min(index, children.length));
    children.splice(at, 0, node);
    return { ...root, children };
  }
  if (!root.children) return root;
  return { ...root, children: root.children.map((c) => insertBox(c, parentId, index, node)) };
}

/** Remove the node with `id` (cannot remove the root). */
export function removeBox(root: BoxNode, id: string): BoxNode {
  if (!root.children) return root;
  return {
    ...root,
    children: root.children.filter((c) => c.id !== id).map((c) => removeBox(c, id)),
  };
}

/** Reorder a node within its own parent by one step (dir -1 up / +1 down). */
export function moveBoxStep(root: BoxNode, id: string, dir: -1 | 1): BoxNode {
  const info = findParent(root, id);
  if (!info) return root;
  const { parent, index } = info;
  const j = index + dir;
  const kids = parent.children!;
  if (j < 0 || j >= kids.length) return root;
  const next = [...kids];
  [next[index], next[j]] = [next[j], next[index]];
  return updateBox(root, parent.id, { children: next });
}

/**
 * Move `id` to be a child of `newParentId` at `index`. Guards against dropping a node into itself
 * or a descendant (which would detach the subtree). Returns the original tree if the move is invalid.
 */
export function moveBox(root: BoxNode, id: string, newParentId: string, index: number): BoxNode {
  if (id === newParentId || isAncestor(root, id, newParentId)) return root;
  const node = findBox(root, id);
  if (!node) return root;
  const from = findParent(root, id);
  // If moving within the same parent, account for the removal shifting indices.
  let target = index;
  if (from && from.parent.id === newParentId && from.index < index) target = index - 1;
  const without = removeBox(root, id);
  return insertBox(without, newParentId, target, node);
}

/**
 * Drag-and-drop geometry: given the midpoints of a container's children along the drag axis
 * (x for a row/grid, y for a column) and the pointer position on that axis, return the slot index
 * (0..mids.length) where a dropped block should be inserted — i.e. before the first child the pointer
 * hasn't passed yet, else at the end.
 */
export function dropIndexAmong(mids: number[], pointer: number): number {
  for (let i = 0; i < mids.length; i++) if (pointer < mids[i]) return i;
  return mids.length;
}

/** A structural ROW band: a full-width horizontal container that lays its sections out side-by-side.
 *  The page is a vertical stack of these. `gap` is the spacing between sections within the row. */
export function makeRowBand(children: BoxNode[] = [], gap = 0): BoxNode {
  const r = createContainer("row", { rowBand: true, width: "fill", padding: 0, gap, wrap: false, align: "stretch", justify: "start" });
  r.children = children;
  return r;
}

/** Percentage a section's width token represents (for "how full is this row" maths). fill/auto = 100. */
export function widthPct(token?: string): number {
  if (!token || token === "fill" || token === "auto") return 100;
  const n = parseFloat(token);
  return token.endsWith("%") && !Number.isNaN(n) ? n : 100;
}

/** Scale a row band's section WIDTHS down so their shares never sum past 100% — this is how a row shrinks
 *  its sections to fit as you add more (never wrapping). Only WIDTH is scaled: the user's margins / other
 *  styling are preserved. Rows already ≤100% are returned unchanged. */
export function clampRowWidths(row: BoxNode): BoxNode {
  const kids = row.children ?? [];
  if (!kids.length) return row;
  const sum = kids.reduce((s, k) => s + widthPct(k.width), 0);
  if (sum <= 100) return row;
  const f = 100 / sum;
  return { ...row, children: kids.map((k) => ({ ...k, width: `${Math.max(3, Math.round(widthPct(k.width) * f))}%` })) };
}

/** Canonicalize a container tree RECURSIVELY: every CONTENT container (the page root, a section, a block)
 *  is a vertical STACK whose direct children are all ROW BANDS; each row band is a nowrap row of items that
 *  shrink to fit. A bare item that lands directly under a content container (e.g. dropped between rows) is
 *  wrapped in its OWN full-width row → so dragging an item down makes a NEW row. Empty rows are pruned.
 *  Widths are clamped ≤100% (shrink-to-fit). The user's MARGINS are respected (never stripped). Items keep
 *  their id. Recurses into every item so a child-of-a-child behaves exactly the same. Idempotent in shape. */
export function normalizeRowBands(node: BoxNode, gap = 0): BoxNode {
  if (!isContainer(node)) return node; // leaf — nothing to organize
  if (node.rowBand) {
    // A ROW: recurse into its items (each may itself be a content container / leaf).
    return { ...node, children: (node.children ?? []).map((c) => normalizeRowBands(c, gap)) };
  }
  if (!node.children) return node;
  // A CONTENT container: its direct children must all be row bands.
  const rows: BoxNode[] = [];
  for (const c of node.children) {
    if (isFloating(c)) { rows.push(normalizeRowBands(c, gap)); continue; } // floating: keep as a direct child, OUT of the flow (never wrapped, clamped, or pruned)
    if (c.rowBand) {
      const row = clampRowWidths(normalizeRowBands(c, gap));
      if (row.children?.length) rows.push(row); // prune empty rows
    } else {
      // Bare item → wrap in its own new row. A CONTAINER (section) fills the row; an ELEMENT/COMPONENT keeps
      // its own width so it HUGS its content (a short heading / button is exactly as wide as its content, not a
      // full-width "container" box). Width is still user-editable via Fit / Full / Custom.
      const forced = isContainer(c) ? { ...c, width: "100%" } : c;
      rows.push(makeRowBand([normalizeRowBands(forced, gap)], gap));
    }
  }
  return { ...node, children: rows };
}

/**
 * Make a container's children divide the main axis equally by setting each one's main-axis size to
 * "fill". Pass `exceptId` to leave one child at its current (e.g. just-resized) size and let the rest
 * share the remaining space — the "resize others to fill the page" action.
 */
export function fillMainAxis(root: BoxNode, parentId: string, exceptId?: string): BoxNode {
  const parent = findBox(root, parentId);
  if (!parent?.children) return root;
  const key: "width" | "height" = (parent.direction ?? "column") === "row" ? "width" : "height";
  const children = parent.children.map((c) => (c.id === exceptId ? c : { ...c, [key]: "fill" }));
  return updateBox(root, parentId, { children });
}

// ── Free / floating layers (overlap) ─────────────────────────────────────────
// A floating box is lifted OUT of the row-band flow onto its own layer, positioned absolutely inside a
// "positioning parent" (a real content container, never a structural row band) so it can sit ON TOP of
// that parent's flow content and overlap its siblings. Geometry (left/top/width/height) is measured in
// the DOM by the canvas and passed in here; these ops stay pure so they're testable + undo-safe.

/** Highest / lowest zIndex among a parent's FLOATING children (0 when there are none). */
export function floatingZRange(parent: BoxNode | null): { min: number; max: number } {
  const zs = (parent?.children ?? []).filter(isFloating).map((c) => c.zIndex ?? 1);
  return { min: zs.length ? Math.min(...zs) : 0, max: zs.length ? Math.max(...zs) : 0 };
}

/** Lift `id` onto a free-floating layer inside `targetParentId` at (left,top) % of that parent, with the
 *  given width token (% of parent) and height floor (px). It becomes a DIRECT child of the positioning
 *  parent (above its flow content), gets a zIndex over any floating siblings, and sheds its flow-only
 *  styling (alignSelf + margins). Pure. */
export function floatBox(root: BoxNode, id: string, targetParentId: string, left: number, top: number, width: string, height: number): BoxNode {
  if (id === targetParentId || isAncestor(root, id, targetParentId)) return root;
  const tp = findBox(root, targetParentId);
  const z = floatingZRange(tp).max + 1;
  let next = moveBox(root, id, targetParentId, tp?.children?.length ?? 0);
  next = updateBox(next, id, {
    // A free-floating layer is a fixed-size CARD: a DEFINITE height (not a min-height floor that content can grow
    // past) so the box, its parent's reserved height, and the export all agree on exactly how tall it is. `clip`
    // lets the width AND height handles shrink it below its content.
    position: "absolute", left: round1(left), top: round1(top), width, height: `${Math.max(8, Math.round(height))}px`, minHeight: undefined, zIndex: z,
    clip: true,
    alignSelf: undefined, margin: undefined, marginTop: undefined, marginRight: undefined, marginBottom: undefined, marginLeft: undefined,
  });
  return next;
}

/** Return `id` to the normal flow (drop its floating position); normalizeRowBands re-docks it as a row.
 *  Undoes the float's side-effects so nothing leaks back into the flow: the auto-applied `clip` is cleared, a
 *  COMPONENT returns to full width (its compact fixed px width existed only for the floating card), and — if it
 *  was the parent's LAST floating child — the parent's reserved `minHeight` is dropped so no tall empty gap remains. */
export function unfloatBox(root: BoxNode, id: string): BoxNode {
  const node = findBox(root, id);
  const info = findParent(root, id);
  // Drop everything the float set: geometry, the auto `clip`, and the card's `minHeight` (so the box hugs its
  // content again). A COMPONENT also returns to full width (its compact fixed px width was only for the card).
  const patch: Partial<BoxNode> = { position: undefined, left: undefined, top: undefined, zIndex: undefined, clip: undefined, minHeight: undefined, height: undefined };
  if (node?.type === "component") patch.width = "100%";
  let next = updateBox(root, id, patch);
  if (info) {
    const stillFloating = (findBox(next, info.parent.id)?.children ?? []).some((c) => c.id !== id && isFloating(c));
    if (!stillFloating) next = updateBox(next, info.parent.id, { minHeight: undefined });
  }
  return next;
}

/**
 * GROUP the given boxes into ONE floating container (slide-style). The selected boxes are lifted out of the
 * flow and placed IN-FLOW inside a new `group` container that floats at `geom` (a bounding box measured by the
 * canvas). The group then moves + locks as a SINGLE unit, and because its children are in normal flow inside it
 * (not absolutely pinned) the group reflows + STACKS on narrow like everything else (Responsive Field Guide).
 * Children keep document order. Pure; `ungroupBoxes` reverses it.
 */
export function groupBoxes(root: BoxNode, ids: string[], geom: { left: number; top: number; width: string; height: number }): BoxNode {
  const set = new Set(ids);
  const ordered: string[] = [];
  const collect = (n: BoxNode) => { if (set.has(n.id) && n.id !== root.id) ordered.push(n.id); (n.children ?? []).forEach(collect); };
  collect(root); // tree/document order so the group's stack matches what the user saw
  if (ordered.length < 2) return root; // need at least two boxes to form a group
  const byId = new Map(ordered.map((id) => [id, findBox(root, id)!]));
  const kids = ordered.map((id) => ({ ...byId.get(id)!, position: undefined, left: undefined, top: undefined, zIndex: undefined, width: "100%" }));
  let next = root;
  for (const id of ordered) next = removeBox(next, id); // pull each out of wherever it lives
  const z = floatingZRange(next).max + 1;
  const group = createContainer("column", {
    group: true, position: "absolute", left: geom.left, top: geom.top,
    width: geom.width, height: `${Math.max(8, Math.round(geom.height))}px`,
    zIndex: z, gap: 12, padding: 0, align: "stretch", wrap: false, children: kids,
  } as Partial<BoxNode>);
  return insertBox(next, next.id, next.children?.length ?? 0, group); // the group floats at the page root
}

/** UNGROUP: dissolve a `group` container, returning its children to the flow of the group's parent (they
 *  stack again as normal blocks). Pure. */
export function ungroupBoxes(root: BoxNode, groupId: string): BoxNode {
  const group = findBox(root, groupId);
  const info = findParent(root, groupId);
  if (!group || !info) return root;
  const kids = (group.children ?? []).map((c) => ({ ...c, position: undefined, left: undefined, top: undefined, zIndex: undefined, width: c.width ?? "100%" }));
  const children = (info.parent.children ?? []).flatMap((c) => (c.id === groupId ? kids : [c]));
  return updateBox(root, info.parent.id, { children });
}

/** Position a block within its own container (its row band / flex parent): sets the PARENT's justify-content
 *  so the child sits at the start / center / end. Because blocks now HUG their content, this is how you
 *  left / centre / right a heading, button, badge, etc. Fluid (justify-content, no fixed px) → Field-Guide-safe. */
export function alignInRow(root: BoxNode, id: string, justify: FlexJustify): BoxNode {
  const info = findParent(root, id);
  if (!info) return root;
  return updateBox(root, info.parent.id, { justify });
}

/** The block's current position within its container (its parent row's justify-content). */
export function alignInRowOf(root: BoxNode, id: string): FlexJustify {
  return findParent(root, id)?.parent.justify ?? "start";
}

/** Raise a floating box above all its floating siblings. */
export function bringToFront(root: BoxNode, id: string): BoxNode {
  const info = findParent(root, id);
  if (!info) return root;
  return updateBox(root, id, { zIndex: floatingZRange(info.parent).max + 1 });
}

/** Lower a floating box beneath all its floating siblings. */
export function sendToBack(root: BoxNode, id: string): BoxNode {
  const info = findParent(root, id);
  if (!info) return root;
  return updateBox(root, id, { zIndex: floatingZRange(info.parent).min - 1 });
}

/** Swap a floating box ONE step up/down its floating siblings' stack (presentation "bring forward" /
 *  "send backward"). Sorts the floating siblings by z, swaps the target with its neighbour, then reassigns
 *  clean sequential z (1..n) so the order never drifts. No-op at the top (forward) / bottom (backward). */
function reorderFloat(root: BoxNode, id: string, dir: 1 | -1): BoxNode {
  const info = findParent(root, id);
  if (!info) return root;
  const order = (info.parent.children ?? []).filter(isFloating).slice().sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1)).map((c) => c.id);
  const i = order.indexOf(id), j = i + dir;
  if (i < 0 || j < 0 || j >= order.length) return root;
  [order[i], order[j]] = [order[j], order[i]];
  return order.reduce((r, cid, k) => updateBox(r, cid, { zIndex: k + 1 }), root);
}

/** Raise a floating box one layer (above the next floating sibling up). */
export function bringForward(root: BoxNode, id: string): BoxNode { return reorderFloat(root, id, 1); }

/** Lower a floating box one layer (below the next floating sibling down). */
export function sendBackward(root: BoxNode, id: string): BoxNode { return reorderFloat(root, id, -1); }

// ── Responsive (per-breakpoint overrides) ────────────────────────────────────
// The tree stores BASE (desktop) values; `responsive.tablet` / `responsive.mobile` hold shallow style
// overrides that CASCADE down (mobile inherits tablet inherits base). Rendering resolves the effective
// node for the active breakpoint; editing at a breakpoint writes into that breakpoint's override so the
// base is never disturbed. Structure (children, id, type, position-mode, z) is shared across breakpoints.

/** The effective node at a breakpoint: base merged with tablet (then mobile) overrides. Children unchanged. */
export function resolveResponsive(node: BoxNode, bp: Breakpoint): BoxNode {
  if (bp === "base" || !node.responsive) return node;
  const t = node.responsive.tablet ?? {};
  const ov = bp === "mobile" ? { ...t, ...(node.responsive.mobile ?? {}) } : t;
  return Object.keys(ov).length ? { ...node, ...ov } : node;
}

/** Merge `patch` into node `id` — at the BASE, or into the given breakpoint's override when not base. */
export function updateBoxResponsive(root: BoxNode, id: string, patch: Partial<BoxNode>, bp: Breakpoint): BoxNode {
  if (bp === "base") return updateBox(root, id, patch);
  const node = findBox(root, id);
  if (!node) return root;
  const prev = node.responsive?.[bp] ?? {};
  return updateBox(root, id, { responsive: { ...node.responsive, [bp]: { ...prev, ...patch } } });
}

/** Does this box carry any override for the given breakpoint? */
export function hasOverride(node: BoxNode, bp: Breakpoint): boolean {
  return bp !== "base" && !!node.responsive?.[bp] && Object.keys(node.responsive[bp]!).length > 0;
}

/** Drop a breakpoint's overrides (revert this box to the base at that breakpoint). */
export function clearOverride(root: BoxNode, id: string, bp: Breakpoint): BoxNode {
  if (bp === "base") return root;
  const node = findBox(root, id);
  if (!node?.responsive) return root;
  const next = { ...node.responsive }; delete next[bp];
  return updateBox(root, id, { responsive: Object.keys(next).length ? next : undefined });
}

// ── Decoration (border / shadow / corners / rotation) ────────────────────────

/** Preset drop shadows (elevation scale). Kept subtle + theme-neutral (soft black). */
export const SHADOW_CSS: Record<NonNullable<BoxNode["shadow"]>, string> = {
  sm: "0 1px 2px rgba(0,0,0,0.08), 0 1px 1px rgba(0,0,0,0.06)",
  md: "0 4px 8px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)",
  lg: "0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)",
  xl: "0 24px 48px rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.10)",
};

/** Per-corner border-radius (px) → CSS, falling back to the all-corners `radius`. Undefined when none set. */
export function radiusCSS(node: BoxNode): string | undefined {
  const r = node.radius;
  const tl = node.radiusTopLeft ?? r, tr = node.radiusTopRight ?? r, br = node.radiusBottomRight ?? r, bl = node.radiusBottomLeft ?? r;
  if (tl == null && tr == null && br == null && bl == null) return undefined;
  return `${tl ?? 0}px ${tr ?? 0}px ${br ?? 0}px ${bl ?? 0}px`;
}

/** Does this box round or clip its content (so overflow must be hidden)? */
export function isClipped(node: BoxNode): boolean {
  return !!node.clip || radiusCSS(node) != null;
}

// ── Flexbox style mapping ────────────────────────────────────────────────────

const ALIGN_CSS: Record<FlexAlign, string> = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" };
const JUSTIFY_CSS: Record<FlexJustify, string> = {
  start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around",
};

/** Convert a width/height token ("auto" | "fill" | "50%" | "200px") to a CSS length or undefined. */
export function sizeToCSS(token?: string): string | undefined {
  if (!token || token === "auto") return undefined;
  if (token === "fill") return "100%";
  return token; // already "<n>%" or "<n>px"
}

/** flex behaviour for a child inside a flex parent, derived from its main-size token.
 *  An explicit size is a FIXED share (no grow/shrink) so a section keeps exactly the width you give it —
 *  you can resize it narrower to open space, and drop another section into that space. `fill` grows to
 *  take whatever is left. Dropping a section beside another sets its width to the leftover so it fits. */
export function flexForWidth(token?: string): string | undefined {
  if (token === "fill") return "1 1 0%";
  if (!token || token === "auto") return "0 0 auto";
  return `0 1 ${token}`; // fixed share, but MAY SHRINK to fit — so a row's sections can never overflow / run off the page
}

/**
 * Render a px-at-base-10 size as a browser-RELATIVE length off the page base unit (`--box-u`, ≈0.625rem
 * = 10px at the browser default). Because it's rem-based, sizes scale with the user's browser font size
 * — WCAG 1.4.4 (resize text) compliant. We never set an absolute px root font-size.
 */
export function u(px: number): string {
  return `calc(var(--box-u, 0.625rem) * ${+(px / 10).toFixed(4)})`;
}

/**
 * The page base unit as a FLUID length: `clamp(minRem, cqw, maxRem)`.
 *  - the `cqw` middle scales with the container (canvas/screen) WIDTH — so text/spacing shrink on mobile
 *    and grow on desktop automatically;
 *  - the rem min/max keep it browser-relative (respects the user's font size) and bounded — WCAG-friendly.
 * At a ~1000px container, the unit ≈ baseFontPx (default 10px); it clamps to ~0.7×/1.4× at the extremes.
 */
export function baseUnit(baseFontPx = 10): string {
  const lo = +((baseFontPx * 0.7) / 16).toFixed(4);   // rem floor (≈0.7× base)
  const hi = +((baseFontPx * 1.4) / 16).toFixed(4);   // rem ceiling (≈1.4× base)
  const cqw = +(baseFontPx / 10).toFixed(4);          // 1cqw ≈ base at a 1000px-wide container
  return `clamp(${lo}rem, ${cqw}cqw, ${hi}rem)`;
}

/** Per-side padding CSS (responsive rem): a side override falls back to the general `padding`, then 0. */
export function paddingCSS(node: BoxNode): CSSProperties {
  const p = node.padding ?? 0;
  return {
    paddingTop: u(node.paddingTop ?? p),
    paddingRight: u(node.paddingRight ?? p),
    paddingBottom: u(node.paddingBottom ?? p),
    paddingLeft: u(node.paddingLeft ?? p),
  };
}

/** Per-side margin CSS (responsive rem): a side override falls back to the general `margin` (undefined = none). */
export function marginCSS(node: BoxNode): CSSProperties {
  const m = (side?: number) => { const v = side ?? node.margin; return v === undefined ? undefined : u(v); };
  return {
    marginTop: m(node.marginTop),
    marginRight: m(node.marginRight),
    marginBottom: m(node.marginBottom),
    marginLeft: m(node.marginLeft),
  };
}

/**
 * How tall a positioning parent must be so it still CONTAINS its floating children (which are out of the flow).
 * A floating child's `top` is a % of the parent's content height and its height is its `minHeight` (a floating
 * card is `clip`ped, so minHeight IS its height). Its bottom fits when contentH ≥ h/(1 − top). We compute that
 * from the STORED values only (no measuring, no stored reserve on the parent → nothing to leak) so the parent
 * always wraps its floating children AND re-computes automatically as you drag/resize them. Padding is added
 * back so the border-box stays tall enough. Returns 0 when there are no floating children.
 */
export function floatingReserve(node: BoxNode, bp: Breakpoint = "base"): number {
  let need = 0;
  for (const c of node.children ?? []) {
    if (!isFloating(c)) continue;
    // On MOBILE a float that stacks is back in normal flow — it grows the parent itself, so it needs NO
    // reserve (reserving here would leave a tall empty gap under the now-inline card).
    if (bp === "mobile" && floatStacksOnMobile(c)) continue;
    const rc = bp === "base" ? c : resolveResponsive(c, bp); // its effective height/top at this breakpoint
    // A floating card has a DEFINITE `height` (px) — its true rendered height; fall back to minHeight for old data.
    const h = rc.height && rc.height.endsWith("px") ? parseFloat(rc.height) : (rc.minHeight ?? 0);
    const top = Math.min(Math.max(rc.top ?? 0, 0), 92); // cap so we never divide by ~0
    const n = h / (1 - top / 100);
    if (n > need) need = n;
  }
  if (need <= 0) return 0;
  const padV = (node.paddingTop ?? node.padding ?? 0) + (node.paddingBottom ?? node.padding ?? 0);
  return Math.round(need + padV);
}

/** The container's own layout CSS (flex or grid), as inline style. `bp` makes the floating reserve device-aware. */
export function containerStyle(node: BoxNode, bp: Breakpoint = "base"): CSSProperties {
  const minH = Math.max(node.minHeight ?? 0, floatingReserve(node, bp)) || undefined;
  if (node.layout === "grid") {
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${Math.max(1, node.columns ?? 3)}, minmax(0, 1fr))`,
      gap: u(node.gap ?? 16),
      alignItems: ALIGN_CSS[node.align ?? "stretch"],
      ...paddingCSS(node),
      minHeight: minH,
    };
  }
  return {
    display: "flex",
    flexDirection: node.direction ?? "column",
    gap: u(node.gap ?? 16),
    alignItems: ALIGN_CSS[node.align ?? "stretch"],
    justifyContent: JUSTIFY_CSS[node.justify ?? "start"],
    // Responsive Field Guide: a ROW BAND always allows wrapping so its sections REFLOW (stack) on narrow
    // screens instead of shrinking to unreadable slivers. On desktop they still sit side-by-side (they fit).
    flexWrap: node.wrap || node.rowBand ? "wrap" : "nowrap",
    // Pack wrapped lines to the top so they never stretch apart and leave gaps between sections.
    alignContent: "flex-start",
    ...paddingCSS(node),
    minHeight: minH,
  };
}

/**
 * A child's own sizing CSS, adapted to its PARENT's engine + direction.
 *  - grid parent: colSpan/rowSpan control the cell; height token honoured.
 *  - flex ROW parent:    main axis = width  → `width` drives flex (division); `height` is the cross size.
 *  - flex COLUMN parent: main axis = height → `height` drives flex (division); `width` is the cross size.
 * So a section with the MAIN-axis token set to "fill" divides that axis equally with its siblings.
 */
export function childStyle(child: BoxNode, parent: BoxNode): CSSProperties {
  const s: CSSProperties = {};
  if (parent.layout === "grid") {
    if (child.colSpan && child.colSpan > 1) s.gridColumn = `span ${child.colSpan}`;
    if (child.rowSpan && child.rowSpan > 1) s.gridRow = `span ${child.rowSpan}`;
    const h = sizeToCSS(child.height);
    if (h) s.height = h;
    return s;
  }
  const isRow = (parent.direction ?? "column") === "row";
  const mainToken = isRow ? child.width : child.height;   // grows/divides along the main axis
  const crossToken = isRow ? child.height : child.width;  // fixed size across the main axis
  const parentMain = isRow ? parent.width : parent.height;
  // "Definite" main size means the child should fill+follow it. For a column, an explicit height OR a
  // min-height (set by resizing the section's height) both count — so children fill/shrink with the floor.
  const parentDefinite = (!!parentMain && parentMain !== "auto" && parentMain !== "fill") || (!isRow && !!parent.minHeight);
  // When the child has no explicit MAIN size and the parent's main axis is DEFINITE (e.g. a section with a
  // set height), the child FILLS + follows the parent (`1 1 auto`: grow to fill, shrink to fit, content
  // basis) — so shrinking the parent's height shrinks its children. Otherwise it hugs / uses its token
  // (keeps a hug-content parent, like the page, growing with content instead of stretching empty children).
  s.flex = (!mainToken || mainToken === "auto") && parentDefinite ? "1 1 auto" : flexForWidth(mainToken);
  // A box can pin its OWN cross-axis alignment (used by edge-anchored resize to keep the far edge fixed
  // even when the parent centres/stretches its children).
  if (child.alignSelf) s.alignSelf = child.alignSelf;
  // By default a box HUGS its content (flex auto-minimum = content) — it can't be sized smaller than
  // what's inside it. When `clip` is on, OR the box is EMPTY (nothing inside), we drop the minimum so
  // it can be shrunk all the way down to ~1px (padding is clipped along with it).
  if (child.clip || isEmptyBox(child)) { s.minWidth = 0; if (child.minHeight == null) s.minHeight = 0; } // keep an EXPLICIT resize floor; only drop the content-min when there's none
  // ── Responsive Field Guide reflow ──
  // A section inside a ROW BAND keeps a usable minimum width (`min(100%, 14rem)`): its siblings stay side-by-side
  // while they fit, but once the row is too narrow for everyone at that minimum, it WRAPS — so on a phone the
  // sections stack (each ~14rem-or-full) instead of cramming into unreadable columns. Doesn't touch resize/grow.
  if (parent.rowBand && isRow && !child.clip && !isEmptyBox(child) && isContainer(child)) s.minWidth = "min(100%, 14rem)"; // only SECTIONS get the reflow floor; elements/components hug their content
  const crossCss = sizeToCSS(crossToken);
  if (crossCss) { if (isRow) s.height = crossCss; else s.width = crossCss; }
  // HUG, don't stretch: a BLOCK (element/component) with an auto cross-size ("Fit") must be exactly as big as its
  // content — the parent's default `align-items: stretch` would otherwise blow it up to the full cross axis, which
  // reads as an empty "wrapper" box around a short heading/button. Pin it to the start (or follow an explicit parent
  // alignment). Containers keep stretching (sections fill their row / share equal height); an explicit self-align
  // (edge-anchored resize) is never overwritten.
  if (!crossCss && !isContainer(child) && !child.alignSelf) {
    const pa = parent.align ?? "stretch";
    s.alignSelf = pa === "stretch" ? "flex-start" : ALIGN_CSS[pa];
  }
  return s;
}
