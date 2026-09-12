Feature: File Card Grid
  As a developer
  I want a reusable grid of file/folder cards
  So that any page can display files in a card layout with actions and load more

  Background:
    Given the FileCardGrid component is rendered with items

  Scenario: Renders items in a responsive grid
    Then items should display in a grid (2 cols mobile, 3 tablet, 5 desktop)

  Scenario: Each card has title bar, preview, and footer
    Then each card should have a title bar with icon + name + menu
    And a preview area with type-specific content
    And a footer with time and owner avatar

  Scenario: Folders always appear first
    Given items include folders and files
    Then folders should be rendered before files

  Scenario: Cards are clickable
    When I click a card
    Then onItemClick should fire with the item data

  Scenario: Context menu shows on three-dot click
    When I click the menu button on a card
    Then onMenuOpen should fire with the item

  Scenario: Rename mode shows inline input
    When renamingId matches an item
    Then the title bar should show an editable input

  Scenario: Load more button appears when items exceed limit
    Given 15 items and initialCount is 10
    Then 10 cards should be visible
    And a "Show more (5 remaining)" button should appear below

  Scenario: Clicking load more shows more items
    When I click load more
    Then 5 more items should appear with animation

  Scenario: Owner avatar has hover popup
    When I hover over an owner avatar
    Then the AvatarHover popup should appear

  @visual
  Scenario: Cards have proper type-specific previews
    Then video cards show dark background with play button
    And audio cards show violet gradient with waveform
    And image cards show landscape placeholder
    And document cards show text-line preview or real content
    And folder cards show folder icon with item count
