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
import { Plus, ChevronUp, ChevronDown, Copy, Scissors, ClipboardPaste, Trash2, Upload, GripVertical, MoreVertical, Rows3, Columns3, Grid3x3, Type, Heading as HeadingIcon, MousePointerClick, Image as ImageIcon, Layers, BringToFront, SendToBack, Video as VideoIcon, Sparkles, Minus as MinusIcon, List as ListIcon, Code2, Star } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, type BoxType,
  containerStyle, childStyle, marginCSS, sizeToCSS, u, baseUnit, createContainer, createGrid, createElement, createComponent,
  updateBox, removeBox, insertBox, moveBoxStep, duplicateBox, moveBox, cloneBox, findParent, isAncestor, isContainer, isEmptyBox, widthPct,
  isFloating, floatBox, unfloatBox, bringToFront, sendToBack, bringForward, sendBackward,
  radiusCSS, isClipped, SHADOW_CSS, videoEmbedSrc, sanitizeCssDeclarations,
  type Breakpoint, resolveResponsive, updateBoxResponsive,
} from "@/lib/box-model";
import { ICON_SET } from "./icons";
import { PortalMenu, MenuItem, MenuHeader, MenuSep } from "./ui";
import { blockForKind } from "@/lib/box-presets";
import { colorToCSS } from "@/components/shared/ColorPalettePicker";
import { COMPONENT_CSS } from "@/lib/educo-ui/components";
import { tokensFromTheme, tokensToCss } from "@/lib/educo-ui/tokens";
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

/** Border, drop shadow, per-corner radius and rotation for any box. */
function decorStyle(node: BoxNode): React.CSSProperties {
  const s: React.CSSProperties = {};
  const br = radiusCSS(node); if (br) s.borderRadius = br;
  if (node.borderWidth && node.type !== "divider") s.border = `${node.borderWidth}px ${node.borderStyle ?? "solid"} ${node.borderColor ? colorToCSS(node.borderColor) : "rgba(0,0,0,0.15)"}`; // divider uses borderWidth as its line thickness
  if (node.shadow) s.boxShadow = SHADOW_CSS[node.shadow];
  if (node.rotate) s.transform = `rotate(${node.rotate}deg)`;
  return s;
}

