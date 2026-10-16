// RX-3 follow-ups, headed, built through the UI: (1) PS-13 the #anchor jump on the EXPORTED site (not the srcdoc Preview);
// (2) SE-2 a heading set to Level 3 on a page that already has a Level 1 heading.
const path = require('path'); const H = require('../h.js'); const P = require('../pages.js').helpers; const I = require('../inspector.js'); const W = require('../page-weight.js');
const cls = (id) => '.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 820, pos: [300, 100] }); page.setDefaultTimeout(12000);
  const out = {};
  try {
    await H.panel(page, true);
    const b1 = await P.first(page, 'Stack'); const h1 = await P.into(page, b1, 'Heading'); const ln = await P.under(page, h1, 'Link');
    const esc = async () => { for (let i = 0; i < 4; i++) await page.keyboard.press('Escape'); await H.panel(page, true); };
    for (let i = 0; i < 3; i++) { await esc(); await H.clickTile(page, 'Spacer'); }
    await esc();
    const b2 = await P.first(page, 'Stack'); const h3 = await P.into(page, b2, 'Heading'); await H.panel(page, false);
    const pick = async (id, lvl) => { await H.select(page, id); await I.tab(page, 'Design'); await I.section(page, 'Meaning'); const t = page.getByRole('button', { name: 'Heading level', exact: true }).first(); await t.scrollIntoViewIfNeeded(); await t.click(); await page.waitForTimeout(300); await page.getByRole('option', { name: new RegExp('^Level ' + lvl) }).first().click(); await page.waitForTimeout(300); };
    await pick(h1, 1); await pick(h3, 3);
    await H.select(page, b2); await I.tab(page, 'Content'); await I.section(page, 'Bookmark'); await page.getByLabel('Bookmark name', { exact: true }).fill('target'); await page.keyboard.press('Tab');
    await H.select(page, ln); await I.tab(page, 'Content'); await page.getByLabel('Link', { exact: true }).fill('#target'); await page.keyboard.press('Tab'); await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(__dirname, 'followup-editor.png') });
    const files = await W.exportFiles(page); const { server, url } = await W.serve(files);
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 700 } }); const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(500);
    out.headings = await p.evaluate(([a, b]) => [a, b].map((s) => { const e = document.querySelector(s); const h = e && (e.matches('h1,h2,h3,h4,h5,h6') ? e : e.querySelector('h1,h2,h3,h4,h5,h6')); return h ? h.tagName : null; }), [cls(h1), cls(h3)]);
    out.before = await p.evaluate(() => ({ scrollY: Math.round(scrollY), docH: document.documentElement.scrollHeight }));
    await p.locator(`${cls(ln)} a, a${cls(ln)}`).first().click(); await p.waitForTimeout(1500);
    out.after = await p.evaluate((t) => ({ scrollY: Math.round(scrollY), hash: location.hash, targetTop: Math.round(document.querySelector(t).getBoundingClientRect().top) }), cls(b2));
    await p.screenshot({ path: path.join(__dirname, 'followup-export-after-jump.png') });
    await ctx.close(); server.close();
  } catch (e) { out.error = e.message.split('\n')[0]; await page.screenshot({ path: path.join(__dirname, 'followup-ERROR.png') }); }
  console.log(JSON.stringify(out));
  await browser.close();
})();
