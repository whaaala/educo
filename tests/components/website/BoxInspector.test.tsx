import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BoxInspector from "@/components/website/box/BoxInspector";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { createContainer, createElement, type BoxNode } from "@/lib/box-model";

function renderFor(node: BoxNode, extra: Record<string, unknown> = {}) {
  const onPatch = vi.fn();
  render(<BoxInspector node={node} theme={DEFAULT_THEME} onPatch={onPatch} {...extra} />);
  return onPatch;
}
const openContent = () => fireEvent.click(screen.getByRole("tab", { name: "Content" }));
const openDevice = () => fireEvent.click(screen.getByRole("tab", { name: "Per-device" }));

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
    fireEvent.change(screen.getByLabelText("Link to page"), { target: { value: "page:about" } });
    expect(onPatch).toHaveBeenCalledWith({ href: "page:about" });
    expect(screen.queryByRole("option", { name: "Home" })).not.toBeInTheDocument(); // current page excluded
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
