import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import JoinRequestNotification from "@/components/communication/call-ui/JoinRequestNotification";

describe("JoinRequestNotification — Visual / CSS", () => {
  const defaultProps = {
    request: { id: "1", name: "Jane Doe" },
    onAccept: vi.fn(),
    onReject: vi.fn(),
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
  };

  describe("container styling", () => {
    it("has rounded-full pill shape", () => {
      const { container } = render(<JoinRequestNotification {...defaultProps} />);
      const notification = container.firstChild as HTMLElement;
      expect(notification.className).toContain("rounded-full");
      expect(notification.className).toContain("shadow-xl");
    });

    it("has white bg with dark variant", () => {
      const { container } = render(<JoinRequestNotification {...defaultProps} />);
      const notification = container.firstChild as HTMLElement;
      expect(notification.className).toContain("bg-white");
      expect(notification.className).toContain("dark:bg-[#1a1d24]");
    });

    it("has slide-in animation", () => {
      const { container } = render(<JoinRequestNotification {...defaultProps} />);
      const notification = container.firstChild as HTMLElement;
      expect(notification.className).toContain("animate-in");
      expect(notification.className).toContain("slide-in-from-top-4");
    });

    it("has flex layout with gap", () => {
      const { container } = render(<JoinRequestNotification {...defaultProps} />);
      const notification = container.firstChild as HTMLElement;
      expect(notification.className).toContain("flex");
      expect(notification.className).toContain("items-center");
      expect(notification.className).toContain("gap-3");
    });

    it("has responsive padding", () => {
      const { container } = render(<JoinRequestNotification {...defaultProps} />);
      const notification = container.firstChild as HTMLElement;
      expect(notification.className).toContain("px-3");
      expect(notification.className).toContain("sm:px-4");
    });

    it("has border styling", () => {
      const { container } = render(<JoinRequestNotification {...defaultProps} />);
      const notification = container.firstChild as HTMLElement;
      expect(notification.className).toContain("border");
      expect(notification.className).toContain("border-gray-200");
      expect(notification.className).toContain("dark:border-gray-700");
    });
  });

  describe("name styling", () => {
    it("name has font-semibold with theme colors", () => {
      render(<JoinRequestNotification {...defaultProps} />);
      const name = screen.getByText("Jane Doe");
      expect(name.className).toContain("font-semibold");
      expect(name.className).toContain("text-gray-900");
      expect(name.className).toContain("dark:text-white");
    });

    it("name has responsive text sizing", () => {
      render(<JoinRequestNotification {...defaultProps} />);
      const name = screen.getByText("Jane Doe");
      expect(name.className).toContain("text-sm");
      expect(name.className).toContain("sm:text-base");
    });

    it("name has truncate for overflow", () => {
      render(<JoinRequestNotification {...defaultProps} />);
      const name = screen.getByText("Jane Doe");
      expect(name.className).toContain("truncate");
    });
  });

  describe("subtitle text", () => {
    it("shows 'Want to join the meet' with subdued styling", () => {
      render(<JoinRequestNotification {...defaultProps} />);
      const subtitle = screen.getByText("Want to join the meet");
      expect(subtitle.className).toContain("text-xs");
      expect(subtitle.className).toContain("sm:text-sm");
      expect(subtitle.className).toContain("text-gray-600");
      expect(subtitle.className).toContain("dark:text-gray-400");
    });
  });

  describe("action buttons", () => {
    it("reject button has red styling", () => {
      const { container } = render(<JoinRequestNotification {...defaultProps} />);
      const rejectBtn = container.querySelector(".bg-red-100");
      expect(rejectBtn).toBeInTheDocument();
      expect(rejectBtn!.className).toContain("rounded-full");
      expect(rejectBtn!.className).toContain("text-red-600");
    });

    it("accept button has rounded-full shape", () => {
      const { container } = render(<JoinRequestNotification {...defaultProps} />);
      const buttons = container.querySelectorAll("button.rounded-full");
      // Both accept and reject should be rounded-full
      expect(buttons.length).toBe(2);
    });
  });
});
