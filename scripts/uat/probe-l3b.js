// L3-b: which LIVE input leaves a row's columns un-grown on the canvas when the reloaded tree grows them? Page 332's tree
// from BEFORE the words (built through the UI by uat-pages — RULE Y: it only pins that repro), then the stress typing
// done through the UI, then the band's columns measured at canvas Tablet. Six variants, six headed windows at once.
//   NODE_PATH=node_modules node scripts/uat/probe-l3b.js [--page=332] [--band=3g] [--only=B,C,F]   (BASE= picks the server)
const fs = require('fs'); const path = require('path'); const H = require('./h.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const PG = arg('page', '332'), BAND = arg('band', '3g');
const site = fs.readFileSync(path.join(__dirname, 'dressed99-out', `page-${PG}.site.json`), 'utf8');
const LONG = 'The quick brown fox jumps over the lazy dog while the school choir sings. '.repeat(3).slice(0, 150);
const size = (page, n) => page.getByRole('button', { name: new RegExp('^' + n) }).first().click().then(() => page.waitForTimeout(900));
// The row whose id ends in BAND: the band's measured width and each column's drawn width + flex
const cols = (page) => page.evaluate((b) => {
  const rows = [...document.querySelectorAll('[data-box-id]')].filter((e) => e.dataset.boxId.endsWith('-' + b) || e.dataset.boxId.endsWith(b));
  const row = rows.find((e) => [...e.children].filter((k) => k.dataset && k.dataset.boxId).length >= 3) || rows[0]; if (!row) return 'no band';
  return [...row.children].filter((k) => k.dataset && k.dataset.boxId && k.getBoundingClientRect().width > 0)
    .map((k) => `${k.dataset.boxId.slice(-3)} w${Math.round(k.getBoundingClientRect().width)} top${Math.round(k.getBoundingClientRect().top - row.getBoundingClientRect().top)} ${getComputedStyle(k).flex}`).join(' | ');
}, BAND);
async function stress(page, rounds) {
  const texts = page.locator('[data-box-id] [contenteditable]'); const nT = Math.min(await texts.count(), 12); page.__typedInto = nT;
  for (let round = 0; round < rounds; round++) for (let t = 0; t < nT; t++) {
    const loc = texts.nth(t); await loc.scrollIntoViewIfNeeded().catch(() => {}); await loc.click().catch(() => {});
    for (let r = 0; r < 3; r++) await page.keyboard.type(LONG, { delay: 0 });
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: t % 2 ? /^Tablet/ : /^Desktop/ }).first().click().catch(() => {});
  }
}
const VARIANTS = {
  A_control: async (p) => { await size(p, 'Mobile'); await size(p, 'Tablet'); },
  B_stress_mobile_tablet: async (p) => { await stress(p, 3); await size(p, 'Mobile'); await size(p, 'Tablet'); },
  C_stress_tablet: async (p) => { await stress(p, 3); await size(p, 'Tablet'); },
  D_stress_reload: async (p) => { await stress(p, 3); await p.waitForTimeout(1500); await p.reload(); await p.waitForTimeout(3000); await size(p, 'Mobile'); await size(p, 'Tablet'); },
  E_one_round: async (p) => { await stress(p, 1); await size(p, 'Mobile'); await size(p, 'Tablet'); },
  F_stress_laptop_tablet: async (p) => { await stress(p, 3); await size(p, 'Laptop'); await size(p, 'Tablet'); },
};
(async () => {
  const only = arg('only', ''); const picked = Object.entries(VARIANTS).filter(([n]) => !only || only.split(',').includes(n[0]));
  const lower = (process.env.BASE || '').endsWith('3200');
  await Promise.all(picked.map(async ([name, run], i) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1100, h: 800, pos: { x: (i % 3) * 620, y: lower ? 500 : 0 } });
    try {
      // --cpu=4: Chrome's CPU throttle — a race that needs a slow phone shows itself (RULE AF's low-cost device profile)
      // each page error is printed the MOMENT it happens — a run stopped before its end must not lose the stack
      // --hook: a stand-in React devtools hook records, per commit, the components whose STATE changed (the unmangled build
      // keeps their names) — the last 60 commits are printed when #185 fires, which names the loop
      if (process.argv.includes('--hook')) {
        await page.addInitScript(() => { const log = (window.__commits = []);
          window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, renderers: new Map(), inject() { return 1; }, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, checkDCE() {},
            onCommitFiberRoot(_id, root) { const names = {}; const stack = [root.current]; let n = 0;
              while (stack.length && n++ < 60000) { const f = stack.pop(); if (f.alternate && (f.tag === 0 || f.tag === 11 || f.tag === 15) && f.memoizedState !== f.alternate.memoizedState) { const nm = (f.type && (f.type.displayName || f.type.name)) || (f.type && f.type.render && f.type.render.name) || '?'; names[nm] = (names[nm] || 0) + 1; }
                if (f.sibling) stack.push(f.sibling); if (f.child) stack.push(f.child); }
              log.push(Object.entries(names).map(([k, v]) => k + (v > 1 ? '×' + v : '')).join(',') || '-'); if (log.length > 60) log.shift(); } }; });
        page.on('pageerror', async () => console.log(`${name} LAST COMMITS (state changed): ${await page.evaluate(() => window.__commits.join(' | ')).catch(() => '?')}`));
      }
      // a development server names the looping component in a console error — kept, first 3 only
      let cons = 0; page.on('console', (m) => { if (m.type() === 'error' && cons++ < 3) console.log(`${name} CONSOLE ERROR: ${m.text().slice(0, 1500)}`); });
      // what the canvas frame's ResizeObserver reported last (height, zoom, room width) — growth or a bounce?
      await page.addInitScript(() => { const RO = window.ResizeObserver; window.__roLog = [];
        window.ResizeObserver = class extends RO { constructor(cb) { super((es, o) => { for (const e of es) if (e.target.hasAttribute && e.target.hasAttribute('data-canvas-scale')) { const room = e.target.parentElement && e.target.parentElement.parentElement; window.__roLog.push(`${Math.round((e.borderBoxSize?.[0]?.blockSize ?? 0) * 10) / 10}h z${e.target.getAttribute('data-canvas-scale')} room${room ? room.clientWidth : '?'}`); if (window.__roLog.length > 30) window.__roLog.shift(); } return cb(es, o); }); } }; });
      page.on('pageerror', async () => console.log(`${name} RO LOG before the error: ${await page.evaluate(() => window.__roLog.join(' · ')).catch(() => '?')}`));
      page.on('pageerror', (e) => console.log(`${name} PAGE ERROR at step ${page.__step || '?'}: ${e.message.split('\n')[0]}\n    ${(e.stack || '').split('\n').slice(0, 25).join('\n    ')}`));
      const cpu = +arg('cpu', '1'); if (cpu > 1) await (await page.context().newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: cpu });
      await page.evaluate((s) => localStorage.setItem('educo_box_site_v1', s), site); await page.reload(); await page.waitForTimeout(3000);
      await size(page, 'Tablet'); const before = await cols(page);
      await run(page); const after = await cols(page);
      console.log(`${name} @${process.env.BASE || 'http://localhost:3100'} · typed into ${page.__typedInto ?? 0} blocks\n  before  ${before}\n  after   ${after}${errs.length ? `\n  page errors: ${errs.length} · step ${page.__errDetails[0].step}\n  stack: ${page.__errDetails[0].stack.split('\n').slice(0, 25).join('\n    ')}` : ''}`);
    } catch (e) { console.log(`${name} FAILED ${e.message.slice(0, 200)}`); }
    await browser.close();
  }));
})();
