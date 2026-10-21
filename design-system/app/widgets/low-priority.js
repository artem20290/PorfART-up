/* ============================================
   LOW-PRIORITY COMPONENTS + LIVE UPGRADES
   ============================================ */
function initLowPriority(scope) {
  const root = scope || document;
  initSearchInputs(root);
  initRatings(root);
  initAdvTables(root);
  initSbTables(root);
  initSignaturePads(root);
  initDocViewers(root);
  initGeoPickers(root);
  initQrCodes(root);
  initBarcodes(root);
  initWatermarks(root);
  initSplitPanes(root);
}

function initSearchInputs(root) {
  root.querySelectorAll('[data-search-input]').forEach(el => {
    if (el.dataset.siInit === '1') return;
    el.dataset.siInit = '1';
    const input = el.querySelector('.sb-search-input-field');
    const clear = el.querySelector('.sb-search-input-clear');
    const hint = el.parentElement?.querySelector('[data-search-hint]');
    if (!input) return;

    function update() {
      const has = input.value.length > 0;
      if (clear) clear.hidden = !has;
      if (hint) {
        hint.textContent = has
          ? `Поиск: «${input.value}» — найдено 2 позиции`
          : 'Введите запрос для поиска';
      }
    }

    input.addEventListener('input', update);
    clear?.addEventListener('click', () => { input.value = ''; input.focus(); update(); });
    update();
  });
}

function initRatings(root) {
  root.querySelectorAll('[data-rating]').forEach(el => {
    if (el.dataset.ratingInit === '1') return;
    el.dataset.ratingInit = '1';
    const stars = [...el.querySelectorAll('.sb-rating-star')];
    const label = el.querySelector('[data-rating-label]');
    let value = parseInt(el.dataset.value, 10) || 0;

    function render(hover) {
      const v = hover ?? value;
      stars.forEach(s => {
        const n = parseInt(s.dataset.star, 10);
        s.classList.toggle('is-on', n <= v);
        s.classList.toggle('is-hover', hover != null && n <= hover && n > value);
      });
      if (label) label.textContent = value ? `${value} из 5` : 'Не оценено';
    }

    stars.forEach(star => {
      const n = parseInt(star.dataset.star, 10);
      star.addEventListener('mouseenter', () => render(n));
      star.addEventListener('mouseleave', () => render());
      star.addEventListener('click', () => {
        value = value === n ? 0 : n;
        el.dataset.value = value;
        render();
      });
    });
    render();
  });
}

function initAdvTables(root) {
  root.querySelectorAll('[data-adv-table]').forEach(el => {
    if (el.dataset.advInit === '1') return;
    el.dataset.advInit = '1';
    const body = el.querySelector('[data-adv-body]');
    const search = el.querySelector('[data-adv-search]');
    const count = el.querySelector('[data-adv-count]');
    const selectAll = el.querySelector('[data-adv-select-all]');
    const rows = body ? [...body.querySelectorAll('tr')] : [];
    let sortKey = 'cat';
    let sortAsc = true;

    function updateCount() {
      const visible = rows.filter(r => !r.classList.contains('is-hidden'));
      if (count) count.textContent = `${visible.length} запис${visible.length === 1 ? 'ь' : visible.length < 5 ? 'и' : 'ей'}`;
    }

    function filter() {
      const q = (search?.value || '').toLowerCase();
      rows.forEach(r => {
        const name = r.dataset.row?.toLowerCase() || '';
        r.classList.toggle('is-hidden', q && !name.includes(q));
      });
      updateCount();
    }

    function sortRows() {
      if (!body) return;
      const sorted = [...rows].sort((a, b) => {
        const av = sortKey === 'name' ? a.dataset.row : a.querySelector('[data-cat]')?.textContent;
        const bv = sortKey === 'name' ? b.dataset.row : b.querySelector('[data-cat]')?.textContent;
        return sortAsc ? String(av).localeCompare(String(bv), 'ru') : String(bv).localeCompare(String(av), 'ru');
      });
      sorted.forEach(r => body.appendChild(r));
    }

    search?.addEventListener('input', filter);
    selectAll?.addEventListener('change', () => {
      el.querySelectorAll('[data-adv-row]').forEach(cb => { cb.checked = selectAll.checked; });
    });

    el.querySelectorAll('.sb-adv-sort').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.sort;
        if (sortKey === key) sortAsc = !sortAsc;
        else { sortKey = key; sortAsc = true; }
        el.querySelectorAll('.sb-adv-sort').forEach(b => {
          b.classList.toggle('is-active', b === btn);
          const span = b.querySelector('span');
          if (span) span.textContent = b === btn ? (sortAsc ? '↑' : '↓') : '↕';
        });
        sortRows();
      });
    });
    updateCount();
  });
}

