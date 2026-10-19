/**
 * PHOTOS AS FILES, SIZED TO THE SCREEN (RA-8) — the browser half of the export.
 *
 * The engine (`photosToFiles`, `addSrcset` in lib/box-export.ts) moves each photo out of the pages and names it;
 * this file does what needs a canvas: it decodes each photo once, draws the narrower copies a phone needs, and turns
 * everything into bytes for the ZIP. Kept outside the engine so the engine stays portable (rule 20).
 */
import { PHOTO_QUALITY } from "@/lib/box-model";
import { getMedia, bytesOf as blobBytes, type MediaBackend } from "@/lib/media-store";
import { PHOTO_WIDTHS, PHOTO_IMG, SHARED_STYLESHEET, addSrcset, photosToFiles, sizesFromWidths, sizesScreens, type SiteFiles } from "@/lib/box-export";

const bytesOf = (dataUri: string): Uint8Array => {
  const bin = atob(dataUri.slice(dataUri.indexOf(",") + 1));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

const decode = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error("decode"));
  img.src = src;
});

/** One narrower copy, or null when the browser cannot make one (the original still ships). */
async function copyAt(img: HTMLImageElement, w: number, type: string): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = Math.max(1, Math.round((img.naturalHeight * w) / img.naturalWidth));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, type, PHOTO_QUALITY));
}

/**
 * AC-22 · one page's photos MEASURED: the page is laid out in an offscreen frame with no scripts (its layout alone) at both
 * edges of every rung (`sizesScreens`), each photo's width read as a share of the window → `sizesFromWidths`. Measured rather
 * than computed, so container queries, grids that fit as many as they can and stacks that wrap are all exact. Nothing is
 * fetched: the photos are their data URIs again, every other file a background or a font names is left out.
 */
