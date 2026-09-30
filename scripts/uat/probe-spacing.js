// HEADED UAT — BATCH S-1 · SPACE BY DEFAULT (docs/TASK_TREE.md → BATCHES). Built ONLY through the UI (RULE Y): a header bar
// (logo + four links, Meaning "Page header"), a stack of Heading · Text · Button, a coloured section, a row of three columns,
// a 3×2 grid, a picture, a plain box inside a section and a footer — then measured in the editor AND the Preview at every
// rung, in the chosen theme, and the inspector's spacing controls driven (default shown, 0, one side, back to default, undo).
//   NODE_PATH=node_modules node scripts/uat/probe-spacing.js [--theme=Light] [--pos=0,0]
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const THEME = arg('theme', 'Light');
const OUT = path.join(__dirname, 'probe-spacing-out', THEME.replace(/\s/g, '')); fs.mkdirSync(OUT, { recursive: true });
const RUNGS = [[375, 'Mobile (375px)'], [768, 'Tablet (768px)'], [1024, 'Laptop (1024px)'], [1280, 'Desktop (1280px)'], [1920, 'Wide (1920px)']];
const findings = []; const saw = []; const bad = (m) => { findings.push(m); console.log('  FINDING ' + m); }; const ok = (m) => { saw.push(m); console.log('  saw ' + m); };

