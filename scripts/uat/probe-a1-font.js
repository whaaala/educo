// A-1 harness probe: the Inspector's controls for a freshly added Text block (where is "Font"?).
const H = require('./h.js'); const path = require('path');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1280, h: 900 });
  await H.panel(page, true); await H.clickTile(page, 'Text'); await H.panel(page, false);
  const t = page.getByRole('tab', { name: 'Content' }); if (await t.count()) await t.first().click(); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Font', exact: true }).first().click(); await page.waitForTimeout(500);
  const s = await page.evaluate(() => ({
    options: [...document.querySelectorAll('[role=option]')].slice(0, 12).map((o) => `${o.getAttribute('aria-label') || ''}|${o.textContent.trim().slice(0, 40)}`), nOptions: document.querySelectorAll('[role=option]').length, listbox: [...document.querySelectorAll('[role=listbox]')].map((l) => l.getAttribute('aria-label')),
    tabs: [...document.querySelectorAll('[role=tab]')].map((t) => `${t.textContent.trim()}=${t.getAttribute('aria-selected')}`),
    sections: [...document.querySelectorAll('button[aria-expanded]')].map((b) => `${b.textContent.trim().slice(0, 40)}=${b.getAttribute('aria-expanded')}`),
    listboxes: [...document.querySelectorAll('[aria-haspopup=listbox]')].map((b) => b.getAttribute('aria-label') || b.textContent.trim().slice(0, 30)),
  }));
  console.log(JSON.stringify(s, null, 1));
  await page.screenshot({ path: path.join(__dirname, 'a1-out', 'probe-font.png') });
  await browser.close();
})();
