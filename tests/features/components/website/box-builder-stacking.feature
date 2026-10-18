Feature: Box Builder — the page can never cover the editor
  As a teacher building a page with overlapping blocks
  I want the controls for the block I selected to stay reachable
  So that I am never left looking at something I cannot edit or delete
  Guards: tests/unit/stacking.test.ts

  Background:
    Given a page where blocks can be lifted onto their own layer and stacked
    And an editor drawn on top of that page
    And whatever the canvas shows is exactly what the exported site shows

  # ── Two ladders, and a gap nothing may occupy ──
  Scenario: A page number and an editor number can never be confused
    Then everything a visitor can see sits below the page ceiling
    And everything only the editor sees sits above the chrome floor
    And the gap between them is wide enough that no hand-typed number crosses it
    # They used to share one range: the editor's furniture was at 20–50, and so was the page's.

  Scenario: A stacking order comes from a named tier, never a bare number
    Then no file in the builder writes a stacking number of its own
    # A constant is only a convention until something enforces it. A guard scans for the literals.

  # ── The escalation that started it ──
  Scenario: Bring to front cannot climb out of the page
    Given a floating block
    When a user presses "Bring to front" a hundred times
    Then its stacking order is still below the editor's range
    # It was `max + 1` with no ceiling. Twenty presses on a page that already had a high float was enough.

  Scenario: A value that arrived some other way is clamped too
    Given a block whose stored stacking order is absurd — pasted, imported, or hand-edited
    Then the canvas renders it clamped
    And the published page renders it clamped to the same value
    # Clamping inside the button protects the button. Both renderers read one helper, so every path is covered.

  Scenario: A sensible order is left exactly as it is
    Given a block with a stacking order of 3
    Then it renders as 3
    # The clamp is a ceiling, not a rewrite.

  Scenario: Send to back is bounded too, and "behind its siblings" is still allowed
    Given a floating block
    When a user presses "Send to back" a hundred times
    Then its stacking order is below its siblings but no lower than the page's floor

  Scenario: A broken stacking value falls back instead of reaching the page
    Given a block whose stored stacking order is missing, not a number, or endless
    Then it renders on the page's "raised" layer
    And a fraction is rounded down to a whole number

  Scenario: The layers are in the order the reader and the gestures need
    Then on the page: the base, then raised blocks, then sticky bars, then overlays, then a dimmed backdrop, then a toast
    And in the editor: a block's outline under its bar, the handles under the toolbar, the narrow-screen drawer over the
      toolbar and the panel, then the selection box, the snap guides, the drop zone, the drag ghost, and the cursor veil on top
    And a toast notice on the page sits on the page's toast layer

  Scenario: Nothing in the published site reaches the editor's range
    Given a page with a block whose stored stacking order is forty thousand
    When the site is exported
    Then every stacking order in its files is at or below the page ceiling

  # ── What the ladder alone could not fix ──
  Scenario: A neighbour cannot bury the controls of the block being edited
    Given two overlapping floating blocks
    And the lower one is selected
    Then its toolbar and its resize handles are the things under the pointer
    # The real shape of the bug. The chrome used to render INSIDE the block's own wrapper, and a wrapper with a
    # stacking order traps everything inside it — so the z-index on the handles was present, correct and
    # completely inert. The chrome now lives in a fixed mirror of the block's box, above the whole page.

  Scenario: The page underneath stays clickable
    Then the mirror itself intercepts no pointer at all
    And each control inside it does
    # A full-size invisible box over the block would have made the block unselectable — a worse bug.

  Scenario: The mirror follows its block
    When the page scrolls, the window resizes, or the block reflows as its text grows
    Then the controls stay on the block
    # Neither scrolling nor a reflow re-renders anything by itself, so both must ask for a fresh measurement.

  Scenario: Only the selected block pays for it
    Given a page of two hundred blocks
    Then exactly one mirror exists

  # ── A11y, found while fixing the above ──
  Scenario: The block's controls announce themselves as a group
    Then the bar is a toolbar with a name
    # It had no role and no name at all, so a screen-reader user met a run of loose buttons with nothing to say
    # which block they belonged to. The item CRUD bar next to it already did this correctly.
