/**
 * EditorComments.test.tsx
 *
 * Unit tests for shared editor comment components.
 * Scenarios match 1:1 with tests/features/components/shared/EditorComments/EditorComments.feature
 */

import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import fs from "fs";
import path from "path";

import {
  CommentAvatar,
  CommentCard,
  FloatingCommentPill,
  useMention,
  MentionPopover,
  renderMentionPills,
} from "@/components/shared/EditorComments";
import type {
  CommentAuthor,
  DocComment,
  MentionUser,
} from "@/components/shared/EditorComments";

// ── Helpers ──

const SOURCE_PATH = path.resolve(__dirname, "../../../../components/shared/EditorComments.tsx");
const sourceCode = fs.readFileSync(SOURCE_PATH, "utf-8");

function makeAuthor(overrides: Partial<CommentAuthor> = {}): CommentAuthor {
  return {
    id: "author-1",
    name: "Jane Smith",
    ...overrides,
  };
}

function makeComment(overrides: Partial<DocComment> = {}): DocComment {
  return {
    id: "comment-1",
    documentId: "doc-1",
    author: makeAuthor(),
    selectedText: "some highlighted text",
    highlightRange: {
      pageIndex: 0,
      startOffset: 0,
      endOffset: 10,
      anchorPath: "p.0",
      focusPath: "p.0",
    },
    text: "Fix this section",
    mentions: [],
    status: "open",
    replies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

const noop = () => {};

function defaultCardProps(overrides: Partial<Parameters<typeof CommentCard>[0]> = {}) {
  return {
    comment: makeComment(),
    isActive: false,
    onSelect: noop,
    onReply: noop,
    onResolve: noop,
    onReject: noop,
    onReopen: noop,
    onDelete: noop,
    isOwner: true,
    currentAuthor: makeAuthor({ id: "author-1", name: "Jane Smith" }),
    mentionableUsers: [] as MentionUser[],
    ...overrides,
  };
}

function defaultPillProps(overrides: Partial<Parameters<typeof FloatingCommentPill>[0]> = {}) {
  return {
    comment: makeComment(),
    isActive: false,
    onSelect: noop,
    onScrollTo: noop,
    onReply: noop,
    onResolve: noop,
    onReject: noop,
    onReopen: noop,
    onDelete: noop,
    onOpenSidebar: noop,
    isOwner: true,
    mentionableUsers: [] as MentionUser[],
    ...overrides,
  };
}

// ── Wrapper for useMention testing ──

function MentionHarness({
  users,
  initialValue = "",
  onResult,
}: {
  users: MentionUser[];
  initialValue?: string;
  onResult: (result: ReturnType<typeof useMention>) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState(initialValue);
  const mention = useMention({ users, inputRef, value, onChange: setValue });

  React.useEffect(() => {
    onResult(mention);
  });

  return (
    <div>
      <input
        ref={inputRef}
        data-testid="mention-input"
        value={value}
        onChange={(e) => mention.handleChange(e.target.value)}
        onKeyDown={mention.handleKeyDown}
      />
      {mention.active && (
        <MentionPopover
          users={mention.filtered}
          highlightIdx={mention.highlightIdx}
          onSelect={mention.insertMention}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────
// CommentAvatar
// ──────────────────────────────────────────────────

describe("CommentAvatar", () => {
  it("shows initials when no image (Scenario: CommentAvatar shows initials when no image)", () => {
    const { container } = render(
      <CommentAvatar author={makeAuthor({ name: "John Doe" })} />
    );
    // "JD" initials
    expect(container.textContent).toContain("JD");
    // Background color derived from name hash
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).toMatch(/bg-\w+-500/);
  });

  it("shows image when avatar URL is provided (Scenario: CommentAvatar shows image when avatar URL is provided)", () => {
    const { container } = render(
      <CommentAvatar
        author={makeAuthor({ name: "John Doe", avatar: "https://example.com/photo.jpg" })}
      />
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img!.getAttribute("src")).toBe("https://example.com/photo.jpg");
    // No initials text should be present
    expect(container.querySelector("img")!.parentElement!.textContent).toBe("");
  });

  it("respects custom size (Scenario: CommentAvatar respects custom size)", () => {
    const { container } = render(
      <CommentAvatar author={makeAuthor({ name: "AB" })} size={40} />
    );
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.style.width).toBe("40px");
    expect(outer.style.height).toBe("40px");
  });

  it("generates correct initials for multi-word names", () => {
    const { container } = render(
      <CommentAvatar author={makeAuthor({ name: "Alice Bob Charlie" })} />
    );
    // Should take first letter of each word, limited to 2
    expect(container.textContent).toBe("AB");
  });

  it("source exports CommentAvatar as a named export", () => {
    expect(sourceCode).toContain("export function CommentAvatar");
  });
});

// ──────────────────────────────────────────────────
// CommentCard
// ──────────────────────────────────────────────────

describe("CommentCard", () => {
  it("displays author, text, and timestamp (Scenario: CommentCard displays author, text, and timestamp)", () => {
    const comment = makeComment({
      author: makeAuthor({ name: "Jane Smith" }),
      text: "Fix this section",
    });
    const { container } = render(<CommentCard {...defaultCardProps({ comment })} />);

    expect(container.textContent).toContain("Jane Smith");
    expect(container.textContent).toContain("Fix this section");
    // Timestamp rendered via formatTimeAgo -- just verify the card rendered something time-related
    // The card data attribute should be present
    expect(container.querySelector("[data-doc-comment-card]")).not.toBeNull();
  });

  it("shows reply input when reply button is clicked (Scenario: CommentCard shows reply input when reply button is clicked)", () => {
    const { container } = render(<CommentCard {...defaultCardProps()} />);

    // Find the Reply button (collapsed state)
    const replyButtons = Array.from(container.querySelectorAll("button")).filter(
      (btn) => btn.textContent?.trim() === "Reply"
    );
    expect(replyButtons.length).toBeGreaterThan(0);

    fireEvent.click(replyButtons[0]);

    // A textarea for reply should now appear
    const textarea = container.querySelector("textarea");
    expect(textarea).not.toBeNull();
    expect(textarea!.getAttribute("placeholder")).toContain("Reply");
  });

  it("shows resolution status (Scenario: CommentCard shows resolution status)", () => {
    const comment = makeComment({
      status: "resolved",
      resolution: {
        by: makeAuthor({ name: "Admin" }),
        action: "resolved",
        at: new Date().toISOString(),
      },
    });
    const { container } = render(<CommentCard {...defaultCardProps({ comment })} />);

    expect(container.textContent).toContain("Resolved");
    expect(container.querySelector("[data-resolved='true']")).not.toBeNull();
  });

  it("shows rejected status badge", () => {
    const comment = makeComment({
      status: "rejected",
      resolution: {
        by: makeAuthor({ name: "Admin" }),
        action: "rejected",
        at: new Date().toISOString(),
      },
    });
    const { container } = render(<CommentCard {...defaultCardProps({ comment })} />);

    expect(container.textContent).toContain("Rejected");
  });

  it("supports multiple replies (Scenario: CommentCard supports multiple replies)", () => {
    const comment = makeComment({
      replies: [
        { id: "r1", author: makeAuthor({ id: "u2", name: "Alice" }), text: "Reply one", mentions: [], createdAt: new Date().toISOString() },
        { id: "r2", author: makeAuthor({ id: "u3", name: "Bob" }), text: "Reply two", mentions: [], createdAt: new Date().toISOString() },
        { id: "r3", author: makeAuthor({ id: "u4", name: "Charlie" }), text: "Reply three", mentions: [], createdAt: new Date().toISOString() },
      ],
    });
    const { container } = render(<CommentCard {...defaultCardProps({ comment })} />);

    expect(container.textContent).toContain("Alice");
    expect(container.textContent).toContain("Reply one");
    expect(container.textContent).toContain("Bob");
    expect(container.textContent).toContain("Reply two");
    expect(container.textContent).toContain("Charlie");
    expect(container.textContent).toContain("Reply three");
  });

  it("hides reply input for resolved comments", () => {
    const comment = makeComment({
      status: "resolved",
      resolution: {
        by: makeAuthor({ name: "Admin" }),
        action: "resolved",
        at: new Date().toISOString(),
      },
    });
    const { container } = render(<CommentCard {...defaultCardProps({ comment })} />);

    // No Reply button in collapsed state for resolved comments
    const replyButtons = Array.from(container.querySelectorAll("button")).filter(
      (btn) => btn.textContent?.trim() === "Reply"
    );
    expect(replyButtons.length).toBe(0);
  });

  it("source code has data-doc-comment-card attribute", () => {
    expect(sourceCode).toContain("data-doc-comment-card");
  });
});

// ──────────────────────────────────────────────────
// FloatingCommentPill
// ──────────────────────────────────────────────────

describe("FloatingCommentPill", () => {
  it("shows compact view in margin (Scenario: FloatingCommentPill shows compact view in margin)", () => {
    const comment = makeComment({ text: "Please review" });
    const { container } = render(
      <FloatingCommentPill {...defaultPillProps({ comment, isActive: false })} />
    );

    const pill = container.querySelector("[data-doc-floating-pill]");
    expect(pill).not.toBeNull();
    expect(container.textContent).toContain("Please review");
    // When not active, reply count may show but the full reply input is hidden
    expect(container.querySelector("textarea")).toBeNull();
  });

  it("expands on hover / active (Scenario: FloatingCommentPill expands on hover)", () => {
    const comment = makeComment({
      text: "Please review",
      replies: [
        { id: "r1", author: makeAuthor({ id: "u2", name: "Bob" }), text: "On it", mentions: [], createdAt: new Date().toISOString() },
      ],
    });

    // When isActive=true, the pill expands to show replies and reply input
    const { container } = render(
      <FloatingCommentPill {...defaultPillProps({ comment, isActive: true })} />
    );

    // Should show the reply text
    expect(container.textContent).toContain("On it");
    // Should show the reply textarea
    expect(container.querySelector("textarea")).not.toBeNull();
  });

  it("shows reply count when collapsed with replies", () => {
    const comment = makeComment({
      replies: [
        { id: "r1", author: makeAuthor({ id: "u2", name: "Bob" }), text: "On it", mentions: [], createdAt: new Date().toISOString() },
        { id: "r2", author: makeAuthor({ id: "u3", name: "Alice" }), text: "Agreed", mentions: [], createdAt: new Date().toISOString() },
      ],
    });
    const { container } = render(
      <FloatingCommentPill {...defaultPillProps({ comment, isActive: false })} />
    );

    expect(container.textContent).toContain("2 replies");
  });

  it("shows '1 reply' for single reply", () => {
    const comment = makeComment({
      replies: [
        { id: "r1", author: makeAuthor({ id: "u2", name: "Bob" }), text: "On it", mentions: [], createdAt: new Date().toISOString() },
      ],
    });
    const { container } = render(
      <FloatingCommentPill {...defaultPillProps({ comment, isActive: false })} />
    );

    expect(container.textContent).toContain("1 reply");
  });

  it("source exports FloatingCommentPill", () => {
    expect(sourceCode).toContain("export function FloatingCommentPill");
  });
});

// ──────────────────────────────────────────────────
// useMention Hook
// ──────────────────────────────────────────────────

describe("useMention", () => {
  const users: MentionUser[] = [
    { id: "u1", name: "John Doe" },
    { id: "u2", name: "Jane Smith" },
    { id: "u3", name: "Jordan Lee" },
    { id: "u4", name: "Sarah Connor" },
  ];

  it("detects @ trigger in input (Scenario: useMention detects @ trigger in input)", () => {
    let latestResult: ReturnType<typeof useMention> | null = null;
    const { getByTestId } = render(
      <MentionHarness users={users} onResult={(r) => { latestResult = r; }} />
    );

    const input = getByTestId("mention-input") as HTMLInputElement;

    // Simulate typing "@"
    fireEvent.change(input, { target: { value: "@" } });

    // The mention should become active
    expect(latestResult!.active).toBe(true);
    // All users should appear since query is empty
    expect(latestResult!.filtered.length).toBe(users.length);
  });

  it("filters suggestions as user types (Scenario: useMention filters suggestions as user types)", () => {
    let latestResult: ReturnType<typeof useMention> | null = null;
    const { getByTestId } = render(
      <MentionHarness users={users} onResult={(r) => { latestResult = r; }} />
    );

    const input = getByTestId("mention-input") as HTMLInputElement;

    // Type "@Jo"
    fireEvent.change(input, { target: { value: "@Jo" } });

    expect(latestResult!.active).toBe(true);
    // Should match "John Doe" and "Jordan Lee"
    const names = latestResult!.filtered.map((u) => u.name);
    expect(names).toContain("John Doe");
    expect(names).toContain("Jordan Lee");
    expect(names).not.toContain("Sarah Connor");
  });

  it("inserts mention on selection (Scenario: useMention inserts mention on selection)", () => {
    let latestResult: ReturnType<typeof useMention> | null = null;
    const { getByTestId } = render(
      <MentionHarness users={users} onResult={(r) => { latestResult = r; }} />
    );

    const input = getByTestId("mention-input") as HTMLInputElement;

    // Activate mention
    fireEvent.change(input, { target: { value: "@Jo" } });
    expect(latestResult!.active).toBe(true);

    // Insert the first filtered user
    const userToInsert = latestResult!.filtered[0];
    act(() => {
      latestResult!.insertMention(userToInsert);
    });

    // After insertion, mention should close
    expect(latestResult!.active).toBe(false);
  });

  it("supports keyboard navigation (Scenario: useMention supports keyboard navigation)", () => {
    let latestResult: ReturnType<typeof useMention> | null = null;
    const { getByTestId } = render(
      <MentionHarness users={users} onResult={(r) => { latestResult = r; }} />
    );

    const input = getByTestId("mention-input") as HTMLInputElement;

    // Activate mention
    fireEvent.change(input, { target: { value: "@" } });
    expect(latestResult!.active).toBe(true);
    expect(latestResult!.highlightIdx).toBe(0);

    // Press ArrowDown
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(latestResult!.highlightIdx).toBe(1);

    // Press ArrowDown again
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(latestResult!.highlightIdx).toBe(2);

    // Press ArrowUp
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(latestResult!.highlightIdx).toBe(1);
  });

  it("closes on Escape", () => {
    let latestResult: ReturnType<typeof useMention> | null = null;
    const { getByTestId } = render(
      <MentionHarness users={users} onResult={(r) => { latestResult = r; }} />
    );

    const input = getByTestId("mention-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "@" } });
    expect(latestResult!.active).toBe(true);

    fireEvent.keyDown(input, { key: "Escape" });
    expect(latestResult!.active).toBe(false);
  });

  it("source exports useMention as a named function", () => {
    expect(sourceCode).toContain("export function useMention");
  });
});

// ──────────────────────────────────────────────────
// MentionPopover
// ──────────────────────────────────────────────────

describe("MentionPopover", () => {
  it("renders filtered user list (Scenario: MentionPopover renders filtered user list)", () => {
    const users: MentionUser[] = [
      { id: "u1", name: "Sarah Connor" },
      { id: "u2", name: "Samuel Jackson" },
    ];
    const onSelect = vi.fn();

    const { container } = render(
      <MentionPopover users={users} highlightIdx={0} onSelect={onSelect} />
    );

    // Both filtered users should appear
    expect(container.textContent).toContain("Sarah Connor");
    expect(container.textContent).toContain("Samuel Jackson");

    // Should have role="listbox"
    const listbox = container.querySelector("[role='listbox']");
    expect(listbox).not.toBeNull();

    // Each user should be an option
    const options = container.querySelectorAll("[role='option']");
    expect(options.length).toBe(2);
  });

  it("returns null when users list is empty", () => {
    const { container } = render(
      <MentionPopover users={[]} highlightIdx={0} onSelect={noop} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("highlights the correct user based on highlightIdx", () => {
    const users: MentionUser[] = [
      { id: "u1", name: "Alpha" },
      { id: "u2", name: "Beta" },
      { id: "u3", name: "Gamma" },
    ];
    const { container } = render(
      <MentionPopover users={users} highlightIdx={1} onSelect={noop} />
    );

    const options = container.querySelectorAll("[role='option']");
    expect(options[0].getAttribute("aria-selected")).toBe("false");
    expect(options[1].getAttribute("aria-selected")).toBe("true");
    expect(options[2].getAttribute("aria-selected")).toBe("false");
  });

  it("calls onSelect when a user is clicked", () => {
    const users: MentionUser[] = [{ id: "u1", name: "Alpha" }];
    const onSelect = vi.fn();

    const { container } = render(
      <MentionPopover users={users} highlightIdx={0} onSelect={onSelect} />
    );

    const option = container.querySelector("[role='option']")!;
    fireEvent.click(option);
    expect(onSelect).toHaveBeenCalledWith(users[0]);
  });

  it("source has data-mention-popover attribute", () => {
    expect(sourceCode).toContain("data-mention-popover");
  });
});

// ──────────────────────────────────────────────────
// renderMentionPills
// ──────────────────────────────────────────────────

describe("renderMentionPills", () => {
  it("converts @mentions to styled pills (Scenario: renderMentionPills converts @mentions to styled pills)", () => {
    const result = renderMentionPills("Hey @John Doe please review this");
    const { container } = render(<>{result}</>);

    // Should have a mention pill element
    const pill = container.querySelector("[data-mention-pill]");
    expect(pill).not.toBeNull();
    expect(pill!.textContent).toContain("John Doe");

    // The pill should have blue styling
    expect(pill!.className).toContain("bg-blue-100");

    // The rest of the text should be present
    expect(container.textContent).toContain("Hey");
    expect(container.textContent).toContain("please review this");
  });

  it("renders plain text with no @mentions unchanged", () => {
    const result = renderMentionPills("No mentions here");
    const { container } = render(<>{result}</>);

    expect(container.querySelector("[data-mention-pill]")).toBeNull();
    expect(container.textContent).toBe("No mentions here");
  });

  it("handles multiple @mentions in one string", () => {
    const result = renderMentionPills("@Alice and @Bob are here");
    const { container } = render(<>{result}</>);

    const pills = container.querySelectorAll("[data-mention-pill]");
    expect(pills.length).toBe(2);
  });

  it("source exports renderMentionPills as a named function", () => {
    expect(sourceCode).toContain("export function renderMentionPills");
  });
});
