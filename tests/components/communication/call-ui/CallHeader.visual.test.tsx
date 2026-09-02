import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CallHeader from "@/components/communication/call-ui/CallHeader";

describe("CallHeader — Visual / CSS", () => {
  const defaultProps = {
    title: "Math Class",
    callType: "video" as const,
    duration: 330,
    participantCount: 3,
    onClose: vi.fn(),
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
  };

  describe("container theming", () => {
    it("has theme backgrounds", () => {
      const { container } = render(<CallHeader {...defaultProps} />);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain("bg-white");
      expect(header.className).toContain("dark:bg-[#0f1115]");
    });

    it("has border-b with theme colors", () => {
      const { container } = render(<CallHeader {...defaultProps} />);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain("border-b");
      expect(header.className).toContain("border-gray-200");
      expect(header.className).toContain("dark:border-[#1a1d24]");
    });

    it("has flex layout", () => {
      const { container } = render(<CallHeader {...defaultProps} />);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain("flex");
      expect(header.className).toContain("items-center");
      expect(header.className).toContain("justify-between");
    });

    it("has responsive padding", () => {
      const { container } = render(<CallHeader {...defaultProps} />);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain("px-3");
      expect(header.className).toContain("sm:px-4");
      expect(header.className).toContain("lg:px-6");
    });
  });

  describe("title styling", () => {
    it("has responsive text sizing", () => {
      render(<CallHeader {...defaultProps} />);
      const title = screen.getByText("Math Class");
      expect(title.className).toContain("text-sm");
      expect(title.className).toContain("sm:text-base");
      expect(title.className).toContain("lg:text-lg");
      expect(title.className).toContain("font-bold");
    });

    it("has theme text colors", () => {
      render(<CallHeader {...defaultProps} />);
      const title = screen.getByText("Math Class");
      expect(title.className).toContain("text-ink");
    });

    it("has truncate for overflow", () => {
      render(<CallHeader {...defaultProps} />);
      const title = screen.getByText("Math Class");
      expect(title.className).toContain("truncate");
    });
  });

  describe("duration badge", () => {
    it("has hidden sm:flex responsive visibility", () => {
      const { container } = render(<CallHeader {...defaultProps} />);
      const badge = container.querySelector(".hidden.sm\\:flex");
      expect(badge).not.toBeNull();
      expect(badge!.className).toContain("rounded-full");
      expect(badge!.className).toContain("font-semibold");
    });

    it("has theme backgrounds on badge", () => {
      const { container } = render(<CallHeader {...defaultProps} />);
      const badge = container.querySelector(".hidden.sm\\:flex");
      expect(badge).not.toBeNull();
      expect(badge!.className).toContain("bg-gray-100");
      expect(badge!.className).toContain("dark:bg-[#1a1d24]");
    });
  });

  describe("close button", () => {
    it("has hover and active states", () => {
      const { container } = render(<CallHeader {...defaultProps} />);
      const closeBtn = container.querySelector("button[title='End call']");
      expect(closeBtn).not.toBeNull();
      expect(closeBtn!.className).toContain("rounded-lg");
      expect(closeBtn!.className).toContain("active:scale-95");
      expect(closeBtn!.className).toContain("cursor-pointer");
    });
  });
});
