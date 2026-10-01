// HEADED UAT — BATCH L-1 · L1-3 (tier-99 page 142, and the right-sticky pages 12 · 109 · 124 of tier 95): a sidebar
// set to "Sticks when reached" was seen lying ON TOP of the sections AFTER its row, so a click there selected the sidebar.
// Built THROUGH THE UI the way the dresser builds it (dress.js withSidebar): a row of a main column and an aside, the
// aside holding a Heading, a List and a Card, the aside made sticky, the columns sized 70/30, the main column made tall;
// then a section AFTER the row. Scrolled step by step down the page, measuring whether the aside ever overlaps that
// section, and whether a click on the section's covered part selects the section. Screenshots at each step.
//   NODE_PATH=node_modules node scripts/uat/probe-l1-sticky.js [--pos=0,0] [--sticky=1]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js'); const { Builder } = require('./build-page.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const STICKY = arg('sticky', '1') === '1'; const TALL = arg('tall', '0') === '1';
const THEME = arg('theme', 'Light');
const OUT = path.join(__dirname, 'probe-l1-sticky-out', (STICKY ? 'sticky' : 'plain') + (TALL ? '-tall' : '') + '-' + THEME.replace(/\s/g, '')); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const pos = arg('pos', '0,0').split(',').map(Number);
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos });
  page.setDefaultTimeout(12000); let found = 0;
  try {
    if (THEME !== 'Light') { // the top bar's "Website theme" menu, as a user picks it
      await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300);
      await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(500);
    }
    await H.panel(page, true);
    const hdr = await P.first(page, 'Stack'); await P.into(page, hdr, 'Heading');
    const row = await P.tileAfter(page, hdr, 'Stack');
    const main = await P.into(page, row, 'Stack'); const aside = await P.beside(page, main, 'Stack');
    const ah = await P.into(page, aside, 'Heading'); await P.under(page, ah, 'List'); let ac = await P.under(page, ah, 'Card');
    // --tall: a sidebar whose CONTENT is taller than the screen, as on the dressed pages (cards and pictures in it)
    if (TALL) { ac = await P.under(page, ac, 'Image'); ac = await P.under(page, ac, 'Card'); await P.under(page, ac, 'Image'); }
    await H.panel(page, false);
    await I.meaning(page, aside, 'Sidebar'); await I.meaning(page, main, 'Main content');
    if (STICKY) console.log('  sticky set: ' + await I.sticky(page, aside));
    await new Builder(page).sizeColumns([main, aside], [70, 30]);
    await H.panel(page, true);
    let t = await P.into(page, main, 'Text'); for (let i = 0; i < 5; i++) t = await P.under(page, t, 'Text');
    await P.under(page, t, 'Image');
    const after = await P.tileAfter(page, row, 'Stack'); let a = await P.into(page, after, 'Text'); const texts = [a];
    for (let i = 0; i < 4; i++) { a = await P.under(page, a, 'Text'); texts.push(a); }
    await H.panel(page, false); await page.keyboard.press('Escape');
    fs.writeFileSync(path.join(OUT, 'tree.txt'), await H.tree(page));
    // Scroll the canvas down the page, a step at a time, and measure.
    for (let s = 0; s < 12; s++) {
      const m = await page.evaluate(([aside, row, after]) => {
        const r = (id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect();
        const A = r(aside), R = r(row), F = r(after);
        const ox = Math.min(A.right, F.right) - Math.max(A.left, F.left), oy = Math.min(A.bottom, F.bottom) - Math.max(A.top, F.top);
        const ae = document.querySelector(`[data-box-id="${aside}"]`); const cs = getComputedStyle(ae); const kidsBottom = Math.max(...Array.from(ae.children).map((k) => k.getBoundingClientRect().bottom));
        return { aside: [A.top, A.bottom].map(Math.round), row: [R.top, R.bottom].map(Math.round), after: [F.top, F.bottom].map(Math.round), overlap: ox > 2 && oy > 2 ? `${Math.round(ox)}x${Math.round(oy)}` : '', pos: cs.position, asideOutsideRow: A.bottom > R.bottom + 2 || kidsBottom > R.bottom + 2, h: cs.height, spill: Math.round(kidsBottom - A.bottom) };
      }, [aside, row, after]);
      console.log(`  step ${s}: aside ${m.aside} (${m.pos}, height ${m.h}, content spills ${m.spill}px) · row ${m.row} · next section ${m.after}${m.asideOutsideRow ? ' · ASIDE BELOW ITS ROW' : ''}${m.overlap ? ' · OVERLAP ' + m.overlap : ''}`);
      if (m.overlap || m.asideOutsideRow) { found++; await page.screenshot({ path: path.join(OUT, `step-${s}.png`) }); }
      await page.mouse.move(600, 400); await page.mouse.wheel(0, 180); await page.waitForTimeout(350);
    }
    // Click every Text of the section after the row: each must select that Text, not the sidebar.
    for (const id of texts) { const got = await H.select(page, id); if (!got) { found++; console.log(`  could NOT select ${id.slice(-4)} (got ${String(await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id'))).slice(-4)})`); } }
    await page.screenshot({ path: path.join(OUT, 'end.png') });
    // THE PREVIEW, as a visitor gets it: at each rung, scrolled down the page, the sidebar's content never lies over the
    // section after its row, and the sidebar still HOLDS (sticky) while the row is on screen.
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500);
    await page.keyboard.press('h'); await page.waitForTimeout(400);
    const cls = (id) => '.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-');
    for (const w of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width: w, height: 720 }); await page.waitForTimeout(600);
      const f = await (await page.$('iframe')).contentFrame();
      let worst = 0; let held = null;
      for (let s = 0; s < 10; s++) {
        const m = await f.evaluate(([a, n, s]) => { const A = document.querySelector(a), N = document.querySelector(n); if (!A || !N) return null;
          // SCROLL FIRST, then read both: reading the sidebar, scrolling, then reading the next section reported the 200px
          // scroll step as "~180px into the next section" (L1-10, a bug in this probe).
          window.scrollTo(0, s * 200); const kids = Math.max(...Array.from(A.children).map((k) => k.getBoundingClientRect().bottom));
          return { spill: Math.round(kids - N.getBoundingClientRect().top), pos: getComputedStyle(A).position, top: Math.round(A.getBoundingClientRect().top) }; }, [cls(aside), cls(after), s]);
        if (!m) break; worst = Math.max(worst, m.spill); if (s === 2) held = m;
        await page.waitForTimeout(120);
      }
      const bad = worst > 1; if (bad) found++;
      console.log(`  Preview ${w}: the sidebar's content ${bad ? `runs ${worst}px INTO the next section` : 'stays above the next section'} · ${held ? `${held.pos}, top ${held.top}px after a scroll` : ''}`);
      await page.screenshot({ path: path.join(OUT, `preview-${w}.png`) });
    }
  } catch (e) { console.log('CRASH ' + e.message.split('\n')[0] + ' at ' + (page.__step || '?')); await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  if (errs.length) console.log('page errors: ' + [...new Set(errs)].join(' | '));
  console.log(`L1-3 (${STICKY ? 'sticky' : 'plain'}): ${found} problems`);
  await browser.close();
})();
