import { describe, it, expect } from "vitest";
import { pictureTarget, createElement, createContainer } from "@/lib/box-model";
import INSPECTOR from "../../config/inspector.json";

/**
 * WHICH PICTURE "REPLACE PICTURE" CHANGES (BATCH LE-15k LE15k-4 — box-builder-spacing.feature, "A selected <block> offers
 * 'Replace picture' by name", "A block with no photo offers no 'Replace picture'").
 *
 * Measured through the UI, 2026-10-20: the School home's hero photo is the SECTION's background, and with the section selected
 * nothing on the canvas could replace it — only the Inspector's Background → "Replace with an upload", far down the panel (the
 * trap Webflow has too, spacing-overlay.md axis 12). The toolbar now names it; this is the one decision behind it.
 */
describe("pictureTarget", () => {
  it("a picture block replaces its own photo, empty or not", () => {
    expect(pictureTarget(createElement("image"))).toBe("src");
    expect(pictureTarget({ ...createElement("image"), src: "data:image/png;base64,AA" })).toBe("src");
  });
  it("a block whose background is a photo replaces the background", () => {
    const band = createContainer("column");
    expect(pictureTarget({ ...band, bgImage: "https://images.example/hero.jpg" })).toBe("bgImage");
    expect(pictureTarget({ ...band, bgImage: "data:image/jpeg;base64,AA" })).toBe("bgImage");
    expect(pictureTarget({ ...band, bgImage: "/sections/school-front-800.webp" })).toBe("bgImage"); // the library's own photos (the hero's)
  });
  it("a colour, a gradient, a pattern or nothing offers no Replace picture", () => {
    const band = createContainer("column");
    expect(pictureTarget(band)).toBeNull();
    expect(pictureTarget({ ...band, background: "oklch(0.6 0.1 250)" })).toBeNull();
    expect(pictureTarget({ ...band, bgImage: "linear-gradient(red, blue)" })).toBeNull();
    expect(pictureTarget({ ...band, bgImage: "url('data:image/svg+xml;utf8,<svg/>')", bgTile: "24px" })).toBeNull();
    expect(pictureTarget(createElement("heading"))).toBeNull();
  });
  it("the words come from configuration (RULE CFG)", () => {
    for (const k of ["editText", "replacePicture", "addPicture", "typeHere"] as const) expect(INSPECTOR.selection[k]).toBeTruthy();
  });
});
