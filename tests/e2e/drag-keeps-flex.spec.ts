import { test, expect, type Page } from "@playwright/test";

/**
 * A DRAG LEAVES EVERY COLUMN DRAWN THE WAY A RELOAD DRAWS IT (L3-p, 2026-10-03) — built through the UI (RULE Y).
 *
 * Behaviour: tests/features/components/website/box-builder-layout.feature
 *   "After a resize, the canvas draws every column exactly as a reload does"
 *
 * A resize measures each box's content height with its children's grow switched off (`naturalHeightOf`), then puts
 * them back. It put back ONE longhand, `flex-grow`, read from a `flex` shorthand holding `var(--bx-gut)` — which reads
 * as "" — so it REMOVED it, breaking the shorthand: every column of a dragged row stayed at grow 0 on the live canvas
 * (`flex-shrink: ; flex-basis: ;` in its style) until a reload, a HOLE beside it, while the Preview filled the line.
 * Found on 4 dressed pages built through the UI (223, 333, 359, 382); every number in the stored tree was right.
 */

const clickTile = async (page: Page, text: string) => {
  await page.evaluate((t) => {
    const tile = Array.from(document.querySelectorAll<HTMLElement>('[draggable="true"]')).find((e) => (e.textContent || "").trim().startsWith(t));
    if (!tile) throw new Error(`no tile ${t}`);
    tile.click();
  }, text);
  await page.waitForTimeout(750);
};

/** The real HTML5 drop pipeline: dragstart on the tile, dragover + drop at a point on the canvas. */
const dropTileAt = async (page: Page, text: string, x: number, y: number) => {
  await page.evaluate(({ text, x, y }) => {
    const tile = Array.from(document.querySelectorAll<HTMLElement>('[draggable="true"]')).find((e) => (e.textContent || "").trim().startsWith(text))!;
    const dt = new DataTransfer();
    tile.dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true, dataTransfer: dt }));
    const el = document.elementFromPoint(x, y)!;
    const at = { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt };
    el.dispatchEvent(new DragEvent("dragover", at));
    el.dispatchEvent(new DragEvent("drop", at));
    tile.dispatchEvent(new DragEvent("dragend", { bubbles: true, dataTransfer: dt }));
  }, { text, x, y });
  await page.waitForTimeout(800);
};

const leaves = (page: Page) => page.evaluate(() => Array.from(document.querySelectorAll("[data-box-id]")).filter((e) => !e.querySelector("[data-box-id]")).map((e) => e.getAttribute("data-box-id")!));

/** Every block's computed flex + width, and every block whose inline style holds a broken (emptied) flex longhand. */
const drawn = (page: Page) => page.evaluate(() => {
  const flex: Record<string, string> = {}; const broken: string[] = [];
  for (const e of Array.from(document.querySelectorAll<HTMLElement>("[data-box-id]"))) {
    const id = e.getAttribute("data-box-id")!;
    flex[id] = `${getComputedStyle(e).flex} w${Math.round(e.getBoundingClientRect().width)}`;
    if (/flex-(grow|shrink|basis):\s*;/.test(e.getAttribute("style") || "")) broken.push(id);
  }
  return { flex, broken };
});

async function select(page: Page, id: string) {
  for (let i = 0; i < 6; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return;
    // Escape first, and aim at the lower middle: the selected block's toolbar floats over the top-left of the one below it
    await page.keyboard.press("Escape"); await page.waitForTimeout(150);
    const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
    await page.mouse.click(b.x + b.width * 0.7, b.y + b.height - Math.min(12, b.height / 3));
    await page.waitForTimeout(250);
  }
  throw new Error(`could not select ${id}`);
}

type Edge = "right" | "bottom" | "top";
async function drag(page: Page, edge: Edge, d: number) {
  const h = (await page.locator(`[aria-label="Resize ${edge} edge"]`).first().boundingBox())!;
  const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  await page.mouse.move(cx, cy); await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(cx + (edge === "right" ? (d * i) / 12 : 0), cy + (edge === "right" ? 0 : (d * i) / 12)); await page.waitForTimeout(12); }
  await page.mouse.up(); await page.waitForTimeout(600);
}

