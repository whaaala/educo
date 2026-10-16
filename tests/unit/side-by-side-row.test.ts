import { describe, it, expect } from "vitest";
import type { BoxNode } from "@/lib/box-model";
import { createContainer, findBox, fitBand, insertBox, makeRowBand, normalizeRowBands, widthPct } from "@/lib/box-model";

/**
 * E2-22 — A "SIDE BY SIDE" IS A ROW. Its blocks share one line, like a band's; `normalizeRowBands` took it for a stack and gave every
 * block it was handed a full-width band of its own, so an edge between two columns found no partner (measured through the UI: a
 * right edge +120 moved nothing, and back −120 opened a 121px hole). Behaviours: tests/features/components/website/box-builder-columns.feature.
 */
const column = (width = "100%"): BoxNode => createContainer("column", { width });
const sideBySide = (kids: BoxNode[]): BoxNode => ({ ...createContainer("row", { width: "100%" }), children: kids });
const page = (inner: BoxNode): BoxNode => ({ ...createContainer("column"), children: [makeRowBand([inner])] });
const sbsOf = (root: BoxNode) => root.children![0].children![0];

describe("E2-22 — the blocks of a Side by side stay its own, on one line", () => {
  it("two blocks added inside it are its direct children, not each in a band", () => {
    const a = column(), b = column();
    const kids = sbsOf(normalizeRowBands(page(sideBySide([a, b])))).children!;
    expect(kids.map((k) => k.id)).toEqual([a.id, b.id]);
    expect(kids.some((k) => k.rowBand)).toBe(false);
  });
  it("…and a block ADDED to it shares the line (`fitBand`): 100 → 50 + 50 → thirds", () => {
    let root = page(sideBySide([]));
    const sbs = sbsOf(root).id;
    for (let n = 1; n <= 3; n++) {
      const b = column();
      root = fitBand(insertBox(root, sbs, n - 1, b), sbs, b.id);
      const kids = findBox(root, sbs)!.children!;
      expect(kids.reduce((s, k) => s + widthPct(k.width), 0)).toBeLessThanOrEqual(100.001);
      expect(Math.max(...kids.map((k) => widthPct(k.width))) - Math.min(...kids.map((k) => widthPct(k.width)))).toBeLessThan(0.02);
    }
  });
  it("normalising twice changes nothing (idempotent)", () => {
    const once = normalizeRowBands(page(sideBySide([column(), column()])));
    expect(normalizeRowBands(once)).toEqual(once);
  });
  it("a SAVED Side by side whose blocks are already in bands is kept exactly as it is", () => {
    const saved = page(sideBySide([makeRowBand([column()]), makeRowBand([column()])]));
    expect(normalizeRowBands(saved)).toEqual(saved);
  });
  it("a component's own row (a preset) is left as it is built", () => {
    const rating = { ...sideBySide([column(), column()]), preset: "rating" } as BoxNode;
    const kids = sbsOf(normalizeRowBands(page(rating))).children!;
    expect(kids.every((k) => k.rowBand)).toBe(true);
  });
});
