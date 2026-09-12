import { test, expect, type Page } from "@playwright/test";

/**
 * ADDING A PHOTO GALLERY, driven through the REAL builder.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * The complaint this answers, in the user's words: *"there is no clear way to do this on the UI at the
 * moment"*. There wasn't — a gallery meant Columns → sweep a shape → drag an Image into each cell → upload
 * one file per dialog. Twelve photographs was twelve drags and twelve file dialogs, and nothing in the
 * palette said the word gallery.
 *
 * And it could not have worked anyway: an upload was stored at full size, so — measured — one 3000×2000
 * photograph is 1,260 KB as a data URL and the FIFTH one filled the browser's store. The save then threw,
 * the failure was swallowed, and every edit since was gone at the next reload.
 */

/** Photographs of genuinely different shapes, built in the page so the bytes are real. */
async function makePhotos(page: Page, shapes: [number, number][]) {
  return page.evaluate((ss) => ss.map(([w, h], i) => {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const x = c.getContext("2d")!;
    const g = x.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, `hsl(${(i * 53) % 360},60%,58%)`); g.addColorStop(1, `hsl(${(i * 53 + 70) % 360},55%,38%)`);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    // Noise, so the encoder cannot cheat and the measured sizes mean something.
    for (let k = 0; k < 900; k++) { x.fillStyle = `hsla(${Math.random() * 360},70%,60%,.5)`; x.fillRect(Math.random() * w, Math.random() * h, 30, 30); }
    return c.toDataURL("image/jpeg", 0.92);
  }), shapes);
}

const asFiles = (urls: string[]) => urls.map((u, i) => ({
  name: `sports day ${i + 1}.jpg`, mimeType: "image/jpeg", buffer: Buffer.from(u.split(",")[1], "base64"),
}));

async function freshBuilder(page: Page) {
  await page.goto("/website/box-demo");
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem("educo_box_site_cleaned_v1", "1"); });
  await page.reload();
  await page.waitForSelector("text=Box Builder", { timeout: 20000 });
  await page.waitForTimeout(800);
}

/** Open the palette and click the Photo gallery tile. */
async function openGallerySetup(page: Page) {
  await page.keyboard.press("b");
  await page.waitForTimeout(600);
  const tile = page.locator('[role="button"]', { hasText: "Photo gallery" }).first();
  await tile.scrollIntoViewIfNeeded();
  await tile.click();
  await expect(page.locator('[aria-label="Add a photo gallery"]')).toBeVisible({ timeout: 15000 });
}

/** Every grid in the saved tree, found by searching rather than by walking to a fixed depth —
 *  row bands sit between the page and a grid, and assuming otherwise reads the wrong node. */
const gridsOf = (page: Page) => page.evaluate(() => {
  const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
  const out: Record<string, unknown>[] = [];
  const walk = (n: Record<string, unknown>) => {
    if (n.layout === "grid") out.push(n);
    ((n.children as Record<string, unknown>[]) ?? []).forEach(walk);
  };
  walk(site.pages[0].root);
  // The picture inside a cell is found by SEARCHING, never by taking `children[0]`: `normalizeRowBands`
  // can put a row band between a cell and its contents, so a fixed depth reads the wrapper and reports
  // `undefined` for a value that is perfectly correct one level down.
  const firstImage = (n: Record<string, unknown>): Record<string, unknown> | undefined => {
    if (n.type === "image") return n;
    for (const c of (n.children as Record<string, unknown>[]) ?? []) { const hit = firstImage(c); if (hit) return hit; }
    return undefined;
  };
  return out.map((g) => ({
    cells: ((g.children as Record<string, unknown>[]) ?? []).length,
    spans: ((g.children as Record<string, unknown>[]) ?? []).map((c) => c.colSpan as number),
    columns: g.columns as number, gap: g.gap as number, rowFlow: g.rowFlow as string | undefined,
    alts: ((g.children as Record<string, unknown>[]) ?? []).map((c) => firstImage(c)?.alt as string | undefined),
  }));
});

