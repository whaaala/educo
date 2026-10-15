# T4 — Cheap Android on 3G: the facts, our measured weight, and the map

Captured 2026-10-08 for the app builder (research track T4, branch `app-builder/research`). Extends, never redoes,
`docs/DEVELOPING_COUNTRIES_FIRST.md` (RULE AF budgets) and `docs/web-anatomy/tablet-and-app-editing.md` §2 E (the WebView).
Every claim cites its source; anything not read at source is marked **UNVERIFIED**; anything read from our code is marked
with `file:line`. Run label: **HEADLESS MEASUREMENT** (a throttled Chromium, not a headed UAT — it decides nothing about
behaviour, it only weighs and times pages).

---

## 1. The facts, read at source

### 1.1 Who the visitor is — devices

| Fact | Nigeria | Ghana | Source |
|---|---|---|---|
| Mobile OS | Android **84.2 %**, iOS 15.7 % | — | gs.statcounter.com/os-market-share/mobile/nigeria (Sep 2026) |
| Vendors | **Tecno 20.5 %**, Samsung 17.2 %, **Infinix 16.9 %**, Apple 15.7 %, Xiaomi 12.9 %, **itel 4.8 %** → Transsion brands **42.2 %** | Samsung 32.6 %, Apple 29.1 %, **Tecno 15.1 %**, **Infinix 6.9 %**, Huawei 3.2 % | gs.statcounter.com/vendor-market-share/mobile/{nigeria,ghana} (Sep 2026) |
| Screen (CSS px) | **360×800 20.6 %**, 360×806 13.7 %, 360×820 8.3 %, 414×896 8.0 %, 412×915 6.0 %, 385×854 4.4 % → **360-wide = 42.6 %** of the top six | 414×896 14.1 %, 360×800 10.9 %, 384×832 8.7 %, 360×806 8.4 %, 385×854 7.3 %, 412×915 6.5 % | gs.statcounter.com/screen-resolution-stats/mobile/{nigeria,ghana} (Sep 2026) |
| Android version | 15: 21.0 %, 14: 15.9 %, 16: 13.7 %, 13: 12.7 %, **12: 11.6 %, 11: 9.6 %** → about **1 in 5 on Android ≤ 12** | not read | gs.statcounter.com/android-version-market-share/mobile/nigeria (Sep 2026) |
| Africa shipments | Transsion (Tecno, Infinix, itel) **48 %** of 2025 African shipments, > 40.5 M units; Nigeria grew 25 % in Q2 2025 "fuelled by affordable 4G smartphones in the sub-$200 segment" | — | Counterpoint via gizmochina.com/2026/02/25 and techeconomy.ng (search snippets — the Counterpoint page itself was **not opened: UNVERIFIED at source**) |

**Typical specs of what sells** (gsmarena / 91mobiles spec pages, via search snippets):

| Model | SoC | RAM | Screen | OS |
|---|---|---|---|---|
| itel A70 (Nov 2023) | Unisoc T603, 8× Cortex-A55 1.8 GHz, 28 nm | 4 GB (some 3 GB) | 720×1612 → 360 CSS px wide | **Android 13 Go** |
| Tecno Spark Go 2024 | Unisoc T606, 2× A75 + 6× A55 1.6 GHz, 12 nm | 2–4 GB | 720×1612, 90 Hz | **Android 13 Go** |
| Infinix Smart 8 | Unisoc T606 | 2–4 GB | 720×1612 | Android 13 (Go on 2 GB) |
| Samsung Galaxy A06 | Helio G85, 2× A75 2.0 + 6× A55 | 4–6 GB | 720×1600 | Android 14 |

A DPR-2 720px panel is a **360 CSS px** viewport — the itel / Tecno rows of `lib/preview-devices.ts:73-74` are right.
Android (Go edition): "Android 13 (API 33) — 2 GB" minimum RAM; Go devices are "entry-level smartphones with limited …
data, storage, memory, and processing power" (developer.android.com/guide/topics/androidgo).

### 1.2 The WebView on these phones

