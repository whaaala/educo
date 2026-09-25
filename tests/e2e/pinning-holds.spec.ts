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

  /**
   * FIXED — the second mechanism. It differs from sticky in exactly the ways that matter to a user: it
   * holds however far you scroll rather than leaving with its section, it reserves no space, and it can
   * take a corner. Each of those is asserted rather than assumed.
   */
  test("EXPORT · a FIXED bar holds however far you scroll", async ({ page }) => {
    const root = {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "b1", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
          children: [tall("bar", 56, "#0d3b1e", { pin: "top", hold: "fixed" })] },
        { id: "b2", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
          children: [tall("body1", 4000, "#4d8c0f")] },
      ],
    } as unknown as BoxNode;
    const r = await heldInExport(page, root, "bar");
    expect(r.position, "fixed, not sticky").toBe("fixed");
    expect(r.scrolledBy).toBeGreaterThan(400);
    expect(r.movedWithPage, "it did not move at all").toBeLessThan(6);
  });

  test("EXPORT · a FIXED block can take a corner, which sticky cannot", async ({ page }) => {
    const root = {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "b1", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
          children: [{ ...tall("fab", 56, "#8c0f52", { pin: "bottom-right", hold: "fixed", pinOffset: 16 }), width: "56px" }] },
        { id: "b2", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
          children: [tall("body1", 4000, "#4d8c0f")] },
      ],
    } as unknown as BoxNode;
    const html = exportDoc(root);
    await page.route("**/__corner", (rt) => rt.fulfill({ contentType: "text/html", body: html }));
    await page.goto("/__corner");
    await page.waitForTimeout(400);
    const r = await page.evaluate(async () => {
      const el = document.querySelector<HTMLElement>(".bx-fab")!;
      window.scrollTo(0, 900);
      await new Promise((res) => setTimeout(res, 350));
      const b = el.getBoundingClientRect();
      return {
        position: getComputedStyle(el).position,
        fromBottom: Math.round(window.innerHeight - b.bottom), fromRight: Math.round(window.innerWidth - b.right),
        fromTop: Math.round(b.top), fromLeft: Math.round(b.left),
      };
    });
    /**
     * Asserted on WHERE IT IS, not on which insets were written. `getComputedStyle` returns the USED value
     * for a positioned element, so an inset nobody set comes back as a pixel number rather than `auto` — a
     * check on that passes or fails for reasons unrelated to the corner. It is also the F3 mistake in
     * miniature: the CSS text is not the behaviour.
     */
    expect(r.position).toBe("fixed");
    expect(r.fromBottom, "it sits against the bottom it was told to").toBeLessThan(40);
    expect(r.fromRight, "and against the right").toBeLessThan(40);
    expect(r.fromTop, "…which means NOT against the top").toBeGreaterThan(200);
    expect(r.fromLeft, "…nor the left").toBeGreaterThan(200);
  });

  test("CANVAS · a FIXED bar HOLDS ON SCREEN while the canvas scrolls, and stays inside the page", async ({ page }) => {
    /**
     * THE GUARD THAT LET A USER FIND THE BUG. It used to assert `position: fixed` and containment, and
     * nothing about whether the bar actually held — so it passed while a block set to float on screen
     * scrolled away in the editor, travelling the full 600px of a canvas scroll. Reported from a screenshot:
     * "it didn't stay on the screen".
     *
     * Inside the editor a fixed box CANNOT be measured against the window: the page frame declares
     * `container-type: inline-size` for container queries, and that captures every fixed descendant. So the
     * canvas simulates it — the block keeps its place in the page and is offset by the canvas's own scroll
     * — and what is asserted here is the BEHAVIOUR both routes have to produce, never the property one of
     * them happens to use. Containment is still asserted: over the toolbar it could not be selected at all.
     */
    const root = {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "b1", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
          children: [tall("bar", 56, "#0d3b1e", { pin: "top", hold: "fixed" })] },
        { id: "b2", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
          children: [tall("body1", 4000, "#4d8c0f")] },
      ],
    } as unknown as BoxNode;
    await seedSite(page, { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root }] });
    // `attached`, not `visible`: a fixed block leaves the flow, so its wrapper correctly collapses to zero
    // size — the same reason the interactions spec waits this way for a toast.
    await page.waitForSelector("[data-box-id=\"bar\"]", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(700);
    const r = await page.evaluate(async () => {
      const el = document.querySelector<HTMLElement>('[data-box-id="bar"]')!;
      const pageRoot = document.querySelector<HTMLElement>('[data-box-id="root"]')!;
      let scroller: HTMLElement | null = el.parentElement;
      while (scroller && !/auto|scroll/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;
      const top = () => Math.round(el.getBoundingClientRect().top);
      // Both readings while scrolled: the canvas insets the page, so a held block catches the top of the
      // view once the page's own top edge has gone — a one-off move of that padding, not a failure to hold.
      if (scroller) scroller.scrollTop = 200;
      await new Promise((res) => setTimeout(res, 300));
      const before = top();
      if (scroller) scroller.scrollTop = 700;
      await new Promise((res) => setTimeout(res, 350));
      const b = el.getBoundingClientRect(), p = pageRoot.getBoundingClientRect();
      return {
        travelled: before - top(),
        scrolled: Math.round(scroller?.scrollTop ?? 0),
        withinPage: b.left >= p.left - 2 && b.right <= p.right + 2,
        left: Math.round(b.left), pageLeft: Math.round(p.left),
      };
    });
    expect(r.scrolled, "the canvas really scrolled — otherwise this proves nothing").toBeGreaterThan(400);
    expect(r.travelled, `the bar travelled ${r.travelled}px with the canvas; it is meant to hold`).toBeLessThan(6);
    expect(r.withinPage, `the bar sits at ${r.left} and the page starts at ${r.pageLeft} — it escaped the canvas`).toBe(true);
  });

  test("CANVAS · a bar a TILT captures does not hold — the editor shows what the page will do", async ({ page }) => {
    /**
     * The other half of the canvas simulation, and the half that was wrong first. A fixed block inside a
     * tilted block, a component or the glass Alert is captured by that box on the published page — it holds
     * against THAT, not the window, which is exactly what the Inspector's warning says. Simulating the hold
     * in the editor had the builder drawing the behaviour it was simultaneously telling you would not happen.
     */
    const root = {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "b1", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
          children: [tall("tilted", 900, "#1b3a57", { rotate: 3, children: [tall("bar", 56, "#0d3b1e", { pin: "top", hold: "fixed" })] })] },
        { id: "b2", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
          children: [tall("body1", 3000, "#4d8c0f")] },
      ],
    } as unknown as BoxNode;
    await seedSite(page, { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root }] });
    await page.waitForSelector('[data-box-id="bar"]', { state: "attached", timeout: 30000 });
    await page.waitForTimeout(700);
    const r = await page.evaluate(async () => {
      const el = document.querySelector<HTMLElement>('[data-box-id="bar"]')!;
      let sc: HTMLElement | null = el.parentElement;
      while (sc && !/auto|scroll/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
      const top = () => Math.round(el.getBoundingClientRect().top);
      if (sc) sc.scrollTop = 200;
      await new Promise((res) => setTimeout(res, 300));
      const before = top();
      if (sc) sc.scrollTop = 700;
      await new Promise((res) => setTimeout(res, 350));
      return { travelled: before - top(), scrolled: Math.round(sc?.scrollTop ?? 0) };
    });
    expect(r.scrolled).toBeGreaterThan(400);
    expect(r.travelled, "captured by the tilt, so it travels with the page — as the published page will").toBeGreaterThan(400);
  });

  test("a block NOBODY pinned still scrolls away", async ({ page }) => {
    // The guard that stops the others passing for the wrong reason: if everything held, these assertions
    // would be measuring a page that cannot scroll rather than a block that sticks.
    const r = await heldInExport(page, headerPage(), "body1");
    expect(r.position, "it is ordinary flow content").not.toBe("sticky");
    expect(r.movedWithPage, "so it travels with the page, the full distance").toBeGreaterThan(SCROLL_BY - 60);
  });
});

