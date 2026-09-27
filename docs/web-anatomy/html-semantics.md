# HTML Semantics — a reference for the Educo builder

What every HTML element *means*, which accessibility role it carries, and which ones a builder block should be
able to *become* on export. Read on 2026-09-27 from the sources cited in each section.

## 0. "HTML5" is the HTML Living Standard

MDN (https://developer.mozilla.org/en-US/docs/Glossary/HTML5): *"The term HTML5 is essentially a buzzword that
refers to a set of modern web technologies."* There is no HTML 5.x to target any more. *"Since 28 May 2019, the
WHATWG Living Standard was announced by the W3C as the sole version of HTML."* HTML is now a single, unversioned
**Living Standard** that changes continuously, and `<!doctype html>` opts a page into its latest version.

**How this document ranks its sources**

1. **Ground truth: the WHATWG HTML Living Standard** (https://html.spec.whatwg.org/multipage/). When a rule here
   and MDN disagree, the spec wins.
2. **Accessibility mappings:** W3C **ARIA in HTML** (https://www.w3.org/TR/html-aria/) says which *implicit role*
   each element has and which roles authors *may* set on it. W3C **HTML-AAM**
   (https://www.w3.org/TR/html-aam-1.0/) *"defines how user agents map HTML elements and attributes to platform
   accessibility APIs"*, which is what a screen reader actually receives.
3. **Readable guide: MDN**, for explanations, examples and browser support (its data comes from
   `mdn/browser-compat-data`).

Anything this document calls "new" is simply a later addition to the same Living Standard.

**Sources**

- WHATWG HTML Living Standard — https://html.spec.whatwg.org/multipage/
- W3C HTML-AAM — https://www.w3.org/TR/html-aam-1.0/
- MDN browser-compat-data — https://github.com/mdn/browser-compat-data
- MDN, Semantics glossary — https://developer.mozilla.org/en-US/docs/Glossary/Semantics
- MDN, HTML elements reference — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements
- MDN, Content categories — https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Content_categories
- WHATWG HTML, Sections — https://html.spec.whatwg.org/multipage/sections.html
- WHATWG HTML, Grouping content — https://html.spec.whatwg.org/multipage/grouping-content.html
- W3C, ARIA in HTML (implicit roles) — https://www.w3.org/TR/html-aria/
- W3C WAI APG, Landmark regions — https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
- MDN, Heading elements — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements
- MDN, `<th>` — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th

---

## 1. Why semantics matter

*Source: MDN Semantics glossary; WHATWG Grouping content.*

| Reason | What it buys | From the source |
|---|---|---|
| Accessibility | Screen readers list landmarks, headings and lists, and let a user jump between them. | "Screen readers can use it as a signpost to help visually impaired users navigate a page." |
| SEO | Search engines weight a heading's text as a keyword signal. | "Search engines will consider its contents as important keywords to influence the page's search rankings." |
| Reader modes and other user agents | Reader view, translation and summarisers pull out `main`/`article` and the headings, and drop the `nav`/`aside` chrome. That only works when the page says which part is which. | (the same mechanism the glossary describes) |
| Maintainability | "Finding blocks of meaningful code is significantly easier than searching through endless `div`s." | MDN glossary |

The principle to hold the builder to: *"HTML should be coded to represent the data that will be populated and not
based on its default presentation styling. Presentation … is the sole responsibility of CSS."* (MDN). The spec also
says `div` is *"an element of last resort, for when no other element is suitable"* (WHATWG §4.4.16).

**For Educo:** a block's *look* (Stack, Row, Grid, Card) and its *meaning* (section, nav, article) are separate
axes. The export should let any container carry any valid meaning, the same way a Stack can carry any background.

---

## 2. Every element, grouped as MDN groups them

**How to read the tables**

- **Cat.** = content category (MDN Content categories). M metadata · F flow · S sectioning · H heading ·
  P phrasing · E embedded · I interactive (I\* = only under a condition, e.g. `a[href]`, `video[controls]`).
- **Role** = the implicit ARIA role, from W3C ARIA in HTML and cross-checked against HTML-AAM. "—" means no
  corresponding role.
- **Builder** = what an Educo block may do with the element:
  - **BLOCK**: a user-chosen *semantic tag* on a container block (Stack / Row / Grid / grid cell). The block
    keeps its layout and changes only the tag it exports as.
  - **COMP**: emitted by a component or content block (Image, Heading, List, Table, Form…), never picked as a
    free tag.
  - **TEXT**: an inline format inside rich text (a toolbar button or a mark).
  - **ENGINE**: the exporter writes it; the user never places it.
  - **NO**: the builder should not offer it.

### Main root

| Element | Meaning | Cat. | Role | Builder |
|---|---|---|---|---|
| `html` | Root of the document; carries `lang`. | — | generic | ENGINE (must set `lang`) |

### Document metadata

| Element | Meaning | Cat. | Role | Builder |
|---|---|---|---|---|
| `head` | Machine-readable information about the document. | — | — | ENGINE |
| `title` | Document title shown in the tab and in search results. | M | — | ENGINE (from page settings) |
| `base` | Base URL for relative links. | M | — | NO |
| `link` | Relationship to an external resource (stylesheet, icon, canonical). | M | — | ENGINE |
| `meta` | Metadata: charset, viewport, description, Open Graph. | M | — | ENGINE (from SEO settings) |
| `style` | Embedded CSS. | M | — | ENGINE |

### Sectioning root

| Element | Meaning | Cat. | Role | Builder |
|---|---|---|---|---|
| `body` | The document's content; exactly one. | — | generic | ENGINE (the page itself) |

### Content sectioning

| Element | Meaning | Cat. | Role | Builder |
|---|---|---|---|---|
| `header` | Introductory or navigational aids. | F | **banner** when scoped to `body`; inside `article`/`aside`/`main`/`nav`/`section` it is generic (ARIA in HTML), and HTML-AAM maps it to `sectionheader` | **BLOCK** |
| `footer` | Footer for its nearest sectioning ancestor (author, copyright, links). | F | **contentinfo** at body level; nested, it is generic, and HTML-AAM maps it to `sectionfooter` | **BLOCK** |
| `main` | The dominant content of the page. | F | **main** | **BLOCK** (at most one per page, see §3) |
| `nav` | A block of navigation links. | F S | **navigation** | **BLOCK**; the Menu component emits it |
| `section` | A generic, thematic section, normally with a heading. | F S | **region** only when it has an accessible name, otherwise generic | **BLOCK** (the default for a page band) |
| `article` | A self-contained composition that could be distributed on its own (news item, event, blog post, card). | F S | article | **BLOCK** |
| `aside` | Content tangential to what surrounds it (sidebar, pull-out). | F S | **complementary** at body or `main` level; nested in sectioning content, HTML-AAM makes it complementary *only with an accessible name*, otherwise generic | **BLOCK** |
| `address` | Contact information for the nearest `article` or `body`. | F | group | **BLOCK** (a school's contact card) |
| `search` | Container for search or filtering controls. | F | **search** | **BLOCK** / COMP (search component) |
| `h1`–`h6` | Section headings, levels 1–6. | F H P | heading (aria-level 1–6) | COMP (Heading block, with a level picker) |
| `hgroup` | A heading plus one or more paragraphs of subtitle or tagline. | F H | group | COMP (heading + kicker/tagline) |

The spec on choosing between them: *"A section forms part of something else. An article is its own thing."* Use
`article` *"when it would make sense to syndicate the contents"*, and `div` only *"for styling purposes or as a
convenience for scripting"* (WHATWG §4.3).

### Text content

| Element | Meaning | Cat. | Role | Builder |
|---|---|---|---|---|
| `div` | Generic container with no meaning. | F | generic | **BLOCK** (the default when no meaning applies) |
| `p` | A paragraph. | F P-host | paragraph | COMP (Text block) |
| `blockquote` | Content quoted from another source. | F | blockquote | COMP (Quote); **BLOCK** optional |
| `figure` | Self-contained content referenced as a unit, optionally captioned. | F | figure when it has a `figcaption`, otherwise generic | **BLOCK** (a Stack of image + caption); COMP (Image with caption) |
| `figcaption` | Caption for its parent `figure`. | — | — | COMP (first child of a figure only) |
| `hr` | Thematic break between paragraph-level elements. | F | separator | COMP (Divider) |
| `ul` | Unordered list: order does not change the meaning. | F | list | COMP (List); **BLOCK** for a repeated card group |
| `ol` | Ordered list: order changes the meaning. | F | list | COMP; **BLOCK** (steps, rankings) |
| `menu` | A toolbar: an unordered list of commands. | F | list | COMP (button groups) |
| `li` | An item in `ul`, `ol` or `menu`. | — | listitem (generic outside a list) | **BLOCK** only as a child of a list-tagged block |
| `dl` | Description list: name–value groups (glossary, FAQ, facts). | F | — | COMP (key facts, FAQ); **BLOCK** optional |
| `dt` | A term or name in a `dl`. | — | — | COMP |
| `dd` | The description or value for the preceding `dt`. | — | — | COMP |
| `pre` | Preformatted text where whitespace matters. | F | generic | COMP (code block) |

### Inline text semantics

All phrasing content. The builder offers these as rich-text marks (TEXT) unless noted.

| Element | Meaning | Role | Builder |
|---|---|---|---|
| `a` | Hyperlink. | link with `href`, otherwise generic | TEXT; COMP (Button-as-link, Card link) |
| `abbr` | Abbreviation, with its expansion in `title`. | — | TEXT |
| `b` | Draws attention, with no extra importance. | generic | TEXT (prefer `strong` when it *is* important) |
| `bdi` | Isolates text of unknown direction. | — | ENGINE (user-generated names) |
| `bdo` | Overrides text direction. | — | NO |
| `br` | Line break that belongs to the content (poem, address). | — | TEXT (Shift+Enter) |
| `cite` | Title of a creative work. | — | TEXT; COMP (Quote source) |
| `code` | A fragment of computer code. | code | TEXT |
| `data` | Content with a machine-readable `value`. | — | COMP (Stat numbers) |
| `dfn` | The defining instance of a term. | term | TEXT |
| `em` | Stress emphasis. | emphasis | TEXT (italic button) |
| `i` | Alternate voice: foreign phrase, taxon, ship name. | generic | TEXT |
| `kbd` | Keyboard input. | — | TEXT |
| `mark` | Highlighted for relevance. | — | TEXT (highlighter) |
| `q` | Short inline quotation. | generic | TEXT |
| `ruby`, `rt`, `rp` | East Asian pronunciation annotation. | — | TEXT (language pages) |
| `s` | No longer accurate or relevant. | — | TEXT (strikethrough) |
| `samp` | Sample program output. | generic | TEXT |
| `small` | Side comment or fine print. | generic | TEXT |
| `span` | Generic inline container. | generic | ENGINE (style runs) |
| `strong` | Strong importance. | strong | TEXT (bold button) |
| `sub` / `sup` | Subscript / superscript. | subscript / superscript | TEXT |
| `time` | A date or time, with a machine-readable `datetime`. | time | COMP (Event date, News date, Countdown) |
| `u` | Unarticulated annotation (e.g. a misspelling). | — | TEXT (avoid: reads as a link) |
| `var` | A variable in maths or code. | — | TEXT |
| `wbr` | Optional line-break opportunity. | — | ENGINE (long URLs) |

### Image and multimedia

| Element | Meaning | Cat. | Role | Builder |
|---|---|---|---|---|
| `img` | An image. | F P E (I\* with `usemap`) | img with a non-empty `alt`; none/presentation with `alt=""` | COMP (Image) |
| `audio` | Sound content. | F P E (I\* with `controls`) | — | COMP |
| `video` | Video content. | F P E (I\* with `controls`) | — | COMP (Video; background video) |
| `track` | Timed text track (captions, subtitles) for audio or video. | — | — | COMP (captions upload) |
| `map` / `area` | Image map with clickable areas. | F P / P | — / link with `href` | NO (not responsive) |

### Embedded content

| Element | Meaning | Cat. | Role | Builder |
|---|---|---|---|---|
| `iframe` | A nested browsing context (map, calendar, form). | F P E I | — (needs a `title`) | COMP (Embed) |
| `embed` | External plugin content. | F P E I | — | NO |
| `object` | External resource (e.g. a PDF viewer). | F P E | — | NO (use a link or an iframe) |
| `picture` | Art-directed or format-switched image sources. | F P E | — | ENGINE (responsive images) |
| `source` | A media source for `picture`, `audio` or `video`. | — | — | ENGINE |

### SVG and MathML

| Element | Meaning | Role | Builder |
|---|---|---|---|
| `svg` | Inline vector graphics. | graphics-document | COMP (Icon, Shape); decorative icons get `aria-hidden="true"` |
| `math` | MathML formula. | math | COMP (maths pages) |

### Scripting

| Element | Meaning | Role | Builder |
|---|---|---|---|
| `canvas` | A scriptable bitmap. | — | NO (inaccessible without a fallback) |
| `noscript` | Fallback shown when scripts are off. | — | ENGINE |
| `script` | Executable script or data block (JSON-LD). | — | ENGINE (structured data, interactions) |

### Demarcating edits

| Element | Meaning | Role | Builder |
|---|---|---|---|
| `del` | Removed text. | deletion | TEXT (e.g. a changed term date) |
| `ins` | Inserted text. | insertion | TEXT |

### Table content

| Element | Meaning | Role | Builder |
|---|---|---|---|
| `table` | Tabular data. | table | COMP (Table: timetables, fees). **Never used for layout.** |
| `caption` | The table's title. | caption | COMP (always offered) |
| `colgroup` / `col` | Column groups, for styling and header scope. | — | ENGINE |
| `thead` / `tbody` / `tfoot` | Row groups. | rowgroup | ENGINE |
| `tr` | Table row. | row | ENGINE |
| `th` | Header cell. | columnheader / rowheader | COMP (header row/column toggles set `scope`) |
| `td` | Data cell. | cell | COMP |

### Forms

| Element | Meaning | Role | Builder |
|---|---|---|---|
| `form` | A form that submits data. | form (a landmark only when it has an accessible name) | COMP (Contact / Enquiry form) |
| `fieldset` / `legend` | A group of controls, and its caption. | group / — | COMP (radio groups, sections of a long form) |
| `label` | Caption for a control. | — | COMP (always emitted) |
| `input` | A control; the role depends on `type` (textbox, searchbox, checkbox, radio, slider, spinbutton, button…). | varies | COMP |
| `button` | A clickable button that performs an action. | button | COMP (Button with an *action*) |
| `select` / `option` / `optgroup` | A choice list. | combobox or listbox / option / group | COMP |
| `datalist` | Suggestions for an input. | listbox | COMP |
| `textarea` | Multi-line text entry. | textbox | COMP |
| `output` | The result of a calculation. | status | COMP (fee calculator) |
| `meter` | A value within a known range. | meter | COMP (Stat or Progress) |
| `progress` | Completion of a task. | progressbar | COMP |
| `selectedcontent` | Mirrors the chosen option inside a customisable `select` (new). | generic | NO (for now) |

### Interactive elements

| Element | Meaning | Role | Builder |
|---|---|---|---|
| `details` | A disclosure widget. | group | COMP (Accordion item); **BLOCK** optional |
| `summary` | The visible label of a `details`. | — (exposed as a button by browsers) | COMP |
| `dialog` | A modal or non-modal dialog. | dialog | COMP (Popup / lightbox) |
| `geolocation` | Location-permission control (experimental). | — | NO |

### Web Components

| Element | Meaning | Role | Builder |
|---|---|---|---|
| `template` | Inert markup to be cloned by script. | — | ENGINE |
| `slot` | Placeholder inside a shadow tree. | — | NO |

### Obsolete and deprecated (never emit)

`acronym` (use `abbr`) · `big` (use CSS) · `center` (use CSS) · `content` · `dir` (use `ul`) · `fencedframe` ·
`font` (use CSS) · `frame` · `frameset` · `image` · `marquee` (use a CSS animation that respects
reduced motion) · `menuitem` · `nobr` · `noembed` · `noframes` · `param` · `plaintext` · `rb` · `rtc` ·
`shadow` · `strike` (use `s`/`del`) · `tt` (use `code`/`kbd`) · `xmp` (use `pre`).
*(List as MDN groups it; `fencedframe` appears in MDN's list, but it is a privacy-sandbox embed rather than an
authoring element. Either way, a school site has no use for it.)*

### The BLOCK tag menu, in summary

A container block (Stack, Row, Grid, grid cell) should offer:
**`div` (default) · `section` · `article` · `aside` · `nav` · `header` · `footer` · `main` · `figure` ·
`address` · `search` · `blockquote` · `ul`/`ol` (children become `li`) · `dl` · `details`**.
Each choice is validated by the rules in §3–§6; for example, `main` greys out once the page already has one.

### Which roles an author may override (ARIA in HTML)

A builder that offers an "ARIA role" field must restrict it to what ARIA in HTML allows. The spec also says it
is *"NOT RECOMMENDED"* to set a `role` or `aria-*` value that matches the element's implicit semantics; for
example, `<nav role="navigation">` is redundant.

| Element | Roles an author MAY set | Builder consequence |
|---|---|---|
| `div`, `span` | any (a `div` directly inside a `dl`: only `none`/`presentation`) | Prefer changing the *tag*, not adding a role |
| `section` | alert, alertdialog, application, banner, complementary, contentinfo, dialog, document, feed, group, log, main, navigation, none, note, search, status, tabpanel… | Wide, but a real tag (`nav`, `aside`) is always better |
| `article` | application, document, feed, main, none, presentation, region | `feed` suits a News list |
| `aside` | feed, none, note, presentation, region, search | — |
| `header` / `footer` | group, none, presentation (plus banner / contentinfo when scoped to body) | — |
| `nav` | menu, menubar, none, presentation, tablist | Do **not** set `menu` on a site nav; that is an app-menu pattern |
| `main` | only `main` (redundant) | Never offer a role |
| `h1`–`h6` | none, presentation, tab | Never offer a role |
| `ul` / `ol` | group, listbox, menu, menubar, none, presentation, radiogroup, tablist, toolbar, tree | `tablist` for a Tabs component |
| `li` inside a list | only `listitem` | — |
| `figure` with `figcaption` | only `figure` | — |
| `form` | none, presentation, search | — |
| `search` | form, group, none, presentation, region | — |
| `img` with `alt=""` | only `none` / `presentation` | Decorative stays decorative |
| `a[href]` | button, checkbox, menuitem, option, radio, switch, tab, treeitem | A link acting as a button should *be* a `button` |
| `button` | checkbox, combobox, link, menuitem, option, radio, switch, tab… | — |
| `details` | only `group` (not recommended) | Never offer a role |
| `dialog` | alertdialog | For a confirm/alert popup |
| `hr` | none, presentation | — |

Elements whose row in ARIA in HTML reads **"No `role`"** must never be given one.

---

## 3. Landmarks

*Sources: W3C WAI APG Landmark regions; W3C ARIA in HTML; WHATWG `main`.*

| Landmark role | Created by | Condition | How many |
|---|---|---|---|
| `banner` | `header` | Only when it is **not** a descendant of `article`, `aside`, `main`, `nav` or `section` | One per page |
| `contentinfo` | `footer` | Same condition as `header` | One per page |
| `main` | `main` | Always | One per page (not counting `hidden` ones) |
| `navigation` | `nav` | Always | Many; label each one if there is more than one |
| `complementary` | `aside` | At body or `main` level always; nested in `article`/`section`/`nav`/`aside` **only when named** (HTML-AAM) | Many; label each one if there is more than one |
| `region` | `section` | **Only with an accessible name** (`aria-labelledby`, `aria-label` or `title`) | Many, each labelled |
| `form` | `form` | **Only with an accessible name** | Many, each labelled |
| `search` | `search` | Always | Many; label each one if there is more than one |

**Rules**

1. *"If a specific landmark role is used more than once on a page, provide each instance of that landmark with a
   unique label."* (APG) An example is "Main menu" and "Footer links" on two `nav`s.
2. If a landmark is used only once, it may not need a label.
3. If the area begins with a heading, point `aria-labelledby` at that heading instead of writing a second label.
4. *"Do not use the landmark role as part of the label"*. The APG example: "Site Navigation" is announced as
   "Site Navigation Navigation".
5. `complementary` should be a top-level landmark and stay meaningful when separated from the main content.
6. `main` must be **hierarchically correct**. Its only allowed ancestors are `html`, `body`, `div`, a `form`
   without an accessible name, and autonomous custom elements (WHATWG §4.4.14). So `main` can never sit inside
   a `section`, `article` or `header`.
7. All visible content should live inside some landmark, so nothing is stranded outside the regions a screen
   reader user jumps between.

**For Educo:** a page's top band tagged `header` is the banner *only* if it is a direct band of the page. The
same tag on a band nested inside a `section` quietly becomes generic. The inspector should show the resulting
role, not only the tag.

---

## 4. Specific rules

### Headings

*Sources: WHATWG §4.3.6; MDN Heading elements.*

- **One `h1` per page**, describing the page, similar to its `<title>` (MDN). The spec permits more than one,
  but that *"is not considered a best practice."*
- **Do not skip levels.** WHATWG: *"each heading following another heading must have a heading level that is
  less than, equal to, or 1 greater than"* the previous one. So h2 → h4 is an error, while h4 → h2 is fine.
- **The level is not decided by the section.** The outline algorithm was never implemented, and since 2025 the
  spec no longer changes the meaning of an `h1` nested inside a `section`. MDN: nested `h1`s are
  *"now non-conforming"*. The level the user picks is the level that is exported.
- **Never use a heading to size text** (MDN). Size is a type-scale token; level is meaning. The builder's Heading
  block should keep *level* and *visual size* as two separate controls.

### Document language

`<html lang="…">` is required; screen readers choose their pronunciation from it. A passage in another
language (a French department page, a motto in Latin) takes its own `lang` attribute. This is WCAG 3.1.1 and
3.1.2.

### Skip links

The first focusable element on the page should be a link such as "Skip to main content" that targets
`<main id="main">`. It can be hidden until it receives focus. This is WCAG 2.4.1 *Bypass Blocks*; landmarks help,
but a keyboard user without a screen reader still needs the link.

### Lists vs divs

*Source: WHATWG §4.4.*

- Use `ol` when *"changing the order would change the meaning"* and `ul` when it would not.
- `li` must be a child of `ol`, `ul` or `menu`.
- Use `dl` for name–value groups (FAQs, key facts). Within one `dl` there should not be more than one `dt` per
  name. A `div` may wrap each `dt`/`dd` group for styling.
- A row of cards, a news feed or a set of menu links *is* a list. Screen readers then announce "list, 6 items",
  which a stack of `div`s cannot do.

### Buttons vs links

A **link** (`a href`) *goes somewhere*: another page, an anchor or a file. A **button** *does something*: opens a
menu, submits a form, plays a slide. A styled `div` or `span` is neither; it is not focusable and does not
respond to Enter or Space. The builder's Button component should choose `<a>` or `<button>` based on its
*action*, never its look.

### figure / figcaption

*Source: WHATWG §4.4.12.*

For self-contained content (a photo, chart or code listing) referenced as a unit. *"The first figcaption element
child … represents the caption."* A `figure` without a `figcaption` has a generic role. The caption does not
replace `alt`: `alt` describes the image, and the caption is visible text for everyone. Pull quotes belong in
`aside`, not `figure`.

### time

`<time datetime="2026-10-14">14 October</time>` gives dates on events, news and term calendars a machine-readable
value, which search engines and calendars use.

### address

Contact information for its nearest `article` or `body` ancestor (WHATWG §4.3.10). It is **not** for any postal
address that happens to appear in the text. A school's contact footer is exactly the right use.

### details / summary

A native accordion: keyboard-operable, announced as expanded or collapsed, and it works without JavaScript. The
Accordion component should emit `details`/`summary` rather than re-implementing the behaviour with `div`s.

### dialog

A popup or lightbox uses `dialog`, opened with `showModal()` so that it traps focus, closes on Escape and makes
the rest of the page inert. It needs an accessible name, usually from its heading via `aria-labelledby`.

### Tables

*Source: MDN `<th>`.*

- Use tables for data only, never for layout.
- `<caption>` names the table.
- Header cells are `<th>` with `scope="col"`, `row`, `colgroup` or `rowgroup`. MDN: *"certain assistive
  technologies may fail to infer correctly, so specifying header scope may improve user experiences."*
- For multi-level headers, use `headers` + `id`.
- Put rows in `thead`/`tbody`/`tfoot`.

---

## 5. Newer than the HTML5 label: what a modern builder should use

*Sources: MDN pages for each feature; version numbers are the first release, from `mdn/browser-compat-data`
(read 2026-09-27). "Baseline" is MDN's label for support in Chrome, Edge, Firefox and Safari. **Newly** means all
four support it; **widely** means that has been true for 30 months.*

| Feature | What it gives a school site | Support (MDN / BCD) | Builder |
|---|---|---|---|
| `<dialog>` + `showModal()` | A real modal: focus is trapped, Escape closes it, the page behind becomes inert, `aria-modal` is set, and `::backdrop` can be styled. `form method="dialog"` closes it with no script. MDN: put `autofocus` on the first control and never put `tabindex` on the `dialog` itself. | **Widely available** since Mar 2022 (Chrome 37, Firefox 98, Safari 15.4) | **Expose**: Popup, lightbox and cookie-notice blocks emit it |
| `dialog closedby="any"` | Light-dismiss (click outside the dialog) for modals. | Chrome 134, Firefox 141, Safari preview; **not Baseline** | Optional enhancement; a close button remains mandatory |
| `command` / `commandfor` on `button` | Open or close a dialog or popover declaratively, with no JavaScript. | Chrome 135, Firefox 144, Safari 26.2; **newly available** | **Expose** as the wiring for "button opens popup" |
| `popover` + `popovertarget` | Top-layer menus, tooltips and toggle panels with light-dismiss and Escape, and no z-index fights. `auto` closes the other popovers; `manual` does not. | **Baseline 2024** (newly available since Apr 2024; Chrome 114, Firefox 125, Safari 17) | **Expose**: dropdown nav, "more" menus, info tips |
| `popover="hint"` | Hover or focus tooltips that do not close menus. | Chromium only; Firefox and Safari were not yet shipped in BCD at time of reading; **not Baseline** | Wait; fall back to `auto` |
| `<details name="…">` | An exclusive accordion (opening one item closes the others), with keyboard support and no JS. | `details` is **widely available** (since Jan 2020); `name` since Chrome 120, Firefox 130, Safari 17.2, so **newly available** | **Expose**: Accordion option "one open at a time" |
| `<search>` | A search landmark without `role="search"`. | **Widely available**, since Oct 2023 | **Expose**: BLOCK tag + the Search component |
| `inert` | Removes a subtree from focus, clicks, find-in-page and the accessibility tree (e.g. an off-canvas menu while it is closed). | **Widely available** (since Apr 2023; Chrome 102, Firefox 112, Safari 15.5) | **Engine**: closed mobile menus and hidden slides; do not show the user |
| `hidden="until-found"` | Collapsed content that Ctrl+F and `#fragment` links can still find and open (FAQ answers, tab panels). Fires `beforematch`. | Chrome 102, Firefox 148, Safari 26.2; **newly available** | **Engine**: for Tabs and custom accordions; `details` already gets this behaviour |
| `img loading="lazy"` | Defers offscreen images. MDN: the image needs `width`/`height` so no layout shift. | Chrome 77, Firefox 75, Safari 15.4; **widely available** | **Engine default** for every image below the first screen; **never** on the hero/LCP image |
| `img fetchpriority="high"` | Loads the hero image first. | Chrome 101, Safari 17.2, Firefox 132; **newly available** | **Engine**: the first large image on the page only |
| `img decoding="async"` | Decodes off the main thread. | Chrome 65, Firefox 63, Safari 11.1; **widely available** | **Engine default** |
| `srcset` + `sizes`, `<picture>` | Serves the right image size or format per screen; `<picture>` also lets the crop change per breakpoint. | **Widely available** (srcset Chrome 34, Firefox 38, Safari 8) | **Engine** from uploads; `<picture>` when an image has per-rung crops |
| `sizes="auto"` | Lazy images compute `sizes` from their layout box. | Chrome 126; Firefox and Safari only in very recent versions per BCD; **not yet reliably Baseline** | Engine: emit `auto, <fallback>` so older browsers use the fallback |
| Customizable `<select>` (`appearance: base-select`, `<selectedcontent>`, `::picker(select)`) | Fully styleable select with rich options, while staying native. | **Limited availability**, not Baseline (MDN). Falls back to a classic `select` | Enhancement only: emit markup that degrades, and gate the styling behind `@supports (appearance: base-select)` |
| `<menu>` | A semantic list of *commands* (a toolbar); role `list`. | **Widely available** | COMP for button groups; site navigation stays `nav` > `ul` |
| Form validation (`required`, `type=email/tel/url`, `pattern`, `min`/`max`, `minlength`/`maxlength`) + `:user-invalid` | Native, accessible error states without scripts. | Attributes **widely available** | **Expose** per field: "Required", format, length; errors linked with `aria-describedby` |
| `autocomplete` tokens (`name`, `given-name`, `family-name`, `email`, `tel`, `street-address`, `postal-code`, `organization`, `bday`) | Autofill; MDN says valid tokens satisfy **WCAG 1.3.5 Identify Input Purpose (AA)**. Avoid a blanket `autocomplete="off"`. | **Widely available** | **Engine-set** from the field type chosen in the Form builder (a "Parent email" field sets `email`) |
| `inputmode` | The right on-screen keyboard (`numeric`, `tel`, `email`, `decimal`, `search`, `url`). | Chrome 66, Firefox 95, Safari 12.1; **widely available** | **Engine-set** from the field type |
| `enterkeyhint` | Labels the virtual Enter key (`next`, `send`, `search`, `done`, `go`). | **Widely available** since Nov 2021 | **Engine**: `next` on all fields but the last, `send` on the last |

**The rule for "new":** expose a feature to users when it is **Baseline (newly or widely)**. Anything short of
that is emitted only as progressive enhancement over markup that already works; the page must be correct in a
browser that ignores it.

---

## 6. Export checklist the builder can enforce automatically

Each line is decidable from the block tree alone. **E** = block the publish; **W** = warn in the inspector.

| # | Check | Sev. | Source |
|---|---|---|---|
| 1 | `<html>` has a non-empty `lang`. | E | WCAG 3.1.1 |
| 2 | `<title>` is present and non-empty, and unique across the site. | E | WCAG 2.4.2 |
| 3 | Exactly one `main` (not counting `hidden`), and it is hierarchically correct (ancestors limited to `html`, `body`, `div`, or an unnamed `form`). | E | WHATWG §4.4.14 |
| 4 | At most one body-level `header` (banner) and one body-level `footer` (contentinfo). | E | APG |
| 5 | Any landmark role that appears more than once (`nav`, `aside`, `search`, named `section`/`form`) has a unique accessible name on each instance. | E | APG |
| 6 | No landmark label contains its own role word ("navigation", "sidebar region"…). | W | APG |
| 7 | A `section` either has a heading or a label, or it is exported as `div`. A `section` with neither is really a `div`, and the exporter should say so. | W | WHATWG §4.3.3 |
| 8 | Exactly one `h1` on the page. | W | MDN |
| 9 | No skipped heading levels: each heading is at most one level deeper than the previous one. | E | WHATWG §4.3.6 |
| 10 | No empty headings, links or buttons: each has text or an accessible name. | E | WCAG 2.4.4, 4.1.2 |
| 11 | Every `img` has `alt`: descriptive text, or `alt=""` with the block marked *decorative*. A missing `alt` is never allowed. | E | ARIA in HTML; WCAG 1.1.1 |
| 12 | A decorative inline `svg` has `aria-hidden="true"`; a meaningful one has `role="img"` and a label. | E | WCAG 1.1.1 |
| 13 | Every `iframe` has a `title`. | E | WCAG 4.1.2 |
| 14 | `video` with speech has a captions `track`. | W | WCAG 1.2.2 |
| 15 | Every form control has a `label` (or `aria-labelledby`); radio and checkbox groups sit in a `fieldset` with a `legend`. | E | WCAG 1.3.1, 3.3.2 |
| 16 | A clickable element is an `a[href]` (it navigates) or a `button` (it acts). No click handler on a `div` or `span`. | E | WCAG 2.1.1 |
| 17 | Link text is unique in context; no bare "click here" or "read more" without an accessible name. | W | WCAG 2.4.4 |
| 18 | `li` appears only inside `ul`/`ol`/`menu`; `dt`/`dd` only inside `dl`; `figcaption` only as the first or last child of `figure`. | E | WHATWG content models |
| 19 | A repeated group of three or more sibling items of the same kind (cards, links) is exported as a list. | W | WHATWG §4.4.5–6 |
| 20 | Every `table` has a `caption` and at least one `th` with `scope`, and no table is used for layout. | E | MDN `<th>` |
| 21 | Dates in Event/News/Calendar blocks are wrapped in `time[datetime]`. | E | WHATWG `time` |
| 22 | A skip link to `#main` is the first focusable element. | E | WCAG 2.4.1 |
| 23 | All visible content sits inside a landmark. | W | APG |
| 24 | No obsolete element (§2 list) is ever emitted. | E | MDN |
| 25 | No `u` on non-link text, and no heading element chosen only to size text. | W | MDN |
| 26 | `address` appears only for contact details of the page or an article. | W | WHATWG §4.3.10 |
| 27 | `blockquote` content is quoted, with the attribution *outside* it (e.g. in a `figcaption` or `cite`). | W | WHATWG §4.4.4 |
| 28 | A `dialog` has an accessible name and is opened modally. | E | ARIA in HTML |
| 29 | Every `id` in the page is unique, since labels, skip links and table `headers` depend on it. | E | WHATWG |
| 30 | Any explicit `role` is in the element's allowed list (§2), is never set on a "No role" element, and never repeats the implicit role. | E | ARIA in HTML |
| 31 | Every `img` has `width` and `height` (or an aspect ratio); `loading="lazy"` is never on the first large image, which gets `fetchpriority="high"`. | E | MDN `<img>` |
| 32 | Form fields collecting personal data carry a valid `autocomplete` token, and nothing sets `autocomplete="off"` on the whole form. | E | WCAG 1.3.5 (via MDN) |
| 33 | Any non-Baseline feature (§5) is emitted with a working fallback. | E | MDN Baseline |

**How to guard it:** in the spirit of `units-not-pixels.test.ts` and `corner-radius.test.ts`, a test should
enumerate the component catalogue and every BLOCK tag, export each one, and run the checklist above against the
HTML. A new component or tag is then covered the day it appears.
