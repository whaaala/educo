import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SectionBlocks from "@/components/website/sections/SectionBlocks";
import { createSectionBlock, DEFAULT_THEME, type SectionBlock } from "@/lib/site-storage";

function setup(blocks: SectionBlock[], editable = true) {
  const onChange = vi.fn();
  render(<SectionBlocks blocks={blocks} theme={DEFAULT_THEME} editable={editable} onChange={onChange} />);
  return { onChange };
}

describe("SectionBlocks (flowing blocks inside a section)", () => {
  it("shows an Add-block menu (text/heading/button/image) when editable", () => {
    setup([]);
    for (const l of ["Add Heading block", "Add Text block", "Add Button block", "Add Image block"]) {
      expect(screen.getByLabelText(l)).toBeInTheDocument();
    }
  });

  it("adds a text block via the menu", async () => {
    const user = userEvent.setup();
    const { onChange } = setup([]);
    await user.click(screen.getByLabelText("Add Text block"));
    const next = onChange.mock.calls.at(-1)![0];
    expect(next).toHaveLength(1);
    expect(next[0].type).toBe("text");
  });

  it("renders existing blocks in one column flow — no absolute positioning, so they cannot overlap (the jsdom-checkable part) — and deletes one", async () => {
    const user = userEvent.setup();
    const b = createSectionBlock("heading"); b.text = "My heading";
    const t = createSectionBlock("text"); t.text = "My text";
    const { onChange } = setup([b, t]);
    expect(screen.getByText("My heading")).toBeInTheDocument();
    // BDD1-15: each block's wrapper is an in-flow sibling of a flex column; none is lifted out of the flow
    const wrappers = ["My heading", "My text"].map((s) => screen.getByText(s).closest<HTMLElement>("[class*='group/blk']")!);
    expect(wrappers[0].parentElement).toBe(wrappers[1].parentElement);
    expect(wrappers[0].parentElement).toHaveClass("flex", "flex-col");
    for (const w of wrappers) {
      expect(w.className.split(/\s+/)).not.toContain("absolute");
      expect(w.className.split(/\s+/)).not.toContain("fixed");
      expect(w.style.position).toBe("");
      expect([w.style.top, w.style.left, w.style.transform]).toEqual(["", "", ""]);
    }
    await user.click(screen.getAllByLabelText("Delete block")[0]);
    expect(onChange.mock.calls.at(-1)![0].map((x: SectionBlock) => x.text)).toEqual(["My text"]);
  });

  it("cycles a block's alignment (left → center)", async () => {
    const user = userEvent.setup();
    const b = createSectionBlock("heading"); // starts left
    const { onChange } = setup([b]);
    await user.click(screen.getByLabelText(/Align block/));
    expect(onChange.mock.calls.at(-1)![0][0].align).toBe("center");
  });

  it("reorders blocks with the up/down buttons (WCAG keyboard path)", async () => {
    const user = userEvent.setup();
    const a = createSectionBlock("text"); a.text = "first";
    const c = createSectionBlock("text"); c.text = "second";
    const { onChange } = setup([a, c]);
    await user.click(screen.getAllByLabelText("Move block down")[0]); // move "first" down
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls.at(-1)![0].map((x: SectionBlock) => x.text)).toEqual(["second", "first"]);
    // BDD1-16: up on the second block moves it above the first
    onChange.mockClear();
    await user.click(screen.getAllByLabelText("Move block up")[1]);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls.at(-1)![0].map((x: SectionBlock) => x.text)).toEqual(["second", "first"]);
    // the ends cannot move past the edge
    expect(screen.getAllByLabelText("Move block up")[0]).toBeDisabled();
    expect(screen.getAllByLabelText("Move block down")[1]).toBeDisabled();
  });

  it("renders nothing when not editable and there are no blocks", () => {
    const { container } = render(<SectionBlocks blocks={[]} theme={DEFAULT_THEME} editable={false} onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows blocks read-only in preview (no add menu)", () => {
    const b = createSectionBlock("text"); b.text = "Read only text";
    render(<SectionBlocks blocks={[b]} theme={DEFAULT_THEME} editable={false} onChange={() => {}} />);
    expect(screen.getByText("Read only text")).toBeInTheDocument();
    expect(screen.queryByLabelText("Add Text block")).not.toBeInTheDocument();
  });
});

describe("createSectionBlock", () => {
  it("creates each block type with a unique id and sensible defaults", () => {
    const types = ["heading", "text", "button", "image"] as const;
    const ids = new Set<string>();
    for (const t of types) {
      const b = createSectionBlock(t);
      expect(b.type).toBe(t);
      expect(b.id).toMatch(/^blk-/);
      ids.add(b.id);
    }
    expect(ids.size).toBe(types.length);
    expect(createSectionBlock("button").href).toBeTruthy();
  });
});
