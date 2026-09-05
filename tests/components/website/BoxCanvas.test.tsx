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

// Multi-select harness: exposes the selected ids for marquee tests.
function MultiHarness({ initial }: { initial: BoxNode }) {
  const [root, setRoot] = useState(initial);
  const [ids, setIds] = useState<string[]>([]);
  return (<><BoxCanvas root={root} theme={DEFAULT_THEME} selectedIds={ids} onSelectIds={setIds} onChange={setRoot} /><div data-testid="sel">{ids.join(",")}</div></>);
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

  it("the ROOT grows (min-height = floatingReserve) so a floated child is contained, not spilling below", () => {
    // A floated card sitting at top:40% with a 300px definite height needs the parent to be
    // at least 300 / (1 − 0.40) = 500px tall so its bottom stays inside. The root's own floor
    // (PAGE_MIN_H) must NOT override that reserve.
    const floated = createContainer("column", {
      id: "f", position: "absolute", left: "10%", top: "40%", width: "50%", height: "300px",
    } as unknown as Partial<BoxNode>);
    render(<Harness initial={createContainer("column", { id: "root", children: [floated] } as Partial<BoxNode>)} />);
    const rootEl = document.querySelector<HTMLElement>('[data-box-id="root"]')!;
    expect(parseFloat(rootEl.style.minHeight)).toBeGreaterThanOrEqual(500); // reserve wins over the small page floor
  });

  it("a SELECTED box shows overflow:visible so its (outside) toolbar + resize handles are never clipped", () => {
    // a clipped floating box would otherwise hide the toolbar that now sits ABOVE/BELOW it
    const clipped = createElement("text", { id: "t", text: "Hi", position: "absolute", clip: true, left: 20, top: 20 } as unknown as Partial<BoxNode>);
    const { container, rerender } = render(<Harness initial={createContainer("column", { id: "root", children: [clipped] } as Partial<BoxNode>)} initialSel="t" />);
    const el = container.querySelector<HTMLElement>('[data-box-id="t"]')!;
    expect(el.style.overflow).toBe("visible"); // selected → chrome not clipped
    void rerender;
  });

  it("a LOCKED box hides its resize handles + drag grip and shows a Locked badge (position frozen)", () => {
    const locked = createElement("heading", { id: "h", text: "Fixed", locked: true } as Partial<BoxNode>);
    render(<Harness initial={createContainer("column", { id: "root", children: [locked] } as Partial<BoxNode>)} initialSel="h" />);
    expect(screen.queryByLabelText("Resize right edge")).not.toBeInTheDocument(); // no resize handles while locked
    expect(screen.queryByLabelText("Drag to move")).not.toBeInTheDocument();       // no drag grip while locked
    expect(screen.getByText("Locked")).toBeInTheDocument();                        // a clear Locked badge
    expect(screen.getByLabelText("Unlock position and size")).toBeInTheDocument(); // and a one-click unlock
  });

  it("an UNLOCKED box shows resize handles + drag grip + a Lock button", () => {
    const box = createElement("heading", { id: "h", text: "Movable" } as Partial<BoxNode>);
    render(<Harness initial={createContainer("column", { id: "root", children: [box] } as Partial<BoxNode>)} initialSel="h" />);
    expect(screen.getByLabelText("Resize right edge")).toBeInTheDocument();
    expect(screen.getByLabelText("Drag to move")).toBeInTheDocument();
    expect(screen.getByLabelText("Lock position and size")).toBeInTheDocument();
  });

  it("clicking the toolbar lock toggles the box's locked flag", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const box = createElement("heading", { id: "h", text: "X" } as Partial<BoxNode>);
    render(<BoxCanvas root={createContainer("column", { id: "root", children: [box] } as Partial<BoxNode>)} theme={DEFAULT_THEME} selectedId="h" onChange={onChange} />);
    await user.click(screen.getByLabelText("Lock position and size"));
    const next = onChange.mock.calls.at(-1)![0];
    expect(findBox(next, "h")!.locked).toBe(true);
  });

  it("clicking a structural ROW BAND selects the block INSIDE it — never the row band itself", () => {
    // A row band is invisible structure; the user must always target a real block, never an "Editing: Row" wrapper.
    const child = createElement("text", { id: "c", text: "Hi" } as Partial<BoxNode>);
    const band = makeRowBand([child]); band.id = "band";
    const root = createContainer("column", { id: "root", children: [band] } as Partial<BoxNode>);
    function H() { const [r, setR] = useState(root); const [sel, setSel] = useState<string | null>(null); return <><BoxCanvas root={r} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={setR} /><div data-testid="sel">{sel}</div></>; }
    const { container, getByTestId } = render(<H />);
    fireEvent.mouseDown(container.querySelector('[data-box-id="band"]')!);
    expect(getByTestId("sel").textContent).toBe("c"); // the block inside, not "band"
  });

  it("clicking a row band with several blocks clears the selection (never selects the band)", () => {
    const band = makeRowBand([createElement("text", { id: "a" } as Partial<BoxNode>), createElement("text", { id: "b" } as Partial<BoxNode>)]); band.id = "band";
    const root = createContainer("column", { id: "root", children: [band] } as Partial<BoxNode>);
    function H() { const [r, setR] = useState(root); const [sel, setSel] = useState<string | null>("a"); return <><BoxCanvas root={r} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={setR} /><div data-testid="sel">{sel ?? ""}</div></>; }
    const { container, getByTestId } = render(<H />);
    fireEvent.mouseDown(container.querySelector('[data-box-id="band"]')!);
    expect(getByTestId("sel").textContent).toBe(""); // deselected, not "band"
  });

  it("copy + paste a floating GROUP: a full OFFSET copy appears (floating, fresh ids), not hiding the original", () => {
    const group = createContainer("column", { id: "g", group: true, position: "absolute", left: 10, top: 10, children: [createElement("text", { id: "a", text: "x" } as Partial<BoxNode>)] } as unknown as Partial<BoxNode>);
    const initial = createContainer("column", { id: "root", children: [group] } as Partial<BoxNode>);
    const onChange = vi.fn();
    function H() { const [r, setR] = useState(initial); const [sel, setSel] = useState<string | null>("g"); return <BoxCanvas root={r} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={(t) => { onChange(t); setR(t); }} />; }
    render(<H />);
    fireEvent.keyDown(document, { ctrlKey: true, key: "c" }); // copy
    fireEvent.keyDown(document, { ctrlKey: true, key: "v" }); // paste
    const next = onChange.mock.calls.at(-1)![0];
    const groups = (next.children ?? []).filter((c: BoxNode) => c.group);
    expect(groups.length).toBe(2);                                   // original + pasted
    const pasted = groups.find((g: BoxNode) => g.id !== "g")!;
    expect(pasted.position).toBe("absolute");                        // still floating → placeable
    expect(pasted.left).toBe(13); expect(pasted.top).toBe(13);       // offset +3% so it doesn't hide the original
    expect(pasted.children![0].id).not.toBe("a");                    // fresh child ids (independent copy)
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

  it("moving a HUGGING block keeps it hugging — a reparented Fit block never becomes full-width", () => {
    // Dragging a Fit (width:auto) button into another container must NOT overwrite its width with the line-fill
    // width — it stays hugging its content. Only definite-width blocks fill the leftover space.
    const initial = createContainer("column", {
      id: "root",
      children: [
        createElement("button", { id: "a", text: "Go", width: "auto" } as Partial<BoxNode>),
        createContainer("column", { id: "c" } as Partial<BoxNode>),
      ],
    } as Partial<BoxNode>);
    const onChange = vi.fn();
    function DragHarness() {
      const [root, setRoot] = useState(initial);
      const [sel, setSel] = useState<string | null>("a");
      return <BoxCanvas root={root} theme={DEFAULT_THEME} selectedId={sel} onSelectId={setSel} onChange={(t) => { onChange(t); setRoot(t); }} />;
    }
    const { container } = render(<DragHarness />);
    const cEl = container.querySelector<HTMLElement>('[data-box-id="c"]')!;
    stubRect(cEl, { top: 20, left: 0, width: 100, height: 40 });
    document.elementsFromPoint = () => [cEl];
    fireEvent.mouseDown(screen.getByLabelText("Drag to move"), { clientX: 0, clientY: 5 });
    fireEvent.mouseMove(document, { clientX: 40, clientY: 40 });
    fireEvent.mouseUp(document, { clientX: 40, clientY: 40 });
    const tree = onChange.mock.calls.at(-1)![0];
    const moved = findBox(tree, "a")!;
    expect(moved.width === "auto" || moved.width == null).toBe(true); // stayed hugging, never forced to "100%"
  });

  it("structural row bands and the page root never carry a hover-outline (no 'empty container wrapper' look)", () => {
    const root = createContainer("column", {
      id: "root",
      children: [makeRowBand([createElement("button", { id: "b", text: "Go" } as Partial<BoxNode>)], 0)],
    } as Partial<BoxNode>);
    const { container } = render(<BoxCanvas root={root} theme={DEFAULT_THEME} selectedId={null} onChange={() => {}} />);
    const rootEl = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    const band = rootEl.querySelector<HTMLElement>('[data-box-id]')!; // first descendant box = the row band
    expect(rootEl.className).not.toMatch(/hover:outline/); // the page never outlines on hover
    expect(band.className).not.toMatch(/hover:outline/);   // the invisible row band never outlines on hover
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

  it("dragging a BUTTON's height sets a DEFINITE height (self-painting → the button fills it), not a min-height floor", () => {
    // A button (self-painting, fills its box) must resize like a component: a definite height so the <a> grows via
    // height:100%. A min-height floor would leave the button short at the top while the box grew (the reported bug).
    const onChange = vi.fn();
    const root = createContainer("column", { id: "root", children: [createElement("button", { id: "b1", text: "Go" } as Partial<BoxNode>)] } as Partial<BoxNode>);
    render(<BoxCanvas root={root} theme={DEFAULT_THEME} selectedId="b1" onChange={onChange} />);
    fireEvent.mouseDown(screen.getByLabelText("Resize bottom edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 120 });
    fireEvent.mouseUp(document);
    const n = findBox(onChange.mock.calls.at(-1)![0], "b1");
    expect(n?.height).toMatch(/rem$/);       // DEFINITE height → the <a>'s height:100% resolves and fills
    expect(n?.minHeight).toBeUndefined();   // NOT a min-height floor
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

  // ── Floating layers (free overlap) ───────────────────────────────────────────────────────────────
  const floatingTree = () => createContainer("column", {
    id: "root",
    children: [
      createContainer("column", { id: "base", width: "100%" } as Partial<BoxNode>),
      createContainer("column", { id: "f1", position: "absolute", left: 10, top: 20, width: "50%", minHeight: 120, zIndex: 3 } as Partial<BoxNode>),
    ],
  } as Partial<BoxNode>);

  it("renders a floating box as an absolutely-positioned layer (left/top/zIndex from the tree)", () => {
    const { container } = render(<Harness initial={floatingTree()} />);
    const el = container.querySelector<HTMLElement>('[data-box-id="f1"]')!;
    expect(el.style.position).toBe("absolute");
    expect(el.style.left).toBe("10%");
    expect(el.style.top).toBe("20%");
    expect(el.style.zIndex).toBe("3");
  });

  it("the ⋯ menu offers 'Float on top' for an in-flow block", async () => {
    const user = userEvent.setup();
    render(<Harness initial={tree()} initialSel="t1" />);
    await user.click(screen.getByLabelText("Block actions"));
    expect(screen.getByRole("menuitem", { name: "Float on top" })).toBeInTheDocument();
  });

  it("a floating block's ⋯ menu swaps to Return-to-flow + layer controls", async () => {
    const user = userEvent.setup();
    render(<Harness initial={floatingTree()} initialSel="f1" />);
    await user.click(screen.getByLabelText("Block actions"));
    expect(screen.getByRole("menuitem", { name: "Return to flow" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Bring to front" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Send to back" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "Float on top" })).not.toBeInTheDocument();
  });

  it("'Return to flow' docks a floating block back into the flow", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BoxCanvas root={floatingTree()} theme={DEFAULT_THEME} selectedId="f1" onChange={onChange} />);
    await user.click(screen.getByLabelText("Block actions"));
    await user.click(screen.getByRole("menuitem", { name: "Return to flow" }));
    const f1 = findBox(onChange.mock.calls.at(-1)![0], "f1")!;
    expect(f1.position).toBeUndefined();
    expect(f1.left).toBeUndefined();
  });

  it("arrow keys nudge a selected floating block's position (in-flow blocks reorder instead)", () => {
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={floatingTree()} theme={DEFAULT_THEME} selectedId="f1" onChange={onChange} />);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="root"]')!, { top: 0, left: 0, width: 400, height: 400 });
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(findBox(onChange.mock.calls.at(-1)![0], "f1")!.left!).toBeGreaterThan(10); // moved right from left:10
  });

  it("resizing a floating block's RIGHT edge changes its width freely (no flow walls)", () => {
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={floatingTree()} theme={DEFAULT_THEME} selectedId="f1" onChange={onChange} />);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="root"]')!, { top: 0, left: 0, width: 400, height: 400 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="f1"]')!, { top: 0, left: 0, width: 200, height: 120 });
    fireEvent.mouseDown(screen.getByLabelText("Resize right edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 100, clientY: 0 }); // +100px of 400 → 50% → 75%
    fireEvent.mouseUp(document);
    expect(parseFloat(findBox(onChange.mock.calls.at(-1)![0], "f1")!.width!)).toBeGreaterThan(50);
  });

  it("dragging a floating block's grip moves it freely (rewrites left/top)", () => {
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={floatingTree()} theme={DEFAULT_THEME} selectedId="f1" onChange={onChange} />);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="root"]')!, { top: 0, left: 0, width: 400, height: 400 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="f1"]')!, { top: 80, left: 40, width: 120, height: 120 });
    fireEvent.mouseDown(screen.getByLabelText("Drag to move"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 40, clientY: 40 }); // +10% x, +10% y
    fireEvent.mouseUp(document);
    const f1 = findBox(onChange.mock.calls.at(-1)![0], "f1")!;
    expect(f1.left!).toBeGreaterThan(10);
    expect(f1.top!).toBeGreaterThan(20);
  });

  it("Alt-dragging an in-flow block's grip LIFTS it onto a floating layer", () => {
    const onChange = vi.fn();
    const { container } = render(<BoxCanvas root={floatingTree()} theme={DEFAULT_THEME} selectedId="base" onChange={onChange} />);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="root"]')!, { top: 0, left: 0, width: 400, height: 400 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="base"]')!, { top: 0, left: 0, width: 400, height: 100 });
    fireEvent.mouseDown(screen.getByLabelText("Drag to move"), { clientX: 0, clientY: 0, altKey: true });
    fireEvent.mouseUp(document);
    // The very first commit floats it (position absolute), before any move.
    const base = findBox(onChange.mock.calls[0]![0], "base")!;
    expect(base.position).toBe("absolute");
  });

  it("a floating block's ⋯ menu offers the full 4-way ordering (front / forward / backward / back)", async () => {
    const user = userEvent.setup();
    render(<Harness initial={floatingTree()} initialSel="f1" />);
    await user.click(screen.getByLabelText("Block actions"));
    for (const l of ["Bring to front", "Bring forward", "Send backward", "Send to back"]) {
      expect(screen.getByRole("menuitem", { name: l })).toBeInTheDocument();
    }
  });

  // ── Marquee multi-select ─────────────────────────────────────────────────────────────────────────
  const twoSiblings = () => createContainer("column", {
    id: "root",
    children: [createContainer("column", { id: "a" } as Partial<BoxNode>), createContainer("column", { id: "b" } as Partial<BoxNode>), createContainer("column", { id: "c" } as Partial<BoxNode>)],
  } as Partial<BoxNode>);

  it("marquee-dragging the canvas selects every ENCLOSED section", () => {
    const { container, getByTestId } = render(<MultiHarness initial={twoSiblings()} />);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="root"]')!, { top: 0, left: 0, width: 400, height: 400 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="a"]')!, { top: 10, left: 10, width: 120, height: 80 });   // 10–90
    stubRect(container.querySelector<HTMLElement>('[data-box-id="b"]')!, { top: 110, left: 10, width: 120, height: 80 });  // 110–190
    stubRect(container.querySelector<HTMLElement>('[data-box-id="c"]')!, { top: 320, left: 10, width: 120, height: 80 });  // 320–400 (outside the marquee)
    fireEvent.mouseDown(container.querySelector<HTMLElement>('[data-box-id="root"]')!, { clientX: 5, clientY: 5 });
    fireEvent.mouseMove(document, { clientX: 300, clientY: 300 }); // encloses a & b, not c
    fireEvent.mouseUp(document, { clientX: 300, clientY: 300 });
    expect(getByTestId("sel").textContent).toBe("a,b");
  });

  it("marquee keeps only the OUTERMOST of a nested pair (a whole section, not its child)", () => {
    const nested = createContainer("column", {
      id: "root",
      children: [createContainer("column", { id: "sec", children: [createContainer("column", { id: "child" } as Partial<BoxNode>)] } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const { container, getByTestId } = render(<MultiHarness initial={nested} />);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="root"]')!, { top: 0, left: 0, width: 400, height: 400 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="sec"]')!, { top: 20, left: 20, width: 200, height: 200 });
    stubRect(container.querySelector<HTMLElement>('[data-box-id="child"]')!, { top: 40, left: 40, width: 100, height: 100 });
    fireEvent.mouseDown(container.querySelector<HTMLElement>('[data-box-id="root"]')!, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 380, clientY: 380 }); // encloses BOTH sec and child
    fireEvent.mouseUp(document, { clientX: 380, clientY: 380 });
    expect(getByTestId("sel").textContent).toBe("sec"); // child dropped (descendant of sec)
  });

  it("Delete removes ALL selected boxes at once", () => {
    const onChange = vi.fn();
    render(<BoxCanvas root={twoSiblings()} theme={DEFAULT_THEME} selectedIds={["a", "b"]} onChange={onChange} />);
    fireEvent.keyDown(document, { key: "Delete" });
    const last = onChange.mock.calls.at(-1)![0];
    expect(findBox(last, "a")).toBeNull();
    expect(findBox(last, "b")).toBeNull();
    expect(findBox(last, "c")).not.toBeNull();
  });

  it("multi-selected boxes all show the selection outline, but no per-box toolbar (bulk edits instead)", () => {
    render(<BoxCanvas root={twoSiblings()} theme={DEFAULT_THEME} selectedIds={["a", "b"]} onChange={() => {}} />);
    expect(screen.queryByLabelText("Block actions")).not.toBeInTheDocument(); // toolbar only when exactly one is selected
  });

  // ── Styling primitives (border / shadow / radius / rotation / typography) ─────────────────────────
  it("renders border, drop shadow, per-corner radius and rotation on a box", () => {
    const t = createContainer("column", {
      id: "root",
      children: [createContainer("column", { id: "d", borderWidth: 3, borderStyle: "dashed", borderColor: "#ff0000", shadow: "lg", radius: 10, radiusTopLeft: 0, rotate: 15 } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const { container } = render(<BoxCanvas root={t} theme={DEFAULT_THEME} onChange={() => {}} />);
    const el = container.querySelector<HTMLElement>('[data-box-id="d"]')!;
    expect(el.style.border).toContain("3px");
    expect(el.style.border).toContain("dashed");
    expect(el.style.boxShadow).not.toBe("");
    expect(el.style.borderRadius).toBe("0px 10px 10px 10px"); // TL overridden to 0
    expect(el.style.transform).toBe("rotate(15deg)");
  });

  it("renders the new content types (video embed, icon, divider, list, embed HTML) + anchor id + newTab", () => {
    const t = createContainer("column", {
      id: "root",
      children: [
        createElement("video", { id: "v", src: "https://youtu.be/dQw4w9WgXcQ" } as Partial<BoxNode>),
        createElement("icon", { id: "ic", icon: "Heart" } as Partial<BoxNode>),
        createElement("divider", { id: "dv", borderWidth: 4, color: "#123456" } as Partial<BoxNode>),
        createElement("list", { id: "ls", listStyle: "number", listItems: ["one", "two"] } as Partial<BoxNode>),
        createElement("embed", { id: "em", html: "<b data-x>hi</b>" } as Partial<BoxNode>),
        createElement("button", { id: "bt", text: "Go", href: "https://x.com", newTab: true, anchor: "cta" } as Partial<BoxNode>),
      ],
    } as Partial<BoxNode>);
    const { container } = render(<BoxCanvas root={t} theme={DEFAULT_THEME} editable={false} onChange={() => {}} />);
    expect(container.querySelector('[data-box-id="v"] iframe')?.getAttribute("src")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(container.querySelector('[data-box-id="ic"] svg')).toBeTruthy();       // an icon svg rendered
    expect(container.querySelector('[data-box-id="ls"] ol')?.querySelectorAll("li").length).toBe(2);
    expect(container.querySelector('[data-box-id="em"]')?.innerHTML).toContain("hi"); // embedded HTML injected
    const btn = container.querySelector<HTMLAnchorElement>('[data-box-id="bt"] a')!;
    expect(btn.target).toBe("_blank");
    expect(container.querySelector('#cta')).toBeTruthy(); // anchor id rendered on the box
  });

  // ── Responsive per-breakpoint overrides ──────────────────────────────────────────────────────────
  it("renders the breakpoint-resolved style (mobile override wins over the base)", () => {
    const t = createContainer("column", {
      id: "root",
      children: [createContainer("column", { id: "s", background: "#111111", responsive: { mobile: { background: "#ff0000" } } } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const base = render(<BoxCanvas root={t} theme={DEFAULT_THEME} breakpoint="base" onChange={() => {}} />);
    expect(base.container.querySelector<HTMLElement>('[data-box-id="s"]')!.style.backgroundColor).toBe("rgb(17, 17, 17)");
    base.unmount();
    const mob = render(<BoxCanvas root={t} theme={DEFAULT_THEME} breakpoint="mobile" onChange={() => {}} />);
    expect(mob.container.querySelector<HTMLElement>('[data-box-id="s"]')!.style.backgroundColor).toBe("rgb(255, 0, 0)");
  });

  it("a box hidden on a breakpoint is dropped on the live site but kept (faint) in the editor", () => {
    const t = createContainer("column", {
      id: "root",
      children: [createContainer("column", { id: "h", responsive: { mobile: { hidden: true } } } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const live = render(<BoxCanvas root={t} theme={DEFAULT_THEME} breakpoint="mobile" editable={false} onChange={() => {}} />);
    expect(live.container.querySelector('[data-box-id="h"]')).toBeNull(); // not rendered live
    live.unmount();
    const edit = render(<BoxCanvas root={t} theme={DEFAULT_THEME} breakpoint="mobile" editable onChange={() => {}} />);
    const el = edit.container.querySelector<HTMLElement>('[data-box-id="h"]')!;
    expect(el).toBeTruthy();
    expect(el.style.opacity).toBe("0.35"); // faint in the editor so you can still select + un-hide it
  });

  it("resizing at a breakpoint writes an OVERRIDE, leaving the base width untouched", () => {
    const onChange = vi.fn();
    const initial = createContainer("column", {
      id: "root",
      children: [createContainer("column", { id: "a", width: "100%" } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const { container } = render(<BoxCanvas root={initial} theme={DEFAULT_THEME} selectedId="a" breakpoint="mobile" onChange={onChange} />);
    const rootEl = container.querySelector<HTMLElement>('[data-box-id="root"]')!;
    stubRect(rootEl, { top: 0, left: 0, width: 600, height: 200 }); stubClientWidth(rootEl, 600);
    stubRect(container.querySelector<HTMLElement>('[data-box-id="a"]')!, { top: 0, left: 0, width: 600, height: 100 });
    fireEvent.mouseDown(screen.getByLabelText("Resize right edge"), { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: -180, clientY: 0 }); // shrink at mobile
    fireEvent.mouseUp(document);
    const a = findBox(onChange.mock.calls.at(-1)![0], "a")!;
    expect(a.width).toBe("100%");                    // base preserved
    expect(a.responsive?.mobile?.width).toMatch(/%$/); // override written for mobile
  });

  it("applies per-element typography (font family, weight, line-height, letter-spacing, italic, underline, transform)", () => {
    const t = createContainer("column", {
      id: "root",
      children: [createElement("heading", { id: "h", text: "Hi", fontFamily: "Georgia, serif", fontWeight: 300, lineHeight: 1.8, letterSpacing: 2, italic: true, underline: true, textTransform: "uppercase" } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    const { container } = render(<BoxCanvas root={t} theme={DEFAULT_THEME} onChange={() => {}} />);
    const h = container.querySelector<HTMLElement>('[data-box-id="h"] h2')!;
    expect(h.style.fontFamily).toContain("Georgia");
    expect(h.style.fontWeight).toBe("300");
    expect(h.style.lineHeight).toBe("1.8");
    expect(h.style.letterSpacing).toBe("2px");
    expect(h.style.fontStyle).toBe("italic");
    expect(h.style.textDecoration).toBe("underline");
    expect(h.style.textTransform).toBe("uppercase");
  });

  it("a divider honours its line style (dashed) and a leaf element can float over others", () => {
    const t = createContainer("column", {
      id: "root",
      children: [
        createElement("divider", { id: "dv", borderWidth: 2, borderStyle: "dashed", color: "#111111" } as Partial<BoxNode>),
        createElement("heading", { id: "hd", text: "Overlay", position: "absolute", left: 20, top: 30, zIndex: 5 } as Partial<BoxNode>),
      ],
    } as Partial<BoxNode>);
    const { container } = render(<BoxCanvas root={t} theme={DEFAULT_THEME} editable={false} onChange={() => {}} />);
    const line = container.querySelector<HTMLElement>('[data-box-id="dv"] div')!;
    expect(line.style.borderTopStyle).toBe("dashed");
    const overlay = container.querySelector<HTMLElement>('[data-box-id="hd"]')!;
    expect(overlay.style.position).toBe("absolute"); // a heading can be floated as an overlay
    expect(overlay.style.left).toBe("20%");
  });

  it("the actions menu stays open when you scroll INSIDE it, and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Harness initial={tree()} initialSel="t1" />);
    await user.click(screen.getByLabelText("Block actions"));
    const menu = screen.getByRole("menu", { name: "Block actions" });
    fireEvent.scroll(menu);                                   // scrolling the menu itself must NOT dismiss it (the bug)
    expect(screen.getByRole("menu", { name: "Block actions" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });           // Escape closes it
    expect(screen.queryByRole("menu", { name: "Block actions" })).not.toBeInTheDocument();
  });

  it("dropping a block from the palette inserts a new node of that kind", () => {
    const onChange = vi.fn();
    const initial = createContainer("column", { id: "root", children: [makeRowBand([createContainer("column", { id: "a" } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    const { container } = render(<BoxCanvas root={initial} theme={DEFAULT_THEME} onChange={onChange} />);
    const wrapper = container.firstElementChild as HTMLElement; // the canvas drop surface
    const dt = { types: ["application/x-box-block"], getData: () => "heading", dropEffect: "", effectAllowed: "" };
    fireEvent.dragOver(wrapper, { dataTransfer: dt, clientX: 10, clientY: 10 });
    fireEvent.drop(wrapper, { dataTransfer: dt, clientX: 10, clientY: 10 });
    const tree = onChange.mock.calls.at(-1)![0];
    // jsdom has no elementsFromPoint, so it appends to the page — a heading node now exists in the tree.
    const found = (function walk(n: BoxNode): boolean { return n.type === "heading" || (n.children ?? []).some(walk); })(tree);
    expect(found).toBe(true);
  });
});
