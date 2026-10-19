Feature: How much of an area is left (RULE PROGRESS)
  # The user, 2026-10-18: "always show what percentage of work we have left… so we don't start adding more and more work".
  # scripts/area-progress.js counts it from the AREA MAP in docs/TASK_TREE.md. Guard: tests/unit/area-progress.test.ts

  Scenario: The percentage left is counted from the batches on the area's map
    Given an area's line in the AREA MAP lists its essentials batches joined by " → " up to the first "then"
    And each batch heading says "N changes" and is "[x]" once closed
    When I run node scripts/area-progress.js "Website layout"
    Then it prints the changes left out of the total and the percentage left
    And it lists the open essentials batches with their changes
    And it lists the Nice / Great batches waiting for the area to be re-opened

  Scenario: A range of batches is counted batch by batch
    Given the AREA V line lists "VE-1 … VE-13"
    When I run the counter for "AREA V"
    Then each of VE-1 to VE-13 is counted on its own

  Scenario: A batch the counter cannot count fails, never guessed
    Given a batch on an area's map whose heading has no "N changes"
    When the counter or its guard runs
    Then it names that batch as NOT COUNTED and fails

  Scenario: Closing a batch lowers what is left
    Given a batch of 6 changes is open
    When its heading is ticked "[x]"
    Then what is left goes down by 6

  Scenario: The area is found whatever case I type it in (LE15b-1)
    When I run the progress script for "website layout"
    Then it reports the "Website layout" area, as it does for "Website layout"
    And an area that is not on the map still says so plainly, without a stack trace
