// #66 — at Desktop 1280 shrunk to fit a real screen, the first +80 on a four-stack row left a 265px hole. Why?
const H = require('./h.js');
const { first, row } = require('./pages.js').helpers;
const state = (page, ids) => page.evaluate((ids) => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const find = (n, id) => n.id === id ? n : (n.children || []).reduce((a, c) => a || find(c, id), null);
  return ids.map((id) => { const n = find(s.pages[0].root, id); const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect();
    return `${Math.round(r.width)}@${Math.round(r.top)} [${n.width}${n.restWidth ? ` r${n.restWidth}` : ''}${n.wrapBy ? ' wrapBy' : ''}${n.endOwed ? ` owed${n.endOwed}` : ''}]`; }).join('  ');
}, ids);
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1350, h: 640 });
  await H.panel(page, true);
  const a = await first(page, 'Stack'); const ids = await row(page, a, ['Stack', 'Stack', 'Stack']);
  await H.panel(page, false); await H.fillStacks(page); await H.panel(page, false);

  console.log('start  ', await state(page, ids));
  for (let i = 0; i < 6; i++) { await H.select(page, ids[2]); await H.dragEdge(page, 'right', 80); console.log('+80    ', await state(page, ids)); }
  await page.screenshot({ path: `${__dirname}/p66.png` });
  for (let i = 0; i < 8; i++) { await H.select(page, ids[2]); await H.dragEdge(page, 'right', -80); console.log('-80    ', await state(page, ids)); }
  console.log('errors', errs);
  await browser.close();
})();
