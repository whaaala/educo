/**
 * reorder — pure, generic list-reordering ops shared by every editor's item strip.
 *
 * The slide filmstrip (web + mobile), document pages/tabs, whiteboard frames — they all need
 * the same "move to start / up / down / end" and drag-to-reorder logic. These functions are
 * type-agnostic (they only splice the array) and return BOTH the new list and the moved item's
 * new index, so callers can keep their "active" pointer in sync.
 */

export type MoveMode = "start" | "up" | "down" | "end";

export interface ReorderResult<T> {
  items: T[];
  index: number;
}

/** Move the item at `from` by one of the named modes. Returns the same array ref if nothing moved. */
export function moveItem<T>(arr: T[], from: number, mode: MoveMode): ReorderResult<T> {
  if (from < 0 || from >= arr.length) return { items: arr, index: from };
  let to = from;
  switch (mode) {
    case "start": to = 0; break;
    case "end": to = arr.length - 1; break;
    case "up": to = Math.max(0, from - 1); break;
    case "down": to = Math.min(arr.length - 1, from + 1); break;
  }
  return reorderItem(arr, from, to);
}

/** Move the item at `from` to index `to` (clamped). Returns the same array ref if nothing moved. */
export function reorderItem<T>(arr: T[], from: number, to: number): ReorderResult<T> {
  if (from < 0 || from >= arr.length) return { items: arr, index: from };
  const clamped = Math.max(0, Math.min(arr.length - 1, to));
  if (clamped === from) return { items: arr, index: from };
  const items = [...arr];
  const [moved] = items.splice(from, 1);
  items.splice(clamped, 0, moved);
  return { items, index: clamped };
}
