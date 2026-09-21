import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * THE PREVIEW GIVES THE PAGE THE SCREEN IT PROMISES.
 *
 * Behaviours: tests/features/components/website/box-builder-site.feature.
 *
 * "Why does the preview not present based on what a user will see based on the screen they're using?"
 *
 * `globals.css` carries an UNLAYERED `img, picture, video, svg, iframe, embed, object { max-width: 100% }`,
 * which beats every Tailwind utility on the element — the cascade trap this project has already hit once,
 * when `h-full` never applied to an `<img>`. The preview frame was therefore clamped to whatever space
 * happened to be free.
 *
 * Measured on a 1440px screen: **Wide** asked for 1920px and rendered 1392px, and the frame's own
 * `innerWidth` was 1392 too — so the page inside laid itself out at the DESKTOP rung (1200+) instead of the
 * big-desktop rung (1800+). The preview was not merely small; it showed a DIFFERENT LAYOUT from the one its
 * label named, silently. Every narrower size was honest, which is exactly what kept it hidden.
 *
 * The assertion that matters is on `innerWidth`/`innerHeight` — the numbers the page's own media queries
 * read — never on how big the frame looks. A guard written against the visible size would pass on a scaled
 * frame while the layout inside was still wrong.
 */

const VIEWPORT = { width: 1440, height: 900 };

async function openPreview(page: Page) {
  await seedSite(page, sitePage([
    { id: "a", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 300, background: "#4d8c0f", children: [] },
  ]));
  await page.waitForSelector('[data-box-id="a"]', { timeout: 30000 });
  await page.waitForTimeout(400);
  await page.click('button:has-text("Preview")');
  await page.waitForSelector('iframe[title="Site preview"]', { timeout: 15000 });
  await page.waitForTimeout(700);
}

/**
 * Pick from one of the bar's dropdowns, the way a person does.
 *
 * `CompactSelect` opens from a BUTTON carrying `aria-haspopup="listbox"` — the ARIA 1.0 pattern — so it is
 * addressed by its accessible name as a button, not as a combobox. Worth stating: a `getByRole("combobox")`
 * here does not fail, it HANGS, and nine tests each waiting out a 120s timeout looks like a broken app.
 */
const openMenu = (page: Page, name: string) => page.getByRole("button", { name, exact: true }).click();

async function chooseScreen(page: Page, label: string) {
  await openMenu(page, "Preview screen size");
  await page.getByRole("option", { name: label, exact: true }).click();
  await page.waitForTimeout(500);
}

async function chooseZoom(page: Page, label: string) {
  await openMenu(page, "Preview zoom");
  await page.getByRole("option", { name: label, exact: true }).click();
  await page.waitForTimeout(500);
}

/**
 * What the PAGE sees, and what the person sees — two different numbers, and the bug separated them.
 *
 * The stage is addressed by `[data-preview-stage]`, never by `parentElement`: the frame's parent is the
 * sizer that reserves its scaled box, so walking up one level would measure the frame against itself and
 * every gutter and overflow assertion below would pass by construction.
 */
const frame = (page: Page) => page.evaluate(() => {
  const f = document.querySelector('iframe[title="Site preview"]') as HTMLIFrameElement;
  const stage = document.querySelector("[data-preview-stage]") as HTMLElement;
  const r = f.getBoundingClientRect(), host = stage.getBoundingClientRect();
  return {
    innerWidth: f.contentWindow!.innerWidth,
    innerHeight: f.contentWindow!.innerHeight,
    visualWidth: Math.round(r.width),
    withinStage: r.left >= host.left - 1 && r.right <= host.right + 1,
    /**
     * The smaller side gutter. `withinStage` alone is not enough: `clientWidth` INCLUDES padding, so fitting
     * to it drew the frame exactly as wide as the stage's border box — still "within" it by a border-box
     * test, while the 24px gutter and the card's rounded corners, ring and shadow were all off the window.
     * The gutter is the thing that was lost, so the gutter is what gets asserted.
     */
    gutter: Math.round(Math.min(r.left - host.left, host.right - r.right)),
    readout: document.querySelector("output")?.textContent?.trim() ?? "",
  };
});

