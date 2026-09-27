const { PDFDocument } = require('pdf-lib'); const fs = require('fs');
(async () => {
  const src = await PDFDocument.load(fs.readFileSync('C:/Users/eyite/Downloads/theory-lectures-v2-BEST.pdf'), { ignoreEncryption: true });
  const n = src.getPageCount(); console.log('pages', n);
  for (let a = 0; a < n; a += 10) {
    const out = await PDFDocument.create();
    const idx = Array.from({ length: Math.min(10, n - a) }, (_, i) => a + i);
    (await out.copyPages(src, idx)).forEach((p) => out.addPage(p));
    const f = `part-${String(a + 1).padStart(3, '0')}.pdf`; fs.writeFileSync(f, await out.save());
    console.log(f, Math.round(fs.statSync(f).size / 1e6) + 'MB');
  }
})();
