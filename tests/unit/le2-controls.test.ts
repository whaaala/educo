import { describe, it, expect } from "vitest";
import type { BoxNode } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { perScreenBanner, perScreenDeviceTab, reachWords, SHARED_KEYS } from "@/lib/per-screen-note";
import LAYOUT from "../../config/layout.json";

/** BATCH LE-2 · controls that tell the truth. Scenarios: tests/features/components/website/box-builder-responsive.feature. */
const page = (kids: BoxNode[]) => {
  const root = { id: "root", type: "container", direction: "column", children: kids } as BoxNode;
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};
const block = (kind: string, id: string, extra: Partial<BoxNode>) => ({ ...blockForKind(kind, { id } as Partial<BoxNode>), ...extra }) as BoxNode;
const em = (r: keyof typeof LAYOUT.rungs) => LAYOUT.rungs[r].from / 16;

describe("LE2-1 · a look set at one screen is PUBLISHED at that screen", () => {
  const html = page([
    block("text", "t1", { text: "Words", responsive: { phone: { color: "#c00000", fontSize: 40 } } }),
    block("button", "b1", { text: "Go", responsive: { phone: { background: "#007a00" } } }),
    block("heading", "h1", { text: "Title", responsive: { tabletLandscape: { color: "#0000aa" } } }),
    block("text", "t2", { text: "Plain" }),
  ]);
  it("a phone colour and size: one rule, limited to phones, that beats the inline desktop value", () => {
    const m = new RegExp(`@media \\(max-width:${(em("tabletPortrait") - 0.001).toFixed(3)}em\\)\\{\\.bx-t1>:first-child\\{([^}]*)\\}`).exec(html);
    expect(m, "no phone rule for the Text").not.toBeNull();
    expect(m![1]).toMatch(/color:#c00000!important/);
    expect(m![1]).toMatch(/font-size:[^;]+!important/);
  });
  it("a Button's background at phone", () => {
    expect(html).toMatch(/\.bx-b1>:first-child\{[^}]*background:[^;}]*!important/);
  });
  it("a tablet-landscape colour reaches the tablets and the phone, not the desktop", () => {
    const m = new RegExp(`@media \\(max-width:${(em("desktop") - 0.001).toFixed(3)}em\\)\\{\\.bx-h1>:first-child\\{color:#0000aa!important\\}`).exec(html);
    expect(m, "the heading's colour is not limited to below the desktop").not.toBeNull();
  });
  it("a block with nothing set per screen ships nothing extra", () => {
    expect(html).not.toMatch(/\.bx-t2>:first-child/);
  });
});

describe("V-5 · the per-device banner says what is true", () => {
  it("names every look, not only size and layout", () => {
    const t = perScreenBanner("phone", "Phone").text;
    expect(t).not.toMatch(/only change here/);
    for (const w of ["size", "spacing", "colours", "fonts", "backgrounds"]) expect(t).toContain(w);
  });
  it("says which screens a change reaches — a tablet change shows on phones too; a big desktop's on wide screens only", () => {
    expect(reachWords("phone")).toBe(LAYOUT.rungs.phone.words);
    expect(reachWords("tabletPortrait")).toContain(LAYOUT.rungs.tabletPortrait.words);
    expect(reachWords("tabletPortrait")).toContain(LAYOUT.rungs.phone.words);
    expect(reachWords("tabletLandscape")).toContain(LAYOUT.rungs.tabletPortrait.words);
    expect(reachWords("wide")).toBe(LAYOUT.rungs.wide.words);
    expect(perScreenDeviceTab("tabletPortrait", "Tablet portrait")).toContain(LAYOUT.rungs.phone.words);
  });
  it("reads as one plain sentence — one \"unless\", never two (LE2-8)", () => {
    for (const bp of ["phone", "tabletPortrait", "tabletLandscape", "wide"] as const) expect((perScreenBanner(bp, "X").text.match(/unless/g) ?? []).length).toBeLessThanOrEqual(1);
  });
  it("says what stays the same everywhere", () => {
    expect(perScreenBanner("phone", "Phone").shared).toMatch(/words.*links.*pictures.*effects/i);
  });
});

describe("LE2-4 · an effect is stored for every screen, because it is published for every screen", () => {
  it("Hover, Entrance and the arrival are shared, beside the words, links and pictures", () => {
    for (const k of ["text", "href", "src", "hoverEffect", "revealEffect", "pinArrival", "pinArrivalAfter"]) expect(SHARED_KEYS.has(k), k).toBe(true);
    for (const k of ["color", "background", "fontSize", "padding"]) expect(SHARED_KEYS.has(k), k).toBe(false);
  });
});
