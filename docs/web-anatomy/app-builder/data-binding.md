# T1 — Data binding for the app builder (research)

> Track T1 of the app-builder research (`app-builder/research`, 2026-10-08). Reads with
> [`../app-builder.md`](../app-builder.md) §4–5 (axes 7 "data source" and 8 "data binding" were GAP) and
> [`../tablet-and-app-editing.md`](../tablet-and-app-editing.md) §2 E (the WebView mechanics). Method: RULE MAP —
> axes → values → how each is made here → a working example → the open decisions. Research only: no product code
> changed. Anything not read at its source is marked **UNVERIFIED**; things read only in a secondary source are
> marked *(secondary)*.

## 0. The answer in one paragraph

Bind **at build time by default, and refill at runtime only where the data is live or private — with ONE template
and ONE filler for both.** The exporter renders a repeater's item ONCE, with sentinels in the bound slots; a
~1.5 KB-gzip filler (`fill(template, record)`) turns it into items. The publish step runs the filler in Node and
writes plain static HTML (zero JS, SEO, cached offline); a page whose repeater is marked live also carries the same
template and the same filler, which the browser — or the Educo app, handing over JSON through the WebView bridge —
re-runs on fresh data. The canvas resolves the same bindings into an ordinary `BoxNode` tree, so the React canvas,
the export and the runtime are equal **by construction**. The spike in
[`examples/t1-binding/`](examples/t1-binding/) proves it: 18/18 checks, mutation-proven (§7).

## 1. What exists today that binding builds on (measured in the code)

| What | Where | Why it matters for binding |
|---|---|---|
| The node kinds — 13, no data kind | `lib/box-model.ts:25` (`BoxType`) | A repeater is a CONTAINER with a `repeat` field, not a new kind; nothing new for the palette to place |
| `BoxNode` — every field flat, optional | `lib/box-model.ts:194–585` | `bind` / `repeat` / `showIf` are three more optional fields; old pages stay valid (no migration) |
| Content fields a binding targets | `text` `:482`, `href` `:483`, `src` `:493`, `alt` `:498`, `listItems` `:512`, `icon` `:510`, `componentFields` `:577`, `items` `:536` | These ARE the bindable attributes, as WordPress's are `content`/`url`/`alt` (§2) |
| Per-breakpoint overrides — style only, never structure | `lib/box-model.ts:189` (`ResponsiveOverride` omits `children`) | A repeater's item count cannot vary per rung; only its look can — keep it that way |
| `hidden` (+ per rung) | `lib/box-model.ts:478` | Conditional visibility by DATA is a sibling of this; at export a hidden-at-base block is skipped (`lib/box-export.ts:527`) — the same "removed, not just invisible" choice Webflow makes |
| An item list with a link vocabulary | `ItemAction` `:68`, `ComponentItem` `:80` (`href` = URL / `#anchor` / `page:<id>`) | An accordion's items can be FILLED from a collection (FAQ from records) — a second repeater shape |
| Registry components render from a field map | `lib/educo-ui/registry.ts:166` `renderComponent(name, fields, variant)` | `componentFields` is already "fields → markup"; binding a card's fields to a record is a map, not new rendering |
| One exporter, classes by node id | `classFor` `lib/box-export.ts:365`; CSS pushed per node in `renderNode` `:525–566` | Rendering the item template ONCE emits its CSS ONCE for N records (cloning ids would emit it N times) |
| Escaping | `esc` `lib/box-export.ts:71` | The filler MUST use the same function or the two paths drift — the spike imports one `esc` for both |
| Value-dependent STRUCTURE in the exporter | empty heading not published `lib/semantics.ts:129`; missing picture → placeholder box `lib/box-export.ts:163`; `page:<id>` resolved through `pageMap` `:109`; anchor → `id` `:577` | A template-fill can only substitute VALUES. These four decisions must be made on the template (§4, trap list) |
| Page model | `BoxPage` / `BoxSite` `lib/box-site.ts:10,18` | No `data`, no collection, no "detail of" — the new fields go here |
| Files written per page | `fileNameFor` `lib/box-export.ts:745`, `siteFileMap` `:752`, `renderSiteFiles` `:836` | A detail page per record = more entries in this map (`event-<slug>.html`) |
| Preview = the real file | `renderSitePage` `lib/box-export.ts:794`; called at `app/website/box-demo/page.tsx:434` | Preview shows build-time output; a live repeater would show its snapshot until data arrives |
| Where the site is kept | `localStorage` — load `app/website/box-demo/page.tsx:277`, save `:308`; legacy `Site.publishedUrl` `lib/site-storage.ts:245` | **There is no publish server and no database for the builder.** Build-time binding needs a publish step that can read records |
| Records the school already has | all MOCK: `lib/mockStudents.ts`, `app/api/students/search/route.ts` (comment: "placeholder… replace with Supabase"), `apps/mobile/app/(tabs)/fees.tsx:48,73` (`MOCK_CHILDREN`, `MOCK_CURRENT_FEES`), `contexts/*Context.tsx` (10 of them persist to `localStorage`) | The "Educo records" source does not exist yet as an API. Supabase is configured only for file storage (`lib/supabase.ts`, `lib/services/storage/supabase-service.ts`) |
| Country formatting | `config/countries.ts:5` `CountryConfig.currency {code, symbol}`, `dateFormat`; `SchoolSettingsContext.tsx:33,62` `currency: "NGN"`; mobile `apps/mobile/lib/format.ts` `formatMoney(amount, locale, currency)` | The formatter reads the school's country, not the device. Web code today passes `Intl.NumberFormat(undefined, …)` (e.g. `components/admin/parents/ParentsTable.tsx:54`) — device locale, so the same fee prints differently per phone |
| The app's WebView | `apps/mobile/app/site-editor.tsx:101–114` (`react-native-webview`, `cacheMode` `LOAD_CACHE_ONLY` offline) | The bridge for handing JSON to a page exists in the library (`injectedJavaScriptObject`, `postMessage`), not used yet |
| A data-driven renderer already | `lib/chart/render-svg.ts:65` `chartToSvgString(spec)` | Charts are spec → SVG; a bound chart is spec-with-series-from-records (later, same pattern) |

