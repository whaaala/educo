"use client";

/**
 * Recursive box-tree canvas — the Framer/Webflow-style editor surface. Renders a BoxNode tree with
 * flex OR grid layout, layered backgrounds (colour / gradient / image / overlay), and inline editing.
 * Structure editing (add child, move, duplicate, delete) lives on a small per-node toolbar; styling
 * lives in BoxInspector. Everything flows — boxes can never overlap. Controlled: edits flow up via
 * onChange(root); selection via selectedId/onSelectId.
 */

import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, ChevronUp, ChevronDown, Copy, Scissors, ClipboardPaste, Trash2, Upload, GripVertical, MoreVertical, Rows3, Columns3, Grid3x3, Type, Heading as HeadingIcon, MousePointerClick, Image as ImageIcon } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, type BoxType,
  containerStyle, childStyle, marginCSS, sizeToCSS, u, baseUnit, createContainer, createGrid, createElement,
  updateBox, removeBox, insertBox, moveBoxStep, duplicateBox, moveBox, cloneBox, findParent, isAncestor, isContainer, isEmptyBox,
} from "@/lib/box-model";
import { colorToCSS } from "@/components/shared/ColorPalettePicker";
import { EditableText, ImageBox } from "@/components/website/sections/SectionKit";

/** Layered background CSS: base fill (colour/gradient) → image → overlay; content renders above. */
function backgroundStyle(node: BoxNode): React.CSSProperties {
  const s: React.CSSProperties = {};
  const layers: string[] = [];
  const asGradient = (c: string) => { const css = colorToCSS(c); return css.startsWith("linear-gradient") ? css : `linear-gradient(${css}, ${css})`; };
  if (node.bgOverlay) layers.push(asGradient(node.bgOverlay));
  if (node.bgImage) layers.push(`url("${node.bgImage}")`);
  const baseGrad = node.background?.startsWith("gradient:");
  if (baseGrad && !node.bgImage) layers.push(colorToCSS(node.background!));
  if (layers.length) {
    s.backgroundImage = layers.join(", ");
    s.backgroundSize = node.bgImage ? (node.bgSize ?? "cover") : undefined;
    s.backgroundPosition = "center";
    s.backgroundRepeat = "no-repeat";
  }
  if (node.background && !baseGrad) s.backgroundColor = node.background;
  return s;
}

/**
 * Resolve the LIVE pixel value of the fluid base unit (--box-u = clamp(minRem, cqw, maxRem)), replicating
 * baseUnit(), so we can convert a measured pixel offset into the stored (u-scaled) margin unit — u(stored)
 * renders back to that exact pixel value. Custom properties aren't resolved by getComputedStyle, so we
 * recompute the clamp from the live container-query width + root font-size (which honours browser zoom /
 * user font settings — WCAG). Used by edge-anchored resize to pin a box in place without any jump.
 */
function measureBoxU(el: HTMLElement, baseFont: number): number {
  const doc = el.ownerDocument;
  const rem = parseFloat(getComputedStyle(doc.documentElement).fontSize) || 16;
  let cq: HTMLElement | null = el.parentElement;
  while (cq && getComputedStyle(cq).containerType === "normal") cq = cq.parentElement;
  const cqw = (cq?.clientWidth ?? doc.defaultView?.innerWidth ?? 1000) / 100;
  const lo = ((baseFont * 0.7) / 16) * rem;
  const hi = ((baseFont * 1.4) / 16) * rem;
  const mid = (baseFont / 10) * cqw;
  return Math.min(hi, Math.max(lo, mid)) || 10;
}

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
const HANDLES: { edge: Edge; pos: string; cursor: string; label: string; title: string }[] = [
  { edge: "n", pos: "left-1/2 -top-1 -translate-x-1/2 h-2.5 w-9 rounded-full", cursor: "cursor-ns-resize", label: "top edge", title: "Drag the top edge (bottom stays put)" },
  { edge: "s", pos: "left-1/2 -bottom-1 -translate-x-1/2 h-2.5 w-9 rounded-full", cursor: "cursor-ns-resize", label: "bottom edge", title: "Drag the bottom edge (top stays put)" },
  { edge: "e", pos: "top-1/2 -right-1 -translate-y-1/2 w-2.5 h-9 rounded-full", cursor: "cursor-ew-resize", label: "right edge", title: "Drag the right edge (left stays put)" },
  { edge: "w", pos: "top-1/2 -left-1 -translate-y-1/2 w-2.5 h-9 rounded-full", cursor: "cursor-ew-resize", label: "left edge", title: "Drag the left edge (right stays put)" },
  { edge: "ne", pos: "-top-1 -right-1 w-3 h-3 rounded-full", cursor: "cursor-nesw-resize", label: "top-right corner", title: "Drag the top-right corner" },
  { edge: "nw", pos: "-top-1 -left-1 w-3 h-3 rounded-full", cursor: "cursor-nwse-resize", label: "top-left corner", title: "Drag the top-left corner" },
  { edge: "se", pos: "-bottom-1 -right-1 w-3 h-3 rounded-full", cursor: "cursor-nwse-resize", label: "bottom-right corner", title: "Drag the bottom-right corner" },
  { edge: "sw", pos: "-bottom-1 -left-1 w-3 h-3 rounded-full", cursor: "cursor-nesw-resize", label: "bottom-left corner", title: "Drag the bottom-left corner" },
];

