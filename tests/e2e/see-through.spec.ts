import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * SEE-THROUGH, measured in a browser: a faded box, solid contents.
 *
 * Behaviours: tests/features/components/website/box-builder-design.feature.
 *
 * The unit tests assert what we EMIT. This asserts what a browser actually paints, because the failure mode
 * being guarded is a CSS one: `opacity` on a parent silently multiplies into every descendant, and no unit
 * test that reads a style object can see that happening.
 */

async function seedAndOpen(page: Page) {
  await seedSite(page, sitePage([
    { id: "grid", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "100%",
      background: "#3366cc", opacity: 30, children: [
        { id: "solid", type: "container", layout: "flex", direction: "column", padding: 0, gap: 0, width: "100%",
          colSpan: 6, background: "#ffffff", minHeight: 80, children: [
            { id: "deep", type: "container", layout: "flex", direction: "column", padding: 0, gap: 0, width: "100%",
              background: "#111111", minHeight: 40, children: [] },
          ] },
        { id: "faded", type: "container", layout: "flex", direction: "column", padding: 0, gap: 0, width: "100%",
          colSpan: 6, background: "#ffffff", opacity: 50, minHeight: 80, children: [
            { id: "inFaded", type: "container", layout: "flex", direction: "column", padding: 0, gap: 0, width: "100%",
              background: "#008000", minHeight: 40, children: [] },
          ] },
      ] },
  ]));
  await page.waitForSelector('[data-box-id="grid"]', { timeout: 15000 });
  await page.waitForTimeout(300);
}

/** The `opacity` a browser has actually resolved on this element. */
const opacityOf = (page: Page, id: string) =>
  page.locator(`[data-box-id="${id}"]`).evaluate((el) => getComputedStyle(el).opacity);
const bgOf = (page: Page, id: string) =>
  page.locator(`[data-box-id="${id}"]`).evaluate((el) => getComputedStyle(el).backgroundColor);

test.describe("a see-through box fades, its contents do not", () => {
  test("the faded grid is see-through and NOTHING inside it is", async ({ page }) => {
    await seedAndOpen(page);
    // The grid itself: the fade is in its background colour, and its element opacity stays 1 — which is the
    // only way a child can be solid inside it.
    expect(await opacityOf(page, "grid"), "no group fade on the parent").toBe("1");
    expect(await bgOf(page, "grid"), "the fade is in the paint").toBe("rgba(51, 102, 204, 0.3)");
    // The child the user did not touch: fully solid, at both levels.
    expect(await opacityOf(page, "solid")).toBe("1");
    expect(await bgOf(page, "solid"), "a white cell stays white, not a washed-out blue-white").toBe("rgb(255, 255, 255)");
    expect(await bgOf(page, "deep"), "and so does what is inside IT").toBe("rgb(17, 17, 17)");
  });

  test("an individual child can be see-through on its own, and protects ITS content", async ({ page }) => {
    await seedAndOpen(page);
    expect(await bgOf(page, "faded"), "this one cell fades").toBe("rgba(255, 255, 255, 0.5)");
    expect(await opacityOf(page, "faded"), "again without a group fade").toBe("1");
    expect(await bgOf(page, "inFaded"), "its own content is untouched — the rule holds at every depth").toBe("rgb(0, 128, 0)");
  });

  test("the PUBLISHED page fades exactly the same way", async ({ page }) => {
    // canvas = export. A fade written as element opacity in one and as colour alpha in the other would look
    // identical on an empty box and completely different the moment anything was put in it.
    await seedAndOpen(page);
    await page.getByRole("button", { name: /^Preview/ }).click();
    await page.waitForTimeout(800);
    const frame = page.frameLocator("iframe").first();
    const grid = frame.locator("#grid, [id='grid']").first();
    const shown = await grid.count();
    if (shown) {
      expect(await grid.evaluate((el) => getComputedStyle(el).opacity), "published: no group fade").toBe("1");
    }
    // Whether or not the preview exposes ids, the rule that matters is that no ancestor fade is published —
    // assert it on the exported stylesheet instead, which is the thing a visitor downloads.
    const css = await page.evaluate(() => {
      const sheets = Array.from(document.querySelectorAll("iframe")).map((f) => {
        try { return (f as HTMLIFrameElement).contentDocument?.documentElement.outerHTML ?? ""; } catch { return ""; }
      });
      return sheets.join("\n");
    });
    expect(css, "the preview rendered something").not.toBe("");
    expect(/opacity:\s*0\.3/.test(css), "a group fade must never be published for a paint-only see-through").toBe(false);
    expect(/rgba\(51,\s*102,\s*204,\s*0?\.3\)/.test(css), "the fade travels in the colour").toBe(true);
  });
});

