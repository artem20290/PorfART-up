/* ============================================
   ROUTING / PAGE BUILDING
   ============================================ */
const tokenIconIds = ['grid', 'list', 'layers', 'briefcase', 'list', 'zap'];
const compIconIds = { 'Action': 'plus', 'Typography': 'list', 'Layout': 'grid', 'Navigation': 'globe', 'Data display': 'bar-chart', 'Overlay': 'message' };

const PG_TOKEN_VARS = [
  '--primary', '--primary-hover', '--primary-pressed', '--primary-light',
  '--border', '--border-strong', '--border-default', '--border-primary', '--border-focus',
  '--r-xs', '--r-sm', '--r-md', '--r-lg', '--r-xl', '--r-2xl',
  '--sp-1', '--sp-2', '--sp-3', '--sp-4', '--sp-5', '--sp-6',
  '--fs-body', '--fs-h1', '--fs-h2', '--fs-h3',
  '--shadow-xs', '--shadow-sm', '--shadow-card', '--shadow-hover', '--shadow-lg', '--shadow-primary',
  '--scrollbar-thumb', '--scrollbar-track'
];

const PG_SHADOW_PRESETS = {
  flat: {
    xs: 'none', sm: 'none', card: 'none', hover: 'none', lg: 'none', primary: 'none'
  },
  subtle: {
    xs: '0 1px 2px rgba(24,34,40,0.05)',
    sm: '0 2px 6px rgba(24,34,40,0.05)',
    card: '0 4px 12px rgba(24,34,40,0.06)',
    hover: '0 6px 16px rgba(24,34,40,0.08)',
    lg: '0 8px 24px rgba(24,34,40,0.1)',
    primary: '0 4px 16px rgba(0,143,149,0.15)'
  },
  default: {
    xs: '0 1px 2px rgba(24,34,40,0.05)',
    sm: '0 2px 8px rgba(24,34,40,0.06)',
    card: '0 8px 20px rgba(24,34,40,0.07)',
    hover: '0 12px 28px rgba(24,34,40,0.12)',
    lg: '0 16px 40px rgba(24,34,40,0.15)',
    primary: '0 8px 24px rgba(0,143,149,0.25)'
  },
  elevated: {
    xs: '0 2px 4px rgba(24,34,40,0.08)',
    sm: '0 4px 12px rgba(24,34,40,0.1)',
    card: '0 12px 32px rgba(24,34,40,0.12)',
    hover: '0 16px 40px rgba(24,34,40,0.16)',
    lg: '0 24px 56px rgba(24,34,40,0.2)',
    primary: '0 12px 32px rgba(0,143,149,0.3)'
  }
};

const PG_BASE_SPACING = [8, 12, 16, 20, 24, 32];

function pgParseHex(hex) {
  const h = String(hex || '').replace('#', '');
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  if (n.length !== 6) return { r: 0, g: 143, b: 149 };
  return { r: parseInt(n.slice(0, 2), 16), g: parseInt(n.slice(2, 4), 16), b: parseInt(n.slice(4, 6), 16) };
}

function pgHex(rgb) {
  return '#' + [rgb.r, rgb.g, rgb.b]
    .map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
    .join('');
}

function pgShift(hex, amount) {
  const c = pgParseHex(hex);
  return pgHex({ r: c.r + amount, g: c.g + amount, b: c.b + amount });
}

function pgAlpha(hex, a) {
  const c = pgParseHex(hex);
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

function pgCollectCss(root) {
  const cs = getComputedStyle(root);
  return PG_TOKEN_VARS
    .map(v => {
      const val = root.style.getPropertyValue(v).trim() || cs.getPropertyValue(v).trim();
      return val ? `  ${v}: ${val};` : null;
    })
    .filter(Boolean)
    .join('\n');
}

const pages = [];

// Favorites page
pages.push({
  id: 'favorites',
  group: 'main',
  iconId: 'heart',
  label: 'Избранное',
  title: 'Избранные компоненты',
  subtitle: 'Компоненты, которые вы отметили сердецком.',
  build: () => {
    const wrap = document.createElement('div');
    const favs = getFavorites();
    const favItems = favs.map(key => resolveFavorite(key)).filter(Boolean);
    wrap.innerHTML = `
      ${favItems.length ? `
        <div style="font-size:14px;color:var(--text-secondary);margin-bottom:20px">Сохранено: <strong>${favItems.length}</strong></div>
        <div class="components-grid">
          ${favItems.map(({ comp, variant }) => {
            const cat = categoryOrder.find(ct => [ct.key, ...(ct.extraKeys || [])].includes(comp.category));
            const title = variant ? `${comp.name} — ${variant.label}` : comp.name;
            const demoHtml = variant
              ? getFavoriteVariantDemoHtml(comp, variant.id)
              : comp.demo;
            return `<div class="comp-card" id="${componentDomId(comp)}${variant ? `-${variant.id}` : ''}" data-component-name="${comp.name}"${variant ? ` data-variant-id="${variant.id}"` : ''}>
              <div class="comp-head"><h3 class="comp-title">${title}</h3><span class="comp-cat">${cat?.label || comp.category}</span></div>
              <div class="comp-desc">${variant ? `<span class="tag tag-neutral" style="font-size:11px;margin-bottom:8px;display:inline-block">Вариант</span> ` : ''}${comp.desc}</div>
              <div class="comp-demo">${demoHtml}</div>
              <div class="comp-props">${renderPropTable(comp)}</div>
              <div class="comp-meta">
                <span style="font-size:11px;color:var(--text-secondary);padding:3px 8px;background:var(--neutral-bg);border-radius:12px;font-weight:700">${comp.version || KIT_VERSION}</span>
                <span class="tag ${STATUS_CLASS[getComponentStatus(comp)] || 'tag-neutral'}" style="font-size:11px;padding:3px 8px">${getComponentStatus(comp)}</span>
                <span><strong>Параметры:</strong> <code>${comp.params}</code></span>
                <span><strong>Состояния:</strong> <code>${comp.states}</code></span>
              </div>
            </div>`;
          }).join('')}
        </div>
      ` : `
        <div class="favorites-empty" style="text-align:center;padding:60px 20px">
          <div style="opacity:0.3;margin-bottom:12px">${icon('heart', 48)}</div>
          <h3 style="margin:0 0 8px;font-size:18px;color:var(--text-main)">Пока ницего нет</h3>
          <p style="margin:0;color:var(--text-secondary);font-size:14px">Нажмите на ${icon('heart', 14)} в картоцке компонента, цтобы добавить его сюда</p>
        </div>
      `}
    `;

    // Re-init interactive widgets and per-variant actions
    requestAnimationFrame(() => {
      reinitWidgets();
      wrap.querySelectorAll('.comp-card[data-component-name]').forEach(card => {
        const comp = uniqueComponentsList.find(c => c.name === card.dataset.componentName);
        if (comp) initShowcaseItemActions(card, comp);
      });
    });

    return wrap;
  }
});

pages.push({
  id: 'templates',
  group: 'templates',
  iconId: 'grid',
  label: 'Шаблоны',
  title: 'Шаблоны страних',
  subtitle: 'Готовые композихии из компонентов design systems — все интерактивные экраны на одной странихе.',
  build: () => {
    const wrap = document.createElement('div');
    wrap.className = 'tpl-page';
    const defs = typeof templateDefinitions !== 'undefined' ? templateDefinitions : [];

    if (!defs.length) {
      wrap.innerHTML = '<p style="color:var(--text-secondary)">Шаблоны не загружены.</p>';
      return wrap;
    }

    wrap.innerHTML = `
      <nav class="tpl-jump-nav" aria-label="Навигация по шаблонам">
        ${defs.map(t => {
          const slug = t.id.replace('template-', '');
          return `<a href="#templates/${slug}" class="tpl-jump-link" data-tpl-jump="${t.id}">${pageIcon(t.iconId, 14)}<span>${t.label}</span></a>`;
        }).join('')}
      </nav>
      <div class="tpl-sections">
        ${defs.map(t => {
          const slug = t.id.replace('template-', '');
          return `
          <section class="tpl-section" id="tpl-${slug}" data-tpl-section="${t.id}">
            <div class="tpl-panel-head">
              <div class="tpl-panel-intro">
                <h2 class="tpl-panel-title">${t.label}</h2>
                <p class="tpl-panel-sub">${t.subtitle}</p>
              </div>
              <div class="tpl-components-bar">${t.components.map(c => `<span class="tag tag-neutral">${c}</span>`).join('')}</div>
            </div>
            <div class="tpl-panel-body">${t.html}</div>
          </section>`;
        }).join('')}
      </div>
    `;

    initTemplatePage(wrap);
    requestAnimationFrame(() => reinitWidgets(wrap));

    return wrap;
  }
});

// Icon Pack page
pages.push({
  id: 'icon-pack',
  group: 'icons',
  iconId: 'layers',
  label: 'Пак иконок',
  count: iconPack.length,
  title: 'Пак иконок',
  subtitle: 'Stroke-иконки SB design systems в стиле Icon-only Ghost (size M). Клик по иконке — копирование SVG.',
  build: () => {
    const wrap = document.createElement('div');
    wrap.className = 'icon-pack-page';

    wrap.innerHTML = `
      <div class="icon-pack-toolbar">
        <input type="search" class="icon-pack-search" placeholder="Поиск иконки..." autocomplete="off" />
        <div class="icon-pack-filters">
          <button class="btn btn-primary btn-s icon-pack-filter active" data-cat="all">Все (${iconPack.length})</button>
          ${iconCategories.map(cat => {
            const n = iconPack.filter(i => i.category === cat).length;
            return `<button class="btn btn-secondary btn-s icon-pack-filter" data-cat="${cat}">${cat} (${n})</button>`;
          }).join('')}
        </div>
      </div>
      <div class="icon-pack-grid" id="iconPackGrid"></div>
      <p class="icon-pack-hint">Иконки: viewBox 24×24, stroke currentColor, stroke-width 2.2. Используйте внутри <code>&lt;span class="bi"&gt;</code> или кнопки <code>btn btn-ghost btn-m btn-icon-only</code>.</p>
    `;

    const grid = wrap.querySelector('#iconPackGrid');
    const searchInput = wrap.querySelector('.icon-pack-search');
    const filterBtns = wrap.querySelectorAll('.icon-pack-filter');
    let activeCat = 'all';

    function renderGrid() {
      const q = searchInput.value.trim().toLowerCase();
      const items = iconPack.filter(icon => {
        const matchCat = activeCat === 'all' || icon.category === activeCat;
        const haystack = `${icon.name} ${icon.id} ${icon.category}`.toLowerCase();
        return matchCat && (!q || haystack.includes(q));
      });

      grid.innerHTML = items.map(icon => `
        <div class="icon-pack-item" data-icon-id="${icon.id}" title="Скопировать SVG · ${icon.id}">
          <button type="button" class="btn btn-ghost btn-m btn-icon-only icon-pack-btn" aria-label="${icon.name}">
            <span class="bi">${renderIconSvg(icon)}</span>
          </button>
          <div class="icon-pack-name">${icon.name}</div>
          <div class="icon-pack-id">${icon.id}</div>
        </div>
      `).join('');

      if (!items.length) {
        grid.innerHTML = '<div class="icon-pack-empty">Иконки не найдены</div>';
      }
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.classList.replace('btn-primary', 'btn-secondary');
        });
        btn.classList.add('active');
        btn.classList.replace('btn-secondary', 'btn-primary');
        activeCat = btn.dataset.cat;
        renderGrid();
      });
    });

    searchInput.addEventListener('input', renderGrid);

    grid.addEventListener('click', e => {
      const item = e.target.closest('.icon-pack-item');
      if (!item) return;
      const icon = iconPack.find(i => i.id === item.dataset.iconId);
      if (!icon) return;
      const snippet = iconSvgSnippet(icon);
      fallbackClipboardCopy(snippet);
      showSiteToast(`Скопировано: ${icon.name}`);
      item.classList.add('is-copied');
      setTimeout(() => item.classList.remove('is-copied'), 600);
    });

    renderGrid();
    return wrap;
  }
});

