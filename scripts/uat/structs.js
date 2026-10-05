// Tiered structures, ALL built through the UI. Each returns the id of one block in the row under test.
const H = require('./h.js');
const first = async (page) => { await H.clickTile(page, 'Stack'); const ls = await H.leaves(page); return ls[ls.length - 1]; };
const lastOfRow = async (page, id) => { const r = await H.rowOf(page, id); return r ? r.kids[r.kids.length - 1].id : id; };
const leafIn = async (page, parentId) => page.evaluate((pid) => { const p = document.querySelector(`[data-box-id="${pid}"]`); const ls = Array.from(p.querySelectorAll('[data-box-id]')).filter((e) => !e.querySelector('[data-box-id]')); return ls.map((e) => e.getAttribute('data-box-id')); }, parentId);
const addRowOf = async (page, n, tiles = []) => {
  const a = await first(page);
  for (let i = 1; i < n; i++) await H.dropBeside(page, tiles[i - 1] || 'Stack', await lastOfRow(page, a.id));
  return a.id;
};
const S = {
  // ── SIMPLE ──
  S1_two: (page) => addRowOf(page, 2),
  S2_three: (page) => addRowOf(page, 3),
  S3_four: (page) => addRowOf(page, 4),
  S4_stack_card: (page) => addRowOf(page, 2, ['Card']),
  // ── MEDIUM ──
  M1_unequal_three: async (page) => { const id = await addRowOf(page, 3); await H.select(page, id); await H.dragEdge(page, 'right', -150); return id; },
  M2_row_inside_stack: async (page) => {
    const a = await first(page); await H.dropInto(page, 'Stack', a.id);
    const [inner] = await leafIn(page, a.id); await H.dropBeside(page, 'Stack', inner); await H.dropBeside(page, 'Stack', await lastOfRow(page, inner)); return inner;
  },
  M3_two_bands: async (page) => {
    await addRowOf(page, 2); await H.panel(page, false);
    await H.panel(page, true); const b = await first(page); // lands after, as a second band
    await H.dropBeside(page, 'Stack', b.id); await H.dropBeside(page, 'Stat', await lastOfRow(page, b.id)); return b.id;
  },
  M4_mixed_components: (page) => addRowOf(page, 4, ['Card', 'Stat', 'Quote']),
  // ── EXTREMELY COMPLICATED ──
  C1_row_in_row: async (page) => {
    // A | B | C, and inside B a row of three, one of which is a Card — edge the INNER row
    const a = await addRowOf(page, 3); const r = await H.rowOf(page, a); const mid = r.kids[1].id;
    await H.dropInto(page, 'Stack', mid); const [inner] = await leafIn(page, mid);
    await H.dropBeside(page, 'Stack', inner); await H.dropBeside(page, 'Card', await lastOfRow(page, inner)); return inner;
  },
  C2_row_in_grid_cell: async (page) => {
    await H.clickTile(page, 'Grid'); await H.panel(page, false);
    const cells = await H.leaves(page); const cell = cells[0];
    await H.panel(page, true); await H.dropInto(page, 'Stack', cell.id);
    const [inner] = await leafIn(page, cell.id); if (!inner) throw new Error('grid cell drop failed');
    await H.dropBeside(page, 'Stack', inner); return inner;
  },
  C3_deep_nest: async (page) => {
    // band › row(A | B) › B › row(B1 | B2) › B2 › row(x | y | z)
    const a = await addRowOf(page, 2); const r = await H.rowOf(page, a); const B = r.kids[1].id;
    await H.dropInto(page, 'Stack', B); const [b1] = await leafIn(page, B); await H.dropBeside(page, 'Stack', b1);
    const r2 = await H.rowOf(page, b1); const B2 = r2.kids[1].id;
    await H.dropInto(page, 'Stack', B2); const [x] = await leafIn(page, B2);
    await H.dropBeside(page, 'Stack', x); await H.dropBeside(page, 'Stat', await lastOfRow(page, x)); return x;
  },
  C4_five_mixed_wrapped: async (page) => {
    // five in a row — the builder wraps some; edge them across lines
    return addRowOf(page, 5, ['Card', 'Stack', 'Stat', 'Stack']);
  },
};
module.exports = S;
if (require.main === module) (async () => {
  const which = process.argv.find((a) => a.startsWith('--only='))?.slice(7) || '';
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  for (const [name, build] of Object.entries(S)) {
    if (which && !name.startsWith(which)) continue;
    const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
    await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
    await page.goto((process.env.BASE || 'http://localhost:3100') + '/website/box-demo'); await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 }); await page.waitForTimeout(900);
    try {
      await H.panel(page, true); const id = await build(page); await H.panel(page, false);
      const row = await H.rowOf(page, id);
      console.log(`== ${name}: target ${id.slice(-4)} row ${row ? H.fmt(row) : 'NONE'} ${row ? H.rowProblems(row).join('; ') : ''} ${errs.join(' / ')}`);
      console.log((await H.tree(page)).split('\n').map((l) => '   ' + l).join('\n'));
      await H.shot(page, `st-${name}.png`);
    } catch (e) { console.log(`== ${name}: BUILD FAILED ${e.message.split('\n')[0]}`); await H.shot(page, `st-${name}-fail.png`); }
    await page.context().close();
  }
  await browser.close();
})();
