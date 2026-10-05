// HEADED UAT — the semantic layer (A1 · B1 · C1), built THROUGH THE UI, checked on the canvas AND in the real Preview.
// Every job in its own visible window, all at once:  NODE_PATH=node_modules node scripts/uat/uat-sem.js
const JOBS = ['PAGE', 'CHECK', 'LEVELS'];
const jobArg = process.argv.find((a) => a.startsWith('--job='));
if (!jobArg) {
  const { spawn } = require('child_process'); let left = JOBS.length; const all = [];
  JOBS.forEach((_, j) => {
    const c = spawn(process.execPath, [__filename, `--job=${j}`], { env: process.env });
    let out = ''; c.stdout.on('data', (d) => { out += d; }); c.stderr.on('data', (d) => { out += d; });
    c.on('exit', () => { all[j] = out; if (--left === 0) console.log(all.join('\n')); });
  });
  return;
}
const JOB = JOBS[Number(jobArg.slice(6))];
const H = require('./h.js');
const { first, under, row } = require('./pages.js').helpers;
const OUT = __dirname;
const bugs = []; const log = (s) => console.log(s); const bug = (s) => { bugs.push(s); log('  BUG ' + s); };

/** Open the Meaning section in the Inspector and choose what the selected block is. */
/** Select a block the way a user reaches a parent: click inside it, then Escape steps out one level at a time. */
async function reach(page, id) {
  await page.locator(`[data-box-id="${id}"]`).scrollIntoViewIfNeeded(); // a person scrolls to what they want to click
  try { await H.select(page, id); return; } catch { /* clicking lands on a child — step out with Escape */ }
  const trail = [await H.selected(page)];
  for (let i = 0; i < 6 && (await H.selected(page)) !== id; i++) { await page.keyboard.press("Escape"); await page.waitForTimeout(200); trail.push(await H.selected(page)); }
  log("  reach " + id.slice(-4) + ": " + trail.map((t) => (t || "none").slice(-4)).join(" → ") + "\n" + (await H.tree(page)).split("\n").slice(0, 16).join("\n"));
  if ((await H.selected(page)) !== id) throw new Error("could not reach " + id.slice(-4) + " with Escape");
}
async function markAs(page, id, label) {
  await reach(page, id);
  const acc = page.getByRole('button', { name: /^Meaning/ }).first();
  if (!(await page.getByRole('button', { name: 'What is this block', exact: true }).count())) await acc.click();
  const trig = page.getByRole('button', { name: 'What is this block', exact: true });
  await trig.scrollIntoViewIfNeeded(); await trig.click();
  const opt = page.getByRole('option', { name: new RegExp('^' + label) }).first();
  if (!(await opt.isVisible().catch(() => false))) throw new Error('the option "' + label + '" is not visible after opening the menu');
  await opt.click();
  await page.waitForTimeout(300);
}
const tagOf = (page, id) => page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`)?.tagName.toLowerCase(), id);
/** Open the real Preview and return its frame. */
async function preview(page) {
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
  await page.waitForSelector('iframe', { timeout: 15000 }); await page.waitForTimeout(1500);
  return (await page.$('iframe')).contentFrame();
}
const badge = (page) => page.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => /^Page check/.test(x.getAttribute('aria-label') || '')); return b ? b.getAttribute('aria-label') : null; });

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos: [Number(jobArg.slice(6)) * 16, Number(jobArg.slice(6)) * 16] });
  log(`\n[${JOB}]`);
  try {
    await H.panel(page, true);
    if (JOB === 'PAGE') {
      // header · welcome · a section of three cards · footer — built with the palette, marked with the Inspector
      // A new SECTION of the page is made the way a user makes one — "Add a band" — never by dropping into a column.
      const allIds = () => page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).map((e) => e.getAttribute('data-box-id')));
      const addBand = async () => {
        const before = new Set(await allIds());
        await page.getByRole('button', { name: 'Add a band' }).first().click(); await page.waitForTimeout(600);
        const fresh = (await allIds()).filter((id) => !before.has(id));
        // the empty stack the band holds (it carries the "drag a block in" placeholder)
        return page.evaluate((ids) => ids.find((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); return e && e.querySelector('[data-ph]') && !e.querySelector('[data-box-id] [data-ph]'); }) || ids[ids.length - 1], fresh);
      };
      const firstChild = (id) => page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] [data-box-id]`)?.getAttribute('data-box-id'), id);
      const hdr = await first(page, 'Stack');
      await H.dropInto(page, 'Heading', hdr); const hdrTitle = await firstChild(hdr);
      await H.panel(page, false); const welcome = await addBand(); await H.panel(page, true);
      await H.dropInto(page, 'Heading', welcome);
      await H.panel(page, false); const sec = await addBand(); await H.panel(page, true);
      await H.dropInto(page, 'Heading', sec); const secHead = await firstChild(sec);
      const c1 = await under(page, secHead, 'Card');
      await row(page, c1, ['Card', 'Card']);
      await H.panel(page, false); const ftr = await addBand();
      await markAs(page, hdr, 'Page header');
      await markAs(page, sec, 'Section');
      await markAs(page, ftr, 'Page footer');
      const tags = { header: await tagOf(page, hdr), section: await tagOf(page, sec), footer: await tagOf(page, ftr), headerTitle: await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] :is(h1,h2,h3,h4,h5,h6)`)?.tagName, hdrTitle) };
      log(`  canvas elements: ${JSON.stringify(tags)}`);
      if (tags.header !== 'header') bug(`canvas renders the page header as <${tags.header}>`);
      if (tags.section !== 'section') bug(`canvas renders the section as <${tags.section}>`);
      if (tags.footer !== 'footer') bug(`canvas renders the page footer as <${tags.footer}>`);
      await page.screenshot({ path: `${OUT}/uatsem-page-canvas.png` });
      const f = await preview(page);
      const a11y = await f.evaluate(() => {
        const q = (s) => Array.from(document.querySelectorAll(s));
        const main = q('main'); const skip = document.body.firstElementChild;
        const headings = q('h1,h2,h3,h4,h5,h6').map((h) => `${h.tagName}:${(h.textContent || '').trim().slice(0, 20)}`);
        return { mains: main.length, skipFirst: !!skip && skip.classList.contains('eu-skip'), headerOutside: !!document.querySelector('header') && !document.querySelector('main header'), footerOutside: !!document.querySelector('footer') && !document.querySelector('main footer'), headings, articles: q('article').length };
      });
      log(`  preview: ${JSON.stringify(a11y)}`);
      if (a11y.mains !== 1) bug(`${a11y.mains} <main> elements in the published page`);
      if (!a11y.skipFirst) bug('the skip link is not the first thing on the page');
      if (!a11y.headerOutside || !a11y.footerOutside) bug('the header or footer is inside the main content');
      if (!a11y.headings.some((h) => h.startsWith('H1'))) bug('no H1 in the published page');
      if (a11y.articles < 3) bug(`only ${a11y.articles} of the 3 cards publish as <article>`);
      // What a screen reader gets: the browser's own accessibility tree
      for (const role of ['banner', 'main', 'contentinfo']) if (!(await f.getByRole(role).count())) bug(`no "${role}" region in the accessibility tree`);
      if (!(await f.getByRole('heading', { level: 1 }).count())) bug('no level-1 heading in the accessibility tree');
      // Keyboard: the first Tab lands on the skip link, and it is visible then
      // …on the page as a VISITOR opens it: the exported document in its own tab, not inside the builder's preview frame
      // (a key pressed there goes to the builder around it).
      const visitor = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      await visitor.setContent(await f.content(), { waitUntil: 'load' });
      await visitor.keyboard.press('Tab');
      const skip = await visitor.evaluate(() => { const a = document.activeElement; const r = a?.getBoundingClientRect(); return { cls: a?.className, text: a?.textContent, visible: !!r && r.left >= 0 && r.top >= 0 && r.width > 0 }; });
      log(`  first Tab → ${JSON.stringify(skip)}`);
      if (skip.cls !== 'eu-skip' || !skip.visible) bug('the first Tab does not land on a visible "Skip to content" link');
      await visitor.keyboard.press('Enter'); await visitor.waitForTimeout(300);
      const landed = await visitor.evaluate(() => { const a = document.activeElement; return a ? (a.id === "main" ? "#main" : a.tagName.toLowerCase()) + (a.closest("main") ? " (inside main)" : "") : "none"; });
      log(`  Enter on it → focus is now on <${landed}>`);
      if (!/^#main/.test(landed)) bug(`"Skip to content" did not move focus to the main content (focus on ${landed})`);
      await visitor.screenshot({ path: `${OUT}/uatsem-skip-link.png` });
      await visitor.close();
      await page.screenshot({ path: `${OUT}/uatsem-page-preview.png` });
    }
    if (JOB === 'CHECK') {
      const s = await first(page, 'Stack');
      await H.dropInto(page, 'Image', s);
      const s2 = await under(page, s, 'Stack'); await H.dropInto(page, 'Image', s2);
      await H.panel(page, false);
      await H.fillImages(page);
      const b0 = await badge(page); log(`  toolbar after two photos: ${b0}`);
      if (!/2 to do/.test(b0 || '')) bug(`the Page check does not count two undescribed photos (${b0})`);
      await page.getByRole('button', { name: /^Page check/ }).click(); await page.waitForTimeout(500);
      await page.screenshot({ path: `${OUT}/uatsem-check-open.png` });
      await page.getByRole('textbox', { name: 'Picture description' }).first().fill('Pupils reading in the library');
      await page.getByRole('button', { name: 'Save description' }).first().click(); await page.waitForTimeout(400);
      await page.getByRole('button', { name: /only decoration/ }).first().click(); await page.waitForTimeout(400);
      const b1 = await badge(page); log(`  after one description and one "only decoration": ${b1}`);
      if (/to do/.test(b1 || '')) bug(`the Page check still counts something (${b1})`);
      const alts = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const out = []; const w = (n) => { if (n.type === 'image') out.push(n.alt); (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return out; });
      log(`  stored alt texts: ${JSON.stringify(alts)}`);
      if (!alts.includes('Pupils reading in the library') || !alts.includes('')) bug('the description / decoration choice was not stored');
      await page.screenshot({ path: `${OUT}/uatsem-check-done.png` });
    }
    if (JOB === 'LEVELS') {
      const s = await first(page, 'Stack');
      await H.dropInto(page, 'Heading', s);
      const h1 = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] [data-box-id]`)?.getAttribute('data-box-id'), s);
      const h2 = await under(page, h1, 'Heading');
      await H.panel(page, false);
      const auto = [await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] :is(h1,h2,h3,h4,h5,h6)`)?.tagName, h1), await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] :is(h1,h2,h3,h4,h5,h6)`)?.tagName, h2)];
      log(`  automatic levels: ${auto.join(', ')}`);
      if (auto[0] !== 'H1' || auto[1] !== 'H2') bug(`automatic levels are ${auto.join(', ')} — expected H1, H2`);
      await H.select(page, h2);
      if (!(await page.getByRole('button', { name: 'Heading level', exact: true }).count())) await page.getByRole('button', { name: /^Meaning/ }).first().click();
      await page.getByRole('button', { name: 'Heading level', exact: true }).click();
      await page.getByRole('option', { name: /^Level 4/ }).click(); await page.waitForTimeout(400);
      const now = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] :is(h1,h2,h3,h4,h5,h6)`)?.tagName, h2);
      const b = await badge(page); log(`  set by hand to 4 → canvas <${now}>, toolbar: ${b}`);
      if (now !== 'H4') bug(`the canvas shows <${now}> after choosing level 4`);
      if (!/1 to do/.test(b || '')) bug(`the jump from 1 to 4 is not flagged (${b})`);
      await page.getByRole('button', { name: /^Page check/ }).click(); await page.waitForTimeout(400);
      await page.getByRole('button', { name: /^Make it level 2/ }).click(); await page.waitForTimeout(400);
      const fixed = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] :is(h1,h2,h3,h4,h5,h6)`)?.tagName, h2);
      log(`  "Make it level 2" → canvas <${fixed}>, toolbar: ${await badge(page)}`);
      if (fixed !== 'H2') bug(`"Make it level 2" left <${fixed}>`);
      await page.screenshot({ path: `${OUT}/uatsem-levels.png` });
    }
  } catch (e) { bug('harness: ' + e.message.split('\n')[0]); await page.screenshot({ path: `${OUT}/uatsem-${JOB}-THROW.png` }).catch(() => {}); }
  if (errs.length) bug('console errors: ' + errs.join(' | '));
  log(`=== ${JOB} — BUGS: ${bugs.length ? '\n  ' + bugs.join('\n  ') : 'none'}`);
  await browser.close();
})();
