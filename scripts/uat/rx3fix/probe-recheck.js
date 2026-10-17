// RX-3 fixes, re-checks (headed, through the UI): (a) U4's caption at a 375 editor in all four editor themes (the theme
// switch is set at 1280 — at 375 it hides behind the "⋯" menu); (b) U6 where the Outline Button's border width comes from;
// (c) U7 / RX3-19 what a Side by side's Text and Button are sized as, and whether End moves them once they are "Fit".
const path = require('path'); const H = require('../h.js'); const I = require('../inspector.js');
const X = require('../uat-rx3-headed.js'); const { cls, sleep, nodeOf, band, into, tileThen, sel, expandInspector, at, ins, btn, choose, pvOpen, pvAt, pvClose, selectedId } = X;
const OUT = __dirname;
async function appTheme(page, name) { await page.getByRole('button', { name: 'Change theme' }).first().click(); await sleep(page, 300); await page.getByRole('menuitemradio', { name: new RegExp('^\\s*' + name) }).first().click(); await sleep(page, 500); }
const contrast = (page, a, b) => page.evaluate(([a, b]) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const g = cv.getContext('2d'); const rgb = (c) => { g.clearRect(0, 0, 1, 1); g.fillStyle = c; g.fillRect(0, 0, 1, 1); return Array.from(g.getImageData(0, 0, 1, 1).data).slice(0, 3); }; const L = (c) => { const [r, gg, bb] = rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * gg + 0.0722 * bb; }; const x = L(a), y = L(b); return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2); }, [a, b]);
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 820, pos: [100, 40] }); page.setDefaultTimeout(12000);
  const out = { a: {}, b: null, c: {} };
  try {
    // (a)
    const b = await band(page); const t = await into(page, b, 'Text'); await H.panel(page, false);
    for (const th of ['Light', 'Dark', 'Midnight', 'Purple']) {
      await page.setViewportSize({ width: 1366, height: 820 }); await sleep(page, 500); await appTheme(page, th);
      await page.setViewportSize({ width: 375, height: 820 }); await sleep(page, 700);
      if (await selectedId(page) !== t) await sel(page, t); await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Spacing');
      const cap = page.getByText('Each side in rem · 1rem is 16px at the default text size').first(); await cap.scrollIntoViewIfNeeded().catch(() => {});
      const vis = await cap.isVisible().catch(() => false);
      if (vis) { const color = await cap.evaluate((e) => getComputedStyle(e).color); const bg = await cap.evaluate((e) => { while (e) { const c = getComputedStyle(e).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)') return c; e = e.parentElement; } return 'white'; }); out.a[th] = { color, bg, contrast: await contrast(page, color, bg), size: await cap.evaluate((e) => getComputedStyle(e).fontSize) }; await page.screenshot({ path: path.join(OUT, `recheck-U4-375-${th}.png`) }); }
      else out.a[th] = 'NOT VISIBLE';
    }
    await page.setViewportSize({ width: 1366, height: 820 }); await appTheme(page, 'Light');
    // (b)
    const bb = await band(page); const bt = await into(page, bb, 'Button'); await H.panel(page, false); await at(page, bt, 'Design'); await btn(page, 'Outline style', ins(page));
    let f = await pvOpen(page).then(() => pvAt(page, 1280));
    out.b = await f.evaluate((s) => { const box = document.querySelector(s); const a = box.querySelector('a,button') || box; const rules = []; for (const sh of document.styleSheets) { let rs; try { rs = sh.cssRules; } catch { continue; } const walk = (list) => { for (const r of list) { if (r.cssRules && !r.selectorText) walk(r.cssRules); else if (r.selectorText && /border/.test(r.cssText)) { try { if (a.matches(r.selectorText)) rules.push(r.cssText.slice(0, 220)); } catch { /* bad selector */ } } } }; walk(rs); } return { inline: (a.getAttribute('style') || '').match(/border[^;]*/g), rules, drawn: getComputedStyle(a).borderTopWidth }; }, cls(bt));
    await pvClose(page, 1366);
    // (c)
    const fresh = await tileThen(page, 'Side by side', null); let row = null; for (const id of fresh) { const n = await nodeOf(page, id); if (n && n.direction === 'row' && !n.rowBand) row = id; }
    for (const tt of ['Text', 'Button']) { await sel(page, row); await page.getByRole('button', { name: 'Add a block inside this one' }).first().click(); await sleep(page, 300); await page.getByRole('menuitem', { name: tt, exact: true }).first().click(); await sleep(page, 700); await page.keyboard.press('Escape'); await sleep(page, 200); }
    const kids = (await nodeOf(page, row)).children.map((x) => x.id);
    out.c.stored = await Promise.all(kids.map(async (k) => { const n = await nodeOf(page, k); return { type: n.type, width: n.width, flex: n.flex }; }));
    const measure = async (label) => { await sel(page, row); await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Arrange'); await choose(page, 'Position blocks', /^End$/); f = await pvOpen(page).then(() => pvAt(page, 1280)); out.c[label] = await f.evaluate(([r, ks]) => { const R = document.querySelector(r).getBoundingClientRect(); return { jc: getComputedStyle(document.querySelector(r)).justifyContent, kids: ks.map((k) => { const e = document.querySelector(k); const K = e.getBoundingClientRect(); const c = getComputedStyle(e); return `${Math.round(K.left - R.left)}..${Math.round(K.right - R.left)} of ${Math.round(R.width)} (flex ${c.flexGrow} ${c.flexShrink} ${c.flexBasis}, width ${c.width})`; }) }; }, [cls(row), kids.map(cls)]); await page.screenshot({ path: path.join(OUT, `recheck-U7-sbs-${label}.png`) }); await pvClose(page, 1366); };
    await measure('End-as-added');
    for (const k of kids) await I.widthMode(page, k, 'Fit');
    out.c.storedAfterFit = await Promise.all(kids.map(async (k) => (await nodeOf(page, k)).width));
    await measure('End-after-Fit');
  } catch (e) { out.error = e.message.split('\n')[0]; await page.screenshot({ path: path.join(OUT, 'recheck-ERROR.png') }); }
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
