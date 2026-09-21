import { test, expect, type Page } from "@playwright/test";
import { seedSite } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * A PINNED BLOCK ACTUALLY HOLDS — measured by scrolling, on the canvas AND the exported page.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Pinning shipped built, reachable and unit-tested, and did nothing on a published page for its whole life.
 * The unit suite asserts the CSS TEXT — that `position: sticky` is present, that the offset is in the right
 * unit, that both engines agree. Every one of those claims was true. None of them says anything sticks.
 *
 * Two faults, both measured before the fix:
 *
 *   · `html,body{overflow-x:hidden}` in the exporter forces computed `overflow-y` to `auto`, making <body>
 *     a scroll container while the page scrolls on the viewport. A pinned nav moved the full 600px and left
 *     the screen. `overflow-x: clip` clips without creating a container.
 *
 *   · A row or grid stretches its children, so a pinned rail beside 2400px of content was itself 2400px
 *     tall — 0px of travel. It could not have held even with a working scroll container.
 *
 * And the part that makes this the worst class of bug: the CANVAS held it correctly the whole time. The
 * editor showed a behaviour it had never once published, so every assertion here is made on BOTH.
 */

const exportDoc = (root: BoxNode) => {
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

const tall = (id: string, h: number, bg: string, extra: Record<string, unknown> = {}) => ({
  id, type: "container", direction: "column", width: "100%", padding: 0, gap: 0,
  minHeight: h, background: bg, children: [], ...extra,
} as unknown as BoxNode);

/** A pinned bar above a very tall block — the ordinary sticky-header page. */
const headerPage = () => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    { id: "band", type: "container", direction: "column", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
      tall("nav", 64, "#0d3b1e", { pin: "top" }),
      tall("body1", 3000, "#4d8c0f"),
    ] },
  ],
} as unknown as BoxNode);

/**
 * THE SHAPE THE BUILDER ACTUALLY MAKES — and the one the fixture above cannot reach.
 *
 * Every top-level block gets its OWN band, so a pinned header lands in a band that hugs it: parent 64px,
 * child 64px, travel 0px. `headerPage` puts the nav and the body in ONE band, which is a page no user can
 * build, and it passed while the real thing lost the whole 700px it was scrolled.
 *
 * This is the project's recurring fault — a guard that builds its tree by hand and skips the pass that
 * shapes it. Both shapes are driven from here on.
 */
const headerInOwnBand = () => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    { id: "b1", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
      children: [tall("nav", 64, "#0d3b1e", { pin: "top" })] },
    { id: "b2", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
      children: [tall("body1", 3000, "#4d8c0f")] },
  ],
} as unknown as BoxNode);

/** A short pinned rail beside very tall content — the side-bar case, which stretch used to kill. */
const railPage = () => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
      { ...tall("rail", 200, "#8c0f52", { pin: "top" }), width: "30%" },
      { ...tall("main", 3000, "#4d8c0f"), width: "70%" },
    ] },
  ],
} as unknown as BoxNode);

const SCROLL_BY = 700;

/** Load the real exported document from an http origin and scroll it. */
async function heldInExport(page: Page, root: BoxNode, id: string) {
  const html = exportDoc(root);
  await page.route("**/__pin_fixture", (r) => r.fulfill({ contentType: "text/html", body: html }));
  await page.goto("/__pin_fixture");
  await page.waitForTimeout(400);
  return page.evaluate(async ({ id, by }) => {
    const el = document.querySelector<HTMLElement>(`.bx-${id}`)!;
    const before = el.getBoundingClientRect().top;
    window.scrollTo(0, by);
    await new Promise((r) => setTimeout(r, 350));
    return {
      movedWithPage: Math.round(before - el.getBoundingClientRect().top),
      scrolledBy: Math.round(document.scrollingElement!.scrollTop),
      position: getComputedStyle(el).position,
      ownHeight: Math.round(el.getBoundingClientRect().height),
      parentHeight: Math.round(el.parentElement!.getBoundingClientRect().height),
    };
  }, { id, by: SCROLL_BY });
}

