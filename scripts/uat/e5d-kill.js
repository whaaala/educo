// E5d-4 on a device: type a word, leave the app (Home), Android kills it 1s later, relaunch → the word is still there.
const u = require('./adb-ui.js');
const { editorPage, touch } = require('./e5d-lib.js');
(async () => {
  const [d, port, word] = process.argv.slice(2);
  const { browser, page } = await editorPage(d, Number(port)); await u.sleep(1500);
  const focused = () => page.evaluate(() => document.activeElement?.getAttribute('contenteditable') === 'true');
  const h = page.locator('[contenteditable]').first();
  for (let i = 0; i < 5 && !(await focused()); i++) { await touch(d, page, h); await u.sleep(700); }
  if (!(await focused())) throw new Error('could not focus the words');
  u.shell(d, `input text ${word}`); await u.sleep(150);
  const typed = await page.evaluate(() => document.activeElement.textContent);
  u.key(d, 'KEYCODE_HOME'); await u.sleep(1000);
  u.shell(d, 'am force-stop host.exp.exponent'); await browser.close().catch(() => {});
  await u.sleep(2000);
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor');
  const p2 = await editorPage(d, Number(port), 120000); await u.sleep(4000);
  const after = await p2.page.evaluate((w) => [...document.querySelectorAll('[contenteditable]')].map((e) => e.textContent).find((t) => t.includes(w)) ?? null, word);
  console.log(JSON.stringify({ device: d, typed, after, kept: !!after }));
  await p2.browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
