import { test, expect, type Page } from "@playwright/test";
import { type BoxNode, normalizeRowBands } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { RUNG_PX } from "@/lib/educo-ui/layout";

/**
 * THE TWELVE-COLUMN GRID, measured in a browser.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * The unit tests prove which declarations come out. Only a browser can prove the thing that actually matters —
 * that a block asked for half a row is half as wide as the row, that four empty columns really are empty, and
 * that a twelve-column layout collapses on a phone instead of running off the side of the screen. Every one of
 * those is a claim about geometry, and geometry is the one thing a string assertion cannot check.
 *
 * The page is rendered from the EXPORT, so what is measured here is what a visitor gets. The canvas is proved
 * to agree by construction: both build their boxes from `containerStyle`/`childStyle`, which is why canvas =
 * export is a property of the code rather than a habit that has to be re-checked.
 */

const gridPage = (kids: Partial<BoxNode>[], columns = 12) => {
  const root = {
    id: "root", type: "container", direction: "column",
    children: [{
      id: "band", type: "container", direction: "row", rowBand: true, width: "fill",
      children: [{
        id: "grid", anchor: "grid", type: "container", layout: "grid", columns, gap: 0, padding: 0, width: "fill",
        children: kids.map((k, i) => ({
          id: `c${i}`, anchor: `c${i}`, type: "container", direction: "column", padding: 0,
          background: "#3355ff", minHeight: 40, children: [], ...k,
        })),
      }],
    }],
  } as unknown as BoxNode;
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

const load = async (page: Page, html: string, width: number) => {
  await page.setViewportSize({ width, height: 900 });
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#grid", { state: "attached", timeout: 10_000 });
};

const box = (page: Page, sel: string) =>
  page.locator(sel).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
  });

/** A desktop wide enough to be unambiguously on the `base` rung. */
const DESKTOP = RUNG_PX.desktop + 240;

