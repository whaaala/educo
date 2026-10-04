// PAGE GRID research (R-3): what column splits do the 4,250 crawled pages use, and how well do they land on a page grid?
// Reads the `layout` field of docs/layout-benchmark/pages.tsv (e.g. "inset|stack2{·,row2[55/25]} > full|grid3[33/33/33]"),
// takes every row / grid with its widths (% of its parent), normalises them to fill the row (gaps are what is left), and
// snaps each part to 12ths, half-12ths and 8ths. Prints the most common splits and how many fit each grid.
//   node scripts/research/grid-splits.js
const fs = require('fs');
const rows = fs.readFileSync('docs/layout-benchmark/pages.tsv', 'utf8').split('\n').slice(1).filter(Boolean).map(l => l.split('\t'));
const splits = {}; const fit = { n: 0, w12: 0, h12: 0, w8: 0, w4: 0, w6: 0 }; const counts = {}; const sect = { full: 0, inset: 0 };
const near = (x, step, tol) => Math.abs(x / step - Math.round(x / step)) * step <= tol;
for (const r of rows) {
  const lay = r[15] || '';
  for (const s of lay.split(' > ')) { const m = /^(full|inset)\|/.exec(s); if (m) sect[m[1]]++; }
  for (const m of lay.matchAll(/(row|grid)(\d+)\[([\d/]+)\]/g)) {
    const parts = m[3].split('/').map(Number); if (parts.length < 2 || parts.some(p => !p)) continue;
    const sum = parts.reduce((a, b) => a + b, 0);
    const twelfths = parts.map(p => (p / sum) * 12);
    const key = twelfths.map(t => Math.round(t * 2) / 2).join('+');
    splits[key] = (splits[key] || 0) + 1; counts[parts.length] = (counts[parts.length] || 0) + 1;
    fit.n++;
    const all = (step, tol) => twelfths.every(t => near(t, step, tol));
    if (all(1, 0.3)) fit.w12++; if (all(0.5, 0.15)) fit.h12++; if (all(1.5, 0.3)) fit.w8++; if (all(3, 0.45)) fit.w4++; if (all(2, 0.3)) fit.w6++;
  }
}
const pct = (x) => (100 * x / fit.n).toFixed(1) + '%';
console.log(`pages ${rows.length} · rows/grids with widths ${fit.n} · sections full ${sect.full} / inset ${sect.inset}`);
console.log('parts per row:', JSON.stringify(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10)));
console.log(`fit (every part on the step): whole 12ths ${pct(fit.w12)} · half 12ths ${pct(fit.h12)} · 8 columns (1.5/12) ${pct(fit.w8)} · 6 columns ${pct(fit.w6)} · 4 columns ${pct(fit.w4)}`);
const top = Object.entries(splits).sort((a, b) => b[1] - a[1]); let cum = 0;
console.log('top splits, in 12ths (rounded to halves), share and running total:');
for (const [k, v] of top.slice(0, 40)) { cum += v; console.log(`  ${k.padEnd(28)} ${String(v).padStart(5)}  ${pct(v).padStart(6)}  ${pct(cum).padStart(6)}`); }
console.log(`distinct splits: ${top.length}; covering 80%: ${(() => { let c = 0, i = 0; while (c < 0.8 * fit.n) c += top[i++][1]; return i; })()}`);
