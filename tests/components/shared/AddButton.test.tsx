import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddButton from "@/components/shared/AddButton";

describe("AddButton", () => {
  it("renders label text", () => {
    render(<AddButton label="Add Parent" />);
    expect(screen.getByText("Add Parent")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<AddButton label="Add" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders default Plus icon", () => {
    const { container } = render(<AddButton label="Add" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom icon", () => {
    render(
      <AddButton
        label="Upload"
        icon={<span data-testid="custom-icon">^</span>}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
