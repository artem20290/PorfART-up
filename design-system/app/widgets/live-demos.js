/* ============================================
   LIVE INTERACTIVE DEMOS
   ============================================ */
const MONTHS_RU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const DOW_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function liveQuery(scope, sel) {
  return (scope || document).querySelectorAll(sel);
}

function formatDateRu(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function bindEscape(closeFn) {
  const handler = e => {
    if (e.key === 'Escape') {
      closeFn();
      document.removeEventListener('keydown', handler);
    }
  };
  document.addEventListener('keydown', handler);
  return handler;
}

function renderCalendar(gridEl, viewDate, opts = {}) {
  const { selected, rangeFrom, rangeTo, onPick } = opts;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  gridEl.innerHTML = '';
  DOW_RU.forEach(d => {
    const el = document.createElement('div');
    el.className = 'live-cal-dow';
    el.textContent = d;
    gridEl.appendChild(el);
  });

  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'live-cal-day';

    if (dayNum < 1 || dayNum > daysInMonth) {
      btn.classList.add('is-other');
      btn.disabled = true;
      btn.textContent = dayNum < 1
        ? new Date(year, month, dayNum).getDate()
        : dayNum - daysInMonth;
    } else {
      const date = new Date(year, month, dayNum);
      btn.textContent = dayNum;
      if (selected && sameDay(date, selected)) btn.classList.add('is-selected');
      if (rangeFrom && rangeTo) {
        const t = date.getTime();
        const from = rangeFrom.getTime();
        const to = rangeTo.getTime();
        const lo = Math.min(from, to);
        const hi = Math.max(from, to);
        if (t >= lo && t <= hi) btn.classList.add('is-in-range');
        if (sameDay(date, rangeFrom) || sameDay(date, rangeTo)) {
          btn.classList.add('is-range-end');
        }
      }
      btn.addEventListener('click', () => onPick(date));
    }
    gridEl.appendChild(btn);
  }
}

function portalLiveOverlay(panel) {
  if (!panel || panel.dataset.portaled) return;
  panel._portalAnchor = { parent: panel.parentNode, next: panel.nextSibling };
  panel.classList.add('live-overlay--portaled');
  document.body.appendChild(panel);
  panel.dataset.portaled = '1';
}

function restoreLiveOverlay(panel) {
  if (!panel?.dataset.portaled || !panel._portalAnchor) return;
  const { parent, next } = panel._portalAnchor;
  if (parent) {
    if (next && next.parentNode === parent) parent.insertBefore(panel, next);
    else parent.appendChild(panel);
  }
  panel.classList.remove('live-overlay--portaled');
  delete panel.dataset.portaled;
  delete panel._portalAnchor;
}

function bindLiveOverlayPanel(panel, openFn, closeFn) {
  const open = () => {
    portalLiveOverlay(panel);
    openFn();
  };
  const close = () => {
    closeFn();
    restoreLiveOverlay(panel);
  };
  return { open, close };
}

