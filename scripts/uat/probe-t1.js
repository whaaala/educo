// HEADED PROBE (RULE Y — built through the UI) for the dressed-sweep findings of 2026-09-28:
//   header logo/menu overlap + "Apply now" wrap at 768 · nested grid squeezed to letters · canvas line "into padding"
//   · Midnight link contrast · skip link not first focusable · hero canvas≠Preview height.
// Builds ONE dressed page: header · photo hero · the crawled section that holds a 3-col grid with a nested 3-quote
// grid (ancestra our_team §1) · CTA — then MEASURES both engines and prints JSON. One probe → one failing test → fix.
//   NODE_PATH=node_modules node scripts/uat/probe-t1.js
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const { Dresser } = require('./dress.js'); const { canvasAudit } = require('./page-audit.js');
const PLAN = JSON.parse(fs.readFileSync(path.join(__dirname, 'page-plan.json'), 'utf8'));
const argv = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const recipe = { type: 'home', header: 'scrolls', hamburger: false, sidebar: 'none', hero: argv('hero', 'photo'), theme: argv('theme', 'Midnight'), body: [PLAN[3].body[0]], source: 'probe' }; // --hero=photo|split|banner|none --theme=…
const OUT = path.join(__dirname, 'probe-t1-out'); fs.mkdirSync(OUT, { recursive: true });

const gridsAndHeader = () => {
  const box = (e) => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) }; };
  const idOf = (e) => e.getAttribute('data-box-id') || (Array.from(e.classList).find((c) => c.startsWith('bx-')) || '').slice(3);
  const all = Array.from(document.querySelectorAll('[data-box-id], [class*="bx-"]'));
  const grids = all.filter((e) => getComputedStyle(e).display === 'grid').map((e) => ({ id: idOf(e).slice(-4), ...box(e), cols: getComputedStyle(e).gridTemplateColumns, cells: Array.from(e.children).map((k) => ({ id: idOf(k).slice(-4), ...box(k), gc: getComputedStyle(k).gridColumn, minW: getComputedStyle(k).minWidth })) }));
  const header = document.querySelector('header') || all[1];
  const kids = header ? Array.from(header.querySelectorAll('[data-box-id], [class*="bx-"]')).slice(0, 12).map((k) => { const cs = getComputedStyle(k); return { id: idOf(k).slice(-4), tag: k.tagName, ...box(k), flex: cs.flex, minW: cs.minWidth, ws: cs.whiteSpace, ov: cs.overflow, sw: k.scrollWidth, text: (k.textContent || '').trim().slice(0, 16) }; }) : [];
  const f = document.querySelector('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = f ? { tag: f.tagName, href: f.getAttribute('href'), cls: f.className, text: (f.textContent || '').trim().slice(0, 20) } : null;
  const mainId = document.querySelector('main')?.id;
  const link = document.querySelector('nav a'); const lc = link ? getComputedStyle(link) : null;
  const rootCs = getComputedStyle(document.querySelector('.eu-root') || document.body);
  const vars = Object.fromEntries(['--eu-color-brand', '--eu-color-link', '--bx-link', '--eu-color-text', '--eu-color-bg', '--eu-color-surface'].map((v) => [v, rootCs.getPropertyValue(v).trim()]));
  return { grids, header: kids, first, mainId, navLink: lc ? { color: lc.color, bg: getComputedStyle(document.body).backgroundColor } : null, vars, bodyBg: getComputedStyle(document.body).backgroundColor };
};
const canvasOverrun = () => {
  const out = []; const rows = Array.from(document.querySelectorAll('[data-box-id]')).filter((e) => getComputedStyle(e).flexDirection === 'row' && getComputedStyle(e).display.includes('flex'));
  for (const row of rows) { const cs = getComputedStyle(row); const r = row.getBoundingClientRect(); const edge = r.right - parseFloat(cs.paddingRight);
    for (const k of row.children) { if (!k.hasAttribute('data-box-id')) continue; const q = k.getBoundingClientRect(); if (q.right > edge + 2) { const ks = getComputedStyle(k); const inner = k.querySelector('[data-box-id]'); const ics = inner ? getComputedStyle(inner) : null;
      out.push({ row: row.getAttribute('data-box-id').slice(-4), rowW: Math.round(r.width), padR: cs.paddingRight, padL: cs.paddingLeft, cls: row.className.split(' ').filter((c) => c.startsWith('eu-')).join(' '), kid: k.getAttribute('data-box-id').slice(-4), kidW: Math.round(q.width), kidL: Math.round(q.left - r.left), over: Math.round(q.right - edge), kidStyle: { width: ks.width, minW: ks.minWidth, flex: ks.flex, ml: ks.marginLeft, mr: ks.marginRight, box: ks.boxSizing }, inner: inner ? { id: inner.getAttribute('data-box-id').slice(-4), w: Math.round(inner.getBoundingClientRect().width), minW: ics.minWidth, width: ics.width, flex: ics.flex } : null }); } } }
  return out;
};

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos: [0, 0] });
  page.setDefaultTimeout(10000);
  const R = { errs };
  try {
    await H.panel(page, true);
    const d = new Dresser(page, recipe, (s) => console.log(s));
    // the theme, as Dresser.build does it
    await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300);
    await page.getByRole('menuitemradio', { name: /Midnight/ }).first().click(); await page.waitForTimeout(500);
    await H.panel(page, true);
    await d.header(); await d.hero(); await d.body(); await d.cta();
    await H.panel(page, false); await H.fillImages(page);
    fs.writeFileSync(path.join(OUT, 'tree.txt'), await H.tree(page));
    // ── CANVAS ──
    R.canvas = {};
    for (const p of ['Desktop (1280px)', 'Tablet (768px)', 'Wide (1920px)']) {
      await page.getByRole('button', { name: p }).first().click(); await page.waitForTimeout(700);
      R.canvas[p] = { audit: await canvasAudit(page), overrun: await page.evaluate(canvasOverrun), ...(await page.evaluate(gridsAndHeader)) };
      await page.screenshot({ path: path.join(OUT, `canvas-${p.replace(/\W+/g, '')}.png`) });
    }
    // ── PREVIEW ──
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h'); await page.waitForTimeout(400);
    R.preview = {};
    for (const w of [768, 1280]) {
      await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(500);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: w + (w - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
      R.preview[w] = await f.evaluate(gridsAndHeader);
      await page.screenshot({ path: path.join(OUT, `preview-${w}.png`) });
    }
    R.html = await (await page.$('iframe')).getAttribute('srcdoc');
    fs.writeFileSync(path.join(OUT, 'export.html'), R.html); delete R.html;
  } catch (e) { R.crash = e.message; await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1).slice(0, 12000));
  await browser.close();
})();
