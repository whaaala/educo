import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SecondaryButton from "@/components/shared/SecondaryButton";

describe("SecondaryButton", () => {
  it("renders label text", () => {
    render(<SecondaryButton label="Refresh" />);
    expect(screen.getByText("Refresh")).toBeInTheDocument();
  });

  it("renders children as alternative to label", () => {
    render(<SecondaryButton>Export</SecondaryButton>);
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SecondaryButton label="Click" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<SecondaryButton label="Btn" className="my-class" />);
    expect(screen.getByRole("button")).toHaveClass("my-class");
  });
});
