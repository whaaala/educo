import { test, expect, type Page } from "@playwright/test";

/**
 * THE SAME RULES, IN EVERY ARRANGEMENT — Rule A, capability parity.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Everything settled on 2026-09-26 was settled by driving ONE arrangement: a stack beside a stack. Rule A
 * says a capability built for one component is the baseline for every component where it applies, and the
 * day's history says why that needs asserting rather than assuming — three separate reports were
 * unreproducible across six shapes written by hand, because the real product puts wrappers, widths and
 * stored fields in the tree that no hand-written seed had.
 *
 * So the arrangements here are BUILT THROUGH THE INTERFACE (RULE Y): the blocks panel is opened and the
 * tiles are clicked, exactly as a user builds. Nothing is seeded. What the drop pipeline produces is what
 * gets tested, including any wrapper it decides to add.
 *
 * TWO INVARIANTS, and they are the ones the user states:
 *   • the edge you did NOT grab does not move (RULE 19);
 *   • a gesture opens space at the edge it was made on, and nowhere else.
 */

/** Every container kind the palette offers that can hold other blocks. */
const KINDS = ["Stack", "Side by side", "Grid"] as const;

const openPanel = async (page: Page) => {
  await page.getByRole("button", { name: "Open blocks panel" }).click();
  await page.waitForTimeout(700);
};
const closePanel = async (page: Page) => {
  await page.getByRole("button", { name: "Close blocks panel" }).click();
  await page.waitForTimeout(500);
};

/** Click a palette tile — the user's own route: select a block, click a tile, it lands after it. */
const clickTile = async (page: Page, text: string) => {
  await page.evaluate((t) => {
    const tile = Array.from(document.querySelectorAll<HTMLElement>('[draggable="true"]'))
      .find((e) => (e.textContent || "").trim().startsWith(t));
    if (!tile) throw new Error(`no tile ${t}`);
    tile.click();
  }, text);
  await page.waitForTimeout(800);
  // A tile that asks first is ANSWERED, as a person answers it (E5a-17): the Grid tile opens its layout picker, and left unanswered
  // no grid was ever added — "Grid in a stack" tested two stacks — while the picker hung open over the panel.
  const shape = page.locator('[role="menu"][aria-label="Choose a layout"] [aria-label="2 across, 1 down"]');
  if (await shape.isVisible().catch(() => false)) { await shape.click(); await page.waitForTimeout(800); }
};

const leaves = (page: Page) => page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>("[data-box-id]"))
  .map((e) => {
    const r = e.getBoundingClientRect();
    return { id: e.getAttribute("data-box-id")!, l: Math.round(r.left), t: Math.round(r.top), b: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width) };
  })
  .filter((o) => o.h > 8)
  .sort((a, z) => a.t - z.t || a.l - z.l));


const dragEdge = async (page: Page, label: string, dy: number) => {
  const h = await page.locator(`[aria-label="${label}"]`).boundingBox();
  if (!h) return false;
  const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 14; i++) { await page.mouse.move(cx, cy + (dy * i) / 14); await page.waitForTimeout(14); }
  await page.mouse.up();
  await page.waitForTimeout(800);
  return true;
};

test.describe("every arrangement obeys the same rules", () => {
  for (const kind of KINDS) {
    test(`${kind} in a stack · the anchored edge never moves`, async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 1000 });
      const errs: string[] = [];
      page.on("pageerror", (e) => errs.push(e.message.split("\n")[0]));
      await page.addInitScript(() => { try { localStorage.clear(); sessionStorage.clear(); } catch { /* private mode */ } });
      await page.goto("/website/box-demo", { waitUntil: "load" });
      await page.waitForTimeout(2500);

      // BUILT, not seeded: a stack, then this kind after it, then a stack after that — so the block under
      // test has a neighbour on each side and both a joined and an outer edge exist on the page.
      await openPanel(page);
      await clickTile(page, "Stack");
      await clickTile(page, kind);
      await clickTile(page, "Stack");
      await closePanel(page);

      const built = await leaves(page);
      expect(built.length, `${kind} did not produce a page`).toBeGreaterThanOrEqual(3);

      /**
       * CLICK, THEN RESIZE WHATEVER GOT SELECTED — because that is what a person does, and because insisting
       * on a particular id cannot work here: a second click on the same spot DRILLS INWARD by design, so a
       * loop that waits for one id to come up either lands immediately or never.
       */
      const aim = built[Math.floor(built.length / 2)];
      await page.mouse.click(aim.l + 40, aim.t + 14);
      await page.waitForTimeout(400);
      const selId = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
      expect(selId, `clicking inside the ${kind} selected nothing`).not.toBeNull();

      const before = await leaves(page);
      const b0 = before.find((o) => o.id === selId)!;
      expect(b0, `the selected block ${selId} has no box on the page`).toBeTruthy();

      // DOWN on the bottom edge: the block grows, and its TOP must not move.
      const dragged = await dragEdge(page, "Resize bottom edge", 90);
      expect(dragged, "no bottom handle — this case would pass on a broken build").toBe(true);

      const after = await leaves(page);
      const b1 = after.find((o) => o.id === selId)!;

      expect(b1.h - b0.h, "the drag did nothing").toBeGreaterThan(40);
      expect(Math.abs(b1.t - b0.t), `the ANCHORED top edge moved ${b1.t - b0.t}px`).toBeLessThan(4);

      /**
       * …AND NOTHING ABOVE IT WAS SQUEEZED TO PAY FOR IT. This is the fault the user reported on their own
       * page: a `fill` block above the dragged one collapsed 61 → 0, so the growth came out of a neighbour
       * and the anchored edge moved with it. Asserted on the blocks ABOVE, because that is where it is paid
       * from, and the dragged block's own height was correct throughout the fault.
       */
      for (const o of before.filter((x) => x.b <= b0.t + 2)) {
        const now = after.find((x) => x.id === o.id);
        if (!now) continue;
        expect(now.h, `${o.id} above it was squeezed from ${o.h} to ${now.h}`).toBeGreaterThan(o.h - 4);
      }

      expect(errs, `the page threw: ${errs[0] ?? ""}`).toHaveLength(0);
    });
  }
});

