// HEADED UAT — WHOLE REAL PAGES. Each page chosen by page-cover.js (the fewest crawled pages that contain every nesting
// combination real sites use, 80 → 95 → 99%) is BUILT THROUGH THE UI (build-page.js), given real words and photos, then:
//   1. the CANVAS at every device preset (Mobile · Tablet · Laptop · Desktop · Wide · Full width): holes, overflow, collapse
//   2. the PAGE CHECK (semantics the builder must auto-correct)
//   3. the real PREVIEW at every size a visitor has: the five rungs, all 60 devices of the Preview's own menu, tablets
//      turned sideways, and both sides of every breakpoint — layout, typography, hierarchy, contrast (page-audit.js)
//   4. at the five rungs: canvas == Preview (within the accepted 0.6%, #41), 150% text, a full-page screenshot
//   5. units in the exported CSS (rule 16) and the semantics of the exported HTML
//   NODE_PATH=node_modules node scripts/uat/uat-pages.js [--tier=80] [--from=0] [--count=N] [--jobs=6] [--only=site] [--pages=21,139]
const fs = require('fs'); const path = require('path');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
// --plan=dressed: the all-pairs plan of DRESSED pages (page-plan.js → dress.js); --plan=dressed95 / dressed99 / dressedinnovative:
// the dressed plans of the wider tiers (page-plan-<tier>.json); otherwise the bare crawl cover (page-cover.js)
const PLAN = arg('plan', ''); const DRESSED = PLAN.startsWith('dressed'); const PLAN_SUFFIX = DRESSED ? PLAN.slice(7) : '';
const OUTDIR = path.join(__dirname, DRESSED ? `dressed${PLAN_SUFFIX}-out` : 'pages-out'); fs.mkdirSync(OUTDIR, { recursive: true });
const COVER = DRESSED
  ? JSON.parse(fs.readFileSync(path.join(__dirname, PLAN_SUFFIX ? `page-plan-${PLAN_SUFFIX}.json` : 'page-plan.json'), 'utf8')).map((r) => ({ ...r, tier: 0, site: `${r.type}·${r.header}·${r.hamburger ? 'burger' : 'links'}·${r.sidebar}·${r.hero}·${r.theme}`, page: r.source }))
  : JSON.parse(fs.readFileSync(path.join(__dirname, 'page-cover.json'), 'utf8'));
const TIER = +arg('tier', 80), FROM = +arg('from', 0), JOBS = +arg('jobs', 6);
let LIST = COVER.map((p, i) => ({ ...p, idx: i })).filter((p) => DRESSED || p.tier <= TIER);
if (arg('only', '')) LIST = LIST.filter((p) => p.site.includes(arg('only', '')));
if (arg('pages', '')) LIST = LIST.filter((p) => arg('pages', '').split(',').includes(String(p.idx))); // --pages=21,139: re-run the pages a fix touched
LIST = LIST.slice(FROM, arg('count', '') ? FROM + +arg('count', '') : undefined);

const EDITOR_H = 720; // the editor window the page is built and measured in
const RUNGS = [{ w: 375, preset: 'Mobile (375px)' }, { w: 768, preset: 'Tablet (768px)' }, { w: 1024, preset: 'Laptop (1024px)' }, { w: 1280, preset: 'Desktop (1280px)' }, { w: 1920, preset: 'Wide (1920px)' }];
const PRESETS = [...RUNGS.map((r) => r.preset), 'Full width'];
function devices() {
  const src = fs.readFileSync(path.join(__dirname, '..', '..', 'lib', 'preview-devices.ts'), 'utf8');
  const out = []; const re = /label: "([^"]+)", w: (\d+), h: (\d+)/g; let m;
  while ((m = re.exec(src))) { out.push({ name: m[1], w: +m[2], h: +m[3] }); if (/iPad|Tab|Pad|Fold 6 — open|Fold — open/.test(m[1]) && +m[2] < +m[3]) out.push({ name: m[1] + ' (landscape)', w: +m[3], h: +m[2] }); }
  for (const b of [600, 900, 1200, 1800]) for (const d of [-1, 0, 1]) out.push({ name: `breakpoint ${b}${d < 0 ? '−1' : d > 0 ? '+1' : ''}`, w: b + d, h: 900 });
  const seen = new Set(); return out.filter((d) => { const k = d.w; if (seen.has(k) && !/breakpoint/.test(d.name)) return false; seen.add(k); return true; });
}
const PARAS = [
  'Our pupils learn in small classes where every teacher knows every child by name, and families are welcomed into school life from the very first week.',
  'Term dates, uniform, clubs and trips are all here in one place, kept up to date by the office so you never have to hunt for a letter again.',
  'Science, art and sport sit side by side in a timetable built around curiosity: a morning in the lab, an afternoon on the field, and time to read every day.',
];

