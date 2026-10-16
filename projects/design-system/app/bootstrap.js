buildSidebar();
initSidebarSearch();
buildPages();
initMobileSidebar();
initCommandPalette();
initIcons();
initMediumPriority();
initHighPriority();
initLowPriority();
initUpgrades();
initTemplates();
initBackToTop();
initDownloads();
(() => {
  const pageFromQuery = new URLSearchParams(location.search).get('page');
  const pagePart = (location.hash.replace('#', '') || 'home').split('&')[0];
  const pageId = pageFromQuery
    || (pagePart.startsWith('figmacapture=') ? 'home' : pagePart);
  navigateTo(pageId);
})();
requestAnimationFrame(() => {
  if (typeof managePageIridescence === 'function') managePageIridescence();
});
reinitWidgets();
initAiPromptModal();
initCodeModal();

document.querySelectorAll('.quick-link').forEach(a => {
  a.addEventListener('mouseenter', () => {
    a.style.borderColor = 'var(--primary)';
    a.style.transform = 'translateY(-2px)';
    a.style.boxShadow = '0 8px 20px rgba(0,143,149,0.12)';
  });
  a.addEventListener('mouseleave', () => {
    a.style.borderColor = 'var(--border)';
    a.style.transform = 'none';
    a.style.boxShadow = 'none';
  });
});
