// G3b-17 · PROBE (through the UI): words 3 + picture 3 of 6 on one line on Mobile — does the picture stay inside the frame?
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const rectOf = (page, id) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top }; }, id);
(async () => {
  await Promise.all(['Image', 'Card', 'Text', 'Image'].map(async (tile, i) => {
    const { browser, page } = await H.open({ headed: true, w: 1240, h: 820, pos: [(i % 3) * 640, Math.floor(i / 3) * 520] });
    await H.panel(page, true);
    const a = await P.first(page, 'Stack'); await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, tile);
    await H.panel(page, false); await page.getByRole('button', { name: i === 3 ? 'Tablet (768px)' : 'Mobile (375px)' }).first().click(); await page.waitForTimeout(700);
    const set = async (id, name, v) => { await H.select(page, id); await I.tab(page, 'Design'); await I.section(page, 'Size'); const f = page.getByLabel(name, { exact: true }).first(); await f.fill(String(v)); await f.blur(); await page.waitForTimeout(700); };
    const half = i === 3 ? 7 : 4;
    await set(a, 'To line', half - 1); await set(b, 'From line', half);
    const pageId = await page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1')).pages[0].root.id);
    const pg = await rectOf(page, pageId), ra = await rectOf(page, a), rb = await rectOf(page, b);
    console.log(`[${tile} · ${i === 3 ? 'Tablet' : 'Mobile'}] words ${ra.l.toFixed(1)}…${ra.r.toFixed(1)} · ${tile} ${rb.l.toFixed(1)}…${rb.r.toFixed(1)} (top ${(rb.t - ra.t).toFixed(0)}) · page edge ${pg.r.toFixed(1)} · inside by ${(pg.r - rb.r).toFixed(1)} · between ${(rb.l - ra.r).toFixed(1)}`);
    await page.screenshot({ path: require('path').join(__dirname, 'logs', 'uat-g3b', `probe17b-${tile}-${i}.png`) });
    await browser.close();
  }));
})();
