// Groups a dressed sweep's findings by CLASS (not by block id), 80/20 ordered.
//   node scripts/uat/triage.js <out-dir> [--class=<substring>] [--pages]
// The sweep's own grouping keys on the block id, so one class is printed as hundreds of lines; this keys on the rule.
const fs = require('fs')
const path = require('path')

const dir = process.argv[2] || 'scripts/uat/dressed99-out'
const only = (process.argv.find((a) => a.startsWith('--class=')) || '').slice(8)
const listPages = process.argv.includes('--pages')

const classOf = (msg) => {
  const m = String(msg)
  if (/^BUILD FAILED|could not select|offered the drop|Timeout \d+ms|only \d+px visible/.test(m)) {
    if (/could not select/.test(m)) return 'BUILD could not select'
    if (/offered the drop and added nothing/.test(m)) return 'BUILD drop offered, nothing added'
    if (/Timeout/.test(m)) return 'BUILD timeout'
    if (/only \d+px visible/.test(m)) return 'BUILD target barely visible'
    return 'BUILD other: ' + m.slice(0, 80)
  }
  return m
    .replace(/"[^"]*"/g, '"…"')
    .replace(/“[^”]*”/g, '"…"')
    .replace(/\b[a-z0-9]{1,2}-[a-z0-9]{1,3}\b/g, '<id>')
    .replace(/box-[a-z0-9-]+/g, '<id>')
    .replace(/-?\d+(\.\d+)?/g, '#')
    .replace(/("…" in <id> #px ?)+/g, '"…" in <id> ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 110)
}

const surfaceOf = (where) => {
  const w = String(where)
  if (/^canvas/.test(w)) return 'canvas ' + w.replace(/^canvas\s*/, '').replace(/\s*\(.*/, '')
  if (/150% text/.test(w)) return 'Preview 150% text'
  if (/^Preview/.test(w)) {
    const px = /(\d{3,4})\s*(px|×)/.exec(w)
    const n = px ? Number(px[1]) : 0
    return 'Preview ' + (n < 600 ? '<600' : n < 900 ? '600–899' : n < 1200 ? '900–1199' : n < 1800 ? '1200–1799' : '≥1800')
  }
  return w.slice(0, 40)
}

const files = fs.readdirSync(dir).filter((f) => /^page-\d+\.json$/.test(f))
const classes = new Map()
let built = 0
let failed = 0
let clean = 0
let secs = 0
const perPageErrors = new Map()
for (const f of files) {
  const page = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  secs += page.secsTotal || 0
  const crashed = !page.sizes
  if (crashed) failed++
  else built++
  const errs = (page.findings || []).filter((x) => x.kind !== 'warn')
  if (!crashed && errs.length === 0) clean++
  perPageErrors.set(errs.length, (perPageErrors.get(errs.length) || 0) + 1)
  for (const x of page.findings || []) {
    const key = (x.kind === 'warn' ? 'warn  ' : 'error ') + classOf(x.msg)
    if (only && !key.includes(only)) continue
    const c = classes.get(key) || { n: 0, pages: new Set(), surfaces: new Map(), eg: null }
    c.n++
    c.pages.add(page.idx)
    const s = surfaceOf(x.where)
    c.surfaces.set(s, (c.surfaces.get(s) || 0) + 1)
    if (!c.eg) c.eg = `idx ${page.idx} ${page.site}/${page.page} @${x.where}: ${String(x.msg).slice(0, 200)}`
    classes.set(key, c)
  }
}

console.log(`${files.length} pages · ${built} built and audited · ${failed} could not be built · ${clean} clean · ${Math.round(secs / 60)} page-minutes`)
console.log(
  'errors per page: ' +
    [...perPageErrors.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k, v]) => `${k} errors ×${v}`)
      .join(' · '),
)
for (const [key, c] of [...classes.entries()].sort((a, b) => b[1].pages.size - a[1].pages.size || b[1].n - a[1].n)) {
  console.log(`\n${String(c.pages.size).padStart(4)} pages · ${String(c.n).padStart(5)}×  ${key}`)
  console.log('      where: ' + [...c.surfaces.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} ×${v}`).join(' · '))
  console.log('      e.g. ' + c.eg)
  if (listPages) console.log('      idx: ' + [...c.pages].sort((a, b) => a - b).join(','))
}
