import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * RESIZING NEVER LEAVES A GAP BETWEEN TWO STACKS — and only an OUTER edge may open one.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * The rule, in the user's words after three rounds of screenshots: *"make sure I have no unwanted spaces when
 * I'm adding stack… the only thing that should always have space is when I'm moving a stack on the far left
 * when there's no other stack next to it"* — and the same at the right, the top and the bottom.
 *
 * So it is eight cases, not one: each of the four edges, with a neighbour beyond it and without. They are
 * ENUMERATED rather than written out, because the bug that produced this file was found in the one case
 * nobody had tried — and a matrix cannot quietly omit a corner the way a list of hand-written tests can.
 *
 * Every assertion is GEOMETRY measured in a browser. A test that read the stored width would have passed
 * throughout the fault it exists to catch: the widths were arithmetically right and the row still broke.
 */

/** Two stacks one above the other, beside a taller column — so the column has room to give. */
const vertical = (): unknown[] => [
  { id: "side", type: "container", direction: "column", padding: 0, gap: 0, width: "25%", minHeight: 700, background: "#a1ebc7", children: [] },
  { id: "col", type: "container", direction: "column", padding: 0, gap: 0, width: "75%", children: [
    { id: "A", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 220, background: "#8fd8f2", children: [] },
    { id: "B", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 220, background: "#d9a406", children: [] },
  ] },
];

/** Two stacks side by side, filling the row exactly. */
const horizontal = (): unknown[] => [
  { id: "A", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 320, background: "#8fd8f2", children: [] },
  { id: "B", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 320, background: "#d9a406", children: [] },
];

type Case = {
  id: string; axis: "v" | "h"; kids: () => unknown[]; target: "A" | "B";
  edge: string; dx: number; dy: number; beyond: boolean; what: string;
};

const CASES: Case[] = [
  { id: "V1", axis: "v", kids: vertical, target: "A", edge: "Resize bottom edge", dx: 0, dy: -120, beyond: true, what: "bottom edge, a stack below it" },
  { id: "V2", axis: "v", kids: vertical, target: "A", edge: "Resize top edge", dx: 0, dy: 120, beyond: false, what: "top edge, nothing above it" },
  { id: "V3", axis: "v", kids: vertical, target: "B", edge: "Resize top edge", dx: 0, dy: 120, beyond: true, what: "top edge, a stack above it" },
  { id: "V4", axis: "v", kids: vertical, target: "B", edge: "Resize bottom edge", dx: 0, dy: -120, beyond: false, what: "bottom edge, nothing below it" },
  { id: "H1", axis: "h", kids: horizontal, target: "A", edge: "Resize right edge", dx: -140, dy: 0, beyond: true, what: "right edge, a stack to its right" },
  { id: "H2", axis: "h", kids: horizontal, target: "A", edge: "Resize left edge", dx: 140, dy: 0, beyond: false, what: "left edge, nothing to its left" },
  { id: "H3", axis: "h", kids: horizontal, target: "B", edge: "Resize left edge", dx: 140, dy: 0, beyond: true, what: "left edge, a stack to its left" },
  { id: "H4", axis: "h", kids: horizontal, target: "B", edge: "Resize right edge", dx: -140, dy: 0, beyond: false, what: "right edge, nothing to its right" },
];

const boxes = (page: Page) => page.evaluate(() => {
  const g = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { left: Math.round(b.left), right: Math.round(b.right), top: Math.round(b.top), bottom: Math.round(b.bottom), w: Math.round(b.width), h: Math.round(b.height) };
  };
  return { A: g("A"), B: g("B"), band: g("band") };
});

async function select(page: Page, id: string) {
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  for (let i = 0; i < 7; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return true;
    await page.mouse.click(b.x + Math.min(40, b.width / 2), b.y + Math.min(20, b.height / 2));
    await page.waitForTimeout(200);
  }
  return false;
}

async function dragEdge(page: Page, label: string, dx: number, dy: number) {
  const h = (await page.locator(`[aria-label="${label}"]`).boundingBox())!;
  const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(cx + (dx * i) / 12, cy + (dy * i) / 12); await page.waitForTimeout(12); }
  await page.mouse.up();
  await page.waitForTimeout(700);
}

