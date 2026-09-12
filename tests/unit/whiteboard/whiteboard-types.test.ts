import { describe, expect, it } from "vitest";
import {
  DEFAULT_COLORS,
  FILL_COLORS,
  STICKY_COLORS,
  STROKE_WIDTHS,
  FONT_FAMILIES,
  FONT_FAMILY_CATEGORIES,
  FONT_SIZES,
  LINE_SPACINGS,
  STROKE_DASH_PATTERNS,
  EXTENDED_STROKE_WIDTHS,
  DEFAULT_VIEWPORT,
  BBOX_SHAPE_TOOLS,
  LINE_TOOLS,
  FILL_TOOLS,
} from "@/components/shared/Whiteboard/whiteboard-types";

describe("whiteboard-types constants", () => {
  // ─── DEFAULT_COLORS ──────────────────────────
  describe("DEFAULT_COLORS", () => {
    it("has 10 colors", () => {
      expect(DEFAULT_COLORS).toHaveLength(10);
    });

    it("starts with black and ends with white", () => {
      expect(DEFAULT_COLORS[0]).toBe("#000000");
      expect(DEFAULT_COLORS[DEFAULT_COLORS.length - 1]).toBe("#ffffff");
    });

    it("all entries are valid hex color strings", () => {
      for (const c of DEFAULT_COLORS) {
        expect(c).toMatch(/^#[0-9a-f]{6}$/);
      }
    });
  });

  // ─── FILL_COLORS ─────────────────────────────
  describe("FILL_COLORS", () => {
    it("has 10 entries", () => {
      expect(FILL_COLORS).toHaveLength(10);
    });

    it("first entry is null (no fill)", () => {
      expect(FILL_COLORS[0]).toBeNull();
    });

    it("remaining entries are hex strings", () => {
      for (const c of FILL_COLORS.slice(1)) {
        expect(c).toMatch(/^#[0-9a-f]{6}$/);
      }
    });
  });

  // ─── STICKY_COLORS ───────────────────────────
  describe("STICKY_COLORS", () => {
    it("has 6 colors", () => {
      expect(STICKY_COLORS).toHaveLength(6);
    });

    it("first color is yellow", () => {
      expect(STICKY_COLORS[0]).toBe("#fef08a");
    });

    it("all entries are valid hex color strings", () => {
      for (const c of STICKY_COLORS) {
        expect(c).toMatch(/^#[0-9a-f]{6}$/);
      }
    });
  });

  // ─── STROKE_WIDTHS ───────────────────────────
  describe("STROKE_WIDTHS", () => {
    it("has 5 widths", () => {
      expect(STROKE_WIDTHS).toHaveLength(5);
    });

    it("is sorted ascending", () => {
      for (let i = 1; i < STROKE_WIDTHS.length; i++) {
        expect(STROKE_WIDTHS[i]).toBeGreaterThan(STROKE_WIDTHS[i - 1]);
      }
    });

    it("values are [2, 4, 6, 8, 12]", () => {
      expect(STROKE_WIDTHS).toEqual([2, 4, 6, 8, 12]);
    });
  });

  // ─── FONT_FAMILIES ───────────────────────────
  describe("FONT_FAMILIES", () => {
    it("contains Inter as the first font", () => {
      expect(FONT_FAMILIES[0]).toBe("Inter");
    });

    it("has at least 50 fonts", () => {
      expect(FONT_FAMILIES.length).toBeGreaterThanOrEqual(50);
    });

    it("contains no duplicates", () => {
      const unique = new Set(FONT_FAMILIES);
      expect(unique.size).toBe(FONT_FAMILIES.length);
    });
  });

  // ─── FONT_FAMILY_CATEGORIES ──────────────────
  describe("FONT_FAMILY_CATEGORIES", () => {
    it("has 4 categories", () => {
      expect(FONT_FAMILY_CATEGORIES).toHaveLength(4);
    });

    it("categories are Sans-serif, Serif, Monospace, Display & Handwriting", () => {
      const labels = FONT_FAMILY_CATEGORIES.map((c) => c.label);
      expect(labels).toEqual([
        "Sans-serif",
        "Serif",
        "Monospace",
        "Display & Handwriting",
      ]);
    });

    it("total fonts across categories equals FONT_FAMILIES length", () => {
      const total = FONT_FAMILY_CATEGORIES.reduce(
        (sum, c) => sum + c.fonts.length,
        0
      );
      expect(total).toBe(FONT_FAMILIES.length);
    });
  });

  // ─── FONT_SIZES ──────────────────────────────
  describe("FONT_SIZES", () => {
    it("has 13 sizes", () => {
      expect(FONT_SIZES).toHaveLength(13);
    });

    it("is sorted ascending", () => {
      for (let i = 1; i < FONT_SIZES.length; i++) {
        expect(FONT_SIZES[i]).toBeGreaterThan(FONT_SIZES[i - 1]);
      }
    });

    it("starts at 6 and ends at 96", () => {
      expect(FONT_SIZES[0]).toBe(6);
      expect(FONT_SIZES[FONT_SIZES.length - 1]).toBe(96);
    });
  });

  // ─── LINE_SPACINGS ───────────────────────────
  describe("LINE_SPACINGS", () => {
    it("has 4 options", () => {
      expect(LINE_SPACINGS).toHaveLength(4);
    });

    it("first is Single (1.0) and last is Double (2.0)", () => {
      expect(LINE_SPACINGS[0]).toEqual({ value: 1.0, label: "Single" });
      expect(LINE_SPACINGS[LINE_SPACINGS.length - 1]).toEqual({
        value: 2.0,
        label: "Double",
      });
    });
  });

  // ─── STROKE_DASH_PATTERNS ────────────────────
  describe("STROKE_DASH_PATTERNS", () => {
    it("has 5 patterns", () => {
      expect(STROKE_DASH_PATTERNS).toHaveLength(5);
    });

    it("includes solid, dashed, dotted, dash-dot, dash-dot-dot", () => {
      expect(STROKE_DASH_PATTERNS).toEqual([
        "solid",
        "dashed",
        "dotted",
        "dash-dot",
        "dash-dot-dot",
      ]);
    });
  });

  // ─── EXTENDED_STROKE_WIDTHS ──────────────────
  describe("EXTENDED_STROKE_WIDTHS", () => {
    it("has 8 widths", () => {
      expect(EXTENDED_STROKE_WIDTHS).toHaveLength(8);
    });

    it("is sorted ascending", () => {
      for (let i = 1; i < EXTENDED_STROKE_WIDTHS.length; i++) {
        expect(EXTENDED_STROKE_WIDTHS[i]).toBeGreaterThan(
          EXTENDED_STROKE_WIDTHS[i - 1]
        );
      }
    });
  });

  // ─── DEFAULT_VIEWPORT ────────────────────────
  describe("DEFAULT_VIEWPORT", () => {
    it("has x=0, y=0, zoom=1", () => {
      expect(DEFAULT_VIEWPORT).toEqual({ x: 0, y: 0, zoom: 1 });
    });
  });

  // ─── Shape tool arrays ───────────────────────
  describe("BBOX_SHAPE_TOOLS", () => {
    it("contains rectangle, circle, triangle, diamond, star, hexagon", () => {
      expect(BBOX_SHAPE_TOOLS).toContain("rectangle");
      expect(BBOX_SHAPE_TOOLS).toContain("circle");
      expect(BBOX_SHAPE_TOOLS).toContain("triangle");
      expect(BBOX_SHAPE_TOOLS).toContain("diamond");
      expect(BBOX_SHAPE_TOOLS).toContain("star");
      expect(BBOX_SHAPE_TOOLS).toContain("hexagon");
    });

    it("contains flowchart shapes", () => {
      expect(BBOX_SHAPE_TOOLS).toContain("flowchart-process");
      expect(BBOX_SHAPE_TOOLS).toContain("flowchart-decision");
      expect(BBOX_SHAPE_TOOLS).toContain("flowchart-terminal");
      expect(BBOX_SHAPE_TOOLS).toContain("flowchart-data");
      expect(BBOX_SHAPE_TOOLS).toContain("flowchart-document");
    });

    it("has 14 total shapes", () => {
      expect(BBOX_SHAPE_TOOLS).toHaveLength(14);
    });
  });

  describe("LINE_TOOLS", () => {
    it("contains line, arrow, double-arrow, connector, curved-connector, curve", () => {
      expect(LINE_TOOLS).toEqual([
        "line",
        "arrow",
        "double-arrow",
        "connector",
        "curved-connector",
        "curve",
      ]);
    });
  });

  describe("FILL_TOOLS", () => {
    it("has same items as BBOX_SHAPE_TOOLS", () => {
      // FILL_TOOLS should match BBOX_SHAPE_TOOLS for showing fill color
      expect(FILL_TOOLS).toHaveLength(BBOX_SHAPE_TOOLS.length);
      for (const tool of BBOX_SHAPE_TOOLS) {
        expect(FILL_TOOLS).toContain(tool);
      }
    });
  });
});
