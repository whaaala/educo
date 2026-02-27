import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormTextarea from "@/components/shared/FormTextarea";

describe("FormTextarea", () => {
  it("renders with label", () => {
    render(
      <FormTextarea label="Description" value="" onChange={vi.fn()} />
    );
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders textarea with value", () => {
    render(
      <FormTextarea label="Notes" value="Some notes" onChange={vi.fn()} />
    );
    expect(screen.getByDisplayValue("Some notes")).toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(
      <FormTextarea
        label="Notes"
        value=""
        onChange={vi.fn()}
        placeholder="Type here..."
      />
    );
    expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument();
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FormTextarea label="Notes" value="" onChange={onChange} />
    );
    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows required asterisk", () => {
    render(
      <FormTextarea label="Notes" value="" onChange={vi.fn()} required />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows optional label", () => {
    render(
      <FormTextarea label="Notes" value="" onChange={vi.fn()} optional />
    );
    expect(screen.getByText("(Optional)")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(
      <FormTextarea
        label="Notes"
        value=""
        onChange={vi.fn()}
        error="Notes are required"
      />
    );
    expect(screen.getByText("Notes are required")).toBeInTheDocument();
  });

  it("shows character count when enabled", () => {
    render(
      <FormTextarea
        label="Bio"
        value="Hello"
        onChange={vi.fn()}
        showCharacterCount
        maxLength={100}
      />
    );
    expect(screen.getByText("5/100")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <FormTextarea
        label="Notes"
        value=""
        onChange={vi.fn()}
        icon={<span data-testid="icon">icon</span>}
      />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
