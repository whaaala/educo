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

  Scenario: Choosing another screen size
    Given a block I have selected
    When I choose Mobile, Wide, Tablet, Desktop, Laptop or Full width, one after another
    Then the handles and the toolbar come to rest on the block at every one of them
    Because the page frame changes width by a 300ms transition with no render, and the handles stayed where the
      block had been — drawn at 97…1107 around a block that was now at 415…790

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

  Scenario: Letting go of a block over the selected block's toolbar
    Given a heading I have selected, whose toolbar hangs under it — over the text on the next line
    When I drag a Stack from the blocks panel and let go on any part of that toolbar
    Then the Stack lands on the page beneath the toolbar, where the drop marker was showing
    And the toolbar works as before once the drag is over
    Because the toolbar took the release: the marker showed, and nothing was added — three times out of three on
      the toolbar, never beside it — and 15 of 403 real pages could not be built for it (tier-99 sweep)

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
      the moment the page opened — so a bar that covers the page says so, and keeping its space is one click

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

  # ── The whole rule: no gap between stacks; only an OUTER edge may open one ──

  Scenario: Resizing against a neighbour never leaves a gap between two stacks
    Given two stacks touching, side by side or one above the other
    When the shared edge between them is dragged, from either side
    Then the neighbour gives or takes the room and the two stay touching
    Because the boundary belongs to both of them. Asserted as the gap BETWEEN
      them, which is what a person sees, rather than as either block's stored
      size — the widths were arithmetically right throughout the fault this
      exists to catch, and the row still broke.

  Scenario: Only an edge facing nothing may open a space
    Given a stack with nothing beyond the edge being dragged
    When that edge is dragged inward
    Then a space opens there and the other stack is not disturbed at all
    Because that is the one case with no boundary to share. It is the user's own
      statement of the rule: a space is right on the far left when nothing is to
      its left, and the same at the right, the top and the bottom.

  Scenario: The gap on a line is a share of that line, not a length
    Given the left edge of the leftmost stack dragged inward
    Then the stack beside it stays on the same line
    Because the gap has to ADD UP with the percentage widths beside it. Written
      as a length it could not: measured, a 140.15px margin beside widths of
      35.83% and 50% came to 988.15px in a 988px row — an overflow of 0.15px —
      and the stack beside it wrapped onto a second line and doubled the band's
      height. A percentage margin resolves against the parent, so the row adds up
      exactly at every width and the gap scales with the page.

  Scenario: The gap and the width are one sum
    Given the same drag
    Then the width is the remainder of what the block already occupied
    Because rounding the two separately leaves the pair 0.01% adrift, which is a
      tenth of a pixel at that width and is precisely what wrapped the row.

  Scenario: All eight ways are checked, not one
    Given each of the four edges, with a neighbour beyond it and without
    Then every one behaves
    Because the fault was found in the case nobody had tried, and a matrix cannot
      quietly omit a corner the way a list of hand-written tests can.

  # ── An edge that meets SEVERAL stacks ───────────────────────────────────────
  # The user asked whether stacks could be "grouped" so they adjust together.
  # They already are: two columns side by side live in one BAND, and the band is
  # what a shared edge really belongs to.

  Scenario: Closing a boundary that meets several stacks moves them all
    Given a band holding a stack beside a column of two rows
    And another stack below that band
    When the lower stack's top edge is dragged down
    Then the band, the stack and the column all follow the boundary together
    And no hole opens between the column's last row and the stack below it
    Because writing the height to the band moved both columns but did not reach
      the rows INSIDE one: measured, the band went 300 → 366, the stack and the
      column both followed to 366, and the last row stayed at 120 — a 66px hole.
      In the user's words, "when I decrease the height from the top it creates a
      space at the bottom of the ones on the right".

  Scenario: A band that has been given a height says so to what it stretches
    Given a band with a height of its own
    Then a column inside it is sized by that band, and its rows fill it
    Because a band is scaffolding only until a gesture writes a height onto one.
      The resolver passed the question straight through, so the column went on
      hugging its own rows while the band stretched it.

  Scenario: The edge stops dead when the stacks above have nothing left to give
    Given the band above is already at its content floor
    When the lower stack's top edge is dragged up
    Then nothing moves at all
    And no gap is torn open to pay for the gesture
    Because it is the user's own call, asked and answered: the edge stops. It
      does not grow out of the far side.

  Scenario: A repeated drag does not ratchet the height upward
    Given the top edge dragged up three times in a row
    Then the height settles and the later drags change nothing
    Because a gesture that re-reads a page the previous one made taller would
      grow again each time. Measured: 300 → 396 → 396 → 396, the header giving
      way to its 24px floor and the edge then stopping dead.

  # ── A neighbour BESIDE you is not the same as nothing above you ─────────────

  Scenario: A stack with a neighbour beside it still has something above it
    Given a stack with a taller stack beside it, in a band below a header
    When its top edge is dragged up
    Then it stays inside its own band and never covers the header
    And the header gives way instead, and the stack beside it comes along
    Because the block-above lookup gave up on meeting a sibling sharing the line.
      That sibling owns no boundary — which is not the same claim as "nothing
      does". With no partner found the edge was clamped against the PAGE top
      instead: measured, margin-top -160.034px, the stack 160px above its own
      band and sitting on the header. The user: "it went way above the whole page
      on the top side".

  Scenario: The overlap is what is asserted, not the margin
    Given the same drag
    Then the test measures whether the stack covers what is above it
    Because the negative margin is only the mechanism, and a future fix that
      reached the same wrong picture another way would slip past a test watching
      the number.

  # ── Width round trips (rule 7) — 2026-09-26 ────────────────────────────────────────────
  Scenario: A width round trip returns the page to where it was
    Given two stacks side by side at 50% and 50%, built by dropping one beside the other
    When I widen the left stack until the right one wraps to the next line
    And I drag the same edge back to where it started
    Then both stacks are side by side again at 50% and 50%
    And doing it three times gives the same result every time
    Because the partner used to be found by VISUAL line: once it wrapped it was
      no longer found, and narrowing released 200px to nobody — measured
      512 / 512 becoming 224 / 712. The partner is now the next block in the
      TREE, and whether it shares the line is read from the stored widths.

  Scenario: A wrapped neighbour's width is its stored share, not what it draws
    Given a stack wrapped onto a line by itself, drawn 1024px wide while storing 30%
    Then a resize beside it does its arithmetic from the 30%, not the 1024px

  Scenario: Narrowing beside a wrapped neighbour never leaves a hole
    Given the left stack has been widened until its neighbour wrapped below
    When I narrow the left stack
    Then the neighbour comes back up beside it as soon as it fits at its minimum
    And it takes the rest of the line, so no empty space opens at the line's end
    Because the user found, by hand, a hole beside the narrowed stack while the
      neighbour sat underneath at full width — nothing asked for that space and
      the neighbour could have filled it.

  Scenario: Two touching blocks a hair apart are still touching
    Given two blocks whose shares round to 41.41% and 58.59%
    When I narrow the left one
    Then the right one widens to match
    And no margin is written on it
    Because a 0.01px difference was read as a gap, and the gap branch wrote a
      198-unit margin on the neighbour: a space nobody opened.

  # ── Dropping beside a full line ────────────────────────────────────────────────────────
  Scenario: A block dropped onto a full line takes an equal share of THAT line
    Given two stacks side by side at 50% and 50%
    When I drop a third stack beside the second
    Then the three share the line at a third each
    And a fourth dropped beside them makes four quarters on one line
    And the shares never add up past the line, so nothing wraps and no hole appears
    Because the newcomer used to arrive at 100% and the WHOLE row was scaled down
      and rounded to whole percents: 25/25/50, then 13/13/25/50 = 101%, so the
      fourth wrapped at once and left a 502px hole on a page nobody had resized.

  Scenario: Only the line the block lands on is shared out
    Given a row whose second line holds a block the user pushed there
    When I drop a block onto the first line
    Then the second line's block keeps its width

  Scenario: A block pushed onto its own line fills it — until you size it yourself
    Given a stack wrapped onto a line by itself, which fills that line
    When I drag its own right edge in by 300px
    Then it is 300px narrower, and stays that size
    And a block that has never been resized still fills a line it is pushed onto
    Because rule 2: "don't grow me" starts when you drag, not before. Measured
      before the fix: two 300px drags stored 70.70% and the block went on drawing
      1024px wide — the grow handed the space straight back, a dead control.

  Scenario: A space opened at the far left closes again
    Given the first of two stacks side by side
    When I drag its left edge 120px to the right
    Then a space opens at the far left and its right edge stays where it was
    When I drag the left edge back
    Then the space closes and the stack is its old width again, its right edge unmoved
    Because the drag read that space from the wrong field, so it believed there
      was none: the space vanished, the width did not return, and the right edge
      jumped 120px left, dragging the neighbour with it.

  # ── Canvas == export: numbers in styles ────────────────────────────────────────────────
  Scenario: A number in a style means the same on the canvas and on the published page
    Given a style value written as a bare number
    When the page is exported
    Then a custom property keeps the bare number, as the canvas does
    And every property the canvas treats as unitless stays unitless — weights, grid lines, aspect ratio, zoom
    And only a length gains "px"
    Because the export added "px" to custom properties: the theme's heading weight
      became "600px", which is not a weight at all, so the published page dropped it
      while the canvas showed 600. Found by the Preview units check, 2026-09-26.

  # ── Units reach the published page as % / rem / em (rule 16) ─────────────────────────────
  Scenario: Every block a user can drop exports without a stored pixel
    Given every palette tile, as the palette actually inserts it
    When each is exported on its own
    Then its styles and its inline styles carry no pixel length but a 1px hairline or zero
    Because a Card's image went out as "flex: 0 1 160px", a button as "gap: 8px" and
      "border-radius: 9999px", an embed and an unknown-shape image as "260px", a
      divider as "2px" and a spacer as "48px" — and the guard missed every one: it
      treated anything ending in 0px or 1px as zero or a hairline, and never read
      inline styles. Found by the Preview units check, 2026-09-27.

  # ── Canvas == published: typography (rule 11) ────────────────────────────────────────────
  Scenario: A heading looks the same in the editor as on the published page
    Given a heading on the canvas and the same heading in Preview, at the same width
    Then they have the same line height, letter spacing and wrapping
    And a block holding a heading is the same height in both
    Because the canvas and the export each had their own copy of the typography
      helper, and only the export's base stylesheet made headings tight — every
      heading was 1.5× on the canvas and 1.15× published (55px vs 42px). One
      resolver, blockTypography, now serves both. Found by the Preview check.

  Scenario: Preview uses the same fonts as the published site
    Given a page whose theme uses web fonts (Poppins headings, DM Sans body)
    When I open Preview
    Then Preview draws them in the site's own fonts, embedded exactly as the download embeds them
    Because Preview rendered the export without its font step, so every page appeared
      in the browser's fallback sans-serif — a heading measured 13% wider in Preview than
      on the canvas — while the downloaded site used the school's chosen typeface.

  Scenario: The canvas starts from the published page's defaults, not the editor's
    Given the editor's own interface text is letter-spaced
    Then text on the canvas is spaced exactly as on the published page
    Because the canvas page inherited the editor's 0.02em tracking, so every word
      was wider while editing than it would be for a visitor.

  Scenario: Text wraps at the same place on the canvas and on the published page
    Given a heading in a narrow column, close to wrapping
    Then it wraps onto the same number of lines on the canvas and in Preview
    Because the editable text carried 8px of padding its margins hid from the layout
      but not from the text, so it wrapped a line sooner while editing (57px vs 35px).

  # ── #43 — widening in a row of three or more (decided 2026-09-27) ─────────────────────
  Scenario: Widening one block in a busy row takes exactly the width you dragged
    Given four stats side by side at 25% each
    When I drag the first stat's right edge 80px past where its neighbour can give
    Then the first stat is exactly as wide as I dragged it — it does not jump to the full row
    And the blocks after it stay on the line in order while they fit
    And the last one that fits takes up any leftover, so no hole opens
    And only the blocks that no longer fit move to the next line
    When I drag the edge back to where it started
    Then all four are back on one line at 25% each
    Because the dragged block used to jump to 100% and push all three others down —
      an 80px drag became a 770px jump, breaking "the size you drag is the size you get".

  # ── Where space comes from, and where it goes back (#53 · #58 · #59 · #60) ──
  # tests/unit/box-model.test.ts (allocateLine: replayed stories + matrix) · scripts/uat/uat43m.js (headed matrix)
  Scenario: A row reads its blocks as they are DRAWN, not only as they are stored
    Given five stacks sharing a row at 20% each, on a page where 20% is narrower than a stack's 14rem minimum
    Then the fifth is on the next line, and the resize knows it
    When I widen and narrow any of them and drag back to where I started
    Then the row comes home exactly as it was drawn

  Scenario: Space that was empty stays empty, and is used first
    Given a row with room at its end, because I narrowed its last block earlier
    When I widen the first block
    Then it uses the empty space first, and its neighbour keeps its width
    When I drag it back
    Then the empty space returns to the end of the row, and the neighbour still keeps its width

  Scenario: Shrinking a block hands its space to the block beside it
    Given three blocks filling a row
    When I narrow the first from its right edge
    Then the second grows by exactly what the first gave up, and the third does not change

  Scenario: The last block squeezed is the first given its width back
    Given I widened the middle block earlier, squeezing the last one
    When I take the first block out and back, far enough that the others wrap below
    Then every block comes home to the width it had, the earlier squeeze included

  # ── Decided with the user 2026-09-27 (#75): narrow columns · phones stack · no fill jump ──
  # tests/unit/box-model.test.ts ("the column floor") · tests/components/website/BoxCanvas.test.tsx · scripts/uat/uat-structures.js
  Scenario: A column I size myself can be narrow
    Given two columns side by side
    When I drag the first one's right edge until it is 10% of the row
    Then it stays 10% on a desktop and a tablet, as narrow as I made it (down to 3rem)
    And a column I have never sized still keeps the 14rem minimum, so untouched rows wrap into readable widths
    Because real sites are full of 10/90 label columns and six-across rows, and about 3,000 real sections could not be built

  Scenario: On a phone every row stacks
    Given any row of columns, however I sized them
    When the page is shown on a phone
    Then each column takes the whole width, one under another — nothing narrow is ever squeezed

  # ── #85 (decided with the user 2026-09-27): one rule for rows and grids ──
  # tests/e2e/grid-cell-resize.spec.ts ("a 90/10 grid") · scripts/uat/probe-section.js (headed)
  Scenario: A grid cell squeezed across a shared edge can be as narrow as a row's column
    Given a grid of two cells side by side
    When I drag the first cell's right edge until the second is one track wide
    Then the grid is 11 and 1, the narrow cell still beside the wide one
    And pulling further moves it to the next row, keeping its width, just as a row does

  # ── #87: Escape is the way out of the words ──
  # tests/components/website/EditableText.test.tsx · headed: scripts/uat/probe (Escape while editing)
  Scenario: Escape leaves the text I am typing in, and keeps the block selected
    Given I am typing in a heading, a paragraph or a button
    When I press Escape
    Then the caret leaves the text, what I typed is kept, and the block is still selected
    And pressing Escape again steps out to the block around it, as it always does

  # ── #86: a comfortable measure, counted ──
  # tests/e2e/paragraph-measure.spec.ts
  Scenario: Paragraphs keep a comfortable measure in every font
    Given a long paragraph in a wide column
    When the page is shown on any screen, in any body font of the library
    Then no line runs past 75 characters, and a line averages 45–75 (design foundation, Rule 1.9)

  # ── #77: one edge's round trip never moves a column another edge sized ──
  # tests/unit/box-model.test.ts ("#77") · scripts/uat/probe77.js (headed)
  Scenario: A later out-and-back on the first edge leaves the third column alone
    Given three columns I sized 30 / 30 / 40 by dragging the first edge, then the second
    When I drag the first edge out and back to where it was
    Then the columns are 30 / 30 / 40 again — the nearest column gave the width and got it back
    And dragging the second edge back afterwards still returns the third column to where it began

  # ── Decided with the user 2026-09-27 (#78): rows of four or more columns ──
  # tests/unit/box-model.test.ts ("rows of four or more") · scripts/uat/uat78.js (headed) · scripts/uat/previewcheck.js
  Scenario Outline: A row of four or more columns stays one row on a desktop and a laptop
    Given I drop <n> stacks side by side
    When the page is shown at <screen>
    Then all <n> columns sit on one line, none of them wrapped
    Examples:
      | n | screen |
      | 4 | Laptop 1024 |
      | 5 | Laptop 1024 |
      | 6 | Laptop 1024 |
      | 6 | Desktop 1280 |
      | 6 | Wide 1920 |

  Scenario Outline: On a tablet they rearrange to at most three per line, balanced
    Given I drop <n> stacks side by side
    When the page is shown on a tablet
    Then the columns sit <lines> per line, each filling its share of its own line with no hole
    Examples:
      | n | lines |
      | 4 | 2+2 |
      | 5 | 3+2 |
      | 6 | 3+3 |
      | 7 | 3+2+2 |

  Scenario: Uneven columns keep their proportions on a tablet
    Given four columns I sized 10% · 40% · 25% · 25%
    When the page is shown on a tablet
    Then the first line holds the 10% and 40% columns in a 1:4 ratio, the second the two 25% ones side by side

  Scenario: A width I set for the tablet wins over the rearranging
    Given a row of six columns
    When I set one column's width on the tablet
    Then that column keeps the width I set there, and the desktop is unchanged

  Scenario: Three columns are not touched
    Given three columns side by side
    When the page is shown on a tablet
    Then they stay three across, as before

  # ── Decided with the user 2026-09-29 (c-11c, B): a cell of one icon is not a column for this rule ──
  Scenario Outline: A table of ticks is not rearranged on a tablet
    Given a row of four columns: <cells>
    When the page is shown on a tablet
    Then the line is <result>
    And the page check agrees with the canvas and the Preview
    Examples:
      | cells                                   | result                         |
      | words · icon · icon · icon              | left as it is                  |
      | words · words · icon · icon             | rearranged to 2+2              |
      | words · words · words · words           | rearranged to 2+2              |

  Scenario: Widening a block never makes it jump
    Given two blocks side by side
    When I widen the first until the second no longer fits beside it
    Then the second moves to the next line and the first stops exactly where I dragged it
    And the rest of the line stays empty — an outer edge
    And dragging back brings everything home

  Scenario: A word a hair wider than its column never wraps the neighbour (decided 2026-09-28, D)
    Given a row of three columns I sized to 15 / 25 / 60
    And the longest word in the first column needs one pixel more than 15%
    Then the row stays on one line on the canvas and in the Preview alike
    Because the last column of the line lends one pixel (0.0625rem) of slack, as a margin — no column changes size
      — measured before: 154px on the canvas, 155px in the Preview, and only the Preview wrapped the third column
    And a word that is genuinely too wide still moves the neighbour to the next line, as before

  Scenario: Type scales with the page, spacing with the box (decided 2026-09-28, A)
    Given a section heading in a 30% sidebar and a card title in a wide band
    Then the section heading is the larger, as the page's hierarchy says — wherever each sits
    And a card's padding still tightens in a narrow column
    Because text sizes read the page's own fluid unit (fixed at the page root), while spacing reads the box's

  Scenario: The fluid spacing tokens follow the reader's text size (decided 2026-09-28, A)
    Given a reader whose browser text is set to 24px
    Then the page gutter and the section, group and element gaps all grow with it between their bounds
    Because each is clamp(min, rem + cqw, max) — never a bare container term

  # ── A block under an icon, in a column stretched by its neighbour (E-0, asked by the user 2026-09-30) ──

  Scenario: A block dropped under an icon lands under it, in the same column
    Given a grid of three columns, an icon in the first and a long quote in the second
    When I drag a Text from the blocks panel and let go just under the icon
    Then the Text is added under the icon in the icon's own column
    And the grid still has three columns — no new cell appears
    And the drop never shows a marker and then adds nothing

  Scenario: A stretched column keeps its blocks at the top, and its last block takes the spare height (decided 2026-09-30)
    Given the icon's column is as tall as the quote beside it
    Then the Text sits one stack gap under the icon, and the spare height is taken by the last block, below its words
    And after I drag a shared edge down, the last coloured row in the other column grows to meet it — no hole at its foot
    And a column holding a single block — a Card — still fills its height, so a row of Cards stays equal
    And a section whose height I set myself still shares its space among its blocks as before

  Scenario: A Divider is a real thematic break, the same on the canvas and the published page (R-23, 2026-10-02)
    Given I drag a Divider from the blocks panel between two paragraphs
    Then the canvas and the Preview both draw it as an <hr> with one line and no browser margin or inset border
    And a screen reader announces a separator there, as MDN's <hr> is
    And its line style, thickness and colour still apply in every theme

  Scenario: Typing fast on a slow phone never crashes the builder (React #185, L-3, 2026-10-02)
    Given a long page built through the blocks panel
    And the browser slowed three times, like a low-cost phone
    When I type 450 characters into each of 12 text blocks without pausing, switching Tablet and Desktop between them
    Then the builder never stops with "Maximum update depth exceeded"
    And typing makes no new size observer on the canvas frame
    And a row of three cards still fills its line at Tablet afterwards

  Scenario Outline: After a resize, the canvas draws every column exactly as a reload does (L3-p, 2026-10-03)
    Given a row of three columns built through the blocks panel, with a Stack under it
    When I drag the <block> by its <edge> edge <distance>
    Then no column is left holding a broken flex value
    And every block on the canvas is drawn exactly as it is after reloading the page
    And a column alone on its line still fills it, as it does in the Preview

    Examples:
      | block                 | edge   | distance |
      | first column          | right  | +120px   |
      | first column          | right  | -120px   |
      | first column          | bottom | +60px    |
      | block under the row   | top    | -40px    |
      | block under the row   | top    | +40px    |
      | block under the row   | bottom | +60px    |

  Scenario: Bringing a wrapped column back never stores the line over 100% (c-11b, 2026-10-03)
    Given a row of four columns in a main column, the first two widened until the fourth dropped below
    When I narrow the third column so the fourth comes back beside it
    Then the four columns store at most 100% between them
    And on a tablet the last column does not drop to a line of its own

  Scenario: A burst of typing is one step — one save, one Undo — and no word is lost (c-12b, decided 2026-10-02)
    Given I am typing into a heading on the canvas
    When I type a sentence without pausing
    Then the site is saved once the typing pauses, not once per key
    And one Ctrl+Z takes back the whole sentence
    And words typed just before I leave the block, hide the tab or close the page are kept

  # ── BATCH L-4 (2026-10-03) — scripts/uat/uat-l4-headed.js, six headed windows ─────────────────────────────

  Scenario: The block toolbar never covers a handle, however narrow the block (E2-8)
    # tests/e2e/chrome-follows-resize.spec.ts ("a press on each handle of a narrow block lands on that handle")
    Given a block narrower than twice the block toolbar is selected — every block on a phone's shrunk canvas
    When I press on any of its eight handles
    Then the press lands on that handle, because the toolbar sits clear of them above the block

  Scenario: The resize handles never cover the block's own words (c-21, decided 2026-09-29: B)
    # tests/unit/mirror-box-churn.test.ts (mirrorFlushSides)
    Given a heading that hugs its words is selected
    Then all eight handles are drawn just outside it, so its first and last letters stay visible
    And on a side flush against the edge of the canvas that handle stays just inside, visible and draggable

  Scenario: A grid gives up columns rather than break a word (c-8, decided 2026-09-29: B)
    # tests/unit/grid-words-never-break.test.ts · scripts/uat/probe-l4-c8.js
    Given six Stats "1,000+" in a grid inside a 70% main column
    When the page is viewed at every screen size
    Then every "1,000+" is on one line
    And the grid steps down by its narrowest cell that holds words, as evenly as it can: six go 3 + 3, never 5 + 1
    And breaking a word is left for one column that cannot hold it alone

  Scenario: A row of words that has to wrap shares its columns evenly (L4-h, decided 2026-10-03)
    Given a row of four Stats in a 70% main column
    When the page is viewed at Laptop 1024
    Then they sit 2 + 2, never 3 with one alone

  Scenario: A block dragged back to its words' width fits them again (L4-f, decided 2026-10-03)
    # tests/e2e/hug-round-trip.spec.ts
    Given a heading that hugs its words on a page drawn smaller than life
    When I drag its right edge in until the words wrap, and back out again
    Then the words are on one line again and the heading is its old height

  Scenario: The builder's top bar is one row on a desktop (D3-32, E3-7)
    # tests/e2e/builder-chrome-fits.spec.ts
    Given the builder on a screen of any width from 1280px to 1920px
    Then the top bar is a single row
    And below 1600px Add a band, Page check, Preview, Export and Reset show only their icons
    And each keeps its name for a screen reader and as a tooltip, and works by click and by keyboard
    And below 1800px the right-hand group's words (Guides, Hidden, Base size, the theme name) are icons too

  Scenario: An open dialog has the keyboard (E3-9, E3-10, E3-11)
    # tests/e2e/builder-chrome-fits.spec.ts · tests/components/shared/Modal.test.tsx
    Given I open the Page check from the top bar with the keyboard
    Then the focus is inside the dialog
    And Ctrl+Z changes nothing on the page behind it
    When I press Escape once
    Then the dialog closes and the focus is back on the Page check button
