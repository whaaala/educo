// HEADED UAT — BATCH LE-5 · responsive image sizes, and a background video you upload or link (docs/TASK_TREE.md, "BATCH LE-5",
// checklist U1 … U7; U8 is the app, uat-le5-emulator.js). Every state BUILT THROUGH THE UI (RULE Y): palette tiles, the Image's own
// Upload, Design → Background → Video. The photo and the video are MADE in the browser (a canvas JPEG 1600 × 900, a MediaRecorder
// webm) and uploaded through the real file inputs. Six visible windows; the Preview and the download at every width of screens.js
// (RULE Z); localStorage is only READ, to report what was stored.
//   sizes     U1 · AC-22 a hero photo, three Side by side, three in a Grid of As many as fit → the downloaded site, served: each
//             picture fetches the smallest copy that is at least its shown width × the pixel ratio (1 and 2), at every width
//   upload    U2 · MS-5b Upload a video: stored as media:<hash>, a poster taken, it plays behind the heading; reload; refusals
//   link      U3 · MS-5b a YouTube address refused; an https .webm (served by this script) plays; Upload a poster
//   publish   U4 · the Preview at every width: covers, plays, the heading on top, Tab → Space pauses / plays; reduced motion and
//             Save-Data: no video fetched, the poster, Play starts it; the download carries the video and plays it
//   tint      U5 · Tint over background over the video and under the heading; Remove video; one Ctrl+Z brings it all back
//   chrome    U6 · the controls by keyboard in four themes × 375 · 768 · 1280 · 1536; the refusal readable; nothing clipped
//   pinned    U7 · LE5-4 a pinned, see-through header over a photo stays at the top of the Preview when it is scrolled
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le5-headed.js [--only=sizes,upload]
const path = require('path'); const fs = require('fs'); const http = require('http');
const { unzipSync } = require('fflate');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { WIDTHS } = require('./screens.js');
const X = require('./uat-rx3-headed.js'); const { site, sleep, deselect, at, ins, pvOpen, pvAt, pvClose } = X;
const W = require('../../config/inspector.json').bgVideo;
const S = require('../../config/inspector.json').sizes;
const LAYOUT = require('../../config/layout.json'); const MEDIA = LAYOUT.media; const DOCK_FROM = LAYOUT.editor.dockFrom;
const OUT = path.join(__dirname, 'logs', 'le5'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
/** A Preview picture with the Preview's own controls hidden — they lie over the top of the page (pass 5's pictures showed only them). */
async function pvShot(page, name) {
  const hide = page.getByRole('button', { name: 'Hide the preview controls' }); const hid = await hide.isVisible().catch(() => false);
  if (hid) { await hide.click(); await sleep(page, 300); }
  await shot(page, name);
  if (hid) { await page.getByRole('button', { name: 'Show the preview controls' }).click().catch(() => {}); await sleep(page, 300); }
}
const LINK = 'https://media.example.org/loop.webm'; // answered by page.route with the webm this script made (no network)

async function closeIns(page) { if (page.viewportSize().width >= DOCK_FROM) return; const c = page.getByRole('button', { name: 'Collapse inspector' }); if (await c.isVisible().catch(() => false)) { await c.click(); await sleep(page, 300); } }
async function first(page, tile) { await deselect(page); await closeIns(page); await H.panel(page, true); return P.first(page, tile); }
async function into(page, id, tile) { await closeIns(page); await H.panel(page, true); return P.into(page, id, tile); }
async function beside(page, id, tile) { await closeIns(page); await H.panel(page, true); return P.beside(page, id, tile); }
const nodeIn = (s, id) => { let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; s.pages.forEach((pg) => w(pg.root)); return n; };
const allIds = (s) => { const o = []; const w = (n) => { o.push(n.id); (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return o; };
async function words(page, id, w) { await at(page, id, 'Content'); const f = ins(page).getByLabel(/^(Text|Heading)$/).first(); await f.fill(w); await f.blur(); await sleep(page, 400); }

// ── the media, made here ─────────────────────────────────────────────────────────────────────────────────────────────
async function photo(page, name, hue) {
  const b64 = await page.evaluate((hue) => { const c = Object.assign(document.createElement('canvas'), { width: 1600, height: 900 }); const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 1600, 900); g.addColorStop(0, `hsl(${hue} 70% 45%)`); g.addColorStop(1, `hsl(${hue + 60} 70% 30%)`); x.fillStyle = g; x.fillRect(0, 0, 1600, 900); for (let i = 0; i < 400; i++) { x.fillStyle = `hsl(${(hue + i) % 360} 60% ${30 + (i % 40)}%)`; x.fillRect((i * 97) % 1600, (i * 53) % 900, 40, 40); } return c.toDataURL('image/jpeg', 0.9).split(',')[1]; }, hue);
  const p = path.join(OUT, `${name}.jpg`); fs.writeFileSync(p, Buffer.from(b64, 'base64')); return p;
}
let WEBM = null;
async function webm(page) {
  if (WEBM) return WEBM;
  const b64 = await page.evaluate(async () => {
    const c = Object.assign(document.createElement('canvas'), { width: 640, height: 360 }); const x = c.getContext('2d');
    const rec = new MediaRecorder(c.captureStream(25), { mimeType: 'video/webm' }); const parts = []; rec.ondataavailable = (e) => parts.push(e.data);
    let t = 0; const draw = () => { x.fillStyle = `hsl(${(t * 6) % 360} 70% 40%)`; x.fillRect(0, 0, 640, 360); x.fillStyle = '#fff'; x.fillRect((t * 8) % 640, 150, 60, 60); t++; };
    const iv = setInterval(draw, 40); rec.start(200); await new Promise((r) => setTimeout(r, 2200)); rec.stop(); await new Promise((r) => (rec.onstop = r)); clearInterval(iv);
    const buf = new Uint8Array(await new Blob(parts, { type: 'video/webm' }).arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]); return btoa(s);
  });
  WEBM = path.join(OUT, 'loop.webm'); fs.writeFileSync(WEBM, Buffer.from(b64, 'base64')); return WEBM;
}
async function routeLink(page) { const body = fs.readFileSync(await webm(page)); await page.context().route(LINK, (r) => r.fulfill({ status: 200, contentType: 'video/webm', body })); }

// ── building ─────────────────────────────────────────────────────────────────────────────────────────────────────────
// the block's OWN Upload button (inspector.js) — pass 3 sent every upload to the page's last input, so two pictures stayed empty
async function uploadPhoto(page, id, file) { await closeIns(page); await H.panel(page, false); if (!(await I.upload(page, id, file))) throw new Error(`no Upload on ${id.slice(-4)}`); await sleep(page, 2000); if (!/^data:image/.test(nodeIn(await site(page), id)?.src || '')) throw new Error(`the photo did not reach ${id.slice(-4)}`); }
async function heroSection(page) {
  const sec = await first(page, 'Stack'); const h = await into(page, sec, 'Heading'); await words(page, h, 'Welcome to Greenfield');
  await I.background(page, sec, '#1e293b');
  return { sec, h };
}
async function videoPanel(page, id) { await closeIns(page); await at(page, id, 'Design', 'Background'); await sleep(page, 300); const g = ins(page).getByRole('group', { name: W.heading }).first(); await g.scrollIntoViewIfNeeded(); return g; }
async function uploadVideo(page, id, file) { await videoPanel(page, id); await ins(page).locator(`input[type="file"][aria-label="${W.upload}"]`).setInputFiles(file); await page.waitForFunction((w) => ![...document.querySelectorAll('button')].some((b) => b.textContent.includes(w)), W.saving, { timeout: 20000 }); await sleep(page, 800); }
/** The canvas's video for block `id`: playing, its time, and its box against the block's. */
const canvasVideo = (page, id) => page.evaluate(async (id) => {
  const b = document.querySelector(`[data-box-id="${id}"]`); const v = b?.querySelector(':scope > video.eu-bgvideo'); if (!v) return null;
  const t0 = v.currentTime; await new Promise((r) => setTimeout(r, 900)); const br = b.getBoundingClientRect(), vr = v.getBoundingClientRect();
  const hd = b.querySelector('h1,h2,h3,[data-box-id] h2') || b.querySelector('[data-box-id]'); const hr = hd?.getBoundingClientRect();
  const top = hr ? document.elementFromPoint(hr.left + hr.width / 2, hr.top + hr.height / 2) : null;
  return { paused: v.paused, advanced: +(v.currentTime - t0).toFixed(2), src: (v.currentSrc || '').slice(0, 5), poster: !!v.poster, cover: Math.abs(br.width - vr.width) < 1.5 && Math.abs(br.height - vr.height) < 1.5, z: getComputedStyle(v).zIndex, headingOnTop: !!top && !top.closest('video') && (hd.contains(top) || top === hd) };
}, id);
/** The published video in a Preview / served frame. */
const pubVideo = (f) => f.evaluate(async () => {
  const v = document.querySelector('video.eu-bgvideo'); if (!v) return null; const blk = v.parentElement; const t0 = v.currentTime; await new Promise((r) => setTimeout(r, 900));
  const br = blk.getBoundingClientRect(), vr = v.getBoundingClientRect(); const b = blk.querySelector('.eu-bgvideo__toggle'); const hd = blk.querySelector('h1,h2,h3');
  const hr = hd?.getBoundingClientRect(); const top = hr ? document.elementFromPoint(hr.left + hr.width / 2, hr.top + hr.height / 2) : null;
  return { paused: v.paused, advanced: +(v.currentTime - t0).toFixed(2), hasSrc: !!v.getAttribute('src'), cover: Math.abs(br.width - vr.width) < 1.5 && Math.abs(br.height - vr.height) < 1.5, label: b?.getAttribute('aria-label'), btnIn: !!b && ((r) => r.left >= br.left - 0.5 && r.top >= br.top - 0.5 && r.right <= br.right + 0.5 && r.bottom <= br.bottom + 0.5)(b.getBoundingClientRect()), headingOnTop: !!top && (hd.contains(top) || top === hd), sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth };
});
function serve(dir, port) {
  const types = { '.html': 'text/html', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.webm': 'video/webm', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
  const srv = http.createServer((q, s) => { const f = path.join(dir, decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, '') || 'index.html'); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s); });
  return new Promise((ok) => srv.listen(port, () => ok(srv)));
}
async function downloadSite(page) {
  await H.panel(page, false); const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 90000 }), page.getByRole('button', { name: 'Export' }).first().click()]);
  const zip = path.join(OUT, `site-${Date.now()}.zip`); await dl.saveAs(zip); const files = unzipSync(fs.readFileSync(zip));
  const dir = path.join(OUT, `site-${Date.now()}`); for (const [n, b] of Object.entries(files)) { const p = path.join(dir, n); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, b); }
  return { dir, files };
}
// Colours read through a canvas — the build writes them as oklch(), which a regex over rgb() misreads (pass 1 measured 1.2 : 1)
const CONTRAST = (el) => {
  const cx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
  const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); return [...cx.getImageData(0, 0, 1, 1).data]; };
  let bg = null; for (let e = el; e && !bg; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c[3] === 255) bg = c; }
  const lum = ([r, g, b]) => { const q = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * q(r) + 0.7152 * q(g) + 0.0722 * q(b); };
  const [a, b] = [lum(rgb(getComputedStyle(el).color)), lum(bg || [255, 255, 255])].sort((x, y) => y - x); return +((a + 0.05) / (b + 0.05)).toFixed(2);
};
let PORT = 4500; const nextPort = () => PORT++;

