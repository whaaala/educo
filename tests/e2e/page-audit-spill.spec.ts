import { test, expect, type Page } from "@playwright/test";
import { type BoxNode, makeRowBand, createGrid } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { siteFromRoot, emptyPageRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
const { auditDoc } = require("../../scripts/uat/page-audit.js") as { auditDoc: (o: object) => { err: string[] } };

/**
 * THE PAGE AUDIT'S "CONTENT SPILLS OUT SIDEWAYS" (L4) — E0-a. A band with a gutter (S1-a) reaches half a gap past each
 * side of its parent ON PURPOSE, its columns half a gap in; L4 counted that reach as a spill (76 false errors on one
 * tier-99 page). The audit is the sweep's critic, so it is tested like code (docs/RISKS.md R5): quiet on the gutter,
 * still loud on a real spill.
 */
const spills = async (page: Page, blocks: BoxNode[], width: number, widen?: string) => {
  const root = emptyPageRoot(); root.children = blocks;
  const site = siteFromRoot(root);
  await page.setViewportSize({ width, height: 900 });
  await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }), { waitUntil: "domcontentloaded" });
  if (widen) await page.evaluate((id) => { const e = document.querySelector(`.bx-${id}`) as HTMLElement; const d = document.createElement("div"); d.style.width = "140%"; d.style.height = "10px"; d.textContent = "too wide"; e.appendChild(d); }, widen);
  return (await page.evaluate(`(${auditDoc.toString()})({})`) as { err: string[] }).err.filter((w) => w.startsWith("L4"));
};
const col = (bg: string) => blockForKind("container", { background: bg, children: [blockForKind("text", { text: "Words in a column." } as Partial<BoxNode>)] } as Partial<BoxNode>);

for (const width of [375, 768, 1280, 1920]) {
  test.describe(`at ${width}`, () => {
    test("a row of three coloured columns (a band with a gutter) inside a section: no spill", async ({ page }) => {
      const cols = [col("#fde68a"), col("#bbf7d0"), col("#fecaca")].map((c) => ({ ...c, width: "33.33%" }));
      // inside a section, as on page 145 ("ke-1 375px holds vp-4 386px") — the page root is not one of the blocks L4 walks
      const sectionOf = blockForKind("container", { padding: 0, children: [makeRowBand(cols)] } as Partial<BoxNode>); // no padding for the band to reach into, like ke-1
      expect(await spills(page, [sectionOf], width)).toEqual([]);
    });
    // E0-e — the ENGINE, not the audit: a band is a size container, so its reach read `cqw` from the section outside and its
    // columns from the band — 16px out, 11px back, a column 5px past a narrow section (4 tier-99 pages, 1024 → 1920).
    test("a row of columns inside a NARROW column: the columns stay inside it", async ({ page }) => {
      // ONE column filling the line, and it is a GRID, as on page 399: a band that holds a grid is a size container
      // (`hostsNarrowingGrid`) — the thing that splits the unit. (Two 50% columns stack at their floor and never fill it.)
      const cells = [col("#fde68a"), col("#bbf7d0")].map((c) => ({ ...c, colSpan: 6 })); // 6 + 6 of twelve, as on page 399
      const inner = makeRowBand([{ ...createGrid(12), width: "100%", children: cells }]);
      const narrow = blockForKind("container", { width: "30%", padding: 0, children: [inner] } as Partial<BoxNode>);
      const wide = { ...col("#eef2ff"), width: "70%" };
      expect(await spills(page, [makeRowBand([narrow, wide])], width)).toEqual([]);
    });
    test("a block that really is wider than its box: still a spill", async ({ page }) => {
      const box = col("#eef2ff");
      expect((await spills(page, [box], width, box.id)).join("\n")).toMatch(/^L4 \d+ blocks whose content spills out sideways/m);
    });
  });
}
