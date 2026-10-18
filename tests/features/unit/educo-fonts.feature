Feature: The font library behind every font picker
  lib/educo-ui/fonts.ts lists the families, weights, sizes and letter spacing a person can choose from.
  Guards: tests/unit/educo-fonts.test.ts

  Scenario: A large library of families, each ready to use
    Then there are at least forty families, no two with the same name
    And each family's stack names it, quoted when its name has a space, and ends in a generic fallback
    And every family belongs to one of the five categories, and every category has families

  Scenario: Weights, sizes and letter spacing are complete scales
    Then every weight from 100 to 900 is offered
    And ten type sizes rise in order, with the base size at 16 pixels
    And letter spacing is in em, includes "normal" at zero, and has at least five uniquely named steps

  Scenario: A picker option for every family
    Then the picker has one option per family, whose value is the family's stack and whose label names it
