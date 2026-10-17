Feature: The alignment panel, its basics — across / down with Fill, spread, baseline, push (BATCH LE-4)
  A block is placed across and down its parent with one row each, Fill included, and the nine squares set both at once (AC-27).
  Blocks are spread with even spacing, and the lines of a wrapping row are placed in a taller box (AC-25).
  A price and its unit line up on their text (AL-5); one block is pushed to the far end — a menu's last links, a card's button (AL-6).
  Guards: tests/unit/alignment.test.ts · tests/components/website/BoxInspector.test.tsx (LE-4) · HEADED: scripts/uat/uat-le4-headed.js

  Scenario: the nine squares set Across and Down, and the rows show it
    Given a side-by-side row of three cards
    When I pick the middle-centre square for the second card
    Then its Across reads Middle and its Down reads Middle
    When I pick Down → Fill
    Then that one card is the row's full height while the others stay where the row lines them up

  Scenario: Fill across a stack, and End
    Given a heading in a top-to-bottom stack
    When I pick Across → End
    Then the heading sits at the end of its line
    When I pick Across → Fill
    Then the heading is as wide as the line
    When I pick Across → Auto
    Then it sits where the layout puts it again

  Scenario: a grid cell is placed by the same rows
    Given a block in a Grid cell
    When I pick Across → End
    Then it sits at the end of its cell
    And there is no second "Line up (across)" control for the same thing

  Scenario: a place for one screen only
    Given a block with Across → Middle
    When I edit the Mobile screen and pick Across → Start
    Then on a phone it sits at the start and on a desktop in the middle

  Scenario: even spacing is different from space around and spread out
    Given a row of four short buttons
    When I pick Position blocks → Even spacing
    Then the room before the first, between each and after the last is the same
    When I pick Space around
    Then the room at the edges is half the room between
    When I pick Spread out
    Then the first and last buttons touch the row's ends

  Scenario: wrapped lines placed in a taller box
    Given a wrapping row of ten tags in a box at least 20rem tall
    When I pick Wrapped lines → Bottom
    Then the lines sit together at the bottom of the box
    When I pick Wrapped lines → Spread out
    Then the first line is at the top and the last at the bottom
    When I turn wrapping off
    Then Wrapped lines is not offered

  Scenario: a price and its unit line up on their text
    Given a side-by-side row holding a large price and a small "per term"
    When I pick Line up (down) → Text lines up
    Then the two first lines of text share one baseline on every screen where they sit side by side
    And a top-to-bottom stack does not offer Text lines up

  Scenario: push the last links of a menu to the far end
    Given a header row of a logo and four links
    When I turn on Push to the far end for the third link
    Then the third and fourth links sit at the row's end and the logo and the first two links at its start
    When I turn it off
    Then the links sit where the row puts them again

  Scenario: a card's button at the bottom, level across the row
    Given three cards side by side with words of different lengths and a button each
    When I turn on Push to the far end for each button
    Then the three buttons' bottoms are level wherever the cards sit side by side
    And a growing neighbour never takes the room the push needs (LE4-1)
