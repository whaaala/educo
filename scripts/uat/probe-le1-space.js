// LE-1 probe: a coloured box with a Text, space added for PHONES only (the editor at 375) — what the Page check lists, and what
// the real Preview measures at 1200 with the same measurer.
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const X = require('./uat-rx3-headed.js'); const { band, at, ins, sleep, deselect, pvOpen, pvAt, pvClose } = X;
const ts = require('typescript');
const src = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../../lib/space-check.ts'), 'utf8'), { compilerOptions: { target: 99, module: 1 } }).outputText;
const measure = src.slice(src.indexOf('function measureSpace'), src.lastIndexOf('}') + 1);
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1280, h: 860 });
  const boxed = await band(page, 'Stack'); await at(page, boxed, 'Design', 'Background');
  await ins(page).getByRole('button', { name: 'Background colour palette' }).first().click(); await sleep(page, 300);
  await page.locator('[role=dialog] button[title^="#f3f4f6"]').first().click(); await page.keyboard.press('Escape'); await sleep(page, 300);
  await H.panel(page, false); await H.select(page, boxed); await H.panel(page, true); await page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: 'Inside' }).first().click(); await sleep(page, 300);
  await H.clickTile(page, 'Text');
  await page.setViewportSize({ width: 375, height: 860 }); await sleep(page, 800);
  await at(page, boxed, 'Design', 'Spacing'); const f = ins(page).getByRole('slider', { name: 'Inner spacing' }).first(); await f.focus(); for (let i = 0; i < 20; i++) await page.keyboard.press('ArrowRight'); await sleep(page, 600);
  await deselect(page); await page.getByRole('button', { name: 'More', exact: true }).click(); await sleep(page, 400);
  await page.getByRole('dialog', { name: 'More' }).getByRole('button', { name: /^Page check/ }).first().click(); await sleep(page, 6000);
  console.log('CHECK:', (await page.locator('[data-space-kind]').evaluateAll((l) => l.map((x) => x.textContent.slice(0, 140)))).join('\n  '));
  await page.keyboard.press('Escape'); await sleep(page, 400);
  await page.keyboard.press('Escape'); await sleep(page, 400);
  await pvOpen(page); const html = await page.evaluate(() => document.querySelector('iframe').srcdoc); await pvClose(page, 375);
  for (const left of ['-750px', '-100000px']) for (const w of [1200]) {
    const r = await page.evaluate(async ([html, left, w, measure]) => { const f = document.createElement('iframe'); Object.assign(f.style, { position: 'fixed', left, top: '0', width: w + 'px', height: '900px', border: '0', opacity: '0' }); document.body.appendChild(f);
      await new Promise((d) => { f.onload = d; f.srcdoc = html; }); await f.contentDocument.fonts.ready; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const out = f.contentWindow.eval(`(function(){ ${measure}; return JSON.stringify(measureSpace(document)); })()`); const cw = f.contentDocument.documentElement.clientWidth; f.remove(); return cw + ' ' + out; }, [html, left, w, measure]);
    console.log('FRAME left', left, 'w', w, r); }
  await pvOpen(page);
  for (const w of [360, 1200]) { const fr = await pvAt(page, w); console.log('PREVIEW', w, await fr.evaluate(`(function(){ ${measure}; return JSON.stringify(measureSpace(document)); })()`)); }
  await pvClose(page, 1280); await browser.close();
})();
