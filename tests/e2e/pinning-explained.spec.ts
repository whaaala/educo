import { test, expect, type Page } from "@playwright/test";
import { seedSite } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";
import { normalizeSite, type BoxSite } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * WHAT THE INSPECTOR SAYS A PINNED BLOCK WILL DO — IS WHAT IT DOES. Measured by scrolling.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * The line under "Stays put while scrolling" said "leaves with its section" for every block. For the block
 * a user pins first — placed straight on the page — it held for the WHOLE page, because the builder gives
 * every block a band of its own and the pin is carried up to it. The words were written from a model of the
 * behaviour, not from the behaviour, and so were the first corrections to them: "a grid cell lets go at the
 * end of its row" came from the CSS Grid spec, and the browser held that cell for the whole grid.
 *
 * So each case here is asserted TWICE — the words the Inspector shows, and a scroll that proves them.
 *
 * EVERY PAGE IS SEEDED BARE. The builder bands the blocks itself on load (`normalizeSite`), and the export
 * runs the same pass, so no guard here can build a shape a user cannot. A hand-built band is how the hoist
 * bug (F5) passed its own guard.
 */

const blk = (id: string, h: number, extra: Record<string, unknown> = {}, children: BoxNode[] = []) => ({
  id, type: "container", direction: "column", width: "100%", padding: 0, gap: 0,
  minHeight: h, background: "#4d8c0f", children, ...extra,
} as unknown as BoxNode);
const bare = (children: BoxNode[]) =>
  ({ id: "root", type: "container", direction: "column", padding: 0, gap: 0, children } as unknown as BoxNode);
const asSite = (root: BoxNode) => ({ homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root }] });

/** A pinned header straight on the page, then a long page under it. */
const headerPage = () => bare([blk("nav", 64, { pin: "top", background: "#0d3b1e" }), blk("body1", 3000)]);
/** A pinned rail inside a Stack, then more page after the Stack. */
const stackPage = () => bare([
  blk("outer", 1200, { background: "#1b3a57" }, [blk("rail", 64, { pin: "top", background: "#8c0f52" }), blk("filler", 400)]),
  blk("after", 3000, { background: "#999999" }),
]);
/** A pinned cell in row 1 of a two-row grid. */
const gridPage = () => bare([
  { id: "grid", type: "container", layout: "grid", columns: 2, direction: "row", width: "100%", padding: 0, gap: 0, children: [
    blk("cell", 64, { pin: "top", background: "#0d3b1e" }), blk("r1b", 1000), blk("r2a", 1000, { background: "#333333" }), blk("r2b", 1000, { background: "#333333" }),
  ] } as unknown as BoxNode,
  blk("after", 1500, { background: "#999999" }),
]);
/** Two blocks SIDE BY SIDE on the page — one band, two children, the shape a side-by-side drop makes. */
const rowPage = () => bare([
  { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
    blk("rail", 64, { pin: "top", width: "30%", background: "#8c0f52" }), blk("main", 2400, { width: "70%" }),
  ] } as unknown as BoxNode,
  blk("after", 3000, { background: "#999999" }),
]);

async function openBuilder(page: Page, root: BoxNode, waitFor: string) {
  await seedSite(page, asSite(root));
  await page.waitForSelector(`[data-box-id="${waitFor}"]`, { state: "attached", timeout: 30000 });
  await page.waitForTimeout(700);
}

/**
 * Click until the block is the selection — the second click on a nested block goes inside.
 *
 * THE POINT IS CHOSEN IN THE PAGE, not guessed from the box. Two pieces of the builder's own chrome sit on
 * top of a block and swallow a click meant for it: an EMPTY block shows its "Add a block inside" button dead
 * centre, and a SELECTED block grows a toolbar (drag · add · lock · menu) over its top-left corner. Clicking
 * either is the user's own gesture doing its job — and it left the block unselected and the guard blaming
 * pinning. So candidate points are tested with `elementFromPoint` and the first one that really lands on this
 * block, clear of any button, is the one clicked.
 */