test.describe("adding a photo gallery", () => {
  test("the palette has a tile that says gallery, and it asks before it adds", async ({ page }) => {
    await freshBuilder(page);
    await page.keyboard.press("b");
    await page.waitForTimeout(600);
    const tile = page.locator('[role="button"]', { hasText: "Photo gallery" });
    await expect(tile, "a person looking for a gallery must find the word").toHaveCount(1);
    // It ASKS rather than dropping something — the same rule Columns follows.
    await expect(tile.first()).toHaveAttribute("aria-haspopup", "menu");
    await tile.first().scrollIntoViewIfNeeded();
    await tile.first().click();
    await expect(page.locator('[aria-label="Add a photo gallery"]')).toBeVisible({ timeout: 15000 });
    expect(await gridsOf(page), "nothing is added until the question is answered").toHaveLength(0);
  });

  test("many photographs are chosen in ONE dialog and become one real grid", async ({ page }) => {
    await freshBuilder(page);
    await openGallerySetup(page);
    const urls = await makePhotos(page, [[3000, 2000], [2000, 3000], [2400, 2400], [3000, 1700], [1800, 2600], [2600, 1800], [2200, 2200]]);
    await page.setInputFiles('input[aria-label="Choose photos for the gallery"]', asFiles(urls));
    await expect(page.locator('[aria-label="Add a photo gallery"] li img'), "seven photos, one file dialog")
      .toHaveCount(7, { timeout: 30000 });

    await page.click('button[aria-label="4 photos across"]');
    await page.locator('[aria-label="Add a photo gallery"] button', { hasText: /^Add gallery of 7$/ }).click();
    await page.waitForTimeout(1500);

    const [grid] = await gridsOf(page);
    expect(grid.cells, "one cell per photograph").toBe(7);
    expect(grid.spans, "four across, in twelfths").toEqual([3, 3, 3, 3, 3, 3, 3]);
    expect(grid.columns, "and it is a real twelve-column grid, so every column control still works").toBe(12);
    expect(grid.alts?.[0], "alt text started from the file name rather than left empty").toBe("sports day 1");
    await expect(page.locator('[data-box-id] img'), "and every photograph is actually on the page").toHaveCount(7);
  });

  test("a photograph is stored downscaled, so a gallery fits in the browser at all", async ({ page }) => {
    await freshBuilder(page);
    await openGallerySetup(page);
    const urls = await makePhotos(page, Array.from({ length: 7 }, () => [3000, 2000] as [number, number]));
    const rawBytes = urls.reduce((a, u) => a + u.length, 0);
    await page.setInputFiles('input[aria-label="Choose photos for the gallery"]', asFiles(urls));
    await expect(page.locator('[aria-label="Add a photo gallery"] li img')).toHaveCount(7, { timeout: 30000 });
    await page.locator('[aria-label="Add a photo gallery"] button', { hasText: /^Add gallery of 7$/ }).click();
    await page.waitForTimeout(1500);

    const storedBytes = await page.evaluate(() => (localStorage.getItem("educo_box_site_v1") || "").length);
    expect(storedBytes, "seven photographs at full size would not fit in the store at all").toBeLessThan(rawBytes * 0.75);
    expect(storedBytes, "and the whole site stays well inside a 5MB browser store").toBeLessThan(3_500_000);
    // The longest edge is capped, which is why the above holds.
    const widest = await page.evaluate(() => {
      const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
      let w = 0; const walk = (n: Record<string, unknown>) => { if (n.type === "image") w = Math.max(w, (n.imgW as number) ?? 0); ((n.children as Record<string, unknown>[]) ?? []).forEach(walk); };
      walk(site.pages[0].root); return w;
    });
    expect(widest, "stored at the cap, not at whatever the camera produced").toBeLessThanOrEqual(1600);
  });

  test("a failed save is SAID, never swallowed", async ({ page }) => {
    // The bug this guards: `catch { /* ignore */ }`. With the store full, the page went on looking fine and
    // every edit since the last good save was gone at the next reload. Silent data loss, from one line.
    await freshBuilder(page);
    await page.evaluate(() => {
      const orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k: string, v: string) {
        if (k === "educo_box_site_v1") { const e = new DOMException("full", "QuotaExceededError"); throw e; }
        return orig.call(this, k, v);
      };
    });
    // A top-bar action, deliberately: a palette tile with looks to choose opens a menu instead of adding,
    // so the tree would never change and the save would never be attempted.
    await page.click('button:has-text("Add section")');
    await page.waitForTimeout(1200);

    // Next.js keeps an always-present empty `[role="alert"]` route announcer in the document, so the
    // selector has to exclude it or it matches that instead and reports an empty string.
    const alert = page.locator('[role="alert"]:not(#__next-route-announcer__)');
    await expect(alert, "the editor must say the page is no longer being saved").toBeVisible({ timeout: 10000 });
    await expect(alert).toContainText(/storage is full/i);
    await expect(alert, "and name the way out, not just the problem").toContainText(/export/i);
  });
});

