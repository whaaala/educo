import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import NameLabel from "@/components/shared/NameLabel";

describe("NameLabel", () => {
  it("renders the name text", () => {
    render(<NameLabel name="John Doe" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<NameLabel name="John" className="extra" />);
    const el = screen.getByText("John");
    expect(el).toHaveClass("extra");
  });

  // Variant rendering
  it.each(["default", "compact", "large"] as const)(
    "renders with variant=%s",
    (variant) => {
      render(<NameLabel name="Test" variant={variant} />);
      expect(screen.getByText("Test")).toBeInTheDocument();
    }
  );
});
