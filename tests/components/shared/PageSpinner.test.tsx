import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageSpinner from "@/components/shared/PageSpinner";

describe("PageSpinner", () => {
  it("renders default loading message", () => {
    render(<PageSpinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<PageSpinner message="Fetching records..." />);
    expect(screen.getByText("Fetching records...")).toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s",
    (size) => {
      render(<PageSpinner size={size} />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    }
  );

  it("renders spinner icon", () => {
    const { container } = render(<PageSpinner />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
