/**
 * SELF-HOSTED FONTS FOR THE EXPORT.
 *
 * THE BUG THIS EXISTS FOR. The builder loads ~48 Google font families, so a school picks Poppins and sees
 * Poppins. The exported site loaded NO font files at all — no link, no @font-face — so every visitor got the
 * browser's default sans-serif. The one design decision a school is most likely to care about was silently
 * discarded at the moment it mattered, and nothing in the builder hinted at it.
 *
 * WHY EMBEDDED RATHER THAN A LINK TO GOOGLE. A `<link>` to fonts.googleapis.com is the smaller change and is
 * what most builders do, but it discloses every visitor's IP address to a third party. For a school — whose
 * visitors are largely parents and children, and which is held to a high bar on data protection — that is a
 * liability the product should not create on their behalf without asking. A German court has already fined a
 * site owner over exactly this. Embedding removes the question rather than answering it.
 *
 * It also keeps a promise the export already made: open it from a folder or a USB stick and it is complete.
 * A linked font breaks that for the most visible part of the design.
 *
 * ONLY WHAT IS USED. A site using two families ships two families, not the library. The weights are the ones
 * the product can actually apply (regular and bold), in `woff2`, which every browser in use supports.
 */

/** Families that need no loading — they are already on the device. */
const SYSTEM_STACKS = /^(system-ui|ui-|-apple-system|BlinkMacSystemFont|Segoe UI|Helvetica|Arial|sans-serif|serif|monospace|cursive|fantasy|Times|Courier|Georgia|Verdana|Tahoma|Roboto Mono)$/i;

/**
 * The first family named in a CSS font stack, unquoted.
 *
 * A stack is `'DM Sans', sans-serif` — the first entry is the one a school chose and the rest is the fallback
 * that applies when it cannot load. Only the first is worth embedding.
 */
export function primaryFamily(stack?: string): string | null {
  if (!stack) return null;
  const first = stack.split(",")[0]?.trim().replace(/^['"]|['"]$/g, "");
  if (!first || SYSTEM_STACKS.test(first)) return null;
  // A family name Google would accept: letters, digits and spaces. Anything else is a stack we did not write.
  return /^[A-Za-z0-9][A-Za-z0-9 ]*$/.test(first) ? first : null;
}

/** Every web font family a set of CSS font stacks actually asks for, de-duplicated and ordered. */
export function familiesInUse(stacks: (string | undefined)[]): string[] {
  const out = new Set<string>();
  for (const s of stacks) {
    const f = primaryFamily(s);
    if (f) out.add(f);
  }
  return [...out].sort();
}

/** The Google Fonts CSS2 request for these families, at the weights the builder can apply. */
export function googleCssUrl(families: string[]): string {
  const spec = families
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:ital,wght@0,400;0,700;1,400;1,700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${spec}&display=swap`;
}

/** Every `url(...)` target in a stylesheet, in order. */
export function fontUrls(css: string): string[] {
  return [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);
}

const b64 = (bytes: ArrayBuffer): string => {
  const arr = new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  // btoa exists in the browser, which is the only place an export runs.
  return typeof btoa === "function" ? btoa(s) : Buffer.from(arr).toString("base64");
};

export type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

/**
 * Fetch the @font-face rules for these families, every face file they name, and rewrite each URL with `rewrite`.
 *
 * Returns null rather than throwing when anything fails. A font that cannot be fetched must not stop a school
 * downloading their site: the stack's fallback still applies, so the page is readable in a near-enough
 * typeface instead of not existing. `display: swap` comes from the request, so text is never invisible while
 * a font loads.
 */
async function fetchFaces(families: string[], rewrite: (url: string, bytes: ArrayBuffer) => string, fetchImpl?: Fetcher): Promise<string | null> {
  if (!families.length) return null;
  const doFetch = fetchImpl ?? (typeof fetch === "function" ? fetch : null);
  if (!doFetch) return null;
  try {
    // The CSS2 endpoint returns woff2 only when the request looks like a modern browser; Node's default
    // user-agent gets a legacy ttf format back, which is several times the size.
    const res = await doFetch(googleCssUrl(families), {
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" },
    });
    if (!res.ok) return null;
    let css = await res.text();
    const urls = [...new Set(fontUrls(css))];
    const fetched = await Promise.all(
      urls.map(async (u) => {
        const r = await doFetch(u);
        if (!r.ok) throw new Error(`font ${u}: ${r.status}`);
        return [u, rewrite(u, await r.arrayBuffer())] as const;
      }),
    );
    for (const [url, to] of fetched) css = css.split(url).join(to);
    // Any URL that survived would be an external request we promised not to make.
    return fontUrls(css).length ? null : css;
  } catch {
    return null;
  }
}

/**
 * The faces with every font as a `data:` URI — for the PREVIEW, a srcdoc frame with no folder to fetch files from.
 * "" when anything fails (see `fetchFaces`).
 */
export async function embedFontCss(families: string[], fetchImpl?: Fetcher): Promise<string> {
  return (await fetchFaces(families, (_u, bytes) => `data:font/woff2;base64,${b64(bytes)}`, fetchImpl)) ?? "";
}

/** Where a face file sits in the download: `fonts/<family folder>-<Google's file name>`, unique per face. */
export function fontFileName(url: string): string {
  const parts = new URL(url).pathname.split("/").filter(Boolean); // s / poppins / v22 / pxiEyp8kv8JHgFVrJJfecg.woff2
  return `fonts/${[parts[1], parts[parts.length - 1]].filter(Boolean).join("-").replace(/[^A-Za-z0-9._-]/g, "-")}`;
}

/**
 * The faces for the DOWNLOAD (RA-7): each font is its own file under `fonts/`, and the CSS points at it.
 *
 * Embedded, every face of every subset Google returns (Latin, Latin-ext, Vietnamese, Cyrillic, Greek…) rode inside
 * `styles.css` — 454 KB measured before any text could show (T4). As files, each `@font-face` keeps its
 * `unicode-range`, so a browser downloads only the files whose letters the page actually contains: an English page
 * fetches the Latin faces (~44 KB), and a page with Yoruba ẹ ọ ṣ, Hausa ɓ ɗ ƙ or Twi ɛ ɔ also fetches the one
 * subset that holds them (A1-2) — instead of drawing those letters in a fallback font mid-word.
 */
export async function fontFiles(families: string[], fetchImpl?: Fetcher): Promise<{ css: string; files: Record<string, Uint8Array> }> {
  const files: Record<string, Uint8Array> = {};
  const css = await fetchFaces(families, (u, bytes) => {
    const name = fontFileName(u);
    files[name] = new Uint8Array(bytes);
    return name;
  }, fetchImpl);
  return css ? { css, files } : { css: "", files: {} };
}
