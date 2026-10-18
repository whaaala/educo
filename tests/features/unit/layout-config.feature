Feature: The layout's numbers live in one configuration file (RULE CFG)
  Every screen edge (the rungs and where the editor docks its panels) and every resize floor and drag threshold lives in
  config/layout.json. The engine, the editor, the export, the web app, the phone and tablet app, the UAT scripts and the
  tests read it from there, so changing an edge or a floor is a change to that file and nothing else.
  Guards: tests/unit/layout-config.test.ts

  Scenario: The rungs climb from the phone, each with its name
    Given config/layout.json
    Then the first rung starts at 0, the phone
    And every rung after it starts wider than the one before
    And every rung has a label and the words that describe it

  Scenario: No screen edge is typed into code
    Given the builder, the web app, the admin app, the phone and tablet app, the tests and the UAT scripts
    Then no media query, Tailwind width class, window-width check or matchMedia carries one of the edges as a typed number
    And the phone and tablet app never reads the window size once and keeps it, nor compares its width with a typed number
    And a comment or a generated file that names an edge is not counted

  Scenario: The resize floors and thresholds are numbers in the config
    Given config/layout.json holds the column floors and the edge-drag thresholds
    Then every one of them is a number there
    And none of them is assigned a typed number in the engine or the canvas
    And a floor typed back in, or the untouched-column floor typed into a drag, is caught the day it appears