/* --- Modal / Confirm / Drawer --- */
function initLiveOverlays(scope) {
  liveQuery(scope, '[data-live-modal]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';
    const panel = root.querySelector('[data-live-modal-panel]');
    const openBtn = root.querySelector('[data-live-modal-open]');
    if (!panel || !openBtn) return;

    const { open, close } = bindLiveOverlayPanel(
      panel,
      () => { panel.hidden = false; bindEscape(close); },
      () => { panel.hidden = true; }
    );

    openBtn.addEventListener('click', open);
    panel.addEventListener('click', e => { if (e.target === panel) close(); });
    root.querySelectorAll('[data-live-modal-close]').forEach(b => b.addEventListener('click', close));
    root.querySelector('[data-live-modal-confirm]')?.addEventListener('click', () => {
      close();
      if (typeof showSiteToast === 'function') showSiteToast('Заявка отправлена');
    });
  });

  liveQuery(scope, '[data-live-confirm]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';
    const panel = root.querySelector('[data-live-confirm-panel]');
    const openBtn = root.querySelector('[data-live-confirm-open]');
    if (!panel || !openBtn) return;

    const { open, close } = bindLiveOverlayPanel(
      panel,
      () => { panel.hidden = false; bindEscape(close); },
      () => { panel.hidden = true; }
    );

    openBtn.addEventListener('click', open);
    panel.addEventListener('click', e => { if (e.target === panel) close(); });
    root.querySelectorAll('[data-live-confirm-cancel]').forEach(b => b.addEventListener('click', close));
    root.querySelector('[data-live-confirm-ok]')?.addEventListener('click', () => {
      close();
      if (typeof showSiteToast === 'function') showSiteToast('Элемент удалён');
    });
  });

  liveQuery(scope, '[data-live-drawer]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';
    const panel = root.querySelector('[data-live-drawer-panel]');
    const openBtn = root.querySelector('[data-live-drawer-open]');
    if (!panel || !openBtn) return;

    const { open, close } = bindLiveOverlayPanel(
      panel,
      () => { panel.hidden = false; bindEscape(close); },
      () => { panel.hidden = true; }
    );

    openBtn.addEventListener('click', open);
    panel.addEventListener('click', e => { if (e.target === panel) close(); });
    root.querySelectorAll('[data-live-drawer-close]').forEach(b => b.addEventListener('click', close));
  });
}

function initLivePopovers(scope) {
  liveQuery(scope, '[data-live-popover]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';
    const trigger = root.querySelector('[data-live-popover-trigger]');
    const pop = root.querySelector('.live-popover');
    if (!trigger || !pop) return;

    const close = () => { pop.hidden = true; trigger.setAttribute('aria-expanded', 'false'); };
    const toggle = e => {
      e.stopPropagation();
      const open = pop.hidden;
      document.querySelectorAll('.live-popover').forEach(p => { if (p !== pop) p.hidden = true; });
      pop.hidden = !open;
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    trigger.addEventListener('click', toggle);
    pop.addEventListener('click', e => e.stopPropagation());
    if (!window._livePopoverDocBound) {
      window._livePopoverDocBound = true;
      document.addEventListener('click', () => {
        document.querySelectorAll('.live-popover').forEach(p => { p.hidden = true; });
        document.querySelectorAll('[data-live-popover-trigger]').forEach(t => t.setAttribute('aria-expanded', 'false'));
      });
    }
  });
}

