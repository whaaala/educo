import { test, expect, type Page } from "@playwright/test";

/**
 * ADDING A GRID INSIDE A GRID, through the palette, in the real builder.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * Reported as a regression: "I can no longer add grid/grids within an already added grid." Nesting is the
 * whole point of the layout system, so this drives the actual route a person takes — select a box, open the
 * Columns tile, pick a shape — rather than calling the model directly, which would pass whatever the UI did.
 */

async function seedGrid(page: Page) {
  await page.goto("/website/box-demo");
  await page.evaluate(() => {
    const cell = (id: string) => ({
      id, type: "container", layout: "flex", direction: "column", padding: 0, gap: 0,
      width: "100%", colSpan: 6, background: "#e0e7ff", children: [],
    });
    const site = {
      pages: [{ id: "p1", name: "Home", path: "/", root: {
        id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
          { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [
            { id: "tgt", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "100%", minHeight: 300, children: [cell("a"), cell("b")] },
          ] },
        ],
      } }],
      homeId: "p1",
    };
    localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  });
  await page.reload();
  await page.waitForSelector('[data-box-id="tgt"]', { timeout: 15000 });
  await page.waitForTimeout(250);
}

/** How many grids exist inside a given box, in the STORED tree (not just what is painted). */
const gridsInside = (page: Page, id: string) =>
  page.evaluate((boxId) => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const find = (n: Record<string, unknown>): Record<string, unknown> | null =>
      n.id === boxId ? n : ((n.children as Record<string, unknown>[]) ?? []).reduce<Record<string, unknown> | null>((a, c) => a || find(c), null);
    const target = find(site.pages[0].root);
    if (!target) return -1;
    let n = 0;
    const walk = (x: Record<string, unknown>) => { if (x.layout === "grid") n++; ((x.children as Record<string, unknown>[]) ?? []).forEach(walk); };
    ((target.children as Record<string, unknown>[]) ?? []).forEach(walk);
    return n;
  }, id);

/** Click a box until it is the selected one (click selects the outermost, then steps inside). */
async function selectBox(page: Page, id: string) {
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  // Dead centre. A corner or an edge lands on a resize handle of whatever is already selected, and on a small
  // nested cell an offset point can fall in the sibling next door.
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  for (let i = 0; i < 4; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return;
    await page.mouse.click(x, y);
    await page.waitForTimeout(150);
  }
  expect(await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null)).toBe(id);
}

/** Open the blocks panel, click the Columns tile, and choose "2 across × 1 down" from the picker. */
async function addColumnsBlock(page: Page) {
  const opener = page.locator('[aria-label="Open blocks panel"]');
  if (await opener.count()) await opener.click();
  await page.waitForTimeout(400); // the panel slides in — clicking mid-animation lands on a moving target
  await page.locator('[aria-label^="Add Columns"]').first().click();
  await page.waitForSelector('[role="menu"]', { timeout: 5000 });
  await page.locator('[role="gridcell"][aria-label="2 across, 1 down"]').click();
  await page.waitForTimeout(300);
}

test.describe("adding a grid inside a grid", () => {
  test("a Columns block lands INSIDE the selected grid cell", async ({ page }) => {
    await seedGrid(page);
    await selectBox(page, "a");
    expect(await gridsInside(page, "a"), "the cell starts with no grid in it").toBe(0);
    await addColumnsBlock(page);
    expect(await gridsInside(page, "a"), "the new grid must land in the cell that was selected").toBe(1);
  });

  test("a Columns block lands inside the selected GRID itself, as a new cell", async ({ page }) => {
    await seedGrid(page);
    await selectBox(page, "tgt");
    const before = await gridsInside(page, "tgt");
    await addColumnsBlock(page);
    expect(await gridsInside(page, "tgt"), "the grid gains a nested grid").toBe(before + 1);
  });

  test("and it can be nested again — a grid inside a grid inside a grid", async ({ page }) => {
    await seedGrid(page);
    await selectBox(page, "a");
    await addColumnsBlock(page);
    expect(await gridsInside(page, "a"), "one level in").toBe(1);

    // Now go one level deeper. Rather than name a cell — the ids are generated, and clicking a small nested
    // cell by coordinate is fragile — click into the middle of the nested grid until the selection has
    // stepped down to something INSIDE it, then add there. The claim under test is that nesting keeps
    // working at depth, not which particular cell receives it.
    const innerGridId = await page.evaluate(() => {
      const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
      const find = (n: Record<string, unknown>): Record<string, unknown> | null =>
        n.id === "a" ? n : ((n.children as Record<string, unknown>[]) ?? []).reduce<Record<string, unknown> | null>((acc, c) => acc || find(c), null);
      let found: string | null = null;
      const walk = (x: Record<string, unknown>) => { if (!found && x.layout === "grid") found = x.id as string; ((x.children as Record<string, unknown>[]) ?? []).forEach(walk); };
      ((find(site.pages[0].root)!.children as Record<string, unknown>[]) ?? []).forEach(walk);
      return found;
    });
    expect(innerGridId, "the nested grid exists").toBeTruthy();

    const g = (await page.locator(`[data-box-id="${innerGridId}"]`).boundingBox())!;
    for (let i = 0; i < 5; i++) {
      const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
      if (sel && sel !== "a" && sel !== "tgt" && sel !== innerGridId) break; // we are inside the nested grid
      await page.mouse.click(g.x + g.width / 2, g.y + g.height / 2);
      await page.waitForTimeout(150);
    }
    await addColumnsBlock(page);
    expect(await gridsInside(page, "a"), "three levels deep — two nested grids now live inside the cell").toBe(2);
  });
});
