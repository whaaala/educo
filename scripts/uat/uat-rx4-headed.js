// HEADED UAT — BATCH RX-4 step 3b · is each EFFECT & MOTION capability that docs/web-anatomy/effects-tiers/02-ours-code.md
// CLAIMS really there for a person? Six visible windows, one slice of the rows each; every state BUILT THROUGH THE UI (RULE Y:
// palette tiles, drops, clicks, Inspector controls — localStorage is only READ, to report what was stored); then what a visitor
// gets: the real Preview (the iframe of the export) and the builder's own Export, unzipped and served (page-weight.js), opened in
// a second visible window — with a mouse, a keyboard, a touch screen, reduced motion and scrolling. Screenshots under scripts/uat/rx4/.
//   W1 states: hover · press · focus · cursor · cascade · touch           HV-1..18 · A11Y-5 · RX4-2 · RX4-3
//   W2 entrances & motion tokens · reduced motion · accordion · alert       EN-1..11 · MO-1..6 · A11Y-1/2 · RX4-1 · V-6
//   W3 held / pinned · arrivals · glass · Advanced CSS limits               PN-1..9 · BL-11 · WT-2/3 · RX4-4
//   W4 backgrounds · band edges · blending · text via Advanced CSS          BG-1..11 · ST-1..10 · BL-1..10 · TX-8/9/12 · V-4 · V-10
//   W5 one at a time: pager · slider · rotating hero                        SC-8/9 · PT-7 · HV-16 · A11Y-3/6 · RX4-5
//   W6 every block's Inspector vocabulary · the export · weight · pages      PT-* · TX-* · CU-* · SC-* · WT-* · A11Y-4/7/8/9 · MO-7
//   --follow: the second pass (F1 stagger · F2 accordion frames · F3 toast / dismiss · F4 sticky column · F5 floating corner ·
//             F6 Grid Inspector · F7 where the pager's arrows and dots are drawn)
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-rx4-headed.js [--follow] [--only=W1,W3]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const I = require('./inspector.js'); const W = require('./page-weight.js');
const X = require('./uat-rx3-headed.js'); const { WIDTHS } = require('./screens.js');
const { cls, sleep, nodeOf, deselect, band, into, under, tileThen, sel, expandInspector, at, ins, insText, btn, choose, field, slider, chip, pvOpen, frame, pvAt, pvClose } = X;
const OUT = path.join(__dirname, 'rx4'); fs.mkdirSync(OUT, { recursive: true });
const IMG = path.join(__dirname, 'img');
let sharp = null; try { sharp = require('sharp'); } catch { /* pixel checks skipped */ }

// ── helpers ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const gal = (page, name) => btn(page, name, ins(page));
const pressedOf = (page, name) => ins(page).getByRole('button', { name, exact: true }).first().getAttribute('aria-pressed').catch(() => null);
const defaultStyle = (page) => async () => { const m = page.getByRole('menuitem', { name: /^Default$/ }).first(); if (await m.isVisible().catch(() => false)) await m.click(); };
/** Open every Inspector section (the accordion headers only — never a popover). */
async function openSections(page) {
  for (let k = 0; k < 12; k++) {
    const n = await ins(page).evaluate((a) => { const b = Array.from(a.querySelectorAll('button[aria-expanded="false"]')).find((e) => !e.hasAttribute('aria-haspopup') && /w-full/.test(e.className) && /py-2\.5/.test(e.className)); if (b) { b.click(); return 1; } return 0; }).catch(() => 0);
    if (!n) break; await sleep(page, 150);
  }
}
async function vocab(page, id) {
  const out = {};
  for (const tb of ['Design', 'Content', 'Per-device']) {
    await sel(page, id); await expandInspector(page); if (!(await I.tab(page, tb))) continue; await openSections(page);
    out[tb] = await insText(page);
    out[tb + ' tiles'] = await ins(page).evaluate((a) => Array.from(a.querySelectorAll('button[aria-pressed]')).map((e) => e.getAttribute('aria-label') || e.innerText.trim()).filter(Boolean)).catch(() => []);
    out[tb + ' controls'] = await ins(page).evaluate((a) => Array.from(a.querySelectorAll('input,select,textarea,[role=slider]')).map((e) => e.getAttribute('aria-label') || '').filter(Boolean)).catch(() => []);
  }
  return out;
}
const read = (f, s, props) => f.evaluate(([s, props]) => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); return Object.fromEntries(props.map((p) => [p, c[p]])); }, [s, props]);
const anims = (f, s) => f.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; return e.getAnimations().map((a) => { const t = a.effect.getTiming(); let kf = []; try { kf = a.effect.getKeyframes().map((k) => Object.keys(k).filter((x) => !['offset', 'easing', 'composite', 'computedOffset'].includes(x)).join('+')); } catch {} return { name: a.animationName || a.transitionProperty || a.constructor.name, dur: t.duration, delay: t.delay, fill: t.fill, iter: t.iterations, timeline: a.timeline ? a.timeline.constructor.name : null, state: a.playState, kf: [...new Set(kf)] }; }); }, s);
/** Every CSS rule the export carries: styles.css plus every inline <style>. */
const allCss = (files) => Object.entries(files).filter(([n]) => /\.(css|html)$/.test(n)).map(([n, b]) => { const t = b.toString('utf8'); return n.endsWith('.css') ? t : (t.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).join('\n'); }).join('\n');
async function site(c) { const files = await W.exportFiles(c.page); const { server, url } = await W.serve(files); c.servers.push(server); return { files, url, css: allCss(files) }; }
/** The exported site, in its own visible window (a visitor's browser). */
async function visit(c, url, { w = 1280, h = 800, touch = false, reduce = false, init = null, file = '' } = {}) {
  const ctx = await c.browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ...(touch ? { hasTouch: true, isMobile: true } : {}), reducedMotion: reduce ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage(); if (init) await p.addInitScript(init.fn, init.arg); await p.goto(url + file, { waitUntil: 'load' }); await p.waitForTimeout(700);
  c.ctxs.push(ctx); return p;
}
const center = async (f, s) => { const e = await f.$(s); const b = await e.boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2, b]; };
/** Mean RGB of a small square of a screenshot (page coordinates). */
async function pixel(p, x, y, r = 2) {
  if (!sharp) return null; const buf = await p.screenshot(); const img = sharp(buf); const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  let n = 0; const s = [0, 0, 0]; for (let yy = Math.round(y - r); yy <= Math.round(y + r); yy++) for (let xx = Math.round(x - r); xx <= Math.round(x + r); xx++) { if (xx < 0 || yy < 0 || xx >= info.width || yy >= info.height) continue; const i = (yy * info.width + xx) * info.channels; s[0] += data[i]; s[1] += data[i + 1]; s[2] += data[i + 2]; n++; }
  return s.map((v) => Math.round(v / n));
}
async function upload(page, id) { await at(page, id, 'Design', 'Background'); const [ch] = await Promise.all([page.waitForEvent('filechooser', { timeout: 8000 }), ins(page).getByRole('button', { name: /Upload an image|Replace with an upload/ }).first().click()]); await ch.setFiles(path.join(IMG, 'wide.jpg')); await sleep(page, 1500); }
async function advCss(page, id, text) { await at(page, id, 'Content', 'Advanced CSS'); const f = ins(page).getByLabel('Advanced CSS', { exact: true }).first(); await f.scrollIntoViewIfNeeded(); await f.fill(text); await f.blur(); await sleep(page, 500); }
/** Close a popover only if one is open — Escape with nothing open DESELECTS the block (and closes the blocks panel). */
async function closePop(page) { if (await page.locator('[role=dialog]:not([aria-label="Blocks"])').first().isVisible().catch(() => false)) { await page.keyboard.press('Escape'); await sleep(page, 250); } }
/** The first of a tile's new blocks a person can select (the page band around it cannot be). Returns its id. */
async function selFirst(page, fresh) {
  const order = fresh.length > 1 ? [...fresh.slice(1), fresh[0]] : fresh;
  for (const id of order) { try { await sel(page, id); return id; } catch { /* next */ } }
  throw new Error(`none of ${fresh.length} new blocks could be selected`);
}
/** A tile that asks for photos first (Hero, Slider, Rotating hero, Photo gallery): choose three, then press its Add button. */
async function photoTile(page, tile, inMenu) {
  let menu = '';
  const fresh = await tileThen(page, tile, async () => {
    const m = page.getByRole('menu').last(); menu = (await m.innerText().catch(() => '')).replace(/\s+/g, ' ');
    const [ch] = await Promise.all([page.waitForEvent('filechooser', { timeout: 8000 }), m.getByRole('button', { name: /Choose photos/ }).first().click()]);
    await ch.setFiles(['landscape', 'portrait', 'wide'].map((n) => path.join(IMG, `${n}.jpg`))); await sleep(page, 2500);
    if (inMenu) await inMenu(m);
    const add = m.locator('button').filter({ hasText: /^\s*Add/ }).last(); await add.click(); await sleep(page, 1500);
  });
  return { fresh, menu };
}
async function moveAway(page) { const fr = await page.$('iframe'); const b = await fr.boundingBox(); await page.mouse.move(b.x + b.width - 8, b.y + b.height - 8); await sleep(page, 450); }

