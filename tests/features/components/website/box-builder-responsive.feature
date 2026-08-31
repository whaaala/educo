Feature: Box Builder — responsive per-breakpoint overrides
  As a website designer using the Box Builder
  I want to tune each screen size independently
  So that my layout looks right on desktop, tablet and mobile — not just one width

  Background:
    Given the Box Builder with a Desktop / Tablet / Mobile preview switcher
    And the tree stores DESKTOP (base) values; tablet and mobile hold overrides that cascade down

  Scenario: Editing at a breakpoint creates an override, never touching the base
    Given a section with a base width
    When I switch to Mobile and change its width (drag, resize, inspector or bulk)
    Then only the mobile override changes and the desktop base is preserved
    And the inspector shows an "Editing Mobile" banner

  Scenario: Breakpoints cascade (mobile inherits tablet inherits base)
    Given a value set at the base and overridden at tablet only
    When I preview at mobile
    Then mobile shows the tablet value (inherited), and desktop shows the base

  Scenario: Content is shared across breakpoints; only style/geometry is per-breakpoint
    When I edit text, a link, list items or an image at any breakpoint
    Then that content changes for ALL breakpoints (it is stored on the base)
    But size, spacing, direction, alignment, typography size, position and visibility are per-breakpoint

  Scenario: Reset a breakpoint's overrides
    Given a section overridden at mobile
    When I click "Reset mobile overrides to base"
    Then the section falls back to the base at mobile, and other breakpoints keep their overrides

  Scenario: Hide a box on a specific device
    Given a section
    When I tick "Hidden on mobile"
    Then it is dropped from the live mobile site
    But in the editor it stays faintly visible so I can select and un-hide it

  Scenario: All resize / drag / nudge / bulk edits are breakpoint-aware
    When I resize, free-drag, arrow-nudge, or bulk-edit at tablet or mobile
    Then each write targets that breakpoint's override, not the base

  Scenario: The preview switcher drives the active breakpoint
    Then Mobile (375) → mobile, Tablet (768) → tablet, and Laptop/Desktop/Wide/Full → base
