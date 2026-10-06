import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * RESIZING THE BOUNDARY BETWEEN TWO BLOCKS ON A LINE.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * The boundary between two blocks belongs to BOTH of them, so dragging it spends the neighbour's space: you
 * take width, it gives width, and the line stays exactly full. That is how a table column behaves, and it is
 * what a person means by dragging the line between two things.
 *
 * It did not work at all, and the failure was total rather than partial. The right edge was clamped to the
 * neighbour's LEFT edge, on the reasoning that a drag fills a GAP and the neighbour never moves — but two
 * blocks sharing a full row are touching, so there is no gap, the clamp pinned the edge exactly where it
 * already was, and a 200px drag stored "50.00%" where "50%" had been. Not stiff, not laggy: inert. And a
 * full row is the ordinary case, not a corner.
 *
 * Every assertion here is on the STORED width as well as the rendered box, because the stored number is what
 * the user keeps and it is where the inertia showed up — the pixels were never wrong, they were unchanged.
 */

const twoUp = () => sitePage([
  { id: "L", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 160, background: "#c7d2fe", children: [] },
  { id: "R", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 160, background: "#a5b4fc", children: [] },
]);

async function seedPair(page: Page) {
  await seedSite(page, twoUp());
  await page.waitForSelector('[data-box-id="L"]', { timeout: 15000 });
  await page.waitForTimeout(350);
}

async function select(page: Page, id: string) {
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  for (let i = 0; i < 5; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return true;
    // a quarter in, not the middle: an empty block's "+" hint sits in its middle, and on a shrunk canvas it covers it
    await page.mouse.click(b.x + b.width * 0.25, b.y + b.height * 0.25);
    await page.waitForTimeout(180);
  }
  return false;
}

const scaleOf = (page: Page) => page.evaluate(() => Number(document.querySelector<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale) || 1);

/** Drag by `dx` PAGE px — the same gesture on the page at any scale (E-2: Full width is the desktop page shrunk to fit). */
async function dragHandle(page: Page, label: string, pageDx: number) {
  const dx = pageDx * (await scaleOf(page));
  const h = (await page.locator(`[aria-label="${label}"]`).boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) await page.mouse.move(h.x + h.width / 2 + (dx * i) / 12, h.y + h.height / 2);
  await page.mouse.up();
  await page.waitForTimeout(350);
}

/** A block's stored width as a percentage, and the box it actually occupies — in PAGE px, from the canvas frame's corner. */
async function widthOf(page: Page, id: string) {
  const stored = await page.evaluate((id) => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const find = (n: Record<string, unknown>): Record<string, unknown> | null =>
      n.id === id ? n : ((n.children as Record<string, unknown>[]) ?? []).reduce<Record<string, unknown> | null>((a, c) => a ?? find(c), null);
    return (find(site.pages[0].root)?.width as string) ?? "";
  }, id);
  const box = await page.locator(`[data-box-id="${id}"]`).evaluate((el) => {
    const f = el.closest<HTMLElement>("[data-canvas-scale]")!, s = Number(f.dataset.canvasScale) || 1;
    const r = el.getBoundingClientRect(), o = f.getBoundingClientRect();
    return { x: (r.left - o.left) / s, y: (r.top - o.top) / s, width: r.width / s, height: r.height / s };
  });
  return { pct: parseFloat(stored), box };
}

/**
 * The row's width in page px, read from L (its drawn width ÷ its stored share). Every drag below is a fraction of it — they
 * were written as px for an 828px row (Full width at 1:1 on a 1280 window), and Full width is now the 1200px desktop page.
 * A pull meant to WRAP the neighbour is 0.6 of the row, not 0.51: past the neighbour's floor the edge holds for `WRAP_PULL`
 * (24 SCREEN px — a wobble of the hand is not a structural edit), and 0.51 overshot by 15 screen px on a phone's 0.25 (E2-11).
 */
const rowOf = async (page: Page) => { const l = await widthOf(page, "L"); return l.box.width / (l.pct / 100); };

const noSidewaysScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

