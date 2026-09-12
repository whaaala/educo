Feature: Whiteboard template definitions and category structure
  As a user creating whiteboards from templates
  I want a well-organized template library
  So that I can quickly start with the right template for my needs

  # TEMPLATE_CATEGORIES

  Scenario: Correct number of categories exist
    Then there should be exactly 9 categories

  Scenario: All expected category IDs are present in correct order
    Given the list of category IDs
    Then the IDs should be "education", "agile", "strategy", "meetings", "brainstorming", "design", "diagrams", "marketing", and "teambuilding" in order

  Scenario: Every category has required fields
    Then each category should have a truthy id and label

  # TEMPLATES

  Scenario: Sufficient number of templates exist
    Then there should be more than 80 templates

  Scenario: All templates have required fields
    Then every template should have id, name, category, description, and non-empty elements

  Scenario: Template IDs are unique
    Given all template IDs
    Then the number of unique IDs should match the total count

  Scenario: All template categories reference valid category IDs
    Given the set of valid category IDs
    Then every template's category should exist in the valid set

  Scenario: Every category has at least one template
    Then each category should have at least one template assigned to it

  # Education templates

  Scenario: Education category includes key templates
    Given the education templates
    Then the template names should include "KWL Chart", "Mind Map", and "Venn Diagram"

  Scenario: Education category has sufficient templates
    Given the education templates
    Then there should be at least 10 education templates

  # Agile templates

  Scenario: Agile category includes key templates
    Given the agile templates
    Then the template names should include "Scrum Board" and "Kanban Board"

  Scenario: Agile category has sufficient templates
    Given the agile templates
    Then there should be at least 10 agile templates

  # Diagrams templates

  Scenario: Diagrams category includes key templates
    Given the diagram templates
    Then the template names should include "Basic Flowchart" and "Org Chart"

  # Template element structure

  Scenario: All elements have required visual properties
    Then every element in every template should have id, type, color, strokeWidth, and opacity

  Scenario: Element IDs within each template are unique
    Then for each template, element IDs should be unique
