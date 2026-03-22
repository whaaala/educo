Feature: Suggested Files Component
  As a developer
  I want a reusable suggested/recent files grid component
  So that any page can show recently accessed files in a modern card layout

  Background:
    Given the SuggestedFiles component is rendered with file items

  Scenario: Component renders a responsive grid of file cards
    Given 5 file items are provided
    Then the cards should display in a responsive grid (not horizontal scroll)
    And each card should show file type icon, name, time, and owner

  Scenario: Cards show file type with colored accent
    Given a document file and a presentation file
    Then the document card should have a blue accent
    And the presentation card should have an amber accent

  Scenario: Clicking a card fires onFileOpen
    When I click on a suggested file card
    Then onFileOpen should be called with that file's data

  Scenario: Cards have hover effects
    When I hover over a card
    Then it should show an elevated shadow
    And the border should highlight in blue

  Scenario: Component accepts custom title
    When rendered with title="Recent"
    Then the section header should say "Recent"

  @visual
  Scenario: Modern card design with icon, metadata, and owner
    Then each card should have:
      | element      | description                              |
      | type icon    | large centered icon in preview area      |
      | accent bar   | colored top border matching file type     |
      | file name    | bold truncated text below preview         |
      | metadata row | type icon + time ago + owner avatar       |

  @responsive
  Scenario: Grid layout is responsive without horizontal scroll
    When viewport is 375px
    Then the grid should show 2 columns
    When viewport is 768px
    Then the grid should show 3 columns
    When viewport is 1280px
    Then the grid should show 5 columns
