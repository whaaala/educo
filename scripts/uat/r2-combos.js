// AREA V · RULE MAP steps 2 + 3, HEADED. Writes the specimen sheets (one example per value, `r2-axes.js`) to
// docs/web-anatomy/area-v/specimens/<family>.html, then proves in a real browser:
//   · every declaration of every example and combination is VALID here (`CSS.supports`)
//   · every one PAINTS (its picture differs from an empty stage)
//   · per axis, which values look the SAME (expected only where an axis changes notation, not look)
//   · N random combinations per family: valid, painted, and how many are visually distinct
//   NODE_PATH=node_modules node scripts/uat/r2-combos.js [--n=60] [--seed=1] [--families=colour,shadow]
const fs = require('fs'); const path = require('path'); const crypto = require('crypto'); const { chromium } = require('playwright');
const { FAMILIES, specimens, combos, page } = require('./r2-axes.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const N = +arg('n', 60), SEED = +arg('seed', 1); const FAMS = arg('families', Object.keys(FAMILIES).join(',')).split(',');
const OUT = path.join(__dirname, '..', '..', 'docs', 'web-anatomy', 'area-v', 'specimens'); fs.mkdirSync(OUT, { recursive: true });

async function check(pg, html) {
  await pg.setContent(html, { waitUntil: 'load' }); await pg.waitForTimeout(400);
  // every declaration of every stage AND every element inside it, valid in THIS browser (R2-15)
  const invalid = await invalidIn(pg, '[data-demo], [data-demo] [style]');
  const blank = crypto.createHash('md5').update(await pg.evaluate(() => { const s = document.createElement('div'); s.className = 'stage'; s.id = 'blank'; document.body.prepend(s); return ''; }) + await (await pg.$('#blank')).screenshot()).digest('hex');
  await pg.evaluate(() => document.getElementById('blank').remove());
  const shots = [];
  for (const el of await pg.$$('[data-demo]')) {
    await el.scrollIntoViewIfNeeded(); const id = await el.getAttribute('data-id');
    const png = await stableShot(el); // R2-17: not before its textures / photo have decoded
    // R2-5: "it differs from an empty stage" passed a sheet of blank white bands. PAINTED now = the picture holds at least
    // two colours (sampled), so a demo that drew nothing over its fill reads as not painted.
    const colours = await decoder.evaluate(async (b64) => { const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(8, 8, Math.max(1, c.width - 16), Math.max(1, c.height - 16)).data; /* the INSIDE only: the stage's outline and rounded corners gave a blank stage a second colour */ const s = new Set(); for (let i = 0; i < d.length; i += 4) s.add(`${d[i] >> 2},${d[i + 1] >> 2},${d[i + 2] >> 2}`); /* EVERY pixel: one in 97 missed thin letters and 1px lines (R2-8) */ return s.size; }, png.toString('base64'));
    // MOTION: an animated demo must show two different frames 600 ms apart (a frozen screenshot cannot tell)
    const animated = await el.evaluate((e) => /animation/.test((e.getAttribute('style') || '') + e.innerHTML));
    let moved = null;
    // three frames: an `alternate` animation is at the SAME point at t and t + period/2 mirrored, so two frames can match
    if (animated) { const f = []; for (const wait of [0, 250, 600]) { await pg.waitForTimeout(wait); f.push(await el.screenshot()); } moved = !f[0].equals(f[1]) || !f[1].equals(f[2]) || !f[0].equals(f[2]); }
    shots.push({ id, h: crypto.createHash('md5').update(png).digest('hex'), colours, moved, b64: png.toString('base64') });
  }
  return { invalid, blankHash: blank, shots };
}
let decoder;
// R2-13: VISIBLY different (RULE T), not "a different hash" — a one-pixel difference passed the layers that never showed.
// The share of pixels whose colour moved by more than 8 (of 255 — a soft shadow moves many pixels a little; identical renders here are pixel-identical) on any channel; ≥ 1.5% counts as a different picture.
const VISIBLE = 0.006; // 0.6% (~230 px of a stage): 1.5% hid a 2px vs 8px shadow offset a designer sees at once
async function diffRatio(a, b) {
  return decoder.evaluate(async ([a, b]) => {
    const px = async (s) => { const im = new Image(); im.src = 'data:image/png;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
    const [p, q] = [await px(a), await px(b)]; if (p.length !== q.length) return 1;
    let d = 0; for (let i = 0; i < p.length; i += 4) if (Math.abs(p[i] - q[i]) > 8 || Math.abs(p[i + 1] - q[i + 1]) > 8 || Math.abs(p[i + 2] - q[i + 2]) > 8) d++;
    return d / (p.length / 4);
  }, [a, b]);
}
/** Groups of shots that LOOK the same: each joins the first earlier group it is within VISIBLE of. */
async function lookAlike(shots) {
  const groups = [];
  for (const s of shots) { let home = null; for (const g of groups) if (await diffRatio(g[0].b64, s.b64) < VISIBLE) { home = g; break; } if (home) home.push(s); else groups.push([s]); }
  return groups;
}

if (require.main === module) (async () => {
  const browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1'] });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  decoder = await browser.newPage();
  const report = [];
  for (const fam of FAMS) {
    // ── step 2: the specimen sheet, one example per value ──
    const sp = specimens(fam); const sheet = page(`AREA V specimens · ${fam}`, sp);
    fs.writeFileSync(path.join(OUT, `${fam}.html`), sheet);
    const a = await check(pg, sheet);
    await pg.screenshot({ path: path.join(OUT, `${fam}.png`), fullPage: true });
    const isPainted = (s) => s.h !== a.blankHash && (fam === 'colour' || s.colours >= 2); const painted = a.shots.filter(isPainted).length; const spNoop = (id) => (sp.find((x) => x.id === id) || {}).noop; const notPainted = a.shots.filter((s) => !isPainted(s) && !spNoop(s.id)).map((s) => s.id); const still = a.shots.filter((s) => s.moved === false).map((s) => s.id);
    // per axis: values whose pictures are identical (the others held at their first value)
    const sameByAxis = {};
    for (const [axis] of Object.entries(FAMILIES[fam].axes)) {
      const of = a.shots.filter((s) => s.id.startsWith(`${fam}.${axis}.`));
      const dup = (await lookAlike(of)).filter((g) => g.length > 1); if (dup.length) sameByAxis[axis] = dup.map((g) => g.map((s) => s.id.split('.').slice(2).join('.')).join(' = '));
    }
    // ── step 3: random combinations across every axis ──
    const cs = combos(fam, N, SEED); const proof = page(`AREA V combinations · ${fam}`, cs);
    fs.writeFileSync(path.join(OUT, `${fam}.combos.html`), proof);
    const b = await check(pg, proof);
    const cIsPainted = (s) => s.h !== b.blankHash && (fam === 'colour' || s.colours >= 2); const cPainted = b.shots.filter(cIsPainted).length; const noopOf = (id) => (cs.find((c) => c.id === id) || {}).noop; const cNoops = cs.filter((c) => c.noop).map((c) => `${c.id}: ${c.noop}`); const cNotPainted = b.shots.filter((s) => !cIsPainted(s) && !noopOf(s.id)).map((s) => s.id); const cStill = b.shots.filter((s) => s.moved === false && !(cs.find((c) => c.id === s.id) || {}).noop).map((s) => s.id); const distinct = (await lookAlike(b.shots)).length; /* VISIBLY distinct (R2-13), not distinct hashes */
    const values = Object.values(FAMILIES[fam].axes).reduce((n, vs) => n + Object.keys(vs).length, 0);
    const space = Object.values(FAMILIES[fam].axes).reduce((n, vs) => n * Object.keys(vs).length, 1);
    const line = { fam, axes: Object.keys(FAMILIES[fam].axes).length, values, combinationSpace: space, specimens: sp.length, specimenInvalid: a.invalid, specimenPainted: `${painted}/${sp.length}`, notPainted, animatedStill: still, comboAnimatedStill: cStill, comboNotPainted: cNotPainted, expectedNoops: cNoops, sameByAxis, combos: N, comboInvalid: b.invalid, comboPainted: `${cPainted}/${N}`, comboDistinct: `${distinct}/${N}` };
    report.push(line);
    console.log(`${fam}: ${line.axes} axes · ${values} values · ${space.toLocaleString()} combinations possible · specimens painted ${line.specimenPainted}, invalid ${a.invalid.length} · combos painted ${line.comboPainted}, distinct ${line.comboDistinct}, invalid ${b.invalid.length}`);
    for (const x of [...a.invalid, ...b.invalid].slice(0, 6)) console.log(`   INVALID ${x}`);
    if (notPainted.length || cNotPainted.length) console.log(`   NOT PAINTED ${[...notPainted, ...cNotPainted.map((id) => id + ' {' + Object.entries(cs.find((c) => c.id === id).labels).map(([a, v]) => a + ': ' + v).join(', ') + '}')].join(' | ')}`);
    if (still.length || cStill.length) console.log(`   ANIMATED BUT STILL ${[...still, ...cStill.map((id) => id + ' {' + Object.entries(cs.find((c) => c.id === id).labels).map(([k, v]) => k + ': ' + v).join(', ') + '}')].join(' | ')}`);
    if (cNoops.length) console.log(`   expected no-ops (by nature — the builder should steer away): ${cNoops.join(' | ')}`);
    console.log(`   motion: ${a.shots.filter((s) => s.moved).length + b.shots.filter((s) => s.moved).length} animated demos moved`);
    for (const [ax, d] of Object.entries(sameByAxis)) console.log(`   ${(FAMILIES[fam].sameByDesign || []).includes(ax) ? 'same look BY DESIGN' : 'SAME LOOK (a finding)'} on axis ${ax}: ${d.join(' | ')}`);
  }
  fs.writeFileSync(path.join(OUT, 'proof.json'), JSON.stringify({ at: new Date().toISOString(), seed: SEED, n: N, browser: browser.version(), report }, null, 1));
  await browser.close();
})();

/** R2-17: a data-URI texture / photo decodes ASYNCHRONOUSLY — a shot taken before it finished differs from a finished one.
 *  Retake until two consecutive shots match. */
async function stableShot(el, opts = { animations: 'disabled' }) { let prev = await el.screenshot(opts); for (let k = 0; k < 8; k++) { await new Promise((r) => setTimeout(r, 120)); const next = await el.screenshot(opts); if (next.equals(prev)) return next; prev = next; } return prev; }
/** R2-15: EVERY element's inline declarations (the per-family check read only the stage's own), a `-webkit-` fallback
 *  accepted where its standard form is in the same style and supported. */
const invalidIn = (pg, sel) => pg.evaluate((sel) => [...document.querySelectorAll(sel)].flatMap((e) => { const st = e.getAttribute('style') || ''; return st.split(/;(?![^(]*\))/).map((d) => { const i = d.indexOf(':'); if (i < 0) return null; const k = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if (!k || !v || CSS.supports(k, v)) return null; if (k.startsWith('-webkit-') && CSS.supports(k.slice(8), v) && st.includes(k.slice(8) + ':')) return null; return `${(e.closest('[data-demo]') || e).dataset.id} → ${k}: ${v.slice(0, 70)}`; }).filter(Boolean); }), sel);
module.exports = { diffRatio, lookAlike, VISIBLE, setDecoder: (d) => { decoder = d; }, stableShot, invalidIn };
