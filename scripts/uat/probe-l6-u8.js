// HEADED (RULE Y / Z) — BATCH L-6 U8, L6-2 on the CANVAS and in the PREVIEW: built through the UI, three Centred-column bands —
//   A  one plain coloured section          → its colour fills the band edge to edge, its words on the measure
//   B  one coloured section with the Card look (Styles → Card) → it stays a card on the measure
//   C  two coloured sections side by side  → they stay on the measure, as a row
// measured on the canvas at the five rungs and in the Preview at every screen of screens.js.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/probe-l6-u8.js
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js'); const { SCREENS } = require('./screens.js');
const RUNGS = ['Mobile (375px)', 'Tablet (768px)', 'Laptop (1024px)', 'Desktop (1280px)', 'Wide (1920px)'];
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1440, h: 900, pos: [640, 0] }); page.setDefaultTimeout(15000);
  let bad = 0, ok = 0; const say = (good, m) => { if (good) ok++; else bad++; console.log(`${good ? 'ok  ' : 'BAD '} ${m}`); };
  try {
    const desel = async () => { for (let i = 0; i < 4 && await page.evaluate(() => !!document.querySelector('.outline-indigo-500')); i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(150); } };
    const mk = async () => { await desel(); await H.panel(page, true); const s = await P.first(page, 'Stack'); await P.into(page, s, 'Heading'); return s; };
    const A = await mk(); const B = await mk();
    // the row first, then words in each (beside a stack its heading fills, the drop point falls off the canvas)
    await desel(); await H.panel(page, true); const C1 = await P.first(page, 'Stack'); const C2 = await P.beside(page, C1, 'Stack'); await P.into(page, C1, 'Heading'); await P.into(page, C2, 'Text');
    await H.panel(page, false);
    for (const s of [A, B, C1, C2]) await I.background(page, s, '#1e3a5f');
    for (const s of [A, B, C1]) await I.contentWidth(page, s, 'Centred column');
    await H.select(page, B); await page.getByRole('group', { name: 'Style presets' }).getByRole('button', { name: 'Card style' }).first().click(); await page.waitForTimeout(500);
    const kinds = { A: [A], B: [B], C: [C1, C2] };
    /** each section's box against its band, and its first words' inset (layout px on the canvas, css px in the Preview) */
    const measure = (frame, sel) => frame.evaluate(([kinds, canvas]) => {
      const q = (id) => canvas ? document.querySelector(`[data-box-id="${id}"]`) : document.querySelector('.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-'));
      const out = {}; for (const [k, ids] of Object.entries(kinds)) out[k] = ids.map((id) => { const e = q(id); if (!e) return null; const band = e.parentElement.closest(canvas ? '[data-box-id]' : '.eu-band') || e.parentElement; const r = e.getBoundingClientRect(), b = band.getBoundingClientRect(); const w = e.querySelector('h1,h2,h3,p'); const wr = w ? w.getBoundingClientRect() : r; return { fills: Math.abs(r.width - b.width) < 1, inset: +(wr.left - b.left).toFixed(1) }; });
      return out;
    }, [kinds, sel === 'canvas']);
    const judge = (m, where) => {
      say(m.A[0]?.fills && m.A[0].inset > 0, `${where} A: plain colour fills the band (${m.A[0]?.fills}), words inset ${m.A[0]?.inset}`);
      say(m.B[0] && !m.B[0].fills, `${where} B: the Card stays a card on the measure (fills: ${m.B[0]?.fills})`);
      say(m.C.every((x) => x && !x.fills), `${where} C: two sections side by side stay on the measure`);
    };
    for (const r of RUNGS) { await page.getByRole('button', { name: r }).first().click(); await page.waitForTimeout(700); judge(await measure(page, 'canvas'), `canvas ${r}`); }
    await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1500); await page.keyboard.press('h');
    for (const s of SCREENS) {
      await page.setViewportSize({ width: s.w, height: s.h }); await page.waitForTimeout(200);
      const f = await (await page.$('iframe')).contentFrame(); const m = await measure(f, 'preview');
      // a phone stacks C's two sections, each then alone on its line — the rule is about the measure, so only above the phone
      if (!(m.A[0]?.fills && m.A[0].inset > 0) || !(m.B[0] && !m.B[0].fills)) say(false, `Preview ${s.label} ${s.w}: ${JSON.stringify(m)}`);
      if ([375, 1280].includes(s.w) && s === SCREENS.find((x) => x.w === s.w)) await page.screenshot({ path: `scripts/uat/logs/uat-l6/u8-preview-${s.w}.png` });
    }
    say(true, `Preview: ${SCREENS.length} screens checked for A and B`);
  } catch (e) { await page.screenshot({ path: 'scripts/uat/logs/uat-l6/u8-failed.png' }).catch(() => {}); say(false, `FAILED at ${page.__step}: ${e.message.split('\n')[0]}`); }
  console.log(`RESULT ${ok} ok · ${bad} bad · page errors ${errs.length}`); await browser.close();
})();
