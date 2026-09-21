import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * THE TOP AND BOTTOM EDGES DO NOT MOVE EACH OTHER — RULE 19, on the vertical axis.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * "When I try to increase the height from the top it affects the whole height, and when I increase it from
 * the bottom it affects the whole height — the top and bottom adjustment affect each other." Two separate
 * defects were behind that, on two different resize paths, and both are driven here from the user's side.
 *
 *   · A BLOCK AT THE PAGE TOP. Whatever was dragged past the page top used to be added to the HEIGHT, so
 *     the block kept growing — downward. Measured: top edge dragged UP 80px moved the top 0px and the
 *     BOTTOM 80px down. It was a deliberate decision ("a dead handle feels broken"), and rule 19 reverses
 *     it: where the partner cannot give, the edge STOPS. A handle that does nothing at a wall is honest;
 *     one that moves the opposite edge is not.
 *
 *   · A GRID CELL. The top edge went completely dead once anything had been dropped into the row above.
 *     The slack was measured by asking the row's children how tall they were — but a child with
 *     `flex-grow: 1` is exactly as tall as whatever it is given, so it answered with the cell's own height,
 *     the slack came out 0, and the drag was clamped to nothing. Fixing the fill made this WORSE, not
 *     better: more children fill now, so more of them lie when asked.
 *
 * Every assertion is on BOTH edges, always. "The grabbed edge moved" and "the other edge stayed" are two
 * different claims, and the bug satisfied the first one while failing the second.
 */

const MIN_ROW_PX = 24;

const rect = async (page: Page, id: string) => {
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  return { top: Math.round(b.y), bottom: Math.round(b.y + b.height), h: Math.round(b.height) };
};

async function select(page: Page, id: string) {
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  for (let i = 0; i < 6; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return;
    await page.mouse.click(b.x + b.width * 0.5, b.y + b.height * 0.5);
    await page.waitForTimeout(200);
  }
  throw new Error(`could not select ${id}`);
}

async function dragEdge(page: Page, label: string, dy: number) {
  const h = (await page.locator(`[aria-label="${label}"]`).boundingBox())!;
  const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(cx, cy + (dy * i) / 12); await page.waitForTimeout(8); }
  await page.mouse.up();
  await page.waitForTimeout(350);
}

const cell = (i: number) => ({ id: `c${i}`, type: "container" as const, layout: "flex" as const, direction: "column" as const, colSpan: 6, padding: 0, gap: 0, children: [] });
const grid2x2 = () => sitePage([
  { id: "g", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "100%", minHeight: 400, children: [cell(1), cell(2), cell(3), cell(4)] },
]);

const stack = (id: string, bg: string, h: number) => ({
  id, type: "container" as const, direction: "column" as const,
  width: "100%", padding: 0, gap: 0, minHeight: h, background: bg, children: [],
});

/** Two stacks in ONE band — siblings, the shape a seeded page makes. */
const oneBand = () => sitePage([stack("green", "#4d8c0f", 300), stack("magenta", "#8c0f52", 200)]);

/**
 * Two stacks in TWO bands — the shape the BUILDER makes, and the one the sibling-only lookup missed.
 * Every top-level block gets its own band, so the stack above is not a sibling at all; it is an only
 * child in the band before this one. Both shapes are driven, because the fix passed one and failed the
 * other, and only the second is what a person building a page actually has.
 */
const twoBands = () => ({
  pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    { id: "band1", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [stack("green", "#4d8c0f", 300)] },
    { id: "band2", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [stack("magenta", "#8c0f52", 200)] },
  ] } }],
  homeId: "p1",
});

