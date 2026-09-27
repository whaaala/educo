# Media & Performance — images, video, embeds, fonts, Core Web Vitals

> Part of the web-anatomy research register ([README.md](README.md)). The builder is general-purpose (schools
> first, decoupled later); school requirements appear as one layer (privacy, accessibility statement). Every
> section cites the sources it was built from, read on 2026-09-27. Where this document states a rule for the
> builder's **export**, it is a rule the export can check or enforce automatically — see §6 and §7.

A note on this project's units rule (CLAUDE.md rule 16): the `width` and `height` **attributes** on `<img>`,
`<video>`, `<source>` and `<iframe>` are unitless integers that describe the resource's *intrinsic* size so the
browser can compute an aspect ratio before the file arrives. They are not a layout length and never reach the
rendered box when CSS sets `width: 100%; height: auto`. The rendered size stays `%` + `aspect-ratio` + `rem`.
The units guard must treat these attributes as metadata, not as a stored pixel.

---

## 1. Images

### 1.1 Markup

The minimum correct image:

```html
<img src="hall-800.jpg" width="1600" height="1067" alt="Year 6 pupils rehearsing the summer play in the hall">
```

- `alt` is required in practice. The HTML standard distinguishes: **non-empty `alt`** = the image is content and
  `alt` is its textual equivalent; **`alt=""`** = decorative/supplemental, may be omitted from rendering and is
  mapped to role `presentation`; **missing `alt`** = "no text alternative was available at publication time",
  which is a defect for a builder that can always ask. An `img` with non-empty `alt` has role `img`.
- `width`/`height` are integers without units. Their job is layout stability (§1.4).
- `title` is not a substitute for `alt` and duplicating the alt in `title` causes double announcements.
  Captions belong in `<figure>` + `<figcaption>`, not `title`.
- SVG in an `<img>`: add `role="img"` to work around a VoiceOver bug (MDN).
- `crossorigin` is only needed when the image will be read back into a `<canvas>`. `referrerpolicy` defaults to
  `strict-origin-when-cross-origin`; a builder hosting its own media needs neither.

Sources: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img ·
https://html.spec.whatwg.org/multipage/embedded-content.html

### 1.2 Responsive sources — `srcset`, `sizes`, `<picture>`

**Resolution switching** (the same picture at several widths) uses `srcset` with `w` descriptors plus `sizes`:

```html
<img srcset="hall-480.avif 480w, hall-800.avif 800w, hall-1600.avif 1600w"
     sizes="(width <= 37.5em) 100vw, (width <= 75em) 50vw, 37.5rem"
     src="hall-800.jpg" width="1600" height="1067" alt="…">
```

- `480w` is the file's **intrinsic** width. `sizes` is a list of `(media condition) slot-width`, first match
  wins, last entry has no condition. Slot widths are CSS lengths (`vw`, `rem`, `px`, `calc()`), **never `%`**.
  The default when `sizes` is missing is `100vw`, which makes the browser over-download for anything narrower
  than the viewport.
- The browser picks the smallest candidate at least as large as `slot × devicePixelRatio`.
- `x` descriptors (`1.5x`, `2x`) are for fixed-size images (a logo) and take no `sizes`. `w` and `x` cannot be
  mixed in one `srcset`.
- `sizes="auto"` lets the browser use the laid-out size, but **only with `loading="lazy"`**, and needs a fallback
  list after it: `sizes="auto, (max-width: 30em) 100vw, 50vw"`.
- Image choice happens in the preload scanner, before CSS and JS run. Switching images with JS is always
  slower; the markup must carry the choice.

**Format switching and art direction** use `<picture>`. Content model: zero or more `<source>`, then exactly one
`<img>` (which carries `alt`, `width`, `height`, `loading`, `fetchpriority`). `<source>` accepts `srcset`, `sizes`,
`media`, `type`, and its own `width`/`height` (so an art-directed crop can reserve a different ratio). The first
matching `<source>` wins, so order most specific first.