async function select(page: Page, id: string) {
  for (let i = 0; i < 8; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return;
    const pt = await page.evaluate((id) => {
      const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      const candidates: [number, number][] = [[0.8, 0.5], [0.2, 0.5], [0.65, 0.25], [0.5, 0.85], [0.5, 0.5]];
      for (const [fx, fy] of candidates) {
        const x = b.x + b.width * fx, y = b.y + b.height * fy;
        const hit = document.elementFromPoint(x, y);
        if (!hit || hit.closest("button")) continue;
        if (hit.closest("[data-box-id]")?.getAttribute("data-box-id") === id) return { x, y };
      }
      return null;
    }, id);
    if (!pt) throw new Error(`no clickable point on ${id} — every candidate hit chrome or another block`);
    await page.mouse.click(pt.x, pt.y);
    await page.waitForTimeout(240);
  }
  throw new Error(`could not select ${id}`);
}

const summary = (page: Page) => page.locator("[data-pin-summary]");

/** Export a (bare or saved) site through the builder's own band pass, then scroll it and read where `id` is. */
async function exportScroll(page: Page, site: BoxSite, id: string, ys: number[]) {
  const s = normalizeSite(site, 0);
  const html = renderSitePage(s, DEFAULT_THEME, s.homeId, { inlineShared: true });
  const path = `/__pin_explained_${Math.random().toString(36).slice(2)}`;
  await page.route(`**${path}`, (r) => r.fulfill({ contentType: "text/html", body: html }));
  await page.goto(path);
  await page.waitForTimeout(300);
  return page.evaluate(async ({ id, ys }) => {
    const out: { y: number; top: number; bottom: number }[] = [];
    for (const y of ys) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
      const b = document.querySelector(`.bx-${id}`)!.getBoundingClientRect();
      out.push({ y: Math.round(document.scrollingElement!.scrollTop), top: Math.round(b.top), bottom: Math.round(b.bottom) });
    }
    return out;
  }, { id, ys });
}
const held = (p: { top: number }) => p.top >= -2 && p.top <= 12;

/** Scroll the editor's own canvas and read where `id` sits against the top of the scroller. */
async function canvasScroll(page: Page, id: string, to: number | "end") {
  return page.evaluate(async ({ id, to }) => {
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)!;
    let scroller: HTMLElement | null = el.parentElement;
    while (scroller && !(scroller.scrollHeight > scroller.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(scroller).overflowY))) {
      scroller = scroller.parentElement;
    }
    if (!scroller) return { found: false, scrolled: 0, fromTop: NaN };
    scroller.scrollTop = to === "end" ? scroller.scrollHeight - scroller.clientHeight - 40 : to;
    await new Promise((r) => setTimeout(r, 300));
    return {
      found: true,
      scrolled: Math.round(scroller.scrollTop),
      fromTop: Math.round(el.getBoundingClientRect().top - scroller.getBoundingClientRect().top),
    };
  }, { id, to });
}

test.describe("the words under “Stays put while scrolling” are what the block does", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("straight on the page · says “for the rest of the page”, and holds to the very end — canvas AND export", async ({ page }) => {
    await openBuilder(page, headerPage(), "nav");
    await select(page, "nav");
    await expect(summary(page)).toContainText("for the rest of the page");
    await expect(summary(page), "the old promise it broke").not.toContainText("section");

    const c = await canvasScroll(page, "nav", "end");
    expect(c.found && c.scrolled, "the canvas really scrolled a long way").toBeGreaterThan(2000);
    expect(c.fromTop, `on the canvas it sits ${c.fromTop}px from the top after ${c.scrolled}px`).toBeLessThan(12);

    const e = await exportScroll(page, asSite(headerPage()) as unknown as BoxSite, "nav", [1500, 2400]);
    for (const p of e) expect(held(p), `export: held at ${p.y}px of scroll (top ${p.top})`).toBe(true);
  });

  test("inside a Stack · NAMES the Stack, holds while it shows, and leaves with it", async ({ page }) => {
    await openBuilder(page, stackPage(), "rail");
    await select(page, "rail");
    await expect(summary(page)).toContainText("until the Stack around it scrolls away");

    const [mid, past] = await exportScroll(page, asSite(stackPage()) as unknown as BoxSite, "rail", [600, 1700]);
    expect(held(mid), `held while the Stack shows (top ${mid.top} at ${mid.y})`).toBe(true);
    expect(past.bottom, `gone once the Stack has gone (bottom ${past.bottom} at ${past.y})`).toBeLessThan(0);
  });

  test("a grid cell · NAMES the Grid, and holds through EVERY row until the grid ends — not just its own row", async ({ page }) => {
    await openBuilder(page, gridPage(), "cell");
    await select(page, "cell");
    await expect(summary(page)).toContainText("until the Grid around it scrolls away");

    // Row 1 ends at 1000px. The spec reading said the cell would let go there; the browser holds it.
    const [row2, past] = await exportScroll(page, asSite(gridPage()) as unknown as BoxSite, "cell", [1500, 2400]);
    expect(held(row2), `still held 500px into row 2 (top ${row2.top})`).toBe(true);
    expect(past.bottom, `gone once the whole grid has gone (bottom ${past.bottom})`).toBeLessThan(0);
  });

  test("beside a neighbour · lets go with that row of blocks", async ({ page }) => {
    await openBuilder(page, rowPage(), "rail");
    await select(page, "rail");
    await expect(summary(page)).toContainText("until the row of blocks it sits in scrolls away");

    const [mid, past] = await exportScroll(page, asSite(rowPage()) as unknown as BoxSite, "rail", [1000, 2800]);
    expect(held(mid), `held beside its taller neighbour (top ${mid.top})`).toBe(true);
    expect(past.bottom, `gone once the row has gone (bottom ${past.bottom})`).toBeLessThan(0);
  });
});