if (!process.argv.includes('--one')) {
  const { spawn } = require('child_process'); const queue = [...LIST]; let running = 0; const t0 = Date.now(); const done = [];
  console.log(`HEADED UAT — ${LIST.length} real pages (${DRESSED ? `plan ${PLAN}` : `tier ≤ ${TIER}%`}), ${devices().length} Preview sizes each, ${JOBS} windows at a time`);
  const next = (slot) => {
    if (!queue.length) { if (!running) report(); return; }
    const p = queue.shift(); running++;
    const c = spawn(process.execPath, [__filename, '--one', `--idx=${p.idx}`, `--slot=${slot}`, ...(DRESSED ? [`--plan=${PLAN}`] : [])], { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
    let buf = ''; c.stdout.on('data', (d) => { buf += d; }); c.stderr.on('data', (d) => { buf += d; });
    c.on('exit', () => { running--; done.push(p.idx); const last = buf.trim().split('\n').pop(); console.log(`[${done.length}/${LIST.length}] ${p.site}/${p.page}: ${last}`); next(slot); });
  };
  const report = () => {
    const all = LIST.map((p) => { try { return JSON.parse(fs.readFileSync(path.join(OUTDIR, `page-${p.idx}.json`), 'utf8')); } catch { return { idx: p.idx, site: p.site, page: p.page, crashed: true, findings: [] }; } });
    const by = {}; for (const r of all) for (const f of r.findings || []) { const k = f.kind === 'err' ? f.msg.replace(/\d+(\.\d+)?/g, '#').replace(/\([^)]*\)/g, '').trim() : null; if (!k) continue; (by[k] = by[k] || []).push(`${r.site}/${r.page} @${f.where}`); }
    console.log(`\n${all.length} pages in ${Math.round((Date.now() - t0) / 60000)} min · ${all.filter((r) => r.crashed || r.buildError).length} could not be built`);
    console.log('FINDINGS (errors), grouped:');
    Object.entries(by).sort((a, b) => b[1].length - a[1].length).forEach(([k, v]) => console.log(`  ${String(v.length).padStart(4)}× ${k}\n        e.g. ${[...new Set(v)].slice(0, 3).join(' · ')}`));
    // PLACEHOLDERS, NAMED (RULE C / RULE E): the components these pages stood in for with existing blocks — recorded in
    // docs/COMPONENT_GAPS.md — so a missing component is never mistaken for a layout bug, and never silently skipped.
    const ph = {}; for (const r of all) for (const p of r.placeholders || []) (ph[p] = ph[p] || []).push(r.idx);
    if (Object.keys(ph).length) { console.log('PLACEHOLDERS (components not built yet — docs/COMPONENT_GAPS.md), pages that used each:');
      Object.entries(ph).sort((a, b) => b[1].length - a[1].length).forEach(([k, v]) => console.log(`  ${String(v.length).padStart(4)}× ${k}`)); }
    // GAPS, NAMED (RULE E): what a real page asked for that could not be built as asked — reported, never skipped in silence.
    const gaps = all.flatMap((r) => (r.gaps || []).map((g) => `${g}   (page ${r.idx})`));
    const asked = all.reduce((n, r) => n + (r.widerToSize || 0), 0), back = all.reduce((n, r) => n + (r.cameBack || 0), 0);
    if (asked || back) console.log(`SIZING: ${asked} rows were laid out at a wider screen size (they did not fit one line in the editor's window) · ${back} times an edge was brought back because the neighbour had dropped a line`);
    if (gaps.length) { console.log(`GAPS (${gaps.length}) — asked for by a real page and not built as asked:`); gaps.slice(0, 40).forEach((g) => console.log(`   ${g}`)); }
    fs.writeFileSync(path.join(OUTDIR, `summary-tier${TIER}.json`), JSON.stringify({ pages: all.map((r) => ({ idx: r.idx, site: r.site, page: r.page, ok: !(r.findings || []).some((f) => f.kind === 'err') && !r.buildError && !r.crashed, buildError: r.buildError, secs: r.secs, placeholders: r.placeholders })), grouped: by, placeholders: ph }, null, 1));
  };
  for (let s = 0; s < Math.min(JOBS, LIST.length); s++) next(s);
  return;
}

// ── ONE PAGE ──
const H = require('./h.js'); const G = require('./layout-grammar.js'); const { Builder } = require('./build-page.js'); const { Dresser } = require('./dress.js');
const { auditDoc, pixelFindings, canvasAudit } = require('./page-audit.js');
const idx = +arg('idx', 0), slot = +arg('slot', 0); const PG = COVER[idx];
const R = { idx, site: PG.site, page: PG.page, type: PG.type, tier: PG.tier, layout: PG.layout, recipe: DRESSED ? { type: PG.type, header: PG.header, hamburger: PG.hamburger, sidebar: PG.sidebar, hero: PG.hero, theme: PG.theme, source: PG.source } : undefined, findings: [], shots: [] };
const find = (kind, where, msg) => R.findings.push({ kind, where, msg });
const save = () => fs.writeFileSync(path.join(OUTDIR, `page-${idx}.json`), JSON.stringify(R, null, 1));
const shot = async (page, name) => { const f = `p${idx}-${name}.png`; await page.screenshot({ path: path.join(OUTDIR, f), fullPage: false }); R.shots.push(f); };

/** Real words in every "New text" block, typed the way a person edits: click into it, select all, type. */
async function typeWords(page) {
  let n = 0;
  for (let k = 0; k < 30; k++) {
    const loc = page.locator('[data-box-id] :text-is("New text — click to edit.")').first();
    if (!(await loc.count())) break;
    await loc.scrollIntoViewIfNeeded(); await loc.dblclick(); await page.waitForTimeout(250);
    await page.keyboard.press('Control+A'); await page.keyboard.type(PARAS[n % PARAS.length], { delay: 0 });
    await page.keyboard.press('Escape'); await page.waitForTimeout(200); n++;
    if (await page.locator('[data-box-id] :text-is("New text — click to edit.")').count() >= 30 - k) break; // editing did nothing — stop
  }
  return n;
}
const canvasGeo = (page) => page.evaluate(() => {
  const root = document.querySelector('[data-box-id]'); const rr = root.getBoundingClientRect(); const Z = root.currentCSSZoom || 1;
  return Object.fromEntries(Array.from(document.querySelectorAll('[data-box-id]')).slice(1).map((e) => { const r = e.getBoundingClientRect();
    const empty = !!e.querySelector('[data-ph]') || e.hasAttribute('data-ph') || Array.from(e.querySelectorAll('button')).some((b) => /^\s*Upload\s*$/.test(b.textContent || ''));
    // A block measured against the SCREEN (a full-screen hero: `100svh`) is as tall as the window it is drawn in — the
    // editor's 720 and the Preview's 900 differ by design, not by a bug, so its height (and its children's) is not compared.
    const vh = !!e.closest('[style*="svh"], [style*="vh"]') || !!e.querySelector('[style*="svh"], [style*="vh"]'); // …or the band around one, which is as tall as it
    return [e.getAttribute('data-box-id').replace(/[^A-Za-z0-9_-]/g, '-'), { l: ((r.left - rr.left) / rr.width) * 100, w: (r.width / rr.width) * 100, h: r.height / Z, empty, vh }]; }));
});

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: EDITOR_H, pos: [(slot % 3) * 500, Math.floor(slot / 3) * 420] });
  const t0 = Date.now();
  page.setDefaultTimeout(10000); // a step that cannot happen fails in 10s, not 30s × every later step
  try {
    // ── BUILD, through the UI ──
    await H.panel(page, true);
    if (DRESSED) {
      const d = new Dresser(page, PG, (s) => { R.log = (R.log || []).concat(s); save(); });
      try { await d.build(); } catch (e) { R.buildError = e.message.split('\n')[0]; await shot(page, 'build-fail'); }
      R.placeholders = [...d.placeholders]; R.sectionsBuilt = d.sections; R.secs = d.sections.length;
    } else {
      const secs = G.parsePage(PG.layout); R.secs = secs.length;
      const b = new Builder(page);
      try { await b.page_(secs); } catch (e) { R.buildError = e.message.split('\n')[0]; await shot(page, 'build-fail'); }
    }
    await H.panel(page, false);
    R.images = await H.fillImages(page); R.words = await typeWords(page);
    R.missedDrags = page.__missedDrags || 0; R.heroRetries = page.__heroRetries || 0; R.cameBack = page.__cameBack || 0; R.widerToSize = page.__widerToSize || 0; R.gaps = page.__gaps || [];
    R.blocks = await page.evaluate(() => document.querySelectorAll('[data-box-id]').length); R.buildSecs = Math.round((Date.now() - t0) / 1000);
    // The tree the UI produced — kept to READ when diagnosing (never loaded back to test anything: RULE Y).
    fs.writeFileSync(path.join(OUTDIR, `page-${idx}.tree.txt`), await H.tree(page));
    save();
    // A page that did not finish building is not audited: its findings would describe half a page. The build error
    // (and its screenshot) is the result.
    if (R.buildError) throw new Error('not audited: the build did not finish');
    // ── 1 · the canvas at every preset ──
    const canvas = {};
    for (const p of PRESETS) {
      await page.getByRole('button', { name: p }).first().click(); await page.waitForTimeout(700);
      for (const m of await canvasAudit(page)) find('err', `canvas ${p}`, m);
      canvas[p] = await canvasGeo(page);
      await page.evaluate(() => window.scrollTo(0, 0)); await shot(page, `canvas-${p.replace(/\W+/g, '')}`);
    }
    // ── 2 · the Page check ──
    const pc = page.getByRole('button', { name: /Page check/ }).first();
    const pcText = (await pc.textContent().catch(() => '')) || ''; const pcN = +(pcText.match(/\d+/)?.[0] ?? 0);
    if (pcN) find('warn', 'page check', `${pcN} things need the user's words (expected: empty text/pictures)`);
    // ── 3–5 · the real Preview ──
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500);
    await page.keyboard.press('h'); await page.waitForTimeout(400); // the bar floats over the page — step it aside
    const frameAt = async (w, h) => {
      await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(450);
      let f = await (await page.$('iframe')).contentFrame();
      const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: w + (w - inner), height: h }); await page.waitForTimeout(350); f = await (await page.$('iframe')).contentFrame(); }
      return f;
    };
    const html = await (await page.$('iframe')).getAttribute('srcdoc') || '';
    const px = pixelFindings(html); if (px.length) find('err', 'export CSS', `U16 ${px.length} pixel lengths — ${px.slice(0, 6).map(([k, n]) => `${k}×${n}`).join(', ')}`);
    let first = true; const sizes = devices(); R.sizes = sizes.length;
    // AT THE RUNGS THE PREVIEW WINDOW IS AS TALL AS THE EDITOR's. A block measured against the SCREEN — a sticky sidebar is 100dvh, and
    // the row beside it stretches to match — is 720 in a 720 window and 900 in a 900 one: by design, and reported as canvas≠Preview on
    // every block of the row (tier 99, idx 141). Same window, same answer; a real difference still shows.
    for (const d of [...RUNGS.map((r) => ({ name: r.preset, w: r.w, h: EDITOR_H, rung: r })), ...sizes]) {
      const f = await frameAt(d.w, Math.min(d.h, 1400));
      const a = await f.evaluate(auditDoc, { semantics: first, rowBands: true }); first = false;
      a.err.forEach((m) => find('err', `Preview ${d.name}`, m)); a.warn.forEach((m) => find('warn', `Preview ${d.name}`, m));
      if (d.rung) {
        // canvas == Preview at this rung, within the accepted 0.6% (#41) and 4px of text rounding
        const cg = canvas[d.rung.preset]; const drift = [];
        for (const [id, g] of Object.entries(a.geo)) { const c = cg[id]; if (!c) continue;
          if (Math.abs(c.l - g.l) > H.PREVIEW_SHARE_TOL || Math.abs(c.w - g.w) > H.PREVIEW_SHARE_TOL || (!c.empty && !c.vh && !g.vh && Math.abs(c.h - g.h) > Math.max(H.PREVIEW_HEIGHT_TOL, c.h * H.PREVIEW_SHARE_TOL / 100))) drift.push( /* a 3,000px column may differ by the accepted 0.6% (#41), as widths may */`${id.slice(-4)} ${c.w.toFixed(1)}%×${Math.round(c.h)} vs ${g.w.toFixed(1)}%×${Math.round(g.h)}`); }
        if (drift.length) find('err', `Preview ${d.name}`, `R11 canvas≠Preview on ${drift.length} blocks (${drift.slice(0, 12).join('; ')})`);
        // a full-page picture of what a visitor sees
        await page.setViewportSize({ width: d.w + 20, height: Math.min(6000, Math.max(900, a.height)) }); await page.waitForTimeout(400);
        await shot(page, `preview-${d.w}`);
        // WCAG 1.4.4 — the reader's text at 150%
        const f2 = await frameAt(d.w, 900);
        await f2.evaluate(() => { document.documentElement.style.fontSize = '150%'; }); await page.waitForTimeout(300);
        const big = await f2.evaluate(auditDoc, { semantics: false, rowBands: true });
        big.err.filter((m) => /^L[1-7]/.test(m)).forEach((m) => find('err', `Preview ${d.name} at 150% text`, m));
        const grew = Object.keys(big.geo).filter((id) => a.geo[id] && big.geo[id].h > a.geo[id].h + 1).length;
        if (Object.keys(a.geo).length && !grew) find('err', `Preview ${d.name} at 150% text`, 'W144 nothing grew with the reader\'s text size');
        await f2.evaluate(() => { document.documentElement.style.fontSize = ''; });
      }
    }
  } catch (e) { R.crash = e.message.split('\n')[0]; await shot(page, 'crash').catch(() => {}); }
  if (errs.length) find('err', 'console', `page errors: ${[...new Set(errs)].slice(0, 3).join(' / ')}`);
  R.secsTotal = Math.round((Date.now() - t0) / 1000); save(); await browser.close();
  const e = R.findings.filter((f) => f.kind === 'err');
  console.log(`${R.buildError ? 'BUILD FAILED ' + R.buildError + ' · ' : ''}${R.crash ? 'CRASH ' + R.crash + ' · ' : ''}${e.length} errors, ${R.findings.length - e.length} warnings · ${R.blocks} blocks, ${R.sizes} Preview sizes, ${R.secsTotal}s`);
})();
