import { test, expect, type Page, type Frame } from "@playwright/test";
import { COMPONENT_CATALOGUE } from "../../lib/component-catalogue";

/**
 * L-9 (1) (BATCH LE-2) · THE CANVAS DRAWS WHAT THE PUBLISHED PAGE DRAWS — for grid cells, every component, and sticky, floating
 * and fixed blocks, at every device size of the editor. `parity-every-arrangement.spec.ts` (its name notwithstanding) only proves the
 * resize rules agree across Stack / Side by side / Grid on the canvas; nothing compared these arrangements with the Preview.
 * Behaviours: tests/features/components/website/box-builder-responsive.feature ("canvas = published page").
 *
 * BUILT THROUGH THE INTERFACE (RULE Y): palette tiles, a tile's own picker answered as a person answers it, the Inspector's
 * Placement controls. Every block's box (left, top, width, height in page px — the canvas divided by its scale, each measured from
 * its page's top-left) is compared with the same block's `.bx-<id>` in the Preview at that device's width.
 */
const DEVICES = [["Mobile (375px)", 375], ["Tablet (768px)", 768], ["Laptop (1024px)", 1024], ["Desktop (1280px)", 1280], ["Wide (1920px)", 1920]] as const;
const TOL = 2;

const openPanel = async (page: Page) => { const b = page.getByRole("button", { name: "Open blocks panel" }); if (await b.isVisible().catch(() => false)) { await b.click(); await page.waitForTimeout(600); } };
const closePanel = async (page: Page) => { const b = page.getByRole("button", { name: "Close blocks panel" }); if (await b.isVisible().catch(() => false)) { await b.click(); await page.waitForTimeout(400); } };
const selectedId = (page: Page) => page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
const deselect = async (page: Page) => { for (let i = 0; i < 4 && (await selectedId(page)); i++) { await page.keyboard.press("Escape"); await page.waitForTimeout(150); } };
/** A tile clicked; a tile that asks first is answered — the grid's shape, a component's "Default". Returns what it selected. */
async function tile(page: Page, text: string, shape = "2 across, 1 down") {
  await openPanel(page);
  await page.evaluate((t) => {
    const el = Array.from(document.querySelectorAll<HTMLElement>('[draggable="true"]')).find((e) => (e.textContent || "").trim().startsWith(t));
    if (!el) throw new Error(`no tile ${t}`); el.scrollIntoView({ block: "center" }); el.click();
  }, text);
  await page.waitForTimeout(700);
  const grid = page.locator(`[role="menu"][aria-label="Choose a layout"] [aria-label="${shape}"]`);
  if (await grid.isVisible().catch(() => false)) { await grid.click(); await page.waitForTimeout(700); }
  const dflt = page.locator(`[role="menu"][aria-label^="Add "]`).getByRole("menuitem", { name: "Default" });
  if (await dflt.isVisible().catch(() => false)) { await dflt.click(); await page.waitForTimeout(700); }
  return selectedId(page);
}
/** A Stack with a block INSIDE it (Where → Inside) — never an empty box: the canvas draws an empty box 8rem tall so a block can be
 *  dropped into it, and the published page does not (E-6, the quiet empty box) — by design, so every page here is dressed (RULE E). */
