# App builder (phone + tablet) — the session's OWN research (RULE RS / RULE MAP)

Date: 2026-10-08. Branch read: `app-builder/research`. No repo file changed.
Reads first: `docs/web-anatomy/tablet-and-app-editing.md` §2 E (WebView mechanics, store policy quotes — not repeated here
except where new text was found).

Legend: **[primary]** = read on the vendor's/platform's own page this session · **[secondary]** = review/aggregator site ·
**UNVERIFIED** = from a search summary or memory, not read at source.

---

## A. AI / no-code app builders (beyond Base44 / Emergent / Lovable)

| Builder | What it emits | Native / WebView / PWA | Phone vs tablet | Data · forms · auth | Editing after generation |
|---|---|---|---|---|---|
| **Bolt.new** | Code: React Native via an **Expo** starter (Bolt V2, Feb 2025) | Native (RN). Bolt builds no signed binary; you run EAS + your own developer accounts | Whatever RN code the model writes — no layout model. UNVERIFIED tablet handling | Code-level (typically Supabase) — UNVERIFIED | Chat → regenerates **code**; or edit the code by hand. [secondary: vp0.com/blogs/can-bolt-new-build-native-mobile-apps; hunted.space Bolt+Expo launch 13 Feb 2025] |
| **Replit Agent (mobile)** | Code: React Native + **Expo Router**, backend Replit PostgreSQL + Express | Native (RN), EAS pipeline, one-click TestFlight/App Store submission | Code-level | Postgres + Express it writes | Agent chat edits the code; Expo Go QR preview. [primary-ish: docs.replit.com/replitai/building-mobile-apps; secondary dev.to] |
| **FlutterFlow** | Visual model → **Flutter/Dart code** (viewable, exportable to GitHub) | Native (Flutter) + web | **Breakpoints** in Theme → Design System (mobile · tablet · tablet-landscape · desktop); per-widget **responsive visibility**; Nav Bar/App Bar shown per class | Firebase/Firestore or Supabase; auth both; forms = widgets + actions | Visual editor on the **model**, code regenerated; exported code can diverge ("layouts that look right in the builder can break" after export — safe areas, text scaling). [primary: docs.flutterflow.io/concepts/layouts/responsive; secondary: vp0.com flutterflow-layout-break] |
| **Adalo** | A hosted **model** (screens + collections), compiled per platform | Native iOS (IPA) / Android (AAB) + responsive web, one build | "Responsive" mode: desktop/tablet/mobile variants in one build (web) — UNVERIFIED for native tablet | Built-in **Collections** with properties + Relationships; Users collection = auth; forms bound to a collection | Visual editor; one change syncs to all three targets. [secondary: adalo.com posts — vendor marketing] |
| **Glide** | Hosted **model** (data + components) | **PWA only** — not in App Store / Play | "Mobile layout" vs "Large screen layout"; auto-adapts | Google Sheets, Airtable, Excel, SQL, Glide Tables/Big Tables (≤10M rows); row-owner auth | Visual editor on the model; live. [secondary: lowcode.agency/blog/glide-pwa; adalo.com glide-review] |
| **Thunkable** | Hosted **model** (drag-drop + blocks logic) | Native iOS/Android publish + web | "Responsive navigators / layout" — UNVERIFIED detail | Data sources: Google Sheets, Airtable, Webflow, Local Table; **Data Viewer** components bind lists/grids to them; has a **Web Viewer** component | Visual + blocks editor; Live Test app. [primary: docs.thunkable.com/getting-started/data-sources, …/data-viewers, …/web-viewer] |
| **Draftbit** | Was: visual builder → RN/Expo code. **2025–26 relaunch: AI-agent coding sandbox** (Claude Code / Codex) | Native (RN/Expo) | Code-level | External backend (Supabase / Firebase / Xano / Airtable) | Code export to GitHub/ZIP. [primary: draftbit.com/faq/can-i-export-and-continue-outside-draftbit; secondary rapidevelopers] |
| **Bubble (native mobile, beta → open 2025)** | Hosted **model**; mobile views rendered with **React Native** | Native, sharing data + workflows with the Bubble web app | Separate **mobile views** (not web pages): **tab views** (primary nav), **stack views** (back), **modal views** (forms, settings) — tablet UNVERIFIED | Bubble DB + workflows shared with web; device features: camera, photos, location, biometrics | Same Bubble editor, real-time preview. [primary: bubble.io/blog/native-mobile-beta, bubble.io/blog/bubblecon-2024-native-mobile; manual.bubble.io …/native-mobile-apps/quick-start-guide] |
| **Softr** | Hosted **model** (blocks over Airtable/own DB) | **PWA** (Professional plan+) | Responsive web blocks | Airtable / Softr DB, user groups & permissions | Visual editor. [primary: docs.softr.io how-to-create-a-mobile-app-from-a-softr-app] |
| **Rork** | Code: **Rork Pro** = React Native + Expo (iOS/Android/web); **Rork Max** = native **SwiftUI** (iPhone + iPad) | Native | Max targets iPad explicitly; Pro = code-level | Code-level | Chat iterations regenerate code; Expo Go preview. [secondary: banani.co/blog/rork-ai-review, rork.com/faq] |
| **a0.dev** (YC W25) | Code: React Native projects | Native, "one-click App Store deployment" | Code-level | UNVERIFIED | Chat → code. [secondary: ycombinator.com/companies/a0-dev] |
| **Anything (ex-Create.xyz)** | Code: Expo (RN) + built-in DB, functions, auth, storage, payments | Native; TestFlight / store submission | Code-level | Built-in full stack | Chat → code. **Its own iOS app was pulled 26 Mar 2026 under 2.5.2** (see C). [primary: expo.dev/blog/build-and-launch-ai-apps-with-create-and-expo; news: gigazine 2026-03-31, mjtsai.com/blog/?p=51328] |
| **v0 (Vercel)** | Code: **web** React + Tailwind + shadcn — **does not emit React Native** | Web/PWA (v0's own iOS app is RN) | Responsive web | Next.js / Vercel integrations | Chat → code. [secondary: vp0.com/blogs/does-v0-write-react-native; callstack podcast] |

### What the field says (findings)
1. **Two families.** *Code emitters* (Bolt, Replit, Rork, a0, Anything, Draftbit, v0) generate RN/Expo or web code; editing after
   generation = more prompts against code, and quality drifts with the model. *Model builders* (FlutterFlow, Adalo, Glide,
   Thunkable, Bubble, Softr) store a declarative **model** and render/compile it; editing = a visual editor on the model. Educo's
   RULE APP ("emit the app model, never code") puts us in the second family with an LLM composer on top — **none of the code
   emitters offer a deterministic visual editor after generation; the model builders mostly lack a strong LLM composer.** That gap
   is our position.
2. **The model builders converge on the same primitives:** screens (Bubble's *tab / stack / modal views*), a **data source** with
   collections + relationships, **list/collection viewers bound to data** (Thunkable Data Viewer, Adalo lists, Glide collections),
   forms bound to a record, a users collection for auth, device capabilities as actions.
3. **Tablet is weakly served almost everywhere.** Only FlutterFlow exposes explicit breakpoints + per-widget visibility + nav bar
   per class; Rork Max targets iPad via SwiftUI. Nobody advertises master-detail as a first-class pattern (UNVERIFIED as an absence).
4. **Every native publisher submits under the client's account or one-click into the client's account** — consistent with Apple
   4.2.6 ("submitted directly by the provider of the app's content") and Play's old template clause.

---

## B. App patterns in React Native / Expo, HIG and Material 3

### Navigation (Expo Router, file-based; repo uses expo-router 6 / SDK 54)
- **Stack** (push/pop, header, back), **Tabs** (bottom tabs, 3–5 peers), **Drawer**, **modal** routes; nesting tabs-in-drawer
  and stacks-in-tabs is the norm [primary: expo.dev/blog/nesting-tabs-and-drawers-with-expo; docs.expo.dev/router/advanced/tabs].
- **`expo-router/ui`**: headless tab components for custom tab bars (e.g. a sidebar on tablet, bottom bar on phone)
  [primary: docs.expo.dev/versions/v58.0.0/sdk/router/ui].
- **`SplitView`** (`expo-router/unstable-split-view`, **SDK 55+, alpha, "not ready for production"**): native iOS split view, ≤ 2
  `SplitView.Column` + optional `SplitView.Inspector`; collapses to one column on iPhone; **iOS only — falls back to a plain `Slot`
  on Android**; only at the root layout, cannot be nested [primary: docs.expo.dev/versions/latest/sdk/router/split-view]. Our app
  is on SDK 54 — not available without an upgrade, and Android master-detail must be built by hand (`useWindowDimensions`).
- Deep links: expo-router makes every screen linkable automatically; universal links / App Links need domain verification files
  (already recorded in §2 E).

### Tablet adaptations
- **Material 3 window size classes** (width): **Compact < 600dp · Medium 600–839 · Expanded 840–1199 · Large 1200–1599 ·
  Extra-large ≥ 1600**; height: Compact < 480 · Medium 480–899 · Expanded ≥ 900. "Used to make high-level application layout
  decisions, such as … a specific canonical layout" [primary: developer.android.com/develop/ui/compose/layouts/adaptive/window-size-classes].
  Canonical layouts: **list-detail**, **supporting pane**, **feed** (m3.material.io canonical layouts — UNVERIFIED, not fetched).
  Nav by class: navigation **bar** (compact) → navigation **rail** (medium/expanded) → **drawer**/expanded rail (large) — UNVERIFIED wording.
- **Apple HIG / iPadOS 18+**: a tab bar becomes a **sidebar** via `.sidebarAdaptable`; `NavigationSplitView` = 2–3 columns on iPad,
  single stack on iPhone; support Split View / Slide Over / Stage Manager at every ratio (size classes: compact/regular per axis)
  [secondary summaries of HIG — UNVERIFIED wording; source: developer.apple.com/design/human-interface-guidelines/layout].
- **Compare with our engine's rungs** (`lib/box-model.ts`: `phone` · `tabletPortrait` (600) · `tabletLandscape` (900) · `base`
  (desktop 1200) · `wide` (1800), in `em`): our 600 matches M3's compact/medium line exactly; our 900 vs M3's **840** and our 1800
  vs M3's **1600** differ. Our rungs are **width-only**; M3/HIG also use **height** (phone landscape = compact height).

### Lists, forms, offline, push
- Lists: `FlatList`/`SectionList` (virtualised) natively; in a WebView a long list is the DOM — pagination/`content-visibility`
  needed on low-cost phones (RULE AF) — inference.
- Forms: native `TextInput` + keyboard avoidance; in WebView the Android keyboard-covers-input trap (§2 E).
- Offline/sync: `expo-sqlite` (live queries, WAL) + a sync layer (Turso offline sync beta, PowerSync, WatermelonDB) — outbox
  queue of mutations replayed on reconnect is the standard pattern [primary: expo.dev/blog/build-offline-first-mobile-apps;
  docs.expo.dev sdk/sqlite]. `@react-native-community/netinfo` for connectivity (pinned for SDK 54, **not installed**).
- Push: `expo-notifications` — push tokens (APNs/FCM), schedule local one-off/repeating, badges, foreground/background listeners
  [primary: docs.expo.dev/versions/latest/sdk/notifications]. **Not installed** in `apps/mobile/package.json`.

---

## C. Store policy for generated / WebView apps (exact current text)

Apple — read at developer.apple.com/app-store/review/guidelines/ on 2026-10-08 (page shows no "last updated" date):
- **4.2 Minimum Functionality:** "Your app should include features, content, and UI that elevate it beyond a repackaged website. If
  your app is not particularly useful, unique, or 'app-like,' it doesn't belong on the App Store. If your App doesn't provide some
  sort of lasting entertainment value or adequate utility, it may not be accepted."
- **4.2.2:** "Other than catalogs, apps shouldn't primarily be marketing materials, advertisements, web clippings, content
  aggregators, or a collection of links."
- **4.2.3 (ii):** "If your app needs to download additional resources in order to function on initial launch, disclose the size of
  the download and prompt users before doing so."
- **4.2.6:** "Apps created from a commercialized template or app generation service will be rejected unless they are submitted
  directly by the provider of the app's content. These services should not submit apps on behalf of their clients and should offer
  tools that let their clients create customized, innovative apps that provide unique customer experiences. Another acceptable
  option for template providers is to create a single binary to host all client content in an aggregated or 'picker' model, for
  example as a restaurant finder app with separate customized entries or pages for each client restaurant, or as an event app with
  separate entries for each client event."
- **4.3(a):** "Don't create multiple Bundle IDs of the same app (for example, submitting a separate map app for every city in the
  world instead of a single worldwide map that allows users to search any city)… If your app has different versions for specific
  locations, sports teams, universities, etc., consider submitting a single app and providing the variations using in-app purchase."
