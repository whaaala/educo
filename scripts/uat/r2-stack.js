// AREA V · RULE MAP step 3b — ACROSS FAMILIES, HEADED. Random blocks with every family stacked (r2-axes.js STACK), each
// rendered whole and once WITHOUT each ingredient it uses. An ingredient whose removal changes nothing visible was hidden or
// broken by the others: a CLASH (a gap or a bug). Also: every declaration valid, every block painted.
//   NODE_PATH=node_modules node scripts/uat/r2-stack.js [--n=40] [--seed=1]
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const { stacks, page } = require('./r2-axes.js'); const { diffRatio, VISIBLE, setDecoder, stableShot, invalidIn } = require('./r2-combos.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const N = +arg('n', 40), SEED = +arg('seed', 1);
const OUT = path.join(__dirname, '..', '..', 'docs', 'web-anatomy', 'area-v', 'specimens');

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1'] });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 }); setDecoder(await browser.newPage());
  const all = stacks(N, SEED);
  // one page: each block whole, then its ablations — the sheet a person can open, the same picture the proof measures
  const demos = all.flatMap((s) => [{ id: s.id, css: s.css, html: s.html, labels: s.labels }, ...s.without.map((w) => ({ id: `${s.id} without ${w.part}`, css: w.css, html: w.html }))]);
  const html = page('AREA V · across families', demos); fs.writeFileSync(path.join(OUT, 'stack.html'), html);
  await pg.setContent(html, { waitUntil: 'load' }); await pg.waitForTimeout(800);
  const invalid = await invalidIn(pg, '[data-demo], [data-demo] [style]'); // R2-15: a -webkit- fallback beside its standard form is allowed
  // R2-18: compare in ONE place. Tiles at different positions on the sheet differ by sub-pixel anti-aliasing (photo, patterns),
  // which read as "removing the shadow changed something" — an ablation measured 0.00% alone was not flagged on the sheet.
  const one = page('one stage', [{ id: 'probe', css: '', html: '' }]);
  const shot = {};
  await pg.setContent(one, { waitUntil: 'load' }); const stage = await pg.$('[data-demo]');
  for (const d of demos) {
    await stage.evaluate((e, d) => { e.setAttribute('style', d.css); e.innerHTML = d.html || ''; }, d);
    shot[d.id] = (await stableShot(stage)).toString('base64'); /* R2-17: after its textures decode */
  }
  const clashes = {}; const lines = [];
  for (const s of all) for (const w of s.without) {
    const d = await diffRatio(shot[s.id], shot[`${s.id} without ${w.part}`]);
    if (d < VISIBLE) { (clashes[w.part] = clashes[w.part] || []).push({ id: s.id, labels: s.labels, d }); lines.push(`CLASH ${s.id}: removing "${w.part}" changes ${(d * 100).toFixed(2)}% — ${Object.entries(s.labels).map(([a, v]) => `${a}: ${v}`).join(', ')}`); }
  }
  const tests = all.reduce((n, s) => n + s.without.length, 0);
  console.log(`across families: ${N} stacked blocks, ${tests} ablations · invalid declarations ${invalid.length} · clashes ${lines.length}`);
  for (const [part, cs] of Object.entries(clashes)) console.log(`  ${part}: hidden in ${cs.length} block(s)`);
  for (const l of lines.slice(0, 30)) console.log('  ' + l.slice(0, 330));
  for (const x of invalid.slice(0, 6)) console.log('  INVALID ' + x);
  await pg.screenshot({ path: path.join(OUT, 'stack.png'), fullPage: true });
  fs.writeFileSync(path.join(OUT, 'stack-proof.json'), JSON.stringify({ at: new Date().toISOString(), n: N, seed: SEED, ablations: tests, invalid, clashes }, null, 1));
  await browser.close();
})();
