// Probe (the user's report 2026-10-15): two stacks side by side — where does the space around and between them come from?
const H = require('./h.js'); const path = require('path');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1600, h: 1000 });
  await H.panel(page, true); await H.clickTile(page, 'Side by side'); await H.panel(page, false); await page.waitForTimeout(800);
  const m = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('[data-box-id]')].map((e) => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
      return { id: e.dataset.boxId, depth: (function d(x) { let n = 0; while ((x = x.parentElement?.closest('[data-box-id]'))) n++; return n; })(e), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), pad: c.padding, gap: c.gap, margin: c.margin }; });
    return boxes;
  });
  console.log(JSON.stringify(m, null, 0).replace(/},{/g, '},\n{'));
  await page.screenshot({ path: path.join(__dirname, 'a1-out', 'probe-space.png') });
  await browser.close();
})();
