// RX-3 follow-ups #2, headed, through the UI: (1) where a Mobile-chip override / "Hidden on mobile" really stops (between 440
// and 600) and where Laptop / Wide overrides start and stop; (2) Alt+F on a selected Text; (3) "Align center" in the Preview.
const path = require('path'); const H = require('../h.js'); const P = require('../pages.js').helpers; const I = require('../inspector.js');
const cls = (id) => '.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-');
const sleep = (p, ms) => p.waitForTimeout(ms);
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 820, pos: [200, 60] }); page.setDefaultTimeout(12000);
  const out = {};
  const chip = async (n) => { await page.getByRole('button', { name: n, exact: true }).first().click(); await sleep(page, 600); };
  try {
    await H.panel(page, true);
    const b = await P.first(page, 'Stack'); const a = await P.into(page, b, 'Text'); const c = await P.under(page, a, 'Text'); const d = await P.under(page, c, 'Text'); await H.panel(page, false);
    // (1) Mobile: hide a; Laptop: inner spacing on c; Wide: inner spacing on d
    await I.phoneOnly(page, a, { hideOnPhone: true });
    await H.select(page, c); await chip('Laptop (1024px)'); await I.tab(page, 'Design'); await I.section(page, 'Spacing'); await page.getByRole('slider', { name: 'Inner spacing', exact: true }).first().fill('30'); await sleep(page, 300);
    await chip('Wide (1920px)'); await H.select(page, d); await I.tab(page, 'Design'); await I.section(page, 'Spacing'); await page.getByRole('slider', { name: 'Inner spacing', exact: true }).first().fill('30'); await sleep(page, 300); await chip('Full width');
    // (2) Alt+F
    await H.select(page, d); await page.keyboard.press('Alt+f'); await sleep(page, 500); const s1 = JSON.parse(await page.evaluate(() => localStorage.getItem('educo_box_site_v1')));
    let nd = null; const w = (n) => { if (n.id === d) nd = n; (n.children || []).forEach(w); }; s1.pages.forEach((p) => w(p.root)); out.altF = { floating: nd.floating ?? null, placementShown: await page.getByRole('button', { name: 'Floating', exact: true }).first().getAttribute('aria-pressed').catch(() => null) };
    await page.keyboard.press('Control+z'); await sleep(page, 300);
    // (3) Align center on c, Content tab → Text style
    await H.select(page, c); await I.tab(page, 'Content'); await I.section(page, 'Text style'); await page.getByRole('button', { name: 'Align center', exact: true }).first().click(); await sleep(page, 400);
    const ed = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const inner = e.querySelector('p,div,span') || e; return `${getComputedStyle(e).textAlign} / inner ${getComputedStyle(inner).textAlign}`; }, c);
    await page.screenshot({ path: path.join(__dirname, 'followup2-editor.png') });
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await sleep(page, 1500);
    const at = async (wd) => { await page.setViewportSize({ width: wd, height: 820 }); await sleep(page, 220); let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth); if (inner !== wd) { await page.setViewportSize({ width: 2 * wd - inner, height: 820 }); await sleep(page, 220); f = await (await page.$('iframe')).contentFrame(); } return f; };
    const rows = [];
    for (const wd of [440, 470, 479, 480, 481, 500, 520, 560, 590, 598, 599, 600, 601, 839, 840, 1199, 1200, 1201, 1599, 1600]) {
      const f = await at(wd); rows.push(await f.evaluate(([wd, a, c, d]) => { const q = (s) => document.querySelector(s); return `${document.documentElement.clientWidth}(${wd}): a ${getComputedStyle(q(a)).display === 'none' ? 'HIDDEN' : 'shown'} · c pad ${getComputedStyle(q(c)).paddingTop} · d pad ${getComputedStyle(q(d)).paddingTop}`; }, [wd, cls(a), cls(c), cls(d)]));
    }
    out.edges = rows;
    const f = await at(1280); out.alignCenter = { editor: ed, preview: await f.evaluate((s) => { const e = document.querySelector(s); const inner = e.querySelector('p') || e; return `${getComputedStyle(e).textAlign} / inner <${inner.tagName}> ${getComputedStyle(inner).textAlign}`; }, cls(c)) };
    out.mediaRules = await f.evaluate(() => (Array.from(document.querySelectorAll('style')).map((s) => s.textContent).join('').match(/@media[^{]*\{/g) || []).filter((x, i, arr) => arr.indexOf(x) === i).slice(0, 12));
    await page.screenshot({ path: path.join(__dirname, 'followup2-preview.png') });
  } catch (e) { out.error = e.message.split('\n')[0]; await page.screenshot({ path: path.join(__dirname, 'followup2-ERROR.png') }); }
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
