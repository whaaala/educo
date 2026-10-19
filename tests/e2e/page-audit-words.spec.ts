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
