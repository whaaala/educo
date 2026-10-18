// HEADED UAT — BATCH LE-13 · flow and overlap (docs/TASK_TREE.md, "BATCH LE-13", checklist U1 … U4).
// Every state BUILT THROUGH THE UI (RULE Y): palette tiles, the Inspector's Position (Wrap words round it) and Arrange (When it
// doesn't fit · Overlap the section above). Six visible windows; the Preview at every width of screens.js (RULE Z); pictures with the
// Preview's controls hidden (pvShot); localStorage is only READ, to report what was stored.
//   wrap       U1 · FL-3 a picture and three paragraphs in a Stack: Start — words beside it, then under it; Off puts it back
//   wrapEnd    U1 · FL-3 End mirrors it; below config flow.wrapBelowRem the picture takes the line; 200 % text
//   strip      U2 · FL-6 six cards → Scroll sideways: one line, a peek, snap, Tab + arrows; Wrap to new lines puts it back
//   stripPhone U2 · FL-6 set on Mobile only: a strip on the phone, wrapped lines on a desktop
//   overlap    U3 · PO-4 a coloured hero and a section of three cards → Medium: in front, nothing covered; Off on Mobile only
//   chrome     U4 · the three controls by keyboard in four editor themes × 375 · 768 · 1280 · 1536; hints readable; only where they work
//              (LE-13b U6: + Words follow, only with the wrap on)
// BATCH LE-13b · FL-3b, words follow its shape (checklist U1 … U6 of LE-13b):
//   shapeRound  U1 · the Circle style + Wrap → Start + Words follow → Its round corners: the lines follow the curve, a gap away;
//               canvas == Preview; below flow.wrapBelowRem the whole line (U4); 200 % text
//   shapeEnd    U1 · the same at End, the curve on the other side
//   shapeCut    U2 · a PNG disc on clear, uploaded, Start, A cut-out's outline: traced to a polygon, the lines follow the disc; the
//               DOWNLOADED site served over HTTP: the outline in the page, the picture fetched once at 375 and 1280; replaced by another
//               cut-out: a new outline (LE13b-9 — a url() shape is laid out at the image's own pixel size in Chrome, so it is traced)
//   shapePhone  U5 · Its round corners on the Mobile screen only: the curve on a phone, the box from the tablet up
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le13-headed.js [--only=wrap,strip]
const path = require('path'); const fs = require('fs'); const http = require('http');
const { unzipSync, strFromU8 } = require('fflate');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const { WIDTHS } = require('./screens.js');
const X = require('./uat-rx3-headed.js'); const { site, sleep, deselect, at, ins, pvOpen, pvAt, pvClose, chip } = X;
const W = require('../../config/inspector.json').flow;
const FLOW = require('../../config/layout.json').flow;
const DOCK_FROM = require('../../config/layout.json').editor.dockFrom; // the Inspector docks from here (RULE CFG)
const OUT = path.join(__dirname, 'logs', 'le13'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
async function pvShot(page, name) {
  const hide = page.getByRole('button', { name: 'Hide the preview controls' }); const hid = await hide.isVisible().catch(() => false);
  if (hid) { await hide.click(); await sleep(page, 300); }
  await shot(page, name);
  if (hid) { await page.getByRole('button', { name: 'Show the preview controls' }).click().catch(() => {}); await sleep(page, 300); }
}
const LONG = 'Our head teacher writes to every family at the start of each term: what is new, who has joined us, and what the term holds — the library, the sports day, the concerts and the trips.';

async function closeIns(page) { if (page.viewportSize().width >= DOCK_FROM) return; const c = page.getByRole('button', { name: 'Collapse inspector' }); if (await c.isVisible().catch(() => false)) { await c.click(); await sleep(page, 300); } }
async function first(page, tile) { await deselect(page); await closeIns(page); await H.panel(page, true); return P.first(page, tile); }
async function into(page, id, tile) { await closeIns(page); await H.panel(page, true); return P.into(page, id, tile); }
async function under(page, id, tile) { await closeIns(page); await H.panel(page, true); return P.under(page, id, tile); }
async function beside(page, id, tile) { await closeIns(page); await H.panel(page, true); return P.beside(page, id, tile); }
const kidsOf = async (page, id, mine) => ((nodeIn(await site(page), id).n?.children) || []).map((k) => k.id).filter((k) => !mine || mine.includes(k));
async function words(page, id, w) { await at(page, id, 'Content'); const f = ins(page).getByLabel(/^(Text|Link text|Words|Heading|Button text|Label)$/).first(); await f.fill(w); await f.blur(); await sleep(page, 400); }
async function sec(page, id, name) {
  await H.panel(page, false);
  for (const tab of ['Layout', 'Design']) { await at(page, id, tab); const h = ins(page).getByRole('button', { name, exact: true }).first(); if (await h.count()) { if ((await h.getAttribute('aria-expanded')) === 'false') { await h.click(); await sleep(page, 250); } return; } }
  throw new Error(`no ${name} section for ${id.slice(-4)}`);
}
/** Click one choice of a Segmented row (a group named by its words) in a block's section. */
async function pick(page, id, section, group, choice) { await sec(page, id, section); const g = ins(page).getByRole('group', { name: group, exact: true }).first(); await g.scrollIntoViewIfNeeded(); await g.getByRole('button', { name: choice, exact: true }).click(); await sleep(page, 500); }
async function colour(page, id, hex) { await at(page, id, 'Design', 'Background'); const f = ins(page).getByLabel('Background colour hex value').first(); await f.fill(hex); await f.press('Enter'); await sleep(page, 300); }
const allIds = (s) => { const o = []; const w = (n) => { o.push(n.id); (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return o; };
const nodeIn = (s, id) => { let n = null, p = null; const w = (x, par) => { if (x.id === id) { n = x; p = par; } (x.children || []).forEach((c) => w(c, x)); }; s.pages.forEach((pg) => w(pg.root, null)); return { n, p }; };
/** What the screen being edited stored: the phone / tablet editor writes its own screen OVER the base (LE4-5). */
const own = (n, k) => { const r = Object.values(n?.responsive || {}).map((x) => x?.[k]).find((v) => v !== undefined); return r !== undefined ? r : n?.[k]; };
/** The value a click CHANGED — base or any screen — so a width after 375 is not read off the phone's slot (LE13-7e). */
const changed = (a, b, k) => {
  const slots = [[a?.[k], b?.[k]], ...Object.keys({ ...(a?.responsive || {}), ...(b?.responsive || {}) }).map((s) => [a?.responsive?.[s]?.[k], b?.responsive?.[s]?.[k]])];
  const hit = slots.find(([x, y]) => JSON.stringify(x) !== JSON.stringify(y)); return hit ? hit[1] : 'unchanged';
};
async function sideBySide(page, tiles) {
  const host = await first(page, 'Stack'); const before = new Set(allIds(await site(page)));
  await into(page, host, 'Side by side'); const s = await site(page);
  let row = null; const w = (n) => { if (!row && n.direction === 'row' && !n.rowBand && !before.has(n.id)) row = n; (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root));
  if (!row) throw new Error('"Side by side" made no row');
  const born = (row.children || []).map((k) => k.id);
  for (const t of tiles) { const prev = (await kidsOf(page, row.id)).at(-1); if (prev) await beside(page, prev, t); else await into(page, row.id, t); }
  for (const b of born) { await H.panel(page, false); await H.select(page, b); await page.keyboard.press('Delete'); await sleep(page, 400); }
  const all = await kidsOf(page, row.id);
  if (all.length !== tiles.length) throw new Error(`Side by side holds ${all.length} blocks, ${tiles.length} were dropped`);
  return { host, row: row.id, kids: all };
}
const rects = (f, ids) => f.evaluate((ids) => {
  const out = { vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth };
  for (const id of ids) { const e = document.querySelector(`.bx-${id}`); const r = e?.getBoundingClientRect(); const p = e?.matches('p') ? e : e?.querySelector('p'); out[id] = r ? { fl: getComputedStyle(e).float, pr: +(p || e).getBoundingClientRect().right.toFixed(1), l: +r.left.toFixed(1), r: +r.right.toFixed(1), t: +(r.top + scrollY).toFixed(1), b: +(r.bottom + scrollY).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } : null; }
  return out;
}, ids);
/** The LINES of a block's words (each text run's own rectangles, page coordinates) — `sel` finds the block in either renderer. */
const LINES = (sel, z) => { const e = document.querySelector(sel); if (!e) return null; const out = []; const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { if (!n.textContent.trim()) continue; const r = document.createRange(); r.selectNodeContents(n); for (const x of r.getClientRects()) if (x.width > 1) out.push({ l: +(x.left / z).toFixed(1), r: +(x.right / z).toFixed(1), t: +((x.top + scrollY) / z).toFixed(1), b: +((x.bottom + scrollY) / z).toFixed(1) }); } return out; };
const lines = (f, id) => f.evaluate(`(${LINES})(".bx-${id}", 1)`);
const canvasZ = (page) => page.evaluate(() => Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1);
const canvasLines = async (page, id) => page.evaluate(`(${LINES})('[data-box-id="${id}"]', ${await canvasZ(page)})`);
const canvasRects = (page, ids) => page.evaluate((ids) => {
  const z = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1; const out = {};
  for (const id of ids) { const r = document.querySelector(`[data-box-id="${id}"]`)?.getBoundingClientRect(); out[id] = r ? { l: r.left / z, r: r.right / z, t: r.top / z, b: r.bottom / z, w: +(r.width / z).toFixed(1), h: +(r.height / z).toFixed(1) } : null; }
  return out;
}, ids);
const near = (a, b, d = 1.5) => Math.abs(a - b) <= d;
const REM = 16; // the Preview's root font size (browser default) — a measurement, not a stored value
/** A Stack with a picture and three paragraphs, built through the palette: the picture first, each paragraph under the one before. */
async function photoStory(page) {
  const st = await first(page, 'Stack'); const pic = await into(page, st, 'Image');
  const t = []; let prev = pic; for (let i = 0; i < 3; i++) { prev = await under(page, prev, 'Text'); t.push(prev); }
  for (const id of t) await words(page, id, `${LONG} ${LONG}`);
  return { st, pic, t };
}
/** U1's geometry at one width: floated beside → the first words beside it and later words under it; taking the line → words below. */
function wrapCheck(r, P, st, pic, side, t) {
  const L = P.flat();
  const floats = r[pic].fl ? r[pic].fl !== 'none' : r[pic].w < r[st].w - 20; // LE13b-11: what the browser says — a 10rem picture that stopped floating is still narrower than its Stack
  const bad = [];
  if (r.sw > r.vw) bad.push(`sideways ${r.sw}`);
  if (floats) {
    if (side === 'start' && !near(r[pic].l, r[st].l, 1.5)) bad.push(`picture not at the start ${r[pic].l} vs ${r[st].l}`);
    if (side === 'end' && !near(r[pic].r, r[st].r, 1.5)) bad.push(`picture not at the end ${r[pic].r} vs ${r[st].r}`);
    const beside = L.filter((x) => x.t < r[pic].b - 2);
    const below = P.flatMap((p) => [...p].sort((x, y) => x.t - y.t).slice(0, -1)).filter((x) => x.t >= r[pic].b + 2); // LE13-7f: a paragraph's last line is short by nature
    if (!beside.length) bad.push('no words beside the picture');
    if (side === 'start' && beside.some((x) => x.l < r[pic].r + FLOW.wrapGapRem * REM - 1.5)) bad.push(`a word touches the picture: ${Math.min(...beside.map((x) => x.l))} vs ${r[pic].r}`);
    if (side === 'end' && beside.some((x) => x.r > r[pic].l - FLOW.wrapGapRem * REM + 1.5)) bad.push(`a word touches the picture: ${Math.max(...beside.map((x) => x.r))} vs ${r[pic].l}`);
    const reaches = side === 'start' || t.some((id) => r[id].pr > r[pic].l + 20); // LE13-7i: a paragraph capped at its measure short of an End picture has nothing to return under
    if (reaches && below.length && !below.some((x) => near(x.l, r[st].l, 3) && x.r > (side === 'start' ? r[pic].r : r[pic].l) + 20)) bad.push(`the words never return under the picture (${below.length} lines below its foot ${r[pic].b}: ${JSON.stringify(below.slice(0, 2))} · Stack ${r[st].l}–${r[st].r} · picture ${r[pic].l}–${r[pic].r})`); // LE13-7a: the line START, under it
  } else if (L.length && Math.min(...L.map((x) => x.t)) < r[pic].b - 1) bad.push(`words beside a full-line picture ${Math.min(...L.map((x) => x.t))} < ${r[pic].b}`);
  return { floats, bad };
}

/** A text's contrast against the first opaque background behind it, measured on what is drawn (run in the page). */
const CONTRAST = (el) => {
  const cx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
  const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); return [...cx.getImageData(0, 0, 1, 1).data]; };
  let bg = null; for (let e = el; e && !bg; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c[3] === 255) bg = c; }
  const lum = ([r, g, b]) => { const q = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * q(r) + 0.7152 * q(g) + 0.0722 * q(b); };
  const [a, b] = [lum(rgb(getComputedStyle(el).color)), lum(bg || [255, 255, 255])].sort((x, y) => y - x); return +((a + 0.05) / (b + 0.05)).toFixed(2);
};
// ── LE-13b · the words follow its shape ──────────────────────────────────────────────────────────────────────────────────────
/** A disc on a clear 600 × 400 PNG — a cut-out made in the page's own canvas (no dependency), saved for the Upload. */
const DISC = { w: 600, h: 400, r: 180, cx: 300, name: 'disc' }, DISC2 = { w: 600, h: 400, r: 110, cx: 140, name: 'disc-left' };
async function discPng(page, d = DISC) {
  const b64 = await page.evaluate((d) => { const c = Object.assign(document.createElement('canvas'), { width: d.w, height: d.h }); const x = c.getContext('2d'); x.fillStyle = '#1d4ed8'; x.beginPath(); x.arc(d.cx, d.h / 2, d.r, 0, Math.PI * 2); x.fill(); return c.toDataURL('image/png').split(',')[1]; }, d);
  const p = path.join(OUT, `${d.name}.png`); fs.writeFileSync(p, Buffer.from(b64, 'base64')); return p;
}
/** Is the picture's circle followed? `circle` {cx, cy, R} in the frame's page coordinates; lines beside it must stay a gap off the
 *  circle (a line band is shortened by the float area nearest the centre), and they must come in over the box somewhere (not its box). */
