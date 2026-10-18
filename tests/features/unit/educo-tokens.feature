Feature: Design tokens made from the site's theme
  lib/educo-ui/tokens.ts turns a site's theme into the full set of design tokens and writes them as CSS variables.
  Guards: tests/unit/educo-tokens.test.ts

  Scenario: The theme becomes a full set of tokens
    Given the default site theme
    Then the main, accent and neutral colours each get a full shade ramp
    And the background, text, brand colour and the two fonts come straight from the theme
    And borders take a light, brand-tinted neutral
    And type, weights and spacing are on a rem scale, with base text and spacing step 4 at 1rem
    And the corner radii scale from the theme's own radius, all in rem
    And the default text on the default background passes WCAG AA

  Scenario: The tokens are written as CSS variables
    Then colour ramps, fonts, type, spacing, radius, shadow, duration and easing variables are all written
    And they sit inside the page root's selector, or any selector asked for