/**
 * A BOUNDARY THAT MEETS SEVERAL STACKS MOVES THEM ALL — and leaves no hole inside any of them.
 *
 * The user asked whether stacks could be "grouped" so they adjust together. They already are: two columns
 * sitting side by side live in one BAND, and the band is what a shared edge really belongs to. Writing the
 * height there does move both columns. What it did NOT do was reach the rows INSIDE a column.
 *
 * Measured before the fix, dragging the teal stack's top edge down 140px: the band went 300 → 366, the green
 * stack and the right-hand column both followed to 366, and the tan row inside that column stayed at 120 —
 * a **66px hole** between it and the teal stack below. In the user's words: *"when I decrease the height from
 * the top it creates a space at the bottom of the ones on the right"*.
 *
 * Every number here is geometry in a browser, and the hole is measured INSIDE the column — the band's own
 * edges closed correctly throughout the fault, so a test watching only those would have passed.
 */
const bandedSite = () => ({
  pages: [{
    id: "p1", name: "Home", path: "/",
    root: {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "band0", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
          { id: "HEAD", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 120, background: "#2f4858", children: [] },
        ] },
        { id: "band1", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
          { id: "L", type: "container", direction: "column", padding: 0, gap: 0, width: "30%", minHeight: 300, background: "#d5f7b8", children: [] },
          { id: "col", type: "container", direction: "column", padding: 0, gap: 0, width: "70%", children: [
            { id: "R1", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 180, background: "#b0003a", children: [] },
            { id: "R2", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 120, background: "#a9784f", children: [] },
          ] },
        ] },
        { id: "band2", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
          { id: "BOT", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 90, background: "#72d4c5", children: [] },
        ] },
      ],
    },
  }],
  homeId: "p1", version: 1,
});

const banded = (page: Page) => page.evaluate(() => {
  // In PAGE px (E-2): Full width is the desktop page drawn shrunk to fit — 300 → 396 read 325 on screen at 0.82
  const z = Number(document.querySelector<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale) || 1;
  const g = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: Math.round(b.top / z), bottom: Math.round(b.bottom / z), h: Math.round(b.height / z) };
  };
  const root = document.querySelector<HTMLElement>('[data-box-id="root"]');
  return {
    HEAD: g("HEAD")!, L: g("L")!, col: g("col")!, R1: g("R1")!, R2: g("R2")!, BOT: g("BOT")!, band1: g("band1")!,
    pageTop: root ? Math.round(root.getBoundingClientRect().top / z) : 0,
  };
});

test.describe("a shared edge that meets several stacks", () => {
  test("closing it moves every stack, and opens no hole inside a column", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await seedSite(page, bandedSite());
    await page.waitForSelector('[data-box-id="BOT"]', { timeout: 20000 });
    await page.waitForTimeout(500);

    const before = await banded(page);
    expect(await select(page, "BOT"), "the teal stack could not be selected").toBe(true);
    await dragEdge(page, "Resize top edge", 0, 140);
    const after = await banded(page);

    // The gesture did something — without this the rest would pass on a dead build.
    expect(after.band1.h - before.band1.h, "the shared boundary did not move").toBeGreaterThan(40);

    // …both columns followed it.
    expect(after.L.h - before.L.h, "the green stack did not follow the boundary").toBeGreaterThan(40);
    expect(after.col.h - before.col.h, "the right-hand column did not follow the boundary").toBeGreaterThan(40);

    // …and THIS is the one that was broken: the last row inside the column grew too, so nothing pooled at its foot.
    expect(
      after.col.bottom - after.R2.bottom,
      "a hole opened between the last row of the column and the stack below it",
    ).toBeLessThan(6);
    expect(after.band1.bottom - after.L.bottom, "a hole opened under the green stack").toBeLessThan(6);
    expect(after.BOT.top - after.band1.bottom, "a gap opened between the band and the stack below it").toBeLessThan(6);
  });

  test("dragging that edge the other way stops dead when the stacks above have nothing to give", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await seedSite(page, bandedSite());
    await page.waitForSelector('[data-box-id="BOT"]', { timeout: 20000 });
    await page.waitForTimeout(500);

    const before = await banded(page);
    expect(await select(page, "BOT"), "the teal stack could not be selected").toBe(true);
    await dragEdge(page, "Resize top edge", 0, -140);
    const after = await banded(page);

    /**
     * The band above is already at its content floor — the green stack's own height and the two rows in the
     * column both total 300 — so there is nothing to take. The edge STOPS; it does not grow out of the far
     * side, and it does not tear a gap open to pay for itself. The user's call, asked and answered.
     */
    expect(Math.abs(after.BOT.h - before.BOT.h), "the teal stack grew with nothing to take it from").toBeLessThan(6);
    expect(Math.abs(after.band1.h - before.band1.h), "the band above was squeezed below its content").toBeLessThan(6);
    expect(after.BOT.top - after.band1.bottom, "a gap opened between the band and the stack below it").toBeLessThan(6);
  });

  test("the top edge of the first stack stops at the page top rather than running away", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await seedSite(page, bandedSite());
    await page.waitForSelector('[data-box-id="BOT"]', { timeout: 20000 });
    await page.waitForTimeout(500);

    expect(await select(page, "L"), "the green stack could not be selected").toBe(true);

    /**
     * THREE gestures, not one. A single drag that stops correctly says nothing about the second: the fault
     * this guards against is a RATCHET, where each drag re-reads a page the previous one made taller and
     * grows again. Measured across three drags: 300 → 396 → 396 → 396, the header giving way to its 24px
     * floor and the edge then stopping dead. A runaway shows up here as a third number larger than the second.
     */
    const seen: number[] = [];
    for (let g = 0; g < 3; g++) {
      await dragEdge(page, "Resize top edge", 0, -260);
      const s = await banded(page);
      seen.push(s.L.h);
      expect(s.L.top, `the stack rose above the page top on drag ${g + 1}`).toBeGreaterThanOrEqual(s.pageTop - 2);
    }
    expect(seen[0], "the first drag did nothing — the rest would pass on a dead build").toBeGreaterThan(340);
    expect(seen[2] - seen[1], "the height ratcheted upward on a repeated drag").toBeLessThan(6);
    expect(seen[2], "the stack ran away past any sane height").toBeLessThan(900);
  });
});

