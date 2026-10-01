/**
 * THE EDITOR CANVAS'S ZOOM — BATCH Z-1 (plan approved 2026-10-01, research in docs/web-anatomy/editor-zoom.md).
 *
 * Zoom only changes how big the page is DRAWN in the editor. The device buttons still set the width the page is laid out
 * at, and nothing here reaches the saved site or the published page. `null` means "Fit": the page is shrunk to the room.
 */

export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 4;
/** The ladder Ctrl + / Ctrl − and the − / + buttons step along (Figma's and Framer's steps, trimmed to our range). */
export const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5, 2, 3, 4];
/** The readout's menu. */
export const ZOOM_MENU = [0.5, 0.75, 1, 1.5, 2, 4];

export const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 100) / 100));

/** The next step in or out from wherever the zoom is now — a fitted 55% steps to 67% in and 50% out. */
export function stepZoom(z: number, dir: 1 | -1): number {
  const eps = 0.005;
  const next = dir > 0 ? ZOOM_STEPS.find((s) => s > z + eps) : [...ZOOM_STEPS].reverse().find((s) => s < z - eps);
  return next ?? (dir > 0 ? ZOOM_MAX : ZOOM_MIN);
}

/**
 * KEEP THE POINT UNDER THE POINTER WHERE IT IS. `lx, ly` is that point on the page in LAYOUT px, measured before the zoom
 * changed; after it, the frame's screen origin and the zoom give where it is drawn now. The scroll moves by the difference.
 */
export function anchorDelta(a: { lx: number; ly: number; clientX: number; clientY: number }, frame: { left: number; top: number }, z: number) {
  return { dx: frame.left + a.lx * z - a.clientX, dy: frame.top + a.ly * z - a.clientY };
}

/** Zoom that shows a block of this LAYOUT size in this view with a margin round it (Shift 2, "Zoom to selection"). */
export const zoomToFit = (w: number, h: number, viewW: number, viewH: number) =>
  w > 0 && h > 0 ? clampZoom(Math.min(viewW / w, viewH / h) * 0.85) : 1;

/** "Fit · 55%" while fitted, "150%" otherwise. */
export const zoomLabel = (user: number | null, fit: number) => (user == null ? `Fit · ${Math.round(fit * 100)}%` : `${Math.round(user * 100)}%`);

/**
 * Per device, in THIS browser only — the user's convenience, never the site's. A device never zoomed opens at Fit.
 * Storage can be missing or refuse (a private window): every read and write is guarded and falls back to Fit.
 */
export const ZOOM_KEY = "educo_box_canvas_zoom_v1";
type Store = Pick<Storage, "getItem" | "setItem">;
export function readZoom(store: Store | undefined, device: string): number | null {
  try { const v = JSON.parse(store?.getItem(ZOOM_KEY) ?? "{}")[device]; return typeof v === "number" ? clampZoom(v) : null; } catch { return null; }
}
export function writeZoom(store: Store | undefined, device: string, z: number | null) {
  try {
    const all = JSON.parse(store?.getItem(ZOOM_KEY) ?? "{}") as Record<string, number>;
    if (z == null) delete all[device]; else all[device] = clampZoom(z);
    store?.setItem(ZOOM_KEY, JSON.stringify(all));
  } catch { /* storage refused: the zoom simply is not remembered */ }
}