```html
<picture>
  <source media="(width < 37.5em)" type="image/avif" srcset="hero-crop-600.avif 600w, hero-crop-1200.avif 1200w" sizes="100vw" width="1200" height="1500">
  <source type="image/avif" srcset="hero-1200.avif 1200w, hero-2400.avif 2400w" sizes="100vw">
  <source type="image/webp" srcset="hero-1200.webp 1200w, hero-2400.webp 2400w" sizes="100vw">
  <img src="hero-1200.jpg" width="2400" height="1200" alt="…" fetchpriority="high">
</picture>
```

MDN caveat: don't combine `media` on `<source>` with `sizes`-based switching in a way that duplicates the same
decision; use `media` for *different crops*, `w` + `sizes` for *different sizes of one crop*.

Sources: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images ·
https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element

### 1.3 Formats

| Content | Serve | Fallback | Notes |
|---|---|---|---|
| Photograph | AVIF | WebP → JPEG | AVIF ≈ 50% smaller than JPEG; no progressive rendering. WebP 25–35% smaller than JPEG |
| Graphic with transparency | WebP (lossless) or AVIF | PNG | PNG only as fallback |
| Screenshot, diagram, line art | SVG if vector, else lossless WebP | PNG | |
| Icon, logo | SVG | PNG | Prioritise SVG whenever a vector exists |
| Animation | `<video>` (MP4/WebM) or animated AVIF/WebP | — | Never GIF: 256 colours, multi-megabyte files |

MDN: "For raster images, prefer WebP or AVIF… For diagrams, charts, and other images that must be drawn
accurately at different sizes, use SVG." AVIF is Baseline across Chrome, Edge, Firefox and Safari 16.1+; the
JPEG/PNG `<img>` is the last-resort fallback. A builder should transcode uploads once, at upload time, into a
fixed width ladder (e.g. 320 · 640 · 960 · 1280 · 1920 · 2560, never upscaling past the original) in AVIF + WebP
+ the original format, and strip EXIF (location data in a school photo is a safeguarding issue).

Source: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types

### 1.4 Sizing without layout shift

- Browsers map the `width`/`height` attributes to `aspect-ratio: auto <w> / <h>` in the UA stylesheet, so with
  `img { max-width: 100%; height: auto }` the box has its final height before a byte of the image arrives.
- When the builder crops (a card, a hero), set the box's ratio in CSS and let the image fill it:
  `aspect-ratio: 16 / 9; width: 100%; object-fit: cover; object-position: <focal point>`.
- `aspect-ratio: auto 3 / 2` means "use 3/2 until the image loads, then its natural ratio" — useful when the
  real ratio is unknown. `aspect-ratio` only has an effect if at least one of width/height is automatic.
- `object-fit`: `fill` (default, distorts), `contain` (letterbox), `cover` (fill and clip), `none`,
  `scale-down`. `object-position` defaults to `50% 50%`; a builder should store a **focal point** per image and
  emit it as `object-position: x% y%` so a crop keeps the face in frame at every rung.
- Lazy images without dimensions are 0×0 until loaded — both a CLS problem and a reason the browser may
  mis-judge whether they are near the viewport.

Sources: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio ·
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit ·
https://web.dev/articles/optimize-cls

### 1.5 Lazy vs eager

- `loading="lazy"` defers until the image is near the viewport; Chrome's threshold is ≈1,250 px on 4G and
  ≈2,500 px on 3G, and 97.5% of lazy images on 4G finish within 10 ms of becoming visible. It works without JS
  (and is deliberately disabled when JS is off, as an anti-tracking measure, per MDN).
- `iframe` supports `loading="lazy"` identically; `<video>` does too in current browsers.
- Content hidden with `display: none` is not loaded; `opacity: 0` content is. Carousels: slides 2…n should be
  `loading="lazy"` **and** `fetchpriority="low"` so the browser does not promote "nearly visible" slides.
- `decoding="async"` lets decode happen off the render path; its effect is small for static images. A builder
  can emit it on every non-LCP image harmlessly.

Sources: https://web.dev/articles/browser-level-image-lazy-loading ·
https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img

### 1.6 LCP image rules

- **Never lazy-load the LCP image.** HTTP Archive: pages using lazy-loading had a p75 LCP of 3,546 ms vs
  2,922 ms without; lazy-loading only below-the-fold images "results in a complete reversal of the LCP
  regression" while keeping 50–70% of the byte savings (WordPress A/B test).
