// HEADED UAT — the BATCH RX-4 bug fixes, RX4-1 … RX4-24 (docs/TASK_TREE.md, "RX4-"; the repros in
// docs/web-anatomy/effects-tiers/03-ours-measured.md). Every state BUILT THROUGH THE UI (RULE Y: palette tiles, Inspector
// sections, Advanced CSS, uploads, the Background library, pinned bars, Floating) the way uat-rx4-headed.js built it to find
// the bugs; each of its measurements is turned here into a PASS / FAIL of the FIXED behaviour. What a visitor gets is read in
// the builder's own Export, unzipped and served (page-weight.js), opened in a visible window (a mouse, a touch phone, reduced
// motion, no script), in the real Preview, and on the canvas. Layout-sensitive fixes run at EVERY width of screens.js (RULE Z):
// RX4-4 / RX4-8 / RX4-9 / RX4-10 / RX4-13 at every WIDTH, RX4-12 / RX4-23 at every SCREEN (width × height).
//
// Six visible windows; the jobs below are a queue, and a window that finishes is closed and REFILLED with the next job (a
// fresh browser, so no job inherits another's page). Screenshots + results JSON in scripts/uat/logs/rx4fix/.
//   pager       RX4-5 (Pause) · RX4-9 (nav inside the strip, a real click on Next, every width; and on the canvas)
//   edges       RX4-8 (a curved band keeps its shadow) · RX4-10 (Curve out draws, top and bottom) · RX4-22 (hover on a shaped band)
//   floating    RX4-12 (a floated "Floats on screen" block: corners offered, held in the window) · RX4-23 (inside a shaped band)
//   condense    RX4-11 (Size → Height honoured) · RX4-4 (Condense moves nothing below) · RX4-13 (a lower bar arrives when it sticks)
//   states      RX4-2 (touch) · RX4-3 (:active press) · RX4-18 (Press tile) · RX4-14 / RX4-20 (Link underline, export + canvas)
//   entrances   RX4-1 (plays once) · RX4-7 (duration = token) · RX4-17 (the canvas holds a scroll entrance)
//   pinned      RX4-19 (a pinned bar's entrance plays once; its Shadow arrival still scrubs)
//   backgrounds RX4-6 (see-through colours) · RX4-16 (Edit pattern CSS) · RX4-21 (pattern tiles in rem) · RX4-24 (contrast of a see-through colour)
//   advanced    RX4-15 ("Not applied" in the four editor themes, nothing infinite exported)
// One console line per check: `[job] RX4-n PASS|FAIL · evidence`; a summary at the end; exit code 1 on any FAIL / ERROR / missing line.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-rx4-fixes-headed.js [--only=pager,edges]
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const { auditDoc } = require('./page-audit.js');
const { WIDTHS, SCREENS, EDGE } = require('./screens.js'); // every width and every screen of the Preview (RULE Z)
const X = require('./uat-rx3-headed.js'); const { cls, sleep, nodeOf, deselect, band, into, under, at, ins, insText, btn, slider, field, chip, pvOpen, pvAt, pvClose } = X;
const X4 = require('./uat-rx4-headed.js'); const { gal, read, anims, site, visit, center, upload, advCss, closePop, moveAway, photoTile } = X4;
const OUT = path.join(__dirname, 'logs', 'rx4fix'); fs.mkdirSync(OUT, { recursive: true });
const sharp = require('sharp');
const THEMES = ['Light', 'Dark', 'Midnight', 'Purple'];
const EXPECT = Array.from({ length: 24 }, (_, i) => `RX4-${i + 1}`);

// ── helpers (only what the two scripts above do not already have) ─────────────────────────────────────────────────
/** The EDITOR's appearance (the app theme), through its own switch — as uat-rx3-fixes-headed.js does it. */
async function appTheme(page, name) { await page.getByRole('button', { name: 'Change theme' }).first().click(); await sleep(page, 300); await page.getByRole('menuitemradio', { name: new RegExp('^\\s*' + name) }).first().click(); await sleep(page, 500); }
/** WCAG contrast of two CSS colours, resolved by the browser through a canvas (as uat-rx3-fixes-headed.js). */
const contrastIn = (ctx, a, b) => ctx.evaluate(([a, b]) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const g = cv.getContext('2d'); const rgb = (c) => { g.clearRect(0, 0, 1, 1); g.fillStyle = '#000'; g.fillStyle = c; g.fillRect(0, 0, 1, 1); return Array.from(g.getImageData(0, 0, 1, 1).data).slice(0, 3); }; const L = (c) => { const [r, gg, bb] = rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * gg + 0.0722 * bb; }; const x = L(a), y = L(b); return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2); }, [a, b]);
/** Mean RGB of several small squares from ONE screenshot (page coordinates).
 *  ponytail: uat-rx4-headed.js `pixel()` takes a screenshot per point; at 55 widths × 6 points that is minutes of 5120px shots. */
async function pixels(p, pts, r = 2) {
  const { data, info } = await sharp(await p.screenshot()).raw().toBuffer({ resolveWithObject: true });
  return pts.map(([x, y]) => { let n = 0; const s = [0, 0, 0]; for (let yy = Math.round(y - r); yy <= Math.round(y + r); yy++) for (let xx = Math.round(x - r); xx <= Math.round(x + r); xx++) { if (xx < 0 || yy < 0 || xx >= info.width || yy >= info.height) continue; const i = (yy * info.width + xx) * info.channels; s[0] += data[i]; s[1] += data[i + 1]; s[2] += data[i + 2]; n++; } return n ? s.map((v) => Math.round(v / n)) : null; });
}
const sum = (a) => (a ? a[0] + a[1] + a[2] : NaN);
const dist = (a, b) => (a && b ? Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) : NaN);
const BAND = [55, 65, 81]; // #374151, the swatch every shaped band is given below
/** The strongest alpha in a computed box-shadow / filter (none → 0). */
const alphaMax = (s) => { if (!s || s === 'none') return 0; const m = [...String(s).matchAll(/rgba?\(([^)]+)\)/g)]; if (!m.length) return 1; return Math.max(...m.map((x) => { const p = x[1].split(/[\s,/]+/).filter(Boolean); return p.length >= 4 ? parseFloat(p[3]) : 1; })); };
const shadowOn = (bs, f) => alphaMax(bs) > 0.02 || (/drop-shadow/.test(f || '') && alphaMax(f) > 0.02);
async function size(p, w, h = 800) { await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(250); }
/** The editor's page, ready again after a reload (the same wait h.js `open` uses). */
async function ready(page) { await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 }); await sleep(page, 1200); }
/** The canvas rect of a block, in page pixels. */
const crect = (page, id) => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height, x: r.left + r.width / 2 }; }, id);
/** The Preview iframe's offset in the editor window — frame coordinates + this = a pixel of page.screenshot(). */
async function frameOff(f) { const b = await (await f.frameElement()).boundingBox(); return [b.x, b.y]; }
const shadowBold = async (page, b) => { await at(page, b, 'Design', 'Outline & effects'); await ins(page).getByRole('group', { name: 'Shadow' }).getByRole('button', { name: 'Bold' }).first().click(); await sleep(page, 300); };
async function swatch(page, b, title, colour) { await at(page, b, 'Design', 'Background'); await ins(page).getByRole('button', { name: `${title} palette` }).first().click(); await sleep(page, 300); await page.locator(`[role=dialog] button[title^="${colour}"]`).first().click().catch(() => {}); await closePop(page); await sleep(page, 300); }
async function hexIn(page, label, v) { const h = ins(page).getByLabel(`${label} hex value`).first(); await h.scrollIntoViewIfNeeded(); await h.fill(v); await h.press('Enter'); await h.blur(); await sleep(page, 400); }
/** A dark 12rem band (with a Text), as uat-rx4-headed.js W4 makes them; and a plain 10rem gap band after it. */
async function darkBand(page) { const b = await band(page); await into(page, b, 'Text'); await H.panel(page, false); await at(page, b, 'Design', 'Size'); await field(page, 'Height', '12rem'); await swatch(page, b, 'Background colour', '#374151'); return b; }
async function gapBand(page, h = '10rem') { const b = await band(page); await into(page, b, 'Text'); await H.panel(page, false); await at(page, b, 'Design', 'Size'); await field(page, 'Height', h); return b; }
async function fullBand(page) { const b = await band(page); await into(page, b, 'Text'); await H.panel(page, false); await at(page, b, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page)); return b; }
async function edge(page, b, which, depth = 30) { await at(page, b, 'Design', 'Arrange'); await gal(page, `${which} edge: Curve out`); await slider(page, 'Edge depth', depth); }
/** Pick a "Held against" anchor (the corner arrows carry a title, like uat-rx4-headed.js F5). */
async function holdAt(page, name, nth) { const g = ins(page).getByRole('group', { name: 'Held against' }); await g.getByRole('button', { name, exact: true }).first().click({ timeout: 3000 }).catch(async () => { await g.getByRole('button').nth(nth).click(); }); await sleep(page, 400); return g.getByRole('button').evaluateAll((es) => es.map((e) => e.getAttribute('title') || e.innerText)); }
/** A pager's parts on a published page: the strip, its nav, its arrows / dots / pause, all scoped to ONE block. */
const pagerParts = (p, s) => p.evaluate((s) => { const host = document.querySelector(s); const strip = host.matches('[data-eu-pager]') ? host : host.querySelector('[data-eu-pager]'); const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height), shown: !e.hidden && c.display !== 'none' && c.visibility !== 'hidden' && r.width > 0 && r.height > 0, label: e.getAttribute('aria-label') }; }; const q = (sel) => Array.from(host.querySelectorAll(sel)).map(box); return { strip: box(strip), scroll: Math.round(strip.scrollLeft), arrows: q('[data-eu-pager-prev],[data-eu-pager-next]'), dots: q('[data-eu-pager-dot]'), pause: box(host.querySelector('[data-eu-pager-pause]')), vw: innerWidth, vh: innerHeight }; }, s);
const within = (a, o, tol = 1) => a.l >= o.l - tol && a.r <= o.r + tol && a.t >= o.t - tol && a.b <= o.b + tol;

