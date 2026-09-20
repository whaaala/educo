import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * PUTTING A BLOCK UNDER ONE COLUMN OF A SIDE-BY-SIDE BAND.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * "One tall block on the left, two stacked beside it on the right" is an ordinary page, and the model has
 * always been able to hold it — a row band whose second child is a column of two. What there was no way to
 * DO was reach it. A band is a row; a row only knows side-by-side; so a block aimed at the empty space under
 * the shorter of two columns was read as "another column" and wedged in beside, giving three columns and not
 * the shape anyone meant.
 *
 * The model reached further than the controls, which is this project's own stated diagnosis — and the lever
 * for it is always more CONTROLS, never more model. So the column is created on demand: the block you aimed
 * under is lifted into a new Stack together with the newcomer, and the Stack takes its slot. The neighbour is
 * not touched, which is the property that makes doing it automatically safe.
 */

/** A tall block on the left, a short one on the right — leaving real empty space under the short one. */
async function seedUneven(page: Page) {
  await seedSite(page, sitePage([
    { id: "L", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 400, background: "#c7d2fe", children: [] },
    // `alignSelf` is what a height-resize writes: it un-stretches the block so its own floor governs. Without
    // it a row band stretches every column to the tallest, and there is no empty space under the short one to
    // aim at — which is the state the user reaches by dragging R shorter.
    { id: "R", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 140, alignSelf: "flex-start", background: "#a5b4fc", children: [] },
  ]));
  await page.waitForSelector('[data-box-id="R"]', { timeout: 15000 });
  await page.waitForTimeout(350);
}

async function dragOver(page: Page, x: number, y: number) {
  await page.evaluate(({ x, y }) => {
    const dt = new DataTransfer();
    dt.setData("application/x-box-block", "container");
    (window as unknown as { __dt: DataTransfer }).__dt = dt;
    const el = document.elementFromPoint(x, y)!;
    el.dispatchEvent(new DragEvent("dragover", { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt }));
  }, { x, y });
  await page.waitForTimeout(150);
}

async function drop(page: Page, x: number, y: number) {
  await page.evaluate(({ x, y }) => {
    const dt = (window as unknown as { __dt: DataTransfer }).__dt;
    const el = document.elementFromPoint(x, y)!;
    el.dispatchEvent(new DragEvent("drop", { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt }));
  }, { x, y });
  await page.waitForTimeout(450);
}

/** The band's shape, as ids nested the way the tree nests them. */
const bandShape = (page: Page) =>
  page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const find = (n: Record<string, unknown>): Record<string, unknown> | null =>
      n.id === "band" ? n : ((n.children as Record<string, unknown>[]) ?? []).reduce<Record<string, unknown> | null>((a, c) => a ?? find(c), null);
    const shape = (n: Record<string, unknown>): unknown => {
      const kids = (n.children as Record<string, unknown>[]) ?? [];
      return kids.length ? { id: n.id, kids: kids.map(shape) } : n.id;
    };
    const band = find(site.pages[0].root);
    return ((band?.children as Record<string, unknown>[]) ?? []).map(shape);
  });

const indicator = (page: Page) => page.locator("div.rounded-full.bg-indigo-500");

/** The indicator geometry, or null — WITHOUT auto-waiting for one that may legitimately not exist. */
async function indicatorBox(page: Page) {
  if (await indicator(page).count() === 0) return null;
  return indicator(page).first().boundingBox();
}

