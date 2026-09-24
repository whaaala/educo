import { test, expect } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { COMPONENT_CATALOGUE } from "@/lib/component-catalogue";
import { normalizeSite, siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * EVERY COMPONENT FILLS THE ROW IT IS IN — at every rung, for every block the palette can add.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * Asked for directly, after a 3×3 grid inside a dark stack was previewed narrower and showed a column of
 * content with the section's background filling the rest: *"make sure this rule is applied to all of them —
 * all the components we have, and the ones we're going to build, so it doesn't break like the grids are
 * breaking."*
 *
 * THE BUG WAS ARITHMETIC, NOT LAYOUT, which is exactly why it reaches everything. Between 620px and 880px the
 * ladder caps a grid's track at 2. Any number of cells that does not divide by 2 then leaves an orphan on the
 * last row and half a row of background beside it. Measured on the exported page before the fix:
 *
 *     3 cards  → 2 up, 1 alone, HALF A ROW empty
 *     9 cells  → 4 rows of 2, 1 alone, same
 *     4 cards  → fills, which is why nobody had seen it
 *
 * A three-card row is Scenario B of this project's own user guide.
 *
 * SO THIS ENUMERATES THE CATALOGUE rather than listing cases — the same decision as the corner-radius guard
 * and the sixty-device sweep. A component added to `COMPONENT_CATALOGUE` tomorrow is covered the day it
 * appears, with nothing for anyone to remember. A per-component test is precisely the test that will not
 * exist for the component nobody wrote one for.
 *
 * It is asserted as GEOMETRY, measured in a browser. A test that read the `grid-column` declaration would
 * pass on a page where the cell never actually reached the edge.
 */

/** Every kind the blocks palette can add: the primitives plus every catalogue component. */
const PRIMITIVES = ["container", "row", "grid", "heading", "text", "button", "list", "image", "video", "divider", "spacer", "icon", "embed"];
const ALL_KINDS = [...PRIMITIVES, ...COMPONENT_CATALOGUE.map((c) => c.name)];

/**
 * THREE of each, deliberately. Three is the smallest count that does not divide by the narrowed track, so it
 * is the count that breaks — and it is also the commonest row on a school site. Two or four would pass while
 * the fault was still there, which is the shape of guard this project has been bitten by twice.
 */
const PER_ROW = 3;

/** A painted section holding a 3-across grid of one kind, so any hole shows as the section's own colour. */
function sectionFor(kind: string, i: number): BoxNode {
  const cells = Array.from({ length: PER_ROW }, (_, n) =>
    blockForKind(kind, { id: `k${i}_${n}`, colSpan: 4, width: "100%", minHeight: 80 } as Partial<BoxNode>));
  return {
    id: `s${i}`, type: "container", direction: "column", width: "100%", padding: 0, gap: 0,
    background: "#0d3b1e", // the giveaway colour: anything of this showing beside a row is the bug
    children: [{
      id: `g${i}`, type: "container", layout: "grid", columns: 12, width: "100%", padding: 0, gap: 0,
      children: cells,
    } as unknown as BoxNode],
  } as unknown as BoxNode;
}

const page = (): BoxNode => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0,
  children: ALL_KINDS.map((k, i) => sectionFor(k, i)),
} as unknown as BoxNode);

/** The rungs either side of every boundary, so a fault that lives in one band cannot hide between samples. */
const WIDTHS = [375, 520, 620, 760, 880, 899, 900, 1100, 1199, 1200, 1440, 1900];

