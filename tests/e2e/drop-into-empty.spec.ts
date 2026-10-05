import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * A BLOCK CARRIED OVER AN EMPTY BOX NEVER HAS THE EDITOR'S HINT UNDER THE POINTER (BATCH L-1 · L1-7).
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Tier-99 page 337 lost a drop into an empty coloured Stack in 3 runs of 4. Recorded in the browser at the release point,
 * with the pointer still: `dragover <div> accepted`, `dragenter <button>` (the empty box's "+"), `dragleave <div>`,
 * `dragleave <button>` — and no `dragover` after, so the browser had no accepted target and sent `dragend` instead of `drop`.
 * The hint that came and went under a still pointer was the cause. While a block is carried, the hints take no pointer:
 * what is under it is the box itself. Only a REAL drag raises `data-box-drag-in`, so this drags the tile with the mouse.
 * The shape is seeded ONLY because the loss was first reproduced through the UI (the page-337 build, RULE Y).
 */
const seedEmpty = async (page: Page) => {
  await seedSite(page, sitePage([
    { id: "sec", type: "container", direction: "column", spaced: true, children: [
      { id: "h", type: "heading", text: "A section", width: "100%" },
      { id: "empty", type: "container", direction: "column", width: "100%", padding: 24, background: "#fef2f2", children: [] },
    ] },
  ]));
  await page.waitForSelector('[data-box-id="empty"]', { timeout: 15000 });
  await page.waitForTimeout(400);
};

test("carrying a block over an empty box's \"+\", the pointer is on the box, never on the hint — and the drop lands", async ({ page }) => {
  await page.setViewportSize({ width: 1520, height: 900 });
  await seedEmpty(page);
  await page.getByRole("button", { name: "Open blocks panel" }).first().click();
  const tile = page.locator('[draggable="true"]').filter({ hasText: /^\s*Text/ }).first();
  await tile.scrollIntoViewIfNeeded();
  const t = (await tile.boundingBox())!;
  const plus = (await page.locator('[data-box-id="empty"] button[aria-label="Choose a block to add inside"]').boundingBox())!;
  const x = plus.x + plus.width / 2, y = plus.y + plus.height / 2;
  await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2); await page.mouse.down();
  for (let i = 1; i <= 16; i++) { await page.mouse.move(t.x + t.width / 2 + ((x - t.x - t.width / 2) * i) / 16, t.y + t.height / 2 + ((y - t.y - t.height / 2) * i) / 16); await page.waitForTimeout(15); }
  await page.waitForTimeout(150);
  // HELD STILL over the "+": what the browser would hit-test there is the empty box itself, not the editor's hint
  const under = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y)!; return { box: e.closest("[data-box-id]")?.getAttribute("data-box-id"), hint: !!e.closest("[data-ph] button, [data-gridghost]"), tag: e.tagName.toLowerCase() }; }, [x, y]);
  expect(under.hint, `the pointer is on the empty box's hint (<${under.tag}>) while a block is carried — L1-7`).toBe(false);
  expect(under.box).toBe("empty");
  await page.mouse.up(); await page.waitForTimeout(700);
  const inside = await page.evaluate(() => document.querySelectorAll('[data-box-id="empty"] [data-box-id]').length);
  expect(inside, "the Text landed inside the empty box").toBeGreaterThan(0);
});
