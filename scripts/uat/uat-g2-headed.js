// HEADED UAT — BATCH G-2 · layout guides + the page-grid panel (RULE X / Y / Z). Six windows side by side, each page BUILT
// THROUGH THE UI, the real Preview read at EVERY screen of scripts/uat/screens.js. Checklist: docs/TASK_TREE.md BATCH G-2.
//   A  U1 + U3  the three entry points (switch · Shift G · right-click), Shift G typed into a text field, remembered on reload
//   B  U2 + U4  the guides at every canvas device: lines on the block edges, side strips = the section's padding, span chips
//   C  U5 + U9  the panel (editor theme Midnight): columns per screen, one Undo, reload keeps it; panel text contrast
//   D  U6 + U9  side space 0 / 3 rem and gap 0 (editor theme Purple): canvas == Preview at all 70 screens; Reset
//   E  U7 + U10 a page with its own grid; keyboard only (Enter, Escape returns focus) (editor theme Dark)
//   F  U8 + U9  guides ON, Preview at all 70 screens has none; guide contrast on all four WEBSITE themes
//   NODE_PATH=node_modules node scripts/uat/uat-g2-headed.js [--only=A,C]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-g2'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);

const chip = async (page, name) => { page.__step = `chip ${name}`; await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); };
const DEV = { Mobile: 'Mobile (375px)', Tablet: 'Tablet (768px)', Laptop: 'Laptop (1024px)', Desktop: 'Desktop (1280px)', Wide: 'Wide (1920px)', Full: 'Full width' };
const guideCols = (page) => page.evaluate(() => document.querySelectorAll('[data-layout-guides] > [data-guide-col]').length);
/** Every guide line's x (the columns' left edges and the last one's right edge), and the side strip widths. */
const lines = (page) => page.evaluate(() => { const g = document.querySelector('[data-layout-guides]'); if (!g) return null; const cols = [...g.children].map((c) => c.getBoundingClientRect());
  const r = g.getBoundingClientRect(); return { xs: [r.left, ...cols.map((c) => c.left), cols[cols.length - 1].right, r.right], left: cols[0].left - r.left, col: cols[0].width, scale: r.width / g.offsetWidth }; });
const rectOf = (page, id) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width }; }, id);
const chipText = (page) => page.evaluate(() => document.querySelector('[data-span-chip]')?.textContent ?? null);
const guidesBtn = (page) => page.getByRole('button', { name: 'Layout guides', exact: true }).first();
const pressed = async (page) => (await guidesBtn(page).getAttribute('aria-pressed')) === 'true';
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
async function editorTheme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
async function siteTheme(page, name) { await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(600); }
/** The panel, through the canvas right-click menu's "Page grid…" (the switch opens it too, when it turns the guides on). */
const openGrid = async (page) => { page.__step = 'open Page grid…'; const box = await page.locator('[data-canvas-scroller]').boundingBox();
  await page.mouse.click(box.x + 8, box.y + box.height - 8, { button: 'right' }); await page.getByRole('menuitem', { name: 'Page grid…' }).click(); await page.waitForSelector('[role="dialog"][aria-label="Page grid"]'); };
const dlg = (page) => page.getByRole('dialog', { name: 'Page grid' });
/** Contrast of an element's text against the first opaque background behind it, colours read through a canvas (OKLCH). */
const contrastOf = (el) => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgb = (s) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  let bg = null; for (let a = el; a; a = a.parentElement) { const v = rgb(getComputedStyle(a).backgroundColor); if (v[3] > 0.9) { bg = v.slice(0, 3); break; } }
  bg = bg || [255, 255, 255]; const [L1, L2] = [lum(rgb(getComputedStyle(el).color).slice(0, 3)), lum(bg)].sort((x, y) => y - x);
  return Math.round(((L1 + 0.05) / (L2 + 0.05)) * 100) / 100;
};
/** A dressed little page: heading, a half + half row, a row of three stacks with a card each. Returns the ids. */
async function build(page) {
  await H.panel(page, true);
  const s = await P.first(page, 'Stack'); const h1 = await P.into(page, s, 'Heading');
  const a = await P.under(page, s, 'Stack'); await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Image');
  const c1 = await P.under(page, a, 'Stack'); await P.into(page, c1, 'Card'); const c2 = await P.beside(page, c1, 'Stack'); await P.into(page, c2, 'Card'); const c3 = await P.beside(page, c2, 'Stack'); await P.into(page, c3, 'Card');
  await H.panel(page, false); return { s, h1, a, b, c1, c2, c3 };
}
/** The real Preview at every screen: `fn(frame, w)`. */
async function preview(page, screens, fn) {
  page.__step = 'preview';
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1200); await page.keyboard.press('h');
  for (const { w, h } of screens) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(250); f = await (await page.$('iframe')).contentFrame(); }
    await fn(f, w);
  }
  await page.setViewportSize({ width: 1240, height: 820 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
}
const pubPadLeft = (f, id) => f.evaluate((id) => { const e = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`); return e ? parseFloat(getComputedStyle(e).paddingLeft) : NaN; }, id);
const pubLeft = (f, id) => f.evaluate((id) => { const e = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`); return e ? e.getBoundingClientRect().left : NaN; }, id);
const canvasPadLeft = (page, id) => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); return parseFloat(getComputedStyle(e).paddingLeft); }, id);

