import { test, expect, type Page } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { normalizeSite, siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { seedSite } from "./helpers/seed-site";

/**
 * AN IN-PAGE LINK LANDS BELOW THE PINNED BAR, NOT BEHIND IT — Phase 3, Step 2d.
 *
 * Behaviours: tests/features/components/website/box-builder-floating.feature.
 *
 * A bar set to "Floats on screen" is lifted out of the flow, so nothing reserves its space and the page runs
 * underneath it. That is the point of it — but it means the browser's idea of "the top of the page" is still
 * the very top, several centimetres above what the reader can actually see. Follow a link to "#term-dates" and
 * the heading you asked for is scrolled to y=0, which is *behind* the bar. On a school site that is the
 * commonest navigation there is: a nav bar that holds, linking to sections of the same page.
 *
 * `scroll-padding-top` on the scroll container is the property for exactly this — it tells the browser where
 * the usable top of the scrollport is, and every scroll it performs itself (a fragment link, `scrollIntoView`,
 * Page Down, snapping) respects it.
 *
 * WHY IT HAS TO BE MEASURED, and not typed: the padding is the bar's RENDERED height. Summing heights someone
 * entered is wrong for a bar whose height is just its text — the common case — and wrong again wherever that
 * text wraps. That is the same argument 2c settled, so this rides on 2c's pass rather than adding a second
 * mechanism: one measurement, one place.
 *
 * ASSERTED AS GEOMETRY, and deliberately not as CSS text. `scroll-padding-top: 64px` in a stylesheet says
 * nothing about where a link actually lands — a page whose variable is never set would pass such a test, which
 * is the failure this exists to catch.
 */

const bar = (id: string, h: number, bg: string, extra: Record<string, unknown> = {}) =>
  ({
    id, type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: h,
    background: bg, pin: "top", hold: "fixed", ...extra,
  } as unknown as BoxNode);

const filler = (id: string, h: number, bg: string, extra: Record<string, unknown> = {}) =>
  ({
    id, type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: h,
    background: bg, children: [], ...extra,
  } as unknown as BoxNode);

/**
 * A held nav, a link to a section far down the page, and that section carrying the anchor.
 *
 * The link sits BELOW an intro band rather than straight under the bars, because a held bar reserves no space
 * and the page runs underneath it — so a link placed there is genuinely unreachable, which is the documented
 * cost of "Floats on screen" (the Inspector says so and offers "Keep its space instead"). The first version of
 * this fixture put the link at the top and the test failed on a CLICK TIMEOUT rather than on the landing, which
 * would have been a fault in the test reported as a fault in the page.
 */
const linkedPage = (bars: BoxNode[]): BoxNode => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    ...bars,
    filler("intro", 220, "#ffffff"),
    { id: "jump", type: "button", text: "Term dates", href: "#term-dates", width: "auto" } as unknown as BoxNode,
    filler("above", 1500, "#eef2ff"),
    filler("target", 400, "#fecdd3", { anchor: "term-dates" }),
    filler("below", 1500, "#ecfdf5"),
  ],
} as unknown as BoxNode);

/** The same page with nothing pinned — the control, and the zero-cost case. */
const unpinnedPage = (): BoxNode => linkedPage([filler("plainnav", 64, "#0d3b1e")]);

async function show(page: Page, root: BoxNode, route = "/__anchors") {
  const site = normalizeSite(siteFromRoot(root), 0);
  const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
  await page.route(`**${route}`, (r) => r.fulfill({ contentType: "text/html", body: html }));
  await page.goto(route);
  await page.waitForTimeout(400); // the measuring pass runs in a frame, then again on load
  return html;
}

/** Follow the link the way a reader does, then report where the target came to rest. */
async function followLink(page: Page) {
  await page.locator('a[href="#term-dates"]').first().click();
  await page.waitForTimeout(500); // the scroll, and any smooth behaviour, settle
  return page.evaluate(() => {
    const t = document.querySelector<HTMLElement>(".bx-target")!;
    const bars = Array.from(document.querySelectorAll<HTMLElement>("[data-eu-pin='top']"))
      .filter((el) => ["fixed", "sticky"].includes(getComputedStyle(el).position));
    const coveredTo = bars.reduce((m, el) => Math.max(m, el.getBoundingClientRect().bottom), 0);
    return {
      targetTop: Math.round(t.getBoundingClientRect().top),
      coveredTo: Math.round(coveredTo),
      barCount: bars.length,
      scrollPaddingTop: getComputedStyle(document.documentElement).scrollPaddingTop,
    };
  });
}

