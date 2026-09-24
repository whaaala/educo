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
