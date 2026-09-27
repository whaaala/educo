# Web anatomy: the component catalogue

Every UI component and interaction pattern a website can contain, written as a reference for the Educo
website builder. Each entry gives: **aliases** across design systems, **purpose**, **anatomy** (its parts),
**variants**, **keyboard + ARIA** (from the W3C APG where a pattern exists), **phone** behaviour, and its
**kind**: `layout` (a region or container other blocks sit in), `content` (static, read-only) or `widget`
(interactive, holds state).

Compiled 2026-09-27. Sources, abbreviated in the final table:

| Key | Source | URL |
|---|---|---|
| **APG** | W3C WAI-ARIA Authoring Practices Guide, patterns index (all 30 pattern pages read) | https://www.w3.org/WAI/ARIA/apg/patterns/ |
| **OUI** | Open UI component matrix (naming across 30+ design systems) | https://open-ui.org/research/component-matrix/ |
| **GOV** | GOV.UK Design System, components and patterns | https://design-system.service.gov.uk/components/ · https://design-system.service.gov.uk/patterns/ |
| **M3** | Material Design 3 components | https://m3.material.io/components |
| **CDS** | IBM Carbon Design System components | https://carbondesignsystem.com/components/overview/components/ |

APG pattern pages follow `https://www.w3.org/WAI/ARIA/apg/patterns/<slug>/`; the slug is given as
`APG: slug`. GOV.UK pages follow `https://design-system.service.gov.uk/components/<slug>/`.

