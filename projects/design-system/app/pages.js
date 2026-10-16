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
  subtitle: 'Компоненты, которые вы отметили сердечком.',
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
          <h3 style="margin:0 0 8px;font-size:18px;color:var(--text-main)">Пока ничего нет</h3>
          <p style="margin:0;color:var(--text-secondary);font-size:14px">Нажмите на ${icon('heart', 14)} в карточке компонента, чтобы добавить его сюда</p>
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
  title: 'Шаблоны страниц',
  subtitle: 'Готовые композиции из компонентов design systems — все интерактивные экраны на одной странице.',
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
  subtitle: 'Интерактивная настройка токенов: цвета, радиусы, тени, отступы, типографика и density. Изменения применяются через CSS variables ко всей витрине.',
  build: () => {
    const wrap = document.createElement('div');
    wrap.className = 'tpg-wrap';
    wrap.innerHTML = `
      <div class="tpg-controls">
        <div class="tpg-card">
          <h3 class="tpg-card-title">Primary</h3>
          <input type="color" id="pg-primary" value="#008f95" class="tpg-color-input">
          <p class="tpg-card-hint" id="pg-primary-val">#008f95 · hover/pressed автоматически</p>
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
          <div class="tpg-range-row"><span>−25%</span><strong id="pg-spacing-val">100%</strong><span>+40%</span></div>
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
        <span style="font-size:13px;color:var(--text-secondary)">Кнопки · форма · карточка · таблица · теги</span>
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
            <span class="tag tag-success">В наличии</span>
            <span class="tag tag-warning">Под заказ</span>
            <span class="tag tag-neutral">Черновик</span>
          </div>
        </div>
        <div class="tpg-preview-panel">
          <p class="tpg-preview-panel-title">Typography</p>
          <div class="sb-text size-l" style="margin-bottom:6px">Заголовок H2</div>
          <div class="sb-text size-m">Body text — типографика масштабируется с --fs-body.</div>
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
        els.primaryVal.textContent = `${primary} · hover/pressed автоматически`;

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
        if (typeof showSiteToast === 'function') showSiteToast('Токены сброшены');
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

// AI Builder page
pages.push({
  id: 'ai-builder',
  group: 'main',
  iconId: 'settings',
  label: 'AI Builder',
  title: 'AI Builder',
  subtitle: 'Конструктор интерфейсов. Выберите компоненты, укажите стек — получите готовый промт для ИИ-агента.',
  build: () => {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div style="display:grid;grid-template-columns:280px 1fr;gap:24px">

        <!-- Sidebar with components -->
        <div class="ai-builder-panel" style="border-radius:12px;padding:20px;height:fit-content">
          <div style="font-size:15px;font-weight:700;margin-bottom:16px;color:var(--text-main)">Выберите компоненты</div>
          <div id="ai-builder-components" style="display:flex;flex-direction:column;gap:16px;max-height:620px;overflow-y:auto;padding-right:8px"></div>
        </div>

        <!-- Main panel -->
        <div class="ai-builder-panel" style="border-radius:12px;padding:24px;display:flex;flex-direction:column">

          <div style="margin-bottom:20px">
            <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px">Стек разработки</div>
            <div id="ai-builder-stack" style="display:flex;flex-wrap:wrap;gap:8px">
              <button type="button" class="btn btn-secondary btn-s active" data-stack="react">React + Tailwind</button>
              <button type="button" class="btn btn-secondary btn-s" data-stack="vue">Vue 3</button>
              <button type="button" class="btn btn-secondary btn-s" data-stack="html">HTML + CSS + JS</button>
            </div>
          </div>

          <div style="flex:1">
            <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px">Выбранные компоненты</div>
            <div id="ai-builder-selected" class="ai-builder-dropzone" style="min-height:120px;border:1px dashed var(--border);border-radius:10px;padding:16px;display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start"></div>
          </div>

          <div style="margin-top:24px">
            <button id="ai-builder-generate" class="btn btn-primary" style="width:100%;padding:14px;font-size:16px">
              ✨ Сгенерировать промт для ИИ
            </button>
          </div>

          <div id="ai-builder-result" style="margin-top:24px;display:none">
            <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px">Сгенерированный промт</div>
            <pre id="ai-builder-prompt" style="background:#0b2a30;color:#cfdee1;padding:18px;border-radius:10px;font-size:13px;line-height:1.6;white-space:pre-wrap;max-height:420px;overflow-y:auto"></pre>
            <button id="ai-builder-copy" class="btn btn-secondary" style="margin-top:12px">${icon('copy', 16)} Скопировать</button>
          </div>

        </div>

      </div>
    `;

    const componentsContainer = wrap.querySelector('#ai-builder-components');
    const selectedContainer = wrap.querySelector('#ai-builder-selected');
    const generateBtn = wrap.querySelector('#ai-builder-generate');
    const resultBlock = wrap.querySelector('#ai-builder-result');
    const promptEl = wrap.querySelector('#ai-builder-prompt');
    const copyBtn = wrap.querySelector('#ai-builder-copy');
    const stackBtns = wrap.querySelectorAll('#ai-builder-stack .btn');

    let selectedStack = 'react';
    let selectedComponents = [];

    // Render all components grouped
    categoryOrder.forEach(cat => {
      const groupItems = uniqueComponentsList.filter(c => {
        const keys = [cat.key, ...(cat.extraKeys || [])];
        return keys.includes(c.category);
      });
      if (!groupItems.length) return;

      const groupDiv = document.createElement('div');
      groupDiv.innerHTML = `<div style="font-size:12px;font-weight:700;color:var(--text-secondary);margin-bottom:8px">${cat.label}</div>`;
      const groupContainer = document.createElement('div');
      groupContainer.style.display = 'flex';
      groupContainer.style.flexDirection = 'column';
      groupContainer.style.gap = '6px';

      groupItems.forEach(comp => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '8px';
        label.style.cursor = 'pointer';
        label.style.fontSize = '13px';
        label.style.color = 'var(--text-main)';
        label.innerHTML = `
          <input type="checkbox" data-comp-name="${comp.name}" style="accent-color:var(--primary)">
          <span>${comp.name}</span>
        `;
        groupContainer.appendChild(label);
      });

      groupDiv.appendChild(groupContainer);
      componentsContainer.appendChild(groupDiv);
    });

    // Checkbox handler
    componentsContainer.addEventListener('change', e => {
      if (!e.target.type === 'checkbox') return;
      const name = e.target.dataset.compName;
      const comp = uniqueComponentsList.find(c => c.name === name);
      if (!comp) return;

      if (e.target.checked) {
        if (!selectedComponents.find(c => c.name === name)) selectedComponents.push(comp);
      } else {
        selectedComponents = selectedComponents.filter(c => c.name !== name);
      }
      renderSelected();
    });

    function renderSelected() {
      selectedContainer.innerHTML = '';
      if (!selectedComponents.length) {
        selectedContainer.innerHTML = `<div style="color:var(--text-secondary);font-size:13px;text-align:center;padding:20px">Выберите компоненты слева</div>`;
        return;
      }
      selectedComponents.forEach(comp => {
        const pill = document.createElement('div');
        pill.style.cssText = 'background:rgba(0,143,149,0.1);color:var(--primary);padding:4px 12px;border-radius:20px;font-size:13px;display:flex;align-items:center;gap:6px;cursor:pointer';
        pill.innerHTML = `
          ${comp.name}
          <span style="line-height:1;cursor:pointer;display:inline-flex" data-remove-name="${comp.name}">${icon('close', 14)}</span>
        `;
        pill.querySelector('[data-remove-name]').addEventListener('click', e => {
          e.stopPropagation();
          const cb = componentsContainer.querySelector(`input[data-comp-name="${comp.name}"]`);
          if (cb) cb.checked = false;
          selectedComponents = selectedComponents.filter(c => c.name !== comp.name);
          renderSelected();
        });
        selectedContainer.appendChild(pill);
      });
    }

    // Stack buttons
    stackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        stackBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedStack = btn.dataset.stack;
      });
    });

    // Generate button
    generateBtn.addEventListener('click', () => {
      if (!selectedComponents.length) {
        alert('Выберите хотя бы один компонент');
        return;
      }

      const componentNames = selectedComponents.map(c => c.name);
      let stackText = '';
      switch (selectedStack) {
        case 'react': stackText = 'React + Tailwind CSS'; break;
        case 'vue': stackText = 'Vue 3 + Tailwind CSS'; break;
        case 'html': stackText = 'HTML + CSS + Vanilla JS (без фреймворков)'; break;
      }

      const basePrompt = `Создай современный интерфейс на ${stackText} в стиле SB Design System (корпоративный, строгий, контентно-ориентированный).

Используй следующие компоненты:
${componentNames.join(', ')}

Сделай страницу заявки (или дашборд) с этими компонентами. Используй современный дизайн, хорошую типографику, правильные отступы, hover-эффекты и доступность.

Применяй дизайн-токены из промта (CSS-переменные :root) для цветов, теней (--shadow-card, --shadow-hover), радиусов (--r-sm, --r-md, --r-lg), толщины границ (--border-w) и focus-ring (--border-focus).

Верни полный код (один файл) с комментариями.`;

      const prompt = typeof buildAiPromptWithStyles === 'function'
        ? buildAiPromptWithStyles(basePrompt, componentNames)
        : basePrompt;

      promptEl.textContent = prompt;
      resultBlock.style.display = 'block';
      promptEl.scrollIntoView({ behavior: 'smooth' });
    });

    // Copy button
    copyBtn.addEventListener('click', () => {
      const text = promptEl.textContent;
      if (!text) return;
      fallbackClipboardCopy(text);
      showSiteToast('Промт скопирован ✓');
    });

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
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:32px">
        <div class="overview-stat-card" style="border-radius:14px;padding:20px">
          <div style="font-size:32px;font-weight:700;color:var(--primary)">${totalComponents}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">Компонентов</div>
        </div>
        <div class="overview-stat-card" style="border-radius:14px;padding:20px">
          <div style="font-size:32px;font-weight:700;color:var(--primary)">${tokenGroups.length}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">Групп токенов</div>
        </div>
        <div class="overview-stat-card" style="border-radius:14px;padding:20px">
          <div style="font-size:32px;font-weight:700;color:var(--primary)">5</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">Категорий</div>
        </div>
        <div class="overview-stat-card" style="border-radius:14px;padding:20px">
          <div style="font-size:32px;font-weight:700;color:var(--accent-orange)">${KIT_VERSION}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">Версия design systems</div>
        </div>
      </div>

      <h2 style="font-size:22px;margin:0 0 16px;color:var(--text-main)">Что внутри</h2>
      <div class="overview-info-card" style="border-radius:14px;padding:24px;line-height:1.7;color:var(--text-secondary)">
        Дизайн-система SB построена на простых vanilla-технологиях без npm и сборщиков.
        Все компоненты описаны как data-driven структуры и рендерятся через <code class="overview-inline-code">&lt;template&gt;</code>.
        Выберите раздел в левом меню, чтобы увидеть токены или компоненты в работе.
      </div>

      <h2 style="font-size:22px;margin:32px 0 16px;color:var(--text-main)">Быстрый доступ</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
        <a href="#icon-pack" class="quick-link overview-quick-link" style="display:block;border-radius:10px;padding:18px;text-decoration:none;color:inherit;transition:all 0.2s">
          <div style="margin-bottom:8px">${icon('layers', 24)}</div>
          <div style="font-weight:700;color:var(--text-main)">Пак иконок</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">${typeof iconPack !== 'undefined' ? iconPack.length : '—'} иконок</div>
        </a>
        <a href="#tokens-overview" class="quick-link overview-quick-link" style="display:block;border-radius:10px;padding:18px;text-decoration:none;color:inherit;transition:all 0.2s">
          <div style="margin-bottom:8px">${icon('folder', 24)}</div>
          <div style="font-weight:700;color:var(--text-main)">Обзор токенов</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">Все группы</div>
        </a>
        ${tokenGroups.map((g, i) => `
          <a href="#token-${i}" class="quick-link overview-quick-link" style="display:block;border-radius:10px;padding:18px;text-decoration:none;color:inherit;transition:all 0.2s">
            <div style="margin-bottom:8px">${icon(tokenIconIds[i] || 'grid', 24)}</div>
            <div style="font-weight:700;color:var(--text-main)">${g.title}</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">${g.items.length} токенов</div>
          </a>
        `).join('')}
        ${categoryOrder.map(cat => {
          const keys = [cat.key, ...(cat.extraKeys || [])];
          const count = uniqueComponentsList.filter(c => keys.includes(c.category)).length;
          return `
            <a href="#cat-${cat.key.toLowerCase().replace(/\s/g,'-')}" class="quick-link overview-quick-link" style="display:block;border-radius:10px;padding:18px;text-decoration:none;color:inherit;transition:all 0.2s">
              <div style="margin-bottom:8px">${icon(compIconIds[cat.key] || 'grid', 24)}</div>
              <div style="font-weight:700;color:var(--text-main)">${cat.label}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">${count} компонентов</div>
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
  subtitle: 'Все группы дизайн-токенов SB design systems — цвета, типографика, отступы, границы, радиусы, тени, размеры и анимация.',
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
        <div class="toc-title">На странице</div>
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