/* --- DatePicker --- */
function initLiveDatePickers(scope) {
  liveQuery(scope, '[data-live-datepicker]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';

    const trigger = root.querySelector('[data-live-dp-trigger]');
    const valueEl = root.querySelector('[data-live-dp-value]');
    const dropdown = root.querySelector('[data-live-dp-dropdown]');
    const grid = root.querySelector('[data-live-dp-grid]');
    const monthLabel = root.querySelector('[data-live-dp-month]');
    if (!trigger || !dropdown || !grid) return;

    let selected = new Date(2026, 2, 14);
    let viewDate = new Date(selected);

    const updateTrigger = () => {
      valueEl.textContent = formatDateRu(selected);
      trigger.classList.remove('is-placeholder');
    };

    const render = () => {
      monthLabel.textContent = `${MONTHS_RU[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
      renderCalendar(grid, viewDate, {
        selected,
        onPick: d => {
          selected = d;
          updateTrigger();
          dropdown.hidden = true;
          trigger.classList.remove('is-open');
        }
      });
    };

    root.querySelector('[data-live-dp-prev]')?.addEventListener('click', e => {
      e.stopPropagation();
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
      render();
    });
    root.querySelector('[data-live-dp-next]')?.addEventListener('click', e => {
      e.stopPropagation();
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
      render();
    });

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = dropdown.hidden;
      document.querySelectorAll('[data-live-dp-dropdown]').forEach(d => { d.hidden = true; });
      dropdown.hidden = !open;
      trigger.classList.toggle('is-open', !dropdown.hidden);
      if (!dropdown.hidden) render();
    });

    dropdown.addEventListener('click', e => e.stopPropagation());
    updateTrigger();
    render();
  });
}

/* --- DateRangePicker --- */
function initLiveDateRangePickers(scope) {
  liveQuery(scope, '[data-live-daterange]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';

    const trigger = root.querySelector('[data-live-dr-trigger]');
    const valueEl = root.querySelector('[data-live-dr-value]');
    const dropdown = root.querySelector('[data-live-dr-dropdown]');
    const grid = root.querySelector('[data-live-dr-grid]');
    const monthLabel = root.querySelector('[data-live-dr-month]');
    if (!trigger || !dropdown || !grid) return;

    let from = new Date(2026, 2, 14);
    let to = new Date(2026, 2, 21);
    let viewDate = new Date(from);
    let pickingEnd = false;

    const updateTrigger = () => {
      valueEl.textContent = `${formatDateRu(from)} → ${formatDateRu(to)}`;
    };

    const render = () => {
      monthLabel.textContent = `${MONTHS_RU[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
      renderCalendar(grid, viewDate, {
        rangeFrom: from,
        rangeTo: to,
        onPick: d => {
          if (!pickingEnd) {
            from = d;
            to = d;
            pickingEnd = true;
          } else {
            to = d;
            if (to < from) [from, to] = [to, from];
            pickingEnd = false;
            updateTrigger();
            dropdown.hidden = true;
            trigger.classList.remove('is-open');
          }
          render();
        }
      });
    };

    root.querySelector('[data-live-dr-prev]')?.addEventListener('click', e => {
      e.stopPropagation();
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
      render();
    });
    root.querySelector('[data-live-dr-next]')?.addEventListener('click', e => {
      e.stopPropagation();
      viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
      render();
    });

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = dropdown.hidden;
      document.querySelectorAll('[data-live-dr-dropdown]').forEach(d => { d.hidden = true; });
      dropdown.hidden = !open;
      trigger.classList.toggle('is-open', !dropdown.hidden);
      if (!dropdown.hidden) render();
    });

    dropdown.addEventListener('click', e => e.stopPropagation());
    updateTrigger();
    render();
  });
}

/* --- TimePicker --- */
function initLiveTimePickers(scope) {
  liveQuery(scope, '[data-live-timepicker]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';

    const trigger = root.querySelector('[data-live-tp-trigger]');
    const valueEl = root.querySelector('[data-live-tp-value]');
    const dropdown = root.querySelector('[data-live-tp-dropdown]');
    const hoursCol = root.querySelector('[data-live-tp-hours]');
    const minsCol = root.querySelector('[data-live-tp-mins]');
    if (!trigger || !dropdown || !hoursCol || !minsCol) return;

    let hour = 14;
    let minute = 30;

    const pad = n => String(n).padStart(2, '0');
    const updateValue = () => { valueEl.textContent = `${pad(hour)}:${pad(minute)}`; };

    const renderCols = () => {
      hoursCol.innerHTML = '';
      minsCol.innerHTML = '';
      for (let h = 0; h < 24; h++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'live-time-opt' + (h === hour ? ' is-selected' : '');
        btn.textContent = pad(h);
        btn.addEventListener('click', e => {
          e.stopPropagation();
          hour = h;
          renderCols();
          updateValue();
        });
        hoursCol.appendChild(btn);
      }
      [0, 15, 30, 45].forEach(m => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'live-time-opt' + (m === minute ? ' is-selected' : '');
        btn.textContent = pad(m);
        btn.addEventListener('click', e => {
          e.stopPropagation();
          minute = m;
          renderCols();
          updateValue();
          dropdown.hidden = true;
          trigger.classList.remove('is-open');
        });
        minsCol.appendChild(btn);
      });
    };

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = dropdown.hidden;
      document.querySelectorAll('[data-live-tp-dropdown]').forEach(d => { d.hidden = true; });
      dropdown.hidden = !open;
      trigger.classList.toggle('is-open', !dropdown.hidden);
      if (!dropdown.hidden) renderCols();
    });

    dropdown.addEventListener('click', e => e.stopPropagation());
    updateValue();
  });
}

