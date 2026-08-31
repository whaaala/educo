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

describe("BoxInspector — styling primitives", () => {
  it("edits border width, shadow preset and rotation", () => {
    const onPatch = renderFor(createContainer("column", { id: "b" } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Border"), { target: { value: "4" } });
    expect(onPatch).toHaveBeenCalledWith({ borderWidth: 4 });
    fireEvent.click(screen.getByRole("button", { name: "lg" }));
    expect(onPatch).toHaveBeenCalledWith({ shadow: "lg" });
    fireEvent.change(screen.getByLabelText("Rotation"), { target: { value: "30" } });
    expect(onPatch).toHaveBeenCalledWith({ rotate: 30 });
  });

  it("edits a single corner radius (per-corner override)", () => {
    const onPatch = renderFor(createContainer("column", { id: "b", radius: 8 } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Corner radius TL"), { target: { value: "0" } });
    expect(onPatch).toHaveBeenCalledWith({ radiusTopLeft: 0 });
  });

  it("shows typography controls for a text element and patches them", () => {
    const onPatch = renderFor(createElement("text", { id: "t", text: "Hi" } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Line height"), { target: { value: "1.6" } });
    expect(onPatch).toHaveBeenCalledWith({ lineHeight: 1.6 });
    fireEvent.change(screen.getByLabelText("Letter spacing (px)"), { target: { value: "1.5" } });
    expect(onPatch).toHaveBeenCalledWith({ letterSpacing: 1.5 });
    fireEvent.click(screen.getByLabelText("Italic"));
    expect(onPatch).toHaveBeenCalledWith({ italic: true });
    fireEvent.click(screen.getByLabelText("Underline"));
    expect(onPatch).toHaveBeenCalledWith({ underline: true });
  });

  it("exposes grid column/row span only when the box is inside a grid", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { inGrid: true });
    fireEvent.change(screen.getByLabelText("Column span"), { target: { value: "2" } });
    expect(onPatch).toHaveBeenCalledWith({ colSpan: 2 });
  });

  it("hides grid span controls when NOT in a grid", () => {
    renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { inGrid: false });
    expect(screen.queryByLabelText("Column span")).not.toBeInTheDocument();
  });
});

describe("BoxInspector — content types & links", () => {
  it("edits a video URL", () => {
    const onPatch = renderFor(createElement("video", { id: "v" } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Video URL"), { target: { value: "https://youtu.be/abc" } });
    expect(onPatch).toHaveBeenCalledWith({ src: "https://youtu.be/abc" });
  });

  it("edits embed HTML", () => {
    const onPatch = renderFor(createElement("embed", { id: "e" } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("HTML embed code"), { target: { value: "<iframe></iframe>" } });
    expect(onPatch).toHaveBeenCalledWith({ html: "<iframe></iframe>" });
  });

  it("edits list items (one per line) and marker style", () => {
    const onPatch = renderFor(createElement("list", { id: "l" } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("List items"), { target: { value: "a\nb\nc" } });
    expect(onPatch).toHaveBeenCalledWith({ listItems: ["a", "b", "c"] });
    fireEvent.click(screen.getByRole("button", { name: "Numbered" }));
    expect(onPatch).toHaveBeenCalledWith({ listStyle: "number" });
  });

  it("picks an icon", () => {
    const onPatch = renderFor(createElement("icon", { id: "i" } as Partial<BoxNode>));
    fireEvent.click(screen.getByLabelText("Icon Heart"));
    expect(onPatch).toHaveBeenCalledWith({ icon: "Heart" });
  });

  it("sets a button link target + new-tab, and an anchor name on any box", () => {
    const onPatch = renderFor(createElement("button", { id: "b", text: "Go" } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Anchor name"), { target: { value: "My Section" } });
    expect(onPatch).toHaveBeenCalledWith({ anchor: "my-section" }); // slugified
    fireEvent.click(screen.getByLabelText("Open in a new tab"));
    expect(onPatch).toHaveBeenCalledWith({ newTab: true });
  });

  it("links a button to another PAGE via the page picker", () => {
    const onPatch = renderFor(createElement("button", { id: "b", text: "Go" } as Partial<BoxNode>), {
      pages: [{ id: "home", name: "Home" }, { id: "about", name: "About" }],
      currentPageId: "home",
    });
    fireEvent.change(screen.getByLabelText("Link to page"), { target: { value: "page:about" } });
    expect(onPatch).toHaveBeenCalledWith({ href: "page:about" });
    // the current page is excluded from the options
    expect(screen.queryByRole("option", { name: "Home" })).not.toBeInTheDocument();
  });
});

describe("BoxInspector — responsive", () => {
  it("shows a breakpoint banner + reset when editing a non-base breakpoint with an override", () => {
    const onReset = vi.fn();
    renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { breakpoint: "mobile", overridden: true, onResetOverride: onReset });
    expect(screen.getByText(/Editing Mobile/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Reset mobile overrides/));
    expect(onReset).toHaveBeenCalled();
  });

  it("has no breakpoint banner on the base", () => {
    renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { breakpoint: "base" });
    expect(screen.queryByText(/Editing Mobile|Editing Tablet/)).not.toBeInTheDocument();
  });

  it("toggles hidden (labelled per breakpoint)", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { breakpoint: "mobile" });
    fireEvent.click(screen.getByLabelText(/Hidden on mobile/));
    expect(onPatch).toHaveBeenCalledWith({ hidden: true });
  });
});
