// PROBE — Add | Layers: does "Add" bring the blocks back after Layers? (LE-14 H8, the tablet stayed on Layers)
const H = require('./h.js'); const W = require('../../config/inspector.json');
const { sleep, band } = require('./uat-rx3-headed.js');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 860 });
  await band(page, 'Heading'); await H.panel(page, true);
  const g = page.getByRole('group', { name: W.layers.view });
  await g.getByRole('button', { name: W.layers.title, exact: true }).click(); await sleep(page, 400);
  console.log('after Layers: tree', await page.getByRole('tree').count(), '· tiles', await page.getByRole('button', { name: /^Add Stack( —|$)/ }).count());
  await g.getByRole('button', { name: W.layers.add, exact: true }).click(); await sleep(page, 400);
  console.log('after Add: tree', await page.getByRole('tree').count(), '· tiles', await page.getByRole('button', { name: /^Add Stack( —|$)/ }).count(), '· pressed', await g.getByRole('button', { name: W.layers.add, exact: true }).getAttribute('aria-pressed'));
  await browser.close();
})();
