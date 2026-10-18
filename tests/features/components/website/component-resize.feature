Feature: Sizing a component — it fills its block, stays on the page and never crops
  A component (accordion, alert, card, quote, stat, badge, rating) is resized by its block, and the component itself
  grows and shrinks with it, on the canvas and in the published page alike. A dragged edge never takes it off the
  page, a floated block lands inside its parent with a gap, and shrinking it past its content makes the words
  smaller, down to a readable floor, instead of cutting them off.
  Guards: tests/components/website/component-resize.test.tsx

  # ── RULE G · the component fills its block ──

  Scenario: A resized block's component fills it, on the canvas and in the published page
    Given any component on a page, its block set to the full width and 200px tall
    Then the component itself stretches to fill the block, through every box around it
    And the published page gives it the same fill and the same height
    And a block I have not sized lets its component take only the room it needs

  Scenario: An Alert's message grows with its block
    Given an Alert in a block made taller
    Then its message row takes the extra height, with no empty gap under the message

  # ── RULE H · a dragged top edge is the only edge that moves ──

  Scenario: Dragging the top edge up grows the block by exactly that much
    Given a block from 100 to 180 on a page whose top is at 20
    When I drag its top edge up by 50
    Then its top edge is at 50 and its bottom is still at 180
    And dragged up by any amount it grows by exactly that amount

  Scenario: Dragging the top edge down shrinks it, never below its smallest
    Given a block from 100 to 180
    When I drag its top edge down by 40
    Then it is 40 tall
    When I drag it down far past its bottom
    Then it stops at its smallest height

  Scenario: At the page's top the edge stops and the bottom does not move
    Given a block from 100 to 180 on a page whose top is at 20
    When I drag its top edge up by 120, past the page's top
    Then its top stops at the page's top and its bottom is still at 180
    And dragged up however far, the top never goes above the page
    And a block already against the page's top does not change at all

  # ── RULE K · a Fit block hugs its content ──

  Scenario: Which blocks hug their content
    Then a component whose width is Fit hugs its content
    And one set to Full width or to half the row does not

  Scenario: A component that does not hug adapts to its own width, not the page's
    Given an Alert set to Full width or to half the row
    Then it adapts to the width of its own block, on the canvas and in the published page

  Scenario: A component that hugs is as wide as its words, on the canvas and in the published page
    Given any component whose width is Fit
    Then it is as wide as its content on the canvas and in the published page
    And it gives up adapting to its own width, because it cannot do both

  # ── Floating stays inside the page ──

  Scenario: A floated block stays inside its parent
    Given a block floated with a width over the whole parent and an offset to the right
    Then its width is capped at the whole parent and it moves back inside
    And an offset past the right or the top is pulled back inside, never below zero
    And a floated block that already fits keeps its place and width
    And a width in pixels is left as it is
    And floating any full-width component keeps it wholly inside the page

  Scenario: A newly floated block lands with a gap, not in the corner
    Given a block floated to the very top-left of its parent
    Then it is placed a small gap in from the top and the left
    And a block already further in keeps the place I gave it
    And a full-width block still starts at the left, and no block is pushed out of its parent
    And floating any component from the corner lands it with that gap

  # ── BATCH F-1 · a new component fills its line ──

  Scenario Outline: A newly added <component> <result>
    When I add a <component> from the Blocks panel
    Then it <result>

    Examples:
      | component | result                          |
      | accordion | fills its line                  |
      | alert     | fills its line                  |
      | card      | fills its line                  |
      | quote     | fills its line                  |
      | stat      | hugs its content by nature      |
      | badge     | hugs its content by nature      |
      | rating    | hugs its content by nature      |

  Scenario: Full width and a set width still decide, and saved pages keep their widths
    Given an Alert set to Full width, or to 40%
    Then its component fills its block and does not hug
    And a Card saved before this rule keeps the full width it was saved with

  # ── RULE G · never cropped ──

  Scenario: Making a component taller never crops it
    Given any component made 200px tall
    Then it is not cut off at its edges
    But a component I set to clip is still cut off at its edges

  Scenario: Shrinking a component past its content makes its words smaller, down to a readable floor
    Given any component shrunk to three quarters of what its content needs
    Then everything inside it is drawn at three quarters of its size, and the published page does the same
    And a component at its natural size is not made smaller at all
    And however far it is shrunk, its words never go below the readable floor, which is at least half size

  Scenario: Narrowing a component makes its words smaller only when the wrapping gets untidy
    Given a line of words that would wrap onto more than a tidy couple of lines
    Then the width where it starts to shrink is the one-line width shared over those lines, rounded up
    And never narrower than the longest word
    And wider than that the words keep their size, narrower they shrink in proportion, never below the readable floor
