import { test, expect, type Page } from "@playwright/test";
import { clearSite, openInspector, pressHeader } from "./helpers/seed-site";

/**
 * EVERY PICTURE A PERSON UPLOADS IS RESIZED, WHEREVER THEY UPLOAD IT (BATCH A-1 change (6)).
 * Scenarios: tests/features/components/website/box-builder-site.feature ("Every picture you upload is resized…").
 *
 * A1-10: an accordion item's picture could only be given as a URL — no upload, unlike a Picture block.
 * A1-12: the band background upload stored the RAW file (a FileReader, not `importPhoto`), so one photo straight off a
 * phone went into the browser's ~5 MB store at full size and shipped at full size in the download.
 */

/** A 3000 × 2000 photograph with noise, so its bytes are real. */
async function bigPhoto(page: Page) {
  const url = await page.evaluate(() => {
    const c = document.createElement("canvas"); c.width = 3000; c.height = 2000; const x = c.getContext("2d")!;
    x.fillStyle = "#4a7"; x.fillRect(0, 0, 3000, 2000);
    for (let k = 0; k < 3000; k++) { x.fillStyle = `hsla(${Math.random() * 360},70%,60%,.5)`; x.fillRect(Math.random() * 3000, Math.random() * 2000, 40, 40); }
    return c.toDataURL("image/jpeg", 0.92);
  });
  return { name: "assembly.jpg", mimeType: "image/jpeg", buffer: Buffer.from(url.split(",")[1], "base64") };
}

/** The saved site's first node matching `pick`, and the pixel width of the picture it returns. */
const savedWidth = (page: Page, which: "accordion" | "band") => page.evaluate(async (w) => {
  const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
  let src: string | undefined;
  const walk = (n: Record<string, unknown>) => {
    if (src) return;
    if (w === "accordion" && n.component === "accordion") src = ((n.items as { media?: string }[]) ?? [])[0]?.media;
    if (w === "band" && typeof n.bgImage === "string" && n.bgImage.startsWith("data:image")) src = n.bgImage;
    ((n.children as Record<string, unknown>[]) ?? []).forEach(walk);
  };
  for (const p of site.pages ?? []) walk(p.root);
  if (!src) return 0;
  const img = new Image(); img.src = src; await img.decode();
  return img.naturalWidth;
}, which);

async function freshBuilder(page: Page) {
  await clearSite(page);
  await page.waitForSelector('[aria-label="Open blocks panel"]', { timeout: 20000 });
  await page.waitForTimeout(800);
}

test.describe("every picture you upload is resized, wherever you upload it", () => {
  test("A1-10: an accordion item's picture can be uploaded, and it is resized to 1600px", async ({ page }) => {
    await freshBuilder(page);
    await page.keyboard.press("b");
    await page.waitForTimeout(600);
    const tile = page.locator('[role="button"]', { hasText: "Accordion" }).first();
    await tile.scrollIntoViewIfNeeded();
    await tile.click();
    await page.getByRole("menuitem", { name: /^Default$/ }).click();
    await page.waitForTimeout(800);
    await page.keyboard.press("b");
    await openInspector(page);
    await page.getByRole("tab", { name: "Content" }).click();
    const input = page.locator('input[aria-label="Upload item 1 image"]');
    await expect(input, "an Upload beside the item's picture URL").toHaveCount(1);
    await input.setInputFiles(await bigPhoto(page));
    await expect.poll(() => savedWidth(page, "accordion"), { timeout: 15000 }).toBeGreaterThan(0);
    expect(await savedWidth(page, "accordion"), "stored at 1600px, not the 3000px original").toBe(1600);
    await expect(page.getByRole("button", { name: "Replace item 1 picture" })).toBeVisible();
    // A1-14: the field does not dump ~700 KB of base64 into a text box — it says what is there, and still takes a URL
    await expect(page.getByLabel("Item 1 image", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("Item 1 image", { exact: true })).toHaveAttribute("placeholder", "Uploaded picture — or paste a URL");
  });

  test("A1-12: a band's background photo is resized to 1600px, not stored raw", async ({ page }) => {
    await freshBuilder(page); // the palette stays shut: on a phone it would cover the More sheet "Add a band" lives in
    await pressHeader(page, "Add a band");
    await page.waitForTimeout(800);
    await openInspector(page);
    await page.locator('input[aria-label="Upload background image"]').setInputFiles(await bigPhoto(page));
    await expect.poll(() => savedWidth(page, "band"), { timeout: 15000 }).toBeGreaterThan(0);
    expect(await savedWidth(page, "band"), "stored at 1600px, not the 3000px original").toBe(1600);
    await expect(page.getByLabel("Background image URL", { exact: true })).toHaveValue(""); // A1-14
    await expect(page.getByLabel("Background image URL", { exact: true })).toHaveAttribute("placeholder", "Uploaded picture — or paste a URL");
  });
});
