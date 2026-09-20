import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * DROPPING A STACK INTO THE EMPTY SPACE BESIDE ANOTHER ONE.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * The question this answers, asked while looking at a half-width Stack with ~600px of empty band beside it:
 * *"I should be able to place a stack next to another stack if there is space for it, right?"*
 *
 * The engine already intends it — `slotFromKids` reads the LAID-OUT geometry rather than the nominal
 * flex-direction, and treats "the pointer is on that block's line but in the empty gap to its side" as a
 * side-by-side drop. What nothing asserted was whether that actually fires across the WHOLE opening, or only
 * in the 22px edge strip `computeDrop` uses for its own beside-vs-inside decision. Those are two different
 * rules a few lines apart, and a reader cannot tell from the code which one governs the middle of the gap.
 *
 * So these measure the opening at the place it is easiest to get wrong: the MIDDLE of the empty space, as far
 * from either edge strip as it is possible to be. A drop there must land beside, and the indicator must say so
 * BEFORE the mouse is released — an indicator that shows one thing and does another is the same defect class
 * as a class that is present and inert.
 */

/** A band holding ONE stack across half its width — the shape in the screenshot that prompted this. */
async function seedHalfWidthStack(page: Page) {
  await seedSite(page, sitePage([
    { id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 200, background: "#eef2ff", children: [] },
  ]));
  await page.waitForSelector('[data-box-id="sec"]', { timeout: 15000 });
  await page.waitForTimeout(300);
}

/**
 * The same half-width stack, in a band with FLOOR BENEATH IT.
 *
 * `sitePage`'s band hugs its content, so under a 200px stack there is no band left to aim at — a drop below
 * it hits nothing and the canvas draws no indicator at all. The first version of the stacked-drop test aimed
 * there and waited two minutes for a line that was never coming, which made it look like a failure of the
 * app rather than of the test's premise. Giving the band its own height is what makes "below" a real place.
 */
async function seedStackWithFloorBelow(page: Page) {
  await seedSite(page, {
    pages: [{
      id: "p1", name: "Home", path: "/",
      root: {
        id: "root", type: "container", direction: "column", padding: 0, gap: 0,
        children: [{
          id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0,
          align: "start", minHeight: 500,
          children: [{ id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 200, background: "#eef2ff", children: [] }],
        }],
      },
    }],
    homeId: "p1",
  });
  await page.waitForSelector('[data-box-id="sec"]', { timeout: 15000 });
  await page.waitForTimeout(300);
}

/** Begin an HTML5 palette drag and hold it over a point, so the indicator can be measured mid-gesture. */
async function dragOverPoint(page: Page, kind: string, x: number, y: number) {
  await page.evaluate(({ kind, x, y }) => {
    const dt = new DataTransfer();
    dt.setData("application/x-box-block", kind);
    (window as unknown as { __dt: DataTransfer }).__dt = dt;
    const el = document.elementFromPoint(x, y)!;
    el.dispatchEvent(new DragEvent("dragover", { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt }));
  }, { kind, x, y });
  await page.waitForTimeout(150);
}

/** Release the held drag at the same point, using the SAME DataTransfer the drag started with. */
async function dropAtPoint(page: Page, x: number, y: number) {
  await page.evaluate(({ x, y }) => {
    const dt = (window as unknown as { __dt: DataTransfer }).__dt;
    const el = document.elementFromPoint(x, y)!;
    el.dispatchEvent(new DragEvent("drop", { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt }));
  }, { x, y });
  await page.waitForTimeout(400);
}

/**
 * The band's children, in stored order, with the geometry each one occupies AND its stored width.
 *
 * The stored width is what makes these tests discriminating. Geometry alone is not: a `rowBand` lays its
 * children out side-by-side because it is a row, so "they share a row" stays true even when the drop logic
 * has decided the opposite — which is exactly what a mutation run proved. The width is the side-by-side
 * DECISION itself (`slotFromKids` hands the newcomer the line's leftover space, or 100% for its own line),
 * so it is the one value that differs between the two readings.
 */
