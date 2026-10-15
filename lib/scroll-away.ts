/**
 * A popover pinned beside its button closes when the page scrolls the button away — but ONLY then (A1-5).
 *
 * "Close on any scroll" lost the click that opened it: a screen reader (and Playwright) scrolls a control into view and
 * activates it at once, and that scroll's event arrives a frame AFTER the click, so the list closed the moment it
 * appeared. Measured on the Inspector's Font picker below the fold: first click nothing, second click opens.
 * Call it when the popover OPENS; scrolls inside the popover itself never close it.
 */
export function closeOnScrollAway(anchor: () => Element | null, inside: () => Element | null, close: () => void): (e: Event) => void {
  const openedAt = anchor()?.getBoundingClientRect().top;
  return (e) => {
    if (inside()?.contains(e.target as Node) || anchor()?.getBoundingClientRect().top === openedAt) return;
    close();
  };
}
