// #53 in the browser: widen the MIDDLE by hand, then take the FIRST out and back. What is stored at each step?
const H = require('./h.js');
const { first, row } = require('./pages.js').helpers;
const stored = (page, ids) => page.evaluate((ids) => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const find = (n, id) => n.id === id ? n : (n.children || []).reduce((a, c) => a || find(c, id), null);
  return ids.map((id) => { const n = find(s.pages[0].root, id); return `${n.width}${n.restWidth ? ` (rest ${n.restWidth} @${n.restAt ?? '—'})` : ''}`; }).join(' | ');
}, ids);
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720 });
  await H.panel(page, true);
  const a = await first(page, 'Stack'); const ids = await row(page, a, ['Stack', 'Stack']);
  await H.panel(page, false);
  console.log('start          ', await stored(page, ids));
  await H.select(page, ids[1]); await H.dragEdge(page, 'right', 120); console.log('middle +120    ', await stored(page, ids));
  await H.select(page, ids[0]); await H.dragEdge(page, 'right', 80); console.log('first  +80     ', await stored(page, ids));
  await H.select(page, ids[0]); await H.dragEdge(page, 'right', -80); console.log('first  -80     ', await stored(page, ids));
  await browser.close();
})();
