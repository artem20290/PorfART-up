/* ============================================
   COMPOSITE PAGE TEMPLATES
   ============================================ */
function initTemplates(scope) {
  const root = scope || document;
  initTemplatePage(root);
  initTemplateRequest(root);
  initTemplateCatalog(root);
  initTemplateLogin(root);
  initTemplateKanban(root);
}

function initTemplatePage(scope) {
  const root = scope || document;
  root.querySelectorAll('.tpl-page').forEach(page => {
    if (page.dataset.tplPageInit === '1') return;
    page.dataset.tplPageInit = '1';

    page.querySelectorAll('[data-tpl-jump]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const id = link.dataset.tplJump;
        const slug = id.replace('template-', '');
        const section = page.querySelector(`#tpl-${slug}`);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', `#templates/${slug}`);
        }
      });
    });

    window.scrollToTemplateSection = tabId => {
      const slug = tabId.replace('template-', '');
      const section = document.getElementById(`tpl-${slug}`);
      if (section) {
        requestAnimationFrame(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    };

    const hash = location.hash.replace('#', '');
    if (hash.startsWith('templates/')) {
      const slug = hash.slice('templates/'.length);
      const section = page.querySelector(`#tpl-${slug}`);
      if (section) {
        requestAnimationFrame(() => section.scrollIntoView({ behavior: 'instant', block: 'start' }));
      }
    }
  });
}

function initTemplateRequest(root) {
  root.querySelectorAll('[data-template-page="request"]').forEach(page => {
    if (page.dataset.tplReqInit === '1') return;
    page.dataset.tplReqInit = '1';

    const drawer = page.querySelector('[data-tpl-drawer]');
    const titleEl = page.querySelector('[data-tpl-drawer-title]');
    const brandEl = page.querySelector('[data-tpl-drawer-brand]');
    const statusEl = page.querySelector('[data-tpl-drawer-status]');
    const closeBtn = page.querySelector('[data-tpl-drawer-close]');

    function openDrawer(row) {
      if (!drawer) return;
      const id = row.dataset.id || row.dataset.row;
      if (titleEl) titleEl.textContent = `Заявка #${id}`;
      if (brandEl) brandEl.textContent = row.dataset.brand || '—';
      if (statusEl) statusEl.textContent = row.dataset.status || '—';
      page.querySelectorAll('[data-tpl-row]').forEach(r => r.classList.remove('is-selected'));
      row.classList.add('is-selected');
      drawer.hidden = false;
    }

    function closeDrawer() {
      if (!drawer) return;
      drawer.hidden = true;
      page.querySelectorAll('[data-tpl-row]').forEach(r => r.classList.remove('is-selected'));
    }

    page.querySelectorAll('[data-tpl-row]').forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.closest('input[type="checkbox"]')) return;
        openDrawer(row);
      });
    });

    closeBtn?.addEventListener('click', closeDrawer);
    drawer?.addEventListener('click', e => { if (e.target === drawer) closeDrawer(); });
  });
}

function initTemplateCatalog(root) {
  root.querySelectorAll('[data-template-page="catalog"]').forEach(page => {
    if (page.dataset.tplCatInit === '1') return;
    page.dataset.tplCatInit = '1';

    const titleEl = page.querySelector('[data-tpl-list-title]');
    const countEl = page.querySelector('[data-tpl-list-count]');

    page.querySelectorAll('[data-tpl-tree-filter]').forEach(row => {
      row.addEventListener('click', () => {
        const tree = page.querySelector('[data-tpl-tree]');
        tree?.querySelectorAll('.live-tree-row.is-selected').forEach(r => r.classList.remove('is-selected'));
        row.classList.add('is-selected');
        const name = row.textContent.trim();
        if (titleEl) titleEl.textContent = name;
        if (countEl) countEl.textContent = `${Math.floor(Math.random() * 8) + 5} позиций`;
      });
    });

    page.querySelectorAll('.live-tree-row:not([data-tpl-tree-filter])').forEach(row => {
      row.addEventListener('click', () => {
        const name = row.querySelector('span')?.textContent.trim();
        if (name && titleEl) titleEl.textContent = name;
        if (countEl) countEl.textContent = '12 позиций';
      });
    });
  });
}

function initTemplateLogin(root) {
  root.querySelectorAll('[data-template-page="login"]').forEach(page => {
    if (page.dataset.tplLoginInit === '1') return;
    page.dataset.tplLoginInit = '1';

    page.querySelector('[data-tpl-login-form]')?.addEventListener('submit', e => {
      e.preventDefault();
      if (typeof showSiteToast === 'function') showSiteToast('Вход выполнен (демо)');
    });

    page.querySelector('.tpl-login-forgot')?.addEventListener('click', () => {
      if (typeof showSiteToast === 'function') showSiteToast('Ссылка для восстановления отправлена (демо)');
    });
  });
}

function initTemplateKanban(root) {
  root.querySelectorAll('[data-kanban]').forEach(board => {
    if (board.dataset.kanbanInit === '1') return;
    board.dataset.kanbanInit = '1';

    function updateCounts() {
      board.querySelectorAll('[data-kanban-col]').forEach(col => {
        const count = col.querySelectorAll('[data-kanban-card]').length;
        const el = col.querySelector('.tpl-kanban-count');
        if (el) el.textContent = String(count);
      });
      const total = board.querySelectorAll('[data-kanban-card]').length;
      const toolbarCount = board.closest('[data-template-page="kanban"]')?.querySelector('[data-toolbar-count]');
      if (toolbarCount) toolbarCount.textContent = `Карточек: ${total}`;
    }

    board.querySelectorAll('[data-kanban-move]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const card = btn.closest('[data-kanban-card]');
        const target = btn.dataset.kanbanMove;
        const col = board.querySelector(`[data-kanban-col="${target}"] .tpl-kanban-cards`);
        if (card && col) {
          col.appendChild(card);
          updateCounts();
        }
      });
    });

    board.querySelectorAll('[data-kanban-card]').forEach(card => {
      card.addEventListener('click', () => {
        board.querySelectorAll('[data-kanban-card]').forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
      });
    });

    updateCounts();
  });
}