/** Seed the same tree into the builder and scroll the editor's own canvas. */
async function heldOnCanvas(page: Page, root: BoxNode, id: string) {
  await seedSite(page, { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root }] });
  await page.waitForSelector(`[data-box-id="${id}"]`, { timeout: 30000 });
  await page.waitForTimeout(700);
  return page.evaluate(async ({ id, by }) => {
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)!;
    // The canvas scroller is whichever ancestor genuinely scrolls — found, never assumed.
    let scroller: HTMLElement | null = el.parentElement;
    while (scroller && !(scroller.scrollHeight > scroller.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(scroller).overflowY))) {
      scroller = scroller.parentElement;
    }
    const before = el.getBoundingClientRect().top;
    if (scroller) scroller.scrollTop = by; else window.scrollTo(0, by);
    await new Promise((r) => setTimeout(r, 350));
    return {
      movedWithPage: Math.round(before - el.getBoundingClientRect().top),
      scrolledBy: Math.round(scroller ? scroller.scrollTop : window.scrollY),
      foundScroller: !!scroller,
    };
  }, { id, by: SCROLL_BY });
}

test.describe("a pinned block holds while the page scrolls", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("EXPORT · a pinned header stays on screen", async ({ page }) => {
    const r = await heldInExport(page, headerPage(), "nav");
    expect(r.scrolledBy, "the page really did scroll — otherwise this proves nothing").toBeGreaterThan(400);
    expect(r.position, "and it really is sticky").toBe("sticky");
    expect(r.movedWithPage, `it travelled ${r.movedWithPage}px with the page; it used to lose the whole ${SCROLL_BY}px`).toBeLessThan(40);
  });

  test("CANVAS · the same header holds in the editor", async ({ page }) => {
    const r = await heldOnCanvas(page, headerPage(), "nav");
    expect(r.foundScroller, "the canvas has a scroller to scroll").toBe(true);
    expect(r.scrolledBy).toBeGreaterThan(400);
    expect(r.movedWithPage, "held on the canvas too — canvas and export must agree").toBeLessThan(40);
  });

  test("EXPORT · a header ALONE IN ITS BAND holds — the shape the builder makes", async ({ page }) => {
    const r = await heldInExport(page, headerInOwnBand(), "nav");
    expect(r.scrolledBy).toBeGreaterThan(400);
    expect(r.movedWithPage, `it travelled ${r.movedWithPage}px; alone in its band it used to lose all ${SCROLL_BY}px`).toBeLessThan(40);
  });

  test("CANVAS · a header alone in its band holds in the editor too", async ({ page }) => {
    const r = await heldOnCanvas(page, headerInOwnBand(), "nav");
    expect(r.scrolledBy).toBeGreaterThan(400);
    expect(r.movedWithPage).toBeLessThan(40);
  });

  test("EXPORT · a pinned side rail is NOT stretched, and holds", async ({ page }) => {
    /**
     * The stretch fault, asserted on the geometry rather than on the CSS: a rail as tall as its parent has
     * no travel whatever its `position` says. Both halves are checked because either alone passes on the bug.
     */
    const r = await heldInExport(page, railPage(), "rail");
    expect(r.ownHeight, "the rail keeps its own height instead of being stretched to the content beside it")
      .toBeLessThan(r.parentHeight - 500);
    expect(r.movedWithPage, `the rail travelled ${r.movedWithPage}px with the page`).toBeLessThan(40);
  });

  test("CANVAS · the side rail behaves the same in the editor", async ({ page }) => {
    const r = await heldOnCanvas(page, railPage(), "rail");
    expect(r.scrolledBy).toBeGreaterThan(400);
    expect(r.movedWithPage, "held on the canvas too").toBeLessThan(40);
  });

  test("a block NOBODY pinned still scrolls away", async ({ page }) => {
    // The guard that stops the others passing for the wrong reason: if everything held, these assertions
    // would be measuring a page that cannot scroll rather than a block that sticks.
    const r = await heldInExport(page, headerPage(), "body1");
    expect(r.position, "it is ordinary flow content").not.toBe("sticky");
    expect(r.movedWithPage, "so it travels with the page, the full distance").toBeGreaterThan(SCROLL_BY - 60);
  });
});
