import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHeader from "@/components/shared/PageHeader";

describe("PageHeader", () => {
  it("renders title", () => {
    render(
      <PageHeader
        title="Parent Management"
        breadcrumbs={[{ label: "Home" }, { label: "Parents", isActive: true }]}
      />
    );
    expect(screen.getByText("Parent Management")).toBeInTheDocument();
  });

  it("renders breadcrumbs", () => {
    render(
      <PageHeader
        title="Parent Management"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Parents", isActive: true },
        ]}
      />
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Parents")).toBeInTheDocument();
  });

  it("renders breadcrumb links with href", () => {
    render(
      <PageHeader
        title="Parent Management"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Parents", isActive: true },
        ]}
      />
    );
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders subtitle when provided", () => {
    render(
      <PageHeader
        title="Parents"
        breadcrumbs={[{ label: "Home" }]}
        subtitle="Manage all parent records"
      />
    );
    expect(screen.getByText("Manage all parent records")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <PageHeader
        title="Parents"
        breadcrumbs={[{ label: "Home" }]}
        description="View and edit parent details"
      />
    );
    expect(
      screen.getByText("View and edit parent details")
    ).toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    render(
      <PageHeader
        title="Parents"
        breadcrumbs={[{ label: "Home" }]}
        actions={<button>Add Parent</button>}
      />
    );
    expect(
      screen.getByRole("button", { name: "Add Parent" })
    ).toBeInTheDocument();
  });

  it("accepts icon prop without crashing", () => {
    render(
      <PageHeader
        title="Parents"
        breadcrumbs={[{ label: "Home" }]}
        icon={<span data-testid="icon">icon</span>}
      />
    );
    // icon prop is accepted but not currently rendered by the component
    expect(screen.getByText("Parents")).toBeInTheDocument();
  });
});
