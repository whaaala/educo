import { test, expect, type Page } from "@playwright/test";
import { type BoxNode, makeRowBand } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { siteFromRoot, emptyPageRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
const { auditDoc, chosenIds } = require("../../scripts/uat/page-audit.js") as {
  auditDoc: (o: object) => { warn: string[] }; chosenIds: (site: unknown) => string[];
};

/**
 * THE PAGE AUDIT'S UNUSED-SPACE CHECK — BATCH F-1 (1), W19. The audit is the sweep's critic, so it is tested like code
 * (docs/RISKS.md R5): it must report each way a page leaves space unused, and NOTHING once that space was chosen by the
 * person building (a width dragged by hand, a height, a margin) — `chosenIds` reads those from the stored site exactly as
 * the page runner does. Pages go through the shipping export.
 */
const auditOf = async (page: Page, blocks: BoxNode[], width: number, height = 900) => {
  const root = emptyPageRoot(); root.children = blocks;
  const site = siteFromRoot(root);
  await page.setViewportSize({ width, height });
  await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }), { waitUntil: "domcontentloaded" });
  const opts = JSON.stringify({ chosen: chosenIds(site) });
  return (await page.evaluate(`(${auditDoc.toString()})(${opts})`) as { warn: string[] }).warn.filter((w) => w.startsWith("W19")).join("\n");
};
const filler = () => Array.from({ length: 6 }, () => blockForKind("text", { text: "A paragraph long enough to make the page taller than its window. ".repeat(4) } as Partial<BoxNode>));
/** The shape a drop of a component onto the page makes through the UI: page → band → the component (S2-f). */
const accordionOnPage = (patch: Partial<BoxNode> = {}) => makeRowBand([blockForKind("accordion", patch)]);
/** Three columns nobody sized, too wide to share one line: the third waits on a second line with room beside it. */
const wrappedLine = (patch: Partial<BoxNode> = {}) => {
  const cols = [0, 1, 2].map((i) => blockForKind("container", { width: "40%", background: "var(--eu-color-primary-50)", children: [blockForKind("text", { text: `Column ${i + 1}` } as Partial<BoxNode>)], ...patch } as Partial<BoxNode>));
  const band = makeRowBand(cols); band.wrap = true; return band;
};

for (const width of [768, 1280, 1920]) {
  test.describe(`at ${width}`, () => {
    // Since F-1 the engine no longer MAKES this waste for a new page, so the positive cases are pages it still exists on:
    // an Accordion saved before F-1 (stored `width: "auto"`), and a wrapped line written as plain HTML.
    test("an Accordion saved hugging its words: a line packed to one side (W19a)", async ({ page }) => {
      expect(await auditOf(page, [accordionOnPage({ width: "auto" }), ...filler()], width)).toMatch(/^W19a \d+ lines packed to one side — .*\[eu-accordion\]/m);
    });
    test("an Accordion dropped on the page now fills its line: nothing to report (F-1 A)", async ({ page }) => {
      expect(await auditOf(page, [accordionOnPage(), ...filler()], width)).not.toMatch(/eu-accordion/);
    });
    test("the same Accordion with its width dragged by hand: nothing to report", async ({ page }) => {
      expect(await auditOf(page, [accordionOnPage({ widthByHand: true, width: "40%" }), ...filler()], width)).not.toMatch(/eu-accordion/);
    });
    test("a line that wrapped and left a block waiting with room beside it (W19a, wrapped)", async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const col = (n: number) => `<div class="bx-c${n}" style="flex:0 1 40%;background:#eef;padding:1rem"><p>Column ${n}</p></div>`;
      await page.setContent(`<body style="margin:0"><div class="bx-root"><div class="bx-band" style="display:flex;flex-direction:row;flex-wrap:wrap">${col(1)}${col(2)}${col(3)}</div></div></body>`);
      const warn = (await page.evaluate(`(${auditDoc.toString()})({})`) as { warn: string[] }).warn.join("\n");
      expect(warn).toMatch(/^W19a .*\(wrapped\)/m);
    });
    test("a CENTRED line of blocks of different heights is ONE line, not three wrapped ones (F1-h)", async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const item = (n: number, h: number) => `<div class="bx-i${n}" style="flex:0 0 auto;height:${h}px"><p style="margin:0">Item ${n}</p></div>`;
      await page.setContent(`<body style="margin:0"><div class="bx-root"><div class="bx-band" style="display:flex;flex-direction:row;flex-wrap:wrap;align-items:center">${item(1, 60)}${item(2, 24)}${item(3, 44)}</div></div></body>`);
      const warn = (await page.evaluate(`(${auditDoc.toString()})({})`) as { warn: string[] }).warn.join("\n");
      expect(warn).not.toMatch(/wrapped/);
    });
    test("the same line through the engine, nobody sized it: the columns take what their lines leave (F-1 B)", async ({ page }) => {
      expect(await auditOf(page, [wrappedLine(), ...filler()], width)).not.toMatch(/wrapped/);
    });
    test("the same line with its columns sized by hand: nothing to report", async ({ page }) => {
      expect(await auditOf(page, [wrappedLine({ widthByHand: true }), ...filler()], width)).not.toMatch(/wrapped/);
    });
  });
}

test("a short page: the window empty under its last block (W19d)", async ({ page }) => {
  expect(await auditOf(page, [blockForKind("heading")], 1280)).toMatch(/^W19d \d+px of the window empty under the last block/m);
});
test("a page taller than its window: no W19d", async ({ page }) => {
  expect(await auditOf(page, [blockForKind("heading"), ...filler(), ...filler()], 1280, 500)).not.toMatch(/W19d/);
});
