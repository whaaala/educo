// L-3 L3-p — the probe that STARTS FROM A RELOADED TREE never reproduces it (control, size switches, typing: all equal), the
// page run that BUILDS THE PAGE LIVE does. So: build a dressed page through the UI exactly as uat-pages does (the Dresser,
// RULE Y), NO stress, then every block's computed flex / min-width / share at Mobile → Tablet → Laptop, LIVE; reload; the
// same again; print every block that differs. One page per headed window (RULE Z).
//   NODE_PATH=node_modules BASE=http://localhost:3400 node scripts/uat/probe-l3p-build.js --pages=223,359,332
const fs = require('fs'); const path = require('path'); const H = require('./h.js'); const { Dresser } = require('./dress.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const PLAN = JSON.parse(fs.readFileSync(path.join(__dirname, 'page-plan-99.json'), 'utf8'));
const PRESETS = ['Mobile', 'Tablet', 'Laptop'];
const snap = (page) => page.evaluate(() => {
  const root = document.querySelector('[data-box-id]').getBoundingClientRect(); const out = {};
  for (const e of document.querySelectorAll('[data-box-id]')) {
    const c = getComputedStyle(e), r = e.getBoundingClientRect();
    out[e.dataset.boxId] = `flex ${c.flex} min ${c.minWidth} w${(100 * r.width / root.width).toFixed(1)}%`;
  }
  return out;
});
const at = async (page) => { const o = {}; for (const p of PRESETS) { await page.getByRole('button', { name: new RegExp('^' + p) }).first().click(); await page.waitForTimeout(800); o[p] = await snap(page); } return o; };
// the stored node of an id, without its children — what the tree says about a block that is drawn differently
const node = (page, id) => page.evaluate((id) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1') || '{}'); let hit = null;
  const walk = (n, parent) => { if (!n || typeof n !== 'object' || hit) return; if (n.id === id) { const strip = (x) => { const o = { ...x }; delete o.children; return o; }; hit = { node: strip(n), siblings: (parent?.children || []).map((k) => `${k.id.slice(-3)}:${k.width}${k.widthByHand ? 'h' : ''}${k.hidden ? 'H' : ''}`).join(' ') }; return; }
    for (const v of Object.values(n)) { if (Array.isArray(v)) v.forEach((k) => walk(k, n)); else if (v && typeof v === 'object') walk(v, n); } };
  walk(s, null); return hit; }, id);
async function one(idx, slot) {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900, pos: [(slot % 3) * 500, Math.floor(slot / 3) * 420] });
  page.setDefaultTimeout(10000);
  try {
    await H.panel(page, true);
    await new Dresser(page, PLAN[idx], () => {}).build();
    await H.panel(page, false); await page.waitForTimeout(1500);
    const live = await at(page);
    await page.reload(); await page.waitForTimeout(3000);
    const re = await at(page);
    const lines = [];
    for (const p of PRESETS) for (const [id, l] of Object.entries(live[p])) if (re[p][id] && re[p][id] !== l) lines.push({ p, id, l, r: re[p][id] });
    console.log(`page ${idx}: ${lines.length} differences live → reload${errs.length ? ` · page errors ${errs.length}` : ''}`);
    for (const d of lines.slice(0, 14)) console.log(`  ${d.p} ${d.id.slice(-6)}  LIVE ${d.l}  ·  RELOAD ${d.r}`);
    for (const id of [...new Set(lines.map((d) => d.id))].slice(0, 4)) console.log(`  stored ${id.slice(-6)}: ${JSON.stringify(await node(page, id))}`);
  } catch (e) { console.log(`page ${idx} FAILED at ${page.__step || '?'}: ${e.message.split('\n')[0]}`); }
  finally { await browser.close(); }
}
(async () => { await Promise.all(arg('pages', '223').split(',').map((p, i) => one(+p, i))); })();
