# Three AI app builders — Base44 · Emergent · Lovable

Researched 2026-10-08 from public docs, pricing pages and review sites. For Educo's planned APP BUILDER
(the block model shown in a WebView inside an Expo shell with native chrome).
Anything not confirmed in a primary source is marked **UNVERIFIED**.

Primary doc indexes used:
- Base44: https://docs.base44.com/llms.txt (about 300 pages)
- Lovable: https://docs.lovable.dev/llms.txt (261 pages)
- Emergent: https://help.emergent.sh (a single-page app; all 99 articles were read from its public JSON feed
  `https://help.emergent.sh/api/kb/public-data`; each article's URL is `https://help.emergent.sh/<slug>`)

---

## 1. Base44 (owned by Wix since June 2025)

### 1.1 What it emits
- **Real source code**: React + Vite + Tailwind front end. Pages are files: `src/pages/Home.jsx` becomes `/`.
  There are also `components/`, `api/` (the Base44 SDK client), `entities/` (schemas) and `functions/`
  (backend functions, one TypeScript file each).
  https://docs.base44.com/developers/app-code/overview/project-structure.md
- **The backend is Base44's own** managed service: entities, auth, functions, integrations, and agents
  ("actors"). The front end talks to it through `@base44/sdk`. An SDK and a CLI exist, and the backend can
  also serve React, Vue, Solid, Hono and **React Native (Expo)** front ends.
  https://docs.base44.com/developers/backend/quickstart/frameworks/quickstart-with-react-native.md
- **Export / ejection**: two-way GitHub sync needs the Builder plan or higher. Once you connect GitHub, you
  cannot revert to versions from before the connection.
  https://docs.base44.com/developers/app-code/local-development/github.md
  `base44 eject` clones the app into a new local project with a new app ID, **but it still runs on Base44's
  backend**. The data stays in the original app.
  https://docs.base44.com/developers/references/cli/commands/eject.md
  An "Export app source code" API exists: https://docs.base44.com/api-reference/export-app-source-code.md
- **"Base Code"** is a separate cloud environment for editing an existing GitHub repo with AI on branches and
  pull requests. It works for web and full-stack projects only.
  https://docs.base44.com/Getting-Started/base-code.md

### 1.2 Native mobile
- **A WebView wrapper.** In Base44's words: "Your mobile app runs your published Base44 app inside a secure web view.
  This is a lightweight native wrapper around your web app that opens only your app's URL."
  Base44 generates an **IPA (iOS) and an AAB (Android)**. Web changes reach the app without resubmitting.
  https://docs.base44.com/documentation/building-your-app/uploading-to-app-stores.md
- **Publishing flow:** you create your own Apple and Google developer accounts. A built-in scanner checks the
  app against store guidelines and the AI suggests fixes. You download the files (Builder plan or higher) and
  submit them yourself. Base44 support does not handle store reviews.
- **Push notifications** are the main native capability. They need an APNs key and a Firebase project, and the
  `SendPushNotification` integration costs about 1 integration credit per send.
  https://docs.base44.com/Integrations/built-in-integrations.md
- **Stated limits:** no offline mode, no HealthKit, and digital purchases must happen on the web.
- **Phone vs tablet:** only "Your app automatically adjusts its layout for any device" (responsive web).
  There is no separate tablet layout.
  https://docs.base44.com/Building-your-app/Mobile-experience.md
- **This is the same architecture Educo plans** (WebView over the published site, native chrome added).

### 1.3 Screens and navigation
- Pages each have a URL path. Navigation menus come as header, sidebar, footer, or a responsive hamburger.
  Pages can be hidden from navigation, and some sections can be admin-only. All of this is managed through the
  AI chat. There is **no native tab, stack or drawer model**; it is web navigation.
  https://docs.base44.com/Building-your-app/managing-your-pages.md

### 1.4 Data and forms
- **Its own "entities"**: tables with fields of type text, number, yes/no, date/time, file, reference
  (relation) and object (JSON). You can edit schemas through chat or the `entities push` CLI, edit records
  directly, import CSV/Excel/JSON, and export CSV.
  https://docs.base44.com/Building-your-app/Managing-your-app-data.md