// Design Tokens Playground
pages.push({
  id: 'tokens-playground',
  group: 'main',
  iconId: 'contrast',
  label: 'Tokens Playground',
  title: 'Design Tokens Playground',
  subtitle: 'Интерактивная настройка токенов: хвета, радиусы, тени, отступы, типографика и density. Изменения применяются церез CSS variables ко всей витрине.',
  build: () => {
    const wrap = document.createElement('div');
    wrap.className = 'tpg-wrap';
    wrap.innerHTML = `
      <div class="tpg-controls">
        <div class="tpg-card">
          <h3 class="tpg-card-title">Primary</h3>
          <input type="color" id="pg-primary" value="#008f95" class="tpg-color-input">
          <p class="tpg-card-hint" id="pg-primary-val">#008f95 · hover/pressed автоматицески</p>
        </div>
        <div class="tpg-card">
          <h3 class="tpg-card-title">Border color</h3>
          <input type="color" id="pg-border" value="#d7dee1" class="tpg-color-input">
          <p class="tpg-card-hint" id="pg-border-val">#d7dee1</p>
        </div>
        <div class="tpg-card">
          <h3 class="tpg-card-title">Border radius (base)</h3>
          <input type="range" id="pg-radius" class="tpg-range" min="0" max="24" value="6">
          <div class="tpg-range-row"><span>0</span><strong id="pg-radius-val">6px</strong><span>24</span></div>
        </div>
        <div class="tpg-card">
          <h3 class="tpg-card-title">Spacing scale</h3>
          <input type="range" id="pg-spacing" class="tpg-range" min="75" max="140" value="100">
          <div class="tpg-range-row"><span>‒25%</span><strong id="pg-spacing-val">100%</strong><span>+40%</span></div>
        </div>
        <div class="tpg-card">
          <h3 class="tpg-card-title">Body font size</h3>
          <input type="range" id="pg-font" class="tpg-range" min="14" max="18" value="16" step="1">
          <div class="tpg-range-row"><span>14px</span><strong id="pg-font-val">16px</strong><span>18px</span></div>
        </div>
        <div class="tpg-card">
          <h3 class="tpg-card-title">Shadow preset</h3>
          <div class="tpg-chips" id="pg-shadow-chips">
            <button type="button" class="tpg-chip" data-shadow-preset="flat">Flat</button>
            <button type="button" class="tpg-chip" data-shadow-preset="subtle">Subtle</button>
            <button type="button" class="tpg-chip is-active" data-shadow-preset="default">Default</button>
            <button type="button" class="tpg-chip" data-shadow-preset="elevated">Elevated</button>
          </div>
        </div>
        <div class="tpg-card">
          <h3 class="tpg-card-title">Density</h3>
          <div class="tpg-chips">
            <button type="button" class="density-btn tpg-chip" data-density="compact">Compact</button>
            <button type="button" class="density-btn tpg-chip is-active" data-density="normal">Normal</button>
            <button type="button" class="density-btn tpg-chip" data-density="spacious">Spacious</button>
          </div>
        </div>
      </div>

      <div class="tpg-actions">
        <button type="button" class="btn btn-primary btn-s" id="pg-copy-css">${icon('copy', 16)} Копировать CSS</button>
        <button type="button" class="btn btn-secondary btn-s" id="pg-reset">Сбросить</button>
      </div>

      <div class="tpg-preview-head">
        <h3 style="color:var(--text-main)">Live Preview</h3>
        <span style="font-size:13px;color:var(--text-secondary)">Кнопки · форма · картоцка · таблиха · теги</span>
      </div>
      <div class="tpg-preview-grid" id="pg-preview">
        <div class="tpg-preview-panel">
          <p class="tpg-preview-panel-title">Actions</p>
          <div class="tpg-preview-row">
            <button class="btn btn-primary btn-m">Primary</button>
            <button class="btn btn-secondary btn-m">Secondary</button>
            <button class="btn btn-ghost btn-m">Ghost</button>
          </div>
        </div>
        <div class="tpg-preview-panel">
          <p class="tpg-preview-panel-title">Form</p>
          <label class="sb-textfield-label">Марка продукта</label>
          <input class="tpg-preview-input" value="PP-H 1200" />
        </div>
        <div class="tpg-preview-panel">
          <p class="tpg-preview-panel-title">Surface</p>
          <div class="tpg-preview-card">
            <strong>Заявка #A-28491</strong>
            <span>Полипропилен · 50 т · card + shadow</span>
          </div>
        </div>
        <div class="tpg-preview-panel">
          <p class="tpg-preview-panel-title">Table</p>
          <table class="tpg-mini-table">
            <thead><tr><th>SKU</th><th>Остаток</th></tr></thead>
            <tbody>
              <tr><td>PP-H030</td><td>840 т</td></tr>
              <tr><td>PE-100X</td><td>512 т</td></tr>
            </tbody>
          </table>
        </div>
        <div class="tpg-preview-panel">
          <p class="tpg-preview-panel-title">Status</p>
          <div class="tpg-preview-row">
            <span class="tag tag-success">В налиции</span>
            <span class="tag tag-warning">Под заказ</span>
            <span class="tag tag-neutral">Черновик</span>
          </div>
        </div>
        <div class="tpg-preview-panel">
          <p class="tpg-preview-panel-title">Typography</p>
          <div class="sb-text size-l" style="margin-bottom:6px">Заголовок H2</div>
          <div class="sb-text size-m">Body text — типографика масртабируется с --fs-body.</div>
        </div>
      </div>

      <div class="tpg-output">
        <div class="tpg-output-head">
          <span>:root overrides</span>
          <button type="button" class="btn btn-ghost btn-xs" id="pg-copy-inline" style="color:#cfdee1">Copy</button>
        </div>
        <pre id="pg-css-output">/* move sliders to generate */</pre>
      </div>
    `;

    requestAnimationFrame(() => {
      const root = document.documentElement;
      const els = {
        primary: wrap.querySelector('#pg-primary'),
        border: wrap.querySelector('#pg-border'),
        radius: wrap.querySelector('#pg-radius'),
        spacing: wrap.querySelector('#pg-spacing'),
        font: wrap.querySelector('#pg-font'),
        primaryVal: wrap.querySelector('#pg-primary-val'),
        borderVal: wrap.querySelector('#pg-border-val'),
        radiusVal: wrap.querySelector('#pg-radius-val'),
        spacingVal: wrap.querySelector('#pg-spacing-val'),
        fontVal: wrap.querySelector('#pg-font-val'),
        cssOut: wrap.querySelector('#pg-css-output'),
        shadowChips: wrap.querySelectorAll('[data-shadow-preset]'),
        densityBtns: wrap.querySelectorAll('.density-btn')
      };

      let shadowPreset = 'default';

      function syncTpgRangeFill(input) {
        if (!input || input.type !== 'range') return;
        const min = Number(input.min) || 0;
        const max = Number(input.max) || 100;
        const val = Number(input.value);
        const pct = max === min ? 0 : ((val - min) / (max - min)) * 100;
        input.style.setProperty('--tpg-range-fill', `${pct}%`);
      }

      [els.radius, els.spacing, els.font].forEach(syncTpgRangeFill);

      function applyShadowPreset(name) {
        const p = PG_SHADOW_PRESETS[name] || PG_SHADOW_PRESETS.default;
        root.style.setProperty('--shadow-xs', p.xs);
        root.style.setProperty('--shadow-sm', p.sm);
        root.style.setProperty('--shadow-card', p.card);
        root.style.setProperty('--shadow-hover', p.hover);
        root.style.setProperty('--shadow-lg', p.lg);
        root.style.setProperty('--shadow-primary', p.primary);
      }

      function updateOutput() {
        els.cssOut.textContent = `:root {\n${pgCollectCss(root)}\n}`;
      }

      function updateTheme() {
        const primary = els.primary.value;
        root.style.setProperty('--primary', primary);
        root.style.setProperty('--primary-hover', pgShift(primary, -20));
        root.style.setProperty('--primary-pressed', pgShift(primary, -35));
        root.style.setProperty('--primary-light', pgAlpha(primary, 0.08));
        root.style.setProperty('--border-primary', `1px solid ${primary}`);
        root.style.setProperty('--border-focus', `0 0 0 3px ${pgAlpha(primary, 0.25)}`);
        els.primaryVal.textContent = `${primary} · hover/pressed автоматицески`;

        const border = els.border.value;
        root.style.setProperty('--border', border);
        root.style.setProperty('--border-default', `1px solid ${border}`);
        root.style.setProperty('--border-dashed', `1px dashed ${border}`);
        els.borderVal.textContent = border;

        const r = parseInt(els.radius.value, 10);
        root.style.setProperty('--r-xs', Math.max(0, r - 2) + 'px');
        root.style.setProperty('--r-sm', r + 'px');
        root.style.setProperty('--r-md', (r + 4) + 'px');
        root.style.setProperty('--r-lg', (r + 8) + 'px');
        root.style.setProperty('--r-xl', (r + 10) + 'px');
        root.style.setProperty('--r-2xl', (r + 18) + 'px');
        els.radiusVal.textContent = r + 'px';

        const scale = parseInt(els.spacing.value, 10) / 100;
        PG_BASE_SPACING.forEach((v, i) => {
          root.style.setProperty(`--sp-${i + 1}`, Math.round(v * scale) + 'px');
        });
        els.spacingVal.textContent = Math.round(scale * 100) + '%';

        const fs = parseInt(els.font.value, 10);
        root.style.setProperty('--fs-body', fs + 'px');
        root.style.setProperty('--fs-h3', Math.round(fs * 1.125) + 'px');
        root.style.setProperty('--fs-h2', Math.round(fs * 1.5) + 'px');
        root.style.setProperty('--fs-h1', Math.round(fs * 2.5) + 'px');
        els.fontVal.textContent = fs + 'px';

        applyShadowPreset(shadowPreset);
        updateOutput();
      }

      function resetTheme() {
        PG_TOKEN_VARS.forEach(v => root.style.removeProperty(v));
        root.setAttribute('data-density', 'normal');
        els.primary.value = '#008f95';
        els.border.value = '#d7dee1';
        els.radius.value = '6';
        els.spacing.value = '100';
        els.font.value = '16';
        [els.radius, els.spacing, els.font].forEach(syncTpgRangeFill);
        shadowPreset = 'default';
        els.shadowChips.forEach(c => c.classList.toggle('is-active', c.dataset.shadowPreset === 'default'));
        els.densityBtns.forEach(b => b.classList.toggle('is-active', b.dataset.density === 'normal'));
        updateTheme();
        if (typeof showSiteToast === 'function') showSiteToast('Токены сброрены');
      }

      ['input', 'change'].forEach(ev => {
        els.primary.addEventListener(ev, updateTheme);
        els.border.addEventListener(ev, updateTheme);
        els.radius.addEventListener('input', () => { syncTpgRangeFill(els.radius); updateTheme(); });
        els.spacing.addEventListener('input', () => { syncTpgRangeFill(els.spacing); updateTheme(); });
        els.font.addEventListener('input', () => { syncTpgRangeFill(els.font); updateTheme(); });
      });

      els.shadowChips.forEach(chip => {
        chip.addEventListener('click', () => {
          shadowPreset = chip.dataset.shadowPreset;
          els.shadowChips.forEach(c => c.classList.remove('is-active'));
          chip.classList.add('is-active');
          updateTheme();
        });
      });

      els.densityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          els.densityBtns.forEach(b => b.classList.remove('is-active', 'active'));
          btn.classList.add('is-active', 'active');
          if (btn.dataset.density === 'normal') root.removeAttribute('data-density');
          else root.setAttribute('data-density', btn.dataset.density);
          updateOutput();
        });
      });

      wrap.querySelector('#pg-copy-css')?.addEventListener('click', () => {
        const text = els.cssOut.textContent;
        navigator.clipboard.writeText(text).then(() => {
          if (typeof showSiteToast === 'function') showSiteToast('CSS токенов скопирован');
        });
      });
      wrap.querySelector('#pg-copy-inline')?.addEventListener('click', () => {
        navigator.clipboard.writeText(els.cssOut.textContent).then(() => {
          if (typeof showSiteToast === 'function') showSiteToast('CSS скопирован');
        });
      });
      wrap.querySelector('#pg-reset')?.addEventListener('click', resetTheme);

      updateTheme();
    });

    return wrap;
  }
});

