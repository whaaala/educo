// Does a Text dropped at the CENTRE of an empty stack go INTO it? (the "fifth block" seen in the #43 matrix)
const H = require('./h.js');
const { first, row } = require('./pages.js').helpers;
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720 });
  await H.panel(page, true);
  const a = await first(page, 'Stack'); const ids = await row(page, a, ['Stack', 'Stack', 'Stack']);
  for (const [i, id] of ids.entries()) {
    const r = await H.visibleRect(page, id);
    const before = (await H.rowOf(page, ids[0])).kids.length;
    await H.dropInto(page, 'Text', id);
    const after = await H.rowOf(page, ids[0]);
    const inside = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).querySelectorAll('[data-box-id]').length, id);
    console.log(`stack ${i + 1}: box ${Math.round(r.l)},${Math.round(r.t)} ${Math.round(r.w)}×${Math.round(r.h)} hidden=${!!r.hidden} · row ${before}→${after.kids.length} blocks · children inside it: ${inside}`);
    await page.screenshot({ path: `${__dirname}/pfill-${i + 1}.png` });
  }
  await browser.close();
})();
