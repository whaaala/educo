// HEADED PROBE (RULE Y): the Icon and the List, built through the UI the way the dressed pages build them — an Icon in a
// narrow column beside words, a List under them — measured on the canvas and in the Preview at all five rungs.
//   NODE_PATH=node_modules node scripts/uat/probe-t7.js
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const { Builder } = require('./build-page.js');
const OUT = path.join(__dirname, 'probe-t7-out'); fs.mkdirSync(OUT, { recursive: true });
const RUNGS = [[375, 'Mobile (375px)'], [768, 'Tablet (768px)'], [1024, 'Laptop (1024px)'], [1280, 'Desktop (1280px)'], [1920, 'Wide (1920px)']];

const measure = (engine) => (function () {
  const q = engine === 'canvas' ? '[data-box-id]' : '[class*="bx-"]';
  const Z = engine === 'canvas' ? (document.querySelector('[data-box-id]').currentCSSZoom || 1) : 1;
  const px = (v) => Math.round((v / Z) * 10) / 10;
  const out = { icons: [], lists: [] };
  for (const svg of Array.from(document.querySelectorAll(`${q} svg`))) {
    const span = svg.parentElement; const wrap = span.parentElement; const block = svg.closest(q); if (!block || !span || !wrap) continue;
    if (engine === 'canvas' && !/^\s*$/.test(block.textContent || '')) continue; // the icon BLOCK, not an icon inside a button
    const chain = []; for (let e = block; e && chain.length < 12; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.containerType !== 'normal') chain.push(`${e.className.toString().slice(0, 24) || e.tagName}:${cs.containerType}:${Math.round(e.getBoundingClientRect().width / Z)}`); }
    out.icons.push({ blockH: px(block.getBoundingClientRect().height), wrapH: px(wrap.getBoundingClientRect().height), spanH: px(span.getBoundingClientRect().height), svgH: px(svg.getBoundingClientRect().height),
      spanFont: getComputedStyle(span).fontSize, wrapLine: getComputedStyle(wrap).lineHeight, wrapDisplay: getComputedStyle(wrap).display, blockPad: getComputedStyle(block).paddingTop + '/' + getComputedStyle(block).paddingBottom,
      blockDisplay: getComputedStyle(block).display, blockMinH: getComputedStyle(block).minHeight, boxU: getComputedStyle(span).getPropertyValue('--box-u').trim().slice(0, 60), containers: chain });
  }
  for (const ul of Array.from(document.querySelectorAll('ul, ol'))) { const b = ul.closest(q); const li = ul.querySelector('li'); if (!b || !li || ul.closest('nav')) continue;
    out.lists.push({ blockH: px(b.getBoundingClientRect().height), ulH: px(ul.getBoundingClientRect().height), liH: px(li.getBoundingClientRect().height), liMargin: getComputedStyle(li).marginBottom, items: ul.querySelectorAll('li').length }); }
  return out;
})();

(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720, pos: [0, 0] });
  page.setDefaultTimeout(10000); const R = { canvas: {}, preview: {} };
  try {
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack');
    const c0 = await P.into(page, sec, 'Stack'); const cols = await P.row(page, c0, ['Stack', 'Stack']);
    await P.into(page, cols[0], 'Icon'); await P.into(page, cols[1], 'Text'); await P.into(page, cols[2], 'Text');
    await new Builder(page).sizeColumns(cols, [10, 45, 45]); await H.panel(page, true);
    const line2 = await new Builder(page).addLine(sec, 'Stack', c0); await P.into(page, line2, 'List');
    await H.panel(page, false);
    fs.writeFileSync(path.join(OUT, 'tree.txt'), await H.tree(page));
    for (const [w, preset] of RUNGS) {
      await page.getByRole('button', { name: preset }).first().click(); await page.waitForTimeout(700);
      R.canvas[w] = await page.evaluate(measure, 'canvas');
      await page.screenshot({ path: path.join(OUT, `canvas-${w}.png`) });
    }
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h'); await page.waitForTimeout(400);
    fs.writeFileSync(path.join(OUT, 'export.html'), await (await page.$('iframe')).getAttribute('srcdoc') || '');
    for (const [w] of RUNGS) {
      await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(500);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: w + (w - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
      R.preview[w] = await f.evaluate(measure, 'preview');
      await page.screenshot({ path: path.join(OUT, `preview-${w}.png`) });
    }
  } catch (e) { R.crash = e.message; await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(R, null, 1));
  for (const [w] of RUNGS) { const c = R.canvas[w], p = R.preview[w]; if (!c || !p) continue;
    console.log(`${w}: ICON canvas ${JSON.stringify(c.icons[0])}\n      ICON preview ${JSON.stringify(p.icons[0])}\n      LIST canvas ${JSON.stringify(c.lists[0])} preview ${JSON.stringify(p.lists[0])}`); }
  if (R.crash) console.log('CRASH', R.crash);
  await browser.close();
})();