function shapeCheck(r, P, pic, side, circle, wantShape = true, ids = []) {
  const gap = FLOW.wrapGapRem * REM, bad = [];
  const beside = P.flat().filter((x) => x.t < r[pic].b - 2 && x.b > r[pic].t + 2);
  if (!beside.length) return { bad: ['no words beside the picture'] };
  let inOver = 0;
  for (const x of beside) {
    const dy = x.b < circle.cy ? circle.cy - x.b : x.t > circle.cy ? x.t - circle.cy : 0;
    const chord = dy < circle.R ? Math.sqrt(circle.R ** 2 - dy ** 2) : null;
    if (side === 'start') {
      if (chord != null && x.l < circle.cx + chord + gap - 2) bad.push(`a line at ${x.t} starts ${x.l}, inside the curve + gap ${(circle.cx + chord + gap).toFixed(1)} (picture ${r[pic].l}–${r[pic].r} × ${r[pic].t}–${r[pic].b})`);
      if (x.l < r[pic].r + gap - 1) inOver++;
    } else {
      if (chord != null && x.r > circle.cx - chord - gap + 2) bad.push(`a line at ${x.t} ends ${x.r}, inside the curve + gap ${(circle.cx - chord - gap).toFixed(1)} (picture ${r[pic].l}–${r[pic].r} × ${r[pic].t}–${r[pic].b})`);
      if (x.r > r[pic].l - gap + 1) inOver++;
    }
  }
  // LE13b-6 · at End a paragraph capped at its reading width may stop short of the picture: then nothing can come in over its box
  const reaches = side === 'start' || !ids.length || ids.some((id) => r[id] && r[id].pr > r[pic].l - gap + 1);
  if (wantShape && reaches && !inOver) bad.push(`no line comes in over the picture's box (${beside.length} beside) — its box, not its shape`);
  if (!wantShape && inOver) bad.push(`${inOver} lines come in over the box — a shape where its box was asked for`);
  return { bad, beside: beside.length, inOver, reaches };
}
const circleOf = (rc) => ({ cx: rc.l + rc.w / 2, cy: rc.t + rc.h / 2, R: Math.min(rc.w, rc.h) / 2 });
const discOf = (rc, d = DISC) => { const s = rc.w / d.w; return { cx: rc.l + d.cx * s, cy: rc.t + rc.h / 2, R: d.r * s }; };
/** The Image's Circle style (radius 999, 10rem × 10rem) — how a person makes a round head-teacher photo. */
async function circleStyle(page, pic) { await at(page, pic, 'Design'); await ins(page).getByRole('group', { name: 'Style presets' }).getByRole('button', { name: 'Circle style' }).first().click(); await sleep(page, 500); }
/** Every width of screens.js: the shape where it floats, the whole line below wrapBelowRem; canvas == Preview at 1280. */
async function shapeSweep(page, J, { st, pic, t }, side, label, geo, tag, opts = {}) {
  const bad = []; let floated = 0, full = 0, short = 0; let f = await pvOpen(page);
  for (const w of WIDTHS) {
    f = await pvAt(page, w); const r = await rects(f, [st, pic, ...t]); const P = await Promise.all(t.map((id) => lines(f, id)));
    const floats = r[pic].fl !== 'none';
    const shaped = opts.shapedAt ? opts.shapedAt(w) : true;
    if (!floats && opts.round && Math.abs(r[pic].w - r[pic].h) > 1) bad.push(`${w}: the round picture is ${r[pic].w} × ${r[pic].h} where it takes the line — not round (LE13b-11)`);
    if (floats) { floated++; const c = shapeCheck(r, P, pic, side, geo(r[pic]), shaped, t); if (!c.reaches) short++; bad.push(...c.bad.map((b) => `${w}: ${b}`)); if (c.bad.length) { await pvShot(page, `${tag}-FAIL-${w}`); fs.writeFileSync(path.join(OUT, `${tag}-FAIL-${w}.json`), JSON.stringify({ r, P }, null, 1)); } }
    else { full++; const c = wrapCheck(r, P, st, pic, side, t); bad.push(...c.bad.map((b) => `${w}: ${b}`)); }
    if (r.sw > r.vw) bad.push(`${w}: sideways ${r.sw}`);
    if (floats && r[st].w < FLOW.wrapBelowRem * REM - 1) bad.push(`${w}: floats in a ${r[st].w}px Stack`);
    if ([375, 768, 1280, 1920].includes(w)) await pvShot(page, `${tag}-${w}`);
  }
  rec(J, `${label} at ${WIDTHS.length} widths: the lines follow its shape a gap away where it floats (${floated}${short ? `, ${short} where its capped paragraphs stop short of it` : ''}), the whole line below ${FLOW.wrapBelowRem}rem (${full}), never sideways`, !bad.length && floated > 0 && (opts.noFull || full > 0), bad.slice(0, 3).join(' | ') || 'ok');
  if (!opts.skip200) {
    f = await pvAt(page, 1280); await f.evaluate(() => { document.documentElement.style.fontSize = '200%'; }); await sleep(page, 400);
    const r = await rects(f, [st, pic, ...t]); const P = await Promise.all(t.map((id) => lines(f, id)));
    const c = r[pic].fl !== 'none' ? shapeCheck(r, P, pic, side, geo(r[pic]), true, t) : wrapCheck(r, P, st, pic, side, t);
    await pvShot(page, `${tag}-1280-200pct`); await f.evaluate(() => { document.documentElement.style.fontSize = ''; });
    rec(J, `${label} at 200 % text: still laid out, never sideways`, !c.bad.length && r.sw <= r.vw, c.bad.join(' | ') || 'ok');
  }
  await pvClose(page, 1366);
}
/** The canvas draws the same lines as the Preview at 1280: each beside-line's start (or end) within 2px, relative to the Stack. */
async function canvasMatches(page, J, { st, pic, t }, side, label) {
  await chip(page, 'Desktop (1280px)'); await deselect(page); await sleep(page, 500);
  const cv = await canvasRects(page, [st, pic]); const cl = await canvasLines(page, t[0]);
  let f = await pvOpen(page); f = await pvAt(page, 1280); const r = await rects(f, [st, pic]); const pl = await lines(f, t[0]); await pvClose(page, 1366);
  const k = Math.min(cl.length, pl.length, 6); const d = [];
  for (let i = 0; i < k; i++) d.push(+(side === 'start' ? (cl[i].l - cv[st].l) - (pl[i].l - r[st].l) : (cv[st].r - cl[i].r) - (r[st].r - pl[i].r)).toFixed(1));
  rec(J, `${label} canvas == Preview at 1280: the first ${k} lines of the first paragraph start where the Preview's do (±2px)`, k >= 3 && d.every((x) => Math.abs(x) <= 2), `differences ${d.join(' ')}`);
}
/** Serve a folder over HTTP — the downloaded site, as a host would. */
function serve(dir, port) {
  const types = { '.html': 'text/html', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.js': 'text/javascript', '.woff2': 'font/woff2' };
  const srv = http.createServer((q, s) => { const f = path.join(dir, decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, '') || 'index.html'); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s); });
  return new Promise((ok) => srv.listen(port, () => ok(srv)));
}
async function downloadSite(page) {
  await H.panel(page, false); const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export' }).first().click()]);
  const zip = path.join(OUT, `site-${Date.now()}.zip`); await dl.saveAs(zip); const files = unzipSync(fs.readFileSync(zip));
  const dir = path.join(OUT, `site-${Date.now()}`); for (const [n, b] of Object.entries(files)) { const p = path.join(dir, n); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, b); }
  return { dir, files };
}

