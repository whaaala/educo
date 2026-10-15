# App builder (phone + tablet) — research

> Area opened 2026-10-08 on `app-builder/research` (RULE RS: the user's sources + mine, then an "enough" checklist the
> user signs before any build). The user's three tools are studied INSIDE, signed in, by building the SAME small school
> app in each (RULE R: every item opened, run and read). My own research is in §4; the RULE MAP axes are in §5.

## 0. The brief given to every tool (identical, so the answers compare)

> A school app for a small primary school in Lagos, Nigeria, used mostly on cheap Android phones and on tablets. Three
> roles: Admin manages classes and pupils. Teachers take the daily attendance register for their class (tick
> present/absent for each pupil) and post announcements. Parents see announcements, their child's attendance, and a
> school fees page showing what is owed per term with a "Pay" button. On a phone it should use bottom tabs; on a tablet
> show the list and the selected item's detail side by side.

## 1. Base44 (app.base44.com) — studied inside, 2026-10-08

### 1.1 Entry
- Home: one prompt box ("Describe the app you want to create…"), `+` (attach), an **Auto** model picker, and a mode menu:
  **Build** ("Start building immediately") · **Plan** ("Create a plan before building"). Templates row underneath
  (Base44 / Community), a Launchpad (weekly community showcase with upvotes), Connectors, "Base Code", an **Agent** tab
  beside **Apps**, and a partner marketplace ("Hire a partner").
- No web/mobile switch on the prompt — one kind of app.

### 1.2 What the AI asks (Plan mode) — the exact questions
Before asking, it restated the brief and named the two things it "can't safely guess": what Pay really does, and how
parents get linked to children. Then one card per question, `n/3`, three choices + "Write your own answer", Skip:
1. When a parent taps the Pay button on the fees page, what should happen? — Pay online now · Show payment details ·
   Send payment request
2. How does a parent's account get connected to their child? — Admin invites parents · Parent signs up with code ·
   Teacher links parents
3. Besides the daily register, what should the school get out of attendance? — Today's absentees · Attendance
   summaries · Absence alerts
4. **Which visual style fits your school app?** — FOUR generated mock-ups of THIS app (school name, ₦ fees, roll call),
   each a **live HTML page in an `<iframe srcdoc>` (~18–23 KB each)**, with **Regenerate**. The chosen one was named
   ("Sunshine Academy"). → This is RULE S (live previews, never text chips) applied to a whole app's look.
- Beside the chat, a **living plan card** fills as you answer: Intent & goal · Audience & roles · Core flows (numbered,
  each answer adds a flow, e.g. "Admin sees a live school-wide list of absent pupils each day") · Design (it kept
  "bottom tabs on phones; list + detail side by side on tablets" and ADDED "lightweight, fast on slow connections"
  from "cheap Android phones") · Files ("Add images, docs or references").
- It named the app itself: "Lagos Primary Connect".

