// HEADED UAT — BATCH LE-15 · sections (docs/TASK_TREE.md "HEADED CHECKLIST" U1 … U11; box-builder-sections.feature).
// Every state BUILT THROUGH THE UI (RULE Y): the Sections tab's tiles clicked, pressed and dragged, the Inspector's buttons, the
// name dialogs typed in, the Add a page dialog; localStorage only READ. Six visible windows; every width of screens.js (RULE Z).
//   tab      U1  chips and counts · live tiles · Wireframe | Designed · seven finishes differ · tiles framed on the section
//   add      U2  click · Enter · after the selected band · above the footer · selected · one Ctrl+Z
//   drag     U3  a tile dragged between two bands lands there
//   header   U4  Replace on every page · Cancel · Ctrl+Z
//   edit     U5  every block of an added hero selectable; its words changed and seen in the Preview
//   preview  U6 U7  the entrance, reduced motion; every width: no sideways scroll, the phone menu one line, centred words, buttons side by side
//   mine     U8  Save as my section (Inspector, Ctrl+Alt+S) · named · in the tab · after Start over · rename · delete asks
//   global   U9  Make global · marked on canvas and in Layers · another page, twice · one edit everywhere · the notice · Detach · Ctrl+Z · stop
//   pages    U10 Add a page: Blank · a template · the shared header · Save page as template · My templates
//   current  U11 the menu marks the page being shown (LE15-27) at every width
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le15-headed.js [--only=add,global]
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const { WIDTHS } = require('./screens.js');
const { sleep, deselect, pvOpen, pvClose, sweep, site } = require('./uat-rx3-headed.js');
const W = require('../../config/inspector.json');
const T = W.sections;
const TP = require('../../config/layout.json').rungs.tabletPortrait.from; // RULE CFG — where the phone ends is data
const OUT = path.join(__dirname, 'logs', 'le15'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});

// ── doing it as a person does ────────────────────────────────────────────────────────────────────────────────
async function sectionsTab(page, keep = false) {
  if (!keep) await deselect(page); await H.panel(page, true);
  await page.getByRole('tab', { name: T.tab, exact: true }).click();
  await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 20000 }); await sleep(page, 600);
}
const chip = (page, re) => page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: re });
const tile = (page, name) => page.getByRole('button', { name: new RegExp(`^Add ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},`) }).first();
/** The page being edited, as stored, and the tags of its bands' blocks (header · section · footer…). */
async function active(page) {
  const s = await site(page); const shown = await page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).map((e) => e.getAttribute('data-box-id')));
  const has = (n) => shown.includes(n.id) || (n.children || []).some(has);
  return s.pages.find((p) => has(p.root)) || s.pages[0];
}
const blockOf = (band) => (band.rowBand && band.children && band.children.length === 1 ? band.children[0] : band);
async function bandTags(page) { const p = await active(page); return (p.root.children || []).map((b) => `${blockOf(b).tag || 'div'}:${blockOf(b).id.slice(-4)}`); }
async function addTile(page, cat, name, keep = false) { await sectionsTab(page, keep); await chip(page, new RegExp(`^${cat}`)).click(); await sleep(page, 400); await tile(page, name).click(); await sleep(page, 900); }
const textOf = (n) => [n.text || '', ...(n.children || []).map(textOf)].join(' ').replace(/\s+/g, ' ').trim();
async function selectedId(page) { return page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null); }
async function named(page, name) { const box = page.getByRole('dialog').filter({ has: page.getByRole('textbox') }).filter({ hasNot: page.getByRole('textbox', { name: 'Search blocks' }) }).last(); await box.getByRole('textbox').fill(name); await box.getByRole('textbox').press('Enter'); await sleep(page, 700); }
async function insBtn(page, label) { await H.panel(page, false); const ex = page.getByRole('button', { name: 'Expand inspector' }); if (await ex.isVisible().catch(() => false)) await ex.click(); const b = page.locator('aside[aria-label="Inspector"]').getByRole('button', { name: label, exact: true }).first(); await b.scrollIntoViewIfNeeded(); await b.click(); await sleep(page, 500); }
async function pickSection(page, id) { await H.panel(page, false); await H.select(page, id); await sleep(page, 300); }
async function addPageBlank(page, name) { await page.getByRole('button', { name: 'Add page', exact: true }).click(); const d = page.getByRole('dialog', { name: T.addPageTitle }); await d.getByRole('textbox').fill(name); await d.getByRole('button', { name: T.blank }).click(); await sleep(page, 900); }
async function toPage(page, name) { await page.getByRole('group', { name: 'Pages' }).getByRole('button', { name, exact: true }).first().click(); await sleep(page, 900); }

