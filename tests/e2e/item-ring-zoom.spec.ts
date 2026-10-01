import { test, expect } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * AN ITEM'S SELECTION RING SITS ON THE ITEM WHEN THE CANVAS IS FITTED BELOW 100% (BATCH Z-1 · Z1-b).
 * Behaviours: tests/features/components/website/box-builder-site.feature.
 *
 * Found through the UI (`scripts/uat/probe-z1b.js`: an Accordion from the palette, Wide chosen, an item clicked): the
 * ring was drawn 142px narrower and 26px higher than its item at 55%, and the item's toolbar sat ON the item — the
 * rects were measured on screen and used as lengths inside the zoomed canvas. The page is built through the palette here
 * too; only the empty start is seeded.
 */
test("at Wide, fitted below 100%, an Accordion item's ring is the item's own box and its toolbar sits beside it", async ({ page }) => {
  await page.setViewportSize({ width: 1520, height: 900 });
  await seedSite(page, sitePage([]));
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Open blocks panel" }).first().click();
  const tile = page.locator('[draggable="true"]').filter({ hasText: /^\s*Accordion/ }).first();
  await tile.scrollIntoViewIfNeeded();
  await tile.click();
  // A tile with designs answers a click with "Add <x> as…" — a person picks one; this picks Default.
  const def = page.getByRole("menuitem", { name: /^Default$/ }).or(page.locator("button", { hasText: /^\s*Default\s*$/ })).first();
  if (await def.isVisible({ timeout: 1500 }).catch(() => false)) await def.click();
  await page.waitForSelector("[data-eu-item]", { timeout: 15000 });
  await page.getByRole("button", { name: "Close blocks panel" }).first().click();
  await page.locator('button[title="Wide (1920px)"]').first().click();
  await page.waitForTimeout(800);
  const item = page.locator("[data-eu-item]").nth(1);
  const bar = page.getByRole("toolbar", { name: "Edit this item" });
  for (let i = 0; i < 3 && !(await bar.count()); i++) { await item.click({ position: { x: 30, y: 12 } }); await page.waitForTimeout(400); }
  await expect(bar).toHaveCount(1);
  const r = await page.evaluate(() => {
    const el = document.querySelectorAll<HTMLElement & { currentCSSZoom?: number }>("[data-eu-item]")[1];
    const a = document.querySelector("div.ring-indigo-500\\/60")!.getBoundingClientRect(), b = el.getBoundingClientRect();
    const t = document.querySelector('[role="toolbar"][aria-label="Edit this item"]')!.getBoundingClientRect();
    return { zoom: el.currentCSSZoom ?? 1, d: [a.top - b.top, a.left - b.left, a.width - b.width, a.height - b.height].map(Math.round), barGap: Math.round(t.left - b.right) };
  });
  expect(r.zoom, "the canvas really is fitted below 100%").toBeLessThan(0.9);
  for (const d of r.d) expect(Math.abs(d), `ring vs item (top, left, width, height): ${r.d.join(", ")}px at zoom ${r.zoom.toFixed(2)}`).toBeLessThanOrEqual(3);
  expect(r.barGap, `the toolbar starts ${r.barGap}px right of the item — on it when negative`).toBeGreaterThanOrEqual(0);
});
