import { describe, it, expect } from "vitest";
import { childStyle, createContainer, makeRowBand, normalizeRowBands, bandHoldsChosenSpace, type BoxNode } from "@/lib/box-model";
import { COMPONENT_CATALOGUE } from "@/lib/component-catalogue";
import { HUGS_BY_NATURE } from "@/lib/educo-ui/registry";

/**
 * BATCH F-1 — THE PAGE USES ITS SPACE (the user, 2026-10-01: "the component needs to be used width and height everywhere…
 * unless it's the space a user wanted"). Both halves ENUMERATE what exists, so a component or a column added later is held
 * to the rule the day it appears, instead of relying on someone remembering to write a test for it.
 */
const grows = (flex: unknown) => String(flex).split(" ")[0] === "1";
const fillsLine = (s: { flex?: unknown; width?: unknown }) => grows(s.flex) || /\b100%/.test(String(s.flex)) || s.width === "100%";

describe("every catalogue component dropped on the page fills its line, unless it hugs by nature (A)", () => {
  for (const entry of COMPONENT_CATALOGUE) {
    it(`${entry.name}${HUGS_BY_NATURE.has(entry.name) ? " (hugs by nature)" : ""}`, () => {
      const node = entry.build();
      // the shape a drop onto the page makes through the UI: page → band → the component (S2-f)
      const s = childStyle(node, makeRowBand([node]));
      expect(fillsLine(s)).toBe(!HUGS_BY_NATURE.has(entry.name));
    });
  }
  for (const entry of COMPONENT_CATALOGUE) {
    it(`${entry.name}: the page's own drop pass (normalizeRowBands) keeps it ${HUGS_BY_NATURE.has(entry.name) ? "hugging" : "filling"} (F1-e)`, () => {
      const node = entry.build();
      const page = normalizeRowBands(createContainer("column", { id: "page", children: [node] }));
      const placed = page.children![0].children![0];
      expect(placed.id).toBe(node.id);
      expect(fillsLine(childStyle(placed, page.children![0]))).toBe(!HUGS_BY_NATURE.has(entry.name));
      // …and nothing forces a hugging one wider at any rung: no section floor, not the phone's whole line (F1-e)
      if (HUGS_BY_NATURE.has(entry.name)) for (const bp of ["phone", "tabletPortrait", "tabletLandscape", "base", "wide"] as const)
        expect(String(childStyle(placed, page.children![0], bp).minWidth ?? ""), `${entry.name} at ${bp}`).not.toMatch(/100%|rem|min-content/);
    });
  }
  it("the hug list names only components that exist", () => {
    for (const n of HUGS_BY_NATURE) expect(COMPONENT_CATALOGUE.map((e) => e.name)).toContain(n);
  });
});

describe("a column nobody sized takes what is left of its line (B, c-7 decided B)", () => {
  const col = (w: string, patch: Partial<BoxNode> = {}) => createContainer("column", { width: w, ...patch });
  // every arrangement of a band's columns that a drop can leave: two, three, four; shares that fill the line and shares
  // that do not (a column deleted); the line wrapped by floors at a narrower rung is the same CSS at every rung
  const shapes: [string, string[]][] = [["two halves", ["50%", "50%"]], ["three thirds", ["33.33%", "33.33%", "33.34%"]], ["two of three left", ["33.33%", "33.33%"]], ["four quarters", ["25%", "25%", "25%", "25%"]], ["70 / 30", ["70%", "30%"]]];
  for (const [name, widths] of shapes) {
    it(`${name}, nobody sized any: grows when line is full (bandIsCompact — grow spends nothing), stays put when partial (partial means user-left or deleted space)`, () => {
      const band = makeRowBand(widths.map((w) => col(w)));
      const full = widths.reduce((n, w) => n + parseFloat(w), 0) > 99.5;
      // full line: grow=1 is safe (sub-pixel rounding only), and ensures fill after a wrap or floor
      // partial line: grow=0 (narrowing would be counteracted — un-narrowable regression)
      for (const c of band.children!) for (const bp of ["base", "tabletLandscape"] as const) expect(grows(childStyle(c, band, bp).flex)).toBe(full);
    });
    it(`${name}, sized by hand and still filling the line: they may take what a wrap leaves (no space was chosen)`, () => {
      const band = makeRowBand(widths.map((w) => col(w, { widthByHand: true })));
      const full = widths.reduce((n, w) => n + parseFloat(w), 0) > 99.5;
      expect(bandHoldsChosenSpace(band)).toBe(!full);
      for (const c of band.children!) expect(grows(childStyle(c, band).flex)).toBe(full);
    });
    it(`${name}, the last column's OUTER edge dragged in by 10%: nobody grows into that space (rule 1)`, () => {
      const band = makeRowBand(widths.map((w, i) => col(i === widths.length - 1 ? `${parseFloat(w) - 10}%` : w, i === widths.length - 1 ? { widthByHand: true } : {})));
      expect(bandHoldsChosenSpace(band)).toBe(true);
      for (const c of band.children!) for (const bp of ["base", "tabletLandscape"] as const) expect(grows(childStyle(c, band, bp).flex)).toBe(false);
    });
  }

  // A WRAPPING band: columns that wrap to multiple lines — each column fills ITS line, regardless of whether
  // it shares that line with others (F-1 B, wrap path). The band's total exceeds 100% on purpose (to trigger
  // wrapping), but no space was chosen (no widthByHand), so all columns grow to fill their respective lines.
  const wrapShapes: [string, string[]][] = [["three 40%", ["40%", "40%", "40%"]], ["four 30%", ["30%", "30%", "30%", "30%"]]];
  for (const [name, widths] of wrapShapes) {
    it(`${name} in a WRAPPING band: all columns grow to fill their lines (wrap path)`, () => {
      const band = makeRowBand(widths.map((w) => col(w)));
      band.wrap = true;
      for (const c of band.children!) for (const bp of ["base", "tabletLandscape"] as const)
        expect(grows(childStyle(c, band, bp).flex), `${name} at ${bp}`).toBe(true);
    });
    it(`${name} in a WRAPPING band with a dragged column: nobody grows (space was chosen)`, () => {
      const narrowed = widths.map((w, i) => col(i === widths.length - 1 ? `${parseFloat(w) - 10}%` : w, i === widths.length - 1 ? { widthByHand: true } : {}));
      const band = makeRowBand(narrowed);
      band.wrap = true;
      expect(bandHoldsChosenSpace(band)).toBe(true);
      for (const c of band.children!) for (const bp of ["base", "tabletLandscape"] as const)
        expect(grows(childStyle(c, band, bp).flex), `${name} at ${bp}`).toBe(false);
    });
  }
});
