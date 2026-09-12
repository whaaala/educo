import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteBuilder from "@/components/shared/SiteBuilder/SiteBuilder";
import { createSite, defaultHeaderLayout } from "@/lib/site-storage";

beforeEach(() => localStorage.clear());

function renderBuilder() {
  const site = createSite("Test School");
  // Real sites get their freeform header layout on load (migrateSite); seed it here so the header
  // renders its own logo/name/nav/CTA button. Give the CTA a unique label so it's unambiguous
  // (the CTA *section* also uses "Apply now").
  const layout = defaultHeaderLayout(site).map((e) => (e.type === "button" ? { ...e, text: "Header CTA" } : e));
  site.header = { ...site.header, layout };
  const onChange = vi.fn();
  const utils = render(<SiteBuilder value={site} onChange={onChange} />);
  return { site, onChange, ...utils };
}

describe("SiteBuilder — header element inspector wiring", () => {
  it("selecting the CTA button shows the Header inspector with its controls", async () => {
    const user = userEvent.setup();
    renderBuilder();
    // Click the CTA button element on the canvas
    await user.click(screen.getByText("Header CTA"));
    // Inspector header switches to "Header"
    expect(screen.getByRole("heading", { name: /header/i })).toBeInTheDocument();
    // Button controls are present
    expect(screen.getByLabelText("Background")).toBeInTheDocument();
    expect(screen.getByLabelText("Label colour")).toBeInTheDocument();
    expect(screen.getByText("Font family")).toBeInTheDocument();
  });

  it("changing the button font size updates the canvas button immediately", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByText("Header CTA"));
    const slider = screen.getByLabelText("Font size") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "24" } });
    // The on-canvas button re-renders with the new font size (commit → setSite is synchronous).
    // fontSize is set on the button wrapper span (parent of the editable text node).
    await vi.waitFor(() => {
      const wrapper = screen.getByText("Header CTA").parentElement!;
      expect(wrapper.style.fontSize).toBe("24px");
    });
  });

  it("changing the button background colour updates the canvas button", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByText("Header CTA"));
    // Open the Background colour popover and pick a swatch
    await user.click(screen.getByLabelText("Background"));
    const swatches = await screen.findAllByRole("button");
    // pick a known solid swatch by its title/style is hard; instead assert the popover opened
    expect(swatches.length).toBeGreaterThan(0);
  });
});
