// BATCH A-2 · the APP half of the HEADED pass (U2, U3, U4 and A2-3 / A2-4 / A2-15 / A2-17 / A2-18 / A2-22 in docs/TASK_TREE.md):
// the Educo app in Expo Go on the emulators, driven through Android's own accessibility tree (adb-ui.js), screenshots read
// after. Phone (emulator-5556): the bar, the Children list-detail with Back and Android's back, a deep link, fees' last line
// clear of the bar, a turn to landscape (still the bar), large text (fewer places + the More sheet). Tablet (emulator-5554):
// the rail, two panes, a turn to portrait (one pane, still the rail) and back. Every name from config/ (RULE CFG).
//   node scripts/uat/uat-a2-emulator.js phone|tablet        (Metro on :8081, the emulator booted)
const path = require('path'); const fs = require('fs');
const u = require('./adb-ui.js');
const { EDGE } = require('./screens.js'); // the rung edges, by name
const SHELL = require('../../config/app-shell.json'); const LISTS = require('../../config/sample-lists.json');
const which = process.argv[2] || 'phone'; const DEV = process.argv[3] || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556'); // the first emulator booted takes 5554, whichever it is
const OUT = path.join(__dirname, 'logs', `uat-a2-emu-${which}`); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const out = []; const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${which}] ${what}${detail && !pass ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
const places = SHELL.roles.parent.items; const kids = LISTS.lists.children.rows; const W = LISTS.words;
const children = places.find((p) => p.list === 'children');
let n = 0; const shot = (name) => u.shot(DEV, path.join(OUT, `${String(++n).padStart(2, '0')}-${name}.png`));
const open = (link) => u.shell(DEV, `am start -a android.intent.action.VIEW -d "exp://localhost:8081${link ? '/--' + link : ''}"`);
const rotate = (r) => { u.shell(DEV, 'settings put system accelerometer_rotation 0'); u.shell(DEV, `settings put system user_rotation ${r}`); };
const fontScale = (f) => u.shell(DEV, `settings put system font_scale ${f}`);
const has = (name) => !!u.find(DEV, name);
const rowName = (k) => `${k.title}, ${k.subtitle}`;

(async () => {
  u.adb(DEV, ['reverse', 'tcp:8081', 'tcp:8081']); rotate(0); fontScale('1.0');
  u.shell(DEV, 'am force-stop host.exp.exponent'); await u.sleep(1500); // a fresh start: the bundle the code has now
  open(); await u.waitFor(DEV, places[0].label, 120000); await u.sleep(2500); shot('home');
  if (which === 'phone') {
    ok('the bar shows the five places from config/app-shell.json', places.every((p) => has(p.label)));
    ok('no rail on a phone', !has('Main'));
    u.tap(DEV, children.label); await u.waitFor(DEV, rowName(kids[0])); await u.sleep(800); shot('children-list');
    ok(`Children: the list, each row marked "${SHELL.words.sample}"`, kids.every((k) => has(rowName(k))) && u.nodes(DEV).filter((x) => x.text === SHELL.words.sample).length === kids.length);
    u.tap(DEV, rowName(kids[1])); await u.waitFor(DEV, kids[1].fields[0].value); await u.sleep(700); shot('child-detail');
    ok('a row opens its detail, with Back', has(kids[1].fields[0].value) && has(W.back));
    u.tap(DEV, W.back); await u.waitFor(DEV, rowName(kids[0])); await u.sleep(600);
    ok('Back returns to the list', has(rowName(kids[1])) && !has(kids[1].fields[0].value));
    u.tap(DEV, rowName(kids[0])); await u.waitFor(DEV, kids[0].fields[0].value); u.key(DEV, 4); await u.sleep(1200);
    ok("Android's back does the same", has(rowName(kids[0])) && !has(kids[0].fields[0].value));
    open(`${children.href}/${kids[1].id}`); await u.waitFor(DEV, kids[1].fields[0].value, 30000); await u.sleep(800); shot('deep-link');
    ok('a deep link opens straight on that child, with Back', has(kids[1].fields[0].value) && has(W.back));
    u.tap(DEV, W.back); await u.sleep(1200);
    ok('…and its Back (nothing to go back to) lands on the list', has(rowName(kids[0])));
    u.tap(DEV, places.find((p) => p.id === 'fees').label); await u.sleep(2500);
    for (let i = 0; i < 6; i++) { u.shell(DEV, 'input swipe 540 1700 540 500 300'); await u.sleep(400); } await u.sleep(800); shot('fees-bottom');
    rotate(1); await u.sleep(3000); shot('phone-landscape');
    ok('a phone on its side keeps the bar (its height is compact) — no rail', places.every((p) => has(p.label)) && !has('Main'));
    rotate(0); await u.sleep(2500);
    fontScale('2.0'); await u.sleep(3500); shot('large-text');
    const shown = places.filter((p) => has(p.label));
    ok('large text: the bar holds fewer places, with More', shown.length < places.length && has(SHELL.moreLabel), shown.map((p) => p.label).join(', '));
    u.tap(DEV, SHELL.moreLabel); await u.sleep(1500); shot('more-sheet');
    const missing = places.filter((p) => !shown.includes(p) && !has(p.label)); // the sheet covers the bar, so only the left-out places are asked for
    ok('More opens a sheet with every place the bar left out', missing.length === 0, missing.map((p) => p.label).join(', '));
    u.key(DEV, 4); await u.sleep(1000); fontScale('1.0'); await u.sleep(2500);
    ok('Back closes the sheet; normal text brings the five back', places.every((p) => has(p.label)));
  } else {
    ok('a tablet gets the rail (tablist "Main")', has('Main'));
    u.tap(DEV, children.label); await u.waitFor(DEV, rowName(kids[0])); await u.sleep(1200); shot('tablet-two-panes');
    ok('Children on a tablet on its side: two panes, the first child chosen, no Back', has(kids[0].fields[0].value) && has(rowName(kids[1])) && !has(W.back));
    u.tap(DEV, rowName(kids[1])); await u.sleep(1500); shot('tablet-second');
    ok('a row swaps the detail beside the list', has(kids[1].fields[0].value) && has(rowName(kids[0])));
    rotate(0); u.shell(DEV, 'settings put system user_rotation 1'); await u.sleep(500); // the tablet's natural orientation is landscape: rotation 1 = portrait
    await u.sleep(3500); shot('tablet-portrait');
    const portrait = u.nodes(DEV).reduce((a, x) => Math.max(a, x.x + x.w / 2), 0) < 1700;
    ok(`turned upright (under ${EDGE.TL} wide): one pane — the opened child — and still the rail`, has('Main') && has(kids[1].fields[0].value) && !has(rowName(kids[0])), `portrait ${portrait}`);
    u.shell(DEV, 'settings put system user_rotation 0'); await u.sleep(3500); shot('tablet-landscape-again');
    ok('turned back: two panes again, the same child', has(kids[1].fields[0].value) && has(rowName(kids[0])));
  }
  rotate(0); fontScale('1.0');
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
  fs.writeFileSync(path.join(OUT, 'result.txt'), out.join('\n'));
})().catch((e) => { console.error(e); try { rotate(0); fontScale('1.0'); } catch { /* the device is gone */ } process.exit(2); });
