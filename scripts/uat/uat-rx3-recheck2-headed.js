// HEADED UAT — RX-3 re-check 2: RX3-23 (Portrait → 16:9 restores full width) · RX3-24 (the video still carries width / height)
// · RX3-25 (the rem caption at 11px in four editor themes, 375 / 1280) · RX3-21 (Page check at Laptop with a reordered page row).
// Three headed windows in parallel, every state built through the UI; screenshots under scripts/uat/rx3fix/re2-*.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-rx3-recheck2-headed.js
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js'); const W = require('./page-weight.js');
const { WIDTHS } = require('./screens.js'); // every width of the Preview (RULE Z)
const X = require('./uat-rx3-headed.js'); const { cls, sleep, nodeOf, band, into, tileThen, sel, expandInspector, at, ins, btn, field, chip, pvOpen, pvAt, pvClose, selectedId } = X;
const OUT = path.join(__dirname, 'rx3fix');
const YT = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';
async function appTheme(page, name) { await page.getByRole('button', { name: 'Change theme' }).first().click(); await sleep(page, 300); await page.getByRole('menuitemradio', { name: new RegExp('^\\s*' + name) }).first().click(); await sleep(page, 500); }
const contrast = (page, a, b) => page.evaluate(([a, b]) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const g = cv.getContext('2d'); const rgb = (c) => { g.clearRect(0, 0, 1, 1); g.fillStyle = c; g.fillRect(0, 0, 1, 1); return Array.from(g.getImageData(0, 0, 1, 1).data).slice(0, 3); }; const L = (c) => { const [r, gg, bb] = rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * gg + 0.0722 * bb; }; const x = L(a), y = L(b); return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2); }, [a, b]);

