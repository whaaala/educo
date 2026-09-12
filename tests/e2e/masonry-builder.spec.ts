import { test, expect, type Page } from "@playwright/test";

/**
 * MASONRY through the REAL builder — the control, and canvas = export.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature ("Row heights").
 *
 * `masonry.spec.ts` renders the EXPORT and measures what a visitor gets. This one loads `/website/box-demo`,
 * seeds a gallery, and uses the panel — because three of the claims can only be made about the editor:
 *   • the control is where the plan said, with `Even` already chosen on a grid nobody has touched;
 *   • pressing "Follow the picture" staggers the CANVAS, not just the exported file;
 *   • "Rows tall" and "Start at row" are GONE inside a masonry row, because there they would do nothing.
 *
 * The device chip matters here and is the reason the desktop one is selected before anything is measured. The
 * static spans are worked out against the page MEASURE at each rung, so they are exact when the frame is a
 * real screen width. "Full width" squeezes the page into whatever is left beside the inspector, which is not
 * a width any visitor has — so the gaps there are a little loose, exactly as they are on an edge-to-edge band.
 */

const PHOTOS: [number, number][] = [[400, 900], [400, 300], [400, 520], [400, 260], [400, 700], [400, 380]];

/**
 * A picture of an exact shape, with no bytes to fetch.
 *
 * BASE64, not `;utf8,` + percent-encoding. That second form is written everywhere on the web and Chrome
 * rejects it: `utf8` is not a media-type parameter, so the whole URI is dropped and every image on the page
 * is broken. The layout still looked plausible — `aspect-ratio` comes from the stored `imgW`/`imgH`, so the
 * boxes keep their shape whether or not the picture ever arrives — which is exactly why it is worth stating
 * here rather than leaving to be re-discovered.
 */
const svg = (w: number, h: number) =>
  "data:image/svg+xml;base64," + Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#2d6cdf"/></svg>`,
    "utf8",
  ).toString("base64");

async function seedGallery(page: Page) {
  await page.goto("/website/box-demo");
  await page.evaluate(({ photos, srcs }) => {
    const cells = photos.map(([w, h], i) => ({
      id: `cell${i}`, type: "container", layout: "flex", direction: "column",
      padding: 0, gap: 0, width: "100%", colSpan: 4, height: "auto",
      children: [{ id: `img${i}`, type: "image", src: srcs[i], alt: `photo ${i + 1}`, width: "100%", height: "auto", imgW: w, imgH: h }],
    }));
    const site = {
      pages: [{ id: "p1", name: "Home", path: "/", root: {
        id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
          { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, sectionWidth: "contained", children: [
            { id: "gallery", type: "container", layout: "grid", columns: 12, gap: 16, padding: 0, width: "100%", children: cells },
          ] },
        ],
      } }],
      homeId: "p1",
    };
    localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  }, { photos: PHOTOS, srcs: PHOTOS.map(([w, h]) => svg(w, h)) });
  await page.reload();
  await page.waitForSelector('[data-box-id="gallery"]', { timeout: 15_000 });
  // A real screen width, so what the editor draws is what a visitor at that width gets.
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.locator('[aria-label="Desktop (1280px)"]').click();
  await page.waitForTimeout(400);
}

/** Select the grid itself: one click in the space between two cells, which belongs to the grid. */
async function selectGallery(page: Page) {
  const g = (await page.locator('[data-box-id="gallery"]').boundingBox())!;
  const a = (await page.locator('[data-box-id="cell0"]').boundingBox())!;
  await page.mouse.click(a.x + a.width + 6, g.y + 120); // the gap between column one and column two
  await page.waitForTimeout(300);
  await expect(page.locator(".outline-indigo-500")).toHaveAttribute("data-box-id", "gallery");
  await openSection(page, "Arrange");
}

/** Expand an inspector section — and ONLY if it is closed. Arrange opens by default, so an unconditional
 *  click shuts it, and every assertion after that looks like a missing control rather than a closed drawer. */
async function openSection(page: Page, name: string) {
  const head = page.getByRole("button", { name, exact: true });
  if ((await head.getAttribute("aria-expanded")) !== "true") {
    await head.click();
    await page.waitForTimeout(300);
  }
  await expect(head).toHaveAttribute("aria-expanded", "true");
}

/**
 * Select a CELL rather than the grid it is in — click once for the box, again to step inside.
 *
 * Escape first, because the two-click step is relative to what is already selected: coming in with the grid
 * selected, the first click lands on the cell and the second steps PAST it into the block within. A quarter
 * across and three quarters down misses all eight of the selected grid's resize handles.
 */
async function selectCell(page: Page, id: string) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  const x = b.x + b.width * 0.25, y = b.y + b.height * 0.75;
  await page.mouse.click(x, y);
  await page.waitForTimeout(150);
  await page.mouse.click(x, y);
  await page.waitForTimeout(250);
  await expect(page.locator(`[data-box-id="${id}"]`)).toHaveClass(/outline-indigo-500/);
}

const cellsOf = (page: Page) =>
  page.locator('[data-box-id="gallery"] > [data-box-id]').evaluateAll((els) => els.map((el) => {
    const r = el.getBoundingClientRect();
    return { id: el.getAttribute("data-box-id"), top: r.top, bottom: r.bottom, left: r.left, height: r.height };
  }));

