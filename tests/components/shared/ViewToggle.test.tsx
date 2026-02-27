import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewToggle from "@/components/shared/ViewToggle";

describe("ViewToggle", () => {
  it("renders grid and list buttons", () => {
    render(
      <ViewToggle viewMode="grid" onViewModeChange={vi.fn()} />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("calls onViewModeChange with 'list' when list button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ViewToggle viewMode="grid" onViewModeChange={onChange} />
    );
    await user.click(screen.getByLabelText("List view"));
    expect(onChange).toHaveBeenCalledWith("list");
  });

  it("calls onViewModeChange with 'grid' when grid button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ViewToggle viewMode="list" onViewModeChange={onChange} />
    );
    await user.click(screen.getByLabelText("Grid view"));
    expect(onChange).toHaveBeenCalledWith("grid");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ViewToggle
        viewMode="grid"
        onViewModeChange={vi.fn()}
        className="my-class"
      />
    );
    expect(container.firstChild).toHaveClass("my-class");
  });
});
