/**
 * Nuclear media cleanup utility
 * Stops ALL active media tracks in the browser to release camera/microphone immediately
 */

// Keep track of all streams we've created for cleanup
const activeStreams: Set<MediaStream> = new Set();

/**
 * Register a stream for tracking (call this whenever you create a stream)
 */
export function registerStream(stream: MediaStream): void {
  activeStreams.add(stream);
}

/**
 * Unregister a stream (call this when you've manually stopped it)
 */
export function unregisterStream(stream: MediaStream): void {
  activeStreams.delete(stream);
}

/**
 * NUCLEAR: Stop ALL media tracks everywhere
 * This will:
 * 1. Stop all tracked streams
 * 2. Stop all video element sources
 * 3. Stop all audio element sources
 */
export function stopAllMediaTracks(): void {
  console.log('[stopAllMedia] Starting NUCLEAR cleanup...');

  // 0. FIRST: Try to get ALL active media devices and stop them directly
  // This is the most aggressive approach - gets any stream that exists
  if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
    // Check if there's a way to enumerate active streams (some browsers support this)
    try {
      // @ts-expect-error - experimental API
      if (navigator.mediaDevices.getAllUserMedia) {
        // @ts-expect-error - experimental API
        navigator.mediaDevices.getAllUserMedia().then((streams: MediaStream[]) => {
          streams.forEach(s => s.getTracks().forEach(t => t.stop()));
        }).catch(() => {});
      }
    } catch {
      // Ignore - experimental API
    }
  }

  // 1. Stop all tracked streams
  console.log('[stopAllMedia] Tracked streams count:', activeStreams.size);
  activeStreams.forEach(stream => {
    stream.getTracks().forEach(track => {
      console.log('[stopAllMedia] Tracked track state:', track.kind, track.label, track.readyState);
      track.stop();
    });
  });
  activeStreams.clear();

  // 2. Stop all video elements
  if (typeof document !== 'undefined') {
    const videos = document.querySelectorAll('video');
    console.log('[stopAllMedia] Found video elements:', videos.length);

    videos.forEach((video, idx) => {
      if (video.srcObject) {
        console.log('[stopAllMedia] Video', idx, 'has srcObject');
        if (video.srcObject instanceof MediaStream) {
          const stream = video.srcObject;
          const tracks = stream.getTracks();
          console.log('[stopAllMedia] Video', idx, 'tracks:', tracks.length);

          // Stop each track AND remove it from the stream
          tracks.forEach(track => {
            console.log('[stopAllMedia] Stopping video track:', track.kind, track.label, 'state:', track.readyState);
            track.stop();
            stream.removeTrack(track);
          });
        }
        video.srcObject = null;
        // Also pause the video element
        video.pause();
        video.load();

        // Aggressive: remove src attribute entirely
        video.removeAttribute('src');
      }
    });

    // 2b. Force garbage collection hint by nullifying references
    // Create a brief detach/reattach cycle for stubborn video elements
    videos.forEach((video) => {
      const parent = video.parentNode;
      if (parent && video.srcObject === null) {
        const nextSibling = video.nextSibling;
        parent.removeChild(video);
        // Re-add after a microtask to force browser to release
        queueMicrotask(() => {
          if (nextSibling) {
            parent.insertBefore(video, nextSibling);
          } else {
            parent.appendChild(video);
          }
        });
      }
    });

    // 3. Stop all audio elements with srcObject
    const audios = document.querySelectorAll('audio');
    console.log('[stopAllMedia] Found audio elements:', audios.length);

    audios.forEach((audio, idx) => {
      if (audio.srcObject && audio.srcObject instanceof MediaStream) {
        const stream = audio.srcObject;
        const tracks = stream.getTracks();
        console.log('[stopAllMedia] Audio', idx, 'tracks:', tracks.length);

        tracks.forEach(track => {
          console.log('[stopAllMedia] Stopping audio track:', track.kind, track.label, 'state:', track.readyState);
          track.stop();
          stream.removeTrack(track);
        });
        audio.srcObject = null;
        audio.pause();
        audio.load();
      }
    });
  }

  console.log('[stopAllMedia] NUCLEAR cleanup complete');

  // WORKAROUND: Request and immediately release a dummy stream
  // This can help flush the browser's media pipeline and release hardware faster
  // We do this synchronously before any async operations
  if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
    // Try video first (for camera indicator), then audio
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(dummyStream => {
        // Stop immediately in the same tick
        dummyStream.getTracks().forEach(t => {
          t.stop();
          t.enabled = false;
        });
        console.log('[stopAllMedia] Dummy video+audio stream flushed');
      })
      .catch(() => {
        // Try audio-only as fallback
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then(audioStream => {
            audioStream.getTracks().forEach(t => {
              t.stop();
              t.enabled = false;
            });
            console.log('[stopAllMedia] Dummy audio stream flushed');
          })
          .catch(() => {
            // Ignore errors - this is just a flush attempt
          });
      });
  }
}

/**
 * Wrapper for getUserMedia that automatically tracks the stream
 */
export async function getTrackedUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  registerStream(stream);
  return stream;
}

/**
 * Stop a specific stream and unregister it
 */
export function stopStream(stream: MediaStream | null): void {
  if (!stream) return;

  stream.getTracks().forEach(track => {
    if (track.readyState === 'live') {
      track.stop();
    }
  });
  unregisterStream(stream);
}
