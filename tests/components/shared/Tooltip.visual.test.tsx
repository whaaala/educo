import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Tooltip from "@/components/shared/Tooltip";

describe("Tooltip — Visual / CSS", () => {
  describe("trigger wrapper", () => {
    it("has relative inline-block by default", () => {
      const { container } = render(
        <Tooltip content="Help text"><span>Hover me</span></Tooltip>
      );
      const trigger = container.firstChild as HTMLElement;
      expect(trigger.className).toContain("relative");
      expect(trigger.className).toContain("inline-block");
    });

    it("has relative block when block prop is true", () => {
      const { container } = render(
        <Tooltip content="Help text" block><span>Hover me</span></Tooltip>
      );
      const trigger = container.firstChild as HTMLElement;
      expect(trigger.className).toContain("relative");
      expect(trigger.className).toContain("block");
    });
  });
});