/**
 * A RAIL HELD AGAINST A VERTICAL EDGE SPANS THE HEIGHT — the mirror of clause 5.
 *
 * Behaviours: tests/features/components/website/box-builder-floating.feature.
 *
 * Reported by the user: *"the stack on the left, when I make it sticky or fixed, in the preview it's just
 * completely wrong — it doesn't take over the whole view height."* Measured beside a 900px column: the rail
 * rendered **300px**, short by 600.
 *
 * Out of flow a block takes no size from its row, which is exactly why clause 5 has to hand a fixed BAR its
 * width — a full-width bar once rendered 0px wide on both engines. Nobody then asked the same question of the
 * vertical case, so a RAIL collapsed to the height of its contents and sat as a stub at the top of the screen.
 * A bar is held against a horizontal edge and spans the width; a rail is held against a vertical edge and
 * spans the height.
 *
 * ONLY A PURE LEFT OR RIGHT EDGE. A corner means "sit in that corner" — a chat bubble, a back-to-top button —
 * and stretching one to full height is the opposite of what it is for. That case is asserted here too, because
 * a fix that stretched everything would pass a test written only for the rail.
 */
const sideRailPage = (railExtra: Record<string, unknown>): BoxNode => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
      { id: "rail", type: "container", direction: "column", padding: 0, gap: 0, width: "20%", minHeight: 240,
        background: "#0d3b1e", children: [], ...railExtra } as unknown as BoxNode,
      tall("main", 2000, "#f8fafc", { width: "80%" }),
    ] } as unknown as BoxNode,
  ],
} as unknown as BoxNode);

