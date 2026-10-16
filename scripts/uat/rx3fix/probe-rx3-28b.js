// RX3-28 re-check (headed, through the UI, four windows in parallel):
//   A  Centred-column band, its one section with Inner spacing left 3 / right 0.5 and a background colour
//   B  the same with NO side spacing
//   C  Edge to edge with left 3 / right 0.5
//   D  the spacing caption in four editor themes at editor widths 375 and 1280
// Expected: A = B + C at every width of screens.js (centring + the person's own space), the colour edge to edge; canvas ==
// Preview at the five rungs.
const path = require('path'); const fs = require('fs'); const H = require('../h.js'); const I = require('../inspector.js');
const X = require('../uat-rx3-headed.js'); const { cls, sleep, nodeOf, band, into, at, ins, field, chip, pvOpen, pvAt, pvClose, selectedId, sel, expandInspector } = X;
const { WIDTHS } = require('../screens.js');
const OUT = __dirname;
const RUNGS = [[375, 'Mobile (375px)'], [768, 'Tablet (768px)'], [1024, 'Laptop (1024px)'], [1280, 'Desktop (1280px)'], [1920, 'Wide (1920px)']];
const CAPTION = 'Each side in rem, sized for a laptop — it grows a little on wide screens and closes up on a phone';
async function appTheme(page, name) { await page.getByRole('button', { name: 'Change theme' }).first().click(); await sleep(page, 300); await page.getByRole('menuitemradio', { name: new RegExp('^\\s*' + name) }).first().click(); await sleep(page, 500); }
const contrast = (page, a, b) => page.evaluate(([a, b]) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const g = cv.getContext('2d'); const rgb = (c) => { g.clearRect(0, 0, 1, 1); g.fillStyle = c; g.fillRect(0, 0, 1, 1); return Array.from(g.getImageData(0, 0, 1, 1).data).slice(0, 3); }; const L = (c) => { const [r, gg, bb] = rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * gg + 0.0722 * bb; }; const x = L(a), y = L(b); return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2); }, [a, b]);

async function section(page, tag, { centred, spacing }) {
  const b = await band(page); const t = await into(page, b, 'Text'); await H.panel(page, false);
  await I.text(page, t, 'Where do these words start?');
  await at(page, b, 'Design', 'Background'); const hex = ins(page).getByLabel('Background colour hex value').first(); await hex.fill('#dde4ff'); await hex.press('Enter'); await sleep(page, 300);
  if (spacing) { await at(page, b, 'Design', 'Spacing'); await field(page, 'Inner spacing left', 3); await field(page, 'Inner spacing right', 0.5); }
  await I.contentWidth(page, b, centred ? 'Centred column' : 'Edge to edge');
  const n = await nodeOf(page, b);
  const canvas = {};
  for (const [w, ch] of RUNGS) { await chip(page, ch); canvas[w] = await page.evaluate(([b, t]) => { const sc = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale || 1); const B = document.querySelector(`[data-box-id="${b}"]`), T = document.querySelector(`[data-box-id="${t}"]`); const c = getComputedStyle(B); return { padL: +parseFloat(c.paddingLeft).toFixed(2), padR: +parseFloat(c.paddingRight).toFixed(2), textAt: +((T.getBoundingClientRect().left - B.getBoundingClientRect().left) / sc).toFixed(1) }; }, [b, t]); if (w === 1280) await page.screenshot({ path: path.join(OUT, `re4-${tag}-canvas-1280.png`) }); }
  await chip(page, 'Full width');
  await pvOpen(page); const pv = {};
  for (const w of WIDTHS) { const f = await pvAt(page, w); pv[w] = await f.evaluate(([b, t]) => { const B = document.querySelector(b), T = document.querySelector(t); const c = getComputedStyle(B); const r = B.getBoundingClientRect(); return { padL: +parseFloat(c.paddingLeft).toFixed(2), padR: +parseFloat(c.paddingRight).toFixed(2), textAt: +(T.getBoundingClientRect().left - r.left).toFixed(1), colourL: Math.round(r.left), colourR: Math.round(document.documentElement.clientWidth - r.right), bg: c.backgroundColor }; }, [cls(b), cls(t)]); if (w === 1280 || w === 1920 || w === 375) { await f.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), cls(b)); await page.screenshot({ path: path.join(OUT, `re4-${tag}-preview-${w}.png`) }); } }
  await pvClose(page, 1366);
  return { stored: { paddingLeft: n.paddingLeft, paddingRight: n.paddingRight, contained: n.contained ?? n.contentWidth }, canvas, pv };
}

