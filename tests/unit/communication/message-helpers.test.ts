import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { formatMessageTime } from "@/components/shared/messages/MessageCard";
import { calculateMessageStats } from "@/components/shared/messages/MessageStats";
import {
  CATEGORY_CONFIG,
  MESSAGE_SORT_OPTIONS,
  DEFAULT_MESSAGE_FILTER_FIELDS,
} from "@/components/shared/messages/types";
import type { MessageCategory } from "@/components/shared/messages/types";

describe("formatMessageTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-27T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats today's time with hour and minute", () => {
    const result = formatMessageTime("2026-02-27T09:15:00");
    expect(result).toMatch(/9:15\s*AM/i);
  });

  it("returns 'Yesterday' for yesterday's messages", () => {
    // Must be >= 24h before "now" (12:00) to register as 1 day
    const result = formatMessageTime("2026-02-26T08:00:00");
    expect(result).toBe("Yesterday");
  });

  it("returns weekday name for messages 2-6 days ago", () => {
    const result = formatMessageTime("2026-02-24T10:00:00");
    expect(result).toBe("Tue");
  });

  it("returns date for messages older than 7 days", () => {
    const result = formatMessageTime("2026-02-10T10:00:00");
    expect(result).toMatch(/10 Feb/);
  });
});

describe("calculateMessageStats", () => {
  it("returns zero stats for empty array", () => {
    const stats = calculateMessageStats([]);
    expect(stats).toEqual({
      total: 0,
      received: 0,
      sent: 0,
      unread: 0,
      highPriority: 0,
    });
  });

  it("counts total messages", () => {
    const messages = [
      { type: "received", isRead: true, priority: "normal" },
      { type: "sent", isRead: true, priority: "normal" },
    ];
    expect(calculateMessageStats(messages).total).toBe(2);
  });

  it("counts received messages", () => {
    const messages = [
      { type: "received", isRead: true, priority: "normal" },
      { type: "sent", isRead: true, priority: "normal" },
      { type: "received", isRead: false, priority: "normal" },
    ];
    expect(calculateMessageStats(messages).received).toBe(2);
  });

  it("counts sent messages", () => {
    const messages = [
      { type: "received", isRead: true, priority: "normal" },
      { type: "sent", isRead: true, priority: "normal" },
      { type: "sent", isRead: true, priority: "normal" },
    ];
    expect(calculateMessageStats(messages).sent).toBe(2);
  });

  it("counts unread received messages only", () => {
    const messages = [
      { type: "received", isRead: false, priority: "normal" },
      { type: "received", isRead: true, priority: "normal" },
      { type: "sent", isRead: false, priority: "normal" }, // sent unread should not count
    ];
    expect(calculateMessageStats(messages).unread).toBe(1);
  });

  it("counts high priority messages", () => {
    const messages = [
      { type: "received", isRead: true, priority: "high" },
      { type: "sent", isRead: true, priority: "normal" },
      { type: "received", isRead: false, priority: "high" },
    ];
    expect(calculateMessageStats(messages).highPriority).toBe(2);
  });

  it("handles comprehensive data correctly", () => {
    const messages = [
      { type: "received", isRead: false, priority: "high" },
      { type: "received", isRead: true, priority: "normal" },
      { type: "sent", isRead: true, priority: "normal" },
      { type: "sent", isRead: true, priority: "high" },
      { type: "received", isRead: false, priority: "normal" },
    ];
    const stats = calculateMessageStats(messages);
    expect(stats.total).toBe(5);
    expect(stats.received).toBe(3);
    expect(stats.sent).toBe(2);
    expect(stats.unread).toBe(2);
    expect(stats.highPriority).toBe(2);
  });
});

describe("CATEGORY_CONFIG", () => {
  const categories: MessageCategory[] = [
    "Academic",
    "Fee",
    "Event",
    "General",
    "Complaint",
    "Inquiry",
  ];

  it("has config for all 6 categories", () => {
    expect(Object.keys(CATEGORY_CONFIG)).toHaveLength(6);
  });

  it.each(categories)("has bg and text classes for %s category", (category) => {
    expect(CATEGORY_CONFIG[category]).toBeDefined();
    expect(CATEGORY_CONFIG[category].bg).toBeTruthy();
    expect(CATEGORY_CONFIG[category].text).toBeTruthy();
  });
});

describe("MESSAGE_SORT_OPTIONS", () => {
  it("has 5 sort options", () => {
    expect(MESSAGE_SORT_OPTIONS).toHaveLength(5);
  });

  it("has correct option values", () => {
    const values = MESSAGE_SORT_OPTIONS.map((o) => o.value);
    expect(values).toEqual(["newest", "oldest", "priority", "sender_asc", "sender_desc"]);
  });
});

describe("DEFAULT_MESSAGE_FILTER_FIELDS", () => {
  it("has 4 filter fields", () => {
    expect(DEFAULT_MESSAGE_FILTER_FIELDS).toHaveLength(4);
  });

  it("includes type, status, category, and priority filters", () => {
    const ids = DEFAULT_MESSAGE_FILTER_FIELDS.map((f) => f.id);
    expect(ids).toEqual(["type", "status", "category", "priority"]);
  });

  it("type filter has Received and Sent options", () => {
    const typeField = DEFAULT_MESSAGE_FILTER_FIELDS.find((f) => f.id === "type");
    expect(typeField?.options).toEqual(["Received", "Sent"]);
  });

  it("category filter has all 6 categories", () => {
    const categoryField = DEFAULT_MESSAGE_FILTER_FIELDS.find((f) => f.id === "category");
    expect(categoryField?.options).toEqual([
      "Academic",
      "Fee",
      "Event",
      "General",
      "Complaint",
      "Inquiry",
    ]);
  });

  it("priority filter has High, Normal, Low", () => {
    const priorityField = DEFAULT_MESSAGE_FILTER_FIELDS.find((f) => f.id === "priority");
    expect(priorityField?.options).toEqual(["High", "Normal", "Low"]);
  });
});
