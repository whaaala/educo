import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * THE SELECTED BLOCK'S SPACE, DRAWN AND DRAGGED ON THE CANVAS (BATCH E-6 (3)).
 * Behaviours: tests/features/components/website/box-builder-spacing.feature ("A selected block shows its space…" onwards).
 *
 * First built and driven THROUGH THE UI (`scripts/uat/probe-e6-3.js`, HEADED, 1280 · 1536 · 768: a Stack from the blocks panel,
 * two Texts put in with its +). The shape is seeded here only to pin what that run found (RULE Y): a Stack of two Texts, made
 * now (`bare`), so it carries no space until a handle gives it some.
 */
const STEPS = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

async function seedStack(page: Page, extra: Record<string, unknown> = {}) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await seedSite(page, sitePage([
    // `spaced` AND `bare`, as every block the UI makes now carries (a block without `spaced` is a page saved before 2026-09-30, gap 16)
    { id: "S", type: "container", direction: "column", spaced: true, bare: true, width: "100%", ...extra, children: [
      { id: "t1", type: "text", text: "First line", spaced: true, bare: true, width: "100%" },
      { id: "t2", type: "text", text: "Second line", spaced: true, bare: true, width: "100%" },
    ] },
  ]));
  await page.waitForSelector('[data-box-id="t2"]', { timeout: 15000 });
  await page.waitForTimeout(400);
  // one click on the words selects the OUTERMOST block of the chain — the Stack
  const t = (await page.locator('[data-box-id="t2"]').boundingBox())!;
  for (let i = 0; i < 4 && (await selected(page)) !== "S"; i++) {
    if (i) await page.keyboard.press("Escape");
    await page.mouse.click(t.x + t.width * 0.9, t.y + t.height / 2);
    await page.waitForTimeout(250);
  }
  expect(await selected(page)).toBe("S");
}
const selected = (page: Page) => page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
/** The Stack's stored spacing — with this screen's own values merged in, as the canvas reads them. */
const stored = (page: Page) => page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
  let hit: Record<string, unknown> | null = null;
  const walk = (n: Record<string, unknown>) => { if (n.id === "S") hit = n; ((n.children as Record<string, unknown>[]) ?? []).forEach(walk); };
  walk(s.pages[0].root);
  const n = Object.assign({}, hit, ...Object.values(((hit as Record<string, unknown> | null)?.responsive as Record<string, object>) ?? {})) as Record<string, unknown>;
  const keys = ["padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "gap", "gapX", "gapY"];
  return Object.fromEntries(keys.filter((k) => n[k] !== undefined && n[k] !== null).map((k) => [k, n[k] as number]));
});
const handle = (page: Page, key: string) => page.locator(`[data-space-handle="${key}"]`);
async function drag(page: Page, key: string, dx: number, dy: number, mods: string[] = []) {
  const b = (await handle(page, key).boundingBox())!;
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  for (const m of mods) await page.keyboard.down(m);
  await page.mouse.move(x, y); await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(x + (dx * i) / 10, y + (dy * i) / 10);
  await page.mouse.up();
  for (const m of [...mods].reverse()) await page.keyboard.up(m);
  await page.waitForTimeout(300);
}

test.describe("with a finger", () => {
  test("the handles are a finger's size, and a finger's drag sets the space", async ({ page, hasTouch }) => {
    test.skip(!hasTouch, "the touch projects; the mouse is the describe below");
    await seedStack(page, { minHeight: 480 }); // room for a finger's handles on a canvas drawn small
    const h = handle(page, "paddingTop");
    const b = (await h.boundingBox())!;
    expect(Math.max(b.width, b.height), "a 44px target for a finger").toBeGreaterThanOrEqual(44);
    // a finger: pointer events of type touch, followed on the document (`followGesture`)
    await h.evaluate((el) => {
      const r = el.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2;
      const at = (type: string, dy: number, t: EventTarget) => t.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerType: "touch", isPrimary: true, clientX: x, clientY: y + dy, buttons: type === "pointerup" ? 0 : 1 }));
      at("pointerdown", 0, el);
      for (let i = 1; i <= 8; i++) at("pointermove", i * 8, document);
      at("pointerup", 64, document);
    });
    await page.waitForTimeout(300);
    const s = await stored(page);
    expect(STEPS, "a finger's drag lands on the scale").toContain(s.paddingTop);
    expect(s.paddingTop).toBeGreaterThan(0);
  });
});

