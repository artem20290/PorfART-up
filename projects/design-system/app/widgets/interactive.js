/* ============================================
   SPOILER — reveal / hide
   ============================================ */
function initSpoilers(scope) {
  const root = scope || document;
  root.querySelectorAll('[data-spoiler]').forEach(spoiler => {
    if (spoiler.dataset.spoilerInit === '1') return;
    spoiler.dataset.spoilerInit = '1';

    const toggle = spoiler.querySelector('.sb-spoiler-toggle');
    const content = spoiler.querySelector('.sb-spoiler-content');
    const placeholder = spoiler.querySelector('.sb-spoiler-placeholder');
    if (!toggle || !content) return;

    const showLabel = toggle.dataset.showLabel || toggle.textContent.trim() || 'Показать';
    const hideLabel = toggle.dataset.hideLabel || 'Скрыть';

    function setRevealed(revealed) {
      spoiler.classList.toggle('is-revealed', revealed);
      toggle.setAttribute('aria-expanded', revealed ? 'true' : 'false');
      toggle.textContent = revealed ? hideLabel : showLabel;
      content.setAttribute('aria-hidden', revealed ? 'false' : 'true');
      if (placeholder) placeholder.setAttribute('aria-hidden', revealed ? 'true' : 'false');
    }

    if (!toggle.dataset.showLabel) toggle.dataset.showLabel = showLabel;
    toggle.dataset.hideLabel = hideLabel;

    if (spoiler.classList.contains('is-revealed')) {
      setRevealed(true);
    } else {
      setRevealed(false);
    }

    toggle.addEventListener('click', () => {
      setRevealed(!spoiler.classList.contains('is-revealed'));
    });
  });
}

/* ============================================
   COLLAPSE (single panel)
   ============================================ */
function initCollapses(scope) {
  const root = scope || document;
  root.querySelectorAll('[data-collapse]').forEach(panel => {
    if (panel.dataset.collapseInit === '1') return;
    panel.dataset.collapseInit = '1';

    const trigger = panel.querySelector('.sb-collapse-trigger');
    if (!trigger || trigger.disabled || panel.classList.contains('is-disabled')) return;

    trigger.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
}

/* ============================================
   STEPS ENGINE
   ============================================ */
function initSteps() {
  document.querySelectorAll('[data-steps]').forEach(root => {
    if (root.dataset.stepsInit === '1') return;
    root.dataset.stepsInit = '1';

    const mode = root.dataset.stepsMode || 'status';
    const card = root.closest('.sb-steps-card') || root.closest('.showcase-demo');
    const valueEl = card?.querySelector('[data-steps-current-label]');
    const items = Array.from(root.querySelectorAll('.sb-step'));

    const state = {
      current: Math.max(0, items.findIndex(i => i.classList.contains('is-current'))),
      disabled: items.map(i => i.classList.contains('is-disabled')),
      skipped: items.map(i => i.classList.contains('is-skipped')),
      completed: items.map(i => i.classList.contains('is-completed')),
      labels: items.map(i => i.querySelector('.sb-step-label')?.textContent?.trim() || `Шаг ${Number(i.dataset.stepIndex) + 1}`),
    };

    function setCircleContent(item, index) {
      const circle = item.querySelector('[data-step-circle]');
      const meta = item.querySelector('.sb-step-meta');
      if (!circle || !meta) return;

      if (state.disabled[index]) {
        circle.textContent = String(index + 1);
        meta.textContent = 'Недоступно';
        return;
      }
      if (state.skipped[index]) {
        circle.textContent = '↷';
        meta.textContent = 'Пропущен';
        return;
      }
      if (state.completed[index]) {
        circle.textContent = '✓';
        meta.textContent = 'Готово';
        return;
      }
      if (state.current === index) {
        circle.textContent = String(index + 1);
        meta.textContent = 'Текущий';
        return;
      }
      circle.textContent = String(index + 1);
      meta.textContent = 'Ожидание';
    }

    function render() {
      items.forEach((item, index) => {
        item.classList.toggle('is-disabled', !!state.disabled[index]);
        item.classList.toggle('is-skipped', !!state.skipped[index]);
        item.classList.toggle('is-completed', !!state.completed[index]);
        item.classList.toggle('is-current', state.current === index && !state.disabled[index]);
        setCircleContent(item, index);
      });
      if (valueEl) valueEl.textContent = state.labels[state.current] || '—';
    }

    function rebuildStatusCurrent(nextIndex) {
      state.current = nextIndex;
      items.forEach((_, i) => {
        if (state.disabled[i]) return;
        if (state.skipped[i]) {
          state.completed[i] = false;
          return;
        }
        state.completed[i] = i < nextIndex;
      });
    }

    function nextAvailable(from) {
      for (let i = from + 1; i < items.length; i++) {
        if (!state.disabled[i]) return i;
      }
      return from;
    }

    function prevAvailable(from) {
      for (let i = from - 1; i >= 0; i--) {
        if (!state.disabled[i]) return i;
      }
      return from;
    }

    items.forEach((item, index) => {
      const btn = item.querySelector('.sb-step-btn');
      btn?.addEventListener('click', () => {
        if (state.disabled[index]) return;
        if (mode === 'wizard') {
          state.current = index;
        } else {
          rebuildStatusCurrent(index);
        }
        render();
      });
    });

    if (mode === 'wizard' && card) {
      const initial = {
        current: state.current,
        skipped: [...state.skipped],
        completed: [...state.completed],
      };

      card.querySelector('[data-steps-next]')?.addEventListener('click', () => {
        if (!state.disabled[state.current]) {
          state.skipped[state.current] = false;
          state.completed[state.current] = true;
        }
        state.current = nextAvailable(state.current);
        render();
      });

      card.querySelector('[data-steps-prev]')?.addEventListener('click', () => {
        state.current = prevAvailable(state.current);
        render();
      });

      card.querySelector('[data-steps-skip]')?.addEventListener('click', () => {
        if (!state.disabled[state.current]) {
          state.skipped[state.current] = true;
          state.completed[state.current] = false;
        }
        state.current = nextAvailable(state.current);
        render();
      });

      card.querySelector('[data-steps-reset]')?.addEventListener('click', () => {
        state.current = initial.current;
        state.skipped = [...initial.skipped];
        state.completed = [...initial.completed];
        render();
      });
    }

    render();
  });
}

/* ============================================
   PAGINATION ENGINE
   ============================================ */
function initPaginations() {
  document.querySelectorAll('[data-pagination]').forEach(root => {
    if (root.dataset.pgInit === '1') return;
    root.dataset.pgInit = '1';

    const total = parseInt(root.dataset.total, 10) || 1;
    const visible = parseInt(root.dataset.visible, 10) || 7;
    const showFirst = root.dataset.first === '1';
    const showLast = root.dataset.last === '1';
    let current = parseInt(root.dataset.value, 10) || 1;

    const card = root.parentElement;
    const labelEl = card?.querySelector('[data-pagination-label]');

    function getPages() {
      // returns array of numbers and '...' strings
      if (total <= visible) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      const pages = [];
      const side = Math.floor((visible - 1) / 2); // pages each side of current ideally
      let start = Math.max(1, current - Math.floor((visible - 2) / 2));
      let end = start + visible - 1;
      if (end > total) {
        end = total;
        start = Math.max(1, end - visible + 1);
      }

      // always keep first/last with ellipsis
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < total) {
        if (end < total - 1) pages.push('...');
        pages.push(total);
      }
      return pages;
    }

    function makeBtn(content, opts = {}) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = content;
      if (opts.active) btn.classList.add('active');
      if (opts.disabled) btn.disabled = true;
      if (opts.onClick) btn.addEventListener('click', opts.onClick);
      return btn;
    }

    function goTo(page) {
      current = Math.min(total, Math.max(1, page));
      if (labelEl) labelEl.textContent = current;
      render();
    }

    function render() {
      root.innerHTML = '';

      // First page button
      if (showFirst) {
        root.appendChild(makeBtn('«', { disabled: current === 1, onClick: () => goTo(1) }));
      }
      // Prev
      root.appendChild(makeBtn('‹', { disabled: current === 1, onClick: () => goTo(current - 1) }));

      // Numbered pages
      getPages().forEach(p => {
        if (p === '...') {
          const dots = document.createElement('button');
          dots.type = 'button';
          dots.textContent = '…';
          dots.disabled = true;
          root.appendChild(dots);
        } else {
          root.appendChild(makeBtn(String(p), { active: p === current, onClick: () => goTo(p) }));
        }
      });

      // Next
      root.appendChild(makeBtn('›', { disabled: current === total, onClick: () => goTo(current + 1) }));
      // Last page button
      if (showLast) {
        root.appendChild(makeBtn('»', { disabled: current === total, onClick: () => goTo(total) }));
      }
    }

    render();
  });
}

/* ============================================
   BREADCRUMBS ENGINE
   ============================================ */
function initBreadcrumbs() {
  document.querySelectorAll('[data-breadcrumbs]').forEach(nav => {
    if (nav.dataset.bcInit === '1') return;
    nav.dataset.bcInit = '1';

    nav.querySelectorAll('[data-bc-menu]').forEach(wrapper => {
      const trigger = wrapper.querySelector('.bc-menu-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = wrapper.classList.contains('is-open');
        // close all others
        nav.querySelectorAll('[data-bc-menu].is-open').forEach(w => {
          if (w !== wrapper) w.classList.remove('is-open');
        });
        wrapper.classList.toggle('is-open');
      });
    });
  });

  // close submenus on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-bc-menu]')) {
      document.querySelectorAll('[data-bc-menu].is-open').forEach(w => w.classList.remove('is-open'));
    }
  });
}

function initTabs(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-tabs]').forEach(tablist => {
    if (tablist.dataset.tabsInit === '1') return;
    tablist.dataset.tabsInit = '1';
    const buttons = tablist.querySelectorAll('button[role="tab"], button');
    const status = tablist.closest('.tabs-demo')?.querySelector('[data-tab-status]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        if (status) status.textContent = btn.textContent.trim();
      });
    });
  });
}

