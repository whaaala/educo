// PROBE E-5c U2/U3 on 1:1 tablets (800 / 962 / 1007 failed in the UAT, passed alone without C3): the UAT's own order, C3 first.
const path = require('path');
const E = require('./uat-e5b-headed.js');
const T = require('./uat-e5c-headed.js');
const [W, H, MOB] = (process.argv[2] || '962x601x1').split('x').map(Number);
const diff = (a, b, at = '') => { if (JSON.stringify(a) === JSON.stringify(b)) return []; if (a && b && typeof a === 'object' && typeof b === 'object') return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((k) => diff(a[k], b[k], `${at}.${k}`)); return [`${at}: ${JSON.stringify(a)?.slice(0, 80)} → ${JSON.stringify(b)?.slice(0, 80)}`]; };
(async () => {
  const { browser, page } = await E.open(W, H, 0, !!MOB, true);
  const log = (k, v) => console.log(k, typeof v === 'string' ? v : JSON.stringify(v));
  const ok = (w, p, d) => log(p ? 'SAW ' : 'FAIL', w + ' ' + (d || ''));
  const STEPS = (process.argv[3] || '').split(',');
  if (STEPS.includes('theme')) await E.editorTheme(page, 'Midnight');
  if (STEPS.includes('c1')) await T.C1(page, ok, W, H);
  if (STEPS.includes('c6')) await T.C6(page, ok, W, H, 'probe');
  const ids = await E.build(page);
  await T.C3(page, ok, W, ids);
  await page.screenshot({ path: path.join(__dirname, 'logs', `probe-e5c-${W}-afterC3.png`) });
  await E.U1resize(page, ok, `${W}`, ids, 'probe');
  await page.screenshot({ path: path.join(__dirname, 'logs', `probe-e5c-${W}-afterU1.png`) });
  if (STEPS.includes('u2m')) {
    await E.selectBox(page, ids.stack); await E.selectBox(page, ids.head);
    const st = () => page.evaluate((h) => { const sel = [...document.querySelectorAll('.outline-indigo-500')].map((e) => e.getAttribute('data-box-id')); const t = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]'); const g = t?.querySelector('[aria-label="Drag to move"]')?.getBoundingClientRect(); const hb = document.querySelector('[data-box-id="' + h + '"]').getBoundingClientRect(); return { sel, tb: t && t.getBoundingClientRect().toJSON(), grip: g && g.toJSON(), head: hb.toJSON(), atGrip: g && document.elementFromPoint(g.x + g.width / 2, g.y + g.height / 2)?.closest('[aria-label]')?.getAttribute('aria-label') }; }, ids.head);
    log('state', await st()); log('ids', ids);
    await page.waitForTimeout(800); log('state +800', await st());
    await page.screenshot({ path: path.join(__dirname, 'logs', 'probe-e5c-u2m.png') });
    await browser.close(); return;
  }
  if (STEPS.includes('u2')) { await page.evaluate(() => { window.__tb = []; const o = new MutationObserver(() => { const t = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]'); if (t) { const r = t.getBoundingClientRect(); window.__tb.push([Math.round(performance.now()), Math.round(r.x), Math.round(r.y)]); } }); o.observe(document.body, { subtree: true, attributes: true, childList: true }); }); await E.U2grip(page, ok, W, ids); log('toolbar track', await page.evaluate(() => window.__tb.slice(-12))); await browser.close(); return; }
  const before = JSON.parse(await E.raw(page));
  log('seq before', E.seq(before.pages[0].root));
  await E.selectBox(page, ids.head);
  const g = E.mid(await page.getByRole('toolbar', { name: 'Block toolbar' }).getByLabel('Drag to move').boundingBox());
  const d = await E.box(page, ids.div), s = await E.box(page, ids.stack), hd = await E.box(page, ids.head);
  log('boxes', { grip: g, head: hd, stack: s, div: d });
  await E.finger(page, E.line(g, { x: d.x + d.width / 2, y: d.y + d.height - 2 }, 14), { during: async () => { await page.screenshot({ path: path.join(__dirname, 'logs', `probe-e5c-${W}-mid.png`) }); } });
  const after = JSON.parse(await E.raw(page));
  log('seq after', E.seq(after.pages[0].root));
  diff(before, after).slice(0, 10).forEach((l) => log('drag Δ', l));
  await page.screenshot({ path: path.join(__dirname, 'logs', `probe-e5c-${W}-after.png`) });
  await browser.close();
})();
