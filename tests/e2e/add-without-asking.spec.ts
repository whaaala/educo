import { test, expect, type Page } from "@playwright/test";
import { clearSite } from "./helpers/seed-site";

/**
 * ADDING A BLOCK — what interrupts you, and what does not.
 *
 * Behaviours: tests/features/components/website/blocks-panel.feature.
 *
 * Driven through the real palette, because the thing being asserted is how it FEELS to add a block: one
 * click, or one click and a menu.
 */

async function freshBuilder(page: Page) {
  await clearSite(page);
  await page.waitForSelector("text=Box Builder", { timeout: 20000 });
  await page.waitForTimeout(600);
  await page.keyboard.press("b");
  await page.waitForTimeout(600);
}

/** How many nodes the page holds — the honest way to ask "did something land?". */
const nodeCount = (page: Page) => page.evaluate(() => {
  const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
  let n = 0; const walk = (x: Record<string, unknown>) => { n++; ((x.children as Record<string, unknown>[]) ?? []).forEach(walk); };
  if (site.pages) walk(site.pages[0].root);
  return n;
});

const tile = (page: Page, name: string) => page.locator('[role="button"]', { hasText: new RegExp(`^${name}`) }).first();

test.describe("a look on an empty box is not worth a question", () => {
  for (const name of ["Stack", "Side by side", "Image", "Icon"]) {
    test(`${name} lands on one click, with nothing in the way`, async ({ page }) => {
      await freshBuilder(page);
      const before = await nodeCount(page);
      const t = tile(page, name);
      await expect(t, "and it does not advertise a menu it no longer opens").not.toHaveAttribute("aria-haspopup", "menu");
      await t.scrollIntoViewIfNeeded();
      await t.click();
      await page.waitForTimeout(900);
      await expect(page.locator('[role="menu"]'), "no menu — the block is simply added").toHaveCount(0);
      expect(await nodeCount(page), "and it really did land").toBeGreaterThan(before);
    });
  }
});

test.describe("a structural choice, or the block's role, still asks", () => {
  for (const [name, why] of [["Heading", "Display or Eyebrow is its place in the document"],
                             ["Grid", "the shape is structural — changing it later means redoing the content"],
                             ["Photo gallery", "the photographs ARE the content"]] as const) {
    test(`${name} asks first — ${why}`, async ({ page }) => {
      await freshBuilder(page);
      const before = await nodeCount(page);
      const t = tile(page, name);
      await expect(t).toHaveAttribute("aria-haspopup", "menu");
      await t.scrollIntoViewIfNeeded();
      await t.click();
      await page.waitForTimeout(900);
      const asked = (await page.locator('[role="menu"]').count()) + (await page.locator('[aria-label^="Add a"]').count());
      expect(asked, "something must ask").toBeGreaterThan(0);
      expect(await nodeCount(page), "and NOTHING is added until it is answered").toBe(before);
    });
  }
});

test.describe("the looks did not disappear — they moved to where they can be judged", () => {
  test("a Stack still offers all four styles, as previews of the real block", async ({ page }) => {
    await freshBuilder(page);
    await tile(page, "Stack").click();
    await page.waitForTimeout(1000);
    await page.keyboard.press("b");           // close the palette so it cannot cover the canvas
    await page.waitForTimeout(400);

    // select the section
    const box = page.locator("[data-box-id]").last();
    const b = (await box.boundingBox())!;
    await page.mouse.click(b.x + b.width * 0.5, b.y + 10);
    await page.waitForTimeout(700);

    const gallery = page.locator('[aria-label="Style presets"]');
    await expect(gallery, "the same four looks, in the inspector").toBeVisible({ timeout: 10000 });
    for (const look of ["Plain", "Card", "Outline", "Tinted"]) {
      await expect(page.locator(`[aria-label="${look} style"]`), `${look} is still offered`).toHaveCount(1);
    }
    // RULE S — each tile must SHOW the look, not name it.
    const drawn = await gallery.evaluate((g) => g.querySelectorAll(".eu-root").length);
    expect(drawn, "every tile renders the block wearing that style").toBeGreaterThan(3);
  });
});

