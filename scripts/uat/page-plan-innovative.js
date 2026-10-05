// BEYOND THE CRAWL — the structures no crawled site used, written in the crawl's own grammar (layout-grammar.js) with one
// extension: a column may hold a WHOLE structure, "(stack2{·,grid2[50/50]})". Enumerated from a small set of building
// blocks rather than picked one by one (RULE Q): every DEEP nesting × every asymmetric band × the magazine shapes, each
// dressed like any other page (header · hero · sidebar · theme rotating). Writes page-plan-innovative.json.
//   node scripts/uat/page-plan-innovative.js
const fs = require('fs'); const path = require('path'); const G = require('./layout-grammar.js');

// DEEP NESTING: a grid in a stack in a grid cell, a row in a grid cell in a row, a stack of grids in a column…
const DEEP = [
  'contained|grid3[30/30/30](·)(stack2{·,grid2[50/50]})(·)',                 // grid in a stack in a grid cell
  'full|row2[60/40](grid2[50/50])(stack3{·,row2[50/50],·})',                 // grid in a row column · row in a stack in a column
  'contained|grid2[65/35](stack2{grid3[33/33/33],·})(stack2{·,row2[50/50]})', // stack of a grid, beside a stack of a row
  'contained|row3[25/50/25](stack2{·,·})(grid2[50/50](stack2{·,·})(·))(stack2{·,·})', // grid cells holding stacks, inside a row column
  'full|grid4[25/25/25/25](·)(row2[50/50])(stack2{·,·})(grid2[50/50])',      // one of each kind in the cells of one grid
  'contained|stack3{row2[35/65](·)(grid3[33/33/33]),grid2[50/50](stack2{·,row2[50/50]})(·),row3[33/33/33]}', // three lines, each nested differently
];
// ASYMMETRIC BANDS: shares no template offers, edge to edge and contained
const ASYM = [
  'full|row2[85/15]', 'full|row2[15/85]', 'contained|row3[20/60/20]', 'contained|row3[10/30/60]',
  'full|row4[40/20/20/20]', 'contained|grid3[50/25/25]', 'contained|grid5[20/20/20/20/20]', 'full|row2[70/30](stack3{·,·,·})(·)',
];
// MAGAZINE: featured + sidebar columns, dense card grids, a lead story over a strip
const MAG = [
  'contained|row3[60/20/20](stack2{·,·})(stack3{·,·,·})(stack3{·,·,·})',
  'contained|grid4[25/25/25/25]x3',
  'contained|stack2{row2[65/35](stack2{·,·})(stack2{·,·}),grid3[33/33/33]x2}',
  'contained|row2[30/70](stack4{·,·,·,·})(grid2[50/50]x2)',
  'full|stack2{grid3[33/33/33],row3[50/25/25]}',
];
const header = ['scrolls', 'sticky', 'two-rows'], sidebar = ['none', 'right', 'right-sticky', 'left'], hero = ['banner', 'split', 'none', 'photo'], theme = ['Light', 'Dark', 'Midnight', 'Purple Dream'];
const types = ['home', 'about', 'services', 'blog-index', 'work-index', 'events'];
const plan = [];
[...DEEP.map((s) => ['deep', s]), ...ASYM.map((s) => ['asymmetric', s]), ...MAG.map((s) => ['magazine', s])].forEach(([family, s], i) => {
  const body = G.parsePage(s); // one section per page: the shape is the point; the dresser adds header, hero, CTA, footer
  // …and a second body section so the shape sits BETWEEN ordinary ones, as on a real page
  const plain = G.parsePage('contained|stack2{·,row2[50/50]}');
  plan.push({ idx: i, family, type: types[i % types.length], header: header[i % 3], hamburger: i % 2 === 1, sidebar: sidebar[Math.floor(i / 3) % 4], hero: hero[i % 4], theme: theme[Math.floor(i / 2) % 4], source: `innovative/${family}-${i}`, shape: s, body: [...body, ...plain] });
});
fs.writeFileSync(path.join(__dirname, 'page-plan-innovative.json'), JSON.stringify(plan, null, 1));
console.log(`${plan.length} dressed pages beyond the crawl → page-plan-innovative.json`);
