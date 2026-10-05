import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";
import { PRESETS_FLAT } from "@/lib/preview-devices";

/**
 * THE MENU'S OWN LABEL for a device, looked up by id — never re-typed here.
 *
 * These tests used to name the options as literal strings — the label typed out in the call. Then the catalogue
 * grew from a handful of sizes to sixty real models and every label gained its dimensions and its
 * generation — "iPhone SE (3rd gen) — 375 × 667". Nine tests then sat waiting 120 seconds each for an
 * option that no longer existed, which reads as a hung app rather than as a renamed string.
 *
 * Looking the label up by id makes a rename a no-op and a REMOVAL an immediate, explicit failure naming the
 * id — the two outcomes a hard-coded string gets exactly backwards.
 */
const screenLabel = (id: string): string => {
  const preset = PRESETS_FLAT.find((d) => d.id === id);
  if (!preset) throw new Error(`No preset "${id}" in the catalogue — it was renamed or removed, not merely relabelled.`);
  return preset.label;
};

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

  // The SIZES are stated here on purpose — that a screen called 375 × 667 actually lays the page out at
  // 375 × 667 is the claim. Only the labels are read from the catalogue, so a rename cannot break the test
  // and a wrong number cannot pass it.
  for (const [id, w, h] of [
    ["rung-mobile", 375, 812],
    ["rung-tablet", 768, 1024],
    ["rung-desktop", 1280, 800],
    ["rung-wide", 1920, 1080],
    ["iphone-se-3", 375, 667],
    ["ipad-mini-2019", 768, 1024],
  ] as const) {
    const label = screenLabel(id);
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
    await chooseScreen(page, screenLabel("rung-wide"));
    const f = await frame(page);

    expect(f.innerWidth, "laid out at the full width").toBe(1920);
    expect(f.innerHeight, "and the full height").toBe(1080);
    expect(f.visualWidth, "but drawn smaller, because the screen is smaller").toBeLessThan(1920);
    expect(f.readout, "and the zoom is stated, so a shrunken preview is never a mystery").toMatch(/%/);
    expect(f.gutter, "and it still sits INSIDE the stage's padding, as a card with edges").toBeGreaterThan(8);
  });

  test("a screen that fits is shown at 1:1, with no zoom claimed", async ({ page }) => {
    await openPreview(page);
    await chooseScreen(page, screenLabel("iphone-se-3"));
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
    await chooseScreen(page, screenLabel("iphone-se-3"));
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
    await chooseScreen(page, screenLabel("iphone-se-3"));

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
    await chooseScreen(page, screenLabel("iphone-se-3"));
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
    await chooseScreen(page, screenLabel("rung-desktop"));
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
    await chooseScreen(page, screenLabel("iphone-se-3"));
    await chooseScreen(page, "Responsive");

    await expect(page.getByRole("spinbutton", { name: "Preview width in pixels" }), "nothing to type into").toBeDisabled();
    await expect(page.getByRole("button", { name: "Rotate the preview" }), "and nothing to rotate").toBeDisabled();

    const f = await frame(page);
    const stageW = await page.evaluate(() => {
      const host = document.querySelector("[data-preview-stage]") as HTMLElement;
      const cs = getComputedStyle(host);
      return Math.round(host.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0));
    });

    /**
     * The readout used to say the WORD "Responsive", which names the mode and not the thing a person is
     * looking at. It now states the width the page is really being given and the rung that width lands on —
     * "1440 px · Desktop" — because the whole point of sweeping the edges is to watch that change.
     */
    expect(f.readout, `the readout says: ${f.readout}`).toMatch(/\d+ px · (Phone|Tablet|Desktop|Big desktop)/);
    expect(f.innerWidth, "the frame takes the whole stage, not a reading-width slice of it").toBe(stageW);
    expect(stageW, "and the stage really is wider than the old 1024px cap, so this could fail").toBeGreaterThan(1024);
  });

  test("switching to Responsive drops a zoom it is no longer applying", async ({ page }) => {
    // A disabled box still reading "50%" while nothing is scaled is a control lying about what it does.
    await openPreview(page);
    await chooseScreen(page, screenLabel("iphone-se-3"));
    await chooseZoom(page, "50%");
    await chooseScreen(page, "Responsive");

    await expect(page.getByRole("button", { name: "Preview zoom", exact: true })).toContainText("Fit to window");
    expect((await frame(page)).readout, "and nothing claims a percentage").not.toMatch(/%/);
  });
});

