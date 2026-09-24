import { test, expect, type Page } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { normalizeSite, type BoxSite } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { BREAKPOINTS } from "@/lib/educo-ui/base";

/**
 * NO CELL OF A GRID IS EVER PAINTED ON TOP OF ANOTHER — at any width a visitor can have.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * Reported from the preview, while dragging the width narrower: "the top area has disappeared… the yellow
 * and the other two stacks just disappear after a certain breakpoint. The same for mobile, the same for
 * smaller screens."
 *
 * Nothing had been deleted and nothing errored. Three cells placed at columns 1 / 5 / 9 of a twelve-column
 * row had their spans re-fitted to the narrower rung — correctly — while their STARTS were merely rescaled
 * and then clamped into a track too small to hold them apart. A clamp is not an injection: two cells given
 * the same start are both honoured, one over the other. Measured in Chrome before the fix:
 *
 *    820px →  columns 1, 2, 2  — the second cell sits underneath the third
 *    580px →  columns 1, 1, 1  — only the LAST of the three can be seen
 *
 * WHY IT IS MEASURED IN A BROWSER AND NOT FROM THE CSS. The unit suite asserts what `gridPlacementAt`
 * returns, which is the fix; this asserts what a person SEES, which is the bug. They are different claims:
 * the CSS was valid and self-consistent the whole time it was hiding two blocks.
 *
 * The widths come from `BREAKPOINTS`, and each rung is probed just inside BOTH of its edges — the failure
 * appeared one pixel below a boundary and a width sampled comfortably in the middle of a rung would have
 * missed the tablet case entirely.
 */

const cell = (id: string, bg: string, extra: Record<string, unknown>) =>
  ({
    id, type: "container", direction: "column", background: bg, padding: 0, gap: 0, minHeight: 60,
    children: [{ id: `${id}t`, type: "heading", text: id, width: "100%", color: "#ffffff" }],
    ...extra,
  } as unknown as BoxNode);

const page1 = (kids: BoxNode[]) =>
  ({
    id: "root", type: "container", direction: "column", padding: 0, gap: 0,
    children: [
      { id: "band", type: "container", direction: "row", layout: "grid", columns: 12, width: "100%", padding: 0, gap: 0, children: kids },
      { id: "after", type: "container", direction: "column", width: "100%", minHeight: 400, background: "#d9a3f5", padding: 0, gap: 0,
        children: [{ id: "aftert", type: "text", text: "Welcome to the school. ".repeat(30), width: "100%" }] },
    ],
  } as unknown as BoxNode);

/** Every width worth probing: just inside each rung's lower edge, and just below the next one's. */
const PROBE_WIDTHS = (() => {
  const edges = Object.values(BREAKPOINTS).map(Number).sort((a, b) => a - b);
  const out = new Set<number>();
  for (let i = 0; i < edges.length; i++) {
    const lo = Math.max(320, edges[i]);
    const hi = i + 1 < edges.length ? edges[i + 1] - 1 : 1900;
    out.add(lo);
    out.add(hi);
    out.add(Math.round((lo + hi) / 2));
  }
  return [...out].sort((a, b) => a - b);
})();

