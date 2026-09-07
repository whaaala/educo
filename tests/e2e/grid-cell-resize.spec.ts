import { test, expect, type Page } from "@playwright/test";

/**
 * RESIZING A GRID CELL, driven through the REAL builder.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * Every other layout spec renders the exporter's HTML with `setContent`, which is right for asking what a
 * visitor gets. A drag cannot be asked that way: it is the editor's own code — handles, pointer maths, the
 * commit — so this one loads `/website/box-demo`, seeds a page, and moves the handles with a real mouse.
 *
 * The rules being held to, both stated by the user:
 *   • dragging a cell's TOP or BOTTOM edge changes that row's height, and only that edge moves;
 *   • the other rows take up, or give back, the remaining height EVENLY.
 */

/** A grid of `cells` painted cells, seeded straight into the builder's storage. */
async function seedGrid(page: Page, cells: number, rows: number, minHeight?: number) {
  await page.goto("/website/box-demo");
  await page.evaluate(({ cells, rows, minHeight }) => {
    const span = 12 / cells;
    const kids = Array.from({ length: cells * rows }, (_, i) => ({
      id: `c${i}`, type: "container", layout: "flex", direction: "column",
      padding: 0, gap: 0, width: "100%", colSpan: span,
      background: ["#c7d2fe", "#bbf7d0", "#fde68a", "#fca5a5"][i % 4],
      children: [{ id: `t${i}`, type: "text", text: `Cell ${i}`, width: "auto" }],
    }));
    const site = {
      pages: [{ id: "p1", name: "Home", path: "/", root: {
        id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
          { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [
            { id: "tgt", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "100%", minHeight, children: kids },
          ] },
        ],
      } }],
      homeId: "p1",
    };
    localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  }, { cells, rows, minHeight });
  await page.reload();
  await page.waitForSelector('[data-box-id="tgt"]', { timeout: 15000 });
  await page.waitForTimeout(250);
}

const heightOf = (page: Page, id: string) =>
  page.locator(`[data-box-id="${id}"]`).evaluate((el) => el.getBoundingClientRect().height);
const rectOf = (page: Page, id: string) =>
  page.locator(`[data-box-id="${id}"]`).evaluate((el) => { const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, height: r.height }; });

/**
 * Click a cell twice — the first click selects the grid, the second steps inside to the cell itself.
 *
 * A quarter across and three quarters down, deliberately. Once the GRID is selected its own handles sit on
 * its edges — centred on the top and bottom, half way down the left and right — so a click at a cell's corner
 * or mid-edge grabs a handle instead of the cell underneath. This point misses all eight of them.
 */
async function selectCell(page: Page, id: string) {
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  const x = b.x + b.width * 0.25, y = b.y + b.height * 0.75;
  await page.mouse.click(x, y);
  await page.waitForTimeout(150);
  await page.mouse.click(x, y);
  await page.waitForTimeout(150);
  await expect(page.locator(`[data-box-id="${id}"]`), "the cell itself must be selected before its handles mean anything")
    .toHaveClass(/outline-indigo-500/);
}

/** Drag a named resize handle by (dx, dy) with a real mouse, in steps so every move event fires. */
async function dragHandle(page: Page, label: string, dx: number, dy: number) {
  const h = (await page.locator(`[aria-label="${label}"]`).boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) await page.mouse.move(h.x + h.width / 2 + (dx * i) / 6, h.y + h.height / 2 + (dy * i) / 6);
  await page.mouse.up();
  await page.waitForTimeout(200);
}

test.describe("resizing a grid cell's height", () => {
  test("the BOTTOM edge makes the row taller, and the top edge stays put", async ({ page }) => {
    await seedGrid(page, 2, 2);
    await selectCell(page, "c0");
    const before = await rectOf(page, "c0");
    await dragHandle(page, "Resize bottom edge", 0, 140);
    const after = await rectOf(page, "c0");
    expect(after.height, "the row grew").toBeGreaterThan(before.height + 60);
    expect(Math.abs(after.top - before.top), "the grabbed edge is the ONLY one that moves").toBeLessThan(3);
  });

  test("the TOP edge grows THIS row upward, and its bottom stays put", async ({ page }) => {
    // The bug: grabbing a cell's top edge resized the row ABOVE it instead, so the cell being held never
    // changed size and the edge under the pointer did not move. Holding an edge must move that edge.
    // The grid is given real height so its two rows are ~200px each — the row above then HAS space to give
    // back, which is what lets this row's bottom edge stay exactly where it was.
    await seedGrid(page, 2, 2, 400);
    await selectCell(page, "c2"); // second row, so there IS a row above to take the space from
    const before = await rectOf(page, "c2");
    const aboveBefore = await heightOf(page, "c0");
    await dragHandle(page, "Resize top edge", 0, -120);
    const after = await rectOf(page, "c2");
    expect(after.height, "the cell being held grows").toBeGreaterThan(before.height + 50);
    expect(after.top, "…because its TOP edge moved up, which is the edge under the pointer").toBeLessThan(before.top - 50);
    expect(Math.abs(after.bottom - before.bottom), "its bottom edge does not move").toBeLessThan(4);
    expect(await heightOf(page, "c0"), "the row above gives back what this one took").toBeLessThan(aboveBefore - 50);
  });

  test("both cells in the row grow together, so the row stays a row", async ({ page }) => {
    await seedGrid(page, 2, 2);
    await selectCell(page, "c0");
    await dragHandle(page, "Resize bottom edge", 0, 140);
    const a = await heightOf(page, "c0"), b = await heightOf(page, "c1");
    expect(Math.abs(a - b), "a row is one row — its cells share a height").toBeLessThan(3);
  });

  test("the OTHER rows share what is left, evenly", async ({ page }) => {
    // Three rows: make the first tall, and the remaining two must divide the rest between them equally
    // rather than one of them absorbing all of it.
    await seedGrid(page, 2, 3);
    await selectCell(page, "c0");
    await dragHandle(page, "Resize bottom edge", 0, 160);
    const r1 = await heightOf(page, "c0");
    const r2 = await heightOf(page, "c2");
    const r3 = await heightOf(page, "c4");
    expect(r1, "the row that was dragged is the tall one").toBeGreaterThan(r2 + 40);
    expect(Math.abs(r2 - r3), "the rows that were NOT dragged share the rest evenly").toBeLessThan(4);
  });
});