- **4.3(b):** "Don't submit apps that are indistinguishable from what's already widely available…"
- **4.7:** "Apps may offer certain software that is not embedded in the binary, specifically HTML5 and JavaScript mini apps and mini
  games, streaming games, chatbots, and plug-ins… You are responsible for all such software offered in your app… must also ensure
  that the software adheres to the additional rules that follow in 4.7.1 through 4.7.5."
- **2.5.2:** "Apps should be self-contained in their bundles, and may not read or write data outside the designated container area,
  nor may they download, install, or execute code which introduces or changes features or functionality of the app, including other
  apps…"
- **New since §2 E — 2.5.2 enforced against app generators (2026):** Replit's updates blocked from Dec 2025 (resolved 15 May 2026),
  Vibecode blocked, **Anything removed 26 Mar 2026** even after routing previews to an external browser; Apple reportedly asked for
  previews to open in an external browser rather than in-app views [news: mjtsai.com/blog/?p=51328; gigazine.net 2026-03-31;
  boingboing 2026-04-02 — secondary]. **Implication for Educo:** keep the app a *content host* (school sites = web content, 4.7-style
  HTML5 under our responsibility) — never let a school's "app" add native capability at runtime; native capabilities ship in the
  binary and are switched on by data, not code.

Google Play — read at support.google.com/googleplay/android-developer/answer/9899034 and /9898783 on 2026-10-08:
- **Webviews and affiliate spam:** "We don't allow apps whose primary purpose is to drive affiliate traffic to a website or provide a
  webview of a website without permission from the website owner or administrator." Example: "Apps whose primary purpose is to
  provide a webview of a website without permission".