async function measurePage(html: string, css: string, photos: Record<string, string>): Promise<(string | null)[]> {
  let n = 0;
  const offline = (s: string) => s.replace(/url\((["']?)(images|fonts)\/[^)"']+\1\)/g, "none");
  const doc = offline(html.replace(PHOTO_IMG, (_t, before: string, file: string, rest: string) => `<img data-eu-i="${n++}" ${before}src="${photos[file] ?? ""}"${rest}>`))
    .replace(/<link [^>]*>/g, "").replace("</head>", `<style>${offline(css)}</style></head>`);
  if (!n) return [];
  const frame = document.createElement("iframe");
  frame.setAttribute("sandbox", "allow-same-origin");
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  frame.style.cssText = "position:fixed;left:-100000px;top:0;height:900px;border:0;visibility:hidden";
  document.body.appendChild(frame);
  try {
    await new Promise<void>((resolve) => { frame.onload = () => resolve(); frame.srcdoc = doc; });
    const d = frame.contentDocument;
    if (!d) return [];
    const screens = sizesScreens();
    const share = Array.from({ length: n }, () => screens.map(() => 0));
    const wide = Array.from({ length: n }, () => [0, 0]);
    screens.forEach((edges, r) => edges.forEach((w, e) => {
      frame.style.width = `${w}px`;
      d.querySelectorAll<HTMLImageElement>("img[data-eu-i]").forEach((img) => {
        const k = Number(img.dataset.euI), bw = img.getBoundingClientRect().width;
        share[k][r] = Math.max(share[k][r], bw / w);
        if (r === screens.length - 1) wide[k][e] = bw;
      });
    }));
    return share.map((s, k) => sizesFromWidths(
      screens.map(([, to], r) => ({ below: r < screens.length - 1 ? to + 1 : null, share: s[r] })),
      wide[k][0] > 0 && Math.abs(wide[k][0] - wide[k][1]) < 1 ? wide[k][1] : undefined,
    ));
  } finally {
    frame.remove();
  }
}

/** AC-22 · every page's measured `sizes`; a page that cannot be laid out keeps the window's width (the download never fails on it). */
export async function measuredSizes(files: SiteFiles, photos: Record<string, string>): Promise<Record<string, (string | null)[]>> {
  const out: Record<string, (string | null)[]> = {};
  for (const [name, html] of Object.entries(files)) {
    if (!name.endsWith(".html")) continue;
    out[name] = await measurePage(html, files[SHARED_STYLESHEET] ?? "", photos).catch(() => []);
  }
  return out;
}

/** A published page's uploaded videos (`videos/<sha-256>.<ext>`, MS-5b) — the same pattern `mediaFile` writes. */
const VIDEO_FILE = /videos\/([0-9a-f]{64}\.(?:mp4|webm))/g;

/**
 * MS-5b · the uploaded background videos the pages name, as bytes for the ZIP, read from this browser's media store. A video
 * this browser does not hold (the site was built elsewhere, or its storage was cleared) is listed in `missing` — the page then
 * shows its poster, and the editor says so rather than shipping a silent hole.
 */
export async function videosAsFiles(files: SiteFiles, db?: MediaBackend): Promise<{ files: Record<string, Uint8Array>; missing: string[] }> {
  const names = new Set(Object.values(files).flatMap((t) => [...t.matchAll(VIDEO_FILE)].map((m) => m[1])));
  const out: Record<string, Uint8Array> = {}, missing: string[] = [];
  for (const name of names) {
    const blob = await getMedia(`media:${name}`, db);
    if (blob) out[`videos/${name}`] = new Uint8Array(await blobBytes(blob));
    else missing.push(`videos/${name}`);
  }
  return { files: out, missing };
}

/**
 * The site's text files → the files to zip: photos out as `images/…`, each with 480 / 960 copies where it is wider,
 * and every `<img>` given its `srcset`. A photo that cannot be decoded still ships whole — losing a picture is worse
 * than sending a big one.
 */
/**
 * LE-15 D6 · A READY-MADE SECTION'S PHOTOS travel with the site. They are the builder's own files (`/sections/<id>-800.webp`,
 * config/section-photos.json), which a downloaded site on the school's own host would not have — so each one a page names is
 * fetched and made a data URI, the form an uploaded photo already has, and goes out as `images/…` with its copies like any
 * other. A photo that cannot be fetched is left as it was (the download never fails on it).
 */
const SECTION_PHOTO = /\/sections\/[a-z0-9-]+\.webp/g;
export async function inlineSectionPhotos(text: SiteFiles, get: (url: string) => Promise<Blob | null> = (u) => fetch(u).then((r) => (r.ok ? r.blob() : null), () => null)): Promise<SiteFiles> {
  const urls = new Set(Object.values(text).flatMap((t) => t.match(SECTION_PHOTO) ?? []));
  if (!urls.size) return text;
  const uri = new Map<string, string>();
  for (const u of urls) {
    const blob = await get(u);
    if (!blob) continue;
    const bytes = new Uint8Array(await blobBytes(blob));
    let bin = ""; for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    uri.set(u, `data:image/webp;base64,${btoa(bin)}`);
  }
  return Object.fromEntries(Object.entries(text).map(([k, t]) => [k, t.replace(SECTION_PHOTO, (u) => uri.get(u) ?? u)]));
}

export async function photosAsFiles(text: SiteFiles): Promise<Record<string, string | Uint8Array>> {
  const { files, photos } = photosToFiles(await inlineSectionPhotos(text));
  const bin: Record<string, Uint8Array> = {};
  const copies: Record<string, { w: number; file: string }[]> = {};
  for (const [file, uri] of Object.entries(photos)) {
    bin[file] = bytesOf(uri);
    const img = await decode(uri).catch(() => null);
    if (!img?.naturalWidth) continue;
    // Anything that may carry transparency stays WebP (it keeps alpha); a JPEG stays a JPEG.
    const type = /^data:image\/jpeg/.test(uri) ? "image/jpeg" : "image/webp";
    const list: { w: number; file: string }[] = [];
    for (const w of PHOTO_WIDTHS) {
      if (w >= img.naturalWidth) break;
      const blob = await copyAt(img, w, type);
      // `toBlob` quietly falls back to PNG for a type it cannot write; name the file for what it really is.
      if (!blob) continue;
      const name = file.replace(/\.[a-z]+$/, `-${w}.${blob.type.split("/")[1].replace("jpeg", "jpg")}`);
      bin[name] = new Uint8Array(await blob.arrayBuffer());
      list.push({ w, file: name });
    }
    copies[file] = [...list, { w: img.naturalWidth, file }];
  }
  return { ...addSrcset(files, copies, await measuredSizes(files, photos)), ...bin };
}
