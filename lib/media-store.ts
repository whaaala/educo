/**
 * THE STORE FOR BIG FILES (MS-5b-a, BATCH LE-5) — an uploaded background video is far too big for the saved page
 * (localStorage holds a few MB in all), so its bytes live in the browser's IndexedDB and the block keeps only
 * `media:<sha-256>.<ext>` (`MEDIA_REF` in lib/box-model.ts). The same file is stored once, whoever uses it. A write the
 * browser refuses is SAID, with its reason, and the page is left as it was — a video never vanishes silently.
 * Kept outside the engine, like lib/export-photos.ts, so the engine stays portable (rule 20).
 * ponytail: a video no block uses any more stays in the store — deleting it would break an Undo; the browser's quota bounds it.
 */
import { MEDIA } from "@/lib/educo-ui/layout";
import { isMediaRef } from "@/lib/box-model";

export { isMediaRef };

/** What the store needs — IndexedDB in the browser, a Map in the unit test. */
export interface MediaBackend {
  get(key: string): Promise<Blob | null>;
  put(key: string, value: Blob): Promise<void>;
}

const EXT: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm" };

/** Why a file cannot be a background video (config/layout.json media.videoMaxMb + videoTypes), or null when it can. */
export function videoRefused(file: { size: number; type: string }): string | null {
  if (!MEDIA.videoTypes.includes(file.type) || !EXT[file.type]) return `A background video must be ${MEDIA.videoTypes.map((t) => t.split("/")[1]).join(" or ")}.`;
  if (file.size > MEDIA.videoMaxMb * 1024 * 1024) return `This video is ${(file.size / 1024 / 1024).toFixed(1)} MB — a background video can be at most ${MEDIA.videoMaxMb} MB (a short loop of a few seconds is plenty).`;
  return null;
}

/** A file's bytes — FileReader, which every browser (and the test's jsdom) has; `Blob.arrayBuffer` is missing in older WebViews. */
export const bytesOf = (b: Blob) => new Promise<ArrayBuffer>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(r.result as ArrayBuffer);
  r.onerror = () => reject(r.error);
  r.readAsArrayBuffer(b);
});

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

/** Keep `file`; its reference for the block, or the reason it was not kept. */
export async function putMedia(file: File, db: MediaBackend = idb()): Promise<{ ref: string } | { error: string }> {
  const refused = videoRefused(file);
  if (refused) return { error: refused };
  try {
    const bytes = await bytesOf(file);
    const ref = `media:${hex(await crypto.subtle.digest("SHA-256", new Uint8Array(bytes)))}.${EXT[file.type]}`;
    if (!(await db.get(ref))) await db.put(ref, new Blob([bytes], { type: file.type }));
    return { ref };
  } catch (e) {
    const full = e instanceof DOMException && e.name === "QuotaExceededError";
    return { error: `The video could not be kept${full ? ": this browser's storage is full" : ""} — ${e instanceof Error ? e.message : String(e)}. Your page is unchanged.` };
  }
}

/** The stored bytes of `ref`, or null (another browser, cleared storage, not a stored video). */
export async function getMedia(ref: string, db: MediaBackend = idb()): Promise<Blob | null> {
  if (!isMediaRef(ref)) return null;
  try { return await db.get(ref); } catch { return null; }
}

// ── IndexedDB, the browser's backend ──
const DB = "educo-media", STORE = "files";
let opened: Promise<IDBDatabase> | null = null;
const open = () => (opened ??= new Promise<IDBDatabase>((resolve, reject) => {
  const req = indexedDB.open(DB, 1);
  req.onupgradeneeded = () => req.result.createObjectStore(STORE);
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => { opened = null; reject(req.error); };
}));
const run = <T>(mode: IDBTransactionMode, act: (s: IDBObjectStore) => IDBRequest<T>) => open().then((db) => new Promise<T>((resolve, reject) => {
  const tx = db.transaction(STORE, mode), req = act(tx.objectStore(STORE));
  tx.oncomplete = () => resolve(req.result);
  tx.onerror = tx.onabort = () => reject(tx.error ?? req.error);
}));
function idb(): MediaBackend {
  return {
    get: (k) => run<Blob | undefined>("readonly", (s) => s.get(k) as IDBRequest<Blob | undefined>).then((b) => b ?? null),
    put: (k, v) => run("readwrite", (s) => s.put(v, k)).then(() => undefined),
  };
}
