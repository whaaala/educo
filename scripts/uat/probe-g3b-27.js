// PROBES (through the UI, headed, side by side):
//   G3b-27 · a picture two rows tall + a card (Alt-free edge) + words, each a THIRD (all on one line), and a Grid of cards below:
//            which block comes within 8px of a phone's edge at 150 / 200 % text in the Preview, and why?
//   NOTE   · the "steps down to fit" note's colour and what it is drawn on, in Dark / Midnight / Purple Dream
const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const OUT = path.join(__dirname, 'logs', 'uat-g3b');
const chip = async (page, name) => { await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); };
async function theme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
async function g27(page, scale) {
  await H.panel(page, true);
  const ph = await P.first(page, 'Stack'); await P.into(page, ph, 'Image');
  const c = await P.beside(page, ph, 'Stack'); const card = await P.into(page, c, 'Card'); await P.under(page, card, 'Button').catch(() => null);
  const w = await P.beside(page, c, 'Stack'); await P.into(page, w, 'Text');
  await H.panel(page, false); await chip(page, 'Desktop (1280px)');
  await H.select(page, ph); await I.tab(page, 'Design'); await I.section(page, 'Size'); const f = page.getByLabel('Rows tall', { exact: true }).first(); await f.fill('2'); await f.blur(); await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1200); await page.keyboard.press('h');
  for (const wd of [320, 360, 412]) {
    await page.setViewportSize({ width: wd, height: 800 }); await page.waitForTimeout(300);
    let fr = await (await page.$('iframe')).contentFrame(); const inner = await fr.evaluate(() => document.documentElement.clientWidth);
    if (inner !== wd) { await page.setViewportSize({ width: 2 * wd - inner, height: 800 }); await page.waitForTimeout(250); fr = await (await page.$('iframe')).contentFrame(); }
    await fr.evaluate((s) => { document.documentElement.style.fontSize = s * 100 + '%'; }, scale); await page.waitForTimeout(200);
    const d = await fr.evaluate((ids) => ids.map(([n, id]) => { const e = document.querySelector('.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-')); if (!e) return n + ': none'; const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
      return n + ' ' + r.left.toFixed(1) + '…' + r.right.toFixed(1) + ' top ' + r.top.toFixed(0) + ' gc ' + cs.gridColumn + ' gr ' + cs.gridRow + ' ml ' + cs.marginLeft + ' mr ' + cs.marginRight + ' minW ' + cs.minWidth + ' w ' + cs.width; }), [['picture', ph], ['card', c], ['words', w]]);
    console.log('[G3b-27 ' + scale * 100 + '% @' + wd + '] W ' + inner + '\n  ' + d.join('\n  '));
    await page.screenshot({ path: path.join(OUT, 'probe27-' + scale * 100 + '-' + wd + '.png') });
  }
}
async function note(page, th) {
  await theme(page, th);
  await H.panel(page, true); const a = await P.first(page, 'Stack'); await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Image'); await H.panel(page, false);
  await chip(page, 'Mobile (375px)'); await H.select(page, a); await I.tab(page, 'Design'); await I.section(page, 'Size');
  const n = page.getByRole('note').filter({ hasText: 'steps down to fit' }).first(); await n.scrollIntoViewIfNeeded();
  const info = await n.evaluate((e) => { const chain = []; for (let x = e; x && chain.length < 8; x = x.parentElement) chain.push((x.className || '').toString().slice(0, 60) + ' bg=' + getComputedStyle(x).backgroundColor); return { color: getComputedStyle(e).color, html: document.documentElement.className, chain }; });
  console.log('[NOTE ' + th + '] color ' + info.color + ' · html class "' + info.html + '"\n  ' + info.chain.join('\n  '));
  await page.screenshot({ path: path.join(OUT, 'probe-note-' + th.replace(/\s/g, '') + '.png') });
}
(async () => {
  const jobs = [() => ['g27-150', (p) => g27(p, 1.5)], () => ['g27-200', (p) => g27(p, 2)], () => ['note-Dark', (p) => note(p, 'Dark')], () => ['note-Midnight', (p) => note(p, 'Midnight')]];
  await Promise.all(jobs.map(async (j, i) => { const [name, fn] = j(); const { browser, page } = await H.open({ headed: true, w: 1240, h: 820, pos: [(i % 3) * 640, Math.floor(i / 3) * 520] });
    try { await fn(page); } catch (e) { console.log('[' + name + '] ERROR ' + e.message.split('\n')[0]); } await browser.close(); }));
})();
