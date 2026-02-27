import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  generateId,
  buildFontString,
  getStrokeDashArray,
  getBoundingBox,
  hitTest,
  screenToCanvas,
  getResizeHandles,
  hitTestResizeHandle,
  parseRichText,
} from "@/components/shared/Whiteboard/whiteboard-utils";
import type { WhiteboardElement, Point } from "@/components/shared/Whiteboard/whiteboard-types";

// ─── Helper factory ────────────────────────────────────────

function makeElement(overrides: Partial<WhiteboardElement>): WhiteboardElement {
  return {
    id: "test-1",
    type: "rectangle",
    color: "#000000",
    strokeWidth: 2,
    opacity: 1,
    ...overrides,
  };
}

// ─── generateId ────────────────────────────────────────────

describe("generateId", () => {
  it("returns a string starting with 'wb-'", () => {
    const id = generateId();
    expect(id).toMatch(/^wb-/);
  });

  it("generates unique ids on successive calls", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });
});

// ─── buildFontString ───────────────────────────────────────

describe("buildFontString", () => {
  it("returns default font when no formatting set", () => {
    const el = makeElement({});
    const result = buildFontString(el);
    expect(result).toBe("16px Inter, system-ui, sans-serif");
  });

  it("applies italic style", () => {
    const el = makeElement({ fontStyle: "italic" });
    expect(buildFontString(el)).toContain("italic ");
  });

  it("applies bold weight", () => {
    const el = makeElement({ fontWeight: "bold" });
    expect(buildFontString(el)).toContain("bold ");
  });

  it("uses custom fontSize", () => {
    const el = makeElement({ fontSize: 24 });
    expect(buildFontString(el)).toContain("24px");
  });

  it("uses custom fontFamily", () => {
    const el = makeElement({ fontFamily: "Roboto" });
    expect(buildFontString(el)).toContain("Roboto, system-ui, sans-serif");
  });

  it("combines italic, bold, and custom font", () => {
    const el = makeElement({
      fontStyle: "italic",
      fontWeight: "bold",
      fontSize: 36,
      fontFamily: "Georgia",
    });
    expect(buildFontString(el)).toBe(
      "italic bold 36px Georgia, system-ui, sans-serif"
    );
  });
});

// ─── getStrokeDashArray ────────────────────────────────────

describe("getStrokeDashArray", () => {
  it("returns undefined for solid", () => {
    expect(getStrokeDashArray("solid", 2)).toBeUndefined();
  });

  it("returns undefined for undefined pattern", () => {
    expect(getStrokeDashArray(undefined, 2)).toBeUndefined();
  });

  it("returns dash array for dashed", () => {
    expect(getStrokeDashArray("dashed", 2)).toBe("8 6");
  });

  it("returns dash array for dotted", () => {
    expect(getStrokeDashArray("dotted", 2)).toBe("2 4");
  });

  it("returns dash array for dash-dot", () => {
    expect(getStrokeDashArray("dash-dot", 2)).toBe("8 4 2 4");
  });

  it("returns dash array for dash-dot-dot", () => {
    expect(getStrokeDashArray("dash-dot-dot", 2)).toBe("8 4 2 4 2 4");
  });

  it("uses minimum strokeWidth of 1", () => {
    // With strokeWidth 0, w = max(0, 1) = 1
    expect(getStrokeDashArray("dashed", 0)).toBe("4 3");
  });
});

// ─── getBoundingBox ────────────────────────────────────────

