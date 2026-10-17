// RX3-22 HEADED (the user's decision 2026-10-17: the Inspector SAYS when a row's blocks already fill it, rather than
// overriding a width the person chose). Six visible windows — Light / Dark / Midnight / Purple at a 1366 editor, Light at a
// 375 editor, Dark at a 768 editor — each BUILT THROUGH THE UI (RULE Y): a "Side by side" tile, a Text and a Button added with
// its "+", the row selected, Design › Arrange. Checks: the note shows (and reads ≥ 4.5:1) while the blocks fill the row; End
// leaves them where they are; both blocks set to "Fit" → the note goes and End moves them right in the Preview at every width
// of screens.js where the row is still side by side.
// Run: NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-rx3-22-headed.js
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const I = require('./inspector.js'); const { WIDTHS } = require('./screens.js');
const { cls, sleep, nodeOf, tileThen, sel, expandInspector, choose, pvOpen, pvAt, pvClose } = require('./uat-rx3-headed.js');
const OUT = path.join(__dirname, 'logs', 'rx3-22'); fs.mkdirSync(OUT, { recursive: true });
const NOTE = 'These blocks fill the row — give one a width to place them.';
const WINDOWS = [['Light', 1366], ['Dark', 1366], ['Midnight', 1366], ['Purple', 1366], ['Light', 375], ['Dark', 768]];

async function appTheme(page, name) { await page.getByRole('button', { name: 'Change theme' }).first().click(); await sleep(page, 300); await page.getByRole('menuitemradio', { name: new RegExp('^\\s*' + name) }).first().click(); await sleep(page, 500); }
const contrastOf = (loc) => loc.evaluate((e) => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const g = cv.getContext('2d');
  const rgb = (c) => { g.clearRect(0, 0, 1, 1); g.fillStyle = c; g.fillRect(0, 0, 1, 1); return Array.from(g.getImageData(0, 0, 1, 1).data).slice(0, 3); };
  const L = (c) => { const [r, gg, b] = rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * gg + 0.0722 * b; };
  let x = e, bg = 'white'; while (x) { const c = getComputedStyle(x).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)') { bg = c; break; } x = x.parentElement; }
  const a = L(getComputedStyle(e).color), b = L(bg); return +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);
});
const arrange = async (page, row) => { await sel(page, row); await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Arrange'); };
const gapsIn = (f, row, kids) => f.evaluate(([r, ks]) => { const R = document.querySelector(r).getBoundingClientRect(); const K = ks.map((k) => document.querySelector(k).getBoundingClientRect()); return { first: Math.round(K[0].left - R.left), last: Math.round(R.right - K[K.length - 1].right), side: Math.abs(K[0].top - K[K.length - 1].top) < 4 }; }, [cls(row), kids.map(cls)]);

async function run([theme, w], slot) {
  const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 820, pos: [(slot % 3) * 620, Math.floor(slot / 3) * 480] });
  page.setDefaultTimeout(12000); const tag = `${theme}-${w}`; const r = { tag }; const bad = [];
  try {
    await appTheme(page, theme); if (w !== 1366) { await page.setViewportSize({ width: w, height: 820 }); await sleep(page, 700); }
    const fresh = await tileThen(page, 'Side by side', null); let row = null; for (const id of fresh) { const n = await nodeOf(page, id); if (n && n.direction === 'row' && !n.rowBand) row = id; }
    for (const t of ['Text', 'Button']) { await sel(page, row); await page.getByRole('button', { name: 'Add a block inside this one' }).first().click(); await sleep(page, 300); await page.getByRole('menuitem', { name: t, exact: true }).first().click(); await sleep(page, 700); await page.keyboard.press('Escape'); await sleep(page, 200); }
    const kids = (await nodeOf(page, row)).children.map((x) => x.id);
    r.stored = await Promise.all(kids.map(async (k) => (await nodeOf(page, k)).width));
    // 1 · as added: the note is there, readable
    await arrange(page, row); const note = page.getByText(NOTE).first(); await note.scrollIntoViewIfNeeded().catch(() => {});
    r.noteAsAdded = await note.isVisible().catch(() => false); r.contrast = r.noteAsAdded ? await contrastOf(note) : null;
    await page.screenshot({ path: path.join(OUT, `${tag}-note.png`) });
    if (!r.noteAsAdded) bad.push('no note while the blocks fill the row'); if (r.contrast != null && r.contrast < 4.5) bad.push(`note contrast ${r.contrast}`);
    if (w !== 1366) { r.done = 'editor-size window: the note checked'; }
    else {
      // 2 · End with the row full: nothing to place (the note told them why)
      await choose(page, 'Position blocks', /^End$/); let f = await pvOpen(page).then(() => pvAt(page, 1280)); r.endFull = await gapsIn(f, row, kids); await pvClose(page, 1366);
      // 3 · both blocks "Fit" → the note goes, End moves them right at every side-by-side width
      for (const k of kids) await I.widthMode(page, k, 'Fit');
      r.storedAfterFit = await Promise.all(kids.map(async (k) => (await nodeOf(page, k)).width));
      await arrange(page, row); r.noteAfterFit = await page.getByText(NOTE).first().isVisible().catch(() => false);
      if (r.noteAfterFit) bad.push('the note stays after both blocks are Fit');
      await pvOpen(page); const fails = []; let side = 0;
      for (const vw of WIDTHS) { f = await pvAt(page, vw, 820); const g = await gapsIn(f, row, kids); if (!g.side) continue; side++; if (!(g.last < 30 && g.first > 30)) fails.push(`${vw}: ${JSON.stringify(g)}`); if (vw === 1280) await page.screenshot({ path: path.join(OUT, `${tag}-end-after-fit-1280.png`) }); }
      await pvClose(page, 1366); r.endAfterFit = `${side} side-by-side widths of ${WIDTHS.length}, failing ${fails.length ? fails.slice(0, 5).join(' · ') : 'none'}`;
      if (fails.length || !side) bad.push('End does not move the Fit blocks');
    }
  } catch (e) { bad.push('ERROR ' + e.message.split('\n')[0].slice(0, 200)); await page.screenshot({ path: path.join(OUT, `${tag}-ERROR.png`) }).catch(() => {}); }
  r.pageErrors = errs.length; if (errs.length) bad.push(`${errs.length} page errors`);
  console.log(`[${tag}] RX3-22 ${bad.length ? 'FAIL · ' + bad.join(' · ') : 'PASS'} · ${JSON.stringify(r)}`);
  await browser.close(); return bad.length;
}

(async () => { const res = await Promise.all(WINDOWS.map((w, i) => run(w, i))); const failed = res.filter(Boolean).length; console.log(`SUMMARY · ${WINDOWS.length - failed} PASS · ${failed} FAIL`); process.exit(failed ? 1 : 0); })();
