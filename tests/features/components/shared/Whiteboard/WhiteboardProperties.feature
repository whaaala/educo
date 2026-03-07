Feature: WhiteboardProperties panel rendering and styling per active tool
  The WhiteboardProperties side panel displays color, stroke-width,
  font-size, sticky-color, and fill controls depending on the currently
  active whiteboard tool.

  # ── Functional: Tool Visibility ─────────────────────────────────

  Scenario Outline: Properties panel returns null for non-drawing tools
    Given a WhiteboardProperties panel with "<tool>" tool active
    Then the container should be empty

    Examples:
      | tool    |
      | select  |
      | eraser  |
      | hand    |

  Scenario: Color label is shown for pen tool
    Given a WhiteboardProperties panel with pen tool active
    Then the "Color" label should be visible

  Scenario: Size label is shown for stroke width tools
    Given a WhiteboardProperties panel with pen tool active
    Then the "Size" label should be visible

  Scenario: Font label is shown for text tool
    Given a WhiteboardProperties panel with text tool active
    Then the "Font" label should be visible

  Scenario: Font label is hidden for non-text tools
    Given a WhiteboardProperties panel with pen tool active
    Then the "Font" label should not be present

  Scenario: Note label is shown for sticky tool
    Given a WhiteboardProperties panel with sticky tool active
    Then the "Note" label should be visible

  Scenario: Note label is hidden for non-sticky tools
    Given a WhiteboardProperties panel with pen tool active
    Then the "Note" label should not be present

  Scenario: Fill label is shown for fill-compatible tools
    Given a WhiteboardProperties panel with rectangle tool active
    Then the "Fill" label should be visible

  Scenario: Fill label is hidden for non-fill tools
    Given a WhiteboardProperties panel with pen tool active
    Then the "Fill" label should not be present

  # ── Functional: Stroke Width Controls ───────────────────────────

  Scenario: Stroke width buttons are rendered with correct titles
    Given a WhiteboardProperties panel with pen tool active
    Then stroke width buttons "2px", "4px", "6px", "8px", and "12px" should be present

  Scenario: Clicking a stroke width button calls onStrokeWidthChange
    Given a WhiteboardProperties panel with pen tool and an onStrokeWidthChange handler
    When the "4px" stroke width button is clicked
    Then onStrokeWidthChange should have been called with 4

  # ── Functional: Font Size Controls ──────────────────────────────

  Scenario: Font size buttons are rendered for text tool
    Given a WhiteboardProperties panel with text tool active
    Then font size buttons "12px", "16px", "20px", "28px", and "36px" should be present

  Scenario: Clicking a font size button calls onFontSizeChange
    Given a WhiteboardProperties panel with text tool and an onFontSizeChange handler
    When the "28px" font size button is clicked
    Then onFontSizeChange should have been called with 28

  # ── Visual: Panel Container Theming ─────────────────────────────

  @visual
  Scenario: Panel has correct light theme background and border
    Given a rendered WhiteboardProperties panel
    Then the panel should have the class "bg-white"
    And the panel should have the class "border-r"
    And the panel should have the class "border-gray-200"

  @visual
  Scenario: Panel has dark theme classes
    Given a rendered WhiteboardProperties panel
    Then the panel should have the class "dark:bg-gray-800"
    And the panel should have the class "dark:border-gray-700"

  @visual
  Scenario: Panel has midnight theme classes
    Given a rendered WhiteboardProperties panel
    Then the panel should have the class "midnight:bg-[#0f1729]"
    And the panel should have the class "midnight:border-cyan-500/20"

  @visual
  Scenario: Panel has purple theme classes
    Given a rendered WhiteboardProperties panel
    Then the panel should have the class "purple:bg-[#2a1a3e]"
    And the panel should have the class "purple:border-pink-500/20"

  @visual
  Scenario: Panel has flex column layout with fixed width
    Given a rendered WhiteboardProperties panel
    Then the panel should have the class "flex"
    And the panel should have the class "flex-col"
    And the panel should have the class "w-[60px]"
    And the panel should have the class "items-center"

  @visual
  Scenario: Panel has shadow and padding
    Given a rendered WhiteboardProperties panel
    Then the panel should have the class "shadow-sm"
    And the panel should have the class "p-3"
    And the panel should have the class "gap-3"

  # ── Visual: Section Label Typography ────────────────────────────

  @visual
  Scenario: Color label has uppercase, tracking-wider, and tiny font
    Given a rendered WhiteboardProperties panel with pen tool
    Then the "Color" label should have the class "text-[9px]"
    And the "Color" label should have the class "font-bold"
    And the "Color" label should have the class "uppercase"
    And the "Color" label should have the class "tracking-wider"

  @visual
  Scenario: Color label has theme-specific text colors
    Given a rendered WhiteboardProperties panel with pen tool
    Then the "Color" label should have the class "text-gray-400"
    And the "Color" label should have the class "dark:text-gray-500"
    And the "Color" label should have the class "midnight:text-cyan-400/50"
    And the "Color" label should have the class "purple:text-pink-400/50"

  @visual
  Scenario: Size label has the same styling as Color label
    Given a rendered WhiteboardProperties panel with pen tool
    Then the "Size" label should have the class "text-[9px]"
    And the "Size" label should have the class "font-bold"
    And the "Size" label should have the class "uppercase"

  # ── Visual: Stroke Width Button Styling ─────────────────────────

  @visual
  Scenario: Active stroke width has blue highlight background
    Given a WhiteboardProperties panel with pen tool and active stroke width of 4px
    Then the "4px" button should have the class "bg-blue-100"
    And the "4px" button should have the class "dark:bg-blue-900/30"
    And the "4px" button should have the class "midnight:bg-cyan-900/30"
    And the "4px" button should have the class "purple:bg-pink-900/30"

  @visual
  Scenario: Inactive stroke width has hover background
    Given a WhiteboardProperties panel with pen tool and active stroke width of 4px
    Then the "2px" button should have the class "hover:bg-gray-100"
    And the "2px" button should have the class "dark:hover:bg-gray-700"

  @visual
  Scenario: Stroke width buttons have correct dimensions and rounding
    Given a WhiteboardProperties panel with pen tool
    Then the "2px" button should have the class "w-7"
    And the "2px" button should have the class "h-7"
    And the "2px" button should have the class "rounded-lg"

  @visual
  Scenario: Stroke width indicator dot has theme colors
    Given a WhiteboardProperties panel with pen tool
    Then there should be rounded-full dots
    And the first dot should have the class "bg-gray-700"
    And the first dot should have the class "dark:bg-gray-300"
    And the first dot should have the class "midnight:bg-cyan-300"
    And the first dot should have the class "purple:bg-pink-300"

  # ── Visual: Font Size Button Styling ────────────────────────────

  @visual
  Scenario: Active font size has blue highlight with theme colors
    Given a WhiteboardProperties panel with text tool and active font size 16
    Then the "16px" button should have the class "bg-blue-100"
    And the "16px" button should have the class "text-blue-600"
    And the "16px" button should have the class "dark:bg-blue-900/30"
    And the "16px" button should have the class "dark:text-blue-400"
    And the "16px" button should have the class "midnight:bg-cyan-900/30"
    And the "16px" button should have the class "midnight:text-cyan-400"
    And the "16px" button should have the class "purple:bg-pink-900/30"
    And the "16px" button should have the class "purple:text-pink-400"

  @visual
  Scenario: Inactive font size has gray text
    Given a WhiteboardProperties panel with text tool and active font size 16
    Then the "12px" button should have the class "text-gray-500"
    And the "12px" button should have the class "dark:text-gray-400"

  @visual
  Scenario: Font size buttons show the size number as text content
    Given a WhiteboardProperties panel with text tool
    Then the text "12", "16", "20", "28", and "36" should be displayed
