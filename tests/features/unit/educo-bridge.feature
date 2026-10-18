Feature: The app's own screens read the same design tokens as the builder (the token bridge)
  The web app (app/globals.css) and the admin app (apps/admin/app/globals.css) map their everyday Tailwind colours —
  surface, ink, muted, line, brand, canvas — onto the Educo UI colour tokens, define those tokens in all four app
  themes, and carry a copy of the theme-independent scale that must agree with the generator, key by key.
  Guards: tests/unit/educo-bridge.test.ts

  Scenario Outline: Each app maps its colours onto the tokens in every theme
    Given the <app> stylesheet
    Then surface, ink, muted, line, brand and canvas each read their Educo UI colour token
    And the surface colour is set for the light, dark, midnight and purple themes
    And the background, text, border and brand tokens are set in all four themes, so nothing renders unthemed

    Examples:
      | app   |
      | web   |
      | admin |

  Scenario Outline: The app's copy of the scale never drifts from the builder's
    Given the <app> stylesheet
    Then every corner radius it declares matches the builder's generated radius, in rem
    And every spacing and type step it declares matches the generated one
    And the large radius, spacing step 4 and the base text size are declared at all

    Examples:
      | app   |
      | web   |
      | admin |

  Scenario Outline: The layout helpers and the responsive basics work app-wide
    Given the <app> stylesheet
    Then the container, grid, stack, cluster, media, columns and visually-hidden helpers are available everywhere, not only inside a page
    And the grid fits as many columns as there is room for, and container queries are available
    And the root font size is 100 %, images never overflow, long words wrap and reduced motion is honoured

    Examples:
      | app   |
      | web   |
      | admin |
