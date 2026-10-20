import { test, expect, type Page, type Locator } from "@playwright/test";
import path from "node:path";
import { clearSite, pressHeader } from "./helpers/seed-site";
import INSPECTOR from "../../config/inspector.json";

/**
 * CHANGING THE WORDS AND THE PICTURES OF A READY-MADE SECTION IS OBVIOUS (BATCH LE-15k LE15k-4 —
 * tests/features/components/website/box-builder-spacing.feature, "Words say they can be typed into", "A selected <block> offers
 * 'Edit text' by name", "A selected <block> offers 'Replace picture' by name", "A block with no photo offers no 'Replace picture'").
 *
 * Measured through the UI, 2026-10-20 (School home, 1440): the words took a caret on the first click but nothing said so; the
 * hero's photo is the SECTION's background, and with the hero selected nothing on the canvas could replace it (LE15k-as … au).
 * Built the way a person builds it: Add page → the School home template, blocks selected by clicking them.
 */
const T = INSPECTOR.sections, SEL = INSPECTOR.selection;
const PHOTO = path.join(__dirname, "../../public/sections/classroom-800.webp");

async function selectBy(page: Page, target: Locator, is: (el: Element) => boolean) {
  await target.evaluate((e) => e.scrollIntoView({ block: "center", inline: "center" }));
  for (let i = 0; i < 6; i++) {
    await target.click();
    await page.waitForTimeout(300);
    const ok = await page.evaluate((src) => {
      const id = document.querySelector("[data-chrome-mirror]")?.getAttribute("data-chrome-mirror");
      const el = id ? document.querySelector(`[data-box-id="${CSS.escape(id)}"]`) : null;
      return !!el && (new Function("el", `return (${src})(el)`) as (e: Element) => boolean)(el);
    }, is.toString());
    if (ok) return;
  }
  throw new Error("could not select it by clicking");
}
const toolbar = (page: Page) => page.getByRole("toolbar", { name: "Block toolbar" });
const heroBg = (page: Page) => page.evaluate(() => { const h = Array.from(document.querySelectorAll("h1,h2")).find((e) => /Welcome to/.test(e.textContent ?? "")); return getComputedStyle(h!.closest("section")!).backgroundImage; });

for (const [w, h] of [[1440, 900], [375, 812]] as const) {
  test.describe(`at ${w}px`, () => {
    test.use({ viewport: { width: w, height: h } });
    test("LE15k-4 · the words say they can be typed into, and Edit text / Replace picture are named on the toolbar", async ({ page }) => {
      test.setTimeout(120_000);
      await clearSite(page, undefined, { phoneScreen: true });
      await pressHeader(page, "Add page");
      const d = page.getByRole("dialog", { name: T.addPageTitle });
      await d.getByRole("textbox").fill("Home 2");
      await d.getByRole("button", { name: /^Add School home,/ }).click();
      await page.getByText(/Open day on Saturday/).first().waitFor();

      // the words: a pointer on them lands on the words themselves, which say "Click to type"
      const title = page.getByText(/Welcome to/).first();
      await title.evaluate((e) => e.scrollIntoView({ block: "center" }));
      const under = await title.evaluate((e) => { const r = e.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) as HTMLElement | null; return { editable: !!t?.isContentEditable, title: t?.closest("[contenteditable]")?.getAttribute("title") }; });
      expect(under, "the title's words are under the pointer and say so").toEqual({ editable: true, title: SEL.typeHere });

      // the hero: Replace picture, its background, one Undo
      const tag = (el: Element) => el.tagName === "SECTION";
      await selectBy(page, page.getByText(/Open day on Saturday/).first(), tag);
      await expect(toolbar(page).getByRole("button", { name: SEL.editText }), "a section has no words of its own").toHaveCount(0);
      const before = await heroBg(page);
      const chooser = page.waitForEvent("filechooser");
      await toolbar(page).getByRole("button", { name: SEL.replacePicture }).click();
      await (await chooser).setFiles(PHOTO);
      await expect.poll(() => heroBg(page), { message: "the hero shows the new photo" }).toContain("data:image");
      await page.keyboard.press("Control+z");
      await expect.poll(() => heroBg(page), { message: "one Ctrl+Z takes it back" }).toBe(before);

      // the title: Edit text puts the caret at the end; what is typed changes the words
      await page.keyboard.press("Escape"); await page.keyboard.press("Escape");
      await selectBy(page, title, (el) => /^H[1-6]$/.test(el.tagName) || (!!el.querySelector("h1,h2") && !el.querySelector("p")));
      await expect(toolbar(page).getByRole("button", { name: SEL.replacePicture }), "a title has no photo").toHaveCount(0);
      await toolbar(page).getByRole("button", { name: SEL.editText }).click();
      await page.keyboard.type(" today");
      await expect(page.getByText(/Welcome to Greenfield Academy today/).first()).toBeVisible();

      // a picture: Replace picture on the toolbar too
      await page.keyboard.press("Escape"); await page.keyboard.press("Escape"); await page.keyboard.press("Escape");
      const pic = page.locator("[data-box-id] img").nth(1);
      await selectBy(page, pic, (el) => el.querySelectorAll("img").length === 1 && !el.querySelector("h1,h2,h3,h4,p,a"));
      const src0 = await pic.getAttribute("src");
      const c2 = page.waitForEvent("filechooser");
      await toolbar(page).getByRole("button", { name: SEL.replacePicture }).click();
      await (await c2).setFiles(PHOTO);
      await expect.poll(() => pic.getAttribute("src"), { message: "the picture shows the new photo" }).not.toBe(src0);
    });
  });
}
