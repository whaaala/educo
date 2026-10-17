// LE-1 probe: Side by side, then Text, Image, Button tiles — what each stores, and where each is drawn.
const H = require('./h.js'); const X = require('./uat-rx3-headed.js'); const { band, sleep } = X;
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 860 });
  const row = await band(page, 'Side by side');
  for (const t of ['Text', 'Image', 'Button']) {
    await H.panel(page, true); await H.clickTile(page, t); await sleep(page, 600);
    const s = await page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1')));
    let r = null; const w = (n) => { if (n.id === row) r = n; (n.children || []).forEach(w); }; w(s.pages[0].root);
    const drawn = await page.evaluate((ids) => ids.map((i) => { const b = document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect(); return `${Math.round(b.left)},${Math.round(b.top)} ${Math.round(b.width)}w`; }), r.children.map((c) => c.id));
    console.log(t, '→', r.children.map((c, i) => `${c.type} width=${JSON.stringify(c.width)} flex=${JSON.stringify(c.flex)} @${drawn[i]}`).join(' | '));
  }
  await page.screenshot({ path: 'scripts/uat/logs/le1/probe-sbs.png' });
  await browser.close();
})();