- The **underlying database engine is not disclosed** (UNVERIFIED).
- **Forms bound to records**: forms are generated as code that calls the SDK. There is no declarative form
  binding (UNVERIFIED beyond what the code shows).
- **File storage**: the `UploadFile` integration, plus file fields on records.
  `ExtractDataFromUploadedFile` turns CSV, Excel, PDF or image files into records.
- **Test data** is kept separate, a testing agent runs flows, and backup/restore is offered on Enterprise.

### 1.5 Auth and roles
- Built-in login and registration, SSO for apps, and app access settings (public, private or invite).
- **Row-level rules:** "Creator only", entity field compared with a user field (for example
  `assigned_to`), and User Property Check. The built-in roles are **Admin and User**. Custom roles are
  custom fields on the User table plus rules. You can set this up in plain language or with a visual
  permissions editor.
  https://docs.base44.com/Setting-up-your-app/Managing-security-settings.md

### 1.6 The AI conversation
- **Three chat modes: Build** (acts at once), **Discuss** (no code changes), and **Edit** (click an element in
  the preview to change it, or "Edit Element" with AI; a repeating element can be edited everywhere at once).
  Switch modes with Ctrl/Cmd + `.`.
  https://docs.base44.com/Building-your-app/AI-chat-modes.md
- **Plan mode before the first build:** a conversation that covers intent/goal, audience/roles, core flows and
  design. For design it shows **4 working previews of the main screen** to choose from, each refinable up to 3
  times. The final plan is then sent into the build chat.
  https://docs.base44.com/Getting-Started/starting-from-your-first-prompt.md
- **Versions:** version history with preview, "publish a previous version without changing your current
  draft", a Revert button on each chat message, and code comparison. Also branches, a canvas, a design system,
  a component library, a code tab, comments, and Figma import.

### 1.7 Integrations
- **Payments:**
  - Base44 Payments (powered by Wix) works in **11 countries only (US, UK, EU, Switzerland); no African
    country**. https://docs.base44.com/Setting-up-your-app/setting-up-wix-payments.md
  - Stripe is set up through chat on the Builder plan or higher.
  - Any other provider can be connected "as an integration" by asking the AI, so Paystack and Flutterwave
    are possible only as custom code (UNVERIFIED in practice).
    https://docs.base44.com/documentation/setting-up-your-app/setting-up-payments.md
- **Email:** SendEmail (about 1 credit, or 2 from a custom domain) and Resend.
  **Push:** SendPushNotification.
  **SMS and WhatsApp:** no built-in integration found; they would need custom integrations (UNVERIFIED).
- **Other:** LLM, image, video and speech generation, transcription, Zapier, Airtable, Slack, Gmail, GitHub,
  Snowflake, Databricks, MCP for apps, workflows and in-app AI agents.

### 1.8 Templates for schools
- The education use-case page lists Flashcards, Quizzes, Language Learning, Tutoring, Course Builder and Skill
  Assessment, with templates such as "Personalized Tutor" and "Knowledge Hub".
  https://base44.com/use-cases/categories/education
- There are student discounts (50% off) and university partnerships: https://base44.com/students,
  https://base44.com/highered
- **No school-website or school-administration template was found** (UNVERIFIED for the community tab).
- **Launchpad**: a community showcase where users vote, and top apps win credits and a featured spot.
  https://docs.base44.com/promoting-your-app/submitting-to-launchpad.md

### 1.9 Limits and complaints
- **Pricing (annual):**

  | Plan | Price per month | Message credits | Integration credits |
  |---|---|---|---|
  | Free | $0 | 25 | 100 |
  | Starter | $16 | 100 | 2,000 |
  | Builder | $40 | 250 | 10,000 |
  | Pro | $80 | 500 | 20,000 |
  | Elite | $160 | 1,200 | 50,000 |

  GitHub sync and app-store files need Builder or higher (the pricing page and the docs disagree slightly on
  Starter vs Builder). https://base44.com/pricing