/**
 * RESIZE AS MANY TIMES AS YOU LIKE — NOTHING DEGRADES (rule 12), AND THE PAGE COMES BACK (rule 7).
 *
 * Reported as the page "fidgeting" when resized repeatedly. Measured over six round trips of the same edge,
 * +80 then −80 each time: the block BELOW the dragged one went **208 → 288 → 368 → 448 → 528 → 608** and the
 * page **464 → 864**, while the block actually being dragged sat at 128 throughout. Every cycle handed the
 * neighbour 80px that nothing ever took back.
 *
 * The cause was an asymmetry, not rounding: shrinking gave the room to the block below so no gap opened,
 * while growing pushed it down and grew the page rather than reclaiming. Each half was defensible; together
 * they were a ratchet.
 *
 * WHY SIX CYCLES AND NOT ONE. A single round trip can land back at the start by luck, and a drift of a pixel
 * per cycle is invisible until it is not. Comparing each cycle to the one before is what turns "it looks
 * fine" into an assertion — and the geometry of the WHOLE page is compared, because the dragged block was
 * the one thing that never moved while everything around it did.
 */
test.describe("resizing over and over changes nothing", () => {
  test("six round trips of the same edge return the page to exactly where it started", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    const errs: string[] = [];
    page.on("pageerror", (e) => errs.push(e.message.split("\n")[0]));
    await page.addInitScript(() => { try { localStorage.clear(); sessionStorage.clear(); } catch { /* private mode */ } });
    await page.goto("/website/box-demo", { waitUntil: "load" });
    await page.waitForTimeout(2500);

    await openPanel(page);
    await clickTile(page, "Stack");
    await clickTile(page, "Stack");
    await clickTile(page, "Stack");
    await closePanel(page);

    // In PAGE px, unrounded, each value within half a px of the start (E-2): rounded SCREEN px on a canvas drawn at 0.69 flipped
    // 226 → 227 on a sub-pixel — the same ±0.5 a 1:1 integer comparison always allowed. Compared with the START every cycle, so a
    // ratchet still adds up past it within six.
    const shape = () => page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>("[data-box-id]"))
      .map((e) => { const z = Number(e.closest<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale) || 1, r = e.getBoundingClientRect(); return { id: e.getAttribute("data-box-id")!, t: r.top / z, h: r.height / z }; }));
    const same = (a: { id: string; t: number; h: number }[], b: typeof a) => a.length === b.length && a.every((x, i) => x.id === b[i].id && Math.abs(x.t - b[i].t) <= 0.5 && Math.abs(x.h - b[i].h) <= 0.5);
    const show = (s: { id: string; t: number; h: number }[]) => s.map((x) => `${x.id}:${x.t.toFixed(1)},${x.h.toFixed(1)}`).join("|");

    const built = await leaves(page);
    expect(built.length, "the page did not build").toBeGreaterThanOrEqual(3);
    const aim = built[1];
    await page.mouse.click(aim.l + 40, aim.t + 14);
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null),
      "clicking a block selected nothing").not.toBeNull();

    const start = await shape();
    for (let cycle = 1; cycle <= 6; cycle++) {
      expect(await dragEdge(page, "Resize bottom edge", 80), `no handle on cycle ${cycle}`).toBe(true);
      expect(await dragEdge(page, "Resize bottom edge", -80), `no handle back on cycle ${cycle}`).toBe(true);
      const now = await shape();
      expect(same(now, start), `the page did not return to where it started after ${cycle} round trip(s): ${show(now)} from ${show(start)}`).toBe(true);
    }

    expect(errs, `the page threw: ${errs[0] ?? ""}`).toHaveLength(0);
  });
});
