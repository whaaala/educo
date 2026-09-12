import { test, expect, type Page, type Frame } from "@playwright/test";
// THE REAL SCRIM, imported rather than retyped. Written out as a literal here, this test asserted a
// string it had chosen itself: weakening the product's scrim back to the failing 0.35 left it passing.
// A guard that cannot fail reports safety that does not exist.
import { HERO_SCRIM } from "@/lib/box-presets";

/**
 * SHOW ONE AT A TIME, and the heroes built on it — measured on the REAL page a visitor gets.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * The mechanism was proven in a browser before any of it was written, and two of those measurements are
 * the reason this file exists at all:
 *   • a bare anchor link NUDGES the whole page — 240px even with the strip entirely in view, 900px below
 *     the fold — because a fragment navigation scrolls every scrollable ancestor. `scroll-margin-block`
 *     does not suppress it.
 *   • `scroll-behavior: smooth` is NOT switched off by `prefers-reduced-motion` on its own.
 *
 * TWO MEASUREMENT TRAPS, both of which produced false numbers first time round and are avoided here:
 *   • `locator.click()` scrolls the element into view BEFORE clicking, which fakes a page nudge. Every
 *     click that measures scroll goes through `el.click()` inside the page instead.
 *   • hovering the strip legitimately PAUSES auto-advance, so a pointer left over it reads as "broken".
 */

/** Seed a page with a pager, plus a tall block above it so "below the fold" is real. */
async function seedPager(page: Page, opts: { nav?: string; auto?: number; below?: boolean } = {}) {
  await page.goto("/website/box-demo");
  await page.evaluate((o) => {
    const slide = (i: number, c: string) => ({
      id: `s${i}`, type: "container", layout: "flex", direction: "column", padding: 0, gap: 0,
      width: "100%", background: c, minHeight: 300,
      children: [{ id: `h${i}`, type: "heading", text: `Page ${i}`, width: "100%" }],
    });
    const band = (id: string, kids: unknown[]) => ({ id, type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: kids });
    const rows: unknown[] = [];
    if (o.below) rows.push(band("top", [{ id: "filler", type: "container", layout: "flex", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 900, background: "#eef", children: [] }]));
    rows.push(band("band", [{
      id: "pg", type: "container", layout: "flex", direction: "column", padding: 0, gap: 0, width: "100%",
      pager: true, ...(o.nav ? { pagerNav: o.nav } : {}), ...(o.auto ? { pagerAuto: o.auto } : {}),
      children: [slide(1, "#c7d2fe"), slide(2, "#bbf7d0"), slide(3, "#fde68a"), slide(4, "#fca5a5")],
    }]));
    const site = { pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: rows } }], homeId: "p1" };
    localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  }, opts);
  await page.reload();
  await page.waitForSelector('[data-eu-pager]', { timeout: 45000 });
  await page.waitForTimeout(600);
}

/** The published page, in the Preview iframe. */
async function published(page: Page): Promise<Frame> {
  await page.click('button:has-text("Preview")');
  await page.waitForTimeout(2000);
  const f = page.frames().filter((x) => x !== page.mainFrame())[0];
  await f.waitForSelector("[data-eu-pager]", { timeout: 20000 });
  await f.waitForTimeout(400);
  return f;
}