/* ============================================
   DONUT CHART — legend hover highlight
   ============================================ */
function initDonutCharts(scope) {
  const root = scope || document;
  root.querySelectorAll('[data-donut-chart]').forEach(chart => {
    if (chart.dataset.donutInit === '1') return;
    chart.dataset.donutInit = '1';

    const segs = chart.querySelectorAll('.sb-donut-seg');
    const items = chart.querySelectorAll('.sb-donut-legend-item');
    if (!segs.length || !items.length) return;

    function highlight(idx) {
      chart.classList.add('is-dimmed');
      segs.forEach(s => s.classList.toggle('is-highlighted', s.dataset.seg === idx));
      items.forEach(i => i.classList.toggle('is-active', i.dataset.seg === idx));
    }

    function reset() {
      chart.classList.remove('is-dimmed');
      segs.forEach(s => s.classList.remove('is-highlighted'));
      items.forEach(i => i.classList.remove('is-active'));
    }

    items.forEach(item => {
      item.addEventListener('mouseenter', () => highlight(item.dataset.seg));
      item.addEventListener('focus', () => highlight(item.dataset.seg));
      item.addEventListener('mouseleave', reset);
      item.addEventListener('blur', reset);
      item.setAttribute('tabindex', '0');
    });

    chart.addEventListener('mouseleave', reset);
  });
}

/* ============================================
   BAR CHART — bar hover highlight
   ============================================ */
function initBarCharts(scope) {
  const root = scope || document;
  root.querySelectorAll('[data-bar-chart]').forEach(chart => {
    if (chart.dataset.barInit === '1') return;
    chart.dataset.barInit = '1';

    const cols = chart.querySelectorAll('.sb-bar-chart-col');
    if (!cols.length) return;

    function highlight(idx) {
      chart.classList.add('is-dimmed');
      cols.forEach(c => c.classList.toggle('is-active', c.dataset.bar === idx));
    }

    function reset() {
      chart.classList.remove('is-dimmed');
      cols.forEach(c => c.classList.remove('is-active'));
    }

    cols.forEach(col => {
      col.addEventListener('mouseenter', () => highlight(col.dataset.bar));
      col.addEventListener('focus', () => highlight(col.dataset.bar));
      col.addEventListener('mouseleave', reset);
      col.addEventListener('blur', reset);
    });

    chart.addEventListener('mouseleave', reset);
  });
}

/* ============================================
   STACKED BAR CHART — series / column highlight
   ============================================ */
function initStackedBarCharts(scope) {
  const root = scope || document;
  root.querySelectorAll('[data-stacked-bar-chart]').forEach(chart => {
    if (chart.dataset.stackedBarInit === '1') return;
    chart.dataset.stackedBarInit = '1';

    const cols = chart.querySelectorAll('.sb-stacked-bar-chart-col');
    const segs = chart.querySelectorAll('.sb-stacked-bar-seg');
    const legendItems = chart.querySelectorAll('.sb-stacked-bar-legend-item');
    if (!cols.length) return;

    function resetSeries() {
      chart.classList.remove('is-series-dimmed');
      segs.forEach(s => s.classList.remove('is-series-active'));
      legendItems.forEach(i => i.classList.remove('is-active'));
    }

    function resetCols() {
      chart.classList.remove('is-col-dimmed');
      cols.forEach(c => c.classList.remove('is-active'));
    }

    function highlightSeries(idx) {
      resetCols();
      chart.classList.add('is-series-dimmed');
      segs.forEach(s => s.classList.toggle('is-series-active', s.dataset.series === idx));
      legendItems.forEach(i => i.classList.toggle('is-active', i.dataset.series === idx));
    }

    function highlightCol(idx) {
      resetSeries();
      chart.classList.add('is-col-dimmed');
      cols.forEach(c => c.classList.toggle('is-active', c.dataset.bar === idx));
    }

    legendItems.forEach(item => {
      item.addEventListener('mouseenter', () => highlightSeries(item.dataset.series));
      item.addEventListener('focus', () => highlightSeries(item.dataset.series));
      item.addEventListener('mouseleave', resetSeries);
      item.addEventListener('blur', resetSeries);
    });

    cols.forEach(col => {
      col.addEventListener('mouseenter', () => highlightCol(col.dataset.bar));
      col.addEventListener('focus', () => highlightCol(col.dataset.bar));
      col.addEventListener('mouseleave', resetCols);
      col.addEventListener('blur', resetCols);
    });

    chart.addEventListener('mouseleave', () => {
      resetSeries();
      resetCols();
    });
  });
}

/* ============================================
   LINE CHART — point hover highlight
   ============================================ */
function initLineCharts(scope) {
  const root = scope || document;
  root.querySelectorAll('[data-line-chart], [data-area-chart]').forEach(chart => {
    if (chart.dataset.lineInit === '1') return;
    chart.dataset.lineInit = '1';

    const hits = chart.querySelectorAll('.sb-line-chart-dot-hit, .sb-area-chart-dot-hit');
    if (!hits.length) return;

    function highlight(idx) {
      chart.classList.add('is-dimmed');
      hits.forEach(h => h.classList.toggle('is-active', h.dataset.point === idx));
    }

    function reset() {
      chart.classList.remove('is-dimmed');
      hits.forEach(h => h.classList.remove('is-active'));
    }

    hits.forEach(hit => {
      hit.setAttribute('tabindex', '0');
      hit.addEventListener('mouseenter', () => highlight(hit.dataset.point));
      hit.addEventListener('focus', () => highlight(hit.dataset.point));
      hit.addEventListener('mouseleave', reset);
      hit.addEventListener('blur', reset);
    });

    chart.addEventListener('mouseleave', reset);
  });
}

/* ============================================
   CHIPS — select & close
   ============================================ */
function initChips(scope) {
  const root = scope || document;

  root.querySelectorAll('[data-chips-selectable]').forEach(group => {
    if (group.dataset.chipsSelectInit === '1') return;
    group.dataset.chipsSelectInit = '1';

    const single = group.hasAttribute('data-chips-single');
    group.querySelectorAll('button.sb-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.disabled) return;
        if (single) {
          group.querySelectorAll('button.sb-chip').forEach(c => c.classList.remove('is-selected'));
          chip.classList.add('is-selected');
        } else {
          chip.classList.toggle('is-selected');
        }
      });
    });
  });

  root.querySelectorAll('[data-chips-closable]').forEach(group => {
    if (group.dataset.chipsCloseInit === '1') return;
    group.dataset.chipsCloseInit = '1';

    group.querySelectorAll('.sb-chip-close').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const chip = btn.closest('.sb-chip');
        if (!chip) return;
        chip.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        chip.style.opacity = '0';
        chip.style.transform = 'scale(0.88)';
        setTimeout(() => chip.remove(), 200);
      });
    });
  });
}

/* ============================================
   BADGE GROUP ENGINE
   ============================================ */
function initBadgeGroups() {
  document.querySelectorAll('[data-bg-close]').forEach(btn => {
    if (btn.dataset.bgCloseInit === '1') return;
    btn.dataset.bgCloseInit = '1';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const item = btn.closest('.sb-bg-item');
      if (item) {
        item.style.transition = 'opacity 0.2s, transform 0.2s';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.85)';
        setTimeout(() => item.remove(), 220);
      }
    });
  });
}

/* ============================================
   ATTACHMENT ENGINE
   ============================================ */
function initAttachments() {
  // Action buttons on each attachment card
  document.querySelectorAll('[data-attachment]').forEach(card => {
    if (card.dataset.attInit === '1') return;
    card.dataset.attInit = '1';

    card.addEventListener('click', e => {
      // If user clicked on action button — handle that
      const downloadBtn = e.target.closest('[data-download]');
      const removeBtn = e.target.closest('[data-remove]');
      if (downloadBtn) {
        e.stopPropagation();
        const name = card.querySelector('.sb-attachment-name')?.textContent || 'file';
        console.log(`[Attachment] Скачать: ${name}`);
        return;
      }
      if (removeBtn) {
        e.stopPropagation();
        card.style.transition = 'opacity 0.25s, transform 0.25s';
        card.style.opacity = '0';
        card.style.transform = 'translateX(-12px)';
        setTimeout(() => card.remove(), 260);
        return;
      }
      // Otherwise - just open (visual feedback)
      card.classList.add('is-pressed');
      setTimeout(() => card.classList.remove('is-pressed'), 150);
    });
  });

  // Drop area
  document.querySelectorAll('[data-drop]').forEach(zone => {
    if (zone.dataset.dropInit === '1') return;
    zone.dataset.dropInit = '1';

    const onEnter = e => { e.preventDefault(); zone.classList.add('is-drag'); };
    const onOver = e => e.preventDefault();
    const onLeave = e => { if (e.target === zone) zone.classList.remove('is-drag'); };
    const onDrop = e => {
      e.preventDefault();
      zone.classList.remove('is-drag');
      const files = e.dataTransfer?.files;
      if (files && files.length) {
        for (const file of files) addDroppedFile(zone, file);
      }
    };

    zone.addEventListener('dragenter', onEnter);
    zone.addEventListener('dragover', onOver);
    zone.addEventListener('dragleave', onLeave);
    zone.addEventListener('drop', onDrop);

    zone.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = () => {
        for (const file of input.files) addDroppedFile(zone, file);
      };
      input.click();
    });
  });
}

