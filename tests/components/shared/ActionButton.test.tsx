import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActionButton from "@/components/shared/ActionButton";

describe("ActionButton", () => {
  it("renders children text", () => {
    render(<ActionButton>Export</ActionButton>);
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("renders label prop as alias for children", () => {
    render(<ActionButton label="Download" />);
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ActionButton onClick={onClick}>Click</ActionButton>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<ActionButton disabled>Disabled</ActionButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("defaults to type='button'", () => {
    render(<ActionButton>Btn</ActionButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it.each(["primary", "secondary", "outline", "ghost", "danger"] as const)(
    "renders with variant=%s",
    (variant) => {
      render(<ActionButton variant={variant}>V</ActionButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    }
  );

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s",
    (size) => {
      render(<ActionButton size={size}>S</ActionButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    }
  );

  it.each(["blue", "emerald", "purple", "amber", "red", "gray"] as const)(
    "renders with color=%s",
    (color) => {
      render(<ActionButton color={color}>C</ActionButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    }
  );
});