- **Updatable since Android 5**, through Google Play; Android 7–9 used Chrome as the WebView provider, Android 10+ went back
  to Android System WebView (techblogs.42gears.com/webkit-provider-changes-in-various-android-versions — secondary source).
  On Go devices the update path is the same Play listing — **UNVERIFIED** for Go specifically (no Google page found that
  says so); a device that has not opened Play in months can be several Chromium milestones behind (inference).
- **Memory**: "WebView runs on a Chromium-based engine with separate processes and native code, its baseline memory usage
  is higher than standard Android views"; on **"Low-RAM devices [it] may fall back to single process mode"**; native
  memory "can silently grow to gigabytes … Android's Low Memory Killer (LMK) begins terminating background processes"
  (developer.android.com/develop/ui/views/layout/webapps/{webview, manage-webview-memory}).
- **Startup**: "When your app first uses a WebView … This startup process is heavy … happens entirely on the main thread
  … increases the risk of ANR"; fix: Jetpack Webkit ≥ 1.16 `WebViewCompat.startUpWebView` on a background executor
  (developer.android.com/develop/ui/views/layout/webapps/optimize-webview-startup). No millisecond figure is published.
  React Native exposes no hook for this (inference) — so the first open of the school section pays it in full.
- What a WebView adds over Chrome (from the above + §2 E of the tablet doc): a cold engine start on first use; **no shared
  HTTP cache with Chrome** (each app has its own data dir — inference from Android's app sandbox, **UNVERIFIED** as a
  quoted fact); renderer may be killed in the background → must reload (`onRenderProcessGone`, tablet doc §2 E).

### 1.3 The network

| Fact | Value | Source |
|---|---|---|
| SSA technology mix | **4G 31 %** of connections (2023) → 50 % (2030); **3G still the largest share**, 4G overtakes it in **2027**; 5G 1.2 % → 17 % | GSMA *Mobile Economy Sub-Saharan Africa 2024*, pp. 3 & 12 (PDF read in full, gsma.com …/GSMA_ME_SSA_2024_Web.pdf) |
| SSA smartphones | **51 %** of connections (2023) → 81 % (2030); usage gap **60 %** | same report |
| Nigeria 4G share | 49.27 % of subscribers on 4G (2025) | businessday.ng (NCC data, via search snippet — UNVERIFIED at source) |
| Nigeria median mobile download | **44.14 Mbps** (Ookla Speedtest Global Index, Dec 2025) | businessday.ng/…/nigeria-slips-to-85th… (read) |
| Nigeria download *experience* | MTN **≈ 20 Mbps** overall, Airtel ≈ ⅔ of that, Glo ≈ ½ (Opensignal, Apr–Jun 2025) | insights.opensignal.com/reports/2025/07/nigeria — 403 to our fetch; figures from the search snippet, **UNVERIFIED** |
| Ghana | MTN 10.1 Mbps down / 4.9 up; Telecel 3.8; AT 3.5 (nPerf 2025) | newsghana.com.gh (search snippet, **UNVERIFIED** at source) |
| Latency | Nigeria 31 ms (Ookla, Jan 2023, old); H1 2026 SSA latency ranking exists (capmad.com) but returned 403 | **UNVERIFIED** |

**Reading:** medians are fast; the *distribution* is not. A median of 44 Mbps (Ookla, people who run speed tests) and an
*experience* of 10–20 Mbps (Opensignal, passive) sit beside 3G as the largest technology across the region until 2027.
The user we design for is the 3G / congested-4G tail, which is exactly what DevTools "3G" and Lighthouse model.

### 1.4 Data cost

| Fact | Value | Source |
|---|---|---|
| Nigeria, average 1 GB | **$0.39** (rank 2 in Africa) | lesafriques.com 2026-10-02, citing the latest Cable.co.uk *Worldwide Mobile Data Pricing* (read) |
| Ghana, average 1 GB | **$0.40** (rank 3); NCA: GH₵6.30 ≈ $0.49 average, cheapest GH₵1.08, dearest GH₵16.77 | same; nca.org.gh/…/The-Cost-of-1GB-of-Data-in-Ghana.pdf (snippet) |
| Older Cable figure for Nigeria | $2.22 / GB | itedgenews.africa (snippet; an earlier edition) |

