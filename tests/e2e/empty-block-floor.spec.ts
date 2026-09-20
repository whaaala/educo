import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * A BLOCK YOU JUST ADDED IS BIG ENOUGH TO SEE AND TO GRAB.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * The bug, as reported and then measured: adding blocks one at a time into a stack that had been given a
 * height produced 159 · 79 · 53 · 40 · 32 · 26px. At 26px a block cannot be identified, and its eight resize
 * handles — four edges, four corners, about 8px each — cover it completely, so there is nothing left to click
 * that is not a handle. The block is added, and the user cannot see it or do anything with it.
 *
 * WHY IT HID. The same six blocks added to an UNSIZED parent come out 128px each and the parent grows to hold
 * them, which is correct. Every test written for empty boxes used an unsized parent, and so did the editor's
 * own courtesy height, which `sizedAbove` deliberately switches off the moment an ancestor has a height. The
 * defect lives only in the state a user reaches by RESIZING something — the normal state.
 *
 * So these measure the sized parent, at the depth where it used to fail, and they measure the RENDERED size
 * rather than the stored one: the stored tree was never wrong.
 */

async function addInside(page: Page, parentId: string) {
  await page.evaluate((parentId) => {
    const el = document.querySelector(`[data-box-id="${parentId}"]`)!;
    const r = el.getBoundingClientRect();
    const dt = new DataTransfer();
    dt.setData("application/x-box-block", "container");
    const at = { clientX: r.left + r.width / 2, clientY: r.bottom - 4, bubbles: true, cancelable: true, dataTransfer: dt };
    el.dispatchEvent(new DragEvent("dragover", at));
    el.dispatchEvent(new DragEvent("drop", at));
  }, parentId);
  await page.waitForTimeout(320);
}

/** Every direct child of `parentId`, as rendered. */
async function childBoxes(page: Page, parentId: string) {
  const ids = await page.evaluate((parentId) => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const find = (n: Record<string, unknown>): Record<string, unknown> | null =>
      n.id === parentId ? n : ((n.children as Record<string, unknown>[]) ?? []).reduce<Record<string, unknown> | null>((a, c) => a ?? find(c), null);
    return ((find(site.pages[0].root)?.children as Record<string, unknown>[]) ?? []).map((c) => c.id as string);
  }, parentId);
  const out: { id: string; w: number; h: number }[] = [];
  for (const id of ids) {
    const b = await page.locator(`[data-box-id="${id}"]`).boundingBox();
    out.push({ id, w: b ? b.width : 0, h: b ? b.height : 0 });
  }
  return out;
}

/** The floor, in px at the test's root font size. Below this a block is all handle and no block. */
const FLOOR = 40;

async function seedStack(page: Page, extras: Record<string, unknown>) {
  await seedSite(page, sitePage([
    { id: "a", type: "container", direction: "column", padding: 24, gap: 0, width: "60%", background: "#c7d2fe", ...extras, children: [] },
  ]));
  await page.waitForSelector('[data-box-id="a"]', { timeout: 15000 });
  await page.waitForTimeout(350);
}

test.describe("a block added into a stack stays visible", () => {
  test("six blocks into a SIZED stack — none collapses below the floor", async ({ page }) => {
    // The reported case, at the depth where it used to reach 26px.
    await seedStack(page, { minHeight: 200 });
    for (let n = 1; n <= 6; n++) {
      await addInside(page, "a");
      const kids = await childBoxes(page, "a");
      expect(kids.length, `add #${n} actually added a block`).toBe(n);
      const smallest = Math.min(...kids.map((k) => k.h));
      expect(smallest, `after ${n} blocks the smallest is ${Math.round(smallest)}px — must stay grabbable`)
        .toBeGreaterThanOrEqual(FLOOR - 1);
    }
  });

  test("…and the parent grows to hold them rather than squeezing them", async ({ page }) => {
    // The other half. A floor that the parent ignores would just make the children overflow it.
    await seedStack(page, { minHeight: 200 });
    for (let n = 1; n <= 6; n++) await addInside(page, "a");
    const parent = (await page.locator('[data-box-id="a"]').boundingBox())!;
    const kids = await childBoxes(page, "a");
    const stacked = kids.reduce((s, k) => s + k.h, 0);
    expect(parent.height, "the parent is at least as tall as what is inside it").toBeGreaterThanOrEqual(stacked - 2);
    // It GREW past the 200px it was given, which is the half that discriminates: a parent that squeezes its
    // children instead also satisfies "at least as tall as its contents", by making the contents smaller.
    expect(parent.height, "six blocks at the floor do not fit in 200px, so the parent gave way").toBeGreaterThan(240);
    // …and it did not run away with it either: a small floor must not turn a 200px stack into 768px.
    expect(parent.height, "but it has not been blown open by the floor").toBeLessThan(600);
  });

  test("a size the user SET still wins, however small", async ({ page }) => {
    // The floor may never override a decision. This is the direction that keeps the fix honest: a flat
    // minimum applied everywhere would make a deliberately thin block impossible to keep.
    //
    // Measured where growth cannot mask it. A LONE child fills its parent whatever its minimum is — flex
    // grow, not the floor — so a single 8px box renders at the parent's height either way and proves
    // nothing. Six of them have to share, and there the floor would show up as a hard 40px each.
    await seedSite(page, sitePage([
      { id: "a", type: "container", direction: "column", padding: 24, gap: 0, width: "60%", minHeight: 200, background: "#c7d2fe",
        children: Array.from({ length: 6 }, (_, i) => ({
          id: `k${i}`, type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 8, background: "#a5b4fc", children: [],
        })) },
    ]));
    await page.waitForSelector('[data-box-id="k5"]', { timeout: 15000 });
    await page.waitForTimeout(350);
    const kids = await childBoxes(page, "a");
    expect(kids.length).toBe(6);
    const tallest = Math.max(...kids.map((k) => k.h));
    expect(tallest, "six blocks the user set to 8px share the parent — they are NOT raised to the 40px floor")
      .toBeLessThan(FLOOR);
  });

  test("an UNSIZED parent still grows, exactly as before", async ({ page }) => {
    // The behaviour that was always correct, held in place so the fix cannot regress it.
    await seedStack(page, {});
    for (let n = 1; n <= 3; n++) await addInside(page, "a");
    const kids = await childBoxes(page, "a");
    expect(kids.length).toBe(3);
    for (const k of kids) expect(k.h, "the 8rem courtesy height is untouched").toBeGreaterThan(100);
  });

  test("nothing is left invisible — a block with NO stored width still has one", async ({ page }) => {
    // The width half, exercised where it actually bites. A block dropped from the palette stores
    // `width: "fill"`, which fills its parent and can never be 0 wide — so measuring those proves nothing,
    // as a mutation run showed. A block with NO width at all HUGS its content, and an empty box's content
    // is nothing, so in a row it collapses to a hairline unless the floor holds it open.
    await seedSite(page, sitePage([
      { id: "a", type: "container", direction: "row", padding: 24, gap: 0, width: "100%", minHeight: 200, background: "#c7d2fe",
        children: Array.from({ length: 3 }, (_, i) => ({
          id: `k${i}`, type: "container", direction: "column", padding: 0, gap: 0, background: "#a5b4fc", children: [],
        })) },
    ]));
    await page.waitForSelector('[data-box-id="k2"]', { timeout: 15000 });
    await page.waitForTimeout(350);
    const kids = await childBoxes(page, "a");
    expect(kids.length).toBe(3);
    for (const k of kids) {
      expect(k.w, "a block with no width is as unusable as one with no height").toBeGreaterThanOrEqual(FLOOR - 1);
    }
  });
});
