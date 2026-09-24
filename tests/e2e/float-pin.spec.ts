import { test, expect, type Page } from "@playwright/test";
import { seedSite } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";
import { normalizeSite, type BoxSite } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * A BLOCK PLACED FREELY CAN STILL HOLD ON SCREEN.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Asked directly — "if I float a stack and then make it fixed, it should work, right?" — and it should:
 * free placement and holding on screen are not in conflict, they are the same property doing the same job.
 * It was refused only because the flow resolver threw the pin away for anything floating.
 *
 * Two things are measured here, because both can fail on their own: that it HOLDS (the point of the
 * feature), and that it does not JUMP when switched (the point of measuring its place first — a percentage
 * of a tall section is not the same place as a percentage of the window; measured, 720px became 240px).
 */

const floated = (extra: Record<string, unknown>) => ({
  id: "free", type: "container", direction: "column", position: "absolute",
  left: 20, top: 30, width: "220px", minHeight: 90, background: "#8c0f52", padding: 0, gap: 0,
  // Real content, not an empty box: an empty one wears its "Add a block inside" button across the middle,
  // and a click meant for the block lands on that button instead — the builder doing its job, not a bug.
  children: [{ id: "label", type: "heading", text: "Open day", width: "100%", color: "#ffffff" }],
  ...extra,
} as unknown as BoxNode);
const host = (kids: BoxNode[]) => ({
  id: "host", type: "container", direction: "column", width: "100%", padding: 0, gap: 0,
  minHeight: 2400, background: "#4d8c0f", children: kids,
} as unknown as BoxNode);
const bare = (children: BoxNode[]) =>
  ({ id: "root", type: "container", direction: "column", padding: 0, gap: 0, children } as unknown as BoxNode);
const asSite = (root: BoxNode) => ({ homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root }] });

/** Open the exported page, read where the block is, scroll, read again. */
async function inExport(page: Page, node: BoxNode) {
  const site = normalizeSite(asSite(bare([host([node])])) as unknown as BoxSite, 0);
  const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
  const path = `/__float_pin_${Math.random().toString(36).slice(2)}`;
  await page.route(`**${path}`, (r) => r.fulfill({ contentType: "text/html", body: html }));
  await page.goto(path);
  await page.waitForTimeout(300);
  return page.evaluate(async () => {
    const el = document.querySelector<HTMLElement>(".bx-free")!;
    const at = () => { const b = el.getBoundingClientRect(); return { top: Math.round(b.top), left: Math.round(b.left) }; };
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 150));
    const rest = at();
    window.scrollTo(0, 900);
    await new Promise((r) => setTimeout(r, 250));
    const moved = at();
    return { rest, moved, position: getComputedStyle(el).position, travelled: rest.top - moved.top };
  });
}

/** Click the block until it is the selection, avoiding the builder's own chrome. */
async function select(page: Page, id: string) {
  for (let i = 0; i < 8; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return;
    /**
     * INTO VIEW FIRST, AND IN ITS OWN STEP. `elementFromPoint` answers about the viewport and nothing else,
     * so a block below the fold returns null for every candidate — which reads exactly like "something is
     * covering it". The scroll gets its own evaluate and a wait, because the page scrolls SMOOTHLY: a rect
     * read in the same tick is the position it is leaving, not the one it is going to.
     */
    await page.evaluate((id) => {
      document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)?.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });
    }, id);
    await page.waitForTimeout(350);
    const pt = await page.evaluate((id) => {
      const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      for (const [fx, fy] of [[0.8, 0.5], [0.2, 0.5], [0.5, 0.8]] as [number, number][]) {
        const x = b.x + b.width * fx, y = b.y + b.height * fy;
        const hit = document.elementFromPoint(x, y);
        if (!hit || hit.closest("button")) continue;
        // ANYWHERE INSIDE IT COUNTS. The builder bands every child, so a point over this block's own
        // heading reports that band's id — a descendant, not a stranger. Demanding an exact match rejected
        // every point on a block that has content in it, which is most of them.
        if (el.contains(hit)) return { x, y };
      }
      return null;
    }, id);
    if (!pt) throw new Error(`no clickable point on ${id}`);
    await page.mouse.click(pt.x, pt.y);
    await page.waitForTimeout(240);
  }
  throw new Error(`could not select ${id}`);
}

