import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * YOU CAN ALWAYS CLICK THE WORDS, AND YOU CAN ALWAYS REACH THEM FROM THE KEYBOARD.
 *
 * Behaviours: tests/features/components/website/box-builder-floating.feature.
 *
 * Written after being asked, plainly, *"how do you UI test how a user will use it?"* — because the honest
 * answer was that the probe in front of me did not. It computed a `Range`'s bounding box and clicked its
 * mathematical CENTRE, and on that one point everything passed. A user does not aim at a centroid. Aiming
 * where a hand actually lands found two defects the centroid hid:
 *
 *     the blocks launcher sat over the page      → the first word of the first block opened a panel
 *     the left resize handle reached 6px inward  → 3 of 21 plausible aim points could not place a caret
 *
 * So the sweep is the test. It clicks a SPREAD of points across the ink — near the start of the line, where
 * both faults lived, as well as the comfortable middle — and any point over a word that fails to take the
 * caret is a bug, not a bad aim.
 *
 * ── WHAT IS ASSERTED, AND WHY IT IS NOT GEOMETRY ──
 *
 * "No chrome overlaps the words" is the WRONG assertion and would fail on the fixed build: the edge handles
 * still straddle the box edge, and they must, because that is where you grab to resize. What was fixed is
 * behavioural — a click that never moved falls THROUGH the handle to the text underneath, since a resize is a
 * drag. So the property is "clicking a word puts the caret in that word", measured by clicking.
 *
 * The launcher is the opposite case and IS geometry: it is a button that opens a panel, so it cannot fall
 * through to anything. The only correct state is that it never covers the page at all, which is why the canvas
 * reserves its exact footprint as a gutter.
 */

/** A heading flush against its box, which is the default (Rule 3: padding is a decision, never a default). */
const page1 = () => sitePage([
  {
    id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 300,
    background: "#eef2ff",
    children: [{ id: "h", type: "heading", text: "Riverside Primary School", width: "100%" } as unknown as BoxNode],
  } as unknown as BoxNode,
]);

const selection = (page: Page) => page.evaluate(() =>
  document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);

/** Where the caret actually is — the block being edited, or null if nothing holds it. */
const editingBlock = (page: Page) => page.evaluate(() => {
  const ae = document.activeElement as HTMLElement | null;
  return ae?.isContentEditable ? (ae.closest("[data-box-id]")?.getAttribute("data-box-id") ?? null) : null;
});

/**
 * Where the caret sits ON SCREEN.
 *
 * "Is the caret in this block?" is not enough, and the first version of this guard proved it: selecting the
 * heading means clicking its words, which correctly starts editing them — so the caret was already in `h`
 * before the sweep began, and every swallowed click still left it there. The guard passed with the fix removed.
 * A click that lands MOVES the caret to where it was aimed; a swallowed one leaves it where it was.
 */
const caretX = (page: Page) => page.evaluate(() => {
  const s = window.getSelection();
  if (!s || s.rangeCount === 0) return null;
  return Math.round(s.getRangeAt(0).getBoundingClientRect().x);
});

/** Click until the heading itself is the selection, so its resize handles are on screen. */
async function selectHeading(page: Page) {
  const b = (await page.locator('[data-box-id="h"]').boundingBox())!;
  for (let i = 0; i < 6; i++) {
    if ((await selection(page)) === "h") return;
    await page.mouse.click(b.x + b.width * 0.5, b.y + b.height * 0.5);
    await page.waitForTimeout(200);
  }
  expect(await selection(page), "the heading could not be selected at all").toBe("h");
}

/**
 * Plausible aim points across the INK of the heading — not its box, and not one computed centre.
 *
 * ── THE FIRST VERSION OF THIS SWEEP COULD NOT FAIL, AND THAT WAS ITS OWN BUG ──
 *
 * It sampled FRACTIONS of the text width — 2%, 6%, 12% — which passed with the fix removed. The defect lives
 * inside a fixed 6px of the box edge (the handle straddles it, 4px out and 6px in), and a fraction of the
 * width is not a reliable way to land there: this heading is longer than the one the fault was measured on, so
 * "2% across" fell clear of the handle and the guard proved nothing.
 *
 * So the start of the line is sampled in PIXELS, which is the unit the fault is actually in, and the rest of
 * the words by fraction, which is where a hand usually lands.
 */