test.describe("an in-page link clears the bar that is held over the page", () => {
  test("with ONE held bar, the target lands below it rather than underneath it", async ({ page }) => {
    await show(page, linkedPage([bar("nav", 64, "#0d3b1e")]));
    const r = await followLink(page);

    expect(r.barCount, "the bar really is held over the page").toBe(1);
    expect(r.coveredTo, "the bar covers the top of the screen").toBeGreaterThan(50);
    expect(
      r.targetTop,
      `the section landed at y=${r.targetTop}, behind a bar reaching to y=${r.coveredTo} — the reader follows the link and sees the wrong thing`,
    ).toBeGreaterThanOrEqual(r.coveredTo - 2);
  });

  /**
   * TWO bars of different heights, because a padding that happens to equal the first bar's height would pass a
   * single-bar test and still hide the target behind the second. The same trap the 2c bottom stack fell into.
   */
  test("with TWO stacked bars, the landing clears BOTH of them", async ({ page }) => {
    await show(page, linkedPage([bar("nav", 64, "#0d3b1e"), bar("notice", 40, "#8c0f52")]));
    const r = await followLink(page);

    expect(r.barCount, "both bars are held").toBe(2);
    expect(r.coveredTo, "together they cover more than either alone").toBeGreaterThan(90);
    expect(
      r.targetTop,
      `the section landed at y=${r.targetTop} but the stack reaches y=${r.coveredTo}`,
    ).toBeGreaterThanOrEqual(r.coveredTo - 2);
  });

  test("a page with nothing pinned is left completely alone", async ({ page }) => {
    await show(page, unpinnedPage());
    const r = await followLink(page);

    expect(r.barCount, "nothing is held over this page").toBe(0);
    // No bar, so no padding is owed — and the target should sit at the very top, as it always has.
    expect(Math.abs(r.targetTop), "the target lands at the top of the screen").toBeLessThan(3);
    expect(["0px", "auto"], `scroll-padding-top was set to ${r.scrollPaddingTop} on a page with no pinned bar`)
      .toContain(r.scrollPaddingTop);
  });

  test("the padding tracks the bar, not a number typed into it", async ({ page }) => {
    // The bar's stored height is 64, but its RENDERED height is what the reader is covered by. Asserting the
    // relationship rather than the number is what keeps this true when the bar's text wraps.
    await show(page, linkedPage([bar("nav", 64, "#0d3b1e")]));
    const measured = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>(".bx-nav")!;
      return {
        rendered: Math.round(el.getBoundingClientRect().height),
        padding: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0,
      };
    });
    expect(measured.padding, `padding ${measured.padding} vs a rendered bar of ${measured.rendered}`)
      .toBeGreaterThanOrEqual(measured.rendered - 2);
  });
});

/**
 * AND IT HAS TO WORK IN THE PREVIEW, which is the only place a teacher can check their own navigation.
 *
 * The preview renders the REAL exported HTML, but as a `srcDoc` document — whose URL is `about:srcdoc`. Chrome
 * updates `location.hash` for a fragment link in such a document and never performs the scroll. Measured: the
 * hash became `#term-dates` and `scrollTop` stayed at **0**, while the very same export served over http
 * scrolled correctly. So a nav pointing at sections of the same page — the commonest navigation a school site
 * has — did nothing in the one place it would be tried, and the guide promises the preview shows "exactly what
 * a visitor sees".
 *
 * Asserted through the real Preview button, in the real iframe, because that is the only arrangement in which
 * the fault exists at all: every export-side test in this file passed throughout.
 */
test.describe("an in-page link works in the Preview, not just on the published page", () => {
  test("clicking it scrolls, and the target lands at the usable top under the bar", async ({ page }) => {
    await seedSite(page, {
      version: 1, homeId: "p1",
      pages: [{ id: "p1", name: "Home", slug: "index", root: linkedPage([bar("nav", 64, "#0d3b1e")]) }],
    });
    await page.waitForSelector('[data-box-id="target"]', { state: "attached", timeout: 30000 });
    await page.waitForTimeout(600);

    await page.locator('button[title="See it as a visitor"]').first().click();
    await page.waitForTimeout(2200); // the iframe writes srcDoc, then the measuring pass runs

    const frame = page.frames().find((f) => f !== page.mainFrame());
    expect(frame, "the preview iframe is there").toBeTruthy();

    const before = await frame!.evaluate(() => Math.round(document.documentElement.scrollTop));
    expect(before, "the preview opens at the top").toBe(0);

    await frame!.locator('a[href="#term-dates"]').first().click();
    await page.waitForTimeout(800);

    const r = await frame!.evaluate(() => {
      const t = document.getElementById("term-dates")!;
      const bars = Array.from(document.querySelectorAll<HTMLElement>("[data-eu-pin='top']"))
        .filter((el) => ["fixed", "sticky", "absolute"].includes(getComputedStyle(el).position));
      return {
        scrolled: Math.round(document.documentElement.scrollTop),
        targetTop: Math.round(t.getBoundingClientRect().top),
        coveredTo: Math.round(bars.reduce((m, el) => Math.max(m, el.getBoundingClientRect().bottom), 0)),
      };
    });

    // The scroll HAPPENED — without this the next assertion passes on a page that never moved, because a
    // target below the fold is trivially "not behind the bar". That is exactly how the first version of this
    // measurement reported success while the link did nothing.
    expect(r.scrolled, "the preview actually scrolled").toBeGreaterThan(200);
    expect(r.coveredTo, "the bar is held over the preview").toBeGreaterThan(50);
    expect(
      r.targetTop,
      `the section landed at y=${r.targetTop}; the bar reaches y=${r.coveredTo}`,
    ).toBeGreaterThanOrEqual(r.coveredTo - 2);
  });
});
