// BATCH A-1 · HEADED UAT U2 · U3 · U4 — fonts and photos as files in the download (RA-7, RA-8, A1-2).
// Every site is BUILT THROUGH THE UI (RULE Y) in a visible window, downloaded with the builder's own Export button,
// unzipped, served the way a static host serves it (gzip), and then swept at EVERY screen of screens.js (RULE Z) in six
// headed windows. Run against a fresh `next start` (BASE, default :3100); `node scripts/check-fresh-build.js` first.
//   node scripts/uat/uat-a1-headed.js
const fs = require('fs'); const path = require('path'); const http = require('http'); const zlib = require('zlib');
const { chromium } = require('playwright');
const { unzipSync } = require('fflate');
const sharp = require('sharp');
const H = require('./h.js');
const { SCREENS } = require('./screens.js');

const OUT = path.join(__dirname, 'a1-out'); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const SITES = path.join(OUT, 'sites');
const results = []; const ok = (name, cond, saw) => { results.push({ name, pass: !!cond, saw }); console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${saw !== undefined ? ' — ' + (typeof saw === 'string' ? saw : JSON.stringify(saw)) : ''}`); };
const YORUBA = 'Ẹ kú àárọ̀ — ọmọ wa ṣe dáadáa.'; const TWI = 'Ɛte sɛn? Ɔdɔ wɔ hɔ.';
const LONG = Array.from({ length: 60 }, (_, i) => `Our pupils learn, play and grow together in a caring community, line ${i + 1}.`).join(' ');

// ── photos: real-looking JPEGs (noise compresses like a photograph does), wider than every copy we make ──
async function photo(name, w, h, tint) {
  const f = path.join(OUT, name); const raw = Buffer.alloc(w * h * 3);
  for (let i = 0; i < raw.length; i += 3) { const n = Math.random() * 90; raw[i] = tint[0] + n; raw[i + 1] = tint[1] + n; raw[i + 2] = tint[2] + n; }
  await sharp(raw, { raw: { width: w, height: h, channels: 3 } }).jpeg({ quality: 85 }).toFile(f); return f;
}

// ── the builder, driven like a person ──
const tab = async (page, name) => { const t = page.getByRole('tab', { name }); if (await t.count()) { await t.first().click(); await page.waitForTimeout(300); } };
async function setText(page, text) { await tab(page, 'Content'); const ta = page.getByLabel('Text', { exact: true }).first(); await ta.fill(text); await ta.blur(); await page.waitForTimeout(500); }
async function setFont(page, family) {
  await tab(page, 'Content'); await page.getByRole('button', { name: 'Font', exact: true }).first().click(); await page.waitForTimeout(300);
  const opt = page.getByRole('option').filter({ hasText: new RegExp('^\\s*' + family + ' ·') }).first(); await opt.scrollIntoViewIfNeeded(); await opt.click(); await page.waitForTimeout(500);
}
async function add(page, tile) { await H.panel(page, true); await H.clickTile(page, tile); await H.panel(page, false); }
async function exportSite(page, name) {
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 120000 }), page.getByRole('button', { name: 'Export', exact: true }).click()]);
  const zip = await fs.promises.readFile(await dl.path()); const files = unzipSync(new Uint8Array(zip)); const dir = path.join(SITES, name);
  for (const [f, bytes] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), bytes); }
  return { dir, names: Object.keys(files).sort(), text: (f) => fs.readFileSync(path.join(dir, f), 'utf8') };
}
const noDataPhotos = (site) => site.names.filter((f) => /\.(html|css)$/.test(f)).every((f) => !/data:image\/(jpeg|png|webp)/.test(site.text(f)));

// ── a static host: gzip for text, a request log per path ──
const served = [];
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]); served.push(url);
  const f = path.join(SITES, url.endsWith('/') ? url + 'index.html' : url);
  if (!f.startsWith(SITES) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  const ext = path.extname(f); const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png' };
  const body = fs.readFileSync(f); const h = { 'content-type': types[ext] || 'application/octet-stream', 'cache-control': 'no-store' };
  if (/html|css/.test(h['content-type']) && /gzip/.test(req.headers['accept-encoding'] || '')) { h['content-encoding'] = 'gzip'; res.writeHead(200, h); return res.end(zlib.gzipSync(body)); }
  res.writeHead(200, h); res.end(body);
}).listen(3501);
const HOST = 'http://localhost:3501';

/** Which Google subset each font file is, read from the comment Google writes above each @font-face. */
function subsetsOf(css) { const m = {}; for (const x of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{[^}]*?url\((fonts\/[^)]+)\)/g)) m[x[2]] = x[1]; return m; }

const POS = [[0, 0], [640, 0], [1280, 0], [0, 520], [640, 520], [1280, 520]];

// ── W1: site A — a heading, a Yoruba + Twi line in Lora, a photo; page 2: a long English page with the SAME photo low down ──
async function siteA(pos) {
  const { browser, page, errs } = await H.open({ headed: true, w: 1280, h: 900, pos });
  const p1 = await photo('a.jpg', 2400, 1500, [90, 120, 150]);
  await add(page, 'Heading'); await setText(page, 'Oakfield Primary School');
  await add(page, 'Text'); await setText(page, `${YORUBA} ${TWI}`); await setFont(page, 'Lora');
  await add(page, 'Image'); await page.locator('input[aria-label="Upload image"]').last().setInputFiles(p1); await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Add page' }).first().click(); await page.waitForTimeout(1200);
  await add(page, 'Heading'); await setText(page, 'About us');
  await add(page, 'Text'); await setText(page, LONG);
  await add(page, 'Image'); await page.locator('input[aria-label="Upload image"]').last().setInputFiles(p1); await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT, 'A-canvas-1280.png') });
  // canvas == Preview: the Yoruba line's typeface on the canvas and in the Preview
  await page.getByRole('group', { name: 'Pages' }).getByRole('button').first().click(); await page.waitForTimeout(800);
  const canvasFont = await page.evaluate((t) => { const e = [...document.querySelectorAll('[data-box-id] *')].find((x) => x.children.length === 0 && x.textContent.includes(t)); return e && getComputedStyle(e).fontFamily; }, 'ọmọ');
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe[title="Site preview"]'); await page.waitForTimeout(3000);
  const fr = await (await page.$('iframe[title="Site preview"]')).contentFrame();
  const prev = await fr.evaluate(async (t) => { await document.fonts.ready; const e = [...document.querySelectorAll('body *')].find((x) => x.children.length === 0 && x.textContent.includes(t)); const img = document.querySelector('img');
    return { font: e && getComputedStyle(e).fontFamily, imgSrc: img && img.getAttribute('src').slice(0, 15), imgOk: !!img && img.complete && img.naturalWidth > 0 }; }, 'ọmọ');
  await page.screenshot({ path: path.join(OUT, 'A-preview-1280.png') });
  ok('U4 canvas == Preview: the Yoruba line is set in Lora on both', /Lora/.test(canvasFont || '') && /Lora/.test(prev.font || ''), { canvasFont, preview: prev.font });
  ok('U3 the Preview still shows the photo (it keeps data: URIs, it has no folder)', prev.imgOk && prev.imgSrc.startsWith('data:image'), prev);
  await page.getByRole('button', { name: /Exit preview/ }).click(); await page.waitForTimeout(800);
  const site = await exportSite(page, 'site-a'); site.page2 = site.names.find((n) => n.endsWith('.html') && n !== 'index.html');
  ok('U2 site A: the download holds fonts/ and styles.css carries no font bytes', site.names.some((f) => f.startsWith('fonts/')) && !site.text('styles.css').includes('data:font'), site.names.filter((f) => !f.startsWith('fonts/')));
  const imgs = site.names.filter((f) => f.startsWith('images/'));
  const originals = imgs.filter((f) => !/-(480|960)\./.test(f));
  ok('U3 site A: the same photo on two pages is ONE file, with its 480 and 960 copies', originals.length === 1 && imgs.length === 3, imgs);
  ok('U3 site A: no page or stylesheet carries photo bytes', noDataPhotos(site));
  const tags = [...site.text('index.html').matchAll(/<img [^>]+>/g)].map((m) => m[0]).concat([...site.text(site.page2).matchAll(/<img [^>]+>/g)].map((m) => m[0]));
  ok('U3 site A: every <img> has srcset, sizes, width and height', tags.length === 2 && tags.every((t) => /srcset="[^"]*480w[^"]*960w/.test(t) && /sizes="/.test(t) && /width="\d+"/.test(t) && /height="\d+"/.test(t)), tags.map((t) => t.replace(/src="[^"]+"/, '').slice(0, 160)));
  ok('U2/U3 site A: built with no page error', errs.length === 0, errs);
  await browser.close(); return site;
}

// ── W2: site C — a band with a background photo, a gallery of three ──
async function siteC(pos) {
  const { browser, page, errs } = await H.open({ headed: true, w: 1280, h: 900, pos });
  const bg = await photo('bg.jpg', 2000, 900, [60, 110, 80]);
  const g = await Promise.all([0, 1, 2].map((i) => photo(`g${i}.jpg`, 1400, 1000, [120 + i * 30, 90, 70])));
  await page.getByRole('button', { name: 'Add a band' }).first().click(); await page.waitForTimeout(1000);
  await tab(page, 'Design'); await page.locator('input[aria-label="Upload background image"]').first().setInputFiles(bg); await page.waitForTimeout(2500);
  await add(page, 'Heading'); await setText(page, 'Term dates and events');
  await H.panel(page, true); await H.clickTile(page, 'Photo gallery'); await page.waitForTimeout(600);
  await page.locator('input[aria-label="Choose photos for the gallery"]').setInputFiles(g); await page.waitForTimeout(3000);
  await page.getByRole('button', { name: /^Add gallery of 3/ }).click(); await page.waitForTimeout(1500); await H.panel(page, false);
  await page.screenshot({ path: path.join(OUT, 'C-canvas-1280.png') });
  const site = await exportSite(page, 'site-c');
  const imgs = site.names.filter((f) => f.startsWith('images/'));
  ok('U3 site C: the band background is a file under images/ referenced from the page', imgs.length >= 4 && /url\((&quot;|'|")?images\//.test(site.text('index.html') + site.text('styles.css')), imgs);
  ok('U3 site C: no page or stylesheet carries photo bytes', noDataPhotos(site));
  const tags = [...site.text('index.html').matchAll(/<img [^>]+>/g)].map((m) => m[0]);
  ok('U3 site C: each gallery photo has its srcset', tags.length >= 3 && tags.every((t) => /srcset=/.test(t)), tags.length);
  ok('U3 site C: built with no page error', errs.length === 0, errs);
  await browser.close(); return site;
}

// ── W3: site B — words only, exported in each of the four website themes: fonts/ yes, images/ no ──
async function siteB(pos) {
  const { browser, page, errs } = await H.open({ headed: true, w: 1280, h: 900, pos });
  await add(page, 'Heading'); await setText(page, 'Notice to parents'); await add(page, 'Text'); await setText(page, 'School resumes on Monday.');
  const themes = await (async () => { await page.getByRole('button', { name: 'Website theme' }).click(); await page.waitForTimeout(300); const n = await page.getByRole('menuitemradio').allTextContents(); await page.keyboard.press('Escape'); return n.map((s) => s.trim()).filter(Boolean); })();
  for (const [i, t] of themes.entries()) {
    await page.getByRole('button', { name: 'Website theme' }).click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio').nth(i).click(); await page.waitForTimeout(800);
    const site = await exportSite(page, `site-b-${i}`);
    ok(`U2/U3 site B in the "${t}" website theme: fonts/ present, no images/ folder, no data: font or photo`, site.names.some((f) => f.startsWith('fonts/')) && !site.names.some((f) => f.startsWith('images/')) && !site.text('styles.css').includes('data:font') && noDataPhotos(site), site.names.filter((f) => !f.startsWith('fonts/')));
  }
  ok('U2 site B: four website themes exported', themes.length === 4, themes);
  ok('U2 site B: built with no page error', errs.length === 0, errs);
  await browser.close();
}

// ── W4: the font server unreachable — the download still arrives, in the fallback ──
async function siteOffline(pos) {
  const { browser, page, errs } = await H.open({ headed: true, w: 1280, h: 900, pos });
  await add(page, 'Heading'); await setText(page, 'Offline font check');
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const site = await exportSite(page, 'site-offline');
  ok('U2 fonts unreachable: the download still arrives, with no fonts/ and no @font-face', site.names.includes('index.html') && !site.names.some((f) => f.startsWith('fonts/')) && !site.text('styles.css').includes('@font-face'), site.names);
  ok('U2 fonts unreachable: no page error', errs.length === 0, errs);
  await browser.close();
}

// ── the served export at one screen: overflow, fonts fetched by subset, the right photo copy, lazy, 150 % text ──
async function screenCheck(browser, site, page, s, subsets) {
  const dpr = s.w <= 480 ? 2 : 1;
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: dpr, isMobile: s.w <= 480, hasTouch: s.w <= 1024 });
  const tab = await ctx.newPage(); const req = [];
  tab.on('request', (r) => req.push(new URL(r.url()).pathname.replace(`/${site}/`, '')));
  await tab.goto(`${HOST}/${site}/${page}`, { waitUntil: 'load' }); await tab.waitForTimeout(400);
  const imgsBefore = req.filter((u) => u.startsWith('images/'));
  const far = await tab.evaluate(() => [...document.images].filter((i) => i.getBoundingClientRect().top > innerHeight + 3000).map((i) => i.getAttribute('src')));
  await tab.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
  await tab.waitForTimeout(600);
  const m = await tab.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.images].map((i) => { const need = i.getBoundingClientRect().width * devicePixelRatio; const cands = (i.getAttribute('srcset') || '').split(',').map((c) => c.trim().split(' ')).filter((c) => c[0]).map(([f, w]) => ({ f, w: parseInt(w, 10) })).sort((a, b) => a.w - b.w);
      const want = cands.length ? (cands.find((c) => c.w >= need) || cands[cands.length - 1]).f : i.getAttribute('src'); const got = new URL(i.currentSrc || i.src).pathname.split('/').slice(-2).join('/');
      return { need: Math.round(need), want, got, loaded: i.complete && i.naturalWidth > 0 }; });
    return { overflow: document.documentElement.scrollWidth - innerWidth, imgs, h: document.body.scrollHeight };
  });
  const fontsAsked = req.filter((u) => u.startsWith('fonts/'));
  await tab.evaluate(() => { document.documentElement.style.fontSize = '150%'; }); await tab.waitForTimeout(300);
  const big = await tab.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, h: document.body.scrollHeight }));
  if (s.w === 360 && s.h === 800) await tab.screenshot({ path: path.join(OUT, `${site}-${page}-360x800.png`), fullPage: false });
  if (s.w === 1280) await tab.screenshot({ path: path.join(OUT, `${site}-${page}-1280.png`) });
  await ctx.close();
  return { s, dpr, m, big, fontsAsked: fontsAsked.map((f) => subsets[f] || '?'), fontFiles: fontsAsked, imgsBefore, far };
}

(async () => {
  const t0 = Date.now();
  // Phase 1 — four windows build through the UI at once
  const [A, C] = await Promise.all([siteA(POS[0]), siteC(POS[1]), siteB(POS[2]), siteOffline(POS[3])]);
  const subA = subsetsOf(A.text('styles.css')); const subC = subsetsOf(C.text('styles.css'));
  ok('U2 every font file is named in styles.css with its subset', Object.keys(subA).length > 0 && A.names.filter((f) => f.startsWith('fonts/')).every((f) => subA[f]), Object.keys(subA).length);

  // Phase 2 — six headed windows sweep every screen of screens.js on three served pages
  const jobs = [];
  for (const s of SCREENS) for (const [site, page, sub] of [['site-a', 'index.html', subA], ['site-a', A.page2, subA], ['site-c', 'index.html', subC]]) jobs.push({ s, site, page, sub });
  const browsers = await Promise.all(POS.map((p) => chromium.launch({ headless: false, args: ['--force-device-scale-factor=1', `--window-position=${p[0]},${p[1]}`] })));
  const rows = []; let next = 0;
  await Promise.all(browsers.map(async (b) => { while (next < jobs.length) { const j = jobs[next++]; rows.push({ ...j, r: await screenCheck(b, j.site, j.page, j.s, j.sub).catch((e) => ({ error: String(e).slice(0, 200) })) }); } }));
  await Promise.all(browsers.map((b) => b.close()));

  const errored = rows.filter((x) => x.r.error);
  ok(`U4 every screen loaded (${rows.length} = ${SCREENS.length} screens × 3 pages)`, errored.length === 0, errored.slice(0, 3).map((x) => `${x.site}/${x.page}@${x.s.w}x${x.s.h}: ${x.r.error}`));
  const good = rows.filter((x) => !x.r.error);
  const over = good.filter((x) => x.r.m.overflow > 1 || x.r.big.overflow > 1);
  ok('U4 no sideways overflow at any screen, at 100 % and 150 % text', over.length === 0, over.slice(0, 5).map((x) => `${x.site}/${x.page}@${x.s.w}: ${x.r.m.overflow}/${x.r.big.overflow}`));
  const notGrown = good.filter((x) => x.r.big.h <= x.r.m.h);
  ok('U4 150 % text actually grows every page', notGrown.length === 0, notGrown.slice(0, 5).map((x) => `${x.site}/${x.page}@${x.s.w}`));
  const unloaded = good.filter((x) => x.r.m.imgs.some((i) => !i.loaded));
  ok('U3 every photo loads at every screen once scrolled to', unloaded.length === 0, unloaded.slice(0, 5).map((x) => `${x.site}/${x.page}@${x.s.w}`));
  const wrong = good.filter((x) => x.r.m.imgs.some((i) => !i.got.endsWith(i.want.split('/').pop())));
  ok('U3 every screen downloads the copy its width × density needs (480 / 960 / original)', wrong.length === 0, wrong.slice(0, 6).map((x) => `${x.site}/${x.page}@${x.s.w}x${x.r.dpr}: ${JSON.stringify(x.r.m.imgs.filter((i) => !i.got.endsWith(i.want.split('/').pop())))}`));
  const phone = good.find((x) => x.site === 'site-a' && x.page === 'index.html' && x.s.w === 360 && x.s.h === 800);
  ok('U3 a 360 × 800 phone (the TCL 505) at 2× gets the 960 copy, not the original', phone && phone.r.m.imgs.every((i) => /-960\./.test(i.got)), phone && phone.r.m.imgs);
  const wide = good.find((x) => x.site === 'site-a' && x.page === 'index.html' && x.s.w >= 1920);
  ok('U3 a wide screen gets the original', wide && wide.r.m.imgs.every((i) => !/-(480|960)\./.test(i.got)), wide && wide.r.m.imgs);
  const lazy = good.filter((x) => x.site === 'site-a' && x.page === A.page2 && x.r.far.length);
  ok('U3 a photo far below the fold is not fetched before the visitor scrolls (page 2, every screen where it is far down)', lazy.length > 0 && lazy.every((x) => x.r.imgsBefore.length === 0), `${lazy.length} screens; fetched early on ${lazy.filter((x) => x.r.imgsBefore.length).map((x) => x.s.w).join(',') || 'none'}`);
  const eng = good.filter((x) => x.site === 'site-a' && x.page === A.page2);
  ok('U2 the English page fetches only Latin font files', eng.every((x) => x.r.fontsAsked.length && x.r.fontsAsked.every((s) => s === 'latin')), [...new Set(eng.flatMap((x) => x.r.fontsAsked))]);
  const yor = good.filter((x) => x.site === 'site-a' && x.page === 'index.html');
  ok('U2 the Yoruba + Twi page also fetches the vietnamese (ẹ ọ) and latin-ext (ṣ ɛ ɔ) files', yor.every((x) => x.r.fontsAsked.includes('vietnamese') && x.r.fontsAsked.includes('latin-ext')), [...new Set(yor.flatMap((x) => x.r.fontsAsked))]);

  // The letters themselves: drawn in Lora, not a fallback (a canvas measures Lora against the bare fallback)
  const gb = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1'] });
  const gp = await (await gb.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await gp.goto(`${HOST}/site-a/index.html`, { waitUntil: 'load' }); await gp.waitForTimeout(1500);
  const glyphs = await gp.evaluate(async () => { await document.fonts.ready; const c = document.createElement('canvas').getContext('2d');
    const w = (font, t) => { c.font = font; return c.measureText(t).width; };
    return Object.fromEntries(['ẹ', 'ọ', 'ṣ', 'ɛ', 'ɔ', 'a'].map((g) => [g, Math.abs(w('40px Lora, monospace', g.repeat(8)) - w('40px monospace', g.repeat(8))) > 0.5])); });
  const line = gp.locator('text=ọmọ').first(); await line.scrollIntoViewIfNeeded(); await line.screenshot({ path: path.join(OUT, 'A-yoruba-line.png') }).catch(() => {});
  await gb.close();
  ok('U2 Yoruba ẹ ọ ṣ draw in Lora, not the fallback', glyphs['ẹ'] && glyphs['ọ'] && glyphs['ṣ'], glyphs);
  ok('U2 Twi ɛ ɔ draw in Lora, not the fallback (needs the typeface to have them)', glyphs['ɛ'] && glyphs['ɔ'], glyphs);

  fs.writeFileSync(path.join(OUT, 'rows.json'), JSON.stringify(rows, null, 1));
  server.close();
  const failed = results.filter((r) => !r.pass);
  console.log(`\nHEADED UAT A-1 (U2–U4): ${results.length - failed.length} / ${results.length} passed in ${Math.round((Date.now() - t0) / 1000)} s${failed.length ? ' — FAILED: ' + failed.map((f) => f.name).join(' | ') : ''}`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error(e); server.close(); process.exit(2); });
