import { test, expect, type Page } from "@playwright/test";
import { clearSite, pressHeader } from "./helpers/seed-site";
import INSPECTOR from "../../config/inspector.json";
import LAYOUT from "../../config/layout.json";

/**
 * DRAG THAT FEELS LIKE PICKING IT UP (BATCH LE-15n — tests/features/components/website/drag-feel.feature; signed by the user
 * 2026-10-21). The page is made the way a person makes it: Add page → School home. The drag is a MOUSE pressing on a block
 * (no grip) WITHIN A STACK — the head's welcome: heading · quote · name · link — the quote carried below the name. A finger's
 * long press is driven by scripts/uat/measure-drag.js and the headed pass; whole sections by the LE-15l probe.
 */
test.use({ viewport: { width: 1600, height: 950 } });
const T = INSPECTOR.sections;
const coarse = (page: Page) => page.evaluate(() => matchMedia("(pointer: coarse)").matches);
type R = { x: number; y: number; w: number; h: number };
const rectOf = (page: Page, id: string): Promise<R> => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, id);
const tx = (page: Page, id: string) => page.evaluate((id) => { const m = new DOMMatrix(getComputedStyle(document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!).transform); return { x: m.m41, y: m.m42, a: m.a }; }, id);

/** The welcome stack's blocks, in order, by their words. */
const stackOrder = (page: Page, stack: string) => page.evaluate((s) => Array.from(document.querySelector(`[data-box-id="${CSS.escape(s)}"]`)!.querySelectorAll(":scope > [data-box-id]")).map((k) => (k.textContent || "").trim().slice(0, 12)), stack);

async function schoolHome(page: Page) {
  await clearSite(page, undefined, { phoneScreen: true });
  await pressHeader(page, "Add page");
  const d = page.getByRole("dialog", { name: T.addPageTitle });
  await d.getByRole("textbox").fill("Drag");
  await d.getByRole("button", { name: /^Add School home,/ }).click();
  await page.getByText(/Open day on Saturday/).first().waitFor();
  await page.waitForTimeout(600);
}

async function lift(page: Page) {
  await schoolHome(page);
  const ids = await page.evaluate(() => {
    // by their WORDS — the deepest box holding them (a block may sit in a band of its own); the stack is the box of four lines
    const leaf = (re: RegExp) => Array.from(document.querySelectorAll("[data-box-id]")).find((e) => re.test((e.textContent || "").trim()) && !e.querySelector("[data-box-id]"))!;
    const h = leaf(/^A welcome from our head/i), quote = leaf(/^“Every child/), name = leaf(/^Mrs Ngozi/);
    let stack = h.parentElement!.closest("[data-box-id]")!;
    while (stack.querySelectorAll(":scope > [data-box-id]").length < 4) stack = stack.parentElement!.closest("[data-box-id]")!;
    stack.scrollIntoView({ block: "center" });
    const line = (el: Element) => Array.from(stack.querySelectorAll(":scope > [data-box-id]")).find((k) => k.contains(el))!.getAttribute("data-box-id")!;
    return { stack: stack.getAttribute("data-box-id")!, quote: quote.getAttribute("data-box-id")!, name: name.getAttribute("data-box-id")!, nameLine: line(name) };
  });
  await page.waitForTimeout(400);
  const before = await stackOrder(page, ids.stack), quote = await rectOf(page, ids.quote), name = await rectOf(page, ids.name); // before the press: once it lifts, they slide
  // click until the quote is the block selected (a click selects the box, the next goes inside), then press on it and drag
  for (let i = 0; i < 8 && (await page.evaluate(() => document.querySelector("[data-chrome-mirror]")?.getAttribute("data-chrome-mirror"))) !== ids.quote; i++) {
    await page.mouse.click(quote.x + quote.w - 20, quote.y + quote.h / 2); await page.waitForTimeout(300);
  }
  const from = { x: quote.x + quote.w - 20, y: quote.y + quote.h / 2 }, to = { x: from.x, y: name.y + name.h - 4 }; // the name's lower edge: below it
  await page.mouse.move(from.x, from.y); await page.mouse.down();
  for (let k = 1; k <= 16; k++) { await page.mouse.move(from.x, from.y + ((to.y - from.y) * k) / 16); await page.waitForTimeout(25); }
  await page.waitForTimeout(350); await page.mouse.move(to.x, to.y);
  return { ...ids, before, name0: name };
}

