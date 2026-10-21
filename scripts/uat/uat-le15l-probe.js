// HEADED PROBE — BATCH LE-15l · a template is only a start (tests/features/components/website/template-fully-editable.feature).
// The user, 2026-10-20: "can I really edit everything even though I select the templates… move items around… shift it… put
// another stack next to it… another section inside the hero…". Every page is MADE THROUGH THE UI (Add page → a template); every
// block is selected by clicking it, moved by its grip, the bar's arrows or the keys, and things are dropped from the Blocks panel
// (RULE Y). ENUMERATED: the templates come from config/page-templates.json and the kinds of block from the page itself, so a
// template or a kind added later is driven the day it appears (RULE FOUNDATION). Each gesture is recorded as worked or not, with
// what was seen, and undone with Ctrl+Z — how many presses that took is recorded too.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le15l-probe.js [--tier=1|2|3] [--only=school-home:moves,…] [--w=1280]
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const { sleep } = require('./uat-rx3-headed.js');
const TEMPLATES = require('../../config/page-templates.json').templates;
const T = require('../../config/inspector.json').sections;
const OUT = path.join(__dirname, 'logs', 'le15l'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
// LE15l-6 · a leaf's second meaning and the element it draws (config/inspector.json `meaning`, the user's "useful few")
const LEAF = { text: 'blockquote', image: 'figure', list: 'ol', button: 'button' };
const MEANING = require('../../config/inspector.json').meaning;
const WIDTH = +((process.argv.find((a) => a.startsWith('--w=')) || '').slice(4) || 1600); // LE15l-e: at 1280 the open panel covers left sides
// LE15l-aj: under the editor's dock line a person is a FINGER — the Blocks panel is a sheet over the page (select, "Where the
// block goes", tap the tile), the Inspector is a tab ("Expand inspector"), and a docked bar has no grip (a long press lifts)
const FINGER = WIDTH < require('../../config/layout.json').editor.dockFrom;
const ONLY_G = (process.argv.find((a) => a.startsWith('--g=')) || '').slice(4); // re-measure only what a fix touched: one gesture by name
const TIER = +((process.argv.find((a) => a.startsWith('--tier=')) || '').slice(7) || 1); // 1 the templates · 2 every section · 3 every component
const results = [];
const rec = (job, kind, gesture, ok, seen) => { results.push({ job, kind, gesture, ok: ok === null ? null : !!ok, seen }); console.log(`[${job}] ${kind} · ${gesture} ${ok === null ? 'n/a' : ok ? 'WORKS' : 'NOT'} · ${seen}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});

/** The page a person makes: Add page → the template. */
async function makePage(page, tpl) {
  const add = page.getByRole('button', { name: 'Add page', exact: true }).first();
  if (!(await add.isVisible().catch(() => false))) { await page.getByRole('button', { name: 'More', exact: true }).first().click(); await sleep(page, 400); }
  await page.getByRole('button', { name: 'Add page', exact: true }).first().click();
  const d = page.getByRole('dialog', { name: T.addPageTitle }); await d.waitFor(); await sleep(page, 1500);
  await d.getByRole('textbox').fill('Probe'); await d.getByRole('button', { name: new RegExp(`^Add ${tpl.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},`) }).click();
  await sleep(page, 2500);
}
/** The page being edited, as stored. */
const root = (page) => page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const shown = new Set(Array.from(document.querySelectorAll('[data-box-id]')).map((e) => e.getAttribute('data-box-id')));
  const has = (n) => shown.has(n.id) || (n.children || []).some(has);
  return (s.pages.find((p) => has(p.root)) || s.pages[s.pages.length - 1]).root;
});
const walk = (n, f, parent = null, i = 0) => { f(n, parent, i); (n.children || []).forEach((c, k) => walk(c, f, n, k)); };
const where = (r, id) => { let out = null; walk(r, (n, p, i) => { if (n.id === id) out = { parent: p && p.id, index: i, siblings: p ? p.children.length : 1 }; }); return out; };
const count = (r) => { let k = 0; walk(r, () => k++); return k; };
/** What really moves: the block, or the wrapper(s) holding only it (a section sits alone in its page band). */
const unit = (r, id) => { let u = id; for (;;) { const w = where(r, u); if (!w || !w.parent || w.parent === r.id || w.siblings > 1) return u; let band = false; walk(r, (n) => { if (n.id === w.parent && n.rowBand) band = true; }); if (!band) return u; u = w.parent; } }; // LE15l-u: only through page bands — a block alone in its section stays in it
const at = (r, id) => where(r, unit(r, id));
const sig = async (page) => JSON.stringify(await root(page));
/** LE15l-r: the page as saved once it stops changing (up to 2.5 s) — a fixed 0.7 s read a component's move before it was saved. */
async function settle(page) { let a = await sig(page); for (let i = 0; i < 10; i++) { await sleep(page, 250); const b = await sig(page); if (b === a) return; a = b; } }
const rect = (page, id) => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, tag: e.tagName }; }, id);

/** Every kind of block on the page, one instance each — inside the page's own sections (not the shared header / footer) and,
 *  where the page has one, an instance with a neighbour on BOTH sides, so it can move either way. */
async function kinds(page) {
  const r = await root(page);
  const dom = await page.evaluate(() => Object.fromEntries(Array.from(document.querySelectorAll('[data-box-id]')).map((e) => [e.getAttribute('data-box-id'), { tag: e.tagName, shared: !!e.closest('header, footer'), vis: e.getBoundingClientRect().width > 0 }])));
  const cand = {};
  walk(r, (n, p) => {
    const d = dom[n.id]; if (!p || !d || !d.vis || n.rowBand) return; // LE15l-j: a page band is the wrapper a section sits in — nobody selects it
    const kind = d.tag === 'SECTION' ? 'section' : d.tag === 'HEADER' ? 'header' : d.tag === 'FOOTER' ? 'footer' : d.tag === 'NAV' ? 'menu'
      : p.layout === 'grid' ? (n.type === 'component' ? 'card in a grid' : 'grid cell')
      : n.type === 'container' || !n.type ? (n.layout === 'grid' ? 'grid' : n.direction === 'row' ? 'row' : 'stack')
      : n.type === 'component' ? `component (${n.component || n.name || '?'})` : n.type;
    const w = at(r, n.id); const middle = !!w && w.index > 0 && w.index < w.siblings - 1;
    const score = (d.shared && !['header', 'footer', 'menu'].includes(kind) ? 0 : 2) + (middle ? 1 : 0);
    if (!cand[kind] || score > cand[kind].score) cand[kind] = { id: n.id, container: n.type === 'container' || !n.type, cell: p.layout === 'grid', heading: n.type === 'heading', leaf: LEAF[n.type] ? n.type : null, oneMeaning: ['icon', 'divider', 'link'].includes(n.type) ? n.type : null, score };
  });
  return cand;
}

const esc = async (page) => {
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await sleep(page, 200);
  const shut = page.getByRole('button', { name: 'Collapse inspector', exact: true }); // LE15l-aj: a tab over the page, put away to reach the next block
  if (FINGER && (await shut.isVisible().catch(() => false))) { await shut.click(); await sleep(page, 300); }
};
const openInspector = async (page) => { const x = page.getByRole('button', { name: 'Expand inspector', exact: true }); if (await x.isVisible().catch(() => false)) { await x.click(); await sleep(page, 400); } };
/** Back to the page as it was: Ctrl+Z until it is, at most 4 presses; how many it took. */
async function undoTo(page, base) {
  await esc(page); if ((await sig(page)) === base) return 0;
  for (let i = 1; i <= 4; i++) { await page.keyboard.press('Control+z'); await sleep(page, 500); if ((await sig(page)) === base) return i; }
  return -1;
}
const selectedId = (page) => page.evaluate(() => document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror') || null);
async function pick(page, id) {
  await esc(page);
  try { await H.select(page, id); await sleep(page, 250); return; } catch { /* a click never lands on it alone: go in, then out */ }
  const kid = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${CSS.escape(id)}"] [data-box-id]`); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, id);
  if (!kid) throw new Error(`could not select ${id.slice(-4)}`);
  await sleep(page, 300); for (let i = 0; i < 4 && (await selectedId(page)) !== id; i++) { await page.mouse.click(kid.x, kid.y); await sleep(page, 300); }
  for (let i = 0; i < 6 && (await selectedId(page)) !== id; i++) { await page.keyboard.press('Escape'); await sleep(page, 250); }
  if ((await selectedId(page)) !== id) throw new Error(`could not select ${id.slice(-4)} by clicking inside and stepping out`);
}
const bar = (page) => page.getByRole('toolbar', { name: 'Block toolbar' });
/** The Blocks panel open on "All" — it reopens on the tab it was left on (Sections, in tier 2): LE15l-n. */
async function blocksPanel(page) { await H.panel(page, true); const all = page.getByRole('tab', { name: 'All', exact: true }).first(); if (await all.isVisible().catch(() => false)) { await all.click(); await sleep(page, 300); } }
const mouseHand = (page, at) => ({ at, down: async () => { await page.mouse.move(at.x, at.y); await page.mouse.down(); }, move: (x, y) => page.mouse.move(x, y), up: () => page.mouse.up() });
/** A finger held 650 ms (the editor lifts at 500), then moved — real touch events, as tests/e2e/phone-editing.spec.ts sends. */
function fingerHand(page, at) {
  let cdp = null; // opened on the press, so a gesture that never presses leaves nothing open
  const t = (type, p) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: p ? [{ x: Math.round(p.x), y: Math.round(p.y), id: 1 }] : [] });
  return { at, down: async () => { cdp = await page.context().newCDPSession(page); await t('touchStart', at); await sleep(page, 650); }, move: (x, y) => t('touchMove', { x, y }), up: async () => { await t('touchEnd'); await cdp.detach().catch(() => {}); } };
}
/** What a person holds to move the selected block: its bar's grip, or — a docked bar has none (E5b-8) — a long press inside it. */
async function hand(page) {
  const g = bar(page).getByLabel('Drag to move');
  if (await g.isVisible().catch(() => false)) { const r = await g.boundingBox(); return mouseHand(page, { x: r.x + r.width / 2, y: r.y + r.height / 2 }); }
  const id = FINGER && (await selectedId(page)); if (!id) return null;
  const at = await page.evaluate((id) => { // a point of the block on screen, clear of the docked bar, its handles and its "+"
    const me = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); if (!me) return null;
    const r = me.getBoundingClientRect(), tb = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]')?.getBoundingClientRect();
    const top = Math.max(r.top, 64) + 4, bottom = Math.min(r.bottom, tb && tb.top > innerHeight / 2 ? tb.top : innerHeight) - 4;
    if (bottom <= top) return null;
    for (const fy of [0.5, 0.3, 0.7, 0.15, 0.85]) for (const fx of [0.5, 0.3, 0.7, 0.15, 0.85]) {
      const x = r.left + r.width * fx, y = top + (bottom - top) * fy, e = document.elementFromPoint(x, y);
      if (e && me.contains(e) && !e.closest('[data-handle-hit], [aria-label^="Resize"], [role="toolbar"], button[aria-label^="Add"]')) return { x, y };
    }
    return null;
  }, id);
  return at && fingerHand(page, at);
}
/** Carried by a hand, or by a mouse from the middle of a box (a resize handle). */
async function carry(page, from, x, y) {
  const h = from.down ? from : mouseHand(page, { x: from.x + from.width / 2, y: from.y + from.height / 2 });
  await h.down(); const { x: sx, y: sy } = h.at;
  for (let i = 1; i <= 18; i++) { await h.move(sx + ((x - sx) * i) / 18, sy + ((y - sy) * i) / 18); await sleep(page, 25); }
  await h.move(x, y); await sleep(page, 250); await h.move(x, y); await h.up(); await sleep(page, 300); await settle(page);
}
/** LE15l-aj · the sheet's way to add: the block selected, "Where the block goes" set, the tile tapped. Null when it was added. */
async function addWhere(page, b, where) {
  await pick(page, b.id); await blocksPanel(page);
  const opt = page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: where, exact: true });
  if (!(await opt.isVisible().catch(() => false))) { await esc(page); return `no "${where}" under "Where the block goes"`; }
  await opt.click(); await sleep(page, 200);
  await page.getByRole('button', { name: 'Add Stack', exact: true }).click(); await sleep(page, 500);
  const def = page.getByRole('menuitem', { name: 'Default', exact: true }).first(); if (await def.isVisible().catch(() => false)) { await def.click(); await sleep(page, 400); }
  if (await page.getByRole('dialog', { name: 'Blocks' }).isVisible().catch(() => false)) await page.keyboard.press('Escape');
  await settle(page); return null;
}
/** The page's blocks in reading order, its bands skipped. */
const order = (r) => { const out = []; walk(r, (n) => { if (!n.rowBand) out.push(n.id); }); return out; };

