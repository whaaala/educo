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
/** Every cell's stored column span, in document order — the row's arithmetic, read from the saved tree. */
const spansOf = (page: Page) =>
  page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    let g: Record<string, unknown> | null = null;
    const walk = (n: Record<string, unknown>) => { if (!g && n.layout === "grid") g = n; ((n.children as Record<string, unknown>[]) ?? []).forEach(walk); };
    walk(site.pages[0].root);
    return (((g as unknown as Record<string, unknown>).children as Record<string, unknown>[]) ?? []).map((c) => c.colSpan as number);
  });
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
  test("a long drag never spins the render loop", async ({ page }) => {
    // The crash this guards: every commit re-renders, the selection chrome re-measures the block, and if the
    // layout has not settled it measures a different value and commits again — until React gives up with
    // "Maximum update depth exceeded". A resize is exactly where a layout is least settled, and a grid whose
    // rows are partly `auto` (a row given a height) and partly `1fr` (the rest sharing what is left) is
    // exactly the layout that can fail to settle.
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

    await seedGrid(page, 2, 3, 500);
    await selectCell(page, "c0");
    // A long, many-stepped drag in both directions, so the layout is re-solved on every frame.
    const h = (await page.locator('[aria-label="Resize bottom edge"]').boundingBox())!;
    const x = h.x + h.width / 2, y = h.y + h.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    for (const dy of [40, 90, 150, 210, 150, 80, 20, 120, 200]) { await page.mouse.move(x, y + dy); await page.waitForTimeout(40); }
    await page.mouse.up();
    await page.waitForTimeout(600);

    expect(errors.filter((e) => /Maximum update depth/i.test(e)), "a resize must never run away").toEqual([]);
    expect(errors, "and raise no console error at all").toEqual([]);
  });


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

  test("a cell pushed onto the next row COMES BACK when the dragged cell shrinks", async ({ page }) => {
    // The bug, reported after using it: widen cell A far enough and cell B wraps to row two — correct. Then
    // shrink A back and B stayed stranded down there while the row sat several columns short, because the
    // neighbour was looked up by MEASURED position (a wrapped cell is no longer "on this row", so nothing was
    // written to it) and the wrap had already stamped the 3-column floor over B's real width, so there was
    // nothing left to reverse. Both halves have to hold: B returns to the row, AND it takes the width A freed.
    await seedGrid(page, 2, 1);
    await selectCell(page, "c0");
    const grid = (await page.locator('[data-box-id="tgt"]').boundingBox())!;
    const topOf = async (id: string) => (await rectOf(page, id)).top;
    const rowOne = await topOf("c1");

    await dragHandle(page, "Resize right edge", grid.width * 0.55, 0);
    expect(await topOf("c1"), "pushed past the readable minimum, the neighbour wraps").toBeGreaterThan(rowOne + 20);
    expect(await spansOf(page), "and it keeps the width it had — wrapping is not a resize").toEqual([12, 6]);

    await dragHandle(page, "Resize right edge", -grid.width * 0.55, 0);
    expect(Math.abs((await topOf("c1")) - rowOne), "shrinking brings it back onto the row").toBeLessThan(3);
    expect((await spansOf(page)).reduce((a, b) => a + b, 0), "and the row fills the twelve again").toBe(12);
  });

  test("out and back in ONE drag leaves the row exactly as it was", async ({ page }) => {
    // Every position of the pointer must give one answer, whichever direction it was reached from. It did not:
    // the neighbour was moved by a delta accumulated against a snapshot, so returning to the starting width
    // left it two columns narrower than it began.
    await seedGrid(page, 2, 1);
    await selectCell(page, "c0");
    const grid = (await page.locator('[data-box-id="tgt"]').boundingBox())!;
    const h = (await page.locator('[aria-label="Resize right edge"]').boundingBox())!;
    const x = h.x + h.width / 2, y = h.y + h.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    for (const f of [0.2, 0.4, 0.55, 0.4, 0.2, 0]) { await page.mouse.move(x + grid.width * f, y); await page.waitForTimeout(30); }
    await page.mouse.up();
    await page.waitForTimeout(250);
    expect(await spansOf(page), "back where it started").toEqual([6, 6]);
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

/**
 * THE GRABBED EDGE IS THE ONLY ONE THAT MOVES.
 *
 * The two tests above cover the edges that were already right. These cover the two that were not, each in
 * the exact shape that failed, because both failed for ONE reason: the drag wrote a SIZE (a span, a
 * min-height) and left a partner to absorb the difference. Where the partner could not — a previous cell
 * already at the floor, a row above already at its content height — the size grew anyway and it grew out of
 * the FAR edge. Measured before the fix: the left edge moved the right edge 171px, and the top edge moved
 * the bottom edge by the whole drag on every grid tried.
 *
 * THE PART THAT MATTERS MORE THAN THE BUG: this was never a regression. A grid cell has its own resize
 * path, and these two edges were wrong from the day it shipped — while `box-builder-columns.feature`
 * carried the scenario "The grabbed edge is the only one that moves" and a test above it passed. Both
 * only ever built a TWO-cell row. At two across the previous cell has room to give and the row above has
 * slack, so the partner always absorbed the difference and the defect had nowhere to show. The rule was
 * asserted, the assertion passed, and the rule was not held.
 *
 * So each edge below is tested TWICE: once ordinarily, and once dragged FAR past what the row can give.
 * The second is the one that would have caught this, because the clamp is the half that goes missing.
 */
test.describe("the grabbed edge is the only one that moves", () => {
  /** A full rect — `rectOf` above answers about the down axis only. */
  const boxOf = (page: Page, id: string) =>
    page.locator(`[data-box-id="${id}"]`).evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    });

  test("the LEFT edge grows the cell leftward — the right edge never moves", async ({ page }) => {
    // FOUR across, which is the shape that failed. With two, the previous cell had room to give and the bug
    // was invisible; with four it is already at the wrap threshold, so the span went on growing to the right.
    await seedGrid(page, 4, 2);
    await selectCell(page, "c1"); // a cell WITH a previous sibling, so there is a boundary to move
    const before = await boxOf(page, "c1");
    const grid = (await page.locator('[data-box-id="tgt"]').boundingBox())!;
    await dragHandle(page, "Resize left edge", -grid.width / 6, 0); // two of twelve columns, leftward

    const after = await boxOf(page, "c1");
    expect(Math.abs(after.right - before.right), "the RIGHT edge — the one not being held — does not move").toBeLessThan(3);
    expect(after.left, "…because the LEFT edge, the one under the pointer, is what moved").toBeLessThan(before.left - 60);
  });

  test("dragging the LEFT edge past what the row can give still never moves the right edge", async ({ page }) => {
    // The clamp itself. Pushed beyond the point where the previous cell can give ground, the span used to
    // carry on growing — and a grid item grows to the RIGHT, so the far edge ran away across the page.
    await seedGrid(page, 4, 2);
    await selectCell(page, "c1");
    const before = await boxOf(page, "c1");
    const grid = (await page.locator('[data-box-id="tgt"]').boundingBox())!;
    await dragHandle(page, "Resize left edge", -grid.width * 1.5, 0); // far further than there is room for

    const after = await boxOf(page, "c1");
    expect(Math.abs(after.right - before.right), "the far edge is still exactly where it was").toBeLessThan(3);
  });

  test("the TOP edge moves the BOUNDARY — the row above gives back exactly what this row takes", async ({ page }) => {
    // The bug: a min-height is a FLOOR, so handing the row above a smaller one changed nothing at all, and
    // this row grew DOWNWARD instead — the one edge a top-edge drag is required to leave alone.
    await seedGrid(page, 2, 2);
    await selectCell(page, "c2"); // second row, so there IS a boundary above it
    const before = await boxOf(page, "c2");
    const aboveBefore = await heightOf(page, "c0");
    await dragHandle(page, "Resize top edge", 0, -60);

    const after = await boxOf(page, "c2");
    const aboveAfter = await heightOf(page, "c0");
    expect(Math.abs(after.bottom - before.bottom), "the BOTTOM edge is not the one being held, so it stays").toBeLessThan(3);
    expect(Math.abs((after.height - before.height) - (aboveBefore - aboveAfter)),
      "the boundary moved and nothing else did: what one row gained, the other gave").toBeLessThan(3);
  });

  test("the TOP edge dragged past the room above still never pushes the bottom down", async ({ page }) => {
    // The clamp. There is only ever as much room above as that row can spare; asked for more, the old code
    // wrote the whole request into this row and let it grow out of its far edge instead.
    await seedGrid(page, 2, 2);
    await selectCell(page, "c2");
    const before = await boxOf(page, "c2");
    await dragHandle(page, "Resize top edge", 0, -600); // far more than any row above could ever give

    const after = await boxOf(page, "c2");
    expect(Math.abs(after.bottom - before.bottom), "the bottom edge is still exactly where it was").toBeLessThan(3);
  });
});