test.describe("a freely placed block that holds on screen", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("EXPORT · it stays put however far the page scrolls", async ({ page }) => {
    const r = await inExport(page, floated({ pin: "top", hold: "fixed", pinX: 400, pinY: 120 }));
    expect(r.position).toBe("fixed");
    expect(r.travelled, `it travelled ${r.travelled}px; floating alone loses the whole scroll`).toBeLessThan(6);
  });

  test("EXPORT · …at the place it was measured sitting, not at a percentage of the window", async ({ page }) => {
    const r = await inExport(page, floated({ pin: "top", hold: "fixed", pinX: 400, pinY: 120 }));
    // 400 × 120, deliberately NOT where the stored percentages would land it: 20% of a 1280px window is
    // 256 and 30% of an 800px one is 240, so values near those cannot tell the measured place from the
    // percentage — the first version of this test could not, and a mutation that ignored the measurement
    // walked straight through it.
    expect(r.rest.left, `left ${r.rest.left}`).toBeGreaterThan(390);
    expect(r.rest.left).toBeLessThan(410);
    expect(r.rest.top, `top ${r.rest.top}`).toBeGreaterThan(110);
    expect(r.rest.top).toBeLessThan(130);
  });

  test("EXPORT · a floated block NOBODY pinned still scrolls away — so the others prove something", async ({ page }) => {
    const r = await inExport(page, floated({}));
    expect(r.position).toBe("absolute");
    expect(r.travelled, "it travels the full distance with the page").toBeGreaterThan(850);
  });

  test("EXPORT · STICKY on a floated block is not applied — it would jump back into the flow", async ({ page }) => {
    const r = await inExport(page, floated({ pin: "top" }));
    expect(r.position, "free placement is kept").toBe("absolute");
  });

  test("BUILDER · picking “Floats on screen” does not move it — it holds where it was dragged", async ({ page }) => {
    await seedSite(page, asSite(bare([host([floated({})])])));
    await page.waitForSelector('[data-box-id="free"]', { state: "attached", timeout: 30000 });
    await page.waitForTimeout(700);
    await select(page, "free");

    const where = () => page.evaluate(() => {
      const b = document.querySelector('[data-box-id="free"]')!.getBoundingClientRect();
      return { top: Math.round(b.top), left: Math.round(b.left) };
    });
    const before = await where();
    await page.getByRole("button", { name: "Floats on screen option" }).click();
    await page.waitForTimeout(500);
    const after = await where();

    expect(Math.abs(after.left - before.left), `left moved ${after.left - before.left}px`).toBeLessThanOrEqual(4);
    expect(Math.abs(after.top - before.top), `top moved ${after.top - before.top}px`).toBeLessThanOrEqual(4);
  });

  test("BUILDER · it HOLDS ON SCREEN while the canvas scrolls — what a user checks first", async ({ page }) => {
    /**
     * Reported from a screenshot: set to float on screen, scrolled, and it left the screen — while the
     * published page held it. Every guard here measured the EXPORT for holding and the canvas only for not
     * jumping, so none of them was looking where the user was.
     *
     * The editor cannot use `position: fixed` at all: the page frame declares `container-type: inline-size`
     * for container queries, which captures every fixed descendant. So the canvas offsets the block by its
     * own scroll instead — and what is asserted is that it does not move, never which property did it.
     */
    await seedSite(page, asSite(bare([host([floated({ pin: "top", hold: "fixed", pinX: 60, pinY: 40 })])])));
    await page.waitForSelector('[data-box-id="free"]', { state: "attached", timeout: 30000 });
    await page.waitForTimeout(800);
    const r = await page.evaluate(async () => {
      const el = document.querySelector<HTMLElement>('[data-box-id="free"]')!;
      let sc: HTMLElement | null = el.parentElement;
      while (sc && !/auto|scroll/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
      const top = () => Math.round(el.getBoundingClientRect().top);
      /**
       * BOTH READINGS TAKEN WHILE SCROLLED, and deliberately. At rest the page's own top edge is on screen
       * and the block belongs exactly where it was placed; once that edge scrolls away the block catches
       * the top of the view, which costs the canvas's padding once. Measuring across that transition would
       * be measuring the catch, not the hold.
       */
      if (sc) sc.scrollTop = 200;
      await new Promise((res) => setTimeout(res, 300));
      const before = top();
      if (sc) sc.scrollTop = 700;
      await new Promise((res) => setTimeout(res, 350));
      return { travelled: before - top(), scrolled: Math.round(sc?.scrollTop ?? 0) };
    });
    expect(r.scrolled, "the canvas really scrolled").toBeGreaterThan(400);
    expect(r.travelled, `it travelled ${r.travelled}px in the editor; it used to lose the whole ${r.scrolled}px`).toBeLessThan(6);
  });

  test("BUILDER · a bar held FLUSH at the top stays flush — no gap opens above it", async ({ page }) => {
    /**
     * The second half of the same report: it stopped travelling, but a bar placed against the very top of
     * the page held with a band of empty page above it. The block is positioned inside the PAGE, and the
     * page sits a padding's width below the top of the scrolling area — so holding it by the scroll alone
     * kept it level with where the page's top USED to be. On the published page there is no such padding,
     * so the editor was still showing something the page would not do.
     *
     * Asserted as the distance to the top of the visible canvas, which is what "flush" means on screen.
     */
    await seedSite(page, asSite(bare([host([floated({ left: 0, top: 0, pin: "top", hold: "fixed", pinX: 0, pinY: 0 })])])));
    await page.waitForSelector('[data-box-id="free"]', { state: "attached", timeout: 30000 });
    await page.waitForTimeout(800);
    const r = await page.evaluate(async () => {
      const el = document.querySelector<HTMLElement>('[data-box-id="free"]')!;
      let sc: HTMLElement | null = el.parentElement;
      while (sc && !/auto|scroll/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
      const gap = () => Math.round(el.getBoundingClientRect().top - (sc ? sc.getBoundingClientRect().top : 0));
      const atRest = gap();
      if (sc) sc.scrollTop = 700;
      await new Promise((res) => setTimeout(res, 350));
      return { atRest, scrolled: gap(), scrollTop: Math.round(sc?.scrollTop ?? 0) };
    });
    expect(r.scrollTop).toBeGreaterThan(400);
    expect(r.scrolled, `after scrolling it sits ${r.scrolled}px below the top of the canvas — that gap is the page's own inset`).toBeLessThanOrEqual(4);
  });

  test("BUILDER · put back in the layout it keeps the pin, drops the free placement, and is still there", async ({ page }) => {
    /**
     * Reported: "when I float an item and I fix it, and then I don't want to float it any more, I can't do
     * anything." Putting it back left the block held AND carrying the coordinates it held at while floating,
     * with its size deleted — so it left the flow, collapsed, and there was nothing left to click.
     */
    await seedSite(page, asSite(bare([host([floated({})])])));
    await page.waitForSelector('[data-box-id="free"]', { state: "attached", timeout: 30000 });
    await page.waitForTimeout(800);
    await select(page, "free");
    await page.getByRole("button", { name: "Floats on screen option" }).click();
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: "In the layout", exact: true }).click();
    await page.waitForTimeout(500);

    const r = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('[data-box-id="free"]');
      const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "null");
      const find = (n: { id: string; children?: unknown[] }): Record<string, unknown> | null =>
        n.id === "free" ? n as Record<string, unknown> : ((n.children ?? []) as { id: string; children?: unknown[] }[]).map(find).find(Boolean) ?? null;
      const node = site ? find(site.pages[0].root) : null;
      const b = el?.getBoundingClientRect();
      return { h: Math.round(b?.height ?? 0), w: Math.round(b?.width ?? 0), hold: node?.hold, pinX: node?.pinX, pinY: node?.pinY, position: node?.position };
    });
    expect(r.position, "it really is back in the layout").toBeUndefined();
    expect(r.hold, "the pin is a decision about scrolling, and it survives").toBe("fixed");
    expect(r.pinX, "the place it held while floating is meaningless in the layout").toBeUndefined();
    expect(r.pinY).toBeUndefined();
    expect(r.h, "and it still has a size, so there is something to click").toBeGreaterThan(20);
    expect(await select(page, "free").then(() => true).catch(() => false), "…and it can be selected again").toBe(true);
  });

  test("BUILDER · a held block LOWER DOWN the page holds at the top of the view, not at its own band", async ({ page }) => {
    /**
     * The comfortable-position trap, again. A held bar in the FIRST band sits a few pixels from the page's
     * top, so measuring it proves nothing about the origin — and the first version of the canvas simulation
     * measured from the block's nearest positioned ancestor, which put a block further down the page at its
     * own band: 1,488px down, measured. So this one is deliberately the SECOND thing on the page.
     */
    const root = bare([
      { id: "lead", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 900, background: "#4d8c0f", children: [] } as unknown as BoxNode,
      { id: "bar", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 60, background: "#0d3b1e", pin: "top", hold: "fixed", children: [] } as unknown as BoxNode,
      { id: "tail", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 2000, background: "#8c0f52", children: [] } as unknown as BoxNode,
    ]);
    await seedSite(page, asSite(root));
    await page.waitForSelector('[data-box-id="bar"]', { state: "attached", timeout: 30000 });
    await page.waitForTimeout(800);
    const r = await page.evaluate(async () => {
      const el = document.querySelector<HTMLElement>('[data-box-id="bar"]')!;
      let sc: HTMLElement | null = el.parentElement;
      while (sc && !/auto|scroll/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
      if (sc) sc.scrollTop = 1200;
      await new Promise((res) => setTimeout(res, 400));
      const gap = Math.round(el.getBoundingClientRect().top - (sc ? sc.getBoundingClientRect().top : 0));
      return { gap, scrolled: Math.round(sc?.scrollTop ?? 0) };
    });
    expect(r.scrolled).toBeGreaterThan(900);
    expect(r.gap, `it sits ${r.gap}px below the top of the canvas — its band is 900px down the page`).toBeLessThanOrEqual(6);
  });

  test("BUILDER · a floated block is offered the one that can work, and told about the one that cannot", async ({ page }) => {
    await seedSite(page, asSite(bare([host([floated({})])])));
    await page.waitForSelector('[data-box-id="free"]', { state: "attached", timeout: 30000 });
    await page.waitForTimeout(700);
    await select(page, "free");

    await expect(page.getByRole("button", { name: "Floats on screen option" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sticks when reached option" }), "sticky cannot hold a block that has no place in the flow").toHaveCount(0);
    await expect(page.locator("[data-float-pin-note]")).toContainText("needs it back in the layout");
  });
});
