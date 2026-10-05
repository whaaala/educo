// PAGE GRID research (R-3, gap G10): what a desktop row does on a TABLET (768) and a PHONE (375) on real pages.
// Reads the skeletons the crawl stored (<page>.skeleton.json at 1440) and the ones `skeleton.js --widths=768,375` adds
// (<page>.skeleton-768.json / -375.json), pairs the sections of each page in order, and for every section whose
// desktop layout is N across (a row / grid of N ≥ 2) records what it is at 768 and 375: the same N (KEEPS), fewer but
// still side by side (FEWER), or one column (STACKS). Prints the shares per N and how they moved as pages were added
// (saturation: the shares after 100 / 200 / all pages).
//   node scripts/research/grid-rungs.js
const fs = require('fs'); const path = require('path');
const STORE = 'C:/Users/eyite/educo-uat-harness/sites';
// a section's "across": the first row/grid at its top level, else the widest row inside it
const across = (layout) => {
  if (!layout) return 1;
  const top = /^(row|grid)(\d+)/.exec(layout); if (top) return +top[2];
  let best = 1; for (const m of layout.matchAll(/(row|grid)(\d+)/g)) best = Math.max(best, +m[2]); return best;
};
const pages = [];
for (const h of fs.readdirSync(STORE)) {
  const dir = path.join(STORE, h); if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.skeleton-375.json'))) {
    const base = f.replace('.skeleton-375.json', '');
    try {
      const D = JSON.parse(fs.readFileSync(path.join(dir, base + '.skeleton.json'), 'utf8'));
      const T = JSON.parse(fs.readFileSync(path.join(dir, base + '.skeleton-768.json'), 'utf8'));
      const M = JSON.parse(fs.readFileSync(path.join(dir, base + '.skeleton-375.json'), 'utf8'));
      pages.push({ h, D: D.sections, T: T.sections, M: M.sections, t: fs.statSync(path.join(dir, f)).mtimeMs });
    } catch { /* a page missing one of its three skeletons is skipped */ }
  }
}
pages.sort((a, b) => a.t - b.t); // in the order they were measured, for the saturation view
const tally = (list) => {
  const T = {};
  for (const p of list) {
    const n = Math.min(p.D.length, p.T.length, p.M.length);
    for (let i = 0; i < n; i++) {
      const d = across(p.D[i].layout); if (d < 2) continue;
      const k = d >= 5 ? '5+' : String(d); T[k] = T[k] || { n: 0, T: { keeps: 0, fewer: 0, stacks: 0, more: 0 }, M: { keeps: 0, fewer: 0, stacks: 0, more: 0 } };
      T[k].n++;
      for (const [rung, s] of [['T', p.T[i]], ['M', p.M[i]]]) { const a = across(s.layout); T[k][rung][a === d ? 'keeps' : a > d ? 'more' : a >= 2 ? 'fewer' : 'stacks']++; }
    }
  }
  return T;
};
const pct = (x, n) => (n ? Math.round(100 * x / n) : 0) + '%';
const show = (T, label) => {
  console.log(`\n${label}`);
  console.log('desktop across | sections | TABLET 768: keeps · fewer · stacks | PHONE 375: keeps · fewer · stacks');
  for (const k of ['2', '3', '4', '5+']) { const r = T[k]; if (!r) continue;
    console.log(`  ${k.padEnd(13)}| ${String(r.n).padStart(8)} | ${pct(r.T.keeps, r.n)} · ${pct(r.T.fewer, r.n)} · ${pct(r.T.stacks, r.n)} | ${pct(r.M.keeps, r.n)} · ${pct(r.M.fewer, r.n)} · ${pct(r.M.stacks, r.n)}`); }
};
console.log(`pages with all three widths: ${pages.length}`);
for (const cut of [100, 200]) if (pages.length > cut) show(tally(pages.slice(0, cut)), `after the first ${cut} pages`);
show(tally(pages), `all ${pages.length} pages`);
