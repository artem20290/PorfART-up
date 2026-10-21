/* ============================================
   BUILD SIDEBAR
   ============================================ */
function buildSidebar() {
  const nav = document.getElementById('sidebarNav');
  const groups = [
    { key: 'main', label: '' },
    { key: 'tokens', label: 'Токены' },
    { key: 'components', label: 'Компоненты' },
    { key: 'templates', label: 'Шаблоны' },
    { key: 'icons', label: 'Иконки' }
  ];
  groups.forEach(g => {
    const groupItems = pages.filter(p => p.group === g.key);
    if (!groupItems.length) return;
    const groupEl = document.createElement('div');
    groupEl.className = 'sidebar-group';
    if (g.label) {
      const t = document.createElement('div');
      t.className = 'sidebar-group-title';
      t.textContent = g.label;
      groupEl.appendChild(t);
    }
    groupItems.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'sidebar-link';
      btn.dataset.page = p.id;
      btn.innerHTML = `
        <span class="sl-icon">${p.iconId ? pageIcon(p.iconId, 18) : (p.icon || '')}</span>
        <span>${p.label}</span>
        ${p.count ? `<span class="sl-count">${p.count}</span>` : ''}
      `;
      btn.addEventListener('click', () => navigateTo(p.id));
      groupEl.appendChild(btn);
    });
    nav.appendChild(groupEl);
  });
}

function initSidebarSearch() {
  const input = document.getElementById('sidebarSearchInput');
  const results = document.getElementById('sidebarSearchResults');
  if (!input || !results) return;

  // Theme switcher
  const themeSwitcher = document.getElementById('theme-switcher');
  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', e => {
      const btn = e.target.closest('.theme-btn');
      if (!btn) return;
      const mode = btn.dataset.themeMode;
      document.documentElement.setAttribute('data-theme', mode);
      themeSwitcher.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      localStorage.setItem('ds-theme', mode);
      if (typeof showSiteToast === 'function') showSiteToast(`Тема: ${mode}`);
    });

    // Load saved theme
    let savedTheme = localStorage.getItem('ds-theme') || 'light';
    if (savedTheme !== 'light' && savedTheme !== 'dark') {
      savedTheme = 'light';
      localStorage.setItem('ds-theme', savedTheme);
    }
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeSwitcher.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = themeSwitcher.querySelector(`[data-theme-mode="${savedTheme}"]`);
    if (activeBtn) activeBtn.classList.add('active');
  }

  function render(query) {
    const q = query.trim().toLowerCase();
    results.innerHTML = '';
    if (!q) {
      results.classList.remove('show');
      return;
    }

    const matches = uniqueComponentsList
      .filter(comp => {
        const cat = categoryOrder.find(c => [c.key, ...(c.extraKeys || [])].includes(comp.category));
        const haystack = `${comp.name} ${comp.category} ${cat?.label || ''} ${comp.params || ''} ${comp.states || ''}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 12);

    results.classList.add('show');
    if (!matches.length) {
      results.innerHTML = '<div class="sidebar-search-empty">Ничего не найдено</div>';
      return;
    }

    matches.forEach(comp => {
      const cat = categoryOrder.find(c => [c.key, ...(c.extraKeys || [])].includes(comp.category));
      const btn = document.createElement('button');
      btn.className = 'sidebar-search-result';
      btn.innerHTML = `<strong>${comp.name}</strong><span>${cat?.label || comp.category}</span>`;
      btn.addEventListener('click', () => {
        const pageId = componentPageIdFor(comp);
        navigateTo(pageId);
        results.classList.remove('show');
        input.blur();
        setTimeout(() => {
          const target = document.getElementById(componentDomId(comp));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.classList.add('is-search-hit');
            setTimeout(() => target.classList.remove('is-search-hit'), 1800);
          }
        }, 120);
      });
      results.appendChild(btn);
    });
  }

  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      input.value = '';
      render('');
      input.blur();
    }
  });
}

/* ============================================
   BUILD ALL PAGES
   ============================================ */
function buildPages() {
  const root = document.getElementById('pageContent');
  pages.forEach(p => {
    const pageEl = document.createElement('section');
    pageEl.className = 'page';
    pageEl.id = `page-${p.id}`;
    pageEl.innerHTML = `
      <div class="page-shell">
        <header class="page-header">
          <div class="page-header-bento">
            <div class="page-header-tile page-header-tile-meta">
              <span class="page-kicker">${p.kicker || (p.group === 'tokens' ? 'Tokens' : p.group === 'components' ? 'Components' : p.group === 'icons' ? 'Icons' : 'Overview')}</span>
            </div>
            <div class="page-header-tile page-header-tile-hero">
              <h1>${p.title}</h1>
              <p>${p.subtitle}</p>
            </div>
            <div class="page-header-tile page-header-tile-deco" aria-hidden="true">
              <div class="page-header-deco-grid">
                <div class="iridescence-container" data-iridescence aria-hidden="true"></div>
              </div>
            </div>
          </div>
        </header>
        <div class="page-body">
          <div class="page-body-inner" id="body-${p.id}"></div>
        </div>
      </div>
    `;
    root.appendChild(pageEl);
    const body = pageEl.querySelector(`#body-${p.id}`);
    body.appendChild(p.build());
  });
}

/* ============================================
   ROUTER
   ============================================ */
function navigateTo(pageId) {
  let templateTab = null;
  if (pageId.startsWith('templates/')) {
    templateTab = `template-${pageId.slice('templates/'.length)}`;
    pageId = 'templates';
  } else if (pageId.startsWith('template-')) {
    templateTab = pageId;
    pageId = 'templates';
  }
  if (!pages.find(p => p.id === pageId)) pageId = 'home';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.sidebar-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });

  // During Figma html-to-design capture the hash MUST keep starting with #figmacapture
  if (location.hash.startsWith('#figmacapture')) {
    // Keep capture hash intact; page is selected via ?page= or left as-is
  } else {
    const hashBase = templateTab ? `templates/${templateTab.replace('template-', '')}` : pageId;
    const nextHash = `#${hashBase}`;
    if (location.hash !== nextHash) {
      history.replaceState(null, '', nextHash);
    }
  }
  window.scrollTo({ top: 0, behavior: 'instant' });

  // close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('show');

  // Re-initialize widgets that need visible DOM
  reinitWidgets();

  requestAnimationFrame(() => {
    if (typeof managePageIridescence === 'function') managePageIridescence();
  });

  if (templateTab && typeof window.scrollToTemplateSection === 'function') {
    window.scrollToTemplateSection(templateTab);
  } else if (templateTab && typeof window.switchTemplateTab === 'function') {
    window.switchTemplateTab(templateTab);
  }
}

window.addEventListener('hashchange', () => {
  let raw = (location.hash.replace('#', '') || 'home').split('&')[0];
  if (raw.startsWith('figmacapture=')) raw = 'home';
  if (raw.startsWith('templates/')) {
    navigateTo('templates');
    const tabId = `template-${raw.slice('templates/'.length)}`;
    if (typeof window.scrollToTemplateSection === 'function') window.scrollToTemplateSection(tabId);
    return;
  }
  navigateTo(raw);
});

/* MOBILE SIDEBAR */
function initMobileSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) closeSidebar();
    else openSidebar();
  });
  backdrop.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
  });
}
