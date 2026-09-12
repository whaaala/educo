import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FormBadge from "@/components/shared/FormBadge";

describe("FormBadge", () => {
  it("renders label text", () => {
    render(
      <FormBadge
        label="Status"
        icon={<span>icon</span>}
        value="Active"
      />
    );
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders value text when badgeColorClasses are provided", () => {
    render(
      <FormBadge
        label="Status"
        icon={<span>icon</span>}
        value="Active"
        badgeColorClasses={{
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-300",
          icon: "text-green-600",
        }}
      />
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders placeholder when value is set but no badgeColorClasses", () => {
    render(
      <FormBadge
        label="Status"
        icon={<span>icon</span>}
        value="Active"
      />
    );
    // Without badgeColorClasses, the component shows placeholder instead
    expect(screen.getByText("Not set")).toBeInTheDocument();
  });

  it("renders placeholder when value is empty", () => {
    render(
      <FormBadge
        label="Status"
        icon={<span>icon</span>}
        value=""
        placeholder="Not set"
      />
    );
    expect(screen.getByText("Not set")).toBeInTheDocument();
  });

  it("shows required asterisk", () => {
    render(
      <FormBadge
        label="Status"
        icon={<span>icon</span>}
        value=""
        required
      />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(
      <FormBadge
        label="Status"
        icon={<span>icon</span>}
        value=""
        error="Status is required"
      />
    );
    expect(screen.getByText("Status is required")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(
      <FormBadge
        label="Status"
        icon={<span data-testid="badge-icon">icon</span>}
        value="Active"
      />
    );
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
  });
});
