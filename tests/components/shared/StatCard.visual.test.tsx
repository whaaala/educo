import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "@/components/shared/StatCard";
import { Users } from "lucide-react";

describe("StatCard — Visual / CSS", () => {
  describe("container layout", () => {
    it("has rounded-2xl and responsive padding", () => {
      const { container } = render(
        <StatCard icon={Users} label="Students" value={42} color="blue" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("rounded-2xl");
      expect(card.className).toContain("p-3");
      expect(card.className).toContain("sm:p-4");
    });

    it("has flex column layout", () => {
      const { container } = render(
        <StatCard icon={Users} label="Students" value={42} color="blue" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("flex");
      expect(card.className).toContain("flex-col");
      expect(card.className).toContain("justify-between");
    });

    it("has responsive height", () => {
      const { container } = render(
        <StatCard icon={Users} label="Students" value={42} color="blue" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("h-[100px]");
      expect(card.className).toContain("sm:h-[110px]");
    });

    it("has overflow-hidden and group class", () => {
      const { container } = render(
        <StatCard icon={Users} label="Students" value={42} color="blue" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("overflow-hidden");
      expect(card.className).toContain("group");
    });
  });

  describe("blue color variant", () => {
    it("has blue background", () => {
      const { container } = render(
        <StatCard icon={Users} label="Students" value={42} color="blue" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("bg-blue-50/80");
      expect(card.className).toContain("dark:bg-blue-950/30");
    });
  });

  describe("label typography", () => {
    it("label has uppercase tracking-wide", () => {
      render(<StatCard icon={Users} label="Students" value={42} color="blue" />);

      const label = screen.getByText("Students");
      expect(label.className).toContain("uppercase");
      expect(label.className).toContain("tracking-wide");
      expect(label.className).toContain("font-semibold");
    });

    it("label has responsive text size", () => {
      render(<StatCard icon={Users} label="Students" value={42} color="blue" />);

      const label = screen.getByText("Students");
      expect(label.className).toContain("text-[9px]");
      expect(label.className).toContain("sm:text-[10px]");
    });
  });

  describe("value typography", () => {
    it("value has responsive text size", () => {
      render(<StatCard icon={Users} label="Students" value={42} color="blue" />);

      const value = screen.getByText("42");
      expect(value.className).toContain("text-xl");
      expect(value.className).toContain("sm:text-2xl");
      expect(value.className).toContain("font-bold");
    });
  });
});
