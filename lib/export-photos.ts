/**
 * PHOTOS AS FILES, SIZED TO THE SCREEN (RA-8) — the browser half of the export.
 *
 * The engine (`photosToFiles`, `addSrcset` in lib/box-export.ts) moves each photo out of the pages and names it;
 * this file does what needs a canvas: it decodes each photo once, draws the narrower copies a phone needs, and turns
 * everything into bytes for the ZIP. Kept outside the engine so the engine stays portable (rule 20).
 */
import { PHOTO_QUALITY } from "@/lib/box-model";
import { PHOTO_WIDTHS, addSrcset, photosToFiles, type SiteFiles } from "@/lib/box-export";

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
 * The site's text files → the files to zip: photos out as `images/…`, each with 480 / 960 copies where it is wider,
 * and every `<img>` given its `srcset`. A photo that cannot be decoded still ships whole — losing a picture is worse
 * than sending a big one.
 */
export async function photosAsFiles(text: SiteFiles): Promise<Record<string, string | Uint8Array>> {
  const { files, photos } = photosToFiles(text);
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
  return { ...addSrcset(files, copies), ...bin };
}
