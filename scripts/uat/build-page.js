// BUILD A REAL CRAWLED PAGE THROUGH THE UI (RULE Y) — every section of a page from docs/layout-benchmark/pages.tsv,
// parsed by layout-grammar.js, made the way a person makes it: a Stack per section, `into` an empty box, `under` the
// line before, `beside` for columns, the Grid tile and its picker for grids, edge drags for the column shares, and real
// content in the leaves (a heading first, words, pictures, a button). Nothing is written into storage.
const H = require('./h.js');
const P = require('./pages.js').helpers;

const MAX_LINES = 5;      // a stack's lines built (the crawl describes at most 5 of them)
const MAX_REPEAT = 2;     // a repeated row/grid: lines built
const MAX_COLS = 6;       // "6+" columns

/** Content for a leaf, chosen by where it sits — a page is headings, words, pictures and buttons, not empty boxes. */
function leafTile(ctx) {
  if (ctx.dress && (ctx.inRow || ctx.inGrid)) {
    // DRESSED (dress.js): what real sections hold, by their shape — deck B-tier components (RULE C)
    if (ctx.cols >= 5) return 'Image';                                                  // a logo strip
    if (ctx.cols === 4) return ctx.sectionIndex % 2 ? 'Stat' : 'Card';                  // statistics · a row of cards
    if (ctx.cols === 3) return ctx.sectionIndex % 3 === 1 ? 'Quote' : 'Card';           // testimonials · cards
    if (ctx.cols === 2) return (ctx.col === (ctx.sectionIndex % 2)) ? 'Image' : 'Text'; // a feature row, sides alternating
    return ctx.inGrid ? 'Card' : 'Text';
  }
  if (ctx.firstInSection) return 'Heading';
  if (ctx.inRow && ctx.col === 0 && ctx.cols === 2 && ctx.sectionIndex % 2 === 0) return 'Image';
  if (ctx.inGrid && ctx.col % 3 === 1) return 'Image';
  if (ctx.lastLine && ctx.lines >= 3) return 'Button';
  return 'Text';
}