- **Complaints:**
  - "Fix one thing, break another" regressions.
  - Debugging loops that reportedly eat 60–70% of credits.
  - Credits expire monthly and cannot be bought pay-as-you-go.
  - Trustpilot rating about 2.8/5, polarised.
  - Support is praised.
  - https://www.jetadmin.io/blog/base44-review, https://preuve.ai/blog/base44-review,
    https://vibecoding.app/blog/base44-review
- **Lock-in:** the code is portable, but **the backend (entities, auth, functions) is proprietary**. Even
  after ejection the app needs Base44's backend.

---

## 2. Emergent (emergent.sh, YC S24)

### 2.1 What it emits
- **Real source code.** The default stack is **React front end + FastAPI (Python) back end + MongoDB**. Other
  templates exist: Next.js (using its own API routes), Python-only, and **Mobile App = Expo/React Native**.
  https://help.emergent.sh/how-apps-work-here-mental-model
- **App types:** Full Stack App, Mobile App, Landing Page, and Brainstorm.
  https://help.emergent.sh/talk-it-through
- **Export:** "Save to GitHub" on paid plans (Standard and above) **pushes one way**. A repo can only be
  imported when a new job starts, and there is no pull or merge mid-project. There is **no download button**.
  Secrets are not pushed. https://help.emergent.sh/a-tour-of-the-workspace, https://help.emergent.sh/faqs
- An in-browser VS Code view is available on all plans.
- **Database export:** `mongodump` of the preview database from the VS Code terminal. Migrating the production
  database out is a manual runbook. https://help.emergent.sh/database-mongodb

### 2.2 Native mobile: the only one of the three that builds REAL native apps
- **Expo / React Native**, one codebase for iOS and Android.
- **Preview:** inside the workspace, through an **Expo Go QR code** (free), or by streaming to a cloud device.
- **Native builds need a paid plan.** Emergent runs **EAS on its own managed Expo account**: you never touch
  `eas-cli`, and "Do NOT modify eas.json".
  - iOS: the build is **uploaded straight to your TestFlight**, and you are never given an IPA.
  - Android: you get an APK and an AAB, and you upload the AAB to Play Console yourself.
  - You still need Apple ($99/yr) and Google ($25) developer accounts.
  - Bundle IDs are seeded as `com.emergent.<words>.<suffix>` and can be edited.
  - https://help.emergent.sh/starting-the-process, https://help.emergent.sh/publishing-to-the-stores,
    https://help.emergent.sh/package-name-bundle-id-app-id
- **Updates:** a backend change only needs a re-publish, with no store review. An app change needs a rebuild
  plus store review. Old app versions keep calling the updated backend.
  **No OTA/EAS Update is mentioned** (UNVERIFIED).
  https://help.emergent.sh/database-data-on-mobile
- **Web to mobile conversion** forks the job into a new mobile job that **shares the same backend**. The agent
  rewrites React web as React Native and "URL-based web routing converts to mobile navigation stacks and tabs".
  It works **one way only** (mobile to web is not supported), it is feature-flagged, and it does not support
  Next.js. https://help.emergent.sh/web-mobile-conversion-canonical
- **Push:** through **SuprSend** (APNs + FCM), "Emergent-managed push".
  https://help.emergent.sh/push-notifications
  **In-app purchases:** RevenueCat (Apple/Google IAP).
  https://help.emergent.sh/monetisation-in-app-purchases-subscriptions
- **Offline:** mobile apps "do not bundle a local database" and all data is in cloud MongoDB, yet another page
  mentions "offline-first local storage on-device". The docs contradict each other (UNVERIFIED).
- **Phone vs tablet:** no tablet-specific handling is documented (UNVERIFIED).

### 2.3 Screens and navigation
- Mobile apps use React Native navigation stacks, tab bars and drawers. The pre-publish checklist says
  "Navigation flows work end-to-end (tab bars, drawer menus, deep links)".
  https://help.emergent.sh/pre-publish-health-check