const JOBS = {
  async shapeRound(page, J) {
    const story = await photoStory(page); const { pic } = story;
    await circleStyle(page, pic);
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.start);
    await pick(page, pic, 'Position', W.shape, W.shapeChoices.round); await shot(page, 'LE13b-U1-round-inspector');
    const n = nodeIn(await site(page), pic).n;
    rec(J, 'LE13b U1 stored: the Circle style and Words follow → Its round corners', own(n, 'wrapShape') === 'round' && n.radius >= 999, `wrapShape ${own(n, 'wrapShape')} · radius ${n.radius} · width ${n.width}`);
    await canvasMatches(page, J, story, 'start', 'LE13b U1 round');
    await shapeSweep(page, J, story, 'start', 'LE13b U1/U4 round, Start', circleOf, 'LE13b-U1-round', { round: true });
    // back to its box: the lines keep to the rectangle (U3)
    await pick(page, pic, 'Position', W.shape, W.shapeChoices.box);
    rec(J, 'LE13b U3 Its box: nothing stored', own(nodeIn(await site(page), pic).n, 'wrapShape') == null, `wrapShape ${own(nodeIn(await site(page), pic).n, 'wrapShape')}`);
    let f = await pvOpen(page); f = await pvAt(page, 1280); const r = await rects(f, [story.st, pic, ...story.t]); const P = await Promise.all(story.t.map((id) => lines(f, id)));
    const c = shapeCheck(r, P, pic, 'start', circleOf(r[pic]), false); await pvShot(page, 'LE13b-U3-box-1280'); await pvClose(page, 1366);
    rec(J, 'LE13b U3 Its box at 1280: no line comes in over the rounded picture\'s box', !c.bad.length, c.bad.join(' | ') || `${c.beside} lines beside, all off the box`);
  },

  async shapeEnd(page, J) {
    const story = await photoStory(page); const { pic } = story;
    await circleStyle(page, pic);
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.end);
    await pick(page, pic, 'Position', W.shape, W.shapeChoices.round);
    await canvasMatches(page, J, story, 'end', 'LE13b U1 round, End');
    await shapeSweep(page, J, story, 'end', 'LE13b U1/U4 round, End', circleOf, 'LE13b-U1-end', { skip200: true, round: true });
  },

  async shapeCut(page, J) {
    const story = await photoStory(page); const { st, pic, t } = story;
    const upload = async (file) => { await H.select(page, pic); await page.locator('input[aria-label="Upload image"]').last().setInputFiles(file); await sleep(page, 2500); };
    await upload(await discPng(page));
    let n = nodeIn(await site(page), pic).n;
    rec(J, 'LE13b U2 the cut-out uploaded through the Image (kept see-through: PNG or WebP, its own size recorded)', /^data:image\/(png|webp)/.test(n?.src || '') && n.imgW === DISC.w && n.imgH === DISC.h, `src ${String(n?.src).slice(0, 22)} · ${n?.imgW} × ${n?.imgH}`);
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.start);
    await pick(page, pic, 'Position', W.shape, W.shapeChoices.outline); await sleep(page, 800); await shot(page, 'LE13b-U2-outline-inspector');
    n = nodeIn(await site(page), pic).n; const first = n?.wrapOutline;
    rec(J, 'LE13b U2 stored: Words follow → A cut-out\'s outline, and the outline traced from the picture (a polygon in %)', own(n, 'wrapShape') === 'outline' && /^polygon\(/.test(first || ''), `wrapShape ${own(n, 'wrapShape')} · ${String(first).slice(0, 70)}… (${(first || '').split(',').length} points)`);
    await canvasMatches(page, J, story, 'start', 'LE13b U2 outline');
    await shapeSweep(page, J, story, 'start', 'LE13b U2/U4 outline, Start', discOf, 'LE13b-U2-outline', { skip200: true });
    // the published site: download, serve over HTTP — the outline is in the page; the picture is one file with its phone copies
    const { dir, files } = await downloadSite(page);
    const html = strFromU8(files['index.html'] || Object.entries(files).find(([k]) => k.endsWith('.html'))[1]);
    const pics = Object.keys(files).filter((k) => k.startsWith('images/')); const main = pics.find((k) => !/-\d+\./.test(k));
    rec(J, 'LE13b U2 the download: the outline is a polygon in the page (no image fetched for it), the picture one file with its copies', /shape-outside:polygon\(/.test(html) && !/shape-outside:\s*url\(/.test(html) && !/data:image\//.test(html) && pics.length >= 2, `files ${pics.join(', ')}`);
    const PORT = 3300; const srv = await serve(dir, PORT);
    try {
      for (const vw of [375, 1280]) {
        const ctx = await page.context().browser().newContext({ viewport: { width: vw, height: 860 } }); const pg = await ctx.newPage(); const got = [];
        pg.on('request', (q) => { if (/\/images\//.test(q.url())) got.push(q.url().replace(/^.*\/images\//, 'images/')); });
        await pg.goto(`http://localhost:${PORT}/index.html`); await pg.waitForLoadState('networkidle'); await pg.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await pg.waitForTimeout(800);
        const mine = got.filter((u) => u.split('?')[0].replace(/-\d+(\.\w+)$/, '$1') === main);
        await pg.screenshot({ path: path.join(OUT, `LE13b-U2-served-${vw}.png`) });
        rec(J, `LE13b U2 the served site at ${vw}: the picture fetched ONCE (its file or one copy)`, mine.length === 1, `${mine.length} requests: ${mine.join(', ')}`);
        if (vw === 1280) {
          const r = await rects(pg, [st, pic, ...t]); const P = await Promise.all(t.map((id) => lines(pg, id))); const c = shapeCheck(r, P, pic, 'start', discOf(r[pic]), true, t);
          rec(J, 'LE13b U2 the served site at 1280 (HTTP): the lines follow the disc', !c.bad.length, c.bad.slice(0, 2).join(' | ') || `${c.beside} beside, ${c.inOver} over the box`);
        }
        await ctx.close();
      }
    } finally { srv.close(); }
    // a NEW picture brings its own outline: replaced through the Image's Replace, the old outline does not stay
    await chip(page, 'Desktop (1280px)'); await upload(await discPng(page, DISC2));
    n = nodeIn(await site(page), pic).n;
    rec(J, 'LE13b U2 replaced by another cut-out: a new outline is traced, the old one gone', /^polygon\(/.test(n?.wrapOutline || '') && n.wrapOutline !== first, `${String(n?.wrapOutline).slice(0, 60)}…`);
    let f = await pvOpen(page); f = await pvAt(page, 1280);
    const r = await rects(f, [st, pic, ...t]); const P = await Promise.all(t.map((id) => lines(f, id))); const c = shapeCheck(r, P, pic, 'start', discOf(r[pic], DISC2), true, t);
    await pvShot(page, 'LE13b-U2-replaced-1280'); await pvClose(page, 1366);
    rec(J, 'LE13b U2 the Preview at 1280 follows the NEW picture\'s disc', !c.bad.length, c.bad.slice(0, 2).join(' | ') || `${c.beside} beside, ${c.inOver} over the box`);
  },

  async shapePhone(page, J) {
    const story = await photoStory(page); const { pic } = story;
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.start);
    // LE13b-13: the Circle style made on the MOBILE screen, as the app makes it — its 10rem is the phone's own
    await chip(page, 'Mobile (375px)'); await circleStyle(page, pic); await pick(page, pic, 'Position', W.shape, W.shapeChoices.round); await chip(page, 'Desktop (1280px)');
    const n = nodeIn(await site(page), pic).n;
    rec(J, 'LE13b U5 stored on the phone only: Its round corners', n?.wrapShape == null && Object.values(n?.responsive || {}).some((o) => o?.wrapShape === 'round'), JSON.stringify(n?.responsive || {}));
    const phoneTo = require('../../config/layout.json').rungs.tabletPortrait.from;
    // the Circle picture is 10rem: in a phone's Stack ≥ wrapBelowRem it floats with the curve; from the tablet up, its box
    await shapeSweep(page, J, story, 'start', 'LE13b U5 phone only', circleOf, 'LE13b-U5-phone', { shapedAt: (w) => w < phoneTo, skip200: true, noFull: true, round: true });
  },

  async wrap(page, J) {
    const { st, pic, t } = await photoStory(page);
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.start); await shot(page, 'U1-wrap-inspector');
    let s = await site(page); rec(J, 'U1 stored: Wrap words round it → Start (wrapAround start)', own(nodeIn(s, pic).n, 'wrapAround') === 'start', `wrapAround ${own(nodeIn(s, pic).n, 'wrapAround')}`);
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, [st, pic]); const cl = await canvasLines(page, t[0]); await shot(page, 'U1-canvas-1280');
    let f = await pvOpen(page); const bad = []; let floated = 0, full = 0;
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [st, pic, ...t]); const P = await Promise.all(t.map((id) => lines(f, id)));
      const c = wrapCheck(r, P, st, pic, 'start', t); if (c.floats) floated++; else full++;
      if (c.floats && r[st].w < FLOW.wrapBelowRem * REM - 1) c.bad.push(`floats in a ${r[st].w}px Stack, under ${FLOW.wrapBelowRem}rem`);
      if (!c.floats && r[st].w >= FLOW.wrapBelowRem * REM + 1) c.bad.push(`takes the line in a ${r[st].w}px Stack, over ${FLOW.wrapBelowRem}rem`);
      bad.push(...c.bad.map((b) => `${w}: ${b}`));
      if (w === 1280) {
        const pl = await lines(f, t[0]);
        rec(J, 'U1 canvas == Preview at 1280 (the picture\'s width and the first line\'s start within 2px of the Stack)', near(cv[pic].w, r[pic].w, 2) && near(cl[0].l - cv[st].l, pl[0].l - r[st].l, 2), `picture ${cv[pic].w} / ${r[pic].w} · first line +${(cl[0].l - cv[st].l).toFixed(1)} / +${(pl[0].l - r[st].l).toFixed(1)}`);
      }
      if ([375, 768, 1280, 1680].includes(w)) await pvShot(page, `U1-start-${w}`);
    }
    rec(J, `U1 the Preview at ${WIDTHS.length} widths: beside then under where it floats (${floated}), the whole line below ${FLOW.wrapBelowRem}rem (${full}), a gap, never sideways`, !bad.length && floated > 0 && full > 0, bad.slice(0, 3).join(' | ') || 'ok');
    await pvClose(page, 1366);
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.off);
    s = await site(page); f = await pvOpen(page); f = await pvAt(page, 1280); const r = await rects(f, [st, pic, ...t]); const L = (await Promise.all(t.map((id) => lines(f, id)))).flat(); await pvShot(page, 'U1-off-1280'); await pvClose(page, 1366);
    rec(J, 'U1 Off: nothing stored, the words follow the picture again', own(nodeIn(s, pic).n, 'wrapAround') == null && Math.min(...L.map((x) => x.t)) >= r[pic].b - 1, `wrapAround ${own(nodeIn(s, pic).n, 'wrapAround')} · words from ${Math.min(...L.map((x) => x.t))} picture foot ${r[pic].b}`);
  },

  async wrapEnd(page, J) {
    const { st, pic, t } = await photoStory(page);
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.end);
    const s = await site(page); rec(J, 'U1 stored: End (wrapAround end)', own(nodeIn(s, pic).n, 'wrapAround') === 'end', `wrapAround ${own(nodeIn(s, pic).n, 'wrapAround')}`);
    let f = await pvOpen(page); const bad = []; let floated = 0;
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [st, pic, ...t]); const P = await Promise.all(t.map((id) => lines(f, id)));
      const c = wrapCheck(r, P, st, pic, 'end', t); if (c.floats) floated++; bad.push(...c.bad.map((b) => `${w}: ${b}`));
      if ([375, 768, 1280].includes(w)) await pvShot(page, `U1-end-${w}`);
    }
    rec(J, `U1 End at ${WIDTHS.length} widths: the picture at the line's end, the words beside it on the other side then under it (${floated} floating)`, !bad.length && floated > 0, bad.slice(0, 3).join(' | ') || 'ok');
    // 200 % text (WCAG 1.4.4): the Stack is narrower in rem, so the picture takes the line sooner — never sideways, no word cut
    f = await pvAt(page, 1280);
    await f.evaluate(() => { document.documentElement.style.fontSize = '200%'; }); await sleep(page, 400);
    const r = await rects(f, [st, pic, ...t]); const P = await Promise.all(t.map((id) => lines(f, id))); const c = wrapCheck(r, P, st, pic, 'end', t);
    await pvShot(page, 'U1-end-1280-200pct');
    rec(J, 'U1 at 200 % text: still laid out (beside or the whole line), never sideways', !c.bad.length, c.bad.join(' | ') || `floats ${c.floats} in a ${r[st].w}px Stack`);
    await pvClose(page, 1366);
  },

  async wrapPhone(page, J) {
    // LE13-19: set on the phone's screen ONLY (as the app does) — floats on a phone only where its Stack is at least wrapBelowRem
    const { st, pic, t } = await photoStory(page);
    await chip(page, 'Mobile (375px)'); await pick(page, pic, 'Position', W.wrap, W.wrapChoices.start); await chip(page, 'Desktop (1280px)');
    const n = nodeIn(await site(page), pic).n; rec(J, 'U1 stored on the phone only', n?.wrapAround == null && Object.values(n?.responsive || {}).some((o) => o?.wrapAround === 'start'), JSON.stringify(n?.responsive || {}));
    const phoneTo = require('../../config/layout.json').rungs.tabletPortrait.from; let f = await pvOpen(page); const bad = [];
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [st, pic, ...t]); const P = await Promise.all(t.map((id) => lines(f, id)));
      const c = wrapCheck(r, P, st, pic, 'start', t); const want = w < phoneTo && r[st].w >= FLOW.wrapBelowRem * REM;
      if (c.floats !== want) bad.push(`${w}: floats ${c.floats} in a ${r[st].w}px Stack, want ${want}`); bad.push(...c.bad.map((b) => `${w}: ${b}`));
      if ([375, 599, 1280].includes(w)) await pvShot(page, `U1-phone-only-${w}`);
    }
    await pvClose(page, 1366);
    rec(J, `U1 phone only at ${WIDTHS.length} widths: floats on a phone where its Stack is at least ${FLOW.wrapBelowRem}rem, the whole line under it, never from the tablet up`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
  },

  async strip(page, J) {
    const { row, kids } = await sideBySide(page, Array(6).fill('Stack'));
    for (const [i, k] of kids.entries()) await words(page, await into(page, k, 'Text'), ['Sports day — Friday 14th', 'Open evening', 'Carol concert', 'Science fair', 'Parents\' evening', 'Trip to the museum'][i]);
    for (const k of kids) await colour(page, k, '#dde4ff');
    await pick(page, row, 'Arrange', W.fit, W.fitChoices.scroll); await shot(page, 'U2-strip-inspector');
    let s = await site(page); rec(J, 'U2 stored: When it doesn\'t fit → Scroll sideways (scrollX)', own(nodeIn(s, row).n, 'scrollX') === true, `scrollX ${own(nodeIn(s, row).n, 'scrollX')}`);
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, [row, ...kids]);
    let f = await pvOpen(page); const bad = []; let peeks = 0;
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [row, ...kids]);
      const m = await f.evaluate((id) => { const e = document.querySelector(`.bx-${id}`); return { sw: e.scrollWidth, cw: e.clientWidth }; }, row);
      if (r.sw > r.vw) bad.push(`${w}: the page scrolls sideways ${r.sw}`);
      if (!kids.every((k) => near(r[k].t, r[kids[0]].t, 1))) bad.push(`${w}: not one line`);
      const want = Math.min(0.8 * m.cw, 18 * REM);
      if (kids.length * want > m.cw + 1 && !(m.sw > m.cw)) bad.push(`${w}: does not scroll ${m.sw}/${m.cw}`); // LE13-7c: only when they do not fit
      if (!kids.every((k) => near(r[k].w, want, 2))) bad.push(`${w}: card ${r[kids[0]].w} want ${want.toFixed(1)}`);
      if (r[kids[1]].l < r[row].r - 1 && r[kids[0]].r < r[row].r) peeks++;
      if (w === 1280) rec(J, 'U2 canvas == Preview at 1280 (each card\'s width within 2px)', kids.every((k) => near(cv[k].w, r[k].w, 2)), `canvas ${cv[kids[0]].w} · preview ${r[kids[0]].w}`);
      if ([375, 1280].includes(w)) await pvShot(page, `U2-strip-${w}`);
    }
    rec(J, `U2 the Preview at ${WIDTHS.length} widths: one line that scrolls, every card its width, the page never sideways`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
    rec(J, 'U2 a part of the next card shows (the peek)', peeks === WIDTHS.length, `${peeks} of ${WIDTHS.length}`);
    f = await pvAt(page, 375);
    const snap = await f.evaluate(async (id) => { const e = document.querySelector(`.bx-${id}`); e.scrollBy({ left: 130, behavior: 'instant' }); await new Promise((res) => setTimeout(res, 900)); const lefts = [...e.children].map((k) => k.getBoundingClientRect().left - e.getBoundingClientRect().left - parseFloat(getComputedStyle(e).paddingLeft)); return { sl: e.scrollLeft, landed: lefts.some((x) => Math.abs(x) <= 1.5) }; }, row);
    rec(J, 'U2 a scroll of 130px lands a card at the start (snap)', snap.sl > 0 && snap.landed, JSON.stringify(snap));
    const key = await f.evaluate(async (id) => {
      const e = document.querySelector(`.bx-${id}`); e.scrollLeft = 0; document.body.focus();
      return { name: e.getAttribute('aria-label'), role: e.getAttribute('role'), tab: e.tabIndex };
    }, row);
    let reached = false; for (let i = 0; i < 25 && !reached; i++) { await page.keyboard.press('Tab'); reached = await f.evaluate((id) => document.activeElement === document.querySelector(`.bx-${id}`), row).catch(() => false); }
    const before = await f.evaluate((id) => document.querySelector(`.bx-${id}`).scrollLeft, row); await page.keyboard.press('ArrowRight'); await sleep(page, 700);
    const after = await f.evaluate((id) => document.querySelector(`.bx-${id}`).scrollLeft, row); await pvShot(page, 'U2-strip-375-keyboard');
    rec(J, 'U2 Tab reaches the strip (a named region) and the right arrow scrolls it', reached && key.name === W.stripLabel && key.role === 'region' && after > before, `reached ${reached} · ${key.role} "${key.name}" · ${before} → ${after}`);
    await pvClose(page, 1366);
    await pick(page, row, 'Arrange', W.fit, W.fitChoices.wrap);
    s = await site(page); f = await pvOpen(page); f = await pvAt(page, 375); const r = await rects(f, [row, ...kids]); await pvShot(page, 'U2-wrapped-375'); await pvClose(page, 1366);
    rec(J, 'U2 Wrap to new lines: no strip stored, the cards on several lines on a phone', !own(nodeIn(s, row).n, 'scrollX') && new Set(kids.map((k) => Math.round(r[k].t))).size > 1 && r.sw <= r.vw, `scrollX ${own(nodeIn(s, row).n, 'scrollX')} · lines ${new Set(kids.map((k) => Math.round(r[k].t))).size}`);
  },

  async stripPhone(page, J) {
    const { row, kids } = await sideBySide(page, Array(6).fill('Stack'));
    for (const [i, k] of kids.entries()) await words(page, await into(page, k, 'Text'), `Event ${i + 1}`);
    await chip(page, 'Mobile (375px)'); await pick(page, row, 'Arrange', W.fit, W.fitChoices.scroll); await chip(page, 'Desktop (1280px)');
    const s = await site(page); const n = nodeIn(s, row).n; rec(J, 'U2 stored on the phone only', n?.scrollX == null && Object.values(n?.responsive || {}).some((o) => o?.scrollX === true), JSON.stringify(n?.responsive || {}));
    let f = await pvOpen(page); const bad = [];
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const st = await f.evaluate((id) => { const e = document.querySelector(`.bx-${id}`); const c = getComputedStyle(e); return { ox: c.overflowX, wrap: c.flexWrap, sw: e.scrollWidth, cw: e.clientWidth }; }, row);
      const r = await rects(f, [row]); if (r.sw > r.vw) bad.push(`${w}: sideways`);
      const phone = w < require('../../config/layout.json').rungs.tabletPortrait.from;
      if (phone && (st.ox !== 'auto' || st.wrap !== 'nowrap')) bad.push(`${w}: no strip on the phone ${st.ox}/${st.wrap}`);
      if (!phone && (st.ox === 'auto' || st.wrap === 'nowrap')) bad.push(`${w}: a strip above the phone ${st.ox}/${st.wrap}`);
      if ([375, 1280].includes(w)) await pvShot(page, `U2-phone-only-${w}`);
    }
    await pvClose(page, 1366);
    rec(J, `U2 at ${WIDTHS.length} widths: a strip on the phone, wrapped lines from the tablet up, never sideways`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
  },

  async overlap(page, J) {
    const hero = await first(page, 'Stack'); const hh = await into(page, hero, 'Heading'); const ht = await under(page, hh, 'Text');
    await words(page, hh, 'Welcome to Hillside School'); await words(page, ht, `${LONG} These are the hero's last words.`);
    await colour(page, hero, '#1e3a8a');
    const { host: cards, row, kids } = await sideBySide(page, ['Stack', 'Stack', 'Stack']);
    // LE13-7g: real cards — a heading and words each, taller than the overlap
    for (const [i, k] of kids.entries()) { const h = await into(page, k, 'Heading'); await words(page, h, ['Admissions', 'Term dates', 'Fees'][i]); await words(page, await under(page, h, 'Text'), 'Everything a family needs to know, in one place, kept up to date by the school office.'); await colour(page, k, '#fef3c7'); }
    await pick(page, cards, 'Arrange', W.overlap, W.overlapSteps[1]); await shot(page, 'U3-overlap-inspector');
    let s = await site(page); const x = FLOW.overlapSteps[1];
    rec(J, `U3 stored: Overlap the section above → ${W.overlapSteps[1]} (overlapUp ${x})`, own(nodeIn(s, cards).n, 'overlapUp') === x, `overlapUp ${own(nodeIn(s, cards).n, 'overlapUp')}`);
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, [hero, cards, ht]); await shot(page, 'U3-canvas-1280');
    let f = await pvOpen(page); const bad = [];
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [hero, cards, ht, row, ...kids]);
      if (r.sw > r.vw) bad.push(`${w}: sideways`);
      if (!near(r[hero].b - r[cards].t, x * REM, 1.5)) bad.push(`${w}: overlap ${(r[hero].b - r[cards].t).toFixed(1)} want ${x * REM}`);
      if (r[ht].b > r[cards].t + 0.5) bad.push(`${w}: the hero's words ${r[ht].b} run under the cards ${r[cards].t}`);
      // LE13-7b/g: the SECTION, not a card, probed in the band where it overlaps — scrolled into view first, as elementFromPoint only sees the viewport
      const front = await f.evaluate(([k, h]) => { const e = document.querySelector(`.bx-${k}`); const he = document.querySelector(`.bx-${h}`); e.scrollIntoView({ block: 'center', behavior: 'instant' }); const b = e.getBoundingClientRect(); const hit = document.elementFromPoint(b.left + b.width / 2, (b.top + he.getBoundingClientRect().bottom) / 2); return !!hit && e.contains(hit) && !he.contains(hit); }, [cards, hero]);
      if (!front) bad.push(`${w}: the card is not drawn in front of the hero`);
      if (w === 1280) rec(J, 'U3 canvas == Preview at 1280 (the overlap and the hero\'s height within 2px)', near(cv[hero].b - cv[cards].t, r[hero].b - r[cards].t, 2) && near(cv[hero].h, r[hero].h, 2), `canvas ${(cv[hero].b - cv[cards].t).toFixed(1)} / ${cv[hero].h} · preview ${(r[hero].b - r[cards].t).toFixed(1)} / ${r[hero].h}`);
      if ([375, 1280].includes(w)) await pvShot(page, `U3-overlap-${w}`);
    }
    rec(J, `U3 the Preview at ${WIDTHS.length} widths: the cards ${x}rem over the hero's foot, in front, the hero's words above them, never sideways`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
    await pvClose(page, 1366);
    await chip(page, 'Mobile (375px)'); await pick(page, cards, 'Arrange', W.overlap, W.overlapOff); await chip(page, 'Desktop (1280px)');
    s = await site(page); f = await pvOpen(page); f = await pvAt(page, 375); const ph = await rects(f, [hero, cards]); await pvShot(page, 'U3-off-phone-375'); f = await pvAt(page, 1280); const dk = await rects(f, [hero, cards]); await pvClose(page, 1366);
    rec(J, 'U3 Off on Mobile only: no overlap on a phone, the overlap on a desktop', near(ph[cards].t, ph[hero].b, 1) && near(dk[hero].b - dk[cards].t, x * REM, 1.5), `375 ${ph[cards].t} vs ${ph[hero].b} · 1280 ${(dk[hero].b - dk[cards].t).toFixed(1)}`);
  },

  async chrome(page, J) {
    const base = process.env.BASE || 'http://localhost:3100';
    for (const theme of ['light', 'dark', 'midnight', 'purple']) {
      await page.evaluate(() => sessionStorage.removeItem('kept')).catch(() => {}); // LE13-7h: h.js's start-empty runs again, so each theme begins on an empty page
      await page.goto(`${base}/website/box-demo?theme=${theme}`); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1200);
      await page.setViewportSize({ width: 1366, height: 860 }); await sleep(page, 400);
      // built once at a laptop width, where a drop can be aimed INTO a block (LE4-5), then driven at every editor width
      const st = await first(page, 'Stack'); const pic = await into(page, st, 'Image'); const tx = await under(page, pic, 'Text');
      const { host: sbsHost, row } = await sideBySide(page, ['Stack', 'Stack']);
      if (theme === 'light') {
        await sec(page, tx, 'Position'); const noWrap = await ins(page).getByRole('group', { name: W.wrap, exact: true }).count();
        await sec(page, st, 'Arrange'); const firstOverlap = await ins(page).getByRole('group', { name: W.overlap, exact: true }).count(); const noFit = await ins(page).getByRole('group', { name: W.fit, exact: true }).count();
        await sec(page, sbsHost, 'Arrange'); const offered = await ins(page).getByRole('group', { name: W.overlap, exact: true }).count();
        rec(J, 'U4 offered only where it works: no Wrap on words, no Overlap on the first section, no "doesn\'t fit" on a Stack; Overlap on a later section', noWrap === 0 && firstOverlap === 0 && noFit === 0 && offered === 1, `wrap on text ${noWrap} · overlap on first ${firstOverlap} · fit on stack ${noFit} · overlap on second ${offered}`);
      }
      for (const w of [375, 768, 1280, 1536]) {
        await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 500);
        let ok = true; const ev = []; let cur = null;
        try {
          const key = async (id, section, group, choice, prop, want) => {
            if (cur !== id) { await closeIns(page); await sec(page, id, section); cur = id; } const b = ins(page).getByRole('group', { name: group, exact: true }).getByRole('button', { name: choice, exact: true }); // LE13-7d
            const was = nodeIn(await site(page), id).n;
            await b.scrollIntoViewIfNeeded(); await b.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.keyboard.press(want === undefined ? 'Space' : 'Enter'); await sleep(page, 400);
            const v = changed(was, nodeIn(await site(page), id).n, prop); ev.push(`${prop} ${v}`); if (v !== want && !(want === undefined && (v === 'off' || v === 'box' || v === false || v === 0 || v == null))) ok = false; // LE13-7e
          };
          // LE-13b U6 · Words follow only with the wrap on (the picture starts unwrapped on each width: the last key below sets Off)
          { if (cur !== pic) { await closeIns(page); await sec(page, pic, 'Position'); cur = pic; } const none = await ins(page).getByRole('group', { name: W.shape, exact: true }).count(); ev.push(`shape group with the wrap off ${none}`); if (none) ok = false; }
          await key(pic, 'Position', W.wrap, W.wrapChoices.end, 'wrapAround', 'end');
          await key(pic, 'Position', W.shape, W.shapeChoices.round, 'wrapShape', 'round');
          await key(pic, 'Position', W.shape, W.shapeChoices.outline, 'wrapShape', 'outline');
          await key(pic, 'Position', W.shape, W.shapeChoices.box, 'wrapShape', undefined);
          {
            const g = ins(page).getByRole('group', { name: W.shape, exact: true }).first();
            const clipped = await g.evaluate((el) => [...el.querySelectorAll('button')].filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent));
            ev.push(`shape clipped ${clipped.length}`); if (clipped.length) ok = false;
            const sh = await ins(page).getByText(W.shapeHint).first().evaluate(CONTRAST); ev.push(`shape hint ${sh}:1`); if (sh < 4.5) ok = false;
            if (w === 375 || w === 1536) await shot(page, `LE13b-U6-${theme}-${w}-shape`);
          }
          await key(pic, 'Position', W.wrap, W.wrapChoices.off, 'wrapAround', undefined);
          await key(row, 'Arrange', W.fit, W.fitChoices.scroll, 'scrollX', true);
          await key(row, 'Arrange', W.fit, W.fitChoices.wrap, 'scrollX', undefined);
          await key(sbsHost, 'Arrange', W.overlap, W.overlapSteps[0], 'overlapUp', FLOW.overlapSteps[0]);
          // the hints' contrast, measured on what is drawn, and nothing clipped in the three rows
          const cr = await ins(page).getByText(W.overlapHint).first().evaluate(CONTRAST); ev.push(`hint ${cr}:1`); if (cr < 4.5) ok = false;
          const clipped = await ins(page).getByRole('group', { name: W.overlap, exact: true }).first().evaluate((g) => [...g.querySelectorAll('button')].filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent));
          ev.push(`clipped ${clipped.length}`); if (clipped.length) ok = false;
          if (w === 375 || w === 1536) await shot(page, `U4-${theme}-${w}-overlap`);
          await key(sbsHost, 'Arrange', W.overlap, W.overlapOff, 'overlapUp', undefined);
          await page.keyboard.press('Escape'); await deselect(page);
        } catch (e) { ok = false; ev.push(e.message.split('\n')[0]); await shot(page, `U4-ERR-${theme}-${w}`); }
        rec(J, `U4 ${theme} · ${w}: Wrap words round it, When it doesn't fit and Overlap by keyboard; hint readable; nothing clipped`, ok, ev.join(' · '));
      }
    }
  },
};

(async () => {
  const names = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...names];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, `${page.__step || ''} ${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
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