const SLICES = {
  async A(page, ok) {
    ok('U3 a fresh browser: guides OFF, nothing drawn', !(await pressed(page)) && (await guideCols(page)) === 0);
    await build(page);
    await guidesBtn(page).click(); await page.waitForTimeout(400);
    // the row lines are drawn in screen space since G3-7: a 1px-tall line across the page in [data-guide-lines]
    const rowLines = () => page.evaluate(() => [...document.querySelectorAll('[data-guide-lines] > div')].some((d) => d.offsetHeight === 1 && d.offsetWidth > 20));
    ok('U2 rows are drawn with the columns by default (the user, 2026-10-04)', await rowLines());
    await dlg(page).getByLabel('Row lines in the guides').uncheck(); await page.waitForTimeout(300); ok('U5 "Row lines" unticked → columns only', !(await rowLines()));
    await dlg(page).getByLabel('Row lines in the guides').check(); await page.waitForTimeout(300);
    ok('U1 toolbar switch → guides ON (12 columns at Full width) and the panel opens', (await pressed(page)) && (await guideCols(page)) === 12 && (await dlg(page).count()) === 1);
    await guidesBtn(page).click(); await page.waitForTimeout(300); ok('U1 the switch again → guides OFF, the panel closes', (await guideCols(page)) === 0 && (await dlg(page).count()) === 0);
    await guidesBtn(page).click(); await page.keyboard.press('Escape'); await page.waitForTimeout(300); ok('U1 on again, Escape: the panel closes, the guides stay', (await guideCols(page)) === 12 && (await dlg(page).count()) === 0);
    await page.mouse.click(5, 300); await page.keyboard.press('Shift+G'); await page.waitForTimeout(400);
    ok('U1 Shift G → guides OFF', !(await pressed(page)) && (await guideCols(page)) === 0);
    await page.keyboard.press('Shift+G'); await page.waitForTimeout(400); ok('U1 Shift G again → ON', (await guideCols(page)) === 12);
    const box = await page.locator('[data-canvas-scroller]').boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + 200, { button: 'right' }); await page.waitForTimeout(400);
    const item = page.getByRole('menuitem', { name: /Hide layout guides/ });
    ok('U1 right-click on the canvas → a menu with "Hide layout guides  Shift+G"', (await item.count()) === 1 && /Shift\+G/.test(await item.innerText()));
    await item.click(); await page.waitForTimeout(400); ok('U1 right-click item → guides OFF', (await guideCols(page)) === 0);
    await page.mouse.click(box.x + box.width / 2, box.y + 200, { button: 'right' }); await page.getByRole('menuitem', { name: /Show layout guides/ }).click(); await page.waitForTimeout(400);
    ok('U1 right-click item → guides ON', (await guideCols(page)) === 12);
    await page.mouse.click(box.x + box.width / 2, box.y + 200, { button: 'right' }); await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    ok('U1 Escape closes the canvas menu', (await page.getByRole('menuitem', { name: /layout guides/ }).count()) === 0);
    await page.getByRole('button', { name: 'Page settings' }).first().click(); const name = page.getByLabel('Page name'); await name.click(); await name.press('End'); await page.keyboard.type('Gg');
    ok('U1 Shift G typed into the page name types "G", the guides stay on', /Gg$/.test(await name.inputValue()) && (await guideCols(page)) === 12, await name.inputValue());
    await page.getByRole('button', { name: 'Page settings' }).first().click();
    await page.reload(); await page.waitForTimeout(2500); ok('U3 after a reload the guides are still on', (await pressed(page)) && (await guideCols(page)) === 12);
    await page.keyboard.press('Shift+G'); await page.waitForTimeout(300); await page.reload(); await page.waitForTimeout(2500);
    ok('U3 switched off, reloaded: still off', !(await pressed(page)) && (await guideCols(page)) === 0);
  },
  async B(page, ok) {
    const id = await build(page); await guidesBtn(page).click(); await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    for (const [dev, cols] of [['Mobile', 6], ['Tablet', 12], ['Laptop', 12], ['Desktop', 12], ['Wide', 12], ['Full', 12]]) {
      await chip(page, DEV[dev]); const L = await lines(page);
      ok(`U2 ${dev}: ${cols} columns drawn`, L && L.xs.length === cols + 3, `${L && L.xs.length - 3}`);
      // (the side strip is drawn INSIDE the first and last columns since G-3 (1), the user 2026-10-04 — checked by uat-g3 slice A)
      for (const [nm, bid] of [['half', id.a], ['third', id.c1], ['full', id.s]]) {
        const r = await rectOf(page, bid); const near = (x) => Math.min(...L.xs.map((g) => Math.abs(g - x)));
        const tol = 0.5 * L.col; // a block sits on its lines up to half a gap; anything off by half a column is wrong
        ok(`U2 ${dev}: the ${nm} block's edges sit on guide lines`, near(r.l) < tol && near(r.r) < tol, `off ${near(r.l).toFixed(1)} / ${near(r.r).toFixed(1)} · column ${L.col.toFixed(1)}`);
        await H.select(page, bid); await page.waitForTimeout(250); const t = await chipText(page);
        // the columns whose middle lies inside the block (G-3 (1): edge to edge, the side space a margin inside the outer ones)
        const want = await page.evaluate(([bid, n]) => { const b = document.querySelector(`[data-box-id="${bid}"]`).getBoundingClientRect(); const m = [...document.querySelectorAll('[data-guide-col]')].map((c) => { const q = c.getBoundingClientRect(); return (q.left + q.right) / 2; }); return `${Math.max(1, m.filter((x) => x > b.left && x < b.right).length)} of ${n}`; }, [bid, cols]);
        ok(`U4 ${dev}: the ${nm} block's chip reads what is seen (${want})`, t === want, `chip "${t}"`);
        const cover = await page.evaluate((bid) => { const c = document.querySelector('[data-span-chip]')?.getBoundingClientRect(); if (!c) return 'no chip';
          const w = document.createTreeWalker(document.querySelector(`[data-box-id="${bid}"]`), NodeFilter.SHOW_TEXT); const hits = [];
          for (let n = w.nextNode(); n; n = w.nextNode()) { if (!n.textContent.trim()) continue; const r = document.createRange(); r.selectNodeContents(n);
            for (const q of r.getClientRects()) if (q.left < c.right && q.right > c.left && q.top < c.bottom && q.bottom > c.top) hits.push(n.textContent.trim().slice(0, 20)); }
          return hits.join(' | '); }, bid);
        ok(`G2-7 ${dev}: the ${nm} block's chip covers none of its words`, cover === '', cover);
      }
      await page.screenshot({ path: path.join(OUT, `B-${dev}.png`) });
    }
    await chip(page, DEV.Desktop); await H.select(page, id.a); ok('U4 Desktop: the half block reads "6 of 12"', (await chipText(page)) === '6 of 12');
    await H.select(page, id.c1); ok('U4 Desktop: a third reads "4 of 12"', (await chipText(page)) === '4 of 12');
    await guidesBtn(page).click(); await page.waitForTimeout(300); ok('U4 guides off: no chip on the selected block', (await chipText(page)) === null);
  },
  async C(page, ok) {
    const id = await build(page); await guidesBtn(page).click(); await page.keyboard.press('Escape'); await chip(page, DEV.Desktop); await H.select(page, id.h1); await openGrid(page);
    const onTop = (loc) => loc.evaluate((el) => { const r = el.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return el === hit || el.contains(hit); });
    for (const n of ['Columns on Desktop: one fewer', 'Columns on Desktop: one more']) ok(`G2-6 with a block selected under it, "${n}" is on top (nothing covers it)`, await onTop(dlg(page).getByRole('button', { name: n })));
    ok('G2-6 …and every Screen button is on top', (await Promise.all(['Phone', 'Tablet', 'Laptop', 'Desktop', 'Wide'].map((n) => onTop(dlg(page).getByRole('button', { name: n, exact: true }))))).every(Boolean));
    await page.keyboard.press('Escape'); await page.getByRole('button', { name: 'Page settings' }).first().click(); await page.waitForTimeout(300);
    ok('G2-6 Page settings opened over a selected block: its name field is on top', await onTop(page.getByLabel('Page name')));
    await page.getByRole('button', { name: 'Page grid…' }).click(); await page.waitForTimeout(300);
    ok('U1 Page settings → "Page grid…" opens the panel', (await dlg(page).count()) === 1);
    const head = await dlg(page).getByRole('heading', { name: 'Page grid' }).evaluate(contrastOf); const muted = await dlg(page).getByText('every page of this site').evaluate(contrastOf);
    ok('U9 Midnight: the panel reads (≥ 4.5:1)', head >= 4.5 && muted >= 4.5, `heading ${head} · note ${muted}`);
    const fewer = dlg(page).getByRole('button', { name: 'Columns on Desktop: one fewer' });
    await fewer.click(); await fewer.click(); await page.waitForTimeout(400);
    ok('U5 Desktop columns 12 → 10: the guides show 10', (await guideCols(page)) === 10);
    await page.keyboard.press('Escape'); await H.select(page, id.a); await page.waitForTimeout(300); ok('U5 the half block reads "5 of 10"', (await chipText(page)) === '5 of 10', await chipText(page));
    await page.mouse.click(5, 300); await page.keyboard.press('Control+z'); await page.waitForTimeout(500);
    ok('U5 ONE Undo puts the 12 back', (await guideCols(page)) === 12, `${await guideCols(page)}`);
    await page.keyboard.press('Control+y'); await page.waitForTimeout(400); ok('U5 Redo: 10 again', (await guideCols(page)) === 10);
    await chip(page, DEV.Mobile); await openGrid(page); ok('U5 at Mobile the panel opens on Phone (5 = half of 10)', (await dlg(page).getByLabel('Columns on Phone', { exact: true }).inputValue()) === '5');
    const ph = dlg(page).getByLabel('Columns on Phone', { exact: true }); await ph.fill('4'); await page.waitForTimeout(400);
    ok('U5 Phone set to 4: the Mobile guides show 4', (await guideCols(page)) === 4);
    await dlg(page).getByRole('button', { name: 'Wide', exact: true }).click(); await dlg(page).getByLabel('Columns on Wide', { exact: true }).fill('16'); await page.waitForTimeout(400); await page.keyboard.press('Escape');
    await chip(page, DEV.Wide); const w = await guideCols(page); await chip(page, DEV.Desktop); const d = await guideCols(page);
    ok('U5 Wide set to 16: Wide 16, Desktop still 10', w === 16 && d === 10, `wide ${w} · desktop ${d}`);
    await page.reload(); await page.waitForTimeout(2500); await chip(page, DEV.Wide); const w2 = await guideCols(page); await chip(page, DEV.Mobile); const m2 = await guideCols(page);
    ok('U5 after a reload: Wide 16, Mobile 4', w2 === 16 && m2 === 4, `wide ${w2} · mobile ${m2}`);
    await openGrid(page); await dlg(page).getByRole('button', { name: 'Reset to default' }).click(); await page.waitForTimeout(400); await page.keyboard.press('Escape');
    ok('U5 Reset to default: Mobile back to 6', (await guideCols(page)) === 6);
  },
  async D(page, ok) {
    const id = await build(page); await chip(page, DEV.Desktop); const before = await canvasPadLeft(page, id.s);
    await openGrid(page);
    const side = dlg(page).getByLabel('Side space (padding)'); await side.focus(); await page.keyboard.press('Home'); await page.waitForTimeout(400);
    const head = await dlg(page).getByRole('heading', { name: 'Page grid' }).evaluate(contrastOf); ok('U9 Purple: the panel reads (≥ 4.5:1)', head >= 4.5, `${head}`);
    ok('U6 side space 0 (keyboard Home) → the section padding on the canvas is 0', (await canvasPadLeft(page, id.s)) === 0, `${await canvasPadLeft(page, id.s)}`);
    await page.keyboard.press('Escape');
    let bad = [];
    await preview(page, SCREENS, async (f, w) => { const l = await pubLeft(f, id.h1); if (Math.abs(l) > 1) bad.push(`${w}: heading at ${l.toFixed(1)}`); if (await sideways(f) > 1) bad.push(`${w}: sideways`); });
    ok(`U6 side space 0 in the Preview at all ${SCREENS.length} screens: words at the page edge, no sideways scroll`, !bad.length, bad.slice(0, 6).join(' · '));
    await openGrid(page); await dlg(page).getByLabel('Side space (padding)').fill('48'); await dlg(page).getByLabel('Space between columns', { exact: true }).fill('0'); await dlg(page).getByLabel('Space between rows', { exact: true }).fill('0'); await page.waitForTimeout(400); await page.keyboard.press('Escape');
    const canvasAt = {}; for (const dev of ['Mobile', 'Desktop']) { await chip(page, DEV[dev]); canvasAt[dev] = await canvasPadLeft(page, id.s); }
    const a = await rectOf(page, id.a), b = await rectOf(page, id.b);
    ok('U6 gap 0 on the canvas: the two halves touch', Math.abs(b.l - a.r) < 1, `${(b.l - a.r).toFixed(1)}`);
    bad = []; const pubAt = {};
    await preview(page, SCREENS, async (f, w) => { pubAt[w] = await pubPadLeft(f, id.s); if (!(pubAt[w] > 0)) bad.push(`${w}: padding ${pubAt[w]}`); if (await sideways(f) > 1) bad.push(`${w}: sideways`);
      const ga = await f.evaluate(([x, y]) => { const q = (i) => document.querySelector(`.bx-${i.replace(/[^A-Za-z0-9_-]/g, '-')}`).getBoundingClientRect(); const A = q(x), B = q(y); return Math.abs(A.top - B.top) < 2 ? B.left - A.right : null; }, [id.a, id.b]);
      if (ga !== null && Math.abs(ga) > 1) bad.push(`${w}: gap ${ga.toFixed(1)}`); });
    ok(`U6 side space 3 rem + gap 0 in the Preview at all ${SCREENS.length} screens: padding > 0, halves touch, no sideways`, !bad.length, bad.slice(0, 6).join(' · '));
    ok('U6 canvas == Preview: Mobile 375 and Desktop 1280 padding', Math.abs(canvasAt.Mobile - pubAt[375]) < 0.6 && Math.abs(canvasAt.Desktop - pubAt[1280]) < 0.6, `canvas ${canvasAt.Mobile.toFixed(2)}/${canvasAt.Desktop.toFixed(2)} · preview ${pubAt[375]?.toFixed(2)}/${pubAt[1280]?.toFixed(2)}`);
    await chip(page, DEV.Desktop); await openGrid(page); await dlg(page).getByRole('button', { name: 'Reset to default' }).click(); await page.waitForTimeout(400); await page.keyboard.press('Escape');
    ok('U6 Reset: the default side space is back', Math.abs((await canvasPadLeft(page, id.s)) - before) < 0.1, `${before} → ${await canvasPadLeft(page, id.s)}`);
    await page.reload(); await page.waitForTimeout(2500); await chip(page, DEV.Desktop); ok('U6 …and after a reload', Math.abs((await canvasPadLeft(page, id.s)) - before) < 0.1);
  },
  async E(page, ok) {
    await build(page); await guidesBtn(page).click(); await page.keyboard.press('Escape'); await chip(page, DEV.Desktop);
    await page.getByRole('button', { name: 'Add page' }).first().click(); await page.waitForTimeout(800);
    await openGrid(page); await dlg(page).getByLabel('This page uses its own grid').check(); await page.waitForTimeout(300);
    ok('U7 "this page only" is said', (await dlg(page).getByText('this page only').count()) === 1);
    await dlg(page).getByLabel('Columns on Desktop', { exact: true }).fill('16'); await page.waitForTimeout(400); await page.keyboard.press('Escape');
    const own = await guideCols(page);
    await page.getByRole('group', { name: 'Pages' }).getByRole('button').first().click(); await page.waitForTimeout(800); const home = await guideCols(page);
    await page.getByRole('group', { name: 'Pages' }).getByRole('button', { name: /Page 2/ }).click(); await page.waitForTimeout(800); const back = await guideCols(page);
    ok('U7 the page with its own grid shows 16, Home 12', own === 16 && home === 12 && back === 16, `own ${own} · home ${home} · back ${back}`);
    await openGrid(page); await dlg(page).getByLabel('This page uses its own grid').uncheck(); await page.waitForTimeout(300); await page.keyboard.press('Escape');
    ok('U7 unticked: back to the site\'s 12', (await guideCols(page)) === 12);
    // U10 keyboard only
    await guidesBtn(page).focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(300); ok('U10 Enter on the switch → OFF', (await guideCols(page)) === 0);
    await page.keyboard.press('Space'); await page.waitForTimeout(400); ok('U10 Space on the switch → ON', (await guideCols(page)) === 12);
    const inside = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"][aria-label="Page grid"]'));
    ok('U10 …and the panel opens with focus inside it', inside);
    await dlg(page).getByLabel('Columns on Desktop', { exact: true }).focus(); await page.keyboard.press('ArrowUp'); await page.waitForTimeout(300);
    ok('U10 ArrowUp in the columns field → 13', (await guideCols(page)) === 13);
    const head = await dlg(page).getByRole('heading', { name: 'Page grid' }).evaluate(contrastOf); ok('U9 Dark: the panel reads (≥ 4.5:1)', head >= 4.5, `${head}`);
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    const focus = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    ok('U10 Escape closes the panel and focus returns to the switch', (await dlg(page).count()) === 0 && focus === 'Layout guides', `focus on ${focus}`);
  },
  async F(page, ok) {
    const id = await build(page); await guidesBtn(page).click(); await page.keyboard.press('Escape'); await H.select(page, id.a);
    for (const th of ['Light', 'Dark', 'Midnight', 'Purple Dream']) {
      if (th !== 'Light') await siteTheme(page, th);
      const c = await page.evaluate(() => { const col = [...document.querySelectorAll('[data-guide-lines] > div')].pop(); /* a column line, drawn in screen space (G3-7) */ const frame = document.querySelector('[data-canvas-scale]');
        const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
        const rgb = (s) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); return [...cx.getImageData(0, 0, 1, 1).data].slice(0, 3); };
        const lum = ([r, g, b]) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
        const line = rgb(getComputedStyle(col).backgroundColor), bg = rgb(getComputedStyle(frame).backgroundColor);
        const chipEl = document.querySelector('[data-span-chip]'); const cs = chipEl && getComputedStyle(chipEl);
        return { line: Math.round(ratio(line, bg) * 100) / 100, chip: cs ? Math.round(ratio(rgb(cs.color), rgb(cs.backgroundColor)) * 100) / 100 : null }; });
      ok(`U9 website theme ${th}: guide lines ≥ 3:1 against the page, chip words ≥ 4.5:1`, c.line >= 3 && c.chip >= 4.5, JSON.stringify(c));
      await page.screenshot({ path: path.join(OUT, `F-${th.replace(/\s/g, '')}.png`) });
    }
    const bad = [];
    await preview(page, SCREENS, async (f, w) => { const g = await f.evaluate(() => document.querySelectorAll('[data-layout-guides], [data-span-chip], [data-guide-col]').length); if (g) bad.push(`${w}: ${g} guide parts`); if (await sideways(f) > 1) bad.push(`${w}: sideways`); });
    ok(`U8 guides ON, the Preview at all ${SCREENS.length} screens has none, no sideways scroll`, !bad.length, bad.slice(0, 6).join(' · '));
    const html = await page.evaluate(() => [...document.querySelectorAll('iframe')].map((i) => i.srcdoc || '').join(''));
    ok('U8 nothing of the guides in the exported HTML', !/data-layout-guides|data-span-chip/.test(html));
  },
};

