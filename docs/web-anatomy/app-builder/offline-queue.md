# T2 — The offline queue: reads that work with no signal, writes that wait and then send

Research track T2 for the app builder (RULE MAP, RULE AF, rule 20). Written 2026-10-08 on `app-builder/research`.
Parent: [`../app-builder.md`](../app-builder.md) §5 axes **9 (forms → offline queue)** and **13 (offline)**.
The spike that proves the recommendation: [`examples/t2-offline/`](examples/t2-offline/) — **11/11 pass**, and **3 fail
when the server's idempotency is switched off** (the guard can fail, so it proves something).

The need, in RULE AF's words: *"forms that queue without signal and send when it returns, and say which they did."*
The people: teachers marking a register and parents sending forms and payment claims, on cheap Android phones, on 3G,
with signal and power that drop and data paid by the megabyte.

---

## 1. What exists today (measured in the repo)

| What | Where | What it means for T2 |
|---|---|---|
| The app's WebView screen | `apps/mobile/app/site-editor.tsx:101-135` | One `react-native-webview` over the web editor (rule 20). |
| "Offline" is guessed from a load error | `site-editor.tsx:26`, `:115-117` (`onError` → `remount(true)`) | No NetInfo: the app only knows it is offline when a page load fails, and only goes back online when the person taps **Try again** (`:89-95`). Nothing flushes on its own. |
| Offline read = Android HTTP cache | `site-editor.tsx:113-114` `cacheMode={offline ? 'LOAD_CACHE_ONLY' : 'LOAD_DEFAULT'}` | `cacheMode` is an **Android** prop (react-native-webview Reference); iOS has no equivalent prop — iOS offline reads are UNVERIFIED in this app. |
| Process killed → remount | `site-editor.tsx:130-131` | Already handles the WebView being killed; writes must be on disk before that happens. |
| Editor saves to the WebView's own storage | `apps/mobile/lib/site-editor.ts:5-6` | The builder's own save is local; it is not a queue to a server. |
| `pagehide` flush on backgrounding | `site-editor.ts:46-48` (`FLUSH_ON_HIDE`), `site-editor.tsx:43-48` | On Android the injected script runs only when the app comes back (measured in E5d-4) — a page-side outbox cannot rely on running while backgrounded. |
| Installed | `apps/mobile/package.json:57` `react-native-webview 13.15.0` | The bridge (`postMessage` / `injectJavaScript`) is available today. |
| **Not installed, but pinned by SDK 54** | `apps/mobile/node_modules/expo/bundledNativeModules.json:9, 76, 83` | `@react-native-community/netinfo 11.4.1` · `expo-secure-store ~15.0.8` · `expo-sqlite ~16.0.10`. Each is a NEW dependency for `apps/mobile` → the user's decision (RULE M rung 5: "never add one" without asking). |
| Web side: service worker / manifest | none — no `sw.js`, no `manifest` in `public/` or `app/` | `docs/DEVELOPING_COUNTRIES_FIRST.md:25` promises one; it is unbuilt. |
| Form / input blocks | none (`BoxType` has 13 kinds, no form — `../app-builder.md` §5) | The queue has nothing to queue yet; T2 designs the pipe the form blocks will use. |

---

## 2. Read at source