test.describe("a block dropped under one column", () => {
  test("the indicator is as wide as THAT column, not the whole band", async ({ page }) => {
    // The two horizontal readings have to be told apart before the mouse is released, and width is what
    // tells them apart: a band-wide line means a new band below, a column-wide line means under this column.
    await seedUneven(page);
    const r = (await page.locator('[data-box-id="R"]').boundingBox())!;
    const band = (await page.locator('[data-box-id="band"]').boundingBox())!;

    await dragOver(page, r.x + r.width / 2, r.y + r.height + 60);
    const ind = (await indicatorBox(page))!;
    expect(ind, "a line is drawn").not.toBeNull();
    expect(ind.width, "it is a horizontal line").toBeGreaterThan(ind.height);
    expect(Math.abs(ind.width - r.width), "…exactly as wide as the column it is under").toBeLessThan(8);
    expect(ind.width, "…and clearly narrower than the band").toBeLessThan(band.width - 40);
  });

  test("the right column becomes a Stack holding both, and the left is untouched", async ({ page }) => {
    await seedUneven(page);
    const r = (await page.locator('[data-box-id="R"]').boundingBox())!;
    const l0 = (await page.locator('[data-box-id="L"]').boundingBox())!;

    await dragOver(page, r.x + r.width / 2, r.y + r.height + 60);
    await drop(page, r.x + r.width / 2, r.y + r.height + 60);

    const shape = await bandShape(page);
    expect(shape.length, "the band still has TWO columns, not three").toBe(2);
    expect(shape[0], "the left column is exactly as it was").toBe("L");
    const right = shape[1] as { id: string; kids: unknown[] };
    expect(typeof right, "the right column is now a container").toBe("object");
    expect(right.kids.length, "holding two blocks").toBe(2);
    // Each child of a content container is wrapped in a band of its own by `normalizeRowBands`, so the
    // original sits one level down rather than directly in the column. Asserting the flatter shape was my
    // mistake, not the builder's — the tree is right, the expectation was a level short.
    const firstKid = right.kids[0] as { kids: unknown[] } | string;
    const firstId = typeof firstKid === "string" ? firstKid : (firstKid.kids[0] as string);
    expect(firstId, "the original on top").toBe("R");

    const l1 = (await page.locator('[data-box-id="L"]').boundingBox())!;
    expect(Math.abs(l1.x - l0.x) + Math.abs(l1.width - l0.width), "the neighbour did not move or resize").toBeLessThan(3);
  });

  test("the new block sits BELOW the original, sharing its column", async ({ page }) => {
    await seedUneven(page);
    const r0 = (await page.locator('[data-box-id="R"]').boundingBox())!;
    await dragOver(page, r0.x + r0.width / 2, r0.y + r0.height + 60);
    await drop(page, r0.x + r0.width / 2, r0.y + r0.height + 60);

    const shape = await bandShape(page);
    const right = shape[1] as { kids: unknown[] };
    const secondKid = right.kids[1] as { kids: unknown[] } | string;
    const newId = typeof secondKid === "string" ? secondKid : (secondKid.kids[0] as string);
    const r1 = (await page.locator('[data-box-id="R"]').boundingBox())!;
    const nb = (await page.locator(`[data-box-id="${newId}"]`).boundingBox())!;
    expect(nb.y, "below the original").toBeGreaterThanOrEqual(r1.y + r1.height - 2);
    expect(Math.abs(nb.x - r1.x), "…in the same column").toBeLessThan(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
      "and nothing spills sideways").toBe(true);
  });

  test("dropping BESIDE a column still adds a column — the readings stay distinct", async ({ page }) => {
    // The direction that keeps the test above honest: if everything near a column became a stack-under,
    // side-by-side would be unreachable. Aimed level with both blocks, past the right-hand edge.
    await seedUneven(page);
    const r = (await page.locator('[data-box-id="R"]').boundingBox())!;
    const band = (await page.locator('[data-box-id="band"]').boundingBox())!;
    const x = Math.min(r.x + r.width + 20, band.x + band.width - 4);

    await dragOver(page, x, r.y + r.height / 2);
    await drop(page, x, r.y + r.height / 2);

    const shape = await bandShape(page);
    expect(shape.length, "a third column, as asked for").toBe(3);
    expect(shape.every((s) => typeof s === "string"), "and none of them was wrapped in a Stack").toBe(true);
  });
});