### 1.3 Plan → build
- The final plan (sections INTENT & GOAL · AUDIENCE & ROLES · CORE FLOWS · TECHNICAL REQUIREMENTS · DESIGN PREFERENCES)
  is sent as the first build message. The style pick became hex tokens (#FFFFFF / #101828 / #F2F4F7 / #0E9347), "system
  UI body font for fast rendering on low-end devices", and **"Tablet: split-pane master-detail at ~1280px with a
  persistent ~320px left list rail"**.
- The plan said "a payment provider that works in Nigeria" — the builder's FIRST action was still **Connect to Stripe**
  ("Action needed… Base44 may share your information with Stripe" → Install / Reject). Rejected (an integration on
  the user's account is the user's call). Its first read: its own "Row-Level Security guide".
- Editor chrome: branch selector ("Main"; "Branching isn't available while the app is building"), Revert, version
  history, **Preview | Dashboard | Edit** (Edit = select an element on the page), a URL bar with page routes ("Home"),
  device toggle, Publish, a free `*.base44.app` subdomain + "Connect domain", chat Suggestions ("Build student
  profiles", "Automate daily notifications" with Gmail).

- Build order seen live: ENTITIES first (User · School Class · Pupil · Attendance · Announcement · Fee · Term, "with
  role-based security"), then `styles` (the design tokens), `lib/server fns`, then route FILES (`routes/login`,
  `register`, `forgot password`, `reset password`, `authed`, `authed/index`), `components/Layout`, and a
  **`components/Master Detail`** for the tablet; deletes its starter `routes/index`. Dashboard is locked while building.

- Self-testing: "Verifying the app" loads its own pages, found two bugs and fixed them unasked (an edit form crashing on
  a dialog-only heading; lists flashing "Nothing here yet" before data loaded → "Loading…"), retried after "Couldn't
  verify", and stated what it could NOT test ("teacher attendance-marking and parent fee-payment flows need actual
  teacher/parent accounts"). Its first seed made duplicates → an **"Approval needed: Cleaning up duplicate data"** gate
  (destructive data actions ask; a later "Reset fee test data" was "auto-approved").
- Cost: the whole build used the free day — "0.17 credits left today".

### 1.4 What it produced (measured in the preview, 2026-10-08)
- Dashboard (the back office every app gets): Overview (visibility Public/…, Invite users, badge) · App Users · **Data**
  (one table per entity — Announcement, Attendance, Fee, Pupil, SchoolClass, Term; Backup & Restore; **"Run scan to
  identify permission risks"**) · Analytics · Marketing (SEO & GEO, Social content, Google Ads) · Domains ·
  Integrations · Security · Code · Agents · Workflows · Emails · Logs · API · Settings · MCP · Secrets.
- The app ("Sunshine Academy", seed: 3 classes, 1 term, 10 pupils with Nigerian names, 2 announcements, 3 fees):
  - **Desktop / tablet landscape (≥ 1024px):** header + a left icon-and-label RAIL (Today · Classes · Pupils · Fees ·
    Notice) + a LIST (pupils) + the selected item's DETAIL (edit form) — true list-detail.
  - **Phone (375):** the same five as BOTTOM TABS. But Pupils opens straight onto the FIRST pupil's edit form with a
    "Back" link — the list-detail auto-selects item 1, so a phone user never sees the list first. A defect.
  - **Tablet portrait (820):** the PHONE layout — bottom tabs stretched across 820px, detail only, no list. The split
    begins at Tailwind's default `lg` = **1024px** (its media queries: 640 / 768 / 1024 / 1280 / 1536), so every
    portrait tablet (768–1023) misses the side-by-side the brief asked for. (Its own plan had said "~1280px".)
  - Small copy slip: "No parent linked. Add a parent email below" — the field is above.
- Lessons for us (into the checklist): a list-detail must open on the LIST on a phone and on the split from the
  platforms' medium/expanded class, never auto-open item 1 on a phone; breakpoints come from the device classes
  (§5.1), not from a CSS framework's defaults.

## 2. Emergent (app.emergent.sh) — studied inside, 2026-10-08

### 2.1 Entry
- First visit: a 3-step onboarding survey (what do you do · what are you here for · how did you hear), skippable.
- Home: 10.00 credits shown; the prompt has a **Web app | Mobile app** switch — choosing Mobile app pre-fills
  "Build a mobile app:" and the suggestions change to mobile ideas ("Site walkthrough app for a contractor"…).
  Showcase with categories incl. "Mobile Apps", each item with Preview / Remix.
- The project opens as a TAB in a browser-like tab strip ("lagos-school-app"), top-right Preview · Manage · Publish
  (Publish shows App Store + Play icons).

### 2.2 What the AI asks — the exact questions (5, "Auto-answer" offered, then "Any additional info? (optional)")
1. How should users log in? — Simple email + password (I create Admin/Teacher/Parent accounts) · Google social login ·
   No login for now, just pick a role · Something else
2. For the "Pay" button on the fees page, which payment do you want? — **Paystack (popular in Nigeria)** · Stripe ·
   No real payment yet, just show amount owed + a placeholder button · Something else
3. Do you need any AI features (e.g. auto-writing announcements)? — Yes · No, keep it simple · Something else
4. Any design/colour preference? — Clean & friendly (greens/blues, school feel) · I have specific brand colours · You
   decide · Something else
5. Should I start the app with some sample classes, pupils and announcements…? — Yes, add sample data · No, start empty
- It read "Lagos" and offered the local payment provider first — the only one of the tools so far to do so (RULE AF).
- Before the questions: a long marketing-voice welcome + "You retain full ownership of your idea… and any IP".

### 2.3 Plan → build
- No plan document: after the answers it works through SUB-AGENTS shown in the chat — "Delegated to Design Agent"
  (7 messages), "Delegating to Memory Agent", then "integration playbooks" fetched from memory (Paystack, AI, auth).
- Credentials are asked IN the chat as a question: "Paystack test secret key?" with the option "I don't have it yet —
  build everything now and I'll add the key later". AI features use "the Emergent universal key (already available)" —
  no key of the user's needed.

- Build order: design + theme (`/app/frontend/src/theme.ts`), then **Expo Router route GROUPS per role** —
  `app/(admin)/classes.tsx` ("master-detail Admin classes screen"), `app/(teacher)/_layout.tsx` +
  `(teacher)/register.tsx` ("teacher attendance register (master-detail)"), `app/(parent)/{announcements, attendance,
  fees}.tsx`, shared screens in `src/screens/`; then lint, `supervisorctl restart expo`, a screenshot of its own login
  screen, then **"Delegated to Testing Agent"** (15+ messages) to validate every flow.
- Preview: an iPhone FRAME in the browser (Expo web) + "Try your app on mobile": install **Expo Go** → scan a QR →
  enter the device code Expo Go shows → confirm on the phone. Publish shows App Store + Play icons.

### 2.4 What it produced (measured on its Expo-web preview, 2026-10-08)
- Login ("Bright Steps School · Lagos, Nigeria") with **one-tap demo sign-in as Admin / Teacher / Parent** — a good
  pattern for trying a role app. On the first web load the font fell back to a serif and the header photo was a grey
  box; after sign-in Nunito loaded.
- **Teacher, phone (375):** opens on the LIST ("Daily Register — Primary 1, tap to take attendance, 6 pupils"); tap →
  the register: every pupil defaults to **Present** with a Present | Absent segmented toggle, a live "6 present · 0
  absent" count, a pinned **Submit register**. Three bottom tabs for this role (Register · Notices · Profile) — tabs
  are PER ROLE, from the route groups.
- **Tablet portrait (820) and landscape (1180):** list on the left, register on the right — the split the brief asked
  for. Measured threshold: single pane at 767, split at **768**. But the bottom TAB BAR stays at the bottom, stretched
  across the width — no side rail (Material 3 / Apple would use a rail or sidebar there; Lovable's plan did).
- Opening a class does not change the URL (`/register` both ways) — the detail is component state, so it cannot be
  deep-linked or restored after a reload.
- Defect: **"TEST_Pupil A"**, created by its own Testing Agent, sits in the school's sample register — the test run
  wrote into the app's data.

- Its close: "All tests passed with no bugs" (25/25 backend tests + screen flows) — while the leaked TEST pupil and the
  stretched tablet tabs were on screen. It writes a PRD into its own memory (`/app/memory/PRD.md`), lists demo logins
  with plain-text passwords in the chat, says AI notices use "Claude built in, no key needed", that Paystack "activates
  the moment you add your test key" (until then a "not configured" message), and that **"some native features (camera,
  notifications) only work on a real device after you deploy and generate a build — not in Expo Go."** Publish path:
  Publish → Deploy your app → Generate iOS and Android builds. Then four suggested next features (Paystack key, fee
  set-up per class, edit/remove, receipts).
- Lesson for us: a builder's own "all tests passed" is not a UAT — exactly why RULE X / RULE Z have a person-shaped
  headed pass, and why test data must never write into a school's real data.

## 2.5 The three side by side (same brief, same day)

| | Base44 | Emergent | Lovable |
|---|---|---|---|
| Questions before building | 3 + a visual style pick (4 live HTML mock-ups) | 5 (+ optional notes), Paystack offered first | 4, each with consequence + Recommended; the ONLY offline question |
| Plan | living plan card → full spec | none visible; sub-agents (Design, Memory, Testing) | written spec with "Not included", editable inline, stored in the repo |
| Payments for Lagos | went straight to Stripe | Paystack (asked for a test key) | said plainly it has neither Paystack nor Flutterwave; bank transfer |
| What it emits | React + Tailwind on Base44's own entities/backend | Expo / React Native (+ FastAPI + Mongo) | TanStack Start + Supabase (nothing built — credits) |
| Phone | bottom tabs (5); list-detail opens on item 1 ✗ | bottom tabs per role (3); opens on the list ✓ | — |
| Tablet | split only from 1024 (portrait tablets get the phone layout ✗); rail ✓ | split from 768 ✓; tabs stay at the bottom ✗ | planned split + "bottom tabs become a side rail" ✓ (unbuilt) |
| Deep link to a detail | route per page | detail is state, no URL ✗ | planned "list/detail routes so deep links still work" ✓ |
| Self-testing | verifies pages, fixes 2 bugs, says what it couldn't test | Testing Agent — and its test data leaked into the app ✗ | — |
| Free-plan result | a working app, credits gone | a working app, still testing | nothing |

**None of the three got phone AND tablet right.** The correct behaviour is the union of their good parts: open on the
list on a phone (Emergent), split from the medium class (Emergent's 768, the platforms' 600–840), a rail instead of
stretched tabs once there is room (Base44 at ≥ 1024, Lovable's plan), and a URL per detail (Lovable's plan).

## 3. Lovable (lovable.dev) — studied inside, 2026-10-08

### 3.1 Entry
- Dashboard: one prompt ("What should we build, vcc?"), `+`, mic, and a mode menu: **Build** ("Make changes directly") ·
  **Chat** (Free — "Ask anything, explore ideas") · **Plan** ("Detailed spec for complex builds"), switched with
  **Alt+P**. "Connect all your tools" (Gmail/Slack/Maps connectors), Lovable templates, Projects, Chats.
- No web/mobile switch. It named the project itself: "School Connect NG".

### 3.2 What the AI asks (Plan mode) — the exact questions
Each choice carries a one-line consequence, and one is marked **Recommended**; "Write your own…", "Skip all":
1. What should the "Pay" button do for now? — *"Card payments in Nigeria usually go through Paystack/Flutterwave, which
   aren't built into Lovable yet."* Record as paid (no real money) [Recommended] · Show bank transfer details (parent
   uploads/confirms) · Real card payments via Stripe (*"Stripe does not support Nigerian schools taking payouts"*).
   → picked bank transfer.
2. How do people get into the app? — Email + password, admin creates accounts [Recommended] · Anyone can sign up, admin
   assigns role.
3. **Do teachers need to take the register without internet?** — *"Offline-first adds real complexity; it can also be
   added later."* Online only for now [Recommended] · Save offline and sync later. → the ONLY tool to ask about
   offline (RULE AF's own question).
4. Should I start with sample classes and pupils…? — Yes, add sample data [Recommended] · No, start empty.

### 3.3 The plan (approved as written)
- "Lagos Primary School App — designed for cheap Android phones first and tablets second." Per role, what each person
  sees (Admin · Teacher · Parent), then **Layout behaviour**: *Phone: bottom tab bar with 3–4 tabs per role (Teacher:
  Register, Announcements, Class; Parent: Announcements, Attendance, Fees). Big tap targets, no hover-only controls.
  Tablet: the same sections render as list on the left and the selected item's detail on the right… **Bottom tabs
  become a side rail.***  — exactly Material 3's compact → medium/expanded rule (§5.1), unprompted.
- Technical notes: Lovable Cloud (Supabase Postgres); tables profiles · user_roles (separate table + `has_role()`
  security-definer) · classes · pupils · guardians · attendance · announcements · fee_terms · fee_records ·
  payment_claims; **row-level security on every table** (parents only their children, teachers only their class);
  admin-created accounts via a server function; *"Responsive split view via a useIsTablet-style breakpoint hook, with
  list/detail ROUTES so deep links still work on phones"*; seed rows as INSERTs in the first migration.
- **"Not included"** is written into the plan: offline register; real card payments ("would need
  Paystack/Flutterwave, not available here yet").
- The plan is editable inline: "Select any part of the plan and tell Lovable what to change — edits stay scoped to your
  selection." It is stored IN the project as `.lovable/plan`.
- "Before building, I'll show three visual directions to pick from" — that step FAILED ("Fixing directions setup after
  failure") and the retries consumed the day.

### 3.4 What it produced — nothing usable on the free plan
- **"Add credits to keep going — Your work is paused because you're out of credits. 5 free credits arrive in 15
  hours."** The questions + plan + a failing design step spent the whole free day before one screen was built.
- The code tab (read-only on free) shows only the starter: `.lovable/{plan, project.json}`, `drizzle/{migrations,
  schema.ts}` (schema "auto-generated and intentionally left blank"), `src/{components, hooks, integrations/supabase,
  lib, routes, test}`, `router.tsx`, `routeTree.gen.ts` (TanStack Router), `server.ts`.
- The preview has a floating edit bar: select element · text · draw · comment.
- Lesson for us (RULE AF, RULE RK): a failing generation step must never burn a user's allowance; and a builder that
  produces nothing until the LAST step leaves a teacher with nothing. Ours composes from proven blocks, so a partial
  result is still a page.

## 4. Desk research (stored in full beside this file)

- [`app-builder/three-tools-public-docs.md`](app-builder/three-tools-public-docs.md) — the three tools' own docs (Base44
  ~300 pages via `llms.txt`, Lovable 261, Emergent's 99 help articles; raw Emergent archive in
  `C:\Users\eyite\educo-research\app-builder\emergent-help-center`), item by item, with a comparison table.
- [`app-builder/own-research-and-map.md`](app-builder/own-research-and-map.md) — 13 other builders, React Native / Expo
  + Material 3 / Apple adaptive patterns, App Store 4.2 / 4.2.6 / 4.3 / 2.5.2 and Play policy (quoted), and the RULE
  MAP draft against our code.

### 4.1 What the field is (the finding that matters most)
- **Two families.** CODE emitters (Base44, Emergent, Lovable, Bolt, Replit, Rork, a0, Anything, Draftbit, v0) — the AI
  writes React / React Native and you edit by prompting again. MODEL keepers (FlutterFlow, Adalo, Glide, Thunkable,
  Bubble, Softr) — a stored app model edited visually. **Nobody does both: an AI composer emitting a validated MODEL.**
  That is exactly RULE APP's position (the LLM builder emits the block model, never code).
- **Native shells.** Base44 = the published web app **in a WebView** (IPA/AAB, push only, **no offline** — the same
  shape as our rule 20, minus the native layer we plan). Emergent = true Expo/React Native, its EAS account, TestFlight
  upload; web→mobile is a one-way agent REWRITE into a second codebase (rule 20's canvas ≠ export trap). Lovable = no
  native (PWA, or a wrapper outside it).
- **Tablet is the gap everyone leaves.** Only FlutterFlow has real breakpoints + per-widget visibility; none of the three
  documents a tablet layout — though in-app, Lovable and Base44 both PLANNED a list-detail split when asked (§1.3, §3.2).
- **Store policy, new since E-5:** in 2026 Apple used **2.5.2** (no downloaded executable code) against app
  generators — Replit blocked Dec 2025–May 2026, Vibecode blocked, Anything removed 26 Mar 2026 [news, not Apple's
  page]. Consequence for us: every native capability ships IN the binary and is switched on by the school's DATA; an app
  change must stay data-only. Play's old template-app clause is gone; its "repetitive content" rule says bundle
  similar apps into one — our one-app-with-a-school-picker already does.
- **Africa:** only Emergent documents (and, in-app, offered) Paystack; nobody documents Flutterwave; Base44's own
  payments cover no African country; Lovable says plainly it has neither and that Stripe won't pay out to Nigerian
  schools.

## 5. RULE MAP — the axes an app adds to the block model (draft, for the "enough" checklist)

What exists was measured in the code (`BoxType` = 13 kinds, no form/input block; `Site` = pages · nav · header · theme;
`apps/mobile` has no expo-notifications / netinfo / expo-sqlite / expo-secure-store).

| # | Axis | Values | How it would be made here | Today |
|---|---|---|---|---|
| 1 | Navigation shell | bottom tabs · side rail · sidebar · drawer · stack | native chrome, described as DATA on `Site` | Partial (`Site.nav`, a fixed `(tabs)`) |
| 2 | Screen kind | page · list · detail · form · modal/sheet · empty/loading/error | `Page` + a kind; native presents modals | GAP |
| 3 | Route / transition | push · tab · modal · back · deep link | `href` grows `screen:`; WebView → native router | Partial (`page:<id>`) |
| 4 | Device class | compact · medium · expanded · large · xl, + HEIGHT class | CSS rungs (canvas == export); native picks the shell | Partial (width only; M3 lines 600/840/1200/1600 vs ours 600/900/1200/1800) |
| 5 | Orientation | portrait · landscape · locked | app config + height class | Partial |
| 6 | Adaptive pattern | list-detail · supporting pane · feed | a split container that collapses to a pushed screen on a phone (Lovable's "list/detail routes so deep links still work on phones") | GAP |
| 7 | Data source | static · Educo records · a school's own collection | API/bridge reads | GAP |
| 8 | Data binding | repeater · field binding · filter/sort · empty state | `bind` on a node + a repeat container | GAP |
| 9 | Forms | inputs · validation · submit · offline queue | form/input blocks; native outbox (sqlite + netinfo) | GAP |
| 10 | Auth / roles | public · parent · pupil · teacher · admin | session in secure-store; `visibleTo` on blocks, enforced on the SERVER too (row-level, as Base44/Lovable do) | GAP |
| 11 | Native capability | push · camera · call/WhatsApp · share · biometrics · badge | an allow-list of bridge actions, shipped in the binary (2.5.2) | GAP (photo upload in the WebView works) |
| 12 | Actions | navigate · submit · call API · native · set state | widen the alert's `ItemAction` to every block | Partial |
| 13 | Offline | cached read · write queue · download | native-side cache (iOS service workers need App-Bound Domains) | Partial (E-5d cache) |
| 14 | App identity | inside Educo · PWA · a school's own binary | one app + school picker (4.2.6) | Partial |
| 15 | Safe areas | insets · edge-to-edge · keyboard | native padding + `env(safe-area-inset-*)` | UNVERIFIED |

### 5.1 The platforms' own adaptive rules (read at source — [`app-builder/m3-hig-layout-sources.md`](app-builder/m3-hig-layout-sources.md))

| Window class | Width | Navigation | Content |
|---|---|---|---|
| Compact | < 600dp | bottom bar / iOS tab bar | 1 pane; list → detail is a push with back; supporting pane below or a bottom sheet; feed 1 column |
| Compact height | h < 480dp | bar (phone landscape) | 1 pane, scrolling |
| Medium | 600–839 | collapsed nav rail | 1 pane (2 if low density); feed 2+ columns |
| Expanded | 840–1199 | rail; iPad top tab bar → sidebar | 2 panes (list-detail); supporting pane 360dp beside |
| Large | 1200–1599 | expanded rail / sidebar | 2 panes |
| Extra-large | ≥ 1600 | expanded rail / sidebar | 1–3 panes (iPad three-column split) |

- M3 calls these "breakpoints" now; the **navigation drawer is "no longer recommended"** (M3 Expressive, May 2025) — the
  expanded rail replaces it. Apple: lay out by SIZE CLASS (compact/regular), never by device; prefer the tab bar
  (≤ 5 tabs), "switch from a tab bar to a sidebar" with more room; split views only in regular width.
- Adalo and Thunkable have NO separate tablet layout (Adalo: one screen, per-size overrides; Thunkable: one project-wide
  device default).
- For us: our rungs 600 / 900 / 1200 / 1800 vs the platforms' 600 / 840 / 1200 / 1600, and we have no height class —
  a decision for the checklist, not a silent change (rule 18 is the user's).

## 6. Research R-APP-1 — the four unknowns (2026-10-08)

Asked by the user: understand data binding, the offline queue, server-side roles and cheap Android on 3G fully,
before any app-builder build. Each track has its own file in `app-builder/` and a small working spike in
`app-builder/examples/` (not product code), each mutation-checked.

| Track | Recommendation | Proof | Still owed |
|---|---|---|---|
| T1 data binding ([`data-binding.md`](app-builder/data-binding.md)) | Bind at PUBLISH by default: one template per repeater + one ~1.5 KB filler → plain static HTML (no JS, offline-cacheable, SEO). Live/private data re-runs the SAME template + filler on the device (the app hands JSON over the WebView bridge). Canvas uses the same `expand()` → canvas == export by design. | spike 18/18, mutation-proven; three paths give identical markup | no records backend / publish server exists; four exporter spots change structure by value (`lib/semantics.ts:129`, `lib/box-export.ts:109,163,577`) |
| T2 offline queue ([`offline-queue.md`](app-builder/offline-queue.md)) | HYBRID: in the app a native outbox (expo-sqlite + NetInfo) sends even with the page closed; in a browser IndexedDB; one `enqueue()` API either way; idempotency key per write; outcomes sent / conflict / retry / failed; WhatsApp-style clock → tick, announced to screen readers. No sync framework. | spike 11/11; 3 fail with idempotency off | real device (sqlite, app killed mid-send, iOS storage) |
| T3 server-side roles ([`server-roles.md`](app-builder/server-roles.md)) | School = tenant, `school_id` on every row, enforced IN THE DATABASE (row-level rules); roles and links (guardian→pupil, teacher→class) in their own tables; the API uses the user's token, never the service key; phone + OTP (WhatsApp first, SMS fallback); the school invites parents, parents never claim a child; admins pick plain-words PRESETS that map to reviewed rule templates — never free-written rules; `visibleTo` on blocks is display only. | spike 9 tests, 6 mutations caught (IDOR refused, teacher limited to class, cross-school refused) | no database for school records; NDPA 2023 / Ghana Act 843 read only via law-firm summaries — needs a lawyer |
| T4 cheap Android on 3G ([`low-end-3g.md`](app-builder/low-end-3g.md)) | Budgets hold only if fonts are Latin-subset FILES (not embedded) and photos are FILES with `srcset` + lazy loading; the editor in a WebView needs its own diet. | HEADLESS timing run: every exported page 501–530 KB, first text 13.5–14.3 s on Slow 3G + 4x CPU (budget 100 KB / 5 s); with fonts + photos as files 177 KB / 4.2 s | a real itel / Tecno phone; the emulator was not run (memory) |

Facts the market sets (T4, sources in its file): Tecno + Infinix + itel ≈ 42% of Nigerian phones, Android ≈ 84%;
360px wide ≈ 43% of the top six resolutions; ≈ 21% of Nigerian Android phones on Android ≤ 12; cheap phones 2–4 GB on
Android Go; 3G is still the region's largest technology to 2027 (GSMA); data ≈ $0.39–0.40 per GB.

Bugs the research found in EXISTING code — ledger RA-1…RA-9 in `docs/TASK_TREE.md` (six security, three weight).

### 6.1 Every decision waiting for the user (one list)
- Layout: **D1** our rungs vs the platforms' 600/840/1200/1600 + a height class.
- Order: **D2** data layer next, or layout axes first on sample data · **D3** Lovable (wait / credits / skip).
- Data binding (T1): where publishing runs · v1 source = the site's own collections? · empty canvas shows sample data? · static detail page per public record, runtime page for private · formatting via `Intl` or server strings · limits (≤ 100 items, one nesting level) · names teachers see.
- Offline (T2): approve the hybrid + 3 SDK-pinned modules (expo-sqlite, NetInfo, expo-secure-store) · two teachers marking the same pupil: later wins or choose · keep write ids 30 days · reachability checks · ~20 MB cache per school, which records · shared phones: whose queue · photos wait for Wi-Fi?
- Roles (T3): Supabase (installed; recommended) vs plain Postgres vs Firebase · data residency (Supabase African region UNVERIFIED → cross-border under both Acts) · OTP provider Termii / Africa's Talking / Twilio · pupil accounts none vs school-issued codes · `@supabase/ssr` + `expo-secure-store` (new deps) · RA-1…RA-6: fix now or as the first sign-in batch (RA-5 is cheap and needs no sign-in — recommended now).
- Weight (T4): RA-7 fonts / RA-8 photos / RA-9 editor — fix now (they break RULE AF on every page today) or first app-builder batch.