/** A row of three Stacks, each holding a Heading, under a Stack — the palette route a person takes. */
async function build(page: Page) {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem("kept")) { localStorage.clear(); sessionStorage.setItem("kept", "1"); } } catch { /* private mode */ } });
  await page.goto("/website/box-demo", { waitUntil: "load" });
  await page.waitForFunction(() => {
    const b = Array.from(document.querySelectorAll("button")).find((x) => x.getAttribute("aria-label") === "Open blocks panel");
    return !!b && Object.keys(b).some((k) => k.startsWith("__reactProps"));
  }, null, { timeout: 60_000 });
  await page.getByRole("button", { name: "Open blocks panel" }).click(); await page.waitForTimeout(600);
  await clickTile(page, "Stack");
  const cols = [(await leaves(page)).at(-1)!];
  for (let i = 1; i < 3; i++) {
    const b = (await page.locator(`[data-box-id="${cols[i - 1]}"]`).boundingBox())!;
    const before = new Set(await leaves(page));
    await dropTileAt(page, "Stack", Math.round(b.x + b.width - 8), Math.round(b.y + b.height / 2));
    cols.push((await leaves(page)).find((x) => !before.has(x))!);
  }
  for (const c of cols) { const b = (await page.locator(`[data-box-id="${c}"]`).boundingBox())!; await dropTileAt(page, "Heading", Math.round(b.x + b.width / 2), Math.round(b.y + b.height / 2)); }
  // …and a Stack UNDER the row: dragging ITS top edge measures the block above — the row — which is where the columns
  // lost their grow (the dresser always has something under a row; a row on its own never reached it)
  const row = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`)!.parentElement!.getBoundingClientRect().bottom, cols[0]);
  const before = new Set(await leaves(page));
  const r0 = (await page.locator(`[data-box-id="${cols[0]}"]`).boundingBox())!;
  await dropTileAt(page, "Stack", Math.round(r0.x + 40), Math.round(row + 6));
  const below = (await leaves(page)).find((x) => !before.has(x) && !cols.includes(x))!;
  await page.getByRole("button", { name: "Close blocks panel" }).click(); await page.waitForTimeout(500);
  return { cols, below };
}

test.describe("a drag leaves every column drawn as a reload draws it", () => {
  // [what is dragged, which edge, by how much] — the row's own column, and the block under the row (both directions)
  for (const [who, edge, d] of [["column", "right", 120], ["column", "right", -120], ["column", "bottom", 60], ["below", "top", -40], ["below", "top", 40], ["below", "bottom", 60]] as const) {
    test(`the ${who === "column" ? "first column" : "block under the row"} dragged by its ${edge} edge ${d > 0 ? "+" : ""}${d}px`, async ({ page }) => {
      const errs: string[] = []; page.on("pageerror", (e) => errs.push(e.message.split("\n")[0]));
      const { cols, below } = await build(page);
      expect(below, "the Stack dropped under the row").toBeTruthy();
      await select(page, who === "column" ? cols[0] : below);
      await drag(page, edge, d);
      await page.keyboard.press("Escape"); await page.waitForTimeout(300);
      const live = await drawn(page);
      await page.reload(); await page.waitForTimeout(2500);
      const re = await drawn(page);
      expect(live.broken, "a block left holding an emptied flex longhand").toEqual([]);
      const differ = Object.keys(live.flex).filter((id) => re.flex[id] && re.flex[id] !== live.flex[id]).map((id) => `${id.slice(-4)} live ${live.flex[id]} · reload ${re.flex[id]}`);
      expect(differ, "the live canvas draws a block differently from the same tree reloaded").toEqual([]);
      expect(errs).toEqual([]);
    });
  }
});
