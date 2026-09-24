import { test, expect, type Page } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { normalizeSite, siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { seedSite } from "./helpers/seed-site";

/**
 * TWO BARS HELD AT THE SAME EDGE SIT UNDER ONE ANOTHER — Phase 3, Step 2c.
 *
 * Behaviours: tests/features/components/website/box-builder-floating.feature.
 *
 * Reported by the user: three bands each set to stay on screen all pinned to the top and covered each other,
 * so two of the three were invisible. Each was doing exactly what it was told — "hold against the top" — and
 * with one offset apiece, the top is where they all went.
 *
 * WHY THIS NEEDS A MEASURING PASS AT ALL, since that is the part worth defending: to put the second bar under
 * the first, its offset must be the first bar's RENDERED height, and CSS cannot ask that question. Summing
 * the heights someone TYPED is silently wrong for a bar whose height is just its text — the common case — and
 * wrong again at any width where that text wraps to a second line. So the page measures, in the same shape
 * masonry already uses: the canvas calls the function and the export ships its source.
 *
 * Everything below is asserted as GEOMETRY. A test that reads the `top` declaration would pass on a page
 * where the variable is never set, which is precisely the failure this is here to catch.
 */

const bar = (id: string, h: number, bg: string, extra: Record<string, unknown> = {}) =>
  ({
    id, type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: h,
    background: bg, pin: "top", hold: "fixed", ...extra,
  } as unknown as BoxNode);

/** Three bars of DIFFERENT heights, so a stack that is merely "not overlapping" cannot pass by accident. */
const page3 = (): BoxNode => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    bar("b1", 40, "#0d3b1e"),
    bar("b2", 64, "#8c0f52"),
    bar("b3", 32, "#1d4ed8"),
    { id: "body", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 2000, background: "#f8fafc", children: [] } as unknown as BoxNode,
  ],
} as unknown as BoxNode);

/** One bar at the top and one at the bottom — two stacks of one, which must not be pushed anywhere. */
const pageEnds = (): BoxNode => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    bar("top1", 48, "#0d3b1e"),
    { id: "body", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 2000, background: "#f8fafc", children: [] } as unknown as BoxNode,
    bar("bot1", 56, "#7c3aed", { pin: "bottom" }),
  ],
} as unknown as BoxNode);

/**
 * TWO bars at the BOTTOM, which is the only fixture that can tell the bottom stack's direction.
 *
 * Written because the guard was mutation-proven and this case was the one that got away: reversing the order
 * the bottom stack is built in left all four tests passing, since the only bottom fixture held a single bar
 * and a stack of one reads the same in both directions. The comment in the test below had even said so — and
 * then the two-bar fixture it described was never built. That is the same shape as the two-cell resize row
 * and the five-click drill-in: a case chosen where the bug cannot appear.
 */
const pageTwoBottom = (): BoxNode => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    { id: "body", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 2000, background: "#f8fafc", children: [] } as unknown as BoxNode,
    bar("cookie", 72, "#7c3aed", { pin: "bottom" }),
    bar("totop", 40, "#b45309", { pin: "bottom" }),
  ],
} as unknown as BoxNode);

async function show(page: Page, root: BoxNode, route = "/__pins") {
  const site = normalizeSite(siteFromRoot(root), 0);
  const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
  await page.route(`**${route}`, (r) => r.fulfill({ contentType: "text/html", body: html }));
  await page.goto(route);
  await page.waitForTimeout(400); // the pass runs in a frame, then again on load
}

const rect = (page: Page, id: string) => page.evaluate((i) => {
  const el = document.querySelector<HTMLElement>(`.bx-${i}`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) };
}, id);

