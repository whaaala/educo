"use client";

/**
 * Recursive box-tree canvas — the Framer/Webflow-style editor surface. Renders a BoxNode tree with
 * flex OR grid layout, layered backgrounds (colour / gradient / image / overlay), and inline editing.
 * Structure editing (add child, move, duplicate, delete) lives on a small per-node toolbar; styling
 * lives in BoxInspector. Everything flows — boxes can never overlap. Controlled: edits flow up via
 * onChange(root); selection via selectedId/onSelectId.
 */

import { Fragment, useEffect, useLayoutEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Plus, ChevronUp, ChevronDown, Copy, Scissors, ClipboardPaste, Trash2, Upload, GripVertical, MoreVertical, Rows3, Columns3, Grid3x3, Type, Heading as HeadingIcon, MousePointerClick, Image as ImageIcon, Layers, BringToFront, SendToBack, Video as VideoIcon, Sparkles, Minus as MinusIcon, List as ListIcon, Code2, Star, Lock, LockOpen, Ungroup } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, type BoxType,
  containerStyle, childStyle, marginCSS, sizeToCSS, u, baseUnit, floatingReserve, floatStacksOnMobile, createContainer, createGrid, createElement, createComponent,
  updateBox, removeBox, insertBox, moveBoxStep, duplicateBox, moveBox, cloneBox, findParent, isAncestor, isContainer, widthPct,
  isFloating, floatBox, unfloatBox, groupBoxes, ungroupBoxes, bringToFront, sendToBack, bringForward, sendBackward,
  radiusCSS, isClipped, SHADOW_CSS, videoEmbedSrc, sanitizeCssDeclarations, expandScopedCss, ACCORDION_CSS_PARTS, itemOverrideCss, itemHasOverride, itemNumberVars, richBody, componentTextCss, componentBoxCss, bgImageLayer, bgShowThroughCss, resizeTopEdge, blockContainmentCss, alertToastCss, treeHasToast, accordionClasses, bandClasses, advancedCssStyle, alertActionsHTML, hugsContent, itemFloatContextCss, COMPONENT_ITEM_SEL, clampContentScale, MIN_CONTENT_SCALE, isMultiItemComponent, comfortableWidth, remLen, rootFontPx, isDefiniteLen, addItemAfter, duplicateItem, duplicateChildItem, removeItem, removeChildItem, moveItem, moveChildItem, updateItem, updateChildItem, ALERT_SEVERITY_ICON, alertPartInline, alertIconInline, collectAlertItemStyles,
  type Breakpoint, resolveResponsive, updateBoxResponsive, imageSizing, measureImage, treeItemEffectsCss, itemNeedsClass, floatZIndex,
} from "@/lib/box-model";
import { ICON_SET } from "./icons";
import { PortalMenu, MenuItem, MenuHeader, MenuSep } from "./ui";
import { blockForKind } from "@/lib/box-presets";
import { treeHoverCss, treeRevealCss } from "@/lib/interactions";
import { colorToCSS } from "@/components/shared/ColorPalettePicker";
import { COMPONENT_CSS } from "@/lib/educo-ui/components";
import { layoutCss } from "@/lib/educo-ui/layout";
import { CHROME_Z } from "@/lib/educo-ui/stacking";
import { iconSvg, onIconsLoaded, warmIcons, hasIcon } from "@/lib/educo-ui/icon-svg";
import { tokensFromTheme, tokensToCss } from "@/lib/educo-ui/tokens";
import { isRegistryComponent, renderComponent } from "@/lib/educo-ui/registry";
import { EditableText, ImageBox } from "@/components/website/sections/SectionKit";
import ItemCrudLayer, { type SelectedItem } from "@/components/website/box/ItemCrudLayer";

