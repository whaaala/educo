// HEADED UAT — E0-b/E0-c (tier-99 page 145): the burger header, built THROUGH THE UI by the dresser's own code, then every
// block's place measured on the canvas and in the Preview at 1280 — which blocks disagree, and by how much.
//   NODE_PATH=node_modules node scripts/uat/probe-e0b.js [--burger=1] [--sticky=1]
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const { Dresser } = require('./dress.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const OUT = path.join(__dirname, 'probe-e0b-out'); fs.mkdirSync(OUT, { recursive: true });
const W = +arg('w', 1280); const PRESET = { 1280: 'Desktop (1280px)', 1920: 'Wide (1920px)', 1024: 'Laptop (1024px)', 768: 'Tablet (768px)' }[W];
const tag = `b${arg('burger', '1')}s${arg('sticky', '1')}w${W}`;
const where = ([engine]) => {
  const Z = engine === 'canvas' ? (document.querySelector('[data-box-id]').currentCSSZoom || 1) : 1;
  const page = engine === 'canvas' ? document.querySelector('[data-box-id]') : document.querySelector('.eu-root') || document.body;
  const pr = page.getBoundingClientRect(); const out = {};
  const all = engine === 'canvas' ? [...document.querySelectorAll('[data-box-id]')].map((e) => [e.getAttribute('data-box-id'), e]) : [...document.querySelectorAll('[class*="bx-"]')].map((e) => [(e.className.match(/bx-([A-Za-z0-9_-]+)/) || [])[1], e]);
  for (const [id, e] of all) { if (!id) continue; const r = e.getBoundingClientRect(); if (!r.width) continue; const cs = getComputedStyle(e);
    out[id] = { l: +((r.left - pr.left) / Z).toFixed(1), w: +(r.width / Z).toFixed(1), h: +(r.height / Z).toFixed(1), t: +((r.top - pr.top) / Z).toFixed(1), pad: [cs.paddingLeft, cs.paddingRight].join('/'), gap: cs.columnGap, jc: cs.justifyContent, txt: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 14), fl: cs.flex, mw: cs.maxWidth, wd: e.style.width }; }
  return out;
};
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900 });
  page.setDefaultTimeout(12000);
  try {
    await H.panel(page, true);
    const d = new Dresser(page, { hamburger: arg('burger', '1') === '1', header: arg('sticky', '1') === '1' ? 'sticky' : 'scrolls', theme: 'Light' });
    await d.header(); await H.panel(page, false); await page.keyboard.press('Escape');
    fs.writeFileSync(path.join(OUT, `${tag}-tree.txt`), await H.tree(page));
    await page.getByRole('button', { name: PRESET }).first().click(); await page.waitForTimeout(900);
    const c = await page.evaluate(where, ['canvas']); await page.screenshot({ path: path.join(OUT, `${tag}-canvas.png`) });
    // the line of links: its INLINE style as React left it on the canvas
    console.log('  canvas links line: ' + await page.evaluate(() => { const a = [...document.querySelectorAll('[data-box-id]')].find((e) => e.getAttribute('data-box-id') && [...e.children].filter((k) => k.tagName === 'A' || k.querySelector?.(':scope > a')).length >= 2 && getComputedStyle(e).flexDirection === 'row'); return a ? `${a.getAttribute('data-box-id').slice(-4)} style="${a.getAttribute('style')}"` : 'not found'; }));
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h');
    await page.setViewportSize({ width: W, height: 900 }); await page.waitForTimeout(500);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== W) { await page.setViewportSize({ width: W + (W - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
    const v = await f.evaluate(where, ['preview']); await page.screenshot({ path: path.join(OUT, `${tag}-preview.png`) });
    fs.writeFileSync(path.join(OUT, `${tag}-export.html`), await (await page.$('iframe')).getAttribute('srcdoc') || '');
    let n = 0;
    for (const id of Object.keys(c)) { const a = c[id], b = v[id.replace(/[^A-Za-z0-9_-]/g, '-')];
      if (!b) { console.log(`  canvas only: ${id.slice(-4)} "${a.txt}"`); continue; }
      if (Math.abs(a.l - b.l) > 3 || Math.abs(a.w - b.w) > 3 || Math.abs(a.h - b.h) > 3) { n++; console.log(`  DIFFER ${id.slice(-4)} "${a.txt}": canvas l=${a.l} w=${a.w} h=${a.h} pad=${a.pad} gap=${a.gap} flex=${a.fl} maxW=${a.mw} style.w=${a.wd} | preview l=${b.l} w=${b.w} h=${b.h} pad=${b.pad} gap=${b.gap} flex=${b.fl} maxW=${b.mw}`); } }
    console.log(`${tag}: ${n} blocks differ at ${W}`);
  } catch (e) { console.log('CRASH ' + e.message.split('\n')[0]); await page.screenshot({ path: path.join(OUT, `${tag}-crash.png`) }).catch(() => {}); }
  if (errs.length) console.log('page errors: ' + [...new Set(errs)].join(' | '));
  await browser.close();
})();
