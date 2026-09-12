import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JoinRequestNotification } from "@/components/communication/call-ui/JoinRequestNotification";
import type { JoinRequest } from "@/components/communication/call-ui/JoinRequestNotification";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, unoptimized, alt, ...rest } = props;
    return <img alt={typeof alt === "string" ? alt : ""} {...rest} />;
  },
}));

function makeRequest(overrides: Partial<JoinRequest> = {}): JoinRequest {
  return {
    id: "req-1",
    name: "Alice Smith",
    ...overrides,
  };
}

describe("JoinRequestNotification", () => {
  it("renders participant name", () => {
    render(
      <JoinRequestNotification
        request={makeRequest()}
        onAccept={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });

  it("renders 'Want to join the meet' text", () => {
    render(
      <JoinRequestNotification
        request={makeRequest()}
        onAccept={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(screen.getByText("Want to join the meet")).toBeInTheDocument();
  });

  it("shows location when provided", () => {
    render(
      <JoinRequestNotification
        request={makeRequest({ location: "Lagos, NG" })}
        onAccept={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(screen.getByText("from Lagos, NG")).toBeInTheDocument();
  });

  it("shows initial when no avatar", () => {
    render(
      <JoinRequestNotification
        request={makeRequest()}
        onAccept={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("shows avatar image when provided", () => {
    render(
      <JoinRequestNotification
        request={makeRequest({ avatar: "/alice.jpg" })}
        onAccept={vi.fn()}
        onReject={vi.fn()}
      />
    );
    expect(screen.getByAltText("Alice Smith")).toBeInTheDocument();
  });

  it("calls onAccept with request id when accept button clicked", async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    render(
      <JoinRequestNotification
        request={makeRequest()}
        onAccept={onAccept}
        onReject={vi.fn()}
      />
    );
    const buttons = screen.getAllByRole("button");
    // Accept is the second button (after reject)
    await user.click(buttons[1]);
    expect(onAccept).toHaveBeenCalledWith("req-1");
  });

  it("calls onReject with request id when reject button clicked", async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    render(
      <JoinRequestNotification
        request={makeRequest()}
        onAccept={vi.fn()}
        onReject={onReject}
      />
    );
    const buttons = screen.getAllByRole("button");
    // Reject is the first button
    await user.click(buttons[0]);
    expect(onReject).toHaveBeenCalledWith("req-1");
  });
});
