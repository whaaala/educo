import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { formatChatTime } from "@/components/shared/chat/ChatCard";
import { calculateChatStats } from "@/components/shared/chat/ChatStats";
import {
  CHAT_SORT_OPTIONS,
  DEFAULT_CHAT_FILTER_FIELDS,
} from "@/components/shared/chat/types";

describe("formatChatTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set "now" to 2026-02-27T12:00:00
    vi.setSystemTime(new Date("2026-02-27T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats today's time with hour and minute", () => {
    const result = formatChatTime("2026-02-27T09:30:00");
    // Should return something like "9:30 AM"
    expect(result).toMatch(/9:30\s*AM/i);
  });

  it("returns 'Yesterday' for yesterday's messages", () => {
    // Must be >= 24h before "now" (12:00) to register as 1 day
    const result = formatChatTime("2026-02-26T08:00:00");
    expect(result).toBe("Yesterday");
  });

  it("returns weekday name for messages 2-6 days ago", () => {
    // 3 days ago = Tuesday
    const result = formatChatTime("2026-02-24T10:00:00");
    expect(result).toBe("Tue");
  });

  it("returns date for messages older than 7 days", () => {
    const result = formatChatTime("2026-02-15T10:00:00");
    // Should be "15 Feb" format (en-GB)
    expect(result).toMatch(/15 Feb/);
  });
});

describe("calculateChatStats", () => {
  it("returns zero stats for empty array", () => {
    const stats = calculateChatStats([]);
    expect(stats).toEqual({
      total: 0,
      active: 0,
      unread: 0,
      totalUnreadMessages: 0,
    });
  });

  it("counts total conversations", () => {
    const conversations = [
      { isOnline: false, unreadCount: 0 },
      { isOnline: false, unreadCount: 0 },
      { isOnline: false, unreadCount: 0 },
    ];
    expect(calculateChatStats(conversations).total).toBe(3);
  });

  it("counts active (online) conversations", () => {
    const conversations = [
      { isOnline: true, unreadCount: 0 },
      { isOnline: false, unreadCount: 0 },
      { isOnline: true, unreadCount: 0 },
    ];
    expect(calculateChatStats(conversations).active).toBe(2);
  });

  it("counts conversations with unread messages", () => {
    const conversations = [
      { isOnline: false, unreadCount: 3 },
      { isOnline: false, unreadCount: 0 },
      { isOnline: false, unreadCount: 1 },
    ];
    expect(calculateChatStats(conversations).unread).toBe(2);
  });

  it("sums total unread messages", () => {
    const conversations = [
      { isOnline: false, unreadCount: 5 },
      { isOnline: false, unreadCount: 0 },
      { isOnline: false, unreadCount: 3 },
    ];
    expect(calculateChatStats(conversations).totalUnreadMessages).toBe(8);
  });

  it("handles mixed data correctly", () => {
    const conversations = [
      { isOnline: true, unreadCount: 2 },
      { isOnline: false, unreadCount: 0 },
      { isOnline: true, unreadCount: 0 },
      { isOnline: false, unreadCount: 5 },
    ];
    const stats = calculateChatStats(conversations);
    expect(stats.total).toBe(4);
    expect(stats.active).toBe(2);
    expect(stats.unread).toBe(2);
    expect(stats.totalUnreadMessages).toBe(7);
  });
});

describe("CHAT_SORT_OPTIONS", () => {
  it("has 5 sort options", () => {
    expect(CHAT_SORT_OPTIONS).toHaveLength(5);
  });

  it("has correct option values", () => {
    const values = CHAT_SORT_OPTIONS.map((o) => o.value);
    expect(values).toEqual(["recent", "oldest", "unread", "name_asc", "name_desc"]);
  });
});

describe("DEFAULT_CHAT_FILTER_FIELDS", () => {
  it("has status and messages filters", () => {
    const ids = DEFAULT_CHAT_FILTER_FIELDS.map((f) => f.id);
    expect(ids).toContain("status");
    expect(ids).toContain("messages");
  });

  it("status filter has Online and Offline options", () => {
    const statusField = DEFAULT_CHAT_FILTER_FIELDS.find((f) => f.id === "status");
    expect(statusField?.options).toEqual(["Online", "Offline"]);
  });

  it("messages filter has Unread and Read options", () => {
    const messagesField = DEFAULT_CHAT_FILTER_FIELDS.find((f) => f.id === "messages");
    expect(messagesField?.options).toEqual(["Unread", "Read"]);
  });
});
