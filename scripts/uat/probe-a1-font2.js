// A-1 probe: after typing in the Inspector's Text box, does the FIRST click on "Font" open its list?
const H = require('./h.js');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1280, h: 900 });
  const lb = () => page.evaluate(() => document.querySelectorAll('[role=listbox][aria-label=Font]').length);
  const run = async (label, typed, blur) => {
    await H.panel(page, true); await H.clickTile(page, 'Text'); await H.panel(page, false);
    await page.getByRole('tab', { name: 'Content' }).click(); await page.waitForTimeout(300);
    if (typed) { const ta = page.getByLabel('Text', { exact: true }).first(); await ta.click(); await page.keyboard.type('Hello parents'); if (blur) await ta.blur(); await page.waitForTimeout(600); }
    const font = page.getByRole('button', { name: 'Font', exact: true }).first();
    await page.evaluate(() => { window.__sc = []; window.__scOn || addEventListener('scroll', (e) => { const t = e.target; window.__sc && window.__sc.push(t === document ? 'document' : `${t.tagName}.${String(t.className).slice(0, 60)} top=${t.scrollTop}`); }, true); window.__scOn = true; });
    await font.click(); await page.waitForTimeout(500); const first = await lb();
    console.log(label, 'scrolls during first click:', JSON.stringify(await page.evaluate(() => window.__sc.slice(0, 5))));
    if (!first) { await font.click(); await page.waitForTimeout(500); }
    console.log(label, 'first click opens:', !!first, '| second:', first ? '-' : !!(await lb()));
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  };
  await run('A no typing', false);
  await run('B typed, then clicked Font', true, false);
  await run('C typed, blurred, then clicked Font', true, true);
  await browser.close();
})();
