import { describe, it, expect } from "vitest";
import {
  MASONRY_ROW_REM, MASONRY_DEFAULT_RATIO, isMasonry, masonryContainerPx, masonryRatio, masonryCellPx,
  masonryCellHeightPx, masonrySpanUnits, masonryRowSpan, masonryMeasureAttr, masonryMeasurePass, masonryMeasureScript,
  createGrid, createContainer, createElement, containerStyle, childStyle, makeRowBand, type BoxNode,
} from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";
import { RUNG_MEASURE, RUNG_PX } from "@/lib/educo-ui/layout";
import { BREAKPOINTS_EM } from "@/lib/educo-ui/base";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * MASONRY — the last item of Phase 2 of the Layout System.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature (the "Row heights" scenarios).
 *
 * This file covers the MODEL — what the two new fields mean, and the arithmetic that turns a cell's shape into
 * a number of row units. What the canvas and the export EMIT from it is covered further down in the same file,
 * because they share `containerStyle`/`childStyle`: canvas = export is a property of the code here, not a
 * habit somebody has to remember.
 *
 * Nothing in here re-types a ladder number. The measures come from `RUNG_MEASURE` and the rung widths from
 * `RUNG_PX`, so a test that would stop testing the ladder the moment the ladder moved cannot be written.
 */

const cell = (over: Partial<BoxNode> = {}): BoxNode =>
  createContainer("column", { width: "100%", padding: 0, gap: 0, colSpan: 4, ...over } as Partial<BoxNode>);

const gallery = (over: Partial<BoxNode> = {}, kids: BoxNode[] = [cell(), cell(), cell()]): BoxNode =>
  createGrid(12, { id: "g", rowFlow: "masonry", gap: 16, children: kids, ...over } as Partial<BoxNode>);

const pageOf = (g: BoxNode): BoxNode =>
  createContainer("column", { id: "root", children: [makeRowBand([g])] } as Partial<BoxNode>);

const photo = (w: number, h: number): BoxNode =>
  createElement("image", { src: "x.jpg", imgW: w, imgH: h, height: "auto" });

describe("what the control means", () => {
  it("leaves every page that exists alone — no field, no masonry", () => {
    // The whole safety of shipping this: `rowFlow` is absent on every node ever saved, so a stored page
    // renders through the identical path it did yesterday. `Even` is not a new mode, it is the old one named.
    const even = createGrid(12, { children: [cell(), cell()] });
    expect(isMasonry(even)).toBe(false);
    expect(isMasonry({ ...even, rowFlow: "even" })).toBe(false);
    expect(isMasonry({ ...even, rowFlow: "masonry" })).toBe(true);
  });

  it("is a GRID option — a flex row cannot be masonry however the field is set", () => {
    const flex = createContainer("row", { rowFlow: "masonry", children: [cell(), cell()] } as Partial<BoxNode>);
    expect(isMasonry(flex)).toBe(false);
  });

  it("stands down on a phone, where one column has nothing to stagger", () => {
    // Masonry is what happens when neighbouring COLUMNS can run at different heights. `gridColumnsAt`
    // collapses a grid to one column on a phone, and a single column of blocks already stacks correctly with
    // even rows — measuring units there would only add rounding to a layout that was already right.
    const g = gallery();
    expect(isMasonry(g, "base")).toBe(true);
    expect(isMasonry(g, "tabletPortrait")).toBe(true);
    expect(isMasonry(g, "phone")).toBe(false);
  });

  it("stands down on a grid the user has narrowed to one column themselves", () => {
    expect(isMasonry(gallery({ columns: 1 }))).toBe(false);
  });
});

describe("the width a span is worked out against", () => {
  it("reads the page measure straight off the ladder, per rung", () => {
    for (const [bp, rung] of [["base", "desktop"], ["wide", "wide"], ["tabletLandscape", "tabletLandscape"], ["tabletPortrait", "tabletPortrait"]] as const) {
      expect(masonryContainerPx(bp)).toBe(parseFloat(RUNG_MEASURE[rung] as string) * 16);
    }
    expect(masonryContainerPx("phone")).toBeNull(); // no cap on the phone rung — and no masonry either
  });

  it("is EXACT because every measure sits below its own rung's starting width", () => {
    // This is the finding the whole static mechanism rests on. If a rung's cap were wider than the screen the
    // rung starts at, the container would be fluid inside that rung and a per-rung span could only ever be an
    // estimate. Every cap is below its rung's start, so the container is a CONSTANT within the rung.
    for (const rung of ["tabletPortrait", "tabletLandscape", "desktop", "wide"] as const) {
      expect(parseFloat(RUNG_MEASURE[rung] as string) * 16).toBeLessThan(RUNG_PX[rung]);
    }
  });
});

