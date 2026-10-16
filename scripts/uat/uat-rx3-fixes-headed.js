// HEADED UAT — BATCH RX-3 fixes (the "HEADED CHECKLIST" U1 … U9 in docs/TASK_TREE.md). Six visible windows, every state built
// THROUGH THE UI (RULE Y — localStorage only read, to report what got stored), the Preview read for computed CSS, the export
// served for the network / weight checks, screenshots under scripts/uat/rx3fix/.
//   W1 U1 parallax under reduced motion + U4 the rem side fields and their caption in four editor themes at 375 / 1280
//   W2 U2 a new Video is 16:9 at every width, canvas == Preview; Portrait; a typed Height wins
//   W3 U3 the video costs nothing until asked for: no embed request, click / Enter → playing focused iframe; weight; play mark ×4 themes
//   W4 U5 menu names + U6 rem borders that grow at 200 % text
//   W5 U7 Position blocks in a full-screen Stack band and in a Side by side, canvas == Preview at every width
//   W6 U8 Order on the Mobile chip (and a page row ordered at Laptop) + U9 a sticky header and #anchor / Tab at 375 and 1280
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-rx3-fixes-headed.js [--only=W1,W3]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const X = require('./uat-rx3-headed.js'); const { WIDTHS } = require('./screens.js');
const { cls, sleep, nodeOf, deselect, band, into, under, tileThen, sel, expandInspector, at, ins, btn, choose, field, chip, pvOpen, frame, pvAt, pvClose, ruleText, selectedId } = X;
const OUT = path.join(__dirname, 'rx3fix'); fs.mkdirSync(OUT, { recursive: true });
const IMG = path.join(__dirname, 'img');
const YT = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';
const THEMES = ['Light', 'Dark', 'Midnight', 'Purple'];
const RUNG_CHIPS = [[375, 'Mobile (375px)'], [768, 'Tablet (768px)'], [1024, 'Laptop (1024px)'], [1280, 'Desktop (1280px)'], [1920, 'Wide (1920px)']];

/** The EDITOR's appearance (the app theme), through its own switch. */
async function appTheme(page, name) { await page.getByRole('button', { name: 'Change theme' }).first().click(); await sleep(page, 300); await page.getByRole('menuitemradio', { name: new RegExp('^\\s*' + name) }).first().click(); await sleep(page, 500); }
/** WCAG contrast of two CSS colours, resolved by the browser (oklch / color-mix included) through a canvas. */
const contrastIn = (ctx, a, b) => ctx.evaluate(([a, b]) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const g = cv.getContext('2d'); const rgb = (c) => { g.clearRect(0, 0, 1, 1); g.fillStyle = '#000'; g.fillStyle = c; g.fillRect(0, 0, 1, 1); return Array.from(g.getImageData(0, 0, 1, 1).data).slice(0, 3); }; const L = (c) => { const [r, gg, bb] = rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * gg + 0.0722 * bb; }; const x = L(a), y = L(b); return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2); }, [a, b]);
/** The opaque background behind an element (first non-transparent ancestor). */
const bgOf = (ctx, sel) => ctx.evaluate((s) => { let e = document.querySelector(s); while (e) { const c = getComputedStyle(e).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; e = e.parentElement; } return 'rgb(255,255,255)'; }, sel);
async function addVideo(page, style = /^Default$/) {
  const fresh = await tileThen(page, 'Video', async () => { const m = page.getByRole('menuitem', { name: style }).first(); if (await m.isVisible().catch(() => false)) await m.click(); });
  let vid = null; for (const id of fresh) { const n = await nodeOf(page, id); if (n && n.type === 'video') vid = id; }
  if (!vid) throw new Error('no video block from the tile');
  await H.panel(page, false); await at(page, vid, 'Content'); await field(page, 'Video URL', YT); return vid;
}

