"use client";

/**
 * Recursive box-tree canvas — the Framer/Webflow-style editor surface. Renders a BoxNode tree with
 * flex OR grid layout, layered backgrounds (colour / gradient / image / overlay), and inline editing.
 * Structure editing (add child, move, duplicate, delete) lives on a small per-node toolbar; styling
 * lives in BoxInspector. Everything flows — boxes can never overlap. Controlled: edits flow up via
 * onChange(root); selection via selectedId/onSelectId.
 */

import { measureCss } from "@/lib/educo-ui/base";
import { columnFloorRem, dividerThickness, gridLeftoverAt,HAND_FLOOR_REM, LIST_ITEM_GAP, restForDrag, tabletPlaces } from "@/lib/box-model";
import { resolvePage } from "@/lib/semantics";
import { Fragment, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link2, Plus, ChevronUp, ChevronDown, Copy, Scissors, ClipboardPaste, Trash2, Upload, GripVertical, MoreVertical, Rows3, Columns3, Grid3x3, Type, Heading as HeadingIcon, MousePointerClick, Image as ImageIcon, Layers, BringToFront, SendToBack, Video as VideoIcon, Sparkles, Minus as MinusIcon, List as ListIcon, Code2, Star, Lock, LockOpen, Ungroup } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, type BoxType,
  containerStyle, childStyle, marginCSS, leafPaddingCSS, outerSpaceCSS, pageBandInset, pagePinCover, sectionContent, sizeToCSS, u, baseUnit, floatingReserve, floatStacksOnMobile, createContainer, createElement, createComponent,
  updateBox, deleteBox, insertBox, moveBoxStep, duplicateBox, moveBox, cloneBox, findParent, isAncestor, isContainer, containerLabel, widthPct, stackWithBlock, fitBand, PILL, blockTypography,
  isFloating, floatBox, unfloatBox, groupBoxes, ungroupBoxes, bringToFront, sendToBack, bringForward, sendBackward, packRowLines, allocateLine, type LineFollower,
  shouldTakeMirrorBox, hostSizedFor, type MirrorBox, type MirrorChase, fadedPaint, boxOpacity, backgroundCss, treePaintLayerCss, radiusCSS, isClipped, SHADOW_CSS, videoEmbedSrc, sanitizeCssDeclarations, expandScopedCss, ACCORDION_CSS_PARTS, itemOverrideCss, itemHasOverride, itemNumberVars, richBody, componentTextCss, componentBoxCss, bgShowThroughCss, resizeTopEdge, blockContainmentCss, alertToastCss, treeHasToast, treeHasFixedHold, accordionClasses, bandClasses, advancedCssStyle, alertActionsHTML, hugsContent, itemFloatContextCss, COMPONENT_ITEM_SEL, clampContentScale, MIN_CONTENT_SCALE, isMultiItemComponent, comfortableWidth, remLen, rootFontPx, isDefiniteLen, addItemAfter, duplicateItem, duplicateChildItem, removeItem, removeChildItem, moveItem, moveChildItem, updateItem, updateChildItem, ALERT_SEVERITY_ICON, alertPartInline, alertIconInline, collectAlertItemStyles,
  type Breakpoint, resolveResponsive, updateBoxResponsive, treePinArrivalCss, floatHoldCSS, canvasFixedStyle, capturesFixed, imageSizing, importPhoto, treeItemEffectsCss, itemNeedsClass, floatZIndex, gridPlacementAt, masonryMeasureAttr, masonryMeasurePass, mirrorMeasuresNow, baseUnitParts, pinStackMarker, pinStackGroupMarker, pinStackPass, isPager, pagerStripCss, pagerNavHTML, selectionChain, textLen, typoRole, typoRootVars, typoCascadeCss, bandEdgeCSS, LINK_COLOR_CSS, treeGridQueryCss, TYPE_UNIT_PROPERTY_CSS,
} from "@/lib/box-model";
import { ICON_SET } from "./icons";
import { PortalMenu, MenuItem, MenuHeader, MenuSep } from "./ui";
import GridLayoutMenu, { type MenuAnchor } from "./GridLayoutMenu";
import GallerySetupMenu from "./GallerySetupMenu";
import { blockForKind, nodeForPhotos, photoGallery, PHOTO_SETUP, type GalleryPhoto } from "@/lib/box-presets";
import { treeHoverCss, treeRevealCss } from "@/lib/interactions";
import { colorToCSS } from "@/components/shared/ColorPalettePicker";
import { COMPONENT_CSS } from "@/lib/educo-ui/components";
import { layoutCss, RUNG_MEASURE } from "@/lib/educo-ui/layout";
import { CHROME_Z } from "@/lib/educo-ui/stacking";
import { iconSvg, onIconsLoaded, warmIcons, hasIcon } from "@/lib/educo-ui/icon-svg";
import { tokensFromTheme, tokensToCss } from "@/lib/educo-ui/tokens";
import { isRegistryComponent, renderComponent } from "@/lib/educo-ui/registry";
import { EditableText, ImageBox } from "@/components/website/sections/SectionKit";
import ItemCrudLayer, { type SelectedItem } from "@/components/website/box/ItemCrudLayer";
import { zoomOf } from "@/lib/canvas-zoom";

/** Layered background CSS: base fill (colour/gradient) → image → overlay; content renders above. */
function backgroundStyle(node: BoxNode): React.CSSProperties {
  // SEE-THROUGH lives in the COLOURS, not in `opacity` — so the box fades and nothing inside it does. And the
  // stack itself is composed by box-model, which is what the exporter calls too: one composer, so a canvas
  // that disagrees with the published page is not expressible.
  //
  // A box painting an IMAGE gets NOTHING here while it is fading: `fadedPaint` hands back an empty background
  // because the whole stack has moved to a `::before` layer carrying its own opacity (`paintLayerCss`).
  return backgroundCss(node, fadedPaint(node));
}

/** Border, drop shadow, per-corner radius and rotation for any box. */
function decorStyle(node: BoxNode): React.CSSProperties {
  const s: React.CSSProperties = {};
  const br = radiusCSS(node); if (br) s.borderRadius = br;
  const bc = fadedPaint(node).borderColor;
  if (node.borderWidth && node.type !== "divider") s.border = `${node.borderWidth}px ${node.borderStyle ?? "solid"} ${bc ? colorToCSS(bc) : "rgba(0,0,0,0.15)"}`; // divider uses borderWidth as its line thickness
  if (node.shadow) s.boxShadow = SHADOW_CSS[node.shadow];
  if (node.rotate) s.transform = `rotate(${node.rotate}deg)`;
  Object.assign(s, bandEdgeCSS(node)); // sloped / curved top and bottom edges — the SAME helper the export uses
  return s;
}

/** Typography for a text/heading/button element (falls back to the theme font + type defaults). */
/** The canvas half of the typography cascade — the SAME role variables the export writes (see TYPO_VAR). */
function typoStyle(node: BoxNode, role: "heading" | "body", defaultWeight: number): React.CSSProperties {
  return blockTypography(node, role, defaultWeight); // the SAME resolver the export calls — see blockTypography
}

/**
 * Resolve the LIVE pixel value of the fluid base unit (--box-u = clamp(minRem, cqw, maxRem)), replicating
 * baseUnit(), so we can convert a measured pixel offset into the stored (u-scaled) margin unit — u(stored)
 * renders back to that exact pixel value. Custom properties aren't resolved by getComputedStyle, so we
 * recompute the clamp from the live container-query width + root font-size (which honours browser zoom /
 * user font settings — WCAG). Used by edge-anchored resize to pin a box in place without any jump.
 */
/**
 * THE CANVAS'S EFFECTIVE ZOOM — below 1 when the editor shrinks a device wider than the screen to fit (#49).
 *
 * The frame is laid out at the true device width and shown smaller with CSS `zoom`. Measured in Chromium 145:
 * rectangles and pointer coordinates are then both in SCREEN pixels (a 400px block reports 200 at zoom 0.5),
 * while `offsetWidth`, the root font size and container queries stay in LAYOUT pixels. So a ratio of two rects
 * (every width stored as a %) needs nothing, but a length a drag WRITES — rem, the fluid unit, a px height — is a
 * screen distance that has to be divided by this, or a block would grow faster than the pointer at 90%.
 */
/**
 * THE NARROWEST A BLOCK CAN BE DRAWN, set by its CONTENT (#68) — the longest word or unbreakable run inside it. A stack
 * holding "New text — click to edit." was drawn at 226px although its share was 224.4px, so the resize — which assumed
 * the 14rem floor was the only minimum — thought a neighbour fitted where the browser needed 2px more, and it wrapped.
 * Measured on an invisible COPY laid out at min-content beside it and removed in the same frame, so the real block is never
 * touched and nothing is painted. In SCREEN px (like every rect). Where nothing lays out (a test DOM) the copy measures 0
 * and the 14rem floor governs alone.
 */
export function minContentPx(el: HTMLElement): number {
  // A COPY, laid out invisibly beside the real block at min-content and removed at once — the real block is never
  // touched. Its ids are stripped so nothing looking blocks up by id can find the copy in the meantime.
  const parent = el.parentElement; if (!parent) return 0;
  const copy = el.cloneNode(true) as HTMLElement;
  copy.removeAttribute("data-box-id"); copy.querySelectorAll("[data-box-id]").forEach((n) => n.removeAttribute("data-box-id"));
  copy.removeAttribute("id");
  Object.assign(copy.style, { position: "absolute", visibility: "hidden", pointerEvents: "none", left: "0", top: "0", width: "min-content", minWidth: "0", maxWidth: "none", flex: "none", height: "auto" });
  parent.appendChild(copy);
  const w = copy.getBoundingClientRect().width;
  copy.remove();
  return w;
}

export { zoomOf };

function measureBoxU(el: HTMLElement, baseFont: number): number {
  const doc = el.ownerDocument;
  const rem = parseFloat(getComputedStyle(doc.documentElement).fontSize) || 16;
  let cq: HTMLElement | null = el.parentElement;
  while (cq && getComputedStyle(cq).containerType === "normal") cq = cq.parentElement;
  const cqw = (cq?.clientWidth ?? doc.defaultView?.innerWidth ?? 1000) / 100;
  /**
   * THE NUMBERS COME FROM `baseUnitParts`, never from a second copy of the formula written out here.
   *
   * They used to be re-typed: `const mid = (baseFont / 10) * cqw`, the old bare-`cqw` ideal. When the CSS
   * unit gained its rem term (Core Rule 16 — the reader's text size must move the page) this was not
   * changed with it, so the drag converted pixels using one unit while the page rendered with another, and
   * the edge-anchored bottom drifted 3px. Rule 19's fourth outing, and the first caused by a seam rather
   * than by the resize maths.
   */
  const { loRem, hiRem, remHalf, cqwHalf } = baseUnitParts(baseFont);
  const mid = remHalf * rem + cqwHalf * cqw;
  return Math.min(hiRem * rem, Math.max(loRem * rem, mid)) || 10;
}

const round1 = (n: number) => Math.round(n * 10) / 10;
/** Map a content-position value (start/center/end) to a flex alignment keyword. */
const flexPos = (v?: string): string => (v === "center" ? "center" : v === "end" ? "flex-end" : "flex-start");

/** Measure the geometry needed to lift a box onto a free-floating layer: its POSITIONING PARENT (the
 *  nearest real content container — never a structural row band) and the box's current left/top (% of
 *  that parent's content box), width (% of it) and height (px). Reads live DOM rects, so it captures the
 *  box exactly where it sits → floating it causes NO jump. Exported so both the canvas (⋯ menu / Alt-drag)
 *  and the page (inspector toggle) lift from the same measurement. Returns null if the DOM isn't ready. */
/**
 * WHERE A FLOATED BLOCK IS SITTING RIGHT NOW — px from the top-left of the box a FIXED block is measured
 * against: the page root here, the window on the published page.
 *
 * Read the moment a floated block is set to float on screen. Its stored `left`/`top` are percentages of the
 * section it was placed in, and those mean a different place once the box being measured against is the
 * window — measured, a block resting 720px down a tall section landed at 240px. Taking the measurement now
 * is what makes "keep it where I dragged it" true rather than approximately true.
 */
export function measureFixedGeom(rootId: string, id: string): { x: number; y: number } | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
  const page = document.querySelector<HTMLElement>(`[data-box-id="${rootId}"]`);
  if (!el || !page) return null;
  const r = el.getBoundingClientRect(), pr = page.getBoundingClientRect();
  /**
   * LESS THE SCROLL, and that is not a detail — it is the difference between two origins.
   *
   * A held block is drawn at `scroll + y` (canvas) and at `y` from the top of the window (export), so `y`
   * has to be measured from the top of what is ON SCREEN, not from the top of the page. Measured with the
   * page origin instead, switching a block moved it down by exactly the distance the canvas was scrolled —
   * 425px in the guard that caught it. Horizontal needs no such correction: the canvas draws `x` from the
   * page's left edge, and on the published page the page starts at the window's left edge.
   */
  let scroller: HTMLElement | null = el.parentElement;
  while (scroller && !/auto|scroll/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;
  // From the top of what is ON SCREEN — the visible top of the page, which is the page's own top edge until
  // that edge scrolls away and the canvas's top edge after it. That is the origin the published page uses
  // (the window), and the origin `canvasFixedStyle` draws against, so all three agree.
  const viewTop = Math.max(scroller ? scroller.getBoundingClientRect().top : 0, pr.top);
  return { x: Math.round(r.left - pr.left), y: Math.round(r.top - viewTop) };
}

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
  const cs = getComputedStyle(pEl), Z = zoomOf(el); // rects are screen px when the canvas is shrunk to fit; paddings are layout px
  const padL = (parseFloat(cs.paddingLeft) || 0) * Z, padT = (parseFloat(cs.paddingTop) || 0) * Z;
  const padR = (parseFloat(cs.paddingRight) || 0) * Z, padB = (parseFloat(cs.paddingBottom) || 0) * Z;
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
    height: r.height / Z, // stored as LAYOUT px
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
  const pr = rootEl.getBoundingClientRect(), cs = getComputedStyle(rootEl), Z = zoomOf(rootEl);
  const padL = (parseFloat(cs.paddingLeft) || 0) * Z, padT = (parseFloat(cs.paddingTop) || 0) * Z;
  const cw = Math.max(1, pr.width - padL - (parseFloat(cs.paddingRight) || 0) * Z);
  const ch = Math.max(1, pr.height - padT - (parseFloat(cs.paddingBottom) || 0) * Z);
  const rects = picked.map((id) => document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)?.getBoundingClientRect()).filter(Boolean) as DOMRect[];
  if (rects.length < 2) return null;
  const minL = Math.min(...rects.map((r) => r.left)), minT = Math.min(...rects.map((r) => r.top));
  const maxR = Math.max(...rects.map((r) => r.right)), maxB = Math.max(...rects.map((r) => r.bottom));
  return { left: ((minL - (pr.left + padL)) / cw) * 100, top: ((minT - (pr.top + padT)) / ch) * 100, width: `${round1(((maxR - minL) / cw) * 100)}%`, height: (maxB - minT) / Z };
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

/** The caret after the last character, so the user carries on typing rather than overwrites. */
function caretToEnd(host: HTMLElement) {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(host);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

/** Put the caret exactly where the pointer was, with whichever of the two APIs this browser provides. */
function placeCaretAt(host: HTMLElement, x: number, y: number) {
  const sel = window.getSelection();
  if (!sel) return;
  const d = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  let range: Range | null = null;
  if (typeof d.caretRangeFromPoint === "function") range = d.caretRangeFromPoint(x, y);
  else if (typeof d.caretPositionFromPoint === "function") {
    const p = d.caretPositionFromPoint(x, y);
    if (p) { range = document.createRange(); range.setStart(p.offsetNode, p.offset); range.collapse(true); }
  }
  // Better a caret at the end of the right block than no caret at all.
  if (!range || !host.contains(range.startContainer)) { caretToEnd(host); return; }
  sel.removeAllRanges();
  sel.addRange(range);
}

/**
 * The block's OWN text, never a descendant block's — so Enter on a Stack does not silently reach inside it and
 * start editing the first heading it happens to contain.
 */
function ownEditable(id: string): HTMLElement | undefined {
  const blockEl = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
  if (!blockEl) return undefined;
  return Array.from(blockEl.querySelectorAll<HTMLElement>('[contenteditable="true"]'))
    .find((el) => el.closest("[data-box-id]") === blockEl);
}

/**
 * A RESIZE IS A DRAG; A CLICK IS A CLICK.
 *
 * Every block is created with `padding: 0` (Rule 3), so its text starts exactly at its edge — and the edge
 * handles straddle that edge, 4px outside and 6px INSIDE, so they always sit over the first letters. Measured on
 * a fresh Heading: 3 of 21 plausible aim points across the words could not place a caret, because the pointer
 * landed on "Resize left edge" instead. A user aiming at the first word gets a resize drag and their typing
 * goes nowhere.
 *
 * Moving the handles fully outside would only hand the same problem to the NEIGHBOUR in a zero-gap row, so the
 * fix is behavioural rather than geometric: if the pointer never moved, this was not a resize, and the click
 * belongs to whatever sits underneath. Resize geometry is untouched (Rule 19).
 */
function caretFallthrough(e: React.MouseEvent) {
  const startX = e.clientX, startY = e.clientY;
  const onUp = (ev: MouseEvent) => {
    document.removeEventListener("mouseup", onUp, true);
    if (Math.abs(ev.clientX - startX) > 2 || Math.abs(ev.clientY - startY) > 2) return; // a real drag — leave it alone
    /**
     * Peel the chrome at the point until the text appears, asking the DOM each time rather than holding the
     * handle from `mousedown`: starting a resize re-renders, and a captured node can be detached by the time
     * this runs — measured, the stale reference was switched off while the live handle still blocked the point,
     * so nothing was ever found underneath. Corners and edges also overlap near a box's start, hence a few
     * layers rather than one.
     */
    // Nothing to look through with, so leave the resize alone rather than throwing inside a global listener —
    // jsdom has no `elementFromPoint`, and an exception here took two unrelated canvas tests down with it.
    if (typeof document.elementFromPoint !== "function") return;
    const peeled: { el: HTMLElement; prev: string }[] = [];
    let host: HTMLElement | null = null;
    for (let i = 0; i < 4; i++) {
      const el = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null;
      if (!el) break;
      const ce = el.closest<HTMLElement>('[contenteditable="true"]');
      if (ce) { host = ce; break; }
      peeled.push({ el, prev: el.style.pointerEvents });
      el.style.pointerEvents = "none";
    }
    /**
     * Place the caret WHILE THE CHROME IS STILL SWITCHED OFF. Working out which character was clicked means
     * hit-testing the point a second time, so with the handle live again the browser finds the handle, decides
     * the point is not in any text, and the caret falls back to the end of the block — measured: clicking the
     * first letter of "Riverside Primary School" and typing gave "Riverside Primary SchoolSt ".
     */
    if (host) { host.focus(); placeCaretAt(host, ev.clientX, ev.clientY); }
    for (const p of peeled) p.el.style.pointerEvents = p.prev; // put the chrome back, always
  };
  document.addEventListener("mouseup", onUp, true);
}

const ADD_ITEMS: { type: BoxType | "row" | "grid" | "accordion"; label: string; Icon: typeof Type }[] = [
  // The same names as the palette — see `containerLabel` in lib/box-model.ts for why they are named for the
  // arrangement they produce. This menu was missed by that rename and still said "Section (stack)"/"Row".
  { type: "container", label: "Stack", Icon: Rows3 },
  { type: "row", label: "Side by side", Icon: Columns3 },
  { type: "grid", label: "Grid", Icon: Grid3x3 },
  { type: "heading", label: "Heading", Icon: HeadingIcon },
  { type: "text", label: "Text", Icon: Type },
  { type: "button", label: "Button", Icon: MousePointerClick },
  { type: "link", label: "Link", Icon: Link2 },
  { type: "image", label: "Image", Icon: ImageIcon },
  { type: "video", label: "Video", Icon: VideoIcon },
  { type: "icon", label: "Icon", Icon: Sparkles },
  { type: "list", label: "List", Icon: ListIcon },
  { type: "accordion", label: "Accordion", Icon: ChevronDown },
  { type: "divider", label: "Divider", Icon: MinusIcon },
  { type: "embed", label: "Embed / HTML", Icon: Code2 },
];

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
 *
 * ── WHY THIS SITS AT MODULE SCOPE, AND MUST STAY HERE ───────────────────────────────────────────────
 *
 * It used to be declared INSIDE `BoxCanvas`, and that is what produced "Maximum update depth exceeded"
 * whenever a block was resized. A component declared inside another is a NEW FUNCTION IDENTITY on every
 * render, so React cannot match it to the previous tree: it unmounts the old one and mounts a fresh one,
 * every single render. Every ref resets with it — including `measured` below, whose entire job is to make
 * the first measurement synchronous and every one after it wait for a frame.
 *
 * So the deferral that exists precisely to break the measure → setState → measure chain was NEVER REACHED.
 * Each render arrived as a first mount, took the synchronous path, set state, and rendered again. While the
 * geometry is still the loop is harmless (`setBox` returns `prev` and nothing re-renders) — which is why it
 * only ever crashed during a resize, the one time the geometry changes on every frame.
 *
 * The guard was written, correct, and unreachable. Keeping this at module scope is what makes it run.
 */
/**
 * WHAT THE MIRROR REMEMBERS ACROSS A REMOUNT — and why it cannot live in a ref.
 *
 * Every protection this component has — the "already measured once" flag, the churn budget, the last box —
 * was held in a `useRef`, and a ref is born again with the component. So none of them survive a remount, and
 * the first measurement after each mount is deliberately SYNCHRONOUS (so selecting a block shows its handles
 * without a frame of lag). A mirror that remounts on every render therefore runs measure → setState → render
 * → measure synchronously, with no bound and no frame boundary, which is exactly what React reports as
 * "Maximum update depth exceeded". Reported twice by the user; the guard added last time could not help,
 * because it was one of the refs being reset.
 *
 * Keyed by block id and outside the component, so a remount picks up where the last mount left off: the box
 * it already knew (no flicker, no synchronous re-measure) and the churn budget it had already spent.
 */
const mirrorMemory = new Map<string, { box: MirrorBox | null; chase: MirrorChase }>();

function ChromeMirror({ blockId, children }: { blockId: string; children: ReactNode }) {
  const remembered = mirrorMemory.get(blockId);
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(remembered?.box ?? null);
  const [, remeasure] = useReducer((n: number) => n + 1, 0);
  const blockIdRef = useRef(blockId);
  useEffect(() => { blockIdRef.current = blockId; }, [blockId]);

  // Scrolling and window resizing move the block without re-rendering anything here, so they have to ask.
  useEffect(() => {
    // A REAL signal restores the churn budget: scrolling and resizing are the user moving the block, so the
    // mirror must follow however many frames that takes. Only a layout arguing with itself is given up on.
    const onMove = () => { churn.current = { churn: 0, seen: churn.current.seen }; remeasure(); };
    /**
     * A DRAG IS A REAL SIGNAL TOO — and leaving it off this list is what marooned the handles.
     *
     * The budget exists to abandon a layout that argues with ITSELF. A pointer held down is the user
     * arguing with it, and that must be followed for as many frames as the gesture lasts. Re-arming here
     * costs one object write per move and no render: the drag is already committing a tree per frame, so
     * the measurement it needs is coming anyway.
     *
     * Gated on the button being DOWN, so hovering the page does not quietly switch the bound off — capture
     * phase, because the handle's own mousedown stops propagation before any bubble listener would see it.
     */
    /**
     * …BUT A GESTURE RESTORES THE BUDGET, IT DOES NOT ABOLISH IT.
     *
     * Re-arming on every `pointermove` meant the bound was switched OFF for as long as the pointer was down —
     * which is exactly when the user hit "Maximum update depth exceeded". A drag is a real signal, so it may
     * buy more frames; it may not buy unlimited ones, or the protection is not a protection.
     *
     * `REARMS_PER_GESTURE` frames of chasing is far more than any honest drag needs — the drag commits a tree
     * per frame and the mirror follows it — and still a finite number.
     */
    const REARMS_PER_GESTURE = 120;
    let gesturing = false;
    let rearms = 0;
    const rearm = () => { churn.current = { churn: 0, seen: churn.current.seen }; };
    const onDown = () => { gesturing = true; rearms = 0; rearm(); };
    const onDrag = () => { if (gesturing && rearms++ < REARMS_PER_GESTURE) rearm(); };
    const onUp = () => { gesturing = false; };
    /**
     * A TRANSITION MOVES THE BLOCK WITH NO RENDER AT ALL, so it has to be followed by its own events (c-15).
     *
     * Choosing another screen size animates the page frame's width for 300ms (and docking the blocks panel animates the
     * room around it). The render that started it measured the block where it still WAS, nothing rendered again, and
     * the handles and toolbar stayed there — 97…1107 around a block that had come to rest at 415…790. Followed frame
     * by frame while anything that HOLDS this block is in transition, and measured once more when the last one ends.
     */
    const moving = new Set<EventTarget>();
    let follow = 0;
    const holdsBlock = (t: EventTarget | null) => { const el = document.querySelector(`[data-box-id="${CSS.escape(blockIdRef.current)}"]`); return !!el && t instanceof Node && t.contains(el); };
    const tick = () => { onMove(); follow = moving.size ? requestAnimationFrame(tick) : 0; };
    const onTransitionRun = (e: TransitionEvent) => { if (!holdsBlock(e.target)) return; moving.add(e.target!); if (!follow) follow = requestAnimationFrame(tick); };
    const onTransitionDone = (e: TransitionEvent) => { if (moving.delete(e.target!) || holdsBlock(e.target)) onMove(); };
    window.addEventListener("transitionrun", onTransitionRun, true);
    window.addEventListener("transitionend", onTransitionDone, true);
    window.addEventListener("transitioncancel", onTransitionDone, true);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointermove", onDrag, true);
    window.addEventListener("pointerup", onUp, true);
    window.addEventListener("pointercancel", onUp, true);
    return () => {
      cancelAnimationFrame(follow);
      window.removeEventListener("transitionrun", onTransitionRun, true);
      window.removeEventListener("transitionend", onTransitionDone, true);
      window.removeEventListener("transitioncancel", onTransitionDone, true);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointermove", onDrag, true);
      window.removeEventListener("pointerup", onUp, true);
      window.removeEventListener("pointercancel", onUp, true);
    };
  }, []);

  // Deliberately NO dependency array: a block's geometry changes without any prop of this component changing
  // (typing a longer heading, a reflow, a resize gesture in progress). It therefore MUST only call setBox
  // when something actually moved — a fresh object every pass would re-render, re-run this, and loop.
  //
  // AND IT MEASURES INSIDE A FRAME, which is what makes that safe rather than merely careful. The tolerance
  // below assumes the layout settles; when it does not — and a grid whose rows are partly `auto` and partly
  // `1fr` can genuinely oscillate by a fraction of a pixel — a synchronous measure-and-set chain runs until
  // React gives up with "Maximum update depth exceeded". Deferring to `requestAnimationFrame` breaks the
  // chain: the update lands in a new frame, React's nested-update counter starts over, and the very worst an
  // unsettled layout can now do is shimmer. A crash becomes a cosmetic bug, which is the right trade.
  const measured = useRef(false);
  /**
   * THE LOOP IS BOUNDED, not merely deferred — and it took a second report to learn the difference.
   *
   * measure → setState → render → measure is a cycle with no natural end. Deferring the re-measure to a
   * frame was supposed to break it, on the reasoning that React's nested-update counter starts over in a
   * new task. It does; what it does not do is STOP the cycle. A layout that will not settle — and a grid
   * whose rows are partly `auto` and partly `1fr` can oscillate by a fraction of a pixel forever — keeps
   * producing a different measurement every frame, so the chain runs on and "Maximum update depth
   * exceeded" comes back.
   *
   * Counting the consecutive changes is what ends it. After `MAX_CHURN` frames of chasing a value that
   * never settles, the mirror keeps the last one it had and stops asking. The chrome may sit a fraction of
   * a pixel out on a layout that was never going to settle; it cannot take the page down.
   *
   * The count resets on a real signal — a scroll, a window resize, a new block — so an honest movement is
   * always followed, and only a layout arguing with itself is abandoned.
   *
   * `boxRef` mirrors the state so the comparison happens OUTSIDE the updater: a state updater must be pure,
   * and React may call it twice, which would double-count the churn and halve the budget.
   */
  const MAX_CHURN = 8;
  // Seeded from what the last mount knew — see `mirrorMemory`. A remount must not hand the loop a fresh budget.
  const churn = useRef<MirrorChase>(remembered?.chase ?? { churn: 0, seen: null });
  const boxRef = useRef<MirrorBox | null>(remembered?.box ?? null);
  useEffect(() => {
    const prior = mirrorMemory.get(blockId);
    churn.current = prior?.chase ?? { churn: 0, seen: null };
    boxRef.current = prior?.box ?? null;
  }, [blockId]);
  useEffect(() => {
    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(blockId)}"]`);
      const r = el?.getBoundingClientRect();
      /**
       * THE CHROME NEVER DRAWS OUTSIDE THE CANVAS (#49). It lives in a portal over the whole window, so a block
       * scrolled under the Inspector, or up under the toolbar, had its handles painted ON TOP of them — found at a
       * real 1536×864 screen with the Desktop canvas chosen. It is clipped to the scroll area that holds the block:
       * the inset is measured from the block's box to that area's edges, negative where the area is larger, so a
       * handle hanging just past the block still shows while anything beyond the canvas does not.
       *
       * The area is the one the editor MARKS (`data-canvas-scroller`), never "the nearest ancestor that hides its
       * overflow": a block with `overflow: hidden` is such an ancestor, and clipping to it put the clip's top 447px
       * below the block's own top — measured on a row of text-filled stacks at the fitted Desktop canvas (#54).
       */
      const s = el?.closest("[data-canvas-scroller]")?.getBoundingClientRect();
      const px = (v: number) => `${Math.round(v)}px`; // whole pixels: sub-pixel noise must not read as a change and feed the churn guard
      const clipPath = r && s ? `inset(${px(s.top - r.top)} ${px(r.right - s.right)} ${px(r.bottom - s.bottom)} ${px(s.left - r.left)})` : undefined;
      const next = r ? { left: r.left, top: r.top, width: r.width, height: r.height, clipPath } : null;
      // The decision itself lives in `shouldTakeMirrorBox` (box-model), pure and unit-tested — the browser
      // condition that triggers the runaway has resisted every attempt to reproduce, so testing the rule is
      // the only honest guard for it.
      const verdict = shouldTakeMirrorBox(boxRef.current, next, churn.current, MAX_CHURN);
      churn.current = verdict.state;
      // Written out on EVERY pass, not only when the box is taken: the budget is the half that has to
      // survive a remount, and a mirror that gives up is precisely the one that must not forget it did.
      mirrorMemory.set(blockId, { box: verdict.take ? next : boxRef.current, chase: verdict.state });
      if (!verdict.take) return;
      boxRef.current = next;
      setBox(next);
    };
    // The FIRST measurement is synchronous, so selecting a block shows its toolbar and handles immediately —
    // deferring that one put the chrome a frame behind the click, which is exactly the kind of lag that
    // makes an editor feel loose. Every measurement AFTER it waits for a frame, and that is the one that
    // matters: a re-measure is the only one that can chain, and a frame boundary is what stops it.
    /**
     * …AND ONLY FOR A BLOCK THIS MIRROR HAS NEVER MEASURED. On a REMOUNT the box is already known, so there
     * is no lag to avoid — and taking the synchronous path again is what turns a remount-per-render into an
     * unbounded synchronous chain. Deferring it hands the loop a frame boundary, which is the one thing that
     * reliably ends it.
     */
    if (mirrorMeasuresNow(measured.current, !!remembered)) { measured.current = true; measure(); return; }
    measured.current = true;
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  });

  if (!box) return null;
  return createPortal(
    <div
      // NAMED so a drag can move it WITHIN THE FRAME, without a render. A drag paints itself straight onto
      // the DOM (see `paintPreview`), so nothing re-renders while the pointer is down and this mirror —
      // which only re-measures on a render — would otherwise sit frozen at the size the box had when the
      // drag began: the handles would come away from the box the moment it started to change.
      data-chrome-mirror={blockId}
      style={{ position: "fixed", ...box, pointerEvents: "none", zIndex: CHROME_Z.handle }}
    >{children}</div>,
    document.body,
  );
}

