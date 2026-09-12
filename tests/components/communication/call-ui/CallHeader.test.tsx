import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CallHeader } from "@/components/communication/call-ui/CallHeader";

const defaultProps = {
  title: "Team Meeting",
  callType: "video" as const,
  duration: 125,
  participantCount: 3,
  onClose: vi.fn(),
};

describe("CallHeader", () => {
  it("renders call title", () => {
    render(<CallHeader {...defaultProps} />);
    expect(screen.getByText("Team Meeting")).toBeInTheDocument();
  });

  it("formats duration as MM:SS", () => {
    render(<CallHeader {...defaultProps} duration={125} />);
    expect(screen.getByText("02:05")).toBeInTheDocument();
  });

  it("formats duration as HH:MM:SS for long calls", () => {
    render(<CallHeader {...defaultProps} duration={3661} />);
    expect(screen.getByText("1:01:01")).toBeInTheDocument();
  });

  it("shows recording indicator when isRecording", () => {
    const { container } = render(
      <CallHeader {...defaultProps} isRecording={true} />
    );
    // Recording indicator is a red dot with animate-pulse
    const dot = container.querySelector(".animate-pulse");
    expect(dot).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CallHeader {...defaultProps} onClose={onClose} />);
    // Close button has title "End call"
    await user.click(screen.getByTitle("End call"));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows 'End Call' in dropdown menu", async () => {
    const user = userEvent.setup();
    render(<CallHeader {...defaultProps} onSettings={vi.fn()} />);
    // Click the more menu button
    const moreButtons = screen.getAllByRole("button");
    const moreButton = moreButtons[moreButtons.length - 1];
    await user.click(moreButton);
    expect(screen.getByText("End Call")).toBeInTheDocument();
  });

  it("shows Settings in dropdown when onSettings provided", async () => {
    const user = userEvent.setup();
    render(<CallHeader {...defaultProps} onSettings={vi.fn()} />);
    const moreButtons = screen.getAllByRole("button");
    const moreButton = moreButtons[moreButtons.length - 1];
    await user.click(moreButton);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("shows Copy Room ID in dropdown when onCopyRoomId provided", async () => {
    const user = userEvent.setup();
    render(<CallHeader {...defaultProps} onCopyRoomId={vi.fn()} />);
    const moreButtons = screen.getAllByRole("button");
    const moreButton = moreButtons[moreButtons.length - 1];
    await user.click(moreButton);
    expect(screen.getByText("Copy Room ID")).toBeInTheDocument();
  });

  it("shows Add Participant in dropdown when onAddParticipant provided", async () => {
    const user = userEvent.setup();
    render(<CallHeader {...defaultProps} onAddParticipant={vi.fn()} />);
    const moreButtons = screen.getAllByRole("button");
    const moreButton = moreButtons[moreButtons.length - 1];
    await user.click(moreButton);
    expect(screen.getByText("Add Participant")).toBeInTheDocument();
  });
});
