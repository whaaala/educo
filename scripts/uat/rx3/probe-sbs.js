// RX-3: what does the "Side by side" tile build, and what can a person select of it? (one headed window, through the UI)
const path = require('path'); const H = require('../h.js');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 820, pos: [0, 0] });
  const dump = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const out = []; const w = (n, d) => { out.push('  '.repeat(d) + n.id.slice(-4) + ' ' + (n.type || '') + (n.direction ? ' dir=' + n.direction : '') + (n.rowBand ? ' rowBand' : '') + (n.layout ? ' layout=' + n.layout : '')); (n.children || []).forEach((c) => w(c, d + 1)); }; w(s.pages[0].root, 0); return out.join('\n'); });
  const selInfo = () => page.evaluate(() => { const id = document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id'); const ed = (document.querySelector('aside[aria-label="Inspector"]')?.innerText.match(/Editing:\s*([^\n]+)/) || [])[1]; return `${id ? id.slice(-4) : 'none'} / Editing: ${ed}`; });
  await H.panel(page, true);
  await page.locator('[draggable="true"]').filter({ hasText: /^\s*Side by side/ }).first().click(); await page.waitForTimeout(900);
  console.log('after tile click:', await selInfo()); console.log(await dump());
  await page.screenshot({ path: path.join(__dirname, 'probe-sbs-1.png') });
  // click every selectable box from the top-left corner of the new row, as a person would
  await H.panel(page, false);
  const ids = await page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).map((e) => { const r = e.getBoundingClientRect(); return `${e.getAttribute('data-box-id').slice(-4)} ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} pad ${getComputedStyle(e).padding}`; }));
  console.log('boxes:', ids.join(' | '));
  const kid = await page.evaluate(() => { const all = Array.from(document.querySelectorAll('[data-box-id]')); return all[all.length - 1].getAttribute('data-box-id'); });
  await page.locator(`[data-box-id="${kid}"]`).click(); await page.waitForTimeout(300); console.log('click inner:', await selInfo());
  await page.keyboard.press('Escape'); await page.waitForTimeout(300); console.log('Escape:', await selInfo());
  await page.locator(`[data-box-id="${kid}"]`).click(); await page.waitForTimeout(300); await page.locator(`[data-box-id="${kid}"]`).click(); await page.waitForTimeout(300); console.log('click twice:', await selInfo());
  await page.screenshot({ path: path.join(__dirname, 'probe-sbs-2.png') });
  await browser.close();
})();
