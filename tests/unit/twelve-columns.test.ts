import { describe, it, expect } from "vitest";
import {
  GRID_MAX, COLUMN_FRACTIONS, columnFractionOf, canSetColumnFraction, gridColumns, gridColumnsAt,
  gridPlacementAt, retrackGrid, setColumnFraction, containerStyle, childStyle, createGrid, createContainer, createElement,
  findBox, makeRowBand, normalizeRowBands, insertBox, type BoxNode,
} from "@/lib/box-model";
import { GRID_LAYOUTS, getAddChoices, getPresets, blockForKind, presetKindFor } from "@/lib/box-presets";
import { renderPageHTML } from "@/lib/box-export";
import { BREAKPOINTS_EM } from "@/lib/educo-ui/base";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * THE TWELVE-COLUMN GRID (Phase 2 of the Layout System).
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * Twelve columns underneath, named fractions on top — the two decisions the plan recommended and we took. The
 * suite is split the way the feature is: what the MODEL stores (spans, starts, order, push), what the
 * CANVAS/EXPORT emit from it (they share `containerStyle`/`childStyle`, which is what makes canvas = export a
 * property of the code rather than a habit), and what happens at a NARROW rung, where a twelve-column row has
 * to stop being twelve columns or a phone gets a horizontal scrollbar.
 *
 * The ladder's widths are read from `BREAKPOINTS_EM`, never re-typed: a test that hard-codes 37.5em stops
 * testing the ladder the moment the ladder moves.
 */

const grid = (columns: number, kids: Partial<BoxNode>[]): BoxNode =>
  createGrid(columns, { id: "g", children: kids.map((k, i) => createElement("text", { id: `k${i}`, text: "x", ...k } as Partial<BoxNode>)) } as Partial<BoxNode>);

const kid = (g: BoxNode, i: number): BoxNode => (g.children ?? [])[i];

describe("the twelve columns underneath", () => {
  it("clamps a stored column count to a row a page can actually have", () => {
    expect(gridColumns({ id: "a", type: "container" })).toBe(3);       // the historic default
    expect(gridColumns({ id: "a", type: "container", columns: 12 })).toBe(GRID_MAX);
    expect(gridColumns({ id: "a", type: "container", columns: 99 })).toBe(GRID_MAX);
    expect(gridColumns({ id: "a", type: "container", columns: 0 })).toBe(1);
  });

  it("offers the fractions the plan named, and every one of them divides twelve", () => {
    expect(COLUMN_FRACTIONS.map((f) => f.label)).toEqual(["Full", "Half", "Third", "Two-thirds", "Quarter", "Three-quarters"]);
    // The reason twelve is the count underneath: a fraction that did not divide it could not be exact, and an
    // inexact fraction is a control that rounds silently — which is the failure this whole area keeps making.
    for (const f of COLUMN_FRACTIONS) expect(GRID_MAX % f.den).toBe(0);
  });

  it("names the fraction a span actually is, and refuses to name one that has no name", () => {
    expect(columnFractionOf(6, 12)).toEqual({ num: 1, den: 2 });
    expect(columnFractionOf(8, 12)).toEqual({ num: 2, den: 3 });
    expect(columnFractionOf(1, 3)).toEqual({ num: 1, den: 3 });
    expect(columnFractionOf(12, 12)).toEqual({ num: 1, den: 1 });
    expect(columnFractionOf(5, 12)).toBeNull(); // five twelfths is not a fraction anyone asks a builder for
  });

  it("offers a fraction only where the row can express it — refining to twelve counts, at the base", () => {
    expect(canSetColumnFraction(3, 3)).toBe(true);              // thirds in a row of thirds: already exact
    expect(canSetColumnFraction(3, 2)).toBe(true);              // a HALF in a row of thirds: by refining to 12
    expect(canSetColumnFraction(3, 2, "phone")).toBe(false);    // …but a rung cannot re-cut the row
    expect(canSetColumnFraction(12, 2, "phone")).toBe(true);    // …unless the row is already twelve
    expect(canSetColumnFraction(5, 2)).toBe(false);             // 5 does not divide 12 — refining would MOVE blocks
  });
});

