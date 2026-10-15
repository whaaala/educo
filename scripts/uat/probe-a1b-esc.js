// PROBE — does Esc that closes an Inspector dropdown ALSO step out of the selected block? (A-1b U3b)
const H = require('./h.js');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1280, h: 900 });
  await H.panel(page, true); await H.clickTile(page, 'Text'); await H.panel(page, false);
  const sel = () => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
  const before = await sel(); await page.getByRole('tab', { name: 'Content' }).first().click(); await page.waitForTimeout(300);
  const trig = page.getByRole('button', { name: 'Font', exact: true }).first(); await trig.scrollIntoViewIfNeeded(); await trig.click(); await page.waitForTimeout(300);
  const open1 = await page.getByRole('listbox').count(); await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  console.log(JSON.stringify({ before, listboxOpen: open1, afterEsc: { listbox: await page.getByRole('listbox').count(), selected: await sel(), focus: await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName) } }));
  await browser.close();
})();
