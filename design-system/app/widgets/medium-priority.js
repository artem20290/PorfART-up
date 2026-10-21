/* ============================================
   MEDIUM-PRIORITY COMPONENTS
   ============================================ */
function initMediumPriority(scope) {
  const root = scope || document;
  initRangeSliders(root);
  initRichTextEditors(root);
  initMentions(root);
  initFormWizards(root);
  initFieldGroups(root);
  initVirtualLists(root);
  initHeatmaps(root);
  initScatterCharts(root);
  initCalendars(root);
  initMegaMenus(root);
  initBackTopDemos(root);
  initLightboxes(root);
  initTours(root);
}

function initRangeSliders(root) {
  root.querySelectorAll('[data-range-slider]').forEach(el => {
    if (el.dataset.rangeInit === '1') return;
    el.dataset.rangeInit = '1';

    const min = parseFloat(el.dataset.min) || 0;
    const max = parseFloat(el.dataset.max) || 100;
    const step = parseFloat(el.dataset.step) || 1;
    let from = parseFloat(el.dataset.from) || min;
    let to = parseFloat(el.dataset.to) || max;
    const track = el.querySelector('.sb-range-slider-track');
    const fill = el.querySelector('.sb-range-slider-fill');
    const thumbFrom = el.querySelector('[data-thumb="from"]');
    const thumbTo = el.querySelector('[data-thumb="to"]');
    const label = el.querySelector('[data-range-label]');
    if (!track || !fill || !thumbFrom || !thumbTo) return;

    function snap(v) {
      return Math.round(v / step) * step;
    }

    function clamp(v, lo, hi) {
      return Math.min(hi, Math.max(lo, v));
    }

    function pct(v) {
      return ((v - min) / (max - min)) * 100;
    }

    function update() {
      if (from > to) [from, to] = [to, from];
      from = clamp(snap(from), min, max);
      to = clamp(snap(to), min, max);
      fill.style.left = pct(from) + '%';
      fill.style.width = (pct(to) - pct(from)) + '%';
      thumbFrom.style.left = pct(from) + '%';
      thumbTo.style.left = pct(to) + '%';
      if (label) label.textContent = `${from} — ${to}`;
    }

    function valueFromX(clientX) {
      const rect = track.getBoundingClientRect();
      const p = clamp((clientX - rect.left) / rect.width, 0, 1);
      return snap(min + p * (max - min));
    }

    let active = null;
    function onMove(e) {
      if (!active) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const v = valueFromX(x);
      if (active === 'from') from = Math.min(v, to);
      else to = Math.max(v, from);
      update();
    }
    function onUp() {
      active = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }

    [thumbFrom, thumbTo].forEach(btn => {
      btn.addEventListener('mousedown', e => {
        e.preventDefault();
        active = btn.dataset.thumb;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
      btn.addEventListener('touchstart', e => {
        active = btn.dataset.thumb;
        document.addEventListener('touchmove', onMove, { passive: true });
        document.addEventListener('touchend', onUp);
      }, { passive: true });
    });

    update();
  });
}

function initRichTextEditors(root) {
  root.querySelectorAll('[data-rich-text]').forEach(el => {
    if (el.dataset.rtInit === '1') return;
    el.dataset.rtInit = '1';
    const area = el.querySelector('.sb-rich-text-area');
    el.querySelectorAll('[data-cmd]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        area?.focus();
        document.execCommand(btn.dataset.cmd, false, null);
      });
    });
  });
}

