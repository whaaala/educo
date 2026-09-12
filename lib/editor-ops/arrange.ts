/**
 * arrange — pure, platform-agnostic object-arrangement operations.
 *
 * These are the BEHAVIOURS behind every editor's "Arrange" menu (order, align, distribute,
 * centre, rotate, flip). They take a list of positioned items + the selected ids and return a
 * NEW list — no DOM, no React, no editor coupling. So the slide editor, the whiteboard, the
 * work-document, the mobile app, and any future canvas editor share ONE implementation.
 *
 * Items are positioned in a 0–100 percent space by default (the slide model); callers with a
 * different coordinate space pass their own `page` bounds.
 */

export interface ArrangeItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

export type AlignEdge = "left" | "center" | "right" | "top" | "middle" | "bottom";
export type Axis = "h" | "v";
export type OrderMode = "front" | "back" | "forward" | "backward";

export interface PageBox {
  w: number;
  h: number;
}
const DEFAULT_PAGE: PageBox = { w: 100, h: 100 };

// ── helpers ───────────────────────────────────────────────────────────────
const idSet = (ids: Iterable<string>) => new Set(ids);

/** Replace only the items whose id changed; keep array order stable. */
function patch<T extends ArrangeItem>(items: T[], changes: Map<string, Partial<T>>): T[] {
  if (changes.size === 0) return items;
  return items.map((it) => (changes.has(it.id) ? { ...it, ...changes.get(it.id) } : it));
}

/** Union bounding box of the given items (in item coordinate space). */
function unionBounds<T extends ArrangeItem>(items: T[]) {
  const minX = Math.min(...items.map((i) => i.x));
  const minY = Math.min(...items.map((i) => i.y));
  const maxX = Math.max(...items.map((i) => i.x + i.width));
  const maxY = Math.max(...items.map((i) => i.y + i.height));
  return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
}

// ── z-ordering ──────────────────────────────────────────────────────────────
/**
 * Re-stack the selected items. Works on the sorted-by-zIndex order, moves the selection, then
 * reassigns clean contiguous zIndices (0..n-1) so the result is always well-defined.
 */
export function reorder<T extends ArrangeItem>(items: T[], ids: Iterable<string>, mode: OrderMode): T[] {
  const sel = idSet(ids);
  if (sel.size === 0 || items.length < 2) return items;

  const order = [...items].sort((a, b) => a.zIndex - b.zIndex);

  let next: T[];
  if (mode === "front" || mode === "back") {
    const selected = order.filter((o) => sel.has(o.id));
    const rest = order.filter((o) => !sel.has(o.id));
    next = mode === "front" ? [...rest, ...selected] : [...selected, ...rest];
  } else {
    // forward: shift each selected one step toward the top (end); backward: toward the bottom.
    next = [...order];
    if (mode === "forward") {
      for (let i = next.length - 2; i >= 0; i--) {
        if (sel.has(next[i].id) && !sel.has(next[i + 1].id)) {
          [next[i], next[i + 1]] = [next[i + 1], next[i]];
        }
      }
    } else {
      for (let i = 1; i < next.length; i++) {
        if (sel.has(next[i].id) && !sel.has(next[i - 1].id)) {
          [next[i], next[i - 1]] = [next[i - 1], next[i]];
        }
      }
    }
  }

  const changes = new Map<string, Partial<T>>();
  next.forEach((o, idx) => {
    if (o.zIndex !== idx) changes.set(o.id, { zIndex: idx } as Partial<T>);
  });
  return patch(items, changes);
}

// ── alignment ────────────────────────────────────────────────────────────────
/**
 * Align selected items to an edge. With 2+ selected, aligns to the selection's bounding box
 * (Google-Slides behaviour); with exactly 1, aligns to the page.
 */
export function align<T extends ArrangeItem>(items: T[], ids: Iterable<string>, edge: AlignEdge, page: PageBox = DEFAULT_PAGE): T[] {
  const sel = idSet(ids);
  const selected = items.filter((i) => sel.has(i.id));
  if (selected.length === 0) return items;

  const b = selected.length >= 2
    ? unionBounds(selected)
    : { minX: 0, minY: 0, maxX: page.w, maxY: page.h, cx: page.w / 2, cy: page.h / 2 };

  const changes = new Map<string, Partial<T>>();
  for (const it of selected) {
    let next: Partial<T> | null = null;
    switch (edge) {
      case "left": next = { x: b.minX } as Partial<T>; break;
      case "right": next = { x: b.maxX - it.width } as Partial<T>; break;
      case "center": next = { x: b.cx - it.width / 2 } as Partial<T>; break;
      case "top": next = { y: b.minY } as Partial<T>; break;
      case "bottom": next = { y: b.maxY - it.height } as Partial<T>; break;
      case "middle": next = { y: b.cy - it.height / 2 } as Partial<T>; break;
    }
    if (next) changes.set(it.id, next);
  }
  return patch(items, changes);
}

