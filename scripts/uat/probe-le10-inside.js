// PROBE (LE10-6): on a touch phone, Add it → Inside + a tap on Heading with an empty Side by side selected added nothing. Each step shot.
const { chromium } = require('playwright');
const H = require('./h.js');
const { sleep, band, allIds, nodeOf, site } = require('./uat-rx3-headed.js');
const BASE = process.env.BASE || 'http://localhost:3100';
const OUT = 'scripts/uat/logs/le10/';
async function run(tag, opts, tile2) {
  const browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1'] });
  const ctx = await browser.newContext({ deviceScaleFactor: 1, ...opts }); const page = await ctx.newPage();
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
  await page.goto(BASE + '/website/box-demo'); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1500);
  const inside = async (host, tile, step) => {
    const before = new Set(await allIds(page));
    await H.panel(page, false); await H.select(page, host); await H.panel(page, true);
    const grp = page.getByRole('group', { name: 'Where the block goes' });
    const opts2 = await grp.getByRole('button').evaluateAll((bs) => bs.map((b) => `${b.textContent.trim()}${b.disabled ? '(disabled)' : ''}${b.getAttribute('aria-pressed') === 'true' ? '*' : ''}`));
    await grp.getByRole('button', { name: 'Inside' }).first().tap(); await sleep(page, 300);
    const pressed = await grp.getByRole('button').evaluateAll((bs) => bs.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.textContent.trim()));
    await page.screenshot({ path: `${OUT}probe-inside-${tag}-${step}-sheet.png` });
    await page.locator('[draggable="true"]').filter({ hasText: new RegExp('^\\s*' + tile) }).first().tap(); await sleep(page, 900);
    const sel = await H.selected(page);
    await page.screenshot({ path: `${OUT}probe-inside-${tag}-${step}-after.png` });
    const fresh = (await allIds(page)).filter((x) => !before.has(x));
    const kinds = []; for (const id of fresh) { const n = await nodeOf(page, id); kinds.push(`${id.slice(-4)}:${n.type}${n.rowBand ? '/band' : ''}${n.direction ? '/' + n.direction : ''}`); }
    console.log(tag, step, JSON.stringify({ hostSelectedBefore: host.slice(-4), options: opts2, pressedAfterTap: pressed, fresh: kinds, selectedAfter: (sel || 'none').slice(-4) }));
    return fresh;
  };
  try {
    const st = await band(page, 'Stack');
    const f1 = await inside(st, 'Side by side', 1); let sbs = null; for (const id of f1) { const n = await nodeOf(page, id); if (!n.rowBand) sbs = id; }
    await inside(sbs, tile2, 2);
    const s = await site(page); const p = s.pages[0].root; const tree = (n, d = 0) => `${' '.repeat(d)}${n.id.slice(-4)} ${n.type}${n.rowBand ? ' band' : ''}${n.direction ? ' ' + n.direction : ''}\n` + (n.children || []).map((c) => tree(c, d + 1)).join('');
    console.log(tag, 'TREE\n' + tree(p));
  } catch (e) { console.log(tag, 'ERROR', e.message.split('\n')[0]); }
  await browser.close();
}
(async () => {
  await Promise.all([
    run('touch393', { viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true }, 'Heading'),
    run('touch393-text', { viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true }, 'Text'),
    run('mouse1366', { viewport: { width: 1366, height: 860 }, hasTouch: true }, 'Heading'),
  ]);
})();
