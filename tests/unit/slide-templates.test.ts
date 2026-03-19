import { describe, it, expect } from "vitest";
import { SLIDE_TEMPLATES, SLIDE_TEMPLATE_CATEGORIES, SLIDE_CATEGORY_COLORS } from "@/lib/slide-templates";

describe("slide-templates — Presentation Template Library", () => {
  describe("Template count and structure", () => {
    it("has at least 10 templates", () => {
      expect(SLIDE_TEMPLATES.length).toBeGreaterThanOrEqual(10);
    });

    it("every template has required fields", () => {
      for (const tpl of SLIDE_TEMPLATES) {
        expect(tpl.id).toBeTruthy();
        expect(tpl.label).toBeTruthy();
        expect(tpl.category).toBeTruthy();
        expect(tpl.title).toBeTruthy();
        expect(tpl.theme).toBeTruthy();
        expect(tpl.slides.length).toBeGreaterThanOrEqual(2);
      }
    });

    it("every template has unique ID", () => {
      const ids = SLIDE_TEMPLATES.map(t => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("every slide has required fields", () => {
      for (const tpl of SLIDE_TEMPLATES) {
        for (const slide of tpl.slides) {
          expect(slide.id).toBeTruthy();
          expect(typeof slide.content).toBe("string");
          expect(typeof slide.notes).toBe("string");
          expect(slide.background).toBeTruthy();
          expect(["none", "fade", "dissolve", "flip", "cube"]).toContain(slide.transition);
        }
      }
    });
  });

  describe("Categories", () => {
    it("has at least 5 categories", () => {
      expect(SLIDE_TEMPLATE_CATEGORIES.length).toBeGreaterThanOrEqual(5);
    });

    it("includes all expected categories", () => {
      const expected = ["Business", "Marketing", "Planning", "Infographics", "Education"];
      for (const cat of expected) {
        expect(SLIDE_TEMPLATE_CATEGORIES).toContain(cat);
      }
    });

    it("every category has a color defined", () => {
      for (const cat of SLIDE_TEMPLATE_CATEGORIES) {
        expect(SLIDE_CATEGORY_COLORS[cat]).toBeTruthy();
      }
    });
  });

  describe("Business templates", () => {
    it("Strategy Consulting has executive summary and market analysis", () => {
      const tpl = SLIDE_TEMPLATES.find(t => t.id === "strategy-consulting");
      expect(tpl).toBeTruthy();
      const allContent = tpl!.slides.map(s => s.content).join(" ");
      expect(allContent).toContain("Executive Summary");
      expect(allContent).toContain("Market");
    });

    it("Company Profile has about section", () => {
      const tpl = SLIDE_TEMPLATES.find(t => t.id === "company-profile");
      expect(tpl).toBeTruthy();
      const allContent = tpl!.slides.map(s => s.content).join(" ");
      expect(allContent).toContain("About");
    });
  });

  describe("Marketing templates", () => {
    it("has a Startup Pitch Deck", () => {
      const tpl = SLIDE_TEMPLATES.find(t => t.id === "pitch-deck-startup");
      expect(tpl).toBeTruthy();
      const allContent = tpl!.slides.map(s => s.content).join(" ");
      expect(allContent).toContain("Problem");
    });

    it("has an Executive Pitch Deck", () => {
      const tpl = SLIDE_TEMPLATES.find(t => t.id === "pitch-deck-executive");
      expect(tpl).toBeTruthy();
    });
  });

  describe("Infographic templates", () => {
    it("SWOT Analysis has all four quadrants", () => {
      const tpl = SLIDE_TEMPLATES.find(t => t.id === "swot-analysis");
      expect(tpl).toBeTruthy();
      const allContent = tpl!.slides.map(s => s.content).join(" ");
      expect(allContent).toContain("Strengths");
      expect(allContent).toContain("Weaknesses");
      expect(allContent).toContain("Opportunities");
      expect(allContent).toContain("Threats");
    });
  });

  describe("Education templates", () => {
    it("Lecture Slides has learning objectives", () => {
      const tpl = SLIDE_TEMPLATES.find(t => t.id === "lecture-slides");
      expect(tpl).toBeTruthy();
      const allContent = tpl!.slides.map(s => s.content).join(" ");
      expect(allContent).toContain("Learning Objectives");
    });
  });
});
