import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CallConnecting from "@/components/communication/CallConnecting";

describe("CallConnecting", () => {
  it("renders 'Calling...' for voice calls", () => {
    render(<CallConnecting callType="voice" />);
    expect(screen.getByText("Calling...")).toBeInTheDocument();
  });

  it("renders 'Connecting to call...' for video calls", () => {
    render(<CallConnecting callType="video" />);
    expect(screen.getByText("Connecting to call...")).toBeInTheDocument();
  });

  it("shows recipient name for voice calls", () => {
    render(<CallConnecting callType="voice" recipientName="John Doe" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("shows 'Setting up your session' for video calls", () => {
    render(<CallConnecting callType="video" />);
    expect(screen.getByText("Setting up your session")).toBeInTheDocument();
  });

  it("renders quality label when provided", () => {
    render(<CallConnecting callType="video" qualityLabel="Full HD 1080p" />);
    expect(screen.getByText("Full HD 1080p")).toBeInTheDocument();
  });

  it("renders 'Voice Call' badge for voice calls without quality label", () => {
    render(<CallConnecting callType="voice" />);
    expect(screen.getByText("Voice Call")).toBeInTheDocument();
  });

  it("renders 'Video Call' badge for video calls without quality label", () => {
    render(<CallConnecting callType="video" />);
    expect(screen.getByText("Video Call")).toBeInTheDocument();
  });

  it("renders tenant name when provided", () => {
    render(<CallConnecting callType="video" tenantName="Educo School" />);
    expect(screen.getByText("Powered by Educo School")).toBeInTheDocument();
  });

  it("does not render tenant name when not provided", () => {
    render(<CallConnecting callType="video" />);
    expect(screen.queryByText(/Powered by/)).not.toBeInTheDocument();
  });

  it("shows recipient initial for voice call without avatar", () => {
    render(<CallConnecting callType="voice" recipientName="Jane" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("shows recipient avatar for voice call when provided", () => {
    render(
      <CallConnecting
        callType="voice"
        recipientName="Jane"
        recipientAvatar="/avatar.jpg"
      />
    );
    const img = screen.getByAltText("Jane");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/avatar.jpg");
  });
});
