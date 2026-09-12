import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormButton from "@/components/shared/FormButton";

describe("FormButton", () => {
  it("renders children", () => {
    render(<FormButton>Save Changes</FormButton>);
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<FormButton onClick={onClick}>Click</FormButton>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("defaults to type='button'", () => {
    render(<FormButton>Save</FormButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("supports type='submit'", () => {
    render(<FormButton type="submit">Submit</FormButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("is disabled when disabled prop is true", () => {
    render(<FormButton disabled>Disabled</FormButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders icon", () => {
    render(
      <FormButton icon={<span data-testid="icon">+</span>}>
        Add
      </FormButton>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it.each(["primary", "secondary"] as const)(
    "renders with variant=%s",
    (variant) => {
      render(<FormButton variant={variant}>Btn</FormButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    }
  );
});
