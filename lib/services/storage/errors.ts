/**
 * Storage Error Classes
 *
 * Custom errors for storage operations, particularly quota management.
 */

/** Thrown when a user's Supabase storage quota is exceeded during upload */
export class StorageQuotaExceededError extends Error {
  /** Current usage in bytes */
  currentUsage: number;
  /** Quota limit in bytes */
  quotaLimit: number;
  /** Size of the file that was attempted to upload, in bytes */
  attemptedSize: number;

  constructor(currentUsage: number, quotaLimit: number, attemptedSize: number) {
    const usedMb = (currentUsage / (1024 * 1024)).toFixed(1);
    const limitMb = (quotaLimit / (1024 * 1024)).toFixed(1);
    const fileMb = (attemptedSize / (1024 * 1024)).toFixed(1);

    super(
      `Storage quota exceeded: ${usedMb} MB used of ${limitMb} MB. ` +
      `Cannot upload file of ${fileMb} MB. Connect Dropbox for additional storage.`
    );

    this.name = "StorageQuotaExceededError";
    this.currentUsage = currentUsage;
    this.quotaLimit = quotaLimit;
    this.attemptedSize = attemptedSize;
  }
}
