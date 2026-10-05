import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * A BLOCK DROPPED INTO A BOX WITH ROOM IN IT TAKES THE ROOM.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Drop a Stack into a section 400px tall and it landed **40px** tall — the minimum-height floor — with 360px
 * of the section left empty underneath it and nothing in the styles to say why. Reported as "it basically
 * collapsed to the most minimum height possible, so it doesn't take up the whole space".
 *
 * TWO CAUSES, one per container engine, which is why both are driven here:
 *
 *   · A row band WRAPS, and on a wrapping flex container the cross-axis space is handed out by
 *     `align-content`, not `align-items`. With `align-content: flex-start` the single line hugs its
 *     content, and `align-items: stretch` then stretches the child to fill a line already as short as the
 *     child. Each rule right on its own; together, a collapse.
 *   · A GRID CELL stores no height of its own — the row hands it one (`minmax(min-content, 1fr)`). So every
 *     cell read as "unsized", and anything dropped into one hugged its content instead of filling it.
 *
 * The floor is not the bug and is not being removed: a box nobody has sized, in a box nobody has sized, is
 * still floored so it can be seen and grabbed. The rule is narrower than that — where there IS room, take
 * it. Both directions are asserted, because a fix that fills everything would break the floor's own tests.
 */

const sizedSection = () => sitePage([
  { id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 400, background: "#eef2ff", children: [] },
]);

const cell = (i: number) => ({ id: `c${i}`, type: "container" as const, layout: "flex" as const, direction: "column" as const, colSpan: 6, padding: 0, gap: 0, children: [] });
const sizedGrid = (minHeight?: number) => sitePage([
  { id: "g", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "100%", ...(minHeight ? { minHeight } : {}), children: [cell(1), cell(2), cell(3), cell(4)] },
]);

/** The HTML5 drag the palette performs, end to end with one DataTransfer. */
async function dropKindOn(page: Page, kind: string, targetId: string) {
  await page.evaluate(({ kind, targetId }) => {
    const dt = new DataTransfer();
    dt.setData("application/x-box-block", kind);
    const el = document.querySelector(`[data-box-id="${targetId}"]`)!;
    const r = el.getBoundingClientRect();
    const at = { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, bubbles: true, cancelable: true, dataTransfer: dt };
    el.dispatchEvent(new DragEvent("dragover", at));
    el.dispatchEvent(new DragEvent("drop", at));
  }, { kind, targetId });
  await page.waitForTimeout(450);
}

/** Every block inside `id`, deepest last — the dropped block is the innermost one. */
const inside = (page: Page, id: string) => page.evaluate((id) => {
  const host = document.querySelector(`[data-box-id="${id}"]`)!;
  return Array.from(host.querySelectorAll("[data-box-id]")).map((n) => ({
    id: n.getAttribute("data-box-id")!, h: Math.round(n.getBoundingClientRect().height),
  }));
}, id);

const heightOf = async (page: Page, id: string) =>
  Math.round((await page.locator(`[data-box-id="${id}"]`).boundingBox())!.height);

test.describe("a dropped block fills the space it lands in", () => {
  test("dropped into a section 400px tall, it is 400px tall — not 40", async ({ page }) => {
    await seedSite(page, sizedSection());
    await page.waitForSelector('[data-box-id="sec"]', { timeout: 15000 });
    await page.waitForTimeout(300);
    expect(await heightOf(page, "sec"), "the section starts at the height it was given").toBe(400);

    await dropKindOn(page, "container", "sec");

    const kids = await inside(page, "sec");
    expect(kids.length, "a band, and the block inside it").toBeGreaterThanOrEqual(2);
    for (const k of kids) {
      expect(k.h, `${k.id} came out ${k.h}px inside a 400px section`).toBe(400);
    }
    expect(await heightOf(page, "sec"), "and the section is no taller than it was").toBe(400);
  });

  test("dropped into a grid cell, it fills the cell the row gave it", async ({ page }) => {
    // Two across, two down, in a 400px grid: every cell is handed 200px it never stored.
    await seedSite(page, sizedGrid(400));
    await page.waitForSelector('[data-box-id="c1"]', { timeout: 15000 });
    await page.waitForTimeout(300);
    const cellH = await heightOf(page, "c1");
    expect(cellH, "the row hands the cell its height").toBe(200);

    await dropKindOn(page, "container", "c1");

    for (const k of await inside(page, "c1")) {
      expect(k.h, `${k.id} came out ${k.h}px inside a ${cellH}px cell`).toBe(cellH);
    }
    expect(await heightOf(page, "c1"), "and the cell did not grow to accommodate it").toBe(cellH);
    expect(await heightOf(page, "c2"), "nor did its neighbour move").toBe(cellH);
  });

  test("…but in a grid NOBODY has sized, the floor still holds the cells open", async ({ page }) => {
    /**
     * The other direction, and the one a careless fix breaks. A grid with no height of its own has nothing
     * to share out, so its cells really are unsized — and there the floor is the whole point: without it an
     * empty cell is 0px and there is nothing to click, drag or drop onto.
     */
    await seedSite(page, sizedGrid());
    await page.waitForSelector('[data-box-id="c1"]', { timeout: 15000 });
    await page.waitForTimeout(300);

    await dropKindOn(page, "container", "c1");

    const kids = await inside(page, "c1");
    const deepest = kids[kids.length - 1];
    const cellH = await heightOf(page, "c1");
    const trail = `cell ${cellH}px holds ${kids.map((k) => `${k.id}=${k.h}`).join(", ")}`;

    // The 8rem COURTESY height an empty box gets where there is no space to take (see `stackWithBlock`) —
    // not the 2.5rem sliver floor, and not a share of a height the grid was never given.
    expect(deepest.h, `dropped into a grid with no height, a block takes its 8rem courtesy — ${trail}`).toBe(128);
    expect(deepest.h, `and never more than the cell holding it — ${trail}`).toBeLessThanOrEqual(cellH);
  });

  test("a block you have sized keeps the size you gave it", async ({ page }) => {
    // A decision always beats a courtesy — filling is only ever the answer where nobody has said otherwise.
    await seedSite(page, sitePage([
      { id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 400, background: "#eef2ff", children: [
        { id: "mine", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", height: "90px", background: "#fca5a5", children: [] },
      ] },
    ]));
    await page.waitForSelector('[data-box-id="mine"]', { timeout: 15000 });
    await page.waitForTimeout(300);
    expect(await heightOf(page, "mine"), "90px means 90px, in a 400px section").toBe(90);
  });
});
