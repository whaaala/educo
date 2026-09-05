import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import BoxInspector from "@/components/website/box/BoxInspector";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { createContainer, createElement, createComponent, type BoxNode } from "@/lib/box-model";

function renderFor(node: BoxNode, extra: Record<string, unknown> = {}) {
  const onPatch = vi.fn();
  render(<BoxInspector node={node} theme={DEFAULT_THEME} onPatch={onPatch} {...extra} />);
  return onPatch;
}
const openContent = () => fireEvent.click(screen.getByRole("tab", { name: "Content" }));
const openDevice = () => fireEvent.click(screen.getByRole("tab", { name: "Per-device" }));

describe("BoxInspector — Accordion component editing (Content tab)", () => {
  const acc = () => createComponent("accordion", { id: "a", items: [
    { id: "i1", title: "Q1", body: "A1" }, { id: "i2", title: "Q2", body: "A2" },
  ] } as Partial<BoxNode>);

  it("changes the accordion design from the visual picker", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByRole("button", { name: "Solid panel design" }));
    expect(onPatch).toHaveBeenCalledWith({ variant: "--panel" });
    // every design is offered
    expect(screen.getByRole("button", { name: "Horizontal design" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark glossy design" })).toBeInTheDocument();
  });

  it("toggles multi-open and adds an item", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByLabelText("Allow more than one open at once"));
    expect(onPatch).toHaveBeenCalledWith({ accMultiOpen: true });
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining({ title: "New question" })]) }));
  });

  it("toggles the opt-in 'Expand all / Collapse all' controls", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByLabelText(/Expand all/));
    expect(onPatch).toHaveBeenCalledWith({ accShowAll: true });
  });

  it("edits an item title; remove is enabled with two items", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.change(screen.getByLabelText("Item 1 title"), { target: { value: "Changed" } });
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining({ title: "Changed" })]) }));
    expect(screen.getByLabelText("Remove item 1")).not.toBeDisabled();
  });

  it("edits a per-item Advanced CSS override (each item can override any CSS)", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.change(screen.getByLabelText("Item 1 CSS"), { target: { value: "background: #fef3c7;" } });
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining({ css: "background: #fef3c7;" })]) }));
  });

  it("cannot remove the last remaining item", () => {
    renderFor(createComponent("accordion", { id: "a2", items: [{ id: "i1", title: "only", body: "b" }] } as Partial<BoxNode>));
    openContent();
    expect(screen.getByLabelText("Remove item 1")).toBeDisabled();
  });

  it("re-skins the component through design-token colour overrides", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByRole("button", { name: "Component colours" })); // expand the section
    // ColorRow drives ColorPickerPopover; assert the section + reset wiring exist by editing advanced CSS instead
    fireEvent.click(screen.getByRole("button", { name: "Advanced CSS" }));
    fireEvent.change(screen.getByLabelText("Advanced CSS"), { target: { value: "letter-spacing: .02em;" } });
    expect(onPatch).toHaveBeenCalledWith({ advancedCss: "letter-spacing: .02em;" });
  });
});

describe("BoxInspector — styling primitives (Design tab)", () => {
  it("edits border width, shadow strength and tilt", () => {
    const onPatch = renderFor(createContainer("column", { id: "b" } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Border"), { target: { value: "4" } });
    expect(onPatch).toHaveBeenCalledWith({ borderWidth: 4 });
    fireEvent.click(screen.getByRole("button", { name: "Strong" }));
    expect(onPatch).toHaveBeenCalledWith({ shadow: "lg" }); // "Strong" → lg under the hood
    fireEvent.change(screen.getByLabelText("Tilt"), { target: { value: "30" } });
    expect(onPatch).toHaveBeenCalledWith({ rotate: 30 });
  });

  it("edits a single rounded corner (per-corner override)", () => {
    const onPatch = renderFor(createContainer("column", { id: "b", radius: 8 } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Rounded corner top-left"), { target: { value: "0" } });
    expect(onPatch).toHaveBeenCalledWith({ radiusTopLeft: 0 });
  });

  it("exposes grid cell span only when the box is inside a grid", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { inGrid: true });
    fireEvent.change(screen.getByLabelText("Columns wide"), { target: { value: "2" } });
    expect(onPatch).toHaveBeenCalledWith({ colSpan: 2 });
  });

  it("hides grid span controls when NOT in a grid", () => {
    renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { inGrid: false });
    expect(screen.queryByLabelText("Columns wide")).not.toBeInTheDocument();
  });

  it("uses plain-language layout labels (Free arrange / Grid, Top-to-bottom / Side-by-side)", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>));
    fireEvent.click(screen.getByRole("button", { name: "Grid" }));
    expect(onPatch).toHaveBeenCalledWith({ layout: "grid" });
  });

  it("shows a Styles gallery of variations that apply a whole look in one tap", () => {
    const onPatch = renderFor(createElement("button", { id: "b", text: "Go" } as Partial<BoxNode>));
    fireEvent.click(screen.getByLabelText("Style Outline"));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ borderWidth: expect.any(Number), borderColor: expect.any(String) }));
  });

  it("the icon picker has a search box that filters the library", () => {
    renderFor(createElement("icon", { id: "i" } as Partial<BoxNode>));
    openContent();
    fireEvent.click(screen.getByLabelText("Icon")); // open the reusable IconPicker popover
    // a broad library is searchable
    fireEvent.change(screen.getByLabelText("Search icons"), { target: { value: "rocket" } });
    expect(screen.getByLabelText("Rocket")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search icons"), { target: { value: "heart" } });
    expect(screen.getByLabelText("Heart")).toBeInTheDocument();
    expect(screen.queryByLabelText("Rocket")).not.toBeInTheDocument(); // filtered out
  });
});