const SLICES = {
  // ── W1 · STATES ─────────────────────────────────────────────────────────────────────────────────────────────────
  async W1(c) {
    const { page } = c; const PROPS = ['transform', 'boxShadow', 'filter', 'opacity', 'outlineStyle', 'outlineWidth', 'outlineColor', 'transitionProperty', 'transitionDuration'];
    let t, bt, lk, b2, bt2;
    await c.probe('build', async () => {
      // a band above, so the block under test is clear of the Preview's own toolbar (a press there pressed "Exit preview")
      const sp = await band(page); await into(page, sp, 'Text'); await H.panel(page, false); await at(page, sp, 'Design', 'Size'); await field(page, 'Height', '12rem');
      const b = await band(page); t = await into(page, b, 'Text'); bt = await under(page, t, 'Button'); lk = await under(page, bt, 'Link');
      b2 = await band(page); bt2 = await into(page, b2, 'Button'); await H.panel(page, false);
      await at(page, b2, 'Design', 'Background'); await ins(page).getByRole('button', { name: 'Background colour palette' }).first().click(); await sleep(page, 300); await page.locator('[role=dialog] button[title="#f3f4f6"]').first().click().catch(() => {}); await closePop(page); await sleep(page, 300);
    });
    await c.probe('HV-gallery', async () => {
      await at(page, t, 'Design', 'Outline & effects');
      const tiles = await ins(page).locator('button[aria-label$=" hover effect"]').evaluateAll((es) => es.map((e) => e.getAttribute('aria-label')));
      c.rec('HV-gallery', 'INFO', `Hover & focus gallery on a Text: ${tiles.length} tiles — ${tiles.join(' · ')}`, '');
    });
    const fxRes = {};
    for (const fx of ['Lift', 'Grow', 'Press', 'Glow', 'Outline', 'Brighten', 'Soften']) {
      await c.probe('HV-' + fx, async () => {
        await at(page, t, 'Design', 'Outline & effects'); await gal(page, `${fx} hover effect`);
        const pressed = await pressedOf(page, `${fx} hover effect`); const stored = (await nodeOf(page, t)).hoverEffect;
        await pvOpen(page); const f = await pvAt(page, 1280); await moveAway(page);
        const rest = await read(f, cls(t), PROPS); const [x, y] = await center(f, cls(t)); await page.mouse.move(x, y); await sleep(page, 500);
        const hov = await read(f, cls(t), PROPS); await c.shot(`HV-${fx}-hover`);
        await page.mouse.down(); await sleep(page, 400); const act = await read(f, cls(t), PROPS); await c.shot(`HV-${fx}-pressed`); await page.mouse.up(); await moveAway(page);
        let calm = null; if (['Lift', 'Grow', 'Press'].includes(fx)) { await page.emulateMedia({ reducedMotion: 'reduce' }); await sleep(page, 300); await page.mouse.move(x, y); await sleep(page, 400); calm = await read(f, cls(t), ['transform', 'boxShadow', 'transitionDuration']); await moveAway(page); await page.emulateMedia({ reducedMotion: null }); }
        await pvClose(page, c.w);
        const diff = PROPS.filter((p) => !/^transition/.test(p) && rest[p] !== hov[p]).map((p) => `${p}: ${rest[p]} → ${hov[p]}`);
        const pressDiff = PROPS.filter((p) => !/^transition/.test(p) && hov[p] !== act[p]).map((p) => `${p}: ${hov[p]} → ${act[p]}`);
        fxRes[fx] = { stored, pressed, diff, pressDiff, transition: `${rest.transitionProperty} ${rest.transitionDuration}`, calm };
        c.rec('HV-' + fx, diff.length ? 'WORKS' : 'NO CHANGE', `stored hoverEffect="${stored}", tile aria-pressed=${pressed}; Preview 1280, real mouse: hover changes ${JSON.stringify(diff)}; mouse DOWN (:active) changes vs hover ${JSON.stringify(pressDiff)}; transition "${rest.transitionProperty} ${rest.transitionDuration}"${calm ? `; reduced motion + hover: ${JSON.stringify(calm)}` : ''}`, `HV-${fx}-hover.png, HV-${fx}-pressed.png`);
      });
    }
    c.store.fx = fxRes;
    await c.probe('HV-13/14/17', async () => {
      await at(page, bt, 'Design', 'Outline & effects'); await gal(page, 'Lift hover effect');
      await pvOpen(page); const f = await pvAt(page, 1280); await moveAway(page);
      await (await f.frameElement()).focus(); await f.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); document.body.focus(); });
      let hit = null; const stops = [];
      for (let i = 0; i < 12 && !hit; i++) { await page.keyboard.press('Tab'); await sleep(page, 120); const a = await f.evaluate(([b]) => { const e = document.activeElement; const c = getComputedStyle(e); const box = document.querySelector(b); return { tag: e.tagName.toLowerCase(), txt: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 20), ring: `${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor}`, inBtn: !!(box && box.contains(e)), btnTransform: box ? getComputedStyle(box).transform : null }; }, [cls(bt)]); stops.push(`${a.tag}"${a.txt}" ring ${a.ring}`); if (a.inBtn) hit = a; }
      await c.shot('HV-14-button-focused');
      const cur = await f.evaluate(([b, l, t]) => { const q = (s) => document.querySelector(s); const inner = (s) => q(s) && (q(s).querySelector('a,button') || q(s)); return { button: getComputedStyle(inner(b)).cursor, link: getComputedStyle(inner(l)).cursor, text: getComputedStyle(q(t)).cursor }; }, [cls(bt), cls(lk), cls(t)]);
      // HV-1: the link's colour / underline on hover
      await moveAway(page); const la = await f.evaluate((l) => { const a = document.querySelector(l).querySelector('a') || document.querySelector(l); const c = getComputedStyle(a); return `${c.color} ${c.textDecorationLine} ${c.textDecorationThickness}`; }, cls(lk));
      const [lx, ly] = await center(f, cls(lk)); await page.mouse.move(lx, ly); await sleep(page, 400);
      const lb = await f.evaluate((l) => { const a = document.querySelector(l).querySelector('a') || document.querySelector(l); const c = getComputedStyle(a); return `${c.color} ${c.textDecorationLine} ${c.textDecorationThickness}`; }, cls(lk)); await c.shot('HV-1-link-hover');
      await pvClose(page, c.w);
      c.rec('HV-13/14', hit ? 'SEEN' : 'NOT REACHED', `Tab stops: ${stops.join(' → ')}; on the Lift Button: focus ring "${hit && hit.ring}", the block's transform on keyboard focus "${hit && hit.btnTransform}"`, 'HV-14-button-focused.png');
      c.rec('HV-17', 'SEEN', `cursor: Button ${cur.button}, Link ${cur.link}, plain Text ${cur.text}`, '');
      c.rec('HV-1', la !== lb ? 'CHANGES' : 'NO CHANGE', `Link at rest "${la}" → hovered "${lb}"; no colour-on-hover control in the gallery (see HV-gallery)`, 'HV-1-link-hover.png');
    });
    await c.probe('HV-12', async () => {
      await at(page, b2, 'Design', 'Outline & effects'); await gal(page, 'Lift hover effect'); await at(page, bt2, 'Design', 'Outline & effects'); await gal(page, 'Grow hover effect');
      await pvOpen(page); const f = await pvAt(page, 1280); await moveAway(page);
      const r = async () => read(f, cls(b2), ['transform']).then(async (a) => `band ${a.transform} · button ${(await read(f, cls(bt2), ['transform'])).transform}`);
      const rest = await r(); const [, , bb] = await center(f, cls(b2)); const [bx, by] = await center(f, cls(bt2));
      await page.mouse.move(bb.x + bb.width - 30, bb.y + bb.height / 2); await sleep(page, 500); const onBand = await r(); await c.shot('HV-12-band-hover');
      await page.mouse.move(bx, by); await sleep(page, 500); const onBtn = await r(); await c.shot('HV-12-button-hover');
      await pvClose(page, c.w);
      c.rec('HV-12', 'SEEN', `band Lift + its Button Grow · rest: ${rest} · pointer on the band beside the button: ${onBand} · pointer on the button: ${onBtn}`, 'HV-12-band-hover.png, HV-12-button-hover.png');
    });
    await c.probe('HV-3', async () => {
      const b3 = await band(page); const s3 = await into(page, b3, 'Stack'); const im = await into(page, s3, 'Image'); await H.panel(page, false);
      const n = await H.fillImages(page);
      await at(page, s3, 'Design', 'Size'); const trim = ins(page).getByLabel(/Trim to size/).first(); const hasTrim = await trim.count(); if (hasTrim) await trim.check().catch(() => {});
      await at(page, im, 'Design', 'Outline & effects'); await gal(page, 'Grow hover effect');
      await pvOpen(page); const f = await pvAt(page, 1280); await moveAway(page);
      const rest = await read(f, cls(im), ['transform']); const ov = await read(f, cls(s3), ['overflow']); const [x, y] = await center(f, cls(im)); await page.mouse.move(x, y); await sleep(page, 500);
      const hov = await read(f, cls(im), ['transform']); const fr = await f.evaluate(([s, i]) => { const S = document.querySelector(s).getBoundingClientRect(), M = document.querySelector(i).getBoundingClientRect(); return `stack ${Math.round(S.width)}×${Math.round(S.height)}, image drawn ${Math.round(M.width)}×${Math.round(M.height)}`; }, [cls(s3), cls(im)]);
      await c.shot('HV-3-image-grow'); await pvClose(page, c.w);
      c.rec('HV-3', 'SEEN', `${n} photo uploaded; Stack "Trim to size" offered ${!!hasTrim}, stack overflow ${ov.overflow}; image Grow: ${rest.transform} → ${hov.transform}; ${fr}`, 'HV-3-image-grow.png');
    });
    await c.probe('HV-15', async () => {
      const fresh = await tileThen(page, 'Card', defaultStyle(page)); await H.panel(page, false);
      const s = await site(c); const act = (s.css.match(/[^{}]*:active[^{]*\{[^}]*\}/g) || []).map((r) => r.trim().slice(0, 140));
      c.store.cardIds = fresh;
      c.rec('HV-15', act.length ? 'SOME :active' : 'NO :active', `the export (Text Press, Buttons, a Card) has ${act.length} :active rules: ${JSON.stringify(act.slice(0, 6))}`, '');
      // RX4-2 / A11Y-5 — a touch screen: the Text carries Press last; set Lift so a tap that sticks is plain to see
      await at(page, t, 'Design', 'Outline & effects'); await gal(page, 'Lift hover effect');
      const s2 = await site(c); const gated = /\(hover:\s*hover\)/.test(s2.css);
      const p = await visit(c, s2.url, { w: 390, h: 844, touch: true });
      const mq = await p.evaluate(() => ({ hoverHover: matchMedia('(hover: hover)').matches, hoverNone: matchMedia('(hover: none)').matches, coarse: matchMedia('(pointer: coarse)').matches }));
      const tr = () => p.evaluate((s) => { const c = getComputedStyle(document.querySelector(s)); return `${c.transform} | ${c.boxShadow.slice(0, 40)}`; }, cls(t));
      const before = await tr(); await p.tap(cls(t)); await sleep(page, 300); const after = await tr(); await sleep(page, 1500); const later = await tr();
      await p.screenshot({ path: path.join(OUT, 'RX4-2-touch-after-tap.png') });
      await p.tap('body', { position: { x: 5, y: 830 } }).catch(() => {}); await sleep(page, 400); const away = await tr();
      c.rec('RX4-2', 'MEASURED', `export has a (hover: hover) gate: ${gated}; touch phone 390×844 media ${JSON.stringify(mq)}; Lift Text before tap "${before}" · just after tap "${after}" · 1.5 s later, finger gone "${later}" · after a tap elsewhere "${away}"`, 'RX4-2-touch-after-tap.png');
    });
  },

  // ── W2 · ENTRANCES ──────────────────────────────────────────────────────────────────────────────────────────────
  async W2(c) {
    const { page } = c; let eL, e1, st, kids, top;
    await c.probe('build', async () => {
      top = await band(page); eL = await into(page, top, 'Text');
      const filler = await band(page); await into(page, filler, 'Text'); await H.panel(page, false); await at(page, filler, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page));
      const b1 = await band(page); e1 = await into(page, b1, 'Text');
      const f2 = await band(page); await into(page, f2, 'Text'); await H.panel(page, false); await at(page, f2, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page));
      st = await band(page); const k1 = await into(page, st, 'Text'); const k2 = await under(page, k1, 'Text'); const k3 = await under(page, k2, 'Text'); kids = [k1, k2, k3]; await H.panel(page, false);
    });
    await c.probe('EN-gallery', async () => {
      await at(page, eL, 'Design', 'Outline & effects'); const tiles = await ins(page).locator('button[aria-label$=" entrance"]').evaluateAll((es) => es.map((e) => e.getAttribute('aria-label')));
      await gal(page, 'Rise up entrance'); const t = await insText(page);
      const timing = (t.match(/(duration|delay|speed|easing|ease|repeat|loop|seconds|ms\b)/gi) || []);
      c.rec('EN-gallery', 'INFO', `Entrance gallery: ${tiles.join(' · ')}; with "Rise up" chosen the panel offers: ${['Play when it scrolls into view', 'Bring the blocks inside in one after another'].filter((x) => t.includes(x)).join(' / ') || '(no checkbox)'}; timing words near it: ${JSON.stringify([...new Set(timing)])}`, '');
    });
    const enRes = {};
    for (const fx of ['Fade in', 'Rise up', 'Drop down', 'From the left', 'From the right', 'Zoom in', 'Sharpen']) {
      await c.probe('EN-' + fx, async () => {
        await at(page, eL, 'Design', 'Outline & effects'); await gal(page, `${fx} entrance`);
        const f = await pvOpen(page); const a = await anims(await frame(page), cls(eL)); await pvClose(page, c.w);
        enRes[fx] = a; c.rec('EN-' + fx, a && a.length ? 'ANIMATES' : 'NO ANIMATION', `Preview on load: ${JSON.stringify(a)}`, '');
      });
    }
    await c.probe('EN-2/V-6', async () => {
      await at(page, eL, 'Design', 'Outline & effects'); await gal(page, 'Rise up entrance');
      await at(page, e1, 'Design', 'Outline & effects'); await gal(page, 'Rise up entrance'); await ins(page).getByLabel('Play when it scrolls into view').check(); await sleep(page, 300);
      await at(page, st, 'Design', 'Outline & effects'); await gal(page, 'Fade in entrance'); await ins(page).getByLabel('Bring the blocks inside in one after another').check(); await sleep(page, 300);
      const s = await site(c); c.store.site = s;
      const init = { fn: (sel) => { window.__s = []; const t0 = performance.now(); const tick = () => { const e = document.querySelector(sel); if (e) window.__s.push([Math.round(performance.now() - t0), +getComputedStyle(e).opacity, getComputedStyle(e).transform]); if (performance.now() - t0 < 2500) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, arg: cls(eL) };
      const p = await visit(c, s.url, { init }); await sleep(page, 2600);
      const samp = await p.evaluate(() => window.__s); const first = samp.find((x) => x[1] > 0.02), done = samp.find((x) => x[1] >= 0.999);
      const a = await anims(p, cls(eL)); const toks = await p.evaluate(() => { const r = getComputedStyle(document.documentElement); const o = {}; for (const k of ['--eu-dur-fast', '--eu-dur-base', '--eu-dur-slow', '--eu-dur-slower', '--eu-dur-instant', '--eu-ease-standard', '--eu-ease-emphasized', '--eu-ease-decelerate', '--eu-ease-accelerate', '--eu-ease-spring']) o[k] = r.getPropertyValue(k).trim(); return o; });
      const declared = [...new Set((s.css.match(/--eu-(dur|ease)-[a-z-]+\s*:[^;}]+/g) || []).map((x) => x.replace(/\s+/g, ' ')))];
      c.rec('V-6', 'MEASURED', `on-load "Rise up": animation ${JSON.stringify(a)}; sampled opacity first > 0 at ${first && first[0]} ms, reached 1 at ${done && done[0]} ms (played ≈ ${done && first ? done[0] - first[0] : '?'} ms); tokens on :root ${JSON.stringify(toks)}`, '');
      c.rec('MO-1/2', 'MEASURED', `motion tokens declared in the export: ${JSON.stringify(declared)}`, '');
      const kd = []; for (const k of kids) kd.push(await anims(p, cls(k)));
      c.rec('EN-3', 'MEASURED', `stagger children animations: ${JSON.stringify(kd.map((x) => x && x.map((y) => `${y.name} ${y.dur}ms delay ${y.delay}`)))}; stagger rule literals: ${JSON.stringify((s.css.match(/nth-child\(\d+\)\{animation-delay:[^}]+\}/g) || []).slice(0, 3))}`, '');
      await p.screenshot({ path: path.join(OUT, 'EN-2-after-load.png') });
      // RX4-1 — scroll down to the scroll-played block, then back up, with the wheel
      const pos = async () => p.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); const a = e.getAnimations()[0]; return { y: Math.round(scrollY), top: Math.round(r.top), op: +(+getComputedStyle(e).opacity).toFixed(2), tf: getComputedStyle(e).transform, prog: a && a.effect.getComputedTiming().progress != null ? +a.effect.getComputedTiming().progress.toFixed(2) : null, tl: a && a.timeline ? a.timeline.constructor.name : null }; }, cls(e1));
      await p.mouse.move(640, 400); const down = [], up = []; const a1 = await anims(p, cls(e1));
      for (let i = 0; i < 16; i++) { await p.mouse.wheel(0, 60); await sleep(page, 160); down.push(await pos()); if (i === 7) await p.screenshot({ path: path.join(OUT, 'RX4-1-scrolling-down.png') }); }
      for (let i = 0; i < 16; i++) { await p.mouse.wheel(0, -60); await sleep(page, 160); up.push(await pos()); if (i === 8) await p.screenshot({ path: path.join(OUT, 'RX4-1-scrolling-up.png') }); }
      const f = (arr) => arr.map((x) => `y${x.y}/top${x.top}:op${x.op}${x.prog != null ? '/p' + x.prog : ''}`).join(' ');
      const backwards = up.some((x, i) => i > 0 && x.op < up[i - 1].op - 0.05);
      c.rec('RX4-1', backwards ? 'RUNS BACKWARDS' : 'DOES NOT RUN BACKWARDS', `animation ${JSON.stringify(a1)} · DOWN ${f(down)} ‖ UP ${f(up)}`, 'RX4-1-scrolling-down.png, RX4-1-scrolling-up.png');
      // reduced motion
      const r = await visit(c, s.url, { reduce: true }); await sleep(page, 600);
      const rr = {}; for (const [n, id] of [['onload', eL], ['scroll', e1], ['stagger kid', kids[1]]]) rr[n] = await r.evaluate((s) => { const e = document.querySelector(s); return `${e.getAnimations().length} animations, opacity ${getComputedStyle(e).opacity}, transform ${getComputedStyle(e).transform}`; }, cls(id));
      const rmBlocks = (s.css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{(?:[^{}]*\{[^}]*\})+\s*\}/g) || []).map((x) => x.replace(/\s+/g, ' '));
      const global = rmBlocks.filter((b) => /\*|html|body/.test(b.slice(0, 120)) || /animation-iteration-count|animation-duration|transition-duration/.test(b));
      c.rec('A11Y-1/2', 'MEASURED', `reduced motion: ${JSON.stringify(rr)}; ${rmBlocks.length} reduced-motion blocks in the export; global-looking ones: ${JSON.stringify(global.map((g) => g.slice(0, 300)))}; "animation-iteration-count" anywhere: ${/animation-iteration-count/.test(s.css)}; any "infinite": ${JSON.stringify((s.css.match(/[^;{}]*infinite[^;{}]*/g) || []).slice(0, 5))}`, '');
      c.rec('EN-5/SC-3 css', 'MEASURED', `export: @starting-style ${/@starting-style/.test(s.css)}, scroll-timeline / view-timeline (named) ${/scroll-timeline|view-timeline/.test(s.css)}, animation-timeline ${JSON.stringify([...new Set(s.css.match(/animation-timeline:[^;}]+/g) || [])])}, animation-range ${JSON.stringify([...new Set(s.css.match(/animation-range:[^;}]+/g) || [])])}`, '');
    });
    await c.probe('EN-9', async () => {
      const fresh = await tileThen(page, 'Accordion', defaultStyle(page)); await H.panel(page, false); const acc = await selFirst(page, fresh);
      const v = await vocab(page, acc); c.store.accVocab = v;
      const f = await pvOpen(page); const ff = await frame(page);
      const sumSel = `${cls(acc)} summary`; const has = await ff.$(sumSel);
      let res = 'no <summary>';
      if (has) { await ff.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sumSel); await sleep(page, 300); const [x, y] = await center(ff, sumSel);
        await ff.evaluate((s) => { window.__h = []; const d = document.querySelector(s).closest('details'); const t0 = performance.now(); const tick = () => { window.__h.push([Math.round(performance.now() - t0), Math.round(d.getBoundingClientRect().height)]); if (performance.now() - t0 < 700) requestAnimationFrame(tick); }; d.addEventListener('toggle', () => {}, { once: true }); requestAnimationFrame(tick); }, sumSel);
        await page.mouse.click(x, y); await sleep(page, 800);
        res = await ff.evaluate((s) => { const d = document.querySelector(s).closest('details'); const hs = [...new Set(window.__h.map((x) => x[1]))]; const all = d.getAnimations({ subtree: true }).map((a) => a.animationName || a.transitionProperty); return { open: d.open, distinctHeights: hs.length, heights: hs.slice(0, 8), animations: all, interpolateSize: getComputedStyle(document.documentElement).getPropertyValue('interpolate-size') }; }, sumSel);
        await c.shot('EN-9-accordion-open'); }
      await pvClose(page, c.w);
      c.rec('EN-9', 'MEASURED', `Accordion (Default design) designs offered: ${(v['Design tiles'] || []).slice(0, 40).join(' · ')}; clicked the first question: ${JSON.stringify(res)}`, 'EN-9-accordion-open.png');
    });
    await c.probe('EN-10/EN-6', async () => {
      const fresh = await tileThen(page, 'Alert', defaultStyle(page)); await H.panel(page, false); const al = await selFirst(page, fresh);
      const v = await vocab(page, al); c.store.alertVocab = v;
      const all = JSON.stringify(v); const toast = (v['Design tiles'] || []).concat(v['Content tiles'] || []).find((x) => /toast/i.test(x));
      if (toast) { await at(page, al, 'Design'); await openSections(page); await gal(page, toast).catch(() => {}); }
      const f = await pvOpen(page); const ff = await frame(page);
      const a = await ff.evaluate((s) => { const e = document.querySelector(s); const al = e.querySelector('.eu-alert') || e; const c = getComputedStyle(al); const b = Array.from(e.querySelectorAll('button')).map((x) => x.getAttribute('aria-label') || x.innerText.trim()); return { pos: c.position, anims: al.getAnimations().map((x) => x.animationName), buttons: b }; }, cls(al));
      await c.shot('EN-10-alert');
      let dismiss = null; const db = await ff.$(`${cls(al)} button`);
      if (db) { await ff.evaluate((s) => { window.__o = []; const e = document.querySelector(s); const al = e.querySelector('.eu-alert') || e; const t0 = performance.now(); const tick = () => { window.__o.push([Math.round(performance.now() - t0), +getComputedStyle(al).opacity, al.isConnected, getComputedStyle(al).display]); if (performance.now() - t0 < 900) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, cls(al)); await db.click(); await sleep(page, 1000); dismiss = await ff.evaluate(() => { const o = window.__o; const ops = [...new Set(o.map((x) => x[1]))]; return { distinctOpacities: ops.length, opacities: ops.slice(0, 8), end: o[o.length - 1] }; }); }
      await pvClose(page, c.w);
      c.rec('EN-10', 'MEASURED', `Alert words in its Inspector: Toast ${/toast/i.test(all)}, "Hide itself after" ${/Hide itself after/i.test(all)}, "stay dismissed" ${/stay dismissed/i.test(all)}; Toast design chosen: ${toast || 'none found'}; Preview: ${JSON.stringify(a)}`, 'EN-10-alert.png');
      c.rec('EN-6', 'MEASURED', `dismiss clicked: ${JSON.stringify(dismiss)}`, '');
    });
  },

  // ── W3 · HELD / PINNED ──────────────────────────────────────────────────────────────────────────────────────────
  async W3(c) {
    const { page } = c; let hd, hl, f1, hd2, f2, f3;
    await c.probe('build', async () => {
      hd = await band(page); hl = await into(page, hd, 'Link'); await H.panel(page, false);
      await at(page, hd, 'Design', 'Size'); await field(page, 'Height', '8rem');
      await at(page, hd, 'Design', 'Background'); await ins(page).getByRole('button', { name: 'Background colour palette' }).first().click(); await sleep(page, 300); await page.locator('[role=dialog] button[title="#f3f4f6"]').first().click().catch(() => {}); await closePop(page);
      f1 = await band(page); await into(page, f1, 'Text'); await H.panel(page, false); await at(page, f1, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page));
      hd2 = await band(page); await into(page, hd2, 'Link'); await H.panel(page, false);
      f2 = await band(page); await into(page, f2, 'Text'); await H.panel(page, false); await at(page, f2, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page));
      f3 = await band(page); await into(page, f3, 'Text'); await H.panel(page, false); await at(page, f3, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page));
    });
    // the probes that select blocks further down run BEFORE any header is held at the top of the canvas
    await c.probe('PN-7', async () => {
      const b = await band(page); const fb = await into(page, b, 'Button'); await H.panel(page, false);
      await at(page, fb, 'Design', 'Placement'); await btn(page, 'Floating', ins(page)); await gal(page, 'Floats on screen option');
      const g = ins(page).getByRole('group', { name: 'Held against' }); const opts = await g.getByRole('button').evaluateAll((es) => es.map((e) => e.getAttribute('title') || e.innerText));
      await g.getByRole('button', { name: '↘' }).first().click({ timeout: 3000 }).catch(async () => { await g.getByRole('button').nth(7).click(); }); await sleep(page, 400);
      await pvOpen(page); const res = {};
      for (const w of [375, 1280]) { const f = await pvAt(page, w, 800); const rr = []; for (const y of [0, 1200]) { await f.evaluate((y) => scrollTo(0, y), y); await sleep(page, 300); rr.push(await f.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return `scroll ${Math.round(scrollY)}: ${getComputedStyle(e).position} right-gap ${Math.round(innerWidth - r.right)} bottom-gap ${Math.round(innerHeight - r.bottom)}`; }, cls(fb))); } res[w] = rr; if (w === 375) await c.shot('PN-7-floating-375'); }
      await pvClose(page, c.w); const css = (await site(c)).css;
      c.rec('PN-7', 'MEASURED', `Held against offers ${JSON.stringify(opts)}; ↘ chosen; Preview: ${JSON.stringify(res)}; env(safe-area-inset) in the export: ${/safe-area-inset/.test(css)}`, 'PN-7-floating-375.png');
    });
    await c.probe('PN-6', async () => {
      const fresh = await tileThen(page, 'Side by side', null); let row = null; for (const id of fresh) { const n = await nodeOf(page, id); if (n && n.direction === 'row') { row = id; break; } }
      for (const t of ['Text', 'Text']) { await sel(page, row); await page.getByRole('button', { name: 'Add a block inside this one' }).first().click(); await sleep(page, 300); await page.getByRole('menuitem', { name: t, exact: true }).first().click(); await sleep(page, 700); await deselect(page); }
      const kids = (await nodeOf(page, row)).children.map((x) => x.id);
      await at(page, kids[0], 'Design', 'Size'); await field(page, 'Height', '120rem');
      await at(page, kids[1], 'Design', 'Placement'); await gal(page, 'Sticks when reached option');
      await pvOpen(page); const f = await pvAt(page, 1280); const y0 = await f.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, cls(row)); const res = [];
      for (const d of [0, 400, 900]) { await f.evaluate((y) => scrollTo(0, y), y0 + d); await sleep(page, 300); res.push(await f.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top), cls(kids[1]))); if (d === 900) await c.shot('PN-6-sticky-column'); }
      await pvClose(page, c.w);
      c.rec('PN-6', res[1] === res[2] ? 'HOLDS' : 'SCROLLS', `a Side by side of two Texts, the first 120rem tall, the second "Sticks when reached": its top as the row scrolls 0 / 400 / 900 px: ${res.join(' / ')}`, 'PN-6-sticky-column.png');
    });
    await c.probe('PN-5', async () => {
      for (const b of [f1, f2]) { await at(page, b, 'Design', 'Placement'); await gal(page, 'Sticks when reached option'); }
      await pvOpen(page); const f = await pvAt(page, 1280); const res = [];
      for (const y of [700, 1500, 2300]) { await f.evaluate((y) => scrollTo(0, y), y); await sleep(page, 400); res.push(await f.evaluate(([a, b]) => { const t = (s) => Math.round(document.querySelector(s).getBoundingClientRect().top); return `scroll ${Math.round(scrollY)}: band1 top ${t(a)} · band2 top ${t(b)}`; }, [cls(f1), cls(f2)])); if (y === 1500) await c.shot('PN-5-two-sticky-bands'); }
      await pvClose(page, c.w);
      for (const b of [f1, f2]) { await at(page, b, 'Design', 'Placement'); await gal(page, 'Scrolls away option'); }
      c.rec('PN-5', 'MEASURED', `two full-screen bands set "Sticks when reached": ${res.join(' ‖ ')}`, 'PN-5-two-sticky-bands.png');
    });
    await c.probe('PN-1', async () => {
      await at(page, hd, 'Design', 'Placement'); await gal(page, 'Sticks when reached option');
      const t = await insText(page); const tiles = await ins(page).locator('button[aria-label$=" option"], button[aria-label$=" arrival"]').evaluateAll((es) => es.map((e) => e.getAttribute('aria-label')));
      const ctrls = ['Held against', 'Distance from the edge', 'When it takes hold'].filter((x) => t.includes(x));
      await pvOpen(page); const f = await pvAt(page, 1280); await f.evaluate(() => scrollTo(0, 900)); await sleep(page, 500);
      const r = await f.evaluate((s) => { const e = document.querySelector(s); const chain = []; let x = e; for (let i = 0; x && i < 3; i++, x = x.parentElement) chain.push(`${x.tagName.toLowerCase()}${x.className ? '.' + String(x.className).split(' ')[0] : ''}:${getComputedStyle(x).position}`); return { chain, top: Math.round(e.getBoundingClientRect().top), scrollY }; }, cls(hd)); await c.shot('PN-1-sticky-900'); await pvClose(page, c.w);
      c.rec('PN-1', Math.abs(r.top) <= 1 && r.scrollY > 800 ? 'HOLDS' : 'DOES NOT HOLD', `tiles ${JSON.stringify(tiles)}, controls ${JSON.stringify(ctrls)}; Preview scrolled 900: header top ${r.top}px, position chain ${JSON.stringify(r.chain)}`, 'PN-1-sticky-900.png');
    });
    const PROPS = ['boxShadow', 'backgroundColor', 'backdropFilter', 'paddingTop', 'paddingBottom', 'minHeight', 'height'];
    await c.probe('RX4-4', async () => {
      await at(page, hd, 'Design', 'Placement'); await gal(page, 'Condense arrival'); const warn1 = await ins(page).locator('[role=status]').allInnerTexts().catch(() => []); const n1 = await nodeOf(page, hd);
      await at(page, hd, 'Design', 'Background'); await slider(page, 'Band height', 160);
      await at(page, hd, 'Design', 'Placement'); const warn2 = await ins(page).locator('[role=status]').allInnerTexts().catch(() => []); const n2 = await nodeOf(page, hd);
      const s = await site(c); const rule = (s.css.match(/@keyframes\s+eu-arrive-condense[^{]*\{(?:[^{}]*\{[^}]*\})+\s*\}/) || [''])[0];
      await pvOpen(page); const f = await pvAt(page, 1280); await f.evaluate(() => scrollTo(0, 0)); await sleep(page, 400);
      const a = await anims(f, cls(hd)); const r0 = await read(f, cls(hd), PROPS); const h0 = await f.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().height), cls(hd));
      const mid = []; for (const y of [40, 80, 160, 400]) { await f.evaluate((y) => scrollTo(0, y), y); await sleep(page, 300); mid.push(`scroll ${y}: h ${await f.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().height), cls(hd))} next-band top ${await f.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top), cls(f1))}`); }
      await c.shot('RX4-4-condensed'); await pvClose(page, c.w);
      c.rec('RX4-4', 'MEASURED', `Height 8rem set under Size → stored height ${JSON.stringify(n1.height)} minHeight ${n1.minHeight}; "Condense" panel says ${JSON.stringify(warn1)}; after Background → "Band height" 160 → stored minHeight ${n2.minHeight}, panel says ${JSON.stringify(warn2)}; animation ${JSON.stringify(a)}; keyframes ${JSON.stringify(rule.slice(0, 300))}; at rest ${JSON.stringify(r0)} h ${h0}; ${mid.join(' · ')}`, 'RX4-4-condensed.png');
    });
    await c.probe('PN-2 Glass', async () => {
      await at(page, hd, 'Design', 'Placement'); await gal(page, 'Glass arrival');
      await pvOpen(page); const f = await pvAt(page, 1280); await f.evaluate(() => scrollTo(0, 500)); await sleep(page, 500); const r = await read(f, cls(hd), ['backdropFilter', 'backgroundColor']); await c.shot('BL-11-glass'); await pvClose(page, c.w);
      c.rec('BL-11', 'MEASURED', `Glass arrival at scroll 500: ${JSON.stringify(r)}`, 'BL-11-glass.png');
    });
    await c.probe('PN-9', async () => {
      await at(page, hd, 'Design', 'Placement'); await gal(page, 'Nothing arrival');
      await at(page, hd2, 'Design', 'Placement'); await gal(page, 'Sticks when reached option'); await gal(page, 'Shadow arrival');
      await pvOpen(page); const f = await pvAt(page, 1280); const res = [];
      for (const y of [0, 60, 120, 400, 900, 1300]) { await f.evaluate((y) => scrollTo(0, y), y); await sleep(page, 400); res.push(await f.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return `scroll ${Math.round(scrollY)}: hd2 top ${Math.round(r.top)} shadow "${getComputedStyle(e).boxShadow.slice(0, 40)}"`; }, cls(hd2))); if (y === 400) await c.shot('PN-9-before-stuck'); }
      await pvClose(page, c.w);
      c.rec('PN-9', 'MEASURED', `a second sticky header 1 screen down, "Shadow" arrival (the top header has none): ${res.join(' · ')}`, 'PN-9-before-stuck.png');
    });
    await c.probe('PN-3', async () => {
      await at(page, hd, 'Design', 'Placement'); const t = await insText(page);
      c.rec('PN-3', 'MEASURED', `hide-on-scroll-down words in the pinned header's Placement: ${JSON.stringify((t.match(/hide[^.]{0,30}|scroll(ing)? (down|up)[^.]{0,20}|reappear[^.]{0,20}/gi) || []))}`, '');
    });
  },

  // ── W4 · BACKGROUNDS & BANDS ─────────────────────────────────────────────────────────────────────────────────────
  async W4(c) {
    const { page } = c; let b1, tx;
    await c.probe('build', async () => { b1 = await band(page); tx = await into(page, b1, 'Text'); await H.panel(page, false); });
    await c.probe('BG-1', async () => {
      await at(page, b1, 'Design', 'Background');
      const hex = ins(page).getByLabel('Background colour hex value').first(); const tries = {};
      for (const v of ['#ff000080', 'rgba(255,0,0,.5)', '#ff0000']) { await hex.fill(v); await hex.press('Enter'); await hex.blur(); await sleep(page, 400); tries[v] = (await nodeOf(page, b1)).background ?? null; }
      await ins(page).getByRole('button', { name: 'Background colour palette' }).first().click(); await sleep(page, 400);
      const pop = await page.locator('[role=dialog][aria-label="Background colour palette"]').first().innerText().catch(() => ''); const hasAlpha = await page.locator('[role=dialog][aria-label="Background colour palette"] input[type=range], [role=dialog][aria-label="Background colour palette"] [aria-label*=lpha], [role=dialog][aria-label="Background colour palette"] [aria-label*=pacity]').count();
      await c.shot('BG-1-palette'); await page.keyboard.press('Escape'); await sleep(page, 200);
      await at(page, b1, 'Design', 'Outline & effects'); await slider(page, 'See-through', 50);
      const s = await site(c); const p = await visit(c, s.url); const r = await read(p, cls(b1), ['backgroundColor', 'opacity']); const rt = await read(p, cls(tx), ['opacity', 'color']);
      c.rec('BG-1', 'MEASURED', `typed in "Background colour hex value": ${JSON.stringify(tries)}; palette popover alpha/opacity controls: ${hasAlpha} (text: ${JSON.stringify(pop.replace(/\s+/g, ' ').slice(0, 160))}); "See-through" 50 % → exported band ${JSON.stringify(r)}, its Text ${JSON.stringify(rt)}`, 'BG-1-palette.png');
      await at(page, b1, 'Design', 'Outline & effects'); await slider(page, 'See-through', 100);
    });
    await c.probe('BG-2/3/8', async () => {
      await at(page, b1, 'Design', 'Background'); await ins(page).getByRole('button', { name: 'Background library', exact: true }).first().click(); await sleep(page, 500);
      const dlg = page.locator('[role=dialog][aria-label="Background library picker"]'); const tabs = await dlg.getByRole('tab').allInnerTexts(); const counts = {};
      for (const tname of tabs) { await dlg.getByRole('tab', { name: tname }).first().click(); await sleep(page, 300); counts[tname.trim()] = await dlg.locator('button[aria-pressed]').count(); }
      await c.shot('BG-library');
      const gradTab = tabs.find((x) => /gradient/i.test(x)) || tabs[0]; await dlg.getByRole('tab', { name: gradTab }).first().click(); await sleep(page, 300); await dlg.locator('button[aria-pressed]').first().click(); await sleep(page, 500); await closePop(page);
      await at(page, b1, 'Design', 'Background'); const ge = await insText(page); const g0 = (await nodeOf(page, b1)).bgImage;
      const types = {}; for (const ty of ['Radial', 'Conic', 'Linear']) { const b = ins(page).getByRole('button', { name: ty, exact: true }).first(); if (await b.count()) { await b.click(); await sleep(page, 400); types[ty] = String((await nodeOf(page, b1)).bgImage).slice(0, 60); } else types[ty] = 'no control'; }
      const geCtrls = await ins(page).evaluate((a) => Array.from(a.querySelectorAll('input,[role=slider],button')).map((e) => e.getAttribute('aria-label') || '').filter((x) => /colour|color|angle|position|stop|centre|center|space|repeat/i.test(x)));
      await c.shot('BG-2-gradient-editor');
      const meshTab = tabs.find((x) => /mesh/i.test(x)); let mesh = null;
      if (meshTab) { await ins(page).getByRole('button', { name: 'Background library', exact: true }).first().click(); await sleep(page, 400); await dlg.getByRole('tab', { name: meshTab }).first().click(); await sleep(page, 300); await dlg.locator('button[aria-pressed]').first().click(); await sleep(page, 500); await closePop(page); mesh = String((await nodeOf(page, b1)).bgImage).slice(0, 160); }
      const patTab = tabs.find((x) => /pattern/i.test(x)); let pat = null;
      if (patTab) { await at(page, b1, 'Design', 'Background'); await ins(page).getByRole('button', { name: 'Background library', exact: true }).first().click(); await sleep(page, 400); await dlg.getByRole('tab', { name: patTab }).first().click(); await sleep(page, 300); await dlg.locator('button[aria-pressed]').nth(3).click(); await sleep(page, 500); await closePop(page); const n = await nodeOf(page, b1); await at(page, b1, 'Design', 'Background'); const t2 = await insText(page); pat = { tile: n.bgTile, css: String(n.bgImage).slice(0, 90), tileSizeField: /Tile size/.test(t2), editCss: /Edit pattern CSS/.test(t2) }; }
      const s = await site(c); const p = await visit(c, s.url); const bi = await read(p, cls(b1), ['backgroundImage', 'backgroundSize', 'backgroundRepeat']); await p.screenshot({ path: path.join(OUT, 'BG-8-pattern-export.png') });
      c.rec('BG-2/3/8', 'MEASURED', `library tabs & items ${JSON.stringify(counts)}; first gradient → ${String(g0).slice(0, 80)}; editor words: ${['Linear', 'Radial', 'Conic', 'Angle', 'Add colour', 'position'].filter((x) => ge.includes(x)).join(', ')}; type switches ${JSON.stringify(types)}; gradient controls ${JSON.stringify([...new Set(geCtrls)].slice(0, 20))}; mesh → ${mesh}; pattern ${JSON.stringify(pat)}; exported ${JSON.stringify(bi).slice(0, 220)}`, 'BG-library.png, BG-2-gradient-editor.png, BG-8-pattern-export.png');
    });
    let ph;
    await c.probe('BG-4/5/6 V-4 V-9', async () => {
      ph = await band(page); const pt = await into(page, ph, 'Text'); await H.panel(page, false);
      await at(page, ph, 'Design', 'Background'); await ins(page).getByRole('button', { name: 'Background library', exact: true }).first().click(); await sleep(page, 400);
      const dlg = page.locator('[role=dialog][aria-label="Background library picker"]'); const tabs = await dlg.getByRole('tab').allInnerTexts(); await dlg.getByRole('tab', { name: tabs.find((x) => /gradient/i.test(x)) || tabs[0] }).first().click(); await sleep(page, 300); await dlg.locator('button[aria-pressed]').first().click(); await sleep(page, 500); await closePop(page);
      const gradBefore = (await nodeOf(page, ph)).bgImage;
      await ins(page).getByRole('button', { name: 'Background colour palette' }).first().click(); await sleep(page, 300); await page.locator('[role=dialog] button[title="#d1d5db"]').first().click().catch(() => {}); await closePop(page);
      await upload(page, ph); const n1 = await nodeOf(page, ph);
      const t = await insText(page); const sels = ['Background size / fit', 'Background position', 'Background repeat'].filter((x) => t.includes(x) || true);
      const fit = await choose(page, 'Background size / fit', /contain/i).catch(() => 'no select');
      await ins(page).getByLabel('Fixed background (parallax)').check(); await sleep(page, 300);
      // the tint: what is shown, what typing an alpha does, what picking a swatch does
      const tintHex = ins(page).getByLabel('Tint over background hex value').first(); const shown = await tintHex.inputValue().catch(() => null); const tint = { shownBeforeChoosing: shown, storedBeforeChoosing: (await nodeOf(page, ph)).bgOverlay ?? null };
      for (const v of ['#00000066', 'rgba(0,0,0,.4)']) { await tintHex.fill(v); await tintHex.press('Enter'); await tintHex.blur(); await sleep(page, 400); tint[`typed ${v}`] = (await nodeOf(page, ph)).bgOverlay ?? null; }
      await ins(page).getByRole('button', { name: 'Tint over background palette' }).first().click(); await sleep(page, 300); await page.locator('[role=dialog] button[title="#374151"]').first().click().catch(() => {}); await closePop(page); await sleep(page, 300);
      tint.pickedSwatch = (await nodeOf(page, ph)).bgOverlay ?? null; await c.shot('V-4-tint-picked');
      const n2 = await nodeOf(page, ph);
      const s = await site(c); const p = await visit(c, s.url);
      const bg = await read(p, cls(ph), ['backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundAttachment']);
      const [x, y] = await center(p, cls(ph)); await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), cls(ph)); await sleep(page, 300); const [x2, y2, bb] = await center(p, cls(ph));
      const px = await pixel(p, bb.x + 20, bb.y + bb.height - 10); await p.screenshot({ path: path.join(OUT, 'V-4-tint-export.png') });
      const p375 = await visit(c, s.url, { w: 375, h: 700, touch: true }); const fixed375 = (await read(p375, cls(ph), ['backgroundAttachment'])).backgroundAttachment;
      c.rec('BG-4/5', 'MEASURED', `gradient chosen (${String(gradBefore).slice(0, 50)}) + colour #d1d5db + uploaded photo → stored bgImage "${String(n1.bgImage).slice(0, 40)}", background ${n1.background}; Fit options ${JSON.stringify(fit).slice(0, 160)} → stored bgSize ${n2.bgSize}; exported ${JSON.stringify({ ...bg, backgroundImage: bg.backgroundImage.slice(0, 160) })}`, '');
      c.rec('BG-6', 'MEASURED', `"Fixed (parallax scroll)" → stored ${n2.bgAttach}; export at 1280 ${bg.backgroundAttachment}; on a 375 touch phone ${fixed375}`, '');
      c.rec('V-4', 'MEASURED', `${JSON.stringify(tint)}; exported layers ${bg.backgroundImage.slice(0, 200)}; pixel inside the band over the photo ${JSON.stringify(px)}`, 'V-4-tint-picked.png, V-4-tint-export.png');
    });
    await c.probe('ST-1/2 V-10', async () => {
      const mk = async (colour) => { const b = await band(page); await into(page, b, 'Text'); await H.panel(page, false); await at(page, b, 'Design', 'Size'); await field(page, 'Height', '12rem'); await at(page, b, 'Design', 'Background'); await ins(page).getByRole('button', { name: 'Background colour palette' }).first().click(); await sleep(page, 300); await page.locator(`[role=dialog] button[title="${colour}"]`).first().click().catch(() => {}); await closePop(page); return b; };
      const gap = async () => { const b = await band(page); await into(page, b, 'Text'); await H.panel(page, false); await at(page, b, 'Design', 'Size'); await field(page, 'Height', '10rem'); return b; };
      const bN = await mk('#374151'); await gap(); const bS = await mk('#374151'); await gap(); const bC = await mk('#374151'); await gap(); const bX = await mk('#374151'); const bY = await mk('#d1d5db');
      for (const b of [bN, bS]) { await at(page, b, 'Design', 'Outline & effects'); await ins(page).getByRole('group', { name: 'Shadow' }).getByRole('button', { name: 'Bold' }).first().click(); await sleep(page, 300); }
      await at(page, bS, 'Design', 'Arrange'); const edgeBtns = await ins(page).locator('button[aria-label^="Bottom edge:"], button[aria-label^="Top edge:"]').evaluateAll((es) => es.map((e) => e.getAttribute('aria-label')));
      await gal(page, 'Bottom edge: Curve out'); const depth = ins(page).getByRole('slider', { name: 'Edge depth' }).first(); const dmax = await depth.getAttribute('max'); await slider(page, 'Edge depth', 30);
      await at(page, bC, 'Design', 'Arrange'); await gal(page, 'Bottom edge: Curve out'); await slider(page, 'Edge depth', 30);
      await at(page, bX, 'Design', 'Arrange'); await gal(page, 'Bottom edge: Slope right'); await slider(page, 'Edge depth', 30);
      const s = await site(c); const p = await visit(c, s.url);
      const one = async (b) => { await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), cls(b)); await sleep(page, 300); const r = await p.evaluate((s) => { const e = document.querySelector(s); const c = getComputedStyle(e); const R = e.getBoundingClientRect(); return { clip: c.clipPath.slice(0, 80), shadow: c.boxShadow.slice(0, 60), x: R.left + R.width / 2, bottom: R.bottom, right: R.right, left: R.left }; }, cls(b)); r.below = await pixel(p, r.x, r.bottom + 6); r.below20 = await pixel(p, r.x, r.bottom + 18); r.edge12 = await pixel(p, r.left + (r.right - r.left) * 0.03, r.bottom + 12); r.edge30 = await pixel(p, r.left + (r.right - r.left) * 0.03, r.bottom + 30); return r; };
      const rN = await one(bN); await p.screenshot({ path: path.join(OUT, 'V-10-shadow-straight.png') }); const rS = await one(bS); await p.screenshot({ path: path.join(OUT, 'V-10-shadow-curved.png') }); const rC = await one(bC); await p.screenshot({ path: path.join(OUT, 'ST-1-curve-out-no-shadow.png') });
      await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), cls(bX)); await sleep(page, 300);
      const cut = await p.evaluate((s) => { const R = document.querySelector(s).getBoundingClientRect(); return { x: R.left + R.width * 0.92, y: R.bottom - 6 }; }, cls(bX)); const cutPx = await pixel(p, cut.x, cut.y); const pageBg = await pixel(p, 3, 3); await p.screenshot({ path: path.join(OUT, 'ST-2-slope-cut.png') });
      const nextPx = await p.evaluate((s) => { const R = document.querySelector(s).getBoundingClientRect(); return { x: R.left + R.width / 2, y: R.top + 30 }; }, cls(bY)); const yPx = await pixel(p, nextPx.x, nextPx.y);
      c.rec('ST-1', 'MEASURED', `edge buttons ${JSON.stringify(edgeBtns)}; Edge depth slider max ${dmax}; exported curve clip ${rS.clip}`, '');
      c.rec('V-10', 'MEASURED', `Shadow "Bold" on two dark bands, the second with Bottom "Curve out" 30 %: straight → shadow ${rN.shadow}, clip ${rN.clip}, pixel 6px / 18px below the middle ${JSON.stringify(rN.below)} / ${JSON.stringify(rN.below20)}, near the left end 12px / 30px below ${JSON.stringify(rN.edge12)} / ${JSON.stringify(rN.edge30)} · curved → shadow ${rS.shadow}, clip ${rS.clip}, pixel 6px / 18px below the middle ${JSON.stringify(rS.below)} / ${JSON.stringify(rS.below20)}, near the left end 12px / 30px below ${JSON.stringify(rS.edge12)} / ${JSON.stringify(rS.edge30)}; page ${JSON.stringify(pageBg)}`, 'V-10-shadow-straight.png, V-10-shadow-curved.png');
      c.rec('ST-1 curve out', 'MEASURED', `a dark band with Bottom Curve out 30 % and NO shadow: clip ${rC.clip}; pixel at the middle 6px / 18px below its box (inside the curve) ${JSON.stringify(rC.below)} / ${JSON.stringify(rC.below20)}; page ${JSON.stringify(pageBg)}`, 'ST-1-curve-out-no-shadow.png');
      c.rec('ST-2', 'MEASURED', `dark band, Bottom "Slope right" 30 %, a light band right after: pixel inside the cut ${JSON.stringify(cutPx)} · next band's own colour ${JSON.stringify(yPx)} · page ${JSON.stringify(pageBg)}`, 'ST-2-slope-cut.png');
    });
    await c.probe('BL/TX advanced', async () => {
      await advCss(page, tx, 'mix-blend-mode: difference; -webkit-text-stroke: 1px red; text-shadow: 0 0 0.25rem black');
      await advCss(page, b1, 'background-blend-mode: multiply; mask-image: linear-gradient(black, transparent)');
      const b = await band(page); const gt = await into(page, b, 'Text'); await H.panel(page, false);
      await advCss(page, gt, 'background: linear-gradient(90deg, red, blue); -webkit-background-clip: text; background-clip: text; color: transparent');
      const s = await site(c); const p = await visit(c, s.url);
      const a = await read(p, cls(tx), ['mixBlendMode', 'webkitTextStroke', 'textShadow']); const inner = await p.evaluate((s) => { const e = document.querySelector(s); const k = e.querySelector('p,span,div') || e; const c = getComputedStyle(k); return { tag: k.tagName, stroke: c.webkitTextStrokeWidth + ' ' + c.webkitTextStrokeColor, shadow: c.textShadow }; }, cls(tx));
      const bb = await read(p, cls(b1), ['backgroundBlendMode', 'maskImage']);
      const g = await p.evaluate((s) => { const e = document.querySelector(s); const c = getComputedStyle(e); const k = e.querySelector('p,span') || e; const kc = getComputedStyle(k); return { boxClip: c.backgroundClip, boxColor: c.color, innerTag: k.tagName, innerColor: kc.color, innerFill: kc.webkitTextFillColor }; }, cls(gt));
      await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), cls(gt)); await sleep(page, 300); const el = await p.$(cls(gt)); await el.screenshot({ path: path.join(OUT, 'TX-8-gradient-text.png') }).catch(() => {});
      c.rec('BL-4/TX-9/TX-12', 'MEASURED', `Advanced CSS on a Text → exported block ${JSON.stringify(a)}, inner text ${JSON.stringify(inner)}`, '');
      c.rec('BL-5/BL-6', 'MEASURED', `Advanced CSS on a band → exported ${JSON.stringify(bb)}`, '');
      c.rec('TX-8', 'MEASURED', `Advanced CSS gradient-clip text → ${JSON.stringify(g)}`, 'TX-8-gradient-text.png');
    });
    await c.probe('BL-3 Hero', async () => {
      const { fresh, menu } = await photoTile(page, 'Hero'); await H.panel(page, false);
      const v = await vocab(page, await selFirst(page, fresh)); v.menu = menu; c.store.heroVocab = v;
      const s = await site(c); const p = await visit(c, s.url); const ov = await p.evaluate((ids) => { for (const id of ids) { const e = document.querySelector('.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-')); if (!e) continue; const all = [e, ...e.querySelectorAll('*')]; const g = all.map((x) => getComputedStyle(x).backgroundImage).find((b) => /gradient/.test(b)); const pse = getComputedStyle(e, '::before').backgroundImage + ' | ' + getComputedStyle(e, '::after').backgroundImage; if (g || /gradient/.test(pse)) return { layer: (g || pse).slice(0, 160) }; } return null; }, fresh);
      await p.screenshot({ path: path.join(OUT, 'BL-3-hero.png') });
      const words = JSON.stringify(v); c.rec('BL-3', 'MEASURED', `Hero Inspector words: scrim ${/scrim/i.test(words)}, overlay ${/overlay/i.test(words)}, tint ${/Tint over background/i.test(words)}; exported gradient layer ${JSON.stringify(ov)}`, 'BL-3-hero.png');
    });
  },

  // ── W5 · ONE AT A TIME ─────────────────────────────────────────────────────────────────────────────────────────
  async W5(c) {
    const { page } = c; let pg, bt3;
    await c.probe('build', async () => {
      pg = await band(page); const t1 = await into(page, pg, 'Text'); const t2 = await under(page, t1, 'Text'); bt3 = await under(page, t2, 'Button');
      const after = await band(page); await into(page, after, 'Button'); await H.panel(page, false);
      await at(page, pg, 'Design', 'Arrange'); await ins(page).getByLabel('Show one at a time').check(); await sleep(page, 500);
      await ins(page).getByRole('group', { name: 'Moving between them' }).getByRole('button', { name: 'Both' }).click(); await sleep(page, 300);
      await slider(page, 'Move on its own every', 3); await c.shot('SC-9-inspector');
    });
    await c.probe('SC-8/9 RX4-5', async () => {
      const t = await insText(page); const n = await nodeOf(page, pg);
      const s = await site(c); const p = await visit(c, s.url);
      const strip = '[data-eu-pager]';
      const info = await p.evaluate((s) => { const e = document.querySelector(s); const c = getComputedStyle(e); return { snap: c.scrollSnapType, behavior: c.scrollBehavior, overflowX: c.overflowX, auto: e.dataset.euPagerAuto, slides: e.children.length }; }, strip);
      const sample = async (ms) => { const out = []; const t0 = Date.now(); while (Date.now() - t0 < ms) { out.push(await p.evaluate((s) => Math.round(document.querySelector(s).scrollLeft), strip)); await sleep(page, 500); } return out; };
      const free = await sample(7500); await p.screenshot({ path: path.join(OUT, 'RX4-5-slider-moving.png') });
      const ctrls = await p.evaluate((s) => { const root = document.querySelector(s).parentElement.parentElement; const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }; return Array.from(root.querySelectorAll('a,button,[role=button]')).filter(vis).map((e) => (e.getAttribute('aria-label') || e.innerText || '').trim()).filter(Boolean); }, strip);
      const pauseCtl = ctrls.filter((x) => /pause|stop|play/i.test(x));
      const [, , sb] = await center(p, strip); await p.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2); await p.mouse.move(sb.x + sb.width / 2 + 5, sb.y + sb.height / 2 + 5); const hov = await sample(7000); await p.mouse.move(2, 790); await p.mouse.move(4, 795); const left = await sample(7000);
      const dots = await p.evaluate(() => Array.from(document.querySelectorAll('[data-eu-pager-dot]')).map((d) => `${d.getAttribute('aria-current') || '-'}:${getComputedStyle(d).opacity}`));
      // A11Y-6: keyboard — is the button on slide 3 focusable while slide 1 shows? are hidden slides inert?
      await p.evaluate((s) => { document.querySelector(s).scrollLeft = 0; }, strip); await sleep(page, 600);
      const inert = await p.evaluate((s) => Array.from(document.querySelector(s).children).map((k) => `${k.hasAttribute('inert') ? 'inert' : '-'}/${k.getAttribute('aria-hidden') || '-'}`), strip);
      await p.evaluate(() => { document.activeElement && document.activeElement.blur(); }); const tabs = [];
      for (let i = 0; i < 10; i++) { await p.keyboard.press('Tab'); await sleep(page, 150); tabs.push(await p.evaluate(([s, b]) => { const e = document.activeElement; const inSlide = document.querySelector(b)?.contains(e); return `${e.tagName.toLowerCase()}"${(e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 18)}"${inSlide ? '[SLIDE-3 BUTTON]' : ''} sl${Math.round(document.querySelector(s).scrollLeft)}`; }, [strip, cls(bt3)])); }
      await p.screenshot({ path: path.join(OUT, 'A11Y-6-tab.png') });
      // PT-7 — the arrow: does the strip glide (intermediate positions) or jump?
      await p.evaluate((s) => { document.querySelector(s).scrollLeft = 0; }, strip); await sleep(page, 700);
      const arrow = await p.$('[data-eu-pager-next], a[aria-label*="Next" i], button[aria-label*="Next" i]'); let glide = null;
      if (arrow) { await p.evaluate((s) => { window.__g = []; const e = document.querySelector(s); const t0 = performance.now(); const tick = () => { window.__g.push(Math.round(e.scrollLeft)); if (performance.now() - t0 < 900) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, strip); let how = "real click"; await arrow.click({ timeout: 3000 }).catch(async () => { how = "element.click() — a real click timed out (" + await arrow.evaluate((e) => { const r = e.getBoundingClientRect(); const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return "box " + Math.round(r.width) + "x" + Math.round(r.height) + ", hit " + (top ? top.tagName : "none"); }) + ")"; await arrow.evaluate((e) => e.click()); }); await sleep(page, 1000); c.store.how = how; glide = await p.evaluate(() => [...new Set(window.__g)]); }
      const rm = await visit(c, s.url, { reduce: true }); const rmS = []; for (let i = 0; i < 15; i++) { rmS.push(await rm.evaluate((s) => Math.round(document.querySelector(s).scrollLeft), strip)); await sleep(page, 500); }
      const moved = (a) => new Set(a).size > 1;
      c.rec('SC-8', 'MEASURED', `stored pager ${n.pager} nav ${n.pagerNav} auto ${n.pagerAuto}; export strip ${JSON.stringify(info)}; arrow "next" (${c.store.how}) scrollLeft frames ${JSON.stringify(glide)}`, '');
      c.rec('RX4-5', pauseCtl.length ? 'HAS A PAUSE' : 'NO VISIBLE PAUSE', `every 3 s, untouched 7.5 s: ${free.join(',')} (moved ${moved(free)}); visible controls around it ${JSON.stringify(ctrls)}; pause-like ${JSON.stringify(pauseCtl)}; Inspector text mentions pause: ${/pause/i.test(t)}`, 'RX4-5-slider-moving.png, SC-9-inspector.png');
      c.rec('SC-9', 'MEASURED', `mouse resting on it 7 s: ${hov.join(',')} (moved ${moved(hov)}); mouse gone 7 s: ${left.join(',')} (moved ${moved(left)}); REDUCED MOTION 7.5 s: ${rmS.join(',')} (moved ${moved(rmS)})`, '');
      c.rec('HV-16', 'MEASURED', `dots aria-current:opacity ${JSON.stringify(dots)}`, '');
      c.rec('A11Y-6', 'MEASURED', `slides inert/aria-hidden ${JSON.stringify(inert)}; Tab order from the top with slide 1 showing: ${tabs.join(' → ')}`, 'A11Y-6-tab.png');
    });
    await c.probe('Slider & Rotating hero tiles', async () => {
      const out = {};
      for (const tile of ['Slider', 'Rotating hero']) { const { fresh, menu } = await photoTile(page, tile); await H.panel(page, false); let pid = null; out[tile + ' menu'] = menu.slice(0, 300); for (const id of fresh) { const n = await nodeOf(page, id); if (n && n.pager) { pid = id; out[tile] = { pager: n.pager, nav: n.pagerNav, auto: n.pagerAuto ?? 0 }; break; } } if (!pid) out[tile] = `no pager among ${fresh.length} new blocks`; }
      c.rec('SC-8 tiles', 'MEASURED', `as added: ${JSON.stringify(out)}`, '');
    });
  },

  // ── W6 · VOCABULARY · EXPORT · WEIGHT ─────────────────────────────────────────────────────────────────────────────
  async W6(c) {
    const { page } = c; const voc = {};
    await c.probe('palette', async () => { await deselect(page); await H.panel(page, true); voc.palette = await page.evaluate(() => Array.from(document.querySelectorAll('[draggable="true"]')).map((e) => e.innerText.replace(/\s+/g, ' ').trim())); });
    const TILES = ['Stack', 'Side by side', 'Grid', 'Spacer', 'Divider', 'Hero', 'Rotating hero', 'Heading', 'Text', 'Button', 'Link', 'List', 'Image', 'Photo gallery', 'Slider', 'Video', 'Icon', 'Embed', 'Accordion', 'Alert', 'Card', 'Quote', 'Stat', 'Badge', 'Rating'];
    let vid = null;
    for (const tile of TILES) {
      await c.probe('vocab ' + tile, async () => {
        let menu = [];
        let fresh;
        if (['Hero', 'Rotating hero', 'Slider', 'Photo gallery'].includes(tile)) { const r = await photoTile(page, tile); fresh = r.fresh; menu = [r.menu]; }
        else if (tile === 'Grid') { fresh = await tileThen(page, tile, async () => { menu = [(await page.getByRole('menu').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400)]; await page.getByRole('button', { name: '2 across, 1 down' }).first().click(); }); }
        else fresh = await tileThen(page, tile, async () => { menu = await page.getByRole('menuitem').allInnerTexts().catch(() => []); await defaultStyle(page)(); });
        await H.panel(page, false); if (!fresh.length) throw new Error('nothing added');
        const id = await selFirst(page, fresh); if (tile === 'Video') vid = id;
        voc[tile] = { styles: menu.map((x) => x.trim()), ...(await vocab(page, id)) };
      });
    }
    await c.probe('toolbar', async () => { voc.toolbar = await page.evaluate(() => Array.from(document.querySelectorAll('header, [role=toolbar], nav')).map((e) => e.innerText.replace(/\s+/g, ' ')).join(' | ').slice(0, 3000)); });
    fs.writeFileSync(path.join(OUT, 'vocabulary.json'), JSON.stringify(voc, null, 1));
    const text = JSON.stringify(voc);
    const KW = { 'PT-2..6 page transition': /page transition|view transition|cross-?fade|between pages|curtain/i, 'ST-3 divider shapes': /wave|zigzag|zig-zag|scallop|torn|cloud|drip|triangle edge|divider shape/i, 'ST-4 layered waves': /layered|stacked wave/i, 'ST-6 moving edge': /drift|morph/i, 'ST-7 page snap': /snap|one at a time.*page|settle/i, 'ST-9 curtain footer': /curtain|reveal footer/i, 'BL-1 fade into next': /fade into|blend into|next band/i, 'BL-7 page colour per section': /page colour changes|colour as .* arrives/i, 'BL-9 stay-behind': /stay[- ]behind|slides up over/i, 'BG-7 video background': /video background|background video/i, 'BG-9 grain': /grain|noise/i, 'BG-10 moving background': /drift|animated background|moving background/i, 'BG-11 webgl': /webgl|shader|canvas background/i, 'HV-4 icon nudge / text swap': /nudge|roll|swap/i, 'HV-6 underline grows': /underline/i, 'HV-9 fill sweep': /sweep|fill/i, 'HV-10 reveal caption': /caption|overlay on hover|reveal/i, 'HV-18 direction-aware': /direction|proximity/i, 'EN-4 preloader': /preloader|loading screen|intro/i, 'EN-7 menu drawer': /drawer|hamburger|overlay menu/i, 'EN-8 dialog/popover/tooltip': /dialog|popover|tooltip|dropdown|modal/i, 'EN-11 list FLIP': /flip/i, 'SC-1/2 element parallax': /parallax/i, 'SC-4 progress bar': /progress/i, 'SC-5 scroll-spy': /scroll-?spy|highlight.*section|current section/i, 'SC-6 horizontal scroll': /horizontal/i, 'SC-7 marquee': /marquee|ticker/i, 'SC-10 clip reveal': /clip|full-bleed/i, 'SC-11 line draws': /draw|stroke/i, 'SC-12 smooth scroll': /smooth scroll|inertia/i, 'TX-1..7 text motion': /line reveal|letter|typewriter|rotating word|scramble|split|word by word/i, 'TX-8 gradient text': /gradient text|text gradient|shimmer/i, 'TX-9 outline text': /outline text|text stroke|stroke/i, 'TX-10 marker': /marker|highlight/i, 'TX-11 variable font': /variable|weight animat/i, 'TX-12 text shadow': /text shadow|halo|shadow on text/i, 'CU-1..5 cursor': /cursor|magnetic|spotlight|follows the pointer|tilt/i, 'MO-6 duration/delay/easing': /duration|delay|easing|\bease\b|repeat|loop|speed/i, 'A11Y-8 motion switch': /motion switch|reduce motion|less motion|animations? (on|off)/i, 'BL-4..6 blend / mask': /blend|mask/i, 'BL-11 glass': /glass|frosted|blur/i };
    const hits = {}; for (const [k, re] of Object.entries(KW)) { const m = new Set(); for (const [tile, v] of Object.entries(voc)) { if (tile === 'palette') continue; const tx = JSON.stringify(v); const g = new RegExp(re.source, 'gi'); let x; while ((x = g.exec(tx)) && m.size < 10) m.add(tile + ': ' + tx.slice(Math.max(0, x.index - 30), x.index + 40).replace(/[\\"]+/g, ' ')); } hits[k] = [...m]; }
    void text;
    c.rec('VOCAB', 'MEASURED', `Inspector (Design · Content · Per-device, every section opened) of every one of ${Object.keys(voc).filter((k) => TILES.includes(k)).length}/25 palette tiles + their style menus + the toolbar; keyword hits: ${JSON.stringify(hits)}`, 'vocabulary.json');
    await c.probe('WT-6', async () => {
      if (!vid) throw new Error('no video'); let v = null; for (const id of [vid]) { const n = await nodeOf(page, id); v = n; }
      const vids = await page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).map((e) => e.getAttribute('data-box-id')));
      let vb = null; for (const id of vids) { const n = await nodeOf(page, id); if (n && n.type === 'video') { vb = id; break; } }
      await at(page, vb, 'Content'); await field(page, 'Video URL', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
      c.store.vb = vb;
    });
    await c.probe('export', async () => {
      await page.getByRole('button', { name: 'Add page' }).first().click(); await sleep(page, 800);
      const pb = await band(page); await into(page, pb, 'Text'); await H.panel(page, false);
      const s = await site(c); const names = Object.keys(s.files); const html = names.filter((n) => n.endsWith('.html'));
      const idx = s.files['index.html'] ? s.files['index.html'].toString('utf8') : ''; const pf = idx.match(/<link rel="prefetch"[^>]*>/g) || [];
      const scripts = Object.values(s.files).map((b) => b.toString('utf8')).join('\n').match(/<script[^>]*src=[^>]*>/g) || [];
      const video = (idx.match(/<video[^>]*>/g) || []).slice(0, 2);
      const has = (re) => re.test(s.css) || html.some((h) => re.test(s.files[h].toString('utf8')));
      const scan = { viewTransition: has(/view-transition/), startingStyle: has(/@starting-style/), hoverGate: has(/\(hover:\s*hover\)/), prefersContrast: has(/prefers-contrast/), reducedTransparency: has(/prefers-reduced-transparency/), forcedColors: has(/forced-colors/), willChange: has(/will-change/), contentVisibility: has(/content-visibility/), iterationCount: has(/animation-iteration-count/), infinite: has(/\binfinite\b/), linearEasing: has(/linear\(/), safeArea: has(/safe-area-inset/), skipLink: /skip/i.test(idx), saveData: has(/save-data|saveData/i), ariaCurrentNav: has(/aria-current/) };
      const kf = [...new Set((s.css.match(/@keyframes\s+[\w-]+/g) || []))];
      c.rec('EXPORT', 'MEASURED', `files ${JSON.stringify(names.slice(0, 20))}; html pages ${html.length}; index.html prefetch links ${JSON.stringify(pf)}; external scripts ${JSON.stringify(scripts)}; <video> ${JSON.stringify(video)}; scan ${JSON.stringify(scan)}; keyframes ${JSON.stringify(kf)}`, '');
      const p = await visit(c, s.url); await p.screenshot({ path: path.join(OUT, 'EXPORT-index.png') });
      const vv = await p.evaluate(() => Array.from(document.querySelectorAll('video')).map((v) => ({ preload: v.getAttribute('preload'), poster: v.getAttribute('poster'), autoplay: v.autoplay, loading: v.getAttribute('loading') })));
      const scr = await p.evaluate(() => Array.from(document.scripts).map((x) => (x.src || 'inline ' + x.textContent.length + ' chars')));
      // forced colours: is the focus ring still there?
      await p.emulateMedia({ forcedColors: 'active' }); await p.keyboard.press('Tab'); await sleep(page, 200); const fc = await p.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); return `${e.tagName} "${(e.innerText || '').trim().slice(0, 20)}" outline ${c.outlineStyle} ${c.outlineWidth}`; }); await p.screenshot({ path: path.join(OUT, 'A11Y-7-forced-colors.png') });
      c.rec('WT-6/WT-1/A11Y-7', 'MEASURED', `a direct .mp4 Video: ${JSON.stringify(vv)}; scripts on the page ${JSON.stringify(scr)}; forced colours, first Tab → ${fc}`, 'EXPORT-index.png, A11Y-7-forced-colors.png');
    });
    await c.probe('weight', async () => { const w = await W.weigh(page); c.rec('WT-1 weight', 'MEASURED', `${JSON.stringify(w.numbers)} findings ${JSON.stringify(w.findings)}`, ''); });
    await c.probe('A11Y-9', async () => {
      const b = await band(page); const t = await into(page, b, 'Text'); await H.panel(page, false); await upload(page, b);
      await page.getByRole('button', { name: /^Page check/ }).first().click(); await sleep(page, 900); const pc = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' '); await c.shot('A11Y-9-page-check'); await page.keyboard.press('Escape');
      c.rec('A11Y-9', 'MEASURED', `a Text over an uploaded photo (no tint) → Page check says: ${JSON.stringify(pc.slice(0, 600))}; mentions contrast ${/contrast/i.test(pc)}`, 'A11Y-9-page-check.png');
    });
  },
};