- Give it `fetchpriority="high"`. Without it an image starts at Low priority and is only boosted after layout;
  Google Flights cut LCP from 2.6 s to 1.9 s with this single attribute. It is a hint — use it on **one** image.
- The LCP resource must be **discoverable in the HTML** — not a CSS background, not injected by JS. If it has to
  be a background (§2), add `<link rel="preload" as="image" imagesrcset="…" imagesizes="…" fetchpriority="high">`.
- Host it on the same origin as the page (no extra connection).
- LCP breakdown targets: TTFB ≈ 40%, resource load delay < 10%, resource load duration ≈ 40%, render delay < 10%.
  A static export controls the middle two completely.

Sources: https://web.dev/articles/optimize-lcp · https://web.dev/articles/lcp-lazy-loading ·
https://web.dev/articles/fetch-priority

### 1.7 Alt text rules (WCAG 2.2 SC 1.1.1, Level A)

"All non-text content that is presented to the user has a text alternative that serves the equivalent
purpose", with exceptions: controls/inputs need a **name that describes their purpose**; time-based media,
tests and sensory experiences need at least **descriptive identification**; pure decoration must be
**ignorable by assistive technology** (`alt=""` or a CSS background).

Builder rules that follow:

1. Every image block asks: *informative*, *decorative*, *functional* (inside a link/button), or *complex*.
2. Informative → non-empty alt describing what the image **conveys in context**, not the file name, not
   "image of". Decorative → `alt=""` emitted explicitly. Never omit the attribute.
3. Functional (image is the only content of a link) → alt names the **destination/action** ("Admissions"), not
   the picture. An icon next to visible link text is decorative (`alt=""`).
4. Complex (chart, map, timetable) → short alt plus a long description nearby (`<figcaption>` or a linked
   page), carrying the same data.
5. Refuse to publish an informative image with empty alt; warn on alt equal to the file name, or longer than
   ~150 characters (move the rest to a caption).

**Images of text (SC 1.4.5, AA)**: if text can achieve the presentation, use text, except customizable images
or where the presentation is essential (**logotypes**). A builder should not offer "text on an image" baked into
a file; it offers a text layer over an image (§2), which stays zoomable, translatable and searchable.

Sources: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html ·
https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html

---

## 2. Background images and art direction

- **Backgrounds are invisible to assistive technology.** MDN: a screen reader "will not announce its presence".
  Use `background-image` only for decoration; anything meaningful is an `<img>` (possibly absolutely
  positioned under a text layer with `object-fit: cover`), which also gets `srcset`, `loading` and
  `fetchpriority`.
- Always set a **`background-color`** under a background image: it is what shows while loading, offline, or
  if the image fails, and it is the colour the contrast check must also pass against.
- **Text over a photo** must meet 4.5:1 (3:1 for large text) against the image, not just the fallback colour.
  The builder should apply a scrim (a token-driven gradient/overlay) and measure contrast against the darkest
  and lightest regions under the text box — CLAUDE.md rule 17: "contrast is ASSERTED, not assumed — especially
  text over a photograph the user chose".
- Responsive backgrounds: `image-set(url(a.avif) type("image/avif"), url(a.webp) type("image/webp"))` for
  format, `1x/2x` for density, and media/container queries for different crops. No `sizes` equivalent exists,
  which is another reason a large hero should be an `<img>`.
- A background hero that is the LCP element is discovered late (only after CSS is parsed). If the builder
  must emit one, it also emits the `<link rel="preload" as="image" fetchpriority="high">`.
- **Art direction** = a different crop per layout, not a smaller file. Two mechanisms: `<picture><source
  media>` with its own `width`/`height` per crop, or one image with a per-rung `object-position` focal point.
  The builder should prefer the focal point (one asset) and offer a per-rung crop only when a user asks for it.

Sources: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-image ·
https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images · https://web.dev/articles/fetch-priority

---

## 3. Video and audio

### 3.1 Markup

```html
<video controls playsinline preload="none" width="1920" height="1080"
       poster="sportsday-poster.avif">
  <source src="sportsday.webm" type="video/webm">
  <source src="sportsday.mp4" type="video/mp4">
  <track kind="captions" src="sportsday.en.vtt" srclang="en" label="English" default>
  <a href="sportsday.mp4">Download the sports day video (MP4)</a>
</video>
```

