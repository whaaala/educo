import { test, expect, type Page } from "@playwright/test";
import { clearSite, pressHeader } from "./helpers/seed-site";
import INSPECTOR from "../../config/inspector.json";

/**
 * A TEMPLATE IS ONLY A START (BATCH LE-15l — tests/features/components/website/template-fully-editable.feature).
 *
 * The user, 2026-10-20: "can I really edit everything even though I select the templates… move items around… put another stack
 * next to it". The probe (scripts/uat/uat-le15l-probe.js) drove every template, section and component; these are the four things
 * it found that a person could NOT do, each reproduced by hand first (LE15l-h · i · p · s). Every page here is made the way a
 * person makes it: Add page → the School home template.
 */
const T = INSPECTOR.sections;
test.use({ viewport: { width: 1600, height: 950 } });

async function schoolHome(page: Page) {
  await clearSite(page, undefined, { phoneScreen: true });
  await pressHeader(page, "Add page");
  const d = page.getByRole("dialog", { name: T.addPageTitle });
  await d.getByRole("textbox").fill("Home 2");
  await d.getByRole("button", { name: /^Add School home,/ }).click();
  await page.getByText(/Open day on Saturday/).first().waitFor();
  await page.waitForTimeout(600);
}
const coarse = (page: Page) => page.evaluate(() => matchMedia("(pointer: coarse)").matches);
/** A palette drop (HTML5 drag and drop, the panel's own data) at a point — what letting go of a tile there does. */
async function dropKind(page: Page, kind: string, x: number, y: number) {
  await page.evaluate(({ kind, x, y }) => {
    const dt = new DataTransfer(); dt.setData("application/x-box-block", kind);
    const el = document.elementFromPoint(x, y)!;
    for (const type of ["dragenter", "dragover", "drop"]) el.dispatchEvent(new DragEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt }));
  }, { kind, x, y });
  await page.waitForTimeout(700);
}
const rectOf = (page: Page, id: string) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, id);
const selected = (page: Page) => page.evaluate(() => document.querySelector("[data-chrome-mirror]")?.getAttribute("data-chrome-mirror") ?? null);
async function selectById(page: Page, id: string) {
  const at = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!; e.scrollIntoView({ block: "center" }); return null; }, id); void at;
  for (let i = 0; i < 6 && (await selected(page)) !== id; i++) {
    const r = await rectOf(page, id); await page.mouse.click(r.x + r.w - 8, r.y + Math.min(r.h / 2, 300)); await page.waitForTimeout(300);
  }
  for (let i = 0; i < 6 && (await selected(page)) !== id; i++) { await page.keyboard.press("Escape"); await page.waitForTimeout(250); }
  expect(await selected(page), "selected by clicking, as a person does").toBe(id);
}

test("LE15l-h · a Stack dropped beside a picture shares the line with the words beside it", async ({ page }) => {
  test.setTimeout(90_000);
  await schoolHome(page);
  const ids = await page.evaluate(() => {
    const pic = document.querySelector('img[alt^="Mrs Okafor"]')!.closest("[data-box-id]")!; // the head's picture, by its words
    const row = pic.parentElement!.closest("[data-box-id]")!; const words = Array.from(row.children).find((c) => c !== pic && c.hasAttribute("data-box-id"))!;
    pic.scrollIntoView({ block: "center" });
    return { pic: pic.getAttribute("data-box-id")!, words: words.getAttribute("data-box-id")!, row: row.getAttribute("data-box-id")! };
  });
  const p0 = await rectOf(page, ids.pic), w0 = await rectOf(page, ids.words);
  const oneLine = (a: { y: number; h: number }, b: { y: number; h: number }) => Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > Math.min(a.h, b.h) * 0.5;
  expect(oneLine(p0, w0), "precondition: picture and words on one line").toBe(true);
  await dropKind(page, "container", p0.x + p0.w - 12, p0.y + p0.h / 2);
  const kids = await page.evaluate((row) => Array.from(document.querySelector(`[data-box-id="${CSS.escape(row)}"]`)!.children).filter((c) => c.hasAttribute("data-box-id")).map((c) => { const r = c.getBoundingClientRect(); return { id: c.getAttribute("data-box-id")!, x: r.x, y: r.y, w: r.width, h: Math.max(r.height, 1) }; }), ids.row);
  expect(kids.length, "the Stack joined the row").toBe(3);
  const [a, b, c] = kids;
  expect(a.id, "the picture is first").toBe(ids.pic);
  expect(oneLine(a, b) && oneLine(a, c), "picture | new Stack | words on ONE line").toBe(true);
  expect(b.x, "the new Stack is between them").toBeGreaterThan(a.x + a.w - 2);
  expect(Math.abs(a.w - p0.w), "the picture keeps its width").toBeLessThan(4);
});

