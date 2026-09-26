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

  Scenario: Choosing between the two ways of staying put
    Given any block that sits in the layout — a section, a stack, a grid, a
      heading, a button, an image or a component
    Then I can choose "Sticks when reached" or "Floats on screen"
    And each one is shown as a PICTURE of the page before and after a scroll
    And the first keeps its own place in the layout
    And the second is lifted off the page, which runs underneath it
    Because the two words alone could not be told apart in use, and the control
      lived under "Arrange" where only a container could ever reach it — so the
      "Apply now" button that "Floats on screen" exists for could not be pinned

  Scenario: The line underneath says where THIS block lets go
    Given a block placed straight on the page
    Then it says it holds "for the rest of the page"
    Because the builder gives every block a band of its own, the band hugs it,
      and the pin is carried up to the band — whose parent is the page. It used
      to promise it would "leave with its section", which no such block does

  Scenario: Named for what it really lets go with
    Given a block pinned inside a Stack
    Then the line names that Stack
    And a block beside a neighbour names the row of blocks it sits in
    And a grid cell names the GRID, because a pinned cell was measured still
      held 900 pixels into the next row and let go only when the grid ended

  Scenario: A block that floats on screen says what it covers
    Given a block held "Floats on screen" against the top or the bottom
    Then the inspector says it covers the top of the page, or sits over the
      footer, because it keeps no space
    And it offers "Keep its space instead", which switches it to the mechanism
      that does
    Because a 64-pixel bar was measured hiding 56 pixels of the block beneath it
      the moment the page opened — and space is a decision here, never a default

  Scenario: A block that floats on screen is actually visible
    Given a full-width bar held "Floats on screen"
    Then it is full width on the canvas and on the published page
    Because out of flow it takes no size from its row or grid: it rendered ZERO
      pixels wide in both, and every guard measured where it sat, never how wide

  Scenario: A block placed freely can still hold on screen
    Given a stack lifted onto its own free-floating layer and dragged into place
    When I choose "Floats on screen"
    Then it holds exactly where I placed it, however far the page scrolls
    And it does not jump when I choose it
    Because free placement and holding on screen are the same property doing the
      same job — measured, the block travelled 0 pixels over a 900-pixel scroll
      while the floating one lost all 900. It does not jump because its place is
      MEASURED at that moment: its stored left and top are percentages of the
      section it sits in, and a percentage of a tall section is not the same
      place as a percentage of the window — 720 pixels became 240

  Scenario: The preview is the screen the visitor is actually on
    Given I open the preview
    Then the page fills my whole window — its width AND its height
    And there is no frame, no padding and no rounded corner around it
    And the bar steps out of the way, leaving an Exit pill I can always reach
    Because a preview that letterboxes the page inside a card hands it a width
      no browser would give it, and "one screen tall" is a real decision here

  Scenario: A device preset still looks like a device
    Given I pick a phone or a tablet from the screen menu
    Then it keeps the card look, centred, at that device's own size
    Because framing is right for a device and wrong for "show me my site"

  Scenario: Sweeping the width to find the breakpoints
    Given the preview is on Responsive
    When I drag either edge inwards
    Then the page narrows from BOTH sides and stays centred
    And the readout names the width and the rung it lands on
    And a double-click on an edge gives the whole window back

  Scenario: Every screen in the catalogue, not a sample of it
    Given the preview offers sixty named screens — iPhone, Android, foldables,
      tablets, laptops and monitors, at their real CSS-pixel sizes
    Then a page is checked against EVERY one of them, from the 320-pixel
      iPhone 5 to a 5120-pixel super-ultrawide
    And none of them makes the page scroll sideways or pushes a block past the
      edge of the screen
    Because a list of devices in a menu is a promise, and the only way to keep
      it is to walk the list — the guard enumerates the very list the person
      chooses from, so a device added tomorrow is covered the day it appears

  Scenario: A held block that an ancestor captures does not pretend to hold
    Given a block set to "Floats on screen" inside a tilted block, a component
      or the glass Alert
    Then the editor shows it travelling with the page, exactly as the published
      page will
    Because that ancestor makes its own frame and captures it — which is what
      the inspector warns about, so drawing it holding would have the builder
      contradicting its own warning

  Scenario: A published page starts at the very edge
    Given any full-width band
    Then it starts at the edge of the window, with no white line beside it
    Because the browser gives BODY an 8px margin unless it is told otherwise,
      and the exporter never told it — so every published page was inset 8px on
      all four sides, and only blocks measured against the VIEWPORT reached the
      edges, which is what made floated bars look different from everything else
  Scenario: A held block holds IN THE EDITOR, not only on the published page
    Given any block set to "Floats on screen"
    When I scroll the canvas
    Then it stays where it is on screen
    And a block placed flush against the top stays flush, with no gap above it
    Because the editor cannot use the property at all: the page frame declares
      a container-type so container queries work, and that captures every fixed
      descendant — so the canvas keeps the block in the page and offsets it by
      its own scroll, less the padding the canvas puts around the page. Reported
      twice from screenshots: first it scrolled away with the page, then it held
      with that padding showing as a gap above it

  Scenario: And it is told which one cannot work, rather than being ignored
    Given a block lifted onto its own free-floating layer
    Then "Sticks when reached" is not offered, and the inspector says it needs
      the block back in the layout
    Because sticky holds a box against where it sits in the FLOW, and a freely
      placed block gave that place up — forced, it was measured jumping back
      into the layout and taking space again. Making it work needs a zero-height
      sticky wrapper, the same structural edit that defers "hold until a block
      you choose"

  Scenario: Choosing what a pinned block becomes once the page moves
    Given a pinned block
    Then I can choose an arrival: Nothing, Shadow, Solid, Glass, Rule or Condense
    And each is shown as a picture of the bar before and after a scroll
    And "Nothing" is the default, so nothing arrives that nobody asked for
    And I choose how much scrolling it takes, which is a distance in rem — the
      builder's fluid unit is tied to the CONTAINER'S WIDTH, and using it made
      "500 pixels of scrolling" resolve to 64

  Scenario: An arrival only happens once the page has moved
    Given a bar with a Shadow arrival
    Then it is flat while it is still sitting in the page
    And lifted once the page has scrolled under it
    And it is measured on the canvas and on the published page, which agree

  Scenario: Condense says so when there is nothing to condense
    Given a block with no height and no inner spacing of its own
    When I choose the Condense arrival
    Then the inspector says there is nothing to condense yet, and what to do
    Because a bar whose height is simply its text has nothing to take away, and
      a control that appears to work while doing nothing is the worst kind

  Scenario: An entrance and an arrival are both kept
    Given a block with an entrance effect AND a pinned arrival
    Then the browser runs both animations
    Because they write the same CSS properties on the same element, so the rule
      emitted last silently took the block over — measured, only the arrival ran

  Scenario: A reader who asked for less motion gets the resting look
    Given any arrival
    When the reader prefers reduced motion
    Then nothing animates, and the block is still pinned
    Because the arrival is decoration and the pin is the feature

  Scenario: Pinning is a per-device choice that survives a save
    Given a block pinned on the desktop
    When I turn it off for phones
    Then it scrolls away on a phone and still holds on a desktop, after a reload
    And a pin set only for phones holds there, and nowhere else
    Because a clear at a rung was stored as "undefined", which JSON drops — the
      desktop's pin came back on the phone after every save — and the band read
      its children as the DESKTOP had them, so a phone-only pin was never carried

  Scenario: Only the one that can use them offers the sides and corners
    Given a block held "Floats on screen"
    Then it can be held against any edge, or in any corner
    But a block held "Sticks when reached" is offered only top and bottom
    Because sticky is measured against a vertical scroll, and two insets at once
      is exactly how a sticky block ends up present in the CSS and doing nothing

  Scenario: A fixed block does not float over the editor
    Given a block held "Floats on screen"
    When I look at it on the canvas
    Then it is held against the page I am designing, not the editor window
    Because otherwise it covers the toolbar and the inspector, where it cannot
      be selected or dragged — the same containing block that breaks fixed by
      accident everywhere else, used here on purpose

  Scenario: The block that captures a fixed block is named
    Given a block held "Floats on screen" inside a tilted block, a component,
      or the glass Alert
    Then the inspector says it will not stay on screen, and names that block
    Because a transform, a container-type or a backdrop-filter makes its own
      frame and a fixed block inside holds against that instead of the window —
      with no error, and nothing to connect the cause to the effect

  Scenario: A warning nobody can see is not a warning
    Given the inspector knows which block is stopping a pin from working
    Then that message actually renders
    Because it was written, documented and declared as a property, and no caller
      ever passed it — so the one silent failure the feature knew how to explain
      went on being silent

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

  # ── An empty coloured band reaches the page ───────────────────────────────
  # tests/e2e/empty-band-shows.spec.ts

  Scenario Outline: A band I coloured and left empty is the size the builder showed
    Given a band with a background holding <contents>
    When I preview it, or publish it
    Then it is the same height there as it is on the canvas
    And it is a band I can see, not a sliver

    Examples:
      | contents                     |
      | nothing at all               |
      | an empty box                 |
      | an empty grid                |
      | an empty box inside an empty box |

    # Reported with screenshots: an orange band at the top of a page showed in the
    # builder and looked missing in the preview. It was not missing — it was 40px
    # instead of 128px, and against a tall row of cells underneath, a third of the
    # size is indistinguishable from gone. Two causes, the first hiding the second:
    # a floor the CODE derived was allowed to veto the rule ("unless something is
    # already set"), and "empty" meant an empty children array rather than nothing
    # that renders — so a band holding one empty box was never considered empty.

  Scenario: A height I set myself is never overridden by that floor
    Given a coloured empty band I resized to 24px
    Then it is 24px in the builder and 24px on the page

  Scenario: A band with content in it takes its height from the content
    Given a coloured band holding a line of text
    Then it is as tall as the text, not 128px

  # ── Reported by the user: empty space in a row, and a rail that will not fill the screen ──

  Scenario: A row still fills its width after one of its blocks is removed
    Given three blocks side by side at 20%, 20% and 60%
    When the middle one is deleted
    Then the remaining two become 25% and 75%, and the row is full again
    Because the freed width used to be left behind: the other two still said 20%
      and 60%, so 197px of the row was simply dead — and permanently, since a
      drag moves the boundary BETWEEN two blocks and faithfully preserves their
      total. That is right for a drag and no use at all here. The width is handed
      out in proportion so the blocks keep the relationship the user chose.

  Scenario: Only a row heals — a column and a grid are left alone
    Given blocks stacked in a column, or placed in a grid
    When one of them is deleted
    Then no other block's width is touched
    Because stacked blocks do not share a width, and a grid places by colSpan.
      A sibling set to Fit or Full is left alone too — it already takes up the
      slack by itself.

  Scenario: A rail held against a vertical edge spans the whole screen
    Given a stack beside a column of content, set to "Floats on screen" at the left
    Then it fills the height of the window rather than hugging its contents
    Because out of flow a block takes no size from its row. That is exactly why a
      fixed BAR has to be handed its width — a full-width bar once rendered 0px
      wide on both engines — and nobody then asked the same question of the
      vertical case. Measured beside a 900px column: the rail rendered 300px,
      short by 600. A bar is held against a horizontal edge and spans the width;
      a rail is held against a vertical edge and spans the height.

  Scenario: A corner still hugs, and a height you set yourself still wins
    Given a block held at a corner, or one given an explicit height
    Then neither is stretched
    Because a corner means "sit in that corner" — a chat bubble, a back-to-top
      button — and stretching one is the opposite of what it is for. The rule
      supplies the size nothing else will; it does not overrule a decision.

  Scenario: The editor shows the same rail the published page will
    Given the same rail on the canvas
    Then it fills the visible canvas, not a stub at the top of it
    Because the editor cannot use `position: fixed` at all, so it simulates one —
      and its converter had only ever kept a single inset. Two insets against a
      vertical edge mean "stretch between them", which is the one case where that
      is the point. Missing it left the canvas showing 300px while the published
      page showed the full-height rail: canvas ≠ export, in the direction where
      the editor lies to you.

  Scenario: A sticky sidebar is the height of the screen, and still sticks
    Given a Stack beside a tall column, set to "Sticks when reached"
    Then it fills the height of the window
    And it still holds its place as the page scrolls
    Because it cannot be as tall as the column beside it — stretched to its
      neighbour's height a sticky block has zero travel and can never stick,
      which is the silent failure the no-stretch rule exists to end. It can be as
      tall as the SCREEN, and against a taller column that leaves it a full
      column of travel. Asserting the height alone would pass on a sidebar that
      had stopped sticking, so the travel is asserted too.

  Scenario: A sticky button in a row is not a sidebar
    Given a button beside a column of content, set to "Sticks when reached"
    Then it keeps the size of its contents
    Because a Stack beside content is a sidebar and a button is not, and
      stretching one to the height of the screen would be absurd.

  Scenario: A block dropped into the hole above a stack takes that hole
    Given two stacks side by side
    And the right one shrunk from its TOP edge, leaving empty space above it
    When a Stack is dropped into that empty space
    Then the newcomer fills the space, closing right up to the block below it
    And that block's bottom edge does not move
    Because the space a top-edge drag opens is a `margin-top`, and a margin is
      not a box — there is nothing in it to drop into, so the drop landed on the
      band instead. It did add a block, and the margin rode along with the target
      into the new column: the hole was still there AND the newcomer sat above
      it. Measured, the block was pushed from y=287 to y=336 with the 199px hole
      intact — reported as "nothing appears and it breaks the positions of the
      stacks". The margin is now handed over rather than duplicated.

  Scenario: The newcomer fills the hole rather than being sized to it
    Given the same drop
    Then the newcomer is given no fixed height at all
    Because spacing is emitted in the builder's fluid unit and a size is not: a
      stored 200 renders as a margin of 157.2px at 1024, 182.8px at 1280 and
      198.8px at 1440, while a min-height of 200 is 200px at every one of them.
      Sizing the newcomer from the stored number matched the hole at exactly one
      window width and drifted at every other, and would have gone on drifting as
      the window resized. Filling asks no unit question at all.

  Scenario: The bottom edge alone cannot tell the fix from the bug
    Given the same drop with the margin NOT handed over
    Then the block's bottom edge is still in the same place
    But the newcomer stops short of it, leaving the hole open
    Because the newcomer simply takes less room in front of the block, so the
      bottom lands identically either way. The guard asserts that the newcomer
      REACHES the block — proven by mutation, since the bottom-edge assertion
      passed with the fix removed.

  Scenario: Shrinking a block you just dropped lets the next one ride up
    Given a stack dropped into the empty space beside another
    When that new stack is dragged shorter
    Then the stack below it moves up to meet it
    And the room that was freed pools at the END of the column
    Because a dropped block is wrapped in a band marked "fill" so it takes the
      space that is really there — and the height is then written on the BLOCK
      while the fill lives on the BAND, so the band never found out. Measured:
      the newcomer went 400 to 300 while its band held all 400, leaving a 100px
      hole with the block below stranded. The agreed rule is that the one which
      follows moves with it, and whatever is genuinely left over collects at the
      end where it can be built on.

  Scenario: A band that must go on filling is left alone
    Given a band holding several blocks, or a block that is not a band
    Then its fill is untouched however its contents are sized
    Because no single block speaks for a band holding several, and the fill this
      rule spends is the one the drop puts on a band. A blunter version that
      dropped every fill would pass the case above while quietly undoing the
      behaviour the drop exists for — it fails four cases here.

  Scenario: The stretch a drop writes is not a height somebody chose
    Given a freshly dropped block, before it has been resized
    Then its band is still filling
    Because the drop writes `100%` on the block so it stretches inside its band.
      Counting that as a height would switch the fill off the instant it was
      created.
