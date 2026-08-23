import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BoxCanvas from "@/components/website/box/BoxCanvas";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { createContainer, createGrid, createElement, findBox, type BoxNode } from "@/lib/box-model";

function Harness({ initial, initialSel = null as string | null }: { initial: BoxNode; initialSel?: string | null }) {
  const [root, setRoot] = useState(initial);
  const [sel, setSel] = useState<string | null>(initialSel);
  return <BoxCanvas root={root} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={setRoot} />;
}

const tree = () => createContainer("column", {
  id: "root",
  children: [createElement("text", { id: "t1", text: "Hello world" } as Partial<BoxNode>)],
} as Partial<BoxNode>);

describe("BoxCanvas (box-model editor)", () => {
  it("renders element content from the tree", () => {
    render(<Harness initial={tree()} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("selecting a block reveals its toolbar; delete (via the ⋯ menu) removes it", async () => {
    const user = userEvent.setup();
    render(<Harness initial={tree()} />);
    await user.click(screen.getByText("Hello world"));          // mousedown selects the text block
    await user.click(screen.getByLabelText("Block actions"));   // open the ⋯ menu
    await user.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(screen.queryByText("Hello world")).not.toBeInTheDocument();
  });

  it("adds a Text block inside the selected container", async () => {
    const user = userEvent.setup();
    render(<Harness initial={tree()} initialSel="root" />);
    await user.click(screen.getByLabelText("Block actions"));   // open the ⋯ menu
    await user.click(screen.getByRole("menuitem", { name: "Text" }));
    expect(screen.getByText("New text — click to edit.")).toBeInTheDocument();
  });

  it("adding a section does NOT steal the selection (the parent stays selected)", async () => {
    const user = userEvent.setup();
    const onSelectId = vi.fn();
    function AddHarness() {
      const [root, setRoot] = useState(tree());
      return <BoxCanvas root={root} theme={DEFAULT_THEME} selectedId="root" onSelectId={onSelectId} onChange={setRoot} />;
    }
    const { container } = render(<AddHarness />);
    const before = container.querySelectorAll("[data-box-id]").length;
    await user.click(screen.getByLabelText("Block actions"));
    await user.click(screen.getByRole("menuitem", { name: "Section (stack)" }));
    expect(container.querySelectorAll("[data-box-id]").length).toBeGreaterThan(before); // the new section was added…
    expect(onSelectId).not.toHaveBeenCalled(); // …but the selection never jumped to it
  });

  it("adds a Grid container and renders it as CSS grid", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness initial={tree()} initialSel="root" />);
    await user.click(screen.getByLabelText("Block actions"));
    await user.click(screen.getByRole("menuitem", { name: "Grid" }));
    // the new grid child is a container whose inline style uses display:grid
    const grids = Array.from(container.querySelectorAll<HTMLElement>("[data-box-id]")).filter((el) => el.style.display === "grid");
    expect(grids.length).toBe(1);
    expect(grids[0].style.gridTemplateColumns).toContain("repeat(3");
  });

  it("renders a grid tree with the right column template", () => {
    const g = createGrid(4, { id: "g" } as Partial<BoxNode>);
    render(<Harness initial={createContainer("column", { id: "root", children: [g] } as Partial<BoxNode>)} />);
    const el = document.querySelector<HTMLElement>('[data-box-id="g"]')!;
    expect(el.style.display).toBe("grid");
    expect(el.style.gridTemplateColumns).toBe("repeat(4, minmax(0, 1fr))");
  });

  it("drag-and-drop reorders boxes (drag A's grip onto B → A moves after B)", () => {
    const initial = createContainer("column", {
      id: "root",
      children: [createElement("text", { id: "a", text: "AAA" } as Partial<BoxNode>), createElement("text", { id: "b", text: "BBB" } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    function DragHarness() {
      const [root, setRoot] = useState(initial);
      const [sel, setSel] = useState<string | null>("a"); // A selected so its drag grip shows
      return <BoxCanvas root={root} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={setRoot} />;
    }
    const { container } = render(<DragHarness />);
    const dt = { setData: () => {}, getData: () => "", effectAllowed: "" };
    fireEvent.dragStart(screen.getByLabelText("Drag to move"), { dataTransfer: dt }); // grab A
    const bEl = container.querySelector<HTMLElement>('[data-box-id="b"]')!;
    fireEvent.dragOver(bEl, { dataTransfer: dt, clientX: 0, clientY: 0 });
    fireEvent.drop(bEl, { dataTransfer: dt });
    // DOM order now reflects [root, b, a]
    const ids = Array.from(container.querySelectorAll<HTMLElement>("[data-box-id]")).map((e) => e.getAttribute("data-box-id"));
    expect(ids).toEqual(["root", "b", "a"]);
  });

  it("keyboard: Delete removes the selected box; Ctrl+D duplicates it (WCAG)", () => {
    function KHarness() {
      const [root, setRoot] = useState(tree());
      const [sel, setSel] = useState<string | null>("t1");
      return <BoxCanvas root={root} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={setRoot} />;
    }
    render(<KHarness />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "d", ctrlKey: true }); // duplicate → two copies
    expect(screen.getAllByText("Hello world").length).toBe(2);
    fireEvent.keyDown(document, { key: "Delete" }); // delete the (still-selected) one
    expect(screen.getAllByText("Hello world").length).toBe(1);
  });

  it("copy + paste duplicates the selected box via the clipboard (mouse buttons)", async () => {
    const user = userEvent.setup();
    function CHarness() {
      const [root, setRoot] = useState(tree());
      const [sel, setSel] = useState<string | null>("t1");
      return <BoxCanvas root={root} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={setRoot} />;
    }
    render(<CHarness />);
    await user.click(screen.getByLabelText("Block actions"));
    await user.click(screen.getByRole("menuitem", { name: "Copy" }));
    await user.click(screen.getByLabelText("Block actions")); // re-open the menu
    await user.click(screen.getByRole("menuitem", { name: "Paste" }));
    expect(screen.getAllByText("Hello world").length).toBe(2);
  });

  it("an empty box does NOT clip (so its toolbar/handles are never cut off); only clip:true clips", () => {
    const t = createContainer("column", { id: "root", children: [
      createContainer("column", { id: "empty", padding: 48 } as Partial<BoxNode>),
      createContainer("column", { id: "clipped", clip: true } as Partial<BoxNode>),
    ] } as Partial<BoxNode>);
    const { container } = render(<Harness initial={t} />);
    expect(container.querySelector<HTMLElement>('[data-box-id="empty"]')!.style.overflow).toBe("");        // chrome visible
    expect(container.querySelector<HTMLElement>('[data-box-id="clipped"]')!.style.overflow).toBe("hidden"); // opt-in clip still works
  });

  it("read-only mode shows no toolbars", () => {
    render(<BoxCanvas root={tree()} theme={DEFAULT_THEME} editable={false} onChange={() => {}} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByLabelText("Delete block")).not.toBeInTheDocument();
  });

  it("applies opacity as a 0–1 style", () => {
    const t = createContainer("column", { id: "root", children: [createElement("text", { id: "t1", text: "Hi", opacity: 40 } as Partial<BoxNode>)] } as Partial<BoxNode>);
    const { container } = render(<Harness initial={t} />);
    expect(container.querySelector<HTMLElement>('[data-box-id="t1"]')!.style.opacity).toBe("0.4");
  });

  it("clip:true hides overflow on the box (so it can be forced smaller than content)", () => {
    const t = createContainer("column", { id: "root", children: [createElement("text", { id: "t1", text: "Hi", clip: true } as Partial<BoxNode>)] } as Partial<BoxNode>);
    const { container } = render(<Harness initial={t} />);
    expect(container.querySelector<HTMLElement>('[data-box-id="t1"]')!.style.overflow).toBe("hidden");
  });

  it("the page root uses min-height (grows with content), not a fixed height", () => {
    const t = createContainer("column", { id: "root", children: [] } as Partial<BoxNode>);
    const { container } = render(<BoxCanvas root={t} theme={DEFAULT_THEME} minHeight={500} onChange={() => {}} />);
    const el = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    expect(el.style.minHeight).toBe("500px");
    expect(el.style.height).toBe("");
  });

  it("shows resize handles on every edge and corner of a selected (non-root) block", () => {
    render(<BoxCanvas root={tree()} theme={DEFAULT_THEME} selectedId="t1" onChange={() => {}} />);
    for (const l of ["Resize top edge", "Resize bottom edge", "Resize left edge", "Resize right edge", "Resize top-left corner", "Resize bottom-right corner"]) {
      expect(screen.getByLabelText(l)).toBeInTheDocument();
    }
  });

  it("dragging the bottom edge resizes height as vh (responsive) and fires onResized", () => {
    const onChange = vi.fn();
    const onResized = vi.fn();
    render(<BoxCanvas root={tree()} theme={DEFAULT_THEME} selectedId="t1" onChange={onChange} onResized={onResized} />);
    fireEvent.mouseDown(screen.getByLabelText("Resize bottom edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 60 });
    fireEvent.mouseUp(document);
    const last = onChange.mock.calls.at(-1)![0];
    expect(findBox(last, "t1")?.height).toMatch(/vh$/); // responsive viewport-height unit
    expect(onResized).toHaveBeenCalledWith("t1", "height");
  });

  it("dragging the LEFT edge adds left margin (space), not width", () => {
    const onChange = vi.fn();
    render(<BoxCanvas root={tree()} theme={DEFAULT_THEME} selectedId="t1" onChange={onChange} />);
    fireEvent.mouseDown(screen.getByLabelText("Resize left edge"), { clientX: 100, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 40, clientY: 0 }); // dragged left by 60
    fireEvent.mouseUp(document);
    const n = findBox(onChange.mock.calls.at(-1)![0], "t1");
    expect(n?.marginLeft).toBeGreaterThan(0); // space added on the LEFT
    expect(n?.width).toBe("auto");            // width untouched (still its default)
  });

  it("dragging the TOP edge adds top margin (space above), not height", () => {
    const onChange = vi.fn();
    render(<BoxCanvas root={tree()} theme={DEFAULT_THEME} selectedId="t1" onChange={onChange} />);
    fireEvent.mouseDown(screen.getByLabelText("Resize top edge"), { clientX: 0, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 40 }); // dragged up by 60
    fireEvent.mouseUp(document);
    const n = findBox(onChange.mock.calls.at(-1)![0], "t1");
    expect(n?.marginTop).toBeGreaterThan(0); // space added ABOVE
    expect(n?.height).toBeUndefined();       // height untouched
  });

  it("resizing a section's WIDTH makes its row-siblings fill the remaining space", () => {
    const initial = createContainer("row", {
      id: "root", direction: "row",
      children: [createContainer("column", { id: "a", width: "100%" } as Partial<BoxNode>), createContainer("column", { id: "b", width: "100%" } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const onChange = vi.fn();
    render(<BoxCanvas root={initial} theme={DEFAULT_THEME} selectedId="a" onChange={onChange} />);
    fireEvent.mouseDown(screen.getByLabelText("Resize right edge"), { clientX: 0, clientY: 0 });
    // the sibling-fill is applied at drag start
    expect(findBox(onChange.mock.calls[0][0], "b")?.width).toBe("fill");
    fireEvent.mouseUp(document);
  });

  it("the page root defines a FLUID base unit (--box-u) that scales with the canvas width + browser (WCAG)", () => {
    const t = createContainer("column", { id: "root", baseFont: 10, children: [] } as Partial<BoxNode>);
    const { container } = render(<BoxCanvas root={t} theme={DEFAULT_THEME} onChange={() => {}} />);
    const el = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    // clamp(minRem, cqw, maxRem): rem bounds keep it browser-relative; cqw scales with the container width
    expect(el.style.getPropertyValue("--box-u")).toBe("clamp(0.4375rem, 1cqw, 0.875rem)");
  });
});
