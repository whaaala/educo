import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatCard from "@/components/shared/chat/ChatCard";
import type { ChatConversation } from "@/components/shared/chat/types";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, unoptimized, alt, ...rest } = props;
    return <img alt={typeof alt === "string" ? alt : ""} {...rest} />;
  },
}));

function makeChat(overrides: Partial<ChatConversation> = {}): ChatConversation {
  return {
    id: "chat-1",
    recipientId: "user-1",
    recipientName: "John Doe",
    recipientEmail: "john@example.com",
    lastMessage: "Hello, how is my child doing?",
    lastMessageTime: "2026-02-27T10:00:00",
    lastMessageFrom: "recipient",
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    ...overrides,
  };
}

const defaultProps = {
  formatTime: (ts: string) => new Date(ts).toLocaleTimeString(),
  isSelected: false,
  onSelect: vi.fn(),
  onView: vi.fn(),
  onDelete: vi.fn(),
};

describe("ChatCard", () => {
  it("renders recipient name", () => {
    render(<ChatCard chat={makeChat()} {...defaultProps} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders recipient email", () => {
    render(<ChatCard chat={makeChat()} {...defaultProps} />);
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders last message", () => {
    render(<ChatCard chat={makeChat()} {...defaultProps} />);
    expect(screen.getByText("Hello, how is my child doing?")).toBeInTheDocument();
  });

  it("shows unread badge when unreadCount > 0", () => {
    render(<ChatCard chat={makeChat({ unreadCount: 3 })} {...defaultProps} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not show unread badge when unreadCount is 0", () => {
    render(<ChatCard chat={makeChat({ unreadCount: 0 })} {...defaultProps} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("shows online indicator when isOnline", () => {
    render(<ChatCard chat={makeChat({ isOnline: true })} {...defaultProps} />);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("does not show online indicator when offline", () => {
    render(<ChatCard chat={makeChat({ isOnline: false })} {...defaultProps} />);
    expect(screen.queryByText("Online")).not.toBeInTheDocument();
  });

  it("shows child name when provided", () => {
    render(
      <ChatCard chat={makeChat({ childName: "Sarah Doe" })} {...defaultProps} />
    );
    expect(screen.getByText("Re: Sarah Doe")).toBeInTheDocument();
  });

  it("calls onView when card is clicked", async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    const chat = makeChat();
    render(<ChatCard chat={chat} {...defaultProps} onView={onView} />);
    await user.click(screen.getByText("John Doe"));
    expect(onView).toHaveBeenCalledWith(chat);
  });

  it("calls onSelect when checkbox is toggled", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ChatCard chat={makeChat()} {...defaultProps} onSelect={onSelect} />);
    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);
    expect(onSelect).toHaveBeenCalledWith("chat-1", true);
  });

  it("renders selected state with checked checkbox", () => {
    render(<ChatCard chat={makeChat()} {...defaultProps} isSelected={true} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("renders formatted time", () => {
    const formatTime = vi.fn().mockReturnValue("10:00 AM");
    render(<ChatCard chat={makeChat()} {...defaultProps} formatTime={formatTime} />);
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    expect(formatTime).toHaveBeenCalledWith("2026-02-27T10:00:00");
  });

  it("renders avatar image when provided", () => {
    render(
      <ChatCard
        chat={makeChat({ recipientAvatar: "/avatar.jpg" })}
        {...defaultProps}
      />
    );
    const img = screen.getByAltText("John Doe");
    expect(img).toBeInTheDocument();
  });
});
