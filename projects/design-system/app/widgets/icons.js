/* ============================================
   ICON PACK — runtime hydration
   ============================================ */
function initIcons(scope) {
  hydrateIcons(scope);
  initTreeToggleIcons(scope);
}

function initTreeToggleIcons(scope) {
  const root = scope || document;
  root.querySelectorAll('.live-tree-toggle:not(.is-leaf)').forEach(btn => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.innerHTML = icon(open ? 'chevron-down' : 'chevron-right', 14);
  });
  root.querySelectorAll('.live-tree-toggle').forEach(btn => {
    if (btn.dataset.treeIconInit === '1') return;
    btn.dataset.treeIconInit = '1';
    const observer = new MutationObserver(() => {
      if (btn.classList.contains('is-leaf')) return;
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.innerHTML = icon(open ? 'chevron-down' : 'chevron-right', 14);
    });
    observer.observe(btn, { attributes: true, attributeFilter: ['aria-expanded'] });
  });
}