/**
 * A STACK WITH A NEIGHBOUR BESIDE IT STILL HAS SOMETHING ABOVE IT.
 *
 * The block-above lookup gave up the moment it met a sibling sharing the line, on the reasoning that such a
 * sibling owns no boundary. True — and not the same claim as "nothing does". With no partner found, the top
 * edge fell back to being clamped against the PAGE top, which is nowhere near.
 *
 * Measured before the fix, dragging the red stack's top edge up 300px with a taller green stack beside it:
 * `margin-top: -160.034px`, the stack 160px above its own band, sitting on top of the header. The user:
 * *"it went way above the whole page on the top side"*.
 *
 * The assertion is the OVERLAP, not the margin: a negative margin is only the mechanism, and a future fix
 * that reached the same wrong picture by another route would slip past a test that watched the number.
 */
const besideSite = () => ({
  pages: [{
    id: "p1", name: "Home", path: "/",
    root: {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "band0", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
          { id: "HEAD", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 160, background: "#2f4858", children: [] },
        ] },
        { id: "band1", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
          { id: "SIDE", type: "container", direction: "column", padding: 0, gap: 0, width: "40%", minHeight: 420, background: "#d5f7b8", children: [] },
          { id: "L", type: "container", direction: "column", padding: 0, gap: 0, width: "60%", minHeight: 300, background: "#b0003a", children: [] },
        ] },
      ],
    },
  }],
  homeId: "p1", version: 1,
});

test.describe("a stack with a neighbour beside it", () => {
  test("cannot be dragged up out of its own band and over what is above it", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await seedSite(page, besideSite());
    await page.waitForSelector('[data-box-id="L"]', { timeout: 20000 });
    await page.waitForTimeout(500);

    const read = () => page.evaluate(() => {
      const g = (id: string) => {
        const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)!;
        const b = el.getBoundingClientRect();
        return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) };
      };
      return { HEAD: g("HEAD"), SIDE: g("SIDE"), L: g("L"), band1: g("band1") };
    });

    const before = await read();
    expect(await select(page, "L"), "the red stack could not be selected").toBe(true);
    await dragEdge(page, "Resize top edge", 0, -300);
    const after = await read();

    // The gesture did something — otherwise every assertion below is free.
    expect(after.L.h - before.L.h, "the drag did nothing").toBeGreaterThan(100);

    // THE BUG: it must not leave its band, and must not cover the header.
    expect(after.band1.top - after.L.top, "the stack rose above its own band").toBeLessThan(6);
    expect(after.L.top, "the stack is sitting on top of the header").toBeGreaterThanOrEqual(after.HEAD.bottom - 2);

    // What should happen instead: the header gives way, and the stack BESIDE it comes along.
    expect(before.HEAD.h - after.HEAD.h, "the header did not give way to the shared boundary").toBeGreaterThan(100);
    expect(after.SIDE.h - before.SIDE.h, "the stack beside it did not follow the band").toBeGreaterThan(100);
    expect(Math.abs(after.SIDE.top - after.L.top), "the two stacks no longer start on the same line").toBeLessThan(6);
  });
});

