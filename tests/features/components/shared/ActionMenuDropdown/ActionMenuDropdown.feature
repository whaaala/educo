Feature: Action Menu Dropdown
  As a developer
  I want a reusable dropdown menu component
  So that any button can show a list of contextual actions with icons, labels, dividers, and submenus

  Background:
    Given the ActionMenuDropdown component is rendered with menu items

  # ── Core Behavior ──

  Scenario: Dropdown opens when trigger is clicked
    When I click the trigger element
    Then the dropdown menu should appear below the trigger
    And it should animate in with fade and slide

  Scenario: Dropdown closes when clicking outside
    Given the dropdown is open
    When I click anywhere outside the dropdown
    Then the dropdown should close

  Scenario: Dropdown closes when pressing Escape
    Given the dropdown is open
    When I press the Escape key
    Then the dropdown should close

  # ── Menu Items ──

  Scenario: Menu items render with icon, label, and optional shortcut
    Given the menu has items with icons and shortcuts
    Then each item should display its icon on the left
    And the label text in the middle
    And the keyboard shortcut on the right (if provided)

  Scenario: Clicking a menu item fires its onClick and closes the dropdown
    When I click a menu item
    Then the item's onClick callback should fire
    And the dropdown should close

  Scenario: Dividers separate groups of items
    Given the menu has divider items
    Then a horizontal line should render between item groups

  Scenario: Items with submenu arrows indicate nested menus
    Given a menu item has hasSubmenu=true
    Then a right-pointing chevron should appear on that item

  # ── Data-Driven ──

  Scenario: Menu items are passed via props for reusability
    When I render with different items arrays
    Then the dropdown should render the corresponding items
    And no items should be hardcoded in the component

  Scenario: Workspace items are automatically included
    Given the Workspace section has "Documents", "Presentations", and "My Drive"
    When the "+ New" dropdown opens
    Then it should show creation options for each workspace item
    And if a new workspace item is added, it should appear automatically

  # ── UI / Look and Feel ──

  @visual
  Scenario: Dropdown matches Google Drive style
    Then the dropdown should have a white background with shadow
    And items should have consistent padding and font size
    And hover state should show a light background highlight
    And icons should be properly sized and colored per type

  @visual
  Scenario: Trigger can be any element (button, title, etc.)
    When used with an AddButton as trigger
    Then the dropdown should position below the button
    When used with a title text as trigger
    Then the dropdown should position below the title with a chevron
