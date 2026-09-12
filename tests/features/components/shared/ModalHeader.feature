Feature: ModalHeader component
  A styled header for modals with an icon, title, close button,
  and support for multiple color variants.

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders title
    Given a ModalHeader is rendered with a title "Delete Item"
    When the component renders
    Then the title text "Delete Item" should be visible

  Scenario: Calls onClose when close button is clicked
    Given a ModalHeader is rendered with an onClose handler
    When the close button is clicked
    Then the onClose handler should be called once

  Scenario: Renders icon
    Given a ModalHeader is rendered with an icon
    When the component renders
    Then an SVG icon should be present

  Scenario Outline: Renders with variant <variant>
    Given a ModalHeader is rendered with variant "<variant>"
    When the component renders
    Then the title should be visible

    Examples:
      | variant |
      | blue    |
      | red     |
      | green   |
      | purple  |
      | orange  |

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: Blue variant has blue background colors across themes
    Given a ModalHeader is rendered with blue variant
    Then the header has "bg-blue-50" class
    And the header has "dark:bg-blue-900/20" class
    And the header has "midnight:bg-cyan-900/20" class
    And the header has "purple:bg-pink-900/20" class

  @visual
  Scenario: Blue variant has blue icon background
    Given a ModalHeader is rendered with blue variant
    Then the icon has a blue circular background with "bg-blue-500" class

  @visual
  Scenario: Red variant has red background colors across themes
    Given a ModalHeader is rendered with red variant
    Then the header has "bg-red-50" class
    And the header has "dark:bg-red-900/20" class

  @visual
  Scenario: ModalHeader has rounded top corners and bottom border
    Given a ModalHeader is rendered with default props
    Then the header has "rounded-t-2xl" class
    And the header has "border-b" class

  @visual
  Scenario: ModalHeader has correct padding values
    Given a ModalHeader is rendered with default props
    Then the header has "px-6" class
    And the header has "pt-4" class
    And the header has "pb-3" class

  @visual
  Scenario: Title has theme-responsive text colors
    Given a ModalHeader is rendered with a title
    Then the title has "text-gray-900" class
    And the title has "dark:text-white" class
    And the title has "midnight:text-cyan-100" class
    And the title has "purple:text-pink-100" class

  @visual
  Scenario: Title has correct typography styles
    Given a ModalHeader is rendered with a title
    Then the title has "text-sm" class
    And the title has "font-bold" class
    And the title has "text-center" class

  @visual
  Scenario: Close button has accessible aria-label
    Given a ModalHeader is rendered
    Then a close button with aria-label "Close modal" is present

  @visual
  Scenario: Close button is absolutely positioned in top-right corner
    Given a ModalHeader is rendered
    Then the close button has "absolute" class
    And the close button has "top-4" class
    And the close button has "right-4" class
