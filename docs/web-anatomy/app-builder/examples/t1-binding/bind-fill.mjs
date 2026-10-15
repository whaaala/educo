// T1 spike — THE filler. Research code, NOT product code.
// One source, run in two places: imported by the build (Node) and inlined verbatim into the published page (browser /
// WebView). Because both run the same bytes on the same template string, build-time and runtime markup are identical
// by construction — that is the property under test.
//
// The template is the exporter's OWN output for ONE item, rendered once with sentinels in the bound slots:
//    path|formatter           a bound value (text or attribute) — escaped on the way in
//    path op value  …   a conditional span — dropped when the condition is false
// Private-use characters: the exporter's esc() never touches them, and no school types them.

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const get = (rec, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), rec);

// Trust boundary: a record's URL never becomes javascript:/data: in an href/src.
const safeUrl = (u) => (/^(https?:|\/|\.\/|#|mailto:|tel:|[a-z0-9_-]+\.html)/i.test(String(u)) ? String(u) : "#");

export const FORMATS = {
  text: (v) => (v == null ? "" : String(v)),
  money: (v, cur, loc) => new Intl.NumberFormat(loc || "en-NG", { style: "currency", currency: cur || "NGN", maximumFractionDigits: cur === "GHS" ? 2 : 0 }).format(Number(v) || 0),
  date: (v, style, loc) => new Intl.DateTimeFormat(loc || "en-NG", { dateStyle: style || "medium", timeZone: "UTC" }).format(new Date(v)),
  url: (v) => safeUrl(v),
  page: (v, prefix) => safeUrl(`${prefix}-${String(v).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`), // detail page per record
};

export function fmtValue(rec, spec) {
  const [path, f = "text", a, b] = spec.split("|");
  return (FORMATS[f] || FORMATS.text)(get(rec, path), a, b);
}

const test = (rec, cond) => {
  const m = /^(\S+)\s+(set|unset|eq|ne|gt|lt)\s*(.*)$/.exec(cond);
  if (!m) return false;
  const v = get(rec, m[1]);
  switch (m[2]) {
    case "set": return v != null && v !== "" && v !== false;
    case "unset": return v == null || v === "" || v === false;
    case "eq": return String(v) === m[3];
    case "ne": return String(v) !== m[3];
    case "gt": return Number(v) > Number(m[3]);
    case "lt": return Number(v) < Number(m[3]);
  }
  return false;
};

/** One record into the one-item template. */
export function fill(tpl, rec) {
  let out = tpl;
  // conditionals first (innermost first, so nesting works)
  for (let guard = 0; guard < 50 && out.includes(""); guard++) {
    out = out.replace(/([^]*)((?:(?!)[\s\S])*?)/g, (_, c, body) => (test(rec, c) ? body : ""));
  }
  return out.replace(/([^]*)/g, (_, spec) => esc(fmtValue(rec, spec)));
}

/** The query every surface applies the same way: filter → sort → offset → limit. */
export function runQuery(records, q = {}) {
  let rows = records.slice();
  for (const f of q.filter || []) rows = rows.filter((r) => test(r, f));
  if (q.sort) {
    const [path, dir] = q.sort.split(" ");
    rows.sort((x, y) => { const a = get(x, path), b = get(y, path); return (a < b ? -1 : a > b ? 1 : 0) * (dir === "desc" ? -1 : 1); });
  }
  return rows.slice(q.offset || 0, (q.offset || 0) + (q.limit || 100));
}

/** A whole repeater: the items, or the empty state. */
export function fillList(tpl, emptyHtml, records, q) {
  const rows = runQuery(records, q);
  return rows.length ? rows.map((r) => fill(tpl, r)).join("") : emptyHtml;
}

/** Browser half: refill every repeater on the page from data handed over by fetch, the app's bridge, or the snapshot. */
export function hydrate(doc, data) {
  for (const el of doc.querySelectorAll("[data-eu-repeat]")) {
    // A <script type="text/x-eu-template"> keeps the exporter's bytes exactly; a <template> is PARSED and re-serialised.
    const t = doc.getElementById(el.getAttribute("data-eu-tpl"));
    const e = doc.getElementById(el.getAttribute("data-eu-empty"));
    const text = (n) => (!n ? "" : n.tagName === "TEMPLATE" ? n.innerHTML : n.textContent.replace(/<\\\/(script)/gi, "</$1"));
    const rows = data[el.getAttribute("data-eu-repeat")];
    if (!t || !Array.isArray(rows)) continue; // no data: the build-time snapshot stays, never a blank list
    const html = fillList(text(t), text(e), rows, JSON.parse(el.getAttribute("data-eu-q") || "{}"));
    (doc.defaultView.__euLast ||= []).push(html); // spike only: the string, before the DOM parses it
    el.innerHTML = html;
  }
}