function initMentions(root) {
  const users = ['Анна Козлова', 'Игорь Смирнов', 'Мария Петрова', 'Дмитрий Волков'];
  root.querySelectorAll('[data-mentions]').forEach(el => {
    if (el.dataset.mentionsInit === '1') return;
    el.dataset.mentionsInit = '1';
    const input = el.querySelector('.sb-mentions-input');
    const dropdown = el.querySelector('.sb-mentions-dropdown');
    if (!input || !dropdown) return;

    function hide() {
      dropdown.hidden = true;
      dropdown.innerHTML = '';
    }

    input.addEventListener('input', () => {
      const val = input.value;
      const at = val.lastIndexOf('@');
      if (at < 0) { hide(); return; }
      const q = val.slice(at + 1).toLowerCase();
      if (q.includes(' ') || q.includes('\n')) { hide(); return; }
      const matches = users.filter(u => u.toLowerCase().includes(q));
      if (!matches.length) { hide(); return; }
      dropdown.innerHTML = matches.map(u => `<li><button type="button" data-user="${u}">${u}</button></li>`).join('');
      dropdown.hidden = false;
    });

    dropdown.addEventListener('click', e => {
      const btn = e.target.closest('[data-user]');
      if (!btn) return;
      const val = input.value;
      const at = val.lastIndexOf('@');
      input.value = val.slice(0, at) + '@' + btn.dataset.user + ' ';
      hide();
      input.focus();
    });

    input.addEventListener('blur', () => setTimeout(hide, 150));
  });
}

function initFormWizards(root) {
  root.querySelectorAll('[data-form-wizard]').forEach(el => {
    if (el.dataset.fwInit === '1') return;
    el.dataset.fwInit = '1';
    const steps = el.querySelectorAll('.sb-fw-step');
    const panels = el.querySelectorAll('.sb-fw-panel');
    const prev = el.querySelector('[data-fw-prev]');
    const next = el.querySelector('[data-fw-next]');
    let cur = 0;

    function go(n) {
      cur = Math.max(0, Math.min(panels.length - 1, n));
      steps.forEach((s, i) => s.classList.toggle('is-active', i === cur));
      panels.forEach((p, i) => p.classList.toggle('is-active', i === cur));
      if (prev) prev.disabled = cur === 0;
      if (next) next.textContent = cur === panels.length - 1 ? 'Отправить' : 'Далее';
    }

    steps.forEach((s, i) => s.addEventListener('click', () => go(i)));
    prev?.addEventListener('click', () => go(cur - 1));
    next?.addEventListener('click', () => {
      if (cur < panels.length - 1) go(cur + 1);
      else if (typeof showSiteToast === 'function') showSiteToast('Заявка отправлена ✓');
    });
    go(0);
  });
}

function initFieldGroups(root) {
  root.querySelectorAll('[data-field-group]').forEach(el => {
    if (el.dataset.fgInit === '1') return;
    el.dataset.fgInit = '1';

    const body = el.querySelector('[data-fg-body]');
    const errorEl = el.querySelector('[data-fg-error]');
    const layoutBtns = el.querySelectorAll('[data-fg-layout]');
    const errorBtn = el.querySelector('[data-fg-toggle-error]');

    layoutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        layoutBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        if (!body) return;
        body.classList.remove(
          'sb-field-group-body--vertical',
          'sb-field-group-body--horizontal',
          'sb-field-group-body--grid'
        );
        body.classList.add(`sb-field-group-body--${btn.dataset.fgLayout}`);
      });
    });

    errorBtn?.addEventListener('click', () => {
      const on = el.classList.toggle('is-error');
      if (errorEl) errorEl.hidden = !on;
      errorBtn.classList.toggle('is-active', on);
      errorBtn.textContent = on ? 'Скрыть ошибку' : 'Ошибка';
    });
  });
}

function initVirtualLists(root) {
  root.querySelectorAll('[data-virtual-list]').forEach(el => {
    if (el.dataset.vlInit === '1') return;
    el.dataset.vlInit = '1';
    const inner = el.querySelector('[data-vl-inner]');
    const status = el.querySelector('[data-vl-status]');
    const total = parseInt(el.dataset.total, 10) || 30;
    let loaded = 0;
    let loading = false;

    function renderBatch() {
      if (loading || loaded >= total) return;
      loading = true;
      if (status) status.textContent = 'Загрузка...';
      setTimeout(() => {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 10 && loaded < total; i++, loaded++) {
          const li = document.createElement('li');
          li.className = 'sb-virtual-list-item';
          li.textContent = `Заявка #${1000 + loaded} — PP-H 1200`;
          frag.appendChild(li);
        }
        inner.appendChild(frag);
        loading = false;
        if (status) status.textContent = loaded >= total ? 'Все загружено' : `Показано ${loaded} из ${total}`;
      }, 400);
    }

    el.addEventListener('scroll', () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) renderBatch();
    });
    renderBatch();
  });
}

