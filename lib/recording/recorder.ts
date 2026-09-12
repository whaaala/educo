/**
 * recorder — pure helpers for the shared screen recorder.
 *
 * The MediaRecorder / getDisplayMedia calls are DOM-only and live in the React hook
 * (components/shared/useScreenRecorder). Everything decidable WITHOUT the DOM lives here so it's
 * unit-testable and reusable: choosing the best supported container/codec, and naming the file.
 */

/** Candidate MIME types, best → most compatible. */
export const RECORDING_MIME_CANDIDATES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
  "video/mp4",
];

/**
 * Pick the first candidate the platform supports. `isSupported` is injected (defaults to
 * MediaRecorder.isTypeSupported) so this stays pure and testable. Returns "" when none match —
 * callers then let MediaRecorder choose its own default.
 */
export function pickRecordingMime(
  candidates: string[] = RECORDING_MIME_CANDIDATES,
  isSupported?: (t: string) => boolean,
): string {
  const check =
    isSupported ||
    (typeof MediaRecorder !== "undefined" && typeof MediaRecorder.isTypeSupported === "function"
      ? (t: string) => MediaRecorder.isTypeSupported(t)
      : () => false);
  for (const t of candidates) {
    try {
      if (check(t)) return t;
    } catch {
      /* ignore unsupported query */
    }
  }
  return "";
}

/** File extension implied by a recording MIME type. */
export function extensionForMime(mime: string): string {
  return /mp4/i.test(mime) ? "mp4" : "webm";
}

/** Build a safe download filename, e.g. "My deck — recording 2025-01-02.webm". */
export function recordingFilename(title: string | undefined, mime: string, date: Date): string {
  const base = (title || "recording").trim().replace(/[\\/:*?"<>|]+/g, "").slice(0, 60) || "recording";
  const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return `${base} — recording ${ymd}.${extensionForMime(mime)}`;
}
