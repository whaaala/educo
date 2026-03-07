Feature: WhiteboardBottomBar controls, interactions, and styling
  The WhiteboardBottomBar provides undo/redo, zoom controls, and a
  clear-all action at the bottom of the whiteboard canvas.

  # ── Functional: Undo / Redo ─────────────────────────────────────

  Scenario: Undo and redo buttons are rendered
    Given a WhiteboardBottomBar with default props
    Then the undo button should be present
    And the redo button should be present

  Scenario: Undo button is disabled when canUndo is false
    Given a WhiteboardBottomBar with canUndo set to false
    Then the undo button should be disabled

  Scenario: Redo button is disabled when canRedo is false
    Given a WhiteboardBottomBar with canRedo set to false
    Then the redo button should be disabled

  Scenario: Clicking undo button calls onUndo
    Given a WhiteboardBottomBar with an onUndo handler
    When the undo button is clicked
    Then onUndo should have been called

  Scenario: Clicking redo button calls onRedo
    Given a WhiteboardBottomBar with an onRedo handler
    When the redo button is clicked
    Then onRedo should have been called

  # ── Functional: Zoom ────────────────────────────────────────────

  Scenario: Current zoom percentage is displayed
    Given a WhiteboardBottomBar with zoom level 1.5
    Then the zoom percentage should display as "150%"

  Scenario: Clicking zoom in button calls onZoomIn
    Given a WhiteboardBottomBar with an onZoomIn handler
    When the zoom in button is clicked
    Then onZoomIn should have been called

  Scenario: Clicking zoom out button calls onZoomOut
    Given a WhiteboardBottomBar with an onZoomOut handler
    When the zoom out button is clicked
    Then onZoomOut should have been called

  Scenario: Zoom out is disabled at minimum zoom
    Given a WhiteboardBottomBar at minimum zoom level 0.1
    Then the zoom out button should be disabled

  Scenario: Zoom in is disabled at maximum zoom
    Given a WhiteboardBottomBar at maximum zoom level 5
    Then the zoom in button should be disabled

  Scenario: Clicking fit button calls onFitToScreen
    Given a WhiteboardBottomBar with an onFitToScreen handler
    When the fit to screen button is clicked
    Then onFitToScreen should have been called

  # ── Functional: Clear All ───────────────────────────────────────

  Scenario: Clear all button is visible
    Given a WhiteboardBottomBar with default props
    Then the clear all button should be present

  Scenario: Clicking clear all shows confirmation dialog
    Given a WhiteboardBottomBar with default props
    When the clear all button is clicked
    Then a confirmation dialog should appear with message "Clear all elements?"
    And Cancel and Clear buttons should be shown

  Scenario: Confirming clear calls onClearAll
    Given a WhiteboardBottomBar with an onClearAll handler
    When the clear all button is clicked
    And the Clear confirmation button is clicked
    Then onClearAll should have been called

  Scenario: Cancelling clear dismisses the confirmation dialog
    Given a WhiteboardBottomBar with the confirmation dialog open
    When the Cancel button is clicked
    Then the confirmation dialog should be dismissed

  # ── Functional: Read-Only Mode ──────────────────────────────────

  Scenario: Read-only mode hides undo/redo and clear buttons
    Given a WhiteboardBottomBar in read-only mode
    Then undo, redo, and clear all buttons should not be present

  Scenario: Read-only mode still shows zoom controls
    Given a WhiteboardBottomBar in read-only mode
    Then zoom in should be visible
    And zoom out should be visible
    And zoom percentage should be displayed as "100%"

  # ── Visual: Container Theming ───────────────────────────────────

  @visual
  Scenario: Container has correct light theme background and border
    Given a rendered WhiteboardBottomBar
    Then the bar should have the class "bg-white"
    And the bar should have the class "border-t"
    And the bar should have the class "border-gray-200"

  @visual
  Scenario: Container has dark theme classes
    Given a rendered WhiteboardBottomBar
    Then the bar should have the class "dark:bg-gray-800"
    And the bar should have the class "dark:border-gray-700"

  @visual
  Scenario: Container has midnight theme classes
    Given a rendered WhiteboardBottomBar
    Then the bar should have the class "midnight:bg-[#0f1729]"
    And the bar should have the class "midnight:border-cyan-500/20"

  @visual
  Scenario: Container has purple theme classes
    Given a rendered WhiteboardBottomBar
    Then the bar should have the class "purple:bg-[#2a1a3e]"
    And the bar should have the class "purple:border-pink-500/20"

  @visual
  Scenario: Container has flex layout with center alignment
    Given a rendered WhiteboardBottomBar
    Then the bar should have the class "flex"
    And the bar should have the class "items-center"
    And the bar should have the class "justify-between"

  @visual
  Scenario: Container has correct padding
    Given a rendered WhiteboardBottomBar
    Then the bar should have the class "px-3"
    And the bar should have the class "py-1.5"

  # ── Visual: Button States ───────────────────────────────────────

  @visual
  Scenario: Disabled buttons have reduced opacity and not-allowed cursor
    Given a WhiteboardBottomBar with both undo and redo disabled
    Then the disabled button should have the class "opacity-30"
    And the disabled button should have the class "cursor-not-allowed"

  @visual
  Scenario: Enabled buttons have pointer cursor
    Given a WhiteboardBottomBar with default props
    Then the undo button should have the class "cursor-pointer"

  @visual
  Scenario: Buttons have rounded corners and transition styling
    Given a WhiteboardBottomBar with default props
    Then the undo button should have the class "rounded-lg"
    And the undo button should have the class "transition-all"
    And the undo button should have the class "duration-150"

  @visual
  Scenario: Enabled buttons have hover background classes
    Given a WhiteboardBottomBar with default props
    Then the undo button should have the class "hover:bg-gray-100"
    And the undo button should have the class "dark:hover:bg-gray-700"

  @visual
  Scenario: Clear button has danger hover styling
    Given a WhiteboardBottomBar with default props
    Then the clear all button should have the class "hover:text-red-600"
    And the clear all button should have the class "hover:bg-red-50"

  # ── Visual: Zoom Percentage Text ────────────────────────────────

  @visual
  Scenario: Zoom text has small bold font styling
    Given a WhiteboardBottomBar with default props
    Then the zoom text "100%" should have the class "text-[10px]"
    And the zoom text "100%" should have the class "font-bold"

  @visual
  Scenario: Zoom text has theme-appropriate colors
    Given a WhiteboardBottomBar with default props
    Then the zoom text "100%" should have the class "text-gray-500"
    And the zoom text "100%" should have the class "dark:text-gray-400"
    And the zoom text "100%" should have the class "midnight:text-cyan-400/70"
    And the zoom text "100%" should have the class "purple:text-pink-400/70"

  # ── Visual: Clear Confirmation Dialog ───────────────────────────

  @visual
  Scenario: Confirmation dialog has theme-aware background and border
    Given a WhiteboardBottomBar with the clear all dialog opened
    Then the dialog container should be present

  @visual
  Scenario: Cancel button has gray background
    Given a WhiteboardBottomBar with the clear all dialog opened
    Then the Cancel button should have the class "bg-gray-100"
    And the Cancel button should have the class "dark:bg-gray-700"

  @visual
  Scenario: Clear confirm button has red background
    Given a WhiteboardBottomBar with the clear all dialog opened
    Then the Clear button should have the class "bg-red-600"
    And the Clear button should have the class "hover:bg-red-700"
    And the Clear button should have the class "text-white"

  @visual
  Scenario: Dialog label text has correct typography
    Given a WhiteboardBottomBar with the clear all dialog opened
    Then the label "Clear all elements?" should have the class "text-xs"
    And the label "Clear all elements?" should have the class "font-medium"

  @visual
  Scenario: Dialog has rounded corners and shadow
    Given a WhiteboardBottomBar with the clear all dialog opened
    Then the dialog container should have the class "rounded-xl"
    And the dialog container should have the class "shadow-xl"

  # ── Visual: Icon Sizing ─────────────────────────────────────────

  @visual
  Scenario: All icons in buttons have consistent sizing
    Given a rendered WhiteboardBottomBar
    Then all SVG icons should have the class "w-3.5"
    And all SVG icons should have the class "h-3.5"
