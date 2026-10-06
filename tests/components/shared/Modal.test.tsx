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

  // D3-47: the subtitle was `truncate` — the Page check's "…including people using screen readers" read "…includin…",
  // the half of the sentence that says who it is for. A subtitle is a sentence: it wraps, never cut (WCAG 1.4.10).
  it("never cuts its subtitle short", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Page check" subtitle="Makes sure everyone can use this page — including people using screen readers">
        <p>Content</p>
      </Modal>
    );
    const sub = screen.getByText(/including people using screen readers/);
    expect(sub.className.split(/\s+/)).not.toContain("truncate");
    expect(sub.className).not.toMatch(/line-clamp|text-ellipsis|whitespace-nowrap/);
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
    const buttons = screen.queryAllByRole("button");
    expect(buttons.length).toBe(0);
  });

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

  // E3-9: the Escape listener is added ONCE per opening. Keyed on an inline onClose (new every render) it was removed and re-added by
  // any render — and a render caused by the same Escape removed it mid-dispatch, so the builder's Page check never closed.
  it("adds its Escape listener once, however often the page around it re-renders", () => {
    const spy = vi.spyOn(document, "addEventListener");
    const { rerender } = render(<Modal isOpen={true} onClose={() => {}}><p>x</p></Modal>);
    for (let i = 0; i < 3; i++) rerender(<Modal isOpen={true} onClose={() => {}}><p>x</p></Modal>);
    expect(spy.mock.calls.filter(([t]) => t === "keydown")).toHaveLength(1);
    spy.mockRestore();
  });

  it("calls the LATEST onClose on Escape, after the page re-rendered", async () => {
    const first = vi.fn(), latest = vi.fn();
    const { rerender } = render(<Modal isOpen={true} onClose={first}><p>x</p></Modal>);
    rerender(<Modal isOpen={true} onClose={latest}><p>x</p></Modal>);
    await userEvent.keyboard("{Escape}");
    expect(latest).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });

  // E3-11 (WCAG 2.4.3): focus goes into the dialog when it opens, and back to what opened it when it closes.
  it("takes the focus when it opens and gives it back when it closes", () => {
    const Opener = ({ open }: { open: boolean }) => (<><button>Open</button><Modal isOpen={open} onClose={() => {}} title="T"><p>x</p></Modal></>);
    const { rerender } = render(<Opener open={false} />);
    screen.getByRole("button", { name: "Open" }).focus();
    rerender(<Opener open={true} />);
    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
    rerender(<Opener open={false} />);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open" }));
  });

  it("leaves the focus where it is when something inside the dialog took it", () => {
    render(<Modal isOpen={true} onClose={() => {}}><input aria-label="Name" autoFocus /></Modal>);
    expect(document.activeElement).toBe(screen.getByLabelText("Name"));
  });
});
