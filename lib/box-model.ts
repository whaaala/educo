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

export type BoxType = "container" | "text" | "heading" | "button" | "image";

export type FlexDir = "row" | "column";
export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexJustify = "start" | "center" | "end" | "between" | "around";

export interface BoxNode {
  id: string;
  type: BoxType;

  // ── container layout (ignored on elements) ──
  layout?: "flex" | "grid"; // layout engine for children (default flex)
  direction?: FlexDir;      // flex-direction (default column) — flex only
  gap?: number;             // px between children (both engines)
  align?: FlexAlign;        // align-items (cross axis)
  justify?: FlexJustify;    // justify-content (main axis) — flex only
  wrap?: boolean;           // flex-wrap — flex only
  columns?: number;         // grid: number of equal columns
  padding?: number;         // px inner padding (all sides)
  paddingTop?: number; paddingRight?: number; paddingBottom?: number; paddingLeft?: number; // per-side overrides
  margin?: number;          // px outer margin (all sides)
  marginTop?: number; marginRight?: number; marginBottom?: number; marginLeft?: number;     // per-side overrides
  radius?: number;          // px corner radius
  opacity?: number;         // 0–100 (%), default 100 (fully opaque)
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

  // ── element content ──
  text?: string;
  href?: string;
  src?: string;
  color?: string;
  fontSize?: number;
  bold?: boolean;
  textAlign?: "left" | "center" | "right";

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
    default: return { ...base, type: "text", text: "New text — click to edit.", ...overrides };
  }
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

/** flex-basis behaviour for a child inside a flex parent, derived from its width token. */
export function flexForWidth(token?: string): string | undefined {
  if (token === "fill") return "1 1 0%";
  if (!token || token === "auto") return "0 0 auto";
  return `0 0 ${token}`; // fixed % / px
}

/** Per-side padding CSS: a side override falls back to the general `padding`, then 0. */
export function paddingCSS(node: BoxNode): CSSProperties {
  const p = node.padding ?? 0;
  return {
    paddingTop: node.paddingTop ?? p,
    paddingRight: node.paddingRight ?? p,
    paddingBottom: node.paddingBottom ?? p,
    paddingLeft: node.paddingLeft ?? p,
  };
}

/** Per-side margin CSS: a side override falls back to the general `margin` (undefined = 0). */
export function marginCSS(node: BoxNode): CSSProperties {
  return {
    marginTop: node.marginTop ?? node.margin,
    marginRight: node.marginRight ?? node.margin,
    marginBottom: node.marginBottom ?? node.margin,
    marginLeft: node.marginLeft ?? node.margin,
  };
}

/** The container's own layout CSS (flex or grid), as inline style. */
export function containerStyle(node: BoxNode): CSSProperties {
  if (node.layout === "grid") {
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${Math.max(1, node.columns ?? 3)}, minmax(0, 1fr))`,
      gap: node.gap ?? 16,
      alignItems: ALIGN_CSS[node.align ?? "stretch"],
      ...paddingCSS(node),
      minHeight: node.minHeight,
    };
  }
  return {
    display: "flex",
    flexDirection: node.direction ?? "column",
    gap: node.gap ?? 16,
    alignItems: ALIGN_CSS[node.align ?? "stretch"],
    justifyContent: JUSTIFY_CSS[node.justify ?? "start"],
    flexWrap: node.wrap ? "wrap" : "nowrap",
    // Pack wrapped lines to the top so they never stretch apart and leave gaps between sections.
    alignContent: "flex-start",
    ...paddingCSS(node),
    minHeight: node.minHeight,
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
  s.flex = flexForWidth(mainToken);
  // Override the flex auto-minimum so a box can be resized SMALLER than its content (down to 1px).
  s.minWidth = 0;
  s.minHeight = 0;
  const crossCss = sizeToCSS(crossToken);
  if (crossCss) { if (isRow) s.height = crossCss; else s.width = crossCss; }
  return s;
}