/** One gesture on one block: do it, judge it, undo it. */
async function gesture(page, J, kind, b, name, act) {
  if (ONLY_G && !name.includes(ONLY_G)) return true;
  const base = await sig(page); let ok = false, seen = '';
  try { ({ ok, seen } = await Promise.race([act(), new Promise((_, no) => setTimeout(() => no(new Error('no answer in 60 s')), 60000))])); } catch (e) { seen = 'ERROR ' + e.message.split('\n')[0].slice(0, 140); }
  if (ok === null) { await undoTo(page, base); rec(J, kind, name, null, seen); return true; }
  if (!ok) await shot(page, `${J}-${kind}-${name}`.replace(/[^\w-]+/g, '_'));
  const undo = await undoTo(page, base);
  rec(J, kind, name, ok && (undo === 0 ? true : undo >= 1), `${seen}${ok ? ` · undo ${undo === -1 ? 'did NOT restore the page' : undo === 0 ? 'nothing to undo' : `${undo} × Ctrl+Z`}` : ''}`);
  if (undo === -1) { results[results.length - 1].ok = false; }
  return undo !== -1;
}

/** LE15l-an · moved past its neighbour? Judged on the block's unit worked out AGAIN after the move (a band may be made anew) and on
 *  the neighbour it passed — never `null`, which the probe read as n/a: 36 moves at 1280 were hidden that way. */
