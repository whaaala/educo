import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BlocksPanel from "@/components/website/box/BlocksPanel";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { CHROME_Z, CHROME_Z_FLOOR } from "@/lib/educo-ui/stacking";

describe("BlocksPanel (floating insert palette)", () => {
  it("is CLOSED by default — only a launcher shows, no tiles", () => {
    render(<BlocksPanel theme={DEFAULT_THEME} />);
    expect(screen.getByLabelText("Open blocks panel")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Add Section/)).not.toBeInTheDocument(); // tiles hidden until opened
  });

  it("clicking the launcher opens the floating panel with search, tabs and tiles", () => {
    render(<BlocksPanel theme={DEFAULT_THEME} />);
    fireEvent.click(screen.getByLabelText("Open blocks panel"));
    expect(screen.getByRole("dialog", { name: "Blocks" })).toBeInTheDocument();
    expect(screen.getByLabelText("Search blocks")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Add Section/)).toBeInTheDocument();
  });

  it("lists blocks (grouped) with plain names, incl. Spacer + composite components", () => {
    render(<BlocksPanel theme={DEFAULT_THEME} defaultOpen />);
    for (const name of ["Section", "Columns", "Spacer", "Text", "Image", "Video", "Icon", "Divider", "Card", "Quote", "Stat", "Badge", "Rating"]) {
      expect(screen.getByLabelText(new RegExp(`Add ${name}`))).toBeInTheDocument();
    }
  });

  it("ASK-ON-ADD: a COMPONENT offers its starting points instead of adding a default", () => {
    // Rule F. Components used to add straight away, because `getPresets` returned [] for every one of them —
    // the blocks with the most looks to choose from were the only ones that never asked.
    const onPick = vi.fn();
    render(<BlocksPanel theme={DEFAULT_THEME} onPick={onPick} defaultOpen />);
    fireEvent.click(screen.getByLabelText(/Add Card/));
    expect(onPick).not.toHaveBeenCalled();                       // it asks first
    expect(screen.getByLabelText("Add Card")).toBeInTheDocument(); // the chooser, by its own label
    fireEvent.click(screen.getByText("Side by side"));
    expect(onPick).toHaveBeenCalledWith("card", { variant: "horizontal" });
  });

  it("a block with nothing to choose adds directly, and the panel STAYS open (add several)", () => {
    const onPick = vi.fn();
    render(<BlocksPanel theme={DEFAULT_THEME} onPick={onPick} defaultOpen />);
    fireEvent.click(screen.getByLabelText(/Add Spacer/));
    expect(onPick).toHaveBeenCalledWith("spacer");
    expect(screen.getByRole("dialog", { name: "Blocks" })).toBeInTheDocument(); // still open
  });

  it("a tile is draggable and sets the palette block type on drag start", () => {
    const setData = vi.fn();
    const onDragKind = vi.fn();
    render(<BlocksPanel theme={DEFAULT_THEME} onDragKind={onDragKind} defaultOpen />);
    fireEvent.dragStart(screen.getByLabelText(/Add Text/), { dataTransfer: { setData, effectAllowed: "" } });
    expect(setData).toHaveBeenCalledWith("application/x-box-block", "text");
    expect(onDragKind).toHaveBeenCalledWith("text");
  });

  it("clicking a styled tile opens a PORTALED variation picker (never clipped) and adds with that variation", () => {
    const onPick = vi.fn();
    render(<BlocksPanel theme={DEFAULT_THEME} onPick={onPick} defaultOpen />);
    fireEvent.click(screen.getByLabelText(/Add Button/));
    expect(screen.getByText("Add Button as…")).toBeInTheDocument();
    expect(screen.getByRole("menu", { name: "Add Button" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("menuitem", { name: "Outline" }));
    expect(onPick).toHaveBeenCalledWith("button", expect.objectContaining({ borderWidth: expect.any(Number) }));
  });

  it("choosing 'Default' in the picker adds the plain block", () => {
    const onPick = vi.fn();
    render(<BlocksPanel theme={DEFAULT_THEME} onPick={onPick} defaultOpen />);
    fireEvent.click(screen.getByLabelText(/Add Heading/));
    fireEvent.click(screen.getByRole("menuitem", { name: "Default" }));
    expect(onPick).toHaveBeenCalledWith("heading");
  });

  it("closes via the ✕ button and via Escape", () => {
    render(<BlocksPanel theme={DEFAULT_THEME} defaultOpen />);
    fireEvent.click(screen.getByLabelText("Close blocks panel"));
    expect(screen.queryByRole("dialog", { name: "Blocks" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Open blocks panel")).toBeInTheDocument(); // launcher back
    // reopen, then Escape
    fireEvent.click(screen.getByLabelText("Open blocks panel"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Blocks" })).not.toBeInTheDocument();
  });

  it("the open panel sits ABOVE the canvas block toolbars, and both are on the CHROME ladder", () => {
    // This used to read `z-50 > z-40`, which was true and yet was the bug: those are the numbers a PAGE uses,
    // so a float raised far enough covered the panel and the toolbars alike. The relationship still has to
    // hold — it just has to hold above everything a visitor can ever render. See lib/educo-ui/stacking.ts.
    render(<BlocksPanel theme={DEFAULT_THEME} defaultOpen />);
    expect(screen.getByRole("dialog", { name: "Blocks" })).toHaveStyle({ zIndex: String(CHROME_Z.panel) });
    expect(CHROME_Z.panel).toBeGreaterThan(CHROME_Z.toolbar);
    expect(CHROME_Z.toolbar).toBeGreaterThanOrEqual(CHROME_Z_FLOOR);
  });

  it("keyboard: B toggles the panel open and closed", () => {
    render(<BlocksPanel theme={DEFAULT_THEME} />);
    fireEvent.keyDown(document, { key: "b" });
    expect(screen.getByRole("dialog", { name: "Blocks" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "b" });
    expect(screen.queryByRole("dialog", { name: "Blocks" })).not.toBeInTheDocument();
  });

  it("search filters the tiles live and shows a friendly empty state", () => {
    render(<BlocksPanel theme={DEFAULT_THEME} defaultOpen />);
    fireEvent.change(screen.getByLabelText("Search blocks"), { target: { value: "card" } });
    expect(screen.getByLabelText(/Add Card/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Add Section/)).not.toBeInTheDocument(); // filtered out
    fireEvent.change(screen.getByLabelText("Search blocks"), { target: { value: "zzzzz" } });
    expect(screen.getByText(/No blocks match/)).toBeInTheDocument();
  });

  it("category tabs jump to a group (Media shows only media blocks)", () => {
    render(<BlocksPanel theme={DEFAULT_THEME} defaultOpen />);
    fireEvent.click(screen.getByRole("tab", { name: "Media" }));
    for (const name of ["Image", "Video", "Icon", "Embed"]) {
      expect(screen.getByLabelText(new RegExp(`Add ${name}`))).toBeInTheDocument();
    }
    expect(screen.queryByLabelText(/Add Section/)).not.toBeInTheDocument(); // Layout hidden
    expect(screen.queryByLabelText(/Add Card/)).not.toBeInTheDocument();    // Components hidden
  });
});
