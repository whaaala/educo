import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MessageCard from "@/components/shared/messages/MessageCard";
import { AdminMessage } from "@/components/shared/messages/types";

describe("MessageCard — Visual / CSS", () => {
  const mockMessage: AdminMessage = {
    id: "1",
    type: "received",
    senderId: "s1",
    senderName: "Admin",
    senderRole: "Admin",
    recipientId: "r1",
    recipientName: "John Parent",
    recipientRole: "Parent",
    subject: "Welcome",
    preview: "Hello there",
    timestamp: "2024-01-15T10:00:00Z",
    isRead: true,
    hasAttachment: false,
    priority: "normal",
    category: "General",
  };

  const defaultProps = {
    message: mockMessage,
    formatTime: (_t: string) => "10:00 AM",
    isSelected: false,
    onSelect: vi.fn(),
    onView: vi.fn(),
    onReply: vi.fn(),
    onDelete: vi.fn(),
  };

  describe("container theming", () => {
    it("has theme backgrounds", () => {
      const { container } = render(<MessageCard {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("bg-surface");
    });

    it("has rounded-xl with border", () => {
      const { container } = render(<MessageCard {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("rounded-xl");
      expect(card.className).toContain("border");
    });

    it("has shadow-sm hover:shadow-md transition", () => {
      const { container } = render(<MessageCard {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("shadow-sm");
      expect(card.className).toContain("hover:shadow-md");
      expect(card.className).toContain("transition-all");
    });

    it("has overflow-hidden", () => {
      const { container } = render(<MessageCard {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("overflow-hidden");
    });
  });

  describe("header section", () => {
    it("header has border-b with theme colors", () => {
      const { container } = render(<MessageCard {...defaultProps} />);
      const header = container.querySelector(".border-b");
      expect(header).toBeInTheDocument();
      expect(header!.className).toContain("border-gray-100");
      expect(header!.className).toContain("dark:border-gray-700");
    });
  });

  describe("preview text", () => {
    it("preview has subdued text color", () => {
      render(<MessageCard {...defaultProps} />);
      const preview = screen.getByText("Hello there");
      expect(preview.className).toContain("text-xs");
      expect(preview.className).toContain("text-muted");
    });

    it("preview has line-clamp-2", () => {
      render(<MessageCard {...defaultProps} />);
      const preview = screen.getByText("Hello there");
      expect(preview.className).toContain("line-clamp-2");
    });
  });

  describe("selected state", () => {
    it("has blue border and ring when selected", () => {
      const { container } = render(<MessageCard {...defaultProps} isSelected={true} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("border-blue-500");
      expect(card.className).toContain("ring-2");
      expect(card.className).toContain("ring-blue-500/20");
    });
  });

  describe("unread state", () => {
    it("has blue border for unread received messages", () => {
      const unreadMessage = { ...mockMessage, isRead: false };
      const { container } = render(<MessageCard {...defaultProps} message={unreadMessage} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("border-blue-300");
    });
  });

  describe("action buttons", () => {
    it("action buttons have hover states", () => {
      const { container } = render(<MessageCard {...defaultProps} />);
      const actionButtons = container.querySelectorAll("button.rounded-lg");
      expect(actionButtons.length).toBeGreaterThan(0);
    });
  });
});
