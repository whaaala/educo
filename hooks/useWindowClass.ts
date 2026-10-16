"use client";

import { useSyncExternalStore } from "react";
import { windowClass, type WindowClass } from "@/lib/educo-ui/layout";

/**
 * What this browser window IS (A-2 (2)) — the same `windowClass` the phone app asks, live on every resize. The page's CSS
 * rungs are `em` media queries, which follow the reader's browser text size; so the window is measured in the same unit
 * (its width in px ÷ the browser's own 1em × 16), and a reader who enlarged their text gets the narrower class the CSS gives
 * them too (rule 16), instead of the JS and the CSS disagreeing.
 */
const subscribe = (cb: () => void) => { window.addEventListener("resize", cb); return () => window.removeEventListener("resize", cb); };
let em = 0; // measured once: the browser's text size does not change without a reload
/** The browser's initial font size — what a media query's `em` means (not the page's own html font-size). */
function mediaEm(): number {
  if (em) return em;
  const d = document.createElement("div"); d.style.cssText = "position:absolute;visibility:hidden;font-size:initial;width:1em";
  document.body.appendChild(d); em = d.getBoundingClientRect().width || 16; d.remove(); return em;
}
let last: { w: number; h: number; c: WindowClass } | null = null;
const snapshot = (): WindowClass => {
  const s = 16 / mediaEm(), w = Math.round(innerWidth * s), h = Math.round(innerHeight * s);
  if (!last || last.w !== w || last.h !== h) last = { w, h, c: windowClass(w, h) };
  return last.c;
};

/** `null` while the page is drawn on the server (there is no window); a page shows its spinner until the first answer. */
export function useWindowClass(): WindowClass | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
