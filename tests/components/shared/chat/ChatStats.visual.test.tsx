import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import ChatStats from "@/components/shared/chat/ChatStats";
import { ChatStats as ChatStatsType } from "@/components/shared/chat/types";

describe("ChatStats — Visual / CSS", () => {
  const defaultStats: ChatStatsType = {
    total: 10,
    active: 5,
    unread: 2,
    totalUnreadMessages: 8,
  };

  describe("grid layout", () => {
    it("has responsive grid columns", () => {
      const { container } = render(<ChatStats stats={defaultStats} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("grid");
      expect(grid.className).toContain("grid-cols-2");
      expect(grid.className).toContain("sm:grid-cols-4");
    });

    it("has responsive gap", () => {
      const { container } = render(<ChatStats stats={defaultStats} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("gap-3");
      expect(grid.className).toContain("sm:gap-4");
    });

    it("has entry animation", () => {
      const { container } = render(<ChatStats stats={defaultStats} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("animate-in");
      expect(grid.className).toContain("fade-in");
    });

    it("has slide-in-from-bottom animation", () => {
      const { container } = render(<ChatStats stats={defaultStats} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("slide-in-from-bottom-2");
    });

    it("has bottom margin spacing", () => {
      const { container } = render(<ChatStats stats={defaultStats} />);
      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain("mb-6");
    });
  });
});
