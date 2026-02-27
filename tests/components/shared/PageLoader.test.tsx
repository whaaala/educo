import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageLoader from "@/components/shared/PageLoader";

describe("PageLoader", () => {
  it("renders nothing when isLoading is false", () => {
    const { container } = render(<PageLoader isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders loading text when isLoading is true", () => {
    render(<PageLoader isLoading={true} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders sub text", () => {
    render(<PageLoader isLoading={true} />);
    expect(screen.getByText("Please wait a moment...")).toBeInTheDocument();
  });

  it("renders custom loading text", () => {
    render(<PageLoader isLoading={true} loadingText="Fetching data" />);
    expect(screen.getByText("Fetching data")).toBeInTheDocument();
  });

  it("renders custom sub text", () => {
    render(
      <PageLoader isLoading={true} subText="This may take a while..." />
    );
    expect(screen.getByText("This may take a while...")).toBeInTheDocument();
  });
});
