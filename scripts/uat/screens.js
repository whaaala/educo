// EVERY SCREEN A UAT CHECKS THE PREVIEW AT — one list for every UAT script (RULE Z, the user 2026-10-04: "always check
// all of the devices… all of the breakpoints… that must be a rule… for all of our UAT testing").
//
// Read from the SAME sources the builder uses, never re-typed, so a device added to the Preview's menu is checked by
// every UAT the day it appears:
//   • every preset of the Preview's own menu, at its real width AND height (lib/preview-devices.ts — iPhones, Android
//     incl. Tecno / Infinix / itel, tablets, laptops, monitors, the user's 1536 × 864);
//   • both sides of every breakpoint of the five-rung ladder (lib/educo-ui/layout.ts RUNG_PX: 599 | 600, 899 | 900…),
//     where a layout changes and a bug hides.
// Guarded by tests/unit/uat-screens.test.ts (it must hold every preset and every breakpoint, and every new headed UAT
// script must use it).
const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..', '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

const presets = [...read('lib/preview-devices.ts').matchAll(/label: (?:"([^"]+)"|'([^']+)'), w: (\d+), h: (\d+)/g)].map((m) => ({ label: m[1] ?? m[2], w: +m[3], h: +m[4] })); // either quote: 'MacBook Air 13" — …' (G-1 #5)
const rungs = [...read('lib/educo-ui/layout.ts').match(/export const RUNG_PX = \{([^}]+)\}/)[1].matchAll(/(\w+): (\d+)/g)].map((m) => ({ name: m[1], px: +m[2] })).filter((r) => r.px > 0);
const edges = rungs.flatMap((r) => [{ label: `just below ${r.name} — ${r.px - 1}`, w: r.px - 1, h: 900 }, { label: `${r.name} starts — ${r.px}`, w: r.px, h: 900 }]);

const seen = new Set();
/** Every screen, narrowest first, one entry per width × height. */
const SCREENS = [...presets, ...edges].filter((s) => { const k = `${s.w}x${s.h}`; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => a.w - b.w || a.h - b.h);
/** The distinct widths, for a check that depends on width only. */
const WIDTHS = [...new Set(SCREENS.map((s) => s.w))];

module.exports = { SCREENS, WIDTHS, presets, rungs };
if (require.main === module) console.log(`${SCREENS.length} screens, ${WIDTHS.length} widths: ${WIDTHS.join(' ')}`);