// SB Agent — tool-using design-system agent (chat · preview · export)
pages.push({
  id: 'ai-builder',
  group: 'main',
  iconId: 'zap',
  label: 'SB Agent',
  title: 'SB Agent',
  subtitle: 'Агент по SB Design System: бриф · шаблон и компоненты · живое превью · правки · экспорт.',
  build: () => {
    const wrap = document.createElement('div');
    if (!window.SbAgent) {
      wrap.innerHTML = '<p style="color:var(--text-secondary)">Движок агента не загружен.</p>';
      return wrap;
    }

    const CHATS_KEY = 'sb-agent-chats-v2';
    const chatLog = [];
    let busy = false;
    let settingsOpen = false;

    function chatUid() {
      return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }
    function makeChat(title) {
      return {
        id: chatUid(),
        title: title || 'Новый чат',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        project: SbAgent.emptyProject(),
        session: SbAgent.emptySession(),
        messages: [],
      };
    }
    function loadChatsStore() {
      try {
        const raw = localStorage.getItem(CHATS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.chats) || !parsed.chats.length) return null;
        return parsed;
      } catch (e) {
        return null;
      }
    }
    let chatsStore = loadChatsStore();
    if (!chatsStore) {
      const first = makeChat();
      chatsStore = { activeId: first.id, chats: [first] };
    }
    let activeChatId = chatsStore.activeId;
    if (!chatsStore.chats.some((c) => c.id === activeChatId)) {
      activeChatId = chatsStore.chats[0].id;
      chatsStore.activeId = activeChatId;
    }
    let activeChat = chatsStore.chats.find((c) => c.id === activeChatId) || chatsStore.chats[0];
    let project = activeChat.project ? { ...SbAgent.emptyProject(), ...activeChat.project } : SbAgent.emptyProject();
    let session = activeChat.session ? { ...SbAgent.emptySession(), ...activeChat.session } : SbAgent.emptySession();
    SbAgent.sanitizeProjectComponents(project);

    const THINK = [
      'Сверяю каталог SB…',
      'Подбираю компоненты…',
      'Собираю экран…',
      'Проверяю compliance…',
      'Обновляю превью…',
    ];
    let thinkIdx = 0;
    let thinkTimer = null;
    let recognition = null;
    let voiceListening = false;
    let pendingPreviewAction = null;

    wrap.innerHTML = `
      <div class="sb-agent">
        <section class="sb-agent-toolbar" aria-label="Проект" id="sb-agent-side"></section>
        <div class="sb-agent-main">
          <section class="sb-agent-col is-chat" aria-label="Чат с агентом">
            <div class="sb-agent-col-h">
              <div class="sb-agent-avatar" aria-hidden="true">AI</div>
              <div class="sb-agent-titles">
                <h3>SB Agent</h3>
                <span class="sb-agent-online" id="sb-agent-live"><i></i> Онлайн · Design System</span>
              </div>
              <button type="button" class="sb-agent-icon-btn" id="sb-agent-settings-btn" title="Настройки RAG / LLM" aria-label="Настройки" aria-expanded="false">${icon('settings', 16)}</button>
              <button type="button" class="sb-agent-icon-btn" id="sb-agent-new-chat" title="Новый чат" aria-label="Новый чат">${icon('plus', 16)}</button>
              <button type="button" class="sb-agent-icon-btn" id="sb-agent-clear" title="Очистить чат" aria-label="Очистить чат">${icon('refresh', 16)}</button>
            </div>
            <div class="sb-agent-chats" id="sb-agent-chats" role="tablist" aria-label="Чаты"></div>
            <div class="sb-agent-chat" id="sb-agent-chat"></div>
            <div class="sb-agent-settings" id="sb-agent-settings" hidden></div>
            <div class="sb-agent-composer">
              <div class="sb-agent-chips" id="sb-agent-chips"></div>
              <textarea id="sb-agent-input" rows="3" placeholder="Например: найди Filter Bar или собери платформу поручений…"></textarea>
              <div class="sb-agent-actions">
                <button type="button" class="sb-agent-mic" id="sb-agent-mic" title="Голосовой ввод" aria-label="Голосовой ввод">${icon('mic', 16)}</button>
                <span class="sb-agent-actions-spacer"></span>
                <button type="button" class="sb-agent-send" id="sb-agent-send" aria-label="Отправить">${icon('arrow-right', 16)}</button>
              </div>
            </div>
          </section>

          <section class="sb-agent-col is-preview" aria-label="Превью">
            <div class="sb-agent-col-h">
              <h3>Превью</h3>
              <div class="sb-agent-screens" id="sb-agent-screens"></div>
              <button type="button" class="btn btn-ghost btn-s" id="sb-agent-refresh">Обновить</button>
            </div>
            <div class="sb-agent-preview-empty" id="sb-agent-preview-empty">
              <div class="sb-agent-empty-hero">
                <strong>Сборка на паузе</strong>
                <span>Проверьте LLM в ⚙</span>
              </div>
              <div class="sb-agent-empty-grid" id="sb-agent-empty-examples"></div>
            </div>
            <iframe class="sb-agent-preview-frame" id="sb-agent-preview" title="SB Agent preview" hidden></iframe>
          </section>
        </div>
      </div>
    `;

    const chatEl = wrap.querySelector('#sb-agent-chat');
    const inputEl = wrap.querySelector('#sb-agent-input');
    const sendBtn = wrap.querySelector('#sb-agent-send');
    const chipsEl = wrap.querySelector('#sb-agent-chips');
    const frame = wrap.querySelector('#sb-agent-preview');
    const emptyPrev = wrap.querySelector('#sb-agent-preview-empty');
    const sideEl = wrap.querySelector('#sb-agent-side');
    const screensEl = wrap.querySelector('#sb-agent-screens');
    const liveEl = wrap.querySelector('#sb-agent-live');
    const micBtn = wrap.querySelector('#sb-agent-mic');
    const settingsBtn = wrap.querySelector('#sb-agent-settings-btn');
    const settingsEl = wrap.querySelector('#sb-agent-settings');
    const chatsEl = wrap.querySelector('#sb-agent-chats');


    function persistActiveChat() {
      const chat = chatsStore.chats.find((c) => c.id === activeChatId);
      if (!chat) return;
      chat.project = project;
      chat.session = session;
      chat.messages = chatLog.map((m) => ({ role: m.role, text: m.text, meta: m.meta || null }));
      chat.updatedAt = Date.now();
      if ((!chat.title || chat.title === 'Новый чат')) {
        const firstUser = chatLog.find((m) => m.role === 'user');
        if (firstUser && firstUser.text) {
          chat.title = String(firstUser.text).replace(/\s+/g, ' ').trim().slice(0, 32);
        } else if (project.title && project.title !== 'Новый проект') {
          chat.title = String(project.title).slice(0, 32);
        }
      }
      chatsStore.activeId = activeChatId;
      try {
        localStorage.setItem(CHATS_KEY, JSON.stringify(chatsStore));
      } catch (e) {}
      SbAgent.saveProject(project);
      SbAgent.saveSession(session);
    }

    function renderChatTabs() {
      const list = [...chatsStore.chats].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      chatsEl.innerHTML = list.map((c) => {
        const active = c.id === activeChatId ? ' is-active' : '';
        const title = (c.title || 'Новый чат').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        return `<button type="button" class="sb-agent-chat-tab${active}" role="tab" aria-selected="${c.id === activeChatId}" data-chat="${c.id}" title="${title}">
          <span class="sb-agent-chat-tab-title">${title}</span>
          <span class="sb-agent-chat-tab-x" data-del="${c.id}" title="Удалить">×</span>
        </button>`;
      }).join('');
      chatsEl.querySelectorAll('[data-chat]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if (e.target && e.target.dataset && e.target.dataset.del) return;
          switchChat(btn.dataset.chat);
        });
      });
      chatsEl.querySelectorAll('[data-del]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteChat(btn.dataset.del);
        });
      });
    }

    function paintMessages(messages) {
      chatEl.innerHTML = '';
      chatLog.length = 0;
      (messages || []).forEach((m) => {
        pushChat(m.role, m.text, m.meta || null);
      });
    }

    function applyChat(chat, opts) {
      activeChatId = chat.id;
      activeChat = chat;
      chatsStore.activeId = chat.id;
      project = chat.project ? { ...SbAgent.emptyProject(), ...chat.project } : SbAgent.emptyProject();
      session = chat.session ? { ...SbAgent.emptySession(), ...chat.session } : SbAgent.emptySession();
      SbAgent.sanitizeProjectComponents(project);
      paintMessages(chat.messages || []);
      if (!(chat.messages && chat.messages.length) && !(opts && opts.skipWelcome)) {
        pushChat('assistant',
          '**Новый чат.** Справа — примеры экранов, или напишите запрос / выберите чип.');
      }
      setChips();
      renderEmptyExamples();
      renderSide();
      renderScreens();
      renderPreview();
      renderChatTabs();
      persistActiveChat();
    }

    function switchChat(id) {
      if (busy || !id || id === activeChatId) return;
      persistActiveChat();
      const chat = chatsStore.chats.find((c) => c.id === id);
      if (!chat) return;
      applyChat(chat, { skipWelcome: true });
      if (!(chat.messages && chat.messages.length)) {
        pushChat('assistant',
          '**Привет!** Нажмите пример справа или напишите запрос.');
        persistActiveChat();
        renderChatTabs();
      }
    }

    function createNewChat() {
      if (busy) return;
      persistActiveChat();
      const chat = makeChat();
      chatsStore.chats.unshift(chat);
      applyChat(chat);
      if (typeof showSiteToast === 'function') showSiteToast('Новый чат');
    }

    function deleteChat(id) {
      if (busy) return;
      if (chatsStore.chats.length <= 1) {
        // reset the only chat
        const chat = chatsStore.chats[0];
        chat.title = 'Новый чат';
        chat.project = SbAgent.emptyProject();
        chat.session = SbAgent.emptySession();
        chat.messages = [];
        chat.updatedAt = Date.now();
        applyChat(chat);
        return;
      }
      chatsStore.chats = chatsStore.chats.filter((c) => c.id !== id);
      const next = chatsStore.chats.find((c) => c.id === activeChatId) || chatsStore.chats[0];
      applyChat(next, { skipWelcome: true });
      if (!(next.messages && next.messages.length)) {
        pushChat('assistant', '**Чат удалён.** Открыт другой — можете продолжить здесь.');
        persistActiveChat();
        renderChatTabs();
      }
    }


    function formatMsgHtml(text) {
      return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }

    function setLiveStatus(mode) {
      if (!liveEl) return;
      if (mode === 'busy') {
        liveEl.innerHTML = '<i></i> Думаю…';
        liveEl.classList.add('is-busy');
        return;
      }
      liveEl.classList.remove('is-busy');
      liveEl.innerHTML = '<i></i> Онлайн · Design System';
    }

    function stopThinking() {
      if (thinkTimer) {
        clearInterval(thinkTimer);
        thinkTimer = null;
      }
      const row = chatEl.querySelector('.sb-agent-thinking');
      if (row) row.remove();
      setLiveStatus('idle');
    }

    function startThinking() {
      stopThinking();
      setLiveStatus('busy');
      thinkIdx = 0;
      const row = document.createElement('div');
      row.className = 'sb-agent-thinking';
      row.innerHTML = '<span class="sb-agent-spinner"></span><span data-think>' + THINK[0] + '</span>';
      chatEl.appendChild(row);
      chatEl.scrollTop = chatEl.scrollHeight;
      thinkTimer = setInterval(() => {
        thinkIdx = (thinkIdx + 1) % THINK.length;
        const el = row.querySelector('[data-think]');
        if (el) el.textContent = THINK[thinkIdx];
      }, 900);
    }

    function downloadText(filename, content, mime) {
      const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }

    function slugName() {
      return String(project.title || project.name || 'sb-project')
        .toLowerCase()
        .replace(/[^a-zа-яё0-9]+/gi, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40) || 'sb-project';
    }

    function pushChat(role, text, meta) {
      chatLog.push({ role, text, meta });
      const row = document.createElement('div');
      row.className = `sb-agent-msg-row is-${role}`;
      const bubble = document.createElement('div');
      bubble.className = `sb-agent-msg is-${role}`;
      bubble.innerHTML = formatMsgHtml(text);
      if (meta && meta.tools && meta.tools.length) {
        const tools = document.createElement('div');
        tools.className = 'sb-agent-tools';
        tools.textContent = 'Сделано · ' + meta.tools.length + ' раг' + (meta.tools.length === 1 ? '' : 'а');
        bubble.appendChild(tools);
      }
      if (role === 'assistant') {
        row.innerHTML = '<div class="sb-agent-avatar is-sm" aria-hidden="true">AI</div>';
        row.appendChild(bubble);
      } else if (role === 'user') {
        row.appendChild(bubble);
        row.insertAdjacentHTML('beforeend', '<div class="sb-agent-avatar is-sm is-user" aria-hidden="true">Я</div>');
      } else {
        row.appendChild(bubble);
      }
      chatEl.appendChild(row);
      chatEl.scrollTop = chatEl.scrollHeight;
      return bubble;
    }

    function pushPlanCard(plan) {
      const div = document.createElement('div');
      div.className = 'sb-agent-msg is-plan';
      const steps = plan.steps || [];
      const friendly = {
        search_components: 'Ищу в каталоге SB',
        apply_scenario: 'Собираю сценарий',
        build_from_intent: 'Собираю экран',
        build_from_tz: 'Собираю интерфейс',
        analyze_tz: 'Разбираю запрос',
        rag_search: 'Ищу в RAG',
        ground_in_sb: 'Привязываю к SB',
        assert_sb_compliance: 'Проверяю политику',
        recall_sb_policy: 'Сверяю правила SB',
        remember_brief: 'Фиксирую бриф',
        compose_preview: 'Обновляю превью',
        set_stack: 'Меняю стек',
        set_theme: 'Меняю тему',
        set_density: 'Меняю плотность',
        set_title: 'Обновляю название',
        set_active_screen: 'Переключаю экран',
        get_readiness: 'Сверяю готовность',
        check_readiness: 'Сверяю готовность',
        add_component: 'Добавляю компонент',
        export_handoff: 'Готовлю передачу',
      };
      div.innerHTML = `
        <div class="sb-agent-plan-head">
          <span class="sb-agent-plan-badge">План</span>
          <strong>${formatMsgHtml(plan.summary || 'Делаю по запросу')}</strong>
        </div>
        <ol class="sb-agent-think-list sb-agent-plan-list"></ol>
      `;
      const list = div.querySelector('ol');
      steps.forEach((s) => {
        const li = document.createElement('li');
        li.className = 'is-pending';
        li.dataset.tool = s.tool;
        li.innerHTML = `<span class="sb-agent-think-tool">${friendly[s.tool] || s.tool}</span> <span class="sb-agent-think-detail">${s.why || ''}</span>`;
        list.appendChild(li);
      });
      if (!steps.length) {
        const li = document.createElement('li');
        li.className = 'is-done';
        li.textContent = plan.clarify ? 'Нужно утоцнение' : 'Отвецаю без изменений превью';
        list.appendChild(li);
      }
      const row = document.createElement('div');
      row.className = 'sb-agent-msg-row is-assistant';
      row.innerHTML = '<div class="sb-agent-avatar is-sm" aria-hidden="true">AI</div>';
      row.appendChild(div);
      chatEl.appendChild(row);
      chatEl.scrollTop = chatEl.scrollHeight;
      return div;
    }

    function markPlanStep(planEl, index, observe) {
      if (!planEl) return;
      const items = [...planEl.querySelectorAll('li')];
      const li = items[index];
      if (!li) return;
      li.classList.remove('is-pending');
      li.classList.add('is-done');
      if (observe) {
        const detail = li.querySelector('.sb-agent-think-detail');
        if (detail) detail.textContent = (detail.textContent ? detail.textContent + ' · ' : '') + observe;
      }
    }

    function finishPlanCard(planEl) {
      if (!planEl) return;
      const head = planEl.querySelector('.sb-agent-plan-head strong');
      if (head) head.textContent = (head.textContent || '') + ' · готово';
      planEl.classList.add('is-done');
    }

    function doHandoff() {
      const pack = SbAgent.exportHandoff(project, session);
      if (pack.blocked) {
        pushChat('assistant',
          '**Handoff заблокирован** (SB gate):\n' +
          (pack.reasons || []).map((r) => '• ' + r).join('\n'));
        if (typeof showSiteToast === 'function') showSiteToast('Handoff blocked');
        return;
      }
      downloadText(slugName() + '-spec.md', pack.spec, 'text/markdown;charset=utf-8');
      setTimeout(() => {
        downloadText(slugName() + '.html', pack.html, 'text/html;charset=utf-8');
      }, 200);
      pushChat('assistant',
        'Пакет **передан в разработку**: Spec.md + HTML.\n' +
        'SB compliance OK · компоненты: ' + pack.componentMap.join(', '));
      if (typeof showSiteToast === 'function') showSiteToast('Handoff ✓');
    }

    function runGoldenEval() {
      if (!window.SbAgentEval) {
        pushChat('assistant', 'Eval-модуль не загружен.');
        return;
      }
      const report = SbAgentEval.runEval();
      const lines = report.results.map((r) =>
        `${r.ok ? '✓' : '✗'} **${r.id}**` + (r.ok ? '' : ' — ' + (r.failures || []).join('; '))
      );
      pushChat('assistant',
        `**Golden eval:** ${report.summary}\n\n` + lines.join('\n') +
        (report.ok ? '\n\nКонтур SB соблюдён на всех брифах.' : '\n\nИсправьте failing cases перед LLM.'));
      if (typeof showSiteToast === 'function') showSiteToast(report.summary);
    }


    function renderScreens() {
      const screens = project.screens || [];
      if (!screens.length) {
        screensEl.innerHTML = '';
        return;
      }
      screensEl.innerHTML = screens.map((s) =>
        `<button type="button" class="sb-agent-screen-tab${project.activeScreen === s.id ? ' is-active' : ''}" data-screen="${s.id}">${s.label}</button>`
      ).join('');
      screensEl.querySelectorAll('[data-screen]').forEach((btn) => {
        btn.addEventListener('click', () => {
          project = SbAgent.setActiveScreen(project, btn.dataset.screen);
          SbAgent.saveProject(project);
          renderSide();
          renderScreens();
          renderPreview();
          if (typeof showSiteToast === 'function') showSiteToast('Экран: ' + btn.textContent);
        });
      });
    }

    function renderSide() {
      const tpl = project.templateId ? SbAgent.getTemplate(project.templateId) : null;
      const comps = project.components || [];
      const screens = project.screens || [];
      const r = SbAgent.getReadiness(project);
      const themeLabel = project.theme === 'dark' ? 'Тёмная' : 'Светлая';
      const densityLabel = project.density === 'compact' ? 'компакт' : 'std';
      const metaBits = [
        tpl ? tpl.label : null,
        comps.length ? comps.length + ' комп.' : null,
        screens.length > 1 ? screens.length + ' экрана' : null,
        themeLabel + ' · ' + densityLabel,
      ].filter(Boolean);

      sideEl.innerHTML = `
        <div class="sb-agent-bar-identity">
          <span class="sb-agent-status ${r.ready ? 'is-ready' : ''}" title="Готовность ${r.pct}%">${r.ready ? 'Ready' : 'Draft'}</span>
          <div class="sb-agent-bar-text">
            <div class="sb-agent-bar-title" title="${(project.title || '').replace(/"/g, '&quot;')}">${project.title || 'Новый проект'}</div>
            <div class="sb-agent-bar-meta" title="${(project.goal || '').replace(/"/g, '&quot;')}">${metaBits.join(' · ')}</div>
          </div>
        </div>
        <div class="sb-agent-bar-controls">
          <div class="sb-choice-group view-primary form-default size-xs" data-choice-group data-single role="group" aria-label="Стек">
            ${['react', 'vue', 'html'].map(s =>
              `<label class="sb-choice-item${project.stack === s ? ' is-selected' : ''}" data-stack="${s}">
                <input type="radio" name="sb-agent-stack" value="${s}"${project.stack === s ? ' checked' : ''} />
                <span>${s === 'react' ? 'React' : s === 'vue' ? 'Vue' : 'HTML'}</span>
              </label>`
            ).join('')}
          </div>
        </div>
        <div class="sb-agent-bar-actions">
          <button type="button" class="btn btn-primary btn-s" id="sb-agent-handoff" title="Spec + HTML">${icon('download', 14)} В разработку</button>
          <button type="button" class="btn btn-ghost btn-s" id="sb-agent-export-html" title="Только HTML">HTML</button>
          <div class="sb-agent-bar-more">
            <button type="button" class="btn btn-ghost btn-s sb-agent-more-btn" id="sb-agent-more" aria-expanded="false" aria-haspopup="true" title="Ещё">⋯</button>
            <div class="sb-agent-menu" id="sb-agent-menu" hidden>
              <button type="button" id="sb-agent-export-prompt">Скачать Spec.md</button>
              <button type="button" id="sb-agent-copy-prompt">Копировать промпт</button>
              <button type="button" id="sb-agent-theme-toggle">${project.theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</button>
              <button type="button" id="sb-agent-density-toggle">${project.density === 'compact' ? 'Стандартная плотность' : 'Компактнее'}</button>
              <button type="button" id="sb-agent-eval">Прогнать Eval</button>
              <hr />
              <button type="button" id="sb-agent-reset" class="is-danger">Очистить превью</button>
            </div>
          </div>
        </div>
      `;

      sideEl.querySelectorAll('[data-stack]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const stack = btn.dataset.stack;
          if (!stack || stack === project.stack) return;
          const out = SbAgent.executeStep(project, session, { tool: 'set_stack', args: { stack }, why: 'UI' });
          project = out.project;
          session = out.session;
          SbAgent.saveProject(project);
          renderSide();
          if (typeof showSiteToast === 'function') showSiteToast('Стек: ' + project.stack);
        });
      });

      const moreBtn = sideEl.querySelector('#sb-agent-more');
      const menu = sideEl.querySelector('#sb-agent-menu');
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = menu.hidden;
        menu.hidden = !open;
        moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      const closeMenu = () => {
        menu.hidden = true;
        moreBtn.setAttribute('aria-expanded', 'false');
      };
      document.addEventListener('click', closeMenu, { once: true });

      sideEl.querySelector('#sb-agent-handoff').addEventListener('click', doHandoff);
      sideEl.querySelector('#sb-agent-export-prompt').addEventListener('click', () => {
        downloadText(slugName() + '-spec.md', SbAgent.exportPrompt(project), 'text/markdown;charset=utf-8');
        closeMenu();
        if (typeof showSiteToast === 'function') showSiteToast('Скачан Spec .md');
      });
      sideEl.querySelector('#sb-agent-export-html').addEventListener('click', () => {
        downloadText(slugName() + '.html', SbAgent.buildPreviewDocument(project), 'text/html;charset=utf-8');
        if (typeof showSiteToast === 'function') showSiteToast('Скачан HTML');
      });
      sideEl.querySelector('#sb-agent-copy-prompt').addEventListener('click', () => {
        fallbackClipboardCopy(SbAgent.exportPrompt(project));
        closeMenu();
        if (typeof showSiteToast === 'function') showSiteToast('Промпт скопирован ✓');
      });
      sideEl.querySelector('#sb-agent-theme-toggle').addEventListener('click', () => {
        const out = SbAgent.executeStep(project, session, {
          tool: 'set_theme',
          args: { theme: project.theme === 'dark' ? 'light' : 'dark' },
          why: 'UI',
        });
        project = out.project;
        session = out.session;
        SbAgent.saveProject(project);
        closeMenu();
        renderSide();
        renderPreview();
      });
      sideEl.querySelector('#sb-agent-density-toggle').addEventListener('click', () => {
        const out = SbAgent.executeStep(project, session, {
          tool: 'set_density',
          args: { density: project.density === 'compact' ? 'default' : 'compact' },
          why: 'UI',
        });
        project = out.project;
        session = out.session;
        SbAgent.saveProject(project);
        closeMenu();
        renderSide();
        renderPreview();
      });
      const evalBtn = sideEl.querySelector('#sb-agent-eval');
      if (evalBtn) {
        evalBtn.addEventListener('click', () => {
          closeMenu();
          runGoldenEval();
        });
      }
      sideEl.querySelector('#sb-agent-reset').addEventListener('click', () => {
        project = SbAgent.emptyProject();
        session = SbAgent.emptySession();
        SbAgent.saveProject(project);
        SbAgent.saveSession(session);
        chatEl.innerHTML = '';
        pushChat('assistant',
          'Превью очищено.\n\nСправа снова примеры — нажмите карточку, и я соберу экран.');
        closeMenu();
        setChips();
        renderEmptyExamples();
        renderSide();
        renderScreens();
        renderPreview();
      });
    }

    function renderPreview() {
      if (!project.templateId && !project.html) {
        frame.hidden = true;
        emptyPrev.hidden = false;
        return;
      }
      emptyPrev.hidden = true;
      frame.hidden = false;
      const action = pendingPreviewAction;
      frame.onload = () => {
        if (!action) return;
        pendingPreviewAction = null;
        try {
          const api = frame.contentWindow && frame.contentWindow.__SB_ASSIGN_API__;
          if (!api) return;
          if (action.type === 'open' && action.taskId) api.openTask(action.taskId);
          if (action.type === 'ai' && action.prompt) api.runAi(action.prompt);
        } catch (e) {}
      };
      frame.srcdoc = SbAgent.buildPreviewDocument(project);
    }

    function switchPreviewScreen(next) {
      if (!(project.screens || []).some((s) => s.id === next)) return false;
      if (project.activeScreen === next) return true;
      project = SbAgent.setActiveScreen(project, next);
      SbAgent.saveProject(project);
      persistActiveChat();
      renderScreens();
      renderSide();
      renderPreview();
      return true;
    }

    function runInPreview(action) {
      pendingPreviewAction = action;
      try {
        const api = frame.contentWindow && frame.contentWindow.__SB_ASSIGN_API__;
        if (api && project.activeScreen === 'board' && !frame.hidden) {
          if (action.type === 'open' && action.taskId) api.openTask(action.taskId);
          if (action.type === 'ai' && action.prompt) api.runAi(action.prompt);
          pendingPreviewAction = null;
          return;
        }
      } catch (err) {}
      if (project.activeScreen !== 'board') switchPreviewScreen('board');
      else renderPreview();
    }

    window.addEventListener('message', (e) => {
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'sb-agent-screen' && d.screenId) {
        const next = d.screenId === 'admin' ? 'admin' : d.screenId === 'board' ? 'board' : d.screenId;
        switchPreviewScreen(next);
        return;
      }
      if (d.type === 'sb-agent-open-task' && d.taskId) {
        runInPreview({ type: 'open', taskId: d.taskId });
        return;
      }
      if (d.type === 'sb-agent-ai' && d.prompt) {
        runInPreview({ type: 'ai', prompt: d.prompt });
      }
    });

    function runPrompt(text) {
      if (busy || !text) return;
      inputEl.value = text;
      send();
    }

    function renderEmptyExamples() {
      const grid = emptyPrev.querySelector('#sb-agent-empty-examples');
      if (!grid) return;
      const list = (SbAgent.SCENARIOS || []).slice(0, 5);
      grid.innerHTML = list.map((s) => {
        const screens = (s.screens || []).map((x) => x.label).join(' · ');
        return `
          <button type="button" class="sb-agent-example">
            <span class="sb-agent-example-title">${s.label}</span>
            <span class="sb-agent-example-blurb">${s.blurb || s.goal || ''}</span>
            <span class="sb-agent-example-meta">${screens}</span>
            <span class="sb-agent-example-cta">Проверить →</span>
          </button>`;
      }).join('');
      const buttons = grid.querySelectorAll('.sb-agent-example');
      buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          const s = list[i];
          runPrompt('Собери ' + ((s && (s.chip || s.label)) || btn.textContent));
        });
      });
    }

    function setChips(list) {
      const defaults = [
        'Платформа поручений',
        'Дашборд KPI',
        'Найди Filter Bar',
        'Проверь compliance',
      ];
      const items = list && list.length ? list : defaults;
      chipsEl.innerHTML = items.map(t => `<button type="button" class="sb-agent-chip" data-chip="${t.replace(/"/g, '')}">${t}</button>`).join('');
      chipsEl.querySelectorAll('[data-chip]').forEach(btn => {
        btn.addEventListener('click', () => runPrompt(btn.dataset.chip));
      });
    }

    function renderSettingsPanel() {
      if (!settingsEl) return;
      const cfg = SbAgent.getPlannerConfig();
      settingsEl.innerHTML = `
        <div class="sb-agent-settings-head">
          <strong>RAG · LLM · планировщик</strong>
          <span>Без endpoint работает rule + локальный RAG</span>
        </div>
        <label class="sb-agent-settings-row">
          <span>Режим</span>
          <select id="sb-cfg-mode">
            <option value="rule"${cfg.mode !== 'llm' ? ' selected' : ''}>Rule + RAG</option>
            <option value="llm"${cfg.mode === 'llm' ? ' selected' : ''}>LLM planner</option>
          </select>
        </label>
        <label class="sb-agent-settings-row">
          <span>Endpoint</span>
          <input type="url" id="sb-cfg-endpoint" placeholder="https://…/plan" value="${(cfg.endpoint || '').replace(/"/g, '&quot;')}" />
        </label>
        <label class="sb-agent-settings-row">
          <span>API key</span>
          <input type="password" id="sb-cfg-key" placeholder="optional" value="${(cfg.apiKey || '').replace(/"/g, '&quot;')}" autocomplete="off" />
        </label>
        <label class="sb-agent-settings-row">
          <span>Model</span>
          <input type="text" id="sb-cfg-model" placeholder="gpt-4.1-mini…" value="${(cfg.model || '').replace(/"/g, '&quot;')}" />
        </label>
        <label class="sb-agent-settings-check">
          <input type="checkbox" id="sb-cfg-rag"${cfg.ragEnabled !== false ? ' checked' : ''} />
          <span>Подмешивать RAG-контекст в план</span>
        </label>
        <div class="sb-agent-settings-actions">
          <button type="button" class="btn btn-primary btn-s" id="sb-cfg-save">Сохранить</button>
          <button type="button" class="btn btn-ghost btn-s" id="sb-cfg-close">Закрыть</button>
        </div>
      `;
      settingsEl.querySelector('#sb-cfg-save').addEventListener('click', () => {
        SbAgent.setPlannerConfig({
          mode: settingsEl.querySelector('#sb-cfg-mode').value,
          endpoint: settingsEl.querySelector('#sb-cfg-endpoint').value.trim(),
          apiKey: settingsEl.querySelector('#sb-cfg-key').value.trim(),
          model: settingsEl.querySelector('#sb-cfg-model').value.trim(),
          ragEnabled: settingsEl.querySelector('#sb-cfg-rag').checked,
        });
        if (typeof showSiteToast === 'function') showSiteToast('Настройки агента сохранены');
        toggleSettings(false);
      });
      settingsEl.querySelector('#sb-cfg-close').addEventListener('click', () => toggleSettings(false));
    }

    function toggleSettings(force) {
      settingsOpen = typeof force === 'boolean' ? force : !settingsOpen;
      if (!settingsEl || !settingsBtn) return;
      settingsEl.hidden = !settingsOpen;
      settingsBtn.setAttribute('aria-expanded', settingsOpen ? 'true' : 'false');
      settingsBtn.classList.toggle('is-active', settingsOpen);
      if (settingsOpen) renderSettingsPanel();
    }

    function finishTurn(plan, lastExtra) {
      stopThinking();
      const reply = SbAgent.buildReply(plan, project, session, lastExtra);
      pushChat('assistant', reply, { tools: (plan.steps || []).map((s) => s.tool) });
      if (plan.suggestions) setChips(plan.suggestions);
      else setChips();
      SbAgent.saveProject(project);
      SbAgent.saveSession(session);
      persistActiveChat();
      renderChatTabs();
      renderSide();
      renderScreens();
      if (plan.preview || plan.kind === 'build' || project.templateId) renderPreview();
      busy = false;
      sendBtn.disabled = false;
      if (micBtn) micBtn.disabled = false;
      inputEl.disabled = false;
      inputEl.focus();
    }

    function executePlan(plan, planEl) {
      if (!plan.steps || !plan.steps.length) {
        setTimeout(() => {
          finishPlanCard(planEl);
          finishTurn(plan, null);
        }, 220);
        return;
      }
      let i = 0;
      let lastExtra = null;
      function runNext() {
        if (i >= plan.steps.length) {
          finishPlanCard(planEl);
          finishTurn(plan, lastExtra);
          return;
        }
        const step = plan.steps[i];
        const out = SbAgent.executeStep(project, session, step);
        project = out.project;
        session = out.session;
        lastExtra = out.extra;
        markPlanStep(planEl, i, out.observe);
        i += 1;
        if (step.tool === 'compose_preview' || step.tool === 'apply_scenario' || step.tool === 'build_from_intent' || step.tool === 'build_from_tz' || step.tool === 'analyze_tz' || step.tool === 'set_theme' || step.tool === 'set_density' || step.tool === 'set_active_screen' || step.tool === 'set_title' || step.tool === 'ground_in_sb' || step.tool === 'assert_sb_compliance') {
          renderScreens();
          renderPreview();
          renderSide();
        }
        setTimeout(runNext, 240 + Math.random() * 160);
      }
      setTimeout(runNext, 180);
    }

    function send() {
      const text = (inputEl.value || '').trim();
      if (!text || busy) return;
      inputEl.value = '';
      pushChat('user', text);
      busy = true;
      sendBtn.disabled = true;
      if (micBtn) micBtn.disabled = true;
      inputEl.disabled = true;
      startThinking();

      session = { ...session, turns: (session.turns || 0) + 1 };

      const start = (plan) => {
        stopThinking();
        startThinking();
        if (plan._llmError) {
          pushChat('system', 'Переклюцился на локальные правила: ' + plan._llmError);
        }
        session.lastPlanId = plan.id;
        session.planner = plan.planner;
        const planEl = pushPlanCard(plan);
        executePlan(plan, planEl);
      };

      if (typeof SbAgent.planTurnAsync === 'function') {
        SbAgent.planTurnAsync(project, session, text).then(start).catch((err) => {
          stopThinking();
          pushChat('assistant', 'Не удалось обработать запрос: ' + (err && err.message ? err.message : err));
          busy = false;
          sendBtn.disabled = false;
          if (micBtn) micBtn.disabled = false;
          inputEl.disabled = false;
        });
      } else {
        start(SbAgent.planTurn(project, session, text));
      }
    }

    function toggleVoice() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        alert('Голосовой ввод поддерживается в Chrome.');
        return;
      }
      if (!recognition) {
        recognition = new SR();
        recognition.lang = 'ru-RU';
        recognition.interimResults = false;
        recognition.continuous = false;
        recognition.onresult = (event) => {
          const text = (event.results[0] && event.results[0][0] && event.results[0][0].transcript) || '';
          voiceListening = false;
          syncMicUi();
          if (text.trim()) {
            inputEl.value = text.trim();
            send();
          }
        };
        recognition.onerror = () => {
          voiceListening = false;
          syncMicUi();
        };
        recognition.onend = () => {
          voiceListening = false;
          syncMicUi();
        };
      }
      if (voiceListening) {
        try { recognition.stop(); } catch (e) {}
        voiceListening = false;
        syncMicUi();
        return;
      }
      if (busy) return;
      try {
        recognition.start();
        voiceListening = true;
        syncMicUi();
      } catch (e) {
        voiceListening = false;
        syncMicUi();
      }
    }

    function syncMicUi() {
      if (!micBtn) return;
      micBtn.classList.toggle('is-listening', voiceListening);
      micBtn.innerHTML = icon(voiceListening ? 'mic-off' : 'mic', 16);
      micBtn.title = voiceListening ? 'Остановить' : 'Голосовой ввод';
    }

    sendBtn.addEventListener('click', send);
    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
    micBtn.addEventListener('click', toggleVoice);
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => toggleSettings());
    }
    wrap.querySelector('#sb-agent-new-chat').addEventListener('click', createNewChat);
    wrap.querySelector('#sb-agent-clear').addEventListener('click', () => {
      if (busy) return;
      chatEl.innerHTML = '';
      chatLog.length = 0;
      pushChat('assistant',
        '**Чат очищен.** Найду компонент, соберу экран или проверю compliance — напишите запрос или выберите чип.');
      setChips();
      persistActiveChat();
      renderChatTabs();
    });
    wrap.querySelector('#sb-agent-refresh').addEventListener('click', () => {
      renderPreview();
      if (typeof showSiteToast === 'function') showSiteToast('Превью обновлено');
    });

    // Boot chats
    const bootMsgs = (activeChat.messages || []).slice();
    if (bootMsgs.length) {
      paintMessages(bootMsgs);
    } else {
      pushChat('assistant',
        '**Привет!** Я AI-ассистент **SB Design System**.\n\n' +
        'Сборка превью пока на паузе — сначала проверьте подключение **LLM** в **⚙** ' +
        '(режим LLM planner и Endpoint).\n\n' +
        'Поиск по каталогу и compliance по-прежнему доступны.');
    }
    setChips();
    renderEmptyExamples();
    renderSide();
    renderScreens();
    renderPreview();
    renderChatTabs();
    persistActiveChat();

    return wrap;
  }
});

