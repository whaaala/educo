// E6-9 / E6-10 (the user, 2026-10-15): "Columns on Desktop" − / + does not show on the canvas; rows cannot be chosen. Built through the UI.
const H = require('./h.js'); const path = require('path');
const guides = (page) => page.evaluate(() => { const g = document.querySelector('[data-layout-guides]'); return g ? { cols: g.querySelectorAll('[data-guide-col]').length, rowStep: g.dataset.rowStep, w: Math.round(g.getBoundingClientRect().width) } : null; });
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1916, h: 990 });
  await H.panel(page, true); await H.clickTile(page, 'Stack'); await H.panel(page, false); await page.mouse.click(2, 980);
  await page.getByRole('button', { name: 'Layout guides' }).click(); await page.waitForTimeout(600);
  const dlg = page.locator('[role=dialog][aria-label="Page grid"]');
  const tab = await dlg.getByRole('radio', { checked: true }).or(dlg.locator('[aria-pressed=true]')).first().textContent().catch(() => '?');
  const bp = await page.evaluate(() => [...document.querySelectorAll('button[aria-pressed=true], [role=radio][aria-checked=true]')].map((b) => b.getAttribute('aria-label') || b.getAttribute('title') || b.textContent?.trim()).join(' | '));
  console.log('panel screen tab:', tab, '· pressed:', bp);
  console.log('start', JSON.stringify(await guides(page)), 'stepper', await dlg.getByLabel(/^Columns on/).first().inputValue().catch(() => '?'));
  for (const [btn, n] of [['one more', 2], ['one fewer', 5]]) {
    for (let i = 0; i < n; i++) { await dlg.getByLabel(new RegExp(`Columns on .*: ${btn}`)).first().click(); await page.waitForTimeout(150); }
    console.log(`after ${n}× ${btn}:`, JSON.stringify(await guides(page)), 'stepper', await dlg.getByLabel(/^Columns on/).first().inputValue().catch(() => '?'));
    await page.screenshot({ path: path.join(__dirname, 'e6-out', `e6-9-${btn.replace(' ', '-')}.png`) });
  }
  // E6-9: every screen tab, then its columns stepped — the canvas must show that screen and its count, straight away
  for (const tabName of ['Phone', 'Tablet', 'Laptop', 'Wide', 'Desktop']) {
    await dlg.getByRole('button', { name: tabName, exact: true }).click(); await page.waitForTimeout(700);
    const a = await guides(page);
    await dlg.getByLabel(/Columns on .*: one more/).first().click(); await page.waitForTimeout(300);
    const b = await guides(page);
    console.log(`${tabName}: canvas ${a?.w}px ${a?.cols} cols → one more → ${b?.cols} cols`);
    await page.screenshot({ path: path.join(__dirname, 'e6-out', `e6-9-tab-${tabName}.png`) });
  }
  const step = dlg.locator('input[type=range][aria-label="Row step"]');
  if (await step.count()) { await step.focus(); for (let i = 0; i < 6; i++) await step.press('ArrowRight'); console.log('row step →', JSON.stringify(await guides(page))); }
  console.log('errors', errs); await browser.close();
})();