const JOBS = {
  async V(page, rec) {
    const fresh = await tileThen(page, 'Video', async () => { const m = page.getByRole('menuitem', { name: /^Default$/ }).first(); if (await m.isVisible().catch(() => false)) await m.click(); });
    let vid = null; for (const id of fresh) { const n = await nodeOf(page, id); if (n && n.type === 'video') vid = id; }
    await H.panel(page, false); await at(page, vid, 'Content'); await field(page, 'Video URL', YT);
    await at(page, vid, 'Design'); await btn(page, 'Portrait style', ins(page)); await btn(page, '16:9 style', ins(page)); const n1 = await nodeOf(page, vid);
    const canvasM = async () => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const s = Number(e.closest('[data-canvas-scale]')?.dataset.canvasScale || 1); const v = e.querySelector('iframe,video,a,div') || e; const r = v.getBoundingClientRect(), p = e.parentElement.getBoundingClientRect(); return { w: +(r.width / s).toFixed(1), h: +(r.height / s).toFixed(1), parentW: +(p.width / s).toFixed(1) }; }, vid);
    const pvM = (f) => f.evaluate((s) => { const e = document.querySelector(s); const v = e.querySelector('a[data-eu-video],iframe') || e; const r = v.getBoundingClientRect(), p = e.parentElement.getBoundingClientRect(); return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), parentW: +p.width.toFixed(1) }; }, cls(vid));
    const run = async (tag) => { const cv = {}; for (const [w, ch] of [[375, 'Mobile (375px)'], [1280, 'Desktop (1280px)']]) { await chip(page, ch); cv[w] = await canvasM(); } await chip(page, 'Full width'); await page.screenshot({ path: path.join(OUT, `re2-${tag}-canvas.png`) }); await pvOpen(page); const pv = {}; for (const w of WIDTHS) { const f = await pvAt(page, w); pv[w] = await pvM(f); if (w === 375 || w === 1280) await page.screenshot({ path: path.join(OUT, `re2-${tag}-preview-${w}.png`) }); } await pvClose(page, 1366); return { cv, pv }; };
    const a = await run('16x9');
    const full = (m) => Math.abs(m.w - m.parentW) <= 2; const r = (m) => m.w / m.h;
    const okA = WIDTHS.every((w) => full(a.pv[w]) && Math.abs(r(a.pv[w]) - 16 / 9) < 0.02) && [375, 1280].every((w) => full(a.cv[w]) && Math.abs(a.cv[w].w - a.pv[w].w) <= 2 && Math.abs(a.cv[w].h - a.pv[w].h) <= 2);
    rec('RX3-23a', okA ? 'PASS' : 'FAIL', `Video → Portrait → 16:9: stored ${JSON.stringify({ width: n1.width, ratio: n1.ratio, height: n1.height })}; canvas ${JSON.stringify(a.cv)}; Preview ${JSON.stringify(a.pv)}`, 're2-16x9-canvas.png, re2-16x9-preview-375.png, re2-16x9-preview-1280.png');
    await at(page, vid, 'Design', 'Size'); await field(page, 'Height', '20rem'); const n2 = await nodeOf(page, vid);
    const b = await run('16x9-h20');
    const okB = WIDTHS.every((w) => full(b.pv[w]) && Math.abs(b.pv[w].h - 320) <= 2);
    rec('RX3-23b', okB ? 'PASS' : 'FAIL', `then Height "20rem": stored ${JSON.stringify({ width: n2.width, ratio: n2.ratio, height: n2.height })}; canvas ${JSON.stringify(b.cv)}; Preview ${JSON.stringify(b.pv)}`, 're2-16x9-h20-canvas.png, re2-16x9-h20-preview-*.png');
    const files = await W.exportFiles(page); const imgs = Object.entries(files).filter(([n]) => n.endsWith('.html')).flatMap(([, v]) => (v.toString().match(/<img[^>]*ytimg[^>]*>/g) || []));
    const wgt = await W.weigh(page);
    const okC = imgs.length && imgs.every((t) => /width="480"/.test(t) && /height="360"/.test(t)) && !wgt.findings.some((x) => /^W3/.test(x) && /ytimg/.test(x));
    rec('RX3-24', okC ? 'PASS' : 'FAIL', `exported still: ${imgs.map((t) => t.slice(0, 200)).join(' ‖ ')}; page-weight ${JSON.stringify(wgt.numbers)} findings ${JSON.stringify(wgt.findings)}`, '');
  },
  async C(page, rec) {
    const b = await band(page); const t = await into(page, b, 'Text'); await H.panel(page, false);
    const res = {}; let ok = true;
    for (const w of [1280, 375]) for (const th of ['Light', 'Dark', 'Midnight', 'Purple']) {
      await page.setViewportSize({ width: 1366, height: 820 }); await sleep(page, 400); await appTheme(page, th);
      await page.setViewportSize({ width: w, height: 820 }); await sleep(page, 600);
      if (await selectedId(page) !== t) await sel(page, t); await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Spacing');
      const cap = page.getByText('Each side in rem · 1rem is 16px at the default text size').first(); await cap.scrollIntoViewIfNeeded().catch(() => {});
      if (!(await cap.isVisible().catch(() => false))) { res[`${w} ${th}`] = 'NOT VISIBLE'; ok = false; continue; }
      const m = await cap.evaluate((e) => { let x = e, bg = 'white'; while (x) { const c = getComputedStyle(x).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)') { bg = c; break; } x = x.parentElement; } return { color: getComputedStyle(e).color, bg, size: getComputedStyle(e).fontSize }; });
      const cr = await contrast(page, m.color, m.bg); res[`${w} ${th}`] = `${m.size}, contrast ${cr}`; if (m.size !== '11px' || cr < 4.5) ok = false;
      await cap.screenshot({ path: path.join(OUT, `re2-caption-${w}-${th}.png`) }).catch(() => {});
      if (th === 'Dark') await page.screenshot({ path: path.join(OUT, `re2-inspector-${w}-Dark.png`) });
    }
    await page.setViewportSize({ width: 1366, height: 820 }); await appTheme(page, 'Light');
    rec('RX3-25', ok ? 'PASS' : 'FAIL', JSON.stringify(res), 're2-caption-<width>-<theme>.png, re2-inspector-<width>-Dark.png');
  },
  async O(page, rec, errs, cons) {
    const r0 = await band(page); const r1 = await P.beside(page, r0, 'Stack'); const r2 = await P.beside(page, r1, 'Stack');
    const ts = []; for (const k of [r0, r1, r2]) ts.push(await into(page, k, 'Text')); await H.panel(page, false);
    await I.text(page, ts[0], 'First column'); await I.text(page, ts[1], 'Second column'); await I.text(page, ts[2], 'Pneumonoultramicroscopicsilicovolcanoconiosisxxxxxxxxxxxxxxxxxxxx');
    await sel(page, r2); await chip(page, 'Laptop (1024px)'); if (await selectedId(page) !== r2) await sel(page, r2); await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Position'); await field(page, 'Order', -1);
    const st = (await nodeOf(page, r2)).responsive;
    const drawn = await page.evaluate((ids) => ids.map((i) => { const r = document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect(); return `l${Math.round(r.left)} t${Math.round(r.top)}`; }), [r0, r1, r2]);
    const pcBtn = page.getByRole('button', { name: /^Page check/ }).first(); const lab = await pcBtn.getAttribute('aria-label');
    await pcBtn.click(); await sleep(page, 800); const pc = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 700);
    await page.screenshot({ path: path.join(OUT, 're2-pagecheck-laptop.png') }); await page.keyboard.press('Escape'); await chip(page, 'Full width');
    await pvOpen(page); const f = await pvAt(page, 1024); const pv = await f.evaluate((ids) => ids.map((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return `${Math.round(r.left)}..${Math.round(r.right)} top ${Math.round(r.top + scrollY)} order ${getComputedStyle(e).order} "${e.textContent.trim().slice(0, 24)}" scrollW ${e.scrollWidth}/${Math.round(r.width)}`; }), [r0, r1, r2].map(cls)); const side = await f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); await page.screenshot({ path: path.join(OUT, 're2-preview-1024.png') }); await pvClose(page, 1366);
    rec('RX3-21', 'REPORT', `Laptop chip, Order −1 on the third (stored ${JSON.stringify(st)}), its word unbreakable; canvas at Laptop (columns 1/2/3) ${drawn.join(' · ')}; Page check button "${lab}" says: "${pc}"; Preview 1024 columns ${pv.join(' / ')}, sideways scroll ${side}px; page errors ${JSON.stringify(errs)}; console errors ${JSON.stringify(cons)}`, 're2-pagecheck-laptop.png, re2-preview-1024.png');
  },
};

