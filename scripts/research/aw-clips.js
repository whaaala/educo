// EACH AWWWARDS ITEM'S OWN RECORDING OF THE EFFECT, stored once (the user, 2026-10-19: "do the same thing for the award
// website… record everything… so we can always go back to it"). An inspiration item's page shows a short clip of what the
// site does; it is kept beside the live site's own archive (section-kinds.js), never fetched again.
//   node scripts/research/aw-clips.js <list.json> [--jobs=4] [--headed]
//     → C:/Users/eyite/educo-uat-harness/awwwards-clips/<item>.mp4 + index.json (item → live site → clip file → tags)
// Resumable: an item already in the index is skipped.
const fs = require('fs'); const path = require('path');
const OUT = 'C:/Users/eyite/educo-uat-harness/awwwards-clips';

/** The clip's file: the item's own name, with the video's extension (mp4 when the address shows none). */
function clipFile(item, video) {
  const name = item.replace(/[#?].*$/, '').replace(/\/$/, '').split('/').pop();
  const ext = (video.split(/[?#]/)[0].match(/\.(mp4|webm|mov|m4v)$/i) || [, 'mp4'])[1].toLowerCase();
  return `${name}.${ext}`;
}

async function run() {
  const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
  const list = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); fs.mkdirSync(OUT, { recursive: true });
  const idxFile = path.join(OUT, 'index.json'); const index = fs.existsSync(idxFile) ? JSON.parse(fs.readFileSync(idxFile, 'utf8')) : {};
  const todo = list.filter((u) => !index[u]); console.log('clips to read:', todo.length);
  const jobs = +((process.argv.find((a) => a.startsWith('--jobs=')) || '').slice(7) || 4);
  const b = await chromium.launch({ headless: !process.argv.includes('--headed'), channel: 'chrome' });
  await Promise.all(Array.from({ length: jobs }, async () => {
    const ctx = await b.newContext(); const p = await ctx.newPage();
    while (todo.length) {
      const item = todo.shift(); const rec = { at: new Date().toISOString() };
      try {
        await p.goto(item, { waitUntil: 'domcontentloaded', timeout: 40000 }); await p.waitForTimeout(2500);
        Object.assign(rec, await p.evaluate(() => ({
          title: document.title.replace(/ - Awwwards.*/, ''),
          site: ([...document.querySelectorAll('a[href]')].find((a) => /visit (site|website|resource)/i.test(a.innerText || '') && !a.href.includes(location.hostname)) || {}).href || null,
          videos: [...new Set([...document.querySelectorAll('video source[src], video[src], video[data-src]')].map((v) => v.src || v.getAttribute('data-src')).filter((u) => u && /^https?:/.test(u)))].slice(0, 3),
          tags: [...new Set([...document.querySelectorAll('a[href*="/inspiration/"], a[href*="tag"]')].map((a) => (a.innerText || '').trim()).filter((t) => t && t.length < 30))].slice(0, 30),
        })));
        rec.clips = [];
        for (const v of rec.videos) {
          const res = await p.request.get(v, { timeout: 60000 }).catch(() => null);
          if (res && res.ok()) { const file = clipFile(item, v).replace(/(\.\w+)$/, rec.clips.length ? `-${rec.clips.length}$1` : '$1'); fs.writeFileSync(path.join(OUT, file), await res.body()); rec.clips.push({ from: v, file }); }
          else rec.clips.push({ from: v, file: '', status: res ? res.status() : 'ERR' });
        }
        if (!rec.videos.length) rec.none = 'no recording on the page';
      } catch (e) { rec.err = e.message.slice(0, 80); }
      if (!rec.err) { index[item] = rec; fs.writeFileSync(idxFile, JSON.stringify(index, null, 1)); }
      console.log(Object.keys(index).length, item.split('/').pop(), rec.err || `${rec.clips.filter((c) => c.file).length} clip(s)`);
    }
    await ctx.close();
  }));
  await b.close();
}

module.exports = { clipFile };
if (require.main === module) run().catch((e) => { console.error(e); process.exit(1); });
