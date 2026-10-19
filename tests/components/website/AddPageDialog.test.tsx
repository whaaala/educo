import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddPageDialog from "@/components/website/box/AddPageDialog";
import TEMPLATES from "@/config/page-templates.json";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { regionBlock, type BoxNode } from "@/lib/box-model";

/** PS-5 (3) · Add a page — box-builder-sections.feature "Adding a page from a template". */
globalThis.ResizeObserver ??= class { observe() {} disconnect() {} unobserve() {} } as unknown as typeof ResizeObserver;

describe("AddPageDialog", () => {
  const open = () => {
    const on = { onClose: vi.fn(), onBlank: vi.fn(), onDuplicate: vi.fn(), onTemplate: vi.fn() };
    render(<AddPageDialog open theme={DEFAULT_THEME} start="Page 2" currentName="Home" {...on} />);
    return on;
  };

  it("Blank adds a page under the name typed", () => {
    const on = open();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Term dates" } });
    fireEvent.click(screen.getByRole("button", { name: "Blank page" }));
    expect(on.onBlank).toHaveBeenCalledWith("Term dates");
  });

  it("Duplicate is offered by the current page's name", () => {
    const on = open();
    fireEvent.click(screen.getByRole("button", { name: "Duplicate “Home”" }));
    expect(on.onDuplicate).toHaveBeenCalled();
  });

  it("every built-in template is a live tile; a click adds its page, its sections in order", async () => {
    const on = open();
    const t = TEMPLATES.templates[0];
    fireEvent.click(await screen.findByRole("button", { name: `Add ${t.name}, Page templates` }, { timeout: 4000 }));
    const [name, root] = on.onTemplate.mock.calls[0] as [string, BoxNode];
    expect(name).toBe("Page 2");
    expect(root.children!.length).toBe(t.sections.length);
    expect(regionBlock(root.children![0])?.tag).toBe("header");
    for (const tpl of TEMPLATES.templates) expect(screen.getByRole("button", { name: `Add ${tpl.name}, Page templates` })).toBeTruthy();
  });
});
