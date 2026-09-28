import { test, expect, type Page, type Frame } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * A GRID NARROWS BY ITS OWN BOX (#111) — behaviours in tests/features/components/website/box-builder-columns.feature.
 *
 * REGRESSION GUARD, seeded: the shape below was first built THROUGH THE UI (scripts/uat/probe-t1.js — the ancestra
 * our_team page's first section, a three-cell grid whose middle cell took a second three-cell grid of quotes) and
 * measured in both engines: at 768px the inner grid drew twelve 21px tracks, each quote 85px wide, and broke
 * "everything" letter by letter. The seed pins that geometry so the fix cannot quietly leave.
 */
const QUOTE = "“This changed everything for us — we couldn't be happier.”";
const cell = (id: string, children: unknown[]) => ({ id, type: "container", layout: "flex", direction: "column", padding: 0, gap: 0, width: "100%", colSpan: 4, children });
const text = (id: string) => ({ id, type: "text", text: QUOTE, fontSize: 22, italic: true, width: "100%" });
const grid = (id: string, cells: unknown[]) => ({ id, type: "container", layout: "grid", columns: 12, gap: 16, padding: 0, width: "100%", children: cells });
const band = (id: string, child: unknown) => ({ id, type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [child] });

async function seed(page: Page) {
  const inner = grid("inner", [cell("i1", [text("q1")]), cell("i2", [text("q2")]), cell("i3", [text("q3")])]);
  const outer = grid("outer", [cell("o1", [text("t1")]), cell("o2", [band("ib", inner)]), cell("o3", [text("t3")])]);
  await seedSite(page, sitePage([{ id: "sec", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, children: [band("ob", outer)] }]));
  await page.waitForSelector('[data-box-id="inner"]', { timeout: 30000 });
  await page.waitForTimeout(400);
}

type M = { outer: number; inner: number; o2: number; i1: number; broken: number; containerType: string };
/** Track counts, cell widths, the query container, and whether any word in a quote is broken across lines. */
const measure = (doc: Page | Frame, engine: "canvas" | "preview") => doc.evaluate((engine): M => {
  const q = (id: string) => document.querySelector(engine === "canvas" ? `[data-box-id="${id}"]` : `.bx-${id}`) as HTMLElement;
  const tracks = (id: string) => getComputedStyle(q(id)).gridTemplateColumns.split(" ").filter(Boolean).length;
  const width = (id: string) => Math.round(q(id).getBoundingClientRect().width);
  let broken = 0;
  for (const p of Array.from(document.querySelectorAll("p"))) for (const n of Array.from(p.childNodes)) {
    if (n.nodeType !== 3) continue; const re = /\S{4,}/g; let m: RegExpExecArray | null;
    while ((m = re.exec(n.textContent || ""))) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); if (new Set(Array.from(r.getClientRects()).map((x) => Math.round(x.top))).size > 1) broken++; }
  }
  return { outer: tracks("outer"), inner: tracks("inner"), o2: width("o2"), i1: width("i1"), broken, containerType: getComputedStyle(q("ib")).containerType };
}, engine);

async function preset(page: Page, name: string) { await page.getByRole("button", { name }).first().click(); await page.waitForTimeout(600); }

/** The Preview with exactly `w` px of page — a scrollbar is paid for by widening the window, as scripts/uat does. */
async function previewAt(page: Page, w: number): Promise<Frame> {
  await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(450);
  const frame = async () => (await (await page.$('iframe[title="Site preview"]'))!.contentFrame())!;
  let f = await frame();
  const inner = await f.evaluate(() => document.documentElement.clientWidth);
  if (inner !== w) { await page.setViewportSize({ width: w + (w - inner), height: 900 }); await page.waitForTimeout(350); f = await frame(); }
  return f;
}

test.describe("a grid narrows by its own box (#111)", () => {
  test("canvas, Tablet preset: the outer grid keeps three across, the inner goes to one, and no word breaks", async ({ page }) => {
    await seed(page);
    await preset(page, "Tablet (768px)");
    const m = await measure(page, "canvas");
    expect(m.containerType, "the band around the inner grid is its query container").toBe("inline-size");
    expect(m.outer, "the page has room for three readable cells").toBe(12);
    expect(m.inner, "a 256px cell has room for one").toBe(1);
    expect(m.i1, "the quote takes the whole cell").toBeGreaterThan(m.o2 - 2);
    expect(m.broken, "no word broken across lines").toBe(0);
  });
  test("canvas, Desktop preset: the inner grid is two across (a 427px cell is under 3 × 12rem), still whole words", async ({ page }) => {
    await seed(page);
    await preset(page, "Desktop (1280px)");
    const m = await measure(page, "canvas");
    expect(m.outer).toBe(12);
    expect(m.inner).toBe(2);
    expect(m.broken).toBe(0);
  });
  test("Preview at 768 and 1280 agrees with the canvas; at 375 everything is one column", async ({ page }) => {
    await seed(page);
    await page.click('button:has-text("Preview")');
    await page.waitForSelector('iframe[title="Site preview"]', { timeout: 15000 }); await page.waitForTimeout(700);
    const at768 = await measure(await previewAt(page, 768), "preview");
    expect(at768.containerType).toBe("inline-size");
    expect(at768.outer).toBe(12); expect(at768.inner).toBe(1); expect(at768.broken).toBe(0);
    expect(at768.i1).toBeGreaterThan(at768.o2 - 2);
    const at1280 = await measure(await previewAt(page, 1280), "preview");
    expect(at1280.outer).toBe(12); expect(at1280.inner).toBe(2); expect(at1280.broken).toBe(0);
    const at375 = await measure(await previewAt(page, 375), "preview");
    expect(at375.outer, "the phone rung: one column, and the own-box rule never widens it").toBe(1);
    expect(at375.inner).toBe(1); expect(at375.broken).toBe(0);
  });
});