async function stackWith(page: Page, inner: string) {
  await where(page, "End"); const s = (await tile(page, "Stack"))!;
  await where(page, "Inside"); const k = (await tile(page, inner))!;
  return { s, k };
}
/** The panel's "Where the block goes" — End (a new section at the foot of the page) · Inside · After — chosen before each tile. */
async function where(page: Page, choice: "End" | "Inside" | "After") {
  await openPanel(page);
  const b = page.getByRole("group", { name: "Where the block goes" }).getByRole("button", { name: choice, exact: true }).first();
  if (await b.isVisible().catch(() => false)) { await b.click(); await page.waitForTimeout(250); }
}
async function select(page: Page, id: string) {
  await closePanel(page);
  // a click goes one box deeper; past it (a block INSIDE it selected), Escape climbs back up — as a person does
  for (let i = 0; i < 12 && (await selectedId(page)) !== id; i++) {
    const cur = await selectedId(page);
    const inside = cur && (await page.evaluate(([o, c]) => !!document.querySelector(`[data-box-id="${o}"]`)?.querySelector(`[data-box-id="${c}"]`), [id, cur]));
    if (inside) { await page.keyboard.press("Escape"); await page.waitForTimeout(200); continue; }
    // aim where the block itself is on top — never at the floating toolbar or another block lying over it
    const pt = await page.evaluate((id) => {
      const me = document.querySelector(`[data-box-id="${id}"]`)!, r = me.getBoundingClientRect();
      for (const [fx, fy] of [[0.8, 0.8], [0.5, 0.5], [0.2, 0.8], [0.8, 0.2], [0.2, 0.2], [0.5, 0.9]]) {
        const x = r.left + r.width * fx, y = r.top + r.height * fy, hit = document.elementFromPoint(x, y);
        if (hit && me.contains(hit)) return { x, y };
      }
      return null;
    }, id);
    if (!pt) break;
    await page.mouse.click(pt.x, pt.y); await page.waitForTimeout(250);
  }
  expect(await selectedId(page), `selected ${id}`).toBe(id);
}
async function placement(page: Page, id: string, choice: RegExp) {
  await select(page, id);
  const ex = page.getByRole("button", { name: "Expand inspector" }); if (await ex.isVisible().catch(() => false)) await ex.click();
  await page.getByRole("tab", { name: "Design" }).first().click();
  const head = page.getByRole("button", { name: /^\s*Placement\s*$/ }).first();
  if ((await head.getAttribute("aria-expanded")) === "false") await head.click();
  await page.locator("aside[aria-label=\"Inspector\"]").getByRole("button", { name: choice }).first().click();
  await page.waitForTimeout(700);
}
/** Every block's box in page px, from its page's top-left — the canvas (÷ its scale) or the Preview. */
const boxes = (doc: Page | Frame, engine: "canvas" | "preview") => doc.evaluate((engine) => {
  const out: Record<string, number[]> = {};
  const els = engine === "canvas" ? [...document.querySelectorAll<HTMLElement>("[data-box-id]")] : [...document.querySelectorAll<HTMLElement>('[class*="bx-"]')];
  const first = els[0]; if (!first) return out;
  const Z = engine === "canvas" ? Number(first.closest<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale) || 1 : 1;
  const frame = engine === "canvas" ? first.closest<HTMLElement>("[data-canvas-scale]")!.getBoundingClientRect() : { left: 0, top: -scrollY };
  for (const e of els) {
    const id = engine === "canvas" ? e.getAttribute("data-box-id")! : [...e.classList].find((c) => c.startsWith("bx-"))!.slice(3);
    const r = e.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) continue;
    out[id] = [(r.left - frame.left) / Z, (r.top - frame.top) / Z, r.width / Z, r.height / Z].map((v) => Math.round(v * 10) / 10);
  }
  return out;
}, engine);
async function previewAt(page: Page, w: number): Promise<Frame> {
  await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(400);
  let f = (await (await page.$('iframe[title="Site preview"]'))!.contentFrame())!;
  const inner = await f.evaluate(() => document.documentElement.clientWidth);
  if (inner !== w) { await page.setViewportSize({ width: w + (w - inner), height: 900 }); await page.waitForTimeout(400); f = (await (await page.$('iframe[title="Site preview"]'))!.contentFrame())!; }
  await f.evaluate(async () => { await document.fonts.ready; scrollTo(0, 0); });
  await page.waitForTimeout(300);
  return f;
}
/** The canvas at each device, then the Preview at its width: every block both draw, no further apart than TOL. */
async function compare(page: Page, ids: (string | null)[]) {
  const watch = ids.filter(Boolean) as string[];
  const canvas: Record<number, Record<string, number[]>> = {};
  await deselect(page); await closePanel(page);
  for (const [dev, w] of DEVICES) {
    await page.setViewportSize({ width: 1520, height: 900 });
    await page.locator(`button[title="${dev}"]`).first().click(); await page.waitForTimeout(900);
    await page.evaluate(async () => { await document.fonts.ready; document.querySelector("[data-canvas-scale]")?.closest<HTMLElement>("[class*=overflow]")?.scrollTo(0, 0); });
    canvas[w] = await boxes(page, "canvas");
  }
  await page.setViewportSize({ width: 1520, height: 900 });
  await page.getByRole("button", { name: "Preview", exact: true }).first().click();
  await page.waitForSelector('iframe[title="Site preview"]', { timeout: 15000 }); await page.waitForTimeout(800);
  await page.keyboard.press("h");
  const bad: string[] = [];
  for (const [, w] of DEVICES) {
    const p = await boxes(await previewAt(page, w), "preview");
    for (const id of watch) {
      const c = canvas[w][id], v = p[id];
      if (!c || !v) { bad.push(`${w}: ${id} ${!c ? "not on the canvas" : "not in the Preview"}`); continue; }
      const d = c.map((x, i) => Math.abs(x - v[i]));
      if (Math.max(...d) > TOL) bad.push(`${w}: ${id} canvas [${c.join(", ")}] · Preview [${v.join(", ")}]`);
    }
  }
  expect(bad, "canvas ≠ published page").toEqual([]);
}
async function fresh(page: Page, errs: string[]) {
  page.on("pageerror", (e) => errs.push(e.message.split("\n")[0]));
  await page.setViewportSize({ width: 1520, height: 900 });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem("cep")) { localStorage.clear(); sessionStorage.setItem("cep", "1"); } } catch { /* private mode */ } });
  await page.goto("/website/box-demo", { waitUntil: "load" }); await page.waitForTimeout(2500);
}
/** Every block id now on the page (the canvas), including the bands the builder wraps them in. */
const allIds = (page: Page) => page.evaluate(() => [...document.querySelectorAll("[data-box-id]")].map((e) => e.getAttribute("data-box-id")!));

