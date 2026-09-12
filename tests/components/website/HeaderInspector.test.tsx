import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderInspector from "@/components/website/HeaderInspector";
import { createSite, type HeaderEl } from "@/lib/site-storage";

function setup(el: HeaderEl) {
  const site = createSite("Test School");
  const onChange = vi.fn();
  const onDelete = vi.fn();
  const onHeaderHeight = vi.fn();
  const onOpenNav = vi.fn();
  render(
    <HeaderInspector
      el={el}
      theme={site.theme}
      pages={site.pages}
      headerHeight={78}
      onChange={onChange}
      onDelete={onDelete}
      onHeaderHeight={onHeaderHeight}
      onOpenNav={onOpenNav}
    />,
  );
  return { site, onChange, onDelete, onHeaderHeight, onOpenNav };
}

describe("HeaderInspector", () => {
  it("text element: edits text, exposes font family, size, bold, colour, link", async () => {
    const user = userEvent.setup();
    const { onChange } = setup({ id: "t1", type: "text", x: 10, y: 30, text: "Hello" });
    // text input
    await user.clear(screen.getByDisplayValue("Hello"));
    await user.type(screen.getByRole("textbox"), "Hi");
    expect(onChange).toHaveBeenCalled();
    // font family select present
    expect(screen.getByText("Font family")).toBeInTheDocument();
    // bold toggle (the only checkbox before a link is set)
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith({ bold: true });
    // link control present
    expect(screen.getByText("Link")).toBeInTheDocument();
  });

  it("button element: exposes background + label colour swatches and a label field", () => {
    setup({ id: "b1", type: "button", x: 80, y: 30, text: "Apply" });
    expect(screen.getByLabelText("Background")).toBeInTheDocument();
    expect(screen.getByLabelText("Label colour")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Apply")).toBeInTheDocument();
  });

  it("logo element: upload, transparent toggle, and size sliders; cannot be deleted", () => {
    setup({ id: "l1", type: "logo", x: 3, y: 28 });
    expect(screen.getByLabelText("Upload logo image")).toBeInTheDocument();
    expect(screen.getByText(/Transparent/)).toBeInTheDocument();
    expect(screen.getByLabelText("Width")).toBeInTheDocument();
    expect(screen.getByLabelText("Height")).toBeInTheDocument();
    expect(screen.queryByText("Delete element")).not.toBeInTheDocument();
  });

  it("transparent toggle sets bg to 'transparent'", async () => {
    const user = userEvent.setup();
    const { onChange } = setup({ id: "l1", type: "logo", x: 3, y: 28 });
    await user.click(screen.getByText(/Transparent/).closest("label")!.querySelector("input")!);
    expect(onChange).toHaveBeenCalledWith({ bg: "transparent" });
  });

  it("nav element: opens the Navigation panel via the manage button", async () => {
    const user = userEvent.setup();
    const { onOpenNav } = setup({ id: "n1", type: "nav", x: 42, y: 34 });
    await user.click(screen.getByText("Manage links & dropdowns"));
    expect(onOpenNav).toHaveBeenCalled();
  });

  it("exposes a header band height slider", () => {
    const { onHeaderHeight } = setup({ id: "t1", type: "text", x: 10, y: 30, text: "Hi" });
    expect(screen.getByLabelText("Header height")).toBeInTheDocument();
    expect(onHeaderHeight).not.toHaveBeenCalled(); // present but untouched
  });

  it("delete button fires onDelete for non-logo elements", async () => {
    const user = userEvent.setup();
    const { onDelete } = setup({ id: "t1", type: "text", x: 10, y: 30, text: "Hi" });
    await user.click(screen.getByText("Delete element"));
    expect(onDelete).toHaveBeenCalled();
  });
});