// ── the jobs ─────────────────────────────────────────────────────────────────────────────────────────────────────
const JOBS = {
  // ── RX4-5 · RX4-9 — a slider that moves by itself, and the arrows and dots a visitor clicks ──────────────────────
  async pager(c) {
    const { page } = c; let pg, pg2;
    await c.probe('build', async () => {
      pg = await band(page); const t1 = await into(page, pg, 'Text'); const t2 = await under(page, t1, 'Text'); await under(page, t2, 'Button');
      pg2 = await band(page); const u1 = await into(page, pg2, 'Text'); const u2 = await under(page, u1, 'Text'); await under(page, u2, 'Text');
      const after = await band(page); await into(page, after, 'Button'); await H.panel(page, false);
      for (const b of [pg, pg2]) { await at(page, b, 'Design', 'Arrange'); await ins(page).getByLabel('Show one at a time').check(); await sleep(page, 500); await ins(page).getByRole('group', { name: 'Moving between them' }).getByRole('button', { name: 'Both' }).click(); await sleep(page, 300); }
      await at(page, pg, 'Design', 'Arrange'); await slider(page, 'Move on its own every', 3); await c.shot('pager-inspector');
    });
    await c.probe('RX4-5', async () => {
      const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 800 });
      await p.evaluate((x) => document.querySelector(x).scrollIntoView({ block: 'center' }), cls(pg)); await sleep(page, 400);
      const away = async () => { await p.mouse.move(3, 797); await p.mouse.move(5, 795); };
      const sample = async (ms) => { const out = []; const t0 = Date.now(); while (Date.now() - t0 < ms) { out.push((await pagerParts(p, cls(pg))).scroll); await sleep(page, 500); } return out; };
      const moved = (a) => new Set(a).size > 1;
      await away(); const parts = await pagerParts(p, cls(pg)); const free = await sample(7000); await p.screenshot({ path: path.join(OUT, 'RX4-5-pause-visible.png') });
      const pause = p.locator(`${cls(pg)} [data-eu-pager-pause]`).first();
      let clickedPause = 'not clicked'; await pause.click({ timeout: 3000 }).then(() => { clickedPause = 'real click'; }).catch((e) => { clickedPause = 'FAILED: ' + e.message.split('\n')[0].slice(0, 100); });
      const label1 = await pause.getAttribute('aria-label').catch(() => null); await away(); const held = await sample(7000); await p.screenshot({ path: path.join(OUT, 'RX4-5-paused.png') });
      await pause.click({ timeout: 3000 }).catch(() => {}); const label2 = await pause.getAttribute('aria-label').catch(() => null); await away(); const resumed = await sample(7000);
      // the keyboard reaches it
      await p.evaluate(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }); let tabbed = false;
      for (let i = 0; i < 20 && !tabbed; i++) { await p.keyboard.press('Tab'); await sleep(page, 100); tabbed = await p.evaluate(() => !!document.activeElement && document.activeElement.hasAttribute('data-eu-pager-pause')); }
      const rm = await visit(c, s.url, { w: 1280, h: 800, reduce: true }); await rm.evaluate((x) => document.querySelector(x).scrollIntoView({ block: 'center' }), cls(pg)); await sleep(page, 400);
      const rmParts = await pagerParts(rm, cls(pg)); const rmS = []; for (let i = 0; i < 14; i++) { rmS.push((await pagerParts(rm, cls(pg))).scroll); await sleep(page, 500); } await rm.screenshot({ path: path.join(OUT, 'RX4-5-reduced-motion.png') });
      const ok = parts.pause && parts.pause.shown && within(parts.pause, { l: 0, t: 0, r: parts.vw, b: parts.vh }) && moved(free) && clickedPause === 'real click' && label1 === 'Play' && !moved(held) && label2 === 'Pause' && moved(resumed) && tabbed && !(rmParts.pause && rmParts.pause.shown) && !moved(rmS);
      c.rec('RX4-5', ok, `export 1280×800, every 3 s: pause ${JSON.stringify(parts.pause)}; untouched 7 s ${free.join(',')}; Pause (${clickedPause}) → label "${label1}", 7 s ${held.join(',')}; pressed again → "${label2}", 7 s ${resumed.join(',')}; Tab reaches it ${tabbed}; REDUCED MOTION: pause ${JSON.stringify(rmParts.pause)}, 7 s ${rmS.join(',')}`, 'RX4-5-pause-visible.png, RX4-5-paused.png, RX4-5-reduced-motion.png');
    });
    await c.probe('RX4-9', async () => {
      const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 800 }); const bad = []; const seen = {}; const bars = [];
      for (const w of WIDTHS) {
        await size(p, w); await p.evaluate((x) => { const h = document.querySelector(x); const st = h.matches('[data-eu-pager]') ? h : h.querySelector('[data-eu-pager]'); st.scrollLeft = 0; h.scrollIntoView({ block: 'center' }); }, cls(pg2)); await sleep(page, 500);
        const a = await pagerParts(p, cls(pg2)); const vp = { l: 0, t: 0, r: a.vw, b: a.vh };
        const ctl = [...a.arrows, ...a.dots].filter((x) => x.shown);
        const host = await p.evaluate((x) => { const h = document.querySelector(x); const R = h.getBoundingClientRect(); const st = h.matches('[data-eu-pager]') ? h : h.querySelector('[data-eu-pager]'); return { l: R.left, t: R.top, r: R.right, b: R.bottom, bar: st.offsetHeight - st.clientHeight }; }, cls(pg2)); if (host.bar > 0) bars.push(`${w}: ${host.bar}px`);
        const outside = ctl.filter((x) => !within(x, host) || !within(x, vp));
        const next = p.locator(`${cls(pg2)} [data-eu-pager-next]`).first();
        const hit = await next.evaluate((e) => { const r = e.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!t && (t === e || e.contains(t)); }).catch(() => false);
        const click = await next.click({ timeout: 3000 }).then(async () => { await sleep(page, 900); return (await pagerParts(p, cls(pg2))).scroll; }).catch((e) => 'FAILED ' + e.message.split('\n')[0].slice(0, 80));
        const row = `strip ${a.strip.l},${a.strip.t} ${a.strip.w}×${a.strip.h}; ${ctl.length} controls shown${outside.length ? ', OUTSIDE ' + JSON.stringify(outside) : ''}; Next on top ${hit}; real click → scrollLeft ${click}`;
        if (!ctl.length || outside.length || !hit || !(typeof click === 'number' && click > 0)) bad.push(`${w}: ${row}`);
        if (w === 375 || w === 1280) { seen[w] = row; await p.screenshot({ path: path.join(OUT, `RX4-9-export-${w}.png`) }); }
      }
      c.rec('RX4-9', !bad.length, `export, a three-Text pager "Both", at ${WIDTHS.length} widths: ${bad.length ? 'FAILING ' + bad.slice(0, 8).join(' ‖ ') : 'all inside the pager and the window, Next clickable and moving'}; 375 ${seen[375]}; 1280 ${seen[1280]}`, 'RX4-9-export-375.png, RX4-9-export-1280.png');
      c.rec('RX4-25', !bars.length, `export, the same pager (it has arrows and dots): native scrollbar height under its pages at ${WIDTHS.length} widths — ${bars.length ? 'DRAWN ' + bars.slice(0, 8).join(' · ') : 'none at any width'}`, 'RX4-9-export-375.png');
      // the editor: the dots and arrows sit inside the band on the canvas, at the five rung chips
      const cv = {}; let cbad = 0;
      for (const ch of ['Mobile (375px)', 'Tablet (768px)', 'Laptop (1024px)', 'Desktop (1280px)', 'Wide (1920px)']) {
        await chip(page, ch); const m = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); e.scrollIntoView({ block: 'center' }); const R = e.getBoundingClientRect(); const ctl = Array.from(e.querySelectorAll('[data-eu-pager-dot],[data-eu-pager-prev],[data-eu-pager-next]')).map((x) => x.getBoundingClientRect()).filter((r) => r.width > 0); const st = e.querySelector('[data-pager-strip]'); return { bar: st ? st.offsetHeight - st.clientHeight : -1, n: ctl.length, out: ctl.filter((r) => r.top < R.top - 1 || r.bottom > R.bottom + 1 || r.left < R.left - 1 || r.right > R.right + 1).length }; }, pg2);
        cv[ch] = m; if (!m.n || m.out || m.bar !== 0) cbad++;
      }
      await chip(page, 'Desktop (1280px)'); await c.shot('RX4-9-canvas'); await chip(page, 'Full width');
      c.rec('RX4-9 canvas', !cbad, `canvas controls drawn / outside the band at each chip ${JSON.stringify(cv)}`, 'RX4-9-canvas.png');
    });
    // RX4-27 — a Rotating hero BUILT THROUGH THE UI (its slides sit in the builder's plain wrappers): the controls are laid OVER
    // the full-screen hero and are on the first screen at every width, not dropped under it past the fold
    await c.probe('RX4-27', async () => {
      const { fresh } = await photoTile(page, 'Rotating hero'); await H.panel(page, false);
      let hid = null; for (const id of fresh) { const n = await nodeOf(page, id); if (n && n.pager) { hid = id; break; } }
      if (!hid) throw new Error('no pager among the Rotating hero blocks');
      const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 800 }); const bad = []; const seen = {};
      for (const w of WIDTHS) {
        await size(p, w); await p.evaluate((x) => { const h = document.querySelector(x); const st = h.matches('[data-eu-pager]') ? h : h.querySelector('[data-eu-pager]'); st.scrollLeft = 0; scrollTo(0, h.getBoundingClientRect().top + scrollY); }, cls(hid)); await sleep(page, 350);
        const g = await p.evaluate((x) => { const h = document.querySelector(x); const nav = h.querySelector('[data-eu-pager-nav]'); const st = h.querySelector('[data-eu-pager]'); const N = nav.getBoundingClientRect(), S = st.getBoundingClientRect(); return { pos: getComputedStyle(nav).position, navTop: Math.round(N.top), navBottom: Math.round(N.bottom), stripTop: Math.round(S.top), stripBottom: Math.round(S.bottom), vh: innerHeight }; }, cls(hid));
        const ok = g.pos === 'absolute' && g.navBottom <= g.stripBottom + 1 && g.navTop >= g.stripTop - 1 && g.navBottom <= g.vh;
        if (!ok) bad.push(`${w}: ${JSON.stringify(g)}`); if (w === 375 || w === 1280) { seen[w] = g; await p.screenshot({ path: path.join(OUT, `RX4-27-hero-${w}.png`) }); }
      }
      c.rec('RX4-27', !bad.length, `a Rotating hero built through the UI, the export at ${WIDTHS.length} widths: ${bad.length ? 'FAILING ' + bad.slice(0, 6).join(' ‖ ') : 'controls over the hero, and on screen with the hero at the window top, at every width'}; 375 ${JSON.stringify(seen[375])}; 1280 ${JSON.stringify(seen[1280])}`, 'RX4-27-hero-375.png, RX4-27-hero-1280.png');
    });
  },

  // ── RX4-8 · RX4-10 · RX4-22 — shaped bands, their shadow, and a hover on them ───────────────────────────────────
  async edges(c) {
    const { page } = c; const B = {};
    await c.probe('build', async () => {
      await gapBand(page);
      B.N = await darkBand(page); await gapBand(page); // straight + shadow (the reference)
      B.S = await darkBand(page); await gapBand(page); // curved bottom + shadow (RX4-8)
      B.C = await darkBand(page); await gapBand(page); // curved bottom, no shadow (RX4-10)
      B.T = await darkBand(page); await gapBand(page); // curved TOP, no shadow (RX4-10)
      B.L = await darkBand(page); await gapBand(page); B.G = await darkBand(page); await gapBand(page); B.Br = await darkBand(page); await gapBand(page, '20rem'); // RX4-22
      for (const k of ['N', 'S', 'L', 'G', 'Br']) await shadowBold(page, B[k]);
      for (const k of ['S', 'C', 'L', 'G', 'Br']) await edge(page, B[k], 'Bottom');
      await edge(page, B.T, 'Top');
      for (const [k, fx] of [['L', 'Lift'], ['G', 'Glow'], ['Br', 'Brighten']]) { await at(page, B[k], 'Design', 'Outline & effects'); await gal(page, `${fx} hover effect`); }
      await deselect(page);
    });
    // the probe points of one band: below its middle (shadow), and just inside its edge at the corner and the middle (the curve)
    const probe = (r) => ({ below6: [r.x, r.b + 6], below18: [r.x, r.b + 18], cornerIn: [r.l + r.w * 0.015, r.b - 3], midIn: [r.x, r.b - 3], topCornerIn: [r.l + r.w * 0.015, r.t + 3], topMidIn: [r.x, r.t + 3], gap: [r.x, r.b + 80] });
    const judge = (k, px) => {
      if (k === 'S') return px.gap && sum(px.gap) - sum(px.below6) >= 6 && sum(px.gap) - sum(px.below18) >= 3; // RX4-8: the shadow is there under the curve
      if (k === 'C') return dist(px.midIn, BAND) < 30 && dist(px.cornerIn, BAND) > 60; // RX4-10 bottom: the curve is drawn
      if (k === 'T') return dist(px.topMidIn, BAND) < 30 && dist(px.topCornerIn, BAND) > 60; // RX4-10 top
      return true;
    };
    const measure = async (p, off = [0, 0], viaCanvas = false) => {
      const out = {};
      for (const k of ['N', 'S', 'C', 'T']) {
        const r = viaCanvas ? await crect(page, B[k]) : await p.evaluate((s) => { const e = document.querySelector(s); e.scrollIntoView({ block: 'center' }); const R = e.getBoundingClientRect(); const c = getComputedStyle(e); return { l: R.left, r: R.right, t: R.top, b: R.bottom, w: R.width, h: R.height, x: R.left + R.width / 2, clip: c.clipPath.slice(0, 60), filter: c.filter.slice(0, 90), boxShadow: c.boxShadow.slice(0, 60) }; }, cls(B[k]));
        if (!viaCanvas) await sleep(page, 150);
        const pts = probe(r); const keys = Object.keys(pts); const got = await pixels(viaCanvas ? page : (p.page ? p.page() : p), keys.map((q) => [pts[q][0] + off[0], pts[q][1] + off[1]]));
        out[k] = { css: viaCanvas ? null : { clip: r.clip, filter: r.filter, boxShadow: r.boxShadow }, px: Object.fromEntries(keys.map((q, i) => [q, got[i]])) };
      }
      return out;
    };
    await c.probe('RX4-8/RX4-10 export', async () => {
      const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 800 }); const bad = { 'RX4-8': [], 'RX4-10': [] }; const keep = {};
      for (const w of WIDTHS) {
        await size(p, w); const m = await measure(p);
        if (!judge('S', m.S.px)) bad['RX4-8'].push(`${w}: below ${JSON.stringify(m.S.px.below6)}/${JSON.stringify(m.S.px.below18)} page ${JSON.stringify(m.S.px.gap)}`);
        for (const k of ['C', 'T']) if (!judge(k, m[k].px)) bad['RX4-10'].push(`${w} ${k === 'C' ? 'bottom' : 'top'}: corner ${JSON.stringify(k === 'C' ? m[k].px.cornerIn : m[k].px.topCornerIn)} middle ${JSON.stringify(k === 'C' ? m[k].px.midIn : m[k].px.topMidIn)}`);
        if (w === 375 || w === 1280) { keep[w] = m; for (const k of ['S', 'C', 'T']) { await p.evaluate((x) => document.querySelector(x).scrollIntoView({ block: 'center' }), cls(B[k])); await sleep(page, 150); await p.screenshot({ path: path.join(OUT, `RX4-${k === 'S' ? 8 : 10}-${k}-export-${w}.png`) }); } }
      }
      c.store.export8 = { bad: bad['RX4-8'], at1280: keep[1280] && { S: keep[1280].S, N: keep[1280].N } };
      c.store.export10 = { bad: bad['RX4-10'], at1280: keep[1280] && { C: keep[1280].C, T: keep[1280].T } };
    });
    await c.probe('RX4-8/RX4-10 canvas + Preview', async () => {
      await deselect(page); await H.panel(page, false); await page.mouse.move(2, 400);
      const cv = await measure(page, [0, 0], true); await c.shot('RX4-8-canvas');
      await pvOpen(page); const pv = {};
      for (const w of [375, 1280]) { const f = await pvAt(page, w); const off = await frameOff(f); pv[w] = await measure(f, off); await c.shot(`RX4-8-preview-${w}`); }
      await pvClose(page, c.w);
      const e8 = c.store.export8 || { bad: ['export probe did not run'] }, e10 = c.store.export10 || { bad: ['export probe did not run'] };
      const ok8 = !e8.bad.length && judge('S', cv.S.px) && [375, 1280].every((w) => judge('S', pv[w].S.px));
      const ok10 = !e10.bad.length && ['C', 'T'].every((k) => judge(k, cv[k].px) && [375, 1280].every((w) => judge(k, pv[w][k].px)));
      c.rec('RX4-8', ok8, `Shadow "Bold" + Bottom "Curve out" 30 on a dark band: export at ${WIDTHS.length} widths ${e8.bad.length ? 'FAILING ' + e8.bad.slice(0, 6).join(' ‖ ') : 'shadow below the curve at every width'}; at 1280 curved ${JSON.stringify(e8.at1280 && e8.at1280.S)} vs straight ${JSON.stringify(e8.at1280 && e8.at1280.N && e8.at1280.N.px)}; canvas ${JSON.stringify(cv.S.px)}; Preview 375 ${JSON.stringify(pv[375].S.px)} · 1280 ${JSON.stringify(pv[1280].S.px)}`, 'RX4-8-S-export-375.png, RX4-8-S-export-1280.png, RX4-8-canvas.png, RX4-8-preview-1280.png');
      c.rec('RX4-10', ok10, `"Curve out" 30, no shadow — bottom and top: export at ${WIDTHS.length} widths ${e10.bad.length ? 'FAILING ' + e10.bad.slice(0, 6).join(' ‖ ') : 'corners cut in, middle at the edge, at every width'}; 1280 ${JSON.stringify(e10.at1280)}; canvas bottom ${JSON.stringify(cv.C.px)} top ${JSON.stringify(cv.T.px)}; Preview 375 ${JSON.stringify({ C: pv[375].C.px, T: pv[375].T.px })}`, 'RX4-10-C-export-375.png, RX4-10-T-export-1280.png, RX4-8-canvas.png');
    });
    await c.probe('RX4-22', async () => {
      const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 800 }); const res = {}; let ok = true;
      for (const [k, fx] of [['L', 'Lift'], ['G', 'Glow'], ['Br', 'Brighten']]) {
        const sl = cls(B[k]); await p.evaluate((x) => document.querySelector(x).scrollIntoView({ block: 'center' }), sl); await p.mouse.move(2, 2); await sleep(page, 500);
        const r = await p.evaluate((x) => { const R = document.querySelector(x).getBoundingClientRect(); return { l: R.left, w: R.width, b: R.bottom, t: R.top, h: R.height }; }, sl);
        const corner = [r.l + r.w * 0.01 + 3, r.b + 8];
        const rest = await read(p, sl, ['boxShadow', 'filter']); const [restPx] = await pixels(p, [corner]);
        await p.mouse.move(r.l + r.w * 0.6, r.t + r.h * 0.4); await sleep(page, 600);
        const hov = await read(p, sl, ['boxShadow', 'filter', 'transform']); const [hovPx] = await pixels(p, [corner]); await p.screenshot({ path: path.join(OUT, `RX4-22-${fx}-hover.png`) });
        const good = !shadowOn(hov.boxShadow, '') && /drop-shadow/.test(hov.filter) && (fx !== 'Brighten' || /brightness/.test(hov.filter)) && Math.abs(sum(restPx) - sum(hovPx)) < 24;
        if (!good) ok = false; res[fx] = { rest, hover: hov, cornerBelow: { rest: restPx, hover: hovPx } };
      }
      c.rec('RX4-22', ok, `a shaped (Curve out) band with Shadow "Bold", hovered with a real mouse in the export at 1280 — no rectangular box-shadow, the shape's drop-shadow kept, nothing darker below the cut corner: ${JSON.stringify(res)}`, 'RX4-22-Lift-hover.png, RX4-22-Glow-hover.png, RX4-22-Brighten-hover.png');
    });
  },

  // ── RX4-12 · RX4-23 — "Floats on screen", held in the window at every screen ───────────────────────────────────
  async floating(c) {
    const { page } = c; let fb, sb, sh;
    // held = fixed, inside the window, and in the same place on the window at the top and at the bottom of the page
    const heldAt = async (p, s, opts = {}) => {
      const bad = []; const keep = {};
      for (const sc of SCREENS) {
        await size(p, sc.w, sc.h); const rr = [];
        for (const y of [0, 1e6]) { await p.evaluate((y) => scrollTo(0, y), y); await sleep(page, 200); rr.push(await p.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { pos: getComputedStyle(e).position, l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), rg: Math.round(innerWidth - r.right), bg: Math.round(innerHeight - r.bottom), vw: innerWidth, vh: innerHeight, y: Math.round(scrollY) }; }, s)); }
        const [a, z] = rr; const inside = (m) => m.l >= -1 && m.t >= -1 && m.r <= m.vw + 1 && m.b <= m.vh + 1;
        let fine = a.pos === 'fixed' && inside(a) && inside(z) && Math.abs(a.t - z.t) <= 1 && Math.abs(a.l - z.l) <= 1 && z.y > 0;
        if (opts.corner) fine = fine && a.rg <= opts.corner && a.bg <= opts.corner;
        if (!fine) bad.push(`${sc.w}×${sc.h}: top ${JSON.stringify(a)} bottom ${JSON.stringify(z)}`);
        if (sc.w === 375 || sc.w === 1280) keep[`${sc.w}×${sc.h}`] = `${a.pos} l${a.l} t${a.t} gaps r${a.rg} b${a.bg} → scrolled ${z.y}: l${z.l} t${z.t}`;
      }
      return { bad, keep };
    };
    await c.probe('build', async () => {
      await gapBand(page, '150rem');
      const b = await band(page); fb = await into(page, b, 'Button'); await H.panel(page, false);
      sh = await darkBand(page); sb = await into(page, sh, 'Button'); await H.panel(page, false); await shadowBold(page, sh); await edge(page, sh, 'Bottom');
      await gapBand(page, '150rem');
    });
    await c.probe('RX4-12', async () => {
      await at(page, fb, 'Design', 'Placement'); await btn(page, 'Floating', ins(page)); await sleep(page, 400); await gal(page, 'Floats on screen option');
      const group = await ins(page).getByRole('group', { name: 'Held against' }).count(); const note1 = await ins(page).locator('[data-float-pin-note]').innerText().catch(() => ''); await c.shot('RX4-12-inspector');
      const n1 = await nodeOf(page, fb);
      const s1 = await site(c); const p1 = await visit(c, s1.url, { w: 1280, h: 800 }); const placed = await heldAt(p1, cls(fb)); await p1.screenshot({ path: path.join(OUT, 'RX4-12-placed-last-screen.png') });
      const opts = group ? await holdAt(page, '↘', 8) : []; const note2 = await ins(page).locator('[data-float-pin-note]').innerText().catch(() => ''); const n2 = await nodeOf(page, fb);
      const s2 = await site(c); const p2 = await visit(c, s2.url, { w: 1280, h: 800 }); const corner = await heldAt(p2, cls(fb), { corner: 40 });
      await size(p2, 375, 667); await p2.evaluate(() => scrollTo(0, 1e6)); await sleep(page, 300); await p2.screenshot({ path: path.join(OUT, 'RX4-12-corner-375.png') });
      const corners = ['Top-left corner', 'Top-right corner', 'Bottom-left corner', 'Bottom-right corner'].every((t) => opts.includes(t));
      const ok = group && corners && !placed.bad.length && !corner.bad.length;
      c.rec('RX4-12', ok, `a FLOATED Button below a 150rem band, "Floats on screen": "Held against" offered ${!!group} (${JSON.stringify(opts)}), note "${note1.slice(0, 120)}", stored ${JSON.stringify({ pin: n1.pin, hold: n1.hold, pinX: n1.pinX, pinY: n1.pinY })}; "Where I put it" at ${SCREENS.length} screens ${placed.bad.length ? 'FAILING ' + placed.bad.slice(0, 5).join(' ‖ ') : 'held in the window'} ${JSON.stringify(placed.keep)}; ↘ (stored ${JSON.stringify({ pin: n2.pin, pinX: n2.pinX, pinY: n2.pinY })}, note "${note2.slice(0, 90)}") ${corner.bad.length ? 'FAILING ' + corner.bad.slice(0, 5).join(' ‖ ') : 'held in the corner'} ${JSON.stringify(corner.keep)}`, 'RX4-12-inspector.png, RX4-12-placed-last-screen.png, RX4-12-corner-375.png');
    });
    await c.probe('RX4-23', async () => {
      await at(page, sb, 'Design', 'Placement'); await gal(page, 'Floats on screen option'); await holdAt(page, '↘', 7);
      const warn = await ins(page).locator('[role=status]').allInnerTexts().catch(() => []); await c.shot('RX4-23-inspector');
      const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 800 }); const held = await heldAt(p, cls(sb), { corner: 40 });
      const host = await read(p, cls(sh), ['filter', 'clipPath', 'transform', 'contain']); await size(p, 1280, 800); await p.evaluate(() => scrollTo(0, 1e6)); await sleep(page, 300); await p.screenshot({ path: path.join(OUT, 'RX4-23-scrolled-1280.png') });
      c.rec('RX4-23', !held.bad.length, `a Button "Floats on screen" ↘ INSIDE a dark band with Shadow "Bold" + Bottom "Curve out" (band ${JSON.stringify(host)}); Inspector notes ${JSON.stringify(warn)}; at ${SCREENS.length} screens ${held.bad.length ? 'FAILING ' + held.bad.slice(0, 5).join(' ‖ ') : 'held against the window'} ${JSON.stringify(held.keep)}`, 'RX4-23-inspector.png, RX4-23-scrolled-1280.png');
    });
  },

  // ── RX4-11 · RX4-4 · RX4-13 — a pinned bar that condenses, and a lower bar's arrival ────────────────────────────
  async condense(c) {
    const { page } = c; let hd, hl, f1, hd2;
    await c.probe('build', async () => {
      hd = await band(page); hl = await into(page, hd, 'Link'); await H.panel(page, false);
      await at(page, hd, 'Design', 'Size'); await field(page, 'Height', '8rem'); await swatch(page, hd, 'Background colour', '#f3f4f6');
      f1 = await fullBand(page); hd2 = await band(page); await into(page, hd2, 'Link'); await H.panel(page, false); await fullBand(page); await fullBand(page);
    });
    await c.probe('RX4-11', async () => {
      await at(page, hd, 'Design', 'Placement'); await gal(page, 'Sticks when reached option'); await gal(page, 'Condense arrival');
      const warn = (await ins(page).locator('[role=status]').allInnerTexts().catch(() => [])).filter((t) => /height/i.test(t)); const n = await nodeOf(page, hd); await c.shot('RX4-11-inspector');
      const s = await site(c); c.store.condenseSite = s; const p = await visit(c, s.url, { w: 1280, h: 800 });
      const h0 = await p.evaluate((x) => Math.round(document.querySelector(x).getBoundingClientRect().height), cls(hd)); const a = await anims(p, cls(hd));
      await p.evaluate(() => scrollTo(0, 400)); await sleep(page, 400); const h4 = await p.evaluate((x) => Math.round(document.querySelector(x).getBoundingClientRect().height), cls(hd));
      const running = await p.evaluate((x) => document.querySelector(x).getAnimations({ subtree: true }).map((k) => k.animationName || k.transitionProperty), cls(hd)); // the arrival may run on the bar or a part of it
      const ok = !warn.length && Math.abs(h0 - 128) <= 2 && running.length > 0;
      c.rec('RX4-11', ok, `Size → Height "8rem" (stored height ${JSON.stringify(n.height)}, minHeight ${n.minHeight}) + "Sticks when reached" + "Condense": height warnings ${JSON.stringify(warn)}; export at rest ${h0}px, animations on the bar ${JSON.stringify(a)}, on it or its parts at scroll 400 ${JSON.stringify(running)}, drawn height there ${h4}px`, 'RX4-11-inspector.png');
    });
    await c.probe('RX4-4', async () => {
      const s = await site(c); const kf = (s.css.match(/@keyframes\s+eu-arrive-condense[^{]*\{(?:[^{}]*\{[^}]*\})+\s*\}/) || [''])[0];
      const layoutInKf = /padding|min-height|(^|[{;\s])height\s*:|margin|top\s*:|width\s*:/.test(kf.replace(/@keyframes[^{]*\{/, ''));
      const p = await visit(c, s.url, { w: 1280, h: 800 }); const bad = []; const keep = {};
      for (const w of WIDTHS) {
        await size(p, w); const rows = [];
        for (const y of [0, 20, 40, 80, 160, 400]) { await p.evaluate((y) => scrollTo(0, y), y); await sleep(page, 120); rows.push(await p.evaluate(([n, b, l]) => { const B = document.querySelector(b).getBoundingClientRect(), L = document.querySelector(l).getBoundingClientRect(); return { y: Math.round(scrollY), next: Math.round(document.querySelector(n).getBoundingClientRect().top + scrollY), barH: Math.round(B.height), linkIn: (() => { const t = document.elementFromPoint(L.left + Math.min(8, L.width / 2), L.top + L.height / 2); const el = document.querySelector(l); return !!t && (t === el || el.contains(t)); })() }; }, [cls(f1), cls(hd), cls(hl)])); }
        const still = rows.every((r) => Math.abs(r.next - rows[0].next) <= 1); const linkIn = rows.every((r) => r.linkIn);
        if (!still || !linkIn) bad.push(`${w}: ${rows.map((r) => `y${r.y} next@${r.next} bar ${r.barH}${r.linkIn ? '' : ' LINK CLIPPED'}`).join(' · ')}`);
        if (w === 375 || w === 1280) { keep[w] = rows.map((r) => `y${r.y} next@${r.next} bar ${r.barH}`).join(' · '); await p.locator(cls(hd)).first().screenshot({ path: path.join(OUT, `RX4-4-condensed-bar-${w}.png`) }).catch(() => {}); await p.screenshot({ path: path.join(OUT, `RX4-4-condensed-${w}.png`) }); }
      }
      c.rec('RX4-4', !layoutInKf && !bad.length, `keyframes ${JSON.stringify(kf.slice(0, 260))} (layout properties in them: ${layoutInKf}); the next band's page position while scrolling 0 → 400, at ${WIDTHS.length} widths: ${bad.length ? 'FAILING ' + bad.slice(0, 5).join(' ‖ ') : 'unmoved, the bar\'s Link never clipped'}; 375 ${keep[375]}; 1280 ${keep[1280]} — READ the bar screenshots for clipped content`, 'RX4-4-condensed-bar-375.png, RX4-4-condensed-bar-1280.png, RX4-4-condensed-1280.png');
    });
    await c.probe('RX4-13', async () => {
      await at(page, hd, 'Design', 'Placement'); await gal(page, 'Scrolls away option');
      await at(page, hd2, 'Design', 'Placement'); await gal(page, 'Sticks when reached option'); await gal(page, 'Shadow arrival');
      const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 800 }); const bad = []; const keep = {};
      for (const w of WIDTHS) {
        await size(p, w); await p.evaluate(() => scrollTo(0, 0)); await sleep(page, 200);
        const T = await p.evaluate((x) => Math.round(document.querySelector(x).getBoundingClientRect().top + scrollY), cls(hd2)); const rows = [];
        for (const y of [...new Set([60, Math.max(0, T - 300), Math.max(0, T - 40), T + 200, T + 600])]) { await p.evaluate((y) => scrollTo(0, y), y); await sleep(page, 350); rows.push(await p.evaluate((x) => { const e = document.querySelector(x); const c = getComputedStyle(e); return { y: Math.round(scrollY), top: Math.round(e.getBoundingClientRect().top), at: parseFloat(c.top) || 0, bs: c.boxShadow, f: c.filter }; }, cls(hd2))); }
        const early = rows.filter((r) => r.top > r.at + 1 && shadowOn(r.bs, r.f)); const late = rows.filter((r) => r.top <= r.at + 1 && r.y >= T + 600 - 2); const lateOn = late.length && late.every((r) => shadowOn(r.bs, r.f));
        const line = rows.map((r) => `y${r.y} top ${r.top}${r.top <= r.at + 1 ? ' STUCK' : ''} shadow ${alphaMax(r.bs)}`).join(' · ');
        if (early.length || !lateOn) bad.push(`${w} (bar at ${T}): ${line}`);
        if (w === 375 || w === 1280) { keep[w] = line; await p.evaluate((y) => scrollTo(0, y), Math.max(0, T - 300)); await sleep(page, 300); await p.screenshot({ path: path.join(OUT, `RX4-13-before-stuck-${w}.png`) }); }
      }
      c.rec('RX4-13', !bad.length, `a second bar one screen down, "Sticks when reached" + "Shadow": at ${WIDTHS.length} widths ${bad.length ? 'FAILING ' + bad.slice(0, 5).join(' ‖ ') : 'no shadow until it sticks, shadow once stuck'}; 375 ${keep[375]}; 1280 ${keep[1280]}`, 'RX4-13-before-stuck-375.png, RX4-13-before-stuck-1280.png');
    });
  },

  // ── RX4-18 · RX4-3 · RX4-2 · RX4-14 · RX4-20 — hover, press, touch, a Link ─────────────────────────────────────
  async states(c) {
    const { page } = c; const PROPS = ['transform', 'boxShadow', 'filter', 'opacity', 'outlineStyle', 'outlineWidth'];
    let t, bt, lk;
    await c.probe('build', async () => {
      await gapBand(page, '12rem'); // a band above, so the block under test is clear of the Preview's toolbar
      const b = await band(page); t = await into(page, b, 'Text'); bt = await under(page, t, 'Button'); lk = await under(page, bt, 'Link'); await H.panel(page, false);
    });
    await c.probe('RX4-18', async () => {
      await at(page, t, 'Design', 'Outline & effects');
      const looks = await ins(page).locator('button[aria-label$=" hover effect"]').evaluateAll((es) => es.map((b) => { const e = b.querySelector('.eu-root > span') || b.querySelector('span span'); const c = e ? getComputedStyle(e) : null; return [b.getAttribute('aria-label'), c ? [c.transform, c.boxShadow, c.filter, c.outlineStyle, c.opacity].join(' | ') : 'no preview']; }));
      const m = Object.fromEntries(looks); const none = looks.find(([l]) => /^(None|No effect|Nothing|Off)\b/i.test(l)); const plain = 'none | none | none | none | 1';
      const press = m['Press hover effect']; const base = none ? none[1] : plain;
      const dup = looks.filter(([, v], i) => looks.findIndex(([, w]) => w === v) !== i).map(([l]) => l);
      await ins(page).locator('button[aria-label="Press hover effect"]').first().screenshot({ path: path.join(OUT, 'RX4-18-press-tile.png') }).catch(() => {});
      c.rec('RX4-18', !!press && press !== base && !dup.length, `the gallery tiles' drawn looks ${JSON.stringify(m)}; "Press" vs ${none ? `"${none[0]}"` : 'a plain block'}: ${press} vs ${base}; tiles that look like an earlier one: ${JSON.stringify(dup)}`, 'RX4-18-press-tile.png');
    });
    await c.probe('RX4-3', async () => {
      const res = {}; const bad = [];
      for (const fx of ['Lift', 'Grow', 'Press', 'Glow', 'Outline', 'Brighten', 'Soften']) {
        await at(page, t, 'Design', 'Outline & effects'); await gal(page, `${fx} hover effect`);
        await pvOpen(page); const f = await pvAt(page, 1280); await moveAway(page);
        const rest = await read(f, cls(t), PROPS); const [x, y] = await center(f, cls(t)); await page.mouse.move(x, y); await sleep(page, 500);
        const hov = await read(f, cls(t), PROPS); await page.mouse.down(); await sleep(page, 400); const act = await read(f, cls(t), PROPS); if (fx === 'Press') await c.shot('RX4-3-press-held'); await page.mouse.up(); await moveAway(page);
        let calm = null; if (fx === 'Press') { await page.emulateMedia({ reducedMotion: 'reduce' }); await sleep(page, 300); await page.mouse.move(x, y); await page.mouse.down(); await sleep(page, 400); calm = await read(f, cls(t), ['transform', 'transitionDuration']); await page.mouse.up(); await moveAway(page); await page.emulateMedia({ reducedMotion: null }); }
        await pvClose(page, c.w);
        const hoverDiff = PROPS.filter((q) => rest[q] !== hov[q]); const pressMoves = hov.transform !== act.transform;
        res[fx] = { rest: rest.transform, hover: hov.transform, pressed: act.transform, hoverChanges: hoverDiff, calm };
        if (!pressMoves || (fx === 'Press' && (hoverDiff.length || act.transform === rest.transform))) bad.push(fx);
      }
      const s = await site(c); const actRules = (s.css.match(/[^{}]*:active[^{]*\{[^}]*\}/g) || []).map((r) => r.trim().slice(0, 120));
      c.rec('RX4-3', !bad.length && actRules.length > 0, `Preview 1280, a real mouse (rest → hover → held down) for the seven effects: ${JSON.stringify(res)}; ${bad.length ? 'NO PRESS on ' + bad.join(', ') : 'every one presses, "Press" only when pressed'}; export :active rules ${actRules.length}: ${JSON.stringify(actRules.slice(0, 4))}`, 'RX4-3-press-held.png');
    });
    await c.probe('RX4-2', async () => {
      await at(page, t, 'Design', 'Outline & effects'); await gal(page, 'Lift hover effect');
      const s = await site(c); const gated = /@media\s*\(hover:\s*hover\)/.test(s.css);
      const tr = (p) => p.evaluate((x) => { const c = getComputedStyle(document.querySelector(x)); return `${c.transform} | ${c.boxShadow.slice(0, 50)}`; }, cls(t));
      const m = await visit(c, s.url, { w: 1280, h: 800 }); const mRest = await tr(m); const [mx, my] = await center(m, cls(t)); await m.mouse.move(mx, my); await sleep(page, 500); const mHov = await tr(m);
      const p = await visit(c, s.url, { w: 390, h: 844, touch: true }); const mq = await p.evaluate(() => ({ hover: matchMedia('(hover: hover)').matches, coarse: matchMedia('(pointer: coarse)').matches }));
      const before = await tr(p); await p.tap(cls(t)); await sleep(page, 300); const after = await tr(p); await sleep(page, 1500); const later = await tr(p); await p.screenshot({ path: path.join(OUT, 'RX4-2-touch-after-tap.png') });
      c.rec('RX4-2', gated && later === before && mHov !== mRest, `export (hover: hover) gate ${gated}; a MOUSE at 1280 still lifts: "${mRest}" → "${mHov}"; a touch phone 390×844 ${JSON.stringify(mq)}: before "${before}", just after the tap "${after}", 1.5 s later "${later}"`, 'RX4-2-touch-after-tap.png');
    });
    await c.probe('RX4-14/RX4-20', async () => {
      const look = (p) => p.evaluate((x) => { const h = document.querySelector(x); const a = h.matches('a') ? h : h.querySelector('a'); const c = getComputedStyle(a); return { line: c.textDecorationLine, thick: c.textDecorationThickness, color: c.color }; }, cls(lk));
      const s = await site(c);
      const m = await visit(c, s.url, { w: 1280, h: 800 }); await m.mouse.move(2, 2); await sleep(page, 300); const rest = await look(m); const box = await m.locator(`${cls(lk)} a, a${cls(lk)}`).first().boundingBox(); await m.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await sleep(page, 400); const hov = await look(m); await m.screenshot({ path: path.join(OUT, 'RX4-14-link-hover-export.png') });
      const tp = await visit(c, s.url, { w: 390, h: 844, touch: true }); const tRest = await look(tp); const tb = await tp.locator(`${cls(lk)} a, a${cls(lk)}`).first().boundingBox(); await tp.touchscreen.tap(tb.x + tb.width / 2, tb.y + tb.height / 2); await sleep(page, 600); const tAfter = await look(tp).catch((e) => ({ error: e.message.split('\n')[0].slice(0, 80) }));
      const changed = (a, b) => a.thick !== b.thick || a.line !== b.line;
      c.rec('RX4-14', changed(rest, hov) && rest.color === hov.color && /underline/.test(hov.line) && !changed(tRest, tAfter), `export Link, a mouse at 1280: rest ${JSON.stringify(rest)} → hover ${JSON.stringify(hov)}; a touch phone: rest ${JSON.stringify(tRest)} → after a tap ${JSON.stringify(tAfter)}`, 'RX4-14-link-hover-export.png');
      // the canvas (RX4-20): the same rule on the editor's own sheet
      await deselect(page); await H.panel(page, false);
      const cLook = () => page.evaluate((id) => { const h = document.querySelector(`[data-box-id="${id}"]`); const a = h.querySelector('a') || h; const c = getComputedStyle(a); return { line: c.textDecorationLine, thick: c.textDecorationThickness, color: c.color }; }, lk);
      await page.mouse.move(2, 400); await sleep(page, 300); const cRest = await cLook(); const cb = await page.locator(`[data-box-id="${lk}"] a`).first().boundingBox();
      await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await sleep(page, 500); const cHov = await cLook(); await c.shot('RX4-20-link-hover-canvas');
      await pvOpen(page); const f = await pvAt(page, 1280); await moveAway(page); const pRest = await look(f); const pb = await f.locator(`${cls(lk)} a, a${cls(lk)}`).first().boundingBox(); await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2); await sleep(page, 400); const pHov = await look(f); await pvClose(page, c.w);
      c.rec('RX4-20', changed(cRest, cHov) && changed(pRest, pHov), `canvas Link: rest ${JSON.stringify(cRest)} → hover ${JSON.stringify(cHov)} (export hover thickness ${hov.thick}); Preview rest ${JSON.stringify(pRest)} → hover ${JSON.stringify(pHov)}`, 'RX4-20-link-hover-canvas.png');
    });
  },

  // ── RX4-17 · RX4-1 · RX4-7 — entrances ───────────────────────────────────────────────────────────────────────────
  async entrances(c) {
    const { page } = c; let eL, e1;
    await c.probe('build', async () => {
      const top = await band(page); eL = await into(page, top, 'Text'); await H.panel(page, false);
      await fullBand(page); await fullBand(page);
      const b1 = await band(page); e1 = await into(page, b1, 'Text'); await H.panel(page, false); await fullBand(page);
      await at(page, eL, 'Design', 'Outline & effects'); await gal(page, 'Rise up entrance');
      await at(page, e1, 'Design', 'Outline & effects'); await gal(page, 'Rise up entrance'); await ins(page).getByLabel('Play when it scrolls into view').check(); await sleep(page, 300);
    });
    await c.probe('RX4-17', async () => {
      // reopen the builder (the page is kept): the canvas starts at the top, the scroll-played Text two screens down
      await page.reload({ waitUntil: 'load' }); await ready(page); await deselect(page); await H.panel(page, false);
      const st = () => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const r = e.getBoundingClientRect(); return { wait: e.classList.contains('eu-wait'), op: +(+getComputedStyle(e).opacity).toFixed(2), inView: r.top < innerHeight && r.bottom > 0, anims: e.getAnimations().map((a) => a.playState) }; }, e1);
      const before = await st(); await c.shot('RX4-17-canvas-top');
      await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).scrollIntoView({ block: 'center' }), e1); await sleep(page, 1500); const after = await st(); await c.shot('RX4-17-canvas-scrolled-in');
      await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).scrollIntoView({ block: 'center' }), eL); await sleep(page, 500); await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).scrollIntoView({ block: 'center' }), e1); await sleep(page, 300); const again = await st();
      c.rec('RX4-17', !before.inView && before.wait && before.op < 0.05 && !after.wait && after.op > 0.99 && again.op > 0.99, `canvas, reopened at the top: ${JSON.stringify(before)}; scrolled into view: ${JSON.stringify(after)}; away and back: ${JSON.stringify(again)}`, 'RX4-17-canvas-top.png, RX4-17-canvas-scrolled-in.png');
    });
    await c.probe('RX4-7', async () => {
      const s = await site(c); c.store.enSite = s;
      const init = { fn: (sel) => { window.__s = []; const t0 = performance.now(); const tick = () => { const e = document.querySelector(sel); if (e) window.__s.push([Math.round(performance.now() - t0), +getComputedStyle(e).opacity]); if (performance.now() - t0 < 2500) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, arg: cls(eL) };
      const p = await visit(c, s.url, { init }); await sleep(page, 2600);
      const a = await anims(p, cls(eL)); const tok = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--eu-dur-slow').trim());
      const ms = /ms$/.test(tok) ? parseFloat(tok) : parseFloat(tok) * 1000; const samp = await p.evaluate(() => window.__s); const first = samp.find((x) => x[1] > 0.02), done = samp.find((x) => x[1] >= 0.999);
      const dur = a && a[0] ? a[0].dur : null; const played = first && done ? done[0] - first[0] : null;
      c.rec('RX4-7', dur != null && Math.abs(dur - ms) <= 1 && played != null && Math.abs(played - ms) <= 120, `on-load "Rise up": animation duration ${dur} ms; --eu-dur-slow "${tok}" = ${ms} ms; sampled opacity 0 → 1 in ≈ ${played} ms (first > 0 at ${first && first[0]}, 1 at ${done && done[0]})`, '');
    });
    await c.probe('RX4-1', async () => {
      const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 800 });
      const pos = () => p.evaluate((x) => { const e = document.querySelector(x); const r = e.getBoundingClientRect(); return { y: Math.round(scrollY), top: Math.round(r.top), op: +(+getComputedStyle(e).opacity).toFixed(2), tl: e.getAnimations().map((a) => (a.timeline ? a.timeline.constructor.name : null)).join(',') }; }, cls(e1));
      await p.mouse.move(640, 400); const down = [await pos()];
      for (let i = 0; i < 80 && down[down.length - 1].top > 300; i++) { await p.mouse.wheel(0, 60); await sleep(page, 140); down.push(await pos()); }
      for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 60); await sleep(page, 140); down.push(await pos()); }
      await p.screenshot({ path: path.join(OUT, 'RX4-1-scrolled-down.png') });
      const up = []; for (let i = 0; i < 90 && (up.length ? up[up.length - 1].y : 1) > 0; i++) { await p.mouse.wheel(0, -60); await sleep(page, 140); up.push(await pos()); if (i === 10) await p.screenshot({ path: path.join(OUT, 'RX4-1-scrolling-up.png') }); }
      const again = []; for (let i = 0; i < 80 && (again.length ? again[again.length - 1].top : 9999) > 300; i++) { await p.mouse.wheel(0, 60); await sleep(page, 140); again.push(await pos()); }
      const firstIn = down.findIndex((x) => x.top < 800); const waited = down.slice(0, Math.max(1, firstIn)).every((x) => x.op < 0.05);
      const reached = down.some((x) => x.op >= 0.99); const neverBack = up.every((x) => x.op >= 0.99) && again.every((x) => x.op >= 0.99);
      const noScrub = ![...down, ...up].some((x) => /ViewTimeline|ScrollTimeline/.test(x.tl));
      // no script: nothing may be left hidden
      const ctx = await c.browser.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false }); c.ctxs.push(ctx); const nj = await ctx.newPage(); await nj.goto(s.url, { waitUntil: 'load' }); await sleep(page, 1200);
      await nj.evaluate((x) => document.querySelector(x).scrollIntoView({ block: 'center' }), cls(e1)).catch(() => {}); await sleep(page, 900); const njOp = await nj.evaluate((x) => +getComputedStyle(document.querySelector(x)).opacity, cls(e1));
      const f = (arr) => arr.filter((_, i) => i % 3 === 0).map((x) => `y${x.y}/top${x.top}:op${x.op}`).join(' ');
      c.rec('RX4-1', waited && reached && neverBack && noScrub && njOp >= 0.99, `export 1280×800, the mouse wheel, Rise up + "Play when it scrolls into view": waits hidden until in view ${waited}; DOWN ${f(down)} ‖ UP ${f(up)} ‖ DOWN AGAIN ${f(again)}; timelines ${JSON.stringify([...new Set(down.map((x) => x.tl))])}; with script OFF the Text shows (opacity ${njOp})`, 'RX4-1-scrolled-down.png, RX4-1-scrolling-up.png');
    });
  },

  // ── RX4-19 — an entrance on a PINNED bar plays once; its arrival still follows the scroll ────────────────────────
  async pinned(c) {
    const { page } = c; let hd;
    await c.probe('build', async () => {
      const top = await band(page); await into(page, top, 'Text'); await H.panel(page, false); await fullBand(page);
      hd = await band(page); await into(page, hd, 'Link'); await H.panel(page, false); await swatch(page, hd, 'Background colour', '#f3f4f6');
      await fullBand(page); await fullBand(page); await fullBand(page);
      await at(page, hd, 'Design', 'Placement'); await gal(page, 'Sticks when reached option'); await gal(page, 'Shadow arrival');
      await at(page, hd, 'Design', 'Outline & effects'); await gal(page, 'Rise up entrance'); await ins(page).getByLabel('Play when it scrolls into view').check(); await sleep(page, 300);
    });
    await c.probe('RX4-19', async () => {
      const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 800 });
      const pos = () => p.evaluate((x) => { const e = document.querySelector(x); const c = getComputedStyle(e); return { y: Math.round(scrollY), top: Math.round(e.getBoundingClientRect().top), op: +(+c.opacity).toFixed(2), bs: c.boxShadow, f: c.filter, tl: e.getAnimations().map((a) => `${a.animationName}:${a.timeline ? a.timeline.constructor.name : null}`).join(',') }; }, cls(hd));
      await p.mouse.move(640, 400); const down = [await pos()];
      for (let i = 0, same = 0; i < 120 && same < 3; i++) { await p.mouse.wheel(0, 60); await sleep(page, 140); down.push(await pos()); same = down[down.length - 1].y === down[down.length - 2].y ? same + 1 : 0; } // to the bottom of the page
      await p.screenshot({ path: path.join(OUT, 'RX4-19-stuck.png') });
      const up = []; for (let i = 0; i < 120 && (up.length ? up[up.length - 1].y : 1) > 0; i++) { await p.mouse.wheel(0, -60); await sleep(page, 140); up.push(await pos()); }
      await p.screenshot({ path: path.join(OUT, 'RX4-19-back-at-top.png') });
      const reachedAt = down.findIndex((x) => x.op >= 0.99); const onceOk = reachedAt >= 0 && down.slice(reachedAt).every((x) => x.op >= 0.99) && up.every((x) => x.op >= 0.99);
      const stuckShadow = down.filter((x) => x.y > 0 && x.top <= 1).some((x) => shadowOn(x.bs, x.f)); const top0 = up[up.length - 1]; const scrubs = stuckShadow && top0 && top0.y === 0 && !shadowOn(top0.bs, top0.f);
      const f = (arr) => arr.filter((_, i) => i % 4 === 0).map((x) => `y${x.y}/top${x.top}:op${x.op}/sh${alphaMax(x.bs)}`).join(' ');
      c.rec('RX4-19', onceOk && scrubs, `a pinned bar one screen down, "Sticks when reached" + "Shadow" + Rise up "Play when it scrolls into view": entrance once ${onceOk}, shadow while stuck ${stuckShadow}, gone back at the top ${top0 && !shadowOn(top0.bs, top0.f)}; animations ${JSON.stringify([...new Set(down.map((x) => x.tl))])}; DOWN ${f(down)} ‖ UP ${f(up)}`, 'RX4-19-stuck.png, RX4-19-back-at-top.png');
    });
  },

  // ── RX4-6 · RX4-16 · RX4-21 · RX4-24 — colours that can be see-through, patterns ────────────────────────────────
  async backgrounds(c) {
    const { page } = c; let b1, ph, tw, pb, cb, ct;
    await c.probe('build', async () => {
      b1 = await band(page); await into(page, b1, 'Text'); await H.panel(page, false);
      ph = await band(page); await into(page, ph, 'Text'); await H.panel(page, false); await at(page, ph, 'Design', 'Size'); await field(page, 'Height', '14rem'); await upload(page, ph);
      tw = await band(page); await into(page, tw, 'Text'); await H.panel(page, false); await at(page, tw, 'Design', 'Size'); await field(page, 'Height', '14rem'); await upload(page, tw);
      pb = await band(page); await into(page, pb, 'Text'); await H.panel(page, false); await at(page, pb, 'Design', 'Size'); await field(page, 'Height', '12rem');
      cb = await band(page); ct = await into(page, cb, 'Text'); await H.panel(page, false);
    });
    await c.probe('RX4-6', async () => {
      await at(page, b1, 'Design', 'Background'); const typed = {};
      for (const v of ['#ff000080', 'rgba(255,0,0,.5)']) { await hexIn(page, 'Background colour', v); typed[`background ${v}`] = (await nodeOf(page, b1)).background ?? null; }
      await at(page, ph, 'Design', 'Background');
      await hexIn(page, 'Tint over background', 'rgba(0,0,0,.4)'); typed['tint rgba(0,0,0,.4)'] = (await nodeOf(page, ph)).bgOverlay ?? null;
      await hexIn(page, 'Tint over background', '#00000066'); typed['tint #00000066'] = (await nodeOf(page, ph)).bgOverlay ?? null;
      const seeThrough = (v) => !!v && (/^#[0-9a-f]{8}$/i.test(v) && !/ff$/i.test(v) || /^#[0-9a-f]{4}$/i.test(v) || /rgba?\([^)]*[,/]\s*0?\.\d+\s*\)/.test(v));
      // the two bands, one tinted and its untinted twin, at the same point (clear of the Text)
      const ptOf = (r) => [r.l + r.w * 0.85, r.t + r.h * 0.7];
      const viaExport = async () => { const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 900 }); const out = []; for (const id of [ph, tw]) { const r = await p.evaluate((x) => { const e = document.querySelector(x); e.scrollIntoView({ block: 'center' }); const R = e.getBoundingClientRect(); return { l: R.left, t: R.top, w: R.width, h: R.height }; }, cls(id)); await sleep(page, 200); out.push((await pixels(p, [ptOf(r)]))[0]); } await p.screenshot({ path: path.join(OUT, 'RX4-6-export.png') }); return out; };
      const viaCanvas = async () => { await deselect(page); await H.panel(page, false); await page.mouse.move(2, 400); const out = []; for (const id of [ph, tw]) { const r = await crect(page, id); await sleep(page, 200); out.push((await pixels(page, [ptOf(r)]))[0]); } return out; };
      const shows = ([a, b]) => a && b && sum(b) > 30 && sum(a) > 12 && sum(a) / sum(b) > 0.35 && sum(a) / sum(b) < 0.85; // 40 % black: about 0.6 of the photo
      const typedEx = await viaExport(); const typedCv = await viaCanvas(); await c.shot('RX4-6-canvas-typed');
      // a swatch, then the Opacity slider in the palette
      await at(page, ph, 'Design', 'Background'); await ins(page).getByRole('button', { name: 'Tint over background palette' }).first().click(); await sleep(page, 300);
      await page.locator('[role=dialog] button[title^="#374151"]').first().click().catch(() => {}); await sleep(page, 300);
      if (!(await page.getByRole('slider', { name: 'Tint over background opacity' }).first().isVisible().catch(() => false))) { await ins(page).getByRole('button', { name: 'Tint over background palette' }).first().click(); await sleep(page, 300); }
      const op = page.getByRole('slider', { name: 'Tint over background opacity' }).first(); const hasOpacity = await op.isVisible().catch(() => false);
      if (hasOpacity) { await op.fill('40'); await sleep(page, 400); } await c.shot('RX4-6-opacity'); await closePop(page);
      const slid = (await nodeOf(page, ph)).bgOverlay ?? null;
      const slidEx = await viaExport(); const slidCv = await viaCanvas();
      const opaque = [55, 65, 81]; const notOpaque = (px) => px && dist(px[0], opaque) > 20;
      const ok = seeThrough(typed['background #ff000080']) && seeThrough(typed['background rgba(255,0,0,.5)']) && seeThrough(typed['tint #00000066']) && seeThrough(typed['tint rgba(0,0,0,.4)']) && shows(typedEx) && shows(typedCv) && hasOpacity && seeThrough(slid) && notOpaque(slidEx) && notOpaque(slidCv);
      c.rec('RX4-6', ok, `typed → stored ${JSON.stringify(typed)}; tint #00000066 over a photo, pixel tinted / untinted twin: export ${JSON.stringify(typedEx)} canvas ${JSON.stringify(typedCv)}; swatch #374151 + "Opacity" slider (offered ${hasOpacity}) 40 % → stored ${JSON.stringify(slid)}, pixel export ${JSON.stringify(slidEx)} canvas ${JSON.stringify(slidCv)} (opaque would be ${JSON.stringify(opaque)})`, 'RX4-6-export.png, RX4-6-canvas-typed.png, RX4-6-opacity.png');
    });
    await c.probe('RX4-16/RX4-21', async () => {
      const lib = async () => { await at(page, pb, 'Design', 'Background'); await ins(page).getByRole('button', { name: 'Background library', exact: true }).first().click(); await sleep(page, 500); const dlg = page.locator('[role=dialog][aria-label="Background library picker"]'); const tabs = await dlg.getByRole('tab').allInnerTexts(); await dlg.getByRole('tab', { name: tabs.find((x) => /pattern/i.test(x)) }).first().click(); await sleep(page, 300); return dlg; };
      const layers = (v) => { let d = 0, n = 1; for (const ch of String(v || '')) { if (ch === '(') d++; else if (ch === ')') d--; else if (ch === ',' && d === 0) n++; } return n; };
      let dlg = await lib(); const names = await dlg.locator('button[aria-pressed]').evaluateAll((es) => es.map((e) => e.getAttribute('aria-label') || e.getAttribute('title') || e.innerText.trim())); await closePop(page);
      const rows = []; let dot = null;
      for (let i = 0; i < names.length; i++) {
        dlg = await lib(); await dlg.locator('button[aria-pressed]').nth(i).click(); await sleep(page, 500); await closePop(page);
        await at(page, pb, 'Design', 'Background'); const t = await insText(page); const n = await nodeOf(page, pb);
        const row = { name: names[i], layers: layers(n.bgImage), editor: /Edit pattern CSS/.test(t) ? 'pattern CSS' : /Edit gradient/.test(t) ? 'gradient' : 'none', tile: n.bgTile ?? null };
        rows.push(row); if (/dot grid/i.test(names[i])) { dot = row; await c.shot('RX4-16-dot-grid-inspector'); break; }
      }
      // every multi-layer pattern opens the pattern editor; Dot grid by name
      const wrong = rows.filter((r) => r.layers > 1 && r.editor !== 'pattern CSS');
      c.rec('RX4-16', !!dot && dot.editor === 'pattern CSS' && !wrong.length, `Background library → Patterns, each tile up to "Dot grid": ${JSON.stringify(rows)}; multi-layer patterns opening "Edit gradient": ${JSON.stringify(wrong)}`, 'RX4-16-dot-grid-inspector.png');
      // RX4-21: the tile size in rem — stored, exported, and it grows with the reader's text size
      const pxTiles = rows.filter((r) => r.tile && /px/.test(r.tile));
      const s = await site(c); const rule = (s.css.match(new RegExp(cls(pb).replace('.', '\\.') + '(?![\\w-])[^{]*\\{[^}]*background-size[^}]*\\}', 'g')) || []).join(' ').match(/background-size:[^;}]+/g) || [];
      const p = await visit(c, s.url, { w: 1280, h: 800 }); const bs1 = (await read(p, cls(pb), ['backgroundSize'])).backgroundSize; await p.evaluate(() => { document.documentElement.style.fontSize = '200%'; }); await sleep(page, 300); const bs2 = (await read(p, cls(pb), ['backgroundSize'])).backgroundSize; await p.screenshot({ path: path.join(OUT, 'RX4-21-pattern-200pc.png') });
      const n1 = parseFloat(bs1), n2 = parseFloat(bs2);
      c.rec('RX4-21', !!dot && !!dot.tile && !/px/.test(dot.tile) && !pxTiles.length && rule.every((r) => !/\dpx/.test(r)) && n2 > n1 * 1.9 && n2 < n1 * 2.1, `stored tiles ${JSON.stringify(rows.map((r) => r.tile))} (px: ${JSON.stringify(pxTiles.map((r) => r.name))}); export ${JSON.stringify(rule)}; drawn ${bs1} → at 200 % root text ${bs2}`, 'RX4-21-pattern-200pc.png');
    });
    await c.probe('RX4-24', async () => {
      await at(page, cb, 'Design', 'Background'); await hexIn(page, 'Background colour', '#00000099'); const n = await nodeOf(page, cb);
      await at(page, ct, 'Design'); const wcag = ((await insText(page)).match(/WCAG [\d.]+:1[^·]*/g) || []);
      await page.getByRole('button', { name: /^Page check/ }).first().click(); await sleep(page, 800); const pc = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' '); await c.shot('RX4-24-page-check'); await page.keyboard.press('Escape'); await sleep(page, 300);
      const s = await site(c); const p = await visit(c, s.url, { w: 1280, h: 800 });
      const truth = await p.evaluate(([b, t]) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const g = cv.getContext('2d'); let under = 'rgb(255,255,255)'; for (let x = document.querySelector(b).parentElement; x; x = x.parentElement) { const c = getComputedStyle(x).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)') { under = c; break; } } g.fillStyle = under; g.fillRect(0, 0, 1, 1); g.fillStyle = getComputedStyle(document.querySelector(b)).backgroundColor; g.fillRect(0, 0, 1, 1); const d = g.getImageData(0, 0, 1, 1).data; const T = document.querySelector(t); const k = T.querySelector('p,span,h1,h2,h3,div') || T; return { band: getComputedStyle(document.querySelector(b)).backgroundColor, under, composite: `rgb(${d[0]},${d[1]},${d[2]})`, text: getComputedStyle(k).color }; }, [cls(cb), cls(ct)]);
      const ratio = await contrastIn(p, truth.text, truth.composite);
      const audit = await p.evaluate(auditDoc, { rungs: { tp: EDGE.TP, tl: EDGE.TL } }); const tag = cls(ct).slice(-4); const c29 = audit.err.filter((m) => /^C29/.test(m)); const flagged = c29.some((m) => m.includes(` ${tag} `) || m.includes(`in ${tag}`));
      c.rec('RX4-24', (ratio < 4.5) === flagged, `a Text on a band typed #00000099 (stored ${JSON.stringify(n.background)}): exported ${JSON.stringify(truth)}, the TRUE contrast ${ratio}; page-audit flags it ${flagged} (${JSON.stringify(c29).slice(0, 300)}); Inspector WCAG lines ${JSON.stringify(wcag)}; builder Page check mentions contrast ${/contrast/i.test(pc)}`, 'RX4-24-page-check.png');
    });
  },

  // ── RX4-15 — Advanced CSS says what it refused, in the four editor themes ───────────────────────────────────────
  async advanced(c) {
    const { page } = c; let t;
    await c.probe('build', async () => { const b = await band(page); t = await into(page, b, 'Text'); await H.panel(page, false); });
    await c.probe('RX4-15', async () => {
      const status = () => ins(page).getByRole('status', { name: 'Advanced CSS not applied' }).first();
      const say = async () => ((await status().isVisible().catch(() => false)) ? (await status().innerText()).replace(/\s+/g, ' ') : null);
      await advCss(page, t, 'transition: opacity 1s'); const fine = await say();
      await advCss(page, t, 'animation: x 1s infinite'); const inf = await say();
      await advCss(page, t, 'transition: height 1s'); const hgt = await say();
      await advCss(page, t, 'animation: x 1s infinite;\ntransition: height 1s, width 1s'); const both = await say();
      const themes = {};
      for (const th of THEMES) {
        await appTheme(page, th).catch(async () => { await page.keyboard.press('Escape'); });
        await at(page, t, 'Content', 'Advanced CSS'); const st = status(); await st.scrollIntoViewIfNeeded().catch(() => {});
        if (!(await st.isVisible().catch(() => false))) { themes[th] = 'NOT VISIBLE'; continue; }
        const m = await st.evaluate((e) => { const color = getComputedStyle(e).color; let bg = 'rgb(255,255,255)'; for (let x = e; x; x = x.parentElement) { const c = getComputedStyle(x).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)') { bg = c; break; } } return { color, bg }; });
        themes[th] = { ...m, contrast: await contrastIn(page, m.color, m.bg) }; await st.screenshot({ path: path.join(OUT, `RX4-15-${th}.png`) }).catch(() => {});
      }
      await appTheme(page, 'Light').catch(() => {});
      const s = await site(c); const p = await visit(c, s.url); const ex = await read(p, cls(t), ['animationName', 'animationIterationCount', 'transitionProperty']);
      const exInfinite = /infinite/.test(String(ex.animationIterationCount)); const cssInf = (s.css.match(/[^;{}]*\binfinite\b[^;{}]*/g) || []).slice(0, 4);
      const ok = !fine && inf && /Not applied/.test(inf) && /infinite/.test(inf) && hgt && /height/.test(hgt) && both && /infinite/.test(both) && /height/.test(both) && THEMES.every((th) => themes[th] && themes[th].contrast >= 4.5) && !exInfinite && !/height|width/.test(ex.transitionProperty);
      c.rec('RX4-15', ok, `"transition: opacity 1s" → ${JSON.stringify(fine)}; "animation: x 1s infinite" → ${JSON.stringify(inf)}; "transition: height 1s" → ${JSON.stringify(hgt)}; both → ${JSON.stringify(both)}; the message in the four themes ${JSON.stringify(themes)}; export ${JSON.stringify(ex)} (infinite on the Text ${exInfinite}; "infinite" elsewhere in the export ${JSON.stringify(cssInf)})`, 'RX4-15-Light.png, RX4-15-Dark.png, RX4-15-Midnight.png, RX4-15-Purple.png');
    });
  },
};

// ── the six windows, refilled ────────────────────────────────────────────────────────────────────────────────────
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const QUEUE = ['pager', 'edges', 'floating', 'condense', 'states', 'entrances', 'backgrounds', 'pinned', 'advanced'].filter((j) => !ONLY || ONLY.split(',').includes(j));
const ALL = []; const ERRS = {};
async function run(job, slot) {
  const w = 1366; const results = []; const store = {};
  const { browser, page, errs } = await H.open({ headed: true, w, h: 820, pos: [(slot % 3) * 620, Math.floor(slot / 3) * 480] });
  page.setDefaultTimeout(12000);
  const consoleErrs = []; page.on('console', (m) => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 160)); });
  const c = {
    page, w, store, browser, servers: [], ctxs: [],
    shot: (n) => page.screenshot({ path: path.join(OUT, `${n}.png`) }).catch(() => {}),
    rec: (id, ok, ev, shots) => { const v = ok === 'ERROR' ? 'ERROR' : ok ? 'PASS' : 'FAIL'; const row = { job, id, verdict: v, ev, shots }; results.push(row); ALL.push(row); console.log(`[${job}] ${id} ${v} · ${String(ev).slice(0, 600)}`); },
    async probe(id, fn) {
      page.__step = id; const e0 = errs.length;
      try { await fn(); } catch (e) {
        await page.screenshot({ path: path.join(OUT, `${job}-${id.replace(/[^\w-]+/g, '_')}-ERROR.png`) }).catch(() => {});
        c.rec(id === 'build' ? `${job} build` : id, 'ERROR', `${page.__step}: ${e.message.split('\n')[0].slice(0, 300)}`, `${job}-${id.replace(/[^\w-]+/g, '_')}-ERROR.png`);
        await page.emulateMedia({ reducedMotion: null }).catch(() => {}); await page.setViewportSize({ width: w, height: 820 }).catch(() => {});
        const x = page.getByRole('button', { name: /Exit preview/ }).first(); if (await x.isVisible().catch(() => false)) await x.click().catch(() => {});
        for (let i = 0; i < 3; i++) await closePop(page);
        await chip(page, 'Full width').catch(() => {});
      }
      for (const x of c.ctxs.splice(0)) await x.close().catch(() => {});
      for (const s of c.servers.splice(0)) s.close();
      if (errs.length > e0) results.push({ job, id: id + ' page error', verdict: 'BUG?', ev: errs.slice(e0).join(' | '), shots: '' });
    },
  };
  try { await JOBS[job](c); } finally {
    await page.screenshot({ path: path.join(OUT, `${job}-end.png`) }).catch(() => {});
    ERRS[job] = { pageErrors: errs, consoleErrors: [...new Set(consoleErrs)].slice(0, 30) };
    fs.writeFileSync(path.join(OUT, `results-${job}.json`), JSON.stringify({ results, ...ERRS[job] }, null, 1));
    console.log(`[${job}] done · ${results.length} rows · ${errs.length} page errors · ${consoleErrs.length} console errors${consoleErrs.length ? ' ' + JSON.stringify([...new Set(consoleErrs)].slice(0, 5)) : ''}`);
    await browser.close();
  }
}
(async () => {
  console.log(`HEADED UAT — RX-4 fixes RX4-1 … RX4-24 · ${QUEUE.length} jobs in six windows · ${WIDTHS.length} widths / ${SCREENS.length} screens`);
  const q = [...QUEUE];
  await Promise.all(Array.from({ length: Math.min(6, q.length) }, async (_, slot) => { while (q.length) { const job = q.shift(); try { await run(job, slot); } catch (e) { ALL.push({ job, id: `${job} window`, verdict: 'ERROR', ev: e.message.split('\n')[0] }); console.log(`[${job}] window ERROR ${e.message.split('\n')[0]}`); } } }));
  const by = (v) => ALL.filter((r) => r.verdict === v).length;
  const covered = new Set(ALL.filter((r) => /^RX4-\d+$/.test(r.id) && ['PASS', 'FAIL'].includes(r.verdict)).map((r) => r.id));
  const missing = ONLY ? [] : EXPECT.filter((id) => !covered.has(id));
  const failing = ALL.filter((r) => ['FAIL', 'ERROR'].includes(r.verdict)).map((r) => r.id);
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ when: new Date().toISOString(), widths: WIDTHS.length, screens: SCREENS.length, rows: ALL, missing, errors: ERRS }, null, 1));
  console.log(`SUMMARY · PASS ${by('PASS')} · FAIL ${by('FAIL')} · ERROR ${by('ERROR')} · page-error rows ${by('BUG?')} · lines with no verdict ${missing.length ? missing.join(', ') : 'none'}${failing.length ? ' · failing: ' + failing.join(', ') : ''}`);
  process.exitCode = failing.length || missing.length ? 1 : 0;
})();
