import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageCard from "@/components/shared/messages/MessageCard";
import type { AdminMessage } from "@/components/shared/messages/types";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, unoptimized, alt, ...rest } = props;
    return <img alt={typeof alt === "string" ? alt : ""} {...rest} />;
  },
}));

function makeMessage(overrides: Partial<AdminMessage> = {}): AdminMessage {
  return {
    id: "msg-1",
    type: "received",
    senderId: "sender-1",
    senderName: "Jane Parent",
    senderRole: "Parent",
    recipientId: "admin-1",
    recipientName: "Admin User",
    recipientRole: "Admin",
    subject: "Fee Payment Inquiry",
    preview: "I have a question about the outstanding fees for this term.",
    timestamp: "2026-02-27T10:00:00",
    isRead: false,
    hasAttachment: false,
    priority: "normal",
    category: "Fee",
    ...overrides,
  };
}

const defaultProps = {
  formatTime: (ts: string) => new Date(ts).toLocaleTimeString(),
  isSelected: false,
  onSelect: vi.fn(),
  onView: vi.fn(),
  onReply: vi.fn(),
  onDelete: vi.fn(),
};

describe("MessageCard", () => {
  it("renders sender name", () => {
    render(<MessageCard message={makeMessage()} {...defaultProps} />);
    expect(screen.getByText("Jane Parent")).toBeInTheDocument();
  });

  it("renders recipient name", () => {
    render(<MessageCard message={makeMessage()} {...defaultProps} />);
    expect(screen.getByText("To: Admin User")).toBeInTheDocument();
  });

  it("renders subject line", () => {
    render(<MessageCard message={makeMessage()} {...defaultProps} />);
    expect(screen.getByText("Fee Payment Inquiry")).toBeInTheDocument();
  });

  it("renders message preview", () => {
    render(<MessageCard message={makeMessage()} {...defaultProps} />);
    expect(
      screen.getByText("I have a question about the outstanding fees for this term.")
    ).toBeInTheDocument();
  });

  it("renders category badge", () => {
    render(<MessageCard message={makeMessage({ category: "Academic" })} {...defaultProps} />);
    expect(screen.getByText("Academic")).toBeInTheDocument();
  });

  it("shows child name when provided", () => {
    render(
      <MessageCard
        message={makeMessage({ childName: "Tom Parent" })}
        {...defaultProps}
      />
    );
    expect(screen.getByText("Re: Tom Parent")).toBeInTheDocument();
  });

  it("renders checkbox in unchecked state", () => {
    render(<MessageCard message={makeMessage()} {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders checkbox in checked state when selected", () => {
    render(
      <MessageCard message={makeMessage()} {...defaultProps} isSelected={true} />
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onSelect when checkbox is toggled", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <MessageCard message={makeMessage()} {...defaultProps} onSelect={onSelect} />
    );
    await user.click(screen.getByRole("checkbox"));
    expect(onSelect).toHaveBeenCalledWith("msg-1", true);
  });

  it("calls onView when view button is clicked", async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    const message = makeMessage();
    render(<MessageCard message={message} {...defaultProps} onView={onView} />);
    const viewButtons = screen.getAllByRole("button");
    await user.click(viewButtons[0]);
    expect(onView).toHaveBeenCalledWith(message);
  });

  it("calls onReply when reply button is clicked", async () => {
    const user = userEvent.setup();
    const onReply = vi.fn();
    const message = makeMessage();
    render(<MessageCard message={message} {...defaultProps} onReply={onReply} />);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]);
    expect(onReply).toHaveBeenCalledWith(message);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const message = makeMessage();
    render(<MessageCard message={message} {...defaultProps} onDelete={onDelete} />);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[2]);
    expect(onDelete).toHaveBeenCalledWith(message);
  });

  it("renders formatted time", () => {
    const formatTime = vi.fn().mockReturnValue("2:30 PM");
    render(
      <MessageCard message={makeMessage()} {...defaultProps} formatTime={formatTime} />
    );
    expect(screen.getByText("2:30 PM")).toBeInTheDocument();
  });

  it("renders avatar image when provided", () => {
    render(
      <MessageCard
        message={makeMessage({ senderAvatar: "/avatar.jpg" })}
        {...defaultProps}
      />
    );
    expect(screen.getByAltText("Jane Parent")).toBeInTheDocument();
  });

  it.each(["Academic", "Fee", "Event", "General", "Complaint", "Inquiry"] as const)(
    "renders %s category badge",
    (category) => {
      render(
        <MessageCard message={makeMessage({ category })} {...defaultProps} />
      );
      expect(screen.getByText(category)).toBeInTheDocument();
    }
  );
});