/**
 * A DRAG IS ONE GESTURE — one picture while it happens, one entry when it ends.
 *
 * It used to commit the whole page into React state on every pointer move: on a 500-block page at a real
 * mouse's 120 events/sec that ran frames to 27ms (below 60fps — the lag and the stepping the user reported),
 * and it left ~200 undo entries, so one Ctrl+Z undid a single frame of the drag.
 */
test.describe("a drag is one gesture", () => {
  test("what the drag SHOWS is what the release COMMITS", async ({ page }) => {
    // The preview paints the DOM directly, so this is the guard that it cannot drift from the tree: the two
    // are read either side of the mouse-up and must be the same number.
    await seedGrid(page, 2, 2);
    await selectCell(page, "c0");
    const h = (await page.locator('[aria-label="Resize bottom edge"]').boundingBox())!;
    const x = h.x + h.width / 2, y = h.y + h.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(x, y + (180 * i) / 8);
    await page.waitForTimeout(120);
    const shown = await heightOf(page, "c0"); // still mid-drag: nothing has been committed yet
    await page.mouse.up();
    await page.waitForTimeout(300);
    const committed = await heightOf(page, "c0");

    expect(shown, "the drag actually moved something").toBeGreaterThan(100);
    expect(committed, "and the committed tree renders the picture the drag was showing").toBeCloseTo(shown, -0.5);
  });

  test("ONE undo puts back the whole drag", async ({ page }) => {
    await seedGrid(page, 2, 2);
    await selectCell(page, "c0");
    const before = await heightOf(page, "c0");
    await dragHandle(page, "Resize bottom edge", 0, 180);
    expect(await heightOf(page, "c0"), "the drag landed").toBeGreaterThan(before + 100);

    await page.keyboard.press("Control+z");
    await page.waitForTimeout(350);
    expect(await heightOf(page, "c0"), "one undo, not one per frame of the gesture").toBeCloseTo(before, -0.5);
  });

  test("the page is written to storage ONCE for a whole drag", async ({ page }) => {
    await seedGrid(page, 2, 2);
    await selectCell(page, "c0");
    await page.evaluate(() => {
      (window as unknown as { __w: number }).__w = 0;
      const orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k: string, v: string) {
        if (k === "educo_box_site_v1") (window as unknown as { __w: number }).__w++;
        return orig.call(this, k, v);
      };
    });
    await dragHandle(page, "Resize bottom edge", 0, 180);
    const writes = await page.evaluate(() => (window as unknown as { __w: number }).__w);
    expect(writes, "a drag re-serialised the whole site on every pointer move").toBeLessThanOrEqual(2);
  });
});