- When generating a mobile app, the agent asks about "authentication, navigation style, API endpoints,
  branding". The library used (expo-router or React Navigation) is UNVERIFIED.
- Web apps use React routing.

### 2.4 Data and forms
- **MongoDB.** Each app gets its own database on a shared Atlas cluster; a dedicated database costs extra.
  Preview and production databases are **separate**: preview data is not carried over, except on the first
  publish. You can browse it in a Database Manager.
- **Schema** is defined in code by the agent. There is no visual schema editor (UNVERIFIED).
- **Forms** are generated code calling FastAPI endpoints.
- **File storage**: Emergent Object Store, private by default, with signed URLs, accessed through the
  "Universal LLM Key". https://help.emergent.sh/file-storage-emergent-object-store

### 2.5 Auth and roles
- **Emergent Auth**: email/password and Google. Login runs on the hosted `auth.emergentagent.com` page, with
  "Secured by Emergent" branding that **cannot be removed on any tier**. User data sits in the app's MongoDB.
  You can ask the agent to switch to Clerk, Supabase Auth or Auth0.
  https://help.emergent.sh/emergent-auth-built-in
- **App-level roles** are whatever the agent codes; there is no built-in role model.
  **Builder-team roles:** Owner, Admin, Member, and Viewer (Viewer on Enterprise only).
  https://help.emergent.sh/team-roles-permissions-collaboration

### 2.6 The AI conversation
- **Plan mode** (a Build/Plan toggle, ⌥P): the agent proposes a plan card with "Request changes" or "Looks
  good, let's build it". It is not available in Brainstorm or E3 sessions. Discussion turns cost fewer credits.
  https://help.emergent.sh/talk-it-through
- The agent asks clarifying questions, especially for mobile.
- **Models:** E1, E2, E3, plus a "Maxx" mode for deeper reasoning.
- **Editing:**
  - Chat, screenshots and video.
  - **Canvas edit**: select an element in the preview, then describe the change in a chat popup. It is not a
    direct property editor. https://help.emergent.sh/make-it-yours
  - VS Code view.
- **Versions:**
  - A **checkpoint is saved after every agent turn**. Rollback is per chat message.
  - Rollback **erases later messages and code, with no roll-forward**, and it affects preview only.
  - **Fork** gives an independent copy, using a condensed chat summary.
  - Rolling back a deployment is free. https://help.emergent.sh/checkpoints-undo-anything
- The live app and preview are separate; changes go live only when you re-publish.

### 2.7 Integrations
- **Payments: Stripe, PayPal, Shopify, Razorpay (India), and PAYSTACK (Africa: cards, bank transfer, mobile
  money)**, each with its own help article.
  https://help.emergent.sh/paystack, https://help.emergent.sh/key-integrations-catalogue
- **Flutterwave:** no article (UNVERIFIED; "describe it in chat" applies).
- **Messaging:**
  - **Twilio** for SMS, voice and **WhatsApp**.
  - SendGrid.
  - Resend (managed, but **web apps only, not on Expo projects**).
- **Push:** SuprSend.
- **AI:** a Universal LLM Key covering OpenAI, Anthropic and Gemini, plus ElevenLabs and media generation.
- **Connectors:** MCP connectors and custom agents (Pro).

### 2.8 Templates for schools
- **No education template gallery was found.** "Learning projects" appears only as a use case
  (UNVERIFIED beyond that). https://help.emergent.sh/what-kind-of-apps-you-can-build

### 2.9 Limits and complaints
- **Pricing:**

  | Plan | Price per month | Credits per month |
  |---|---|---|
  | Free | $0 | 10 |
  | Standard | $20 ($17 annual) | 100 |
  | Pro | $200 ($167 annual) | 750 |
  | Business / Enterprise | custom | — |

  Standard adds GitHub, forking and buying extra credits. Pro adds a 1M context window, custom agents and
  system-prompt editing. Business adds RBAC and SSO, and Enterprise adds self-hosted DB and VPC.
  https://emergent.sh/pricing
