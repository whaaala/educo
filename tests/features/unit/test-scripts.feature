Feature: The fast gate tests the build it was given
  # scripts/test-fast.js builds, serves and runs every browser suite against `next start` (rule 15). A second build beside the
  # first (`NEXT_DIST_DIR=.next-b`, next.config.ts) lets a fix be built while the first keeps serving (RULE Z).
  # Measured 2026-10-18 (LE13c-10): with NEXT_DIST_DIR=.next-b the server served .next-b, the runner compared .next/BUILD_ID,
  # and refused to run anything.
  Guards: tests/unit/test-scripts.test.ts

  Scenario: The browser suites are the same on both paths
    Given test:invariants:rest in package.json and the runner's list of specs
    Then they name the same specs, every one of them exists, and every builder spec on disk is run
    And the runner runs every screen the browser config defines

  Scenario: The runner checks the build folder the server was started from
    Given NEXT_DIST_DIR names a second build folder
    When I run npm run test:fast -- --no-build
    Then the build it compares against is that folder's BUILD_ID, not .next's
    And without NEXT_DIST_DIR it is .next
