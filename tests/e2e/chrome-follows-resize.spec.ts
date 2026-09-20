import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * THE HANDLES STAY ON THE BLOCK — THROUGHOUT A DRAG, NOT JUST AT THE END.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * The selection chrome (toolbar, eight resize handles) is a fixed-position mirror of the selected block's
 * rectangle, re-measured on every render. The block it mirrors is the one thing it must never lose.
 *
 * It lost it. A budget meant to stop a self-arguing layout from looping forever was spent one per
 * mousemove, so after eight moves — about 130ms of dragging — the mirror stopped following; and because it
 * then compared every new measurement against the rectangle it was still DISPLAYING, which after an
 * abandonment is stale by definition, it could never notice the layout settling either. Permanent:
 * reported from a live session with the right-edge handle stranded some 550px from the block, left there
 * until the block was re-selected.
 *
 * WHY NO EXISTING TEST CAUGHT IT, which is the more useful half of this file. `side-by-side-resize.spec.ts`
 * has dragged this very handle in twelve steps — four past the budget — since the day it was written. It
 * asserts the STORED width and the BLOCK's box, and both were always right: the resize itself never broke.
 * Nothing anywhere asserted where the CHROME ended up. A drag is not tested by its result alone; it is
 * tested by what the user is looking at while they do it.
 *
 * ── THE TWO SPEEDS, AND WHY BOTH ARE HERE ───────────────────────────────────────────────────────────
 *
 * At any rate a hand can produce the chrome sits EXACTLY on the edge. Measured over a 25-step drag:
 *
 *     250px/s   (4px every 16ms)    max 1.0px off      ← a normal drag
 *     1250px/s  (10px every 8ms)    max 1.0px off      ← a fast one
 *     moves fired with no wait      max 16.0px off     ← one step, i.e. one frame
 *
 * That last row is not a defect and cannot be fixed: Playwright can fire pointer moves faster than the
 * browser renders frames, and no mirror can be drawn on a frame that has not happened yet. So the timed
 * tests below hold the tight line, and the flat-out one asserts the only thing that actually tells a
 * FREEZE from a frame of LAG — a freeze GROWS with the length of the drag, and lag does not.
 */

const oneBlock = () => sitePage([
  { id: "B", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 160, background: "#c7d2fe", children: [] },
]);

async function seedOne(page: Page) {
  await seedSite(page, oneBlock());
  await page.waitForSelector('[data-box-id="B"]', { timeout: 15000 });
  await page.waitForTimeout(350);
}

async function select(page: Page, id: string) {
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  for (let i = 0; i < 5; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return;
    await page.mouse.click(b.x + b.width * 0.5, b.y + b.height * 0.5);
    await page.waitForTimeout(180);
  }
  throw new Error(`could not select ${id}`);
}

/** How far the named handle's centre sits from the block edge it is drawn on. */
async function gapToEdge(page: Page, label: string, id: string, edge: "right" | "bottom") {
  const h = (await page.locator(`[aria-label="${label}"]`).boundingBox())!;
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  return edge === "right"
    ? Math.abs(h.x + h.width / 2 - (b.x + b.width))
    : Math.abs(h.y + h.height / 2 - (b.y + b.height));
}

/**
 * Drag a handle at a stated pace, sampling the gap as it goes.
 *
 * `paceMs` is what makes this a test of the product rather than of Playwright: with a wait between moves
 * the browser gets its frame, which is the situation a person is always in.
 */
async function dragSampling(
  page: Page,
  opts: { label: string; id: string; edge: "right" | "bottom"; dx?: number; dy?: number; steps: number; paceMs: number; sampleEvery: number },
) {
  const h = (await page.locator(`[aria-label="${opts.label}"]`).boundingBox())!;
  const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  const samples: { step: number; gap: number }[] = [];
  for (let i = 1; i <= opts.steps; i++) {
    await page.mouse.move(cx + ((opts.dx ?? 0) * i) / opts.steps, cy + ((opts.dy ?? 0) * i) / opts.steps);
    if (opts.paceMs) await page.waitForTimeout(opts.paceMs);
    if (i % opts.sampleEvery === 0) samples.push({ step: i, gap: await gapToEdge(page, opts.label, opts.id, opts.edge) });
  }
  await page.mouse.up();
  await page.waitForTimeout(400);
  return { samples, settled: await gapToEdge(page, opts.label, opts.id, opts.edge) };
}

