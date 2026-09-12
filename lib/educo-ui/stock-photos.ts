/**
 * Stock photos for block backgrounds (RULE E — the photo half of the background library).
 *
 * Unlike icons/gradients (a bounded set we can bundle offline), free stock photos number in the MILLIONS and
 * live behind an API + licence — so the way to reach ALL free photos is a live search, not a local bundle.
 * We use **Unsplash** (the largest free-photo library): set `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` (a free key) and
 * `searchStockPhotos` queries their whole catalogue. Attribution is returned so the UI can credit photographers
 * (an Unsplash API requirement). Without a key we fall back to Lorem Picsum "seed" URLs — real photos that ALWAYS
 * resolve (no 404s, no key) so the feature works out of the box, just not searchable by subject.
 *
 * NOTE: photos are EXTERNAL URLs — a page using one is no longer fully self-contained (unlike the CSS
 * gradients/patterns). That's the normal trade-off for photography; users can also upload an image instead.
 */

import { CURATED_PHOTOS } from "./stock-photos-curated.generated";

export type StockPhoto = { id: string; url: string; thumb: string; alt: string; credit?: string; creditUrl?: string; topic?: string };

// The Unsplash access key can come from a build-time env var OR be pasted into the app (saved per-browser in
// localStorage) — so a user can enable live search without editing files. Read it fresh at call time.
const ENV_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "";
const LS_KEY = "educo:unsplash-key";
export function getUnsplashKey(): string {
  if (ENV_KEY) return ENV_KEY;
  try { return (typeof localStorage !== "undefined" && localStorage.getItem(LS_KEY)) || ""; } catch { return ""; }
}
export function setUnsplashKey(k: string): void {
  try { const v = (k || "").trim(); if (v) localStorage.setItem(LS_KEY, v); else localStorage.removeItem(LS_KEY); } catch { /* private mode */ }
}
export function hasUnsplashKey(): boolean { return !!getUnsplashKey(); }

const img = (base: string, w: number, q: number) => `${base}?w=${w}&q=${q}&auto=format&fit=crop`;

/**
 * No-key library: 500+ REAL free photos crawled from Unsplash at build time (Unsplash License — free to use,
 * hotlinking their CDN is allowed), tagged by topic so the topic chips filter meaningfully. Full url + thumb are
 * derived from each photo's base CDN URL. With an Unsplash access key we ALSO offer live search of the whole
 * catalogue (millions) — see searchStockPhotos.
 */
const FALLBACK: StockPhoto[] = CURATED_PHOTOS.map((p) => ({
  id: p.id,
  alt: p.alt || p.topic,
  topic: p.topic,
  url: img(p.base, 1920, 80),
  thumb: img(p.base, 400, 60),
  credit: p.credit || "Unsplash",
  creditUrl: p.creditUrl,
}));

// Topic chips = the topics actually present in the bundled set (so every chip returns photos).
export const PHOTO_TOPICS: string[] = [...new Set(CURATED_PHOTOS.map((p) => p.topic))];

/**
 * Search free stock photos. With an Unsplash key: the full catalogue, by query. Without: the curated fallback
 * (filtered by the query against its labels). Always resolves to an array (throws only on a hard network error
 * when a key IS set, so the UI can show a retry).
 */
export async function searchStockPhotos(query: string, page = 1): Promise<StockPhoto[]> {
  const KEY = getUnsplashKey();
  if (KEY) {
    const q = encodeURIComponent(query.trim() || "wallpaper");
    const url = `https://api.unsplash.com/search/photos?query=${q}&per_page=30&page=${page}&orientation=landscape&client_id=${KEY}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Unsplash ${r.status}`);
    const j = await r.json();
    return (j.results ?? []).map((p: UnsplashPhoto) => ({
      id: p.id,
      url: `${p.urls.raw}&w=1600&q=80&auto=format&fit=crop`,
      thumb: `${p.urls.raw}&w=320&q=60&auto=format&fit=crop`,
      alt: p.alt_description || p.description || "Photo",
      credit: p.user?.name,
      creditUrl: p.user?.links?.html,
    }));
  }
  const ql = query.trim().toLowerCase();
  return ql ? FALLBACK.filter((p) => p.alt.toLowerCase().includes(ql) || (p.topic ?? "").toLowerCase().includes(ql)) : FALLBACK;
}

type UnsplashPhoto = {
  id: string;
  description?: string;
  alt_description?: string;
  urls: { raw: string };
  user?: { name?: string; links?: { html?: string } };
};