- `controls`: always, unless the builder renders its own accessible controls.
- `preload`: `none` / `metadata` / `auto`; default is browser-dependent (spec suggests `metadata`). `autoplay`
  overrides it. For below-the-fold video, `preload="none"` + `loading="lazy"`.
- `poster`: the placeholder frame; also what the LCP element becomes if a video is at the top. Transcode it like
  any other image and give it `fetchpriority="high"` via preload when it is the LCP.
- `width`/`height` reserve space exactly as for images.
- Boolean attributes are removed to turn off: `muted="false"` still mutes.
- `<track>`: `kind` = `captions` (dialogue + sound, for Deaf/hard-of-hearing), `subtitles` (translation),
  `descriptions`, `chapters`; WebVTT format; `srclang`, `label`, `default`.

Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video

### 3.2 Autoplay rules

Browsers allow autoplay only if the media is **muted**, the user has already interacted, the site is
allowlisted, or a Permissions Policy grants it to an iframe. Safari additionally needs **`playsinline`**.
`play()` returns a promise that rejects with `NotAllowedError` when blocked — show a play button then.

Accessibility law on top of browser policy:

- **SC 1.4.2 Audio Control (A)**: audio that plays automatically for more than 3 s needs a pause/stop or an
  independent volume control. Builder rule: **no autoplay with sound, ever**.
- **SC 2.2.2 Pause, Stop, Hide (A)**: moving content that starts automatically, lasts more than 5 s and sits
  alongside other content needs a mechanism to pause, stop or hide it. A looping background video is exactly
  this. Builder rule: every autoplaying video gets a **visible, keyboard-reachable pause button**.
- **Reduced motion**: under `@media (prefers-reduced-motion: reduce)` an autoplaying decorative video must not
  start; show the poster and a play button instead. (CSS cannot stop a `<video>`; a few lines of script read
  `matchMedia('(prefers-reduced-motion: reduce)')` and skip `play()`; with the `autoplay` attribute omitted
  from the markup, the no-JS default is "not playing".)
- A decorative background video is `aria-hidden="true"`, has no audio track, and carries nothing a user needs.

Sources: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay ·
https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html ·
https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html ·
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion

### 3.3 Captions and descriptions (WCAG 2.2 guideline 1.2)

| SC | Level | Requirement |
|---|---|---|
| 1.2.1 Audio-only & video-only (prerecorded) | A | Transcript (audio-only) or transcript/audio track (video-only) |
| 1.2.2 Captions (prerecorded) | A | Captions for all prerecorded audio in synchronized media |
| 1.2.3 Audio description or media alternative | A | Audio description **or** a full text alternative |
| 1.2.4 Captions (live) | AA | Real-time captions for live streams |
| 1.2.5 Audio description (prerecorded) | AA | Audio description of visual-only information |
| 1.2.6–1.2.9 | AAA | Sign language, extended description, full media alternative, live audio-only alternative |

UK public-sector bodies (including maintained schools and academies) must meet AA, so **1.2.2 and 1.2.5 are
mandatory** for any prerecorded video with meaningful content. Builder rules: a video with an audio track
cannot be published without a captions track (or an explicit "no speech" declaration); offer a transcript
field rendered below the player; review machine-generated captions (MDN warns they are unreliable). Captions
should identify sound effects and music ("[applause]").

Sources: https://www.w3.org/WAI/WCAG22/Understanding/time-based-media ·
https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video

### 3.4 Performance

- Replace animated GIFs with `<video autoplay muted loop playsinline>` — GIFs run to several megabytes; video of
  similar quality is far smaller.
- Below the fold: `loading="lazy"` + `preload="none"`. An LCP video must **not** be lazy.
- Encode a ladder (e.g. 720p and 1080p, H.264 MP4 for reach + AV1/VP9 WebM for size); strip the audio track
  from decorative loops (it also removes the autoplay-with-sound risk); cap a background loop at ~10 s.
- Long-form video (assemblies, open evenings) belongs on a streaming host with adaptive bitrate — which makes it
  an embed (§4).

Source: https://web.dev/articles/lazy-loading-video

---

## 4. Embeds — YouTube, maps, social — and privacy

### 4.1 The cost