test.beforeEach(async ({ page }) => { test.skip(await coarse(page), "a mouse's press; a finger's long press is the headed pass and measure-drag.js"); test.setTimeout(90_000); });

test("LE-15n (1) · press on a block and drag it — no grip: it lands where it is let go", async ({ page }) => {
  const { stack, before } = await lift(page);
  await page.mouse.up(); await page.waitForTimeout(600);
  expect(before.slice(1, 3).map((t) => t.slice(0, 4)), "precondition: the quote, then the name").toEqual(["“Eve", "Mrs "]);
  expect((await stackOrder(page, stack)).slice(1, 3).map((t) => t.slice(0, 4)), "the quote now under the name").toEqual(["Mrs ", "“Eve"]);
});

test("LE-15n (1) · a still click only selects", async ({ page }) => {
  const { stack, before } = await lift(page);
  await page.keyboard.press("Escape"); await page.mouse.up(); await page.waitForTimeout(400);
  const q = await page.evaluate((s) => document.querySelector(`[data-box-id="${CSS.escape(s)}"]`)!.querySelectorAll(":scope > [data-box-id]")[1].getAttribute("data-box-id")!, stack);
  const r = await rectOf(page, q);
  await page.mouse.click(r.x + r.w - 20, r.y + r.h / 2); await page.waitForTimeout(400);
  expect(await stackOrder(page, stack), "nothing moved").toEqual(before);
});

test("LE-15n (1) · after a double-click in its words, a press-and-drag selects words — the block stays", async ({ page }) => {
  const { stack, before } = await lift(page);
  await page.keyboard.press("Escape"); await page.mouse.up(); await page.waitForTimeout(400);
  const q = await page.evaluate((s) => { const e = Array.from(document.querySelector(`[data-box-id="${CSS.escape(s)}"]`)!.querySelectorAll("[data-box-id]")).find((x) => /^“Every child/.test((x.textContent || "").trim()) && !x.querySelector("[data-box-id]"))!; const r = e.getBoundingClientRect(); return { x: r.x + 40, y: r.y + r.height / 2, w: r.width }; }, stack);
  await page.mouse.dblclick(q.x, q.y); await page.waitForTimeout(300);
  await page.mouse.click(q.x, q.y); await page.waitForTimeout(200); // a caret, not the word: a press INSIDE a selection drags the words instead
  await page.mouse.move(q.x, q.y); await page.mouse.down();
  for (let k = 1; k <= 10; k++) { await page.mouse.move(q.x + k * 20, q.y); await page.waitForTimeout(20); }
  const copy = await page.locator("[data-drag-copy]").count(), picked = await page.evaluate(() => (window.getSelection()?.toString() || "").length);
  await page.mouse.up(); await page.waitForTimeout(400);
  expect(copy, "no block was lifted").toBe(0);
  expect(picked, "words were selected").toBeGreaterThan(5);
  expect(await stackOrder(page, stack), "nothing moved").toEqual(before);
});

