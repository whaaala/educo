import { test, expect, type Page } from "@playwright/test";

/**
 * ADDING A BLOCK — what interrupts you, and what does not.
 *
 * Behaviours: tests/features/components/website/blocks-panel.feature.
 *
 * Driven through the real palette, because the thing being asserted is how it FEELS to add a block: one
 * click, or one click and a menu.
 */

async function freshBuilder(page: Page) {
  await page.goto("/website/box-demo");
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem("educo_box_site_cleaned_v1", "1"); });
  await page.reload();
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
  for (const name of ["Section", "Row", "Image", "Icon"]) {
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
                             ["Columns", "the shape is structural — changing it later means redoing the content"],
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
  test("a Section still offers all four styles, as previews of the real block", async ({ page }) => {
    await freshBuilder(page);
    await tile(page, "Section").click();
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
    await tile(page, "Section").click();
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
    await tile(page, "Section").click();
    await page.waitForTimeout(900);
    const h = await page.locator("[data-box-id]").last().evaluate((el) => Math.round(el.getBoundingClientRect().height));
    expect(h, "still a box you can see and drop into").toBeGreaterThan(100);
    expect(h, "but not a screenful nobody asked for").toBeLessThan(300);
  });
});
