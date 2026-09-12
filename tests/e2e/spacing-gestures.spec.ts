import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * ADJUSTING SPACING — the controls, and what one adjustment costs.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * Spacing is judged by eye and never by arithmetic, so every spacing control has to be something you can
 * sweep: "Space across" and "Space down" were number boxes, where the only way to find the value you wanted
 * was to type a guess, look at it, and type another one.
 *
 * And an adjustment is ONE act. Each tick used to push its own undo entry, so Ctrl+Z walked back a pixel of
 * spacing at a time — except that it did not walk back at all, because the slider still had focus and the
 * keyboard handler handed every Ctrl+Z to the focused input. Measured before the fix: thirty adjustments,
 * thirty entries, and sixty Ctrl+Z presses that reversed nothing whatsoever.
 */

/** A grid of pictures in the builder, which is the thing whose spacing people come here to change. */
async function seedGallery(page: Page) {
  const cell = (i: number) => ({
    id: `c${i}`, type: "container", layout: "flex", direction: "column", padding: 0, gap: 0,
    width: "100%", colSpan: 3, background: "#c7d2fe",
    children: [{ id: `t${i}`, type: "text", text: `Photo ${i}`, width: "auto" }],
  });
  await seedSite(page, sitePage([
    { id: "tgt", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "100%",
      children: Array.from({ length: 8 }, (_, i) => cell(i)) },
  ]));
  await page.waitForSelector('[data-box-id="tgt"]', { timeout: 15000 });
  await page.waitForTimeout(300);
}

/** Select the GRID — one click on a cell takes the outermost block of the chain, which is the grid itself. */
async function selectGrid(page: Page) {
  const b = (await page.locator('[data-box-id="c0"]').boundingBox())!;
  await page.mouse.click(b.x + b.width * 0.25, b.y + b.height * 0.75);
  await page.waitForTimeout(300);
  await expect(page.locator('[data-box-id="tgt"]')).toHaveClass(/outline-indigo-500/);
}

/** The grid's stored spacing, read back out of the saved tree. */
const gapsOf = (page: Page) =>
  page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    let g: Record<string, unknown> | null = null;
    const walk = (n: Record<string, unknown>) => { if (!g && n.layout === "grid") g = n; ((n.children as Record<string, unknown>[]) ?? []).forEach(walk); };
    walk(site.pages[0].root);
    const grid = g as unknown as Record<string, number | undefined>;
    return { gap: grid.gap ?? null, gapX: grid.gapX ?? null, gapY: grid.gapY ?? null };
  });

test.describe("spacing is adjusted, not typed", () => {
  test("across and down are sliders, like the spacing control above them", async ({ page }) => {
    await seedGallery(page);
    await selectGrid(page);
    for (const label of ["Space between blocks", "Space across", "Space down"]) {
      await expect(page.locator(`input[type="range"][aria-label="${label}"]`), `${label} must be something you can sweep`)
        .toHaveCount(1);
    }
  });

  test("an axis follows the shared spacing until it is given one of its own, and can be handed back", async ({ page }) => {
    // A slider has no way to show "nothing set here" — every position is a number. So the state has to be
    // said in words, and the way back has to exist, or nudging the slider once would silently pin an axis
    // that was meant to keep following.
    await seedGallery(page);
    await selectGrid(page);
    const matchAcross = page.locator('button[aria-label*="Space across"]');
    await expect(matchAcross, "it starts out following").toHaveText(/Matching/);

    await page.locator('input[type="range"][aria-label="Space across"]').focus();
    for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(250);
    expect((await gapsOf(page)).gapX, "the axis now has a value of its own").toBe(6);
    await expect(matchAcross, "…and offers to go back to following").toHaveText(/^Match /);

    await matchAcross.click();
    await page.waitForTimeout(250);
    expect((await gapsOf(page)).gapX, "handed back, it follows the shared spacing again").toBeNull();
  });

  test("the canvas shows the spacing as it is adjusted", async ({ page }) => {
    await seedGallery(page);
    await selectGrid(page);
    await page.locator('input[type="range"][aria-label="Space across"]').focus();
    for (let i = 0; i < 12; i++) await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
    const gaps = await page.locator('[data-box-id="tgt"]').evaluate((el) => {
      const cs = getComputedStyle(el);
      return { col: parseFloat(cs.columnGap) || 0, row: parseFloat(cs.rowGap) || 0 };
    });
    expect(gaps.col, "across opened up").toBeGreaterThan(4);
    expect(gaps.row, "and down did not — the two axes are separate").toBeLessThan(2);
  });
});

test.describe("an adjustment is one act", () => {
  test("ONE undo puts back a whole sweep of the spacing slider", async ({ page }) => {
    await seedGallery(page);
    await selectGrid(page);
    await page.locator('input[type="range"][aria-label="Space across"]').focus();
    for (let i = 0; i < 20; i++) await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
    expect((await gapsOf(page)).gapX, "the sweep landed").toBe(20);

    await page.keyboard.press("Control+z");
    await page.waitForTimeout(350);
    expect((await gapsOf(page)).gapX, "one press, not one per tick of the slider").toBeNull();
  });

  test("Ctrl+Z works while the slider still has focus", async ({ page }) => {
    // The bug on its own: the keyboard handler stepped aside for ANY focused input so the browser's text
    // undo could run. A range slider holds no text, so undo simply stopped existing after every adjustment.
    await seedGallery(page);
    await selectGrid(page);
    const slider = page.locator('input[type="range"][aria-label="Space down"]');
    await slider.focus();
    for (let i = 0; i < 8; i++) await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
    expect((await gapsOf(page)).gapY).toBe(8);

    await expect(slider, "the slider is still the focused element — that is the point of the test").toBeFocused();
    await page.keyboard.press("Control+z");
    await page.waitForTimeout(350);
    expect((await gapsOf(page)).gapY, "undo is not swallowed by the control that made the change").toBeNull();
  });

  test("two DIFFERENT controls are two acts, however fast they follow each other", async ({ page }) => {
    // The coalescing must not swallow genuinely separate edits. The key is the block plus the fields being
    // written, so a change of axis — or of block — starts a new entry immediately.
    await seedGallery(page);
    await selectGrid(page);
    await page.locator('input[type="range"][aria-label="Space across"]').focus();
    for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowRight");
    await page.locator('input[type="range"][aria-label="Space down"]').focus();
    for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
    expect(await gapsOf(page)).toMatchObject({ gapX: 5, gapY: 5 });

    await page.keyboard.press("Control+z");
    await page.waitForTimeout(350);
    expect(await gapsOf(page), "the second act is undone; the first is still there").toMatchObject({ gapX: 5, gapY: null });
  });
});
