// HEADED UAT — D3-16 / D3-18: Reset asks first and can be undone; the shared confirmation is a real dialog. Six windows:
// the Reset dialog in each editor theme (Light · Dark · Midnight · Purple), Delete page (the other user of the modal), a 375 phone.
//   NODE_PATH=node_modules BASE=http://localhost:3200 node scripts/uat/uat-d3-reset-headed.js
const path = require('path'); const fs = require('fs'); const H = require('./h.js'); const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-d3'); fs.mkdirSync(OUT, { recursive: true });
const pages = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || '{}').pages?.length ?? 0);
async function theme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
const CASES = [
  { k: 'Light' }, { k: 'Dark' }, { k: 'Midnight' }, { k: 'Purple' }, { k: 'Phone', w: 375, h: 812 }, { k: 'DeletePage' },
];
(async () => {
  const res = await Promise.all(CASES.map(async (c, i) => {
    const { browser, page, errs } = await H.open({ headed: true, w: c.w || 1280, h: c.h || 800, pos: [(i % 3) * 420, Math.floor(i / 3) * 440] });
    const out = [];
    const ok = (name, pass, got = '') => out.push(`${pass ? 'PASS' : 'FAIL'} ${c.k}: ${name}${got !== '' ? ` (${got})` : ''}`);
    try {
      if (c.k !== 'Phone' && c.k !== 'DeletePage') await theme(page, c.k);
      await page.getByRole('button', { name: 'Add page' }).click(); await page.waitForTimeout(500);
      ok('a second page added through the UI', (await pages(page)) === 2, await pages(page));
      if (c.k === 'DeletePage') {
        await page.getByRole('button', { name: 'Page settings' }).click(); await page.waitForTimeout(300);
        await page.getByRole('button', { name: /Delete/ }).first().click(); await page.waitForTimeout(400);
        const d = page.getByRole('alertdialog', { name: 'Delete this page?' });
        ok('Delete page opens a named dialog', await d.isVisible());
        ok('…its item card still shows the page', await d.getByText('/', { exact: false }).first().isVisible().catch(() => false));
        await page.screenshot({ path: path.join(OUT, 'DeletePage.png') });
        await page.keyboard.press('Escape'); await page.waitForTimeout(300);
        ok('Escape closes it and nothing is deleted', !(await d.isVisible()) && (await pages(page)) === 2);
      } else {
        await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.waitForTimeout(400);
        const d = page.getByRole('alertdialog', { name: 'Start the whole site over?' });
        ok('Reset opens a named dialog, nothing changed yet', (await d.isVisible()) && (await pages(page)) === 2);
        ok('focus is on Cancel', await d.getByRole('button', { name: 'Cancel' }).evaluate((e) => e === document.activeElement));
        ok('no empty item card', !(await d.locator('p:empty').count()), await d.locator('p:empty').count());
        await page.screenshot({ path: path.join(OUT, `Reset-${c.k}.png`) });
        await page.keyboard.press('Enter'); await page.waitForTimeout(400); // Enter on the focused Cancel
        ok('Enter on Cancel closes it, both pages kept', !(await d.isVisible()) && (await pages(page)) === 2);
        await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.waitForTimeout(300);
        await page.keyboard.press('Escape'); await page.waitForTimeout(400);
        ok('Escape closes it, both pages kept (D3-19)', !(await d.isVisible()) && (await pages(page)) === 2);
        await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.waitForTimeout(300);
        await d.getByRole('button', { name: 'Start over' }).click(); await page.waitForTimeout(500);
        ok('Start over → one starter page', (await pages(page)) === 1, await pages(page));
        await page.keyboard.press('Control+z'); await page.waitForTimeout(500);
        ok('Ctrl+Z → both pages back', (await pages(page)) === 2, await pages(page));
        await page.reload(); await page.waitForTimeout(1500);
        ok('after a reload the restored site is still there', (await pages(page)) === 2, await pages(page));
        // The restored site in the real Preview, at every device and both sides of every breakpoint (RULE Z)
        if (c.k === 'Light') {
          await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1000); await page.keyboard.press('h');
          const bad = [];
          for (const s of SCREENS) { await page.setViewportSize({ width: s.w, height: s.h }); await page.waitForTimeout(150);
            const f = await (await page.$('iframe')).contentFrame(); const side = await f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            if (side > 0) bad.push(`${s.label}: ${side}px sideways`); }
          ok(`the restored site's Preview at all ${SCREENS.length} screens: no sideways scroll`, !bad.length, bad.slice(0, 3).join(' · '));
        }
      }
      ok('no page errors', !errs.length, errs.join(' | '));
    } catch (e) { out.push(`FAIL ${c.k}: ${e.message.split('\n')[0]}`); await page.screenshot({ path: path.join(OUT, `fail-${c.k}.png`) }).catch(() => {}); }
    finally { await browser.close(); }
    return out.join('\n');
  }));
  const all = res.join('\n'); console.log(all); console.log(`${(all.match(/^PASS/gm) || []).length} passed, ${(all.match(/^FAIL/gm) || []).length} failed`);
})();
