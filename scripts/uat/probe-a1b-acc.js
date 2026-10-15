// PROBE — what the Inspector offers for an Accordion added from the palette (A-1b U3b: where is its font picker?)
const H = require('./h.js'); const path = require('path');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1280, h: 900 });
  await H.panel(page, true); await H.clickTile(page, 'Accordion'); await H.panel(page, false);
  const sel = await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id'));
  console.log('selected', sel, (await page.getByText(/^Editing:/).first().innerText().catch(() => '?')));
  for (const tb of ['Design', 'Content']) {
    await page.getByRole('tab', { name: tb }).first().click(); await page.waitForTimeout(300);
    console.log(tb, (await page.locator('button[aria-expanded]').allInnerTexts()).map((t) => t.trim()).filter(Boolean).join(' | ').slice(0, 600));
  }
  await page.screenshot({ path: path.join(__dirname, 'logs', 'a1b-probe', 'acc.png') }); await browser.close();
})();
