// PREVIEW PHASE — each catalogue page, built through the UI, checked in the real Preview (the exported HTML in its
// iframe) at every breakpoint: no sideways overflow, no overlaps, canvas == preview (rule 11), units are % / rem /
// em (rule 16), and a 150% browser text size still lays out (WCAG 1.4.4).
// usage: node previewcheck.js [--headed] [--jobs=3] [--only=C2] [--log=preview.log]
const H = require('./h.js');
const PAGES = require('./catalogue.js');
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const JOBS = +arg('jobs', 3), ONLY = arg('only', ''), LOG = path.join(__dirname, arg('log', 'preview.log'));
const BASE = (process.env.BASE || 'http://localhost:3100') + '/website/box-demo';
const RUNGS = [{ w: 375, preset: 'Mobile (375px)' }, { w: 768, preset: 'Tablet (768px)' }, { w: 1024, preset: 'Laptop (1024px)' }, { w: 1280, preset: 'Desktop (1280px)' }, { w: 1920, preset: 'Wide (1920px)' }];
const out = (s) => fs.appendFileSync(LOG, s + '\n');
const hydrated = (page) => page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });

/** Canvas geometry at a device preset — each block as % of the page width + px height. */
const canvasGeo = (page) => page.evaluate(() => {
  const root = document.querySelector('[data-box-id]'); const rr = root.getBoundingClientRect();
  // A canvas shrunk to fit a real screen (#49) reports SCREEN px; the Preview is laid out at full size. Heights and
  // tops are put back into page px through the canvas's own zoom, or every block would look 17% short at 83%.
  const Z = root.currentCSSZoom || 1;
  return Object.fromEntries(Array.from(document.querySelectorAll('[data-box-id]')).slice(1).map((e) => { const r = e.getBoundingClientRect();
    // EMPTY blocks are the one agreed exception to canvas == published (user, 2026-09-27): a drop target or an upload
    // placeholder exists only in the editor. A block that IS one, or holds one, is not compared on height.
    const empty = !!e.querySelector('[data-ph]') || e.hasAttribute('data-ph') || Array.from(e.querySelectorAll('button')).some((b) => /^\s*Upload\s*$/.test(b.textContent || ''));
    return [e.getAttribute('data-box-id'), { l: ((r.left - rr.left) / rr.width) * 100, w: (r.width / rr.width) * 100, t: (r.top - rr.top) / Z, h: r.height / Z, empty }]; }));
});
/** The same inside the Preview iframe, found by the export's `bx-<id>` class. */
const previewGeo = (frame, ids) => frame.evaluate((ids) => {
  const doc = document.documentElement; const body = document.body; const br = body.getBoundingClientRect();
  const geo = {}; for (const id of ids) { const e = document.querySelector('.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-')); if (!e) continue; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    geo[id] = { l: ((r.left - br.left) / br.width) * 100, w: (r.width / br.width) * 100, t: r.top - br.top + window.scrollY, h: r.height, float: cs.position === 'absolute' || cs.position === 'fixed', el: e }; }
  // overlaps between non-nested, non-floating blocks
  const list = Object.entries(geo).filter(([, g]) => !g.float && g.w > 0.2 && g.h > 2); const overlaps = [];
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) { const [ia, a] = list[i], [ib, b] = list[j]; if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const ra = a.el.getBoundingClientRect(), rb = b.el.getBoundingClientRect(); const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top); if (ox > 2 && oy > 2) overlaps.push(`${ia.slice(-4)}×${ib.slice(-4)}`); }
  Object.values(geo).forEach((g) => delete g.el);
  return { geo, overflowX: doc.scrollWidth - doc.clientWidth, overlaps };
}, ids);