const ADD_ITEMS: { type: BoxType | "row" | "grid"; label: string; Icon: typeof Type }[] = [
  { type: "container", label: "Section (stack)", Icon: Rows3 },
  { type: "row", label: "Row", Icon: Columns3 },
  { type: "grid", label: "Grid", Icon: Grid3x3 },
  { type: "heading", label: "Heading", Icon: HeadingIcon },
  { type: "text", label: "Text", Icon: Type },
  { type: "button", label: "Button", Icon: MousePointerClick },
  { type: "image", label: "Image", Icon: ImageIcon },
];

export default function BoxCanvas({
  root, theme, editable = true, selectedId, onSelectId, onChange, onResized, minHeight = 600,
}: {
  root: BoxNode;
  theme: SiteTheme;
  editable?: boolean;
  selectedId?: string | null;
  onSelectId?: (id: string | null) => void;
  onChange: (root: BoxNode) => void;
  onResized?: (id: string, axis: "width" | "height") => void;
  minHeight?: number; // the page's minimum height (≈ a viewport); the page GROWS past this with content
}) {
  const [menuFor, setMenuFor] = useState<string | null>(null); // which box's actions dropdown is open
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null); // fixed pos of the ⋯ menu (portaled to body so it never gets clipped by the box)
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => { setMenuFor(null); setMenuPos(null); };
  const [resizing, setResizing] = useState(false);
  const [resizeCursor, setResizeCursor] = useState<string | null>(null); // cursor shown by the full-screen overlay while resizing (so it never disappears)
  const [dragId, setDragId] = useState<string | null>(null); // box being dragged (after the move threshold)
  const [dragGhost, setDragGhost] = useState<{ x: number; y: number; w: number; label: string } | null>(null); // floating preview that follows the cursor
  const [dropRect, setDropRect] = useState<{ left: number; top: number; width: number; height: number; inside: boolean } | null>(null); // insertion line / drop-inside highlight (viewport coords)
  const dragArm = useRef<{ id: string; startX: number; startY: number; w: number; h: number; label: string } | null>(null); // armed on grip mousedown; upgrades to a real drag past the threshold
  const dragIdRef = useRef<string | null>(null);       // mirror of dragId for the document listeners
  const dropRef = useRef<{ parentId: string; index: number } | null>(null); // where a release would drop
  const dropWidthRef = useRef<string | null>(null); // width the dropped block should take (fill the line's leftover space)
  const rootRef = useRef(root); rootRef.current = root; // always-fresh tree for the drag listeners
  const [clip, setClip] = useState<BoxNode | null>(null); // copy/cut clipboard (a cloned subtree)
  const select = (id: string | null) => onSelectId?.(id);

  // ── Copy / cut / paste (mouse buttons + keyboard). Paste drops INSIDE a selected container, else
  // right AFTER the selected box; with nothing selected it appends to the page. ──
  const copyBox = (id: string) => { const n = findByIdLocal(root, id); if (n) setClip(cloneBox(n)); };
  const cutBox = (id: string) => { if (id === root.id) return; const n = findByIdLocal(root, id); if (n) { setClip(cloneBox(n)); onChange(removeBox(root, id)); select(null); } };
  const pasteBox = (id: string | null) => {
    if (!clip) return;
    const node = cloneBox(clip);
    const target = id ? findByIdLocal(root, id) : null;
    if (target && isContainer(target)) onChange(insertBox(root, target.id, target.children?.length ?? 0, node));
    else if (target) { const p = findParent(root, target.id); onChange(p ? insertBox(root, p.parent.id, p.index + 1, node) : insertBox(root, root.id, root.children?.length ?? 0, node)); }
    else onChange(insertBox(root, root.id, root.children?.length ?? 0, node));
    select(node.id);
  };

  // Keyboard operations on the selected box (WCAG): copy/cut/paste, duplicate, delete, reorder, deselect.
  useEffect(() => {
    if (!editable) return;
    const onKey = (e: KeyboardEvent) => {
      const ae = document.activeElement as HTMLElement | null;
      if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable)) return; // never hijack text editing
      const id = selectedId ?? null;
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      if (mod && k === "c") { if (id) { copyBox(id); e.preventDefault(); } }
      else if (mod && k === "x") { if (id) { cutBox(id); e.preventDefault(); } }
      else if (mod && k === "v") { if (clip) { pasteBox(id); e.preventDefault(); } }
      else if (mod && k === "d") { if (id) { onChange(duplicateBox(root, id)); e.preventDefault(); } }
      else if ((e.key === "Delete" || e.key === "Backspace") && id && id !== root.id) { onChange(removeBox(root, id)); select(null); e.preventDefault(); }
      else if (e.key === "ArrowUp" && id) { onChange(moveBoxStep(root, id, -1)); e.preventDefault(); }
      else if (e.key === "ArrowDown" && id) { onChange(moveBoxStep(root, id, 1)); e.preventDefault(); }
      else if (e.key === "Escape") { select(null); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editable, selectedId, root, clip, onChange]); // eslint-disable-line react-hooks/exhaustive-deps

  // The ⋯ actions menu is portaled to <body> at a fixed position so it's never clipped by a small box.
  // Close it on outside-click, and dismiss on scroll/resize (its anchored position would go stale).
  useEffect(() => {
    if (!menuFor) return;
    const onDown = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu(); };
    const onGone = () => closeMenu();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onGone, true);
    window.addEventListener("resize", onGone);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("scroll", onGone, true); window.removeEventListener("resize", onGone); };
  }, [menuFor]);

  // ── Pointer-based drag & drop ────────────────────────────────────────────────────────────────
  // Replaces the janky native HTML5 drag. Grab a block's grip and a floating PREVIEW follows the
  // cursor while a bright INSERTION LINE (or drop-inside highlight) shows exactly where it will land.
  // Any block can move to any slot in any container — reorder among siblings AND reparent (nested).
  const dragLabel = (n: BoxNode): string => {
    if (isContainer(n)) return n.layout === "grid" ? "Grid" : (n.direction ?? "column") === "row" ? "Row" : "Section";
    const t = n.text?.trim();
    if (n.type === "heading") return t ? `Heading: ${t.slice(0, 18)}` : "Heading";
    if (n.type === "button") return t ? `Button: ${t.slice(0, 14)}` : "Button";
    if (n.type === "image") return "Image";
    return t ? `Text: ${t.slice(0, 18)}` : "Text";
  };
  const directKids = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>(":scope > [data-box-id]"));
  type Drop = { target: { parentId: string; index: number }; rect: { left: number; top: number; width: number; height: number; inside: boolean }; moveWidth?: string };

  // Pick the drop SLOT among a container's children from the ACTUAL laid-out geometry — not the nominal
  // flex-direction. This is what makes drops land where the line shows even when a "row" wraps: full-width
  // sections stack (we compare vertically, draw a horizontal line); side-by-side blocks share a row (we
  // compare horizontally, draw a vertical line). We find the child nearest the cursor, detect whether it
  // sits BESIDE a sibling (same row) or is stacked, then decide before/after on that local axis.
  const slotFromKids = (parentEl: HTMLElement, kidEls: HTMLElement[], x: number, y: number): { index: number; rect: Drop["rect"]; moveWidth?: string } => {
    const pr = parentEl.getBoundingClientRect();
    const T = 3;
    if (!kidEls.length) return { index: 0, rect: { left: pr.left, top: pr.top, width: pr.width, height: pr.height, inside: true } };
    const rects = kidEls.map((k) => k.getBoundingClientRect());
    const cx = (r: DOMRect) => r.left + r.width / 2, cy = (r: DOMRect) => r.top + r.height / 2;
    const sameRow = (a: DOMRect, b: DOMRect) => a.top < b.bottom && b.top < a.bottom; // vertical overlap → same visual row
    let k = 0, best = Infinity;
    rects.forEach((r, i) => { const d = Math.hypot(cx(r) - x, cy(r) - y); if (d < best) { best = d; k = i; } });
    const kr = rects[k];
    // "Side-by-side" drop when either: the nearest block already sits beside a sibling, OR the pointer is
    // on that block's LINE but in the empty gap to its side (so you can drop into the space you opened up
    // by narrowing a section). Otherwise it's a stacked drop onto its own new line.
    const onKrLine = y >= kr.top && y <= kr.bottom;
    const rowFlow = rects.some((r, i) => i !== k && sameRow(r, kr)) || (onKrLine && (x < kr.left || x > kr.right));
    const before = rowFlow ? x < cx(kr) : y < cy(kr);
    const index = k + (before ? 0 : 1);
    const rect: Drop["rect"] = rowFlow
      ? { left: (before ? kr.left : kr.right) - T / 2, top: kr.top, width: T, height: kr.height, inside: false }        // vertical line
      : { left: pr.left + 4, top: (before ? kr.top : kr.bottom) - T / 2, width: Math.max(8, pr.width - 8), height: T, inside: false }; // horizontal line
    // Width the dropped block should take: dropping BESIDE blocks on a line → FILL the line's leftover
    // space so it fits next to them; if the line is essentially full (or it's a stacked drop) → 100% on its own line.
    let moveWidth = "100%";
    if (rowFlow) {
      const lineSumPct = rects.filter((r) => sameRow(r, kr)).reduce((s, r) => s + (r.width / Math.max(1, pr.width)) * 100, 0);
      const remaining = Math.round((100 - lineSumPct) * 10) / 10;
      moveWidth = remaining >= 8 ? `${remaining}%` : "100%"; // no real room left → give it its own line instead of overflowing
    }
    return { index, rect, moveWidth };
  };
  // Hit-test the deepest box under the cursor that ISN'T the dragged block (or inside it). If it's a
  // container, drop INSIDE it (among its children); if it's a leaf, drop BESIDE it (among its parent's).
  const computeDrop = (x: number, y: number, draggingId: string): Drop | null => {
    const stack = typeof document.elementsFromPoint === "function" ? document.elementsFromPoint(x, y) : [];
    let hitEl: HTMLElement | null = null, hitId: string | null = null;
    for (const el of stack) {
      const boxEl = (el as HTMLElement).closest?.("[data-box-id]") as HTMLElement | null;
      if (!boxEl) continue;
      const id = boxEl.getAttribute("data-box-id");
      if (!id || id === draggingId || isAncestor(rootRef.current, draggingId, id)) continue;
      hitEl = boxEl; hitId = id; break;
    }
    if (!hitEl || !hitId) return null;
    const node = findByIdLocal(rootRef.current, hitId);
    if (!node) return null;
    const info = findParent(rootRef.current, hitId);
    // Near a block's OUTER EDGE (along its PARENT's MAIN axis) → drop BESIDE it (reorder among the
    // parent's children); over its MIDDLE → (for a container) drop INSIDE it. Checking only the parent's
    // main axis means: hover the TOP/BOTTOM of a ROW to make a NEW row above/below; hover the LEFT/RIGHT
    // of a SECTION to place another section alongside it — and the row's own empty space drops inside.
    const r = hitEl.getBoundingClientRect();
    const parentIsRow = !!info && (info.parent.direction ?? "column") === "row";
    const bx = Math.min(r.width * 0.22, 22), by = Math.min(r.height * 0.22, 22);
    const nearEdge = parentIsRow ? (x < r.left + bx || x > r.right - bx) : (y < r.top + by || y > r.bottom - by);
    const dropBeside = !isContainer(node) || (nearEdge && !!info);
    if (dropBeside && info) {
      const pEl = document.querySelector<HTMLElement>(`[data-box-id="${info.parent.id}"]`);
      if (pEl) { const s = slotFromKids(pEl, directKids(pEl), x, y); return { target: { parentId: info.parent.id, index: s.index }, rect: s.rect, moveWidth: s.moveWidth }; }
    }
    const s = slotFromKids(hitEl, directKids(hitEl), x, y); // drop INSIDE this container
    return { target: { parentId: node.id, index: s.index }, rect: s.rect, moveWidth: s.moveWidth };
  };

  const onDragMove = (ev: MouseEvent) => {
    const arm = dragArm.current;
    if (!arm) return;
    if (dragIdRef.current == null) { // upgrade "armed" → real drag only past a small threshold (click vs drag)
      if (Math.hypot(ev.clientX - arm.startX, ev.clientY - arm.startY) < 4) return;
      dragIdRef.current = arm.id; setDragId(arm.id); document.body.style.userSelect = "none";
    }
    setDragGhost({ x: ev.clientX, y: ev.clientY, w: Math.min(arm.w, 260), label: arm.label });
    const hit = computeDrop(ev.clientX, ev.clientY, arm.id);
    dropRef.current = hit?.target ?? null;
    dropWidthRef.current = hit?.moveWidth ?? null;
    setDropRect(hit?.rect ?? null);
  };
  const onDragUp = () => {
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragUp);
    document.body.style.userSelect = "";
    const id = dragIdRef.current, target = dropRef.current, w = dropWidthRef.current;
    if (id && target) {
      let next = moveBox(rootRef.current, id, target.parentId, target.index);
      if (w) next = updateBox(next, id, { width: w }); // take the line's leftover space so it fills, never wraps to a new row
      onChange(next);
    }
    dragArm.current = null; dragIdRef.current = null; dropRef.current = null; dropWidthRef.current = null;
    setDragId(null); setDragGhost(null); setDropRect(null);
  };
  const startDrag = (e: React.MouseEvent, node: BoxNode) => {
    if (!editable) return;
    e.preventDefault(); e.stopPropagation();
    const el = document.querySelector<HTMLElement>(`[data-box-id="${node.id}"]`);
    const r = el?.getBoundingClientRect();
    dragArm.current = { id: node.id, startX: e.clientX, startY: e.clientY, w: r?.width ?? 160, h: r?.height ?? 40, label: dragLabel(node) };
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragUp);
  };

  // ── Drag-to-resize ───────────────────────────────────────────────────────────────────────────
  // ONE consistent model: the box is TOP-LEFT anchored (alignSelf: flex-start) so resizing is fully
  // deterministic — the edge you grab moves and the OPPOSITE edge stays put, on every side, in any
  // parent (centred, stretched, hugging). We keep the box's margin-box size constant for the anchored
  // edge, working entirely in PIXELS and converting to the stored unit exactly (via measureBoxU), so a
  // centred box never jumps on grab and the far edge holds at any screen size. rAF-batched + a cursor
  // overlay keep it smooth (the cursor never disappears while dragging).
  const cursorFor = (edge: Edge): string =>
    edge === "n" || edge === "s" ? "ns-resize" : edge === "e" || edge === "w" ? "ew-resize" : edge === "nw" || edge === "se" ? "nwse-resize" : "nesw-resize";

  const startResize = (e: React.MouseEvent, id: string, edge: Edge) => {
    if (!editable) return;
    e.preventDefault(); e.stopPropagation();
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    const node = findByIdLocal(root, id);
    const pEl = el?.parentElement ?? null;
    if (!el || !node) return;
    const rect = el.getBoundingClientRect();
    const hasE = edge.includes("e"), hasW = edge.includes("w"), hasS = edge.includes("s"), hasN = edge.includes("n");
    const startX = e.clientX, startY = e.clientY, W0 = rect.width, H0 = rect.height;

    const info = findParent(root, id);
    const parentGrid = info?.parent.layout === "grid";
    const parentRow = !parentGrid && !!info && (info.parent.direction ?? "column") === "row";

    // Units: width as % of the PARENT CONTENT box, height as vh, margins in the fluid base unit (px→u
    // exact so the pixel maths holds — keeping marginX_px + size_px constant fixes the opposite edge).
    const boxU = measureBoxU(el, rootRef.current.baseFont ?? 10);
    const pxU = (px: number) => Math.round((px * 10) / boxU); // SIGNED px → stored unit (must keep sign so dragging an edge outward can shrink the margin back to 0 / the page edge)
    let maxW = 1, padL = 0, padT = 0;
    if (pEl) {
      const cs = getComputedStyle(pEl);
      padL = parseFloat(cs.paddingLeft) || 0; padT = parseFloat(cs.paddingTop) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      maxW = (pEl.clientWidth - padL - padR) || 1;
    }
    const vhPx = window.innerHeight || 800;
    const pct = (px: number) => `${Math.max(3, Math.min(100, (px / maxW) * 100)).toFixed(2)}%`;
    const vh = (px: number) => `${Math.max(0.1, (px / vhPx) * 100).toFixed(2)}vh`;

    // Parent content-box origin — for measuring the section's edges and clamping every drag to the page.
    const prRect = pEl ? pEl.getBoundingClientRect() : null;
    const contentLeftPx = prRect ? prRect.left + padL : 0;
    const contentTopPx = prRect ? prRect.top + padT : 0;

    // Cross-axis anchor: pin alignment + current position/size so a centred/stretched box doesn't jump.
    let base = root, changed = false;
    const anchor: Partial<BoxNode> = {};
    if (prRect) {
      if ((hasE || hasW) && !parentRow) { anchor.alignSelf = "flex-start"; anchor.width = pct(W0); anchor.marginLeft = pxU(rect.left - contentLeftPx); } // width is CROSS (column) → pin horizontal
      if ((hasN || hasS) && parentRow) { anchor.alignSelf = "flex-start"; anchor.height = vh(H0); anchor.marginTop = pxU(rect.top - contentTopPx); }        // height is CROSS (row) → pin vertical
    }
    if (Object.keys(anchor).length) { base = updateBox(base, id, anchor); changed = true; }
    if (changed) onChange(base);

    const bn = findByIdLocal(base, id) ?? node;
    const ML0 = bn.marginLeft ?? bn.margin ?? 0; // stored (u) units after anchoring
    const MT0 = bn.marginTop ?? bn.margin ?? 0;
    const ML0px = (boxU * ML0) / 10, MT0px = (boxU * MT0) / 10;

    // Measured edges (relative to the parent content box) + the fixed FLOW origin (the section's position
    // from previous siblings, independent of its margin). Every drag is clamped to [flow origin … page
    // edge] so a section can NEVER be dragged off the page, while the opposite edge stays anchored.
    const startLeftPx = rect.left - contentLeftPx, startRightPx = rect.right - contentLeftPx;
    const startTopPx = rect.top - contentTopPx, startBotPx = rect.bottom - contentTopPx;
    const flowX = startLeftPx - ML0px, flowY = startTopPx - MT0px;
    const minWpx = Math.max(8, 0.03 * maxW), minHpx = 8;
    let sameLineAfterPx = 0; // width of same-line neighbours to the RIGHT — can't grow past them (no wrap/off-page)
    if (parentRow && info) {
      for (const c of info.parent.children!) {
        if (c.id === id) continue;
        const e2 = document.querySelector<HTMLElement>(`[data-box-id="${c.id}"]`);
        if (!e2) continue;
        const r2 = e2.getBoundingClientRect();
        if (r2.top < rect.bottom && rect.top < r2.bottom && (r2.left - contentLeftPx) >= startRightPx - 1) sameLineAfterPx += r2.width;
      }
    }
    const maxRightPx = Math.max(startLeftPx + minWpx, maxW - sameLineAfterPx);

    // Same-line neighbours for the ROW DIVIDER: the sections directly before/after this one, and the
    // total width of the others on the line. Sections in a row PACK (no margins), so grabbing a shared
    // edge is a divider — the neighbour gives/takes the width and there is NEVER a mid-row gap.
    let prevSib: { id: string; w0: number } | null = null, nextSib: { id: string; w0: number } | null = null, othersSumPct = 0;
    if (parentRow && info) {
      const sibs = info.parent.children!;
      const myIdx = sibs.findIndex((c) => c.id === id);
      sibs.forEach((c, i) => {
        if (i === myIdx) return;
        const e2 = document.querySelector<HTMLElement>(`[data-box-id="${c.id}"]`);
        if (!e2) return;
        const r2 = e2.getBoundingClientRect();
        if (!(r2.top < rect.bottom && rect.top < r2.bottom)) return; // same line only
        const w = (r2.width / maxW) * 100;
        othersSumPct += w;
        if (i === myIdx - 1) prevSib = { id: c.id, w0: w };
        if (i === myIdx + 1) nextSib = { id: c.id, w0: w };
      });
    }
    const W0pct = (W0 / maxW) * 100, minPct = 3;
    const fmt = (p: number) => `${Math.max(minPct, p).toFixed(2)}%`;

    setResizeCursor(cursorFor(edge));
    setResizing(true);
    let raf = 0; let pending: BoxNode | null = null;
    const flush = () => { raf = 0; if (pending) { onChange(pending); pending = null; } };
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      let tree = base;
      // ── WIDTH ──
      if (hasE || hasW) {
        if (parentRow) {
          // Row → DIVIDER: this section grows, the neighbour on the grabbed side gives up the width (no gap).
          const grow = ((hasE ? dx : -dx) / maxW) * 100; // % this section grows
          const neighbor = hasE ? nextSib : prevSib;
          if (neighbor) {
            const T = W0pct + neighbor.w0;
            const aw = Math.min(T - minPct, Math.max(minPct, W0pct + grow));
            tree = updateBox(updateBox(tree, id, { width: fmt(aw), marginLeft: 0 }), neighbor.id, { width: fmt(T - aw), marginLeft: 0 });
          } else if (hasW) {
            // LEFTMOST section's LEFT edge → open LEADING space (margin-left), keeping the right edge fixed
            // (edge-anchored). This is the "reduce width from the left without moving the right" behaviour.
            const left = Math.min(startRightPx - minWpx, Math.max(flowX, startLeftPx + dx));
            tree = updateBox(tree, id, { width: pct(startRightPx - left), marginLeft: Math.max(0, pxU(left - flowX)) });
          } else {
            // RIGHTMOST section's RIGHT edge → grow/shrink into the row's LEFTOVER space (line total ≤ 100%)
            const maxA = Math.max(minPct, 100 - othersSumPct);
            tree = updateBox(tree, id, { width: fmt(Math.min(maxA, Math.max(minPct, W0pct + grow))), marginLeft: 0 });
          }
        } else {
          // Column → width is the CROSS axis: bounded width + margin, page-anchored (edge-anchored, no jump).
          if (hasE) { const right = Math.min(maxRightPx, Math.max(startLeftPx + minWpx, startRightPx + dx)); tree = updateBox(tree, id, { width: pct(right - startLeftPx) }); }
          if (hasW) { const left = Math.min(startRightPx - minWpx, Math.max(flowX, startLeftPx + dx)); tree = updateBox(tree, id, { width: pct(startRightPx - left), marginLeft: Math.max(0, pxU(left - flowX)) }); }
        }
      }
      // ── HEIGHT ── (both parents; BOTTOM keeps top, TOP keeps bottom)
      if (hasS) { const bot = Math.max(startTopPx + minHpx, startBotPx + dy); tree = updateBox(tree, id, { height: vh(bot - startTopPx) }); }
      if (hasN) { const top = Math.min(startBotPx - minHpx, Math.max(flowY, startTopPx + dy)); tree = updateBox(tree, id, { height: vh(startBotPx - top), marginTop: Math.max(0, pxU(top - flowY)) }); }
      pending = tree;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onUp = () => {
      if (raf) { cancelAnimationFrame(raf); flush(); }
      setResizing(false); setResizeCursor(null);
      document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp);
      onResized?.(id, (hasS || hasN) && !hasE && !hasW ? "height" : "width");
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const addChild = (parentId: string, kind: BoxType | "row" | "grid") => {
    const node =
      kind === "row" ? createContainer("row")
      : kind === "grid" ? createGrid(3)
      : kind === "container" ? createContainer("column")
      : createElement(kind as Exclude<BoxType, "container">);
    // append at end of the container's children. NOTE: we intentionally do NOT select the new box —
    // the current selection (usually the parent you're adding into) stays put, so you can keep adding.
    const parent = findByIdLocal(root, parentId);
    const index = parent?.children?.length ?? 0;
    onChange(insertBox(root, parentId, index, node));
    closeMenu();
  };

  const renderNode = (node: BoxNode, parent: BoxNode | null): React.ReactNode => {
    const isSel = editable && selectedId === node.id;
    const isRoot = parent === null;
    const wrapStyle: React.CSSProperties = {
      position: "relative",
      borderRadius: node.radius,
      ...marginCSS(node),
      opacity: node.opacity !== undefined ? node.opacity / 100 : undefined,
      overflow: node.clip || node.radius ? "hidden" : undefined, // clip only when opted-in or rounded (never clip the selection chrome)
      // Root fills at least one viewport but GROWS with content (page height = total section heights).
      // The root also defines the global base unit (--box-u, rem-based) that every size scales off.
      ...(parent ? childStyle(node, parent) : { width: "100%", minHeight, ["--box-u" as string]: baseUnit(node.baseFont ?? 10) }),
      ...backgroundStyle(node),
    };

    // Visible drag-to-resize handles on every edge + corner, so you can resize from any side.
    const resizeHandles = isSel && editable && !isRoot ? (
      <>
        {HANDLES.map((h) => (
          <div key={h.edge} onMouseDown={(e) => startResize(e, node.id, h.edge)} aria-label={`Resize ${h.label}`} title={h.title} className={`absolute ${h.pos} ${h.cursor} bg-indigo-500 border-2 border-white shadow z-30`} />
        ))}
      </>
    ) : null;

    // Select on mousedown (fires before the inline editor's click-guard) and stop propagation so the
    // DEEPEST box under the pointer wins and the canvas-background deselect doesn't also fire.
    const onSelectDown = (e: React.MouseEvent) => { if (editable) { e.stopPropagation(); select(node.id); closeMenu(); } };

    const isDragging = dragId === node.id;

    // ── container ──
    if (isContainer(node)) {
      const kids = node.children ?? [];
      return (
        <div
          key={node.id}
          data-box-id={node.id}
          onMouseDown={onSelectDown}
          style={{ ...containerStyle(node), ...wrapStyle, ...(isDragging ? { opacity: 0.4 } : {}) }}
          className={`${editable ? "transition-shadow" : ""} ${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : editable ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
        >
          {kids.map((c) => (
            <Fragment key={c.id}>{renderNode(c, node)}</Fragment>
          ))}
          {editable && kids.length === 0 && (
            // An empty block shows a non-interactive hint — select it, then use the ⋯ menu (or drag a block
            // in) to fill it. It's a hint only; it does NOT add anything by itself.
            <div className="w-full flex items-center justify-center gap-1 py-3 text-gray-400 border border-dashed border-gray-300 rounded-lg pointer-events-none" style={{ fontSize: u(11) }}><Plus className="w-3 h-3 shrink-0" /> Empty block</div>
          )}
          {isSel && <NodeToolbar node={node} isRoot={isRoot} />}
          {resizeHandles}
        </div>
      );
    }

    // ── element ──
    return (
      <div
        key={node.id}
        data-box-id={node.id}
        onMouseDown={onSelectDown}
        style={{ ...wrapStyle, ...(isDragging ? { opacity: 0.4 } : {}) }}
        className={`${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : editable ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
      >
        <ElementView node={node} theme={theme} editable={editable} onText={(v) => onChange(updateBox(root, node.id, { text: v }))} onSrc={(v) => onChange(updateBox(root, node.id, { src: v }))} />
        {isSel && <NodeToolbar node={node} isRoot={isRoot} />}
        {resizeHandles}
      </div>
    );
  };

  // Small floating structure toolbar for the selected node.
  function NodeToolbar({ node, isRoot }: { node: BoxNode; isRoot: boolean }) {
    // COLLAPSED bar: just a drag grip + a ⋯ button (tiny, never covers the box). All actions live in
    // the ⋯ dropdown, opened on demand, so you can always see and work on the element itself.
    const open = menuFor === node.id;
    const MenuItem = ({ onClick, Icon, label, danger, disabled }: { onClick: () => void; Icon: typeof Copy; label: string; danger?: boolean; disabled?: boolean }) => (
      <button
        disabled={disabled}
        onClick={() => { onClick(); closeMenu(); }}
        role="menuitem"
        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left disabled:opacity-40 ${danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40" : "text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"}`}
      ><Icon className="w-3.5 h-3.5 text-gray-400" /> {label}</button>
    );
    return (
      <div className="absolute top-1.5 left-1.5 z-40 flex items-center gap-0.5 rounded-lg bg-indigo-600 px-1 py-1 shadow-xl ring-1 ring-white/20" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        {!isRoot && (
          <span
            onMouseDown={(e) => startDrag(e, node)}
            title="Drag to move this block anywhere"
            aria-label="Drag to move"
            className="cursor-grab active:cursor-grabbing text-white/80 hover:text-white px-0.5"
          ><GripVertical className="w-3.5 h-3.5" /></span>
        )}
        <button
          onClick={(e) => {
            if (open) { closeMenu(); return; }
            const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setMenuPos({ top: r.bottom + 4, left: r.left });
            setMenuFor(node.id);
          }}
          aria-label="Block actions" aria-expanded={open} title="Actions"
          className="p-1 rounded text-white/90 hover:bg-white/15"
        ><MoreVertical className="w-3.5 h-3.5" /></button>
        {open && menuPos && createPortal(
          // Portaled to <body> at a fixed position so the menu is ALWAYS fully visible — a narrow box can
          // never clip it, and it floats above the canvas, inspector and everything else.
          <div
            ref={menuRef}
            style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
            className="z-[9999] w-44 max-h-[70vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl py-1"
            role="menu" aria-label="Block actions"
            onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
          >
            {isContainer(node) && (<>
              <div className="px-2.5 pt-0.5 pb-1 text-[9px] font-semibold uppercase tracking-wide text-gray-400">Add inside</div>
              {ADD_ITEMS.map(({ type, label, Icon }) => <MenuItem key={type} onClick={() => addChild(node.id, type)} Icon={Icon} label={label} />)}
              {!isRoot && <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />}
            </>)}
            {!isRoot && (<>
              <MenuItem onClick={() => onChange(moveBoxStep(root, node.id, -1))} Icon={ChevronUp} label="Move up" />
              <MenuItem onClick={() => onChange(moveBoxStep(root, node.id, 1))} Icon={ChevronDown} label="Move down" />
              <MenuItem onClick={() => onChange(duplicateBox(root, node.id))} Icon={Copy} label="Duplicate" />
              <MenuItem onClick={() => copyBox(node.id)} Icon={Copy} label="Copy" />
              <MenuItem onClick={() => cutBox(node.id)} Icon={Scissors} label="Cut" />
              <MenuItem onClick={() => pasteBox(node.id)} Icon={ClipboardPaste} label="Paste" disabled={!clip} />
              <MenuItem onClick={() => { onChange(removeBox(root, node.id)); select(null); }} Icon={Trash2} label="Delete" danger />
            </>)}
          </div>,
          document.body,
        )}
      </div>
    );
  }

  return (
    <div onMouseDown={() => editable && select(null)} className="w-full">
      {renderNode(root, null)}
      {/* While resizing, a transparent full-viewport overlay holds the resize cursor so it stays crisp and
          never disappears as the box reflows under the pointer. */}
      {resizing && resizeCursor && createPortal(
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 10001, cursor: resizeCursor }} />,
        document.body,
      )}
      {/* Drop indicator: a bright insertion line between siblings, or a dashed highlight over an empty
          container you're dropping into. Portaled to <body> so it's never clipped. */}
      {dropRect && createPortal(
        <div
          aria-hidden="true"
          style={{ position: "fixed", left: dropRect.left, top: dropRect.top, width: dropRect.width, height: dropRect.height, pointerEvents: "none", zIndex: 9998 }}
          className={dropRect.inside ? "rounded-lg outline outline-2 outline-dashed outline-indigo-500 bg-indigo-500/10" : "rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.9)]"}
        />,
        document.body,
      )}
      {/* Floating preview that follows the cursor while dragging. */}
      {dragGhost && createPortal(
        <div
          aria-hidden="true"
          style={{ position: "fixed", left: dragGhost.x + 14, top: dragGhost.y + 14, width: dragGhost.w, pointerEvents: "none", zIndex: 10000 }}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white opacity-90 shadow-2xl ring-1 ring-white/30"
        ><GripVertical className="w-3 h-3 shrink-0 opacity-80" /><span className="truncate">{dragGhost.label}</span></div>,
        document.body,
      )}
    </div>
  );
}

/** Local id lookup without importing findBox twice (keeps the render path tiny). */
function findByIdLocal(node: BoxNode, id: string): BoxNode | null {
  if (node.id === id) return node;
  for (const c of node.children ?? []) { const f = findByIdLocal(c, id); if (f) return f; }
  return null;
}

function ElementView({ node, theme, editable, onText, onSrc }: {
  node: BoxNode; theme: SiteTheme; editable?: boolean; onText: (v: string) => void; onSrc: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const align = node.textAlign ?? "left";
  switch (node.type) {
    case "heading":
      return <h2 style={{ color: node.color || theme.text, fontFamily: theme.headingFont, fontSize: u(node.fontSize ?? 32), fontWeight: node.bold ? 800 : 600, textAlign: align, width: "100%" }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Heading" /></h2>;
    case "button":
      return <a href={node.href || "#"} onClick={(e) => editable && e.preventDefault()} className="inline-flex items-center gap-2 rounded-full font-semibold" style={{ background: node.background ? colorToCSS(node.background) : theme.primary, color: node.color || "#fff", fontSize: u(node.fontSize ?? 14), padding: `${u(12)} ${u(24)}` }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Button" /></a>;
    case "image":
      return (
        <div className="relative w-full" style={{ height: sizeToCSS(node.height) ?? 260 }}>
          <ImageBox theme={theme} src={node.src} />
          {editable && (<>
            <button onClick={() => fileRef.current?.click()} className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-900/80 text-white shadow-lg hover:bg-gray-900"><Upload className="w-3.5 h-3.5" /> {node.src ? "Replace" : "Upload"}</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Upload image" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => onSrc(String(r.result)); r.readAsDataURL(f); e.target.value = ""; }} />
          </>)}
        </div>
      );
    default:
      return <p style={{ color: node.color || theme.textMuted, fontSize: u(node.fontSize ?? 16), textAlign: align, width: "100%" }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Add text" /></p>;
  }
}
