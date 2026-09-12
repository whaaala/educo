/**
 * timer — pure time formatting for the shared Presenter view.
 *
 * No DOM, no React — so the elapsed/clock formatting is unit-testable and reusable by any
 * surface that needs a presenter timer (slides today; a lesson player or webinar mode later).
 */

/** Format an elapsed duration (ms) as H:MM:SS, dropping the hour when it's zero. */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Format a clock time (Date) as a locale-independent 12-hour "h:mm AM/PM". */
export function formatClock(d: Date): string {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}
