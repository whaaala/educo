// HEADED UAT — BATCH LE-8 · one header and footer for every page (PS-2), a short page's footer at the bottom (PS-9)
// (docs/TASK_TREE.md, "BATCH LE-8", checklist U1 … U7). Every state BUILT THROUGH THE UI (RULE Y): pages added with "+", renamed
// and deleted in Page settings, blocks from the palette, "What is this block?", "On every page", "Link to page", the device buttons,
// Delete and Ctrl+Z; localStorage only READ. Six visible windows; the Preview at every width of screens.js (RULE Z).
//   header   U1 · the shared header on three pages, edited on page 3 → every page; the Preview page to page at every width; the download;
//                 the "On every page" line in four themes at four editor widths
//   footer   U2 · the shared footer; deleted on one page → gone everywhere; one Ctrl+Z → back everywhere
//   pages    U3 · a page added / duplicated after it exists has it; a renamed page's link; a deleted page's link → the Page check (LE8-3)
//   toggle   U4 · "On every page" off → own copies; on again → this page's; hidden at Mobile → hidden there on every page; LE8-1
//   menus    U5 · Main menu / Footer menu on EVERY page, sticky on every page, canvas == Preview at 375 and 1280 on each page
//   fill     U6 · PS-9 the footer at the screen's bottom at every preset; the canvas at three devices; a long page; no footer; 150 % text
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le8-headed.js [--only=header,fill]
const path = require('path'); const fs = require('fs');
const { unzipSync, strFromU8 } = require('fflate');
const H = require('./h.js'); const I = require('./inspector.js');
const { WIDTHS, SCREENS, EDGE } = require('./screens.js');
const X = require('./uat-rx3-headed.js'); const { site, sleep, deselect, at, ins, pvOpen, pvAt, pvClose, chip, choose, frame } = X;
const OUT = path.join(__dirname, 'logs', 'le8'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const THEMES = ['Light', 'Dark', 'Midnight', 'Purple'];
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
const selected = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
async function where(page, choice) { await H.panel(page, true); const b = page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: choice, exact: true }).first(); if (await b.isVisible().catch(() => false)) { await b.click(); await sleep(page, 250); } }
async function tile(page, t) {
  await H.panel(page, true); await H.clickTile(page, t);
  const g = page.locator('[role="menu"][aria-label="Choose a layout"] [aria-label="2 across, 1 down"]'); if (await g.isVisible().catch(() => false)) { await g.click(); await sleep(page, 700); }
  const d = page.locator('[role="menu"][aria-label^="Add "]').getByRole('menuitem', { name: 'Default' }); if (await d.isVisible().catch(() => false)) { await d.click(); await sleep(page, 700); }
  return selected(page);
}
async function stackWith(page, inner, n = 1, host = 'Stack') { await deselect(page); await where(page, 'End'); const s = await tile(page, host); await where(page, 'Inside'); const k = [await tile(page, inner)]; for (let i = 1; i < n; i++) { await where(page, 'After'); k.push(await tile(page, inner)); } return { s, k }; }
const pagesBar = (page) => page.getByRole('group', { name: 'Pages' });
async function goPage(page, name) { await H.panel(page, false); await pagesBar(page).getByRole('button', { name, exact: true }).first().click(); await sleep(page, 900); }
async function addPage(page) { await H.panel(page, false); await page.getByRole('button', { name: 'Add page', exact: true }).first().click(); await sleep(page, 900); }
async function pageMenu(page) { await H.panel(page, false); await page.getByRole('button', { name: 'Page settings' }).first().click(); await sleep(page, 400); }
async function words(page, id, w) { await at(page, id, 'Content'); const f = ins(page).getByLabel(/^(Text|Link text|Words)$/).first(); await f.fill(w); await f.blur(); await sleep(page, 500); }
const onCanvas = (page, id) => page.evaluate((i) => { const e = document.querySelector(`[data-box-id="${i}"]`); return e ? e.innerText.replace(/\s+/g, ' ').trim() : null; }, id);
const sharedBox = (page) => ins(page).getByRole('checkbox', { name: 'On every page' });
/** A header (a name + four Links, the last three to the pages) and, if asked, a footer (three Links), made as a person makes them. */
async function buildHeader(page, { links = true } = {}) {
  await deselect(page); await where(page, 'End'); const hdr = await tile(page, 'Side by side');
  await where(page, 'Inside'); const name = await tile(page, 'Text'); const tl = []; for (let i = 0; i < 4; i++) { await where(page, 'After'); tl.push(await tile(page, 'Link')); }
  await I.meaning(page, hdr, 'Page header');
  if (links) { const s = await site(page); for (let i = 1; i < Math.min(4, s.pages.length + 1); i++) { const p = s.pages[i] || s.pages[0]; await at(page, tl[i], 'Content'); await choose(page, 'Link to page', new RegExp(p.name)).catch(() => {}); } }
  return { hdr, name, tl };
}
async function buildFooter(page) { const f = await stackWith(page, 'Link', 3); await I.meaning(page, f.s, 'Page footer'); return f; }
const has = (s, id) => s.pages.map((p) => JSON.stringify(p.root).includes(`"id":"${id}"`));
const contrastOf = (page, w) => page.evaluate((w) => {
  const el = [...document.querySelectorAll('aside[aria-label="Inspector"] label span')].filter((e) => e.textContent.includes(w)).sort((x, y) => x.textContent.length - y.textContent.length).pop(); if (!el) return 0;
  const cx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
  const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const layers = []; for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if ((c[3] ?? 1) > 0) { layers.push(c); if ((c[3] ?? 1) >= 1) break; } }
  let bg = [255, 255, 255]; for (const c of layers.reverse()) { const a = c[3] ?? 1; bg = bg.map((v, i) => v * (1 - a) + c[i] * a); }
  const [a, b] = [lum(rgb(getComputedStyle(el).color)), lum(bg)].sort((x, y) => y - x); return +((a + 0.05) / (b + 0.05)).toFixed(2);
}, w);
async function appTheme(page, name) { const more = page.getByRole('button', { name: 'More', exact: true }); let scope = page; if (await more.isVisible().catch(() => false)) { await more.click(); scope = page.getByRole('dialog', { name: 'More' }); await sleep(page, 250); } await scope.getByRole('button', { name: 'Change theme' }).first().click(); await sleep(page, 300); await page.getByRole('menuitemradio', { name: new RegExp('^\\s*' + name) }).first().click(); await sleep(page, 500); }
async function download(page) {
  await H.panel(page, false); const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export' }).first().click()]);
  const p = path.join(OUT, `site-${Date.now()}.zip`); await dl.saveAs(p); const files = unzipSync(fs.readFileSync(p));
  return Object.fromEntries(Object.entries(files).filter(([n]) => n.endsWith('.html')).map(([n, b]) => [n, strFromU8(b)]));
}
/** In the Preview frame: the region's text, its <nav>s, and the footer's / page's geometry. */
const pvRead = (f, hdr, ftr) => f.evaluate(([h, ft]) => {
  const he = h && document.querySelector(`.bx-${h}`), fe = ft && document.querySelector(`.bx-${ft}`);
  const vis = (e) => !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0;
  return { header: vis(he) ? he.innerText.replace(/\s+/g, ' ').trim() : null, navs: [...document.querySelectorAll('nav')].filter((n) => [...n.querySelectorAll('a')].some((a) => a.getBoundingClientRect().height > 0)).map((n) => `${n.getAttribute('aria-label')}:${n.querySelectorAll('li').length}`),
    footerBottom: fe ? Math.round(fe.getBoundingClientRect().bottom + scrollY) : null, footerTop: fe ? Math.round(fe.getBoundingClientRect().top + scrollY) : null, vh: innerHeight, docH: document.documentElement.scrollHeight,
    pos: he ? (() => { for (let e = he; e && e !== document.body; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === 'sticky' || p === 'fixed') return p; } return getComputedStyle(he).position; })() : null };
}, [hdr, ftr]);