| Source | What it says (quoted or close) | Consequence |
|---|---|---|
| Android `ServiceWorkerController` (developer.android.com/reference/android/webkit/ServiceWorkerController) | "Added in API level 24"; manages the service workers WebView uses; `ServiceWorkerClient` can intercept their requests. | Service workers run in Android WebView from Android 7. Low-cost phones on Android Go 8+ qualify; the System WebView updates through Play (E-5c doc). |
| WebKit "App-Bound Domains" (webkit.org/blog/10882) | Apps "can specify up to 10 'app-bound' domains" in `WKAppBoundDomains`; when opted in, "JavaScript injection, custom style sheets, cookie manipulation, and message handler use is denied" on other domains. | — |
| inappwebview.dev/docs/service-worker, WebKit bug 227531, Apple forum 702755 | Service workers in WKWebView exist from iOS 14 **only with App-Bound Domains** (`limitsNavigationsToAppBoundDomains = YES`); otherwise `navigator.serviceWorker` is undefined; reports of ~3 SW registrations per WebView and intermittent failures on iOS 15. | **(A) cannot work on iOS for schools on their own domains**: 10 domains, no wildcards, fixed in the binary — and adding a school's domain would be a binary change (2.5.2 makes it data-only anyway). The "3 per WebView" and iOS 15 reports are third-party: UNVERIFIED. |
| react-native-webview `Reference.md` | `cacheMode`: `LOAD_DEFAULT · LOAD_CACHE_ELSE_NETWORK · LOAD_NO_CACHE · LOAD_CACHE_ONLY`; `cacheEnabled` default true; `injectedJavaScriptObject` → `window.ReactNativeWebView.injectedObjectJson()`; `postMessage` "data must be a string"; `onShouldStartLoadWithRequest` return false to stop; `incognito` stores nothing. | The bridge is strings only → the op is JSON. Pass the app's origin/session via `injectedJavaScriptObject` (no Android race, E-5c §E). |
| MDN Background Synchronization API | "Limited availability … not Baseline"; secure context; `registration.sync.register(tag)` → `sync` event in the SW. | Chromium only (Safari/WKWebView has none — UNVERIFIED for 2026 but consistent with MDN). Never the only trigger. |
| Workbox background-sync (developer.chrome.com/docs/workbox/modules/workbox-background-sync) | Failed requests "stored in IndexedDB and … retried when [the] sync event" fires; without Background Sync, "replay whenever your service worker starts up"; `maxRetentionTime`. | Good for the **browser/PWA** surface later; it is Workbox (a new dependency) — the spike shows ~150 lines do the same without it. |
| MDN Storage quotas & eviction | Chrome: up to 60 % of disk per origin; **WKWebView "embedded web content": ~15 % of disk**; best-effort data is evicted LRU under pressure and **"all of an origin's data is deleted at once"**; Safari deletes script-written storage after **7 days without user interaction** (when tracking prevention is on); `navigator.storage.persist()`. | **A queued register can be silently deleted** in a WebView's IndexedDB. Whether the 7-day rule applies inside an app's WKWebView is UNVERIFIED — either way, the outbox of record must not live there in the app. |
| expo-sqlite (docs.expo.dev/versions/latest/sdk/sqlite) | "the database is persisted across restarts of your app"; `runAsync` with bound parameters; `withExclusiveTransactionAsync`; WAL via `PRAGMA journal_mode = WAL`; Android, iOS, web. | The native outbox: app-private storage, not subject to web-storage eviction (app data is removed only by uninstall / "Clear storage" — UNVERIFIED wording, standard OS behaviour). |
| react-native-netinfo (github) | `isConnected`: an active network; `isInternetReachable`: "reachable with the currently active network", `null` when unknown; checked against `https://clients3.google.com/generate_204` (expects 204), every 5 s while unreachable / 60 s while reachable; `details.isConnectionExpensive`; `cellularGeneration` `2g/3g/4g/5g`. | Flush on `isInternetReachable === true`, not `isConnected` (a captive Wi-Fi / no-data SIM is "connected"). The reachability probe itself costs data: point `reachabilityUrl` at our own tiny endpoint and lengthen the interval (decision 4). `isConnectionExpensive` drives the data-cost axis. |
| Stripe idempotent requests (docs.stripe.com/api/idempotent_requests) | Saves "the resulting status code and body of the first request … regardless of whether it succeeds or fails. Subsequent requests with the same key return the same result, including 500 errors"; V4 UUIDs; prune after ≥ 24 h; "errors if [parameters are] not the same"; a concurrent request with the same key is not saved and can be retried. | The server half. The spike copies it, with one change: a 500 **before** execution is not saved (so a retry can still succeed). Retention must be longer than the longest offline stretch (decision 3). |
| PowerSync client architecture (docs.powersync.com) | Writes go to local SQLite and "automatically placed into an upload queue" (`ps_crud`), "a blocking FIFO queue"; `uploadData()` sends to **your** backend; "automatically retried". | The same outbox pattern, packaged. A sync service + new dependencies → not needed (RULE M); reading it confirms FIFO + your-own-API is the industry shape. |
| Replicache "How it works" (doc.replicache.dev) | Each mutation gets a per-client sequential id; the server records "last mutation id for the client"; mutations ≤ it are "confirmed"; "the server is authoritative"; pending mutations are replayed on top of new server state. | An alternative to a key per op (a per-device counter). Key-per-op is simpler and survives reinstall; noted, not chosen. |
| RxDB, WatermelonDB, Firebase / Supabase offline | Not read at source in this track — from general knowledge: RxDB (replication over IndexedDB/SQLite), WatermelonDB (SQLite, pull/push sync), Firestore (on-device cache + pending writes, last-write-wins). | UNVERIFIED. All are a new dependency and a second data model beside the block model (RULE APP: one model). Not chosen. |
| WhatsApp message ticks (via linkmobility.com, igeeksblog.com — WhatsApp's own FAQ page did not render) | Clock = not sent yet; one grey tick = sent; two grey = delivered; two blue = read. | The pattern our users already know: a **clock** for "saved on this phone", a **tick** for "sent". Words beside the symbol (WCAG 1.4.1). |

---

## 3. THE MAP (RULE MAP) — axes, values, how each is made here

| # | Axis | Values | How it is made here (recommended in **bold**) |
|---|---|---|---|
| 1 | **What is read offline** | published pages · their images · small records (term dates, fees owed, timetable, class list for the register) · the builder itself | Pages: today's Android HTTP cache (`cacheMode`, `site-editor.tsx:113`). **Records: a native JSON cache in SQLite, handed to the page through the bridge** (works on iOS too). Images: only at the shown width (RULE AF budget). |
| 2 | Read freshness | network-first · stale-while-revalidate · cache-only | **Show cached at once with its age ("Updated 3 h ago"), refresh when reachable** (stale-while-revalidate). Network-first only for money (fees owed). |
| 3 | Read cache size | unbounded · capped | **Cap per school** (e.g. 20 MB, LRU by page) — cheap phones have 16–32 GB with little free; WKWebView web storage is ~15 % of disk anyway. Number = decision 5. |
| 4 | **Where the outbox lives** | (A) page IndexedDB · (B) native SQLite via bridge · (C) both, by surface | **(C): native SQLite in the app; IndexedDB only for the plain browser.** One op format, one decision table (`classify`, `backoffMs` — shared in the spike). |
| 5 | What an op is | a raw HTTP request · a named action with data | **A named action** `{ id, seq, type, body }` (e.g. `attendance.mark`, `form.submit`) — never a raw request, so native can only send the actions it ships with (2.5.2; Android "a bridge to untrusted pages is dangerous"). |
| 6 | **Idempotency** | none · key per op · per-client counter | **UUID v4 per op, made when the person taps**, sent as `Idempotency-Key`; the server saves status + body per key and replays it; a key reused with a different body → 422. |
| 7 | Retry / backoff | fixed · exponential · + jitter · cap | **Exponential with full jitter, 2 s base, 5 min cap**; triggers: reachable again (NetInfo / `online`), app to foreground, page load, the timer. Background Sync only as an extra on Chromium. |
| 8 | Answer → state | 2xx · 409 conflict · 409 in-progress / 429 / 5xx / no answer · other 4xx | **sent · conflict (never retried) · retry · failed (never retried)** — `classify()` in `examples/t2-offline/outbox.js`. |
| 9 | Ordering | none · FIFO · FIFO per record | **FIFO**; a waiting op holds the ones behind it (a register keeps its order); a **failed/conflict op does not block** (spike S6). |
| 10 | **Conflict rule** | last write wins · version check · merge per field · server rule per type | **Per type, on the server**: a register line is keyed `(pupil, date)`; a *first* mark needs no version; an *edit* carries the version it saw and gets 409 if it changed → the person chooses (spike S5). Forms and payment claims are append-only (no conflict). Payments are always confirmed by the provider (Paystack/Flutterwave webhook), never by the queue. |
| 11 | Auth expiry while offline | drop the op · keep and re-auth | **Keep the op; it is signed when SENT, not when made.** A 401 → state "Sign in to send" (not failed), the token refreshed from `expo-secure-store`, then resend with the same key. The op records WHO made it (teacher id) so a different person signing in does not send another's register (decision 6). |
| 12 | Retention | forever · N days | **Device: until sent or the person deletes it; server keys: ≥ 30 days** (Stripe's 24 h is too short for a term with no signal). |
| 13 | **UI states** | saved on phone · sending · sent · failed · conflict · sign in to send | **Symbol + words, never colour alone**: ⏱ "Saved on this phone — sends when you are back online" · "Sending…" · ✓ "Sent" · "Not sent — needs fixing" · "Someone else changed this — choose". Announced through ONE `role="status"` live region, only on a change a person cares about (not every "Sending"). A native badge on the tab ("2 waiting") and an optional local notification "Register sent" when it goes out after the person left. |
| 14 | Data cost | always send · wait for Wi-Fi · size limit | **Small ops always send** (a register is < 1 KB); **photos/attachments wait for Wi-Fi when `isConnectionExpensive`**, unless the person says "send now"; the reachability probe pointed at our own 204 endpoint at a longer interval. |
| 15 | Where the queue is SEEN | the page that made it · one "Outbox" screen | Both: each form shows its own state, and a native **Outbox** list (what is waiting, retry, delete). |

---

## 4. (A) vs (B) vs (C)

| | **(A) Service worker + IndexedDB in the WebView** | **(B) Native SQLite outbox over the bridge** | **(C) Hybrid: B in the app, IndexedDB in a browser** |
|---|---|---|---|
| iOS | SW only with `WKAppBoundDomains` (≤ 10 fixed domains, and it **disables injected JS and message handlers on every other domain**) — a school's own domain breaks it | Works: the bridge works on any domain we allow | Works |
| Android low-end | SW from API 24; WebView updated via Play | Works on every RN-supported Android | Works |
| Survives eviction | **No**: best-effort web storage, whole origin deleted at once; WKWebView ~15 % quota | **Yes**: app-private SQLite | Yes in the app; best effort in a browser (`storage.persist()` asked) |
| Sends with the page closed | Only via Background Sync (Chromium) or SW start-up | **Yes**: NetInfo / foreground / app start, no WebView needed (spike S7b) | Yes in the app |
| 2.5.2 | No native code involved | Native ships a fixed allow-list of actions; the page only names one | Same as B |
| canvas == export | The page is unchanged | The page is unchanged: it calls `outbox.enqueue(type, body)`; which store is behind it is decided by `window.ReactNativeWebView` | Same |
| Plain browser / parents without the app | Works (Chromium; partial Safari) | **Does not work** | Works |
| New dependencies | none in the app (Workbox optional on the web) | `expo-sqlite`, `@react-native-community/netinfo` (+ `expo-secure-store` for auth) — all SDK-54 pinned | Same as B |
| RULE M | Fewest native parts, but fails the requirement on iOS | Minimum that meets it in the app | One extra ~100-line browser store, already in the spike |

**Recommendation: (C).** Reasons: (1) iOS — App-Bound Domains cap at 10 and switch off the bridge elsewhere, so (A) cannot serve
schools on their own domains; (2) a queued register must not be deletable by web-storage eviction (MDN: whole origin, LRU), and
must send even after the person has left the screen — only native does both; (3) parents also open the site in a plain
browser, which (B) alone abandons; (4) canvas == export holds because the page's code is identical — one `enqueue()` call,
the store chosen at run time; (5) 2.5.2 holds because native only runs the action types compiled into it; (6) RULE M: no sync
framework (PowerSync/RxDB/Watermelon), no Workbox — three SDK-pinned Expo modules and two small stores sharing one decision
table. A service worker stays the plan for the **published site in a browser** (reads + Workbox-style replay), as
`DEVELOPING_COUNTRIES_FIRST.md:25` already says — it is not the app's outbox.

---

## 5. The spike — `examples/t2-offline/` (research, not product code)

`server.js` (idempotent node http server, chaos switches) · `outbox.js` (op format, `classify`, `backoffMs`, IndexedDB store, bridge
mode) · `index.html` (a register + a payment claim, states in words + a live region) · `run.js` (its own Playwright Chromium,
headed; `context.setOffline`; Node plays the native side with a JSON file standing in for SQLite). Run:
`node docs/web-anatomy/app-builder/examples/t2-offline/run.js` (`HEADLESS=1` to hide). Output recorded in `output.txt`:

```
PASS  S1a offline: 3 writes saved on the phone, none reached the server  — live region: "form: Saved on this phone — sends when you are back online"
PASS  S1b reopened online: all 3 flushed, each executed once  — executed=3 requests=3
PASS  S2 lost response: retried, server replayed the saved answer, no duplicate form  — executed=4 requests=5
PASS  S3 server errors: retried with backoff, executed once  — requests=8
PASS  S4 two tabs flushing at once (Web Locks): 3 forms, no duplicates  — forms=3
PASS  S4 two tabs flushing at once (no Web Locks — idempotency alone): 3 forms, no duplicates  — forms=3
PASS  S5 conflict: shown to the teacher, not retried, the other teacher's mark kept  — server: {"status":"late","version":2,"by":"teacher-2"}
PASS  S6 invalid write: marked "Not sent — needs fixing", the next one still sent
PASS  S7a in the app, no signal: both writes in the NATIVE store, page says "Saved on this phone"
PASS  S7b native flushed with the page closed, lost answer retried, no duplicate
PASS  S7c reopened page shows "Sent" from the native store
11/11 passed
```

**Mutation proof** (`T2_MUTANT=1` — the server executes every request, ignoring the key), `output-mutant.txt`: **S2 FAIL**
(executed=5 for 4 ops), **S4 without Web Locks FAIL (forms=6 — both tabs really did send everything)**, **S7b FAIL** → 8/11. With
Web Locks S4 still passes under the mutant: the lock alone stops the two-tab case in Chromium; idempotency is what covers
Safari < 15.4 (UNVERIFIED version), the native side, and the lost answer.

Spike ledger (found while building it, both fixed): (1) the server matched `req.url` with its query string, so `/?base=150`
served nothing — fixed by matching the path; (2) without Web Locks, a tab whose outbox was sent by the OTHER tab never
redrew and kept showing "Sending…" (found by the mutant run timing out) — fixed with a `BroadcastChannel` redraw and a fresh
read of each op before sending. RULE K: the server and browser close in `finally`; a process check after the runs found no
`t2-offline` node and no Playwright Chromium left.

Not proven by the spike (needs a device — UNVERIFIED until then): real `expo-sqlite` and NetInfo on the emulators; Android
killing the app mid-send; iOS WKWebView storage behaviour; the reachability probe's real data cost on 3G.

---

## 6. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Duplicate register lines / payment claims on retry | Key per op + server replay (spike S2, S4, S7b; mutant proves it). Payment truth only from the provider webhook. |
| Queue silently lost (web eviction, iOS process kill, "Clear storage") | Outbox of record in native SQLite; the op is written BEFORE the UI says "Saved on this phone"; browser mode asks `navigator.storage.persist()`. "Clear storage"/uninstall still loses it → the Outbox screen warns when items wait > 24 h. |
| Two teachers mark the same register | Server rule per record type (§3 axis 10); conflicts shown, never auto-overwritten for edits. Whether a later FIRST mark from another teacher should win, or ask, is decision 2. |
| Token expired after days offline | Op kept; "Sign in to send" state; resend with the same key (axis 11). |
| Bridge abused by a page we do not own | `routeNavigation` already keeps foreign pages out (`site-editor.ts:31-44`); native accepts only `outbox.*` messages from our origin (`event.nativeEvent.url`), only known `type`s, with size limits — validation at the trust boundary (RULE M never-cut). |
| Data cost of retries and the reachability probe | Backoff cap; probe our own 204 at a longer interval; attachments wait for Wi-Fi on expensive connections. |
| Ops that can never send pile up | 4xx → "Not sent — needs fixing" with Edit/Delete; they do not block the queue (S6). |
| Clock skew on the phone | Ordering uses the local `seq` only within one device; the server stamps its own time. |
| iOS service-worker reads for the published site | Do not depend on them in the app; native record cache + HTTP cache instead. |

## 7. Decisions for the user

1. **Approve (C)** — native SQLite outbox in the app, IndexedDB outbox in a browser, one op format — and adding the three
   SDK-54-pinned modules to `apps/mobile`: `expo-sqlite ~16.0.10`, `@react-native-community/netinfo 11.4.1`,
   `expo-secure-store ~15.0.8` (new dependencies, RULE M rung 5).
2. **Register conflicts:** when two teachers mark the same pupil the same day, does the later mark win (with the earlier
   teacher told), or does the second always have to choose? Edits made on an old version always ask (recommended).
3. **How long the server keeps idempotency keys** — recommended 30 days (a term-break with no signal), not Stripe's 24 h.
4. **The reachability probe:** our own tiny 204 endpoint, and how often (NetInfo defaults: 5 s while offline, 60 s online).
5. **Read-cache size per school on the phone** (recommended 20 MB) and which records are cached for offline (term dates,
   fees owed, timetable, the teacher's class list).
6. **Shared phones:** if a different person signs in while ops wait, keep them for the original person (recommended) or ask.
7. **Attachments (photos of receipts) on mobile data:** wait for Wi-Fi by default, with "send now"? (recommended yes).
8. Also flagged, not a T2 decision: the E-5d screen guesses "offline" from a load error and returns only on **Try again**
   (`site-editor.tsx:89-95`, `:115-117`); with NetInfo it could return on its own.
