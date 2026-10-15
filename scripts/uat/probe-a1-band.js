// A-1 harness probe: what is selected and which Inspector sections show after "Add a band".
const H = require('./h.js'); const path = require('path');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1280, h: 900 });
  await page.getByRole('button', { name: 'Add a band' }).first().click(); await page.waitForTimeout(1200);
  const s = await page.evaluate(() => ({
    tabs: [...document.querySelectorAll('[role=tab]')].map((t) => t.textContent.trim()),
    sections: [...document.querySelectorAll('button[aria-expanded]')].map((b) => `${b.textContent.trim().slice(0, 30)}=${b.getAttribute('aria-expanded')}`).slice(0, 30),
    inputs: [...document.querySelectorAll('input[type=file]')].map((i) => i.getAttribute('aria-label')),
    selected: document.querySelectorAll('[aria-selected="true"][data-box-id], [data-selected="true"]').length,
  }));
  console.log(JSON.stringify(s, null, 1));
  await page.screenshot({ path: path.join(__dirname, 'a1-out', 'probe-band.png') });
  await browser.close();
})();