test("LE15l-i · dragging a block to the bottom of the window scrolls the page", async ({ page }) => {
  test.skip(await coarse(page), "a finger's drag already scrolls near the edges (E-5b)");
  test.setTimeout(90_000);
  await schoolHome(page);
  const hello = await page.evaluate(() => Array.from(document.querySelectorAll("h2")).find((e) => /Hello, and/.test(e.textContent || ""))!.closest("section")!.getAttribute("data-box-id")!);
  await selectById(page, hello);
  const g = (await page.getByRole("toolbar", { name: "Block toolbar" }).getByLabel("Drag to move").boundingBox())!;
  const scrollTop = () => page.evaluate(() => (document.querySelector("[data-canvas-scroller]") as HTMLElement | null ?? document.scrollingElement!).scrollTop);
  const s0 = await scrollTop();
  await page.mouse.move(g.x + 6, g.y + 6); await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(g.x + 6 + 25 * i, g.y + 6 + ((938 - g.y) * i) / 12); await page.waitForTimeout(30); }
  for (let i = 0; i < 20; i++) { await page.mouse.move(g.x + 306, 938 + (i % 2)); await page.waitForTimeout(60); }
  const s1 = await scrollTop();
  await page.keyboard.press("Escape"); await page.mouse.up();
  expect(s1 - s0, "held at the bottom edge, the page scrolled under the dragged block").toBeGreaterThan(100);
});

test("LE15l-p · a tall section's bar stays on screen when its top is at the top of the canvas", async ({ page }) => {
  test.skip(await coarse(page), "a finger's bar is docked at the bottom of the screen (E5b-8)");
  test.setTimeout(90_000);
  await schoolHome(page);
  // "A welcome from our head" — taller than nothing here, so the window is made short enough that it is taller than the canvas
  await page.setViewportSize({ width: 1600, height: 620 });
  // the block a page band holds (it publishes as a <div> without a heading — SE-1): the picture's ancestor whose parent is a band of the page
  const sec = await page.evaluate(() => { const pageRoot = document.querySelector("[data-box-id]")!; let e = document.querySelector('img[alt^="Mrs Okafor"]')!.closest("[data-box-id]")!;
    for (;;) { const band = e.parentElement!.closest("[data-box-id]")!; if (band.parentElement!.closest("[data-box-id]") === pageRoot) return e.getAttribute("data-box-id")!; e = band; } });
  await selectById(page, sec);
  // the section's top scrolled to the very top of what the canvas shows, then a little past it
  await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!; const sc = (document.querySelector("[data-canvas-scroller]") as HTMLElement | null) ?? document.scrollingElement!; sc.scrollBy(0, e.getBoundingClientRect().top - sc.getBoundingClientRect().top + 40); }, sec);
  await page.waitForTimeout(500);
  expect(await selected(page)).toBe(sec);
  const bar = page.getByRole("toolbar", { name: "Block toolbar" });
  const seen = await bar.evaluate((b) => { const r = b.getBoundingClientRect(); const up = b.querySelector('[aria-label="Move up"]')!.getBoundingClientRect(); const top = document.elementFromPoint(up.x + up.width / 2, up.y + up.height / 2); return { top: r.top, bottom: r.bottom, h: innerHeight, mine: !!top && b.contains(top) }; });
  expect(seen.top, "the bar is inside the window").toBeGreaterThanOrEqual(0);
  expect(seen.bottom).toBeLessThanOrEqual(seen.h);
  expect(seen.mine, "nothing of the editor lies over its buttons").toBe(true);
});

test("LE15l-s · a component's bar arrows move it, as the ↑ key does", async ({ page }) => {
  test.skip(await coarse(page), "a finger's bar is docked (E5b-8); the app pass covers it");
  test.setTimeout(90_000);
  await schoolHome(page);
  const before = await page.evaluate(() => new Set(Array.from(document.querySelectorAll("[data-box-id]")).map((e) => e.getAttribute("data-box-id"))).size);
  await page.getByText(/Hello, and/).first().evaluate((e) => e.scrollIntoView({ block: "center" })); await page.waitForTimeout(300);
  const h = (await page.getByText(/Hello, and/).first().boundingBox())!;
  await dropKind(page, "accordion", h.x + h.width / 2, h.y + h.height + 6);
  const acc = await page.evaluate(() => document.querySelector(".eu-accordion")?.closest("[data-box-id]")?.getAttribute("data-box-id") ?? null);
  expect(acc, `an Accordion was added (${before} blocks before)`).toBeTruthy();
  const order = () => page.evaluate((id) => { const all = Array.from(document.querySelectorAll("[data-box-id]")); const a = document.querySelector(`[data-box-id="${CSS.escape(id!)}"]`)!; const words = all.find((e) => /^Hello, and/.test((e.textContent || "").trim()) && !e.querySelector("[data-box-id]"))!; return a.compareDocumentPosition(words) & Node.DOCUMENT_POSITION_FOLLOWING ? "accordion first" : "words first"; }, acc);
  expect(await order(), "precondition: dropped under the words").toBe("words first");
  // selected as a person selects it: a click on its first question, which also picks that question out (the item toolbar)
  const q = page.locator(`[data-box-id="${acc}"] .eu-accordion__title`).first();
  for (let i = 0; i < 6 && (await selected(page)) !== acc; i++) { await q.click(); await page.waitForTimeout(300); }
  expect(await selected(page)).toBe(acc);
  await page.getByRole("toolbar", { name: "Block toolbar" }).getByRole("button", { name: "Move up" }).click();
  await page.waitForTimeout(600);
  expect(await order(), "the bar's Move up moved it above the words").toBe("accordion first");
});

