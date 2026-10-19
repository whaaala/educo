// WHAT KIND OF SECTION EACH BAND OF A REAL PAGE IS — and its shape on a desktop and a phone, how it looks, how it moves,
// what it weighs (LE-15: the section gallery is built from this). Answered from the STORED crawl, never a re-crawl
// (RULE R, STORED FIRST): each archived page's own HTML is served for its own URL, so its styles and scripts load as
// they did; `extract.js` measure() takes the bands, section-kind.js names them.
//   node scripts/research/section-kinds.js archive [--jobs=6]          → docs/layout-benchmark/section-kinds.tsv
//   node scripts/research/section-kinds.js list:<awwwards list.json>   → scripts/research/harvest-<list>.tsv: each item followed to
//     its live site, in crawl.js's harvest format — then `node crawl.js --harvest=harvest-<list>.tsv` reads EVERY page type of
//     each site into the archive (the user, 2026-10-19: "all of the pages on the site… not just the home page"), and
//     `archive` mode above reads them like the rest.
//   node scripts/research/section-kinds.js --summary                    → docs/layout-benchmark/SECTION_KINDS.md
// Resumable: a page already in the file is skipped.
const fs = require('fs'); const path = require('path'); const zlib = require('zlib');
const { measure } = require('./extract.js'); const { sectionKind, deepen } = require('./section-kind.js'); const { ratio } = require('./structures.js'); const { states, flow, INIT, pickLink, canvases, transition } = require('./page-states.js');
const HARNESS = 'C:/Users/eyite/educo-uat-harness';
const DIR = path.join(__dirname, '..', '..', 'docs', 'layout-benchmark'); const OUT = path.join(DIR, 'section-kinds.tsv');
const SECTION_MIN_PX = require('../../config/research.json').sectionKinds.thresholds.sectionMinPx;
const COLS = ['source', 'category', 'site', 'page', 'type', 'i', 'n', 'kind', 'h', 'shapeD', 'shapeM', 'words', 'img', 'look', 'motion', 'head'];
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };

/** A band as measure() writes it ("B2 918px: ROW(2: 40/60) full[…]") → the shape a designer names it by. */
function shape(band) {
  const s = band.replace(/^B\d+ \d+px: /, '');
  const row = (t) => { const m = t.match(/^(ROW|WRAP)\(([\d+]+): ([\d/ |]+)\)/); if (!m) return null;
    if (m[1] === 'WRAP') return `wrapping ${m[2]}`;
    const n = +m[2]; return `row of ${n >= 6 ? '6+' : n} (${n >= 6 ? 'many' : ratio(m[3].split('/').map(Number))})`; };
  const top = row(s); if (top) return top;
  if (/^STACK/.test(s)) { const inner = s.match(/(ROW|WRAP)\([\d+]+: [\d/ |]+\)/); return inner ? `stack › ${row(inner[0])}` : 'stack'; }
  return 'single block';
}
const flags = (o) => Object.entries(o || {}).filter(([, v]) => v).map(([k, v]) => `${k}${v > 1 ? `×${v}` : ''}`).join(',');
const kinds = (secs) => { const out = []; secs.forEach((s, i) => out.push(sectionKind(s.feat, i, secs.length, out[i - 1]))); return out; };

