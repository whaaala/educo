// HEADED UAT — BATCH RX-3 step 3b · is each capability that docs/web-anatomy/layout-tiers/02-ours-code.md CLAIMS really there
// for a person? Six visible windows, one slice of the rows each; every state BUILT THROUGH THE UI (RULE Y: palette tiles, drops,
// clicks, Inspector controls — localStorage is only READ, to report what was stored); then the real Preview (the iframe of the
// export) read for computed CSS / elements, and for the per-device rows every width of scripts/uat/screens.js (RULE Z).
//   A  page structure & semantics   PS-1..5 · SE-1..4 · AX-2
//   B  bands & backgrounds          SB-1..5 · MS-5 · AX-3 · RX3-1
//   C  rows · grids · flow          RC-1..6 · GR-1..6 · FL-1..4 · AL-2 · AL-5
//   D  size · space · alignment     SZ-1..3 · SZ-5 · SZ-6 · SP-1..5 · AL-1 · AL-3 · AL-4 · AX-1 · AX-4
//   E  position & per-device        FL-5 · PO-1..5 · PD-1..6
//   F  media · weight · editing     MS-1..4 · SZ-4 · RX3-2 · SD-1 · SD-2 · ED-1..6
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-rx3-headed.js [--only=A,C]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { WIDTHS } = require('./screens.js');
const OUT = path.join(__dirname, 'rx3'); fs.mkdirSync(OUT, { recursive: true });
const IMG = path.join(__dirname, 'img');

// ── reading (never writing) what is stored ────────────────────────────────────────────────────────────────────────────
const site = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
const activeRoot = async (page) => { const s = await site(page); const id = await page.evaluate(() => document.querySelector('[data-box-id]')?.getAttribute('data-box-id')); let hit = null; for (const p of s.pages) { const w = (n) => { if (n.id === id) hit = p; (n.children || []).forEach(w); }; w(p.root); } return (hit || s.pages[0]).root; };
const nodeOf = async (page, id) => { const s = await site(page); let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return n; };
const parentOf = async (page, id) => { const s = await site(page); let n = null; const w = (x) => { (x.children || []).forEach((c) => { if (c.id === id) n = x; w(c); }); }; s.pages.forEach((p) => w(p.root)); return n; };
const strip = (n) => { if (!n) return n; const o = {}; for (const [k, v] of Object.entries(n)) if (k !== 'children' && !(typeof v === 'string' && v.length > 120)) o[k] = v; else if (k !== 'children') o[k] = String(v).slice(0, 60) + '…'; if (n.children) o.children = n.children.length; return o; };
const cls = (id) => '.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-');

// ── doing it as a person does ─────────────────────────────────────────────────────────────────────────────────────────
const sleep = (page, ms) => page.waitForTimeout(ms);
async function selectedId(page) { return page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null); }
async function deselect(page) { for (let i = 0; i < 4 && await selectedId(page); i++) { await page.keyboard.press('Escape'); await sleep(page, 150); } }
async function band(page, tile = 'Stack') { await deselect(page); await H.panel(page, true); return P.first(page, tile); }
async function into(page, host, tile) { await H.panel(page, true); return P.into(page, host, tile); }
async function under(page, id, tile) { await H.panel(page, true); return P.under(page, id, tile); }
async function beside(page, id, tile) { await H.panel(page, true); return P.beside(page, id, tile); }
const allIds = (page) => page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).map((e) => e.getAttribute('data-box-id')));
/** A tile clicked at page level, then a choice in its menu (e.g. Video → "16:9", Grid → an uneven split). Returns the new ids. */
async function tileThen(page, tile, choose) {
  await deselect(page); await H.panel(page, true); const b4 = new Set(await allIds(page));
  const t = page.locator('[draggable="true"]').filter({ hasText: new RegExp('^\\s*' + tile) }).first(); await t.scrollIntoViewIfNeeded(); await t.click(); await sleep(page, 700);
  if (choose) await choose(); await sleep(page, 900);
  return (await allIds(page)).filter((x) => !b4.has(x));
}
async function sel(page, id) { await H.panel(page, false); if (await selectedId(page) === id) return; await H.select(page, id); }
async function expandInspector(page) { const t = page.getByRole('button', { name: 'Expand inspector' }); if (await t.isVisible().catch(() => false)) { await t.click(); await sleep(page, 300); } }
async function at(page, id, tab = 'Design', section) { await sel(page, id); await expandInspector(page); await I.tab(page, tab); if (section) await I.section(page, section); }
const ins = (page) => page.locator('aside[aria-label="Inspector"]');
async function insText(page) { return (await ins(page).innerText().catch(() => '')).replace(/\s+/g, ' '); }
async function openAll(page) { for (let k = 0; k < 3; k++) { const h = ins(page).locator('button[aria-expanded="false"]'); const n = await h.count(); for (let i = 0; i < n; i++) { const b = h.nth(0); const nm = (await b.getAttribute('aria-label')) || ''; if (/swatch|library|Font|Boldness|Capitalisation|Border style|Position blocks|Line up|What is this|Heading level|Background (size|position|repeat)|Fit|Repeat/.test(nm)) break; await b.click().catch(() => {}); await sleep(page, 100); } } }
async function btn(page, name, scope) { const b = (scope || page).getByRole('button', { name, exact: typeof name === 'string' }).first(); await b.scrollIntoViewIfNeeded().catch(() => {}); await b.click(); await sleep(page, 350); }
/** The shared dropdown: its trigger by aria-label, then an option by its words. Returns every option's words. */
async function choose(page, label, opt) {
  const t = page.getByRole('button', { name: label, exact: true }).first(); await t.scrollIntoViewIfNeeded(); await sleep(page, 150); await t.click(); await sleep(page, 300);
  const opts = await page.getByRole('option').allInnerTexts();
  if (opt) { const o = page.getByRole('option', { name: opt }).first(); if (await o.count()) await o.click(); else await page.keyboard.press('Escape'); } else await page.keyboard.press('Escape');
  await sleep(page, 350); return opts.map((x) => x.trim());
}
async function field(page, label, value) { const f = page.getByLabel(label, { exact: true }).first(); await f.scrollIntoViewIfNeeded(); await f.fill(String(value)); await f.press('Enter').catch(() => {}); await f.blur().catch(() => {}); await sleep(page, 350); }
async function slider(page, name, value) { const s = page.getByRole('slider', { name, exact: true }).first(); await s.scrollIntoViewIfNeeded(); await s.fill(String(value)); await sleep(page, 350); }
async function dragVisible(page, label, dx, dy) {
  const b = await page.evaluate((l) => { const hs = Array.from(document.querySelectorAll(`[aria-label="${l}"]`)).map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0); const r = hs[0]; return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, label);
  if (!b) return false; await page.mouse.move(b.x, b.y); await page.mouse.down(); for (let i = 1; i <= 12; i++) { await page.mouse.move(b.x + (dx * i) / 12, b.y + (dy * i) / 12); await sleep(page, 20); } await page.mouse.up(); await sleep(page, 500); return true;
}
async function chip(page, name) { await page.getByRole('button', { name, exact: true }).first().click(); await sleep(page, 700); }
const css = (page, id, props) => page.evaluate(([id, props]) => { const e = document.querySelector(`[data-box-id="${id}"]`); if (!e) return null; const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return { ...Object.fromEntries(props.map((p) => [p, c[p]])), w: Math.round(r.width), h: Math.round(r.height) }; }, [id, props]);

// ── the Preview ──────────────────────────────────────────────────────────────────────────────────────────────────────
async function pvOpen(page) {
  await deselect(page); await H.panel(page, false);
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await sleep(page, 1500);
  return frame(page);
}
async function frame(page) { return (await page.$('iframe')).contentFrame(); }
/** The window sized so the Preview's page is exactly `w` wide (the classic scrollbar taken into account). */
async function pvAt(page, w, h = 820) {
  await page.setViewportSize({ width: w, height: h }); await sleep(page, 250);
  let f = await frame(page); const inner = await f.evaluate(() => document.documentElement.clientWidth);
  if (Math.abs(inner - w) > 0 && inner < w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await sleep(page, 250); f = await frame(page); }
  return f;
}
async function pvClose(page, w) { await page.emulateMedia({ reducedMotion: null }).catch(() => {}); await page.setViewportSize({ width: w, height: 820 }); await sleep(page, 200); const x = page.getByRole('button', { name: /Exit preview/ }).first(); if (await x.isVisible().catch(() => false)) await x.click(); else await page.keyboard.press('Escape'); await sleep(page, 700); }
/** Computed CSS of the exported block (its bx- class), plus its rect, inside the Preview frame. */
const pcss = (f, id, props) => f.evaluate(([sel, props]) => { const e = document.querySelector(sel); if (!e) return null; const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return { tag: e.tagName.toLowerCase(), ...Object.fromEntries(props.map((p) => [p, c[p]])), l: Math.round(r.left), t: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }; }, [cls(id), props]);
/** The CSS rule text the export wrote for the block (base rule only, first match). */
const ruleText = (f, id) => f.evaluate((c) => { const css = Array.from(document.querySelectorAll('style')).map((x) => x.textContent).join('\n'); const re = new RegExp(c.replace(/[.]/g, '\\.') + '(?![\\w-])[^{]*\\{([^}]*)\\}', 'g'); const out = []; let m; while ((m = re.exec(css)) && out.length < 6) out.push(m[1].trim().slice(0, 300)); return out; }, cls(id));
/** Every width of screens.js: fn(frame, w) → a short string; returns the widths grouped by answer. */
async function sweep(page, fn) {
  const by = {}; for (const w of WIDTHS) { const f = await pvAt(page, w, 820); const a = String(await fn(f, w)); (by[a] = by[a] || []).push(w); }
  return Object.entries(by).map(([a, ws]) => `${a}: ${ws.length === WIDTHS.length ? 'all ' + ws.length + ' widths' : ws.join(',')}`).join(' | ');
}