function addDroppedFile(zone, file) {
  const sizeMB = (file.size / 1024 / 1024).toFixed(1);
  const ext = (file.name.split('.').pop() || 'file').toLowerCase().slice(0, 4);
  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ', ' +
    now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const card = document.createElement('div');
  card.className = 'sb-attachment';
  card.dataset.attachment = '';
  card.dataset.attInit = '1';
  card.innerHTML = `
    <div class="sb-attachment-pictogram ext-${ext}"><span>${ext}</span></div>
    <div class="sb-attachment-info">
      <div class="sb-attachment-name">${file.name}</div>
      <div class="sb-attachment-description">${sizeMB} Mб · ${dateStr}</div>
    </div>
    <div class="sb-attachment-actions">
      <button class="sb-attachment-action" data-download title="Скачать">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </button>
      <button class="sb-attachment-action is-danger" data-remove title="Удалить">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
      </button>
    </div>
  `;

  // Insert after the drop zone, not inside it
  zone.parentNode.insertBefore(card, zone.nextSibling);

  // Attach handlers to the new card
  card.addEventListener('click', e => {
    const downloadBtn = e.target.closest('[data-download]');
    const removeBtn = e.target.closest('[data-remove]');
    if (downloadBtn) {
      e.stopPropagation();
      console.log(`[Attachment] Скачать: ${file.name}`);
      return;
    }
    if (removeBtn) {
      e.stopPropagation();
      card.style.transition = 'opacity 0.25s, transform 0.25s';
      card.style.opacity = '0';
      card.style.transform = 'translateX(-12px)';
      setTimeout(() => card.remove(), 260);
    }
  });
}

/* ============================================
   USER SELECT ENGINE
   ============================================ */
const userSelectData = [
  { id: 1, label: 'Андрей Андреев', subLabel: 'andrey@gmail.com' },
  { id: 2, label: 'Иван Иванов', subLabel: 'ivan@gmail.com' },
  { id: 3, label: 'Алексей Волков', subLabel: 'alexey.volkov@sb.local', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face' },
  { id: 4, label: 'Мария Петрова', subLabel: 'maria@sb.local' },
  { id: 5, label: 'Сергей Козлов', subLabel: 'kozlov@company.ru' },
  { id: 6, label: 'Анна Сидорова', subLabel: 'anna.s@icloud.com' },
];

function createInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function createAvatarHTML(item) {
  if (item.avatarUrl) {
    return `<img src="${item.avatarUrl}" alt="" />`;
  }
  return `<span class="us-avatar-placeholder">${createInitials(item.label)}</span>`;
}

function initUserSelects() {
  document.querySelectorAll('[data-userselect]').forEach(root => {
    if (root.dataset.usInit === '1') return;
    root.dataset.usInit = '1';

    if (root.classList.contains('is-disabled') || root.classList.contains('is-error')) return;

    const wrapper = root.querySelector('.sb-userselect-input-wrap');
    const placeholder = root.querySelector('[data-us-placeholder]');
    const valueEl = root.querySelector('[data-us-value]');
    const avatarEl = root.querySelector('[data-us-avatar]');
    const nameEl = root.querySelector('[data-us-name]');
    const emailEl = root.querySelector('[data-us-email]');
    const clearBtn = root.querySelector('[data-us-clear]');
    const dropdown = root.querySelector('[data-us-dropdown]');
    const preselected = parseInt(root.dataset.preselected);

    if (!wrapper || !dropdown) return;

    let selectedItem = null;
    let isOpen = false;

    // --- Search block (inside dropdown) ---
    const searchDiv = document.createElement('div');
    searchDiv.className = 'sb-userselect-search';
    searchDiv.innerHTML = `
      <svg class="sb-userselect-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" placeholder="Поиск по имени или email..." />`;
    dropdown.appendChild(searchDiv);
    const searchInput = searchDiv.querySelector('input');

    // --- List container ---
    const listEl = document.createElement('div');
    listEl.className = 'sb-userselect-list';
    dropdown.appendChild(listEl);

    // --- Helpers ---
    function getFilteredItems(query) {
      if (!query) return userSelectData;
      const q = query.toLowerCase();
      return userSelectData.filter(i =>
        i.label.toLowerCase().includes(q) || i.subLabel.toLowerCase().includes(q)
      );
    }

    function highlightUserText(text, query) {
      if (!query) return text;
      const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(re, '<mark style="background:rgba(0,143,149,0.18);color:var(--primary);border-radius:2px;padding:0 1px">$1</mark>');
    }

    function renderDropdown(query) {
      const filtered = getFilteredItems(query);
      listEl.innerHTML = '';

      if (!filtered.length) {
        listEl.innerHTML = `<div class="sb-user-empty">${icon('search', 16)} Ничего не найдено по запросу «${query}»</div>`;
        return;
      }

      filtered.forEach((item, idx) => {
        const opt = document.createElement('div');
        opt.className = 'sb-user-option';
        if (selectedItem && selectedItem.id === item.id) opt.classList.add('is-selected');
        opt.dataset.idx = idx;
        opt.innerHTML = `
          <div class="us-avatar">${createAvatarHTML(item)}</div>
          <div class="us-info">
            <span class="us-name">${highlightUserText(item.label, query)}</span>
            <span class="us-email">${item.subLabel}</span>
          </div>
          <div class="us-check">✓</div>`;
        opt.addEventListener('mousedown', e => {
          e.preventDefault();
          selectUser(item);
        });
        opt.addEventListener('mouseenter', () => {
          const all = listEl.querySelectorAll('.sb-user-option');
          all.forEach((o, i) => o.classList.toggle('is-highlighted', i === idx));
        });
        listEl.appendChild(opt);
      });
    }

    function selectUser(item) {
      selectedItem = item;
      if (placeholder) placeholder.style.display = 'none';
      if (valueEl) {
        valueEl.style.display = 'flex';
        if (avatarEl) avatarEl.innerHTML = createAvatarHTML(item);
        if (nameEl) nameEl.textContent = item.label;
        if (emailEl) emailEl.textContent = item.subLabel;
      }
      root.classList.add('has-value');
      closeDropdown();
    }

    function clearSelection() {
      selectedItem = null;
      if (placeholder) placeholder.style.display = '';
      if (valueEl) valueEl.style.display = 'none';
      root.classList.remove('has-value');
    }

    function openDropdown() {
      if (isOpen) return;
      isOpen = true;
      searchInput.value = '';
      renderDropdown('');
      root.classList.add('is-focused');
      dropdown.classList.add('is-open');
      requestAnimationFrame(() => {
        searchInput.focus();
      });
    }

    function closeDropdown() {
      if (!isOpen) return;
      isOpen = false;
      root.classList.remove('is-focused');
      dropdown.classList.remove('is-open');
    }

    // --- Pre-select ---
    if (preselected) {
      const preItem = userSelectData.find(i => i.id === preselected);
      if (preItem) selectUser(preItem);
    }

    // --- Click on wrapper: toggle dropdown ---
    wrapper.addEventListener('mousedown', e => {
      if (e.target.closest('[data-us-clear]')) return;
      e.preventDefault();
      if (isOpen) closeDropdown();
      else openDropdown();
    });

    // --- Search input ---
    searchInput.addEventListener('input', () => {
      renderDropdown(searchInput.value);
    });
    searchInput.addEventListener('mousedown', e => e.stopPropagation());

    // --- Clear button ---
    if (clearBtn) {
      clearBtn.addEventListener('mousedown', e => {
        e.preventDefault();
        e.stopPropagation();
        clearSelection();
      });
    }

    // --- Close on outside click ---
    document.addEventListener('mousedown', e => {
      if (!root.contains(e.target)) {
        closeDropdown();
      }
    });

    // --- Keyboard ---
    searchInput.addEventListener('keydown', e => {
      const items = Array.from(listEl.querySelectorAll('.sb-user-option'));
      let hlIdx = items.findIndex(o => o.classList.contains('is-highlighted'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        hlIdx = Math.min(hlIdx + 1, items.length - 1);
        items.forEach((o, i) => o.classList.toggle('is-highlighted', i === hlIdx));
        if (items[hlIdx]) items[hlIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        hlIdx = Math.max(hlIdx - 1, 0);
        items.forEach((o, i) => o.classList.toggle('is-highlighted', i === hlIdx));
        if (items[hlIdx]) items[hlIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (hlIdx >= 0 && items[hlIdx]) {
          items[hlIdx].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        }
      } else if (e.key === 'Escape') {
        closeDropdown();
      }
    });
  });
}

/* ============================================
   TEXTFIELD ENGINE
   ============================================ */
function initTextFields() {
  document.querySelectorAll('[data-textfield]').forEach(root => {
    if (root.dataset.tfInit === '1') return;
    root.dataset.tfInit = '1';

    const input = root.querySelector('[data-tf-input]');
    if (!input) return;

    if (root.querySelector('.sb-textfield-icon.leading')) root.classList.add('with-leading');
    if (root.querySelector('.sb-textfield-icon.trailing')) root.classList.add('with-trailing');

    const counter = root.querySelector('[data-tf-counter]');
    const maxLen = parseInt(root.dataset.maxlength || input.maxLength, 10);

    // character counter (textarea)
    if (counter && maxLen) {
      const updateCounter = () => {
        const len = input.value.length;
        counter.textContent = `${len} / ${maxLen}`;
        counter.classList.toggle('is-over', len > maxLen);
      };
      input.addEventListener('input', updateCounter);
      updateCounter();
    }

    // generic filled state
    const updateFilled = () => {
      root.classList.toggle('is-filled', input.value.length > 0);
    };
    input.addEventListener('input', updateFilled);
    input.addEventListener('change', updateFilled);
    updateFilled();

    // number stepper
    const upBtn = root.querySelector('[data-tf-up]');
    const downBtn = root.querySelector('[data-tf-down]');
    if (upBtn || downBtn) {
      const step = parseFloat(input.getAttribute('step') || '1');
      const min = input.min !== '' ? parseFloat(input.min) : -Infinity;
      const max = input.max !== '' ? parseFloat(input.max) : Infinity;
      const getVal = () => parseFloat(input.value) || 0;
      const setVal = v => {
        let nv = Math.min(max, Math.max(min, v));
        input.value = nv;
        updateFilled();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      };
      upBtn?.addEventListener('click', () => setVal(getVal() + step));
      downBtn?.addEventListener('click', () => setVal(getVal() - step));
    }

    // password toggle
    const pwBtn = root.querySelector('[data-tf-toggle-password]');
    if (pwBtn) {
      const eye = pwBtn.querySelector('.icon-eye');
      const eyeOff = pwBtn.querySelector('.icon-eye-off');
      pwBtn.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        eye.style.display = isPass ? 'none' : '';
        eyeOff.style.display = isPass ? '' : 'none';
        pwBtn.title = isPass ? 'Скрыть пароль' : 'Показать пароль';
        input.focus();
      });
    }
  });
}

/* ============================================
   SNACKBAR ENGINE
   ============================================ */
const snackMessages = {
  normal: [
    'Обновление каталога продукции завершено.',
    'Новый прайс-лист доступен для скачивания.',
    'Сессия активна ещё 30 минут.',
    'Данные синхронизированы.',
  ],
  success: [
    'Заявка успешно отправлена!',
    'Документ сохранён.',
    'Настройки обновлены.',
    'Файл загружен.',
  ],
  warning: [
    'Ecolen rPET временно под заказ.',
    'Лимит запросов почти исчерпан (90%).',
    'Срок действия договора истекает через 7 дней.',
    'Низкий уровень складских запасов.',
  ],
  alert: [
    'Ошибка при сохранении. Повторите попытку.',
    'Не удалось загрузить отчёт.',
    'Сервер не отвечает. Код 503.',
    'Недостаточно прав для данной операции.',
  ],
};
const snackIcons = {
  normal: icon('info', 16),
  success: icon('check-circle', 16),
  warning: icon('alert-circle', 16),
  alert: icon('x-circle', 16),
};
let snackId = 100;

function initSnackBars() {
  document.querySelectorAll('[data-snack-item]').forEach(item => {
    if (item.dataset.snInit === '1') return;
    item.dataset.snInit = '1';
    item.querySelector('[data-snack-close]')?.addEventListener('click', () => closeSnack(item));
  });

  document.querySelectorAll('.sb-snack-demo').forEach(demo => {
    if (demo.dataset.snInit === '1') return;
    demo.dataset.snInit = '1';

    const stack = demo.querySelector('.sb-snackbar-stack');

    // Bind close buttons on initial items
    stack.querySelectorAll('[data-snack-close]').forEach(btn => {
      btn.addEventListener('click', () => closeSnack(btn.closest('.sb-snackbar')));
    });

    // Init timers on initial items
    stack.querySelectorAll('[data-snack-timer]').forEach(el => startTimer(el));

    // Init progress lines on initial items
    stack.querySelectorAll('.sb-snackbar-progress-fill').forEach(fill => {
      if (fill.style.width === '100%') startProgressLine(fill);
    });

    // Add buttons
    demo.querySelectorAll('[data-snack-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const status = btn.dataset.snackAdd;
        const msgs = snackMessages[status] || snackMessages.normal;
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        const hasActions = Math.random() > 0.4;
        const hasTimer = Math.random() > 0.5;
        const hasLine = !hasTimer && Math.random() > 0.5;
        const forms = ['form-default', 'form-round', 'form-brick'];
        const form = forms[Math.floor(Math.random() * forms.length)];
        addSnack(stack, {
          id: snackId++,
          status,
          message: msg,
          icon: snackIcons[status],
          form,
          actions: hasActions ? [{ label: 'Подробнее', primary: false }] : [],
          autoClose: hasTimer ? 5 : (hasLine ? 4 : 0),
          showProgress: hasTimer ? 'timer' : (hasLine ? 'line' : null),
        });
      });
    });

    // Clear button
    const clearBtn = demo.querySelector('[data-snack-clear]');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        stack.querySelectorAll('.sb-snackbar').forEach(s => closeSnack(s));
      });
    }
  });
}

