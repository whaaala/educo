// INSPECTOR PASS — on every catalogue page, blocks are styled through the Inspector as a user would; each change
// must SHOW on the canvas and be IDENTICAL in Preview (the exported HTML).
// usage: node inspectorpass.js [--headed] [--jobs=3] [--only=C2] [--log=inspector.log]
const H = require('./h.js');
const PAGES = require('./catalogue.js');
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const JOBS = +arg('jobs', 3), ONLY = arg('only', ''), LOG = path.join(__dirname, arg('log', 'inspector.log'));
const BASE = (process.env.BASE || 'http://localhost:3100') + '/website/box-demo';
const out = (s) => fs.appendFileSync(LOG, s + '\n');
const hydrated = (page) => page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
const PROPS = ['backgroundColor', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius', 'boxShadow', 'borderTopWidth', 'paddingTop', 'paddingLeft', 'color', 'opacity', 'transform', 'width'];
const styleOf = (page, id) => page.evaluate(({ id, PROPS }) => { const e = document.querySelector(`[data-box-id="${id}"]`); const cs = getComputedStyle(e); return Object.fromEntries(PROPS.map((p) => [p, cs[p]])); }, { id, PROPS });

/** Each change: a name, how a user makes it, and the property it must visibly change. */
const CHANGES = [
  { n: 'style Card', do: (p) => p.getByRole('button', { name: 'Card style' }).first().click(), prop: ['boxShadow', 'backgroundColor', 'borderTopLeftRadius'] },
  { n: 'style Outline', do: (p) => p.getByRole('button', { name: 'Outline style' }).first().click(), prop: ['borderTopWidth', 'boxShadow'] },
  { n: 'style Tinted', do: (p) => p.getByRole('button', { name: 'Tinted style' }).first().click(), prop: ['backgroundColor'] },
  { n: 'style Plain', do: (p) => p.getByRole('button', { name: 'Plain style' }).first().click(), prop: ['backgroundColor', 'boxShadow', 'borderTopWidth'] },
  { n: 'background colour', do: async (p) => { const f = p.getByLabel('Background colour hex value').first(); await f.scrollIntoViewIfNeeded(); await f.fill('#1e3a8a'); await f.press('Enter'); }, prop: ['backgroundColor'] },
  { n: 'text colour', do: async (p) => { const f = p.getByLabel('Text colour hex value').first(); await f.scrollIntoViewIfNeeded(); await f.fill('#fef3c7'); await f.press('Enter'); }, prop: ['color'] },
  { n: 'rounded corners (all)', do: async (p) => { const f = p.getByLabel('Rounded corners').first(); await f.scrollIntoViewIfNeeded(); await f.focus(); for (let i = 0; i < 12; i++) await f.press('ArrowRight'); }, prop: ['borderTopLeftRadius', 'borderBottomRightRadius'] },
  { n: 'rounded corner top-left only', do: async (p) => { const f = p.getByLabel('Rounded corner top-left').first(); await f.scrollIntoViewIfNeeded(); await f.fill('40'); await f.press('Enter'); }, prop: ['borderTopLeftRadius'] },
  { n: 'inner spacing', do: async (p) => { const f = p.getByLabel('Inner spacing').first(); await f.scrollIntoViewIfNeeded(); await f.focus(); for (let i = 0; i < 8; i++) await f.press('ArrowRight'); }, prop: ['paddingTop', 'paddingLeft'] },
  { n: 'border', do: async (p) => { const f = p.getByLabel('Border').first(); await f.scrollIntoViewIfNeeded(); await f.focus(); for (let i = 0; i < 3; i++) await f.press('ArrowRight'); }, prop: ['borderTopWidth'] },
  { n: 'see-through', do: async (p) => { const f = p.getByLabel('See-through').first(); await f.scrollIntoViewIfNeeded(); await f.focus(); for (let i = 0; i < 5; i++) await f.press('ArrowRight'); }, prop: ['opacity', 'backgroundColor'] },
  { n: 'tilt', do: async (p) => { const f = p.getByLabel('Tilt').first(); await f.scrollIntoViewIfNeeded(); await f.focus(); for (let i = 0; i < 4; i++) await f.press('ArrowRight'); }, prop: ['transform'] },
];

async function checkPage(browser, pname) {
  const lines = []; const ctx = await browser.newContext({ viewport: { width: 2200, height: 1100 } }); const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
  try {
    await page.goto(BASE, { waitUntil: 'load' }); await hydrated(page);
    await H.panel(page, true); await PAGES[pname].build(page); await H.panel(page, false); await H.fillImages(page); await H.fillStacks(page);
    const leaves = (await H.leaves(page)).filter((l) => l.w > 40 && l.h > 30);
    const picks = [leaves[0], leaves[Math.floor(leaves.length / 2)], leaves[leaves.length - 1]].filter(Boolean);
    const expected = {}; // id → final canvas style, compared with Preview at the end
    for (const b of picks) {
      const res = [];
      for (const c of CHANGES) {
        try {
          await H.select(page, b.id);
          const before = await styleOf(page, b.id);
          await c.do(page); await page.waitForTimeout(450);
          const after = await styleOf(page, b.id);
          const changed = c.prop.some((pr) => before[pr] !== after[pr]);
          if (!changed) res.push(`${c.n}: NOTHING CHANGED on the canvas (${c.prop.join('/')})`);
        } catch (e) { res.push(`${c.n}: control not usable — ${e.message.split('\n')[0].slice(0, 90)}`); }
      }
      expected[b.id] = await styleOf(page, b.id);
      lines.push(`  block ${b.id.slice(-4)}: ${res.length ? 'FAIL ' + res.join(' | ') : `ok — all ${CHANGES.length} changes showed`}`);
    }
    // PREVIEW: the exported page must carry exactly what the canvas shows.
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe'); await page.waitForTimeout(1500);
    const frame = await (await page.$('iframe')).contentFrame();
    const pv = await frame.evaluate(({ ids, PROPS }) => Object.fromEntries(ids.map((id) => { const e = document.querySelector('.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-')); if (!e) return [id, null]; const cs = getComputedStyle(e); return [id, Object.fromEntries(PROPS.map((p) => [p, cs[p]]))]; })), { ids: Object.keys(expected), PROPS: PROPS.filter((p) => p !== 'width') });
    for (const [id, want] of Object.entries(expected)) {
      if (!pv[id]) { lines.push(`  block ${id.slice(-4)}: FAIL missing from Preview`); continue; }
      const diff = Object.keys(pv[id]).filter((p) => pv[id][p] !== want[p] && !(p === 'boxShadow' && pv[id][p].replace(/\s/g, '') === want[p].replace(/\s/g, '')));
      lines.push(`  block ${id.slice(-4)} canvas vs Preview: ${diff.length ? 'FAIL ' + diff.map((p) => `${p} canvas "${want[p]}" ≠ preview "${pv[id][p]}"`).join(' | ') : 'identical'}`);
    }
    if (errs.length) lines.push(`  page errors: ${[...new Set(errs)].slice(0, 3).join(' / ')}`);
    return `${lines.some((l) => l.includes('FAIL')) ? 'FAIL' : 'ok  '} ${pname}\n${lines.join('\n')}`;
  } catch (e) { return `ERR  ${pname}: ${e.message.split('\n')[0]}\n${lines.join('\n')}`; }
  finally { await ctx.close().catch(() => {}); }
}

(async () => {
  fs.writeFileSync(LOG, '');
  const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const names = Object.keys(PAGES).filter((n) => !ONLY || ONLY.split(',').some((o) => n.startsWith(o)));
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(JOBS, names.length) }, async () => { while (i < names.length) out(await checkPage(browser, names[i++])); }));
  out('DONE'); await browser.close();
})();
