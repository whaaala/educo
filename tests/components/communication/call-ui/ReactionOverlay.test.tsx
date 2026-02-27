import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import {
  ReactionOverlay,
  useReactionOverlay,
} from "@/components/communication/call-ui/ReactionOverlay";

describe("ReactionOverlay", () => {
  it("renders nothing when reactions array is empty", () => {
    const { container } = render(<ReactionOverlay reactions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders emoji when reactions provided", () => {
    const reactions = [
      { id: "r1", emoji: "👍", x: 50, startTime: Date.now() },
    ];
    render(<ReactionOverlay reactions={reactions} />);
    expect(screen.getByText("👍")).toBeInTheDocument();
  });

  it("renders multiple emojis", () => {
    const reactions = [
      { id: "r1", emoji: "👍", x: 30, startTime: Date.now() },
      { id: "r2", emoji: "🎉", x: 60, startTime: Date.now() },
    ];
    render(<ReactionOverlay reactions={reactions} />);
    expect(screen.getByText("👍")).toBeInTheDocument();
    expect(screen.getByText("🎉")).toBeInTheDocument();
  });
});

describe("useReactionOverlay", () => {
  it("starts with empty reactions", () => {
    const { result } = renderHook(() => useReactionOverlay());
    expect(result.current.reactions).toEqual([]);
  });

  it("adds a reaction", () => {
    const { result } = renderHook(() => useReactionOverlay());
    act(() => {
      result.current.addReaction("🔥");
    });
    expect(result.current.reactions).toHaveLength(1);
    expect(result.current.reactions[0].emoji).toBe("🔥");
  });

  it("adds multiple reactions", () => {
    const { result } = renderHook(() => useReactionOverlay());
    act(() => {
      result.current.addReaction("🔥");
      result.current.addReaction("❤️");
    });
    expect(result.current.reactions).toHaveLength(2);
  });

  it("assigns random x position between 10 and 90", () => {
    const { result } = renderHook(() => useReactionOverlay());
    act(() => {
      result.current.addReaction("👏");
    });
    const x = result.current.reactions[0].x;
    expect(x).toBeGreaterThanOrEqual(10);
    expect(x).toBeLessThanOrEqual(90);
  });
});
