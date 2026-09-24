Feature: Box Builder — floating layers (free overlap)
  As a website designer using the Box Builder (/website/box-demo)
  I want to lift a section out of the flow onto its own free-floating layer
  So that I can position it ON TOP of other sections and overlap them freely — from any edge — for creative layouts

  Background:
    Given the Box Builder canvas with a page that is a vertical stack of row bands
    And every section is normally "in-flow": it stacks beside/below its siblings and can never overlap

  # ── Entering / leaving float mode ──────────────────────────────────────────
  Scenario: Float a section from the ⋯ actions menu
    Given a selected in-flow section
    When I open its ⋯ menu and choose "Float on top"
    Then the section is lifted onto its own layer exactly where it sat (no jump)
    And it becomes absolutely positioned inside its nearest content container (never a structural row band)
    And it is given a stacking order above any existing floating siblings
    And its flow-only styling (alignSelf and margins) is cleared

  Scenario: Float a section from the inspector Position toggle
    Given a selected in-flow section
    When I switch the inspector "Position" control from "In-flow" to "Floating"
    Then the section floats, and the inspector reveals X / Y percent inputs and layer controls

  Scenario: Alt-drag lifts an in-flow section into a floating layer in one motion
    Given a selected in-flow section
    When I hold Alt and drag its grip
    Then the section is floated immediately (before it moves) and then follows the cursor freely

  Scenario: Toggle float with the keyboard
    Given a selected section
    When I press Alt+F
    Then it toggles between in-flow and floating

  Scenario: Return a floating section to the flow
    Given a selected floating section
    When I choose "Return to flow" (menu or inspector)
    Then it drops its floating position and re-docks into the flow as a new row
    And the gap it left while floating is closed by the flow reflow

  # ── Moving a floating section ──────────────────────────────────────────────
  Scenario: Drag a floating section anywhere to overlap others
    Given a selected floating section
    When I drag its grip
    Then it moves freely on top of the page and may overlap its siblings from any edge
    And its position is stored as left/top percent of its parent so it stays proportional on every screen size
    And at least half of it always remains within the parent so it is never lost

  Scenario: Alignment guides snap the floating section to nearby edges and centres
    Given a floating section being dragged
    When its left, centre or right edge comes within a few pixels of a sibling's or the parent's edge/centre
    Then it snaps to that line and a bright guide is shown
    And the same applies for its top, middle and bottom against horizontal targets

  Scenario: Nudge a floating section with the arrow keys
    Given a selected floating section
    When I press an arrow key
    Then it moves a small step in that direction
    And holding Shift moves it a larger step

  # ── Sizing & layering ──────────────────────────────────────────────────────
  Scenario Outline: Resize a floating section from any edge (no flow walls)
    Given a selected floating section
    When I drag its <edge> edge
    Then only that edge moves and the opposite edge stays put
    And its width is stored as a percent and its height as a min-height floor (so it still grows with content)

    Examples:
      | edge   |
      | right  |
      | left   |
      | top    |
      | bottom |

  Scenario Outline: Presentation-style layering — full four-level order
    Given several overlapping floating sections
    When I choose "<action>" (⋯ menu, inspector, or keyboard)
    Then the chosen section is restacked <result> among its floating siblings only
    And the floating siblings keep a clean sequential stacking order

    Examples:
      | action        | result                       | keyboard      |
      | Bring to Front | all the way to the top       | Ctrl+Shift+]  |
      | Bring Forward  | up exactly one layer         | Ctrl+]        |
      | Send Backward  | down exactly one layer       | Ctrl+[        |
      | Send to Back   | all the way to the bottom    | Ctrl+Shift+[  |

  Scenario: Bring Forward / Send Backward stop at the ends
    Given a floating section already on top (or at the bottom)
    When I choose "Bring Forward" (or "Send Backward")
    Then nothing changes — it is already at that end

  # ── The flow is untouched ───────────────────────────────────────────────────
  Scenario: Floating a section does not disturb the remaining flow
    Given a section that contains flow siblings and one floated section
    When the page is normalized (on every edit, on load)
    Then the floating section is kept as a direct child, never wrapped into a row band, clamped, or pruned
    And the in-flow siblings keep stacking exactly as before

  # ── Responsive / accessible ────────────────────────────────────────────────
  Scenario: Floating positions stay proportional across screen sizes
    Given a floating section positioned at a percentage offset
    When the canvas is previewed at mobile, tablet and desktop widths
    Then the section keeps its proportional position and overlap

  Scenario: Every floating action is reachable without a mouse
    Then float/return, nudge, resize and layering are all available via keyboard shortcuts and inspector controls with aria labels

  # ── The keyboard survives a click ──────────────────────────────────────────
  # tests/e2e/keyboard-survives-selection.spec.ts

  Scenario: Selecting a container with a click leaves every shortcut working
    Given a section with a text block inside it
    When I click the section to select it
    Then the caret is not left behind inside the text block
    And Alt+F floats the section, and floats it back
    And Ctrl+D duplicates it, and Delete removes it
    Because the click that selects the section also lands on the text inside it,
      and that text's editable span takes focus. The key handler refuses to act
      while focus is in editable text — rightly, nobody wants Delete removing a
      section mid-word — so with the caret stranded in a block I never chose,
      EVERY shortcut silently did nothing. Measured: selection "sec", focus a
      contentEditable span in block "tc1". It was reported as a section that
      would not float.

  Scenario: …and typing is still typing
    When I click into a text block until it is the selection
    Then the caret is in that block and what I type appears in it
    Because the fix above must not be paid for with the thing it protects

  # ── Clicking a text block, and clicking away from it ───────────────────────
  # tests/e2e/keyboard-survives-selection.spec.ts

  Scenario: One click into a text block, a pause, then typing — and the text lands
    Given a page I have just opened, with nothing selected
    When I click once on a text block and wait before typing
    Then the caret is in that block and every word I type appears in it
    Because the drill-down rule means that first click selects the outermost
      BAND, not the text — so "is the caret's block the selected one?" is FALSE
      of the very span I clicked into, and answering it by taking the caret away
      threw my words on the floor. Measured: the text went nowhere in 2 of 3
      attempts from a fresh load.

  Scenario: Clicking the empty part of a box does not hand the caret to the text inside it
    Given a box with a text block in it and empty space below that text
    When I click the empty space
    Then the caret is left nowhere, and Ctrl+D still duplicates the selection
    Because it is the BROWSER that puts it there: clicking empty space inside a
      box means "put the caret in the nearest text" to Chrome. Measured — the
      focus arrived 17ms after mousedown, which is mouseup, on the original span,
      with no .focus() call and no Selection call anywhere in the trace. Clearing
      up afterwards lost that race three different ways, one of them leaving the
      caret stranded permanently, so the default action is refused instead.

  # ── Stacked pins (Phase 3 · Step 2c) ───────────────────────────────────────
  # tests/e2e/pins-stack.spec.ts

  Scenario: Two bands held at the same edge sit under one another
    Given three bands each set to stay on screen at the top
    When the page is opened, and again after it is scrolled
    Then each band sits directly below the one before it, and none is hidden
    Because each was doing exactly what it was told — "hold against the top" —
      and with one offset apiece, the top is where all three went. Two of the
      three were simply invisible.

  Scenario: A bottom stack builds upwards
    Given a cookie bar and a back-to-top button both held to the bottom
    Then the LAST of them sits on the edge and the one before it rests on top
    Because a footer is last in the document and at the bottom, so the bottom
      stack has to be read in the opposite direction from the top one. With a
      single bottom bar both directions look identical, which is how the first
      version of the guard passed while the order was reversed.

  Scenario: The editor shows the same stack the published page will
    Given the same three bands on the canvas
    Then they are offset by exactly the same amounts as in the export
    Because the builder's page frame declares container-type, which makes it the
      containing block for anything fixed — so the editor renders a held block as
      `absolute` instead, and the measuring pass has to recognise that. Measured
      before it did: the export stacked correctly and the canvas drew all three
      bands at the same 88px.

  Scenario: A page with one pinned bar ships no stacking script
    Given a page with a single band held at the top
    Then the exported page contains no stacking script at all
    Because zero JavaScript stays the default: a bar with nothing to stack under
      must not cost the page a script it cannot use.