- **Repetitive content:** "We don't allow apps that merely provide the same experience as other apps already on Google Play…"
  Example: "Creating multiple apps with highly similar functionality, content, and user experience. If these apps are each small in
  content volume, developers should consider creating a single app that aggregates all the content."
- **Limited functionality and content:** "Apps that are static without app-specific functionalities, for example, text only or PDF
  file apps"; "Apps with very little content and that do not provide an engaging user experience"; "Apps that are designed to do
  nothing or have no function". **Broken functionality:** "We don't allow apps that crash, force close, freeze, or otherwise function
  abnormally" (incl. "Apps that load, but are not responsive").
- **Template/wizard clause — NOT on the current page.** The 2018 text ("apps that are created by an automated tool or wizard service
  … submitted to Google Play by the operator of that service on behalf of other persons") was found only in 2018 press coverage
  [techcrunch.com/2018/07/27/google-follows-in-apples-footsteps-by-cleaning-up-its-play-store]; UNVERIFIED whether it still lives
  elsewhere in the Policy Center. The current "Repetitive content" bullet covers the same ground.

**Net for Educo:** one binary (the Educo app), schools as entries inside it (4.2.6 picker model, 4.3(a), Play repetitive-content),
we own/operate the sites (Play webview permission), and the native layer (push, offline, deep links into Fees/Messages/Reports) is
the 4.2 "app-like" lift. A per-school white-label binary would have to be submitted from the school's own developer account (4.2.6)
— out of scope unless the user decides otherwise.

---

## D. THE MAP — axes an app adds beyond a website, on our block model

What exists (measured in the repo):
- `BoxType` = `container | text | heading | button | link | image | video | icon | divider | list | embed | spacer | component`
  (`lib/box-model.ts:25`); components via `component?: string` (accordion, alert; registry: card, quote, stat, badge, rating).
- Links: `href` = external URL · `#anchor` · `page:<id>` (`lib/box-model.ts:71, 483`). `hidden` + per-rung `responsive` overrides;
  `tag` = semantic tag; `pager` (scroll-snap pager) exists.
- `Site { pages: Page[]; nav: NavItem[]; header?; theme; publishedUrl? }` (`lib/site-storage.ts:236`) — site-level nav is a link list.
- Rungs: `phone · tabletPortrait · tabletLandscape · base · wide` — width only.
- `apps/mobile/app`: `(tabs)/{index, children, fees, messages, more}` + `drive, file-preview, modal, payment-history,
  report-details, reports, site-editor, term-progress`. `site-editor.tsx` = WebView over the web editor (`react-native-webview
  13.15.0` installed). **Not installed:** expo-notifications, netinfo, expo-sqlite, expo-secure-store.
- **No** form/input block, **no** data source/binding, **no** auth/role concept, **no** screen/route type distinct from a page.

| # | Axis | Values | How it would be made (block model in WebView vs native chrome) | Exists? |
|---|---|---|---|---|
| 1 | **Navigation shell** | none (website) · bottom tabs (3–5) · nav rail · sidebar · drawer · top tabs · stack header with back | **Native chrome** (expo-router Tabs/Stack/Drawer, `expo-router/ui` headless tabs for rail/sidebar) reading a shell description from the site model; inside WebView only as a fallback/PWA. Shell = **data** (which pages are tabs, icons, order) → no code download (2.5.2) | Partial: `Site.nav` link list; app has fixed `(tabs)` |
| 2 | **Screen kind** | page (scrolls) · list · detail · form · modal/sheet · settings · empty/error/offline state | A screen = a `Page` with a `screenKind` + root tree of blocks rendered in WebView; modal/sheet presented by native chrome (expo-router modal) | Gap: pages only |
| 3 | **Navigation transition / route** | push (stack) · tab switch · present modal · replace · back · deep link `educo://school/x/screen/y` | `href` gains `screen:<id>` + `mode` (push/modal); WebView posts `{nav}` over the bridge → native router; expo-router deep links per screen | Partial: `page:<id>` href only |
| 4 | **Device class / layout** | compact (<600) · medium (600–839) · expanded (840–1199) · large (1200–1599) · XL (≥1600); + height compact (<480) | Block layout: existing rungs in the export (CSS); **shell** choice by size class in native chrome (tabs ↔ rail/sidebar); master-detail = two WebViews or one page with a two-pane row at ≥ tabletLandscape | Partial: width rungs; 840/1600 and height missing |
| 5 | **Orientation** | portrait · landscape · locked · free | App config `orientation: "default"`; block model gets it via width rungs; height-class needed for phone landscape | Partial |
| 6 | **Adaptive pattern** | single column · list-detail · supporting pane · feed | Block-level: a "split" container whose detail pane becomes a pushed screen below medium; native SplitView (SDK 55+, iOS, alpha) not relied on | Gap |
| 7 | **Data source** | static content · Educo records (students, fees, messages, events, results) · school collection (user-defined) · external (Sheets/Airtable) — UNVERIFIED need for external | Read through the **app/API**, never from the page directly: the WebView asks the bridge or a signed API; schema in the site model | Gap |
| 8 | **Data binding** | none · list repeats a template block per record · detail binds fields of one record · field → text/image/href · filter/sort/search · empty state | New `bind` on a node (`{source, field}`) + a repeater container (`repeat: {source, filter, sort}`), resolved at render by the export or client script | Gap (only static `list` block) |
| 9 | **Form & submission** | inputs (text, number, date, select, checkbox, file/photo, phone) · validate · submit to Educo record / email / WhatsApp · **offline queue** (queued → sent, with visible state) | Form + input blocks in the model (HTML `<form>` in the export, labelled — WCAG); submission via bridge to native **outbox** (expo-sqlite + netinfo) so it survives the WebView process dying | Gap |
| 10 | **Auth & roles** | public · signed-in · role: parent · student · teacher · admin · per-school | Native owns the session (expo-secure-store), hands it to the WebView (`injectedJavaScriptObject` / cookies, §2 E); node `visibleTo: role[]`, screen `requires: role` — enforced server-side too (trust boundary) | Gap (`hidden` is per-rung only) |
| 11 | **Native capability** | push (topic: closures, newsletter, fees due) · local reminders · camera/photo · location/map · share · open in browser · call/WhatsApp/SMS · biometrics · offline cache · badge | **Native chrome only**, shipped in the binary; a block's action can *request* one by name over the bridge (whitelisted, data not code — 2.5.2) | Gap (WebView photo input works; push not installed) |
| 12 | **Action / event** | navigate · submit · call API · open native capability · toggle/state · refresh | `actions: [{on: tap, do: …}]` on nodes (components already have `ItemAction` for alerts) → generalise | Partial (alert actions, href) |
| 13 | **Offline behaviour** | always online · cached read (last copy) · offline write queue · download for offline (term dates) | Native cache of exported HTML + data snapshot; WKWebView service workers need App-Bound Domains (§2 E) so the cache lives native-side | Partial: site-editor has offline state |
| 14 | **App identity** | inside Educo app (picker, 4.2.6) · PWA install · own binary (school account) | Picker entry in Educo app; manifest for PWA from the export | Partial (rule 20 decision) |
| 15 | **Safe areas & system UI** | notch/insets · status bar style · edge-to-edge (Android SDK 54 forced) · keyboard insets | Native chrome pads; export gets `env(safe-area-inset-*)` | UNVERIFIED in export |

### Top gaps (what the block model has no concept of yet)
1. **Data**: no data source, binding, or repeater — every list/detail screen (fees, results, events, messages) is impossible as blocks.
2. **Forms**: no input/form block, no submission target, no offline outbox.
3. **Auth/roles**: no per-role visibility or screen guards; `hidden` is per-breakpoint only.
4. **Screens & app navigation**: a `Page` has no screen kind, no modal/sheet, no push vs tab semantics; `Site.nav` cannot describe a tab
   bar/rail/sidebar shell, and `href` has no `screen:`/modal mode.
5. **Native capability bridge**: no named, whitelisted action vocabulary from a block to native (push opt-in, camera, call/WhatsApp,
   share); `expo-notifications`, netinfo, expo-sqlite, secure-store are not installed.
6. **Adaptive patterns / size classes**: rungs are width-only and differ from M3 at 840 and 1600; no height class; no list-detail
   container that collapses into a pushed screen.
7. **Policy guard**: nothing yet stops an app-model change from adding native behaviour at runtime — must be designed as data-only
   (2.5.2 enforcement against generators in 2026).

### Sources (all URLs used)
- https://developer.apple.com/app-store/review/guidelines/
- https://support.google.com/googleplay/android-developer/answer/9899034 · https://support.google.com/googleplay/android-developer/answer/9898783
- https://techcrunch.com/2018/07/27/google-follows-in-apples-footsteps-by-cleaning-up-its-play-store
- https://mjtsai.com/blog/?p=51328 · https://gigazine.net/gsc_news/en/20260331-apple-pulls-vibe-coding-app-anything/ · https://boingboing.net/2026/04/02/apple-bans-vibe-coding-apps-from-the-app-store.html
- https://developer.android.com/develop/ui/compose/layouts/adaptive/window-size-classes
- https://docs.expo.dev/versions/latest/sdk/router/split-view/ · https://docs.expo.dev/versions/v58.0.0/sdk/router/ui · https://expo.dev/blog/nesting-tabs-and-drawers-with-expo · https://docs.expo.dev/router/advanced/tabs
- https://docs.expo.dev/versions/latest/sdk/notifications · https://expo.dev/blog/build-offline-first-mobile-apps
- https://docs.flutterflow.io/concepts/layouts/responsive · https://vp0.com/blogs/flutterflow-layout-break-github-export
- https://bubble.io/blog/native-mobile-beta/ · https://bubble.io/blog/bubblecon-2024-native-mobile · https://manual.bubble.io/beta-features/native-mobile-apps/quick-start-guide
- https://docs.thunkable.com/getting-started/data-sources · https://docs.thunkable.com/app-design/ui-components/data-components/data-viewers · https://docs.thunkable.com/app-design/ui-components/embed-components/web-viewer
- https://draftbit.com/faq/can-i-export-and-continue-outside-draftbit · https://www.rapidevelopers.com/md/review/draftbit
- https://www.lowcode.agency/blog/glide-pwa · https://www.adalo.com/posts/glide-review/ · https://www.adalo.com/posts/adalo-vs-glide-2026-comparison/
- https://docs.softr.io/how-to-guides/how-to-create-a-mobile-app-from-a-softr-app
- https://www.banani.co/blog/rork-ai-review · https://rork.com/faq · https://ycombinator.com/companies/a0-dev
- https://expo.dev/blog/build-and-launch-ai-apps-with-create-and-expo.md · https://www.superappp.com/blog/anything-ai-app-builder-review-2026
- https://docs.replit.com/replitai/building-mobile-apps · https://dev.to/siddhesh_surve/the-end-of-xcode-replit-just-dropped-text-to-app-store-for-ios-android-2m4j
- https://vp0.com/blogs/can-bolt-new-build-native-mobile-apps · https://hunted.space/dashboard/bolt-new/launches/bolt-expo
- https://vp0.com/blogs/does-v0-write-react-native · https://www.callstack.com/podcasts/building-v0-ios-and-fixing-react-native-along-the-way

Not read this session (left open per RULE R): m3.material.io canonical layouts + navigation pages; Apple HIG layout/size-classes pages
at source; Thunkable/Adalo tablet specifics; Google Play Policy Center search for a surviving template clause.
