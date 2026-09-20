import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * A PALETTE CLICK ADDS AFTER WHAT YOU HAVE SELECTED — never inside it.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * The palette used to insert INTO the selected container, so that "select a grid cell, add a Grid inside it"
 * worked. The rule was real; what it never accounted for is that an EMPTY container is the commonest thing
 * to have selected, and a new block inside an empty one is PIXEL-IDENTICAL to it — same width, same height,
 * same position, stacked exactly on top.
 *
 * Measured before the change: with a stack selected, the added block rendered 432×150 at y=88, which is
 * precisely the stack's own box. Nothing on screen moved, so the click read as having done nothing — and a
 * second click put a SECOND block inside, at which point the parent finally grew and it looked like the
 * second click was the one that worked. Two nested blocks where one was wanted, with no way to tell.
 *
 * So these assert the property the user can actually SEE: one click, one block, somewhere new.
 */

const pair = () => sitePage([
  { id: "A", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 150, background: "#c7d2fe", children: [] },
  { id: "B", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 150, background: "#a5b4fc", children: [] },
]);

/** Every node id in the stored tree, with the id of its parent. */
const treeIds = (page: Page) =>
  page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const out: { id: string; parent: string }[] = [];
    const walk = (n: Record<string, unknown>, up: string) => {
      out.push({ id: n.id as string, parent: up });
      ((n.children as Record<string, unknown>[]) ?? []).forEach((c) => walk(c, n.id as string));
    };
    walk(site.pages[0].root, "");
    return out;
  });

async function openPaletteAndAddStack(page: Page) {
  const before = await treeIds(page);
  const tile = page.getByRole("button", { name: /^Add Stack$/ });
  // Only open it if it is not already open — the opener TOGGLES, so clicking it again on a second add
  // closes the panel and the tile is never found. Checking first keeps the helper usable twice in a row,
  // which is exactly the sequence the last test needs.
  if (await tile.count() === 0) {
    await page.locator('button[aria-label*="block" i], button[title*="block" i]').first().click();
    await page.waitForTimeout(350);
  }
  await tile.first().click();
  await page.waitForTimeout(600);
  const after = await treeIds(page);
  const known = new Set(before.map((n) => n.id));
  return { added: after.filter((n) => !known.has(n.id)), before, after };
}

async function seedAndSelect(page: Page, id: string) {
  await seedSite(page, pair());
  await page.waitForSelector('[data-box-id="B"]', { timeout: 15000 });
  await page.waitForTimeout(400);
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null),
    "the block really is selected before the click").toBe(id);
}

