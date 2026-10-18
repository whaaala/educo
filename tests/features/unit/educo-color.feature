Feature: Colour arithmetic for the design system — ramps and WCAG contrast
  A school picks one brand colour; lib/educo-ui/color.ts turns it into a full shade ramp, measures contrast the WCAG
  way, and finds the nearest colour that is readable when a choice is not.
  Guards: tests/unit/educo-color.test.ts

  Scenario: A hex colour is read and written faithfully
    Then six-digit, three-digit and eight-digit (with alpha) hex colours are all read
    And a colour read and written back is unchanged, and channels out of range are clamped
    And a colour taken through OKLCH and back lands within two steps of where it started
    And black is the darkest and white the lightest

  Scenario: One brand colour becomes a full shade ramp
    When a ramp is made from the brand colour
    Then it has one colour for each of at least twenty shade steps
    And each step is darker than the one before
    And the hue stays close to the brand colour's own

  Scenario: Contrast is measured the WCAG way
    Then black on white is 21 to 1, a colour on itself is 1 to 1, and the order does not matter
    And dark text on white passes AA, while light grey on white fails for both body and large text

  Scenario: A colour that is not readable is nudged to the nearest one that is
    Then a colour that already passes is left unchanged
    And a too-light colour on a light background is darkened until it reaches 4.5 to 1
    And a too-dark colour on a dark background is lightened until it reaches 4.5 to 1
    And a lower target, such as 3 to 1 for large text, is honoured
