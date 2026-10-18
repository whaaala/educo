Feature: A component declared inside another one holds no state of its own
  A component written inside another is a new component on every render, so the builder throws it away and makes it
  again each time: its remembered values reset and its effects run again. That is how resizing a block brought back
  "Maximum update depth exceeded" twice, after two correct-looking guards that could never run.
  Files checked: components/website/box/BoxCanvas.tsx · components/website/box/BoxInspector.tsx · app/website/box-demo/page.tsx.
  Guards: tests/unit/inner-components-have-no-hooks.test.ts

  Scenario: The check finds the inner components that are there
    When the builder's canvas, inspector and page are read
    Then at least one component declared inside another is found
    Because a check that finds nothing would pass whatever the code said

  Scenario Outline: No inner component keeps state or runs effects
    When "<file>" is read
    Then no component declared inside another calls a hook
    And any that does is named with its line, and told to move to the top level or hand its state to its parent

    Examples:
      | file                                    |
      | components/website/box/BoxCanvas.tsx    |
      | components/website/box/BoxInspector.tsx |
      | app/website/box-demo/page.tsx           |
