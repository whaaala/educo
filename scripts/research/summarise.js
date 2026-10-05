// THE LIGHT SUMMARY — one line per crawled page, the only crawl output kept in the repo.
// Reads the raw crawl archive (outside the repo) and writes docs/layout-benchmark/pages.tsv (~1MB for 4,000 pages).
//   node scripts/research/summarise.js [--from=C:/Users/eyite/educo-uat-harness/sites]
const fs = require('fs'); const path = require('path');
const FROM = (process.argv.find((a) => a.startsWith('--from=')) || '').slice(7) || 'C:/Users/eyite/educo-uat-harness/sites';
const OUT = path.join(__dirname, '..', '..', 'docs', 'layout-benchmark', 'pages.tsv');
const source = (host) => /\.webflow\.io$/.test(host) ? 'webflow' : /\.framer\.(website|app)$/.test(host) ? 'framer' : 'awwwards';
const clean = (s) => String(s ?? '').replace(/[\t\n\r]+/g, ' ').trim();
const cols = ['source', 'category', 'site', 'page', 'type', 'lang', 'landmarks', 'h1', 'headings', 'header', 'hamburger', 'sidebars', 'components', 'sections', 'breakpoints', 'layout'];
const rows = [cols.join('\t')];
/** The INSIDE layout of each section (skeleton.js), in page order: `width|layout[|sticky]` per section, joined by " > ". */
const skeleton = (dir, f) => {
  try {
    const k = JSON.parse(fs.readFileSync(path.join(dir, f.replace('.anatomy.json', '.skeleton.json')), 'utf8'));
    return k.sections.map((x) => `${x.width}|${x.layout}${x.sticky ? '|sticky' : ''}`).join(' > ');
  } catch { return ''; }
};
let sites = 0, pages = 0;
for (const host of fs.readdirSync(FROM).sort()) {
  const dir = path.join(FROM, host);
  if (!fs.statSync(dir).isDirectory()) continue;
  let idx = {}; try { idx = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8')); } catch { /* no index: still summarise the pages */ }
  sites++;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.anatomy.json')).sort()) {
    let a; try { a = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { continue; }
    const D = a.D || {}; const sem = D.semantics || {};
    const landmarks = ['header', 'nav', 'main', 'aside', 'footer'].filter((k) => sem[k]).map((k) => (sem[k] > 1 ? `${k}×${sem[k]}` : k)).join(',');
    const heads = D.headings || [];
    const h = D.header ? [D.header.position, D.header.transparent ? 'transparent' : '', D.header.rows > 1 ? `${D.header.rows}rows` : ''].filter(Boolean).join('+') : '';
    const side = (D.sidebars || []).map((s) => `${s.side}${s.widthPct ? s.widthPct + '%' : ''}${s.sticky ? '+sticky' : ''}`).join(',');
    const comps = Object.entries(D.components || {}).filter(([, v]) => (Array.isArray(v) ? v.length : v)).map(([k, v]) => (typeof v === 'number' && v > 1 ? `${k}×${v}` : k)).join(',');
    const sections = (D.outline || []).map((o) => String(o).split(' @')[0]).join('>');
    rows.push([source(host), idx.category || '', host, f.replace('.anatomy.json', ''), a.type || '', D.lang || '', landmarks,
      heads.filter((x) => String(x).startsWith('H1')).length, heads.length, h, D.hamburger ? 'yes' : '', side, comps, sections,
      (D.breakpoints || []).length, skeleton(dir, f)].map(clean).join('\t'));
    pages++;
  }
}
fs.writeFileSync(OUT, rows.join('\n') + '\n');
console.log(`${sites} sites, ${pages} pages → ${path.relative(process.cwd(), OUT)} (${Math.round(fs.statSync(OUT).size / 1024)} KB)`);