Cheap per GB, but bought in small bundles on prepaid money: **every 500 KB is 1/2000 of a GB on every visit**, and a
school site visited daily by a parent costs them real money if each visit re-downloads 0.5 MB (inference).

### 1.5 The test profiles (read at source)

| Profile | Down | Up | RTT | Source |
|---|---|---|---|---|
| DevTools **"3G"** (was "Slow 3G") | 500 kbps × 0.8 = **400 kbps** (50 KB/s) | 400 kbps | 400 × 5 = **2000 ms** | `devtools-frontend/front_end/core/sdk/NetworkManager.ts:690-704` (`Slow3GConditions`, label `slowG: '3G'`) |
| DevTools **"Slow 4G"** (was "Fast 3G") | 1.6 Mbps × 0.9 = 1.44 Mbps | 675 kbps | 150 × 3.75 = **562.5 ms** | same file `:706-718` |
| Lighthouse mobile | 1.6 Mbps | 750 kbps | **150 ms** | github.com/GoogleChrome/lighthouse/docs/throttling.md — "roughly the bottom 25 % of 4G and top 25 % of 3G" |
| CPU | Lighthouse "a constant **4x** CPU multiplier" for a mid-tier phone; its calibration table suggests **5x–20x** for slower targets | same |

RULE AF's "Slow 3G" = DevTools "3G" (the renamed preset). We used 4x and **6x** (closer to a T603/T606 on a desktop host).

---

## 2. MEASURED — our export on a 360 px phone

### 2.1 How the pages were made

- The **real multi-file export** ("Download site", `app/website/box-demo/page.tsx:834-836` → `renderSiteFiles` +
  `embedFontCss`) was re-run, unchanged, on the six dressed pages built **through the UI** in the tier-80 sweep
  (`scripts/uat/dressed-out/page-{0,1,13,32,38,40}.site.json`) — script
  `examples/t4-perf/export-sites.ts` (esbuild-bundled, calls the product functions; fonts fetched from Google exactly as the
  download does). Fresh production build `BaVMvndhy73YrD8CmQ6sY` (`check-fresh-build.js 3500` → FRESH) served the editor.
- Served gzip-compressed (what any static host or CDN does), cache disabled, one fresh context per run, **sequential**
  (CPU throttle stays honest) — `examples/t4-perf/measure.js`. 360×640, DPR 2, touch, Android Chrome UA.
- **What-if** (`examples/t4-perf/what-if.js`, research only): the same page with fonts cut to the `latin` subset as
  separate `.woff2` files and every `data:image` moved to its own file. Nothing else changed.
- Raw: `examples/t4-perf/results.json`; logs `scripts/uat/logs/t4-{build,measure,serve3500}.out` (untracked, like the
  other logs there — `scripts/uat/logs/` is **not** gitignored).

### 2.2 The table (KB = compressed bytes on the wire; ms from navigation start)