test("LE15l-5 · selecting a grid draws the page grid; a heading does not", async ({ page }) => {
  test.setTimeout(90_000);
  await schoolHome(page);
  const guides = () => page.locator("[data-layout-guides]").count();
  expect(await guides(), "precondition: the switch is off and nothing is selected").toBe(0);
  const grid = await page.evaluate(() => { const t = Array.from(document.querySelectorAll("[data-box-id]")).find((e) => (e.textContent || "").trim() === "Term dates")!; let g: Element | null = t; while (g && getComputedStyle(g).display !== "grid") g = g.parentElement!.closest("[data-box-id]"); return g!.getAttribute("data-box-id")!; });
  await selectById(page, grid);
  expect(await guides(), "a grid selected: its page grid is drawn").toBe(1);
  const head = await page.evaluate(() => Array.from(document.querySelectorAll("h2")).find((e) => /Hello, and/.test(e.textContent || ""))!.closest("[data-box-id]")!.getAttribute("data-box-id")!);
  await selectById(page, head);
  expect(await guides(), "a heading selected: gone again").toBe(0);
});

test("LE15l-6 · a text, a button and a picture take another meaning, on the canvas and in the Preview", async ({ page }) => {
  test.setTimeout(120_000);
  await schoolHome(page);
  const M = INSPECTOR.meaning;
  const idOf = (re: string) => page.evaluate((src) => Array.from(document.querySelectorAll("[data-box-id]")).filter((e) => new RegExp(src).test((e.textContent || "").trim())).pop()!.getAttribute("data-box-id")!, re);
  async function mean(id: string, label: string) {
    await selectById(page, id);
    const acc = page.getByRole("button", { name: /^Meaning/ }).first();
    if ((await acc.getAttribute("aria-expanded")) !== "true") await acc.click();
    const sel = page.getByLabel("What is this block").first();
    if ((await sel.evaluate((e) => e.tagName)) === "SELECT") await sel.selectOption({ label }); else { await sel.click(); await page.getByRole("option", { name: label }).first().click(); }
    await page.waitForTimeout(500);
  }
  const tagIn = (id: string, tag: string) => page.evaluate(([id, tag]) => { const e = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!; return e.tagName === tag || !!e.querySelector(tag); }, [id, tag]);
  const words = await idOf("^Open day on Saturday"); await mean(words, M.text[1].label);
  expect(await tagIn(words, "BLOCKQUOTE"), "Quote → <blockquote> on the canvas").toBe(true);
  const btn = await idOf("^Book your place$"); await mean(btn, M.button[1].label);
  expect(await tagIn(btn, "BUTTON"), "Button → <button> on the canvas").toBe(true);
  const pic = await page.evaluate(() => document.querySelector('img[alt^="Mrs Okafor"]')!.closest("[data-box-id]")!.getAttribute("data-box-id")!);
  await mean(pic, M.image[1].label);
  await page.getByLabel(M.caption).first().fill("Mrs Okafor, our head");
  await page.waitForTimeout(600);
  expect(await tagIn(pic, "FIGCAPTION"), "the caption under the picture on the canvas").toBe(true);
  await page.keyboard.press("Escape"); await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Preview", exact: true }).first().click();
  const f = (await (await page.waitForSelector("iframe")).contentFrame())!;
  await f.waitForSelector("blockquote", { timeout: 20_000 });
  expect(await f.evaluate(() => ({ q: !!Array.from(document.querySelectorAll("blockquote")).find((e) => /Open day/.test(e.textContent || "")), b: !!Array.from(document.querySelectorAll("button")).find((e) => /Book your place/.test(e.textContent || "")), fig: /Mrs Okafor, our head/.test(document.querySelector("figure figcaption")?.textContent || "") })), "the Preview publishes all three").toEqual({ q: true, b: true, fig: true });
});

