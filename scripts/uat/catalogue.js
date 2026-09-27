// THE BENCHMARK'S PAGE STRUCTURES, built in our builder THROUGH THE UI (docs/LAYOUT_BENCHMARK.md).
// Each entry: { tier, source, build(page) }. Builders leave the blocks panel OPEN.
const H = require('./h.js');
const P = require('./pages.js');
const { first, beside, under, into, row, grid, tileAfter } = P.helpers;
/** A column holding `n` stacked blocks, built the product's way: drop INTO the column, then stack inside it. */
async function column(page, colId, tiles) { let prev = await into(page, colId, tiles[0]); for (const t of tiles.slice(1)) prev = await under(page, prev, t); return colId; }
/** Resize a block's right edge by dx — layout sizes are chosen by dragging, as a user does. */
async function widen(page, id, dx) { await H.panel(page, false); await H.select(page, id); await H.dragEdge(page, 'right', dx); await H.panel(page, true); }

module.exports = {
  // ── SIMPLE ────────────────────────────────────────────────────────────────────────────────
  A1_single_column: { tier: 'simple', source: 'A1 pancake', build: async (page) => {
    const h = await first(page); await row(page, h, ['Stack']);
    let b = await tileAfter(page, (await H.rowOf(page, h)).kids[1].id, 'Heading');
    b = await tileAfter(page, b, 'Text'); b = await tileAfter(page, b, 'Image'); b = await tileAfter(page, b, 'Text');
    await tileAfter(page, b, 'Stack');
  } },
  B14_feature_grid: { tier: 'simple', source: 'B14 feature grid 3', build: async (page) => {
    const h = await first(page, 'Heading'); const f = await tileAfter(page, h, 'Card'); await row(page, f, ['Card', 'Card']);
  } },
  B16_stats_row: { tier: 'simple', source: 'B16 stats', build: async (page) => { const s = await first(page, 'Stat'); await row(page, s, ['Stat', 'Stat', 'Stat']); } },
  // ── MEDIUM ────────────────────────────────────────────────────────────────────────────────
  A2_blog_sidebar: { tier: 'medium', source: 'A2 sidebar right / C4', build: async (page) => {
    const h = await first(page); await row(page, h, ['Stack']);
    const main = await tileAfter(page, (await H.rowOf(page, h)).kids[1].id, 'Stack'); const aside = await beside(page, main);
    await column(page, main, ['Heading', 'Image', 'Text', 'Text']); await column(page, aside, ['Card', 'Stack']);
    await widen(page, main, 180); // ≈ 70/30
    await tileAfter(page, aside, 'Stack');
  } },
  A8_zigzag: { tier: 'medium', source: 'A8 zig-zag', build: async (page) => {
    let a = await first(page, 'Image'); let b = await beside(page, a); await column(page, b, ['Heading', 'Text', 'Button']);
    a = await tileAfter(page, b, 'Stack'); await column(page, a, ['Heading', 'Text']); b = await beside(page, a, 'Image');
    a = await tileAfter(page, b, 'Image'); b = await beside(page, a); await column(page, b, ['Heading', 'Text']);
  } },
  B30_footer_5col: { tier: 'medium', source: 'B30 footer', build: async (page) => {
    const c = await first(page); const cols = await row(page, c, ['Stack', 'Stack', 'Stack', 'Stack']);
    for (const k of cols) await column(page, k, ['Heading', 'Text', 'Text']);
    const bar = await tileAfter(page, cols[4], 'Text'); await beside(page, bar, 'Text');
  } },
  SIDEBAR_full_height: { tier: 'medium', source: 'user: one stack the full length, stacks beside it', build: async (page) => {
    const side = await first(page); const main = await beside(page, side);
    await column(page, main, ['Stack', 'Stack', 'Stack', 'Stack', 'Stack']);
    await column(page, side, ['Stack']);
    await widen(page, side, -250); // a narrow rail beside a long column
  } },
  // ── EXTREMELY COMPLICATED ─────────────────────────────────────────────────────────────────
  A4_holy_grail: { tier: 'complicated', source: 'A4 holy grail', build: async (page) => {
    const h = await first(page); await row(page, h, ['Stack', 'Stack']);
    const l = await tileAfter(page, (await H.rowOf(page, h)).kids[2].id, 'Stack'); const m = await beside(page, l); const r = await beside(page, m);
    await column(page, l, ['Stack', 'Stack', 'Stack']); await column(page, m, ['Heading', 'Image', 'Text']); await column(page, r, ['Card']);
    const f = await tileAfter(page, r, 'Stack'); await row(page, f, ['Stack', 'Stack']);
  } },
  A11_magazine: { tier: 'complicated', source: 'A11 magazine', build: async (page) => { await P.P3_magazine(page); } },
  A7_bento: { tier: 'complicated', source: 'A7 bento', build: async (page) => {
    const h = await first(page, 'Heading'); await H.panel(page, false); await H.select(page, h); await H.panel(page, true);
    const g = await grid(page, 3, 3);
    const cells = await page.evaluate((gid) => Array.from(document.querySelector(`[data-box-id="${gid}"]`).querySelectorAll(':scope > [data-box-id]')).map((e) => e.getAttribute('data-box-id')), g);
    if (cells[0]) await into(page, cells[0], 'Card'); if (cells[4]) { const x = await into(page, cells[4]); await beside(page, x); }
    if (cells[8]) await into(page, cells[8], 'Stat');
  } },
  C2_school_home: { tier: 'complicated', source: 'C2 school homepage', build: async (page) => {
    const logo = await first(page); const hdr = await row(page, logo, ['Stack', 'Button']);
    const hero = await tileAfter(page, hdr[2], 'Stack'); await column(page, hero, ['Heading', 'Text', 'Button']);
    const q = await tileAfter(page, hero, 'Stack'); await row(page, q, ['Stack', 'Stack', 'Stack', 'Stack', 'Stack']);
    const qRow = await H.rowOf(page, q);
    const w = await tileAfter(page, qRow.kids[qRow.kids.length - 1].id, 'Image'); const wt = await beside(page, w); await column(page, wt, ['Quote', 'Text', 'Button']);
    const s = await tileAfter(page, wt, 'Stat'); const stats = await row(page, s, ['Stat', 'Stat', 'Stat']);
    const news = await tileAfter(page, stats[3], 'Stack'); const ev = await beside(page, news);
    const n1 = await into(page, news, 'Card'); await beside(page, n1, 'Card'); await column(page, ev, ['Stack', 'Stack', 'Stack']);
    await widen(page, news, 170); // ≈ 67/33
    const t = await tileAfter(page, ev, 'Quote'); const quotes = await row(page, t, ['Quote', 'Quote']);
    const cta = await tileAfter(page, quotes[2], 'Stack');
    const f = await tileAfter(page, cta, 'Stack'); const fc = await row(page, f, ['Stack', 'Stack', 'Stack', 'Stack']);
    for (const k of fc) await column(page, k, ['Text', 'Text']);
  } },
  P4_stress: { tier: 'complicated', source: 'deep nesting + uneven widths + components', build: async (page) => { await P.P4_stress(page); } },
};