function addSnack(stack, opts) {
  const snack = document.createElement('div');
  snack.className = `sb-snackbar status-${opts.status} ${opts.form}`;
  snack.dataset.snackItem = '';

  let actionsHtml = '';
  if (opts.actions && opts.actions.length) {
    actionsHtml = '<div class="sb-snackbar-actions">' +
      opts.actions.map(a => `<button class="sb-snackbar-action ${a.primary ? 'sb-action-primary' : ''}">${a.label}</button>`).join('') +
      '</div>';
  }

  let timerHtml = '';
  if (opts.showProgress === 'timer' && opts.autoClose) {
    timerHtml = `
      <div class="sb-snackbar-timer" data-snack-timer="${opts.autoClose}">
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle class="sb-timer-track" cx="14" cy="14" r="12"/>
          <circle class="sb-timer-fill" cx="14" cy="14" r="12" stroke-dasharray="75.4" stroke-dashoffset="0"/>
        </svg>
        <span class="sb-snackbar-timer-text">${opts.autoClose}</span>
      </div>`;
  }

  let lineHtml = '';
  if (opts.showProgress === 'line' && opts.autoClose) {
    lineHtml = `<div class="sb-snackbar-progress"><div class="sb-snackbar-progress-fill" style="width:100%"></div></div>`;
  }

  snack.innerHTML = `
    <div class="sb-snackbar-stripe"></div>
    <div class="sb-snackbar-body">
      <div class="sb-snackbar-icon">${opts.icon || snackIcons.normal}</div>
      <div class="sb-snackbar-content">
        <div class="sb-snackbar-message">${opts.message}</div>
        ${actionsHtml}
      </div>
      ${timerHtml}
    </div>
    <button class="sb-snackbar-close" data-snack-close aria-label="Закрыть">${icon('close', 14)}</button>
    ${lineHtml}
  `;

  snack.querySelector('[data-snack-close]').addEventListener('click', () => closeSnack(snack));

  stack.appendChild(snack);

  // start auto-close
  if (opts.showProgress === 'timer' && opts.autoClose) {
    const timerEl = snack.querySelector('[data-snack-timer]');
    if (timerEl) startTimer(timerEl);
  }
  if (opts.showProgress === 'line' && opts.autoClose) {
    const fill = snack.querySelector('.sb-snackbar-progress-fill');
    if (fill) startProgressLine(fill, opts.autoClose);
  }
}

function startTimer(el) {
  const duration = parseInt(el.dataset.snackTimer, 10) || 5;
  const circle = el.querySelector('.sb-timer-fill');
  const textEl = el.querySelector('.sb-snackbar-timer-text');
  const circumference = 75.4; // 2 * PI * 12
  let start = Date.now();
  const total = duration * 1000;

  function tick() {
    const elapsed = Date.now() - start;
    const pct = Math.min(1, elapsed / total);
    circle.style.strokeDashoffset = (circumference * pct) + '';
    const remaining = Math.ceil(duration - (elapsed / 1000));
    if (textEl) textEl.textContent = Math.max(0, remaining);
    if (pct < 1) {
      requestAnimationFrame(tick);
    } else {
      const snack = el.closest('.sb-snackbar');
      if (snack) closeSnack(snack);
    }
  }
  requestAnimationFrame(tick);
}

function startProgressLine(fill, duration) {
  duration = duration || 5;
  const total = duration * 1000;
  const start = Date.now();

  function tick() {
    const elapsed = Date.now() - start;
    const pct = Math.max(0, 1 - elapsed / total);
    fill.style.width = (pct * 100) + '%';
    if (pct > 0) {
      requestAnimationFrame(tick);
    } else {
      const snack = fill.closest('.sb-snackbar');
      if (snack) closeSnack(snack);
    }
  }
  requestAnimationFrame(tick);
}

function closeSnack(snack) {
  if (!snack || snack.classList.contains('is-closing')) return;
  snack.classList.add('is-closing');
  snack.addEventListener('animationend', () => snack.remove(), { once: true });
  setTimeout(() => { if (snack.parentNode) snack.remove(); }, 400);
}

/* ============================================
   CHOICE GROUP ENGINE
   ============================================ */
function initChoiceGroups() {
  document.querySelectorAll('[data-choice-group]').forEach(group => {
    if (group.dataset.cgInit === '1') return;
    group.dataset.cgInit = '1';

    const isMulti = group.dataset.multi !== undefined;
    const items = Array.from(group.querySelectorAll('.sb-choice-item'));
    const card = group.closest('.sb-cg-demo-card');
    const valueEl = card?.querySelector('.cg-value strong');

    items.forEach(item => {
      item.addEventListener('click', (e) => {
        if (item.classList.contains('is-disabled')) {
          e.preventDefault();
          return;
        }

        if (isMulti) {
          // toggle current
          item.classList.toggle('is-selected');
          const input = item.querySelector('input');
          if (input) input.checked = item.classList.contains('is-selected');
        } else {
          // deselect all, select current
          items.forEach(i => {
            i.classList.remove('is-selected');
            const inp = i.querySelector('input');
            if (inp) inp.checked = false;
          });
          item.classList.add('is-selected');
          const input = item.querySelector('input');
          if (input) input.checked = true;
        }

        // update displayed value
        if (valueEl) {
          const selected = items
            .filter(i => i.classList.contains('is-selected'))
            .map(i => i.querySelector('span:last-child')?.textContent.trim() || i.textContent.trim())
            .filter(Boolean);
          valueEl.textContent = selected.length > 0 ? selected.join(', ') : '—';
        }
      });
    });
  });
}

/* ============================================
   COMBOBOX ENGINE
   ============================================ */
