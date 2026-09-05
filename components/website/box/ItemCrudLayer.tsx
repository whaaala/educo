"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowUp, ArrowDown, Plus, Copy, Trash2, GripVertical, X } from "lucide-react";

/**
 * ON-CANVAS ITEM CRUD (RULE I) — shared by EVERY component, the ones we have and every future one.
 *
 * This is the toolbar half of the mechanism described on `itemRootAttrs` in lib/box-model.ts. A component's
 * markup stamps `data-eu-item="<id>"` (plus `data-eu-parent` on a nested sub-item) while the canvas is in edit
 * mode; this layer then finds the selected item's element inside `containerRef`, outlines it and floats a small
 * toolbar beside it. Nothing here knows what an alert or an accordion is — a new component gets item CRUD on the
 * page purely by emitting those attributes, at EVERY nesting level.
 *
 * Text editing is handled by the component's own `EditableText` parts, not here.
 */
export type SelectedItem = { id: string; parentId?: string };

type Box = { top: number; left: number; width: number; height: number };
type Placement = Box & { barTop: number; barLeft: number; side: "right" | "above" | "below" };

const BAR_W = 168; // the toolbar's widest form — used to decide whether it fits beside the item
const BAR_H = 34;
const GAP = 8;

export default function ItemCrudLayer({
  containerRef, selected, count, index = -1, onAdd, onDuplicate, onDelete, onMoveUp, onMoveDown, onDismiss,
}: {
  containerRef: RefObject<HTMLElement | null>;
  selected: SelectedItem | null;
  /** How many siblings the selected item has. */
  count: number;
  /** Where the selected item sits among them, so moves that cannot go anywhere are not offered. */
  index?: number;
  onAdd: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDismiss: () => void;
}) {
  const [place, setPlace] = useState<Placement | null>(null);
  // The user can DRAG the toolbar anywhere (by its grip) when it sits over something they need to see. The
  // nudge is kept per selected item, so picking a different item puts a fresh toolbar back in the smart spot.
  const [nudge, setNudge] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const dragFrom = useRef<{ x: number; y: number; dx: number; dy: number } | null>(null);
  useEffect(() => { setNudge({ dx: 0, dy: 0 }); }, [selected?.id]);

  const startNudge = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragFrom.current = { x: e.clientX, y: e.clientY, dx: nudge.dx, dy: nudge.dy };
    const onMove = (ev: MouseEvent) => {
      const f = dragFrom.current;
      if (f) setNudge({ dx: f.dx + (ev.clientX - f.x), dy: f.dy + (ev.clientY - f.y) });
    };
    const onUp = () => {
      dragFrom.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // Measure the selected item after every render, so the outline and toolbar keep up with edits that change the
  // item's size (typing a longer title, opening a panel, reordering).
  // This effect deliberately has NO dependency array — the item's geometry can change without any prop of this
  // component changing — so it MUST only call setPlace when something actually moved. Writing a fresh object
  // every pass would re-render, re-run the effect and loop ("Maximum update depth exceeded").
  useEffect(() => {
    const host = containerRef.current;
    const el = host && selected ? host.querySelector<HTMLElement>(`[data-eu-item="${CSS.escape(selected.id)}"]`) : null;
    let next: Placement | null = null;
    if (host && el) {
      const hr = host.getBoundingClientRect(), r = el.getBoundingClientRect();
      const box: Box = { top: r.top - hr.top, left: r.left - hr.left, width: r.width, height: r.height };
      // Prefer sitting just OUTSIDE the item's right edge, vertically centred — that never covers the item's own
      // text nor the item below it, which is what made the first version unreadable. When the viewport has no
      // room to the right, fall back to above the item, and only below it when the item is at the very top.
      const spaceRight = window.innerWidth - r.right;
      const side: Placement["side"] = spaceRight >= BAR_W + GAP ? "right" : r.top >= BAR_H + GAP ? "above" : "below";
      const barTop = side === "right" ? box.top + box.height / 2 - BAR_H / 2
        : side === "above" ? box.top - BAR_H - GAP / 2
        : box.top + box.height + GAP / 2;
      const barLeft = side === "right" ? box.left + box.width + GAP : box.left;
      next = { ...box, barTop, barLeft, side };
    }
    setPlace((prev) => {
      if (prev === next) return prev;
      if (!prev || !next) return next;
      const near = (a: number, b: number) => Math.abs(a - b) < 0.5;
      const same = near(prev.top, next.top) && near(prev.left, next.left) && near(prev.width, next.width)
        && near(prev.height, next.height) && near(prev.barTop, next.barTop) && near(prev.barLeft, next.barLeft);
      return same ? prev : next; // keep the identity when nothing moved → no re-render, no loop
    });
  });

  // Escape clears the item selection — the same key that closes every other editor surface.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onDismiss(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected, onDismiss]);

  if (!selected || !place) return null;

  // Only offer what can actually act on THIS item. A single-item component (the common case for an Alert) then
  // shows just "add" and "duplicate" — no dead reorder arrows, no disabled bin. Nothing here is decoration.
  const canDelete = count > 1;              // never let a component be emptied of items
  const canMoveUp = index > 0;
  const canMoveDown = index >= 0 && index < count - 1;
  const canReorder = canMoveUp || canMoveDown;
  const btn = "grid place-items-center w-7 h-7 rounded-full text-white/75 transition-colors hover:text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/75";

  return (
    <>
      {/* Selection ring — drawn INSIDE the item's own bounds so it never crowds the neighbouring items, and
          decorative only, so it never intercepts a click meant for the text underneath. */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-[inherit] ring-2 ring-indigo-500/60 ring-offset-0"
        style={{ top: place.top, left: place.left, width: place.width, height: place.height, zIndex: 20, borderRadius: 10 }}
      />
      <div
        role="toolbar"
        aria-label="Edit this item"
        className="absolute flex items-center gap-0.5 rounded-full p-1 bg-slate-900/85 dark:bg-slate-800/85 midnight:bg-slate-900/85 purple:bg-purple-950/85 backdrop-blur-md shadow-xl shadow-black/25 ring-1 ring-white/15"
        style={{ top: place.barTop + nudge.dy, left: place.barLeft + nudge.dx, zIndex: 21 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag the grip to move the toolbar off whatever it is covering; it resets for the next item. */}
        <span
          role="button"
          tabIndex={0}
          aria-label="Move this toolbar"
          title="Drag to move this toolbar"
          onMouseDown={startNudge}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 16 : 4;
            if (e.key === "ArrowUp") { e.preventDefault(); setNudge((n) => ({ ...n, dy: n.dy - step })); }
            else if (e.key === "ArrowDown") { e.preventDefault(); setNudge((n) => ({ ...n, dy: n.dy + step })); }
            else if (e.key === "ArrowLeft") { e.preventDefault(); setNudge((n) => ({ ...n, dx: n.dx - step })); }
            else if (e.key === "ArrowRight") { e.preventDefault(); setNudge((n) => ({ ...n, dx: n.dx + step })); }
          }}
          className="grid place-items-center w-5 h-7 rounded-full text-white/45 cursor-grab active:cursor-grabbing hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
        >
          <GripVertical className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
        {canMoveUp && (
          <button type="button" className={btn} onClick={onMoveUp} aria-label="Move item up" title="Move up">
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
        {canMoveDown && (
          <button type="button" className={btn} onClick={onMoveDown} aria-label="Move item down" title="Move down">
            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
        {canReorder && <span aria-hidden="true" className="w-px h-4 bg-white/15 mx-0.5" />}
        <button type="button" className={btn} onClick={onAdd} aria-label="Add an item below this one" title="Add item below">
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <button type="button" className={btn} onClick={onDuplicate} aria-label="Duplicate this item" title="Duplicate">
          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        {canDelete && (
          <>
            <span aria-hidden="true" className="w-px h-4 bg-white/15 mx-0.5" />
            <button
              type="button"
              className={`${btn} hover:text-rose-300 hover:bg-rose-500/20`}
              onClick={onDelete}
              aria-label="Delete this item"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </>
        )}
        <span aria-hidden="true" className="w-px h-4 bg-white/15 mx-0.5" />
        {/* Close — the pointer equivalent of Escape, so the toolbar can always be got out of the way. */}
        <button type="button" className={btn} onClick={onDismiss} aria-label="Close this item toolbar" title="Close (Esc)">
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