- **Each deployed app costs 50 credits a month.**
  https://emergent.sh/tutorials/how-to-deploy-your-app-on-emergent
- **Complaints (Trustpilot):**
  - Credits drain unpredictably and per-prompt cost is opaque.
  - Billing continued after apps were taken offline.
  - Fixes reported as done that do not work.
  - Weak support.
  - https://www.trustpilot.com/review/emergent.sh, https://geekflare.com/guides/emergent-ai-review/
- **Lock-in:**
  - Managed EAS / Expo account and managed Apple keys.
  - Auth branding cannot be removed.
  - GitHub export is push-only.
  - The production DB has no direct external connection.

---

## 3. Lovable (lovable.dev)

### 3.1 What it emits
- **Real source code.**
  - New projects since **13 May 2026** use **TanStack Start** (React, rendered on the server). Before that the
    stack was React + Vite as a single-page app.
    https://docs.lovable.dev/features/upgrade-to-tanstack-start.md
  - Tailwind + shadcn/ui is widely reported (UNVERIFIED in current docs).
- **Database migrations** are written as Drizzle files in `drizzle/migrations/`.
  https://docs.lovable.dev/features/database.md
- **Export:**
  - **Two-way Git sync** with GitHub, GitLab and Bitbucket, on all plans (one branch synced at a time).
    https://docs.lovable.dev/integrations/github.md
  - Code editing and download need Pro. https://docs.lovable.dev/introduction/subscription-plans.md
  - Self-hosting is documented: https://docs.lovable.dev/tips-tricks/external-deployment-hosting.md
- **Backend:** "Lovable Cloud", built on Supabase (Postgres, auth, storage, edge functions, jobs). You can also
  connect your own Supabase. **Cloud cannot be migrated directly to your own Supabase**: you export the data
  and rebuild. The region is locked. https://docs.lovable.dev/features/cloud.md

### 3.2 Native mobile
- **None built in.** "Lovable builds web apps and publishing always deploys to a web URL."
  - There is an optional **PWA** setting.
  - A **Capacitor** wrapper can be built *outside* Lovable.
  - https://docs.lovable.dev/features/publish.md
- Third-party guides note that the TanStack Start (server-rendered) default makes Capacitor wrapping harder.
  URL wrappers such as Median are the usual route, with a risk of rejection under App Store guideline 4.2.
  https://vp0.com/blogs/can-lovable-publish-to-app-store-and-google-play,
  https://median.co/blog/how-to-convert-your-lovable-app-to-a-mobile-app-and-publish
- The "Lovable mobile app" is an editor for building from your phone, not a publisher.
  https://docs.lovable.dev/integrations/lovable-mobile-app.md
- **Phone vs tablet:** responsive web only.

### 3.3 Screens and navigation
- Web routes; file-based routes with TanStack Start (UNVERIFIED in docs, inferred from the framework).
  There is no native navigation model.

### 3.4 Data and forms
- **Managed Postgres (Supabase).**
  - **Schema** is created through chat or the SQL editor.
  - A table browser lets you edit records, and "Add row" opens a form generated from the schema.
  - Backups and restore are available.
  - Changes that would break the published app (dropping a table, renaming a column) are refused.
- **Forms in the app** are generated code. There is no declarative binding (UNVERIFIED).
- **Storage:** buckets, private by default; public buckets are blocked by default. Files up to 2 GB by
  default, raisable to 5 GB. https://docs.lovable.dev/features/storage.md

### 3.5 Auth and roles
- **Sign-in methods:** email, phone, Google, Apple, Microsoft, and SAML SSO. Workspace identity can be reused.
  https://docs.lovable.dev/features/authentication.md
- **Roles:**
  - Postgres row-level security.
  - The common pattern is a `user_roles` table plus a `has_role()` SECURITY DEFINER function used in RLS
    policies. This comes from third-party guides and is **UNVERIFIED in the official docs**.
    https://witscode.com/blogs/lovable-rbac
  - The security view and scanner flag weak RLS.

