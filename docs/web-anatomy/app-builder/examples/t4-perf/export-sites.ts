// T4 — rebuild the REAL multi-file export (renderSiteFiles + embedFontCss, exactly what "Download site" does in
// app/website/box-demo/page.tsx:834-836) from the dressed pages built through the UI (scripts/uat/dressed-out/*.site.json).
// Bundle + run:  npx esbuild <this> --bundle --platform=node --outfile=<tmp>/export.cjs && node <tmp>/export.cjs <outDir>
import * as fs from "node:fs";
import * as path from "node:path";
import { renderSiteFiles, fontFamiliesInSite, photosToFiles } from "@/lib/box-export";
import { embedFontCss, fontFiles } from "@/lib/educo-ui/font-embed";
import { DEFAULT_THEME, resolveSiteTheme } from "@/lib/site-storage";
import type { BoxSite } from "@/lib/box-site";

const root = process.cwd();
const outDir = process.argv[2];
const ids = (process.argv[3] ?? "0,1,13,32,38,40").split(",");
// --files: the download as BATCH A-1 ships it — fonts under fonts/ (RA-7), photos under images/ (RA-8). Node has no canvas,
// so the 480 / 960 copies are not made here: an UPPER bound on photo weight (a phone with copies downloads less).
const asFiles = process.argv.includes("--files");
(async () => {
  for (const id of ids) {
    const site = JSON.parse(fs.readFileSync(path.join(root, `scripts/uat/dressed-out/page-${id}.site.json`), "utf8")) as BoxSite;
    const theme = resolveSiteTheme(DEFAULT_THEME, site.themeId ?? "light");
    const fams = fontFamiliesInSite(site, theme);
    const fonts = asFiles ? await fontFiles(fams) : { css: await embedFontCss(fams), files: {} };
    const text = renderSiteFiles(site, theme, fonts.css);
    const photos = asFiles ? photosToFiles(text) : { files: text, photos: {} };
    const files: Record<string, string | Uint8Array> = { ...photos.files, ...fonts.files,
      ...Object.fromEntries(Object.entries(photos.photos).map(([f, uri]) => [f, Buffer.from(uri.slice(uri.indexOf(",") + 1), "base64")])) };
    const dir = path.join(outDir, `page-${id}`);
    for (const [name, body] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true }); fs.writeFileSync(path.join(dir, name), body); }
    console.log(JSON.stringify({ id, families: fams, fontCssBytes: fonts.css.length, files: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.length])) }));
  }
})();
