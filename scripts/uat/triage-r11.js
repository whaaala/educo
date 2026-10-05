// R11 (canvas≠Preview) names every ancestor of the block that differs. This finds the LEAF that started it:
// the listed blocks that are not containers, or the deepest listed container when no leaf is listed.
//   node scripts/uat/triage-r11.js <out-dir>
const fs = require('fs')
const path = require('path')

const dir = process.argv[2] || 'scripts/uat/dressed99-out'
const band = (where) => {
  const px = /(\d{3,4})\s*(px|×)/.exec(where)
  const n = px ? Number(px[1]) : 0
  return (/150%/.test(where) ? '150% ' : '') + (n < 600 ? '<600' : n < 900 ? '600–899' : n < 1200 ? '900–1199' : n < 1800 ? '1200–1799' : '≥1800')
}

const roots = new Map()
for (const f of fs.readdirSync(dir).filter((x) => /^page-\d+\.json$/.test(x))) {
  const page = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  const treeFile = path.join(dir, `page-${page.idx}.tree.txt`)
  if (!fs.existsSync(treeFile)) continue
  const info = new Map()
  for (const line of fs.readFileSync(treeFile, 'utf8').split('\n')) {
    const m = /^(\s*)(\S+)\s+(\S+)/.exec(line)
    if (m) info.set(m[2], { depth: m[1].length / 2, type: m[3] })
  }
  for (const x of page.findings || []) {
    if (!/^R11/.test(x.msg)) continue
    const entries = [...x.msg.matchAll(/(\S+) ([\d.]+)%×(\d+) vs ([\d.]+)%×(\d+)/g)].map((m) => ({
      id: m[1],
      dw: Number(m[4]) - Number(m[2]),
      dh: Number(m[5]) - Number(m[3]),
      ...(info.get(m[1]) || { depth: -1, type: '?' }),
    }))
    const leaves = entries.filter((e) => e.type !== 'container' && e.type !== '?')
    const deepest = Math.max(...entries.map((e) => e.depth))
    const picked = leaves.length ? leaves : entries.filter((e) => e.depth === deepest)
    const seen = new Set()
    for (const e of picked) {
      const axis = Math.abs(e.dw) > 0.15 ? 'width' : e.dh > 0 ? 'taller in Preview' : 'shorter in Preview'
      const key = `${e.type} ${axis} @${band(x.where)}`
      if (seen.has(key)) continue
      seen.add(key)
      const r = roots.get(key) || { n: 0, pages: new Set(), dh: [], eg: null }
      r.n++
      r.pages.add(page.idx)
      r.dh.push(e.dh)
      if (!r.eg) r.eg = `idx ${page.idx} @${x.where} ${e.id} Δw ${e.dw.toFixed(1)}% Δh ${e.dh}px`
      roots.set(key, r)
    }
  }
}
for (const [key, r] of [...roots.entries()].sort((a, b) => b[1].pages.size - a[1].pages.size).slice(0, 40)) {
  const dh = r.dh.sort((a, b) => a - b)
  console.log(`${String(r.pages.size).padStart(4)} pages · ${String(r.n).padStart(4)}×  ${key}   Δh median ${dh[dh.length >> 1]}px (${dh[0]}…${dh[dh.length - 1]})   e.g. ${r.eg}`)
}