test("LE-15n (2)(3) · the block's own copy follows, the block fades, and the name slides up to make room", async ({ page }) => {
  const { quote, name, name0 } = await lift(page);
  const copy = await page.evaluate(() => { const c = document.querySelector<HTMLElement>("[data-drag-copy]"); if (!c) return null; const r = c.getBoundingClientRect(); return { w: r.width, h: r.height, words: (c.textContent || "").slice(0, 30), bg: getComputedStyle(c).backgroundColor }; });
  const fade = await page.evaluate((id) => getComputedStyle(document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!).opacity, quote);
  const slid = (await rectOf(page, name)).y - name0.y;
  const chrome = await page.evaluate(() => { const m = document.querySelector<HTMLElement>("[data-chrome-mirror]"); return m ? getComputedStyle(m).visibility : "none"; });
  await page.keyboard.press("Escape"); await page.mouse.up(); await page.waitForTimeout(500);
  expect(copy, "a copy of the block follows the pointer").not.toBeNull();
  expect(copy!.words, "in its own shape — its own words").toMatch(/Every child/);
  expect(Math.max(copy!.w, copy!.h), "no larger than the limit").toBeLessThanOrEqual(LAYOUT.drag.previewMaxPx + 1);
  expect(copy!.bg, "on the ground it was lifted from, never bare words").not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  expect(Number(fade), "the block left in place is faded").toBeCloseTo(LAYOUT.drag.sourceOpacity, 1);
  expect(slid, "the name slid UP to open the place").toBeLessThan(-20);
  expect(chrome, "the selected block's bar and handles are put away while it is carried").not.toBe("visible");
});

test("LE-15n (3) · Escape puts it back: nothing changes, the copy goes, the name returns", async ({ page }) => {
  const { stack, before, name, name0 } = await lift(page);
  await page.keyboard.press("Escape"); await page.mouse.up(); await page.waitForTimeout(600);
  expect(await stackOrder(page, stack), "nothing moved").toEqual(before);
  expect(await page.locator("[data-drag-copy]").count(), "the copy is gone").toBe(0);
  expect(Math.abs((await rectOf(page, name)).y - name0.y), "the name is back in its place").toBeLessThan(1);
});

test("LE-15n (3) · letting go glides it into place", async ({ page }) => {
  const { quote } = await lift(page);
  await page.mouse.up();
  const during = await tx(page, quote);
  await page.waitForTimeout(LAYOUT.drag.dropMs + 300);
  const after = await tx(page, quote);
  expect(Math.abs(during.x) + Math.abs(during.y) > 1 || during.a !== 1, `it starts where it was let go (${JSON.stringify(during)})`).toBe(true);
  expect(after, "and comes to rest in its place").toEqual({ x: 0, y: 0, a: 1 });
});

test("LE-15n · every move is said: a drop and the bar's arrow each announce where the block now is", async ({ page }) => {
  await lift(page);
  await page.mouse.up(); await page.waitForTimeout(600);
  const spoken = () => page.evaluate(() => document.querySelector('[role="status"][aria-live="polite"]')?.textContent ?? "");
  expect(await spoken(), "the drop: below the head's name").toMatch(/^Moved · Below · .*Mrs Ngozi/);
  await page.getByRole("toolbar", { name: "Block toolbar" }).getByRole("button", { name: "Move up", exact: true }).click(); await page.waitForTimeout(400);
  expect(await spoken(), "the bar's ↑: back above the name").toMatch(/^Moved · (Below · .*A welcome|Above · .*Mrs Ngozi)/);
});

test("LE-15n (3) · with reduce motion nothing slides or glides — it is placed at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { quote, nameLine } = await lift(page);
  // the name's own line in the stack (itself, or the band that holds it) is what slides
  const transition = await page.evaluate((id) => { const el = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(id)}"]`)!; return el.style.transition || "unset"; }, nameLine);
  await page.mouse.up();
  const during = await tx(page, quote);
  expect(transition, "no slide").toBe("none");
  expect(during, "no glide: in its place at once").toEqual({ x: 0, y: 0, a: 1 });
});

/**
 * LE15n-d2 (the user, 2026-10-21: "Reorder; hold still = inside"). A SECTION carried over the body of the section below it moves it
 * down the page — they slide apart — and only HOLDING STILL there (drag.intoHoldMs) puts it inside. Before: over a section's middle
 * the carried one went inside it at once, and nothing slid (reproduced by hand on the user's 1536 × 864, le15n-d-05).
 */
