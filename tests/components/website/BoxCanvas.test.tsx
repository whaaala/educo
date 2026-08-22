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

  it("selecting a block reveals its toolbar; delete removes it", async () => {
    const user = userEvent.setup();
    render(<Harness initial={tree()} />);
    await user.click(screen.getByText("Hello world")); // mousedown selects the text block
    const del = screen.getByLabelText("Delete block");
    await user.click(del);
    expect(screen.queryByText("Hello world")).not.toBeInTheDocument();
  });

  it("adds a Text block inside the selected container", async () => {
    const user = userEvent.setup();
    render(<Harness initial={tree()} initialSel="root" />);
    await user.click(screen.getByLabelText("Add block"));      // open the add menu
    await user.click(screen.getByRole("button", { name: "Text" }));
    expect(screen.getByText("New text — click to edit.")).toBeInTheDocument();
  });

  it("adds a Grid container and renders it as CSS grid", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness initial={tree()} initialSel="root" />);
    await user.click(screen.getByLabelText("Add block"));
    await user.click(screen.getByRole("button", { name: "Grid" }));
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

  it("dragging the bottom edge resizes height in px and fires onResized", () => {
    const onChange = vi.fn();
    const onResized = vi.fn();
    render(<BoxCanvas root={tree()} theme={DEFAULT_THEME} selectedId="t1" onChange={onChange} onResized={onResized} />);
    fireEvent.mouseDown(screen.getByLabelText("Resize bottom edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 60 });
    fireEvent.mouseUp(document);
    const last = onChange.mock.calls.at(-1)![0];
    expect(findBox(last, "t1")?.height).toMatch(/^\d+px$/);
    expect(onResized).toHaveBeenCalledWith("t1", "height");
  });
});