/** Everything the checklist asks, measured in one document (editor canvas or Preview). Distances in CSS px of the page. */
const measure = ([engine, ids]) => {
  const Z = engine === 'canvas' ? (document.querySelector('[data-box-id]').currentCSSZoom || 1) : 1;
  const el = (id) => engine === 'canvas' ? document.querySelector(`[data-box-id="${id}"]`) : document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`);
  const page = engine === 'canvas' ? document.querySelector('[data-box-id]') : document.querySelector('.eu-root') || document.body;
  const pr = page.getBoundingClientRect();
  const r = (e) => { const b = e.getBoundingClientRect(); return { l: (b.left - pr.left) / Z, r: (pr.right - b.right) / Z, t: (b.top - pr.top) / Z, b: (b.bottom - pr.top) / Z, w: b.width / Z, h: b.height / Z }; };
  // the words' own box: a Range over the text, so padding on the block counts as space, as a reader sees it
  const words = (e) => { const rg = document.createRange(); rg.selectNodeContents(e); const b = rg.getBoundingClientRect(); return { l: (b.left - pr.left) / Z, r: (pr.right - b.right) / Z, t: (b.top - pr.top) / Z, b: (b.bottom - pr.top) / Z, box: b }; };
  const seen = (e) => { for (let a = e.parentElement; a && a !== page.parentElement; a = a.parentElement) { const cs = getComputedStyle(a); if ((cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.backgroundImage !== 'none' || parseFloat(cs.borderTopWidth) > 0) return a === page ? null : a; } return null; };
  const out = {};
  for (const [k, id] of Object.entries(ids)) {
    const e = el(id); if (!e) { out[k] = { missing: true }; continue; }
    const box = r(e); const w = e.innerText.trim() ? words(e) : null; const holder = seen(e);
    const hr = holder ? holder.getBoundingClientRect() : null;
    const cs = getComputedStyle(e);
    out[k] = { ...box, words: w && { l: w.l, r: w.r, t: w.t, b: w.b }, inHolder: hr && w ? { l: (w.box.left - hr.left) / Z, r: (hr.right - w.box.right) / Z, t: (w.box.top - hr.top) / Z, b: (hr.bottom - w.box.bottom) / Z } : null,
      // COMPUTED lengths are the page's own, before the canvas zoom — dividing them by Z read 40.7 for a 16px bar at Wide
      pad: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map((v) => Math.round(parseFloat(v) * 10) / 10), gap: [cs.rowGap, cs.columnGap].map((v) => Math.round((parseFloat(v) || 0) * 10) / 10) };
  }
  out.pageW = pr.width / Z; out.scrollX = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  return out;
};

const check = (where, w, m) => {
  const G = w < 600 ? 14 : 20; // the gutter floor the audit will use: a phone ~22px, never under 14; wider screens more
  for (const k of ['logo', 'link4', 'head', 'text', 'colText', 'col1', 'col3', 'footText', 'plainText']) {
    const x = m[k]; if (!x || x.missing || !x.words) continue;
    if (x.words.l < G - 0.5) bad(`${where} ${w}: "${k}" words ${x.words.l.toFixed(1)}px from the page's LEFT edge (floor ${G})`);
    if (x.words.r < G - 0.5) bad(`${where} ${w}: "${k}" words ${x.words.r.toFixed(1)}px from the page's RIGHT edge (floor ${G})`);
  }
  if (m.colText?.inHolder) { const s = m.colText.inHolder; const lo = Math.min(s.l, s.t, s.b); if (lo < 12) bad(`${where} ${w}: words in the COLOURED section ${lo.toFixed(1)}px from its edge`); else ok(`${where} ${w}: coloured section words ${Math.round(s.t)}/${Math.round(s.l)}px in`); }
  const hdr = m.header; if (hdr && !hdr.missing) { if (hdr.pad[0] > 24 || hdr.pad[0] < 10) bad(`${where} ${w}: header bar padding top ${hdr.pad[0]}px (want ~16)`); else ok(`${where} ${w}: header bar ${hdr.pad.join('/')}px`); }
  const s = m.stackSec; if (s && !s.missing) { if (s.pad[0] < 10 || s.pad[0] > 24) bad(`${where} ${w}: section space above ${s.pad[0]}px (want ~1rem)`); else ok(`${where} ${w}: section ${s.pad.join('/')}px`); }
  const st = m.stack; if (st && !st.missing) { if (!(m.text.t - m.head.b >= 10)) bad(`${where} ${w}: stack gap Heading→Text ${(m.text.t - m.head.b).toFixed(1)}px`); else ok(`${where} ${w}: stack gap ${(m.text.t - m.head.b).toFixed(1)}px`); }
  if (m.col1 && m.col2 && m.col3 && !m.col1.missing) {
    const oneLine = Math.abs(m.col1.t - m.col3.t) < 2; const gap = m.col2.l - (m.col1.l + m.col1.w);
    if (w >= 1024 && !oneLine) bad(`${where} ${w}: the row of three is NOT on one line`);
    if (oneLine && gap < 12) bad(`${where} ${w}: column gap ${gap.toFixed(1)}px`); else if (oneLine) ok(`${where} ${w}: columns on one line, gap ${gap.toFixed(1)}px`);
  }
  if (m.grid && !m.grid.missing) { if (m.grid.gap[1] < 12 && w >= 768) bad(`${where} ${w}: grid gap across ${m.grid.gap[1]}px`); else ok(`${where} ${w}: grid gap ${m.grid.gap.join('/')}px`); }
  if (m.image && !m.image.missing) { if (m.image.l > 1 || m.image.r > 1) bad(`${where} ${w}: the picture does not bleed (${m.image.l.toFixed(1)} / ${m.image.r.toFixed(1)}px from the edges)`); else ok(`${where} ${w}: picture edge to edge`); }
  if (m.plain && !m.plain.missing && m.plain.pad.some((v) => v > 0)) bad(`${where} ${w}: a PLAIN box inside a section has padding ${m.plain.pad.join('/')}`);
  if (m.scrollX) bad(`${where} ${w}: the page scrolls sideways`);
};

