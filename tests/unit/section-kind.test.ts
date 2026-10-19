import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * LE-15 research: the crawl knew every band's SHAPE, not its KIND. `sectionKind` names it from the features
 * `extract.js` measures per band; its words and counts are in `config/research.json` (RULE CFG).
 */
const require = createRequire(import.meta.url);
type Feat = Partial<{
  tag: string; cls: string; heads: string[]; h: number; words: number; links: number; nav: number; h1: number;
  smallHeads: number; img: number; smallImg: number; fields: number; email: number; textarea: number;
  details: number; quote: number; prices: number; numbers: number; buttons: number; video: number;
}>;
const { sectionKind, KINDS, deepen } = require("../../scripts/research/section-kind.js") as {
  deepen: <T>(bands: T[], acc: { kids: (b: T) => T[]; height: (b: T) => number; stacked: (k: T[]) => boolean; vh: number; minPx?: number }, depth?: number) => T[];
  sectionKind: (f: Feat, i: number, n: number, prevKind?: string) => string;
  KINDS: string[];
};
const config = require("../../config/research.json") as { sectionKinds: { words: Record<string, string[]> } };

const mid = (f: Feat) => sectionKind({ h: 700, words: 30, ...f }, 3, 8, "features");

describe("the kind of a section (LE-15)", () => {
  it("the class a site gave a band names its kind first", () => {
    expect(mid({ cls: "pricing-section dark" })).toBe("pricing");
    expect(mid({ cls: "sec temoignages" })).toBe("testimonials");
    expect(mid({ cls: "sec features-grid" })).toBe("features");
    expect(mid({ cls: "workshop" })).not.toBe("gallery"); // "work" only at a boundary
  });

  it("a utility class is never read as a kind (LE15-9)", () => {
    expect(mid({ cls: "relative pointer-events-none after:pointer-events-none" })).not.toBe("events");
    expect(mid({ cls: "md:text-contact-600 hover:bg-hero" })).toBe("other");
    expect(mid({ cls: "wrap events-list" })).toBe("events");
  });

  it("the kind is read from what the band holds", () => {
    expect(mid({ prices: 2 })).toBe("pricing");
    expect(mid({ details: 2 })).toBe("faq");
    // LE15-6: a menu's disclosure buttons are not an accordion — the page counts only those outside the navigation
    const extractSrc = readFileSync(resolve(__dirname, "../../scripts/research/extract.js"), "utf8").replace(/\r\n/g, "\n");
    expect(extractSrc).toContain("!e.closest('nav, header, [role=navigation]')");
    expect(extractSrc).toContain("!/menu|nav|burger/i.test(");
    expect(mid({ quote: 1, words: 60 })).toBe("testimonials");
    expect(mid({ email: 1, fields: 1 })).toBe("newsletter");
    expect(mid({ fields: 3 })).toBe("contact");
    expect(mid({ textarea: 1, fields: 2 })).toBe("contact");
    expect(mid({ smallImg: 4, img: 4, words: 10 })).toBe("logos");
    expect(mid({ numbers: 3, words: 30 })).toBe("stats");
    expect(mid({ img: 6, words: 20 })).toBe("gallery");
    expect(mid({ img: 6, words: 300 })).not.toBe("gallery");
  });

  it("where a band sits counts", () => {
    expect(sectionKind({ h: 90, nav: 1, links: 6 }, 0, 8)).toBe("header");
    expect(sectionKind({ h: 900, nav: 1, h1: 1 }, 0, 8)).not.toBe("header");
    expect(sectionKind({ h: 78, nav: 1, links: 5, words: 15 }, 3, 8)).toBe("header"); // LE15-11
    expect(sectionKind({ tag: "footer", h: 300 }, 5, 8)).toBe("footer");
    expect(sectionKind({ h: 300, links: 8 }, 7, 8)).toBe("footer");
    expect(sectionKind({ h: 300, links: 8 }, 4, 8)).not.toBe("footer");
    expect(sectionKind({ h: 800, h1: 1, words: 20 }, 1, 8, "header")).toBe("hero");
    expect(sectionKind({ h: 800, h1: 1, words: 20 }, 0, 8)).toBe("hero");
  });

  it("what is left is still named", () => {
    expect(mid({ h: 300, heads: ["Ready?"], buttons: 1, words: 12 })).toBe("cta");
    expect(mid({ smallHeads: 3, words: 90 })).toBe("features");
    expect(mid({ img: 1, words: 25 })).toBe("media");
    expect(mid({ img: 1, words: 0 })).toBe("image"); // LE15-13
    expect(mid({ img: 2, words: 8 })).toBe("image");
    expect(mid({ words: 60 })).toBe("text");
    expect(mid({ words: 5 })).toBe("other");
    expect(mid({ words: 0, img: 0 })).toBe("decor");
    expect(sectionKind({ h: 700, words: 0, img: 0, video: 1 }, 3, 8)).not.toBe("decor");
  });

  it("every kind has its words, in more than one language", () => {
    const w = config.sectionKinds.words;
    for (const k of KINDS.filter((k) => !["text", "other", "decor", "image"].includes(k))) expect(w[k]?.length, k).toBeGreaterThan(0);
    expect(w.hero).toEqual(expect.arrayContaining(["accueil", "portada"]));
    expect(w.pricing).toEqual(expect.arrayContaining(["tarifs", "precios"]));
    expect(w.faq).toEqual(expect.arrayContaining(["preguntas"]));
    expect(w.team).toEqual(expect.arrayContaining(["equipe", "equipo"]));
    expect(w.contact).toEqual(expect.arrayContaining(["contactez", "contacto"]));
    expect(w.footer).toEqual(expect.arrayContaining(["pied-de-page", "pie-de-pagina"]));
    expect(w.features).toEqual(expect.arrayContaining(["avantages", "servicios"]));
  });

  it("a tall wrapper of stacked children is split into real sections (LE15-8)", () => {
    type N = { id: string; h: number; side?: boolean; kids: N[] };
    const n = (id: string, h: number, kids: N[] = [], side = false): N => ({ id, h, kids, side });
    const acc = { kids: (b: N) => b.kids, height: (b: N) => b.h, stacked: (k: N[]) => !k.some((x) => x.side), vh: 900 };
    const page = [n("header", 80), n("wrap", 3000, [n("hero", 900), n("inner", 1600, [n("features", 800), n("pricing", 800)]), n("cta", 500)]), n("footer", 300)];
    expect(deepen(page, acc).map((b) => b.id)).toEqual(["header", "hero", "features", "pricing", "cta", "footer"]);
    // LE15-10: one row among stacked children — the wrapper is still split
    const lines = (k: N[]) => (k.every((x) => x.side) ? 1 : k.length);
    const acc2 = { ...acc, stacked: (k: N[]) => lines(k) > 1 };
    const mixed = [n("wrap", 7000, [n("hero", 900), n("pair", 600, [], true), n("pair2", 600, [], true), n("cta", 500)])];
    expect(deepen(mixed, acc2).map((b) => b.id)).toEqual(["hero", "pair", "pair2", "cta"]);
    const extract = readFileSync(resolve(__dirname, "../../scripts/research/extract.js"), "utf8").replace(/\r\n/g, "\n");
    expect(extract).toContain("stacked: (k) => lines(k).out.length > 1");
    expect(readFileSync(resolve(__dirname, "../../scripts/research/section-kinds.js"), "utf8").replace(/\r\n/g, "\n")).toContain("sectionMinPx");
    const row = [n("split", 2000, [n("left", 2000, [], true), n("right", 2000, [], true)])];
    expect(deepen(row, acc).map((b) => b.id)).toEqual(["split"]);
    // LE15-12: a tall column of 26px paragraphs is NOT cut into slivers
    const column = [n("article", 3000, Array.from({ length: 60 }, (_, i) => n("p" + i, 26)))];
    expect(deepen(column, { ...acc, minPx: 150 }).map((b) => b.id)).toEqual(["article"]);
    const deep = (d: number): N => (d ? n("w" + d, 3000, [deep(d - 1), n("x" + d, 100)]) : n("core", 3000, [n("a", 1500), n("b", 1500)]));
    expect(deepen([deep(6)], acc).map((b) => b.id)).toContain("w2");
  });

  it("an archived page that cannot be measured is measured live (LE15-14)", () => {
    const src = readFileSync(resolve(__dirname, "../../scripts/research/section-kinds.js"), "utf8").replace(/\r\n/g, "\n");
    expect(src).toContain("waitForSelector('body', { state: 'attached'"); // LE15-15: a body hidden during an intro is still a body
    expect(src).toContain("ARCHIVE FAILED");
  });
});
