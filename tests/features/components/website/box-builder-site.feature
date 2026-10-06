Feature: Box Builder — multi-page site, preview & export
  As a website designer using the Box Builder
  I want multiple pages, a visitor preview, links between pages, and an HTML export
  So that the box engine produces an actual website, not just one isolated canvas

  Background:
    Given the Box Builder loads a SITE — an ordered list of pages, each its own box tree, with one home page
    And an old single-tree document is migrated to a one-page site on load

  # ── Pages ──
  Scenario: Add, switch, rename, duplicate, set-home and delete pages
    When I add a page, it appears as a new tab with a unique slug and becomes active
    And clicking a page tab switches the canvas to that page (selection clears)
    And the page-settings popover renames it (re-slugged), duplicates it, sets it as home, or deletes it
    And the last remaining page can never be deleted; deleting the home page reassigns home

  Scenario: Each page has its own undo history within the site, saved together
    When I edit one page then switch to another
    Then each page keeps its own content
    And the whole site (all pages, home, slugs) persists to localStorage and reloads

  # ── Links between pages ──
  Scenario: Link a button to another page
    Given a Button element
    When I choose another page in the "Link to a page" picker (the current page is excluded)
    Then its link becomes "page:<id>"

  # ── Preview ──
  Scenario: Visitor preview
    When I click Preview
    Then the page renders with no editor chrome (no toolbars, handles or inspector) in the chosen device frame
    And a top nav lists the pages; clicking a page link (or a "page:" button) navigates between them
    And "#anchor" links scroll within the page
    And Exit preview returns to the editor

  # ── The preview gives the page the width it promises ──────────────────────
  # tests/e2e/preview-viewport.spec.ts

  Scenario Outline: The chosen screen is the size the page is laid out at
    When I choose <screen> in the preview
    Then the page inside is laid out at <width> by <height> pixels
    And the size it is being shown at is stated in the bar

    Examples: this site's own rungs
      | screen  | width | height |
      | Mobile  | 375   | 812    |
      | Tablet  | 768   | 1024   |
      | Laptop  | 1024  | 768    |
      | Desktop | 1280  | 800    |
      | Wide    | 1920  | 1080   |

    Examples: real devices, by name — sixty of them, named with their generation and size
      | screen                          | width | height |
      | iPhone SE (3rd gen)             | 375   | 667    |
      | iPad mini (2019) · iPad 6       | 768   | 1024   |

  Scenario: A screen bigger than my own
    When I choose a size my screen cannot fit
    Then the page is still laid out at that full size
    And it is scaled down to fit, with the zoom stated
    And it still sits inside the stage's padding, as a card with edges
    And it is never cut off, and never re-laid out smaller
    Because globals.css carries an unlayered `iframe { max-width: 100% }` that beats
      every utility on the element, so the frame was silently clamped to the space
      free — 1920 became 1392, and the page inside picked the desktop rung instead
      of the big-desktop one while the label still said Wide

  Scenario: A screen that does fit
    When I choose a size my screen can fit
    Then it is shown at its true size with no zoom claimed

  Scenario: Turning the screen on its side
    When I rotate the preview
    Then the width and the height swap over
    And rotating back lands on exactly the numbers I started with
    Because rotation is a VIEW of the size, never a write to it — a size that is
      rewritten each turn drifts, and the preset stops being recognisable

  Scenario: Typing an exact size
    When I type a width into the bar
    Then the page is laid out at exactly that
    And the preset it no longer matches stops claiming to be selected

  # ── The controls stay where I can reach them ──────────────────────────────
  # tests/e2e/preview-viewport.spec.ts — "the preview controls do not run away"

  Scenario: The controls do not leave on their own
    Given I am previewing
    When I leave the preview alone for several seconds
    Then the controls are still on the screen
    Because two attempts to make the bar "get out of the way" by itself both made
      it unreachable: a timer that fired while the sixty-device menu was open and
      being read, and a pointer-leave that took the whole strip away the instant a
      device was chosen — the menu is portalled out of the bar, so choosing from it
      counts as leaving it

  Scenario: Choosing a screen leaves the next control usable
    When I choose a device from the menu
    Then I can rotate it straight afterwards without hunting for the bar

  Scenario: Hiding the controls, and getting them back
    When I press Hide, or the H key
    Then the bar steps aside and the page has the whole window
    And a labelled handle stays on the screen to bring it back
    And H brings it back too, from wherever I am
    Because a bar slid off the top of the window is still "visible" to the code and
      completely unreachable to a person — so the way back is a real button, never a
      region of the page you have to know to wave the pointer at

  Scenario: The shortcut still works after I click the page I am previewing
    Given I have clicked inside the previewed page
    When I press H
    Then the controls still toggle
    Because the preview is an iframe: once focus is inside it, a key press never
      reaches the editor's own document

  Scenario: Typing a width is typing, not a shortcut
    Given the cursor is in the width box
    When I type the letter H
    Then the controls do not move

  # ── The EDITOR canvas on a real screen (#48 · #49) ────────────────────────
  # tests/unit/zoom-of.test.ts · tests/unit/mirror-box-churn.test.ts · scripts/uat/ (headed, real window sizes)

  Scenario: A canvas size wider than the room is shrunk to fit, like the preview
    Given my screen is 1536 by 864 and the Inspector is open
    When I choose the Desktop 1280 canvas
    Then the whole page is visible beside the panels, with no sideways scroll
    And the zoom reads "Fit" with the percentage it is shown at
    And the page is still laid out at 1280 — the same rung, the same layout that publishes
    Because it used to run on under the Inspector: the right of the page could not be
      seen, and its handles were painted on top of the Inspector

  Scenario: The size I drag is the size I get, even when the canvas is shrunk
    Given the canvas is fitted to screen at less than 100%
    When I drag an edge, a grid cell, a floating block or a floating item
    Then what is stored is the size on the page, not the smaller size on my screen
    And the same drag at 100% and at the fitted size ends at the same place on the page

  # ── Zooming the editor canvas (BATCH Z-1, approved 2026-10-01) ─────────────
  # tests/unit/canvas-zoom.test.ts · tests/e2e/canvas-zoom.spec.ts · scripts/uat/probe-z1.js (headed)
  # Research: docs/web-anatomy/editor-zoom.md (Figma, Canva, Webflow, Framer)

  Scenario: Zooming in to reach a column too thin to work in
    Given a column a few dozen pixels wide on the fitted canvas
    When I press + beside the device buttons until it reads 200%
    Then the page is drawn twice as large and scrolls both ways
    And I can drop a block into the column, select it and drag its edge
    And what is stored is the size on the page, the same as at 100%

  Scenario: The zoom controls
    Then beside the device buttons there is a minus button, a readout and a plus button
    And the readout says "Fit · 55%" while fitted and the percentage otherwise
    When I open the readout
    Then I can choose Fit, 50, 75, 100, 150, 200 or 400%, or Zoom to selection
    And minus stops at 25% and plus at 400%
    And every control has a name a screen reader says, and works from the keyboard

  Scenario Outline: Zoom shortcuts work on the canvas and leave the browser's zoom alone elsewhere
    Given the pointer is <where>
    When I press <keys>
    Then <result>
    Examples:
      | where                 | keys      | result                                   |
      | on the canvas         | Ctrl +    | the canvas zooms in one step             |
      | on the canvas         | Ctrl −    | the canvas zooms out one step            |
      | on the canvas         | Ctrl 0    | the canvas is at 100%                    |
      | on the canvas         | Shift 1   | the canvas is fitted to the screen       |
      | on the canvas         | Shift 2   | the selected block fills the view        |
      | over the Inspector    | Ctrl +    | the browser zooms the whole builder      |
      | typing in a text block| Shift 1   | a "!" is typed and nothing zooms         |

  Scenario: Ctrl + scroll zooms around the pointer
    When I hold Ctrl and scroll over a heading on the canvas
    Then the canvas zooms and the heading stays under the pointer
    And scrolling without Ctrl still scrolls the page

  Scenario: Moving around a zoomed page
    Given the canvas is at 400%
    Then I can scroll to all four edges of the page
    And holding Space or the middle button and dragging moves the view
    And a space typed into a text block is still a space

  Scenario: The editor's own controls stay the same size at every zoom
    When the canvas is at 25%, 100% or 400%
    Then the handles, the block toolbar, an item's toolbar and the drop marker are the same size on screen
    And their buttons are never smaller than 24 pixels
    Because at 55% an item's toolbar buttons were 15 pixels (Z1-d)

  Scenario: The zoom is mine, not the page's
    Given I zoomed the Desktop canvas to 150%
    When I reload the builder
    Then the Desktop canvas is still at 150%
    When I switch to Mobile
    Then it is fitted again
    And neither the saved site nor the published page contains any zoom
    And the Preview is exactly as it was

  Scenario: A block held on screen holds at any zoom (Z1-a)
    Given a block set to float on screen
    When the canvas is fitted below 100% and I scroll it
    Then the block does not move on the screen
    Because it slid 180 pixels at Wide, fitted to 55%, over a 400 pixel scroll

  Scenario: An item's ring stays on the item at any zoom (Z1-b)
    Given an Accordion on the canvas fitted below 100%
    When I click one of its items
    Then the ring is drawn exactly round that item and its toolbar sits beside it
    Because at Wide the ring was 142 pixels too narrow and the toolbar covered the item

  Scenario Outline: The canvas lays the page out exactly as the Preview does, at any zoom (L-2, e-4)
    Given a header whose menu hugs its four links "About", "Admissions", "News" and "Contact"
    When the canvas shows <device> at <zoom>
    Then the four links sit on one line on the canvas, as they do in the Preview
    Because drawn with CSS zoom the canvas laid the page out in shrunken sub-pixels and wrapped "Contact"
    Examples:
      | device  | zoom |
      | Wide    | Fit  |
      | Wide    | 50%  |
      | Wide    | 75%  |
      | Desktop | 50%  |
      | Desktop | 75%  |

  Scenario: A line of one column has no gutter, so a hugging menu never comes up short (L2-b)
    Given a menu that hugs its links inside a column of its own
    When the published page is opened at any width from 1024 to 1920
    Then "Contact" stays on the line with the other links
    Because the gutter reached out and back for a single column, and each step rounded, at 7 of 20 widths

  Scenario: A page header spreads across the page (L2-d)
    Given I give a block holding a logo, a menu and a button the meaning "Page header"
    Then its line is set to "Spread out": the logo at the left edge, the button at the right edge
    And "Position in row" shows "Spread", and I can set it back to "Left"
    And a line I set to "Left" myself stays where I put it
    And a page footer spreads the same way

  Scenario: A block's handles never draw outside the canvas
    When a selected block is scrolled under the toolbar or beside the Inspector
    Then its handles and toolbar are cut off at the edge of the canvas
    And nothing of the canvas is ever painted over the Inspector or the toolbar

  Scenario: On a phone the Inspector slides over the page instead of squeezing it
    Given the builder is open in a phone-sized window
    Then the page has the whole width and the Inspector starts closed
    When I open the Inspector from its rail
    Then it slides over the page
    And Escape or its close button puts it away again
    Because it was a fixed 22rem column: on a 393px phone the page was left 41px, less
      its padding — nothing to click, under an Inspector saying "click a block to edit it"

  Scenario: Choosing a zoom myself
    When I pick an explicit percentage instead of "Fit to window"
    Then it is obeyed exactly, and the stage scrolls if it overflows
    And the page still gets the full size it was promised

  Scenario: Responsive
    When I choose Responsive
    Then the frame simply fills the window
    And the size, zoom and rotate controls stand down, having nothing to act on

  # ── Export ──
  # tests/unit/multipage-export.test.ts
  Scenario: Export the site to static HTML
    When I click Export
    Then the site downloads as a ZIP holding one ".html" per page plus a shared "styles.css"
    And the home page is "index.html", so a plain folder or a static host just works
    And every link is relative, so it opens from a folder or a USB stick too
    And each page carries its own <title>
    And text is escaped, hidden boxes are omitted, and each page carries only the CSS it uses
    And publishing/hosting is explicitly deferred to later

  Scenario: Nothing is injected above an exported page
    Then each page is exactly what the user designed, with no builder navigation prepended
    And a block whose destination is "page:<id>" resolves to that page's relative filename
    Because navigation is BUILT, not imposed — the old bar could not be styled, moved
      or removed, and on a one-page site it was a lone bold "Home" that read as a
      stray heading nobody had typed

  # ── Responsive / accessible ──
  Scenario: Pages, preview and export respect the breakpoint model and accessibility
    Then the EDITOR's own device switcher drives the active breakpoint for editing
    And choosing a screen in the preview changes nothing outside the preview
    Because looking is not editing — previewing a phone must not silently re-point
      which per-device layer the next edit lands on
    And the page tabs, the settings popover, and every control in the preview bar
      — size, width, height, zoom and rotate — expose aria labels and are keyboard reachable
    And the size being previewed is announced, not only drawn

  Scenario: Zooming past the window
    When I zoom the preview larger than the space it has
    Then I can scroll to every part of it
    Because a centred flex item wider than its container overflows BOTH sides, and the
      start-side overflow of a scroll container can never be reached — 560px of the
      page sat off the left with no way to get to it, which reads as the zoom doing
      nothing at all

  # ── A page shorter than the screen ────────────────────────────────────────
  # tests/unit/document-edge.test.ts · tests/e2e/every-screen-size.spec.ts

  Scenario: A short page ends in its own colour, not in a slab of white
    Given a page whose content does not fill the visitor's screen
    When they open it on any device
    Then the space below the content is the colour of the band that ends the page
    And nothing has been stretched, inserted or reserved to achieve it
    Because a white void under a dark footer reads as an empty block the person
      never added. Measured on an iPad Pro 11: content ended at 410px and 800
      pixels of white followed — two thirds of the screen. Painting the document
      the page's own closing colour costs no element, no height and no setting,
      and is invisible on any page taller than the screen.

  Scenario: A gradient is not repeated below the page
    Given the last band is painted with a gradient
    Then nothing is emitted and the browser default stands
    Because re-drawing the whole gradient under the content would be adding
      something, which is the one thing this must not do

  Scenario: Starting the whole site over asks first, and can be undone
    Given a site with two pages
    When the person clicks Reset
    Then a dialog asks "Start the whole site over?" and nothing has changed yet
    When they cancel
    Then both pages are still there
    When they click Reset and choose "Start over"
    Then the site is one starter page
    When they press Ctrl+Z
    Then both pages are back
    Because Reset replaced every page AND emptied the undo history in one click,
      with no question asked — a mis-click lost the whole site for good (D3-16)