test.describe("pinned bars stack instead of covering each other", () => {
  test("three bars held at the top sit one under the next, and none is hidden", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await show(page, page3());

    const r1 = (await rect(page, "b1"))!;
    const r2 = (await rect(page, "b2"))!;
    const r3 = (await rect(page, "b3"))!;
    for (const [id, r] of [["b1", r1], ["b2", r2], ["b3", r3]] as const) {
      expect(r, `${id} is not on the page at all`).not.toBeNull();
      expect(r.h, `${id} rendered ${r.h}px tall`).toBeGreaterThan(0);
    }

    expect(r1.top, "the first bar holds at the very top").toBe(0);
    expect(r2.top, `the second bar starts at ${r2.top}, but the first ends at ${r1.bottom}`).toBe(r1.bottom);
    expect(r3.top, `the third bar starts at ${r3.top}, but the second ends at ${r2.bottom}`).toBe(r2.bottom);

    // …and stated as the property, so a future change that keeps them apart some OTHER way still passes.
    const overlaps = (a: typeof r1, b: typeof r1) => a.top < b.bottom && b.top < a.bottom;
    expect(overlaps(r1, r2) || overlaps(r2, r3) || overlaps(r1, r3), "two bars are drawn on top of each other").toBe(false);
  });

  test("they stay stacked after the page has been scrolled", async ({ page }) => {
    // The whole point of a pinned bar is what it does once the page moves. A stack that is only correct at
    // scroll position 0 has not been tested at all.
    await page.setViewportSize({ width: 1280, height: 800 });
    await show(page, page3());
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(250);

    const r1 = (await rect(page, "b1"))!;
    const r2 = (await rect(page, "b2"))!;
    const r3 = (await rect(page, "b3"))!;
    expect(r1.top, "the first bar is still held at the top after scrolling").toBe(0);
    expect(r2.top).toBe(r1.bottom);
    expect(r3.top).toBe(r2.bottom);
  });

  test("a bar at the top and a bar at the bottom are two stacks, and neither is offset", async ({ page }) => {
    /**
     * The mirror of the bug: stacking must not push a lone bar away from its edge. The bottom stack also
     * builds UPWARDS, so "nearest the edge is first" has to be read in the right direction — getting that
     * backwards is invisible with one bar and obvious with two.
     */
    await page.setViewportSize({ width: 1280, height: 800 });
    await show(page, pageEnds(), "/__pins2");
    const top1 = (await rect(page, "top1"))!;
    const bot1 = (await rect(page, "bot1"))!;
    expect(top1.top, "the only top bar is at the top").toBe(0);
    expect(bot1.bottom, "the only bottom bar is at the bottom of the window").toBe(800);
  });

  test("a bottom stack builds UPWARDS — the last bar sits on the edge, the one before it rests on top", async ({ page }) => {
    /**
     * The mirror of the top stack, and it has to read in the opposite direction. At the top, the FIRST block
     * in the document is nearest the edge — the way a header is first and at the top. At the bottom, the LAST
     * is nearest the edge, the way a footer is last and at the bottom. Building a bottom stack in document
     * order looks fine with one bar and puts the wrong one on the edge with two.
     */
    await page.setViewportSize({ width: 1280, height: 800 });
    await show(page, pageTwoBottom(), "/__pins3");
    const cookie = (await rect(page, "cookie"))!;
    const toTop = (await rect(page, "totop"))!;
    expect(toTop, "the second bottom bar is not on the page").not.toBeNull();
    expect(toTop.bottom, `the LAST bottom bar should sit on the edge; it ends at ${toTop.bottom} of 800`).toBe(800);
    expect(cookie.bottom, `the one before it should rest on top of it, ending at ${toTop.top}`).toBe(toTop.top);
    expect(cookie.top < toTop.top, "the two bottom bars are drawn on top of each other").toBe(true);
  });

  test("the CANVAS stacks them too — same offsets as the published page", async ({ page }) => {
    /**
     * CANVAS = EXPORT, which is the Definition of Done for every option in this axis — and this is the case
     * that broke it. The builder's page frame declares `container-type: inline-size` (the thing that makes
     * container queries work), which makes it the containing block for anything `fixed` inside it, so the
     * editor renders a held block as `absolute` with a computed offset instead.
     *
     * Measured before that was handled: the exported page stacked correctly while the canvas drew all three
     * bars at the same 88px, with `--eu-pin-above` never set — the editor showing something the published
     * page would not do. The pass therefore accepts `absolute` as well, which is safe because it has already
     * required the `data-eu-pin` marker, and that marker is never written for a freely positioned block.
     */
    await page.setViewportSize({ width: 1440, height: 900 });
    await seedSite(page, {
      homeId: "p1",
      pages: [{ id: "p1", name: "Home", path: "/", root: page3() }],
    });
    await page.waitForSelector('[data-box-id="b3"]', { timeout: 30000 });
    await page.waitForTimeout(700); // the measuring pass runs in a frame after the render

    const boxes = await page.evaluate(() => ["b1", "b2", "b3"].map((id) => {
      const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { id, top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) };
    }));
    const [c1, c2, c3] = boxes;
    expect(c1 && c2 && c3, "a pinned band is missing from the canvas").toBeTruthy();
    expect(c2!.top, `the second band starts at ${c2!.top}, but the first ends at ${c1!.bottom}`).toBe(c1!.bottom);
    expect(c3!.top, `the third band starts at ${c3!.top}, but the second ends at ${c2!.bottom}`).toBe(c2!.bottom);
    expect(c1!.h, "the bands kept their own heights").toBe(40);
    expect(c2!.h).toBe(64);
    expect(c3!.h).toBe(32);
  });

  test("a page with ONE pinned bar ships no stacking script at all", async ({ page }) => {
    // Zero JS stays the default. A bar that has nothing to stack under must not cost the page a script.
    const one: BoxNode = {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        bar("solo", 48, "#0d3b1e"),
        { id: "body", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 1200, background: "#fff", children: [] } as unknown as BoxNode,
      ],
    } as unknown as BoxNode;
    const site = normalizeSite(siteFromRoot(one), 0);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    expect(html.includes("__euPinStack"), "a lone pinned bar paid for a script it cannot use").toBe(false);

    const site3 = normalizeSite(siteFromRoot(page3()), 0);
    const html3 = renderSitePage(site3, DEFAULT_THEME, site3.homeId, { inlineShared: true });
    expect(html3.includes("__euPinStack"), "three bars at one edge need the script and did not get it").toBe(true);
    await page.goto("about:blank"); // the fixture above is a pure-string assertion; keep the browser quiet
  });
});