describe("the shape of a cell", () => {
  it("takes a photo's real shape, measured once when it was uploaded", () => {
    expect(masonryRatio(photo(1000, 500))).toBe(0.5);
    expect(masonryRatio(cell({ children: [photo(800, 1200)] }))).toBe(1.5);
  });

  it("finds the photo however deep in the cell it sits", () => {
    // A grid child is a CELL, and the picture is inside it — often under a band the builder inserted, which
    // nobody typed and nobody can see in the panel.
    const deep = cell({ children: [createContainer("row", { rowBand: true, children: [photo(400, 300)] } as Partial<BoxNode>)] });
    expect(masonryRatio(deep)).toBeCloseTo(0.75, 6);
  });

  it("assumes 4:3 for anything whose height cannot be known — never a sliver", () => {
    // A card, a caption, any text. Something must be assumed or the cell claims one unit and renders 8px
    // tall, which is not "approximate", it is broken.
    expect(masonryRatio(cell({ children: [createElement("text", { text: "hello" })] }))).toBe(MASONRY_DEFAULT_RATIO);
    expect(masonryRatio(cell())).toBe(MASONRY_DEFAULT_RATIO);
    expect(MASONRY_DEFAULT_RATIO).toBe(3 / 4);
  });

  it("prefers a STATED height over the assumed shape — a fact beats a guess", () => {
    // And it is the commonest fact there is: an image block is created carrying height 260px until somebody
    // sets it to `auto`.
    expect(masonryCellHeightPx(cell({ height: "260px" }), 400)).toBe(260);
    expect(masonryCellHeightPx(cell({ minHeight: 180 }), 400)).toBe(180);
    // …and falls back to the shape when the height is not a plain pixel length.
    expect(masonryCellHeightPx(cell({ height: "auto", children: [photo(400, 200)] }), 400)).toBe(200);
    expect(masonryCellHeightPx(cell({ height: "50%", children: [photo(400, 200)] }), 400)).toBe(200);
  });

  it("adds the cell's own inner spacing to the height it claims", () => {
    expect(masonryCellHeightPx(cell({ height: "200px", padding: 10 }), 400)).toBe(220);
    expect(masonryCellHeightPx(cell({ height: "200px", paddingTop: 10, paddingBottom: 30 }), 400)).toBe(240);
  });
});

describe("the arithmetic", () => {
  it("divides the row up the way CSS will", () => {
    // Twelve columns, 1200px wide, 16px between: each track is (1200 - 11×16) / 12 = 85.33…
    expect(masonryCellPx(1200, 12, 1, 16)).toBeCloseTo((1200 - 11 * 16) / 12, 6);
    // …and a four-track cell is four of those PLUS the three gaps it swallows, which is the clause that is
    // easy to leave out and makes every wide cell too short.
    expect(masonryCellPx(1200, 12, 4, 16)).toBeCloseTo(((1200 - 11 * 16) / 12) * 4 + 3 * 16, 6);
    // A full-width cell is the whole container, exactly — the arithmetic has to close.
    expect(masonryCellPx(1200, 12, 12, 16)).toBeCloseTo(1200, 6);
    expect(masonryCellPx(1200, 12, 12, 0)).toBeCloseTo(1200, 6);
  });

  it("never lets a cell claim fewer tracks than it needs", () => {
    const r = MASONRY_ROW_REM * 16; // 8px
    expect(masonrySpanUnits(80, 0)).toBe(10);
    expect(masonrySpanUnits(81, 0)).toBe(11); // rounds UP: a cell that does not fit its span overlaps the one below
    expect(masonrySpanUnits(0, 0)).toBe(1);   // never zero — a zero span is not a grid placement at all
    expect(r).toBe(8);
  });

  it("spends the down-gap as EMPTY UNITS, so being slightly wrong about it cannot compound", () => {
    // The textbook recipe leaves the gap on the container and solves n = ceil((H + G) / (R + G)) — where the
    // assumed gap appears once per track, so a small error is multiplied by n. The builder's spacing unit is
    // deliberately fluid (`u()` is a clamp that tracks the frame width), so the gap can only ever be
    // estimated — and under the textbook recipe a 30% error on a 16px gap moves a 300px photo by ~90px.
    const H = 300, R = 8, assumed = 16, real = 11; // the fluid unit's floor is 0.7× its reference
    // What the cell is actually GIVEN on the page, when the gap it was planned against is not the gap the
    // browser ends up using. Ours has `row-gap: 0`, so the real gap does not appear in the allotment at all.
    const ours = masonrySpanUnits(H, assumed) * R;
    const textbookN = Math.ceil((H + assumed) / (R + assumed));
    const textbook = textbookN * R + (textbookN - 1) * real;
    expect(ours).toBeGreaterThanOrEqual(H);        // the content always fits — it can never overlap the cell below
    expect(ours - H).toBeLessThanOrEqual(assumed + R); // and the leftover is the gap the user asked for, not a hole
    expect(textbook).toBeLessThan(H - 40);         // theirs under-allots by tens of px, so the photo overlaps
  });
});