export default function BoxCanvas({
  root, theme, editable = true, selectedId, onSelectId, selectedIds, onSelectIds, onChange, onResized, minHeight = 600, breakpoint = "base", showHidden = false, marqueeRoom,
}: {
  root: BoxNode;
  theme: SiteTheme;
  editable?: boolean;
  selectedId?: string | null;                     // single selection (kept for back-compat / simple callers)
  onSelectId?: (id: string | null) => void;
  selectedIds?: string[];                          // MULTI selection (marquee): takes precedence when provided
  onSelectIds?: (ids: string[]) => void;
  /** `mergeKey`: every change carrying the same key is ONE undo step — a drag is one gesture, not one step per frame. */
  onChange: (root: BoxNode, mergeKey?: string) => void;
  onResized?: (id: string, axis: "width" | "height") => void;
  /** The grey space around the page: a box dragged from THERE selects too, as the inspector's hint promises (S1-i). */
  marqueeRoom?: React.RefObject<HTMLElement | null>;
  minHeight?: number; // the page's minimum height (≈ a viewport); the page GROWS past this with content
  breakpoint?: Breakpoint; // active responsive breakpoint — edits at tablet/mobile write per-breakpoint overrides
  showHidden?: boolean;    // draw blocks hidden at this breakpoint faintly (off: they are gone, as on the published page)
}) {
  const [menuFor, setMenuFor] = useState<string | null>(null); // which box's actions dropdown is open
  // The "add a block inside" menu an EMPTY box's own + opens. Separate from `menuFor`, which is the whole
  // actions dropdown: this one offers only the thing the empty box is asking for.
  const [addInside, setAddInside] = useState<{ id: string; anchor: MenuAnchor } | null>(null);
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
  // THE PAGE'S SEMANTICS — the SAME resolver the export uses, so the canvas renders the elements that publish (rule 11).
  // The automatic <main> is the one thing not drawn here: it has no box and changes nothing you can see, and an extra
  // element between the page and its bands would change what the resize and drop code reads as a band's parent.
  const sem = useMemo(() => resolvePage(root), [root]);
  const canvasRef = useRef<HTMLDivElement | null>(null); // the canvas surface — the masonry measure searches it
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
  /**
   * THE CARET GOES WITH THE SELECTION — done HERE, at the moment the selection changes, and never in an
   * effect that watches it.
   *
   * Clicking a container selects it, but the click also lands on whatever is inside, and a text block's
   * `contentEditable` span takes focus. The two then disagree: the selection is the SECTION while
   * `document.activeElement` is a span belonging to a text block three levels down. Measured exactly that —
   * `{selection: "sec", activeElement: SPAN, its block: "tc1"}`. The key handler refuses to act while focus
   * is in editable text, which is right, so with the caret stranded in a block nobody chose, **every**
   * shortcut silently did nothing: Alt+F, Delete, Ctrl+D, Ctrl+C, every arrow key.
   *
   * THE FIRST FIX FOR IT WAS AN EFFECT ON THE SELECTION, AND IT TOOK THE EDITOR DOWN. Blurring changes
   * focus, which can change the selection, which re-ran the effect, which blurred again: "Maximum update
   * depth exceeded", reported from a real page with a screenshot. A selection change is an EVENT, not a
   * state to reconcile — so it is handled where the event happens, once, with no render in the loop.
   */
  const emitSelection = (ids: string[]) => {
    /**
     * ONCE, AND SYNCHRONOUSLY — the second shot on the next frame ATE THE USER'S TYPING and had to go.
     *
     * Measured, from a fresh load: one click on a text block, a 700ms human pause, then type — and the text
     * went nowhere in 2 of 3 trials. The reason is the drill-down rule: the first click on a text block
     * selects the outermost BAND, not the text, so one frame later `owner !== wanted` was true of the very
     * span the user had just clicked into, and the deferred pass blurred it. The synchronous pass cannot
     * make that mistake: it runs inside the pointer handler, BEFORE the browser moves focus, so all it can
     * ever see is a caret left over from an earlier edit.
     *
     * What the deferred pass was there for — focus that arrives after the selection does — is handled by the
     * pointer rule below, which asks the only question that distinguishes the two cases: did the click land
     * inside the text being edited?
     */
    const wanted = ids[0] ?? null;
    const ae = document.activeElement as HTMLElement | null;
    if (ae?.isContentEditable) {
      const owner = ae.closest("[data-box-id]")?.getAttribute("data-box-id") ?? null;
      if (owner && owner !== wanted) ae.blur(); // typing in the block you are selecting is left alone
    }
    onSelectIds?.(ids); onSelectId?.(ids[0] ?? null);
  };
  const select = (id: string | null) => emitSelection(id ? [id] : []);

  /**
   * Does the selected block's toolbar sit ABOVE its box, or flip BELOW it?
   *
   * THIS STATE LIVES HERE, AND THAT IS THE POINT. It belonged to `NodeToolbar`, which is declared inside
   * this component — so React gave it a new function identity on every render, unmounted it and mounted a
   * fresh one each time. An effect re-runs on mount whatever its dependency array says, so the `[node.id]`
   * guard that was added to stop this exact crash ("Maximum update depth exceeded") could never hold: every
   * render measured, set state, and rendered again.
   *
   * That is the same structural fault that defeated `ChromeMirror`'s `measured` ref — two correct fixes for
   * one crash, both nullified by where their components were declared. Hoisting the STATE is the smaller of
   * the two remedies: `NodeToolbar` keeps its place and simply stops carrying hooks, so remounting it is
   * merely wasteful rather than dangerous.
   *
   * Measured against the BLOCK rather than the toolbar's own parent: the chrome mirror is an exact copy of
   * the block's rect, so the block gives the same answer and is always in the DOM — the mirror is not, on
   * the first render after a selection.
   */
  const soloId = selSet.size === 1 ? [...selSet][0] : null;
  const [toolbarBelow, setToolbarBelow] = useState(false);
  useEffect(() => {
    if (!soloId) return;
    const measure = () => {
      const box = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(soloId)}"]`);
      if (!box) return;
      const canvasTop = document.querySelector(`[data-box-id="${CSS.escape(rootRef.current.id)}"]`)?.getBoundingClientRect().top ?? 0;
      // Within 36px of the canvas top there is no room above, so the bar drops BELOW the box rather than
      // sitting over the app header. Only written when it actually changes, so a stable page settles.
      setToolbarBelow((prev) => { const next = box.getBoundingClientRect().top < canvasTop + 36; return next === prev ? prev : next; });
    };
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    // …AND WHEN THE PAGE ITSELF CHANGES SIZE (c-20). Docking the blocks panel refits the page (to 77% in a 1520px window)
    // and choosing a screen size changes its width — both by a transition, neither a scroll nor a resize. The block moved
    // up under the 36px line and the bar stayed above it, over the top edge of the page, until the block was re-selected.
    window.addEventListener("transitionend", measure, true);
    return () => { window.removeEventListener("scroll", measure, true); window.removeEventListener("resize", measure); window.removeEventListener("transitionend", measure, true); };
  }, [soloId]);

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
  const startMarqueeArm = (e: { clientX: number; clientY: number }) => {
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
  // …and from the grey room around the page (S1-i). Refs + [] (rule 2): the latest arm, one listener.
  const armFromRoom = useRef((e: MouseEvent) => { select(null); startMarqueeArm(e); });
  armFromRoom.current = (e: MouseEvent) => { select(null); startMarqueeArm(e); };
  useEffect(() => {
    const room = marqueeRoom?.current;
    if (!room || !editable) return;
    const down = (e: MouseEvent) => { if (e.button === 0 && !canvasRef.current?.contains(e.target as Node)) { e.preventDefault(); armFromRoom.current(e); } };
    room.addEventListener("mousedown", down);
    return () => room.removeEventListener("mousedown", down);
  }, []);

  // ── Copy / cut / paste (mouse buttons + keyboard). Paste drops INSIDE a selected container, else
  // right AFTER the selected box; with nothing selected it appends to the page. ──
  const copyBox = (id: string) => { const n = findByIdLocal(root, id); if (n) setClip(cloneBox(n)); };
  const cutBox = (id: string) => { if (id === root.id) return; const n = findByIdLocal(root, id); if (n) { setClip(cloneBox(n)); onChange(deleteBox(root, id)); select(null); } };
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

  /**
   * THE CANVAS PUBLISHES ITS OWN SCROLL, so a block that holds on screen can be SEEN holding.
   *
   * A user floated a stack, set it to float on screen, scrolled, and watched it leave — while the published
   * page held it perfectly. Inside the editor a fixed box is captured by the page frame's `container-type`
   * (the thing that makes container queries work), so it can only ever be measured against the page, which
   * scrolls. `canvasFixedStyle` therefore keeps such a block in the page and adds this offset to it, which
   * is the same picture from the other direction.
   *
   * The nearest scrolling ancestor is FOUND rather than assumed, and it is looked up by its overflow alone —
   * not by whether it happens to be scrollable at that instant, because a short page becomes a long one the
   * moment a block is added.
   */
  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return;
    let scroller: HTMLElement | null = host.parentElement;
    while (scroller && !/auto|scroll/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;
    let raf = 0;
    const write = () => {
      raf = 0;
      /**
       * SCREEN PIXELS IN, LAYOUT PIXELS OUT (Z1-a). The scroll, the view's height and these rects are measured on
       * screen, but the variables are used as lengths INSIDE the zoomed frame, where the zoom applies to them again.
       * Written raw, a held block slid by scroll × (1 − zoom) whenever a device was fitted below 100% — measured
       * through the UI: 72px at 82% (Desktop), 180px at 55% (Wide), over a 400px scroll.
       */
      const z = zoomOf(host);
      const scrolled = scroller ? scroller.scrollTop : window.scrollY;
      host.style.setProperty("--canvas-scroll", `${Math.round(scrolled / z)}px`);
      host.style.setProperty("--canvas-h", `${Math.round((scroller ? scroller.clientHeight : window.innerHeight) / z)}px`);
      // How far the PAGE sits below the top of the scrolling area — the canvas's own padding, which the page
      // being edited does not have. Without it a block held at the page's top edge keeps that padding as a
      // gap above it for the whole scroll, which is exactly what a user reported seeing.
      const inset = scroller
        ? host.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scrolled
        : host.getBoundingClientRect().top + scrolled;
      host.style.setProperty("--canvas-top", `${Math.round(inset / z)}px`);
    };
    // One write per frame at most: a scroll fires far faster than the screen refreshes, and this only moves
    // an inline variable — there is nothing to be gained by doing it twice between paints.
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(write); };
    write();
    const src: HTMLElement | Window = scroller ?? window;
    src.addEventListener("scroll", onScroll, { passive: true });
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(write);
    if (ro && scroller) ro.observe(scroller);
    // …and the page's own box: choosing a device changes the zoom without resizing the scroller.
    if (ro) ro.observe(host);
    return () => {
      src.removeEventListener("scroll", onScroll);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /**
   * WHERE EACH HELD BLOCK'S HOLDER SITS — the other half of drawing `position: fixed` without it.
   *
   * The simulated block is `absolute`, so it is measured from its nearest POSITIONED ancestor: the band it
   * lives in, not the page. A bar in the first band sits a few pixels below the page's top, which is why it
   * looked correct and its guard passed; a block further down the page landed at its own band instead —
   * measured 1,488px down. This writes that distance onto the block so every held block is measured from
   * the same origin the window gives it on the published page.
   *
   * No dependency array, like the masonry pass above and for the same reason: it has to be re-taken after
   * any render that could have moved anything. It writes an inline variable and never calls setState, so it
   * cannot loop.
   */
  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return;
    const page = host.querySelector<HTMLElement>("[data-box-id]");
    if (!page) return;
    const pageTop = page.getBoundingClientRect().top;
    const z = zoomOf(host); // a screen distance, used as a length inside the zoomed frame (Z1-a)
    host.querySelectorAll<HTMLElement>("[data-held]").forEach((el) => {
      const holder = el.offsetParent as HTMLElement | null;
      const top = holder ? (holder.getBoundingClientRect().top - pageTop) / z : 0;
      el.style.setProperty("--holder-top", `${Math.round(top)}px`);
    });
  });

  // MASONRY, measured (C). The canvas calls the very function whose SOURCE the exported page ships
  // (`masonryMeasurePass` / `masonryMeasureScript`), so the editor cannot drift from the published site — the
  // trap this project has paid for four times. Only galleries that opted in carry the marker, so a canvas with
  // none does nothing but one querySelectorAll.
  //
  // No dependency array on purpose: the spans have to be re-taken after ANY render that could have changed a
  // height. It is safe to do that here because the pass writes inline styles and never calls setState — the
  // render-loop hazard this file guards against elsewhere needs a setState to exist at all.
  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return;
    const run = () => {
      host.querySelectorAll<HTMLElement>("[data-eu-masonry]").forEach((g) => masonryMeasurePass(g));
      // STACKED PINS (Step 2c) — the same function the export ships the source of, so two bars held at one
      // edge sit under one another on the canvas exactly as they will on the page. It rides in this pass
      // because it needs the same triggers: a re-render, a resize, a font landing, a photo decoding.
      pinStackPass(host);
    };
    run();
    // A ResizeObserver catches what a render does not: a photo decoding, a web font landing, the device frame
    // being dragged. The pass is idempotent, so a re-run that changes nothing writes the same spans and the
    // observer settles instead of looping. Guarded because jsdom has no ResizeObserver and a missing browser
    // API must never take the editor down in a test.
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(run);
    ro.observe(host);
    return () => ro.disconnect();
  });

  /**
   * THE CARET LEAVES WHEN THE POINTER LANDS OUTSIDE IT. The question is WHERE THE CLICK WENT — never what is
   * selected, and never what the selection is about to become.
   *
   * Two bugs, one on each side of that distinction, and asking about the selection cannot answer both:
   *
   *   • Click the empty part of a container while a text block inside it holds the caret. The selection is
   *     the container; `document.activeElement` is a span three levels down that nobody chose. The key
   *     handler above refuses to act while focus is in editable text, so EVERY shortcut silently does
   *     nothing — Alt+F, Delete, Ctrl+D, the arrows.
   *   • Click a text block to edit it. The drill-down rule selects the outermost BAND on that first click,
   *     so "is the caret's block the selected one?" is FALSE of the span the user just clicked into — and
   *     the answer "blur it" throws their typing away. Measured: 2 of 3 trials lost the text.
   *
   * Where the pointer landed separates them exactly. Inside the focused editable → the user is aiming at
   * that text, so it keeps the caret however the selection resolves. Anywhere else on the canvas → the caret
   * has been left behind, and it goes.
   *
   * AND THE RANGE GOES WITH IT, which is the part a blur alone gets wrong. Chrome restores focus to whatever
   * holds the document's Selection: blurring `t1` put the caret straight into `t0` one frame later — focusin
   * logged with no `.focus()` call anywhere in the trace — and it sat there for up to a second, shortcuts
   * dead, until an unrelated re-render happened to clear it. Dropping the range removes the thing Chrome
   * restores to, so the blur sticks.
   *
   * ── IT IS THE BROWSER THAT PUTS THE CARET THERE, SO THE DEFAULT IS WHAT HAS TO BE REFUSED ──
   *
   * Clearing up after the click does not work, and three measurements said so before this line was written.
   * Blurring on `pointerdown` and dropping the range left the caret back in `t0` seventeen milliseconds
   * later — a fresh `focusin` on the ORIGINAL span (tagged and checked: React had not re-created it), with
   * no `.focus()` call and no Selection call anywhere in the trace. Seventeen milliseconds after mousedown
   * is mouseup, and that is Chrome finishing the click: it looks for the nearest caret position to the
   * point, finds one inside the only editable in that column, and focuses it. Clicking the empty part of a
   * box has always meant "put the caret in the text near here" to the browser.
   *
   * So the default action is refused instead, with `preventDefault()` on `mousedown` — the one event whose
   * default that is. Nothing to chase a frame later, because the caret never moves in the first place.
   *
   * REFUSING IT MEANS OWNING WHAT IT USED TO DO. That same default is what blurred the old field when you
   * clicked away, so this has to do it by hand — and for text inputs too, not only editables: the key
   * handler above declines just as firmly for an INPUT, so an Inspector field left focused would disable
   * every shortcut in exactly the same way.
   *
   * IT READS NO STATE AND SETS NONE, so — unlike the effect that first fixed the stranded caret and took the
   * editor down with "Maximum update depth exceeded" — there is nothing here to re-enter. The empty
   * dependency list is part of that, not an oversight.
   *
   * WHAT IT DELIBERATELY DOES NOT TOUCH:
   *   • anything outside the canvas — the Inspector, the toolbars and the top bar act ON the text being
   *     edited, so a formatting control must never throw the caret away before its own click is handled;
   *   • a click aimed INTO the focused text, which is the user moving their own caret;
   *   • a button, link, field or anything else focusable on the canvas, which needs the default it is asking
   *     for. `[contenteditable]` is in that list so clicking straight from one text block into another still
   *     lands the caret where it was aimed.
   */
  useEffect(() => {
    const KEEPS_DEFAULT = 'button, a, input, textarea, select, label, [role="button"], [contenteditable], [tabindex]';
    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // a right-click opens a menu; it is not a click away from the text
      const target = e.target as HTMLElement | null;
      const canvas = canvasRef.current;
      if (!target || !canvas || !canvas.contains(target)) return;
      const ae = document.activeElement as HTMLElement | null;
      const holdsText = !!ae && (ae.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(ae.tagName));
      if (holdsText && ae && (ae === target || ae.contains(target))) return; // aimed at the text being edited
      if (target.closest(KEEPS_DEFAULT)) return; // it needs the focus the default would give it
      if (holdsText && ae) {
        ae.blur(); // blur FIRST: the block commits its text on blur, and that must read the real DOM
        // The range is dropped too, because Chrome restores focus to whatever the document's selection points
        // at. We are only here because the pointer went down outside every editable, so it is a leftover.
        window.getSelection()?.removeAllRanges();
      }
      e.preventDefault(); // …and no new caret, which is the whole point
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, []);

  // Keyboard operations on the selected box (WCAG): copy/cut/paste, duplicate, delete, reorder, deselect.
  useEffect(() => {
    if (!editable) return;
    const onKey = (e: KeyboardEvent) => {
      const ae = document.activeElement as HTMLElement | null;
      if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable)) return; // never hijack text editing
      // …nor a CONTROL outside the page that has the focus (Z1-j). With a block selected, Enter on a focused toolbar
      // button edited the block's words instead of pressing the button (the zoom menu, Preview, Export never opened by
      // keyboard), and Delete on a focused button DELETED the selected block. A focused control owns the keys it USES —
      // Escape and the Ctrl shortcuts mean nothing to a button, so they still reach the page (Escape steps out a level
      // even after an Inspector button was clicked; taking it too broke selecting on tier-99 page 153).
      if (["Enter", " ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Delete", "Backspace", "Home", "End"].includes(e.key)
        && ae && ae !== document.body && !canvasRef.current?.contains(ae)
        && ae.closest("button, a[href], select, [role=button], [role=option], [role=menuitem], [role=menuitemradio], [role=listbox], [role=tab], [role=radio], [role=checkbox], [role=switch], [role=slider]")) return;
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
      else if ((e.key === "Delete" || e.key === "Backspace") && ids.length) { let next = root; for (const d of ids) if (d !== root.id) next = deleteBox(next, d); onChange(next); select(null); e.preventDefault(); } // delete ALL selected
      else if (e.key === "ArrowUp" && id && !rn.locked) { if (floating) onChange(writeBox(root, id, { top: round1((rn.top ?? 0) - stepPct("y")) })); else onChange(moveBoxStep(root, id, -1)); e.preventDefault(); }
      else if (e.key === "ArrowDown" && id && !rn.locked) { if (floating) onChange(writeBox(root, id, { top: round1((rn.top ?? 0) + stepPct("y")) })); else onChange(moveBoxStep(root, id, 1)); e.preventDefault(); }
      else if (e.key === "ArrowLeft" && id && floating && !rn.locked) { onChange(writeBox(root, id, { left: round1((rn.left ?? 0) - stepPct("x")) })); e.preventDefault(); }
      else if (e.key === "ArrowRight" && id && floating && !rn.locked) { onChange(writeBox(root, id, { left: round1((rn.left ?? 0) + stepPct("x")) })); e.preventDefault(); }
      // ── ENTER / F2 BEGINS EDITING — the way IN that Escape's way OUT always implied ──
      // Every other operation on this canvas had a shortcut, but editing the WORDS — the commonest act in a
      // website builder — was mouse-only, so a keyboard user could select a heading and never type into it.
      // Measured before this existed: Enter on a freshly added Heading left `activeElement` on BODY and the
      // typing went nowhere (WCAG 2.1.1, and Core Rule 2's "no feature should be mouse-only").
      // Neither key collides: inside the text Enter already means "commit", and this handler declines outright
      // while an editable holds the focus.
      else if ((e.key === "Enter" || e.key === "F2") && id && !rn.locked) {
        const host = ownEditable(id);
        if (host) { host.focus(); caretToEnd(host); e.preventDefault(); }
      }
      // Escape steps OUT one level — the other half of "click goes inside". From the outermost block (or from
      // nothing in particular) it clears the selection, so Escape still always ends somewhere predictable.
      else if (e.key === "Escape") {
        const chain = id ? selectionChain(root, id) : [];
        const at = chain.indexOf(id ?? "");
        select(at > 0 ? chain[at - 1] : null);
      }
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
    if (isContainer(n)) return containerLabel(n);
    const t = n.text?.trim();
    if (n.type === "heading") return t ? `Heading: ${t.slice(0, 18)}` : "Heading";
    if (n.type === "button") return t ? `Button: ${t.slice(0, 14)}` : "Button";
    if (n.type === "link") return t ? `Link: ${t.slice(0, 16)}` : "Link";
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
  type Drop = { target: { parentId: string; index: number }; rect: { left: number; top: number; width: number; height: number; inside: boolean }; moveWidth?: string; wrapUnder?: { id: string; before: boolean } };

  // Pick the drop SLOT among a container's children from the ACTUAL laid-out geometry — not the nominal
  // flex-direction. This is what makes drops land where the line shows even when a "row" wraps: full-width
  // sections stack (we compare vertically, draw a horizontal line); side-by-side blocks share a row (we
  // compare horizontally, draw a vertical line). We find the child nearest the cursor, detect whether it
  // sits BESIDE a sibling (same row) or is stacked, then decide before/after on that local axis.
  const slotFromKids = (parentEl: HTMLElement, kidEls: HTMLElement[], x: number, y: number): { index: number; rect: Drop["rect"]; moveWidth?: string; rowFlow?: boolean; wrapUnder?: Drop["wrapUnder"] } => {
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
    /**
     * UNDER THIS COLUMN, rather than beside it.
     *
     * A band is a row, so the test below reads "the nearest block shares its line with someone, therefore
     * this is a side-by-side drop" — whatever the pointer's height. Aim at the empty space beneath the
     * SHORTER of two columns and the block was wedged in as a third column, which is not remotely what the
     * gesture meant.
     *
     * The three conditions together are what make the intent unambiguous, and none of them can be dropped:
     * the pointer is horizontally INSIDE that block's column (so it is about that column, not the band),
     * it is vertically OUTSIDE the block (so it is not simply on it), and a neighbour on the line is TALLER
     * (so there is real empty space under it to aim at — without this, "below" means below the whole band).
     */
    const kidId = kidEls[k].getAttribute("data-box-id");
    const tallerNeighbour = rects.some((r, i) => i !== k && sameRow(r, kr) && (r.bottom > kr.bottom + 4 || r.top < kr.top - 4));
    if (kidId && tallerNeighbour && x >= kr.left && x <= kr.right && (y > kr.bottom || y < kr.top)) {
      const above = y < kr.top;
      return {
        index: k,
        // A line the width of THAT COLUMN — narrower than the band-wide line that means "a new band below".
        // The difference in width is the whole explanation of which one you are about to get.
        rect: { left: kr.left, top: (above ? kr.top : kr.bottom) - T / 2, width: kr.width, height: T, inside: false },
        moveWidth: "100%",
        wrapUnder: { id: kidId, before: above },
      };
    }
    const onKrLine = y >= kr.top && y <= kr.bottom;
    /**
     * AIMING AT A BLOCK'S LEFT OR RIGHT EDGE MEANS "BESIDE IT", even when the block fills the line.
     *
     * The gap test below — is the pointer horizontally OUTSIDE this block — only answers the question when
     * there is a gap to be outside of. A block at full width has none, so a drop anywhere on it read as
     * "stacked", and once a stacked reading inside a band became "a new band below" (the fix for the
     * indicator that promised one placement and delivered another), adding a SECOND COLUMN to a full-width
     * band stopped being possible at all. That is the oldest gesture in the builder, and its own comment has
     * always described it: "hover the LEFT/RIGHT of a SECTION to place another section alongside it".
     *
     * So the edge is a target in its own right. The middle of the block still means below, which is what
     * keeps the two readings distinct.
     */
    /**
     * THE EDGES PLACE THINGS AROUND A BLOCK; THE MIDDLE PLACES THEM INSIDE IT.
     *
     * One rule on both axes, which is what makes it learnable: the LEFT and RIGHT strips mean beside, the
     * TOP and BOTTOM strips mean above and below, and everything in between means inside.
     *
     * Before this there was no way at all to put a block BELOW one whose width had been reduced. The gap
     * beside it meant "beside"; the block itself meant "inside"; and the canvas is exactly as tall as its
     * content, so there was nothing underneath to aim at either. Measured: of four sensible aims, one landed
     * beside, two landed nested inside, and the fourth did nothing whatsoever.
     *
     * The vertical strips are checked BEFORE the "shares a line with someone" test, because that test is
     * what used to make every drop near a column a side-by-side one regardless of height.
     */
    const edgeX = Math.min(kr.width * 0.25, 48);
    const edgeY = Math.min(kr.height * 0.25, 48);
    const withinX = x >= kr.left && x <= kr.right;
    /**
     * The side strips only mean "beside" where the parent CAN put things side by side.
     *
     * In a column, beside is not a placement the parent offers, so reading its left and right strips that
     * way turns an ordinary reorder into a no-op: dragging a block over the one below it, with the cursor
     * near the left edge, was read as "put it next to that" and the block never moved.
     *
     * Row-ness is read from the laid-out result rather than the stored direction — two children sharing a
     * line prove it whatever the tree says — and from the computed direction for the case that has only one
     * child, where there is no pair to prove it with.
     */
    const parentDir = typeof getComputedStyle === "function" ? getComputedStyle(parentEl).flexDirection : "";
    const parentPlacesSideBySide = parentDir.startsWith("row")
      || rects.some((r, i) => rects.some((r2, j) => j > i && sameRow(r, r2)));
    const nearSide = parentPlacesSideBySide && onKrLine && (x < kr.left + edgeX || x > kr.right - edgeX);
    const nearTopBottom = withinX && !nearSide && (y < kr.top + edgeY || y > kr.bottom - edgeY);
    const rowFlow = nearSide
      || (onKrLine && (x < kr.left || x > kr.right))          // in a gap on this line → beside
      || (!nearTopBottom && rects.some((r, i) => i !== k && sameRow(r, kr)));
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
    return { index, rect, moveWidth, rowFlow };
  };

  /**
   * A STACKED drop inside a ROW BAND belongs in a NEW BAND, not in that band.
   *
   * A row band lays its children out side by side — that is what it is for — so inserting into one always
   * produces a block BESIDE the others, whatever the pointer meant. But the canvas draws a horizontal "new
   * line below" indicator for a stacked reading, so it was promising a placement it then did not deliver.
   *
   * It went unseen for a long time because the mis-placed block was INVISIBLE: an empty box had no minimum,
   * so it rendered zero-height and nobody could see it sitting in the wrong place. Giving empty boxes a floor
   * (`EMPTY_BOX_MIN`) is what made it show up — one bug hiding inside another.
   *
   * The redirect is to the band's own parent, which is a content container: `normalizeRowBands` wraps a bare
   * child of one in a band of its own, so the block arrives full width on its own line — which is exactly
   * what the indicator drew, and exactly what "add it underneath" has to mean.
   */
  const bandRedirect = (parentId: string, slot: { index: number; rect: Drop["rect"]; moveWidth?: string; rowFlow?: boolean; wrapUnder?: Drop["wrapUnder"] }): Drop | null => {
    const band = findByIdLocal(rootRef.current, parentId);
    if (slot.wrapUnder) return null;                       // "under THIS column" is a different answer entirely
    if (!band?.rowBand || slot.rowFlow) return null;       // not a band, or the pointer meant "beside" after all
    const up = findParent(rootRef.current, parentId);
    if (!up) return null;                                   // the page root has no parent to put a band in
    // Above the band's first child means above the band; anywhere else means below it.
    const at = up.index + (slot.index === 0 ? 0 : 1);
    return { target: { parentId: up.parent.id, index: at }, rect: slot.rect, moveWidth: "100%" };
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
    // BOTH axes, not just the parent's main one. Checking only the main axis meant that inside a row band —
    // where the main axis is horizontal — the top and bottom strips of a block were not edges at all, so a
    // drop there fell through to "inside this container" and the block ended up nested. The strips are the
    // same on both axes because the rule is the same on both: edges place around, the middle places inside.
    const bx = Math.min(r.width * 0.22, 22), by = Math.min(r.height * 0.22, 22);
    const nearEdge = (x < r.left + bx || x > r.right - bx) || (y < r.top + by || y > r.bottom - by);
    const dropBeside = !isContainer(node) || (nearEdge && !!info);
    if (dropBeside && info) {
      const pEl = document.querySelector<HTMLElement>(`[data-box-id="${info.parent.id}"]`);
      if (pEl) {
        const s = slotFromKids(pEl, directKids(pEl), x, y);
        return bandRedirect(info.parent.id, s) ?? { target: { parentId: info.parent.id, index: s.index }, rect: s.rect, moveWidth: s.moveWidth, wrapUnder: s.wrapUnder };
      }
    }
    const s = slotFromKids(hitEl, directKids(hitEl), x, y); // drop INSIDE this container
    return bandRedirect(node.id, s) ?? { target: { parentId: node.id, index: s.index }, rect: s.rect, moveWidth: s.moveWidth, wrapUnder: s.wrapUnder };
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
    const gk = `gesture:${Date.now()}`; // one undo step for the whole gesture, however many frames it paints
    e.preventDefault(); e.stopPropagation();
    const id = node.id;
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    if (!el) return;
    const g = measureFloatGeom(rootRef.current, id);
    if (!g) return;
    if (lift && !isFloating(node)) onChange(floatBox(rootRef.current, id, g.parentId, g.left, g.top, g.width, g.height), gk); // lift the flow box onto its own layer, exactly where it sits
    const pEl = document.querySelector<HTMLElement>(`[data-box-id="${g.parentId}"]`);
    if (!pEl) return;
    const pr = pEl.getBoundingClientRect(), cs = getComputedStyle(pEl);
    // Screen pixels throughout (see `zoomOf`): computed paddings are layout px, so they are scaled on the way in.
    const Z = zoomOf(el);
    const padL = (parseFloat(cs.paddingLeft) || 0) * Z, padT = (parseFloat(cs.paddingTop) || 0) * Z, padR = (parseFloat(cs.paddingRight) || 0) * Z, padB = (parseFloat(cs.paddingBottom) || 0) * Z;
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
    const flush = () => { raf = 0; if (pending) { onChange(pending, gk); pending = null; } };
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

  /**
   * WHILE SOMETHING IS BEING DRAGGED IN, THE EDITOR'S OWN CHROME LETS THE POINTER THROUGH (tier 99, c-5).
   *
   * The selected block's toolbar hangs just under it — which is over whatever comes next on the page — and it takes the
   * pointer, as a toolbar must. So a tile let go "just under this block" was let go ON the toolbar: the drop marker had
   * been showing, and nothing was added. Measured through the UI (scripts/uat/probe-t9.js): three releases on the
   * toolbar added nothing, two a few pixels beside it added the block; 15 of 403 real pages could not be built for it.
   * Nobody uses a toolbar with a block in their hand, so for as long as a drag is over the window the chrome is not
   * there for the pointer — the drop lands on the page beneath it, where the marker said it would.
   *
   * Every drag, not only a palette tile: a photograph dragged in from the desktop never fires `dragstart` in this
   * document, so `dragenter` and `dragover` raise the flag too, and leaving the window lowers it.
   */
  useEffect(() => {
    const raise = () => { if (document.body.dataset.boxDragIn === undefined) document.body.dataset.boxDragIn = ""; };
    const lower = () => { delete document.body.dataset.boxDragIn; };
    const left = (e: Event) => { if (!(e as DragEvent).relatedTarget) lower(); };
    const wired: [string, (e: Event) => void][] = [["dragstart", raise], ["dragenter", raise], ["dragover", raise], ["drop", lower], ["dragend", lower], ["dragleave", left]];
    for (const [name, fn] of wired) window.addEventListener(name, fn, true);
    return () => { for (const [name, fn] of wired) window.removeEventListener(name, fn, true); lower(); };
  }, []);

  // ── Drag a NEW block from the palette onto the canvas (native HTML5 DnD) ──────────────────────────
  // The palette sets `application/x-box-block` = the block kind; the canvas shows the same drop line and
  // inserts a fresh node where you release (filling the line's leftover width when dropping beside).
  const PALETTE_TYPE = "application/x-box-block";
  const nodeForKind = (kind: string): BoxNode => blockForKind(kind);
  const onCanvasDragOver = (e: React.DragEvent) => {
    // FILES COUNT AS SOMETHING DROPPABLE, and this is the half that makes the drop happen at all: a
    // browser only fires `drop` when `dragover` called `preventDefault()`. Left checking for a palette
    // tile alone, the drop handler below could never run for a photograph dragged off the desktop — the
    // page would simply open the picture as a document instead.
    if (!editable) return;
    const wanted = e.dataTransfer.types.includes(PALETTE_TYPE) || e.dataTransfer.types.includes("Files");
    if (!wanted) return;
    e.preventDefault(); e.dataTransfer.dropEffect = "copy";
    const hit = computeDrop(e.clientX, e.clientY, null);
    setDropRect(hit?.rect ?? null);
  };
  /** Where a dropped Columns block will go, held while the user picks its shape. */
  const [pendingGrid, setPendingGrid] = useState<{ anchor: MenuAnchor; parentId: string; index: number; moveWidth: string | null; selectAfter?: boolean } | null>(null);
  const [pendingGallery, setPendingGallery] = useState<{ anchor: MenuAnchor; kind: string; parentId: string; index: number; moveWidth: string | null } | null>(null);

  /** Put a freshly built block at a recorded slot — the tail of every palette insertion. */
  const insertAt = (node: BoxNode, parentId: string, index: number, moveWidth: string | null, wrapUnder?: { id: string; before: boolean }) => {
    // A new hugging block (Fit / width auto) stays hugging where it lands; only definite-width blocks fill the line.
    const hugs = !node.width || node.width === "auto";
    if (moveWidth && !hugs) node.width = moveWidth;
    // UNDER ONE COLUMN of a side-by-side band: that column becomes a Stack holding both, and the block beside
    // it is untouched. See `stackWithBlock`, which owns the tree surgery so the rule is unit-testable.
    if (wrapUnder) { onChange(stackWithBlock(rootRef.current, wrapUnder.id, node, wrapUnder.before)); return; }
    // A block landing on a line that is already full has to come from somewhere, so the line is shared out
    // (`fitBand`). This runs on the ADD and nowhere else: a width the user dragged is theirs, and is left
    // free to push a neighbour onto the next line. Doing it on every commit is what made wrapping impossible.
    onChange(fitBand(insertBox(rootRef.current, parentId, index, node), parentId, node.id));
  };

  /**
   * PHOTOGRAPHS DRAGGED IN FROM THE DESKTOP.
   *
   * This handler used to return the moment the drag carried no palette tile, so dropping a folder of
   * pictures onto the page did nothing whatsoever — no block, no message, no clue that it was even a
   * thing the builder had an opinion about. Dragging files onto a page is how everyone expects to add a
   * picture, and it was the single most obvious route to a gallery.
   *
   * ONE picture becomes an Image block; SEVERAL become a gallery, because that is plainly what was meant.
   * They go through `importPhoto` like every other upload, so they are downscaled on the way in and a
   * dropped folder cannot fill the browser's storage the way a full-size one would.
   */
  const onDropFiles = async (files: File[], parentId: string, index: number, moveWidth: string | null) => {
    const photos: GalleryPhoto[] = [];
    for (const file of files) {
      const { src, imgW, imgH } = await importPhoto(file);
      if (src) photos.push({ src, imgW, imgH, alt: file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim() });
    }
    if (!photos.length) return;
    const node = photos.length === 1
      ? createElement("image", { src: photos[0].src, imgW: photos[0].imgW, imgH: photos[0].imgH, alt: photos[0].alt, width: "100%", height: "auto" })
      : photoGallery(photos, { across: photos.length >= 6 ? 4 : 3 });
    insertAt(node, parentId, index, moveWidth);
  };

  const onCanvasDrop = (e: React.DragEvent) => {
    if (!editable) return;
    const kind = e.dataTransfer.getData(PALETTE_TYPE);
    // A DROP OF FILES, before the palette check — that check was the early return that made this silent.
    const dropped = Array.from(e.dataTransfer.files ?? []).filter((f) => f.type.startsWith("image/"));
    if (!kind && dropped.length) {
      e.preventDefault();
      const at = computeDrop(e.clientX, e.clientY, null);
      setDropRect(null);
      void onDropFiles(dropped, at ? at.target.parentId : rootRef.current.id,
        at ? at.target.index : rootRef.current.children?.length ?? 0, at?.moveWidth ?? null);
      return;
    }
    if (!kind) return;
    e.preventDefault();
    const hit = computeDrop(e.clientX, e.clientY, null);
    const parentId = hit ? hit.target.parentId : rootRef.current.id;
    const index = hit ? hit.target.index : rootRef.current.children?.length ?? 0; // empty canvas → append to the page
    const moveWidth = hit?.moveWidth ?? null;
    setDropRect(null);
    // A COLUMNS block is a SHAPE, and the shape is the user's to choose. Dropping one used to insert whatever
    // `blockForKind` decided on its own — two equal cells — so the section was divided by the act of dragging.
    // Now the drop marks the spot and the same picker the palette tile opens asks how it should be cut; the
    // grid is only inserted once that is answered, and dismissing the picker inserts nothing.
    if (kind === "grid") {
      setPendingGrid({ anchor: { top: e.clientY, bottom: e.clientY, left: e.clientX, right: e.clientX }, parentId, index, moveWidth });
      return;
    }
    insertAt(nodeForKind(kind), parentId, index, moveWidth, hit?.wrapUnder);
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
    const gk = `gesture:${Date.now()}`; // one undo step for the whole gesture, however many frames it paints
    e.preventDefault(); e.stopPropagation();
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    const info = findParent(rootRef.current, id);
    const node = findByIdLocal(rootRef.current, id);
    if (!el || !info || !node) return;
    const pEl = document.querySelector<HTMLElement>(`[data-box-id="${info.parent.id}"]`);
    if (!pEl) return;
    const hasE = edge.includes("e"), hasW = edge.includes("w"), hasS = edge.includes("s"), hasN = edge.includes("n");
    const pr = pEl.getBoundingClientRect(), cs = getComputedStyle(pEl);
    // Screen pixels throughout (see `zoomOf`): computed paddings are layout px, so they are scaled on the way in.
    const Z = zoomOf(el);
    const padL = (parseFloat(cs.paddingLeft) || 0) * Z, padT = (parseFloat(cs.paddingTop) || 0) * Z, padR = (parseFloat(cs.paddingRight) || 0) * Z, padB = (parseFloat(cs.paddingBottom) || 0) * Z;
    const cw = Math.max(1, pr.width - padL - padR), ch = Math.max(1, pr.height - padT - padB);
    const r = el.getBoundingClientRect();
    const x0 = r.left - (pr.left + padL), y0 = r.top - (pr.top + padT), bw = r.width, bh = r.height;
    const startX = e.clientX, startY = e.clientY;
    setResizeCursor(cursorFor(edge)); setResizing(true);
    let raf = 0, pending: BoxNode | null = null;
    const flush = () => { raf = 0; if (pending) { onChange(pending, gk); pending = null; } };
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
      if (hasS) { const h = Math.max(16, bh + dy); patch.height = remLen(Math.round(h / Z), rootFontPx()); patch.minHeight = undefined; }
      if (hasN) { const h = Math.min(y0 + bh, Math.max(16, bh - dy)); patch.height = remLen(Math.round(h / Z), rootFontPx()); patch.minHeight = undefined; patch.top = round1(((y0 + (bh - h)) / ch) * 100); }
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

  /**
   * How narrow a neighbour may be squeezed before it WRAPS instead — a quarter of a twelve-column row.
   *
   * Below this a cell is a sliver holding one word per line, which is never what someone dragging a boundary
   * wanted; they wanted the cell they are holding to get bigger. So the neighbour stops giving ground and
   * moves down a row, and the dragged cell carries on to the full width of the page.
   *
   * WRAPPING IS NOT A CHANGE OF SIZE. When the neighbour can no longer fit beside the dragged cell it keeps
   * the span it already had and simply flows onto the next row. Writing the floor into it instead — which is
   * what used to happen — destroyed the only record of how wide it was, so bringing the dragged cell back
   * left the row several columns short with no way to work out how many.
   */
  const NEIGHBOUR_MIN = 3;

  /** The least a row may be squeezed to by a drag — below this it is a sliver nobody meant to make. */
  const MIN_ROW_PX = 24;

  /**
   * What a box would be tall if it had no `min-height` of its own — the height its CONTENT needs.
   *
   * A row cannot be squeezed below this, and knowing by how much it CAN be squeezed is what lets a top-edge
   * drag keep the bottom edge still (see `startResizeGridCell`). Measured from the children rather than read
   * from `scrollHeight`, which reports the box's own height once a `min-height` is holding it open and so
   * always says the slack is zero.
   *
   * Out-of-flow children are skipped: the editor's "Empty — drag a block in" hint and the leftover-columns
   * ghost are `position: absolute` precisely so they contribute no height, and counting them here would put
   * that height back.
   */
  const naturalHeightOf = (el: HTMLElement): number => {
    const cs = getComputedStyle(el), Z = zoomOf(el); // screen px, like the rects it is added to
    const padT = (parseFloat(cs.paddingTop) || 0) * Z, padB = (parseFloat(cs.paddingBottom) || 0) * Z;
    const brT = (parseFloat(cs.borderTopWidth) || 0) * Z, brB = (parseFloat(cs.borderBottomWidth) || 0) * Z;
    /**
     * A CHILD THAT FILLS ITS PARENT CANNOT BE ASKED HOW TALL ITS CONTENT IS — it will answer with the
     * parent's height, which makes the slack zero and the top edge DEAD.
     *
     * Measuring the children instead of `scrollHeight` was the right move (a `min-height` holding the box
     * open makes `scrollHeight` report the box itself), but it has the identical fault one level down: a
     * band with `flex-grow: 1` is exactly as tall as whatever it is given. Measured on a cell dragged to
     * 300px holding a 40px stack: the natural height came back as 300, so `aboveSlack` was 0 and dragging
     * the row below by its top edge did nothing whatsoever — reported as "the top adjustment does nothing".
     *
     * So the grow is turned OFF for the measurement and put straight back. Synchronous, inside one frame
     * and once per drag rather than per move, so nothing is ever painted in this state.
     *
     * PUT BACK THE WHOLE `style` ATTRIBUTE, never one longhand (L3-p, 2026-10-03). A column's `flex` is a shorthand holding
     * `var(--bx-gut)` (`gutterCSS`), and a shorthand with a `var()` is not split into longhands until it is used: reading
     * `flex-grow` gave "", so the "restore" REMOVED it — which broke the shorthand apart and left the column at grow 0
     * (`flex-shrink: ; flex-basis: ;` in its style). React never rewrites a `flex` prop that did not change, so every row
     * dragged stayed un-grown on the canvas — at its 14rem floor, a HOLE beside it — until a reload, while the Preview
     * filled the line. Measured on 4 dressed pages built through the UI (223, 333, 359, 382).
     */
    const undo: (() => void)[] = [];
    for (const child of Array.from(el.children)) {
      const ce = child as HTMLElement;
      if (getComputedStyle(ce).position === "absolute") continue;
      const was = ce.getAttribute("style");
      undo.push(() => { if (was === null) ce.removeAttribute("style"); else ce.setAttribute("style", was); });
      ce.style.setProperty("flex-grow", "0", "important");
    }
    const top = el.getBoundingClientRect().top;
    let content = top + brT + padT; // an empty box is its own padding and nothing else
    for (const child of Array.from(el.children)) {
      const ce = child as HTMLElement;
      if (getComputedStyle(ce).position === "absolute") continue;
      const cr = ce.getBoundingClientRect();
      if (!cr.height && !cr.width) continue;
      content = Math.max(content, cr.bottom);
    }
    for (const put of undo) put();
    return Math.max(0, content - top + padB + brB);
  };

  /**
   * Resize a GRID CELL by dragging its edges — in TRACKS, not pixels.
   *
   * A grid item's `width: 60%` is sixty percent of the cell it already sits in, so the generic flow resize
   * shrank a cell INSIDE its column instead of making it span more of them: the block came away from the grid
   * lines and every other cell stayed exactly where it was. What a person means by dragging a cell's right
   * edge is "make this wider by a column", so the drag snaps to the nearest grid line.
   *
   * EDGE-ANCHORED, the rule this project has broken twice: the grabbed edge is the only one that moves. The
   * east edge changes the span alone; the west edge moves the start and grows the span by the same amount, so
   * the right-hand edge does not budge. Rows behave the same way — and because rows are implicit, dragging the
   * bottom edge past the last one simply makes another.
   */
  const startResizeGridCell = (e: React.MouseEvent, id: string, edge: Edge) => {
    e.preventDefault(); e.stopPropagation();
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    const gEl = el?.parentElement;
    if (!el || !gEl) return;
    const cs = getComputedStyle(gEl), gr = gEl.getBoundingClientRect();
    const Z = zoomOf(el); // tracks, gaps and padding are layout px; the rect and the pointer are screen px
    /** Where each track STARTS and ENDS, relative to the grid's border box — so unequal tracks still snap. */
    const lines = (template: string, gap: number, origin: number): number[] => {
      const sizes = template.split(" ").map(parseFloat).filter((n) => !Number.isNaN(n)).map((n) => n * Z);
      const out = [origin];
      let at = origin;
      for (const s of sizes) { at += s; out.push(at); at += gap; }
      return out;
    };
    const colLines = lines(cs.gridTemplateColumns, (parseFloat(cs.columnGap) || 0) * Z, gr.left + (parseFloat(cs.paddingLeft) || 0) * Z);
    /** The 1-based line index nearest a page coordinate. */
    const nearest = (ls: number[], v: number) =>
      ls.reduce((best, x, i) => (Math.abs(x - v) < Math.abs(ls[best] - v) ? i : best), 0) + 1;
    const r = el.getBoundingClientRect();
    const info = findParent(rootRef.current, id);
    if (!info) return;
    // WHICH CELLS SHARE THIS ROW, measured rather than derived. A grid auto-places, so the only thing that
    // knows where a cell actually ended up is the browser — and the row is what both drags act on.
    const sibs = (info.parent.children ?? []).map((c) => {
      const e2 = document.querySelector<HTMLElement>(`[data-box-id="${c.id}"]`);
      return e2 ? { id: c.id, node: c, rect: e2.getBoundingClientRect() } : null;
    }).filter((x): x is { id: string; node: BoxNode; rect: DOMRect } => !!x);
    const sameRow = (a: DOMRect, b: DOMRect) => Math.abs(a.top - b.top) < 2;
    const row = sibs.filter((s) => sameRow(s.rect, r)).sort((a, b) => a.rect.left - b.rect.left);
    const above = sibs.filter((s) => Math.abs(s.rect.bottom - r.top) < (parseFloat(cs.rowGap) || 0) * Z + 3);
    const me = row.findIndex((s) => s.id === id);
    const spanOf = (n: BoxNode) => gridPlacementAt(info.parent, n, breakpoint).span;
    const track = colLines.length - 1;
    /**
     * HOW NARROW A NEIGHBOUR MAY BE SQUEEZED ACROSS A SHARED EDGE BEFORE IT WRAPS — the same rule a row has (#85, #76).
     *
     * Squeezing a cell across the edge it shares IS sizing it by hand, so it may go down to the narrowest thing that is
     * still usable: the fewest tracks at least 3rem wide (one track on any real screen). A fixed quarter of the row
     * (`NEIGHBOUR_MIN`) made 90/10, 80/20 and 20/60/20 grids impossible to drag into shape from the wide cell's edge —
     * the narrow cell wrapped at three tracks — while a row beside it allowed exactly those (decided with the user
     * 2026-09-27: one rule for rows and grids). Pull further and it still wraps, keeping its span.
     */
    const trackPx = colLines.length > 1 ? colLines[1] - colLines[0] : 0;
    const handSpan = trackPx > 0 ? Math.max(1, Math.ceil((HAND_FLOOR_REM * rootFontPx() * Z) / trackPx)) : NEIGHBOUR_MIN;
    if (!row[me] && !(info.parent.children ?? []).some((c) => c.id === id)) return;
    // THE PARTNER IS THE NEXT (or previous) SIBLING, in DOCUMENT order — never "the next cell measured on this
    // row". Once a neighbour has been pushed onto the row below it is no longer on this row by measurement, so
    // the measured lookup found nothing and shrinking the dragged cell wrote nothing back: the neighbour was
    // stranded on row two and the row stayed short. The sibling before or after is the cell the shared
    // boundary belongs to whether or not it currently fits beside this one.
    const hasE = edge.includes("e"), hasW = edge.includes("w"), hasS = edge.includes("s"), hasN = edge.includes("n");
    const kids = info.parent.children ?? [];
    const myIndex = kids.findIndex((c) => c.id === id);
    const sibling = (step: number) => { const k = kids[myIndex + step]; return k ? { id: k.id, node: k } : undefined; };
    const next = sibling(1), prev = sibling(-1);
    /**
     * The tracks THIS PAIR owns: the whole row, less whatever the other cells on it are holding.
     *
     * Measured from the row as it stands when the drag begins, and only the cells that are neither the
     * dragged one nor its partner count — so a wrapped partner contributes nothing and the pair gets the
     * full twelve back, which is exactly what lets it return to this row at the width the drag frees up.
     */
    const partnerAtStart = hasE ? next : prev;
    const others = row.filter((s) => s.id !== id && s.id !== partnerAtStart?.id).reduce((sum, s) => sum + spanOf(s.node), 0);
    const pairBudget = Math.max(2, track - others);
    const startX = e.clientX, startY = e.clientY;
    // The starting heights of THIS row and the one above it. A row is as tall as its TALLEST cell, so a
    // height has to be written to every cell in the row — setting one alone does nothing at all.
    const rowH0 = Math.max(...row.map((s) => s.rect.height), 1);
    const aboveH0 = above.length ? Math.max(...above.map((s) => s.rect.height), 1) : 0;
    /**
     * How much the row ABOVE can actually give back — its height today, less the height its content needs.
     *
     * This is what anchors the TOP edge. A `min-height` is a floor, not a cap, so writing a smaller one into
     * a row that is already at its content height changes nothing at all; the row below then grew by going
     * DOWNWARD and the edge under the pointer never moved — the opposite edge did. Knowing the slack means
     * the drag can be clamped to what is really available, so the bottom edge never budges.
     */
    const slackOf = (cells: { id: string }[], h0: number) =>
      cells.length
        ? Math.max(0, h0 - Math.max(...cells.map((s) => {
            const el2 = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(s.id)}"]`);
            return el2 ? naturalHeightOf(el2) : h0;
          }), MIN_ROW_PX * Z))
        : 0;
    /** A row height measured on screen, stored as the LAYOUT px `minHeight` holds — never below a row's floor. */
    const toLayoutRow = (screenPx: number) => Math.max(MIN_ROW_PX, Math.round(screenPx / Z));
    const aboveSlack = slackOf(above, aboveH0);
    /** And how much THIS row can give back, which is what bounds a top edge dragged downward. */
    const rowSlack = slackOf(row, rowH0);

    // ── THE DRAG PAINTS ITSELF, AND COMMITS ONCE ──────────────────────────────────────────────────────
    //
    // It used to commit the whole page into React state on every pointer move. Every move therefore
    // re-rendered the canvas, pushed an undo entry and re-serialised the site to localStorage: measured on a
    // 500-block page at a real mouse's 120 events/sec, frames ran to 27ms at the 90th percentile — below
    // 60fps, which is the lag and the stepping — and one drag left ~200 entries in the undo history, so a
    // single Ctrl+Z undid one frame of it.
    //
    // So the drag now writes its result STRAIGHT ONTO THE DOM and commits one tree on release. It is the
    // same picture because it is the same code: the preview asks `childStyle` and `containerStyle` — the two
    // functions the renderer itself calls — what this tree looks like, rather than hand-writing a second
    // opinion that could drift from the first.
    //
    // Every property it touches is remembered and PUT BACK before the commit, so React is never left holding
    // an inline value it did not write. Without that, a property the final tree does not emit (a span of 1
    // emits no `grid-column` at all) would be left painted on the element for ever, because React compares
    // its own previous output and would see nothing to remove.
    // The whole `style` ATTRIBUTE is remembered, not each property: a property that is part of a shorthand holding a `var()`
    // reads as "" and removing it breaks the shorthand apart (L3-p — see `naturalHeightOf`).
    const touched = new Map<HTMLElement, string | null>();
    const put = (el: HTMLElement, prop: string, value: string) => {
      if (!touched.has(el)) touched.set(el, el.getAttribute("style"));
      el.style.setProperty(prop, value);
    };
    const restore = () => {
      for (const [el, was] of touched) { if (was === null) el.removeAttribute("style"); else el.setAttribute("style", was); }
      touched.clear();
    };
    const paintPreview = (tree: BoxNode) => {
      const parentNow = findByIdLocal(tree, info.parent.id);
      if (!parentNow) return;
      const rp = resolveResponsive(parentNow, breakpoint);
      const gNow = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(rp.id)}"]`);
      // The grid's own row track list is a FUNCTION of the cells: which row a cell lands on depends on the
      // spans before it, and a row that has been given a height becomes `auto` while the rest stay `1fr`
      // (see `gridRowTracks`). So widening a cell can change the container too, and the preview has to ask.
      if (gNow) put(gNow, "grid-template-rows", String(containerStyle(rp, breakpoint).gridTemplateRows ?? ""));
      for (const child of rp.children ?? []) {
        const cEl = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(child.id)}"]`);
        if (!cEl) continue;
        const cs2 = childStyle(child, rp, breakpoint);
        put(cEl, "grid-column", String(cs2.gridColumn ?? ""));
        if (hasS || hasN) {
          const mh = isContainer(child)
            ? containerStyle(child, breakpoint).minHeight
            : child.minHeight != null ? remLen(child.minHeight) : undefined;
          put(cEl, "min-height", String(mh ?? ""));
        }
      }
      // The selection chrome only re-measures on a render, and there are none until release — so the
      // handles would come away from the box the instant it started to move. They follow it here instead,
      // inside the same frame, which is also why the drag no longer feels a step behind the pointer.
      for (const mirror of Array.from(document.querySelectorAll<HTMLElement>("[data-chrome-mirror]"))) {
        const target = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(mirror.dataset.chromeMirror ?? "")}"]`);
        if (!target) continue;
        const q = target.getBoundingClientRect();
        mirror.style.left = `${q.left}px`; mirror.style.top = `${q.top}px`;
        mirror.style.width = `${q.width}px`; mirror.style.height = `${q.height}px`;
      }
    };

    // EVERY FRAME IS COMPUTED FROM THE TREE AS IT WAS WHEN THE DRAG BEGAN, never from the last frame's
    // answer. One pointer position gives one result, so the drag is reversible by construction and cannot
    // accumulate — and because nothing is committed until release, what is committed IS the last position
    // the pointer was in, which is what "it lands where I let go" means.
    const base = rootRef.current;
    setResizeCursor(cursorFor(edge)); setResizing(true);
    let raf = 0, pending: BoxNode | null = null;
    const flush = () => { raf = 0; if (pending) paintPreview(pending); };
    const onMove = (ev: MouseEvent) => {
      let tree = base;
      // ── ACROSS: the boundary between two cells is SHARED, so it takes from the neighbour ──
      // This is the whole difference from the first attempt, which pinned the dragged cell to an absolute
      // column: that turned its auto-placed siblings into items that had to flow AROUND it, and they scattered
      // across the row. Moving a shared boundary keeps the row's twelve at twelve, so only the two cells
      // either side of the grabbed edge ever move and nothing reflows.
      if (hasE || hasW) {
        // Measured as a DELTA from the cell's own edge, never from the pointer's absolute position: a handle
        // is drawn centred ON the border and is a few pixels wide, so reading the cursor directly made every
        // drag land one column further than the edge the user was actually holding.
        const dx = ev.clientX - startX;
        const want = hasE
          ? nearest(colLines, r.right + dx) - nearest(colLines, r.left)
          : nearest(colLines, r.right) - nearest(colLines, r.left + dx);
        const neighbour = hasE ? next : prev;
        // The dragged cell follows the pointer all the way to the full width of the row, and THE PAIR SHARES
        // ITS BUDGET: whatever this cell is not using, its neighbour takes. Push far enough that the
        // neighbour would be left too narrow to read and it stops sharing — it keeps the span it has and
        // flows onto the next row instead, which is what a person means by "make this one full width".
        //
        // BOTH VALUES ARE A FUNCTION OF THE POINTER ALONE — no running totals, no deltas against a snapshot
        // of a size that has since changed. That is what makes the drag REVERSIBLE: every position produces
        // one answer, so dragging out and back lands exactly where it started, and bringing the dragged cell
        // back in brings a wrapped neighbour up beside it at the width just freed. The version this replaces
        // accumulated a delta and clamped the neighbour at the floor, so out-and-back left the row four
        // columns short — and once the neighbour had wrapped nothing was written to it at all.
        //
        // THE TWO EDGES HAVE DIFFERENT CEILINGS, and that is the fix for a west drag moving the wrong edge.
        // `NEIGHBOUR_MIN` is a WRAP threshold, not a width floor: past it the neighbour stops sharing and
        // drops to the next row, which is what lets an EAST drag carry the cell out to the full width.
        //
        // A cell BEFORE this one has nowhere to wrap to — a grid places items in source order, so the only
        // thing that can move this cell's left edge is the previous cell giving ground. Past the point where
        // it can, the span went on growing anyway and the cell grew out of its RIGHT edge instead: measured
        // on a four-across grid, dragging the left edge moved the right edge 171px. So a west drag is capped
        // at what the pair actually owns, and because that neighbour cannot wrap, its floor is one column —
        // the wrap threshold would be a wall it has no way past.
        const ceiling = hasE ? track : Math.max(1, pairBudget - 1);
        const span = Math.max(1, Math.min(ceiling, want));
        tree = writeBox(tree, id, { colSpan: span });
        if (neighbour) {
          const beside = pairBudget - span;                    // what the neighbour needs to fit alongside
          const nSpan = spanOf(neighbour.node);
          tree = writeBox(tree, neighbour.id, { colSpan: beside >= (hasE ? handSpan : 1) ? beside : nSpan });
        }
      }
      // ── DOWN: the grabbed edge moves, and THIS row is the one that changes size ──
      // A cell alone cannot own its height: the grid stretches every cell to the tallest, so a height has to
      // be written to every cell in the row and the row grows as one piece.
      //
      // The BOTTOM edge grows this row downward — the top stays put and the page grows underneath.
      //
      // The TOP edge grows this row UPWARD, which means the row ABOVE gives back exactly what this one takes,
      // the way the shared boundary works across. An earlier version resized the row above INSTEAD, on the
      // "dragging a rule in a table" reading — so grabbing a cell's top edge made a different cell change
      // size and the one being held never moved. Holding an edge must move that edge.
      const dy = ev.clientY - startY;
      if (hasS) {
        for (const s of row) tree = writeBox(tree, s.id, { minHeight: toLayoutRow(rowH0 + dy) });
      } else if (hasN) {
        // THE ROW GROWS UPWARD BY EXACTLY WHAT THE ROW ABOVE CAN GIVE, AND NOT A PIXEL MORE.
        //
        // The previous version wrote the full requested height into this row and then asked the row above to
        // absorb it. A `min-height` is a FLOOR, though, so a row already sitting at its content height —
        // which, in a grid nobody has given a height to, is every row — simply ignored the smaller number it
        // was handed. This row grew anyway, downward, and the top edge the user was holding did not move at
        // all: measured at 0px moved on the grabbed edge and 120px on the opposite one, on all four of the
        // grids tried.
        //
        // NOT A REGRESSION — this path never held the rule. The flow resize (`startResize`) has anchored all
        // four edges for a long time; a grid cell goes through here instead, and this edge has been wrong
        // since the day it shipped. It was wrong in two different ways: first it resized the row ABOVE, so
        // the held edge moved and a different box changed size; then it grew THIS row downward, so the held
        // edge did not move at all. Both were called fixed. What let that stand is in the spec's own note —
        // the guard only ever exercised two cells across.
        //
        // Clamping to the real slack is the honest version: where there is room above (a grid given a height,
        // whose rows share it — which is the only case where a top-edge drag has anything to mean) the row
        // grows and its bottom edge stays exactly still; where there is none, the edge does not move, because
        // there is nowhere for it to go.
        // Both directions are bounded by the same idea — the boundary moves as far as the row on the far side
        // of it can give. Up, that is the row above's slack; down, it is this row's own. With NO row above,
        // the boundary is the grid's own top edge and cannot move at all: shrinking this row there would pull
        // its BOTTOM up while the edge under the pointer stayed put, which is the same defect mirrored.
        const rise = Math.max(above.length ? -rowSlack : 0, Math.min(-dy, aboveSlack));
        if (Math.round(rise) !== 0) {
          for (const s of row) tree = writeBox(tree, s.id, { minHeight: toLayoutRow(rowH0 + rise) });
          for (const s of above) tree = writeBox(tree, s.id, { minHeight: toLayoutRow(aboveH0 - rise) });
        }
      }
      pending = tree;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onUp = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      // PUT THE PREVIEW BACK, THEN COMMIT ONCE. In that order: the commit is the only thing that may leave a
      // mark, so React re-renders from a DOM it alone has written to. One tree, one undo entry, one write to
      // storage — and it is the LAST pointer position, so the drag ends where the pointer did.
      restore();
      if (pending) { onChange(pending); pending = null; }
      setResizing(false); setResizeCursor(null);
      document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove); document.addEventListener("mouseup", onUp);
  };

  const startResize = (e: React.MouseEvent, id: string, edge: Edge) => {
    const gk = `gesture:${Date.now()}`; // one undo step for the whole gesture, however many frames it paints
    if (!editable) return;
    const node = findByIdLocal(root, id);
    if (node && isFloating(node)) { startResizeAbsolute(e, id, edge); return; } // floating boxes resize freely (no flow walls)
    if (findParent(root, id)?.parent.layout === "grid") { startResizeGridCell(e, id, edge); return; } // a cell resizes in TRACKS
    e.preventDefault(); e.stopPropagation();
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    const pEl = el?.parentElement ?? null;
    if (!el || !node) return;
    const rect = el.getBoundingClientRect();
    const hasE = edge.includes("e"), hasW = edge.includes("w"), hasS = edge.includes("s"), hasN = edge.includes("n");
    /**
     * A COLUMN'S SLOT (S1-a). In a band with a gutter (`gutterCSS`) a column is drawn one gap narrower than its share
     * and sits half a gap in from each side of it. A stored % describes the SLOT, so every column is measured as its
     * slot here — its box plus half a gap each side — and all the line maths below works on the same widths the % means.
     * The band reaches half a gap out on each side, so half its (negative) margin is exactly that half gap.
     */
    const HG = (() => {
      const band = findParent(root, id)?.parent;
      if (!pEl || !band?.rowBand || (band.direction ?? "column") !== "row") return 0;
      return Math.max(0, -(parseFloat(getComputedStyle(pEl).marginLeft) || 0)) * zoomOf(el);
    })();
    const startX = e.clientX, startY = e.clientY, W0 = rect.width + 2 * HG, H0 = rect.height;
    const dragStamp = Date.now(); // when this drag squeezed a block — see `restAt`
    const ownMinPx = minContentPx(el) + 2 * HG; // its content's own minimum (#68), as a slot

    const info = findParent(root, id);
    const parentGrid = info?.parent.layout === "grid";
    const parentRow = !parentGrid && !!info && (info.parent.direction ?? "column") === "row";

    // Units: width as % of the PARENT CONTENT box, height as vh, margins in the fluid base unit (px→u
    // exact so the pixel maths holds — keeping marginX_px + size_px constant fixes the opposite edge).
    const Z = zoomOf(el); // screen px throughout — see `zoomOf`; every layout-px read below is scaled by it on the way in
    const boxU = measureBoxU(el, rootRef.current.baseFont ?? 10) * Z;
    /** A screen distance as the LAYOUT px a stored `minHeight` holds. */
    // To a THOUSANDTH, as the heights were stored before the zoom (#49) routed them through here: rounding to whole px
    // put the anchored bottom 1px off at some drag distances (#81 — a regression of #49, found under load).
    const lay = (screenPx: number) => Math.round((screenPx / Z) * 1000) / 1000;
    const pxU = (px: number) => Math.round((px * 10) / boxU); // SIGNED px → stored unit (must keep sign so dragging an edge outward can shrink the margin back to 0 / the page edge)
    let maxW = 1, padL = 0, padT = 0;
    if (pEl) {
      const cs = getComputedStyle(pEl);
      padL = (parseFloat(cs.paddingLeft) || 0) * Z; padT = (parseFloat(cs.paddingTop) || 0) * Z;
      const padR = (parseFloat(cs.paddingRight) || 0) * Z;
      maxW = (pEl.clientWidth * Z - padL - padR) || 1;
    }
    const pct = (px: number) => `${Math.max(3, Math.min(100, (px / maxW) * 100)).toFixed(2)}%`;
    /**
     * What is LEFT of a line once this block has taken its rounded share — floored, never rounded.
     *
     * Two shares rounded separately can sum to 100.01%, and a wrapping row wraps on a hundredth: the neighbour
     * drops to the next line over a tenth of a pixel. Taking the partner's share as the remainder of the one
     * just written keeps the pair's sum at or under the line, by construction.
     */
    const remainderPct = (totalPct: number, ownToken: string) => `${Math.max(3, Math.floor((totalPct - parseFloat(ownToken)) * 100 + 1e-6) / 100).toFixed(2)}%`;

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
      pageTopPx = pgRect.top + (parseFloat(pgCs.paddingTop) || 0) * Z - contentTopPx;
    }

    /**
     * WHERE FLOW WOULD PUT THIS BLOCK'S TOP — measured, never assumed.
     *
     * The cross-axis anchor below pins `margin-top` so an un-stretched box does not jump when the stretch is
     * taken off it. It measured that margin from the PARENT'S CONTENT TOP, which is the right reference for
     * exactly one block: the first. Every block after it has ALREADY been carried down there by the blocks
     * before it, so the anchor added a distance flow had already travelled and the block teleported down by
     * the whole height above it — before the pointer had moved at all.
     *
     * Measured on the reported page (a band holding a grid, then two stacks): grabbing the last stack's top
     * edge and dragging 80px moved its top 380px and its supposedly ANCHORED bottom 300px, leaving 380px of
     * white space above it. Dragging the BOTTOM edge did the same thing, because this anchor fires for both.
     * That white space is the bug as the user meets it; the gap they then could not close is the next one.
     *
     * The honest reference is where the block sits with the anchor's own styles on it and no margin at all.
     * Applied and taken straight back, synchronously within one frame, so nothing is ever painted in this
     * state — the same measurement trick `naturalHeightOf` uses one level up, and for the same reason: the
     * only thing that knows where flow puts a box is the browser.
     */
    const flowTopPx = (() => {
      const prevAlign = el.style.alignSelf, prevMT = el.style.marginTop;
      el.style.alignSelf = "flex-start";
      el.style.marginTop = "0px";
      const t = el.getBoundingClientRect().top;
      el.style.alignSelf = prevAlign; el.style.marginTop = prevMT;
      return t;
    })();

    // Cross-axis anchor: pin alignment + current position/size so a centred/stretched box doesn't jump.
    let base = root, changed = false;
    const anchor: Partial<BoxNode> = {};
    if (prRect) {
      if ((hasE || hasW) && !parentRow) { anchor.alignSelf = "flex-start"; anchor.width = pct(W0); anchor.marginLeft = pxU(rect.left - contentLeftPx); } // width is CROSS (column) → pin horizontal
      if ((hasN || hasS) && parentRow) { anchor.alignSelf = "flex-start"; anchor.minHeight = lay(H0); anchor.marginTop = pxU(rect.top - flowTopPx); } // height is CROSS (row) → un-stretch so the floor governs + pin vertical
    }
    if (Object.keys(anchor).length) { base = writeBox(base, id, anchor); changed = true; }
    if (changed) onChange(base, gk);

    const bn = resolveResponsive(findByIdLocal(base, id) ?? node, breakpoint); // effective margins at this breakpoint
    const ML0 = bn.marginLeft ?? bn.margin ?? 0; // stored (u) units after anchoring
    const MT0 = bn.marginTop ?? bn.margin ?? 0;
    // A gap on a LINE is stored as a share of it (`marginLeftPct`) and wins over the length when rendered, so it
    // has to win here too. Reading only `marginLeft` put the flow origin where the block STARTS rather than where
    // its slot starts: the left edge of a block that had opened a space could not be dragged back out, and the
    // release cleared the gap without restoring the width — the right edge jumped 120px left, dragging its
    // neighbour with it. Found by the RULE Q sweep, 2026-09-26.
    const ML0px = bn.marginLeftPct != null ? (bn.marginLeftPct / 100) * maxW : (boxU * ML0) / 10, MT0px = (boxU * MT0) / 10;

    // Measured edges (relative to the parent content box) + the fixed FLOW origin (the section's position
    // from previous siblings, independent of its margin). Every drag is clamped to [flow origin … page
    // edge] so a section can NEVER be dragged off the page, while the opposite edge stays anchored.
    const startLeftPx = rect.left - HG - contentLeftPx, startRightPx = rect.right + HG - contentLeftPx;
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
    const rootPx = rootFontPx() * Z; // in screen px, so remLen(screenPx, rootPx) writes true rem and 14rem floors compare with rects
    const minWpx = selfSizing ? Math.max(8, naturalW * MIN_CONTENT_SCALE) : Math.max(8, 0.03 * maxW);
    const minHpx = selfSizing ? Math.max(8, naturalH * MIN_CONTENT_SCALE) : 8;
    /** The text scale a box of `px` needs so `natural` px of content still fits (1 until it must shrink). */
    const fitScale = (px: number, natural: number) => (natural > 0 ? clampContentScale(px / natural) : 1);
    /**
     * THE NEIGHBOURS THIS BLOCK SHARES A BOUNDARY WITH, and the widths they had when the drag began.
     *
     * The boundary between two blocks on a line belongs to BOTH of them, so dragging it spends the
     * neighbour's space: you take width, it gives width, and the pair keeps the line exactly full. That is
     * how a table column behaves and it is what "seamless" means here.
     *
     * It did not work that way, and the failure was total rather than partial. The right edge was clamped to
     * `nextLeftPx` — the neighbour's left edge — on the reasoning that a drag FILLS A GAP and the neighbour
     * never moves. When the two blocks are touching there IS no gap: `nextLeftPx === startRightPx`, the
     * clamp pinned the edge exactly where it already was, and a 200px drag produced a stored width of
     * "50.00%" where "50%" had been. The control was not stiff or laggy; it was inert, and a full row is the
     * ordinary case rather than a corner.
     *
     * Both sides are needed because either edge can be the one you grab: the right edge spends the block
     * after this one, the left edge spends the block before it.
     */
    /**
     * THE PARTNER IS FOUND IN THE TREE, AND ITS WIDTH IS READ FROM THE TREE.
     *
     * This used to take whatever was DRAWN on this block's visual line. Once the neighbour wrapped to the next
     * line it stopped matching, the block believed it had no partner, and narrowing it released the width to
     * nobody — measured from inside the drag: `nextSibId: null, gapPx: 200`. A width round trip went
     * 512 / 512 → 224 / 712 and never came back (rule 7).
     *
     * Two things fix it, and each alone was tried and failed:
     *   • the partner is the next / previous STRUCTURAL sibling, and whether it shares this line is decided by
     *     `packRowLines` — the same packing the renderer uses — so it cannot depend on paint timing;
     *   • its width is its STORED share. A block wrapped onto a line by itself GROWS to fill it (1024px for a
     *     block storing 50%), so its rendered width is the wrong number to do arithmetic with.
     * The blocks after it, wrapped or not, are `after` below, and `allocateLine` shares the line among them.
     */
    let nextSibId: string | null = null, nextLeftPx = maxW, nextWidth0 = 0;
    let prevSibId: string | null = null, prevWidth0 = 0;
    /**
     * A block AFTER this one: the width it RESTS at (its `restWidth` if a
     * neighbour's drag squeezed it, else its stored width), its current stored width, and its margin — all px.
     */
    type Follower = { id: string; w: number; cur: number; ml: number; at?: number; wrapBy?: string; min: number; floorPx: number; foreign?: boolean };
    /** When the next block SHARES the line: its rest width. */
    let nextRest = 0, prevRest = 0;
    let prevAt: number | undefined; // when the block before was squeezed, if it was (#53)
    /** EVERY block after this one, in order, and whether it shares this block's line when the drag starts. */
    let after: (Follower & { sameLine: boolean })[] = [];
    /**
     * The floor each column was drawn at BEFORE anyone sized it, px — 14rem, or 3rem on a line of four or more (#78). It is
     * what a stored original below the floor was drawn at, so it is what `origWidth` is measured against (#65, #82).
     */
    const drawnFloorPx = new Map<string, number>();
    /**
     * What the STORED shares before this block on its line already hold, % (c-11b, 2026-10-03). The drag measures its room
     * from where this block is DRAWN, while the blocks before it keep their stored shares — and the two differ by a hair
     * (rounding, the one-pixel slack of #131): page 359 handed 15.82% to the last two of a line whose first two stored
     * 84.33, so the line stored 100.15% and wrapped its last icon at Tablet; 382 stored 100.01. Null where a block before it
     * has no stored share (it is then what it draws).
     */
    let storedBeforePct: number | null = null;
    if (parentRow && info) {
      const rowAt = resolveResponsive(info.parent, breakpoint);
      // On a tablet a line of four or more is REARRANGED (#78): each column is drawn at its share of its tablet line,
      // so that share is its width here — the resize must work from what is drawn, as everywhere else in this row.
      const places = tabletPlaces(rowAt, breakpoint);
      const kids = info.parent.children!.filter((c) => !isFloating(c) && !c.hidden).map((c) => resolveResponsive(c, breakpoint))
        .map((c) => { const pl = places?.get(c.id); return pl ? { ...c, width: `${+(pl.share * (100 - pl.marginsPct)).toFixed(4)}%` } : c; });
      /**
       * THE REFLOW FLOOR, IN THIS ROW'S TERMS (#58). A section in a row is drawn no narrower than min(100%, 14rem), so
       * five blocks storing 20% on a 1024px page are DRAWN at 224px and the fifth wraps — while the stored widths
       * said all five shared the line. The drag worked from the stored numbers, disagreed with the page, and left
       * holes and round trips that never came home. Lines and widths are therefore read as the browser draws them.
       */
      // Each column's OWN floor: 14rem untouched, 3rem once sized by hand (#75) — as childStyle draws it.
      // A column on the 3rem floor is DRAWN no narrower than its longest word (#102, `childStyle`), so that is its floor
      // here too — measured once per column per drag — or the packing below would call a line that the browser wraps "full".
      const contentMin = new Map<string, number>();
      const minOf = (c: BoxNode) => { if (!contentMin.has(c.id)) { const e2 = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(c.id)}"]`); contentMin.set(c.id, e2 ? minContentPx(e2) + 2 * HG : 0); } return contentMin.get(c.id)!; };
      const floorPxOf = (c: BoxNode) => {
        const rem = places?.has(c.id) ? HAND_FLOOR_REM : columnFloorRem(rowAt, c, breakpoint);
        const px = rem * rootFontPx() * Z + 2 * HG;
        return Math.min(maxW, rem === HAND_FLOOR_REM ? Math.max(px, minOf(c)) : px);
      };
      kids.forEach((c) => drawnFloorPx.set(c.id, Math.min(maxW, columnFloorRem(rowAt, { ...c, widthByHand: false }, breakpoint) * rootFontPx() * Z + 2 * HG)));
      const lines = packRowLines(kids, (c) => (floorPxOf(c) / maxW) * 100);
      const at = kids.findIndex((c) => c.id === id);
      // The line as DRAWN — the blocks before it whose box sits on its line on screen — not `lines`: a line stored a hair over
      // 100% is drawn as ONE line (the one-pixel slack of #131) while the packing calls its last block wrapped, and then
      // nothing came before it and the cap was 100 (measured: 42.71 + 41.62 + 15.68 drawn on one line, 100.15 written).
      if (at >= 0) {
        const ownTop = el.getBoundingClientRect().top;
        const before = kids.slice(0, at).filter((c) => { const e2 = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(c.id)}"]`); return !!e2 && Math.abs(e2.getBoundingClientRect().top - ownTop) <= 2; });
        if (before.every((c) => c.width?.trim().endsWith("%"))) storedBeforePct = before.reduce((s, c) => s + widthPct(c.width) + (c.marginLeftPct ?? 0), kids[at].marginLeftPct ?? 0);
      }
      /** A sibling's width as the LAYOUT states it — its stored share where it has one, else what is drawn. */
      const storedPx = (c: BoxNode, r2: DOMRect) => Math.max(floorPxOf(c), c.width?.trim().endsWith("%") ? (widthPct(c.width) / 100) * maxW : r2.width + 2 * HG);
      const measure = (c: BoxNode | undefined) => {
        if (!c) return null;
        const e2 = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(c.id)}"]`);
        return e2 ? { c, e2, r2: e2.getBoundingClientRect() } : null;
      };
      const restPx = (c: BoxNode, r2: DOMRect) => (c.restWidth?.trim().endsWith("%") ? Math.max(floorPxOf(c), (widthPct(c.restWidth) / 100) * maxW) : storedPx(c, r2));
      const followers = (from: number) => kids.slice(from).map(measure).filter((m): m is NonNullable<ReturnType<typeof measure>> => !!m)
        // A column REARRANGED on a tablet (#78) has no floor below its share: the arrangement placed it, so one on a later
        // line comes up only whole — never squeezed onto a line whose count the arrangement already decided.
        .map((m) => {
          const min = minContentPx(m.e2) + 2 * HG, cur = Math.max(min, storedPx(m.c, m.r2));
          // Its remembered rest only if THIS block's drag made it (#77) — to anyone else's drag it is the width it holds.
          const own = restForDrag({ rest: m.c.restWidth ? Math.max(min, restPx(m.c, m.r2)) : undefined, at: m.c.restAt, restBy: m.c.restBy }, cur, id);
          return { floorPx: places?.has(m.c.id) ? storedPx(m.c, m.r2) : floorPxOf(m.c), id: m.c.id, w: own.rest, cur, ml: Math.max(0, (parseFloat(getComputedStyle(m.e2).marginLeft) || 0) * Z - HG), at: own.at, foreign: own.foreign, wrapBy: m.c.wrapBy, min };
        });
      const nx = at >= 0 ? measure(kids[at + 1]) : null;
      if (nx && lines[at + 1] === lines[at]) {
        nextSibId = nx.c.id; nextLeftPx = nx.r2.left - HG - contentLeftPx; nextWidth0 = storedPx(nx.c, nx.r2);
        nextRest = restForDrag({ rest: nx.c.restWidth ? restPx(nx.c, nx.r2) : undefined, restBy: nx.c.restBy }, nextWidth0, id).rest;
      }
      // By id, not by index: `followers` drops a block that is not drawn, which would shift every index after it.
      const lineOf = new Map(kids.map((c, i) => [c.id, lines[i]]));
      if (at >= 0) after = followers(at + 1).map((f) => ({ ...f, sameLine: lineOf.get(f.id) === lines[at] }));
      const pv = at > 0 ? measure(kids[at - 1]) : null;
      // A previous sibling on an EARLIER line owns no boundary with this block: its left edge starts a line,
      // so it is an outer edge and the gap behaviour below is right for it.
      if (pv && lines[at - 1] === lines[at]) {
        prevSibId = pv.c.id; prevWidth0 = storedPx(pv.c, pv.r2);
        const pr = restForDrag({ rest: pv.c.restWidth ? restPx(pv.c, pv.r2) : undefined, at: pv.c.restAt, restBy: pv.c.restBy }, prevWidth0, id);
        prevRest = pr.rest; prevAt = pr.at;
      }
    }

    /**
     * THE BLOCK DIRECTLY ABOVE — whom the TOP edge's boundary belongs to, on the VERTICAL axis.
     *
     * The horizontal edges have spent their neighbour for a long time: take width, the block beside you
     * gives width, the line stays full. The vertical edges never did. Dragging a stack's top edge only ever
     * opened a `margin-top`, so shrinking a block left a hole above it that belonged to nobody, and the
     * block above went on being exactly as tall as it was. Reported as "when I reduce the height of the
     * last stack, the one above it does not adjust automatically" — and then, worse, the hole could not be
     * closed by hand: growing the block above moves the flow origin of the one below it, so the margin
     * carries the hole along in front of it. Measured at 380px of white space before and 380px after
     * growing the block above by 200px. "The white space always remains" is literally what the maths did.
     *
     * The partner is the PREVIOUS SIBLING IN DOCUMENT ORDER, the lesson the grid cell learned the hard way
     * — not "whatever is measured above", which stops being findable the moment a block wraps. A floating
     * block is skipped: it is out of flow and owns no boundary. And a previous sibling that SHARES this
     * block's line sits BESIDE it, not above, so the top edge is not its boundary at all: there the drag
     * keeps the old margin behaviour, because no single block owns that edge.
     */
    /**
     * ONE LOOKUP, BOTH DIRECTIONS — because the bottom edge has exactly the same partner problem as the top.
     *
     * The top edge has spent the block above it for a while. The BOTTOM edge never spent the block below:
     * `hasS` simply wrote this block's own height, so dragging a stack shorter left the one beneath it to
     * slide up and the column came up short. Measured on the user's own shape: the neighbour grew **0px**,
     * its far edge moved **-140px**, and **140px of space appeared at the foot of the column** — space they
     * had not asked for, since they never touched that block's bottom edge.
     *
     * The mirror is the same walk with its comparisons reversed, so it is taken with a direction rather than
     * written out twice. Two copies of this arithmetic is precisely how rule 19 has been broken three times.
     */
    type Partner = { sibId: string | null; h0: number; slack: number; isComp: boolean; gap0: number };
    const partnerAcross = (dir: "up" | "down"): Partner => {
    let aboveSibId: string | null = null, aboveH0 = 0, aboveSlack = 0, aboveIsComp = false, aboveGap0 = 0;
    {
      /**
       * IT WALKS UP THROUGH WRAPPERS, because the block above is usually not a sibling at all.
       *
       * The builder gives every top-level block its own BAND, so two stacks that touch on the page are two
       * only children in two different parents — measured: `root › band-1 › green` and `root › band-2 ›
       * magenta`. A sibling-only lookup therefore found nothing in the layout a real user actually builds,
       * and the fix worked solely in the seeded one-band page the first test used. That is the same trap
       * this file records twice already: a guard built on a shape simpler than the product.
       *
       * So where a block is the FIRST thing in its parent, its top edge IS the parent's top edge, and the
       * boundary belongs to whatever sits above the parent — one level up, repeatedly. A band given a height
       * stretches its child, so writing the height there grows the stack inside it (measured: band 380 →
       * green 380, over green's own stored 300).
       *
       * It stops climbing at a parent with padding above the block: there the top edge sits INSIDE the
       * parent rather than on its boundary, so nothing above owns it and the old margin behaviour is right.
       */
      let cursor: string = id;
      for (let hop = 0; hop < 8; hop++) {
        const up = findParent(rootRef.current, cursor);
        if (!up) break;
        const kids = up.parent.children ?? [];
        const at = kids.findIndex((c) => c.id === cursor);
        let found: { c: BoxNode; r: DOMRect } | null = null;
        const step = dir === "up" ? -1 : 1;
        for (let i = at + step; i >= 0 && i < kids.length; i += step) {
          const c = kids[i];
          if (isFloating(c)) continue;
          const e2 = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(c.id)}"]`);
          if (!e2) continue;
          const r2 = e2.getBoundingClientRect();
          /**
           * Shares this block's LINE — beside it, not across the edge being dragged, so it owns no boundary
           * here. We stop LOOKING PAST it, but we do NOT give up: this used to abandon the search outright,
           * and that is a different claim altogether — "the block next to me owns no boundary" is not
           * "nothing does". The climb below already decides the question properly, by checking whether this
           * edge really is the parent's edge.
           *
           * Measured, and the user's report — *"it went way above the whole page on the top side"*: a stack
           * with a neighbour beside it found no partner above, so its top edge was clamped to the PAGE top
           * instead of to anything nearby, and dragging it up wrote **margin-top: -160px**. The stack lifted
           * clean out of its own band and sat on top of the header.
           */
          if (dir === "up" ? r2.bottom > rect.top + 2 : r2.top < rect.bottom - 2) break;
          found = { c, r: r2 };
          break;
        }
        if (found) {
          /**
           * …AND THEN DESCEND TO THE BLOCK THAT ACTUALLY OWNS THAT HEIGHT.
           *
           * Having climbed to the band above, the band is the wrong thing to write to. A band HUGS its
           * child, so its height is really the child's stored `min-height` — which makes two things go
           * wrong at once: asked how tall its content is, the band answers with that floor, so its slack
           * came out 0 and dragging the top edge UP was completely DEAD (measured: 0px moved); and writing
           * a smaller height to the band would change nothing anyway, because the child holds it open.
           *
           * Growing worked and shrinking did not, which is exactly the asymmetry that makes this kind of
           * fault read as "sometimes it works". It is the same trap this file records twice already — a box
           * asked about its content answering with its own size — arriving one level further out.
           *
           * So where a wrapper has a single in-flow child exactly as tall as itself, that child is the real
           * partner: shrink it and the wrapper follows it down; grow it and the wrapper follows it up.
           */
          let owner = found.c;
          let ownerEl = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(found.c.id)}"]`)!;
          for (let dive = 0; dive < 8; dive++) {
            const inFlow = (owner.children ?? []).filter((c) => !isFloating(c));
            if (inFlow.length !== 1) break;
            const kEl = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(inFlow[0].id)}"]`);
            if (!kEl) break;
            if (Math.abs(kEl.getBoundingClientRect().height - ownerEl.getBoundingClientRect().height) > 2) break;
            owner = inFlow[0]; ownerEl = kEl;
          }
          aboveSibId = owner.id;
          const ownerRect = ownerEl.getBoundingClientRect();
          aboveH0 = ownerRect.height;
          aboveSlack = Math.max(0, aboveH0 - Math.max(naturalHeightOf(ownerEl), MIN_ROW_PX * Z));
          aboveIsComp = owner.type === "component" || owner.type === "button";
          // The space ALREADY between them — outer spacing the user asked for, and the parent's own gap.
          aboveGap0 = Math.max(0, dir === "up" ? rect.top - ownerRect.bottom : ownerRect.top - rect.bottom);
          break;
        }
        // Nothing that way here — climb, but only while THIS block's edge really is the parent's edge.
        const upEl = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(up.parent.id)}"]`);
        if (!upEl || isFloating(up.parent)) break;
        const pr = upEl.getBoundingClientRect();
        if (Math.abs(dir === "up" ? pr.top - rect.top : pr.bottom - rect.bottom) > 2) break; // padding/border between them
        cursor = up.parent.id;
      }
    }
      return { sibId: aboveSibId, h0: aboveH0, slack: aboveSlack, isComp: aboveIsComp, gap0: aboveGap0 };
    };
    const above = partnerAcross("up");
    const below = partnerAcross("down");
    /**
     * THE BAND THAT CAPS THIS BLOCK'S COLUMN — and why growing has to raise it.
     *
     * A band holding a height of its own fixes how much room everything inside it has to share. Grow one
     * block in there and the room does not grow with it, so the space has to come out of a sibling — and the
     * first sibling to give is any block sized `fill`, whose height is leftover by definition and therefore
     * collapses to nothing without resisting.
     *
     * Measured on the user's own page: the brown stack's bottom edge dragged down 90px grew it 140 → 230,
     * and the `fill` block above it went **61 → 0**. The band rose only 201 → 230, so 61 of the 90 was taken
     * from above: the block's TOP edge moved up 61px while its bottom was being dragged down. That is RULE 19
     * broken — the anchored edge moved — and it is the third time today the same root cause has surfaced:
     * a size stored as LEFTOVER rather than as a quantity of its own.
     *
     * So an outward drag raises the capping band by exactly what the block gained. The room grows with the
     * block, nothing above is squeezed, and the top edge stays where it was put.
     */
    const cappingBand = (() => {
      let cur = id;
      for (let hop = 0; hop < 8; hop++) {
        const up = findParent(rootRef.current, cur);
        if (!up) return null;
        if (up.parent.rowBand && up.parent.minHeight != null) return { id: up.parent.id, h0: up.parent.minHeight };
        cur = up.parent.id;
      }
      return null;
    })();
    const { sibId: aboveSibId, h0: aboveH0, slack: aboveSlack, isComp: aboveIsComp, gap0: aboveGap0 } = above;
    /** And what THIS block can give back — what bounds the same boundary dragged DOWNWARD. */
    const selfSlack = Math.max(0, H0 - Math.max(naturalHeightOf(el), MIN_ROW_PX * Z));

    /**
     * The least a NEIGHBOUR may be squeezed to by a drag.
     *
     * A section in a row band carries a `min(100%, 14rem)` reflow floor — the width at which the browser
     * stops shrinking it and wraps it to the next line instead. Squeezing past that would be fighting the
     * layout rather than driving it, so the shared boundary stops there.
     *
     * And it STOPS rather than writing a size and hoping: Rule 19's second clause, the one the grid cell
     * learned the hard way. Where the partner cannot give, the edge does not move — it never grows out of
     * the far side instead.
     */
    const neighbourMinPx = Math.min(maxW, 14 * rootPx + 2 * HG);

    const P = (px: number) => (px / maxW) * 100;
    const floor2 = (v: number) => Math.floor(v * 100 + 1e-6) / 100;

    // Under a pixel is NOT a gap. Two touching shares render a hair apart (41.41% ends at 424.04px, the
    // floored remainder beside it starts at 424.03), and reading that hair as "space between us" sent the
    // next narrowing down the gap branch: it wrote a 198-unit margin on the neighbour instead of widening
    // it, and a space nobody opened stayed on the page. Measured on a width round trip, 2026-09-26.
    const rawGapE = nextLeftPx - startRightPx;
    const gapE = rawGapE < 1 ? 0 : rawGapE;
    /** How far past a floor the drag must go before a block wraps — see "KEEP PULLING" below. */
    const WRAP_PULL = 24;
    const band = parentRow && info ? info.parent : null;
    /** A block can only wrap inside a band that has a parent to grow into. */
    const canWrap = !!band && !!findParent(rootRef.current, band.id);

    setResizeCursor(cursorFor(edge));
    setResizing(true);
    let raf = 0; let pending: BoxNode | null = null;
    const flush = () => { raf = 0; if (pending) { onChange(pending, gk); pending = null; } };
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      let tree = base;
      // ── WIDTH (EDGE-ANCHORED) ── the grabbed edge moves; the OPPOSITE edge of THIS section stays put.
      // RIGHT edge: grows/shrinks up to the next section's left; the NEXT section stays exactly where it is
      // (its margin-left absorbs the gap) — so you fill the gap and the neighbour never moves. LEFT edge:
      // shifts right with margin-left, keeping this section's right edge fixed (a gap opens on the left).
      if (hasE && !(nextSibId && gapE > 0)) {
        /**
         * THE RIGHT EDGE SPENDS THE WHOLE LINE, NEAREST FIRST — `allocateLine` decides every width (#43).
         *
         * This used to spend only the NEXT block: once it reached its floor it wrapped, and flexbox being ordered,
         * every block after it wrapped too, while this block widened to the whole line. In a row of four an 80px
         * drag became a 770px jump (RULE Q page sweep, 2026-09-27). Now the next block gives down to its floor,
         * then the one after it, and only when no floor fits does the LAST one move down — keeping its width.
         *
         * The same function brings them back: narrowing refills the line in order at the widths they rest at, the
         * last one on the line takes the leftover (no hole opens — the bug the user's screenshot showed), and
         * because it is a pure function of the pointer and each block's rest width, dragging back returns every
         * width exactly (rule 7). It replaces the separate "wrapped neighbour" and "touching" branches, which
         * disagreed at the seam between them.
         *
         * A block that was already on a LATER line when the drag began may only come up at its rest width — its
         * floor is its rest — so shrinking a block never squeezes a second row of the layout up into the first.
         * The one exception is the very next block: wrapped by an earlier drag, it comes back at its floor,
         * because otherwise a hole would sit at the end of the line while it waited underneath (#5).
         */
        const room = maxW - startLeftPx;
        // Never below the floor it is DRAWN at (#67): a section in a row is drawn no narrower than min(100%, 14rem), so a
        // smaller stored width changes nothing on screen — it only makes the stored widths disagree with the page, and
        // every later drag flipped the last block between its line and the next. Self-sizing blocks have no such floor.
        const want = Math.min(room, Math.max(minWpx, selfSizing ? 0 : Math.max(Math.min(maxW, HAND_FLOOR_REM * rootPx + 2 * HG), ownMinPx), W0 + dx));
        // …never more than the stored line has left (c-11b): a line handed back by the drag adds up to 100%, not 100.15%.
        const R = Math.min(P(room), storedBeforePct === null ? Infinity : Math.max(0, 100 - storedBeforePct));
        const fs: LineFollower[] = after.map((f, k) => ({
          id: f.id, rest: P(f.w), gap: P(f.ml), at: f.at, cur: P(f.cur), pending: f.sameLine || f.wrapBy === id,
          late: !f.sameLine && k !== 0 && f.wrapBy !== id, // below since another drag put it there (#62)
          // A block already on a later line comes up only at the width it HOLDS — the squeeze it had before it wrapped
          // included (#53); the very next one may come back at its floor so no hole waits beside it (#5).
          // Every block may come back at its OWN floor — squeezing itself to fit, never the blocks before it (the `late`
          // rule does that, #62). Coming back only at the width it held left a 299px hole beside a 300px block (#69).
          // Squeezing a neighbour across a shared edge IS sizing it by hand (#76): it may go down to the hand floor, never
          // below its content — otherwise the 10 of a 90/10 row, or the sixth of six, could not be as narrow as it was made.
          // …but only for a block ON this line (or pushed below by this very drag). One already below keeps its own floor —
          // 14rem if never sized — and comes back only when there is room for it as it is; otherwise an untouched fifth
          // column was pulled up onto the line and squeezed the others (#76).
          floor: Math.max(P(f.min), Math.min(P(f.sameLine || f.wrapBy === id ? Math.min(maxW, HAND_FLOOR_REM * rootPx) : f.floorPx), P(f.w))),
        }));
        const startKept = after.filter((f) => f.sameLine).length;
        const after0 = new Map(after.map((f) => [f.id, findByIdLocal(base, f.id)]));
        // Where the block and its line stood when the drag began: its drawn share, and any space at the end of the line
        // that belonged to nobody — spent first by widening, left empty by narrowing (#58, #59).
        const own0 = Math.min(R, P(W0));
        const endSpace = Math.max(0, R - own0 - fs.filter((_, k) => after[k].sameLine).reduce((sum, f) => sum + (f.cur ?? f.rest) + f.gap, 0));
        // NO FILL JUMP (decided with the user 2026-09-27): when the last neighbour wraps, the block stops where it was
        // dragged and the rest of the line stays empty — an outer edge. Filling made a separate drag back not return.
        const opts = { fillWhenAlone: false, endSpace, own0, owed: bn.endOwed ?? 0 };
        let r = allocateLine(P(want), R, fs, opts);
        const keptNow = fs.length - r.wrapped.length;
        if (keptNow < startKept) {
          // KEEP PULLING AND IT WRAPS — but not at the exact pixel the floor is reached: the edge STOPS there
          // until the drag goes `WRAP_PULL` further, so a wobble at the end of a drag is not a structural edit.
          // Without a band above to wrap in, it never wraps: the edge simply stops (rule 19).
          const holds = canWrap ? keptNow + 1 : startKept;
          const limit = R - fs.slice(0, holds).reduce((s, f) => s + Math.min(f.floor, f.rest) + f.gap, 0);
          if (!canWrap || P(want) < limit + P(WRAP_PULL)) r = allocateLine(Math.max(limit, P(minWpx)), R, fs, opts);
        }
        const scE = selfSizing ? fitScale((r.own / 100) * maxW, naturalW) : 1;
        /**
         * WHAT ENDS WHERE IT STARTED KEEPS WHAT IT STORED (#61). The line is worked out in DRAWN widths (#58), so an
         * untouched block would otherwise be rewritten at the width it is drawn at on THIS screen — 20% stored,
         * drawn at the 14rem floor, came back as 21.87%, and on a wider desktop five stacks that fitted became four
         * plus one. Only what the drag actually changed is written.
         */
        const same = (a: number, b: number) => Math.abs(a - b) < 0.05;
        /**
         * THE WIDTH TO STORE, remembering an ORIGINAL a drag had to leave (#65). A block storing 20% where the 14rem floor
         * draws it at 21.87% is rewritten in drawn terms once a drag moves it; `origWidth` keeps the "20%", and when a later
         * drag brings it back to exactly what that original draws at, the original is written back and the memory goes —
         * otherwise a round trip made of separate drags could not come home, and a wider screen showed a different layout.
         */
        // …against the floor THIS column is drawn at, never a fixed 14rem: a column on a line of four, or sized by hand, is
        // drawn down to 3rem, so a stored 16% is not "below its floor" and must never be written back as its original —
        // that put a 144px column and an 81px hole in a four-column row after a reload (#82).
        const widthFor = (node0: BoxNode | null | undefined, value: number): Partial<BoxNode> => {
          const floorPct = P((node0 && drawnFloorPx.get(node0.id)) ?? neighbourMinPx);
          const tok = node0?.width;
          const origin = node0?.origWidth ?? (tok?.trim().endsWith("%") && widthPct(tok) < Math.max(floorPct, widthPct(tok)) - 0.05 ? tok : undefined);
          if (origin && same(value, Math.max(floorPct, widthPct(origin)))) return { width: origin, origWidth: undefined };
          return { width: `${value.toFixed(2)}%`, origWidth: origin };
        };
        const ownStored0 = bn.width?.trim().endsWith("%") ? widthPct(bn.width) : null;
        if (!same(r.own, own0) || (ownStored0 !== null && ownStored0 > r.own + 0.001) || (r.owed || 0) !== (bn.endOwed || 0)) tree = writeBox(tree, id, { ...widthFor(bn, r.own), widthByHand: true, restWidth: undefined, restAt: undefined, restBy: undefined, endOwed: r.owed || undefined, ...(selfSizing ? { contentScale: scE < 1 ? scE : undefined } : {}) });
        after.forEach((f) => {
          const w = r.widths.get(f.id);
          // A block that stays where it was — already below, and still below — is not touched.
          if (!w || (!f.sameLine && r.wrapped.includes(f.id))) return;
          // Squeezed by THIS drag → stamped now; already away from rest before it → keeps the older stamp (#53).
          // Pushed below by THIS drag → it names this block, which pays its end-of-line debt only once it is home (#58).
          const wrapBy = r.wrapped.includes(f.id) ? (f.sameLine ? id : f.wrapBy) : undefined;
          const node0 = after0.get(f.id);
          // Unchanged: keep its stored value — but ONLY when that value is no LARGER than the new layout needs. Keeping a
          // stored 25% where 24.98% was worked out summed the line to 100.03%, and a browser wraps on anything over 100% —
          // the last block dropped and left a hole (#66). A stored value BELOW it (20% drawn at the floor, #61) is safe.
          const stored0 = node0?.width?.trim().endsWith("%") ? widthPct(node0.width) : null;
          if (same(w.width, P(f.cur)) && (stored0 === null || stored0 <= w.width + 0.001) && (w.rest === undefined) === !node0?.restWidth && wrapBy === node0?.wrapBy) return;
          // Another drag's memory, and this drag did not move it: keep that memory whole (#77) — it is how THAT edge comes home.
          if (f.foreign && same(w.width, P(f.cur)) && (stored0 === null || stored0 <= w.width + 0.001) && wrapBy === node0?.wrapBy) return;
          tree = writeBox(tree, f.id, { ...widthFor(node0, w.width), widthByHand: node0?.widthByHand || !r.wrapped.includes(f.id) || undefined, restWidth: w.rest !== undefined ? `${w.rest.toFixed(2)}%` : undefined, restAt: w.rest !== undefined ? (f.at ?? dragStamp) : undefined, restBy: w.rest !== undefined ? id : undefined, wrapBy });
        });
      }
      if (hasE && nextSibId && gapE > 0) {
        const gapPx = gapE;
        // SHARED BOUNDARY. The edge you grab moves and the block after it gives up exactly what you take —
        // so the line stays full and the pair's widths always sum to what they summed to before. Keeping
        // that sum constant also matters downstream: `clampRowWidths` rescales a row whose widths exceed
        // 100%, which would silently undo the drag the moment it overshot.
        const wanted = Math.max(startLeftPx + minWpx, startRightPx + dx);
        // How far the boundary may travel: what the neighbour can give before it hits its floor, or — with
        // no neighbour on this line — the rest of the row.
        /**
         * THE EMPTY SPACE IS SPENT FIRST, and only then the neighbour's width.
         *
         * Two blocks that TOUCH share a boundary, so dragging it has to spend the neighbour — that is the
         * whole of the shared-boundary rule. But where a GAP sits between them, growing into the gap costs
         * the neighbour nothing and must not move it: the space is already free. Spending its width anyway
         * would shrink a block the user sized in order to fill space that belonged to nobody.
         */
        const give = nextSibId
          ? gapPx + Math.max(0, nextWidth0 - neighbourMinPx)
          : Math.max(0, maxW - startRightPx);
        /**
         * KEEP PULLING AND THE NEIGHBOUR MOVES TO THE NEXT LINE, keeping the width it had.
         *
         * Stopping dead at the neighbour's floor is defensible, but it makes "let this block have the whole
         * row" unreachable by the gesture a person actually uses. Past the floor the neighbour therefore
         * leaves the line rather than being crushed on it — and it takes its ORIGINAL width with it, because
         * that width is a decision the user made and wrapping is not a reason to discard it.
         *
         * `WRAP_PULL` is the deliberate-intent margin. Without it the neighbour would jump lines at the exact
         * pixel the floor is reached, which turns a small wobble at the end of a drag into a structural edit.
         *
         * It happens DURING the drag, not on release, so what you are shown is what you get — the rule the
         * grid cell's "what the drag SHOWS is what the release COMMITS" test exists to hold. And because each
         * move rebuilds from `base`, dragging back undoes it: the neighbour returns to the line by itself.
         */
        const wraps = !!nextSibId && canWrap && wanted > startRightPx + give + WRAP_PULL;
        const right = wraps ? maxW : Math.min(startRightPx + give, wanted);
        const scE = selfSizing ? fitScale(right - startLeftPx, naturalW) : 1;
        const own = pct(right - startLeftPx);
        tree = writeBox(tree, id, { width: own, widthByHand: true, restWidth: undefined, restAt: undefined, restBy: undefined, endOwed: undefined, ...(selfSizing ? { contentScale: scE < 1 ? scE : undefined } : {}) });
        if (wraps) {
          /**
           * IT WRAPS BY ITSELF — nothing is moved.
           *
           * This used to lift the neighbour out of the band and into a new band below. That worked, and it
           * was the wrong mechanism: a structural move is one-way. Reverse the drag afterwards and there is
           * nothing to reverse, because the tree no longer records that those blocks ever shared a line, so
           * narrowing this block again left them stranded underneath.
           *
           * Now the widths simply stop adding up to a single line and the band's own wrapping does the rest
           * (`clampRowWidths` no longer rescales a row that can wrap). Widen and the neighbour drops below;
           * narrow and it comes back up beside you. Nothing is remembered because nothing changed.
           *
           * The neighbour is RESTORED to the width it RESTS at — not the floor it was squeezed to on the way, and
           * not merely its width when THIS drag began, which an earlier drag may already have squeezed — so what
           * comes back is the block the user had, not a sliver.
           */
          tree = writeBox(tree, nextSibId!, { width: pct(nextRest || nextWidth0), restWidth: undefined, restAt: undefined, restBy: undefined });
        } else if (nextSibId && gapPx > 0) {
          // A GAP between us: the neighbour's margin absorbs the change so it stays EXACTLY where it is,
          // and only what is taken PAST its left edge comes out of its width. Narrowing re-opens the gap
          // rather than handing width back — the space was nobody's to begin with.
          //
          // THE GAP IS A SHARE OF THE LINE, like the widths either side of it — the same cure the left edge
          // already had (`marginLeftPct`). Written as a length it sat beside percentages that scale with the row
          // while it did not, so at any other screen width the line no longer added up and could wrap. The three
          // are taken from one stored total so they can neither overflow nor drift across repeated drags.
          const ownStored = bn.width?.trim().endsWith("%") ? widthPct(bn.width) : (W0 / maxW) * 100;
          const total = ownStored + ((gapPx + nextWidth0) / maxW) * 100;
          const nPct = (nextWidth0 / maxW) * 100;
          if (right <= nextLeftPx) {
            const gapPct = Math.max(0, Math.floor((total - parseFloat(own) - nPct) * 100 + 1e-6) / 100);
            tree = writeBox(tree, nextSibId, { marginLeftPct: gapPct > 0 ? gapPct : undefined, marginLeft: undefined });
          } else {
            tree = writeBox(tree, nextSibId, { marginLeftPct: undefined, marginLeft: undefined, width: remainderPct(total, own) });
          }
        }
      }
      if (hasW) {
        // The mirror image: this block's left edge spends the block BEFORE it. With nothing before it on the
        // line there is no boundary to share, so it keeps the old behaviour and opens a gap with margin-left.
        const wanted = Math.min(startRightPx - minWpx, startLeftPx + dx);
        const give = prevSibId ? Math.max(0, prevWidth0 - neighbourMinPx) : Math.max(0, startLeftPx - flowX);
        const left = Math.max(startLeftPx - give, wanted);
        const scW = selfSizing ? fitScale(startRightPx - left, naturalW) : 1;
        /**
         * THE GAP AND THE WIDTH ARE ONE SUM, so they are taken from one basis and in one unit.
         *
         * With nothing before it on the line there is no boundary to share, so the left edge opens a gap — and
         * that gap has to ADD UP with the percentage widths beside it. Written as a length it cannot: measured,
         * a 140.15px margin beside widths of 35.83% + 50% came to 988.15px in a 988px row, and the block beside
         * it wrapped onto a second line and doubled the band's height. An overflow of **0.15px**.
         *
         * So the gap is a percentage (`marginLeftPct`) and the width is the REMAINDER of what this block
         * already occupied — not a second independent rounding. Rounding each separately leaves the pair
         * 0.01% adrift, which is a tenth of a pixel at this width and is exactly what wrapped the row.
         */
        const share = (px: number) => Math.round(((px / maxW) * 100 + Number.EPSILON) * 100) / 100;
        // What this block occupied, gap included — its STORED total when it has one, so opening a space and closing it
        // again gives back exactly what was there. Re-measured, a column on fractional pixels (the band's half gaps,
        // S1-a) came home at 50.02% beside a 50% neighbour, and the line no longer added up.
        const storedOuter = bn.width?.trim().endsWith("%") ? parseFloat(bn.width) + (bn.marginLeftPct ?? 0) : null;
        const outerPct = storedOuter ?? share(startRightPx - flowX);
        const gapPct = prevSibId ? 0 : Math.max(0, share(left - flowX));
        const widthPct = Math.max(3, Math.min(100, Math.round((outerPct - gapPct) * 100) / 100)); // two decimals, like every stored share
        const ownW = prevSibId ? pct(startRightPx - left) : `${widthPct}%`;
        tree = writeBox(tree, id, {
          width: ownW, widthByHand: true, restWidth: undefined, restAt: undefined, restBy: undefined, endOwed: undefined,
          // One field owns this gap. The old length is cleared so the two can never disagree about it.
          ...(prevSibId ? {} : { marginLeftPct: gapPct > 0 ? gapPct : undefined, marginLeft: undefined }),
          ...(selfSizing ? { contentScale: scW < 1 ? scW : undefined } : {}),
        });
        // The block BEFORE takes the REMAINDER of the pair's stored sum — the right edge's rule, mirrored. Two
        // separately rounded shares summed to 100.01% and this block wrapped onto the next line, leaving an 800px
        // hole behind it (RULE Q sweep, 2026-09-26).
        if (prevSibId) {
          const ownStored = bn.width?.trim().endsWith("%") ? parseFloat(bn.width) : (W0 / maxW) * 100;
          const pTok = remainderPct(ownStored + P(prevWidth0), ownW), pRest = floor2(P(prevRest || prevWidth0));
          tree = writeBox(tree, prevSibId, { width: pTok, restWidth: parseFloat(pTok) < pRest - 0.005 ? `${pRest.toFixed(2)}%` : undefined, restAt: parseFloat(pTok) < pRest - 0.005 ? (prevAt ?? dragStamp) : undefined, restBy: parseFloat(pTok) < pRest - 0.005 ? id : undefined });
        }
      }
      // ── HEIGHT ── the height you drag sets a MIN-HEIGHT (a floor), not a fixed height. The section HUGS
      // its content, so growing a child grows the section; shrinking below the content does nothing (the
      // content holds it up); and when children are empty, dragging the floor up/down grows/shrinks them.
      // A SELF-PAINTING block (COMPONENT or BUTTON) resizes FREELY in height: it gets a DEFINITE height (px) so its
      // element (which FILLS the box via height:100%) actually grows/shrinks with the drag. A normal element/section
      // uses min-height (a floor it hugs up from) so it can still grow with its content.
      const isComp = node.type === "component" || node.type === "button";
      if (hasS && below.sibId) {
        /**
         * THE MIRROR OF THE TOP EDGE: the block BELOW owns this boundary, so it absorbs what this one releases.
         *
         * Reported by the user with screenshots: shrink a stack and *"the one at the bottom of it just moves up
         * with it — it doesn't stay at the bottom and increase"*. It did exactly that, because this branch only
         * ever wrote THIS block's height and left the one beneath to slide. Measured on their shape: the
         * neighbour grew **0px**, its far edge moved **-140px**, and **140px of space appeared at the foot of
         * the column** — which they had not asked for, having never touched that block's bottom edge.
         *
         * A space at the foot is only ever theirs to make: it comes from dragging the LAST block's bottom edge,
         * the one that faces nothing. That case still opens one, because `below.sibId` is null there.
         *
         * No margin arithmetic here, unlike the top edge. This block's TOP does not move, so its height is
         * simply what the drag asked for — there is no stored margin under the pointer whose rounding could
         * push the anchored edge about (rule 19's fourth outing).
         */
        // The height is EXACTLY what the drag asked for — the same expression as the no-partner case below,
        // deliberately, so a partner can never change what a drag stores. Three guards assert that directly.
        const h = Math.round(Math.max(startTopPx + minHpx, startBotPx + dy) - startTopPx);
        const scS = fitScale(h, naturalH);
        tree = writeBox(tree, id, isComp
          ? { height: remLen(h, rootPx), minHeight: undefined, clip: undefined, contentScale: scS < 1 ? scS : undefined }
          : { minHeight: lay(h), height: undefined });
        // …AND THE ROOM GROWS WITH IT (see `cappingBand`). Without this the gain is taken from whatever sits
        // above inside the same capped band — a `fill` block gives it up without resisting, because its height
        // is leftover — and the anchored TOP edge moves. Measured on the user's page: 61px of a 90px drag.
        const grewS = Math.round(h - H0);
        if (cappingBand && grewS > 0) tree = writeBox(tree, cappingBand.id, { minHeight: lay(cappingBand.h0 + grewS) });
        /**
         * ONLY WHAT WAS RELEASED, AND ONLY WHEN SHRINKING.
         *
         * Shrinking hands the room to the block below, which grows into it so its own bottom edge does not
         * move — the user's report: *"it doesn't stay at the bottom and increase"*.
         *
         * GROWING does NOT squeeze it. A row has a fixed width its blocks must share, so taking width there
         * has to come from a neighbour; a column can simply get taller, so taking height pushes the block
         * below DOWN and the page grows. Squeezing it instead would shrink content nobody touched.
         */
        /**
         * THE BOUNDARY MOVES BOTH WAYS, and it has to, or the page can never come back.
         *
         * This used to be one-directional: shrinking handed the room to the block below so no gap opened,
         * while growing deliberately did NOT take it back — the reasoning being that a column can simply get
         * taller, so the block below is pushed down and the page grows rather than squeezing content nobody
         * touched. Each half is defensible on its own. Together they are a RATCHET.
         *
         * Measured, six times around: drag this edge down 80 and back up 80, over and over. The block below
         * went **208 → 288 → 368 → 448 → 528 → 608** and the page **464 → 864**, while the block being
         * dragged sat at 128 the whole time. Every round trip made the neighbour 80px taller and nothing
         * ever gave it back. Reported as the page "fidgeting" when resized repeatedly, and as the reason a
         * layout could not be returned to where it was.
         *
         * So growing RECLAIMS what shrinking gave — as far as the block below can give, never past its own
         * content — and only what it cannot supply grows the page. One rule for the boundary instead of two
         * opposite ones, and `slack` is what makes it safe: content is never squeezed, the edge simply stops.
         */
        const released = H0 - h;
        if (released > 0) {
          const bh = Math.max(MIN_ROW_PX, Math.round(below.h0 + released));
          tree = writeBox(tree, below.sibId, below.isComp
            ? { height: remLen(bh, rootPx), minHeight: undefined }
            : { minHeight: lay(bh), height: undefined });
        } else if (released < 0) {
          const taken = Math.min(-released, below.slack);
          if (taken > 0) {
            const bh = Math.max(MIN_ROW_PX, Math.round(below.h0 - taken));
            tree = writeBox(tree, below.sibId, below.isComp
              ? { height: remLen(bh, rootPx), minHeight: undefined }
              : { minHeight: lay(bh), height: undefined });
          }
        }
      } else if (hasS) {
        // Nothing below it: the bottom edge faces open space, so it simply opens some. Top fixed, bottom moves.
        const h = Math.round(Math.max(startTopPx + minHpx, startBotPx + dy) - startTopPx);
        const sc = fitScale(h, naturalH);
        tree = writeBox(tree, id, isComp ? { height: remLen(h, rootPx), minHeight: undefined, clip: undefined, contentScale: sc < 1 ? sc : undefined } : { minHeight: lay(h), height: undefined });
        // GROWING RAISES THE ROOM IT GROWS IN (see `cappingBand`), so the gain never comes out of a sibling
        // above. Shrinking leaves the band alone: that space is the one the gesture is deliberately opening.
        const grew = Math.round(h - H0);
        if (cappingBand && grew > 0) tree = writeBox(tree, cappingBand.id, { minHeight: lay(cappingBand.h0 + grew) });
      }
      if (hasN && aboveSibId) {
        /**
         * A SHARED BOUNDARY, on the vertical axis — the same bargain the east and west edges have always
         * struck, and the arithmetic the grid cell already proved: the boundary moves as far as the block
         * on the FAR SIDE of it can give, and that block absorbs exactly what this one releases.
         *
         * Drag the top DOWN and this block shrinks while the one above grows into the space, so no hole
         * ever opens. Drag it UP and this block grows while the one above gives the height back, clamped to
         * the height its own content needs — where it cannot give, the edge STOPS rather than growing out
         * of the far side (rule 19's second clause). `margin-top` goes to zero and STAYS there: the pair is
         * held together by flow, so nothing can carry a gap along in front of it.
         */
        /**
         * THE SPACE BETWEEN THEM IS SPENT FIRST, and only then the block above — the rule the EAST edge
         * already follows ("growing into the gap costs the neighbour nothing and must not move it").
         *
         * This branch used to write `margin-top: 0` flat. With no spacing above, that is the same thing and
         * every guard passed. Give the block outer spacing, though, and it INVERTED the gesture: zeroing a
         * 40px margin lifted the block 40px while the pointer was dragging it down, so a 20px drag DOWN
         * moved the top 20px UP — and the spacing the user had asked for was gone for good.
         *
         * So the gap is a quantity the drag spends, not a value the drag clears. Growing upward closes it
         * first and takes from the block above only once it is used up; shrinking hands the space to the
         * block above and leaves the gap exactly as it was. Where there is no gap, the arithmetic reduces
         * to what it was before, which is why the original guards still hold.
         */
        const rise = Math.max(-selfSlack, Math.min(-dy, aboveGap0 + aboveSlack));
        const fromGap = Math.min(Math.max(rise, 0), aboveGap0); // only GROWING eats the gap
        const fromPartner = rise - fromGap;                     // negative → the block above grows instead
        const ah = Math.max(MIN_ROW_PX, Math.round(aboveH0 - fromPartner));
        const mt = pxU(Math.max(0, Math.round(aboveGap0 - fromGap)));
        /**
         * THE HEIGHT IS DERIVED FROM THE MARGIN THAT WAS ACTUALLY STORED — rule 19, held by construction
         * rather than by arithmetic that happens to round nicely.
         *
         * `h` used to be `H0 + rise`, rounded to whole PIXELS, while `mt` is quantised to whole stored UNITS
         * by `pxU`. The bottom edge sits at `flowOrigin + margin_px + height`, so pinning it needs that sum to
         * be exact — and two independent roundings do not add up. It looked correct for a long time only
         * because the fluid unit happened to be 1.28px at the widths the guards used, so the error cancelled.
         * The moment `--box-u` gained its rem term (Core Rule 16) the numbers stopped cancelling and the
         * anchored bottom drifted 3px. That is rule 19's fourth outing, and the first one caused by a unit.
         *
         * So the margin is quantised FIRST, converted back to the pixels it really means, and the height is
         * whatever is left between the flow origin and the bottom the drag must not move. The origin itself
         * moves when the block above changes height, which is what `(ah - aboveH0)` accounts for.
         */
        const mtPx = (boxU * mt) / 10;
        /**
         * NOT ROUNDED TO A WHOLE PIXEL. `mtPx` is fractional — a whole number of stored units is rarely a
         * whole number of pixels — so rounding the height leaves that fraction unabsorbed and the anchored
         * bottom lands up to a pixel out. The height is emitted through `remLen`, which keeps three decimals,
         * so it can carry the remainder exactly and the sum closes.
         */
        const h = Math.max(MIN_ROW_PX, Math.round((startBotPx - (flowY + (ah - aboveH0)) - mtPx) * 1000) / 1000);
        const scN = fitScale(h, naturalH);
        tree = writeBox(tree, id, isComp
          ? { height: remLen(h, rootPx), minHeight: undefined, clip: undefined, marginTop: mt, contentScale: scN < 1 ? scN : undefined }
          : { minHeight: lay(h), height: undefined, marginTop: mt });
        tree = writeBox(tree, aboveSibId, aboveIsComp
          ? { height: remLen(ah, rootPx), minHeight: undefined }
          : { minHeight: lay(ah), height: undefined });
      } else if (hasN) {
        // Edge-anchored: the BOTTOM stays put, the TOP moves. Dragging the top UP grows the block — even at the
        // canvas top — by letting margin-top go negative so the block extends upward (was clamped to the flow
        // origin, which pinned the first block and made top-resize do nothing).
        // Clamped to the PAGE TOP (see PAGE BOUNDS above) so growing upward can never push the block — and its
        // resize handle — off the page. Below the page top it is still free to grow up past its own section.
        // AT THE WALL THE EDGE STOPS DEAD. It does not grow out of the far side, and it does not keep pace with
        // the pointer once there is nothing left above to give — RULE 19, and the user's own call when asked.
        // (An earlier note here described the opposite, added-to-the-bottom behaviour. `resizeTopEdge` has never
        // done that; the note outlived the code and is the reason a runaway height was misdiagnosed here.)
        // `resizeTopEdge` (box-model) owns the maths + the page clamp so the rule is unit-testable.
        const { top } = resizeTopEdge(startTopPx, startBotPx, dy, minHpx, pageTopPx ?? flowY); // the height follows from the stored margin below
        const mt = pxU(top - flowY); // may be negative → the block grows upward past its flow origin
        // THE HEIGHT IS WHAT IS LEFT BELOW THE MARGIN AS STORED (#81). The margin is rounded to whole units; taking the height
        // from the UNrounded top rounded it a second time, and the two errors put the anchored bottom 1px off at some drag
        // distances — reproduced on demand under load, where merged mouse moves end a drag on one of those distances.
        const hN = Math.max(minHpx, startBotPx - (flowY + (boxU * mt) / 10));
        const scN = fitScale(hN, naturalH);
        tree = writeBox(tree, id, isComp ? { height: remLen(hN, rootPx), minHeight: undefined, clip: undefined, marginTop: mt, contentScale: scN < 1 ? scN : undefined } : { minHeight: Math.round((hN / Z) * 1000) / 1000, height: undefined, marginTop: mt });
      }
      pending = tree;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onUp = () => {
      if (raf) { cancelAnimationFrame(raf); flush(); }
      setResizing(false); setResizeCursor(null);
      document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp);
      /**
       * OUTWARD GROWS THE BAND; INWARD SHRINKS THE BLOCK — decided here, because only here is the outcome known.
       *
       * Starting the drag un-stretches the block (`alignSelf: "flex-start"` in the cross-axis anchor above) so a
       * stretched box does not jump the instant you grab it. That is right for the gesture and wrong to KEEP:
       * un-stretched is permanent, so the block never follows its band again.
       *
       * Measured, and the user's report — *"the stack on the left starts creating space, which is not needed"*:
       * drag the navy stack's bottom edge down (it un-stretches, minHeight 440), then drag the brown stack below
       * it down. The band grows to 490, the navy stays at 440, and a **50px hole** opens under it that nobody
       * asked for. The height was theirs; the hole was not.
       *
       * So the anchor is released again whenever the block ends the drag FILLING its band. A block deliberately
       * dragged SHORTER than its band keeps it, because that space is the one thing the user did ask for — which
       * is the whole rule in one line: a space belongs to the edge you dragged, and to no other gesture.
       */
      if ((hasN || hasS) && !hasE && !hasW && parentRow) {
        const meEl = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(id)}"]`);
        /**
         * THE TEST IS THE DIRECTION YOU DRAGGED, not whether the block happens to fill its band.
         *
         * Asking "does it fill its band?" reads as the same question and is circular: a band holding a
         * deliberately-sized block HUGS it (see `holdsADeliberateSize` in box-model), so the block fills its
         * band by construction, always — the anchor was therefore cleared every time and the shrink undone
         * the instant you let go. Measured: dragging a stack's bottom edge up 120px moved it 0px.
         *
         * Grew or unchanged → it is following its band again, so release the anchor. Ended SHORTER than it
         * started → that is the space being asked for, and the anchor is what keeps it.
         */
        const paEl = meEl?.parentElement?.closest<HTMLElement>("[data-box-id]");
        if (meEl && paEl) {
          /**
           * A SPACE IS A MARGIN, NOT A LEFTOVER — which is what the top edge has always done, and what the
           * bottom edge did not.
           *
           * Dragging the bottom edge up used to leave the block short and let the space fall out of whatever
           * the layout had spare. That reads the same and behaves completely differently, because leftover is
           * recomputed every time anything changes: the space then ABSORBS every later growth instead of
           * staying the size it was asked to be. Measured, and reported — *"I am only decreasing the height
           * from the top of the grey one"* — growing the band above by 90px grew the stack beside it to 390
           * and left the brown stack at 276, so a **90px hole** appeared under it that no gesture had asked
           * for.
           *
           * Written as a margin it is a fixed quantity: the block goes back to stretching with its band, the
           * space stays exactly as wide as the user made it, and growth from anywhere else is absorbed by the
           * block rather than added to the gap. Measured while `alignSelf` still pins the block, because once
           * it stretches the block fills its band by definition and the space measures zero.
           */
          const cs = getComputedStyle(paEl);
          const pa = paEl.getBoundingClientRect();
          const floor = pa.bottom - (parseFloat(cs.paddingBottom) || 0) * Z;
          const below = Math.round(floor - meEl.getBoundingClientRect().bottom);
          onChange(writeBox(rootRef.current, id, {
            alignSelf: undefined,
            marginBottom: hasS && below > 2 ? pxU(below) : undefined,
          }), gk);
        }
      }
      onResized?.(id, (hasS || hasN) && !hasE && !hasW ? "height" : "width");
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const addChild = (parentId: string, kind: BoxType | "row" | "grid" | "accordion", patch: Partial<BoxNode> = {}) => {
    const parent = findByIdLocal(root, parentId);
    const node = Object.assign(
      /**
       * A STACK FROM THIS MENU IS THE SAME STACK THE PALETTE MAKES — `blockForKind`, one definition.
       *
       * It built its own, and built it wrong twice over. `createContainer("row", { direction: "row" … })`
       * is a SIDE-BY-SIDE row, under a menu item labelled "Stack" — the label and the code disagreed. And
       * it set `clip: true`, which is the explicit "this may shrink past its content" opt-in, so an empty
       * one rendered ZERO PIXELS: the block was added, correctly, and could not be seen.
       *
       * Two routes to "add a Stack" that produce different blocks is the drift a single resolver exists to
       * prevent — the same rule `radiusCSS` and `containerLabel` are held to.
       */
      kind === "row" ? createContainer("row")
      // …and a GRID likewise. `createGrid(3)` is three columns with NOTHING IN THEM — the empty shell
      // `blockForKind` exists to avoid, and its comment says why: "no cell to click, nothing to resize and
      // nowhere to put anything". Adding a Grid from this menu produced exactly that, while the palette's
      // Grid produced a real one. Same block, two routes, one of them unusable.
      : kind === "grid" ? blockForKind("grid")
      : kind === "container" ? blockForKind("container")
      : kind === "accordion" ? createComponent("accordion")
      : createElement(kind as Exclude<BoxType, "container">),
      patch,
    );
    // If the parent lays its blocks out horizontally (a section / wrapping row), the new block fills the
    // row's leftover width and WRAPS when full — so blocks sit BESIDE each other, never overflowing.
    //
    // NOT in a grid. A grid is built by `createContainer("row", …)`, so it matched this test and every block
    // added to one was given a leftover-percentage WIDTH — a value a grid child does not use (its span
    // governs) and which made the block report a width it did not have. What decides a cell's size is
    // `newCellSpan`, in insertBox.
    if (parent && parent.layout !== "grid" && (parent.direction ?? "column") === "row") {
      const used = (parent.children ?? []).reduce((s, c) => s + widthPct(c.width), 0);
      node.width = used <= 88 ? `${Math.max(15, Math.round(100 - used))}%` : "100%";
    }
    /**
     * THE NEW BLOCK IS SELECTED. ALWAYS — and it took two reports to get here.
     *
     * The original rule was to leave the selection alone "so you can keep adding". It meant that adding
     * into a box produced NO VISIBLE CHANGE in the two commonest cases, and both were reported as the
     * feature being broken:
     *
     *   • into an EMPTY box: the new block is transparent, has no content and exactly fills its parent, so
     *     nothing on screen moves at all;
     *   • into a GRID: two transparent 50px cells look exactly like one transparent 100px cell — the grid
     *     shares its height out and does not grow.
     *
     * The second is why this is not conditional on the parent being empty, which was the first attempt:
     * "can you see it?" is not a question about whether the parent had children. Every item in the menu
     * worked both times; every item looked broken.
     *
     * Selecting what just landed is the one signal that works in every case — an outline round it, and the
     * inspector on it, ready to style the thing you just made. Adding several in a row costs one click on
     * the parent's + again, which is a fair price for never wondering whether the last one happened.
     */
    const index = parent?.children?.length ?? 0;
    onChange(insertBox(root, parentId, index, node));
    select(node.id);
    closeMenu();
  };

  /**
   * ADD `type` INSIDE `parentId` — and a GRID asks for its shape first, exactly as the palette does.
   *
   * Both "Add inside" menus used to insert a grid outright, so a grid added inside a box arrived as a fixed
   * one-cell 1×1 while the same Grid from the palette asked how many across and how many down. There is a
   * whole spec on the palette's two routes both opening that picker — "dragging a tile says WHERE a layout
   * goes; it does not say what the layout IS, and the builder must not answer that for you" — and this
   * third route quietly answered it. "I should be able to add a grid inside a stack with as many rows and
   * columns as I want" is that gap, reported.
   */
  const addInsideOf = (parentId: string, type: BoxType | "row" | "grid" | "accordion", anchor: MenuAnchor) => {
    if (type === "grid") {
      const parent = findByIdLocal(rootRef.current, parentId);
      setPendingGrid({ anchor, parentId, index: parent?.children?.length ?? 0, moveWidth: null, selectAfter: true });
      return;
    }
    addChild(parentId, type);
  };

  /**
   * `sizedAbove` — an ancestor has been given an explicit height, so the EDITOR COURTESY HEIGHT that an
   * unsized empty box normally gets must step aside. Otherwise a box you have just dragged small is held
   * open from the inside by empty children nobody sized, and the size you set is not the size you get.
   */
  const renderNode = (rawNode: BoxNode, parent: BoxNode | null, sizedAbove = false, hostSized = false, capturedAbove = false): React.ReactNode => {
    // Resolve the box for the active breakpoint (base merged with tablet/mobile overrides). Same id/type/
    // children as the base, so selection + structure are unaffected — only style/geometry differ.
    const node = resolveResponsive(rawNode, breakpoint);
    const semR = sem.byId.get(node.id);
    const semTag = semR && isContainer(node) && semR.tag && !/^h[1-6]$/.test(semR.tag) ? semR.tag : "div";
    // Typed as "div" for the props it takes; every element it can be accepts the same attributes.
    const Tag = (semR?.listItem && semTag === "div" ? "li" : semTag) as "div";
    const semProps = { "aria-label": semR?.label, "data-sem-list": semTag === "ul" || semTag === "ol" ? "" : undefined };
    const isSel = editable && selSet.has(node.id);
    const isSolo = isSel && selSet.size === 1; // per-box toolbar + resize handles only when EXACTLY one is selected
    const isRoot = parent === null;
    // Hidden on this breakpoint: gone, exactly as on the published page — it takes no space and moves nothing (decided
    // with the user 2026-09-28, #132: drawn faintly it wrapped the header onto two lines on the canvas and one in the
    // Preview). "Show hidden blocks" brings it back, faint, so it can be selected and un-hidden.
    if (node.hidden && (!editable || !showHidden)) return null;
    // "STACK on narrow": on mobile a (non-pinned) float drops back into normal flow — full-width, content-height —
    // so it can never clip its content or overflow its parent on a phone. Editor MUST match the export here.
    const stacked = breakpoint === "phone" && !isRoot && floatStacksOnMobile(rawNode);
    const floating = isFloating(node) && !isRoot && !stacked;
    // SELF-PAINTING blocks (components AND buttons) draw their own visual (background/border/radius/shadow) on the
    // block element itself and FILL the box — so the wrapper stays transparent (no duplicate "shape behind" when the
    // block is resized) and the visual grows with the box while its content re-centres. Everything else paints on the wrapper.
    const selfPaint = node.type === "component" || node.type === "button";
    // The content of a PAGE SECTION keeps the side gutter and the section space (rule 3) — the export decides it
    // the same way, from the same helper.
    const section = parent != null && sectionContent(rawNode, parent.id === root.id, !!parent.rowBand && (root.children ?? []).some((c) => c.id === parent.id), parent);
    const wrapStyle: React.CSSProperties = {
      position: floating ? "absolute" : "relative", // floating boxes are positioned inside their (relative) parent → they overlap the flow
      maxWidth: "100%", // Responsive Field Guide: never wider than the container (a fixed px width shrinks on a phone — no horizontal scrollbar). Editor MUST match the export.
      // A COMPONENT's border/radius/shadow/background style the COMPONENT ITSELF (injected onto `.eu-<component>`),
      // not this wrapper — so the wrapper stays transparent and the controls act on the pill/card/quote directly.
      ...(selfPaint ? {} : decorStyle(node)), // border, shadow, per-corner radius, rotation
      ...(floating ? {} : marginCSS(node)), // margins are a FLOW concept; a floating box uses left/top instead
      ...leafPaddingCSS(node, section), // inner spacing on a plain element (c-23) — the export writes the same
      // SEE-THROUGH: only a WHOLE-BOX fade reaches this wrapper. A box that is fading just its own paint
      // puts the alpha into its background/border colours instead (see `fadedPaint`), so nothing inside it
      // is touched. A component paints its own element, and `hidden` is the editor showing you a box that
      // will not be published.
      opacity: node.hidden ? 0.35 : node.type === "component" ? undefined : boxOpacity(node),
      overflow: stacked || isSolo ? "visible" : isClipped(node) ? "hidden" : undefined, // selected → show the outside toolbar + resize handles (never clip them); stacked → grow with content; else clip only when opted-in/rounded
      // Floating: free-position on its own layer. Stacked (mobile): plain full-width flow block. Flow: fill+divide
      // per childStyle. Root: fill the canvas + define the global base unit (--box-u, rem-based).
      ...(floating
        ? { left: `${node.left ?? 0}%`, top: `${node.top ?? 0}%`, width: sizeToCSS(node.width), height: node.height ? sizeToCSS(node.height) : undefined, minHeight: node.minHeight, zIndex: floatZIndex(node), ...floatHoldCSS(node) } // no width ⇒ auto ⇒ hug content; a floated block may still hold on screen
        : stacked
        ? { width: "100%" } // content-height (no fixed height/minHeight) so nothing is clipped
        : parent ? childStyle(node, parent, breakpoint, hostSized) : {
            /**
             * THE PAGE FLOOR IS AN OFFER FOR AN EMPTY PAGE, and steps aside the moment there is content.
             *
             * It was applied unconditionally, and that produced a strip of dead space under the first block
             * a user added: the page insisted on 160px while an empty Stack is 128px (the 8rem courtesy
             * height), so 32px sat below it — on the page ROOT, where there is no control to remove it.
             *
             * Worse, the floor is the CANVAS's alone: the export writes no page minimum, so the editor was
             * drawing a page taller than the published one for any page shorter than 160px. Standing rule is
             * canvas = export, and a floor that only one of them applies breaks it.
             *
             * Same shape as the empty-box courtesy height below: something to see and drop into when there
             * is nothing, never a size imposed on a page that has content.
             */
            width: "100%",
            minHeight: Math.max((node.children?.length ?? 0) ? 0 : minHeight, floatingReserve(node, breakpoint)),
            ["--box-u" as string]: baseUnit(node.baseFont ?? 10),
            ["--box-t" as string]: baseUnit(node.baseFont ?? 10), // the TYPE unit, computed here at the page root (#133)
            // The role defaults everything below inherits — the SAME set the export writes on the page root,
            // or a font set on a section would cascade while you edit and not on the published site.
            ...typoRootVars(theme),
            // The EDITOR's own text is tracked (`body { letter-spacing: 0.02em }` in globals.css) and the page
            // inherited it: every word on the canvas was 0.32px wider per letter than on the published page, whose
            // root sets nothing and so gets `normal`. The page starts from the published page's default, not the
            // editor's. Found by the Preview check, 2026-09-27.
            letterSpacing: "normal",
            // A TOAST is `position:fixed`, the same rule the export emits. A transform on this page root makes
            // it the containing block for fixed descendants, so the toast pins to the PAGE frame here and to the
            // viewport on the published site — identical CSS, and it can never float over the editor chrome.
            // Applied only when the page actually has a toast, so nothing else changes rendering.
            ...(treeHasToast(node) || treeHasFixedHold(node) ? { transform: "translate(0)" } : {}),
          }),
      ...(selfPaint ? {} : backgroundStyle(node)), // a component/button's background styles the block element, not this wrapper
      // Advanced CSS goes LAST, so it beats the generated styles above — which is exactly what the export does
      // (it appends the same declarations to the end of the node's own rule). Until this line, the canvas
      // applied Advanced CSS only inside the component branches: on a section, heading or text it did nothing
      // while you edited and then appeared on the published site.
      // A CONTAINER hands its typography down to everything inside it (see typoCascadeCss) — the same
      // declarations the export writes, so the canvas shows the cascade a visitor will get.
      ...(isContainer(node) ? typoCascadeCss(node) : {}),
      // The space OUTSIDE a block that paints its own box (S-2 (5)) — after the sizing it corrects, before Advanced CSS.
      ...(floating || stacked ? {} : outerSpaceCSS(node, section && (parent?.rowBand ? "band" : "page"))),
      ...advancedCssStyle(node),
    };

    /**
     * LAST OF ALL, THE ONE THING THE CANVAS CANNOT RENDER LITERALLY. A block that floats on screen is
     * `position: fixed` on the published page; here it would be captured by the page frame's
     * `container-type` and scroll away — which is exactly what a user reported seeing. `canvasFixedStyle`
     * keeps it in the page and offsets it by the canvas's own scroll, so the editor shows it holding.
     */
    /**
     * …UNLESS AN ANCESTOR CAPTURES IT, in which case the published page will not hold it either and the
     * editor must not pretend otherwise. A tilt, a component or the glass Alert makes its own frame, and
     * a fixed block inside one holds against THAT — which is precisely what the Inspector warns about.
     * Simulating the hold here would have the builder drawing the very behaviour it is telling you will
     * not happen.
     */
    const canvasStyle = capturedAbove ? wrapStyle : canvasFixedStyle(wrapStyle);
    // Marked so the measuring pass below can find every held block and tell it where its holder sits.
    const heldAttr = {
      ...(canvasStyle !== wrapStyle ? { "data-held": "1" } : {}),
      // STACKED PINS (Step 2c) — the SAME marker the export writes, from the same resolver, so the editor
      // stacks the bars the way the published page will. See `pinStackMarker`.
      ...((m) => (m ? { "data-eu-pin": m } : {}))(pinStackMarker(rawNode, parent ?? undefined)),
      // …and WHICH stack it joins (2e): the window for a fixed bar, the box it travels inside for a sticky one.
      ...((g) => (g ? { "data-eu-pin-in": g } : {}))(pinStackGroupMarker(rawNode, parent ?? undefined)),
    };

    // Visible drag-to-resize handles on every edge + corner, so you can resize from any side.
    const resizeHandles = isSolo && editable && !isRoot && !node.locked ? (
      <>
        {HANDLES.map((h) => (
          <div key={h.edge} onMouseDown={(e) => { caretFallthrough(e); startResize(e, node.id, h.edge); }} aria-label={`Resize ${h.label}`} title={h.title} className={`absolute ${h.pos} ${h.cursor} bg-indigo-500 border-2 border-white shadow`} style={{ zIndex: CHROME_Z.handle, pointerEvents: "auto" }} />
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
      // A block picked with the pointer takes the keyboard too (F1-c): a block is not focusable, so a click on it left the
      // focus on the last control used — a device preset — and Z1-j rightly gives that control its own keys, so Delete,
      // the arrows and Enter did nothing to the block just selected.
      const ae = document.activeElement;
      if (ae instanceof HTMLElement && ae !== document.body && !canvasRef.current?.contains(ae)) ae.blur();
      // CLICK SELECTS THE BOX, CLICK AGAIN GOES INSIDE (see `selectionChain`). The handler that runs is the
      // DEEPEST block's — the click stops propagating there — so this walks back UP and takes the outermost
      // block first, stepping one level deeper each time the user clicks inside what is already selected.
      // A ROW BAND is scaffolding the user never created, so it is never itself selectable. With one block in
      // it the click plainly meant that block. With several, the empty part of the line is the space of the box the
      // line sits IN, so the click means that box (#88) — clearing made a stack whose every line holds several blocks
      // (a header: logo | menu | button) impossible to select by clicking in it. Only a line at PAGE level, whose box
      // is the page itself, clears — that space is the canvas.
      const kids = node.children ?? [];
      const bandHost = node.rowBand && kids.length !== 1 ? findParent(rootRef.current, node.id)?.parent : undefined;
      const deepest = node.rowBand
        ? (kids.length === 1 ? kids[0].id : bandHost && bandHost.id !== rootRef.current.id && !bandHost.rowBand ? bandHost.id : undefined)
        : node.id;
      if (!deepest) { select(null); closeMenu(); startMarqueeArm(e); return; }
      /**
       * IT DESCENDS, AND THEN IT STOPS. It used to wrap around to the outermost again.
       *
       * Reported as the selection being unpredictable, and it is: on a parent holding one child, clicking
       * repeatedly gave P → C → P → C forever, so a click was as likely to take you further out as further
       * in and there was no way to tell which without looking. Drilling is only useful if it is
       * one-directional — each click goes one level deeper and the innermost is where it rests.
       *
       * Starting over is what clicking empty canvas is for, and that already clears the selection.
       */
      const chain = selectionChain(rootRef.current, deepest);
      const at = selSet.size === 1 ? chain.indexOf([...selSet][0]) : -1;
      const next = at < 0
        ? (chain[0] ?? deepest)                          // nothing of this chain selected → the outermost
        : chain[Math.min(at + 1, chain.length - 1)];     // one deeper, and no further than the innermost
      select(next);
      closeMenu(); startMarqueeArm(e);
    };

    const isDragging = dragId === node.id;

    // ── container ──
    if (isContainer(node)) {
      const kids = node.children ?? [];
      return (
        <Tag
          key={node.id}
          data-box-id={node.id}
          {...semProps}
          {...heldAttr}
          // The SAME marker the exported page carries, carrying the same number — see `masonryMeasureAttr`.
          data-eu-masonry={masonryMeasureAttr(node) ?? undefined}
          id={node.anchor || undefined}
          onMouseDown={onSelectDown}
          // AN EMPTY BOX GETS A COURTESY HEIGHT, NOT A FLOOR IT CANNOT LEAVE. Nothing is inside to give it
          // height, so an unsized empty box would collapse to 0px — invisible, unclickable, impossible to drop
          // into. It gets the same 8rem the exporter gives an empty painted box (`decorCss`).
          //
          // It is applied AFTER `wrapStyle` on purpose: `childStyle` deliberately writes `min-height: 0` onto
          // an empty box so it CAN be shrunk to nothing, and that would otherwise cancel this outright.
          //
          // Three things switch it off, and between them they are the whole rule — a size the user set always
          // wins over a size the editor offered:
          //   • an explicit `minHeight` or `height` on this box — you sized it, you get it;
          //   • `sizedAbove` — you sized an ANCESTOR, so empty descendants must not hold it open;
          //   • anything inside it, at which point the content sets the height, which is the real answer.
          style={{
            ...containerStyle(node, breakpoint, section),
            ...pageBandInset(node, parent?.id === root.id), // S2-f — the export writes the same
            // `relative` so the out-of-flow hint is measured against THIS box and not some ancestor. Only
            // when the box is empty, so it can never become a containing block for a child that floats.
            ...(editable && kids.length === 0 ? { position: "relative" as const } : {}),
            ...canvasStyle,
            ...pagePinCover(node, parent?.id === root.id), // F1-b — after the band's own style, as the export does
            // NOT the page root and NOT a row band. Both are invisible scaffolding rather than boxes anyone
            // added: the root carries the PAGE's own minimum height (roughly a viewport) and an 8rem courtesy
            // band would overrule it, collapsing an empty page to a strip.
            //   • `screenHeight` — you asked for half or a whole screen, and that IS a height you set.
            //     It was missing from this list, so "Screen height → Full screen" was STORED AND IGNORED on
            //     an empty box: measured at 128px with `screenHeight: "full"` on the node, and 900px the
            //     moment one line of text went in. Empty is precisely when a person sets it — you lay the
            //     band out, then fill it — so the control did nothing at the only time it was reached for.
            //     `childStyle` already guarded for this (`!child.screenHeight`); the canvas did not.
            ...(editable && kids.length === 0 && !isRoot && !node.rowBand && !sizedAbove
              && node.minHeight == null && node.height == null && !node.screenHeight
              ? { minHeight: "8rem" }
              : {}),
            ...(isDragging ? { opacity: 0.4 } : {}),
          }}
          // Structural boxes (a row BAND, the page ROOT) are invisible scaffolding — never selectable — so they must
          // NOT show a hover outline: an indigo box around a full-width band/page reads as an empty "container wrapper".
          // Real, user-added containers (sections) still highlight on hover as drop targets.
          // `bandClasses` is the SAME function the export calls, so a contained band is contained here too —
          // canvas = export for layout, not only for styling. Only a band directly under the page root is a
          // SECTION: normalizeRowBands also makes bands inside every component, and they are not sections.
          className={`${bandClasses(node, parent === root)} ${editable ? "transition-shadow" : ""} ${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : (editable && !node.rowBand && !isRoot) ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
        >
          {/* SHOW ONE AT A TIME — the same two elements the export writes, for the same reason: the
              navigation has to sit OUTSIDE the scroll container or it scrolls away with the pages. The
              strip's declarations come from `pagerStripCss`, which the export calls too, and the nav
              markup from `pagerNavHTML` — one emitter each, so the builder cannot drift from the page.
              The strip really scrolls here, so the pages are edited exactly where a visitor meets them. */}
          {isPager(node) ? (
            <>
              <div
                data-eu-pager
                data-pager-strip={node.id}
                tabIndex={0}
                role="group"
                aria-roledescription="carousel"
                aria-label="One at a time"
                style={pagerStripCss()}
              >
                {kids.map((c) => (
                  <Fragment key={c.id}>{renderNode(c, node, sizedAbove || node.minHeight != null || node.height != null, hostSizedFor(node, hostSized, parent), capturedAbove || capturesFixed(node))}</Fragment>
                ))}
              </div>
              {/* The nav is the published markup, shown as published — but a dot is an `<a href="#…">`, and
                  following one in the EDITOR would scroll the whole builder. So the click is caught here
                  and turned into the same strip scroll the page's own script performs. */}
              {(() => {
                const html = pagerNavHTML(node);
                if (!html) return null;
                return (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      const a = (e.target as HTMLElement).closest("a[data-eu-pager-dot]");
                      e.preventDefault();
                      if (!a) return;
                      const i = Number(a.getAttribute("data-eu-pager-dot"));
                      const strip = e.currentTarget.parentElement?.querySelector<HTMLElement>(`[data-pager-strip="${CSS.escape(node.id)}"]`);
                      const slide = strip?.children[i] as HTMLElement | undefined;
                      if (strip && slide) strip.scrollTo({ left: slide.offsetLeft - strip.offsetLeft, behavior: "smooth" });
                    }}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              })()}
            </>
          ) : kids.map((c) => (
            <Fragment key={c.id}>{renderNode(c, node, sizedAbove || node.minHeight != null || node.height != null, hostSizedFor(node, hostSized, parent), capturedAbove || capturesFixed(node))}</Fragment>
          ))}
          {editable && kids.length === 0 && (
            // An empty block shows a non-interactive hint — drag a block from the palette (or use the ⋯ menu)
            // to fill it. It's a hint only; it does NOT add anything by itself.
            //
            // IT FILLS THE BOX (`flex-1`), and that is not cosmetic. It used to be a fixed-height band at the
            // top, so its dashed outline stopped well short of the cell's real bottom edge — and that line is
            // what a person reads as "the cell ends here". A grid whose rows were correctly sharing the height
            // looked like a grid of short cells floating in dead space, and the layout got blamed for a hint.
            // Now the dashes ARE the box, so what you see is the cell you have.
            // `border-radius: inherit`, NOT a radius of its own. A hard `rounded-xl` here put visibly rounded
            // corners inside every empty cell, which reads as the CELL being rounded — a radius nobody set and
            // no control could explain. Inheriting means the hint matches whatever box it stands in: square in
            // a square cell, and rounded exactly as much as a cell the user has actually rounded.
            // OUT OF FLOW (`absolute inset-0`), and that is the whole point. In flow it was a real child with
            // real padding, an icon and a line of text, so it MEASURED about 90px — and that became the
            // smallest an empty box could be. Dragging the height down wrote 8px into the tree and the box
            // went on rendering 90px: the editor showed a size the user had not chosen and could not remove,
            // for a hint that is not even part of the page. Absolutely positioned it contributes nothing to
            // its parent's height, so an empty box is exactly the height it was given, and `overflow-hidden`
            // lets the hint clip away quietly when that height is smaller than the words.
            // CENTRED, WITH ROOM AT THE SIDES. A narrowed stack (224px, its reflow floor) held the whole sentence
            // on one 221px line flush against the dashes, so "Empty" lost its E under the border and the resize
            // handle; narrower still it wrapped left-aligned. Found by the RULE Q sweep, 2026-09-26.
            <div data-ph className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 overflow-hidden text-center text-gray-400 dark:text-gray-500 border border-dashed border-gray-300/80 dark:border-white/15 pointer-events-none" style={{ fontSize: u(11), paddingInline: u(12), borderRadius: "inherit" }}>
              {/* A REAL BUTTON, because the line under it says "click to add" and nothing did.
                  The pill was a `<span>` inside a `pointer-events-none` hint, so an empty box contained
                  exactly zero buttons: measured three clicks on one, no menu, no child, nothing but the box
                  selecting itself. A control that says what it does and does not do it is the defect this
                  project keeps meeting — and putting a block INSIDE another is now a deliberate act rather
                  than a side effect of the palette, so the empty box is exactly where someone looks for it.
                  `pointer-events-auto` because the hint around it deliberately has none: clicking the BOX
                  still just selects it, and only the pill adds. */}
              <button
                type="button"
                // A DISTINCT NAME from the inspector's "Add a block inside" button. They do different things —
                // this one opens a menu to choose from, that one adds straight away — and giving two
                // controls the same accessible name leaves a screen-reader user with one name for two
                // behaviours. It also made a test click the wrong one, which is how it was noticed.
                aria-label="Choose a block to add inside"
                title="Add a block inside"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setAddInside({ id: node.id, anchor: { top: r.top, bottom: r.bottom, left: r.left, right: r.right } });
                }}
                className="pointer-events-auto flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-brand/15 hover:text-brand transition-colors"
                style={{ width: u(22), height: u(22) }}
              ><Plus className="w-3.5 h-3.5" /></button>
              Empty — drag a block in, or click to add
            </div>
          )}
          {/* THE LEFTOVER COLUMNS OF A ROW, offered as a place to put something.
              Widen one cell and its neighbours wrap, which leaves real empty space at the end of the last row
              — space a user can see and point at, and could do nothing with. This fills it with a ghost cell
              spanning exactly what is free: click it and a block lands there, already the right width. It is
              EDITOR-ONLY (never in the tree, never exported) and it disappears the moment the row is full.
              INVISIBLE UNTIL ASKED FOR: it fades in on hover or while this row is selected, and is otherwise
              not there. Empty space in a layout is a legitimate design choice — a permanent dashed box in it
              reads as an error to be fixed, and nags a user into filling a gap they meant to leave. */}
          {editable && node.layout === "grid" && kids.length > 0 && (() => {
            const free = gridLeftoverAt(node, breakpoint); // counted row by row — a cell that wraps leaves its hole behind it
            if (!free) return null;
            return (
              <button
                data-ph
                data-gridghost
                // Shown while this row is the one being worked on — the row itself selected, or any block
                // inside it. Hover alone would mean the only way to find the empty space is to sweep the
                // pointer over it, and a keyboard user would never see it at all.
                data-armed={isSel || [...selSet].some((sid) => isAncestor(node, node.id, sid)) ? "" : undefined}
                onMouseDown={(e) => e.stopPropagation()}
                // Spanning exactly the columns that were empty, so the block lands filling the gap it was
                // offered — not the width of whatever happened to be added last.
                onClick={(e) => { e.stopPropagation(); addChild(node.id, "container", { colSpan: free, width: "100%", padding: 0 }); }}
                aria-label={`Add a block in the empty ${free} column${free === 1 ? "" : "s"}`}
                style={{ gridColumn: `span ${free}`, fontSize: u(11), opacity: 0, borderRadius: "inherit" }}
                className="flex flex-col items-center justify-center gap-1.5 py-6 text-gray-400 dark:text-gray-500 border border-dashed border-gray-300/80 dark:border-white/15 hover:border-brand hover:text-brand"
              >
                <span className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5" style={{ width: u(22), height: u(22) }}><Plus className="w-3.5 h-3.5" /></span>
                Add a block here
              </button>
            );
          })()}
          {isSolo && <ChromeMirror blockId={node.id}><NodeToolbar node={node} isRoot={isRoot} />{resizeHandles}</ChromeMirror>}
        </Tag>
      );
    }

    // ── element ──
    return (
      <Tag
        key={node.id}
        data-box-id={node.id}
        {...semProps}
        {...heldAttr}
        id={node.anchor || undefined}
        onMouseDown={onSelectDown}
        // Elements (non-containers) apply their own minHeight/height here (containers get it from containerStyle),
        // so dragging the TOP/BOTTOM edge actually resizes a heading / text / button / list. When a Content
        // position is set, the wrapper becomes a flex box so the content re-positions as the block grows.
        // RULE O: for a COMPONENT/BUTTON the stored height is a floor (see componentBoxCss) — the box grows if
        // its content later needs more room, instead of the content spilling out below it.
        style={{ ...canvasStyle,
          // A self-painting block is a COLUMN FLEX whose stored height is a FLOOR: the box grows if its content
          // needs more room (never a spill), while its `.eu-root` stretches to fill it (never an empty gap).
          ...(selfPaint ? { display: "flex", flexDirection: "column" } : {}),
          // With no height of its own the block keeps what `childStyle` decided — as the export does. Writing
          // `undefined` here threw that away, so the two engines disagreed on seven kinds of block (#143).
          minHeight: selfPaint && node.height ? sizeToCSS(node.height) : (node.minHeight != null ? remLen(node.minHeight) : (canvasStyle as React.CSSProperties).minHeight),
          height: !selfPaint && node.height ? sizeToCSS(node.height) : (wrapStyle as React.CSSProperties).height,
          // Content position → the wrapper flexes so the content re-positions as the block grows. A BUTTON fills its
          // box itself and positions its own label, so it opts out here (otherwise the two would fight).
          ...((node.contentX || node.contentY) && node.type !== "button" ? { display: "flex", flexDirection: "column", justifyContent: flexPos(node.contentY), alignItems: flexPos(node.contentX) } : {}),
          ...(isDragging ? { opacity: 0.4 } : {}) }}
        className={`${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : editable ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
      >
        <ElementView node={node} headingLevel={semR?.level} theme={theme} editable={editable} selected={isSel} breakpoint={breakpoint} onText={(v) => onChange(updateBox(root, node.id, { text: v }))} onSrc={(v) => onChange(updateBox(root, node.id, { src: v }))} onPatchNode={(patch) => onChange(updateBox(root, node.id, patch))} itemSel={itemSel} setItemSel={setItemSel} />
        {isSolo && <ChromeMirror blockId={node.id}><NodeToolbar node={node} isRoot={isRoot} />{resizeHandles}</ChromeMirror>}
      </Tag>
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
    // The toolbar sits ABOVE the box (outside it) so it NEVER covers the content — important now that blocks hug
    // their content and can be small. When the box is near the canvas top (no room above), it flips to BELOW.
    //
    // THIS COMPONENT HOLDS NO HOOKS, deliberately. It is declared inside `BoxCanvas`, so React remounts it on
    // every render — and an effect re-runs on mount whatever its dependency array says, which is how the
    // `[node.id]` guard that once "fixed" the Maximum-update-depth crash here came to be unreachable. The
    // measurement now lives in `BoxCanvas` itself (`toolbarBelow`), where it runs once per selection, and
    // this component is left as a pure render: remounting it is wasteful, and nothing worse.
    const below = toolbarBelow;
    // A group of controls needs to say so: without a role and a name a screen-reader user meets a run of
    // loose buttons with no indication they belong to the block that was just selected. The item CRUD bar
    // next door already got this right — this one had nothing.
    return (
      <div role="toolbar" aria-label="Block toolbar" style={{ zIndex: CHROME_Z.toolbar, pointerEvents: "auto" }} className={`absolute left-0 w-max max-w-none ${below ? "top-full mt-1" : "bottom-full mb-1"} flex items-center gap-0.5 rounded-xl bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-sm px-1 py-1 shadow-lg ring-1 ring-white/10`} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
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
        {/* ADD INSIDE, ON EVERY CONTAINER — not only an empty one.
            The + in the middle of an empty box only exists while the box IS empty: the moment anything goes
            in, the hint and its button are gone and putting a second thing inside has no on-canvas route at
            all. You had to know the inspector. Since a palette click now adds a SIBLING, nesting is a
            deliberate act and it needs a control that does not disappear the first time you use it.
            Same menu as the empty box's +, so there is one answer to "what can go in here". */}
        {!isRoot && isContainer(node) && !node.locked && (
          <button
            onClick={(e) => {
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setAddInside({ id: node.id, anchor: { top: r.top, bottom: r.bottom, left: r.left, right: r.right } });
            }}
            aria-label="Add a block inside this one"
            title="Add a block inside"
            className="p-1 rounded text-white/90 hover:bg-white/15"
          ><Plus className="w-3.5 h-3.5" /></button>
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
              {ADD_ITEMS.map(({ type, label, Icon }) => <Item key={type} onClick={() => menuAnchor && addInsideOf(node.id, type, menuAnchor)} Icon={Icon} label={label} />)}
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
              <Item onClick={() => { onChange(deleteBox(root, node.id)); select(null); }} Icon={Trash2} label="Delete" danger hint="Del" />
            </>)}
          </PortalMenu>
        )}
      </div>
    );
  }

  return (
    <div ref={canvasRef} onMouseDown={(e) => { if (editable) { select(null); startMarqueeArm(e); } }} onDragOver={onCanvasDragOver} onDrop={onCanvasDrop} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropRect(null); }} className="w-full eu-tokens"
      // THE PAGE MEASURE COMES FROM THE DEVICE CHIP, NOT FROM THE EDITOR'S WINDOW.
      //
      // `layoutCss` publishes `--eu-measure` per rung through MEDIA queries, and a media query reads the
      // browser window — which in the editor is the whole screen, not the frame the page is being previewed
      // in. So on a wide monitor, picking Desktop (1280) drew every CONTAINED band at the WIDE rung's 76rem
      // cap: the column came out 1184px where a real visitor at 1280 gets 1088. The class names were all
      // correct and the export was right; only the editor was wrong, which is the worse direction.
      //
      // Setting it here fixes it for the frame in one place: an inline style beats the stylesheet at any
      // width, and it is the rung the user actually chose. The phone rung has no cap, so it is left unset and
      // the `var(--eu-measure, 100%)` fallback keeps the page gutter, exactly as the media queries do.
      /**
       * `relative` so the editor's drop room below the page can be positioned against this box without
       * adding to its height — see the strip at the end of this element.
       */
      style={{
        ...(editable ? { position: "relative" as const } : {}),
        ...(RUNG_MEASURE[breakpoint === "base" ? "desktop" : breakpoint]
          ? ({ ["--eu-measure" as string]: RUNG_MEASURE[breakpoint === "base" ? "desktop" : breakpoint] } as CSSProperties)
          : {}),
      }}
    >
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
      <style dangerouslySetInnerHTML={{ __html: layoutCss(".eu-root, .eu-tokens") + "[data-sem-list]{list-style:none;margin:0;padding-left:0}" + measureCss(".eu-tokens") }} />
      {/* REDUCED MOTION, FOR THE CANVAS. The published page gets this from `BASE_CSS` via `.eu-root`; the
          builder's canvas carries `.eu-tokens` instead, so the rule is repeated here rather than added to
          that sheet — it ships to every published page, where `.eu-tokens` can never match, and a guard
          (`educo-base.test.ts`) fails on any class in it that no renderer emits.
          It matters for the pager: `scroll-behavior: smooth` is NOT switched off by reduced motion on its
          own — measured, the computed value stays `smooth` — so without this a reader who asked for less
          motion would get gliding pages in the editor and instant ones on their site. */}
      <style dangerouslySetInnerHTML={{ __html: "@media (prefers-reduced-motion: reduce){.eu-tokens *,.eu-tokens *::before,.eu-tokens *::after{animation-duration:.01ms !important;transition-duration:.01ms !important;scroll-behavior:auto !important}}" }} />
      {/* The empty-columns "Add a block here" target, hidden until asked for.
          Written as a real rule rather than a Tailwind named-group variant: `group-hover/name:` did not make it
          into the compiled sheet, so the class was on the element and did nothing — the ghost simply sat there
          permanently, which is the opposite of the behaviour. Editor chrome only; the export never sees it. */}
      <style dangerouslySetInnerHTML={{ __html:
        // Hidden means HIDDEN: no pointer events either. An invisible button still takes clicks and drops, so
        // while faded out this one sat over a row's empty columns and quietly swallowed anything aimed at the
        // grid underneath — which looks exactly like "I can't add a block here".
        "[data-gridghost]{transition:opacity .15s ease;pointer-events:none}" +
        "[data-box-id]:hover>[data-gridghost],[data-gridghost]:focus-visible,[data-gridghost][data-armed]{pointer-events:auto}" +
        // `!important` because the button carries an INLINE opacity:0 — which it needs, or it shows for a frame
        // on load, before this stylesheet is mounted. An inline style beats any selector at any specificity, so
        // the reveal has to out-rank it; the same reason the contained-band padding is marked.
        "[data-box-id]:hover>[data-gridghost],[data-gridghost]:focus-visible,[data-gridghost][data-armed]{opacity:1 !important}" +
        "@media (prefers-reduced-motion:reduce){[data-gridghost]{transition:none}}" +
        // WHILE SOMETHING IS BEING DRAGGED IN, THE SELECTION'S OWN CHROME LETS THE POINTER THROUGH (see `data-box-drag-in`).
        "body[data-box-drag-in] [data-chrome-mirror] *{pointer-events:none !important}" +
        // …AND SO DO THE EDITOR'S HINTS INSIDE A BOX (L-1 · L1-7). An empty box's "+" and a grid's ghost cells take the
        // pointer, and under a pointer held still at the moment of release they came and went (measured on tier-99 page
        // 337: `dragenter <button>`, `dragleave <div>`, `dragleave <button>`, and no `dragover` after) — the browser then had
        // no accepted target and cancelled the drop: the marker showed, nothing was added, 3 runs of 4. Where a drop lands
        // is worked out from the canvas coordinates (`computeDrop`), so the hints need not be hit at all while one is carried.
        "body[data-box-drag-in] [data-ph] *,body[data-box-drag-in] [data-gridghost],body[data-box-drag-in] [data-gridghost] *{pointer-events:none !important}" }} />
      {/* Hover & focus (Interactions 1a). One stylesheet for the whole tree, scoped per block by its
          `data-box-id`, because a hover cannot be expressed as an inline style. The rules come from the SAME
          emitter the export uses, so what you hover in the builder is what a visitor gets. */}
      {(() => {
        const scopeFor = (id: string) => `[data-box-id="${id}"]`;
        // A COMPONENT staggers its ITEMS, not its wrapper's direct children — those are a <style> tag and the
        // component itself. Same map the export uses, so the builder staggers what the published page does.
        const staggerFor = (n: { component?: string }) => (n.component ? COMPONENT_ITEM_SEL[n.component] : undefined);
        // The SEE-THROUGH paint layer for any box fading a background IMAGE — a `::before` cannot be an
        // inline style, so it rides in this same stylesheet, from the same emitter the export uses.
        const css = TYPE_UNIT_PROPERTY_CSS // `--box-t` registered as a length, so it resolves at the page root (#133)
          + treeHoverCss(root, scopeFor)
          + treeRevealCss(root, scopeFor, staggerFor)
          + treeItemEffectsCss(root)
          // The pinned block’s ARRIVAL, from the same resolver the export uses.
          + treePinArrivalCss(root, scopeFor)
          + treePaintLayerCss(root, scopeFor)
          // A grid narrowing by ITS OWN box (#111), from the emitter the export uses. The canvas draws a rung by its
          // preset, not by a media query, so "above the phone" is decided here: the two-across rule is left out
          // entirely at the phone preset and unguarded at every other.
          + treeGridQueryCss(root, scopeFor, (css) => (breakpoint === "phone" ? "" : css), (grid) => `${grid}>[data-gridghost]{display:none !important}`);
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
      {/**
        * ROOM BENEATH THE PAGE, FOR THE EDITOR ONLY — and OUT OF FLOW, which is the whole point.
        *
        * The page is exactly as tall as what is on it, deliberately, and that is right for the published
        * page. In the editor it left nowhere to aim: below the last band there was no canvas at all, so a
        * drop there never reached a handler. Nothing happened — which reads as the builder being broken
        * rather than as a missing target.
        *
        * This was first tried as `padding-bottom` on the canvas, and that was worse than the problem. The
        * white sheet a user reads as "the page" is the canvas's PARENT, so padding on the canvas stretched
        * the sheet: the page root measured 160px while the sheet drew 256px. The builder was showing a page
        * 96px taller than the page, which is canvas ≠ export in the direction where the editor flatters.
        *
        * Absolutely positioned against the canvas, it adds nothing to any height — the sheet ends where the
        * page ends — while still being a real element under the pointer whose events bubble to the canvas's
        * own drop handler. A drop there finds no block, which is exactly the fallback that appends a band.
        */}
      {editable && (
        <div
          data-drop-below-page
          aria-hidden="true"
          style={{ position: "absolute", top: "100%", left: 0, right: 0, height: "6rem" }}
        />
      )}
      {/* What the empty box's own + opens: the same list the actions menu offers under "Add inside", so
          there is one answer to "what can go in here" rather than two that can drift apart. */}
      {addInside && (
        <PortalMenu anchor={addInside.anchor} onClose={() => setAddInside(null)} ariaLabel="Add a block inside" width={200}>
          <MenuHeader>Add inside</MenuHeader>
          {ADD_ITEMS.map(({ type, label, Icon }) => (
            <MenuItem
              key={type}
              onClick={() => { addInsideOf(addInside.id, type, addInside.anchor); setAddInside(null); }}
              Icon={Icon}
              label={label}
            />
          ))}
        </PortalMenu>
      )}
      {dropRect && createPortal(
        <div
          aria-hidden="true"
          style={{ position: "fixed", left: dropRect.left, top: dropRect.top, width: dropRect.width, height: dropRect.height, pointerEvents: "none", zIndex: CHROME_Z.dropZone }}
          className={dropRect.inside ? "rounded-lg outline outline-2 outline-dashed outline-indigo-500 bg-indigo-500/10" : "rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.9)]"}
        />,
        document.body,
      )}
      {/* The photo setup, opened where a Photo gallery / Slider / Hero tile was DROPPED — the same
          component the palette tile opens, in the same shape, because a drop and a click are the same
          instruction. `PHOTO_SETUP` is the one list that says which tiles ask this question. */}
      {pendingGallery && (
        <GallerySetupMenu
          anchor={pendingGallery.anchor}
          mode={PHOTO_SETUP[pendingGallery.kind]}
          onClose={() => setPendingGallery(null)}
          onPick={(photos, opts) => insertAt(nodeForPhotos(pendingGallery.kind, photos, opts), pendingGallery.parentId, pendingGallery.index, pendingGallery.moveWidth)}
        />
      )}
      {pendingGrid && (
        <GridLayoutMenu
          anchor={pendingGrid.anchor}
          onClose={() => setPendingGrid(null)}
          onPick={(patch) => {
            const grid = blockForKind("grid", patch);
            insertAt(grid, pendingGrid.parentId, pendingGrid.index, pendingGrid.moveWidth);
            // Added from an "Add inside" menu: hand it the selection, for the same reason every other add
            // does — a fresh grid of empty cells is transparent, and nothing else would say it had landed.
            if (pendingGrid.selectAfter) select(grid.id);
          }}
        />
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
      {svg ? <span className="eu-alert__icon" aria-hidden="true" style={{ ...inlineToStyle(alertIconInline(item)), pointerEvents: "none" }} dangerouslySetInnerHTML={{ __html: svg }} /> : null}
      <div className="eu-alert__content">
        {(item.title || editable) && (
          <div className="eu-alert__title" style={inlineToStyle(alertPartInline(item.headerStyle))}>
            <EditableText value={item.title} editable={editable} onChange={(v) => set({ title: v })} placeholder="Title" />
          </div>
        )}
        {(item.body || editable) && (
          <div className="eu-alert__body" style={inlineToStyle(alertPartInline(item.bodyStyle))}>
            {editable
              ? <EditableText as="p" value={item.body} editable onChange={(v) => set({ body: v })} placeholder="Message — click to edit" />
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
    const host = hostRef.current;
    // One rem in SCREEN px — the pointer and the host rect are screen px when the canvas is shrunk to fit (`zoomOf`).
    const remPx = (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) * zoomOf(host);
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
    const hasFloat = breakpoint !== "phone" && (node.items ?? []).some((it) => it.float);
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
  if (node.fontSize) typo.fontSize = textLen(node.fontSize);
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
    const floatsActive = breakpoint !== "phone";
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
                {it.icon && iconSvg(it.icon) ? <span className="eu-accordion__icon" aria-hidden="true" style={{ pointerEvents: "none" }} dangerouslySetInnerHTML={{ __html: iconSvg(it.icon) }} /> : null}
                {/* A plain <img>, as above: a user upload, matched to what the export emits. */}
                {it.media ? <img className="eu-accordion__media" src={it.media} alt={it.mediaAlt ?? ""} loading="lazy" decoding="async" /> : null}
                <span className="eu-accordion__title"><EditableText value={it.title} editable={editable} onChange={(v) => setItem(it.id, { title: v })} placeholder="Question" /></span>
                {it.meta ? <span className="eu-accordion__meta">{it.meta}</span> : null}
              </summary>
              <div className="eu-accordion__body">
                {/* a <p>, as the export writes it (`richBody`): the reading-width cap and the paragraph spacing reach it on the
                    canvas too — as an editable <span> the answer ran 539px on one line where the page wrapped it at 512 (L-2, e-8) */}
                {editable
                  ? <EditableText as="p" value={it.body} editable onChange={(v) => setItem(it.id, { body: v })} placeholder="Answer — click to edit" />
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
                            ? <EditableText as="p" value={c.body} editable onChange={(v) => setChild(it.id, c.id, { body: v })} placeholder="Answer" />
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
    const alertFloatsActive = breakpoint !== "phone";
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

function ElementView({ node, headingLevel, theme, editable, selected, onText, onSrc, onPatchNode, breakpoint = "base", itemSel, setItemSel }: {
  node: BoxNode; headingLevel?: number; theme: SiteTheme; editable?: boolean; selected?: boolean; onText: (v: string) => void; onSrc: (v: string) => void; onPatchNode?: (patch: Partial<BoxNode>) => void; breakpoint?: Breakpoint;
  itemSel?: { boxId: string; id: string; parentId?: string } | null;
  setItemSel?: (v: { boxId: string; id: string; parentId?: string } | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  // Emitted only when this block sets one: a hard-coded "left" is an explicit value, and an explicit value on
  // the child beats the alignment its container was told to have.
  const align = node.textAlign;
  switch (node.type) {
    case "component": return <ComponentView node={node} editable={editable} onPatchNode={onPatchNode} breakpoint={breakpoint} itemSel={itemSel} setItemSel={setItemSel} />;
    case "heading": {
      // The LEVEL the page gives it (lib/semantics.ts) — the size is separate and unchanged.
      const H = `h${headingLevel ?? 2}` as "h2";
      return <H style={{ color: node.color || typoRole.color("text"), fontSize: node.fontSize != null ? textLen(node.fontSize) : typoRole.size(2), textAlign: align, width: "100%", ...typoStyle(node, "heading", 600) }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Heading" /></H>;
    }
    // A LINK — words that go somewhere, the same <a> the page publishes. A click in the editor edits it, never follows it.
    case "link":
      return <a href={node.href || "#"} target={node.newTab ? "_blank" : undefined} rel={node.newTab ? "noopener noreferrer" : undefined} onClick={(e) => editable && e.preventDefault()}
        style={{ color: node.color || LINK_COLOR_CSS, fontSize: node.fontSize != null ? textLen(node.fontSize) : typoRole.size(1), textAlign: align, textUnderlineOffset: "0.15em", ...typoStyle(node, "body", 500), textDecoration: node.underline ? "underline" : "none" }}>
        <EditableText value={node.text} editable={editable} onChange={onText} placeholder="Link" /></a>;
    case "button": {
      // The button FILLS its box and paints its OWN visual (bg + radius + border/shadow), so resizing the box grows
      // the button itself (one shape — no duplicate wrapper behind it) and the label re-positions inside it. Content
      // position (or centre by default) decides where the label sits; a resized button therefore centres its text.
      const deco = decorStyle(node);
      return <a href={node.href || "#"} target={node.newTab ? "_blank" : undefined} rel={node.newTab ? "noopener noreferrer" : undefined} onClick={(e) => editable && e.preventDefault()}
        style={{ display: "flex", width: "100%", height: "100%", boxSizing: "border-box", gap: u(8),
          alignItems: flexPos(node.contentY ?? "center"), justifyContent: flexPos(node.contentX ?? "center"),
          background: node.background ? colorToCSS(node.background) : colorToCSS(theme.primary), color: node.color || "var(--eu-color-on-brand)",
          fontSize: node.fontSize != null ? textLen(node.fontSize) : typoRole.size(0.875), padding: `${u(12)} ${u(24)}`, textDecoration: "none",
          ...deco, borderRadius: deco.borderRadius ?? PILL, ...typoStyle(node, "body", 600) }}>
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
          {/* `rounded={false}`, and it is not a style choice — it is the corner-radius rule.
              `ImageBox` defaults to rounding by `theme.radius * 1.25`, which wrote **20px inline onto
              every photograph in the builder** while the node carried no radius at all and no control
              could explain or remove it. Worse, the EXPORT emits the node's radius through `radiusCSS`
              like everything else, so it published square corners: measured at canvas 20px vs export 0px
              — canvas ≠ export, in the direction where the editor lies to you. A picture's corners are
              the block's corners, set in Outline & effects and emitted by the one resolver both
              renderers call. */}
          <ImageBox theme={theme} rounded={false} src={node.src} alt={node.alt ?? ""} width={node.imgW} height={node.imgH} />
          {editable && (<>
            {/* THE BUTTON BELONGS TO THE PICTURE YOU ARE WORKING ON — or to one with nothing in it yet,
                where it is the only way in. It used to render on EVERY image at once, so a gallery of
                twelve photographs came with twelve dark pills sitting permanently on top of them: the
                thing being designed covered by the tool for changing it. The toolbar and the resize
                handles already behave this way; this did not.
                The input itself stays mounted either way — it is what "Replace" opens. */}
            {(selected || !node.src) && (
            <button onClick={() => fileRef.current?.click()} className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-900/80 text-white shadow-lg hover:bg-gray-900"><Upload className="w-3.5 h-3.5" /> {node.src ? "Replace" : "Upload"}</button>
            )}
            {/* The natural size is measured BEFORE the patch, so the picture and its shape land in one undo
                step — and so replacing a photo can never leave the previous one's dimensions behind. */}
            {/* DOWNSCALED ON THE WAY IN (`importPhoto`), not stored as the camera produced it. A saved site
                lives in about 5MB of browser storage and one 3000×2000 photograph is 1,260 KB as a data
                URL — measured — so the fifth upload used to throw and the save silently stopped working.
                The picture and its measured shape still land in ONE undo step. */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Upload image"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                const { src, imgW, imgH } = await importPhoto(f);
                if (!src) return;
                if (onPatchNode) onPatchNode({ src, imgW, imgH }); else onSrc(src);
              }} />
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
      // The SVG is NEVER a pointer target (E0-g): React re-set its markup while a drag passed over it, so a block released
      // on the icon was dropped onto a `<path>` no longer in the page — the drop never reached the canvas, the marker
      // stayed, nothing was added (4 of 4). The pointer lands on this block's own box instead, which stays put.
      const svg = iconSvg(node.icon ?? "Star");
      const size = u(node.fontSize ?? 32);
      return (
        <div style={{ textAlign: align, color: node.color ? colorToCSS(node.color) : theme.primary, width: "100%", lineHeight: 0 }}>
          {svg
            ? <span aria-hidden="true" style={{ display: "inline-flex", fontSize: size, width: "1em", height: "1em", pointerEvents: "none" }} dangerouslySetInnerHTML={{ __html: svg }} />
            : <Star style={{ width: size, height: size, display: "inline-block" }} />}
        </div>
      );
    }
    case "divider":
      // R-23: MDN's <hr> (a separator), the export's twin; longhands only, because React warns on shorthand + longhand
      return <hr style={{ borderRightStyle: "none", borderBottomStyle: "none", borderLeftStyle: "none", margin: 0, height: 0, width: "100%", borderTopWidth: dividerThickness(node),borderTopStyle: node.borderStyle ?? "solid", borderTopColor: node.color ? colorToCSS(node.color) : node.borderColor ? colorToCSS(node.borderColor) : typoRole.color("muted") }} />;
    case "spacer":
      return <div aria-hidden="true" style={{ width: "100%", height: sizeToCSS(node.height) ?? "3rem" }} />;
    case "list": {
      const items = node.listItems ?? [];
      const numbered = node.listStyle === "number";
      const style: React.CSSProperties = { color: node.color || typoRole.color("text"), fontSize: node.fontSize != null ? textLen(node.fontSize) : typoRole.size(1), textAlign: align, width: "100%", paddingLeft: u(22), listStyleType: numbered ? "decimal" : "disc", ...typoStyle(node, "body", 400) };
      return numbered
        ? <ol style={style}>{items.map((it, i) => <li key={i} style={{ marginBottom: u(LIST_ITEM_GAP) }}>{it}</li>)}</ol>
        : <ul style={style}>{items.map((it, i) => <li key={i} style={{ marginBottom: u(LIST_ITEM_GAP) }}>{it}</li>)}</ul>;
    }
    case "embed":
      return node.html
        ? <div className="w-full" style={{ height: sizeToCSS(node.height) ?? 260, pointerEvents: editable ? "none" : "auto" }} dangerouslySetInnerHTML={{ __html: node.html }} />
        : <div className="w-full flex items-center justify-center gap-1.5 text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg" style={{ height: sizeToCSS(node.height) ?? 120, fontSize: u(12) }}><Code2 className="w-4 h-4" /> Paste HTML / embed code in the inspector</div>;
    default:
      return <p style={{ color: node.color || typoRole.color("muted"), fontSize: node.fontSize != null ? textLen(node.fontSize) : typoRole.size(1), textAlign: align, width: "100%", ...typoStyle(node, "body", 400) }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Add text" /></p>;
  }
}
