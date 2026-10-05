// G3b-18 · PROBE (through the UI): words at 2 of 6 beside a picture on Mobile — why does the words' box run past its columns?
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1240, h: 820 });
  await H.panel(page, true);
  const a = await P.first(page, 'Stack'); const t = await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Image');
  await H.panel(page, false); await page.getByRole('button', { name: 'Mobile (375px)' }).first().click(); await page.waitForTimeout(700);
  await H.select(page, a); await I.tab(page, 'Design'); await I.section(page, 'Size');
  const f = page.getByLabel('To line', { exact: true }).first(); await f.fill('3'); await f.blur(); await page.waitForTimeout(700);
  const dump = await page.evaluate(([a, t, b]) => [a, t, b].map((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const c = getComputedStyle(e); const r = e.getBoundingClientRect();
    return { id: id.slice(-4), l: r.left.toFixed(1), r: r.right.toFixed(1), w: c.width, minW: c.minWidth, maxW: c.maxWidth, ml: c.marginLeft, mr: c.marginRight, gc: c.gridColumn, pl: c.paddingLeft, pr: c.paddingRight, box: c.boxSizing, sw: e.scrollWidth, cw: e.clientWidth }; }), [a, t, b]);
  console.log(JSON.stringify(dump, null, 1));
  const rowCss = await page.evaluate((a) => { const e = document.querySelector(`[data-box-id="${a}"]`).parentElement; const c = getComputedStyle(e); return { gtc: c.gridTemplateColumns.split(' ').length, w: e.getBoundingClientRect().width, cg: c.columnGap, d: c.display }; }, a);
  console.log(JSON.stringify(rowCss));
  const stored = await page.evaluate((a) => { const f = (n) => [n, ...(n.children || []).flatMap(f)]; const n = f(JSON.parse(localStorage.getItem('educo_box_site_v1')).pages[0].root).find((x) => x.id === a); return { width: n.width, responsive: n.responsive }; }, a);
  console.log(JSON.stringify(stored));
  await browser.close();
})();