const SLICES = {
  // ── W1 · U1 (RX3-1) + U4 (RX3-7) ──────────────────────────────────────────────────────────────────────────────────
  async W1(c) {
    const { page } = c;
    await c.probe('U1', async () => {
      const b = await band(page); await into(page, b, 'Text'); await H.panel(page, false);
      await at(page, b, 'Design', 'Background');
      const [ch] = await Promise.all([page.waitForEvent('filechooser', { timeout: 8000 }), ins(page).getByRole('button', { name: 'Upload an image' }).first().click()]); await ch.setFiles(path.join(IMG, 'wide.jpg')); await sleep(page, 1500);
      await ins(page).getByLabel('Fixed background (parallax)').check(); await sleep(page, 300); await deselect(page);
      const canvas = async () => page.evaluate((id) => getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)).backgroundAttachment, b);
      const cv = { normal: await canvas() }; await page.emulateMedia({ reducedMotion: 'reduce' }); await sleep(page, 300); cv.reduce = await canvas(); await c.shot('U1-canvas-reduce'); await page.emulateMedia({ reducedMotion: null });
      await pvOpen(page); const pv = {};
      for (const w of [375, 1280]) { const f = await pvAt(page, w); pv[`${w} normal`] = await f.evaluate((s) => getComputedStyle(document.querySelector(s)).backgroundAttachment, cls(b)); }
      await page.emulateMedia({ reducedMotion: 'reduce' }); await sleep(page, 300);
      for (const w of [375, 1280]) { const f = await pvAt(page, w); pv[`${w} reduce`] = await f.evaluate((s) => `${getComputedStyle(document.querySelector(s)).backgroundAttachment} (mq ${matchMedia('(prefers-reduced-motion: reduce)').matches})`, cls(b)); if (w === 1280) await c.shot('U1-preview-1280-reduce'); }
      await pvClose(page, c.w);
      const ok = cv.normal === 'fixed' && cv.reduce === 'scroll' && /fixed/.test(pv['375 normal']) && /fixed/.test(pv['1280 normal']) && /^scroll/.test(pv['375 reduce']) && /^scroll/.test(pv['1280 reduce']);
      c.rec('U1', ok ? 'PASS' : 'FAIL', `canvas ${JSON.stringify(cv)}; Preview ${JSON.stringify(pv)}`, 'U1-canvas-reduce.png, U1-preview-1280-reduce.png');
    });
    await c.probe('U4', async () => {
      const b = await band(page); const t = await into(page, b, 'Text'); await H.panel(page, false);
      await at(page, t, 'Design', 'Spacing'); await field(page, 'Inner spacing top', 40); await field(page, 'Outer spacing top', -1.5);
      const n = await nodeOf(page, t); const stored = { paddingTop: n.paddingTop, marginTop: n.marginTop };
      const shown = { inner: await ins(page).getByLabel('Inner spacing top', { exact: true }).inputValue(), outer: await ins(page).getByLabel('Outer spacing top', { exact: true }).inputValue() };
      const caps = {};
      for (const w of [1280, 375]) {
        await page.setViewportSize({ width: w, height: 820 }); await sleep(page, 600);
        for (const th of THEMES) {
          await appTheme(page, th).catch(async () => { await page.keyboard.press('Escape'); });
          if (await selectedId(page) !== t) { await sel(page, t).catch(() => {}); }
          await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Spacing');
          const cap = page.getByText('Each side in rem · 1rem is 16px at the default text size').first();
          await cap.scrollIntoViewIfNeeded().catch(() => {}); const vis = await cap.isVisible().catch(() => false);
          let ratio = null, size = null, desc = null;
          if (vis) { const color = await cap.evaluate((e) => getComputedStyle(e).color); const id = await cap.getAttribute('id'); const bg = await bgOf(page, `[id="${id}"]`); ratio = await contrastIn(page, color, bg); size = await cap.evaluate((e) => getComputedStyle(e).fontSize); desc = await page.evaluate((id) => document.querySelectorAll(`[aria-describedby="${id}"]`).length, id); await cap.screenshot({ path: path.join(OUT, `U4-caption-${w}-${th}.png`) }).catch(() => {}); }
          caps[`${w} ${th}`] = vis ? `visible, contrast ${ratio}, ${size}, ${desc} fields describedby` : 'NOT VISIBLE';
          if (th === 'Dark' || th === 'Light') await c.shot(`U4-inspector-${w}-${th}`);
        }
      }
      await appTheme(page, 'Light').catch(() => {}); await page.setViewportSize({ width: c.w, height: 820 });
      const allOk = Object.values(caps).every((v) => /visible, contrast (\d+\.?\d*)/.test(v) && +v.match(/contrast ([\d.]+)/)[1] >= 4.5);
      c.rec('U4', stored.paddingTop === 96 && (stored.marginTop === 0 || stored.marginTop === undefined) && allOk ? 'PASS' : 'FAIL', `typed "40" in Inner top → stored ${stored.paddingTop} (field shows "${shown.inner}"); typed "-1.5" in Outer top → stored ${stored.marginTop} (field "${shown.outer}"); caption: ${JSON.stringify(caps)}`, 'U4-caption-<width>-<theme>.png, U4-inspector-*.png');
    });
  },

  // ── W2 · U2 (RX3-2) ──────────────────────────────────────────────────────────────────────────────────────────────
  async W2(c) {
    const { page } = c;
    await c.probe('U2', async () => {
      const vid = await addVideo(page); const n = await nodeOf(page, vid);
      const canvasBox = (id) => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const v = e.querySelector('iframe,video,a,div') || e; const r = v.getBoundingClientRect(); const s = Number(e.closest('[data-canvas-scale]')?.dataset.canvasScale || 1); return { w: +(r.width / s).toFixed(1), h: +(r.height / s).toFixed(1) }; }, id);
      const cv = {}; for (const [w, ch] of RUNG_CHIPS) { await chip(page, ch); cv[w] = await canvasBox(vid); } await chip(page, 'Full width'); await c.shot('U2-canvas');
      const player = (f, id) => f.evaluate((s) => { const e = document.querySelector(s); const v = e.querySelector('a[data-eu-video],iframe,video') || e; const r = v.getBoundingClientRect(); return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), ratio: +(r.width / r.height).toFixed(3) }; }, cls(id));
      await pvOpen(page); const bad = []; const pv = {};
      for (const w of WIDTHS) { const f = await pvAt(page, w); const m = await player(f, vid); pv[w] = m; if (Math.abs(m.ratio - 16 / 9) > 0.02) bad.push(`${w}: ${m.w}×${m.h} = ${m.ratio}`); if (w === 375 || w === 1280) await c.shot(`U2-preview-${w}`); }
      const rule = await ruleText(await frame(page), vid); await pvClose(page, c.w);
      const ce = []; for (const [w] of RUNG_CHIPS) { const a = cv[w], b = pv[w]; if (!b || Math.abs(a.w - b.w) > 2 || Math.abs(a.h - b.h) > 2) ce.push(`${w}: canvas ${a.w}×${a.h} vs Preview ${b?.w}×${b?.h}`); }
      // Portrait, then back to 16:9, then a typed Height
      await at(page, vid, 'Design'); await btn(page, 'Portrait style', ins(page)); const np = await nodeOf(page, vid);
      await pvOpen(page); let f = await pvAt(page, 1280); const port = await player(f, vid); f = await pvAt(page, 375); const port375 = await player(f, vid); await c.shot('U2-preview-portrait-375'); await pvClose(page, c.w);
      await at(page, vid, 'Design'); await btn(page, '16:9 style', ins(page)); await I.section(page, 'Size'); await field(page, 'Height', '20rem'); const nh = await nodeOf(page, vid);
      await pvOpen(page); f = await pvAt(page, 1280); const typed = await player(f, vid); f = await pvAt(page, 375); const typed375 = await player(f, vid); await pvClose(page, c.w);
      const portOk = Math.abs(port.ratio - 0.5625) < 0.02 && Math.abs(port.w - 320) <= 4; const typedOk = Math.abs(typed.h - 320) <= 2 && Math.abs(typed375.h - 320) <= 2;
      c.rec('U2', !bad.length && !ce.length && portOk && typedOk ? 'PASS' : 'FAIL', `new Video (Default) stored ${JSON.stringify({ height: n.height, ratio: n.ratio, width: n.width })}; rule ${JSON.stringify(rule).slice(0, 200)}; 16:9 at ${WIDTHS.length - bad.length}/${WIDTHS.length} widths${bad.length ? ' — off: ' + bad.join(' · ') : ''}; canvas == Preview at the five rungs: ${ce.length ? ce.join(' · ') : 'yes (' + RUNG_CHIPS.map(([w]) => `${w}: ${cv[w].w}×${cv[w].h}`).join(', ') + ')'}; Portrait stored ${JSON.stringify({ ratio: np.ratio, width: np.width })} → 1280: ${port.w}×${port.h} (${port.ratio}), 375: ${port375.w}×${port375.h}; 16:9 + Height "20rem" stored ${JSON.stringify({ height: nh.height, ratio: nh.ratio })} → 1280: ${typed.w}×${typed.h}, 375: ${typed375.w}×${typed375.h}`, 'U2-canvas.png, U2-preview-375.png, U2-preview-1280.png, U2-preview-portrait-375.png');
    });
  },

  // ── W3 · U3 (RX3-9) ──────────────────────────────────────────────────────────────────────────────────────────────
  async W3(c) {
    const { page } = c;
    await c.probe('U3', async () => {
      const b = await band(page); await into(page, b, 'Text'); const vid = await addVideo(page); const after = await band(page); await into(page, after, 'Button'); await H.panel(page, false);
      const reqs = []; page.on('request', (r) => reqs.push(r.url()));
      await pvOpen(page); let f = await pvAt(page, 1280); await sleep(page, 1500);
      const embedBefore = reqs.filter((u) => /youtube\.com\/embed|youtube-nocookie\.com\/embed/.test(u)).length; const ytAny = [...new Set(reqs.filter((u) => /youtube|ytimg|googlevideo/.test(u)).map((u) => u.replace(/\?.*/, '').slice(0, 70)))];
      const link = await f.evaluate((s) => { const a = document.querySelector(`${s} a[data-eu-video]`); return a ? { label: a.getAttribute('aria-label'), href: a.getAttribute('href'), iframes: document.querySelectorAll(`${s} iframe`).length } : null; }, cls(vid));
      await c.shot('U3-preview-before');
      await f.click(`${cls(vid)} a[data-eu-video]`); await sleep(page, 2500);
      const click = await f.evaluate((s) => { const fr = document.querySelector(`${s} iframe`); return fr ? { src: fr.getAttribute('src').slice(0, 90), focused: document.activeElement === fr, allow: fr.getAttribute('allow') } : null; }, cls(vid));
      const embedAfter = reqs.filter((u) => /youtube\.com\/embed|youtube-nocookie\.com\/embed/.test(u)).length; await c.shot('U3-preview-after-click');
      await pvClose(page, c.w);
      // keyboard: a fresh Preview, Tab to the link, Enter
      await pvOpen(page); f = await pvAt(page, 1280); await (await f.frameElement()).focus(); await f.evaluate(() => document.body.focus());
      let reached = false; for (let i = 0; i < 30 && !reached; i++) { await page.keyboard.press('Tab'); await sleep(page, 80); reached = await f.evaluate(() => !!(document.activeElement && document.activeElement.matches('a[data-eu-video]'))); }
      const ring = reached ? await f.evaluate(() => { const c = getComputedStyle(document.activeElement); return `${c.outlineStyle} ${c.outlineWidth}`; }) : null; await c.shot('U3-preview-focused');
      if (reached) { await page.keyboard.press('Enter'); await sleep(page, 2500); }
      const kb = await f.evaluate((s) => { const fr = document.querySelector(`${s} iframe`); return fr ? { focused: document.activeElement === fr, src: fr.getAttribute('src').slice(0, 60) } : null; }, cls(vid));
      await pvClose(page, c.w);
      // the play mark in the four editor themes
      const marks = {};
      for (const th of THEMES) { await appTheme(page, th).catch(() => {}); await pvOpen(page); f = await pvAt(page, 1280); const m = await f.evaluate((s) => { const svg = document.querySelector(`${s} a[data-eu-video] svg`); if (!svg) return null; const r = svg.querySelector('rect'), p = svg.querySelector('path'); return { rect: getComputedStyle(r).fill, path: getComputedStyle(p).fill, op: getComputedStyle(r).opacity, w: Math.round(svg.getBoundingClientRect().width) }; }, cls(vid)); marks[th] = m ? { ...m, contrast: await contrastIn(f, m.path, m.rect) } : null; const el = await f.$(`${cls(vid)} a[data-eu-video]`); if (el) await el.screenshot({ path: path.join(OUT, `U3-playmark-${th}.png`) }); await pvClose(page, c.w); }
      await appTheme(page, 'Light').catch(() => {});
      const W = require('./page-weight.js'); const wgt = await W.weigh(page);
      const ok = embedBefore === 0 && click && click.focused && /embed/.test(click.src) && reached && kb && kb.focused && wgt.numbers.htmlCssJsKb < 100 && wgt.numbers.firstViewKb < 500 && Object.values(marks).every((m) => m && m.contrast >= 3);
      c.rec('U3', ok ? 'PASS' : 'FAIL', `before a click: ${embedBefore} embed requests (YouTube hosts asked: ${JSON.stringify(ytAny)}), link ${JSON.stringify(link)}; click → ${JSON.stringify(click)}, embed requests now ${embedAfter}; Tab reached the link: ${reached} (focus ring ${ring}), Enter → ${JSON.stringify(kb)}; weight at 360 ${JSON.stringify(wgt.numbers)} findings ${JSON.stringify(wgt.findings)}; play mark ${JSON.stringify(marks)}`, 'U3-preview-before.png, U3-preview-after-click.png, U3-preview-focused.png, U3-playmark-<theme>.png');
    });
  },

  // ── W4 · U5 (RX3-10) + U6 (RX3-17/18) ─────────────────────────────────────────────────────────────────────────────
  async W4(c) {
    const { page } = c;
    const pageCheck = async () => { await page.getByRole('button', { name: /^Page check/ }).first().click(); await sleep(page, 700); const t = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' '); await page.keyboard.press('Escape'); await sleep(page, 300); return t; };
    const navNames = async () => { const f = await pvOpen(page); const r = await f.evaluate(() => Array.from(document.querySelectorAll('nav')).map((n) => `${n.closest('header') ? 'header' : n.closest('footer') ? 'footer' : 'body'}:${n.getAttribute('aria-label')}`)); await pvClose(page, c.w); return r; };
    await c.probe('U5', async () => {
      const m1 = await band(page); await into(page, m1, 'Link'); const m2 = await band(page); await into(page, m2, 'Link'); await H.panel(page, false);
      await I.meaning(page, m1, 'Menu'); await I.meaning(page, m2, 'Menu');
      const pc1 = await pageCheck(); const n1 = await navNames(); await c.shot('U5-body-menus');
      const hd = await band(page); const hm = await into(page, hd, 'Stack'); await into(page, hm, 'Link'); await H.panel(page, false);
      await I.meaning(page, hd, 'Page header'); await I.meaning(page, hm, 'Menu');
      await sel(page, hd); await page.getByRole('button', { name: 'Block actions' }).first().click(); await sleep(page, 300); const top = page.getByRole('menuitem', { name: /Move to top/ }).first(); if (await top.isEnabled().catch(() => false)) await top.click(); else await page.keyboard.press('Escape'); await sleep(page, 500);
      const pc2 = await pageCheck(); const n2 = await navNames(); await c.shot('U5-with-header');
      const fx = (t) => (t.match(/Fixed for you.*/) || [''])[0].match(/"[^"]*menu[^"]*"/gi) || [];
      const ok = n1.join() === 'body:Menu 1,body:Menu 2' && /header:Main menu/.test(n2.join()) && n2.includes('body:Menu 2');
      c.rec('U5', ok ? 'PASS' : 'FAIL', `two body Menus → Page check names ${JSON.stringify(fx(pc1))}, exported ${JSON.stringify(n1)}; + a Page header holding a Menu → Page check ${JSON.stringify(fx(pc2))}, exported ${JSON.stringify(n2)}`, 'U5-body-menus.png, U5-with-header.png');
    });
    await c.probe('U6', async () => {
      const b = await band(page); const bt = await into(page, b, 'Button'); const tx = await under(page, bt, 'Text'); await H.panel(page, false);
      await at(page, bt, 'Design'); await btn(page, 'Outline style', ins(page)); await at(page, tx, 'Design'); await btn(page, 'Quote style', ins(page));
      const nb = await nodeOf(page, bt), nt = await nodeOf(page, tx);
      const f = await pvOpen(page).then(() => pvAt(page, 1280));
      const bw = (s) => f.evaluate((s) => { const e = document.querySelector(s); const cand = [e, ...e.querySelectorAll('*')].find((x) => ['Top', 'Right', 'Bottom', 'Left'].some((k) => parseFloat(getComputedStyle(x)['border' + k + 'Width']) > 0)) || e; const c = getComputedStyle(cand); return `${cand.tagName}.${(cand.className || '').toString().split(' ')[0]} ${c.borderTopWidth} ${c.borderRightWidth} ${c.borderBottomWidth} ${c.borderLeftWidth}`; }, s);
      const cssText = await f.evaluate(([a, b]) => { const css = Array.from(document.querySelectorAll('style')).map((x) => x.textContent).join('\n'); const pick = (c) => (css.match(new RegExp(c.replace('.', '\\.') + '[^{]*\\{[^}]*border[^}]*\\}', 'g')) || []).map((r) => (r.match(/border[^;]*;?/g) || []).join(' ')).join(' | ').slice(0, 200); return { button: pick(a), quote: pick(b) }; }, [cls(bt), cls(tx)]);
      const at100 = { button: await bw(cls(bt)), quote: await bw(cls(tx)) };
      await c.shot('U6-preview-100');
      await f.evaluate(() => { document.documentElement.style.fontSize = '200%'; }); await sleep(page, 300);
      const at200 = { button: await bw(cls(bt)), quote: await bw(cls(tx)) }; await c.shot('U6-preview-200');
      await pvClose(page, c.w);
      const num = (s) => Math.max(...s.split(' ').slice(1).map(parseFloat));
      const ok = /rem/.test(cssText.button) && /rem/.test(cssText.quote) && num(at200.button) > num(at100.button) && num(at200.quote) > num(at100.quote);
      c.rec('U6', ok ? 'PASS' : 'FAIL', `Button "Outline" stored borderWidth ${nb.borderWidth}, Text "Quote" stored ${JSON.stringify({ borderWidth: nt.borderWidth, borderLeft: nt.borderLeft })}; export CSS ${JSON.stringify(cssText)}; drawn at 100 % ${JSON.stringify(at100)} → at root 200 % ${JSON.stringify(at200)}`, 'U6-preview-100.png, U6-preview-200.png');
    });
  },

  // ── W5 · U7 (RX3-5 + RX3-19) ─────────────────────────────────────────────────────────────────────────────────────
  async W5(c) {
    const { page } = c;
    await c.probe('U7', async () => {
      const b = await band(page); const a = await into(page, b, 'Text'); const z = await under(page, a, 'Text'); await H.panel(page, false);
      await at(page, b, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page)); await btn(page, 'Top-to-bottom', ins(page));
      const out = {}; const bad = [];
      const gapsCanvas = () => page.evaluate(([b, a, z]) => { const s = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale || 1); const B = document.querySelector(`[data-box-id="${b}"]`).getBoundingClientRect(), A = document.querySelector(`[data-box-id="${a}"]`).getBoundingClientRect(), Z = document.querySelector(`[data-box-id="${z}"]`).getBoundingClientRect(); return { above: Math.round((A.top - B.top) / s), below: Math.round((B.bottom - Z.bottom) / s), between: Math.round((Z.top - A.bottom) / s) }; }, [b, a, z]);
      const gapsPv = (f) => f.evaluate(([b, a, z]) => { const B = document.querySelector(b).getBoundingClientRect(), A = document.querySelector(a).getBoundingClientRect(), Z = document.querySelector(z).getBoundingClientRect(); return { above: Math.round(A.top - B.top), below: Math.round(B.bottom - Z.bottom), between: Math.round(Z.top - A.bottom) }; }, [cls(b), cls(a), cls(z)]);
      const expect = { End: (g) => g.above > 100 && g.below < 40, 'Spread out': (g) => g.above < 40 && g.below < 40 && g.between > 100, 'Even gaps': (g) => g.above > 40 && g.below > 40 && g.between > g.above, Center: (g) => g.above > 100 && Math.abs(g.above - g.below) < 30 };
      for (const opt of ['End', 'Spread out', 'Even gaps', 'Center']) {
        await at(page, b, 'Design', 'Arrange'); await choose(page, 'Position blocks', new RegExp('^' + opt + '$'));
        await chip(page, 'Desktop (1280px)'); const cv = await gapsCanvas(); await c.shot(`U7-canvas-${opt.replace(' ', '')}`); await chip(page, 'Full width');
        await pvOpen(page); const rows = {}; let pv1280 = null;
        for (const w of WIDTHS) { const f = await pvAt(page, w, 820); const g = await gapsPv(f); if (!expect[opt](g)) rows[w] = g; if (w === 1280) { pv1280 = g; await c.shot(`U7-preview-${opt.replace(' ', '')}-1280`); } }
        await pvClose(page, c.w);
        out[opt] = `canvas@1280 ${JSON.stringify(cv)} · Preview@1280 ${JSON.stringify(pv1280)} · widths failing: ${Object.keys(rows).length ? JSON.stringify(rows).slice(0, 200) : 'none of ' + WIDTHS.length}`;
        if (Object.keys(rows).length || !expect[opt](cv) || Math.abs(cv.above - pv1280.above) > 30) bad.push(opt);
      }
      // RX3-19: a Side by side holding a Text and a Button
      const fresh = await tileThen(page, 'Side by side', null); let row = null; for (const id of fresh) { const n = await nodeOf(page, id); if (n && n.direction === 'row' && !n.rowBand) row = id; }
      for (const t of ['Text', 'Button']) { await sel(page, row); await page.getByRole('button', { name: 'Add a block inside this one' }).first().click(); await sleep(page, 300); await page.getByRole('menuitem', { name: t, exact: true }).first().click(); await sleep(page, 700); await page.keyboard.press('Escape'); await sleep(page, 200); }
      const kids = (await nodeOf(page, row)).children.map((x) => x.id); const sbs = {};
      for (const opt of ['End', 'Spread out']) {
        await sel(page, row); await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Arrange'); await choose(page, 'Position blocks', new RegExp('^' + opt + '$'));
        const cv = await page.evaluate(([r, ks]) => { const R = document.querySelector(`[data-box-id="${r}"]`).getBoundingClientRect(); return ks.map((k) => { const K = document.querySelector(`[data-box-id="${k}"]`).getBoundingClientRect(); return `l+${Math.round(K.left - R.left)} r-${Math.round(R.right - K.right)}`; }).join(' / '); }, [row, kids]);
        await pvOpen(page); const f = await pvAt(page, 1280); const pv = await f.evaluate(([r, ks]) => { const R = document.querySelector(r).getBoundingClientRect(); return ks.map((k) => { const K = document.querySelector(k).getBoundingClientRect(); return `l+${Math.round(K.left - R.left)} r-${Math.round(R.right - K.right)}`; }).join(' / '); }, [cls(row), kids.map(cls)]); await c.shot(`U7-sbs-${opt.replace(' ', '')}-1280`); await pvClose(page, c.w);
        sbs[opt] = `canvas ${cv} · Preview ${pv}`;
        const firstLeft = +pv.split(' / ')[0].match(/l\+(-?\d+)/)[1], lastRight = +pv.split(' / ')[1].match(/r-(-?\d+)/)[1];
        if (opt === 'End' && !(firstLeft > 200 && lastRight < 30)) bad.push('SBS End'); if (opt === 'Spread out' && !(firstLeft < 30 && lastRight < 30)) bad.push('SBS Spread out');
      }
      c.rec('U7', bad.length ? 'FAIL' : 'PASS', `Stack band, Full screen, Top-to-bottom: ${JSON.stringify(out)} ‖ RX3-19 Side by side (Text + Button): ${JSON.stringify(sbs)}${bad.length ? ' ‖ failing: ' + bad.join(', ') : ''}`, 'U7-canvas-*.png, U7-preview-*-1280.png, U7-sbs-*-1280.png');
    });
  },

  // ── W6 · U8 (RX3-6 + RX3-20) + U9 (RX3-8) ────────────────────────────────────────────────────────────────────────
  async W6(c) {
    const { page } = c;
    await c.probe('U8', async () => {
      const b = await band(page); const t1 = await into(page, b, 'Text'); const t2 = await under(page, t1, 'Text'); const t3 = await under(page, t2, 'Text'); await H.panel(page, false);
      await sel(page, t3); await chip(page, 'Mobile (375px)'); if (await selectedId(page) !== t3) await sel(page, t3); await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Position'); await field(page, 'Order', -1);
      const st = (await nodeOf(page, t3)).responsive;
      const order = (getTop) => getTop.then((t) => (t[2] < t[0] ? '3rd FIRST' : 'tree order'));
      const cTops = async () => page.evaluate((ids) => ids.map((i) => document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect().top), [t1, t2, t3]);
      const canvas = { 375: await order(cTops()) }; await c.shot('U8-canvas-mobile'); await chip(page, 'Tablet (768px)'); canvas[768] = await order(cTops()); await chip(page, 'Desktop (1280px)'); canvas[1280] = await order(cTops()); await chip(page, 'Full width');
      await pvOpen(page); const pv = {};
      for (const w of [375, 599, 600, 768, 1280]) { const f = await pvAt(page, w); const inner = await f.evaluate(() => document.documentElement.clientWidth); pv[`${w} (page ${inner})`] = await order(f.evaluate((ids) => ids.map((s) => document.querySelector(s).getBoundingClientRect().top), [t1, t2, t3].map(cls))); if (w === 375) await c.shot('U8-preview-375'); }
      await pvClose(page, c.w);
      // RX3-20: a page row of three, the third first at Laptop
      const r0 = await band(page); const r1 = await P.beside(page, r0, 'Stack'); const r2 = await P.beside(page, r1, 'Stack'); for (const k of [r0, r1, r2]) await into(page, k, 'Text');
      const u0 = await band(page); const u1 = await P.beside(page, u0, 'Stack'); const u2 = await P.beside(page, u1, 'Stack'); for (const k of [u0, u1, u2]) await into(page, k, 'Text'); await H.panel(page, false);
      await sel(page, r2); await chip(page, 'Laptop (1024px)'); if (await selectedId(page) !== r2) await sel(page, r2); await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Position'); await field(page, 'Order', -1); await chip(page, 'Full width');
      await pvOpen(page); const f = await pvAt(page, 1024);
      const geo = await f.evaluate((ids) => ids.map((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), ml: c.marginLeft, mr: c.marginRight, pl: c.paddingLeft }; }), [r0, r1, r2, u0, u1, u2].map(cls));
      await c.shot('U8-preview-1024-row'); await pvClose(page, c.w);
      const drawn = [geo[2], geo[0], geo[1]], twin = [geo[3], geo[4], geo[5]];
      const lefts = drawn.map((g) => g.l), twinLefts = twin.map((g) => g.l), widths = drawn.map((g) => g.r - g.l), twinW = twin.map((g) => g.r - g.l);
      const rowOk = drawn[0].l < drawn[1].l && drawn.every((g, i) => Math.abs(g.l - twinLefts[i]) <= 2 && Math.abs(g.r - g.l - twinW[i]) <= 2);
      const ok = canvas[375] === '3rd FIRST' && canvas[768] === 'tree order' && /FIRST/.test(Object.entries(pv).find(([k]) => k.startsWith('375'))[1]) && /FIRST/.test(Object.entries(pv).find(([k]) => k.startsWith('599'))[1]) && /tree/.test(Object.entries(pv).find(([k]) => k.startsWith('600'))[1]) && rowOk;
      c.rec('U8', ok ? 'PASS' : 'FAIL', `Mobile chip → Order −1 on the third: stored responsive ${JSON.stringify(st)}; canvas ${JSON.stringify(canvas)}; Preview ${JSON.stringify(pv)} ‖ RX3-20 page row, third first at Laptop, Preview 1024: drawn order lefts ${lefts.join('/')} widths ${widths.join('/')} vs an untouched twin row ${twinLefts.join('/')} widths ${twinW.join('/')} (margins ${drawn.map((g) => g.ml + '|' + g.mr).join(' ; ')})`, 'U8-canvas-mobile.png, U8-preview-375.png, U8-preview-1024-row.png');
    });
    await c.probe('U9', async () => {
      // fresh page content below what U8 left: a tall sticky header goes to the top
      const hd = await band(page); const hl = await into(page, hd, 'Link'); await H.panel(page, false);
      await I.meaning(page, hd, 'Page header'); await at(page, hd, 'Design', 'Size'); await field(page, 'Height', '20rem'); await I.sticky(page, hd);
      await sel(page, hd); await page.getByRole('button', { name: 'Block actions' }).first().click(); await sleep(page, 300); const top = page.getByRole('menuitem', { name: /Move to top/ }).first(); if (await top.isEnabled().catch(() => false)) await top.click(); else await page.keyboard.press('Escape'); await sleep(page, 500);
      for (let i = 0; i < 2; i++) { const s = await band(page); await into(page, s, 'Text'); await H.panel(page, false); await at(page, s, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page)); }
      const far = await band(page); const ft = await into(page, far, 'Text'); const fb = await under(page, ft, 'Button'); await H.panel(page, false);
      await at(page, far, 'Content', 'Bookmark'); await field(page, 'Bookmark name', 'far');
      await at(page, hl, 'Content'); await field(page, 'Link', '#far'); const nh = await nodeOf(page, hd);
      await c.shot('U9-editor');
      const res = {};
      await pvOpen(page);
      for (const [w, h] of [[1280, 800], [375, 667]]) {
        const f = await pvAt(page, w, h);
        const cssm = await f.evaluate((s) => ({ scrollPaddingTop: getComputedStyle(document.documentElement).scrollPaddingTop, targetScrollMarginTop: getComputedStyle(document.querySelector(s)).scrollMarginTop }), cls(far));
        await f.evaluate(() => scrollTo(0, 0)); await sleep(page, 300);
        await f.evaluate((l) => { const L = document.querySelector(l); (L.tagName === 'A' ? L : L.querySelector('a')).click(); }, cls(hl)); await sleep(page, 1500);
        const jump = await f.evaluate(([h, t]) => { const H = document.querySelector(h).getBoundingClientRect(), T = document.querySelector(t).getBoundingClientRect(); return { headerBottom: Math.round(H.bottom), targetTop: Math.round(T.top), scrollY: Math.round(scrollY) }; }, [cls(hd), cls(far)]);
        await c.shot(`U9-preview-anchor-${w}`);
        await f.evaluate(() => scrollTo(0, 0)); await f.evaluate((l) => { const L = document.querySelector(l); (L.tagName === 'A' ? L : L.querySelector('a')).focus(); }, cls(hl));
        let tab = null; for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); await sleep(page, 70); const hit = await f.evaluate(([b, h]) => { const e = document.activeElement; const B = document.querySelector(b); if (!B || !B.contains(e)) return null; const r = e.getBoundingClientRect(), H = document.querySelector(h).getBoundingClientRect(); return { focusedTop: Math.round(r.top), headerBottom: Math.round(H.bottom) }; }, [cls(fb), cls(hd)]); if (hit) { tab = hit; break; } }
        await c.shot(`U9-preview-tab-${w}`);
        res[w] = { cssm, jump, tab };
      }
      await pvClose(page, c.w);
      const ok = Object.values(res).every((r) => r.jump.targetTop >= r.jump.headerBottom - 1 && r.tab && r.tab.focusedTop >= r.tab.headerBottom - 1);
      c.rec('U9', ok ? 'PASS' : 'FAIL', `sticky Page header, Height 20rem (stored ${JSON.stringify({ height: nh.height, sticky: nh.pin ?? nh.sticky })}), Bookmark "far" three bands down, header Link #far: ${JSON.stringify(res)}`, 'U9-editor.png, U9-preview-anchor-1280.png, U9-preview-anchor-375.png, U9-preview-tab-1280.png, U9-preview-tab-375.png');
    });
  },
};

