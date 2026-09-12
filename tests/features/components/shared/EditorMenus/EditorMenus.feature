Feature: Shared Editor Menu Components
  As a developer building document and presentation editors
  I want a unified menu system shared across all editors
  So that menus look and behave identically everywhere

  # ──────────────────────────────────────────────────
  # EditorMenuBar
  # ──────────────────────────────────────────────────

  Scenario: EditorMenuBar renders all menu buttons
    Given an EditorMenuBar with menus for File, Edit, and View
    When the component renders
    Then buttons labeled "File", "Edit", and "View" should be visible

  Scenario: Clicking a menu button opens its dropdown
    Given an EditorMenuBar with a File menu containing "New" and "Open"
    When the user clicks the "File" button
    Then a dropdown panel should appear with "New" and "Open" items

  Scenario: Hovering between menu buttons switches the open menu
    Given the "File" menu is open
    When the user hovers over the "Edit" button
    Then the "Edit" dropdown should open and "File" should close

  Scenario: Clicking outside the menu closes it
    Given a menu dropdown is open
    When the user clicks outside the menu
    Then the dropdown should close

  # ──────────────────────────────────────────────────
  # EditorMenuItemRow
  # ──────────────────────────────────────────────────

  Scenario: Menu item displays icon, label, and shortcut
    Given a menu item with label "Bold", icon Bold, and shortcut "Ctrl+B"
    When the item renders
    Then the icon should appear in a 20px column on the left
    And the label "Bold" should be visible
    And the shortcut "Ctrl+B" should appear on the right

  Scenario: Menu item with submenu shows chevron and opens on hover
    Given a menu item with label "Download" that has a submenu
    When the user hovers over the item
    Then a chevron icon should be visible
    And the submenu should appear after a short delay

  Scenario: Divider item renders as a horizontal line
    Given a menu item with divider: true
    When the item renders
    Then a thin horizontal separator line should appear

  Scenario: Checked menu item shows a check mark
    Given a menu item with isChecked: true
    When the item renders
    Then a blue check icon should replace the normal icon

  Scenario: Disabled menu item cannot be clicked
    Given a menu item with disabled: true
    When the user clicks the item
    Then the onClick handler should not fire
    And the item should appear grayed out

  # ──────────────────────────────────────────────────
  # ViewMenuPanel (Responsive)
  # ──────────────────────────────────────────────────

  @responsive
  Scenario: ViewMenuPanel shows as glassmorphism dropdown on desktop
    Given the viewport is wider than 767px
    When a ViewMenuPanel renders
    Then it should appear as an absolutely positioned dropdown
    And it should have backdrop-blur and semi-transparent background

  @responsive
  Scenario: ViewMenuPanel shows as bottom sheet on mobile
    Given the viewport is narrower than 767px
    When a ViewMenuPanel renders
    Then it should appear as a bottom sheet portalled to document body
    And it should have a drag handle at the top

  # ──────────────────────────────────────────────────
  # ViewMenuItem
  # ──────────────────────────────────────────────────

  Scenario: ViewMenuItem renders with 44px minimum height
    Given a ViewMenuItem with label "Slideshow" and icon Play
    When the item renders
    Then it should have a minimum height of 44px
    And the font weight should increase on hover

  Scenario: ViewMenuItem shows description text below label
    Given a ViewMenuItem with label "Editing" and description "Edit directly"
    When the item renders
    Then the description should appear below the label in a smaller lighter font

  # ──────────────────────────────────────────────────
  # ViewMenuToggle
  # ──────────────────────────────────────────────────

  Scenario: ViewMenuToggle renders an iOS-style pill switch
    Given a ViewMenuToggle with label "Show ruler" and isOn: false
    When the item renders
    Then a gray pill switch should appear on the right side

  Scenario: ViewMenuToggle switches state on click
    Given a ViewMenuToggle with isOn: false
    When the user clicks the toggle
    Then onToggle should be called
    And the pill switch should visually change to blue (on state)

  # ──────────────────────────────────────────────────
  # MENU_DIVIDER constant
  # ──────────────────────────────────────────────────

  Scenario: MENU_DIVIDER creates a divider item
    Given the MENU_DIVIDER constant
    Then it should have divider: true and an empty label
