import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import MessageStats from "@/components/shared/messages/MessageStats";

describe("MessageStats", () => {
  const defaultStats = {
    total: 50,
    received: 30,
    sent: 20,
    unread: 5,
    highPriority: 3,
  };

  it("renders total messages stat", () => {
    render(<MessageStats stats={defaultStats} />);
    expect(screen.getByText("Total Messages")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("renders received stat", () => {
    render(<MessageStats stats={defaultStats} />);
    expect(screen.getByText("Received")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("renders sent stat", () => {
    render(<MessageStats stats={defaultStats} />);
    expect(screen.getByText("Sent")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("renders high priority stat", () => {
    render(<MessageStats stats={defaultStats} />);
    expect(screen.getByText("High Priority")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows unread badge when unread > 0", () => {
    render(<MessageStats stats={defaultStats} />);
    expect(screen.getByText("5 Unread")).toBeInTheDocument();
  });

  it("does not show unread badge when unread is 0", () => {
    render(<MessageStats stats={{ ...defaultStats, unread: 0 }} />);
    expect(screen.queryByText("0 Unread")).not.toBeInTheDocument();
  });

  it("renders with zero stats without crashing", () => {
    render(
      <MessageStats
        stats={{ total: 0, received: 0, sent: 0, unread: 0, highPriority: 0 }}
      />
    );
    expect(screen.getByText("Total Messages")).toBeInTheDocument();
  });
});
