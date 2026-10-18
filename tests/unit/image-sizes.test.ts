import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { addSrcset, sizesFromWidths, sizesScreens, PHOTO_WIDTHS } from "@/lib/box-export";
import LAYOUT from "@/config/layout.json";

/**
 * AC-22 · each picture sent at the size each screen shows it (BATCH LE-5). Scenarios: tests/features/unit/image-sizes.feature.
 * The measuring itself needs a real layout, so it is driven in the HEADED pass (scripts/uat/uat-le5-headed.js); this guards the
 * pure halves: which screens are measured, how the widths become `sizes`, and that each picture gets its own.
 */
const R = LAYOUT.rungs;
const em = (px: number) => `${+((px - 1) / 16).toFixed(4)}em`;

describe("the copy widths and the measured screens are configuration (LE5-1)", () => {
  it("PHOTO_WIDTHS is config/layout.json media.photoWidths", () => {
    expect(PHOTO_WIDTHS).toEqual(LAYOUT.media.photoWidths);
  });
  it("neither list is typed into the export", () => {
    const src = readFileSync("lib/box-export.ts", "utf8").replace(/\r\n/g, "\n"); // LE5-16: a CRLF checkout reads the same
    expect(src).not.toMatch(/PHOTO_WIDTHS[^=\n]*=\s*\[/); // LE5-2: past a type annotation too
    expect(src).not.toMatch(/\b2560\b/);
  });
  it("every rung is measured at both its edges, from the narrowest phone to sizesWideTo", () => {
    expect(sizesScreens()).toEqual([
      [LAYOUT.narrowestPhone, R.tabletPortrait.from - 1],
      [R.tabletPortrait.from, R.tabletLandscape.from - 1],
      [R.tabletLandscape.from, R.desktop.from - 1],
      [R.desktop.from, R.wide.from - 1],
      [R.wide.from, LAYOUT.media.sizesWideTo],
    ]);
  });
});

describe("sizesFromWidths — measured widths become sizes", () => {
  const rungs = (...shares: number[]) => sizesScreens().map(([, to], i, all) => ({ below: i < all.length - 1 ? to + 1 : null, share: shares[i] }));

  it("the whole window everywhere is said once", () => {
    expect(sizesFromWidths(rungs(1, 1, 1, 1, 1))).toBe("100vw");
  });
  it("a third of the row from the tablet held sideways: 100vw up to that line, a third rounded UP after", () => {
    expect(sizesFromWidths(rungs(1, 1, 0.3301, 0.3301, 0.3301))).toBe(`(max-width: ${em(R.tabletLandscape.from)}) 100vw, 34vw`);
  });
  it("conditions are max-width in em (old Android WebView reads them), never range syntax", () => {
    const s = sizesFromWidths(rungs(1, 0.5, 0.5, 0.25, 0.2));
    expect(s).not.toMatch(/width\s*[<>]/);
    expect(s).toBe(`(max-width: ${em(R.tabletPortrait.from)}) 100vw, (max-width: ${em(R.desktop.from)}) 50vw, (max-width: ${em(R.wide.from)}) 25vw, 20vw`);
  });
  it("neighbouring rungs that agree are one condition", () => {
    expect(sizesFromWidths(rungs(1, 0.5, 0.5, 0.5, 0.5))).toBe(`(max-width: ${em(R.tabletPortrait.from)}) 100vw, 50vw`);
  });
  it("held by the content width on wide screens: the last entry is rem", () => {
    expect(sizesFromWidths(rungs(1, 1, 0.5, 0.4, 0.3), 400)).toBe(`(max-width: ${em(R.tabletLandscape.from)}) 100vw, (max-width: ${em(R.desktop.from)}) 50vw, (max-width: ${em(R.wide.from)}) 40vw, 25rem`);
  });
  it("hidden on phones asks for the smallest copy there, never 0 and never the window", () => {
    expect(sizesFromWidths(rungs(0, 1, 1, 1, 1))).toBe(`(max-width: ${em(R.tabletPortrait.from)}) 1vw, 100vw`);
  });
  it("hidden on EVERY screen (a closed accordion's picture, shown once opened) keeps the window, not the smallest copy", () => {
    expect(sizesFromWidths(rungs(0, 0, 0, 0, 0))).toBe("100vw");
  });
  it("is able to fail: different widths are never collapsed into one", () => {
    expect(sizesFromWidths(rungs(1, 1, 1, 1, 0.5))).not.toBe("100vw");
  });
});

describe("addSrcset — each picture gets its own measured sizes", () => {
  const copies = { "images/x.jpg": [{ w: 480, file: "images/x-480.jpg" }, { w: 1600, file: "images/x.jpg" }] };
  const html = `<img src="images/x.jpg" alt="a" /><p></p><img src="images/x.jpg" alt="b" loading="lazy" />`;

  it("in page order, the lazy one with auto first", () => {
    const out = addSrcset({ "index.html": html }, copies, { "index.html": ["100vw", "34vw"] })["index.html"];
    expect(out).toMatch(/alt="a"/);
    expect(out.match(/sizes="[^"]+"/g)).toEqual([`sizes="100vw"`, `sizes="auto, 34vw"`]);
  });
  it("a picture the measuring could not lay out keeps the window", () => {
    const out = addSrcset({ "index.html": html }, copies, { "index.html": [null] })["index.html"];
    expect(out.match(/sizes="[^"]+"/g)).toEqual([`sizes="100vw"`, `sizes="auto, 100vw"`]);
  });
  it("an <img> that is not one of the photos does not shift the count", () => {
    const mixed = `<img src="logo.svg" alt="" /><img src="images/x.jpg" alt="a" />`;
    const out = addSrcset({ "index.html": mixed }, copies, { "index.html": ["50vw"] })["index.html"];
    expect(out).toContain(`sizes="50vw"`);
  });
});
