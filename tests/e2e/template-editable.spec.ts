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
  const kids = await page.evaluate((band) => Array.from(document.querySelector(`[data-box-id="${CSS.escape(band)}"]`)!.children).filter((c) => c.hasAttribute("data-box-id")).map((c) => { const q = c.getBoundingClientRect(); return { top: q.top, bottom: q.bottom, h: q.height }; }), band);
  expect(kids.length, "the Stack joined the name's line").toBe(2);
  // more than half the shorter one's height shared — a Stack that only touches the name (under it) shares 0 (LE15l-y)
  expect(Math.min(kids[0].bottom, kids[1].bottom) - Math.max(kids[0].top, kids[1].top), "the name and the Stack on ONE line").toBeGreaterThan(Math.min(kids[0].h, kids[1].h) * 0.5);
});

/** LE15l-y: the hero "Words, three points and a picture" from the Sections tab, a Stack dropped on its heading's right side. */
async function besideTheHeading(page: Page, slowFonts: boolean) {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "the column sits beside the picture only on a wide screen; narrower, it stacks and the heading has the whole width");
  test.setTimeout(120_000);
  // the page's fonts held back, as on Slow 3G (RULE AF): the drop happens while the heading is still drawn in the fallback font
  if (slowFonts) await page.route(/\.(woff2?|ttf)(\?|$)|fonts\.(googleapis|gstatic)/, async (rt) => { await new Promise((ok) => setTimeout(ok, 8000)); await rt.continue(); });
  await schoolHome(page);
  // the hero "Words, three points and a picture", added from the Sections tab as a person adds it
  await page.getByRole("button", { name: "Open blocks panel" }).click();
  await page.getByRole("tab", { name: T.tab, exact: true }).click();
  await page.getByRole("tablist", { name: T.categories }).getByRole("tab", { name: /^Hero/ }).click();
  await page.getByRole("button", { name: /^Add Words, three points and a picture,/ }).first().click();
  const replace = page.getByRole("button", { name: T.replaceButton, exact: true }).first();
  if (await replace.isVisible().catch(() => false)) await replace.click();
  await page.getByRole("tab", { name: "All", exact: true }).first().click();
  const head = await page.evaluate(() => { const e = Array.from(document.querySelectorAll("[data-box-id]")).filter((x) => (x.textContent || "").trim() === "Why families choose Greenfield" && !x.querySelector("[data-box-id]")).pop()!; e.scrollIntoView({ block: "center" }); return e.getAttribute("data-box-id")!; });
  await page.waitForTimeout(400);
  if (slowFonts) expect(await page.evaluate(() => document.fonts.status), "precondition: the fonts are still loading").toBe("loading");
  const r = await rectOf(page, head);
  const band = await page.evaluate((id) => document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!.parentElement!.closest("[data-box-id]")!.getAttribute("data-box-id")!, head);
  await dropKind(page, "container", r.x + r.w - 8, r.y + r.h / 2);
  if (slowFonts) { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800); }
  const seen = await page.evaluate(([band, head]) => {
    const kids = Array.from(document.querySelector(`[data-box-id="${CSS.escape(band)}"]`)!.children).filter((c) => c.hasAttribute("data-box-id"));
    const h = document.querySelector(`[data-box-id="${CSS.escape(head)}"]`) as HTMLElement;
    const copy = h.cloneNode(true) as HTMLElement; Object.assign(copy.style, { position: "absolute", visibility: "hidden", width: "min-content", minWidth: "0", maxWidth: "none" }); h.parentElement!.appendChild(copy);
    const min = copy.getBoundingClientRect().width; copy.remove();
    const q = kids.map((c) => c.getBoundingClientRect());
    // ONE line = they share more than half the shorter one's height — two boxes that only touch (one under the other) share 0
    return { n: kids.length, oneLine: q.length === 2 && Math.min(q[0].bottom, q[1].bottom) - Math.max(q[0].top, q[1].top) > Math.min(q[0].height, q[1].height) * 0.5, at: q.map((x) => `${Math.round(x.left)},${Math.round(x.top)} ${Math.round(x.width)}×${Math.round(x.height)}`).join(" · "), headW: h.getBoundingClientRect().width, min };
  }, [band, head] as const);
  expect(seen.n, "the Stack joined the heading's line").toBe(2);
  expect(seen.oneLine, `the heading and the Stack on ONE line, as the drop line showed (${seen.at})`).toBe(true);
  expect(seen.headW, "the heading is no narrower than its longest word").toBeGreaterThanOrEqual(seen.min - 1);
  await page.keyboard.press("Control+z"); await page.waitForTimeout(600);
  expect(await page.evaluate((band) => Array.from(document.querySelector(`[data-box-id="${CSS.escape(band)}"]`)?.children ?? []).filter((c) => c.hasAttribute("data-box-id")).length, band), "one Ctrl+Z takes the Stack away").toBe(1);
}
/** The page's top-level blocks (each band's one block), and where an id sits: on the page, or inside the header / footer. */
const topBlocks = (page: Page) => page.evaluate(() => { const s = JSON.parse(localStorage.getItem("educo_box_site_v1")!); const r = s.pages[s.pages.length - 1].root; return (r.children as { id: string; children?: { id: string }[] }[]).map((b) => (b.children?.length === 1 ? b.children[0].id : b.id)); });
const inside = (page: Page, outer: string, id: string) => page.evaluate(([o, i]) => !!document.querySelector(`[data-box-id="${CSS.escape(o)}"] [data-box-id="${CSS.escape(i)}"]`), [outer, id]);

