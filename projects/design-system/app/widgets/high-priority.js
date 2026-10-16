/* ============================================
   HIGH-PRIORITY COMPONENTS
   ============================================ */
function initHighPriority(scope) {
  const root = scope || document;
  initDropdowns(root);
  initSplitButtons(root);
  initMultiSelects(root);
  initTreeSelects(root);
  initAlerts(root);
  initContextMenus(root);
  initVerticalTabs(root);
  initFilterBars(root);
  initCopyableFields(root);
  initNotificationCenters(root);
  initFilePreviews(root);
  initActivityFeeds(root);
  initAppShells(root);
}

function closeAllDropdowns(except) {
  document.querySelectorAll('.sb-dropdown-menu.is-open, .sb-split-menu.is-open, .sb-notif-panel.is-open, .sb-multiselect-menu.is-open, .sb-treeselect-panels.is-open').forEach(menu => {
    if (except && (except === menu || except.contains(menu))) return;
    menu.classList.remove('is-open');
    menu.hidden = true;
    const trigger = menu.closest('[data-dropdown], [data-split-btn], [data-notif-center], [data-multiselect], [data-treeselect]')
      ?.querySelector('[aria-expanded]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

function initDropdowns(root) {
  root.querySelectorAll('[data-dropdown]').forEach(el => {
    if (el.dataset.ddInit === '1') return;
    el.dataset.ddInit = '1';
    const trigger = el.querySelector('.sb-dropdown-trigger');
    const menu = el.querySelector('.sb-dropdown-menu');
    if (!trigger || !menu) return;

    function toggle(open) {
      const isOpen = open ?? !menu.classList.contains('is-open');
      closeAllDropdowns(isOpen ? el : null);
      menu.classList.toggle('is-open', isOpen);
      menu.hidden = !isOpen;
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    trigger.addEventListener('click', e => { e.stopPropagation(); toggle(); });
    menu.querySelectorAll('.sb-dropdown-item:not([disabled])').forEach(item => {
      item.addEventListener('click', () => {
        if (typeof showSiteToast === 'function') showSiteToast(item.textContent.trim());
        toggle(false);
      });
    });
  });
}

function initSplitButtons(root) {
  root.querySelectorAll('[data-split-btn]').forEach(el => {
    if (el.dataset.splitInit === '1') return;
    el.dataset.splitInit = '1';
    const toggle = el.querySelector('.sb-split-toggle');
    const menu = el.querySelector('.sb-split-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = !menu.classList.contains('is-open');
      closeAllDropdowns(isOpen ? el : null);
      menu.classList.toggle('is-open', isOpen);
      menu.hidden = !isOpen;
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    menu.querySelectorAll('.sb-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        if (typeof showSiteToast === 'function') showSiteToast(`Экспорт: ${item.textContent.trim()}`);
        menu.classList.remove('is-open');
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  });
}

function initMultiSelects(root) {
  root.querySelectorAll('[data-multiselect]').forEach(el => {
    if (el.dataset.msInit === '1') return;
    el.dataset.msInit = '1';
    const control = el.querySelector('.sb-multiselect-control');
    const menu = el.querySelector('.sb-multiselect-menu');
    const input = el.querySelector('.sb-multiselect-input');
    if (!control || !menu) return;

    function openMenu() {
      closeAllDropdowns(el);
      menu.classList.add('is-open');
      menu.hidden = false;
    }

    control.addEventListener('click', () => openMenu());
    input?.addEventListener('focus', () => openMenu());

    el.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        btn.closest('.sb-multiselect-tag')?.remove();
      });
    });

    menu.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const label = cb.parentElement.textContent.trim();
        const existing = [...control.querySelectorAll('.sb-multiselect-tag')].some(t => t.textContent.includes(label));
        if (cb.checked && !existing) {
          const tag = document.createElement('span');
          tag.className = 'sb-multiselect-tag';
          tag.innerHTML = `${label} <button type="button" data-remove="${label}" aria-label="Убрать">×</button>`;
          control.insertBefore(tag, input);
          tag.querySelector('[data-remove]').addEventListener('click', ev => {
            ev.stopPropagation();
            tag.remove();
            cb.checked = false;
          });
        }
        if (!cb.checked) {
          [...control.querySelectorAll('.sb-multiselect-tag')].forEach(t => {
            if (t.textContent.includes(label)) t.remove();
          });
        }
      });
    });
  });
}

