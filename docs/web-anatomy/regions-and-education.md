# Page regions and education-site requirements

A reference catalogue for the Educo website builder. It covers the page regions every site has (header, navigation, footer, sidebars) and what a school website in England must, should and usually does publish.

Researched 2026-09-27 from primary sources. Every guideline links to where it came from. Where a line is our own recommendation for Educo rather than a quoted source, it is labelled **Educo:**.

**Scope note.** The statutory lists in section 5 apply to **England** (DfE guidance, last updated 24 October 2024). Scotland, Wales and Northern Ireland have their own rules. The accessibility regulations cover the whole UK, and Northern Ireland has a different enforcement body.

---

## 0. Landmarks: the skeleton every region hangs on

Source: [W3C WAI, Page Regions](https://www.w3.org/WAI/tutorials/page-structure/regions/)

| Region | Element | Implicit role | Rule |
|---|---|---|---|
| Site header | `<header>` (page level) | `banner` | Gets the landmark role only when it is not inside `<article>`/`<section>`. |
| Navigation | `<nav>` | `navigation` | A page may have several. Give each one a name: `aria-label="Main"`, `"Footer"`, `"Breadcrumb"`, `"In this section"`. |
| Main content | `<main>` | `main` | One per page. It is the target of the skip link. |
| Sidebar | `<aside>` | `complementary` | Content that makes sense on its own. |
| Site footer | `<footer>` (page level) | `contentinfo` | Same scoping rule as the header. |

**Educo:** every header block exports a "Skip to main content" link as its first focusable element. A header or footer block dropped *inside* a section still exports as `<header>`/`<footer>`, but the canvas should warn that it will not be a page landmark there.

---

## 1. HEADER variants

The header does four jobs: identity (logo and name), primary navigation, utility links (search, contact, portals, translate) and one main call to action. NN/g's finding for university sites carries over to schools: **show the institution's identity prominently on every page**, not only in the footer ([NN/g, University sites](https://www.nngroup.com/articles/university-sites/)).

### 1.1 Single row
- **Anatomy:** logo on the left, horizontal nav in the middle or right, then an optional search icon and CTA button on the far right.
- **When to use:** up to about 6 to 8 top-level items. Finalsite recommends **"no more than eight"** top-level pages and ideally 6 ([Finalsite, sitemap & navigation](https://www.finalsite.com/blog/p/~board/b/post/school-website-navigation-strategies)).
- **Phone:** logo, plus a visible "Menu" button (icon *and* the word). The nav moves into a drawer or accordion (see 2.4). When there are 4 or fewer links, keep them visible ([NN/g, Hamburger menus](https://www.nngroup.com/articles/hamburger-menus/)).

### 1.2 Logo-centred
- **Anatomy:** logo in the centre with the nav split around it (left and right halves), or with the nav in a row underneath.
- **When to use:** brand-led sites (independent schools, prestige). Split nav only works with an even number of short labels.
- **Phone:** the logo stays centred, "Menu" goes on the left and search or CTA on the right. The split nav becomes one list in the drawer.
- **Caveat:** a split nav breaks reading order when it wraps. The DOM order must match the visual order left to right.

### 1.3 Multi-row with utility bar
- **Anatomy:** a thin **utility bar** at the top (phone, email, translate, search, portal links such as "Parent Portal", "ParentPay", "Arbor", social icons), then the **main row** (logo and nav). An optional third row holds a sub-nav or an alert banner.
- **When to use:** this is the **default for schools**. Every UK school we sampled had one or its equivalent:
  - Brampton Manor has a utility row of Arbor, WebMail, Remote Desktop, X/Twitter, LinkedIn, search and translate ([bramptonmanor.org](https://www.bramptonmanor.org/)).
  - Dunraven has Translate, Contact and Search, plus separate Parent Area and Student Area link groups ([dunraven.org.uk](https://www.dunraven.org.uk/)).
  - Preston Primary shows the phone number and email in the header ([prestonprimary.co.uk](https://www.prestonprimary.co.uk/)).
- **Phone:** the utility bar collapses. Keep phone and search as icons with labels, and move portal links into the top of the drawer or into a "Quick links" group. Never hide the phone number behind two taps.
- **Guideline:** NN/g puts utility navigation at the **top** ([NN/g, Menu design](https://www.nngroup.com/articles/menu-design/)).

### 1.4 Transparent over hero
- **Anatomy:** the header sits on top of a full-bleed hero image or video, with light text on a transparent background. On scroll it becomes opaque.
- **When to use:** marketing homepages that have a strong photo. Use it sparingly on inner pages.
- **Risk:** text contrast over a photograph the user chose is unknown. NN/g warns that translucent headers "create low contrast that makes content hard to read" ([NN/g, Sticky headers](https://www.nngroup.com/articles/sticky-headers/)).
- **Educo:** allow it only with a scrim or gradient token behind the header, and **assert 4.5:1 contrast** against the sampled image, as CLAUDE.md rule 17 requires. The header turns opaque as soon as the page scrolls.
- **Phone:** the same, but the hero is shorter. Check that the Menu button stays visible over light areas of the photo.

### 1.5 Sticky (fixed)
- **Anatomy:** the whole header, or a compact version of it, stays at the top of the viewport.
- **When to use:** only if its contents are needed "often or at any point during a session" ([NN/g, Sticky headers](https://www.nngroup.com/articles/sticky-headers/)). Long pages and sites with frequent section switching qualify. Finalsite lists sticky nav as a school trend and says to "keep it minimal" ([Finalsite, 4 nav trends](https://www.finalsite.com/blog/p/~board/b/post/top-navigation-trends-school-websites)).
- **Rules** (NN/g): keep it small, with an opaque background and minimal animation. On mobile, tap targets should be about 1 cm × 1 cm with text about 16 pt, and the header should be no taller than that.
- **Rules** (Smashing): **no more than five items** in a sticky bar. Avoid sticky elements while a virtual keyboard is open, because the keyboard can take "up to 60% of the screen" ([Smashing, Sticky menus UX](https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/)).
- **Accessibility:** WCAG 2.2 **SC 2.4.11 Focus Not Obscured (AA)** means a focused element must not be *entirely* hidden by author content such as a sticky header or footer. The fix is `scroll-padding-top` equal to the header height ([W3C Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)). The same padding fixes in-page anchors landing under the header. At 400% zoom a sticky header can fill the screen, so **Educo:** drop stickiness when the viewport height in `em` falls below a threshold.

### 1.6 Hide on scroll down, show on scroll up ("partially persistent")
- **Anatomy:** the header slides out while the reader scrolls down and slides back when they scroll up.
- **Rules:** a 300 to 400 ms animation. Trigger only after "a few pixels" of scroll so the header does not jitter ([NN/g](https://www.nngroup.com/articles/sticky-headers/); the same 300 to 400 ms figure is in [Smashing](https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/)).
- **When to use:** long reading pages on phones, where vertical space is scarce.
- **Accessibility:** it must reappear when focus moves into it by keyboard. Respect `prefers-reduced-motion` by swapping the slide for an instant show or hide.

### 1.7 Shrinking
- **Anatomy:** a tall header (large logo, two rows) that condenses to one compact row after a scroll threshold.
- **Rules:** NN/g accepts animation for "shrinking a large header". It must be "quick, smooth, and immediate" ([NN/g](https://www.nngroup.com/articles/sticky-headers/)).
- **Phone:** usually start in the compact form, because there is no room for a tall state.
- **Educo:** avoid a layout jump. Use an animated `height`/`padding` on the header itself, never on content that is in flow.

### Header: builder properties (Educo)
Layout (single / centred / split / multi-row) · utility bar on/off · sticky: none / always / hide-on-down / shrink · transparent-over-hero (with contrast guard) · CTA button · search · translate · phone-breakpoint collapse rung · skip link (always on).

---

## 2. NAVIGATION variants

**Universal NN/g rules** ([Menu design](https://www.nngroup.com/articles/menu-design/)):
- Show navigation **visibly on desktop**.
- Show "where am I" with a current-page indicator.
- Use clear, familiar labels, not internal jargon.
- Make targets large.
- Put a caret on items that have a submenu.
- **Prefer click over hover** to open submenus.
- **Avoid multi-level cascading fly-outs.** Use a mega menu or a flat structure instead.

Finalsite adds a school-specific point: use family-centred language, never internal department names ([Finalsite](https://www.finalsite.com/blog/p/~board/b/post/school-website-navigation-strategies)). NN/g found that 48% of university-site users did not realise a programme they wanted existed, because it was organised by internal structure ([NN/g, University sites](https://www.nngroup.com/articles/university-sites/)).

### Accessibility baseline for every menu with a submenu
From the [WAI-ARIA APG disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) and [WAI Fly-out menus](https://www.w3.org/WAI/tutorials/menus/flyout/):
- Use the **disclosure pattern**: a `<button aria-expanded="false" aria-controls="…">` opens a list of links. **Do not use `role="menu"`/`menubar` for site navigation.** Assistive technology expects application-style menu behaviour that site nav does not provide.
- If the parent must also be a link, add a **separate toggle button** whose accessible name says what it does ("Show submenu for Admissions").
- **Tab** moves between buttons and links. **Enter/Space** toggles. **Escape** closes the submenu and **returns focus to its button**. Arrow keys and Home/End are optional extras.
- Submenus must **not** open just because focus arrived by Tab.
- Mark the current page with `aria-current="page"`. The GOV.UK service navigation also wraps the active label in `<strong>` as a non-colour cue ([GOV.UK service navigation](https://design-system.service.gov.uk/components/service-navigation/)).
- Hover timing: WAI suggests a **~1 s** close delay for imprecise pointers. NN/g (mega menus) says wait **0.5 s** before showing, show within 0.1 s, and keep the menu open until the pointer has been out for 0.5 s ([NN/g](https://www.nngroup.com/articles/mega-menus-work-well/)).

### 2.1 Horizontal (flat)
- **What it is:** a row of top-level links with no submenus.
- **When to use:** small sites (brochure, a primary school with 5 to 7 sections).
- **Phone:** the Menu button reveals a vertical list. With 4 links or fewer, show them inline or as tabs ([NN/g](https://www.nngroup.com/articles/hamburger-menus/)).

### 2.2 Dropdown (single-level disclosure)
- **What it is:** each top item reveals one short column of links.
- **When to use:** second-level lists of about 3 to 10 items. This is the common school pattern: Camp Hill's "Our School" has Headmaster's Welcome, Vision & Values, Exam Results, Ofsted Reports and School Policies ([camphillboys.bham.sch.uk](https://www.camphillboys.bham.sch.uk/)).
- **Rule:** one level only. A third level becomes a side nav on the landing page (2.7), not a fly-out.

### 2.3 Mega menu
- **What it is:** a wide panel of grouped columns, sometimes with an image or CTA.
- **When to use:** many options. It lets users "see rather than try to remember" ([NN/g, Mega menus](https://www.nngroup.com/articles/mega-menus-work-well/)).
- **NN/g rules:**
  - Group items using card sorting, with medium-sized groups and concise labels that put the information-carrying words first.
  - Put the most important group top-left, and list each item only once.
  - **No form widgets or search boxes inside.**
  - Show 2 to 3 IA levels at most.
  - Mind screen-magnifier users, who may not see the whole panel.
- **Schools:** Eton's menus are effectively mega menus, for example "Outside the Classroom" has 13 children ([etoncollege.com](https://www.etoncollege.com/)). Finalsite recommends mega menus with "organized, column-based layout" and good contrast with the content underneath ([Finalsite trends](https://www.finalsite.com/blog/p/~board/b/post/top-navigation-trends-school-websites)).
- **Phone:** becomes an accordion in the drawer, one group per section.

### 2.4 Off-canvas / drawer (hamburger)
- **What it is:** a panel that slides in from the side and contains the full nav.
- **Evidence:** hidden navigation was used in **27%** of desktop cases against **48 to 50%** for visible navigation, and users were **39% slower**. On mobile the figures were 57% against 86% for combo nav, and 15% slower ([NN/g, Hamburger menus](https://www.nngroup.com/articles/hamburger-menus/)).
- **Rules:** **don't use it on desktop.** On mobile it is acceptable when there are more than 4 links. Supplement it with in-page links. Label it "Menu" as well as showing the icon ([Finalsite](https://www.finalsite.com/blog/p/~board/b/post/top-navigation-trends-school-websites)).
- **Inside the drawer:** use **accordions** rather than sliding sub-panels. Accordions are faster, because slide-in levels force users "back to the previous level" ([Smashing, Mobile nav](https://www.smashingmagazine.com/2022/11/navigation-design-mobile-ux/)). Keep nesting to **two levels**, and make each level visually distinct.
- **Accessibility:** use a toggle button with `aria-expanded`. While the drawer is open, make the rest of the page `inert` so focus stays inside. Escape closes it and returns focus to the button. The close button comes first in the drawer.
- **Reference:** the GOV.UK service navigation collapses to a "Menu" toggle on small screens when there is more than one item ([GOV.UK](https://design-system.service.gov.uk/components/service-navigation/)).

### 2.5 Full-screen overlay
A drawer that covers the whole viewport. Use it on phones only: NN/g says to avoid full-screen overlays on larger devices ([Menu design](https://www.nngroup.com/articles/menu-design/)). Accessibility is the same as the drawer.

### 2.6 Bottom tab bar
- **What it is:** 3 to 5 fixed icon-and-label tabs at the bottom of a phone screen.
- **When to use:** only with **"4 to 5 or fewer"** destinations ([NN/g, Mobile nav patterns](https://www.nngroup.com/articles/mobile-navigation-patterns/)). It suits app-like surfaces, such as the Educo app section for a school (CLAUDE.md rule 20: Home, Calendar, News, Contact).
- **Accessibility:** it is sticky at the bottom, so SC 2.4.11 applies. Add `scroll-padding-bottom` and leave room for the safe area. Always show text labels.

### 2.7 Side nav (local / section nav)
- **What it is:** a vertical list of the current section's sibling pages (and children), on the left. Together with the top nav it forms an inverted L.
- **When to use:** users browse several pages in one section, or arrive on inner pages from search ([NN/g, Local navigation](https://www.nngroup.com/articles/local-navigation/)). School examples are a "Key Information / Statutory Information" section with 10 to 15 child pages, and Curriculum with one page per subject.
- **Rules:** it must be visibly **subordinate to the global nav**, and it highlights the current page. For hierarchies deeper than 3 tiers, lean on breadcrumbs instead.
- **Phone:** becomes an "In this section" disclosure placed above the content.
- Finalsite's "left or jump-to navigation" is a school trend ([Finalsite](https://www.finalsite.com/blog/p/~board/b/post/top-navigation-trends-school-websites)).

### 2.8 In-page / sub-nav (tabs, jump links, table of contents)
- **What it is:** horizontal chips or a list of anchors to sections of the same page.
- **Rules:**
  - Needs `scroll-padding-top` so a target never lands under a sticky header ([Smashing](https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/)).
  - Highlight the active section as the reader scrolls ([NN/g, TOC](https://www.nngroup.com/articles/table-of-contents/)).
  - A horizontally scrolling chip row on a phone needs a visible overflow cue.

### 2.9 Breadcrumb
- **NN/g's 11 guidelines** ([Breadcrumbs](https://www.nngroup.com/articles/breadcrumbs/)):
  - Supplement the nav, never replace it.
  - Show hierarchy, not history, with one canonical path.
  - Start at Home and end with the **current page, unlinked**. Include only real pages.
  - Skip breadcrumbs on flat sites.
  - On mobile, don't wrap to several lines. Keep tap targets large, and truncate the trail if needed.
- **Markup:** `<nav aria-label="Breadcrumb"><ol>…</ol></nav>`, with `aria-current="page"` on the last item and separators drawn in CSS so screen readers don't announce them.
- **Phone:** show only "‹ Parent section" (a back link to the parent), or truncate the middle of the trail.

### 2.10 Pagination
- **What it is:** Previous / numbered pages / Next for news, events and galleries.
- **Rules:** `<nav aria-label="Pagination">`. The current page gets `aria-current="page"` and must not be colour-only. Links read "Next page" and "Previous page", not just arrows. Keep the page in the URL so a result can be linked.
- **Phone:** show Previous / "Page 3 of 12" / Next.
- A "Load more" button is fine for news. **Avoid infinite scroll above a footer** that has statutory links: NN/g notes that infinite-scroll sites must move footer content elsewhere ([NN/g, Footers](https://www.nngroup.com/articles/footers/)).

Also offer **search** as backup navigation ([Finalsite](https://www.finalsite.com/blog/p/~board/b/post/top-navigation-trends-school-websites)), and an **A–Z index** for large sites such as a policy library ([Smashing](https://www.smashingmagazine.com/2022/04/designing-better-navigation-ux-queries/)).

---

## 3. FOOTER variants

**NN/g** ([Footers](https://www.nngroup.com/articles/footers/)):
- Users go to the footer deliberately, or "as a last resort for hard-to-find content".
- **Utility links are essential for every site.**
- Don't nest more than two levels, and use conventional labels ("Contact", not "Resources").
- **Never collapse the footer into accordions.**
- Keep it identical on every page.

**GOV.UK footer** ([Design System](https://design-system.service.gov.uk/components/footer/)):
- Optional navigation columns, then a meta row of support links: **Privacy, Accessibility, Cookies**, Terms, Help.
- Then licence and copyright.

### 3.1 Minimal
- **Contents:** one row with copyright, a few legal links and social icons.
- **When to use:** landing pages and microsites. **Schools:** not enough on its own, because the statutory and accessibility links must still be reachable. Pair it with a Key Information nav item.

### 3.2 Multi-column
- **Contents:** 3 to 5 columns, typically "About / Parents / Key information / Contact", each with a heading and 4 to 8 links.
- **Phone:** the columns stack in one column. NN/g says don't collapse them. **Educo:** the default is stacked, and an accordion is an explicit opt-in with a warning.

### 3.3 Fat footer / doormat / sitemap footer
- **Contents:** repeats the global nav, with subcategories.
- **When to use:** large sites and long mobile pages ([NN/g](https://www.nngroup.com/articles/footers/)). Oughtrington Primary's footer "replicates the complete main navigation menu" ([oughtringtoncps.co.uk](https://www.oughtringtoncps.co.uk/)).
- **Nav name:** label it `aria-label="Footer"` so it is distinct from Main.

### 3.4 Newsletter / CTA band
- **Contents:** a band above the footer with a sign-up form (a visible label and consent text, errors linked by `aria-describedby`) or CTAs such as "Book a tour" or "Apply".
- **Schools:** usually "Latest newsletter", "Book a visit" or "Admissions open" rather than an email capture. Preston Primary puts Admissions, Newsletter and Calendar cards on its homepage ([prestonprimary.co.uk](https://www.prestonprimary.co.uk/)).

### 3.5 Legal bar
- **Contents:** the bottom strip, holding © name and year, **Accessibility statement**, **Privacy notice**, **Cookies**, Terms, Sitemap, company or charity number, and site credit.
- Real examples:
  - Eton: charity number and a "Policies and Reports" link ([etoncollege.com](https://www.etoncollege.com/)).
  - Dunraven: sitemap, Terms, Privacy, Cookie Usage, and a **"high visibility version"** ([dunraven.org.uk](https://www.dunraven.org.uk/)).
  - Camp Hill: privacy and accessibility statements, ParentPay, and parents' evening booking ([camphillboys.bham.sch.uk](https://www.camphillboys.bham.sch.uk/)).

**Educo: school footer default.**
- Columns: school name, full postal address, phone, email and named contact (all statutory, see 5.1) · Quick links (Term dates, Calendar, Parent portal, Payments, Vacancies) · Key information (Ofsted, Policies, SEND, Admissions) · Social.
- Legal bar: Accessibility statement · Privacy notice · Cookies · Sitemap · Trust/company number where relevant.

---

## 4. SIDEBARS

### 4.1 Content aside
- **What it is:** an `<aside>` holding related links, key contacts, downloads (the policy PDFs for a page) or an upcoming-events widget.
- **Rules:** it must make sense on its own ([WAI regions](https://www.w3.org/WAI/tutorials/page-structure/regions/)). Label it when there are several. Beware "right-rail blindness", because users ignore ad-like right columns ([NN/g, TOC](https://www.nngroup.com/articles/table-of-contents/)). Keep it plain and non-graphical.
- **Phone:** it stacks **after** the main content, unless it is task-critical (a "Report an absence" button). In that case put a copy above the content.

### 4.2 Sticky table of contents
- **What it is:** a left or right rail listing the page's headings. It stays in view and highlights the section being read.
- **Rules:** a TOC in a rail **should be sticky**, while a TOC in the main body should not ([NN/g, TOC](https://www.nngroup.com/articles/table-of-contents/)).
- **Uses:** long policy pages, the SEND information report, the curriculum overview.
- **Phone:** moves into the body as a "Contents" disclosure at the top of the page.
- **Accessibility:** `<nav aria-label="On this page">`. It must not obscure focus (2.4.11), and it scrolls on its own if it is taller than the viewport.

### 4.3 Filter panel
- **What it is:** facets for news (category, year group), events (date, type), the staff directory (department) and the policy library.
- **Batch vs interactive** ([NN/g, Applying filters](https://www.nngroup.com/articles/applying-filters/)):
  - Apply filters **interactively** only if results return in under 1 s. Otherwise offer an **Apply** button.
  - Don't jump to the top of the page when results update.
- **Desktop:** a left rail. **Phone:** a "Filters (n)" button opens a full-height dialog with Apply and Clear. Applied filters show as removable chips above the results.
- **Accessibility:** use fieldsets and legends. Announce the result count through a polite live region.

---

## 5. EDUCATION

### 5.1 Statutory publishing: maintained schools in England ("must")
Source: [DfE, What maintained schools must publish online](https://www.gov.uk/guidance/what-maintained-schools-must-publish-online) (updated 24 Oct 2024).

| # | Item | Key detail |
|---|---|---|
| 1 | **Admission arrangements** | Foundation and voluntary-aided schools (their own admission authority): criteria, published admission number, appeals timetable. Community schools link to the local authority. |
| 2 | **Behaviour policy** | Complies with s.89 Education and Inspections Act 2006. |
| 3 | **Careers programme** (secondary) | Programme details, careers leader contact, provider access policy statement. |
| 4 | **Charging and remissions policy** | Which activities are charged for, and when charges are waived. |
| 5 | **Complaints procedure** | Under s.29 Education Act 2002. |
| 6 | **Contact details** | Postal address, phone number, and the name of the staff member who handles queries. |
| 7 | **Curriculum** | Content for each subject by year. The right to withdraw from RE (and RSE where applicable). **Accessibility plan** for disabled pupils. |
| 8 | **Financial information** | Staff paid over £100,000, in £10,000 bands. A link to the DfE schools financial benchmarking page. |
| 9 | **Governance** | Structure and responsibilities of the governing body and committees, plus governor details. |
| 10 | **Ofsted reports** | The latest report, or a link to it. |
| 11 | **Gender pay gap** | 250+ employees only: report to the government service and link from the website. |
| 12 | **PE and sport premium** (primary) | Amount, spending, impact, and % of Year 6 who meet the swimming standards. |
| 13 | **Public sector equality duty** | Compliance published annually. Equality objectives set at least every 4 years. |
| 14 | **Pupil premium** | Strategy statement on the DfE template by **31 December**. |
| 15 | **SEND information report** | Updated annually. |
| 16 | **Test, exam and assessment results** | A link to the Compare school performance service, plus KS2 (primary), KS4 including Progress 8 (secondary) and 16–18 measures. |

**"Should" publish** (same source): ethos and values statement · **school opening hours** (start and end of the compulsory day and the weekly total) · remote education provision · **uniform policy** with cost and second-hand information · governor diversity data and attendance records.

### 5.2 Academies, free schools and colleges
Source: [DfE, What academies, free schools and colleges should publish online](https://www.gov.uk/guidance/what-academies-free-schools-and-colleges-should-publish-online) (updated 24 Oct 2024). The duties come from the **funding agreement**, not statute directly, so the page says "must" for some items and "should" for others.
- **Must:**
  - admission arrangements (by **15 March**)
  - **annual report and accounts** (trust, by **31 January**)
  - careers provider access statement
  - complaints procedure
  - curriculum including the RSE policy
  - **executive pay** over £100k in £10k bands
  - **governance**: memorandum and articles, members and trustees, their interests, **funding agreement**
  - PSED
  - pupil premium
  - SEND information report
- **Should:** behaviour policy (with anti-bullying), careers information, charging policy, contact details including leadership names, curriculum, ethos, Ofsted, PE premium (primary), remote education, opening hours, uniform, results link.
- **Educo:** a school's type (maintained / academy / free school / independent) drives a **compliance checklist**. A multi-academy trust usually needs a trust-level governance page and each academy links to it (as Preston Primary links its Lingfield trust annual accounts).

### 5.3 The publishing calendar
From [Greenhouse School Websites, compliance calendar 2026/27](https://www.greenhouseschoolwebsites.co.uk/blog/index.php/2026/08/the-school-website-compliance-calendar-key-dates-for-2026-27/), consistent with the DfE dates above:
- September: reset term dates, staff and governors.
- 31 August: in-year admissions.
- Autumn: SEND report and equality information.
- 31 December: pupil premium.
- 31 January: academy accounts.
- 28 February: appeals timetable.
- 15 March: admission arrangements.
- 31 July: PE premium.

**Educo:** each statutory page stores a "last reviewed" date and a due date, and the dashboard flags pages that are stale.

### 5.4 Accessibility statement
- **Law:** [The Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018](https://www.legislation.gov.uk/uksi/2018/952/contents). Guidance: [GOV.UK, Accessibility requirements for public sector websites and apps](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps). The standard is **WCAG 2.2 AA**.
- **Schools are partly exempt.** The exemption covers "primary and secondary schools or nurseries — **except for the content people need in order to use their services**, for example a form that lets you outline school meal preferences." (same page). In practice any form, booking, payment, absence or admissions flow is in scope. Publishing a statement is best practice either way, and several sampled schools do it (for example Camp Hill links one from the footer).
- **Other duties:** disproportionate-burden claims must be assessed and cannot rest on lack of time. GDS monitors compliance. The **EHRC** enforces in Great Britain and the **ECNI** in Northern Ireland.
- **Required structure**, from the [GOV.UK sample statement](https://www.gov.uk/government/publications/sample-accessibility-statement/sample-accessibility-statement-for-a-fictional-public-sector-website):
  1. **Accessibility statement for [site]**: who runs it, what users can do (zoom to 400%, keyboard, screen reader, and so on), and known limitations.
  2. How to get content in an **accessible format**: contact details and response time.
  3. **Reporting problems** with the site.
  4. **Enforcement procedure**: the legally worded EHRC (or ECNI) paragraph.
  5. **Technical information**, with a compliance status of **fully / partially / not compliant** with WCAG 2.2 AA.
  6. **Non-accessible content**, under three sub-headings: *Non-compliance with the accessibility regulations* (each failure mapped to a WCAG success criterion) · *Disproportionate burden* · *Content not within scope* (for example pre-2018 PDFs, live video, maps).
  7. **What we're doing to improve accessibility.**
  8. **Preparation of this statement**: date first published, date last reviewed, date tested and how.
- **Educo:** ship an accessibility-statement page template with these headings. Pre-fill the technical section with what the builder guarantees (landmarks, skip link, contrast tokens, focus styles). Leave clearly marked fields for the school's own PDFs and forms. Link it from every footer legal bar by default.

### 5.5 Pages and sections a school site typically has
Synthesised from six real UK schools:
- Dunraven, all-through, London ([dunraven.org.uk](https://www.dunraven.org.uk/))
- Brampton Manor Academy, 11–18 ([bramptonmanor.org](https://www.bramptonmanor.org/))
- King Edward VI Camp Hill Boys, grammar ([camphillboys.bham.sch.uk](https://www.camphillboys.bham.sch.uk/))
- Eton College, independent ([etoncollege.com](https://www.etoncollege.com/))
- Preston Primary, trust academy ([prestonprimary.co.uk](https://www.prestonprimary.co.uk/))
- Oughtrington Primary ([oughtringtoncps.co.uk](https://www.oughtringtoncps.co.uk/))

Also drawn from [School Webmasters, 13 ways](https://www.schoolwebmasters.com/13-ways-to-create-an-effective-school-website-from-a-parents-perspective), [Finalsite](https://www.finalsite.com/blog/p/~board/b/post/school-website-navigation-strategies) and [Campus Suite](https://www.campussuite.com/blog/4-steps-school-website-accessibility-infographic).

**Observed top-level navs** (the labels are the schools' own):
- **Dunraven:** About Us · Key Info · Our School · Curriculum · Admissions · News & Events · Join Us · Contact
- **Brampton Manor:** Home · About Us · Information · Parents · Year 7 Entry · 6th Form · Policies · Vacancies · The Trust · Contact
- **Camp Hill:** Home · Our School · Safeguarding · Admissions · Curriculum · Sixth Form · Parents & Pupils · Pastoral · Contact Us
- **Preston Primary:** About Us · Remote Education · SEND · School · Funding · Parents · Statutory Info · Contact

**Patterns across the six:**
1. **Most sites have a statutory bucket** under a name like "Key Info", "Statutory Information", "Information" or "Policies". This matches the 5.1 list well, and governors can audit it easily.
2. **Safeguarding is often top-level** (Camp Hill, Oughtrington), with the Designated Safeguarding Lead named.
3. **Audience groups:** "Parents" (Brampton, Preston, Oughtrington), "Parents & Pupils" (Camp Hill), and Parent Area / Student Area link groups (Dunraven). Finalsite recommends audience sections of this kind ([Finalsite](https://www.finalsite.com/blog/p/~board/b/post/school-website-navigation-strategies)).
4. **Portal quick links** always sit in the header or footer: Arbor, Edulink, School Gateway, ParentPay, Google Classroom, parents' evening booking.
5. **Phase entry points:** Year 7 Entry, Sixth Form, and Reception tours on primaries.
6. **Trust link** for academies. **Vacancies / Join us** on every site.
7. Primaries add **Classes** (one page per year group), **PTA**, **Wraparound care**, **School dinners/menus** and **Wellbeing**.
8. The pages parents use most, per SchoolWebmasters and Campus Suite: **About, news, calendar (with sync), staff directory, contact, admissions, and a parent quick-links area**.

**Page types the builder needs as templates:**

| Page type | Sections |
|---|---|
| Home | Hero with name and ethos · quick links (Term dates, Calendar, Parent portal, Payments, Report absence) · latest news · upcoming events · Head's welcome teaser · admissions CTA ("Book a visit") · Ofsted/award badges · map and contact |
| Head's welcome / About | Welcome letter with photo · vision, ethos and values · history · British values |
| Staff / Leadership | Directory grid (photo, name, role, contact), filterable by department · SLT · DSL, SENCO and DPO highlighted |
| Governance | Governor list (role, term, appointed by, interests) · committees · attendance · trust links |
| Admissions | Arrangements (PAN, criteria) · how to apply · open days · in-year admissions · appeals timetable · prospectus download |
| Term dates / Calendar | Term dates table (with INSET days) · event calendar with ICS/Google/Outlook sync · list and month views · filters |
| Curriculum | Intent, implementation and impact · subject pages · year-group overviews · RE/RSE withdrawal · accessibility plan · remote education |
| SEND | SEND information report (long page, sticky TOC) · SENCO contact · local offer link |
| Key information / Policies | Policy library (title, category, review date, PDF, filterable) · statutory checklist index |
| Ofsted & results | Latest report link and grade summary · results tables · Compare school performance link |
| Funding | Pupil premium strategy · PE and sport premium · catch-up · financial benchmarking link · pay bands |
| Safeguarding | DSL and deputies with photos · how to raise a concern · Operation Encompass, online safety, early help |
| News | Article listing (cards, pagination, category filter) · article page (date, author, images, share) · newsletter archive |
| Events | Listing and event page (date, time, location, add to calendar) |
| Parents | Quick links to portals · uniform (with costs and second-hand) · school day and opening hours · dinners/menus · attendance and absence reporting · forms · PTA |
| Sixth Form (secondary) | Courses · entry requirements · apply · results · destinations |
| Vacancies | Job listings · safer recruitment statement · application pack |
| Contact | Address, phone, email, named contact (statutory) · map · office hours · enquiry form (in scope for accessibility) |
| Accessibility statement · Privacy notice · Cookies | Templates (5.4) |
| Gallery | Albums with alt text · consent note |

### 5.6 Recommended school site map (Educo default)
Seven top-level items keep within Finalsite's guidance of about 6 and no more than 8. Labels are family-language. Every statutory item is reachable **within two clicks** from both the header and the footer.

```
Home
├── About Us
│   ├── Welcome from the Head
│   ├── Vision, Ethos & Values           (should)
│   ├── Our Staff                         (+ DSL, SENCO highlighted)
│   ├── Governance                        (must)
│   ├── Our Trust                         (academies)
│   └── Vacancies
├── Admissions
│   ├── How to Apply / Admission Arrangements   (must)
│   ├── Open Days & Visits
│   ├── In-Year Admissions
│   ├── Appeals
│   └── Prospectus
├── Learning
│   ├── Curriculum (+ subject / year-group pages)   (must)
│   ├── SEND (Information Report, Accessibility Plan)  (must)
│   ├── Remote Education                  (should)
│   ├── Careers (secondary)               (must)
│   └── Sixth Form (secondary)
├── Parents
│   ├── Term Dates
│   ├── School Day & Opening Hours        (should)
│   ├── Uniform                           (should)
│   ├── Attendance & Reporting Absence
│   ├── Meals & Menus
│   ├── Wraparound Care / Clubs
│   ├── Forms & Letters
│   └── PTA
├── News & Events
│   ├── News
│   ├── Calendar
│   ├── Newsletters
│   └── Gallery
├── Key Information            (statutory hub, index page with a checklist)
│   ├── Ofsted & Performance (results + Compare link)   (must)
│   ├── Policies (behaviour, charging, complaints, …)   (must)
│   ├── Safeguarding
│   ├── Pupil Premium                    (must)
│   ├── PE & Sport Premium (primary)     (must)
│   ├── Equality Objectives              (must)
│   ├── Financial Information & Pay      (must)
│   └── Gender Pay Gap (250+ staff)      (must)
└── Contact                     (address, phone, named contact: must)

Utility bar:   Search · Translate · Parent Portal · Payments · Phone
Footer legal:  Accessibility Statement · Privacy Notice · Cookies · Sitemap
```

**Educo: region defaults for a school template.**
- **Header:** multi-row with a utility bar (1.3), made sticky with the compact row only (1.5).
- **Nav:** dropdown (2.2), or a mega menu (2.3) once a section has more than 10 children. It becomes a drawer with an accordion (2.4) at the phone rung.
- **Inner pages:** side nav (2.7) and breadcrumb (2.9).
- **Long statutory pages:** sticky TOC (4.2).
- **Footer:** multi-column with a legal bar (3.2 + 3.5), never collapsed.
- **Phone app section:** bottom tab bar (2.6).
