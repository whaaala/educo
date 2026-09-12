import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeaderBar from "@/components/website/HeaderBar";
import { createSite, defaultHeaderLayout } from "@/lib/site-storage";

function setup(editable = true) {
  const site = createSite("Test School");
  const layout = defaultHeaderLayout(site);
  const onChange = vi.fn();
  render(<HeaderBar site={site} theme={site.theme} layout={layout} editable={editable} onChange={onChange} />);
  return { site, layout, onChange };
}

describe("HeaderBar (freeform header)", () => {
  it("renders the nav as one element (with menu links) and the CTA button", () => {
    setup();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument(); // nav element
    expect(screen.getByText("Apply now")).toBeInTheDocument(); // button element
  });

  it("adds a text element via the toolbar", async () => {
    const user = userEvent.setup();
    const { layout, onChange } = setup();
    await user.click(screen.getByLabelText("Add header text"));
    const next = onChange.mock.calls.at(-1)![0];
    expect(next.length).toBe(layout.length + 1);
    expect(next.some((e: { type: string }) => e.type === "text")).toBe(true);
  });

  it("selecting an element reveals move + delete controls; delete removes it", async () => {
    const user = userEvent.setup();
    const { layout, onChange } = setup();
    // click the CTA button element to select it
    await user.click(screen.getByText("Apply now"));
    const del = screen.getByLabelText("Delete element");
    await user.click(del);
    const next = onChange.mock.calls.at(-1)![0];
    expect(next.length).toBe(layout.length - 1);
  });

  it("read-only mode shows no editing controls", () => {
    setup(false);
    expect(screen.queryByLabelText("Add header text")).not.toBeInTheDocument();
  });

  it("header elements are keyboard operable: focus + arrow to move, Delete to remove (WCAG)", async () => {
    const user = userEvent.setup();
    const { layout, onChange } = setup();
    const before = layout.find((e) => e.type === "button")!.x;
    const btn = screen.getByRole("button", { name: /button header element/i });
    btn.focus();
    await user.keyboard("{ArrowRight}");
    const afterMove = onChange.mock.calls.at(-1)![0].find((e: { type: string }) => e.type === "button");
    expect(afterMove.x).toBeGreaterThan(before); // arrow key moved it
    await user.keyboard("{Delete}");
    expect(onChange.mock.calls.at(-1)![0].some((e: { type: string }) => e.type === "button")).toBe(false); // Delete removed it
  });

  it("header elements expose a keyboard/AT label and are focusable", () => {
    setup();
    const btn = screen.getByRole("button", { name: /button header element/i });
    expect(btn).toHaveAttribute("tabindex", "0");
  });

  it("the Add toolbar has a drag handle so it can be moved off the content", () => {
    setup();
    expect(screen.getByLabelText("Move the Add toolbar")).toBeInTheDocument();
  });

  it("adds a navigation menu element via the toolbar", async () => {
    const user = userEvent.setup();
    const { layout, onChange } = setup();
    await user.click(screen.getByLabelText("Add navigation menu"));
    const next = onChange.mock.calls.at(-1)![0];
    expect(next.length).toBe(layout.length + 1);
    expect(next.some((e: { type: string }) => e.type === "nav")).toBe(true);
  });

  it("selecting a button shows inline font +/- that resize it", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await user.click(screen.getByText("Apply now"));
    // inline font size controls
    expect(screen.getByLabelText("Increase font size")).toBeInTheDocument();
    expect(screen.getByLabelText("Decrease font size")).toBeInTheDocument();
    // increasing font size fires onChange with a bigger size
    await user.click(screen.getByLabelText("Increase font size"));
    const next = onChange.mock.calls.at(-1)![0];
    const btn = next.find((e: { type: string }) => e.type === "button");
    expect(btn.fontSize).toBeGreaterThan(14);
  });
});