/* --- FileUpload --- */
function initLiveFileUploads(scope) {
  liveQuery(scope, '[data-live-fileupload]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';

    const zone = root.querySelector('[data-live-upload-zone]');
    const input = root.querySelector('[data-live-upload-input]');
    const list = root.querySelector('[data-live-upload-list]');
    if (!zone || !input || !list) return;

    const files = [];

    const formatSize = bytes => {
      if (bytes < 1024) return bytes + ' Б';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Кб';
      return (bytes / (1024 * 1024)).toFixed(1) + ' Мб';
    };

    const iconFor = file => {
      if (file.type.startsWith('image/')) return icon('image', 16);
      if (file.type.includes('pdf')) return icon('file-text', 16);
      if (file.type.includes('sheet') || file.name.endsWith('.xlsx')) return icon('bar-chart', 16);
      return icon('paperclip', 16);
    };

    const renderList = () => {
      list.innerHTML = '';
      files.forEach((file, idx) => {
        const item = document.createElement('div');
        item.className = 'live-upload-item';
        const isImg = file.type.startsWith('image/');
        let thumbHtml = `<span>${iconFor(file)}</span>`;
        if (isImg) {
          const url = URL.createObjectURL(file);
          thumbHtml = `<img src="${url}" alt="">`;
        }
        const progress = file._progress != null
          ? `<div class="live-upload-progress"><span style="width:${file._progress}%"></span></div>`
          : '<span style="color:var(--success)">✓</span>';

        item.innerHTML = `
          <div class="live-upload-thumb">${thumbHtml}</div>
          <div class="live-upload-meta">
            <div class="live-upload-name">${file.name}</div>
            <div class="live-upload-size">${formatSize(file.size)}${file._progress != null ? ' · ' + file._progress + '%' : ' · загружено'}</div>
          </div>
          ${progress}
          <button type="button" class="live-upload-remove" aria-label="Удалить">×</button>
        `;
        item.querySelector('.live-upload-remove').addEventListener('click', () => {
          files.splice(idx, 1);
          renderList();
        });
        list.appendChild(item);
      });
    };

    const addFiles = fileList => {
      Array.from(fileList).forEach(file => {
        files.push(file);
        file._progress = 0;
        renderList();
        const interval = setInterval(() => {
          file._progress = Math.min(100, file._progress + 12);
          renderList();
          if (file._progress >= 100) {
            clearInterval(interval);
            setTimeout(() => { file._progress = null; renderList(); }, 300);
          }
        }, 120);
      });
    };

    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', () => { if (input.files.length) addFiles(input.files); input.value = ''; });

    ['dragenter', 'dragover'].forEach(ev => {
      zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('is-dragover'); });
    });
    ['dragleave', 'drop'].forEach(ev => {
      zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('is-dragover'); });
    });
    zone.addEventListener('drop', e => {
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    });
  });
}