async function carrySection(page: Page) {
  await page.setViewportSize({ width: 1600, height: 2400 }); // both sections whole on screen — no auto-scroll in the way
  await schoolHome(page);
  // the page's lines are row bands (scaffolding); a section is the one block of its band
  const s = await page.evaluate(() => {
    const root = document.querySelector("[data-box-id]")!, bands = Array.from(root.querySelectorAll(":scope > [data-box-id]")) as HTMLElement[];
    const body = bands.filter((k) => !k.querySelector("header, footer") && k.getBoundingClientRect().height > 200);
    const sec = (band: Element) => band.querySelector(":scope > [data-box-id]")!.getAttribute("data-box-id")!;
    body[1].scrollIntoView({ block: "start" });
    return { root: root.getAttribute("data-box-id")!, a: sec(body[1]), b: sec(body[2]), bBand: body[2].getAttribute("data-box-id")! };
  });
  await page.waitForTimeout(400);
  const A = await rectOf(page, s.a), B = await rectOf(page, s.b);
  const from = { x: A.x + A.w / 2, y: A.y + A.h / 2 }, to = { x: from.x, y: B.y + B.h * 0.6 }; // down the middle (a side strip means beside), into the lower half of B: after it
  await page.mouse.move(from.x, from.y); await page.mouse.down();
  for (let k = 1; k <= 16; k++) { await page.mouse.move(from.x, from.y + ((to.y - from.y) * k) / 16); await page.waitForTimeout(25); }
  await page.waitForTimeout(200);
  return s;
}
/** Which of the page's lines holds each block (-1: none). */
const lineOf = (page: Page, root: string, ids: string[]) => page.evaluate(({ root, ids }) => { const lines = Array.from(document.querySelector(`[data-box-id="${CSS.escape(root)}"]`)!.querySelectorAll(":scope > [data-box-id]")); return ids.map((id) => lines.findIndex((l) => l.getAttribute("data-box-id") === id || !!l.querySelector(`:scope > [data-box-id="${CSS.escape(id)}"]`))); }, { root, ids });

test("LE15n-d2 · a section carried over the next section's middle: they slide apart, nothing goes inside, nothing outlined", async ({ page }) => {
  const { bBand } = await carrySection(page);
  const slid = await tx(page, bBand);
  const outlined = await page.evaluate(() => Array.from(document.querySelectorAll("[data-box-id]:hover")).filter((e) => getComputedStyle(e).outlineStyle !== "none").length);
  await page.keyboard.press("Escape"); await page.mouse.up(); await page.waitForTimeout(500);
  expect(slid.y, "the section below rises to open the place after it").toBeLessThan(-20);
  expect(outlined, "LE15n-d5 · no block under the pointer is outlined while one is carried").toBe(0);
});

test("LE15n-d2 · letting go there moves the section after it, on the page", async ({ page }) => {
  const { root, a, b } = await carrySection(page);
  await page.mouse.up(); await page.waitForTimeout(LAYOUT.drag.dropMs + 400);
  const [la, lb] = await lineOf(page, root, [a, b]);
  expect(la, "still a section of the page, on a line of its own").toBeGreaterThanOrEqual(0);
  expect(la, "after the section it was carried over").toBe(lb + 1);
});

test("LE15n-d2 · held still over the section, it goes inside it", async ({ page }) => {
  const { a, b } = await carrySection(page);
  await page.waitForTimeout(LAYOUT.drag.intoHoldMs + 300);
  await page.mouse.up(); await page.waitForTimeout(LAYOUT.drag.dropMs + 400);
  expect(await page.evaluate(({ a, b }) => document.querySelector(`[data-box-id="${CSS.escape(b)}"]`)!.contains(document.querySelector(`[data-box-id="${CSS.escape(a)}"]`)), { a, b }), "inside the section it was held over").toBe(true);
});