A third-party iframe brings its own HTML, JS, fonts, trackers and connections. web.dev: lazy-loading a YouTube
embed alone saves ≈500 KB on initial load, and lite-youtube-embed is described as "224× faster" than the stock
player. Unsized embeds are also a top CLS cause.

### 4.2 The facade pattern

A **facade** is "a static element that looks similar to the embedded third-party, but is not functional".
Lifecycle: page load → facade (a poster image + a real `<button>`); hover/focus → optionally preconnect; click
→ replace with the real iframe (with `allow="autoplay"` so the one click also starts playback).

| Embed | Facade |
|---|---|
| YouTube / Vimeo | Self-hosted poster image (the builder fetches and stores the thumbnail at edit time) + play button; on click insert `youtube-nocookie.com/embed/ID?autoplay=1` |
| Map | Static map image with the address as text and a "Get directions" link; interactive map on click |
| Social post | Rendered text + author + date + link to the original; the platform script loads on click |
| Chat widget | A button that loads the widget |

Trade-offs: one extra click; autoplay-on-load impossible; chat badges absent until loaded. For a school site
all three are acceptable.

Always: reserve the box with `aspect-ratio` (16/9 video, a fixed ratio for maps) so the swap causes zero shift;
give the iframe a `title` ("Video: Sports day 2026"); keep a text link to the original for no-JS readers.

Sources: https://web.dev/articles/embed-best-practices ·
https://developer.chrome.com/docs/lighthouse/performance/third-party-facades

### 4.3 Privacy — no third-party request without consent

- **The German Google Fonts ruling.** LG München I, 20 January 2022, Az. **3 O 17493/20**: automatically sending
  a visitor's dynamic IP address to Google by loading Google Fonts from Google's servers, without consent,
  violated the visitor's rights; there was no legitimate interest because "Google Fonts can be used without
  establishing a connection to a Google server". Damages: €100 plus interest, explicitly for deterrence. A wave
  of warning letters to site owners followed. The principle generalises: **an IP address sent to a third party
  on page load is a transfer of personal data**, and if the site could have avoided it, "legitimate interest"
  fails.
- **UK GDPR + PECR.** The ICO: storing or reading anything on a device requires consent — "freely given,
  specific and informed", by "unambiguous positive action" — unless strictly necessary for the service the
  user requested; continuing to browse is not consent. The rules apply to "anyone who stores information on a
  user's device… by any method", and the site owner must have arrangements for third-party cookies. A YouTube,
  map or social embed sets third-party cookies/storage, so it needs consent. (`youtube-nocookie.com` reduces but
  does not remove this: the IP still goes to Google.)
- **Schools** process children's data, are public bodies, and publish an accessibility statement and privacy
  notice: the conservative default is the only safe one.