describe("refining a row does not move anything", () => {
  it("multiplies every span and start when the new count is a multiple of the old", () => {
    const g = grid(3, [{ colSpan: 2 }, { colStart: 3 }]);
    const r = retrackGrid(g, 12);
    expect(r.columns).toBe(12);
    expect(kid(r, 0).colSpan).toBe(8);   // two thirds === eight twelfths
    expect(kid(r, 1).colStart).toBe(9);  // track 3 of 3 === track 9 of 12
  });

  it("carries every RUNG's placement across too, not only the base", () => {
    const g = grid(3, [{ colSpan: 1, responsive: { tabletLandscape: { colSpan: 2, colStart: 2 } } }]);
    const r = retrackGrid(g, 12);
    expect(kid(r, 0).responsive?.tabletLandscape).toEqual({ colSpan: 8, colStart: 5 });
  });

  it("writes down a span the block never had, so an unsized block does not SHRINK when the row is refined", () => {
    // The bug this guards: a block with no stored span is one column of whatever the row has. Refine a row of
    // thirds to twelve without materialising it and the same `undefined` now means one TWELFTH — the block
    // quietly becomes a quarter of the third it was, and every sibling shifts to fill the space it left.
    const r = retrackGrid(grid(3, [{}, {}]), 12);
    expect(kid(r, 0).colSpan).toBe(4);
    expect(kid(r, 1).colSpan).toBe(4);
    // A rung slot with no span of its own is still INHERITING the base's, so it is left alone.
    const withRung = retrackGrid(grid(3, [{ responsive: { phone: { order: 1 } } }]), 12);
    expect(kid(withRung, 0).responsive?.phone).toEqual({ order: 1 });
  });

  it("round-trips: coarsening is the exact inverse of refining", () => {
    const g = grid(3, [{ colSpan: 2 }, { colStart: 2, colSpan: 1 }]);
    expect(retrackGrid(retrackGrid(g, 12), 3)).toEqual(g);
  });

  it("LEAVES the spans alone when coarsening cannot be exact, so switching back restores the row", () => {
    // A five-column row shares no factor with twelve. Rewriting the spans would round them; the render clamps
    // instead, so the data survives and re-picking twelve gives the layout back untouched.
    const g = grid(12, [{ colSpan: 5 }]);
    const coarse = retrackGrid(g, 5);
    expect(coarse.columns).toBe(5);
    expect(kid(coarse, 0).colSpan).toBe(5); // untouched
    expect(retrackGrid(coarse, 12)).toEqual(g);
  });
});

describe("named fractions on top", () => {
  const page = (columns: number) => createContainer("column", { id: "root", children: [grid(columns, [{}, {}])] } as Partial<BoxNode>);

  it("sets an exact fraction without touching the row", () => {
    const next = setColumnFraction(page(12), "k0", 1, 2);
    expect(findBox(next, "g")?.columns).toBe(12);
    expect(findBox(next, "k0")?.colSpan).toBe(6);
  });

  it("REFINES the row to twelve when it cannot express the fraction, and the other blocks come with it", () => {
    // A half inside a row of thirds. The row becomes twelve, this block becomes six, and the sibling that was
    // one third becomes four twelfths — the same third it was, which is the whole point of refining.
    const next = setColumnFraction(page(3), "k0", 1, 2);
    expect(findBox(next, "g")?.columns).toBe(12);
    expect(findBox(next, "k0")?.colSpan).toBe(6);
    expect(findBox(next, "k1")?.colSpan).toBe(4);
  });

  it("writes into the RUNG, and never refines there, because a rung cannot carry the row's children", () => {
    const atRung = setColumnFraction(page(12), "k0", 1, 3, "phone");
    expect(findBox(atRung, "k0")?.responsive?.phone).toEqual({ colSpan: 4 });
    expect(findBox(atRung, "k0")?.colSpan).toBeUndefined(); // the base is untouched

    const unreachable = page(3);
    expect(setColumnFraction(unreachable, "k0", 1, 2, "phone")).toBe(unreachable); // refused, tree identical
  });

  it("leaves the tree alone when the block is not in a grid, so a caller can commit unconditionally", () => {
    const flex = createContainer("column", { id: "root", children: [createContainer("row", { id: "r", children: [createElement("text", { id: "t" } as Partial<BoxNode>)] } as Partial<BoxNode>)] } as Partial<BoxNode>);
    expect(setColumnFraction(flex, "t", 1, 2)).toBe(flex);
  });
});

