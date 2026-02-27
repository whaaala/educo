import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import MessageStats from "@/components/shared/messages/MessageStats";
import { MessageStats as MessageStatsType } from "@/components/shared/messages/types";

describe("MessageStats — Visual / CSS", () => {
  const defaultStats: MessageStatsType = {
    total: 10,
    received: 5,
    sent: 5,
    unread: 2,
    highPriority: 1,
  };

  describe("grid layout", () => {
    it("has responsive grid columns", () => {
      const { container } = render(<MessageStats stats={defaultStats} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("grid");
      expect(grid.className).toContain("grid-cols-2");
      expect(grid.className).toContain("sm:grid-cols-4");
    });

    it("has responsive gap", () => {
      const { container } = render(<MessageStats stats={defaultStats} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("gap-3");
      expect(grid.className).toContain("sm:gap-4");
    });

    it("has entry animation", () => {
      const { container } = render(<MessageStats stats={defaultStats} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("animate-in");
      expect(grid.className).toContain("fade-in");
    });

    it("has slide-in-from-bottom animation", () => {
      const { container } = render(<MessageStats stats={defaultStats} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("slide-in-from-bottom-2");
    });

    it("has bottom margin spacing", () => {
      const { container } = render(<MessageStats stats={defaultStats} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("mb-6");
    });
  });
});