async function bandChildren(page: Page) {
  const stored = await page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const find = (n: Record<string, unknown>): Record<string, unknown> | null =>
      n.id === "band" ? n : ((n.children as Record<string, unknown>[]) ?? []).reduce<Record<string, unknown> | null>((a, c) => a ?? find(c), null);
    const band = find(site.pages[0].root);
    return ((band?.children as Record<string, unknown>[]) ?? []).map((c) => ({ id: c.id as string, width: c.width as string | undefined }));
  });
  const out = [];
  for (const s of stored) out.push({ ...s, box: await page.locator(`[data-box-id="${s.id}"]`).boundingBox() });
  return out;
}

/** A stored width as a number of percent, or null when it is not a percentage. */
const pct = (w: string | undefined) => (w && /^[\d.]+%$/.test(w) ? parseFloat(w) : null);

/** The insertion line the canvas draws while a drag is held. Vertical = beside, horizontal = below. */
const indicator = (page: Page) => page.locator("div.rounded-full.bg-indigo-500");

/**
 * The indicator's geometry, or null when none is drawn — WITHOUT waiting for one to appear.
 *
 * `locator.boundingBox()` auto-waits for the element, so asking it about an indicator that is legitimately
 * absent burns the whole test timeout and reports as a failure of the app. `count()` resolves immediately,
 * which is what lets "no line is drawn" be an ASSERTABLE outcome rather than a hang.
 */
async function indicatorBox(page: Page) {
  if (await indicator(page).count() === 0) return null;
  return indicator(page).first().boundingBox();
}

