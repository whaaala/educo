// A-1 probe: in the Preview, does the control bar cover the top of the page? (seen in A-preview-1280.png)
const H = require('./h.js'); const path = require('path');
(async () => {
  for (const [w, h] of [[1280, 900], [1536, 864], [768, 1024], [390, 844]]) {
    const { browser, page } = await H.open({ headed: true, w, h });
    await H.panel(page, true); await H.clickTile(page, 'Heading'); await H.panel(page, false);
    const prev = page.getByRole('button', { name: 'Preview', exact: true }).first(); await prev.click();
    await page.waitForSelector('iframe[title="Site preview"]'); await page.waitForTimeout(2500);
    const m = await page.evaluate(() => { const f = document.querySelector('iframe[title="Site preview"]').getBoundingClientRect(); const exit = [...document.querySelectorAll('button')].find((b) => /Exit preview/.test(b.textContent)).getBoundingClientRect();
      const doc = document.querySelector('iframe[title="Site preview"]').contentDocument; const hd = doc.querySelector('h1,h2,h3').getBoundingClientRect();
      return { frameTop: Math.round(f.top), exitBottom: Math.round(exit.bottom), headingTopOnScreen: Math.round(f.top + hd.top), scrollY: doc.scrollingElement.scrollTop, topElem: document.elementFromPoint(innerWidth / 2, Math.round(f.top + hd.top + 4))?.tagName }; });
    console.log(`${w}x${h}`, JSON.stringify(m));
    await page.screenshot({ path: path.join(__dirname, 'a1-out', `probe-previewtop-${w}.png`) });
    await browser.close();
  }
})();
