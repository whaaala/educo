import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BoxCanvas from "@/components/website/box/BoxCanvas";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { createContainer, createGrid, createElement, findBox, makeRowBand, normalizeRowBands, type BoxNode } from "@/lib/box-model";

function Harness({ initial, initialSel = null as string | null }: { initial: BoxNode; initialSel?: string | null }) {
  const [root, setRoot] = useState(initial);
  const [sel, setSel] = useState<string | null>(initialSel);
  return <BoxCanvas root={root} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={setRoot} />;
}

const tree = () => createContainer("column", {
  id: "root",
  children: [createElement("text", { id: "t1", text: "Hello world" } as Partial<BoxNode>)],
} as Partial<BoxNode>);

// jsdom has no layout engine, so getBoundingClientRect returns zeros. Stub a rect on an element so the
// pointer drag-and-drop hit-testing (which reads element geometry) has something meaningful to work with.
function stubRect(el: HTMLElement, r: { top: number; left: number; width: number; height: number }) {
  el.getBoundingClientRect = () => ({
    top: r.top, left: r.left, width: r.width, height: r.height,
    right: r.left + r.width, bottom: r.top + r.height, x: r.left, y: r.top, toJSON: () => ({}),
  } as DOMRect);
}
// The pixel-based resize maths reads the parent's clientWidth (0 in jsdom) — stub it so the geometry is real.
function stubClientWidth(el: HTMLElement, w: number) {
  Object.defineProperty(el, "clientWidth", { value: w, configurable: true });
}

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

  it("adding a block inside a ROW-direction section places it BESIDE, filling the leftover width", async () => {
    const user = userEvent.setup();
    const section = createContainer("row", {
      id: "sec", direction: "row", wrap: true,
      children: [createContainer("row", { id: "c1", width: "60%" } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const onChange = vi.fn();
    render(<BoxCanvas root={section} theme={DEFAULT_THEME} selectedId="sec" onChange={onChange} />);
    await user.click(screen.getByLabelText("Block actions"));
    await user.click(screen.getByRole("menuitem", { name: "Text" }));
    const sec = findBox(onChange.mock.calls.at(-1)![0], "sec")!;
    const added = sec.children![sec.children!.length - 1];
    expect(added.width).toBe("40%"); // fills the row's leftover (100 − 60) → sits beside c1
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

  it("pointer drag-and-drop reorders boxes (drag A's grip over B's lower half → A moves after B)", () => {
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
    const aEl = container.querySelector<HTMLElement>('[data-box-id="a"]')!;
    const bEl = container.querySelector<HTMLElement>('[data-box-id="b"]')!;
    const rootEl = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    // jsdom has no layout — stub the geometry: a column with A at y0–20 and B at y20–40.
    stubRect(aEl, { top: 0, left: 0, width: 100, height: 20 });
    stubRect(bEl, { top: 20, left: 0, width: 100, height: 20 });
    stubRect(rootEl, { top: 0, left: 0, width: 100, height: 40 });
    document.elementsFromPoint = () => [bEl]; // cursor sits over B

    const grip = screen.getByLabelText("Drag to move");
    fireEvent.mouseDown(grip, { clientX: 0, clientY: 5 });   // grab A
    fireEvent.mouseMove(document, { clientX: 0, clientY: 35 }); // past threshold, over B's lower half → after B
    fireEvent.mouseUp(document, { clientX: 0, clientY: 35 });
    // DOM order now reflects [root, b, a]
    const ids = Array.from(container.querySelectorAll<HTMLElement>("[data-box-id]")).map((e) => e.getAttribute("data-box-id"));
    expect(ids).toEqual(["root", "b", "a"]);
  });

  it("pointer drag REPARENTS a block into another container (drop A inside empty container C)", () => {
    const initial = createContainer("column", {
      id: "root",
      children: [
        createElement("text", { id: "a", text: "AAA" } as Partial<BoxNode>),
        createContainer("column", { id: "c" } as Partial<BoxNode>), // empty container to receive A
      ],
    } as Partial<BoxNode>);
    function DragHarness() {
      const [root, setRoot] = useState(initial);
      const [sel, setSel] = useState<string | null>("a");
      return <BoxCanvas root={root} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={setRoot} />;
    }
    const { container } = render(<DragHarness />);
    const cEl = container.querySelector<HTMLElement>('[data-box-id="c"]')!;
    stubRect(cEl, { top: 20, left: 0, width: 100, height: 40 });
    document.elementsFromPoint = () => [cEl]; // cursor over the empty container C

    fireEvent.mouseDown(screen.getByLabelText("Drag to move"), { clientX: 0, clientY: 5 });
    fireEvent.mouseMove(document, { clientX: 40, clientY: 40 }); // inside C
    fireEvent.mouseUp(document, { clientX: 40, clientY: 40 });
    // A is now a child of C
    const cAfter = container.querySelector<HTMLElement>('[data-box-id="c"]')!;
    expect(cAfter.querySelector('[data-box-id="a"]')).not.toBeNull();
  });

  it("deleting a section via the ⋯ menu works through the page's NORMALIZING onChange (not re-created)", async () => {
    const user = userEvent.setup();
    const initial = createContainer("column", {
      id: "root",
      children: [makeRowBand([
        createContainer("column", { id: "s1", width: "50%" } as Partial<BoxNode>),
        createContainer("column", { id: "s2", width: "50%" } as Partial<BoxNode>),
      ], 0)],
    } as Partial<BoxNode>);
    function Harn() {
      const [root, setRoot] = useState(initial);
      const [sel, setSel] = useState<string | null>(null);
      // Mirror the real page: every change is normalized.
      return <BoxCanvas root={root} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={(r) => setRoot(normalizeRowBands(r, 0))} />;
    }
    const { container } = render(<Harn />);
    await user.click(container.querySelector<HTMLElement>('[data-box-id="s1"]')!);
    await user.click(screen.getByLabelText("Block actions"));
    await user.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(container.querySelector('[data-box-id="s1"]')).toBeNull();     // stays deleted (normalize doesn't resurrect it)
    expect(container.querySelector('[data-box-id="s2"]')).not.toBeNull();
  });

  it("a SECTION in a row selects on a SINGLE click and can be deleted via the ⋯ menu (row shrinks)", async () => {
    const user = userEvent.setup();
    const initial = createContainer("column", {
      id: "root",
      children: [makeRowBand([
        createContainer("column", { id: "s1", width: "50%" } as Partial<BoxNode>),
        createContainer("column", { id: "s2", width: "50%" } as Partial<BoxNode>),
      ], 0)],
    } as Partial<BoxNode>);
    function Harn() {
      const [root, setRoot] = useState(initial);
      const [sel, setSel] = useState<string | null>(null);
      return <BoxCanvas root={root} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={setRoot} />;
    }
    const { container } = render(<Harn />);
    await user.click(container.querySelector<HTMLElement>('[data-box-id="s1"]')!); // ONE click selects the section
    await user.click(screen.getByLabelText("Block actions"));                      // its toolbar is present → open ⋯
    await user.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(container.querySelector('[data-box-id="s1"]')).toBeNull();      // deleted
    expect(container.querySelector('[data-box-id="s2"]')).not.toBeNull();  // the other section remains
  });

  it("REPARENTING a section into another row fills that row's leftover space", () => {
    const rb1 = makeRowBand([
      createContainer("column", { id: "a", width: "40%" } as Partial<BoxNode>),
      createContainer("column", { id: "b", width: "40%" } as Partial<BoxNode>),
    ], 0);
    const rb2 = makeRowBand([createContainer("column", { id: "d", width: "100%" } as Partial<BoxNode>)], 0);
    const initial = createContainer("column", { id: "root", children: [rb1, rb2] } as Partial<BoxNode>);
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={initial} theme={DEFAULT_THEME} selectedId="d" onChange={onChange} />);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="root"]')!, { top: 0, left: 0, width: 100, height: 100 });
    stubRect(container.querySelector<HTMLElement>(`[data-box-id="${rb1.id}"]`)!, { top: 0, left: 0, width: 100, height: 50 });
    stubRect(container.querySelector<HTMLElement>(`[data-box-id="${rb2.id}"]`)!, { top: 50, left: 0, width: 100, height: 50 }); // d lives here
    const bEl = container.querySelector<HTMLElement>('[data-box-id="b"]')!;
    stubRect(container.querySelector<HTMLElement>('[data-box-id="a"]')!, { top: 0, left: 0, width: 40, height: 50 });
    stubRect(bEl, { top: 0, left: 40, width: 40, height: 50 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="d"]')!, { top: 50, left: 0, width: 100, height: 50 });
    document.elementsFromPoint = () => [bEl];

    fireEvent.mouseDown(screen.getByLabelText("Drag to move"), { clientX: 0, clientY: 75 }); // grab d (in rb2)
    fireEvent.mouseMove(document, { clientX: 78, clientY: 25 }); // over b's right edge in rb1 (a DIFFERENT row → reparent)
    fireEvent.mouseUp(document, { clientX: 78, clientY: 25 });
    const last = onChange.mock.calls.at(-1)![0];
    expect(findBox(last, "d")?.width).toBe("20%");                               // filled rb1's leftover 100−40−40
    expect(findBox(last, rb1.id)?.children?.some((c) => c.id === "d")).toBe(true); // moved into rb1
  });

  it("dragging a child WITHIN its parent snaps to the nearest slot and KEEPS its width (arrange, no resize)", () => {
    const initial = createContainer("row", {
      id: "sec", direction: "row",
      children: [createContainer("row", { id: "a", width: "50%" } as Partial<BoxNode>), createContainer("row", { id: "b", width: "50%" } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={initial} theme={DEFAULT_THEME} selectedId="a" onChange={onChange} />);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="sec"]')!, { top: 0, left: 0, width: 600, height: 100 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="a"]')!, { top: 0, left: 0, width: 300, height: 100 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="b"]')!, { top: 0, left: 300, width: 300, height: 100 });
    fireEvent.mouseDown(screen.getByLabelText("Drag to move"), { clientX: 10, clientY: 50 }); // grab a
    fireEvent.mouseMove(document, { clientX: 520, clientY: 50 }); // deep in b's area, still INSIDE the section
    fireEvent.mouseUp(document, { clientX: 520, clientY: 50 });
    const sec = findBox(onChange.mock.calls.at(-1)![0], "sec")!;
    expect(sec.children!.map((c) => c.id)).toEqual(["b", "a"]); // a snapped to the nearest slot (after b)
    expect(findBox(onChange.mock.calls.at(-1)![0], "a")?.width).toBe("50%"); // width KEPT (arranged, not resized)
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

  it("dragging the bottom edge sets a MIN-HEIGHT (a floor; the box still hugs content) and fires onResized", () => {
    const onChange = vi.fn();
    const onResized = vi.fn();
    render(<BoxCanvas root={tree()} theme={DEFAULT_THEME} selectedId="t1" onChange={onChange} onResized={onResized} />);
    fireEvent.mouseDown(screen.getByLabelText("Resize bottom edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 60 });
    fireEvent.mouseUp(document);
    const last = onChange.mock.calls.at(-1)![0];
    expect(findBox(last, "t1")?.minHeight).toBeGreaterThan(0); // a floor, not a fixed height
    expect(findBox(last, "t1")?.height).toBeUndefined();       // no fixed height → the section grows with content
    expect(onResized).toHaveBeenCalledWith("t1", "height");
  });

  it("dragging the RIGHT edge moves only that edge — width changes and the LEFT edge stays put (alignSelf pins it, so a centred box can't grow from the middle)", () => {
    const onChange = vi.fn();
    render(<BoxCanvas root={tree()} theme={DEFAULT_THEME} selectedId="t1" onChange={onChange} />);
    fireEvent.mouseDown(screen.getByLabelText("Resize right edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 60, clientY: 0 }); // right edge dragged outward by 60
    fireEvent.mouseUp(document);
    const n = findBox(onChange.mock.calls.at(-1)![0], "t1");
    expect(n?.width).toMatch(/%$/);              // the edge itself resized the WIDTH
    expect(n?.alignSelf).toBe("flex-start");     // pinned to the LEFT so the left edge stays fixed
  });

  it("dragging the LEFT edge (cross-axis child) moves only that edge — width changes and the RIGHT edge stays put (margin-left grows as width shrinks)", () => {
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={tree()} theme={DEFAULT_THEME} selectedId="t1" onChange={onChange} />);
    const rootEl = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    const t1El = container.querySelector<HTMLElement>('[data-box-id="t1"]')!;
    stubRect(rootEl, { top: 0, left: 0, width: 600, height: 100 }); stubClientWidth(rootEl, 600);
    stubRect(t1El, { top: 0, left: 0, width: 300, height: 100 }); // starts at page-left, 300px wide
    fireEvent.mouseDown(screen.getByLabelText("Resize left edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 60, clientY: 0 }); // left edge dragged inward (right) by 60
    fireEvent.mouseUp(document);
    const n = findBox(onChange.mock.calls.at(-1)![0], "t1");
    expect(n?.width).toMatch(/%$/);            // the edge itself resized the WIDTH
    expect(n?.alignSelf).toBe("flex-start");   // top-left anchored (one consistent model)
    expect(n?.marginLeft).toBeGreaterThan(0);  // box shifts right so the RIGHT edge stays fixed
  });

  it("resizing a ROW section is EDGE-ANCHORED — the grabbed edge moves, the opposite stays; the neighbour is a WALL (never moves)", () => {
    const initial = createContainer("row", {
      id: "root", direction: "row",
      children: [createContainer("column", { id: "a", width: "50%" } as Partial<BoxNode>), createContainer("column", { id: "b", width: "50%" } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={initial} theme={DEFAULT_THEME} selectedId="a" onChange={onChange} />);
    const rootEl = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    stubRect(rootEl, { top: 0, left: 0, width: 600, height: 100 }); stubClientWidth(rootEl, 600);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="a"]')!, { top: 0, left: 0, width: 300, height: 100 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="b"]')!, { top: 0, left: 300, width: 300, height: 100 });
    fireEvent.mouseDown(screen.getByLabelText("Resize right edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: -60, clientY: 0 }); // shrink a from its RIGHT edge (right moves in)
    fireEvent.mouseUp(document);
    const last = onChange.mock.calls.at(-1)![0];
    expect(parseFloat(findBox(last, "a")!.width!)).toBeLessThan(50);  // a shrank from the right (left edge stayed)
    expect(findBox(last, "b")?.width).toBe("50%");                    // the neighbour did NOT move (wall)
    expect(findBox(last, "a")?.marginLeft ?? 0).toBe(0);             // right edge → no margin touched
  });

  it("dragging the TOP edge sets a MIN-HEIGHT (floor), keeping the box a hug-content box (no fixed height)", () => {
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={tree()} theme={DEFAULT_THEME} selectedId="t1" onChange={onChange} />);
    const rootEl = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    const t1El = container.querySelector<HTMLElement>('[data-box-id="t1"]')!;
    stubRect(rootEl, { top: 0, left: 0, width: 600, height: 400 }); stubClientWidth(rootEl, 600);
    stubRect(t1El, { top: 0, left: 0, width: 600, height: 200 }); // 200px tall
    fireEvent.mouseDown(screen.getByLabelText("Resize top edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 60 }); // top edge dragged inward (down) by 60
    fireEvent.mouseUp(document);
    const n = findBox(onChange.mock.calls.at(-1)![0], "t1");
    expect(n?.minHeight).toBeGreaterThan(0);   // a floor was set
    expect(n?.height).toBeUndefined();         // no fixed height — the section still hugs / grows with content
  });

  it("resizing a section's RIGHT edge FILLS the gap to the next section, holding that neighbour EXACTLY in place", () => {
    const initial = createContainer("row", {
      id: "root", direction: "row",
      children: [
        createContainer("column", { id: "a", width: "30%" } as Partial<BoxNode>),
        createContainer("column", { id: "b", width: "40%", marginLeft: 300 } as Partial<BoxNode>), // a gap sits before b
      ],
    } as Partial<BoxNode>);
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={initial} theme={DEFAULT_THEME} selectedId="a" onChange={onChange} />);
    const rootEl = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    stubRect(rootEl, { top: 0, left: 0, width: 600, height: 100 }); stubClientWidth(rootEl, 600);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="a"]')!, { top: 0, left: 0, width: 180, height: 100 });   // a: 0–180
    stubRect(container.querySelector<HTMLElement>('[data-box-id="b"]')!, { top: 0, left: 360, width: 240, height: 100 }); // b at 360 (gap 180–360)
    fireEvent.mouseDown(screen.getByLabelText("Resize right edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 180, clientY: 0 }); // grow a's right edge up to b's left (fill the gap)
    fireEvent.mouseUp(document);
    const last = onChange.mock.calls.at(-1)![0];
    expect(parseFloat(findBox(last, "a")!.width!)).toBeGreaterThan(30); // a grew into the gap
    expect(findBox(last, "b")?.width).toBe("40%");                      // the neighbour's WIDTH is untouched
    expect(findBox(last, "b")?.marginLeft).toBe(0);                     // its margin absorbed the fill → it stayed put, gap closed
  });

  it("resizing a ROW section's LEFT edge moves the left edge and HOLDS the right edge (margin-left); neighbour untouched", () => {
    const initial = createContainer("row", {
      id: "root", direction: "row",
      children: [createContainer("column", { id: "a", width: "60%" } as Partial<BoxNode>), createContainer("column", { id: "b", width: "40%" } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={initial} theme={DEFAULT_THEME} selectedId="a" onChange={onChange} />);
    const rootEl = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    stubRect(rootEl, { top: 0, left: 0, width: 600, height: 100 }); stubClientWidth(rootEl, 600);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="a"]')!, { top: 0, left: 0, width: 360, height: 100 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="b"]')!, { top: 0, left: 360, width: 240, height: 100 });
    fireEvent.mouseDown(screen.getByLabelText("Resize left edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 60, clientY: 0 }); // left edge dragged inward (right)
    fireEvent.mouseUp(document);
    const last = onChange.mock.calls.at(-1)![0];
    expect(findBox(last, "a")?.width).toMatch(/%$/);
    expect(findBox(last, "a")?.marginLeft).toBeGreaterThan(0); // shifted right so the RIGHT edge stays put
    expect(findBox(last, "b")?.width).toBe("40%");             // the neighbour is untouched
  });

  it("resizing the LAST section's right edge grows into the row's LEFTOVER space (the other section is untouched)", () => {
    const initial = createContainer("row", {
      id: "root", direction: "row",
      children: [createContainer("column", { id: "a", width: "30%" } as Partial<BoxNode>), createContainer("column", { id: "b", width: "30%" } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={initial} theme={DEFAULT_THEME} selectedId="b" onChange={onChange} />);
    const rootEl = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    stubRect(rootEl, { top: 0, left: 0, width: 600, height: 100 }); stubClientWidth(rootEl, 600);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="a"]')!, { top: 0, left: 0, width: 180, height: 100 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="b"]')!, { top: 0, left: 180, width: 180, height: 100 }); // rightmost; leftover after it
    fireEvent.mouseDown(screen.getByLabelText("Resize right edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 60, clientY: 0 }); // b (last) → +10% into the leftover
    fireEvent.mouseUp(document);
    const last = onChange.mock.calls.at(-1)![0];
    expect(parseFloat(findBox(last, "b")!.width!)).toBeGreaterThan(30); // grew into the leftover space
    expect(findBox(last, "a")?.width).toBe("30%");                      // the non-adjacent section is untouched
  });

  it("the page root defines a FLUID base unit (--box-u) that scales with the canvas width + browser (WCAG)", () => {
    const t = createContainer("column", { id: "root", baseFont: 10, children: [] } as Partial<BoxNode>);
    const { container } = render(<BoxCanvas root={t} theme={DEFAULT_THEME} onChange={() => {}} />);
    const el = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    // clamp(minRem, cqw, maxRem): rem bounds keep it browser-relative; cqw scales with the container width
    expect(el.style.getPropertyValue("--box-u")).toBe("clamp(0.4375rem, 1cqw, 0.875rem)");
  });
});
