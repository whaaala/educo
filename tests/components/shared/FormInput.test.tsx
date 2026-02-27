import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "@/components/shared/FormInput";

describe("FormInput", () => {
  it("renders with label", () => {
    render(
      <FormInput label="Full Name" value="" onChange={vi.fn()} />
    );
    expect(screen.getByText("Full Name")).toBeInTheDocument();
  });

  it("renders with value", () => {
    render(
      <FormInput label="Name" value="John" onChange={vi.fn()} />
    );
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(
      <FormInput
        label="Name"
        value=""
        onChange={vi.fn()}
        placeholder="Enter name"
      />
    );
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FormInput label="Name" value="" onChange={onChange} />
    );
    const input = screen.getByRole("textbox");
    await user.type(input, "J");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows required asterisk when required", () => {
    render(
      <FormInput label="Email" value="" onChange={vi.fn()} required />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders with disabled state", () => {
    render(
      <FormInput label="Name" value="John" onChange={vi.fn()} disabled />
    );
    const input = screen.getByDisplayValue("John");
    expect(input).toBeDisabled();
  });

  it("shows error message when error prop is set", () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={vi.fn()}
        error="Email is required"
      />
    );
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("accepts helpText prop without crashing", () => {
    render(
      <FormInput
        label="Name"
        value=""
        onChange={vi.fn()}
        helpText="Enter your full name"
      />
    );
    // helpText prop is accepted in the interface but not currently rendered
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  // Type variants
  it.each(["text", "email", "tel"] as const)(
    "renders input type=%s",
    (type) => {
      render(
        <FormInput label="Field" value="" onChange={vi.fn()} type={type} />
      );
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    }
  );

  it("renders number input", () => {
    render(
      <FormInput
        label="Age"
        value="25"
        onChange={vi.fn()}
        type="number"
        min={0}
        max={120}
      />
    );
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <FormInput
        label="Name"
        value=""
        onChange={vi.fn()}
        icon={<span data-testid="icon">icon</span>}
      />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