const JOBS = {
  async header(page, J) {
    await addPage(page); await addPage(page); await goPage(page, 'Home');
    const { hdr, tl } = await buildHeader(page);
    await at(page, hdr, 'Design', 'Meaning');
    rec(J, 'U1 "On every page" is ON when a block becomes the Page header', await sharedBox(page).isChecked().catch(() => false), `checkbox ${await sharedBox(page).count()} found`);
    await shot(page, 'U1-home-header');
    for (const p of ['Page 2', 'Page 3']) { await goPage(page, p); const t = await onCanvas(page, hdr); rec(J, `U1 ${p} begins with the same header on the canvas`, !!t && t.length > 5, t); await shot(page, `U1-${p.replace(' ', '')}-canvas`); }
    await goPage(page, 'Page 3'); await words(page, tl[1], 'Term dates');
    for (const p of ['Home', 'Page 2']) { await goPage(page, p); const t = await onCanvas(page, hdr); rec(J, `U1 a link changed on Page 3 reads "Term dates" on ${p}`, /Term dates/.test(t || ''), t); }
    const s = await site(page); rec(J, 'U1 stored: every page holds the one header (same block, same words)', s.pages.every((p) => JSON.stringify(p.root).includes('Term dates')), has(s, hdr).join(','));
    // the Preview: page to page by the menu, at every width
    await goPage(page, 'Home'); await chip(page, 'Desktop (1280px)'); await pvOpen(page); const bad = [];
    for (const w of WIDTHS) { const f = await pvAt(page, w); const r = await pvRead(f, hdr); if (!/Term dates/.test(r.header || '')) bad.push(`Home@${w}: ${r.header}`); }
    let f = await pvAt(page, 1280);
    await f.evaluate((id) => { const a = document.querySelector(`.bx-${id} a`) || document.querySelector(`a.bx-${id}`); a?.click(); }, tl[1]); await sleep(page, 1500);
    f = await frame(page); const title2 = await f.evaluate(() => document.title);
    for (const w of WIDTHS) { const g = await pvAt(page, w); const r = await pvRead(g, hdr); if (!/Term dates/.test(r.header || '')) bad.push(`${title2}@${w}: ${r.header}`); }
    rec(J, `U1 the Preview: Home and the page its menu opens ("${title2}") carry the header at all ${WIDTHS.length} widths`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
    await shot(page, 'U1-preview-page2-1280'); await pvClose(page, 1366);
    const files = await download(page); const names = Object.keys(files);
    rec(J, 'U1 the download: every page file carries the header and its menu (nav > ul)', names.length === 3 && names.every((n) => files[n].includes('Term dates') && /<nav class="eu-menu"[^>]*><ul/.test(files[n])), names.map((n) => `${n}:${files[n].includes('Term dates')}`).join(' '));
    // the Inspector line, four themes × four editor widths
    for (const w of [1280, 1536, 768, 375]) for (const th of THEMES) {
      await page.setViewportSize({ width: 1366, height: 860 }); await sleep(page, 300); await appTheme(page, th);
      await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 700); await at(page, hdr, 'Design', 'Meaning');
      const c = await contrastOf(page, 'One header for the whole site');
      rec(J, `U1 the "On every page" line readable — ${th} at a ${w} editor`, c >= 4.5, `${c}:1`);
      if (w === 375 || w === 1280) await shot(page, `U1-theme-${th}-${w}`);
    }
    await page.setViewportSize({ width: 1366, height: 860 }); await appTheme(page, 'Light');
  },

  async footer(page, J) {
    await addPage(page); await addPage(page); await goPage(page, 'Home');
    const f = await buildFooter(page);
    let s = await site(page); rec(J, 'U2 the footer is on all three pages', has(s, f.s).every(Boolean), has(s, f.s).join(','));
    await goPage(page, 'Page 2'); await shot(page, 'U2-page2-footer');
    await words(page, f.k[0], 'Contact us'); s = await site(page);
    rec(J, 'U2 its words changed on Page 2 are changed on every page', s.pages.every((p) => JSON.stringify(p.root).includes('Contact us')), 'ok');
    await H.select(page, f.s); await page.keyboard.press('Delete'); await sleep(page, 800); s = await site(page);
    rec(J, 'U2 deleted on Page 2 → gone from every page', has(s, f.s).every((x) => !x), has(s, f.s).join(','));
    await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 900); s = await site(page);
    rec(J, 'U2 one Ctrl+Z → back on every page', has(s, f.s).every(Boolean), has(s, f.s).join(','));
    await goPage(page, 'Page 3'); rec(J, 'U2 …and drawn on Page 3', !!(await onCanvas(page, f.s)), String(await onCanvas(page, f.s)));
    await shot(page, 'U2-after-undo');
  },

  async pages(page, J) {
    await addPage(page); await addPage(page); await goPage(page, 'Home');
    const { hdr, tl } = await buildHeader(page); const f = await buildFooter(page);
    await addPage(page); let s = await site(page); const p4 = s.pages[s.pages.length - 1];
    const k4 = p4.root.children || [];
    rec(J, 'U3 a page added AFTER: header first, footer last', JSON.stringify(k4[0]).includes(hdr) && JSON.stringify(k4[k4.length - 1]).includes(f.s), `${p4.name}: ${k4.length} blocks`);
    await shot(page, 'U3-added-page');
    await pageMenu(page); await page.getByRole('button', { name: /Duplicate/ }).first().click(); await sleep(page, 1000); s = await site(page);
    rec(J, 'U3 a duplicated page has them too', has(s, hdr).every(Boolean) && has(s, f.s).every(Boolean), `${s.pages.length} pages`);
    // rename Page 2 → News: Home's menu link opens it by its new file
    await goPage(page, 'Page 2'); await pageMenu(page); const nm = page.getByLabel('Page name').first(); await nm.fill('News'); await page.keyboard.press('Escape'); await sleep(page, 500);
    await goPage(page, 'Home'); await pvOpen(page); let fr = await pvAt(page, 1280);
    const href = await fr.evaluate((id) => (document.querySelector(`.bx-${id} a`) || document.querySelector(`a.bx-${id}`))?.getAttribute('href'), tl[1]);
    rec(J, 'U3 renamed "News": the shared menu\'s link goes to news.html', href === 'news.html', String(href)); await pvClose(page, 1366);
    // delete Page 3, which the menu links to → the Page check names the link (LE8-3)
    await goPage(page, 'Page 3'); await pageMenu(page); await page.getByRole('button', { name: /Delete page|Delete this page/ }).first().click(); await sleep(page, 400);
    await page.getByRole('button', { name: 'Delete page', exact: true }).last().click(); await sleep(page, 900);
    s = await site(page); rec(J, 'U3 Page 3 deleted', !s.pages.some((p) => p.name === 'Page 3'), s.pages.map((p) => p.name).join(', '));
    await page.getByRole('button', { name: /^Page check/ }).first().click(); const dlg = page.getByRole('dialog').filter({ hasText: 'Page check' }).first(); await dlg.waitFor();
    const gone = dlg.locator('li').filter({ hasText: 'page that was deleted' }); const n = await gone.count();
    rec(J, 'U3 LE8-3 the Page check names the link to the deleted page', n >= 1, `${n} found`); await shot(page, 'U3-pagecheck-gone');
    if (n) { await gone.first().getByRole('button', { name: 'Show me' }).click(); await sleep(page, 800); rec(J, 'U3 LE8-3 Show me selects that link', (await selected(page)) === tl[2], String(await selected(page))); }
    // LE8-2: News moved one place later in Page settings -> the tabs and the stored order follow; the shared header stays
    await goPage(page, 'News'); await pageMenu(page); await page.getByRole('button', { name: 'Move later' }).first().click(); await sleep(page, 500); await page.keyboard.press('Escape'); await sleep(page, 300);
    const tabs = (await pagesBar(page).getByRole('button').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
    s = await site(page); rec(J, 'U3 LE8-2 "Move later" moves News one place later: the page tabs and the stored order', s.pages[2]?.name === 'News' && tabs.indexOf('News') > tabs.indexOf(s.pages[1].name), `stored ${s.pages.map((p) => p.name).join(', ')} · tabs ${tabs.join(', ')}`);
    await goPage(page, s.pages[s.pages.length - 1].name); await pageMenu(page); rec(J, 'U3 LE8-2 on the last page "Move later" is off', await page.getByRole('button', { name: 'Move later' }).first().isDisabled(), 'disabled'); await shot(page, 'U3-reorder'); await page.keyboard.press('Escape');
    rec(J, 'U3 LE8-2 the shared header still on every page after the move', has(s, hdr).every(Boolean), has(s, hdr).join(','));
  },

  async toggle(page, J) {
    await addPage(page); await addPage(page); await goPage(page, 'Home');
    const { hdr, tl } = await buildHeader(page, { links: false });
    await goPage(page, 'Page 2'); await at(page, hdr, 'Design', 'Meaning'); await sharedBox(page).uncheck(); await sleep(page, 700);
    let s = await site(page); const n = (p) => { let x = null; const w = (q) => { if (q.id === hdr) x = q; (q.children || []).forEach(w); }; w(p.root); return x; };
    rec(J, 'U4 off on Page 2: every page keeps its own copy, none shared', s.pages.every((p) => n(p) && !n(p).shared), s.pages.map((p) => `${p.name}:${!!n(p)}/${!!n(p)?.shared}`).join(' '));
    await words(page, tl[0], 'Only here'); s = await site(page);
    rec(J, 'U4 an edit on Page 2 changes only Page 2', JSON.stringify(s.pages[1].root).includes('Only here') && !JSON.stringify(s.pages[0].root).includes('Only here') && !JSON.stringify(s.pages[2].root).includes('Only here'), 'ok');
    await at(page, hdr, 'Design', 'Meaning'); await sharedBox(page).check(); await sleep(page, 700); s = await site(page);
    rec(J, 'U4 on again on Page 2: its header is now the one on every page', s.pages.every((p) => JSON.stringify(p.root).includes('Only here')), 'ok');
    await shot(page, 'U4-on-again');
    // hidden at Mobile on Home → hidden at Mobile on every page; shown on the others
    await goPage(page, 'Home'); await I.phoneOnly(page, hdr, { hideOnPhone: true });
    await goPage(page, 'Page 3'); await chip(page, 'Desktop (1280px)'); await pvOpen(page); const bad = [];
    for (const w of WIDTHS) { const f = await pvAt(page, w); const r = await pvRead(f, hdr); const want = w >= EDGE.TP; if (!!r.header !== want) bad.push(`${w}:${!!r.header}`); }
    rec(J, 'U4 hidden at Mobile on Home → on Page 3 hidden below the tablet edge, shown from it (every width)', !bad.length, bad.slice(0, 4).join(' ') || 'ok');
    await pvClose(page, 1366); await chip(page, 'Mobile (375px)'); rec(J, 'U4 …and the canvas at Mobile on Page 3 does not draw it', !(await onCanvas(page, hdr)), String(await onCanvas(page, hdr))); await shot(page, 'U4-page3-mobile');
    // LE8-1: the meaning set while Mobile is edited is the page's meaning on every screen
    const b = await stackWith(page, 'Text'); await I.meaning(page, b.s, 'Page footer'); s = await site(page);
    const nb = (() => { let x = null; for (const p of s.pages) { const w = (q) => { if (q.id === b.s) x = q; (q.children || []).forEach(w); }; w(p.root); } return x; })();
    rec(J, 'U4 LE8-1 "Page footer" chosen at Mobile is stored for every screen', nb?.tag === 'footer' && !JSON.stringify(nb?.responsive || {}).includes('"tag"'), JSON.stringify({ tag: nb?.tag, responsive: nb?.responsive }));
    await chip(page, 'Desktop (1280px)'); await pvOpen(page); const f = await pvAt(page, 1280);
    const tag = await f.evaluate((id) => document.querySelector(`.bx-${id}`)?.closest('footer') ? 'footer' : document.querySelector(`.bx-${id}`)?.tagName, b.s);
    rec(J, 'U4 LE8-1 …and published as the page\'s footer at 1280', tag === 'footer', String(tag)); await pvClose(page, 1366);
  },

  async menus(page, J) {
    await addPage(page); await addPage(page); await goPage(page, 'Home');
    const { hdr, tl } = await buildHeader(page); const f = await buildFooter(page); await I.sticky(page, hdr);
    for (const name of ['Home', 'Page 2', 'Page 3']) {
      await goPage(page, name);
      const cb = {}; for (const w of [375, 1280]) { await chip(page, w === 375 ? 'Mobile (375px)' : 'Desktop (1280px)'); await deselect(page); await sleep(page, 500); cb[w] = await page.evaluate(([ids, h]) => { const z = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1; const hr = document.querySelector(`[data-box-id="${h}"]`).getBoundingClientRect(); return ids.map((i) => { const r = document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect(); return [(r.left - hr.left) / z, (r.top - hr.top) / z, r.width / z].map(Math.round); }); }, [tl, hdr]); }
      await chip(page, 'Desktop (1280px)'); await pvOpen(page); const bad = [];
      for (const w of [375, 1280]) {
        const fr = await pvAt(page, w); const r = await pvRead(fr, hdr, f.s);
        if (!(r.navs.includes('Main menu:4') && r.navs.includes('Footer menu:3'))) bad.push(`${w} navs ${r.navs.join(',')}`);
        if (r.pos !== 'sticky') bad.push(`${w} position ${r.pos}`);
        const pb = await fr.evaluate(([ids, h]) => { const hr = document.querySelector(`.bx-${h}`).getBoundingClientRect(); return ids.map((i) => { const r = document.querySelector(`.bx-${i}`).getBoundingClientRect(); return [r.left - hr.left, r.top - hr.top, r.width].map(Math.round); }); }, [tl, hdr]);
        const off = pb.filter((b, i) => b.some((v, k) => Math.abs(v - cb[w][i][k]) > 2)); if (off.length) bad.push(`${w} canvas≠Preview ${JSON.stringify(cb[w])} vs ${JSON.stringify(pb)}`);
        if (w === 375) await shot(page, `U5-${name.replace(' ', '')}-375`);
      }
      rec(J, `U5 ${name}: Main menu (4) + Footer menu (3) as nav > ul > li, the header sticky, canvas == Preview at 375 and 1280`, !bad.length, bad.join(' | ') || 'ok');
      await pvClose(page, 1366);
    }
  },

  async fill(page, J) {
    // a short Home: header, one short section, footer
    const { hdr } = await buildHeader(page, { links: false }); const body = await stackWith(page, 'Text'); const f = await buildFooter(page);
    void body; await chip(page, 'Desktop (1280px)'); await pvOpen(page); const bad = [];
    for (const s of SCREENS) { const fr = await pvAt(page, s.w, s.h); const r = await pvRead(fr, hdr, f.s); if (Math.abs(r.footerBottom - r.vh) > 1 || r.docH > r.vh + 1) bad.push(`${s.label} ${s.w}×${s.h}: footer ${r.footerBottom} of ${r.vh}, page ${r.docH}`); }
    rec(J, `U6 PS-9 a short page: the footer's bottom is the screen's bottom at all ${SCREENS.length} presets of screens.js, nothing to scroll`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
    let fr = await pvAt(page, 375, 667); await shot(page, 'U6-short-375');
    await fr.evaluate(() => { document.documentElement.style.fontSize = '150%'; }); await sleep(page, 300); let r = await pvRead(fr, hdr, f.s);
    rec(J, 'U6 at 150 % text the footer still ends the screen (375 × 667)', Math.abs(r.footerBottom - Math.max(r.vh, r.docH)) <= 1, JSON.stringify(r)); await shot(page, 'U6-short-375-150');
    fr = await pvAt(page, 1280, 800); await shot(page, 'U6-short-1280'); await pvClose(page, 1366);
    // the canvas: the footer at the bottom of the canvas view at Mobile · Tablet · Desktop
    for (const d of ['Mobile (375px)', 'Tablet (768px)', 'Desktop (1280px)']) {
      await chip(page, d); await deselect(page); await H.panel(page, false); await sleep(page, 700);
      const c = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const fr = e.closest('[data-canvas-scale]'); const z = Number(fr?.dataset.canvasScale) || 1; const root = fr.querySelector('[data-box-id]'); return { bottom: Math.round((e.getBoundingClientRect().bottom - root.getBoundingClientRect().top) / z), view: parseFloat(getComputedStyle(e).getPropertyValue('--canvas-h')) }; }, f.s);
      rec(J, `U6 the canvas at ${d}: the footer ends at the canvas view's bottom`, Math.abs(c.bottom - c.view) <= 2, JSON.stringify(c)); await shot(page, `U6-canvas-${d.split(' ')[0]}`);
    }
    // a long page: nothing added — the footer straight after the content
    await chip(page, 'Desktop (1280px)'); await addPage(page);
    const tall = []; for (let i = 0; i < 3; i++) { const t = await stackWith(page, 'Heading'); await at(page, t.s, 'Layout'); await ins(page).getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Full screen' }).first().click(); await sleep(page, 400); tall.push(t.s); }
    await pvOpen(page); const badL = [];
    for (const w of [375, 1280]) { fr = await pvAt(page, w, 800); const g = await fr.evaluate(([a, b]) => ({ end: Math.round(document.querySelector(`.bx-${a}`).getBoundingClientRect().bottom + scrollY), foot: Math.round(document.querySelector(`.bx-${b}`).getBoundingClientRect().top + scrollY) }), [tall[2], f.s]); if (Math.abs(g.end - g.foot) > 1) badL.push(`${w}: ${JSON.stringify(g)}`); }
    rec(J, 'U6 a long page: the footer follows the content, no space added (375, 1280)', !badL.length, badL.join(' | ') || 'ok'); await pvClose(page, 1366);
    // a page with no footer: "On every page" off for it, then deleted there → nothing changes
    await H.select(page, f.s); await at(page, f.s, 'Design', 'Meaning'); await sharedBox(page).uncheck(); await sleep(page, 500); await deselect(page); await H.select(page, f.s); await page.keyboard.press('Delete'); await sleep(page, 700);
    { const s2 = await site(page); rec(J, 'U6 LE8-6 Escape after the checkbox steps out; the footer deleted on this page only (not shared any more)', !JSON.stringify(s2.pages[1].root).includes(`"id":"${f.s}"`), `selected after Delete: ${await selected(page)}`); }
    await pvOpen(page); fr = await pvAt(page, 1280, 800); const nf = await fr.evaluate(() => ({ min: getComputedStyle(document.querySelector('body > div[class*="bx-"]') || document.body).minHeight, docH: document.documentElement.scrollHeight }));
    rec(J, 'U6 a page with no footer: no screen-tall floor', nf.min === '0px' || nf.min === 'auto', JSON.stringify(nf)); await pvClose(page, 1366);
    const s = await site(page); rec(J, 'U6 …and Home keeps its footer (own copy)', JSON.stringify(s.pages[0].root).includes(`"id":"${f.s}"`), 'ok');
  },
};

(async () => {
  const names = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...names];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, `${page.__step || ''} ${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
      rec(J, 'console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, names.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