/** Layered background CSS: base fill (colour/gradient) → image → overlay; content renders above. */
function backgroundStyle(node: BoxNode): React.CSSProperties {
  const s: React.CSSProperties = {};
  const layers: string[] = [];
  const asGradient = (c: string) => { const css = colorToCSS(c); return css.startsWith("linear-gradient") ? css : `linear-gradient(${css}, ${css})`; };
  if (node.bgOverlay) layers.push(asGradient(node.bgOverlay));
  if (node.bgImage) layers.push(bgImageLayer(node.bgImage)); // gradient/pattern passes through; URL gets url("…")
  const baseGrad = node.background?.startsWith("gradient:");
  if (baseGrad && !node.bgImage) layers.push(colorToCSS(node.background!));
  if (layers.length) {
    s.backgroundImage = layers.join(", ");
    if (node.bgImage) {
      s.backgroundSize = node.bgTile ?? (node.bgSize ?? "cover");
      s.backgroundPosition = node.bgPosition ?? (node.bgTile ? "0 0" : "center");
      s.backgroundRepeat = node.bgRepeat ?? (node.bgTile ? "repeat" : "no-repeat");
      if (node.bgAttach) s.backgroundAttachment = node.bgAttach;
    } else { s.backgroundPosition = "center"; s.backgroundRepeat = "no-repeat"; }
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
/** Map a content-position value (start/center/end) to a flex alignment keyword. */
const flexPos = (v?: string): string => (v === "center" ? "center" : v === "end" ? "flex-end" : "flex-start");

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
  // Float at the block's CURRENT width so its measured height is the height it will actually have as a card
  // (changing the width on float would change the height and break the parent's reserved space). Resize after.
  // +1px safety margin: the frozen card must never be a hair NARROWER than the content it just measured (sub-pixel
  // rounding would otherwise wrap the last word to a new line that the card's clip then cuts off). Still hugs.
  const width = `${round1(((r.width + 1) / cw) * 100)}%`;
  return {
    parentId,
    left: ((r.left - (pr.left + padL)) / cw) * 100,
    top: ((r.top - (pr.top + padT)) / ch) * 100,
    width,
    height: r.height,
  };
}

/** Bounding box of several selected boxes, as a floating geom (left/top % of the ROOT content box + width % +
 *  height px) — where a GROUP wrapping them should sit so it appears exactly over them. Null if <2 measurable. */
export function measureGroupGeom(root: BoxNode, ids: string[]): { left: number; top: number; width: string; height: number } | null {
  if (typeof document === "undefined") return null;
  const picked = ids.filter((id) => id !== root.id);
  if (picked.length < 2) return null;
  const rootEl = document.querySelector<HTMLElement>(`[data-box-id="${root.id}"]`);
  if (!rootEl) return null;
  const pr = rootEl.getBoundingClientRect(), cs = getComputedStyle(rootEl);
  const padL = parseFloat(cs.paddingLeft) || 0, padT = parseFloat(cs.paddingTop) || 0;
  const cw = Math.max(1, pr.width - padL - (parseFloat(cs.paddingRight) || 0));
  const ch = Math.max(1, pr.height - padT - (parseFloat(cs.paddingBottom) || 0));
  const rects = picked.map((id) => document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)?.getBoundingClientRect()).filter(Boolean) as DOMRect[];
  if (rects.length < 2) return null;
  const minL = Math.min(...rects.map((r) => r.left)), minT = Math.min(...rects.map((r) => r.top));
  const maxR = Math.max(...rects.map((r) => r.right)), maxB = Math.max(...rects.map((r) => r.bottom));
  return { left: ((minL - (pr.left + padL)) / cw) * 100, top: ((minT - (pr.top + padT)) / ch) * 100, width: `${round1(((maxR - minL) / cw) * 100)}%`, height: maxB - minT };
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
  // The item selected INSIDE a component (RULE I). Kept here rather than in ComponentView because selecting the
  // block re-renders it in a way that remounts the component view — which threw this state away, so the first
  // click on an item never seemed to register.
  const [itemSel, setItemSel] = useState<{ boxId: string; id: string; parentId?: string } | null>(null);
  // Non-lucide icons (Brands/Google/Ionicons) load lazily — warm every icon in the tree so the canvas
  // paints them, and repaint when a source finishes loading.
  const [, iconTick] = useReducer((x) => x + 1, 0);
  useEffect(() => onIconsLoaded(() => iconTick()), []);
  useEffect(() => {
    const names: string[] = [];
    const walk = (v: unknown) => {
      if (typeof v === "string") { if (hasIcon(v)) names.push(v); }
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") Object.values(v as Record<string, unknown>).forEach(walk);
    };
    walk(root);
    if (names.length) warmIcons(names);
  }, [root]);
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
  // GROUP the selected boxes into one floating, movable, lockable unit — positioned over their measured
  // bounding box so it appears exactly where they already sit, then selected as a single group.
  const groupSelected = () => {
    const ids = [...selSet].filter((id) => id !== rootRef.current.id);
    const geom = measureGroupGeom(rootRef.current, ids);
    if (!geom) return;
    const next = groupBoxes(rootRef.current, ids, geom);
    onChange(next);
    const groupId = (next.children ?? []).filter(isFloating).slice(-1)[0]?.id; // the new group is root's last float
    if (groupId) emitSelection([groupId]);
  };
  const ungroupSelected = () => {
    const id = [...selSet][0];
    const n = id ? findByIdLocal(rootRef.current, id) : null;
    if (n?.group) { onChange(ungroupBoxes(rootRef.current, id)); emitSelection([]); }
  };
  const toggleFloat = (id: string) => { const n = findByIdLocal(rootRef.current, id); if (n && isFloating(n)) unfloatNode(id); else floatNode(id); };
  const LAYER_OPS = { front: bringToFront, forward: bringForward, backward: sendBackward, back: sendToBack };
  const layer = (id: string, dir: keyof typeof LAYER_OPS) => onChange(LAYER_OPS[dir](rootRef.current, id));

  // Auto-migrate OLD floating blocks (saved before floating cards got a DEFINITE height): measure each one's real
  // rendered height ONCE and store it as `height`, so its parent's reserved space matches and it no longer spills.
  // A block that HUGS ITS CONTENT is skipped (RULE L): it floats without a frozen height on purpose, so freezing
  // one here would re-break editing (the box stays at the old size and clips the new text) and would keep
  // re-triggering this measure→write→render cycle.
  const migratedFloats = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!editable) return;
    const stale: string[] = [];
    const walk = (n: BoxNode) => {
      if (isFloating(n) && !hugsContent(n) && !isDefiniteLen(n.height) && !migratedFloats.current.has(n.id)) stale.push(n.id);
      (n.children ?? []).forEach(walk);
    };
    walk(rootRef.current);
    if (!stale.length) return;
    const raf = requestAnimationFrame(() => {
      let next = rootRef.current; let changed = false;
      for (const id of stale) {
        migratedFloats.current.add(id);
        const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
        const h = el ? Math.round(el.getBoundingClientRect().height) : 0;
        if (h > 8) { next = updateBox(next, id, { height: remLen(h, rootFontPx()), minHeight: undefined }); changed = true; }
      }
      if (changed) onChange(next);
    });
    return () => cancelAnimationFrame(raf);
  }, [root, editable]); // converges: once migrated, a box has a px height + is in the ref, so it drops out of `stale` // eslint-disable-line react-hooks/exhaustive-deps

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
    const node = cloneBox(clip); // deep clone with FRESH ids — a whole group (container + children) copies as one unit
    // A FLOATING block/group pastes as a free-floating copy at the page root, NUDGED a little so it doesn't hide
    // the original. It stays selected + floating, so you drag it or arrow-nudge it into the position you want.
    if (isFloating(node)) {
      node.left = round1(Math.min(92, (node.left ?? 0) + 3));
      node.top = round1(Math.min(92, (node.top ?? 0) + 3));
      onChange(insertBox(rootRef.current, rootRef.current.id, rootRef.current.children?.length ?? 0, node));
      select(node.id);
      return;
    }
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
      else if (mod && k === "l") { if (ids.length) { const anyUnlocked = ids.some((d) => d !== root.id && !findByIdLocal(root, d)?.locked); let next = root; for (const d of ids) if (d !== root.id) next = updateBox(next, d, { locked: anyUnlocked }); onChange(next); e.preventDefault(); } } // lock/unlock ALL selected
      else if (mod && k === "g" && !e.shiftKey) { if (ids.length >= 2) { groupSelected(); e.preventDefault(); } }      // group selected
      else if (mod && k === "g" && e.shiftKey) { const g = id ? findByIdLocal(root, id) : null; if (g?.group) { ungroupSelected(); e.preventDefault(); } } // ungroup
      else if (e.altKey && k === "f" && id && !rn.locked) { toggleFloat(id); e.preventDefault(); }           // float ⇄ flow (blocked while locked)
      else if ((e.key === "Delete" || e.key === "Backspace") && ids.length) { let next = root; for (const d of ids) if (d !== root.id) next = removeBox(next, d); onChange(next); select(null); e.preventDefault(); } // delete ALL selected
      else if (e.key === "ArrowUp" && id && !rn.locked) { if (floating) onChange(writeBox(root, id, { top: round1((rn.top ?? 0) - stepPct("y")) })); else onChange(moveBoxStep(root, id, -1)); e.preventDefault(); }
      else if (e.key === "ArrowDown" && id && !rn.locked) { if (floating) onChange(writeBox(root, id, { top: round1((rn.top ?? 0) + stepPct("y")) })); else onChange(moveBoxStep(root, id, 1)); e.preventDefault(); }
      else if (e.key === "ArrowLeft" && id && floating && !rn.locked) { onChange(writeBox(root, id, { left: round1((rn.left ?? 0) - stepPct("x")) })); e.preventDefault(); }
      else if (e.key === "ArrowRight" && id && floating && !rn.locked) { onChange(writeBox(root, id, { left: round1((rn.left ?? 0) + stepPct("x")) })); e.preventDefault(); }
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
      // Only a block with a DEFINITE width (Full / Custom) fills the line's leftover space when reparented. A
      // HUGGING block (Fit / width auto) keeps hugging when moved — moving it must never blow it up to full width.
      const moved = findByIdLocal(rootRef.current, id);
      const hugs = !moved?.width || moved.width === "auto";
      if (w && !hugs) next = updateBox(next, id, { width: w });
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
    if (!editable || node.locked) return; // locked: position is frozen — no drag
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
    // A new hugging block (Fit / width auto) stays hugging where it lands; only definite-width blocks fill the line.
    if (hit) { const hugs = !node.width || node.width === "auto"; if (hit.moveWidth && !hugs) node.width = hit.moveWidth; onChange(insertBox(rootRef.current, hit.target.parentId, hit.target.index, node)); }
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
      // PAGE BOUNDS (RULE — every block, every component, now and in future): a floating box is positioned
      // freely, so its NEAR edges have to be clamped to its parent's content box: growing left/up stops at
      // that edge (the size is capped to the room actually there) and growing right stops at the parent's width,
      // so a floating block can never be resized to somewhere the user can no longer see or grab it.
      if (hasE) { const w = Math.min(cw - x0, Math.max(16, bw + dx)); patch.width = `${round1((w / cw) * 100)}%`; }
      if (hasW) { const w = Math.min(x0 + bw, Math.max(16, bw - dx)); patch.width = `${round1((w / cw) * 100)}%`; patch.left = round1(((x0 + (bw - w)) / cw) * 100); }
      // A floating card has a DEFINITE height (px) — so resizing it keeps the parent's reserved space exact.
      // The BOTTOM is deliberately not capped: the parent reserves height for its floats, so growing down just
      // makes the section (and the page) taller — nothing is ever hidden, unlike growing past the near edges.
      if (hasS) { const h = Math.max(16, bh + dy); patch.height = remLen(Math.round(h), rootFontPx()); patch.minHeight = undefined; }
      if (hasN) { const h = Math.min(y0 + bh, Math.max(16, bh - dy)); patch.height = remLen(Math.round(h), rootFontPx()); patch.minHeight = undefined; patch.top = round1(((y0 + (bh - h)) / ch) * 100); }
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

    // PAGE BOUNDS (RULE — every block and every component, the ones we have and every future one): a resize may
    // NEVER take a block outside the page canvas. The bottom/left/right edges are already bounded (the bottom
    // grows the page, which is in flow; the left stops at the flow origin; the right stops at the parent's
    // content width) — but the TOP edge grows by going NEGATIVE on margin-top, so without this floor it slides
    // up behind the toolbar and the user can no longer see or grab it. Measured in the same parent-content-box
    // space as the drag maths; when the page element can't be found we fall back to this block's own flow
    // origin, which can never escape either.
    const pageEl = document.querySelector<HTMLElement>(`[data-box-id="${rootRef.current.id}"]`);
    let pageTopPx: number | null = null;
    if (pageEl) {
      const pgRect = pageEl.getBoundingClientRect(), pgCs = getComputedStyle(pageEl);
      pageTopPx = pgRect.top + (parseFloat(pgCs.paddingTop) || 0) - contentTopPx;
    }

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
    // RULE G/O — a component (or button) must never be CROPPED by a resize. Down to the size its own content
    // needs, the box simply follows the drag. PAST that, the component's TEXT SCALES DOWN so the content still
    // fits, until it reaches MIN_CONTENT_SCALE — then the drag stops, so text never becomes unreadable and
    // nothing is ever hidden.
    //
    // The two NATURAL sizes are measured once here, so a drag stays smooth (no re-measuring per mouse-move).
    // Measuring them correctly is subtle: `scrollHeight` reports the BOX whenever the content already fits, and
    // the element may already be carrying a shrink from an earlier drag. Reading either of those straight gives
    // an inflated reference, which is what made the text shrink out of proportion and stopped the height ever
    // going back down to the content. So both are measured with the box unconstrained AND the scale neutralised.
    const selfSizing = node.type === "component" || node.type === "button";
    let naturalH = 0, naturalW = 0;
    if (selfSizing) {
      const inner = (el.querySelector(".eu-root > *:not(style)") as HTMLElement | null) ?? el;
      // Components declare `container-type: inline-size` for their container queries, which makes their inline
      // size INDEPENDENT of their contents — so max-content/min-content would report the padding and nothing
      // else (measured: 42px for a full alert). Neutralise it for the duration of the measurement, exactly as
      // blockContainmentCss does for a hug-to-content block at render time.
      const measureCss = document.createElement("style");
      measureCss.textContent = `[data-box-id="${node.id}"], [data-box-id="${node.id}"] *{container-type:normal !important}`;
      document.head.appendChild(measureCss);
      const prevElH = el.style.height, prevElMinH = el.style.minHeight;
      const prevW = inner.style.width, prevFs = inner.style.fontSize;
      inner.style.fontSize = "1em";      // undo any contentScale so we measure the TRUE natural size
      el.style.height = "auto";          // …and let the box follow its content rather than the other way round
      el.style.minHeight = "0";
      naturalH = Math.ceil(el.getBoundingClientRect().height);
      // Two width references, both with the scale neutralised: the content on ONE line (max-content) and the
      // narrowest it can legally get (min-content, its longest unbreakable word). The COMFORTABLE width sits
      // between them — wrapping to a tidy couple of lines. Narrower than that and the text scales rather than
      // rewrapping into a one-word-per-line column.
      inner.style.width = "max-content";
      const maxContentW = Math.ceil(inner.getBoundingClientRect().width);
      inner.style.width = "min-content";
      const minContentW = Math.ceil(inner.getBoundingClientRect().width);
      naturalW = comfortableWidth(maxContentW, minContentW);
      inner.style.width = prevW; inner.style.fontSize = prevFs;
      el.style.height = prevElH; el.style.minHeight = prevElMinH;
      measureCss.remove();
    }
    // Sizes are written in rem (field guide ②) — read the root font once per drag, never per mouse-move.
    const rootPx = rootFontPx();
    const minWpx = selfSizing ? Math.max(8, naturalW * MIN_CONTENT_SCALE) : Math.max(8, 0.03 * maxW);
    const minHpx = selfSizing ? Math.max(8, naturalH * MIN_CONTENT_SCALE) : 8;
    /** The text scale a box of `px` needs so `natural` px of content still fits (1 until it must shrink). */
    const fitScale = (px: number, natural: number) => (natural > 0 ? clampContentScale(px / natural) : 1);
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
        const scE = selfSizing ? fitScale(right - startLeftPx, naturalW) : 1;
        tree = writeBox(tree, id, { width: pct(right - startLeftPx), ...(selfSizing ? { contentScale: scE < 1 ? scE : undefined } : {}) });
        if (nextSibId) tree = writeBox(tree, nextSibId, { marginLeft: Math.max(0, pxU(nextLeftPx - right)) }); // pin the neighbour in place
      }
      if (hasW) {
        const left = Math.min(startRightPx - minWpx, Math.max(flowX, startLeftPx + dx));
        const scW = selfSizing ? fitScale(startRightPx - left, naturalW) : 1;
        tree = writeBox(tree, id, { width: pct(startRightPx - left), marginLeft: Math.max(0, pxU(left - flowX)), ...(selfSizing ? { contentScale: scW < 1 ? scW : undefined } : {}) });
      }
      // ── HEIGHT ── the height you drag sets a MIN-HEIGHT (a floor), not a fixed height. The section HUGS
      // its content, so growing a child grows the section; shrinking below the content does nothing (the
      // content holds it up); and when children are empty, dragging the floor up/down grows/shrinks them.
      // A SELF-PAINTING block (COMPONENT or BUTTON) resizes FREELY in height: it gets a DEFINITE height (px) so its
      // element (which FILLS the box via height:100%) actually grows/shrinks with the drag. A normal element/section
      // uses min-height (a floor it hugs up from) so it can still grow with its content.
      const isComp = node.type === "component" || node.type === "button";
      if (hasS) {
        const h = Math.round(Math.max(startTopPx + minHpx, startBotPx + dy) - startTopPx);
        const sc = fitScale(h, naturalH);
        tree = writeBox(tree, id, isComp ? { height: remLen(h, rootPx), minHeight: undefined, clip: undefined, contentScale: sc < 1 ? sc : undefined } : { minHeight: h, height: undefined });
      } // top fixed, bottom moves
      if (hasN) {
        // Edge-anchored: the BOTTOM stays put, the TOP moves. Dragging the top UP grows the block — even at the
        // canvas top — by letting margin-top go negative so the block extends upward (was clamped to the flow
        // origin, which pinned the first block and made top-resize do nothing).
        // Clamped to the PAGE TOP (see PAGE BOUNDS above) so growing upward can never push the block — and its
        // resize handle — off the page. Below the page top it is still free to grow up past its own section.
        // AT THE WALL the drag must not go dead (a block sitting flush against the page top is the common case
        // for a first block): whatever you drag past the page top is added to the BOTTOM instead, so the block
        // still grows by exactly the distance you dragged and still never leaves the page.
        // `resizeTopEdge` (box-model) owns the maths + the page clamp so the rule is unit-testable.
        const { top, height: h } = resizeTopEdge(startTopPx, startBotPx, dy, minHpx, pageTopPx ?? flowY);
        const mt = pxU(top - flowY); // may be negative → the block grows upward past its flow origin
        const scN = fitScale(h, naturalH);
        tree = writeBox(tree, id, isComp ? { height: remLen(h, rootPx), minHeight: undefined, clip: undefined, marginTop: mt, contentScale: scN < 1 ? scN : undefined } : { minHeight: h, height: undefined, marginTop: mt });
      }
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
    // "STACK on narrow": on mobile a (non-pinned) float drops back into normal flow — full-width, content-height —
    // so it can never clip its content or overflow its parent on a phone. Editor MUST match the export here.
    const stacked = breakpoint === "mobile" && !isRoot && floatStacksOnMobile(rawNode);
    const floating = isFloating(node) && !isRoot && !stacked;
    // SELF-PAINTING blocks (components AND buttons) draw their own visual (background/border/radius/shadow) on the
    // block element itself and FILL the box — so the wrapper stays transparent (no duplicate "shape behind" when the
    // block is resized) and the visual grows with the box while its content re-centres. Everything else paints on the wrapper.
    const selfPaint = node.type === "component" || node.type === "button";
    const wrapStyle: React.CSSProperties = {
      position: floating ? "absolute" : "relative", // floating boxes are positioned inside their (relative) parent → they overlap the flow
      maxWidth: "100%", // Responsive Field Guide: never wider than the container (a fixed px width shrinks on a phone — no horizontal scrollbar). Editor MUST match the export.
      // A COMPONENT's border/radius/shadow/background style the COMPONENT ITSELF (injected onto `.eu-<component>`),
      // not this wrapper — so the wrapper stays transparent and the controls act on the pill/card/quote directly.
      ...(selfPaint ? {} : decorStyle(node)), // border, shadow, per-corner radius, rotation
      ...(floating ? {} : marginCSS(node)), // margins are a FLOW concept; a floating box uses left/top instead
      opacity: node.hidden ? 0.35 : node.type === "component" ? undefined : node.opacity !== undefined ? node.opacity / 100 : undefined, // component opacity applies to the component element; hidden shows faint
      overflow: stacked || isSolo ? "visible" : isClipped(node) ? "hidden" : undefined, // selected → show the outside toolbar + resize handles (never clip them); stacked → grow with content; else clip only when opted-in/rounded
      // Floating: free-position on its own layer. Stacked (mobile): plain full-width flow block. Flow: fill+divide
      // per childStyle. Root: fill the canvas + define the global base unit (--box-u, rem-based).
      ...(floating
        ? { left: `${node.left ?? 0}%`, top: `${node.top ?? 0}%`, width: sizeToCSS(node.width), height: node.height ? sizeToCSS(node.height) : undefined, minHeight: node.minHeight, zIndex: floatZIndex(node) } // no width ⇒ auto ⇒ hug content (never a wide default box)
        : stacked
        ? { width: "100%" } // content-height (no fixed height/minHeight) so nothing is clipped
        : parent ? childStyle(node, parent) : {
            width: "100%", minHeight: Math.max(minHeight, floatingReserve(node, breakpoint)),
            ["--box-u" as string]: baseUnit(node.baseFont ?? 10),
            // A TOAST is `position:fixed`, the same rule the export emits. A transform on this page root makes
            // it the containing block for fixed descendants, so the toast pins to the PAGE frame here and to the
            // viewport on the published site — identical CSS, and it can never float over the editor chrome.
            // Applied only when the page actually has a toast, so nothing else changes rendering.
            ...(treeHasToast(node) ? { transform: "translate(0)" } : {}),
          }),
      ...(selfPaint ? {} : backgroundStyle(node)), // a component/button's background styles the block element, not this wrapper
      // Advanced CSS goes LAST, so it beats the generated styles above — which is exactly what the export does
      // (it appends the same declarations to the end of the node's own rule). Until this line, the canvas
      // applied Advanced CSS only inside the component branches: on a section, heading or text it did nothing
      // while you edited and then appeared on the published site.
      ...advancedCssStyle(node),
    };

    // Visible drag-to-resize handles on every edge + corner, so you can resize from any side.
    const resizeHandles = isSolo && editable && !isRoot && !node.locked ? (
      <>
        {HANDLES.map((h) => (
          <div key={h.edge} onMouseDown={(e) => startResize(e, node.id, h.edge)} aria-label={`Resize ${h.label}`} title={h.title} className={`absolute ${h.pos} ${h.cursor} bg-indigo-500 border-2 border-white shadow`} style={{ zIndex: CHROME_Z.handle, pointerEvents: "auto" }} />
        ))}
      </>
    ) : null;

    // Select on mousedown (fires before the inline editor's click-guard) and stop propagation so the
    // DEEPEST box under the pointer wins and the canvas-background deselect doesn't also fire. Also arm a
    // marquee from here — a drag on the box BODY rubber-band-selects instead of doing nothing.
    // A structural ROW BAND is never itself selectable: clicking its own area selects the block inside it (or
    // clears the selection when the row is empty/has several) — so the user always targets a real block, never
    // an "Editing: Row" wrapper.
    const onSelectDown = (e: React.MouseEvent) => {
      if (!editable) return;
      e.stopPropagation();
      if (node.rowBand) { const kids = node.children ?? []; select(kids.length === 1 ? kids[0].id : null); }
      else select(node.id);
      closeMenu(); startMarqueeArm(e);
    };

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
          style={{ ...containerStyle(node, breakpoint), ...wrapStyle, ...(isDragging ? { opacity: 0.4 } : {}) }}
          // Structural boxes (a row BAND, the page ROOT) are invisible scaffolding — never selectable — so they must
          // NOT show a hover outline: an indigo box around a full-width band/page reads as an empty "container wrapper".
          // Real, user-added containers (sections) still highlight on hover as drop targets.
          // `bandClasses` is the SAME function the export calls, so a contained band is contained here too —
          // canvas = export for layout, not only for styling. Only a band directly under the page root is a
          // SECTION: normalizeRowBands also makes bands inside every component, and they are not sections.
          className={`${bandClasses(node, parent === root)} ${editable ? "transition-shadow" : ""} ${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : (editable && !node.rowBand && !isRoot) ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
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
          {isSolo && <ChromeMirror blockId={node.id}><NodeToolbar node={node} isRoot={isRoot} />{resizeHandles}</ChromeMirror>}
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
        // Elements (non-containers) apply their own minHeight/height here (containers get it from containerStyle),
        // so dragging the TOP/BOTTOM edge actually resizes a heading / text / button / list. When a Content
        // position is set, the wrapper becomes a flex box so the content re-positions as the block grows.
        // RULE O: for a COMPONENT/BUTTON the stored height is a floor (see componentBoxCss) — the box grows if
        // its content later needs more room, instead of the content spilling out below it.
        style={{ ...wrapStyle,
          // A self-painting block is a COLUMN FLEX whose stored height is a FLOOR: the box grows if its content
          // needs more room (never a spill), while its `.eu-root` stretches to fill it (never an empty gap).
          ...(selfPaint ? { display: "flex", flexDirection: "column" } : {}),
          minHeight: selfPaint && node.height ? sizeToCSS(node.height) : (node.minHeight != null ? remLen(node.minHeight) : undefined),
          height: !selfPaint && node.height ? sizeToCSS(node.height) : (wrapStyle as React.CSSProperties).height,
          // Content position → the wrapper flexes so the content re-positions as the block grows. A BUTTON fills its
          // box itself and positions its own label, so it opts out here (otherwise the two would fight).
          ...((node.contentX || node.contentY) && node.type !== "button" ? { display: "flex", flexDirection: "column", justifyContent: flexPos(node.contentY), alignItems: flexPos(node.contentX) } : {}),
          ...(isDragging ? { opacity: 0.4 } : {}) }}
        className={`${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : editable ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
      >
        <ElementView node={node} theme={theme} editable={editable} breakpoint={breakpoint} onText={(v) => onChange(updateBox(root, node.id, { text: v }))} onSrc={(v) => onChange(updateBox(root, node.id, { src: v }))} onPatchNode={(patch) => onChange(updateBox(root, node.id, patch))} itemSel={itemSel} setItemSel={setItemSel} />
        {isSolo && <ChromeMirror blockId={node.id}><NodeToolbar node={node} isRoot={isRoot} />{resizeHandles}</ChromeMirror>}
      </div>
    );
  };

  /**
   * A fixed MIRROR of a block's box, portaled above the page, holding that block's own chrome.
   *
   * The toolbar and the resize handles used to render INSIDE the block's wrapper, which put them down in the
   * page's stacking world — and there the chrome ladder has no say at all, because a wrapper with a z-index
   * creates a stacking context and everything inside it is trapped underneath. So a second floating block
   * raised above the first covered the FIRST one's controls: you could see the block you had selected and
   * could not reach the toolbar that deletes it or the handles that resize it. The z-index on the handles was
   * present, correct, and completely inert — the failure this project keeps meeting.
   *
   * The mirror is a `position: fixed` box at the block's exact rect, so every child keeps the offsets it
   * already had (`-top-1`, `top-full`, `left-1/2`) and the markup did not have to change. It carries no
   * pointer events itself, so the page underneath stays clickable; each child takes them back.
   *
   * It exists only for the SELECTED block, so a page of two hundred blocks pays for one.
   */
  function ChromeMirror({ blockId, children }: { blockId: string; children: ReactNode }) {
    const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
    const [, remeasure] = useReducer((n: number) => n + 1, 0);

    // Scrolling and window resizing move the block without re-rendering anything here, so they have to ask.
    useEffect(() => {
      const onMove = () => remeasure();
      window.addEventListener("scroll", onMove, true);
      window.addEventListener("resize", onMove);
      return () => { window.removeEventListener("scroll", onMove, true); window.removeEventListener("resize", onMove); };
    }, []);

    // Deliberately NO dependency array: a block's geometry changes without any prop of this component changing
    // (typing a longer heading, a reflow, a resize gesture in progress). It therefore MUST only call setBox
    // when something actually moved — a fresh object every pass would re-render, re-run this, and loop.
    useEffect(() => {
      const el = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(blockId)}"]`);
      const r = el?.getBoundingClientRect();
      const next = r ? { left: r.left, top: r.top, width: r.width, height: r.height } : null;
      setBox((prev) => {
        if (!prev || !next) return prev === next ? prev : next;
        const near = (a: number, b: number) => Math.abs(a - b) < 0.5;
        return near(prev.left, next.left) && near(prev.top, next.top)
          && near(prev.width, next.width) && near(prev.height, next.height) ? prev : next;
      });
    });

    if (!box) return null;
    return createPortal(
      <div
        style={{ position: "fixed", ...box, pointerEvents: "none", zIndex: CHROME_Z.handle }}
      >{children}</div>,
      document.body,
    );
  }

  // Small floating structure toolbar for the selected node.
  function NodeToolbar({ node, isRoot }: { node: BoxNode; isRoot: boolean }) {
    // COLLAPSED bar: just a drag grip + a ⋯ button (tiny, never covers the box). All actions live in
    // the ⋯ dropdown, opened on demand, so you can always see and work on the element itself.
    const open = menuFor === node.id;
    // A menu row that runs its action then closes the menu.
    const Item = ({ onClick, Icon, label, danger, disabled, hint }: { onClick: () => void; Icon: typeof Copy; label: string; danger?: boolean; disabled?: boolean; hint?: string }) => (
      <MenuItem onClick={() => { onClick(); closeMenu(); }} Icon={Icon} label={label} danger={danger} disabled={disabled} hint={hint} />
    );
    // The toolbar sits ABOVE the box (outside it) so it NEVER covers the content — important now that blocks hug
    // their content and can be small. When the box is near the canvas top (no room above), it flips to BELOW.
    const barRef = useRef<HTMLDivElement>(null);
    const [below, setBelow] = useState(false);
    useEffect(() => {
      const box = barRef.current?.parentElement;
      if (!box) return;
      const canvasTop = document.querySelector(`[data-box-id="${rootRef.current.id}"]`)?.getBoundingClientRect().top ?? 0;
      setBelow(box.getBoundingClientRect().top < canvasTop + 36); // within 36px of the canvas top → drop the bar below the box instead of over the app header
    });
    // A group of controls needs to say so: without a role and a name a screen-reader user meets a run of
    // loose buttons with no indication they belong to the block that was just selected. The item CRUD bar
    // next door already got this right — this one had nothing.
    return (
      <div ref={barRef} role="toolbar" aria-label="Block toolbar" style={{ zIndex: CHROME_Z.toolbar, pointerEvents: "auto" }} className={`absolute left-0 w-max max-w-none ${below ? "top-full mt-1" : "bottom-full mb-1"} flex items-center gap-0.5 rounded-xl bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-sm px-1 py-1 shadow-lg ring-1 ring-white/10`} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        {!isRoot && !node.locked && (
          <span
            onMouseDown={(e) => startDrag(e, node)}
            title={isFloating(node) ? "Drag to move this floating block freely" : "Drag to move (hold Alt to float it on top)"}
            aria-label="Drag to move"
            className="cursor-grab active:cursor-grabbing text-white/80 hover:text-white px-0.5"
          ><GripVertical className="w-3.5 h-3.5" /></span>
        )}
        {node.locked && !isRoot && (
          <span className="flex items-center gap-1 rounded-lg bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-0.5 whitespace-nowrap" title="Locked — position & size are frozen. Click the lock to unlock.">
            <Lock className="w-3 h-3" aria-hidden="true" /> Locked
          </span>
        )}
        {!isRoot && (
          <button
            onClick={() => onChange(updateBox(rootRef.current, node.id, { locked: !node.locked }))}
            aria-label={node.locked ? "Unlock position and size" : "Lock position and size"}
            aria-pressed={!!node.locked}
            title={node.locked ? "Unlock (Ctrl+L) — allow moving & resizing again" : "Lock (Ctrl+L) — freeze position & size"}
            className="p-1 rounded text-white/90 hover:bg-white/15"
          >{node.locked ? <LockOpen className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}</button>
        )}
        {isFloating(node) && !isRoot && (
          // Clear signal that this block is on the OVERLAY layer (floats above flowing content) — explains why
          // newly-added blocks appear beneath it, and pairs with the front/back order controls in the inspector.
          <span className="flex items-center gap-1 rounded-lg bg-indigo-500 text-white text-[10px] font-semibold px-1.5 py-0.5 whitespace-nowrap" title="On the overlay layer — floats above flowing content. Use Front/back order to layer it.">
            <Layers className="w-3 h-3" aria-hidden="true" /> Floating
          </span>
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
            {node.group && (<>
              <Item onClick={() => ungroupSelected()} Icon={Ungroup} label="Ungroup" hint="Ctrl+Shift+G" />
              <MenuSep />
            </>)}
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
    <div onMouseDown={(e) => { if (editable) { select(null); startMarqueeArm(e); } }} onDragOver={onCanvasDragOver} onDrop={onCanvasDrop} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropRect(null); }} className="w-full eu-tokens">
      {/* Educo UI component styles + this site's tokens, injected once so any placed block renders exactly as it
          will in the exported site.

          THE TOKENS AND THE COMPONENT STYLES NEED DIFFERENT SCOPES, and conflating them broke canvas = export.
          COMPONENT_CSS must stay on `.eu-root` (only component wrappers carry it) or component styling would
          leak into the editor chrome. The TOKENS must reach further: the design-system trees (Card, Quote, Stat,
          Badge, Rating) are ordinary containers that paint themselves with `var(--eu-color-*)`, and they never
          carry `.eu-root`. Scoped to `.eu-root` alone, a Tinted card measured `rgba(0,0,0,0)` on the canvas
          while the EXPORT rendered it correctly — the export emits its tokens at `:root`. So the canvas root
          carries `.eu-tokens` and the variables are defined for both. */}
      {treeUsesEducoUi(root) && <style dangerouslySetInnerHTML={{ __html: tokensToCss(tokensFromTheme(theme), ".eu-root, .eu-tokens") + COMPONENT_CSS }} />}
      {/* The LAYOUT layer, and unlike the component styles it is NOT gated on the tree using Educo UI: a band is
          a structural container, so a page made only of plain sections still needs it. Scoped to both roots for
          the same reason the tokens are — the canvas root carries `.eu-tokens`, never `.eu-root`. */}
      <style dangerouslySetInnerHTML={{ __html: layoutCss(".eu-root, .eu-tokens") }} />
      {/* Hover & focus (Interactions 1a). One stylesheet for the whole tree, scoped per block by its
          `data-box-id`, because a hover cannot be expressed as an inline style. The rules come from the SAME
          emitter the export uses, so what you hover in the builder is what a visitor gets. */}
      {(() => {
        const scopeFor = (id: string) => `[data-box-id="${id}"]`;
        // A COMPONENT staggers its ITEMS, not its wrapper's direct children — those are a <style> tag and the
        // component itself. Same map the export uses, so the builder staggers what the published page does.
        const staggerFor = (n: { component?: string }) => (n.component ? COMPONENT_ITEM_SEL[n.component] : undefined);
        const css = treeHoverCss(root, scopeFor)
          + treeRevealCss(root, scopeFor, staggerFor)
          + treeItemEffectsCss(root);
        return css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null;
      })()}
      {renderNode(root, null)}
      {/* Marquee (rubber-band) selection rectangle. Portaled so it's never clipped. */}
      {marquee && createPortal(
        <div aria-hidden="true" style={{ position: "fixed", left: Math.min(marquee.x0, marquee.x), top: Math.min(marquee.y0, marquee.y), width: Math.abs(marquee.x - marquee.x0), height: Math.abs(marquee.y - marquee.y0), pointerEvents: "none", zIndex: CHROME_Z.marquee }} className="border-2 border-dashed border-indigo-500 bg-indigo-500/10 rounded" />,
        document.body,
      )}
      {/* While resizing, a transparent full-viewport overlay holds the resize cursor so it stays crisp and
          never disappears as the box reflows under the pointer. */}
      {resizing && resizeCursor && createPortal(
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: CHROME_Z.veil, cursor: resizeCursor }} />,
        document.body,
      )}
      {/* Drop indicator: a bright insertion line between siblings, or a dashed highlight over an empty
          container you're dropping into. Portaled to <body> so it's never clipped. */}
      {dropRect && createPortal(
        <div
          aria-hidden="true"
          style={{ position: "fixed", left: dropRect.left, top: dropRect.top, width: dropRect.width, height: dropRect.height, pointerEvents: "none", zIndex: CHROME_Z.dropZone }}
          className={dropRect.inside ? "rounded-lg outline outline-2 outline-dashed outline-indigo-500 bg-indigo-500/10" : "rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.9)]"}
        />,
        document.body,
      )}
      {/* Alignment guides while free-dragging a floating box (snap to sibling / parent edges + centres). */}
      {snapLines.length > 0 && createPortal(
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: CHROME_Z.snapGuide }}>
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
          style={{ position: "fixed", left: dragGhost.x + 14, top: dragGhost.y + 14, width: dragGhost.w, pointerEvents: "none", zIndex: CHROME_Z.dragGhost }}
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
/**
 * Does anything on this page need the Educo UI stylesheet?
 *
 * This used to ask only "is there a `component` node", which was too narrow: the design-system TREES (Card,
 * Quote, Stat, Badge, Rating) are containers, and they paint themselves with `var(--eu-color-*)` tokens. On a
 * page holding only trees the stylesheet was never injected, so the ramp tokens did not exist — measured in the
 * browser, `--eu-color-primary-50` came back empty and a Tinted card rendered with no background at all. Only
 * the handful of tokens that globals.css happens to define were resolving.
 */