/**
 * A BACKGROUND IMAGE, faded — the case colour alpha cannot reach.
 *
 * There is no per-layer opacity in CSS, and every way of fading an image on the element itself (`opacity`,
 * `filter`, `mask`) takes the contents down with it, which is the exact thing being avoided. So the whole
 * background stack moves onto the box's own `::before`, which carries the opacity by itself: a pseudo-element
 * is not a child, so nothing inside the box is affected — and no extra `<div>` is needed in either renderer,
 * because both already emit per-node CSS rules.
 */
const PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

async function seedImage(page: Page, opacity?: number, fadeContents?: boolean) {
  await seedSite(page, sitePage([
    { id: "hero", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 200,
      bgImage: PIXEL, opacity, fadeContents, children: [
        { id: "card", type: "container", direction: "column", padding: 0, gap: 0, width: "100%",
          background: "#ffffff", minHeight: 60, children: [{ id: "cap", type: "text", text: "solid caption", width: "auto" }] },
      ] },
  ]));
  await page.waitForSelector('[data-box-id="hero"]', { timeout: 15000 });
  await page.waitForTimeout(400);
}

/** What the box's `::before` is actually painting, as the browser resolved it. */
const layerOf = (page: Page, id: string) =>
  page.locator(`[data-box-id="${id}"]`).evaluate((el) => {
    const b = getComputedStyle(el, "::before");
    return { content: b.content, opacity: b.opacity, image: b.backgroundImage.slice(0, 24), position: b.position, zIndex: b.zIndex };
  });

test.describe("a see-through background IMAGE", () => {
  test("the image fades on a layer of its own, and the card on top stays solid", async ({ page }) => {
    await seedImage(page, 40);
    const layer = await layerOf(page, "hero");
    expect(layer.content, "the box paints through a ::before").not.toBe("none");
    expect(layer.opacity, "which carries the fade").toBe("0.4");
    expect(layer.image, "and the image itself").toContain("url(");
    expect(layer.position).toBe("absolute");
    expect(layer.zIndex, "behind the box's own content").toBe("-1");

    expect(await opacityOf(page, "hero"), "the BOX is never faded — that is what would take the contents").toBe("1");
    expect(await bgOf(page, "card"), "so the card on top is exactly as solid as it was").toBe("rgb(255, 255, 255)");
    expect(await opacityOf(page, "card")).toBe("1");
    expect(await opacityOf(page, "cap"), "and so is its caption").toBe("1");
  });

  test("the box is a stacking context, so the layer cannot slide behind an ancestor", async ({ page }) => {
    // `z-index:-1` is what puts the layer BEHIND the box's own content. Without a stacking context on the box
    // itself, -1 does not stop there: it keeps going until it finds one, and lands behind whatever ancestor
    // has a background — where it is invisible. `isolation:isolate` is the whole of the fix and it is
    // deliberately asserted here rather than through appearance, because the two look identical until some
    // ancestor happens to be painted, at which point the picture silently vanishes.
    await seedImage(page, 40);
    const iso = await page.locator('[data-box-id="hero"]').evaluate((el) => getComputedStyle(el).isolation);
    expect(iso, "the layer's -1 has to stop at this box").toBe("isolate");
  });

  test("the element itself carries no background — or the image would paint twice", async ({ page }) => {
    await seedImage(page, 40);
    const own = await page.locator('[data-box-id="hero"]').evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(own, "the stack lives on the layer, not on the box").toBe("none");
  });

  test("no fade means no layer at all — nothing is added to a box that did not ask", async ({ page }) => {
    await seedImage(page);
    expect((await layerOf(page, "hero")).content, "no ::before").toBe("none");
    const own = await page.locator('[data-box-id="hero"]').evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(own, "the image paints on the box as it always did").toContain("url(");
  });

  test("'fade what's inside too' goes back to fading the whole box", async ({ page }) => {
    await seedImage(page, 40, true);
    expect((await layerOf(page, "hero")).content, "no layer — the box itself fades").toBe("none");
    expect(await opacityOf(page, "hero")).toBe("0.4");
  });

  test("the PUBLISHED page carries the same layer rule", async ({ page }) => {
    await seedImage(page, 40);
    await page.getByRole("button", { name: /^Preview/ }).click();
    await page.waitForTimeout(900);
    const html = await page.evaluate(() => Array.from(document.querySelectorAll("iframe")).map((f) => {
      try { return (f as HTMLIFrameElement).contentDocument?.documentElement.outerHTML ?? ""; } catch { return ""; }
    }).join("\n"));
    expect(html).not.toBe("");
    expect(/::before\{[^}]*opacity:0\.4/.test(html), "the exported sheet fades the layer").toBe(true);
    expect(/opacity:\s*0\.4[;}]/.test(html.replace(/::before\{[^}]*\}/g, "")), "and never fades the box itself").toBe(false);
  });
});
