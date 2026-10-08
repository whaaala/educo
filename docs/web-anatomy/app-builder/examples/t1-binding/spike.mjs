// T1 spike — does ONE mechanism give the same markup on the canvas, in the build-time export and at runtime in a WebView?
// Research code, NOT product code. Run:  node docs/web-anatomy/app-builder/examples/t1-binding/spike.mjs
//
// Three paths, one repeater ("upcoming events", filtered + sorted + limited, with a currency, a date, a bound image,
// a detail-page link and a conditional badge):
//   A  CANVAS     expand(tree, records) → an ORDINARY tree (no bindings left) → render()       (the builder draws this)
//   B  BUILD      render(markTemplate(item)) ONCE → fill() per record, in Node                  (the export writes this)
//   C  RUNTIME    the published page in a DOM (jsdom), the SAME bind-fill.mjs inlined, fed fresh JSON (fetch / bridge)
import fs from "node:fs";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { esc, fill, fillList, runQuery, fmtValue } from "./bind-fill.mjs";

const here = fileURLToPath(new URL(".", import.meta.url));

// ── a miniature of lib/box-export.ts renderNode/elementHTML: class per node id, esc() on every value ──
function render(n) {
  const cls = `bx-${n.id}`;
  switch (n.type) {
    case "container": return `<div class="${cls}">${(n.children || []).map(render).join("")}</div>`;
    case "heading": return `<div class="${cls}"><h3>${esc(n.text ?? "")}</h3></div>`;
    case "text": return `<div class="${cls}"><p>${esc(n.text ?? "")}</p></div>`;
    case "image": return `<div class="${cls}"><img src="${esc(n.src ?? "")}" alt="${esc(n.alt ?? "")}" width="320" height="180" loading="lazy" decoding="async" /></div>`;
    case "link": return `<div class="${cls}"><a href="${esc(n.href ?? "#")}">${esc(n.text ?? "")}</a></div>`;
    case "cond": return n.__mark ? `${n.showIf}${(n.children || []).map(render).join("")}` : (n.children || []).map(render).join("");
  }
  return "";
}

// ── the stored model: a repeater container + bindings on its one item template ──
const tree = {
  id: "events", type: "container",
  repeat: { source: "events", query: { filter: ["published eq true"], sort: "date asc", limit: 3 }, empty: "No events yet — check back soon." },
  children: [{
    id: "card", type: "container", children: [
      { id: "pic", type: "image", bind: { src: "photo|url", alt: "title" } },
      { id: "ttl", type: "heading", bind: { text: "title" } },
      { id: "when", type: "text", bind: { text: "date|date|medium" } },
      { id: "fee", type: "text", bind: { text: "fee|money|NGN|en-NG" } },
      { id: "badge", type: "cond", showIf: "free eq true", children: [{ id: "free", type: "text", text: "Free entry" }] },
      { id: "more", type: "link", text: "Details", bind: { href: "slug|page|event" } },
    ],
  }],
};

// A — CANVAS: resolve bindings into a plain tree (what the React canvas would render; same ids → same classes)
function bindNode(n, rec) {
  if (n.type === "cond") return fmtCond(n, rec) ? { ...n, children: n.children.map((c) => bindNode(c, rec)) } : null;
  const out = { ...n };
  for (const [attr, spec] of Object.entries(n.bind || {})) out[attr] = fmtValue(rec, spec);
  delete out.bind;
  if (n.children) out.children = n.children.map((c) => bindNode(c, rec)).filter(Boolean);
  return out;
}
const fmtCond = (n, rec) => fill(`${n.showIf}x`, rec) === "x"; // the SAME condition test
function expand(n, data) {
  if (!n.repeat) return { ...n, children: (n.children || []).map((c) => expand(c, data)) };
  const rows = runQuery(data[n.repeat.source] || [], n.repeat.query);
  const kids = rows.length ? rows.map((r) => bindNode(n.children[0], r)) : [{ id: `${n.id}-empty`, type: "text", text: n.repeat.empty }];
  const { repeat, ...plain } = n; // eslint-disable-line no-unused-vars
  return { ...plain, children: kids };
}

// B — BUILD: render the item ONCE with sentinels in the bound slots, then fill per record
function markTemplate(n) {
  const out = { ...n, __mark: true };
  for (const [attr, spec] of Object.entries(n.bind || {})) out[attr] = `${spec}`;
  if (n.children) out.children = n.children.map(markTemplate);
  return out;
}
const itemTpl = render(markTemplate(tree.children[0]));
const emptyHtml = render({ id: `${tree.id}-empty`, type: "text", text: tree.repeat.empty });
const buildList = (data) => `<div class="bx-${tree.id}">${fillList(itemTpl, emptyHtml, data[tree.repeat.source] || [], tree.repeat.query)}</div>`;

// ── data: what the school's records hold (snapshot at publish) and what arrives later (fresh) ──
const snapshot = { events: [
  { title: "Inter-house sports", date: "2026-11-14", fee: 0, free: true, published: true, slug: "Sports Day", photo: "img/sports.jpg" },
  { title: "PTA meeting", date: "2026-10-20", fee: 0, free: true, published: true, slug: "pta-oct", photo: "img/pta.jpg" },
  { title: "Excursion to Badagry", date: "2026-12-02", fee: 15000, free: false, published: true, slug: "badagry", photo: "img/badagry.jpg" },
  { title: "Draft — carol service", date: "2026-12-18", fee: 0, free: true, published: false, slug: "carols", photo: "img/c.jpg" },
  { title: "Quiz <script>alert(1)</script> & \"night\"", date: "2026-10-30", fee: 2500, free: false, published: true, slug: "quiz", photo: "javascript:alert(1)" },
] };
const fresh = { events: [...snapshot.events, { title: "Open day", date: "2026-10-25", fee: 0, free: true, published: true, slug: "open-day", photo: "img/open.jpg" }] };

