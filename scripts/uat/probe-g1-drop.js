// PROBE G-1 #10 — a drop in a page-grid row's own side space, just past its last column: where does the block land?
//   NODE_PATH=node_modules node scripts/uat/probe-g1-drop.js
const H = require('./h.js'); const P = require('./pages.js').helpers;
const tree = (page) => page.evaluate((k) => {
  const s = JSON.parse(localStorage.getItem(k)); const NL = String.fromCharCode(10);
  const w = (n, d) => '  '.repeat(d) + n.type + (n.rowBand ? '[band]' : '') + ' ' + n.id.slice(-4) + ' ' + (n.width || '') + NL + (n.children || []).map((c) => w(c, d + 1)).join('');
  return w(s.pages[0].root, 0);
}, 'educo_box_site_v1');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1400, h: 900 });
  try {
    await H.panel(page, true);
    const a = await P.first(page, 'Stack'); await P.into(page, a, 'Text');
    const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Text');
    await H.panel(page, false);
    console.log('BEFORE'); console.log(await tree(page));
    const r = await page.evaluate((b) => { const q = document.querySelector(`[data-box-id="${b}"]`).getBoundingClientRect(); return { r: q.right, y: q.top + q.height / 2 }; }, b);
    await H.panel(page, true); await H.dropTile(page, 'Stack', Math.round(r.r + 4), Math.round(r.y)); await H.panel(page, false); await page.waitForTimeout(800);
    console.log('AFTER a drop 4px past the last column'); console.log(await tree(page));
  } finally { await browser.close(); }
})();
