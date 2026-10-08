/**
 * Drive an Android emulator the way a person does — tap what is on screen by its name — for the app's HEADED UAT
 * (BATCH E-5d). The WebView's page is in the same accessibility tree, so the editor's own buttons are found the same way.
 *   node scripts/uat/adb-ui.js <emulator-5554|emulator-5556> dump [filter]
 *   node scripts/uat/adb-ui.js <device> tap "<text or content-desc>"
 *   node scripts/uat/adb-ui.js <device> shot <file.png>
 */
const { execFileSync } = require('child_process');
const fs = require('fs');

const ADB = process.env.ADB || 'C:/Users/eyite/AppData/Local/Android/Sdk/platform-tools/adb.exe';

const adb = (dev, args, opts = {}) => execFileSync(ADB, ['-s', dev, ...args], { maxBuffer: 64 << 20, ...opts });
const shell = (dev, cmd) => adb(dev, ['shell', cmd]).toString();

function nodes(dev) {
  const xml = adb(dev, ['exec-out', 'uiautomator', 'dump', '/dev/tty']).toString();
  const out = [];
  for (const m of xml.matchAll(/<node [^>]*?>/g)) {
    const a = (k) => (m[0].match(new RegExp(` ${k}="([^"]*)"`)) || [])[1] || '';
    const b = a('bounds').match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
    if (!b) continue;
    const [x1, y1, x2, y2] = b.slice(1).map(Number);
    out.push({ text: a('text'), desc: a('content-desc'), cls: a('class'), x: (x1 + x2) >> 1, y: (y1 + y2) >> 1, w: x2 - x1, h: y2 - y1 });
  }
  return out;
}

/** The first visible node whose text or description equals `name` (or matches it, given a RegExp). */
function find(dev, name) {
  const hit = (s) => (name instanceof RegExp ? name.test(s) : s === name);
  return nodes(dev).find((n) => n.w > 0 && n.h > 0 && (hit(n.text) || hit(n.desc)));
}

function tap(dev, name) {
  const n = find(dev, name);
  if (!n) throw new Error(`${dev}: nothing on screen named ${name}`);
  shell(dev, `input tap ${n.x} ${n.y}`);
  return n;
}

const tapAt = (dev, x, y) => shell(dev, `input tap ${x} ${y}`);
const key = (dev, code) => shell(dev, `input keyevent ${code}`);
const shot = (dev, file) => fs.writeFileSync(file, adb(dev, ['exec-out', 'screencap', '-p']));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wait until something named `name` is on screen. */
async function waitFor(dev, name, ms = 30000) {
  const end = Date.now() + ms;
  for (;;) {
    const n = find(dev, name);
    if (n) return n;
    if (Date.now() > end) throw new Error(`${dev}: ${name} did not appear in ${ms}ms`);
    await sleep(700);
  }
}

module.exports = { adb, shell, nodes, find, tap, tapAt, key, shot, sleep, waitFor };

if (require.main === module) {
  const [dev, cmd, arg] = process.argv.slice(2);
  if (cmd === 'dump') {
    for (const n of nodes(dev)) {
      const s = `${n.text}|${n.desc}`;
      if ((n.text || n.desc) && (!arg || s.toLowerCase().includes(arg.toLowerCase()))) console.log(`${n.x},${n.y} ${n.w}x${n.h} [${n.cls.split('.').pop()}] ${n.text} ${n.desc ? '(' + n.desc + ')' : ''}`);
    }
  } else if (cmd === 'tap') console.log(tap(dev, arg));
  else if (cmd === 'shot') shot(dev, arg);
}
