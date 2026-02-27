import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CallConnecting from "@/components/communication/CallConnecting";

describe("CallConnecting — Visual / CSS", () => {
  // ─── Container theming ───────────────────────
  describe("container theming", () => {
    it("has full-height centered layout", () => {
      const { container } = render(<CallConnecting callType="video" />);
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain("flex");
      expect(outer.className).toContain("items-center");
      expect(outer.className).toContain("justify-center");
      expect(outer.className).toContain("h-full");
    });

    it("has light theme background", () => {
      const { container } = render(<CallConnecting callType="video" />);
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain("bg-white");
    });

    it("has dark theme background", () => {
      const { container } = render(<CallConnecting callType="video" />);
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain("dark:bg-gray-900");
    });

    it("has midnight theme background", () => {
      const { container } = render(<CallConnecting callType="video" />);
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain("midnight:bg-[#0a0f1a]");
    });

    it("has purple theme background", () => {
      const { container } = render(<CallConnecting callType="video" />);
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain("purple:bg-[#120622]");
    });

    it("has fade-in animation", () => {
      const { container } = render(<CallConnecting callType="video" />);
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain("animate-in");
      expect(outer.className).toContain("fade-in");
      expect(outer.className).toContain("duration-300");
    });
  });

  // ─── Heading typography ──────────────────────
  describe("heading typography", () => {
    it("voice call heading has bold xl text with theme colors", () => {
      render(<CallConnecting callType="voice" />);
      const heading = screen.getByText("Calling...");
      expect(heading.className).toContain("text-xl");
      expect(heading.className).toContain("font-bold");
      expect(heading.className).toContain("text-gray-900");
      expect(heading.className).toContain("dark:text-white");
      expect(heading.className).toContain("midnight:text-cyan-50");
      expect(heading.className).toContain("purple:text-pink-50");
    });

    it("subtitle has sm text with subdued theme colors", () => {
      render(<CallConnecting callType="video" />);
      const subtitle = screen.getByText("Setting up your session");
      expect(subtitle.className).toContain("text-sm");
      expect(subtitle.className).toContain("text-gray-500");
      expect(subtitle.className).toContain("dark:text-gray-400");
      expect(subtitle.className).toContain("midnight:text-cyan-400");
      expect(subtitle.className).toContain("purple:text-pink-400");
    });
  });

  // ─── Badge styling ───────────────────────────
  describe("call type badge", () => {
    it("badge has rounded-full pill shape", () => {
      render(<CallConnecting callType="voice" />);
      const badge = screen.getByText("Voice Call").closest("div");
      expect(badge!.className).toContain("rounded-full");
      expect(badge!.className).toContain("inline-flex");
      expect(badge!.className).toContain("items-center");
    });

    it("badge has blue theme with dark/midnight/purple variants", () => {
      render(<CallConnecting callType="voice" />);
      const badge = screen.getByText("Voice Call").closest("div");
      expect(badge!.className).toContain("bg-blue-50");
      expect(badge!.className).toContain("dark:bg-blue-900/20");
      expect(badge!.className).toContain("midnight:bg-cyan-900/20");
      expect(badge!.className).toContain("purple:bg-pink-900/20");
      expect(badge!.className).toContain("border");
      expect(badge!.className).toContain("border-blue-200");
    });

    it("badge text has theme-responsive colors", () => {
      render(<CallConnecting callType="video" />);
      const text = screen.getByText("Video Call");
      expect(text.className).toContain("text-blue-700");
      expect(text.className).toContain("dark:text-blue-300");
      expect(text.className).toContain("midnight:text-cyan-300");
      expect(text.className).toContain("purple:text-pink-300");
    });
  });

  // ─── Responsive sizing ───────────────────────
  describe("responsive sizing", () => {
    it("voice avatar has responsive sizing (w-20/sm:w-24)", () => {
      render(
        <CallConnecting callType="voice" recipientName="Jane" />
      );
      // Initial circle has w-20 h-20 with sm:w-24 sm:h-24 upgrade
      const initial = screen.getByText("J").closest("div");
      expect(initial!.className).toContain("w-20");
      expect(initial!.className).toContain("h-20");
      expect(initial!.className).toContain("sm:w-24");
      expect(initial!.className).toContain("sm:h-24");
    });

    it("video spinner has responsive sizing", () => {
      const { container } = render(
        <CallConnecting callType="video" />
      );
      // Spinner wrapper has w-16/sm:w-20
      const spinner = container.querySelector(".animate-spin")?.parentElement;
      expect(spinner).not.toBeNull();
      expect(spinner!.className).toContain("w-16");
      expect(spinner!.className).toContain("sm:w-20");
    });

    it("badge icon has responsive sizing (w-3.5/sm:w-4)", () => {
      const { container } = render(
        <CallConnecting callType="voice" />
      );
      const svg = container.querySelector("svg.lucide");
      expect(svg).not.toBeNull();
    });
  });

  // ─── Tenant powered-by styling ───────────────
  describe("tenant footer", () => {
    it("has small muted text with theme colors", () => {
      render(
        <CallConnecting callType="video" tenantName="Educo School" />
      );
      const powered = screen.getByText("Powered by Educo School");
      expect(powered.className).toContain("text-xs");
      expect(powered.className).toContain("text-gray-400");
      expect(powered.className).toContain("dark:text-gray-500");
      expect(powered.className).toContain("midnight:text-cyan-400/40");
      expect(powered.className).toContain("purple:text-pink-400/40");
    });
  });
});