/* --- TreeView --- */
function initLiveTreeViews(scope) {
  liveQuery(scope, '[data-live-tree]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';

    root.querySelectorAll('.live-tree-item').forEach(item => {
      const toggle = item.querySelector('.live-tree-toggle');
      const children = item.querySelector(':scope > .live-tree-children');
      const row = item.querySelector(':scope > .live-tree-row');

      if (toggle && children) {
        toggle.addEventListener('click', e => {
          e.stopPropagation();
          const open = children.hidden;
          children.hidden = !open;
          toggle.innerHTML = open ? icon('chevron-down', 14) : icon('chevron-right', 14);
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      }

      if (row) {
        row.addEventListener('click', () => {
          root.querySelectorAll('.live-tree-row.is-selected').forEach(r => r.classList.remove('is-selected'));
          row.classList.add('is-selected');
        });
      }
    });
  });
}

/* --- Transfer List --- */
function initLiveTransferLists(scope) {
  liveQuery(scope, '[data-live-transfer]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';

    const leftPanel = root.querySelector('[data-live-transfer-left]');
    const rightPanel = root.querySelector('[data-live-transfer-right]');
    const toRight = root.querySelector('[data-live-transfer-to-right]');
    const toLeft = root.querySelector('[data-live-transfer-to-left]');
    if (!leftPanel || !rightPanel) return;

    const bindItem = el => {
      el.addEventListener('click', e => {
        if (e.target.closest('.live-transfer-check')) return;
        const cb = el.querySelector('input[type=checkbox]');
        if (cb) { cb.checked = !cb.checked; el.classList.toggle('is-checked', cb.checked); }
      });
      el.querySelector('input')?.addEventListener('change', e => {
        el.classList.toggle('is-checked', e.target.checked);
      });
    };

    leftPanel.querySelectorAll('.live-transfer-item').forEach(bindItem);
    rightPanel.querySelectorAll('.live-transfer-item').forEach(bindItem);

    const move = (from, to) => {
      const checked = Array.from(from.querySelectorAll('.live-transfer-item')).filter(
        el => el.querySelector('input')?.checked
      );
      checked.forEach(el => {
        const cb = el.querySelector('input');
        cb.checked = false;
        el.classList.remove('is-checked');
        to.appendChild(el);
      });
    };

    toRight?.addEventListener('click', () => move(leftPanel, rightPanel));
    toLeft?.addEventListener('click', () => move(rightPanel, leftPanel));
  });
}

/* --- ColorPicker --- */
function initLiveColorPickers(scope) {
  liveQuery(scope, '[data-live-colorpicker]').forEach(root => {
    if (root.dataset.liveInit) return;
    root.dataset.liveInit = '1';

    const swatches = root.querySelectorAll('.live-color-swatch');
    const preview = root.querySelector('[data-live-color-preview]');
    const hexBox = root.querySelector('[data-live-color-hex-box]');
    const hexInput = root.querySelector('[data-live-color-hex-input]');
    if (!swatches.length) return;

    const apply = color => {
      swatches.forEach(s => s.classList.toggle('is-selected', s.dataset.color === color));
      if (preview) preview.style.background = color;
      if (hexBox) hexBox.style.background = color;
      if (hexInput) hexInput.value = color;
    };

    swatches.forEach(btn => {
      btn.addEventListener('click', () => apply(btn.dataset.color));
    });

    hexInput?.addEventListener('change', () => {
      const v = hexInput.value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(v)) apply(v);
    });

    apply(swatches[0].dataset.color || '#008f95');
  });
}

/* --- Global click to close pickers --- */
if (!window._livePickerDocBound) {
  window._livePickerDocBound = true;
  document.addEventListener('click', () => {
    document.querySelectorAll('[data-live-dp-dropdown], [data-live-dr-dropdown], [data-live-tp-dropdown]').forEach(d => { d.hidden = true; });
    document.querySelectorAll('[data-live-dp-trigger], [data-live-dr-trigger], [data-live-tp-trigger]').forEach(t => t.classList.remove('is-open'));
  });
}

function initLiveDemos(scope) {
  initLiveOverlays(scope);
  initLivePopovers(scope);
  initLiveDatePickers(scope);
  initLiveDateRangePickers(scope);
  initLiveTimePickers(scope);
  initLiveFileUploads(scope);
  initLiveTreeViews(scope);
  initLiveTransferLists(scope);
  initLiveColorPickers(scope);
}
