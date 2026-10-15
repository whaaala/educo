// Esc closes the phone menu (☰) — Docusaurus' own sidebar has no Escape handler (BATCH D-4, D4-3; CLAUDE.md rule 2).
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !document.querySelector('.navbar-sidebar--show')) return;
    document.querySelector('.navbar-sidebar__close')?.click();
  });
}
