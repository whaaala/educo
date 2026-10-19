// HEADED UAT — BATCH LE-15b · About · Text · Features / Services · Spotlight / zig-zag · Stats · CTA / Banner
// (docs/TASK_TREE.md BATCH LE-15b CHECKLIST; box-builder-sections.feature "The story, trust and action sections are in the
// gallery", "Each kind reflows the way real sites do it", "A zig-zag puts the picture first on a phone…").
// One window per category, six side by side. Every state BUILT THROUGH THE UI (RULE Y): the Sections tab, its chips, the
// Wireframe | Designed switch, the Finish menu, every tile clicked (one by Enter, one dragged); localStorage only READ.
// Then the real Preview at EVERY width of screens.js (RULE Z): the page audit, no sideways scroll, and each kind's own reflow.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le15b-headed.js [--only=stats,cta]
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const { WIDTHS } = require('./screens.js');
const { sleep, deselect, pvOpen, pvClose, pvAt, site } = require('./uat-rx3-headed.js');
const { auditDoc } = require('./page-audit.js');
const LAYOUT = require('../../config/layout.json');
const T = require('../../config/inspector.json').sections;
const COPY = require('../../config/section-copy.json');
const RUNGS = { tp: LAYOUT.rungs.tabletPortrait.from, tl: LAYOUT.rungs.tabletLandscape.from }; // RULE CFG
const DT = LAYOUT.rungs.desktop.from;
const CATS = require('../../config/sections.json').categories.filter((c) => c.batch === 'LE-15b');
const DEFS = Object.fromEntries(CATS.map((c) => [c.id, require(`../../config/sections/${c.id}.json`).sections]));
// a different finish per window, so all seven are added somewhere (the wireframe is checked on the tiles)
const ADD_IN = { about: 'Serious', text: 'Minimalist', features: 'Startup', spotlight: 'Calm', stats: 'Bold', cta: 'Playful' };
const OUT = path.join(__dirname, 'logs', 'le15b'); fs.mkdirSync(OUT, { recursive: true });
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
    rec(J, 'C1 the category is in the gallery with its count', !!mine && mine.includes(String(cat.count)), mine || chips.join(' · '));
    if (cat.id === 'text') {
      // LE15b-15 (the user's decision): the tab says a section is not a page, and its "Add a page" opens the dialog with templates
      const said = await page.getByText(T.wholePage).isVisible().catch(() => false);
      const groups = await page.getByRole('tablist', { name: T.categories }).locator('span[aria-hidden="true"]').allInnerTexts();
      await shot(page, 'text-hint-groups');
      await page.getByRole('button', { name: T.wholePageButton, exact: true }).click(); await sleep(page, 900);
      const dlg = page.getByRole('dialog', { name: T.addPageTitle });
      const opened = await dlg.isVisible().catch(() => false);
      const templates = opened ? await dlg.getByRole('button', { name: /^Add .+ page|template/i }).count().catch(() => 0) : 0;
      await shot(page, 'text-add-page-dialog');
      await page.keyboard.press('Escape'); await sleep(page, 600);
      rec(J, 'C8 a section is never mistaken for a page: the hint, "Add a page" opens the dialog, the kinds under their groups (LE15b-15)', said && opened && groups.length === new Set(require('../../config/sections.json').categories.filter((c) => fs.existsSync(path.join(__dirname, '../../config/sections', `${c.id}.json`))).map((c) => c.group)).size, `hint ${said} · dialog ${opened} (${templates} template buttons) · groups ${groups.map((g) => g.trim()).join(', ')}`);
      await sectionsTab(page);
    }
    await chip(page, cat.label).click(); await sleep(page, 3000);
    // ── the tiles ──
    await page.getByRole('button', { name: T.wireframe, exact: true }).click(); await sleep(page, 2000);
    const wire = await page.$$eval('button[aria-label^="Add "] iframe', (fs, copy) => fs.map((f) => ({ h: Math.round(f.parentElement.getBoundingClientRect().height), ph: copy.some((w) => f.srcdoc.includes(w)) })), Object.values(COPY).filter((v) => typeof v === 'string' && v.length > 3));
    rec(J, `C1 ${cat.count} live tiles in the Wireframe, each showing placeholders`, wire.length === cat.count && wire.every((t) => t.h > 40 && t.ph), `${wire.length} tiles · heights ${Math.min(...wire.map((t) => t.h))}–${Math.max(...wire.map((t) => t.h))}px · placeholders ${wire.filter((t) => t.ph).length}`);
    await shot(page, `${cat.id}-tiles-wireframe`);
    await page.getByRole('button', { name: 'Designed', exact: true }).click(); await sleep(page, 1200);
    const looks = []; const first = defs.find((d) => (d.tree.c || []).length);
    for (const f of ['Serious', 'Minimalist', 'Plain', 'Bold', 'Calm', 'Startup', 'Playful']) {
      await pickFinish(page, f);
      looks.push(await tile(page, first.name).locator('iframe').evaluate((x) => x.srcdoc.replace(/bx-[\w-]+/g, '')));
    }
    rec(J, 'C2 the seven finishes are seven different looks on a tile (RULE T)', new Set(looks).size === 7, `${new Set(looks).size} distinct on "${first.name}"`);
    await pickFinish(page, ADD_IN[cat.id]); await shot(page, `${cat.id}-tiles-${ADD_IN[cat.id]}`);
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
      await sleep(page, 700);
      if (i === 0 || i === 1) await sectionsTab(page).then(() => chip(page, cat.label).click()).then(() => sleep(page, 1500)); // a click selects the new section: back to the tab, at the end of the page
    }
    await sleep(page, 1000);
    const root = await activeRoot(page);
    const placed = root.children.map(blockOf).filter((b) => b.sectionFrom && defs.some((d) => d.id === b.sectionFrom));
    const ids = new Set(placed.map((b) => b.sectionFrom));
    rec(J, `C3 every layout added through the UI (click · ${entered} · ${dragged})`, ids.size === defs.length, `${ids.size} / ${defs.length} on the page, finish ${[...new Set(placed.map((b) => b.sectionFinish))].join(',')}`);
    await H.panel(page, false); await shot(page, `${cat.id}-canvas`);
    // what each kind must do across the widths, from the stored tree (the ids publish as bx-<id> classes)
    const plan = { phoneFirst: [], twoUp: [], stackPhone: [], fullBtn: [], spread: [] };
    for (const sec of placed) walk(sec, (n, p) => {
      if (n.type === 'image' && n.responsive?.phone?.order < 0 && p) plan.phoneFirst.push({ img: n.id, other: p.children.filter((c) => c !== n).map((c) => c.id) });
      if (sec.sectionFrom.startsWith('stats-') && n.layout === 'grid' && n.responsive?.tabletPortrait?.fitMost === 2 && (n.children || []).length === 4) plan.twoUp.push({ grid: n.id, kids: n.children.map((c) => c.id) });
      if (n.layout === 'grid' && n.minCard && (n.children || []).length >= 2) plan.stackPhone.push({ grid: n.id, kids: n.children.map((c) => c.id) });
      if (n.type === 'button' && n.responsive?.phone?.width === '100%') plan.fullBtn.push({ btn: n.id, words: p.children.filter((c) => c !== n).map((c) => c.id) });
      if (n.type === 'container' && n.justify === 'between' && n.layout !== 'grid' && (n.children || []).length > 1) plan.spread.push({ row: n.id, last: n.children[n.children.length - 1].id });
    });
    // ── the Preview, every width ──
    const f0 = await pvOpen(page); await sleep(page, 900);
    fs.writeFileSync(path.join(OUT, `${cat.id}-page.html`), await f0.content()); // the page as published, to measure a finding again by hand
    const moved = await f0.evaluate(() => Array.from(document.querySelectorAll('h2,h3,p,img')).some((h) => { for (let e = h; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (c.animationName !== 'none' || (/opacity|transform/.test(c.transitionProperty) && c.transitionDuration !== '0s')) return true; } return false; }));
    rec(J, 'C4 designed sections move (their entrance)', moved, moved ? 'animates' : 'still');
    const errs = {}; const kind = {}; const warns = new Set(); const raw = [];
    for (const w of WIDTHS) {
      const f = await pvAt(page, w, 820); await sleep(page, 150);
      const a = await f.evaluate(auditDoc, { rowBands: true, rungs: RUNGS });
      for (const e of a.err) (errs[e.replace(/\d+px|\d+(\.\d+)?/g, '#')] ||= []).push(w);
      a.warn.forEach((x) => warns.add(x.split(' ')[0]));
      if (a.err.length) raw.push({ w, err: a.err });
      const k = await f.evaluate(([plan, tp, tl, dt]) => {
        const r = (id) => { const e = document.querySelector(`.bx-${id}`); return e ? e.getBoundingClientRect() : null; };
        const bad = []; const mw = window.innerWidth; // LE15b-2: the rung is what a media query sees — the window, scrollbar included
        for (const z of plan.phoneFirst) { const i = r(z.img); for (const o of z.other.map(r).filter(Boolean)) { if (!i) { bad.push('no img'); continue; }
          if (mw < tp && i.top > o.top + 1) bad.push(`A8 phone: picture below its words (${Math.round(i.top)} > ${Math.round(o.top)})`);
          if (mw >= dt && i.left < o.left) bad.push('A8 desktop: picture moved to the left'); } }
        for (const g of plan.twoUp) { const tops = new Set(g.kids.map(r).filter(Boolean).map((x) => Math.round(x.top))).size;
          if (mw < tl && tops !== 2) bad.push(`B16 phone / tablet upright: ${tops} rows, want 2 × 2`);
          if (mw >= tl && tops !== 1) bad.push(`B16 tablet sideways and up: ${tops} rows, want one`); }
        // LE15b-12: no card alone on a line — the first row's count divides the cards, at every width
        for (const g of plan.stackPhone) { const rs = g.kids.map(r).filter(Boolean); if (rs.length < 2) continue; const top = Math.round(rs[0].top);
          const across = rs.filter((x) => Math.abs(Math.round(x.top) - top) <= 1).length;
          if (across > 1 && rs.length % across) bad.push(`B14 a card alone: ${rs.length} in rows of ${across}`); }
        for (const z of plan.spread) { const row = r(z.row), last = r(z.last); if (mw >= tl && row && last && last.right < row.right - 2) bad.push(`B20 wide: the last block ends ${Math.round(row.right - last.right)}px short of its spread row`); }
        for (const b of plan.fullBtn) { const btn = r(b.btn); const words = b.words.map(r).filter(Boolean); const p = document.querySelector(`.bx-${b.btn}`)?.parentElement?.getBoundingClientRect();
          if (mw < tp && btn && p && btn.width < p.width - 2) bad.push(`B20 phone: button ${Math.round(btn.width)} of ${Math.round(p.width)}`);
          if (mw < tp && btn && words.some((x) => btn.top < x.bottom - 1)) bad.push('B20 phone: button not under the words'); }
        return bad;
      }, [plan, RUNGS.tp, RUNGS.tl, DT]).catch((e) => [`probe ${e.message.split('\n')[0]}`]);
      for (const b of k) (kind[b.replace(/\d+/g, '#')] ||= []).push(w);
    }
    fs.writeFileSync(path.join(OUT, `${cat.id}-audit.json`), JSON.stringify(raw, null, 1));
    const listed = (o) => Object.entries(o).map(([m, ws]) => `${m} @ ${ws.length === WIDTHS.length ? 'all' : ws.join(',')}`).join(' | ');
    rec(J, `C5 the page audit is clean at all ${WIDTHS.length} widths (no sideways scroll, no overlap, type, contrast)`, !Object.keys(errs).length, listed(errs) || `clean · warnings: ${[...warns].join(' ') || 'none'}`);
    const counts = `phone-first ${plan.phoneFirst.length} · 2×2 ${plan.twoUp.length} · grids ${plan.stackPhone.length} · full button ${plan.fullBtn.length} · spread ${plan.spread.length}`;
    rec(J, `C6 each kind reflows the way real sites do it, at every width (${counts})`, !Object.keys(kind).length, listed(kind) || 'as planned');
    for (const w of [375, 768, 1280]) { await pvAt(page, w, 820); await sleep(page, 300); await shot(page, `${cat.id}-preview-${w}`); }
    await pvClose(page, 1366);
    if (cat.id === 'cta') {
      // LE15b-11 (the user's decision): the small heading dragged to the top is the page's main title — the Page check says so,
      // and its one button gives it the biggest heading's size; driven as a person does, then measured in the Preview
      const PC = require('../../config/page-check.json');
      await page.getByRole('button', { name: /Page check/ }).first().click(); await sleep(page, 900);
      const dlg = page.getByRole('dialog', { name: /Page check/ });
      const said = await dlg.getByText(/main title, but it is smaller than headings further down/).isVisible().catch(() => false);
      await shot(page, 'cta-page-check');
      const fix = dlg.getByRole('button', { name: PC.titleSmallerFix });
      if (await fix.isVisible().catch(() => false)) { await fix.click(); await sleep(page, 900); }
      const gone = !(await dlg.getByText(/main title, but it is smaller/).isVisible().catch(() => false));
      await page.keyboard.press('Escape'); await sleep(page, 500);
      const f3 = await pvOpen(page); await pvAt(page, 375, 820); await sleep(page, 300);
      const h = await f3.evaluate(() => { const one = document.querySelector('h1'), twos = Array.from(document.querySelectorAll('h2')); const px = (e) => parseFloat(getComputedStyle(e).fontSize); return one ? `${px(one)} vs ${Math.max(...twos.map(px))}` : 'no h1'; });
      const [a, b] = h.split(' vs ').map(Number);
      rec(J, 'C7 the Page check names the small main title, and "Make it the page title size" fixes it (LE15b-11)', said && gone && a >= b, `said ${said} · gone ${gone} · h1 ${h} at 375`);
      await pvClose(page, 1366);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' }); const f2 = await pvOpen(page); await sleep(page, 600);
    const still = await f2.evaluate(() => Array.from(document.querySelectorAll('h2,h3,p')).every((h) => +getComputedStyle(h).opacity === 1));
    rec(J, 'C4 with reduced motion every word is there at once', still, still ? 'still, visible' : 'hidden while it waits');
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
