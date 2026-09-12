import { describe, it, expect } from "vitest";
import {
  pickRecordingMime, extensionForMime, recordingFilename, RECORDING_MIME_CANDIDATES,
} from "@/lib/recording/recorder";

describe("recorder — pickRecordingMime", () => {
  it("returns the first supported candidate", () => {
    const supported = new Set(["video/webm;codecs=vp8,opus", "video/webm"]);
    const picked = pickRecordingMime(RECORDING_MIME_CANDIDATES, (t) => supported.has(t));
    expect(picked).toBe("video/webm;codecs=vp8,opus");
  });

  it("prefers the best (earliest) candidate", () => {
    const picked = pickRecordingMime(["a", "b", "c"], (t) => t !== "a"); // a unsupported
    expect(picked).toBe("b");
  });

  it("returns '' when nothing is supported (let MediaRecorder default)", () => {
    expect(pickRecordingMime(["x", "y"], () => false)).toBe("");
  });

  it("survives an isSupported that throws", () => {
    expect(pickRecordingMime(["x"], () => { throw new Error("boom"); })).toBe("");
  });
});

describe("recorder — extensionForMime", () => {
  it("maps mp4 vs webm", () => {
    expect(extensionForMime("video/mp4")).toBe("mp4");
    expect(extensionForMime("video/webm;codecs=vp9")).toBe("webm");
    expect(extensionForMime("")).toBe("webm");
  });
});

describe("recorder — recordingFilename", () => {
  const d = new Date(2025, 0, 2); // 2 Jan 2025
  it("builds a dated, extensioned name", () => {
    expect(recordingFilename("My Deck", "video/webm", d)).toBe("My Deck — recording 2025-01-02.webm");
    expect(recordingFilename("Demo", "video/mp4", d)).toBe("Demo — recording 2025-01-02.mp4");
  });
  it("sanitises illegal filename characters", () => {
    expect(recordingFilename('a/b:c*?"<>|d', "video/webm", d)).toBe("abcd — recording 2025-01-02.webm");
  });
  it("falls back to 'recording' for blank titles", () => {
    expect(recordingFilename("   ", "video/webm", d)).toBe("recording — recording 2025-01-02.webm");
    expect(recordingFilename(undefined, "video/webm", d)).toBe("recording — recording 2025-01-02.webm");
  });
});
