# Research crawlers — how the stored research was gathered (RULE R)

These produced `docs/layout-benchmark/` and feed `docs/LAYOUT_BENCHMARK.md`. The research is **extended, never
redone**: raw HTML is archived, so a later question is answered from the archive, not a re-crawl.

| File | What it is |
|---|---|
| `harvest.js` → `harvest.tsv` | awwwards: site URLs by category (every category, equal weight). |
| `harvest-webflow.js` → `harvest-webflow.tsv` | Webflow templates: category → card → View details → live `*.webflow.io` site. |
| `harvest-framer.js` → `harvest-framer.tsv` | Framer templates: "Show Preview" → live `*.framer.website` site. |
| `crawl.js` | Visits each harvested site and every page of it, headed, politely paced, one window per site: `--harvest=<tsv> --percat=N --jobs=N --headed`. Writes `C:\Users\eyite\educo-uat-harness\sites\<host>\` (text, anatomy, screenshot) — outside the repo. |
| `anatomy.js`, `extract.js` | What is recorded per page: landmarks, headings, sections, components, layout. |
| `split-pdf.js` | Splits a PDF too big to read at once into 10-page parts (`pdf-lib`), used for the design-foundation deck (RULE F). |

**Rules kept while crawling:** robots.txt is respected; sites that block automated visitors (Cloudflare challenges
on ThemeForest and Land-book; SiteInspire disallows crawlers) are stopped, never bypassed — no stealth plugins,
no fingerprint spoofing, no challenge solving.

## Where the data lives

| What | Where | Size |
|---|---|---|
| **One line per page** — source · category · site · page · type · landmarks · headings · header · sidebars · components · section sequence · breakpoints | `docs/layout-benchmark/pages.tsv` (**in the repo**) | ~0.6 MB |
| Per-page structure, text and screenshots | `C:\Users\eyite\educo-uat-harness\sites\<host>\` (outside git) | ~340 MB |
| Raw HTML of every page | `C:\Users\eyite\educo-uat-harness\archive\<host>\` (outside git) | ~150 MB |

Regenerate the summary after any crawl: `node scripts/research/summarise.js`. The raw folders are NOT backed up by git —
copy them somewhere backed up if they matter. `docs/layout-benchmark/.gitignore` stops `sites/` ever being committed.
