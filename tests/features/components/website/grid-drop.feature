Feature: A grid for every stack — the grid is how a block is dropped
  BATCH LE-15o (docs/TASK_TREE.md). The user, 2026-10-21: "a grid for a particular stack… use that grid to be the reason why
  user can drag and drop… even if it's invisible… on any page… the movement needs to be seamless". Research:
  docs/web-anatomy/drag-and-drop/grid-drop.md. SIGNED 2026-10-21: neighbours make room (Shift = an exact spot) · a stack uses
  the page's columns (12, 6 on a phone) · the grid is drawn while dragging only (and, as before, when the page or a grid is
  selected, Shift+G).
  Guards: tests/e2e/grid-drop.spec.ts · tests/unit/grid-drop.test.ts

  Background:
    Given a page made from the School home template through the UI

  Scenario: While a block is carried, the columns of the box under the pointer fade in (LE-15o (1))
    When I carry a block over a section, a stack or a Grid
    Then that box's columns are drawn over it — the page's 12 (6 on a phone), or a Grid's own tracks — and follow the pointer from box to box
    And when I let go, or press Escape, they fade away
    And when no block is carried they are not drawn, unless the page or a grid is selected or Shift+G is on, as before
    And with "reduce motion" set they appear and go without fading

  Scenario: Every stack has the page's columns (LE-15o (2))
    Given a stack holding two blocks side by side
    Then each block's width is a whole number of the stack's columns — "6 of 12" each
    And the published page draws them exactly as the canvas does, on every screen

  Scenario: A drop beside others snaps to whole columns and the neighbours make room (LE-15o (3))
    When I carry a block beside two blocks that share a line in a stack
    Then the place it will take is drawn as a band of whole columns, with its size in words ("4 of 12")
    And when I let go the three share the line in whole columns, nothing overlapping and no hole left
    And a line that is full starts a new line instead

  Scenario: Shift while dropping puts it in an exact spot (LE-15o (4))
    When I hold Shift as I let go over empty columns of a line
    Then the block takes the columns under the pointer, nothing else moves, and the empty columns before it are kept

  Scenario: The same without dragging (LE-15o (5))
    Given a block beside another in a stack, selected
    Then the Inspector says "Columns (of 12)" and "From line" / "To line", and changing them moves it on the stack's columns
    And Alt+← / → make it one column wider or narrower (Shift: half), each change said in plain words — as on a row of the page
    And the page-only settings (bleed to the page edge, rows tall, free inside its columns) stay on rows of the page

  Scenario: The neighbours make room across a row, smoothly (LE-15o (6))
    When I carry a block into a line it is not part of
    Then the blocks of that line slide and narrow to open its band of columns, in about a fifth of a second
    And every frame of the drag stays under 16 ms on a slow phone (scripts/uat/measure-drag.js)
