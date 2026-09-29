// HEADED PROBE (RULE Y): a GRID of three cells — an icon, words, words — sized 15 / 30 / 100 by dragging, as tier-99 page
// 199 builds it ("could not select" its second cell) and as pages 254 / 285 hold it (cells taller on the canvas than in the
// Preview). Built through the UI; each step measured and photographed; then canvas and Preview at all five rungs.
//   NODE_PATH=node_modules node scripts/uat/probe-t8.js [--cols=15,30,100] [--sidebar]
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const { Builder } = require('./build-page.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const COLS = arg('cols', '15,30,100').split(',').map(Number); const SIDEBAR = process.argv.includes('--sidebar');
const OUT = path.join(__dirname, 'probe-t8-out'); fs.mkdirSync(OUT, { recursive: true });
const RUNGS = [[375, 'Mobile (375px)'], [768, 'Tablet (768px)'], [1024, 'Laptop (1024px)'], [1280, 'Desktop (1280px)'], [1920, 'Wide (1920px)']];

const measure = ([engine, ids]) => {
  const Z = engine === 'canvas' ? (document.querySelector('[data-box-id]').currentCSSZoom || 1) : 1;
  const find = (id) => engine === 'canvas' ? document.querySelector(`[data-box-id="${id}"]`) : document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`);
  const px = (v) => Math.round((v / Z) * 10) / 10;
  return ids.map((id) => { const e = find(id); if (!e) return { id: id.slice(-4), missing: true }; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return { id: id.slice(-4), x: px(r.left), y: px(r.top + scrollY), w: px(r.width), h: px(r.height), display: cs.display, cols: cs.display === 'grid' ? cs.gridTemplateColumns : undefined, rows: cs.display === 'grid' ? cs.gridTemplateRows : undefined,
      col: cs.gridColumnStart + '/' + cs.gridColumnEnd, row: cs.gridRowStart + '/' + cs.gridRowEnd, tplRows: e.style.gridTemplateRows || undefined, kids: Array.from(e.children).map((k) => { const c = getComputedStyle(k); const kr = k.getBoundingClientRect(); return k.tagName.toLowerCase() + (k.getAttribute("data-box-id") ? "#" + k.getAttribute("data-box-id").slice(-4) : "." + String(k.className).slice(0, 40)) + " " + c.display + "/" + c.position + " " + Math.round(kr.width) + "x" + Math.round(kr.height) + " row " + c.gridRowStart; }), minH: cs.minHeight, height: e.style.height || undefined, alignSelf: cs.alignSelf, scrollW: px(e.scrollWidth) }; });
};
const overlaps = (cells) => { const out = []; for (let i = 0; i < cells.length; i++) for (let j = i + 1; j < cells.length; j++) { const a = cells[i], b = cells[j]; if (a.missing || b.missing) continue;
  const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); if (ox > 1 && oy > 1) out.push(`${a.id}×${b.id} ${Math.round(ox)}×${Math.round(oy)}px`); } return out; };

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos: [0, 0] });
  page.setDefaultTimeout(10000); const R = { steps: [], canvas: {}, preview: {} }; let n = 0;
  const step = async (name, ids) => { const m = await page.evaluate(measure, ['canvas', ids]); R.steps.push({ name, cells: m, overlaps: overlaps(m.slice(1)) }); await page.screenshot({ path: path.join(OUT, `step-${++n}-${name.replace(/\W+/g, '-')}.png`) }); console.log(`STEP ${name}: ${m.map((c) => `${c.id} x${c.x} w${c.w} h${c.h}${c.cols ? ' cols[' + c.cols + ']' : ''}`).join(' | ')}${R.steps[R.steps.length - 1].overlaps.length ? '  OVERLAP ' + R.steps[R.steps.length - 1].overlaps.join(', ') : ''}`); };
  try {
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack'); let host = sec;
    if (SIDEBAR) { const main = await P.into(page, sec, 'Stack'); const aside = await P.beside(page, main, 'Stack'); await P.into(page, aside, 'Card'); await new Builder(page).sizeColumns([main, aside], [+arg('main', 70), 100 - +arg('main', 70)]); await H.panel(page, true); host = main; }
    // --stack=N: N grids one under another, built by the DRESSER's own routine (Builder.columns) — the shape of tier-99
    // page 254, where a re-run found an extra EMPTY cell in four of eleven grids.
    const STACK = +arg('stack', 0);
    if (STACK) {
      const b = new Builder(page); let last = null; const grids = [];
      for (let i = 0; i < STACK; i++) { last = await b.columns({ kind: 'grid', n: COLS.length, cols: COLS, inner: [], lines: 1, plusStack: false }, host, last, { dress: true, sectionIndex: 1, firstInSection: false, lines: 1, lastLine: false }); grids.push(last);
        const counts = await page.evaluate((ids) => ids.map((id) => { const g = document.querySelector(`[data-box-id="${id}"]`); return id.slice(-4) + ':' + Array.from(g.querySelectorAll(':scope > [data-box-id]')).map((c) => (c.querySelector('[data-box-id]') ? 'filled' : 'EMPTY')).join(','); }), grids);
        await page.screenshot({ path: path.join(OUT, `stack-${i + 1}.png`) }); console.log(`GRID ${i + 1} built — cells now: ${counts.join(' | ')}`); }
      fs.writeFileSync(path.join(OUT, 'tree.txt'), await H.tree(page));
      await browser.close(); return;
    }
    // --row: the same, for a ROW of columns (stacks side by side) each holding a Quote — tier-99 page 101, whose row
    // stored 50 + 25 + 33.34 and left a HOLE at the Wide size.
    if (process.argv.includes('--row')) {
      // --after-leaf: the row is the SECOND line of a stack, under a text — as the dresser builds "stack[leaf, row]"
      let c0; const cols = [];
      if (process.argv.includes('--after-leaf')) { const inner = await P.into(page, host, 'Stack'); const leaf = await P.into(page, inner, 'Text'); c0 = await new Builder(page).addLine(inner, 'Stack', leaf); }
      else c0 = await P.into(page, host, 'Stack');
      cols.push(c0);
      const stored = async (name) => { const t = await H.tree(page); const w = cols.map((id) => (new RegExp(`${id.slice(-4)} container[^\\n]*?w=([^\\s]+)`).exec(t) || [])[1]); const m = await page.evaluate(measure, ['canvas', cols]);
        console.log(`STEP ${name}: stored ${w.join(' + ')} = ${w.reduce((a, v) => a + (parseFloat(v) || 0), 0).toFixed(2)}%   drawn ${m.map((c) => `x${c.x} w${c.w} y${c.y}`).join(' | ')}`); await page.screenshot({ path: path.join(OUT, `row-${++n}-${name.replace(/\W+/g, '-')}.png`) }); };
      await stored('first column');
      for (let i = 1; i < COLS.length; i++) { cols.push(await P.beside(page, cols[cols.length - 1], 'Stack')); await stored(`column ${i + 1} dropped beside`); }
      for (const [i, c] of cols.entries()) { await P.into(page, c, arg('fill', 'Quote')); await stored(`column ${i + 1} filled`); }
      const b = new Builder(page); const orig = H.dragEdge; let d = 0;
      H.dragEdge = async (...a) => { const r = await orig(...a); await page.waitForTimeout(300); await stored(`drag ${++d} (${a[1]} by ${a[2]}px)`); return r; };
      await b.sizeColumns(cols, COLS); H.dragEdge = orig; await H.panel(page, false);
      await stored('sized'); console.log('cameBack', page.__cameBack || 0, 'widerToSize', page.__widerToSize || 0);
      for (const [w, preset] of RUNGS) { await page.getByRole('button', { name: preset }).first().click(); await page.waitForTimeout(700); const m = await page.evaluate(measure, ['canvas', cols]);
        console.log(`${w}: ${m.map((c) => `x${c.x} w${c.w} y${c.y}`).join(' | ')}${new Set(m.map((c) => c.y)).size > 1 ? '   <-- NOT ON ONE LINE' : ''}`); await page.screenshot({ path: path.join(OUT, `row-canvas-${w}.png`) }); }
      fs.writeFileSync(path.join(OUT, 'tree.txt'), await H.tree(page));
      await browser.close(); return;
    }
    const before = await P.ids(page);
    await H.dropInto(page, 'Grid', host);
    const pick = page.locator(`[role="gridcell"][aria-label="${COLS.length} across, 1 down"]`); if (await pick.count()) { await pick.click(); await page.waitForTimeout(700); }
    const g = (await P.newestLeaf(page, before)).id;
    const cells = await page.evaluate((gid) => Array.from(document.querySelector(`[data-box-id="${gid}"]`).querySelectorAll(':scope > [data-box-id]')).map((e) => e.getAttribute('data-box-id')), g);
    const ids = [g, ...cells];
    await step('grid added', ids);
    await P.into(page, cells[0], 'Icon'); for (const c of cells.slice(1)) await P.into(page, c, 'Text');
    await step('cells filled', ids);
    // the drags of sizeColumns, ONE AT A TIME, so the step that goes wrong is the step that is seen
    const b = new Builder(page); const orig = H.dragEdge; let d = 0;
    H.dragEdge = async (...a) => { const r = await orig(...a); await page.waitForTimeout(300); await step(`drag ${++d} (${a[1]} by ${a[2]}px)`, ids); return r; };
    await b.sizeColumns(cells, COLS); H.dragEdge = orig;
    await H.panel(page, false);
    await step('sized', ids);
    R.selectable = {}; for (const c of cells) { try { await H.select(page, c); R.selectable[c.slice(-4)] = true; } catch (e) { R.selectable[c.slice(-4)] = e.message; } }
    console.log('SELECT', JSON.stringify(R.selectable));
    fs.writeFileSync(path.join(OUT, 'tree.txt'), await H.tree(page));
    fs.writeFileSync(path.join(OUT, 'stored.json'), await page.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const v = localStorage.getItem(localStorage.key(i)); if (v && v.includes('"children"')) return v; } return '{}'; }));
    for (const [w, preset] of RUNGS) { await page.getByRole('button', { name: preset }).first().click(); await page.waitForTimeout(700); R.canvas[w] = await page.evaluate(measure, ['canvas', ids]); await page.screenshot({ path: path.join(OUT, `canvas-${w}.png`) }); }
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h'); await page.waitForTimeout(400);
    fs.writeFileSync(path.join(OUT, 'export.html'), await (await page.$('iframe')).getAttribute('srcdoc') || '');
    for (const [w] of RUNGS) {
      await page.setViewportSize({ width: w, height: 720 }); await page.waitForTimeout(500);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: w + (w - inner), height: 720 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
      R.preview[w] = await f.evaluate(measure, ['preview', ids]); await page.screenshot({ path: path.join(OUT, `preview-${w}.png`) });
    }
    for (const [w] of RUNGS) { const c = R.canvas[w], p = R.preview[w];
      console.log(`${w}: ` + c.map((x, i) => `${x.id} canvas w${x.w} h${x.h} | preview w${p[i].w} h${p[i].h}${Math.abs(x.h - p[i].h) > 2 || Math.abs(x.w - p[i].w) > 2 ? ' <-- DIFFERENT' : ''}`).join('\n      '));
      const places = (cells) => JSON.stringify(cells.map((x) => ({ id: x.id, col: x.col, row: x.row, tplRows: x.tplRows, kids: x.kids, minH: x.minH })));
      if (w === 768) { console.log('      TABLET canvas ' + places(c)); console.log('      TABLET preview ' + places(p)); }
      console.log(`      grid canvas cols[${c[0].cols}] rows[${c[0].rows}] minH ${c[0].minH}\n      grid preview cols[${p[0].cols}] rows[${p[0].rows}] minH ${p[0].minH}   overlaps canvas: ${overlaps(c.slice(1)).join(', ') || 'none'} · preview: ${overlaps(p.slice(1)).join(', ') || 'none'}`); }
  } catch (e) { R.crash = e.message; console.log('CRASH', e.message.split('\n')[0]); await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  if (errs.length) console.log('PAGE ERRORS', errs.join(' / '));
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(R, null, 1));
  await browser.close();
})();
