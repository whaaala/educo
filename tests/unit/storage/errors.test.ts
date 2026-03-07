import { describe, expect, it } from "vitest";
import { StorageQuotaExceededError } from "@/lib/services/storage/errors";

describe("StorageQuotaExceededError", () => {
  it("creates error with correct properties", () => {
    const err = new StorageQuotaExceededError(
      50 * 1024 * 1024, // 50 MB used
      100 * 1024 * 1024, // 100 MB limit
      20 * 1024 * 1024 // 20 MB file
    );

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(StorageQuotaExceededError);
    expect(err.name).toBe("StorageQuotaExceededError");
    expect(err.currentUsage).toBe(50 * 1024 * 1024);
    expect(err.quotaLimit).toBe(100 * 1024 * 1024);
    expect(err.attemptedSize).toBe(20 * 1024 * 1024);
  });

  it("generates readable error message with MB values", () => {
    const err = new StorageQuotaExceededError(
      90 * 1024 * 1024,
      100 * 1024 * 1024,
      15 * 1024 * 1024
    );

    expect(err.message).toContain("90.0 MB");
    expect(err.message).toContain("100.0 MB");
    expect(err.message).toContain("15.0 MB");
    expect(err.message).toContain("Connect Dropbox");
  });

  it("handles zero values", () => {
    const err = new StorageQuotaExceededError(0, 0, 0);

    expect(err.currentUsage).toBe(0);
    expect(err.quotaLimit).toBe(0);
    expect(err.attemptedSize).toBe(0);
    expect(err.message).toContain("0.0 MB");
  });

  it("handles large values correctly", () => {
    const err = new StorageQuotaExceededError(
      1024 * 1024 * 1024, // 1 GB
      1024 * 1024 * 1024,
      500 * 1024 * 1024
    );

    expect(err.currentUsage).toBe(1024 * 1024 * 1024);
    expect(err.message).toContain("1024.0 MB");
  });
});