// All Components page
pages.push({
  id: 'all-components',
  group: 'main',
  iconId: 'file-text',
  label: 'All Components',
  title: 'Все компоненты',
  subtitle: 'Полный каталог с фильтрами по категории, статусу и интерактивности.',
  build: () => {
    const wrap = document.createElement('div');
    const liveCount = uniqueComponentsList.filter(isComponentLive).length;
    const stableCount = uniqueComponentsList.filter(c => getComponentStatus(c) === 'stable').length;
    const betaCount = uniqueComponentsList.filter(c => getComponentStatus(c) === 'beta').length;
    const plannedCount = uniqueComponentsList.filter(c => getComponentStatus(c) === 'planned').length;
    const aiCount = uniqueComponentsList.filter(c => c.aiPrompt).length;

    wrap.innerHTML = `
      <div class="catalog-toolbar">
        <input type="search" class="form-input catalog-search" id="catalog-search" placeholder="Поиск по названию..." autocomplete="off" />

        <div class="catalog-filter-group">
          <span class="catalog-filter-label">Категория</span>
          <div class="catalog-filter-row" id="all-components-cat-filters">
            <button class="btn btn-primary btn-s all-filter-btn active-filter" data-filter="all">Все (${uniqueComponentsList.length})</button>
            ${categoryOrder.map(cat => {
              const keys = [cat.key, ...(cat.extraKeys || [])];
              const count = uniqueComponentsList.filter(c => keys.includes(c.category)).length;
              return `<button class="btn btn-secondary btn-s all-filter-btn" data-filter="${cat.key}">${cat.label} (${count})</button>`;
            }).join('')}
          </div>
        </div>

        <div class="catalog-filter-group">
          <span class="catalog-filter-label">Показать</span>
          <div class="catalog-filter-row" id="all-components-meta-filters">
            <button class="btn btn-primary btn-s all-meta-btn active-filter" data-meta="all">Все</button>
            <button class="btn btn-secondary btn-s all-meta-btn" data-meta="live">Live (${liveCount})</button>
            <button class="btn btn-secondary btn-s all-meta-btn" data-meta="stable">Stable (${stableCount})</button>
            <button class="btn btn-secondary btn-s all-meta-btn" data-meta="beta">Beta (${betaCount})</button>
            <button class="btn btn-secondary btn-s all-meta-btn" data-meta="planned">Planned (${plannedCount})</button>
            <button class="btn btn-secondary btn-s all-meta-btn" data-meta="ai">AI Prompt (${aiCount})</button>
          </div>
        </div>
      </div>

      <div style="overflow-x:auto">
        <table class="data-table" id="all-components-table" style="width:100%">
          <thead>
            <tr>
              <th style="width:40px">#</th>
              <th>Component</th>
              <th>Category</th>
              <th style="width:90px">Live</th>
              <th style="width:90px">AI Prompt</th>
              <th style="width:90px">Status</th>
            </tr>
          </thead>
          <tbody id="all-components-tbody">
            ${uniqueComponentsList.map((comp, i) => {
              const cat = categoryOrder.find(c => [c.key, ...(c.extraKeys || [])].includes(comp.category));
              const catLabel = cat ? cat.label : comp.category;
              const catKey = cat ? cat.key : '';
              const live = isComponentLive(comp);
              const hasAi = !!comp.aiPrompt;
              const status = getComponentStatus(comp);
              const statusClass = STATUS_CLASS[status] || 'tag-neutral';
              return `<tr data-cat="${catKey}" data-status="${status}" data-live="${live ? '1' : '0'}" data-ai="${hasAi ? '1' : '0'}" data-comp-name="${comp.name.toLowerCase()}" style="cursor:pointer">
                <td style="color:var(--text-secondary);font-size:12px">${i + 1}</td>
                <td><strong>${comp.name}</strong></td>
                <td>${catLabel}</td>
                <td>${live ? '<span class="tag tag-success">live</span>' : '—'}</td>
                <td>${hasAi ? '<span class="tag tag-neutral">yes</span>' : '—'}</td>
                <td><span class="tag ${statusClass}">${status}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="catalog-stats" id="all-components-stats">
        <span>Показано: <strong data-stat-visible>${uniqueComponentsList.length}</strong> из <strong>${uniqueComponentsList.length}</strong></span>
        <span>Live: <strong>${liveCount}</strong></span>
        <span>Stable: <strong>${stableCount}</strong></span>
        <span>Beta: <strong>${betaCount}</strong></span>
        <span>Planned: <strong>${plannedCount}</strong></span>
      </div>
    `;

    requestAnimationFrame(() => {
      const catFilters = wrap.querySelector('#all-components-cat-filters');
      const metaFilters = wrap.querySelector('#all-components-meta-filters');
      const tbody = wrap.querySelector('#all-components-tbody');
      const search = wrap.querySelector('#catalog-search');
      const visibleStat = wrap.querySelector('[data-stat-visible]');
      if (!tbody) return;

      let catFilter = 'all';
      let metaFilter = 'all';
      let searchQuery = '';

      function setActiveBtn(group, btn) {
        group.querySelectorAll('button').forEach(b => {
          b.classList.remove('active-filter');
          b.classList.replace('btn-primary', 'btn-secondary');
        });
        btn.classList.add('active-filter');
        btn.classList.replace('btn-secondary', 'btn-primary');
      }

      function applyFilters() {
        let visible = 0;
        tbody.querySelectorAll('tr').forEach(tr => {
          const catOk = catFilter === 'all' || tr.dataset.cat === catFilter;
          const metaOk = metaFilter === 'all'
            || (metaFilter === 'live' && tr.dataset.live === '1')
            || (metaFilter === 'stable' && tr.dataset.status === 'stable')
            || (metaFilter === 'beta' && tr.dataset.status === 'beta')
            || (metaFilter === 'planned' && tr.dataset.status === 'planned')
            || (metaFilter === 'ai' && tr.dataset.ai === '1');
          const searchOk = !searchQuery || tr.dataset.compName.includes(searchQuery);
          const show = catOk && metaOk && searchOk;
          tr.style.display = show ? '' : 'none';
          if (show) visible++;
        });
        if (visibleStat) visibleStat.textContent = visible;
      }

      catFilters?.addEventListener('click', e => {
        const btn = e.target.closest('.all-filter-btn');
        if (!btn) return;
        setActiveBtn(catFilters, btn);
        catFilter = btn.dataset.filter;
        applyFilters();
      });

      metaFilters?.addEventListener('click', e => {
        const btn = e.target.closest('.all-meta-btn');
        if (!btn) return;
        setActiveBtn(metaFilters, btn);
        metaFilter = btn.dataset.meta;
        applyFilters();
      });

      search?.addEventListener('input', () => {
        searchQuery = search.value.trim().toLowerCase();
        applyFilters();
      });

      tbody.addEventListener('click', e => {
        const tr = e.target.closest('tr[data-comp-name]');
        if (!tr) return;
        const name = tr.querySelector('strong')?.textContent;
        const comp = uniqueComponentsList.find(c => c.name === name);
        if (!comp) return;
        const pageId = componentPageIdFor(comp);
        navigateTo(pageId);
        setTimeout(() => {
          const el = document.getElementById(componentDomId(comp));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.classList.add('is-search-hit');
            setTimeout(() => el.classList.remove('is-search-hit'), 1800);
          }
        }, 150);
      });
    });

    return wrap;
  }
});

// Home page
pages.push({
  id: 'home',
  group: 'main',
  iconId: 'home',
  label: 'Обзор',
  title: 'SB design systems',
  subtitle: 'Статическая витрина корпоративной дизайн-системы SB — HTML / CSS / JS, без фреймворков и сборщиков.',
  build: () => {
    const wrap = document.createElement('div');
    const totalComponents = uniqueComponentsList.length;
    wrap.innerHTML = `
      <div class="overview-stats-grid">
        <div class="overview-stat-card">
          <div class="overview-stat-value">${totalComponents}</div>
          <div class="overview-stat-label">Компонентов</div>
        </div>
        <div class="overview-stat-card">
          <div class="overview-stat-value">${tokenGroups.length}</div>
          <div class="overview-stat-label">Групп токенов</div>
        </div>
        <div class="overview-stat-card">
          <div class="overview-stat-value">5</div>
          <div class="overview-stat-label">Категорий</div>
        </div>
        <div class="overview-stat-card">
          <div class="overview-stat-value is-accent">${KIT_VERSION}</div>
          <div class="overview-stat-label">Версия design systems</div>
        </div>
      </div>

      <h2 class="overview-section-title">Что внутри</h2>
      <div class="overview-info-card">
        Дизайн-система SB построена на простых vanilla-технологиях без npm и сборщиков.
        Все компоненты описаны как data-driven структуры и рендерятся церез <code class="overview-inline-code">&lt;template&gt;</code>.
        Выберите раздел в меню, цтобы увидеть токены или компоненты в работе.
      </div>

      <h2 class="overview-section-title overview-section-title--spaced">Быстрый доступ</h2>
      <div class="overview-links-grid">
        <a href="#icon-pack" class="quick-link overview-quick-link">
          <div class="overview-quick-icon">${icon('layers', 24)}</div>
          <div class="overview-quick-title">Пак иконок</div>
          <div class="overview-quick-meta">${typeof iconPack !== 'undefined' ? iconPack.length : '—'} иконок</div>
        </a>
        <a href="#tokens-overview" class="quick-link overview-quick-link">
          <div class="overview-quick-icon">${icon('folder', 24)}</div>
          <div class="overview-quick-title">Обзор токенов</div>
          <div class="overview-quick-meta">Все группы</div>
        </a>
        ${tokenGroups.map((g, i) => `
          <a href="#token-${i}" class="quick-link overview-quick-link">
            <div class="overview-quick-icon">${icon(tokenIconIds[i] || 'grid', 24)}</div>
            <div class="overview-quick-title">${g.title}</div>
            <div class="overview-quick-meta">${g.items.length} токенов</div>
          </a>
        `).join('')}
        ${categoryOrder.map(cat => {
          const keys = [cat.key, ...(cat.extraKeys || [])];
          const count = uniqueComponentsList.filter(c => keys.includes(c.category)).length;
          return `
            <a href="#cat-${cat.key.toLowerCase().replace(/\s/g,'-')}" class="quick-link overview-quick-link">
              <div class="overview-quick-icon">${icon(compIconIds[cat.key] || 'grid', 24)}</div>
              <div class="overview-quick-title">${cat.label}</div>
              <div class="overview-quick-meta">${count} компонентов</div>
            </a>
          `;
        }).join('')}
      </div>
    `;
    return wrap;
  }
});

// Tokens overview
pages.push({
  id: 'tokens-overview',
  group: 'tokens',
  iconId: 'folder',
  label: 'Обзор токенов',
  title: 'Обзор токенов',
  subtitle: 'Все группы дизайн-токенов SB design systems — хвета, типографика, отступы, гранихы, радиусы, тени, размеры и анимахия.',
  build: () => {
    const wrap = document.createElement('div');
    wrap.className = 'tokens-grid';
    tokenGroups.forEach(group => {
      wrap.appendChild(renderSingleTokenGroup(group));
    });
    return wrap;
  }
});

// Token pages (one per group)
tokenGroups.forEach((group, i) => {
  pages.push({
    id: `token-${i}`,
    group: 'tokens',
    iconId: tokenIconIds[i] || 'grid',
    label: group.title,
    title: group.title,
    subtitle: group.desc || `Группа токенов · ${group.items.length} элементов`,
    build: () => {
      const wrap = document.createElement('div');
      wrap.className = 'tokens-page';
      wrap.appendChild(renderSingleTokenGroup(group));
      return wrap;
    }
  });
});

// Component category pages
categoryOrder.forEach(cat => {
  const keys = [cat.key, ...(cat.extraKeys || [])];
  const items = uniqueComponentsList.filter(c => keys.includes(c.category));
  if (!items.length) return;
  pages.push({
    id: `cat-${cat.key.toLowerCase().replace(/\s/g,'-')}`,
    group: 'components',
    iconId: compIconIds[cat.key] || 'grid',
    label: cat.label,
    count: items.length,
    title: cat.label,
    subtitle: cat.desc,
    build: () => {
      const wrap = document.createElement('div');
      wrap.className = 'page-with-toc';

      const grid = document.createElement('div');
      grid.className = 'components-grid';
      items.forEach(c => grid.appendChild(renderSingleComponent(c)));
      wrap.appendChild(grid);

      // Table of Contents (scroll-spy)
      const toc = document.createElement('aside');
      toc.className = 'toc';
      toc.innerHTML = `
        <div class="toc-title">На странихе</div>
        ${items.map(c => `<button class="toc-link" data-toc-target="${componentDomId(c)}">${c.name}</button>`).join('')}
      `;
      wrap.appendChild(toc);

      // TOC interactivity
      requestAnimationFrame(() => {
        const links = toc.querySelectorAll('.toc-link');

        links.forEach(link => {
          link.addEventListener('click', () => {
            const el = document.getElementById(link.dataset.tocTarget);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });

        // Scroll-spy via IntersectionObserver
        const cards = items.map(c => document.getElementById(componentDomId(c))).filter(Boolean);
        if ('IntersectionObserver' in window && cards.length) {
          const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach(l => l.classList.toggle('active', l.dataset.tocTarget === id));
              }
            });
          }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
          cards.forEach(card => observer.observe(card));
        }
      });

      return wrap;
    }
  });
});

// Individual template pages are embedded in the templates page (see initTemplatePage)



