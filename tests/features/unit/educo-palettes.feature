Feature: The colour palette library
  lib/educo-ui/palettes.ts offers ready-made palettes, grouped by category, and a spectrum of hues to start from.
  Guards: tests/unit/educo-palettes.test.ts

  Scenario: A large library of palettes, each complete
    Then there are at least forty palettes, no two with the same name
    And every palette sets a valid main and accent colour and belongs to a known category
    And every dark palette also sets the background, surface, text and muted text colours

  Scenario: Palettes are grouped with none lost
    When the palettes are grouped by category
    Then every category has palettes and together they hold every palette

  Scenario: The spectrum gives twenty-two hues to start from
    Then there are twenty-two valid hues, and each makes a full shade ramp