function initTreeSelects(root) {
  root.querySelectorAll('[data-treeselect]').forEach(el => {
    if (el.dataset.tsInit === '1') return;
    el.dataset.tsInit = '1';
    const trigger = el.querySelector('.sb-treeselect-trigger');
    const panels = el.querySelector('.sb-treeselect-panels');
    const valueEl = el.querySelector('[data-ts-value]');
    const path = ['Екатеринбург', 'Склад А', 'Линия 3'];
    if (!trigger || !panels) return;

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = !panels.classList.contains('is-open');
      closeAllDropdowns(isOpen ? el : null);
      panels.classList.toggle('is-open', isOpen);
      panels.hidden = !isOpen;
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    panels.querySelectorAll('.sb-treeselect-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        const panel = item.closest('.sb-treeselect-panel');
        panel.querySelectorAll('.sb-treeselect-item').forEach(x => x.classList.remove('is-active'));
        item.classList.add('is-active');
        const level = parseInt(item.dataset.level, 10);
        path[level] = item.textContent.trim();
        if (valueEl) valueEl.textContent = path.slice(0, level + 1).join(' / ');
        if (level === 2) {
          panels.classList.remove('is-open');
          panels.hidden = true;
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
}

function initAlerts(root) {
  root.querySelectorAll('[data-alert]').forEach(el => {
    if (el.dataset.alertInit === '1') return;
    el.dataset.alertInit = '1';
    el.querySelector('.sb-alert-close')?.addEventListener('click', () => {
      el.style.display = 'none';
    });
  });
}

function initContextMenus(root) {
  root.querySelectorAll('[data-context-menu]').forEach(el => {
    if (el.dataset.ctxInit === '1') return;
    el.dataset.ctxInit = '1';
    const target = el.querySelector('.sb-context-target');
    const menu = el.querySelector('.sb-context-menu');
    if (!target || !menu) return;

    target.addEventListener('contextmenu', e => {
      e.preventDefault();
      menu.hidden = false;
      menu.classList.add('is-open');
      menu.style.left = e.offsetX + 'px';
      menu.style.top = e.offsetY + 'px';
    });

    document.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menu.hidden = true;
    });

    menu.querySelectorAll('.sb-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        if (typeof showSiteToast === 'function') showSiteToast(item.textContent.trim());
        menu.classList.remove('is-open');
        menu.hidden = true;
      });
    });
  });
}

function initVerticalTabs(root) {
  root.querySelectorAll('[data-vtabs]').forEach(el => {
    if (el.dataset.vtInit === '1') return;
    el.dataset.vtInit = '1';
    const tabs = el.querySelectorAll('.sb-vtabs-tab');
    const panels = el.querySelectorAll('.sb-vtabs-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.vtab;
        tabs.forEach(t => t.classList.toggle('is-active', t === tab));
        panels.forEach(p => p.classList.toggle('is-active', p.dataset.vpanel === id));
      });
    });
  });
}

function initFilterBars(root) {
  root.querySelectorAll('[data-filter-bar]').forEach(el => {
    if (el.dataset.fbInit === '1') return;
    el.dataset.fbInit = '1';
    el.querySelectorAll('[data-filter-remove]').forEach(btn => {
      btn.addEventListener('click', () => btn.closest('.sb-filter-chip')?.remove());
    });
    el.querySelector('[data-filter-reset]')?.addEventListener('click', () => {
      el.querySelectorAll('.sb-filter-chip').forEach(c => c.remove());
    });
  });
}

function initCopyableFields(root) {
  root.querySelectorAll('[data-copy-btn]').forEach(btn => {
    if (btn.dataset.copyInit === '1') return;
    btn.dataset.copyInit = '1';
    btn.addEventListener('click', () => {
      const val = btn.closest('.sb-copyable')?.querySelector('[data-copy-value]')?.textContent;
      if (!val) return;
      if (typeof fallbackClipboardCopy === 'function') fallbackClipboardCopy(val);
      if (typeof showSiteToast === 'function') showSiteToast('Скопировано ✓');
    });
  });
}

