// HEADED UAT — BATCH S-2 · components breathe (docs/TASK_TREE.md → BATCHES). Built ONLY through the UI (RULE Y):
// a Card · Button · Quote · Alert one under another straight on the page; the same four inside one Stack; a Button beside
// a Card in a row; two coloured Stacks one under the other — then the first Card's Outer spacing driven (0, reload, Back
// to default, Ctrl+Z) and everything measured on the canvas AND in the Preview at every rung, with the page audit's W7.
//   NODE_PATH=node_modules node scripts/uat/probe-s2.js [--theme=Light] [--pos=0,0]
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { auditDoc } = require('./page-audit.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const THEME = arg('theme', 'Light');
const OUT = path.join(__dirname, 'probe-s2-out', THEME.replace(/\s/g, '')); fs.mkdirSync(OUT, { recursive: true });
const RUNGS = [[375, 'Mobile (375px)'], [768, 'Tablet (768px)'], [1024, 'Laptop (1024px)'], [1280, 'Desktop (1280px)'], [1920, 'Wide (1920px)']];
const findings = []; const saw = []; const bad = (m) => { findings.push(m); console.log('  FINDING ' + m); }; const ok = (m) => { saw.push(m); console.log('  saw ' + m); };

/** Each block's PAINTED box (itself if it paints, else the first thing inside that does), its margins, the page. */
const measure = ([engine, ids]) => {
  const Z = engine === 'canvas' ? (document.querySelector('[data-box-id]').closest('[data-canvas-scale]')?.dataset.canvasScale * 1 || 1) : 1;
  const el = (id) => engine === 'canvas' ? document.querySelector(`[data-box-id="${id}"]`) : document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`);
  const page = engine === 'canvas' ? document.querySelector('[data-box-id]') : document.querySelector('.eu-root') || document.body;
  const pr = page.getBoundingClientRect();
  const paints = (e) => { const cs = getComputedStyle(e); return (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.backgroundImage !== 'none' || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0 || cs.boxShadow !== 'none'; };
  const painted = (e) => { if (paints(e)) return e; for (const d of e.querySelectorAll('*')) { if (d.closest('[data-chrome-mirror],[role=toolbar]')) continue; const b = d.getBoundingClientRect(); if (b.width > 20 && b.height > 10 && paints(d)) return d; } return e; };
  const rel = (b) => ({ l: (b.left - pr.left) / Z, r: (pr.right - b.right) / Z, t: (b.top - pr.top) / Z, b: (b.bottom - pr.top) / Z, w: b.width / Z, h: b.height / Z });
  const out = {};
  for (const [k, id] of Object.entries(ids)) {
    const e = el(id); if (!e) { out[k] = { missing: true }; continue; }
    const cs = getComputedStyle(e); const p = painted(e);
    out[k] = { ...rel(p.getBoundingClientRect()), self: p === e, m: [cs.marginTop, cs.marginRight, cs.marginBottom, cs.marginLeft].map((v) => Math.round(parseFloat(v) * 10) / 10) };
  }
  const sel = document.querySelector('.outline-indigo-500'); out.__sel = sel ? { id: sel.getAttribute('data-box-id'), ...rel(sel.getBoundingClientRect()) } : null;
  out.__rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  out.__scrollX = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  return out;
};

const ON_PAGE = ['card', 'button', 'quote', 'alert'];
const IN_STACK = ['sCard', 'sButton', 'sQuote', 'sAlert'];
const check = (where, w, m, keep) => {
  const G = w < 600 ? 14 : 20; // the audit's gutter floor
  for (let i = 0; i + 1 < ON_PAGE.length; i++) {
    const a = m[ON_PAGE[i]], b = m[ON_PAGE[i + 1]]; if (!a || a.missing || !b || b.missing) { bad(`${where} ${w}: ${ON_PAGE[i]}/${ON_PAGE[i + 1]} missing`); continue; }
    const gap = b.t - a.b; keep[`gap-${i}`] = gap;
    if (gap < 10) bad(`${where} ${w}: ${ON_PAGE[i]} → ${ON_PAGE[i + 1]} painted boxes ${gap.toFixed(1)}px apart (want ~1rem + 1rem)`);
    else ok(`${where} ${w}: ${ON_PAGE[i]} → ${ON_PAGE[i + 1]} ${gap.toFixed(1)}px apart, outside the painted boxes`);
  }
  for (const k of ON_PAGE) { const x = m[k]; if (!x || x.missing) continue;
    if (x.l < G - 0.5 || x.r < G - 0.5) bad(`${where} ${w}: ${k}'s painted box ${x.l.toFixed(1)} / ${x.r.toFixed(1)}px from the page edges (floor ${G})`);
    else ok(`${where} ${w}: ${k} gutter ${x.l.toFixed(1)} / ${x.r.toFixed(1)}px`); }
  // inside ONE stack: the stack gap only — never the component's 1rem added to it
  for (let i = 0; i + 1 < IN_STACK.length; i++) {
    const a = m[IN_STACK[i]], b = m[IN_STACK[i + 1]]; if (!a || a.missing || !b || b.missing) continue;
    const gap = b.t - a.b; const rem = m.__rem;
    if (gap < 8 || gap > 1.6 * 16 * (w >= 1920 ? 1.4 : 1.2)) bad(`${where} ${w}: in a Stack ${IN_STACK[i]} → ${IN_STACK[i + 1]} ${gap.toFixed(1)}px apart (want the stack gap only, ~1rem = ${rem}px)`);
    else ok(`${where} ${w}: in a Stack ${IN_STACK[i]} → ${IN_STACK[i + 1]} ${gap.toFixed(1)}px (the stack gap)`);
    if (b.m[0] !== 0 || b.m[2] !== 0) bad(`${where} ${w}: ${IN_STACK[i + 1]} in a Stack carries margin ${b.m.join('/')}`);
  }
  // a Button beside a Card in a row: both on one line at ≥ 1024, never touching across
  if (m.rCard && m.rBtn && !m.rCard.missing && !m.rBtn.missing) {
    const oneLine = m.rBtn.t < m.rCard.b - 2 && m.rBtn.l > m.rCard.l + m.rCard.w - 2;
    if (oneLine) { const across = m.rBtn.l - (m.rCard.l + m.rCard.w); if (across < 8) bad(`${where} ${w}: Button beside Card ${across.toFixed(1)}px apart`); else ok(`${where} ${w}: Button beside Card ${across.toFixed(1)}px apart`); }
    else { const down = m.rBtn.t - m.rCard.b; if (down < 8) bad(`${where} ${w}: Button under Card (wrapped) ${down.toFixed(1)}px apart`); else ok(`${where} ${w}: row wrapped, Button ${down.toFixed(1)}px under the Card`); }
  }
  // two coloured Stacks meet edge to edge
  if (m.col1 && m.col2 && !m.col1.missing && !m.col2.missing) { const d = m.col2.t - m.col1.b; if (Math.abs(d) > 1.5) bad(`${where} ${w}: the two coloured Stacks are ${d.toFixed(1)}px apart (should meet)`); else ok(`${where} ${w}: coloured Stacks meet (${d.toFixed(1)}px)`); }
  if (m.__scrollX) bad(`${where} ${w}: the page scrolls sideways`);
};

