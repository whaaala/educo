# Website Builder — Study (Hostinger) + Build Plan

**Date:** 2026-08-22
**Goal:** Build a modern, easy, intuitive school website builder — the *front door* product (the built site's login leads into the Educo admin app). Studied Hostinger's builder as the reference for "how a website builder should be," then adapted to our ecosystem (our `SlideCanvas`/section model, shared components, themes). Build on what we have; don't diverge.

---

## Part 1 — How a modern builder works (learned from Hostinger)

The builder is organized around **8 pillars**, exposed as left-panel tabs + a top bar:

1. **Sections (the core UX).** The page is a vertical stack of **sections**. You add a section by clicking *between* sections → a **library** opens with **categories** (hero, about, features, gallery, testimonials, contact, footer, CTA…), each offering **several pre-designed layouts** to drop in. Section toolbar: move up/down, duplicate, hide/show, delete, drag-to-resize height. Edit-section tabs: **Background / Layout (snap, spacing, row height/gap) / Anchor**. → *Pick-and-tweak, not blank-canvas. This is what makes it "anybody can use it."*

2. **Elements (inside sections).** 16+ types: Text, Running text, Button, Image, Gallery, Video, Shape, Card, Map, Instagram, Contact form, Subscribe form, Social icons, Embed code, Search. Add from left panel — **drag-drop or click** to insert into the selected section. Click an element → **inline toolbar + settings**. Layering for overlaps.

3. **Global Styles.** A **Styles panel** sets site-wide **Colors** (change one → replaces it everywhere), **Typography** (one font for headings, one for body/nav; per-device sizes), **Button shape**, **Animations**. Global cascade with per-element local override.

4. **Pages.** Add/rename/duplicate/delete/reorder/hide; set URL slug; designate homepage; per-page settings (General / Social image / Password). Nav auto-reflects pages. No limits.

5. **Responsive / Mobile.** A **desktop⇄mobile toggle**. Mobile **inherits** desktop by default; you can independently **reposition (within a section), resize, hide per-device, and set per-device font size/alignment/line-height**. "Auto-fix layout" keeps mobile following desktop until you manually edit. Deletions cascade both ways. Rule: don't move elements *between* sections.

6. **Navigation / Header.** Logo (show/hide/replace/size), menu items (from Pages), layout/spacing, normal+hover styling, **sticky header**, mobile **burger** menu. Consistent across pages.

7. **Content types + Forms + SEO + Settings.**
   - **Forms:** contact/subscribe; fields (short answer, paragraph, single/multiple choice, required); submit label + post-submit (thank-you / redirect); **submissions inbox** (view/export CSV/delete).
   - **Blog & Store:** post management (draft/scheduled/published, categories); enable eCommerce.
   - **SEO:** per-page meta title (60) + description (160), social image, sitemap, noindex, hreflang; AI SEO assistant.
   - **Settings:** favicon, cookie banner, WWW prefix, **integrations** (GA, Hotjar, WhatsApp, custom head/embed code), **analytics** (traffic), **media library**, **version history**, multilingual.

8. **AI generation.** Prompt box *"Describe your website or business"* (~700 chars) → **"Improve description"** (AI expands the prompt) → generate a full multi-page site (Home/About/Services/Contact…). Then **chat-to-refine** + direct-edit any text/image. Publish = one click (hosting/SSL handled).

**Publish flow:** draft → preview (auto preview domain) → **Go Live** → connect custom domain → **Update** pushes changes.

---

## Part 2 — What we already have (reuse, don't rebuild)

| Need | We already have |
|---|---|
| Freeform section canvas (drag/resize/snap/text) | `SlideCanvas` (reused per section) ✅ |
| Element model (text/image/shape/chart/table/video) | `SlideObject` union + factories ✅ |
| Global color/type pickers | `ColorPalettePicker`, `TextFormatToolbar`, font list in root layout ✅ |
| Dialogs / toolbars / buttons | `EditorDialogs`, `EditorToolbar`, `Button`, `Tooltip`, `Modal` ✅ |
| Data model + store | `lib/site-storage.ts` (Site→Page→Section→SlideObject) ✅ |
| Entry point + editor shell | `/website` + `/website/builder` + `SiteBuilder` ✅ |
| Themes | dark/midnight/purple variants ✅ |
| Arrange/reorder ops | `lib/editor-ops/*` ✅ |

**The one key shift:** move from *blank freeform canvas* to a **section-template LIBRARY** as the primary UX (freeform editing still available underneath). This is the single biggest lever for "easy, intuitive, anybody can use it." Our earlier "hybrid" decision already points here — we just need a real library of pre-designed sections.

---

## Part 3 — What's broken right now (must fix first, to be testable)

1. **Scroll** — the page/section stack must scroll smoothly within the fixed viewport.
2. **Full-screen** — now `fixed inset-0` (fixed) but needs verification across the shell.
3. **Responsive builder chrome** — fixed `w-64` left+right panels squeeze the canvas on tablet/mobile; panels must collapse / become drawers. (Separate concern from the *built site's* responsiveness, which is pillar 5.)

---

## Part 4 — Proposed phased plan (adapted to a school website builder)

**Phase 0 — Solid & testable shell (do first).** Fix scroll + full-screen + make the builder chrome responsive (collapsible panels / mobile drawers). Verify on 375 / 768 / 1280.

**Phase 1 — Section library (the core).** A categorized library of **pre-designed school sections** with multiple layouts each: Hero, About, Programs/Academics, Staff/Faculty, Admissions/CTA, Gallery, Testimonials, News/Events, Contact, Footer, **Staff/Parent Portal login block** (links into the admin app). Add-between-sections UX + section toolbar (move/duplicate/hide/delete/height) + edit tabs (Background/Layout).

**Phase 2 — Elements & inline editing.** Expose the element palette (text, button, image, gallery, video, shape, icon, form, social, embed) with drag/click insert + inline toolbars. Wire **image upload** (currently missing).

**Phase 3 — Global Styles.** Site-wide colors + typography (heading/body fonts) + button shape, cascading with local override. Apply theme to all sections.

**Phase 4 — Pages & Navigation.** Full page management (add/rename/duplicate/delete/reorder/hide/slug/home) + a real **header/nav** component (logo, menu from pages, sticky, mobile burger) rendered on every page.

**Phase 5 — Responsive (built site).** Desktop⇄mobile editing model: per-device visibility + basic per-device layout; ensure the *published* output is mobile-safe.

**Phase 6 — Forms + SEO + Settings.** Contact/subscribe forms + submissions inbox; per-page SEO; favicon/settings; the **Staff Portal login** wired to the admin app.

**Phase 7 — AI generation.** Prompt → site (v1 deterministic composer over the section library; v2 real Claude via one API route). "Improve description" + regenerate + swap-template.

**Phase 8 — Publish/hosting.** The deferred backend: save + publish + host at a URL. First real backend touch.

---

## Part 5 — Open decisions (brainstorm)
- Primary UX = **section-template library** (recommended) vs. keep freeform-first?
- Sequencing: fix-blockers-first (Phase 0) then library (Phase 1) — agreed?
- Templates: user will provide a link to a templates source to seed Phase 1.
