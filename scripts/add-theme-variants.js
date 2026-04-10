/**
 * Bulk-add midnight: and purple: Tailwind theme variants
 * to files that only have dark: variants.
 *
 * Usage: node scripts/add-theme-variants.js <file-path>
 */

const fs = require('fs');
const filePath = process.argv[2];
if (!filePath) { console.error('Usage: node add-theme-variants.js <file>'); process.exit(1); }

let content = fs.readFileSync(filePath, 'utf8');
const before = content;

// Replacements: [dark-pattern, replacement-with-all-three]
// Order matters — longer/more specific patterns first
const replacements = [
  // Backgrounds (specific first)
  ['dark:bg-gray-900/50', 'dark:bg-gray-900/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50'],
  ['dark:bg-gray-900/40', 'dark:bg-gray-900/40 midnight:bg-[#0a0e27]/40 purple:bg-[#1a0b2e]/40'],
  ['dark:bg-gray-950', 'dark:bg-gray-950 midnight:bg-[#060a1e] purple:bg-[#120722]'],
  ['dark:bg-gray-900', 'dark:bg-gray-900 midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]'],
  ['dark:bg-gray-800/80', 'dark:bg-gray-800/80 midnight:bg-[#111827]/80 purple:bg-[#2a1447]/80'],
  ['dark:bg-gray-800/50', 'dark:bg-gray-800/50 midnight:bg-[#111827]/50 purple:bg-[#2a1447]/50'],
  ['dark:bg-gray-800', 'dark:bg-gray-800 midnight:bg-[#111827] purple:bg-[#2a1447]'],
  ['dark:bg-gray-700', 'dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800'],
  ['dark:bg-gray-600', 'dark:bg-gray-600 midnight:bg-gray-700 purple:bg-gray-700'],
  ['dark:bg-blue-900/30', 'dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30'],
  ['dark:bg-blue-900/20', 'dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20'],
  ['dark:bg-blue-900/10', 'dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10'],
  ['dark:bg-red-900/20', 'dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20'],
  ['dark:bg-red-900/30', 'dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30'],
  // Text
  ['dark:text-gray-100', 'dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50'],
  ['dark:text-gray-200', 'dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100'],
  ['dark:text-gray-300', 'dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200'],
  ['dark:text-gray-400', 'dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300'],
  ['dark:text-gray-500', 'dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400'],
  ['dark:text-gray-600', 'dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500'],
  ['dark:text-white', 'dark:text-white midnight:text-cyan-50 purple:text-pink-50'],
  ['dark:text-blue-400', 'dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400'],
  ['dark:text-blue-300', 'dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300'],
  ['dark:text-blue-200', 'dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200'],
  ['dark:text-green-400', 'dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400'],
  ['dark:text-red-400', 'dark:text-red-400 midnight:text-red-400 purple:text-red-400'],
  ['dark:text-amber-400', 'dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400'],
  // Borders
  ['dark:border-gray-800', 'dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10'],
  ['dark:border-gray-700', 'dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20'],
  ['dark:border-gray-600', 'dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30'],
  ['dark:border-blue-700', 'dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500'],
  ['dark:border-blue-500', 'dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500'],
  // Hover backgrounds
  ['dark:hover:bg-gray-800', 'dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5'],
  ['dark:hover:bg-gray-700', 'dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10'],
  ['dark:hover:bg-gray-600', 'dark:hover:bg-gray-600 midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15'],
  ['dark:hover:bg-blue-900/20', 'dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20'],
  ['dark:hover:bg-blue-900/10', 'dark:hover:bg-blue-900/10 midnight:hover:bg-cyan-900/10 purple:hover:bg-pink-900/10'],
  ['dark:hover:bg-red-900/20', 'dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20'],
  // Ring
  ['dark:ring-offset-gray-900', 'dark:ring-offset-gray-900 midnight:ring-offset-[#0d1526] purple:ring-offset-[#1f1035]'],
  ['dark:ring-offset-gray-800', 'dark:ring-offset-gray-800 midnight:ring-offset-[#111827] purple:ring-offset-[#2a1447]'],
  ['dark:ring-gray-700/60', 'dark:ring-gray-700/60 midnight:ring-cyan-500/20 purple:ring-pink-500/20'],
  ['dark:ring-gray-700', 'dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20'],
  // Focus
  ['dark:focus:border-blue-400', 'dark:focus:border-blue-400 midnight:focus:border-cyan-400 purple:focus:border-pink-400'],
  ['dark:focus:border-blue-500', 'dark:focus:border-blue-500 midnight:focus:border-cyan-500 purple:focus:border-pink-500'],
  ['dark:focus:ring-blue-400/20', 'dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-400/20 purple:focus:ring-pink-400/20'],
  // Placeholder
  ['dark:placeholder-gray-500', 'dark:placeholder-gray-500 midnight:placeholder-cyan-400 purple:placeholder-pink-400'],
  ['dark:placeholder-gray-600', 'dark:placeholder-gray-600 midnight:placeholder-cyan-500 purple:placeholder-pink-500'],
  // Hover text
  ['dark:hover:text-gray-200', 'dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100'],
  ['dark:hover:text-gray-300', 'dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200'],
  ['dark:hover:text-white', 'dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50'],
  // Hover border
  ['dark:hover:border-gray-600', 'dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30'],
  ['dark:hover:border-gray-500', 'dark:hover:border-gray-500 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40'],
];

for (const [from, to] of replacements) {
  // Escape special regex chars in the "from" string
  const escaped = from.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
  // Only replace if NOT already followed by " midnight:" (avoiding double-add)
  const regex = new RegExp(escaped + '(?!\\s+midnight:)', 'g');
  content = content.replace(regex, to);
}

if (content !== before) {
  fs.writeFileSync(filePath, content);
  const additions = (content.match(/midnight:/g) || []).length;
  console.log(`Done. Added theme variants. midnight: count: ${additions}`);
} else {
  console.log('No changes needed.');
}
