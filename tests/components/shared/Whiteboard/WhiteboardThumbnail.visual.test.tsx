import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import WhiteboardThumbnail from "@/components/shared/Whiteboard/WhiteboardThumbnail";
import type { WhiteboardElement } from "@/components/shared/Whiteboard/whiteboard-types";

function makeElement(overrides: Partial<WhiteboardElement>): WhiteboardElement {
  return {
    id: "el-1",
    type: "rectangle",
    color: "#000000",
    strokeWidth: 2,
    opacity: 1,
    ...overrides,
  };
}

describe("WhiteboardThumbnail — Visual / SVG", () => {
  // ─── Empty state ─────────────────────────────
  describe("empty state appearance", () => {
    it("has 160x90 viewBox for empty state", () => {
      const { container } = render(<WhiteboardThumbnail elements={[]} />);
      const svg = container.querySelector("svg")!;
      expect(svg.getAttribute("viewBox")).toBe("0 0 160 90");
    });

    it("has xMidYMid slice aspect ratio for empty state", () => {
      const { container } = render(<WhiteboardThumbnail elements={[]} />);
      const svg = container.querySelector("svg")!;
      expect(svg.getAttribute("preserveAspectRatio")).toBe(
        "xMidYMid slice"
      );
    });

    it("renders background rect with light gray fill", () => {
      const { container } = render(<WhiteboardThumbnail elements={[]} />);
      const bgRect = container.querySelector("rect");
      expect(bgRect).toBeInTheDocument();
      expect(bgRect!.getAttribute("fill")).toBe("#f9fafb");
    });

    it("renders dot grid with low opacity", () => {
      const { container } = render(<WhiteboardThumbnail elements={[]} />);
      const dotGrid = container.querySelector("g[opacity]");
      expect(dotGrid).toBeInTheDocument();
      expect(dotGrid!.getAttribute("opacity")).toBe("0.18");
    });

    it("renders pen icon with low opacity for empty state", () => {
      const { container } = render(<WhiteboardThumbnail elements={[]} />);
      // The pen icon group has opacity 0.15
      const penGroup = container.querySelector('g[opacity="0.15"]');
      expect(penGroup).toBeInTheDocument();
    });
  });

  // ─── Content state ───────────────────────────
  describe("content state appearance", () => {
    const elements = [
      makeElement({
        id: "r1",
        type: "rectangle",
        x: 10,
        y: 10,
        width: 100,
        height: 50,
      }),
    ];

    it("has xMidYMid meet aspect ratio for content", () => {
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const svg = container.querySelector("svg")!;
      expect(svg.getAttribute("preserveAspectRatio")).toBe(
        "xMidYMid meet"
      );
    });

    it("adjusts viewBox to fit content with padding", () => {
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const svg = container.querySelector("svg")!;
      const viewBox = svg.getAttribute("viewBox")!;
      // With padding of 20, min should be 10-20=-10, max should be 110+20=130
      // viewBox = "-10 -10 140 90"
      expect(viewBox).toBe("-10 -10 140 90");
    });

    it("renders white background behind content", () => {
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const bgRect = container.querySelector("rect");
      expect(bgRect!.getAttribute("fill")).toBe("white");
    });
  });

  // ─── Element stroke and color rendering ──────
  describe("element visual properties", () => {
    it("rectangle stroke matches element color", () => {
      const elements = [
        makeElement({
          id: "r1",
          type: "rectangle",
          x: 10,
          y: 10,
          width: 100,
          height: 50,
          color: "#ef4444",
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      // Find the rect that's NOT the background
      const rects = container.querySelectorAll("rect");
      const elRect = Array.from(rects).find(
        (r) => r.getAttribute("stroke") === "#ef4444"
      );
      expect(elRect).toBeDefined();
    });

    it("circle element uses correct stroke width", () => {
      const elements = [
        makeElement({
          id: "c1",
          type: "circle",
          x: 50,
          y: 50,
          width: 80,
          height: 80,
          strokeWidth: 4,
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const ellipse = container.querySelector("ellipse");
      expect(ellipse!.getAttribute("stroke-width")).toBe("4");
    });

    it("element respects opacity property", () => {
      const elements = [
        makeElement({
          id: "r1",
          type: "rectangle",
          x: 10,
          y: 10,
          width: 100,
          height: 50,
          opacity: 0.5,
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const rects = container.querySelectorAll("rect");
      const elRect = Array.from(rects).find(
        (r) => r.getAttribute("opacity") === "0.5"
      );
      expect(elRect).toBeDefined();
    });

    it("line element renders with element color", () => {
      const elements = [
        makeElement({
          id: "l1",
          type: "line",
          startX: 0,
          startY: 0,
          endX: 100,
          endY: 100,
          color: "#3b82f6",
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const line = container.querySelector("line");
      expect(line!.getAttribute("stroke")).toBe("#3b82f6");
    });

    it("text element uses correct fontSize", () => {
      const elements = [
        makeElement({
          id: "t1",
          type: "text",
          x: 10,
          y: 20,
          text: "Hello",
          width: 200,
          height: 30,
          fontSize: 24,
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const text = container.querySelector("text");
      expect(text!.getAttribute("font-size")).toBe("24");
    });

    it("text element uses fontFamily with fallback", () => {
      const elements = [
        makeElement({
          id: "t1",
          type: "text",
          x: 10,
          y: 20,
          text: "Hello",
          width: 200,
          height: 30,
          fontFamily: "Roboto",
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const text = container.querySelector("text");
      expect(text!.getAttribute("font-family")).toContain("Roboto");
      expect(text!.getAttribute("font-family")).toContain("system-ui");
    });

    it("text with underline renders textDecoration", () => {
      const elements = [
        makeElement({
          id: "t1",
          type: "text",
          x: 10,
          y: 20,
          text: "Hello",
          width: 200,
          height: 30,
          textDecoration: "underline",
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const text = container.querySelector("text");
      expect(text!.getAttribute("text-decoration")).toBe("underline");
    });

    it("sticky note uses stickyColor for fill", () => {
      const elements = [
        makeElement({
          id: "s1",
          type: "sticky",
          x: 10,
          y: 20,
          width: 180,
          height: 160,
          stickyColor: "#bbf7d0",
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const rect = container.querySelector("rect[rx]");
      expect(rect!.getAttribute("fill")).toBe("#bbf7d0");
    });

    it("sticky note has opacity 0.95", () => {
      const elements = [
        makeElement({
          id: "s1",
          type: "sticky",
          x: 10,
          y: 20,
          width: 180,
          height: 160,
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const rect = container.querySelector('rect[opacity="0.95"]');
      expect(rect).toBeInTheDocument();
    });
  });

  // ─── Dashed stroke patterns ──────────────────
  describe("stroke dash patterns", () => {
    it("dashed line renders stroke-dasharray", () => {
      const elements = [
        makeElement({
          id: "l1",
          type: "line",
          startX: 0,
          startY: 0,
          endX: 100,
          endY: 100,
          strokeDash: "dashed",
          strokeWidth: 2,
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const line = container.querySelector("line");
      expect(line!.getAttribute("stroke-dasharray")).toBe("8 6");
    });

    it("dotted rectangle renders stroke-dasharray", () => {
      const elements = [
        makeElement({
          id: "r1",
          type: "rectangle",
          x: 10,
          y: 10,
          width: 100,
          height: 50,
          strokeDash: "dotted",
          strokeWidth: 2,
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const rect = container.querySelector("rect[stroke-dasharray]");
      expect(rect).toBeInTheDocument();
      expect(rect!.getAttribute("stroke-dasharray")).toBe("2 4");
    });

    it("solid line has no stroke-dasharray", () => {
      const elements = [
        makeElement({
          id: "l1",
          type: "line",
          startX: 0,
          startY: 0,
          endX: 100,
          endY: 100,
          strokeDash: "solid",
        }),
      ];
      const { container } = render(
        <WhiteboardThumbnail elements={elements} />
      );
      const line = container.querySelector("line");
      expect(line!.getAttribute("stroke-dasharray")).toBeNull();
    });
  });

  // ─── Dot grid ────────────────────────────────
  describe("dot grid", () => {
    it("renders dot circles with 1.2 radius", () => {
      const { container } = render(<WhiteboardThumbnail elements={[]} />);
      // Scope to the dot grid group (opacity 0.18) to exclude pen icon circles
      const dotGrid = container.querySelector('g[opacity="0.18"]');
      expect(dotGrid).toBeInTheDocument();
      const dots = dotGrid!.querySelectorAll("circle");
      expect(dots.length).toBeGreaterThan(0);
      for (const dot of dots) {
        expect(dot.getAttribute("r")).toBe("1.2");
      }
    });

    it("dots have gray fill color", () => {
      const { container } = render(<WhiteboardThumbnail elements={[]} />);
      const dotGrid = container.querySelector('g[opacity="0.18"]');
      const dots = dotGrid!.querySelectorAll("circle");
      for (const dot of dots) {
        expect(dot.getAttribute("fill")).toBe("#9ca3af");
      }
    });
  });
});