/** Open the exported page and report, per width, any pair of cells whose rectangles intersect. */
async function overlapsByWidth(page: Page, root: BoxNode, ids: string[]) {
  const site = normalizeSite({ homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root }] } as unknown as BoxSite, 0);
  const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
  const path = `/__grid_overlap_${Math.random().toString(36).slice(2)}`;
  await page.route(`**${path}`, (r) => r.fulfill({ contentType: "text/html", body: html }));
  await page.goto(path);
  const bad: string[] = [];
  for (const w of PROBE_WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(120);
    bad.push(...(await page.evaluate((ids) => {
      const rects = ids.map((id) => {
        const el = document.querySelector<HTMLElement>(`.bx-${id}`);
        return { id, r: el ? el.getBoundingClientRect() : null };
      });
      const out: string[] = [];
      for (const { id, r } of rects) {
        // A block with no area at all is just as gone as one hidden underneath a sibling.
        if (!r) out.push(`${window.innerWidth}px: ${id} is MISSING`);
        else if (r.width < 1 || r.height < 1) out.push(`${window.innerWidth}px: ${id} collapsed to ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      for (let a = 0; a < rects.length; a++) {
        for (let b = a + 1; b < rects.length; b++) {
          const x = rects[a].r, y = rects[b].r;
          if (!x || !y) continue;
          const hit = x.left < y.right - 0.5 && y.left < x.right - 0.5 && x.top < y.bottom - 0.5 && y.top < x.bottom - 0.5;
          if (hit) out.push(`${window.innerWidth}px: ${rects[a].id} overlaps ${rects[b].id}`);
        }
      }
      return out;
    }, ids)));
  }
  return bad;
}

/**
 * Every way the "Grid cell" panel lets a person fill a twelve-column row, ENUMERATED rather than sampled —
 * so a layout added to the picker later is covered the day it appears.
 */
const SPREADS = [2, 3, 4, 6];
const COLOURS = ["#d4a017", "#d417c4", "#0f8c8c", "#1f6feb", "#8c0f52", "#0f8c3d"];

for (const n of SPREADS) {
  const ids = Array.from({ length: n }, (_, i) => `c${i}`);

  test(`${n} cells placed by hand (start + row) never cover each other, at any width`, async ({ page }) => {
    const kids = ids.map((id, i) => cell(id, COLOURS[i], { colSpan: 12 / n, colStart: (12 / n) * i + 1, rowStart: 1 }));
    expect(await overlapsByWidth(page, page1(kids), ids)).toEqual([]);
  });

  test(`${n} cells placed by the grid itself never cover each other, at any width`, async ({ page }) => {
    const kids = ids.map((id, i) => cell(id, COLOURS[i], { colSpan: 12 / n }));
    expect(await overlapsByWidth(page, page1(kids), ids)).toEqual([]);
  });
}

/**
 * …AND WHEN THE COLUMN COUNT IS SET FOR A DEVICE, which is the route the guide actively recommends.
 *
 * "If you want something different, pick the device at the top of the screen and set Columns there." Nobody
 * restates every cell's *Start at column* while doing that — so the starts stay written in the twelve-column
 * row's units and were taken at FACE VALUE in a three-track one:
 *
 *     span  = min(3, 4)             = 3   → every cell fills the row
 *     start = min(3 − 3 + 1, 1|5|9) = 1   → every cell begins in column 1
 *
 * All three in the same cell, drawn on top of one another, from 820px down. This case was deliberately
 * EXEMPTED from the first fix, on the reasoning that a count stated at a rung means the user is speaking in
 * that rung's units. True of the count; false of the cells.
 */
for (const n of SPREADS) {
  const ids = Array.from({ length: n }, (_, i) => `c${i}`);
  test(`${n} cells never cover each other when the column count is set per device`, async ({ page }) => {
    const kids = ids.map((id, i) => cell(id, COLOURS[i], { colSpan: 12 / n, colStart: (12 / n) * i + 1, rowStart: 1 }));
    const root = page1(kids);
    const band = (root.children as BoxNode[])[0] as BoxNode & { responsive?: unknown };
    band.responsive = { tabletLandscape: { columns: 6 }, tabletPortrait: { columns: 3 }, phone: { columns: 2 } };
    expect(await overlapsByWidth(page, root, ids)).toEqual([]);
  });
}

/**
 * THE USER'S OWN PATH, end to end: build the page, open the preview, and DRAG it narrower.
 *
 * The rendered-export tests above measure the same CSS, but they do not prove the preview reaches it — and
 * the preview is where this was seen. Dragging is the interaction, so dragging is what is driven.
 */
test("dragging the preview narrower never empties the top of the page", async ({ page }) => {
  const ids = ["c0", "c1", "c2"];
  const kids = ids.map((id, i) => cell(id, COLOURS[i], { colSpan: 4, colStart: 4 * i + 1, rowStart: 1 }));
  const site = { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: page1(kids) }] };
  await page.addInitScript((s) => {
    localStorage.setItem("educo_box_site_v1", JSON.stringify(s));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  }, site);
  await page.goto("/website/box-demo");
  await page.getByRole("button", { name: /^Preview$/ }).click();
  const frame = page.locator("iframe");
  await expect(frame).toBeVisible();
  await page.waitForTimeout(600);

  const grip = page.locator('[data-preview-grip="right"]');
  const box = await grip.boundingBox();
  expect(box, "the preview must offer a grip to drag — a width you cannot sweep is the other half of this bug").not.toBeNull();
  const cy = box!.y + box!.height / 2;
  await page.mouse.move(box!.x + box!.width / 2, cy);
  await page.mouse.down();
  let x = box!.x + box!.width / 2;
  const seen: string[] = [];
  for (const target of [1000, 820, 700, 580, 375]) {
    const cur = await page.evaluate(() => document.querySelector("iframe")!.getBoundingClientRect().width);
    x -= (cur - target) / 2; // the grips narrow the page from BOTH sides, so a drag of 1 removes 2
    await page.mouse.move(x, cy, { steps: 5 });
    await page.waitForTimeout(250);
    seen.push(...(await page.evaluate((ids) => {
      const d = document.querySelector("iframe")!.contentDocument!;
      const out: string[] = [];
      const rects = ids.map((id) => ({ id, r: d.querySelector(`.bx-${id}`)?.getBoundingClientRect() ?? null }));
      for (const { id, r } of rects) if (!r || r.width < 1 || r.height < 1) out.push(`${d.defaultView!.innerWidth}px: ${id} is not on the page`);
      for (let a = 0; a < rects.length; a++) {
        for (let b = a + 1; b < rects.length; b++) {
          const p = rects[a].r, q = rects[b].r;
          if (p && q && p.left < q.right - 0.5 && q.left < p.right - 0.5 && p.top < q.bottom - 0.5 && q.top < p.bottom - 0.5) {
            out.push(`${d.defaultView!.innerWidth}px: ${rects[a].id} is hidden under ${rects[b].id}`);
          }
        }
      }
      return out;
    }, ids)));
  }
  await page.mouse.up();
  expect(seen).toEqual([]);
});