### 3.6 The AI conversation
- **Plan mode:** "Lovable often asks clarifying questions… before it proposes a plan". You can edit the plan
  document (overview, decisions, data models, steps), then press **Approve**, which switches to Build. Each
  Plan message costs 1 credit. https://docs.lovable.dev/features/plan-mode.md
- **Other modes:** Chat mode (discussion), Build/Agent mode, goal runs, subagents, project knowledge and
  skills, and drafts.
- **Editing:**
  - **Edit from the preview:** select an element, edit inline text, describe a change, annotate, or comment.
    Inline text edits are free up to 100; the rest consume credits.
    https://docs.lovable.dev/features/preview-toolbar.md
  - **Code mode** (Pro).
- **Versions:**
  - A version is made for every change, and versions can be bookmarked.
  - Revert does not delete the chat.
  - **Revert does NOT roll back database data.** https://docs.lovable.dev/features/projects/history.md
- Also a remix (copy) feature and a browser-testing agent.

### 3.7 Integrations
- **Payments:** Stripe and Paddle are built in, and Shopify for physical goods. Other providers can be added
  through edge functions, but this is "not officially supported". **No Paystack or Flutterwave.**
  https://docs.lovable.dev/features/payments.md
- **Messaging:**
  - **WhatsApp Business**: a managed connector with no keys needed, covering free-form replies within 24 h and
    Meta-approved templates. https://docs.lovable.dev/integrations/whatsapp.md
  - Twilio (SMS), Resend, Mailgun, Brevo and Telegram.
  - Branded email from your own domain.
- **Push:** a Firebase Cloud Messaging connector (Android, iOS and web), which needs a native shell for mobile.
- **About 100 other connectors** (CRMs, data warehouses, CMSs, Google Workspace, Microsoft 365 and more), plus
  MCP and "publish your app as an MCP server".

### 3.8 Templates for schools
- **Education templates:** Flashcard App, **Teacher Grading Tool** (rubrics and annotations), Course Landing
  Page and Growth Workshop Page, with filters for Educators and Students.
  https://lovable.dev/templates/apps/education
- **Student and teacher discount:** 50% off Pro for 12 months.

### 3.9 Limits and complaints
- **Pricing:**
  - Pro from $25/mo for 100 credits; Business from $50/mo.
  - A daily allowance of 5 build credits; on Free this is capped at 30 a month.
  - **One credit balance pays for building, hosting, Cloud backend and AI features.**
  - https://docs.lovable.dev/introduction/subscription-plans.md
- **Complaints:**
  - Credits burned in regression loops ("17 credits fixing a table layout that broke again").
  - Whole-file rewrites.
  - Surprise Cloud usage charges (up to $100 a day reported).
  - "I have spent almost $3,000… It is a trap."
  - https://skillscouter.com/lovable-review/, https://www.forasoft.com/blog/article/lovable-app-bugs-fix-cost,
    https://nz.trustpilot.com/review/lovable.dev?page=2
- **Lock-in:** low for code (two-way Git). Medium for Cloud data, because there is no direct migration and the
  region is locked.

---

## 4. Comparison

