Feature: NameLabel component
  A styled inline label for displaying names with support for
  custom class names and size variants (compact, default, large).

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders the name text
    Given a NameLabel is rendered with name "John Doe"
    When the component renders
    Then the text "John Doe" should be visible

  Scenario: Applies custom className
    Given a NameLabel is rendered with a custom className "extra"
    When the component renders
    Then the element should have the "extra" class

  Scenario Outline: Renders with variant <variant>
    Given a NameLabel is rendered with variant "<variant>"
    When the component renders
    Then the name text should be visible

    Examples:
      | variant |
      | default |
      | compact |
      | large   |

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: NameLabel has dark background with theme variants
    Given a NameLabel is rendered with a name
    Then the label has "bg-gray-900" class
    And the label has "dark:bg-gray-800" class
    And the label has "midnight:bg-gray-950" class
    And the label has "purple:bg-gray-950" class

  @visual
  Scenario: NameLabel has white text and medium font weight
    Given a NameLabel is rendered with a name
    Then the label has "text-white" class
    And the label has "font-medium" class

  @visual
  Scenario: NameLabel has rounded corners and shadow
    Given a NameLabel is rendered with a name
    Then the label has "rounded-lg" class
    And the label has "shadow-md" class

  @visual
  Scenario: NameLabel is inline-block with no text wrapping
    Given a NameLabel is rendered with a name
    Then the label has "inline-block" class
    And the label has "whitespace-nowrap" class

  @visual
  Scenario: Compact variant has smaller padding and text
    Given a NameLabel is rendered with compact variant
    Then the label has "px-2" class
    And the label has "py-1" class
    And the label has "text-xs" class

  @visual
  Scenario: Default variant has medium padding and text
    Given a NameLabel is rendered with default variant
    Then the label has "px-3" class
    And the label has "py-1.5" class
    And the label has "text-sm" class

  @visual
  Scenario: Large variant has larger padding and text
    Given a NameLabel is rendered with large variant
    Then the label has "px-4" class
    And the label has "py-2" class
    And the label has "text-base" class