test("LE15l-ao · a section dragged to the top edge of the header lands under it, as its line and chip say", async ({ page }) => {
  test.skip(await coarse(page), "a finger's bar is docked with no grip (E5b-8); the probe's long press covers it");
  test.setTimeout(90_000);
  await schoolHome(page);
  const [hdr, , second] = await topBlocks(page);
  await page.evaluate(() => (document.querySelector("[data-canvas-scroller]") ?? document.scrollingElement)!.scrollTo(0, 0));
  await selectById(page, second);
  await page.evaluate(() => (document.querySelector("[data-canvas-scroller]") ?? document.scrollingElement)!.scrollTo(0, 0)); await page.waitForTimeout(300);
  const g = (await page.getByRole("toolbar", { name: "Block toolbar" }).getByLabel("Drag to move").boundingBox())!;
  const h = await rectOf(page, hdr); const tx = h.x + h.w / 2, ty = h.y + 6;
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2); await page.mouse.down();
  for (let i = 1; i <= 14; i++) { await page.mouse.move(g.x + ((tx - g.x) * i) / 14, g.y + ((ty - g.y) * i) / 14); await page.waitForTimeout(25); }
  await page.waitForTimeout(300); await page.mouse.move(tx, ty);
  // where it is SHOWN while held: a line, or (LE-15n (3), along the page's line of sections) its faded self slid into the place
  await page.waitForTimeout(300);
  const shown = await page.evaluate((id) => { const m = Array.from(document.body.children).find((e) => e.getAttribute("aria-hidden") === "true" && getComputedStyle(e).position === "fixed" && /shadow-\[0_0_10px/.test(e.className)); const q = m?.getBoundingClientRect(); return q && q.width > 0 ? q.y + q.height / 2 : document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!.getBoundingClientRect().top; }, second);
  const words = await page.evaluate(() => document.querySelector("[data-drop-words]")?.textContent ?? null);
  const h1 = await rectOf(page, hdr);
  await page.mouse.move(tx, ty); await page.mouse.up(); await page.waitForTimeout(600);
  expect(await inside(page, hdr, second), "never inside the shared header").toBe(false);
  expect((await topBlocks(page)).slice(0, 2), "just under the header").toEqual([hdr, second]);
  expect(Math.abs(shown - (h1.y + h1.h)), `shown just under the header (at ${shown}, the header ends ${h1.y + h1.h})`).toBeLessThan(4);
  expect(words ?? "", "the chip says where, in plain words").toMatch(/^Above · /);
});