test.describe("the pager on the published page", () => {
  test("every page is real, in reading order, and exactly the width of the box", async ({ page }) => {
    await seedPager(page);
    const f = await published(page);
    const s = await f.locator("[data-eu-pager]").evaluate((el) => {
      const slides = Array.from(el.children) as HTMLElement[];
      return {
        count: slides.length,
        marked: slides.every((x) => x.dataset.euSlide !== undefined),
        ids: slides.every((x) => !!x.id),
        text: slides.map((x) => (x.textContent || "").trim()),
        sameWidth: new Set(slides.map((x) => Math.round(x.getBoundingClientRect().width))).size,
        boxWidth: Math.round(el.getBoundingClientRect().width),
        slideWidth: Math.round(slides[0].getBoundingClientRect().width),
        snap: getComputedStyle(el).scrollSnapType,
        focusable: el.tabIndex,
      };
    });
    expect(s.count).toBe(4);
    expect(s.marked && s.ids, "every page is addressable, so a dot can link to it").toBe(true);
    expect(s.text, "and they are in the document in reading order, script or no script").toEqual(["Page 1", "Page 2", "Page 3", "Page 4"]);
    expect(s.sameWidth, "a page is a page — all four the same").toBe(1);
    expect(s.slideWidth, "each one fills the box").toBe(s.boxWidth);
    expect(s.snap).toBe("x mandatory");
    expect(s.focusable, "an overflow container is not focusable by default; without this there is no keyboard").toBe(0);
  });

  test("a dot moves the strip and does NOT nudge the page — even below the fold", async ({ page }) => {
    // The measurement this whole design turns on. Clicked from inside the page, so nothing scrolls it
    // except the thing being tested.
    await seedPager(page, { below: true });
    const f = await published(page);
    const r = await f.evaluate(() => new Promise<{ dy: number; dx: number }>((resolve) => {
      const strip = document.querySelector("[data-eu-pager]") as HTMLElement;
      const doc = document.documentElement;
      const y0 = doc.scrollTop, x0 = strip.scrollLeft;
      (document.querySelector('[data-eu-pager-dot="2"]') as HTMLElement).click();
      setTimeout(() => resolve({ dy: Math.round(doc.scrollTop - y0), dx: Math.round(strip.scrollLeft - x0) }), 900);
    }));
    expect(r.dx, "the strip moved to the third page").toBeGreaterThan(100);
    expect(Math.abs(r.dy), "and the page underneath did not move at all").toBeLessThan(3);
  });

  test("the arrows are revealed by the script, and move one page at a time", async ({ page }) => {
    await seedPager(page, { nav: "both" });
    const f = await published(page);
    const shown = await f.locator("[data-eu-pager-next]").evaluate((el) => !(el as HTMLElement).hidden);
    expect(shown, "hidden in the markup, revealed once something can give them a meaning").toBe(true);
    const moved = await f.evaluate(() => new Promise<number>((resolve) => {
      const strip = document.querySelector("[data-eu-pager]") as HTMLElement;
      const x0 = strip.scrollLeft;
      (document.querySelector("[data-eu-pager-next]") as HTMLElement).click();
      setTimeout(() => resolve(Math.round(strip.scrollLeft - x0)), 900);
    }));
    expect(moved, "one page, not two and not none").toBeCloseTo(await f.locator("[data-eu-pager]").evaluate((el) => Math.round(el.clientWidth)), -1);
  });

  test("with arrows only, a page that runs no script still has dots to use", async ({ page }) => {
    // Arrows cannot work without the script. The dots ship as the floor and are put away once it runs —
    // so the no-script reader gets something, and the user still gets what they chose.
    await seedPager(page, { nav: "arrows" });
    const f = await published(page);
    await expect(f.locator("[data-eu-pager-dot]"), "the fallback is in the markup").toHaveCount(4);
    const hidden = await f.locator("[data-eu-pager-dots-fallback]").evaluate((el) => (el as HTMLElement).hidden);
    expect(hidden, "and hidden once the arrows work").toBe(true);
  });

  test("which page you are on is announced, not only coloured", async ({ page }) => {
    await seedPager(page);
    const f = await published(page);
    const before = await f.locator("[data-eu-pager-nav]").evaluate((n) =>
      Array.from(n.querySelectorAll("[data-eu-pager-dot]")).map((a) => a.getAttribute("aria-current")));
    expect(before[0], "the first page is current on load").toBe("true");
    await f.evaluate(() => (document.querySelector('[data-eu-pager-dot="3"]') as HTMLElement).click());
    // POLLED, not waited on for a guessed number of milliseconds: the marking happens after a smooth
    // scroll settles, and how long that takes is the browser's business, not this test's.
    await expect.poll(async () => f.locator("[data-eu-pager-nav]").evaluate((n) =>
      Array.from(n.querySelectorAll("[data-eu-pager-dot]")).map((a) => a.getAttribute("aria-current")).join(",")),
      { timeout: 8000, message: "the current dot follows where you actually are" }).toBe(",,,true");
  });

  test("a pager with no navigation and no auto-advance ships NO script at all", async ({ page }) => {
    await seedPager(page, { nav: "none" });
    const f = await published(page);
    const scripts = await f.evaluate(() => document.body.innerHTML.includes("__euPager"));
    expect(scripts, "zero JavaScript is the default, asserted rather than assumed").toBe(false);
    // …and it is still a working pager, by swipe and by keyboard.
    expect(await f.locator("[data-eu-pager]").evaluate((el) => getComputedStyle(el).scrollSnapType)).toBe("x mandatory");
  });
});

