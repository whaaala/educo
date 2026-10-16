// PROBE (RULE Y) — BATCH A-1b through the UI before the UAT: a NEW site, a heading + a Yoruba paragraph typed in, the fonts
// they are drawn in, Page settings → Site fonts, the font picker's words, the Page check. Screenshots in logs/a1b-probe/.
//   node scripts/uat/probe-a1b.js --headed
const fs = require('fs'); const path = require('path'); const H = require('./h.js');
const OUT = path.join(__dirname, 'logs', 'a1b-probe'); fs.mkdirSync(OUT, { recursive: true });
const tab = async (page, name) => { const t = page.getByRole('tab', { name }); if (await t.count()) { await t.first().click(); await page.waitForTimeout(300); } };
(async () => {
  const { browser, page, errs } = await H.open({ w: 1440, h: 900 });
  const shot = (n) => page.screenshot({ path: path.join(OUT, n + '.png') });
  await H.panel(page, true); await H.clickTile(page, 'Heading'); await H.clickTile(page, 'Text'); await H.panel(page, false);
  await tab(page, 'Content'); const ta = page.getByLabel('Text', { exact: true }).first(); await ta.fill('Ẹ kú àárọ̀ — ọmọ wa ṣe dáadáa. Ɓarka. Ɛte sɛn?'); await ta.blur(); await page.waitForTimeout(600);
  const drawn = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].filter((e) => !e.querySelector('[data-box-id]') && e.textContent.trim()).map((e) => ({ text: e.textContent.trim().slice(0, 30), font: getComputedStyle(e.querySelector('h1,h2,h3,h4,p,div') || e).fontFamily })));
  console.log('drawn in:', JSON.stringify(drawn));
  await shot('1-new-site');
  await page.getByRole('button', { name: 'Page settings' }).first().click(); await page.waitForTimeout(500); await shot('2-page-settings');
  const notes = await page.locator('fieldset:has(legend:text("Site fonts")) p').allTextContents(); console.log('site fonts says:', notes);
  await page.keyboard.press('Escape'); await page.getByRole('button', { name: 'Page settings' }).first().click().catch(() => {}); await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Page check/ }).first().click(); await page.waitForTimeout(600); await shot('3-page-check-new');
  console.log('page check (new site):', (await page.getByRole('dialog').innerText()).replace(/\s+/g, ' ').slice(0, 300));
  await browser.close(); console.log('errors:', errs);
})();
