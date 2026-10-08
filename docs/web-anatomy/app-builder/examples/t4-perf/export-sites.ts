// T4 — rebuild the REAL multi-file export (renderSiteFiles + embedFontCss, exactly what "Download site" does in
// app/website/box-demo/page.tsx:834-836) from the dressed pages built through the UI (scripts/uat/dressed-out/*.site.json).
// Bundle + run:  npx esbuild <this> --bundle --platform=node --outfile=<tmp>/export.cjs && node <tmp>/export.cjs <outDir>
import * as fs from "node:fs";
import * as path from "node:path";
import { renderSiteFiles, fontFamiliesInSite } from "@/lib/box-export";
import { embedFontCss } from "@/lib/educo-ui/font-embed";
import { DEFAULT_THEME, resolveSiteTheme } from "@/lib/site-storage";
import type { BoxSite } from "@/lib/box-site";

const root = process.cwd();
const outDir = process.argv[2];
const ids = (process.argv[3] ?? "0,1,13,32,38,40").split(",");
(async () => {
  for (const id of ids) {
    const site = JSON.parse(fs.readFileSync(path.join(root, `scripts/uat/dressed-out/page-${id}.site.json`), "utf8")) as BoxSite;
    const theme = resolveSiteTheme(DEFAULT_THEME, site.themeId ?? "light");
    const fams = fontFamiliesInSite(site, theme);
    const fontCss = await embedFontCss(fams);
    const files = renderSiteFiles(site, theme, fontCss);
    const dir = path.join(outDir, `page-${id}`);
    fs.mkdirSync(dir, { recursive: true });
    for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), text);
    console.log(JSON.stringify({ id, families: fams, fontCssBytes: fontCss.length, files: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.length])) }));
  }
})();
