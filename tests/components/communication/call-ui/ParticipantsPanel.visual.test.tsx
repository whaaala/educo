import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ParticipantsPanel from "@/components/communication/call-ui/ParticipantsPanel";

describe("ParticipantsPanel — Visual / CSS", () => {
  const defaultProps = {
    participants: [
      { id: "1", name: "John", isMuted: false, isVideoOff: false, isSpeaking: false, isHost: true },
    ],
    currentUserId: "2",
    onClose: vi.fn(),
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
  };

  describe("container theming", () => {
    it("has theme backgrounds", () => {
      const { container } = render(<ParticipantsPanel {...defaultProps} />);
      const panel = container.firstChild as HTMLElement;
      expect(panel.className).toContain("bg-white");
      expect(panel.className).toContain("dark:bg-[#0f1115]");
    });

    it("has flex-col full size", () => {
      const { container } = render(<ParticipantsPanel {...defaultProps} />);
      const panel = container.firstChild as HTMLElement;
      expect(panel.className).toContain("flex");
      expect(panel.className).toContain("flex-col");
      expect(panel.className).toContain("w-full");
      expect(panel.className).toContain("h-full");
    });
  });

  describe("header styling", () => {
    it("header has border-b with theme colors", () => {
      const { container } = render(<ParticipantsPanel {...defaultProps} />);
      const header = container.querySelector(".border-b");
      expect(header).toBeInTheDocument();
      expect(header!.className).toContain("border-gray-100");
      expect(header!.className).toContain("dark:border-[#1a1d24]");
    });

    it("title has theme text colors", () => {
      render(<ParticipantsPanel {...defaultProps} />);
      const title = screen.getByText("Participants");
      expect(title.className).toContain("font-semibold");
      expect(title.className).toContain("text-ink");
    });

    it("title has midnight and purple theme text colors", () => {
      render(<ParticipantsPanel {...defaultProps} />);
      const title = screen.getByText("Participants");
      expect(title.className).toContain("text-ink");
      expect(title.className).toContain("text-ink");
    });
  });

  describe("participant row", () => {
    it("participant name has theme colors", () => {
      render(<ParticipantsPanel {...defaultProps} />);
      const name = screen.getByText("John");
      expect(name.className).toContain("text-sm");
      expect(name.className).toContain("font-medium");
      expect(name.className).toContain("text-ink");
    });

    it("host badge has amber styling", () => {
      render(<ParticipantsPanel {...defaultProps} />);
      const badge = screen.getByText("Host");
      expect(badge.className).toContain("bg-amber-500");
      expect(badge.className).toContain("text-white");
      expect(badge.className).toContain("font-bold");
    });

    it("participant row has hover state", () => {
      const { container } = render(<ParticipantsPanel {...defaultProps} />);
      const row = container.querySelector(".hover\\:bg-gray-50");
      expect(row).not.toBeNull();
      expect(row!.className).toContain("cursor-pointer");
      expect(row!.className).toContain("transition-colors");
    });

    it("avatar has online indicator", () => {
      const { container } = render(<ParticipantsPanel {...defaultProps} />);
      const indicator = container.querySelector(".bg-green-500.rounded-full");
      expect(indicator).not.toBeNull();
    });
  });
});