function initSbTables(root) {
  root.querySelectorAll('[data-sb-table]').forEach(el => {
    if (el.dataset.sbTableInit === '1') return;
    el.dataset.sbTableInit = '1';

    const caption = el.querySelector('[data-table-caption]');
    const rows = [...el.querySelectorAll('[data-table-row]')];
    let selected = null;

    function updateCaption() {
      if (!caption) return;
      if (!selected) {
        caption.textContent = 'Кликните по строке для выбора';
        return;
      }
      const id = selected.querySelector('strong')?.textContent || '—';
      const brand = selected.cells[1]?.textContent || '';
      caption.textContent = `Выбрано: ${id}${brand ? ` · ${brand}` : ''}`;
    }

    rows.forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.closest('button')) return;
        const on = row.classList.contains('is-selected');
        rows.forEach(r => r.classList.remove('is-selected'));
        selected = on ? null : row;
        if (selected) row.classList.add('is-selected');
        updateCaption();
      });
      row.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          row.click();
        }
      });
    });

    el.querySelectorAll('[data-table-variant]').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('[data-table-variant]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        el.classList.remove('sb-table--striped', 'sb-table--bordered');
        const v = btn.dataset.tableVariant;
        if (v === 'striped') el.classList.add('sb-table--striped');
        if (v === 'bordered') el.classList.add('sb-table--bordered');
      });
    });

    el.querySelectorAll('[data-table-size]').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('[data-table-size]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        el.classList.remove('sb-table--compact', 'sb-table--comfortable');
        const s = btn.dataset.tableSize;
        if (s === 'compact') el.classList.add('sb-table--compact');
        if (s === 'comfortable') el.classList.add('sb-table--comfortable');
      });
    });

    updateCaption();
  });
}

