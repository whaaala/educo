// REAL PAGE STRUCTURES — multiple bands, rows, columns of stacked blocks, nesting, components.
// Built ONLY through the UI with the real pointer (RULE Y). Each builder leaves the panel OPEN.
const H = require('./h.js');

const allIds = (page) => page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).map((e) => e.getAttribute('data-box-id')));
const ids = async (page) => new Set(await allIds(page));
/** The OUTERMOST block that appeared since `before` — a Card, not the image inside it. */
const newestLeaf = async (page, before) => {
  const got = await page.evaluate((b) => { const was = new Set(b); const fresh = Array.from(document.querySelectorAll('[data-box-id]')).filter((e) => !was.has(e.getAttribute('data-box-id')));
    const outer = fresh.filter((e) => !fresh.some((o) => o !== e && o.contains(e)));
    // Skip bare scaffolding bands: prefer an outer block that is not a row band wrapping exactly one new block.
    const pick = outer.map((e) => { let x = e; while (x.children.length && Array.from(x.querySelectorAll(':scope > [data-box-id]')).length === 1 && getComputedStyle(x).flexDirection === 'row' && x.querySelector(':scope > [data-box-id]') && fresh.includes(x.querySelector(':scope > [data-box-id]'))) x = x.querySelector(':scope > [data-box-id]'); return x; });
    return pick.length ? pick[pick.length - 1].getAttribute('data-box-id') : null; }, [...before]);
  if (!got) { await page.screenshot({ path: require('path').join(__dirname, 'pg-nothing.png') }); throw new Error('the drop added nothing (after: ' + (page.__step || '?') + ')'); }
  return { id: got };
};
/** Answer the Grid picker: N across, M down. */
async function grid(page, across, down) { page.__step = 'grid(' + [across, down].map((v) => String(v).slice(-4)).join(',') + ')'; if (process.env.DEBUG) console.log('  step', page.__step); const before = await ids(page); await H.clickTile(page, 'Grid'); await page.locator(`[role="gridcell"][aria-label="${across} across, ${down} down"]`).click(); await page.waitForTimeout(800); return (await newestLeaf(page, before)).id; }
/** Select `id` and click a tile — it lands AFTER the selection, as a new band at page level when id is a band's block. */
async function tileAfter(page, id, tile) { page.__step = 'tileAfter(' + [id, tile].map((v) => String(v).slice(-4)).join(',') + ')'; if (process.env.DEBUG) console.log('  step', page.__step); const before = await ids(page); await H.panel(page, false); await H.select(page, id); await H.panel(page, true); await H.clickTile(page, tile); return (await newestLeaf(page, before)).id; }
async function first(page, tile = 'Stack') { page.__step = 'first(' + [tile].map((v) => String(v).slice(-4)).join(',') + ')'; if (process.env.DEBUG) console.log('  step', page.__step); const before = await ids(page); await H.clickTile(page, tile); return (await newestLeaf(page, before)).id; }
async function beside(page, id, tile = 'Stack') { page.__step = 'beside(' + [id, tile].map((v) => String(v).slice(-4)).join(',') + ')'; if (process.env.DEBUG) console.log('  step', page.__step); const before = await ids(page); await H.dropBeside(page, tile, id); return (await newestLeaf(page, before)).id; }
/** Drop UNDER a block — near its bottom edge — so it stacks beneath it in the same column. */
async function under(page, id, tile = 'Stack') { page.__step = 'under(' + [id, tile].map((v) => String(v).slice(-4)).join(',') + ')'; if (process.env.DEBUG) console.log('  step', page.__step);
  const before = await ids(page);
  const v = await H.visibleRect(page, id);
  await H.dropTile(page, tile, Math.round(v.l + v.w / 2), Math.round(v.b - 5));
  return (await newestLeaf(page, before)).id;
}
async function into(page, id, tile = 'Stack') { page.__step = 'into(' + [id, tile].map((v) => String(v).slice(-4)).join(',') + ')'; if (process.env.DEBUG) console.log('  step', page.__step); const before = await ids(page); await H.dropInto(page, tile, id); return (await newestLeaf(page, before)).id; }
async function row(page, fromId, tiles) { const out = [fromId]; for (const t of tiles) out.push(await beside(page, out[out.length - 1], t)); return out; }

