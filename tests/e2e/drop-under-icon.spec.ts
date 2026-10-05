import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * A BLOCK DROPPED UNDER AN ICON IN A GRID CELL (E-0, asked by the user 2026-09-30 from a screenshot of the sweep).
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * E0-g — the drop was offered and NOTHING was added, 4 of 4: React re-set the icon's SVG markup while the drag passed over
 * it, and the browser delivered the drop to a `<path>` no longer in the page, so the canvas never heard it. Only a REAL
 * drag shows it (a synthetic `drop` is dispatched to whatever is there now), so this drags the palette tile with the mouse.
 * E0-h — the cell is as tall as the quote beside it, and its rows SHARED that spare height: the Text landed 55px under the
 * icon. The user decided "blocks at the top": the Text sits one stack gap under it, the spare height below.
 * The shape is seeded ONLY because it was first reproduced through the UI (`scripts/uat/probe-icon-cell.js`, RULE Y).
 */
const quote = "This changed everything for us — we couldn't be happier. ".repeat(4);
const seedIconCell = async (page: Page) => {
  await seedSite(page, sitePage([
    { id: "sec", type: "container", direction: "column", spaced: true, children: [
      { id: "g", type: "container", layout: "grid", columns: 3, width: "100%", spaced: true, children: [
        { id: "c0", type: "container", direction: "column", spaced: true, children: [{ id: "b0", type: "container", rowBand: true, direction: "row", width: "fill", spaced: true, children: [{ id: "ic", type: "icon", icon: "Star", width: "auto" }] }] },
        { id: "c1", type: "container", direction: "column", spaced: true, children: [{ id: "b1", type: "container", rowBand: true, direction: "row", width: "fill", spaced: true, children: [{ id: "q1", type: "text", text: quote, width: "100%" }] }] },
        { id: "c2", type: "container", direction: "column", spaced: true, children: [] },
      ] },
    ] },
  ]));
  await page.waitForSelector('[data-box-id="ic"]', { timeout: 15000 });
  await page.waitForTimeout(400);
};

test("a Text dragged from the palette to just under an icon lands under it, in its cell, one gap below", async ({ page }) => {
  await page.setViewportSize({ width: 1520, height: 900 });
  await seedIconCell(page);
  await page.getByRole("button", { name: "Open blocks panel" }).first().click();
  const tile = page.locator('[draggable="true"]').filter({ hasText: /^\s*Text/ }).first();
  await tile.scrollIntoViewIfNeeded();
  const t = (await tile.boundingBox())!; const icon = (await page.locator('[data-box-id="ic"]').boundingBox())!;
  const before = await page.evaluate(() => document.querySelectorAll('[data-box-id]').length);
  // a REAL drag, released ON the icon near its bottom — where a hand lands to say "under this"
  await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2); await page.mouse.down();
  const x = icon.x + icon.width / 2, y = icon.y + icon.height - 5;
  for (let i = 1; i <= 16; i++) { await page.mouse.move(t.x + t.width / 2 + ((x - t.x - t.width / 2) * i) / 16, t.y + t.height / 2 + ((y - t.y - t.height / 2) * i) / 16); await page.waitForTimeout(15); }
  await page.waitForTimeout(120); await page.mouse.up(); await page.waitForTimeout(700);

  const got = await page.evaluate(() => {
    const cells = document.querySelectorAll('[data-box-id="g"] > [data-box-id]').length;
    const inCell = [...document.querySelectorAll('[data-box-id="c0"] [data-box-id]')].map((e) => e.getAttribute("data-box-id")).filter((id) => !["b0", "ic"].includes(id!));
    const text = inCell.map((id) => document.querySelector(`[data-box-id="${id}"]`)!).find((e) => (e as HTMLElement).innerText.trim());
    const Z = Number(document.querySelector('[data-box-id]')!.closest<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale) || 1;
    const ib = document.querySelector('[data-box-id="ic"]')!.getBoundingClientRect(); const tb = text?.getBoundingClientRect();
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return { cells, landed: !!text, gap: tb ? (tb.top - ib.bottom) / Z : null, rem };
  });
  expect(await page.evaluate(() => document.querySelectorAll('[data-box-id]').length), "E0-g: the drop added something").toBeGreaterThan(before);
  expect(got.cells, "no new grid cell").toBe(3);
  expect(got.landed, "E0-g: the Text is in the icon's cell").toBe(true);
  expect(got.gap!, "under the icon, not beside or above it").toBeGreaterThan(0);
  expect(got.gap!, "E0-h: one stack gap under the icon, not a share of the cell's spare height").toBeLessThan(got.rem * 1.6);
});