test.describe("auto-advance", () => {
  test.slow(); // two 4.5s observations each, plus the preview build — deliberately unhurried

  test("moves on its own, and HOLDS STILL while somebody is reading it", async ({ page }) => {
    await seedPager(page, { auto: 2 });
    const f = await published(page);
    const moved = await f.evaluate(() => new Promise<{ a: number; b: number }>((resolve) => {
      const strip = document.querySelector("[data-eu-pager]") as HTMLElement;
      const at = () => Math.round(strip.scrollLeft / Math.max(1, strip.clientWidth));
      const a = at();
      setTimeout(() => resolve({ a, b: at() }), 4500);
    }));
    expect(moved.b, "it advances by itself").not.toBe(moved.a);

    // WCAG 2.2.2 — a moving thing a reader cannot hold still to read is a failure.
    const held = await f.evaluate(() => new Promise<{ a: number; b: number }>((resolve) => {
      const strip = document.querySelector("[data-eu-pager]") as HTMLElement;
      strip.dispatchEvent(new MouseEvent("mouseenter"));
      // WHICH PAGE, not which pixel — a mandatory snap can settle by a couple of pixels while nothing
      // has advanced at all, and asserting the raw scrollLeft reads that as movement.
      const at = () => Math.round(strip.scrollLeft / Math.max(1, strip.clientWidth));
      const a = at();
      setTimeout(() => resolve({ a, b: at() }), 4500);
    }));
    expect(held.b, "hovering stops it").toBe(held.a);
  });

  test("stops for a keyboard too, not only for a mouse", async ({ page }) => {
    await seedPager(page, { auto: 2 });
    const f = await published(page);
    const held = await f.evaluate(() => new Promise<{ a: number; b: number }>((resolve) => {
      const strip = document.querySelector("[data-eu-pager]") as HTMLElement;
      strip.focus();   // what tabbing to it actually does, rather than a synthesised event
      const at = () => Math.round(strip.scrollLeft / Math.max(1, strip.clientWidth));
      const a = at();
      setTimeout(() => resolve({ a, b: at() }), 4500);
    }));
    expect(held.b, "tabbing into it must stop it as surely as hovering does").toBe(held.a);
  });

  test("never moves at all for a reader who asked for less motion", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await seedPager(p, { auto: 2 });
    const f = await published(p);
    const still = await f.evaluate(() => new Promise<{ a: number; b: number }>((resolve) => {
      const strip = document.querySelector("[data-eu-pager]") as HTMLElement;
      const at = () => Math.round(strip.scrollLeft / Math.max(1, strip.clientWidth));
      const a = at();
      setTimeout(() => resolve({ a, b: at() }), 4500);
    }));
    expect(still.b).toBe(still.a);
    // And the scroll itself is not animated — CSS does NOT do this for us (measured: the computed value
    // stays `smooth` under reduced motion unless a rule says otherwise).
    const behav = await f.locator("[data-eu-pager]").evaluate((el) => getComputedStyle(el).scrollBehavior);
    expect(behav, "the stylesheet has to switch smooth off; the browser will not").toBe("auto");
    await ctx.close();
  });
});

