// THE COMBINATIONS — every PAIR of (page type · header · hamburger · sidebar · hero · theme) on at least one dressed page,
// generated (greedy all-pairs), never picked by hand (RULE Q). Each page's BODY is a real crawled page of that type,
// rotating through them so different real structures are built. Writes page-plan.json.
//   node scripts/uat/page-plan.js [--bodysections=4]
const fs = require('fs'); const path = require('path'); const G = require('./layout-grammar.js');
const FACTORS = {
  type: ['home', 'about', 'contact', 'blog-index', 'article', 'services', 'legal', 'work-index', 'pricing', 'faq', 'events', 'careers', 'team', 'admissions'],
  header: ['scrolls', 'sticky', 'two-rows'],
  hamburger: [true, false],
  sidebar: ['none', 'right', 'left', 'right-sticky'],
  hero: ['split', 'banner', 'photo', 'carousel', 'none'],
  theme: ['Light', 'Dark', 'Midnight', 'Purple Dream'],
};
const names = Object.keys(FACTORS);
/** Greedy all-pairs: keep adding the row that covers the most still-uncovered pairs. */
function allPairs() {
  const need = new Set();
  for (let a = 0; a < names.length; a++) for (let b = a + 1; b < names.length; b++) for (const x of FACTORS[names[a]]) for (const y of FACTORS[names[b]]) need.add(`${a}=${x}|${b}=${y}`);
  const rows = []; let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  while (need.size) {
    let best = null, bestGain = -1;
    for (let tries = 0; tries < 60; tries++) {
      const row = names.map((n) => FACTORS[n][Math.floor(rnd() * FACTORS[n].length)]);
      // seed with an uncovered pair so every try makes progress
      const first = [...need][Math.floor(rnd() * Math.min(need.size, 40))]; const [[a, x], [b, y]] = first.split('|').map((s) => s.split('='));
      const val = (i, v) => FACTORS[names[i]].find((q) => String(q) === v);
      row[+a] = val(+a, x); row[+b] = val(+b, y);
      let gain = 0; for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) if (need.has(`${i}=${row[i]}|${j}=${row[j]}`)) gain++;
      if (gain > bestGain) { bestGain = gain; best = row; }
    }
    for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) need.delete(`${i}=${best[i]}|${j}=${best[j]}`);
    rows.push(Object.fromEntries(names.map((n, i) => [n, best[i]])));
  }
  return rows;
}
// Articles and legal pages rarely open with a big hero — a hero there is kept, but "none" is what real ones do most.
const rows = allPairs();
const pages = G.loadPages().filter((p) => p.layout);
const byType = {}; for (const p of pages) (byType[p.type] = byType[p.type] || []).push(p);
const N = +(process.argv.find((a) => a.startsWith('--bodysections='))?.slice(15) ?? 4);
const used = {};
const plan = rows.map((r, i) => {
  const pool = (byType[r.type] || byType.other).filter((p) => G.parsePage(p.layout).length >= 3);
  const src = pool[((used[r.type] = (used[r.type] ?? -1) + 1) * 37) % pool.length];
  const secs = G.parsePage(src.layout);
  // the crawled page's first section is its hero and its last its footer — ours are built by the Dresser
  const body = secs.slice(1, secs.length > 3 ? -1 : undefined).slice(0, N);
  return { idx: i, ...r, source: `${src.site}/${src.page}`, sourceType: src.type, bodyLayout: body.map((s) => `${s.width}|${JSON.stringify(s.tree)}`).length, body };
});
fs.writeFileSync(path.join(__dirname, 'page-plan.json'), JSON.stringify(plan, null, 1));
console.log(`${plan.length} dressed pages cover every pair of: ${names.map((n) => `${n} (${FACTORS[n].length})`).join(' · ')}`);
plan.slice(0, 12).forEach((r) => console.log(`  ${String(r.idx).padStart(2)} ${r.type.padEnd(10)} header:${r.header.padEnd(8)} ☰:${String(r.hamburger).padEnd(5)} sidebar:${r.sidebar.padEnd(12)} hero:${r.hero.padEnd(8)} ${r.theme.padEnd(12)} body from ${r.source} (${r.body.length} sections)`));
