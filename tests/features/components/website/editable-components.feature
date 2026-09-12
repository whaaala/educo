Feature: Design-system components are fully-editable trees
  As a teacher building a school website
  I want every piece inside a component (a card's title, body, button; a badge's text; a rating's stars)
  to be individually selectable and fully editable
  So that I can change everything about a component without being limited to preset controls

  Background:
    Given the Box Builder is open with an empty page

  # ── Every component is a real tree of editable elements ──
  Scenario Outline: Adding a component builds a tree of editable blocks
    When I add the "<component>" block from the Components palette
    Then it is a real block tree, not a single opaque node
    And every inner piece is a normal, selectable BoxNode
    And the component's own container is the box (there is no extra wrapper around it)

    Examples:
      | component |
      | Card      |
      | Quote     |
      | Stat      |
      | Rating    |

  Scenario: A Card is an editable tree of image + heading + text + button
    When I add a "Card"
    Then it contains an image, a heading, a text and a button, in that order
    And clicking any one of them selects only that element
    And the inspector shows that element's FULL controls (text align, bold/italic/underline, colour, size, font, spacing, link)

  Scenario: A Badge is a single fully-editable text element styled as a pill
    When I add a "Badge"
    Then it is a text element with a pill background and full corner radius
    And I can change its text, colour, size, alignment and radius directly

  Scenario: A Rating is a row of five individually-editable star icons
    When I add a "Rating"
    Then it contains five star icons
    And I can recolour or resize any single star

  # ── Full per-element editing (the point of editable trees) ──
  Scenario: Centre the text inside a card's heading
    Given a Card is on the page
    When I select its heading and set text align to centre
    Then only that heading's text is centred, and the other pieces are unchanged

  Scenario: Bold / italic / underline / colour apply to the exact inner piece
    Given a Card is on the page
    When I select its body text and toggle bold, italic and a new colour
    Then those styles apply to the body text only

  # ── Tokens, responsiveness, no hardcoded colour ──
  Scenario: Components are token-driven and responsive
    Then every component's colours are design tokens (var(--eu-color-*)), never hardcoded hex
    And each component reflows and stacks on tablet and mobile like every other block

  # ── Consistency: this applies to all components, now and future ──
  Scenario: The same editable-tree model is used for all components
    Then Card, Quote, Stat, Badge and Rating are all editable trees
    And any future component added to the builder follows the same editable-tree model
    And the Accordion remains a component whose items are edited inline on the canvas
