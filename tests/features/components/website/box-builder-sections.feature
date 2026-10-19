Feature: Box Builder — ready-made sections, my sections, global sections and pages from a template (BATCH LE-15)
  As a teacher building the school's website
  I want ready-made sections I can drop in, sections I save and reuse, sections I edit once for every page,
    and new pages that start from a template
  So that a good-looking page takes minutes, and a change made once is made everywhere
  Design (signed by the user 2026-10-19, D1 … D8): docs/web-anatomy/layout-tiers/le15-design.md
  Guards: tests/unit/section-library.test.ts · tests/unit/section-space.test.ts · tests/components/website/PageGridPanel.test.tsx · tests/components/website/SectionsPanel.test.tsx · tests/unit/saved-sections.test.ts · tests/unit/global-sections.test.ts · tests/unit/page-templates.test.ts · tests/unit/section-photos.test.ts · tests/components/website/AddPageDialog.test.tsx · tests/components/website/BoxInspector.test.tsx · tests/components/website/BoxCanvas.test.tsx

  Background:
    Given the Box Builder is open on a site with the pages "Home", "Admissions" and "Term dates"
    And the site has its shared header and footer

  # ── The gallery (ED-4+ (2)) ───────────────────────────────────────────────────────────────────────────────────

  Scenario: The Add panel has a Sections group
    When I open the Add panel
    Then beside the blocks there is a "Sections" group
    And it lists its categories down the side, each with how many layouts it holds
    And the first batch holds Headers 8 · Hero / Welcome 36 · Footers 19 · Blank 1
    And every tile is a live drawing of the real blocks, never a picture of them (RULE S)

  # LE15b-15 (DECIDED BY THE USER 2026-10-19: "about us… could be a page on their own… should it not be known as a section")
  Scenario: A section is never mistaken for a page
    When I open the Sections tab
    Then it says that sections are bands I add to the page I am on, and that a whole new page starts from Add a page
    And its "Add a page" button opens the Add a page dialog, with its page templates
    And the kinds that sound like pages are named as sections: Our story, Contact details, Latest news, Upcoming events, Fees table, How to apply, Questions & answers
    And the kinds are grouped under their headings: Navigation, Opening, Story, Showing, People and trust, Action, School, Interactive

  Scenario: Wireframe or designed
    Given the Sections group is open on "Hero / Welcome"
    When I switch from "Wireframe" to "Designed"
    Then every tile redraws in its designed finish: colours, type, radius, shadow, photos and real school words
    And switching back shows the plain structure again: neutral colours, "Title goes here" words and grey picture boxes
    And the layout of each tile is the same in both

  Scenario Outline: The seven finishes
    Given the Sections group is open on "Designed"
    When I choose the finish "<finish>"
    Then every tile redraws in that personality's type, colours, radius and shadows
    And each finish is visibly different from every other one (RULE T)
    Examples:
      | finish     |
      | Serious    |
      | Minimalist |
      | Plain      |
      | Bold       |
      | Calm       |
      | Startup    |
      | Playful    |

  Scenario: The tiles follow the site's theme
    Given the site's theme is Dark
    Then every tile is drawn in Dark, and its words read at 4.5 : 1 or better on their background
    And the same is true in Light, Midnight and Purple

  Scenario: Finding a section by name
    When I press "/" in the Add panel and type "admissions"
    Then only the sections whose name or category matches are shown
    And clearing the search shows them all again

  Scenario: Adding a section after the one I am on
    Given I have selected a block inside the second band of the page
    When I click a Hero tile
    Then the hero is added as a whole band straight after the second band, never inside it
    And it is selected and scrolled into view
    And one Ctrl+Z takes it away again
    When nothing is selected and I click a Hero tile
    Then the hero is added at the end of the page, above the footer

  Scenario: Dragging a section to where I want it
    When I drag a Hero tile onto the page
    Then a line shows where it will land, between two bands
    And letting go puts it there

  Scenario: Adding a section from the keyboard
    When I Tab to a tile and press Enter
    Then the section is added exactly as a click would add it
    And every tile says its name and category to a screen reader

  Scenario: Adding a section on a phone or a tablet
    Given the builder is open on a touch screen
    When I tap a tile
    Then the section is added as a click would add it, and the sheet closes

  Scenario: A ready-made header becomes the site's header
    When I click a Headers tile
    Then a dialog asks "Replace the header on every page?"
    And choosing "Replace" puts the new header on every page, in the shared header's place
    And choosing "Cancel" changes nothing
    And one Ctrl+Z brings the old header back on every page
    And a Footers tile does the same for the shared footer

  Scenario: Once added, a section is ordinary blocks I can change completely
    Given I added a designed Hero
    Then I can select every block in it: its band, its stacks, its heading, its words, its buttons and its picture
    And change any word, picture, colour, space, radius, border, shadow, effect and per-device setting
    And add, move and delete blocks inside it
    And nothing in it is locked or special

  Scenario: A section arrives with its designed space, and the space is mine to change
    When I add a section
    Then it has the padding and gaps its design gives it, taken from the spacing scale
    And when I select its band the space is drawn on the canvas, labelled with its size
    And I can set any side to any value on the scale, down to zero
    Because ready-made is a design someone chose, like a Card's corners (D5); a block I add on its own still
      arrives with no space at all

  Scenario: A section moves and reacts, and stands still for a reader who asks it to
    Given I added a designed Hero
    Then it arrives with its entrance effect and its buttons' hover and focus effects
    And with reduced motion turned on, it appears still, all at once
    And every hover effect also shows on keyboard focus, and nothing needs a hover on a touch screen

  # HEADED: scripts/uat/review-le15-sections.js — every section, every finish, at 1280 and 375, on contact sheets for a person to judge
  Scenario: Every section reflows on a tablet and a phone
    When the page holding any section of the gallery is previewed at every width of the screen list
    Then nothing runs off the side and nothing overlaps
    And its columns stack in the order its pattern gives (a zig-zag puts the picture first on a phone)
    And the canvas shows the same as the Preview at every rung

  Scenario: Every section is held to the design rules
    Then every section, in every finish and theme, passes the page audit:
      body text 16 to 32 pixels, lines under 75 characters, line height 1.5 to 2, spacing on the scale,
      contrast 4.5 : 1, at most two type families
    And a section that fails is not in the gallery

  Scenario: The photos are light enough for a phone on slow 3G
    Given a designed section with photos
    Then each photo is one of the builder's own set, stored with its licence
    And it is at most 40 KB at 800 pixels wide, has a narrower copy for phones, and loads lazily below the fold

  Scenario: A section that needs a component we have not built yet says so
    Given a Contact section that needs a form
    Then its tile is marked "placeholder: form"
    And the form is made of existing blocks until the Form component is built

  Scenario: The sections are data, not code
    Then every section is a block tree in config/sections/<category>.json
    And the finishes are in config/section-finishes.json and the words in config/section-copy.json
    And adding a section means adding it there, with no change to any code

  # ── The second batch: About · Text · Features / Services · Spotlight / zig-zag · Stats · CTA / Banner (BATCH LE-15b) ──
  # HEADED: scripts/uat/uat-le15b-headed.js — every layout of the six, wireframe and designed, every width of screens.js

  Scenario: The story, trust and action sections are in the gallery
    When I open the Sections group
    Then it also holds About 16 · Text 8 · Features / Services 20 · Spotlight / zig-zag 17 · Stats 8 · CTA / Banner 17
    And each of them is in the wireframe and designed, and in each of the seven finishes, visibly different (RULE T)
    And each one, once added, is ordinary blocks I can change completely

  Scenario Outline: Each kind reflows the way real sites do it
    Given I added a designed "<category>" section with "<shape>"
    When the page is previewed on a tablet and on a phone
    Then on the tablet <tablet>
    And on the phone <phone>
    And nothing runs off the side and nothing overlaps, at every width of the screen list
    Examples:
      | category            | shape                        | tablet                                     | phone                                       |
      | About               | words beside a picture       | the words and the picture share the line   | the words come first, then the picture      |
      | Text                | one column of words          | the lines stay under 75 characters         | the lines stay under 75 characters          |
      | Features / Services | three features across        | two go across                              | they stack, one under another               |
      | Spotlight / zig-zag | rows that swap sides         | the rows keep their sides                  | every picture comes before its words        |
      | Stats               | four numbers across          | two go across                              | two go across, two rows                     |
      | CTA / Banner        | words beside a button        | the button stays beside the words          | the button goes under the words, full width |

  Scenario: A zig-zag puts the picture first on a phone, whichever side it sits on a desktop
    Given I added the Spotlight "Three rows that swap sides"
    When the page is previewed on a phone
    Then each row shows its picture, then its words
    And on a desktop the pictures still alternate right, left, right
    And the reading order of the words is the same on every screen (a screen reader hears the heading first)

  Scenario: A section names the component it stands in for
    Given a Stats section whose numbers would count up, or a CTA banner with a sign-up form
    Then its tile says which component it waits for ("placeholder: counter", "placeholder: form")
    And it is made of existing blocks until that component is built (RULE C)

  # ── The third batch: Cards · Programmes / Products · Gallery / Collage · Slideshow · Team · Testimonials (BATCH LE-15c) ──
  # HEADED: scripts/uat/uat-le15c-headed.js — every layout of the six, wireframe and designed, every width of screens.js

  Scenario: The showing, people and trust sections are in the gallery
    When I open the Sections group
    Then it also holds Cards 21 · Programmes / Products 12 · Gallery / Collage 14 · Slideshow 7 · Team 10 · Testimonials 8
    And each of them is in the wireframe and designed, and in each of the seven finishes, visibly different (RULE T)
    And each one, once added, is ordinary blocks I can change completely

  Scenario Outline: Each of these kinds reflows the way real sites do it
    Given I added a designed "<category>" section with "<shape>"
    When the page is previewed on a tablet and on a phone
    Then on the tablet <tablet>
    And on the phone <phone>
    And nothing runs off the side, nothing overlaps and no card is left alone on a line, at every width of the screen list
    Examples:
      | category              | shape                      | tablet                                   | phone                                    |
      | Cards                 | three cards across         | they stay across or go two and two rows  | they stack, one under another            |
      | Cards                 | one big card beside small  | the big card keeps its span              | the big card comes first, then the rest  |
      | Programmes / Products | four programmes with a fee | two go across                            | they stack, or two go across             |
      | Gallery / Collage     | one big photo and four     | the big photo keeps its span             | the big photo comes first                |
      | Team                  | four portraits             | two go across                            | two go across, or one under another      |
      | Testimonials          | three quotes in cards      | they stay across or stack                | they stack, one under another            |

  Scenario: A gallery's big picture spans its grid, and a phone shows it first
    Given I added the Gallery "One big photo beside four small ones"
    Then on a desktop the big photo covers two columns and two rows of the grid
    And on a tablet and a phone the grid narrows by itself and the big photo comes first
    And I can change its span in the Inspector like any grid block's

  Scenario: A slideshow shows one slide at a time, and moves only when I ask it to
    Given I added a Slideshow section
    Then it shows one slide at a time, and I can swipe, use the arrow keys, the arrows or the dots to move between them
    And every slide is ordinary blocks I can change, add to or delete
    And a slideshow that advances by itself pauses on hover and on focus, and has a Pause (WCAG 2.2.2)
    And with reduced motion it does not advance by itself

  Scenario: A section names the component it waits for
    Given a gallery whose pictures would open big on a click, or a carousel showing several slides at once
    Then its tile says which component it waits for ("placeholder: lightbox")
    And it is made of existing blocks until that component is built (RULE C)

  # ── Save a section to reuse (PS-5 (1)) ──────────────────────────────────────────────────────────────────────

  Scenario: Saving a section of my own
    Given I have selected a band I built
    When I choose "Save as my section", from its menu or with Ctrl+Alt+S
    Then a dialog asks for its name
    And after I name it "Open day banner" it is under "My sections" in the Sections group, as a live tile

  Scenario: My sections, in every site I build
    Given I saved "Open day banner" in this site
    When I open another of my sites
    Then "Open day banner" is under its "My sections" too

  Scenario: A saved section is a copy
    Given I added "Open day banner" to two pages
    When I change the words on one of them
    Then the other, and the saved one, are unchanged

  Scenario: Renaming and deleting my sections
    When I rename "Open day banner" to "Open day"
    Then its tile says "Open day"
    When I delete it
    Then a dialog asks first, and the pages already using it keep their copy

  Scenario: There is a limit, and it says so
    Given I have saved as many sections as the limit in config/sections.json
    When I save one more
    Then I am told the limit has been reached and how to make room, and nothing is lost

  # ── A global section, edited once (PS-5 (2)) ────────────────────────────────────────────────────────────────

  Scenario: Making a section global
    Given I have selected the "Admissions open" band
    When I choose "Make global", from its menu or with Ctrl+Alt+G, and name it "Admissions banner"
    Then it is marked on the canvas and in Layers by a colour, an icon and the label "Global · Admissions banner"
    And it is listed under "Global sections" in the Sections group, used on 1 page

  Scenario: Using a global section on several pages, and more than once on a page
    When I add "Admissions banner" to "Home" and twice to "Term dates"
    Then the list says it is used on 3 pages

  Scenario: One edit changes it everywhere
    Given "Admissions banner" is on 3 pages
    When I start changing its words on "Home"
    Then a notice says "This changes 3 pages" the first time
    And when I go to "Term dates" both copies there show the new words
    And one Ctrl+Z on "Home" takes the change back on every page

  Scenario: Detaching one copy to change only it
    When I choose "Detach" on the copy on "Home"
    Then it becomes an ordinary section, no longer marked
    And changing it no longer changes the other pages
    And one Ctrl+Z straight after attaches it again

  Scenario: Deleting a global section
    When I delete "Admissions banner" from the Global sections list
    Then a dialog asks first, and says how many pages use it
    And every copy on those pages stays, as an ordinary section

  Scenario: The published page is plain HTML
    When I export the site
    Then each page carries its copy of "Admissions banner" as ordinary HTML, with nothing loaded at run time

  # ── Another finish for a section already on the page (BATCH LE-15f, RF-1) ──────────────────────────────────
  # Research-check: docs/web-anatomy/layout-tiers/baseline-le15-sections.md § "Re-styling a placed section"
  # HEADED: scripts/uat/uat-le15f-headed.js (F1–F11, six windows) · scripts/uat/uat-le15f-emulator.js tablet | phone (F12)

  Scenario Outline: Choosing another finish keeps what I wrote
    Given I added the hero "Words beside a picture" in the "Calm" finish
    And I changed its title to "Open day, 12 March", replaced its photo, and added a button of my own
    When I select the section and choose the finish "<finish>" in the Inspector
    Then its type, colours, corners, shadows and motion are those of "<finish>", as a fresh "<finish>" hero would have them
    And the title still reads "Open day, 12 March", my photo is still there, and my own button is still there, as I left it
    And the canvas and the Preview show the same
    Examples:
      | finish     |
      | Wireframe  |
      | Serious    |
      | Minimalist |
      | Plain      |
      | Bold       |
      | Startup    |
      | Playful    |

  Scenario: One undo puts the old finish back
    Given I chose "Bold" for a section that was "Calm"
    When I press Ctrl+Z once
    Then the whole section is "Calm" again

  Scenario: By keyboard
    Given a ready-made section is selected
    When I press Ctrl+Alt+F
    Then it takes the next finish in the list, the Wireframe after the last
    And the Inspector's Finish names the one it now has

  Scenario: What I styled myself, and the finish never touched, stays
    Given I gave a section's plain stack a background and a title a shadow
    When I choose another finish
    Then the stack keeps its background and the title its shadow

  Scenario: What I never touched follows the finish
    Given I added the hero "Words beside a picture" as a Wireframe and changed nothing
    When I choose the finish "Startup"
    Then it has the designed words and photo a fresh "Startup" hero has, not "Title goes here" and a grey box
    And choosing the Wireframe again gives back the wireframe exactly

  Scenario: My own photo stays readable in the Wireframe
    Given I replaced the photo of the hero "Words over a full photo" with my own
    When I choose the Wireframe for it
    Then my photo stays, with its shade, and the words over it stay white

  Scenario: The canvas paints a section in the site's colours, as the page does (LE15f-2)
    Given a page holding only ready-made sections, and no design-system component
    When I look at it on the canvas, in any theme of the editor
    Then its words, bands and buttons have the site theme's colours, the same as the Preview
    And never the editor's own colours (measured: the canvas #111827 against the Preview #0f172a)

  # ── A hero on a very wide screen (BATCH LE-15h, HH-1) ─────────────────────────────────────────────────────────

  Scenario: A hero's picture stays within the screen on a very wide screen
    Given I added the hero "Words beside a picture"
    When I open the Preview on a screen 5,120 wide and 1,440 high
    Then its picture is no taller than the cap in config/sections/hero.json (75svh), cropped and never stretched
    And its words are wholly in the window
    And on a 1280 × 720 to 2560 × 1440 screen the picture keeps its own shape (the cap does not bite)
    And every hero layout with a picture carries the same cap, in every finish and in the Wireframe

  Scenario: The cap is mine to change
    Given I added a hero with a picture
    When I select its picture
    Then the Inspector shows its Max height, 75svh
    And I can change it or clear it, and the canvas and the Preview follow

  # ── The space between sections (BATCH LE-15i, SG-1 · SG-2; decided by the user 2026-10-19: "One size for all", "Every page, a switch")

  Scenario: One space above and below every section, set once for the site
    Given a page holding the hero "Words beside a picture", "Three icon points beside a photo" and a Stack band I built
    When I open Page grid and set "Space above and below sections" to 4rem
    Then every one of the three has 4rem above and below its content, on the canvas and in the Preview, at every width
    And the header and the footer keep their own space
    And "Back to the designs' own" puts each section's designed space back in one step
    And one Ctrl+Z undoes the change

  Scenario: A page can have its own
    Given the site's space between sections is 4rem
    When I choose "This page uses its own grid" on "Admissions" and set it to 2rem
    Then the sections on "Admissions" have 2rem above and below, and every other page keeps 4rem

  Scenario: One section keeps its own space
    Given the site's space between sections is 4rem
    When I select the hero and drag its top space on the canvas to 6rem
    Then the hero keeps 6rem at the top and its bottom as it was, while every other section follows the site
    And the Inspector says it keeps its own space, with "Follow the site" to give it back

  Scenario: Two sections of the same colour share their space
    Given two plain sections one under the other, each with 6rem above and below
    When I look at the page
    Then there is 6rem between their words, not 12rem
    And a section of another colour, a photo or a framed card keeps its own space on both sides
    And the canvas and the Preview draw the same space at every width

  Scenario: Sharing can be turned off
    When I turn off "Same-colour sections share their space" in Page grid
    Then two plain sections one under the other have each one's own space again

  Scenario: Only a ready-made section offers it
    When I select a section I built myself from blocks
    Then the Inspector shows no Finish
    And the finish a section remembers is never written into the published page

  # ── A new page from a template (PS-5 (3)) ───────────────────────────────────────────────────────────────────

  Scenario: Adding a page from a template
    When I choose Add page
    Then I can start from Blank, Duplicate this page, or a page template
    And the templates are live drawings of the real pages, in wireframe and designed
    And the page I add from one is a copy of it, with the site's shared header, footer and global sections

  Scenario: Saving a page as my own template
    When I choose "Save page as template" on "Admissions" and name it "Department page"
    Then "Department page" is among the templates when I next add a page
    And I can rename and delete my templates, up to the limit in config/sections.json

  # ── Every surface ──────────────────────────────────────────────────────────────────────────────────────────

  # HEADED on the emulators: scripts/uat/uat-le15-emulator.js tablet | phone (real touches, the WebView read over CDP)
  # HEADED in the browser: scripts/uat/uat-le15-headed.js (U1–U11) · scripts/uat/contrast-le15.js (every theme × finish)
  Scenario Outline: The same on the Educo app
    Given the website builder is open in the Educo app on a <device>
    Then I can open the Sections group, tap a tile to add it, save a section, make it global and add a page from a template
    Examples:
      | device |
      | tablet |
      | phone  |
