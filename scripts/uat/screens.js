// EVERY SCREEN A UAT CHECKS THE PREVIEW AT — one list for every UAT script (RULE Z, the user 2026-10-04: "always check
// all of the devices… all of the breakpoints… that must be a rule… for all of our UAT testing").
//
// Read from the SAME sources the builder uses, never re-typed, so a device added to the Preview's menu is checked by
// every UAT the day it appears:
//   • every preset of the Preview's own menu, at its real width AND height (lib/preview-devices.ts — iPhones, Android
//     incl. Tecno / Infinix / itel, tablets, laptops, monitors, the user's 1536 × 864);
//   • both sides of every breakpoint of the five-rung ladder (config/layout.json: 599 | 600, 839 | 840…),
//     where a layout changes and a bug hides.
// Guarded by tests/unit/uat-screens.test.ts (it must hold every preset and every breakpoint, and every new headed UAT
// script must use it).
const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..', '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

const presets = [...read('lib/preview-devices.ts').matchAll(/label: (?:"([^"]+)"|'([^']+)'), w: (\d+), h: (\d+)/g)].map((m) => ({ label: m[1] ?? m[2], w: +m[3], h: +m[4] })); // either quote: 'MacBook Air 13" — …' (G-1 #5)
const LAYOUT = require('../../config/layout.json'); // RULE CFG — the rungs are data, read as data (A2-2)
const rungs = Object.entries(LAYOUT.rungs).map(([name, r]) => ({ name, px: r.from })).filter((r) => r.px > 0);
const h = LAYOUT.uat.edgeHeight;
const edges = rungs.flatMap((r) => [{ label: `just below ${r.name} — ${r.px - 1}`, w: r.px - 1, h }, { label: `${r.name} starts — ${r.px}`, w: r.px, h }]);

const seen = new Set();
/** Every screen, narrowest first, one entry per width × height. */
const SCREENS = [...presets, ...edges].filter((s) => { const k = `${s.w}x${s.h}`; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => a.w - b.w || a.h - b.h);
/** The distinct widths, for a check that depends on width only. */
const WIDTHS = [...new Set(SCREENS.map((s) => s.w))];

/** The edges by name, for a script's own width checks — never a typed 600 / 840 / 1024 (RULE CFG). */
const EDGE = { TP: LAYOUT.rungs.tabletPortrait.from, TL: LAYOUT.rungs.tabletLandscape.from, DT: LAYOUT.rungs.desktop.from, WD: LAYOUT.rungs.wide.from, DOCK: LAYOUT.editor.dockFrom };

module.exports = { SCREENS, WIDTHS, presets, rungs, EDGE };
if (require.main === module) console.log(`${SCREENS.length} screens, ${WIDTHS.length} widths: ${WIDTHS.join(' ')}`);
