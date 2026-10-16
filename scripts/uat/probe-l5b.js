// HEADED PROBE (RULE Y) for the findings of L-5's first HEADED pass — each built through the UI and read, before any fix.
//   undo   a Stat's bottom edge +50, then Ctrl+Z — and the toolbar's Undo button — does the drag come undone?
//   button a Button's corners in 30/20 and back (L5-9)
//   fsq    a row of 3 columns with words, the first sized by hand, then the second's left edge −60 (F's 107 → 1280)
//   text   where a fresh Text's `minHeight` comes from: clicked in, dropped under a Heading, dropped into a stack
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/probe-l5b.js [--case=undo]
const { spawn } = require('child_process'); const path = require('path'); const fs = require('fs');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const OUT = path.join(__dirname, 'logs', 'uat-l5'); fs.mkdirSync(OUT, { recursive: true });
const CASES = ['undo', 'button', 'fsq', 'text']; const CASE = arg('case', '');
if (!CASE) { CASES.forEach((c, i) => { const p = spawn(process.execPath, [__filename, `--case=${c}`, `--pos=${(i % 3) * 640},${Math.floor(i / 3) * 520}`], { env: process.env }); const log = fs.createWriteStream(path.join(OUT, `probe-b-${c}.out`)); p.stdout.pipe(log); p.stderr.pipe(log); p.on('exit', (code) => console.log(`${c} exit ${code}`)); }); return; }

const H = require('./h.js'); const P = require('./pages.js').helpers;
const say = (...a) => console.log(...a);
const node = (page, id) => page.evaluate((id) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; w(s.pages[0].root); if (!n) return null; const { children, text, id: _i, ...rest } = n; return rest; }, id);
const rect = (page, id) => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const f = e.closest('[data-canvas-scale]'), s = Number(f.dataset.canvasScale), r = e.getBoundingClientRect(), o = f.getBoundingClientRect(); return [(r.left - o.left) / s, (r.top - o.top) / s, r.width / s, r.height / s].map((v) => +v.toFixed(1)); }, id);
const scale = (page) => page.evaluate(() => Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale || 1));
const show = async (page, ids, tag) => { for (const id of ids) say(tag.padEnd(26), id.slice(-4), JSON.stringify(await rect(page, id)), JSON.stringify(await node(page, id))); };
async function drag(page, label, dx, dy) {
  const s = await scale(page); const h = await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox(); if (!h) throw new Error(`no handle ${label}`);
  const x = h.x + h.width / 2, y = h.y + h.height / 2; await page.mouse.move(x, y); await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(x + (dx * s * i) / 10, y + (dy * s * i) / 10); await page.waitForTimeout(14); }
  await page.mouse.up(); await page.waitForTimeout(450);
}
const desktop = (page) => page.getByRole('button', { name: 'Desktop (1280px)' }).first().click().then(() => page.waitForTimeout(700));

const RUN = {
  async undo(page) {
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const st = await P.into(page, s, 'Stat'); await H.panel(page, false); await desktop(page);
    await show(page, [st], 'start');
    await H.select(page, st); await drag(page, 'bottom edge', 0, 50); await show(page, [st], 'after +50');
    say('focus is on:', await page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName} ${a.getAttribute('aria-label') || a.className.toString().slice(0, 60)}` : 'none'; }));
    await page.keyboard.press('Control+z'); await page.waitForTimeout(600); await show(page, [st], 'Ctrl+Z');
    await page.keyboard.press('Control+y'); await page.waitForTimeout(600); await show(page, [st], 'Ctrl+Y');
    const undo = page.getByRole('button', { name: /^Undo/ }).first(); say('Undo button:', await undo.count(), await undo.getAttribute('aria-label').catch(() => '?'));
    await undo.click(); await page.waitForTimeout(600); await show(page, [st], 'Undo button');
  },
  async button(page) {
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const b = await P.into(page, s, 'Button'); await H.panel(page, false); await desktop(page);
    await show(page, [b], 'start');
    for (const [c, dx, dy] of [['top-right corner', -30, 20], ['bottom-left corner', 30, -20], ['right edge', -30, 0], ['bottom edge', 0, -20]]) {
      await H.select(page, b); await drag(page, c, dx, dy); await show(page, [b], `${c} in`);
      await H.select(page, b); await drag(page, c, -dx, -dy); await show(page, [b], `${c} back`);
      await page.screenshot({ path: path.join(OUT, `probe-b-button-${c.replace(' ', '-')}.png`) });
    }
  },
  async fsq(page) {
    await H.panel(page, true); const ids = [await P.first(page, 'Stack')]; for (let i = 1; i < 3; i++) ids.push(await P.beside(page, ids[ids.length - 1], 'Stack'));
    const words = []; for (const c of ids) words.push(await P.into(page, c, 'Text'));
    await H.panel(page, false); await desktop(page); await show(page, ids, 'start');
    const w0 = (await rect(page, ids[0]))[2]; await H.select(page, ids[0]); await drag(page, 'right edge', -(w0 - 150), 0); await show(page, ids, 'c1 by hand to 150');
    await page.screenshot({ path: path.join(OUT, 'probe-b-fsq-1.png') });
    await H.select(page, ids[1]); say('selected:', await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')?.slice(-4)));
    await drag(page, 'left edge', -60, 0); await show(page, ids, 'c2 left edge -60');
    await page.screenshot({ path: path.join(OUT, 'probe-b-fsq-2.png') });
  },
  async text(page) {
    await H.panel(page, true); const t1 = await P.first(page, 'Text'); await show(page, [t1], 'Text clicked in');
    const s = await P.first(page, 'Stack'); const t2 = await P.into(page, s, 'Text'); await show(page, [t2], 'Text dropped into a stack');
    const hd = await P.under(page, t2, 'Heading'); const t3 = await P.under(page, hd, 'Text'); await show(page, [hd, t3], 'dropped under');
  },
};
(async () => {
  const POS = arg('pos', '0,0').split(',').map(Number);
  const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: POS }); page.setDefaultTimeout(15000);
  try { say(`CASE ${CASE}`); await RUN[CASE](page); } catch (e) { say('FAILED', page.__step, e.message.split('\n')[0]); }
  say(`page errors ${errs.length}${errs.length ? ': ' + errs.join(' | ') : ''}`); await browser.close();
})();
