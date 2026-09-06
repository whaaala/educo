import { test, expect } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * AN IMAGE HOLDS ITS SHAPE — canvas = export, measured in a real browser.
 *
 * The unit tests assert what the markup SAYS. Only a browser can answer the question that matters: does the
 * box the picture will occupy exist before the picture does, and is it the same box on the canvas as on the
 * published page? A 4:3 photo in a 1000px-wide column must be 750px tall in both, from the first paint.
 *
 * See tests/features/components/website/box-builder-images.feature.
 */

/** A real 4:3 PNG (4×3 px, scaled by the layout), so the browser has something genuine to decode. */
const PNG_4x3 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAAHElEQVQI12P8//8/AzbAxIAHDGnJ/1gBIyPjMAAA//8DAIzBBRq3ZQ1cAAAAAElFTkSuQmCC";

/** `width: "100%"` is what createElement("image") gives a real image block — without it the block shrinks to
 *  fit an intrinsic width the browser does not have yet, which is not a shape any user would ever see. */
const imageTree = (patch: Record<string, unknown>): BoxNode => ({
  id: "root", type: "container", direction: "column", children: [
    { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [
      { id: "sec", type: "container", direction: "column", width: "fill", padding: 0, children: [
        { id: "pic", type: "image", src: PNG_4x3, alt: "A test photograph", width: "100%", ...patch },
      ] },
    ] },
  ],
} as unknown as BoxNode);

/** The rendered geometry and the attributes the browser was given up front. */
const inspect = (sel: string) => (page: import("@playwright/test").Page) =>
  page.locator(sel).evaluate((el) => {
    const img = (el.tagName === "IMG" ? el : el.querySelector("img")) as HTMLImageElement;
    const r = img.getBoundingClientRect();
    return {
      width: Math.round(r.width),
      height: Math.round(r.height),
      attrW: img.getAttribute("width"),
      attrH: img.getAttribute("height"),
      ratio: getComputedStyle(img).aspectRatio,
      alt: img.getAttribute("alt"),
      loading: img.getAttribute("loading"),
    };
  });

/** Load a tree into the builder's storage and open the canvas on it. */
async function openCanvas(page: import("@playwright/test").Page, root: BoxNode) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/website/box-demo");
  await page.evaluate((tree) => {
    localStorage.setItem("educo_box_site_v1", JSON.stringify({
      homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: tree }],
    }));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  }, root as unknown as Record<string, unknown>);
  await page.reload();
  await page.waitForSelector('[data-box-id="pic"] img', { timeout: 20000 });
}

test.describe("an image that knows its own shape", () => {
  test("the EXPORT gives the picture its natural shape when it is not cropped", async ({ page }) => {
    const site = siteFromRoot(imageTree({ height: "auto", imgW: 4, imgH: 3 }));
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }),
      { waitUntil: "domcontentloaded" });

    const m = await inspect("img")(page);
    expect(m.attrW, "the browser is told the size up front").toBe("4");
    expect(m.attrH).toBe("3");
    expect(m.alt).toBe("A test photograph");
    // The picture is 4:3, so whatever width the column gives it, its height follows.
    expect(Math.abs(m.height - (m.width * 3) / 4), "rendered at 4:3").toBeLessThanOrEqual(1);
    expect(m.height, "and NOT the old fixed letterbox").not.toBe(260);
  });

  test("the CANVAS gives it the same shape, to the same pixel", async ({ page }) => {
    await openCanvas(page, imageTree({ height: "auto", imgW: 4, imgH: 3 }));
    const m = await inspect('[data-box-id="pic"]')(page);
    expect(Math.abs(m.height - (m.width * 3) / 4), "the editor must show what will be published").toBeLessThanOrEqual(1);
    expect(m.attrW).toBe("4");
    expect(m.attrH).toBe("3");
  });

  test("a height set by hand still crops — in BOTH places", async ({ page }) => {
    const cropped = { height: "420px", imgW: 4, imgH: 3 };

    const site = siteFromRoot(imageTree(cropped));
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }),
      { waitUntil: "domcontentloaded" });
    const exported = await inspect("img")(page);
    expect(exported.height).toBe(420);

    await openCanvas(page, imageTree(cropped));
    const canvas = await inspect('[data-box-id="pic"]')(page);
    expect(canvas.height, "canvas = export").toBe(exported.height);
  });

  test("an unmeasured picture keeps the old letterbox rather than collapsing to nothing", async ({ page }) => {
    // The failure this guards against: `height:auto` + `object-fit:cover` with no known ratio is a box of
    // zero height — the picture would simply not be there.
    const site = siteFromRoot(imageTree({ height: "auto" }));
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }),
      { waitUntil: "domcontentloaded" });

    const m = await inspect("img")(page);
    expect(m.height).toBe(260);
    expect(m.attrW, "no measurement means no attribute, not a guess").toBeNull();
  });

  test("the box exists BEFORE the picture does — nothing below it moves as it loads", async ({ page }) => {
    // The actual CLS test. The image is served from a URL that never responds, so the picture never arrives;
    // the heading beneath it must already be in its final place.
    const site = siteFromRoot({
      id: "root", type: "container", direction: "column", children: [
        { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [
          { id: "sec", type: "container", direction: "column", width: "fill", padding: 0, children: [
            { id: "pic", type: "image", src: "/never-arrives.jpg", alt: "Slow", width: "100%", height: "auto", imgW: 4, imgH: 3 },
            { id: "cap", type: "heading", text: "Underneath" },
          ] },
        ] },
      ],
    } as unknown as BoxNode);

    await page.route("**/never-arrives.jpg", () => { /* deliberately never fulfilled */ });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }),
      { waitUntil: "domcontentloaded" });

    const img = await page.locator("img").boundingBox();
    const heading = await page.locator("h2").boundingBox();
    expect(img!.height, "the box is reserved from the very first paint").toBeGreaterThan(100);
    expect(heading!.y, "the heading already sits below the reserved box").toBeGreaterThan(img!.y + img!.height - 2);
  });

  test("uploading a photograph measures it, for real, through the real control", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/website/box-demo");
    await page.evaluate(() => {
      localStorage.setItem("educo_box_site_v1", JSON.stringify({
        homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: {
          id: "root", type: "container", direction: "column", children: [
            { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [
              { id: "sec", type: "container", direction: "column", width: "fill", padding: 0, children: [
                { id: "pic", type: "image", src: "", width: "100%", height: "auto" },
              ] },
            ] },
          ] } }],
      }));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    });
    await page.reload();
    await page.waitForSelector('[data-box-id="pic"]', { timeout: 20000 });

    // A real 8×2 PNG through the real file input — this is the path a school actually uses.
    await page.locator('input[aria-label="Upload image"]').setInputFiles({
      name: "wide.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAgAAAACCAIAAADq9gq6AAAAFklEQVQI12P8//8/AzbAhFVsRCkAAgAA//8DAAoAAv8ZQdEAAAAASUVORK5CYII=",
        "base64"),
    });

    await expect.poll(async () =>
      page.locator('[data-box-id="pic"] img').getAttribute("width"), { timeout: 15000 },
    ).toBe("8");
    expect(await page.locator('[data-box-id="pic"] img').getAttribute("height")).toBe("2");

    // …and the block immediately takes that 4:1 shape, without the user touching anything else.
    const m = await inspect('[data-box-id="pic"]')(page);
    expect(Math.abs(m.height - m.width / 4)).toBeLessThanOrEqual(1);
  });
});
