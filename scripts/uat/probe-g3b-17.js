// G3b-17 · PROBE (built through the UI): on Mobile, words + a picture side by side at 3 + 3 of 6 — does the picture's box run past
// the page's right frame on the canvas? And in the Preview at phone widths? Headed, six windows (one per case).
const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const OUT = path.join(__dirname, 'logs', 'uat-g3b');
const DEV = { Mobile: 'Mobile (375px)', Tablet: 'Tablet (768px)', Desktop: 'Desktop (1280px)' };
const chip = async (page, name) => { await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); };
const rectOf = (page, id) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width, t: r.top }; }, id);
const CASES = [['Image', 'Mobile', 4], ['Image', 'Tablet', 7], ['Image', 'Desktop', 7], ['Text', 'Mobile', 4], ['Card', 'Mobile', 4], ['Image', 'Mobile', 3]];
(async () => {
  await Promise.all(CASES.map(async ([tile, dev, to], i) => {
    const { browser, page } = await H.open({ headed: true, w: 1240, h: 820, pos: [(i % 3) * 640, Math.floor(i / 3) * 520] });
    try {
      await H.panel(page, true);
      const a = await P.first(page, 'Stack'); await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); const inner = await P.into(page, b, tile);
      await H.panel(page, false); await chip(page, DEV[dev]);
      await H.select(page, a); await I.tab(page, 'Design'); await I.section(page, 'Size');
      const f = page.getByLabel('To line', { exact: true }).first(); await f.fill(String(to)); await f.blur(); await page.waitForTimeout(700);
      const pageId = await page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1')).pages[0].root.id);
      const pg = await rectOf(page, pageId), rb = await rectOf(page, b), ri = await rectOf(page, inner), ra = await rectOf(page, a);
      const pad = await page.evaluate((id) => getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)).paddingRight, pageId);
      console.log(`[${tile} · ${dev} · To line ${to}] page ${pg.l.toFixed(1)}…${pg.r.toFixed(1)} · words ${ra.l.toFixed(1)}…${ra.r.toFixed(1)} · stack ${rb.l.toFixed(1)}…${rb.r.toFixed(1)} (top ${(rb.t - ra.t).toFixed(0)}) · ${tile} ${ri.l.toFixed(1)}…${ri.r.toFixed(1)} · past the page edge ${(ri.r - pg.r).toFixed(1)} / stack past ${(rb.r - pg.r).toFixed(1)} · page pad ${pad}`);
      await page.screenshot({ path: path.join(OUT, `probe17-${tile}-${dev}-${to}.png`) });
    } catch (e) { console.log(`[${tile} · ${dev}] ERROR ${e.message.split('\n')[0]}`); }
    await browser.close();
  }));
})();