(async () => {
  const pos = arg('pos', '0,0').split(',').map(Number);
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900, pos });
  page.setDefaultTimeout(12000); const ids = {};
  try {
    if (THEME !== 'Light') { await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(500); }
    await H.panel(page, true);
    // ONE UNDER ANOTHER, STRAIGHT ON THE PAGE
    ids.card = await P.first(page, 'Card'); ids.button = await P.tileAfter(page, ids.card, 'Button');
    ids.quote = await P.tileAfter(page, ids.button, 'Quote'); ids.alert = await P.tileAfter(page, ids.quote, 'Alert');
    // THE SAME FOUR INSIDE ONE STACK
    ids.stack = await P.tileAfter(page, ids.alert, 'Stack'); ids.sCard = await P.into(page, ids.stack, 'Card');
    ids.sButton = await P.under(page, ids.sCard, 'Button'); ids.sQuote = await P.under(page, ids.sButton, 'Quote'); ids.sAlert = await P.under(page, ids.sQuote, 'Alert');
    // A BUTTON BESIDE A CARD
    ids.rCard = await P.tileAfter(page, ids.stack, 'Card'); ids.rBtn = await P.beside(page, ids.rCard, 'Button');
    // TWO COLOURED STACKS, one under the other, words in each
    ids.col1 = await P.tileAfter(page, ids.rCard, 'Stack'); await P.into(page, ids.col1, 'Text');
    ids.col2 = await P.tileAfter(page, ids.col1, 'Stack'); await P.into(page, ids.col2, 'Text');
    await H.panel(page, false); await H.fillImages(page);
    await I.background(page, ids.col1, '#fde68a'); await I.background(page, ids.col2, '#bbf7d0');
    await page.keyboard.press('Escape');
    await page.screenshot({ path: path.join(OUT, 'built.png'), fullPage: true });
    fs.writeFileSync(path.join(OUT, 'tree.txt'), await H.tree(page));

    // SELECTION OUTLINE: on the painted box, not on the space around it
    for (const k of ['card', 'alert']) {
      await H.select(page, ids[k]); const m = await page.evaluate(measure, ['canvas', { x: ids[k] }]);
      const s = m.__sel, x = m.x;
      if (!s || Math.abs(s.t - x.t) > 2 || Math.abs(s.b - x.b) > 2 || Math.abs(s.l - x.l) > 2) bad(`the selection outline of the ${k} is not on its painted box (outline ${s && [s.l, s.t, s.b].map((v) => v.toFixed(1))} vs ${[x.l, x.t, x.b].map((v) => v.toFixed(1))})`);
      else ok(`the ${k}'s selection outline sits on its painted box`);
      await page.screenshot({ path: path.join(OUT, `selected-${k}.png`) }); await page.keyboard.press('Escape');
    }

    // ── OUTER SPACING on the first Card: default shown → 0 → reload → Back to default → Ctrl+Z ──
    const outer = async () => (await page.evaluate(measure, ['canvas', { card: ids.card }])).card.m;
    const open = async () => { await H.select(page, ids.card); await I.tab(page, 'Design'); await I.section(page, 'Spacing'); };
    await open();
    const sl = page.getByRole('slider', { name: /^Outer spacing/ }).first();
    const shown = await page.locator('text=/Default · /').allTextContents();
    if (!shown.some((t) => /Default · 1rem/.test(t))) bad(`Outer spacing does not read "Default · 1rem" (read: ${shown.join(' | ')})`); else ok(`Outer spacing reads ${shown.filter((t) => /Default/.test(t)).join(' | ')}`);
    await page.screenshot({ path: path.join(OUT, 'outer-default.png') });
    await sl.focus(); await page.keyboard.press('Home'); await page.waitForTimeout(400);
    let mm = await outer(); if (mm[0] !== 0 || mm[2] !== 0) bad(`Outer spacing 0 → the Card still has margin ${mm.join('/')}`); else ok('Outer spacing 0 → margin 0/0/0/0 on the canvas');
    await page.keyboard.press('Escape'); await page.reload(); await page.waitForSelector(`[data-box-id="${ids.card}"]`); await page.waitForTimeout(1200);
    mm = await outer(); if (mm[0] !== 0 || mm[2] !== 0) bad(`after a reload the Card set to 0 has margin ${mm.join('/')}`); else ok('after a reload the Card is still 0/0/0/0');
    await open(); const back = page.getByRole('button', { name: /Outer spacing — back to default/ }).first();
    if (!(await back.isEnabled().catch(() => false))) bad('Outer spacing: "Back to default" not offered after a change');
    else { await back.click(); await page.waitForTimeout(400); mm = await outer(); if (!(mm[0] > 10 && mm[2] > 10)) bad(`Back to default → ${mm.join('/')}`); else ok(`Back to default → ${mm.join('/')}px`); }
    await page.keyboard.press('Escape'); await page.keyboard.press('Control+z'); await page.waitForTimeout(500);
    mm = await outer(); if (mm[0] !== 0 || mm[2] !== 0) bad(`Ctrl+Z after Back to default → ${mm.join('/')} (want the 0 it came from)`); else ok('Ctrl+Z → back to 0');
    await open(); await page.getByRole('button', { name: /Outer spacing — back to default/ }).first().click(); await page.waitForTimeout(400); await page.keyboard.press('Escape');

    // ── CANVAS at every rung, then the PREVIEW at every rung, with the audit ──
    const canvasAt = {};
    for (const [w, preset] of RUNGS) { await page.getByRole('button', { name: preset }).first().click(); await page.waitForTimeout(800); const keep = {}; check('canvas', w, await page.evaluate(measure, ['canvas', ids]), keep); canvasAt[w] = keep; await page.screenshot({ path: path.join(OUT, `canvas-${w}.png`), fullPage: true }); }
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h'); await page.waitForTimeout(400);
    fs.writeFileSync(path.join(OUT, 'export.html'), await (await page.$('iframe')).getAttribute('srcdoc') || '');
    for (const [w] of RUNGS) {
      await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(500);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: w + (w - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
      const keep = {}; check('Preview', w, await f.evaluate(measure, ['preview', ids]), keep);
      for (const [k, v] of Object.entries(keep)) { const c = canvasAt[w][k]; if (c != null && Math.abs(c - v) > 4) bad(`canvas ≠ Preview at ${w}: ${k} ${c.toFixed(1)} vs ${v.toFixed(1)}px`); }
      const w7 = (await f.evaluate(`(${auditDoc.toString()})({})`)).warn.filter((x) => x.startsWith('W7'));
      if (w7.length) bad(`page audit at ${w}: ${w7.join(' · ')}`); else ok(`page audit at ${w}: no W7a/W7b on the default page`);
      await page.screenshot({ path: path.join(OUT, `preview-${w}.png`), fullPage: true });
    }
  } catch (e) { bad('CRASH ' + e.message.split('\n')[0] + ' at ' + (page.__step || '?')); await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  if (errs.length) bad('page errors: ' + [...new Set(errs)].join(' | '));
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ theme: THEME, findings, saw }, null, 1));
  console.log(`\nHEADED UAT S-2 · ${THEME}: ${findings.length} findings, ${saw.length} checks passed`);
  await browser.close(); process.exitCode = findings.length ? 1 : 0;
})();
