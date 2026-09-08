import { test, expect, type Page } from "@playwright/test";

/**
 * DRAGGING a Columns block onto the page — the other half of adding one.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * The palette offers two routes and they run through different code: clicking opens the picker and inserts a
 * grid WITH cells, while dragging inserts whatever `blockForKind` returns on its own. Only the click route had
 * a test, and this is the one a user reached for.
 */

async function seedSection(page: Page) {
  await page.goto("/website/box-demo");
  await page.evaluate(() => {
    const site = {
      pages: [{ id: "p1", name: "Home", path: "/", root: {
        id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
          { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [
            { id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 400, background: "#eef2ff", children: [] },
          ] },
        ],
      } }],
      homeId: "p1",
    };
    localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  });
  await page.reload();
  await page.waitForSelector('[data-box-id="sec"]', { timeout: 15000 });
  await page.waitForTimeout(300);
}

/** The HTML5 drag the palette actually performs, driven end to end with a shared DataTransfer. */
async function dragKindOnto(page: Page, kind: string, targetId: string) {
  const b = (await page.locator(`[data-box-id="${targetId}"]`).boundingBox())!;
  await page.evaluate(({ kind, targetId }) => {
    const dt = new DataTransfer();
    dt.setData("application/x-box-block", kind);
    const el = document.querySelector(`[data-box-id="${targetId}"]`)!;
    const r = el.getBoundingClientRect();
    const at = { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, bubbles: true, cancelable: true, dataTransfer: dt };
    el.dispatchEvent(new DragEvent("dragover", at));
    el.dispatchEvent(new DragEvent("drop", at));
  }, { kind, targetId });
  await page.waitForTimeout(400);
  return b;
}

/** The grid that was dropped, read from the stored tree. */
const droppedGrid = (page: Page) =>
  page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    let found: Record<string, unknown> | null = null;
    const walk = (n: Record<string, unknown>) => {
      if (!found && n.layout === "grid") found = n;
      ((n.children as Record<string, unknown>[]) ?? []).forEach(walk);
    };
    walk(site.pages[0].root);
    const g = found as Record<string, unknown> | null;
    return g && { id: g.id as string, columns: g.columns as number, cells: ((g.children as unknown[]) ?? []).length };
  });

test.describe("dragging a Columns block onto a section", () => {
  test("selecting a block near the canvas top raises no console error", async ({ page }) => {
    // HONEST SCOPE: this is a smoke check, NOT a guard for the "Maximum update depth exceeded" crash that was
    // reported here. It passes with and without the fix for that crash, which was confirmed by reverting the
    // fix and watching this still pass — so it must not be read as proof the loop cannot come back.
    //
    // What it does catch is any console error raised while selecting a block in the region where the toolbar
    // decides whether to flip above or below, which is where that crash surfaced.
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

    await seedSection(page);
    await dragKindOnto(page, "grid", "sec");
    const g = (await droppedGrid(page))!;
    const b = (await page.locator(`[data-box-id="${g.id}"]`).boundingBox())!;
    // Select it, then keep clicking around near the top edge — the region where the flip is decided.
    for (let i = 0; i < 5; i++) {
      await page.mouse.click(b.x + b.width / 2, b.y + 12 + i);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(500);
    expect(errors.filter((e) => /Maximum update depth/i.test(e)), "no render loop").toEqual([]);
    expect(errors, "no console errors at all").toEqual([]);
  });

  test("it arrives as a real layout, not an empty shell", async ({ page }) => {
    // The bug: dragging inserted `createGrid(3)` with NO children — three columns and nothing in them. There
    // was no cell to click, nothing to resize, and the whole thing read as one empty box. Clicking the tile
    // and picking a shape gave you cells; dragging the same tile did not.
    await seedSection(page);
    await dragKindOnto(page, "grid", "sec");
    const g = await droppedGrid(page);
    expect(g, "a grid was inserted").toBeTruthy();
    expect(g!.cells, "it must arrive with cells you can actually put something in").toBeGreaterThan(0);
  });

  test("the dropped grid is selectable and has resize handles on every edge", async ({ page }) => {
    await seedSection(page);
    await dragKindOnto(page, "grid", "sec");
    const g = (await droppedGrid(page))!;
    const b = (await page.locator(`[data-box-id="${g.id}"]`).boundingBox())!;
    // Click until the grid itself is the selection (the first click takes the outermost block).
    for (let i = 0; i < 4; i++) {
      const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
      if (sel === g.id) break;
      await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
      await page.waitForTimeout(150);
    }
    expect(await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null)).toBe(g.id);
    for (const edge of ["top", "bottom", "left", "right"]) {
      expect(await page.locator(`[aria-label="Resize ${edge} edge"]`).count(), `${edge} handle`).toBeGreaterThan(0);
    }
  });

  test("it follows the height of the section it was dropped into", async ({ page }) => {
    await seedSection(page);
    await dragKindOnto(page, "grid", "sec");
    const g = (await droppedGrid(page))!;
    const sec = (await page.locator('[data-box-id="sec"]').boundingBox())!;
    const grid = (await page.locator(`[data-box-id="${g.id}"]`).boundingBox())!;
    expect(sec.height, "the section has real height to give").toBeGreaterThan(350);
    expect(Math.abs(grid.height - sec.height), "the grid takes the height it was given").toBeLessThan(4);
  });
});