Builder rules: the exported page makes **zero third-party requests on load** — fonts, images, scripts, icons
all self-hosted; every embed is a facade whose click is the consent ("Loading this video will send data to
YouTube (Google). [Load video]"); the facade names the provider and links the school's privacy notice; an
optional site-wide "always allow YouTube" preference is stored only after that click. No analytics or tracking
pixel is part of the builder's default output.

Sources: https://www.gesetze-bayern.de/Content/Document/Y-300-Z-GRURRS-B-2022-N-612 ·
https://en.wikipedia.org/wiki/Google_Fonts ·
https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/

---

## 5. Fonts

### 5.1 Self-host (decided by §4.3, not by speed)

web.dev is candid that self-hosting is not automatically faster (the Web Almanac found third-party fonts often
rendered faster) — it wins only with HTTP/2 and a CDN, and only if you apply what a provider does for you:
WOFF2 and subsetting. For this builder the privacy ruling settles it: **self-host every font**, and then do the
optimisations yourself.

### 5.2 Loading strategy

- **WOFF2 only** ("use only WOFF2 and forget about everything else"); ≈30% smaller than WOFF.
- **Subset** with `unicode-range` (e.g. Latin, Latin-Extended as separate files). The browser downloads a subset
  only if the page uses a character in it. Preload ignores `unicode-range`, so preload only the base Latin file.
- **Inline the `@font-face` declarations** in the `<head>` so fonts are discovered without waiting for a
  stylesheet; never inline the font file itself.
- **Preload** at most the one or two files used above the fold (body regular, heading weight), with
  `crossorigin` (fonts are always fetched in CORS mode, even same-origin).
- **Limit families and weights.** A variable font replaces several static files but is usually larger than any
  one of them; worth it at three or more weights.
- **No icon fonts** — the fallback is garbage glyphs; use inline SVG (CLAUDE.md already says so).

### 5.3 `font-display`

| Value | Block | Swap | Effect |
|---|---|---|---|
| `block` | 2–3 s | infinite | Invisible text; hurts LCP |
| `swap` | 0 | infinite | Text at once; late swap can shift layout |
| `fallback` | 100 ms | ~3 s | Compromise |
| `optional` | 100 ms | none | No late swap; font used from the next page view if it missed |

`preload` + `font-display: optional` is "the most effective way to guarantee no layout jank". For headings where
brand matters, `swap` with a **metric-matched fallback** (§5.4) is the alternative. Either way, not `auto`/`block`.

### 5.4 Fallback metrics

Define a fallback `@font-face` over a local system font, tuned to the web font's metrics:

```css
@font-face {
  font-family: "Inter Fallback";
  src: local("Arial");
  size-adjust: 107%;       /* avg char width web ÷ fallback */
  ascent-override: 90%;    /* ascent ÷ (unitsPerEm × size-adjust) */
  descent-override: 22%;
  line-gap-override: 0%;
}
body { font-family: "Inter", "Inter Fallback", sans-serif; }
```

Arial is the standard sans fallback, Times New Roman the serif one (Android needs `Roboto` too). Tools: Fontaine,
Capsize, `next/font` (which generates these automatically). Because the builder ships a fixed font library, it
can **precompute these overrides once per font** and emit them with every export.

Sources: https://web.dev/articles/font-best-practices · https://web.dev/articles/preload-optional-fonts ·
https://developer.chrome.com/blog/font-fallbacks

---

## 6. Core Web Vitals budget for exported static pages

Thresholds (p75 of page loads, segmented mobile/desktop):

| Metric | Good | Poor | What media does to it |
|---|---|---|---|
| **LCP** | ≤ 2.5 s | > 4 s | The LCP element is usually the hero image/poster/heading; late discovery, lazy-loading, wrong priority, oversized files and blocking fonts all push it out |
| **CLS** | ≤ 0.1 | > 0.25 | Unsized images/video/iframes, embeds swapping in, late-inserted banners, font swaps |
| **INP** | ≤ 200 ms | > 500 ms | Heavy third-party scripts (players, maps, chat, social) and large DOMs occupy the main thread; facades keep them off it until asked for |

Sources: https://web.dev/articles/vitals · https://web.dev/articles/optimize-lcp ·
https://web.dev/articles/optimize-cls · https://web.dev/articles/inp

A static export has no server rendering cost and no framework JS, so it can aim well inside "good". A budget
the exporter can compute and enforce (the **error** column blocks publish; **warn** shows in the inspector):

| Budget (per page, first view, mobile) | Target | Warn | Error |
|---|---|---|---|
| HTML (compressed) | ≤ 30 KB | > 50 KB | > 100 KB |
| Critical CSS (inlined) | ≤ 14 KB | > 20 KB | — |
| Total JS | ≤ 20 KB | > 50 KB | > 150 KB |
| LCP image (selected candidate at 375 px, 2×) | ≤ 100 KB | > 150 KB | > 300 KB |
| Any single image candidate | ≤ 250 KB | > 400 KB | > 1 MB |
| Total bytes above the fold | ≤ 300 KB | > 500 KB | — |
| Font files preloaded | ≤ 2 | 3 | > 3 |
| Font families / total font bytes | ≤ 2 / ≤ 100 KB | 3 / > 150 KB | — |
| Third-party origins requested on load | **0** | — | ≥ 1 |
| Media elements without reserved size | **0** | — | ≥ 1 |
| Images with `loading="lazy"` in the first band | **0** | — | ≥ 1 |
| Autoplay video with an audio track | **0** | — | ≥ 1 |
| DOM nodes | ≤ 800 | > 1,400 | — |

The byte targets are this document's engineering judgement for a text-and-photos page on a mid-range phone,
derived from the ≤2.5 s LCP goal; the zero-rows are direct consequences of the cited rules. Verify the
budget in CI by running Lighthouse (or a Playwright trace under a throttled profile) on each benchmark page in
`docs/LAYOUT_BENCHMARK.md` at every rung.

---

## 7. Checklist — builder rules, enforceable on export

**Images**

1. Every `<img>` emits `width` and `height` (intrinsic pixels, unitless) — or sits in a box with an explicit
   `aspect-ratio`. Rendered size is `width: 100%; height: auto` or `object-fit` inside a ratio box. *(error)*
2. Every `<img>` has an `alt` attribute. Informative images need non-empty alt; decorative emit `alt=""`;
   linked images describe the destination. *(error on missing/empty-informative; warn on file-name or >150-char alt)*
3. Uploads are transcoded to AVIF + WebP + original at a width ladder, never upscaled, EXIF stripped; the
   export emits `<picture>` with `type` sources and `srcset` with `w` descriptors.
4. Every `srcset` with `w` descriptors has a `sizes` computed from the block's actual column span at each rung
   (in `vw`/`rem`, never `%`), not the `100vw` default.
5. **The LCP candidate** — the first image/poster in the first band, or the first image whose box starts above
   ~100svh on mobile — is `loading="eager"` + `fetchpriority="high"` + `decoding="auto"`; **no other image on the
   page has `fetchpriority="high"`.** *(error if lazy)*
6. Every other image is `loading="lazy" decoding="async"`; carousel slides after the first also
   `fetchpriority="low"`.
7. If the LCP candidate is a CSS background, the export adds `<link rel="preload" as="image" imagesrcset
   imagesizes fetchpriority="high">` — or better, renders it as an `<img>`.
8. Each image stores a focal point, emitted as `object-position` so crops hold at every rung.
9. SVG icons are inline with `currentColor`, `aria-hidden="true"` when decorative; `<img src="*.svg">` gets
   `role="img"`.
10. No images of text except logotypes; text over images is a real text layer.

**Backgrounds**

11. A background image is decorative by definition; any image marked informative is exported as `<img>`.
12. Every background image has a token `background-color` under it, and text over it passes 4.5:1 (3:1 large)
    against the image region it covers, with a scrim applied if needed. *(error)*

**Video & audio**

13. No autoplay with sound. Autoplay requires `muted playsinline`, no audio track, `loop` ≤ ~10 s, and a
    visible keyboard-operable pause button. *(error)*
14. Autoplay does not start under `prefers-reduced-motion: reduce`; the poster shows instead.
15. Every video has `width`/`height`, a transcoded `poster`, `controls` (or the builder's accessible controls),
    and `preload="none"` + `loading="lazy"` unless it is the LCP.
16. A video with speech cannot publish without a `<track kind="captions">`; a transcript field is offered;
    audio description or a text alternative is prompted for (AA 1.2.5).
17. Animated GIF uploads are converted to muted looping video.

**Embeds & privacy**

18. Zero third-party requests on page load: fonts, images, icons and scripts are all self-hosted. *(error)*
19. Every embed (YouTube, Vimeo, maps, social, chat) exports as a facade: self-hosted poster/static image, a
    real `<button>` naming the provider and linking the privacy notice; the iframe (privacy-enhanced domain
    where one exists, `loading="lazy"`, `title`, `allow="autoplay"`) is inserted only on click.
20. The facade box has the embed's `aspect-ratio`, so the swap shifts nothing; a plain link to the original is
    always present.

**Fonts**

21. Fonts are WOFF2 only, self-hosted, Latin-subset split with `unicode-range`; `@font-face` inlined in `<head>`.
22. At most two preloaded font files, each with `crossorigin`.
23. `font-display: optional` for body text (with preload); `swap` allowed for headings only together with a
    precomputed metric-matched fallback (`size-adjust`, `ascent-/descent-/line-gap-override`).
24. No icon fonts.

**Budget & verification**

25. The §6 budget is computed at export; errors block publish, warnings show in the inspector with the block
    that caused them.
26. CI runs Lighthouse/trace checks on the benchmark pages at Mobile 375 · Tablet 768 · Laptop 1024 · Desktop
    1280 · Wide 1920 and fails on LCP > 2.5 s, CLS > 0.1, or any third-party request.
