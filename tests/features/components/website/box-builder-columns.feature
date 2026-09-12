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

  Scenario: Dragging a Columns block asks for its shape too
    # Dragging says WHERE a layout goes. It does not say what the layout IS, and the builder must not
    # answer that on my behalf — a dropped block used to divide the section into two cells nobody chose.
    When I drag Columns onto a section
    Then the same "Choose a layout" picker opens where I dropped it
    And nothing is added to the page until I choose a shape
    And choosing 3 across by 2 down gives me six cells, each a third of the twelve

  Scenario: Cancelling a dropped Columns block
    When I drag Columns onto a section
    And I press Escape
    Then the picker closes on the FIRST press
    And the page is exactly as it was before I dragged

  Scenario: One column across is one undivided cell
    When I drag Columns onto a section
    And I choose 1 across by 1 down
    Then I get a single cell spanning all twelve columns
    And nothing has been split

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

  # ── Sloped and curved section edges ────────────────────────────────────────

  Scenario: Shaping a section's edge
    When I open Edge shape on a section
    Then I can choose Straight, Slope right, Slope left, Curve out or Curve in
    And each choice is shown as the shape it makes, not named in a list
    And the top and bottom edges are chosen independently

  Scenario: The shape cuts the background, it does not move the content
    Given a section with a sloped top
    Then the section is exactly as tall as it was
    And its background is cut away on the deep side and painted on the shallow side

  Scenario: A depth that cannot swallow the band
    When I set the edge depth beyond its limit
    Then it is clamped, so the section always has a body left

  Scenario: It survives every screen size
    Given a section with a curved bottom
    When I view the page at any width or height
    Then the curve keeps its shape without a single media query
    Because it is expressed entirely in percentages

  # ── A section measured against the screen ──────────────────────────────────

  Scenario: A full-screen hero
    When I set a section's Screen height to Full screen
    Then it is exactly one screen tall on a desktop and on a phone
    And it never exceeds the screen, so it fits the moment the page opens

  Scenario: Half a screen
    When I set a section's Screen height to Half screen
    Then it is half the height of the visitor's screen

  Scenario: It is a floor, not a cap
    Given a full-screen section
    When its content is taller than the screen
    Then the section grows to fit the content
    And nothing is cut off

  Scenario: An empty section keeps its screen height while you build
    Given a new full-screen section with nothing in it yet
    Then it is still one screen tall
    Because a hero is empty right up until you fill it

  # ── Where a block sits — nine positions, one control ───────────────────────

  Scenario: Putting a block in a corner
    When I select a block and choose bottom-right in Position
    Then the block sits at the bottom right of its parent
    And its neighbours have not moved

  Scenario: The same nine squares mean the same thing everywhere
    Given blocks in a section, in a side-by-side row, and in a grid cell
    When I choose the same position for each
    Then each one sits in that position within its own parent
    Because the builder works out which CSS that parent needs

  Scenario: Clearing a position
    Given a block placed bottom-left
    When I click bottom-left again
    Then the block goes back to sitting where the layout puts it

  Scenario: One axis at a time
    When I set only the across position
    Then the down position is left alone rather than being guessed

  Scenario: Inside a grid, a block is positioned within its own cell
    Given a block that takes four of the twelve columns
    When I choose right in Position
    Then it sits at the right of those four columns
    And to move it across the whole row I change its width or its start column

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

  Scenario: Wrapping is not a resize — the neighbour keeps its width
    # Stamping a minimum width over the neighbour destroys the only record of how wide it was, and there
    # is then no way to put the row back.
    Given two cells side by side
    When I drag the first cell's right edge far enough that the second wraps
    Then the second cell is on the next row at the width it already had

  Scenario: Shrinking the dragged cell brings a wrapped neighbour back
    Given a first cell filling the row and its neighbour wrapped below it
    When I drag the first cell's right edge back to the left
    Then the neighbour returns to the same row
    And it widens by exactly what the first cell gave up
    And the row fills the twelve columns again

  Scenario: Dragging out and back leaves the row exactly as it was
    # Every pointer position gives ONE answer, whichever direction it was reached from — no running totals.
    Given two equal cells
    When I drag the first cell's right edge out past the wrap point and back to where it started
    Then both cells are the width they began at

  Scenario: Dragging a cell's bottom edge sets the whole row's height
    When I drag a cell's bottom edge down
    Then every cell in that row grows to match
    And the page grows with it

  Scenario: The grabbed edge is the only one that moves
    When I drag a cell's left edge
    Then its right edge stays exactly where it was

  # ── The grabbed edge, on all four sides ───────────────────────────────────
  # Reported as three faults at once — stepped, laggy, and landing somewhere other than where the pointer was
  # let go. They were one fault: the drag wrote a SIZE and left a partner to absorb the difference, and where
  # the partner could not, the size grew out of the FAR edge instead.

  Scenario: Dragging the left edge takes room from the cell before it
    Given a row of four cells
    When I drag the second cell's left edge leftwards
    Then the cell before it gives up exactly that much room
    And my cell's right edge has not moved at all

  Scenario: The left edge stops when there is no more room to take
    Given the cell before mine is already as narrow as it can be
    When I keep dragging leftwards
    Then my cell simply stops growing
    And its right edge is still exactly where it was

  Scenario: Dragging the top edge moves the boundary between two rows
    When I drag a cell's top edge upwards
    Then the row above gives back exactly what this row takes
    And this row's bottom edge does not move

  Scenario: The top edge stops when the row above has nothing to give
    Given the row above is already only as tall as the things in it
    When I drag my cell's top edge upwards
    Then nothing is pushed downwards to make room
    And my cell's bottom edge is still exactly where it was

  # ── A drag is one gesture ─────────────────────────────────────────────────

  Scenario: What the drag shows is what letting go commits
    When I drag a cell's edge and hold the pointer still
    Then the canvas is already showing the result
    And letting go leaves the page exactly as it was being shown

  Scenario: One drag, one undo
    When I drag a cell's edge right across the page and let go
    And I press Ctrl+Z once
    Then the whole drag is undone, not one frame of it

  Scenario: A drag does not re-save the site on every pointer move
    When I drag a cell's edge
    Then the page is written to storage once, when I let go

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

  Scenario: Spacing is swept, not typed
    Given I have selected a grid
    Then Space across and Space down are sliders, like the spacing control above them
    And sweeping one changes the canvas as I sweep

  Scenario: An axis follows the shared spacing until it is given one of its own
    Then each axis says it is matching "Space between blocks"
    When I sweep one of them
    Then that axis has a value of its own
    And it offers to go back to matching the shared spacing
    When I take that offer
    Then it follows the shared spacing again

  Scenario: One sweep, one undo
    When I sweep a spacing slider from nothing to wide open
    And I press Ctrl+Z once — with the slider still focused
    Then the whole sweep is undone

  Scenario: Two different controls are two separate acts
    When I sweep Space across and then immediately sweep Space down
    And I press Ctrl+Z once
    Then only the second sweep is undone

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

  # ── Row heights: even, or following the picture (masonry) ──────────────────

  Scenario: Every row that exists is unchanged
    Given a grid saved before Row heights existed
    Then it renders exactly as it always has
    And the control shows "Even", because that is what it has always been doing

  Scenario: Pictures of different shapes stagger instead of being cropped
    Given a row of photographs of different shapes
    When I set Row heights to "Follow the picture"
    Then each block is as tall as what is inside it
    And a block below fills the first gap that opens up rather than waiting for the tallest
    And nothing is cropped and no two blocks in a column overlap

  Scenario: The columns keep working
    When Row heights is "Follow the picture"
    Then column widths, offsets, order and per-device settings all behave as before
    And the blocks still read in the order I put them in

  Scenario: There are no rows to be tall in
    When Row heights is "Follow the picture"
    Then "Rows tall" and "Start at row" are not offered on a cell in that row
    And the row's height cannot be dragged, because the track is a measuring unit

  Scenario: The space I asked for is the space I get
    Given Row heights is "Follow the picture"
    When I set Space down
    Then that is the space beneath each block
    And Space across still separates the columns independently

  Scenario: On a phone it is a plain stack
    Given Row heights is "Follow the picture"
    When I look at the page on a phone
    Then the blocks stack in one column, as any row does
    And no measuring unit is used, because one column has nothing to stagger

  Scenario: Blocks whose height cannot be known
    Given a row of cards or captions rather than photographs
    When Row heights is "Follow the picture"
    Then each block is given a sensible shape rather than collapsing to a sliver
    And the panel offers "Measure on the page" for an exact result

  Scenario: Measuring on the page
    Given "Measure on the page" is ticked
    When I publish the site
    Then a small script measures the real heights and sets the spacing exactly
    And it re-measures when the window resizes, the fonts load and the photographs arrive
    And with scripting switched off the page still staggers and still never crops

  Scenario: Nothing is published unless it was asked for
    Given "Measure on the page" is not ticked
    When I publish the site
    Then no script is included at all

  Scenario: Going back to Even puts every pixel back
    When I set Row heights to "Follow the picture" and then back to "Even"
    Then the layout is exactly what it was
    And the saved page carries no trace of the setting

  # ── What masonry uncovered ────────────────────────────────────────────────

  Scenario: The editor's page column is the width the device chip asks for
    Given my browser window is much wider than the size I am previewing
    When I pick a preview size and look at a section set to the page column
    Then the column is the width a visitor at that size gets, not the width of my window

  Scenario: An icon-only button says what it is
    Then every preview-size button has a name a screen reader can announce

  # ── Show one at a time — a pager, as a MODE on any box ────────────────────
  # Decided rather than built as a Gallery component: a component's content is a flat item (title, body,
  # one media URL) with no box in it, so a page could never be something you design — and inside one the
  # twelve columns, the spans, the offsets and every other control would stop applying.

  Scenario: Any box can show one thing at a time
    Given I have selected a box with several blocks in it
    When I tick "Show one at a time"
    Then each block inside becomes a page that fills the box
    And a visitor swipes between them on a phone
    And the arrow keys move one page at a time once the strip has focus
    And none of that needs any code on my site

  Scenario: A page is an ordinary box
    Then I can give one page a photo, another a headline over a photo, another a whole layout
    And every control in this panel still works inside a page

  Scenario: Turning it on does not leave half the old shape behind
    Given the box was a twelve-column grid
    When I tick "Show one at a time"
    Then the old column spans are ignored rather than re-fitted

  Scenario: The dots are real links to real pages
    Then every page has its own address
    And a bookmark I set on a page is the address that is used
    And clicking a dot moves the strip WITHOUT scrolling the rest of the page
    # A bare anchor link does nudge it — measured at 240px even with the strip fully in view, because a
    # fragment navigation scrolls every scrollable ancestor. scroll-margin-block does not suppress it.

  Scenario: Arrows need the script, so they never appear pretending to work
    Given I choose "Arrows"
    Then a visitor whose browser runs no script still gets dots to use
    And once the script runs, the arrows appear and the dots step aside

  Scenario: Which page you are on is announced, not only coloured
    Then the current dot is marked for a screen reader as well as shaded

  Scenario: Nothing is added to my site unless it is needed
    Given I choose "None" and leave it to the visitor to move
    Then the published page contains no script at all

  # ── Moving on its own ─────────────────────────────────────────────────────

  Scenario: It does not move on its own unless I ask
    Then "Move on its own every" starts at off

  Scenario: It holds still while somebody is reading it
    Given it moves on its own every few seconds
    When a visitor hovers it, or tabs into it with a keyboard
    Then it stops until they leave
    # WCAG 2.2.2 — something moving that a reader cannot hold still to read is a failure.

  Scenario: It never moves for a visitor who asked for less motion
    Given a visitor whose device asks for reduced motion
    Then it does not advance by itself
    And the scrolling is not animated either
    # CSS does not do that second one for us: smooth stays smooth under reduced motion unless a rule says
    # otherwise.

  # ── The tiles built on it ─────────────────────────────────────────────────

  Scenario: A slider is photos one at a time
    When I add a Slider and choose my photos
    Then I get one page per photo, with dots to move between them

  Scenario: A hero is one screen with a headline over a photo
    When I add a Hero, choose a photo and type a headline
    Then the section is exactly one screen tall
    And the words are legible over the photo whatever photo I chose
    # Asserted against a pure WHITE photograph, which is the worst case: the scrim is strong enough that
    # white text still reaches 4.5:1. The first version shipped at 2.43:1.

  Scenario: A rotating hero is several of those, in turn
    When I add a Rotating hero and choose my photos
    Then each page is its own full screen with its own words
    And I edit the second one's words on the canvas like any other block
