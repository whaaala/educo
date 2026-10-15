// E6-1 probe (the user, 2026-10-15): adding a BACKGROUND COLOUR to a stack makes its space disappear. Built through the UI.
// node scripts/uat/probe-e6-1.js --headed
const H = require('./h.js'); const I = require('./inspector.js'); const path = require('path'); const fs = require('fs');
const OUT = path.join(__dirname, 'e6-out'); fs.mkdirSync(OUT, { recursive: true });
const measure = (page) => page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].map((e) => {
  const r = e.getBoundingClientRect(), c = getComputedStyle(e);
  let d = 0, x = e; while ((x = x.parentElement?.closest('[data-box-id]'))) d++;
  return { id: e.dataset.boxId.slice(-4), d, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), pad: c.padding, mar: c.margin, gap: c.gap, bg: c.backgroundColor };
}));
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1280, h: 900 });
  await H.panel(page, true); await H.clickTile(page, process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'Side by side'); await H.panel(page, false); await page.waitForTimeout(800);
  const before = await measure(page);
  console.log('BEFORE\n' + before.map((b) => JSON.stringify(b)).join('\n'));
  await page.screenshot({ path: path.join(OUT, 'e6-1-before.png') });
  const ids = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].map((e) => e.dataset.boxId));
  // the first stack: the deepest box that holds no other box would be a leaf; take the first box at depth 1 (a column of the band)
  const col = ids[ids.length - 1];
  console.log('background on', col.slice(-4), await I.background(page, col, '#1e3a8a'));
  await page.keyboard.press('Escape'); await page.mouse.click(5, 880); await page.waitForTimeout(500);
  const after = await measure(page);
  console.log('AFTER\n' + after.map((b) => JSON.stringify(b)).join('\n'));
  await page.screenshot({ path: path.join(OUT, 'e6-1-after.png') });
  console.log('errors', errs);
  await browser.close();
})();