describe("picking a layout when the row is added", () => {
  it("offers unequal splits, not only equal columns — and every one adds up to twelve", () => {
    // The gap this closes: the palette offered "2 · 3 · 4 columns", all equal, so a sidebar or a feature row —
    // the commonest shapes on a school site — were the ones the builder made hardest.
    const ids = GRID_LAYOUTS.map((l) => l.id);
    expect(ids).toContain("sidebar-left");
    expect(ids).toContain("feature-two");
    for (const l of GRID_LAYOUTS) {
      expect(l.spans.reduce((a, b) => a + b, 0), `${l.id} must fill the row`).toBe(GRID_MAX);
      expect(l.spans.every((s) => s >= 1)).toBe(true);
    }
  });

  it("builds a real twelve-column row with the cells already placed", () => {
    const pick = getAddChoices("grid", DEFAULT_THEME).find((p) => p.id === "sidebar-right")!;
    const node = blockForKind("grid", pick.patch);
    expect(node.layout).toBe("grid");
    expect(node.columns).toBe(GRID_MAX);
    expect(node.children?.map((c) => c.colSpan)).toEqual([8, 4]);
  });

  it("gives every add its OWN ids, so clicking a layout twice cannot duplicate one", () => {
    // A preset object is built once per render and can be clicked twice. Sharing cell ids would mean every
    // lookup by id finds whichever copy comes first — and select, patch and delete all look up by id.
    const pick = getAddChoices("grid", DEFAULT_THEME).find((p) => p.id === "two")!;
    const first = blockForKind("grid", pick.patch).children!.map((c) => c.id);
    const second = blockForKind("grid", pick.patch).children!.map((c) => c.id);
    expect(new Set([...first, ...second]).size).toBe(4);
  });

  it("keeps the layouts OUT of the restyle gallery, which would replace a row's content", () => {
    expect(getPresets("grid", DEFAULT_THEME)).toEqual([]);
    // …and a grid takes the container LOOKS instead, so "Styles" still means the same thing on it.
    expect(presetKindFor(createGrid(12))).toBe("container");
  });
});

describe("a block dropped into a grid arrives a usable width", () => {
  it("matches the cell already there instead of landing a twelfth wide", () => {
    // The bug this guards, found by adding a block in the real builder: a grid child with no span is ONE
    // column, and one of twelve is a 66px sliver on a 1024px page. The most useful row shapes made the worst-
    // looking blocks, which is backwards.
    const g = grid(12, [{ colSpan: 8 }, { colSpan: 4 }]);
    const page = createContainer("column", { id: "root", children: [g] } as Partial<BoxNode>);
    const next = insertBox(page, "g", 2, createElement("text", { id: "new", text: "x" } as Partial<BoxNode>));
    expect(findBox(next, "new")?.colSpan).toBe(4);
  });

  it("fills an EMPTY row, because one block a twelfth wide is never what was meant", () => {
    const g = createGrid(12, { id: "g", children: [] } as Partial<BoxNode>);
    const page = createContainer("column", { id: "root", children: [g] } as Partial<BoxNode>);
    const next = insertBox(page, "g", 0, createElement("text", { id: "new", text: "x" } as Partial<BoxNode>));
    expect(findBox(next, "new")?.colSpan).toBe(12);
  });

  it("never overrides a span the block already carries — a move keeps its place", () => {
    const g = grid(12, [{ colSpan: 8 }]);
    const page = createContainer("column", { id: "root", children: [g] } as Partial<BoxNode>);
    const next = insertBox(page, "g", 1, createElement("text", { id: "new", text: "x", colSpan: 2 } as Partial<BoxNode>));
    expect(findBox(next, "new")?.colSpan).toBe(2);
  });

  it("leaves a FLEX parent's children alone — a span means nothing there", () => {
    const row = createContainer("row", { id: "r", children: [] } as Partial<BoxNode>);
    const page = createContainer("column", { id: "root", children: [row] } as Partial<BoxNode>);
    const next = insertBox(page, "r", 0, createElement("text", { id: "new", text: "x" } as Partial<BoxNode>));
    expect(findBox(next, "new")?.colSpan).toBeUndefined();
  });
});

