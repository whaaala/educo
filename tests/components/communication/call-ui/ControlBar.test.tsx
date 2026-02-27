import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ControlBar } from "@/components/communication/call-ui/ControlBar";

const defaultProps = {
  isMuted: false,
  isVideoOff: false,
  isScreenSharing: false,
  isFullscreen: false,
  showChat: false,
  showParticipants: false,
  participantCount: 3,
  callType: "video" as const,
  onToggleMute: vi.fn(),
  onToggleVideo: vi.fn(),
  onToggleFullscreen: vi.fn(),
  onToggleChat: vi.fn(),
  onToggleParticipants: vi.fn(),
  onEndCall: vi.fn(),
};

describe("ControlBar", () => {
  it("renders mute button with 'Mute' label", () => {
    render(<ControlBar {...defaultProps} />);
    expect(screen.getByTitle("Turn off microphone")).toBeInTheDocument();
  });

  it("renders unmute label when muted", () => {
    render(<ControlBar {...defaultProps} isMuted={true} />);
    expect(screen.getByTitle("Turn on microphone")).toBeInTheDocument();
  });

  it("renders video toggle button", () => {
    render(<ControlBar {...defaultProps} />);
    expect(screen.getByTitle("Turn off camera")).toBeInTheDocument();
  });

  it("renders camera on label when video is off", () => {
    render(<ControlBar {...defaultProps} isVideoOff={true} />);
    expect(screen.getByTitle("Turn on camera")).toBeInTheDocument();
  });

  it("calls onToggleMute when mute button clicked", async () => {
    const user = userEvent.setup();
    const onToggleMute = vi.fn();
    render(<ControlBar {...defaultProps} onToggleMute={onToggleMute} />);
    await user.click(screen.getByTitle("Turn off microphone"));
    expect(onToggleMute).toHaveBeenCalled();
  });

  it("calls onToggleVideo when video button clicked", async () => {
    const user = userEvent.setup();
    const onToggleVideo = vi.fn();
    render(<ControlBar {...defaultProps} onToggleVideo={onToggleVideo} />);
    await user.click(screen.getByTitle("Turn off camera"));
    expect(onToggleVideo).toHaveBeenCalled();
  });

  it("calls onEndCall when end button clicked", async () => {
    const user = userEvent.setup();
    const onEndCall = vi.fn();
    render(<ControlBar {...defaultProps} onEndCall={onEndCall} />);
    await user.click(screen.getByTitle("End call"));
    expect(onEndCall).toHaveBeenCalled();
  });

  it("calls onToggleChat when chat button clicked", async () => {
    const user = userEvent.setup();
    const onToggleChat = vi.fn();
    render(<ControlBar {...defaultProps} onToggleChat={onToggleChat} />);
    await user.click(screen.getByTitle("Toggle chat panel"));
    expect(onToggleChat).toHaveBeenCalled();
  });

  it("calls onToggleParticipants when participants button clicked", async () => {
    const user = userEvent.setup();
    const onToggleParticipants = vi.fn();
    render(
      <ControlBar
        {...defaultProps}
        onToggleParticipants={onToggleParticipants}
      />
    );
    await user.click(screen.getByTitle("Toggle participants panel"));
    expect(onToggleParticipants).toHaveBeenCalled();
  });

  it("renders screen share button when handler provided", () => {
    render(
      <ControlBar {...defaultProps} onToggleScreenShare={vi.fn()} />
    );
    expect(screen.getByTitle("Share your screen")).toBeInTheDocument();
  });

  it("renders recording button when handler provided", () => {
    render(
      <ControlBar {...defaultProps} onToggleRecording={vi.fn()} />
    );
    expect(screen.getByTitle("Start recording")).toBeInTheDocument();
  });

  it("renders settings button when handler provided", () => {
    render(<ControlBar {...defaultProps} onSettings={vi.fn()} />);
    expect(screen.getByTitle("Open settings")).toBeInTheDocument();
  });

  it("renders layout button when handler provided", () => {
    render(<ControlBar {...defaultProps} onChangeLayout={vi.fn()} />);
    expect(screen.getByTitle("Change layout")).toBeInTheDocument();
  });

  it("renders whiteboard button when handler provided", () => {
    render(<ControlBar {...defaultProps} onToggleWhiteboard={vi.fn()} />);
    expect(screen.getByTitle("Open whiteboard")).toBeInTheDocument();
  });

  it("renders reaction button when handler provided", () => {
    render(<ControlBar {...defaultProps} onReaction={vi.fn()} />);
    expect(screen.getByTitle("Send a reaction")).toBeInTheDocument();
  });
});
