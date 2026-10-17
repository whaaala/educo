import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * BATCH L-5 · RESIZE ROUND TRIPS — every gesture out and back comes home.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature (the L-5 scenarios). Every shape here was first
 * REPRODUCED THROUGH THE UI (`scripts/uat/probe-l5.js`, RULE Y); the seed only pins that geometry so it cannot come back.
 *   #42   a height dragged out and back left a floor nobody chose (`minHeight: 131.77` where there was none)
 *   L4-l  a corner dragged in and back left a Heading 61px taller — the drag back started from its WRAPPED height
 *   #84   a left edge stopped at a fixed 14rem against a neighbour sized by hand to less
 *   E2-22 the edge between the two blocks of a Side by side found no partner (each was in a band of its own)
 *   L5-5  the release built on the tree from before the last move, and committed the drag one frame short
 */
const stored = (page: Page, id: string) => page.evaluate((id) => {
  const s = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}"); let n: Record<string, unknown> | null = null;
  const w = (x: Record<string, unknown>) => { if (x.id === id) n = x; ((x.children as Record<string, unknown>[]) ?? []).forEach(w); };
  w(s.pages[0].root); return n as unknown as { width?: string; minHeight?: number; widthByHand?: boolean; alignSelf?: string } | null;
}, id);
const scaleOf = (page: Page) => page.evaluate(() => Number(document.querySelector<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale) || 1);
const pageRect = (page: Page, id: string) => page.locator(`[data-box-id="${id}"]`).evaluate((el) => {
  const f = el.closest<HTMLElement>("[data-canvas-scale]")!, s = Number(f.dataset.canvasScale) || 1, r = el.getBoundingClientRect(), o = f.getBoundingClientRect();
  return { left: (r.left - o.left) / s, right: (r.right - o.left) / s, top: (r.top - o.top) / s, width: r.width / s, height: r.height / s };
});
async function select(page: Page, id: string, fx = 0.25, fy = 0.5) {
  for (let i = 0; i < 5; i++) {
    if (await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null) === id) return;
    const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
    await page.mouse.click(b.x + b.width * fx, b.y + b.height * fy); await page.waitForTimeout(180);
  }
  throw new Error(`could not select ${id}`);
}
/** Drag a handle of the selected block by (dx, dy) PAGE px, in steps. */
async function drag(page: Page, label: string, dx: number, dy: number) {
  const s = await scaleOf(page), h = (await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox())!;
  const x = h.x + h.width / 2, y = h.y + h.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(x + (dx * s * i) / 10, y + (dy * s * i) / 10); await page.waitForTimeout(12); }
  await page.mouse.up(); await page.waitForTimeout(450);
}
async function open(page: Page, children: unknown[]) {
  await page.setViewportSize({ width: 1240, height: 820 }); // a laptop window: the Desktop page is drawn SCALED, where these were found
  await seedSite(page, sitePage(children));
  await page.waitForSelector("[data-box-id]", { timeout: 15000 });
  await page.getByRole("button", { name: "Desktop (1280px)" }).first().click(); await page.waitForTimeout(600);
  // the words' width is what a hug comes back to: measured before the web font arrived, the start and the end were two fonts (1 run in 52 under load)
  await page.evaluate(() => document.fonts.ready);
}
const headingInStack = [{ id: "S", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", children: [{ id: "H", type: "heading", text: "Open day" }] }];

test.describe("L-5 · a height and a corner come home", () => {
  test("#42: a bottom edge out 60 and back stores no floor — in two drags and in one", async ({ page }) => {
    await open(page, headingInStack); await select(page, "H");
    const h0 = (await pageRect(page, "H")).height;
    await drag(page, "bottom edge", 0, 60);
    expect((await pageRect(page, "H")).height, "the edge moved (precondition)").toBeGreaterThan(h0 + 40);
    await drag(page, "bottom edge", 0, -60);
    expect(Math.abs((await pageRect(page, "H")).height - h0), "the height comes back").toBeLessThan(1);
    expect((await stored(page, "H"))?.minHeight, "and no floor is left behind").toBeUndefined();
  });

  for (const [corner, dx, dy] of [["top-right corner", -40, 20], ["top-left corner", 40, 20], ["bottom-right corner", -40, -20], ["bottom-left corner", 40, -20]] as const) {
    test(`L4-l: the ${corner} inward and back`, async ({ page }) => {
      await open(page, headingInStack); await select(page, "H");
      const r0 = await pageRect(page, "H");
      await drag(page, corner, dx, dy);
      expect((await pageRect(page, "H")).height, "narrower than its words, the heading wraps (precondition)").toBeGreaterThan(r0.height + 10);
      await drag(page, corner, -dx, -dy);
      const r2 = await pageRect(page, "H"), n = await stored(page, "H");
      if (process.env.DBG) console.log(corner, JSON.stringify(r0), JSON.stringify(r2), JSON.stringify(n));
      expect(Math.abs(r2.height - r0.height), "its height comes back — not the wrapped height plus the drag").toBeLessThan(1);
      expect(Math.abs(r2.width - r0.width)).toBeLessThan(1);
      expect(n?.minHeight, "no floor left").toBeUndefined();
    });
  }
});

const col = (id: string, width: string, extra: Record<string, unknown> = {}) => ({ id, type: "container", direction: "column", padding: 0, gap: 0, width, minHeight: 160, background: "#c7d2fe", children: [], ...extra });

test.describe("L-5 · a line's edges", () => {
  test("#84: a left edge squeezes a neighbour sized by hand below 14rem, down to ITS floor", async ({ page }) => {
    await open(page, [col("A", "16.66%", { widthByHand: true }), col("B", "50%", { widthByHand: true }), col("C", "33.34%")]);
    const a0 = (await pageRect(page, "A")).width;
    expect(a0, "below 14rem (precondition)").toBeLessThan(224);
    await select(page, "B", 0.5, 0.25);
    await drag(page, "left edge", -80, 0);
    const a1 = (await pageRect(page, "A")).width;
    expect(a0 - a1, "the edge moved and the neighbour gave").toBeGreaterThan(60);
    expect(a1, "…never below its own 3rem floor").toBeGreaterThanOrEqual(47);
  });

  test("E2-22: the edge between the two blocks of a Side by side moves, and comes back", async ({ page }) => {
    await open(page, [{ id: "SBS", type: "container", direction: "row", wrap: true, padding: 0, gap: 0, width: "100%", children: [col("A", "50%"), col("B", "50%")] }]);
    const a0 = await pageRect(page, "A"), b0 = await pageRect(page, "B");
    await select(page, "A");
    await drag(page, "right edge", 120, 0);
    const a1 = await pageRect(page, "A"), b1 = await pageRect(page, "B");
    expect(a1.width - a0.width, "the shared edge moved").toBeGreaterThan(100);
    expect(Math.abs(b1.right - b0.right), "the far edge stayed").toBeLessThan(1);
    await drag(page, "right edge", -120, 0);
    expect(Math.abs((await pageRect(page, "A")).width - a0.width), "home").toBeLessThan(1);
    expect(Math.abs((await pageRect(page, "B")).left - b0.left), "no hole").toBeLessThan(1);
  });

  test("L5-5: the last move before the release is the one committed", async ({ page }) => {
    await open(page, [col("L", "50%"), col("R", "50%")]);
    await select(page, "L");
    const s = await scaleOf(page), h0 = (await pageRect(page, "L")).height;
    // (the gesture listens on `document`, as `followGesture` does)
    // the last move and the release in ONE task: no frame renders between them, which is when the release read a stale tree
    await page.evaluate((dy) => {
      const h = document.querySelector<HTMLElement>('[aria-label="Resize bottom edge"]')!, r = h.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2, o = { bubbles: true, cancelable: true, button: 0, clientX: x };
      h.dispatchEvent(new MouseEvent("mousedown", { ...o, clientY: y, buttons: 1 }));
      document.dispatchEvent(new MouseEvent("mousemove", { ...o, clientY: y + dy, buttons: 1 }));
      document.dispatchEvent(new MouseEvent("mouseup", { ...o, clientY: y + dy }));
    }, 80 * s);
    await page.waitForTimeout(500);
    expect((await pageRect(page, "L")).height - h0, "the drag landed where the pointer let go").toBeGreaterThan(70);
  });
});

/**
 * Found by L-5's first HEADED pass (`scripts/uat/uat-l5-headed.js`) and diagnosed through the UI (`probe-l5b.js`) before each fix.
 *   L5-8   a left edge out and back left a 1.66px gap and the words wrapped
 *   L5-10  a block STRETCHED by its row kept its stretched height as a floor after a round trip
 *   L5-11  the drag pinned `marginTop: 0` on a block that had no margin, and a hugging width came back as no width, not "auto"
 *   L5-12  after selecting a block by its words and dragging an edge, Ctrl+Z did nothing (the caret was still in the words)
 *   L5-13  the block BELOW a bottom edge kept the floor the drag handed it
 *   L5-14  a neighbour's left edge squeezed a label column under its words, and the page row stepped every column onto a line of its own
 */
test.describe("L-5 · what the first headed pass found", () => {
  test("L5-8 / L5-11: a Heading's left edge 40 in and back — no hairline gap, the words on one line, nothing new stored", async ({ page }) => {
    await open(page, [{ id: "S", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", children: [{ id: "H", type: "heading", text: "Open day", width: "auto" }] }]);
    await select(page, "H");
    const r0 = await pageRect(page, "H");
    await drag(page, "left edge", 40, 0); await drag(page, "left edge", -40, 0);
    const r = await pageRect(page, "H"), n = await stored(page, "H") as Record<string, unknown>;
    expect(Math.abs(r.height - r0.height), "the words are back on one line").toBeLessThan(0.5);
    expect(n.marginLeftPct, "no hairline gap stored").toBeUndefined();
    expect(n.width, "it hugs its words as it did — \"auto\"").toBe("auto");
    expect(n.marginTop, "no margin pinned").toBeUndefined();
  });

  test("L5-10: a block stretched by its row, its bottom edge out and back, keeps no floor", async ({ page }) => {
    await open(page, [col("L", "50%", { minHeight: 240 }), col("R", "50%", { minHeight: undefined })]);
    const h0 = (await pageRect(page, "R")).height;
    expect(h0, "R is stretched by its row (precondition)").toBeGreaterThan(200);
    await select(page, "R");
    await drag(page, "bottom edge", 0, 60); await drag(page, "bottom edge", 0, -60);
    expect(Math.abs((await pageRect(page, "R")).height - h0)).toBeLessThan(1);
    expect((await stored(page, "R"))?.minHeight, "no floor holds it — the row does").toBeUndefined();
  });

  test("L5-13: the block below a bottom corner keeps no floor after the round trip", async ({ page }) => {
    await open(page, [{ id: "S", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", children: [{ id: "H", type: "heading", text: "Open day", width: "auto" }, { id: "T", type: "text", text: "Visit us on Saturday", width: "auto" }] }]);
    await select(page, "H");
    await drag(page, "bottom-right corner", -40, -20); await drag(page, "bottom-right corner", 40, 20);
    expect((await stored(page, "T"))?.minHeight, "the Text below was handed a floor on the way out — gone on the way back").toBeUndefined();
  });

  test("L5-12: a block selected by its words, an edge dragged — Ctrl+Z undoes the drag", async ({ page }) => {
    await open(page, headingInStack);
    const b = (await page.locator('[data-box-id="H"]').boundingBox())!;
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(250);
    if (await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id")) !== "H") { await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(250); }
    const h0 = (await pageRect(page, "H")).height;
    await drag(page, "bottom edge", 0, 50);
    expect((await pageRect(page, "H")).height, "it grew (precondition)").toBeGreaterThan(h0 + 30);
    await page.keyboard.press("Control+z"); await page.waitForTimeout(500);
    expect(Math.abs((await pageRect(page, "H")).height - h0), "Ctrl+Z undid it").toBeLessThan(1);
  });

  test("L5-14: a left edge never squeezes a column under its own words — the row stays one line", async ({ page }) => {
    const wc = (id: string, w: string, extra: Record<string, unknown> = {}) => ({ ...col(id, w, extra), minHeight: undefined, children: [{ id: `${id}t`, type: "text", text: "Admissions information", width: "auto" }] });
    await open(page, [wc("A", "12%", { widthByHand: true }), wc("B", "54.66%", { widthByHand: true }), wc("C", "33.34%")]);
    await select(page, "B", 0.9, 0.5);
    await drag(page, "left edge", -400, 0);
    const tops = await Promise.all(["A", "B", "C"].map(async (x) => Math.round((await pageRect(page, x)).top)));
    expect(new Set(tops).size, `B and C are still beside A, not on lines of their own (tops ${tops.join(" / ")})`).toBe(1);
  });
});

test.describe("L-5 · what the second headed pass found", () => {
  test("L5-11: a Heading's top corner in and back leaves no margin of 0 behind", async ({ page }) => {
    await open(page, headingInStack); await select(page, "H");
    await drag(page, "top-right corner", -40, 20); await drag(page, "top-right corner", 40, -20);
    expect((await stored(page, "H")) as Record<string, unknown>, "nothing stored that was not there").not.toHaveProperty("marginTop");
  });

  test("L5-13: a bottom edge OUT and back — the block below is home too, no floor, the page its height", async ({ page }) => {
    await open(page, [{ id: "S", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", children: [{ id: "H", type: "heading", text: "Open day", width: "auto" }, { id: "T", type: "text", text: "Visit us on Saturday", width: "auto" }] }]);
    await select(page, "H");
    const s0 = (await pageRect(page, "S")).height, t0 = (await pageRect(page, "T")).height;
    await drag(page, "bottom edge", 0, 30); await drag(page, "bottom edge", 0, -30);
    expect((await stored(page, "T"))?.minHeight, "the Text keeps no floor").toBeUndefined();
    expect(Math.abs((await pageRect(page, "T")).height - t0), "the Text is its height").toBeLessThan(1);
    expect(Math.abs((await pageRect(page, "S")).height - s0), "the column is its height").toBeLessThan(1);
  });
});

test.describe("L-5 · L5-2 a line dragged back is what it was", () => {
  test("a width round trip stores what was there — and on a phone the row still stacks, like its untouched twin", async ({ page }) => {
    const wc = (id: string) => ({ ...col(id, "50%"), minHeight: undefined, children: [{ id: `${id}t`, type: "text", text: "Admissions information", width: "auto" }] });
    await open(page, [wc("A"), wc("B")]);
    await select(page, "A", 0.9, 0.5);
    for (let i = 0; i < 2; i++) await drag(page, "right edge", 120, 0);
    for (let i = 0; i < 2; i++) await drag(page, "right edge", -120, 0);
    for (const id of ["A", "B"]) {
      const n = await stored(page, id) as Record<string, unknown>;
      expect(n.width, `${id}: the share it had`).toBe("50%");
      expect(n.widthByHand, `${id}: not "sized by hand" — its floor is still 14rem`).toBeUndefined();
    }
    await page.getByRole("button", { name: "Mobile (375px)" }).first().click(); await page.waitForTimeout(600);
    expect(Math.round((await pageRect(page, "B")).top), "on a phone the two stack, as an untouched row does").toBeGreaterThan(Math.round((await pageRect(page, "A")).top));
  });
});
