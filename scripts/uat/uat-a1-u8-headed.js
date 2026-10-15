// BATCH A-1 · HEADED UAT U8 — change (6): an accordion item's picture uploaded with the new button (A1-10), resized (A1-12's
// helper), shown on the canvas and in the Preview, downloaded as a file under images/ with its srcset (A1-13), and taken back
// by Undo. Built THROUGH THE UI (RULE Y); the served download swept at every screen of screens.js (RULE Z).
//   node scripts/uat/uat-a1-u8-headed.js          (a fresh `next start` on BASE, default :3100)
const fs = require('fs'); const path = require('path'); const http = require('http'); const zlib = require('zlib');
const { chromium } = require('playwright'); const { unzipSync } = require('fflate'); const sharp = require('sharp');
const H = require('./h.js'); const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'a1-out', 'u8'); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, c, s) => { res.push(!!c); console.log(`${c ? 'PASS' : 'FAIL'}  ${n}${s !== undefined ? ' — ' + JSON.stringify(s) : ''}`); };

(async () => {
  const raw = Buffer.alloc(2400 * 1600 * 3); for (let i = 0; i < raw.length; i++) raw[i] = 90 + Math.random() * 120;
  const photo = path.join(OUT, 'pta.jpg'); await sharp(raw, { raw: { width: 2400, height: 1600, channels: 3 } }).jpeg({ quality: 85 }).toFile(photo);
  const { browser, page, errs } = await H.open({ headed: true, w: 1280, h: 900 });
  await H.panel(page, true); await H.clickTile(page, 'Accordion'); await H.panel(page, false);
  await page.getByRole('tab', { name: 'Content' }).click(); await page.waitForTimeout(400);
  const btn = page.getByRole('button', { name: 'Upload item 1 picture' });
  ok('U8 the Content tab offers "Upload item 1 picture" beside the URL field', await btn.isVisible());
  const [chooser] = await Promise.all([page.waitForEvent('filechooser'), btn.click()]); // a REAL click on the button a person sees
  await chooser.setFiles(photo); await page.waitForTimeout(2500);
  ok('U8 the button now says "Replace item 1 picture"', await page.getByRole('button', { name: 'Replace item 1 picture' }).isVisible());
  const field = page.getByLabel('Item 1 image', { exact: true });
  ok('U8 (A1-14) the URL field says "Uploaded picture — or paste a URL" instead of showing the picture as text', (await field.inputValue()) === '' && (await field.getAttribute('placeholder')) === 'Uploaded picture — or paste a URL', await field.getAttribute('placeholder'));
  const stored = await page.evaluate(async () => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1') || '{}'); let m;
    const walk = (n) => { if (n.component === 'accordion') m = n.items?.[0]?.media; (n.children || []).forEach(walk); }; s.pages.forEach((p) => walk(p.root));
    if (!m) return null; const i = new Image(); i.src = m; await i.decode(); return { w: i.naturalWidth, kb: Math.round(m.length / 1024) }; });
  ok('U8 stored resized to 1600px, not the 2400px original', stored && stored.w === 1600, stored);
  await page.screenshot({ path: path.join(OUT, 'canvas.png') });
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe[title="Site preview"]'); await page.waitForTimeout(2500);
  const fr = await (await page.$('iframe[title="Site preview"]')).contentFrame();
  const pv = await fr.evaluate(async () => { document.querySelectorAll('details').forEach((d) => { d.open = true; }); const i = document.querySelector('img.eu-accordion__media'); if (!i) return null; await i.decode().catch(() => {}); return { loaded: i.naturalWidth > 0 }; });
  ok('U8 the Preview shows the item picture', pv && pv.loaded, pv);
  await page.screenshot({ path: path.join(OUT, 'preview.png') });
  await page.getByRole('button', { name: /Exit preview/ }).click(); await page.waitForTimeout(800);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export', exact: true }).click()]);
  const files = unzipSync(new Uint8Array(fs.readFileSync(await dl.path()))); const dir = path.join(OUT, 'site');
  for (const [f, b] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), b); }
  const html = Buffer.from(files['index.html']).toString(); const tag = (html.match(/<img class="eu-accordion__media"[^>]+>/) || [''])[0];
  ok('U8 the download holds the picture under images/ with its 480 and 960 copies', Object.keys(files).filter((f) => f.startsWith('images/')).length === 3, Object.keys(files));
  ok('U8 the accordion picture in the download has its srcset (A1-13)', /src="images\/[^"]+" srcset="[^"]+480w[^"]+960w[^"]+1600w" sizes="auto, 100vw"/.test(tag), tag.slice(0, 220));
  ok('U8 no photo bytes left inside the page', !/data:image\/(jpeg|webp|png)/.test(html));
  const media = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1') || '{}'); let m = 'no accordion';
    const walk = (n) => { if (n.component === 'accordion') m = n.items?.[0]?.media ?? null; (n.children || []).forEach(walk); }; s.pages.forEach((p) => walk(p.root)); return m && m.slice(0, 16); });
  await page.locator('[data-box-id]').first().click({ position: { x: 5, y: 5 } }).catch(() => {}); // focus back on the canvas, as a person would
  await page.keyboard.press('Control+z'); await page.waitForTimeout(1200);
  const after = await media();
  ok('U8 Undo takes the picture back (the saved site)', after === null, after);
  ok('U8 no page error', errs.length === 0, errs);
  await browser.close();

  // the download, served as a host serves it, at every screen of screens.js in six headed windows
  const server = http.createServer((req, r) => { const f = path.join(dir, decodeURIComponent(req.url.split('?')[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    const t = { '.html': 'text/html', '.css': 'text/css', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' }[path.extname(f)] || 'application/octet-stream'; const b = fs.readFileSync(f);
    if (/html|css/.test(t)) { r.writeHead(200, { 'content-type': t, 'content-encoding': 'gzip' }); return r.end(zlib.gzipSync(b)); } r.writeHead(200, { 'content-type': t }); r.end(b); }).listen(3501);
  const browsers = await Promise.all([0, 1, 2, 3, 4, 5].map((i) => chromium.launch({ headless: false, args: ['--force-device-scale-factor=1', `--window-position=${(i % 3) * 640},${Math.floor(i / 3) * 520}`] })));
  const bad = []; let next = 0;
  await Promise.all(browsers.map(async (b) => { while (next < SCREENS.length) { const s = SCREENS[next++]; const dpr = s.w <= 480 ? 2 : 1;
    const ctx = await b.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: dpr }); const p = await ctx.newPage();
    await p.goto('http://localhost:3501/index.html', { waitUntil: 'load' });
    const m = await p.evaluate(async () => { document.querySelectorAll('details').forEach((d) => { d.open = true; }); const i = document.querySelector('img.eu-accordion__media'); i.scrollIntoView(); await new Promise((r) => setTimeout(r, 400)); await i.decode().catch(() => {});
      const need = i.getBoundingClientRect().width * devicePixelRatio; const c = i.getAttribute('srcset').split(',').map((x) => x.trim().split(' ')).map(([f, w]) => ({ f: f.split('/').pop(), w: parseInt(w, 10) }));
      const want = (c.find((x) => x.w >= need) || c[c.length - 1]).f; return { over: document.documentElement.scrollWidth - innerWidth, loaded: i.naturalWidth > 0, want, got: i.currentSrc.split('/').pop() }; });
    if (m.over > 1 || !m.loaded || m.want !== m.got) bad.push({ s: `${s.w}x${s.h}@${dpr}`, ...m }); await ctx.close(); } }));
  await Promise.all(browsers.map((b) => b.close())); server.close();
  ok(`U8 the downloaded accordion at every screen (${SCREENS.length}): loads, the right copy, no sideways scroll`, bad.length === 0, bad.slice(0, 4));
  console.log(`\nHEADED UAT U8: ${res.filter(Boolean).length} / ${res.length} passed`); process.exit(res.every(Boolean) ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