test.describe("the preview's screen sizes", () => {
  test.use({ viewport: VIEWPORT });

  for (const [label, w, h] of [
    ["Mobile — 375 × 812", 375, 812],
    ["Tablet — 768 × 1024", 768, 1024],
    ["Desktop — 1280 × 800", 1280, 800],
    ["Wide — 1920 × 1080", 1920, 1080],
    ["iPhone SE", 375, 667],
    ["iPad Mini", 768, 1024],
  ] as const) {
    test(`"${label}" lays the page out at ${w} x ${h}`, async ({ page }) => {
      await openPreview(page);
      await chooseScreen(page, label);
      const f = await frame(page);

      expect(f.innerWidth, `the page was given ${f.innerWidth}px of width, so its media queries picked the wrong rung`).toBe(w);
      expect(f.innerHeight, "and the height a one-screen-tall block measures itself against").toBe(h);
      expect(f.withinStage, "shown in full rather than running off the side").toBe(true);
      expect(f.readout, "with the width stated").toContain(String(w));
    });
  }

  test("a screen too big for my own is SCALED, and says so", async ({ page }) => {
    // 1920 x 1080 cannot fit on a 1440 x 900 screen. It must still be laid out at 1920 x 1080 and shown
    // shrunk — never re-laid out smaller (the defect), and never cut off (the other way to get it wrong).
    await openPreview(page);
    await chooseScreen(page, "Wide — 1920 × 1080");
    const f = await frame(page);

    expect(f.innerWidth, "laid out at the full width").toBe(1920);
    expect(f.innerHeight, "and the full height").toBe(1080);
    expect(f.visualWidth, "but drawn smaller, because the screen is smaller").toBeLessThan(1920);
    expect(f.readout, "and the zoom is stated, so a shrunken preview is never a mystery").toMatch(/%/);
    expect(f.gutter, "and it still sits INSIDE the stage's padding, as a card with edges").toBeGreaterThan(8);
  });

  test("a screen that fits is shown at 1:1, with no zoom claimed", async ({ page }) => {
    await openPreview(page);
    await chooseScreen(page, "iPhone SE");
    const f = await frame(page);

    expect(f.visualWidth, "drawn at its true size").toBe(375);
    expect(f.readout, "so no percentage is shown").not.toMatch(/%/);
  });

  test("ROTATING swaps the screen over, and rotating back lands exactly where it started", async ({ page }) => {
    /**
     * Rotation is a VIEW of the size, never a write to it. If it wrote, the numbers would drift a little
     * each turn and a preset would stop being recognisable the moment you turned the phone.
     */
    await openPreview(page);
    await chooseScreen(page, "iPhone SE");
    expect(await frame(page)).toMatchObject({ innerWidth: 375, innerHeight: 667 });

    await page.getByRole("button", { name: "Rotate the preview" }).click();
    await page.waitForTimeout(500);
    const landscape = await frame(page);
    expect(landscape.innerWidth, "on its side, the width is what the height was").toBe(667);
    expect(landscape.innerHeight).toBe(375);

    await page.getByRole("button", { name: "Rotate the preview" }).click();
    await page.waitForTimeout(500);
    expect(await frame(page), "and back again, to the very same numbers").toMatchObject({ innerWidth: 375, innerHeight: 667 });
  });

  test("typing a width gives the page exactly that, and the menu says Custom", async ({ page }) => {
    /**
     * TYPED, one key at a time — never `fill()`.
     *
     * `fill()` sets the whole value in a single event, which is the one way of entering a number that the
     * broken version handled. Bound straight to the size and refusing anything under 120, the field ate
     * "5" on the way to "500", re-rendered from the unchanged size and threw the keystroke away; every
     * digit after it went the same way. A guard using `fill()` sailed straight over that — this one is
     * written the way a person actually types.
     */
    await openPreview(page);
    await chooseScreen(page, "iPhone SE");

    const w = page.getByRole("spinbutton", { name: "Preview width in pixels" });
    await w.click();
    await w.press("Control+a");
    await w.pressSequentially("500", { delay: 60 });
    await page.waitForTimeout(600);

    await expect(w, "the field holds what was typed, digit by digit").toHaveValue("500");

    expect((await frame(page)).innerWidth, "the number typed is the number used").toBe(500);
    await expect(
      page.getByRole("button", { name: "Preview screen size", exact: true }),
      "and the preset it no longer matches stops claiming to be selected",
    ).toContainText("Custom");
  });

  test("an explicit zoom is obeyed, rather than quietly refitted", async ({ page }) => {
    await openPreview(page);
    await chooseScreen(page, "iPhone SE");
    await chooseZoom(page, "50%");
    const half = await frame(page);

    expect(half.innerWidth, "the page still gets its real width").toBe(375);
    expect(half.visualWidth, "drawn at half size").toBeLessThan(375);
    expect(half.readout).toContain("50%");
  });

  test("zoomed PAST the window, every part can still be scrolled to", async ({ page }) => {
    /**
     * A CSS transform does not change the box layout reserves, and it only ever creates SCROLLABLE overflow
     * towards the end edge. Scaled in place from `top center`, the frame grew out of BOTH sides of the stage
     * and the left-hand strip became permanently unreachable — measured at 200%: left edge at -78px while
     * `scrollLeft` could only travel 0…78. Scrolling right went further right; nothing brought it back.
     *
     * This is what "none of the zoom options is being followed" looks like from the outside, and it is why
     * the assertion is about REACHABILITY rather than about the transform, which was correct all along.
     */
    await openPreview(page);
    await chooseScreen(page, "Desktop — 1280 × 800");
    await chooseZoom(page, "200%");

    const reach = await page.evaluate(() => {
      const f = document.querySelector('iframe[title="Site preview"]') as HTMLIFrameElement;
      const stage = document.querySelector("[data-preview-stage]") as HTMLElement;
      stage.scrollLeft = 0;
      const atRest = f.getBoundingClientRect().left - stage.getBoundingClientRect().left;
      stage.scrollLeft = stage.scrollWidth; // as far right as it will go
      const far = f.getBoundingClientRect().right - stage.getBoundingClientRect().right;
      stage.scrollLeft = 0;
      return { hiddenOnLeftAtRest: Math.round(atRest), stillHiddenOnRight: Math.round(far) };
    });

    expect(reach.hiddenOnLeftAtRest, "nothing is lost off the left before you even scroll").toBeGreaterThanOrEqual(0);
    expect(reach.stillHiddenOnRight, "and scrolling right reaches the far edge").toBeLessThanOrEqual(1);
  });

  test("Responsive uses the WHOLE screen, and the size controls stand down", async ({ page }) => {
    /**
     * Responsive was capped at `64rem`. That is a sensible reading width for an article and the wrong thing
     * for a preview: on a 1440px window the page was drawn 1024px across with empty gutters either side —
     * neither the screen the person is on nor anything a visitor would see. Reported from a screenshot of
     * exactly those gutters. The assertion is therefore on the STAGE, not on some number over 375.
     */
    await openPreview(page);
    await chooseScreen(page, "iPhone SE");
    await chooseScreen(page, "Responsive");

    await expect(page.getByRole("spinbutton", { name: "Preview width in pixels" }), "nothing to type into").toBeDisabled();
    await expect(page.getByRole("button", { name: "Rotate the preview" }), "and nothing to rotate").toBeDisabled();

    const f = await frame(page);
    const stageW = await page.evaluate(() => {
      const host = document.querySelector("[data-preview-stage]") as HTMLElement;
      const cs = getComputedStyle(host);
      return Math.round(host.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0));
    });

    expect(f.readout).toContain("Responsive");
    expect(f.innerWidth, "the frame takes the whole stage, not a reading-width slice of it").toBe(stageW);
    expect(stageW, "and the stage really is wider than the old 1024px cap, so this could fail").toBeGreaterThan(1024);
  });

  test("switching to Responsive drops a zoom it is no longer applying", async ({ page }) => {
    // A disabled box still reading "50%" while nothing is scaled is a control lying about what it does.
    await openPreview(page);
    await chooseScreen(page, "iPhone SE");
    await chooseZoom(page, "50%");
    await chooseScreen(page, "Responsive");

    await expect(page.getByRole("button", { name: "Preview zoom", exact: true })).toContainText("Fit to window");
    expect((await frame(page)).readout, "and nothing claims a percentage").not.toMatch(/%/);
  });
});