test.describe("dragging a block's top or bottom edge", () => {
  test("a block at the PAGE TOP: the top edge stops, and the bottom never moves", async ({ page }) => {
    await seedSite(page, sitePage([
      { id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 200, background: "#eef2ff", children: [] },
    ]));
    await page.waitForSelector('[data-box-id="sec"]', { timeout: 15000 });
    await page.waitForTimeout(300);
    await select(page, "sec");

    const before = await rect(page, "sec");
    await dragEdge(page, "Resize top edge", -80);
    const after = await rect(page, "sec");

    expect(after.bottom, `the bottom edge moved ${after.bottom - before.bottom}px while the TOP was being held`).toBe(before.bottom);
    expect(after.top, "and the top is still at the wall it was already against").toBe(before.top);
  });

  test("the bottom edge moves the bottom, and leaves the top alone", async ({ page }) => {
    await seedSite(page, sitePage([
      { id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 200, background: "#eef2ff", children: [] },
    ]));
    await page.waitForSelector('[data-box-id="sec"]', { timeout: 15000 });
    await page.waitForTimeout(300);
    await select(page, "sec");

    const before = await rect(page, "sec");
    await dragEdge(page, "Resize bottom edge", 120);
    const after = await rect(page, "sec");

    expect(after.top, "the top edge stays exactly put").toBe(before.top);
    expect(after.bottom - before.bottom, "the bottom follows the pointer").toBeGreaterThan(100);
  });

  test("a GRID CELL in the second row: the top edge moves, the bottom is anchored", async ({ page }) => {
    await seedSite(page, grid2x2());
    await page.waitForSelector('[data-box-id="c3"]', { timeout: 15000 });
    await page.waitForTimeout(300);
    await select(page, "c3");

    const before = await rect(page, "c3"), above = await rect(page, "c1");
    await dragEdge(page, "Resize top edge", -60);
    const after = await rect(page, "c3"), aboveAfter = await rect(page, "c1");

    expect(after.bottom, "the bottom edge is anchored").toBe(before.bottom);
    expect(before.top - after.top, "the grabbed edge moved by what was dragged").toBeGreaterThan(40);
    expect(above.h - aboveAfter.h, "and the row above gave exactly that back").toBeGreaterThan(40);
  });

  test("the top edge still works after something has been DROPPED in the row above", async ({ page }) => {
    /**
     * The reported case, and the one every earlier guard missed: a cell holding something that FILLS it
     * reports the cell's own height when asked how tall its content is, so the slack came out 0 and the
     * edge went dead. Dropping a block in first is what makes this different from the test above.
     */
    await seedSite(page, grid2x2());
    await page.waitForSelector('[data-box-id="c1"]', { timeout: 15000 });
    await page.waitForTimeout(300);

    await page.evaluate(() => {
      const dt = new DataTransfer();
      dt.setData("application/x-box-block", "container");
      const el = document.querySelector('[data-box-id="c1"]')!;
      const r = el.getBoundingClientRect();
      const at = { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, bubbles: true, cancelable: true, dataTransfer: dt };
      el.dispatchEvent(new DragEvent("dragover", at));
      el.dispatchEvent(new DragEvent("drop", at));
    });
    await page.waitForTimeout(450);

    await select(page, "c3");
    const before = await rect(page, "c3");
    await dragEdge(page, "Resize top edge", -60);
    const after = await rect(page, "c3");

    expect(before.top - after.top, `the top edge moved ${before.top - after.top}px — it was DEAD at 0 before`).toBeGreaterThan(40);
    expect(after.bottom, "and the bottom edge never moved").toBe(before.bottom);
  });

  test("the edge stops where the row above runs out, rather than growing out of the far side", async ({ page }) => {
    // Rule 19's clamp, tested at the width where the partner RUNS OUT — dragged far past what it can give.
    await seedSite(page, grid2x2());
    await page.waitForSelector('[data-box-id="c3"]', { timeout: 15000 });
    await page.waitForTimeout(300);
    await select(page, "c3");

    const before = await rect(page, "c3");
    await dragEdge(page, "Resize top edge", -400);   // far more than the 200px row above owns
    const after = await rect(page, "c3"), above = await rect(page, "c1");

    expect(after.bottom, "the bottom edge is still exactly where it was").toBe(before.bottom);
    expect(above.h, "the row above kept a usable minimum rather than vanishing").toBeGreaterThanOrEqual(MIN_ROW_PX);
    expect(after.top, "and the edge stopped at the boundary instead of running past it").toBeGreaterThanOrEqual(above.top);
  });
});