const results = [];
const check = (name, ok, extra = "") => { results.push({ name, ok, extra }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

// 1. canvas == build, for the snapshot, for fresh data and for an empty result
for (const [label, data] of [["snapshot", snapshot], ["fresh", fresh], ["empty", { events: [] }]]) {
  const a = render(expand(tree, data));
  const b = buildList(data);
  check(`canvas (expand→render) == build (template→fill) · ${label}`, a === b, a === b ? `${a.length} chars` : `\nA ${a}\nB ${b}`);
}

// 2. the published page: build-time items in the list + the template + the SAME filler inlined
const fillerSrc = fs.readFileSync(new URL("./bind-fill.mjs", import.meta.url), "utf8").replace(/^export /gm, "");
const scriptSafe = (s) => s.replace(/<\/(script)/gi, "<\\/$1"); // only "</script" ends raw text; undone in hydrate()
const page = (tplTag) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Events</title></head><body>
<div class="bx-${tree.id}" data-eu-repeat="events" data-eu-tpl="t-${tree.id}" data-eu-empty="e-${tree.id}" data-eu-q='${esc(JSON.stringify(tree.repeat.query))}'>${fillList(itemTpl, emptyHtml, snapshot.events, tree.repeat.query)}</div>
${tplTag === "script"
    ? `<script type="text/x-eu-template" id="t-${tree.id}">${scriptSafe(itemTpl)}</script><script type="text/x-eu-template" id="e-${tree.id}">${scriptSafe(emptyHtml)}</script>`
    : `<template id="t-${tree.id}">${itemTpl}</template><template id="e-${tree.id}">${emptyHtml}</template>`}
<script>${fillerSrc}
window.euHydrate = (data) => hydrate(document, data);</script>
</body></html>`;

for (const tplTag of ["script", "template"]) {
  const html = page(tplTag);
  for (const [label, data] of [["snapshot", snapshot], ["fresh", fresh], ["empty", { events: [] }]]) {
    const dom = new JSDOM(html, { runScripts: "dangerously" });
    dom.window.euHydrate(data);
    const runtimeString = `<div class="bx-${tree.id}">${dom.window.__euLast[0]}</div>`;
    const buildString = buildList(data);
    if (tplTag === "script") check(`runtime string == build string · <script> · ${label}`, runtimeString === buildString);
    // A <template> is PARSED: the exporter's "<img … />" comes back "<img …>" — bytes drift, the DOM does not. Recorded, not gated.
    else console.log(`NOTE  runtime string ${runtimeString === buildString ? "==" : "!="} build string · <template> · ${label} (parsed + re-serialised)`);
    // and as a visitor's DOM: parse the build output the same way and compare serialisations
    const parsedBuild = new JSDOM(`<body>${buildString}</body>`).window.document.body.firstElementChild.innerHTML;
    const live = dom.window.document.querySelector("[data-eu-repeat]").innerHTML;
    check(`runtime DOM == build DOM · <${tplTag}> · ${label}`, live === parsedBuild);
  }
}

// 3. ABSOLUTE expectations — the equivalence checks above share runQuery/fill on both sides, so a bug in the shared
//    logic would pass them (measured by mutation: sort off and eq→true both survived). These pin the answer itself.
{
  const out = buildList(snapshot);
  const titles = [...out.matchAll(/<h3>(.*?)<\/h3>/g)].map((m) => m[1].slice(0, 10));
  check("filter + sort + limit give PTA, Quiz, Sports (draft hidden, Badagry past the limit)", titles.join("|") === "PTA meetin|Quiz &lt;s|Inter-hous", titles.join("|"));
  check("conditional badge shows on the 2 free events only", (out.match(/Free entry/g) || []).length === 2);
  check("detail-page link per record", out.includes('href="event-pta-oct.html"') && out.includes('href="event-sports-day.html"'));
  check("currency + date formatted", out.includes("<p>₦2,500</p>") && out.includes("20 Oct 2026"));
}

// 4. trust boundary: escaped text, no live script, no javascript: URL
{
  const out = buildList(snapshot);
  check("hostile record text is escaped", out.includes("Quiz &lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;night&quot;") && !out.includes("<script>alert"));
  check("javascript: URL never reaches src", !/src="javascript:/i.test(out));
}

// 5. sizes — RULE AF: the runtime must be tiny, and JSON vs HTML on the wire
const gz = (s) => zlib.gzipSync(Buffer.from(s)).length;
const fillerMin = fillerSrc.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*\*[\s\S]*?\*\//g, "").replace(/\n\s*\n/g, "\n");
const htmlList = buildList(fresh), json = JSON.stringify(fresh.events);
console.log(`\nsizes: filler ${fillerMin.length} B raw / ${gz(fillerMin)} B gzip · fresh list as HTML ${htmlList.length} B (${gz(htmlList)} gz) vs JSON ${json.length} B (${gz(json)} gz)`);
console.log(`formatting (Node ${process.version}, ICU ${process.versions.icu}): ${fmtValue({ f: 150000 }, "f|money|NGN|en-NG")} · ${fmtValue({ f: 1250.5 }, "f|money|GHS|en-GH")} · ${fmtValue({ d: "2026-01-12" }, "d|date|medium|en-NG")}`);

fs.writeFileSync(`${here}/out-page.html`, page("script"));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
