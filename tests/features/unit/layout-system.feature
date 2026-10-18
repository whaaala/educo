Feature: The layout layer every published page ships — one ladder, measures, space tiers and section widths
  The system once carried three ladders and a container-width variable nothing set. Now there is one ladder of rungs, read
  from config/layout.json and written in em so a reader who enlarges their text gets the layout for that text; one measure
  per rung; three tiers of space; and a section that can run edge to edge or keep its words in a centred column.
  Guards: tests/unit/layout-system.test.ts

  # ── The rung ladder ──

  Scenario: One ladder, climbing from the phone
    Given the rungs phone, tablet portrait, tablet landscape, desktop and big desktop
    Then each starts wider than the one before, at the width config/layout.json gives it
    And the phone is the starting point, with no screen query of its own
    And every other rung's query is written in em, never in pixels, so it follows the reader's text size
    And every rung has a name of its own, so a preview chip and a query can never disagree

  # ── Measures and sections ──

  Scenario: The page measure widens once per rung
    Then the readable column gets wider at each rung above the phone, and never narrower
    And on the phone there is no cap, because the side space already holds the column in

  Scenario: A section runs edge to edge until I say otherwise
    Given a section on a page
    Then it runs edge to edge, as every section did before the choice existed
    When I set its Content width to a centred column
    Then it is still a full-width band whose background spans the page, and only its content is inset, by padding
    And on a screen narrower than the column it keeps the page's side space, so the words never touch the screen edge
    And choosing "Edge to edge" again is stored, so it outlasts a site content width set later
    And the published page carries the same choice

  Scenario: The choice is made on the section I can select
    Given I click a section, which selects the section inside its band
    When I choose its Content width
    Then the band around it takes the choice
    But a section inside a component has no such choice and cannot change the page section it sits in
    And the bands inside a card are never treated as page sections

  Scenario: One plain section in a centred column paints its colour edge to edge
    Given a centred-column band holding a single coloured section
    Then the section's colour fills the band and its words stay on the measure
    And the left and right inner spacing I give the section is added on top of the measure, never replaced by it
    And a section with nothing set gets nothing added
    But a card (rounded, shadowed or bordered), two sections side by side, or a floating block keep the band's padding

  # ── Space ──

  Scenario: Three tiers of space, largest between sections
    Then the space between sections is larger than the space between groups, and that larger than the space between elements
    And every tier is fluid, so it scales with no screen query

  # ── What a school receives ──

  Scenario: The stylesheet ships only what the page can use
    When I publish a site
    Then the base stylesheet carries the layout layer
    And it declares only the classes the builder actually puts on a page
    And nothing of the old ladders is left in it, and it carries no comments
    And its braces balance, so the browser reads the whole sheet