/**
 * TWO STACKS THAT TOUCH SHARE THE BOUNDARY BETWEEN THEM — rule 19 on the vertical axis, for FLOW blocks.
 *
 * "When I reduce the height of the last stack on the page, the one above it does not adjust automatically.
 * And then when I try to increase the one above it so it can match up, it doesn't match up either — the
 * white space always remains."
 *
 * Two defects, and the first one is what put the white space there:
 *
 *   · THE ANCHOR MEASURED FROM THE WRONG PLACE. Before a vertical drag the resize pins `margin-top` so an
 *     un-stretched box does not jump, and it measured that margin from the PARENT'S CONTENT TOP — correct
 *     for the first block and for no other, since every block after it has already been carried down there
 *     by the blocks before it. Measured: an 80px drag on the last stack moved its top 380px and its
 *     ANCHORED bottom 300px, opening 380px of white space. The bottom edge did it too, because the same
 *     anchor fires for both.
 *
 *   · THE VERTICAL BOUNDARY WAS NOT SHARED. The east and west edges have spent their neighbour for a long
 *     time; the top edge only ever opened a margin, so the block above never changed size. And the hole
 *     could not be closed by hand either: growing the block above moves the flow origin of the one below,
 *     so the margin carries the hole along in front of it — 380px before, 380px after growing the block
 *     above by 200px. "The white space always remains" is literally what the arithmetic did.
 */
