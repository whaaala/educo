# Mutation proof for LE-14's other guards (ED-13 · RC-7 · ED-3b · ED-7 · ED-2b): each mutation must turn its guard RED;
# the saved text is written back after every run (never git checkout).
import subprocess
M = [
 ('lib/box-model.ts', 'tests/unit/multi-select.test.ts', 'Mixed: never differs', 'return keys.filter((k) => nodes.some((n) => JSON.stringify(n[k]) !== JSON.stringify(nodes[0][k])));', 'return [];'),
 ('lib/box-model.ts', 'tests/unit/multi-select.test.ts', 'move: one may stay', 'for (const id of order) { if (!canMoveBlock(next, id, step)) return root; next = moveBlock(next, id, step); }', 'for (const id of order) { if (!canMoveBlock(next, id, step)) continue; next = moveBlock(next, id, step); }'),
 ('lib/box-model.ts', 'tests/unit/container-kind.test.ts', 'kind: bands kept (LE14-8)', 'let blocks = (n.children ?? []).flatMap((c) => (c.rowBand ? c.children ?? [] : [c]));', 'let blocks = n.children ?? [];'),
 ('lib/box-model.ts', 'tests/unit/container-kind.test.ts', 'kind: spans not named', '    dropped.add("spans");\n', ''),
 ('lib/box-model.ts', 'tests/unit/copy-style.test.ts', 'style: gap onto a Heading', '...(box ? INSPECTOR_STYLE.container : [])', '...INSPECTOR_STYLE.container'),
 ('lib/box-model.ts', 'tests/unit/copy-style.test.ts', 'style: always the base', 'if (Object.keys(patch).length) next = updateBoxResponsive(next, id, patch, bp);', 'if (Object.keys(patch).length) next = updateBox(next, id, patch);'),
 ('lib/box-model.ts', 'tests/unit/set-here.test.ts', 'source: inherited reads here', 'return SLOT_SCREEN[chain[i]] === bp ? "here" : SLOT_SCREEN[chain[i]];', 'return "here";'),
 ('lib/box-model.ts', 'tests/unit/set-here.test.ts', 'reset: clears to null', 'const { [key]: _gone, ...rest } = responsive[slot]!; void _gone;', 'const rest = { ...responsive[slot]!, [key]: null };'),
 ('lib/box-model.ts', 'tests/unit/layers.test.ts', 'layers: bands shown', 'export const layerKids = (n: BoxNode): BoxNode[] => (n.children ?? []).flatMap((c) => (c.rowBand ? layerKids(c) : [c]));', 'export const layerKids = (n: BoxNode): BoxNode[] => n.children ?? [];'),
 ('lib/box-model.ts', 'tests/unit/layers.test.ts', 'layers: into itself', 'if (!target || id === targetId || id === root.id || isAncestor(root, id, targetId)) return root;', 'if (!target || id === targetId) return root;'),
 ('components/website/box/LayersPanel.tsx', 'tests/components/website/LayersPanel.test.tsx', 'tree: hide on every screen', 'onChange(updateBoxResponsive(root, n.id, { hidden: now ? undefined : true }, breakpoint));', 'onChange(updateBox(root, n.id, { hidden: now ? undefined : true }));'),
 ('components/website/box/LayersPanel.tsx', 'tests/components/website/LayersPanel.test.tsx', 'tree: every row a tab stop', 'tabIndex={current === n.id ? 0 : -1}', 'tabIndex={0}'),
 ('components/website/box/BoxInspector.tsx', 'tests/components/website/BoxInspector.test.tsx', 'mark: no reset', 'onClick={() => ctx.onReset?.(field)}', 'onClick={() => undefined}'),
 ('components/website/box/BulkInspector.tsx', 'tests/components/website/BulkInspector.test.tsx', 'bulk: Mixed ignored', 'const shown = (key: keyof BoxNode, value: string) => (mixed.includes(key) ? INSPECTOR.group.mixed : value);', 'const shown = (key: keyof BoxNode, value: string) => value;'),
]
for f, t, name, a, b in M:
  orig = open(f, encoding='utf-8', newline='').read()
  a2 = a if a in orig else a.replace('\n', '\r\n'); b2 = b if a in orig else b.replace('\n', '\r\n')
  if orig.count(a2) != 1: print(name, 'NOT FOUND', flush=True); continue
  try:
    open(f, 'w', encoding='utf-8', newline='').write(orig.replace(a2, b2))
    r = subprocess.run(f'npx vitest run {t}', shell=True, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=300)
    print(name, '->', 'RED' if r.returncode else 'GREEN (the guard missed it)', flush=True)
  finally:
    open(f, 'w', encoding='utf-8', newline='').write(orig)
