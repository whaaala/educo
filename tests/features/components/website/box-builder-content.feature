Feature: Box Builder — content types & links
  As a website designer using the Box Builder
  I want the blocks people actually put on pages, and real links
  So that I can build complete pages, not just text/heading/button/image

  Background:
    Given the Box Builder add menu (⋯ → Add inside)

  Scenario Outline: Add each content block
    When I add a "<block>" inside a section
    Then a "<block>" element is created with sensible defaults and can be styled/positioned like any box

    Examples:
      | block   |
      | Video   |
      | Icon    |
      | List    |
      | Divider |
      | Embed / HTML |

  Scenario: Video embeds YouTube / Vimeo, or plays a direct file
    Given a Video element
    When I paste a YouTube or Vimeo URL
    Then it renders as an embedded player
    And a direct .mp4 URL renders an inline <video> player

  Scenario: Icon element from a curated set
    Given an Icon element
    When I pick an icon, size and colour
    Then that icon renders at the chosen size/colour and can be aligned

  Scenario: List element
    Given a List element
    When I choose bulleted or numbered and edit the items (one per line)
    Then the list renders with that marker and those items

  Scenario: Divider element
    Given a Divider element
    When I set its colour and thickness
    Then a horizontal line renders (its thickness never doubles as a box border)

  Scenario: Embed / custom HTML
    Given an Embed element
    When I paste HTML or an <iframe>
    Then it is injected and rendered (inert in the editor so the box stays selectable)

  Scenario: Links — external, new tab, and in-page anchors
    Given a Button element
    When I set a URL (or "#anchor") and toggle "open in new tab"
    Then the button links there, opening a new tab when chosen
    And any box can be given an Anchor name (slugified) so a "#anchor" link scrolls to it

  Scenario: New content types work across themes, screen sizes and are accessible
    Then each renders correctly in light/dark/midnight/purple, reflows responsively, and exposes aria labels