function passed(r0, r1, id, w0, dir) {
  let sib = null; walk(r0, (n) => { if (n.id === w0.parent) sib = (n.children || [])[w0.index + dir]; });
  const w1 = at(r1, id), ws = sib && where(r1, sib.id);
  const ok = !!w1 && !!ws && w1.parent === w0.parent && ws.parent === w0.parent && w1.index === ws.index + dir;
  return { ok, seen: `${w0.index + 1} → ${w1 ? w1.index + 1 : 'GONE'} of ${w0.siblings}, ${!w1 ? 'the block not on the page' : w1.parent === w0.parent ? 'the parent the same' : 'the parent CHANGED'}${ws ? `, its neighbour now ${ws.index + 1}` : ''}` };
}
const MOVES = {
  async bar(page, b, dir) {
    await pick(page, b.id); const r0 = await root(page); const u = unit(r0, b.id); const w0 = where(r0, u);
    if (w0.index + dir < 0 || w0.index + dir >= w0.siblings) return { ok: null, seen: `nothing ${dir > 0 ? 'after' : 'before'} it to move past (${w0.index + 1} of ${w0.siblings})` };
    const names = dir > 0 ? ['Move down', 'Move right'] : ['Move up', 'Move left'];
    for (const n of names) {
      const btn = bar(page).getByRole('button', { name: n, exact: true });
      if (!(await btn.count())) continue;
      if (!(await btn.isEnabled())) return { ok: false, seen: `"${n}" is there but off (${w0.index + 1} of ${w0.siblings})` };
      await btn.click({ timeout: 8000 }); await settle(page); const p = passed(r0, await root(page), b.id, w0, dir);
      return { ok: p.ok, seen: `"${n}": ${p.seen}` };
    }
    return { ok: false, seen: 'no move arrow on its bar' };
  },
  async keys(page, b, dir) {
    await pick(page, b.id); const r0 = await root(page); const u = unit(r0, b.id); const w0 = where(r0, u);
    if (w0.index + dir < 0 || w0.index + dir >= w0.siblings) return { ok: null, seen: `nothing ${dir > 0 ? 'after' : 'before'} it (${w0.index + 1} of ${w0.siblings})` };
    const typing = await page.evaluate(() => !!document.activeElement && document.activeElement.isContentEditable);
    if (typing) { await page.keyboard.press('Escape'); await sleep(page, 200); }
    const across = (await bar(page).getByRole('button', { name: /Move (left|right)/ }).count()) > 0;
    await page.keyboard.press(across ? (dir > 0 ? 'ArrowRight' : 'ArrowLeft') : (dir > 0 ? 'ArrowDown' : 'ArrowUp')); await settle(page);
    const p = passed(r0, await root(page), b.id, w0, dir);
    return { ok: p.ok, seen: `${across ? '←→' : '↑↓'}: ${p.seen}${typing ? ' (the click put the caret in its words; Esc first)' : ''}` };
  },
  async grip(page, b, dir) {
    const r0 = await root(page); const u = unit(r0, b.id); const w0 = where(r0, u); let sib = null;
    walk(r0, (n) => { if (n.id === w0.parent) sib = (n.children || [])[w0.index + dir]; });
    if (!sib) return { ok: null, seen: `nothing ${dir > 0 ? 'after' : 'before'} it (${w0.index + 1} of ${w0.siblings})` };
    await pick(page, b.id); const g = await hand(page);
    if (!g && (await rect(page, b.id)).h < 12) return { ok: null, seen: 'a line a few px tall on a docked bar: no grip, too thin to long-press — checked by hand (LE15l-l)' };
    if (!g) return { ok: false, seen: 'no grip on its bar, and no point of it to long-press' };
    const s = await rect(page, sib.id); const across = Math.abs(s.y - (await rect(page, u)).y) < 4;
    const x = across ? (dir > 0 ? s.x + s.w - 6 : s.x + 6) : s.x + s.w / 2, y = across ? s.y + s.h / 2 : (dir > 0 ? s.y + s.h - 6 : s.y + 6);
    const vh = await page.evaluate(() => innerHeight);
    // LE15l-an: a target inside the 4rem strip at the canvas's top or bottom scrolls the page under a held pointer (LE15l-i), so the
    // aim drifted onto another block (reproduced by hand: a footer aimed above a section landed in the stat cell the page scrolled to)
    if (!across && (y > vh - 90 || y < 140)) { // LE15l-u: past a neighbour taller than the window — held at the edge until its end is clear of the strip
      const edge = y > vh - 90 ? vh - 6 : 64; await g.down();
      for (let i = 1; i <= 10; i++) { await g.move(x, g.at.y + ((edge - g.at.y) * i) / 10); await sleep(page, 30); }
      for (let i = 0; i < 160; i++) { const r = await rect(page, sib.id); const end = dir > 0 ? r.y + r.h : r.y; if (end > 140 && end < vh - 90) break; await g.move(x, edge + (i % 2)); await sleep(page, 50); }
      const aim = async () => { const r = await rect(page, sib.id); return dir > 0 ? r.y + r.h - 6 : r.y + 6; };
      let ty = await aim(); for (let i = 1; i <= 6; i++) { await g.move(x, edge + ((ty - edge) * i) / 6); await sleep(page, 40); }
      for (let k = 0; k < 5; k++) { await sleep(page, 250); const t2 = await aim(); if (Math.abs(t2 - ty) < 2) break; ty = t2; await g.move(x, ty); } // re-aimed once the page is still
      await g.move(x, ty); await g.up(); await sleep(page, 300); await settle(page);
    } else await carry(page, g, x, y); const p = passed(r0, await root(page), b.id, w0, dir);
    return { ok: p.ok, seen: `grip past its ${dir > 0 ? 'next' : 'previous'} neighbour: ${p.seen}` };
  },
  async into(page, b) {
    // into the NEXT section, the way a person drags: both on screen, the block dropped inside a block of that section
    const sec = await page.evaluate((id) => { const me = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); const own = me.closest('section, header, footer');
      const next = Array.from(document.querySelectorAll('section[data-box-id], footer[data-box-id]')).find((x) => !x.contains(me) && !(own && own.contains(x)) && (me.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING));
      return next ? next.getAttribute('data-box-id') : null; }, b.id);
    if (!sec) return { ok: null, seen: 'no section after it' };
    await pick(page, b.id);
    await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); const r = e.getBoundingClientRect(); (document.querySelector('[data-canvas-scroller]') || window).scrollBy(0, r.top - 140); }, b.id); await sleep(page, 500);
    const g = await hand(page); if (!g) return { ok: false, seen: 'no grip on its bar, and no point of it to long-press' };
    const pt = await page.evaluate(([sid, deep]) => { const s = document.querySelector(`[data-box-id="${CSS.escape(sid)}"]`); const r = s.getBoundingClientRect(); const y = Math.min(Math.max(r.top + deep, 0), innerHeight - 20); const x = r.left + r.width / 2;
      const hit = document.elementFromPoint(x, y)?.closest('[data-box-id]'); return { x, y, on: hit && s.contains(hit) ? hit.getAttribute('data-box-id') : null, seen: r.top < innerHeight - 30 }; }, [sec, FINGER ? 90 : 40]); // a finger's top strip is 44px: 40 in reads "above it" (E5b)
    if (!pt.seen) return { ok: null, seen: 'the next section is not on screen with it (a drag to the window edge scrolls — not probed)' };
    await carry(page, g, pt.x, pt.y);
    const r1 = await root(page); let inside = false; walk(r1, (n) => { if (n.id === sec) walk(n, (m) => { if (m.id === b.id) inside = true; }); });
    return { ok: !!where(r1, b.id) && inside, seen: `grip into the next section: ${!where(r1, b.id) ? 'GONE' : inside ? 'now inside it' : 'not into it'}` };
  },
  async out(page, b) {
    const sec = await page.evaluate((id) => { const s = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)?.parentElement?.closest('section'); return s && s.getAttribute('data-box-id'); }, b.id);
    if (!sec) return { ok: null, seen: 'not inside a section' };
    await pick(page, b.id); const g = await hand(page); if (!g) return { ok: false, seen: 'no grip on its bar, and no point of it to long-press' };
    const s = await rect(page, sec); const vh = await page.evaluate(() => innerHeight);
    if (s.y + s.h + 3 > vh - 4) return { ok: null, seen: 'the gap under its section is below the window — a drag cannot scroll there (LE15l-i)' };
    await carry(page, g, s.x + s.w / 2, s.y + s.h + 3);
    const r1 = await root(page); let inside = false; walk(r1, (n) => { if (n.id === sec) walk(n, (m) => { if (m.id === b.id) inside = true; }); });
    return { ok: !!where(r1, b.id) && !inside, seen: `grip to just under its section: ${!where(r1, b.id) ? 'GONE' : inside ? 'still inside the section' : 'out of it'}` };
  },
  async beside(page, b, side) {
    const pw = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); const pg = e.closest('[data-box-id]') && document.querySelector('[data-box-id]'); return [e.getBoundingClientRect().width, e.getBoundingClientRect().height, pg.getBoundingClientRect().width]; }, b.id);
    if (!FINGER && pw[0] >= pw[2] - 2) return { ok: null, seen: 'it spans the whole page — a Stack goes above or below it, never beside (LE15l-k)' };
    if (pw[1] < 12) return { ok: null, seen: `a ${Math.round(pw[1])}px line: selecting it zooms the canvas in (LE15l-l) — checked by hand` };
    const r0 = await root(page); const ids0 = new Set(); walk(r0, (n) => ids0.add(n.id)); const was = await rect(page, b.id);
    if (FINGER) { // LE15l-aj: the sheet covers the page — Before (left) / After (right), judged by the page's order, and where it is drawn
      const where = side === 'right' ? 'After' : 'Before'; const no = await addWhere(page, b, where);
      if (no && was.tag === (where === 'Before' ? 'HEADER' : 'FOOTER')) return { ok: null, seen: `${no}: nothing goes ${where === 'Before' ? 'above the header' : 'below the footer'} (LE11-1), so it is not offered (LE15l-am)` };
      if (no) return { ok: false, seen: no };
      const r1 = await root(page), ord = order(r1); const mine = new Set(); walk(r1, (n) => { if (n.id === b.id) walk(n, (m) => mine.add(m.id)); });
      const i = side === 'right' ? ord.findLastIndex((id) => mine.has(id)) + 1 : ord.indexOf(b.id) - 1; const nb = ord[i];
      const next = !!nb && !ids0.has(nb); const me = await rect(page, b.id), n = next && (await rect(page, nb));
      const drawn = !n ? '' : n.y >= me.y + me.h - 4 ? ', drawn under it' : n.y + n.h <= me.y + 4 ? ', drawn above it' : ', drawn beside it';
      return { ok: next, seen: `Where: ${where} → the Stack ${next ? `is ${where.toLowerCase()} it in the page's order${drawn}` : `is not next to it: the block ${ord.indexOf(b.id) + 1}, the new ${ord.filter((id) => !ids0.has(id)).map((id) => ord.indexOf(id) + 1).join(', ')} of ${ord.length} in the page's order`}` };
    }
    await blocksPanel(page);
    // LE15l-w: beside a SMALL block (an icon) a person aims in the space beside it — 8px inside a 25px icon is its middle, which
    // honestly reads "above it" (repro 7: the line drawn above, the block landed above)
    const vis = await rect(page, b.id);
    if (vis.w < 80) await H.dropTile(page, 'Stack', Math.round(side === 'right' ? vis.x + vis.w + 24 : vis.x - 24), Math.round(vis.y + vis.h / 2));
    else await H.dropBeside(page, 'Stack', b.id, side); await H.panel(page, false); await sleep(page, 600);
    const r1 = await root(page); const nw = []; walk(r1, (n) => { if (!ids0.has(n.id)) nw.push(n.id); });
    const me = await rect(page, b.id); const boxes = await Promise.all(nw.map((id) => rect(page, id)));
    const ov = (a) => Math.min(a.y + a.h, me.y + me.h) - Math.max(a.y, me.y) > Math.min(a.h, me.h) * 0.5;
    const hit = boxes.find((a) => a && ov(a) && (side === 'right' ? a.x >= me.x + me.w - 4 : a.x + a.w <= me.x + 4));
    // LE15l-y: the line NEVER LIES — where a line cannot hold one more block it is drawn UNDER, and the Stack going under is right
    const line = page.__dropLine, saidUnder = !!line && line.w > line.h;
    const under = boxes.find((a) => a && a.y >= me.y + me.h - 4);
    if (!hit && saidUnder && under) return { ok: true, seen: `a Stack dropped on its ${side}: the line said UNDER (the line cannot hold one more) and it went under (y ${Math.round(under.y)}; the block ends ${Math.round(me.y + me.h)})` };
    return { ok: !!hit, seen: `a Stack dropped on its ${side}: ${nw.length} new · ${hit ? `beside it (x ${Math.round(hit.x)}; the block ${Math.round(me.x)}–${Math.round(me.x + me.w)}, was ${Math.round(was.x)}–${Math.round(was.x + was.w)})` : nw.length ? `not beside it — the line said ${!line ? 'nothing' : saidUnder ? 'under' : 'BESIDE'}` : 'nothing added'}` };
  },
  async inside(page, b) {
    const r0 = await root(page); const ids0 = new Set(); walk(r0, (n) => ids0.add(n.id));
    if (FINGER) { const no = await addWhere(page, b, 'Inside'); if (no) return { ok: false, seen: no }; } // LE15l-aj
    else { await blocksPanel(page); await H.dropInto(page, 'Stack', b.id); await H.panel(page, false); await sleep(page, 600); }
    const r1 = await root(page); let within = 0, all = 0; walk(r1, (n) => { if (!ids0.has(n.id)) all++; if (n.id === b.id) walk(n, (m) => { if (!ids0.has(m.id)) within++; }); });
    return { ok: within > 0, seen: `a Stack dropped inside: ${all} new, ${within} inside it${all > within ? ' (some outside it)' : ''}` };
  },
  async shift(page, b) {
    if ((await rect(page, b.id)).h < 12) return { ok: null, seen: 'a line a few px tall: selecting it zooms the canvas in (LE15l-l) — checked by hand' };
    if (b.cell) return { ok: null, seen: 'a grid cell\'s edges set its columns (rule 19) — moving it along the grid is the page-grid gesture' };
    await pick(page, b.id); const r0 = await rect(page, b.id);
    const h = await page.locator('[aria-label="Resize left edge"]').first().boundingBox({ timeout: 3000 }).catch(() => null);
    if (!h && FINGER && r0.x < 32 + 22) return { ok: null, seen: `its left edge (x ${Math.round(r0.x)}) is in the screen edge's Back strip — not drawn for a finger (E5d-3, the user's decision E5d-10)` };
    if (!h) return { ok: false, seen: 'no left edge to drag' };
    await carry(page, h, h.x + h.width / 2 + 120, h.y + h.height / 2); const r1 = await rect(page, b.id);
    const chip = await page.locator('[data-span-live]').innerText().catch(() => '');
    return { ok: r1 && r1.x - r0.x > 40, seen: `left edge dragged 120 right: left ${Math.round(r0.x)} → ${r1 && Math.round(r1.x)}, width ${Math.round(r0.w)} → ${r1 && Math.round(r1.w)}${chip ? ` · "${chip}"` : ''}` };
  },
  async meaning(page, b) {
    await pick(page, b.id); await openInspector(page); // LE15l-aj: under 1024 it is a tab, opened first
    const acc = page.getByRole('button', { name: /^Meaning/ }).first();
    if (b.leaf) {
      if (!(await acc.isVisible().catch(() => false))) return { ok: false, seen: `no Meaning for a ${b.leaf}` };
      if ((await acc.getAttribute('aria-expanded')) !== 'true') await acc.click(); await sleep(page, 300);
      const sel = page.getByLabel('What is this block').first(); if (!(await sel.isVisible().catch(() => false))) return { ok: false, seen: 'no "What is this block?"' };
      const opt = MEANING[b.leaf][1];
      if ((await sel.evaluate((e) => e.tagName)) === 'SELECT') await sel.selectOption(opt.value); else { await sel.click(); await sleep(page, 300); await page.getByRole('option', { name: opt.label }).first().click(); }
      await settle(page); const el = LEAF[b.leaf].toUpperCase();
      const drawn = await page.evaluate(([id, el]) => { const e = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); return !!e && (e.tagName === el || !!e.querySelector(el)); }, [b.id, el]);
      return { ok: drawn, seen: `"What is this block?" → ${opt.label}: drawn as <${el.toLowerCase()}> ${drawn}` };
    }
    if (b.oneMeaning) return { ok: null, seen: `a ${b.oneMeaning} means one thing — no Meaning to choose (the user's decision 2026-10-20)` };
    if (b.heading) {
      if (!(await acc.isVisible().catch(() => false))) return { ok: false, seen: 'no Meaning for a heading' };
      if ((await acc.getAttribute('aria-expanded')) !== 'true') await acc.click(); await sleep(page, 300);
      const lv = page.getByLabel('Heading level').first(); if (!(await lv.isVisible().catch(() => false))) return { ok: false, seen: 'no "Heading level"' };
      const want = '4';
      if ((await lv.evaluate((e) => e.tagName)) === 'SELECT') await lv.selectOption(want); else { await lv.click(); await sleep(page, 300); await page.getByRole('option', { name: /^Level 4/ }).first().click(); }
      await sleep(page, 600); const h4 = await page.evaluate((id) => !!document.querySelector(`[data-box-id="${CSS.escape(id)}"] h4, h4[data-box-id="${CSS.escape(id)}"]`), b.id);
      return { ok: h4, seen: `"Heading level" → Level 4: drawn as <h4> ${h4}` };
    }
    if (!(await acc.isVisible().catch(() => false))) return { ok: false, seen: 'no Meaning in the Inspector for this kind' };
    if ((await acc.getAttribute('aria-expanded')) !== 'true') await acc.click(); await sleep(page, 300);
    const sel = page.getByLabel('What is this block').first();
    if (!(await sel.isVisible().catch(() => false))) return { ok: false, seen: 'Meaning open, no "What is this block?"' };
    const before = (await root(page)); let tag0; walk(before, (n) => { if (n.id === b.id) tag0 = n.tag || 'div'; });
    const want = tag0 === 'article' ? 'aside' : 'article';
    if ((await sel.evaluate((e) => e.tagName)) === 'SELECT') await sel.selectOption(want);
    else { await sel.click(); await sleep(page, 300); await page.getByRole('option', { name: new RegExp(want === 'article' ? 'Article' : 'Sidebar', 'i') }).first().click(); }
    await sleep(page, 600); let tag1; walk(await root(page), (n) => { if (n.id === b.id) tag1 = n.tag || 'div'; });
    const drawn = ((await rect(page, b.id))?.tag || '').toLowerCase(); // LE15l-o: a shared header / footer is stored with the SITE, so what is drawn decides
    return { ok: drawn === want, seen: `"What is this block?": ${tag0} → ${want}, drawn as <${drawn}>${tag1 !== want ? ' (stored outside the page: shared)' : ''}` };
  },
};