(async () => {
  const pos = arg('pos', '0,0').split(',').map(Number);
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900, pos });
  page.setDefaultTimeout(12000); const ids = {};
  try {
    if (THEME !== 'Light') { await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(500); }
    await H.panel(page, true);
    // HEADER BAR — logo + a menu of four links, as the dresser builds it
    ids.header = await P.first(page, 'Stack'); ids.logo = await P.into(page, ids.header, 'Heading');
    const nav = await P.beside(page, ids.logo, 'Stack'); let l = await P.into(page, nav, 'Link');
    for (let i = 2; i <= 4; i++) l = await P.beside(page, l, 'Link'); ids.link4 = l;
    // A STACK SECTION: Heading · Text · Button
    ids.stackSec = await P.tileAfter(page, ids.header, 'Stack'); ids.stack = ids.stackSec;
    ids.head = await P.into(page, ids.stackSec, 'Heading'); ids.text = await P.under(page, ids.head, 'Text'); await P.under(page, ids.text, 'Button');
    // A COLOURED SECTION, words inside
    ids.colSec = await P.tileAfter(page, ids.stackSec, 'Stack'); ids.colText = await P.into(page, ids.colSec, 'Text');
    // A ROW OF THREE COLUMNS, a Text in each
    const c1 = await P.tileAfter(page, ids.colSec, 'Stack'); const cols = await P.row(page, c1, ['Stack', 'Stack']);
    [ids.col1, ids.col2, ids.col3] = cols; for (const c of cols) await P.into(page, c, 'Text');
    // A PICTURE on the page, and a PLAIN box inside a section (the grid goes INTO that section below: a picture added
    // after a grid landed IN it as a seventh cell and the next drop added nothing, 4 of 4 windows — BATCH L-1's repro)
    ids.image = await P.tileAfter(page, cols[2], 'Image');
    const plainSec = await P.tileAfter(page, ids.image, 'Stack'); ids.plain = await P.into(page, plainSec, 'Stack'); ids.plainText = await P.into(page, ids.plain, 'Text');
    // FOOTER
    ids.footer = await P.tileAfter(page, plainSec, 'Stack'); ids.footText = await P.into(page, ids.footer, 'Text');
    // A 3×2 GRID, inside the plain section after its words
    await H.panel(page, false); await H.select(page, ids.plainText); await H.panel(page, true); ids.grid = await P.grid(page, 3, 2);
    await H.panel(page, false);
    await H.fillImages(page);
    await I.meaning(page, ids.header, 'Page header'); await I.meaning(page, nav, 'Menu'); await I.meaning(page, ids.footer, 'Page footer');
    await I.background(page, ids.colSec, '#eef2ff');
    await page.screenshot({ path: path.join(OUT, 'built.png') });
    fs.writeFileSync(path.join(OUT, 'tree.txt'), await H.tree(page));

    // ── THE INSPECTOR ──
    const slider = (name) => page.getByRole('slider', { name: new RegExp('^' + name) }).first();
    const spacingOpen = async (id) => { await H.select(page, id); await I.tab(page, 'Design'); await I.section(page, 'Spacing'); };
    await spacingOpen(ids.colSec);
    const shown = await page.locator('text=/Default · /').first().textContent().catch(() => null);
    if (!shown) bad('inspector: the coloured section\'s Inner spacing does not read "Default · size"'); else ok(`inspector reads "${shown.trim()}"`);
    await page.screenshot({ path: path.join(OUT, 'inspector-default.png') });
    for (const [k, lab] of [['head', 'Heading'], ['text', 'Text'], ['link4', 'Link'], ['image', 'Image']]) { // c-23
      await spacingOpen(ids[k]); if (!(await slider('Inner spacing').count())) bad(`c-23: a ${lab} offers no Inner spacing`); else ok(`c-23: ${lab} has Inner spacing`);
    }
    // 0 stays 0 · Back to default · Ctrl+Z
    await spacingOpen(ids.colSec); const s = slider('Inner spacing'); await s.focus(); await page.keyboard.press('Home'); await page.waitForTimeout(400);
    let m = await page.evaluate(measure, ['canvas', { colSec: ids.colSec }]); if (m.colSec.pad.some((v) => v !== 0)) bad(`set to 0, the coloured section still has ${m.colSec.pad.join('/')}`); else ok('Inner spacing 0 → 0/0/0/0 on the canvas');
    await page.screenshot({ path: path.join(OUT, 'inspector-zero.png') });
    await page.keyboard.press('Escape'); await page.keyboard.press('Control+z'); await page.waitForTimeout(500);
    m = await page.evaluate(measure, ['canvas', { colSec: ids.colSec }]); if (m.colSec.pad[0] === 0) bad('Ctrl+Z did not bring the default back'); else ok(`Ctrl+Z → ${m.colSec.pad.join('/')}`);
    await spacingOpen(ids.colSec); await page.getByRole('textbox', { name: 'Inner spacing left' }).or(page.getByRole('spinbutton', { name: 'Inner spacing left' })).first().fill('3');
    await page.waitForTimeout(400); m = await page.evaluate(measure, ['canvas', { colSec: ids.colSec }]);
    if (!(m.colSec.pad[3] > m.colSec.pad[0] && m.colSec.pad[0] > 0)) bad(`one side: left ${m.colSec.pad[3]} vs top ${m.colSec.pad[0]}`); else ok(`one side: ${m.colSec.pad.join('/')}`);
    const back = page.getByRole('button', { name: /Inner spacing — back to default/ }).first();
    if (!(await back.isEnabled().catch(() => false))) bad('"Back to default" is not offered after a change'); else { await back.click(); await page.waitForTimeout(400); m = await page.evaluate(measure, ['canvas', { colSec: ids.colSec }]); if (new Set(m.colSec.pad).size > 2) bad(`Back to default left ${m.colSec.pad.join('/')}`); else ok(`Back to default → ${m.colSec.pad.join('/')}`); }
    // c-24: two blocks selected, the bulk slider reads what they have
    // several blocks are selected by DRAGGING A BOX around them from the empty canvas (there is no shift-click)
    await page.keyboard.press('Escape'); const hb = await page.locator(`[data-box-id="${ids.head}"]`).boundingBox(); const tb = await page.locator(`[data-box-id="${ids.text}"]`).boundingBox();
    const pg = await page.locator('[data-box-id]').first().boundingBox();
    await page.mouse.move(pg.x - 20, hb.y - 4); await page.mouse.down(); await page.mouse.move(tb.x + tb.width + 10, tb.y + tb.height + 2, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(600);
    const bulk = await page.locator('text=/^Inner spacing: /').first().textContent().catch(() => null);
    if (bulk == null) bad('c-24: the bulk inspector did not open for two blocks'); else if (!/: 0rem/.test(bulk)) bad(`c-24: two plain blocks read "${bulk}"`); else ok(`c-24: "${bulk}"`);
    await page.screenshot({ path: path.join(OUT, 'bulk.png') }); await page.keyboard.press('Escape');

    // ── CANVAS at every rung, then the PREVIEW ──
    for (const [w, preset] of RUNGS) { await page.getByRole('button', { name: preset }).first().click(); await page.waitForTimeout(800); const c = await page.evaluate(measure, ['canvas', ids]); check('canvas', w, c); await page.screenshot({ path: path.join(OUT, `canvas-${w}.png`), fullPage: true }); }
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h'); await page.waitForTimeout(400);
    const html = await (await page.$('iframe')).getAttribute('srcdoc') || ''; fs.writeFileSync(path.join(OUT, 'export.html'), html);
    const pxSpace = (html.match(/padding[a-z-]*:\s*[\d.]+px|[^-]gap:\s*[\d.]+px/g) || []).filter((d) => !/:\s*0px/.test(d));
    if (pxSpace.length) bad(`exported CSS has pixel spacing: ${[...new Set(pxSpace)].slice(0, 5).join(' · ')}`); else ok('exported CSS: no pixel spacing');
    for (const [w] of RUNGS) {
      await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(500);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: w + (w - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
      const p = await f.evaluate(measure, ['preview', ids]); check('Preview', w, p);
      if (w === 375) { console.log(`  gutter at 375: heading words ${p.head.words?.l.toFixed(1)}px from the left`); }
      await page.screenshot({ path: path.join(OUT, `preview-${w}.png`) });
    }
    // 150% browser text: the default space grows
    await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(400);
    let f = await (await page.$('iframe')).contentFrame(); const at100 = await f.evaluate(measure, ['preview', { stackSec: ids.stackSec }]);
    await f.evaluate(() => { document.documentElement.style.fontSize = '150%'; }); await page.waitForTimeout(400);
    const at150 = await f.evaluate(measure, ['preview', { stackSec: ids.stackSec }]);
    if (!(at150.stackSec.pad[0] > at100.stackSec.pad[0] && at150.stackSec.pad[1] > at100.stackSec.pad[1])) bad(`150% text: section space ${at100.stackSec.pad.join('/')} → ${at150.stackSec.pad.join('/')} did not grow`); else ok(`150% text: ${at100.stackSec.pad.join('/')} → ${at150.stackSec.pad.join('/')}`);
  } catch (e) { bad('CRASH ' + e.message.split('\n')[0] + ' at ' + (page.__step || '?')); await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  if (errs.length) bad('page errors: ' + [...new Set(errs)].join(' | '));
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ theme: THEME, findings, saw }, null, 1));
  console.log(`\nHEADED UAT S-1 · ${THEME}: ${findings.length} findings, ${saw.length} checks passed`);
  await browser.close();
})();