const aimPoints = (page: Page) => page.evaluate(() => {
  const host = document.querySelector<HTMLElement>('[data-box-id="h"] [contenteditable="true"]');
  if (!host) return null;
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  const tn = walker.nextNode();
  if (!tn) return null;
  const r = document.createRange();
  r.setStart(tn, 0);
  r.setEnd(tn, (tn.textContent ?? "").length);
  const g = r.getBoundingClientRect();
  const pts: { x: number; y: number; at: string }[] = [];
  for (const dx of [1, 3, 5, 8, 12, 20]) {
    for (const fy of [0.3, 0.5, 0.7]) {
      pts.push({ x: Math.round(g.x + dx), y: Math.round(g.y + g.height * fy), at: `${dx}px into the first word, ${Math.round(fy * 100)}% down` });
    }
  }
  for (const fx of [0.25, 0.5, 0.75, 0.95]) {
    for (const fy of [0.3, 0.7]) {
      pts.push({ x: Math.round(g.x + g.width * fx), y: Math.round(g.y + g.height * fy), at: `${Math.round(fx * 100)}% across, ${Math.round(fy * 100)}% down` });
    }
  }
  return pts;
});

test.describe("the words of a selected block can always be clicked", () => {
  test.beforeEach(async ({ page }) => {
    await seedSite(page, page1());
    await page.waitForSelector('[data-box-id="h"]', { timeout: 30000 });
    await page.waitForTimeout(400);
  });

  test("every plausible aim point across the words takes the caret", async ({ page }) => {
    await selectHeading(page);
    // The handles must really be on screen, or this would pass by testing nothing.
    expect(await page.locator('[aria-label="Resize left edge"]').count(), "the left edge handle is showing").toBeGreaterThan(0);

    const pts = await aimPoints(page);
    expect(pts, "the heading's text was measurable").not.toBeNull();
    // The far end of the line, which was never in question. Parking the caret there before each aim makes a
    // swallowed click VISIBLE: it leaves the caret behind instead of moving it to where the user pointed.
    const anchor = pts!.find((p) => p.at.startsWith("95%"))!;

    const missed: string[] = [];
    for (const p of pts!) {
      await page.mouse.click(anchor.x, anchor.y);
      await page.waitForTimeout(90);
      await page.mouse.click(p.x, p.y);
      await page.waitForTimeout(120);
      const cx = await caretX(page);
      const inBlock = (await editingBlock(page)) === "h";
      if (!inBlock || cx === null || Math.abs(cx - p.x) > 30) {
        missed.push(`${p.at} — aimed at x=${p.x}, caret ${inBlock ? `left at x=${cx}` : "not in the block at all"}`);
      }
    }
    expect(missed, `these points are over the words but the caret would not go there:\n  ${missed.join("\n  ")}`).toEqual([]);
  });

  test("typing lands after clicking the very start of the line", async ({ page }) => {
    await selectHeading(page);
    const pts = (await aimPoints(page))!;
    const first = pts.find((p) => p.at.startsWith("1px"))!; // the point the resize handle used to swallow
    await page.mouse.click(first.x, first.y);
    await page.waitForTimeout(250);
    await page.keyboard.type("St ");
    await page.waitForTimeout(300);
    // AT THE START, not merely present. A swallowed click leaves the caret at the end, where the same typing
    // still "contains" the text — which is how the first version of this test passed with the fix removed.
    expect(await page.locator('[data-box-id="h"]').innerText()).toMatch(/^St Riverside/);
  });

  test("a real DRAG on the same handle still resizes, and the far edge stays put", async ({ page }) => {
    await selectHeading(page);
    const before = (await page.locator('[data-box-id="h"]').boundingBox())!;
    const h = (await page.locator('[aria-label="Resize right edge"]').boundingBox())!;
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) {
      await page.mouse.move(h.x + h.width / 2 - i * 12, h.y + h.height / 2);
      await page.waitForTimeout(8);
    }
    await page.mouse.up();
    await page.waitForTimeout(400);

    const after = (await page.locator('[data-box-id="h"]').boundingBox())!;
    expect(before.width - after.width, "the drag really narrowed the block").toBeGreaterThan(40);
    expect(Math.abs(after.x - before.x), "the LEFT edge — the one not being held — did not move (Rule 19)").toBeLessThan(3);
  });
});

