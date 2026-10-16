// PROBE for L6-7: the page audit's tablet rule (#78) still flags a plain row of four word columns at 768, and leaves a row of the page
// on a PAGE-GRID page (held to the fit rule — G-1 #13) alone. The same flex row of four, the page with and without the grid.
//   NODE_PATH=node_modules node scripts/uat/probe-l6-audit.js
const { chromium } = require('playwright'); const { auditDoc } = require('./page-audit.js');
const LAYOUT = require('../../config/layout.json');
const rungs = { tp: LAYOUT.rungs.tabletPortrait.from, tl: LAYOUT.rungs.tabletLandscape.from };
const page4 = (display) => `<!doctype html><body style="margin:0"><div class="bx-row eu-band" style="display:${display};${display === 'grid' ? 'grid-template-columns:repeat(4,1fr)' : ''}">${[1, 2, 3, 4].map((i) => `<div class="bx-c${i}"><h3 class="bx-h${i}">Column ${i}</h3><p class="bx-p${i}">Some words here</p></div>`).join('')}</div></body>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 768, height: 900 } }); let ok = true;
  for (const [display, pageGrid, want] of [['flex', false, true], ['flex', true, false]]) {
    await p.setContent(page4(display));
    const a = await p.evaluate(auditDoc, { rowBands: true, rungs, pageGrid });
    const got = a.err.some((m) => m.startsWith('L6 tablet'));
    console.log(`${pageGrid ? 'page-grid page' : 'page without the grid'}: L6 tablet ${got ? 'FLAGGED' : 'not flagged'} — ${got === want ? 'as it should' : 'WRONG'}`); ok = ok && got === want;
  }
  // L6-8: on a phone, words beside a cell of ONE ICON is kept on purpose (G-3b (4)); words beside a 57px cell of WORDS is still squeezed
  const phone = (second) => `<!doctype html><body style="margin:0"><div class="bx-row" style="display:flex"><div class="bx-a" style="width:85%"><p class="bx-t">Our pupils learn in small classes where every teacher knows every child.</p></div><div class="bx-b" style="width:15%">${second}</div></div></body>`;
  await p.setViewportSize({ width: 375, height: 800 });
  for (const [name, second, want] of [['an icon cell', '<span class="bx-i"><svg aria-hidden="true" width="24" height="24"><circle cx="12" cy="12" r="10"/></svg></span>', false], ['a cell of words', '<p class="bx-w">More words</p>', true]]) {
    await p.setContent(phone(second));
    const got = (await p.evaluate(auditDoc, { rowBands: true, rungs })).err.some((m) => m.startsWith('L5 phone'));
    console.log(`phone, words beside ${name}: L5 ${got ? 'FLAGGED' : 'not flagged'} — ${got === want ? 'as it should' : 'WRONG'}`); ok = ok && got === want;
  }
  await b.close(); console.log(ok ? 'RESULT ok' : 'RESULT FAILED'); process.exit(ok ? 0 : 1);
})();
