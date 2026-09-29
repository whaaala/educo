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

// WHAT A COLUMN CAN HOLD IS DECIDED BY ITS WIDTH, NOT ITS SHARE. "Under 12% → an icon" was right on a full-width row and
// wrong everywhere else: 16.6% of a main column beside a sidebar is 111px, and the Quote put there is wider than that by
// its longest word — so the column was drawn wider than its share and the next one dropped a line (tier 99, page 64); a
// Card in a grid cell two columns of twelve wide broke "description" in two (23 pages, 905 words). Real pages put small
// things in small columns. The width is the one a visitor has at 900px, the narrowest screen that shows a row as designed.
const TEXT_MIN = 96;        // 6rem — "description" at body size is 86px
// A Card's own floor is 10rem, and "1,000+" in a Stat and "everything" in a Quote need 150px. The estimate is a share of the
// editor's page scaled to 900px, and a centred column is NOT a share of the page (it has gutters and a measure of its own):
// measured on page 211, four Stats judged to have 150px had 120 at 900px. The floor carries that fifth.
const COMPONENT_MIN = 190;
const fitTile = (px, tile) => (px < TEXT_MIN ? 'Icon' : px < COMPONENT_MIN && ['Quote', 'Card', 'Stat'].includes(tile) ? 'Text' : tile);

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

  /** Are the columns ALL still on one line — or has one of them dropped to the next? (Any of them: widening the first column
   *  of three that are already at their floor drops the THIRD, and the second stays where it was.) */
  onOneLine(ids) {
    return this.page.evaluate((ids) => { const r = ids.map((id) => document.querySelector(`[data-box-id="${id}"]`)?.getBoundingClientRect()).filter(Boolean);
      return r.length === ids.length && r.every((x) => x.top < r[0].bottom - 2 && x.top > r[0].top - 2); }, ids);
  }

  /** How wide each column will be, in px, on a 900px screen — its share of the row, the row's share of the page. */
  async widthsAsDesigned(ids, shares, within = null) {
    const sum = shares.reduce((a, b) => a + b, 0) || 1;
    if (within != null) return shares.map((s) => (s / sum) * within);
    const m = await this.page.evaluate((first) => { const a = document.querySelector(`[data-box-id="${first}"]`); if (!a) return null; const host = a.parentElement; const cs = getComputedStyle(host);
      return { inner: host.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), frame: document.querySelector('[data-box-id]').getBoundingClientRect().width }; }, ids[0]);
    return shares.map((s) => (m ? (s / sum) * (m.inner / m.frame) * 900 : Infinity));
  }

  /** Size the columns of a row (ids in order) to `shares` by dragging each shared edge, left to right. */
  async sizeColumns(ids, shares) {
    const page = this.page; const sum = shares.reduce((a, b) => a + b, 0) || 1;
    if (ids.length < 2 || shares.every((s) => Math.abs(s - shares[0]) < 6)) return; // equal: already equal
    // Measure with the blocks panel CLOSED — the panel docks beside the page and shrinks the canvas to fit, so a distance
    // measured with it open is the wrong distance once it is closed for the drag.
    await H.panel(page, false);
    // THE ROW HAS TO BE ON ONE LINE BEFORE ITS EDGES MEAN ANYTHING. A section keeps a 14rem reflow floor, so three columns
    // need 672px: in a 668px main column the third had already dropped to the next line, the dresser sized the first two
    // regardless, and the row stored 50 + 25 + 33.34 — a HOLE at every wide screen (tier 99, 29 pages). A person laying out
    // a desktop row on a small editor chooses a wider screen size first, and goes back afterwards.
    let widened = false;
    for (const preset of ['Desktop (1280px)', 'Wide (1920px)']) { if (await this.onOneLine(ids)) break; await page.getByRole('button', { name: preset }).first().click(); await page.waitForTimeout(800); widened = true; }
    if (widened) page.__widerToSize = (page.__widerToSize || 0) + 1;
    // …AND WHERE NO SCREEN SIZE HOLDS IT ON ONE LINE, IT IS LEFT AS THE BUILDER LAID IT OUT, AND SAID SO (RULE E: a gap is
    // recorded, never skipped in silence). Six columns need 6 × 14rem = 1344px of row; a main column beside a sidebar has
    // that on no screen size the editor offers.
    const gap = (why) => { (page.__gaps = page.__gaps || []).push(`a row of ${ids.length} asked for ${shares.join(' · ')} — ${why}`); };
    const fullWidth = async () => { if (widened) { await page.getByRole('button', { name: 'Full width' }).first().click(); await page.waitForTimeout(800); } await H.panel(page, true); };
    if (!(await this.onOneLine(ids))) { gap('it is on one line at no screen size the editor has, so it was left as dropped'); await fullWidth(); return; }
    try { await this.dragToShares(ids, shares, sum); }
    catch (e) { if (!widened) throw e; gap(`at the wider screen size its edges could not be reached (${e.message.split('\n')[0]})`); }
    await fullWidth();
  }

  async dragToShares(ids, shares, sum) {
    const page = this.page;
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
      const say = async (what) => { if (process.env.DEBUG) console.log(`  size ${ids[i].slice(-4)} [${shares.join(",")}] ${what}: inner ${Math.round(m.inner)} right ${Math.round(m.right)} target ${Math.round(targets[i])} dx ${dx} · stored ${((await H.storedRow(page, ids[i])) || []).map((c) => c.w).join(" + ")}`); };
      if (Math.abs(dx) < 4) { await say("already there"); continue; }
      const wasBeside = await this.onOneLine(ids);
      await H.dragEdge(page, 'right', dx); await say("dragged");
      // A PERSON WATCHES WHAT THE DRAG DID. Pull past what the neighbour can give (a row's 14rem reflow floor, a grid's
      // hand floor) and it drops to the next line, keeping its width — by design, "make this one full width". Nobody
      // sizing three columns means that: they see it drop and bring the edge back until it is beside them again. Asking
      // for the crawl's share regardless stored 50 + 25 + 33.34 in a row (a HOLE at every wide screen, tier 99, 29 pages)
      // and 11 + 6 in a grid, whose free half-row then offered "Add a block here" to the next click.
      //
      // UNDO, THEN A LITTLE LESS — never a second drag the other way. Dragging back does not take a row back: the neighbour
      // that dropped kept its width, so the pair now owns more than it did and the third column can never return. Measured:
      // twelve drags back left a grid cell one column wide (41px) with a Quote in it (tier 99, page 33). Ctrl+Z is the
      // state the row was in, exactly; then the same edge, one step short of where it went wrong.
      const step = Math.max(24, Math.round(m.inner / 12) + 4); const sign = Math.sign(dx); let want = dx;
      for (let back = 0; wasBeside && back < 12 && !(await this.onOneLine(ids)); back++) {
        await page.keyboard.press('Control+z'); await page.waitForTimeout(400);
        want -= sign * step; page.__cameBack = (page.__cameBack || 0) + 1; // reported: how often the crawl asked for a share this screen cannot hold
        if (want * sign < 4) break; // nothing shorter is left to try — the row stays as it was, on one line
        await H.select(page, ids[i]); await H.dragEdge(page, 'right', want); await say(`undone, dragged ${want}px instead`);
      }
    }
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
        // THE PICKER OFFERS 1 · 2 · 3 · 4 · 6 · 12 ACROSS — twelve columns divide into those. Five is asked for by real pages
        // and is not among them: the harness found no such square, clicked nothing, and the picker sat open while the
        // build failed on "the drop added nothing" (tier 99, pages 219 and 249). A person takes the next size up and
        // deletes the cell they do not need — and that the picker has no five is reported as a gap.
        this.page.__step = `grid(${n} across)`;
        const offered = [1, 2, 3, 4, 6, 12].find((k) => k >= n) ?? 12;
        if (offered !== n) (this.page.__gaps = this.page.__gaps || []).push(`a grid of ${n} across is not in the picker (1 · 2 · 3 · 4 · 6 · 12) — built as ${offered} with ${offered - n} cell${offered - n > 1 ? 's' : ''} deleted`);
        const cell = this.page.locator(`[role="gridcell"][aria-label="${offered} across, 1 down"]`);
        await cell.click(); await this.page.waitForTimeout(700);
        const g = (await P.newestLeaf(this.page, before)).id; this.steps++;
        let cells = await kidsOf(this.page, g);
        for (const extra of cells.slice(n)) { await H.panel(this.page, false); await H.select(this.page, extra); await this.page.keyboard.press('Delete'); await this.page.waitForTimeout(400); await H.panel(this.page, true); }
        cells = (await kidsOf(this.page, g)).slice(0, n);
        const gw = await this.widthsAsDesigned(cells.slice(0, n), t.cols.slice(0, n));
        for (let c = 0; c < cells.length; c++) {
          const x = t.inner[c];
          if (c < n && gw[c] < TEXT_MIN) { await P.into(this.page, cells[c], 'Icon'); this.steps++; continue; } // a narrow cell holds an icon (#136)
          if (x && x.kind) { const a = await P.into(this.page, cells[c], 'Stack'); await this.fill(x, a, { ...ctx, firstInSection: false, sectionIndex: ctx.sectionIndex + c + 1 }); } // a whole structure in this cell (beyond the crawl)
          else if (x && x.length > 1) { const a = await P.into(this.page, cells[c], 'Stack'); const ids = await P.row(this.page, a, Array(Math.min(x.length, 4) - 1).fill('Stack')); const iw = await this.widthsAsDesigned(ids, Array(ids.length).fill(1), gw[c] ?? Infinity); for (const [k, id] of ids.entries()) await P.into(this.page, id, fitTile(iw[k], 'Text')); }
          else await P.into(this.page, cells[c], fitTile(gw[c] ?? Infinity, leafTile({ ...ctx, firstInSection: ctx.firstInSection && c === 0, inGrid: true, col: c, cols: n })));
          this.steps++;
        }
        await this.sizeColumns(cells.slice(0, n), t.cols.slice(0, n));
        lineAfter = g;
      } else {
        const c0 = await this.addLine(container, 'Stack', lineAfter);
        const ids = await P.row(this.page, c0, Array(n - 1).fill('Stack')); this.steps += n - 1;
        const rw = await this.widthsAsDesigned(ids, t.cols.slice(0, n));
        for (let c = 0; c < ids.length; c++) {
          const x = t.inner[c];
          // A NARROW column of a real page (under ~12% — a 5% column beside a 65% one) holds an ICON or a small picture, never
          // a paragraph: words there have nowhere to go, so the column grew to its longest word and pushed the neighbour to
          // the next line on every page that had one (tier 95, #136). Built as the site built it.
          if (rw[c] < TEXT_MIN) { await P.into(this.page, ids[c], 'Icon'); this.steps++; continue; }
          if (x && x.kind) { const a = await P.into(this.page, ids[c], 'Stack'); await this.fill(x, a, { ...ctx, firstInSection: false, sectionIndex: ctx.sectionIndex + c + 1 }); }
          else if (x && x.length > 1) { const a = await P.into(this.page, ids[c], 'Stack'); const inner = await P.row(this.page, a, Array(Math.min(x.length, 4) - 1).fill('Stack')); const iw = await this.widthsAsDesigned(inner, x.slice(0, inner.length), rw[c]); for (const [k, id] of inner.entries()) await P.into(this.page, id, fitTile(iw[k], 'Text')); await this.sizeColumns(inner, x); }
          else await P.into(this.page, ids[c], fitTile(rw[c], leafTile({ ...ctx, firstInSection: ctx.firstInSection && c === 0, inRow: true, col: c, cols: n })));
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