function rowsOf(src, cat, site, page, type, d, m) {
  const D = d.sections, M = m.sections; const k = kinds(D);
  return D.map(({ band, feat: f }, i) => [src, cat, site, page, type, i, D.length, k[i], f.h, shape(band), M[i] ? shape(M[i].band) : '',
    f.words, f.img, flags(f.look), flags(f.motion), ((f.heads || [])[0] || '').replace(/\s+/g, ' ')].join('\t'));
}
const CFG = require('../../config/research.json'); const CAP = CFG.capture; const COMP = CFG.components;
// Opened when its HTML is in, then given at most loadWaitMs for the rest — trackers and video keep `load` waiting for nothing.
const open = async (p, url) => { await p.goto(url, { waitUntil: 'domcontentloaded', timeout: CAP.loadTimeoutMs }).catch(() => {}); await p.waitForLoadState('load', { timeout: CAP.loadWaitMs }).catch(() => {}); };
async function measureBoth(p, dir, name) {
  await p.evaluate(`window.__deepen = ${deepen.toString()}; window.__sectionMinPx = ${SECTION_MIN_PX};`);
  await p.setViewportSize({ width: 1440, height: 900 }); await p.waitForTimeout(CAP.waitDesktopMs); const d = await p.evaluate(measure);
  const comps = await p.evaluate(components, COMP).catch(() => ({}));
  // What the page DOES — hover, focus, opening, scroll, reduced motion, its elements (page-states.js, the same pass).
  const st = await states(p, CFG.states).catch((e) => ({ err: e.message.slice(0, 80) }));
  // Canvas and WebGL: kind, frames, moving or not, the shader code, the libraries (page-states.js canvases).
  st.canvas = await canvases(p, CFG.canvas, CFG.libraries, dir, name).catch((e) => ({ err: e.message.slice(0, 80) }));
  await p.setViewportSize({ width: 375, height: 812 }); await p.waitForTimeout(CAP.waitPhoneMs); const m = await p.evaluate(measure);
  return { d, m, comps, st };
}

