// LE-1 probe: "+ Add a block inside" ×3 on a Stack, built through the UI — the tree and the selection after each click.
const H = require('./h.js'); const X = require('./uat-rx3-headed.js'); const { band, at, ins, sleep } = X;
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 860 });
  const host = await band(page, 'Stack'); await at(page, host, 'Layout');
  const dump = async (tag) => { const s = await page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1'))); const sel = await H.selected(page);
    const walk = (n, d) => [`${'  '.repeat(d)}${n.id.slice(-4)}${n.id === sel ? ' *SEL*' : ''} ${n.type}${n.rowBand ? ' band' : ''}${n.bare ? ' bare' : ''}`].concat((n.children || []).flatMap((c) => walk(c, d + 1)));
    console.log(tag, 'host', host.slice(-4)); console.log(walk(s.pages[0].root, 0).join('\n')); };
  await dump('before');
  for (let i = 1; i <= 3; i++) { await ins(page).getByRole('button', { name: /Add a block inside/ }).first().click(); await sleep(page, 900); await dump('after ' + i); }
  await browser.close();
})();
