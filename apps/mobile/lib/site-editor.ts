/**
 * The website builder inside the app: a WebView over the web editor (CLAUDE.md rule 20 — never a second renderer).
 * Research: docs/web-anatomy/tablet-and-app-editing.md §2 E, §5 rec. 6.
 *
 * ponytail: no sign-in is handed over — the web has no accounts yet (BATCH E-5d, the user's decision 2026-10-07).
 * The editor saves to the WebView's own storage, which survives the app being killed.
 */

/** Where the editor is served. In development: `next start` on this PC, reached through `adb reverse tcp:3100 tcp:3100`. */
export const EDITOR_ORIGIN = (process.env.EXPO_PUBLIC_EDITOR_URL ?? 'http://localhost:3100').replace(/\/+$/, '');

/** The editor's address; `theme` makes the web editor wear the app's theme (contexts/ThemeContext.tsx on the web reads it). */
export function editorUrl(theme: string, origin: string = EDITOR_ORIGIN): string {
  return `${origin}/website/box-demo?theme=${encodeURIComponent(theme)}`;
}

/** Every scheme the WebView hands to `routeNavigation`. react-native-webview sends anything else straight to `Linking` without
 *  asking (`tel:`, `mailto:`, `whatsapp:` — right for them) — `educo://` too, which Expo Go cannot open (E5d-5, measured). */
export const ORIGIN_WHITELIST = ['http://*', 'https://*', 'educo://*'];

export type Navigation =
  | { kind: 'load' }
  | { kind: 'native'; path: string }
  | { kind: 'browser' };

/**
 * What a top-frame navigation inside the editor does: our own editor loads in place; an `educo://` link opens that
 * screen of the app (Fees, Messages, Reports…); anything else leaves for the system browser, so a page we do not own
 * never runs inside the app (Android WebView guide: a bridge to untrusted pages is dangerous).
 */
export function routeNavigation(url: string, origin: string = EDITOR_ORIGIN): Navigation {
  if (url.startsWith('educo://')) {
    const path = '/' + url.slice('educo://'.length).replace(/^\/+/, '');
    return { kind: 'native', path };
  }
  if (url === 'about:blank') return { kind: 'load' };
  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return { kind: 'browser' };
  }
  return target.origin === new URL(origin).origin ? { kind: 'load' } : { kind: 'browser' };
}

/** Run in the page when the app leaves the foreground: the editor saves what is being typed on `pagehide`
 *  (components/website/sections/SectionKit.tsx), which a WebView never fires on its own (E5d-4, measured). */
export const FLUSH_ON_HIDE = "window.dispatchEvent(new Event('pagehide'));true;";
