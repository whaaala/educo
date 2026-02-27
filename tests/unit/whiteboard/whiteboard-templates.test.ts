import { describe, expect, it } from "vitest";
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
} from "@/components/shared/Whiteboard/whiteboard-templates";
import type {
  WhiteboardTemplate,
  TemplateCategory,
} from "@/components/shared/Whiteboard/whiteboard-templates";

describe("whiteboard-templates", () => {
  // ─── TEMPLATE_CATEGORIES ─────────────────────
  describe("TEMPLATE_CATEGORIES", () => {
    it("has 9 categories", () => {
      expect(TEMPLATE_CATEGORIES).toHaveLength(9);
    });

    it("includes all expected category ids", () => {
      const ids = TEMPLATE_CATEGORIES.map((c) => c.id);
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

    it("each category has an id and label", () => {
      for (const cat of TEMPLATE_CATEGORIES) {
        expect(cat.id).toBeTruthy();
        expect(cat.label).toBeTruthy();
      }
    });
  });

  // ─── TEMPLATES ───────────────────────────────
  describe("TEMPLATES", () => {
    it("has more than 80 templates", () => {
      expect(TEMPLATES.length).toBeGreaterThan(80);
    });

    it("all templates have required fields", () => {
      for (const tpl of TEMPLATES) {
        expect(tpl.id).toBeTruthy();
        expect(tpl.name).toBeTruthy();
        expect(tpl.category).toBeTruthy();
        expect(tpl.description).toBeTruthy();
        expect(Array.isArray(tpl.elements)).toBe(true);
        expect(tpl.elements.length).toBeGreaterThan(0);
      }
    });

    it("all template ids are unique", () => {
      const ids = TEMPLATES.map((t) => t.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it("all template categories reference valid category ids", () => {
      const validCats = new Set(TEMPLATE_CATEGORIES.map((c) => c.id));
      for (const tpl of TEMPLATES) {
        expect(validCats.has(tpl.category)).toBe(true);
      }
    });

    it("every category has at least one template", () => {
      for (const cat of TEMPLATE_CATEGORIES) {
        const templates = TEMPLATES.filter((t) => t.category === cat.id);
        expect(templates.length).toBeGreaterThan(0);
      }
    });
  });

  // ─── Individual template categories ──────────
  describe("Education templates", () => {
    const eduTemplates = TEMPLATES.filter((t) => t.category === "education");

    it("includes KWL Chart, Mind Map, Venn Diagram", () => {
      const names = eduTemplates.map((t) => t.name);
      expect(names).toContain("KWL Chart");
      expect(names).toContain("Mind Map");
      expect(names).toContain("Venn Diagram");
    });

    it("has at least 10 templates", () => {
      expect(eduTemplates.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Agile templates", () => {
    const agileTemplates = TEMPLATES.filter((t) => t.category === "agile");

    it("includes Scrum Board and Kanban Board", () => {
      const names = agileTemplates.map((t) => t.name);
      expect(names).toContain("Scrum Board");
      expect(names).toContain("Kanban Board");
    });

    it("has at least 10 templates", () => {
      expect(agileTemplates.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Diagrams templates", () => {
    const diagramTemplates = TEMPLATES.filter(
      (t) => t.category === "diagrams"
    );

    it("includes Basic Flowchart and Org Chart", () => {
      const names = diagramTemplates.map((t) => t.name);
      expect(names).toContain("Basic Flowchart");
      expect(names).toContain("Org Chart");
    });
  });

  // ─── Template element structure ──────────────
  describe("Template element structure", () => {
    it("all elements have id, type, color, strokeWidth, and opacity", () => {
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

    it("element ids within a template are unique", () => {
      for (const tpl of TEMPLATES) {
        const ids = tpl.elements.map((el) => el.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
      }
    });
  });
});
