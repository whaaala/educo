/**
 * The app's own window events, declared so listeners do not need a cast.
 *
 * `window.addEventListener("schoolProfileChanged", …)` was written as `"schoolProfileChanged" as any` in eight
 * places — and `as any` on the event NAME switches off checking of the handler too. That is how a listener in
 * ExamResults came to destructure `educationLevel` from a detail that only ever carried `educationLevels`:
 * the value was always `undefined`, so the screen never reacted to a school-profile change at all.
 *
 * Declaring the events on WindowEventMap is the supported way to say they exist, and it makes the payload a
 * checked contract between whoever dispatches and whoever listens.
 */
declare global {
  interface WindowEventMap {
    /** School profile saved. Dispatched by SchoolProfileSettings. */
    schoolProfileChanged: CustomEvent<{
      /** Every level the school now supports — an ARRAY, not a single level. */
      educationLevels: string[];
      institutionType: string;
      tertiaryType?: string;
      scheduleType?: string;
    }>;
    /** The school's TYPE changed. Dispatched by FeeSettings. */
    schoolTypeChanged: CustomEvent<{ schoolType: string }>;
    /** Bank details saved. Carries no payload — listeners re-read storage. */
    bankAccountChanged: Event;
  }
}

export {};
