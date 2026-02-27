import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoadMoreButton from "@/components/shared/LoadMoreButton";

describe("LoadMoreButton", () => {
  it("renders default text", () => {
    render(<LoadMoreButton onClick={vi.fn()} />);
    expect(screen.getByText("Load More")).toBeInTheDocument();
  });

  it("renders custom text", () => {
    render(<LoadMoreButton onClick={vi.fn()} text="Show More Results" />);
    expect(screen.getByText("Show More Results")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<LoadMoreButton onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading text when isLoading", () => {
    render(<LoadMoreButton onClick={vi.fn()} isLoading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("is disabled when isLoading", () => {
    render(<LoadMoreButton onClick={vi.fn()} isLoading />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<LoadMoreButton onClick={vi.fn()} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
