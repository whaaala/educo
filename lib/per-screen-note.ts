import INSPECTOR from "../config/inspector.json";
import { RUNG_WORDS } from "./educo-ui/layout";
import { screensReachedFrom, type Breakpoint } from "./box-model";

/**
 * V-5 (BATCH LE-2) · WHAT THE INSPECTOR SAYS WHILE ANOTHER SCREEN IS BEING EDITED — and it must be TRUE. It said "size & layout only
 * change here", while every look (a background, a colour, a font) was stored for that screen too, and a Tablet change showed on phones
 * as well. The words are data (config/inspector.json, RULE CFG); the screens a change reaches are read from the cascade itself.
 */
const PER = INSPECTOR.perScreen;
/** The keys a change still writes for EVERY screen, whichever screen is being edited (the words, links, pictures and effects). */
export const SHARED_KEYS: ReadonlySet<string> = new Set(PER.sharedKeys);

/**
 * A change made while another screen is being edited, split into what every screen gets (`shared`) and what this screen keeps
 * (`own`). LE5-18: a tint that ARRIVES in the same change as a background video goes wherever the video goes — every screen —
 * or a desktop visitor would get the video with no tint (measured on the phone emulator, 2026-10-18). A tint changed on its own
 * stays this screen's, as before.
 */
export function splitPatch<T extends object>(patch: T): { shared: Partial<T>; own: Partial<T> } {
  const shared: Partial<T> = {}, own: Partial<T> = {};
  const withVideo = "bgVideo" in patch && !!(patch as { bgVideo?: unknown }).bgVideo;
  for (const [k, v] of Object.entries(patch)) ((SHARED_KEYS.has(k) || (withVideo && k === "bgOverlay")) ? shared : own)[k as keyof T] = v as never;
  return { shared, own };
}

const words = (bp: Breakpoint) => RUNG_WORDS[bp === "base" ? "desktop" : bp];
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/** "phones" · "tablets held upright — and on phones too, unless you change them there". */
export function reachWords(bp: Breakpoint): string {
  const [own, ...narrower] = screensReachedFrom(bp).map(words);
  return narrower.length ? PER.narrowerToo.replace("{own}", own).replace("{narrower}", list(narrower)) : own ?? "";
}
const fill = (t: string, screen: string, bp: Breakpoint) => t.replace("{screen}", screen).replace("{reach}", reachWords(bp));
/** The banner above the Inspector's controls, and the line under it about what stays shared. */
export const perScreenBanner = (bp: Breakpoint, screen: string) => ({ text: fill(PER.banner, screen, bp), shared: PER.shared });
/** The Per-device tab's hint. */
export const perScreenDeviceTab = (bp: Breakpoint, screen: string) => fill(PER.deviceTab, screen, bp);