test.describe("masonry in the builder", () => {
  test("the control is in Arrange, and a grid nobody has touched is already on Even", async ({ page }) => {
    await seedGallery(page);
    await selectGallery(page);
    const group = page.locator('[aria-label="Row heights"]');
    await expect(group).toBeVisible();
    await expect(group.getByRole("button", { name: "Even" })).toHaveAttribute("aria-pressed", "true");
    // The tick-box is part of masonry, so it is not offered until masonry is chosen.
    await expect(page.getByLabel("Measure on the page")).toHaveCount(0);
  });

  test("pressing Follow the picture staggers the CANVAS", async ({ page }) => {
    await seedGallery(page);
    const before = await cellsOf(page);
    // Even rows: every cell in the row is the same height, and the second row begins below the tallest.
    expect(before[1].height).toBeCloseTo(before[0].height, 0);
    expect(before[3].top).toBeGreaterThan(before[0].bottom - 4);

    await selectGallery(page);
    await page.locator('[aria-label="Row heights"] button', { hasText: "Follow the picture" }).click();
    await page.waitForTimeout(500);

    const after = await cellsOf(page);
    expect(after[1].height, "each cell is now as tall as its own picture").toBeLessThan(after[0].height - 100);
    expect(after[3].left, "the fourth fills the middle column").toBeCloseTo(after[1].left, 0);
    expect(after[3].top, "and does not wait for the tall one").toBeLessThan(after[0].bottom - 40);
    expect(after[3].top).toBeGreaterThan(after[1].bottom - 4);
  });

  test("the editor's gaps are the visitor's gaps at a real screen width", async ({ page }) => {
    // The claim B rests on: a contained band sits on the page measure, which is a constant within each rung,
    // so the static span is exact rather than approximate — and the editor shows exactly that.
    await seedGallery(page);
    await selectGallery(page);
    await page.locator('[aria-label="Row heights"] button', { hasText: "Follow the picture" }).click();
    await page.waitForTimeout(500);
    const cs = await cellsOf(page);
    const down = cs[3].top - cs[1].bottom;
    expect(down, "the 16px asked for, not a rounding artefact").toBeGreaterThan(8);
    expect(down, "and not a hole left by a width that was only guessed at").toBeLessThan(32);
  });

  test("Rows tall and Start at row are gone inside a masonry row", async ({ page }) => {
    await seedGallery(page);
    await selectGallery(page);
    await page.locator('[aria-label="Row heights"] button', { hasText: "Follow the picture" }).click();
    await page.waitForTimeout(400);
    await selectCell(page, "cell0");
    await openSection(page, "Grid cell");
    await expect(page.getByLabel("Columns wide"), "the ACROSS controls still mean something").toBeVisible();
    await expect(page.getByLabel("Rows tall"), "there are no rows to be tall in").toHaveCount(0);
    await expect(page.getByLabel("Start at row")).toHaveCount(0);
  });

  test("choosing Even again puts every pixel back", async ({ page }) => {
    await seedGallery(page);
    const before = await cellsOf(page);
    await selectGallery(page);
    await page.locator('[aria-label="Row heights"] button', { hasText: "Follow the picture" }).click();
    await page.waitForTimeout(400);
    await page.locator('[aria-label="Row heights"] button', { hasText: "Even" }).click();
    await page.waitForTimeout(400);
    const after = await cellsOf(page);
    for (const [i, c] of after.entries()) {
      expect(c.top, `cell ${i} is back where it was`).toBeCloseTo(before[i].top, 0);
      expect(c.height).toBeCloseTo(before[i].height, 0);
    }
    // …and the field is removed rather than written as "even", so the saved page is the file it always was.
    const stored = await page.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}")));
    expect(stored).not.toContain("rowFlow");
  });
});

test.describe("what masonry uncovered on the way", () => {
  test("the page column in the EDITOR is the one the device chip asks for", async ({ page }) => {
    // A BUG MASONRY MADE VISIBLE. `--eu-measure` is published per rung through MEDIA queries, and a media
    // query reads the browser WINDOW — which in the editor is the whole screen, not the frame being previewed
    // in. On a wide monitor, picking Desktop drew every CONTAINED band at the wide rung's 76rem cap: a
    // 1184px column where a visitor at 1280 gets 1088. Nothing in the class names said so, and the export was
    // right the whole time — the editor was the thing lying, which is the worse direction.
    //
    // Masonry only made it visible because it is the first feature whose arithmetic depends on the column's
    // width: the spans came out short, and the gaps between pictures collapsed to nothing.
    await seedGallery(page); // seeds, then picks Desktop (1280) in an 1800px window — the exact trap
    const width = await page.locator('[data-box-id="gallery"]').evaluate((el) => el.getBoundingClientRect().width);
    expect(width, "68rem, the desktop rung's measure — not the wide rung's 76rem").toBeCloseTo(68 * 16, 0);
  });

  test("an icon-only toolbar button says what it is", async ({ page }) => {
    // The device chips are the app's one row of icon-only buttons and they carried a `title` and nothing
    // else. A `title` is the LAST thing an accessible name is computed from: a tooltip a screen reader may
    // announce or truncate, and that a keyboard user never sees. WCAG 4.1.2, and it is why this very file
    // could not find the chip it needed to click.
    await page.goto("/website/box-demo");
    await page.waitForSelector('[aria-label="Preview screen size"]');
    const named = await page.locator('[aria-label="Preview screen size"] button').evaluateAll((els) =>
      els.map((el) => el.getAttribute("aria-label") || el.textContent?.trim() || ""));
    expect(named).toEqual(["Mobile (375px)", "Tablet (768px)", "Laptop (1024px)", "Desktop (1280px)", "Wide (1920px)", "Full width"]);
  });
});
