// HEADED UAT — BATCH L-1 · L1-9: a pinned PAGE HEADER that shares its band with another column was given clause 3b's
// screen height (720px on tier-95 page 124). Built THROUGH THE UI: a Stack with a Heading, its meaning set to "Page header",
// set to "Sticks when reached", a Stack dropped BESIDE it (so the header shares a row), then a page of words after it.
// The header must hug its content — on the canvas and in the Preview at four widths.
//   NODE_PATH=node_modules node scripts/uat/probe-l1-header.js [--pos=0,0] [--theme=Light]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const THEME = arg('theme', 'Light');
const OUT = path.join(__dirname, 'probe-l1-header-out', THEME.replace(/\s/g, '')); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos: arg('pos', '0,0').split(',').map(Number) });
  page.setDefaultTimeout(12000); let bad = 0;
  try {
    if (THEME !== 'Light') {
      await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300);
      await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(500);
    }
    await H.panel(page, true);
    const hdr = await P.first(page, 'Stack'); const h1 = await P.into(page, hdr, 'Heading');
    const side = await P.beside(page, hdr, 'Stack'); await P.into(page, side, 'Button');
    let t = await P.tileAfter(page, side, 'Stack'); t = await P.into(page, t, 'Text'); for (let i = 0; i < 8; i++) t = await P.under(page, t, 'Text');
    await H.panel(page, false);
    await I.meaning(page, hdr, 'Page header'); console.log('  sticky set: ' + await I.sticky(page, hdr));
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    const m = await page.evaluate(([hd, h1]) => { const e = document.querySelector(`[data-box-id="${hd}"]`); const z = document.querySelector('[data-box-id]').closest('[data-canvas-scale]')?.dataset.canvasScale * 1 || 1;
      return { h: Math.round(e.getBoundingClientRect().height / z), content: Math.round(document.querySelector(`[data-box-id="${h1}"]`).getBoundingClientRect().height / z), css: getComputedStyle(e).height, pos: getComputedStyle(e).position, tag: e.tagName.toLowerCase() }; }, [hdr, h1]);
    const tooTall = m.h > m.content + 120; if (tooTall) bad++;
    console.log(`  canvas: the <${m.tag}> (${m.pos}) is ${m.h}px tall around a ${m.content}px heading — ${tooTall ? 'SCREEN-TALL' : 'hugs its content'}`);
    await page.screenshot({ path: path.join(OUT, 'canvas.png') });
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500);
    await page.keyboard.press('h'); await page.waitForTimeout(400);
    for (const w of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width: w, height: 720 }); await page.waitForTimeout(600);
      const f = await (await page.$('iframe')).contentFrame();
      const p = await f.evaluate(() => { const e = document.querySelector('header'); if (!e) return null; return { h: Math.round(e.getBoundingClientRect().height), pos: getComputedStyle(e).position, vh: innerHeight }; });
      const tall = !p || p.h >= p.vh - 40; if (tall) bad++;
      console.log(`  Preview ${w}: <header> ${p ? `${p.h}px (${p.pos}) in a ${p.vh}px window` : 'MISSING'} — ${tall ? 'SCREEN-TALL' : 'hugs its content'}`);
      await page.screenshot({ path: path.join(OUT, `preview-${w}.png`) });
    }
  } catch (e) { bad++; console.log('CRASH ' + e.message.split('\n')[0] + ' at ' + (page.__step || '?')); await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  if (errs.length) console.log('page errors: ' + [...new Set(errs)].join(' | '));
  console.log(`L1-9 (${THEME}): ${bad} problems`);
  await browser.close();
})();
