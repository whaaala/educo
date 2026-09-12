import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AttendanceStatusBadge from "@/components/shared/AttendanceStatusBadge";

describe("AttendanceStatusBadge — Visual / CSS", () => {
  describe("present status", () => {
    it("has green background with white text", () => {
      const { container } = render(
        <AttendanceStatusBadge type="present" label="Present" />
      );
      const badge = container.querySelector(".rounded-full")!;
      expect(badge.className).toContain("bg-green-500");
      expect(badge.className).toContain("text-white");
    });
  });

  describe("absent status", () => {
    it("has red background with white text", () => {
      const { container } = render(
        <AttendanceStatusBadge type="absent" label="Absent" />
      );
      const badge = container.querySelector(".rounded-full")!;
      expect(badge.className).toContain("bg-red-500");
      expect(badge.className).toContain("text-white");
    });
  });

  describe("late status", () => {
    it("has cyan background", () => {
      const { container } = render(
        <AttendanceStatusBadge type="late" label="Late" />
      );
      const badge = container.querySelector(".rounded-full")!;
      expect(badge.className).toContain("bg-cyan-500");
    });
  });

  describe("not-attended status", () => {
    it("has gray background with theme colors", () => {
      const { container } = render(
        <AttendanceStatusBadge type="not-attended" label="Pending" />
      );
      const badge = container.querySelector(".rounded-full")!;
      expect(badge.className).toContain("bg-gray-200");
      expect(badge.className).toContain("dark:bg-[#22262e]");
    });
  });

  describe("size variants", () => {
    it("sm has w-6 h-6 with responsive sm:w-7 sm:h-7", () => {
      const { container } = render(
        <AttendanceStatusBadge type="present" label="P" size="sm" />
      );
      const badge = container.querySelector(".rounded-full")!;
      expect(badge.className).toContain("w-6");
      expect(badge.className).toContain("h-6");
      expect(badge.className).toContain("sm:w-7");
      expect(badge.className).toContain("sm:h-7");
    });

    it("md has w-7 h-7 with responsive sm:w-8 sm:h-8", () => {
      const { container } = render(
        <AttendanceStatusBadge type="present" label="P" size="md" />
      );
      const badge = container.querySelector(".rounded-full")!;
      expect(badge.className).toContain("w-7");
      expect(badge.className).toContain("h-7");
      expect(badge.className).toContain("sm:w-8");
      expect(badge.className).toContain("sm:h-8");
    });

    it("lg has w-8 h-8 with responsive sm:w-9 sm:h-9", () => {
      const { container } = render(
        <AttendanceStatusBadge type="present" label="P" size="lg" />
      );
      const badge = container.querySelector(".rounded-full")!;
      expect(badge.className).toContain("w-8");
      expect(badge.className).toContain("h-8");
      expect(badge.className).toContain("sm:w-9");
      expect(badge.className).toContain("sm:h-9");
    });
  });

  describe("label typography", () => {
    it("label has theme text colors", () => {
      render(<AttendanceStatusBadge type="present" label="Present" />);
      const label = screen.getByText("Present");
      expect(label.className).toContain("text-gray-700");
      expect(label.className).toContain("dark:text-gray-300");
    });

    it("label has responsive font sizes for md", () => {
      render(<AttendanceStatusBadge type="present" label="Present" size="md" />);
      const label = screen.getByText("Present");
      expect(label.className).toContain("text-xs");
      expect(label.className).toContain("sm:text-sm");
    });
  });
});
