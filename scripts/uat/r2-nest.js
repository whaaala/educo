// AREA V · RULE MAP step 3c — EVERY LEVEL, NESTED, CASCADING BOTH WAYS, HEADED. Random trees section → card → button → text
// (r2-axes.js NEST). Proves: every declaration valid; DOWN — where the text inherits, its colour is the nearest level's that
// set one and its font the section's; UP — every ingredient at every level, removed in ONE stage, changes what you see (if
// not, a parent swallowed it: a clash).
//   NODE_PATH=node_modules node scripts/uat/r2-nest.js [--n=40] [--seed=1]
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const { nests, page } = require('./r2-axes.js'); const { diffRatio, VISIBLE, setDecoder, stableShot, invalidIn } = require('./r2-combos.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const N = +arg('n', 40), SEED = +arg('seed', 1);
const OUT = path.join(__dirname, '..', '..', 'docs', 'web-anatomy', 'area-v', 'specimens');
const rgb = (hex) => `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`;

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1'] });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 }); setDecoder(await browser.newPage());
  const all = nests(N, SEED);
  const demos = all.flatMap((s) => [{ id: s.id, css: s.css, html: s.html, labels: s.labels }, ...s.without.map((w) => ({ id: `${s.id} without ${w.part}`, css: w.css, html: w.html }))]);
  const sheet = page('AREA V · every level, nested', demos); fs.writeFileSync(path.join(OUT, 'nest.html'), sheet);
  await pg.setContent(sheet, { waitUntil: 'load' }); await pg.waitForTimeout(800);
  const invalid = await invalidIn(pg, '[data-demo], [data-demo] [style]');
  await pg.screenshot({ path: path.join(OUT, 'nest.png'), fullPage: true });
  // DOWN — the cascade, read from the computed style of each tree's text
  const down = [];
  for (const s of all) {
    const got = await pg.evaluate((id) => { const t = document.querySelector(`[data-id="${id}"] [data-level="text"]`); const c = getComputedStyle(t); return { color: c.color, font: c.fontFamily }; }, s.id);
    if (s.expect.color && got.color !== rgb(s.expect.color)) down.push(`${s.id}: text colour ${got.color}, expected ${s.expect.color} from the ${s.expect.from}`);
    if (got.font.replace(/"/g, '') !== s.expect.font.replace(/"/g, '')) down.push(`${s.id}: text font ${got.font}, expected the section's ${s.expect.font}`);
  }
  // UP — ablations in ONE stage (R2-18), stable shots (R2-17)
  await pg.setContent(page('one stage', [{ id: 'probe', css: '', html: '' }]), { waitUntil: 'load' }); const stage = await pg.$('[data-demo]');
  const shot = {};
  for (const d of demos) { await stage.evaluate((e, d) => { e.setAttribute('style', d.css); e.innerHTML = d.html || ''; }, d); shot[d.id] = (await stableShot(stage)).toString('base64'); }
  const clashes = {}; const lines = [];
  for (const s of all) for (const w of s.without) {
    const d = await diffRatio(shot[s.id], shot[`${s.id} without ${w.part}`]);
    if (d < VISIBLE && w.noop) { (clashes['expected no-op'] = clashes['expected no-op'] || []).push(`${s.id}: ${w.noop}`); continue; }
    if (d < VISIBLE) { (clashes[w.part] = clashes[w.part] || []).push(s.id); lines.push(`CLASH ${s.id}: removing "${w.part}" changes ${(d * 100).toFixed(2)}% — ${Object.entries(s.labels).map(([a, v]) => `${a}: ${v}`).join(', ')}`); }
  }
  const ablations = all.reduce((n, s) => n + s.without.length, 0);
  const levels = all.map((s) => ['section', s.pick['card.present'] && 'card', s.pick['button.present'] && 'button', 'text'].filter(Boolean).join(' → '));
  console.log(`every level, nested: ${N} trees (${[...new Set(levels)].map((l) => `${l} ×${levels.filter((x) => x === l).length}`).join(' · ')}) · ${ablations} ablations · invalid ${invalid.length} · cascade-down failures ${down.length} · clashes ${lines.length}`);
  for (const [part, ids] of Object.entries(clashes)) console.log(`  ${part}: hidden in ${ids.length}`);
  for (const l of [...down, ...lines].slice(0, 30)) console.log('  ' + l.slice(0, 340));
  for (const x of invalid.slice(0, 6)) console.log('  INVALID ' + x);
  fs.writeFileSync(path.join(OUT, 'nest-proof.json'), JSON.stringify({ at: new Date().toISOString(), n: N, seed: SEED, ablations, invalid, down, clashes }, null, 1));
  await browser.close();
})();