test("LE15l-v · a Stack dropped beside a card's icon goes beside it, as its drop line shows", async ({ page }) => {
  test.setTimeout(90_000);
  await schoolHome(page);
  const ids = await page.evaluate(() => {
    const card = Array.from(document.querySelectorAll("[data-box-id]")).find((e) => (e.textContent || "").trim() === "Admissions" && e.querySelector("svg"))!;
    card.scrollIntoView({ block: "center" });
    const icon = Array.from(card.querySelectorAll("[data-box-id]")).find((e) => e.querySelector("svg") && !Array.from(e.querySelectorAll("[data-box-id]")).some((k) => k.querySelector("svg")))!; // the innermost: the icon itself
    return { card: card.getAttribute("data-box-id")!, icon: icon.getAttribute("data-box-id")! };
  });
  const idsIn = (card: string) => page.evaluate((card) => Array.from(document.querySelector(`[data-box-id="${CSS.escape(card)}"]`)!.querySelectorAll("[data-box-id]")).map((e) => e.getAttribute("data-box-id")!), card);
  const before = await idsIn(ids.card);
  const ic = await rectOf(page, ids.icon);
  await dropKind(page, "container", ic.x + ic.w - 8, ic.y + ic.h / 2); // on the icon block's right side, as dropBeside aims (h.js)
  const fresh = (await idsIn(ids.card)).filter((id) => !before.includes(id));
  const seen = await page.evaluate(([card, icon, fresh]) => {
    const box = (id: string) => document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!;
    const i = box(icon).getBoundingClientRect();
    const stack = (fresh as string[]).map(box).find((e) => !e.querySelector("[data-box-id]"))!; // the new Stack: the new block holding nothing
    const n = stack.getBoundingClientRect();
    const words = Array.from(box(card as string).querySelectorAll("[data-box-id]")).find((e) => (e.textContent || "").trim() === "Admissions" && !e.querySelector("svg"))!.getBoundingClientRect();
    const f = (r: DOMRect) => `${Math.round(r.left)}-${Math.round(r.right)} x ${Math.round(r.top)}-${Math.round(r.bottom)}`;
    return { at: `icon ${f(i)} · new ${f(n)}`, added: (fresh as string[]).length, beside: Math.min(n.bottom, i.bottom) - Math.max(n.top, i.top) > Math.min(n.height, i.height) * 0.5 && n.left >= i.right - 2, wordsBelow: words.top >= Math.min(n.bottom, i.bottom) - 2 };
  }, [ids.card, ids.icon, fresh] as const);
  expect(seen.added, "something was added in the card").toBeGreaterThan(0);
  expect(seen.beside, `the new Stack is BESIDE the icon, where the drop line stood (${seen.at})`).toBe(true);
  expect(seen.wordsBelow, "the card's words stay under them").toBe(true);
});

test("LE15l-q · a Stack dropped beside a centred name stays on its line, as the drop line shows", async ({ page }) => {
  test.setTimeout(120_000);
  await schoolHome(page);
  // the footer "Everything centred", added from the Sections tab as a person adds it (it replaces the page's footer when asked)
  await page.getByRole("button", { name: "Open blocks panel" }).click();
  await page.getByRole("tab", { name: T.tab, exact: true }).click();
  await page.getByRole("tablist", { name: T.categories }).getByRole("tab", { name: /^Footers/ }).click();
  await page.getByRole("button", { name: /^Add Everything centred,/ }).first().click();
  const replace = page.getByRole("button", { name: T.replaceButton, exact: true }).first();
  if (await replace.isVisible().catch(() => false)) await replace.click();
  await page.getByRole("tab", { name: "All", exact: true }).first().click();
  const name = await page.evaluate(() => { const e = Array.from(document.querySelectorAll("footer [data-box-id], [data-box-id]")).filter((x) => (x.textContent || "").trim() === "Greenfield Academy" && !x.querySelector("[data-box-id]")).pop()!; e.scrollIntoView({ block: "center" }); return e.getAttribute("data-box-id")!; });
  await page.waitForTimeout(400);
  const r = await rectOf(page, name);
  const band = await page.evaluate((id) => document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!.parentElement!.closest("[data-box-id]")!.getAttribute("data-box-id")!, name);
  await dropKind(page, "container", r.x + r.w - 8, r.y + r.h / 2);
  const kids = await page.evaluate((band) => Array.from(document.querySelector(`[data-box-id="${CSS.escape(band)}"]`)!.children).filter((c) => c.hasAttribute("data-box-id")).map((c) => { const q = c.getBoundingClientRect(); return { top: q.top, bottom: q.bottom }; }), band);
  expect(kids.length, "the Stack joined the name's line").toBe(2);
  expect(Math.min(kids[0].bottom, kids[1].bottom) - Math.max(kids[0].top, kids[1].top), "the name and the Stack on ONE line").toBeGreaterThan(0);
});
