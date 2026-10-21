Feature: Drag that feels like picking it up — smooth, instant, never mechanical
  BATCH LE-15n (docs/TASK_TREE.md). The user, 2026-10-21: "the drag and drop needs to be extremely smooth… you can drag and drop
  within a stack, or outside a stack… right now it seems very lagging… it looks mechanical… just click, drag and drop, like how
  you drag and drop a file into a section… it needs to be instant". Research: docs/web-anatomy/drag-and-drop/README.md.
  The build's scenarios are written from the research's signed "enough" checklist; this file starts with the measurement.
  Guards: scripts/uat/measure-drag.js · scripts/uat/uat-le15n-headed.js · tests/e2e/drag-feel.spec.ts · tests/unit/drag-feel.test.ts

  Background:
    Given a page made from the School home template through the UI

  Scenario Outline: A drag is measured, not judged by eye (<screen>)
    Given the editor at <screen>, on the production build, alone on the machine
    When a block is dragged the way a person drags it there (a mouse's grip, a finger's long press) for two seconds, past its neighbours
    Then the time between frames is recorded — the median, the 95th percentile and the longest — and every task longer than 50 ms
    And the time from a pointer move to the drop line moving is recorded
    And the numbers are written to scripts/uat/logs/drag-feel/<screen>.json, so the build is measured before and after against them
    And with --profile, the JavaScript time of the drag is summed by function — the top functions named — so the cause is measured
    Examples:
      | screen                                  |
      | 1600 desktop, a mouse                   |
      | 1600 desktop, a mouse, CPU 4× slower    |
      | 375 phone, a finger, CPU 4× slower      |

  # ── The build, as signed by the user 2026-10-21 ("Signed, build it") ──

  Scenario: Press anywhere on a block and drag it — no grip to find (LE-15n (1))
    Given a block on the page
    When I press on it and move the mouse 5 px
    Then it lifts and follows the pointer, and lands where I let go
    And a still click only selects it, as before; a second click still places the caret in its words
    And after a double-click in its words (or "Edit text", Enter, F2), pressing and dragging in them selects words, never the block — Escape or another block ends that
    And a first click already puts the caret in the words, so I can type at once — and a press and a move still carries the block
    And a finger lifts a block by holding it 250 ms; a move before that scrolls the page

  Scenario: The block itself follows the pointer (LE-15n (2))
    When I drag a block
    Then a copy of it, in its own shape and no larger than 280 px, follows the pointer, raised with a shadow
    And the block stays where it was, faded to 40 %, until it lands
    And the chip under the pointer says where it will go in plain words

  Scenario: Its neighbours make room (LE-15n (3))
    When I drag a block along its own stack or row
    Then the blocks between where it was and where it will land slide apart (200 ms) to open its place, and the faded block moves into it
    And when the pointer leaves its stack, they slide back and the line shows the place, the container it goes into outlined

  Scenario: Letting go glides it into place; Escape glides it home (LE-15n (3))
    When I let go
    Then the block glides from where I let go into its new place, and the blocks around it to theirs (220 ms)
    And Escape, or the browser taking a finger back, glides it back home and changes nothing
    And with "reduce motion" set, nothing slides or glides: it is placed at once

  Scenario: Nothing renders while a block is dragged (LE-15n (4))
    When a block is dragged for two seconds
    Then no frame between the lift and the release is longer than 50 ms, with the CPU 4× slower

  Scenario: The same on every screen, by a mouse and by a finger (LE-15n (5))
    Given every screen of scripts/uat/screens.js, six headed windows at a time
    When the welcome quote is carried below the head's name — by a finger's 250 ms hold under the dock line, by a mouse's press above it
    Then a copy follows, the name makes room (or a line shows the place), the chip names the place, and it lands there
    And carried and put back with Escape (a mouse), nothing has moved

  Scenario: Near the editor's top or bottom it scrolls — gently at first, faster the nearer the edge (LE-15n, EDGES)
    When I carry a block to the editor's bottom edge and hold it there
    Then the page scrolls, eased in over half a second, faster the nearer the edge (up to 28 px a frame — config/layout.json drag)

  Scenario: Every move is said to a screen reader (LE-15n, KEYBOARD AND SCREEN READERS)
    When a block is moved — by the arrow keys, the bar's arrows, its menu or a drop
    Then the page says where it now is, in plain words: "Moved · Below · Text: Mrs Ngozi…"