describe("a grid's children are its CELLS", () => {
  it("normalising the tree never wraps a grid's children in a row band", () => {
    // The bug this guards, and it made the ENTIRE feature unreachable in the real builder: every content
    // container's children get wrapped in a row band, and a grid was treated as one — so a flex band sat
    // between the grid and every block, and `grid-column` landed on a node the grid could not see. The panel
    // said "Columns wide: 4", the stored data said 4, the class was right, and the block was one track wide.
    // Only a browser could catch it: every test that builds a tree by hand skips this pass entirely.
    const g = grid(12, [{ colSpan: 4 }, { colSpan: 4 }]);
    const page = createContainer("column", { id: "root", children: [g] } as Partial<BoxNode>);
    const norm = normalizeRowBands(page);
    const normGrid = findBox(norm, "g")!;
    expect(normGrid.children?.map((c) => c.id)).toEqual(["k0", "k1"]);
    expect(normGrid.children?.every((c) => !c.rowBand), "no band between the grid and its cells").toBe(true);
    // …and the block still lands on the track it asked for, which is the half a browser measures.
    expect(childStyle(normGrid.children![0], normGrid).gridColumn).toBe("span 4");
  });

  it("still normalises INSIDE each cell, because a cell is an ordinary content container", () => {
    const g = createGrid(12, { id: "g", children: [
      createContainer("column", { id: "cell", children: [createElement("text", { id: "t", text: "x" } as Partial<BoxNode>)] } as Partial<BoxNode>),
    ] } as Partial<BoxNode>);
    const norm = findBox(normalizeRowBands(createContainer("column", { id: "root", children: [g] } as Partial<BoxNode>)), "cell")!;
    expect(norm.children?.[0].rowBand, "the cell's own contents are still laid out in rows").toBe(true);
  });
});