const cbData = {
  products: [
    { id: 1, label: 'Полипропилен PP-H 1200' },
    { id: 2, label: 'Полипропилен PP 100 GP' },
    { id: 3, label: 'Полиэтилен HDPE PE100' },
    { id: 4, label: 'Полиэтилен LDPE 158' },
    { id: 5, label: 'Ecolen rPET' },
    { id: 6, label: 'Ecolen HDPE' },
    { id: 7, label: 'Полистирол PS' },
    { id: 8, label: 'Полистирол HIPS' },
    { id: 9, label: 'EVA-сополимер' },
    { id: 10, label: 'Термопластичные эластомеры TPE' },
  ],
  grouped: [
    { id: 1, label: 'Полипропилен PP-H 1200', groupId: 1 },
    { id: 2, label: 'Полипропилен PP 100 GP', groupId: 1 },
    { id: 3, label: 'Полиэтилен HDPE PE100', groupId: 2 },
    { id: 4, label: 'Полиэтилен LDPE 158', groupId: 2 },
    { id: 5, label: 'Ecolen rPET', groupId: 3 },
    { id: 6, label: 'Ecolen HDPE', groupId: 3 },
    { id: 7, label: 'Полистирол PS', groupId: 4 },
    { id: 8, label: 'Полистирол HIPS', groupId: 4 },
  ],
  groups: [
    { id: 1, label: 'Полипропилен' },
    { id: 2, label: 'Полиэтилен' },
    { id: 3, label: 'Ecolen' },
    { id: 4, label: 'Полистирол' },
  ]
};

function highlightText(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function createCombobox(root, items, groups, opts = {}) {
  if (root.dataset.cbInit === '1') return;
  root.dataset.cbInit = '1';

  const wrapper = root.querySelector('.sb-combobox-wrapper');
  const inputWrap = root.querySelector('.sb-combobox-input-wrap');
  const input = root.querySelector('.sb-combobox-input');
  const dropdown = root.querySelector('.sb-combobox-dropdown');
  const clearBtn = root.querySelector('.sb-combobox-clear');
  const tagsContainer = root.querySelector('.sb-combobox-tags');
  if (!wrapper || !inputWrap || !input || !dropdown) return;

  const isMulti = opts.multi || !!tagsContainer;
  const allowCreate = opts.onCreate !== undefined;

  let query = '';
  let highlightedIdx = -1;
  let selected = opts.value || (isMulti ? [] : null);

  function getLabel(item) { return item.label; }
  function getKey(item) { return item.id; }
  function getGroupId(item) { return item.groupId; }

  function search(q) {
    const lower = q.toLowerCase();
    return items.filter(i => i.label.toLowerCase().includes(lower));
  }

  function groupItems(filtered) {
    if (!groups) return filtered;
    const map = {};
    groups.forEach(g => { map[g.id] = { label: g.label, items: [] }; });
    filtered.forEach(item => {
      const gid = getGroupId(item);
      if (gid !== undefined && map[gid]) {
        map[gid].items.push(item);
      } else {
        if (!map['_ungrouped']) map['_ungrouped'] = { label: 'Другие', items: [] };
        map['_ungrouped'].items.push(item);
      }
    });
    return Object.values(map).filter(g => g.items.length > 0);
  }

  function flattenVisible(grouped) {
    const flat = [];
    if (!groups) {
      grouped.forEach(item => flat.push({ type: 'item', item }));
      return flat;
    }
    grouped.forEach(g => {
      flat.push({ type: 'group', label: g.label });
      g.items.forEach(i => flat.push({ type: 'item', item: i }));
    });
    return flat;
  }

  function syncQueryFromInput() {
    if (isMulti) {
      query = input.value;
      return;
    }
    if (selected && input.value === getLabel(selected)) {
      query = '';
    } else {
      query = input.value;
    }
  }

  function renderDropdown() {
    const filtered = search(query);
    const grouped = groupItems(filtered);
    const flat = flattenVisible(grouped);

    dropdown.innerHTML = '';
    highlightedIdx = -1;

    if (flat.length === 0) {
      if (query && allowCreate) {
        dropdown.innerHTML = `
          <div class="sb-combobox-create">
            <button class="sb-combobox-create-btn" data-create="${query}">
              + Создать "<strong>${query}</strong>"
            </button>
          </div>`;
        dropdown.querySelector('.sb-combobox-create-btn').addEventListener('click', e => {
          if (opts.onCreate) opts.onCreate(query, { e });
          query = '';
          input.value = '';
          closeDropdown();
        });
      } else {
        dropdown.innerHTML = `<div class="sb-combobox-empty">${icon('search', 16)} Ничего не найдено</div>`;
      }
      return;
    }

    let itemCount = 0;
    flat.forEach((entry, i) => {
      if (entry.type === 'group') {
        const gl = document.createElement('div');
        gl.className = 'sb-combobox-group-label';
        gl.textContent = entry.label;
        dropdown.appendChild(gl);
      } else {
        const opt = document.createElement('div');
        opt.className = 'sb-combobox-option';
        opt.dataset.idx = itemCount;
        opt.dataset.id = getKey(entry.item);

        const isSelected = isMulti
          ? selected.some(s => getKey(s) === getKey(entry.item))
          : selected && getKey(selected) === getKey(entry.item);

        if (isSelected) opt.classList.add('is-selected');
        if (entry.item.disabled) opt.classList.add('is-disabled');

        opt.innerHTML = `
          <div class="sb-combobox-option-check">✓</div>
          <span class="sb-combobox-option-label">${highlightText(getLabel(entry.item), query)}</span>`;

        if (!entry.item.disabled) {
          opt.addEventListener('mouseenter', () => {
            highlightedIdx = itemCount;
            updateHighlight([...dropdown.querySelectorAll('.sb-combobox-option')], itemCount);
          });
          opt.addEventListener('mousedown', (e) => {
            e.preventDefault(); // prevent input blur
            selectItem(entry.item);
          });
        }

        dropdown.appendChild(opt);
        itemCount++;
      }
    });

    if (query && allowCreate) {
      const createDiv = document.createElement('div');
      createDiv.className = 'sb-combobox-create';
      createDiv.innerHTML = `
        <button class="sb-combobox-create-btn">
          + Создать "<strong>${query}</strong>"
        </button>`;
      createDiv.querySelector('.sb-combobox-create-btn').addEventListener('click', e => {
        if (opts.onCreate) opts.onCreate(query, { e });
        query = '';
        input.value = '';
        closeDropdown();
      });
      dropdown.appendChild(createDiv);
    }
  }

  function selectItem(item) {
    if (isMulti) {
      const idx = selected.findIndex(s => getKey(s) === getKey(item));
      if (idx >= 0) {
        selected.splice(idx, 1);
      } else {
        selected.push(item);
      }
      renderTags();
      input.value = '';
      query = '';
      renderDropdown();
      input.focus();
    } else {
      selected = item;
      input.value = getLabel(item);
      query = '';
      closeDropdown();
      root.classList.add('has-value');
    }
  }

  function renderTags() {
    if (!tagsContainer) return;
    tagsContainer.innerHTML = '';
    selected.forEach(item => {
      const tag = document.createElement('span');
      tag.className = 'sb-combobox-tag';
      tag.innerHTML = `
        ${getLabel(item)}
        <button class="sb-combobox-tag-remove" data-id="${getKey(item)}">×</button>`;
      tag.querySelector('.sb-combobox-tag-remove').addEventListener('click', e => {
        e.stopPropagation();
        selected = selected.filter(s => getKey(s) !== getKey(item));
        renderTags();
        root.classList.toggle('has-value', selected.length > 0 || input.value.length > 0);
      });
      tagsContainer.appendChild(tag);
    });
    root.classList.toggle('has-value', selected.length > 0 || input.value.length > 0);
  }

  function closeDropdown() {
    root.classList.remove('is-focused');
    dropdown.classList.remove('is-open');
    highlightedIdx = -1;
  }

  function openDropdown() {
    if (root.classList.contains('is-disabled')) return;
    syncQueryFromInput();
    root.classList.add('is-focused');
    dropdown.classList.add('is-open');
    renderDropdown();
  }

  function getItemsFlat() {
    return Array.from(dropdown.querySelectorAll('.sb-combobox-option'));
  }

  function onDocMousedown(e) {
    if (!root.contains(e.target)) closeDropdown();
  }

  // --- Events ---
  input.addEventListener('focus', () => {
    if (!isMulti && selected) input.select();
    openDropdown();
  });

  input.addEventListener('click', (e) => {
    e.stopPropagation();
    openDropdown();
  });

  // клик по обёртке (между тегами, по стрелке, по пустому месту)
  inputWrap.addEventListener('mousedown', (e) => {
    if (root.classList.contains('is-disabled')) return;
    if (e.target.closest('.sb-combobox-tag-remove') || e.target.closest('.sb-combobox-clear')) return;
    e.preventDefault();
    openDropdown();
    input.focus();
  });

  dropdown.addEventListener('mousedown', (e) => {
    e.preventDefault();
  });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      if (!root.contains(document.activeElement)) {
        closeDropdown();
        if (!isMulti) {
          if (selected) {
            input.value = getLabel(selected);
            query = '';
          } else {
            input.value = '';
            query = '';
            root.classList.remove('has-value');
          }
        }
      }
    }, 150);
  });

  input.addEventListener('input', e => {
    query = e.target.value;
    if (!isMulti) selected = null;
    root.classList.toggle('has-value', query.length > 0 || (isMulti ? selected.length > 0 : false));
    openDropdown();
    renderDropdown();
  });

  input.addEventListener('keydown', e => {
    if (!dropdown.classList.contains('is-open')) openDropdown();
    const allItems = getItemsFlat();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!allItems.length) return;
      highlightedIdx = Math.min(highlightedIdx + 1, allItems.length - 1);
      updateHighlight(allItems, highlightedIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!allItems.length) return;
      highlightedIdx = Math.max(highlightedIdx - 1, 0);
      updateHighlight(allItems, highlightedIdx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIdx >= 0 && allItems[highlightedIdx]) {
        allItems[highlightedIdx].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      } else if (query && allowCreate) {
        if (opts.onCreate) opts.onCreate(query, { e });
        query = '';
        input.value = '';
        closeDropdown();
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
      if (!isMulti && selected) {
        input.value = getLabel(selected);
        query = '';
      }
      input.blur();
    }
  });

  document.addEventListener('mousedown', onDocMousedown);

  function updateHighlight(items, idx) {
    items.forEach((it, i) => it.classList.toggle('is-highlighted', i === idx));
    if (items[idx]) {
      items[idx].scrollIntoView({ block: 'nearest' });
    }
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', e => {
      e.stopPropagation();
      input.value = '';
      query = '';
      selected = isMulti ? [] : null;
      root.classList.remove('has-value');
      if (tagsContainer) renderTags();
      input.focus();
    });
  }

  renderTags();
}