const JOBS = {
  A: (page) => section(page, 'A-centred-3-0.5', { centred: true, spacing: true }),
  B: (page) => section(page, 'B-centred-none', { centred: true, spacing: false }),
  C: (page) => section(page, 'C-edge-3-0.5', { centred: false, spacing: true }),
  async D(page) {
    const b = await band(page); const t = await into(page, b, 'Text'); await H.panel(page, false); const res = {};
    for (const w of [1280, 375]) for (const th of ['Light', 'Dark', 'Midnight', 'Purple']) {
      await page.setViewportSize({ width: 1366, height: 820 }); await sleep(page, 400); await appTheme(page, th);
      await page.setViewportSize({ width: w, height: 820 }); await sleep(page, 600);
      if (await selectedId(page) !== t) await sel(page, t); await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Spacing');
      const cap = page.getByText(CAPTION).first(); await cap.scrollIntoViewIfNeeded().catch(() => {});
      if (!(await cap.isVisible().catch(() => false))) { res[`${w} ${th}`] = 'NOT VISIBLE'; continue; }
      const m = await cap.evaluate((e) => { let x = e, bg = 'white'; while (x) { const c = getComputedStyle(x).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)') { bg = c; break; } x = x.parentElement; } return { color: getComputedStyle(e).color, bg, size: getComputedStyle(e).fontSize, describes: e.id ? document.querySelectorAll(`[aria-describedby~="${e.id}"]`).length : 0 }; });
      res[`${w} ${th}`] = { size: m.size, contrast: await contrast(page, m.color, m.bg), describes: m.describes };
      await cap.screenshot({ path: path.join(OUT, `re4-caption-${w}-${th}.png`) }).catch(() => {});
    }
    await page.setViewportSize({ width: 1366, height: 820 }); await appTheme(page, 'Light'); return res;
  },
};

(async () => {
  console.log('HEADED UAT — RX-3 re-check 4'); const R = {}; const errors = {};
  await Promise.all(Object.keys(JOBS).map(async (k, slot) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 820, pos: [(slot % 2) * 700, Math.floor(slot / 2) * 440] }); page.setDefaultTimeout(12000);
    const cons = []; page.on('console', (m) => { if (m.type() === 'error') cons.push(m.text().slice(0, 160)); });
    try { R[k] = await JOBS[k](page); } catch (e) { R[k] = { error: e.message.split('\n')[0] }; await page.screenshot({ path: path.join(OUT, `re4-${k}-ERROR.png`) }).catch(() => {}); }
    finally { errors[k] = { page: errs, console: [...new Set(cons)] }; await browser.close(); }
  }));
  // compare
  const out = { errors };
  if (R.A.pv && R.B.pv && R.C.pv) {
    const bad = []; for (const w of WIDTHS) { const a = R.A.pv[w], b = R.B.pv[w], c = R.C.pv[w]; const eL = b.padL + c.padL, eR = b.padR + c.padR; if (Math.abs(a.padL - eL) > 1 || Math.abs(a.padR - eR) > 1 || Math.abs(a.textAt - a.padL) > 1 || a.colourL !== 0 || a.colourR > 1) bad.push(`${w}: A ${a.padL}/${a.padR} (text ${a.textAt}, colour ${a.colourL}|${a.colourR}) vs B+C ${eL.toFixed(2)}/${eR.toFixed(2)}`); }
    out.A_equals_B_plus_C = bad.length ? bad : `all ${WIDTHS.length} widths`;
    const ce = []; for (const k of ['A', 'B', 'C']) for (const [w] of RUNGS) { const cv = R[k].canvas[w], p = R[k].pv[w]; if (Math.abs(cv.padL - p.padL) > 1 || Math.abs(cv.padR - p.padR) > 1) ce.push(`${k}@${w}: canvas ${cv.padL}/${cv.padR} vs Preview ${p.padL}/${p.padR}`); }
    out.canvas_eq_preview = ce.length ? ce : 'yes at the five rungs for A, B and C';
    out.sample = Object.fromEntries(['A', 'B', 'C'].map((k) => [k, { stored: R[k].stored, 375: R[k].pv[375], 1280: R[k].pv[1280], 1920: R[k].pv[1920], canvas1280: R[k].canvas[1280] }]));
  } else out.jobErrors = { A: R.A.error, B: R.B.error, C: R.C.error };
  out.caption = R.D;
  fs.writeFileSync(path.join(OUT, 'results-recheck4.json'), JSON.stringify({ R, out }, null, 1));
  console.log(JSON.stringify(out, null, 1));
})();
