import { describe, it, expect } from "vitest";
import { DOC_TEMPLATES, TEMPLATE_CATEGORIES, CATEGORY_COLORS } from "@/lib/doc-templates";

describe("doc-templates — Template Library", () => {
  describe("Template count and structure", () => {
    it("has at least 30 templates", () => {
      expect(DOC_TEMPLATES.length).toBeGreaterThanOrEqual(30);
    });

    it("every template has required fields", () => {
      for (const tpl of DOC_TEMPLATES) {
        expect(tpl.id).toBeTruthy();
        expect(tpl.label).toBeTruthy();
        expect(tpl.category).toBeTruthy();
        expect(tpl.title).toBeTruthy();
        expect(tpl.html).toBeTruthy();
        expect(tpl.html.length).toBeGreaterThan(50);
      }
    });

    it("every template has a unique ID", () => {
      const ids = DOC_TEMPLATES.map(t => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("Categories", () => {
    it("has at least 8 categories", () => {
      expect(TEMPLATE_CATEGORIES.length).toBeGreaterThanOrEqual(8);
    });

    it("includes all expected categories", () => {
      const expected = ["Resumes", "Letters", "Legal", "Business", "Education", "Planning", "Reports", "Personal"];
      for (const cat of expected) {
        expect(TEMPLATE_CATEGORIES).toContain(cat);
      }
    });

    it("every category has at least 2 templates", () => {
      for (const cat of TEMPLATE_CATEGORIES) {
        const count = DOC_TEMPLATES.filter(t => t.category === cat).length;
        expect(count).toBeGreaterThanOrEqual(2);
      }
    });

    it("every category has a color defined", () => {
      for (const cat of TEMPLATE_CATEGORIES) {
        expect(CATEGORY_COLORS[cat]).toBeTruthy();
        expect(CATEGORY_COLORS[cat]).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });
  });

  describe("Legal templates have proper structure", () => {
    it("Consultant Agreement has key sections", () => {
      const tpl = DOC_TEMPLATES.find(t => t.id === "consultant-agreement");
      expect(tpl).toBeTruthy();
      expect(tpl!.html).toContain("Services");
      expect(tpl!.html).toContain("Term");
      expect(tpl!.html).toContain("Termination");
      expect(tpl!.html).toContain("Compensation");
      expect(tpl!.html).toContain("Signature");
    });

    it("NDA has confidentiality obligations", () => {
      const tpl = DOC_TEMPLATES.find(t => t.id === "nda");
      expect(tpl).toBeTruthy();
      expect(tpl!.html).toContain("Confidential");
      expect(tpl!.html).toContain("Obligations");
      expect(tpl!.html).toContain("Duration");
    });

    it("Employment Contract has compensation section", () => {
      const tpl = DOC_TEMPLATES.find(t => t.id === "employment-contract");
      expect(tpl).toBeTruthy();
      expect(tpl!.html).toContain("Compensation");
      expect(tpl!.html).toContain("Termination");
    });
  });

  describe("Resume templates have professional content", () => {
    it("Modern Resume has Experience and Education", () => {
      const tpl = DOC_TEMPLATES.find(t => t.id === "resume-modern");
      expect(tpl).toBeTruthy();
      expect(tpl!.html).toContain("Experience");
      expect(tpl!.html).toContain("Education");
      expect(tpl!.html).toContain("Skills");
    });

    it("Executive Resume has leadership content", () => {
      const tpl = DOC_TEMPLATES.find(t => t.id === "resume-executive");
      expect(tpl).toBeTruthy();
      expect(tpl!.html).toContain("Leadership");
      expect(tpl!.html).toContain("Board");
    });
  });

  describe("Business templates", () => {
    it("Business Plan has market size and revenue model", () => {
      const tpl = DOC_TEMPLATES.find(t => t.id === "business-plan");
      expect(tpl).toBeTruthy();
      expect(tpl!.html).toContain("Market");
      expect(tpl!.html).toContain("Revenue");
    });

    it("Invoice has line items and total", () => {
      const tpl = DOC_TEMPLATES.find(t => t.id === "invoice");
      expect(tpl).toBeTruthy();
      expect(tpl!.html).toContain("Total");
      expect(tpl!.html).toContain("INVOICE");
    });

    it("SOP has procedure steps", () => {
      const tpl = DOC_TEMPLATES.find(t => t.id === "sop");
      expect(tpl).toBeTruthy();
      expect(tpl!.html).toContain("Procedure");
      expect(tpl!.html).toContain("Step");
    });
  });

  describe("Education templates", () => {
    it("Lesson Plan has objectives and structure", () => {
      const tpl = DOC_TEMPLATES.find(t => t.id === "lesson-plan");
      expect(tpl).toBeTruthy();
      expect(tpl!.html).toContain("Learning Objectives");
      expect(tpl!.html).toContain("Homework");
      expect(tpl!.html).toContain("Assessment");
    });

    it("Research Paper has methodology and references", () => {
      const tpl = DOC_TEMPLATES.find(t => t.id === "research-paper");
      expect(tpl).toBeTruthy();
      expect(tpl!.html).toContain("Methodology");
      expect(tpl!.html).toContain("References");
      expect(tpl!.html).toContain("Abstract");
    });
  });
});
