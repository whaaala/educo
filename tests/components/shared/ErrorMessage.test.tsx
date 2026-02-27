import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "@/components/shared/ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error text", () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders nothing when message is empty string", () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container.firstChild).toBeNull();
  });

  it("has alert icon", () => {
    const { container } = render(
      <ErrorMessage message="Error" />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <ErrorMessage message="Error" className="mt-4" />
    );
    const el = screen.getByText("Error").closest("div");
    expect(el).toHaveClass("mt-4");
  });

  it("renders ReactNode message", () => {
    render(
      <ErrorMessage
        message={<span data-testid="custom">Custom error</span>}
      />
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });
});
