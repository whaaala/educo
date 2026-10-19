// LE-15 D6 · THE SECTIONS' PHOTO SET: resize each sourced photo to the widths config/layout.json gives (media.photoWidths,
// 480 and 960 → here the two copies 480 and 800) as WebP within the weight cap (RULE AF), write public/sections/<id>-<w>.webp
// and config/section-photos.json (id → alt, author, licence, source, files). Read-only on the raw folder.
// Usage: node scripts/research/section-photos.js <raw folder with manifest.json> [--skip=id,id]
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const RAW = process.argv[2];
const skip = new Set(((process.argv.find((a) => a.startsWith('--skip=')) || '').split('=')[1] || '').split(',').filter(Boolean));
const OUT = path.join(__dirname, '..', '..', 'public', 'sections');
const CFG = path.join(__dirname, '..', '..', 'config', 'section-photos.json');
const WIDTHS = [480, 800];
const CAP = 40 * 1024; // D6: at most 40 KB at 800px

(async () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(RAW, 'manifest.json'), 'utf8'));
  fs.mkdirSync(OUT, { recursive: true });
  const photos = {};
  for (const m of manifest) {
    if (skip.has(m.id)) { console.log(`skip ${m.id}`); continue; }
    const src = path.join(RAW, path.basename(m.file));
    const files = {};
    for (const w of WIDTHS) {
      let q = 72, box = w, buf;
      // inside a w × w box: a tall portrait at w wide carried half as much picture again (108 KB measured); a very busy photo
      // still over the cap at quality 20 is made a little smaller instead (the cap is the rule, D6)
      for (;;) {
        buf = await sharp(src).rotate().resize({ width: box, height: box, fit: 'inside', withoutEnlargement: true }).webp({ quality: q }).toBuffer();
        if (buf.length <= CAP) break;
        if (q > 20) q -= 6; else box = Math.round(box * 0.9);
      }
      if (buf.length > CAP) console.warn(`OVER THE CAP: ${m.id} at ${w}: ${buf.length} B`);
      const name = `${m.id}-${w}.webp`;
      fs.writeFileSync(path.join(OUT, name), buf);
      files[w] = { file: `/sections/${name}`, bytes: buf.length };
    }
    const meta = await sharp(path.join(OUT, `${m.id}-800.webp`)).metadata();
    photos[m.id] = { alt: m.alt, author: m.author, licence: m.licence, source: m.source, width: meta.width, height: meta.height, src: files[800].file, srcset: WIDTHS.map((w) => `${files[w].file} ${w}w`).join(', ') };
    console.log(`${m.id}: 480 ${files[480].bytes} B · 800 ${files[800].bytes} B`);
  }
  const out = { $comment: 'THE SECTIONS\' PHOTOS (BATCH LE-15, D6 signed 2026-10-19): about 40 free-licence photos, African schools first (RULE AF), each verified on its own page — Pexels License or Unsplash License, no credit required — resized to 480 and 800 px WebP, at most 40 KB (public/sections/). Written by scripts/research/section-photos.js; to replace one, put its new file and line in the raw manifest and run it again. Left out on purpose: a real school named in the picture, a named person\'s own portrait.', photos };
  fs.writeFileSync(CFG, JSON.stringify(out, null, 2) + '\n');
  console.log(`${Object.keys(photos).length} photos → ${path.relative(process.cwd(), CFG)}`);
})().catch((e) => { console.error(e); process.exit(1); });