function treeUsesEducoUi(node: BoxNode): boolean {
  if (node.type === "component" || node.preset) return true;
  return (node.children ?? []).some(treeUsesEducoUi);
}

/**
 * COMPONENT SIZING RULE (applies to EVERY component we have and every one we add):
 * a component must be resizable from ALL FOUR SIDES of its block — dragging the LEFT/RIGHT edges changes the
 * component's WIDTH and dragging the TOP/BOTTOM edges changes its HEIGHT. The drag writes width/height onto the
 * node; componentBoxCss turns that into width:100% / height:100% on the component's own `.eu-*` element. For
 * those percentages to resolve, EVERY wrapper between the node box and the component element must itself be a
 * definite-size box — so any wrapper a component branch introduces MUST carry this style. `display:grid` makes
 * the single child stretch in BOTH axes when the box is sized, and hug its content when the box is auto.
 * (Regression-guarded for every component by tests/components/website/component-resize.test.tsx.)
 */
const COMPONENT_FILL: React.CSSProperties = { height: "100%", display: "grid" };

/**
 * An Educo UI component instance in the canvas. The wrapper carries `.eu-root` (so the injected component
 * stylesheet + this site's tokens apply) plus any per-instance token overrides as inline CSS variables, and
 * fills the width the section allocated to it. Content is edited INLINE (titles/bodies) via EditableText;
 * structure (add/remove items, variant, colours) is edited in the inspector. In edit mode every panel is
 * shown open so its body is editable; clicking a header doesn't collapse it.
 */
