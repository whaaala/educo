// PAGE GRID · RULE MAP step 2 proof: every example in docs/web-anatomy/page-grid/examples/index.html is checked in a real,
// HEADED browser at every width × text size, six windows at once (RULE Z), with a screenshot of each combination.
//   node scripts/research/page-grid-examples.js [--shots=<dir>]
// Widths: low-cost Android 360 · iPhone 375 · 412 · tablet portrait 600 · 768 · tablet landscape 900 · 1024 · 1280 · the
// user's 1536 · 1920. Text: 100 / 150 / 200 % (WCAG 1.4.4). Prints one line per failed check and a total.
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const path = require('path');
const fs = require('fs');
const PAGE = 'file:///' + path.resolve('docs/web-anatomy/page-grid/examples/index.html').replace(/\\/g, '/');
const SHOTS = (process.argv.find(a => a.startsWith('--shots=')) || '').slice(8) || null;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const WIDTHS = [360, 375, 412, 600, 768, 900, 1024, 1280, 1536, 1920];
const TEXT = [100, 150, 200];
const cases = WIDTHS.flatMap(w => TEXT.map(t => ({ w, t })));

// In the page: every check, returning [name, ok, detail]
const CHECK = () => {
  const out = []; const ok = (n, c, d = '') => out.push([n, !!c, d]);
  const R = (e) => e.getBoundingClientRect(); const px = 1.5; // tolerance in CSS px
  const cols = +getComputedStyle(document.documentElement).getPropertyValue('--cols');
  const ex = (k) => document.querySelector(`[data-ex="${k}"]`);
  // the line positions of a band: c i, m i, ce i, from its computed tracks
  const lines = (band) => {
    const t = getComputedStyle(band).gridTemplateColumns.replace(/\[[^\]]*\]/g, ' ').trim().split(/\s+/).map(parseFloat); /* skip [line names] */ const x0 = R(band).left;
    const L = { full0: x0, c: [], m: [], ce: [] }; let x = x0 + t[0]; L.content0 = x;
    for (let i = 0; i < cols; i++) { L.c.push(x); x += t[1 + i * 3]; L.m.push(x); x += t[2 + i * 3]; L.ce.push(x); x += (i < cols - 1 ? t[3 + i * 3] : 0); }
    L.full1 = R(band).right; return L;
  };
  const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth;
  ok('no sideways scroll', sw <= cw + 1, `${sw} > ${cw}`);
  ok('columns per rung (6 phone / 12 from 600px)', cols === (innerWidth < 600 ? 6 : 12), `cols ${cols} at ${innerWidth}`);
  for (const c of document.querySelectorAll('.cell')) if (c.offsetParent && c.scrollWidth > c.clientWidth + 1) { ok('no word cut in a cell', false, `${c.closest('[data-ex]').dataset.ex}: "${c.textContent.trim().slice(0, 30)}" ${c.scrollWidth}>${c.clientWidth}`); break; }
  // a block's SLOT (its box plus its own spacing) sits on the lines — the page grid has no gap (the user, 2026-10-03)
  const slot = (e) => { const r = R(e), s = getComputedStyle(e); return { left: r.left - parseFloat(s.marginLeft), right: r.right + parseFloat(s.marginRight), top: r.top, bottom: r.bottom }; };
  const at = (e, side, x) => Math.abs(slot(e)[side] - x) <= px;
  // A13 splits: on 12, each child's edges are on its lines; on the phone, each spans the content
  const want = { '6+6': [[1, 6], [7, 12]], '4+4+4': [[1, 4], [5, 8], [9, 12]], '4+8': [[1, 4], [5, 12]], '5+7': [[1, 5], [6, 12]], '3+9': [[1, 3], [4, 12]], '3+3+3+3': [[1, 3], [4, 6], [7, 9], [10, 12]] };
  // EVEN COLUMNS on every device (the user, 2026-10-03): the count, every column the same width, every gap the same
  { const L = lines(ex('A13:6+6')); const w = L.c.map((c, i) => L.ce[i] - c); const g = L.c.slice(1).map((c, i) => c - L.ce[i]);
    ok('columns all the same width', w.every(x => Math.abs(x - w[0]) <= 0.5), w.map(x => x.toFixed(1)).join(' '));
    ok('gaps all the same width', g.every(x => Math.abs(x - g[0]) <= 0.5), g.map(x => x.toFixed(1)).join(' '));
    ok('half-line on the middle of each column', L.m.every((m, i) => Math.abs(m - (L.c[i] + L.ce[i]) / 2) <= 0.5)); }
  for (const [k, spans] of Object.entries(want)) {
    const band = ex('A13:' + k); const L = lines(band); const kids = [...band.children].filter(e => !e.classList.contains('label'));
    if (cols === 6) { ok(`${k} stacks on the phone`, kids.every(e => at(e, 'left', L.c[0]) && at(e, 'right', L.ce[5])) && kids.every((e, i) => !i || R(e).top >= R(kids[i - 1]).bottom - px)); continue; }
    // always on SOME column lines, never overlapping; the words decide when the row goes 2 across or stacks (#24)
    ok(`${k} on column lines`, kids.every(e => L.c.some(c => Math.abs(slot(e).left - c) <= px) && L.ce.some(c => Math.abs(slot(e).right - c) <= px)), kids.map(e => Math.round(slot(e).left) + '–' + Math.round(slot(e).right)).join(' '));
    ok(`${k} no two blocks overlap`, kids.every((a, i) => kids.every((b, j) => j <= i || R(a).right <= R(b).left + px || R(b).right <= R(a).left + px || R(a).bottom <= R(b).top + px || R(b).bottom <= R(a).top + px)));
    // at normal text on a desktop, exactly the split that was asked for
    if (innerWidth >= 1280 && parseFloat(getComputedStyle(document.documentElement).fontSize) === 16)
      ok(`${k} as asked on desktop`, kids.every((e, i) => at(e, 'left', L.c[spans[i][0] - 1]) && at(e, 'right', L.ce[spans[i][1] - 1])), `wrap at ${band.dataset.wrapEm} em`);
  }
  { const g = document.getElementById('guides'); const m = document.querySelector('main'); ok('row lines run the whole page', /gradient/.test(getComputedStyle(g, '::before').maskImage || getComputedStyle(g, '::before').webkitMaskImage) && Math.abs(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--doc-h')) - (m.offsetTop + m.offsetHeight)) <= 2, `${getComputedStyle(document.documentElement).getPropertyValue('--doc-h')} vs ${m.offsetTop + m.offsetHeight}`); } /* the guides are hidden until G — read the height they are given, not their box (ledger #27) */
  { const b = ex('A7:offset+empty'); const L = lines(b); const toc = b.querySelector('.toc'), body = b.querySelector('.body7');
    ok('offset start + empty column', cols === 6 ? at(body, 'left', L.c[0]) : at(toc, 'right', L.ce[3]) && at(body, 'left', L.c[5])); }
  { const b = ex('A8:inset-8'); const L = lines(b); const e = b.querySelector('.inset8'); ok('inset 8 of 12', cols === 6 ? at(e, 'left', L.c[0]) : at(e, 'left', L.c[2]) && at(e, 'right', L.ce[9])); }
  { const b = ex('A7:half-step'); const L = lines(b); const e = b.querySelector('.half'); ok('half-step on the middle lines', cols === 6 ? at(e, 'left', L.m[1]) && at(e, 'right', L.m[4]) : at(e, 'left', L.m[3]) && at(e, 'right', L.m[7])); }
  { const e = document.getElementById('minspan'); ok('the words decide the span (word fits, span ≥ 1)', e.scrollWidth <= e.clientWidth + 1 && +e.dataset.span >= 1, `span ${e.dataset.span}`); }
  { const five = ex('A8:five-across').querySelector('.five'); const k = [...five.children]; const w = R(k[0]).width; ok('5 across: equal columns', k.every(e => Math.abs(R(e).width - w) <= px)); }
  { const e = ex('A10:block-full-bleed').querySelector('.bleed-full'); ok('block full-bleed reaches both edges', Math.abs(R(e).left) <= px && Math.abs(R(e).right - document.documentElement.clientWidth) <= px); }
  { const b = ex('A10:half-bleed'); const L = lines(b); const e = b.querySelector('.bleed-half'); ok('half-bleed: window edge → column line', Math.abs(R(e).left) <= px && (cols === 6 ? Math.abs(R(e).right - document.documentElement.clientWidth) <= px : at(e, 'right', L.ce[5]))); }
  { const prev = ex('A10:straddle-before'), s = document.getElementById('straddle'); const lap = R(prev).bottom - R(s).top; const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    ok('straddle overlaps the section above by 3rem', Math.abs(lap - 3 * rem) <= px, `${lap.toFixed(1)} vs ${3 * rem}`);
    ok('straddle sits on top', document.elementFromPoint(R(s).left + 5, R(s).top + 5) && s.contains(document.elementFromPoint(R(s).left + 5, R(s).top + 5)) || R(s).top < 0 || R(s).top > innerHeight); }
  { const b = ex('A11:subgrid'); const a = b.querySelector('.nest > .a'), ruler = b.querySelector('.ruler'); ok('nested split on the page lines (subgrid)', at(a, 'left', slot(ruler).left) && at(a, 'right', slot(ruler).right), /* slot vs slot (ledger #31) */ `${Math.round(R(a).right)} vs ${Math.round(R(ruler).right)}`); }
  { const st = [...ex('A22:stats-keep-3').children].filter(e => !e.classList.contains('label')); ok('stats keep 3 across on the phone', st.every(e => Math.abs(R(e).top - R(st[0]).top) <= px)); }
  { const p = ex('A22:hide-on-phone').querySelector('.hide-phone'); ok('picture hidden on the phone only', cols === 6 ? getComputedStyle(p).display === 'none' : getComputedStyle(p).display !== 'none'); }
  { const po = ex('Q5:page-order'), pf = ex('Q5:picture-first'); const w1 = po.querySelector('.words'), p1 = po.querySelector('.pic'), w2 = pf.querySelector('.words'), p2 = pf.querySelector('.pic');
    if (cols === 6) { ok('phone: page order keeps words first', R(w1).top < R(p1).top); ok('phone: "picture first" puts the picture first', R(p2).top < R(w2).top); } }
  { const o = [...ex('A8:orphans').children].filter(e => !e.classList.contains('label')); ok('the last row keeps its span', Math.abs(R(o[3]).width - R(o[0]).width) <= px); }
  { const r = ex('A15:rtl'); const k = [...r.children].filter(e => !e.classList.contains('label')); ok('right to left mirrors', cols === 6 ? true : R(k[0]).left > R(k[1]).left); }
  return out;
};

(async () => {
  const queue = [...cases]; const fails = []; let checks = 0;
  const worker = async (n) => {
    const browser = await chromium.launch({ headless: false, channel: 'chrome', args: [`--window-position=${(n % 3) * 640},${Math.floor(n / 3) * 520}`, '--window-size=640,520'] });
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    while (queue.length) {
      const { w, t } = queue.shift();
      await p.setViewportSize({ width: w, height: 900 });
      await p.goto(PAGE); await p.evaluate((t) => { document.documentElement.style.fontSize = t + '%'; dispatchEvent(new Event('resize')); }, t);
      await p.waitForTimeout(300); await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); // settled, even in a hidden window (#33)
      const res = await p.evaluate(CHECK); checks += res.length;
      for (const [name, ok, d] of res) if (!ok) fails.push(`${w}px · ${t}% · ${name}${d ? ' — ' + d : ''}`);
      // guides: G shows them, one span per column
      await p.keyboard.press('g'); const g = await p.evaluate(() => ({ on: getComputedStyle(document.getElementById('guides')).display !== 'none', n: document.querySelectorAll('#guides span').length, cols: +getComputedStyle(document.documentElement).getPropertyValue('--cols') }));
      checks++; if (!g.on || g.n !== g.cols) fails.push(`${w}px · ${t}% · guides toggle — on ${g.on}, ${g.n} spans for ${g.cols} columns`);
      if (SHOTS) await p.screenshot({ path: `${SHOTS}/ex-${w}-${t}.jpg`, type: 'jpeg', quality: 55, fullPage: true });
      console.log(`[w${n}] ${w}px ${t}% — ${res.filter(r => !r[1]).length} failed of ${res.length + 1}`);
    }
    await browser.close();
  };
  await Promise.all(Array.from({ length: 6 }, (_, n) => worker(n)));
  console.log(`\n${checks} checks over ${cases.length} combinations; ${fails.length} failed`);
  for (const f of fails) console.log('  FAIL ' + f);
})();