function initHeatmaps(root) {
  root.querySelectorAll('[data-heatmap]').forEach(el => {
    if (el.dataset.heatmapInit === '1') return;
    el.dataset.heatmapInit = '1';
    const tip = el.querySelector('[data-heatmap-tip]');
    el.querySelectorAll('.sb-heatmap-cell').forEach((cell, i) => {
      cell.addEventListener('mouseenter', () => {
        if (!tip) return;
        tip.hidden = false;
        tip.textContent = `Ячейка ${i + 1}: ${cell.dataset.val || cell.style.getPropertyValue('--intensity')}%`;
      });
      cell.addEventListener('mouseleave', () => { if (tip) tip.hidden = true; });
    });
  });
}

function initScatterCharts(root) {
  root.querySelectorAll('[data-scatter-chart]').forEach(el => {
    if (el.dataset.scatterInit === '1') return;
    el.dataset.scatterInit = '1';
    const tip = el.querySelector('[data-scatter-tip]');
    el.querySelectorAll('.sb-scatter-dot').forEach(dot => {
      dot.addEventListener('mouseenter', () => {
        if (!tip) return;
        tip.hidden = false;
        tip.textContent = dot.dataset.label || 'Точка';
        tip.style.left = dot.getAttribute('cx') + 'px';
        tip.style.top = (parseFloat(dot.getAttribute('cy')) - 28) + 'px';
      });
      dot.addEventListener('mouseleave', () => { if (tip) tip.hidden = true; });
    });
  });
}

function initCalendars(root) {
  root.querySelectorAll('[data-calendar]').forEach(el => {
    if (el.dataset.calInit === '1') return;
    el.dataset.calInit = '1';
    const grid = el.querySelector('[data-cal-grid]');
    const title = el.querySelector('[data-cal-title]');
    let year = 2026, month = 5, selected = 23;
    const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

    function render() {
      if (title) title.textContent = `${months[month]} ${year}`;
      if (!grid) return;
      grid.innerHTML = '';
      const first = new Date(year, month, 1);
      const start = (first.getDay() + 6) % 7;
      const days = new Date(year, month + 1, 0).getDate();
      const today = new Date();
      for (let i = 0; i < start; i++) {
        const empty = document.createElement('span');
        empty.className = 'sb-cal-day is-empty';
        grid.appendChild(empty);
      }
      for (let d = 1; d <= days; d++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sb-cal-day';
        btn.textContent = d;
        if (d === selected && month === 5 && year === 2026) btn.classList.add('is-selected');
        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) btn.classList.add('is-today');
        btn.addEventListener('click', () => {
          selected = d;
          render();
        });
        grid.appendChild(btn);
      }
    }

    el.querySelector('[data-cal-prev]')?.addEventListener('click', () => {
      month--;
      if (month < 0) { month = 11; year--; }
      render();
    });
    el.querySelector('[data-cal-next]')?.addEventListener('click', () => {
      month++;
      if (month > 11) { month = 0; year++; }
      render();
    });
    render();
  });
}

