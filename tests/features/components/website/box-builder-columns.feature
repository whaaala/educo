Feature: The twelve-column grid in the Box Builder
  Phase 2 of the Layout System. A school divides a page into columns, and the same row has to mean something
  different on a phone than it does on a desktop.

  Twelve columns underneath, named fractions on top. Twelve because it divides by 2, 3, 4 and 6 — every
  fraction a page layout asks for — and named fractions on top because "Half" is what a teacher means and
  "span 6" is what CSS needs. Both decisions are the plan's own recommendations, taken 2026-09-06.

  Every control here is per-rung: set it once, override it on the device where it matters. That works with no
  extra machinery because each one is a field on the block, and `responsive` already carries block fields.

  Background:
    Given the Box Builder is open on a page
    And a row is arranged as a Grid

  # ── Picking a layout ───────────────────────────────────────────────────────

  Scenario: Picking a shape the way you insert a table
    When I click Columns in the blocks panel
    Then I can sweep a small grid to choose how many across and how many down
    And choosing 4 across by 3 down gives me twelve empty cells
    And each cell spans three of the twelve columns underneath

  Scenario: Only the counts that divide twelve are offered
    When I sweep past five columns in the picker
    Then it snaps back to four
    Because five cannot be twelfths, and a row where two cells are quietly wider is worse

  Scenario: The uneven shapes a sweep cannot express
    When I open the Columns picker
    Then Sidebar left, Sidebar right, Feature + two and Wide + narrow are offered underneath
    And every one of them fills the twelve exactly

  # ── The row ────────────────────────────────────────────────────────────────

  Scenario: The named counts sit on top of the raw twelve
    When I open Arrange on the row
    Then I see Halves, Thirds, Quarters, Sixths and Twelve as one-click choices
    And a slider underneath offers any count from 1 to 12

  Scenario: A row is full width with no padding, at every depth
    When I add a Columns block
    Then it runs the full width of the space it was given
    And it has no inner spacing until I ask for some
    And the same is true of a grid I add inside one of its cells

  Scenario: Refining a row does not move anything in it
    Given the row is cut into thirds and its three blocks each take one column
    When I change the row to twelve columns
    Then each block takes four columns
    And the row looks exactly as it did

  Scenario: A block that was never given a width does not shrink when the row is refined
    Given the row is cut into thirds and a block has no width of its own
    When I change the row to twelve columns
    Then that block is written down as four columns wide
    And it still fills the third of the row it filled before

  Scenario: Going back to a coarser row restores what was there
    Given a row of thirds was refined to twelve
    When I change it back to three columns
    Then every block has the width it started with

  Scenario: A row that cannot be re-cut exactly keeps its blocks' stored widths
    Given a row of twelve columns with a block five columns wide
    When I change the row to five columns
    Then the block's stored width is unchanged
    And the row renders it clamped to five columns rather than overflowing
    And changing back to twelve columns restores the layout

  # ── The block's width ──────────────────────────────────────────────────────

  Scenario: Picking a named fraction
    Given a row of twelve columns
    When I select a block and choose Half
    Then the block takes six of the twelve columns
    And the panel reads "6 of 12 columns"

  Scenario: A fraction the row cannot express refines the row first
    Given a row cut into thirds
    When I select a block and choose Half
    Then the row becomes twelve columns
    And the chosen block takes six of them
    And its siblings keep the thirds they had, as four columns each

  Scenario: A fraction the row cannot express is not offered on a device
    Given a row cut into thirds
    And the Phone device is selected
    Then Half is not offered
    Because a device override carries style, never the row's blocks

  # ── Offset, order, alignment, push ─────────────────────────────────────────

  Scenario: Leaving columns empty before a block
    Given a row of twelve columns and a block four columns wide
    When I set the block to start at column 9
    Then four columns are empty before it and the block sits at the right of the row

  Scenario: A start past the end of the row is clamped, not honoured
    Given a row of twelve columns and a block four columns wide
    When I set the block to start at column 11
    Then it starts at column 9 instead
    And the row does not grow wider than the page

  Scenario: The image above the words on a phone, beside them on a desktop
    Given a photo and a paragraph side by side
    And the Phone device is selected
    When I set the photo's order to -1
    Then the photo comes first on a phone
    And the order is unchanged on every other device

  Scenario: Pushing one block without moving its neighbours
    Given a row of links
    When I set the last link to Push right
    Then it sits at the far right of the row
    And every other link stays where it was

  Scenario: Where a block sits inside its own cell
    Given a row of twelve columns
    When I set the row's Position blocks to Center
    Then each block is centred in its cell instead of filling it
    And a single block can differ from the row through its own Line up (across)

  # ── Narrow screens ─────────────────────────────────────────────────────────

  Scenario: A twelve-column row stacks on a phone
    Given a row of twelve columns with blocks four columns wide
    When I preview the page on a phone
    Then the row shows one column
    And every block is full width
    And no block spills past the right edge of the screen

  Scenario: A tablet held upright gets two columns
    When I preview the page on a tablet in portrait
    Then the row shows at most two columns

  Scenario: Saying what a narrow screen should do turns the stacking off
    Given the Phone device is selected
    When I set the row to two columns
    Then the phone shows a two-up layout
    And the wider devices are unaffected

  # ── Dragging a cell's edge ─────────────────────────────────────────────────

  Scenario: The boundary between two cells is shared
    Given a row of three equal cells
    When I drag the first cell's right edge two columns to the right
    Then the first cell is two columns wider
    And its neighbour is two columns narrower
    And every other cell on the page is exactly where it was

  Scenario: A neighbour wraps rather than being squeezed into a sliver
    Given a row of three equal cells
    When I drag the first cell's right edge all the way to the page edge
    Then the first cell fills the row
    And its neighbours move to the next row at a width still worth reading
    And nothing stops dead partway

  Scenario: Dragging a cell's bottom edge sets the whole row's height
    When I drag a cell's bottom edge down
    Then every cell in that row grows to match
    And the page grows with it

  Scenario: The grabbed edge is the only one that moves
    When I drag a cell's left edge
    Then its right edge stays exactly where it was

  # ── Empty space ────────────────────────────────────────────────────────────

  Scenario: Leftover columns can be filled, but only when asked
    Given a row with columns left over
    Then nothing is shown in the empty space by default
    When I hover the row, or select something in it
    Then an "Add a block here" target appears, exactly the width of the gap
    And clicking it adds a block already spanning those columns

  # ── Nesting ────────────────────────────────────────────────────────────────

  Scenario: A cell holds whatever a page holds
    When I select a cell and add a Columns block inside it
    Then I pick its columns and rows the same way
    And I can do the same again inside one of ITS cells

  Scenario: Several layouts in one cell, each with its own spacing
    When I add two grids and a flex box inside one cell
    Then each has its own columns, rows and spacing
    And the space between them, their padding and their margins are all separate

  Scenario: Space across and space down are separate
    When I set Space across wider than Space down
    Then the columns have more air between them than the rows

  # ── Selecting ──────────────────────────────────────────────────────────────

  Scenario: Click selects the box, click again goes inside
    When I click a paragraph inside a cell
    Then the outermost box I clicked into is selected, not the paragraph
    When I click again
    Then the cell is selected
    When I press Escape
    Then the selection steps back out one level

  # ── Styling that cascades ──────────────────────────────────────────────────

  Scenario: A cell's text style reaches everything inside it
    When I set a font and a colour on a cell
    Then every heading, paragraph, list, button and component inside it follows
    And a block I style individually keeps its own look
    And the heading stays larger than the body rather than matching it

  Scenario: What does not cascade
    When I set a background, border, corners or padding on a cell
    Then those stay with the cell and are not inherited by its contents

  # ── Canvas equals export ───────────────────────────────────────────────────

  Scenario: The published page has the layout the builder showed
    Given a row of twelve columns with per-device widths, orders and offsets
    When I export the site
    Then the phone layout is the unqualified rule in the stylesheet
    And each wider rung adds only what changes from the rung below it
    And a width or order set only on a phone is actively taken back at the rung above
    And the canvas and the exported page place every block identically