function initNotificationCenters(root) {
  root.querySelectorAll('[data-notif-center]').forEach(el => {
    if (el.dataset.ncInit === '1') return;
    el.dataset.ncInit = '1';
    const trigger = el.querySelector('.sb-notif-trigger');
    const panel = el.querySelector('.sb-notif-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = !panel.classList.contains('is-open');
      closeAllDropdowns(isOpen ? el : null);
      panel.classList.toggle('is-open', isOpen);
      panel.hidden = !isOpen;
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    el.querySelector('[data-notif-clear]')?.addEventListener('click', () => {
      el.querySelectorAll('.sb-notif-item').forEach(i => i.classList.remove('is-unread'));
      const badge = el.querySelector('.sb-notif-badge');
      if (badge) badge.hidden = true;
    });
  });
}

function initFilePreviews(root) {
  root.querySelectorAll('[data-file-preview]').forEach(el => {
    if (el.dataset.fpInit === '1') return;
    el.dataset.fpInit = '1';
    const overlay = el.querySelector('.sb-fp-overlay');
    if (!overlay || overlay.classList.contains('sb-fp-overlay--scoped')) return;

    const portalOverlay = () => {
      if (overlay.dataset.portaled) return;
      overlay._portalAnchor = { parent: overlay.parentNode, next: overlay.nextSibling };
      overlay.classList.add('sb-fp-overlay--portaled');
      document.body.appendChild(overlay);
      overlay.dataset.portaled = '1';
    };
    const restoreOverlay = () => {
      if (!overlay.dataset.portaled || !overlay._portalAnchor) return;
      const { parent, next } = overlay._portalAnchor;
      if (parent) {
        if (next && next.parentNode === parent) parent.insertBefore(overlay, next);
        else parent.appendChild(overlay);
      }
      overlay.classList.remove('sb-fp-overlay--portaled');
      delete overlay.dataset.portaled;
      delete overlay._portalAnchor;
    };

    const open = () => {
      portalOverlay();
      overlay.classList.add('is-open');
      overlay.hidden = false;
    };
    const close = () => {
      overlay.classList.remove('is-open');
      overlay.hidden = true;
      restoreOverlay();
    };

    el.querySelector('[data-fp-open]')?.addEventListener('click', open);
    el.querySelector('[data-fp-close]')?.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  });
}

function initActivityFeeds(root) {
  root.querySelectorAll('[data-activity-feed]').forEach(el => {
    if (el.dataset.afInit === '1') return;
    el.dataset.afInit = '1';
    const list = el.querySelector('.sb-activity-list');
    const input = el.querySelector('[data-activity-input]');
    el.querySelector('[data-activity-send]')?.addEventListener('click', () => {
      const text = input?.value.trim();
      if (!text || !list) return;
      const li = document.createElement('li');
      li.className = 'sb-activity-item';
      li.innerHTML = `<div class="sb-activity-avatar">ВЫ</div><div class="sb-activity-body"><div class="sb-activity-meta"><strong>Вы</strong><span>только что</span></div><p>${text}</p></div>`;
      list.prepend(li);
      input.value = '';
    });
  });
}

function initAppShells(root) {
  root.querySelectorAll('.sb-appshell').forEach(el => {
    if (el.dataset.shellInit === '1') return;
    el.dataset.shellInit = '1';
    const content = el.querySelector('.sb-appshell-content');
    const navs = el.querySelectorAll('.sb-appshell-nav');
    const labels = { 'Заявки': 'Таблица заявок с фильтрами и пагинацией.', 'Аналитика': 'Дашборд KPI и графики отгрузок.', 'Каталог': 'Каталог продукции с поиском.', 'Настройки': 'Профиль, уведомления, интеграции.' };
    navs.forEach(nav => {
      nav.addEventListener('click', () => {
        navs.forEach(n => n.classList.remove('is-active'));
        nav.classList.add('is-active');
        const text = nav.textContent.replace(/^[^\s]+\s*/, '').trim();
        if (content) content.textContent = labels[text] || 'Контент страницы.';
      });
    });
  });
}

if (!window._highPriorityClickBound) {
  window._highPriorityClickBound = true;
  document.addEventListener('click', () => closeAllDropdowns());
}
