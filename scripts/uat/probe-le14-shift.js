// PROBE — after a Shift-click, where is the focus, and do Ctrl+G / ↓ reach the canvas? (LE-14 HEADED pass 2, H1 / H2)
const H = require('./h.js');
const { sleep, band, parentOf } = require('./uat-rx3-headed.js');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 860 });
  const h1 = await band(page, 'Heading'); const h2 = await band(page, 'Heading'); await H.panel(page, false);
  await H.select(page, h1);
  // a point where h2 SHOWS (the selected Heading's toolbar sits over the middle of the one below it)
  const pt = await page.evaluate((id) => { const el = document.querySelector(`[data-box-id="${id}"]`); const b = el.getBoundingClientRect(); for (const fx of [0.5, 0.3, 0.7, 0.9, 0.1]) { const x = b.left + b.width * fx, y = b.top + b.height / 2, h = document.elementFromPoint(x, y); if (h && el.contains(h)) return [x, y]; } return null; }, h2);
  await page.keyboard.down('Shift'); await page.mouse.click(pt[0], pt[1]); await page.keyboard.up('Shift'); await sleep(page, 400);
  console.log('focus', await page.evaluate(() => { const a = document.activeElement; return `${a?.tagName} editable=${a?.isContentEditable} box=${a?.closest('[data-box-id]')?.getAttribute('data-box-id')?.slice(-4)}`; }));
  await page.keyboard.press('Control+g'); await sleep(page, 600);
  console.log('grouped', !!(await parentOf(page, h1))?.group || !!(await parentOf(page, (await parentOf(page, h1)).id))?.group);
  await browser.close();
})();