/**
 * THE CONTROLS STAY WHERE YOU CAN REACH THEM.
 *
 * The bar floats over the page so the preview gets the whole window. Two attempts to make it "get out of
 * the way" on its own both made it unreachable, and the second was found only because six guards timed out:
 *
 *   • a TIMER — it vanished mid-choice, while the sixty-device menu was open and being read;
 *   • `onPointerLeave` — a menu is portalled OUT of the bar, so choosing a device moved the pointer "off"
 *     it and the whole strip left the screen the instant the choice was made. Pick a phone, then want to
 *     rotate it, and there is nothing there.
 *
 * `-translate-y-full` is what makes this so quiet: the element stays visible, enabled and in the DOM, and
 * is simply outside the window. Playwright reports "element is outside of the viewport" and waits; a person
 * sees a control that was there a second ago and is now gone. So the assertion is on the RECTANGLE being
 * inside the window, never on the element existing.
 */
test.describe("the preview controls do not run away", () => {
  test.use({ viewport: VIEWPORT });

  /** Is the bar actually ON the screen — not merely present in the document? */
  const barOnScreen = (page: Page) => page.evaluate(() => {
    const bar = document.querySelector("[data-preview-bar]");
    if (!bar) return false;
    const r = bar.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  });

  /**
   * SETTLED, not sampled. The bar slides over 200ms, so a rectangle read in the tick after the click is the
   * position it is leaving, not the one it is going to — three guards failed on exactly that and the app was
   * behaving correctly the whole time. `expect.poll` retries until the transition finishes and still fails
   * if it never does, which a fixed sleep would not.
   */
  const barSettlesTo = (page: Page, on: boolean, why: string) =>
    expect.poll(() => barOnScreen(page), { message: why }).toBe(on);

  /** Asserting it does NOT move needs real time to pass — polling for "unchanged" would pass instantly. */
  const barStaysOnScreen = async (page: Page, why: string) => {
    await page.waitForTimeout(400); // longer than the 200ms slide, so a move would have finished by now
    expect(await barOnScreen(page), why).toBe(true);
  };

  test("they are still there after sitting untouched", async ({ page }) => {
    await openPreview(page);
    expect(await barOnScreen(page), "the bar opens on screen").toBe(true);
    await page.waitForTimeout(4000); // longer than either auto-hide ever waited
    expect(await barOnScreen(page), "nothing hides itself because time passed").toBe(true);
  });

  test("choosing a screen does not take them away — the next control is still clickable", async ({ page }) => {
    await openPreview(page);
    await chooseScreen(page, screenLabel("iphone-se-3"));
    expect(await barOnScreen(page), "the bar survives its own menu closing").toBe(true);
    // The control that was unreachable: proven by USING it, not by finding it.
    await page.getByRole("button", { name: "Rotate the preview" }).click();
    await expect(page.getByRole("button", { name: "Rotate the preview" })).toHaveAttribute("aria-pressed", "true");
    expect(await barOnScreen(page), "and it is still there afterwards").toBe(true);
  });

  test("they hide only when asked, and there is always a way back", async ({ page }) => {
    await openPreview(page);
    const hide = page.getByRole("button", { name: "Hide the preview controls" });
    const show = page.getByRole("button", { name: "Show the preview controls" });

    await hide.click();
    await barSettlesTo(page, false, "asked to hide, so it hides");
    // The way back is a real button INSIDE the window — not a region of the page you must know to hover.
    const handle = await show.boundingBox();
    expect(handle, "a hidden bar leaves a handle").not.toBeNull();
    expect(handle!.y, "and the handle is on the screen, not above it").toBeGreaterThanOrEqual(0);
    await show.click();
    await barSettlesTo(page, true, "which brings it back");
  });

  test("the keyboard toggles them both ways, as every feature here must", async ({ page }) => {
    await openPreview(page);
    await page.keyboard.press("h");
    await barSettlesTo(page, false, "H hides");
    await page.keyboard.press("H");
    await barSettlesTo(page, true, "and H shows again — the same key, not a one-way trip");
  });

  test("the shortcut still works once you have clicked the page you are previewing", async ({ page }) => {
    /**
     * The state a person is in almost immediately, and the one the shortcut died in. The preview is an
     * iframe: click or scroll the page inside it and every key press goes to the frame's document. Measured
     * — the bar toggled while `activeElement` was `body` and did nothing at all once it was the `IFRAME`.
     */
    await openPreview(page);
    await page.locator('iframe[title="Site preview"]').click({ position: { x: 300, y: 200 } });
    expect(await page.evaluate(() => document.activeElement?.tagName), "focus really is in the frame").toBe("IFRAME");
    await page.keyboard.press("h");
    await barSettlesTo(page, false, "H reaches the bar from inside the frame");
    await page.keyboard.press("h");
    await barSettlesTo(page, true, "and back again");
  });

  test("typing a width is not a keyboard shortcut — H in a number box is just text", async ({ page }) => {
    await openPreview(page);
    await chooseScreen(page, screenLabel("iphone-se-3"));
    await page.getByLabel("Preview width in pixels").click();
    await page.keyboard.press("h");
    await barStaysOnScreen(page, "a shortcut that fires while you are typing is a trap");
  });
});