const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const WINDOWS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
async function one(slice, slot) {
  const w = 1366; const results = [];
  const { browser, page, errs } = await H.open({ headed: true, w, h: 820, pos: [(slot % 3) * 620, Math.floor(slot / 3) * 480] });
  page.setDefaultTimeout(12000);
  const consoleErrs = []; page.on('console', (m) => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 160)); });
  const c = {
    page, w,
    shot: (n) => page.screenshot({ path: path.join(OUT, `${n}.png`) }).catch(() => {}),
    rec: (id, verdict, ev, shots) => { results.push({ id, verdict, ev, shots }); console.log(`[${slice}] ${id} ${verdict} · ${String(ev).slice(0, 400)}`); },
    async probe(id, fn) {
      page.__step = id; const e0 = errs.length;
      try { await fn(); } catch (e) {
        await page.screenshot({ path: path.join(OUT, `${id}-ERROR.png`) }).catch(() => {});
        results.push({ id, verdict: 'ERROR', ev: `${page.__step}: ${e.message.split('\n')[0].slice(0, 300)}`, shots: `${id}-ERROR.png` }); console.log(`[${slice}] ${id} ERROR ${e.message.split('\n')[0]}`);
        await page.emulateMedia({ reducedMotion: null }).catch(() => {}); await page.setViewportSize({ width: w, height: 820 }).catch(() => {});
        const x = page.getByRole('button', { name: /Exit preview/ }).first(); if (await x.isVisible().catch(() => false)) await x.click().catch(() => {});
        for (let i = 0; i < 3; i++) await page.keyboard.press('Escape').catch(() => {});
      }
      if (errs.length > e0) results.push({ id: id + ' page error', verdict: 'BUG?', ev: errs.slice(e0).join(' | '), shots: '' });
    },
  };
  try { await SLICES[slice](c); } finally {
    fs.writeFileSync(path.join(OUT, `results-${slice}.json`), JSON.stringify({ results, pageErrors: errs, consoleErrors: [...new Set(consoleErrs)].slice(0, 30) }, null, 1));
    console.log(`[${slice}] done · ${results.length} rows · ${errs.length} page errors · ${consoleErrs.length} console errors`);
    await browser.close();
  }
}
(async () => { console.log('HEADED UAT — RX-3 fixes U1…U9'); await Promise.all(WINDOWS.map((s, i) => (!ONLY || ONLY.split(',').includes(s)) && one(s, i))); })();
