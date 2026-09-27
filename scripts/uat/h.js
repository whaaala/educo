// Shared UI-driving harness for the width sweep. Builds ONLY through the UI (RULE Y).
const { chromium } = require('playwright');
const path = require('path');
const OUT = __dirname;
// Watchable when headed (--watch slows it further), quick when not.
const PACE = process.argv.includes('--watch') ? 60 : process.argv.includes('--headed') ? 25 : 10;

async function open({ headed = process.argv.includes('--headed'), w = 1600, h = 1000, pos = null } = {}) {
  const browser = await chromium.launch({ headless: !headed, slowMo: headed ? 30 : 0, args: pos ? [`--window-position=${pos[0]},${pos[1]}`] : [] });
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
  await page.goto((process.env.BASE || 'http://localhost:3100') + '/website/box-demo', { waitUntil: 'load' });
  await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
  await page.waitForTimeout(1200);
  return { browser, page, errs };
}
const panel = async (page, open) => {
  const name = open ? 'Open blocks panel' : 'Close blocks panel';
  const b = page.getByRole('button', { name });
  if (await b.count()) { await b.first().click(); await page.waitForTimeout(600); }
};
const tileLoc = (page, t) => page.locator('[draggable="true"]').filter({ hasText: new RegExp('^\\s*' + t) }).first();
/** A REAL click on a palette tile — the pointer goes there and clicks. */
const clickTile = async (page, t) => {
  await tileLoc(page, t).scrollIntoViewIfNeeded(); await tileLoc(page, t).click(); await page.waitForTimeout(PACE * 4 + 400);
  // A tile with styles answers a click with "Add <x> as…" — a user picks one; we pick Default.
  const def = page.getByRole('menuitem', { name: /^Default$/ }).or(page.locator('button', { hasText: /^\s*Default\s*$/ })).first();
  if (await def.isVisible().catch(() => false)) { await def.click(); await page.waitForTimeout(PACE * 4 + 400); }
};
/** Drag a palette tile and drop it at (x, y) — the real HTML5 drop pipeline. */
/** A REAL drag: pointer onto the tile, press, carry it across the page in steps, release at (x, y). */
const dropTile = async (page, tileText, x, y) => {
  const tile = tileLoc(page, tileText); await tile.scrollIntoViewIfNeeded();
  const b = await tile.boundingBox(); if (!b) throw new Error('no tile ' + tileText);
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down();
  const steps = 16;
  for (let i = 1; i <= steps; i++) { await page.mouse.move(b.x + b.width / 2 + ((x - b.x - b.width / 2) * i) / steps, b.y + b.height / 2 + ((y - b.y - b.height / 2) * i) / steps); await page.waitForTimeout(PACE); }
  await page.waitForTimeout(PACE * 3); await page.mouse.up(); await page.waitForTimeout(PACE * 4 + 600);
};
/** Leaf blocks (no block inside), with their rects. */
const leaves = (page) => page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]'))
  .filter((e) => !e.querySelector('[data-box-id]'))
  .map((e) => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-box-id'), l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height }; }));
/**
 * Where a person can SEE a block: its rect clipped to the part the open blocks panel does not cover. A user aims at
 * what is visible — aiming under the panel drops onto the panel, and nothing is added.
 */
const visibleRect = (page, id) => page.evaluate(async (id) => {
  // A person scrolls to what they want to drop on — a target below the fold cannot be aimed at.
  const el = document.querySelector(`[data-box-id="${id}"]`);
  const r0 = el.getBoundingClientRect();
  if (r0.bottom > window.innerHeight - 20 || r0.top < 60) { el.scrollIntoView({ block: r0.height > window.innerHeight * 0.7 ? 'end' : 'center' }); await new Promise((res) => setTimeout(res, 250)); }
  const b = el.getBoundingClientRect();
  const panel = Array.from(document.querySelectorAll('*')).find((e) => /^\s*Add a block/.test(e.firstChild?.textContent || '') && e.getBoundingClientRect().width < 500);
  const card = panel ? panel.closest('[class*="fixed"], [class*="absolute"]') || panel : null;
  const cover = card ? card.getBoundingClientRect().right + 10 : 0;
  const l = Math.max(b.left, b.top < 1000 ? cover : 0);
  return { l, r: b.right, t: b.top, b: b.bottom, h: b.height, w: Math.max(0, b.right - l), hidden: b.right - l < 24 };
}, id);
/** Drop `tile` beside the block `id`, at its right (or left) edge. */
const dropBeside = async (page, tile, id, side = 'right') => {
  const r = await visibleRect(page, id);
  if (side === 'left' && r.hidden) throw new Error(`the left edge of ${id.slice(-4)} is under the blocks panel`);
  await dropTile(page, tile, Math.round(side === 'right' ? r.r - 8 : r.l + 8), Math.round(r.t + r.h / 2));
};
const selected = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
async function select(page, id) {
  // A person scrolls to what they want before clicking it (a block below the fold took the click of the one above).
  await page.locator(`[data-box-id="${id}"]`).scrollIntoViewIfNeeded().catch(() => {});
  for (let i = 0; i < 6; i++) {
    if ((await selected(page)) === id) return true;
    const b = await page.locator(`[data-box-id="${id}"]`).boundingBox();
    if (!b) return false;
    // Open space: the lower-right quarter — clear of the floating toolbar (top-left) and the add pill (centre).
    await page.mouse.click(b.x + b.width * 0.8, b.y + b.height * 0.8);
    await page.waitForTimeout(250);
    // The click went INSIDE it (a child took it, as "click goes inside" means it should): step OUT with Escape, the
    // way a person reaches a parent — the builder's own shortcut, one level per press.
    const got = await selected(page);
    if (got && got !== id && await page.evaluate(([p, c]) => !!document.querySelector(`[data-box-id="${p}"] [data-box-id="${c}"]`), [id, got])) {
      for (let k = 0; k < 6 && (await selected(page)) !== id; k++) { await page.keyboard.press('Escape'); await page.waitForTimeout(150); }
    }
  }
  if ((await selected(page)) !== id) throw new Error(`could not select ${id.slice(-4)} (got ${(await selected(page) || "none").slice(-4)})`);
  return true;
}
const handleOf = async (page, edge) => page.locator(`[aria-label="Resize ${edge} edge"]`).first().boundingBox();
async function dragEdge(page, edge, dx, dy = 0, steps = 12) {
  const h = await handleOf(page, edge); if (!h) return false;
  const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  await page.mouse.move(cx, cy); await page.mouse.down();
  for (let i = 1; i <= steps; i++) { await page.mouse.move(cx + (dx * i) / steps, cy + (dy * i) / steps); await page.waitForTimeout(10); }
  await page.mouse.up(); await page.waitForTimeout(450);
  return true;
}
/** The row the block sits in: its row-parent's in-flow children, relative to the row. */
const rowOf = (page, id) => page.evaluate((id) => {
  let el = document.querySelector(`[data-box-id="${id}"]`);
  while (el && el.parentElement && getComputedStyle(el.parentElement).flexDirection !== 'row') el = el.parentElement.closest('[data-box-id]');
  if (!el || !el.parentElement) return null;
  const row = el.parentElement, rr = row.getBoundingClientRect(), cs = getComputedStyle(row);
  const inner = rr.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const kids = Array.from(row.children).filter((k) => k.hasAttribute('data-box-id') && getComputedStyle(k).position !== 'absolute' && getComputedStyle(k).position !== 'fixed');
  return { inner: Math.round(inner), gap: parseFloat(cs.columnGap) || 0, kids: kids.map((k) => { const r = k.getBoundingClientRect(); return { id: k.getAttribute('data-box-id'), l: Math.round(r.left - rr.left - parseFloat(cs.paddingLeft)), t: Math.round(r.top - rr.top), w: Math.round(r.width), h: Math.round(r.height) }; }) };
}, id);
/** Stored widths of a row's children. */
const storedRow = (page, anyChildId) => page.evaluate((id) => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1'));
  let hit = null;
  const walk = (n) => { if ((n.children || []).some((c) => c.id === id)) hit = n; (n.children || []).forEach(walk); };
  s.pages.forEach((p) => walk(p.root));
  return hit ? hit.children.map((c) => ({ id: c.id, w: c.width, ml: c.marginLeft, mlp: c.marginLeftPct })) : null;
}, anyChildId);
const tree = (page) => page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const out = [];
  const walk = (n, d) => { out.push('  '.repeat(d) + n.id.slice(-4) + ' ' + (n.type || '') + (n.rowBand ? ' BAND' : '') + (n.direction === 'row' ? ' ROW' : '') + (n.width ? ' w=' + n.width : '') + (n.marginLeft ? ' ml=' + n.marginLeft : '') + (n.marginLeftPct ? ' mlp=' + n.marginLeftPct : '')); (n.children || []).forEach((c) => walk(c, d + 1)); };
  walk(s.pages[0].root, 0); return out.join('\n');
});
/** Lines of a row: each line's blocks touch, and no line runs past the row. Returns problems. */
const FLOOR = 224;
function rowProblems(row) {
  const probs = []; const lines = {};
  row.kids.forEach((k) => { (lines[k.t] = lines[k.t] || []).push(k); });
  for (const ks of Object.values(lines)) {
    ks.sort((a, b) => a.l - b.l);
    for (let i = 1; i < ks.length; i++) { const d = ks[i].l - (ks[i - 1].l + ks[i - 1].w) - row.gap; if (Math.abs(d) > 1) probs.push(`gap ${d}px between ${ks[i - 1].id.slice(-4)} and ${ks[i].id.slice(-4)}`); }
    const last = ks[ks.length - 1]; if (last.l + last.w > row.inner + 1) probs.push(`line overflows by ${last.l + last.w - row.inner}px`);
  }
  // A HOLE: room at the end of a line that the first block of the NEXT line could take (at its 14rem floor).
  const tops = Object.keys(lines).map(Number).sort((a, b) => a - b);
  for (let i = 0; i + 1 < tops.length; i++) {
    const ks = lines[tops[i]].sort((a, b) => a.l - b.l), last = ks[ks.length - 1];
    const free = row.inner - (last.l + last.w);
    if (free >= FLOOR + row.gap + 2) probs.push(`HOLE ${Math.round(free)}px at the end of a line while ${lines[tops[i + 1]][0].id.slice(-4)} waits below`);
  }
  return probs;
}
/** Drop a tile INTO an (empty) block, at its centre. */
// A target a user cannot see cannot be aimed at: FAIL, never drop at a sliver and land beside it (#56 — that is how a
// "four-stack" row got a fifth block while the panel hid the first stack).
const dropInto = async (page, tile, id) => { const r = await visibleRect(page, id); if (r.hidden) throw new Error(`cannot drop into ${id.slice(-4)}: only ${Math.round(r.w)}px of it is visible`); await dropTile(page, tile, Math.round(r.l + r.w / 2), Math.round(r.t + r.h / 2)); };
/**
 * Put a REAL photo into every image block, the way a user does: click its Upload button and pick a file. Test pages
 * are compared as they would be published (the empty placeholder is an editor-only exception — user, 2026-09-27).
 */
