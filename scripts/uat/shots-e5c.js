// The story's §11 tablet pictures (RULE DOCS), from the real builder: a page built through the sheet by a finger.
//   story-tablet-editor.webp    768 × 1024, a Heading selected — the page 1:1, the toolbar docked, the Inspector its tab
//   story-tablet-inspector.webp 962 × 601 — the Inspector opened over the page
//   NODE_PATH=node_modules node scripts/uat/shots-e5c.js
const path = require('path');
const sharp = require('sharp');
const E = require('./uat-e5b-headed.js');
const IMG = path.join(__dirname, '..', '..', 'docs', 'guide', 'img');
(async () => {
  for (const [w, h, file, open] of [[768, 1024, 'story-tablet-editor.webp', false], [962, 601, 'story-tablet-inspector.webp', true]]) {
    const { browser, page } = await E.open(w, h, 0, false, true);
    const ids = await E.build(page);
    await E.selectBox(page, ids.head);
    if (open) { await E.press(page, page.getByRole('button', { name: 'Expand inspector' })); await page.waitForTimeout(500); }
    await sharp(await page.screenshot()).resize({ width: w }).webp({ quality: 80 }).toFile(path.join(IMG, file));
    console.log('wrote', file);
    await browser.close();
  }
})();
