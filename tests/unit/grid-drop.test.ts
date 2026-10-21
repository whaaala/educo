import { describe, it, expect } from "vitest";
import { wholeColumns } from "@/lib/page-grid";
import { createContainer, makeRowBand, snapBandToColumns, fitBand, findBox, spanAt, linesAt, setLinesAt, placeOnColumns, type BoxNode } from "@/lib/box-model";

/** BATCH LE-15o — tests/features/components/website/grid-drop.feature: a line of a stack shared out in whole columns. */
describe("wholeColumns — shares become whole columns that fill the line", () => {
  it("halves and thirds land on whole columns", () => {
    expect(wholeColumns([50, 50], 12)).toEqual([6, 6]);
    expect(wholeColumns([33.33, 33.33, 33.33], 12)).toEqual([4, 4, 4]);
  });
  it("uneven shares keep their order of size and always sum to the columns", () => {
    const c = wholeColumns([37, 21, 42], 12)!;
    expect(c.reduce((s, n) => s + n, 0)).toBe(12);
    expect(c).toEqual([4, 3, 5]);
  });
  it("never below a block's least columns; null when the floors cannot fit", () => {
    expect(wholeColumns([90, 10], 12, [0, 3])).toEqual([9, 3]);
    expect(wholeColumns([50, 50], 12, [7, 7])).toBeNull();
  });
  it("every block has at least one column", () => {
    expect(wholeColumns([98, 1, 1], 12)!.every((n) => n >= 1)).toBe(true);
  });
});

describe("LE-15o (5) · a block on a stack's line has columns and lines, as a column of a page row has", () => {
  const line = (widths: string[], gaps: (number | undefined)[] = []) => {
    const band = { ...makeRowBand(widths.map((w, i) => ({ ...createContainer("column", { id: `k${i}` } as Partial<BoxNode>), width: w, ...(gaps[i] ? { marginLeftPct: gaps[i] } : {}) }))), id: "band" };
    const section = { ...createContainer("column", { id: "section" } as Partial<BoxNode>), children: [band] };
    return { ...createContainer("column", { id: "root" } as Partial<BoxNode>), children: [{ ...makeRowBand([section]), id: "pageBand" }] } as BoxNode;
  };
  it("its span in columns of twelve, on a page with no page grid", () => {
    expect(spanAt(line(["33.33%", "66.66%"]), "k1", 12)).toBe(8);
  });
  it("its lines, with the empty columns before it", () => {
    expect(linesAt(line(["25%", "50%"], [undefined, 25]), "k1", 12, "base", true)).toEqual({ from: 7, to: 13, first: false, last: true });
  });
  it("From line moves its left edge — starting its line, the space before it gives way, nothing else moves", () => {
    const t = setLinesAt(line(["25%", "50%"], [25]), "k0", { from: 2 }, 12);
    expect(findBox(t, "k0")).toMatchObject({ width: "41.67%", marginLeftPct: 8.33 });
    expect(findBox(t, "k1")!.width).toBe("50%");
  });
  it("the page-only lines (bleed, free inside) stay on rows of the page: linesAt without anyLine is null here", () => {
    expect(linesAt(line(["50%", "50%"]), "k0", 12)).toBeNull();
  });
});

describe("LE-15o (4) · Shift puts a block in an exact spot: the columns under the pointer, nothing else moves", () => {
  const page = (widths: string[], gaps: (number | undefined)[] = []) => {
    const band = { ...makeRowBand(widths.map((w, i) => ({ ...createContainer("column", { id: `k${i}` } as Partial<BoxNode>), width: w, ...(gaps[i] ? { marginLeftPct: gaps[i] } : {}) }))), id: "band" };
    const loose = { ...makeRowBand([{ ...createContainer("column", { id: "c" } as Partial<BoxNode>), width: "100%" }]), id: "looseBand" };
    return { ...createContainer("column", { id: "root" } as Partial<BoxNode>), children: [band, loose] } as BoxNode;
  };
  const kids = (t: BoxNode) => findBox(t, "band")!.children!.map((k) => [k.id, k.width, k.marginLeftPct ?? 0]);
  it("into the empty middle of a line: its own columns, the empty columns before it kept, the next block where it was", () => {
    // [ k0 3 | · · · · · · | k1 3 ] → c takes columns 5–8 (from line 5, 4 of 12)
    const t = placeOnColumns(page(["25%", "25%"], [undefined, 50]), "band", "c", 4, 4, 12, "k0")!;
    expect(kids(t)).toEqual([["k0", "25%", 0], ["c", "33.33%", 8.33], ["k1", "25%", 8.33]]);
  });
  it("null where the columns are taken — the drop is then the ordinary one", () => {
    expect(placeOnColumns(page(["50%", "50%"]), "band", "c", 4, 4, 12, "k0")).toBeNull();
    expect(placeOnColumns(page(["25%"]), "band", "c", 10, 4, 12, "k0")).toBeNull(); // past the line's end
  });
});

