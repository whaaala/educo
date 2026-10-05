// AREA V · RULE MAP step 6 — THE REAL-WORLD PASS (RULE AF: developing countries first). What each surface effect COSTS on a
// low-cost Android phone: 360 × 640 at DPR 2, CPU slowed 6×, Slow 3G (400 ms RTT, 400 kbit/s). Every effect is put on a
// realistic page — six full-height bands of words, cards and a photo — so its cost scales with AREA the way a real page's does,
// and measured against the same page with flat colour (the baseline):
//   first paint (FCP, ms) · scrolling: frames per second and frames over 50 ms during a 3 s scroll · page weight (bytes)
// Served by a real local server so the network throttling applies (Playwright's router would bypass it). HEADED.
// ONE window, on purpose: timing taken beside other windows measures the contention, not the effect.
//   NODE_PATH=node_modules node scripts/uat/r2-realworld.js [--effects=blur-24,grain] [--runs=3]
const fs = require('fs'); const path = require('path'); const http = require('http'); const { chromium } = require('playwright');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const RUNS = +arg('runs', 3);
const OUT = path.join(__dirname, '..', '..', 'docs', 'web-anatomy', 'area-v', 'specimens');
const BRAND = 'oklch(62% .19 260)', ACCENT = 'oklch(72% .17 40)';
const PHOTO = `url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#0e7490"/><stop offset=".5" stop-color="#f59e0b"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs><rect width="400" height="260" fill="url(#g)"/><circle cx="120" cy="90" r="60" fill="#fde68a"/><rect x="220" y="120" width="140" height="110" fill="#1e293b"/></svg>')}')`;
const NOISE = `url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}')`;

