Feature: Tablet Drive Layout & Experience
  As a teacher using the app on a tablet
  I want a desktop-like drive experience with sidebar navigation
  So that I can efficiently manage files on a larger screen

  Background:
    Given I am logged in as an authenticated teacher
    And I am using a tablet device (width >= 768px)
    And I am on the Drive screen

  # ── Sidebar ──

  Scenario: Sidebar displays Drive title and sections
    Then I should see a sidebar on the left
    And the sidebar should show a "Drive" title with a folder icon
    And the sidebar should list sections: Home, My Drive, Shared with me, Recent, Starred, Bin

  Scenario: Active sidebar section is highlighted
    When "Home" is the active section
    Then the "Home" section should have a primary-colored background
    And the "Home" text and icon should use the primary color
    And other sections should use muted colors

  Scenario: Switching sidebar sections updates content
    When I tap "Shared with me" in the sidebar
    Then the content area should show shared files
    And the breadcrumbs should show "Shared with me"

  Scenario: Sidebar shows storage usage
    Then the sidebar bottom should show a storage indicator
    And it should display "Storage" with a cloud icon
    And it should show a progress bar
    And it should display "58.4 MB of 200 MB used"

  # ── Tablet Header ──

  Scenario: Tablet header has search bar and view toggle
    Then the content area should have a search bar
    And the search bar should use a subtle background fill (no border)
    And there should be a view toggle with list and grid options
    And the view toggle should use pill-style with shadow on active

  Scenario: Tablet header has proper top padding
    Then the header should have 48px top padding
    And the sidebar should have 48px top padding
    And content should not overlap with the status bar

  # ── Breadcrumbs ──

  Scenario: Breadcrumbs always visible on tablet
    Given I am on the Home section
    Then breadcrumbs should be visible showing "My Drive"

  Scenario: Breadcrumbs update when navigating folders
    When I tap on the "Presentations" folder
    Then breadcrumbs should show "My Drive > Presentations"
    And "My Drive" should be tappable to navigate back

  Scenario: Breadcrumbs show section name for flat sections
    When I tap "Recent" in the sidebar
    Then breadcrumbs should show "Recent"

  # ── Grid View (Tablet) ──

  Scenario: Tablet grid shows 3 columns
    When I am in grid view
    Then the grid should display 3 columns of file cards

  Scenario: Tablet grid cards have colored preview headers
    Then each grid card should have a colored preview area
    And the preview color should match the file type
    And the icon should be centered in a frosted glass circle
    And decorative circles should appear in the preview background

  Scenario: Grid cards show file type label in body
    Then each card body should show the file name (left-aligned)
    And it should show the type label in the file type's color
    And it should show size/item count and date

  Scenario: Grid cards show owner for shared files
    Given a file is owned by "Mr. Chidi Okafor"
    Then the grid card should show a colored dot and owner name

  Scenario: Grid cards have star badge
    Given a file is starred
    Then a star badge should appear in the top-left of the preview area

  Scenario: Grid cards have menu button
    Then each grid card should have a three-dot menu in the top-right
    When I tap the menu button
    Then the action sheet should open for that item

  # ── List View (Tablet) ──

  Scenario: Tablet list rows are card-style
    When I switch to list view on tablet
    Then each row should be a card with rounded corners and subtle shadow
    And rows should have horizontal margins between them

  Scenario: Tablet list rows have color accent
    Then each row should have a left color accent bar
    And the accent color should match the file type

  Scenario: Tablet list rows show type pill
    Then each row should show a file type pill badge
    And the pill should use uppercase text with the file type color

  Scenario: Tablet list rows show owner column
    Given a file is owned by someone else
    Then the owner name should appear with a colored dot indicator

  # ── Tablet Action Sheet ──

  Scenario: Tablet action sheet appears as centered dialog
    When I long-press on a file
    Then the action sheet should appear as a centered dialog (not bottom sheet)
    And it should have a max width of 400px
    And it should show the same action tiles as mobile

  # ── Tablet Content Spacing ──

  @visual
  Scenario: Tablet grid has proper padding
    Then the grid content should have 18px horizontal padding
    And grid cards should have 6px margins between them

  @visual
  Scenario: Tablet divider separates breadcrumbs from content
    Then a hairline divider should appear below breadcrumbs
    And the divider should have 24px horizontal margin

  # ── FAB on Tablet ──

  Scenario: FAB button positioned at bottom-right
    Then the FAB (+) button should be at the bottom-right
    And it should have 28px offset from edges
    And it should use the primary color
    And pressing it should show a scale animation
