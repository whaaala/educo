// HEADED UAT — L-2 e-8 (tier-99 page 209): an FAQ — a Heading with an Accordion under it — BUILT THROUGH THE UI the way
// the dresser builds it, then every block measured on the canvas and in the Preview at one rung.
//   NODE_PATH=node_modules node scripts/uat/probe-l2-acc.js --w=768 [--theme=Midnight]
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const W = +arg('w', 768), THEME = arg('theme', 'Light');
const PRESET = { 375: 'Mobile (375px)', 768: 'Tablet (768px)', 1024: 'Laptop (1024px)', 1280: 'Desktop (1280px)', 1920: 'Wide (1920px)' }[W];
const OUT = path.join(__dirname, 'probe-l2-acc-out'); fs.mkdirSync(OUT, { recursive: true });
const tag = `w${W}${THEME === 'Light' ? '' : THEME.replace(/\W+/g, '')}`;
const where = ([engine]) => {
  const page = engine === 'canvas' ? document.querySelector('[data-box-id]') : document.querySelector('.eu-root') || document.body;
  const Z = engine === 'canvas' ? (page.closest('[data-canvas-scale]')?.dataset.canvasScale * 1 || 1) : 1;
  const out = {};
  const all = engine === 'canvas' ? [...document.querySelectorAll('[data-box-id]')].map((e) => [e.getAttribute('data-box-id'), e]) : [...document.querySelectorAll('[class*="bx-"]')].map((e) => [(e.className.match(/bx-([A-Za-z0-9_-]+)/) || [])[1], e]);
  for (const [id, e] of all) { if (!id) continue; const r = e.getBoundingClientRect(); if (!r.width) continue;
    // the component's own parts: each item's height, so a taller Preview can be traced to the part that grew
    const parts = [...e.querySelectorAll('summary, details, [data-eu-item], .eu-acc-item, button')].slice(0, 8).map((k) => `${k.tagName.toLowerCase()}:${Math.round(k.getBoundingClientRect().height / Z)}`).join(' ');
    out[id] = { w: +(r.width / Z).toFixed(1), h: +(r.height / Z).toFixed(1), txt: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 24), parts }; }
  return out;
};
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900 });
  page.setDefaultTimeout(12000);
  try {
    if (THEME !== 'Light') for (const b of ['Website theme', 'Change theme']) { await page.getByRole('button', { name: b }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(400); }
    await H.panel(page, true);
    const stack = await P.first(page, 'Stack'); const h = await P.into(page, stack, 'Heading'); await P.under(page, h, 'Accordion');
    await H.panel(page, false); await page.keyboard.press('Escape');
    fs.writeFileSync(path.join(OUT, `${tag}-site.json`), await page.evaluate(() => localStorage.getItem('educo_box_site_v1') || ''));
    await page.getByRole('button', { name: PRESET }).first().click(); await page.waitForTimeout(900);
    const c = await page.evaluate(where, ['canvas']); await page.screenshot({ path: path.join(OUT, `${tag}-canvas.png`) });
    // --chain=1: the open answer's element and its ancestors on the CANVAS — what caps (or does not cap) its width
    if (arg('chain', '')) console.log('  canvas answer chain: ' + JSON.stringify(await page.evaluate(() => { const el = [...document.querySelectorAll('[data-box-id] *')].find((e) => e.children.length === 0 && /^Answer/.test((e.textContent || '').trim()));
      const out = []; for (let e = el; e && out.length < 7; e = e.parentElement) { const cs = getComputedStyle(e); out.push(`${e.tagName}.${(e.className || '').toString().split(' ')[0]} maxW=${cs.maxWidth} w=${cs.width} ce=${e.isContentEditable}`); } return out; })));
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h');
    await page.setViewportSize({ width: W, height: 900 }); await page.waitForTimeout(500);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== W) { await page.setViewportSize({ width: W + (W - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
    const v = await f.evaluate(where, ['preview']); await page.screenshot({ path: path.join(OUT, `${tag}-preview.png`) });
    fs.writeFileSync(path.join(OUT, `${tag}-export.html`), await (await page.$('iframe')).getAttribute('srcdoc') || '');
    let n = 0;
    for (const id of Object.keys(c)) { const a = c[id], b = v[id.replace(/[^A-Za-z0-9_-]/g, '-')]; if (!b) continue;
      if (Math.abs(a.w - b.w) > 2 || Math.abs(a.h - b.h) > 2) { n++; console.log(`  DIFFER ${id.slice(-4)} "${a.txt}": canvas ${a.w}×${a.h} [${a.parts}] | preview ${b.w}×${b.h} [${b.parts}]`); } }
    console.log(`${tag}: ${n} blocks differ at ${W}`);
  } catch (e) { console.log('CRASH ' + e.message.split('\n')[0]); await page.screenshot({ path: path.join(OUT, `${tag}-crash.png`) }).catch(() => {}); }
  if (errs.length) console.log('page errors: ' + [...new Set(errs)].join(' | '));
  await browser.close();
})();