// effect → { band: css for each band, card: css for each card, extra: html once } — the band holds a photo + words + 2 cards
const EFFECTS = {
  baseline: { band: `background: ${BRAND};` },
  'gradient linear': { band: `background: linear-gradient(135deg in oklch, ${BRAND}, ${ACCENT});` },
  'gradient mesh (4 layers)': { band: `background: radial-gradient(at 20% 20%, ${ACCENT}, transparent 50%), radial-gradient(at 80% 30%, oklch(70% .2 330), transparent 50%), radial-gradient(at 50% 90%, oklch(75% .15 160), transparent 60%), ${BRAND};` },
  'aurora (blur 2.5rem blobs)': { band: `background: oklch(20% .05 270); position: relative; overflow: hidden;`, inBand: `<div style="position:absolute;width:70%;aspect-ratio:1;border-radius:50%;background:${ACCENT};filter:blur(2.5rem);left:-10%;top:-10%"></div><div style="position:absolute;width:70%;aspect-ratio:1;border-radius:50%;background:${BRAND};filter:blur(2.5rem);right:-15%;bottom:-10%"></div>` },
  'photo + overlay scrim': { band: `background: linear-gradient(transparent, oklch(15% .04 260 / .6)), ${PHOTO} center / cover;` },
  'glass blur 4px': { band: `background: ${PHOTO} center / cover;`, card: 'backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); background: oklch(100% 0 0 / .15);' },
  'glass blur 12px': { band: `background: ${PHOTO} center / cover;`, card: 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: oklch(100% 0 0 / .15);' },
  'glass blur 24px': { band: `background: ${PHOTO} center / cover;`, card: 'backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); background: oklch(100% 0 0 / .15);' },
  'glass blur 24px, sticky header': { band: `background: ${PHOTO} center / cover;`, extra: '<header style="position:sticky;top:0;z-index:5;height:3.5rem;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);background:oklch(100% 0 0 / .2)"></header>' },
  'grain (feTurbulence tile, overlay)': { band: `background: ${NOISE} 0 0 / 8rem, ${BRAND}; background-blend-mode: overlay, normal;` },
  'grain, moving (steps)': { band: `background: ${NOISE} 0 0 / 8rem, ${BRAND}; background-blend-mode: overlay, normal; animation: g .6s steps(4) infinite;` },
  'grain, fixed full-page layer': { band: `background: ${BRAND};`, extra: `<div style="position:fixed;inset:0;pointer-events:none;z-index:9;background:${NOISE} 0 0 / 8rem;opacity:.25;mix-blend-mode:overlay"></div>` },
  'shadows: 3 layers on every card': { band: `background: #eef2f7; color: #0f172a;`, card: 'background:#fff; box-shadow: 0 .125rem .25rem oklch(0% 0 0 / .08), 0 .5rem 1rem oklch(0% 0 0 / .1), 0 1.5rem 3rem oklch(0% 0 0 / .14);' },
  'shadow: glow 2.5rem on every card': { band: `background: oklch(20% .05 270);`, card: 'background: oklch(30% .05 270); box-shadow: 0 0 2.5rem oklch(70% .2 300 / .8);' },
  'svg filter: displace on the photo': { band: `background: ${PHOTO} center / cover; filter: url(#d);`, extra: '<svg width="0" height="0" style="position:absolute"><filter id="d"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="22"/></filter></svg>' },
  // R2-37: the CONTROL — deliberately heavy (a 60px backdrop blur over every whole band, plus a moving full-page grain). If the
  // measure cannot tell THIS from the baseline, it cannot tell anything (the fps-only pass read 144 for every effect)
  'CONTROL: 60px blur on every band + moving grain': { band: `background: ${PHOTO} center / cover; position: relative;`, inBand: '<div style="position:absolute;inset:0;backdrop-filter:blur(60px);-webkit-backdrop-filter:blur(60px)"></div>', extra: `<div style="position:fixed;inset:0;pointer-events:none;z-index:9;background:${NOISE} 0 0 / 8rem;opacity:.3;mix-blend-mode:overlay;animation:g .3s steps(4) infinite"></div>` },
  'clip-path wave edge on every band': { band: `background: ${BRAND}; clip-path: polygon(0 0, 100% 0, 100% 92%, 75% 100%, 50% 92%, 25% 100%, 0 92%);` },
};
const page = (e) => {
  const E = EFFECTS[e];
  const card = (i) => `<div style="border-radius:.75rem;padding:1rem;margin:.75rem 0;${E.card || 'background: oklch(100% 0 0 / .9); color:#0f172a;'}"><h3 style="margin:0 0 .25rem">Card ${i}</h3><p style="margin:0">Term dates, fees and the open day — what a parent opens this page for.</p></div>`;
  const band = (i) => `<section style="min-height:100vh;box-sizing:border-box;padding:2rem 1rem;color:#fff;${E.band}">${E.inBand || ''}<div style="position:relative"><h2 style="margin:0 0 .5rem;font-size:1.6rem">Section ${i}</h2><p style="max-width:34ch;line-height:1.5">Our school welcomes every child. Admissions for the new term are open now.</p>${card(1)}${card(2)}</div></section>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e}</title><style>body{margin:0;font:16px/1.4 system-ui,sans-serif} @keyframes g { to { background-position: 2.3rem 1.7rem, 0 0; } }</style></head><body>${E.extra || ''}${Array.from({ length: 6 }, (_, i) => band(i + 1)).join('')}</body></html>`;
};

(async () => {
  const pages = {}; const want = arg('effects', '') ? arg('effects', '').split(',') : Object.keys(EFFECTS);
  for (const e of want) pages['/' + encodeURIComponent(e)] = page(e);
  const srv = http.createServer((q, r) => { const b = pages[q.url.split('?')[0]]; r.writeHead(b ? 200 : 404, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); r.end(b || ''); }).listen(0);
  const port = srv.address().port;
  // OFF-SCREEN, still headed (the user, 2026-10-03: the honest DPR-2 window covered their screen). Headless was tried and REJECTED:
  // capped at 60 fps and composited without a screen, it showed glass 24px as 60 fps where the real window shows 48. Windows
  // throttles a window it thinks is hidden, so occlusion detection and backgrounding are switched off — checked against the
  // visible run before the numbers are used
  const browser = await chromium.launch({ headless: false, args: ['--window-position=-2600,0', '--disable-features=CalculateNativeWinOcclusion', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--force-device-scale-factor=2', '--disable-gpu', '--disable-gpu-compositing'] }); // R2-37: software drawing (a desktop GPU hides a phone's cost) · R2-38: scale 2 is NEEDED — at 1 the window draws half the phone's pixels (control 0.75 vs 13.68 ms/frame); the big window IS a 720×1280 phone
  const results = [];
  for (const e of want) {
    const runs = [];
    for (let k = 0; k < RUNS; k++) {
      const ctx = await browser.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 12; TECNO KI5k) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0 Mobile Safari/537.36' });
      const pg = await ctx.newPage(); const cdp = await ctx.newCDPSession(pg);
      await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 400 * 1024 / 8, uploadThroughput: 400 * 1024 / 8 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
      let bytes = 0; cdp.on('Network.loadingFinished', (m) => { bytes += m.encodedDataLength; });
      const t0 = Date.now(); await pg.goto(`http://127.0.0.1:${port}/${encodeURIComponent(e)}?r=${k}`, { waitUntil: 'load', timeout: 120000 }); const loadMs = Date.now() - t0;
      const fcp = await pg.evaluate(() => new Promise((res) => { const f = performance.getEntriesByName('first-contentful-paint')[0]; if (f) return res(f.startTime); new PerformanceObserver((l) => res(l.getEntries()[0].startTime)).observe({ type: 'paint', buffered: true }); setTimeout(() => res(null), 8000); }));
      // 3 s of scrolling, the way a thumb scrolls: frame times read from requestAnimationFrame — AND the drawing WORK traced
      // (R2-37: fps alone read 144 everywhere — the monitor's rate; blur / shadow / grain are raster work, not main-thread work)
      await browser.startTracing(pg, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'cc'] });
      const scroll = await pg.evaluate(() => new Promise((res) => { const times = []; let last = performance.now(); const start = last; const step = (now) => { times.push(now - last); last = now; scrollBy(0, 9); if (now - start < 3000) requestAnimationFrame(step); else res(times); }; requestAnimationFrame(step); }));
      const fps = scroll.length / (scroll.reduce((a, b) => a + b, 0) / 1000); const long = scroll.filter((t) => t > 50).length;
      const trace = JSON.parse((await browser.stopTracing()).toString()); const ev = trace.traceEvents || trace;
      const sum = (re) => ev.filter((x) => x.ph === 'X' && re.test(x.name)).reduce((a, x) => a + (x.dur || 0), 0) / 1000;
      const raster = sum(/^(RasterTask|RasterizerTaskImpl::RunOnWorkerThread)$/), paint = sum(/^Paint$/);
      runs.push({ fcp, loadMs, fps, long, bytes, rasterMsPerFrame: raster / scroll.length, paintMsPerFrame: paint / scroll.length });
      await ctx.close();
    }
    const med = (k) => { const v = runs.map((r) => r[k]).filter((x) => x != null).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
    const r = { effect: e, fcp: Math.round(med('fcp')), loadMs: med('loadMs'), fps: +med('fps').toFixed(1), longFrames: med('long'), kb: +(med('bytes') / 1024).toFixed(1), rasterMs: +med('rasterMsPerFrame').toFixed(2), paintMs: +med('paintMsPerFrame').toFixed(2), runs };
    results.push(r); console.log(`${e.padEnd(36)} FCP ${String(r.fcp).padStart(5)} ms · scroll ${String(r.fps).padStart(5)} fps · ${String(r.longFrames).padStart(3)} frames > 50 ms · raster ${r.rasterMs} ms + paint ${r.paintMs} ms per frame · ${r.kb} KB`);
  }
  const base = results.find((r) => r.effect === 'baseline');
  if (base) for (const r of results) { r.fcpVsBase = r.fcp - base.fcp; r.fpsVsBase = +(r.fps - base.fps).toFixed(1); }
  fs.writeFileSync(path.join(OUT, 'realworld.json'), JSON.stringify({ at: new Date().toISOString(), profile: '360×640 DPR 2 · CPU ×6 · Slow 3G 400 ms / 400 kbit/s', browser: browser.version(), runs: RUNS, results }, null, 1));
  await browser.close(); srv.close();
})();
