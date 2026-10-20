// HEADED UAT — BATCH LE-15d · Logos / Clients · List · Contact details · Questions & answers · Fees table · Latest news
// (docs/TASK_TREE.md BATCH LE-15d CHECKLIST D1–D14; box-builder-sections.feature "The trust, contact and school sections are in
// the gallery", "Each of the school kinds reflows…", "A question opens to its answer…", "A fee is read with its term…").
// Made from uat-le15c-headed.js (its probes kept; the D-numbers are LE-15d's checklist).
// One window per category, six side by side. Every state BUILT THROUGH THE UI (RULE Y): the Sections tab, its chips, the
// Wireframe | Designed switch, the Finish menu, every tile clicked (one by Enter, one dragged); localStorage only READ.
// Then the real Preview at EVERY width of screens.js (RULE Z): the page audit, no sideways scroll, and each kind's own reflow.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le15d-headed.js [--only=faq,list]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const I = require('./inspector.js');
const { WIDTHS } = require('./screens.js');
const { sleep, deselect, pvOpen, pvClose, pvAt, site } = require('./uat-rx3-headed.js');
const { auditDoc } = require('./page-audit.js');
const LAYOUT = require('../../config/layout.json');
const T = require('../../config/inspector.json').sections;
const COPY = require('../../config/section-copy.json');
const RUNGS = { tp: LAYOUT.rungs.tabletPortrait.from, tl: LAYOUT.rungs.tabletLandscape.from }; // RULE CFG
const DT = LAYOUT.rungs.desktop.from;
const CATS = require('../../config/sections.json').categories.filter((c) => c.batch === 'LE-15d');
const DEFS = Object.fromEntries(CATS.map((c) => [c.id, require(`../../config/sections/${c.id}.json`).sections]));
// a different finish per window, so all seven are added somewhere (the wireframe is checked on the tiles)
const ADD_IN = { logos: 'Serious', list: 'Minimalist', contact: 'Plain', faq: 'Calm', pricing: 'Startup', news: 'Bold' };
const OUT = path.join(__dirname, 'logs', 'le15d'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
const re = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function sectionsTab(page) {
  await deselect(page); await H.panel(page, true);
  await page.getByRole('tab', { name: T.tab, exact: true }).click();
  await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 20000 }); await sleep(page, 600);
}
const chip = (page, label) => page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: new RegExp(`^${re(label)}`) });
const tile = (page, name) => page.getByRole('button', { name: new RegExp(`^Add ${re(name)},`) }).first();
const finishMenu = (page) => page.getByText(T.finish, { exact: true }).locator('xpath=..').locator('button[aria-haspopup="listbox"]');
async function pickFinish(page, label) { await finishMenu(page).click(); await page.getByRole('option', { name: label, exact: true }).click(); await sleep(page, 1200); }
const blockOf = (band) => (band.rowBand && band.children && band.children.length === 1 ? band.children[0] : band);
async function activeRoot(page) {
  const s = await site(page); const shown = await page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).map((e) => e.getAttribute('data-box-id')));
  const has = (n) => shown.includes(n.id) || (n.children || []).some(has);
  return (s.pages.find((p) => has(p.root)) || s.pages[0]).root;
}
const walk = (n, f, parent = null) => { f(n, parent); (n.children || []).forEach((c) => walk(c, f, n)); };