test.describe("every block the palette can add fills the row it is in", () => {
  test("no rung leaves a hole beside the last row, for any kind in the catalogue", async ({ page: pw }) => {
    test.slow(); // twenty kinds across twelve widths, but it is one page load

    const site = normalizeSite(siteFromRoot(page()), 0);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    await pw.route("**/__fills", (r) => r.fulfill({ contentType: "text/html", body: html }));
    await pw.goto("/__fills");
    await pw.waitForTimeout(350);

    const failures: string[] = [];
    for (const w of WIDTHS) {
      await pw.setViewportSize({ width: w, height: 900 });
      await pw.waitForTimeout(60);
      const found = await pw.evaluate(({ kinds, per }) => {
        const out: { kind: string; reach: number; gridW: number; tracks: number; rows: number }[] = [];
        kinds.forEach((kind: string, i: number) => {
          const g = document.querySelector<HTMLElement>(`.bx-g${i}`);
          if (!g) { out.push({ kind, reach: -1, gridW: -1, tracks: 0, rows: 0 }); return; }
          const gr = g.getBoundingClientRect();
          const cells: { x: number; right: number; y: number }[] = [];
          for (let n = 0; n < per; n++) {
            const el = document.querySelector<HTMLElement>(`.bx-k${i}_${n}`);
            if (!el) continue;
            const r = el.getBoundingClientRect();
            cells.push({ x: r.left - gr.left, right: r.right - gr.left, y: Math.round(r.top - gr.top) });
          }
          if (!cells.length) { out.push({ kind, reach: -1, gridW: Math.round(gr.width), tracks: 0, rows: 0 }); return; }
          const rows = [...new Set(cells.map((c) => c.y))].sort((a, b) => a - b);
          const last = cells.filter((c) => c.y === rows[rows.length - 1]);
          out.push({
            kind,
            reach: Math.round(Math.max(...last.map((c) => c.right))),
            gridW: Math.round(gr.width),
            tracks: getComputedStyle(g).gridTemplateColumns.split(" ").filter(Boolean).length,
            rows: rows.length,
          });
        });
        return out;
      }, { kinds: ALL_KINDS, per: PER_ROW });

      for (const f of found) {
        if (f.reach === -1) { failures.push(`${w}px · ${f.kind}: the blocks are not on the page at all`); continue; }
        // 2px of tolerance for sub-pixel track rounding, and no more: the fault this catches was HALF a row.
        if (f.gridW - f.reach > 2) {
          failures.push(`${w}px · ${f.kind}: the last row stops ${f.gridW - f.reach}px short of the grid's ${f.gridW}px `
            + `(${f.tracks} tracks, ${f.rows} rows) — that gap is the section's background`);
        }
      }
    }
    expect(failures, `${failures.length} of ${ALL_KINDS.length * WIDTHS.length} checks left a hole:\n${failures.slice(0, 30).join("\n")}`).toEqual([]);
  });

  test("a layout the person made themselves is left alone", async ({ page: pw }) => {
    /**
     * The other half of the rule, and the one that keeps it honest. A twelve-column row holding two cells of
     * four columns each leaves a third of the row empty ON PURPOSE — that is a design, and filling it would
     * be the builder arguing with it. Only a grid the responsive LADDER narrowed is stretched.
     *
     * Without this, "make the last row fill" would quietly become "no grid may ever have space in it".
     */
    const deliberate: BoxNode = {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [{
        id: "sec", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, background: "#0d3b1e",
        children: [{
          id: "gg", type: "container", layout: "grid", columns: 12, width: "100%", padding: 0, gap: 0,
          children: [
            { id: "x0", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 80, colSpan: 4, background: "#ef4056" },
            { id: "x1", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 80, colSpan: 4, background: "#41c463" },
          ],
        } as unknown as BoxNode],
      } as unknown as BoxNode],
    } as unknown as BoxNode;

    const site = normalizeSite(siteFromRoot(deliberate), 0);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    await pw.route("**/__deliberate", (r) => r.fulfill({ contentType: "text/html", body: html }));
    await pw.setViewportSize({ width: 1440, height: 900 });
    await pw.goto("/__deliberate");
    await pw.waitForTimeout(300);

    const m = await pw.evaluate(() => {
      const g = document.querySelector<HTMLElement>(".bx-gg")!.getBoundingClientRect();
      const b = document.querySelector<HTMLElement>(".bx-x1")!.getBoundingClientRect();
      return { gridW: Math.round(g.width), reach: Math.round(b.right - g.left) };
    });
    // Two thirds used, one third deliberately empty — the block must NOT have been stretched into it.
    expect(m.reach, `the second cell reached ${m.reach} of ${m.gridW}; the empty third was the design`)
      .toBeLessThan(m.gridW * 0.75);
  });

  test("the catalogue is really being walked — this cannot pass by testing nothing", async () => {
    /**
     * The guard above is a loop over a list, and a loop over an EMPTY list passes. It has happened in this
     * repo: a contrast guard seeded its own hard-coded value and stayed green while the product's was wrong.
     * So the list is asserted to contain the things it claims to.
     */
    expect(ALL_KINDS.length, "the catalogue has emptied out").toBeGreaterThanOrEqual(15);
    for (const c of COMPONENT_CATALOGUE) expect(ALL_KINDS, `${c.name} is missing from the sweep`).toContain(c.name);
    for (const p of ["container", "grid", "heading", "image"]) expect(ALL_KINDS).toContain(p);
  });
});
