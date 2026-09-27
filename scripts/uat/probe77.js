// A three-column row: +60 then -60 on the FIRST edge changed the THIRD column. Stored values at each step.
const H = require('./h.js');
const { first, row } = require('./pages.js').helpers;
const state = (page, ids) => page.evaluate((ids) => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const find = (n, id) => n.id === id ? n : (n.children || []).reduce((a, c) => a || find(c, id), null);
  return ids.map((id) => { const n = find(s.pages[0].root, id); const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect();
    return `${Math.round(r.width)}@${Math.round(r.top)} [${n.width}${n.widthByHand ? ' hand' : ''}${n.restWidth ? ` r${n.restWidth}` : ''}${n.endOwed ? ` owed${n.endOwed}` : ''}]`; }).join('  ');
}, ids);
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720 });
  await H.panel(page, true);
  const a = await first(page, 'Stack'); const ids = await row(page, a, ['Stack', 'Stack']);
  await H.panel(page, false); await H.fillStacks(page); await H.panel(page, false);
  console.log('start      ', await state(page, ids));
  // size to 30/30/40 by dragging, as the structure test does
  for (const [i, t] of [[0, 0.3], [1, 0.6]]) { const r = await H.rowOf(page, ids[0]); const k = r.kids.find((q) => q.id === ids[i]); await H.select(page, ids[i]); await H.dragEdge(page, 'right', Math.round(t * r.inner - (k.l + k.w))); }
  console.log('30/30/40   ', await state(page, ids));
  await H.select(page, ids[0]); await H.dragEdge(page, 'right', 60); console.log('edge1 +60  ', await state(page, ids));
  await H.select(page, ids[0]); await H.dragEdge(page, 'right', -60); console.log('edge1 -60  ', await state(page, ids));
  await browser.close();
})();
