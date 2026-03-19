Feature: Slide Template Library
  Professional presentation templates organized by category.

  Scenario: Template library has sufficient templates
    Then SLIDE_TEMPLATES should have at least 10 templates

  Scenario: All required categories exist
    Then the following categories should exist:
      | Business     |
      | Marketing    |
      | Planning     |
      | Infographics |
      | Education    |

  Scenario: Each template has required fields
    Then every template should have id, label, category, title, theme, and slides
    And every template should have at least 2 slides

  Scenario: Each slide has valid structure
    Then every slide in every template should have id, content, notes, background, and transition

  Scenario: Business templates have professional content
    Given the "Strategy Consulting" template
    Then it should contain slides about Executive Summary and Market Analysis

  Scenario: Marketing templates include pitch decks
    Then there should be at least one Startup Pitch Deck template
    And at least one Executive Pitch Deck template

  Scenario: Infographic templates include SWOT
    Then there should be a SWOT Analysis template
    And it should contain Strengths, Weaknesses, Opportunities, and Threats
