Feature: Box Builder — every screen size has a layer of its own
  As a teacher tuning how a page looks on different screens
  I want the width I am previewing to be the width I am editing
  So that fixing one screen does not silently change another

  Background:
    Given the builder previews a page at Mobile, Tablet, Laptop, Desktop, Wide and Full width
    And the ladder has five rungs — phone, tablet portrait, tablet landscape, desktop, big desktop
    And whatever the canvas shows is exactly what the exported site shows

  # ── The defect this replaced ──
  Scenario: Each preview width edits its own layer
    Given a teacher switches the preview to Wide
    When they adjust how something looks
    Then only the big-desktop layer changes
    And the Desktop view they tuned a moment ago is untouched
    # Laptop, Desktop AND Wide used to write to the same layer. Switching to Wide and fixing what you saw
    # silently rewrote the layer driving every screen from 900px up, with nothing on screen to say so — a
    # control that appears to do one thing and does another.

  Scenario: Nothing a school has already built changes
    Given a page saved under the earlier three-layer model
    Then it looks exactly as it did
    And no migration runs
    # The old `tablet` slot was the only tablet layer there was, so it still covers BOTH orientations, and the
    # old `mobile` slot is still the phone. A new edit writes the new name and wins; the old value is left alone.

  Scenario: Reverting a rung really reverts it
    Given a block edited at the phone under the earlier model
    When the teacher resets that rung
    Then the block goes back to what it inherits
    # Clearing only the new slot name would leave the older value in place and the block looking unchanged —
    # a "reset" button that does nothing.

  # ── Which way the cascade runs ──
  Scenario: A change applies at its rung and every narrower one
    Given a width set at tablet landscape
    Then tablet portrait and the phone inherit it
    And the desktop is untouched
    # This is what the three-layer model always did. Reversing it would silently redraw every saved page.

  Scenario: Big desktop is its own branch
    Given a width set at tablet landscape
    Then the big-desktop view still shows the desktop width
    # A big desktop is not a narrowed anything.

  # ── What reaches the visitor ──
  Scenario: Five layers become five screens
    Given a block given a different width at all five rungs
    Then the exported page carries one media query per rung above the phone
    And each one is at that rung's own width, taken from the ladder
    And they appear narrowest first, so a wider screen wins without any specificity trick

  Scenario: The phone needs no query at all
    Then the phone layout is the plain, unqualified rule
    # Mobile-first: the narrowest screen is the starting point, not an exception to it.

  Scenario: A rung that changes nothing costs nothing
    Given a rung whose look is identical to the rung below it
    Then the page ships no rule for it
    # Each rung is diffed against its neighbour, so the sheet only pays for real differences.

  Scenario: A rung cannot exist in the model with nothing emitting it
    Then every rung on the ladder is reachable from the exported stylesheet
    # The shape of the dead container queries and the `--eu-container-max` variable nothing ever set.

  # ── Saying which layer you are on ──
  Scenario: The editor names the rung being edited
    Then the banner and the per-rung controls read the rung's name from the ladder
    # They used to spell the names out again locally, which is how the chips and the model drifted apart.

  Scenario: An unknown rung cannot take the inspector down
    Given a rung name the editor does not recognise
    Then the inspector still renders
    # It reached `.toLowerCase()` on an undefined label and destroyed the whole panel — every control lost at
    # once, from one bad string.
