// E6-7: does the Page grid panel cover the PAGE it changes? Measured at each window width, six headed windows at a time.
const H = require('./h.js'); const path = require('path');
const WIDTHS = process.argv.includes('--small') ? [[768, 1024], [375, 812]] : [[1897, 1000], [1536, 864], [1440, 900], [1366, 768], [1280, 800], [1024, 768], [768, 1024], [375, 812]];
const one = async ([w, h], i) => {
  const { browser, page } = await H.open({ headed: true, w, h, pos: [(i % 3) * 640, Math.floor(i / 3) * 360] });
  try {
    await H.panel(page, true); await H.clickTile(page, 'Stack'); await H.panel(page, false); await page.mouse.click(2, h - 4);
    const more = page.getByRole('button', { name: 'More', exact: true }); // a phone / tablet bar keeps Guides in the More sheet (E5c-2)
    if (await more.isVisible().catch(() => false)) { await more.click(); await page.getByRole('dialog', { name: 'More' }).waitFor(); await page.waitForTimeout(250); }
    await page.getByRole('button', { name: 'Layout guides' }).filter({ visible: true }).first().click(); await page.waitForTimeout(700);
    const sheet = page.getByRole('dialog', { name: 'More' }); const panelThere = await page.locator('[role=dialog][aria-label="Page grid"]').isVisible().catch(() => false);
    if (!panelThere && await sheet.isVisible().catch(() => false)) { await sheet.getByRole('button', { name: 'Close', exact: true }).click(); await page.waitForTimeout(400); }
    const m = await page.evaluate(() => {
      const p = document.querySelector('[role=dialog][aria-label="Page grid"]')?.getBoundingClientRect();
      const g = document.querySelector('[data-layout-guides]'); const sc = g?.closest('[data-canvas-scroller]')?.getBoundingClientRect(); const r = g?.getBoundingClientRect();
      if (!p || !r) return { missing: !p ? 'panel' : 'page' };
      const vis = { l: Math.max(r.left, sc?.left ?? r.left), r: Math.min(r.right, sc?.right ?? r.right), t: Math.max(r.top, sc?.top ?? r.top), b: Math.min(r.bottom, sc?.bottom ?? r.bottom) };
      const ox = Math.max(0, Math.min(p.right, vis.r) - Math.max(p.left, vis.l)), oy = Math.max(0, Math.min(p.bottom, vis.b) - Math.max(p.top, vis.t));
      // reachable: a panel inside the More sheet must be scrollable into view (the sheet scrolls)
      const d = document.querySelector('[role=dialog][aria-label="Page grid"]'); d.scrollIntoView({ block: 'end' }); const q = d.getBoundingClientRect();
      const reachable = q.top >= 0 && q.bottom <= innerHeight + 1;
      return { reachable, panel: [p.left, p.top, p.right, p.bottom].map(Math.round), page: [vis.l, vis.t, vis.r, vis.b].map(Math.round), coversPage: Math.round(ox * oy), onScreen: p.left >= 0 && p.right <= innerWidth && p.top >= 0 };
    });
    await page.screenshot({ path: path.join(__dirname, 'e6-out', `e6-7-${w}.png`) });
    return `${w}×${h}: ${JSON.stringify(m)}`;
  } finally { await browser.close(); }
};
(async () => {
  const out = []; let next = 0;
  await Promise.all(Array.from({ length: 6 }, async () => { while (next < WIDTHS.length) { const i = next++; out[i] = await one(WIDTHS[i], i).catch((e) => `${WIDTHS[i][0]}: ERROR ${e.message.split('\n')[0]}`); } }));
  console.log(out.join('\n'));
})();
