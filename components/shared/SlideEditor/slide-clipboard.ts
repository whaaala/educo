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
