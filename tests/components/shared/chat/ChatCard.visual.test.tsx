import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatCard from "@/components/shared/chat/ChatCard";
import { ChatConversation } from "@/components/shared/chat/types";

describe("ChatCard — Visual / CSS", () => {
  const mockChat: ChatConversation = {
    id: "1",
    recipientId: "r1",
    recipientName: "Jane",
    recipientEmail: "jane@example.com",
    lastMessage: "Hello",
    lastMessageTime: "2024-01-15T10:00:00Z",
    lastMessageFrom: "recipient",
    unreadCount: 0,
    isOnline: true,
    isPinned: false,
  };

  const defaultProps = {
    chat: mockChat,
    formatTime: (t: string) => "10:00 AM",
    isSelected: false,
    onSelect: vi.fn(),
    onView: vi.fn(),
    onDelete: vi.fn(),
  };

  describe("container theming", () => {
    it("has theme backgrounds", () => {
      const { container } = render(<ChatCard {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("bg-white");
      expect(card.className).toContain("dark:bg-[#1a1d24]");
    });

    it("has rounded-xl border shadow", () => {
      const { container } = render(<ChatCard {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("rounded-xl");
      expect(card.className).toContain("border");
      expect(card.className).toContain("shadow-sm");
      expect(card.className).toContain("hover:shadow-md");
    });

    it("has cursor-pointer", () => {
      const { container } = render(<ChatCard {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("cursor-pointer");
    });

    it("has overflow-hidden", () => {
      const { container } = render(<ChatCard {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("overflow-hidden");
    });

    it("has transition-all for smooth hover", () => {
      const { container } = render(<ChatCard {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("transition-all");
    });
  });

  describe("unread badge", () => {
    it("has blue pill styling when unread", () => {
      const unreadChat = { ...mockChat, unreadCount: 3 };
      const { container } = render(<ChatCard {...defaultProps} chat={unreadChat} />);
      const badge = container.querySelector(".bg-blue-500");
      expect(badge).toBeInTheDocument();
      expect(badge!.className).toContain("rounded-full");
      expect(badge!.className).toContain("text-white");
      expect(badge!.className).toContain("text-xs");
      expect(badge!.className).toContain("font-bold");
    });

    it("does not show unread badge when count is 0", () => {
      const { container } = render(<ChatCard {...defaultProps} />);
      const badge = container.querySelector(".bg-blue-500.rounded-full.text-white.text-xs.font-bold");
      expect(badge).toBeNull();
    });
  });

  describe("online indicator", () => {
    it("has green indicator when online", () => {
      const { container } = render(<ChatCard {...defaultProps} />);
      const indicator = container.querySelector(".bg-green-500.rounded-full");
      expect(indicator).toBeInTheDocument();
    });

    it("does not show indicator when offline", () => {
      const offlineChat = { ...mockChat, isOnline: false };
      const { container } = render(<ChatCard {...defaultProps} chat={offlineChat} />);
      const indicator = container.querySelector(".bg-green-500.rounded-full");
      expect(indicator).toBeNull();
    });
  });

  describe("selected state", () => {
    it("has blue border and ring when selected", () => {
      const { container } = render(<ChatCard {...defaultProps} isSelected={true} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("border-blue-500");
      expect(card.className).toContain("ring-2");
      expect(card.className).toContain("ring-blue-500/20");
    });
  });

  describe("header section", () => {
    it("header has border-b with theme colors", () => {
      const { container } = render(<ChatCard {...defaultProps} />);
      const header = container.querySelector(".border-b");
      expect(header).toBeInTheDocument();
      expect(header!.className).toContain("border-gray-100");
      expect(header!.className).toContain("dark:border-gray-700");
    });
  });
});