/** Parse the inline style string the model builds for a part into a React style object. */
function inlineToStyle(css: string): React.CSSProperties | undefined {
  if (!css) return undefined;
  const out: Record<string, string> = {};
  for (const d of css.split(";")) {
    const i = d.indexOf(":");
    if (i < 0) continue;
    const prop = d.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (prop) out[prop] = d.slice(i + 1).trim();
  }
  return out as React.CSSProperties;
}

/**
 * One alert row ON THE CANVAS, as REACT — deliberately mirroring `alertItemHTML` in lib/box-model.ts, which
 * still renders the same markup for the EXPORT (canvas === export).
 *
 * It is React rather than injected HTML for one reason: a contenteditable inside `dangerouslySetInnerHTML`
 * cannot reliably take focus from a mouse press inside the canvas, so clicking an item's text did nothing. The
 * Accordion already solved this by rendering its items as React and editing them with the shared
 * `EditableText`; this follows exactly that pattern, so both components behave identically (RULE F).
 * Sub-items recurse through the same component, so no nesting level is less editable than the top (RULE I).
 */
function AlertItemView({ item, sev, treat, dismiss, editable, parentId, onEdit, onFloatDrag, floatsActive, axes = [], form = "inline" }: {
  item: import("@/lib/box-model").ComponentItem;
  sev: string; treat: string; dismiss: boolean; editable?: boolean; parentId?: string;
  /** The look axes and the form factor, so the canvas renders the SAME classes and rules as the export. */
  axes?: string[]; form?: string;
  onEdit: (id: string, patch: Partial<import("@/lib/box-model").ComponentItem>, parentId?: string) => void;
  /** RULE N — drag a detached item to position it (the inspector's X/Y inputs are the keyboard path). */
  onFloatDrag?: (e: React.PointerEvent, item: import("@/lib/box-model").ComponentItem) => void;
  floatsActive?: boolean;
}) {
  const iconName = item.icon || ALERT_SEVERITY_ICON[sev] || "Info";
  const svg = iconName ? iconSvg(iconName) : "";
  // The axes belong here too. Leaving them out meant a fine-tuned alert looked right in the export and plain
  // in the builder — the exact canvas-vs-export drift this component has been bitten by three times.
  const cls = ["eu-alert", `eu-alert--${sev}`, treat ? `eu-alert${treat}` : "", ...axes.map((a) => `eu-alert${a}`), `eu-al-${item.id}`].filter(Boolean).join(" ");
  const role = sev === "danger" || sev === "warning" ? "alert" : "status";
  const set = (patch: Partial<import("@/lib/box-model").ComponentItem>) => onEdit(item.id, patch, parentId);
  return (
    <div
      className={cls}
      role={role}
      data-eu-item={item.id}
      data-eu-parent={parentId}
      style={editable && item.float && floatsActive ? { cursor: "move" } : undefined}
      onPointerDown={editable && item.float && floatsActive && onFloatDrag ? (e) => onFloatDrag(e, item) : undefined}
    >
      {/* A plain <img>, deliberately: this is a user upload, often a data: URL that next/image cannot
          process, and the export emits a plain <img> too — which canvas = export requires us to match. */}
      {item.media ? <img className="eu-alert__media" src={item.media} alt={item.mediaAlt ?? ""} loading="lazy" decoding="async" /> : null}
      {svg ? <span className="eu-alert__icon" aria-hidden="true" style={inlineToStyle(alertIconInline(item))} dangerouslySetInnerHTML={{ __html: svg }} /> : null}
      <div className="eu-alert__content">
        {(item.title || editable) && (
          <div className="eu-alert__title" style={inlineToStyle(alertPartInline(item.headerStyle))}>
            <EditableText value={item.title} editable={editable} onChange={(v) => set({ title: v })} placeholder="Title" />
          </div>
        )}
        {(item.body || editable) && (
          <div className="eu-alert__body" style={inlineToStyle(alertPartInline(item.bodyStyle))}>
            {editable
              ? <EditableText value={item.body} editable onChange={(v) => set({ body: v })} placeholder="Message — click to edit" />
              : <span dangerouslySetInnerHTML={{ __html: richBody(item.body) }} />}
          </div>
        )}
        {/* Meta renders only when it HAS a value — exactly like the export. Rendering an empty one in the
            editor put a stray little box on the right of every alert (`.eu-alert__meta` is margin-start:auto),
            which is canvas/export divergence AND visual noise. It is added from the inspector's Meta field. */}
        {item.meta && (
          <span className="eu-alert__meta">
            <EditableText value={item.meta} editable={editable} onChange={(v) => set({ meta: v })} placeholder="" />
          </span>
        )}
        {(item.children ?? []).length > 0 && (
          <div className="eu-alert__sub">
            {(item.children ?? []).map((c) => (
              <AlertItemView key={c.id} item={c} sev={sev} treat={treat} dismiss={false} editable={editable} parentId={item.id} onEdit={onEdit} onFloatDrag={onFloatDrag} floatsActive={floatsActive} axes={axes} form={form} />
            ))}
          </div>
        )}
      </div>
      {/* Actions come from the SHARED emitter the export uses, so the builder cannot drift from the page. */}
      {(() => {
        const html = alertActionsHTML(item.actions, form);
        return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null;
      })()}
      {dismiss && <button type="button" className="eu-alert__close" aria-label="Dismiss" onClick={(e) => e.preventDefault()}>×</button>}
    </div>
  );
}