test.describe("the selected block's spacing handles", () => {
  // the mouse, with Alt and Shift held, on the 1280 builder — a finger is the describe above
  test.skip(({ hasTouch }) => hasTouch, "mouse gestures with modifier keys");
  test("every side, and the gap, has a handle — at 0 too — and each is a keyboard slider", async ({ page }) => {
    await seedStack(page);
    expect(await stored(page), "a block made now carries no space").toEqual({});
    for (const name of ["Inner space, top", "Inner space, right", "Inner space, bottom", "Inner space, left", "Outer space, top", "Outer space, bottom", "Space between rows"]) {
      const s = page.getByRole("slider", { name });
      await expect(s, name).toHaveCount(1);
      await expect(s).toHaveAttribute("aria-valuenow", "0");
      const box = (await s.boundingBox())!;
      expect(Math.max(box.width, box.height), `${name}: a 24px target`).toBeGreaterThanOrEqual(24);
    }
  });

  test("a Stack holding ONE line still shows its top and bottom inner handles (E6-14)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await seedSite(page, sitePage([{ id: "S", type: "container", direction: "column", spaced: true, bare: true, width: "100%", children: [
      { id: "t1", type: "text", text: "Only line", spaced: true, bare: true, width: "100%" },
    ] }]));
    await page.waitForSelector('[data-box-id="t1"]', { timeout: 15000 });
    const t = (await page.locator('[data-box-id="t1"]').boundingBox())!;
    for (let i = 0; i < 4 && (await selected(page)) !== "S"; i++) { if (i) await page.keyboard.press("Escape"); await page.mouse.click(t.x + t.width * 0.9, t.y + t.height / 2); await page.waitForTimeout(250); }
    expect((await page.locator('[data-box-id="S"]').boundingBox())!.height, "the case under test: one line, under 36px").toBeLessThan(36);
    await expect(handle(page, "paddingTop")).toHaveCount(1);
    await expect(handle(page, "paddingBottom")).toHaveCount(1);
  });

  test("a drag lands on the spacing scale, moves the words, and is ONE Undo", async ({ page }) => {
    await seedStack(page);
    const y0 = (await page.locator('[data-box-id="t1"]').boundingBox())!.y;
    await drag(page, "paddingTop", 0, 48);
    const s = await stored(page);
    expect(Object.keys(s), "only the side that was dragged").toEqual(["paddingTop"]);
    expect(STEPS, "on a step of the scale").toContain(s.paddingTop);
    expect(s.paddingTop).toBeGreaterThan(0);
    expect((await page.locator('[data-box-id="t1"]').boundingBox())!.y - y0, "the words moved down").toBeGreaterThan(20);
    // the band is drawn where the space is, and says its size
    const band = page.locator('[data-space-band="paddingTop"]');
    await expect(band).toContainText("rem");
    const pad = await page.locator('[data-box-id="S"]').evaluate((el) => parseFloat(getComputedStyle(el).paddingTop) * (el.getBoundingClientRect().width / ((el as HTMLElement).offsetWidth || 1)));
    expect(Math.abs((await band.boundingBox())!.height - pad), "the band is as deep as the space").toBeLessThanOrEqual(1);
    await page.keyboard.press("Control+z");
    await page.waitForTimeout(300);
    expect(await stored(page), "one Undo takes the whole drag back").toEqual({});
  });

  test("Alt moves the opposite side too, Alt + Shift all four, Shift alone a bigger step", async ({ page }) => {
    await seedStack(page);
    await drag(page, "paddingLeft", 40, 0, ["Alt"]);
    let s = await stored(page);
    expect(s.paddingLeft, "Alt: left…").toBeGreaterThan(0);
    expect(s.paddingRight, "…and right together").toBe(s.paddingLeft);
    expect(s.paddingTop, "…and nothing else").toBeUndefined();
    await drag(page, "paddingTop", 0, 30, ["Alt", "Shift"]);
    s = await stored(page);
    expect([s.paddingRight, s.paddingBottom, s.paddingLeft], "Alt + Shift: all four").toEqual([s.paddingTop, s.paddingTop, s.paddingTop]);
    await drag(page, "gapy", 0, 26, ["Shift"]);
    expect([8, 16, 24, 40, 64, 96], "Shift: the bigger steps").toContain((await stored(page)).gap);
  });

  test("a double-click takes a space back to none, and its handle stays", async ({ page }) => {
    await seedStack(page, { paddingTop: 32 });
    const b = (await page.locator('[data-space-band="paddingTop"]').boundingBox())!;
    await page.mouse.dblclick(b.x + b.width * 0.8, b.y + b.height / 2);
    await page.waitForTimeout(300);
    expect((await stored(page)).paddingTop).toBe(0);
    await expect(page.locator('[data-space-band="paddingTop"]'), "no band at 0").toHaveCount(0);
    await expect(handle(page, "paddingTop"), "…but the handle is still there to grab").toHaveCount(1);
  });

  test("the keyboard steps it, Shift two steps, Home to none — and the block itself does not move", async ({ page }) => {
    await seedStack(page);
    const order = await page.evaluate(() => [...document.querySelectorAll("[data-box-id]")].map((e) => e.getAttribute("data-box-id")).join());
    await handle(page, "paddingTop").focus();
    await page.keyboard.press("ArrowUp");
    expect((await stored(page)).paddingTop).toBe(4);
    await page.keyboard.press("Shift+ArrowUp");
    expect((await stored(page)).paddingTop, "two steps: 4 → 12 (E6-15)").toBe(12);
    await expect(handle(page, "paddingTop")).toHaveAttribute("aria-valuetext", /^Inner space, top: [\d.]+rem$/);
    await page.keyboard.press("Home");
    expect((await stored(page)).paddingTop).toBe(0);
    expect(await page.evaluate(() => [...document.querySelectorAll("[data-box-id]")].map((e) => e.getAttribute("data-box-id")).join()), "the arrows moved the space, not the block").toBe(order);
    expect(await selected(page)).toBe("S");
  });

  test("a Button keeps the inner space its design stores: outer handles only", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await seedSite(page, sitePage([{ id: "B", type: "button", text: "Apply now", spaced: true, bare: true }]));
    await page.waitForSelector('[data-box-id="B"]', { timeout: 15000 });
    const b = (await page.locator('[data-box-id="B"]').boundingBox())!;
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
    await page.waitForTimeout(300);
    await expect(page.locator('[data-space-handle^="padding"]'), "no inner handle on a Button").toHaveCount(0);
    await expect(page.locator('[data-space-handle^="margin"]').first(), "its outer space can still be set").toBeAttached();
  });

  test("a still click on the words under an inner handle is the words' click (E6-19, c-21)", async ({ page }) => {
    await seedStack(page);
    // the LEFT inner handle of the selected Stack lies over the first letters of its first line
    const h = (await handle(page, "paddingLeft").boundingBox())!;
    const t1 = (await page.locator('[data-box-id="t1"]').boundingBox())!;
    expect(h.y < t1.y + t1.height && h.y + h.height > t1.y, "the handle is over the first line (the case under test)").toBe(true);
    await page.mouse.click(h.x + h.width / 2, t1.y + t1.height / 2);
    await page.waitForTimeout(300);
    // as a click on the words does (and as the resize handles let it, `text-is-reachable`): the caret is in them, and typing lands
    expect(await page.evaluate(() => { const a = document.activeElement as HTMLElement | null; return !!a?.isContentEditable && !!a.closest('[data-box-id="t1"]'); }), "the caret is in the first line").toBe(true);
    await page.keyboard.type("Z");
    await expect(page.locator('[data-box-id="t1"]'), "…and what is typed lands there").toContainText("Z");
    expect(await stored(page), "…and no space changed").toEqual({});
  });
});