describe("the whole pipeline", () => {
  it("gives a tall photo more units than a wide one, in the same row", () => {
    const tall = cell({ height: "auto", children: [photo(400, 800)] });
    const wide = cell({ height: "auto", children: [photo(800, 400)] });
    const g = gallery({}, [tall, wide]);
    const a = masonryRowSpan(g, tall)!, b = masonryRowSpan(g, wide)!;
    expect(a).toBeGreaterThan(b);
    // Twice as tall a picture in the same-width cell is (bar the shared gap allowance) twice the units.
    expect(a - 2).toBeGreaterThan(2 * (b - 2) - 3);
  });

  it("works the span out against the width the cell REALLY gets at that rung", () => {
    // The same cell is narrower on a tablet than on a desktop, so the same photo is shorter there and claims
    // fewer units. A span computed once at the desktop width and reused would leave a growing hole on every
    // narrower screen — the exact failure the five rungs exist to prevent.
    const c = cell({ height: "auto", children: [photo(400, 400)] });
    const g = gallery({}, [c, cell(), cell()]);
    expect(masonryRowSpan(g, c, "base")!).toBeGreaterThan(masonryRowSpan(g, c, "tabletLandscape")!);
    expect(masonryRowSpan(g, c, "wide")!).toBeGreaterThan(masonryRowSpan(g, c, "base")!);
  });

  it("says nothing at all when masonry is not running", () => {
    const even = createGrid(12, { children: [cell()] });
    expect(masonryRowSpan(even, even.children![0])).toBeNull();
    expect(masonryRowSpan(gallery(), gallery().children![0], "phone")).toBeNull();
  });

  it("subtracts the grid's own inner spacing before dividing it up", () => {
    const c = cell({ height: "auto", children: [photo(400, 400)] });
    const bare = gallery({}, [c, cell(), cell()]);
    const inset = gallery({ padding: 40 }, [c, cell(), cell()]);
    expect(masonryRowSpan(inset, c)!).toBeLessThan(masonryRowSpan(bare, c)!);
  });
});

