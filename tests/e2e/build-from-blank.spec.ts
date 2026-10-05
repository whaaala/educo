import { test, expect, type Page } from "@playwright/test";
import { clearSite } from "./helpers/seed-site";

/**
 * BUILDING A PAGE THE WAY A PERSON ACTUALLY DOES — from a blank page, by dragging.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Every other layout spec SEEDS its tree: it writes the blocks, their widths and their alignment straight
 * into storage and then measures. That is precise, fast, and it misses a whole class of defect, because the
 * state it creates is not the state a user arrives at. A seeded pair of columns already has explicit widths;
 * a pair a person built has whatever the ADD path gave them.
 *
 * It cost exactly that. Adding a second block beside a full-width one — the first thing anyone does — broke
 * twice over, and the suite stayed green through both:
 *
 *   • a full-width block has no gap beside it, so the drop read as "stacked", and once a stacked reading in
 *     a band meant "a new band below" the second column became unreachable. Every seeded fixture had two
 *     narrower blocks with a gap between them, so none of them could see it.
 *   • then both blocks were 100% wide and nothing shared the line out, so they sat on two lines. The scaling
 *     that used to do it had been turned off to let a deliberate widen wrap — correct for a drag, wrong for
 *     an add. Seeded fixtures carry explicit widths that already fit, so again: invisible.
 *
 * So this one starts from nothing and uses only the gestures.
 */

async function dropAt(page: Page, x: number, y: number) {
  await page.evaluate(({ x, y }) => {
    const dt = new DataTransfer();
    dt.setData("application/x-box-block", "container");
    const el = document.elementFromPoint(x, y)!;
    const at = { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt };
    el.dispatchEvent(new DragEvent("dragover", at));
    el.dispatchEvent(new DragEvent("drop", at));
  }, { x, y });
  await page.waitForTimeout(450);
}

/** Every non-band block in the tree, with its stored width. */
const blocks = (page: Page) =>
  page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const out: { id: string; width: string; bandId: string }[] = [];
    const walk = (n: Record<string, unknown>, bandId: string) => {
      const kids = (n.children as Record<string, unknown>[]) ?? [];
      if (n.rowBand) { kids.forEach((c) => walk(c, n.id as string)); return; }
      if (bandId) out.push({ id: n.id as string, width: (n.width as string) ?? "-", bandId });
      kids.forEach((c) => walk(c, bandId));
    };
    walk(site.pages[0].root, "");
    return out;
  });

async function blankPage(page: Page) {
  await clearSite(page);
  await page.waitForSelector("[data-box-id]", { timeout: 20000 });
  await page.waitForTimeout(700);
  return (await page.locator("[data-box-id]").first().boundingBox())!;
}

test.describe("building a page from blank, by dragging", () => {
  test("a second block dropped at the first one's EDGE lands BESIDE it, sharing the line", async ({ page }) => {
    const canvas = await blankPage(page);
    await dropAt(page, canvas.x + canvas.width / 2, canvas.y + 60);

    const first = (await blocks(page))[0];
    expect(first, "the first block was added").toBeTruthy();
    const b1 = (await page.locator(`[data-box-id="${first.id}"]`).boundingBox())!;
    expect(Math.round(b1.width), "…and it fills the line, which is the case that broke").toBeGreaterThan(canvas.width * 0.9);

    // Aim at its right EDGE — the gesture for "put one next to this".
    await dropAt(page, b1.x + b1.width - 8, b1.y + b1.height / 2);

    const after = await blocks(page);
    expect(after.length, "there are two blocks").toBe(2);
    expect(after[0].bandId, "in the SAME band — not a new one below").toBe(after[1].bandId);

    const r1 = (await page.locator(`[data-box-id="${after[0].id}"]`).boundingBox())!;
    const r2 = (await page.locator(`[data-box-id="${after[1].id}"]`).boundingBox())!;
    expect(Math.abs(r1.y - r2.y), "side by side, on one line").toBeLessThan(4);
    expect(r2.x, "the second starts where the first ends").toBeGreaterThanOrEqual(r1.x + r1.width - 4);
  });

  test("…and the line is shared out between them, not left overflowing", async ({ page }) => {
    // The second half. Both arrive wanting the whole line; something has to give, and the ADD is where that
    // is decided. Without it they are two 100% blocks on two lines — present, correct, and not side by side.
    const canvas = await blankPage(page);
    await dropAt(page, canvas.x + canvas.width / 2, canvas.y + 60);
    const first = (await blocks(page))[0];
    const b1 = (await page.locator(`[data-box-id="${first.id}"]`).boundingBox())!;
    await dropAt(page, b1.x + b1.width - 8, b1.y + b1.height / 2);

    const after = await blocks(page);
    const sum = after.reduce((s, b) => s + (parseFloat(b.width) || 0), 0);
    expect(sum, "the two widths add up to one full line").toBeGreaterThan(95);
    expect(sum, "…and no more").toBeLessThanOrEqual(101);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
      "nothing spills sideways").toBe(true);
  });

  test("aiming at the MIDDLE of a block still means below it", async ({ page }) => {
    // The direction that keeps the edge rule honest: if every drop on a block became side-by-side, there
    // would be no way left to start a new line.
    const canvas = await blankPage(page);
    await dropAt(page, canvas.x + canvas.width / 2, canvas.y + 60);
    const first = (await blocks(page))[0];
    const b1 = (await page.locator(`[data-box-id="${first.id}"]`).boundingBox())!;

    await dropAt(page, b1.x + b1.width / 2, b1.y + b1.height / 2);

    const after = await blocks(page);
    expect(after.length, "two blocks").toBe(2);
    expect(after[0].bandId === after[1].bandId, "…on separate lines, not sharing one").toBe(false);
  });
});
