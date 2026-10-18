Feature: Every function starts from its BDD scenario (RULE BDD)
  # The user, 2026-10-18: "every functionality, everything we do should have [a BDD] scenario… it must be followed".
  # Guard: tests/unit/bdd-everything.test.ts · backlog: config/bdd.json (BATCH BDD-1)

  Scenario: A new test with no .feature fails the gate
    Given I add tests/unit/something-new.test.ts
    And no .feature names it on a "Guards:" line
    When the unit suite runs
    Then the RULE BDD guard fails and names the test

  Scenario: The tests written before the rule are a backlog that only shrinks
    Given config/bdd.json lists the tests no .feature named on 2026-10-18
    When a .feature is written that names one of them
    Then the guard fails until that entry is taken out of the backlog

  Scenario: A backlog entry for a test that no longer exists is taken out
    Given a test in the backlog is deleted
    When the unit suite runs
    Then the guard fails until the entry is removed