const PAGES = {
  /** header (logo | nav) · hero · 3 features · testimonial (card | text) · 4-column footer */
  P1_landing: async (page) => {
    const logo = await first(page); await row(page, logo, ['Stack']);
    const hero = await tileAfter(page, (await H.rowOf(page, logo)).kids[1].id, 'Stack');
    const f1 = await tileAfter(page, hero, 'Stack'); const feats = await row(page, f1, ['Card', 'Stack']);
    const t1 = await tileAfter(page, feats[2], 'Card'); await row(page, t1, ['Stack']);
    const tRow = await H.rowOf(page, t1);
    const ft = await tileAfter(page, tRow.kids[tRow.kids.length - 1].id, 'Stack'); await row(page, ft, ['Stack', 'Stack', 'Stack']);
  },
  /** header · content column (3 stacked) | sidebar column (2 stacked) · footer (2) */
  P2_blog: async (page) => {
    const logo = await first(page); await row(page, logo, ['Stack']);
    const content = await tileAfter(page, (await H.rowOf(page, logo)).kids[1].id, 'Stack');
    const side = await beside(page, content);
    const c1 = await into(page, content); const c2 = await under(page, c1); await under(page, c2);
    const s1 = await into(page, side); await under(page, s1);
    const f = await tileAfter(page, side, 'Stack'); await row(page, f, ['Stack']);
  },
  /** a row whose columns hold rows · a grid with content in its cells · Card | Stat | Quote */
  P3_magazine: async (page) => {
    const a = await first(page); const b = await beside(page, a);
    const a1 = await into(page, a); await beside(page, a1);
    const b1 = await into(page, b); await under(page, b1);
    await H.panel(page, false); await H.select(page, b); await H.panel(page, true);
    const g = await grid(page, 2, 2);
    const cells = await page.evaluate((gid) => Array.from(document.querySelector(`[data-box-id="${gid}"]`).querySelectorAll(':scope > [data-box-id]')).map((e) => e.getAttribute('data-box-id')), g);
    if (cells[0]) { const x = await into(page, cells[0]); await beside(page, x); }
    if (cells[3]) await into(page, cells[3], 'Card');
    const k = await tileAfter(page, g, 'Card'); await row(page, k, ['Stat', 'Quote']);
  },
  /** everything, deeper: uneven widths, a column of three beside a nested row, components, a second nested level */
  P4_stress: async (page) => {
    const h = await first(page); await row(page, h, ['Stack', 'Stack']);
    const x = await tileAfter(page, (await H.rowOf(page, h)).kids[2].id, 'Stack'); const y = await beside(page, x); await beside(page, y, 'Card');
    const x2 = await under(page, x); await under(page, x2);
    const y1 = await into(page, y); const y2 = await beside(page, y1);
    const y21 = await into(page, y2); await under(page, y21);
    await H.panel(page, false); await H.select(page, h); await H.dragEdge(page, 'right', -140); await H.panel(page, true);
    const lastLeaf = (await H.leaves(page)).sort((p, q) => q.b - p.b)[0];
    const f = await tileAfter(page, lastLeaf.id, 'Stat'); await row(page, f, ['Stack', 'Quote', 'Stack']);
  },
};
module.exports = PAGES;
module.exports.helpers = { first, beside, under, into, row, grid, tileAfter, ids, newestLeaf };

if (require.main === module) (async () => {
  const which = process.argv.find((a) => a.startsWith('--only='))?.slice(7) || '';
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  await Promise.all(Object.entries(PAGES).filter(([n]) => !which || n.startsWith(which)).map(async ([name, build]) => {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1200 } }); const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
    await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
    await page.goto((process.env.BASE || 'http://localhost:3100') + '/website/box-demo');
    await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
    try {
      await H.panel(page, true); await build(page); await H.panel(page, false);
      const n = (await H.leaves(page)).length;
      console.log(`== ${name}: ${n} leaf blocks ${errs.join(' / ')}\n${(await H.tree(page)).split('\n').map((l) => '   ' + l).join('\n')}`);
    } catch (e) { console.log(`== ${name}: BUILD FAILED ${e.message.split('\n')[0]}`); }
    await page.screenshot({ path: require('path').join(__dirname, `pg-${name}.png`), fullPage: true });
    await ctx.close();
  }));
  await browser.close();
})();
