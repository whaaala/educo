# Mutation proof for tests/unit/group-in-place.test.ts (LE14-2 ... 6): each old bug put back, the guard must go RED;
# the saved text is written back after every run (never git checkout).
import subprocess, sys
p = 'lib/box-model.ts'
orig = open(p, encoding='utf-8', newline='').read()
muts = [
 ('gap 12 (LE14-3)', 'createContainer("column", { group: true, padding: 0, gap: 0,', 'createContainer("column", { group: true, padding: 0, gap: 12,'),
 ('kids 100% (LE14-4)', 'width: "fill", children: slots }', 'width: "fill", children: slots.map((k) => ({ ...k, width: "100%" })) }'),
 ('group at the end (LE14-2)', '(c.id === slots[0].id ? [group] : out.has(c.id) ? [] : [c]));', '(out.has(c.id) ? [] : [c])).concat([group]);'),
 ('no share restated', 'children: total ? slots.map((k, i) => ({ ...k, width: pct((shares[i]! / total) * 100) })) : slots,', 'children: slots,'),
 ('ungroup to the end (LE14-5)', '.flatMap((c) => (c.id === slot ? kids : [c]));', '.filter((c) => c.id !== slot).concat(kids);'),
 ('any two parents', 'if (!share(picked)) return null;', ''),
 ('a fixed height (LE14-6)', 'justify: "start", width: "fill", children: slots }', 'justify: "start", width: "fill", height: 120, children: slots }'),
]
try:
  for name, a, b in muts:
    if orig.count(a) != 1: print(name, 'NOT FOUND', flush=True); continue
    open(p, 'w', encoding='utf-8', newline='').write(orig.replace(a, b))
    r = subprocess.run('npx vitest run tests/unit/group-in-place.test.ts', shell=True, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=240)
    print(name, '->', 'RED' if r.returncode else 'GREEN (the guard missed it)', flush=True)
finally:
  open(p, 'w', encoding='utf-8', newline='').write(orig)
