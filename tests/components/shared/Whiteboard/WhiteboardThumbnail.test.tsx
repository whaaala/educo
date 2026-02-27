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

describe("WhiteboardThumbnail", () => {
  it("renders empty state SVG when no elements", () => {
    const { container } = render(<WhiteboardThumbnail elements={[]} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 160 90");
  });

  it("renders rectangle element", () => {
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
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    const rect = container.querySelector("rect");
    expect(rect).toBeInTheDocument();
  });

  it("renders circle element as ellipse", () => {
    const elements = [
      makeElement({
        id: "c1",
        type: "circle",
        x: 50,
        y: 50,
        width: 80,
        height: 80,
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    const ellipse = container.querySelector("ellipse");
    expect(ellipse).toBeInTheDocument();
  });

  it("renders line element", () => {
    const elements = [
      makeElement({
        id: "l1",
        type: "line",
        startX: 0,
        startY: 0,
        endX: 100,
        endY: 100,
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    const line = container.querySelector("line");
    expect(line).toBeInTheDocument();
  });

  it("renders arrow element", () => {
    const elements = [
      makeElement({
        id: "a1",
        type: "arrow",
        startX: 0,
        startY: 0,
        endX: 100,
        endY: 50,
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    // Arrow renders as a group with line segments
    const g = container.querySelector("g");
    expect(g).toBeInTheDocument();
  });

  it("renders text element", () => {
    const elements = [
      makeElement({
        id: "t1",
        type: "text",
        x: 10,
        y: 20,
        text: "Hello World",
        width: 200,
        height: 30,
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    const text = container.querySelector("text");
    expect(text).toBeInTheDocument();
    expect(text!.textContent).toBe("Hello World");
  });

  it("renders sticky note element", () => {
    const elements = [
      makeElement({
        id: "s1",
        type: "sticky",
        x: 10,
        y: 20,
        width: 180,
        height: 160,
        text: "Note text",
        stickyColor: "#fef08a",
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    // Sticky renders rect + optional text
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThan(0);
    const text = container.querySelector("text");
    expect(text!.textContent).toBe("Note text");
  });

  it("truncates sticky text longer than 30 chars", () => {
    const elements = [
      makeElement({
        id: "s2",
        type: "sticky",
        x: 10,
        y: 20,
        width: 180,
        height: 160,
        text: "This is a very long sticky note text that should be truncated",
        stickyColor: "#fef08a",
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    const text = container.querySelector("text");
    expect(text!.textContent).toContain("...");
  });

  it("renders pen path element", () => {
    const elements = [
      makeElement({
        id: "p1",
        type: "pen",
        points: [
          { x: 10, y: 10 },
          { x: 20, y: 30 },
          { x: 40, y: 15 },
        ],
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
  });

  it("renders triangle element as polygon", () => {
    const elements = [
      makeElement({
        id: "tri1",
        type: "triangle",
        x: 10,
        y: 10,
        width: 100,
        height: 80,
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    const polygon = container.querySelector("polygon");
    expect(polygon).toBeInTheDocument();
  });

  it("renders diamond element as polygon", () => {
    const elements = [
      makeElement({
        id: "d1",
        type: "diamond",
        x: 10,
        y: 10,
        width: 100,
        height: 80,
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    const polygon = container.querySelector("polygon");
    expect(polygon).toBeInTheDocument();
  });

  it("renders multiple elements", () => {
    const elements = [
      makeElement({
        id: "r1",
        type: "rectangle",
        x: 10,
        y: 10,
        width: 100,
        height: 50,
      }),
      makeElement({
        id: "c1",
        type: "circle",
        x: 150,
        y: 10,
        width: 80,
        height: 80,
      }),
      makeElement({
        id: "t1",
        type: "text",
        x: 10,
        y: 100,
        text: "Label",
        width: 100,
        height: 20,
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // Should render individual element components
    expect(container.querySelector("rect")).toBeInTheDocument();
    expect(container.querySelector("ellipse")).toBeInTheDocument();
    expect(container.querySelector("text")).toBeInTheDocument();
  });

  it("applies className prop", () => {
    const { container } = render(
      <WhiteboardThumbnail elements={[]} className="w-full h-full" />
    );
    const svg = container.querySelector("svg");
    expect(svg!.classList.contains("w-full")).toBe(true);
  });

  it("renders table element with grid lines", () => {
    const elements = [
      makeElement({
        id: "tbl1",
        type: "table",
        x: 10,
        y: 10,
        width: 300,
        height: 108,
        tableRows: 3,
        tableCols: 3,
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    // Table renders horizontal and vertical lines
    const lines = container.querySelectorAll("line");
    expect(lines.length).toBeGreaterThan(0);
  });

  it("renders chart element", () => {
    const elements = [
      makeElement({
        id: "ch1",
        type: "chart",
        x: 10,
        y: 10,
        width: 300,
        height: 200,
        chartType: "bar",
        chartData: {
          labels: ["A", "B"],
          values: [50, 80],
        },
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    // Chart renders bar rects
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThan(0);
  });

  it("renders flowchart-process with label", () => {
    const elements = [
      makeElement({
        id: "fp1",
        type: "flowchart-process",
        x: 10,
        y: 10,
        width: 120,
        height: 60,
        label: "Process",
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    const text = container.querySelector("text");
    expect(text).toBeInTheDocument();
    expect(text!.textContent).toBe("Process");
  });

  it("renders image placeholder", () => {
    const elements = [
      makeElement({
        id: "img1",
        type: "image",
        x: 10,
        y: 10,
        width: 200,
        height: 150,
      }),
    ];
    const { container } = render(
      <WhiteboardThumbnail elements={elements} />
    );
    // Image renders a placeholder rect with icon
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThan(0);
  });
});