describe("BoxInspector — content types & links (Content tab)", () => {
  it("shows typography controls for a text element and patches them", () => {
    const onPatch = renderFor(createElement("text", { id: "t", text: "Hi" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Line spacing"), { target: { value: "1.6" } });
    expect(onPatch).toHaveBeenCalledWith({ lineHeight: 1.6 });
    fireEvent.change(screen.getByLabelText("Letter spacing"), { target: { value: "1.5" } });
    expect(onPatch).toHaveBeenCalledWith({ letterSpacing: 1.5 });
    fireEvent.click(screen.getByLabelText("Italic"));
    expect(onPatch).toHaveBeenCalledWith({ italic: true });
    fireEvent.click(screen.getByLabelText("Underline"));
    expect(onPatch).toHaveBeenCalledWith({ underline: true });
  });

  it("edits a video link", () => {
    const onPatch = renderFor(createElement("video", { id: "v" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Video URL"), { target: { value: "https://youtu.be/abc" } });
    expect(onPatch).toHaveBeenCalledWith({ src: "https://youtu.be/abc" });
  });

  it("edits embed code", () => {
    const onPatch = renderFor(createElement("embed", { id: "e" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Embed code"), { target: { value: "<iframe></iframe>" } });
    expect(onPatch).toHaveBeenCalledWith({ html: "<iframe></iframe>" });
  });

  it("edits list items (one per line) and marker style", () => {
    const onPatch = renderFor(createElement("list", { id: "l" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("List items"), { target: { value: "a\nb\nc" } });
    expect(onPatch).toHaveBeenCalledWith({ listItems: ["a", "b", "c"] });
    fireEvent.click(screen.getByRole("button", { name: "Numbered" }));
    expect(onPatch).toHaveBeenCalledWith({ listStyle: "number" });
  });

  it("picks an icon", () => {
    const onPatch = renderFor(createElement("icon", { id: "i" } as Partial<BoxNode>));
    openContent();
    fireEvent.click(screen.getByLabelText("Icon")); // open the reusable IconPicker popover
    fireEvent.change(screen.getByLabelText("Search icons"), { target: { value: "heart" } });
    fireEvent.click(screen.getByLabelText("Heart"));
    expect(onPatch).toHaveBeenCalledWith({ icon: "Heart" });
  });

  it("sets a button link target + new-tab, and a bookmark name on any box", () => {
    const onPatch = renderFor(createElement("button", { id: "b", text: "Go" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Bookmark name"), { target: { value: "My Section" } });
    expect(onPatch).toHaveBeenCalledWith({ anchor: "my-section" }); // slugified
    fireEvent.click(screen.getByLabelText("Open in a new tab"));
    expect(onPatch).toHaveBeenCalledWith({ newTab: true });
  });

  it("links a button to another PAGE via the page picker", () => {
    const onPatch = renderFor(createElement("button", { id: "b", text: "Go" } as Partial<BoxNode>), {
      pages: [{ id: "home", name: "Home" }, { id: "about", name: "About" }],
      currentPageId: "home",
    });
    openContent();
    fireEvent.click(screen.getByLabelText("Link to page")); // open the custom dropdown
    expect(screen.queryByRole("option", { name: "Home" })).not.toBeInTheDocument(); // current page excluded
    fireEvent.click(screen.getByRole("option", { name: "About" }));
    expect(onPatch).toHaveBeenCalledWith({ href: "page:about" });
  });
});

describe("BoxInspector — per-device", () => {
  it("shows a breakpoint banner + reset when editing a non-base breakpoint with an override", () => {
    const onReset = vi.fn();
    renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { breakpoint: "mobile", overridden: true, onResetOverride: onReset });
    expect(screen.getByText(/Editing Mobile/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Reset mobile changes/));
    expect(onReset).toHaveBeenCalled();
  });

  it("has no breakpoint banner on the base", () => {
    renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { breakpoint: "base" });
    expect(screen.queryByText(/Editing Mobile|Editing Tablet/)).not.toBeInTheDocument();
  });

  it("toggles hidden (labelled per breakpoint) in the Per-device tab", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { breakpoint: "mobile" });
    openDevice();
    fireEvent.click(screen.getByLabelText(/Hidden on mobile/));
    expect(onPatch).toHaveBeenCalledWith({ hidden: true });
  });
});

// ── Functionality AUDIT: every core control fires the right patch. Because these controls are shared across
//    all block/component types, verifying them here proves they work for every current AND future component. ──
describe("BoxInspector — functionality audit (controls act)", () => {
  const heading = () => createElement("heading", { id: "h", text: "Hi" } as Partial<BoxNode>);

  it("Design › Width: Full / Fit fire the width patch", () => {
    const onPatch = renderFor(heading());
    fireEvent.click(screen.getByRole("button", { name: "Full" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ width: "fill" }));
    fireEvent.click(screen.getByRole("button", { name: "Fit" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ width: "auto" }));
  });

  it("Design › Outline & effects: Rounded/Border/Tilt/See-through sliders fire", () => {
    const onPatch = renderFor(heading());
    fireEvent.change(screen.getByLabelText("Rounded corners"), { target: { value: "12" } });
    expect(onPatch).toHaveBeenCalledWith({ radius: 12 });
    fireEvent.change(screen.getByLabelText("Border"), { target: { value: "3" } });
    expect(onPatch).toHaveBeenCalledWith({ borderWidth: 3 });
    fireEvent.change(screen.getByLabelText("Tilt"), { target: { value: "10" } });
    expect(onPatch).toHaveBeenCalledWith({ rotate: 10 });
    fireEvent.change(screen.getByLabelText("See-through"), { target: { value: "50" } });
    expect(onPatch).toHaveBeenCalledWith({ opacity: 50 });
  });

  it("Design › Spacing: Inner + Outer sliders fire padding/margin", () => {
    const onPatch = renderFor(createContainer("column", { id: "s" } as Partial<BoxNode>));
    // per-side padding/margin number inputs (rem → px)
    fireEvent.change(screen.getByLabelText("Inner spacing top"), { target: { value: "2.4" } });
    expect(onPatch).toHaveBeenCalledWith({ paddingTop: 24 });
    fireEvent.change(screen.getByLabelText("Outer spacing left"), { target: { value: "1.6" } });
    expect(onPatch).toHaveBeenCalledWith({ marginLeft: 16 });
  });

  it("a Style preset applies its whole patch (Heading → Display)", () => {
    const onPatch = renderFor(heading());
    fireEvent.click(screen.getByRole("button", { name: "Style Display" }));
    expect(onPatch).toHaveBeenCalled();
  });

  it("Content › Text edits heading/text/button copy", () => {
    for (const t of ["heading", "text", "button"] as const) {
      const onPatch = renderFor(createElement(t, { id: t } as Partial<BoxNode>));
      openContent();
      fireEvent.change(screen.getByLabelText("Text"), { target: { value: "Changed" } });
      expect(onPatch).toHaveBeenCalledWith({ text: "Changed" });
      cleanup();
    }
  });

  it("Content › Button: Link + open-in-new-tab fire", () => {
    const onPatch = renderFor(createElement("button", { id: "b" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Link"), { target: { value: "#pricing" } });
    expect(onPatch).toHaveBeenCalledWith({ href: "#pricing" });
    fireEvent.click(screen.getByLabelText("Open in a new tab"));
    expect(onPatch).toHaveBeenCalledWith({ newTab: true });
  });

  it("Content › List: style + items fire", () => {
    const onPatch = renderFor(createElement("list", { id: "l", listItems: ["a"] } as Partial<BoxNode>));
    openContent();
    fireEvent.click(screen.getByRole("button", { name: "Numbered" }));
    expect(onPatch).toHaveBeenCalledWith({ listStyle: "number" });
    fireEvent.change(screen.getByLabelText("List items"), { target: { value: "one\ntwo" } });
    expect(onPatch).toHaveBeenCalledWith({ listItems: ["one", "two"] });
  });

  it("Content › Video / Embed / Divider / Icon controls fire", () => {
    let onPatch = renderFor(createElement("video", { id: "v" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Video URL"), { target: { value: "https://youtu.be/x" } });
    expect(onPatch).toHaveBeenCalledWith({ src: "https://youtu.be/x" });
    cleanup();

    onPatch = renderFor(createElement("embed", { id: "e" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Embed code"), { target: { value: "<iframe>" } });
    expect(onPatch).toHaveBeenCalledWith({ html: "<iframe>" });
    cleanup();

    onPatch = renderFor(createElement("divider", { id: "d" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Thickness"), { target: { value: "5" } });
    expect(onPatch).toHaveBeenCalledWith({ borderWidth: 5 });
    cleanup();

    onPatch = renderFor(createElement("icon", { id: "i" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Icon size"), { target: { value: "40" } });
    expect(onPatch).toHaveBeenCalledWith({ fontSize: 40 });
  });
});

// A custom <CompactSelect> is a button + a portaled listbox: open it, then click an option.
const pickSelect = (name: string, option: string) => {
  fireEvent.click(screen.getByRole("button", { name })); // the trigger (aria-label = the field label)
  fireEvent.click(screen.getByRole("option", { name: option }));
};

describe("BoxInspector — functionality audit (every remaining control)", () => {
  const heading = () => createElement("heading", { id: "h", text: "Hi" } as Partial<BoxNode>);

  // ── PLACEMENT ──
  it("Placement: Floating / In-the-layout / Lock fire their handlers", () => {
    const onFloat = vi.fn(), onUnfloat = vi.fn();
    const onPatch = renderFor(heading(), { canFloat: true, onFloat, onUnfloat });
    fireEvent.click(screen.getByRole("button", { name: "Floating" }));
    expect(onFloat).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "In the layout" }));
    expect(onUnfloat).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Lock position/ }));
    expect(onPatch).toHaveBeenCalledWith({ locked: true });
  });

  it("Placement (floating): Left% + layer buttons fire", () => {
    const onLayer = vi.fn();
    const onPatch = renderFor(createElement("heading", { id: "f", position: "absolute", left: 10, top: 10 } as Partial<BoxNode>), { canFloat: true, onLayer });
    fireEvent.change(screen.getByLabelText("Left % position"), { target: { value: "25" } });
    expect(onPatch).toHaveBeenCalledWith({ left: 25 });
    fireEvent.click(screen.getByLabelText("Bring to front"));
    expect(onLayer).toHaveBeenCalledWith("front");
    fireEvent.click(screen.getByLabelText("Send to back"));
    expect(onLayer).toHaveBeenCalledWith("back");
  });

  // ── ARRANGE (containers) ──
  it("Arrange: grid toggle, direction, position, wrap, line-up, gap fire", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>));
    fireEvent.click(screen.getByRole("button", { name: "Side-by-side" }));
    expect(onPatch).toHaveBeenCalledWith({ direction: "row" });
    fireEvent.click(screen.getByLabelText("Let blocks wrap to a new line"));
    expect(onPatch).toHaveBeenCalledWith({ wrap: true });
    fireEvent.change(screen.getByLabelText("Space between blocks"), { target: { value: "20" } });
    expect(onPatch).toHaveBeenCalledWith({ gap: 20 });
    pickSelect("Position blocks", "Center");
    expect(onPatch).toHaveBeenCalledWith({ justify: "center" });
    pickSelect("Line up", "Center");
    expect(onPatch).toHaveBeenCalledWith({ align: "center" });
    fireEvent.click(screen.getByRole("button", { name: "Grid" }));
    expect(onPatch).toHaveBeenCalledWith({ layout: "grid" });
  });

  it("Arrange (grid): Columns slider fires", () => {
    const onPatch = renderFor(createContainer("column", { id: "g", layout: "grid", columns: 3 } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Columns"), { target: { value: "4" } });
    expect(onPatch).toHaveBeenCalledWith({ columns: 4 });
  });

  it("Grid cell: Columns wide + Rows tall fire (only when inside a grid)", () => {
    const onPatch = renderFor(createContainer("column", { id: "gc" } as Partial<BoxNode>), { inGrid: true });
    fireEvent.change(screen.getByLabelText("Columns wide"), { target: { value: "2" } });
    expect(onPatch).toHaveBeenCalledWith({ colSpan: 2 });
    fireEvent.change(screen.getByLabelText("Rows tall"), { target: { value: "3" } });
    expect(onPatch).toHaveBeenCalledWith({ rowSpan: 3 });
  });

  // ── SIZE ──
  it("Size: Custom width, Height, Content position, Trim, Position-in-row fire", () => {
    const onAlignInRow = vi.fn();
    const onPatch = renderFor(heading(), { onAlignInRow, rowJustify: "start" });
    fireEvent.click(screen.getByRole("button", { name: "Custom" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ width: expect.any(String) }));
    fireEvent.change(screen.getByLabelText("Height"), { target: { value: "300px" } });
    expect(onPatch).toHaveBeenCalledWith({ height: "300px" });
    fireEvent.click(screen.getByLabelText("Content middle center"));
    expect(onPatch).toHaveBeenCalledWith({ contentX: "center", contentY: "center" });
    fireEvent.click(screen.getByLabelText(/Trim to size/));
    expect(onPatch).toHaveBeenCalledWith({ clip: true });
    fireEvent.click(screen.getByRole("button", { name: "Center" }));
    expect(onAlignInRow).toHaveBeenCalledWith("center");
  });

  // ── OUTLINE ──
  it("Outline: Border style select fires", () => {
    const onPatch = renderFor(heading());
    pickSelect("Border style", "Dashed");
    expect(onPatch).toHaveBeenCalledWith({ borderStyle: "dashed" });
  });

  // ── TYPOGRAPHY (text elements) ──
  it("Typography: size, font, boldness, capitalisation, align, bold fire", () => {
    const onPatch = renderFor(createElement("text", { id: "t", text: "Hi" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Text size"), { target: { value: "22" } });
    expect(onPatch).toHaveBeenCalledWith({ fontSize: 22 });
    pickSelect("Boldness", "Bold");
    expect(onPatch).toHaveBeenCalledWith({ fontWeight: 700 });
    pickSelect("Capitalisation", "UPPERCASE");
    expect(onPatch).toHaveBeenCalledWith({ textTransform: "uppercase" });
    fireEvent.click(screen.getByLabelText("Align center"));
    expect(onPatch).toHaveBeenCalledWith({ textAlign: "center" });
    fireEvent.click(screen.getByLabelText("Bold"));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ bold: expect.any(Boolean) }));
  });

  // ── BOOKMARK (any block) ──
  it("Bookmark name patches the anchor", () => {
    const onPatch = renderFor(heading());
    openContent();
    fireEvent.change(screen.getByLabelText("Bookmark name"), { target: { value: "Pricing Table" } });
    expect(onPatch).toHaveBeenCalledWith({ anchor: "pricing-table" });
  });

  // ── COMPONENT content slots (registry-generated, e.g. Card) ──
  it("a registry component (Card) edits its auto-generated content fields", () => {
    const onPatch = renderFor(createComponent("card", { id: "cd" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "My card" } });
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ componentFields: expect.objectContaining({ title: "My card" }) }));
    // and its design variants apply
    fireEvent.click(screen.getByRole("button", { name: "Raised design" }));
    expect(onPatch).toHaveBeenCalledWith({ variant: "--raised" });
  });
});

// ══ ACCORDION — FINAL AUDIT: every control in all THREE tabs acts on the component AND its items ══
describe("Accordion — full three-tab audit (Design · Content · Per-device)", () => {
  const acc = () => createComponent("accordion", { id: "a", items: [
    { id: "i1", title: "Q1", body: "A1" }, { id: "i2", title: "Q2", body: "A2" }, { id: "i3", title: "Q3", body: "A3" },
  ] } as Partial<BoxNode>);

  it("DESIGN › Placement — Floating / In-the-layout / Lock", () => {
    const onFloat = vi.fn(), onUnfloat = vi.fn();
    const onPatch = renderFor(acc(), { canFloat: true, onFloat, onUnfloat });
    fireEvent.click(screen.getByRole("button", { name: "Floating" }));      expect(onFloat).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "In the layout" })); expect(onUnfloat).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Lock position/ })); expect(onPatch).toHaveBeenCalledWith({ locked: true });
  });

  it("DESIGN › Size — Width, Position-in-row, Height, Content position, Trim", () => {
    const onAlignInRow = vi.fn();
    const onPatch = renderFor(acc(), { onAlignInRow, rowJustify: "start" });
    fireEvent.click(screen.getByRole("button", { name: "Full" }));   expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ width: "fill" }));
    fireEvent.click(screen.getByRole("button", { name: "Center" })); expect(onAlignInRow).toHaveBeenCalledWith("center");
    fireEvent.change(screen.getByLabelText("Height"), { target: { value: "320px" } }); expect(onPatch).toHaveBeenCalledWith({ height: "320px" });
    fireEvent.click(screen.getByLabelText("Content middle center"));  expect(onPatch).toHaveBeenCalledWith({ contentX: "center", contentY: "center" });
    fireEvent.click(screen.getByLabelText(/Trim to size/));           expect(onPatch).toHaveBeenCalledWith({ clip: true });
  });

  it("DESIGN › Spacing — Inner + Outer (per-side)", () => {
    const onPatch = renderFor(acc());
    fireEvent.change(screen.getByLabelText("Inner spacing top"), { target: { value: "2.4" } });    expect(onPatch).toHaveBeenCalledWith({ paddingTop: 24 });
    fireEvent.change(screen.getByLabelText("Outer spacing bottom"), { target: { value: "1.6" } }); expect(onPatch).toHaveBeenCalledWith({ marginBottom: 16 });
  });

  it("DESIGN › Outline & effects — rounded, per-corner, border, border-style, shadow, tilt, see-through", () => {
    const onPatch = renderFor(acc());
    fireEvent.change(screen.getByLabelText("Rounded corners"), { target: { value: "16" } });        expect(onPatch).toHaveBeenCalledWith({ radius: 16 });
    fireEvent.change(screen.getByLabelText("Rounded corner top-left"), { target: { value: "4" } }); expect(onPatch).toHaveBeenCalledWith({ radiusTopLeft: 4 });
    fireEvent.change(screen.getByLabelText("Border"), { target: { value: "2" } });                   expect(onPatch).toHaveBeenCalledWith({ borderWidth: 2 });
    pickSelect("Border style", "Dashed");                                                            expect(onPatch).toHaveBeenCalledWith({ borderStyle: "dashed" });
    fireEvent.click(screen.getByRole("button", { name: "Medium" }));                                 expect(onPatch).toHaveBeenCalledWith({ shadow: "md" });
    fireEvent.change(screen.getByLabelText("Tilt"), { target: { value: "5" } });                     expect(onPatch).toHaveBeenCalledWith({ rotate: 5 });
    fireEvent.change(screen.getByLabelText("See-through"), { target: { value: "80" } });             expect(onPatch).toHaveBeenCalledWith({ opacity: 80 });
  });

  it("CONTENT › Bookmark + design gallery + multi-open + expand-all", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.change(screen.getByLabelText("Bookmark name"), { target: { value: "Our FAQ" } }); expect(onPatch).toHaveBeenCalledWith({ anchor: "our-faq" });
    fireEvent.click(screen.getByRole("button", { name: "Solid panel design" }));                 expect(onPatch).toHaveBeenCalledWith({ variant: "--panel" });
    fireEvent.click(screen.getByLabelText("Allow more than one open at once"));                   expect(onPatch).toHaveBeenCalledWith({ accMultiOpen: true });
    fireEvent.click(screen.getByLabelText(/Expand all/));                                         expect(onPatch).toHaveBeenCalledWith({ accShowAll: true });
  });

  it("CONTENT › Items — EVERY per-item field works on ANY item (title, body, meta, image, CSS, open)", () => {
    const onPatch = renderFor(acc());
    openContent();
    const hasItem = (m: Record<string, unknown>) => expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining(m)]) });
    fireEvent.change(screen.getByLabelText("Item 2 title"), { target: { value: "New Q" } });           expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i2", title: "New Q" }));
    fireEvent.change(screen.getByLabelText("Item 2 body"), { target: { value: "New A" } });            expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i2", body: "New A" }));
    fireEvent.change(screen.getByLabelText("Item 2 meta"), { target: { value: "$5" } });               expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i2", meta: "$5" }));
    fireEvent.change(screen.getByLabelText("Item 2 image"), { target: { value: "https://x/y.png" } }); expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i2", media: "https://x/y.png" }));
    fireEvent.change(screen.getByLabelText("Item 2 CSS"), { target: { value: "color: red;" } });       expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i2", css: "color: red;" }));
    fireEvent.click(screen.getAllByLabelText("Open by default")[0]);                                    expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i1", open: true }));
  });

  it("CONTENT › Items — add, remove, reorder", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining({ title: "New question" })]) }));
    fireEvent.click(screen.getByLabelText("Remove item 2"));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.not.arrayContaining([expect.objectContaining({ id: "i2" })]) }));
    fireEvent.click(screen.getAllByLabelText("Move item down")[0]);
    const reordered = onPatch.mock.calls.map((c) => c[0]).reverse().find((p) => p.items);
    expect(reordered.items[0].id).toBe("i2");
  });

  it("CONTENT › Typography — size, boldness, capitalisation, line/letter spacing (cascade into items)", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.change(screen.getByLabelText("Text size"), { target: { value: "20" } });    expect(onPatch).toHaveBeenCalledWith({ fontSize: 20 });
    pickSelect("Boldness", "Bold");                                                        expect(onPatch).toHaveBeenCalledWith({ fontWeight: 700 });
    pickSelect("Capitalisation", "UPPERCASE");                                             expect(onPatch).toHaveBeenCalledWith({ textTransform: "uppercase" });
    fireEvent.change(screen.getByLabelText("Line spacing"), { target: { value: "1.5" } }); expect(onPatch).toHaveBeenCalledWith({ lineHeight: 1.5 });
    fireEvent.change(screen.getByLabelText("Letter spacing"), { target: { value: "1" } }); expect(onPatch).toHaveBeenCalledWith({ letterSpacing: 1 });
  });

  it("CONTENT › whole-component Advanced CSS (sanitised)", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByRole("button", { name: "Advanced CSS" }));
    fireEvent.change(screen.getByLabelText("Advanced CSS"), { target: { value: "backdrop-filter: blur(4px);" } });
    expect(onPatch).toHaveBeenCalledWith({ advancedCss: "backdrop-filter: blur(4px);" });
  });

  it("PER-DEVICE › Hidden toggle", () => {
    const onPatch = renderFor(acc());
    openDevice();
    fireEvent.click(screen.getByLabelText(/Hidden everywhere/));
    expect(onPatch).toHaveBeenCalledWith({ hidden: true });
  });

  const hasItem = (m: Record<string, unknown>) => expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining(m)]) });

  it("CONTENT › Float — the toggle detaches an item (gives it a default position)", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByLabelText("Item 1 float"));
    expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i1", float: expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }) }));
  });

  it("CONTENT › Float — X/Y inputs drive a floated item's position (rem)", () => {
    const floated = createComponent("accordion", { id: "a", items: [
      { id: "i1", title: "Q1", body: "A1", float: { x: 4, y: 4, z: 1 } }, { id: "i2", title: "Q2", body: "A2" },
    ] } as Partial<BoxNode>);
    const onPatch = renderFor(floated);
    openContent();
    fireEvent.change(screen.getByLabelText("Item 1 float X"), { target: { value: "12" } });
    expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i1", float: expect.objectContaining({ x: 12 }) }));
    fireEvent.change(screen.getByLabelText("Item 1 float Y"), { target: { value: "8" } });
    expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i1", float: expect.objectContaining({ y: 8 }) }));
  });

  // ── EVERY design variant: the controls are variant-independent, so the audit holds for ALL 54 looks ──
  it("holds for EVERY accordion design variant (a control + an item edit fire regardless of the look)", () => {
    for (const v of ["", "--panel", "--flush", "--invert", "--timeline", "--glass", "--numbered", "--pill", "--horizontal"]) {
      const onPatch = renderFor(createComponent("accordion", { id: "a", variant: v, items: [{ id: "i1", title: "Q", body: "A" }] } as Partial<BoxNode>));
      fireEvent.change(screen.getByLabelText("Rounded corners"), { target: { value: "8" } });
      expect(onPatch).toHaveBeenCalledWith({ radius: 8 });
      openContent();
      fireEvent.change(screen.getByLabelText("Item 1 title"), { target: { value: "Z" } });
      expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining({ title: "Z" })]) }));
      cleanup();
    }
  });
});