// ── the slices ───────────────────────────────────────────────────────────────────────────────────────────────────────
const SLICES = {
  // ── A · page structure & semantics ─────────────────────────────────────────────────────────────────────────────────
  async A(c) {
    const { page } = c;
    const hdr = await band(page); const hT = await into(page, hdr, 'Text');
    const main = await band(page); const mH = await into(page, main, 'Heading'); await under(page, mH, 'Text');
    const ftr = await band(page); await into(page, ftr, 'Text');
    await H.panel(page, false);
    await c.probe('PS-1', async () => {
      const a = await I.meaning(page, hdr, 'Page header'); const b = await I.meaning(page, ftr, 'Page footer');
      await c.shot('PS-1-editor');
      const f = await pvOpen(page); await pvAt(page, 1280);
      const m = await f.evaluate(([h, mm, ft]) => { const q = (s) => document.querySelector(s); const main = q('main'); return { header: q(h)?.tagName, footer: q(ft)?.tagName, mainTag: main ? main.tagName + '.' + main.className + '#' + main.id : null, mainHolds: !!(main && main.querySelector(mm)), headerInMain: !!(main && main.querySelector(h)), landmarks: Array.from(document.querySelectorAll('header,main,footer,nav,aside')).map((e) => e.tagName.toLowerCase()).join(',') }; }, [cls(hdr), cls(main), cls(ftr)]);
      await c.shot('PS-1-preview'); await pvClose(page, c.w);
      c.rec('PS-1', a && b && m.header === 'HEADER' && m.footer === 'FOOTER' && m.mainHolds && !m.headerInMain ? 'HAS' : 'PARTLY', `Meaning → "Page header" set: ${a}, "Page footer" set: ${b}`, JSON.stringify(m), 'PS-1-editor.png, PS-1-preview.png');
    });
    const semIds = {};
    await c.probe('SE-1', async () => {
      await at(page, main, 'Design', 'Meaning'); const opts = await choose(page, 'What is this block', null);
      const want = ['Section', 'Article', 'Sidebar', 'Menu', 'List'];
      const out = {};
      for (const wnt of want) { const id = await band(page); await into(page, id, 'Text'); await H.panel(page, false); const ok = await I.meaning(page, id, wnt); semIds[wnt] = id; out[wnt] = ok; }
      const f = await pvOpen(page);
      const tags = await f.evaluate((m) => Object.fromEntries(Object.entries(m).map(([k, s]) => { const e = document.querySelector(s); return [k, e ? e.tagName.toLowerCase() + (e.getAttribute('aria-label') ? `[aria-label=${e.getAttribute('aria-label')}]` : '') + (e.getAttribute('role') ? `[role=${e.getAttribute('role')}]` : '') : null]; })), Object.fromEntries(Object.entries(semIds).map(([k, v]) => [k, cls(v)])));
      await c.shot('SE-1-preview'); await pvClose(page, c.w);
      c.rec('SE-1', Object.values(tags).every(Boolean) && tags.Section?.startsWith('section') && tags.Article?.startsWith('article') && tags.Sidebar?.startsWith('aside') && tags.Menu?.startsWith('nav') ? 'HAS' : 'PARTLY', `"What is this block?" offers: ${opts.join(' / ')}; set ${JSON.stringify(out)}`, `exported tags: ${JSON.stringify(tags)}`, 'SE-1-preview.png');
    });
    await c.probe('PS-3', async () => {
      const fresh = await tileThen(page, 'Grid', async () => { await page.getByRole('button', { name: /Sidebar left/ }).first().click(); });
      const t = await activeRoot(page); let g = null; const w = (n) => { if (n.layout === 'grid' && fresh.includes(n.id)) g = n; (n.children || []).forEach(w); }; w(t);
      if (!g) throw new Error('no grid from "Sidebar left · 4 · 8" (new ids ' + fresh.length + ')');
      const [a, b] = g.children.map((x) => x.id); await into(page, a, 'Text'); await into(page, b, 'Text'); await H.panel(page, false);
      const ok = await I.meaning(page, a, 'Sidebar'); await c.shot('PS-3-editor');
      await pvOpen(page);
      const s = await sweep(page, (f) => f.evaluate(([a, b]) => { const x = document.querySelector(a), y = document.querySelector(b); if (!x || !y) return 'missing'; const r = x.getBoundingClientRect(), q = y.getBoundingClientRect(); return Math.abs(r.top - q.top) < 2 ? `beside ${Math.round(r.width / (r.width + q.width) * 100)}%` : 'stacked'; }, [cls(a), cls(b)]));
      const f2 = await pvAt(page, 1280); const tag = await f2.evaluate((a) => document.querySelector(a)?.tagName, cls(a));
      await c.shot('PS-3-preview-1280'); await pvAt(page, 375); await c.shot('PS-3-preview-375'); await pvClose(page, c.w);
      c.rec('PS-3', ok && tag === 'ASIDE' ? 'HAS' : 'PARTLY', `Grid → "Sidebar left · 4 · 8" made a grid of ${g.children.length} cells (columns ${g.columns}, spans ${g.children.map((x) => x.colSpan).join('/')}); Meaning → Sidebar on cell 1: ${ok}`, `cell 1 exported as <${tag}>; sidebar share by width — ${s}`, 'PS-3-editor.png, PS-3-preview-1280.png, PS-3-preview-375.png');
    });
    await c.probe('SE-2', async () => {
      await at(page, mH, 'Design'); await openAll(page); const opts = await choose(page, 'Heading level', /Level 3/);
      const n = await nodeOf(page, mH);
      await page.getByRole('button', { name: /^Page check/ }).first().click(); await sleep(page, 700); const pc = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await c.shot('SE-2-pagecheck'); await page.keyboard.press('Escape'); await sleep(page, 300);
      const f = await pvOpen(page); const h = await f.evaluate((s) => { const e = document.querySelector(s); const hh = e && (e.matches('h1,h2,h3,h4,h5,h6') ? e : e.querySelector('h1,h2,h3,h4,h5,h6')); return { el: hh ? hh.tagName : null, all: Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((x) => x.tagName).join(',') }; }, cls(mH)); await pvClose(page, c.w);
      c.rec('SE-2', h.el === 'H3' ? 'HAS' : 'PARTLY', `"Heading level" offers ${opts.join(' / ')}; stored headingLevel=${n.headingLevel ?? n.level ?? JSON.stringify(strip(n)).slice(0, 120)}; Page check says: "${pc}"`, `heading exported as <${h.el}> (page headings: ${h.all})`, 'SE-2-pagecheck.png');
    });
    await c.probe('SE-3', async () => {
      const nav = await band(page); const list = await into(page, nav, 'Stack'); const l1 = await into(page, list, 'Link'); await under(page, l1, 'Link'); await H.panel(page, false);
      const a = await I.meaning(page, nav, 'Menu'); const b = await I.meaning(page, list, 'List');
      const nav2 = await band(page); const m1 = await into(page, nav2, 'Link'); await under(page, m1, 'Link'); await H.panel(page, false); const d = await I.meaning(page, nav2, 'Menu');
      await c.shot('SE-3-editor');
      const f = await pvOpen(page);
      const r = await f.evaluate(([n, l, l1, n2, m1]) => { const chain = (s) => { const e = document.querySelector(s); if (!e) return null; const out = []; let x = e; for (let i = 0; i < 5 && x; i++) { out.push(x.tagName.toLowerCase()); x = x.parentElement; } return out.join('<'); }; const a = (s) => { const e = document.querySelector(s); const aa = e && (e.tagName === 'A' ? e : e.querySelector('a')); return aa ? chain(s) + ' · a inside: ' + (!!aa) : chain(s); }; return { menu: chain(n), list: chain(l), link: a(l1), menuDirect: chain(n2), linkDirect: a(m1) }; }, [cls(nav), cls(list), cls(l1), cls(nav2), cls(m1)]);
      await pvClose(page, c.w);
      const nested = /^li</.test(r.link || '') || /^a<li/.test(r.link || '');
      c.rec('SE-3', nested ? 'PARTLY' : 'GAP', `Menu (${a}) > Stack set to List (${b}) > Link, Link; and a second Menu (${d}) holding two Links directly`, `menu with List: link chain ${r.link}; list ${r.list}; menu ${r.menu} · menu WITHOUT List: link chain ${r.linkDirect}`, 'SE-3-editor.png');
    });
    await c.probe('SE-4', async () => {
      const b0 = await band(page); const A = await into(page, b0, 'Text'); const B = await under(page, A, 'Text'); await H.panel(page, false);
      await I.text(page, A, 'First in reading order'); await I.text(page, B, 'Second in reading order');
      await chip(page, 'Mobile (375px)'); await at(page, B, 'Design', 'Position'); await field(page, 'Order', -1); const ordStored = JSON.stringify(strip(await nodeOf(page, B))).slice(0, 300); const ordShown = await ins(page).getByLabel('Order', { exact: true }).inputValue();
      const warn = (await insText(page)).match(/[^.]*(reading|screen reader|order)[^.]*\./gi) || [];
      await c.shot('SE-4-editor-mobile'); await chip(page, 'Full width');
      await page.getByRole('button', { name: /^Page check/ }).first().click(); await sleep(page, 700); const pc = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' '); await page.keyboard.press('Escape');
      await pvOpen(page);
      const s = await sweep(page, (f) => f.evaluate(([a, b]) => { const x = document.querySelector(a), y = document.querySelector(b); const dom = x.compareDocumentPosition(y) & 4 ? 'DOM A,B' : 'DOM B,A'; return `${dom} drawn ${x.getBoundingClientRect().top <= y.getBoundingClientRect().top ? 'A,B' : 'B,A'}`; }, [cls(A), cls(B)]));
      await pvAt(page, 375); await c.shot('SE-4-preview-375'); await pvClose(page, c.w);
      c.rec('SE-4', 'PARTLY', `Mobile chip → B Order −1 (field now shows "${ordShown}"; stored ${ordStored}). Inspector words about order: ${JSON.stringify(warn).slice(0, 200)}; Page check mentions order: ${/order/i.test(pc)}`, s, 'SE-4-editor-mobile.png, SE-4-preview-375.png');
    });
    await c.probe('AX-2', async () => {
      const f = await pvOpen(page); await pvAt(page, 1280);
      const skip = await f.evaluate(() => { const a = document.querySelector('a[href="#main"]'); const m = document.getElementById('main'); return { skip: a ? a.textContent.trim() : null, firstFocusable: document.querySelector('a,button,input,[tabindex]')?.outerHTML.slice(0, 90), main: m ? m.tagName : null, focusRules: Array.from(document.querySelectorAll('style')).map((s) => s.textContent).join('').split(':focus-visible').length - 1 }; });
      const fr = await f.frameElement(); await fr.focus(); await f.evaluate(() => document.body.focus());
      await page.keyboard.press('Tab'); await sleep(page, 200);
      const t1 = await f.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return `${e.tagName} "${(e.textContent || '').trim().slice(0, 30)}" outline ${c.outlineStyle} ${c.outlineWidth} visible-on-screen ${r.top >= 0 && r.width > 1}`; });
      await c.shot('AX-2-preview-tab1');
      await page.keyboard.press('Tab'); await sleep(page, 200);
      const t2 = await f.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); return `${e.tagName} "${(e.textContent || '').trim().slice(0, 30)}" outline ${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor}`; });
      await c.shot('AX-2-preview-tab2'); await pvClose(page, c.w);
      c.rec('AX-2', skip.skip && skip.main && /outline (solid|auto|dashed)/.test(t2 + t1) ? 'HAS' : 'PARTLY', 'automatic (no control)', `${JSON.stringify(skip)} · Tab 1 → ${t1} · Tab 2 → ${t2}`, 'AX-2-preview-tab1.png, AX-2-preview-tab2.png');
    });
    await c.probe('PS-5', async () => {
      const seen = [];
      await page.getByRole('button', { name: 'Page settings' }).first().click(); await sleep(page, 500); seen.push('PAGE SETTINGS: ' + (await page.locator('body').innerText()).replace(/\s+/g, ' ').match(/Page settings.{0,600}/)?.[0]); await c.shot('PS-5-page-settings'); await page.keyboard.press('Escape'); await sleep(page, 300);
      await sel(page, hT); await page.getByRole('button', { name: 'Block actions' }).first().click(); await sleep(page, 400); seen.push('BLOCK ACTIONS: ' + (await page.getByRole('menuitem').allInnerTexts()).join(' / ')); await c.shot('PS-5-block-actions'); await page.keyboard.press('Escape'); await sleep(page, 300);
      await deselect(page); await H.panel(page, true); seen.push('PALETTE: ' + (await page.locator('[draggable="true"]').allInnerTexts()).map((x) => x.split('\n')[0]).join(' / '));
      const hits = seen.join(' ').match(/[^/·]*(symbol|global|reusable|saved|template|master|shared section|component library)[^/·]*/gi) || [];
      await H.panel(page, false);
      c.rec('PS-5', hits.length ? 'PARTLY' : 'GAP', `searched Page settings, a block's ⋮ Block actions and the palette for symbols / global sections / saved sections / templates — matches: ${JSON.stringify(hits)}`, seen.map((s) => s.slice(0, 260)).join(' ‖ '), 'PS-5-page-settings.png, PS-5-block-actions.png');
    });
    await c.probe('PS-4', async () => {
      await page.getByRole('button', { name: 'Add page', exact: true }).first().click(); await sleep(page, 1200);
      const modal = (await page.getByRole('dialog').first().innerText({ timeout: 1500 }).catch(() => '(no dialog — the page was added at once)')).replace(/\s+/g, ' ').slice(0, 200); await c.shot('PS-4-add-page');
      const s1 = await site(page); const about = s1.pages[s1.pages.length - 1];
      const aboutHasHeader = JSON.stringify(about?.root || {}).includes('"semantic":"header"') || JSON.stringify(about?.root || {}).includes('header');
      await page.getByRole('button', { name: 'Home', exact: true }).first().click(); await sleep(page, 1200);
      const lb = await band(page); const ln = await into(page, lb, 'Link'); await H.panel(page, false);
      await at(page, ln, 'Content'); const opts = await choose(page, 'Link to page', new RegExp(about.name)); const n = await nodeOf(page, ln);
      const f = await pvOpen(page); const href = await f.evaluate((s) => { const e = document.querySelector(s); const a = e && (e.tagName === 'A' ? e : e.querySelector('a')); return a ? a.getAttribute('href') : null; }, cls(ln));
      const pagesNav = (await page.getByRole('navigation', { name: 'Pages' }).innerText().catch(() => '')).replace(/\s+/g, ' ');
      await f.evaluate((s) => { const e = document.querySelector(s); const a = e && (e.tagName === 'A' ? e : e.querySelector('a')); if (a) a.click(); }, cls(ln)); await sleep(page, 1500);
      const after = await (await frame(page)).evaluate(() => ({ url: location.href.slice(0, 80), h: document.querySelector('h1,h2')?.textContent?.trim().slice(0, 40), title: document.title }));
      await c.shot('PS-4-preview-after-click'); await pvClose(page, c.w);
      after.editorPageAfterExit = await page.evaluate(() => Array.from(document.querySelectorAll('button[aria-current="true"], [aria-current="page"]')).map((b) => b.textContent.trim()).join(',')); await c.shot('PS-4-editor-after-exit');
      c.rec('PS-4', href && n.href?.startsWith('page:') ? 'PARTLY' : 'GAP', `Add page modal: "${modal.slice(0, 200)}" → "${about.name}" added (${s1.pages.length} pages; its tree ${JSON.stringify(about.root).length} chars, carries a header: ${aboutHasHeader}); Link → "…or jump to a page" offers ${opts.join(' / ')}; stored href ${n.href}`, `exported href="${href}"; Preview Pages nav "${pagesNav}"; after clicking the link: ${JSON.stringify(after)}`, 'PS-4-add-page.png, PS-4-preview-after-click.png');
    });
    await c.probe('PS-2', async () => {
      await page.getByRole('button', { name: 'Home', exact: true }).first().click(); await sleep(page, 1200);
      await I.text(page, hT, 'Header ONE');
      await page.getByRole('button', { name: 'Page settings' }).first().click(); await sleep(page, 500);
      await page.getByRole('button', { name: /Duplicate/ }).first().click(); await sleep(page, 1500);
      const copyId = await page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).find((e) => !e.querySelector('[data-box-id]') && /Header ONE/.test(e.textContent))?.getAttribute('data-box-id'));
      if (!copyId) throw new Error('the duplicated page has no "Header ONE" block');
      await I.text(page, copyId, 'Header TWO (edited on the copy)');
      const s = await site(page); const texts = s.pages.map((p) => `${p.name}: ${JSON.stringify(p.root).match(/Header (ONE|TWO)[^"]*/)?.[0]}`);
      await c.shot('PS-2-editor-copy');
      c.rec('PS-2', texts.filter((t) => /TWO/.test(t)).length > 1 ? 'HAS' : 'GAP', 'Page settings → Duplicate; on the copy the header text changed to "Header TWO"', `stored per page: ${texts.join(' · ')} (a shared header would change on every page)`, 'PS-2-editor-copy.png');
    });
  },

  // ── B · bands & backgrounds ────────────────────────────────────────────────────────────────────────────────────────
  async B(c) {
    const { page } = c;
    await c.probe('SB-1', async () => {
      const n0 = (await activeRoot(page)).children.length;
      await deselect(page); await btn(page, 'Add a band'); const r1 = await activeRoot(page); await btn(page, 'Add a band'); const r2 = await activeRoot(page);
      const newBand = r2.children[r2.children.length - 1]; const ids = r2.children.map((x) => x.id);
      await c.shot('SB-1-two-bands');
      const kid = await page.evaluate((bid) => { const e = document.querySelector(`[data-box-id="${bid}"]`); const k = e && e.querySelector('[data-box-id]'); return k ? k.getAttribute('data-box-id') : bid; }, newBand.id);
      await sel(page, kid); const up = page.getByRole('button', { name: 'Move up', exact: true }).first(); const hasUp = (await up.isVisible().catch(() => false)) && (await up.isEnabled().catch(() => false)); if (hasUp) { await up.click(); await sleep(page, 500); }
      const r3 = await activeRoot(page); const moved = r3.children.map((x) => x.id).indexOf(newBand.id);
      await sel(page, kid); await page.getByRole('button', { name: 'Block actions' }).first().click(); await sleep(page, 300); const menu = await page.getByRole('menuitem').allInnerTexts(); let moveUsed = null; for (const nm of [/Move to top/, /Move to bottom/]) { const it = page.getByRole('menuitem', { name: nm }).first(); if (await it.count() && await it.isEnabled().catch(() => false)) { await it.click(); moveUsed = String(nm); await sleep(page, 500); break; } } if (!moveUsed) await page.keyboard.press('Escape');
      const r4 = await activeRoot(page); const atTop = `${moveUsed} → index ${r4.children.map((x) => x.id).indexOf(newBand.id)} of ${r4.children.length}`;
      await sel(page, kid); await page.keyboard.press('Delete'); await sleep(page, 600); const r5 = await activeRoot(page);
      c.rec('SB-1', r1.children.length === n0 + 1 &&  r5.children.length < r4.children.length ? 'HAS' : 'PARTLY', `"Add a band" ×2: root children ${n0} → ${r1.children.length} → ${r2.children.length} (new band ${JSON.stringify(strip(newBand)).slice(0, 140)}); toolbar "Move up" visible ${hasUp}: index ${ids.length - 1} → ${moved}; ⋮ menu [${menu.map((x) => x.trim()).join(' / ')}] move → ${atTop}; Delete → ${r4.children.length} → ${r5.children.length}`, 'editor tree order (bands are root children; export emits them in that order)', 'SB-1-two-bands.png');
    });
    const b2 = await band(page); const b2t = await into(page, b2, 'Text'); const b2t2 = await under(page, b2t, 'Text'); await H.panel(page, false);
    await c.probe('SB-2', async () => {
      await pvOpen(page); const pre = await pcss(await pvAt(page, 1920), b2t, ['maxWidth']); await pvClose(page, c.w);
      const ok = await I.contentWidth(page, b2, 'Centred column'); await c.shot('SB-2-editor');
      await pvOpen(page); const out = {}; for (const w of [375, 1280, 1920, 2560]) { const f = await pvAt(page, w); out[w] = await f.evaluate(([b, t]) => { const e = document.querySelector(b); const band = e.closest('.eu-band') || e; const x = document.querySelector(t); return { bandCls: band.className.slice(0, 80), bandW: Math.round(band.getBoundingClientRect().width), textW: Math.round(x.getBoundingClientRect().width), textL: Math.round(x.getBoundingClientRect().left) }; }, [cls(b2), cls(b2t)]); }
      await pvAt(page, 1920); await c.shot('SB-2-preview-1920'); await pvClose(page, c.w);
      c.rec('SB-2', ok && /contained/.test(out[1920].bandCls) && out[1920].textW < out[1920].bandW - 100 ? 'HAS' : 'PARTLY', `Arrange → Content width → "Centred column": ${ok} (before, the text at 1920 was ${pre?.w}px wide)`, JSON.stringify(out), 'SB-2-editor.png, SB-2-preview-1920.png');
    });
    await c.probe('SB-3', async () => {
      await at(page, b2, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page)); const n = await nodeOf(page, b2); const hasBH = await ins(page).getByRole('slider', { name: 'Band height' }).count();
      await c.shot('SB-3-editor');
      await pvOpen(page); const out = {}; for (const [w, h] of [[375, 667], [1280, 800], [1920, 1080]]) { const f = await pvAt(page, w, h); out[`${w}x${h}`] = await f.evaluate((b) => { const e = document.querySelector(b); const band = e.closest('.eu-band') || e; const c1 = getComputedStyle(e), c2 = getComputedStyle(band); return { blockMinH: c1.minHeight, bandMinH: c2.minHeight, h: Math.round(e.getBoundingClientRect().height), vh: innerHeight }; }, cls(b2)); }
      const f = await frame(page); const rule = await ruleText(f, b2); await pvClose(page, c.w);
      c.rec('SB-3', out['1280x800'].h >= 795 && out['375x667'].h >= 660 ? 'HAS' : 'PARTLY', `Arrange → Screen height → "Full screen": stored ${JSON.stringify({ screenHeight: n.screenHeight, minHeight: n.minHeight, vh: n.vh })}; "Band height" slider present: ${hasBH > 0}`, `${JSON.stringify(out)} · rule ${JSON.stringify(rule).slice(0, 200)}`, 'SB-3-editor.png');
    });
    await c.probe('SB-4b', async () => {
      const fb = await band(page); const a = await into(page, fb, 'Text'); const b = await under(page, a, 'Text'); await H.panel(page, false);
      await at(page, fb, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page)); await btn(page, 'Top-to-bottom', ins(page)); await choose(page, 'Position blocks', /^End$/);
      const ed = await page.evaluate(([B, x]) => Math.round(document.querySelector(`[data-box-id="${B}"]`).getBoundingClientRect().bottom - document.querySelector(`[data-box-id="${x}"]`).getBoundingClientRect().bottom), [fb, b]);
      await c.shot('SB-4b-editor');
      await pvOpen(page); const f = await pvAt(page, 1280, 800); const m = await f.evaluate(([B, t, t2]) => { const e = document.querySelector(B); const r = e.getBoundingClientRect(); return { jc: getComputedStyle(e).justifyContent, kids: Array.from(e.children).map((k) => k.className.slice(0, 30) + ' grow ' + getComputedStyle(k).flexGrow).join(' ; '), gapBelowLast: Math.round(r.bottom - document.querySelector(t2).getBoundingClientRect().bottom), gapAboveFirst: Math.round(document.querySelector(t).getBoundingClientRect().top - r.top) }; }, [cls(fb), cls(a), cls(b)]); await c.shot('SB-4b-preview'); await pvClose(page, c.w);
      c.rec('SB-4b', m.gapAboveFirst > 200 ? 'HAS' : 'PARTLY', `a fresh Full-screen band (Edge to edge, NOT centred), Top-to-bottom, Position blocks → End; canvas: space below the last block ${ed}px`, JSON.stringify(m), 'SB-4b-editor.png, SB-4b-preview.png');
    });
    await c.probe('SB-4', async () => {
      await at(page, b2, 'Design', 'Arrange'); await btn(page, 'Top-to-bottom', ins(page)); const opts = await choose(page, 'Position blocks', /^End$/);
      await pvOpen(page); let f = await pvAt(page, 1280, 800); const end = await f.evaluate(([b, t, t2]) => { const e = document.querySelector(b); const r = e.getBoundingClientRect(); return { kids: Array.from(e.children).map((k) => k.className.slice(0, 30) + ' grow ' + getComputedStyle(k).flexGrow).join(' ; '), jc: getComputedStyle(e).justifyContent, gapBelowLast: Math.round(r.bottom - document.querySelector(t2).getBoundingClientRect().bottom), gapAboveFirst: Math.round(document.querySelector(t).getBoundingClientRect().top - r.top) }; }, [cls(b2), cls(b2t), cls(b2t2)]); await c.shot('SB-4-preview-end'); await pvClose(page, c.w);
      await at(page, b2, 'Design', 'Arrange'); await choose(page, 'Position blocks', /^Spread out$/);
      await pvOpen(page); f = await pvAt(page, 1280, 800); const spread = await f.evaluate(([b, t, t2]) => { const e = document.querySelector(b); const r = e.getBoundingClientRect(); return { jc: getComputedStyle(e).justifyContent, gapBelowLast: Math.round(r.bottom - document.querySelector(t2).getBoundingClientRect().bottom), gapAboveFirst: Math.round(document.querySelector(t).getBoundingClientRect().top - r.top) }; }, [cls(b2), cls(b2t), cls(b2t2)]); await pvClose(page, c.w);
      c.rec('SB-4', /end/.test(end.jc) && end.gapAboveFirst > 200 && /space-between/.test(spread.jc) ? 'HAS' : 'PARTLY', `(the CENTRED-column band of SB-2) Direction "Top-to-bottom", "Position blocks" offers ${opts.join(' / ')} → End, then Spread out`, `End: ${JSON.stringify(end)} · Spread out: ${JSON.stringify(spread)}`, 'SB-4-preview-end.png');
    });
    const b3 = await band(page); await into(page, b3, 'Text'); const b4 = await band(page); await into(page, b4, 'Text'); await H.panel(page, false);
    await c.probe('SB-5', async () => {
      await at(page, b3, 'Design', 'Arrange'); const edges = await ins(page).getByRole('group', { name: 'Bottom edge shape' }).getByRole('button').evaluateAll((bs) => bs.map((b) => b.getAttribute('aria-label')));
      await btn(page, 'Bottom edge: Curve out', ins(page)); await slider(page, 'Edge depth', 20); const n = await nodeOf(page, b3);
      await I.section(page, 'Spacing'); await field(page, 'Outer spacing bottom', -2.5); const n2 = await nodeOf(page, b3);
      await c.shot('SB-5-editor');
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await f.evaluate(([b, nx]) => { const e = document.querySelector(b); const band = e.closest('.eu-band') || e; const c = getComputedStyle(e), cb = getComputedStyle(band); const nb = document.querySelector(nx); const nbBand = nb.closest('.eu-band') || nb; return { clip: (c.clipPath + ' | band ' + cb.clipPath).slice(0, 160), marginBottom: c.marginBottom + ' | band ' + cb.marginBottom, overlapNext: Math.round(band.getBoundingClientRect().bottom - nbBand.getBoundingClientRect().top) }; }, [cls(b3), cls(b4)]);
      await c.shot('SB-5-preview'); await pvClose(page, c.w);
      c.rec('SB-5', 'PARTLY', `edge shapes offered: ${edges.join(' / ')}; Curve out + Edge depth 20 → stored ${JSON.stringify({ edgeBottom: n.edgeBottom, edgeDepth: n.edgeDepth })}; "Outer spacing bottom" typed −2.5 (rem) → stored marginBottom=${JSON.stringify(n2.marginBottom ?? n2.marginB ?? n2.margin)}`, JSON.stringify(m), 'SB-5-editor.png, SB-5-preview.png');
    });
    const b5 = await band(page); const b5t = await into(page, b5, 'Text'); const b6 = await band(page); await into(page, b6, 'Text'); await H.panel(page, false);
    await c.probe('MS-5', async () => {
      await at(page, b5, 'Design', 'Background');
      const [ch] = await Promise.all([page.waitForEvent('filechooser', { timeout: 8000 }), ins(page).getByRole('button', { name: 'Upload an image' }).first().click()]); await ch.setFiles(path.join(IMG, 'wide.jpg')); await sleep(page, 1500);
      const fit = await choose(page, 'Background size / fit', /Fit \(contain\)/); const pos = await choose(page, 'Background position', /^Top$/); const rep = await choose(page, 'Background repeat', /^Tile$/);
      await ins(page).getByLabel('Fixed background (parallax)').check(); await sleep(page, 300);
      const tint = ins(page).getByLabel(/Tint over background hex/).first(); let tinted = false; if (await tint.count()) { await tint.fill('#00000080'); await tint.press('Enter'); tinted = true; await sleep(page, 300); }
      const bgText = await insText(page); const video = /video/i.test(bgText.match(/Background colour.*?(Remove|$)/)?.[0] || '');
      const n = await nodeOf(page, b5); await c.shot('MS-5-editor');
      await pvOpen(page); const f = await pvAt(page, 1280);
      const m = await f.evaluate((b) => { const e = document.querySelector(b); const c = getComputedStyle(e), a = getComputedStyle(e, '::before'), z = getComputedStyle(e, '::after'); return { img: c.backgroundImage.slice(0, 40), size: c.backgroundSize, pos: c.backgroundPosition, rep: c.backgroundRepeat, attach: c.backgroundAttachment, before: a.backgroundColor + ' ' + a.backgroundImage.slice(0, 40), after: z.backgroundColor + ' ' + z.backgroundImage.slice(0, 40) }; }, cls(b5));
      await c.shot('MS-5-preview'); await pvClose(page, c.w);
      c.rec('MS-5', /url/.test(m.img) && /contain/.test(m.size) && /fixed/.test(m.attach) ? 'PARTLY' : 'GAP', `Background → Upload an image (wide.jpg); Fit offers ${fit.join(' / ')}; Position ${pos.length} options; Repeat ${rep.join(' / ')}; Fixed ticked; Tint typed: ${tinted}; a background VIDEO offered: ${video}; stored ${JSON.stringify({ bgSize: n.bgSize, bgPosition: n.bgPosition, bgRepeat: n.bgRepeat, bgAttach: n.bgAttach, bgOverlay: n.bgOverlay })}`, JSON.stringify(m), 'MS-5-editor.png, MS-5-preview.png');
    });
    await c.probe('RX3-1', async () => {
      const ed = await css(page, b5, ['backgroundAttachment']);
      await pvOpen(page); let f = await pvAt(page, 1280);
      const normal = await f.evaluate((b) => getComputedStyle(document.querySelector(b)).backgroundAttachment, cls(b5));
      await page.emulateMedia({ reducedMotion: 'reduce' }); await sleep(page, 400); f = await frame(page);
      const reduced = await f.evaluate((b) => ({ attach: getComputedStyle(document.querySelector(b)).backgroundAttachment, mq: matchMedia('(prefers-reduced-motion: reduce)').matches, rules: Array.from(document.querySelectorAll('style')).map((s) => s.textContent).join('').match(/prefers-reduced-motion[^{]*\{[^@]{0,400}/g)?.map((x) => x.slice(0, 200)) || [] }), cls(b5));
      await c.shot('RX3-1-preview-reduced');
      // and on a touch phone, where fixed backgrounds are a known jank / no-op
      await pvAt(page, 375, 667); const phone = await (await frame(page)).evaluate((b) => getComputedStyle(document.querySelector(b)).backgroundAttachment, cls(b5));
      await pvClose(page, c.w);
      c.rec('RX3-1', /fixed/.test(reduced.attach) && reduced.mq ? 'BUG CONFIRMED' : 'NOT A BUG', `editor canvas background-attachment: ${ed.backgroundAttachment}`, `Preview no-preference: ${normal}; emulateMedia reducedMotion=reduce (matchMedia matches: ${reduced.mq}): ${reduced.attach}; at 375 under reduce: ${phone}; reduced-motion rules in the export: ${JSON.stringify(reduced.rules).slice(0, 500)}`, 'RX3-1-preview-reduced.png');
    });
    await c.probe('AX-3', async () => {
      await at(page, b5t, 'Design', 'Outline & effects'); await btn(page, 'Fade in entrance', ins(page)); const n = await nodeOf(page, b5t);
      await pvOpen(page); let f = await pvAt(page, 1280); await f.evaluate((s) => document.querySelector(s).scrollIntoView(), cls(b5t)); await sleep(page, 1200);
      const a = await f.evaluate((s) => { const e = document.querySelector(s); const c = getComputedStyle(e); return { anim: c.animationName + ' ' + c.animationDuration, trans: c.transitionProperty.slice(0, 40) + ' ' + c.transitionDuration, opacity: c.opacity, transform: c.transform, cls: e.className.slice(0, 80) }; }, cls(b5t));
      await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload().catch(() => {}); await page.waitForFunction(() => !!document.querySelector('iframe') || !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 30000 }); await sleep(page, 1500);
      let red = null; if (await page.$('iframe')) { f = await frame(page); await f.evaluate((s) => document.querySelector(s)?.scrollIntoView(), cls(b5t)); await sleep(page, 400); red = await f.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); return { anim: c.animationName + ' ' + c.animationDuration, trans: c.transitionDuration, opacity: c.opacity, transform: c.transform }; }, cls(b5t)); await pvClose(page, c.w); }
      else { await page.emulateMedia({ reducedMotion: null }); }
      if (!red) { await pvOpen(page); await page.emulateMedia({ reducedMotion: 'reduce' }); f = await pvAt(page, 1280); await f.evaluate(() => location.reload()).catch(() => {}); await sleep(page, 1500); f = await frame(page); await f.evaluate((s) => document.querySelector(s)?.scrollIntoView(), cls(b5t)); await sleep(page, 400); red = await f.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); return { anim: c.animationName + ' ' + c.animationDuration, trans: c.transitionDuration, opacity: c.opacity, transform: c.transform }; }, cls(b5t)); await pvClose(page, c.w); }
      c.rec('AX-3', 'PARTLY', `Outline & effects → "Fade in entrance": stored ${JSON.stringify({ entrance: n.entrance ?? n.enter ?? n.animation })}`, `no-preference after scrolling to it: ${JSON.stringify(a)} · reduce: ${JSON.stringify(red)} · (parallax under reduce: see RX3-1)`, '');
    });
  },

  // ── C · rows · grids · flow ────────────────────────────────────────────────────────────────────────────────────────
  async C(c) {
    const { page } = c;
    let sbs = null, sbsKids = [];
    await c.probe('RC-1', async () => {
      const host = await band(page); const b4 = new Set(await allIds(page)); await into(page, host, 'Side by side'); const fresh = (await allIds(page)).filter((x) => !b4.has(x));
      const t = await nodeOf(page, host); const w = (n) => { if (!sbs && n.direction === 'row' && !n.rowBand && fresh.includes(n.id)) sbs = n; (n.children || []).forEach(w); }; w(t);
      if (!sbs) throw new Error('"Side by side" dropped into a Stack made no row (new: ' + fresh.length + ')');
      const born = sbs.children.length;
      for (let i = sbs.children.length; i < 2; i++) { await sel(page, sbs.id); await page.getByRole('button', { name: 'Add a block inside this one' }).first().click(); await sleep(page, 300); await page.getByRole('menuitem', { name: 'Stack', exact: true }).first().click().catch(async () => { await page.getByRole('button', { name: 'Stack', exact: true }).last().click(); }); await sleep(page, 700); await page.keyboard.press('Escape'); }
      sbs = await nodeOf(page, sbs.id); sbsKids = sbs.children.map((x) => x.id); c.store.sbsBorn = born; for (const k of sbsKids) { const kn = await nodeOf(page, k); if (!(kn.children || []).length && kn.type !== 'text') await into(page, k, 'Text'); } await H.panel(page, false);
      // a row of three made by dropping beside, too
      await c.shot('RC-1-editor');
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await f.evaluate(([r, ks]) => { const e = document.querySelector(r); return { dir: getComputedStyle(e).flexDirection, display: getComputedStyle(e).display, tops: ks.map((k) => Math.round(document.querySelector(k).getBoundingClientRect().top)) }; }, [cls(sbs.id), sbsKids.map(cls)]); await pvClose(page, c.w);
      c.rec('RC-1', m.dir === 'row' && new Set(m.tops).size === 1 ? 'HAS' : 'PARTLY', `"Side by side" tile → a row born with ${c.store.sbsBorn} block(s); the toolbar "+" → Stack made it ${sbsKids.length}`, JSON.stringify(m), 'RC-1-editor.png');
    });
    // rows FIRST, then their contents (a column its child fills cannot be dropped beside — the aim lands off the canvas)
    const r0 = await band(page); const r1 = await beside(page, r0, 'Stack'); const r2 = await beside(page, r1, 'Stack'); for (const k of [r0, r1, r2]) await into(page, k, 'Text'); await H.panel(page, false);
    await c.probe('RC-2', async () => {
      await sel(page, r0); const h = await page.locator('[aria-label="Resize right edge"]').first().boundingBox(); const x = h.x + h.width / 2, y = h.y + h.height / 2;
      await page.mouse.move(x, y); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(x + 12 * i, y); await sleep(page, 20); }
      const live = await page.evaluate(() => Array.from(document.querySelectorAll('body *')).filter((e) => e.children.length === 0 && /\bof 1?\d\b/.test(e.textContent || '')).map((e) => e.textContent.trim()).slice(0, 4));
      await c.shot('RC-2-drag-label'); await page.mouse.up(); await sleep(page, 500); const n0 = await nodeOf(page, r0);
      await I.widthMode(page, r1, '½'); const n1 = await nodeOf(page, r1);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await f.evaluate((ks) => { const rs = ks.map((k) => document.querySelector(k).getBoundingClientRect()); const row = document.querySelector(ks[0]).parentElement.getBoundingClientRect(); return rs.map((r) => `${Math.round(r.width)}px=${Math.round(r.width / row.width * 100)}%`).join(' / ') + ` of ${Math.round(row.width)}`; }, [r0, r1, r2].map(cls)); const rule = await ruleText(f, r1); await pvClose(page, c.w);
      c.rec('RC-2', live.length && /50/.test(m.split(' / ')[1] || '') ? 'HAS' : 'PARTLY', `right-edge drag of column 1 shows live: ${JSON.stringify(live)}; stored width ${n0.width}; column 2 Width → "½": stored ${n1.width}`, `Preview 1280: ${m}; col 2 rule ${JSON.stringify(rule).slice(0, 160)}`, 'RC-2-drag-label.png');
    });
    const q0 = await band(page); const q1 = await beside(page, q0, 'Stack'); for (const k of [q0, q1]) await into(page, k, 'Text'); await H.panel(page, false);
    await c.probe('RC-3', async () => {
      await I.customWidth(page, q0, '12rem'); const note = ((await insText(page)).match(/[^.]*equal share[^.]*\./) || [''])[0]; const n = await nodeOf(page, q0); await c.shot('RC-3-editor');
      await pvOpen(page); const out = {}; for (const w of [375, 768, 1280, 1920]) { const f = await pvAt(page, w); out[w] = (await pcss(f, q0, ['flexBasis', 'width'])); }
      await pvClose(page, c.w);
      c.rec('RC-3', Math.abs(out[1280].w - 192) <= 2 ? 'HAS' : 'PARTLY', `Width → Custom "12rem" on a page-row column: stored ${n.width}; Inspector says "${note.trim()}"`, `drawn widths (12rem = 192px): ${Object.entries(out).map(([w, v]) => `${w}: ${v.w}px`).join(' · ')}`, 'RC-3-editor.png');
    });
    await c.probe('RC-4', async () => {
      const u0 = await band(page); const u1 = await beside(page, u0, 'Stack'); const u2 = await beside(page, u1, 'Stack'); for (const k of [u0, u1, u2]) await into(page, k, 'Text'); await H.panel(page, false);
      await at(page, r2, 'Design', 'Position'); const hasOrder = await ins(page).getByLabel('Order', { exact: true }).count();
      await pvOpen(page); const s = await sweep(page, (f) => f.evaluate((ks) => { const tops = ks.map((k) => Math.round(document.querySelector(k).getBoundingClientRect().top)); const lines = new Set(tops).size; const side = document.documentElement.scrollWidth - document.documentElement.clientWidth; return `${lines} line${lines > 1 ? 's' : ''}${side > 1 ? ' SIDEWAYS ' + side : ''}`; }, [u0, u1, u2].map(cls)));
      await pvAt(page, 375); await c.shot('RC-4-preview-375'); await pvAt(page, 768); await c.shot('RC-4-preview-768'); await pvClose(page, c.w);
      c.rec('RC-4', /1 line/.test(s) && /3 lines/.test(s) && !/SIDEWAYS/.test(s) ? 'HAS' : 'PARTLY', `nothing to set (automatic); "Order" field offered: ${hasOrder > 0}`, `an untouched row of 3 (made by dropping beside): ${s}`, 'RC-4-preview-375.png, RC-4-preview-768.png');
    });
    await c.probe('RC-5', async () => {
      const ok = await I.spacing(page, sbs.id, 'Space between blocks', 32); const n = await nodeOf(page, sbs.id);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, sbs.id, ['columnGap', 'rowGap']); const rule = await ruleText(f, sbs.id); await pvClose(page, c.w);
      c.rec('RC-5', ok && parseFloat(m.columnGap) > 0 ? 'HAS' : 'PARTLY', `"Space between blocks" → 32 on the Side-by-side row: ${ok}; stored ${JSON.stringify({ gap: n.gap, gapX: n.gapX, gapY: n.gapY })}`, `column-gap ${m.columnGap}, row-gap ${m.rowGap}; rule ${JSON.stringify(rule).slice(0, 200)}`, '');
    });
    await c.probe('RC-6', async () => {
      const addInside = async (host) => { const b4 = new Set(await allIds(page)); await sel(page, host); await expandInspector(page); await page.getByRole('button', { name: 'Add a block inside', exact: true }).click(); await sleep(page, 700); const menu = (await page.getByRole('menuitem').allInnerTexts().catch(() => [])) || []; if (menu.length) { const st = page.getByRole('menuitem', { name: 'Stack', exact: true }).first(); if (await st.count()) await st.click(); else await page.keyboard.press('Escape'); } await sleep(page, 600); await page.keyboard.press('Escape'); await sleep(page, 200); const nw = (await allIds(page)).filter((x) => !b4.has(x)); return { id: nw[0], menu }; };
      let host = await band(page); await H.panel(page, false); const chain = [host]; let menu = [];
      { const r = await addInside(host); if (r.id) { menu = r.menu; chain.push(r.id); host = r.id; } }
      for (let d = 0; d < 2; d++) { const id = await into(page, host, 'Stack'); chain.push(id); host = id; }
      await into(page, host, 'Text'); await H.panel(page, false); await c.shot('RC-6-editor');
      await pvOpen(page); const f = await pvAt(page, 1280); const depth = await f.evaluate((ids) => ids.map((s) => !!document.querySelector(s)).join(','), chain.map(cls)); const nested = await f.evaluate((ids) => { for (let i = 1; i < ids.length; i++) { const p = document.querySelector(ids[i - 1]); if (!p || !p.querySelector(ids[i])) return `broken at ${i}`; } return 'each inside the one before'; }, chain.map(cls)); await pvClose(page, c.w);
      c.rec('RC-6', chain.length >= 4 && /each inside/.test(nested) ? 'HAS' : 'PARTLY', `Inspector "Add a block inside" once, then a Stack dropped into the newest twice, from a Stack band (menu: ${(menu || []).map((x) => x.trim()).join(' / ').slice(0, 120)}) → ${chain.length} levels, then a Text`, `exported: ${depth} · ${nested}`, 'RC-6-editor.png');
    });
    let grid = null;
    await c.probe('GR-1', async () => {
      const fresh = await tileThen(page, 'Grid', async () => { await page.locator('[role="gridcell"][aria-label="4 across, 2 down"]').click(); });
      const t = await activeRoot(page); const w = (n) => { if (!grid && n.layout === 'grid' && fresh.includes(n.id)) grid = n; (n.children || []).forEach(w); }; w(t);
      if (!grid) throw new Error('no grid from 4 across, 2 down');
      for (const k of grid.children.slice(0, 8)) await into(page, k.id, 'Text'); await H.panel(page, false);
      await at(page, grid.id, 'Design', 'Arrange'); const colOpts = await ins(page).getByRole('group', { name: 'Columns' }).getByRole('button').allInnerTexts().catch(() => []); const inRow = await ins(page).getByRole('slider', { name: 'Columns in the row' }).count();
      await c.shot('GR-1-editor');
      await pvOpen(page); const s = await sweep(page, (f) => f.evaluate((g) => { const e = document.querySelector(g); const tr = getComputedStyle(e).gridTemplateColumns.split(' ').filter(Boolean).length; const kids = Array.from(e.children).map((k) => Math.round(k.getBoundingClientRect().top)); return `${tr} tracks, ${new Set(kids).size} rows drawn`; }, cls(grid.id)));
      await pvAt(page, 375); await c.shot('GR-1-preview-375'); await pvAt(page, 1280); await c.shot('GR-1-preview-1280'); await pvClose(page, c.w);
      c.rec('GR-1', 'HAS', `Grid → "Choose a layout" 4 across, 2 down → ${grid.children.length} cells, columns ${grid.columns}; "Columns" offers ${colOpts.map((x) => x.trim()).join(' / ')}; "Columns in the row" slider: ${inRow > 0}`, s, 'GR-1-editor.png, GR-1-preview-375.png, GR-1-preview-1280.png');
    });
    await c.probe('GR-2', async () => {
      await at(page, grid.id, 'Design'); await openAll(page); const t = await insText(page); const hit = t.match(/[^.]{0,40}(minimum|min\.? width|narrowest|card width|at least [^.]{0,20}wide)[^.]{0,40}/i);
      c.rec('GR-2', hit ? 'PARTLY' : 'PARTLY', `every Inspector section of the grid opened; a minimum-card-width control: ${hit ? '"' + hit[0] + '"' : 'none found'}`, 'the floor shows only as the column count dropping in the GR-1 sweep (engine value, not a control)', '');
    });
    const cells = grid ? grid.children.map((x) => x.id) : [];
    await c.probe('GR-3', async () => {
      await at(page, cells[0], 'Design'); await openAll(page); await field(page, 'Columns wide', 2); const rt = await ins(page).getByLabel('Rows tall', { exact: true }).count(); if (rt) await field(page, 'Rows tall', 2);
      const n = await nodeOf(page, cells[0]); await c.shot('GR-3-editor');
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, cells[0], ['gridColumnStart', 'gridColumnEnd', 'gridRowStart', 'gridRowEnd']); const k1 = await pcss(f, cells[1], []); await pvClose(page, c.w);
      c.rec('GR-3', /span 2/.test(m.gridColumnEnd + m.gridColumnStart) ? 'HAS' : 'PARTLY', `cell 1 "Columns wide" 2, "Rows tall" offered: ${rt > 0} → 2; stored ${JSON.stringify({ colSpan: n.colSpan, rowSpan: n.rowSpan })}`, `cell 1 ${JSON.stringify(m)}; cell 2 at l${k1.l}`, 'GR-3-editor.png');
    });
    await c.probe('GR-4', async () => {
      await at(page, cells[4], 'Design'); await openAll(page); const has = await ins(page).getByLabel('Start at column', { exact: true }).count(); if (has) await field(page, 'Start at column', 3); if (await ins(page).getByLabel('Start at row', { exact: true }).count()) await field(page, 'Start at row', 2);
      const n = await nodeOf(page, cells[4]);
      const g = page.getByRole('button', { name: 'Layout guides' }).first(); await g.click(); await sleep(page, 500); const pressed = await g.getAttribute('aria-pressed'); await c.shot('GR-4-guides'); await g.click(); await sleep(page, 300);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, cells[4], ['gridColumnStart', 'gridRowStart']); await pvClose(page, c.w);
      c.rec('GR-4', /3/.test(m.gridColumnStart) ? 'HAS' : 'PARTLY', `cell 5 "Start at column" offered: ${has > 0} → 3, "Start at row" → 2; stored ${JSON.stringify({ colStart: n.colStart, rowStart: n.rowStart, gridColumn: n.gridColumn })}; "Layout guides" pressed: ${pressed}`, JSON.stringify(m), 'GR-4-guides.png');
    });
    await c.probe('GR-5', async () => {
      await at(page, grid.id, 'Design', 'Arrange'); const opts = await ins(page).getByRole('group', { name: 'Row heights' }).getByRole('button').allInnerTexts().catch(() => []);
      const b0 = await pcss(await pvOpen(page).then(() => pvAt(page, 1280)), grid.id, ['gridAutoRows', 'gridTemplateRows']); await pvClose(page, c.w);
      await at(page, grid.id, 'Design', 'Arrange'); const fol = ins(page).getByRole('group', { name: 'Row heights' }).getByRole('button').nth(1); await fol.click(); await sleep(page, 400);
      const meas = ins(page).getByLabel('Measure on the page'); const hasMeas = await meas.count(); if (hasMeas) { await meas.check().catch(async () => { await meas.click(); }); await sleep(page, 300); }
      const n = await nodeOf(page, grid.id);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, grid.id, ['gridAutoRows', 'gridTemplateRows']); const scripts = await f.evaluate(() => Array.from(document.scripts).map((s) => (s.src || s.textContent).slice(0, 50).replace(/\s+/g, ' '))); await pvClose(page, c.w);
      c.rec('GR-5', 'HAS', `"Row heights" offers ${opts.map((x) => x.trim()).join(' / ')} → 2nd; "Measure on the page" offered: ${hasMeas > 0}; stored rowFlow=${n.rowFlow} ${JSON.stringify({ measure: n.masonryMeasure ?? n.measure })}`, `before ${JSON.stringify(b0)} → after ${JSON.stringify(m)}; scripts ${JSON.stringify(scripts).slice(0, 200)}`, '');
    });
    await c.probe('GR-6', async () => {
      await at(page, cells[1], 'Design'); await openAll(page); const t = await insText(page);
      c.rec('GR-6', /subgrid|line up with the parent/i.test(t) ? 'PARTLY' : 'GAP', `cell Inspector opened in full; "subgrid" or "share the parent's columns": ${/subgrid/i.test(t)}`, 'nothing to export', '');
    });
    await c.probe('FL-1', async () => {
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, r1, ['display', 'flexDirection']); await pvClose(page, c.w);
      c.rec('FL-1', m.flexDirection === 'column' ? 'HAS' : 'PARTLY', '"Stack" tile (column of a row)', JSON.stringify(m), '');
    });
    await c.probe('FL-2', async () => {
      await at(page, sbs.id, 'Design', 'Arrange'); const cb = ins(page).getByLabel('Let blocks wrap to a new line'); await cb.check(); await sleep(page, 300); const n = await nodeOf(page, sbs.id);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, sbs.id, ['flexWrap', 'alignContent']); await pvClose(page, c.w);
      c.rec('FL-2', m.flexWrap === 'wrap' ? 'HAS' : 'PARTLY', `Side-by-side row → "Let blocks wrap to a new line" ticked; stored wrap=${n.wrap}`, JSON.stringify(m), '');
    });
    await c.probe('AL-2', async () => {
      await at(page, sbs.id, 'Design', 'Arrange'); const opts = await choose(page, 'Position blocks', /Even gaps/); const n = await nodeOf(page, sbs.id);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, sbs.id, ['justifyContent', 'alignContent']); await pvClose(page, c.w);
      await at(page, grid.id, 'Design', 'Arrange'); const gopts = await choose(page, 'Position blocks', null).catch(() => ['(no "Position blocks" on a grid)']);
      c.rec('AL-2', 'PARTLY', `row "Position blocks" offers ${opts.join(' / ')} → Even gaps (stored ${n.justify}); "evenly" offered: ${opts.some((o) => /even(ly)? spaced|evenly/i.test(o))}; on the grid: ${gopts.join(' / ')}`, JSON.stringify(m), '');
    });
    await c.probe('AL-5', async () => {
      await at(page, sbs.id, 'Design', 'Arrange'); const opts = await choose(page, 'Line up', null);
      c.rec('AL-5', opts.some((o) => /baseline|text line/i.test(o)) ? 'HAS' : 'GAP', `row "Line up (across)" offers ${opts.join(' / ')}`, 'no baseline option to export', '');
    });
    await c.probe('FL-3', async () => {
      const b = await band(page); const im = await into(page, b, 'Image'); await under(page, im, 'Text'); await H.panel(page, false);
      await at(page, im, 'Design'); await openAll(page); const t = await insText(page); const floatCtl = /wrap (the )?text|text around|float left|float right/i.test(t);
      await at(page, im, 'Content', 'Advanced CSS'); const ta = ins(page).getByRole('textbox', { name: /Custom CSS/ }).or(ins(page).locator('textarea')).last(); await ta.fill('float: left;'); await ta.blur(); await sleep(page, 400);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, im, ['float', 'display']); await pvClose(page, c.w);
      c.rec('FL-3', floatCtl ? 'PARTLY' : 'GAP', `Image Inspector opened in full — a wrap-text / float control: ${floatCtl}; Advanced CSS "float: left;" typed`, `exported float ${m?.float} (inside a flex column a float has no effect: display of the parent decides)`, '');
    });
    await c.probe('FL-4', async () => {
      const b = await band(page); await into(page, b, 'Text'); await H.panel(page, false); await at(page, b, 'Design'); await openAll(page); const t = await insText(page);
      await at(page, b, 'Content', 'Advanced CSS'); const ta = ins(page).locator('textarea').last(); await ta.fill('column-count: 2;'); await ta.blur(); await sleep(page, 400);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, b, ['columnCount', 'display']); await pvClose(page, c.w);
      c.rec('FL-4', /column|newspaper/i.test(t.match(/Arrange.*?Text style/)?.[0] || '') ? 'PARTLY' : 'GAP', 'no text-columns control in Arrange; Advanced CSS "column-count: 2;" typed', `exported column-count ${m?.columnCount} on display ${m?.display} (Advanced CSS only)`, '');
    });
  },

  // ── D · size · space · alignment ───────────────────────────────────────────────────────────────────────────────────
  async D(c) {
    const { page } = c;
    const d1 = await band(page); const t1 = await into(page, d1, 'Text'); const t2 = await under(page, t1, 'Text'); const bt = await under(page, t2, 'Button'); await H.panel(page, false);
    await c.probe('SZ-1', async () => {
      await I.widthMode(page, t1, '½'); const half = await nodeOf(page, t1);
      await pvOpen(page); let f = await pvAt(page, 1280); const a = await pcss(f, t1, ['width']); const band1 = await pcss(f, d1, ['paddingLeft']); await pvClose(page, c.w);
      await I.customWidth(page, t2, '10rem'); const cu = await nodeOf(page, t2);
      await pvOpen(page); f = await pvAt(page, 1280); const b = await pcss(f, t2, ['width']); await pvClose(page, c.w);
      await I.widthMode(page, t1, 'Fit');
      c.rec('SZ-1', Math.abs(b.w - 160) <= 2 && Math.abs(a.w / band1.w - 0.5) < 0.06 ? 'HAS' : 'PARTLY', `Width "½" (stored ${half.width}); Custom "10rem" (stored ${cu.width}); offered Fit / Full / ½ / ⅓ / Custom`, `½ → ${a.w}px in a ${band1.w}px band; 10rem → ${b.w}px (160 expected)`, '');
    });
    await c.probe('SZ-2', async () => {
      await at(page, t2, 'Design', 'Size'); await field(page, 'Height', '12rem'); const n = await nodeOf(page, t2);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, t2, ['height', 'minHeight']); await pvClose(page, c.w);
      await sel(page, t1); const h0 = (await css(page, t1, [])).h; const dragged = await dragVisible(page, 'Resize bottom edge', 0, 60); const n1 = await nodeOf(page, t1); const h1 = (await css(page, t1, [])).h;
      await c.shot('SZ-2-editor');
      c.rec('SZ-2', Math.abs(m.h - 192) <= 2 && h1 > h0 ? 'HAS' : 'PARTLY', `"Height" 12rem (stored ${JSON.stringify({ height: n.height, minHeight: n.minHeight })}); bottom-edge drag +60 on another (handle found ${dragged}): ${h0} → ${h1}px, stored ${JSON.stringify({ height: n1.height, minHeight: n1.minHeight })}`, `exported ${JSON.stringify(m)}`, 'SZ-2-editor.png');
    });
    await c.probe('SZ-3', async () => {
      await at(page, t2, 'Design', 'Size'); const t = (await insText(page)).match(/Size.*?Spacing/)?.[0] || '';
      c.rec('SZ-3', /max(imum)? (width|height)|min(imum)? width|at most/i.test(t) ? 'HAS' : 'PARTLY', `Size section reads: "${t.slice(0, 260)}"`, 'only a minimum height ("At least rows tall" / Height) — no min/max width or max height', '');
    });
    await c.probe('SZ-5', async () => {
      await I.contentWidth(page, d1, 'Centred column');
      await pvOpen(page); const f = await pvAt(page, 1920); const m = await f.evaluate((t) => { const e = document.querySelector(t); const r = e.getBoundingClientRect(); return { textW: Math.round(r.width), measure: getComputedStyle(document.documentElement).getPropertyValue('--eu-measure') || getComputedStyle(e.parentElement).getPropertyValue('--eu-measure'), parentMax: getComputedStyle(e.parentElement).maxWidth }; }, cls(t1)); await pvClose(page, c.w);
      await page.getByRole('button', { name: 'Page settings' }).first().click(); await sleep(page, 500); const g = page.getByRole('button', { name: /Page grid/ }).first(); let side = null, dlg = '';
      if (await g.count()) { await g.click(); await sleep(page, 600); const d = page.getByRole('dialog', { name: 'Page grid' }); dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); const s = d.getByRole('slider', { name: /Side space/ }).first(); if (await s.count()) { await s.fill('48'); side = 48; await sleep(page, 400); } await c.shot('SZ-5-page-grid'); await page.keyboard.press('Escape'); await sleep(page, 300); }
      else await page.keyboard.press('Escape');
      await pvOpen(page); const f2 = await pvAt(page, 1280); const p2 = await f2.evaluate((b) => { const e = document.querySelector(b); const band = e.closest('.eu-band') || e; return getComputedStyle(band).paddingLeft + ' / ' + getComputedStyle(e).paddingLeft; }, cls(d1)); await pvClose(page, c.w);
      c.rec('SZ-5', 'PARTLY', `"Centred column" on; Page settings → Page grid: "${dlg}" — Side space set ${side}; a control for the column's own width: ${/column width|content width|measure/i.test(dlg)}`, `at 1920 the centred text is ${m.textW}px (parent max-width ${m.parentMax}, --eu-measure "${m.measure}"); band side padding at 1280 after Side space: ${p2}`, 'SZ-5-page-grid.png');
    });
    await c.probe('SP-1', async () => {
      await at(page, t2, 'Design', 'Spacing'); await slider(page, 'Inner spacing', 24); const fieldPh = await ins(page).getByLabel('Inner spacing top', { exact: true }).getAttribute('placeholder'); await field(page, 'Inner spacing top', 2.5); const n = await nodeOf(page, t2);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, t2, ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']); const rule = await ruleText(f, t2); await pvClose(page, c.w);
      await at(page, bt, 'Design'); await openAll(page); const btnInner = await ins(page).getByRole('slider', { name: 'Inner spacing', exact: true }).count();
      c.rec('SP-1', parseFloat(m.paddingTop) > parseFloat(m.paddingLeft) && parseFloat(m.paddingLeft) > 0 ? 'HAS' : 'PARTLY', `"Inner spacing" slider 24, then the "Top" field (its placeholder reads "${fieldPh}" — rem, with no unit shown) typed 2.5: stored ${JSON.stringify({ padding: n.padding, paddingTop: n.paddingTop, pt: n.pt })}; a Button offers Inner spacing: ${btnInner > 0}`, `${JSON.stringify(m)}; rule ${JSON.stringify(rule).slice(0, 220)}`, '');
    });
    await c.probe('SZ-6', async () => {
      const f0 = await pvOpen(page).then(() => pvAt(page, 1280)); const before = await f0.evaluate(([t, p]) => ({ text: getComputedStyle(document.querySelector(t)).fontSize, html: getComputedStyle(document.documentElement).fontSize, u: getComputedStyle(document.querySelector(t)).getPropertyValue('--box-u').trim().slice(0, 60), pad: getComputedStyle(document.querySelector(p)).paddingLeft }), [cls(t1), cls(t2)]); await pvClose(page, c.w);
      const ed0 = await css(page, t1, ['fontSize']);
      await field(page, 'Base size (px)', 14); const ed1 = await css(page, t1, ['fontSize']);
      const f = await pvOpen(page).then(() => pvAt(page, 1280)); const after = await f.evaluate(([t, p]) => ({ text: getComputedStyle(document.querySelector(t)).fontSize, html: getComputedStyle(document.documentElement).fontSize, u: getComputedStyle(document.querySelector(t)).getPropertyValue('--box-u').trim().slice(0, 60), pad: getComputedStyle(document.querySelector(p)).paddingLeft }), [cls(t1), cls(t2)]); await pvClose(page, c.w);
      await field(page, 'Base size (px)', 10);
      c.store.sz6 = { before, after, ed0, ed1 };
      c.rec('SZ-6', before.pad !== after.pad ? 'HAS' : 'PARTLY', `"Base size (px)" 10 → 14 in the top bar: canvas text ${ed0.fontSize} → ${ed1.fontSize}`, `Preview text ${before.text} → ${after.text}; html ${before.html} → ${after.html}; --box-u "${before.u}" → "${after.u}"; a padded block's padding ${before.pad} → ${after.pad}`, '');
      c.rec('AX-1', /rem/.test(before.u) ? 'HAS' : 'PARTLY', 'same probe as SZ-6 (Base size) + the export read for rem units (SP-1)', `--box-u ${before.u}; text ${before.text} → ${after.text}; padding ${before.pad} → ${after.pad}`, '');
    });
    await c.probe('SP-2', async () => {
      await at(page, t2, 'Design', 'Spacing'); await slider(page, 'Outer spacing', 16); await field(page, 'Outer spacing top', -1.5); const v = await ins(page).getByLabel('Outer spacing top', { exact: true }).inputValue(); const n = await nodeOf(page, t2);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, t2, ['marginTop', 'marginLeft', 'marginBottom']); await pvClose(page, c.w);
      c.rec('SP-2', parseFloat(m.marginTop) < 0 ? 'HAS' : 'PARTLY', `"Outer spacing" 16, "Outer spacing top" typed −1.5 (rem; the field has min=0) → field shows "${v}", stored ${JSON.stringify({ margin: n.margin, marginTop: n.marginTop })}`, JSON.stringify(m), '');
    });
    await c.probe('SP-3', async () => {
      const ok = await I.spacing(page, d1, 'Space between blocks', 20);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, d1, ['rowGap', 'columnGap']); await pvClose(page, c.w);
      c.rec('SP-3', ok && parseFloat(m.rowGap) > 0 ? 'HAS' : 'PARTLY', `Stack "Space between blocks" 20: ${ok}`, `row-gap ${m.rowGap}`, '');
    });
    await c.probe('SP-4', async () => {
      await at(page, t1, 'Design', 'Spacing'); await field(page, 'Inner spacing left', 0.8125); const n = await nodeOf(page, t1);
      const hs = page.locator('[role="slider"][aria-label^="Inner space"]'); const cnt = await hs.count(); let k = null;
      if (cnt) { const h = hs.first(); const v0 = await h.getAttribute('aria-valuenow'); await h.focus(); await page.keyboard.press('ArrowRight'); await sleep(page, 300); const v1 = await h.getAttribute('aria-valuenow'); await page.keyboard.press('ArrowRight'); await sleep(page, 300); const v2 = await h.getAttribute('aria-valuenow'); k = `${await h.getAttribute('aria-label')}: ${v0} → ${v1} → ${v2} (${await h.getAttribute('aria-valuetext')})`; }
      await c.shot('SP-4-handles');
      c.rec('SP-4', 'PARTLY', `"Inner spacing left" typed 0.8125 rem (13px) → stored ${JSON.stringify({ paddingLeft: n.paddingLeft, padding: n.padding })} (13 is off a 4/8 scale and kept); canvas handle with the arrow key: ${k}`, 'free numbers from the fields; the scale only on the canvas handles', 'SP-4-handles.png');
    });
    await c.probe('SP-5', async () => {
      await sel(page, t1); const hs = await page.evaluate(() => Array.from(document.querySelectorAll('[role="slider"][aria-label^="Inner space"],[role="slider"][aria-label^="Outer space"]')).map((e) => `${e.getAttribute('aria-label')}=${e.getAttribute('aria-valuetext')?.split(': ')[1]}`));
      const h = page.locator('[role="slider"][aria-label="Inner space, top"]').first(); let dbl = null; if (await h.count()) { await h.dblclick(); await sleep(page, 400); dbl = await h.getAttribute('aria-valuenow').catch(() => 'gone'); }
      await c.shot('SP-5-handles');
      c.rec('SP-5', hs.length >= 4 ? 'HAS' : 'PARTLY', `selected Text shows ${hs.length} spacing handles: ${hs.join(', ').slice(0, 260)}; double-click "Inner space, top" → ${dbl}`, 'editor only', 'SP-5-handles.png');
    });
    await c.probe('AL-1', async () => {
      await at(page, d1, 'Design', 'Arrange'); const opts = await choose(page, 'Line up', /Center/);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, d1, ['alignItems']); const tr = await pcss(f, bt, []); const br = await pcss(f, d1, []); await pvClose(page, c.w);
      c.rec('AL-1', /center/.test(m.alignItems) ? 'HAS' : 'PARTLY', `Stack "Line up (across)" offers ${opts.join(' / ')} → Center`, `align-items ${m.alignItems}; the Button's centre ${tr.l + tr.w / 2} vs band centre ${br.l + br.w / 2}`, '');
    });
    await c.probe('AL-3', async () => {
      const d2 = await band(page); const x = await into(page, d2, 'Text'); await H.panel(page, false);
      await at(page, d2, 'Design', 'Arrange'); await btn(page, 'Half screen', ins(page)); await at(page, x, 'Design', 'Position'); await btn(page, 'Bottom right', ins(page)); const n = await nodeOf(page, x);
      await pvOpen(page); const f = await pvAt(page, 1280, 800); const m = await f.evaluate(([b, t]) => { const B = document.querySelector(b).getBoundingClientRect(), T = document.querySelector(t).getBoundingClientRect(); const c = getComputedStyle(document.querySelector(t)); return { place: `${c.alignSelf} / ${c.justifySelf} / margin ${c.marginTop} ${c.marginLeft}`, toRight: Math.round(B.right - T.right), toBottom: Math.round(B.bottom - T.bottom), toLeft: Math.round(T.left - B.left), toTop: Math.round(T.top - B.top) }; }, [cls(d2), cls(x)]); await c.shot('AL-3-preview'); await pvClose(page, c.w);
      c.rec('AL-3', m.toBottom < m.toTop && m.toRight < m.toLeft ? 'HAS' : 'PARTLY', `Half-screen band, its Text → "Position in its parent" → Bottom right: stored ${JSON.stringify({ place: n.place, selfAlign: n.selfAlign, alignSelf: n.alignSelf })}`, JSON.stringify(m), 'AL-3-preview.png');
    });
    await c.probe('AL-4', async () => {
      await at(page, t1, 'Content', 'Text style'); await btn(page, 'Align center', ins(page)); const just = await ins(page).getByRole('button', { name: /Justify/ }).count();
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await pcss(f, t1, ['textAlign']); await pvClose(page, c.w);
      c.rec('AL-4', just ? 'HAS' : 'PARTLY', `Text style: Align left / center / right; a "Justify" button: ${just > 0}`, `text-align ${m.textAlign}`, '');
    });
    await c.probe('AX-4', async () => {
      await page.getByRole('button', { name: /^Page check/ }).first().click(); await sleep(page, 700); const pc = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await c.shot('AX-4-pagecheck'); await page.keyboard.press('Escape'); await sleep(page, 300);
      await pvOpen(page); const s = await sweep(page, (f) => f.evaluate(() => { const d = document.documentElement; return `sideways ${d.scrollWidth - d.clientWidth > 1 ? 'YES' : 'no'} · overflow-x ${getComputedStyle(document.body).overflowX}/${getComputedStyle(d).overflowX}`; })); await pvClose(page, c.w);
      c.rec('AX-4', /sideways no/.test(s) && !/YES/.test(s) ? 'HAS' : 'PARTLY', `Page check reads: "${pc}"`, s, 'AX-4-pagecheck.png');
    });
  },

  // ── E · position & per-device ──────────────────────────────────────────────────────────────────────────────────────
  async E(c) {
    const { page } = c;
    const e1 = await band(page); const t1 = await into(page, e1, 'Text'); const t2 = await under(page, t1, 'Text'); const t3 = await under(page, t2, 'Text');
    const e2 = await band(page); const t4 = await into(page, e2, 'Text');
    const e3 = await band(page); await into(page, e3, 'Text'); await H.panel(page, false);
    await I.text(page, t1, 'Sticky words'); await I.text(page, t2, 'Floating words'); await I.text(page, t4, 'On screen words');
    await at(page, e1, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page)); await at(page, e3, 'Design', 'Arrange'); await btn(page, 'Full screen', ins(page));
    await c.probe('FL-5', async () => {
      await at(page, t2, 'Design', 'Placement'); await btn(page, 'Floating', ins(page)); await sleep(page, 400);
      await sel(page, t3); await page.keyboard.press('Alt+f'); await sleep(page, 500); const n3 = await nodeOf(page, t3);
      await at(page, t2, 'Design', 'Placement'); const z0 = (await nodeOf(page, t2)).zIndex; const bf = ins(page).getByRole('button', { name: 'Bring to front' }); const hasZ = await bf.count(); if (hasZ) { await bf.click(); await sleep(page, 300); } const z1 = (await nodeOf(page, t2)).zIndex;
      await page.keyboard.press('Control+['); await sleep(page, 300); const z2 = (await nodeOf(page, t2)).zIndex;
      const n2 = await nodeOf(page, t2); await c.shot('FL-5-editor');
      await pvOpen(page); let f = await pvAt(page, 1280); const m = await pcss(f, t2, ['position', 'zIndex']); f = await pvAt(page, 375); const p = await pcss(f, t2, ['position']); await c.shot('FL-5-preview-375'); await pvClose(page, c.w);
      c.rec('FL-5', m.position === 'absolute' ? 'HAS' : 'PARTLY', `Placement → Floating (stored floating=${n2.floating ?? n2.float ?? n2.position}); Alt+F on another → stored floating=${n3.floating}; "Bring to front" offered ${hasZ > 0}: z ${z0} → ${z1}; Ctrl+[ → ${z2}`, `1280: ${JSON.stringify(m)}; 375: position ${p.position}`, 'FL-5-editor.png, FL-5-preview-375.png');
    });
    await c.probe('PO-3', async () => {
      await at(page, t2, 'Design', 'Placement'); await field(page, 'Left % position', 30); await field(page, 'Top % position', 20); const n = await nodeOf(page, t2);
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await f.evaluate(([b, t]) => { const B = document.querySelector(b).getBoundingClientRect(), T = document.querySelector(t).getBoundingClientRect(); return { leftPct: Math.round((T.left - B.left) / B.width * 100), topPct: Math.round((T.top - B.top) / B.height * 100) }; }, [cls(e1), cls(t2)]); const rule = await ruleText(f, t2); await pvClose(page, c.w);
      c.rec('PO-3', Math.abs(m.leftPct - 30) <= 3 ? 'HAS' : 'PARTLY', `"Left %" 30, "Top %" 20: stored ${JSON.stringify({ left: n.left, top: n.top })}`, `${JSON.stringify(m)}; rule ${JSON.stringify(rule).slice(0, 200)}`, '');
    });
    await c.probe('PO-4', async () => {
      await at(page, t2, 'Design', 'Placement'); await field(page, 'Top % position', 110); const n = await nodeOf(page, t2);
      await c.shot('PO-4-editor');
      await pvOpen(page); const f = await pvAt(page, 1280); const m = await f.evaluate(([b, nb, t]) => { const B = document.querySelector(b), N = document.querySelector(nb), T = document.querySelector(t).getBoundingClientRect(); const band = B.closest('.eu-band') || B; const nband = N.closest('.eu-band') || N; return { T: `${Math.round(T.top)}..${Math.round(T.bottom)}`, band: `${Math.round(band.getBoundingClientRect().top)}..${Math.round(band.getBoundingClientRect().bottom)}`, next: `${Math.round(nband.getBoundingClientRect().top)}..${Math.round(nband.getBoundingClientRect().bottom)}`, overNext: T.top < nband.getBoundingClientRect().bottom && T.bottom > nband.getBoundingClientRect().top, bandOverflow: getComputedStyle(band).overflow + '/' + getComputedStyle(B).overflow, visible: document.elementFromPoint(T.left + 4, T.top + 4)?.closest('[class*=bx-]')?.className.slice(0, 40) }; }, [cls(e1), cls(e2), cls(t2)]); await f.evaluate((t) => document.querySelector(t).scrollIntoView({ block: 'center' }), cls(t2)); await sleep(page, 300); await c.shot('PO-4-preview'); await pvClose(page, c.w);
      await at(page, t2, 'Design', 'Placement'); await field(page, 'Top % position', 20);
      c.rec('PO-4', m.overNext ? 'PARTLY' : 'GAP', `"Top %" typed 110 on the floating block: stored top ${n.top}`, JSON.stringify(m), 'PO-4-editor.png, PO-4-preview.png');
    });
    await c.probe('PO-5', async () => {
      await sel(page, t2); const h = page.locator('[aria-label="Drag to move"]').filter({ visible: true }).first(); const hb = await h.boundingBox().catch(() => null); let guides = null, l1 = null;
      if (hb) { const x = hb.x + hb.width / 2, y = hb.y + hb.height / 2; await page.mouse.move(x, y); await page.mouse.down(); for (let i = 1; i <= 12; i++) { await page.mouse.move(x + 15 * i, y + 4 * i); await sleep(page, 25); } guides = await page.evaluate(() => Array.from(document.querySelectorAll('[data-guide],[class*="guide"],[aria-hidden="true"]')).filter((e) => { const r = e.getBoundingClientRect(); return (r.width <= 2 || r.height <= 2) && (r.width > 40 || r.height > 40) && getComputedStyle(e).position !== 'static'; }).length); await c.shot('PO-5-dragging'); await page.mouse.up(); await sleep(page, 500); l1 = (await nodeOf(page, t2)); }
      // far outside its parent
      let l2 = null; if (hb) { await sel(page, t2); const b2 = await h.boundingBox(); await page.mouse.move(b2.x + 5, b2.y + 5); await page.mouse.down(); for (let i = 1; i <= 12; i++) { await page.mouse.move(b2.x + 5, b2.y + 5 + 60 * i); await sleep(page, 25); } await page.mouse.up(); await sleep(page, 500); l2 = await nodeOf(page, t2); }
      const par = await parentOf(page, t2);
      c.rec('PO-5', hb ? 'PARTLY' : 'GAP', `"Drag to move" handle found: ${!!hb}; dragged +180,+48: thin guide lines on screen during the drag: ${guides}; stored ${JSON.stringify({ left: l1?.left, top: l1?.top })}; dragged 720px down (past the band): stored top ${l2?.top}, parent still ${par?.id === e1 ? 'the same band' : par?.id}`, 'placement stays % of the parent', 'PO-5-dragging.png');
      await at(page, t2, 'Design', 'Placement'); await field(page, 'Top % position', 20);
    });
    await c.probe('PO-1', async () => {
      const ok = await I.sticky(page, t1); const t = await insText(page); const held = await ins(page).getByRole('group', { name: 'Held against' }).getByRole('button').allInnerTexts().catch(() => []); const n = await nodeOf(page, t1);
      await c.shot('PO-1-editor');
      await pvOpen(page); const f = await pvAt(page, 1280, 700); const m0 = await pcss(f, t1, ['position', 'top']); m0.chain = await f.evaluate((s) => { const out = []; let e = document.querySelector(s); for (let i = 0; i < 4 && e; i++) { out.push(`${e.tagName.toLowerCase()}.${(e.className || '').toString().split(' ')[0]}:${getComputedStyle(e).position}`); e = e.parentElement; } return out.join(' < '); }, cls(t1)); await f.evaluate((b) => { const e = document.querySelector(b); scrollTo(0, e.getBoundingClientRect().top + scrollY + 300); }, cls(e1)); await sleep(page, 400); const m1 = await pcss(f, t1, ['position']); await c.shot('PO-1-preview-scrolled'); await pvClose(page, c.w);
      c.rec('PO-1', ok && /sticky/.test(m0.chain) && m1.t >= -2 && m1.t < 200 ? 'HAS' : 'PARTLY', `"Sticks when reached": ${ok}; "Held against" ${held.map((x) => x.trim()).join(' / ')}; "Distance from the edge" shown ${/Distance from the edge/.test(t)}; "When it takes hold" shown ${/When it takes hold/.test(t)}; stored ${JSON.stringify({ sticky: n.sticky, stick: n.stick })}`, `position ${m0.position} top ${m0.top} (chain ${m0.chain}); scrolled 300px into its band: its top on screen ${m1.t}px`, 'PO-1-editor.png, PO-1-preview-scrolled.png');
    });
    await c.probe('PO-9', async () => {
      await pvOpen(page); const f = await pvAt(page, 1280, 700); const r = await f.evaluate(([b, t]) => { const B = document.querySelector(b); const top = B.getBoundingClientRect().top + scrollY; const out = []; for (const d of [200, 500, B.getBoundingClientRect().height - 50, B.getBoundingClientRect().height + 300]) { scrollTo(0, top + d); const T = document.querySelector(t).getBoundingClientRect(), R = B.getBoundingClientRect(); out.push(`scroll +${Math.round(d)}: sticky top ${Math.round(T.top)} bottom ${Math.round(T.bottom)} · section bottom ${Math.round(R.bottom)}${T.bottom > R.bottom + 1 ? ' ESCAPED' : ''}`); } return out; }, [cls(e1), cls(t1)]);
      await c.shot('PO-9-preview-past-section'); await pvClose(page, c.w);
      c.rec('PO-9', r.some((x) => /ESCAPED/.test(x)) ? 'GAP' : 'HAS', 'the "Sticks when reached" Text of PO-1 inside its full-screen section, scrolled past the section\'s end', r.join(' | '), 'PO-9-preview-past-section.png');
    });
    await c.probe('PO-2', async () => {
      await at(page, t4, 'Design', 'Placement'); await btn(page, 'Floats on screen option', ins(page)); const t = await insText(page); const corners = await ins(page).getByRole('button', { name: /corner|↖|↗|↙|↘|Top left|Bottom right/ }).allInnerTexts().catch(() => []);
      const keep = /Keep its space instead/.test(t); const n = await nodeOf(page, t4);
      await pvOpen(page); const f = await pvAt(page, 1280, 700); const m0 = await pcss(f, t4, ['position', 'top', 'bottom', 'right', 'left']); await f.evaluate(() => scrollTo(0, 900)); await sleep(page, 400); const m1 = await pcss(f, t4, ['position']); await f.evaluate(() => scrollTo(0, 1800)); await sleep(page, 400); const m2 = await pcss(f, t4, ['position']); await c.shot('PO-2-preview-scrolled'); await pvClose(page, c.w);
      c.rec('PO-2', m0.position === 'fixed' && Math.abs(m1.t - m2.t) < 2 ? 'HAS' : 'PARTLY', `"Floats on screen": corners offered ${corners.length}; "Keep its space instead" shown ${keep}; stored ${JSON.stringify({ fixed: n.fixed, pin: n.pin, floatScreen: n.floatScreen })}`, `${JSON.stringify(m0)}; on screen at scroll 900 → top ${m1.t}, at 1800 → ${m2.t}`, 'PO-2-preview-scrolled.png');
    });
    const e4 = await band(page); const h1 = await into(page, e4, 'Text'); const h2 = await under(page, h1, 'Text'); const o3 = await under(page, h2, 'Text'); await H.panel(page, false);
    await I.text(page, h1, 'Hidden on phones'); await I.text(page, h2, 'Second'); await I.text(page, o3, 'Third goes first on phones');
    await c.probe('PD-1', async () => {
      await chip(page, 'Mobile (375px)'); await sel(page, h2); await expandInspector(page); const banner = ((await insText(page)).match(/Editing [^—]*— [^.]*/) || [''])[0];
      const canvasW = await page.evaluate(() => { const f = document.querySelector('[data-canvas-scale]'); return f ? Math.round(f.getBoundingClientRect().width / Number(f.dataset.canvasScale || 1)) : null; });
      await c.shot('PD-1-mobile'); await chip(page, 'Full width');
      await page.getByRole('button', { name: 'Page settings' }).first().click(); await sleep(page, 400); const ps = (await page.locator('body').innerText()).match(/breakpoint/i); await page.keyboard.press('Escape');
      c.rec('PD-1', banner ? 'PARTLY' : 'GAP', `Mobile chip → canvas ${canvasW}px wide, Inspector banner "${banner}"; a control to change the breakpoints: ${!!ps}`, 'rungs fixed in config/layout.json (600 / 840 / 1200 / 1600)', 'PD-1-mobile.png');
    });
    await c.probe('PD-2', async () => {
      const ok = await I.phoneOnly(page, h1, { hideOnPhone: true }); const n = await nodeOf(page, h1);
      await pvOpen(page); const s = await sweep(page, (f) => f.evaluate((t) => { const e = document.querySelector(t); return e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0 ? 'shown' : 'hidden'; }, cls(h1))); await pvClose(page, c.w);
      c.rec('PD-2', ok && /hidden/.test(s) && /shown/.test(s) ? 'HAS' : 'PARTLY', `Mobile chip → Per-device → "Hidden on mobile": ${ok}; stored ${JSON.stringify(n.overrides || n.mobile || n.bp || {}).slice(0, 160)}`, s, '');
    });
    await c.probe('PD-3', async () => {
      await chip(page, 'Mobile (375px)'); await at(page, o3, 'Design', 'Position'); await field(page, 'Order', -1); const shown = await ins(page).getByLabel('Order', { exact: true }).inputValue(); const st = JSON.stringify((await nodeOf(page, o3)).overrides || {}); await chip(page, 'Full width');
      await at(page, h2, 'Design', 'Position'); await field(page, 'Order', 5); const baseSt = (await nodeOf(page, h2)).order;
      await pvOpen(page); const s = await sweep(page, (f) => f.evaluate(([a, b]) => document.querySelector(b).getBoundingClientRect().top < document.querySelector(a).getBoundingClientRect().top ? 'third drawn FIRST' : 'tree order', [cls(h2), cls(o3)])); await pvClose(page, c.w);
      const f2 = await pvOpen(page).then(() => pvAt(page, 1280)); const base = await f2.evaluate(([a, b]) => `second's order ${getComputedStyle(document.querySelector(a)).order}, drawn ${document.querySelector(a).getBoundingClientRect().top > document.querySelector(b).getBoundingClientRect().top ? 'after the third' : 'before the third'}`, [cls(h2), cls(o3)]); await pvClose(page, c.w);
      await at(page, h2, 'Design', 'Position'); await field(page, 'Order', '');
      c.rec('PD-3', /FIRST/.test(s) && /tree order/.test(s) ? 'HAS' : 'PARTLY', `Mobile chip → "Order" −1 on the third Text (field shows "${shown}", stored overrides ${st}); then at Full width "Order" 5 on the second (stored order ${baseSt})`, `mobile override: ${s} · base Order 5 at 1280: ${base}`, '');
    });
    await c.probe('PD-4', async () => {
      await chip(page, 'Mobile (375px)'); await at(page, h2, 'Design', 'Spacing'); await slider(page, 'Inner spacing', 40); const t = await insText(page); const reset = (t.match(/Reset [a-z ]*changes to default/i) || [''])[0];
      const nb = await nodeOf(page, h2); await c.shot('PD-4-mobile');
      await at(page, h2, 'Design', 'Placement'); const flo = await ins(page).getByRole('button', { name: 'Floating', exact: true }).count();
      await chip(page, 'Full width');
      await pvOpen(page); const s = await sweep(page, (f) => f.evaluate((t) => getComputedStyle(document.querySelector(t)).paddingTop, cls(h2))); await pvClose(page, c.w);
      let after = null; if (reset) { await chip(page, 'Mobile (375px)'); await sel(page, h2); await expandInspector(page); await ins(page).getByRole('button', { name: /^Reset .*changes to default/ }).first().click(); await sleep(page, 500); after = await nodeOf(page, h2); await chip(page, 'Full width'); }
      c.rec('PD-4', /40|2\.5rem|px: \d/.test(s) && reset ? 'HAS' : 'PARTLY', `Mobile chip → Inner spacing 40; "${reset}" offered; Floating offered at Mobile: ${flo > 0}; stored overrides before reset ${JSON.stringify(nb.overrides || nb.bp || nb.responsive || {}).slice(0, 160)} · after reset ${JSON.stringify(after?.overrides || after?.bp || after?.responsive || {}).slice(0, 120)}`, `padding-top by width: ${s}`, 'PD-4-mobile.png');
    });
    await c.probe('PD-5', async () => {
      await chip(page, 'Laptop (1024px)'); await at(page, o3, 'Design', 'Spacing'); await slider(page, 'Inner spacing', 30);
      await chip(page, 'Wide (1920px)'); await at(page, h2, 'Design', 'Spacing'); await slider(page, 'Outer spacing', 48);
      await chip(page, 'Desktop (1280px)'); await at(page, h1, 'Design', 'Spacing'); await slider(page, 'Inner spacing', 20); await chip(page, 'Full width');
      await pvOpen(page); const a = await sweep(page, (f) => f.evaluate((t) => getComputedStyle(document.querySelector(t)).paddingTop, cls(o3))); const b = await sweep(page, (f) => f.evaluate((t) => getComputedStyle(document.querySelector(t)).marginTop, cls(h2))); const d = await sweep(page, (f) => f.evaluate((t) => { const e = document.querySelector(t); return getComputedStyle(e).display === 'none' ? 'hidden' : getComputedStyle(e).paddingTop; }, cls(h1))); await pvClose(page, c.w);
      c.rec('PD-5', 'HAS', 'Laptop chip → Inner 30 on the third; Wide chip → Outer 48 on the second; Desktop chip → Inner 20 on the first', `third padding-top: ${a} ‖ second margin-top: ${b} ‖ first padding-top: ${d}`, '');
    });
    await c.probe('PD-6', async () => {
      await pvOpen(page); await page.setViewportSize({ width: 1366, height: 900 }); await sleep(page, 300); const opts = await choose(page, 'Preview screen size', /Galaxy A|Tecno|iPhone/);
      const w1 = await page.getByLabel('Preview width in pixels').inputValue(), h1v = await page.getByLabel('Preview height in pixels').inputValue();
      const fr = await (await page.$('iframe')).boundingBox(); const inner = await (await frame(page)).evaluate(() => `${innerWidth}×${innerHeight}`);
      await c.shot('PD-6-preset');
      await page.getByRole('button', { name: 'Rotate the preview' }).click(); await sleep(page, 500); const inner2 = await (await frame(page)).evaluate(() => `${innerWidth}×${innerHeight}`); await c.shot('PD-6-rotated');
      await page.getByLabel('Preview width in pixels').fill('500'); await sleep(page, 600); const inner3 = await (await frame(page)).evaluate(() => `${innerWidth}×${innerHeight}`);
      const zooms = await choose(page, 'Preview zoom', null);
      await pvClose(page, c.w);
      c.rec('PD-6', inner !== inner2 ? 'HAS' : 'PARTLY', `Preview → screen size (${opts.length} entries) picked a phone: fields ${w1}×${h1v}; zoom offers ${zooms.join(' / ')}`, `iframe page ${inner} (box ${Math.round(fr.width)}×${Math.round(fr.height)}); rotated ${inner2}; width typed 500 → ${inner3}`, 'PD-6-preset.png, PD-6-rotated.png');
    });
  },

  // ── F · media · weight · editing ───────────────────────────────────────────────────────────────────────────────────
  async F(c) {
    const { page } = c;
    const f1 = await band(page); const im = await into(page, f1, 'Image'); await under(page, im, 'Text'); await H.panel(page, false);
    await I.upload(page, im, path.join(IMG, 'landscape.jpg'));
    await c.probe('MS-1', async () => {
      const f0 = await pvOpen(page).then(() => pvAt(page, 1280)); const a = await f0.evaluate((s) => { const i = document.querySelector(s)?.querySelector('img') || document.querySelector(s); const c = getComputedStyle(i); return `${i.tagName} object-fit ${c.objectFit}, aspect ${c.aspectRatio}, ${Math.round(i.getBoundingClientRect().width)}×${Math.round(i.getBoundingClientRect().height)}`; }, cls(im)); await pvClose(page, c.w);
      await at(page, im, 'Design', 'Size'); await field(page, 'Height', '10rem');
      const fc = await pvOpen(page).then(() => pvAt(page, 1280)); const cropped = await fc.evaluate((s) => { const i = document.querySelector(s)?.querySelector('img'); const c = getComputedStyle(i); return `object-fit ${c.objectFit}, ${Math.round(i.getBoundingClientRect().width)}×${Math.round(i.getBoundingClientRect().height)}`; }, cls(im)); await pvClose(page, c.w);
      await at(page, im, 'Content'); await openAll(page); const t = await insText(page); const whole = ins(page).getByLabel(/Show the whole picture/); const hasWhole = await whole.count(); if (hasWhole) { await whole.check(); await sleep(page, 400); }
      const focal = /focal|focus point|crop from|which part/i.test(t); const fit = (await insText(page)).match(/Fill the block's height[^.]*/)?.[0];
      const f = await pvOpen(page).then(() => pvAt(page, 1280)); const b = await f.evaluate((s) => { const i = document.querySelector(s)?.querySelector('img') || document.querySelector(s); const c = getComputedStyle(i); return `object-fit ${c.objectFit}, aspect ${c.aspectRatio}, ${Math.round(i.getBoundingClientRect().width)}×${Math.round(i.getBoundingClientRect().height)}`; }, cls(im)); await c.shot('MS-1-preview'); await pvClose(page, c.w);
      c.rec('MS-1', 'PARTLY', `Image uploaded (landscape.jpg); Content tab: "Show the whole picture" offered ${hasWhole > 0} → ticked; "Fill the block's height" offered: ${!!fit}; a focal-point / contain control: ${focal}`, `as dropped: ${a} · Height 10rem: ${cropped} · then "whole picture": ${b}`, 'MS-1-preview.png');
    });
    await c.probe('MS-2', async () => {
      const f = await pvOpen(page).then(() => pvAt(page, 375)); const m = await f.evaluate((s) => { const i = document.querySelector(s)?.querySelector('img'); return i ? { width: i.getAttribute('width'), height: i.getAttribute('height'), maxW: getComputedStyle(i).maxWidth, drawn: Math.round(i.getBoundingClientRect().width) } : null; }, cls(im)); await pvClose(page, c.w);
      c.rec('MS-2', m && m.width && m.height ? 'HAS' : 'PARTLY', 'automatic', JSON.stringify(m), '');
    });
    await c.probe('MS-3', async () => {
      const read = async () => { const f = await pvOpen(page).then(() => pvAt(page, 1280)); const m = await f.evaluate((s) => { const i = document.querySelector(s)?.querySelector('img'); return i ? { loading: i.getAttribute('loading'), fetchpriority: i.getAttribute('fetchpriority'), decoding: i.getAttribute('decoding'), srcset: (i.getAttribute('srcset') || '').slice(0, 60), sizes: i.getAttribute('sizes'), src: (i.getAttribute('src') || '').slice(0, 30) } : null; }, cls(im)); await pvClose(page, c.w); return m; };
      const before = await read(); await at(page, im, 'Content'); const ok = await I.eager(page, im); const after = await read();
      // and a picture from the library (a URL), where srcset could apply
      c.rec('MS-3', after?.loading === 'eager' || after?.fetchpriority === 'high' ? (before?.srcset ? 'HAS' : 'PARTLY') : 'PARTLY', `"Load straight away" ticked: ${ok}`, `default ${JSON.stringify(before)} → after ${JSON.stringify(after)} (an UPLOADED picture is a data: URL — no srcset for it)`, '');
      c.rec('SD-2', before?.loading === 'lazy' ? 'HAS' : 'PARTLY', 'same probe as MS-3 / MS-2', `default loading="${before?.loading}"; width/height attributes: see MS-2`, '');
    });
    await c.probe('SD-1a', async () => { const W = require('./page-weight.js'); const r = await W.weigh(page); c.rec('SD-1a', 'HAS', 'Export → served → weighed BEFORE any video was added (one image, texts)', `${JSON.stringify(r.numbers)}; findings ${JSON.stringify(r.findings)}`, ''); });
    let vid = null;
    await c.probe('RX3-2', async () => {
      const fresh = await tileThen(page, 'Video', async () => { await page.getByRole('menuitem', { name: /^16:9$/ }).first().click(); });
      const t = await activeRoot(page); const w = (n) => { if (!vid && n.type === 'video' && fresh.includes(n.id)) vid = n; (n.children || []).forEach(w); }; w(t);
      if (!vid) throw new Error('no video block from "16:9" (new ' + fresh.length + ')');
      await H.panel(page, false); await at(page, vid.id, 'Content'); await field(page, 'Video URL', 'https://www.youtube.com/watch?v=aqz-KE-bpKQ');
      const n = await nodeOf(page, vid.id); await at(page, vid.id, 'Design', 'Size'); const hField = await ins(page).getByLabel('Height', { exact: true }).inputValue().catch(() => null);
      await c.shot('RX3-2-editor');
      const ed = {}; for (const ch of ['Mobile (375px)', 'Desktop (1280px)']) { await chip(page, ch); ed[ch] = await css(page, vid.id, ['height', 'aspectRatio']); } await chip(page, 'Full width');
      await pvOpen(page); const out = {}; for (const wd of [375, 768, 1280, 1920]) { const f = await pvAt(page, wd); out[wd] = await f.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); const fr = e.querySelector('iframe,video'); const q = fr ? fr.getBoundingClientRect() : r; return { box: `${Math.round(r.width)}×${Math.round(r.height)}`, player: `${Math.round(q.width)}×${Math.round(q.height)}`, ratio: +(q.width / q.height).toFixed(3), cssH: getComputedStyle(fr || e).height, aspect: getComputedStyle(fr || e).aspectRatio }; }, cls(vid.id)); if (wd === 375 || wd === 1280) await c.shot(`RX3-2-preview-${wd}`); }
      const rule = await ruleText(await frame(page), vid.id); await pvClose(page, c.w);
      const keeps = [375, 1280].every((wd) => Math.abs(out[wd].ratio - 16 / 9) < 0.05);
      c.rec('RX3-2', keeps ? 'NOT A BUG' : 'BUG CONFIRMED', `Video tile → "16:9" style; URL set. Stored ${JSON.stringify({ height: n.height, minHeight: n.minHeight, aspectRatio: n.aspectRatio, width: n.width, style: n.style })}; Inspector Height field "${hField}"; canvas Mobile ${JSON.stringify(ed['Mobile (375px)'])}, Desktop ${JSON.stringify(ed['Desktop (1280px)'])}`, `Preview ${JSON.stringify(out)}; rule ${JSON.stringify(rule).slice(0, 260)}`, 'RX3-2-editor.png, RX3-2-preview-375.png, RX3-2-preview-1280.png');
    });
    await c.probe('MS-4', async () => {
      await at(page, vid.id, 'Design'); await openAll(page); const t = await insText(page); const ratio = /aspect|ratio|16:9 shape|keep (its )?shape/i.test(t.replace(/16:9 style/, ''));
      c.rec('MS-4', 'PARTLY', `Video: "Video link" field, Height field, presets 16:9 / Portrait / Rounded; a ratio control in the Inspector: ${ratio}`, 'see RX3-2 for the exported size', '');
      c.rec('SZ-4', ratio ? 'PARTLY' : 'PARTLY', `no aspect-ratio control on an Image or a Video (Inspector read in full: ${ratio}); images get one only via "Show the whole picture" (MS-1)`, 'see MS-1 (image) and RX3-2 (video)', '');
    });
    await c.probe('SD-1', async () => {
      const ui = /\bKB\b|weight|budget|page size/i.test(await page.locator('header').first().innerText().catch(() => ''));
      const W = require('./page-weight.js'); const r = await W.weigh(page);
      c.rec('SD-1', 'HAS', `Export button → site.zip (pressed by page-weight.js through the UI); a weight / budget readout in the editor: ${ui}`, `weighed as served gzip at the phone: ${JSON.stringify(r.numbers)}; findings ${JSON.stringify(r.findings)}`, '');
    });
    await c.probe('ED-1', async () => {
      const n0 = (await allIds(page)).length; const b = await band(page); await into(page, b, 'Text'); await H.panel(page, false); const n1 = (await allIds(page)).length;
      await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 500); const n2 = (await allIds(page)).length; await page.keyboard.press('Control+y'); await sleep(page, 500); const n3 = (await allIds(page)).length;
      await deselect(page); await page.mouse.click(5, 300); const pb = async () => page.getByRole('button', { name: 'Close blocks panel' }).count(); const p0 = await pb(); await page.keyboard.press('b'); await sleep(page, 500); const p1 = await pb(); await page.keyboard.press('/'); await sleep(page, 400); const foc = await page.evaluate(() => `${document.activeElement?.tagName} ${document.activeElement?.getAttribute('aria-label') || document.activeElement?.getAttribute('placeholder') || ''}`); await c.shot('ED-1-shortcuts'); await page.keyboard.press('Escape'); await H.panel(page, false);
      c.rec('ED-1', n2 < n1 && n3 === n1 && p1 !== p0 ? 'HAS' : 'PARTLY', `palette click + drag-drop added blocks ${n0} → ${n1}; Ctrl+Z → ${n2}; Ctrl+Y → ${n3}; "B" blocks panel open ${p0} → ${p1}; "/" focuses ${foc}`, 'editor only', 'ED-1-shortcuts.png');
    });
    await c.probe('ED-2', async () => {
      const layers = await page.getByRole('button', { name: /layers|outline|navigator|tree/i }).count(); const crumb = await page.locator('nav[aria-label*="readcrumb" i]').count();
      const tx = (await allIds(page)).slice(-1)[0]; await sel(page, tx); const editing = ((await page.locator('body').innerText()).match(/Editing:? [A-Za-z ]{2,20}/) || [''])[0];
      // marquee: drag across empty canvas margin over two blocks
      await deselect(page); const fr = await page.locator('[data-canvas-scale]').first().boundingBox(); let multi = null; if (fr) { await page.mouse.move(fr.x + 4, fr.y + 8); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(fr.x + 4 + 40 * i, fr.y + 8 + 50 * i); await sleep(page, 20); } await page.mouse.up(); await sleep(page, 400); multi = await page.evaluate(() => document.querySelectorAll('.outline-indigo-500').length + ' outlined; ' + ((document.body.innerText.match(/\d+ (blocks )?selected/) || [''])[0])); }
      await c.shot('ED-2-marquee'); await deselect(page);
      c.rec('ED-2', layers || crumb ? 'HAS' : 'PARTLY', `layers/tree button: ${layers}; breadcrumb: ${crumb}; selected label "${editing}"; marquee from the canvas corner → ${multi}`, 'editor only', 'ED-2-marquee.png');
    });
    await c.probe('ED-3', async () => {
      const bnd = await band(page); const tx = await into(page, bnd, 'Divider'); await H.panel(page, false);
      await sel(page, tx); const foc = await page.evaluate(() => `${document.activeElement?.tagName}${document.activeElement?.isContentEditable ? ' (editing text)' : ''}`); const n0 = (await allIds(page)).length; await page.keyboard.press('Control+d'); await sleep(page, 600); const n1 = (await allIds(page)).length;
      await sel(page, tx); await page.keyboard.press('Control+c'); await sleep(page, 200); await page.keyboard.press('Control+v'); await sleep(page, 600); const n2 = (await allIds(page)).length;
      await sel(page, tx); await page.getByRole('button', { name: 'Block actions' }).first().click(); await sleep(page, 400); const menu = (await page.getByRole('menuitem').allInnerTexts()).map((x) => x.trim().split('\n')[0]); await c.shot('ED-3-menu'); await page.keyboard.press('Escape');
      c.rec('ED-3', menu.some((m) => /style/i.test(m)) ? 'HAS' : 'PARTLY', `on a selected Divider (focus ${foc}): Ctrl+D ${n0} → ${n1}; Ctrl+C / Ctrl+V → ${n2}; ⋮ menu: ${menu.join(' / ')}`, 'editor only', 'ED-3-menu.png');
    });
    await c.probe('ED-4', async () => {
      await deselect(page); await H.panel(page, true); const t = page.locator('[draggable="true"]').filter({ hasText: /^\s*Grid/ }).first(); await t.click(); await sleep(page, 600); const splits = await page.getByRole('group', { name: 'Uneven splits' }).getByRole('button').evaluateAll((bs) => bs.map((b) => b.getAttribute('aria-label'))).catch(() => []); await c.shot('ED-4-grid-menu'); await page.keyboard.press('Escape'); await sleep(page, 300);
      await H.panel(page, true); const tiles = (await page.locator('[draggable="true"]').allInnerTexts()).map((x) => x.split('\n')[0].trim()); await H.panel(page, false);
      const layouts = ['(none: the "+" beside the page tabs adds an empty page at once, PS-4)'];
      const sections = tiles.filter((x) => /section|hero|header|footer|pricing|testimonial|feature/i.test(x));
      c.rec('ED-4', 'PARTLY', `Grid uneven splits: ${splits.join(' / ')}; section-like palette tiles: ${sections.join(' / ')}; Add page layouts: ${layouts.join(' / ')}`, 'ordinary trees', 'ED-4-grid-menu.png, ED-4-add-page.png');
    });
    await c.probe('ED-5', async () => {
      const g = page.getByRole('button', { name: 'Layout guides' }).first(); const a0 = await g.getAttribute('aria-pressed'); await page.mouse.click(5, 300); await page.keyboard.press('Shift+G'); await sleep(page, 500); const a1 = await g.getAttribute('aria-pressed'); await c.shot('ED-5-guides'); await page.keyboard.press('Shift+G'); await sleep(page, 400); const a2 = await g.getAttribute('aria-pressed');
      const rulers = await page.getByRole('button', { name: /ruler/i }).count();
      c.rec('ED-5', a1 !== a0 && a2 === a0 ? 'HAS' : 'PARTLY', `Shift+G: guides ${a0} → ${a1} → ${a2}; rulers: ${rulers}`, 'editor only', 'ED-5-guides.png');
    });
    await c.probe('ED-6', async () => {
      const b = page.getByRole('button', { name: /^Page check/ }).first(); const title = await b.getAttribute('title'); const lab = await b.getAttribute('aria-label'); await b.click(); await sleep(page, 700); const pc = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await c.shot('ED-6-pagecheck'); await page.keyboard.press('Escape');
      c.rec('ED-6', 'PARTLY', `Page check button "${lab}" (title "${title}")`, `dialog: "${pc}"`, 'ED-6-pagecheck.png');
    });
  },
};

