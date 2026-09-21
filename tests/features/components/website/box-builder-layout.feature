Feature: Placing blocks beside one another in the Box Builder
  Where a block LANDS when you drop it — beside what is already there, or on a new line beneath it.

  A page is built by putting one thing next to another, so the moment a block is narrower than its band there
  is empty space beside it, and a person will aim at that space. The builder has to read that aim correctly,
  say so before the mouse is released, and then do what it said.

  The rule underneath, and it is the same one edge-anchored resize follows: a block arriving beside yours
  takes the EMPTY space, never space out of the block you already sized. A drop that renormalises the row
  silently shrinks something the user chose, and nothing on screen explains why it moved.

  Background:
    Given the Box Builder is open on a page
    And a band holds one Stack across half its width, leaving an opening beside it

  # ── Reading the aim ────────────────────────────────────────────────────────

  Scenario: The whole opening accepts a side-by-side drop, not just its edge
    When I hold a Stack over the middle of the empty space beside the first one
    Then the insertion line is drawn vertically
    And a vertical line means the block will land beside, not below
    Because the opening is hundreds of pixels wide, and aiming at a thin strip of it is not a thing a
    person can be asked to do

  Scenario: The line says what will happen before I let go
    When I hold a Stack over the middle of the empty space beside the first one
    Then the line I am shown is the placement I get when I release
    Because an indicator that shows one thing and does another is worse than no indicator

  Scenario: Aiming below the block still means below
    Given the band has floor beneath the Stack
    When I hold a Stack over that floor, below the first one
    Then the insertion line is drawn horizontally
    And releasing there puts the block on its own line
    Because if every drop near a block became side-by-side, the builder could no longer stack anything

  Scenario: Dropping below a side-by-side band makes a NEW band
    Given a side-by-side band, which lays its children out in a row whatever I meant
    When I drop a block below it
    Then a new full-width band is created underneath, and the band above is left alone
    Because a row band can only honour "below" by making a new line —
      inserting into it would put the block beside the others, which is what the indicator did NOT say

  Scenario: The placement I was shown is the placement I get
    When the indicator draws a horizontal line
    Then the block lands on its own line, never beside
    Because the builder promising one placement and delivering another is worse than either placement

  # ── What the drop actually does ────────────────────────────────────────────

  Scenario: The block lands beside the one already there
    When I drop a Stack into the empty space beside the first one
    Then both blocks share a row
    And the new block starts at or after the first one's right edge

  Scenario: The newcomer takes the leftover space
    When I drop a Stack into the empty space beside the first one
    Then the new block is given the width the line had left over
    And the two widths together fill the band without exceeding it
    And the page does not scroll sideways

  Scenario: The block already there is not resized to make room
    When I drop a Stack into the empty space beside the first one
    Then the first Stack still has the width it had before
    Because it was dropped into empty space — there was nothing to take from it
    And a row that renormalises on every drop moves blocks the user never touched

  # ── A block you add is a block you can see ─────────────────────────────────

  Scenario: Adding blocks into a stack you have already sized
    Given a stack that has been given a height
    When I add six blocks into it, one at a time
    Then every one of them is still tall enough to see and to grab
    And the stack grows to hold them rather than squeezing them smaller
    Because a block is covered entirely by its own eight resize handles at around 26px,
      so there is nothing left to click that is not a handle

  Scenario: The block already there keeps the size I gave it
    Given blocks I have deliberately made very short
    When they have to share a stack between them
    Then they stay the size I set, and are not raised to the floor
    Because the floor is for boxes nobody has sized — a decision always wins

  Scenario: A stack nobody has sized behaves exactly as it always did
    Given a stack with no height of its own
    When I add blocks into it
    Then each one arrives at its full courtesy height and the stack grows
    Because this case was never broken, and the fix must not change it

  Scenario: A block with no width is as unusable as one with no height
    Given a side-by-side row holding blocks that have no width of their own
    Then each of them is still wide enough to see and to grab

  # ── Why this is asserted the way it is ─────────────────────────────────────

  Scenario: The bug lived only in the state a user actually reaches
    Given every earlier test for empty blocks used a stack nobody had sized
    Then all of them passed while six blocks in a sized stack collapsed to 26px
    Because the defect appears only after someone resizes something,
      which is to say: in the normal state, not the fresh one


  Scenario: Sharing a row is not on its own proof of anything
    Given a band lays its children out in a row because it is a row
    Then "they share a row" stays true even when the side-by-side reading is switched off
    And only the WIDTHS tell the two apart — 50 and 50 when the empty space is used,
      33 and 67 when the row renormalises instead
    Because a guard that passes with the behaviour broken is not a guard


  # ── The selection chrome follows the block ────────────────────────────────
  # tests/e2e/chrome-follows-resize.spec.ts · tests/unit/mirror-box-churn.test.ts

  Scenario: Dragging an edge, however far
    Given a block I have selected
    When I drag its right edge five hundred pixels across
    Then the handle stays on the edge the whole way, not just at the end
    And the toolbar stays on the block rather than hanging over empty canvas

  Scenario: The chrome comes back if it ever falls behind
    Given a drag driven faster than the browser can draw frames
    Then the chrome may sit one frame behind, because a frame that has not happened cannot be drawn
    But the gap stays the size of one movement however long the drag runs
    And the moment I stop, the chrome is on the block again

  Scenario: A layout that argues with itself is still given up on
    Given a layout whose measurement never settles
    Then the chrome stops chasing it after a bounded number of frames
    And it keeps the last rectangle it had rather than taking the page down
    Because "Maximum update depth exceeded" came out of that chase, twice

  # ── Why this is asserted the way it is ─────────────────────────────────────

  Scenario: A drag is not tested by its result alone
    Given the resize tests drag this very handle twelve steps and check the stored width
    Then they passed while the handles froze after eight, stranded 415px from the block
    Because the resize was never wrong — what the user was LOOKING AT was


  # ── A dropped block takes the room it lands in ────────────────────────────
  # tests/e2e/dropped-block-fills-space.spec.ts

  Scenario: Dropping a block into a box with room in it
    Given a section I have given a height of 400 pixels
    When I drag a Stack into it
    Then the Stack is 400 pixels tall, not 40
    Because I pointed at the space, and the space is what I meant

  Scenario: Dropping a block into a grid cell
    Given a grid with a height, whose rows hand each cell a share of it
    When I drop a block into one of those cells
    Then it fills the cell, though the cell stores no height of its own
    And neither the cell nor its neighbour changes size to accommodate it

  Scenario: A grid nobody has given a height to
    Given a grid with no height of its own, so its rows have nothing to share
    When I drop a block into a cell
    Then it takes the 8rem courtesy height, not a share of a height nobody gave
    And never more than the cell holding it

  Scenario: A size I set is never overruled by the fill
    Given a block I have given a height of 90 pixels
    When it sits in a section 400 pixels tall
    Then it is 90 pixels tall
    Because a decision always beats a courtesy

  # ── The top and bottom edges do not move each other ───────────────────────
  # tests/e2e/vertical-edges-anchored.spec.ts

  Scenario: Dragging the top edge of a block at the very top of the page
    When I drag its top edge upward
    Then the top edge stops, because there is nowhere above the page for it to go
    And the bottom edge does not move at all
    Because growing the other end is a different gesture from the one I am making

  Scenario: Dragging the top edge of a cell in the second row
    When I drag its top edge up
    Then the top edge follows me and the bottom edge stays exactly where it was
    And the row above gives back precisely what this row takes

  Scenario: Dragging the top edge after something has been dropped in the row above
    Given the row above holds a block that fills it
    When I drag this row's top edge up
    Then it still moves
    Because a block that fills its box answers with the BOX's height when asked
      how tall its content is, which made the slack nought and the edge dead

  # ── Two stacks that touch share the boundary between them ──────────────────
  # tests/e2e/vertical-edges-anchored.spec.ts

  Scenario: Reducing the last stack on the page
    Given two stacks that touch, one above the other
    When I drag the lower one's top edge down to make it shorter
    Then the stack above grows by exactly what this one gave up
    And no white space is left between them
    And the bottom edge does not move
    Because the boundary between two blocks belongs to both of them,
      the same bargain the left and right edges have always struck

  Scenario: Reducing the last stack from its bottom edge
    Given two stacks that touch, one above the other
    When I drag the lower one's bottom edge up
    Then only the bottom moves, and the stack above stays exactly where it is
    And no hole opens above it
    Because the anchor used to measure this block's margin from the PAGE's top
      rather than from where flow had already put it, so the block teleported
      down by the whole height above it before the pointer had moved at all

  Scenario: Growing the lower stack into the one above
    Given two stacks that touch, one above the other
    When I drag the lower one's top edge up
    Then the stack above gives back exactly what this one takes
    And the bottom edge never moves

  Scenario: Dragging further than the stack above can give
    When I drag the top edge far past what the stack above owns
    Then the edge stops at the boundary
    And the stack above keeps a usable minimum rather than vanishing
    Because where the partner cannot give, the edge stops — it never grows
      out of the far side instead

  Scenario: The block above is in its own band
    Given the builder gives every top-level block its own band
    And the stack above is therefore an only child in the band before this one
    When I drag the lower stack's top edge
    Then the stack above still gives back what this one takes
    Because a sibling-only lookup finds nothing in the shape a real page has,
      so the boundary is followed up through the wrapper and back down to the
      block that actually owns the height — a band hugs its child, so writing
      the height to the band alone could grow it but never shrink it

  Scenario: A stack with space deliberately left above it
    Given I have given the lower stack outer spacing on its top
    When I drag its top edge down
    Then the edge goes down, the way I dragged it
    And the space I asked for is still exactly what it was
    Because the space is a quantity the drag SPENDS, never a value the drag clears —
      zeroing a 40px margin lifted the block 40px while the pointer was dragging it
      down, so the gesture came out inverted and the spacing was gone for good

  Scenario: Growing upward into space that is already free
    Given there is space between the two stacks
    When I drag the lower one's top edge up by less than that space
    Then the gap gives the room up
    And the stack above is not touched at all, because the space was already free
    Because this is the east edge's own rule, which the vertical axis never had

  Scenario: A block that sits beside another, not above it
    Given two stacks side by side on one line
    When I drag the right-hand one's top edge
    Then the block beside it is not resized
    Because the block before it on a line is a neighbour, not a partner,
      and that boundary belongs to the left and right edges

  # ── Pinning: a block that stays put while the page scrolls ────────────────
  # tests/unit/pinning.test.ts  ·  tests/e2e/pinning-holds.spec.ts

  Scenario: A pinned header holds while the page scrolls
    Given a block I have set to stay put at the top
    When I scroll the page down
    Then it stays on the screen instead of travelling away with the page
    And it holds on the CANVAS and on the EXPORTED page alike

  Scenario: A pinned side rail keeps its own height
    Given a short block pinned beside much taller content
    When the row stretches its children to a common height
    Then the pinned block is taken out of that stretch
    Because sticky moves a box WITHIN its parent, and a block as tall as its
      parent has nowhere to travel — measured at 2400 pixels tall beside 2400
      pixels of content, which is zero room to move

  Scenario: A pinned block in a stack is not un-stretched
    Given a pinned block whose parent lays its children out in a column
    Then nothing is written to its cross-axis alignment
    Because in a column the cross axis is WIDTH, so the same line that rescues
      a side rail would shrink a full-width header to the width of its text

  Scenario: The exported page must not make its own scroll container
    Given every exported page stops sideways scrolling
    Then it does so with `overflow-x: clip`, never `hidden`
    Because `hidden` forces the computed `overflow-y` to `auto`, which makes
      the body a scroll container while the page scrolls on the viewport — so
      every pinned block was measured against a box that never moves, and a
      pinned nav lost the whole 600 pixels it was scrolled

  Scenario: A pinned header alone in its own band
    Given the builder gives every top-level block its own band
    And that band hugs the block, so the two are exactly the same height
    When I pin the block
    Then the BAND carries the pin, and the block stands down
    Because a child as tall as its parent has nowhere to travel — measured at
      64 pixels inside a 64-pixel band, losing the whole 700 pixels it was
      scrolled, while a hand-built page with two blocks in one band held fine

  Scenario: A band that has a height of its own does not carry the pin
    Given a band the user has given a height
    Then it gives its child real room, so the child keeps its own pin
    Because hoisting there would stick the whole band instead of the block

  Scenario: What the canvas shows is what the page publishes
    Then a pinned block behaves identically in the editor and in the export
    Because the canvas held it correctly for the whole life of the feature
      while the published page never did — the editor was showing a behaviour
      it had never once shipped

  Scenario: Asserting the CSS is not asserting the behaviour
    Given a test that checks `position: sticky` is present
    Then it passes whether or not anything actually sticks
    Because that is how this shipped built, reachable and inert — the guard
      that matters scrolls a real page and measures what moved

  # ── Why this is asserted the way it is ─────────────────────────────────────

  Scenario: Two rules each right on their own, cancelling out
    Given a row band wraps, so its cross-axis space is handed out by align-content
    And align-items then stretches the child to fill its line
    Then a line packed to the start is already as short as the child,
      so the stretch achieves nothing and 360 pixels of the box stay empty
    Because nothing in either rule mentions the other
