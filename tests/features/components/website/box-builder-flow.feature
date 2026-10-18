Feature: Flow and overlap — words round a picture, a sideways strip, a section over the one above (BATCH LE-13)
  A picture in a Stack lets the words after it run beside it and back under it (FL-3); a Side by side that does not fit keeps one
  line that scrolls sideways and snaps (FL-6); a page section is pulled up over the section above without covering it (PO-4).
  Words: config/inspector.json `flow` · numbers: config/layout.json `flow` (RULE CFG).
  Guards: tests/unit/flow.test.ts · tests/components/website/BoxInspector.test.tsx (LE-13) · HEADED: scripts/uat/uat-le13-headed.js

  Scenario: words wrap round the head teacher's photo
    Given a Stack holding a picture and three paragraphs
    When I pick the picture's Wrap words round it → Start
    Then the picture sits at the start of the line at a share of it
    And the first lines of words run BESIDE the picture with a gap between them
    And the later lines run back UNDER it to the full width
    When I pick End
    Then the picture sits at the end of the line and the words run beside it on the other side
    When I pick Off
    Then the picture takes its own line again and the words follow it

  Scenario: on a narrow screen the picture takes the whole line
    Given a picture set to Wrap words round it → Start
    When its Stack is narrower than config/layout.json flow.wrapBelowRem
    Then the picture is the whole width of the line and the words follow it
    And nothing runs off the side of the page

  Scenario: Wrap words round it is offered only where it can work
    Given a picture alone on its line in a Stack
    Then its Arrange shows Wrap words round it
    Given a picture in a Side by side, a Grid cell, or a block that is not a picture
    Then there is no Wrap words round it

  Scenario: a strip of events that scrolls sideways
    Given a Side by side of six cards
    When I pick When it doesn't fit → Scroll sideways
    Then the six cards stay on one line, each keeping its width
    And the row scrolls sideways while the page itself never does
    And on a phone a part of the next card shows
    And a scroll lands a card at the start
    And Tab reaches the strip, which is named, and the arrow keys scroll it
    When I pick Wrap to new lines
    Then the cards wrap onto new lines again

  Scenario: a strip on the phone only
    Given a Side by side of six cards
    When I pick Scroll sideways on the Mobile screen only
    Then on a phone it is a strip
    And on a desktop the cards wrap onto new lines

  Scenario: cards over the hero
    Given a tall coloured hero section and below it a section of three cards
    When I pick the cards' section Overlap the section above → Medium
    Then the cards' section starts that far above the hero's foot and is drawn in front of it
    And the hero grows at its foot by the same amount, so its last words end above the cards
    When I pick Off
    Then the cards' section starts where the hero ends

  Scenario: an overlap on the desktop only
    Given a section set to Overlap the section above → Large
    When I pick Off on the Mobile screen
    Then on a phone there is no overlap
    And on a desktop the section overlaps the hero

  Scenario: Overlap the section above is offered only where it can work
    Given the first section of a page
    Then there is no Overlap the section above
    Given any later section of the page
    Then its Arrange shows Overlap the section above with Off and the steps of config/layout.json flow.overlapSteps

  Scenario: the controls work by keyboard in every theme
    Given the Inspector in light, dark, midnight or purple at 375, 768, 1280 or 1536
    Then Wrap words round it, When it doesn't fit and Overlap the section above are reached with Tab and changed with the arrow keys
    And their hints are readable (at least 4.5 : 1)
