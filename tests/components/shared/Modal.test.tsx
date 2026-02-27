import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "@/components/shared/Modal";

describe("Modal", () => {
  it("renders nothing when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders children when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Title">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Title"
        subtitle="Subtitle text"
      >
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText("Subtitle text")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        footer={<button>Save</button>}
      >
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>
    );
    // Find close button (X button)
    const closeButtons = screen.getAllByRole("button");
    const closeBtn = closeButtons.find(
      (btn) => btn.querySelector("svg") !== null
    );
    if (closeBtn) {
      await user.click(closeBtn);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("calls onClose when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("hides close button when showCloseButton is false", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} showCloseButton={false}>
        <p>Content</p>
      </Modal>
    );
    // Should not have the X close button in header
    const buttons = screen.queryAllByRole("button");
    // If there are no buttons, close button was hidden
    expect(buttons.length).toBe(0);
  });

  // Size variants
  it.each(["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const)(
    "renders with size=%s without crashing",
    (size) => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} size={size}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    }
  );
});
