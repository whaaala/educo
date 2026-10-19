import { test, expect, type Page } from "@playwright/test";
const { auditDoc } = require("../../scripts/uat/page-audit.js") as { auditDoc: (o: object) => { err: string[] } };

/**
 * LE15b-10 · THE PAGE CHECK'S BROKEN WORDS (page-audit-words.feature). L8 read a hyphenated word as one word, so "inter-house"
 * wrapping at its hyphen — ordinary typesetting — was reported as broken. The audit is the sweep's critic, so it is tested
 * like code (docs/RISKS.md R5): what it must leave alone, and what it must still catch.
 */
const l8 = async (page: Page, words: string, style: string) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setContent(`<!doctype html><body style="margin:0;font:16px/1.5 Arial"><div class="bx-a" style="width:${style}"><p class="bx-p">${words}</p></div></body>`);
  return (await page.evaluate(`(${auditDoc.toString()})({})`) as { err: string[] }).err.filter((e) => e.startsWith("L8"));
};

test("a word that wraps at its own hyphen is not broken", async ({ page }) => {
  // the box fits "Training for inter-" but not "inter-house"
  expect(await l8(page, "Training for inter-house sports", "9.5em")).toEqual([]);
});

test("a word split in the middle is still reported, by name", async ({ page }) => {
  const found = await l8(page, "Greenfield", "3em;overflow-wrap:anywhere");
  expect(found.join(" ")).toMatch(/^L8 1 words broken across lines — "Greenfield"/);
});

// LE15b-11 (the user, 2026-10-19): the builder's Page check offers the fix, so the audit warns rather than fails the builder
test("a main title smaller than a heading under it is a warning; a heading smaller than its words is still an error", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setContent(`<!doctype html><body style="margin:0;font:16px/1.5 Arial"><div class="bx-a"><h1 class="bx-h" style="font-size:26px">Ready to join us?</h1><h2 class="bx-t" style="font-size:52px">Questions about fees?</h2><p class="bx-p">Words</p></div></body>`);
  const a = (await page.evaluate(`(${auditDoc.toString()})({})`)) as { err: string[]; warn?: string[] };
  expect(a.err.filter((e) => e.startsWith("H26")), "not an error").toEqual([]);
  expect((a.warn ?? []).some((w) => /^H26 an h1 \(26px\) is smaller than an h2 \(52px\)/.test(w)), "a warning").toBe(true);
  await page.setContent(`<!doctype html><body style="margin:0;font:16px/1.5 Arial"><div class="bx-a"><h2 class="bx-t" style="font-size:12px">Tiny heading</h2><p class="bx-p" style="font-size:18px">Words around it</p></div></body>`);
  const b = (await page.evaluate(`(${auditDoc.toString()})({})`)) as { err: string[] };
  expect(b.err.some((e) => /^H26 1 headings smaller than the body text/.test(e)), "still an error").toBe(true);
});

// LE15c-3 · a carousel's next slides wait to the right INSIDE their sideways strip (the pager): the page does not scroll (L1
// still guards that), so a picture there is not off the page — measured on every Slideshow and the Testimonials carousel
test("a picture in a carousel's next slide is not off the page; a picture past the page's edge still is", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  const l2 = async () => ((await page.evaluate(`(${auditDoc.toString()})({})`)) as { err: string[] }).err.filter((e) => e.startsWith("L2"));
  const img = `<img alt="" style="display:block;width:100%;height:100px" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">`;
  await page.setContent(`<!doctype html><body style="margin:0"><div class="bx-a"><div data-eu-pager style="display:grid;grid-auto-flow:column;grid-auto-columns:100%;overflow-x:auto"><div class="bx-s1">${img}</div><div class="bx-s2">${img}</div></div></div></body>`);
  expect(await l2(), "the second slide's picture").toEqual([]);
  await page.setContent(`<!doctype html><body style="margin:0;overflow-x:hidden"><div class="bx-a" style="position:relative;left:600px;width:400px">${img}</div></body>`);
  expect((await l2()).join(" ")).toMatch(/runs off the page/);
});