describe("getBoundingBox", () => {
  it("returns bounding box for rectangle", () => {
    const el = makeElement({
      type: "rectangle",
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    });
    expect(getBoundingBox(el)).toEqual({
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    });
  });

  it("normalizes negative dimensions for rectangle", () => {
    const el = makeElement({
      type: "rectangle",
      x: 110,
      y: 70,
      width: -100,
      height: -50,
    });
    expect(getBoundingBox(el)).toEqual({
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    });
  });

  it("returns null for rectangle without position", () => {
    const el = makeElement({ type: "rectangle" });
    expect(getBoundingBox(el)).toBeNull();
  });

  it("computes bounding box for pen path", () => {
    const el = makeElement({
      type: "pen",
      points: [
        { x: 5, y: 10 },
        { x: 20, y: 30 },
        { x: 15, y: 5 },
      ],
    });
    expect(getBoundingBox(el)).toEqual({ x: 5, y: 5, width: 15, height: 25 });
  });

  it("returns null for pen with no points", () => {
    const el = makeElement({ type: "pen", points: [] });
    expect(getBoundingBox(el)).toBeNull();
  });

  it("computes bounding box for line", () => {
    const el = makeElement({
      type: "line",
      startX: 10,
      startY: 20,
      endX: 50,
      endY: 80,
    });
    expect(getBoundingBox(el)).toEqual({
      x: 10,
      y: 20,
      width: 40,
      height: 60,
    });
  });

  it("computes bounding box for arrow", () => {
    const el = makeElement({
      type: "arrow",
      startX: 100,
      startY: 50,
      endX: 10,
      endY: 20,
    });
    expect(getBoundingBox(el)).toEqual({
      x: 10,
      y: 20,
      width: 90,
      height: 30,
    });
  });

  it("returns null for line missing coordinates", () => {
    const el = makeElement({ type: "line", startX: 10 });
    expect(getBoundingBox(el)).toBeNull();
  });

  it("computes bounding box for text", () => {
    const el = makeElement({
      type: "text",
      x: 50,
      y: 100,
      text: "Hello",
      width: 200,
      height: 30,
    });
    expect(getBoundingBox(el)).toEqual({
      x: 50,
      y: 100,
      width: 200,
      height: 30,
    });
  });

  it("uses default dimensions for text without width/height", () => {
    const el = makeElement({
      type: "text",
      x: 50,
      y: 100,
      text: "Hello",
    });
    const bbox = getBoundingBox(el);
    expect(bbox).not.toBeNull();
    expect(bbox!.width).toBe(200); // default
    expect(bbox!.height).toBe(24); // default fontSize(16) + 8
  });

  it("computes bounding box for sticky", () => {
    const el = makeElement({
      type: "sticky",
      x: 10,
      y: 20,
      width: 180,
      height: 160,
    });
    expect(getBoundingBox(el)).toEqual({
      x: 10,
      y: 20,
      width: 180,
      height: 160,
    });
  });

  it("computes bounding box for table", () => {
    const el = makeElement({
      type: "table",
      x: 0,
      y: 0,
      width: 300,
      height: 200,
    });
    expect(getBoundingBox(el)).toEqual({
      x: 0,
      y: 0,
      width: 300,
      height: 200,
    });
  });

  it("computes bounding box for chart", () => {
    const el = makeElement({
      type: "chart",
      x: 50,
      y: 50,
      width: 400,
      height: 300,
    });
    expect(getBoundingBox(el)).toEqual({
      x: 50,
      y: 50,
      width: 400,
      height: 300,
    });
  });

  it("computes bounding box for circle", () => {
    const el = makeElement({
      type: "circle",
      x: 10,
      y: 10,
      width: 100,
      height: 100,
    });
    expect(getBoundingBox(el)).toEqual({
      x: 10,
      y: 10,
      width: 100,
      height: 100,
    });
  });

  it("computes bounding box for image", () => {
    const el = makeElement({
      type: "image",
      x: 20,
      y: 30,
      width: 200,
      height: 150,
    });
    expect(getBoundingBox(el)).toEqual({
      x: 20,
      y: 30,
      width: 200,
      height: 150,
    });
  });
});

// ─── hitTest ───────────────────────────────────────────────

