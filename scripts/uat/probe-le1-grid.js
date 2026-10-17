// LE-1 probe: a 4 × 1 Grid from the palette — what P.grid returns, the cells, and whether a cell can be selected.
const H = require('./h.js'); const P = require('./pages.js').helpers; const X = require('./uat-rx3-headed.js'); const { deselect, sleep } = X;
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 860 });
  await deselect(page); await H.panel(page, true); const g = await P.grid(page, 4, 1);
  const s = await page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1')));
  const walk = (n, d) => [`${'  '.repeat(d)}${n.id.slice(-4)} ${n.type}${n.layout ? ' ' + n.layout : ''}${n.rowBand ? ' band' : ''}`].concat((n.children || []).flatMap((c) => walk(c, d + 1)));
  console.log('returned', g.slice(-4)); console.log(walk(s.pages[0].root, 0).join('\n'));
  const r = await page.evaluate((id) => { const b = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return [b.left, b.top, b.width, b.height].map(Math.round); }, g);
  console.log('rect', r.join(','));
  await H.panel(page, false); await sleep(page, 500);
  try { await H.select(page, g); console.log('selected', (await H.selected(page))?.slice(-4)); } catch (e) { console.log('select failed:', e.message); }
  await page.screenshot({ path: 'scripts/uat/logs/le1/probe-grid.png' });
  await browser.close();
})();