test.describe("L-9 · the canvas equals the published page, at every device size", () => {
  // it sets its own window and walks every device size itself; the finger's pass is the HEADED UAT (uat-le2-headed.js)
  test.beforeEach(() => { test.skip(test.info().project.name !== "desktop-chrome", "sets its own windows and walks every device size itself"); });
  test("grid cells — a 2 × 1 and a 3 × 2 Grid, words in their cells", async ({ page }) => {
    const errs: string[] = []; await fresh(page, errs);
    const before = new Set(await allIds(page));
    await stackWith(page, "Heading");
    const g1 = (await tile(page, "Grid", "2 across, 1 down"))!;
    await deselect(page); const g2 = (await tile(page, "Grid", "3 across, 2 down"))!;
    // a Text into EVERY cell, as a person fills a cell: select it, click the tile (a selected cell receives it)
    for (const g of [g1, g2]) {
      const cells = await page.evaluate((g) => [...document.querySelector(`[data-box-id="${g}"]`)!.children].flatMap((e) => (e.getAttribute("data-box-id") ? [e.getAttribute("data-box-id")!] : [])), g);
      expect(cells.length, "the grid's cells").toBeGreaterThanOrEqual(2);
      for (const c of cells) { await select(page, c); await tile(page, "Text"); }
    }
    await compare(page, (await allIds(page)).filter((i) => !before.has(i)));
    expect(errs).toEqual([]);
  });

  test("every component of the catalogue", async ({ page }) => {
    const errs: string[] = []; await fresh(page, errs);
    const before = new Set(await allIds(page));
    for (const c of COMPONENT_CATALOGUE) { await deselect(page); await tile(page, c.label); }
    await compare(page, (await allIds(page)).filter((i) => !before.has(i)));
    expect(errs).toEqual([]);
  });

  // LE2-9 (found READING the HEADED UAT's screenshot): a header's Links are published as a menu (nav > ul > li > a, no bullets); the
  // canvas drew each as an <li> with no list around it, so the browser put a bullet beside every link — canvas ≠ published page.
  test("a header's Links: a menu in the Preview, and no bullet beside them on the canvas or in the Preview", async ({ page }) => {
    const errs: string[] = []; await fresh(page, errs);
    await where(page, "End"); const hdr = (await tile(page, "Side by side"))!;
    await where(page, "Inside"); await tile(page, "Link"); for (let i = 0; i < 3; i++) { await where(page, "After"); await tile(page, "Link"); }
    await select(page, hdr);
    await page.getByRole("tab", { name: "Design" }).first().click();
    const head = page.getByRole("button", { name: /^\s*Meaning\s*$/ }).first(); if ((await head.getAttribute("aria-expanded")) === "false") await head.click();
    const trig = page.getByRole("button", { name: /^What is this block/ }).first(); await trig.scrollIntoViewIfNeeded(); await trig.click();
    await page.getByRole("option", { name: /^\s*Page header/ }).first().click(); await page.waitForTimeout(600);
    await deselect(page);
    const markers = (doc: Page | Frame) => doc.evaluate(() => [...document.querySelectorAll("li")].filter((l) => l.querySelector("a")).map((l) => getComputedStyle(l).listStyleType));
    const onCanvas = await markers(page);
    expect(onCanvas.length, "the links are list items on the canvas").toBe(4);
    expect(onCanvas.filter((m) => m !== "none"), "a bullet beside a link on the canvas").toEqual([]);
    await page.getByRole("button", { name: "Preview", exact: true }).first().click();
    await page.waitForSelector('iframe[title="Site preview"]', { timeout: 15000 }); await page.waitForTimeout(800);
    const f = await previewAt(page, 1280);
    expect(await f.evaluate(() => document.querySelectorAll("nav > ul > li > a").length), "nav > ul > li > a").toBe(4);
    expect((await markers(f)).filter((m) => m !== "none"), "a bullet in the Preview").toEqual([]);
    expect(errs).toEqual([]);
  });

  test("a sticky block, a floating block and a fixed block — and the neighbours of the floating and fixed ones do not move", async ({ page }) => {
    const errs: string[] = []; await fresh(page, errs);
    const before = new Set(await allIds(page));
    const { s: sticky } = await stackWith(page, "Text");
    await deselect(page); const { s: floatHost, k: floated } = await stackWith(page, "Button"); await where(page, "After"); const after1 = (await tile(page, "Text"))!;
    await deselect(page); const { s: fixedHost, k: fixed } = await stackWith(page, "Button"); await where(page, "After"); const after2 = (await tile(page, "Text"))!;
    await deselect(page); await stackWith(page, "Text");
    await placement(page, sticky, /^Sticks when reached/);
    await placement(page, floated, /^Floating$/);
    await placement(page, fixed, /^Floating$/); await placement(page, fixed, /^Floats on screen/);
    // MOVING a floating or fixed block never moves its neighbours (Task 4), nudged by the keyboard, the person's own route: the block
    // beside it in its section keeps its place; its own section grows to hold it (`floatingReserve` — deliberate: a section always
    // contains its floating blocks), and a section below moves by exactly that growth and nothing more.
    const hosts = { [floated]: { host: floatHost, sib: after1 }, [fixed]: { host: fixedHost, sib: after2 } };
    for (const moving of [floated, fixed]) {
      const b0 = await boxes(page, "canvas");
      await select(page, moving); for (let i = 0; i < 6; i++) { await page.keyboard.press("Shift+ArrowDown"); await page.waitForTimeout(60); }
      await page.waitForTimeout(500);
      const b1 = await boxes(page, "canvas");
      const say = (n: string) => `${n} moved when ${moving} was nudged: [${b0[n].join(", ")}] → [${b1[n].join(", ")}]; it: [${b0[moving].join(", ")}] → [${b1[moving].join(", ")}]`;
      expect(Math.abs(b1[moving][1] - b0[moving][1]), `${moving} was nudged`).toBeGreaterThan(TOL);
      const { host, sib } = hosts[moving];
      expect(Math.max(...b1[sib].map((v, i) => Math.abs(v - b0[sib][i]))), say(sib)).toBeLessThanOrEqual(TOL);
      const grew = b1[host][3] - b0[host][3];
      for (const n of [sticky, floatHost, fixedHost].filter((x) => x !== host)) {
        const shift = b0[n][1] > b0[host][1] ? grew : 0;
        expect(Math.abs(b1[n][1] - b0[n][1] - shift), say(n)).toBeLessThanOrEqual(TOL);
        expect(Math.abs(b1[n][3] - b0[n][3]), say(n)).toBeLessThanOrEqual(TOL);
      }
    }
    await compare(page, (await allIds(page)).filter((i) => !before.has(i)));
    expect(errs).toEqual([]);
  });
});
