import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "@/components/shared/ErrorMessage";

describe("ErrorMessage — Visual / CSS", () => {
  describe("text theming", () => {
    it("has red text with theme variants", () => {
      const { container } = render(<ErrorMessage message="Error occurred" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("text-red-600");
      expect(wrapper.className).toContain("dark:text-red-400");
      expect(wrapper.className).toContain("midnight:text-red-400");
      expect(wrapper.className).toContain("purple:text-red-400");
    });

    it("has text-sm", () => {
      const { container } = render(<ErrorMessage message="Error occurred" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("text-sm");
    });
  });

  describe("layout", () => {
    it("has flex layout with gap", () => {
      const { container } = render(<ErrorMessage message="Error occurred" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("flex");
      expect(wrapper.className).toContain("items-start");
      expect(wrapper.className).toContain("gap-2");
    });

    it("has mt-1.5 margin", () => {
      const { container } = render(<ErrorMessage message="Error occurred" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("mt-1.5");
    });
  });

  describe("accessibility", () => {
    it("has role=alert", () => {
      render(<ErrorMessage message="Error occurred" />);
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
    });
  });
});
