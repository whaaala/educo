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
  // A CLICK IS NOT A DROP: forget the last drag's "offered / released at", or a click that added nothing is reported as
  // "the canvas offered the drop… released at…" — which is how e-1 was filed as a drop bug for two batches (L1-6).
  page.__dropOffered = undefined; page.__dropAt = undefined; page.__clicked = t;
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
  // Counted BEFORE the drag. A count taken after it compared the page with itself and dropped a second copy.
  const countBefore = await page.evaluate(() => document.querySelectorAll('[data-box-id]').length);
  page.__clicked = undefined;
  // WHAT THE BROWSER DID WITH THE DROP (L1-7): every `drop` / `dragend` this drag produced, its target, whether that target
  // was still in the page (E0-g's detached SVG), and whether the drop was handled — reported when a drop adds nothing.
  await page.evaluate(() => { window.__dropLog = []; if (!window.__dropLogOn) { window.__dropLogOn = true;
    const f = (e) => window.__dropLog.push(`${e.type} on <${e.target.tagName ? e.target.tagName.toLowerCase() : '?'}>${e.target.isConnected ? '' : ' DETACHED'}${e.defaultPrevented ? ' handled' : ''}`);
    for (const t of ['drop', 'dragend']) { addEventListener(t, f, true); addEventListener(t, (e) => { if (t === 'drop') window.__dropLog.push(`drop reached window, handled=${e.defaultPrevented}`); }, false); }
    // …and the LAST drag-over / enter / leave events, read as they bubble out at the window: their target, whether it is
    // inside the canvas, and whether the canvas accepted it (a browser drops only where the last dragover was accepted).
    window.__overLog = [];
    for (const t of ['dragover', 'dragenter', 'dragleave']) addEventListener(t, (e) => { const c = document.querySelector('[data-box-id]'); const inCanvas = c && c.parentElement && c.parentElement.closest('.eu-tokens')?.contains(e.target);
      window.__overLog.push(`${t} <${e.target.tagName ? e.target.tagName.toLowerCase() : '?'}>${inCanvas ? '' : ' OUTSIDE-CANVAS'}${e.defaultPrevented ? ' accepted' : ' NOT-accepted'}@${e.clientX},${e.clientY}`); if (window.__overLog.length > 6) window.__overLog.shift(); }, false); } window.__overLog = []; });
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down();
  const steps = 16;
  for (let i = 1; i <= steps; i++) { await page.mouse.move(b.x + b.width / 2 + ((x - b.x - b.width / 2) * i) / steps, b.y + b.height / 2 + ((y - b.y - b.height / 2) * i) / steps); await page.waitForTimeout(PACE); }
  await page.waitForTimeout(PACE * 3);
  // WAS THE DROP OFFERED? The canvas paints its drop marker (a dashed box, or a glowing line) while a palette drag is
  // over it. No marker at the moment of release = the drag never reached the canvas (a missed pick-up) — a person
  // just drags again. A marker AND nothing added afterwards is a product bug, and `newestLeaf` says so.
  page.__dropOffered = await page.evaluate(() => Array.from(document.body.children).some((e) => e.getAttribute('aria-hidden') === 'true' && getComputedStyle(e).position === 'fixed' && /outline-dashed|shadow-\[0_0_10px/.test(e.className)));
  // WHAT IS UNDER THE POINTER AS IT LETS GO — kept for the report when a drop that was offered adds nothing (c-5).
  page.__dropAt = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); if (!e) return `(${x},${y}) nothing`; const b = e.closest("[data-box-id]"); const chrome = e.closest("[data-chrome-mirror],[role=toolbar],[data-gridghost]"); return `(${x},${y}) on <${e.tagName.toLowerCase()}>${e.getAttribute("aria-label") ? " \"" + e.getAttribute("aria-label") + "\"" : ""}${chrome ? " — EDITOR CHROME: " + (chrome.getAttribute("aria-label") || chrome.getAttribute("data-chrome-mirror") || "offer") : ""}${b ? " in block " + b.getAttribute("data-box-id").slice(-4) : ""}`; }, [x, y]);
  // …and where the AIMED block is at that moment: aimed at, then moved by the time of release, is a different bug from aimed wrong (L1-13).
  if (page.__aimId && page.__aim) page.__aim += await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); if (!e) return ' · at release: GONE'; const r = e.getBoundingClientRect(); return ` · at release it lay at l${Math.round(r.left)} r${Math.round(r.right)} t${Math.round(r.top)} b${Math.round(r.bottom)}`; }, page.__aimId).catch(() => '');
  await page.mouse.up(); await page.waitForTimeout(PACE * 4 + 600);
  page.__dropLog = await page.evaluate(() => (window.__dropLog || []).join(' · ') + ' · last over: ' + (window.__overLog || []).join(' | ')).catch(() => '');
  if (!page.__dropOffered && !page.__redrag) {
    await page.waitForTimeout(400);
    if (countBefore === await page.evaluate(() => document.querySelectorAll('[data-box-id]').length)) {
      page.__missedDrags = (page.__missedDrags || 0) + 1;
      page.__redrag = true; try { await dropTile(page, tileText, x, y); } finally { page.__redrag = false; }
    }
  }
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
  // …and one BEHIND A STUCK HEADER is scrolled clear of it too, as a person scrolls a heading out from under the bar
  // before aiming at it. Aimed at where it lay, a drop "under a heading" landed IN the sticky header, and the rest of
  // tier-95 page 109 was built inside it: a 2,746px header stuck over the page (L1-8).
  const stuckFoot = Math.max(60, ...Array.from(document.querySelectorAll('[data-box-id]')).filter((p) => {
    const ps = getComputedStyle(p).position; if ((ps !== 'sticky' && ps !== 'fixed') || p.contains(el) || el.contains(p)) return false;
    const q = p.getBoundingClientRect(); return q.top < 120 && q.left < r0.right && q.right > r0.left && q.height < window.innerHeight * 0.6;
  }).map((p) => p.getBoundingClientRect().bottom));
  if (r0.bottom > window.innerHeight - 20 || r0.top < stuckFoot + 8) { el.scrollIntoView({ block: r0.height > window.innerHeight * 0.7 ? 'end' : 'center' }); await new Promise((res) => setTimeout(res, 250)); }
  const b = el.getBoundingClientRect();
  const panel = Array.from(document.querySelectorAll('*')).find((e) => /^\s*Add a block/.test(e.firstChild?.textContent || '') && e.getBoundingClientRect().width < 500);
  const card = panel ? panel.closest('[class*="fixed"], [class*="absolute"]') || panel : null;
  const cover = card ? card.getBoundingClientRect().right + 10 : 0;
  let l = Math.max(b.left, b.top < 1000 ? cover : 0);
  // …and the INSPECTOR on the right: a block running under it cannot be aimed at there — a drop "beside" one was
  // released on the Inspector's "Outline style" button, and nothing was added (E0-d, tier 99 page 393).
  const ins = document.querySelector('aside[aria-label="Inspector"]');
  let r = Math.min(b.right, ins && ins.getBoundingClientRect().width ? ins.getBoundingClientRect().left - 10 : Infinity);
  // …and a PINNED block lying over it — a stuck header across the top, a sticky sidebar down one side. A person sees it
  // there and aims at the part it leaves open; aiming under it dropped INTO the pinned block's row (L1-8: a column beside
  // the header on tier-95 page 124, an Image and a column in the sidebar's row on 109 and 124).
  let t = b.top, bot = b.bottom;
  for (const p of document.querySelectorAll('[data-box-id]')) {
    const ps = getComputedStyle(p).position; if (ps !== 'sticky' && ps !== 'fixed') continue;
    if (p.contains(el) || el.contains(p)) continue;
    const q = p.getBoundingClientRect(); if (q.right <= l || q.left >= r || q.bottom <= t || q.top >= bot) continue;
    if (q.left <= l + 2 && q.right >= r - 2) { if (q.top <= t + 2) t = Math.max(t, q.bottom + 4); else bot = Math.min(bot, q.top - 4); } // spans it: cut top or bottom
    else if (q.left > l) r = Math.min(r, q.left - 10); // over its right side
    else l = Math.max(l, q.right + 10); // over its left side
  }
  // …and the WINDOW: a target that cannot be scrolled into view (a Card hanging below the page's end, L1-1) is not
  // visible, rather than aimed at below the window's foot — page 124 released at y=755 in a 720px window, on nothing.
  t = Math.max(t, 0); bot = Math.min(bot, window.innerHeight - 4);
  return { l, r, t, b: bot, h: Math.max(0, bot - t), w: Math.max(0, r - l), hidden: r - l < 24 || bot - t < 12 };
}, id);
/** Drop `tile` beside the block `id`, at its right (or left) edge. */
const dropBeside = async (page, tile, id, side = 'right') => {
  const r = await visibleRect(page, id);
  if (side === 'left' && r.hidden) throw new Error(`the left edge of ${id.slice(-4)} is under the blocks panel`);
  if (r.hidden) throw new Error(`cannot drop beside ${id.slice(-4)}: only ${Math.round(r.w)}×${Math.round(r.h)}px of it is visible`);
  await dropTile(page, tile, Math.round(side === 'right' ? r.r - 8 : r.l + 8), Math.round(r.t + r.h / 2));
};
const selected = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
async function select(page, id) {
  // A person scrolls to what they want before clicking it (a block below the fold took the click of the one above).
  await page.locator(`[data-box-id="${id}"]`).scrollIntoViewIfNeeded().catch(() => {});
  // EACH CLICK GOES ONE BOX DEEPER ("click selects the box, click again goes inside"), and a person keeps clicking until
  // they are on the one they want. Six clicks was the limit here, and a column in a row in a stack in the main column of
  // a sidebar page is SEVEN boxes down: logged on three pages, the sixth click had reached its parent every time and the
  // seventh was never made — 34 of the 36 pages of tier 99 that "could not select" (got its grid ×21, a stack ×13).
  for (let i = 0; i < 16; i++) {
    if ((await selected(page)) === id) return true;
    // Centred on screen, as a person scrolls to it — "into view" can leave it at the very top, under a sticky header.
    await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const r = e?.getBoundingClientRect(); if (e && r && (r.top < 90 || r.bottom > innerHeight - 20)) e.scrollIntoView({ block: 'center' }); }, id);
    await page.waitForTimeout(120);
    const b = await page.locator(`[data-box-id="${id}"]`).boundingBox();
    if (!b) return false;
    // Open space: the lower-right quarter — clear of the floating toolbar (top-left) and the add pill (centre) — but only
    // a point where the pointer actually lands ON this block (or inside it): a pinned header or a floating block over it
    // would take the click, and a person aims at the part they can see.
    const pts = await page.evaluate(([id, bx]) => {
      const me = document.querySelector(`[data-box-id="${id}"]`);
      // Only the part of the block that is ON SCREEN can be aimed at: a column taller than the window (an article
      // beside a sidebar) had its 80%-down point below the viewport, and the click landed on whatever the window's
      // bottom edge held instead — four dressed pages "could not select" the main column for exactly this reason.
      const top = Math.max(bx.y, 0), bottom = Math.min(bx.y + bx.height, innerHeight), h = Math.max(1, bottom - top);
      const ok = [];
      for (const [fx, fy] of [[0.8, 0.8], [0.8, 0.5], [0.5, 0.8], [0.95, 0.95], [0.5, 0.5], [0.2, 0.8], [0.05, 0.95], [0.8, 0.2], [0.5, 0.1]]) {
        const x = bx.x + bx.width * fx, y = top + h * fy; const hit = document.elementFromPoint(x, y);
        if (hit && me && me.contains(hit)) ok.push([x, y]);
      }
      return ok.length ? ok : [[bx.x + bx.width * 0.8, top + h * 0.8]];
    }, [id, b]);
    // THE POINTER ARRIVES BEFORE IT CLICKS, and a person sees what is under it. The free columns at the end of a grid's row
    // offer "Add a block here" — invisible until the pointer is over them — and a click meant to SELECT landed on the offer
    // instead and added an empty cell (tier 99, page 254: four grids). Nobody clicks a button that has just said what it
    // will do in order to do something else: the next open point is taken.
    let pt = pts[0];
    for (const p of pts) { await page.mouse.move(p[0], p[1]); await page.waitForTimeout(80); pt = p;
      if (!(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-gridghost]'), p))) break; }
    await page.mouse.click(pt[0], pt[1]);
    await page.waitForTimeout(250);
    if (process.env.DEBUG_SELECT) console.log(`  select ${id.slice(-4)} · click ${i + 1} at ${Math.round(pt[0])},${Math.round(pt[1])} (box ${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}×${Math.round(b.height)}, ${pts.length} open points) → ${((await selected(page)) || 'none').slice(-4)}`);
    // The click went INSIDE it (a child took it, as "click goes inside" means it should): step OUT with Escape, the
    // way a person reaches a parent — the builder's own shortcut, one level per press.
    const got = await selected(page);
    const inside = got && got !== id && await page.evaluate(([p, c]) => !!document.querySelector(`[data-box-id="${p}"] [data-box-id="${c}"]`), [id, got]);
    if (inside) {
      for (let k = 0; k < 6 && (await selected(page)) !== id; k++) { await page.keyboard.press('Escape'); await page.waitForTimeout(150); }
    } else if (got && got !== id && i >= 1 && !(await page.evaluate(([p, c]) => !!document.querySelector(`[data-box-id="${c}"] [data-box-id="${p}"]`), [id, got]))) {
      // A SIBLING took the click (a neighbour's resize handle or toolbar sits over this block's edge). Aim at something that
      // is unmistakably INSIDE the block — the centre of its first child — then step out to the block with Escape.
      const kid = await page.evaluate((p) => { const k = document.querySelector(`[data-box-id="${p}"] [data-box-id]`); if (!k) return null; const r = k.getBoundingClientRect(); return [r.left + r.width / 2, Math.max(0, r.top) + Math.min(r.height, innerHeight - Math.max(0, r.top)) / 2]; }, id);
      if (kid) { await page.mouse.click(kid[0], kid[1]); await page.waitForTimeout(250); for (let k = 0; k < 6 && (await selected(page)) !== id; k++) { await page.keyboard.press('Escape'); await page.waitForTimeout(150); } }
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
  const walk = (n, d) => { out.push('  '.repeat(d) + n.id.slice(-4) + ' ' + (n.type || '') + (n.rowBand ? ' BAND' : '') + (n.direction === 'row' ? ' ROW' : '') + (n.layout === 'grid' ? ' GRID' + (n.columns || 12) : '') + (n.colSpan ? ' span=' + n.colSpan : '') + (n.width ? ' w=' + n.width : '') + (n.marginLeft ? ' ml=' + n.marginLeft : '') + (n.marginLeftPct ? ' mlp=' + n.marginLeftPct : '')); (n.children || []).forEach((c) => walk(c, d + 1)); };
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
const dropInto = async (page, tile, id) => { const r = await visibleRect(page, id); if (r.hidden) throw new Error(`cannot drop into ${id.slice(-4)}: only ${Math.round(r.w)}×${Math.round(r.h)}px of it is visible`); await dropTile(page, tile, Math.round(r.l + r.w / 2), Math.round(r.t + r.h / 2)); };
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
/**
 * THE ONE KNOWN canvas ≠ Preview DIFFERENCE, and how much of it is accepted (#41, decided with the user 2026-09-27).
 * A desktop browser's classic vertical scrollbar takes ~15px out of the Preview's page but not out of the canvas, so a
 * block's share of the page can differ by about 0.4% at desktop widths. That is accepted, with headroom: a horizontal
 * share (left or width, % of the page) may differ by up to 0.6% and it is NOT a bug. Anything more is — report it.
 * Heights have their own 4px allowance (text rounding). Every Preview check uses these two, never a number of its own.
 */
const PREVIEW_SHARE_TOL = 0.6;
const PREVIEW_HEIGHT_TOL = 4;
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name) });
const same = (a, b, tol = 1) => a.kids.length === b.kids.length && a.kids.every((k, i) => k.id === b.kids[i].id && k.t === b.kids[i].t && Math.abs(k.l - b.kids[i].l) <= tol && Math.abs(k.w - b.kids[i].w) <= tol);
const fmt = (row) => row.kids.map((k) => `${k.id.slice(-4)}@${k.l},${k.t}:${k.w}`).join(' ');
module.exports = { PREVIEW_SHARE_TOL, PREVIEW_HEIGHT_TOL, fillStacks, fillImages, visibleRect, dropInto, open, panel, clickTile, dropTile, dropBeside, leaves, select, selected, handleOf, dragEdge, rowOf, storedRow, tree, rowProblems, shot, same, fmt, OUT };
