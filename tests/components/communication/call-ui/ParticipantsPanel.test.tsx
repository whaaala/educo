import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParticipantsPanel } from "@/components/communication/call-ui/ParticipantsPanel";
import type { Participant } from "@/components/communication/call-ui/ParticipantsPanel";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, unoptimized, ...rest } = props;
    return <img {...rest} />;
  },
}));

function makeParticipant(overrides: Partial<Participant> = {}): Participant {
  return {
    id: "user-1",
    name: "John Doe",
    ...overrides,
  };
}

const defaultProps = {
  participants: [
    makeParticipant({ id: "user-1", name: "Alice (Host)", isHost: true }),
    makeParticipant({ id: "user-2", name: "Bob Smith" }),
    makeParticipant({ id: "user-3", name: "Charlie Brown", isMuted: true }),
  ],
  currentUserId: "user-1",
  onClose: vi.fn(),
};

describe("ParticipantsPanel", () => {
  it("renders 'Participants' heading", () => {
    render(<ParticipantsPanel {...defaultProps} />);
    expect(screen.getByText("Participants")).toBeInTheDocument();
  });

  it("renders participant count badge", () => {
    render(<ParticipantsPanel {...defaultProps} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders all participant names", () => {
    render(<ParticipantsPanel {...defaultProps} />);
    expect(screen.getByText("Alice (Host)")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
  });

  it("shows 'Host' badge for host participant", () => {
    render(<ParticipantsPanel {...defaultProps} />);
    expect(screen.getByText("Host")).toBeInTheDocument();
  });

  it("shows '(You)' for current user", () => {
    render(<ParticipantsPanel {...defaultProps} />);
    expect(screen.getByText("(You)")).toBeInTheDocument();
  });

  it("shows initials for participants without avatars", () => {
    render(
      <ParticipantsPanel
        {...defaultProps}
        participants={[makeParticipant({ id: "u1", name: "Zack" })]}
      />
    );
    expect(screen.getByText("Z")).toBeInTheDocument();
  });

  it("renders 'Add Participant' button when handler provided", () => {
    render(
      <ParticipantsPanel {...defaultProps} onAddParticipant={vi.fn()} />
    );
    expect(screen.getByText("Add Participant")).toBeInTheDocument();
  });

  it("does not render 'Add Participant' button when handler not provided", () => {
    render(<ParticipantsPanel {...defaultProps} />);
    expect(screen.queryByText("Add Participant")).not.toBeInTheDocument();
  });

  it("calls onAddParticipant when button clicked", async () => {
    const user = userEvent.setup();
    const onAddParticipant = vi.fn();
    render(
      <ParticipantsPanel
        {...defaultProps}
        onAddParticipant={onAddParticipant}
      />
    );
    await user.click(screen.getByText("Add Participant"));
    expect(onAddParticipant).toHaveBeenCalled();
  });
});
