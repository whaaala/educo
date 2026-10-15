// PROBE — 375px at 200 % browser text: is the editor wider than the screen BEFORE Page settings opens, and what sticks out?
const { chromium } = require('playwright'); const fs = require('fs'); const os = require('os'); const path = require('path');
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'a1b200-')); fs.mkdirSync(path.join(dir, 'Default'));
  fs.writeFileSync(path.join(dir, 'Default', 'Preferences'), JSON.stringify({ webkit: { webprefs: { default_font_size: 32 } } }));
  const ctx = await chromium.launchPersistentContext(dir, { headless: false, viewport: { width: 375, height: 860 }, args: ['--force-device-scale-factor=1'] });
  const page = ctx.pages()[0]; await page.goto('http://localhost:3100/website/box-demo'); await page.waitForTimeout(4000);
  const wide = () => page.evaluate(() => { const W = document.documentElement.clientWidth; return { side: document.documentElement.scrollWidth - W, out: [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > W + 1 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 6).map((e) => `${e.tagName.toLowerCase()}${e.getAttribute('aria-label') ? '[' + e.getAttribute('aria-label') + ']' : ''}.${String(e.className).slice(0, 40)} r=${Math.round(e.getBoundingClientRect().right)}`) }; });
  console.log('before', JSON.stringify(await wide()));
  for (let i = 0; i < 2; i++) { const b = page.getByRole('button', { name: 'Page settings' }); if (await b.first().isVisible()) { await b.first().click(); break; } await page.getByRole('button', { name: 'More', exact: true }).first().click(); await page.waitForTimeout(500); }
  await page.waitForTimeout(600); console.log('after', JSON.stringify(await wide()));
  await page.screenshot({ path: path.join(__dirname, 'logs', 'a1b-probe', '200-375.png') }); await ctx.close();
})();
