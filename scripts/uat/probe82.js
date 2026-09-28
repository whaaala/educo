// #82: four stacks at 1366 Full width — first block out 6 × 80px, RELOAD, back. Stored values at every step.
const H = require('./h.js');
const { first, row } = require('./pages.js').helpers;
const state = (page, ids) => page.evaluate((ids) => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const find = (n, id) => n.id === id ? n : (n.children || []).reduce((a, c) => a || find(c, id), null);
  return ids.map((id) => { const n = find(s.pages[0].root, id); const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect();
    return `${Math.round(r.width)}@${Math.round(r.top)}[${n.width}${n.widthByHand ? 'h' : ''}${n.restWidth ? ' r' + n.restWidth + (n.restBy ? '/' + n.restBy.slice(-3) : '') : ''}${n.origWidth ? ' ow' + n.origWidth : ''}${n.wrapBy ? ' wb' : ''}${n.endOwed ? ' o' + n.endOwed : ''}]`; }).join(' ');
}, ids);
(async () => {
  const reload = !process.argv.includes('--noreload');
  const { browser, page } = await H.open({ headed: true, w: 1350, h: 640 });
  await page.getByRole('button', { name: 'Full width' }).first().click(); await page.waitForTimeout(600);
  await H.panel(page, true);
  const a = await first(page, 'Stack'); const ids = await row(page, a, ['Stack', 'Stack', 'Stack']);
  await H.panel(page, false); await H.fillStacks(page); await H.panel(page, false);
  console.log('ids', ids.map((i) => i.slice(-3)).join(' '));
  console.log('start ', await state(page, ids));
  const right = async () => { const r = await H.rowOf(page, ids[0]); return r.kids[0].l + r.kids[0].w; };
  const startRight = await right();
  const backToStart = async (tag) => { for (let i = 0; i < 25; i++) { const d = startRight - await right(); if (Math.abs(d) <= 1) break; await H.select(page, ids[0]); await H.dragEdge(page, 'right', Math.sign(d) * Math.min(80, Math.abs(d))); console.log(tag, i, Math.round(d), await state(page, ids)); } };
  if (process.argv.includes('--matrix')) {
    for (let i = 0; i < 6; i++) { await H.select(page, ids[0]); await H.dragEdge(page, 'right', 80); }
    await backToStart('fresh-back');
  }
  for (let i = 0; i < 6; i++) { await H.select(page, ids[0]); await H.dragEdge(page, 'right', 80); console.log('out', i, await state(page, ids)); }
  if (reload) { await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2500); await page.getByRole('button', { name: 'Full width' }).first().click(); await page.waitForTimeout(600); console.log('reload', await state(page, ids)); }
  await backToStart('back');
  await browser.close();
})();