## 2. Prior art, read at source

| Tool | Source of a list | Item binding | Query | Detail page | Visibility | Render time | Source |
|---|---|---|---|---|---|---|---|
| **Webflow CMS** | Collection List, `source {collectionId}`, `queryMode "dynamic" \| "curated"` (+ `curatedItems` ids) | element "connected" to a field; field types Color, DateTime, Email, File, Image, Link, MultiImage, Number, Phone, PlainText, RichText, Switch, VideoLink, Reference, MultiReference, Option | ordered `filters` (equals, doesNotEqual, contains, doesNotContain, greaterThan(OrEqual), lessThan(OrEqual), isSet, isOn), `filterMatch "all" \| "any"`, `sort [{fieldSlug, direction}]`, `limit` 1–100 (default 100), `offset`, `pagination {itemsPerPage}` 1–100 | Collection template page per item | conditional visibility; hidden elements removed from the HTML *(secondary)*; nested lists 2 per page, 10 items each on non-Enterprise *(secondary)* | static at publish | developers.webflow.com/designer/reference/element-settings/collection-list-settings · developers.webflow.com/data/reference/cms/collection-fields/create · rapidevelopers.com/md/webflow-tutorials/webflow-conditional-visibility *(secondary)*; help.webflow.com returned 403 |
| **Framer CMS** | Collection List on a collection | fields bound to layers in the repeated item | source · sorting · filters · pagination (Load More button / infinite scroll) · "limit to" · "start offset" *(search summary)* | "one reusable page for every CMS item", linked by slug | Visible → Set Variable: "is set", 8 text comparisons (Equals, Contains, Starts with, Ends with…), option Equal/Doesn't equal, toggle | static (UNVERIFIED) | framer.com/academy/lessons/creating-cms-collection-lists · framer.com/help/articles/how-to-create-flexible-cms-detail-pages/ · framer.com/dictionary/slug |
| **WordPress** | Query Loop `core/query` → Post Template; `query` = `{perPage, pages, offset, postType, order, orderBy, author, search, exclude, sticky, inherit, taxQuery, parents, format, excludeCurrent}`; pagination block; **No Results** block | **Block Bindings**: `metadata.bindings.<attr> = {source, args}`; supported: image `id/url/title/alt/caption`, heading/paragraph `content`, button `url/text/linkTarget/rel`; sources `core/post-meta`, `core/post-data`, `core/term-data`, `core/pattern-overrides`; editor `getValues / setValues / canUserEditValue / getFieldsList` | the `query` object above | single template | via blocks/plugins | **server, at render**: `get_value_callback` "executing at render time"; "reflected in the final HTML markup" | github.com/WordPress/gutenberg …/query/block.json · developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/ |
| **Wix** | dataset (connects page elements to a collection) → Repeater | "Connections": each element (Image, Text, Background) → a field | "Number of items to display" (= Load More size), + Add Filter, + Add Sort | dynamic item page, URL `/{collection}/{category}/{primary-field}` | (not in the read page) | server (UNVERIFIED) | support.wix.com/en/article/connect-repeater · support.wix.com/en/article/cms-setting-up-a-dynamic-item-page |
| **Bubble** | Repeating Group: "Type of content" + "Data source" (`Do a search for Users`) | "Current cell's Post's Title" | constraints, sort, `:sorted`; Rows "Fixed number" → Show next / previous / Go to page; extended vertical scrolling | page with a "thing" + slug field (auto fields: Unique ID, Created/Modified, Slug) | conditions on elements; empty: "renders no cells and takes up no space" — show a placeholder by a condition | live: searches "stay synced with the database in real time" | manual.bubble.io/help-guides/design/elements/containers/repeating-groups · …/data/the-database/finding-data · …/data-types-and-fields |
| **FlutterFlow** | Backend Query on a widget → ListView "Generate Dynamic Children" | widget properties from the item | List of Documents / Single Document; filters; order; Single Time Query vs real-time; "Enable Infinite Scroll"; Supabase realtime "Only One Filter is Supported" | a page with a document parameter | conditional rendering / hide on empty | native, at runtime | docs.flutterflow.io/resources/backend-query/query-collection · …/widgets/layout-elements/listview *(search summary)* |
| **Glide** | Collection component on a Table/Relation | columns | Filter, Sort, limit, Group by, search bar | item click action → detail screen | Visibility conditions — "**not a security feature**"; Row Owners protect private data | runtime | glideapps.com/docs/essentials/components/collections · glideapps.com/docs/essentials/security-and-user-data.md |
| **Softr** | List block on a data source (Airtable, HubSpot, SQL…) | per field: Type / Content / Label | conditional filters incl. **the logged-in user** ("each user only sees entries related to him/her"), sort, items per page, search fields | "the details page of the selected record" (URL syntax not documented) | page/block visibility by user group | runtime | docs.softr.io/building-blocks/list-block.md · docs.softr.io/user-groups-and-permissions/conditional-filters.md |
| **Adalo** | List on a collection | list item fields | filter, sort, maximum items (Airtable: `maxRecords`), "Load items as user scrolls" — forum: first pull 20 items, search misses unloaded rows *(secondary)* | screen with the "current" record | (not read) | runtime | help.adalo.com/integrations/airtable/working-with-lists/limiting-the-number-of-list-items · forum.adalo.com/t/custom-list-data-load-is-truncated-to-20-items/53275 *(secondary)* |
| **Base44** | entities (JSON Schema: string/integer/number/boolean/array/object, `required`, enums, per-field `rls`) | generated React code, no declarative binding (see `three-tools-public-docs.md` §1.4) | `list(sort, limit, skip, fields)`, `filter(query, sort, limit, skip)`, cursor `{items, next_cursor, has_more}`, `count()`, `aggregate()`, `subscribe()` | generated | generated | runtime; "Realtime subscriptions follow row-level and field-level read rules per subscriber" | docs.base44.com/developers/references/sdk/getting-started/work-with-data.md · …/entities/entity-schemas.md |