test.describe("the selection chrome follows the block it is drawn on", () => {
  test("the right-edge handle stays ON the edge through a long drag, and after it", async ({ page }) => {
    await seedOne(page);
    await select(page, "B");

    expect(await gapToEdge(page, "Resize right edge", "B", "right"), "it starts on the edge").toBeLessThan(4);

    // Thirty steps at 8ms — nearly four times the eight-frame budget that used to run out, at a pace a hand
    // can produce. Sampled every fifth step, because the old failure was progressive: it detached partway
    // through and fell further behind with every frame after that.
    const { samples, settled } = await dragSampling(page, {
      label: "Resize right edge", id: "B", edge: "right", dx: -500, steps: 30, paceMs: 8, sampleEvery: 5,
    });

    for (const { step, gap } of samples) {
      expect(gap, `at step ${step} of 30 the handle was ${gap.toFixed(1)}px off the block`).toBeLessThan(4);
    }
    expect(settled, "and it is exactly on the edge once the pointer is released").toBeLessThan(4);
    expect((await page.locator('[data-box-id="B"]').boundingBox())!.width, "the block really did narrow").toBeLessThan(600);
  });

  test("the bottom-edge handle follows a height drag too — the rule is not per-edge", async ({ page }) => {
    await seedOne(page);
    await select(page, "B");

    const { samples, settled } = await dragSampling(page, {
      label: "Resize bottom edge", id: "B", edge: "bottom", dy: 260, steps: 24, paceMs: 8, sampleEvery: 6,
    });

    for (const { step, gap } of samples) {
      expect(gap, `at step ${step} of 24 the handle was ${gap.toFixed(1)}px off the bottom edge`).toBeLessThan(4);
    }
    expect(settled, "and on release").toBeLessThan(4);
    expect((await page.locator('[data-box-id="B"]').boundingBox())!.height, "the block really did grow").toBeGreaterThan(300);
  });

  test("driven FLAT OUT, the gap stays a frame — it does not grow, and it clears on release", async ({ page }) => {
    /**
     * Moves fired with no wait at all, faster than the browser renders. The chrome is then one step behind
     * and cannot be anything else. What must never come back is the old behaviour, where the gap grew with
     * every step for the rest of the drag and then stayed: 30px by step 10, 370px by step 30, and still
     * 370px a minute later.
     *
     * So this asserts the SHAPE, not a number: however long the drag runs, the end is no worse than the
     * beginning — and the moment the pointer stops, the chrome is back on the block.
     */
    await seedOne(page);
    await select(page, "B");

    const STEPS = 40, TRAVEL = 520;
    const { samples, settled } = await dragSampling(page, {
      label: "Resize right edge", id: "B", edge: "right", dx: -TRAVEL, steps: STEPS, paceMs: 0, sampleEvery: 10,
    });

    // One move is 13px, so a chrome that is merely a frame behind can be a dozen or so pixels out and no
    // more, however long the drag runs. An abandoned one is bounded by the LENGTH OF THE DRAG instead:
    // measured against this same drag with the old rule, 25px by step 10 and 415px by step 40.
    const perStep = TRAVEL / STEPS;
    const worst = Math.max(...samples.map((s) => s.gap));
    const trail = samples.map((s) => `step ${s.step}: ${s.gap.toFixed(0)}px`).join(", ");
    expect(worst, `the gap grew with the drag rather than staying a frame behind it — ${trail}`).toBeLessThan(perStep * 3);
    expect(settled, "the pointer stopped, so the chrome came back to the block").toBeLessThan(4);
  });

  test("the toolbar rides with the chrome, so it never floats over empty canvas", async ({ page }) => {
    /**
     * The toolbar is drawn inside the same mirror, so a detached mirror strands it too — and that is the
     * most visible form of it: a menu hanging in white space with nothing underneath.
     *
     * Dragged by the LEFT edge, deliberately. The toolbar hangs off the block's left, so a right-edge drag
     * never asks it to move and the assertion would hold with the chrome completely frozen — a test that
     * cannot fail for the bug it names. Moving the left edge is what makes it answer.
     */
    await seedOne(page);
    await select(page, "B");

    const before = (await page.locator('[data-box-id="B"]').boundingBox())!;
    await dragSampling(page, { label: "Resize left edge", id: "B", edge: "right", dx: 360, steps: 30, paceMs: 8, sampleEvery: 30 });

    const b = (await page.locator('[data-box-id="B"]').boundingBox())!;
    expect(b.x, "the left edge really did move").toBeGreaterThan(before.x + 200);

    // The TOOLBAR, not a button inside it: the bar is `absolute left-0` within the mirror, so its own left
    // is the mirror's left. A button is inset past the drag grip and would answer a different question.
    const bar = (await page.locator('[role="toolbar"][aria-label="Block toolbar"]').boundingBox())!;
    expect(Math.abs(bar.x - b.x), "the toolbar sits on the block's left edge, wherever that now is").toBeLessThan(6);
  });
});