test("LE15l-ao · a block from the Blocks panel dropped on the top edge of the header goes under it", async ({ page }) => {
  test.setTimeout(90_000);
  await schoolHome(page);
  const [hdr] = await topBlocks(page);
  await page.evaluate(() => (document.querySelector("[data-canvas-scroller]") ?? document.scrollingElement)!.scrollTo(0, 0)); await page.waitForTimeout(300);
  const before = await topBlocks(page); const h = await rectOf(page, hdr);
  await dropKind(page, "container", h.x + h.w * 0.6, h.y + 4);
  const after = await topBlocks(page);
  const added = after.filter((id) => !before.includes(id));
  expect(added.length, `one new block on the page, not inside the header (${after.length} vs ${before.length})`).toBe(1);
  expect(after.indexOf(added[0]), "just under the header").toBe(1);
});

test("LE15l-ap · a link dragged along its own full menu row moves, and its line stands beside", async ({ page }) => {
  test.skip(await coarse(page), "a finger's bar is docked with no grip (E5b-8); the probe's long press covers it");
  test.setTimeout(90_000);
  await clearSite(page, undefined, { phoneScreen: true });
  await pressHeader(page, "Add page");
  const d = page.getByRole("dialog", { name: T.addPageTitle });
  await d.getByRole("textbox").fill("Landing 2");
  await d.getByRole("button", { name: /^Add Landing page,/ }).click();
  const menu = page.locator("header nav").first(); await menu.waitFor(); await page.waitForTimeout(600);
  const names = () => menu.evaluate((n) => Array.from(n.querySelectorAll("[data-box-id]:not(:has([data-box-id]))")).map((e) => (e.textContent || "").trim()).filter(Boolean));
  const ids = await menu.evaluate((n) => Object.fromEntries(Array.from(n.querySelectorAll("[data-box-id]:not(:has([data-box-id]))")).map((e) => [(e.textContent || "").trim(), e.getAttribute("data-box-id")!])));
  expect(await names(), "precondition: the menu as the template makes it").toEqual(["Home", "About", "Admissions", "News", "Contact"]);
  await selectById(page, ids.About);
  const g = (await page.getByRole("toolbar", { name: "Block toolbar" }).getByLabel("Drag to move").boundingBox())!;
  const s = await rectOf(page, ids.Admissions); const tx = s.x + s.w - 6, ty = s.y + s.h / 2;
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2); await page.mouse.down();
  for (let i = 1; i <= 14; i++) { await page.mouse.move(g.x + ((tx - g.x) * i) / 14, g.y + ((ty - g.y) * i) / 14); await page.waitForTimeout(25); }
  await page.waitForTimeout(300); await page.mouse.move(tx, ty);
  // LE-15n (3), signed 2026-10-21: along its own line the neighbours slide apart to show the place — Admissions makes room
  await page.waitForTimeout(300);
  const shifted = await page.evaluate((id) => new DOMMatrix(getComputedStyle(document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!).transform).m41, ids.Admissions);
  await page.mouse.move(tx, ty); await page.mouse.up(); await page.waitForTimeout(600);
  expect(shifted, "Admissions slid aside to open About's new place").toBeLessThan(-20);
  expect(await names(), "About moved past Admissions").toEqual(["Home", "Admissions", "About", "News", "Contact"]);
});

test("LE15l-y · a Stack dropped beside a heading in a narrow column shares the line without squeezing the heading", ({ page }) => besideTheHeading(page, false));
test("LE15l-y · …and when it is dropped while the page's fonts are still loading", ({ page }) => besideTheHeading(page, true));
