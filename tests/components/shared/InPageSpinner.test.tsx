import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import InPageSpinner from "@/components/shared/InPageSpinner";

describe("InPageSpinner", () => {
  it("renders default loading text", () => {
    render(<InPageSpinner />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders default sub text", () => {
    render(<InPageSpinner />);
    expect(screen.getByText("Please wait a moment...")).toBeInTheDocument();
  });

  it("renders custom loading text", () => {
    render(<InPageSpinner loadingText="Processing" />);
    expect(screen.getByText("Processing")).toBeInTheDocument();
  });

  it("renders custom sub text", () => {
    render(<InPageSpinner subText="Almost there..." />);
    expect(screen.getByText("Almost there...")).toBeInTheDocument();
  });
});
