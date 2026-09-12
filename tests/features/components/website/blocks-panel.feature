Feature: A floating Blocks panel — modern, spacious, out of the way
  As a teacher building a school website
  I want the insert palette to be a floating panel I open from a launcher icon
  So that the canvas keeps its full width and adding blocks feels modern and uncluttered

  Background:
    Given the Box Builder is open

  # ── Launcher + open/close ──
  Scenario: The panel is closed by default, showing only a compact launcher tucked in the gutter
    Then only a small "Blocks" launcher icon is visible near the canvas top-left
    And it is compact, so it tucks into the gutter beside the page rather than covering the page content
    And the canvas keeps its full width beneath it

  Scenario: Clicking the launcher opens the floating panel over the canvas
    When I click the Blocks launcher
    Then the floating panel appears on top of the canvas (it does not push the canvas)
    And it shows a search box, category tabs, and the block tiles

  Scenario Outline: The panel closes without adding anything
    Given the Blocks panel is open
    When I "<action>"
    Then the panel closes and the compact launcher is shown again

    Examples:
      | action                  |
      | click the close (✕)     |
      | press Escape            |
      | click outside the panel |
      | press B                 |

  # ── Keyboard ──
  Scenario: Keyboard toggles the panel and focuses search
    When I press "B"
    Then the panel opens
    When I press "B" again
    Then the panel closes
    When I press "/"
    Then the panel opens with the search box focused

  # ── Search ──
  Scenario: Searching filters the block tiles live
    Given the Blocks panel is open
    When I type "card" into the search box
    Then only blocks whose name or hint matches "card" are shown
    And a friendly empty state appears when nothing matches

  # ── Category tabs ──
  Scenario: Category tabs jump to a group
    Given the Blocks panel is open
    When I click the "Media" tab
    Then only the Media blocks (Image, Video, Icon, Embed) are shown

  # ── Adding still works (drag + click-to-style) ──
  Scenario: A block still adds by click, and composite/style pickers still work
    Given the Blocks panel is open
    When I click a block tile
    Then it adds the block (composites add directly; styled blocks open the portaled variation picker)
    And the panel stays open so I can add several blocks

  Scenario: A block tile is still draggable onto the page
    Given the Blocks panel is open
    Then each tile is draggable and sets the palette block type on drag start

  # ── Naming: the three layout blocks are ONE object in three arrangements ──
  # They were Section / Columns / Row, and UAT found four problems with that in one sitting:
  # "Section" also named the top bar's tinted band (a different thing); this tile's hint described that
  # band rather than the tile; "Columns" named a picker that sweeps across AND down; and the three names
  # gave a reader no way to tell them apart. They are the same node — Arrange as switches between them in
  # one click — so each is named for the arrangement it produces.
  Scenario: The layout blocks are named for what they do, and ordered the same way
    Given the Blocks panel is open
    Then the Layout group offers "Stack", then "Side by side", then "Grid"
    And "Stack" is described as "Blocks one under the other"
    And "Side by side" is described as "Blocks in a row, across the page"
    And "Grid" is described as "Sweep across and down. Widths line up across the whole page."
    And no tile is called "Section", because the top bar already uses that idea for something else

  Scenario: The top bar adds a BAND, and says so
    Then the top bar's primary button reads "Add a band"
    And it creates a tinted, full-width, padded strip
    And that is a different result from the "Stack" tile, which adds a plain transparent box

  Scenario Outline: A container is called the same thing everywhere it is named
    # The inspector, the drag preview and the palette each used to compute this themselves, which is how
    # they drifted. One resolver now answers for all three.
    Given a container arranged "<arrangement>"
    Then the inspector titles it "<name>"
    And dragging it shows "<name>" on the preview

    Examples:
      | arrangement   | name         |
      | column        | Stack        |
      | row           | Side by side |
      | grid          | Grid         |

  # ── Design ──
  Scenario: The panel has a modern, spacious look
    Given the Blocks panel is open
    Then it is a rounded, shadowed, translucent card with generous spacing
    And each tile shows the icon in a tinted rounded square, the name, and a one-line hint