const PLAN = {
  moves: [['bar', -1, 'bar ↑/←'], ['bar', 1, 'bar ↓/→'], ['keys', -1, 'keys ↑/←'], ['keys', 1, 'keys ↓/→'], ['grip', -1, 'grip up/left'], ['grip', 1, 'grip down/right'], ['into', 0, 'grip into another section'], ['out', 0, 'grip out of its section']],
  build: [['beside', 'right', 'a Stack beside (right)'], ['beside', 'left', 'a Stack beside (left)'], ['inside', 0, 'a Stack inside'], ['shift', 0, 'shift right by its edge'], ['meaning', 0, 'another meaning']],
};
const JOBS = {};
if (TIER === 1) for (const tpl of TEMPLATES) for (const set of Object.keys(PLAN)) {
  JOBS[`${tpl.id}:${set}`] = async (page, J) => {
    await makePage(page, tpl);
    const K = await kinds(page); rec(J, 'the page', 'kinds of block found', true, Object.keys(K).join(' · '));
    for (const [kind, b] of Object.entries(K)) {
      for (const [g, arg, label] of PLAN[set]) {
        if ((g === 'inside') && !b.container) continue; // only a container holds
        const fine = await gesture(page, J, kind, b, label, () => MOVES[g](page, b, arg));
        if (!fine) { rec(J, kind, 'the page restored', false, 'Ctrl+Z could not restore the page — the rest of this job runs on a fresh page'); await makePage(page, tpl); Object.assign(K, await kinds(page)); }
      }
    }
  };
}

