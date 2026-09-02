Feature: Editable Accordion component in the website builder
  As a teacher building a school website
  I want to drop an Accordion onto any section and edit everything about it
  So that I can present FAQs, pricing, menus and steps exactly how I want, on any device

  Background:
    Given the Box Builder is open with an empty page

  # ── Placement (any section, sized to its space) ──
  Scenario: Add an accordion from the Components palette
    When I click the "Accordion" block in the Components group
    Then a new accordion is added with three starter question/answer items
    And it fills the width of the section it was placed in

  Scenario: An accordion can be dropped into any section
    Given a section with other blocks in it
    When I drag the "Accordion" block onto that section
    Then the accordion sizes itself to the space the section allocates to it
    And it reflows responsively on tablet and mobile like every other block

  # ── Content (everything editable) ──
  Scenario: Edit item titles and bodies inline on the canvas
    Given an accordion is selected
    When I click a header or body and type
    Then the item's title or body updates live

  Scenario: Add, remove and reorder items in the inspector
    Given an accordion is selected
    When I click "Add item"
    Then a new question/answer row appears
    When I move an item up or down
    Then the order changes in the canvas
    When I remove an item
    Then it disappears, but the last remaining item cannot be removed

  Scenario: Per-item media, meta and default-open state
    Given an accordion item
    When I set an image URL, a meta value and tick "Open by default"
    Then the item shows a leading thumbnail, a right-aligned meta, and starts expanded

  # ── Design (54 token-driven designs) ──
  Scenario Outline: Switch the accordion design
    Given an accordion is selected
    When I choose the "<design>" design
    Then the accordion re-skins live using theme tokens (no hardcoded colours)
    And the exported HTML carries the matching eu-accordion<variant> class

    Examples:
      | design        |
      | Solid panel   |
      | Horizontal    |
      | Big number    |
      | Dark glossy   |
      | Two-column    |

  Scenario: Single-open vs multi-open
    Given an accordion is selected
    When "Allow more than one open at once" is off
    Then opening one panel closes the others in the exported site
    When I turn it on
    Then multiple panels can stay open at once

  # ── Colour, background and all CSS editable ──
  Scenario: Re-colour the component with design tokens
    Given an accordion is selected
    When I change Brand, Surface, Background, Text or Muted in "Component colours"
    Then the whole component recolours via CSS variables
    And the same override mechanism works for every Educo UI component

  Scenario: Advanced CSS escape hatch is sanitised
    Given an accordion is selected
    When I type custom declarations in the "Advanced CSS" box
    Then safe "property: value;" rules are applied to the component
    But selectors, @-rules and remote url() are stripped before export

  # ── Export ──
  Scenario: The accordion exports as zero-JS native details/summary
    Given an accordion with items on a page
    When I export the site
    Then each item is a <details>/<summary> that works without JavaScript
    And all titles and bodies are HTML-escaped
