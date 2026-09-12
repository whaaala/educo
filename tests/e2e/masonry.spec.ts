import { test, expect, type Page } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { RUNG_PX } from "@/lib/educo-ui/layout";

/**
 * MASONRY, measured in a browser.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature ("Row heights").
 *
 * The unit tests prove which declarations come out of the model. Only a browser can prove the three things
 * that actually matter about a gallery, because all three are claims about geometry:
 *   • the pictures STAGGER — a cell begins where the one above it ended, not where its neighbours' row ended;
 *   • nothing is ever CROPPED and nothing ever OVERLAPS, whatever the span arithmetic got slightly wrong;
 *   • the reading order is unchanged, which is the entire reason `columns` was rejected.
 *
 * The page is rendered from the EXPORT, so what is measured here is what a visitor gets. The canvas agrees by
 * construction — both build their boxes from `containerStyle`/`childStyle`.
 */

type Cell = { h?: number; ratio?: [number, number]; span?: number };

/** A gallery page. `contained` puts the grid on the page measure, which is the case B is exact for. */
const galleryPage = (cells: Cell[], opts: { masonry?: boolean; measure?: boolean; contained?: boolean; gap?: number } = {}) => {
  const root = {
    id: "root", type: "container", direction: "column",
    children: [{
      id: "band", type: "container", direction: "row", rowBand: true, width: "fill",
      sectionWidth: opts.contained ? "contained" : undefined,
      children: [{
        id: "grid", anchor: "grid", type: "container", layout: "grid", columns: 12,
        gap: opts.gap ?? 16, padding: 0, width: "fill",
        rowFlow: opts.masonry === false ? undefined : "masonry",
        rowMeasure: opts.measure || undefined,
        children: cells.map((c, i) => ({
          id: `c${i}`, anchor: `c${i}`, type: "container", direction: "column", padding: 0,
          background: i % 2 ? "#3355ff" : "#ff5533", colSpan: c.span ?? 4,
          height: c.h ? `${c.h}px` : "auto",
          children: c.ratio
            ? [{ id: `p${i}`, anchor: `p${i}`, type: "image", src: svg(c.ratio[0], c.ratio[1]), alt: `photo ${i}`, width: "100%", height: "auto", imgW: c.ratio[0], imgH: c.ratio[1] }]
            : [],
        })),
      }],
    }],
  } as unknown as BoxNode;
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

/**
 * A picture of an exact shape, with no bytes to wait for.
 *
 * BASE64, not `;utf8,` + percent-encoding: `utf8` is not a media-type parameter, so Chrome drops the whole
 * URI and every picture on the page is broken. The geometry still looked right — `aspect-ratio` comes from
 * `imgW`/`imgH`, so the box keeps its shape whether the image arrives or not — which is precisely why a
 * broken one can sit in a passing test unnoticed.
 */
const svg = (w: number, h: number) =>
  "data:image/svg+xml;base64," + Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#123"/></svg>`,
    "utf8",
  ).toString("base64");

const load = async (page: Page, html: string, width: number) => {
  await page.setViewportSize({ width, height: 1200 });
  await page.setContent(html, { waitUntil: "load" });
  await page.waitForSelector("#grid", { state: "attached", timeout: 10_000 });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
};