test.describe("twelve columns", () => {
  test("a block given half a row is half as wide as the row", async ({ page }) => {
    await load(page, gridPage([{ colSpan: 6 }, { colSpan: 6 }]), DESKTOP);
    const row = await box(page, "#grid");
    const a = await box(page, "#c0");
    const b = await box(page, "#c1");
    expect(Math.abs(a.width - row.width / 2)).toBeLessThan(2);
    expect(Math.abs(b.width - row.width / 2)).toBeLessThan(2);
    expect(Math.abs(a.top - b.top), "halves sit side by side, not stacked").toBeLessThan(2);
  });

  test("mixed spans in one row — the magazine layout, which equal columns could not express", async ({ page }) => {
    await load(page, gridPage([{ colSpan: 8 }, { colSpan: 4 }]), DESKTOP);
    const row = await box(page, "#grid");
    const main = await box(page, "#c0");
    const side = await box(page, "#c1");
    expect(Math.abs(main.width - (row.width * 2) / 3), "two thirds").toBeLessThan(2);
    expect(Math.abs(side.width - row.width / 3), "one third").toBeLessThan(2);
    expect(side.left).toBeGreaterThan(main.right - 1); // the sidebar follows the main column
  });

  test("an offset leaves real empty columns before a block", async ({ page }) => {
    await load(page, gridPage([{ colSpan: 4, colStart: 9 }]), DESKTOP);
    const row = await box(page, "#grid");
    const b = await box(page, "#c0");
    // Eight of twelve columns empty, then the block: it ends at the row's right edge and starts two thirds in.
    expect(Math.abs(b.right - row.right)).toBeLessThan(2);
    expect(Math.abs(b.left - (row.left + (row.width * 2) / 3))).toBeLessThan(2);
  });

  test("a start past the end of the row is clamped, so the page never scrolls sideways", async ({ page }) => {
    await load(page, gridPage([{ colSpan: 4, colStart: 11 }]), DESKTOP);
    const row = await box(page, "#grid");
    const b = await box(page, "#c0");
    expect(b.right).toBeLessThanOrEqual(row.right + 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "no horizontal scrollbar").toBeLessThanOrEqual(1);
  });

  test("the rows share the grid's height evenly, and give it back when it shrinks", async ({ page }) => {
    // `minmax(min-content, 1fr)` on the rows, measured. Two defaults were tried and both were wrong: `auto`
    // rows with the browser's `align-content` hand the spare height out unequally, and packing to the start
    // makes every row hug, which leaves the height a person just dragged sitting unused at the bottom.
    const gridWith = (minHeight: number) => {
      const root = {
        id: "root", type: "container", direction: "column",
        children: [{
          id: "band", type: "container", direction: "row", rowBand: true, width: "fill",
          children: [{
            id: "grid", anchor: "grid", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0,
            width: "fill", minHeight,
            children: [
              { id: "a", anchor: "a", type: "container", direction: "column", padding: 0, colSpan: 6, background: "#c7d2fe", children: [{ id: "at", anchor: "at", type: "text", text: "One line" }] },
              // Given content on purpose: an EMPTY cell that paints a colour carries an 8rem floor so it is
              // visible on the published page (see the visibility test below), and that floor would mask the
              // one thing this test is measuring — how the rows divide the height between them.
              { id: "b", anchor: "b", type: "container", direction: "column", padding: 0, colSpan: 6, background: "#bbf7d0", children: [{ id: "bt", type: "text", text: "Beside it" }] },
              { id: "c", anchor: "c", type: "container", direction: "column", padding: 0, colSpan: 12, background: "#fde68a", children: [{ id: "ct", type: "text", text: "Second row" }] },
            ],
          }],
        }],
      } as unknown as BoxNode;
      const site = siteFromRoot(root);
      return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    };

    // TALL: 600px of grid, two rows — each takes half, and none of it is left over at the bottom.
    await load(page, gridWith(600), DESKTOP);
    const grid = await box(page, "#grid");
    const b = await box(page, "#b");
    let a = await box(page, "#a"), c = await box(page, "#c");
    expect(grid.height).toBeGreaterThan(560);
    expect(Math.abs(a.height - c.height), "the two rows are the same height").toBeLessThan(3);
    expect(Math.abs(a.height - grid.height / 2), "each row takes half the grid").toBeLessThan(4);
    expect(Math.abs(c.bottom - grid.bottom), "nothing is left over under the last row").toBeLessThan(3);
    expect(Math.abs(a.top - b.top), "cells in the same row line up").toBeLessThan(2);
    expect(Math.abs(a.height - b.height), "…and an empty cell fills its row alongside them").toBeLessThan(3);

    // SHORT: the space is handed straight back — the rows shrink with the grid rather than holding it open.
    await load(page, gridWith(120), DESKTOP);
    const small = await box(page, "#grid");
    a = await box(page, "#a"); c = await box(page, "#c");
    expect(small.height).toBeLessThan(160);
    expect(Math.abs(a.height - c.height)).toBeLessThan(3);
    // …but never past what the content needs to be read: the row still contains its line of text.
    const textH = await page.locator("#at").evaluate((el) => el.getBoundingClientRect().height);
    expect(a.height).toBeGreaterThanOrEqual(textH - 1);
  });

  test("empty coloured cells are VISIBLE on the published page — parent, child and grandchild alike", async ({ page }) => {
    // The regression this exists to stop, which shipped for about an hour: an empty cell was given no height
    // in the export, so a grid of empty coloured cells published as a blank white page — while the canvas went
    // on showing them, because its "drag a block in" hint gave them height there. Canvas ≠ export, in the
    // direction where the editor lies to you.
    //
    // Measured at THREE depths on purpose. The fix lives in one place that runs for every node, so covering
    // all three costs nothing and proves the claim rather than asserting it.
    const painted = (id: string, bg: string, kids: unknown[] = []) => ({
      id, anchor: id, type: "container", direction: "column", padding: 0, colSpan: 6, background: bg, children: kids,
    });
    const grid = (id: string, kids: unknown[]) => ({
      id, anchor: id, type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "fill", children: kids,
    });
    const root = {
      id: "root", type: "container", direction: "column",
      children: [{
        id: "band", type: "container", direction: "row", rowBand: true, width: "fill",
        children: [grid("grid", [
          painted("p1", "#0f766e", [grid("child", [
            painted("c1", "#7c2d12", [grid("gchild", [painted("g1", "#0d9488"), painted("g2", "#ca8a04")])]),
            painted("c2", "#1e3a8a"),
          ])]),
          painted("p2", "#b45309"),
        ])],
      }],
    } as unknown as BoxNode;
    const site = siteFromRoot(root);
    await load(page, renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }), DESKTOP);
    // Every painted cell, at every depth, has real height AND actually paints.
    for (const id of ["p1", "p2", "c1", "c2", "g1", "g2"]) {
      const b = await box(page, `#${id}`);
      expect(b.height, `${id} must be visible on the published page`).toBeGreaterThan(20);
      expect(b.width, `${id} must have width`).toBeGreaterThan(20);
      const bg = await page.locator(`#${id}`).evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(bg, `${id} must paint its colour`).not.toBe("rgba(0, 0, 0, 0)");
    }
    // …and the page itself is not blank.
    const pageH = await page.evaluate(() => document.body.getBoundingClientRect().height);
    expect(pageH).toBeGreaterThan(100);
  });

  test("a grid inside a grid takes the height of the cell it is in", async ({ page }) => {
    // The bug: the outer cell was full height, the inner grid sat in the top of it at its own content height,
    // and the gap underneath read as a broken layout. A grid divides the space it is GIVEN — so it fills it.
    const cell = (id: string, kids: unknown[] = []) => ({
      id, anchor: id, type: "container", direction: "column", padding: 0, colSpan: 6, children: kids,
    });
    const root = {
      id: "root", type: "container", direction: "column",
      children: [{
        id: "band", type: "container", direction: "row", rowBand: true, width: "fill",
        children: [{
          id: "outer", anchor: "grid", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0,
          width: "fill", minHeight: 500,
          children: [
            cell("host", [{
              id: "inner", anchor: "inner", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0,
              width: "fill", children: [cell("i1"), cell("i2")],
            }]),
            cell("side"),
          ],
        }],
      }],
    } as unknown as BoxNode;
    // NORMALISED, like the real builder. `normalizeRowBands` inserts a structural band between a cell and
    // whatever is inside it, so a nested grid is never a cell's direct child. A hand-built tree skips that
    // step — which is exactly how the first version of this test passed while the app stayed broken.
    const site = siteFromRoot(normalizeRowBands(root));
    await load(page, renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }), DESKTOP);
    const host = await box(page, "#host");
    const inner = await box(page, "#inner");
    expect(host.height, "the outer cell has real height to give").toBeGreaterThan(400);
    expect(Math.abs(inner.height - host.height), "the inner grid fills its cell").toBeLessThan(3);
    // …and the inner grid's own cells then share that height between them, the same rule one level down.
    const i1 = await box(page, "#i1");
    expect(Math.abs(i1.height - inner.height), "a single inner row takes the inner grid's height").toBeLessThan(3);
  });

  test("a cell's typography cascades into everything inside it, and a block can still differ", async ({ page }) => {
    // The behaviour the whole role-variable mechanism exists for. Before it, every block wrote its colour and
    // family EXPLICITLY with a theme fallback, and an explicit value on a child beats an inherited one — so a
    // colour set on a cell reached nothing at all. Measured as COMPUTED colour, because that is the only thing
    // that proves inheritance actually happened rather than a class being present.
    const root = {
      id: "root", type: "container", direction: "column",
      children: [{
        id: "band", type: "container", direction: "row", rowBand: true, width: "fill",
        children: [{
          id: "grid", anchor: "grid", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "fill",
          children: [{
            id: "cell", anchor: "cell", type: "container", direction: "column", padding: 0, colSpan: 12,
            color: "#1188ff", fontFamily: "Georgia, serif", fontSize: 20,
            children: [
              { id: "h", anchor: "h", type: "heading", text: "Inherits the cell" },
              { id: "p", anchor: "p", type: "text", text: "Also inherits" },
              { id: "own", anchor: "own", type: "text", text: "Speaks for itself", color: "#dd2200" },
            ],
          }],
        }],
      }],
    } as unknown as BoxNode;
    const site = siteFromRoot(root);
    await load(page, renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }), DESKTOP);
    const styleOf = (sel: string) => page.locator(sel).evaluate((el) => {
      const t = el.querySelector("h2, p") ?? el;
      const cs = getComputedStyle(t);
      return { color: cs.color, family: cs.fontFamily, size: parseFloat(cs.fontSize) };
    });
    const h = await styleOf("#h"), p = await styleOf("#p"), own = await styleOf("#own");
    expect(h.color, "the heading takes the cell's colour").toBe("rgb(17, 136, 255)");
    expect(p.color, "and so does the paragraph, which has a DIFFERENT role default").toBe("rgb(17, 136, 255)");
    expect(h.family).toContain("Georgia");
    expect(p.family).toContain("Georgia");
    // The size is PROPORTIONAL, not flattened. Asserted as a RATIO rather than a pixel count, because sizes
    // are emitted in the fluid base unit (`u()`) and their px value depends on the viewport — the claim being
    // made is that a heading stays twice its body, so setting one size on the cell scales the pair instead of
    // collapsing them into the same number, which is what a single inherited `font-size` would have done.
    const plain = await styleOf("#p");
    expect(h.size / plain.size).toBeCloseTo(2, 1);
    expect(p.size).toBeGreaterThan(0);
    // …and a block that states its own colour still wins over the cell.
    expect(own.color).toBe("rgb(221, 34, 0)");
    expect(own.family, "while still inheriting what it did NOT state").toContain("Georgia");
  });

  test("start and span on BOTH axes — the magazine layout, measured", async ({ page }) => {
    // A tall feature down the left, two stacked cards to its right. This is the pattern the plan calls the
    // proof that the model is a superset of rectangular placement: anything sketchable on graph paper.
    await load(page, gridPage([
      { colSpan: 5, colStart: 1, rowStart: 1, rowSpan: 2 },
      { colSpan: 7, colStart: 6, rowStart: 1 },
      { colSpan: 7, colStart: 6, rowStart: 2 },
    ]), DESKTOP);
    const row = await box(page, "#grid");
    const feature = await box(page, "#c0");
    const top = await box(page, "#c1");
    const bottom = await box(page, "#c2");
    // The feature is five twelfths wide and as tall as both cards together.
    expect(Math.abs(feature.width - (row.width * 5) / 12)).toBeLessThan(3);
    expect(Math.abs(feature.top - top.top), "it starts level with the first card").toBeLessThan(2);
    expect(Math.abs(feature.bottom - bottom.bottom), "and ends level with the second").toBeLessThan(2);
    // The cards sit beside it, stacked.
    expect(top.left).toBeGreaterThan(feature.right - 1);
    expect(bottom.top).toBeGreaterThan(top.bottom - 1);
    expect(Math.abs(top.left - bottom.left), "both cards start in the same column").toBeLessThan(2);
  });

  test("order puts the photo above the words on a phone and beside them on a desktop", async ({ page }) => {
    // The pattern the audit called impossible: `order` was not a field, so the only way to reorder anything was
    // to move it in the tree — which moves it on every screen at once.
    const html = gridPage([
      { colSpan: 6, id: "words" },
      { colSpan: 6, id: "photo", responsive: { phone: { order: -1 } } },
    ]);
    await load(page, html, DESKTOP);
    const words = await box(page, "#c0");
    const photo = await box(page, "#c1");
    expect(photo.left, "beside, and second, on a desktop").toBeGreaterThan(words.left);

    await load(page, html, 375);
    const wordsP = await box(page, "#c0");
    const photoP = await box(page, "#c1");
    expect(photoP.top, "above, on a phone").toBeLessThan(wordsP.top);
  });

  test("push moves one block and leaves its neighbours alone", async ({ page }) => {
    // A flex row, because push is not a grid idea — it is the nav-link-on-the-far-right idiom.
    const root = {
      id: "root", type: "container", direction: "column",
      children: [{
        id: "band", type: "container", direction: "row", rowBand: true, width: "fill",
        children: [{
          id: "nav", anchor: "nav", type: "container", direction: "row", gap: 0, padding: 0, width: "fill", wrap: false,
          children: [
            { id: "a", anchor: "a", type: "text", text: "Home", width: "80px" },
            { id: "b", anchor: "b", type: "text", text: "About", width: "80px" },
            { id: "c", anchor: "c", type: "text", text: "Apply", width: "80px", push: "end" },
          ],
        }],
      }],
    } as unknown as BoxNode;
    const site = siteFromRoot(root);
    await page.setViewportSize({ width: DESKTOP, height: 900 });
    await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }), { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#nav", { state: "attached", timeout: 10_000 });
    const nav = await box(page, "#nav");
    const a = await box(page, "#a");
    const b = await box(page, "#b");
    const c = await box(page, "#c");
    expect(Math.abs(a.left - nav.left), "the first link has not moved").toBeLessThan(2);
    expect(Math.abs(b.left - a.right), "nor has the second").toBeLessThan(2);
    expect(Math.abs(c.right - nav.right), "only the pushed one is at the far edge").toBeLessThan(2);
  });

  test("a twelve-column row collapses to one on a phone, and nothing spills off the screen", async ({ page }) => {
    const html = gridPage([{ colSpan: 4 }, { colSpan: 4 }, { colSpan: 4 }]);
    await load(page, html, 375);
    const row = await box(page, "#grid");
    const cells = [await box(page, "#c0"), await box(page, "#c1"), await box(page, "#c2")];
    for (const c of cells) expect(Math.abs(c.width - row.width), "each block is full width").toBeLessThan(2);
    expect(cells[1].top).toBeGreaterThan(cells[0].bottom - 1); // stacked, in order
    expect(cells[2].top).toBeGreaterThan(cells[1].bottom - 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "no horizontal scrollbar on a phone").toBeLessThanOrEqual(1);
  });

  test("a tablet held upright gets two columns, and a wider one gets all twelve", async ({ page }) => {
    const html = gridPage([{ colSpan: 4 }, { colSpan: 4 }, { colSpan: 4 }]);
    await load(page, html, RUNG_PX.tabletPortrait + 80);
    let cells = [await box(page, "#c0"), await box(page, "#c1"), await box(page, "#c2")];
    expect(Math.abs(cells[0].top - cells[1].top), "two up").toBeLessThan(2);
    expect(cells[2].top, "and the third wraps").toBeGreaterThan(cells[0].bottom - 1);

    await load(page, html, RUNG_PX.tabletLandscape + 80);
    cells = [await box(page, "#c0"), await box(page, "#c1"), await box(page, "#c2")];
    expect(Math.abs(cells[0].top - cells[2].top), "three up, once the row is twelve columns again").toBeLessThan(2);
  });

  test("saying what a phone should do turns the stacking off", async ({ page }) => {
    // The escape hatch is the control itself: set a column count with a narrow device selected and the default
    // stands aside from that rung down. Without it, a two-up phone photo gallery would be unbuildable — the
    // default would be a rule with no way out, which is worse than no default.
    await load(page, gridPage([{ colSpan: 6 }, { colSpan: 6 }]), 375);
    expect((await box(page, "#c1")).top, "stacked by default").toBeGreaterThan((await box(page, "#c0")).bottom - 1);

    const root = {
      id: "root", type: "container", direction: "column",
      children: [{
        id: "band", type: "container", direction: "row", rowBand: true, width: "fill",
        children: [{
          id: "grid", anchor: "grid", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "fill",
          responsive: { phone: { columns: 2 } },
          children: [
            { id: "c0", anchor: "c0", type: "container", direction: "column", padding: 0, background: "#3355ff", minHeight: 40, colSpan: 6, responsive: { phone: { colSpan: 1 } }, children: [] },
            { id: "c1", anchor: "c1", type: "container", direction: "column", padding: 0, background: "#33aa55", minHeight: 40, colSpan: 6, responsive: { phone: { colSpan: 1 } }, children: [] },
          ],
        }],
      }],
    } as unknown as BoxNode;
    const site = siteFromRoot(root);
    await load(page, renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }), 375);
    const a = await box(page, "#c0");
    const b = await box(page, "#c1");
    expect(Math.abs(a.top - b.top), "two up on a phone, because the page said so").toBeLessThan(2);
    expect(b.left).toBeGreaterThan(a.right - 1);
  });
});
