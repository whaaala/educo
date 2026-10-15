// BATCH A-1 · U5 (device half) — the export the headed pass downloaded THROUGH THE UI (scripts/uat/a1-out/sites), served from
// this machine and opened in the phone emulator (emulator-5556) by Playwright's Android driver, in its Chrome (the same Blink
// engine as the app's WebView). Checks what a parent's phone does: no sideways scroll, the photo copy its screen needs,
// a far photo waits for the scroll, and the Yoruba / Twi letters drawn in the chosen typeface.
//   node scripts/uat/uat-a1-headed.js   (first — it makes the sites)   then   node scripts/uat/uat-a1-emulator.js
const http = require('http'); const fs = require('fs'); const path = require('path'); const zlib = require('zlib');
const { chromium } = require('playwright'); const { execFileSync } = require('child_process');
const ADB = path.join(process.env.LOCALAPPDATA || '', 'Android/Sdk/platform-tools/adb.exe');
const SITES = path.join(__dirname, 'a1-out', 'sites');
const results = []; const ok = (n, c, s) => { results.push(!!c); console.log(`${c ? 'PASS' : 'FAIL'}  ${n}${s !== undefined ? ' — ' + JSON.stringify(s) : ''}`); };
const served = [];
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]); served.push(url); const f = path.join(SITES, url);
  if (!f.startsWith(SITES) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  const ext = path.extname(f); const t = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp' }[ext] || 'application/octet-stream';
  const body = fs.readFileSync(f); const h = { 'content-type': t, 'cache-control': 'no-store' };
  if (/html|css/.test(t)) { h['content-encoding'] = 'gzip'; res.writeHead(200, h); return res.end(zlib.gzipSync(body)); }
  res.writeHead(200, h); res.end(body);
}).listen(3501, '0.0.0.0');
const HOST = 'http://10.0.2.2:3501'; // the emulator's name for this machine

(async () => {
  // Chrome's own DevTools socket, forwarded (the emulator's Chrome opens it; Playwright's Android launcher waited forever)
  execFileSync(ADB, ['-s', 'emulator-5556', 'shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'about:blank', 'com.android.chrome']);
  execFileSync(ADB, ['-s', 'emulator-5556', 'forward', 'tcp:9333', 'localabstract:chrome_devtools_remote']);
  const browser = await chromium.connectOverCDP('http://localhost:9333'); const ctx = browser.contexts()[0]; const page = ctx.pages()[0] || await ctx.newPage();
  console.log('device emulator-5556', await page.evaluate(() => navigator.userAgent));
  const page2 = fs.readdirSync(path.join(SITES, 'site-a')).find((n) => n.endsWith('.html') && n !== 'index.html');
  for (const [site, file] of [['site-a', 'index.html'], ['site-a', page2], ['site-c', 'index.html']]) {
    served.length = 0;
    await page.goto(`${HOST}/${site}/${file}`, { waitUntil: 'load' }); await page.waitForTimeout(1500);
    const before = served.filter((u) => u.includes('/images/'));
    const m = await page.evaluate(async () => {
      await document.fonts.ready;
      const far = [...document.images].filter((i) => i.getBoundingClientRect().top > innerHeight + 3000).length;
      return { w: innerWidth, dpr: devicePixelRatio, overflow: document.documentElement.scrollWidth - innerWidth, far };
    });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
    await page.waitForTimeout(1500);
    const imgs = await page.evaluate(() => [...document.images].map((i) => { const need = i.getBoundingClientRect().width * devicePixelRatio; const c = (i.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(' ')).filter((s) => s[0]).map(([f, w]) => ({ f, w: parseInt(w, 10) })).sort((a, b) => a.w - b.w);
      const want = c.length ? (c.find((x) => x.w >= need) || c[c.length - 1]).f.split('/').pop() : null; const got = (i.currentSrc || i.src).split('/').pop(); return { need: Math.round(need), want, got, loaded: i.complete && i.naturalWidth > 0 }; }));
    const tag = `${site}/${file} on the phone (${m.w}px @${m.dpr}×)`;
    ok(`U5 ${tag}: no sideways scroll`, m.overflow <= 1, m.overflow);
    ok(`U5 ${tag}: every photo loads, and each is the copy the screen needs`, imgs.length > 0 && imgs.every((i) => i.loaded && (!i.want || i.got === i.want)), imgs);
    if (m.far) ok(`U5 ${tag}: a photo far down is not fetched before the scroll`, before.length === 0, before);
    if (site === 'site-a' && file === 'index.html') {
      const g = await page.evaluate(() => { const c = document.createElement('canvas').getContext('2d'); const w = (f, t) => { c.font = f; return c.measureText(t).width; };
        return Object.fromEntries(['ẹ', 'ọ', 'ṣ', 'ɛ', 'ɔ'].map((x) => [x, Math.abs(w('40px "Noto Serif", serif', x.repeat(8)) - w('40px "Noto Serif", monospace', x.repeat(8))) < 0.5])); });
      ok(`U5 ${tag}: Yoruba ẹ ọ ṣ and Twi ɛ ɔ are drawn in the chosen Noto Serif`, Object.values(g).every(Boolean), g);
      ok(`U5 ${tag}: it fetched the Latin, Latin-ext and Vietnamese font files and nothing from Google`, served.some((u) => /fonts\//.test(u)) && !served.some((u) => /google/.test(u)), served.filter((u) => /fonts\//.test(u)).length);
    }
    await page.screenshot({ path: path.join(__dirname, 'a1-out', `emu-${site}-${file}.png`) });
  }
  await browser.close(); server.close();
  console.log(`\nU5 device: ${results.filter(Boolean).length} / ${results.length} passed`);
  process.exit(results.every(Boolean) ? 0 : 1);
})().catch((e) => { console.error(e); server.close(); process.exit(2); });