/**
 * ON-CANVAS ITEM CRUD (RULE I) — the behaviour half, shared by EVERY component (now and in future).
 *
 * Works purely off the `data-eu-item` / `data-eu-part` attributes a component's markup stamps in edit mode
 * (see `itemRootAttrs` in lib/box-model.ts), so it needs to know nothing about any particular component — and
 * it reaches EVERY nesting level, because those attributes are emitted recursively for sub-items too.
 *
 * Text parts are committed on BLUR, never on every keystroke: the item markup is injected as HTML, so writing
 * on each input would re-render the string under the caret and jump it to the start.
 */
function useItemCrud(
  node: BoxNode,
  onPatchNode?: (patch: Partial<BoxNode>) => void,
  itemSel?: { boxId: string; id: string; parentId?: string } | null,
  setItemSel?: (v: { boxId: string; id: string; parentId?: string } | null) => void,
) {
  // The selection lives in BoxCanvas (see itemSel there) so it survives this component being remounted.
  const selected: SelectedItem | null = itemSel && itemSel.boxId === node.id ? { id: itemSel.id, parentId: itemSel.parentId } : null;
  const setSelected = (v: SelectedItem | null) => setItemSel?.(v ? { boxId: node.id, ...v } : null);
  const nodeRef = useRef(node); nodeRef.current = node;
  // Clicking away from this component clears the item selection, so the toolbar never lingers over work you
  // have moved on from. Presses INSIDE the component (another item, a text part) or on the toolbar itself are
  // ignored — the toolbar stops its own presses, and it lives outside the host, hence the explicit check.
  const hostRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!selected) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (hostRef.current?.contains(t)) return;                       // still inside this component
      if (t.closest('[role="toolbar"][aria-label="Edit this item"]')) return; // the item toolbar itself
      setSelected(null);
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, [selected]);

  // Pressing anywhere inside an item selects THAT item (the innermost one, so a sub-item wins over its parent).
  // This is deliberately MOUSEDOWN, not click: the block's own drag handling means a real click event never
  // reaches here (a synthetic one does, which is what made this look like it worked in a unit test but not in
  // the browser). Mousedown also feels better — the item highlights the moment you press it. Propagation is NOT
  // stopped, so pressing an item still selects/drags the block underneath exactly as before, and the default is
  // not prevented, so clicking straight into a text part still places the caret.
  const onMouseDown = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-eu-item]");
    if (!el) return;
    setSelected({ id: el.dataset.euItem!, parentId: el.dataset.euParent || undefined });
    // Pressing directly on a TEXT PART must place the caret in it. The block's own mousedown handler arms a
    // drag and calls preventDefault(), which stops a contenteditable from ever taking focus — so for a text
    // part we stop the press here (React runs the descendant handler first) and let the default proceed.
    // Anywhere ELSE in the item the press still reaches the block, so dragging the block is unaffected.
    if ((e.target as HTMLElement).closest("[data-eu-part]")) e.stopPropagation();
  };

  // Commit an edited text part when focus leaves it.
  const onBlur = (e: React.FocusEvent) => {
    const part = (e.target as HTMLElement).closest<HTMLElement>("[data-eu-part]");
    if (!part) return;
    const host = part.closest<HTMLElement>("[data-eu-item]");
    if (!host) return;
    const field = part.dataset.euPart as "title" | "body" | "meta";
    const value = part.textContent ?? "";
    const id = host.dataset.euItem!, parentId = host.dataset.euParent;
    const cur = nodeRef.current;
    const before = parentId
      ? (cur.items ?? []).find((it) => it.id === parentId)?.children?.find((c) => c.id === id)
      : (cur.items ?? []).find((it) => it.id === id);
    if (!before || (before[field] ?? "") === value) return; // nothing actually changed
    const next = parentId ? updateChildItem(cur, parentId, id, { [field]: value }) : updateItem(cur, id, { [field]: value });
    onPatchNode?.({ items: next.items });
  };

  // Enter commits and leaves the field (Shift+Enter still inserts a line break in a body).
  const onKeyDown = (e: React.KeyboardEvent) => {
    const part = (e.target as HTMLElement).closest<HTMLElement>("[data-eu-part]");
    if (part && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); part.blur(); }
  };

  const apply = (next: BoxNode) => onPatchNode?.({ items: next.items });
  const sel = selected;
  const actions = {
    add: () => { if (sel) apply(addItemAfter(nodeRef.current, sel.parentId ? undefined : sel.id)); },
    duplicate: () => { if (sel) apply(sel.parentId ? duplicateChildItem(nodeRef.current, sel.parentId, sel.id) : duplicateItem(nodeRef.current, sel.id)); },
    remove: () => {
      if (!sel) return;
      apply(sel.parentId ? removeChildItem(nodeRef.current, sel.parentId, sel.id) : removeItem(nodeRef.current, sel.id));
      setSelected(null);
    },
    up: () => { if (sel) apply(sel.parentId ? moveChildItem(nodeRef.current, sel.parentId, sel.id, -1) : moveItem(nodeRef.current, sel.id, -1)); },
    down: () => { if (sel) apply(sel.parentId ? moveChildItem(nodeRef.current, sel.parentId, sel.id, 1) : moveItem(nodeRef.current, sel.id, 1)); },
  };
  // How many siblings the selection has — the toolbar guards Delete at the last one.
  const siblings: import("@/lib/box-model").ComponentItem[] = sel?.parentId
    ? ((node.items ?? []).find((it) => it.id === sel.parentId)?.children ?? [])
    : (node.items ?? []);
  const siblingIndex = sel ? siblings.findIndex((it) => it.id === sel.id) : -1;
  const siblingCount = sel?.parentId
    ? ((node.items ?? []).find((it) => it.id === sel.parentId)?.children ?? []).length
    : (node.items ?? []).length;

  /**
   * RULE N — drag a DETACHED (floating) item to position it, for EVERY component. It finds elements by the
   * `data-eu-item` attribute every component already stamps, and measures against the component's own host
   * box, so nothing here is accordion- or alert-specific. A grouped set moves rigidly as one unit, and the
   * shared delta is clamped so no member can leave the component's box (RULE H, at item level).
   * The inspector's X/Y number inputs are the keyboard alternative to this drag (RULE C).
   */
  const startItemDrag = (e: React.PointerEvent, it: import("@/lib/box-model").ComponentItem, floatsActive: boolean) => {
    if (!it.float || !floatsActive) return;
    if ((e.target as HTMLElement).closest("[contenteditable='true']")) return; // let text editing win
    e.preventDefault(); e.stopPropagation();
    const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const host = hostRef.current;
    const hostR = host?.getBoundingClientRect();
    const all = nodeRef.current.items ?? [];
    const members = (it.group ? all.filter((m) => m.group === it.group && m.float) : [it]).map((m) => {
      const mel = host?.querySelector(`[data-eu-item="${CSS.escape(m.id)}"]`) as HTMLElement | null;
      const mr = mel?.getBoundingClientRect();
      const maxX = hostR && mr ? Math.max(0, (hostR.width - mr.width) / remPx) : Infinity;
      const maxY = hostR && mr ? Math.max(0, (hostR.height - mr.height) / remPx) : Infinity;
      return { id: m.id, f: m.float!, maxX, maxY };
    });
    const sx = e.clientX, sy = e.clientY;
    const move = (ev: PointerEvent) => {
      let dx = (ev.clientX - sx) / remPx, dy = (ev.clientY - sy) / remPx;
      for (const mb of members) { // clamp the SHARED delta so no member exits the box (keeps the group rigid)
        dx = Math.max(-mb.f.x, Math.min(dx, mb.maxX - mb.f.x));
        dy = Math.max(-mb.f.y, Math.min(dy, mb.maxY - mb.f.y));
      }
      const moved = new Map(members.map((mb) => [mb.id, { ...mb.f, x: +(mb.f.x + dx).toFixed(1), y: +(mb.f.y + dy).toFixed(1) }]));
      onPatchNode?.({ items: (nodeRef.current.items ?? []).map((m) => (moved.has(m.id) ? { ...m, float: moved.get(m.id) } : m)) });
    };
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  };

  // Used by a component's React item views to write one field of one item (top-level or nested).
  const editItem = (id: string, patch: Partial<import("@/lib/box-model").ComponentItem>, parentId?: string) => {
    const cur = nodeRef.current;
    const next = parentId ? updateChildItem(cur, parentId, id, patch) : updateItem(cur, id, patch);
    onPatchNode?.({ items: next.items });
  };
  return { selected, setSelected, hostRef, handlers: { onMouseDown, onBlur, onKeyDown }, actions, siblingCount, siblingIndex, editItem, startItemDrag };
}

