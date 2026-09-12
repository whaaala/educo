"use client";

/**
 * useScreenRecorder — the shared screen-recording hook.
 *
 * Wraps getDisplayMedia + MediaRecorder so any editor (presentation, whiteboard, doc, a lesson
 * player) can offer "record my screen" with one hook. All the platform-decidable logic (codec
 * pick, filename) is delegated to the pure `lib/recording/recorder` module.
 *
 *   const rec = useScreenRecorder({ title });
 *   rec.supported ? <button onClick={rec.recording ? rec.stop : rec.start}/> : null
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { pickRecordingMime, recordingFilename } from "@/lib/recording/recorder";

export interface UseScreenRecorderOptions {
  /** Used to name the downloaded file. */
  title?: string;
  /** Also capture microphone audio and mix it in. Default false. */
  captureMic?: boolean;
  /** Called with the finished recording (in addition to the automatic download). */
  onComplete?: (blob: Blob, filename: string) => void;
}

export interface ScreenRecorderApi {
  supported: boolean;
  recording: boolean;
  /** Seconds elapsed while recording. */
  elapsed: number;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
}

const isSupported = () =>
  typeof navigator !== "undefined" &&
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getDisplayMedia === "function" &&
  typeof MediaRecorder !== "undefined";

export function useScreenRecorder(opts: UseScreenRecorderOptions = {}): ScreenRecorderApi {
  const { title, captureMic = false, onComplete } = opts;
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(0);

  useEffect(() => { setSupported(isSupported()); }, []);

  const cleanup = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  const stop = useCallback(() => {
    // Stopping the recorder fires onstop, which assembles + downloads the file.
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
  }, []);

  const start = useCallback(async () => {
    if (!isSupported()) { setError("Screen recording isn’t supported in this browser."); return; }
    setError(null);
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      let stream = display;
      if (captureMic) {
        try {
          const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream = new MediaStream([...display.getVideoTracks(), ...display.getAudioTracks(), ...mic.getAudioTracks()]);
        } catch { /* mic denied — carry on with screen audio only */ }
      }
      streamRef.current = stream;

      const mimeType = pickRecordingMime();
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = rec;
      chunksRef.current = [];

      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const type = rec.mimeType || mimeType || "video/webm";
        const blob = new Blob(chunksRef.current, { type });
        const filename = recordingFilename(title, type, new Date());
        // auto-download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        onComplete?.(blob, filename);
        setRecording(false);
        setElapsed(0);
        cleanup();
      };

      // If the user stops sharing via the browser's own control, end gracefully.
      display.getVideoTracks()[0]?.addEventListener("ended", stop);

      rec.start(1000); // gather data every second
      startedRef.current = Date.now();
      setElapsed(0);
      setRecording(true);
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startedRef.current) / 1000)), 500);
    } catch (e) {
      // getDisplayMedia rejects if the user cancels the picker — not an error worth shouting about.
      const msg = (e as Error)?.name === "NotAllowedError" ? null : "Couldn’t start screen recording.";
      setError(msg);
      cleanup();
    }
  }, [captureMic, title, onComplete, stop, cleanup]);

  useEffect(() => cleanup, [cleanup]);

  return { supported, recording, elapsed, error, start, stop };
}
