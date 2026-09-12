Feature: Modal component
  A dialog overlay that displays content in a modal window with support
  for title, subtitle, footer, close button, Escape key, and size variants.

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders nothing when isOpen is false
    Given a Modal with isOpen set to false
    When the component renders
    Then the content should not be in the document

  Scenario: Renders children when isOpen is true
    Given a Modal with isOpen set to true
    When the component renders
    Then the children content should be visible

  Scenario: Renders title when provided
    Given a Modal with a title prop "Test Title"
    When the component renders
    Then the title "Test Title" should be visible

  Scenario: Renders subtitle when provided
    Given a Modal with title and subtitle props
    When the component renders
    Then the subtitle text should be visible

  Scenario: Renders footer when provided
    Given a Modal with a footer prop containing a Save button
    When the component renders
    Then the Save button should be visible

  Scenario: Calls onClose when close button is clicked
    Given an open Modal with an onClose handler
    When the close button is clicked
    Then onClose should be called once

  Scenario: Calls onClose when Escape key is pressed
    Given an open Modal with an onClose handler
    When the Escape key is pressed
    Then onClose should be called

  Scenario: Hides close button when showCloseButton is false
    Given a Modal with showCloseButton set to false
    When the component renders
    Then no buttons should be present

  Scenario Outline: Renders with size variant <size> without crashing
    Given a Modal with size set to "<size>"
    When the component renders
    Then the content should be visible

    Examples:
      | size |
      | sm   |
      | md   |
      | lg   |
      | xl   |
      | 2xl  |
      | 3xl  |
      | 4xl  |

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: Modal backdrop has fixed overlay with blur and animation
    Given a Modal is rendered with default props
    Then the backdrop has fixed positioning with "inset-0"
    And it has a semi-transparent background with "bg-black/60"
    And it has "backdrop-blur-sm" class
    And it has fade-in animation with "animate-in" and "fade-in" classes

  @visual
  Scenario: Modal dialog has theme-responsive backgrounds
    Given a Modal is rendered with default props
    Then the dialog has "bg-white" class
    And the dialog has "dark:bg-gray-800" class
    And the dialog has "midnight:bg-gray-900" class
    And the dialog has "purple:bg-gray-900" class

  @visual
  Scenario: Modal dialog has rounded corners and shadow
    Given a Modal is rendered with default props
    Then the dialog has "rounded-2xl" class
    And the dialog has "shadow-2xl" class

  @visual
  Scenario: Modal dialog has zoom-in animation
    Given a Modal is rendered with default props
    Then the dialog has "animate-in" class
    And the dialog has "zoom-in-95" class

  @visual
  Scenario: Modal defaults to max-w-4xl width
    Given a Modal is rendered without specifying maxWidth
    Then the dialog has "max-w-4xl" class

  @visual
  Scenario: Modal with sm maxWidth has max-w-sm
    Given a Modal is rendered with maxWidth "sm"
    Then the dialog has "max-w-sm" class

  @visual
  Scenario: Modal with lg maxWidth has max-w-lg
    Given a Modal is rendered with maxWidth "lg"
    Then the dialog has "max-w-lg" class

  @visual
  Scenario: Modal title has gradient text effect
    Given a Modal is rendered with a title
    Then the title uses gradient text via "bg-clip-text"
    And the title has "text-transparent" class

  @visual
  Scenario: Modal title has responsive text sizing
    Given a Modal is rendered with a title
    Then the title has "text-lg" class
    And the title has "sm:text-xl" class
    And the title has "font-bold" class

  @visual
  Scenario: Modal close button has proper aria-label
    Given a Modal is rendered
    Then a close button with aria-label "Close" is present

  @visual
  Scenario: Modal close button has rounded corners and hover state
    Given a Modal is rendered
    Then the close button has "rounded-xl" class
    And the close button has "hover:bg-white/60" class

  @visual
  Scenario: Modal content area has responsive padding
    Given a Modal is rendered with default props
    Then the content area has "p-4" class
    And the content area has "sm:p-6" class

  @visual
  Scenario: Modal footer has themed border and background
    Given a Modal is rendered with a footer
    Then the footer has a top border with "border-t" and "border-gray-200"
    And the footer has "bg-gray-50/50" background