const JOBS = {
  async sizes(page, J) {
    const hero = await first(page, 'Image'); await uploadPhoto(page, hero, await photo(page, 'hero', 200));
    // Side by side dropped INTO a Stack, the new row found by what was not there before (the way LE-13 builds it)
    const host = await first(page, 'Stack'); const was = new Set(allIds(await site(page))); await into(page, host, 'Side by side'); const s0 = await site(page);
    const rowN = (() => { let r = null; const w = (n) => { if (!r && n.direction === 'row' && !n.rowBand && !was.has(n.id)) r = n; (n.children || []).forEach(w); }; s0.pages.forEach((p) => w(p.root)); return r; })();
    if (!rowN) throw new Error('Side by side made no row');
    const born = rowN.children.map((k) => k.id); const three = [];
    for (let i = 0; i < 3; i++) three.push(i ? await beside(page, three[i - 1], 'Image') : await into(page, rowN.id, 'Image'));
    for (const b of born) { await H.panel(page, false); await H.select(page, b); await page.keyboard.press('Delete'); await sleep(page, 400); }
    for (const [i, id] of three.entries()) await uploadPhoto(page, id, await photo(page, `row${i}`, 20 + i * 90));
    // a Grid set to As many as fit, three photos in it
    const b4 = new Set(allIds(await site(page))); await deselect(page); await closeIns(page); await H.panel(page, true); await H.clickTile(page, 'Grid');
    const sq = page.locator('[role="menu"][aria-label="Choose a layout"] [aria-label="3 across, 1 down"]'); if (await sq.isVisible().catch(() => false)) { await sq.click(); await sleep(page, 700); }
    const s1 = await site(page);
    const grid = allIds(s1).map((id) => nodeIn(s1, id)).find((n) => !b4.has(n.id) && n.layout === 'grid');
    if (grid) {
      await at(page, grid.id, 'Layout'); await X.openAll(page);
      const fit = ins(page).getByRole('button', { name: S.modeChoices.fit, exact: true }).first(); if (await fit.count()) { await fit.click(); await sleep(page, 500); }
      const cells = (nodeIn(await site(page), grid.id).children || []).slice(0, 3).map((c) => c.id);
      for (const [i, c] of cells.entries()) { const im = await into(page, c, 'Image'); await uploadPhoto(page, im, await photo(page, `grid${i}`, 300 - i * 40)); }
    }
    rec(J, 'U1 built: a hero, three Side by side and a Grid of As many as fit, every photo uploaded', !!grid && three.length === 3, `grid ${grid ? grid.id.slice(-4) : 'none'}`);
    await shot(page, 'U1-canvas');
    const { dir, files } = await downloadSite(page);
    const html = new TextDecoder().decode(files['index.html']);
    const copies = Object.keys(files).filter((f) => /^images\/.+-\d+\./.test(f));
    const sizesAttrs = [...html.matchAll(/<img [^>]*sizes="([^"]+)"/g)].map((m) => m[1]);
    rec(J, 'U1 LE5-1 the copies are media.photoWidths', MEDIA.photoWidths.every((w) => copies.some((f) => f.includes(`-${w}.`))), copies.slice(0, 6).join(', '));
    rec(J, 'U1 every photo has a MEASURED sizes — the three across are not the window', sizesAttrs.length >= 7 && sizesAttrs.filter((s) => /max-width/.test(s)).length >= 3, sizesAttrs.map((s) => s.slice(0, 70)).join(' | '));
    const srv = await serve(dir, nextPort()); const url = `http://localhost:${srv.address().port}/index.html`;
    const ctxBad = [];
    for (const dpr of [1, 2]) {
      const ctx = await page.context().browser().newContext({ deviceScaleFactor: dpr, viewport: { width: 360, height: 800 } }); const p2 = await ctx.newPage();
      for (const w of WIDTHS) {
        await p2.setViewportSize({ width: w, height: 800 }); await p2.goto(url, { waitUntil: 'load' });
        await p2.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))); });
        const pics = await p2.evaluate(() => [...document.querySelectorAll('img[srcset]')].map((i) => ({ shown: i.getBoundingClientRect().width, cur: i.currentSrc.split('/').pop(), set: i.getAttribute('srcset').split(', ').map((c) => { const [f, ww] = c.split(' '); return { f: f.split('/').pop(), w: parseInt(ww, 10) }; }) })));
        for (const pic of pics) {
          if (!pic.shown) continue; const need = pic.shown * dpr; const cur = pic.set.find((c) => c.f === pic.cur); const ideal = pic.set.find((c) => c.w >= need) || pic.set.at(-1);
          // the browser may keep a bigger copy it already has (a cache hit); a SMALLER one than needed is never right
          if (!cur || cur.w < Math.min(need, pic.set.at(-1).w) - 1) ctxBad.push(`${w}@${dpr}x ${pic.cur} ${cur?.w} < ${Math.round(need)}`);
          else if (cur.w > ideal.w && w <= 412 && dpr === 1) ctxBad.push(`${w}@1x fetched ${cur.w} where ${ideal.w} does (shown ${Math.round(pic.shown)})`);
        }
        if (w === 360 || w === 1280) await p2.screenshot({ path: path.join(OUT, `U1-served-${w}-${dpr}x.png`) });
      }
      await ctx.close();
    }
    srv.close();
    rec(J, `U1 the served site at all ${WIDTHS.length} widths × 1x and 2x: each picture is the smallest copy that is sharp enough`, !ctxBad.length, ctxBad.slice(0, 8).join(' | ') || 'every picture right-sized');
  },

  async upload(page, J) {
    const { sec, h } = await heroSection(page);
    await uploadVideo(page, sec, await webm(page)); await shot(page, 'U2-uploaded');
    let n = nodeIn(await site(page), sec);
    rec(J, 'U2 stored as media:<hash>.webm with a poster from its first frame', /^media:[0-9a-f]{64}\.webm$/.test(n?.bgVideo || '') && /^data:image\//.test(n?.bgVideoPoster || ''), `${n?.bgVideo} · poster ${String(n?.bgVideoPoster).slice(0, 20)}`);
    let v = await canvasVideo(page, sec);
    rec(J, 'U2 on the canvas it PLAYS, covers the section, the heading drawn over it', !!v && !v.paused && v.advanced !== 0 && v.cover && v.headingOnTop, JSON.stringify(v));
    await page.reload(); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 2500);
    v = await canvasVideo(page, sec);
    rec(J, 'U2 after a reload it is still there and plays (the media store kept it)', !!v && !v.paused && v.advanced !== 0 && v.src === 'blob:', JSON.stringify(v));
    // Replace with the same file → same name, stored once
    await videoPanel(page, sec); rec(J, 'U2 the button now says Replace the video', await ins(page).getByRole('button', { name: W.replace }).count() === 1, 'ok');
    // refusals: a .mov, and a file over the cap
    const mov = path.join(OUT, 'clip.mov'); fs.writeFileSync(mov, Buffer.alloc(2000)); const big = path.join(OUT, 'big.webm'); fs.writeFileSync(big, Buffer.alloc((MEDIA.videoMaxMb + 1) * 1024 * 1024));
    const before = nodeIn(await site(page), sec).bgVideo;
    for (const [f, want] of [[mov, /mp4 or webm/], [big, new RegExp(`${MEDIA.videoMaxMb} MB`)]]) {
      await videoPanel(page, sec); await ins(page).locator(`input[type="file"][aria-label="${W.upload}"]`).setInputFiles(f); await sleep(page, 1500);
      const said = await ins(page).getByRole('alert').first().innerText().catch(() => '');
      rec(J, `U2 ${path.basename(f)} refused with the reason, nothing changed`, want.test(said) && nodeIn(await site(page), sec).bgVideo === before, said.slice(0, 120));
    }
    void h;
  },

  async link(page, J) {
    await routeLink(page);
    const { sec } = await heroSection(page);
    await videoPanel(page, sec); const addr = ins(page).getByLabel(W.address, { exact: true });
    await addr.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); await sleep(page, 400);
    const said = await ins(page).getByRole('alert').first().innerText().catch(() => '');
    rec(J, 'U3 a YouTube address refused with the reason, nothing changed', said.includes('FILE') && !nodeIn(await site(page), sec).bgVideo, said.slice(0, 100));
    await addr.fill(LINK); await addr.blur(); await sleep(page, 2500);
    const n = nodeIn(await site(page), sec); const v = await canvasVideo(page, sec);
    rec(J, 'U3 an https .webm address plays behind the section', n?.bgVideo === LINK && !!v && !v.paused && v.advanced !== 0 && v.cover, JSON.stringify(v));
    await videoPanel(page, sec); await ins(page).locator(`input[type="file"][aria-label="${W.poster}"]`).setInputFiles(await photo(page, 'poster', 40)); await sleep(page, 2500);
    rec(J, 'U3 Upload a poster: that photo is the poster', /^data:image\//.test(nodeIn(await site(page), sec)?.bgVideoPoster || ''), 'set'); await shot(page, 'U3-link');
  },

  async publish(page, J) {
    const { sec } = await heroSection(page); await uploadVideo(page, sec, await webm(page));
    const f0 = await pvOpen(page); void f0; const bad = [];
    for (const w of WIDTHS) { const f = await pvAt(page, w, 820); const v = await pubVideo(f); if (!v || !v.cover || v.paused || !v.headingOnTop || !v.btnIn || v.sw > v.vw) bad.push(`${w}: ${JSON.stringify(v)}`); if (w === 375 || w === 1280) await pvShot(page, `U4-preview-${w}`); }
    rec(J, `U4 the Preview at all ${WIDTHS.length} widths: covers, plays, the heading on top, the disc inside, no sideways scroll`, !bad.length, bad.slice(0, 4).join(' | ') || 'all widths');
    // Tab to the button, Space pauses, Space plays
    let f = await pvAt(page, 1280, 820);
    const toggle = f.locator('.eu-bgvideo__toggle'); await f.locator('body').focus().catch(() => {});
    let reached = false; for (let i = 0; i < 25 && !reached; i++) { await page.keyboard.press('Tab'); reached = await toggle.evaluate((b) => document.activeElement === b).catch(() => false); }
    await page.keyboard.press('Space'); await sleep(page, 500); const p1 = await pubVideo(f);
    await page.keyboard.press('Space'); await sleep(page, 500); const p2 = await pubVideo(f);
    rec(J, 'U4 Tab reaches the disc; Space pauses (Play background video) and plays again (Pause background video)', reached && p1.paused && p1.label === W.play && !p2.paused && p2.label === W.pause, `reached ${reached} · ${p1.label}/${p1.paused} · ${p2.label}/${p2.paused}`);
    const fr = await toggle.evaluate((b) => getComputedStyle(b).outlineStyle); rec(J, 'U4 the disc shows where focus is', fr !== 'none', `outline ${fr}`);
    await pvClose(page, 1366);
    // canvas == Preview: the video's box is the block's on both
    const cv = await canvasVideo(page, sec); f = await pvOpen(page); f = await pvAt(page, 1280, 820); const pv = await pubVideo(f); await pvClose(page, 1366);
    rec(J, 'U4 canvas == Preview: covering on both, playing on both', cv?.cover && pv?.cover && !cv.paused && !pv.paused, `canvas ${JSON.stringify(cv)} · preview ${JSON.stringify(pv)}`);
    // reduced motion, and Save-Data (Save-Data is an init script that stays on this page — so it runs LAST)
    for (const [name, prep] of [['reduced motion', async () => page.emulateMedia({ reducedMotion: 'reduce' })], ['Save-Data', async () => page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, effectiveType: '4g' }, configurable: true }))]]) {
      await prep(); f = await pvOpen(page); f = await pvAt(page, 1280, 820);
      const diag = await f.evaluate(() => { const v = document.querySelector('video.eu-bgvideo'); const b = v?.parentElement; const t = b?.querySelector('.eu-bgvideo__toggle'); const cs = (e) => e && (({ display, visibility, opacity }) => ({ display, visibility, opacity }))(getComputedStyle(e)); const r = (e) => e && (({ x, y, width, height }) => ({ x: Math.round(x), y: Math.round(y), w: Math.round(width), h: Math.round(height) }))(e.getBoundingClientRect()); return { body: document.body?.innerHTML.length || 0, video: !!v, band: { ...cs(b), ...r(b) }, toggle: { ...cs(t), ...r(t) }, html: cs(document.documentElement), bodyCs: cs(document.body) }; }).catch((e) => ({ err: e.message }));
      const stored = nodeIn(await site(page), sec); rec(J, `U4 ${name}: the Preview reopened with the page in it`, diag.video === true, `${JSON.stringify(diag)} · stored video ${String(stored?.bgVideo).slice(0, 20)}`);
      if (!diag.video) { await shot(page, `U4-${name}-blank`); await pvClose(page, 1366); continue; }
      const still = await pubVideo(f);
      const hide = page.getByRole('button', { name: 'Hide the preview controls' }); if (await hide.isVisible().catch(() => false)) { await hide.click(); await sleep(page, 400); }
      await f.locator('.eu-bgvideo__toggle').click(); await sleep(page, 1200); const played = await pubVideo(f);
      const show = page.getByRole('button', { name: 'Show the preview controls' }); if (await show.isVisible().catch(() => false)) { await show.click(); await sleep(page, 300); }
      rec(J, `U4 ${name}: no video fetched, the poster shown, Play starts it`, !!still && still.paused && !still.hasSrc && still.label === W.play && played.hasSrc && !played.paused, `${JSON.stringify({ p: still?.paused, src: still?.hasSrc, l: still?.label })} → ${JSON.stringify({ p: played?.paused, src: played?.hasSrc })}`);
      await pvClose(page, 1366); await page.emulateMedia({ reducedMotion: null });
    }
    // the download carries the video and its poster, and the served site plays it
    const { dir, files } = await downloadSite(page); const html = new TextDecoder().decode(files['index.html']);
    const vids = Object.keys(files).filter((k) => /^videos\/[0-9a-f]{64}\.webm$/.test(k)); const poster = html.match(/<video class="eu-bgvideo"[^>]*poster="([^"]+)"/)?.[1];
    rec(J, 'U4 the ZIP carries videos/<hash>.webm and the poster as a file', vids.length === 1 && !!poster && !!files[poster], `${vids.join(',')} · poster ${poster}`);
    const srv = await serve(dir, nextPort()); const c3 = await page.context().browser().newContext(); const p3 = await c3.newPage(); await p3.goto(`http://localhost:${srv.address().port}/index.html`); await sleep(p3, 1500);
    const served = await pubVideo(p3.mainFrame()); await p3.screenshot({ path: path.join(OUT, 'U4-served.png') }); await c3.close(); srv.close();
    rec(J, 'U4 the served site plays the uploaded video behind the heading', !!served && !served.paused && served.advanced !== 0 && served.headingOnTop, JSON.stringify(served));
  },

  async tint(page, J) {
    const { sec } = await heroSection(page); await uploadVideo(page, sec, await webm(page));
    await videoPanel(page, sec); const hex = ins(page).getByLabel('Tint over background hex value').first(); await hex.fill('#00000099'); await hex.press('Enter'); await sleep(page, 600);
    const order = (root) => root.evaluate((id) => { const b = document.querySelector(`[data-box-id="${id}"]`) || document.querySelector(`.bx-${id}`); const v = b?.querySelector(':scope > video.eu-bgvideo'), s = b?.querySelector(':scope > .eu-bgvideo__shade'); const hd = b?.querySelector('h1,h2,h3'); if (!v || !s || !hd) return null; const r = hd.getBoundingClientRect(); const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { shadeAfterVideo: !!(v.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING), shadeBg: getComputedStyle(s).backgroundImage.slice(0, 40), headingOnTop: hd.contains(top) || top === hd }; }, sec);
    const c = await order(page.mainFrame()); let f = await pvOpen(page); f = await pvAt(page, 1280, 820); const pz = await f.evaluate(() => { const b = document.querySelector('video.eu-bgvideo')?.parentElement; const s = b?.querySelector('.eu-bgvideo__shade'); const hd = b?.querySelector('h1,h2,h3'); const r = hd?.getBoundingClientRect(); const top = r && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return s ? { shadeBg: getComputedStyle(s).backgroundImage.slice(0, 40), headingOnTop: !!top && (hd.contains(top) || top === hd) } : null; }); await pvShot(page, 'U5-preview-tint'); await pvClose(page, 1366);
    rec(J, 'U5 the tint is a shade over the video and under the heading — canvas and Preview', !!c && c.shadeAfterVideo && /gradient/.test(c.shadeBg) && c.headingOnTop && !!pz && /gradient/.test(pz.shadeBg) && pz.headingOnTop, `canvas ${JSON.stringify(c)} · preview ${JSON.stringify(pz)}`);
    await videoPanel(page, sec); await ins(page).getByRole('button', { name: W.remove }).click(); await sleep(page, 600);
    let n = nodeIn(await site(page), sec); const gone = !n.bgVideo && !n.bgVideoPoster && !(await page.locator(`[data-box-id="${sec}"] > video.eu-bgvideo`).count());
    await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 1200);
    n = nodeIn(await site(page), sec); const back = /^media:/.test(n.bgVideo || '') && !!n.bgVideoPoster && !!(await page.locator(`[data-box-id="${sec}"] > video.eu-bgvideo`).count());
    rec(J, 'U5 Remove video takes the video, the poster and the shade off; one Ctrl+Z brings them back', gone && back, `gone ${gone} · back ${back}`);
    // LE5-14 · the tint that ARRIVED (the section had none), the words light on it, Clear takes it off, the Page check then names it
    const fresh = await heroSection(page); await uploadVideo(page, fresh.sec, await webm(page));
    const arrived = nodeIn(await site(page), fresh.sec)?.bgOverlay;
    const wordsL = await page.evaluate((id) => { const h = document.querySelector(`[data-box-id="${id}"]`); const cx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true }); cx.fillStyle = getComputedStyle(h.querySelector('h1,h2,h3') || h).color; cx.fillRect(0, 0, 1, 1); const [r, g, b] = cx.getImageData(0, 0, 1, 1).data; return +((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255).toFixed(2); }, fresh.h);
    rec(J, 'U5 LE5-14 a tint ARRIVES with the video, and the words are light on it', arrived === MEDIA.tintStart && wordsL > 0.75, `tint ${arrived} · words lightness ${wordsL}`);
    await videoPanel(page, fresh.sec); await ins(page).getByRole('button', { name: 'Tint over background palette' }).click(); await sleep(page, 300);
    await page.getByRole('button', { name: 'Clear Tint over background — no colour' }).click(); await sleep(page, 500);
    const cleared = nodeIn(await site(page), fresh.sec)?.bgOverlay === undefined;
    await deselect(page); await H.panel(page, false); await page.getByRole('button', { name: /^Page check/ }).first().click(); const dlg = page.getByRole('dialog').filter({ hasText: 'Page check' }).first(); await dlg.waitFor(); await sleep(page, 1500);
    const said = (await dlg.innerText()).replace(/\s+/g, ' '); await shot(page, 'U5-page-check'); await page.keyboard.press('Escape'); await sleep(page, 400);
    rec(J, 'U5 LE5-14 Clear takes the tint off, and the Page check then names words over a video with no tint', cleared && /sit over a video with no tint/.test(said), `cleared ${cleared} · ${said.match(/The words on this block[^.]*\./)?.[0] || said.slice(0, 120)}`);
  },

  async photoTint(page, J) {
    // LE5-14 · the same for a background PHOTO, uploaded through Design → Background → Upload an image
    const { sec } = await heroSection(page);
    await at(page, sec, 'Design', 'Background'); await ins(page).locator('input[aria-label="Upload background image"]').setInputFiles(await photo(page, 'bandphoto', 30)); await sleep(page, 2500);
    const n = nodeIn(await site(page), sec);
    rec(J, 'U5 LE5-14 a tint ARRIVES with a background photo too', /^data:image/.test(n?.bgImage || '') && n?.bgOverlay === MEDIA.tintStart, `bgImage ${String(n?.bgImage).slice(0, 15)} · tint ${n?.bgOverlay}`);
    await pvOpen(page); await pvAt(page, 1280, 820); await pvShot(page, 'U5-photo-tint'); await pvClose(page, 1366);
  },

  async chrome(page, J) {
    const base = process.env.BASE || 'http://localhost:3100';
    await routeLink(page);
    for (const theme of ['light', 'dark', 'midnight', 'purple']) {
      await page.evaluate(() => sessionStorage.removeItem('kept')).catch(() => {});
      await page.goto(`${base}/website/box-demo?theme=${theme}`); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1200);
      await page.setViewportSize({ width: 1366, height: 860 }); await sleep(page, 400);
      const { sec } = await heroSection(page);
      for (const w of [375, 768, 1280, 1536]) {
        await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 500); const ev = []; let ok = true;
        try {
          await videoPanel(page, sec);
          const addr = ins(page).getByLabel(W.address, { exact: true }); await addr.focus(); await page.keyboard.type('https://youtu.be/x'); await sleep(page, 300);
          const al = ins(page).getByRole('alert').first(); const cr = await al.evaluate(CONTRAST).catch(() => 0); ev.push(`refusal ${cr}:1`); if (cr < 4.5) ok = false;
          const desc = await ins(page).getByRole('button', { name: new RegExp(W.upload) }).first().getAttribute('aria-describedby'); const alId = await al.getAttribute('id'); ev.push(`linked ${desc === alId}`); if (desc !== alId) ok = false;
          await addr.fill(''); await addr.focus(); await page.keyboard.type(LINK); const typed = await addr.inputValue(); await page.keyboard.press('Tab');
          let set = false; for (let k = 0; k < 15 && !set; k++) { await sleep(page, 200); set = nodeIn(await site(page), sec).bgVideo === LINK; }
          if (!set) { ok = false; ev.push(`link not set by keyboard (field held ${typed.slice(0, 40)})`); await shot(page, `U6-link-${theme}-${w}`); }
          // Tab reaches Upload a poster and Remove video; Enter on Remove takes it off — counting where the Tab above already landed
          let hit = { poster: false, remove: false };
          { const nm = await page.evaluate(() => document.activeElement?.textContent?.trim() || ''); if (nm.includes(W.poster)) hit.poster = true; }
          for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); const nm = await page.evaluate(() => document.activeElement?.textContent?.trim() || ''); if (nm.includes(W.poster)) hit.poster = true; if (nm.includes(W.remove)) { hit.remove = true; break; } }
          ev.push(`tab ${JSON.stringify(hit)}`); if (!hit.poster || !hit.remove) ok = false;
          await page.keyboard.press('Enter'); await sleep(page, 500); if (nodeIn(await site(page), sec).bgVideo) { ok = false; ev.push('Enter on Remove did nothing'); }
          const clipped = await ins(page).getByRole('group', { name: W.heading }).first().evaluate((g) => [...g.querySelectorAll('button')].filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent));
          ev.push(`clipped ${clipped.length}`); if (clipped.length) ok = false;
          if (w === 375 || w === 1536) await shot(page, `U6-${theme}-${w}`);
        } catch (e) { ok = false; ev.push(e.message.split('\n')[0]); await shot(page, `U6-ERR-${theme}-${w}`); }
        rec(J, `U6 ${theme} · ${w}: the video controls by keyboard, the refusal readable and linked, nothing clipped`, ok, ev.join(' · '));
      }
    }
  },

  async pinned(page, J) {
    const hdr = await first(page, 'Stack'); const h = await into(page, hdr, 'Heading'); await words(page, h, 'Greenfield Academy');
    await I.background(page, hdr, '#0f172a');
    await at(page, hdr, 'Design', 'Background'); await ins(page).locator('input[aria-label="Upload background image"]').setInputFiles(await photo(page, 'band', 120)); await sleep(page, 2500);
    await at(page, hdr, 'Design', 'Outline & effects'); await X.slider(page, 'See-through', 60);
    await I.sticky(page, hdr);
    // four sections of their own BELOW the header (page-level, never inside it — pass 1 dropped them into the header)
    for (let i = 0; i < 4; i++) { const s = await first(page, 'Stack'); const t = await into(page, s, 'Text'); await words(page, t, 'A long page of school news. '.repeat(30)); }
    const hn = nodeIn(await site(page), hdr); rec(J, 'U7 built: the header pinned, See-through, a photo behind it, four sections after it', !!hn?.pin && hn.opacity < 100 && /^data:image/.test(hn.bgImage || '') && !(hn.children || []).some((c) => c.type === 'container' && (c.children || []).some((k) => k.type === 'text')), `pin ${hn?.pin} · opacity ${hn?.opacity} · kids ${(hn?.children || []).length}`);
    let f = await pvOpen(page); f = await pvAt(page, 1280, 700);
    const at0 = await f.evaluate((id) => document.querySelector(`.bx-${id}`).getBoundingClientRect().top, hdr);
    await f.evaluate(() => scrollTo(0, 1500)); await sleep(page, 600);
    const r = await f.evaluate((id) => { const e = document.querySelector(`.bx-${id}`); let s = e; while (s && !/sticky|fixed/.test(getComputedStyle(s).position)) s = s.parentElement; return { scrolled: Math.round(scrollY), top: Math.round(e.getBoundingClientRect().top), held: s ? (s === e ? 'the header' : s.className.split(' ')[0]) : 'nothing', op: getComputedStyle(e, '::before').opacity }; }, hdr);
    await pvShot(page, 'U7-pinned-scrolled'); await pvClose(page, 1366);
    rec(J, 'U7 LE5-4 a pinned, see-through header over a photo stays at the top when the page is scrolled', r.scrolled > 400 && Math.abs(r.top) <= 1 && r.held !== 'nothing' && Number(r.op) < 1, `before ${Math.round(at0)} · after ${JSON.stringify(r)}`);
  },
};

(async () => {
  const names = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...names];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, `${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
      rec(J, 'console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, names.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
