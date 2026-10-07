# Editing on a TABLET, and the app as a webview — research for BATCH E-5c

Captured 2026-10-07. Extends, never redoes, `docs/web-anatomy/phone-editing.md` (signed, D1–D6), whose §6 named the tablet
and the app as gaps. The user waived their own sources for E-5c ("I will leave you to do the research on this one").
Anything not read from a source is marked **inference**. Every claim cites the page it came from.

What our editor does today on a tablet (read from the code, `app/website/box-demo/page.tsx`, not a source):
- under **37.5em (600px)** the canvas opens on the Mobile device 1:1 (E-5a, D1); **600–1023px** keeps the "full" device (the
  desktop page fitted), the Inspector folds to a tab under **64em (1024px)**, the blocks panel floats (docks only ≥ 64em);
- `BoxCanvas` follows each gesture by its own `pointerType` (E-5b) and sizes a finger's drop strips by the DRAG, not the device (E5b-13).

---

## 1. Tablets, product by product

| Product | Edits on a tablet? | Canvas | Picker / settings | Input notes | Source |
|---|---|---|---|---|---|
| **Wix (classic Editor)** | **No.** "The Wix Editor is not supported on iPads or tablets." | — (tablets VIEW the desktop site: "All tablet devices, regardless of operating system, display the desktop version of your site.") | — | "visitors can tap their screens but cannot hover" | support.wix.com/en/article/wix-sites-compatibility-with-ipads-and-tablets |
| **Wix Studio** | not documented as a tablet tool (edits a **Tablet breakpoint 751–1000px** from a desktop) | iPad Pro 1024 sees the **Desktop** breakpoint (1001+) | — | — | support.wix.com/en/article/studio-editor-designing-across-breakpoints (search snippet; page not opened in full) |
| **Squarespace app (iPad)** | content only, same as phone: "not possible to add or rearrange blocks on pages in the app" | the page | **tabs move from the bottom (phone) to the LEFT side (iPad)**; "There's also a tablet view icon on iPads" | **Split View: drag images from Photos straight onto the site**; "app isn't currently supported on Android tablets" | support.squarespace.com/hc/en-us/articles/360002093708 · /206545667 |
| **Squarespace in an iPad browser** | not addressed by the help centre; a third-party page says it "works on iPad but is not fully optimized for touch" (unofficial) | — | — | — | websitebuilderinsider.com/can-i-edit-squarespace-on-ipad (low trust) |
| **Notion (iPad)** | **yes** (documents, not pages of a site) | the page at the window's width | **"Keep your sidebar open when you're working in landscape orientation. It'll close automatically when you rotate … to portrait."** Menus (Share, •••, Quick Find) "now open in a **pop-up window instead of full-screen**" on tablets | keyboard: slash commands, shortcuts, arrow keys, shift+arrow; with keyboard/trackpad/mouse "Click & drag to rearrange content blocks, or selections of multiple content blocks"; columns could not be CREATED on tablets in 2020 (later: drag to a side, see phone doc) | notion.com/releases/2020-04-07 · /2020-10-15 |
| **WordPress app (iPad/Android tablet)** | **yes** — the same native block editor as the phone | blocks at the window's width | the same **bottom sheet**, but **capped at `max-width: 512`** and centred; height **59 % of the window in portrait, 96 % in landscape**, shrunk above the keyboard (`0.95 × (window − keyboard − status bar − header)`) | as phone (long-press drag, arrows) | gutenberg v17 `components/src/mobile/bottom-sheet/index.native.js` + `styles.native.scss` |
| **Shopify app** | runs on iPad; theme editor same as phone (sections list) | preview + list | list | community report: the customise editor "fails to display menus properly on iPad" (Safari, Chrome and app) | help.shopify.com/en/manual/shopify-admin/shopify-app (snippet) · community.shopify.com/t/…/242592 (snippet) |
| **Canva (iPad)** | yes (free-form designs) | fitted design, pinch zoom (phone doc) | side panel ~**350px** left/right on desktop, **full width on mobile** (Canva's own app-panel guideline) | Draw app works with Apple Pencil (third-party pages only) | canva.dev/docs/apps/design-guidelines/layout (snippet); canva.com/help/navigate-canva-mobile-app has **no tablet content** |
| **Google Sites** | **No.** "when you edit your site, you must use a computer" | — | — | users: on iPad Safari "unable to move objects … when using touch but it works when we use the trackpad"; Pencil no better than touch | support.google.com/sites/answer/6372874 · education.apple.com/en/thread/250014455 (2022) |
| **Webflow** | **No** — Designer needs ≥ 1280–1440px and blocks mobile user agents | — | — | forum: "not well adapted to touch surfaces" | discourse.webflow.com threads (snippets; the forum now redirects, pages not opened) |
| **Framer** | no tablet editor documented (phone doc: CMS + on-page editing) | — | — | — | search found nothing official |
| **Figma** | **No** — iPad browser editing "isn't officially supported"; app is view/comment only | — | — | users: trackpad zoom broken in iPad browser | forum.figma.com (snippets) |

**Reading:** of twelve products, **only WordPress and Notion build on a tablet**, and both do it as **the phone editor given more
room** (the page at the window's own width, a sheet or popover capped in width, a sidebar that stays open in landscape). The
canvas tools (Wix, Webflow, Google Sites, Figma) refuse tablets; Squarespace's only tablet-specific moves are **navigation on the
left** and **Split View drag-in of photos**. Nobody edits the desktop page fitted onto a tablet by touch — and the one report of
trying (Google Sites on iPad) found **touch cannot move objects while a trackpad can**. Saturation: the last five products
(Shopify, Canva, Framer, Figma, Webflow) added no new value on axes A–C.

## 2. THE MAP (RULE MAP) — axes, values, who, how

### A. What a tablet's canvas shows
| Value | Who | How / evidence |
|---|---|---|
| A1 the page **at the window's own width, 1:1** | WordPress, Notion | native editors lay blocks out at the window width (gutenberg native; notion releases 2020-04-07) |
| A2 the **desktop page fitted** | ours today (600–1023); Wix shows tablets the desktop SITE (viewing, not editing) | wix compatibility page |
| A3 fitted + pinch-zoom | Canva (free-form designs only) | phone doc §3 |
| A4 a **tablet breakpoint** edited from a desktop | Wix Studio 751–1000, Webflow, Squarespace "tablet view icon" | wix studio breakpoints; squarespace 206545667 |
| A5 **rotation mid-edit** re-lays the chrome, not the content | Notion: sidebar open in landscape, closes in portrait | notion 2020-04-07 |
| Which rung 768 / 1024 fall on | Android: **600 ≤ medium < 840 (93.73 % of tablets in portrait)**, **840 ≤ expanded < 1200 (97.22 % of tablets in landscape)**; our rungs 600 / 900 / 1200 put 768 on tablet-portrait and 1024 on tablet-landscape | developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes |

### B. Where the block picker and the settings live
| Value | Who | How |
|---|---|---|
| B1 bottom sheet, full width | phones (WordPress, NN/g) | phone doc |
| B2 **bottom sheet capped (512) and centred** | WordPress on tablets | `max-width: 512`, `getWidth() = min(window.width, maxWidth)`; height 59 % portrait / 96 % landscape |
| B3 **popover / pop-up window instead of full screen** | Notion on tablets | notion 2020-04-07 |
| B4 **side panel that stays open in landscape, closes in portrait** | Notion (sidebar) | notion 2020-04-07 |
| B5 docked side panel (~350px) | Canva desktop; ours ≥ 1024 | canva.dev layout guideline (snippet) |
| B6 navigation tabs on the left instead of the bottom | Squarespace app on iPad | squarespace 360002093708 |
| The deciding number is the WINDOW, not the device | Apple: size classes depend on "device type, window configuration, and multitasking state"; Android: "not device-specific … can change … split-screen/multi-window … window resizing" | developer.apple.com HIG layout (JSON); Android window size classes |

### C. The selected block's toolbar
No tablet-specific source found (WordPress native and Notion use the phone toolbar unchanged — inference from the same
native code serving both). **Inference:** keep the E-5a phone toolbar at 600–1023 — the finger floor (44px) is the same on
a tablet, and the deciding input (axis D) is the same finger.

### D. Input on a tablet
| Value | Facts | Source |
|---|---|---|
| D1 finger | `pointer: coarse`, `hover: none` | MDN hover; web.dev/learn/design/interaction |
| D2 **iPad + trackpad / mouse** | since the WebKit fix (iOS 13.4 support, bug FIXED 2020-10-06): `any-hover: hover` and `any-pointer: fine` are true **whenever a mouse/trackpad is connected**; `hover: hover` / `pointer: fine` only "when a mouse is the **active** input" | bugs.webkit.org/show_bug.cgi?id=209292 (and 210024, its duplicate) |
| D2' the same, the article's reading | "when a paired Bluetooth mouse is added to an iPad, `pointer` and `hover` remain unchanged, but `any-pointer` and `any-hover` update"; "It's not 'touch or mouse/keyboard' … but 'touch **and** mouse/keyboard'"; offer a manual toggle when detection is unreliable | css-tricks.com/?p=320427 (Patrick H. Lauke, 2020-09-14) |
| D3 Android tablet + mouse / stylus | same pattern: `any-*` change, primary may not | css-tricks (Lauke) |
| D4 **Apple Pencil** | `PointerEvent.pointerType === "pen"`; Pencil **hover** on M2+ iPad Pro since Safari 16.1 ("users see hover states for links…"); pointer-move sampling with Pencil Pro is coarser than touch-move (unanswered report, 2025) | MDN pointerType; webkit.org/blog/13399; developer.apple.com/forums/thread/776468 |
| D5 multi-input means **more than one value matches** | "More than one value can match if the available devices have different characteristics" | MDN any-pointer |
| D6 **keyboard** | Notion iPad: the desktop shortcuts, arrows, shift+arrow; Canva: desktop shortcut set | notion 2020-04-07/2020-10-15 |
| D7 **window narrowing** | iPad Split View 1/3 → compact width, Slide Over compact, Stage Manager freely resizable; Android multi-window changes the class at run time | Apple multitasking archive (snippet); Android window size classes |
| D8 **what the browser claims to be** | iPad Safari presents as **Mac** by default (UA "Macintosh"; `navigator.maxTouchPoints` 5 tells them apart); Chrome on Android gives **desktop mode by default only on "premium" tablets (≥ 10" AND ≥ 8 GB RAM)** — "Devices with less memory default to mobile sites"; in desktop mode the viewport "matches window width", not 980px | developer.apple.com/forums/thread/119186 (snippet); developer.chrome.com/blog/desktop-mode (2023-12-11, Chrome 119); support.google.com/chrome/answer/13514529 |

**Consequence for our code (inference from the facts above):** sizing for a finger by `pointer: coarse` is right for the
primary input, but an iPad with a trackpad attached still reports `pointer: coarse` until the trackpad is the active input —
so a 600–1023 window must NOT switch to "desktop editing" on `any-pointer: fine`. Decide by **window width** (as today) and use
`pointerType` per event (already E-5b's pointer-events path) for what a gesture means. Never sniff the user agent (Chrome
blog: "Use feature detection").

### E. The app: `apps/mobile/` hosting the web editor in a webview
Measured in the repo: Expo SDK **54** (`expo ~54.0.30`), RN **0.81.5**, expo-router 6, `scheme: "educo"`,
`ios.supportsTablet: true`, `orientation: "default"`; **`react-native-webview` is not installed** — SDK 54 pins
**`react-native-webview 13.15.0`** (`node_modules/expo/bundledNativeModules.json`); it is "Included in Expo Go" and installed with
`npx expo install react-native-webview` (docs.expo.dev/versions/v54.0.0/sdk/webview). Also pinned there, none installed:
`expo-notifications ~0.32.15`, `expo-secure-store ~15.0.8`, `expo-image-picker ~17.0.10`, `@react-native-community/netinfo 11.4.1`.

| Need | How (react-native-webview docs unless noted) |
|---|---|
| load the editor | `source={{ uri }}` — "the most common use-case"; `startInLoadingState`, `renderError`, `onHttpError` |
| keep navigation inside our domain | `onShouldStartLoadWithRequest` / `originWhitelist`; Android guide: open other hosts in the browser |
| **auth / session handover** | (a) cookies: `sharedCookiesEnabled` (iOS, default **false**) + `@react-native-cookies/cookies`; Android `thirdPartyCookiesEnabled` default true; (b) headers apply **only to the first load** — later navigations must be intercepted and re-issued; (c) `injectedJavaScriptObject` → `window.ReactNativeWebView.injectedObjectJson()` passes data **before the page loads, avoiding the Android race** of `injectedJavaScriptBeforeContentLoaded` |
| **bridge** | page → app: `window.ReactNativeWebView.postMessage(string)` — "You must set `onMessage` or the … method will not be injected"; app → page: `injectJavaScript` on the ref |
| **photos from the camera roll** | `<input type="file">` works: iOS needs `NSCameraUsageDescription` / `NSPhotoLibraryUsageDescription` (/ Microphone); Android "File uploads do not require storage permissions"; camera offered via `accept`/`capture`, manifest `<queries>` for `IMAGE_CAPTURE`; `multiple` honoured; check `WebView.isFileUploadSupported()` |
| downloads | Android DownloadManager built in; **iOS: "you are going to have to supply your own code"** (`onFileDownload`) |
| **keyboard** | iOS: `hideKeyboardAccessoryView`, `keyboardDisplayRequiresUserAction`, `removeIosKeyboardObserver`; Android: known trap — keyboard covers inputs at the bottom even with `adjustResize` (several forums); Expo SDK 54 makes Android **edge-to-edge always on** ("cannot be disabled"), so insets must be handled (expo.dev/changelog/sdk-54; docs.expo.dev/guides/keyboard-handling) |
| **back** | Android: `BackHandler` → `webViewRef.goBack()` when `canGoBack`; iOS: `allowsBackForwardNavigationGestures` (off by default); predictive back is **off by default in SDK 54** (changelog) |
| pull-to-refresh | `pullToRefreshEnabled` — **iOS only** |
| **offline / caching** | Android `cacheMode` (`LOAD_CACHE_ELSE_NETWORK`, `LOAD_CACHE_ONLY`…); `cacheEnabled` both; **service workers in WKWebView need App-Bound Domains** (`WKAppBoundDomains`, ≤ 10 domains, + `limitsNavigationsToAppBoundDomains`, iOS 14+) — and opting in **restricts injected JS / message handlers / cookie APIs to those domains** (webkit.org/blog/10882; inappwebview.dev/docs/service-worker). Without the key: "pre-iOS 14.0 WKWebView behavior, with no restricted APIs" |
| **crashes / memory** | iOS `onContentProcessDidTerminate`: the web process can be killed "to liberate memory … It's not unexpected to have WebViews get terminated after a while in the background" → reload; Android `onRenderProcessGone` (API 26+); Android guide: `destroy()` the WebView or leak memory |
| debugging | `webviewDebuggingEnabled` (default false) |
| security | Android guide: a JS bridge "lets JavaScript control your app … DANGEROUS" — only with our own content, never let it navigate to untrusted pages; `setSupportMultipleWindows` false exposes a UXSS (CVE-2020-6506) |
| **deep links** | expo-router: "deep linking is automatically enabled for all of your app's screens"; universal links / Android App Links need a domain with verification files; "support for incoming links in Expo Go is limited" (docs.expo.dev/linking/overview) |
| the Android engine | Android System WebView updates through Google Play / Jetpack Webkit (developer.android.com/develop/ui/views/layout/webapps/webview) — so Chrome-level features on old Androids (inference: still bounded by device RAM) |

**The store policies, quoted:**
- Apple **4.2**: "Your app should include features, content, and UI that elevate it beyond a repackaged website. If your app is not
  particularly useful, unique, or 'app-like,' it doesn't belong on the App Store."
- Apple **4.2.2**: "Other than catalogs, apps shouldn't primarily be marketing materials, advertisements, web clippings, content
  aggregators, or a collection of links."
- Apple **4.2.6**: "Apps created from a commercialized template or app generation service will be rejected unless they are submitted
  directly by the provider of the app's content… Another acceptable option for template providers is to create a **single binary to
  host all client content in an aggregated or 'picker' model**" — this IS rule 20's "the school site is a section inside the
  Educo app".
- Apple **4.3(a)**: "Don't create multiple Bundle IDs of the same app (for example … a separate map app for every city…)… If your app
  has different versions for specific locations, sports teams, universities, etc., consider submitting a single app" — an app per
  school would be rejected.
- Apple **2.5.6**: "Apps that browse the web must use the appropriate WebKit framework and WebKit JavaScript." (react-native-webview
  uses WKWebView — inference from the library's iOS props.) **2.5.2**: may not "download, install, or execute code which introduces or
  changes features or functionality of the app" (inference: the risk is a remote editor that adds native-bridge capabilities; the
  editor itself is web content).
- Google Play **Spam**: "We don't allow apps whose primary purpose is to drive affiliate traffic to a website or **provide a webview of
  a website without permission from the website owner or administrator**." **Minimum functionality**: no apps "static without
  app-specific functionalities" or "with very little content"; **Broken functionality**: no apps that "crash, force close, freeze" or
  "load, but are not responsive". (support.google.com/googleplay/android-developer/answer/9899034 · /9898783)
- **What makes ours acceptable:** we own the site (Play's permission test), it is one binary for every school (4.2.6, 4.3), and the
  native layer rule 20 names (push, offline term dates, deep links into Fees / Messages / Reports — screens that already exist in
  `apps/mobile/app/(tabs)`) is what lifts it above "a repackaged website" (4.2).

### F. Low-cost Android tablets in Nigeria and Ghana (RULE AF)
| Fact | Nigeria | Ghana | Source |
|---|---|---|---|
| tablet share of all browsing | **0.43 %** | **0.92 %** | gs.statcounter.com platform-market-share, Sept 2026 |
| top tablet **CSS** resolutions | **601×1007 18.6 %** · 800×1280 10.5 % · **601×962 9.1 %** · 1280×800 6.3 % · 768×1024 5.4 % · 962×601 4.8 % | 800×1280 13.7 % · **601×1007 12.8 %** · 1280×800 9.6 % · **601×962 9.1 %** · 1376×900 6.4 % · 768×1024 5.3 % | statcounter screen-resolution tablet, Sept 2026 |
| vendors | Samsung 50.9 % · Apple 17.4 % · unknown 9.4 % · Amazon 8.1 % · Xiaomi 7.9 % · Tecno 1.5 % | Samsung 44.0 % · Apple 21.0 % · unknown 15.6 % · Amazon 6.4 % · Xiaomi 3.7 % · Huawei 2.6 % | statcounter vendor tablet |
| Android versions (tablets, NG) | 14: 21.3 % · 11: 14.9 % · 16: 13.2 % · **9: 8.5 %** · 15: 8.1 % · 13: 7.4 % | — | statcounter android-version tablet NG |
| tablet browsers (NG) | Chrome 68.5 % · "Android" 11.3 % · **Opera 10.6 %** · Safari 7.4 % · Samsung Internet 1.1 % | — | statcounter browser tablet NG |
| typical devices | Samsung Galaxy Tab A 8 (SM-T290: 1280×800 panel → **962×601 CSS**); Galaxy Tab A9 8.7" 1340×800, **4 GB**; Infinix XPad 11" **4 GB** (₦251,800); Tecno MegaPad 10 **4 GB**; itel Pad One 10.1" 1280×800, **2/4 GB, Android 12 Go** | | r1.community.samsung.com (snippet); gsmarena / retailers (snippets); techeconomy.ng (snippet) |

**Reading:** the most common African tablet window is **601 CSS px wide in portrait** — one pixel over our 600 phone line — and
**962 in landscape**; with ≤ 4 GB RAM these tablets get Chrome's **mobile** site by default (≥ 8 GB needed for desktop mode), so
the viewport is the device width. "Android" (11 %) is most likely in-app WebViews (inference: StatCounter's label for the
Android WebView/stock browser). Opera's 10.6 % may include Opera Mini, whose server-rendered mode cannot run an editor
(inference — StatCounter does not split it). **Thin data:** no source for RAM distribution, Chrome-version spread or 3G share on
tablets specifically; tablets are under 1 % of traffic, so samples are small.

## 3. The traps (collected)
1. **601px is the commonest African tablet** — any rule at "600" is a coin toss for it; test 600 | 601 and 962 explicitly.
2. iPad + trackpad keeps `pointer: coarse` / `hover: none` until the trackpad is used; `any-pointer: fine` turns true the moment
   one is paired — do not flip the whole editor on `any-*`.
3. Touch cannot move objects in desktop-canvas editors on iPad Safari (Google Sites report) — the fitted desktop page is the wrong
   canvas for a finger, at any width.
4. WKWebView's content process may be killed in the background — unsaved edits must already be saved (data loss, RULE M never-cut).
5. Service workers in the app's WebView on iOS need App-Bound Domains, which then restrict injected JS / bridge / cookies to ≤ 10
   domains — choose one offline strategy deliberately.
6. Session handover: headers only on the first load; iOS cookies not shared unless `sharedCookiesEnabled`; Android script-injection
   race → use `injectedJavaScriptObject`.
7. Android keyboard over bottom inputs + SDK 54 edge-to-edge always on.
8. iOS edge swipe-back (`allowsBackForwardNavigationGestures`) and Android's back gesture both start at the screen edge — where our
   canvas drags and resize handles can be (inference — keep it off on iOS; route Android back through `BackHandler`).
9. One binary for all schools — an app per school breaks Apple 4.2.6 / 4.3(a).

## 4. Open questions — the USER's to decide
1. **Which width a tablet edits at.** (a) its own width 1:1 (the WordPress/Notion way: 768 → tablet-portrait rung, 1024 → landscape
   rung) · (b) the desktop page fitted, as now · (c) (a) by default, the device control still offering desktop.
2. **Where the 600 line sits.** Keep 600 (601 portrait tablets get tablet mode) or treat < 640 / a short-side rule as "phone-like"?
3. **Picker and settings on 600–1023:** the phone's sheet capped ~512 and centred (WordPress) · a side panel open in landscape and
   closed in portrait (Notion) · a popover.
4. **Add `react-native-webview` 13.15.0** (the SDK-54 pin) to `apps/mobile/` — needed for rule 20; it is a new dependency (RULE M
   rung 5 says "never add one" — rule 20 already decided a webview, so this is the user's explicit call).
5. **Auth handover:** a short-lived one-time code in the URL exchanged for a cookie, or a token via `injectedJavaScriptObject`, or
   shared cookies — and whether a token lives in `expo-secure-store` (also not installed).
6. **Offline in the app:** native cache (Android `cacheMode`) + the editor's own local save, or service workers (iOS App-Bound
   Domains, ≤ 10 domains).
7. **Which native layer ships first** to clear 4.2: push (`expo-notifications`), offline term dates, deep links into Fees /
   Messages / Reports — and whether universal links need the domain decided now.
8. Whether the app EDITS (the editor in the webview) or only SHOWS the school site at first (smaller first step).

## 5. Recommendations (with reasons)
1. **A tablet edits at its own width (1:1), on its own rung** — the only two products that truly build on tablets do this; touch
   cannot drive a fitted desktop canvas (Google Sites report); our ladder already has 600 and 900 rungs. Keep the device control.
2. **Decide by window width, never by device or user agent** — Apple and Android both say size follows the window (Split View,
   Stage Manager, multi-window); Chrome's desktop-mode depends on RAM; iPad Safari claims to be a Mac.
3. **600–1023: the phone sheet, capped at ~32rem (WordPress's 512) and centred; in landscape (≥ 900) the Inspector may stay
   docked like Notion's sidebar** — rotation re-lays the chrome, never the content.
4. **Keep the phone toolbar and the 44px finger floor on tablets; treat each gesture by `pointerType`** (finger / pen / mouse),
   which E-5b's pointer-events path already reads; hover effects only under `any-hover: hover`, never required.
5. **Test the African tablet sizes explicitly:** 601×1007, 601×962, 962×601, 800×1280, 1280×800, 768×1024 — add any missing to
   `lib/preview-devices.ts` (rule Z: a needed device is ADDED).
6. **The app: `react-native-webview` 13.15.0 over the hosted editor, one binary, BackHandler-driven back, iOS swipe-back off,
   `onContentProcessDidTerminate` / `onRenderProcessGone` → reload from the saved state, `injectedJavaScriptObject` for the
   session, camera-roll upload by plain `<input type=file>` + the Info.plist strings, a `postMessage` bridge limited to our origin.**
7. **Ship the native layer with it** (push, offline term dates, deep links into the existing tabs) — that, not the webview, is
   what Apple 4.2 and Play's minimum-functionality test judge.
