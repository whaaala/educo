// HEADED PROBE (RULE Y) for L-4 c-8 — words broken across lines: Stats ("1,000+") in narrow columns, BUILT THROUGH THE UI:
// a section → a 70% main column beside a 30% sidebar → in the main column one of
//   row4  · a row of four columns, a Stat in each        grid4 · grid5 · grid6 · a grid of N across, a Stat in each cell
// then the real Preview at 1920 · 1280 · 1024 · 768 · 600 · 375, every Stat number measured: how many lines it takes and
// how wide its cell is. A number on two lines is c-8. Usage (one window per variant, six side by side):
//   NODE_PATH=node_modules node scripts/uat/probe-l4-c8.js --v=grid4 --pos=0,0 [--theme=Dark]
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const { Builder } = require('./build-page.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const V = arg('v', 'grid4'); const POS = arg('pos', '0,0').split(',').map(Number);
const OUT = path.join(__dirname, 'probe-l4-out'); fs.mkdirSync(OUT, { recursive: true });
const WIDTHS = [1920, 1280, 1024, 768, 600, 375];

// Every "1,000+" on the page, as WORDS (a palette Stat is a tree of ordinary blocks — a heading and a text — not the
// registry's .eu-stat markup, which is why the first version of this probe measured nothing: L4-b).
const measure = () => { const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const i = n.data.indexOf('1,000+'); if (i < 0) continue;
    const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 6);
    const lines = new Set(Array.from(r.getClientRects()).map((q) => Math.round(q.top))).size;
    const el = n.parentElement; const cell = el.closest('[class*="bx-"]'); const host = cell && cell.parentElement ? cell.parentElement.closest('[class*="bx-"]') : null;
    out.push({ text: '1,000+', lines, valueW: Math.round(r.getBoundingClientRect().width), fontPx: getComputedStyle(el).fontSize, cellW: cell ? Math.round(cell.getBoundingClientRect().width) : null, hostW: host ? Math.round(host.getBoundingClientRect().width) : null }); }
  return out; };
const sideways = () => document.documentElement.scrollWidth - document.documentElement.clientWidth;

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1280, h: 800, pos: POS });
  page.setDefaultTimeout(15000); const R = { variant: V, preview: {} };
  try {
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack');
    const main = await P.into(page, sec, 'Stack'); const aside = await P.beside(page, main, 'Stack');
    await P.into(page, aside, 'List');
    const b = new Builder(page); await b.sizeColumns([main, aside], [70, 30]); await H.panel(page, true);
    if (V.startsWith('row')) {
      const c0 = await P.into(page, main, 'Stack'); const cols = await P.row(page, c0, Array(Number(V.slice(3)) - 1).fill('Stack'));
      for (const c of cols) await P.into(page, c, 'Stat');
    } else {
      const n = Number(V.replace('grid', ''));
      const before = await P.ids(page);
      await H.dropInto(page, 'Grid', main);
      await page.locator(`[role="gridcell"][aria-label="${n} across, 1 down"]`).click(); await page.waitForTimeout(800);
      const g = (await P.newestLeaf(page, before)).id;
      const cells = await page.evaluate((id) => Array.from(document.querySelector(`[data-box-id="${id}"]`).querySelectorAll(':scope [data-box-id]')).filter((e) => e.parentElement.closest('[data-box-id]') === document.querySelector(`[data-box-id="${id}"]`)).map((e) => e.getAttribute('data-box-id')), g);
      for (const c of cells) await P.into(page, c, 'Stat');
    }
    await H.panel(page, false);
    await page.screenshot({ path: path.join(OUT, `${V}-canvas.png`) });
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h'); await page.waitForTimeout(400);
    for (const W of WIDTHS) {
      await page.setViewportSize({ width: W, height: 900 }); await page.waitForTimeout(500);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== W) { await page.setViewportSize({ width: W + (W - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
      R.preview[W] = { stats: await f.evaluate(measure), sideways: await f.evaluate(sideways) };
      await page.screenshot({ path: path.join(OUT, `${V}-preview-${W}.png`) });
    }
  } catch (e) { R.crash = `${page.__step || ''} ${e.message}`; await page.screenshot({ path: path.join(OUT, `${V}-crash.png`) }).catch(() => {}); }
  R.pageErrors = errs;
  fs.writeFileSync(path.join(OUT, `${V}.json`), JSON.stringify(R, null, 1));
  const broken = Object.entries(R.preview).flatMap(([w, x]) => x.stats.filter((s) => s.lines > 1).map((s) => `${w}: "${s.text}" ${s.lines} lines in ${s.cellW}px (needs ${s.valueW})`));
  console.log(`${V}: ${R.crash ? 'CRASH ' + R.crash : broken.length ? 'BROKEN ' + broken.length : Object.values(R.preview).some((x) => !x.stats.length) ? 'MEASURED NOTHING (probe fault)' : 'one line everywhere'}`); for (const l of broken) console.log('  ' + l);
  for (const [w, x] of Object.entries(R.preview)) if (x.sideways > 1) console.log(`  ${w}: scrolls sideways by ${x.sideways}px`);
  await browser.close();
})();