| Page | Profile / CPU | Req | Total KB | HTML | CSS | JS | Font | Img | FCP ms | LCP ms | Load ms |
|---|---|---|---|---|---|---|---|---|---|---|---|
| page-0 | 3G / 4x | 2 | **530** | 76 | **454** | 0 | (in CSS) | (in HTML) | **13 536** | 13 536 | 13 883 |
| page-0 | 3G / 6x | 2 | 530 | 76 | 454 | 0 | — | — | 13 616 | 13 616 | 14 113 |
| page-0 | Slow 4G / 4x | 2 | 530 | 76 | 454 | 0 | — | — | 3 928 | 3 928 | 4 171 |
| page-0 | Lighthouse / 4x | 2 | 530 | 76 | 454 | 0 | — | — | 2 964 | 2 964 | 3 216 |
| page-1 | 3G / 4x | 2 | 515 | 60 | 454 | 0 | — | — | 14 292 | 15 356 | 14 407 |
| page-13 | 3G / 4x | 2 | 507 | 52 | 454 | 0 | — | — | 14 144 | 15 152 | 15 157 |
| page-32 | 3G / 4x | 2 | 509 | 54 | 454 | 0 | — | — | 13 720 | 13 720 | 14 083 |
| page-38 | 3G / 4x | 2 | 501 | 47 | 454 | 0 | — | — | 13 812 | 14 372 | 14 227 |
| page-40 | 3G / 4x | 2 | 501 | 47 | 454 | 0 | — | — | 13 560 | 13 560 | 13 783 |
| **page-0 what-if** | 3G / 4x | 13 | **177** | **8.5** | **3.1** | 0 | 44 | 121 | **4 224** | 7 680 | 8 269 |
| page-0 what-if | Lighthouse / 4x | 10 | 137 | 8.5 | 3.1 | 0 | 44 | 81 (lazy held 3 back) | **464** | 932 | 1 315 |
| page-13 what-if | 3G / 4x | 10 | 136 | 7.5 | 3.1 | 0 | 44 | 81 | 4 404 | 7 912 | 8 330 |
| **editor** (`/website/box-demo`, what the app's WebView opens) | 3G / 4x | 49 | **1 094** | 4.5 | 133 | **909** | 37 | 1 | 11 120 | 11 120 | **29 586** |
| editor | Slow 4G / 4x | 49 | 1 094 | 4.5 | 133 | 909 | 37 | 1 | 3 288 | 3 288 | 9 281 |
| editor | Lighthouse / 4x | 49 | 1 094 | 4.5 | 133 | 909 | 37 | 1 | 2 700 | 2 700 | 6 105 |

All six pages: no sideways overflow at 360 (`scrollWidth` 360). Total blocking time is reported in `results.json` but is
noisy on a shared host (one 6x run read 4.6 s against 0.4 s for the same page at 4x) — not used for any conclusion.

### 2.3 Against the RULE AF budgets

| Budget | Ours today | Verdict | What-if |
|---|---|---|---|
| HTML + CSS + JS ≤ **100 KB** compressed | **501–530 KB** | **5× over** | 11–12 KB (+44 KB fonts) |
| First view on a 360 px phone ≤ **500 KB** | 501–530 KB, *with tiny 13 KB test photos* | **over**, and real photos make it far worse | 136–177 KB |
| First band within **5 s** on Slow 3G | FCP **13.5–14.3 s** | **~3× over** | **4.2–4.4 s — passes** |
| Editor in the app's WebView, first open | 1.09 MB, FCP 11.1 s, load **29.6 s** on 3G | no budget written yet (gap) | — |

### 2.4 Why — the causes, file:line

1. **The fonts are ~450 KB of base64 inside the render-blocking stylesheet.** `embedFontCss`
   (`lib/educo-ui/font-embed.ts:80-108`) requests `ital,wght@0,400;0,700;1,400;1,700` (`:50-55`) and inlines **every
   unicode-range subset Google returns** as `data:` URIs (`:100`) — for DM Sans + Poppins that is **20 faces: latin,
   latin-ext and devanagari** (measured: `/* devanagari */ ×4, latin ×8, latin-ext ×8`), 617 KB raw / 454 KB gzip /
   336 KB brotli. `renderSiteFiles` puts it **first in `styles.css`** (`lib/box-export.ts:859`). A browser downloads
   a `url()` face only when a glyph in its `unicode-range` is used and only *after* first paint (`font-display: swap`);
   a `data:` face is paid in full, **before** first paint, because it is part of the CSS. That one line is ~10 of the
   13.5 seconds. Latin-only, as files: 8 faces, 44 KB, and the CSS falls to 3 KB.
2. **Pictures live inside the HTML as base64.** `importPhoto` stores a `data:` URL (`lib/box-model.ts:4486-4540`,
   1600 px edge, JPEG q 0.82) and the export writes it straight into `<img src>` (`lib/box-export.ts:166`). So
   `loading="lazy"` (also `:166`) **cannot defer a single byte** — the bytes are already in the document; a repeated
   photo is sent once per use; nothing is cached across pages; there is no `srcset`, so a **1600 px** photo goes to a
   **360 px** (720 device-px) phone. The dressed pages use 13 KB test photos, so the table *understates* this: a real
   1600 px school photo at q 0.82 is typically **150–400 KB** (**UNVERIFIED** estimate, not measured here) — three of
   them alone pass the 500 KB first-view budget.
3. **The editor ships 909 KB of JS** (build: `/website/box-demo` 513 kB route, 673 kB first-load — `t4-build.out:339`)
   and links one Google Fonts stylesheet naming **48 families** (`app/layout.tsx:35`) — a render-blocking third-party
   request on every open. This is the app's school-builder screen (`apps/mobile/app/site-editor.tsx:105`, `editorUrl`).
   It is a builder, not a visitor page, so it needs its *own* budget and a cache-first strategy, not the 100 KB rule.

What is already right: **zero JS** on a published page unless two pinned bars need the stack script
(`lib/box-export.ts:714`), per-page **subset component CSS** (`:846`), shared `styles.css` cached across pages, `<link
rel=prefetch>` to siblings (`:925`), `width`/`height` on images, `font-display: swap`, no sideways overflow at 360.

### 2.5 The WebView app — not measured on an emulator, and why

Not run. Free memory was **2.3–3.2 GB** of 16 GB with the other sessions' processes; the phone AVD (`Pixel.avd`) asks for
`hw.ramSize=4096` and `Pixel_2` for 2048 — starting either would push the host into swap and corrupt every timing taken
beside it. And it would not model the target: an **x86_64 emulator on a desktop CPU** has none of a T603/T606's slowness,
and `adb emu network speed umts` / `network delay` throttle to the same kind of numbers CDP already applied. The
measurement that *would* add something is **on a real 2–4 GB Tecno / itel** (WebView cold start, LMK kills, memory of the
editor at 909 KB JS) — named as the real-world pass in §4 (RULE MAP step 5). Recipe kept for whoever has the memory:
`emulator -avd Pixel_2 -netspeed umts -netdelay umts`, then `chrome://inspect` → the WebView → Performance panel.

### 2.6 After BATCH A-1 — fonts and photos as files (re-measured 2026-10-15)

RA-7 (`fontFiles`: every subset a file under `fonts/`, each `@font-face` keeping its `unicode-range`) and RA-8
(`photosToFiles` + `addSrcset`: each photo one file under `images/`, 480 / 960 copies with `srcset`, `sizes="auto"` when
lazy). Same six dressed pages, same harness (`export-sites.ts --files`, then `measure.js`), HEADLESS timing; the copies
need a canvas, so this run ships originals only — an UPPER bound on photo bytes.

| | before (§2.2) | after A-1 |
|---|---|---|
| total on the wire, 360 × 640 @2× | 501–530 KB | 96–135 KB |
| HTML + CSS + JS + fonts | 500 KB+ (fonts inside `styles.css`) | 55–95 KB |
| first text, Slow 3G + 4× CPU | 13.5–14.3 s | 4.2–5.1 s (one 5.07 s run; 12 re-runs of the two heaviest pages 4.18–4.92 s) |
| first text, 3G / Lighthouse 4G | — | 1.24–1.44 s / 0.42–0.59 s |

Both RULE AF budgets now hold on all six pages (≤ 100 KB HTML + CSS + JS; first text ≤ 5 s on Slow 3G). The emulator was
run this time (2.6 GB free, one AVD): `scripts/uat/uat-a1-emulator.js`, the export downloaded through the UI opened in
the Pixel emulator's Chrome 148 (411 px @2.625×) — 9 / 9 (no sideways scroll, the right `srcset` copy, lazy holds, Yoruba
and Twi letters drawn). Still owed: the user's TCL 505 (Helio G36, 360 × 800), an APK for it (R-APP-1 decision 28).

