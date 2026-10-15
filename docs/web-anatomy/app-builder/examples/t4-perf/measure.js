// T4 — measure exported Educo pages (and the editor) on a cheap Android profile: 360×640, DPR 2, Android Chrome UA,
// network throttled through CDP Network.emulateNetworkConditions, CPU through Emulation.setCPUThrottlingRate.
// Usage: NODE_PATH=node_modules node measure.js <sitesDir> <outJson> [editorUrl]
// Serves <sitesDir> with gzip (what any static host / CDN does) on port 3501, cache disabled, one fresh context per run.
const http = require('http'); const fs = require('fs'); const path = require('path'); const zlib = require('zlib');
const { chromium } = require('playwright');
const [,, sitesDir, outJson, editorUrl] = process.argv;
const PROFILES = {
  // Chrome DevTools presets (front_end/core/sdk/NetworkManager.ts): Slow 3G = 500 kbps × 0.8, RTT 400 × 5 ms;
  // "3G" (was Fast 3G) = 1.6 Mbps × 0.9 down, 750 kbps × 0.9 up, RTT 150 × 3.75 ms.
  'slow3g': { latency: 2000, down: 500 * 1000 / 8 * 0.8, up: 500 * 1000 / 8 * 0.8 },
  '3g': { latency: 562.5, down: 1.6 * 1000 * 1000 / 8 * 0.9, up: 750 * 1000 / 8 * 0.9 },
  // Lighthouse mobile (simulated) — 150 ms RTT, 1.6 Mbps down, 750 kbps up.
  'lh4g': { latency: 150, down: 1638.4 * 1000 / 8, up: 750 * 1000 / 8 },
};
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const f = path.join(sitesDir, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(path.resolve(sitesDir)) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  const ext = path.extname(f); const body = fs.readFileSync(f);
  const text = /html|css|javascript/.test(TYPES[ext] || '');
  const h = { 'content-type': TYPES[ext] || 'application/octet-stream', 'cache-control': 'no-store' };
  if (text && /gzip/.test(req.headers['accept-encoding'] || '')) { h['content-encoding'] = 'gzip'; res.writeHead(200, h); return res.end(zlib.gzipSync(body, { level: 9 })); }
  res.writeHead(200, h); res.end(body);
}).listen(3501);

async function run(browser, url, prof, cpu) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; TECNO KG5k) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__lcp = 0; window.__lt = 0; window.__ltN = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__lt += Math.max(0, e.duration - 50); window.__ltN++; } }).observe({ type: 'longtask', buffered: true });
  });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  const p = PROFILES[prof];
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: p.latency, downloadThroughput: p.down, uploadThroughput: p.up });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  const reqs = new Map(); const byType = {}; let n = 0;
  cdp.on('Network.responseReceived', (e) => { if (!e.response.url.startsWith('data:')) reqs.set(e.requestId, e.type); }); // data: URIs are already counted inside the file that carries them
  cdp.on('Network.loadingFinished', (e) => { if (!reqs.has(e.requestId)) return; const t = reqs.get(e.requestId); byType[t] = (byType[t] || 0) + e.encodedDataLength; n++; });
  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'load', timeout: 300000 });
  const loadWall = Date.now() - t0;
  await page.waitForTimeout(editorUrl && url === editorUrl ? 8000 : 2500);
  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return { fcp: fcp ? Math.round(fcp.startTime) : null, lcp: Math.round(window.__lcp), dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd),
      tbt: Math.round(window.__lt), longTasks: window.__ltN, docW: document.documentElement.scrollWidth };
  });
  await ctx.close();
  const kb = (b) => Math.round(b / 102.4) / 10;
  return { url, prof, cpu, requests: n, totalKB: kb(Object.values(byType).reduce((a, b) => a + b, 0)), byTypeKB: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, kb(v)])), loadWall, ...m };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const sites = fs.readdirSync(sitesDir).filter((d) => fs.statSync(path.join(sitesDir, d)).isDirectory());
  const jobs = [];
  for (const s of sites) for (const [prof, cpu] of [['slow3g', 4], ['slow3g', 6], ['3g', 4], ['lh4g', 4]]) jobs.push([`http://localhost:3501/${s}/index.html`, prof, cpu]);
  if (editorUrl) for (const [prof, cpu] of [['slow3g', 4], ['3g', 4], ['lh4g', 4]]) jobs.push([editorUrl, prof, cpu]);
  const out = [];
  // CONC at a time (default 1): the CPU is shared across contexts, so sequential keeps the 4x/6x throttle honest
  const C = +(process.env.CONC || 1);
  for (let i = 0; i < jobs.length; i += C) {
    const r = await Promise.all(jobs.slice(i, i + C).map((j) => run(browser, ...j).catch((e) => ({ url: j[0], prof: j[1], cpu: j[2], error: String(e).slice(0, 200) }))));
    for (const x of r) { console.log(JSON.stringify(x)); out.push(x); }
  }
  fs.writeFileSync(outJson, JSON.stringify(out, null, 1));
  await browser.close(); server.close();
})();
