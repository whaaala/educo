import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoTile } from "@/components/communication/call-ui/VideoTile";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, unoptimized, ...rest } = props;
    return <img {...rest} />;
  },
}));

describe("VideoTile", () => {
  it("renders participant name", () => {
    render(<VideoTile name="John Doe" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("shows 'You' for local participant", () => {
    render(<VideoTile name="John Doe" isLocal={true} />);
    expect(screen.getByText("You")).toBeInTheDocument();
  });

  it("shows initial when video is off and no avatar", () => {
    render(<VideoTile name="Jane Doe" isVideoOff={true} />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("shows avatar when video is off and avatar provided", () => {
    render(
      <VideoTile name="Jane Doe" isVideoOff={true} avatar="/avatar.jpg" />
    );
    expect(screen.getByAltText("Jane Doe")).toBeInTheDocument();
  });

  it("renders video element when video is on", () => {
    const { container } = render(<VideoTile name="John" />);
    expect(container.querySelector("video")).toBeInTheDocument();
  });

  it("does not render video element when video is off", () => {
    const { container } = render(<VideoTile name="John" isVideoOff={true} />);
    expect(container.querySelector("video")).not.toBeInTheDocument();
  });

  it("hides name when showName is false", () => {
    render(<VideoTile name="John Doe" showName={false} />);
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("shows muted indicator when isMuted", () => {
    const { container } = render(<VideoTile name="John" isMuted={true} />);
    // MicOff icon is inside a red background span
    const mutedIndicator = container.querySelector(".bg-red-500\\/90");
    expect(mutedIndicator).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<VideoTile name="John" onClick={onClick} />);
    await user.click(screen.getByText("John"));
    expect(onClick).toHaveBeenCalled();
  });

  it.each(["xs", "sm", "md", "lg", "full"] as const)(
    "renders with size=%s without crashing",
    (size) => {
      render(<VideoTile name="John" size={size} isVideoOff />);
      expect(screen.getByText("J")).toBeInTheDocument();
    }
  );
});