test.describe("a height you set beats the courtesy height", () => {
  // An empty box gets 8rem so it is visible and droppable — an OFFER, which its own comment says must step
  // aside for a size the user set. `screenHeight` was missing from that list, so "Full screen" was stored
  // and ignored: 128px on the canvas with `screenHeight: "full"` on the node. Empty is exactly when someone
  // sets it — you lay the band out, then fill it — so the control did nothing at the only moment it was used.
  test("Full screen works on an EMPTY section, which is when it is set", async ({ page }) => {
    await freshBuilder(page);
    await tile(page, "Stack").click();
    await page.waitForTimeout(900);
    await page.keyboard.press("b");
    await page.waitForTimeout(400);

    const box = page.locator("[data-box-id]").last();
    const b = (await box.boundingBox())!;
    await page.mouse.click(b.x + b.width * 0.5, b.y + 10);
    await page.waitForTimeout(600);

    const arrange = page.locator("button", { hasText: /^Arrange/ }).first();
    if (await arrange.count()) {
      const open = await arrange.getAttribute("aria-expanded");
      if (open === "false") await arrange.click();
      await page.waitForTimeout(300);
    }
    await page.locator('[aria-label="Screen height"] button', { hasText: "Full screen" }).click();

    await expect.poll(async () => page.locator("[data-box-id]").last().evaluate(
      (el) => Math.round((el.getBoundingClientRect().height / window.innerHeight) * 100),
    ), { timeout: 8000, message: "an empty section set to Full screen must actually be one screen tall" })
      .toBeGreaterThanOrEqual(90);
  });

  test("…and an empty section nobody sized still gets its courtesy height", async ({ page }) => {
    // The offer must survive the fix: an unsized empty box is still visible and droppable rather than 0px.
    await freshBuilder(page);
    await tile(page, "Stack").click();
    await page.waitForTimeout(900);
    const h = await page.locator("[data-box-id]").last().evaluate((el) => Math.round(el.getBoundingClientRect().height));
    expect(h, "still a box you can see and drop into").toBeGreaterThan(100);
    expect(h, "but not a screenful nobody asked for").toBeLessThan(300);
  });
});

/**
 * THE PAGE'S OWN FLOOR is the same kind of offer, one level up — and it was not stepping aside.
 *
 * Reported from the canvas: adding a Stack left a strip of dead space underneath it. The page root carried
 * `PAGE_MIN_H` (160px) unconditionally while an empty Stack is 128px, so 32px sat below the block — on the
 * ROOT, where there is no control to remove it.
 *
 * It was also a canvas ≠ export break, which is the more serious half: the exporter writes no page minimum
 * at all, so the editor had been drawing a page taller than the published one for any page shorter than
 * 160px. Measured on the PAGE ROOT rather than on a wrapper, because the floor lives on the root.
 */
test.describe("the page is exactly as tall as what is on it", () => {
  const pageRootBox = (page: Page) =>
    page.locator("[data-box-id]").first().evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) };
    });

  test("adding a block leaves NO space below it", async ({ page }) => {
    await freshBuilder(page);
    await tile(page, "Stack").click();
    await page.waitForTimeout(900);

    const root = await pageRootBox(page);
    // The deepest block on the page — the Stack itself, not the band around it.
    const last = await page.locator("[data-box-id]").last().evaluate((el) => Math.round(el.getBoundingClientRect().bottom));
    expect(root.bottom - last, "the page must end where its content ends, not 32px later").toBeLessThanOrEqual(2);
  });

  test("an EMPTY page still has a floor, so there is somewhere to drop the first block", async ({ page }) => {
    // The offer this fix must not remove: with nothing on it, the page is still a visible drop target.
    await freshBuilder(page);
    const root = await pageRootBox(page);
    expect(root.height, "an empty page is still a box you can aim at").toBeGreaterThan(100);
  });

  test("and it still grows past the floor with real content", async ({ page }) => {
    // The other direction: removing the floor must not CAP the page.
    //
    // Added through the top bar, not the palette. A palette tile lands inside whatever is selected — and the
    // block just added IS selected — so clicking Stack three times nests three boxes and leaves the page
    // 128px tall, which measures the nesting rule rather than this one. "Add a band" always adds at page
    // level, which is what makes this a test of the page's height.
    await freshBuilder(page);
    await page.keyboard.press("b"); // close the palette so it cannot cover the top bar
    await page.waitForTimeout(400);
    for (let i = 0; i < 3; i++) {
      await page.locator("button", { hasText: "Add a band" }).first().click();
      await page.waitForTimeout(800);
    }
    const root = await pageRootBox(page);
    expect(root.height, "three bands make a page taller than the empty-page floor").toBeGreaterThan(300);
  });
});
