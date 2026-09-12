import { describe, expect, it } from "vitest";
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
} from "@/components/shared/Whiteboard/whiteboard-templates";
// Feature: Whiteboard template definitions and category structure
describe("whiteboard-templates", () => {
  // ─── TEMPLATE_CATEGORIES ─────────────────────
  describe("TEMPLATE_CATEGORIES", () => {
    // Scenario: Correct number of categories exist
    it("has 9 categories", () => {
      // Then there should be exactly 9 categories
      expect(TEMPLATE_CATEGORIES).toHaveLength(9);
    });

    // Scenario: All expected category IDs are present in correct order
    it("includes all expected category ids", () => {
      // Given the list of category IDs
      const ids = TEMPLATE_CATEGORIES.map((c) => c.id);

      // Then the IDs should match the expected list in order
      expect(ids).toEqual([
        "education",
        "agile",
        "strategy",
        "meetings",
        "brainstorming",
        "design",
        "diagrams",
        "marketing",
        "teambuilding",
      ]);
    });

    // Scenario: Every category has required fields
    it("each category has an id and label", () => {
      // Then each category should have a truthy id and label
      for (const cat of TEMPLATE_CATEGORIES) {
        expect(cat.id).toBeTruthy();
        expect(cat.label).toBeTruthy();
      }
    });
  });

  // ─── TEMPLATES ───────────────────────────────
  describe("TEMPLATES", () => {
    // Scenario: Sufficient number of templates exist
    it("has more than 80 templates", () => {
      // Then there should be more than 80 templates
      expect(TEMPLATES.length).toBeGreaterThan(80);
    });

    // Scenario: All templates have required fields
    it("all templates have required fields", () => {
      // Then every template should have id, name, category, description, and non-empty elements
      for (const tpl of TEMPLATES) {
        expect(tpl.id).toBeTruthy();
        expect(tpl.name).toBeTruthy();
        expect(tpl.category).toBeTruthy();
        expect(tpl.description).toBeTruthy();
        expect(Array.isArray(tpl.elements)).toBe(true);
        expect(tpl.elements.length).toBeGreaterThan(0);
      }
    });

    // Scenario: Template IDs are unique
    it("all template ids are unique", () => {
      // Given all template IDs
      const ids = TEMPLATES.map((t) => t.id);
      const unique = new Set(ids);

      // Then the number of unique IDs should match the total count
      expect(unique.size).toBe(ids.length);
    });

    // Scenario: All template categories reference valid category IDs
    it("all template categories reference valid category ids", () => {
      // Given the set of valid category IDs
      const validCats = new Set(TEMPLATE_CATEGORIES.map((c) => c.id));

      // Then every template's category should exist in the valid set
      for (const tpl of TEMPLATES) {
        expect(validCats.has(tpl.category)).toBe(true);
      }
    });

    // Scenario: Every category has at least one template
    it("every category has at least one template", () => {
      // Then each category should have at least one template assigned to it
      for (const cat of TEMPLATE_CATEGORIES) {
        const templates = TEMPLATES.filter((t) => t.category === cat.id);
        expect(templates.length).toBeGreaterThan(0);
      }
    });
  });

  // ─── Individual template categories ──────────
  describe("Education templates", () => {
    const eduTemplates = TEMPLATES.filter((t) => t.category === "education");

    // Scenario: Education category includes key templates
    it("includes KWL Chart, Mind Map, Venn Diagram", () => {
      // Given the names of all education templates
      const names = eduTemplates.map((t) => t.name);

      // Then the expected template names should be present
      expect(names).toContain("KWL Chart");
      expect(names).toContain("Mind Map");
      expect(names).toContain("Venn Diagram");
    });

    // Scenario: Education category has sufficient templates
    it("has at least 10 templates", () => {
      // Then there should be at least 10 education templates
      expect(eduTemplates.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Agile templates", () => {
    const agileTemplates = TEMPLATES.filter((t) => t.category === "agile");

    // Scenario: Agile category includes key templates
    it("includes Scrum Board and Kanban Board", () => {
      // Given the names of all agile templates
      const names = agileTemplates.map((t) => t.name);

      // Then the expected template names should be present
      expect(names).toContain("Scrum Board");
      expect(names).toContain("Kanban Board");
    });

    // Scenario: Agile category has sufficient templates
    it("has at least 10 templates", () => {
      // Then there should be at least 10 agile templates
      expect(agileTemplates.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Diagrams templates", () => {
    const diagramTemplates = TEMPLATES.filter(
      (t) => t.category === "diagrams"
    );

    // Scenario: Diagrams category includes key templates
    it("includes Basic Flowchart and Org Chart", () => {
      // Given the names of all diagram templates
      const names = diagramTemplates.map((t) => t.name);

      // Then the expected template names should be present
      expect(names).toContain("Basic Flowchart");
      expect(names).toContain("Org Chart");
    });
  });

  // ─── Template element structure ──────────────
  describe("Template element structure", () => {
    // Scenario: All elements have required visual properties
    it("all elements have id, type, color, strokeWidth, and opacity", () => {
      // Then every element in every template should have the required properties
      for (const tpl of TEMPLATES) {
        for (const el of tpl.elements) {
          expect(el.id).toBeTruthy();
          expect(el.type).toBeTruthy();
          expect(el.color).toBeTruthy();
          expect(typeof el.strokeWidth).toBe("number");
          expect(typeof el.opacity).toBe("number");
        }
      }
    });

    // Scenario: Element IDs within each template are unique
    it("element ids within a template are unique", () => {
      // Then for each template, element IDs should be unique
      for (const tpl of TEMPLATES) {
        const ids = tpl.elements.map((el) => el.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
      }
    });
  });
});