test.describe("a photograph is not rounded unless someone asked", () => {
  // The standing rule is "nothing is rounded until someone asks", and its mechanism is "never write
  // border-radius by hand — emit it through the one resolver both renderers call". `ImageBox` defaulted to
  // rounding by `theme.radius * 1.25`, writing 20px inline onto EVERY photograph in the builder while the
  // node carried no radius and no control could explain it. The export emitted the node's radius as usual,
  // so it published square corners: canvas 20px, export 0px — canvas ≠ export, the direction where the
  // editor lies to you.
  const seedImage = (page: Page, radius?: number) => page.evaluate((r) => {
    const c = document.createElement("canvas"); c.width = 600; c.height = 400;
    const x = c.getContext("2d")!; x.fillStyle = "#4488cc"; x.fillRect(0, 0, 600, 400);
    const img = { id: "im1", type: "image", src: c.toDataURL("image/jpeg", 0.9), imgW: 600, imgH: 400, width: "100%", height: "auto", alt: "a photo", ...(r != null ? { radius: r, clip: true } : {}) };
    const site = { pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
      { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [
        { id: "g", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "100%", children: [
          { id: "c1", type: "container", layout: "flex", direction: "column", padding: 0, gap: 0, width: "100%", colSpan: 6, children: [img] }] }] }] } }], homeId: "p1" };
    localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  }, radius);

  /** The radius the canvas draws, and the radius the published page draws, for the same picture. */
  async function bothSides(page: Page) {
    const canvas = await page.evaluate(() => {
      const i = [...document.querySelectorAll("[data-box-id] img")].find((x) => (x as HTMLImageElement).src.startsWith("data:")) as HTMLImageElement;
      return { img: getComputedStyle(i).borderRadius, wrapper: getComputedStyle(i.closest("[data-box-id]")!).borderRadius };
    });
    await page.click('button:has-text("Preview")');
    await page.waitForTimeout(1800);
    const exported = await page.frameLocator("iframe").first().locator("img").first()
      .evaluate((i) => ({ img: getComputedStyle(i).borderRadius, wrapper: getComputedStyle(i.closest("div")!).borderRadius }));
    await page.click('button:has-text("Exit preview")');
    await page.waitForTimeout(500);
    return { canvas, exported };
  }

  test("with no radius set, the picture is square — on the canvas AND published", async ({ page }) => {
    await page.goto("/website/box-demo");
    await seedImage(page);
    await page.reload();
    await page.waitForTimeout(1800);
    const { canvas, exported } = await bothSides(page);
    expect(canvas.img, "nothing rounded it, so nothing is round").toBe("0px");
    expect(exported, "and the published page agrees").toEqual(canvas);
  });

  test("with a radius set, the canvas shows exactly what gets published", async ({ page }) => {
    await page.goto("/website/box-demo");
    await seedImage(page, 24);
    await page.reload();
    await page.waitForTimeout(1800);
    const { canvas, exported } = await bothSides(page);
    expect(canvas.wrapper, "the radius the user set, on the block whose control they used").toBe("24px");
    expect(exported, "canvas = export").toEqual(canvas);
  });
});