function initMegaMenus(root) {
  root.querySelectorAll('[data-mega-menu]').forEach(el => {
    if (el.dataset.megaInit === '1') return;
    el.dataset.megaInit = '1';
    const trigger = el.querySelector('.sb-mega-trigger');
    const panel = el.querySelector('.sb-mega-panel');
    if (!trigger || !panel) return;

    function open() {
      panel.classList.add('is-open');
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }
    function close() {
      panel.classList.remove('is-open');
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', () => panel.hidden ? open() : close());
    el.addEventListener('mouseenter', open);
    el.addEventListener('mouseleave', close);
  });
}

function initBackTopDemos(root) {
  root.querySelectorAll('[data-backtop-demo]').forEach(el => {
    if (el.dataset.btInit === '1') return;
    el.dataset.btInit = '1';
    const scroll = el.querySelector('[data-backtop-scroll]');
    const btn = el.querySelector('[data-backtop-btn]');
    if (!scroll || !btn) return;
    scroll.addEventListener('scroll', () => {
      btn.hidden = scroll.scrollTop < 80;
    });
    btn.addEventListener('click', () => scroll.scrollTo({ top: 0, behavior: 'smooth' }));
  });
}

function initLightboxes(root) {
  const gradients = [
    'linear-gradient(135deg,#008f95,#006b74)',
    'linear-gradient(135deg,#1f8f53,#0d6b3a)',
    'linear-gradient(135deg,#e67e22,#c45f12)'
  ];
  root.querySelectorAll('[data-lightbox]').forEach(el => {
    if (el.dataset.lbInit === '1') return;
    el.dataset.lbInit = '1';
    const overlay = el.querySelector('[data-lightbox-overlay]');
    const stage = el.querySelector('[data-lightbox-stage]');
    let idx = 0;

    function show(i) {
      idx = (i + gradients.length) % gradients.length;
      if (stage) {
        stage.style.background = gradients[idx];
        stage.textContent = `Изображение ${idx + 1}`;
      }
      if (overlay) {
        overlay.classList.add('is-open');
        overlay.hidden = false;
      }
    }
    function hide() {
      if (overlay) {
        overlay.classList.remove('is-open');
        overlay.hidden = true;
      }
    }

    hide();

    el.querySelectorAll('.sb-lightbox-thumb').forEach(t => {
      t.addEventListener('click', () => show(parseInt(t.dataset.img, 10)));
    });
    el.querySelector('[data-lightbox-close]')?.addEventListener('click', hide);
    el.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(idx - 1));
    el.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(idx + 1));
    overlay?.addEventListener('click', e => { if (e.target === overlay) hide(); });
  });
}

function initTours(root) {
  const tourSteps = [
    { title: 'Обзор', text: 'Здесь отображается сводка по заявкам и KPI.' },
    { title: 'Фильтры', text: 'Используйте фильтры для быстрого поиска.' },
    { title: 'Действия', text: 'Создавайте и экспортируйте заявки из этой панели.' }
  ];
  root.querySelectorAll('[data-tour-demo]').forEach(el => {
    if (el.dataset.tourInit === '1') return;
    el.dataset.tourInit = '1';
    const overlay = el.querySelector('[data-tour-overlay]');
    const spotlight = el.querySelector('[data-tour-spotlight]');
    const titleEl = el.querySelector('[data-tour-title]');
    const textEl = el.querySelector('[data-tour-text]');
    const targets = el.querySelectorAll('[data-tour-step]');
    let step = 0;

    function showStep(n) {
      if (n >= tourSteps.length) {
        overlay.classList.remove('is-open');
        overlay.hidden = true;
        step = 0;
        return;
      }
      step = n;
      const target = targets[step];
      const info = tourSteps[step];
      if (titleEl) titleEl.textContent = info.title;
      if (textEl) textEl.textContent = info.text;
      if (target && spotlight) {
        const r = target.getBoundingClientRect();
        const pr = el.getBoundingClientRect();
        spotlight.style.top = (r.top - pr.top - 4) + 'px';
        spotlight.style.left = (r.left - pr.left - 4) + 'px';
        spotlight.style.width = (r.width + 8) + 'px';
        spotlight.style.height = (r.height + 8) + 'px';
        spotlight.hidden = false;
      } else if (spotlight) {
        spotlight.hidden = true;
      }
      overlay.classList.add('is-open');
      overlay.hidden = false;
    }

    el.querySelector('[data-tour-start]')?.addEventListener('click', () => showStep(0));
    el.querySelector('[data-tour-next]')?.addEventListener('click', () => showStep(step + 1));
    el.querySelector('[data-tour-skip]')?.addEventListener('click', () => {
      overlay.classList.remove('is-open');
      overlay.hidden = true;
    });
  });
}