describe("placement reaches the CSS", () => {
  it("emits a span, and a start when the block is offset", () => {
    const g = grid(12, [{ colSpan: 4 }, { colSpan: 4, colStart: 9 }]);
    expect(childStyle(kid(g, 0), g).gridColumn).toBe("span 4");
    expect(childStyle(kid(g, 1), g).gridColumn).toBe("9 / span 4"); // two empty columns before it
  });

  it("places on BOTH axes, which is what makes any rectangle on graph paper expressible", () => {
    const g = grid(12, [{ colSpan: 4, colStart: 5, rowSpan: 2, rowStart: 3 }, { rowSpan: 2 }, { rowStart: 4 }]);
    const s = childStyle(kid(g, 0), g);
    expect(s.gridColumn).toBe("5 / span 4");
    expect(s.gridRow).toBe("3 / span 2");
    // A span with no start still spans; a start with no span still starts. Neither implies the other.
    expect(childStyle(kid(g, 1), g).gridRow).toBe("span 2");
    expect(childStyle(kid(g, 2), g).gridRow).toBe("4 / span 1");
    // Rows are IMPLICIT, so a row beyond the ones in use is created rather than clamped — unlike a column,
    // which has a track count and would otherwise stretch the row past the edge of the screen.
    expect(childStyle(createElement("text", { rowStart: 40 } as Partial<BoxNode>), g).gridRow).toBe("40 / span 1");
  });

  it("clamps a start that would push the block past the end of its row", () => {
    // Without this the block lands in an IMPLICIT thirteenth column and the row grows wider than the page —
    // the horizontal-scrollbar failure this project has had to guard against in three other places.
    const g = grid(12, [{ colSpan: 4, colStart: 11 }]);
    expect(childStyle(kid(g, 0), g).gridColumn).toBe("9 / span 4");
  });

  it("carries order and push in BOTH engines, since neither is a grid idea", () => {
    const g = grid(12, [{ order: -1, push: "end" }]);
    const gs = childStyle(kid(g, 0), g);
    expect(gs.order).toBe(-1);
    expect(gs.marginLeft).toBe("auto");

    const row = createContainer("row", {} as Partial<BoxNode>);
    const fs = childStyle(createElement("text", { order: 2, push: "both" } as Partial<BoxNode>), row);
    expect(fs.order).toBe(2);
    expect(fs.marginLeft).toBe("auto");
    expect(fs.marginRight).toBe("auto"); // both sides === centred, whatever the siblings do
  });

  it("gives a grid the per-CELL alignment the flex property could never do", () => {
    // `justify-content` distributes leftover TRACK space, and 1fr tracks leave none — so the flex control was
    // inert on a grid. `justify-items` is what it means there, and it is its OWN field: `createContainer`
    // writes `justify: "start"` on every container, so borrowing it would have stopped every saved grid's
    // children filling their cells the day this shipped.
    expect(containerStyle(createGrid(3, { justifyItems: "center" } as Partial<BoxNode>)).justifyItems).toBe("center");
    expect(containerStyle(createGrid(3)).justifyItems).toBeUndefined(); // nothing chosen → nothing emitted
    expect(containerStyle(createGrid(3, { justify: "center" } as Partial<BoxNode>)).justifyItems).toBeUndefined();
    expect(childStyle(createElement("text", { justifySelf: "end" } as Partial<BoxNode>), createGrid(3)).justifySelf).toBe("end");
  });
});

describe("a twelve-column row STACKS on a narrow screen", () => {
  it("shows one column on a phone and two on a tablet held upright, by default", () => {
    const g = createGrid(12);
    expect(gridColumnsAt(g, "base")).toBe(12);
    expect(gridColumnsAt(g, "wide")).toBe(12);
    expect(gridColumnsAt(g, "tabletLandscape")).toBe(12);
    expect(gridColumnsAt(g, "tabletPortrait")).toBe(2);
    expect(gridColumnsAt(g, "phone")).toBe(1);
  });

  it("yields the moment the user states a count at that rung — a two-up phone gallery is one click", () => {
    const g = createGrid(12, { responsive: { phone: { columns: 2 } } } as Partial<BoxNode>);
    // The canvas and the export both hand `containerStyle` the RESOLVED node, which still carries `responsive`
    // (resolveResponsive spreads it) — which is the only reason "set here" is answerable at all.
    expect(gridColumnsAt({ ...g, columns: 2 }, "phone")).toBe(2);
  });

  it("keeps each block's PROPORTION when it narrows the row, instead of clamping it to full width", () => {
    // The bug this guards, found in a browser: clamping a span of 4-of-12 into a 2-track row gives 2, which is
    // the whole row — so a three-card row stacked completely on a tablet held upright and the two-column rung
    // did nothing at all. A third of twelve is a third of two, which is one column, which is two cards across.
    const g = grid(12, [{ colSpan: 4 }, { colSpan: 4 }, { colSpan: 4 }]);
    expect(gridPlacementAt(g, kid(g, 0), "tabletPortrait")).toEqual({ track: 2, span: 1, start: null });
    expect(gridPlacementAt(g, kid(g, 0), "phone")).toEqual({ track: 1, span: 1, start: null });
    // A full-width block stays full width — the proportion is what is preserved, not the number.
    const full = grid(12, [{ colSpan: 12 }]);
    expect(gridPlacementAt(full, kid(full, 0), "tabletPortrait").span).toBe(2);
    // An offset is re-fitted the same way, so the empty columns before a block stay proportionally empty.
    const offset = grid(12, [{ colSpan: 6, colStart: 7 }]);
    expect(gridPlacementAt(offset, kid(offset, 0), "tabletPortrait")).toEqual({ track: 2, span: 1, start: 2 });
  });

  it("takes a span at FACE VALUE once the user has stated the count at that rung", () => {
    // They are speaking in that rung's units already; rescaling their number would be the builder arguing.
    const g = createGrid(2, { responsive: { phone: { columns: 2 } }, children: [createElement("text", { id: "k", colSpan: 2 } as Partial<BoxNode>)] } as Partial<BoxNode>);
    expect(gridPlacementAt(g, kid(g, 0), "phone")).toEqual({ track: 2, span: 2, start: null });
  });

  it("clamps the spans to match, so nothing spills into an implicit column", () => {
    const g = grid(12, [{ colSpan: 8, colStart: 5 }]);
    expect(childStyle(kid(g, 0), g, "phone").gridColumn).toBe("1 / span 1");
    expect(containerStyle(g, "phone").gridTemplateColumns).toBe("repeat(1, minmax(0, 1fr))");
  });
});

