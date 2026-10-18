Feature: The page-weight budgets live in configuration (RULE CFG · RULE AF)
  What a published page may weigh and how fast it must paint on Slow 3G are numbers in config/budgets.json, read by
  scripts/uat/page-weight.js. Changing a budget is a configuration edit, never a code change.
  Guards: tests/unit/budgets-config.test.ts

  Scenario: Every budget in the configuration is a number
    When I read config/budgets.json
    Then it holds more than eight budgets, and each one is a real number

  Scenario: The page-weight check reads its budgets, it never types them
    When I read the page-weight check
    Then none of the budgets from the configuration is written into it as a number
    But a number written only in a comment does not count

  Scenario: A budget typed back into the check is caught
    Given a check that says "if the page is over 100 KB, fail"
    Then the guard reports 100 as a budget typed into code