describe("hitTest", () => {
  it("returns true when point is inside bounding box", () => {
    const el = makeElement({
      type: "rectangle",
      x: 10,
      y: 10,
      width: 100,
      height: 100,
    });
    expect(hitTest({ x: 50, y: 50 }, el)).toBe(true);
  });

  it("returns true within tolerance zone", () => {
    const el = makeElement({
      type: "rectangle",
      x: 10,
      y: 10,
      width: 100,
      height: 100,
    });
    // Just outside bbox but within 8px tolerance
    expect(hitTest({ x: 5, y: 50 }, el)).toBe(true);
  });

  it("returns false when point is far outside", () => {
    const el = makeElement({
      type: "rectangle",
      x: 10,
      y: 10,
      width: 100,
      height: 100,
    });
    expect(hitTest({ x: 200, y: 200 }, el)).toBe(false);
  });

  it("returns false when element has no bounding box", () => {
    const el = makeElement({ type: "pen", points: [] });
    expect(hitTest({ x: 50, y: 50 }, el)).toBe(false);
  });

  it("respects custom tolerance", () => {
    const el = makeElement({
      type: "rectangle",
      x: 10,
      y: 10,
      width: 100,
      height: 100,
    });
    // Point at x=0, tolerance=5: bbox.x - 5 = 5, 0 < 5, so false
    expect(hitTest({ x: 0, y: 50 }, el, 5)).toBe(false);
    // tolerance=15: bbox.x - 15 = -5, 0 > -5, so true
    expect(hitTest({ x: 0, y: 50 }, el, 15)).toBe(true);
  });
});

// ─── screenToCanvas ────────────────────────────────────────

describe("screenToCanvas", () => {
  it("converts screen to canvas coordinates with default viewport", () => {
    const viewport = { x: 0, y: 0, zoom: 1 };
    const canvasRect = { left: 0, top: 0 } as DOMRect;
    const result = screenToCanvas(100, 200, viewport, canvasRect);
    expect(result).toEqual({ x: 100, y: 200 });
  });

  it("accounts for viewport offset", () => {
    const viewport = { x: 50, y: 30, zoom: 1 };
    const canvasRect = { left: 0, top: 0 } as DOMRect;
    const result = screenToCanvas(100, 200, viewport, canvasRect);
    expect(result).toEqual({ x: 50, y: 170 });
  });

  it("accounts for zoom", () => {
    const viewport = { x: 0, y: 0, zoom: 2 };
    const canvasRect = { left: 0, top: 0 } as DOMRect;
    const result = screenToCanvas(200, 400, viewport, canvasRect);
    expect(result).toEqual({ x: 100, y: 200 });
  });

  it("accounts for canvas rect offset", () => {
    const viewport = { x: 0, y: 0, zoom: 1 };
    const canvasRect = { left: 50, top: 100 } as DOMRect;
    const result = screenToCanvas(150, 300, viewport, canvasRect);
    expect(result).toEqual({ x: 100, y: 200 });
  });
});

// ─── getResizeHandles ──────────────────────────────────────

