import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "@/components/shared/StatCard";
import { Users } from "lucide-react";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(
      <StatCard icon={Users} label="Total Students" value={250} color="blue" />
    );
    expect(screen.getByText("Total Students")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("renders string value", () => {
    render(
      <StatCard icon={Users} label="Status" value="Active" color="green" />
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <StatCard
        icon={Users}
        label="Students"
        value={100}
        color="blue"
        subtitle="+5 this week"
      />
    );
    expect(screen.getByText("+5 this week")).toBeInTheDocument();
  });

  it("renders badge when provided", () => {
    render(
      <StatCard
        icon={Users}
        label="Students"
        value={100}
        color="blue"
        badge={<span data-testid="badge">New</span>}
      />
    );
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  it("renders currency symbol when provided", () => {
    render(
      <StatCard
        icon={Users}
        label="Revenue"
        value="500,000"
        color="green"
        currencySymbol="₦"
      />
    );
    expect(screen.getByText("₦")).toBeInTheDocument();
  });

  it("accepts href prop without crashing", () => {
    render(
      <StatCard
        icon={Users}
        label="Students"
        value={100}
        color="blue"
        href="/students"
      />
    );
    // href prop is accepted but not currently rendered as a link
    expect(screen.getByText("Students")).toBeInTheDocument();
  });

  // Color variants
  it.each([
    "blue",
    "green",
    "red",
    "purple",
    "orange",
    "cyan",
    "amber",
    "indigo",
  ] as const)("renders with color=%s", (color) => {
    render(
      <StatCard icon={Users} label="Test" value={1} color={color} />
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
