import { describe, it, expect } from "vitest";
import { putMedia, getMedia, videoRefused, isMediaRef, bytesOf, type MediaBackend } from "@/lib/media-store";
import { mediaFile } from "@/lib/box-model";
import LAYOUT from "@/config/layout.json";

/**
 * MS-5b-a · the store for big files (BATCH LE-5). Scenarios: tests/features/components/website/background-video.feature
 * ("The store for big files"). The backend is IndexedDB in the browser; here a Map stands in for it.
 */
const memory = (): MediaBackend & { map: Map<string, Blob>; writes: number } => {
  const map = new Map<string, Blob>();
  const b = { map, writes: 0, get: async (k: string) => map.get(k) ?? null, put: async (k: string, v: Blob) => { b.writes++; map.set(k, v); } };
  return b;
};
const video = (text = "a short loop", type = "video/mp4") => new File([text], "loop.mp4", { type });

describe("putMedia — the page keeps only a name", () => {
  it("stores the bytes under their hash and returns media:<hash>.<ext>", async () => {
    const db = memory();
    const r = await putMedia(video(), db);
    expect("ref" in r && r.ref).toMatch(/^media:[0-9a-f]{64}\.mp4$/);
    if (!("ref" in r)) return;
    expect(isMediaRef(r.ref)).toBe(true);
    expect(new TextDecoder().decode(await bytesOf((await getMedia(r.ref, db))!))).toBe("a short loop");
  });
  it("the same file twice is stored once", async () => {
    const db = memory();
    const a = await putMedia(video(), db), b = await putMedia(video(), db);
    expect(a).toEqual(b);
    expect(db.map.size).toBe(1);
    expect(db.writes).toBe(1);
  });
  it("two different files are two names — the hash is of the bytes, never of nothing", async () => {
    const db = memory();
    const a = await putMedia(video("first"), db), b = await putMedia(video("second"), db);
    expect(a).not.toEqual(b);
    expect(db.map.size).toBe(2);
    // sha-256 of the empty input — what an empty view would give every file
    expect("ref" in a && a.ref).not.toContain("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });
  it("LE5-3: a link (or any non-reference) is never looked up in the store", async () => {
    const db = memory();
    db.get = async () => { throw new Error("asked the store"); };
    db.map.set("https://example.org/a.mp4", new Blob(["x"]));
    expect(await getMedia("https://example.org/a.mp4", { ...db, get: async (k) => db.map.get(k) ?? null })).toBeNull();
  });
  it("a webm keeps its kind in the name", async () => {
    const r = await putMedia(video("x", "video/webm"), memory());
    expect("ref" in r && r.ref).toMatch(/\.webm$/);
  });
  it("a store that refuses the write SAYS so, with the browser's reason", async () => {
    const db = memory();
    db.put = async () => { throw new DOMException("quota", "QuotaExceededError"); };
    const r = await putMedia(video(), db);
    expect(r).toEqual({ error: expect.stringMatching(/could not be kept.*full/i) });
  });
});

describe("videoRefused — the size cap and the kinds come from config", () => {
  const MB = 1024 * 1024;
  it("a file over media.videoMaxMb is refused, naming the limit", () => {
    expect(videoRefused({ size: (LAYOUT.media.videoMaxMb + 1) * MB, type: "video/mp4" })).toMatch(new RegExp(`${LAYOUT.media.videoMaxMb} MB`));
  });
  it("a kind outside media.videoTypes is refused, naming the kinds", () => {
    expect(videoRefused({ size: MB, type: "video/quicktime" })).toMatch(/mp4.*webm/);
  });
  it("a small mp4 is accepted", () => {
    expect(videoRefused({ size: MB, type: "video/mp4" })).toBeNull();
  });
  it("a refused file is never stored", async () => {
    const db = memory();
    const r = await putMedia(new File([new Uint8Array(10)], "x.mov", { type: "video/quicktime" }), db);
    expect("error" in r).toBe(true);
    expect(db.writes).toBe(0);
  });
});

describe("mediaFile — where the download puts it", () => {
  it("media:<hash>.mp4 → videos/<hash>.mp4; anything else is not a stored file", () => {
    const h = "a".repeat(64);
    expect(mediaFile(`media:${h}.mp4`)).toBe(`videos/${h}.mp4`);
    expect(mediaFile("https://example.org/loop.mp4")).toBeNull();
    expect(isMediaRef("media:../../x.mp4")).toBe(false);
  });
});

describe("videosAsFiles — the download carries the uploaded videos the pages name", () => {
  it("each named video is a file in the ZIP; one this browser does not hold is listed as missing", async () => {
    const { videosAsFiles } = await import("@/lib/export-photos");
    const db = memory();
    const r = await putMedia(video("loop bytes"), db);
    if (!("ref" in r)) throw new Error("not stored");
    const kept = mediaFile(r.ref)!, gone = `videos/${"c".repeat(64)}.webm`;
    const out = await videosAsFiles({ "index.html": `<video data-src="${kept}"></video><video data-src="${gone}"></video>`, "styles.css": "" }, db);
    expect(Object.keys(out.files)).toEqual([kept]);
    expect(new TextDecoder().decode(out.files[kept])).toBe("loop bytes");
    expect(out.missing).toEqual([gone]);
  });
  it("a site with no uploaded video adds nothing", async () => {
    const { videosAsFiles } = await import("@/lib/export-photos");
    expect(await videosAsFiles({ "index.html": `<video data-src="https://e.org/a.mp4"></video>` }, memory())).toEqual({ files: {}, missing: [] });
  });
});
