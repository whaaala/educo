// LE-1 probe: a 4 × 1 Grid with Headings, at Mobile pick Quarters — what is stored, and what the canvas draws.
const H = require('./h.js'); const P = require('./pages.js').helpers; const X = require('./uat-rx3-headed.js'); const { deselect, sleep, at, ins } = X;
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 860 });
  await deselect(page); await H.panel(page, true); const g = await P.grid(page, 4, 1);
  const kids = async () => { const s = await page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1'))); let n; const w = (x) => { if (x.id === g) n = x; (x.children || []).forEach(w); }; if (s.pages[0].root) w(s.pages[0].root); return n; };
  for (const k of (await kids()).children) { await H.panel(page, false); await H.select(page, k.id); await H.panel(page, true); await H.clickTile(page, 'Heading'); }
  await page.getByRole('button', { name: /^Mobile/ }).first().click(); await sleep(page, 900);
  await at(page, g, 'Layout');
  console.log('inspector editing:', (await ins(page).locator('text=Editing:').first().evaluate((e) => e.parentElement.textContent)).slice(0, 60), 'selected', (await H.selected(page))?.slice(-4), 'grid', g.slice(-4));
  await ins(page).getByRole('group', { name: 'Columns' }).getByRole('button', { name: 'Thirds' }).first().click(); await sleep(page, 800);
  const n = await kids(); console.log('stored columns', n.columns, 'responsive', JSON.stringify(n.responsive));
  const w = await page.evaluate((ids) => ids.map((i) => Math.round(document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect().width)), n.children.map((c) => c.id));
  console.log('cell widths at Mobile', w.join(','));
  await page.screenshot({ path: 'scripts/uat/logs/le1/probe-cols.png' }); await browser.close();
})();
