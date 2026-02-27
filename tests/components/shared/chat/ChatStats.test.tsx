import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatStats from "@/components/shared/chat/ChatStats";

describe("ChatStats", () => {
  const defaultStats = {
    total: 25,
    active: 8,
    unread: 3,
    totalUnreadMessages: 12,
  };

  it("renders total chats stat", () => {
    render(<ChatStats stats={defaultStats} />);
    expect(screen.getByText("Total Chats")).toBeInTheDocument();
    // "25" appears twice (Total Chats and Recipients both use stats.total)
    expect(screen.getAllByText("25")).toHaveLength(2);
  });

  it("renders active now stat", () => {
    render(<ChatStats stats={defaultStats} />);
    expect(screen.getByText("Active Now")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders unread chats stat", () => {
    render(<ChatStats stats={defaultStats} />);
    expect(screen.getByText("Unread Chats")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders recipient label stat with default label", () => {
    render(<ChatStats stats={defaultStats} />);
    expect(screen.getByText("Recipients")).toBeInTheDocument();
  });

  it("renders custom recipient label", () => {
    render(<ChatStats stats={defaultStats} recipientLabel="Parents" />);
    expect(screen.getByText("Parents")).toBeInTheDocument();
  });

  it("shows online badge for active stat", () => {
    render(<ChatStats stats={defaultStats} />);
    expect(screen.getByText("8 Online")).toBeInTheDocument();
  });

  it("shows unread messages badge when > 0", () => {
    render(<ChatStats stats={defaultStats} />);
    expect(screen.getByText("12 messages")).toBeInTheDocument();
  });

  it("does not show unread messages badge when 0", () => {
    render(
      <ChatStats stats={{ ...defaultStats, totalUnreadMessages: 0 }} />
    );
    expect(screen.queryByText("0 messages")).not.toBeInTheDocument();
  });

  it("renders with zero stats without crashing", () => {
    render(
      <ChatStats
        stats={{ total: 0, active: 0, unread: 0, totalUnreadMessages: 0 }}
      />
    );
    expect(screen.getByText("Total Chats")).toBeInTheDocument();
  });
});