// EVERYTHING A PAGE LOADS, STORED ONCE (the user, 2026-10-19: "once you do it once, we don't want to do anything… get the
// code, get everything"): each file under <archive>/<site>/assets/, named by its address, listed in the site's manifest —
// so a page, and any component on it, replays later from disk with no internet and no new research.
const EXT = { css: 'css', javascript: 'js', ecmascript: 'js', json: 'json', html: 'html', svg: 'svg', png: 'png', jpeg: 'jpg', jpg: 'jpg', gif: 'gif', webp: 'webp', avif: 'avif', woff2: 'woff2', woff: 'woff', ttf: 'ttf', otf: 'otf', mp4: 'mp4', webm: 'webm', 'x-icon': 'ico' };
function assetFile(url, contentType) {
  const hash = require('crypto').createHash('sha1').update(url).digest('hex').slice(0, 16);
  const byType = Object.keys(EXT).find((k) => (contentType || '').toLowerCase().includes(k));
  const byUrl = (url.split(/[?#]/)[0].match(/\.([a-z0-9]{2,5})$/i) || [])[1];
  return `assets/${hash}.${byType ? EXT[byType] : (byUrl || 'bin').toLowerCase()}`;
}
/** A stored file is never replaced by a later failed fetch of the same address. */
const mergeManifest = (old, add) => { const m = { ...old }; for (const [u, e] of Object.entries(add)) if (!(m[u] && m[u].file)) m[u] = e; return m; };
const keepBody = (type, status, bytes) => type !== 'document' && status >= 200 && status < 300 && !(type === 'media' && bytes > CAP.mediaMaxMB * 1024 * 1024);

/** Runs IN the page: every component of every kind in config (CP-n reads this index), with its HTML, place and size. */
function components(cfg) {
  const out = {};
  for (const [kind, sel] of Object.entries(cfg.selectors)) {
    let els = []; try { els = [...document.querySelectorAll(sel)]; } catch { continue; }
    els = els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
    els = els.filter((e) => !els.some((o) => o !== e && o.contains(e)));
    if (!els.length) continue;
    out[kind] = { count: els.length, items: els.slice(0, cfg.perPage).map((e) => { const r = e.getBoundingClientRect();
      return { top: Math.round(r.top + scrollY), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), tag: e.tagName.toLowerCase(),
        cls: (e.getAttribute('class') || '').slice(0, 120), text: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 160), html: e.outerHTML.slice(0, cfg.htmlMaxChars) }; }) };
  }
  return out;
}

async function run(mode) {
  const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
  if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, COLS.join('\t') + '\n');
  const done = new Set(fs.readFileSync(OUT, 'utf8').split('\n').slice(1).map((l) => l.split('\t')).map((c) => `${c[2]}|${c[3]}`));
  const meta = new Map(fs.readFileSync(path.join(DIR, 'pages.tsv'), 'utf8').replace(/\r/g, '').split('\n').slice(1).map((l) => l.split('\t')).map((c) => [`${c[2]}|${c[3]}`, c]));
  let items; let HARVEST;
  if (mode === 'archive') {
    // One item per SITE: one worker reads all its pages, so the site's files are fetched and stored once.
    items = [];
    for (const site of fs.readdirSync(`${HARNESS}/archive`)) {
      const pages = fs.readdirSync(`${HARNESS}/archive/${site}`).filter((f) => f.endsWith('.html.gz')).map((f) => f.replace(/\.html\.gz$/, ''))
        .filter((page) => !done.has(`${site}|${page}`) && fs.existsSync(`${HARNESS}/sites/${site}/${page}.anatomy.json`));
      if (pages.length) items.push({ site, pages });
    }
  } else {
    HARVEST = path.join(__dirname, `harvest-${path.basename(mode.slice(5)).replace(/\.list\.json$|\.json$/, '')}.tsv`);
    const have = new Set(fs.existsSync(HARVEST) ? fs.readFileSync(HARVEST, 'utf8').split('\n').map((l) => l.split('\t')[1]) : []);
    items = JSON.parse(fs.readFileSync(mode.slice(5), 'utf8')).filter((u) => !have.has(u)).map((aw) => ({ aw }));
  }
  if (arg('limit')) items = items.slice(0, +arg('limit'));
  console.log(mode, 'to read:', items.length, mode === 'archive' ? `sites, ${items.reduce((n, s) => n + s.pages.length, 0)} pages` : 'items');
  // Headless: the same engine lays a page out the same at the same size; the archive is served from disk (the user, 2026-10-19).
  const b = await chromium.launch({ headless: !process.argv.includes('--headed'), channel: 'chrome' });
  const JOBS = +arg('jobs', CAP.jobs); let n = 0; const t0 = Date.now();
  await Promise.all(Array.from({ length: JOBS }, async () => {
    while (items.length) {
      const it = items.shift(); const ctx = await b.newContext(); const p = await ctx.newPage();
      try {
        if (it.aw) {
          await p.goto(it.aw, { waitUntil: 'domcontentloaded', timeout: 40000 }); await p.waitForTimeout(2000);
          // The item's own "Visit site" (as aw-measure.js follows it), else its site page's.
          const visit = () => p.evaluate(() => { const v = [...document.querySelectorAll('a[href]')].find((a) => /visit (site|website|resource)/i.test(a.innerText || '') && !a.href.includes(location.hostname)); return v ? v.href : null; });
          let site = await visit();
          if (!site) { const sp = await p.evaluate(() => (document.querySelector('a[href*="/sites/"]') || {}).href || null); if (sp) { await p.goto(sp, { waitUntil: 'domcontentloaded', timeout: 40000 }); await p.waitForTimeout(1500); site = await visit(); } }
          // category · the Awwwards page · the live site · award — crawl.js's harvest format; an item with no live site is kept, empty
          fs.appendFileSync(HARVEST, ['layout', it.aw, site || '', ''].join('\t') + '\n');
          if (!site) console.log('no live site', it.aw);
          continue;
        }
        const adir = `${HARNESS}/archive/${it.site}`; const mfile = `${adir}/assets/manifest.json`; fs.mkdirSync(`${adir}/assets`, { recursive: true });
        let manifest = fs.existsSync(mfile) ? JSON.parse(fs.readFileSync(mfile, 'utf8')) : {}; let fresh = {}; const pending = [];
        const sdir = `${HARNESS}/sites/${it.site}`; fs.mkdirSync(`${sdir}/media`, { recursive: true });
        // Canvas kinds, shader code and View Transitions are caught as each page makes them (page-states.js INIT).
        await ctx.addInitScript(INIT, CFG.canvas);
        // EVERY archived page of the site is served from disk, so a link clicked in a transition lands on a stored page.
        const norm = (u) => u.replace(/[#?].*$/, '').replace(/\/$/, '');
        const byUrl = new Map(it.pages.map((pg) => { try { return [norm(JSON.parse(fs.readFileSync(`${sdir}/${pg}.anatomy.json`, 'utf8')).url), pg]; } catch { return null; } }).filter(Boolean));
        let live = false; // true while one page is loaded LIVE (a dead snapshot canvas, LE15-21)
        const serve = (c) => c.route((url) => !live && byUrl.has(norm(url.href)), (r) => r.request().resourceType() === 'document'
          ? r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: zlib.gunzipSync(fs.readFileSync(`${adir}/${byUrl.get(norm(r.request().url()))}.html.gz`)).toString('utf8') })
          : r.continue());
        await serve(ctx);
        ctx.on('response', (r) => pending.push((async () => {
          const u = r.url(); const type = r.request().resourceType();
          if (!/^https?:/.test(u) || type === 'document' || !CAP.types.includes(type) || (manifest[u] && manifest[u].file) || (fresh[u] && fresh[u].file)) return;
          const ct = r.headers()['content-type'] || ''; let body = null; try { body = await r.body(); } catch {}
          const bytes = body ? body.length : +(r.headers()['content-length'] || 0); const e = { type, status: r.status(), bytes, file: '' };
          if (body && keepBody(type, r.status(), bytes)) { e.file = assetFile(u, ct); fs.writeFileSync(`${adir}/${e.file}`, body); }
          fresh[u] = e;
        })().catch(() => {})));
        for (const page of it.pages) {
          try {
            const an = JSON.parse(fs.readFileSync(`${HARNESS}/sites/${it.site}/${page}.anatomy.json`, 'utf8'));
            await open(p, an.url);
            const c = meta.get(`${it.site}|${page}`) || [];
            // A copy that sends itself elsewhere as it loads has no body to measure (LE15-14: every page of one site) — that page live.
            let d, m, comps, st;
            try { await p.waitForSelector('body', { state: 'attached', timeout: 10000 }); ({ d, m, comps, st } = await measureBoth(p, sdir, page)); }
            catch (e) { console.log('ARCHIVE FAILED', it.site, page, e.message.slice(0, 60), '→ live'); live = true; try { await open(p, an.url); await p.waitForTimeout(3000); ({ d, m, comps, st } = await measureBoth(p, sdir, page)); } finally { live = false; } }
            // The archive is trusted only where it renders what the live crawl measured (LE15-7: 39 of 40 pages within one
            // band; a site that builds itself with a script loader drew 1 of its 3) — otherwise THAT page is measured live.
            const txt = `${HARNESS}/sites/${it.site}/${page}.txt`;
            const stored = fs.existsSync(txt) ? (fs.readFileSync(txt, 'utf8').split('## T')[0].match(/^B\d+ /gm) || []).length : d.bands.length;
            if (Math.abs(stored - d.bands.length) > 1) { live = true; try { await open(p, an.url); await p.waitForTimeout(3000); ({ d, m, comps, st } = await measureBoth(p, sdir, page)); } finally { live = false; } console.log('LIVE', it.site, page, `(stored ${stored} bands, the archive drew a different count → live ${d.bands.length})`); }
            // A canvas the archive holds only as a dead SNAPSHOT (no drawing context — the page drew it before it was saved)
            // is recorded LIVE: 11moissanstoit.com's WebGL map gave nothing from the archive, webgl2 + 5 shaders live (LE15-21).
            if (st && st.canvas && (st.canvas.canvases || []).some((c) => !c.t)) {
              live = true; await p.setViewportSize({ width: 1440, height: 900 }); await open(p, an.url); await p.waitForTimeout(3000);
              const lv = await canvases(p, CFG.canvas, CFG.libraries, sdir, `${page}-live`).catch((e) => ({ err: e.message.slice(0, 80) }));
              live = false; st.canvas = { ...lv, live: true, archived: st.canvas };
            }
            const rows = rowsOf(c[0] || '', c[1] || '', it.site, page, an.type || c[4] || '', d, m);
            // Each component's section: the last section that starts above it.
            const tops = d.sections.map((s) => s.feat.top);
            for (const k of Object.values(comps)) for (const x of k.items) x.section = tops.reduce((a, t, i) => (t <= x.top + 1 ? i : a), 0);
            fs.writeFileSync(`${HARNESS}/sites/${it.site}/${page}.components.json`, JSON.stringify({ url: an.url, type: an.type, components: comps }));
            fs.writeFileSync(`${HARNESS}/sites/${it.site}/${page}.states.json`, JSON.stringify({ url: an.url, type: an.type, ...st }));
            // The site's FLOW from its home page: menu and footer → the pages the crawl found, by type.
            const idx = `${HARNESS}/sites/${it.site}/index.json`;
            if (an.type === 'home' && fs.existsSync(idx)) fs.writeFileSync(`${HARNESS}/sites/${it.site}/flow.json`, JSON.stringify(await flow(p, JSON.parse(fs.readFileSync(idx, 'utf8')).pages || []).catch((e) => ({ err: e.message.slice(0, 80) }))));
            if (an.type === 'home') {
              // The TRANSITION between pages, live, from the home page's menu (page-states.js transition).
              await p.setViewportSize({ width: 1440, height: 900 }); await open(p, an.url);
              const tr = await transition(p, an.url, new Set(byUrl.keys()), CFG.transitions, sdir, page).catch((e) => ({ err: e.message.slice(0, 80) }));
              fs.writeFileSync(`${sdir}/transition.json`, JSON.stringify(tr));
              // A VIDEO of the site: the intro, a scroll to the bottom, a page transition.
              const V = CFG.video; const vctx = await b.newContext({ viewport: { width: V.width, height: V.height }, recordVideo: { dir: `${sdir}/media`, size: { width: V.width, height: V.height } } });
              try {
                await serve(vctx); const vp = await vctx.newPage(); await open(vp, an.url); await vp.waitForTimeout(V.introWaitMs);
                for (let k = 0; k < V.scrollSteps; k++) { await vp.mouse.wheel(0, V.height * 0.8); await vp.waitForTimeout(V.scrollWaitMs); }
                await vp.evaluate(() => window.scrollTo(0, 0)); await vp.waitForTimeout(V.scrollWaitMs);
                const links = await vp.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.href, inNav: !!a.closest('header, nav, [role=navigation]') })));
                const go = pickLink(links, an.url, new Set(byUrl.keys()));
                if (go) { await vp.evaluate((h) => { const a = [...document.querySelectorAll('a[href]')].find((x) => x.href === h); if (a) a.click(); }, go); await vp.waitForTimeout(V.afterClickMs); }
                const video = vp.video(); await vctx.close(); if (video) fs.renameSync(await video.path(), `${sdir}/media/home.webm`);
              } catch (e) { console.log('VIDEO', it.site, e.message.slice(0, 60)); await vctx.close().catch(() => {}); }
            }
            if (rows.length) fs.appendFileSync(OUT, rows.join('\n') + '\n');
            await Promise.all(pending.splice(0)); manifest = mergeManifest(manifest, fresh); fresh = {}; fs.writeFileSync(mfile, JSON.stringify(manifest));
            const files = Object.values(manifest).filter((e) => e.file).length;
            console.log(++n, `${Math.round((Date.now() - t0) / 1000)}s`, it.site, page, rows.length, 'sections', Object.keys(comps).length, 'component kinds', (st.targets || []).length, 'tried', files, 'files stored');
          } catch (e) { console.log('ERR', it.site, page, e.message.slice(0, 80)); }
        }
      } catch (e) { console.log('ERR', it.site || it.aw, e.message.slice(0, 80)); }
      await ctx.close().catch(() => {});
    }
  }));
  await b.close();
  console.log('DONE', n, 'pages in', Math.round((Date.now() - t0) / 1000), 's');
}