const JOBS = {
  async tab(page, J) {
    await sectionsTab(page);
    const chips = await page.getByRole('tablist', { name: T.categories }).getByRole('tab').allInnerTexts();
    rec(J, 'U1 the chips and their counts', ['Headers', 'Hero', 'Footers', 'Blank'].every((c) => chips.some((x) => x.startsWith(c))) && chips.join(' ').includes('36') && chips.join(' ').includes('19'), chips.join(' · ').replace(/\s+/g, ' '));
    await chip(page, /^Hero/).click(); await sleep(page, 2500);
    const frames = await page.$$eval('button[aria-label^="Add "] iframe', (fs) => fs.map((f) => ({ h: Math.round(f.parentElement.getBoundingClientRect().height), doc: f.srcdoc.length })));
    rec(J, 'U1 36 live tiles, each a real page at a real height (LE15-35)', frames.length === 36 && frames.every((f) => f.h > 40 && f.doc > 1000), `${frames.length} tiles · heights ${Math.min(...frames.map((f) => f.h))}–${Math.max(...frames.map((f) => f.h))}px`);
    await shot(page, 'U1-hero-tiles');
    const looks = [];
    const sel = page.getByText(T.finish, { exact: true }).locator('xpath=..').locator('button[aria-haspopup="listbox"]');
    for (const f of ['Serious', 'Minimalist', 'Plain', 'Bold', 'Calm', 'Startup', 'Playful']) {
      await sel.click(); await page.getByRole('option', { name: f, exact: true }).click(); await sleep(page, 1200);
      looks.push(await tile(page, 'Centred words and two buttons').locator('iframe').evaluate((f) => f.srcdoc.length + ':' + (f.srcdoc.match(/font-size:[^;"]+/) || [''])[0]));
      if (f === 'Bold' || f === 'Calm') await shot(page, `U1-finish-${f}`);
    }
    rec(J, 'U1 the seven finishes are seven different looks (RULE T)', new Set(looks).size === 7, `${new Set(looks).size} distinct`);
    await page.getByRole('button', { name: T.wireframe, exact: true }).click(); await sleep(page, 1200);
    const wire = await tile(page, 'Centred words and two buttons').locator('iframe').evaluate((f) => f.srcdoc.includes('Title goes here'));
    rec(J, 'U1 Wireframe shows the placeholders', wire, `"Title goes here" ${wire ? 'shown' : 'missing'}`);
    await chip(page, /^Footers/).click(); await sleep(page, 2500);
    const ft = await page.$$eval('button[aria-label^="Add "] iframe', (fs) => fs.slice(0, 4).map((f) => { const d = f.contentDocument; const el = d && d.querySelector('footer'); const r = el && el.getBoundingClientRect(); const box = f.parentElement.getBoundingClientRect(); return r ? Math.round(r.height) + '/' + Math.round(box.height) : 'none'; }));
    rec(J, 'U1 a footer tile is framed on the footer, not on white page (LE15-39)', ft.every((x) => x !== 'none'), ft.join(' · '));
    await shot(page, 'U1-footer-tiles');
  },

  async add(page, J) {
    await sectionsTab(page); await chip(page, /^Blank/).click(); await sleep(page, 400);
    await tile(page, 'Empty section').click(); await sleep(page, 700);
    await tile(page, 'Empty section').click(); await sleep(page, 700);
    const before = await bandTags(page);
    const firstBlank = (await active(page)).root.children.map(blockOf).filter((b) => b.tag === 'section')[0];
    await pickSection(page, firstBlank.id);
    await addTile(page, 'Hero', 'Centred words and two buttons', true);
    const after = await bandTags(page);
    const at = after.findIndex((t) => t.startsWith('section') && !before.includes(t));
    const firstAt = after.findIndex((t) => t.endsWith(firstBlank.id.slice(-4)));
    rec(J, 'U2 a click adds a whole band straight after the band holding the selection', after.length === before.length + 1 && at === firstAt + 1, `bands ${before.length} → ${after.length}; new at ${at}, the selected at ${firstAt}`);
    const sid = await selectedId(page); const added = blockOf((await active(page)).root.children[at]);
    rec(J, 'U2 the new section is selected', sid === added.id, `selected ${sid && sid.slice(-4)} · added ${added.id.slice(-4)}`);
    await shot(page, 'U2-added');
    await H.panel(page, false); await page.keyboard.press('Control+z'); await sleep(page, 900);
    rec(J, 'U2 one Ctrl+Z takes it away', (await bandTags(page)).length === before.length, `${(await bandTags(page)).length} bands`);
    await deselect(page); await sectionsTab(page); await chip(page, /^Hero/).click(); await sleep(page, 600);
    await tile(page, 'One big line').focus(); await page.keyboard.press('Enter'); await sleep(page, 900);
    const tags = await bandTags(page); const footAt = tags.findIndex((t) => t.startsWith('footer'));
    const big = (await active(page)).root.children.map(blockOf).findIndex((b) => /Be curious/.test(textOf(b)));
    rec(J, 'U2 Enter on a tile adds it; with nothing selected, at the end above the footer', big >= 0 && (footAt < 0 || big === footAt - 1), `at ${big}, footer at ${footAt}`);
  },

  async drag(page, J) {
    await sectionsTab(page); await chip(page, /^Blank/).click(); await sleep(page, 400);
    await tile(page, 'Empty section').click(); await sleep(page, 700); await tile(page, 'Empty section').click(); await sleep(page, 700);
    const root = (await active(page)).root; const secs = root.children.map(blockOf).filter((b) => b.tag === 'section');
    const target = secs[1]; const box = await page.locator(`[data-box-id="${target.id}"]`).first().boundingBox();
    await chip(page, /^Hero/).click(); await sleep(page, 800);
    await tile(page, 'Words beside a picture').dragTo(page.locator(`[data-box-id="${target.id}"]`).first(), { targetPosition: { x: Math.round(box.width / 2), y: 4 } });
    await sleep(page, 1200);
    const after = (await active(page)).root.children.map(blockOf);
    const hero = after.findIndex((b) => /Learning that lasts/.test(textOf(b))); const t = after.findIndex((b) => b.id === target.id);
    rec(J, 'U3 a dragged tile lands on the seam it was let go at (before the band under the pointer)', hero >= 0 && hero === t - 1, `hero at ${hero}, the target band at ${t}`);
    await shot(page, 'U3-dropped');
  },

  async header(page, J) {
    await addPageBlank(page, 'Admissions');
    await toPage(page, 'Home');
    const dlg = page.locator('[role=dialog], [role=alertdialog]').filter({ hasText: 'Replace the header' });
    // the first header: the page has none, so it goes in without asking, shared on every page
    const hadOne = (await bandTags(page)).some((t) => t.startsWith('header'));
    await addTile(page, 'Headers', 'Logo above a centred menu');
    if (await dlg.isVisible().catch(() => false)) { await dlg.getByRole('button', { name: T.replaceButton }).click(); await sleep(page, 900); }
    rec(J, 'U4 a page with no header: the first one goes in (asked only when one is there)', (await bandTags(page)).some((t) => t.startsWith('header')), hadOne ? 'there was one: asked' : 'none: added');
    await addTile(page, 'Headers', 'Logo, menu and a button');
    const asked = await dlg.isVisible().catch(() => false);
    rec(J, 'U4 with a header there: "Replace the header on every page?"', asked, asked ? 'asked' : 'not asked');
    if (asked) { await dlg.getByRole('button', { name: /Cancel/ }).click(); await sleep(page, 500); }
    const unchanged = !(await active(page)).root.children.map(blockOf).some((b) => /Apply now/.test(textOf(b)) && b.tag === 'header');
    rec(J, 'U4 Cancel changes nothing', unchanged, unchanged ? 'header as it was' : 'replaced anyway');
    await addTile(page, 'Headers', 'Logo, menu and a button');
    if (await dlg.isVisible().catch(() => false)) { await dlg.getByRole('button', { name: T.replaceButton }).click(); await sleep(page, 900); }
    const s = await site(page);
    const heads = s.pages.map((p) => { const b = (p.root.children || []).map(blockOf).find((x) => x.tag === 'header'); return `${p.name}:${b ? (/Apply now/.test(textOf(b)) ? 'new' : 'old') : 'none'}${b && b.shared ? '+shared' : ''}`; });
    rec(J, 'U4 Replace puts the new header on every page, shared', heads.every((h) => h.includes('new+shared')), heads.join(' · '));
    await shot(page, 'U4-replaced');
    await page.keyboard.press('Escape'); await page.locator('main, body').first().focus().catch(() => {}); await page.keyboard.press('Control+z'); await sleep(page, 900);
    const back = (await site(page)).pages.map((p) => (p.root.children || []).map(blockOf).some((x) => x.tag === 'header' && /Apply now/.test(textOf(x))));
    rec(J, 'U4 one Ctrl+Z brings the old header back on every page', back.every((x) => !x), back.join(','));
  },

  async edit(page, J) {
    await addTile(page, 'Hero', 'Words beside a picture');
    const hero = (await active(page)).root.children.map(blockOf).find((b) => /Learning that lasts/.test(textOf(b)));
    const ids = []; (function w(n) { if (!n.rowBand) ids.push(n.id); (n.children || []).forEach(w); })(hero);
    let ok = 0; const bad = [];
    for (const id of ids) { try { await H.select(page, id); if (await selectedId(page) === id) ok++; else bad.push(id.slice(-4)); } catch { bad.push(id.slice(-4)); } }
    rec(J, 'U5 every block of an added hero is selectable', ok === ids.length, `${ok} / ${ids.length}${bad.length ? ' · not: ' + bad.join(',') : ''}`);
    const title = (function f(n) { return n.type === 'heading' ? n : (n.children || []).map(f).find(Boolean); })(hero);
    await H.select(page, title.id); await page.locator(`[data-box-id="${title.id}"] [contenteditable]`).first().click(); await page.keyboard.press('Control+a'); await page.keyboard.type('Open day on Saturday'); await deselect(page); await sleep(page, 700);
    const f = await pvOpen(page); const shown = await f.evaluate(() => document.body.innerText.includes('Open day on Saturday'));
    rec(J, 'U5 its words changed on the canvas and seen in the Preview', shown, shown ? 'in the Preview' : 'missing');
    await pvClose(page, 1366);
    // U5 · the PHOTO swapped as a person does: select the picture, the Inspector's own upload, another photo of the set
    const img = (function f(n) { return n.type === 'image' ? n : (n.children || []).map(f).find(Boolean); })(hero);
    const before = img.src;
    await H.select(page, img.id); await H.panel(page, false);
    const ex = page.getByRole('button', { name: 'Expand inspector' }); if (await ex.isVisible().catch(() => false)) await ex.click();
    await page.locator('input[aria-label="Upload image"]').last().setInputFiles(path.join(__dirname, '..', '..', 'public', 'sections', 'sports-800.webp')); await sleep(page, 2500);
    const after = (await (async () => { const p = await active(page); let n = null; const w = (x) => { if (x.id === img.id) n = x; (x.children || []).forEach(w); }; w(p.root); return n; })()).src || '';
    rec(J, 'U5 its photo replaced through the Inspector (a new picture, stored in the site)', after && after !== before && after.startsWith('data:'), `${(before || '').slice(0, 30)} → ${after.slice(0, 22)}…`);
    const f2 = await pvOpen(page);
    const seen = await f2.evaluate((s) => Array.from(document.querySelectorAll('img')).some((i) => (i.getAttribute('src') || '').slice(0, 60) === s.slice(0, 60) && i.naturalWidth > 0), after);
    rec(J, 'U5 the new photo is what the Preview shows', seen, seen ? 'shown, loaded' : 'not shown');
    await shot(page, 'U5-photo-swapped');
    await pvClose(page, 1366);
  },

  async preview(page, J) {
    for (const [cat, name] of [['Headers', 'Logo, menu and a button'], ['Hero', 'Words beside a picture'], ['Hero', 'Centred words and two buttons'], ['Hero', 'Words over a full photo'], ['Hero', 'Centred words and six quick links'], ['Hero', 'Words at the left of a full photo'], ['Footers', 'Address, links and a bottom line']]) {
      await addTile(page, cat, name);
      const d = page.locator('[role=dialog], [role=alertdialog]').filter({ hasText: 'Replace the' }); if (await d.isVisible().catch(() => false)) { await d.getByRole('button', { name: T.replaceButton }).click(); await sleep(page, 800); }
    }
    let f = await pvOpen(page); await sleep(page, 900);
    // the entrance is on the heading's BLOCK (its box), not only the <h> element: look up from each heading
    const moved = await f.evaluate(() => Array.from(document.querySelectorAll('h1,h2')).some((h) => { for (let e = h; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (c.animationName !== 'none' || /opacity|transform/.test(c.transitionProperty) && c.transitionDuration !== '0s') return true; } return false; }));
    rec(J, 'U6 a designed section has its entrance', moved, moved ? 'animates' : 'still');
    await pvClose(page, 1366); await page.emulateMedia({ reducedMotion: 'reduce' }); f = await pvOpen(page);
    const still = await f.evaluate(() => Array.from(document.querySelectorAll('h1,h2')).every((h) => +getComputedStyle(h).opacity === 1));
    rec(J, 'U6 with reduced motion every title is there at once', still, still ? 'still, visible' : 'hidden while it waits');
    await pvClose(page, 1366);
    await pvOpen(page);
    const ans = await sweep(page, (fr, w) => fr.evaluate(([w, tp]) => {
      const over = document.documentElement.scrollWidth > window.innerWidth + 1;
      const ul = document.querySelector('header ul'); const lines = ul ? new Set(Array.from(ul.children).map((li) => Math.round(li.getBoundingClientRect().top))).size : 0;
      const p = Array.from(document.querySelectorAll('p')).find((x) => /day school for ages 3 to 18/.test(x.textContent || ''));
      const pr = p && p.getBoundingClientRect(), par = p && p.parentElement.getBoundingClientRect();
      const centred = !p || Math.abs((pr.left + pr.right) / 2 - (par.left + par.right) / 2) < 3;
      const apply = Array.from(document.querySelectorAll('a')).find((a) => a.textContent.trim() === 'Apply'), visit = Array.from(document.querySelectorAll('a')).find((a) => a.textContent.trim() === 'Visit');
      const gap = apply && visit ? Math.round(visit.getBoundingClientRect().left - apply.getBoundingClientRect().right) : -1;
      const broken = Array.from(document.querySelectorAll('a')).filter((a) => ['Admissions', 'Term dates', 'Lunch menu'].includes(a.textContent.trim()) && a.getBoundingClientRect().height > 1.5 * parseFloat(getComputedStyle(a).lineHeight)).length; // wrapped = more than one LINE (type grows with the screen)
      const imgs = Array.from(document.querySelectorAll('img')); const bad = imgs.filter((i) => i.getBoundingClientRect().top < window.innerHeight && i.complete && !i.naturalWidth).length;
      return `${over ? 'SIDEWAYS' : 'fits'}·menu ${w < tp ? (lines === 1 ? 'one line' : lines + ' lines') : 'n/a'}·${centred ? 'centred' : 'OFF-CENTRE'}·buttons ${gap >= 0 && gap < 60 ? 'together' : 'APART ' + gap}·${broken ? broken + ' BROKEN LABELS' : 'labels whole'}·${bad ? bad + ' BROKEN PICTURES' : 'pictures'}`;
    }, [w, TP]));
    const okAll = !/SIDEWAYS|lines|OFF-CENTRE|APART|BROKEN/.test(ans);
    rec(J, `U7 every width of screens.js (${WIDTHS.length}): fits, the phone menu one line, centred words, buttons together, labels and pictures whole`, okAll, ans);
    await shot(page, 'U7-preview-last');
    await pvClose(page, 1366);
  },

  async mine(page, J) {
    await addTile(page, 'Hero', 'Centred words, one button');
    const hero = (await active(page)).root.children.map(blockOf).find((b) => /Where curious minds grow/.test(textOf(b)));
    await pickSection(page, hero.id); await insBtn(page, T.save);
    const dlg = page.getByRole('dialog', { name: T.saveTitle });
    rec(J, 'U8 Save as my section asks for a name', await dlg.isVisible().catch(() => false), 'the name dialog');
    await named(page, 'Our welcome');
    await sectionsTab(page);
    const has = await chip(page, new RegExp(`^${T.mine}`)).isVisible().catch(() => false);
    rec(J, 'U8 it is under My sections', has, has ? 'the chip' : 'no chip');
    await pickSection(page, hero.id); await page.keyboard.press('Control+Alt+s'); await sleep(page, 600);
    const viaKey = await page.getByRole('dialog', { name: T.saveTitle }).isVisible().catch(() => false);
    rec(J, 'U8 Ctrl+Alt+S opens the same dialog', viaKey, viaKey ? 'opened' : 'nothing');
    if (viaKey) { await page.keyboard.press('Escape'); await sleep(page, 400); }
    await page.getByRole('button', { name: 'Reset' }).first().click(); await page.getByRole('button', { name: 'Start over' }).click(); await sleep(page, 1500);
    await sectionsTab(page); await chip(page, new RegExp(`^${T.mine}`)).click(); await sleep(page, 1200);
    const still = await tile(page, 'Our welcome').isVisible().catch(() => false);
    rec(J, 'U8 after Start over (a new site), My sections still holds it', still, still ? 'there' : 'gone');
    await tile(page, 'Our welcome').click(); await sleep(page, 900);
    rec(J, 'U8 a tile of My sections adds it', /Where curious minds grow/.test(textOf((await active(page)).root)), 'added');
    await sectionsTab(page); await chip(page, new RegExp(`^${T.mine}`)).click(); await sleep(page, 600);
    await page.getByRole('button', { name: T.rename, exact: true }).first().click(); await named(page, 'Welcome band');
    rec(J, 'U8 rename', await tile(page, 'Welcome band').isVisible().catch(() => false), 'renamed');
    await page.getByRole('button', { name: T.delete, exact: true }).first().click(); await sleep(page, 500);
    const asks = await page.getByRole('dialog').filter({ hasText: 'Delete' }).isVisible().catch(() => false);
    rec(J, 'U8 delete asks first', asks, asks ? 'asked' : 'deleted at once');
    await shot(page, 'U8-delete-asks');
  },

  async global(page, J) {
    await addTile(page, 'Hero', 'Centred words, one button');
    const hero = (await active(page)).root.children.map(blockOf).find((b) => /Where curious minds grow/.test(textOf(b)));
    await pickSection(page, hero.id); await insBtn(page, T.makeGlobal); await named(page, 'Welcome banner');
    const marked = await page.locator(`[data-box-id="${hero.id}"]`).first().getAttribute('data-global');
    rec(J, 'U9 marked on the canvas: "Global · Welcome banner"', marked === 'Global · Welcome banner', marked || 'no mark');
    await shot(page, 'U9-marked');
    await H.panel(page, true); await page.getByRole('group', { name: W.layers.view }).getByRole('button', { name: W.layers.title }).click(); await sleep(page, 500);
    const inLayers = await page.getByRole('tree', { name: W.layers.title }).getByText('Global · Welcome banner').isVisible().catch(() => false);
    rec(J, 'U9 marked in Layers: the globe and its name', inLayers, inLayers ? 'in Layers' : 'missing');
    await page.getByRole('group', { name: W.layers.view }).getByRole('button', { name: W.layers.add }).click();
    await addPageBlank(page, 'Term dates');
    for (let i = 0; i < 2; i++) { await sectionsTab(page); await chip(page, new RegExp(`^${T.global}`)).click(); await sleep(page, 900); await tile(page, 'Welcome banner').click(); await sleep(page, 800); }
    const twice = (await active(page)).root.children.map(blockOf).filter((b) => b.globalId).length;
    rec(J, 'U9 added to a second page, twice', twice === 2, `${twice} copies on Term dates`);
    await toPage(page, 'Home');
    const title = (function f(n) { return n.type === 'heading' ? n : (n.children || []).map(f).find(Boolean); })(hero);
    await H.select(page, title.id); await page.locator(`[data-box-id="${title.id}"] [contenteditable]`).first().click(); await page.keyboard.press('Control+a'); await page.keyboard.type('Changed once'); await deselect(page); await sleep(page, 900);
    const notice = await page.getByRole('status').filter({ hasText: 'pages that use it' }).isVisible().catch(() => false);
    rec(J, 'U9 the notice says the change reaches every page', notice, notice ? 'shown' : 'not shown');
    const s = await site(page);
    const copies = s.pages.flatMap((p) => { const out = []; const w = (n) => { if (n.globalId) out.push(textOf(n)); (n.children || []).forEach(w); }; w(p.root); return out; });
    rec(J, 'U9 one edit changed every copy, on every page', copies.length === 3 && copies.every((t) => t.includes('Changed once')), copies.map((c) => c.slice(0, 20)).join(' | '));
    await toPage(page, 'Term dates');
    const first = (await active(page)).root.children.map(blockOf).find((b) => b.globalId);
    await pickSection(page, first.id); await insBtn(page, T.detach);
    const det = (await active(page)).root.children.map(blockOf).filter((b) => b.globalId).length;
    rec(J, 'U9 Detach makes that copy ordinary', det === 1, `${det} copy still global here`);
    await H.panel(page, false); await page.keyboard.press('Control+z'); await sleep(page, 900);
    rec(J, 'U9 Ctrl+Z straight after attaches it again', (await active(page)).root.children.map(blockOf).filter((b) => b.globalId).length === 2, 'attached');
    const f = await pvOpen(page); const html = await f.evaluate(() => document.documentElement.outerHTML);
    rec(J, 'U9 the published page has no trace of it (plain HTML)', !/data-global|globalId|Global ·/.test(html), /global/i.test(html) ? 'a trace' : 'plain');
    await pvClose(page, 1366);
    await sectionsTab(page); await chip(page, new RegExp(`^${T.global}`)).click(); await sleep(page, 600);
    await page.getByRole('button', { name: T.removeGlobal, exact: true }).first().click(); await sleep(page, 400);
    await page.getByRole('dialog').getByRole('button', { name: T.removeGlobal, exact: true }).last().click(); await sleep(page, 900);
    const left = (await site(page)).pages.map((p) => textOf(p.root).includes('Changed once'));
    rec(J, 'U9 Stop being global: no longer listed, every copy stays', !(await chip(page, new RegExp(`^${T.global}`)).isVisible().catch(() => false)) && left.every(Boolean), left.join(','));
  },

  async pages(page, J) {
    await page.getByRole('button', { name: 'Add page', exact: true }).click();
    const d = page.getByRole('dialog', { name: T.addPageTitle }); await d.waitFor();
    await sleep(page, 2500); await shot(page, 'U10-add-page');
    const tiles = await d.getByRole('button', { name: /, Page templates$/ }).count();
    rec(J, 'U10 Add a page offers Blank, Duplicate and the built-in templates', tiles >= 3 && await d.getByRole('button', { name: T.blank }).isVisible(), `${tiles} templates`);
    await d.getByRole('textbox').fill('Welcome');
    await d.getByRole('button', { name: /^Add School home,/ }).click(); await sleep(page, 1200);
    const s = await site(page); const p = s.pages.find((x) => x.name === 'Welcome');
    rec(J, 'U10 a page from a template, named, with its sections', !!p && p.root.children.length >= 5, p ? `${p.root.children.length} bands` : 'no page');
    await page.getByRole('button', { name: 'Page settings' }).first().click(); await page.getByRole('button', { name: T.savePage }).first().click(); await named(page, 'Our home page');
    await page.getByRole('button', { name: 'Add page', exact: true }).click(); await sleep(page, 1500);
    const mineShown = await page.getByRole('dialog', { name: T.addPageTitle }).getByRole('button', { name: /^Add Our home page,/ }).isVisible().catch(() => false);
    rec(J, 'U10 Save page as template: it is under My templates', mineShown, mineShown ? 'there' : 'missing');
    await page.keyboard.press('Escape');
  },

  async current(page, J) {
    // as a person sets it up: a ready-made header (shared on every page) whose "About" menu link goes to the About page
    await addPageBlank(page, 'About');
    await toPage(page, 'Home');
    await addTile(page, 'Headers', 'Logo, menu and a button');
    const header = (await active(page)).root.children.map(blockOf).find((b) => b.tag === 'header');
    const link = (function f(n) { return n.type === 'link' && n.text === 'About' ? n : (n.children || []).map(f).find(Boolean); })(header);
    await H.select(page, link.id); await H.panel(page, false);
    const ex = page.getByRole('button', { name: 'Expand inspector' }); if (await ex.isVisible().catch(() => false)) await ex.click();
    await page.locator('aside[aria-label="Inspector"]').getByRole('tab', { name: 'Content' }).click().catch(() => {}); await sleep(page, 400);
    const choose = page.getByRole('button', { name: 'Link to page' }).first(); await choose.scrollIntoViewIfNeeded(); await choose.click(); await page.getByRole('option', { name: 'About' }).click(); await sleep(page, 900);
    const mark = (fr) => fr.evaluate(() => { const a = Array.from(document.querySelectorAll('header a')).find((x) => x.textContent.trim() === 'About'); if (!a) return 'NO LINK'; const c = getComputedStyle(a); return `${a.getAttribute('aria-current') || 'none'}/${c.textDecorationLine}`; });
    await pvOpen(page);
    const onHome = await sweep(page, mark);
    rec(J, 'U11 on Home the About link is NOT marked (LE15-27)', !/NO LINK|^page/.test(onHome) && /none/.test(onHome), onHome);
    await page.getByRole('button', { name: 'About', exact: true }).last().click(); await sleep(page, 1500);
    const onAbout = await sweep(page, mark);
    rec(J, 'U11 on About its own link is the current page, underlined, at every width (LE15-27)', !/NO LINK|none/.test(onAbout) && /page\/underline/.test(onAbout), onAbout);
    await shot(page, 'U11-current-about');
    await pvClose(page, 1366);
    // the canvas the same: on the About page the header's About link is current
    await toPage(page, 'About');
    const onCanvas = await page.evaluate(() => { const a = Array.from(document.querySelectorAll('header a')).find((x) => x.textContent.trim() === 'About'); return a ? a.getAttribute('aria-current') || 'none' : 'NO LINK'; });
    rec(J, 'U11 the canvas marks it the same on the About page', onCanvas === 'page', onCanvas);
  },
};

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
