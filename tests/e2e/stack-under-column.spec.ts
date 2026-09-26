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

  test("the newcomer FILLS the empty space it was dropped into", async ({ page }) => {
    /**
     * You aim at a gap because you can see it. Arriving at the courtesy 8rem and leaving the rest of the
     * gap empty is the builder ignoring the thing you pointed at — and it is what happened: the block landed
     * 128px tall under a column with 260px of room, with the remainder still blank underneath it.
     *
     * Filling is the DEFAULT, not a permanent rule: dragging its height writes a real height and takes the
     * fill off, which is the whole of the user's statement — it should fill "unless I resize the height".
     */
    await seedUneven(page);
    const r0 = (await page.locator('[data-box-id="R"]').boundingBox())!;
    const l = (await page.locator('[data-box-id="L"]').boundingBox())!;
    const gap = (l.y + l.height) - (r0.y + r0.height);
    expect(gap, "the seed really does leave a gap worth filling").toBeGreaterThan(150);

    await dragOver(page, r0.x + r0.width / 2, r0.y + r0.height + 60);
    await drop(page, r0.x + r0.width / 2, r0.y + r0.height + 60);

    const shape = await bandShape(page);
    const right = shape[1] as { kids: unknown[] };
    const secondKid = right.kids[1] as { kids: unknown[] } | string;
    const newId = typeof secondKid === "string" ? secondKid : (secondKid.kids[0] as string);
    const nb = (await page.locator(`[data-box-id="${newId}"]`).boundingBox())!;
    const l2 = (await page.locator('[data-box-id="L"]').boundingBox())!;

    expect(nb.height, "it took the room that was there, not a default 128px").toBeGreaterThan(gap * 0.7);
    expect(nb.y + nb.height, "…reaching the bottom of the taller column beside it")
      .toBeGreaterThanOrEqual(l2.y + l2.height - 6);
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

/**
 * …AND THE SAME FOR THE HOLE ABOVE A BLOCK, which is the one the user could not fill.
 *
 * Dragging a block's TOP edge down opens a `margin-top` — deliberately, where the block sits BESIDE a
 * neighbour rather than below one, because there no single block owns that edge. But a margin is not a box:
 * there is nothing in that space to drop into, and a drop aimed at it hits the band.
 *
 * It did add a block, and produced both halves of what was reported — *"nothing appears and it breaks the
 * positions of the stacks"*. The margin rode along into the new column, so the hole was still there AND the
 * newcomer sat above it: measured, the existing block was pushed from y=287 to y=336 while the 199px hole
 * remained. The newcomer now takes the hole and the margin is handed over, so the block does not move.
 */
test.describe("a block dropped into the hole above a column", () => {
  async function seedHole(page: Page) {
    await seedSite(page, sitePage([
      { id: "L", type: "container", direction: "column", padding: 0, gap: 0, width: "28%", minHeight: 320, background: "#c7d2fe", children: [] },
      // `marginTop` is what dragging R's TOP edge down writes when R sits beside a neighbour.
      { id: "R", type: "container", direction: "column", padding: 0, gap: 0, width: "72%", minHeight: 72, marginTop: 200, background: "#a5b4fc", children: [] },
    ]));
    await page.waitForSelector('[data-box-id="R"]', { timeout: 15000 });
    await page.waitForTimeout(350);
  }
  const rectOf = (page: Page, id: string) => page.evaluate((i) => {
    const el = document.querySelector<HTMLElement>(`[data-box-id="${i}"]`);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { y: Math.round(b.y), h: Math.round(b.height), bottom: Math.round(b.bottom) };
  }, id);

  test("the newcomer fills the hole and the block below it does NOT move", async ({ page }) => {
    await seedHole(page);
    const before = (await rectOf(page, "R"))!;
    const hole = await page.evaluate(() => {
      const band = document.querySelector('[data-box-id="band"]')!.getBoundingClientRect();
      const r = document.querySelector('[data-box-id="R"]')!.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(band.top + (r.top - band.top) / 2), h: Math.round(r.top - band.top) };
    });
    expect(hole.h, "there really is a hole to aim at").toBeGreaterThan(150);

    await dragOver(page, hole.x, hole.y);
    await drop(page, hole.x, hole.y);

    const after = (await rectOf(page, "R"))!;
    /**
     * THE BOTTOM EDGE — the one that was NOT grabbed — must not move. The hole is opened by dragging the top
     * edge DOWN, so the bottom is where the block is anchored, and this builder's standing rule is that the
     * edge you did not grab stays put. The top legitimately changes: inside the new column the block stops
     * being stretched by the band and takes its own height, while the newcomer fills the space above it.
     */
    expect(
      Math.abs(after.bottom - before.bottom),
      `the block's bottom moved from ${before.bottom} to ${after.bottom}`,
    ).toBeLessThan(3);

    /**
     * AND THE HOLE IS ACTUALLY GONE, which is the assertion that does the work.
     *
     * The bottom edge alone CANNOT tell the fix from the bug: leaving the margin in place still lands the
     * block's bottom in the same spot, because the newcomer simply takes less room in front of it. Proven by
     * mutation — with the handover removed this test passed. What changes is whether the newcomer REACHES the
     * block: handed the hole it closes right up to it, and left as a margin it stops 199px short.
     */
    const gap = await page.evaluate(() => {
      const r = document.querySelector('[data-box-id="R"]')!.getBoundingClientRect();
      // The nearest block ABOVE R that shares R's column — which excludes the tall neighbour beside it.
      const above = Array.from(document.querySelectorAll<HTMLElement>("[data-box-id]"))
        .filter((el) => el.getAttribute("data-box-id") !== "R")
        .map((el) => el.getBoundingClientRect())
        .filter((b) => b.bottom <= r.top + 2 && b.height > 4 && b.left < r.right - 2 && b.right > r.left + 2)
        .sort((a, b) => b.bottom - a.bottom)[0];
      return above ? Math.round(r.top - above.bottom) : null;
    });
    expect(gap, "no block was put above it at all").not.toBeNull();
    expect(
      gap!,
      `the newcomer stops ${gap}px short of the block — the hole is still there, held open by the old margin`,
    ).toBeLessThan(6);
  });
});

/**
 * …AND SHRINKING THE BLOCK YOU JUST DROPPED LETS THE ONE BELOW RIDE UP.
 *
 * The user's own sequence, reported with a screenshot: put a stack beside another, drop a second one above it,
 * then drag that new one shorter — and the stack below stayed exactly where it was, with a hole between them.
 *
 * The cause is the band. A dropped block is wrapped in one marked `height: "fill"` so it takes the space that
 * is really there; give that block a height afterwards and the fill has to be spent, or the band goes on
 * holding all of it. Measured before the fix: the newcomer went 400 → 300 while its band kept all 400, leaving
 * a 100px hole and the block below stranded at y=488.
 *
 * The agreed rule, in the user's words: the one that follows moves with it, and whatever room is genuinely
 * left over pools at the END of the column — which is where you can then build.
 */
test.describe("shrinking a dropped block lets the next one follow", () => {
  /** The user's shape: a tall column beside a block pushed down by a margin, so there is a hole to drop into. */
  async function seedPair(page: Page) {
    await seedSite(page, sitePage([
      { id: "L", type: "container", direction: "column", padding: 0, gap: 0, width: "20%", minHeight: 600, background: "#c7d2fe", children: [] },
      { id: "R", type: "container", direction: "column", padding: 0, gap: 0, width: "80%", minHeight: 200, marginTop: 300, background: "#a5b4fc", children: [] },
    ]));
    await page.waitForSelector('[data-box-id="R"]', { timeout: 15000 });
    await page.waitForTimeout(350);
  }

  const rect = (page: Page, id: string) => page.evaluate((i) => {
    const el = document.querySelector<HTMLElement>(`[data-box-id="${i}"]`);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) };
  }, id);

  /** The block the drop added: the newest one with no block inside it. */
  const newcomerId = (page: Page, before: string[]) => page.evaluate((old) => {
    const fresh = Array.from(document.querySelectorAll<HTMLElement>("[data-box-id]"))
      .filter((el) => !old.includes(el.getAttribute("data-box-id")!));
    const leaf = fresh.find((el) => el.querySelectorAll("[data-box-id]").length === 0);
    return leaf ? leaf.getAttribute("data-box-id") : null;
  }, before);

  const idsNow = (page: Page) => page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-box-id]")).map((e) => e.getAttribute("data-box-id")!));

  async function selectBlock(page: Page, id: string) {
    const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
    for (let i = 0; i < 7; i++) {
      const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
      if (sel === id) return true;
      await page.mouse.click(b.x + Math.min(40, b.width / 2), b.y + Math.min(20, b.height / 2));
      await page.waitForTimeout(200);
    }
    return false;
  }

  test("the block below rides up, and the leftover pools at the END of the column", async ({ page }) => {
    await seedPair(page);
    const before = await idsNow(page);

    // Drop a Stack into the hole above R.
    const hole = await page.evaluate(() => {
      const band = document.querySelector('[data-box-id="band"]')!.getBoundingClientRect();
      const r = document.querySelector('[data-box-id="R"]')!.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(band.top + (r.top - band.top) / 2) };
    });
    await dragOver(page, hole.x, hole.y);
    await drop(page, hole.x, hole.y);

    const fresh = await newcomerId(page, before);
    expect(fresh, "the drop added a block").not.toBeNull();

    const rBefore = (await rect(page, "R"))!;
    const nBefore = (await rect(page, fresh!))!;
    expect(nBefore.h, "the newcomer took the space that was there").toBeGreaterThan(200);

    // Now drag the newcomer shorter — the gesture that used to strand the block below.
    expect(await selectBlock(page, fresh!), "the newcomer could not be selected").toBe(true);
    const handle = (await page.locator('[aria-label="Resize bottom edge"]').boundingBox())!;
    const cx = handle.x + handle.width / 2, cy = handle.y + handle.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) { await page.mouse.move(cx, cy - (100 * i) / 12); await page.waitForTimeout(12); }
    await page.mouse.up();
    await page.waitForTimeout(700);

    const nAfter = (await rect(page, fresh!))!;
    const rAfter = (await rect(page, "R"))!;
    const column = (await rect(page, "L"))!; // the tall neighbour is what makes the column tall

    expect(nBefore.h - nAfter.h, "the newcomer really did get shorter").toBeGreaterThan(40);
    expect(
      Math.round(rAfter.top - nAfter.bottom),
      `a ${Math.round(rAfter.top - nAfter.bottom)}px hole was left between them — the band is still filling`,
    ).toBeLessThan(6);
    expect(
      rBefore.top - rAfter.top,
      `the block below did not follow: it was at ${rBefore.top} and is now at ${rAfter.top}`,
    ).toBeGreaterThan(40);

    // …and the room that was freed is at the END of the column, which is where it can be built on.
    expect(
      Math.round(column.bottom - rAfter.bottom),
      "the leftover should pool at the bottom of the column",
    ).toBeGreaterThan(40);
  });
});