/** Typography for a text/heading/button element (falls back to the theme font + type defaults). */
function typoStyle(node: BoxNode, fallbackFamily: string, defaultWeight: number): React.CSSProperties {
  return {
    fontFamily: node.fontFamily || fallbackFamily,
    fontWeight: node.fontWeight ?? (node.bold ? 800 : defaultWeight),
    lineHeight: node.lineHeight,
    letterSpacing: node.letterSpacing != null ? `${node.letterSpacing}px` : undefined,
    fontStyle: node.italic ? "italic" : undefined,
    textDecoration: node.underline ? "underline" : undefined,
    textTransform: node.textTransform && node.textTransform !== "none" ? node.textTransform : undefined,
  };
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

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Measure the geometry needed to lift a box onto a free-floating layer: its POSITIONING PARENT (the
 *  nearest real content container — never a structural row band) and the box's current left/top (% of
 *  that parent's content box), width (% of it) and height (px). Reads live DOM rects, so it captures the
 *  box exactly where it sits → floating it causes NO jump. Exported so both the canvas (⋯ menu / Alt-drag)
 *  and the page (inspector toggle) lift from the same measurement. Returns null if the DOM isn't ready. */
export function measureFloatGeom(root: BoxNode, id: string): { parentId: string; left: number; top: number; width: string; height: number } | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
  const node = findByIdLocal(root, id);
  const info = findParent(root, id);
  if (!el || !node || !info) return null;
  // Positioning parent: if already floating, its parent IS the content container; if in flow, skip the
  // structural row band it lives in and use the content container above that (its grandparent).
  let parentId = info.parent.id;
  if (!isFloating(node) && info.parent.rowBand) {
    const gp = findParent(root, info.parent.id);
    parentId = gp ? gp.parent.id : info.parent.id;
  }
  const pEl = document.querySelector<HTMLElement>(`[data-box-id="${parentId}"]`);
  if (!pEl) return null;
  const r = el.getBoundingClientRect(), pr = pEl.getBoundingClientRect();
  const cs = getComputedStyle(pEl);
  const padL = parseFloat(cs.paddingLeft) || 0, padT = parseFloat(cs.paddingTop) || 0;
  const padR = parseFloat(cs.paddingRight) || 0, padB = parseFloat(cs.paddingBottom) || 0;
  const cw = Math.max(1, pr.width - padL - padR), ch = Math.max(1, pr.height - padT - padB);
  // A COMPONENT floats as a COMPACT card (a fixed px width ≈ half the parent, never wider than its content) so
  // it can be dragged freely in 2D and resized — instead of a full-width bar that only slides vertically. Other
  // blocks keep their measured % width.
  const isComponent = node.type === "component";
  const compactPx = Math.round(Math.min(r.width, Math.max(320, cw * 0.5)));
  const width = isComponent ? `${compactPx}px` : `${round1((r.width / cw) * 100)}%`;
  return {
    parentId,
    left: ((r.left - (pr.left + padL)) / cw) * 100,
    top: ((r.top - (pr.top + padT)) / ch) * 100,
    width,
    height: r.height,
  };
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

const ADD_ITEMS: { type: BoxType | "row" | "grid" | "accordion"; label: string; Icon: typeof Type }[] = [
  { type: "container", label: "Section (stack)", Icon: Rows3 },
  { type: "row", label: "Row", Icon: Columns3 },
  { type: "grid", label: "Grid", Icon: Grid3x3 },
  { type: "heading", label: "Heading", Icon: HeadingIcon },
  { type: "text", label: "Text", Icon: Type },
  { type: "button", label: "Button", Icon: MousePointerClick },
  { type: "image", label: "Image", Icon: ImageIcon },
  { type: "video", label: "Video", Icon: VideoIcon },
  { type: "icon", label: "Icon", Icon: Sparkles },
  { type: "list", label: "List", Icon: ListIcon },
  { type: "accordion", label: "Accordion", Icon: ChevronDown },
  { type: "divider", label: "Divider", Icon: MinusIcon },
  { type: "embed", label: "Embed / HTML", Icon: Code2 },
];

export default function BoxCanvas({
  root, theme, editable = true, selectedId, onSelectId, selectedIds, onSelectIds, onChange, onResized, minHeight = 600, breakpoint = "base",
}: {
  root: BoxNode;
  theme: SiteTheme;
  editable?: boolean;
  selectedId?: string | null;                     // single selection (kept for back-compat / simple callers)
  onSelectId?: (id: string | null) => void;
  selectedIds?: string[];                          // MULTI selection (marquee): takes precedence when provided
  onSelectIds?: (ids: string[]) => void;
  onChange: (root: BoxNode) => void;
  onResized?: (id: string, axis: "width" | "height") => void;
  minHeight?: number; // the page's minimum height (≈ a viewport); the page GROWS past this with content
  breakpoint?: Breakpoint; // active responsive breakpoint — edits at tablet/mobile write per-breakpoint overrides
}) {
  const [menuFor, setMenuFor] = useState<string | null>(null); // which box's actions dropdown is open
  const [menuAnchor, setMenuAnchor] = useState<{ top: number; left: number; bottom: number; right: number } | null>(null); // the ⋯ button's rect (PortalMenu positions off this)
  const closeMenu = () => { setMenuFor(null); setMenuAnchor(null); };
  const [resizing, setResizing] = useState(false);
  const [resizeCursor, setResizeCursor] = useState<string | null>(null); // cursor shown by the full-screen overlay while resizing (so it never disappears)
  const [dragId, setDragId] = useState<string | null>(null); // box being dragged (after the move threshold)
  const [dragGhost, setDragGhost] = useState<{ x: number; y: number; w: number; label: string } | null>(null); // floating preview that follows the cursor
  const [dropRect, setDropRect] = useState<{ left: number; top: number; width: number; height: number; inside: boolean } | null>(null); // insertion line / drop-inside highlight (viewport coords)
  const [snapLines, setSnapLines] = useState<{ left: number; top: number; width: number; height: number }[]>([]); // alignment guides shown while free-dragging a floating box (viewport coords)
  const dragArm = useRef<{ id: string; startX: number; startY: number; w: number; h: number; label: string } | null>(null); // armed on grip mousedown; upgrades to a real drag past the threshold
  const dragIdRef = useRef<string | null>(null);       // mirror of dragId for the document listeners
  const dropRef = useRef<{ parentId: string; index: number } | null>(null); // where a release would drop
  const dropWidthRef = useRef<string | null>(null); // width the dropped block should take (fill the line's leftover space)
  const dragPtRef = useRef<{ x: number; y: number } | null>(null); // latest cursor pos (rAF-batched during drag)
  const dragRaf = useRef(0);
  const rootRef = useRef(root); rootRef.current = root; // always-fresh tree for the drag listeners
  const [clip, setClip] = useState<BoxNode | null>(null); // copy/cut clipboard (a cloned subtree)
  const [marquee, setMarquee] = useState<{ x0: number; y0: number; x: number; y: number } | null>(null); // rubber-band rectangle (viewport coords) while marquee-selecting

  // Selection is a SET (marquee can pick many). selectedIds wins when provided; otherwise fall back to the
  // single selectedId. emitSelection keeps BOTH callbacks in sync so simple + multi callers both work.
  const selSet = new Set(selectedIds ?? (selectedId != null ? [selectedId] : []));
  const emitSelection = (ids: string[]) => { onSelectIds?.(ids); onSelectId?.(ids[0] ?? null); };
  const select = (id: string | null) => emitSelection(id ? [id] : []);

  // Style/geometry writes (resize, drag, nudge) go to the active breakpoint's override when not on base,
  // so tuning mobile/tablet never disturbs the desktop base. Structural ops (add/move/float/z) stay base.
  const writeBox = (tree: BoxNode, id: string, patch: Partial<BoxNode>): BoxNode =>
    breakpoint !== "base" ? updateBoxResponsive(tree, id, patch, breakpoint) : updateBox(tree, id, patch);

  // ── Floating layers (lift a section out of the flow to OVERLAP others) ──
  const floatNode = (id: string) => { const g = measureFloatGeom(rootRef.current, id); if (g) onChange(floatBox(rootRef.current, id, g.parentId, g.left, g.top, g.width, g.height)); };
  const unfloatNode = (id: string) => onChange(unfloatBox(rootRef.current, id));
  const toggleFloat = (id: string) => { const n = findByIdLocal(rootRef.current, id); if (n && isFloating(n)) unfloatNode(id); else floatNode(id); };
  const LAYER_OPS = { front: bringToFront, forward: bringForward, backward: sendBackward, back: sendToBack };
  const layer = (id: string, dir: keyof typeof LAYER_OPS) => onChange(LAYER_OPS[dir](rootRef.current, id));

  // ── Marquee (rubber-band) multi-select ──────────────────────────────────────────────────────────
  // Armed on any box-BODY / canvas mousedown; upgrades to a marquee only past a small drag threshold (so a
  // plain click still single-selects). On release, every box FULLY ENCLOSED by the rectangle is selected,
  // keeping only the OUTERMOST of any nested pair — so a big drag grabs whole sections, a tight drag inside
  // one section grabs its blocks. Structural row bands + the page root are never selectable.
  const startMarqueeArm = (e: React.MouseEvent) => {
    if (!editable) return;
    const x0 = e.clientX, y0 = e.clientY;
    let active = false;
    const onMove = (ev: MouseEvent) => {
      if (!active) { if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 5) return; active = true; document.body.style.userSelect = "none"; }
      setMarquee({ x0, y0, x: ev.clientX, y: ev.clientY });
    };
    const onUp = (ev: MouseEvent) => {
      document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = ""; setMarquee(null);
      if (!active) return; // never dragged → the single-select from mousedown stands
      const L = Math.min(x0, ev.clientX), R = Math.max(x0, ev.clientX), T = Math.min(y0, ev.clientY), B = Math.max(y0, ev.clientY);
      if (R - L < 6 && B - T < 6) return;
      const enclosed: string[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-box-id]"))) {
        const id = el.getAttribute("data-box-id");
        if (!id || id === rootRef.current.id) continue;
        const n = findByIdLocal(rootRef.current, id);
        if (!n || n.rowBand) continue; // never select structural bands
        const r = el.getBoundingClientRect();
        if (r.left >= L && r.right <= R && r.top >= T && r.bottom <= B) enclosed.push(id);
      }
      const outer = enclosed.filter((id) => !enclosed.some((o) => o !== id && isAncestor(rootRef.current, o, id)));
      emitSelection(outer);
    };
    document.addEventListener("mousemove", onMove); document.addEventListener("mouseup", onUp);
  };

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
      const ids = selectedIds ?? (selectedId != null ? [selectedId] : []);
      const id = ids[0] ?? null; // the primary (for single-target ops: nudge, reorder, layer, float)
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      const n = id ? findByIdLocal(root, id) : null;
      const rn = n ? resolveResponsive(n, breakpoint) : ({} as BoxNode); // effective (breakpoint-resolved) values
      const floating = !!n && isFloating(n);
      // Nudge step for a floating box, in % of its parent (2px, or 12px with Shift) — measured so it's an
      // even visual step at any parent size.
      const stepPct = (axis: "x" | "y") => {
        const info = id ? findParent(root, id) : null;
        const pe = info ? document.querySelector<HTMLElement>(`[data-box-id="${info.parent.id}"]`) : null;
        const size = pe ? (axis === "x" ? pe.getBoundingClientRect().width : pe.getBoundingClientRect().height) : 1000;
        return ((e.shiftKey ? 12 : 2) / Math.max(1, size)) * 100;
      };
      if (mod && k === "c") { if (id) { copyBox(id); e.preventDefault(); } }
      else if (mod && k === "x") { if (id) { cutBox(id); e.preventDefault(); } }
      else if (mod && k === "v") { if (clip) { pasteBox(id); e.preventDefault(); } }
      else if (mod && k === "d") { if (ids.length) { let next = root; for (const d of ids) next = duplicateBox(next, d); onChange(next); e.preventDefault(); } } // duplicate ALL selected
      else if (mod && k === "]" && id && floating) { onChange((e.shiftKey ? bringToFront : bringForward)(root, id)); e.preventDefault(); } // ]=forward, Shift+]=to front (floating only)
      else if (mod && k === "[" && id && floating) { onChange((e.shiftKey ? sendToBack : sendBackward)(root, id)); e.preventDefault(); }    // [=backward, Shift+[=to back (floating only)
      else if (e.altKey && k === "f" && id) { toggleFloat(id); e.preventDefault(); }                      // float ⇄ flow
      else if ((e.key === "Delete" || e.key === "Backspace") && ids.length) { let next = root; for (const d of ids) if (d !== root.id) next = removeBox(next, d); onChange(next); select(null); e.preventDefault(); } // delete ALL selected
      else if (e.key === "ArrowUp" && id) { if (floating) onChange(writeBox(root, id, { top: round1((rn.top ?? 0) - stepPct("y")) })); else onChange(moveBoxStep(root, id, -1)); e.preventDefault(); }
      else if (e.key === "ArrowDown" && id) { if (floating) onChange(writeBox(root, id, { top: round1((rn.top ?? 0) + stepPct("y")) })); else onChange(moveBoxStep(root, id, 1)); e.preventDefault(); }
      else if (e.key === "ArrowLeft" && id && floating) { onChange(writeBox(root, id, { left: round1((rn.left ?? 0) - stepPct("x")) })); e.preventDefault(); }
      else if (e.key === "ArrowRight" && id && floating) { onChange(writeBox(root, id, { left: round1((rn.left ?? 0) + stepPct("x")) })); e.preventDefault(); }
      else if (e.key === "Escape") { select(null); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editable, selectedId, selectedIds, root, clip, onChange, breakpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  // (The ⋯ actions menu's outside-click / Escape / scroll / flip-and-fit behaviour lives in <PortalMenu>.)

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
    if (n.type === "video") return "Video";
    if (n.type === "icon") return `Icon: ${n.icon ?? "Star"}`;
    if (n.type === "divider") return "Divider";
    if (n.type === "spacer") return "Spacer";
    if (n.type === "list") return "List";
    if (n.type === "embed") return "Embed";
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
  const computeDrop = (x: number, y: number, draggingId: string | null): Drop | null => {
    // NEAREST-SLOT while ARRANGING within the current parent: as long as the cursor is anywhere inside the
    // dragged block's own parent, snap to the nearest slot among its siblings (you don't have to aim at an
    // edge). The block floats with the cursor and lands packed next to its siblings — moving it OUT of the
    // parent (below) reparents it. This is what makes moving blocks around inside a section feel smooth.
    // (draggingId is null when INSERTING a NEW block from the palette — no self to exclude.)
    const dragInfo = draggingId ? findParent(rootRef.current, draggingId) : null;
    if (dragInfo) {
      const pEl = document.querySelector<HTMLElement>(`[data-box-id="${dragInfo.parent.id}"]`);
      if (pEl) {
        const pr = pEl.getBoundingClientRect();
        if (x >= pr.left && x <= pr.right && y >= pr.top && y <= pr.bottom) {
          const s = slotFromKids(pEl, directKids(pEl), x, y);
          // No moveWidth here — arranging within the same parent KEEPS the block's own (resized) width;
          // the siblings just pack/shrink to fit. moveWidth only applies when REPARENTing (below).
          return { target: { parentId: dragInfo.parent.id, index: s.index }, rect: s.rect };
        }
      }
    }
    const stack = typeof document.elementsFromPoint === "function" ? document.elementsFromPoint(x, y) : [];
    let hitEl: HTMLElement | null = null, hitId: string | null = null;
    for (const el of stack) {
      const boxEl = (el as HTMLElement).closest?.("[data-box-id]") as HTMLElement | null;
      if (!boxEl) continue;
      const id = boxEl.getAttribute("data-box-id");
      if (!id || (draggingId && (id === draggingId || isAncestor(rootRef.current, draggingId, id)))) continue;
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
    // rAF-batch so the floating ghost + insertion indicator track the cursor at frame rate (smooth), and
    // heavy hit-testing runs at most once per frame no matter how many mousemove events fire.
    dragPtRef.current = { x: ev.clientX, y: ev.clientY };
    if (dragRaf.current) return;
    dragRaf.current = requestAnimationFrame(() => {
      dragRaf.current = 0;
      const p = dragPtRef.current, id = dragIdRef.current;
      if (!p || !id) return;
      setDragGhost({ x: p.x, y: p.y, w: Math.min(arm.w, 260), label: arm.label });
      const hit = computeDrop(p.x, p.y, id);
      dropRef.current = hit?.target ?? null;
      dropWidthRef.current = hit?.moveWidth ?? null;
      setDropRect(hit?.rect ?? null);
    });
  };
  const onDragUp = () => {
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragUp);
    document.body.style.userSelect = "";
    if (dragRaf.current) { cancelAnimationFrame(dragRaf.current); dragRaf.current = 0; }
    const id = dragIdRef.current, p = dragPtRef.current;
    // Resolve the FINAL drop from the latest cursor position (a pending rAF may not have run yet).
    let target = dropRef.current, w = dropWidthRef.current;
    if (id && p) { const hit = computeDrop(p.x, p.y, id); target = hit?.target ?? target; w = hit ? (hit.moveWidth ?? null) : w; }
    if (id && target) {
      let next = moveBox(rootRef.current, id, target.parentId, target.index);
      if (w) next = updateBox(next, id, { width: w }); // take the line's leftover space so it fills, never wraps to a new row
      onChange(next);
    }
    dragArm.current = null; dragIdRef.current = null; dropRef.current = null; dropWidthRef.current = null; dragPtRef.current = null;
    setDragId(null); setDragGhost(null); setDropRect(null);
  };
  // ── Free-drag a FLOATING box (or Alt-drag a flow box to LIFT it into one) ──────────────────────────
  // Moves the box by rewriting its left/top (% of its positioning parent) so it floats smoothly on top of
  // everything and OVERLAPS its siblings. As it moves, its edges + centre SNAP to the edges/centres of
  // sibling boxes and the parent's centre, and bright guide lines show the alignment. rAF-batched.
  const startFreeDrag = (e: React.MouseEvent, node: BoxNode, lift: boolean) => {
    e.preventDefault(); e.stopPropagation();
    const id = node.id;
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    if (!el) return;
    const g = measureFloatGeom(rootRef.current, id);
    if (!g) return;
    if (lift && !isFloating(node)) onChange(floatBox(rootRef.current, id, g.parentId, g.left, g.top, g.width, g.height)); // lift the flow box onto its own layer, exactly where it sits
    const pEl = document.querySelector<HTMLElement>(`[data-box-id="${g.parentId}"]`);
    if (!pEl) return;
    const pr = pEl.getBoundingClientRect(), cs = getComputedStyle(pEl);
    const padL = parseFloat(cs.paddingLeft) || 0, padT = parseFloat(cs.paddingTop) || 0, padR = parseFloat(cs.paddingRight) || 0, padB = parseFloat(cs.paddingBottom) || 0;
    const ox = pr.left + padL, oy = pr.top + padT;                       // parent content-box origin (viewport)
    const cw = Math.max(1, pr.width - padL - padR), ch = Math.max(1, pr.height - padT - padB);
    const r0 = el.getBoundingClientRect(), bw = r0.width, bh = r0.height;
    const startPxX = (g.left / 100) * cw, startPxY = (g.top / 100) * ch; // current position in content px
    const startX = e.clientX, startY = e.clientY;
    // Snap targets in content-px: the parent's left/centre/right + top/middle/bottom, plus every sibling's.
    const sibs = directKids(pEl).filter((k) => k.getAttribute("data-box-id") !== id);
    const vt = [0, cw / 2, cw], ht = [0, ch / 2, ch];
    sibs.forEach((k) => { const kr = k.getBoundingClientRect(); const l = kr.left - ox, t = kr.top - oy; vt.push(l, l + kr.width / 2, l + kr.width); ht.push(t, t + kr.height / 2, t + kr.height); });
    const TH = 6; // snap threshold (px)
    setResizing(true); setResizeCursor("grabbing"); document.body.style.userSelect = "none";
    let raf = 0, pending: BoxNode | null = null;
    const flush = () => { raf = 0; if (pending) { onChange(pending); pending = null; } };
    const onMove = (ev: MouseEvent) => {
      let nx = startPxX + (ev.clientX - startX), ny = startPxY + (ev.clientY - startY);
      const guides: { left: number; top: number; width: number; height: number }[] = [];
      // Snap X: the box's left / centre / right against every vertical target; keep the closest within TH.
      let bestX = TH + 1, gx: number | null = null, snapX = nx;
      for (const t of vt) for (const off of [0, bw / 2, bw]) { const d = Math.abs((nx + off) - t); if (d < bestX) { bestX = d; snapX = t - off; gx = t; } }
      if (gx !== null) { nx = snapX; guides.push({ left: ox + gx, top: oy, width: 1, height: ch }); }
      let bestY = TH + 1, gy: number | null = null, snapY = ny;
      for (const t of ht) for (const off of [0, bh / 2, bh]) { const d = Math.abs((ny + off) - t); if (d < bestY) { bestY = d; snapY = t - off; gy = t; } }
      if (gy !== null) { ny = snapY; guides.push({ left: ox, top: oy + gy, width: cw, height: 1 }); }
      // Keep at least half the box within the parent so it's always grabbable (overhang is allowed for overlap).
      nx = Math.max(-bw / 2, Math.min(cw - bw / 2, nx));
      ny = Math.max(-bh / 2, Math.min(ch - bh / 2, ny));
      pending = writeBox(rootRef.current, id, { left: round1((nx / cw) * 100), top: round1((ny / ch) * 100) });
      setSnapLines(guides);
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onUp = () => {
      if (raf) { cancelAnimationFrame(raf); flush(); }
      setResizing(false); setResizeCursor(null); setSnapLines([]); document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove); document.addEventListener("mouseup", onUp);
  };

  const startDrag = (e: React.MouseEvent, node: BoxNode) => {
    if (!editable) return;
    // A floating box (or an Alt-drag on a flow box) moves FREELY on its own layer; a plain drag arranges in the flow.
    if (isFloating(node) || e.altKey) { startFreeDrag(e, node, !isFloating(node)); return; }
    e.preventDefault(); e.stopPropagation();
    const el = document.querySelector<HTMLElement>(`[data-box-id="${node.id}"]`);
    const r = el?.getBoundingClientRect();
    dragArm.current = { id: node.id, startX: e.clientX, startY: e.clientY, w: r?.width ?? 160, h: r?.height ?? 40, label: dragLabel(node) };
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragUp);
  };

  // ── Drag a NEW block from the palette onto the canvas (native HTML5 DnD) ──────────────────────────
  // The palette sets `application/x-box-block` = the block kind; the canvas shows the same drop line and
  // inserts a fresh node where you release (filling the line's leftover width when dropping beside).
  const PALETTE_TYPE = "application/x-box-block";
  const nodeForKind = (kind: string): BoxNode => blockForKind(kind);
  const onCanvasDragOver = (e: React.DragEvent) => {
    if (!editable || !e.dataTransfer.types.includes(PALETTE_TYPE)) return;
    e.preventDefault(); e.dataTransfer.dropEffect = "copy";
    const hit = computeDrop(e.clientX, e.clientY, null);
    setDropRect(hit?.rect ?? null);
  };
  const onCanvasDrop = (e: React.DragEvent) => {
    if (!editable) return;
    const kind = e.dataTransfer.getData(PALETTE_TYPE);
    if (!kind) return;
    e.preventDefault();
    const hit = computeDrop(e.clientX, e.clientY, null);
    const node = nodeForKind(kind);
    if (hit) { if (hit.moveWidth) node.width = hit.moveWidth; onChange(insertBox(rootRef.current, hit.target.parentId, hit.target.index, node)); }
    else onChange(insertBox(rootRef.current, rootRef.current.id, rootRef.current.children?.length ?? 0, node)); // empty canvas → append to the page
    setDropRect(null);
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

  // Resize a FLOATING box: plain edge-anchored size in its parent's %/px space (no flow neighbours to
  // respect). Right/bottom grow keeping the top-left fixed; left/top grow keeping the far edge fixed
  // (left/top compensate). Height is a min-height floor so the box still grows with content.
  const startResizeAbsolute = (e: React.MouseEvent, id: string, edge: Edge) => {
    e.preventDefault(); e.stopPropagation();
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    const info = findParent(rootRef.current, id);
    const node = findByIdLocal(rootRef.current, id);
    if (!el || !info || !node) return;
    const pEl = document.querySelector<HTMLElement>(`[data-box-id="${info.parent.id}"]`);
    if (!pEl) return;
    const hasE = edge.includes("e"), hasW = edge.includes("w"), hasS = edge.includes("s"), hasN = edge.includes("n");
    const pr = pEl.getBoundingClientRect(), cs = getComputedStyle(pEl);
    const padL = parseFloat(cs.paddingLeft) || 0, padT = parseFloat(cs.paddingTop) || 0, padR = parseFloat(cs.paddingRight) || 0, padB = parseFloat(cs.paddingBottom) || 0;
    const cw = Math.max(1, pr.width - padL - padR), ch = Math.max(1, pr.height - padT - padB);
    const r = el.getBoundingClientRect();
    const x0 = r.left - (pr.left + padL), y0 = r.top - (pr.top + padT), bw = r.width, bh = r.height;
    const startX = e.clientX, startY = e.clientY;
    setResizeCursor(cursorFor(edge)); setResizing(true);
    let raf = 0, pending: BoxNode | null = null;
    const flush = () => { raf = 0; if (pending) { onChange(pending); pending = null; } };
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      const patch: Partial<BoxNode> = {};
      if (hasE) { const w = Math.max(16, bw + dx); patch.width = `${round1((w / cw) * 100)}%`; }
      if (hasW) { const w = Math.max(16, bw - dx); patch.width = `${round1((w / cw) * 100)}%`; patch.left = round1(((x0 + (bw - w)) / cw) * 100); }
      if (hasS) { const h = Math.max(16, bh + dy); patch.minHeight = Math.round(h); patch.height = undefined; }
      if (hasN) { const h = Math.max(16, bh - dy); patch.minHeight = Math.round(h); patch.height = undefined; patch.top = round1(((y0 + (bh - h)) / ch) * 100); }
      pending = writeBox(rootRef.current, id, patch);
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onUp = () => {
      if (raf) { cancelAnimationFrame(raf); flush(); }
      setResizing(false); setResizeCursor(null);
      document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp);
      onResized?.(id, (hasS || hasN) && !hasE && !hasW ? "height" : "width");
    };
    document.addEventListener("mousemove", onMove); document.addEventListener("mouseup", onUp);
  };

  const startResize = (e: React.MouseEvent, id: string, edge: Edge) => {
    if (!editable) return;
    const node = findByIdLocal(root, id);
    if (node && isFloating(node)) { startResizeAbsolute(e, id, edge); return; } // floating boxes resize freely (no flow walls)
    e.preventDefault(); e.stopPropagation();
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
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
    const pct = (px: number) => `${Math.max(3, Math.min(100, (px / maxW) * 100)).toFixed(2)}%`;

    // Parent content-box origin — for measuring the section's edges and clamping every drag to the page.
    const prRect = pEl ? pEl.getBoundingClientRect() : null;
    const contentLeftPx = prRect ? prRect.left + padL : 0;
    const contentTopPx = prRect ? prRect.top + padT : 0;

    // Cross-axis anchor: pin alignment + current position/size so a centred/stretched box doesn't jump.
    let base = root, changed = false;
    const anchor: Partial<BoxNode> = {};
    if (prRect) {
      if ((hasE || hasW) && !parentRow) { anchor.alignSelf = "flex-start"; anchor.width = pct(W0); anchor.marginLeft = pxU(rect.left - contentLeftPx); } // width is CROSS (column) → pin horizontal
      if ((hasN || hasS) && parentRow) { anchor.alignSelf = "flex-start"; anchor.minHeight = Math.round(H0); anchor.marginTop = pxU(rect.top - contentTopPx); } // height is CROSS (row) → un-stretch so the floor governs + pin vertical
    }
    if (Object.keys(anchor).length) { base = writeBox(base, id, anchor); changed = true; }
    if (changed) onChange(base);

    const bn = resolveResponsive(findByIdLocal(base, id) ?? node, breakpoint); // effective margins at this breakpoint
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
    // The IMMEDIATE next section on this line (the closest sibling to the right) and its FIXED absolute
    // left. Resizing this section's right edge holds that neighbour EXACTLY in place — its margin-left
    // absorbs the change — so this section fills / opens the gap and the neighbour never moves.
    let nextSibId: string | null = null, nextLeftPx = maxW;
    if (parentRow && info) {
      for (const c of info.parent.children!) {
        if (c.id === id) continue;
        const e2 = document.querySelector<HTMLElement>(`[data-box-id="${c.id}"]`);
        if (!e2) continue;
        const r2 = e2.getBoundingClientRect();
        const cl = r2.left - contentLeftPx;
        if (r2.top < rect.bottom && rect.top < r2.bottom && cl >= startRightPx - 1 && cl < nextLeftPx) { nextLeftPx = cl; nextSibId = c.id; }
      }
    }

    setResizeCursor(cursorFor(edge));
    setResizing(true);
    let raf = 0; let pending: BoxNode | null = null;
    const flush = () => { raf = 0; if (pending) { onChange(pending); pending = null; } };
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      let tree = base;
      // ── WIDTH (EDGE-ANCHORED) ── the grabbed edge moves; the OPPOSITE edge of THIS section stays put.
      // RIGHT edge: grows/shrinks up to the next section's left; the NEXT section stays exactly where it is
      // (its margin-left absorbs the gap) — so you fill the gap and the neighbour never moves. LEFT edge:
      // shifts right with margin-left, keeping this section's right edge fixed (a gap opens on the left).
      if (hasE) {
        const right = Math.min(nextLeftPx, Math.max(startLeftPx + minWpx, startRightPx + dx));
        tree = writeBox(tree, id, { width: pct(right - startLeftPx) });
        if (nextSibId) tree = writeBox(tree, nextSibId, { marginLeft: Math.max(0, pxU(nextLeftPx - right)) }); // pin the neighbour in place
      }
      if (hasW) { const left = Math.min(startRightPx - minWpx, Math.max(flowX, startLeftPx + dx)); tree = writeBox(tree, id, { width: pct(startRightPx - left), marginLeft: Math.max(0, pxU(left - flowX)) }); }
      // ── HEIGHT ── the height you drag sets a MIN-HEIGHT (a floor), not a fixed height. The section HUGS
      // its content, so growing a child grows the section; shrinking below the content does nothing (the
      // content holds it up); and when children are empty, dragging the floor up/down grows/shrinks them.
      if (hasS) { const bot = Math.max(startTopPx + minHpx, startBotPx + dy); tree = writeBox(tree, id, { minHeight: Math.round(bot - startTopPx), height: undefined }); } // top fixed (margin-top unchanged), bottom moves
      if (hasN) { const top = Math.max(flowY, Math.min(startBotPx - minHpx, startTopPx + dy)); tree = writeBox(tree, id, { minHeight: Math.round(startBotPx - top), height: undefined, marginTop: Math.max(0, pxU(top - flowY)) }); } // bottom fixed, top moves (margin-top compensates)
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

  const addChild = (parentId: string, kind: BoxType | "row" | "grid" | "accordion") => {
    const parent = findByIdLocal(root, parentId);
    const node =
      kind === "row" ? createContainer("row")
      : kind === "grid" ? createGrid(3)
      : kind === "container" ? createContainer("row", { direction: "row", wrap: true, align: "stretch", clip: true, padding: 24 })
      : kind === "accordion" ? createComponent("accordion")
      : createElement(kind as Exclude<BoxType, "container">);
    // If the parent lays its blocks out horizontally (a section / wrapping row), the new block fills the
    // row's leftover width and WRAPS when full — so blocks sit BESIDE each other, never overflowing.
    if (parent && (parent.direction ?? "column") === "row") {
      const used = (parent.children ?? []).reduce((s, c) => s + widthPct(c.width), 0);
      node.width = used <= 88 ? `${Math.max(15, Math.round(100 - used))}%` : "100%";
    }
    // Append at end. We intentionally do NOT select the new box — the current selection (the parent you're
    // adding into) stays put, so you can keep adding.
    const index = parent?.children?.length ?? 0;
    onChange(insertBox(root, parentId, index, node));
    closeMenu();
  };

  const renderNode = (rawNode: BoxNode, parent: BoxNode | null): React.ReactNode => {
    // Resolve the box for the active breakpoint (base merged with tablet/mobile overrides). Same id/type/
    // children as the base, so selection + structure are unaffected — only style/geometry differ.
    const node = resolveResponsive(rawNode, breakpoint);
    const isSel = editable && selSet.has(node.id);
    const isSolo = isSel && selSet.size === 1; // per-box toolbar + resize handles only when EXACTLY one is selected
    const isRoot = parent === null;
    // Hidden on this breakpoint: skip entirely on the live site; in the editor keep it faintly visible so
    // it can still be selected and un-hidden.
    if (node.hidden && !editable) return null;
    const floating = isFloating(node) && !isRoot;
    const wrapStyle: React.CSSProperties = {
      position: floating ? "absolute" : "relative", // floating boxes are positioned inside their (relative) parent → they overlap the flow
      maxWidth: "100%", // Responsive Field Guide: never wider than the container (a fixed px width shrinks on a phone — no horizontal scrollbar). Editor MUST match the export.
      ...decorStyle(node), // border, shadow, per-corner radius, rotation
      ...(floating ? {} : marginCSS(node)), // margins are a FLOW concept; a floating box uses left/top instead
      opacity: node.hidden ? 0.35 : node.opacity !== undefined ? node.opacity / 100 : undefined, // hidden-on-this-device shows faint in the editor
      overflow: isClipped(node) ? "hidden" : undefined, // clip only when opted-in or rounded (never clip the selection chrome)
      // Floating: free-position on its own layer. Flow: fill+divide per childStyle. Root: fill the canvas +
      // define the global base unit (--box-u, rem-based) that every size scales off.
      ...(floating
        ? { left: `${node.left ?? 0}%`, top: `${node.top ?? 0}%`, width: sizeToCSS(node.width) ?? "40%", height: node.height ? sizeToCSS(node.height) : undefined, minHeight: node.minHeight, zIndex: node.zIndex ?? 1 }
        : parent ? childStyle(node, parent) : { width: "100%", minHeight, ["--box-u" as string]: baseUnit(node.baseFont ?? 10) }),
      ...backgroundStyle(node),
    };

    // Visible drag-to-resize handles on every edge + corner, so you can resize from any side.
    const resizeHandles = isSolo && editable && !isRoot ? (
      <>
        {HANDLES.map((h) => (
          <div key={h.edge} onMouseDown={(e) => startResize(e, node.id, h.edge)} aria-label={`Resize ${h.label}`} title={h.title} className={`absolute ${h.pos} ${h.cursor} bg-indigo-500 border-2 border-white shadow z-30`} />
        ))}
      </>
    ) : null;

    // Select on mousedown (fires before the inline editor's click-guard) and stop propagation so the
    // DEEPEST box under the pointer wins and the canvas-background deselect doesn't also fire. Also arm a
    // marquee from here — a drag on the box BODY rubber-band-selects instead of doing nothing.
    const onSelectDown = (e: React.MouseEvent) => { if (editable) { e.stopPropagation(); select(node.id); closeMenu(); startMarqueeArm(e); } };

    const isDragging = dragId === node.id;

    // ── container ──
    if (isContainer(node)) {
      const kids = node.children ?? [];
      return (
        <div
          key={node.id}
          data-box-id={node.id}
          id={node.anchor || undefined}
          onMouseDown={onSelectDown}
          style={{ ...containerStyle(node), ...wrapStyle, ...(isDragging ? { opacity: 0.4 } : {}) }}
          className={`${editable ? "transition-shadow" : ""} ${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : editable ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
        >
          {kids.map((c) => (
            <Fragment key={c.id}>{renderNode(c, node)}</Fragment>
          ))}
          {editable && kids.length === 0 && (
            // An empty block shows a non-interactive hint — drag a block from the palette (or use the ⋯ menu)
            // to fill it. It's a hint only; it does NOT add anything by itself.
            <div data-ph className="w-full flex flex-col items-center justify-center gap-1.5 py-6 text-gray-400 dark:text-gray-500 border border-dashed border-gray-300/80 dark:border-white/15 rounded-xl pointer-events-none" style={{ fontSize: u(11) }}>
              <span className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5" style={{ width: u(22), height: u(22) }}><Plus className="w-3.5 h-3.5" /></span>
              Drag a block here
            </div>
          )}
          {isSolo && <NodeToolbar node={node} isRoot={isRoot} />}
          {resizeHandles}
        </div>
      );
    }

    // ── element ──
    return (
      <div
        key={node.id}
        data-box-id={node.id}
        id={node.anchor || undefined}
        onMouseDown={onSelectDown}
        style={{ ...wrapStyle, ...(isDragging ? { opacity: 0.4 } : {}) }}
        className={`${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : editable ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
      >
        <ElementView node={node} theme={theme} editable={editable} onText={(v) => onChange(updateBox(root, node.id, { text: v }))} onSrc={(v) => onChange(updateBox(root, node.id, { src: v }))} onPatchNode={(patch) => onChange(updateBox(root, node.id, patch))} />
        {isSolo && <NodeToolbar node={node} isRoot={isRoot} />}
        {resizeHandles}
      </div>
    );
  };

  // Small floating structure toolbar for the selected node.
  function NodeToolbar({ node, isRoot }: { node: BoxNode; isRoot: boolean }) {
    // COLLAPSED bar: just a drag grip + a ⋯ button (tiny, never covers the box). All actions live in
    // the ⋯ dropdown, opened on demand, so you can always see and work on the element itself.
    const open = menuFor === node.id;
    // A menu row that runs its action then closes the menu.
    const Item = ({ onClick, Icon, label, danger, disabled, hint }: { onClick: () => void; Icon: typeof Copy; label: string; danger?: boolean; disabled?: boolean; hint?: string }) => (
      <MenuItem onClick={() => { onClick(); closeMenu(); }} Icon={Icon} label={label} danger={danger} disabled={disabled} hint={hint} />
    );
    return (
      <div className="absolute top-1.5 left-1.5 z-40 flex items-center gap-0.5 rounded-xl bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-sm px-1 py-1 shadow-lg ring-1 ring-white/10" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        {!isRoot && (
          <span
            onMouseDown={(e) => startDrag(e, node)}
            title={isFloating(node) ? "Drag to move this floating block freely" : "Drag to move (hold Alt to float it on top)"}
            aria-label="Drag to move"
            className="cursor-grab active:cursor-grabbing text-white/80 hover:text-white px-0.5"
          ><GripVertical className="w-3.5 h-3.5" /></span>
        )}
        <button
          onClick={(e) => {
            if (open) { closeMenu(); return; }
            const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setMenuAnchor({ top: r.top, left: r.left, bottom: r.bottom, right: r.right });
            setMenuFor(node.id);
          }}
          aria-label="Block actions" aria-expanded={open} title="Actions"
          className="p-1 rounded text-white/90 hover:bg-white/15"
        ><MoreVertical className="w-3.5 h-3.5" /></button>
        {open && menuAnchor && (
          <PortalMenu anchor={menuAnchor} onClose={closeMenu} ariaLabel="Block actions" width={200}>
            {isContainer(node) && (<>
              <MenuHeader>Add inside</MenuHeader>
              {ADD_ITEMS.map(({ type, label, Icon }) => <Item key={type} onClick={() => addChild(node.id, type)} Icon={Icon} label={label} />)}
              {!isRoot && <MenuSep />}
            </>)}
            {!isRoot && (isFloating(node) ? (<>
              <Item onClick={() => unfloatNode(node.id)} Icon={Layers} label="Return to flow" />
              <Item onClick={() => layer(node.id, "front")} Icon={BringToFront} label="Bring to front" />
              <Item onClick={() => layer(node.id, "forward")} Icon={ChevronUp} label="Bring forward" />
              <Item onClick={() => layer(node.id, "backward")} Icon={ChevronDown} label="Send backward" />
              <Item onClick={() => layer(node.id, "back")} Icon={SendToBack} label="Send to back" />
              <MenuSep />
            </>) : (<>
              <Item onClick={() => floatNode(node.id)} Icon={Layers} label="Float on top" />
              <MenuSep />
            </>))}
            {!isRoot && (<>
              <Item onClick={() => onChange(moveBoxStep(root, node.id, -1))} Icon={ChevronUp} label="Move up" />
              <Item onClick={() => onChange(moveBoxStep(root, node.id, 1))} Icon={ChevronDown} label="Move down" />
              <Item onClick={() => onChange(duplicateBox(root, node.id))} Icon={Copy} label="Duplicate" hint="Ctrl+D" />
              <Item onClick={() => copyBox(node.id)} Icon={Copy} label="Copy" hint="Ctrl+C" />
              <Item onClick={() => cutBox(node.id)} Icon={Scissors} label="Cut" hint="Ctrl+X" />
              <Item onClick={() => pasteBox(node.id)} Icon={ClipboardPaste} label="Paste" disabled={!clip} hint="Ctrl+V" />
              <Item onClick={() => { onChange(removeBox(root, node.id)); select(null); }} Icon={Trash2} label="Delete" danger hint="Del" />
            </>)}
          </PortalMenu>
        )}
      </div>
    );
  }

  return (
    <div onMouseDown={(e) => { if (editable) { select(null); startMarqueeArm(e); } }} onDragOver={onCanvasDragOver} onDrop={onCanvasDrop} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropRect(null); }} className="w-full">
      {/* Educo UI component styles + this site's tokens, injected once so any placed component (accordion, …)
          renders exactly as it will in the exported site. COMPONENT_CSS is scoped to `.eu-root`; each component
          wrapper carries that class, so styles never leak into the editor chrome. */}
      {treeHasComponent(root) && <style dangerouslySetInnerHTML={{ __html: tokensToCss(tokensFromTheme(theme), ".eu-root") + COMPONENT_CSS }} />}
      {renderNode(root, null)}
      {/* Marquee (rubber-band) selection rectangle. Portaled so it's never clipped. */}
      {marquee && createPortal(
        <div aria-hidden="true" style={{ position: "fixed", left: Math.min(marquee.x0, marquee.x), top: Math.min(marquee.y0, marquee.y), width: Math.abs(marquee.x - marquee.x0), height: Math.abs(marquee.y - marquee.y0), pointerEvents: "none", zIndex: 9996 }} className="border-2 border-dashed border-indigo-500 bg-indigo-500/10 rounded" />,
        document.body,
      )}
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
      {/* Alignment guides while free-dragging a floating box (snap to sibling / parent edges + centres). */}
      {snapLines.length > 0 && createPortal(
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9997 }}>
          {snapLines.map((g, i) => (
            <div key={i} style={{ position: "absolute", left: g.left, top: g.top, width: g.width, height: g.height, background: "#ec4899", boxShadow: "0 0 4px rgba(236,72,153,0.8)" }} />
          ))}
        </div>,
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

/** Does the tree contain any Educo UI component instance? (gates the one-time stylesheet injection) */
function treeHasComponent(node: BoxNode): boolean {
  if (node.type === "component") return true;
  return (node.children ?? []).some(treeHasComponent);
}

/**
 * An Educo UI component instance in the canvas. The wrapper carries `.eu-root` (so the injected component
 * stylesheet + this site's tokens apply) plus any per-instance token overrides as inline CSS variables, and
 * fills the width the section allocated to it. Content is edited INLINE (titles/bodies) via EditableText;
 * structure (add/remove items, variant, colours) is edited in the inspector. In edit mode every panel is
 * shown open so its body is editable; clicking a header doesn't collapse it.
 */
function ComponentView({ node, editable, onPatchNode }: { node: BoxNode; editable?: boolean; onPatchNode?: (patch: Partial<BoxNode>) => void }) {
  // Typography set on the wrapper cascades into the component's text (titles/bodies inherit family + size).
  const typo: React.CSSProperties = {};
  if (node.fontFamily) typo.fontFamily = node.fontFamily;
  if (node.fontSize) typo.fontSize = u(node.fontSize);
  if (node.fontWeight) typo.fontWeight = node.fontWeight;
  if (node.lineHeight) typo.lineHeight = node.lineHeight;
  if (node.letterSpacing != null) typo.letterSpacing = `${node.letterSpacing}px`;
  if (node.textTransform && node.textTransform !== "none") typo.textTransform = node.textTransform;
  if (node.italic) typo.fontStyle = "italic";
  const styleVars = { width: "100%", ...typo, ...(node.tokenOverrides ?? {}) } as React.CSSProperties;
  if (node.component === "accordion") {
    const items = node.accItems ?? [];
    const cls = "eu-accordion" + (node.variant ? ` eu-accordion${node.variant}` : "");
    const setItem = (id: string, patch: Partial<import("@/lib/box-model").AccordionItem>) =>
      onPatchNode?.({ accItems: items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });
    const adv = sanitizeCssDeclarations(node.advancedCss);
    return (
      <div className="eu-root" style={styleVars}>
        {adv ? <style dangerouslySetInnerHTML={{ __html: `[data-box-id="${node.id}"] .eu-accordion{${adv}}` }} /> : null}
        <div className={cls}>
          {items.map((it) => (
            <details key={it.id} className="eu-accordion__item" open={editable ? true : it.open} name={node.accMultiOpen ? undefined : `acc-${node.id}`}>
              <summary className="eu-accordion__header" onClick={editable ? (e) => e.preventDefault() : undefined}>
                {it.media ? <img className="eu-accordion__media" src={it.media} alt="" /> : null}
                <EditableText value={it.title} editable={editable} onChange={(v) => setItem(it.id, { title: v })} placeholder="Question" />
                {it.meta ? <span className="eu-accordion__meta">{it.meta}</span> : null}
              </summary>
              <div className="eu-accordion__body">
                <EditableText value={it.body} editable={editable} onChange={(v) => setItem(it.id, { body: v })} placeholder="Answer — click to edit" />
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  }
  return <div className="eu-root" style={styleVars} />;
}

function ElementView({ node, theme, editable, onText, onSrc, onPatchNode }: {
  node: BoxNode; theme: SiteTheme; editable?: boolean; onText: (v: string) => void; onSrc: (v: string) => void; onPatchNode?: (patch: Partial<BoxNode>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const align = node.textAlign ?? "left";
  switch (node.type) {
    case "component": return <ComponentView node={node} editable={editable} onPatchNode={onPatchNode} />;
    case "heading":
      return <h2 style={{ color: node.color || theme.text, fontSize: u(node.fontSize ?? 32), textAlign: align, width: "100%", ...typoStyle(node, theme.headingFont, 600) }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Heading" /></h2>;
    case "button":
      return <a href={node.href || "#"} target={node.newTab ? "_blank" : undefined} rel={node.newTab ? "noopener noreferrer" : undefined} onClick={(e) => editable && e.preventDefault()} className="inline-flex items-center gap-2 rounded-full" style={{ background: node.background ? colorToCSS(node.background) : theme.primary, color: node.color || "#fff", fontSize: u(node.fontSize ?? 14), padding: `${u(12)} ${u(24)}`, ...typoStyle(node, theme.bodyFont, 600) }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Button" /></a>;
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
    case "video": {
      const embed = videoEmbedSrc(node.src);
      return (
        <div className="relative w-full overflow-hidden rounded-lg bg-black/5" style={{ height: sizeToCSS(node.height) ?? 315 }}>
          {embed ? (
            <iframe src={embed} title="Video" className="w-full h-full" style={{ border: 0, pointerEvents: editable ? "none" : "auto" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : node.src ? (
            <video src={node.src} controls className="w-full h-full object-cover" style={{ pointerEvents: editable ? "none" : "auto" }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center gap-1.5 text-gray-400" style={{ fontSize: u(12) }}><VideoIcon className="w-4 h-4" /> Add a video URL (YouTube, Vimeo or .mp4) in the inspector</div>
          )}
        </div>
      );
    }
    case "icon": {
      const Ico = ICON_SET[node.icon ?? "Star"] ?? Star;
      return <div style={{ textAlign: align, color: node.color || theme.primary, width: "100%", lineHeight: 0 }}><Ico style={{ width: u(node.fontSize ?? 32), height: u(node.fontSize ?? 32), display: "inline-block" }} /></div>;
    }
    case "divider":
      return <div aria-hidden="true" style={{ width: "100%", borderTopWidth: node.borderWidth || 2, borderTopStyle: node.borderStyle ?? "solid", borderTopColor: node.color ? colorToCSS(node.color) : node.borderColor ? colorToCSS(node.borderColor) : theme.textMuted }} />;
    case "spacer":
      return <div aria-hidden="true" style={{ width: "100%", height: sizeToCSS(node.height) ?? "48px" }} />;
    case "list": {
      const items = node.listItems ?? [];
      const numbered = node.listStyle === "number";
      const style: React.CSSProperties = { color: node.color || theme.text, fontSize: u(node.fontSize ?? 16), textAlign: align, width: "100%", paddingLeft: u(22), listStyleType: numbered ? "decimal" : "disc", ...typoStyle(node, theme.bodyFont, 400) };
      return numbered
        ? <ol style={style}>{items.map((it, i) => <li key={i} style={{ marginBottom: u(4) }}>{it}</li>)}</ol>
        : <ul style={style}>{items.map((it, i) => <li key={i} style={{ marginBottom: u(4) }}>{it}</li>)}</ul>;
    }
    case "embed":
      return node.html
        ? <div className="w-full" style={{ height: sizeToCSS(node.height) ?? 260, pointerEvents: editable ? "none" : "auto" }} dangerouslySetInnerHTML={{ __html: node.html }} />
        : <div className="w-full flex items-center justify-center gap-1.5 text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg" style={{ height: sizeToCSS(node.height) ?? 120, fontSize: u(12) }}><Code2 className="w-4 h-4" /> Paste HTML / embed code in the inspector</div>;
    default:
      return <p style={{ color: node.color || theme.textMuted, fontSize: u(node.fontSize ?? 16), textAlign: align, width: "100%", ...typoStyle(node, theme.bodyFont, 400) }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Add text" /></p>;
  }
}
