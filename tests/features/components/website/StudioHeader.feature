Feature: The website studio's top bar
  The bar across the top of the website studio names the school, says this is the Website Builder, lets me change
  the app's theme and takes me back to the rest of the app.
  Guards: tests/components/website/StudioHeader.test.tsx

  Scenario: The bar names the school and the builder, and offers the theme
    Given the website studio for "Greenfield Academy"
    Then the top bar shows "Greenfield Academy" and "Website Builder"
    And a "Change theme" switcher

  Scenario: The school's logo is shown when it has one
    Given the school has a logo
    Then the top bar shows the logo, described as "Greenfield Academy logo"

  Scenario: A school with no logo gets its initial
    Given "Zenith School" has no logo
    Then the top bar shows a "Z" mark and no logo picture

  Scenario: Back to the app
    When I press "Back to app"
    Then I am taken to the app's home page
