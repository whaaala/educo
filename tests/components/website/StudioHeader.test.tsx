import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StudioHeader from "@/components/website/StudioHeader";
import { ThemeProvider } from "@/contexts/ThemeContext";

function renderHeader(props: Partial<React.ComponentProps<typeof StudioHeader>> = {}) {
  return render(
    <ThemeProvider>
      <StudioHeader schoolName="Greenfield Academy" {...props} />
    </ThemeProvider>,
  );
}

describe("StudioHeader", () => {
  it("shows the school name, the Website Builder label, and a theme switcher", () => {
    renderHeader();
    expect(screen.getByText("Greenfield Academy")).toBeInTheDocument();
    expect(screen.getByText("Website Builder")).toBeInTheDocument();
    expect(screen.getByLabelText("Change theme")).toBeInTheDocument();
  });

  it("renders the school logo when a logoUrl is provided", () => {
    renderHeader({ logoUrl: "/logo.png" });
    expect(screen.getByAltText("Greenfield Academy logo")).toBeInTheDocument();
  });

  it("falls back to an initial mark when there is no logo", () => {
    renderHeader({ schoolName: "Zenith School" });
    expect(screen.queryByAltText(/logo/)).not.toBeInTheDocument();
    expect(screen.getByText("Z")).toBeInTheDocument();
  });

  it("links back to the app", () => {
    renderHeader();
    const link = screen.getByText("Back to app").closest("a");
    expect(link).toHaveAttribute("href", "/");
  });
});