test.describe("every block can be pinned, and the choice is shown as pictures", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("a HEADING can be pinned from the Inspector — it could not, the control lived under Arrange", async ({ page }) => {
    const root = bare([{ id: "title", type: "heading", text: "School news", width: "100%" } as unknown as BoxNode, blk("body1", 3000)]);
    await openBuilder(page, root, "title");
    await select(page, "title");
    await page.getByRole("button", { name: "Sticks when reached option" }).click();
    await page.waitForTimeout(300);
    await expect(summary(page)).toContainText("for the rest of the page");

    const c = await canvasScroll(page, "title", 1200);
    expect(c.scrolled).toBeGreaterThan(1000);
    expect(c.fromTop, `the heading held on the canvas (${c.fromTop}px from the top)`).toBeLessThan(12);

    // It survives a reload — a choice that only lives until the tab closes is not a choice.
    await page.reload();
    await page.waitForSelector('[data-box-id="title"]', { state: "attached", timeout: 30000 });
    await page.waitForTimeout(700);
    const stored = await page.evaluate(() => JSON.stringify(localStorage.getItem("educo_box_site_v1")));
    expect(stored).toContain('\\"pin\\":\\"top\\"');
  });

  test("the three pictures are visibly DIFFERENT in a real browser (RULE T)", async ({ page }) => {
    await openBuilder(page, headerPage(), "nav");
    await select(page, "nav");
    const shots: Buffer[] = [];
    for (const name of ["Scrolls away", "Sticks when reached", "Floats on screen"]) {
      const tile = page.getByRole("button", { name: `${name} option` });
      await expect(tile.locator("[data-pin-preview]")).toBeVisible();
      shots.push(await tile.locator("[data-pin-preview]").screenshot());
    }
    for (let i = 0; i < shots.length; i++) for (let j = i + 1; j < shots.length; j++) {
      expect(shots[i].equals(shots[j]), `picture ${i} and picture ${j} render identically`).toBe(false);
    }
  });

  test("“Floats on screen” says what it covers, and “Keep its space instead” actually uncovers it", async ({ page }) => {
    /**
     * Measured before the warning existed: a 64px bar held to the top hid 56px of the block under it the
     * moment the page opened. The space is not added behind the user's back — spacing is a decision here —
     * so the Inspector says so and offers the mechanism that keeps its place instead.
     */
    const root = bare([blk("bar", 64, { pin: "top", hold: "fixed", background: "#0d3b1e" }), blk("hero", 600, { background: "#8c0f52" })]);
    await openBuilder(page, root, "hero");
    await select(page, "hero");           // the bar has no space of its own to click — select it from the tree below
    await select(page, "bar");
    await expect(page.getByText(/covers the top of your page when it opens/)).toBeVisible();

    const gap = () => page.evaluate(() => {
      const bar = document.querySelector('[data-box-id="bar"]')!.getBoundingClientRect();
      const hero = document.querySelector('[data-box-id="hero"]')!.getBoundingClientRect();
      return Math.round(hero.top - bar.bottom);
    });
    expect(await gap(), "the hero starts underneath the bar").toBeLessThan(-20);

    await page.getByRole("button", { name: "Keep its space instead" }).click();
    await page.waitForTimeout(400);
    await expect(summary(page)).toContainText("It keeps its own place in the layout");
    expect(await gap(), "now the hero starts below it").toBeGreaterThanOrEqual(-2);
  });

  test("a bar that floats on screen is actually VISIBLE — full width on the canvas and on the page", async ({ page }) => {
    /**
     * It was 0px wide in both, and shipped that way. Out of flow, a block takes no size from its row or its
     * grid — and every guard that existed measured where the bar sat, never how wide it was, so an invisible
     * block passed them all. Width is the assertion here, on both engines, because that is what was missing.
     */
    const root = bare([blk("bar", 64, { pin: "top", hold: "fixed", background: "#0d3b1e" }), blk("hero", 600, { background: "#8c0f52" })]);
    await openBuilder(page, root, "bar");
    const canvas = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('[data-box-id="bar"]')!;
      const page_ = document.querySelector<HTMLElement>('[data-box-id="root"]')!;
      return { w: Math.round(el.getBoundingClientRect().width), pageW: Math.round(page_.getBoundingClientRect().width) };
    });
    expect(canvas.w, `on the canvas the bar is ${canvas.w}px wide inside a ${canvas.pageW}px page`).toBeGreaterThan(canvas.pageW * 0.9);

    const s = normalizeSite(asSite(root) as unknown as BoxSite, 0);
    const html = renderSitePage(s, DEFAULT_THEME, s.homeId, { inlineShared: true });
    await page.route("**/__fixed_width", (r) => r.fulfill({ contentType: "text/html", body: html }));
    await page.goto("/__fixed_width");
    await page.waitForTimeout(300);
    const exported = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>(".bx-bar")!;
      return { w: Math.round(el.getBoundingClientRect().width), viewport: window.innerWidth };
    });
    expect(exported.w, `published, the bar is ${exported.w}px wide in a ${exported.viewport}px window`).toBeGreaterThan(exported.viewport * 0.9);
  });

  /**
   * A FLOATING BLOCK used to be offered nothing here, and this spec asserted that. It is no longer true:
   * a floated block CAN hold on screen — measured, emitted as `fixed` it travelled 0px over a 900px scroll —
   * and it is now offered exactly that, while being told plainly that sticky needs it back in the layout.
   * The case lives in `float-pin.spec.ts`, which measures both halves rather than only the refusal.
   */
});