test.describe("the blocks launcher never covers the page", () => {
  /**
   * Measured at the widths where the column is TIGHT, which is where this broke. At 1600 the page is capped
   * below the column and centres with room to spare, so the overlap never showed there — testing only a roomy
   * viewport is how it survived.
   */
  for (const width of [1152, 1280, 1440]) {
    test(`at ${width}px the launcher sits beside the page, not on it`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await seedSite(page, page1());
      await page.waitForSelector('[data-box-id="h"]', { timeout: 30000 });
      await page.waitForTimeout(400);

      const rects = await page.evaluate(() => {
        const launcher = document.querySelector<HTMLElement>('[aria-label="Open blocks panel"]');
        const pageBox = document.querySelector<HTMLElement>("[data-box-id]"); // first in document order = the page root
        if (!launcher || !pageBox) return null;
        const l = launcher.getBoundingClientRect(), p = pageBox.getBoundingClientRect();
        return { launcherRight: l.right, pageLeft: p.left, overlap: Math.round(l.right - p.left) };
      });
      expect(rects, "the launcher and the page were both on screen").not.toBeNull();
      expect(
        rects!.overlap,
        `the launcher's right edge is ${rects!.overlap}px INSIDE the page — anything there steals the click`,
      ).toBeLessThanOrEqual(0);
    });
  }
});

/** An empty section, so the canvas offers its "add a block inside" affordance. */
const emptyPage = () => sitePage([
  {
    id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 300,
    background: "#eef2ff", children: [],
  } as unknown as BoxNode,
]);

test.describe("text can be reached without a mouse", () => {
  /**
   * THE STATE THIS IS ABOUT is the one a person is in the instant after adding a block: it is selected, and
   * nothing holds the caret. Measured on a freshly added Heading before the fix — `activeElement` was BODY,
   * Enter did nothing and the typing went nowhere.
   *
   * Selecting by CLICKING the words cannot produce that state, because clicking words now correctly starts
   * editing them. So the block is added the way a user adds one, through the palette.
   */
  async function addHeading(page: Page) {
    await seedSite(page, emptyPage());
    await page.waitForSelector('[data-box-id="sec"]', { timeout: 30000 });
    await page.locator('button[aria-label="Choose a block to add inside"]').first().click();
    await page.waitForTimeout(500);
    await page.locator("button").filter({ hasText: /^Heading$/ }).first().click({ force: true });
    await page.waitForTimeout(900);
    const id = await selection(page);
    expect(id, "the palette added a block and selected it").not.toBeNull();
    expect(await editingBlock(page), "nothing holds the caret yet — this is the state the bug lived in").toBeNull();
    return id!;
  }

  /**
   * Every other operation on the canvas had a shortcut — undo, duplicate, delete, nudge, float, group, lock,
   * the z-order pair, the panel, and Escape to step OUT of text. There was no way IN, so a keyboard-only user
   * could select a heading and never type a word into it (WCAG 2.1.1; Core Rule 2's "no feature is mouse-only").
   */
  for (const key of ["Enter", "F2"]) {
    test(`${key} on a selected block begins editing, and typing lands`, async ({ page }) => {
      const id = await addHeading(page);

      await page.keyboard.press(key);
      await page.waitForTimeout(250);
      expect(await editingBlock(page), `${key} did not begin editing`).toBe(id);

      await page.keyboard.type(" of Riverside");
      await page.waitForTimeout(300);
      await expect(page.locator(`[data-box-id="${id}"]`)).toContainText("of Riverside");
    });
  }

  test("the caret arrives at the END, so typing adds rather than overwrites", async ({ page }) => {
    const id = await addHeading(page);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(250);
    await page.keyboard.type("!");
    await page.waitForTimeout(300);
    await expect(page.locator(`[data-box-id="${id}"]`)).toContainText("New heading!");
  });
});