function ComponentView({ node, editable, onPatchNode, breakpoint = "base", itemSel, setItemSel }: {
  node: BoxNode; editable?: boolean; onPatchNode?: (patch: Partial<BoxNode>) => void; breakpoint?: Breakpoint;
  itemSel?: { boxId: string; id: string; parentId?: string } | null;
  setItemSel?: (v: { boxId: string; id: string; parentId?: string } | null) => void;
}) {
  // Always write item edits from the FRESHEST items (a drag's move handler must not replay a stale snapshot
  // and wipe positions set by another edit path — the ref updates every render).
  const itemsRef = useRef(node.items ?? []);
  itemsRef.current = node.items ?? [];
  // Shared on-canvas item CRUD (RULE I) — every multi-item component uses the same hook + overlay.
  const crud = useItemCrud(node, onPatchNode, itemSel, setItemSel);
  const itemHostRef = useRef<HTMLDivElement>(null);
  crud.hostRef.current = itemHostRef.current; // the click-away check needs this component’s DOM subtree
  // RULE N — grow the component's box to CONTAIN its floated items exactly, so a detached item never spills
  // outside its container. Measured after each render, so it is right even for tall or newly-opened items, and
  // it applies to EVERY multi-item component: the box element is found through that component's own item
  // selector, not a hard-coded accordion class. Reverts on the mobile preview, where floats rejoin the stack.
  const accRef = useRef<HTMLDivElement>(null);
  const itemBoxRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = accRef.current ?? itemBoxRef.current;
    const itemSel = COMPONENT_ITEM_SEL[node.component ?? ""];
    if (!el || !itemSel) return;
    // Only relevant when items actually float; skip entirely otherwise (avoids a measure→write→resize loop).
    const hasFloat = breakpoint !== "mobile" && (node.items ?? []).some((it) => it.float);
    let target = "";
    if (hasFloat) {
      let maxBottom = 0;
      el.querySelectorAll(`:scope > ${itemSel}`).forEach((child) => {
        const ce = child as HTMLElement;
        if (getComputedStyle(ce).position === "absolute") maxBottom = Math.max(maxBottom, ce.offsetTop + ce.offsetHeight);
      });
      target = maxBottom > 0 ? `${Math.ceil(maxBottom)}px` : "";
    }
    if (el.style.minHeight !== target) el.style.minHeight = target; // write only on change → no ResizeObserver loop
  });
  // Typography set on the wrapper cascades into the component's text (titles/bodies inherit family + size).
  const typo: React.CSSProperties = {};
  if (node.fontFamily) typo.fontFamily = node.fontFamily;
  if (node.fontSize) typo.fontSize = u(node.fontSize);
  if (node.fontWeight) typo.fontWeight = node.fontWeight;
  if (node.lineHeight) typo.lineHeight = node.lineHeight;
  if (node.letterSpacing != null) typo.letterSpacing = `${node.letterSpacing}px`;
  if (node.textTransform && node.textTransform !== "none") typo.textTransform = node.textTransform;
  if (node.italic) typo.fontStyle = "italic";
  // This `.eu-root` is a TRANSPARENT box that fills the node box EXACTLY (coincident) — so it reads as "no
  // wrapper" (no border/background/gap of its own) while still giving the component element a real, definite
  // containing block so width/height percentages resolve (display:contents would break % height). The component's
  // own element carries the border/radius/background + fills this box (injected below). `display:grid` so the
  // component stretches to fill in BOTH axes when sized, and hugs when the box is auto.
  // WIDTH IS DELIBERATELY NOT `100%`: a percentage-width child contributes NOTHING to a shrink-to-fit parent, so
  // `width:100%` here collapsed every "Fit"-width component to its minimum content width (the Alert became a 42px
  // column of one-letter-per-line text, inside a full-width band that read as a wrapper). A block-level box with
  // `width:auto` FILLS a definite-width parent and reports its real content width to a shrink-to-fit one — which
  // is exactly what Full and Fit each need. Same reason `COMPONENT_FILL` sets height only.
  // `flex:1` (not `height:100%`) — the block box is a column flex, so this stretches to whatever height the box
  // ends up with, whether that came from a resize or from the content itself. See the wrapper style below.
  const styleVars = { flex: "1 1 auto", minHeight: 0, display: "grid", ...typo, ...(node.tokenOverrides ?? {}) } as React.CSSProperties;
  if (node.component === "accordion") {
    const items = node.items ?? [];
    const cls = accordionClasses(node);
    const setItem = (id: string, patch: Partial<import("@/lib/box-model").ComponentItem>) =>
      onPatchNode?.({ items: itemsRef.current.map((it) => (it.id === id ? { ...it, ...patch } : it)) });
    const setChild = (pid: string, cid: string, patch: Partial<import("@/lib/box-model").ComponentItem>) =>
      onPatchNode?.({ items: itemsRef.current.map((it) => (it.id === pid ? { ...it, children: (it.children ?? []).map((c) => (c.id === cid ? { ...c, ...patch } : c)) } : it)) });
    const tcss = componentTextCss(node), bcss = componentBoxCss(node);
    const sel = `[data-box-id="${node.id}"] .eu-accordion`;
    // Floats apply on desktop/tablet; on the mobile preview items return to the normal stack (matches export).
    const floatsActive = breakpoint !== "mobile";
    // Whole-component Advanced CSS + per-item CSS both support part blocks (title/body/icon/meta/media),
    // so any text/background/colour of the accordion OR any single item can be overridden — canvas == export.
    const adv = expandScopedCss(node.advancedCss, sel, ACCORDION_CSS_PARTS);
    const itemCss = items.map((it) => (itemHasOverride(it) ? itemOverrideCss(`${sel} .eu-acc-i-${it.id}`, it, { skipFloat: !floatsActive }) : "")).filter(Boolean).join("");
    const floatCtx = floatsActive ? itemFloatContextCss(items, sel) : "";
    const inject = [tcss ? `${sel}, ${sel} *{${tcss}}` : "", bcss ? `${sel}{${bcss}}` : "", adv, itemCss, floatCtx, bgShowThroughCss(node, `${sel} .eu-accordion__item`), blockContainmentCss(node, sel)].filter(Boolean).join("");
    // Drag a detached (floating) item on the canvas to reposition it — X/Y (rem) update live.
    return (
      <div className="eu-root" style={{ ...styleVars, position: "relative" }} ref={itemHostRef}>
        {inject ? <style dangerouslySetInnerHTML={{ __html: inject }} /> : null}
        {/* Same shared item CRUD as every other multi-item component — see useItemCrud / ItemCrudLayer. */}
        <div ref={accRef} className={cls} id={node.accShowAll ? `eu-acc-${node.id}` : undefined}
          onMouseDown={editable ? crud.handlers.onMouseDown : undefined}>
          {node.variant === "--split" && (
            <div className="eu-accordion__panel" style={node.accSplitMedia && /^(https?:|data:)/.test(node.accSplitMedia) ? { backgroundImage: `url('${node.accSplitMedia.replace(/["'()\\]/g, "")}')` } : undefined} />
          )}
          {node.accSearch && (
            <div className="eu-accordion__search">
              <span className="eu-accordion__search-ico" aria-hidden="true">{(() => { const S = ICON_SET["Search"]; return S ? <S style={{ width: "1em", height: "1em" }} /> : null; })()}</span>
              <input type="search" placeholder="Search…" aria-label="Search these items"
                onChange={!editable ? (e) => { const q = e.target.value.toLowerCase(); const el = accRef.current; if (!el) return; let n = 0; el.querySelectorAll(":scope > .eu-accordion__item").forEach((d) => { const m = !q || (d.textContent || "").toLowerCase().includes(q); (d as HTMLElement).style.display = m ? "" : "none"; if (m) n++; }); el.querySelectorAll(":scope > .eu-accordion__category").forEach((h) => { (h as HTMLElement).style.display = q ? "none" : ""; }); const em = el.querySelector("[data-eu-acc-empty]") as HTMLElement | null; if (em) em.hidden = !(q && n === 0); } : undefined} />
              <div className="eu-accordion__noresults" data-eu-acc-empty hidden>No matching items.</div>
            </div>
          )}
          {node.accShowAll && (
            <div className="eu-accordion__controls">
              <button type="button" data-eu-acc-all="open" onClick={() => onPatchNode?.({ items: items.map((it) => ({ ...it, open: true })) })} title="Open every panel by default (visitors can still toggle)">Expand all</button>
              <button type="button" data-eu-acc-all="close" onClick={() => onPatchNode?.({ items: items.map((it) => ({ ...it, open: undefined })) })} title="Collapse every panel by default">Collapse all</button>
            </div>
          )}
          {items.map((it, i) => (
            <Fragment key={it.id}>
            {it.category && it.category !== items[i - 1]?.category ? <div className="eu-accordion__category">{it.category}</div> : null}
            <details id={it.anchor || undefined} data-eu-item={it.id} className={`eu-accordion__item${itemNeedsClass(it) ? ` eu-acc-i-${it.id}` : ""}`}
              style={{ ...(itemNumberVars(i) as React.CSSProperties), ...(editable && it.float && floatsActive ? { cursor: "move" } : {}) }}
              onPointerDown={editable && it.float && floatsActive ? (e) => crud.startItemDrag(e, it, floatsActive) : undefined}
              open={editable ? true : it.open} name={node.accMultiOpen ? undefined : `acc-${node.id}`}>
              <summary className="eu-accordion__header" onClick={editable ? (e) => e.preventDefault() : undefined}>
                {it.icon && iconSvg(it.icon) ? <span className="eu-accordion__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvg(it.icon) }} /> : null}
                {/* A plain <img>, as above: a user upload, matched to what the export emits. */}
                {it.media ? <img className="eu-accordion__media" src={it.media} alt={it.mediaAlt ?? ""} loading="lazy" decoding="async" /> : null}
                <span className="eu-accordion__title"><EditableText value={it.title} editable={editable} onChange={(v) => setItem(it.id, { title: v })} placeholder="Question" /></span>
                {it.meta ? <span className="eu-accordion__meta">{it.meta}</span> : null}
              </summary>
              <div className="eu-accordion__body">
                {editable
                  ? <EditableText value={it.body} editable onChange={(v) => setItem(it.id, { body: v })} placeholder="Answer — click to edit" />
                  : <span dangerouslySetInnerHTML={{ __html: richBody(it.body) }} />}
                {(it.children ?? []).length ? (
                  <div className="eu-accordion eu-accordion--nested">
                    {(it.children ?? []).map((c) => (
                      <details key={c.id} data-eu-item={c.id} data-eu-parent={it.id} className="eu-accordion__item" open={editable ? true : c.open}>
                        <summary className="eu-accordion__header" onClick={editable ? (e) => e.preventDefault() : undefined}>
                          <span className="eu-accordion__title"><EditableText value={c.title} editable={editable} onChange={(v) => setChild(it.id, c.id, { title: v })} placeholder="Sub-question" /></span>
                        </summary>
                        <div className="eu-accordion__body">
                          {editable
                            ? <EditableText value={c.body} editable onChange={(v) => setChild(it.id, c.id, { body: v })} placeholder="Answer" />
                            : <span dangerouslySetInnerHTML={{ __html: richBody(c.body) }} />}
                        </div>
                      </details>
                    ))}
                  </div>
                ) : null}
              </div>
            </details>
            </Fragment>
          ))}
        </div>
        {editable && isMultiItemComponent(node.component) && (
          <ItemCrudLayer
            containerRef={itemHostRef}
            selected={crud.selected}
            count={crud.siblingCount}
            index={crud.siblingIndex}
            onAdd={crud.actions.add}
            onDuplicate={crud.actions.duplicate}
            onDelete={crud.actions.remove}
            onMoveUp={crud.actions.up}
            onMoveDown={crud.actions.down}
            onDismiss={() => crud.setSelected(null)}
          />
        )}
      </div>
    );
  }
  // Registry components render as ONE clean node from the SAME HTML the export emits (true WYSIWYG). Content
  // is edited in the inspector (auto-generated from the component's slots), never inline — so a plain injected
  // markup string is exactly right here.
  // Alert — a multi-item component (mirrors the accordion) rendered from one shared HTML function.
  if (node.component === "alert") {
    const adv = sanitizeCssDeclarations(node.advancedCss);
    const tcss = componentTextCss(node), bcss = componentBoxCss(node);
    const sel = `[data-box-id="${node.id}"] .eu-alert-stack`;
    // Per-ITEM styling/CSS used to ride along inside renderAlertHTML's <style>; the React branch injects it here
    // instead, from the same model helper, so the canvas keeps matching the export exactly.
    // RULE N — floats apply on desktop/tablet; on the mobile preview items return to the normal stack, exactly
    // as the export does, so the canvas and the published page agree.
    const alertFloatsActive = breakpoint !== "mobile";
    const itemStyles: string[] = [];
    collectAlertItemStyles(node.items, itemStyles, { skipFloat: !alertFloatsActive });
    // TOAST: the same `position:fixed` rule the export uses — the page root below becomes its container.
    const toastCss = alertToastCss(node, sel);
    const inject = [tcss ? `${sel} .eu-alert__body, ${sel} .eu-alert__title{${tcss}}` : "", bcss ? `${sel}{${bcss}}` : "", adv ? `${sel}{${adv}}` : "", bgShowThroughCss(node, `${sel} .eu-alert`), blockContainmentCss(node, sel), alertFloatsActive ? itemFloatContextCss(node.items, sel) : "", itemStyles.join(""), toastCss].filter(Boolean).join("");
    return (
      <div className="eu-root" style={{ ...styleVars, position: "relative" }}>
        {inject ? <style dangerouslySetInnerHTML={{ __html: inject }} /> : null}
        {/* Items render as REACT here (see AlertItemView) so each one's text is directly editable on the canvas,
            exactly like the Accordion's. The EXPORT still comes from renderAlertHTML — same markup, same CSS. */}
        <div ref={itemHostRef} style={COMPONENT_FILL} onMouseDown={editable ? crud.handlers.onMouseDown : undefined}>
          <div ref={itemBoxRef} className={`eu-alert-stack eu-alert-stack--${node.alertForm || "inline"}`}>
            {(node.items ?? []).slice(0, 1).map((it) => (
              <AlertItemView
                key={it.id}
                item={it}
                sev={node.alertSeverity || "info"}
                treat={node.variant || ""}
                axes={[node.alertShape, node.alertBorder, node.alertIconStyle, node.alertDensity, node.alertEmphasis, node.alertLayout,
                       node.alertActionPlacement === "right" ? "--actions-right" : ""].filter(Boolean) as string[]}
                form={node.alertForm || "inline"}
                dismiss={!!node.alertDismiss}
                editable={editable}
                onEdit={crud.editItem}
                onFloatDrag={(e, i) => crud.startItemDrag(e, i, alertFloatsActive)}
                floatsActive={alertFloatsActive}
              />
            ))}
          </div>
        </div>
        {editable && isMultiItemComponent(node.component) && (
          <ItemCrudLayer
            containerRef={itemHostRef}
            selected={crud.selected}
            count={crud.siblingCount}
            index={crud.siblingIndex}
            onAdd={crud.actions.add}
            onDuplicate={crud.actions.duplicate}
            onDelete={crud.actions.remove}
            onMoveUp={crud.actions.up}
            onMoveDown={crud.actions.down}
            onDismiss={() => crud.setSelected(null)}
          />
        )}
      </div>
    );
  }
  if (isRegistryComponent(node.component)) {
    const adv = sanitizeCssDeclarations(node.advancedCss);
    const tcss = componentTextCss(node), bcss = componentBoxCss(node);
    const sel = `[data-box-id="${node.id}"] .eu-${node.component}`;
    const inject = [tcss ? `${sel}, ${sel} *{${tcss}}` : "", bcss ? `${sel}{${bcss}}` : "", adv ? `${sel}{${adv}}` : "", blockContainmentCss(node, sel)].filter(Boolean).join("");
    const html = renderComponent(node.component!, node.componentFields, node.variant);
    return (
      <div className="eu-root" style={styleVars}>
        {inject ? <style dangerouslySetInnerHTML={{ __html: inject }} /> : null}
        <div style={COMPONENT_FILL} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }
  return <div className="eu-root" style={styleVars} />;
}

function ElementView({ node, theme, editable, onText, onSrc, onPatchNode, breakpoint = "base", itemSel, setItemSel }: {
  node: BoxNode; theme: SiteTheme; editable?: boolean; onText: (v: string) => void; onSrc: (v: string) => void; onPatchNode?: (patch: Partial<BoxNode>) => void; breakpoint?: Breakpoint;
  itemSel?: { boxId: string; id: string; parentId?: string } | null;
  setItemSel?: (v: { boxId: string; id: string; parentId?: string } | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const align = node.textAlign ?? "left";
  switch (node.type) {
    case "component": return <ComponentView node={node} editable={editable} onPatchNode={onPatchNode} breakpoint={breakpoint} itemSel={itemSel} setItemSel={setItemSel} />;
    case "heading":
      return <h2 style={{ color: node.color || theme.text, fontSize: u(node.fontSize ?? 32), textAlign: align, width: "100%", ...typoStyle(node, theme.headingFont, 600) }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Heading" /></h2>;
    case "button": {
      // The button FILLS its box and paints its OWN visual (bg + radius + border/shadow), so resizing the box grows
      // the button itself (one shape — no duplicate wrapper behind it) and the label re-positions inside it. Content
      // position (or centre by default) decides where the label sits; a resized button therefore centres its text.
      const deco = decorStyle(node);
      return <a href={node.href || "#"} target={node.newTab ? "_blank" : undefined} rel={node.newTab ? "noopener noreferrer" : undefined} onClick={(e) => editable && e.preventDefault()}
        style={{ display: "flex", width: "100%", height: "100%", boxSizing: "border-box", gap: u(8),
          alignItems: flexPos(node.contentY ?? "center"), justifyContent: flexPos(node.contentX ?? "center"),
          background: node.background ? colorToCSS(node.background) : colorToCSS(theme.primary), color: node.color || "#fff",
          fontSize: u(node.fontSize ?? 14), padding: `${u(12)} ${u(24)}`, textDecoration: "none",
          ...deco, borderRadius: deco.borderRadius ?? "9999px", ...typoStyle(node, theme.bodyFont, 600) }}>
        <EditableText value={node.text} editable={editable} onChange={onText} placeholder="Button" /></a>;
    }
    case "image": {
      // Identical sizing to the export — same helper, so "auto" takes the photo's own shape in both places
      // and a height set by hand crops it in both places.
      const sizing = imageSizing(node);
      return (
        <div className="relative w-full" style={{ height: sizing.height, aspectRatio: sizing.aspectRatio }}>
          {/* alt is passed here too, so what a screen reader gets while editing matches the published page.
              So are the intrinsic dimensions, which is what holds the box open before the photo arrives. */}
          <ImageBox theme={theme} src={node.src} alt={node.alt ?? ""} width={node.imgW} height={node.imgH} />
          {editable && (<>
            <button onClick={() => fileRef.current?.click()} className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-900/80 text-white shadow-lg hover:bg-gray-900"><Upload className="w-3.5 h-3.5" /> {node.src ? "Replace" : "Upload"}</button>
            {/* The natural size is measured BEFORE the patch, so the picture and its shape land in one undo
                step — and so replacing a photo can never leave the previous one's dimensions behind. */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Upload image" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = async () => { const src = String(r.result); const dims = await measureImage(src); if (onPatchNode) onPatchNode({ src, imgW: dims.imgW, imgH: dims.imgH }); else onSrc(src); }; r.readAsDataURL(f); e.target.value = ""; }} />
          </>)}
        </div>
      );
    }
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
      // Render via iconSvg (all four libraries) so the canvas matches the export exactly. `fontSize` drives
      // the em box (the inline SVG is 1em). Falls back to a lucide Star component if the SVG isn't ready.
      const svg = iconSvg(node.icon ?? "Star");
      const size = u(node.fontSize ?? 32);
      return (
        <div style={{ textAlign: align, color: node.color ? colorToCSS(node.color) : theme.primary, width: "100%", lineHeight: 0 }}>
          {svg
            ? <span aria-hidden="true" style={{ display: "inline-flex", fontSize: size, width: "1em", height: "1em" }} dangerouslySetInnerHTML={{ __html: svg }} />
            : <Star style={{ width: size, height: size, display: "inline-block" }} />}
        </div>
      );
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