**Source notes.** M3's site is rendered client-side and did not yield a readable index; its component names
were cross-checked against the Material Web repo (https://github.com/material-components/material-web/tree/main/docs/components)
and the M3 navigation as known. Carbon's names come from its React package
(https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components). APG marks
**Tooltip** as work in progress without task-force consensus. APG also warns that **menu / menubar roles
are for application menus**, not site navigation: a website's nav is a list of links in `<nav>`, and a
dropdown nav is the **Disclosure** pattern.

## Contents

1. [Page regions](#1-page-regions) · 2. [Navigation](#2-navigation) · 3. [Content](#3-content) ·
4. [Input](#4-input) · 5. [Feedback and overlay](#5-feedback-and-overlay) · 6. [Media](#6-media) ·
7. [Data](#7-data) · 8. [Composite site sections](#8-composite-site-sections) ·
9. [Source matrix](#9-source-matrix)

## Cross-cutting rules (apply to every entry)

- **Native element first.** `<button>`, `<a href>`, `<input type=checkbox>`, `<details>`, `<dialog>`,
  `<select>`, `<table>`, `<meter>`, `<progress>` carry their role, focus and keys for free. ARIA roles are
  for when no native element fits (APG Link and Button pages both say so).
- **One tab stop per composite widget.** Tabs, radio group, listbox, menu, toolbar, tree, grid: Tab enters
  and leaves; arrow keys move inside (roving `tabindex` or `aria-activedescendant`).
- **Escape closes** anything that popped up (menu, listbox popup, dialog, tooltip, popover) and returns
  focus to what opened it.
- **Landmarks** (APG: landmarks): `banner`=`<header>`, `navigation`=`<nav>`, `main`=`<main>`,
  `complementary`=`<aside>`, `contentinfo`=`<footer>`, `search`=`<search>`, `form`=named `<form>`,
  `region`=named `<section>`. One `banner`, one `main`, one `contentinfo` per page; any repeated landmark
  needs a unique label; seven or fewer landmarks is the guidance; all content should sit inside one.
- **Minor primitives** not given their own entry: **window splitter** (APG: windowsplitter; focusable
  `role="separator"` with `aria-valuenow`, arrows move it, Enter collapses, F6 cycles panes; stacks on
  phones), **divider** (`<hr>`, 1px hairline; decorative shapes `aria-hidden`), **avatar** (see Team),
  **audio** (as Video, plus transcript), **charts** (`role="img"` summary + a data table).
- **Phone:** touch targets at least 44×44 CSS px (WCAG 2.5.5 AAA / 24px AA 2.5.8), no hover-only
  disclosure, and anything wider than the viewport either stacks, scrolls inside its own box, or collapses.

---

## 1. Page regions

### Skip link
- **Aliases:** skip to content, skip navigation (GOV: skip-link).
- **Purpose:** first focusable element; jumps keyboard users past the header to `<main>`.
- **Anatomy:** visually hidden link that appears on focus; target `id` on `<main>` (`tabindex="-1"`).
- **Keys/ARIA:** Tab reveals, Enter jumps. Plain `<a href="#main">`.
- **Phone:** unchanged. **Kind:** widget (tiny). Educo: should be emitted automatically by every export.

### Header / site header / app bar
- **Aliases:** masthead, banner, top app bar (M3), UI shell header (CDS), GOV.UK header, generic header.
- **Purpose:** identity + primary navigation + utilities on every page.
- **Anatomy:** logo/wordmark (links home), site name, primary nav, utility links (login, language,
  search trigger, CTA button), optional announcement bar above it.
- **Variants:** static · sticky · shrink-on-scroll · transparent-over-hero · centred logo · split nav ·
  M3 small / medium / large / center-aligned top app bar.
- **Keys/ARIA:** `<header>` = `banner` landmark (one per page, top-level).
- **Phone:** nav collapses into a menu button (hamburger) opening a drawer or full-screen sheet; CTA may
  stay visible. **Kind:** layout.

### Announcement bar / phase banner
- **Aliases:** notification bar, top banner, site-wide alert, phase banner (GOV), Guidebanner (CDS).
- **Purpose:** one-line site-wide message (closure, admissions open, beta).
- **Anatomy:** tag/icon, message, optional link, optional dismiss button.
- **Variants:** info · warning · urgent; dismissible or not; scrolling ticker (avoid; WCAG 2.2.2).
- **Keys/ARIA:** static text; if injected live use `role="status"`; dismiss is a button with a label.
- **Phone:** wraps to two lines; keep it short. **Kind:** content.

### Hero
- **Aliases:** banner, jumbotron, masthead, splash, above-the-fold, page header (CDS PageHeader), panel (GOV,
  for confirmation).
- **Purpose:** the first screen: headline, promise, primary action.
- **Anatomy:** background (image / video / colour / gradient), overlay scrim, eyebrow, H1, lede, CTA
  button(s), optional media beside, optional scroll cue.
- **Variants:** full-bleed image · split (text + image) · video background · carousel hero (avoid) ·
  centred · minimal text-only · with search box (school sites: "find a course").
- **Keys/ARIA:** content; one H1 per page; background video needs a pause control (WCAG 2.2.2); text over a
  photo needs asserted contrast.
- **Phone:** split stacks (image above or below); height becomes content-driven, not `100vh`; type steps
  down via `clamp()`. **Kind:** layout (a section with content inside).

### Section / band
- **Aliases:** strip, block, region, container, stripe.
- **Purpose:** full-width horizontal band that groups related content; the unit of a landing page.
- **Anatomy:** background layer, inner max-width container, optional heading + intro, content grid.
- **Variants:** contained · full-bleed · alternating tone · diagonal/curved divider · sticky.
- **Keys/ARIA:** `<section>` with a heading; named sections become `region` landmarks (use sparingly).
- **Phone:** padding shrinks; inner grid stacks. **Kind:** layout.

### Sidebar / aside
- **Aliases:** complementary, rail, side panel.
- **Purpose:** secondary content beside the main column (related links, contact box, sub-nav).
- **Anatomy:** column container, stacked widgets.
- **Keys/ARIA:** `<aside>` = `complementary` landmark, labelled if more than one.
- **Phone:** moves below main content (or above, if it is sub-navigation). **Kind:** layout.

### Footer
- **Aliases:** site footer, contentinfo, GOV.UK footer, fat footer, mega footer.
- **Purpose:** closing navigation, legal, contact, trust signals.
- **Anatomy:** link columns (headed), contact block / address, social links, newsletter form, logos /
  accreditations, legal row (copyright, privacy, cookies, accessibility statement), back-to-top.
- **Variants:** minimal single row · fat multi-column · CTA band above footer · map in footer.
- **Keys/ARIA:** `<footer>` = `contentinfo` (one per page); link groups may be `<nav aria-label>`.
- **Phone:** columns stack or become accordions. **Kind:** layout.

---

## 2. Navigation

### Top navigation (primary nav)
- **Aliases:** navbar, main menu, service navigation (GOV), header nav (CDS), menubar (wrongly).
- **Purpose:** the site's first-level destinations.
- **Anatomy:** `<nav>` > list of links; current page marked; optional dropdown triggers.
- **Variants:** links only · with dropdowns · mega menu · pill / underline active style · centred.
- **Keys/ARIA:** list of links in `<nav aria-label="Main">`; current link `aria-current="page"`.
  Dropdowns use the **Disclosure** pattern (button with `aria-expanded`), not `role="menu"` (APG menubar
  note, and APG disclosure lists navigation menus as an example use).
- **Phone:** collapses behind a menu button into a drawer / full-screen overlay / bottom nav.
  **Kind:** widget inside a layout region.

### Dropdown navigation / mega menu
- **Aliases:** flyout, submenu, mega nav, disclosure navigation.
- **Purpose:** exposes second-level pages; a mega menu shows many grouped links, images, a promo.
- **Anatomy:** trigger button (label + chevron), panel, column groups with headings, optional feature card.
- **Variants:** hover + click · click-only (better on touch) · full-width mega panel · nested flyouts.
- **Keys/ARIA:** trigger `<button aria-expanded aria-controls>`; Enter/Space toggles; Escape closes and
  returns focus; Tab moves through links naturally. Never open on hover alone.
- **Phone:** becomes nested accordions inside the drawer. **Kind:** widget.

### Side navigation
- **Aliases:** sidenav, section nav, local nav, left panel (CDS UI shell), navigation drawer / rail (M3),
  sub-navigation, table of contents.
- **Purpose:** in-section navigation; long docs; admin areas.
- **Anatomy:** section heading, nested link list, active indicator, expand/collapse toggles for groups.
- **Variants:** static · sticky · collapsible groups · rail (icons only) · on-page TOC with scroll-spy.
- **Keys/ARIA:** `<nav aria-label>`; groups via Disclosure; if a true hierarchy with arrow-key nav is
  wanted, **Tree view** (rarely necessary).
- **Phone:** becomes a "In this section" disclosure or select at the top of content. **Kind:** widget.

### Bottom navigation
- **Aliases:** tab bar, navigation bar (M3), bottom app bar.
- **Purpose:** 3 to 5 top destinations within thumb reach on phones.
- **Anatomy:** fixed bar, items (icon + label), active indicator, optional badge.
- **Keys/ARIA:** `<nav>` of links; `aria-current="page"`. Not `role="tablist"` unless it swaps panels.
- **Phone:** phone-only; on tablet becomes a navigation rail; hidden on desktop. **Kind:** widget.

### Off-canvas drawer (navigation drawer)
- **Aliases:** hamburger menu, side sheet (M3), sidebar menu, offcanvas (Bootstrap), panel (CDS).
- **Purpose:** holds navigation or filters off-screen until asked for.
- **Anatomy:** trigger button, scrim, sliding panel, close button, content.
- **Variants:** left · right · top · bottom sheet · full screen · modal vs standard (pushes content).
- **Keys/ARIA:** a modal drawer is a **Dialog** (focus trapped, Escape closes, focus returns to trigger);
  trigger has `aria-expanded`.
- **Phone:** often full width. **Kind:** widget (overlay).

### Breadcrumb
- **Aliases:** breadcrumbs (GOV, CDS), trail, back link (GOV: back-link is the one-step form).
- **Purpose:** shows where the page sits in the hierarchy.
- **Anatomy:** `<nav aria-label="Breadcrumb">` > ordered list of links > separators (CSS, not text) >
  current page.
- **Keys/ARIA (APG: breadcrumb):** no special keys; current item `aria-current="page"`.
- **Phone:** truncate middle items, or collapse to a single "Back to parent" link (GOV pattern). **Kind:** widget.

### Pagination
- **Aliases:** pager, page numbers, PaginationNav (CDS), GOV pagination; "load more" and infinite scroll
  are alternatives.
- **Purpose:** splits a long result set (news, events, gallery) into pages.
- **Anatomy:** previous / next links (with labels), page number links, ellipsis, current page, optional
  page-size select and "x to y of z" text.
- **Variants:** numbered · prev/next only (GOV "block" style for articles) · load more button · infinite.
- **Keys/ARIA:** `<nav aria-label="Pagination">`; current `aria-current="page"`; icon-only arrows need labels.
- **Phone:** show prev/next + current only. **Kind:** widget.

### Menu button, menu and menubar (application menus)
- **Aliases:** dropdown menu, overflow menu / kebab (CDS OverflowMenu), context menu, action menu.
- **Purpose:** a list of **actions** (not destinations): share, download, print, edit.
- **Anatomy:** trigger button with `aria-haspopup`, popup `menu`, `menuitem` / `menuitemcheckbox` /
  `menuitemradio`, separators, submenus.
- **Keys/ARIA (APG: menu-button, menubar):** Enter/Space/Down opens and focuses first item, Up opens on
  last; arrows move; Right/Left open/close submenus; Home/End; type-ahead; Escape closes and returns focus.
  Trigger `aria-expanded`, optional `aria-controls`.
- **Phone:** becomes a bottom sheet. **Kind:** widget.

### Tabs
- **Aliases:** tab bar, content switcher (CDS, for view switching), segmented tabs, pills.
- **Purpose:** layered panels, one visible at a time (e.g. Primary / Secondary / Sixth form).
- **Anatomy:** tablist, tabs, tab panels, active indicator.
- **Variants:** horizontal · vertical · pill · underline · with icons · scrollable · automatic vs manual
  activation.
- **Keys/ARIA (APG: tabs):** Tab into the list, arrows move between tabs, Home/End, Enter/Space activates
  in manual mode, optional Delete. `tablist` > `tab[aria-selected][aria-controls]` > `tabpanel[aria-labelledby]`;
  `aria-orientation="vertical"` when vertical.
- **Phone:** tabs scroll horizontally, or convert to an accordion (GOV tabs do this on small screens).
  **Kind:** widget.

### Link
- **Aliases:** hyperlink, text link, anchor.
- **Purpose:** navigation to a resource.
- **Anatomy:** text (or image with alt), optional icon (external, download), visited / hover / focus
  states.
- **Keys/ARIA (APG: link):** Enter activates; Shift+F10 context menu. Use `<a href>`; `role="link"` only
  when unavoidable. External/new-window links say so in text.
- **Phone:** tap target size. **Kind:** widget.

### Back to top
- **Aliases:** scroll to top, return to top.
- **Purpose:** returns to the page top on long pages.
- **Anatomy:** link to `#top` (fixed floating button or footer link), icon + visible or sr-only label.
- **Keys/ARIA:** `<a href="#top">`; must move focus, not only scroll; respects reduced motion.
- **Phone:** floating button, bottom-right, clear of the bottom nav. **Kind:** widget.

### Language switcher
- **Aliases:** language navigation (GOV), locale picker, language selector.
- **Purpose:** move to the same page in another language (Welsh, Arabic, Polish for school families).
- **Anatomy:** list of language names written in their own language, current marked; or a dropdown.
- **Keys/ARIA:** `<nav aria-label="Language">`; each link has `lang` and `hreflang`; current
  `aria-current="true"`. Avoid flags for languages.
- **Phone:** inside the drawer or a compact dropdown. **Kind:** widget.

### Toolbar
- **Aliases:** action bar, button toolbar, M3 toolbar.
- **Purpose:** groups three or more related controls (e.g. gallery view controls, text-size tools).
- **Keys/ARIA (APG: toolbar):** `role="toolbar"`, labelled; Tab enters/exits once; Left/Right (or
  Up/Down if vertical) move; Home/End optional.
- **Phone:** overflow into a "More" menu. **Kind:** widget.

### Step-by-step navigation
- **Aliases:** step by step (GOV pattern), process guide, how-to journey.
- **Purpose:** explains a multi-part real-world process (applying for a school place).
- **Anatomy:** numbered steps with headings, expandable detail per step, "and/or" connectors, show-all.
- **Keys/ARIA:** accordion/disclosure semantics per step.
- **Phone:** unchanged vertical. **Kind:** widget.

---

## 3. Content

### Heading, text and rich text
- **Aliases:** typography, body copy, prose, lede, eyebrow/overline, inset text (GOV), warning text (GOV).
- **Purpose:** the words.
- **Anatomy:** heading levels H1 to H6 (one H1), paragraphs, lists, quotes, inline emphasis, links.
- **Variants:** lede/intro · eyebrow · inset (bordered aside) · warning (icon + bold) · drop cap · columns.
- **Keys/ARIA:** real heading elements in order; no skipped levels for styling.
- **Phone:** measure 45 to 75 characters; type scales with `clamp()`. **Kind:** content.

### List
- **Aliases:** bulleted/numbered list, contained list (CDS), structured list (CDS), M3 lists, summary list
  (GOV, key/value), description list, task list (GOV).
- **Purpose:** sequences, sets, key/value facts.
- **Anatomy:** list container, items; rich list items carry leading icon/avatar, title, supporting text,
  trailing meta/action.
- **Variants:** bullet · number · icon list (tick list) · description `<dl>` · summary list with "Change"
  actions · task list with status tags.
- **Keys/ARIA:** native `<ul>/<ol>/<dl>`; do not strip list semantics with `list-style:none` in Safari
  without `role="list"`.
- **Phone:** multi-column lists collapse to one. **Kind:** content.

### Card
- **Aliases:** tile (CDS), document card, teaser, panel, media object.
- **Purpose:** a summary of one thing linking to more (news item, club, course, staff member).
- **Anatomy:** container, media (image), eyebrow/category, title, body excerpt, meta (date, author),
  actions (link / buttons), optional badge.
- **Variants:** vertical · horizontal · overlay (text on image) · elevated / filled / outlined (M3) ·
  clickable tile · selectable tile (CDS) · expandable tile.
- **Keys/ARIA:** whole-card link via one real link stretched with a pseudo-element, not nested links; card
  lists are `<ul>` of `<li>`/`<article>`.
- **Phone:** grid of cards reflows (auto-fit) to one column; horizontal cards stack. **Kind:** content.

### Accordion
- **Aliases:** collapse (Ant), collapsible (Lion), expansion panel, GOV accordion, CDS Accordion.
- **Purpose:** stacked headings that expand to reveal sections; condenses long pages.
- **Anatomy:** header (heading > button with chevron), panel, optional "Show all sections".
- **Variants:** single-open vs multi-open · bordered · flush · with icons · nested.
- **Keys/ARIA (APG: accordion):** Enter/Space toggles; Tab/Shift+Tab. Button inside `role="heading"`
  (`aria-level`), `aria-expanded`, `aria-controls`; panel optionally `role="region"` labelled by the button;
  `aria-disabled` if a panel cannot collapse.
- **Phone:** the default way to fold content on phones. **Kind:** widget.

### Disclosure (show / hide)
- **Aliases:** details (GOV), expander, read more, toggle section, CDS Disclosure.
- **Purpose:** one button revealing one block (help text, transcript, image description).
- **Anatomy:** button with state indicator (triangle right/down), content.
- **Keys/ARIA (APG: disclosure):** Enter/Space toggles; `aria-expanded`, optional `aria-controls`. Native
  `<details><summary>` gives this for free.
- **Phone:** unchanged. **Kind:** widget.

### FAQ
- **Aliases:** questions and answers, help centre.
- **Purpose:** answers common questions (admissions, uniform, term dates).
- **Anatomy:** heading, optional search/filter, groups by topic, question/answer items (accordion or
  disclosures), "still need help" contact link.
- **Keys/ARIA:** accordion or disclosure semantics; questions are headings; optional FAQPage JSON-LD.
- **Phone:** accordion. **Kind:** widget (composite of accordion).

### Badge, tag and chip
- **Aliases:** lozenge (Atlaskit), pill (Evergreen), label, status tag (GOV tag), BadgeIndicator (CDS),
  chips: assist / filter / input / suggestion (M3).
- **Purpose:** badge = count or status dot on something; tag = category/status label; chip = compact
  interactive token (filter, selected value).
- **Anatomy:** container, text, optional icon, optional remove button (chip), optional count.
- **Variants:** colour per status (never colour alone) · outlined/filled · dismissible · selectable.
- **Keys/ARIA:** static tag is text; a selectable chip is a toggle button (`aria-pressed`) or checkbox;
  remove button has "Remove {label}". Badge count exposed in the parent's label.
- **Phone:** chips scroll horizontally in a row. **Kind:** content (tag, badge) / widget (chip).

### Testimonial / quote
- **Aliases:** blockquote, pull quote, review, endorsement.
- **Purpose:** social proof: parent, pupil, inspector quotes.
- **Anatomy:** quotation mark glyph (decorative), quote text, attribution (name, role), avatar, optional
  rating, optional source logo.
- **Variants:** single large pull quote · grid of cards · carousel · with video.
- **Keys/ARIA:** `<figure><blockquote>` + `<figcaption>`; decorative glyph `aria-hidden`.
- **Phone:** stack; carousel becomes swipe. **Kind:** content.

### Stat / metric
- **Aliases:** big number (CDS BigNumber), KPI, counter, figure, fact strip.
- **Purpose:** headline numbers ("98% pass rate", "1,200 pupils").
- **Anatomy:** value, unit, label, optional trend/icon, optional source footnote.
- **Variants:** row of stats · animated count-up (respect reduced motion) · with sparkline.
- **Keys/ARIA:** plain text in reading order (value then label, or a `<dl>`); animation must not change the
  announced value. **Phone:** 2-up grid then 1-up. **Kind:** content.

### Timeline
- **Aliases:** history, milestones, activity feed, roadmap.
- **Purpose:** events in time order (school history, term plan).
- **Anatomy:** axis line, markers, date, title, body, optional media.
- **Variants:** vertical · alternating left/right · horizontal scroller.
- **Keys/ARIA:** ordered list (`<ol>`) with `<time>`; line and dots decorative.
- **Phone:** alternating layout collapses to a single left-aligned column. **Kind:** content.

### Team / profile
- **Aliases:** staff directory, people grid, avatar (CDS UserAvatar), persona (Fabric), bio card.
- **Purpose:** introduce staff/governors.
- **Anatomy:** photo/avatar (initials fallback), name, role, short bio, contact/social links, optional
  "read more" dialog.
- **Variants:** grid of cards · list · filterable directory · leadership feature.
- **Keys/ARIA:** avatar alt is the name or empty if the name is adjacent; a bio dialog follows Dialog.
- **Phone:** 2-up then 1-up. **Kind:** content.

### Logo cloud
- **Aliases:** partners, accreditations, trust badges, sponsor strip.
- **Anatomy:** row/grid of logos, optional heading, optional links.
- **Keys/ARIA:** each logo `alt` = organisation name; marquee animation must be pausable.
- **Phone:** wrap to grid. **Kind:** content.

---

## 4. Input

### Button
- **Aliases:** action button (Spectrum), CTA, filled / tonal / outlined / text / elevated (M3), primary /
  secondary / tertiary / ghost / danger (CDS), GOV start button, icon button, FAB.
- **Purpose:** performs an action (links navigate; buttons act).
- **Anatomy:** container, label, optional leading/trailing icon, focus ring, loading state.
- **Variants:** hierarchy (primary to text) · size · icon-only · toggle button (`aria-pressed`) · FAB /
  extended FAB · start button with arrow.
- **Keys/ARIA (APG: button):** Space/Enter activates; `aria-disabled`, `aria-pressed` for toggles,
  `aria-haspopup` for menu buttons; label ends with "…" if it opens a dialog; focus moves per action.
- **Phone:** full-width primary buttons are common; 44px targets. **Kind:** widget.

### Button group, split button, segmented control
- **Aliases:** ButtonSet (CDS), button groups (M3), split button (M3), ComboButton (CDS), segmented buttons
  (M3), content switcher (CDS), toggle group.
- **Purpose:** related actions together; split button = default action + menu of alternatives; segmented
  control = pick one view/option from 2 to 5.
- **Anatomy:** group container, buttons; split: main button + divider + menu button; segmented: segments
  with selected state.
- **Keys/ARIA:** group `role="group"` labelled; split = Button + Menu button; segmented control is a radio
  group (arrow keys, `aria-checked`) or toolbar of toggle buttons (`aria-pressed`).
- **Phone:** stack vertically or full-width segments. **Kind:** widget.

### Text input and textarea
- **Aliases:** text field (M3), TextInput / TextArea (CDS), form control, character count (GOV),
  password input (GOV, CDS) with show/hide.
- **Anatomy:** label, hint, input, prefix/suffix, error message, character count, show-password toggle.
- **Variants:** filled / outlined (M3) · fluid (CDS) · with character count · password with reveal.
- **Keys/ARIA:** visible `<label for>`; hint and error linked by `aria-describedby`; `aria-invalid` on
  error; `autocomplete` tokens; correct `type`/`inputmode`.
- **Phone:** 16px+ text avoids iOS zoom; `inputmode` picks the right keyboard. **Kind:** widget.

### Select
- **Aliases:** dropdown (CDS Dropdown, Fabric), picklist (Lightning), select menu.
- **Anatomy:** label, trigger showing value, chevron, option list.
- **Keys/ARIA:** native `<select>` preferred; a custom one is a **Combobox** (select-only) with a
  **Listbox** popup.
- **Phone:** native select opens the OS picker, which is the best phone UI. **Kind:** widget.

### Combobox / autocomplete
- **Aliases:** autocomplete (Evergreen), ComboBox (CDS), typeahead, autosuggest, MultiSelect (CDS).
- **Purpose:** type to filter a large option set (courses, subjects, postcodes).
- **Anatomy:** input, popup (listbox / grid / tree / dialog), options, clear button, selected chips (multi).
- **Variants (APG: combobox):** autocomplete none / list / list with automatic selection / inline;
  select-only; editable.
- **Keys/ARIA:** Down opens or moves in, Alt+Down opens without moving, Up, Enter accepts, Escape closes (then
  clears), printable characters type. `role="combobox"`, `aria-expanded`, `aria-controls`,
  `aria-activedescendant`, `aria-autocomplete`, `aria-haspopup` (listbox default); options `aria-selected`.
  Announce result counts via a live region.
- **Phone:** popup can become a full-screen search sheet. **Kind:** widget.

### Listbox
- **Aliases:** list box (CDS ListBox), options list, picker list.
- **Anatomy:** labelled container, options, optional groups.
- **Keys/ARIA (APG: listbox):** Up/Down, Home/End, type-ahead; multi-select: Space toggles, Shift+arrows
  extend, Ctrl+A all. `role="listbox"` > `option[aria-selected]`; `aria-multiselectable`;
  `aria-setsize/posinset` when virtualised.
- **Phone:** prefer checkboxes or native select. **Kind:** widget.

### Checkbox
- **Aliases:** check, checkboxes (GOV), InlineCheckbox / CheckboxGroup (CDS).
- **Anatomy:** box, check mark / mixed dash, label, hint; group fieldset + legend.
- **Variants:** single · group · tri-state "select all" · large touch (GOV) · conditional reveal.
- **Keys/ARIA (APG: checkbox):** Space toggles. `role="checkbox"`, `aria-checked` true/false/**mixed**;
  groups `role="group"` labelled (or `<fieldset><legend>`).
- **Phone:** the whole label row is the tap target. **Kind:** widget.

### Radio group
- **Aliases:** radios (GOV), RadioButton / RadioButtonGroup (CDS), option buttons.
- **Anatomy:** fieldset + legend, radios, labels, hints, optional conditional reveal.
- **Keys/ARIA (APG: radio):** Tab enters on the checked (or first) radio; arrows move **and select**, with
  wrap; Space checks. `radiogroup` labelled; `radio[aria-checked]`; roving tabindex.
- **Phone:** stacked rows, large targets. **Kind:** widget.

### Switch / toggle
- **Aliases:** toggle (CDS Toggle), checkbox toggle, on/off switch.
- **Purpose:** immediate on/off setting (not a form answer).
- **Anatomy:** track, thumb, label, optional on/off text and icon.
- **Keys/ARIA (APG: switch):** Space toggles (Enter optional). `role="switch"`, `aria-checked`; never
  mixed. Group with `role="group"`/`<fieldset>`.
- **Phone:** unchanged. **Kind:** widget.

### Slider (range) and multi-thumb slider
- **Aliases:** range, range slider, price range.
- **Anatomy:** track/rail, filled range, thumb(s), tick marks, value label, optional linked number input.
- **Keys/ARIA (APG: slider, slider-multithumb):** Right/Up +1 step, Left/Down −1, Home/End min/max,
  PageUp/PageDown large step. `role="slider"`, `aria-valuenow/min/max`, `aria-valuetext`,
  `aria-orientation`. Multi-thumb: each thumb in tab order; the lower thumb's `aria-valuemax` tracks the
  upper thumb's value, and vice versa.
- **Phone:** APG notes touch AT support is weak; pair with a number input. **Kind:** widget.

### Spinbutton / number input
- **Aliases:** NumberInput (CDS), stepper input, quantity picker.
- **Anatomy:** text field, increment/decrement buttons, unit.
- **Keys/ARIA (APG: spinbutton):** Up/Down step, Home/End bounds, PageUp/PageDown big step, text editing.
  `role="spinbutton"`, `aria-valuenow/min/max/text`, `aria-invalid` out of range.
- **Phone:** `inputmode="numeric"`; +/− buttons large. **Kind:** widget.

### Date input and date picker
- **Aliases:** date input (GOV, three fields), DatePicker (CDS), date pickers: docked / modal / modal input
  (M3), calendar picker; time picker (M3, CDS TimePicker).
- **Anatomy:** label, hint with example, input(s), calendar button, popup calendar grid (month/year nav,
  day grid, today, selected, disabled days), range selection.
- **Keys/ARIA:** memorable dates (birth dates) use three plain fields (GOV). A calendar popup is a
  **Dialog** containing a **Grid**: arrows move by day/week, PageUp/PageDown month, Shift+PageUp/Down year,
  Home/End week start/end, Enter selects, Escape closes.
- **Phone:** native `type="date"` or a modal full-screen calendar. **Kind:** widget.

### File upload
- **Aliases:** FileUploader (CDS), drop zone, attachment.
- **Anatomy:** label, hint (types, size), button/drop zone, file list with name/size/progress/remove,
  error per file.
- **Keys/ARIA:** native `<input type=file>` wrapped; drop zone is an enhancement, never the only way; status
  via live region.
- **Phone:** opens the camera/photo picker; drag-and-drop absent. **Kind:** widget.

### Search
- **Aliases:** search box, ExpandableSearch (CDS), search bar / search view (M3), site search.
- **Anatomy:** `<search>` landmark / `role="search"`, label (may be visually hidden), input `type=search`,
  submit button, clear button, suggestions (combobox), results page with count, filters, empty state.
- **Variants:** always-open · expandable icon · full-screen overlay · with scope filter.
- **Keys/ARIA:** `/` or Ctrl+K shortcut (announce it); suggestions follow Combobox.
- **Phone:** icon expands to full-width bar or full-screen sheet. **Kind:** widget.

### Rating
- **Aliases:** star rating, review score.
- **Anatomy:** display: stars + numeric value + count; input: set of star radios.
- **Keys/ARIA:** display = text ("4.5 out of 5, 120 reviews") with stars `aria-hidden`; input = **Radio
  group** (arrows select).
- **Phone:** larger stars. **Kind:** content (display) / widget (input).

### Fieldset and form layout
- **Aliases:** FormGroup (CDS), fieldset (GOV), form section, question page (GOV pattern).
- **Anatomy:** fieldset, legend (often the page H1 on one-question pages), fields, submit.
- **Keys/ARIA:** named `<form>` = `form` landmark. GOV patterns cover names, addresses, emails, phones,
  dates, passwords, check-answers and confirmation pages.
- **Phone:** one column always. **Kind:** layout (for inputs).

### Error message and error summary
- **Aliases:** validation, inline error, error summary (GOV), form requirement (CDS).
- **Anatomy:** summary box at top (heading "There is a problem" + links to each field) and inline message
  beside each field.
- **Keys/ARIA:** summary receives focus on submit (`role="alert"` or focus + `tabindex=-1`); inline linked
  by `aria-describedby`; `aria-invalid`. Prefix page title with "Error:" (GOV).
- **Phone:** unchanged. **Kind:** content (feedback).

---

## 5. Feedback and overlay

### Alert / notification banner
- **Aliases:** message (Ant), alert banner (Spectrum), notification banner (GOV), inline notification
  (CDS), callout, warning text (GOV).
- **Purpose:** important message in the page flow.
- **Anatomy:** icon, title, body, optional action link, optional close.
- **Variants:** info · success · warning · error; inline vs banner.
- **Keys/ARIA (APG: alert):** no keys, never moves focus; `role="alert"` only for urgent injected messages
  (`role="status"` for polite); must not auto-disappear.
- **Phone:** full width. **Kind:** content.

### Toast / snackbar
- **Aliases:** snackbar (M3), toast notification (CDS), flash message.
- **Purpose:** brief confirmation of an action ("Saved").
- **Anatomy:** message, optional single action ("Undo"), optional close, timer.
- **Keys/ARIA:** live region (`role="status"`); if it has an action, keep it long enough or until dismissed
  (WCAG 2.2.1); do not steal focus.
- **Phone:** bottom, full width above bottom nav. **Kind:** widget (transient).

### Dialog / modal
- **Aliases:** modal (CDS Modal, ComposedModal), dialog (M3 basic / full-screen), lightbox, popup window.
- **Purpose:** focused task or content that blocks the page.
- **Anatomy:** backdrop/scrim, container, title, body, actions (primary/secondary), close button.
- **Variants:** passive (info) · transactional · full-screen · non-modal.
- **Keys/ARIA (APG: dialog-modal):** Tab/Shift+Tab wrap inside; Escape closes; focus moves in on open and
  back to the trigger on close. `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (title),
  optional `aria-describedby`. Native `<dialog>.showModal()` provides inertness. Only mark modal when the
  outside really is inert.
- **Phone:** full-screen sheet. **Kind:** widget (overlay).

### Alert dialog
- **Aliases:** confirmation dialog, message dialog, danger modal (CDS).
- **Purpose:** interrupting confirmation ("Delete this event?").
- **Keys/ARIA (APG: alertdialog):** as Dialog; `role="alertdialog"`, `aria-describedby` points at the
  message; focus usually on the least destructive button. **Kind:** widget.

### Popover / toggletip
- **Aliases:** inline dialog (Atlaskit), callout (Fabric), popover (CDS), toggletip (CDS), coachmark (CDS),
  rich tooltip (M3).
- **Purpose:** click-triggered floating panel with richer or interactive content.
- **Anatomy:** trigger, arrow/caret, panel, content, optional close.
- **Keys/ARIA:** trigger button `aria-expanded`; Escape closes; non-modal dialog semantics if it holds
  controls. HTML `popover` attribute gives light-dismiss and top-layer.
- **Phone:** becomes a bottom sheet. **Kind:** widget (overlay).

### Tooltip
- **Aliases:** popup (Semantic UI), plain tooltip (M3), definition tooltip / icon tooltip (CDS).
- **Purpose:** short description of a control, on hover **and** focus.
- **Anatomy:** trigger, bubble, optional arrow.
- **Keys/ARIA (APG: tooltip, work in progress):** shows on focus/hover after a delay; Escape dismisses;
  focus stays on trigger. `role="tooltip"`, trigger `aria-describedby`. Hoverable and persistent (WCAG 1.4.13).
  Never put essential info or interactive content in one.
- **Phone:** no hover: use a toggletip or visible text. **Kind:** widget.

### Progress indicators: progress bar, spinner, skeleton
- **Aliases:** progress indicator, ProgressBar, loading / InlineLoading (CDS), circular / linear progress,
  loading indicator (M3), skeleton / SkeletonText / SkeletonPlaceholder (CDS), shimmer.
- **Purpose:** shows that something is loading or how far a task has got.
- **Anatomy:** bar: track + fill + label + value; spinner: animated ring + label; skeleton: grey shapes
  matching the final layout.
- **Keys/ARIA:** `role="progressbar"` (or `<progress>`) with `aria-valuenow/min/max`, or none when
  indeterminate; label it; set `aria-busy="true"` on the loading region; skeletons `aria-hidden` with a
  status message. Reduced motion stops shimmer.
- **Phone:** unchanged. **Kind:** content (feedback).

### Meter / gauge
- **Aliases:** gauge (CDS Unstable_Gauge), level, capacity bar.
- **Purpose:** a value within a known range, not progress (places left, fundraising target).
- **Keys/ARIA (APG: meter):** no keys; `role="meter"` or `<meter>`, `aria-valuenow/min/max`,
  `aria-valuetext`, labelled. **Kind:** content.

### Stepper / wizard / progress steps
- **Aliases:** ProgressIndicator (CDS), steps, multi-step form, task list (GOV, non-linear).
- **Purpose:** shows position in a multi-page task.
- **Anatomy:** step items (number/icon, label, status complete/current/upcoming/error), connectors, prev/
  next buttons, optional "Step 2 of 4" text.
- **Keys/ARIA:** list of steps; current `aria-current="step"`; status in text, not colour only; completed
  steps may be links. GOV prefers a question-per-page with a "Check your answers" page.
- **Phone:** collapse to "Step 2 of 4: Contact details". **Kind:** widget.

### Cookie banner / consent
- **Aliases:** cookie banner (GOV), consent manager, CMP, cookies page (GOV pattern).
- **Purpose:** ask consent for non-essential cookies.
- **Anatomy:** heading, short explanation, Accept / Reject buttons (equal weight), link to cookie settings
  page, confirmation message with "Hide".
- **Keys/ARIA:** a region at the top of the page (GOV places it before the skip link), not a modal that
  blocks the site; buttons; confirmation announced; `aria-label="Cookies on {site}"`.
- **Phone:** full width, buttons stacked. **Kind:** widget.

### Empty state, 404 and error pages
- **Aliases:** page not found, service unavailable, problem with the service (GOV patterns), FullPageError
  (CDS), no results.
- **Anatomy:** heading, plain-language explanation, next actions (search, home link, contact).
- **Kind:** content (a page template).

---

## 6. Media

### Image / figure
- **Aliases:** picture, media, figure, aspect ratio box (CDS AspectRatio).
- **Anatomy:** `<picture>`/`<img>` with `srcset`/`sizes`, width/height (no layout jump), alt, optional
  caption and credit, focal point.
- **Variants:** full-bleed · contained · rounded/shaped mask · with overlay text · decorative (`alt=""`).
- **Keys/ARIA:** meaningful `alt`; decorative `alt=""`; complex images link to a long description
  (disclosure).
- **Phone:** `max-width:100%`, `aspect-ratio`, art direction via `<picture>`. **Kind:** content.

### Gallery and lightbox
- **Aliases:** image grid, masonry, photo gallery, lightbox, media viewer.
- **Purpose:** browse many images (sports day, trips).
- **Anatomy:** grid of thumbnails (buttons or links), captions, filter chips; lightbox = modal dialog
  with large image, caption, counter "3 of 24", prev/next, close, optional thumbnails strip.
- **Variants:** uniform grid · masonry · justified rows · slider.
- **Keys/ARIA:** lightbox follows **Dialog**; Left/Right for prev/next inside it; Escape closes and returns
  focus to the thumbnail; announce position.
- **Phone:** 2-column grid; lightbox full-screen with swipe and pinch-zoom. **Kind:** widget.

### Carousel / slider
- **Aliases:** slideshow, flipper (FAST), M3 carousel (multi-browse, uncontained, hero, full-screen),
  rotator.
- **Purpose:** one or a few slides at a time from a set.
- **Anatomy (APG: carousel):** container, slides, rotation control (pause/play), previous/next controls,
  slide picker (dots or tabs).
- **Variants:** basic (buttons) · tabbed (dots are a tablist) · group (slides per view) · auto-rotating ·
  scroll-snap strip.
- **Keys/ARIA:** Tab through controls; rotation stops when any part gets focus or hover; rotation control
  first in tab order with a label that changes ("Stop/Start slide rotation", no `aria-pressed`). Container
  `region`/`group` with `aria-roledescription="carousel"` and a label; slides `group` (or `tabpanel`) with
  `aria-roledescription="slide"` and label "3 of 6"; slide wrapper `aria-live="polite"` when not rotating,
  `off` when rotating.
- **Phone:** swipe with scroll-snap; dots become a counter. **Kind:** widget.

### Video and embed
- **Aliases:** video player, media embed, iframe, oEmbed.
- **Anatomy:** poster, play button, controls (play/pause, seek, volume, captions, fullscreen), captions
  track, transcript link.
- **Variants:** inline · background (muted, looping, with pause) · modal player · lazy facade (click to
  load third party).
- **Keys/ARIA:** native `<video controls>` or accessible player; captions (WCAG 1.2.2); iframe `title`;
  no autoplay with sound.
- **Phone:** 16:9 `aspect-ratio` box, full-width; `playsinline`. **Kind:** widget.

### Map
- **Aliases:** location map, embedded map, find us.
- **Anatomy:** map canvas (iframe or JS), marker(s), info popup, address text, "Get directions" link.
- **Keys/ARIA:** iframe `title`; the address must also exist as text (map alone fails non-visual users);
  avoid scroll-hijack (two-finger to pan).
- **Phone:** static image + "Open in Maps" link is often better. **Kind:** widget.

### Icon
- **Aliases:** Icon (M3, CDS), glyph, pictogram.
- **Anatomy:** inline SVG, `currentColor`, sized in `em`.
- **Keys/ARIA:** decorative `aria-hidden="true"`; meaningful icons get a text label. **Kind:** content.

---

## 7. Data

### Table
- **Aliases:** data table (CDS DataTable), GOV table, structured list (CDS).
- **Purpose:** static tabular information (term dates, fees, timetable, results).
- **Anatomy:** caption, header row, row headers, body rows, optional footer/totals, sort buttons,
  numeric alignment.
- **Variants:** striped · compact · sortable · with row actions · expandable rows · sticky header ·
  selectable (CDS batch actions).
- **Keys/ARIA (APG: table):** no keys; `table/row/columnheader/rowheader/cell`; `<caption>` or
  `aria-labelledby`; sortable headers carry `aria-sort` and contain a button.
- **Phone:** scroll inside its own container (focusable, labelled), or reflow rows into stacked cards with
  labels. **Kind:** content.

### Data grid
- **Aliases:** grid (APG), spreadsheet, editable table, layout grid (APG).
- **Purpose:** interactive tabular data; or a layout grid of many widgets with one tab stop.
- **Keys/ARIA (APG: grid):** arrows between cells, Home/End row, Ctrl+Home/End grid, PageUp/Down,
  Enter/F2 edit, Escape exit edit, Ctrl+Space column, Shift+Space row. `grid/row/gridcell`,
  `aria-sort`, `aria-selected`, `aria-rowcount/colcount`.
- **Phone:** rarely appropriate; fall back to a list. **Kind:** widget.

### Tree view and treegrid
- **Aliases:** tree (CDS TreeView), file tree, hierarchical list, treegrid.
- **Purpose:** hierarchical items (file browser, curriculum map).
- **Anatomy:** root/parent/end nodes, expand indicators, groups, selection.
- **Keys/ARIA (APG: treeview, treegrid):** Up/Down move, Right opens/enters child, Left closes/goes to
  parent, Home/End, Enter activates, type-ahead, Space selects (multi). `tree` > `treeitem[aria-expanded]`
  > `group`; treegrid adds rows/cells.
- **Phone:** indented list with disclosure. **Kind:** widget.

### Feed
- **Aliases:** infinite scroll, news feed, activity stream (APG: feed).
- **Purpose:** content that loads more as you scroll.
- **Keys/ARIA:** PageDown/PageUp between articles, Ctrl+End after the feed, Ctrl+Home before it.
  `role="feed"` labelled; each `article` with `aria-labelledby`, `aria-posinset`, `aria-setsize` (−1 if
  unknown); `aria-busy` while loading. Always provide a way to reach the footer.
- **Kind:** widget.

### Calendar / events
- **Aliases:** event list, agenda, school calendar, term dates, what's on.
- **Purpose:** upcoming events and term dates.
- **Anatomy:** view switch (month / week / list), month grid, event chips, event detail (date, time,
  location, category tag, add-to-calendar link / ICS), filters by category, prev/next month.
- **Keys/ARIA:** list view as `<ol>` of `<article>` with `<time datetime>`; month view as a table (static)
  or Grid (interactive); Event JSON-LD.
- **Phone:** always list/agenda view; month grid shows dots only. **Kind:** widget (or content as a list).

### Countdown
- **Aliases:** timer, count down to event.
- **Anatomy:** days / hours / minutes / seconds units with labels, target date text, end state.
- **Keys/ARIA:** show the target date as text; do not announce every second (no live region on the
  ticking value; `aria-hidden` the ticker and give a static sr-only sentence).
- **Phone:** units shrink, stay on one line. **Kind:** content (live).

### Pricing table / fees
- **Aliases:** plans, tiers, comparison table, fee schedule.
- **Anatomy:** plan cards (name, price, period, description, feature list with ticks/crosses, CTA),
  highlighted "recommended" plan, billing toggle (monthly/annual), comparison table below.
- **Keys/ARIA:** ticks/crosses need text ("Included"); billing toggle is a Switch or segmented radio group;
  comparison is a real table.
- **Phone:** cards stack or become a swipe strip; comparison table scrolls or uses per-plan tabs. **Kind:** content.

---

## 8. Composite site sections

These are sections assembled from the components above; site builders list them as blocks.

### Newsletter / signup form
- **Anatomy:** heading, benefit line, email input (label), optional name/interests checkboxes, consent
  text, submit button, success and error states.
- **Keys/ARIA:** named `<form>`; `autocomplete="email"`; success via status region. **Phone:** input and
  button stack. **Kind:** widget.

### Contact form and contact block
- **Anatomy:** name, email, phone, subject select, message textarea, consent, submit, success page; beside
  it: address, phone, email, opening hours, map, department list (GOV "contact a department" pattern).
- **Keys/ARIA:** labels, error summary, `autocomplete` tokens; spam protection that is not an inaccessible
  CAPTCHA. **Phone:** single column; tap-to-call `tel:` links. **Kind:** widget + content.

### Social links and share
- **Anatomy:** row of icon links (follow) or share buttons (share this page), optional counts.
- **Keys/ARIA:** each icon has an accessible name ("School on Instagram"); share uses Web Share API on
  phones. **Kind:** content (follow) / widget (share).

### Call to action band
- **Aliases:** CTA, conversion strip, banner CTA.
- **Anatomy:** heading, sentence, one or two buttons, background. **Kind:** layout + content.

### Feature grid
- **Aliases:** features, benefits, services, "why choose us".
- **Anatomy:** section heading, grid of items (icon, title, text, link). **Phone:** auto-fit grid stacks.
  **Kind:** layout + content.

### Content listing (news / blog / posts)
- **Anatomy:** filter/tag chips, sort, card grid or list, pagination / load more, featured post.
- **Keys/ARIA:** results count announced when filters change. **Kind:** widget.

### Article / post page
- **Anatomy:** breadcrumb, title, meta (date, author, reading time), hero image, body, tags, share,
  related posts, prev/next article. **Kind:** layout template.

### Login / account
- **Aliases:** sign in, create account (GOV patterns), parent portal link.
- **Anatomy:** username/email, password with show/hide, remember me, forgot password, submit, SSO buttons.
- **Kind:** widget.

### Feedback / page rating
- **Aliases:** feedback (GOV component), "Is this page useful?", report a problem.
- **Anatomy:** yes/no buttons, optional comment form, thank-you state. **Kind:** widget.

---

## 9. Source matrix

✓ = the source defines it as a component/pattern (or a named part of one); ~ = covered as a variant or
inside another entry; blank = not defined. OUI lists the cross-system name where the matrix shows one.

| Component | APG | OUI | GOV | M3 | CDS |
|---|:-:|:-:|:-:|:-:|:-:|
| Skip link | ~ (landmarks) | | ✓ | | ~ (UI shell) |
| Header / app bar | ~ (banner landmark) | | ✓ | ✓ top app bar | ✓ UI shell |
| Announcement / phase banner | | | ✓ | | ✓ Guidebanner |
| Hero / page header | | | ~ panel | | ✓ PageHeader |
| Section / region | ✓ landmarks | | | | ~ Grid/Layer |
| Sidebar / aside | ✓ complementary | | | ✓ side sheet | ✓ Sidebar |
| Footer | ✓ contentinfo | | ✓ | | |
| Top navigation | ~ disclosure | | ✓ service nav | | ✓ header nav |
| Mega / dropdown nav | ✓ disclosure | | | | |
| Side navigation / drawer / rail | | | | ✓ | ✓ side nav |
| Bottom navigation | | | | ✓ navigation bar | |
| Breadcrumb | ✓ | ✓ | ✓ (+ back link) | | ✓ |
| Pagination | | ✓ | ✓ | | ✓ |
| Menu, menu button, menubar | ✓ | ✓ | | ✓ | ✓ Menu, OverflowMenu |
| Tabs | ✓ | ✓ | ✓ | ✓ | ✓ |
| Link | ✓ | ✓ | | | ✓ |
| Back to top | | | | | |
| Language switcher | | | ✓ | | |
| Toolbar | ✓ | ✓ | | ✓ | |
| Step-by-step navigation | | | ✓ pattern | | |
| Text / heading / inset / warning | | | ✓ | | ✓ Heading |
| List / summary list / task list | ✓ (listbox ~) | ✓ | ✓ | ✓ | ✓ |
| Card / tile | | ✓ | | ✓ | ✓ Tile, Card |
| Accordion | ✓ | ✓ | ✓ | | ✓ |
| Disclosure / details | ✓ | ✓ | ✓ details | | ✓ |
| FAQ | ~ disclosure | | | | |
| Badge / tag / chip | | ✓ | ✓ tag | ✓ badge, chips | ✓ Tag, BadgeIndicator |
| Testimonial / quote | | | | | |
| Stat / metric | | | | | ✓ BigNumber |
| Timeline | | | | | |
| Team / profile / avatar | | ✓ avatar | | | ✓ UserAvatar |
| Button | ✓ | ✓ | ✓ | ✓ | ✓ |
| Button group / split / segmented | ~ toolbar | | | ✓ | ✓ ButtonSet, ComboButton, ContentSwitcher |
| Text input / textarea / password | | ✓ | ✓ | ✓ text field | ✓ |
| Character count | | | ✓ | ✓ ~ | |
| Select | ~ combobox | ✓ | ✓ | ✓ | ✓ |
| Combobox / autocomplete | ✓ | ✓ | | | ✓ ComboBox, MultiSelect |
| Listbox | ✓ | ✓ | | | ✓ ListBox |
| Checkbox | ✓ | ✓ | ✓ | ✓ | ✓ |
| Radio group | ✓ | ✓ | ✓ | ✓ | ✓ |
| Switch | ✓ | ✓ | | ✓ | ✓ Toggle |
| Slider / range / multi-thumb | ✓ | ✓ | | ✓ | ✓ |
| Spinbutton / number input | ✓ | ✓ | | | ✓ NumberInput |
| Date input / date picker / time picker | ~ grid+dialog | ✓ | ✓ date input | ✓ | ✓ |
| File upload | | | ✓ | | ✓ FileUploader |
| Search | ✓ search landmark | ✓ | | ✓ | ✓ Search, ExpandableSearch |
| Rating | ~ radio | | | | |
| Fieldset / form | ✓ form landmark | ✓ | ✓ | | ✓ Form, FormGroup |
| Error message / summary | | | ✓ | ~ | ~ |
| Alert / notification banner | ✓ | ✓ | ✓ | | ✓ Notification |
| Toast / snackbar | ~ alert | | | ✓ snackbar | ✓ |
| Dialog / modal | ✓ | ✓ | | ✓ | ✓ Modal, Dialog |
| Alert dialog | ✓ | ✓ | | ~ | ✓ ~ danger modal |
| Popover / toggletip / coachmark | | ✓ | | ~ rich tooltip | ✓ |
| Tooltip | ✓ (WIP) | ✓ | | ✓ | ✓ |
| Progress / spinner / skeleton | ~ meter | ✓ | | ✓ | ✓ |
| Meter / gauge | ✓ | | | | ✓ Gauge |
| Stepper / wizard | | | ✓ task list | | ✓ ProgressIndicator |
| Cookie banner | | | ✓ | | |
| Empty / 404 / error pages | | | ✓ patterns | | ✓ FullPageError |
| Image / figure | | | | | ✓ AspectRatio |
| Gallery / lightbox | ~ dialog | | | | |
| Carousel | ✓ | ✓ | | ✓ | |
| Window splitter | ✓ | | | | |
| Video / embed | | | | | |
| Map | | | | | |
| Icon | | ✓ | | ✓ | ✓ |
| Table | ✓ | ✓ | ✓ | | ✓ DataTable, StructuredList |
| Data grid | ✓ | | | | ✓ DataTable |
| Tree view / treegrid | ✓ | ✓ | | | ✓ TreeView |
| Feed | ✓ | | | | |
| Calendar / events | ~ grid | | | ~ date picker | |
| Countdown | | | | | |
| Pricing table | | | | | |
| Newsletter / contact form | ✓ form landmark | | ✓ patterns (email, phone, address, contact a department) | | |
| Social links / share | | | | | |
| CTA band / feature grid / listing / article | | | | | |
| Login / account | | | ✓ patterns | | |
| Feedback / page rating | | | ✓ | | |

**Reading the gaps.** The design systems (GOV, M3, CDS) cover **controls**; the APG covers **interaction
semantics**. Neither covers **marketing / site sections** (hero, testimonial, pricing, team, timeline,
countdown, logo cloud, CTA band, gallery, map, video): those are the website-builder's own territory,
assembled from the primitives above, and each needs its a11y contract written by hand using the entries in
this file (for example gallery = grid of buttons + Dialog; pricing toggle = Switch or radio group; calendar =
list + Grid).
