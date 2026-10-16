// BATCH A-1b · HEADED UAT — fonts that write the region's languages. Checklist: docs/TASK_TREE.md BATCH A-1b (U1–U6), written
// before this pass. Built THROUGH THE UI (RULE Y) in visible windows, SIX at a time, each refilled as its slice ends (RULE Z);
// the Preview read at EVERY screen of screens.js. The one seeded state (U2) is a site saved BEFORE sites stored a pair: built
// through the UI, then its stored `fonts` removed — the exact shape every school's saved site has today.
// Run against a FRESH `next start` on :3100 (`node scripts/check-fresh-build.js`).   node scripts/uat/uat-a1b-headed.js [--only=U1,U2]
const path = require('path'); const fs = require('fs'); const http = require('http');
const { unzipSync } = require('fflate'); const os = require('os'); const { chromium } = require('playwright');
const H = require('./h.js'); const I = require('./inspector.js');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-a1b'); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const KEY = 'educo_box_site_v1';
const WORDS = 'Ẹ kú àárọ̀ ọmọ ṣe. Ụlọ akwụkwọ ị. Ɓarka ɗa ƙ. Ɛte sɛn ɔ ŋ?'; // Yoruba · Igbo · Hausa · Twi / Ga / Ewe
const LETTERS = 'ẹọṣịụɓɗƙɛɔŋ';

// ── a static host for the download ──
const server = http.createServer((req, res) => {
  const f = path.join(OUT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(OUT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  const t = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp' }[path.extname(f)] || 'application/octet-stream';
  res.writeHead(200, { 'content-type': t }); fs.createReadStream(f).pipe(res);
}).listen(4110);

// ── the builder, driven like a person ──
async function editorTheme(page, name) {
  if (name === 'Light') return; page.__step = `theme ${name}`;
  const sw = page.getByRole('button', { name: 'Change theme' }).first();
  const inMore = !(await sw.isVisible().catch(() => false));
  if (inMore) { await page.getByRole('button', { name: 'More', exact: true }).first().click(); await page.waitForTimeout(400); }
  await sw.click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500);
  if (inMore) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
}
const ids = (page) => page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].map((e) => e.dataset.boxId));
/** A tile from the palette; the block it adds is the one the builder selects (a new block is selected), never its row band. */
async function addTile(page, tile) {
  const before = new Set(await ids(page)); await H.panel(page, true); await H.clickTile(page, tile); await H.panel(page, false);
  const sel = await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
  return [sel && !before.has(sel) ? sel : (await ids(page)).filter((i) => !before.has(i)).pop()];
}
/** A heading and a paragraph in the region's languages, built through the palette and the Content tab. */
async function build(page) {
  page.__step = 'build';
  const [h] = await addTile(page, 'Heading'); const [t] = await addTile(page, 'Text');
  await I.text(page, t, WORDS); await I.text(page, h, 'Ẹ káàbọ̀ — Ɓarka — Ɛyɛ');
  return { h, t };
}
/** The font a block's words are drawn in, as the browser resolved it (first family). */
const fontOf = (frame, id) => frame.evaluate((id) => {
  const el = id ? document.querySelector(`[data-box-id="${id}"]`) : null; if (id && !el) return null;
  const t = [...(el || document).querySelectorAll('*')].find((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  return t ? getComputedStyle(t).fontFamily.split(',')[0].replace(/['"]/g, '').trim() : null;
}, id);
/** The letters a family does NOT draw itself in this document (a letter it has is the same width whatever fallback follows). */
const notDrawn = (frame, fam) => frame.evaluate(async ([fam, letters]) => {
  await document.fonts.load(`40px "${fam}"`, letters).catch(() => {}); await document.fonts.ready;
  const c = document.createElement('canvas').getContext('2d'); const w = (f, t) => { c.font = f; return c.measureText(t).width; };
  return [...letters].filter((g) => Math.abs(w(`40px "${fam}", monospace`, g.repeat(6)) - w(`40px "${fam}", serif`, g.repeat(6))) >= 0.5).join('');
}, [fam, LETTERS]);
async function openPreview(page) { await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h'); return (await page.$('iframe')).contentFrame(); }
async function closePreview(page) { await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600); }
async function exportSite(page, name) {
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 120000 }), page.getByRole('button', { name: 'Export', exact: true }).first().click()]);
  const files = unzipSync(new Uint8Array(fs.readFileSync(await dl.path()))); const dir = path.join(OUT, name);
  for (const [f, b] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), b); }
  return Object.keys(files);
}
const pageCheckText = async (page) => { await page.getByRole('button', { name: /Page check/ }).first().click(); await page.waitForTimeout(600); const t = (await page.getByRole('dialog').innerText()).replace(/\s+/g, ' '); return t; };
const closeDialog = async (page) => { await page.keyboard.press('Escape'); await page.waitForTimeout(400); };
async function pageSettings(page) {
  const b = page.getByRole('button', { name: 'Page settings' }); if (!(await b.first().isVisible().catch(() => false))) { await page.getByRole('button', { name: 'More', exact: true }).first().click(); await page.waitForTimeout(400); }
  await b.first().click(); await page.waitForTimeout(500);
}
async function pick(page, ariaLabel, name) {
  const trig = page.getByRole('button', { name: ariaLabel }).first(); await trig.scrollIntoViewIfNeeded(); await trig.click(); await page.waitForTimeout(300);
  const opt = page.getByRole('option', { name: new RegExp('^\\s*' + name + ' ·') }).first(); await opt.scrollIntoViewIfNeeded(); await opt.click(); await page.waitForTimeout(500);
}