test.describe("pinning per device", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("turned OFF on phones in the builder · survives a reload, scrolls away on a phone, still holds on a desktop", async ({ page }) => {
    await openBuilder(page, headerPage(), "nav");
    await page.getByRole("button", { name: "Mobile (375px)" }).click();
    await page.waitForTimeout(500);
    await select(page, "nav");
    await page.getByRole("button", { name: "Scrolls away option" }).click();
    await page.waitForTimeout(400);

    await page.reload();
    await page.waitForSelector('[data-box-id="nav"]', { state: "attached", timeout: 30000 });
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("educo_box_site_v1")!)) as BoxSite;
    const find = (n: BoxNode): BoxNode | null => n.id === "nav" ? n : (n.children ?? []).map(find).find(Boolean) ?? null;
    const nav = find(saved.pages[0].root)!;
    // `{ pin: undefined }` became `{}` on save, so the desktop pin came back onto the phone. Stored as null.
    expect(nav.responsive?.phone, "the phone's choice is still there after the reload").toHaveProperty("pin", null);

    await page.setViewportSize({ width: 375, height: 800 });
    const [phone] = await exportScroll(page, saved, "nav", [900]);
    expect(phone.bottom, `on a phone it scrolled away (bottom ${phone.bottom})`).toBeLessThan(0);

    await page.setViewportSize({ width: 1280, height: 800 });
    const [desk] = await exportScroll(page, saved, "nav", [900]);
    expect(held(desk), `on a desktop it still holds (top ${desk.top})`).toBe(true);
  });

  test("set ONLY on phones · holds on a phone — the band carries it at that rung — and not on a desktop", async ({ page }) => {
    const root = bare([blk("nav", 64, { background: "#0d3b1e", responsive: { phone: { pin: "top" } } }), blk("body1", 3000)]);
    await page.setViewportSize({ width: 375, height: 800 });
    const [phone] = await exportScroll(page, asSite(root) as unknown as BoxSite, "nav", [900]);
    expect(held(phone), `held on a phone (top ${phone.top}); it sat inert in its hugging band before`).toBe(true);

    await page.setViewportSize({ width: 1280, height: 800 });
    const [desk] = await exportScroll(page, asSite(root) as unknown as BoxSite, "nav", [900]);
    expect(desk.bottom, "the desktop was never pinned").toBeLessThan(0);
  });
});