(async () => {
  console.log('HEADED UAT — RX-3 re-check 2'); const all = [];
  const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
  await Promise.all(Object.keys(JOBS).filter((k) => !ONLY || ONLY.split(',').includes(k)).map(async (k, slot) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 820, pos: [slot * 600, 60] }); page.setDefaultTimeout(12000);
    const cons = []; page.on('console', (m) => { if (m.type() === 'error') cons.push(m.text().slice(0, 160)); });
    const rec = (id, v, ev, shots) => { all.push({ id, v, ev, shots }); console.log(`[${k}] ${id} ${v} · ${ev}`); };
    try { await JOBS[k](page, rec, errs, cons); } catch (e) { rec(k, 'ERROR', `${e.message.split('\n')[0]}`, `re2-${k}-ERROR.png`); await page.screenshot({ path: path.join(OUT, `re2-${k}-ERROR.png`) }).catch(() => {}); }
    finally { if (errs.length || cons.length) console.log(`[${k}] page errors ${JSON.stringify(errs)} console ${JSON.stringify([...new Set(cons)])}`); await browser.close(); }
  }));
  fs.writeFileSync(path.join(OUT, ONLY ? `results-recheck2-${ONLY}.json` : 'results-recheck2.json'), JSON.stringify(all, null, 1));
})();
