// BATCH LE-14 · the guide's pictures, cropped from the HEADED pass (scripts/uat/logs/le14) into docs/guide/img as .webp.
const sharp = require('sharp'); const path = require('path');
const IN = path.join(__dirname, 'logs', 'le14'), OUT = path.join(__dirname, '..', '..', 'docs', 'guide', 'img');
const shots = [
  ['H1-grouped.png', 'guide-group-in-place.webp', { left: 0, top: 56, width: 1010, height: 200 }],
  ['H6-layers.png', 'guide-layers.webp', { left: 0, top: 56, width: 1010, height: 330 }],
  ['H5-set-here.png', 'guide-set-here.webp', { left: 1015, top: 440, width: 351, height: 380 }],
  ['H3-left-behind.png', 'guide-kind.webp', { left: 1015, top: 660, width: 351, height: 100 }],
];
(async () => { for (const [a, b, crop] of shots) { await sharp(path.join(IN, a)).extract(crop).webp({ quality: 82 }).toFile(path.join(OUT, b)); console.log('wrote', b); } })();