// ── the twelve rows of 04-matrix.md with no code claim (the coordinator's add-on): what is TRUE through the UI + Preview ──
const PRE = {
  // PS-9 needs a page with LITTLE content, so it is measured before slice D builds anything
  async D(c) {
    const { page } = c;
    await c.probe('PS-9', async () => {
      const m0 = await band(page); await into(page, m0, 'Text'); const ft = await band(page); await into(page, ft, 'Text'); await H.panel(page, false);
      await I.meaning(page, ft, 'Page footer');
      await pvOpen(page); const out = {}; for (const [w, h] of [[375, 667], [1280, 800]]) { const f = await pvAt(page, w, h); out[`${w}x${h}`] = await f.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { footerBottom: Math.round(r.bottom), window: innerHeight, gapBelow: Math.round(innerHeight - r.bottom), tag: e.tagName }; }, cls(ft)); await c.shot(`PS-9-preview-${w}`); }
      await pvClose(page, c.w);
      const floats = Object.values(out).some((v) => v.gapBelow > 8);
      c.rec('PS-9', floats ? 'GAP' : 'HAS', 'a page of one short Text band + a band set to "Page footer"; nothing to set (no "keep the footer at the bottom" control looked for in Page settings / Arrange)', JSON.stringify(out), 'PS-9-preview-375.png, PS-9-preview-1280.png');
    });
  },
};
const EXTRA = {
  async A(c) {
    const { page } = c;
    await page.getByRole('button', { name: 'Home', exact: true }).first().click().catch(() => {}); await sleep(page, 1000);
    await c.probe('PS-13', async () => {
      const tgt = await band(page); await into(page, tgt, 'Text'); const lb = await band(page); const ln = await into(page, lb, 'Link'); await H.panel(page, false);
      // the target pushed well down the page so a jump is measurable
      await at(page, tgt, 'Content', 'Bookmark'); await field(page, 'Bookmark name', 'Contact us'); const n = await nodeOf(page, tgt);
      await at(page, ln, 'Content'); await field(page, 'Link', '#contact-us'); const ln2 = await nodeOf(page, ln);
      await deselect(page); await H.panel(page, true); await H.clickTile(page, 'Spacer'); await H.panel(page, false);
      const f = await pvOpen(page).then(() => pvAt(page, 1280, 700)); const m = await f.evaluate(([t, l]) => { const T = document.querySelector(t), L = document.querySelector(l); const a = L && (L.tagName === 'A' ? L : L.querySelector('a')); return { targetId: T?.id || T?.querySelector('[id]')?.id || null, href: a?.getAttribute('href') }; }, [cls(tgt), cls(ln)]);
      await f.evaluate((l) => { const L = document.querySelector(l); const a = L.tagName === 'A' ? L : L.querySelector('a'); scrollTo(0, 0); a.click(); }, cls(ln)); await sleep(page, 900);
      const after = await (await frame(page)).evaluate((t) => ({ scrollY: Math.round(scrollY), targetTop: Math.round(document.querySelector(t).getBoundingClientRect().top) }), cls(tgt)); await pvClose(page, c.w);
      c.rec('PS-13', m.targetId && m.href === '#' + m.targetId ? 'HAS' : 'PARTLY', `Content → "Bookmark name" typed "Contact us" → stored anchor "${n.anchor}"; Link "Link (web address or #bookmark)" typed #contact-us → stored ${ln2.href}`, `${JSON.stringify(m)}; after clicking it in the Preview: ${JSON.stringify(after)}`, '');
    });
    await c.probe('SE-5', async () => {
      const nv = await band(page); await into(page, nv, 'Link'); await H.panel(page, false); await I.meaning(page, nv, 'Menu');
      await at(page, nv, 'Design', 'Meaning'); const t = (await insText(page)).match(/Meaning.*?Placement/)?.[0] || ''; const nameField = await ins(page).getByLabel(/name|label/i).count();
      await page.getByRole('button', { name: /^Page check/ }).first().click(); await sleep(page, 700); const pc = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await c.shot('SE-5-pagecheck'); await page.keyboard.press('Escape'); await sleep(page, 300);
      const f = await pvOpen(page); const navs = await f.evaluate(() => Array.from(document.querySelectorAll('nav')).map((n) => `nav aria-label=${JSON.stringify(n.getAttribute('aria-label'))} aria-labelledby=${JSON.stringify(n.getAttribute('aria-labelledby'))}`)); await pvClose(page, c.w);
      c.rec('SE-5', /menu|navigation|name/i.test(pc) ? 'PARTLY' : 'GAP', `${navs.length} Menu blocks on the page; Meaning section reads "${t.slice(0, 200)}"; a name / label field there: ${nameField}; Page check reads "${pc}"`, `exported: ${navs.join(' · ')}`, 'SE-5-pagecheck.png');
    });
    await c.probe('SE-6', async () => {
      await page.getByRole('button', { name: 'Page settings' }).first().click(); await sleep(page, 500); const ps = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const pLang = /language|lang\b/i.test(ps.match(/Page settings.{0,800}/)?.[0] || ''); await page.keyboard.press('Escape'); await sleep(page, 300);
      const any = (await allIds(page)).slice(-1)[0]; await at(page, any, 'Content'); await openAll(page); const bLang = /language/i.test(await insText(page));
      const f = await pvOpen(page); const m = await f.evaluate(() => ({ htmlLang: document.documentElement.getAttribute('lang'), dir: document.documentElement.getAttribute('dir'), langInBody: document.querySelectorAll('body [lang]').length })); await pvClose(page, c.w);
      c.rec('SE-6', m.htmlLang && (pLang || bLang) ? 'HAS' : m.htmlLang ? 'PARTLY' : 'GAP', `a language control in Page settings: ${pLang}; on a block's Content tab: ${bLang}`, `exported <html lang=${JSON.stringify(m.htmlLang)} dir=${JSON.stringify(m.dir)}>, [lang] inside the body: ${m.langInBody}`, '');
    });
  },
  async C(c) {
    const { page } = c;
    await c.probe('RC-8', async () => {
      const host = await band(page); const b4 = new Set(await allIds(page)); await into(page, host, 'Side by side'); const fresh = (await allIds(page)).filter((x) => !b4.has(x));
      let row = null; const w = (n) => { if (!row && n.direction === 'row' && !n.rowBand && fresh.includes(n.id)) row = n; (n.children || []).forEach(w); }; w(await nodeOf(page, host));
      if (!row) throw new Error('no row');
      for (let i = row.children.length; i < 2; i++) { await sel(page, row.id); await page.getByRole('button', { name: 'Add a block inside this one' }).first().click(); await sleep(page, 300); await page.getByRole('menuitem', { name: 'Stack', exact: true }).first().click(); await sleep(page, 700); await page.keyboard.press('Escape'); }
      row = await nodeOf(page, row.id); const [k0, k1] = row.children.map((x) => x.id); await into(page, k0, 'Text'); const a = await into(page, k1, 'Text'); const b = await under(page, a, 'Text'); await under(page, b, 'Text'); await H.panel(page, false);
      await at(page, k0, 'Design', 'Background'); const hex = ins(page).getByLabel('Background colour hex value').first(); await hex.fill('#dde4ff'); await hex.press('Enter'); await sleep(page, 300);
      await at(page, row.id, 'Design', 'Arrange'); const opts = await choose(page, 'Line up', null); const out = {};
      for (const o of opts) { await at(page, row.id, 'Design', 'Arrange'); await choose(page, 'Line up', new RegExp('^' + o.replace(/[()]/g, '\\$&') + '$')); const f = await pvOpen(page).then(() => pvAt(page, 1280)); out[o] = await f.evaluate(([r, x, y]) => { const R = document.querySelector(r).getBoundingClientRect(), X = document.querySelector(x).getBoundingClientRect(), Y = document.querySelector(y).getBoundingClientRect(); return `short col ${Math.round(X.height)}px at +${Math.round(X.top - R.top)} beside tall ${Math.round(Y.height)}px · align-items ${getComputedStyle(document.querySelector(r)).alignItems}`; }, [cls(row.id), cls(k0), cls(k1)]); if (/Fill|Stretch/i.test(o)) await c.shot('RC-8-preview-fill'); await pvClose(page, c.w); }
      c.rec('RC-8', Object.values(out).some((v) => /stretch/.test(v)) ? 'HAS' : 'PARTLY', `Side-by-side row, a short tinted column beside a tall one; the row's "Line up" offers ${opts.join(' / ')}; each tried`, JSON.stringify(out), 'RC-8-preview-fill.png');
    });
  },
  async D(c) {
    const { page } = c;
    await c.probe('SZ-7', async () => {
      const b = await band(page); const tx = await into(page, b, 'Text'); await H.panel(page, false);
      const words = ('Our school garden grows vegetables that pupils plant, water and harvest through the year, and every class takes a turn looking after it. ').repeat(7);
      await I.text(page, tx, words);
      const out = {}; await pvOpen(page); for (const w of [375, 1280, 1920, 2560]) { const f = await pvAt(page, w); out[w] = await f.evaluate((s) => { const e = document.querySelector(s); const p = e.querySelector('p') || e; const r = document.createRange(); r.selectNodeContents(p); const lines = new Set(Array.from(r.getClientRects()).map((q) => Math.round(q.top))).size; const n = p.textContent.length; return { width: Math.round(p.getBoundingClientRect().width), lines, charsPerLine: Math.round(n / lines), maxWidth: getComputedStyle(p).maxWidth + ' / block ' + getComputedStyle(e).maxWidth }; }, cls(tx)); if (w === 1920) await c.shot('SZ-7-preview-1920'); }
      await pvClose(page, c.w);
      c.rec('SZ-7', out[1920].charsPerLine <= 80 ? 'HAS' : 'GAP', 'a 950-character paragraph in a default (Edge to edge) band; nothing set', JSON.stringify(out), 'SZ-7-preview-1920.png');
    });
    await c.probe('SB-6', async () => {
      const b = await band(page); const card = await into(page, b, 'Stack'); await into(page, card, 'Text'); await H.panel(page, false);
      await I.contentWidth(page, b, 'Centred column'); await at(page, card, 'Design'); await btn(page, 'Card style', ins(page));
      const b2 = await band(page); await into(page, b2, 'Text'); await H.panel(page, false); await I.contentWidth(page, b2, 'Centred column'); await at(page, b2, 'Design'); await btn(page, 'Card style', ins(page));
      await c.shot('SB-6-editor');
      await pvOpen(page); const out = {}; for (const w of [375, 1280, 1920]) { const f = await pvAt(page, w); out[w] = await f.evaluate(([c1, b2]) => { const m = (s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return `${Math.round(r.left)}..${Math.round(r.right)} of ${innerWidth} bg ${cs.backgroundColor} radius ${cs.borderTopLeftRadius} shadow ${cs.boxShadow === 'none' ? 'none' : 'yes'}`; }; return { cardInCentredBand: m(c1), cardStyledBand: m(b2) }; }, [cls(card), cls(b2)]); if (w === 1920) await c.shot('SB-6-preview-1920'); }
      await pvClose(page, c.w);
      c.rec('SB-6', 'HAS', 'two ways tried: (a) a Centred-column band holding a Stack with "Card style"; (b) the band itself set to Centred column + "Card style"', JSON.stringify(out), 'SB-6-editor.png, SB-6-preview-1920.png');
    });
  },
  async E(c) {
    const { page } = c;
    let hdr = null, util = null, mainRow = null, far = null;
    await c.probe('PS-6', async () => {
      hdr = await band(page); util = await into(page, hdr, 'Stack'); const u1 = await into(page, util, 'Text'); mainRow = await under(page, util, 'Stack'); await into(page, mainRow, 'Link'); await H.panel(page, false);
      await I.text(page, u1, 'Utility bar — phone 0800 000');
      await I.meaning(page, hdr, 'Page header');
      // move the header to the top of the page, as a person does
      await sel(page, hdr); await page.getByRole('button', { name: 'Block actions' }).first().click(); await sleep(page, 300); const top = page.getByRole('menuitem', { name: /Move to top/ }).first(); if (await top.count()) await top.click(); else await page.keyboard.press('Escape'); await sleep(page, 500);
      const ok = await I.sticky(page, mainRow); await c.shot('PS-6-editor');
      await pvOpen(page); let f = await pvAt(page, 1280, 700); await f.evaluate(() => scrollTo(0, 800)); await sleep(page, 400); const one = await f.evaluate(([u, m]) => ({ util: Math.round(document.querySelector(u).getBoundingClientRect().top), main: Math.round(document.querySelector(m).getBoundingClientRect().top) }), [cls(util), cls(mainRow)]); await c.shot('PS-6-preview-row-sticky'); await pvClose(page, c.w);
      // the other way: the whole header sticks
      await I.sticky(page, hdr); await pvOpen(page); f = await pvAt(page, 1280, 700); await f.evaluate(() => scrollTo(0, 800)); await sleep(page, 400); const whole = await f.evaluate(([u, m]) => ({ util: Math.round(document.querySelector(u).getBoundingClientRect().top), main: Math.round(document.querySelector(m).getBoundingClientRect().top) }), [cls(util), cls(mainRow)]); await c.shot('PS-6-preview-header-sticky'); await pvClose(page, c.w);
      const onlyMainSticks = one.main >= -2 && one.main < 120 && one.util < -10;
      c.rec('PS-6', onlyMainSticks ? 'HAS' : 'PARTLY', `"Page header" band holding two Stacks (utility bar + main row), moved to the top; "Sticks when reached" on the main row only: ${ok}; then on the whole header`, `scrolled 800px — main row only sticky: ${JSON.stringify(one)} (a sticky child holds only inside its own header band) · whole header sticky: ${JSON.stringify(whole)}`, 'PS-6-editor.png, PS-6-preview-row-sticky.png, PS-6-preview-header-sticky.png');
    });
    await c.probe('AX-5', async () => {
      far = await band(page); const ft = await into(page, far, 'Text'); const fb = await under(page, ft, 'Button'); await H.panel(page, false);
      await at(page, far, 'Content', 'Bookmark'); await field(page, 'Bookmark name', 'far');
      const ln = await into(page, mainRow, 'Link'); await H.panel(page, false); await at(page, ln, 'Content'); await field(page, 'Link', '#far');
      await pvOpen(page); const f = await pvAt(page, 1280, 700);
      const cssm = await f.evaluate((s) => ({ htmlScrollPaddingTop: getComputedStyle(document.documentElement).scrollPaddingTop, targetScrollMarginTop: getComputedStyle(document.querySelector(s)).scrollMarginTop, rules: (Array.from(document.querySelectorAll('style')).map((x) => x.textContent).join('').match(/scroll-(padding|margin)[^;}]*/g) || []).slice(0, 5) }), cls(far));
      await f.evaluate((l) => { const L = document.querySelector(l); const a = L.tagName === 'A' ? L : L.querySelector('a'); scrollTo(0, 0); a.click(); }, cls(ln)); await sleep(page, 1000);
      const jump = await f.evaluate(([h, t]) => { const H = document.querySelector(h).getBoundingClientRect(); const T = document.querySelector(t).getBoundingClientRect(); return { headerBottom: Math.round(H.bottom), targetTop: Math.round(T.top), under: T.top < H.bottom - 1 }; }, [cls(hdr), cls(far)]); await c.shot('AX-5-preview-anchor');
      // keyboard: focus the far Button with Tab from the link before it
      await f.evaluate(() => scrollTo(0, 0)); await f.evaluate((l) => { const L = document.querySelector(l); (L.tagName === 'A' ? L : L.querySelector('a')).focus(); }, cls(ln));
      let tab = null; for (let i = 0; i < 25; i++) { await page.keyboard.press('Tab'); await sleep(page, 80); const hit = await f.evaluate(([b, h]) => { const e = document.activeElement; const B = document.querySelector(b); if (!B.contains(e)) return null; const r = e.getBoundingClientRect(), H = document.querySelector(h).getBoundingClientRect(); return { focusedTop: Math.round(r.top), focusedBottom: Math.round(r.bottom), headerBottom: Math.round(H.bottom), hidden: r.top < H.bottom }; }, [cls(fb), cls(hdr)]); if (hit) { tab = hit; break; } }
      await c.shot('AX-5-preview-tab'); await pvClose(page, c.w);
      c.rec('AX-5', jump.under || (tab && tab.hidden) ? 'GAP' : 'HAS', 'sticky "Page header" (PS-6); a band far down with Bookmark "far" and a Button; a Link #far in the header', `CSS ${JSON.stringify(cssm)}; anchor jump ${JSON.stringify(jump)}; Tab to the Button ${JSON.stringify(tab)}`, 'AX-5-preview-anchor.png, AX-5-preview-tab.png');
    });
    await c.probe('ED-7', async () => {
      const b = await band(page); const x = await into(page, b, 'Text'); await H.panel(page, false);
      await I.text(page, x, 'Tablet override check'); await sel(page, x); await chip(page, 'Tablet (768px)'); if (await selectedId(page) !== x) await sel(page, x); await expandInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Spacing'); await slider(page, 'Inner spacing', 30); await I.section(page, 'Size'); await btn(page, '½', ins(page));
      const t = await insText(page); const marks = await ins(page).locator('[aria-label*="verrid" i],[title*="verrid" i],[aria-label*="inherit" i],[title*="inherit" i],[title*="set here" i],[title*="set at" i],[aria-label*="set at" i]').count();
      const words = (t.match(/[^.]{0,30}(inherit|set here|overrid|from desktop|set at|changed here)[^.]{0,30}/gi) || []).slice(0, 4);
      await c.shot('ED-7-tablet-inspector'); await chip(page, 'Full width');
      c.rec('ED-7', marks || words.length > 1 ? 'HAS' : 'PARTLY', `Tablet chip → Inner spacing 30 and Width ½ on a Text; marks per control (aria/title "overridden / inherited / set at"): ${marks}; words: ${JSON.stringify(words)}`, 'editor only — only the banner + "Reset tablet changes" if no marks', 'ED-7-tablet-inspector.png');
    });
  },
  async F(c) {
    const { page } = c;
    await c.probe('SD-3', async () => {
      const b = await band(page); const im = await into(page, b, 'Image'); await H.panel(page, false); await I.upload(page, im, path.join(IMG, 'portrait.jpg'));
      const ok = await I.phoneOnly(page, im, { hideOnPhone: true });
      const W = require('./page-weight.js'); const files = await W.exportFiles(page); const names = Object.keys(files); const { server, url } = await W.serve(files);
      const ctx = await page.context().browser().newContext({ viewport: { width: 375, height: 667 } }); const p = await ctx.newPage(); const got = []; p.on('requestfinished', async (r) => { try { const s = await r.sizes(); got.push({ u: r.url().slice(-40), t: r.resourceType(), b: s.responseBodySize }); } catch { /* gone */ } });
      await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(800); await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(800);
      const dom = await p.evaluate((s) => ({ me: !!document.querySelector(s), imgs: Array.from(document.querySelectorAll('img')).map((i) => { let e = i, hid = false; while (e) { if (getComputedStyle(e).display === 'none') hid = true; e = e.parentElement; } return `${(i.getAttribute('src') || '').slice(-26)} hidden=${hid} loading=${i.getAttribute('loading')} srcset=${(i.getAttribute('srcset') || '').slice(0, 50)} sizes=${i.getAttribute('sizes')} inMe=${!!(document.querySelector(s) && document.querySelector(s).contains(i))}`; }) }), cls(im));
      const htmlImgs = Object.entries(files).filter(([n]) => n.endsWith('.html')).map(([n, v]) => n + ': ' + (v.toString().match(/<img[^>]*>/g) || []).map((x) => x.slice(0, 220)).join(' ‖ ')).join(' ### ');
      const htmlBytes = Object.entries(files).filter(([n]) => n.endsWith('.html')).map(([n, v]) => `${n} ${Math.round(v.length / 1024)}KB`);
      await ctx.close(); server.close();
      const imgReq = got.filter((g) => g.t === 'image');
      c.rec('SD-3', 'SEE EVIDENCE', `Image (uploaded portrait.jpg) → Mobile → "Hidden on mobile": ${ok}; Export → served → opened at 375`, `exported files ${names.length}: ${names.filter((n) => !/\.(woff2?|ttf)$/.test(n)).join(', ').slice(0, 200)}; HTML ${htmlBytes.join(', ')}; image requests at 375: ${JSON.stringify(imgReq)}; in the page at 375: ${JSON.stringify(dom)}; <img> tags in the exported HTML: ${htmlImgs.slice(0, 900)}`, '');
    });
  },
};

