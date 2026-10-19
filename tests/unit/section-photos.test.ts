import { describe, it, expect } from "vitest";
import { statSync, existsSync } from "node:fs";
import { join } from "node:path";
import PHOTOS from "@/config/section-photos.json";
import { buildSection, type SectionDef } from "@/lib/section-library";
import { inlineSectionPhotos } from "@/lib/export-photos";
import { photosToFiles } from "@/lib/box-export";
import type { BoxNode } from "@/lib/box-model";

/**
 * LE-15 D6 · the sections' photo set — box-builder-sections.feature "The photos are light enough for a phone on slow 3G".
 * Every photo in config/section-photos.json exists at both widths and is at most 40 KB; a designed section shows it with its
 * alt and size; a wireframe never does; and a downloaded site carries it (it is not left pointing at the builder's own files).
 */
const SET = (PHOTOS as unknown as { photos: Record<string, { src: string; srcset: string; alt: string; licence: string; source: string; width: number; height: number }> }).photos;
const walk = (n: BoxNode, f: (n: BoxNode) => void) => { f(n); n.children?.forEach((c) => walk(c, f)); };

describe("the sections' photos", () => {
  it("about 40, each at 480 and 800 px, each at most 40 KB, each with its licence, source and alt (RULE AF, D6)", () => {
    const ids = Object.keys(SET);
    expect(ids.length).toBeGreaterThanOrEqual(35);
    for (const id of ids) {
      const p = SET[id];
      for (const f of p.srcset.split(", ").map((s) => s.split(" ")[0])) {
        const file = join(process.cwd(), "public", f);
        expect(existsSync(file), f).toBe(true);
        expect(statSync(file).size, `${f} weight`).toBeLessThanOrEqual(40 * 1024);
      }
      expect(p.licence, id).toMatch(/Pexels|Unsplash|CC0|Public Domain/i);
      expect(p.source, id).toMatch(/^https:\/\//);
      expect(p.alt.length, `${id} alt`).toBeGreaterThan(10);
    }
  });

  it("a designed section shows the photo with its size (nothing jumps as it loads) and alt; the wireframe never does", () => {
    const id = Object.keys(SET)[0];
    const def: SectionDef = { id: "t", name: "t", tree: { k: "section", c: [{ r: "image", photo: id }] } };
    let img: BoxNode | undefined;
    walk(buildSection(def, { finish: "plain", wireframe: false }), (n) => { if (n.type === "image") img = n; });
    expect(img?.src).toBe(SET[id].src);
    expect([img?.imgW, img?.imgH]).toEqual([SET[id].width, SET[id].height]);
    expect(img?.alt).toBe(SET[id].alt);
    walk(buildSection(def, { finish: "plain", wireframe: true }), (n) => { if (n.type === "image") img = n; });
    expect(img?.src || "", "a wireframe has a grey box").toBe("");
  });

  it("a photo behind words shows wherever the tree puts it — on the section or on a stack inside it (a slider's page)", () => {
    const id = Object.keys(SET)[0];
    for (const tree of [{ k: "section" as const, tone: "photo" as const, photo: id, c: [{ r: "title" as const, t: "Hi" }] },
                        { k: "section" as const, c: [{ k: "stack" as const, tone: "photo" as const, photo: id, c: [{ r: "title" as const, t: "Hi" }] }] }]) {
      let bg: string | undefined;
      walk(buildSection({ id: "t", name: "t", tree }, { finish: "calm", wireframe: false }), (n) => { if (n.bgImage) bg = n.bgImage; });
      expect(bg).toBe(SET[id].src);
    }
  });

  it("a downloaded site carries the photo as its own file, never a link back to the builder", async () => {
    const page = `<img src="/sections/a-800.webp" alt="x"><div style="background-image:url(&quot;/sections/a-800.webp&quot;)"></div>`;
    const blob = new Blob([new Uint8Array([82, 73, 70, 70])], { type: "image/webp" });
    const out = await inlineSectionPhotos({ "index.html": page, "styles.css": "" }, async () => blob);
    expect(out["index.html"]).not.toContain("/sections/");
    const { files, photos } = photosToFiles(out);
    expect(Object.keys(photos).length, "one file, used twice").toBe(1);
    expect(files["index.html"]).toMatch(/images\//);
  });

  it("a photo that cannot be fetched is left as it was, and the download goes on", async () => {
    const out = await inlineSectionPhotos({ "index.html": `<img src="/sections/a-800.webp">` }, async () => null);
    expect(out["index.html"]).toContain("/sections/a-800.webp");
  });
});
