import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";
import { seedSite } from "./helpers/seed-site";

/**
 * A LINE THE DRAG HANDS BACK STORES 100%, NEVER A HAIR OVER (c-11b, 2026-10-03).
 *
 * Behaviour: tests/features/components/website/box-builder-layout.feature
 *   "Bringing a wrapped column back never stores the line over 100%"
 *
 * FOUND THROUGH THE UI (RULE Y): the dresser built page 359 (tier 99) and, sizing a row of words + three icon cells, widened
 * the first two until the fourth wrapped, then narrowed the third so the fourth came back (`logs/c11b-debug.out`, DEBUG=1).
 * The line came back at 100.15% — one line on the desktop; on a tablet the last icon dropped to a line of its own beside
 * a hole. The drag measured its room from where the third column is DRAWN while the first two kept their STORED shares,
 * and a line stored a hair over 100% is drawn as ONE line (the one-pixel slack of #131) while the stored-share packing
 * called it wrapped — so nothing capped it.
 *
 * PINNED here, as RULE Y allows only after the UI repro: that page's own saved site (its row inside a 712px main column),
 * the row put back to the widths it had before the third drag (42.71 · 41.62 · 15.68 · 25.02, from the log), then the third
 * column's right edge dragged through the UI as the dresser did. Old build: 100.15 / 100.15 / 100.16. Fixed: 99.99.
 */

const SITE = JSON.parse(readFileSync(join(__dirname, "fixtures", "c11b-page359.site.json"), "utf8"));
const BEFORE = ["42.71%", "41.62%", "15.68%", "25.02%"];

type Node = { id: string; width?: string; rowBand?: boolean; widthByHand?: boolean; children?: Node[]; [k: string]: unknown };
function pinned() {
  const site = structuredClone(SITE) as { pages: { root: Node }[] };
  let row: Node | null = null;
  const find = (n: Node) => { if (row) return; if (n.rowBand && n.children?.length === 4 && /^42\.7/.test(n.children[0].width ?? "") && /^41\.6/.test(n.children[1].width ?? "")) { row = n; return; } n.children?.forEach(find); };
  site.pages.forEach((p) => find(p.root));
  if (!row) throw new Error("the fixture's 4-column row is missing");
  const r = row as Node;
  r.children!.forEach((c, i) => { c.width = BEFORE[i]; c.widthByHand = true; delete c.restWidth; delete c.restAt; delete c.restBy; });
  return { site, ids: r.children!.map((c) => c.id) };
}

/** Each click goes one box deeper, and this column is seven boxes down — so a person keeps clicking (as `h.js` select). */
async function select(page: Page, id: string) {
  for (let i = 0; i < 16; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return;
    await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`)?.scrollIntoView({ block: "center" }), id);
    await page.waitForTimeout(120);
    const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
    await page.mouse.click(b.x + b.width * 0.75, b.y + b.height * 0.75);
    await page.waitForTimeout(250);
  }
  throw new Error(`could not select ${id}`);
}

async function dragRight(page: Page, dx: number) {
  const h = (await page.locator('[aria-label="Resize right edge"]').first().boundingBox())!;
  const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  await page.mouse.move(cx, cy); await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(cx + (dx * i) / 12, cy); await page.waitForTimeout(12); }
  await page.mouse.up(); await page.waitForTimeout(600);
}

const rowState = (page: Page, ids: string[]) => page.evaluate((ids) => {
  const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}"); const w: Record<string, string> = {};
  const walk = (n: unknown) => { if (!n || typeof n !== "object") return; const o = n as Record<string, unknown>; if (typeof o.id === "string" && ids.includes(o.id)) w[o.id] = String(o.width); for (const v of Object.values(o)) { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") walk(v); } };
  walk(site);
  const tops = ids.map((id) => Math.round(document.querySelector(`[data-box-id="${id}"]`)!.getBoundingClientRect().top));
  return { widths: ids.map((id) => w[id]), oneLine: tops.every((t) => Math.abs(t - tops[0]) <= 2) };
}, ids);

test.describe("a line the drag hands back stores 100%, never more", () => {
  // -51 is the dresser's own drag; the others either side of it, each bringing the fourth column back
  for (const dx of [-40, -51, -60, -90]) {
    test(`the third column narrowed ${dx}px brings the fourth back at 100% or less`, async ({ page }) => {
      const errs: string[] = []; page.on("pageerror", (e) => errs.push(e.message.split("\n")[0]));
      await page.setViewportSize({ width: 1520, height: 900 });
      const { site, ids } = pinned();
      await seedSite(page, site);
      await page.waitForSelector("[data-box-id]", { timeout: 15000 });
      await page.getByRole("button", { name: /^Desktop/ }).first().click(); await page.waitForTimeout(800);
      const before = await rowState(page, ids);
      expect(before.oneLine, "the precondition: the fourth column starts below").toBe(false);
      await page.locator(`[data-box-id="${ids[2]}"]`).scrollIntoViewIfNeeded();
      await select(page, ids[2]);
      await dragRight(page, dx);
      const after = await rowState(page, ids);
      const sum = after.widths.reduce((t, w) => t + (parseFloat(w) || 0), 0);
      expect(after.oneLine, `the fourth column came back (${after.widths.join(" + ")})`).toBe(true);
      expect(sum, `stored ${after.widths.join(" + ")}`).toBeLessThanOrEqual(100.001);
      expect(errs).toEqual([]);
    });
  }
});
