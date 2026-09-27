// #52 — at a canvas shrunk to fit, after one right-edge drag nothing else moves. Stored vs shown vs grabbable.
const H = require('./h.js');
const { first, row } = require('./pages.js').helpers;
const state = (page, ids) => page.evaluate((ids) => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const find = (n, id) => n.id === id ? n : (n.children || []).reduce((a, c) => a || find(c, id), null);
  const stored = ids.map((id) => find(s.pages[0].root, id)?.width || '-');
  const shown = ids.map((id) => Math.round(document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().width));
  const h = document.querySelector('[aria-label="Resize right edge"]'); const hr = h?.getBoundingClientRect();
  const hit = hr ? document.elementFromPoint(hr.left + hr.width / 2, hr.top + hr.height / 2) : null;
  const mir = h?.closest('[data-chrome-mirror]');
  return { stored, shown, handle: hr ? `${Math.round(hr.left)},${Math.round(hr.top)}` : 'none', grabbable: !!hit && hit === h, hitIs: hit ? (hit.getAttribute('aria-label') || hit.tagName) : null, clip: mir ? mir.style.clipPath : null, selected: document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')?.slice(-4) };
}, ids);
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720 });
  await H.panel(page, true);
  const a = await first(page, 'Stack'); const ids = await row(page, a, ['Stack', 'Stack', 'Stack']);
  await H.panel(page, false); if (process.argv.includes('--fill')) { await H.fillStacks(page); await H.panel(page, false); }
  console.log('blocks in row', (await H.rowOf(page, ids[0])).kids.length);
  await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(700);
  console.log('start      ', JSON.stringify(await state(page, ids)));
  for (const d of [80, 80, -80]) {
    await H.select(page, ids[0]); console.log('selected   ', JSON.stringify(await state(page, ids)));
    await H.dragEdge(page, 'right', d); console.log(`after ${d > 0 ? '+' : ''}${d}  `, JSON.stringify(await state(page, ids)));
    await page.screenshot({ path: `${__dirname}/p52-${d}-${Date.now() % 1000}.png` });
  }
  console.log('errors', errs);
  await browser.close();
})();
