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
 * ADDING A BLOCK NEVER MOVES YOUR INSERTION POINT.
 *
 * Reported: "I can no longer add stack one after the other." Two deliberate behaviours were colliding. A
 * block is inserted into the SELECTED container — which is what makes "select a cell, add a Columns block
 * inside it" work, and was itself a fix for an earlier report. And a freshly added block is SELECTED, so you
 * can see and style what landed. Together, every click went one level deeper: clicking Stack three times
 * gave three boxes nested inside one another instead of three down the page, with no way to stop it short of
 * clicking elsewhere between every add.
 *
 * The rule now: a selection the BUILDER made for you is not a place to insert into — only one YOU made is.
 * Repeating a click repeats the result.
 */
test.describe("adding a block never moves your insertion point", () => {
  /** The page tree, as depth-tagged lines — shape is what matters here, not ids. */
  const shape = (page: Page) => page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    if (!site.pages) return [] as string[];
    const out: string[] = [];
    const walk = (n: Record<string, unknown>, d: number) => {
      out.push(`${d}:${n.type}${n.rowBand ? "[band]" : ""}`);
      ((n.children as Record<string, unknown>[]) ?? []).forEach((c) => walk(c, d + 1));
    };
    walk(site.pages[0].root as Record<string, unknown>, 0);
    return out;
  });

  test("three Stacks in a row become three blocks DOWN THE PAGE, not three nested", async ({ page }) => {
    await freshBuilder(page);
    for (let i = 0; i < 3; i++) {
      await tile(page, "Stack").click();
      await page.waitForTimeout(900);
    }
    const lines = await shape(page);
    // Three bands directly under the page root — siblings, each holding one Stack.
    expect(lines.filter((l) => l.startsWith("1:")).length, "three blocks at page level").toBe(3);
    // Nothing deeper than page → band → stack. A nest would push the tree to depth 4+.
    const deepest = Math.max(...lines.map((l) => Number(l.split(":")[0])));
    expect(deepest, "clicking the same tile must never bury the next block inside the last one").toBeLessThanOrEqual(2);
  });

  test("a container YOU selected gets the block AFTER it — and 'Add a block inside' still nests", async ({ page }) => {
    /**
     * THIS ASSERTED THE OPPOSITE, and both versions are answers to a real report.
     *
     * The old rule — a selection the user made IS an insertion target — came from "I can no longer add
     * grid/grids within an already added grid". It worked, and it had a blind spot: an EMPTY container is
     * the commonest thing to have selected, and a block inside an empty one is pixel-identical to it. Same
     * width, same height, same position. Measured: 432×150 at y=88, exactly the selected stack's own box.
     *
     * So the click looked like it had failed, and clicking again put a SECOND block inside — at which point
     * the parent finally grew and the second click looked like the one that worked. Two nested blocks where
     * one was wanted, reported as "I always have to click this twice".
     *
     * The palette now places a SIBLING, which is always somewhere new. Nesting keeps the route it already
     * had, and the second half of this test is what stops that being a promise: "+ Add a block inside" must
     * still put a block INSIDE, or the first report is simply back.
     */
    await freshBuilder(page);
    await tile(page, "Stack").click();
    await page.waitForTimeout(900);
    await page.keyboard.press("b"); // close the palette so it cannot cover the canvas
    await page.waitForTimeout(400);

    // Click the Stack myself, so the selection is mine rather than the builder's.
    const box = page.locator("[data-box-id]").last();
    const b = (await box.boundingBox())!;
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
    await page.waitForTimeout(700);

    await page.keyboard.press("b");
    await page.waitForTimeout(500);
    await tile(page, "Stack").click();
    await page.waitForTimeout(900);

    const lines = await shape(page);
    expect(lines.filter((l) => l.startsWith("1:")).length, "TWO blocks at page level — a sibling, not a child")
      .toBe(2);

    // …and the explicit route still nests, which is the half that keeps the earlier report fixed.
    const inside = page.getByRole("button", { name: /Add a block inside/i });
    expect(await inside.count(), "the explicit nesting control is there").toBeGreaterThan(0);
    const depthBefore = Math.max(...lines.map((l) => Number(l.split(":")[0])));
    await inside.first().click();
    await page.waitForTimeout(900);
    const after = await shape(page);
    expect(Math.max(...after.map((l) => Number(l.split(":")[0]))), "it put a block one level deeper")
      .toBeGreaterThan(depthBefore);
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