const WINDOWS = [['A', 'Light'], ['B', 'Light'], ['C', 'Midnight'], ['D', 'Purple Dream'], ['E', 'Dark'], ['F', 'Light']];
(async () => {
  const runs = WINDOWS.filter(([k]) => !ONLY.length || ONLY.includes(k)); const out = [];
  await Promise.all(runs.map(async ([k, th], i) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(i % 3) * 640, Math.floor(i / 3) * 520] });
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${k} · ${th}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try { await editorTheme(page, th);
      const g = await guidesBtn(page).evaluate(contrastOf);
      ok(`U9 editor theme ${th}: the "Layout guides" switch reads (≥ 4.5:1)`, g >= 4.5, `${g}`);
      const box = await page.locator('[data-canvas-scroller]').boundingBox(); await page.mouse.click(box.x + box.width / 2, box.y + 150, { button: 'right' }); await page.waitForTimeout(300);
      const m = await Promise.all((await page.getByRole('menuitem').all()).map((x) => x.evaluate(contrastOf))); await page.keyboard.press('Escape');
      ok(`U9 editor theme ${th}: the canvas menu reads (≥ 4.5:1)`, m.length === 2 && m.every((x) => x >= 4.5), m.join(' · '));
      await SLICES[k](page, ok); await page.screenshot({ path: path.join(OUT, `${k}-${th.replace(/\s/g, '')}.png`) }); }
    catch (e) { ok(`step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${k}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('page errors', false, errs.join(' | '));
    await browser.close();
  }));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