test.describe("resizing a stack never strands its neighbour", () => {
  for (const c of CASES) {
    test(`${c.id} · ${c.what}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await seedSite(page, sitePage(c.kids() as never[]));
      await page.waitForSelector('[data-box-id="B"]', { timeout: 20000 });
      await page.waitForTimeout(400);

      const before = await boxes(page);
      expect(await select(page, c.target), `${c.target} could not be selected`).toBe(true);
      await dragEdge(page, c.edge, c.dx, c.dy);
      const after = await boxes(page);

      const moved = c.axis === "v"
        ? Math.abs(after[c.target]!.h - before[c.target]!.h)
        : Math.abs(after[c.target]!.w - before[c.target]!.w);
      expect(moved, "the drag did nothing — this case would pass on a broken build").toBeGreaterThan(40);

      const other = c.target === "A" ? "B" : "A";
      const neighbourShift = c.axis === "v"
        ? Math.abs(after[other]!.h - before[other]!.h) + Math.abs(after[other]!.top - before[other]!.top)
        : Math.abs(after[other]!.w - before[other]!.w) + Math.abs(after[other]!.left - before[other]!.left);

      if (c.beyond) {
        /**
         * A SHARED BOUNDARY. Only the boundary moves: the neighbour GROWS or SHRINKS by what this block
         * released, and its FAR edge — the one on the other side of it — does not move at all.
         *
         * ASSERTING THAT IT "MOVED" IS NOT ENOUGH, and that is why this bug shipped. The first version of
         * this test accepted any shift over 40px, which a block satisfies by SLIDING without growing a
         * pixel. That is exactly what the bottom edge did: the stack below slid up, the column came up
         * short, and a space appeared at its foot that the user had never asked for. Measured: neighbour
         * grew 0px, its far edge moved -140px.
         */
        const gap = c.axis === "v" ? after.B!.top - after.A!.bottom : after.B!.left - after.A!.right;
        expect(Math.abs(gap), `a ${Math.round(gap)}px gap was left between the two stacks`).toBeLessThan(6);

        const grew = c.axis === "v" ? after[other]!.h - before[other]!.h : after[other]!.w - before[other]!.w;
        expect(Math.abs(grew), `the neighbour SLID instead of growing (${grew}px)`).toBeGreaterThan(40);

        // Its far edge is the one the gesture must not reach.
        const farBefore = other === "B" ? (c.axis === "v" ? before.B!.bottom : before.B!.right) : (c.axis === "v" ? before.A!.top : before.A!.left);
        const farAfter = other === "B" ? (c.axis === "v" ? after.B!.bottom : after.B!.right) : (c.axis === "v" ? after.A!.top : after.A!.left);
        expect(
          Math.abs(farAfter - farBefore),
          `the neighbour's far edge moved from ${farBefore} to ${farAfter} — only the shared boundary may move`,
        ).toBeLessThan(6);
        void neighbourShift;
      } else {
        /**
         * AN OUTER EDGE, facing nothing. A space may open THERE — that is the point of the gesture — and
         * nowhere else. What "and nowhere else" costs differs by axis, so the two are asserted differently
         * and deliberately, rather than with one loose rule that would pass on both counts.
         *
         * ACROSS (h): the neighbour must not be disturbed at all. This is the measured bug — opening the gap
         * on the far left pushed the neighbour **494px** and wrapped it onto a second line, because the gap
         * was written as a length and could not sum with the percentage widths beside it.
         *
         * DOWN (v): the neighbour is ALLOWED to resize, and must. A column beside a taller stack is stretched
         * to that stack's height, so the room this gesture frees has to go somewhere — and the only two
         * places are the neighbour, or a hole at the column's foot. The hole is the thing this whole file
         * exists to forbid, so the neighbour takes it. What is asserted instead is the property that actually
         * matters: the two stacks stay FLUSH with one another, and nothing pools at the foot of the column.
         *
         * Asserting "the neighbour did not move" down this axis was an assumption, never a measurement — it
         * was written while every block still hugged its content, and it quietly required a hole to exist.
         */
        if (c.axis === "h") {
          expect(
            neighbourShift,
            `the neighbour moved ${neighbourShift}px for a gap opened at an outer edge`,
          ).toBeLessThan(6);
          // …and the row did not break onto a second line behind our backs.
          expect(after.A!.top, "the two stacks are still on one line").toBe(after.B!.top);
          expect(after.band!.h, "the band doubled in height — the row wrapped").toBeLessThan(before.band!.h + 20);
        } else {
          expect(
            Math.abs(after.B!.top - after.A!.bottom),
            `a ${Math.round(after.B!.top - after.A!.bottom)}px gap opened BETWEEN the two stacks — the space belongs at the dragged edge alone`,
          ).toBeLessThan(6);
          // The gesture must still have done something visible at the edge that was grabbed.
          const openedAtEdge = c.edge === "Resize top edge"
            ? after.A!.top - before.A!.top
            : before.B!.bottom - after.B!.bottom;
          expect(openedAtEdge, "no space opened at the outer edge that was dragged").toBeGreaterThan(40);
        }
      }
    });
  }
});