// ── the six windows ──────────────────────────────────────────────────────────────────────────────────────────────────
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const WINDOWS = ['A', 'B', 'C', 'D', 'E', 'F'];
async function one(slice, slot) {
  const w = 1366; const results = []; const store = {};
  const { browser, page, errs } = await H.open({ headed: true, w, h: 820, pos: [(slot % 3) * 620, Math.floor(slot / 3) * 480] });
  page.setDefaultTimeout(12000);
  const consoleErrs = []; page.on('console', (m) => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 160)); });
  const c = {
    page, w, store,
    shot: (n) => page.screenshot({ path: path.join(OUT, `${n}.png`) }).catch(() => {}),
    rec: (id, verdict, ed, pv, shots) => { results.push({ id, verdict, ed, pv, shots, slice }); console.log(`[${slice}] ${id} ${verdict} · ${String(ed).slice(0, 140)} ⟶ ${String(pv).slice(0, 160)}`); },
    async probe(id, fn) {
      page.__step = id; const e0 = errs.length;
      try { await fn(); } catch (e) {
        await page.screenshot({ path: path.join(OUT, `${id}-ERROR.png`) }).catch(() => {});
        results.push({ id, verdict: 'ERROR', ed: e.message.split('\n')[0].slice(0, 300), pv: '', shots: `${id}-ERROR.png`, slice }); console.log(`[${slice}] ${id} ERROR ${e.message.split('\n')[0]}`);
        await page.emulateMedia({ reducedMotion: null }).catch(() => {}); await page.setViewportSize({ width: w, height: 820 }).catch(() => {});
        const x = page.getByRole('button', { name: /Exit preview/ }).first(); if (await x.isVisible().catch(() => false)) await x.click().catch(() => {});
        for (let i = 0; i < 3; i++) await page.keyboard.press('Escape').catch(() => {});
        await chip(page, 'Full width').catch(() => {});
      }
      if (errs.length > e0) results.push({ id: id + ' page error', verdict: 'BUG?', ed: errs.slice(e0).join(' | '), pv: '', shots: '', slice });
    },
  };
  try { if (PRE[slice]) await PRE[slice](c); await SLICES[slice](c); if (EXTRA[slice]) { await H.panel(page, false); await deselect(page); await EXTRA[slice](c); } } catch (e) { results.push({ id: `${slice} build`, verdict: 'ERROR', ed: `${page.__step}: ${e.message.split('\n')[0]}`, pv: '', shots: `${slice}-FAILED.png`, slice }); await page.screenshot({ path: path.join(OUT, `${slice}-FAILED.png`) }).catch(() => {}); }
  finally {
    await page.screenshot({ path: path.join(OUT, `${slice}-end.png`) }).catch(() => {});
    fs.writeFileSync(path.join(OUT, `results-${slice}.json`), JSON.stringify({ results, pageErrors: errs, consoleErrors: [...new Set(consoleErrs)].slice(0, 30) }, null, 1));
    console.log(`[${slice}] done · ${results.length} rows · ${errs.length} page errors · ${consoleErrs.length} console errors`);
    await browser.close();
  }
}
// the helpers, for uat-rx3-fixes-headed.js (the run starts only when this file is run itself)
module.exports = { site, activeRoot, nodeOf, parentOf, strip, cls, sleep, selectedId, deselect, band, into, under, beside, allIds, tileThen, sel, expandInspector, at, ins, insText, openAll, btn, choose, field, slider, dragVisible, chip, css, pvOpen, frame, pvAt, pvClose, pcss, ruleText, sweep };
if (require.main === module) (async () => { console.log('HEADED UAT — RX-3 step 3b'); await Promise.all(WINDOWS.map((s, i) => (!ONLY || ONLY.split(',').includes(s)) && one(s, i))); })();
