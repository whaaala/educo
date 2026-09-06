import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { VideoTile } from "@/components/communication/call-ui/VideoTile";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, unoptimized, alt, ...rest } = props;
    return <img alt={typeof alt === "string" ? alt : ""} {...rest} />;
  },
}));

describe("VideoTile — Visual / CSS", () => {
  // ─── Size variants ───────────────────────────
  describe("size classes", () => {
    it("xs size has w-16 h-12 with sm:w-20 sm:h-16", () => {
      const { container } = render(
        <VideoTile name="John" size="xs" isVideoOff />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).toContain("w-16");
      expect(tile.className).toContain("h-12");
      expect(tile.className).toContain("sm:w-20");
      expect(tile.className).toContain("sm:h-16");
    });

    it("sm size has w-24 h-20 with sm:w-32 sm:h-24", () => {
      const { container } = render(
        <VideoTile name="John" size="sm" isVideoOff />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).toContain("w-24");
      expect(tile.className).toContain("h-20");
      expect(tile.className).toContain("sm:w-32");
      expect(tile.className).toContain("sm:h-24");
    });

    it("md size has w-40 h-32 with sm:w-48 sm:h-36", () => {
      const { container } = render(
        <VideoTile name="John" size="md" isVideoOff />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).toContain("w-40");
      expect(tile.className).toContain("h-32");
      expect(tile.className).toContain("sm:w-48");
      expect(tile.className).toContain("sm:h-36");
    });

    it("lg size has w-60 h-44 with sm:w-72 sm:h-52", () => {
      const { container } = render(
        <VideoTile name="John" size="lg" isVideoOff />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).toContain("w-60");
      expect(tile.className).toContain("h-44");
      expect(tile.className).toContain("sm:w-72");
      expect(tile.className).toContain("sm:h-52");
    });

    it("full size has w-full h-full", () => {
      const { container } = render(
        <VideoTile name="John" size="full" isVideoOff />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).toContain("w-full");
      expect(tile.className).toContain("h-full");
    });
  });

  // ─── Container styling ───────────────────────
  describe("container styling", () => {
    it("has rounded corners with responsive upgrade", () => {
      const { container } = render(
        <VideoTile name="John" isVideoOff />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).toContain("rounded-xl");
      expect(tile.className).toContain("sm:rounded-2xl");
    });

    it("has dark background for video area", () => {
      const { container } = render(
        <VideoTile name="John" isVideoOff />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).toContain("bg-gray-900");
      expect(tile.className).toContain("dark:bg-[#1a1d24]");
    });

    it("has overflow-hidden and group class", () => {
      const { container } = render(
        <VideoTile name="John" isVideoOff />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).toContain("overflow-hidden");
      expect(tile.className).toContain("group");
    });

    it("has cursor-pointer when onClick is provided", () => {
      const { container } = render(
        <VideoTile name="John" isVideoOff onClick={vi.fn()} />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).toContain("cursor-pointer");
    });

    it("does not have cursor-pointer without onClick", () => {
      const { container } = render(
        <VideoTile name="John" isVideoOff />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).not.toContain("cursor-pointer");
    });
  });

  // ─── Speaking ring ───────────────────────────
  describe("speaking indicator", () => {
    it("has ring class when isSpeaking", () => {
      const { container } = render(
        <VideoTile name="John" isVideoOff isSpeaking />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).toContain("ring-2");
      expect(tile.className).toContain("sm:ring-3");
    });

    it("does not have ring class when not speaking", () => {
      const { container } = render(
        <VideoTile name="John" isVideoOff />
      );
      const tile = container.firstChild as HTMLElement;
      expect(tile.className).not.toContain("ring-2");
    });
  });

  // ─── Muted indicator ─────────────────────────
  describe("muted indicator", () => {
    it("muted indicator has red background", () => {
      const { container } = render(
        <VideoTile name="John" isMuted />
      );
      const mutedBg = container.querySelector(".bg-red-500\\/90");
      expect(mutedBg).toBeInTheDocument();
    });
  });
});