/**
 * DROPPING A BLOCK INTO A SPACE YOU MADE DISTURBS NOTHING.
 *
 * Reported with three screenshots: two stacks side by side, the right one's top edge dragged down to open a
 * deliberate space above it, and a Stack dropped into that space. Landing there wraps the stack and the
 * newcomer in a column — which is right, and left the stack beside them untouched — but the column then
 * SPLIT the space between its two bands: the newcomer came out **35px tall**, a sliver, and the other 35px
 * became a hole under the stack below it. One drop, two spaces, neither asked for.
 *
 * Both bands had been granted `flex-grow: 1`, so "share it equally" was the only answer the layout had. The
 * newcomer's band says `fill`; the other hugs 93px of content. A block that says `fill` is the one asking
 * for the space, and the assertion below is that it gets ALL of it.
 *
 * What is measured is the two blocks that were already on the page: neither may move by so much as a pixel.
 * Asserting the newcomer's own height would pass the moment it grew at all — it was 35px when this broke,
 * and 35px is "grew".
 */
test.describe("dropping a block into a space you opened", () => {
  const sideBySide = () => ({
    pages: [{
      id: "p1", name: "Home", path: "/",
      root: {
        id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
          { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
            { id: "GREEN", type: "container", direction: "column", padding: 0, gap: 0, width: "30%", minHeight: 163, background: "#93e6b8", children: [] },
            { id: "PURPLE", type: "container", direction: "column", padding: 0, gap: 0, width: "70%", minHeight: 163, background: "#6b2fc9", children: [] },
          ] },
        ],
      },
    }],
    homeId: "p1", version: 1,
  });

  test("the blocks already on the page do not move at all", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await seedSite(page, sideBySide());
    await page.waitForSelector('[data-box-id="PURPLE"]', { timeout: 20000 });
    await page.waitForTimeout(500);

    const read = () => page.evaluate(() => {
      const g = (id: string) => {
        const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)!;
        const b = el.getBoundingClientRect();
        return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) };
      };
      return { band: g("band"), GREEN: g("GREEN"), PURPLE: g("PURPLE") };
    });

    // Open a deliberate space above PURPLE, at its own outer edge.
    expect(await select(page, "PURPLE"), "the purple stack could not be selected").toBe(true);
    await dragEdge(page, "Resize top edge", 0, 70);
    const opened = await read();
    const space = opened.PURPLE.top - opened.band.top;
    expect(space, "no space opened above the stack — the rest would prove nothing").toBeGreaterThan(40);

    // Drop a Stack into the middle of that space, where a hand would aim.
    await page.evaluate((p) => {
      const dt = new DataTransfer();
      dt.setData("application/x-box-block", "container");
      const el = document.elementFromPoint(p.x, p.y)!;
      const at = { clientX: p.x, clientY: p.y, bubbles: true, cancelable: true, dataTransfer: dt };
      el.dispatchEvent(new DragEvent("dragover", at));
      el.dispatchEvent(new DragEvent("drop", at));
    }, { x: 732, y: Math.round((opened.band.top + opened.PURPLE.top) / 2) });
    await page.waitForTimeout(800);

    const after = await read();
    expect(Math.abs(after.PURPLE.top - opened.PURPLE.top), "the stack below the space MOVED").toBeLessThan(4);
    expect(Math.abs(after.PURPLE.h - opened.PURPLE.h), "the stack below the space was RESIZED").toBeLessThan(4);
    expect(Math.abs(after.GREEN.h - opened.GREEN.h), "the stack beside it was resized").toBeLessThan(4);
    expect(Math.abs(after.band.h - opened.band.h), "the band changed height").toBeLessThan(4);
    // …and the space is filled edge to edge, with nothing left under the stack below.
    expect(Math.abs(after.band.bottom - after.PURPLE.bottom), "a hole was left under the stack").toBeLessThan(4);
  });
});