// ── the second pass (--follow): six windows on what the first pass could not reach or left open ─────────────────────
Object.assign(SLICES, {
  // F1 · EN-3 — what "Bring the blocks inside in one after another" actually animates
  async F1(c) {
    const { page } = c;
    await c.probe('EN-3', async () => {
      const st = await band(page); const k1 = await into(page, st, 'Text'); const k2 = await under(page, k1, 'Text'); const k3 = await under(page, k2, 'Text'); await H.panel(page, false);
      await at(page, st, 'Design', 'Outline & effects'); await gal(page, 'Fade in entrance'); await ins(page).getByLabel('Bring the blocks inside in one after another').check(); await sleep(page, 300);
      const n = await nodeOf(page, st);
      const s = await site(c); const rules = (s.css.match(/[^{}]*\{animation:eu-reveal[^}]*\}|[^{}]*nth-child\(\d+\)\{animation-delay[^}]*\}/g) || []).slice(0, 4).map((r) => r.trim().slice(0, 140));
      const init = { fn: (ks) => { window.__s = []; const t0 = performance.now(); const tick = () => { window.__s.push([Math.round(performance.now() - t0), ...ks.map((s) => { const e = document.querySelector(s); return e ? +(+getComputedStyle(e).opacity).toFixed(2) : null; })]); if (performance.now() - t0 < 900) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, arg: [k1, k2, k3].map(cls) };
      const p = await visit(c, s.url, { init }); await sleep(page, 1000);
      const info = await p.evaluate(([st, ks]) => { const e = document.querySelector(st); const desc = (k) => `${k.tagName.toLowerCase()}.${String(k.className).split(' ')[0]} [${k.getAnimations().map((a) => a.animationName + ' delay ' + a.effect.getTiming().delay).join(',')}]`; return { block: desc(e), children: [...e.children].map(desc), texts: ks.map((s) => { const t = document.querySelector(s); let d = 0; let x = t; while (x && x !== e) { x = x.parentElement; d++; } return `${desc(t)} depth ${d}`; }) }; }, [cls(st), [k1, k2, k3].map(cls)]);
      const samp = await p.evaluate(() => window.__s.filter((_, i) => i % 6 === 0).map((x) => x.join('/')).join(' '));
      await p.screenshot({ path: path.join(OUT, 'EN-3-stagger.png') });
      c.rec('EN-3', 'MEASURED', `stored ${JSON.stringify({ revealEffect: n.revealEffect, revealStagger: n.revealStagger, children: (n.children || []).length })}; export rules ${JSON.stringify(rules)}; DOM ${JSON.stringify(info)}; opacity of the three Texts over the first 900 ms (ms/t1/t2/t3): ${samp}`, 'EN-3-stagger.png');
    });
  },
  // F2 · EN-9 — an Accordion row opening, measured frame by frame
  async F2(c) {
    const { page } = c;
    await c.probe('EN-9', async () => {
      const top = await band(page); await into(page, top, 'Text'); await H.panel(page, false); await at(page, top, 'Design', 'Size'); await field(page, 'Height', '10rem');
      const fresh = await tileThen(page, 'Accordion', defaultStyle(page)); await H.panel(page, false); const acc = await selFirst(page, fresh);
      const s = await site(c); const css = { detailsContent: /details-content/.test(s.css), interpolateSize: /interpolate-size/.test(s.css) };
      const p = await visit(c, s.url); const sum = `${cls(acc)} summary`;
      const states = () => p.evaluate((s) => Array.from(document.querySelectorAll(s)).map((x) => x.closest('details').open), sum);
      const before = await states();
      const watch = () => p.evaluate((s) => { window.__h = []; const d = document.querySelector(s).closest('details'); const t0 = performance.now(); const tick = () => { window.__h.push(Math.round(d.getBoundingClientRect().height)); if (performance.now() - t0 < 600) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, sum);
      await watch(); await p.click(sum); await sleep(page, 700); const h1 = await p.evaluate(() => [...new Set(window.__h)]); const after1 = await states(); await p.screenshot({ path: path.join(OUT, 'EN-9-accordion-click1.png') });
      await watch(); await p.click(sum); await sleep(page, 700); const h2 = await p.evaluate(() => [...new Set(window.__h)]); const after2 = await states();
      c.rec('EN-9', 'MEASURED', `export ${JSON.stringify(css)}; rows open before ${JSON.stringify(before)}; first click → ${JSON.stringify(after1)}, the row's heights during 600 ms ${JSON.stringify(h1)}; second click → ${JSON.stringify(after2)}, heights ${JSON.stringify(h2)}`, 'EN-9-accordion-click1.png');
    });
  },
  // F3 · EN-10 / EN-6 — a Toast that hides itself, and a dismiss
  async F3(c) {
    const { page } = c;
    await c.probe('EN-10', async () => {
      const fresh = await tileThen(page, 'Alert', defaultStyle(page)); await H.panel(page, false); const al = await selFirst(page, fresh);
      await at(page, al, 'Content'); const forms = await choose(page, 'Alert form factor', /toast/i);
      await ins(page).getByLabel('Show a dismiss (×) button').check(); await slider(page, 'Hide itself after', 4); const n = await nodeOf(page, al);
      const s = await site(c); const init = { fn: (sel) => { window.__o = []; const t0 = performance.now(); const tick = () => { const e = document.querySelector(sel); const a = e && (e.querySelector('.eu-alert') || e); if (a) window.__o.push([Math.round(performance.now() - t0), +(+getComputedStyle(a).opacity).toFixed(2), getComputedStyle(a).display, a.isConnected ? 1 : 0, getComputedStyle(a).transform]); if (performance.now() - t0 < 6000) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, arg: cls(al) };
      const p = await visit(c, s.url, { init }); await sleep(page, 500);
      const a = await p.evaluate((s) => { const e = document.querySelector(s); const al = e.querySelector('.eu-alert') || e; const c = getComputedStyle(al); const r = al.getBoundingClientRect(); return { pos: c.position, right: Math.round(innerWidth - r.right), bottom: Math.round(innerHeight - r.bottom), anims: al.getAnimations({ subtree: true }).map((x) => x.animationName || x.transitionProperty), buttons: Array.from(e.querySelectorAll('button')).map((x) => x.getAttribute('aria-label') || x.innerText.trim()) }; }, cls(al));
      await p.screenshot({ path: path.join(OUT, 'EN-10-toast.png') }); await sleep(page, 5600);
      const o = await p.evaluate(() => { const o = window.__o; const ch = []; for (let i = 1; i < o.length; i++) if (o[i][1] !== o[i - 1][1] || o[i][2] !== o[i - 1][2] || o[i][3] !== o[i - 1][3]) ch.push(o[i].slice(0, 4).join('/')); return { first: o[0] && o[0].slice(0, 4).join('/'), changes: ch.slice(0, 30), last: o[o.length - 1] && o[o.length - 1].slice(0, 4).join('/') }; });
      // dismiss, in a fresh visit
      const q = await visit(c, s.url); await sleep(page, 600);
      await q.evaluate((s) => { window.__d = []; const e = document.querySelector(s); const al = e.querySelector('.eu-alert') || e; const t0 = performance.now(); const tick = () => { window.__d.push([Math.round(performance.now() - t0), +(+getComputedStyle(al).opacity).toFixed(2), al.isConnected ? 1 : 0, getComputedStyle(al).display]); if (performance.now() - t0 < 800) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, cls(al));
      const db = q.locator(`${cls(al)} button`).filter({ hasText: /×|dismiss|close/i }).or(q.locator(`${cls(al)} button[aria-label*="ismiss" i], ${cls(al)} button[aria-label*="lose" i]`)).first();
      let dismissed = 'no dismiss button'; if (await db.count()) { await db.click(); await sleep(page, 900); dismissed = await q.evaluate(() => [...new Set(window.__d.map((x) => x.slice(1).join('/')))].slice(0, 12)); }
      c.rec('EN-10', 'MEASURED', `form factor options ${JSON.stringify(forms)} → stored ${JSON.stringify({ alertForm: n.alertForm, alertDismiss: n.alertDismiss, alertAutoSeconds: n.alertAutoSeconds })}; published: ${JSON.stringify(a)}; opacity/display/connected over 6 s (ms/op/display/in page) first ${o.first}, changes ${JSON.stringify(o.changes)}, last ${o.last}`, 'EN-10-toast.png');
      c.rec('EN-6', 'MEASURED', `dismiss button clicked: distinct (opacity/in page/display) states over 800 ms ${JSON.stringify(dismissed)}`, '');
    });
  },
  // F4 · PN-6 — a sticky column beside a long one
  async F4(c) {
    const { page } = c;
    await c.probe('PN-6', async () => {
      const b = await band(page); const A = await into(page, b, 'Text'); const B = await X.beside(page, A, 'Text'); await H.panel(page, false);
      const tail = await band(page); await into(page, tail, 'Text'); await H.panel(page, false); await at(page, tail, 'Design', 'Size'); await field(page, 'Height', '60rem');
      await at(page, A, 'Design', 'Size'); await field(page, 'Height', '120rem');
      await at(page, B, 'Design', 'Placement'); await gal(page, 'Sticks when reached option'); const pr = await pressedOf(page, 'Sticks when reached option');
      await pvOpen(page); const f = await pvAt(page, 1280); const y0 = await f.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, cls(A)); const res = [];
      for (const d of [0, 400, 900, 1500]) { await f.evaluate((y) => scrollTo(0, y), y0 + d); await sleep(page, 300); res.push(await f.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top), cls(B))); if (d === 900) await c.shot('PN-6-sticky-column'); }
      await pvClose(page, c.w);
      c.rec('PN-6', res[1] === res[2] ? 'HOLDS' : 'SCROLLS', `a Text 120rem tall beside a Text set "Sticks when reached" (pressed ${pr}): the side Text's top at 0 / 400 / 900 / 1500 px into the row: ${res.join(' / ')}`, 'PN-6-sticky-column.png');
    });
  },
  // F5 · PN-7 — a floating corner button
  async F5(c) {
    const { page } = c;
    await c.probe('PN-7', async () => {
      const tall = await band(page); await into(page, tall, 'Text'); await H.panel(page, false); await at(page, tall, 'Design', 'Size'); await field(page, 'Height', '150rem');
      const b = await band(page); const fb = await into(page, b, 'Button'); await H.panel(page, false);
      // (1) a FLOATED button: "Floats on screen" holds it where it was placed (no corner choice is offered for a floated block)
      await at(page, fb, 'Design', 'Placement'); await btn(page, 'Floating', ins(page)); await sleep(page, 400); await gal(page, 'Floats on screen option');
      const floatedHeld = await ins(page).getByRole('group', { name: 'Held against' }).count(); await c.shot('PN-7-floated-inspector');
      // (2) a button IN THE LAYOUT: "Floats on screen" + Held against the bottom-right corner
      const b2 = await band(page); const cb = await into(page, b2, 'Button'); await H.panel(page, false);
      await at(page, cb, 'Design', 'Placement'); await gal(page, 'Floats on screen option');
      const g = ins(page).getByRole('group', { name: 'Held against' }); const opts = await g.getByRole('button').evaluateAll((es) => es.map((e) => e.getAttribute('title') || e.innerText));
      await g.getByRole('button', { name: '↘' }).first().click({ timeout: 3000 }).catch(async () => { await g.getByRole('button').nth(7).click(); }); await sleep(page, 400);
      await pvOpen(page); const res = {};
      for (const w of [375, 1280]) { const f = await pvAt(page, w, 800); const rr = []; for (const y of [0, 1200]) { await f.evaluate((y) => scrollTo(0, y), y); await sleep(page, 300); rr.push(await f.evaluate(([a, b]) => { const one = (s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return `${getComputedStyle(e).position} l${Math.round(r.left)} t${Math.round(r.top)} right-gap ${Math.round(innerWidth - r.right)} bottom-gap ${Math.round(innerHeight - r.bottom)}`; }; return `scroll ${Math.round(scrollY)}: floated ${one(a)} · corner ${one(b)}`; }, [cls(fb), cls(cb)])); } res[w] = rr; if (w === 375) await c.shot('PN-7-floating-375'); }
      await pvClose(page, c.w); const css = (await site(c)).css;
      c.rec('PN-7', 'MEASURED', `floated button + "Floats on screen": "Held against" offered ${floatedHeld ? 'yes' : 'no'}; in-layout button + "Floats on screen": Held against offers ${JSON.stringify(opts)}, ↘ chosen; Preview: ${JSON.stringify(res)}; env(safe-area-inset) in the export: ${/safe-area-inset/.test(css)}`, 'PN-7-floated-inspector.png, PN-7-floating-375.png');
    });
  },
  // F6 · the Grid's Inspector (the vocabulary pass could not place one) + the page's own settings
  async F6(c) {
    const { page } = c;
    await c.probe('vocab Grid', async () => {
      const fresh = await tileThen(page, 'Grid', async () => { await page.getByText('Two equal', { exact: true }).first().click(); }); await H.panel(page, false);
      const id = await selFirst(page, fresh); const v = await vocab(page, id);
      const settings = page.getByRole('group', { name: 'Pages' }).locator('button').last(); let pageSettings = '';
      if (await settings.count()) { await settings.click().catch(() => {}); await sleep(page, 700); pageSettings = (await page.locator('[role=dialog],[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 1500); await c.shot('F6-page-settings'); await closePop(page); }
      const all = JSON.stringify(v) + pageSettings;
      c.rec('VOCAB Grid + page settings', 'MEASURED', `Grid (Two equal) Inspector: ${JSON.stringify(v.Design).length} chars; motion/transition words: ${JSON.stringify((all.match(/transition|duration|delay|easing|parallax|marquee|cursor|progress|scroll-?spy|page change/gi) || []))}; page settings panel: ${JSON.stringify(pageSettings)}`, 'F6-page-settings.png');
    });
  },
});
// F7 · where the pager's arrows and dots are drawn on the published page (W5's screenshot showed neither)
SLICES.F7 = async function F7(c) {
  const { page } = c;
  await c.probe('SC-8 nav', async () => {
    const pg = await band(page); const t1 = await into(page, pg, 'Text'); const t2 = await under(page, t1, 'Text'); await under(page, t2, 'Text'); await H.panel(page, false);
    await at(page, pg, 'Design', 'Arrange'); await ins(page).getByLabel('Show one at a time').check(); await sleep(page, 500);
    await ins(page).getByRole('group', { name: 'Moving between them' }).getByRole('button', { name: 'Both' }).click(); await sleep(page, 300); await c.shot('SC-8-canvas');
    const s = await site(c); const out = {};
    for (const w of [375, 1280]) {
      const p = await visit(c, s.url, { w, h: 800 }); await sleep(page, 500);
      out[w] = await p.evaluate(() => { const q = (sel) => Array.from(document.querySelectorAll(sel)).map((e) => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return `${(e.getAttribute('aria-label') || e.tagName).slice(0, 20)} @${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}×${Math.round(r.height)} ${c.display}/${c.visibility}/op${c.opacity}${e.hidden ? '/hidden' : ''}`; }); const st = document.querySelector('[data-eu-pager]').getBoundingClientRect(); return { strip: `@${Math.round(st.left)},${Math.round(st.top)} ${Math.round(st.width)}×${Math.round(st.height)}`, nav: q('[data-eu-pager-nav]'), arrows: q('[data-eu-pager-prev],[data-eu-pager-next]'), dots: q('[data-eu-pager-dot]') }; });
      await p.screenshot({ path: path.join(OUT, `SC-8-nav-${w}.png`) });
      const nx = p.locator('[data-eu-pager-next]').first(); out[w + ' real click on next'] = await nx.click({ timeout: 3000 }).then(async () => { await sleep(page, 900); return `scrollLeft ${await p.evaluate(() => Math.round(document.querySelector('[data-eu-pager]').scrollLeft))}`; }).catch((e) => 'FAILED: ' + e.message.split('\n')[0].slice(0, 120));
    }
    c.rec('SC-8 nav', 'MEASURED', JSON.stringify(out), 'SC-8-canvas.png, SC-8-nav-375.png, SC-8-nav-1280.png');
  });
};
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const WINDOWS = process.argv.includes('--follow') ? ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'] : ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
async function one(slice, slot) {
  const w = 1366; const results = []; const store = {};
  const { browser, page, errs } = await H.open({ headed: true, w, h: 820, pos: [(slot % 3) * 620, Math.floor(slot / 3) * 480] });
  page.setDefaultTimeout(12000);
  const consoleErrs = []; page.on('console', (m) => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 160)); });
  const c = {
    page, w, store, browser, servers: [], ctxs: [],
    shot: (n) => page.screenshot({ path: path.join(OUT, `${n}.png`) }).catch(() => {}),
    rec: (id, verdict, ev, shots) => { results.push({ id, verdict, ev, shots }); console.log(`[${slice}] ${id} ${verdict} · ${String(ev).slice(0, 300)}`); },
    async probe(id, fn) {
      page.__step = id; const e0 = errs.length;
      try { await fn(); } catch (e) {
        await page.screenshot({ path: path.join(OUT, `${slice}-${id.replace(/[^\w-]+/g, '_')}-ERROR.png`) }).catch(() => {});
        results.push({ id, verdict: 'ERROR', ev: `${page.__step}: ${e.message.split('\n')[0].slice(0, 300)}`, shots: '' }); console.log(`[${slice}] ${id} ERROR ${e.message.split('\n')[0]}`);
        await page.emulateMedia({ reducedMotion: null }).catch(() => {}); await page.setViewportSize({ width: w, height: 820 }).catch(() => {});
        const x = page.getByRole('button', { name: /Exit preview/ }).first(); if (await x.isVisible().catch(() => false)) await x.click().catch(() => {});
        for (let i = 0; i < 3; i++) await closePop(page);
        await chip(page, 'Full width').catch(() => {});
      }
      for (const x of c.ctxs.splice(0)) await x.close().catch(() => {});
      for (const s of c.servers.splice(0)) s.close();
      if (errs.length > e0) results.push({ id: id + ' page error', verdict: 'BUG?', ev: errs.slice(e0).join(' | '), shots: '' });
    },
  };
  try { await SLICES[slice](c); } finally {
    await page.screenshot({ path: path.join(OUT, `${slice}-end.png`) }).catch(() => {});
    fs.writeFileSync(path.join(OUT, `results-${slice}.json`), JSON.stringify({ results, store: { fx: store.fx }, pageErrors: errs, consoleErrors: [...new Set(consoleErrs)].slice(0, 30) }, null, 1));
    console.log(`[${slice}] done · ${results.length} rows · ${errs.length} page errors · ${consoleErrs.length} console errors`);
    await browser.close();
  }
}
(async () => { console.log('HEADED UAT — BATCH RX-4 step 3b (effects & motion), six windows'); await Promise.all(WINDOWS.map((s, i) => (!ONLY || ONLY.split(',').includes(s)) && one(s, i))); })();