| | **Base44** | **Emergent** | **Lovable** |
|---|---|---|---|
| Output | React + Vite + Tailwind code, on the **proprietary Base44 backend** (entities, SDK, TypeScript functions) | React + **FastAPI + MongoDB**; Next.js; **Expo/React Native** for mobile | **TanStack Start** (React, server-rendered; Vite single-page app before May 2026) + **Supabase** Postgres |
| Export | 2-way GitHub (Builder+); `eject` still needs the Base44 backend | Push-only "Save to GitHub" (Standard+); no zip; manual DB migration | **2-way Git** (all plans), self-hosting documented; Cloud to own Supabase needs a manual rebuild |
| Native apps | **WebView wrapper**: IPA + AAB downloaded (Builder+), you submit; push only; no offline | **Real Expo/RN**: Expo Go preview, **managed EAS**, automatic TestFlight upload, AAB for Play; IAP through RevenueCat | **None**: PWA, or Capacitor/Median outside Lovable |
| Phone vs tablet | Responsive only | Not documented | Responsive only |
| Navigation model | Web pages + header/sidebar/footer/hamburger menus | RN stacks, tabs and drawers (web routes converted) | Web routes |
| Data | Own entities (typed fields, relations, files); CSV/Excel/JSON import | MongoDB (shared Atlas cluster), preview and production DBs separate | Postgres + Drizzle migrations; table editor; SQL |
| Visual schema / record editing | Yes (record editor; schema through chat/CLI) | Database Manager browse; schema through the agent | Table browser, add-row form, SQL editor |
| Auth | Built in, SSO, access settings | Emergent Auth (email + Google), **branding cannot be removed** | Email, phone, Google, Apple, Microsoft, SAML |
| Roles | **Declarative rules UI**: Admin/User + custom user fields; creator-only and field-match row rules | Coded by the agent | Postgres RLS (user_roles pattern, UNVERIFIED in docs) |
| Before building | **Plan mode: goals, roles, flows, and 4 design previews to pick from** | Plan mode with a plan card + clarifying questions | Plan mode: clarifying questions + an editable plan + Approve |
| Editing after | Build / Discuss / **Edit (click element)**, code tab, canvas | Chat, Canvas edit (select element, then chat), VS Code | Chat/Plan/Build, preview toolbar (select, inline text, annotate), Code mode |
| Versioning | History, revert per message, **publish an old version without touching the draft**, branches | Checkpoint per turn; rollback erases later work; fork | Version per change, bookmarks; **DB not reverted** |
| Payments | Wix Payments (11 countries, **no Africa**), Stripe; others custom | Stripe, PayPal, Razorpay, **Paystack**, RevenueCat IAP | Stripe, Paddle, Shopify; others unsupported |
| SMS / WhatsApp | Not built in (UNVERIFIED) | Twilio (SMS + WhatsApp) | **Managed WhatsApp Business**, Twilio |
| Push | SendPushNotification (WebView app) | SuprSend (APNs/FCM) | FCM connector (needs a native shell) |
| Education templates | Tutor, quizzes, flashcards, course builder | None found | Flashcards, **Teacher Grading Tool**, course landing page |
| Entry price | $16/mo (Starter) | $20/mo, + **50 credits per month for each deployed app** | $25/mo (Pro) |
| Top complaint | Regression loops eat credits; credits expire monthly | Opaque credit drain, billing after shutdown | Regression loops, surprise Cloud costs |

---

## 5. What this means for Educo's app builder (observations, not decisions)

1. **Educo's planned architecture (an Expo shell + a WebView over the exported page + native push, offline and
   deep links) is Base44's mobile architecture.** Base44 shows it ships through the stores. Its stated gaps
   (no offline, push as the only native feature) are exactly the native layer Educo plans to add.
2. **Emergent is the only one of the three that builds true native apps, and it pays for that.** Web to mobile
   is a one-way rewrite into a separate React Native codebase that must be kept in sync by the agent. That is
   the "canvas ≠ export" problem Educo's rule 20 avoids.
3. **Nobody exposes a structured, declarative app model.** All three generate code, and edits are made by
   chatting to code. Educo's block model (emitted by the LLM instead of code) has no direct equivalent among
   the three.
4. **Africa:** only Emergent documents Paystack. None documents Flutterwave. Lovable has the best managed
   WhatsApp connector. Base44's own payments exclude Africa.
5. **Worth copying:**
   - Base44's plan mode that shows **4 design previews to choose from** (this matches RULE S).
   - Base44's **declarative permission rules** (creator-only, field matches user, user property).
   - Base44's **"publish an older version without touching the draft"**.
   - Lovable's **refusal of destructive schema changes**.
   - Emergent's **managed EAS with automatic TestFlight upload**.
   - The pre-submit **store-guideline scanner** (Base44).