/**
 * GROWING A BLOCK NEVER TAKES THE ROOM FROM ABOVE IT.
 *
 * The fixture is the USER'S OWN SAVED PAGE, and it is here because six shapes invented by hand all behaved
 * perfectly while their report stayed unreproducible. Two things in it none of mine had: a band carrying a
 * height of its own (`mh: 201`), which caps how much room everything inside it shares, and a block sized
 * `fill`, whose height is leftover by definition and so collapses without resisting when a sibling grows.
 *
 * Measured before the fix, dragging the brown stack's bottom edge down 90px: it grew 140 → 230, the band rose
 * only 201 → 230, and the `fill` block above went **61 → 0**. Sixty-one pixels of the drag were taken from
 * above, so the ANCHORED TOP EDGE MOVED UP 61px while the bottom was being dragged down — RULE 19, broken for
 * the fourth time, and the third appearance today of one root cause: a size stored as leftover.
 *
 * The assertion is the TOP EDGE and the block above, never the dragged block's own height — which was correct
 * throughout the fault and would have passed the whole time.
 */
test.describe("growing a block inside a band that has its own height", () => {
  const usersPage = () => ({
    pages: [{
      id: "p1", name: "Home", path: "/",
      root: {
        id: "aj-1", type: "container", direction: "column", padding: 0, gap: 0, width: "fill", children: [
          { id: "sw-4", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, minHeight: 201, children: [
            { id: "sw-3", type: "container", direction: "column", padding: 0, gap: 0, width: "28%", minHeight: 128, background: "#f2455f", children: [] },
            { id: "e1-8", type: "container", direction: "column", padding: 0, gap: 0, width: "72%", children: [
              { id: "e1-9", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, height: "fill", children: [
                { id: "e1-7", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", height: "100%", background: "#ffc9ec", children: [] },
              ] },
              { id: "e1-a", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
                { id: "zv-6", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 140, background: "#3b2408", children: [
                  { id: "o3-g", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
                    { id: "o2-f", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 140, background: "#6b3f12", children: [] },
                  ] },
                ] },
              ] },
            ] },
          ] },
          { id: "m9-c", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
            { id: "m9-b", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 55, background: "#efeff3", children: [] },
          ] },
        ],
      },
    }],
    homeId: "p1", version: 1,
  });

  // The block itself, and the one nested inside it — the fault hit both, so both are driven.
  for (const target of ["zv-6", "o2-f"]) {
    test(`${target} · its top edge stays put and the block above keeps its height`, async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 1000 });
      await seedSite(page, usersPage());
      await page.waitForSelector('[data-box-id="o2-f"]', { timeout: 20000 });
      await page.waitForTimeout(600);

      const read = () => page.evaluate(() => {
        const g = (id: string) => {
          const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)!;
          const b = el.getBoundingClientRect();
          return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) };
        };
        return { band: g("sw-4"), fill: g("e1-7"), brown: g("zv-6"), inner: g("o2-f") };
      });

      const before = await read();
      expect(await select(page, target), `${target} could not be selected`).toBe(true);
      await dragEdge(page, "Resize bottom edge", 0, 90);
      const after = await read();

      const key = target === "zv-6" ? "brown" : "inner";
      // The drag did something — without this the rest is free.
      expect(after[key].h - before[key].h, "the drag did nothing").toBeGreaterThan(40);

      // THE BUG: the anchored edge moved, because the growth was taken from the block above.
      expect(Math.abs(after[key].top - before[key].top), "the ANCHORED top edge moved").toBeLessThan(4);
      expect(
        before.fill.h - after.fill.h,
        `the block above was squeezed from ${before.fill.h} to ${after.fill.h} to pay for the drag`,
      ).toBeLessThan(4);
      // The room grew instead.
      expect(after.band.h - before.band.h, "the band did not grow to make room").toBeGreaterThan(40);
    });
  }
});
