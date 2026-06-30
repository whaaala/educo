/**
 * A single, module-level clipboard for slide objects shared by every copy/cut/paste
 * entry point — the Ctrl+C/X/V keyboard handler, the Edit menu, and the right-click
 * context menu. Being module-level, it survives slide navigation, so an object copied
 * on one page can be pasted on another. (Previously the keyboard handler and the
 * context menu used two different refs, so copy-here / paste-there silently failed.)
 */

import type { SlideObject } from "@/lib/slide-storage";

let clip: SlideObject[] | null = null;

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export function setSlideClipboard(objs: SlideObject[]): void {
  clip = objs.length ? objs.map(clone) : null;
}

export function getSlideClipboard(): SlideObject[] | null {
  return clip ? clip.map(clone) : null;
}

export function hasSlideClipboard(): boolean {
  return !!clip && clip.length > 0;
}

interface Box { x: number; y: number; width: number; height: number }
interface Area { x: number; y: number; w: number; h: number }

/**
 * Keep a ROTATED object inside the slide. When a box is rotated its axis-aligned bounding
 * box grows (and at 90°/270° its width/height swap), so a wide chart rotated upright can
 * hang off the page. This scales the box down (preserving its width:height ratio) until the
 * rotated bounding box fits, then clamps the centre so nothing spills past the edges.
 * `aspect` = slide width / height (16:9 by default). Coordinates are slide percentages.
 */
export function fitRotatedToPage<T extends Box & { rotation?: number }>(o: T, aspect = 16 / 9): T {
  const SW = 100 * aspect, SH = 100;            // height-normalised pixel space
  const pw = (o.width / 100) * SW, ph = (o.height / 100) * SH;
  const t = ((o.rotation || 0) * Math.PI) / 180;
  const c = Math.abs(Math.cos(t)), s = Math.abs(Math.sin(t));
  let bw = pw * c + ph * s, bh = pw * s + ph * c;
  const f = Math.min(1, SW / bw, SH / bh);      // shrink-to-fit factor (≤ 1)
  bw *= f; bh *= f;
  let cx = ((o.x + o.width / 2) / 100) * SW, cy = ((o.y + o.height / 2) / 100) * SH;
  cx = Math.min(Math.max(cx, bw / 2), SW - bw / 2);
  cy = Math.min(Math.max(cy, bh / 2), SH - bh / 2);
  const nW = o.width * f, nH = o.height * f;
  return { ...o, width: nW, height: nH, x: (cx / SW) * 100 - nW / 2, y: (cy / SH) * 100 - nH / 2 };
}

/**
 * Pack a group of objects into the free space of `area`, avoiding `content`. Returns the
 * group repositioned (and uniformly shrunk if needed) so it fits without overlapping, or
 * `null` if there's no room. Shared by inserts AND paste so both behave identically.
 */
export function packIntoFreeSpace<T extends Box>(objs: T[], content: Box[], area: Area, gap = 2): T[] | null {
  if (objs.length === 0) return null;
  const minX = Math.min(...objs.map(o => o.x)), minY = Math.min(...objs.map(o => o.y));
  const gw = Math.max(...objs.map(o => o.x + o.width)) - minX;
  const gh = Math.max(...objs.map(o => o.y + o.height)) - minY;
  const within = (x: number, y: number, w: number, h: number) =>
    x >= area.x - 0.5 && y >= area.y - 0.5 && x + w <= area.x + area.w + 0.5 && y + h <= area.y + area.h + 0.5;
  const hits = (x: number, y: number, w: number, h: number) =>
    content.some(c => x < c.x + c.width && x + w > c.x && y < c.y + c.height && y + h > c.y);
  const tryPlace = (w: number, h: number): { x: number; y: number } | null => {
    const xs = Array.from(new Set([area.x, ...content.map(c => c.x + c.width + gap)])).sort((a, b) => a - b);
    const ys = Array.from(new Set([area.y, ...content.map(c => c.y + c.height + gap)])).sort((a, b) => a - b);
    for (const y of ys) for (const x of xs) if (within(x, y, w, h) && !hits(x, y, w, h)) return { x, y };
    return null;
  };
  let scale = 1, spot = tryPlace(gw, gh);
  if (!spot) {
    for (const s of [0.8, 0.65, 0.5, 0.4, 0.35]) { spot = tryPlace(gw * s, gh * s); if (spot) { scale = s; break; } }
  }
  if (!spot) return null;
  return objs.map(o => ({
    ...o,
    x: spot!.x + (o.x - minX) * scale,
    y: spot!.y + (o.y - minY) * scale,
    width: o.width * scale,
    height: o.height * scale,
  }));
}