test.describe("dropping a Stack into the empty space beside another", () => {
  test("the MIDDLE of the opening offers a side-by-side drop, not a stacked one", async ({ page }) => {
    await seedHalfWidthStack(page);
    const sec = (await page.locator('[data-box-id="sec"]').boundingBox())!;
    const band = (await page.locator('[data-box-id="band"]').boundingBox())!;
    const gap = band.x + band.width - (sec.x + sec.width);
    expect(gap, "the seed really does leave a wide opening to aim at").toBeGreaterThan(200);

    // Dead centre of the empty space — as far from either 22px edge strip as the opening allows.
    const x = sec.x + sec.width + gap / 2;
    const y = sec.y + sec.height / 2;
    await dragOverPoint(page, "container", x, y);

    const ind = (await indicator(page).boundingBox())!;
    expect(ind, "an insertion line is drawn").not.toBeNull();
    expect(ind.height, "a VERTICAL line means side-by-side").toBeGreaterThan(ind.width);
  });

  test("and the block actually lands beside it, sharing the row", async ({ page }) => {
    await seedHalfWidthStack(page);
    const sec = (await page.locator('[data-box-id="sec"]').boundingBox())!;
    const band = (await page.locator('[data-box-id="band"]').boundingBox())!;
    const x = sec.x + sec.width + (band.x + band.width - (sec.x + sec.width)) / 2;
    const y = sec.y + sec.height / 2;

    await dragOverPoint(page, "container", x, y);
    await dropAtPoint(page, x, y);

    const kids = await bandChildren(page);
    expect(kids.length, "the band now holds two blocks").toBe(2);
    const [a, b] = kids.map((k) => k.box!);
    expect(a, "both are on the page").not.toBeNull();
    expect(b).not.toBeNull();
    // SIDE BY SIDE is a measurement, not a stored flag: they overlap vertically and not horizontally.
    expect(a.y < b.y + b.height && b.y < a.y + a.height, "they share a row (vertical overlap)").toBe(true);
    const left = a.x <= b.x ? a : b;
    const right = a.x <= b.x ? b : a;
    expect(right.x, "the newcomer starts at or after the first one's right edge").toBeGreaterThanOrEqual(left.x + left.width - 2);
    // …AND THE BLOCK ALREADY THERE WAS NOT RESIZED. This is the half that discriminates, and finding it
    // took a mutation run: every assertion above is also satisfied when the side-by-side reading is forced
    // OFF, because a `rowBand` lays its children out in a row regardless and the widths are renormalised
    // afterwards either way. What differs is WHOSE space is spent. A side-by-side drop takes the leftover
    // and leaves the neighbour alone (50% + 50%); the stacked path renormalises and shrinks the block that
    // was already there (33% + 67%) — a block the user sized, silently resized by someone else's arrival.
    // Same principle as edge-anchored resize: never write a size and hope something absorbs it.
    const newcomer = kids.find((k) => k.id !== "sec")!;
    const existing = kids.find((k) => k.id === "sec")!;
    expect(pct(existing.width), "the block already there keeps the width it had").toBe(50);
    expect(pct(newcomer.width), "the newcomer takes the leftover, no more").toBeLessThanOrEqual(51);
    expect(pct(newcomer.width), "…and no less").toBeGreaterThanOrEqual(49);
  });

  test("the newcomer takes the leftover width rather than overflowing the band", async ({ page }) => {
    // The other half of "if there is space for it": the block has to FIT the space it was dropped into.
    await seedHalfWidthStack(page);
    const sec = (await page.locator('[data-box-id="sec"]').boundingBox())!;
    const band = (await page.locator('[data-box-id="band"]').boundingBox())!;
    const x = sec.x + sec.width + (band.x + band.width - (sec.x + sec.width)) / 2;
    const y = sec.y + sec.height / 2;

    await dragOverPoint(page, "container", x, y);
    await dropAtPoint(page, x, y);

    const kids = await bandChildren(page);
    const total = kids.reduce((s, k) => s + (k.box?.width ?? 0), 0);
    expect(total, "the two together do not exceed the band").toBeLessThanOrEqual(band.width + 2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
      "and nothing spills sideways").toBe(true);
    // The STORED widths have to add up too. Measured widths alone are satisfied by flex shrinking two
    // over-wide blocks down until they happen to fit — which is the band rescuing a bad decision, not the
    // decision being right. The stored numbers are what the user keeps.
    const sum = kids.reduce((s, k) => s + (pct(k.width) ?? 100), 0);
    expect(sum, "the stored widths fill the line without exceeding it").toBeLessThanOrEqual(101);
    expect(sum, "…and actually use it").toBeGreaterThan(90);
    // And the newcomer's share came from the EMPTY space, not out of its neighbour — see the note in the
    // test above. Without this the sum holds just as well at 33 + 67 as at 50 + 50.
    expect(pct(kids.find((k) => k.id === "sec")!.width), "taken from the gap, not from the neighbour").toBe(50);
  });

  test("dropping BELOW the stack still stacks it — the two readings stay distinct", async ({ page }) => {
    // The guard against over-correcting: if every drop near a block became side-by-side, this would fail.
    // It is the direction that keeps the test above honest — on its own, "it lands beside" is also satisfied
    // by a builder that puts EVERYTHING beside, which would be a worse bug than the one being ruled out.
    await seedStackWithFloorBelow(page);
    const sec = (await page.locator('[data-box-id="sec"]').boundingBox())!;
    const band = (await page.locator('[data-box-id="band"]').boundingBox())!;
    expect(band.height, "the band really does have floor beneath the stack").toBeGreaterThan(sec.height + 100);

    const x = sec.x + sec.width / 2;          // horizontally ON the stack, so only the vertical reading differs
    const y = sec.y + sec.height + 60;        // clear of it, on the band's own empty floor

    await dragOverPoint(page, "container", x, y);
    const ind = await indicatorBox(page);
    expect(ind, "an insertion line is drawn here too").not.toBeNull();
    expect(ind!.width, "a HORIZONTAL line means a new line below").toBeGreaterThan(ind!.height);

    await dropAtPoint(page, x, y);

    // IT LANDS IN A NEW BAND, not in this one. A row band lays its children side by side whatever the
    // pointer meant, so "below" can only be honoured by making a new line — and the horizontal indicator
    // above has been promising exactly that. Before this was fixed the block was inserted INTO the band and
    // sat beside the first one; it looked right only because an empty box had no minimum height and rendered
    // as nothing, so nobody could see it in the wrong place.
    const kids = await bandChildren(page);
    expect(kids.length, "the band it was dropped below is left alone").toBe(1);

    const bands = await page.evaluate(() => {
      const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
      return ((site.pages[0].root.children as Record<string, unknown>[]) ?? []).map((b) => b.id as string);
    });
    expect(bands.length, "a new band was created for it").toBe(2);

    const first = (await page.locator('[data-box-id="sec"]').boundingBox())!;
    const second = (await page.locator(`[data-box-id="${bands[1]}"]`).boundingBox())!;
    expect(second.y, "the new band sits below the one above it").toBeGreaterThanOrEqual(first.y + first.height - 2);
    expect(first.y < second.y + second.height && second.y < first.y + first.height, "they do NOT share a row").toBe(false);
  });
});
