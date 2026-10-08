// PROBE E5c-8: in the palette's padded band, does a block JUMP when made Floating, and again when its drag starts (a still press)?
const E = require('./uat-e5b-headed.js');
const [W, H, TOUCH] = (process.argv[2] || '1280x800x0').split('x').map(Number);
(async () => {
  const { browser, page } = await E.open(W, H, 0, false, !!TOUCH);
  const ids = await E.build(page);
  const at = async () => { const r = await E.box(page, ids.head); return [Math.round(r.x * 10) / 10, Math.round(r.y * 10) / 10]; };
  await E.selectBox(page, ids.head);
  const a = await at(); const rootH = () => page.evaluate(() => document.querySelector('[data-canvas-scale] [data-box-id]').getBoundingClientRect().height); const h0 = await rootH();
  const fold = page.getByRole('button', { name: 'Expand inspector' }); if (await fold.isVisible().catch(() => false)) await E.press(page, fold);
  let fl = page.getByRole('button', { name: 'Floating', exact: true }).first();
  if (!(await fl.isVisible().catch(() => false))) { await E.press(page, page.getByRole('button', { name: /^Placement/ }).first()); fl = page.getByRole('button', { name: 'Floating', exact: true }).first(); }
  await fl.scrollIntoViewIfNeeded(); await E.press(page, fl); await page.waitForTimeout(500);
  if (await page.getByRole('button', { name: 'Collapse inspector' }).isVisible().catch(() => false) && W < 1024) await E.press(page, page.getByRole('button', { name: 'Collapse inspector' }));
  const b = await at(); console.log('page height before / after float', h0, await rootH());
  console.log('after float', JSON.stringify(await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`), cs = getComputedStyle(e), op = e.offsetParent; const r = JSON.parse(localStorage.getItem('educo_box_site_v1')).pages[0].root; const par = (n, p = null) => n.id === id ? p : (n.children ?? []).reduce((a, k) => a ?? par(k, n), null); const pm = par(r); return { modelParent: pm.id === r.id ? 'ROOT' : pm.id + (pm.rowBand ? ' (band)' : ''), stored: (pm.children.find((k) => k.id === id)), offsetParent: op.getAttribute('data-box-id') === r.id ? 'ROOT' : op.getAttribute('data-box-id'), opRect: op.getBoundingClientRect().toJSON(), opClientLeft: op.clientLeft, opPad: getComputedStyle(op).padding, css: { left: cs.left, top: cs.top, ml: cs.marginLeft, mt: cs.marginTop, translate: cs.translate, transform: cs.transform } }; }, ids.head)));
  await E.selectBox(page, ids.head);
  const g = E.mid(await page.getByRole('toolbar', { name: 'Block toolbar' }).getByLabel('Drag to move').boundingBox());
  await E.finger(page, [g, { x: g.x + 1, y: g.y }, { x: g.x, y: g.y }]); // pressed and let go where it was
  const c = await at();
  console.log(JSON.stringify({ inFlow: a, floated: b, afterStillDrag: c }), 'jump on float:', [b[0] - a[0], b[1] - a[1]], 'jump on drag:', [c[0] - b[0], c[1] - b[1]]);
  await browser.close();
})();