function initComboboxes(scope) {
  const root = scope || document;
  const configs = [
    { id: 'cb-demo-1', items: cbData.products, groups: null, opts: {} },
    { id: 'cb-demo-2', items: cbData.products, groups: null, opts: { multi: true } },
    { id: 'cb-demo-3', items: cbData.grouped, groups: cbData.groups, opts: {} },
    { id: 'cb-demo-4', items: cbData.products.slice(0, 3), groups: null, opts: {
      onCreate: (label) => {
        alert(`Создано новое значение: "${label}"`);
      }
    }},
  ];

  configs.forEach(cfg => {
    const el = root.querySelector ? root.querySelector(`#${cfg.id}`) : null;
    const target = el || document.getElementById(cfg.id);
    if (target) createCombobox(target, cfg.items, cfg.groups, cfg.opts);
  });
}

/* ============================================
   AUTOCOMPLETE ENGINE
   ============================================ */
const acData = {
  simple: [
    { id: 1, label: 'Полипропилен PP-H 1200' },
    { id: 2, label: 'Полипропилен PP 100 GP' },
    { id: 3, label: 'Полиэтилен HDPE PE100' },
    { id: 4, label: 'Полиэтилен LDPE 158' },
    { id: 5, label: 'Ecolen rPET' },
    { id: 6, label: 'Ecolen HDPE' },
    { id: 7, label: 'Полистирол PS' },
    { id: 8, label: 'Полистирол HIPS' },
    { id: 9, label: 'EVA-сополимер' },
    { id: 10, label: 'Термопластичные эластомеры TPE' },
    { id: 11, label: 'Сополимер ПП' },
    { id: 12, label: 'Металлоценовый ПП' },
  ],
  grouped: [
    { id: 1, label: 'Полипропилен PP-H 1200', groupId: 1 },
    { id: 2, label: 'Полипропилен PP 100 GP', groupId: 1 },
    { id: 11, label: 'Сополимер ПП', groupId: 1 },
    { id: 12, label: 'Металлоценовый ПП', groupId: 1 },
    { id: 3, label: 'Полиэтилен HDPE PE100', groupId: 2 },
    { id: 4, label: 'Полиэтилен LDPE 158', groupId: 2 },
    { id: 5, label: 'Ecolen rPET', groupId: 3 },
    { id: 6, label: 'Ecolen HDPE', groupId: 3 },
    { id: 9, label: 'EVA-сополимер', groupId: 4 },
    { id: 10, label: 'Термопластичные эластомеры', groupId: 4 },
  ],
  groups: [
    { id: 1, label: 'Полипропилен' },
    { id: 2, label: 'Полиэтилен' },
    { id: 3, label: 'Ecolen' },
    { id: 4, label: 'Специальные полимеры' },
  ]
};

function highlightMatch(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function createAutoComplete(el, items, groups, opts = {}) {
  if (el.dataset.acInit === '1') return;
  el.dataset.acInit = '1';

  const inputWrap = el.querySelector('.sb-ac-input-wrap');
  const input = el.querySelector('.sb-ac-input');
  const dropdown = el.querySelector('.sb-ac-dropdown');
  const clearBtn = el.querySelector('.sb-ac-clear');
  const tagsContainer = el.querySelector('.sb-ac-tags');
  if (!inputWrap || !input || !dropdown) return;

  const isMulti = opts.multi || !!tagsContainer;
  let query = '';
  let highlightedIdx = -1;
  let selectedItems = isMulti ? [] : null;

  function getLabel(item) { return item.label; }
  function getKey(item) { return item.id; }

  function filterItems(q) {
    const lower = q.toLowerCase().trim();
    if (!lower) return items;
    return items.filter(i => i.label.toLowerCase().includes(lower));
  }

  function groupItems(filtered) {
    if (!groups) return filtered;
    const map = {};
    groups.forEach(g => { map[g.id] = { label: g.label, items: [] }; });
    filtered.forEach(item => {
      const gid = item.groupId;
      if (gid !== undefined && map[gid]) {
        map[gid].items.push(item);
      } else {
        if (!map['_ungrouped']) map['_ungrouped'] = { label: 'Другие', items: [] };
        map['_ungrouped'].items.push(item);
      }
    });
    return Object.values(map).filter(g => g.items.length > 0);
  }

  function flattenVisible(grouped) {
    const flat = [];
    if (!groups) {
      grouped.forEach(item => flat.push({ type: 'item', item }));
      return flat;
    }
    grouped.forEach(g => {
      flat.push({ type: 'group', label: g.label });
      g.items.forEach(i => flat.push({ type: 'item', item: i }));
    });
    return flat;
  }

  function syncQueryFromInput() {
    query = input.value;
  }

  function renderDropdown() {
    const filtered = filterItems(query);
    const grouped = groupItems(filtered);
    const flat = flattenVisible(grouped);
    dropdown.innerHTML = '';
    highlightedIdx = -1;

    if (flat.length === 0) {
      dropdown.innerHTML = `
        <div class="sb-ac-empty">
          <div class="sb-ac-empty-icon">${icon('search', 24)}</div>
          Ничего не найдено${query ? ` «${query}»` : ''}
        </div>`;
      return;
    }

    let itemCount = 0;
    flat.forEach(entry => {
      if (entry.type === 'group') {
        const gl = document.createElement('div');
        gl.className = 'sb-ac-group-label';
        gl.textContent = entry.label;
        dropdown.appendChild(gl);
      } else {
        const di = document.createElement('div');
        di.className = 'sb-ac-item';
        di.dataset.idx = itemCount;
        di.dataset.id = getKey(entry.item);

        const isSel = isMulti
          ? selectedItems.some(s => getKey(s) === getKey(entry.item))
          : selectedItems && getKey(selectedItems) === getKey(entry.item);
        if (isSel) di.classList.add('is-selected');

        di.innerHTML = `
          <div class="sb-ac-item-check">✓</div>
          <span class="sb-ac-item-label">${highlightMatch(getLabel(entry.item), query)}</span>`;

        di.addEventListener('mouseenter', () => {
          highlightedIdx = itemCount;
          updateHighlight(getItemsFlat());
        });
        di.addEventListener('mousedown', e => {
          e.preventDefault();
          selectItem(entry.item);
        });

        dropdown.appendChild(di);
        itemCount++;
      }
    });
  }

  function selectItem(item) {
    if (isMulti) {
      const exists = selectedItems.findIndex(s => getKey(s) === getKey(item));
      if (exists >= 0) {
        selectedItems.splice(exists, 1);
      } else {
        selectedItems.push(item);
      }
      renderTags();
      input.value = '';
      query = '';
      renderDropdown();
      input.focus();
    } else {
      selectedItems = item;
      input.value = getLabel(item);
      query = '';
      closeDropdown();
      el.classList.add('has-value');
    }
  }

  function renderTags() {
    if (!tagsContainer) return;
    tagsContainer.innerHTML = '';
    selectedItems.forEach(item => {
      const tag = document.createElement('span');
      tag.className = 'sb-ac-tag';
      tag.innerHTML = `
        ${getLabel(item)}
        <button type="button" class="sb-ac-tag-remove" data-id="${getKey(item)}">×</button>`;
      tag.querySelector('.sb-ac-tag-remove').addEventListener('mousedown', e => {
        e.preventDefault();
        e.stopPropagation();
        selectedItems = selectedItems.filter(s => getKey(s) !== getKey(item));
        renderTags();
        el.classList.toggle('has-value', selectedItems.length > 0 || input.value.length > 0);
      });
      tagsContainer.appendChild(tag);
    });
    el.classList.toggle('has-value', selectedItems.length > 0 || input.value.length > 0);
  }

  function closeDropdown() {
    el.classList.remove('is-focused');
    dropdown.classList.remove('is-open');
    highlightedIdx = -1;
  }

  function openDropdown() {
    if (el.classList.contains('is-disabled')) return;
    syncQueryFromInput();
    el.classList.add('is-focused');
    dropdown.classList.add('is-open');
    renderDropdown();
  }

  function getItemsFlat() {
    return Array.from(dropdown.querySelectorAll('.sb-ac-item'));
  }

  function updateHighlight(items) {
    items.forEach((it, i) => it.classList.toggle('is-highlighted', i === highlightedIdx));
    if (items[highlightedIdx]) {
      items[highlightedIdx].scrollIntoView({ block: 'nearest' });
    }
  }

  function onDocMousedown(e) {
    if (!el.contains(e.target)) closeDropdown();
  }

  input.addEventListener('focus', () => {
    if (!isMulti && selectedItems) input.select();
    openDropdown();
  });

  input.addEventListener('click', e => {
    e.stopPropagation();
    openDropdown();
  });

  inputWrap.addEventListener('mousedown', e => {
    if (el.classList.contains('is-disabled')) return;
    if (e.target.closest('.sb-ac-tag-remove') || e.target.closest('.sb-ac-clear')) return;
    e.preventDefault();
    openDropdown();
    input.focus();
  });

  dropdown.addEventListener('mousedown', e => {
    e.preventDefault();
  });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      if (!el.contains(document.activeElement)) {
        closeDropdown();
        if (!isMulti) {
          if (selectedItems) {
            input.value = getLabel(selectedItems);
            query = '';
          } else {
            input.value = '';
            query = '';
            el.classList.remove('has-value');
          }
        }
      }
    }, 150);
  });

  input.addEventListener('input', e => {
    query = e.target.value;
    if (!isMulti) selectedItems = null;
    el.classList.toggle('has-value', query.length > 0 || (isMulti ? selectedItems.length > 0 : false));
    openDropdown();
    renderDropdown();
  });

  input.addEventListener('keydown', e => {
    if (!dropdown.classList.contains('is-open')) openDropdown();
    const flatItems = getItemsFlat();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!flatItems.length) return;
      highlightedIdx = Math.min(highlightedIdx + 1, flatItems.length - 1);
      updateHighlight(flatItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!flatItems.length) return;
      highlightedIdx = Math.max(highlightedIdx - 1, 0);
      updateHighlight(flatItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIdx >= 0 && flatItems[highlightedIdx]) {
        flatItems[highlightedIdx].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
      if (!isMulti && selectedItems) {
        input.value = getLabel(selectedItems);
        query = '';
      }
      input.blur();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
      input.value = '';
      query = '';
      selectedItems = isMulti ? [] : null;
      el.classList.remove('has-value');
      if (tagsContainer) renderTags();
      input.focus();
      openDropdown();
    });
  }

  document.addEventListener('mousedown', onDocMousedown);
  renderTags();
}