// ── distribution ──────────────────────────────────────────────────────────────
/** Distribute 3+ selected items so the gaps between them along the axis are equal. */
export function distribute<T extends ArrangeItem>(items: T[], ids: Iterable<string>, axis: Axis): T[] {
  const sel = idSet(ids);
  const selected = items.filter((i) => sel.has(i.id));
  if (selected.length < 3) return items;

  const pos = (i: T) => (axis === "h" ? i.x : i.y);
  const size = (i: T) => (axis === "h" ? i.width : i.height);
  const sorted = [...selected].sort((a, b) => pos(a) - pos(b));

  const first = sorted[0], last = sorted[sorted.length - 1];
  const span = pos(last) + size(last) - pos(first);
  const totalSize = sorted.reduce((s, i) => s + size(i), 0);
  const gap = (span - totalSize) / (sorted.length - 1);

  const changes = new Map<string, Partial<T>>();
  let cursor = pos(first);
  for (const it of sorted) {
    const target = cursor;
    if (Math.abs(pos(it) - target) > 1e-6) {
      changes.set(it.id, (axis === "h" ? { x: target } : { y: target }) as Partial<T>);
    }
    cursor += size(it) + gap;
  }
  return patch(items, changes);
}

// ── centre on page ────────────────────────────────────────────────────────────
/** Centre the selection's bounding box on the page along one axis. */
export function center<T extends ArrangeItem>(items: T[], ids: Iterable<string>, axis: Axis, page: PageBox = DEFAULT_PAGE): T[] {
  const sel = idSet(ids);
  const selected = items.filter((i) => sel.has(i.id));
  if (selected.length === 0) return items;

  const b = unionBounds(selected);
  const delta = axis === "h" ? page.w / 2 - b.cx : page.h / 2 - b.cy;
  if (Math.abs(delta) < 1e-6) return items;

  const changes = new Map<string, Partial<T>>();
  for (const it of selected) {
    changes.set(it.id, (axis === "h" ? { x: it.x + delta } : { y: it.y + delta }) as Partial<T>);
  }
  return patch(items, changes);
}

// ── rotate / flip ───────────────────────────────────────────────────────────
/** Add `deltaDeg` to each selected item's rotation (normalised to 0–359). */
export function rotate<T extends ArrangeItem>(items: T[], ids: Iterable<string>, deltaDeg: number): T[] {
  const sel = idSet(ids);
  const changes = new Map<string, Partial<T>>();
  for (const it of items) {
    if (!sel.has(it.id)) continue;
    const next = (((it.rotation ?? 0) + deltaDeg) % 360 + 360) % 360;
    changes.set(it.id, { rotation: next } as Partial<T>);
  }
  return patch(items, changes);
}

/** Flip selected items horizontally / vertically by toggling the sign of scaleX / scaleY. */
export function flip<T extends ArrangeItem>(items: T[], ids: Iterable<string>, axis: Axis): T[] {
  const sel = idSet(ids);
  const key = axis === "h" ? "scaleX" : "scaleY";
  const changes = new Map<string, Partial<T>>();
  for (const it of items) {
    if (!sel.has(it.id)) continue;
    const cur = (it as ArrangeItem)[key] ?? 1;
    changes.set(it.id, { [key]: cur * -1 } as Partial<T>);
  }
  return patch(items, changes);
}

/** Convenience: dispatch an "arrange:*" action id onto a list of items. Returns the new list. */
export function applyArrange<T extends ArrangeItem>(
  action: string,
  items: T[],
  ids: Iterable<string>,
  page: PageBox = DEFAULT_PAGE,
): T[] {
  switch (action) {
    case "arrange:bringFront": return reorder(items, ids, "front");
    case "arrange:sendBack": return reorder(items, ids, "back");
    case "arrange:bringForward": return reorder(items, ids, "forward");
    case "arrange:sendBackward": return reorder(items, ids, "backward");
    case "arrange:alignLeft": return align(items, ids, "left", page);
    case "arrange:alignCenter": return align(items, ids, "center", page);
    case "arrange:alignRight": return align(items, ids, "right", page);
    case "arrange:alignTop": return align(items, ids, "top", page);
    case "arrange:alignMiddle": return align(items, ids, "middle", page);
    case "arrange:alignBottom": return align(items, ids, "bottom", page);
    case "arrange:distributeH": return distribute(items, ids, "h");
    case "arrange:distributeV": return distribute(items, ids, "v");
    case "arrange:centerH": return center(items, ids, "h", page);
    case "arrange:centerV": return center(items, ids, "v", page);
    case "arrange:rotateCW": return rotate(items, ids, 90);
    case "arrange:rotateCCW": return rotate(items, ids, -90);
    case "arrange:flipH": return flip(items, ids, "h");
    case "arrange:flipV": return flip(items, ids, "v");
    default: return items;
  }
}