test.describe("every screen", () => {
  test("an empty box's + is never under a handle (E6-20)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await seedSite(page, sitePage([{ id: "E", type: "container", direction: "column", spaced: true, bare: true, width: "100%", children: [] }]));
    await page.waitForSelector('[data-box-id="E"]', { timeout: 15000 });
    const e = (await page.locator('[data-box-id="E"]').boundingBox())!;
    await page.mouse.click(e.x + e.width * 0.2, e.y + e.height * 0.8);
    await page.waitForTimeout(300);
    await expect(page.locator('[data-space-handle^="padding"]'), "nothing inside to space yet").toHaveCount(0);
    const plus = page.locator('[data-box-id="E"] button[aria-label="Choose a block to add inside"]');
    const p = (await plus.boundingBox())!;
    expect(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('button[aria-label="Choose a block to add inside"]'), [p.x + p.width / 2, p.y + p.height / 2]), "the pointer reaches the +").toBe(true);
  });

  test("no spacing handle lies under the block toolbar — on a narrow block, at the left or the right (E6-18)", async ({ page }) => {
    for (const side of ["left", "right"]) {
      await page.setViewportSize({ width: 1280, height: 900 });
      await seedSite(page, sitePage([
        ...(side === "right" ? [{ id: "pad", type: "container", direction: "column", spaced: true, bare: true, width: "70%", minHeight: 40, children: [] }] : []),
        // outer space above and below: the toolbar (16px off the edge) reaches a handle only once there is some
        { id: "N", type: "container", direction: "column", spaced: true, bare: true, width: "30%", minHeight: 160, marginTop: 48, marginBottom: 48, children: [{ id: "nt", type: "text", text: "Narrow", spaced: true, bare: true, width: "100%" }] },
      ]));
      await page.waitForSelector('[data-box-id="nt"]', { timeout: 15000 });
      const n = (await page.locator('[data-box-id="N"]').boundingBox())!;
      for (let i = 0; i < 4 && (await selected(page)) !== "N"; i++) { if (i) await page.keyboard.press("Escape"); await page.mouse.click(n.x + n.width * 0.5, n.y + n.height * 0.85); await page.waitForTimeout(250); }
      expect(await selected(page)).toBe("N");
      const under = await page.evaluate(() => {
        const tb = document.querySelector('[data-chrome-mirror="N"] [role="toolbar"]')!.getBoundingClientRect();
        return [...document.querySelectorAll("[data-space-handle]")].filter((h) => { const r = h.getBoundingClientRect(); return r.left < tb.right && r.right > tb.left && r.top < tb.bottom && r.bottom > tb.top; }).map((h) => h.getAttribute("data-space-handle"));
      });
      expect(under, `handles under the toolbar (block at the ${side})`).toEqual([]);
    }
  });

  test("the size labels never sit under a handle (E6-16)", async ({ page }) => {
    await seedStack(page, { paddingTop: 32, paddingBottom: 32, gap: 32, marginBottom: 32 });
    const over = await page.evaluate(() => {
      const hits = [...document.querySelectorAll("[data-space-handle], [aria-label^='Resize']")].map((h) => h.getBoundingClientRect());
      return [...document.querySelectorAll("[data-space-band] > span")].filter((l) => { const r = l.getBoundingClientRect(); return hits.some((h) => r.left < h.right && r.right > h.left && r.top < h.bottom && r.bottom > h.top); }).map((l) => l.textContent);
    });
    expect(await page.locator("[data-space-band] > span").count(), "the labels are drawn").toBeGreaterThan(2);
    expect(over, "labels under a handle").toEqual([]);
  });
});