async function railInExport(page: Page, root: BoxNode, route: string) {
  await page.route(`**${route}`, (r) => r.fulfill({ contentType: "text/html", body: exportDoc(root) }));
  await page.goto(route);
  await page.waitForTimeout(400);
  return page.evaluate(() => {
    const el = document.querySelector<HTMLElement>(".bx-rail")!;
    const b = el.getBoundingClientRect();
    return {
      h: Math.round(b.height), top: Math.round(b.top), position: getComputedStyle(el).position,
      viewportH: window.innerHeight,
    };
  });
}

test.describe("a rail held against a vertical edge fills the screen", () => {
  test("held LEFT, it spans the whole viewport height rather than hugging its contents", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const r = await railInExport(page, sideRailPage({ pin: "left", hold: "fixed" }), "/__rail_left");
    expect(r.position, "it really is held on screen").toBe("fixed");
    expect(
      r.h,
      `the rail is ${r.h}px tall in an ${r.viewportH}px window — it collapsed to its contents instead of spanning the edge it is held against`,
    ).toBeGreaterThanOrEqual(r.viewportH - 2);
  });

  test("held RIGHT, the same", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const r = await railInExport(page, sideRailPage({ pin: "right", hold: "fixed" }), "/__rail_right");
    expect(r.h, `the rail is ${r.h}px tall in an ${r.viewportH}px window`).toBeGreaterThanOrEqual(r.viewportH - 2);
  });

  test("a CORNER still hugs — a chat bubble is not a sidebar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const r = await railInExport(page, sideRailPage({ pin: "bottom-left", hold: "fixed" }), "/__rail_corner");
    expect(r.h, `a corner-held block grew to ${r.h}px — it should be the size of its contents`).toBeLessThan(600);
  });

  test("a height the user set themselves still wins", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const r = await railInExport(page, sideRailPage({ pin: "left", hold: "fixed", height: "18rem" }), "/__rail_fixedh");
    expect(r.h, `the user asked for 18rem and got ${r.h}px`).toBeLessThan(400);
  });
});

/**
 * A STICKY SIDEBAR IS THE HEIGHT OF THE SCREEN — and still sticks, which is the whole risk of saying so.
 *
 * Clause 3 refuses to let a row stretch a sticky block, and it has to: stretched to the 2000px column beside
 * it, a sticky block has ZERO travel and can never stick. So it cannot be as tall as its neighbour. It can be
 * as tall as the SCREEN, which is what a sidebar is — 100dvh against a taller column leaves a full column of
 * travel. Measured before this: 300px beside a 900px column.
 */
test.describe("a sticky sidebar fills the screen and keeps its travel", () => {
  test("it is the height of the window, not of its contents", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const r = await railInExport(page, sideRailPage({ pin: "top" }), "/__sticky_rail");
    expect(r.position, "it really is sticky").toBe("sticky");
    expect(r.h, `the rail is ${r.h}px in an ${r.viewportH}px window`).toBeGreaterThanOrEqual(r.viewportH - 2);
  });

  test("…and it STILL HOLDS when the page scrolls — a full-height rail with no travel would be inert", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const r = await heldInExport(page, sideRailPage({ pin: "top" }), "rail");
    expect(r.position).toBe("sticky");
    expect(r.movedWithPage, `it travelled ${r.movedWithPage}px with the page — it is not holding at all`).toBeLessThan(40);
  });

  test("a sticky BUTTON in a row is NOT stretched — a button is not a sidebar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const root: BoxNode = {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
          { id: "rail", type: "button", text: "Apply now", width: "20%", pin: "top" } as unknown as BoxNode,
          tall("main", 2000, "#f8fafc", { width: "80%" }),
        ] } as unknown as BoxNode,
      ],
    } as unknown as BoxNode;
    const r = await railInExport(page, root, "/__sticky_button");
    expect(r.h, `the button grew to ${r.h}px`).toBeLessThan(200);
  });
});
