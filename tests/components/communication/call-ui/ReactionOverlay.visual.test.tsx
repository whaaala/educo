import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import ReactionOverlay from "@/components/communication/call-ui/ReactionOverlay";

describe("ReactionOverlay — Visual / CSS", () => {
  describe("container", () => {
    it("returns null when no reactions", () => {
      const { container } = render(<ReactionOverlay reactions={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("has absolute overlay with pointer-events-none", () => {
      const reactions = [{ id: "r1", emoji: "👍", x: 50, startTime: Date.now() }];
      const { container } = render(<ReactionOverlay reactions={reactions} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay.className).toContain("absolute");
      expect(overlay.className).toContain("inset-0");
      expect(overlay.className).toContain("pointer-events-none");
      expect(overlay.className).toContain("overflow-hidden");
    });

    it("has z-40 stacking order", () => {
      const reactions = [{ id: "r1", emoji: "👍", x: 50, startTime: Date.now() }];
      const { container } = render(<ReactionOverlay reactions={reactions} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay.className).toContain("z-40");
    });
  });

  describe("reaction items", () => {
    it("renders reaction emoji at absolute bottom position", () => {
      const reactions = [{ id: "r1", emoji: "🎉", x: 30, startTime: Date.now() }];
      const { container } = render(<ReactionOverlay reactions={reactions} />);
      const reactionEl = container.querySelector(".absolute.bottom-0");
      expect(reactionEl).not.toBeNull();
      expect(reactionEl!.className).toContain("text-5xl");
    });

    it("positions reaction with left percentage style", () => {
      const reactions = [{ id: "r1", emoji: "❤️", x: 45, startTime: Date.now() }];
      const { container } = render(<ReactionOverlay reactions={reactions} />);
      const reactionEl = container.querySelector(".absolute.bottom-0") as HTMLElement;
      expect(reactionEl.style.left).toBe("45%");
    });
  });
});