function summary() {
  const rows = fs.readFileSync(OUT, 'utf8').replace(/\r/g, '').trim().split('\n').slice(1).map((l) => l.split('\t')).filter((c) => c[7] !== 'no-site');
  const pct = (a, b) => `${((a / (b || 1)) * 100).toFixed(1)} %`; const top = (m, k) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, k);
  const inc = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  const pages = new Map(); for (const c of rows) { const k = `${c[2]}|${c[3]}`; if (!pages.has(k)) pages.set(k, { type: c[4], kinds: [] }); pages.get(k).kinds[+c[5]] = c[7]; }
  const by = new Map(); for (const c of rows) { if (!by.has(c[7])) by.set(c[7], []); by.get(c[7]).push(c); }
  const lines = [`# What kind of section each band of a real page is — and how real sites build, dress and move it`, '',
    `Generated by \`scripts/research/section-kinds.js --summary\` from \`section-kinds.tsv\`: **${rows.length} bands** of **${pages.size} pages**`,
    `(the stored crawl — Awwwards, Webflow, Framer — read from its archived HTML, and the Awwwards "layout" collection read live).`,
    `Kinds are named by \`section-kind.js\` from each band's class, headings and contents (words in \`config/research.json\`).`,
    `Shapes: desktop 1440 → phone 375. Look / motion: the share of that kind's bands with it.`, '',
    '## The kinds', '', '| Kind | Bands | Share | On pages | Median height | Top shapes (desktop → its usual phone shape) | Look | Motion |', '|---|---|---|---|---|---|---|---|'];
  for (const [kind, cs] of [...by.entries()].sort((a, b) => b[1].length - a[1].length)) {
    const shapes = new Map(); const phone = new Map(); const look = new Map(); const motion = new Map();
    for (const c of cs) { inc(shapes, c[9]); const pk = `${c[9]}|${c[10]}`; inc(phone, pk); for (const f of c[13].split(',').filter(Boolean)) inc(look, f.replace(/×\d+/, '')); for (const f of c[14].split(',').filter(Boolean)) inc(motion, f.replace(/×\d+/, '')); }
    const hs = cs.map((c) => +c[8]).sort((a, b) => a - b);
    const onPages = new Set(cs.map((c) => `${c[2]}|${c[3]}`)).size;
    const shp = top(shapes, 5).map(([s, n]) => { const ph = top(new Map([...phone.entries()].filter(([k]) => k.startsWith(s + '|')).map(([k, v]) => [k.split('|')[1], v])), 1)[0]; return `${s} ${pct(n, cs.length)}${ph ? ` → ${ph[0]}` : ''}`; }).join(' · ');
    lines.push(`| ${kind} | ${cs.length} | ${pct(cs.length, rows.length)} | ${pct(onPages, pages.size)} | ${hs[hs.length >> 1]}px | ${shp} | ${top(look, 5).map(([f, n]) => `${f} ${pct(n, cs.length)}`).join(' · ')} | ${top(motion, 5).map(([f, n]) => `${f} ${pct(n, cs.length)}`).join(' · ')} |`);
  }
  lines.push('', '## Each page type, in order — its most common sequences of kinds (repeats of a kind folded)', '');
  const types = new Map(); for (const pg of pages.values()) { if (!types.has(pg.type)) types.set(pg.type, []); types.get(pg.type).push(pg.kinds.filter(Boolean).filter((k, i, a) => k !== a[i - 1])); }
  for (const [type, seqs] of [...types.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 20)) {
    const has = new Map(); for (const s of seqs) for (const k of new Set(s)) inc(has, k);
    const sq = new Map(); for (const s of seqs) inc(sq, s.join(' → '));
    lines.push(`### ${type} (${seqs.length} pages)`, '', `Kinds it holds: ${top(has, 14).map(([k, n]) => `${k} ${pct(n, seqs.length)}`).join(' · ')}`, '',
      ...top(sq, 5).map(([s, n]) => `- ${n} × ${s}`), '');
  }
  fs.writeFileSync(path.join(DIR, 'SECTION_KINDS.md'), lines.join('\n') + '\n');
  console.log(rows.length, 'bands ·', pages.size, 'pages ·', by.size, 'kinds');
}

module.exports = { shape, assetFile, mergeManifest, keepBody };
if (require.main === module) {
  if (process.argv.includes('--summary')) summary();
  else run(process.argv.slice(2).find((a) => !a.startsWith('--')) || 'archive').catch((e) => { console.error(e); process.exit(1); });
}