test.describe("clicking a block in the palette", () => {
  test("adds it AFTER the selected block, not inside it", async ({ page }) => {
    await seedAndSelect(page, "B");
    const { added } = await openPaletteAndAddStack(page);
    const ids = added.map((n) => n.id);
    expect(added.length, "one click added something").toBeGreaterThan(0);
    expect(ids, "…and none of it went inside the selected block").not.toContain("B");
    for (const n of added) {
      expect(n.parent, `nothing landed inside B (${n.id} → ${n.parent})`).not.toBe("B");
    }
  });

  test("ONE click produces ONE visible block, somewhere new", async ({ page }) => {
    // The property the user can see. Landing inside an empty container satisfies "a block was added" while
    // changing nothing on screen, which is what made the click look broken.
    await seedAndSelect(page, "B");
    const bBefore = (await page.locator('[data-box-id="B"]').boundingBox())!;
    const { added } = await openPaletteAndAddStack(page);

    const leaf = added[added.length - 1];
    const box = (await page.locator(`[data-box-id="${leaf.id}"]`).boundingBox())!;
    expect(box, "the new block is on the page").not.toBeNull();
    // Somewhere new: it does not sit exactly on top of the block that was selected.
    const identical = Math.abs(box.x - bBefore.x) < 2 && Math.abs(box.y - bBefore.y) < 2
      && Math.abs(box.width - bBefore.width) < 2 && Math.abs(box.height - bBefore.height) < 2;
    expect(identical, "it is not pixel-identical to the block that was selected").toBe(false);
  });

  test("it lands on a line of its own, below — not beside the selection", async ({ page }) => {
    // Going up past the BAND is what makes "after" mean what it looks like: a band lays its children out
    // side by side, so inserting after B inside one would put the newcomer beside it instead.
    await seedAndSelect(page, "B");
    const { added } = await openPaletteAndAddStack(page);
    const leaf = added[added.length - 1];
    const box = (await page.locator(`[data-box-id="${leaf.id}"]`).boundingBox())!;
    const b = (await page.locator('[data-box-id="B"]').boundingBox())!;
    expect(box.y, "below the row it was added from").toBeGreaterThanOrEqual(b.y + b.height - 4);
  });

  test("clicking twice gives TWO siblings, never two nested", async ({ page }) => {
    // The exact shape of the original complaint: two clicks used to produce two blocks nested inside the
    // selection, one invisible behind the other.
    await seedAndSelect(page, "B");
    const first = await openPaletteAndAddStack(page);
    const second = await openPaletteAndAddStack(page);
    const a = first.added[first.added.length - 1];
    const c = second.added[second.added.length - 1];
    const boxA = (await page.locator(`[data-box-id="${a.id}"]`).boundingBox())!;
    const boxC = (await page.locator(`[data-box-id="${c.id}"]`).boundingBox())!;
    expect(Math.abs(boxA.y - boxC.y), "the two are on different lines").toBeGreaterThan(10);
    const parents = new Set(second.after.map((n) => `${n.id}->${n.parent}`));
    expect(parents.has(`${c.id}->${a.id}`), "the second is not inside the first").toBe(false);
  });

  test("but a GRID CELL still receives the block inside it", async ({ page }) => {
    /**
     * THE ONE EXCEPTION, and it is the same test applied honestly rather than a carve-out.
     *
     * "Inside" is confusing exactly when the container has no shape of its own — an empty Stack's child
     * lands on the identical pixels, which is what made the click look broken. A grid CELL is the opposite:
     * a bounded slot, drawn at a fixed place, that exists in order to hold something. A block arriving in
     * one is visible immediately.
     *
     * It also keeps an EARLIER report fixed instead of trading one for another — "I can no longer add
     * grid/grids within an already added grid" is the reason inserting into the selection exists at all.
     * Without this test, fixing the newer report would quietly reopen the older one.
     */
    await seedSite(page, sitePage([
      { id: "g", type: "container", layout: "grid", columns: 12, padding: 0, gap: 0, width: "100%", minHeight: 200, children: [
        { id: "c1", type: "container", direction: "column", colSpan: 6, padding: 0, gap: 0, background: "#c7d2fe", children: [] },
        { id: "c2", type: "container", direction: "column", colSpan: 6, padding: 0, gap: 0, background: "#a5b4fc", children: [] },
      ] },
    ]));
    await page.waitForSelector('[data-box-id="c1"]', { timeout: 15000 });
    await page.waitForTimeout(400);
    // Click until the CELL itself is the selection — the first click takes the outermost block.
    const cell = (await page.locator('[data-box-id="c1"]').boundingBox())!;
    for (let i = 0; i < 4; i++) {
      if (await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null) === "c1") break;
      await page.mouse.click(cell.x + cell.width / 2, cell.y + cell.height / 2);
      await page.waitForTimeout(200);
    }
    expect(await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null),
      "the cell is selected").toBe("c1");

    const { added } = await openPaletteAndAddStack(page);
    expect(added.length, "a block was added").toBeGreaterThan(0);
    const parents = new Set(added.map((n) => n.parent));
    expect(parents.has("c1"), "…and it went INSIDE the cell, where it is plainly visible").toBe(true);
  });

  test("with NOTHING selected it still lands on the page", async ({ page }) => {
    await seedSite(page, pair());
    await page.waitForSelector('[data-box-id="B"]', { timeout: 15000 });
    await page.waitForTimeout(400);
    const { added } = await openPaletteAndAddStack(page);
    expect(added.length, "a block was added").toBeGreaterThan(0);
    const leaf = added[added.length - 1];
    expect(await page.locator(`[data-box-id="${leaf.id}"]`).boundingBox(), "and it is visible").not.toBeNull();
  });
});