describe("getResizeHandles", () => {
  it("returns 8 corner/edge handles for rectangle", () => {
    const el = makeElement({
      type: "rectangle",
      x: 10,
      y: 10,
      width: 100,
      height: 80,
    });
    const handles = getResizeHandles(el);
    expect(handles).toHaveLength(8);
    const handleNames = handles.map((h) => h.handle);
    expect(handleNames).toContain("nw");
    expect(handleNames).toContain("ne");
    expect(handleNames).toContain("se");
    expect(handleNames).toContain("sw");
    expect(handleNames).toContain("n");
    expect(handleNames).toContain("e");
    expect(handleNames).toContain("s");
    expect(handleNames).toContain("w");
  });

  it("returns 2 handles for line (start and end)", () => {
    const el = makeElement({
      type: "line",
      startX: 10,
      startY: 20,
      endX: 100,
      endY: 80,
    });
    const handles = getResizeHandles(el);
    expect(handles).toHaveLength(2);
    expect(handles[0].handle).toBe("line-start");
    expect(handles[1].handle).toBe("line-end");
    expect(handles[0]).toEqual({ handle: "line-start", x: 10, y: 20 });
    expect(handles[1]).toEqual({ handle: "line-end", x: 100, y: 80 });
  });

  it("returns 2 handles for arrow", () => {
    const el = makeElement({
      type: "arrow",
      startX: 0,
      startY: 0,
      endX: 50,
      endY: 50,
    });
    const handles = getResizeHandles(el);
    expect(handles).toHaveLength(2);
  });

  it("returns empty array when element has no bounding box", () => {
    const el = makeElement({ type: "pen", points: [] });
    expect(getResizeHandles(el)).toEqual([]);
  });

  it("computes correct corner positions for rectangle", () => {
    const el = makeElement({
      type: "rectangle",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    const handles = getResizeHandles(el);
    const nw = handles.find((h) => h.handle === "nw")!;
    const se = handles.find((h) => h.handle === "se")!;
    expect(nw).toEqual({ handle: "nw", x: 0, y: 0 });
    expect(se).toEqual({ handle: "se", x: 100, y: 100 });
  });
});

// ─── hitTestResizeHandle ───────────────────────────────────

describe("hitTestResizeHandle", () => {
  it("returns handle when point is near a handle", () => {
    const el = makeElement({
      type: "rectangle",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    // Near the NW corner (0, 0)
    const result = hitTestResizeHandle({ x: 2, y: 2 }, el, 1);
    expect(result).toBe("nw");
  });

  it("returns null when point is not near any handle", () => {
    const el = makeElement({
      type: "rectangle",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    const result = hitTestResizeHandle({ x: 50, y: 50 }, el, 1);
    expect(result).toBeNull();
  });

  it("returns line-start for point near line start", () => {
    const el = makeElement({
      type: "line",
      startX: 10,
      startY: 20,
      endX: 100,
      endY: 80,
    });
    const result = hitTestResizeHandle({ x: 11, y: 21 }, el, 1);
    expect(result).toBe("line-start");
  });
});

// ─── parseRichText ─────────────────────────────────────────

describe("parseRichText", () => {
  it("parses plain text", () => {
    const segments = parseRichText("Hello world");
    expect(segments.length).toBeGreaterThan(0);
    const text = segments.map((s) => s.text).join("");
    expect(text).toContain("Hello world");
  });

  it("parses bold tags", () => {
    const segments = parseRichText("<b>Bold</b> text");
    const boldSeg = segments.find((s) => s.bold);
    expect(boldSeg).toBeDefined();
    expect(boldSeg!.text).toBe("Bold");
  });

  it("parses italic tags", () => {
    const segments = parseRichText("<i>Italic</i> text");
    const italicSeg = segments.find((s) => s.italic);
    expect(italicSeg).toBeDefined();
    expect(italicSeg!.text).toBe("Italic");
  });

  it("parses underline tags", () => {
    const segments = parseRichText("<u>Underlined</u> text");
    const underlineSeg = segments.find((s) => s.underline);
    expect(underlineSeg).toBeDefined();
    expect(underlineSeg!.text).toBe("Underlined");
  });

  it("parses strong and em tags", () => {
    const segments = parseRichText("<strong>Strong</strong> <em>Emphasis</em>");
    const strongSeg = segments.find((s) => s.bold);
    const emSeg = segments.find((s) => s.italic);
    expect(strongSeg).toBeDefined();
    expect(emSeg).toBeDefined();
  });

  it("handles nested formatting", () => {
    const segments = parseRichText("<b><i>BoldItalic</i></b>");
    const biSeg = segments.find((s) => s.bold && s.italic);
    expect(biSeg).toBeDefined();
    expect(biSeg!.text).toBe("BoldItalic");
  });

  it("handles br tags as newlines", () => {
    const segments = parseRichText("Line1<br>Line2");
    const hasNewline = segments.some((s) => s.text === "\n");
    expect(hasNewline).toBe(true);
  });
});
