// E5d-4: how long after localStorage.setItem must the app live for the write to survive a force-stop? (Chromium batches commits)
const u = require('./adb-ui.js');
const { editorPage } = require('./e5d-lib.js');
const relaunch = async (d, port) => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor');
  return editorPage(d, port, 120000);
};
(async () => {
  const [d, port] = [process.argv[2], Number(process.argv[3])];
  for (const wait of (process.argv[4] || '500,1000,2000,3000,5000').split(',').map(Number)) {
    let { browser, page } = await editorPage(d, port, 120000); await u.sleep(1500);
    const mark = `m${Date.now()}`;
    await page.evaluate((m) => localStorage.setItem('e5d_probe', m), mark);
    await u.sleep(wait);
    u.shell(d, 'am force-stop host.exp.exponent'); await browser.close().catch(() => {});
    await u.sleep(1500);
    ({ browser, page } = await relaunch(d, port)); await u.sleep(1500);
    console.log(JSON.stringify({ wait, kept: (await page.evaluate(() => localStorage.getItem('e5d_probe'))) === mark }));
    await browser.close();
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