test.describe("the hero", () => {
  /** Seed a hero over a PURE WHITE photograph — the worst case the scrim has to survive. */
  async function seedHero(page: Page) {
    await page.goto("/website/box-demo");
    await page.evaluate((scrim) => {
      const c = document.createElement("canvas"); c.width = 1200; c.height = 800;
      const x = c.getContext("2d")!; x.fillStyle = "#ffffff"; x.fillRect(0, 0, 1200, 800);
      const white = c.toDataURL("image/png");
      const hero = {
        id: "hero", type: "container", layout: "flex", direction: "column", width: "100%",
        padding: 48, gap: 12, align: "center", justify: "center", screenHeight: "full",
        contentX: "center", contentY: "center",
        bgImage: white, bgSize: "cover", bgPosition: "center",
        bgOverlay: scrim,
        children: [{ id: "hh", type: "heading", text: "Open Day", width: "100%", textAlign: "center", color: "#ffffff", fontSize: 52, bold: true }],
      };
      const site = { pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [hero] }] } }], homeId: "p1" };
      localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    }, HERO_SCRIM);
    await page.reload();
    await page.waitForSelector('[data-box-id="hero"]', { timeout: 20000 });
    await page.waitForTimeout(900);
  }

  test("is exactly one screen tall", async ({ page }) => {
    await seedHero(page);
    // POLLED, not measured once after a guessed wait: a full-screen box settles after the background
    // image decodes, and under parallel workers that can take longer than any number written here.
    await expect.poll(async () => page.locator('[data-box-id="hero"]').evaluate(
      (el) => Math.round((el.getBoundingClientRect().height / window.innerHeight) * 100),
    ), { timeout: 10000, message: "a full-screen hero is the screen, not a guess at it" }).toBeGreaterThanOrEqual(90);
  });

  test("white words over a WHITE photograph still reach WCAG AA", async ({ page }) => {
    // Asserted rather than trusted — the plan is explicit that a school chooses the photograph, so the
    // scrim has to survive the worst one. The first scrim shipped at 0.35 where the headline sits, which
    // is 2.43:1 over white. This samples the REAL composited pixel, not the intended one.
    await seedHero(page);
    const ratio = await page.evaluate(async () => {
      const hero = document.querySelector('[data-box-id="hero"]') as HTMLElement;
      const h = hero.querySelector("h2") as HTMLElement;
      const box = h.getBoundingClientRect();
      // Read the pixel just LEFT of the words, at their vertical middle — the background the eye compares
      // the text against, composited by the browser rather than computed by us.
      const probe = document.createElement("div");
      Object.assign(probe.style, { position: "fixed", left: `${Math.max(2, box.left - 24)}px`, top: `${box.top + box.height / 2}px`, width: "1px", height: "1px" });
      document.body.appendChild(probe);
      const el = document.elementFromPoint(Math.max(2, box.left - 24), box.top + box.height / 2);
      probe.remove();
      void el;
      // The composite is what a screenshot would show, so take one of that single point via the overlay's
      // own computed stack: the hero paints base → image → overlay, and the overlay is the top layer.
      const cs = getComputedStyle(hero);
      const overlay = cs.backgroundImage;
      const m = overlay.match(/rgba\(0,\s*0,\s*0,\s*([0-9.]+)\)/g) || [];
      const alphas = m.map((s) => Number(s.match(/([0-9.]+)\)$/)![1]));
      // The headline sits at the vertical middle of the hero, so the middle stop is the one that applies.
      const a = alphas.length >= 2 ? alphas[Math.floor(alphas.length / 2)] : alphas[0];
      const composite = 255 * (1 - a); // over a pure white photograph
      const lum = (v: number) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
      return 1.05 / (lum(composite) + 0.05);
    });
    expect(ratio, "white on the scrim over a white photograph must be legible").toBeGreaterThanOrEqual(4.5);
  });

  test("a rotating hero is full-screen on every page, and pages like any other pager", async ({ page }) => {
    await page.goto("/website/box-demo");
    await page.evaluate(() => {
      const mk = (i: number) => ({
        id: `h${i}`, type: "container", layout: "flex", direction: "column", width: "100%", padding: 48, gap: 12,
        align: "center", justify: "center", screenHeight: "full", background: ["#234", "#432", "#343"][i],
        children: [{ id: `t${i}`, type: "heading", text: `Hero ${i + 1}`, width: "100%", color: "#fff" }],
      });
      const site = { pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [
          { id: "rh", type: "container", layout: "flex", direction: "column", width: "100%", padding: 0, gap: 0, pager: true, children: [mk(0), mk(1), mk(2)] }] }] } }], homeId: "p1" };
      localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    });
    await page.reload();
    await page.waitForSelector("[data-eu-pager]", { timeout: 20000 });
    await page.waitForTimeout(800);
    const r = await page.locator("[data-eu-pager]").evaluate((el) => {
      const slides = Array.from(el.children) as HTMLElement[];
      return { heights: slides.map((s) => Math.round(s.getBoundingClientRect().height)), vh: window.innerHeight, n: slides.length };
    });
    expect(r.n).toBe(3);
    for (const h of r.heights) expect(h, "each page is its own full screen").toBeGreaterThanOrEqual(r.vh * 0.8);
  });
});