function initAutoCompletes(scope) {
  const root = scope || document;
  const configs = [
    { id: 'ac-demo-1', items: acData.simple, groups: null },
    { id: 'ac-demo-2', items: acData.grouped, groups: acData.groups },
    { id: 'ac-demo-3', items: acData.grouped, groups: acData.groups, opts: { multi: true } },
  ];

  configs.forEach(cfg => {
    const target = (root.querySelector && root.querySelector(`#${cfg.id}`)) || document.getElementById(cfg.id);
    if (target) createAutoComplete(target, cfg.items, cfg.groups, cfg.opts || {});
  });
}

/* ============================================
   SLIDER ENGINE
   ============================================ */
function initSliders() {
  document.querySelectorAll('[data-slider]').forEach(root => {
    if (root.dataset.sliderInit === '1') return; // защита от двойной инициализации
    root.dataset.sliderInit = '1';

    const track = root.querySelector('.sb-slider-track');
    const fill = root.querySelector('.sb-slider-fill');
    const thumb = root.querySelector('.sb-slider-thumb');
    const divisionsEl = root.querySelector('.sb-slider-divisions');
    const labelVal = root.querySelector('.sl-val');
    const currentEl = root.querySelector('.sl-current');

    // --- Parse props with validation ---
    let min = parseFloat(root.dataset.min);
    let max = parseFloat(root.dataset.max);
    if (!isFinite(min)) min = 0;
    if (!isFinite(max)) max = 100;
    // If min > max → fallback to defaults (as in spec)
    if (min > max) { min = 0; max = 100; }

    const stepAttr = root.dataset.step;
    let step = stepAttr !== undefined ? parseFloat(stepAttr) : 1;
    if (!isFinite(step) || step <= 0) step = 1;

    let stepsArr = null;
    try {
      stepsArr = root.dataset.steps ? JSON.parse(root.dataset.steps) : null;
    } catch (_) { stepsArr = null; }

    let value = parseFloat(root.dataset.value);
    if (!isFinite(value)) value = min;

    // Snap positions
    const positions = (() => {
      if (Array.isArray(stepsArr) && stepsArr.length > 0) {
        return stepsArr.slice().sort((a, b) => a - b);
      }
      const pts = [];
      for (let v = min; v <= max + 1e-6; v += step) {
        pts.push(Math.round(v * 1000) / 1000);
      }
      if (pts[pts.length - 1] < max) pts.push(max);
      return pts;
    })();

    function snap(v) {
      if (!positions.length) return v;
      let closest = positions[0];
      let best = Math.abs(v - closest);
      for (const p of positions) {
        const d = Math.abs(v - p);
        if (d < best) { best = d; closest = p; }
      }
      return closest;
    }

    // initial snap
    value = snap(Math.min(max, Math.max(min, value)));

    function renderDivisions() {
      if (!divisionsEl) return;
      divisionsEl.innerHTML = '';
      divisionsEl.style.position = 'absolute';
      divisionsEl.style.inset = '0';
      positions.forEach(p => {
        const d = document.createElement('div');
        d.className = 'sb-slider-div';
        d.style.position = 'absolute';
        d.style.top = '50%';
        const pct = ((p - min) / (max - min)) * 100;
        d.style.left = `${pct}%`;
        d.style.transform = 'translate(-50%, -50%)';
        if (p <= value + 1e-6) d.classList.add('is-passed');
        divisionsEl.appendChild(d);
      });
    }

    function update() {
      const pct = ((value - min) / (max - min)) * 100;
      fill.style.width = `${pct}%`;
      thumb.style.left = `${pct}%`;
      const rounded = Number.isInteger(step) && (!stepsArr || stepsArr.every(Number.isInteger))
        ? Math.round(value)
        : Math.round(value * 100) / 100;
      if (labelVal) labelVal.textContent = rounded;
      if (currentEl) currentEl.textContent = rounded;
      track.setAttribute('aria-valuenow', rounded);
      track.setAttribute('aria-valuemin', min);
      track.setAttribute('aria-valuemax', max);
      renderDivisions();
    }

    function setFromClientX(clientX) {
      const rect = track.getBoundingClientRect();
      if (rect.width === 0) return;
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const raw = min + pct * (max - min);
      const next = snap(raw);
      if (next !== value) {
        value = next;
        update();
      }
    }

    // --- Pointer / touch drag ---
    let dragging = false;

    function onDown(e) {
      if (root.classList.contains('is-disabled')) return;
      e.preventDefault();
      dragging = true;
      track.classList.add('is-dragging');
      track.focus();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setFromClientX(clientX);
    }
    function onMove(e) {
      if (!dragging) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setFromClientX(clientX);
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
    }

    track.addEventListener('mousedown', onDown);
    track.addEventListener('touchstart', onDown, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);
    document.addEventListener('touchcancel', onUp);

    // Keyboard
    track.addEventListener('keydown', e => {
      let handled = true;
      if (Array.isArray(stepsArr) && stepsArr.length > 0) {
        // For step-array: jump to neighbor positions
        const idx = positions.indexOf(value);
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          if (idx < positions.length - 1) value = positions[idx + 1];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          if (idx > 0) value = positions[idx - 1];
        } else if (e.key === 'Home') value = positions[0];
        else if (e.key === 'End') value = positions[positions.length - 1];
        else handled = false;
      } else {
        let delta = 0;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
        else if (e.key === 'PageUp') delta = (max - min) * 0.1;
        else if (e.key === 'PageDown') delta = -(max - min) * 0.1;
        else if (e.key === 'Home') { value = min; }
        else if (e.key === 'End') { value = max; }
        else handled = false;
        if (delta !== 0) {
          value = snap(Math.min(max, Math.max(min, value + delta)));
        }
      }
      if (handled) {
        e.preventDefault();
        update();
      }
    });

    update();
  });
}

/* ============================================
   AI PROMPT MODAL
   ============================================ */
function showSiteToast(message) {
  const toast = document.getElementById('siteToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showSiteToast._timer);
  showSiteToast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function prettifyHtml(html) {
  return String(html || '')
    .replace(/></g, '>\n<')
    .replace(/^\s+|\s+$/g, '');
}

function reactName(name) {
  return String(name).replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('') || 'Component';
}

function generateReactExample(comp, demoHtml) {
  const componentName = reactName(comp.name);
  const html = demoHtml || comp.demo;
  return `import React from 'react';

export function ${componentName}Example() {
  return (
    <div className="ds-demo">
      {/* ${comp.name}: ${comp.params || 'props'} */}
      ${prettifyHtml(html)
        .replace(/class=/g, 'className=')
        .split('\n')
        .map(line => '      ' + line)
        .join('\n')}
    </div>
  );
}`;
}

function closeCodeModal() {
  const backdrop = document.getElementById('codeModalBackdrop');
  if (backdrop) backdrop.classList.remove('is-open');
}
window.closeCodeModal = closeCodeModal;

function openCodeModal(comp, options = {}) {
  const backdrop = document.getElementById('codeModalBackdrop');
  const title = document.getElementById('codeModalTitle');
  const code = document.getElementById('codeModalCode');
  if (!backdrop || !code) return;
  const demoHtml = options.demoHtml || comp.demo;
  const displayName = options.label ? `${comp.name} — ${options.label}` : comp.name;
  window.__currentCodeComponent = comp;
  window.__currentCodeDemo = demoHtml;
  window.__currentCodeTab = 'html';
  title.textContent = `Код: ${displayName}`;
  code.textContent = prettifyHtml(demoHtml);
  document.querySelectorAll('.code-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.codeTab === 'html'));
  backdrop.classList.add('is-open');
}
window.openCodeModal = openCodeModal;

function initCodeModal() {
  document.addEventListener('click', e => {
    const tab = e.target.closest('[data-code-tab]');
    if (tab && window.__currentCodeComponent) {
      const code = document.getElementById('codeModalCode');
      window.__currentCodeTab = tab.dataset.codeTab;
      document.querySelectorAll('.code-tab').forEach(btn => btn.classList.toggle('active', btn === tab));
      code.textContent = tab.dataset.codeTab === 'react'
        ? generateReactExample(window.__currentCodeComponent, window.__currentCodeDemo)
        : prettifyHtml(window.__currentCodeDemo || window.__currentCodeComponent.demo);
    }
  });
  document.getElementById('codeModalCopy')?.addEventListener('click', () => {
    const text = document.getElementById('codeModalCode')?.textContent || '';
    fallbackClipboardCopy(text);
    showSiteToast('Код скопирован');
  });
}

function fallbackClipboardCopy(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => fallbackTextareaCopy(text));
  } else {
    fallbackTextareaCopy(text);
  }
}

function fallbackTextareaCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); } catch (_) {}
  ta.remove();
}

