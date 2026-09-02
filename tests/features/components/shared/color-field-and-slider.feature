Feature: Shared ColorField and Slider components
  As a developer building any Educo screen
  I want reusable, themed, accessible ColorField and Slider atoms
  So that no screen hand-rolls raw <input type="color"> or <input type="range">

  Background:
    Given the shared components live in components/shared/
    And every element respects the active theme (light, dark, midnight, purple)
    And both components are responsive on mobile (375px), tablet (768px) and desktop (1280px+)

  # ── ColorField ──────────────────────────────────────────────────────────────
  Scenario: ColorField shows a label, swatch and the current hex
    Given a ColorField with label "Primary" and value "#4f46e5"
    Then the label "Primary" is visible
    And the hex input shows "#4f46e5"
    And a live swatch reflects the current colour
    And the native colour picker is reachable with an accessible name

  Scenario: Committing a valid hex normalises and lowercases it
    Given a ColorField with value "#000000"
    When the user types "#ABCABC" and blurs the field
    Then onChange is called with "#abcabc"

  Scenario: Three-digit shorthand expands to six digits
    When the user types "#0af" into a ColorField and blurs
    Then onChange is called with "#00aaff"

  Scenario: An invalid hex is rejected and the field reverts
    Given a ColorField with value "#123456"
    When the user types "nonsense" and blurs
    Then onChange is not called
    And the field reverts to "#123456"

  Scenario: The screen eyedropper appears only where supported
    Given the browser exposes the EyeDropper API
    Then a "Pick colour from screen" button is shown
    And picking a colour calls onChange with the sampled hex

  # ── Slider ────────────────────────────────────────────────────────────────--
  Scenario: Slider shows a label and the live value with a unit
    Given a Slider with label "Corner radius", value 16 and unit "px"
    Then the label "Corner radius" is visible
    And the value "16px" is shown

  Scenario: Moving the slider reports a number
    Given a Slider ranging 0 to 100
    When the value changes to 60
    Then onChange is called with the number 60

  Scenario: The value readout can be hidden and custom-formatted
    Given a Slider with showValue false
    Then no value readout is rendered
    And a formatValue function overrides the unit when provided

  Scenario: A disabled Slider does not report changes
    Given a disabled Slider
    When the user interacts with it
    Then onChange is not called

  # ── Reuse-first rule ─────────────────────────────────────────────────────────
  Scenario: The token playground consumes only shared components
    Given the Educo UI token playground at /website/educo-tokens
    Then colour wells use ColorField
    And font pickers use FormDropdown
    And the corner-radius control uses Slider
    And every button uses the shared Button
    And each panel uses FormSection
    And every colour shown is data from the token engine, never a hardcoded chrome colour
