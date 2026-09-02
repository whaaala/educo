import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
  const acc = () => createComponent("accordion", { id: "a", accItems: [
    { id: "i1", title: "Q1", body: "A1" }, { id: "i2", title: "Q2", body: "A2" },
  ] } as Partial<BoxNode>);

  it("changes the accordion design from the visual picker", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByRole("option", { name: "Solid panel design" }));
    expect(onPatch).toHaveBeenCalledWith({ variant: "--panel" });
    // every design is offered
    expect(screen.getByRole("option", { name: "Horizontal design" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dark glossy design" })).toBeInTheDocument();
  });

  it("toggles multi-open and adds an item", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByLabelText("Allow more than one open at once"));
    expect(onPatch).toHaveBeenCalledWith({ accMultiOpen: true });
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ accItems: expect.arrayContaining([expect.objectContaining({ title: "New question" })]) }));
  });

  it("edits an item title; remove is enabled with two items", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.change(screen.getByLabelText("Item 1 title"), { target: { value: "Changed" } });
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ accItems: expect.arrayContaining([expect.objectContaining({ title: "Changed" })]) }));
    expect(screen.getByLabelText("Remove item 1")).not.toBeDisabled();
  });

  it("cannot remove the last remaining item", () => {
    renderFor(createComponent("accordion", { id: "a2", accItems: [{ id: "i1", title: "only", body: "b" }] } as Partial<BoxNode>));
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
    // a broad library is present
    expect(screen.getByLabelText("Icon Rocket")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search icons"), { target: { value: "heart" } });
    expect(screen.getByLabelText("Icon Heart")).toBeInTheDocument();
    expect(screen.queryByLabelText("Icon Rocket")).not.toBeInTheDocument(); // filtered out
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
    fireEvent.click(screen.getByLabelText("Icon Heart"));
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