function closeAiPrompt() {
  const backdrop = document.getElementById('aiPromptBackdrop');
  if (backdrop) backdrop.classList.remove('is-open');
}
window.closeAiPrompt = closeAiPrompt;

function copyAiPrompt() {
  const copyBtn = document.getElementById('aiPromptCopy');
  const codeEl = document.getElementById('aiPromptCode');
  if (!copyBtn || !codeEl) return;

  const text = codeEl.textContent;
  fallbackClipboardCopy(text);
  if (typeof showSiteToast === 'function') showSiteToast('Промт скопирован ✓');
}
window.copyAiPrompt = copyAiPrompt;

function initAiPromptModal() {
  // Используем делегирование событий на document — работает всегда,
  // даже если порядок init функций меняется.

  // Закрытие по крестику или клику на затемнённый фон
  document.addEventListener('click', e => {
    if (e.target.closest('#aiPromptClose')) {
      e.preventDefault();
      e.stopPropagation();
      closeAiPrompt();
      return;
    }
    // клик именно по самому backdrop (а не по содержимому модалки)
    if (e.target.id === 'aiPromptBackdrop') {
      closeAiPrompt();
    }
  }, true); // capture: true — ловим раньше других обработчиков

  // Escape
  document.addEventListener('keydown', e => {
    const backdrop = document.getElementById('aiPromptBackdrop');
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) {
      closeAiPrompt();
    }
  });

  // Кнопка копирования (тоже делегированием)
  document.addEventListener('click', e => {
    const copyBtn = e.target.closest('#aiPromptCopy');
    if (!copyBtn) return;
    e.preventDefault();
    e.stopPropagation();
    window.copyAiPrompt();
  }, true);
}

function buildAiPromptText(comp, variant) {
  const base = (variant?.aiPrompt || comp.aiPrompt || '').trim();
  if (typeof buildAiPromptWithStyles === 'function') {
    return buildAiPromptWithStyles(base, [comp.name]);
  }
  const css = typeof componentCssSnippets !== 'undefined' ? componentCssSnippets[comp.name] : '';
  if (!css) return base;
  return `${base}\n\nCSS компонента:\n\`\`\`css\n${css.trim()}\n\`\`\``;
}

function openAiPrompt(comp, variant) {
  const backdrop = document.getElementById('aiPromptBackdrop');
  const titleEl = document.getElementById('aiPromptTitle');
  const descEl = document.getElementById('aiPromptDesc');
  const codeEl = document.getElementById('aiPromptCode');
  const prompt = buildAiPromptText(comp, variant);
  const displayName = variant ? `${comp.name} — ${variant.label}` : comp.name;

  titleEl.textContent = `Промт: ${displayName}`;
  descEl.textContent = variant
    ? `Используйте этот промт, чтобы воссоздать вариант «${variant.label}» компонента «${comp.name}» с помощью ИИ-агента.`
    : `Используйте этот промт, чтобы воссоздать компонент «${comp.name}» с помощью ИИ-агента при разработке интерфейса.`;
  codeEl.textContent = prompt;
  backdrop.classList.add('is-open');
}
window.openAiPrompt = openAiPrompt;

function initCommandPalette() {
  const palette = document.getElementById('commandPalette');
  const input = document.getElementById('commandInput');
  const results = document.getElementById('commandResults');
  if (!palette || !input || !results) return;

  function close() { palette.classList.remove('is-open'); }
  function open() { palette.classList.add('is-open'); input.value = ''; render(''); setTimeout(() => input.focus(), 20); }

  function render(q) {
    const query = q.toLowerCase().trim();
    const favs = getFavorites();
    const pagesList = [
      { name: 'Обзор', id: 'home', iconId: 'home', type: 'page' },
      { name: 'Избранное', id: 'favorites', iconId: 'heart', type: 'page' },
      { name: 'Шаблоны', id: 'templates', iconId: 'grid', type: 'page' },
      ...(typeof templateDefinitions !== 'undefined' ? templateDefinitions.map(t => ({
        name: `Шаблон: ${t.label}`, id: t.id, iconId: t.iconId, type: 'page'
      })) : []),
      { name: 'Tokens Playground', id: 'tokens-playground', iconId: 'contrast', type: 'page' },
      { name: 'AI Builder', id: 'ai-builder', iconId: 'settings', type: 'page' },
      { name: 'All Components', id: 'all-components', iconId: 'file-text', type: 'page' },
    ];

    const favItems = favs.map(key => resolveFavorite(key)).filter(Boolean);

    const matches = uniqueComponentsList.filter(comp => {
      const cat = categoryOrder.find(c => [c.key, ...(c.extraKeys || [])].includes(comp.category));
      return `${comp.name} ${cat?.label || ''} ${comp.params || ''} ${comp.states || ''}`.toLowerCase().includes(query);
    }).slice(0, 20);

    const pageMatches = pagesList.filter(p => p.name.toLowerCase().includes(query));
    const favMatches = favItems.filter(({ comp, variant }) => {
      const label = variant ? `${comp.name} ${variant.label}` : comp.name;
      return label.toLowerCase().includes(query);
    });

    let html = '';
    if (pageMatches.length) {
      html += `<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-secondary);padding:8px 14px 4px">Страницы</div>`;
      html += pageMatches.map(p => `<button class="command-item" data-cmd-page="${p.id}"><span><strong>${p.iconId ? icon(p.iconId, 16) : ''} ${p.name}</strong></span><span>Страница</span></button>`).join('');
    }
    if (favMatches.length) {
      html += `<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-secondary);padding:8px 14px 4px">Избранное</div>`;
      html += favMatches.map(({ comp, variant }) => {
        const cat = categoryOrder.find(ct => [ct.key, ...(ct.extraKeys || [])].includes(comp.category));
        const label = variant ? `${comp.name} — ${variant.label}` : comp.name;
        return `<button class="command-item" data-command-comp="${comp.name}"${variant ? ` data-command-variant="${variant.id}"` : ''}><span><strong>${icon('heart', 16)} ${label}</strong><br><span>${cat?.label || comp.category}</span></span><span>v${comp.version || '0.1'}</span></button>`;
      }).join('');
    }
    if (matches.length) {
      html += `<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-secondary);padding:8px 14px 4px">Компоненты</div>`;
      html += matches.map(comp => {
        const cat = categoryOrder.find(c => [c.key, ...(c.extraKeys || [])].includes(comp.category));
        return `<button class="command-item" data-command-comp="${comp.name}"><span><strong>${comp.name}</strong><br><span>${cat?.label || comp.category} · ${KIT_VERSION}</span></span><span>${getComponentStatus(comp)}</span></button>`;
      }).join('');
    }
    if (!html) html = '<div class="sidebar-search-empty">Ничего не найдено</div>';
    results.innerHTML = html;
  }

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape' && palette.classList.contains('is-open')) close();
  });
  palette.addEventListener('click', e => { if (e.target === palette) close(); });
  input.addEventListener('input', () => render(input.value));
  results.addEventListener('click', e => {
    const btn = e.target.closest('[data-command-comp]');
    if (!btn) {
      const pageBtn = e.target.closest('[data-cmd-page]');
      if (pageBtn) { close(); navigateTo(pageBtn.dataset.cmdPage); showSiteToast(`Переход: ${pageBtn.querySelector('strong')?.textContent || ''}`); }
      return;
    }
    const comp = uniqueComponentsList.find(c => c.name === btn.dataset.commandComp);
    if (!comp) return;
    close();
    navigateTo(componentPageIdFor(comp));
    const variantId = btn.dataset.commandVariant;
    setTimeout(() => {
      const target = variantId
        ? document.querySelector(`#${componentDomId(comp)} [data-variant-id="${variantId}"]`)
        : document.getElementById(componentDomId(comp));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('is-search-hit');
        setTimeout(() => target.classList.remove('is-search-hit'), 1800);
      }
    }, 150);
  });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 700));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initDownloads() {
  document.getElementById('download-kit')?.addEventListener('click', () => {
    const data = {
      version: KIT_VERSION,
      exportedAt: new Date().toISOString(),
      tokens: tokenGroups,
      components: uniqueComponentsList.map(c => ({
        name: c.name,
        category: c.category,
        status: getComponentStatus(c),
        params: c.params,
        states: c.states,
        aiPrompt: c.aiPrompt || null
      }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sb-ui-kit.json';
    a.click();
    URL.revokeObjectURL(a.href);
    showSiteToast('SB design systems JSON скачан');
  });
}

/* ============================================
   SELECT INTERACTIVITY
   ============================================ */
function initSelects() {
  document.querySelectorAll('.sb-select[data-state="default"]').forEach(sel => {
    const valueEl = sel.querySelector('.sb-value');
    const dropdown = sel.querySelector('.sb-dropdown');

    sel.querySelector('.sb-input-block').addEventListener('click', e => {
      e.stopPropagation();
      // close other open selects
      document.querySelectorAll('.sb-select[data-state="default"].is-focused')
        .forEach(s => { if (s !== sel) s.classList.remove('is-focused'); });
      sel.classList.toggle('is-focused');
    });

    if (dropdown) {
      dropdown.querySelectorAll('.sb-option').forEach(opt => {
        opt.addEventListener('click', e => {
          e.stopPropagation();
          const val = opt.dataset.value || opt.textContent.trim();
          valueEl.textContent = val;
          sel.classList.remove('is-focused');
          sel.classList.add('is-filled');
          dropdown.querySelectorAll('.sb-option').forEach(o => o.classList.remove('is-selected'));
          opt.classList.add('is-selected');
        });
      });
    }
  });

  // click outside closes
  document.addEventListener('click', () => {
    document.querySelectorAll('.sb-select[data-state="default"].is-focused')
      .forEach(s => s.classList.remove('is-focused'));
  });
}
