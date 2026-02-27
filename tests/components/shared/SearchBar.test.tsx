import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "@/components/shared/SearchBar";

describe("SearchBar", () => {
  it("renders with default placeholder", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(
      <SearchBar value="" onChange={vi.fn()} placeholder="Find parents..." />
    );
    expect(screen.getByPlaceholderText("Find parents...")).toBeInTheDocument();
  });

  it("displays the current value", () => {
    render(<SearchBar value="test query" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("test query")).toBeInTheDocument();
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} debounce={0} />);
    const input = screen.getByRole("searchbox") || screen.getByRole("textbox");
    await user.type(input, "hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows clear button when value is present", () => {
    render(<SearchBar value="test" onChange={vi.fn()} />);
    // Clear button should be visible
    const buttons = screen.queryAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("clears value when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} />);
    const clearBtn = screen.getByRole("button");
    await user.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("applies custom className", () => {
    const { container } = render(
      <SearchBar value="" onChange={vi.fn()} className="w-full" />
    );
    expect(container.firstChild).toHaveClass("w-full");
  });

  // Size variants
  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s",
    (size) => {
      render(<SearchBar value="" onChange={vi.fn()} size={size} />);
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    }
  );
});