function initSignaturePads(root) {
  root.querySelectorAll('[data-signature-pad]').forEach(el => {
    if (el.dataset.sigInit === '1') return;
    el.dataset.sigInit = '1';
    const canvas = el.querySelector('.sb-signature-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0b2a30';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    let drawing = false;

    function pos(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return { x: x * scaleX, y: y * scaleY };
    }

    function start(e) { e.preventDefault(); drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    function stop() { drawing = false; }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', stop);

    el.querySelector('[data-sig-clear]')?.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    el.querySelector('[data-sig-save]')?.addEventListener('click', () => {
      if (typeof showSiteToast === 'function') showSiteToast('Подпись сохранена ✓');
    });
  });
}

function initDocViewers(root) {
  root.querySelectorAll('[data-doc-viewer]').forEach(el => {
    if (el.dataset.docInit === '1') return;
    el.dataset.docInit = '1';
    const total = parseInt(el.dataset.pages, 10) || 1;
    let page = 1;
    let zoom = 100;
    const stage = el.querySelector('[data-doc-stage]');
    const pageEl = el.querySelector('[data-doc-page]');
    const zoomEl = el.querySelector('[data-doc-zoom]');
    const texts = [
      'Договор поставки №28491 — страница 1',
      'Условия оплаты и отгрузки — страница 2',
      'Спецификация продукции — страница 3',
      'Реквизиты сторон — страница 4'
    ];

    function render() {
      if (stage) stage.textContent = texts[page - 1] || `Страница ${page}`;
      if (pageEl) pageEl.textContent = `Стр. ${page} / ${total}`;
      if (zoomEl) zoomEl.textContent = `${zoom}%`;
      if (stage) stage.style.transform = `scale(${zoom / 100})`;
      el.querySelector('[data-doc-prev]').disabled = page <= 1;
      el.querySelector('[data-doc-next]').disabled = page >= total;
    }

    el.querySelector('[data-doc-prev]')?.addEventListener('click', () => { if (page > 1) { page--; render(); } });
    el.querySelector('[data-doc-next]')?.addEventListener('click', () => { if (page < total) { page++; render(); } });
    el.querySelector('[data-doc-zoom-in]')?.addEventListener('click', () => { zoom = Math.min(150, zoom + 10); render(); });
    el.querySelector('[data-doc-zoom-out]')?.addEventListener('click', () => { zoom = Math.max(70, zoom - 10); render(); });
    render();
  });
}

function initGeoPickers(root) {
  root.querySelectorAll('[data-geo-picker]').forEach(el => {
    if (el.dataset.geoInit === '1') return;
    el.dataset.geoInit = '1';
    const map = el.querySelector('[data-geo-map]');
    const pin = el.querySelector('[data-geo-pin]');
    const coords = el.querySelector('[data-geo-coords]');
    if (!map || !pin) return;

    map.addEventListener('click', e => {
      const rect = map.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      pin.style.left = x + '%';
      pin.style.top = y + '%';
      const lat = (55.5 + (y / 100) * 0.5).toFixed(4);
      const lng = (37.3 + (x / 100) * 0.6).toFixed(4);
      if (coords) coords.textContent = `${lat}° N, ${lng}° E — точка на карте`;
    });
  });
}

function initQrCodes(root) {
  root.querySelectorAll('[data-qr-code]').forEach(el => {
    if (el.dataset.qrInit === '1') return;
    el.dataset.qrInit = '1';
    const grid = el.querySelector('[data-qr-grid]');
    const input = el.querySelector('[data-qr-input]');
    if (!grid) return;

    function hash(s, i) {
      let h = 0;
      for (let j = 0; j < s.length; j++) h = ((h << 5) - h + s.charCodeAt(j) + i) | 0;
      return Math.abs(h);
    }

    function render() {
      const val = input?.value || 'sb';
      grid.innerHTML = '';
      for (let i = 0; i < 121; i++) {
        const cell = document.createElement('span');
        cell.className = 'sb-qr-cell' + (hash(val, i) % 3 !== 0 ? ' is-on' : '');
        grid.appendChild(cell);
      }
    }

    el.querySelector('[data-qr-gen]')?.addEventListener('click', render);
    input?.addEventListener('input', render);
    render();
  });
}

function initBarcodes(root) {
  root.querySelectorAll('[data-barcode]').forEach(el => {
    if (el.dataset.bcInit === '1') return;
    el.dataset.bcInit = '1';
    const bars = el.querySelector('[data-barcode-bars]');
    const val = el.dataset.value || '0000000000000';
    if (!bars) return;
    bars.innerHTML = '';
    for (let i = 0; i < val.length; i++) {
      const d = parseInt(val[i], 10) || 0;
      const bar = document.createElement('span');
      bar.className = 'sb-barcode-bar';
      bar.style.height = (20 + d * 4) + 'px';
      bar.style.width = (d % 2 === 0 ? 2 : 4) + 'px';
      bars.appendChild(bar);
    }
  });
}

function initWatermarks(root) {
  root.querySelectorAll('[data-watermark]').forEach(el => {
    if (el.dataset.wmInit === '1') return;
    el.dataset.wmInit = '1';
    const layer = el.querySelector('[data-watermark-layer]');
    el.querySelector('[data-watermark-toggle]')?.addEventListener('change', e => {
      layer?.classList.toggle('is-hidden', !e.target.checked);
    });
  });
}

function initSplitPanes(root) {
  root.querySelectorAll('[data-split-pane]').forEach(el => {
    if (el.dataset.spInit === '1') return;
    el.dataset.spInit = '1';
    const left = el.querySelector('[data-split-left]');
    const divider = el.querySelector('[data-split-divider]');
    const list = el.querySelector('.sb-split-list');
    if (!left || !divider) return;

    let dragging = false;
    divider.addEventListener('mousedown', e => {
      e.preventDefault();
      dragging = true;
      divider.classList.add('is-dragging');
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const rect = el.getBoundingClientRect();
      const pct = Math.min(70, Math.max(20, ((e.clientX - rect.left) / rect.width) * 100));
      left.style.flex = `0 0 ${pct}%`;
    });
    document.addEventListener('mouseup', () => {
      dragging = false;
      divider.classList.remove('is-dragging');
    });

    list?.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        list.querySelectorAll('li').forEach(x => x.classList.remove('is-active'));
        li.classList.add('is-active');
        const detail = el.querySelector('[data-split-right] p');
        if (detail) detail.innerHTML = `Заявка ${li.textContent}<br/>Марка: PP-H 1200<br/>Статус: В работе`;
      });
    });
  });
}