describe("snapBandToColumns — the line a block joins is shared out in whole columns of the stack", () => {
  const box = (id: string, width: string) => ({ ...createContainer("column", { id } as Partial<BoxNode>), width });
  const tree = (widths: string[]) => {
    const band = { ...makeRowBand(widths.map((w, i) => box(`k${i}`, w))), id: "band" };
    return { ...createContainer("column", { id: "stack" } as Partial<BoxNode>), children: [band] } as BoxNode;
  };
  const widths = (t: BoxNode) => findBox(t, "band")!.children!.map((k) => k.width);

  it("three blocks sharing a line proportionally become 4 of 12 each", () => {
    expect(widths(snapBandToColumns(tree(["33.33%", "33.33%", "33.34%"]), "band", "k2", 12))).toEqual(["33.33%", "33.33%", "33.33%"]);
  });
  it("a share of 37 % beside 63 % lands on 4 | 8", () => {
    expect(widths(snapBandToColumns(tree(["37%", "63%"]), "band", "k0", 12))).toEqual(["33.33%", "66.66%"]);
  });
  it("with a gap between blocks the columns share what the gaps leave", () => {
    expect(widths(snapBandToColumns(tree(["50%", "50%"]), "band", "k1", 12, undefined, 2))).toEqual(["49%", "49%"]);
  });
  it("LE15o-a · equal blocks on a full line stay equal — five cards are 20 % each, never 3 · 3 · 2 · 2 · 2 (the user's \"equal cards\", G3b-3)", () => {
    const t = tree(["20%", "20%", "20%", "20%", "20%"]);
    expect(snapBandToColumns(t, "band", "k4", 12)).toBe(t);
    expect(widths(snapBandToColumns(tree(["25%", "25%", "25%", "24.99%"]), "band", "k3", 12))).toEqual(["25%", "25%", "25%", "25%"]);
  });
  it("a line holding a Fit block is left as it is", () => {
    const t = tree(["50%", "auto"]);
    expect(snapBandToColumns(t, "band", "k0", 12)).toBe(t);
  });
  it("a line with room left keeps its empty columns: 50 % alone stays 6 of 12, 45 % (5.4 columns) snaps to 5 of 12", () => {
    expect(widths(snapBandToColumns(tree(["50%"]), "band", "k0", 12))).toEqual(["50%"]);
    expect(widths(snapBandToColumns(tree(["45%"]), "band", "k0", 12))).toEqual(["41.66%"]);
    expect(widths(snapBandToColumns(tree(["40%", "30%"]), "band", "k1", 12))).toEqual(["41.66%", "33.33%"]);
  });
  it("LE15o-b · ADDING a block (fitBand with the columns, every add route) shares its line in whole columns — 3 · 3 · 6 of 12 → 4 · 4 · 4, a 37 % newcomer beside 63 % → 4 · 8", () => {
    const t = tree(["25%", "25%", "50%", "100%"]); // the fourth, full width, is the newcomer on a full line
    const w = widths(fitBand(t, "band", "k3", undefined, 0, 12));
    expect(w.map((x) => Math.round((parseFloat(String(x)) / (100 / 12)) * 100) / 100).every((n) => Number.isInteger(n)), `whole columns: ${w}`).toBe(true);
    expect(widths(fitBand(tree(["63%", "37%"]), "band", "k1", undefined, 0, 12))).toEqual(["66.66%", "33.33%"]);
  });
  it("only the line the block joins: a block on another line keeps its width", () => {
    const t = tree(["50%", "50%", "37%"]); // the third wraps to its own line
    expect(widths(snapBandToColumns(t, "band", "k0", 12))).toEqual(["50%", "50%", "37%"]);
  });
});