function job(cat) {
  return async (page, J) => {
    const defs = DEFS[cat.id];
    await sectionsTab(page);
    const chips = (await page.getByRole('tablist', { name: T.categories }).getByRole('tab').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
    const mine = chips.find((t) => t.startsWith(cat.label));
    rec(J, 'D1 the category is in the gallery with its count', !!mine && mine.includes(String(cat.count)), mine || chips.join(' · '));
    await chip(page, cat.label).click(); await sleep(page, 3000);
    // ── the tiles ──
    await page.getByRole('button', { name: T.wireframe, exact: true }).click(); await sleep(page, 2000);
    const wire = await page.$$eval('button[aria-label^="Add "] iframe', (fs, copy) => fs.map((f) => ({ h: Math.round(f.parentElement.getBoundingClientRect().height), ph: copy.some((w) => f.srcdoc.includes(w)) })), Object.values(COPY).filter((v) => typeof v === 'string' && v.length > 3));
    rec(J, `D1 ${cat.count} live tiles in the Wireframe, each showing placeholders`, wire.length === cat.count && wire.every((t) => t.h > 40 && t.ph), `${wire.length} tiles · heights ${Math.min(...wire.map((t) => t.h))}–${Math.max(...wire.map((t) => t.h))}px · placeholders ${wire.filter((t) => t.ph).length}`);
    await shot(page, `${cat.id}-tiles-wireframe`);
    await page.getByRole('button', { name: 'Designed', exact: true }).click(); await sleep(page, 1200);
    const looks = []; const first = defs.find((d) => (d.tree.c || []).length);
    for (const f of ['Serious', 'Minimalist', 'Plain', 'Bold', 'Calm', 'Startup', 'Playful']) {
      await pickFinish(page, f);
      looks.push(await tile(page, first.name).locator('iframe').evaluate((x) => x.srcdoc.replace(/bx-[\w-]+/g, '')));
    }
    rec(J, 'D2 the seven finishes are seven different looks on a tile (RULE T)', new Set(looks).size === 7, `${new Set(looks).size} distinct on "${first.name}"`);
    await pickFinish(page, ADD_IN[cat.id]); await shot(page, `${cat.id}-tiles-${ADD_IN[cat.id]}`);
    // RULE C: a layout standing in for a component says so on its tile
    const needy = defs.filter((d) => (d.needs || []).length);
    if (needy.length) {
      const said = await Promise.all(needy.map((d) => tile(page, d.name).innerText().then((t) => d.needs.every((n) => t.includes(n))).catch(() => false)));
      rec(J, `D8 a tile names the component it waits for (${needy.map((d) => d.needs.join('+')).join(', ')})`, said.every(Boolean), `${said.filter(Boolean).length} / ${needy.length} say it`);
    }
    // ── every layout added through the UI: a click, one by Enter, one dragged ──
    let dragged = 'not tried', entered = 'not tried';
    for (const [i, def] of defs.entries()) {
      const t = tile(page, def.name); await t.scrollIntoViewIfNeeded();
      if (i === 1) { await t.focus(); await page.keyboard.press('Enter'); entered = 'Enter'; }
      else if (i === 2) {
        const root = await activeRoot(page); const secs = root.children.map(blockOf).filter((b) => b.tag === 'section');
        const target = secs[0]; const el = page.locator(`[data-box-id="${target.id}"]`).first(); const box = await el.boundingBox();
        await t.dragTo(el, { targetPosition: { x: Math.round(box.width / 2), y: 4 } }); dragged = 'dragged';
      } else await t.click();
      // LE15d-15: wait until THIS layout is on the page (a fixed 0.7 s missed one under six windows' load), at most 5 s
      for (let t = 0; t < 25; t++) { const s = await site(page); let on = false; walk({ children: s.pages.map((p) => p.root) }, (n) => { if (n.sectionFrom === def.id) on = true; }); if (on) break; await sleep(page, 200); }
      if (i === 0 || i === 1) await sectionsTab(page).then(() => chip(page, cat.label).click()).then(() => sleep(page, 1500)); // a click selects the new section: back to the tab, at the end of the page
    }
    await sleep(page, 1000);
    const root = await activeRoot(page);
    const placed = root.children.map(blockOf).filter((b) => b.sectionFrom && defs.some((d) => d.id === b.sectionFrom));
    const ids = new Set(placed.map((b) => b.sectionFrom));
    rec(J, `D3 every layout added through the UI (click · ${entered} · ${dragged})`, ids.size === defs.length, `${ids.size} / ${defs.length} on the page, finish ${[...new Set(placed.map((b) => b.sectionFinish))].join(',')}${ids.size < defs.length ? ` · MISSING ${defs.filter((d) => !ids.has(d.id)).map((d) => d.id).join(', ')}` : ''}`);
    await H.panel(page, false); await shot(page, `${cat.id}-canvas`);
    // what each kind must do across the widths, from the stored tree (the ids publish as bx-<id> classes)
    const plan = { stackPhone: [], span: [], pager: [], pic: null, beside: [], faq: [], fees: cat.id === 'pricing' };
    for (const sec of placed) walk(sec, (n) => {
      if (n.layout === 'grid' && n.minCard && (n.children || []).length >= 2) plan.stackPhone.push({ grid: n.id, kids: n.children.map((c) => c.id) });
      if (n.layout === 'grid' && !n.minCard && n.rowFlow !== 'masonry') {
        const big = (n.children || []).find((c) => (c.colSpan || 1) > 1); const small = (n.children || []).find((c) => (c.colSpan || 1) === 1);
        if (big && small) plan.span.push({ big: big.id, span: big.colSpan, small: small.id, kids: n.children.map((c) => c.id), firstIsBig: n.children[0] === big });
        const pic = (n.children || []).find((c) => c.type === 'image'); if (pic && !plan.pic) plan.pic = pic.id; // LE15c-13: a grid's own picture
      }
      if (n.pager) plan.pager.push({ strip: n.id, n: n.children.length, auto: n.pagerAuto || 0 });
      // List / News: a time, a date or a small photo of a fixed width stays BESIDE its item at every width (B23)
      const k = n.children || [];
      if (cat.id === 'list' && n.direction === 'row' && k.length === 2 && k[0].type !== 'image' && typeof k[0].width === 'string' && /rem$/.test(k[0].width) && k[1].width === 'fill') plan.beside.push({ a: k[0].id, b: k[1].id });
      if (n.component === 'accordion') plan.faq.push({ id: n.id, items: (n.items || []).map((i) => i.title) });
    });
    // ── the Preview, every width ──
    const f0 = await pvOpen(page); await sleep(page, 900);
    fs.writeFileSync(path.join(OUT, `${cat.id}-page.html`), await f0.content()); // the page as published, to measure a finding again by hand
    const moved = await f0.evaluate(() => Array.from(document.querySelectorAll('h2,h3,p,img')).some((h) => { for (let e = h; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (c.animationName !== 'none' || (/opacity|transform/.test(c.transitionProperty) && c.transitionDuration !== '0s')) return true; } return false; }));
    rec(J, 'D4 designed sections move (their entrance)', moved, moved ? 'animates' : 'still');
    const errs = {}; const kind = {}; const warns = new Set(); const raw = [];
    for (const w of WIDTHS) {
      const f = await pvAt(page, w, 820); await sleep(page, 150);
      const a = await f.evaluate(auditDoc, { rowBands: true, rungs: RUNGS });
      for (const e of a.err) (errs[e.replace(/\d+px|\d+(\.\d+)?/g, '#')] ||= []).push(w);
      a.warn.forEach((x) => warns.add(x.split(' ')[0]));
      if (a.err.length) raw.push({ w, err: a.err });
      const k = await f.evaluate(([plan, tp, dt]) => {
        const r = (id) => { const e = document.querySelector(`.bx-${id}`); return e ? e.getBoundingClientRect() : null; };
        const bad = []; const mw = window.innerWidth; // LE15b-2: the rung is what a media query sees — the window, scrollbar included
        // LE15b-12: no card alone on a line — the first row's count divides the cards, at every width
        for (const g of plan.stackPhone) { const rs = g.kids.map(r).filter(Boolean); if (rs.length < 2) continue; const top = Math.round(rs[0].top);
          const across = rs.filter((x) => Math.abs(Math.round(x.top) - top) <= 1).length;
          if (across > 1 && rs.length % across) bad.push(`A5 a card alone: ${rs.length} in rows of ${across}`); }
        // A7 / B28: on a desktop the big block covers its span; on a phone it comes first and nothing overlaps
        for (const s of plan.span) { const big = r(s.big), small = r(s.small); if (!big || !small) { bad.push('span: missing'); continue; }
          if (mw >= dt && big.width < small.width * 1.6) bad.push(`A7 desktop: the big block ${Math.round(big.width)} not ~${s.span}× ${Math.round(small.width)}`);
          if (mw < tp && s.firstIsBig && s.kids.map(r).filter(Boolean).some((x) => x.top < big.top - 1)) bad.push('A7 phone: the big block not first');
          const rs = s.kids.map(r).filter(Boolean);
          // LE15c-12: a picture fills its cell at every width — no blank band under it where the grid narrowed
          for (const id of s.kids) { const cell = document.querySelector(`.bx-${id}`); const img = cell && (cell.tagName === 'IMG' ? cell : cell.querySelector('img')); if (!img) continue;
            const c = cell.getBoundingClientRect(), i = img.getBoundingClientRect(); if (c.height > 40 && i.bottom < c.bottom - c.height * 0.15) bad.push(`A7 a blank band under a picture: ${Math.round(c.bottom - i.bottom)} of ${Math.round(c.height)}`); }
          for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) { const a = rs[i], b = rs[j];
            if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) bad.push('A7 two blocks overlap'); } }
        // B23: the time / date stays beside its item
        for (const p of plan.beside) { const a = r(p.a), b = r(p.b); if (!a || !b) continue; if (b.left < a.right - 1 || b.top > a.bottom - 1) bad.push(`B23 the item went under its time / date (${Math.round(a.width)}px beside ${Math.round(b.width)}px)`); }
        // B18: a fee says how often, in its own card
        if (plan.fees) for (const e of document.querySelectorAll('main *')) { if (e.children.length || !/^\s*(₦|GH₵|\$)\s*[\d,.]+/.test(e.textContent)) continue;
          let holder = e.parentElement; while (holder && holder.textContent.trim() === e.textContent.trim()) holder = holder.parentElement; /* LE15d-6: past its own row band, to its card (or its table) */ if (!/per |a term|a year|each term|once|a session|a month/i.test(holder.textContent)) bad.push(`B18 a fee with no "per term": ${e.textContent.trim()}`); }
        // a slideshow shows ONE slide at a time: each slide the strip's width, the strip scrolls sideways
        for (const p of plan.pager) { const el = document.querySelector(`.bx-${p.strip} [data-eu-pager]`); if (!el) { bad.push('pager: missing'); continue; } // LE15c-2: the strip is inside the box
          const kids = Array.from(el.children).filter((c) => c.getBoundingClientRect().width > 0);
          if (el.scrollWidth <= el.clientWidth + 1) bad.push('pager: the strip does not scroll');
          if (kids.some((c) => Math.abs(c.getBoundingClientRect().width - el.clientWidth) > 2)) bad.push('pager: a slide not one strip wide'); }
        return bad;
      }, [plan, RUNGS.tp, DT]).catch((e) => [`probe ${e.message.split('\n')[0]}`]);
      for (const b of k) (kind[b.replace(/\d+/g, '#')] ||= []).push(w);
    }
    fs.writeFileSync(path.join(OUT, `${cat.id}-audit.json`), JSON.stringify(raw, null, 1));
    const listed = (o) => Object.entries(o).map(([m, ws]) => `${m} @ ${ws.length === WIDTHS.length ? 'all' : ws.join(',')}`).join(' | ');
    rec(J, `D5 the page audit is clean at all ${WIDTHS.length} widths (no sideways scroll, no overlap, type, contrast)`, !Object.keys(errs).length, listed(errs) || `clean · warnings: ${[...warns].join(' ') || 'none'}`);
    const counts = `grids ${plan.stackPhone.length} · spanning ${plan.span.length} · beside ${plan.beside.length} · accordions ${plan.faq.length}${plan.fees ? ' · fees' : ''}`;
    rec(J, `D6 each kind reflows the way real sites do it, at every width (${counts})`, !Object.keys(kind).length, listed(kind) || 'as planned');
    for (const w of [375, 768, 1280]) { await pvAt(page, w, 820); await sleep(page, 300); await shot(page, `${cat.id}-preview-${w}`); }
    if (plan.pager.length) {
      // driven as a visitor does: the arrow key on the strip, the Next link, then a moving one held by hover
      const f = await pvAt(page, 1280, 820); const out = [];
      for (const p of plan.pager) {
        const strip = f.locator(`.bx-${p.strip} [data-eu-pager]`).first(); await strip.scrollIntoViewIfNeeded(); await sleep(page, 300);
        const at = () => strip.evaluate((e) => Math.round(e.scrollLeft / e.clientWidth));
        // LE15c-10: a moving one may have advanced already — pointing at it holds it (as a visitor's mouse does); start at the first
        await strip.hover(); await strip.evaluate((e) => e.scrollTo({ left: 0, behavior: 'instant' })); await sleep(page, 300);
        const s0 = await at(); await strip.focus(); await page.keyboard.press('ArrowRight'); await sleep(page, 900); const s1 = await at();
        const next = f.locator(`.bx-${p.strip} [data-eu-pager-next]`).first();
        let s2 = s1; if (await next.isVisible().catch(() => false)) { await next.click(); await sleep(page, 900); s2 = await at(); }
        out.push(`${p.strip.slice(-4)} ${s0}→${s1}→${s2}`);
        if (!(s1 > s0)) out.push('  the arrow key did not move it');
      }
      rec(J, 'C9 a slideshow moves by the arrow key and by its arrows, one slide at a time', !out.some((o) => o.startsWith('  ')), out.join(' · '));
    }
    if (plan.faq.length) {
      // D7 · a question opens to its answer by a click and by the keyboard; the answers are in the page with the FAQ schema
      const f = await pvAt(page, 1280, 820); const out = []; let ok = true;
      const total = plan.faq.reduce((s, a) => s + a.items.length, 0);
      const details = await f.locator('details').count();
      const schema = await f.evaluate(() => Array.from(document.querySelectorAll('script[type="application/ld+json"]')).some((s) => s.textContent.includes('FAQPage')));
      if (details < total || !schema) ok = false; out.push(`${details} details for ${total} questions · FAQ schema ${schema}`);
      const sum = f.locator('details > summary');
      const second = sum.nth(1); await second.scrollIntoViewIfNeeded(); await second.click(); await sleep(page, 400);
      const byClick = await second.evaluate((x) => x.parentElement.open); out.push(`a click opens #2: ${byClick}`);
      const third = sum.nth(2); await third.focus(); await page.keyboard.press('Enter'); await sleep(page, 400);
      const byKey = await third.evaluate((x) => x.parentElement.open); out.push(`Enter opens #3: ${byKey}`);
      await page.keyboard.press('Space'); await sleep(page, 300); const closed = !(await third.evaluate((x) => x.parentElement.open)); out.push(`Space closes it: ${closed}`);
      await shot(page, `${cat.id}-preview-open`);
      rec(J, 'D7 a question opens to its answer by a click and by Enter / Space; every answer in the page with the FAQ schema', ok && byClick && byKey && closed, out.join(' · '));
    }
    await pvClose(page, 1366);
    if (plan.faq.length) {
      // D7 · a question is mine to change in the Inspector; the canvas shows it; Ctrl+Z puts it back
      const acc = plan.faq[0]; const was = acc.items[0];
      await H.select(page, acc.id); await I.tab(page, 'Content'); await sleep(page, 400);
      const field = page.getByLabel('Item 1 title').first(); const shown = await field.inputValue().catch(() => '');
      await field.fill('Can my child start in the middle of a term?'); await field.press('Tab'); await sleep(page, 600);
      const onCanvas = await page.locator(`[data-box-id="${acc.id}"]`).first().innerText().catch(() => '');
      await page.keyboard.press('Escape'); await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 600);
      const s5 = await site(page); let back = null; walk({ children: s5.pages.map((p) => p.root) }, (n) => { if (n.id === acc.id) back = n.items[0].title; });
      rec(J, "D7 a question's words changed in the Inspector show on the canvas; Ctrl+Z puts them back", shown === was && onCanvas.includes('middle of a term') && back === was, `shown "${shown.slice(0, 30)}" · canvas ${onCanvas.includes('middle of a term')} · undo → "${(back || '').slice(0, 30)}"`);
    }
    if (plan.span.length) {
      // the span is the person's: the Inspector's "Columns wide" on the big block, changed and undone
      // LE15c-5: clicked as a person does — each click one box deeper (H.select) — then the Inspector's Grid cell opened
      await H.select(page, plan.span[0].big); await I.tab(page, 'Design'); await I.section(page, 'Grid cell'); await sleep(page, 400);
      const wide = page.getByLabel('Columns wide').first();
      const was = await wide.inputValue().catch(() => '');
      await wide.fill('1'); await wide.press('Enter'); await sleep(page, 600);
      const now = (await activeRoot(page)) && (await site(page)); let after = null; walk({ children: now.pages.map((p) => p.root) }, (n) => { if (n.id === plan.span[0].big) after = n.colSpan; });
      await page.keyboard.press('Escape'); await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 600);
      const s2 = await site(page); let back = null; walk({ children: s2.pages.map((p) => p.root) }, (n) => { if (n.id === plan.span[0].big) back = n.colSpan; });
      rec(J, 'C10 the big block\'s span is in the Inspector ("Columns wide"), mine to change; Ctrl+Z puts it back', was === String(plan.span[0].span) && after === 1 && back === plan.span[0].span, `shown ${was} · set 1 → ${after} · undo → ${back}`);
    }
    if (plan.pic) {
      // LE15c-13 (the user: "Widen G-3d"): a grid's picture covers its cell — the switch is offered, off keeps its own shape, Ctrl+Z covers again
      const pic = page.locator(`[data-box-id="${plan.pic}"] img`).first();
      const gap = () => pic.evaluate((i) => { const c = i.closest('[data-box-id]').getBoundingClientRect(), r = i.getBoundingClientRect(); return Math.round(c.bottom - r.bottom); }).catch(() => -1);
      await H.select(page, plan.pic); await I.tab(page, 'Content');
      const sw = page.getByRole('checkbox', { name: /Fill the block's height/ });
      const shown = (await sw.count()) === 1 && await sw.isChecked(); const g0 = await gap();
      if (shown) { await sw.uncheck(); await sleep(page, 500); }
      const s3 = await site(page); let off = null; walk({ children: s3.pages.map((p) => p.root) }, (n) => { if (n.id === plan.pic) off = n.fillHeight; });
      await page.keyboard.press('Escape'); await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 600);
      const s4 = await site(page); let back = 'x'; walk({ children: s4.pages.map((p) => p.root) }, (n) => { if (n.id === plan.pic) back = n.fillHeight; });
      rec(J, 'C16 a grid\'s picture covers its cell on the canvas; "Fill the block\'s height" is offered, off keeps its own shape, Ctrl+Z covers again (LE15c-13)', shown && g0 >= 0 && g0 <= 1 && off === false && back === undefined, `switch ${shown} · band on the canvas ${g0}px · off → ${off} · undo → ${back}`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' }); const f2 = await pvOpen(page); await sleep(page, 600);
    const still = await f2.evaluate(() => Array.from(document.querySelectorAll('h2,h3,p')).every((h) => +getComputedStyle(h).opacity === 1));
    let held = 'no moving slideshow';
    const moving = plan.pager.filter((p) => p.auto);
    if (moving.length) {
      const at = () => f2.locator(`.bx-${moving[0].strip} [data-eu-pager]`).first().evaluate((e) => e.scrollLeft);
      const a = await at(); await sleep(page, (moving[0].auto + 1.5) * 1000); const b = await at();
      held = a === b ? `held still for ${moving[0].auto + 1.5}s` : `MOVED ${a}→${b}`;
    }
    rec(J, 'D4 with reduced motion every word is there at once, and a slideshow does not move by itself', still && !held.startsWith('MOVED'), `${still ? 'still, visible' : 'hidden while it waits'} · ${held}`);
    await pvClose(page, 1366);
  };
}
const JOBS = Object.fromEntries(CATS.map((c) => [c.id, job(c)]));

(async () => {
  const jobs = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...jobs];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, `${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
      rec(J, 'console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
