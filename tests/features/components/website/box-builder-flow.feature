Feature: Flow and overlap — words round a picture, a sideways strip, a section over the one above (BATCH LE-13)
  A picture in a Stack lets the words after it run beside it and back under it (FL-3); a Side by side that does not fit keeps one
  line that scrolls sideways and snaps (FL-6); a page section is pulled up over the section above without covering it (PO-4).
  Words: config/inspector.json `flow` · numbers: config/layout.json `flow` (RULE CFG).
  Guards: tests/unit/flow.test.ts · tests/components/website/BoxInspector.test.tsx (LE-13) · HEADED: scripts/uat/uat-le13-headed.js · scripts/uat/uat-le13c-headed.js

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

  Scenario: words round a picture on the phone only (LE13-19)
    Given a picture whose Wrap words round it → Start is set on the Mobile screen only, as the app sets it
    When the Preview is at a phone width where its Stack is narrower than config/layout.json flow.wrapBelowRem
    Then the picture is the whole width of the line and the words follow it
    And at a phone width where its Stack is at least that wide the words run beside it
    And from the tablet up the picture does not float

  # BATCH LE-13b · FL-3b — the rest of the signed FL-3, "round its shape" (the user 2026-10-18: "build it now").
  # Words: config/inspector.json flow.shape* · numbers: config/layout.json flow.shapeThreshold, the gap flow.wrapGapRem.
  Scenario: the words follow a round head-teacher photo
    Given a picture set to Wrap words round it → Start, its corners rounded to a circle
    When I pick Words follow → Its round corners
    Then the lines beside the picture start where its curve is, a gap of config/layout.json flow.wrapGapRem away from it
    And the lines beside the middle of the circle are shorter than the lines beside its top and bottom
    And the canvas and the Preview draw the same lines

  Scenario: the words follow a cut-out picture's outline
    Given a picture with a see-through background, uploaded, set to Wrap words round it → Start
    When I pick Words follow → A cut-out's outline
    Then the builder traces what is drawn in the picture into an outline, row by row (config/layout.json flow.outlineRows,
      a pixel counts when it is more opaque than flow.shapeThreshold)
    And the lines run up to the edge of what is drawn, a gap of config/layout.json flow.wrapGapRem away from it, at every width
    And where the picture is see-through the words come in close
    And the published page fetches nothing more for the outline: it is part of the page, and the picture keeps its phone copies
    # LE13b-9, measured 2026-10-18: Chrome lays a shape-outside IMAGE on a non-replaced float out at the image's own pixel size,
    # so a url() shape on the picture's (fluid) box never matched it — the outline is a polygon in %, which scales with the box.

  Scenario: a new picture brings its own outline
    Given a picture following A cut-out's outline
    When I replace it with another cut-out
    Then the words follow the new picture's outline, not the old one's

  Scenario: Words follow its box, as before
    Given a picture set to Wrap words round it with rounded corners
    When I pick Words follow → Its box
    Then the words keep to the picture's rectangle, as they did before LE-13b

  Scenario: a picture whose outline cannot be traced keeps to its box
    Given a picture the browser cannot read back (from another site with no permission), or a stored outline that is not one
    When it is set to A cut-out's outline
    Then the words keep to the picture's rectangle and nothing breaks

  Scenario: the shape gives way on a narrow screen with the float
    Given a picture set to Wrap words round it and Words follow → Its round corners
    When its Stack is narrower than config/layout.json flow.wrapBelowRem
    Then the picture is the whole width of the line and the words follow it under it

  Scenario: Words follow is offered only with the wrap
    Given a picture alone on its line in a Stack with Wrap words round it → Off
    Then there is no Words follow
    When I pick Wrap words round it → Start
    Then Words follow shows Its box, Its round corners and A cut-out's outline, Its box chosen
    And it works by keyboard, in light, dark, midnight and purple

  # BATCH LE-13c · LE13b-15a — Space round it, per picture (the user 2026-10-18: Should, "a user can also do it through the UI").
  # Words: config/inspector.json flow.gap* · numbers: config/layout.json flow.wrapGapRem (the default), flow.wrapGapMax.
  Scenario: more space between the head teacher's photo and the words
    Given a picture set to Wrap words round it → Start
    Then its Space round it shows the default, config/layout.json flow.wrapGapRem
    When I drag Space round it to a bigger step of the spacing scale
    Then the words beside the picture and under it move that far away from it, on the canvas and in the Preview alike
    And it follows the reader's text size and the screen like every other space (the spacing unit)
    When I drag it to 0
    Then the words come right up to the picture
    When I pick Back to default
    Then the space is config/layout.json flow.wrapGapRem again

  Scenario: the space follows the picture's shape
    Given a picture set to Wrap words round it with Words follow → Its round corners, or A cut-out's outline
    When I set its Space round it
    Then the words keep that space from the curve or the outline, not only from its box

  Scenario: a different space on the phone
    Given a picture with Space round it set on the Desktop screen
    When I set another Space round it on the Mobile screen
    Then a phone shows the Mobile space and a desktop the Desktop one

  Scenario: Space round it is offered only with the wrap
    Given a picture with Wrap words round it → Off
    Then there is no Space round it
    When I pick Wrap words round it → End
    Then Space round it is shown under Words follow, works by keyboard and is readable in light, dark, midnight and purple
    And a stored space that is not a number, below 0 or above config/layout.json flow.wrapGapMax is held inside 0 … flow.wrapGapMax

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