async function fillImages(page) {
  const files = ['landscape', 'portrait', 'wide'].map((n) => path.join(OUT, 'img', `${n}.jpg`));
  let n = 0;
  for (let k = 0; k < 40; k++) {
    const btn = page.locator('[data-box-id] button', { hasText: /^\s*Upload\s*$/ }).first();
    if (!(await btn.count())) break;
    await btn.scrollIntoViewIfNeeded();
    const [chooser] = await Promise.all([page.waitForEvent('filechooser', { timeout: 6000 }).catch(() => null), btn.click()]);
    if (!chooser) break;
    await chooser.setFiles(files[n % files.length]); n++;
    await page.waitForTimeout(1200);
  }
  return n;
}
/**
 * Put real TEXT into every empty stack — a user fills a page before publishing it, and an empty stack's drop target
 * is the editor-only exception (user, 2026-09-27). Dragged in from the palette, through the UI.
 */
async function fillStacks(page) {
  let n = 0;
  await panel(page, true);
  for (let k = 0; k < 60; k++) {
    const id = await page.evaluate(() => {
      const ph = Array.from(document.querySelectorAll('[data-ph]')).find((e) => { const r = e.getBoundingClientRect(); return r.width > 40 && r.height > 20; });
      const box = ph && ph.closest('[data-box-id]'); return box ? box.getAttribute('data-box-id') : null;
    });
    if (!id) break;
    const before = await page.evaluate(() => document.querySelectorAll('[data-box-id]').length);
    await dropInto(page, 'Text', id);
    const after = await page.evaluate(() => document.querySelectorAll('[data-box-id]').length);
    if (after <= before) break; // the drop did nothing — stop rather than loop
    n++;
  }
  await panel(page, false);
  return n;
}
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name) });
const same = (a, b, tol = 1) => a.kids.length === b.kids.length && a.kids.every((k, i) => k.id === b.kids[i].id && k.t === b.kids[i].t && Math.abs(k.l - b.kids[i].l) <= tol && Math.abs(k.w - b.kids[i].w) <= tol);
const fmt = (row) => row.kids.map((k) => `${k.id.slice(-4)}@${k.l},${k.t}:${k.w}`).join(' ');
module.exports = { fillStacks, fillImages, visibleRect, dropInto, open, panel, clickTile, dropTile, dropBeside, leaves, select, selected, handleOf, dragEdge, rowOf, storedRow, tree, rowProblems, shot, same, fmt, OUT };
