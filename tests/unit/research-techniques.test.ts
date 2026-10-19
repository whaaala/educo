import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

/**
 * LE15-1 / LE15-2 (2026-10-19): the CodePen collector judged a tag "saturated" on motion and position keys only, so a
 * gallery tag would stop without ever seeing a grid, a masonry or a lightbox; and its list of techniques was written twice.
 * Now ONE list (`config/research.json`) names what a pen is made of, and saturation is judged on the same names.
 */
const require = createRequire(import.meta.url);
const root = resolve(__dirname, "../..");
const config = require("../../config/research.json") as { techniques: [string, string, string?][] };
const { how } = require("../../scripts/research/cp-how.js") as {
  how: (rec: { code: { html?: string; css?: string; js?: string } }) => { techniques: string[] };
};
const { penSig, saturation, listingStep, needsRead } = require("../../scripts/research/cp-tag.js") as {
  needsRead: (rec: object) => boolean;
  listingStep: (page: { links: number; fresh: number; noMore: boolean }, gaps: number) => "read" | "gap" | "end";
  penSig: (rec: object) => string[];
  saturation: () => { seed: (rs: object[]) => void; add: (r: object & { novel?: string[] }) => boolean };
};

const pen = (css: string, html = "", js = "") => ({ code: { html, css, js } });
const gallery = pen(
  ".g { display: grid; grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); } .g .wide { grid-column: span 2; } img { aspect-ratio: 4 / 3; object-fit: cover; }",
  '<div class="g"><img src="a.jpg" srcset="a-480.jpg 480w" loading="lazy" alt=""></div>',
  "GLightbox({ selector: '.g img' });",
);

describe("the research's techniques (LE15-1, LE15-2)", () => {
  it("every pattern compiles and no name is listed twice", () => {
    const names = config.techniques.map(([n]) => n);
    expect(new Set(names).size).toBe(names.length);
    for (const [, re, flags] of config.techniques) expect(() => new RegExp(re, flags)).not.toThrow();
  });

  it("a gallery pen is named by its layout and media techniques", () => {
    const t = how(gallery).techniques;
    for (const n of ["CSS grid", "auto-fit / auto-fill grid", "grid spans (bento)", "aspect-ratio", "object-fit", "srcset / sizes", "lazy loading", "lightbox library"]) expect(t).toContain(n);
    expect(t).not.toContain("multi-column masonry (columns)"); // grid-template-columns is not a masonry
  });

  it("a masonry by columns is told apart from a grid", () => {
    const t = how(pen(".m { columns: 3; column-gap: 1rem; }")).techniques;
    expect(t).toContain("multi-column masonry (columns)");
    expect(t).not.toContain("CSS grid");
    expect(how(pen(".m { column-gap: 1rem; }")).techniques).not.toContain("multi-column masonry (columns)");
  });

  it("saturation is judged on the techniques cp-how named", () => {
    const rec = { ...gallery, how: how(gallery) };
    const sig = penSig(rec);
    for (const n of rec.how.techniques) expect(sig).toContain("how:" + n);
    const sat = saturation();
    sat.seed([rec]);
    const same: { novel?: string[] } & typeof rec = { ...gallery, how: how(gallery) };
    sat.add(same);
    expect(same.novel).toEqual([]);
    const masonry = pen(".m { columns: 3 }");
    const other: { novel?: string[] } & typeof rec = { ...masonry, how: how(masonry) };
    sat.add(other);
    expect(other.novel).toContain("how:multi-column masonry (columns)");
  });

  it("neither script holds its own list of technique patterns", () => {
    for (const f of ["scripts/research/cp-tag.js", "scripts/research/cp-how.js"]) {
      const src = readFileSync(resolve(root, f), "utf8").replace(/\r\n/g, "\n");
      expect(src).not.toMatch(/const TECH = [[{]/);
      expect(src).toContain("config/research.json");
    }
  });

  it("a page that loads no pens is a gap, not the end (LE15-3)", () => {
    expect(listingStep({ links: 0, fresh: 0, noMore: false }, 0)).toBe("gap");
    expect(listingStep({ links: 0, fresh: 0, noMore: false }, 2)).toBe("gap"); // LE15-20: three empty pages were CodePen throttling, not the end
    expect(listingStep({ links: 0, fresh: 0, noMore: false }, 4)).toBe("end");
    expect(listingStep({ links: 0, fresh: 0, noMore: false }, 3)).toBe("gap");
    expect(listingStep({ links: 0, fresh: 0, noMore: true }, 0)).toBe("end");
    expect(listingStep({ links: 6, fresh: 0, noMore: false }, 0)).toBe("gap"); // LE15-24: a page of repeats is throttling too
    expect(listingStep({ links: 6, fresh: 0, noMore: false }, 4)).toBe("end");
    expect(listingStep({ links: 6, fresh: 6, noMore: false }, 2)).toBe("read");
  });

  it("a pen with no code saved, no preview or an error is read again (LE15-4, LE15-5)", () => {
    const code = { html: "<p>", css: "", js: "" };
    expect(needsRead({ code: { html: "", css: "", js: "" } })).toBe(true);
    expect(needsRead({})).toBe(true);
    expect(needsRead({ code, noPreview: true })).toBe(true);
    expect(needsRead({ code, err: "timeout" })).toBe(true);
    expect(needsRead({ code })).toBe(false);
  });

  it("the code fetch keeps its status and retries", () => {
    const src = readFileSync(resolve(root, "scripts/research/cp-tag.js"), "utf8").replace(/\r\n/g, "\n");
    expect(src).toMatch(/codeStatus/);
    expect(src).toContain("filter(r => !needsRead(r))");
  });
});
