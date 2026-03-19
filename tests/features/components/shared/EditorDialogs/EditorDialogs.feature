Feature: Shared Editor Dialog Components
  As a developer building document and presentation editors
  I want shared dialog and UI components
  So that modals and controls behave identically across all editors

  # ──────────────────────────────────────────────────
  # EditorDialog
  # ──────────────────────────────────────────────────

  Scenario: EditorDialog renders a centered modal overlay
    Given an EditorDialog with title "Page Setup"
    When the dialog renders
    Then a centered modal should appear with a semi-transparent backdrop
    And the title "Page Setup" should be visible in the header
    And a close button (X) should appear in the top-right corner

  Scenario: EditorDialog closes when X button is clicked
    Given an open EditorDialog
    When the user clicks the close button
    Then the onClose callback should fire

  Scenario: EditorDialog closes on backdrop click
    Given an open EditorDialog
    When the user clicks the backdrop overlay
    Then the onClose callback should fire

  # ──────────────────────────────────────────────────
  # EditorDialogButton
  # ──────────────────────────────────────────────────

  Scenario: EditorDialogButton renders with consistent styling
    Given an EditorDialogButton with text "Apply"
    When it renders
    Then it should appear as a bordered button with hover effects

  # ──────────────────────────────────────────────────
  # FullscreenFloatingPill
  # ──────────────────────────────────────────────────

  @visual
  Scenario: FullscreenFloatingPill appears when cursor nears top
    Given the editor is in fullscreen mode
    When the user moves the cursor near the top of the screen
    Then a glassmorphism pill should appear with zoom and exit controls

  @visual
  Scenario: FullscreenFloatingPill has zoom controls
    Given the FullscreenFloatingPill is visible
    Then it should display the current zoom level
    And it should have zoom in, zoom out, and exit fullscreen buttons

  # ──────────────────────────────────────────────────
  # TableGridPicker
  # ──────────────────────────────────────────────────

  Scenario: TableGridPicker renders an interactive grid
    Given a TableGridPicker component
    When it renders
    Then an interactive grid of cells should be visible (up to 8 rows × 10 columns)

  Scenario: TableGridPicker highlights cells on hover
    Given a TableGridPicker component
    When the user hovers over the cell at row 3, column 4
    Then all cells from (1,1) to (3,4) should be highlighted
    And the label should show "3 × 4"

  Scenario: TableGridPicker inserts table on click
    Given a TableGridPicker component
    When the user clicks on the cell at row 2, column 3
    Then the onInsert callback should be called with rows=2, cols=3

  # ──────────────────────────────────────────────────
  # EditingModeButton
  # ──────────────────────────────────────────────────

  Scenario: EditingModeButton shows current mode
    Given an EditingModeButton with mode "editing"
    When it renders
    Then "Editing" should be displayed as the current mode

  Scenario: EditingModeButton opens mode dropdown on click
    Given an EditingModeButton
    When the user clicks the button
    Then a dropdown should appear with "Editing", "Suggesting", and "Viewing" options

  Scenario: EditingModeButton switches mode on selection
    Given the mode dropdown is open
    When the user clicks "Viewing"
    Then onModeChange should be called with "viewing"
    And the button label should update to "Viewing"
