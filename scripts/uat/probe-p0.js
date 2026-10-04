// PROBE — BATCH P-0 · MEASURE R4-1 … R4-5 THROUGH THE UI BEFORE ANY FIX (RULE Y / V). Six HEADED windows, one per slice;
// every state built from the palette and the Inspector, the Preview read at its real width. Prints REPRODUCED / NOT.
//   A  R4-1 Advanced CSS typed with Phone selected → on the phone Preview?   B  R4-1 typed with Wide selected → Preview 1920?
//   C  R4-2 grid cell "Line up (across)" vs the nine squares                 D  R4-3 "Position in row" + Floating at Phone
//   E  R4-4 the container's "Line up (across)" in a side-by-side row          F  R4-5 stored pixels in the published CSS
//   NODE_PATH=node_modules node scripts/uat/probe-p0.js [--only=A,C]
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const chip = async (page, name) => { page.__step = `chip ${name}`; await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(600); };
const pick = async (page, aria, option) => { page.__step = `pick ${aria} → ${option}`; const b = page.getByRole('button', { name: aria, exact: true }).first(); await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(200);
  await page.getByRole('listbox', { name: aria }).getByRole('option', { name: option, exact: true }).click(); await page.waitForTimeout(300); };
const canvasStyle = (page, id, prop) => page.evaluate(([id, prop]) => getComputedStyle(document.querySelector(`[data-box-id="${id}"]`))[prop], [id, prop]);
/** The real Preview at one width: the published element's computed style, and the published CSS text. */
async function preview(page, w, fn) {
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1200); await page.keyboard.press('h');
  await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(400);
  let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
  if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: 900 }); await page.waitForTimeout(300); f = await (await page.$('iframe')).contentFrame(); }
  const out = await fn(f); await page.setViewportSize({ width: 1240, height: 820 });
  await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600); return out;
}
const pubStyle = (f, id, prop) => f.evaluate(([id, prop]) => { const e = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`); return e ? getComputedStyle(e)[prop] : 'MISSING'; }, [id, prop]);
const css = (f) => f.evaluate(() => [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n'));
const advanced = async (page, id, text) => { page.__step = 'advanced css'; await H.select(page, id); await I.tab(page, 'Content'); await I.section(page, 'Advanced CSS');   // components only, Content tab
  const t = page.getByLabel('Advanced CSS', { exact: true }).first(); await t.scrollIntoViewIfNeeded(); await t.fill(text); await t.blur(); await page.waitForTimeout(400); };
const RED = 'rgb(255, 0, 0)';

const SLICES = {
  async A(page, say) { // R4-1 at Phone
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const t = await P.into(page, s, 'Accordion'); await H.panel(page, false);
    await chip(page, 'Mobile (375px)'); await advanced(page, t, 'background-color: red;');
    const cv = await canvasStyle(page, t, 'backgroundColor'); await chip(page, 'Full width');
    const p375 = await preview(page, 375, (f) => pubStyle(f, t, 'backgroundColor')); const p1280 = await preview(page, 1280, (f) => pubStyle(f, t, 'backgroundColor'));
    say(`canvas@375 ${cv} · Preview 375 ${p375} · Preview 1280 ${p1280}`, cv === RED && p375 !== RED ? 'REPRODUCED: the phone Preview drops it' : p375 === RED && p1280 !== RED ? 'NOT reproduced: works' : 'UNCLEAR');
  },
  async B(page, say) { // R4-1 at Wide, with a property the generated style also sets at that rung (direction of a row)
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const t = await P.into(page, s, 'Accordion'); await P.beside(page, t, 'Accordion'); await H.panel(page, false);
    await chip(page, 'Wide (1920px)'); await advanced(page, t, 'background-color: red;');
    const cv = await canvasStyle(page, t, 'backgroundColor'); await chip(page, 'Full width');
    const p1920 = await preview(page, 1920, (f) => pubStyle(f, t, 'backgroundColor')); const p375 = await preview(page, 375, (f) => pubStyle(f, t, 'backgroundColor'));
    say(`canvas@1920 ${cv} · Preview 1920 ${p1920} · Preview 375 ${p375}`, cv === RED && p1920 !== RED ? 'REPRODUCED: the wide Preview drops it' : p1920 === RED && p375 !== RED ? 'NOT reproduced: works' : 'UNCLEAR');
  },
  async C(page, say) { // R4-2
    await H.panel(page, true); const cell = await P.grid(page, 3, 1); const t = await P.into(page, cell, 'Text'); await H.panel(page, false);
    await I.tab(page, 'Design');
    // the grid CELL is the grid's own child that holds the dropped block (it lands in a band inside the cell)
    const cellId = await page.evaluate(([id]) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); let found = null;
      const walk = (n, gridChild) => { if (n.id === id) found = gridChild; for (const c of n.children || []) walk(c, n.layout === 'grid' ? c.id : gridChild); }; walk(s.pages[0].root, null); return found; }, [t]); void cell;
    await H.select(page, cellId); await I.tab(page, 'Design'); await I.section(page, 'Grid cell');   // the dropped block TAKES the cell's place
    await pick(page, 'Line up (across)', 'Right'); const afterLine = await canvasStyle(page, cellId, 'justifySelf');
    await I.section(page, 'Position'); await page.getByRole('button', { name: 'Middle centre', exact: true }).first().click(); await page.waitForTimeout(400);
    const afterSquare = await canvasStyle(page, cellId, 'justifySelf');
    await pick(page, 'Line up (across)', 'Left'); const afterLine2 = await canvasStyle(page, cellId, 'justifySelf');
    const shown = await page.getByRole('button', { name: 'Line up (across)', exact: true }).first().innerText();
    say(`Right → ${afterLine} · square centre → ${afterSquare} · then Left → ${afterLine2} (control shows "${shown.trim()}")`, afterLine2 !== 'start' ? 'REPRODUCED: "Left" ignored after a square was picked' : 'NOT reproduced');
  },
  async D(page, say) { // R4-3: Position in row + Floating, set at Phone
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const a = await P.into(page, s, 'Text'); await H.panel(page, false);
    const row = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).parentElement.closest('[data-box-id]').getAttribute('data-box-id'), a);
    await chip(page, 'Desktop (1280px)'); const before = await canvasStyle(page, row, 'justifyContent');
    await chip(page, 'Mobile (375px)'); await H.select(page, a); await I.tab(page, 'Design'); await I.section(page, 'Size');
    const g = page.getByRole('group', { name: 'Position in row' }); const offered = await g.count();
    if (offered) { await g.getByRole('button', { name: 'Right' }).or(g.getByRole('radio', { name: 'Right' })).first().click(); await page.waitForTimeout(400); }
    const atPhone = await canvasStyle(page, row, 'justifyContent'); await chip(page, 'Desktop (1280px)'); const atDesk = await canvasStyle(page, row, 'justifyContent');
    say(`Position in row offered: ${!!offered} · desktop before ${before} · set Right at Phone → phone ${atPhone}, desktop ${atDesk}`, offered && atDesk !== before ? 'REPRODUCED: the desktop changed too' : offered ? 'NOT reproduced' : 'UNCLEAR: control not offered here');
    await chip(page, 'Mobile (375px)'); await H.select(page, a); await I.section(page, 'Placement');
    const fl = page.getByRole('radio', { name: /^Floating/ }).or(page.getByRole('button', { name: /^Floating/ })).first();
    if (await fl.count()) { await fl.click(); await page.waitForTimeout(400); await chip(page, 'Desktop (1280px)'); const pos = await canvasStyle(page, a, 'position');
      say(`Floating set at Phone → desktop position ${pos}`, pos === 'absolute' ? 'REPRODUCED: floating on desktop too' : 'NOT reproduced'); }
  },
  async E(page, say) { // R4-4: the container label in a side-by-side row
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const img = await P.into(page, s, 'Image'); const a = await P.beside(page, img, 'Text'); await H.panel(page, false);
    const row = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).parentElement.closest('[data-box-id]').getAttribute('data-box-id'), a);
    await H.select(page, row); await I.tab(page, 'Design'); await I.section(page, 'Arrange');
    const dir = await canvasStyle(page, row, 'flexDirection'); const y0 = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().top, a);
    const x0 = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().left, a);
    await pick(page, 'Line up', 'End').catch(async () => pick(page, 'Line up', 'Bottom'));
    const y1 = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().top, a); const x1 = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().left, a);
    const label = await page.getByText(/^Line up/).first().innerText().catch(() => '?');
    say(`row direction ${dir} · label "${label}" · End moved the text across ${Math.round(x1 - x0)}px, down ${Math.round(y1 - y0)}px`, dir === 'row' && Math.abs(y1 - y0) > 2 && /across/i.test(label) ? 'REPRODUCED: says across, moves down' : 'NOT reproduced / UNCLEAR');
  },
  async F(page, say) { // R4-5
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const img = await P.into(page, s, 'Image'); const t = await P.under(page, img, 'Text'); await H.panel(page, false);
    await H.fillImages(page);
    await H.select(page, img); await I.tab(page, 'Design'); const box = page.getByRole('checkbox', { name: /Show the whole picture/ }).first();
    if (await box.count()) { await box.scrollIntoViewIfNeeded(); if (await box.isChecked()) await box.uncheck(); else { await box.check(); await box.uncheck(); } await page.waitForTimeout(300); }
    await H.select(page, t); await I.section(page, 'Size'); const h = page.getByLabel('Height', { exact: true }).first(); await h.fill('300px'); await h.blur(); await page.waitForTimeout(300);
    const pub = await preview(page, 1280, (f) => css(f));
    const px = [...new Set((pub.match(/[^;{}\n]*\b(?!1px)\d+(\.\d+)?px\b[^;{}\n]*/g) || []).map((l) => l.trim()))].filter((l) => !/^\s*(border|outline)[^:]*:\s*1px/.test(l));
    const mine = px.filter((l) => /260px|300px/.test(l));
    say(`published CSS lines with px (not 1px hairlines): ${px.length}; from the two controls: ${mine.join(' | ') || 'none'}`, mine.length ? 'REPRODUCED: stored px reach the page' : 'NOT reproduced');
    if (px.length) say(`other px lines (first 6): ${px.slice(0, 6).join(' | ')}`, 'INFO');
  },
};

(async () => {
  const keys = Object.keys(SLICES).filter((k) => !ONLY.length || ONLY.includes(k)); const report = [];
  await Promise.all(keys.map(async (k, i) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(i % 3) * 640, Math.floor(i / 3) * 520] });
    const say = (what, verdict) => { report.push(`${k}: ${verdict} — ${what}`); console.log(`[${k}] ${verdict} — ${what}`); };
    try { await SLICES[k](page, say); } catch (e) { say(`step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, 'PROBE ERROR');
      await page.screenshot({ path: require('path').join(__dirname, 'logs', `p0-error-${k}.png`) }).catch(() => {}); }
    if (errs.length) say(errs.join(' | '), 'PAGE ERRORS');
    await browser.close();
  }));
  console.log('\n' + report.sort().join('\n'));
})();