/** H.open, at 200 % browser text: Chrome's own font-size preference (WCAG 1.4.4), not a zoom. */
async function openBig({ w, h, pos, font }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'a1b-')); fs.mkdirSync(path.join(dir, 'Default'));
  fs.writeFileSync(path.join(dir, 'Default', 'Preferences'), JSON.stringify({ webkit: { webprefs: { default_font_size: font } } }));
  const ctx = await chromium.launchPersistentContext(dir, { headless: false, viewport: { width: w, height: h }, args: ['--force-device-scale-factor=1', `--window-position=${pos[0]},${pos[1]}`] });
  const page = ctx.pages()[0]; const errs = []; page.on('pageerror', (e) => errs.push(e.message.split(/\r?\n/)[0]));
  await page.goto((process.env.BASE || 'http://localhost:3100') + '/website/box-demo');
  await page.waitForFunction(() => { const b = [...document.querySelectorAll('button')].find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
  await page.waitForTimeout(1200); return { browser: { close: () => ctx.close() }, page, errs };
}

const SLICES = {};

// U1 · a NEW site: Montserrat headings, Inter words — canvas, Preview, download; every letter drawn by those fonts
SLICES.U1 = async (page, ok, tag) => {
  const { h, t } = await build(page);
  const cf = [await fontOf(page, h), await fontOf(page, t)];
  ok(`U1 ${tag} · canvas: heading ${cf[0]}, words ${cf[1]}`, cf[0] === 'Montserrat' && cf[1] === 'Inter');
  const nd = [await notDrawn(page, 'Montserrat'), await notDrawn(page, 'Inter')];
  ok(`U1 ${tag} · canvas: ẹ ọ ṣ ị ụ ɓ ɗ ƙ ɛ ɔ ŋ drawn by Montserrat and Inter themselves`, !nd[0] && !nd[1], `not drawn: "${nd.join('" "')}"`);
  const pc = await pageCheckText(page); ok(`U1 ${tag} · Page check: no font line on a new site`, !/has no /.test(pc)); await closeDialog(page);
  await page.screenshot({ path: path.join(OUT, `U1-${tag}-canvas.png`) });
  page.__step = 'preview'; const f = await openPreview(page);
  const pf = [await f.evaluate(() => getComputedStyle(document.querySelector('h1,h2,h3')).fontFamily), await f.evaluate(() => getComputedStyle(document.querySelector('p')).fontFamily)];
  ok(`U1 ${tag} · Preview: heading ${pf[0]}, words ${pf[1]}`, /^Montserrat/.test(pf[0]) && /^Inter/.test(pf[1]));
  const pn = [await notDrawn(f, 'Montserrat'), await notDrawn(f, 'Inter')]; ok(`U1 ${tag} · Preview: every letter drawn by the site's fonts`, !pn[0] && !pn[1], `not drawn: "${pn.join('" "')}"`);
  await page.screenshot({ path: path.join(OUT, `U1-${tag}-preview.png`) }); await closePreview(page);
  page.__step = 'export'; const name = `site-${tag.replace(/\W/g, '')}`; const files = await exportSite(page, name);
  const fonts = files.filter((x) => x.startsWith('fonts/'));
  ok(`U1 ${tag} · download: Montserrat and Inter files in fonts/`, fonts.some((x) => /montserrat/i.test(x)) && fonts.some((x) => /inter/i.test(x)), fonts.join(' '));
  const ctx = page.context(); const ep = ctx.browser() ? await ctx.browser().newPage() : await ctx.newPage(); // A1b-6: H.open's page owns its context
  const resp = await ep.goto(`http://localhost:4110/${name}/index.html`); await ep.waitForTimeout(1200);
  if (!(await ep.$('h1,h2,h3')) || !(await ep.$('p'))) throw new Error(`the download did not open: ${resp && resp.status()} ${ep.url()} — ${(await ep.content()).slice(0, 160)}`);
  const ef = [await ep.evaluate(() => getComputedStyle(document.querySelector('h1,h2,h3')).fontFamily), await ep.evaluate(() => getComputedStyle(document.querySelector('p')).fontFamily)];
  const en = [await notDrawn(ep.mainFrame(), 'Montserrat'), await notDrawn(ep.mainFrame(), 'Inter')];
  ok(`U1 ${tag} · download: heading ${ef[0]}, words ${ef[1]}, every letter drawn by them`, /^Montserrat/.test(ef[0]) && /^Inter/.test(ef[1]) && !en[0] && !en[1], `not drawn: "${en.join('" "')}"`);
  await ep.screenshot({ path: path.join(OUT, `U1-${tag}-download.png`) }); await ep.close();
};

// U2 · a site saved BEFORE: Poppins + DM Sans stay — reload, edit + Undo; the Page check's font line and its one-click fix
SLICES.U2 = async (page, ok, tag) => {
  const { h, t } = await build(page);
  page.__step = 'make it a pre-A-1b save'; await page.waitForTimeout(1200);
  await page.evaluate((k) => { const s = JSON.parse(localStorage.getItem(k)); delete s.fonts; localStorage.setItem(k, JSON.stringify(s)); }, KEY);
  await page.reload(); await page.waitForTimeout(2500);
  const f1 = [await fontOf(page, h), await fontOf(page, t)];
  ok(`U2 ${tag} · a saved site keeps Poppins + DM Sans after a reload`, f1[0] === 'Poppins' && f1[1] === 'DM Sans', f1.join(' / '));
  await I.text(page, t, WORDS + ' Ẹ'); await page.keyboard.press('Control+z'); await page.waitForTimeout(500);
  const f2 = [await fontOf(page, h), await fontOf(page, t)]; ok(`U2 ${tag} · after an edit and Undo, still Poppins + DM Sans`, f2[0] === 'Poppins' && f2[1] === 'DM Sans', f2.join(' / '));
  ok(`U2 ${tag} · the saved site still stores no pair (nothing was rewritten behind the user's back)`, await page.evaluate((k) => !('fonts' in JSON.parse(localStorage.getItem(k))), KEY));
  const pc = await pageCheckText(page); await page.screenshot({ path: path.join(OUT, `U2-${tag}-page-check.png`) });
  ok(`U2 ${tag} · U4 Page check names the words' letters DM Sans lacks and a font that has them`, /DM Sans has no ẹ ọ ṣ ị ụ ɓ ɗ ƙ ɛ ɔ ŋ/.test(pc.replace(/Ẹ |Ụ |Ɓ |Ɛ /g, '')) || /DM Sans has no .*ṣ/.test(pc), pc.match(/[^.]*has no[^.]*\.[^.]*\./g)?.join(' | '));
  ok(`U2 ${tag} · U4 the heading is checked against Poppins`, /Poppins has no/.test(pc));
  const fix = page.getByRole('button', { name: /^Use .+ for this block$/ }); ok(`U2 ${tag} · U4 a one-click fix is offered`, (await fix.count()) >= 1, await fix.first().innerText().catch(() => ''));
  await page.getByRole('button', { name: 'Show me' }).first().click(); await page.waitForTimeout(600);
  ok(`U2 ${tag} · U4 "Show me" selects the block`, await page.evaluate(() => !!document.querySelector('[aria-selected="true"][data-box-id], [data-selected="true"][data-box-id]')) || (await page.getByText(/Editing:/).count()) > 0);
  await pageCheckText(page); await page.getByRole('button', { name: /^Use .+ for this block$/ }).last().click(); await page.waitForTimeout(600);
  const after = (await page.getByRole('dialog').innerText()).replace(/\s+/g, ' '); await closeDialog(page);
  ok(`U2 ${tag} · U4 after the fix the paragraph is in Inter and its line is gone`, (await fontOf(page, t)) === 'Inter' && !/DM Sans has no/.test(after), `${await fontOf(page, t)} · ${after.match(/[^.]*has no[^.]*/g)?.join(' | ') ?? 'no font line'}`);
  await I.text(page, t, 'Good morning, everyone.'); await I.text(page, h, 'Welcome');
  const pc2 = await pageCheckText(page); await closeDialog(page); ok(`U2 ${tag} · U4 an English page: no font line`, !/has no /.test(pc2));
};

// U3 · Site fonts in Page settings: inside its panel, every option says its languages, the change reaches every block without
// a font of its own, a block with its own font keeps it, one Undo puts it back
SLICES.U3 = async (page, ok, tag) => {
  const { h, t } = await build(page);
  const [t2] = await addTile(page, 'Text'); await I.text(page, t2, 'Mine is Lora.');
  await I.tab(page, 'Content'); await pick(page, /^Text font$|^Font$/, 'Lora');
  page.__step = 'page settings'; await pageSettings(page);
  const fit = await page.evaluate(() => { const fs = document.querySelector('fieldset'); const panel = fs?.closest('.shadow-2xl'); if (!fs || !panel) return null; const p = panel.getBoundingClientRect(); return [...fs.querySelectorAll('button')].map((b) => b.getBoundingClientRect()).every((r) => r.right <= p.right + 0.5 && r.left >= p.left - 0.5); });
  ok(`U3 ${tag} · A1b-4: Site fonts' fields sit inside the Page settings panel`, fit === true, String(fit));
  await page.getByRole('button', { name: 'Site font for headings' }).click(); await page.waitForTimeout(300);
  const opts = await page.getByRole('option').allInnerTexts(); await page.screenshot({ path: path.join(OUT, `U3-${tag}-menu.png`) });
  ok(`U3 ${tag} · every one of the ${opts.length} options says which languages it writes`, opts.length >= 52 && opts.every((o) => /Writes (Yoruba|Igbo|Hausa|Twi|none of)/.test(o)), opts.filter((o) => !/Writes/.test(o)).slice(0, 3).join(' | '));
  const lb = await page.evaluate(() => { const l = document.querySelector('[role="listbox"]').getBoundingClientRect(); return l.left >= 0 && l.right <= innerWidth; }); ok(`U3 ${tag} · the menu is on the screen`, lb);
  await page.getByRole('option', { name: /^\s*Merriweather ·/ }).first().click(); await page.waitForTimeout(500);
  await pick(page, 'Site font for words', 'Noto Serif');
  const notes = (await page.locator('fieldset p').allInnerTexts()).join(' / '); await page.screenshot({ path: path.join(OUT, `U3-${tag}-settings.png`) });
  ok(`U3 ${tag} · under each field, what the chosen font writes`, /Writes Yoruba · Igbo · Hausa · Twi \/ Ga \/ Ewe.*Writes Yoruba · Igbo · Hausa · Twi \/ Ga \/ Ewe/.test(notes), notes);
  await page.keyboard.press('Escape'); await page.mouse.click(5, 300); await page.waitForTimeout(400);
  const f = [await fontOf(page, h), await fontOf(page, t), await fontOf(page, t2)];
  ok(`U3 ${tag} · headings Merriweather, words Noto Serif, the block with its own font keeps Lora`, f[0] === 'Merriweather' && f[1] === 'Noto Serif' && f[2] === 'Lora', f.join(' / '));
  await page.keyboard.press('Control+z'); await page.waitForTimeout(600);
  const u = [await fontOf(page, h), await fontOf(page, t)]; ok(`U3 ${tag} · one Undo puts the words back to Inter (the heading stays)`, u[0] === 'Merriweather' && u[1] === 'Inter', u.join(' / '));
  await page.reload(); await page.waitForTimeout(2500); const r = [await fontOf(page, h), await fontOf(page, t)];
  ok(`U3 ${tag} · after a reload the site's fonts are kept`, r[0] === 'Merriweather' && r[1] === 'Inter', r.join(' / '));
};

// U3b · every font picker in the Inspector says its languages: a text block, a box's "everything inside", a component
SLICES.U3b = async (page, ok, tag) => {
  const { t } = await build(page); const [box] = await addTile(page, 'Stack'); const [acc] = await addTile(page, 'Accordion');
  for (const [what, id] of [['a text block', t], ['a box', box], ['a component', acc]]) {
    page.__step = `pickers of ${what}`; await H.select(page, id);
    let seen = 0, bad = 0, lost = 0;
    for (const tb of ['Design', 'Content']) {
      if (!(await I.tab(page, tb))) continue;
      for (const s of ['Text style', 'Text style (everything inside)', 'Typography']) await I.section(page, s);
      const trig = page.locator('button[aria-haspopup="listbox"]').filter({ hasText: /·\s*(Sans|Serif|Display|Handwriting|Mono)$|^(Default|Theme default)$/ });
      for (let i = 0; i < await trig.count(); i++) {
        const b = trig.nth(i); if (!(await b.isVisible())) continue; await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(300);
        const o = await page.getByRole('option').allInnerTexts(); const fam = o.filter((x) => / · (Sans|Serif|Display|Handwriting|Mono)/.test(x));
        if (fam.length) { seen++; if (!fam.every((x) => /Writes/.test(x))) bad++; await page.screenshot({ path: path.join(OUT, `U3b-${tag}-${what.replace(/\W/g, '')}-${seen}.png`) }); }
        await page.keyboard.press('Escape'); await page.waitForTimeout(200);
        if ((await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id'))) !== id) { lost++; await H.select(page, id); await I.tab(page, tb); } // A1b-8
      }
    }
    ok(`U3b ${tag} · ${what}: ${seen} font picker(s), every family says its languages`, seen > 0 && bad === 0, `seen ${seen}, without words ${bad}`);
    ok(`U3b ${tag} · ${what}: Esc closes each dropdown and the block stays selected (A1b-8)`, lost === 0, `lost the block ${lost}×`);
  }
};

// U5 · the Preview of a new site at every screen (this window's share) + Page settings / Page check without sideways scroll
SLICES.U5 = (share) => async (page, ok, tag) => {
  await build(page); const bad = [];
  const f0 = await openPreview(page);
  for (const s of share) {
    await page.setViewportSize({ width: s.w, height: s.h }); await page.waitForTimeout(250);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== s.w) { await page.setViewportSize({ width: 2 * s.w - inner, height: s.h }); await page.waitForTimeout(200); f = await (await page.$('iframe')).contentFrame(); }
    const v = await f.evaluate(() => ({ side: document.documentElement.scrollWidth - document.documentElement.clientWidth, h: getComputedStyle(document.querySelector('h1,h2,h3')).fontFamily.split(',')[0], p: getComputedStyle(document.querySelector('p')).fontFamily.split(',')[0] }));
    if (v.side > 0 || !/Montserrat/.test(v.h) || !/Inter/.test(v.p)) bad.push(`${s.label}: sideways ${v.side} · ${v.h} / ${v.p}`);
  }
  void f0; ok(`U5 ${tag} · the Preview at ${share.length} screens: Montserrat + Inter, nothing sideways`, !bad.length, bad.slice(0, 3).join(' ; '));
  await page.setViewportSize({ width: 1280, height: 900 }); await closePreview(page);
  for (const w of [375, 768, 1280]) {
    await page.setViewportSize({ width: w, height: 860 }); await page.waitForTimeout(400); await pageSettings(page);
    const side = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const fit = await page.evaluate(() => { const fs = document.querySelector('fieldset'); const panel = fs?.closest('.shadow-2xl'); if (!fs || !panel) return null; const p = panel.getBoundingClientRect(); return [...fs.querySelectorAll('button, p')].every((e) => { const r = e.getBoundingClientRect(); return r.right <= p.right + 0.5 && r.left >= p.left - 0.5; }); });
    ok(`U5 ${tag} · A1b-4: Site fonts sits inside its panel at ${w}`, fit === true, String(fit));
    await page.screenshot({ path: path.join(OUT, `U5-${tag}-settings-${w}.png`) }); ok(`U5 ${tag} · Page settings at ${w}: nothing sideways`, side <= 0, `${side}px`);
    // A1b-10: Esc closes Page settings; opened again, a press outside it closes it too
    const open = () => page.evaluate(() => !!document.querySelector('fieldset'));
    await page.keyboard.press('Escape'); await page.waitForTimeout(300); const afterEsc = await open();
    await pageSettings(page); const reopened = await open();
    // a point MEASURED to be outside the panel — at 200 % text it is taller than the window (A1b-11: aiming at y 700 hit it)
    const at = await page.evaluate(() => { const p = document.querySelector('fieldset').closest('[data-page-menu]').getBoundingClientRect();
      return p.bottom + 12 < innerHeight ? [p.left + 10, p.bottom + 10] : p.right + 8 < innerWidth ? [innerWidth - 4, p.top + 40] : [p.left - 4, p.top + 40]; });
    await page.mouse.click(at[0], at[1]); await page.waitForTimeout(300);
    ok(`U5 ${tag} · A1b-10: at ${w} Esc closes Page settings, and so does a press outside it`, !afterEsc && reopened && !(await open()), `after Esc ${afterEsc} · reopened ${reopened} · after outside ${await open()}`);
  }
};

// the windows: [slice, editor theme, width, height, browser text px]
const share = (i) => SCREENS.filter((_, k) => k % 2 === i);
SLICES.U5a = SLICES.U5(share(0)); SLICES.U5b = SLICES.U5(share(1));
const WINDOWS = [
  ['U1', 'Light', 1280, 900], ['U1', 'Dark', 1536, 864], ['U2', 'Light', 1280, 900], ['U2', 'Midnight', 1440, 900],
  ['U3', 'Purple Dream', 1280, 900], ['U3', 'Dark', 1536, 864], ['U3b', 'Light', 1280, 900], ['U3b', 'Midnight', 1440, 900],
  ['U5a', 'Light', 1280, 900], ['U5b', 'Purple Dream', 1280, 900, 32],
];
(async () => {
  const runs = WINDOWS.filter(([k]) => !ONLY.length || ONLY.includes(k)); const out = []; let next = 0;
  const slot = async (i) => {
    while (next < runs.length) {
      const [k, th, w, h, font] = runs[next++]; const tag = `${th.replace(/\s/g, '')}·${w}${font ? '·200%' : ''}`;
      const pos = [(i % 3) * 640, Math.floor(i / 3) * 520];
      const { browser, page, errs } = font ? await openBig({ w, h, pos, font }) : await H.open({ headed: true, w, h, pos });
      const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${k}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
      try { await editorTheme(page, th); await SLICES[k](page, ok, tag); }
      catch (e) { ok(`${k} ${tag} · step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${k}-${tag.replace(/\W/g, '')}-error.png`) }).catch(() => {}); }
      ok(`U6 ${k} ${tag} · no page errors`, errs.length === 0, errs.join(' | '));
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: 6 }, (_, i) => slot(i)));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
  fs.writeFileSync(path.join(OUT, 'result.txt'), out.join('\n')); server.close();
})();
