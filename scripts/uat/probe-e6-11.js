// E6-11: the DRAWN guide lines (the portal the user sees) — do they follow the columns / row height at once, with no scroll?
const H = require('./h.js'); const path = require('path');
const drawn = (page) => page.evaluate(() => { const l = document.querySelector('[data-guide-lines]'); if (!l) return null;
  const kids = [...l.children].map((c) => c.getBoundingClientRect()); return { vertical: kids.filter((r) => r.width <= 1 && r.height > 5).length, horizontal: kids.filter((r) => r.height <= 1 && r.width > 5).length }; });
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1916, h: 990 });
  await H.panel(page, true); await H.clickTile(page, 'Stack'); await H.panel(page, false); await page.mouse.click(2, 980);
  await page.getByRole('button', { name: 'Layout guides' }).click(); await page.waitForTimeout(700);
  const dlg = page.locator('[role=dialog][aria-label="Page grid"]');
  const rowsBox = dlg.getByLabel('Row lines in the guides'); if (!(await rowsBox.isChecked())) { await rowsBox.check(); await page.waitForTimeout(400); }
  console.log('start', JSON.stringify(await drawn(page)));
  for (let i = 0; i < 3; i++) { await dlg.getByLabel(/Columns on .*: one more/).first().click(); await page.waitForTimeout(300); }
  console.log('3 more columns', JSON.stringify(await drawn(page)), 'in-page columns', await page.locator('[data-guide-col]').count());
  const h = dlg.locator('input[type=range][aria-label="Row height"], input[type=range][aria-label="Row step"]').first();
  await h.focus(); for (let i = 0; i < 4; i++) await h.press('ArrowLeft'); await page.waitForTimeout(300);
  console.log('row height down', JSON.stringify(await drawn(page)), 'step', await page.locator('[data-layout-guides]').getAttribute('data-row-step'));
  const rows = dlg.getByLabel('Rows on this page', { exact: true });
  if (await rows.count()) { await rows.fill('4'); await page.waitForTimeout(300); console.log('4 rows', JSON.stringify(await drawn(page)), 'step', await page.locator('[data-layout-guides]').getAttribute('data-row-step')); }
  await page.screenshot({ path: path.join(__dirname, 'e6-out', 'e6-11.png') });
  console.log('errors', errs); await browser.close();
})();
