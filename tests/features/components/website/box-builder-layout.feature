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
