import { describe, it, expect } from "vitest";
import { textLen, u, t } from "@/lib/box-model";

/**
 * #107 — measured on a dressed page at 375px: a card title set to 22 drew at 15.4px (smaller than the 16px body beside it),
 * a quote's "— Happy Customer" at 9.8px. Explicit text sizes were written in the SPACING unit (--box-u, 0.7× on a phone,
 * no floor). A text length has a rem floor: a size ≤ 16 never shrinks below itself; a larger one keeps at least half of
 * what it has above 16 — so a heading stays bigger than body text on every screen.
 * Behaviours: tests/features/components/website/box-builder-design.feature ("A size I give text never shrinks…").
 */
const floorRem = (css: string) => parseFloat((css.match(/^max\(([\d.]+)rem, /) ?? ["", "NaN"])[1]);

describe("textLen — a text size with a readable floor", () => {
  it("is the fluid size, never below a floor in rem (so the reader's own text size still counts)", () => {
    expect(textLen(22)).toBe(`max(${19 / 16}rem, ${t(22)})`); // the TYPE unit, fixed at the page (#133, decided 2026-09-28)
  });
  it.each([[14, 14], [16, 16], [12, 12], [22, 19], [32, 24], [44, 30], [52, 34]])("a size of %i never draws below %ipx", (px, floor) => {
    expect(floorRem(textLen(px)) * 16).toBeCloseTo(floor, 3);
  });
  it("the floor keeps order: a bigger size always has a bigger (or equal) floor — hierarchy survives on a phone", () => {
    let last = 0; for (let px = 8; px <= 96; px++) { const f = floorRem(textLen(px)); expect(f).toBeGreaterThanOrEqual(last); last = f; }
  });
  it("a heading of 18 or more is never floored below the 16px body text", () => {
    for (let px = 18; px <= 96; px++) expect(floorRem(textLen(px)) * 16).toBeGreaterThanOrEqual(16);
  });
});

describe("…and it is what the published page uses", () => {
  it("a heading and a caption with sizes carry their floors; an icon's size is not text and does not", async () => {
    const { createContainer, createElement } = await import("@/lib/box-model");
    const { siteFromRoot } = await import("@/lib/box-site"); const { renderSitePage } = await import("@/lib/box-export"); const { DEFAULT_THEME } = await import("@/lib/site-storage");
    const root = createContainer("column", { id: "page", children: [createElement("heading", { text: "Card title", fontSize: 22 }), createElement("text", { text: "— Happy Customer", fontSize: 14 }), createElement("icon", { icon: "Star", fontSize: 24 })] });
    const site = siteFromRoot(root, "P"); const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    expect(html).toContain(`font-size:${textLen(22)}`);
    expect(html).toContain(`font-size:${textLen(14)}`);
    expect(html).toContain(`font-size:${u(24)}`);
  });
});
