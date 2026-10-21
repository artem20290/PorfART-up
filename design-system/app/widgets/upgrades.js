/* ============================================
   STATIC → LIVE UPGRADES
   ============================================ */
function initUpgrades(scope) {
  const root = scope || document;
  initPasswordInputs(root);
  initPhoneInputs(root);
  initPinInputs(root);
  initCounters(root);
  initBanners(root);
  initEmptyStates(root);
  initErrorStates(root);
  initToolbars(root);
  initFilterPanels(root);
  initLists(root);
  initTimelines(root);
}

function initPasswordInputs(root) {
  root.querySelectorAll('[data-password-input]').forEach(el => {
    if (el.dataset.pwInit === '1') return;
    el.dataset.pwInit = '1';
    const input = el.querySelector('[data-pw-input]');
    const toggle = el.querySelector('[data-pw-toggle]');
    const bar = el.querySelector('[data-pw-bar]');
    const label = el.querySelector('[data-pw-label]');
    if (!input) return;

    function strength(val) {
      if (!val) return { pct: 0, text: '', color: '#e2eaec' };
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      if (score <= 1) return { pct: 33, text: 'Слабый', color: 'var(--danger)' };
      if (score <= 2) return { pct: 66, text: 'Средний', color: 'var(--warning)' };
      return { pct: 100, text: 'Надёжный', color: 'var(--success)' };
    }

    function update() {
      const s = strength(input.value);
      if (bar) { bar.style.width = s.pct + '%'; bar.style.background = s.color; }
      if (label) { label.textContent = s.text; label.style.color = s.color; }
    }

    toggle?.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
      toggle.innerHTML = show ? icon('eye-off', 16) : icon('eye', 16);
    });
    input.addEventListener('input', update);
    update();
  });
}

function initPhoneInputs(root) {
  root.querySelectorAll('[data-phone-input]').forEach(el => {
    if (el.dataset.phoneInit === '1') return;
    el.dataset.phoneInit = '1';
    const codeBtn = el.querySelector('[data-phone-code]');
    const field = el.querySelector('[data-phone-field]');
    const menu = el.querySelector('[data-phone-menu]');
    if (!field) return;

    function formatDigits(d) {
      const p = d.slice(0, 10);
      let out = '';
      if (p.length > 0) out += '(' + p.slice(0, 3);
      if (p.length >= 3) out += ') ';
      if (p.length > 3) out += p.slice(3, 6);
      if (p.length >= 6) out += '-' + p.slice(6, 8);
      if (p.length >= 8) out += '-' + p.slice(8, 10);
      return out;
    }

    field.addEventListener('input', () => {
      const digits = field.value.replace(/\D/g, '');
      field.value = formatDigits(digits);
    });

    codeBtn?.addEventListener('click', e => {
      e.stopPropagation();
      const open = !menu?.classList.contains('is-open');
      menu?.classList.toggle('is-open', open);
      menu.hidden = !open;
      codeBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    menu?.querySelectorAll('[data-country]').forEach(btn => {
      btn.addEventListener('click', () => {
        const flag = btn.textContent.split(' ')[0];
        const code = btn.dataset.country;
        if (codeBtn) codeBtn.textContent = `${flag} ${code}`;
        menu.classList.remove('is-open');
        menu.hidden = true;
        codeBtn.setAttribute('aria-expanded', 'false');
      });
    });
  });
}

function initPinInputs(root) {
  root.querySelectorAll('[data-pin-input]').forEach(el => {
    if (el.dataset.pinInit === '1') return;
    el.dataset.pinInit = '1';
    const cells = [...el.querySelectorAll('.sb-pin-cell')];

    cells.forEach((cell, i) => {
      cell.addEventListener('input', () => {
        cell.value = cell.value.replace(/\D/g, '').slice(-1);
        cell.classList.toggle('is-filled', !!cell.value);
        if (cell.value && cells[i + 1]) cells[i + 1].focus();
      });
      cell.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !cell.value && cells[i - 1]) cells[i - 1].focus();
      });
      cell.addEventListener('paste', e => {
        e.preventDefault();
        const text = (e.clipboardData?.getData('text') || '').replace(/\D/g, '');
        text.split('').forEach((ch, j) => {
          if (cells[i + j]) { cells[i + j].value = ch; cells[i + j].classList.add('is-filled'); }
        });
        const next = cells[Math.min(i + text.length, cells.length - 1)];
        next?.focus();
      });
    });
  });
}