**Found while proving it (A1-6, open, the user's decision):** of the 52 families in the font picker only 7 can write all
of Yoruba, Igbo, Hausa and Twi / Ga / Ewe (Inter, Montserrat, Merriweather, EB Garamond, Noto Serif, Anton, Great Vibes);
the default theme's Poppins and DM Sans write none of them — `scripts/uat/a1-font-coverage.js`, `a1-out/font-coverage.json`.

---

## 3. RULE MAP — the axes, the values, and what the builder must do (HOW in our engine)

| Axis | Values (with share where known) | What the app builder must do | HOW in our engine |
|---|---|---|---|
| **A. Device class** | A1 Go phone, 2 GB, T603/T606, Android 13 Go (itel A70, Spark Go) · A2 3–4 GB, G85/T606 (Galaxy A06, Smart 8) · A3 mid/high (Galaxy S, iPhone ≈ 16 % NG / 29 % GH) | Design and **measure at A1**: 360×640…360×806, CPU 6x. Zero JS by default; no layout work on scroll; no animation that needs the main thread | Device list already holds 360×640 / 360×800 / 393×851 (`lib/preview-devices.ts:70-75`). Add **CPU 6x + DevTools "3G"** as a sweep profile beside the screens (RULE AF rule 2 — the harness change it names) |
| **B. WebView version** | B1 current (auto-updated via Play) · B2 a few milestones behind (Play not opened) · B3 Android ≤ 12 ≈ 21 % NG | Progressive enhancement only: every modern CSS feature with a fallback (as `overflow-x: clip` already is, `lib/box-export.ts:910-912`); no feature the page *needs* that is newer than ~2 years | A `@supports` guard for each newer feature the emitters use (container queries, `:has`, view transitions); a unit guard listing them (gap) |
| **C. Network profile** | C1 DevTools "3G": 400 kbps / 2000 ms · C2 "Slow 4G": 1.44 Mbps / 562 ms · C3 Lighthouse: 1.6 Mbps / 150 ms · C4 offline | **≤ 100 KB** critical bytes; **≤ 4 requests** before first paint (each costs 2 s RTT on C1); first band < 5 s on C1 | Fonts out of the CSS (see D); pictures as files (see E); the page's own CSS inline (already, `lib/box-export.ts:846-849`); prefetch kept to idle (already) |
| **D. Fonts** | D1 system stack (0 KB) · D2 one family latin 400+700 (~20–45 KB) · D3 two families × ital × all subsets (**454 KB today**) | **Latin only by default** (+ the subset a chosen *language* needs, RULE AF rule 7); **separate `.woff2` files**, never `data:` in CSS; ital only if italics are used; preload the one heading face; ≤ 2 families (already the rule) | `embedFontCss` returns faces as **files** (`fonts/<family>-<subset>-<w>.woff2`) + `@font-face` with `url()`; keep only subsets whose `unicode-range` the site's text hits (the site's text is known at export); `renderSiteFiles` adds them to `SiteFiles` (binary-safe zip: `downloadSite` already uses fflate) |
| **E. Images** | E1 logo/icon (SVG, tiny) · E2 photo above the fold · E3 photo below the fold · E4 background photo | Files, not `data:`; **`srcset` at 360 / 720 / 1080 / 1600** with `sizes`; WebP (AVIF later); lazy below the fold, `fetchpriority=high` on the hero only; a photo budget per page | At export, decode each `data:` src once (same canvas path as `importPhoto`, `lib/box-model.ts:4500-4540`) into `img/<hash>-<w>.webp` per width; `<img srcset sizes>` from the block's column share (the engine knows it); de-duplicate by hash so a repeated photo is one file |
| **F. Data cost** | F1 first visit · F2 return visit (cache warm) · F3 user opted into "data saver" | Return visit ≈ HTML only (every shared file cached **immutable** with a hashed name); a **data-saver mode** that skips non-critical photos and web fonts | Hash in filenames (`styles.<hash>.css`); honour `Save-Data: on` / `navigator.connection.saveData` with a tiny inline check that swaps `srcset` for a tap-to-load placeholder (the one JS a page may carry, opt-in). The weight is **printed in the builder** before publish |
| **G. Power / interrupts** | G1 signal drops mid-load · G2 app backgrounded, renderer killed · G3 battery saver (throttled CPU) | Page readable from its first bytes (no JS gate); app reloads on `onRenderProcessGone` / iOS process terminate; forms queue (T-offline) | Already zero-JS first paint; WebView `cacheMode LOAD_CACHE_ELSE_NETWORK` + reload handlers (tablet doc §2 E); offline queue in `app-builder/offline-queue.md` |
| **H. Storage pressure** | H1 16–32 GB phones near full · H2 Go: WebView cache evicted first (inference) | Small, few cached files; a service worker caches **only** the school's pages + their assets, with a size cap | SW precache list = `SiteFiles` keys; cap (e.g. 5 MB) with LRU on pictures (gap — app layer) |
| **I. Skeletons / perceived speed** | I1 nothing until CSS · I2 text first, pictures fade in · I3 skeleton boxes | Text paints in the first 14 KB round-trip; every picture box reserves its space (`width`/`height`/`aspect-ratio` — already) with the band's colour behind it | Already reserves space; add `background-color` from the block's dominant colour as the placeholder (cheap, no JS) |
| **J. The editor in the WebView** | J1 first open (cold, 1.09 MB) · J2 later opens (cached) · J3 offline | The builder is an *app* asset: cache-first, versioned; budget **≤ 300 KB JS for first paint of the phone editor** (proposal) ; fonts: only the families the site uses, the picker loads the rest on demand | Split `/website/box-demo` (Inspector, galleries, catalogue lazy); replace the 48-family link (`app/layout.tsx:35`) with on-demand loading in the font picker; WebView `cacheMode` cache-else-network (tablet doc §2 E) |