describe("the export writes the same layout the canvas shows", () => {
  const cssOf = (root: BoxNode): string =>
    [...renderPageHTML(root, DEFAULT_THEME).matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");

  const gridPage = (kids: Partial<BoxNode>[], columns = 12): BoxNode =>
    createContainer("column", { id: "root", children: [makeRowBand([grid(columns, kids)])] } as Partial<BoxNode>);

  /** The rules inside one rung's query — every declaration block, joined. */
  const atRung = (css: string, em: number): string =>
    css.match(new RegExp(`@media \\(min-width:${em}em\\)\\{([\\s\\S]*?\\})\\}`))?.[1] ?? "";

  it("stacks the row in the base rule and builds it back up rung by rung (mobile-first)", () => {
    const css = cssOf(gridPage([{ colSpan: 4 }]));
    // The phone rung is the UNQUALIFIED rule: one column, and a span of 1 needs no `grid-column` at all.
    expect(css.split("@media")[0]).toContain("grid-template-columns:repeat(1, minmax(0, 1fr))");
    // Two columns on a tablet held upright…
    expect(atRung(css, BREAKPOINTS_EM.tabletPortrait)).toContain("grid-template-columns:repeat(2, minmax(0, 1fr))");
    // …and the full twelve from tablet landscape up, which is where `gridColumnsAt` stops clamping. Each rung
    // is diffed against the one BELOW it, so nothing more is emitted at desktop or wide: the row already says
    // twelve and a rung that changes nothing emits nothing.
    const landscape = atRung(css, BREAKPOINTS_EM.tabletLandscape);
    expect(landscape).toContain("grid-template-columns:repeat(12, minmax(0, 1fr))");
    expect(landscape).toContain("grid-column:span 4");
    expect(atRung(css, BREAKPOINTS_EM.desktop)).not.toContain("grid-template-columns");
  });

  it("takes an order back at the rung above, instead of letting the narrow value leak upward", () => {
    // The base rule applies at EVERY width, so a value set only on the phone has to be actively reset where it
    // stops applying — `revert` cannot do it, because the stylesheet's value IS the rule being undone.
    const css = cssOf(gridPage([{ responsive: { phone: { order: -1 } } }]));
    expect(css.split("@media")[0]).toContain("order:-1");
    expect(atRung(css, BREAKPOINTS_EM.tabletPortrait)).toContain("order:0");
  });

  it("emits a per-rung span exactly where the user set it", () => {
    // Both rungs state a column count, so the narrow-screen clamp stands aside and the spans are the user's.
    const css = cssOf(gridPage([{ colSpan: 12, responsive: { tabletLandscape: { colSpan: 6 } } }], 12));
    expect(atRung(css, BREAKPOINTS_EM.tabletLandscape)).toContain("grid-column:span 6");
    expect(atRung(css, BREAKPOINTS_EM.desktop)).toContain("grid-column:span 12");
  });
});
