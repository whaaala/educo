import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import SectionRenderer from "@/components/website/sections/SectionRenderer";
import { createSection, DEFAULT_THEME } from "@/lib/site-storage";

describe("Inline section editing (WordPress-style on-canvas)", () => {
  it("renders read-only (no contentEditable) when not editable", () => {
    const { container } = render(<SectionRenderer section={createSection("hero")} theme={DEFAULT_THEME} />);
    expect(container.querySelectorAll('[contenteditable="true"]').length).toBe(0);
  });

  it("makes text editable on the canvas when editable", () => {
    const { container } = render(<SectionRenderer section={createSection("hero")} theme={DEFAULT_THEME} editable onChange={() => {}} />);
    // hero has an editable heading, subheading, eyebrow, and CTA labels
    expect(container.querySelectorAll('[contenteditable="true"]').length).toBeGreaterThan(2);
  });

  it("calls onChange with the edited heading", () => {
    const onChange = vi.fn();
    const section = createSection("hero");
    const { container } = render(<SectionRenderer section={section} theme={DEFAULT_THEME} editable onChange={onChange} />);
    // The first editable is the eyebrow; find the heading by its current text.
    const editables = Array.from(container.querySelectorAll('[contenteditable="true"]')) as HTMLElement[];
    const heading = editables.find((el) => el.textContent === section.content.heading)!;
    expect(heading).toBeTruthy();
    heading.textContent = "Our new headline";
    fireEvent.input(heading);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ heading: "Our new headline" }));
  });

  it("edits a features item's title through onChange (items array preserved)", () => {
    const onChange = vi.fn();
    const section = createSection("features");
    const firstTitle = section.content.items![0].title!;
    const { container } = render(<SectionRenderer section={section} theme={DEFAULT_THEME} editable onChange={onChange} />);
    const editables = Array.from(container.querySelectorAll('[contenteditable="true"]')) as HTMLElement[];
    const title = editables.find((el) => el.textContent === firstTitle)!;
    title.textContent = "Renamed program";
    fireEvent.input(title);
    const patch = onChange.mock.calls.at(-1)![0];
    expect(patch.items[0].title).toBe("Renamed program");
    expect(patch.items.length).toBe(section.content.items!.length); // no items lost
  });
});
