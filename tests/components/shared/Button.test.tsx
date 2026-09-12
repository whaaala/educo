import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "@/components/shared/Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders with disabled attribute", () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("defaults to type='button'", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("supports type='submit'", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("shows loading spinner when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    // Loading state renders a span with animate-spin class
    expect(button.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders with icon", () => {
    const icon = <span data-testid="test-icon">icon</span>;
    render(<Button icon={icon}>With Icon</Button>);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Styled</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("accepts title prop without crashing", () => {
    render(<Button title="My tooltip">Hover me</Button>);
    // title prop is accepted but not forwarded to the button element
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // Variant rendering tests
  it.each(["primary", "secondary", "outline", "ghost", "danger"] as const)(
    "renders with variant=%s without crashing",
    (variant) => {
      render(<Button variant={variant}>Variant</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    }
  );

  // Size rendering tests
  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s without crashing",
    (size) => {
      render(<Button size={size}>Size</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    }
  );
});
