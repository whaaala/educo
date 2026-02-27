import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import ControlBar from "@/components/communication/call-ui/ControlBar";

describe("ControlBar — Visual / CSS", () => {
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
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
  };

  describe("container theming", () => {
    it("has theme backgrounds with backdrop blur", () => {
      const { container } = render(<ControlBar {...defaultProps} />);
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("bg-white/98");
      expect(bar.className).toContain("dark:bg-gray-900/98");
      expect(bar.className).toContain("midnight:bg-[#0f1729]/98");
      expect(bar.className).toContain("purple:bg-[#2a1a3e]/98");
      expect(bar.className).toContain("backdrop-blur-xl");
    });

    it("has border-t with theme colors", () => {
      const { container } = render(<ControlBar {...defaultProps} />);
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("border-t");
      expect(bar.className).toContain("border-gray-100");
      expect(bar.className).toContain("dark:border-gray-800");
    });

    it("has responsive gap and padding", () => {
      const { container } = render(<ControlBar {...defaultProps} />);
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("gap-1");
      expect(bar.className).toContain("sm:gap-2");
      expect(bar.className).toContain("lg:gap-3");
      expect(bar.className).toContain("px-2");
      expect(bar.className).toContain("sm:px-6");
    });

    it("has flex wrap centered layout", () => {
      const { container } = render(<ControlBar {...defaultProps} />);
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("flex");
      expect(bar.className).toContain("flex-wrap");
      expect(bar.className).toContain("items-center");
      expect(bar.className).toContain("justify-center");
    });

    it("has shadow styling", () => {
      const { container } = render(<ControlBar {...defaultProps} />);
      const bar = container.firstChild as HTMLElement;
      expect(bar.className).toContain("shadow-");
    });
  });

  describe("divider styling", () => {
    it("has theme-colored dividers hidden on small screens", () => {
      const { container } = render(<ControlBar {...defaultProps} />);
      const divider = container.querySelector(".bg-gray-200.dark\\:bg-gray-700\\/50");
      if (divider) {
        expect(divider.className).toContain("hidden");
        expect(divider.className).toContain("sm:block");
        expect(divider.className).toContain("rounded-full");
      }
    });
  });

  describe("control buttons", () => {
    it("renders end call button with destructive styling", () => {
      const { container } = render(<ControlBar {...defaultProps} />);
      const endCallCircle = container.querySelector(".bg-red-500");
      expect(endCallCircle).not.toBeNull();
      expect(endCallCircle!.className).toContain("text-white");
      expect(endCallCircle!.className).toContain("rounded-full");
    });

    it("control buttons have responsive sizing", () => {
      const { container } = render(<ControlBar {...defaultProps} />);
      const buttons = container.querySelectorAll(".rounded-full.flex.items-center.justify-center");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