/** The id of the row band a column sits in (its parent block). */
const bandOf = (page, colId) => page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`)?.parentElement?.closest('[data-box-id]')?.getAttribute('data-box-id') ?? null, colId);
/** Direct child blocks of a block, in order. */
const kidsOf = (page, id) => page.evaluate((id) => { const el = document.querySelector(`[data-box-id="${id}"]`); if (!el) return [];
  const out = []; const walk = (e) => { for (const c of e.children) { if (c.hasAttribute('data-box-id')) out.push(c.getAttribute('data-box-id')); else walk(c); } }; walk(el); return out; }, id);

class Builder {
  constructor(page, log = () => {}) { this.page = page; this.log = log; this.steps = 0; }

  /** Put block `tile` as the NEXT LINE of `container`: into it when empty, else under its last line. Returns the new id. */
  async addLine(container, tile, last) {
    this.steps++;
    if (!last) return P.into(this.page, container, tile);
    // After a CONTAINER (a stack, a row), nothing under it is free to aim at: it is flush with its parent, and the middle
    // of its last line is often empty space BESIDE a short block — a drop there rightly lands beside it. A person selects
    // the container and clicks the tile ("adds after the selection"). After a single block, they drop just under it.
    // A row of columns is not selectable at all (it is scaffolding — `selectionChain`), and a drop at its bottom lands
    // inside the column above. So after any container, the next line goes where a person finds it: select the block
    // this line belongs to, and "Add a block inside" — which appends an empty stack at its end.
    const isBox = await this.page.evaluate((id) => !!document.querySelector(`[data-box-id="${id}"] [data-box-id]`), last);
    if (isBox) {
      const before = await P.ids(this.page);
      await H.panel(this.page, false); await H.select(this.page, container);
      await this.page.getByRole('button', { name: /Add a block inside/ }).first().click(); await this.page.waitForTimeout(500);
      const box = (await P.newestLeaf(this.page, before)).id; await H.panel(this.page, true);
      return tile === 'Stack' ? box : P.into(this.page, box, tile);
    }
    return P.under(this.page, last, tile);
  }

  /** Size the columns of a row (ids in order) to `shares` by dragging each shared edge, left to right. */
  async sizeColumns(ids, shares) {
    const page = this.page; const sum = shares.reduce((a, b) => a + b, 0) || 1;
    if (ids.length < 2 || shares.every((s) => Math.abs(s - shares[0]) < 6)) return; // equal: already equal
    // Measure with the blocks panel CLOSED — the panel docks beside the page and shrinks the canvas to fit, so a distance
    // measured with it open is the wrong distance once it is closed for the drag.
    await H.panel(page, false);
    // A column can be dragged no narrower than 3rem (the hand floor), so a crawled share below it — a 5% column of a
    // 720px main column is 36px — is raised to the floor and the others give way in proportion. Asking for the crawl's
    // number as written left the first drag clamped and every later edge aimed at the wrong place (#129).
    let targets = null;
    for (let i = 0; i < ids.length - 1; i++) {
      await H.select(page, ids[i]);
      // the row OR grid the columns sit in: its content box, and this column's right edge within it
      const m = await page.evaluate(([first, id]) => {
        const a = document.querySelector(`[data-box-id="${first}"]`), b = document.querySelector(`[data-box-id="${id}"]`); if (!a || !b) return null;
        const host = a.parentElement; const cs = getComputedStyle(host); const hr = host.getBoundingClientRect();
        const left = hr.left + parseFloat(cs.paddingLeft), inner = hr.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const Z = document.querySelector('[data-box-id]').currentCSSZoom || 1;
        return { inner, right: b.getBoundingClientRect().right - left, floor: 3.25 * 16 * Z };
      }, [ids[0], ids[i]]);
      if (!m) break;
      if (!targets) {
        let px = shares.map((s) => (s / sum) * m.inner);
        for (let k = 0; k < 4; k++) { const short = px.map((v) => Math.max(0, m.floor - v)); const need = short.reduce((a, b) => a + b, 0); if (!need) break; const room = px.reduce((a, v) => a + Math.max(0, v - m.floor), 0) || 1; px = px.map((v) => (v < m.floor ? m.floor : v - (need * Math.max(0, v - m.floor)) / room)); }
        targets = []; let c = 0; for (const v of px) { c += v; targets.push(c); }
      }
      const dx = Math.round(targets[i] - m.right);
      if (Math.abs(dx) < 4) continue;
      await H.dragEdge(page, 'right', dx);
    }
    await H.panel(page, true);
  }

  /** Columns side by side as the next line of `container` — then each filled. Returns the id to put the next line under. */
  async columns(t, container, last, ctx) {
    const n = Math.min(t.n, MAX_COLS);
    const repeat = Math.min(t.lines, MAX_REPEAT);
    let lineAfter = last;
    if (t.plusStack) { lineAfter = await this.leaf(container, lineAfter, { ...ctx, lines: 2, lastLine: false }); ctx = { ...ctx, firstInSection: false }; }
    for (let r = 0; r < repeat; r++) {
      if (t.kind === 'grid') {
        // The NEXT LINE of the section, then the Grid dropped into it — never at the bottom of the line before: aimed
        // there, the grid landed INSIDE that line's middle column (a 120px one on a six-column row) and drew three
        // quotes one letter wide. A person adds the line first ("Add a block inside") and drops the grid into it.
        const box = lineAfter ? await this.addLine(container, 'Stack', lineAfter) : container;
        const before = await P.ids(this.page);
        await H.dropInto(this.page, 'Grid', box);
        const cell = this.page.locator(`[role="gridcell"][aria-label="${n} across, 1 down"]`);
        if (await cell.count()) { await cell.click(); await this.page.waitForTimeout(700); }
        const g = (await P.newestLeaf(this.page, before)).id; this.steps++;
        const cells = await kidsOf(this.page, g);
        for (let c = 0; c < cells.length; c++) {
          const x = t.inner[c];
          if (x && x.length > 1) { const a = await P.into(this.page, cells[c], 'Stack'); const ids = await P.row(this.page, a, Array(Math.min(x.length, 4) - 1).fill('Stack')); for (const id of ids) await P.into(this.page, id, 'Text'); }
          else await P.into(this.page, cells[c], leafTile({ ...ctx, firstInSection: ctx.firstInSection && c === 0, inGrid: true, col: c, cols: n }));
          this.steps++;
        }
        await this.sizeColumns(cells.slice(0, n), t.cols.slice(0, n));
        lineAfter = g;
      } else {
        const c0 = await this.addLine(container, 'Stack', lineAfter);
        const ids = await P.row(this.page, c0, Array(n - 1).fill('Stack')); this.steps += n - 1;
        for (let c = 0; c < ids.length; c++) {
          const x = t.inner[c];
          if (x && x.length > 1) { const a = await P.into(this.page, ids[c], 'Stack'); const inner = await P.row(this.page, a, Array(Math.min(x.length, 4) - 1).fill('Stack')); for (const id of inner) await P.into(this.page, id, 'Text'); await this.sizeColumns(inner, x); }
          else await P.into(this.page, ids[c], leafTile({ ...ctx, firstInSection: ctx.firstInSection && c === 0, inRow: true, col: c, cols: n }));
          this.steps++;
        }
        await this.sizeColumns(ids, t.cols.slice(0, n));
        lineAfter = (await bandOf(this.page, c0)) ?? c0;
      }
      ctx = { ...ctx, firstInSection: false };
    }
    return lineAfter;
  }

  async leaf(container, last, ctx) { return this.addLine(container, leafTile(ctx), last); }

  /** Fill `container` (an empty box) with structure `t` — after the line `after`, when the box already holds one. */
  async fill(t, container, ctx, after = null) {
    if (t.kind === 'leaf') return this.leaf(container, after, { ...ctx, lines: 1, lastLine: true });
    if (t.kind === 'row' || t.kind === 'grid') return this.columns(t, container, after, ctx);
    // a STACK: its described lines, then plain lines up to its count
    const lines = Math.min(Math.max(t.n, t.parts.length), MAX_LINES);
    let last = after;
    for (let i = 0; i < lines; i++) {
      const part = t.parts[i] ?? { kind: 'leaf' };
      const lctx = { ...ctx, firstInSection: ctx.firstInSection && i === 0, lines, lastLine: i === lines - 1 };
      if (part.kind === 'leaf') last = await this.leaf(container, last, lctx);
      else if (part.kind === 'stack') { const s = await this.addLine(container, 'Stack', last); await this.fill(part, s, lctx); last = s; }
      else last = await this.columns(part, container, last, lctx);
    }
    return last;
  }

  /** Every section of the page, each a page-level Stack after the one before. Returns the section ids. */
  async page_(sections) {
    const ids = [];
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      this.log(`  section ${i + 1}/${sections.length}: ${s.width} ${JSON.stringify(s.tree).slice(0, 90)}`);
      const sec = i === 0 ? await P.first(this.page, 'Stack') : await P.tileAfter(this.page, ids[i - 1], 'Stack');
      ids.push(sec);
      await this.fill(s.tree, sec, { firstInSection: true, sectionIndex: i });
    }
    return ids;
  }
}

module.exports = { Builder, leafTile, kidsOf, bandOf };