**What they share (the axes, §3).** Every one of them has: a *collection with typed fields*; a *list that repeats
one designed item*; *field → attribute* binding on that item; *filter + sort + limit (+ offset/pages)*; an *empty
state*; a *page per record* addressed by a slug or id; *visibility by data*. They split on **when** the binding
resolves — at publish (Webflow, Framer), per request on the server (WordPress, and Wix UNVERIFIED), or in the client
(Bubble, FlutterFlow, Glide, Softr, Adalo, Base44) — and the client-side ones all need a security model on the
server, because hiding is not protecting (Glide's own words; Base44's row-level rules; Softr's user filter).

## 3. RULE MAP — the axes, their values, and how each is made HERE

Model shape (sketch — names are proposals for the user, §9):

```ts
// lib/box-site.ts — the site owns its data definitions
interface BoxSite { /* …existing… */ data?: { collections: Collection[] } }
interface Collection {
  id: string; name: string;                    // "events"
  source: "site" | "educo" | "sheet";          // own records · Educo records (fees, classes…) · a Google Sheet (later)
  access: "public" | "signed-in" | "own";      // who may read — enforced by the SERVER, never by the page
  fields: { key: string; label: string; type: "text" | "rich" | "number" | "money" | "date" | "image" | "link" | "bool" | "option" | "ref"; options?: string[]; ref?: string }[];
  slugField?: string;                           // makes detail pages possible
  records?: Record<string, unknown>[];          // "site" collections only, stored with the site
}
interface BoxPage { /* …existing… */ detailOf?: string }   // this page is the template for one record of <collection>

// lib/box-model.ts — three optional fields on any node
interface BoxNode {
  /* …existing… */
  repeat?: { source: string; query?: Query; empty?: string; live?: boolean; perPage?: number }; // container: children[0] is the item
  bind?: Partial<Record<"text" | "href" | "src" | "alt" | "icon" | "listItems" | `field:${string}`, string>>; // attr → "path|format|args"
  showIf?: string[];                            // ["fee gt 0", "photo set"] — all must hold
}
interface Query { filter?: string[]; match?: "all" | "any"; sort?: string; offset?: number; limit?: number; me?: boolean }
```

| # | Axis | Values | Model | Canvas (builder) | Export (static) | WebView app |
|---|---|---|---|---|---|---|
| 1 | **Data source** | none (today) · site records (typed in the builder / CSV import) · Educo records (classes, events, fees, results, staff, term dates) · external sheet (later, UNVERIFIED need) | `BoxSite.data.collections[].source` | a Data panel lists collections; records table with add-row form (Base44/Wix pattern) | publish reads site records + public Educo records | native reads private Educo records with the session |
| 2 | **Schema** | typed fields: text · rich · number · money · date · image · link · bool · option · ref (Webflow's set minus colour/phone/video for v1) | `Collection.fields` | field editor; types drive which blocks a field can bind to (image → image `src`) | types drive formatting | same |
| 3 | **Query** | filter (eq ne gt lt set unset contains) · match all/any · sort field asc/desc · offset · limit (≤ 100, Webflow's cap) · **me** (records of the signed-in parent/pupil — Softr's user filter) | `repeat.query` | same `runQuery` on sample/real records, so the canvas shows the right subset | `runQuery` at publish | `me` queries ONLY at runtime, answered by the server (security) |
| 4 | **Repeater** | a container whose first child is the item · on a row / stack / grid (the layout engine already lays out N children) · nested one level (Webflow allows 2 per page) · component items from records (FAQ accordion) | `repeat` on a container; `ComponentItem[]` from `itemsFrom` | `expand()` → ordinary tree; every clone shows the TEMPLATE's selection outline; editing a clone edits the item (Framer/Webflow behaviour) | renderNode renders the item once with sentinels → `fill` per record; CSS once | same HTML; live repeaters refilled |
| 5 | **Field binding** | text · rich text · image src+alt · link href · button label+href · icon · list items · registry fields · a style token (colour from a record — later) | `bind: {attr: "path\|format\|args"}` | the bound value drawn in place; an empty field shows the field's name as a muted chip | value escaped by the shared `esc`; URLs pass an allow-list (trust boundary) | same filler |
| 6 | **Detail page** | one page per record by slug (`event-<slug>.html`) · one page + `?id=` filled at runtime (private records) | `BoxPage.detailOf`, `Collection.slugField`; a link binds `slug\|page\|event` | page picker "preview as record ▾" | `siteFileMap` grows an entry per record; `prefetchLinks` already exists | private records: one page, filled from the bridge; deep link `educo://…/event/<slug>` |
| 7 | **States** | loading (live only) · empty (designed, like WP's No Results / Softr) · error (offline: keep the snapshot and say "Last updated …") · stale | `repeat.empty` (+ an empty-state child later) | a toggle "show: items / empty" on the repeater | empty HTML written when the query returns none | snapshot first, data second — never a blank list (spike: `hydrate` leaves the snapshot when data is missing) |
| 8 | **Visibility by data** | set / unset / eq / ne / gt / lt; all-of · by ROLE (parent, pupil, teacher, admin) | `showIf` (data); role visibility is T3's `visibleTo` | clone with the condition false is drawn faded (editor-only), never removed, so it can be selected | removed from the HTML (Webflow) | role-hidden blocks are ALSO not sent by the server (Glide: visibility ≠ security) |
| 9 | **Formatting** | money (₦ no decimals, GH₵ two) · date (medium / long / relative) · number · plain · rich (sanitised) | format in the spec: `fee\|money\|NGN\|en-NG` | the same formatter | `Intl` with the SCHOOL's locale from `CountryConfig`, never the device's | same — but see risk R5 (ICU drift) |
| 10 | **Live vs build-time** | build-time (default) · live refresh (opt-in per repeater) · private (always runtime) | `repeat.live`, `Collection.access` | the canvas always shows build-time | live ⇒ page also carries `<script type="text/x-eu-template">` + the filler (1.5 KB gz); nothing for a static page | native passes JSON → `euHydrate(data)` via `injectedJavaScriptObject` (no Android race, §2 E) |
| 11 | **Paging** | limit only · pages pre-rendered (`events-2.html`) · load more (live) | `repeat.perPage` | page 1 | static pages per chunk | load more = native fetch next cursor (Base44's `next_cursor`) |
| 12 | **Writes** | none (T1) — forms are axis 9 of `app-builder.md` | — | — | — | outbox (T2) |

## 4. The architectural options, weighed

| Option | Canvas == export | 3G data cost | Offline | SEO | App Store 2.5.2 | RULE M (least code) | Verdict |
|---|---|---|---|---|---|---|---|
| **A. Build-time static render** (publish runs the bindings, writes plain HTML) | **yes** — same tree resolution | **lowest** — zero JS, one HTML file | **yes** — the file is the cache | **yes** | no code at all | small: `expand` + filler + a publish step | **public data** |
| **B. Client runtime fetch** with the full renderer shipped | yes in theory | **high** — ships the engine (box-export + box-model + semantics: thousands of lines) and a blank list until JSON arrives | only with SW (iOS needs App-Bound Domains, §2 E) | **no** | web content in WKWebView — permitted by 2.5.6 (inference) | large | rejected |
| **C. Server render per request** (WordPress model) | yes if the same renderer runs | low | **no** (needs signal) | yes | fine | needs a server per page view; breaks "static export to free hosts" (RULE AF) | rejected for v1 |
| **D. Native renders from data** | **no** — Yoga ≠ CSS (rule 20) | low | yes | n/a | fine | a second renderer | rejected (rule 20) |
| **E. A + template-and-fill refresh** (recommended) | **yes, by construction** — one template, one filler, proven §7 | static as A; live repeaters add 1.5 KB gz once + JSON (≈ the HTML's size gzipped — spike: 329 vs 338 B) | snapshot paints offline; native cache refreshes it | yes (snapshot in the HTML) | the filler is static web content in the page, not downloaded native code; data is data (inference — the risk is unchanged from today's WebView) | +1 small file shared by both paths | **recommended** |

**Why E.** It is A for every public page (the common case for a school site: events, staff, news, term dates) and
adds only what private data requires. Per-parent data (my child's fees, attendance) can never be baked into a static
file, and E handles it with the same template — the server answers `me` queries under the session, the native layer
caches the JSON for offline (T2), and the page fills itself. Nothing is rendered twice by two different renderers,
which is the bug class this project pays for most.

## 5. How the canvas works with data (no second renderer)

1. **`expand(tree, records)` → an ordinary `BoxNode` tree.** Repeaters become N children; bound attributes become
   plain values; `showIf` false drops the node (the canvas keeps it faded instead so it stays selectable). The React
   canvas renders it unchanged.
2. **Records on the canvas**: the collection's real records when it has some; otherwise 3 sample records generated
   from the field types (decision D3).
3. **Selecting a clone selects the item template** (clones carry `data-eu-clone-of`); edits apply to the template,
   so every clone updates — Framer/Webflow/Bubble all work this way.
4. **Preview** = `renderSitePage` = the build-time file, unchanged path (`lib/box-export.ts:794`).

## 6. Traps in OUR exporter (found while mapping; each needs a rule before the build)

1. **Empty bound heading** — `lib/semantics.ts:129` omits a heading with no text. A template heading bound to a
   field has no text at design time → must count as "has text"; a record with an empty value → the filler drops it
   only if a `showIf "<field> set"` says so.
2. **Picture placeholder** — `lib/box-export.ts:163` renders a "Picture to come" box when `src` is empty. In a
   template the src is a sentinel, so the placeholder decision must move to `showIf "photo set"` + a fallback child.
3. **`page:<id>` links** resolve through `pageMap` at render (`lib/box-export.ts:109`). A bound link to a detail page
   uses the `page` formatter (`slug|page|event` → `event-<slug>.html`), sharing `fileNameFor`'s slug rules
   (`:745`) — two slugifiers would disagree.
4. **Anchors** become `id` (`lib/box-export.ts:577`): inside a repeated item they would be duplicated N times
   (invalid HTML, broken skip/aria references) → suffix with the record's slug or forbid in templates.
5. **Per-node CSS** — keep clone ids equal to the template's id in the EXPORT (so one class, one CSS rule);
   distinct ids only on the canvas.
6. **`<template>` vs raw text** — measured in the spike: a `<template>` element is parsed and re-serialised, so the
   exporter's `<img … />` comes back `<img …>`; the DOM matches, the bytes do not. Ship the item as
   `<script type="text/x-eu-template">` (raw text, `</script` escaped) — bytes identical.
7. **Equivalence tests share logic** — canvas == export checks cannot catch a bug in the shared query/filler (the
   spike's first guards let a broken sort pass); every repeater test needs an ABSOLUTE expectation too.

## 7. The spike — `examples/t1-binding/` (research code, not product code)

- [`bind-fill.mjs`](examples/t1-binding/bind-fill.mjs) — the filler: `esc`, formatters (money, date,
  url allow-list, detail-page link), `runQuery` (filter → sort → offset → limit), `fill`, `fillList`, `hydrate`.
- [`spike.mjs`](examples/t1-binding/spike.mjs) — a miniature of `renderNode` (class per id, `esc`
  everywhere, the exporter's `<img … />`), one repeater ("upcoming events": filter `published eq true`, sort by date,
  limit 3, a ₦ fee, a date, a bound image, a detail link, a conditional "Free entry" badge), three data sets
  (snapshot, fresh with a new event, empty) and a hostile record (`<script>` in the title, `javascript:` photo).
  Writes `out-page.html` (the published page with snapshot + template + filler).
- Run: `node docs/web-anatomy/app-builder/examples/t1-binding/spike.mjs` (uses the repo's `jsdom`).

**Result (2026-10-08, Node 20.19.5, ICU 77.1): 18/18 checks passed.**

| Check | Result |
|---|---|
| canvas path (`expand` → `render`) == build path (template once → `fill`) — snapshot / fresh / empty | PASS ×3 (1,253 / 1,231 / 103 chars, byte-identical) |
| runtime in a DOM (jsdom, filler inlined from the same file) == build — string, `<script>` template | PASS ×3 |
| runtime DOM == build DOM — both template carriers | PASS ×6 |
| `<template>` carrier, string | **differs** for non-empty lists (`/>` lost) — recorded, not gated (trap 6) |
| absolute: filter+sort+limit → PTA, Quiz, Sports; badge on the 2 free events; `event-<slug>.html` links; `₦2,500`, `20 Oct 2026` | PASS ×4 |
| hostile text escaped; `javascript:` never reaches `src` | PASS ×2 |
| sizes | filler 3,139 B raw / **1,511 B gzip**; fresh list HTML 1,231 B (338 gz) vs JSON 799 B (329 gz) |
| formatting | `₦150,000` · `GH₵1,250.50` · `12 Jan 2026` |

**Mutation-proven** (each mutation applied to `bind-fill.mjs`, the run must fail, then the saved file written back):
escaping removed → 4 FAIL · sort disabled → 3 FAIL · `eq` always true → 1 FAIL · URL allow-list removed → 2 FAIL ·
₦ with 2 decimals → 1 FAIL. (Before the absolute checks were added, "sort disabled" and "eq always true" survived —
trap 7, found and fixed in the spike.)

## 8. Risks and mitigations

| # | Risk | Mitigation |
|---|---|---|
| R1 | **Private data leaks** through a static file or a client-side filter (Glide: visibility "not a security feature") | `access` per collection; `own`/`signed-in` collections are NEVER rendered at publish; `me` queries and role filtering run on the server (row-level, as Base44); a guard that fails if a non-public collection appears in `renderSiteFiles` output |
| R2 | **No records backend exists** (all mock, §1) | T1 v1 ships `site` collections stored with the site + publish-time binding — usable with no backend; Educo records wait for the application-layer area (RULE APP) |
| R3 | **No publish server** — the site lives in `localStorage` (≈5 MB, photos already strain it, `box-demo/page.tsx:292–318`) | records of a site collection are small text; images by URL; the publish step is the first server piece — decision D1 |
| R4 | Canvas ≠ export via value-dependent structure (traps 1–4) | bound slots are value-only; structure only through `showIf`; the four traps get rules + guards before the build |
| R5 | **ICU drift** — Node's ICU 77.1 at build vs an old Android System WebView at runtime may format `₦`/dates differently (UNVERIFIED on devices) | pass the school's locale explicitly (never `undefined`); measure on the low-cost device list; fallback: the server sends pre-formatted strings for live data |
| R6 | 3G cost of live lists | build-time default; live is opt-in per repeater; JSON ≈ HTML gzipped, so a refresh costs no more than reloading the list, and the snapshot paints with zero extra request |
| R7 | XSS via records (teachers type titles; CSV imports) | one `esc` for both paths; URL allow-list; rich text through the existing sanitiser path (`richBody`, `lib/box-model.ts:1492`) — never raw HTML from a record |
| R8 | App Store 2.5.2 | the filler is static web content inside the page (no native capability changes, data-only updates); every native ability stays in the binary (inference from the quoted rule, §2 E) |
| R9 | Scope (RULE RK) — this axis alone pulls in collections UI, records editor, CSV import, detail pages, paging | v1 = §9's minimum; paging, refs, nested repeaters, external sheets are later values on the same map |
| R10 | Stale offline snapshot read as current (a fees figure from last week) | every live repeater shows "Last updated <time>" from the data's timestamp when it is not fresh (T2) |

## 9. Gaps and decisions for the user

**Gaps (not researched here):** writes/forms (T2 outbox), roles/`visibleTo` (T3), performance with hundreds of
records on a 2 GB phone (T4), relations/multi-reference UI, Google Sheets as a source (need UNVERIFIED), Wix render
time (UNVERIFIED), Framer static generation (UNVERIFIED), Webflow help pages (403 — read through the Designer API and
a secondary source).

**Decisions needed:**
- **D1 — Where publishing runs.** Build-time binding needs a publish step that can read records: (a) in the browser
  at "Download/Publish" (works today, site records only) · (b) a server publish (needed for Educo records and
  automatic republish when a record changes). Recommendation: (a) now, (b) with the application layer.
- **D2 — The v1 source.** Site-owned collections only (typed in the builder + CSV) — or wait for Educo records.
- **D3 — Sample data on the canvas** when a collection is empty: generated from field types, or "add your first
  record" only.
- **D4 — Detail pages**: one static file per record (SEO, offline) for public collections — recommended — and a
  single runtime-filled page for private ones.
- **D5 — Formatting**: `Intl` with the school's locale (stdlib, RULE M) and accept per-device drift, or
  server-pre-formatted strings for live data.
- **D6 — Limits**: a repeater shows at most 100 (Webflow's cap) and nests one level — agree?
- **D7 — Names in the builder** (teacher-facing words): "Collection" / "List" / "Connect to field" — or "Records" /
  "Repeat for each" / "Fill from".