test.describe("two stacks that touch", () => {
  for (const [shape, seed] of [["one band", oneBand], ["two bands", twoBands]] as const) {
    test(`${shape}: the stack above gives back precisely what the top edge takes`, async ({ page }) => {
      await seedSite(page, seed());
      await page.waitForSelector('[data-box-id="magenta"]', { timeout: 15000 });
      await page.waitForTimeout(300);
      await select(page, "magenta");

      const before = await rect(page, "magenta"), above = await rect(page, "green");
      await dragEdge(page, "Resize top edge", 80); // drag the boundary DOWN — shrink the last stack
      const after = await rect(page, "magenta"), aboveAfter = await rect(page, "green");

      expect(after.bottom, "the bottom edge is anchored").toBe(before.bottom);
      expect(after.top - before.top, "the grabbed edge followed the pointer").toBeGreaterThan(60);
      expect(aboveAfter.h - above.h, "and the stack above grew by exactly what this one gave up")
        .toBe(before.h - after.h);
      expect(after.top - aboveAfter.bottom, "so no white space is left between them").toBe(0);
    });

    test(`${shape}: reducing the last stack from its BOTTOM leaves no hole above it`, async ({ page }) => {
      // The anchor's teleport, driven from the gesture the report actually used ("reduce the height").
      await seedSite(page, seed());
      await page.waitForSelector('[data-box-id="magenta"]', { timeout: 15000 });
      await page.waitForTimeout(300);
      await select(page, "magenta");

      const before = await rect(page, "magenta"), above = await rect(page, "green");
      await dragEdge(page, "Resize bottom edge", -80);
      const after = await rect(page, "magenta"), aboveAfter = await rect(page, "green");

      expect(after.top, `the top edge moved ${after.top - before.top}px while the BOTTOM was being held`).toBe(before.top);
      expect(before.bottom - after.bottom, "the bottom followed the pointer").toBeGreaterThan(60);
      expect(after.top - aboveAfter.bottom, "and the stack above is still flush against it").toBe(0);
      expect(aboveAfter.top, "which it did without moving").toBe(above.top);
    });

    test(`${shape}: dragging the top edge UP takes height from the stack above`, async ({ page }) => {
      await seedSite(page, seed());
      await page.waitForSelector('[data-box-id="magenta"]', { timeout: 15000 });
      await page.waitForTimeout(300);
      await select(page, "magenta");

      const before = await rect(page, "magenta"), above = await rect(page, "green");
      await dragEdge(page, "Resize top edge", -60);
      const after = await rect(page, "magenta"), aboveAfter = await rect(page, "green");

      expect(after.bottom, "the bottom edge never moves").toBe(before.bottom);
      expect(before.top - after.top, "the grabbed edge moved").toBeGreaterThan(40);
      expect(above.h - aboveAfter.h, "and the stack above gave back exactly that").toBe(after.h - before.h);
      expect(after.top - aboveAfter.bottom, "with the two still touching").toBe(0);
    });

    test(`${shape}: the edge stops where the stack above runs out`, async ({ page }) => {
      // Rule 19's second clause, dragged far past what the partner can give.
      await seedSite(page, seed());
      await page.waitForSelector('[data-box-id="magenta"]', { timeout: 15000 });
      await page.waitForTimeout(300);
      await select(page, "magenta");

      const before = await rect(page, "magenta");
      await dragEdge(page, "Resize top edge", -400); // far more than the 300px stack above owns
      const after = await rect(page, "magenta"), aboveAfter = await rect(page, "green");

      expect(after.bottom, "the bottom edge is still exactly where it was").toBe(before.bottom);
      expect(aboveAfter.h, "the stack above kept a usable minimum rather than vanishing").toBeGreaterThanOrEqual(MIN_ROW_PX);
      expect(after.top, "and the edge stopped at the boundary instead of running past it").toBeGreaterThanOrEqual(aboveAfter.top);
      expect(after.top - aboveAfter.bottom, "still touching, even at the wall").toBe(0);
    });
  }

  test.describe("with deliberate space above it", () => {
    /**
     * SPACE THE USER ASKED FOR IS A QUANTITY THE DRAG SPENDS, never a value the drag clears.
     *
     * The shared-boundary branch wrote `margin-top: 0` flat. With no spacing that is the same thing, and
     * every guard above passed on it. Give the block outer spacing and the gesture INVERTED: zeroing a 40px
     * margin lifted the block 40px while the pointer was dragging it down, so a drag DOWN moved the top UP
     * — and the spacing was gone for good. This is the east edge's own rule ("the empty space is spent
     * first, and only then the neighbour"), which the vertical axis had never been held to.
     */
    const spaced = () => sitePage([
      stack("green", "#4d8c0f", 300),
      { ...stack("magenta", "#8c0f52", 200), marginTop: 40 },
    ]);

    /** The real rendered gap, measured rather than assumed — stored spacing is in the fluid base unit. */
    const gapOf = async (page: Page) => (await rect(page, "magenta")).top - (await rect(page, "green")).bottom;

    test("dragging the top edge DOWN moves it down, and keeps the space", async ({ page }) => {
      await seedSite(page, spaced());
      await page.waitForSelector('[data-box-id="magenta"]', { timeout: 15000 });
      await page.waitForTimeout(300);
      await select(page, "magenta");

      const before = await rect(page, "magenta"), above = await rect(page, "green");
      const gap0 = await gapOf(page);
      expect(gap0, "the seeded page really does have space above the block").toBeGreaterThan(10);

      await dragEdge(page, "Resize top edge", 60);
      const after = await rect(page, "magenta"), aboveAfter = await rect(page, "green");

      expect(after.top - before.top, "the grabbed edge went DOWN, the way it was dragged").toBeGreaterThan(40);
      expect(after.bottom, "the bottom is still anchored").toBe(before.bottom);
      expect(await gapOf(page), "and the space the user asked for is still exactly what it was").toBe(gap0);
      expect(aboveAfter.h - above.h, "the block above took up what was released").toBe(before.h - after.h);
    });

    test("dragging the top edge UP closes the space first, before touching the block above", async ({ page }) => {
      await seedSite(page, spaced());
      await page.waitForSelector('[data-box-id="magenta"]', { timeout: 15000 });
      await page.waitForTimeout(300);
      await select(page, "magenta");

      const gap0 = await gapOf(page);
      const above = await rect(page, "green"), before = await rect(page, "magenta");

      await dragEdge(page, "Resize top edge", -Math.round(gap0 / 2)); // less than the gap: it is free space
      const aboveAfter = await rect(page, "green"), after = await rect(page, "magenta");

      expect(after.bottom, "the bottom never moves").toBe(before.bottom);
      expect(await gapOf(page), "the gap gave the room up").toBeLessThan(gap0);
      expect(aboveAfter.h, "and the block above was not touched, because the space was already free").toBe(above.h);
    });
  });

  test("a block BESIDE another keeps the old behaviour — it never steals from its neighbour", async ({ page }) => {
    /**
     * The previous sibling of a block on a shared line sits BESIDE it, not above, so the top edge is not
     * its boundary. Without this the walk-up would have made a half-width block shrink the block next to it,
     * which is the horizontal neighbour's job and the wrong axis entirely.
     */
    await seedSite(page, sitePage([
      { ...stack("left", "#4d8c0f", 200), width: "50%" },
      { ...stack("right", "#8c0f52", 200), width: "50%" },
    ]));
    await page.waitForSelector('[data-box-id="right"]', { timeout: 15000 });
    await page.waitForTimeout(300);

    const sideBySide = await rect(page, "left");
    expect(sideBySide.top, "the two really are on one line").toBe((await rect(page, "right")).top);

    await select(page, "right");
    const beforeLeft = await rect(page, "left");
    await dragEdge(page, "Resize top edge", 40);
    const afterLeft = await rect(page, "left");

    expect(afterLeft.h, "the block beside it was not resized").toBe(beforeLeft.h);
  });
});