---

## 4. Risks and mitigations

| # | Risk | Measured / evidence | Mitigation (owner: the app-builder build, by rule) |
|---|---|---|---|
| R1 | **Every published page is 5× the critical-byte budget** and paints in 13.5–14.3 s on 3G | §2.2 | D + E above; a **weight audit in the sweep** that fails a page over 100 KB critical / 500 KB first view (RULE AF rule 1 — the harness change it already names) |
| R2 | Real photos (1600 px, 150–400 KB each, **UNVERIFIED**) are worse than the test photos and dominate the first view | `lib/box-model.ts:4486`, `box-export.ts:166` | srcset + files + hero-only eager; measure with a real photo set in the sweep |
| R3 | Devanagari / latin-ext faces shipped to English-only sites; a Yoruba / Hausa site then needs *more* subsets | 20 faces measured | choose subsets from the site's own text and `lang` (RULE AF rule 7) |
| R4 | The editor costs 1.09 MB and 29.6 s on first open in the app | §2.2 | cache-first in the WebView; code-split; on-demand fonts; a first-paint budget for the phone editor |
| R5 | WebView cold start + LMK on 2 GB Go phones (not measured) | Android docs §1.2 | one WebView instance kept alive; reload on renderer death; **real-device pass** on an itel A70 / Spark Go before the pilot (RULE RK) |
| R6 | Old WebView (Play not updated) breaks a modern CSS feature | 21 % NG on Android ≤ 12 | `@supports` fallbacks + a guard enumerating the features the emitters use |
| R7 | Measurement drift: a desktop CPU throttled 4–6x is not a T606 | Lighthouse: 5–20x for low-end | keep 6x as the gate profile; calibrate once against a real phone (§2.5 recipe) |

---

## 5. Reproduce

```
npx next build && npx next start -p 3500        # then: node scripts/check-fresh-build.js 3500 → FRESH
npx esbuild docs/web-anatomy/app-builder/examples/t4-perf/export-sites.ts --bundle --platform=node --outfile=<tmp>/export.cjs --tsconfig=tsconfig.json
node <tmp>/export.cjs <tmp>/sites                # the real Download-site output for the six dressed pages
node docs/web-anatomy/app-builder/examples/t4-perf/what-if.js <tmp>/sites page-0
NODE_PATH=node_modules node docs/web-anatomy/app-builder/examples/t4-perf/measure.js <tmp>/sites results.json "http://localhost:3500/website/box-demo?theme=light"
```
Everything started for this run (next start 3500, the static server 3501, Chromium) was stopped; ports 3000–3501 free at the end (RULE K).