function initCounters(root) {
  root.querySelectorAll('[data-counter]').forEach(el => {
    if (el.dataset.counterInit === '1') return;
    el.dataset.counterInit = '1';
    const min = parseInt(el.dataset.min, 10) || 0;
    const max = parseInt(el.dataset.max, 10) || 99;
    const step = parseInt(el.dataset.step, 10) || 1;
    let val = parseInt(el.dataset.value, 10) || min;
    const display = el.querySelector('[data-counter-val]');
    const dec = el.querySelector('[data-counter-dec]');
    const inc = el.querySelector('[data-counter-inc]');

    function render() {
      val = Math.min(max, Math.max(min, val));
      if (display) display.textContent = val;
      if (dec) dec.disabled = val <= min;
      if (inc) inc.disabled = val >= max;
      el.dataset.value = val;
    }

    dec?.addEventListener('click', () => { val -= step; render(); });
    inc?.addEventListener('click', () => { val += step; render(); });
    render();
  });
}

function initBanners(root) {
  root.querySelectorAll('[data-banner]').forEach(el => {
    if (el.dataset.bannerInit === '1') return;
    el.dataset.bannerInit = '1';
    el.querySelector('[data-banner-close]')?.addEventListener('click', () => { el.style.display = 'none'; });
    el.querySelector('[data-banner-action]')?.addEventListener('click', () => {
      if (typeof showSiteToast === 'function') showSiteToast('Подробности обновления');
    });
  });
}

function initEmptyStates(root) {
  root.querySelectorAll('[data-empty-state]').forEach(el => {
    if (el.dataset.emptyInit === '1') return;
    el.dataset.emptyInit = '1';
    el.querySelector('[data-empty-action]')?.addEventListener('click', () => {
      if (typeof showSiteToast === 'function') showSiteToast('Создание элемента…');
    });
  });
}

function initErrorStates(root) {
  root.querySelectorAll('[data-error-state]').forEach(el => {
    if (el.dataset.errInit === '1') return;
    el.dataset.errInit = '1';
    const text = el.querySelector('[data-error-text]');
    el.querySelector('[data-error-retry]')?.addEventListener('click', () => {
      if (text) text.textContent = 'Повторная загрузка…';
      setTimeout(() => {
        if (text) text.textContent = 'Данные успешно загружены.';
        if (typeof showSiteToast === 'function') showSiteToast('Загрузка завершена ✓');
      }, 800);
    });
  });
}

function initToolbars(root) {
  root.querySelectorAll('[data-toolbar]').forEach(el => {
    if (el.dataset.tbInit === '1') return;
    el.dataset.tbInit = '1';
    const counts = { all: 24, work: 12, done: 8 };
    const countEl = el.querySelector('[data-toolbar-count]');
    el.querySelectorAll('[data-toolbar-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('[data-toolbar-filter]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const key = btn.dataset.toolbarFilter;
        if (countEl) countEl.textContent = `Найдено: ${counts[key] ?? 0}`;
      });
    });
    el.querySelector('[data-toolbar-export]')?.addEventListener('click', () => {
      if (typeof showSiteToast === 'function') showSiteToast('Экспорт запущен');
    });
  });
}

function initFilterPanels(root) {
  root.querySelectorAll('[data-filter-panel]').forEach(el => {
    if (el.dataset.fpInit === '1') return;
    el.dataset.fpInit = '1';
    const body = el.querySelector('[data-fp-body]');
    const toggle = el.querySelector('[data-fp-toggle]');
    el.querySelector('[data-fp-reset]')?.addEventListener('click', () => {
      el.querySelectorAll('[data-fp-check]').forEach(cb => { cb.checked = false; });
      const sel = el.querySelector('[data-fp-select]');
      if (sel) sel.selectedIndex = 0;
    });
    toggle?.addEventListener('click', () => {
      const collapsed = body?.classList.toggle('is-collapsed');
      toggle.innerHTML = collapsed ? icon('chevron-right', 14) : icon('chevron-down', 14);
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  });
}

function initLists(root) {
  root.querySelectorAll('[data-list]').forEach(el => {
    if (el.dataset.listInit === '1') return;
    el.dataset.listInit = '1';
    el.querySelectorAll('[data-list-item]').forEach(item => {
      item.addEventListener('click', () => {
        el.querySelectorAll('[data-list-item]').forEach(i => i.classList.remove('is-selected'));
        item.classList.add('is-selected');
      });
    });
  });
}

function initTimelines(root) {
  root.querySelectorAll('[data-timeline]').forEach(el => {
    if (el.dataset.tlInit === '1') return;
    el.dataset.tlInit = '1';
    el.querySelectorAll('[data-timeline-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const desc = btn.parentElement?.querySelector('.sb-timeline-desc');
        if (desc) desc.hidden = !desc.hidden;
      });
    });
  });
}

if (!window._upgradesPhoneBound) {
  window._upgradesPhoneBound = true;
  document.addEventListener('click', () => {
    document.querySelectorAll('.sb-phone-menu.is-open').forEach(menu => {
      menu.classList.remove('is-open');
      menu.hidden = true;
      menu.closest('[data-phone-input]')?.querySelector('[data-phone-code]')?.setAttribute('aria-expanded', 'false');
    });
  });
}