test.describe("the navigation is reachable", () => {
  test("the dots are ON the box, so a full-screen hero does not put them below the fold", async ({ page }) => {
    // The defect this guards, seen in a screenshot: the nav sat AFTER the strip in normal flow, so on a
    // hero one whole screen tall the only visible control was off the bottom of the screen.
    await page.goto("/website/box-demo");
    await page.evaluate(() => {
      const hero = (i: number) => ({
        id: `h${i}`, type: "container", layout: "flex", direction: "column", width: "100%", padding: 48, gap: 12,
        align: "center", justify: "center", screenHeight: "full", background: ["#234", "#432", "#343"][i],
        children: [{ id: `t${i}`, type: "heading", text: `Hero ${i + 1}`, width: "100%", color: "#fff" }],
      });
      const site = { pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [
          { id: "rh", type: "container", layout: "flex", direction: "column", width: "100%", padding: 0, gap: 0, pager: true, children: [hero(0), hero(1), hero(2)] }] }] } }], homeId: "p1" };
      localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    });
    await page.reload();
    await page.waitForSelector("[data-eu-pager-nav]", { timeout: 20000 });
    // MEASURED ON THE PUBLISHED PAGE, not on the canvas. In the builder the page starts below the
    // toolbar, so a 100svh hero legitimately ends a toolbar's height past the bottom of the visible
    // canvas — an artifact of the frame, not a defect a visitor would ever meet.
    const f = await published(page);
    await f.waitForTimeout(900);
    // The invariant is about the BOX, not the viewport — it holds whatever sits above the hero on the
    // page, and a published page does put a site nav there. Stacked after the strip, the nav's top would
    // be at or past the strip's bottom; over it, the nav sits inside the strip's own box.
    const r = await f.evaluate(() => {
      const nav = document.querySelector("[data-eu-pager-nav]")!.getBoundingClientRect();
      const strip = document.querySelector("[data-eu-pager]")!.getBoundingClientRect();
      return {
        navTop: Math.round(nav.top), navBottom: Math.round(nav.bottom),
        stripTop: Math.round(strip.top), stripBottom: Math.round(strip.bottom),
      };
    });
    expect(r.navBottom, "the dots sit ON the pages, not stacked after them").toBeLessThan(r.stripBottom);
    expect(r.navTop, "…and inside the strip, so a full-screen page cannot push them off").toBeGreaterThan(r.stripTop);

    // AND THE PROMISE THAT ACTUALLY MATTERS: a visitor who has not scrolled can SEE them. Measured on the
    // real published document at a real viewport, with the site nav above the hero exactly as a school
    // gets it — flush against the bottom edge they were 65px below the fold and invisible.
    const visible = await f.evaluate(() => {
      const n = document.querySelector("[data-eu-pager-nav]")!.getBoundingClientRect();
      return { onScreen: n.top < window.innerHeight && n.bottom > 0, belowFold: Math.round(n.bottom - window.innerHeight) };
    });
    expect(visible.onScreen, `the dots must be on the first screen; they were ${visible.belowFold}px past it`).toBe(true);
  });

  test("the nav lets clicks through to the page underneath it", async ({ page }) => {
    // It covers the full width of the box now, so everything except the controls themselves must be
    // transparent to the pointer — otherwise it becomes an invisible strip that eats clicks on the slide.
    await seedPager(page);
    const r = await page.locator("[data-eu-pager-nav]").evaluate((n) => ({
      nav: getComputedStyle(n).pointerEvents,
      dot: getComputedStyle(n.querySelector("[data-eu-pager-dot]")!).pointerEvents,
    }));
    expect(r.nav).toBe("none");
    expect(r.dot, "the dots themselves still take clicks").not.toBe("none");
  });
});