const boxes = (page: Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((el) => {
    const r = el.getBoundingClientRect();
    return { id: el.id, left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
  }));

const DESKTOP = RUNG_PX.desktop + 240;

test.describe("masonry", () => {
  test("a cell begins where the one above it ended — that IS the stagger", async ({ page }) => {
    // Three columns, a tall picture in the first and short ones beside it. With EVEN rows the second row
    // begins level, under the tallest cell. With masonry each column carries on independently, so the cell
    // under the SHORT one starts far higher than the cell under the tall one.
    await load(page, galleryPage([
      { ratio: [400, 900] }, { ratio: [400, 300] }, { ratio: [400, 300] },
      { ratio: [400, 300] }, { ratio: [400, 300] }, { ratio: [400, 300] },
    ], { contained: true }), DESKTOP);
    const cs = await boxes(page, "#grid > div");
    expect(cs).toHaveLength(6);
    const [tall, mid, right, fourth, fifth] = cs;
    expect(mid.top, "the first three start level").toBeCloseTo(tall.top, 0);
    expect(right.top).toBeCloseTo(tall.top, 0);
    // THE STAGGER. The fourth block does not wait for the tall picture to finish — the grid's own auto-
    // placement drops it into the first gap that opens up, which is under the short middle one. With even
    // rows it would sit level with the bottom of the tallest cell in the row, hundreds of pixels lower.
    expect(fourth.left, "it fills the middle column").toBeCloseTo(mid.left, 0);
    expect(fourth.top).toBeGreaterThan(mid.bottom - 4);
    expect(fourth.top, "and far above where an even row would have put it").toBeLessThan(tall.bottom - 40);
    expect(fifth.left).toBeCloseTo(right.left, 0);
    expect(fifth.top).toBeGreaterThan(right.bottom - 4);
  });

  test("nothing overlaps and nothing is cropped, even where the span can only be an estimate", async ({ page }) => {
    // AN EDGE-TO-EDGE BAND is the approximate case: its width is the viewport rather than the page measure,
    // so the static span is worked out against a narrower cell than the one the browser gives. A FIXED row
    // track would let every cell paint over the one below it. `minmax(unit, auto)` is what makes an
    // under-estimate cost a little evenness instead of the whole layout — this is the guard for that clause.
    await load(page, galleryPage([
      { ratio: [400, 900] }, { ratio: [400, 300] }, { ratio: [400, 500] },
      { ratio: [400, 260] }, { ratio: [400, 700] }, { ratio: [400, 400] },
    ], { contained: false }), DESKTOP);
    const cs = await boxes(page, "#grid > div");
    const imgs = await boxes(page, "#grid img");
    // Nothing cropped: every picture sits inside the cell that holds it.
    for (const [i, img] of imgs.entries()) {
      expect(img.bottom, `picture ${i} is not cut off by its cell`).toBeLessThanOrEqual(cs[i].bottom + 1);
    }
    // Nothing overlaps: two cells in the same column never share a pixel of the page.
    for (let i = 0; i < cs.length; i++) {
      for (let j = i + 1; j < cs.length; j++) {
        const sameColumn = cs[i].left < cs[j].right - 1 && cs[j].left < cs[i].right - 1;
        if (!sameColumn) continue;
        const overlaps = cs[i].top < cs[j].bottom - 1 && cs[j].top < cs[i].bottom - 1;
        expect(overlaps, `cell ${i} and cell ${j} share a column and must not share space`).toBe(false);
      }
    }
  });

  test("the blocks still read in the order they were put in", async ({ page }) => {
    // The whole reason CSS `columns` was rejected. A gallery is scanned left-to-right, so numbered captions
    // and newest-first ordering have to run ACROSS the row, not down each column.
    await load(page, galleryPage([
      { ratio: [400, 900] }, { ratio: [400, 300] }, { ratio: [400, 300] },
      { ratio: [400, 300] }, { ratio: [400, 300] }, { ratio: [400, 300] },
    ], { contained: true }), DESKTOP);
    const ids = await page.locator("#grid > div").evaluateAll((els) => els.map((e) => e.id));
    expect(ids).toEqual(["c0", "c1", "c2", "c3", "c4", "c5"]);
    const cs = await boxes(page, "#grid > div");
    // …and reading order matches SEEING order across the first row: left, middle, right.
    expect(cs[0].left).toBeLessThan(cs[1].left);
    expect(cs[1].left).toBeLessThan(cs[2].left);
  });

  test("the space the user asked for is the space between the pictures", async ({ page }) => {
    // The down-gap is spent as empty row units rather than as `row-gap`, so this is the assertion that the
    // number in the panel still means what it says on the page.
    await load(page, galleryPage([
      { h: 200 }, { h: 200 }, { h: 200 }, { h: 200 }, { h: 200 }, { h: 200 },
    ], { contained: true, gap: 24 }), DESKTOP);
    const cs = await boxes(page, "#grid > div");
    const down = cs[3].top - cs[0].bottom;
    expect(down, "roughly the gap that was asked for, never zero and never double").toBeGreaterThan(16);
    expect(down).toBeLessThan(40);
    const across = cs[1].left - cs[0].right;
    expect(across, "the across gap is untouched").toBeGreaterThan(8);
  });

  test("on a phone it is a plain stack — no ruler, no rounding", async ({ page }) => {
    await load(page, galleryPage([
      { ratio: [400, 900] }, { ratio: [400, 300] }, { ratio: [400, 300] },
    ], { contained: true }), 375);
    const cs = await boxes(page, "#grid > div");
    for (let i = 1; i < cs.length; i++) {
      expect(cs[i].left, "one column").toBeCloseTo(cs[0].left, 0);
      expect(cs[i].top, "each below the last").toBeGreaterThan(cs[i - 1].bottom - 2);
    }
  });

  test("`Even` is byte-for-byte the layout every saved page already has", async ({ page }) => {
    // The safety of shipping this at all: choosing Even, or never touching the control, must not move a pixel.
    // Pictures of three different shapes, no stated heights — so the cells take whatever the row gives them.
    await load(page, galleryPage([{ ratio: [400, 900] }, { ratio: [400, 300] }, { ratio: [400, 300] }], { masonry: false, contained: true }), DESKTOP);
    const cs = await boxes(page, "#grid > div");
    expect(cs[1].height, "even rows share the height — the behaviour masonry exists to offer an alternative to").toBeCloseTo(cs[0].height, 0);
    expect(cs[2].height).toBeCloseTo(cs[0].height, 0);
    expect(cs[1].top).toBeCloseTo(cs[0].top, 0);
  });

  test("measuring on the page fixes what the model could only guess at", async ({ page }) => {
    // TEXT, not photos: a cell whose height nothing can know statically, so B falls back to the assumed 4:3
    // and the layout is staggered but loose. With the tick-box on, the script measures the real thing.
    const cells: Cell[] = [{}, {}, {}, {}, {}, {}];
    const html = galleryPage(cells, { contained: true, measure: true });
    expect(html, "the script only ships when it was asked for").toContain("__euMasonry");
    await load(page, html, DESKTOP);
    const cs = await boxes(page, "#grid > div");
    // Every cell is empty, so all six are the same height, so the second row must begin one gap below the
    // first — no leftover air from a 4:3 assumption that was never true.
    const gapDown = cs[3].top - cs[0].bottom;
    expect(gapDown).toBeGreaterThan(4);
    expect(gapDown, "the assumed shape has been measured away").toBeLessThan(40);
  });

  test("the script hands the spans back when the window becomes a phone", async ({ page }) => {
    await load(page, galleryPage([{ ratio: [400, 900] }, { ratio: [400, 300] }, { ratio: [400, 300] }], { contained: true, measure: true }), DESKTOP);
    await page.setViewportSize({ width: 375, height: 1200 });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const rows = await page.locator("#grid > div").evaluateAll((els) => els.map((e) => (e as HTMLElement).style.gridRow));
    expect(rows.every((r) => r === ""), "a desktop's ruler must not survive into the stack").toBe(true);
  });
});