describe("what the canvas draws and the export publishes — the same thing, from one place", () => {
  const cssOf = (root: BoxNode): string =>
    [...renderPageHTML(root, DEFAULT_THEME).matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");

  const page = (g: BoxNode): BoxNode =>
    createContainer("column", { id: "root", children: [makeRowBand([g])] } as Partial<BoxNode>);

  /** The rules inside one rung's query. Found by hand rather than by regex — a `min-width:37.5em` marker
   *  built into a pattern needs escaping that this shell keeps eating, and a silently empty match reads
   *  exactly like a missing declaration. */
  const atRungCss = (css: string, em: number): string => {
    const head = "@media (min-width:" + em + "em){";
    const i = css.indexOf(head);
    if (i < 0) return "";
    const rest = css.slice(i + head.length);
    const end = rest.indexOf("}}");
    return end < 0 ? rest : rest.slice(0, end + 1);
  };

  it("turns the row track into a fine measuring unit, and only then", () => {
    expect(containerStyle(createGrid(12, { children: [cell()] }), "base").gridAutoRows).toBe("minmax(min-content, 1fr)");
    expect(containerStyle(gallery(), "base").gridAutoRows).toBe(`minmax(${MASONRY_ROW_REM}rem, auto)`);
  });

  it("makes each cell hug its content instead of stretching to a ruler", () => {
    expect(containerStyle(gallery({ align: "stretch" }), "base").alignItems).toBe("start");
  });

  it("puts the down-gap in the cells and takes it off the container", () => {
    const g = gallery({ gap: 24 });
    const s = containerStyle(g, "base");
    expect(s.rowGap).toBe("0px");
    expect(String(s.columnGap)).toContain("2.4"); // the across gap is untouched, in the page's own fluid unit
    expect(s.gap).toBeUndefined();               // never the shorthand — the property set must match at every rung
  });

  it("names no rows, because there are none to name", () => {
    // `gridRowTracks` normally writes an explicit list as soon as a row has been dragged taller. Under masonry
    // that list would both mean nothing and fight the unit.
    const g = gallery({}, [cell({ minHeight: 300 }), cell(), cell()]);
    expect(containerStyle({ ...g, rowFlow: "even" }, "base").gridTemplateRows).toBeTruthy();
    expect(containerStyle(g, "base").gridTemplateRows).toBeUndefined();
  });

  it("gives every cell a computed span down, and leaves the columns alone", () => {
    const tall = cell({ height: "auto", children: [photo(400, 800)] });
    const g = gallery({}, [tall, cell(), cell()]);
    const s = childStyle(tall, g, "base");
    expect(s.gridRow).toMatch(/^span \d+$/);
    expect(s.gridColumn).toBe("span 4"); // the twelve columns keep working — that is the point of choosing B
  });

  it("ignores a stored rows-tall, which is what the hidden controls are hidden for", () => {
    const c = cell({ rowSpan: 3, rowStart: 2, height: "auto", children: [photo(400, 400)] });
    const g = gallery({}, [c, cell(), cell()]);
    expect(childStyle(c, g, "base").gridRow).not.toBe("2 / span 3");
    expect(childStyle(c, { ...g, rowFlow: "even" }, "base").gridRow).toBe("2 / span 3");
  });

  it("comes back to ordinary rows on a phone, in the published stylesheet", () => {
    const css = cssOf(page(gallery({}, [cell({ height: "auto", children: [photo(400, 800)] }), cell(), cell()])));
    // The phone rung is the unqualified base of a mobile-first sheet: one column, ordinary rows, no ruler.
    const phone = css.split("@media")[0];
    expect(phone).toContain("grid-auto-rows:minmax(min-content, 1fr)");
    expect(phone).not.toContain(`minmax(${MASONRY_ROW_REM}rem, auto)`);
    // …and masonry arrives at the first rung that has more than one column to stagger.
    expect(atRungCss(css, BREAKPOINTS_EM.tabletPortrait)).toContain(`grid-auto-rows:minmax(${MASONRY_ROW_REM}rem, auto)`);
  });

  it("takes the row-gap back off when a rung stops being masonry, instead of leaking it", () => {
    // The trap this guards: a property written at one rung and simply dropped at another goes on applying,
    // because the narrower rule is still in force. `row-gap: 0` leaking up would close every gap in the
    // gallery; the gap shorthand leaking down would double-space the phone stack.
    const css = cssOf(page(gallery({ gap: 16 }, [cell({ height: "auto", children: [photo(400, 800)] }), cell(), cell()])));
    expect(css.split("@media")[0]).toMatch(/gap:calc/);                       // phone: the ordinary shorthand
    expect(atRungCss(css, BREAKPOINTS_EM.tabletPortrait)).toContain("row-gap:0px"); // masonry: spent in the cells
  });

  it("publishes the SAME span the canvas drew — one resolver, so they cannot disagree", () => {
    const tall = cell({ id: "tall", height: "auto", children: [photo(400, 800)] });
    const g = gallery({}, [tall, cell(), cell()]);
    const canvas = String(childStyle(tall, g, "base").gridRow);
    const published = cssOf(page(g));
    expect(canvas).toMatch(/^span \d+$/);
    expect(published).toContain(`grid-row:${canvas}`);
  });
});

describe("measuring on the page — the opt-in refinement (C)", () => {
  it("ships nothing at all unless somebody asked for it", () => {
    // Zero JS is the default, and it stays the default. B alone already staggers and never crops.
    expect(masonryMeasureAttr(gallery())).toBeNull();
    expect(masonryMeasureAttr(createGrid(12, { rowMeasure: true, children: [cell()] } as Partial<BoxNode>))).toBeNull();
    expect(masonryMeasureAttr(gallery({ rowMeasure: true }))).toBe(2); // a 16px down-gap is 2 units of 8px
    expect(masonryMeasureAttr(gallery({ rowMeasure: true, gapY: 40 }))).toBe(5);
  });

  it("carries the one number the script cannot read back off the page", () => {
    // Masonry spends the down-gap as empty row units, so `row-gap` is 0 in the computed style. The attribute
    // is both the marker the script looks for and the gap it would otherwise have to guess.
    const html = renderPageHTML(pageOf(gallery({ rowMeasure: true, gapY: 24 })), DEFAULT_THEME);
    expect(html).toContain('data-eu-masonry="3"');
  });

  it("ships the canvas's OWN function as its script — one algorithm, not two", () => {
    // The guard that makes canvas = export structural rather than a habit: the exported page runs the source
    // of the very function the editor calls, so an edit to one is an edit to both.
    const script = masonryMeasureScript();
    expect(script).toContain(String(masonryMeasurePass));
    expect(script).toContain("window.__euMasonry"); // one guarded global, so ten galleries still run one copy
    const html = renderPageHTML(pageOf(gallery({ rowMeasure: true })), DEFAULT_THEME);
    expect(html).toContain("window.__euMasonry");
    expect(renderPageHTML(pageOf(gallery()), DEFAULT_THEME)).not.toContain("__euMasonry"); // …and none without it
  });

  it("sets each cell's span from the height it really rendered at", () => {
    const g = domGrid({ cols: 2, unit: 8, gapUnits: 2, heights: [200, 96] });
    masonryMeasurePass(g);
    expect((g.children[0] as HTMLElement).style.gridRow).toBe("span 27"); // ceil(200/8) + 2
    expect((g.children[1] as HTMLElement).style.gridRow).toBe("span 14"); // ceil(96/8)  + 2
  });

  it("releases the old spans before it reads, so a second pass cannot ratchet", () => {
    // THE FAILURE THIS PREVENTS. A cell the user has told to FILL its cell fills whatever space it is given —
    // so if the pass reads its height while it is still holding last pass's span, it measures the space it
    // was granted rather than the content in it, adds the gap on top, and grants MORE. Every pass makes the
    // gallery taller: a resize, a font landing, a photo decoding, each one ratcheting again. Releasing the
    // spans first costs one reflow and makes the pass idempotent, which is what lets it be re-run freely.
    const g = domGrid({ cols: 3, unit: 8, gapUnits: 2, heights: [200, 96, 300], stretch: true });
    masonryMeasurePass(g);
    const first = Array.from(g.children).map((c) => (c as HTMLElement).style.gridRow);
    masonryMeasurePass(g);
    masonryMeasurePass(g);
    expect(Array.from(g.children).map((c) => (c as HTMLElement).style.gridRow)).toEqual(first);
    expect(first[0]).toBe("span 27");
  });

  it("hands the spans back when the row stops being a gallery", () => {
    // A phone rung reached by resizing, with spans left over from the desktop the visitor came from. Leaving
    // them behind would keep a desktop's ruler on a one-column stack.
    const g = domGrid({ cols: 2, unit: 8, gapUnits: 2, heights: [200, 96] });
    masonryMeasurePass(g);
    expect((g.children[0] as HTMLElement).style.gridRow).not.toBe("");
    g.style.gridTemplateColumns = "375px";
    masonryMeasurePass(g);
    expect((g.children[0] as HTMLElement).style.gridRow).toBe("");
    expect((g.children[1] as HTMLElement).style.gridRow).toBe("");
  });

  it("never claims a zero span, whatever it measures", () => {
    const g = domGrid({ cols: 2, unit: 8, gapUnits: 0, heights: [0, 0] });
    masonryMeasurePass(g);
    expect((g.children[0] as HTMLElement).style.gridRow).toBe("span 1");
  });
});

/**
 * A masonry grid as real DOM, with each cell's rendered height stubbed — jsdom lays nothing out.
 *
 * `stretch` models a cell the user has told to FILL its cell: it is as tall as the tracks it currently spans,
 * or its content, whichever is more. That is the shape a browser really has, and it is what makes a pass that
 * reads before it releases ratchet.
 */
function domGrid({ cols, unit, gapUnits, heights, stretch }: { cols: number; unit: number; gapUnits: number; heights: number[]; stretch?: boolean }): HTMLElement {
  const g = document.createElement("div");
  g.style.display = "grid";
  g.style.gridTemplateColumns = Array.from({ length: cols }, () => "100px").join(" ");
  g.style.gridAutoRows = `minmax(${unit}px, auto)`;
  g.setAttribute("data-eu-masonry", String(gapUnits));
  for (const h of heights) {
    const c = document.createElement("div");
    c.getBoundingClientRect = () => {
      const span = /span (\d+)/.exec(c.style.gridRow);
      const tall = stretch && span ? Math.max(h, parseInt(span[1], 10) * unit) : h;
      return { height: tall, width: 100, top: 0, left: 0, right: 100, bottom: tall, x: 0, y: 0, toJSON: () => ({}) };
    };
    g.appendChild(c);
  }
  document.body.appendChild(g);
  return g;
}
