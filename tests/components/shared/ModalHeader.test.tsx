import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalHeader from "@/components/shared/ModalHeader";
import { AlertCircle } from "lucide-react";

describe("ModalHeader", () => {
  it("renders title", () => {
    render(
      <ModalHeader title="Delete Item" icon={AlertCircle} onClose={vi.fn()} />
    );
    expect(screen.getByText("Delete Item")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ModalHeader title="Title" icon={AlertCircle} onClose={onClose} />
    );
    const closeBtn = screen.getByRole("button");
    await user.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders icon", () => {
    const { container } = render(
      <ModalHeader title="Title" icon={AlertCircle} onClose={vi.fn()} />
    );
    // SVG icon should be present
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
  });

  it.each(["blue", "red", "green", "purple", "orange"] as const)(
    "renders with variant=%s",
    (variant) => {
      render(
        <ModalHeader
          title="Title"
          icon={AlertCircle}
          onClose={vi.fn()}
          variant={variant}
        />
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
    }
  );
});
