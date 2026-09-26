import { test, expect, type Page, type Frame } from "@playwright/test";
import { seedSite } from "./helpers/seed-site";

/**
 * A PAGE IS AS TALL AS WHAT IS ON IT — never as tall as the screen.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * This was argued for rather than measured, which is the wrong way round, so it is asserted here instead.
 * Three properties, each one a reason the alternative — every short page forced to screen height — was
 * turned down:
 *
 *  1 · IT WOULD MANUFACTURE LEFTOVER SPACE, on every page. Every layout bug of 2026-09-26 came from a block
 *      absorbing room nobody had allocated: a dropped stack arriving 35px tall while the other 35 became a
 *      hole; a 65px gap inside a column; a 90px hole under a stack; and a bottom-edge drag moving the
 *      ANCHORED top edge because a `fill` sibling was squeezed to zero to pay for it. A screen-height page
 *      creates that leftover deliberately, and then something has to decide who gets it.
 *
 *  2 · IT WOULD CHANGE WHAT `100%` AND `fill` MEAN. Today they mean "as tall as the page's content". Under a
 *      screen-height page they would mean "as tall as the visitor's screen", so the same block would render
 *      differently on a laptop and a monitor with nothing in the design to explain why.
 *
 *  3 · IT WOULD BE A SPECIAL CASE BETWEEN THE CANVAS AND THE EXPORT. A document is content-height by
 *      default, so the published page gets this for nothing; only the builder would need teaching. Canvas ≠
 *      export is the most expensive bug class in this project, and every instance of it has started as a
 *      rule that held on one surface and not the other.
 */

/** A short page: two bands, nothing that could fill a screen. */
const shortPage = () => ({
  pages: [{
    id: "p1", name: "Home", path: "/",
    root: {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, width: "fill", children: [
        { id: "b1", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
          { id: "top", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 120, background: "#b8f0cf", children: [] },
        ] },
        { id: "b2", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
          { id: "bottom", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 60, background: "#3b2408", children: [] },
        ] },
      ],
    },
  }],
  homeId: "p1", version: 1,
});

/** A band holding a block that asks to fill it — the token whose meaning must not depend on the screen. */

const heightOf = (page: Page, id: string) => page.evaluate((box) => {
  const el = document.querySelector<HTMLElement>(`[data-box-id="${box}"]`);
  return el ? Math.round(el.getBoundingClientRect().height) : -1;
}, id);

/** Heights of the coloured blocks, found by their background — the export keeps no editor attributes. */
const byColour = (ctx: Page | Frame) => ctx.evaluate(() => {
  const want: Record<string, string> = { "184,240,207": "green", "59,36,8": "brown" };
  const key = (c: string) => {
    const inner = String(c || "").split("(")[1];
    if (!inner) return "";
    return inner.split(")")[0].split(",").slice(0, 3).map((s) => Number(s.trim())).join(",");
  };
  const out: Record<string, number> = {};
  document.querySelectorAll<HTMLElement>("*").forEach((el) => {
    if (el === document.documentElement || el === document.body) return;
    const k = want[key(getComputedStyle(el).backgroundColor)];
    if (!k) return;
    const h = Math.round(el.getBoundingClientRect().height);
    if (out[k] == null || h > out[k]) out[k] = h;
  });
  return out;
});

test.describe("a page is as tall as its content", () => {
  test("a short page does not stretch to the screen, at any screen height", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await seedSite(page, shortPage());
    await page.waitForSelector('[data-box-id="bottom"]', { timeout: 20000 });
    await page.waitForTimeout(500);

    const tall = await heightOf(page, "root");
    await page.setViewportSize({ width: 1440, height: 620 });
    await page.waitForTimeout(500);
    const short = await heightOf(page, "root");

    // Its own content, both times — 120 + 60, whatever the window is doing.
    expect(tall, "the page changed height when the window did").toBe(short);
    expect(tall, "the page stretched towards the screen").toBeLessThan(400);
  });

  test("no block changes height because the window did", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await seedSite(page, shortPage());
    await page.waitForSelector('[data-box-id="bottom"]', { timeout: 20000 });
    await page.waitForTimeout(500);

    const tall = { top: await heightOf(page, "top"), bottom: await heightOf(page, "bottom") };
    await page.setViewportSize({ width: 1440, height: 600 });
    await page.waitForTimeout(600);
    const short = { top: await heightOf(page, "top"), bottom: await heightOf(page, "bottom") };

    /**
     * The same blocks on two different screens. If a page were ever stretched to the window, that space
     * would have to land on SOMETHING, and this is where it would show — as a design changing under the
     * visitor, which is how a person experiences it, rather than as a number in a stylesheet.
     *
     * The fixture is a page the product builds. An earlier version of this test used a block with
     * `height: 100%` inside a `min-height` band, written by hand to look like the real thing. It rendered
     * **0px** — a percentage height resolves only against a DEFINITE parent, and `min-height` is not one —
     * so the guard was measuring a shape the builder never makes. Recorded rather than tidied away, because
     * inventing the fixture is the mistake, not the assertion.
     */
    expect(short.top, "the top block resized because the WINDOW resized").toBe(tall.top);
    expect(short.bottom, "the bottom block resized because the WINDOW resized").toBe(tall.bottom);
    expect(tall.top, "the page did not render").toBeGreaterThan(0);
  });

  test("the canvas and the published page agree about every block", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await seedSite(page, shortPage());
    await page.waitForSelector('[data-box-id="bottom"]', { timeout: 20000 });
    await page.waitForTimeout(500);

    const canvas = await byColour(page);
    expect(canvas.green, "the canvas did not render the page").toBeGreaterThan(0);

    await page.getByRole("button", { name: /Preview/i }).first().click();
    await page.waitForTimeout(2500);

    let preview: Record<string, number> | null = null;
    for (const f of page.frames().filter((x) => x !== page.mainFrame())) {
      try {
        const got = await byColour(f);
        if (got.green || got.brown) { preview = got; break; }
      } catch { /* not ready */ }
    }
    expect(preview, "the preview never rendered").not.toBeNull();

    /**
     * MEASURED PER BLOCK, not as a page total — a total can match while two blocks swap height between
     * them. And `<html>`/`<body>` are excluded deliberately: the document is painted with the page's own
     * background, so matching on colour alone would measure the BACKDROP and report the last band as
     * hundreds of pixels tall. That is exactly the mistake that made a 55px footer look like 256.
     */
    for (const k of ["green", "brown"] as const) {
      expect(preview![k], `the ${k} block is ${canvas[k]}px on the canvas and ${preview![k]}px when published`)
        .toBeGreaterThan(canvas[k] - 4);
      expect(preview![k], `the ${k} block is ${canvas[k]}px on the canvas and ${preview![k]}px when published`)
        .toBeLessThan(canvas[k] + 4);
    }
  });
});