test.describe("two blocks sharing a line", () => {
  test("dragging the boundary moves it — the neighbour gives up exactly what you take", async ({ page }) => {
    await seedPair(page);
    expect(await select(page, "L")).toBe(true);
    const before = await widthOf(page, "L");
    await dragHandle(page, "Resize right edge", 0.24 * (await rowOf(page)));

    const l = await widthOf(page, "L"), r = await widthOf(page, "R");
    expect(l.pct, "the block you dragged got wider").toBeGreaterThan(before.pct + 10);
    expect(r.pct, "the neighbour gave up the same space").toBeLessThan(50 - 10);
    expect(l.pct + r.pct, "and the line stays exactly full").toBeGreaterThan(99);
    expect(l.pct + r.pct).toBeLessThan(101);
    expect(await noSidewaysScroll(page), "nothing spills off the page").toBe(true);
  });

  test("the edge you grab is the only one that moves", async ({ page }) => {
    // Rule 19, on the axis where it had never been held: the LEFT edge of the block being widened must not
    // shift, and the RIGHT edge of the pair must not move either.
    await seedPair(page);
    expect(await select(page, "L")).toBe(true);
    const l0 = await widthOf(page, "L"), r0 = await widthOf(page, "R");
    const pairRight0 = r0.box.x + r0.box.width;

    await dragHandle(page, "Resize right edge", 0.24 * (await rowOf(page)));
    const l1 = await widthOf(page, "L"), r1 = await widthOf(page, "R");
    // FIRST that something happened at all. "Only the grabbed edge moved" is trivially satisfied by a drag
    // that moves nothing, which is exactly the defect this file exists for — a mutation run proved this test
    // passed against the old inert clamp until this line was added.
    expect(l1.box.width - l0.box.width, "the grabbed edge actually moved").toBeGreaterThan(150);
    expect(Math.abs(l1.box.x - l0.box.x), "the left edge stayed put").toBeLessThan(2);
    expect(Math.abs((r1.box.x + r1.box.width) - pairRight0), "the far edge of the pair stayed put").toBeLessThan(2);
  });

  test("dragging the RIGHT block's left edge does the same, mirrored", async ({ page }) => {
    await seedPair(page);
    expect(await select(page, "R")).toBe(true);
    await dragHandle(page, "Resize left edge", -0.24 * (await rowOf(page)));

    const l = await widthOf(page, "L"), r = await widthOf(page, "R");
    expect(r.pct, "the block you dragged got wider").toBeGreaterThan(60);
    expect(l.pct, "the block before it gave up the space").toBeLessThan(40);
    expect(l.pct + r.pct, "the line stays full").toBeGreaterThan(99);
    expect(await noSidewaysScroll(page), "nothing spills off the page").toBe(true);
  });

  test("narrowing it again brings the neighbour back to the line, at the width it had", async ({ page }) => {
    /**
     * THE REVERSE OF THE WRAP, which is the whole reason the wrap is visual rather than structural.
     *
     * The first version moved the neighbour into a new band in the tree. That worked once and could not be
     * undone: reverse the drag and there is nothing to reverse, because the tree no longer recorded that
     * the two had ever shared a line. Now the widths simply stop fitting on one line and the band's own
     * wrapping does it — so narrowing brings the neighbour back with nothing remembered.
     */
    await seedPair(page);
    expect(await select(page, "L")).toBe(true);

    await dragHandle(page, "Resize right edge", 0.6 * (await rowOf(page)));           // push R onto its own line
    const wrapped = await widthOf(page, "R");
    expect(wrapped.box.y, "R is below L").toBeGreaterThan((await widthOf(page, "L")).box.y + 100);

    // Pulled back far enough that the two genuinely FIT on one line again. They come back when they fit and
    // not a moment before, which is the honest behaviour of a wrapping row: at 51% + 50% there is still no
    // room, so R would rightly stay below. This is a measurement of the rule, not a tolerance.
    //
    // DECIDED 2026-09-26 (the user, with a screenshot of the hole it used to leave): the neighbour comes back as soon
    // as it fits and FILLS the rest of the line — it no longer waits at its old width with empty space beside it.
    // Narrowed PAST where it started, L leaves more room, so R is wider than its old 50% and the line is full.
    await dragHandle(page, "Resize right edge", -0.57 * (await rowOf(page)));
    const l = await widthOf(page, "L"), r = await widthOf(page, "R");
    expect(Math.abs(r.box.y - l.box.y), "R is back on L's line").toBeLessThan(4);
    expect(l.pct + r.pct, "the line is FULL — no hole at its end").toBeGreaterThan(99.5);
    expect(l.pct + r.pct, "…and does not overflow").toBeLessThanOrEqual(100.5);

    // Rule 7 — back to EXACTLY where it started, and the pair is exactly what it was.
    // L's right edge back to the middle of the row: the row is L's drawn width ÷ its share.
    const h = (await page.locator('[aria-label="Resize right edge"]').first().boundingBox())!;
    // aim the EDGE, not the handle's centre: the handle sits outside the block (c-21), so its centre is a few px past it (L4-u)
    void h; await dragHandle(page, "Resize right edge", (l.box.x + l.box.width * (50 / l.pct)) - (l.box.x + l.box.width));
    const l2 = await widthOf(page, "L"), r2 = await widthOf(page, "R");
    expect(Math.abs(l2.pct - 50), `L back at 50 (got ${l2.pct})`).toBeLessThanOrEqual(0.3);
    expect(Math.abs(r2.pct - 50), `R back at 50 (got ${r2.pct})`).toBeLessThanOrEqual(0.3);

    const bands = await page.evaluate(() => {
      const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
      return ((site.pages[0].root.children as Record<string, unknown>[]) ?? []).length;
    });
    expect(bands, "and it never became a second band — nothing was moved").toBe(1);
  });

  test("after the neighbour wraps, the block can still be narrowed — step by step", async ({ page }) => {
    /**
     * WIDENING MUST NOT BE A ONE-WAY DOOR, and it was.
     *
     * Once the neighbour wrapped away, the block was alone on the FIRST line — so "a block alone on its
     * line fills that line" applied to it and it grew to the full row whatever its stored width said.
     * Narrowing then changed the number and nothing on screen: 100% → 88.43% while it still rendered 864px.
     * The next drag measured that same inflated edge, produced the same answer, and it could never be
     * narrowed again. Measured: five successive drags, all five stuck at 88.43%.
     *
     * The fill belongs only to a line something was PUSHED onto. The first line is where the user is
     * working and has to show the width they set.
     */
    await seedPair(page);
    expect(await select(page, "L")).toBe(true);
    await dragHandle(page, "Resize right edge", 0.6 * (await rowOf(page)));
    expect((await widthOf(page, "R")).box.y, "R wrapped below").toBeGreaterThan((await widthOf(page, "L")).box.y + 100);

    const seen: number[] = [];
    for (let i = 0; i < 5; i++) {
      expect(await select(page, "L")).toBe(true);
      await dragHandle(page, "Resize right edge", -0.12 * (await rowOf(page)));
      seen.push((await widthOf(page, "L")).box.width);
    }
    // Every step moved, and always in the same direction. A single stuck value repeated is the defect.
    for (let i = 1; i < seen.length; i++) {
      expect(seen[i], `step ${i + 1} narrowed further (${seen.map((n) => Math.round(n)).join(" → ")})`)
        .toBeLessThan(seen[i - 1] - 40);
    }
    // …and by the end the neighbour has come home and FILLS the rest of the line — no hole beside it (decided
    // 2026-09-26: it used to wait at its old 50% with empty space at the end of the line).
    const l = await widthOf(page, "L"), r = await widthOf(page, "R");
    expect(Math.abs(r.box.y - l.box.y), "R is back on the first row").toBeLessThan(4);
    expect(l.pct + r.pct, "the line is full — no hole").toBeGreaterThan(99.5);
    expect(l.pct + r.pct).toBeLessThanOrEqual(100.5);
  });

  test("keep pulling wraps the neighbour on a canvas drawn small too — a tablet's, a phone's, a zoomed-out one (E2-11)", async ({ page }) => {
    // The pull past the floor was measured on a width CAPPED at the line's end, against a 24-SCREEN-px margin: once the canvas
    // was drawn under ~600px that margin was more than the floor left, and the neighbour could never wrap. Zoomed out as a
    // person does (Ctrl −) so the desktop project draws it small as well — at 0.69 the old code passed.
    await seedPair(page);
    expect(await select(page, "L")).toBe(true);
    for (let i = 0; i < 4 && (await scaleOf(page)) > 0.4; i++) { await page.keyboard.press("Control+Minus"); await page.waitForTimeout(300); }
    const row = await rowOf(page);
    expect(row * (await scaleOf(page)), "the precondition: the line is drawn under 600 screen px").toBeLessThan(600);
    await dragHandle(page, "Resize right edge", 0.6 * row);
    const l = await widthOf(page, "L"), r = await widthOf(page, "R");
    expect(r.box.y, "R wrapped below").toBeGreaterThan(l.box.y + 100);
    expect(l.pct, "and L took the whole line").toBeGreaterThan(99);
  });

  test("a block alone on its line fills that line", async ({ page }) => {
    // The other half of what wrapping has to do: dropped onto a line of its own, the neighbour spreads to
    // fill it rather than sitting at half width with empty space beside it.
    await seedPair(page);
    expect(await select(page, "L")).toBe(true);
    await dragHandle(page, "Resize right edge", 0.6 * (await rowOf(page)));

    const l = await widthOf(page, "L"), r = await widthOf(page, "R");
    expect(r.box.y, "R wrapped below").toBeGreaterThan(l.box.y + 100);
    expect(r.box.width, "…and took the whole line it landed on").toBeGreaterThan(l.box.width - 4);
  });

  test("keep pulling and the neighbour moves to the next line, KEEPING its width", async ({ page }) => {
    // The decision this encodes: the neighbour's width is something the user chose, and being moved to
    // another line is not a reason to discard it. It arrives in a band of its own, still 50% wide.
    await seedPair(page);
    expect(await select(page, "L")).toBe(true);
    await dragHandle(page, "Resize right edge", 0.6 * (await rowOf(page)));

    const l = await widthOf(page, "L"), r = await widthOf(page, "R");
    expect(l.pct, "the dragged block took the whole line").toBeGreaterThan(99);
    expect(r.pct, "and the neighbour kept the STORED width it had").toBe(50);
    expect(r.box.y, "…on a line of its own, below").toBeGreaterThan(l.box.y + l.box.height - 2);

    // NOTHING MOVED IN THE TREE. This asserted the opposite until the wrap was made visual: the neighbour
    // used to be lifted into a second band, which worked once and could never be undone. One band, two
    // children, two lines — the lines are the layout's doing, not the tree's.
    const bands = await page.evaluate(() => {
      const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
      return ((site.pages[0].root.children as Record<string, unknown>[]) ?? [])
        .map((b) => ((b.children as Record<string, unknown>[]) ?? []).map((c) => c.id as string));
    });
    expect(bands, "still ONE band holding both — the second line is visual").toEqual([["L", "R"]]);
    expect(await noSidewaysScroll(page), "and the page is not broken by it").toBe(true);
  });

  test("a block whose line has room to spare can still be made NARROWER", async ({ page }) => {
    /**
     * THE REGRESSION THIS EXISTS FOR, and it lasted minutes rather than months only because someone was
     * using the builder at the time.
     *
     * "A block alone on its line fills it" was first written as an unconditional `flex-grow: 1` on every
     * child of a band. That looks equivalent and is not: grow spends whatever is LEFT OVER on a line, and
     * narrowing a block is precisely how a line comes to have space left over. So the space a drag freed
     * was handed straight back, and no block could be made narrower once its line stopped being full.
     *
     * Not one test caught it — every one of them resized a block on a FULL line, where there is no leftover
     * space and grow is a no-op. The case that breaks is the one nobody had built a fixture for.
     */
    await seedSite(page, sitePage([
      { id: "L", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 160, background: "#c7d2fe", children: [] },
      { id: "R", type: "container", direction: "column", padding: 0, gap: 0, width: "25%", minHeight: 160, background: "#a5b4fc", children: [] },
    ]));
    await page.waitForSelector('[data-box-id="L"]', { timeout: 15000 });
    await page.waitForTimeout(350);
    expect(await select(page, "L")).toBe(true);

    const before = await widthOf(page, "L");
    await dragHandle(page, "Resize right edge", -0.19 * (await rowOf(page)));
    const after = await widthOf(page, "L");
    expect(after.box.width, "it actually got narrower on screen").toBeLessThan(before.box.width - 100);
    expect(after.pct, "…and the stored width came down with it").toBeLessThan(before.pct - 10);
  });

  test("a resize raises no console error", async ({ page }) => {
    // `Maximum update depth exceeded`, traced to ChromeMirror's measuring effect. Both inner components in
    // the canvas carried a guard against it and neither could run, because a component declared inside
    // another is remounted every render — which resets refs and re-runs effects whatever their deps say.
    // A resize is the one time geometry changes every frame, so it is the only time it showed.
    const errs: string[] = [];
    page.on("pageerror", (e) => errs.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    // A console "Failed to load resource" names no URL — this does, so a failure says WHAT was missing.
    page.on("response", (r) => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url()}`); });

    await seedPair(page);
    expect(await select(page, "L")).toBe(true);
    await dragHandle(page, "Resize right edge", 0.18 * (await rowOf(page)));
    await dragHandle(page, "Resize right edge", -0.145 * (await rowOf(page)));
    await page.waitForTimeout(400);

    expect(errs.filter((e) => /Maximum update depth/i.test(e)), "no render loop").toEqual([]);
    expect(errs, "no console errors at all during a resize").toEqual([]);
  });
});
