/**
 * ED-2b · the layers tree, as a person uses it (BATCH LE-14; tests/features/components/website/box-builder-layers.feature).
 * The page as the palette builds it — each block in its own row band — and every change through `onChange`.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import LayersPanel from "@/components/website/box/LayersPanel";
import { type BoxNode, createContainer, createElement, insertBox, normalizeRowBands, findBox, resolveResponsive } from "@/lib/box-model";
import WORDS from "@/config/inspector.json";

const L = WORDS.layers;
const commit = (r: BoxNode) => normalizeRowBands(r);
function page(): BoxNode {
  let root = createContainer("column", { id: "root", padding: 0, gap: 0, children: [] } as Partial<BoxNode>);
  root = commit(insertBox(root, "root", 0, createContainer("column", { id: "stack", children: [] } as Partial<BoxNode>)));
  root = commit(insertBox(root, "stack", 0, createElement("heading", { id: "heading", text: "Hi" } as Partial<BoxNode>)));
  root = commit(insertBox(root, "stack", 1, createElement("text", { id: "text", text: "Words" } as Partial<BoxNode>)));
  return commit(insertBox(root, "root", root.children!.length, createElement("button", { id: "button", text: "Go" } as Partial<BoxNode>)));
}
function setup(extra: Partial<Omit<Parameters<typeof LayersPanel>[0], "onSelect" | "onChange">> = {}) {
  const onSelect = vi.fn(), onChange = vi.fn();
  render(<LayersPanel root={page()} selectedIds={[]} breakpoint="base" onSelect={onSelect} onChange={onChange} {...extra} />);
  return { onSelect, onChange };
}
const items = () => screen.getAllByRole("treeitem");
const row = (id: string) => items().find((el) => el.dataset.layerId === id)!;

describe("ED-2b the layers tree", () => {
  it("is a tree of the page in reading order, nested, with no row band", () => {
    setup();
    expect(screen.getByRole("tree", { name: L.title })).toBeInTheDocument();
    expect(items().map((el) => [el.dataset.layerId, el.getAttribute("aria-level")])).toEqual([["stack", "1"], ["heading", "2"], ["text", "2"], ["button", "1"]]);
    expect(row("stack")).toHaveAttribute("aria-expanded", "true");
  });
  it("the selection is marked; a click selects, Shift adds", () => {
    const p = setup({ selectedIds: ["button"] });
    expect(row("button")).toHaveAttribute("aria-selected", "true");
    expect(row("text")).toHaveAttribute("aria-selected", "false");
    fireEvent.click(row("text"));
    expect(p.onSelect).toHaveBeenLastCalledWith("text", false);
    fireEvent.click(row("heading"), { shiftKey: true });
    expect(p.onSelect).toHaveBeenLastCalledWith("heading", true);
  });
  it("Select several: a plain click adds, for a touch screen with no Shift (LE14-9)", () => {
    const p = setup({ selectedIds: ["text"] });
    fireEvent.click(screen.getByRole("checkbox", { name: L.several }));
    fireEvent.click(row("button"));
    expect(p.onSelect).toHaveBeenLastCalledWith("button", true);
  });
  it("one tab stop; the arrows, Home and End move; Left closes, Right opens; Enter selects", () => {
    const p = setup({ selectedIds: ["stack"] });
    expect(items().filter((el) => el.tabIndex === 0).map((el) => el.dataset.layerId)).toEqual(["stack"]);
    row("stack").focus();
    fireEvent.keyDown(row("stack"), { key: "ArrowLeft" });
    expect(items().map((el) => el.dataset.layerId)).toEqual(["stack", "button"]);
    expect(row("stack")).toHaveAttribute("aria-expanded", "false");
    fireEvent.keyDown(row("stack"), { key: "ArrowRight" });
    expect(items()).toHaveLength(4);
    fireEvent.keyDown(row("stack"), { key: "End" });
    fireEvent.keyDown(row("button"), { key: "Enter" });
    expect(p.onSelect).toHaveBeenLastCalledWith("button", false);
  });
  it("F2 renames; Enter keeps the name (an editor-only layerName)", () => {
    const p = setup();
    fireEvent.keyDown(row("stack"), { key: "F2" });
    const input = screen.getByRole("textbox", { name: L.rename.replace("{name}", "Stack") });
    fireEvent.change(input, { target: { value: "Welcome" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(findBox(p.onChange.mock.calls[0][0], "stack")!.layerName).toBe("Welcome");
  });
  it("Hide hides on the screen being edited only; Lock locks", () => {
    const p = setup({ breakpoint: "phone" });
    fireEvent.click(within(row("text")).getByRole("button", { name: L.hide.replace("{name}", "Text").replace("{screen}", "Phone") }));
    const hidden = findBox(p.onChange.mock.calls[0][0], "text")!;
    expect(resolveResponsive(hidden, "phone").hidden).toBe(true);
    expect(hidden.hidden).toBeUndefined();
    fireEvent.click(within(row("text")).getByRole("button", { name: L.lock.replace("{name}", "Text") }));
    expect(findBox(p.onChange.mock.calls[1][0], "text")!.locked).toBe(true);
  });
  it("Shift+F10 opens the row's menu: rename, hide, lock and the canvas's actions", () => {
    setup();
    fireEvent.keyDown(row("text"), { key: "F10", shiftKey: true });
    const names = screen.getAllByRole("menuitem").map((m) => m.textContent);
    for (const want of [L.duplicate, L.moveUp, L.moveDown, L.delete]) expect(names.some((n) => n?.includes(want))).toBe(true);
    expect(names.some((n) => n?.includes(L.rename.replace("{name}", "Text")))).toBe(true);
  });
  it("Delete in the menu deletes that block, in one change", () => {
    const p = setup();
    fireEvent.click(within(row("button")).getByRole("button", { name: L.more.replace("{name}", "Button") }));
    fireEvent.click(screen.getByRole("menuitem", { name: new RegExp(L.delete) }));
    expect(p.onChange).toHaveBeenCalledTimes(1);
    expect(findBox(p.onChange.mock.calls[0][0], "button")).toBeNull();
  });
});
