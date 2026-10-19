Feature: Every research starts from what is already stored (RULE R, STORED FIRST)
  # The user, 2026-10-19: "check all of the research that we've done previously… before doing the research, and then we
  # add research to that." A research-check line in docs/TASK_TREE.md says what it found stored before anything new began.
  Guards: tests/unit/research-stored-first.test.ts

  Scenario: A started or finished research-check names the stored research it read
    Given a line of docs/TASK_TREE.md marked in progress or done that says "RESEARCH-CHECK"
    When its file names in backticks are looked up under docs/
    Then at least one of them is a stored file that exists

  Scenario: A research-check not yet started is not held to it
    Given a research-check line still marked not started
    Then it is not checked until it starts

  Scenario: What later areas will need is archived and indexed, not researched again (BALANCE)
    # The user, 2026-10-19: "if there's other things we see that we will need, put that together in an archive".
    When docs/web-anatomy/research-archive.md is read
    Then it lists each archived source with where it is and the area it serves
    And no entry is missing the area it serves
