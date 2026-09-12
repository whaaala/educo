Feature: ColorPalettePicker component rendering and interaction
  The ColorPalettePicker provides a grid of color swatches with optional
  custom hex input and native color picker integration for selecting colors.

  # ──────────────────────────────────────────────────
  # ColorGrid Rendering
  # ──────────────────────────────────────────────────

  Scenario: Renders the correct number of color swatch buttons
    Given a ColorGrid rendered with four colors
    Then the number of buttons should match the number of colors

  Scenario: Swatches have background style set
    Given a ColorGrid rendered with colors
    Then each button should have a background style

  Scenario: Default swatch size is sm (w-6 h-6)
    Given a ColorGrid rendered with default swatch size
    Then the button should have w-6 and h-6 classes

  Scenario: md swatch size applies w-7 h-7
    Given a ColorGrid rendered with swatchSize "md"
    Then the button should have w-7 and h-7 classes

  Scenario: Grid template columns match columns prop
    Given a ColorGrid rendered with columns set to 10
    Then the grid should have a 10-column grid-template-columns style

  Scenario: Clicking a swatch calls onSelect with that color
    Given a ColorGrid rendered with colors and a mock onSelect
    When the second swatch is clicked
    Then onSelect should be called with "#ff0000"

  Scenario: Selected color swatch has ring highlight
    Given a ColorGrid rendered with selectedColor "#ff0000"
    Then the matching swatch should have ring-2 and ring-blue-500 classes

  Scenario: Non-selected swatch has border but no ring
    Given a ColorGrid rendered with selectedColor "#ff0000"
    Then a non-selected swatch should have border-gray-200 class
    And the non-selected swatch should not have ring-2 class

  Scenario: Swatches have expected interaction and transition classes
    Given a ColorGrid rendered with a color
    Then the swatch should have rounded-md, cursor-pointer, hover:scale-110, and transition-transform classes

  Scenario: No fill button renders when allowNoFill is true
    Given a ColorGrid rendered with allowNoFill and an onNoFill callback
    Then a "No fill" button should be present
    When the "No fill" button is clicked
    Then onNoFill should be called

  Scenario: No fill button has ring when noFillSelected is true
    Given a ColorGrid rendered with allowNoFill and noFillSelected
    Then the "No fill" button should have ring-2 and ring-blue-500 classes

  # ──────────────────────────────────────────────────
  # CustomHexRow (via showCustomHex)
  # ──────────────────────────────────────────────────

  Scenario: Custom label and hex input render when showCustomHex is true
    Given a ColorGrid rendered with showCustomHex and a selected color
    Then the "Custom" label should be present
    And the hex input should show the selected color

  Scenario: Custom row does not render when showCustomHex is false
    Given a ColorGrid rendered without showCustomHex
    Then the "Custom" label should not be present
    And the hex input should not be present

  Scenario: Native color input renders for custom picker
    Given a ColorGrid rendered with showCustomHex and a selected color
    Then a native color input should be present with the selected color value

  Scenario: Typing a valid hex in the input calls onSelect
    Given a ColorGrid rendered with showCustomHex and a mock onSelect
    When a valid hex "#abcdef" is typed into the input
    Then onSelect should be called with "#abcdef"

  Scenario: Incomplete hex does not call onSelect
    Given a ColorGrid rendered with showCustomHex and a mock onSelect
    When an incomplete hex "#abc" is typed into the input
    Then onSelect should not be called with "#abc"

  Scenario: Pressing Enter with a valid hex calls onSelect
    Given a ColorGrid rendered with showCustomHex and a mock onSelect
    And a valid hex "#aabbcc" is typed into the input
    When the Enter key is pressed
    Then onSelect should be called with "#aabbcc"

  Scenario: CustomHexRow container stops mousedown propagation
    Given a ColorGrid with showCustomHex wrapped in a div with a mousedown handler
    When mousedown fires on the CustomHexRow
    Then the parent's mousedown handler should not have been called

  @visual
  Scenario: Hex input has proper styling classes
    Given a ColorGrid rendered with showCustomHex
    Then the hex input should have font-mono, text-[11px], rounded-md, and focus:border-blue-400 classes

  Scenario: Color swatch has rainbow gradient overlay
    Given a ColorGrid rendered with showCustomHex and a selected color
    Then a div with conic-gradient style should be present

  # ──────────────────────────────────────────────────
  # Native Color Picker Guard (isNativeColorPickerOpen)
  # ──────────────────────────────────────────────────

  Scenario: isNativeColorPickerOpen returns false by default
    Then isNativeColorPickerOpen should return false

  Scenario: isNativeColorPickerOpen is exported as a function
    Then isNativeColorPickerOpen should be a function

  Scenario: isNativeColorPickerOpen becomes true when native color input receives mousedown
    Given a ColorGrid rendered with showCustomHex
    When mousedown fires on the native color input
    Then isNativeColorPickerOpen should return true

  Scenario: isNativeColorPickerOpen becomes true when native color input receives focus
    Given a ColorGrid rendered with showCustomHex
    When focus fires on the native color input
    Then isNativeColorPickerOpen should return true

  Scenario: isNativeColorPickerOpen stays true during onChange while native picker is open
    Given a ColorGrid rendered with showCustomHex and a mock onSelect
    And the native picker is opened via mousedown
    When the user drags in native picker triggering onChange with "#ff0000"
    Then isNativeColorPickerOpen should still be true
    And onSelect should have been called with "#ff0000"

  Scenario: isNativeColorPickerOpen becomes false only on blur
    Given a ColorGrid rendered with showCustomHex
    And the native picker is opened via mousedown
    When blur fires on the native color input
    Then isNativeColorPickerOpen should return false

  Scenario: onSelect is called during native picker drag without closing
    Given a ColorGrid rendered with showCustomHex and a tracking onSelect
    And the native picker is opened via mousedown
    When multiple drag changes fire with "#110000", "#220000", and "#330000"
    Then all colors should be reported via onSelect in order
    And isNativeColorPickerOpen should still be true
    When the picker closes via blur
    Then isNativeColorPickerOpen should return false

  # ──────────────────────────────────────────────────
  # UI & Look and Feel
  # ──────────────────────────────────────────────────

  @visual
  Scenario: Grid uses gap-1 for swatch spacing
    Given a ColorGrid rendered with colors
    Then the grid element should have the gap-1 class

  @visual
  Scenario: Custom row has border-t separator and proper spacing
    Given a ColorGrid rendered with showCustomHex
    Then the Custom row should have border-t, mt-2, pt-2, flex, items-center, and gap-2 classes

  @visual
  Scenario: Custom label has correct text styling
    Given a ColorGrid rendered with showCustomHex
    Then the "Custom" label should have text-[10px], text-gray-400, and dark:text-gray-500 classes

  @visual
  Scenario: Color swatch wrapper has shadow-inner and proper border
    Given a ColorGrid rendered with showCustomHex
    Then the swatch wrapper should have w-7, h-7, rounded-lg, shadow-inner, border-gray-200, and dark:border-gray-600 classes

  @visual
  Scenario: Hex input supports dark theme classes
    Given a ColorGrid rendered with showCustomHex
    Then the hex input should have dark:border-gray-600, dark:bg-gray-800, and dark:text-gray-300 classes