// ── Tier 2 · every section of the library (config/sections.json + config/sections/*.json, enumerated) ──
const CATS = require('../../config/sections.json').categories.filter((c) => fs.existsSync(path.join(__dirname, '..', '..', 'config', 'sections', `${c.id}.json`))); // the ones built; a later batch's are probed the day their file appears
const reEsc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
async function sectionsTab(page) {
  await esc(page); await H.panel(page, true);
  await page.getByRole('tab', { name: T.tab, exact: true }).click();
  await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 20000 }); await sleep(page, 600);
}
/** The sections a page holds at its top level (each section's own unit). */
const tops = async (page) => (await root(page)).children.map((c) => c.id);
const leafIn = (r, id) => { let out = null; walk(r, (n) => { if (n.id === id) walk(n, (m) => { if (!out && m.id !== id && m.type && m.type !== 'container') out = m.id; }); }); return out; };
const chunks = (n) => { const all = CATS.flatMap((c) => require(`../../config/sections/${c.id}.json`).sections.map((d) => ({ cat: c, d }))); const out = Array.from({ length: n }, () => []); all.forEach((x, i) => out[i % n].push(x)); return out; };
if (TIER === 2) {
  chunks(6).forEach((list, k) => {
    JOBS[`sections-${k + 1}`] = async (page, J) => {
      await makePage(page, TEMPLATES[0]); let cat = null;
      for (const { cat: c, d } of list) {
        const kind = `${c.id} · ${d.name}`;
        try {
          if (cat !== c.id) { await sectionsTab(page); await page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: new RegExp(`^${reEsc(c.label)}`) }).click(); await sleep(page, 2500); cat = c.id; }
          // LE15l-y (10): the page as SAVED once it stops changing — read while the last section's Ctrl+Z was still being saved, the
          // count saw "2 new at the top level" on a different section each run
          await settle(page); const base = await sig(page); const before = await tops(page);
          await page.getByRole('button', { name: new RegExp(`^Add ${reEsc(d.name)},`) }).first().click(); await sleep(page, 1500); await settle(page);
          const ask = page.getByRole('button', { name: T.replaceButton, exact: true }).first(); // LE15l-m: a header / footer REPLACES the one there
          if (await ask.isVisible().catch(() => false)) { await ask.click(); await sleep(page, 1500); }
          const added = (await tops(page)).filter((id) => !before.includes(id));
          if (added.length !== 1) { rec(J, kind, 'added from the Sections tab', false, `${added.length} new at the top level`); await undoTo(page, base); continue; }
          await H.panel(page, false);
          const sid = added[0]; const r = await root(page); const leaf = leafIn(r, sid);
          const inner = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); const own = e && e.querySelector('section[data-box-id], header[data-box-id], footer[data-box-id], [data-box-id]'); return (own || e).getAttribute('data-box-id'); }, sid);
          const secB = { id: inner, container: true };
          await gesture(page, J, kind, secB, 'the section moved up (bar)', () => MOVES.bar(page, secB, -1));
          if (leaf) {
            await gesture(page, J, kind, { id: leaf }, 'a block inside moved out', () => MOVES.out(page, { id: leaf }));
            await gesture(page, J, kind, { id: leaf }, 'a Stack beside a block inside', () => MOVES.beside(page, { id: leaf }, 'right'));
          } else rec(J, kind, 'a block inside', null, 'it holds no block (an empty layout)');
          await gesture(page, J, kind, { id: inner, container: true }, 'another meaning', () => MOVES.meaning(page, { id: inner, container: true }));
          await undoTo(page, base); cat = (await page.getByRole('tablist', { name: T.categories }).isVisible().catch(() => false)) ? cat : null;
        } catch (e) { rec(J, kind, 'ran', false, 'ERROR ' + e.message.split('\n')[0].slice(0, 140)); cat = null; }
      }
    };
  });
}