/** Rule 16: widths/gaps in %, everything else rem/em — a pixel is allowed only as a 1px hairline (or 0). */
function pixelFindings(html) {
  const css = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || []).join('\n') + '\n' + (html.match(/style="[^"]*"/g) || []).join('\n');
  const found = {}; const re = /([a-z-]+)\s*:\s*[^;{}"]*?(-?\d*\.?\d+)px/gi; let m;
  while ((m = re.exec(css))) { const v = Math.abs(parseFloat(m[2])); if (v === 0 || v === 1) continue; const k = `${m[1]}:${m[2]}px`; found[k] = (found[k] || 0) + 1; }
  return Object.entries(found).sort((a, b) => b[1] - a[1]);
}

async function checkPage(browser, pname) {
  const lines = []; const ctx = await browser.newContext({ viewport: { width: 1520, height: 720 } }); const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
  try {
    await page.goto(BASE, { waitUntil: 'load' }); await hydrated(page);
    await H.panel(page, true); await PAGES[pname].build(page); await H.panel(page, false); await H.fillImages(page); await H.fillStacks(page);
    let units = null;
    for (const rung of RUNGS) {
      // 1 — the canvas at this device
      await page.setViewportSize({ width: 1520, height: 720 }); // the user's real screen — Desktop and Wide are shrunk to fit (#49)
      await page.getByRole('button', { name: rung.preset }).first().click(); await page.waitForTimeout(700);
      const cg = await canvasGeo(page); const ids = Object.keys(cg);
      // 2 — the real Preview at this width (Responsive = the iframe is the window's width)
      await page.setViewportSize({ width: rung.w, height: 900 });
      await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
      await page.waitForSelector('iframe', { timeout: 15000 }); await page.waitForTimeout(1500);
      let fh = await page.$('iframe'); let frame = await fh.contentFrame();
      // The PAGE must be exactly rung.w wide. A desktop browser's vertical scrollbar takes ~15px out of it (a phone's
      // overlay scrollbar takes none), which made a 224px block read 59.7% on the canvas and 62.2% in Preview — the
      // same block against two page widths. Widen the window by whatever the scrollbar costs, then measure.
      const inner = await frame.evaluate(() => document.documentElement.clientWidth);
      if (inner !== rung.w) {
        await page.setViewportSize({ width: rung.w + (rung.w - inner), height: 900 }); await page.waitForTimeout(700);
        fh = await page.$('iframe'); frame = await fh.contentFrame();
      }
      const pv = await previewGeo(frame, ids);
      const probs = [];
      if (pv.overflowX > 1) probs.push(`sideways overflow ${pv.overflowX}px`);
      if (pv.overlaps.length) probs.push(`overlaps ${pv.overlaps.slice(0, 4).join(' ')}`);
      const missing = ids.filter((id) => !pv.geo[id]).length; if (missing) probs.push(`${missing} blocks missing from the export`);
      // canvas == preview, within the ONE accepted difference (#41): the desktop scrollbar's ≤0.6% of the page across,
      // and 4px of text rounding down. See PREVIEW_SHARE_TOL in h.js — a larger drift is a bug, a smaller one never is.
      const T = H.PREVIEW_SHARE_TOL, TH = H.PREVIEW_HEIGHT_TOL;
      const drift = ids.filter((id) => pv.geo[id] && (Math.abs(pv.geo[id].l - cg[id].l) > T || Math.abs(pv.geo[id].w - cg[id].w) > T || (!cg[id].empty && Math.abs(pv.geo[id].h - cg[id].h) > TH)))
        .map((id) => `${id.slice(-4)} canvas ${cg[id].l.toFixed(1)}%+${cg[id].w.toFixed(1)}% ${Math.round(cg[id].h)}h vs preview ${pv.geo[id].l.toFixed(1)}%+${pv.geo[id].w.toFixed(1)}% ${Math.round(pv.geo[id].h)}h`);
      if (drift.length) probs.push(`canvas≠preview ${drift.length}: ${drift.slice(0, 3).join('; ')}`);
      if (!units) units = pixelFindings(await fh.getAttribute('srcdoc') || '');
      // 3 — WCAG 1.4.4: the reader's text at 150%
      await frame.evaluate(() => { document.documentElement.style.fontSize = '150%'; }); await page.waitForTimeout(500);
      const big = await previewGeo(frame, ids);
      if (big.overflowX > 1) probs.push(`at 150% text: sideways overflow ${big.overflowX}px`);
      if (big.overlaps.length) probs.push(`at 150% text: overlaps ${big.overlaps.slice(0, 4).join(' ')}`);
      const grew = ids.filter((id) => big.geo[id] && pv.geo[id] && big.geo[id].h > pv.geo[id].h + 1).length;
      if (ids.length && grew === 0) probs.push('at 150% text NOTHING grew — sizes are not following the reader\'s text size');
      if (probs.length) await page.screenshot({ path: path.join(__dirname, `pv-${pname}-${rung.w}.png`) });
      lines.push(`  ${String(rung.w).padStart(4)}: ${probs.length ? 'FAIL ' + probs.join(' | ') : 'ok'}`);
      await page.setViewportSize({ width: 1520, height: 720 }); // the user's real screen — Desktop and Wide are shrunk to fit (#49)
      await page.goto(BASE, { waitUntil: 'load' }); await hydrated(page); // back to the editor, same saved page
    }
    lines.push(`  units: ${units.length ? 'FAIL ' + units.length + ' pixel lengths — ' + units.slice(0, 8).map(([k, n]) => `${k}×${n}`).join(', ') : 'ok (only % / rem / em, and 1px hairlines)'}`);
    if (errs.length) lines.push(`  page errors: ${[...new Set(errs)].slice(0, 3).join(' / ')}`);
    return `${lines.some((l) => l.includes('FAIL')) ? 'FAIL' : 'ok  '} ${pname} [${PAGES[pname].tier}]\n${lines.join('\n')}`;
  } catch (e) { return `ERR  ${pname}: ${e.message.split('\n')[0]}\n${lines.join('\n')}`; }
  finally { await ctx.close().catch(() => {}); }
}

(async () => {
  fs.writeFileSync(LOG, '');
  const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const names = Object.keys(PAGES).filter((n) => !ONLY || ONLY.split(',').some((o) => n.startsWith(o)));
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(JOBS, names.length) }, async () => { while (i < names.length) out(await checkPage(browser, names[i++])); }));
  out('DONE'); await browser.close();
})();
