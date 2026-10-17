// RX-3 recon: the vocabulary of the Inspector, read through the UI (one headed window). Not a measurement.
const path = require('path'); const fs = require('fs');
const H = require('../h.js'); const P = require('../pages.js').helpers; const I = require('../inspector.js');
const OUT = __dirname;
const dump = (page) => page.evaluate(() => {
  const ins = document.querySelector('aside[aria-label="Inspector"]') || document.body;
  const out = [];
  for (const e of ins.querySelectorAll('button,[role=radio],[role=slider],input,select,[role=tab],label,h3,h4,[role=group]')) {
    const n = e.getAttribute('aria-label') || (e.tagName === 'LABEL' || /^H/.test(e.tagName) ? e.textContent : e.textContent) || e.getAttribute('placeholder') || '';
    const t = (e.getAttribute('role') || e.tagName.toLowerCase()) + (e.type ? ':' + e.type : '') + (e.getAttribute('aria-expanded') ? ' exp=' + e.getAttribute('aria-expanded') : '');
    out.push(t + ' | ' + n.replace(/\s+/g, ' ').trim().slice(0, 80));
  }
  return [...new Set(out)];
});
async function expandAll(page) {
  for (let k = 0; k < 3; k++) {
    const heads = page.locator('aside[aria-label="Inspector"] button[aria-expanded="false"]');
    const n = await heads.count(); for (let i = 0; i < n; i++) { await heads.nth(0).click().catch(() => {}); await page.waitForTimeout(120); }
  }
}
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1500, h: 900, pos: [0, 0] });
  page.setDefaultTimeout(12000);
  const log = [];
  try {
    log.push('TOPBAR: ' + (await page.evaluate(() => Array.from(document.querySelectorAll('button')).filter((b) => b.getBoundingClientRect().top < 120).map((b) => b.getAttribute('aria-label') || b.textContent.trim()).join(' · '))));
    await H.panel(page, true);
    log.push('TILES: ' + (await page.evaluate(() => Array.from(document.querySelectorAll('[draggable="true"]')).map((b) => b.textContent.trim().slice(0, 30)).join(' · '))));
    const st = await P.first(page, 'Stack');
    const tx = await P.into(page, st, 'Text');
    await H.panel(page, false);
    await H.select(page, st);
    for (const t of ['Design', 'Content', 'Per-device']) { if (await I.tab(page, t)) { await expandAll(page); log.push(`== STACK tab ${t}`); log.push(...(await dump(page))); } }
    await H.select(page, tx);
    for (const t of ['Design', 'Content', 'Per-device']) { if (await I.tab(page, t)) { await expandAll(page); log.push(`== TEXT tab ${t}`); log.push(...(await dump(page))); } }
    await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
    await H.panel(page, true);
    const before = await P.ids(page);
    // video tile: click and record the style menu
    await (page.locator('[draggable="true"]').filter({ hasText: /^\s*Video/ }).first()).click(); await page.waitForTimeout(800);
    log.push('VIDEO MENU: ' + (await page.evaluate(() => Array.from(document.querySelectorAll('[role=menuitem],[role=menu] button')).map((b) => b.textContent.trim()).join(' · '))));
    await page.screenshot({ path: path.join(OUT, 'recon-video-menu.png') });
    const def = page.getByRole('menuitem', { name: /^Default$/ }).first(); if (await def.isVisible().catch(() => false)) await def.click(); await page.waitForTimeout(800);
    const vid = (await P.newestLeaf(page, before)).id;
    await H.panel(page, false); await H.select(page, vid);
    for (const t of ['Design', 'Content', 'Per-device']) { if (await I.tab(page, t)) { await expandAll(page); log.push(`== VIDEO tab ${t}`); log.push(...(await dump(page))); } }
    await page.screenshot({ path: path.join(OUT, 'recon-video.png') });
  } catch (e) { log.push('FAILED ' + e.message.split('\n')[0]); await page.screenshot({ path: path.join(OUT, 'recon-FAILED.png') }); }
  log.push('ERRS ' + errs.join(' | '));
  fs.writeFileSync(path.join(OUT, 'recon.txt'), log.join('\n'));
  await browser.close();
})();