// ── Tier 3 · every component of the catalogue (lib/component-catalogue.ts, read as text: enumerated) ──
const CATALOGUE = (() => { const s = fs.readFileSync(path.join(__dirname, '..', '..', 'lib', 'component-catalogue.ts'), 'utf8'); const i = s.indexOf('export const COMPONENT_CATALOGUE'); return [...s.slice(i).matchAll(/label: "([^"]+)"/g)].map((m) => m[1]); })();
if (TIER === 3) {
  for (const label of CATALOGUE) {
    JOBS[`component:${label}`] = async (page, J) => {
      await makePage(page, TEMPLATES[0]);
      // into the stack that holds "Hello, and welcome" — a section of the template, as a person drops it
      const host = await page.evaluate(() => { const h = Array.from(document.querySelectorAll('h1,h2')).find((e) => /Hello, and/.test(e.textContent)); return h && h.closest('[data-box-id]').parentElement.closest('[data-box-id]').getAttribute('data-box-id'); });
      const n0 = count(await root(page)); const ids0 = new Set(); walk(await root(page), (n) => ids0.add(n.id));
      await blocksPanel(page); await H.dropInto(page, label, host); await sleep(page, 500);
      const def = page.getByRole('menuitem', { name: /^Default$/ }).or(page.locator('button', { hasText: /^\s*Default\s*$/ })).first();
      if (await def.isVisible().catch(() => false)) { await def.click(); await sleep(page, 600); }
      await H.panel(page, false); await settle(page);
      // LE15l-t: what was dropped is the top of the NEW blocks (a Card is a box of picture, heading, text, button — no component node);
      // a page band made round it holds it alone, so the block inside the band is what a person selects
      const r = await root(page); let cid = null; walk(r, (n, p) => { if (!cid && !ids0.has(n.id) && p && ids0.has(p.id)) cid = n.id; });
      if (cid) walk(r, (n) => { if (n.id === cid && n.rowBand && (n.children || []).length === 1) cid = n.children[0].id; });
      rec(J, label, 'dropped into a template section', !!cid, cid ? `${count(r) - n0} new` : 'no component added');
      if (!cid) return;
      const c = { id: cid, container: false };
      for (const [g, arg, name] of [['bar', -1, 'bar ↑/←'], ['bar', 1, 'bar ↓/→'], ['keys', -1, 'keys ↑/←'], ['grip', -1, 'grip up/left'], ['into', 0, 'grip into the next section'], ['out', 0, 'grip out of its section'], ['beside', 'right', 'a Stack beside (right)'], ['shift', 0, 'shift right by its edge']]) await gesture(page, J, label, c, name, () => MOVES[g](page, c, arg));
      // a part inside it: the second item moved up by its own toolbar
      await gesture(page, J, label, c, 'a part inside it moved up', async () => {
        await pick(page, cid); const items = page.locator(`[data-box-id="${cid}"] [data-eu-item]`); const n = await items.count();
        if (n < 2) return { ok: null, seen: `${n} part${n === 1 ? '' : 's'} inside — nothing to move past` };
        const t0 = await items.nth(1).innerText().catch(() => ''); await items.nth(1).click(); await sleep(page, 400);
        const up = page.getByRole('button', { name: 'Move item up' }).first(); if (!(await up.isVisible().catch(() => false))) return { ok: false, seen: 'no "Move item up" on the part' };
        await up.click(); await sleep(page, 600); const t1 = await items.nth(0).innerText().catch(() => '');
        return { ok: t1 === t0 && !!t0, seen: `the second part ("${t0.slice(0, 20)}") is now first: ${t1 === t0}` };
      });
    };
  }
}

(async () => {
  const jobs = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n)); const queue = [...jobs]; let slot = 0;
  const worker = async (s) => {
    const pos = [(s % 3) * 620, Math.floor(s / 3) * 480];
    while (queue.length) {
      const J = queue.shift(); const { browser, page, errs } = await H.open({ headed: true, w: WIDTH, h: 900, pos, touch: FINGER });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'the job', 'ran to the end', false, e.message.split('\n')[0]); await shot(page, `ERR-${J}`.replace(/[^\w-]+/g, '_')); }
      rec(J, 'the editor', 'no console errors', !errs.length, errs.join(' | ') || 'none');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, `results-t${TIER}-${WIDTH}.json`), JSON.stringify(results, null, 1));
  const na = results.filter((r) => r.ok === null).length; console.log(`SUMMARY tier ${TIER} at ${WIDTH}: ${results.filter((r) => r.ok).length} WORK · ${results.filter((r) => r.ok === false).length} NOT · ${na} n/a`);
})();
