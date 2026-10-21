/* ============================================
   RENDER: Token group as standalone block
   ============================================ */
function renderSingleTokenGroup(group) {
  const tpl = document.getElementById('tpl-token-group');
  const node = tpl.content.cloneNode(true);
  const wrapper = node.querySelector('.token-group');
  wrapper.querySelector('.tg-title').textContent = group.title;
  const body = wrapper.querySelector('.tg-body');
  if (group.desc) {
    const desc = document.createElement('p');
    desc.className = 'token-group-desc';
    desc.textContent = group.desc;
    body.appendChild(desc);
  }
  renderTokenGroupBody(group, body);
  return wrapper;
}

function bindTokenCopy(el, text) {
  el.classList.add('is-copyable');
  el.title = 'Клик — скопировать';
  el.addEventListener('click', () => {
    navigator.clipboard.writeText(text).then(() => {
      if (typeof showSiteToast === 'function') showSiteToast(`Скопировано: ${text}`);
    });
  });
}

function tokenVarHtml(item) {
  if (!item.var) return '';
  return `<code class="token-var">${item.var}</code>`;
}

function renderTokenGroupBody(group, body) {
  if (group.type === 'showcase') return;

  const firstType = group.items[0]?.type;

  if (firstType === 'color') {
    const list = document.createElement('div');
    list.className = 'token-list';
    group.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'token-item';
      row.innerHTML = `
        <div class="token-swatch" style="background:${item.value}"></div>
        <div class="token-item-body">
          <div class="token-name">${item.name}</div>
          ${tokenVarHtml(item)}
          <div class="token-desc">${item.desc || ''}</div>
        </div>
        <div class="token-value">${item.value}</div>
      `;
      if (item.var) bindTokenCopy(row, `var(${item.var})`);
      list.appendChild(row);
    });
    body.appendChild(list);
  }
  else if (firstType === 'type') {
    const wrap = document.createElement('div');
    wrap.className = 'type-preview';
    group.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'type-row';
      row.innerHTML = `
        <div class="type-row-label">
          <span class="type-label">${item.name}</span>
          ${tokenVarHtml(item)}
        </div>
        <span class="type-sample" style="font-size:${item.size};font-weight:${item.weight}">${item.sample}</span>
        <span class="type-spec">${item.value}</span>
      `;
      if (item.var) bindTokenCopy(row, `var(${item.var})`);
      wrap.appendChild(row);
    });
    body.appendChild(wrap);
  }
  else if (firstType === 'space') {
    const wrap = document.createElement('div');
    wrap.className = 'spacing-preview';
    group.items.forEach(item => {
      const bar = document.createElement('div');
      bar.className = 'sp-bar';
      bar.style.height = `${(item.px / 32) * 100}%`;
      bar.innerHTML = `<span>${item.name} · ${item.value}</span>`;
      bar.title = item.var ? `var(${item.var})` : item.value;
      if (item.var) bindTokenCopy(bar, `var(${item.var})`);
      wrap.appendChild(bar);
    });
    body.appendChild(wrap);
    const legend = document.createElement('div');
    legend.className = 'token-spacing-legend';
    legend.innerHTML = group.items.map(item => `
      <div class="token-spacing-item">
        <strong>${item.name}</strong>
        ${tokenVarHtml(item)}
        <span>${item.desc || ''}</span>
      </div>
    `).join('');
    body.appendChild(legend);
  }
  else if (firstType === 'size') {
    const wrap = document.createElement('div');
    wrap.className = 'size-preview';
    const maxPx = Math.max(...group.items.map(i => i.px));
    group.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'size-row';
      row.innerHTML = `
        <div class="size-row-label">
          <span class="token-name">${item.name}</span>
          ${tokenVarHtml(item)}
        </div>
        <div class="size-bar-track">
          <div class="size-bar-fill" style="width:${(item.px / maxPx) * 100}%"></div>
        </div>
        <span class="token-value">${item.value}</span>
      `;
      if (item.var) bindTokenCopy(row, `var(${item.var})`);
      wrap.appendChild(row);
    });
    body.appendChild(wrap);
  }
  else if (group.title === 'Анимация' || firstType === 'motion' || firstType === 'easing' || firstType === 'fade' || firstType === 'saturate') {
    const wrap = document.createElement('div');
    wrap.className = 'motion-preview';
    let lastSection = null;
    group.items.forEach(item => {
      if (item.section && item.section !== lastSection) {
        const section = document.createElement('div');
        section.className = 'motion-section-label';
        section.textContent = item.section;
        wrap.appendChild(section);
        lastSection = item.section;
      }
      const row = document.createElement('div');
      row.className = 'motion-row';
      if (item.type === 'motion') {
        row.innerHTML = `
          <div class="motion-row-head">
            <span class="token-name">${item.name}</span>
            ${tokenVarHtml(item)}
            <span class="token-value">${item.value}</span>
          </div>
          <div class="motion-track"><div class="motion-dot" style="animation-duration:${item.ms}ms"></div></div>
          <div class="token-desc">${item.desc || ''}</div>
        `;
      } else if (item.type === 'easing') {
        row.innerHTML = `
          <div class="motion-row-head">
            <span class="token-name">${item.name}</span>
            ${tokenVarHtml(item)}
          </div>
          <div class="token-value motion-easing-value">${item.value}</div>
          <div class="token-desc">${item.desc || ''}</div>
        `;
      } else if (item.type === 'fade' || item.type === 'saturate') {
        const animClass = `motion-${item.type}-${item.variant}`;
        row.innerHTML = `
          <div class="motion-row-head">
            <span class="token-name">${item.name}</span>
            ${tokenVarHtml(item)}
            <span class="token-value">${item.value}</span>
          </div>
          <div class="motion-effect-stage">
            <div class="motion-effect-card ${animClass}" style="animation-duration:${item.ms || 2000}ms"></div>
          </div>
          <div class="token-desc">${item.desc || ''}</div>
        `;
      }
      if (item.var) bindTokenCopy(row, `var(${item.var})`);
      else if (item.type === 'fade' || item.type === 'saturate') {
        bindTokenCopy(row, `motion-${item.type}-${item.variant}`);
      }
      wrap.appendChild(row);
    });
    body.appendChild(wrap);
  }
  else {
    renderEffectsTokens(group, body);
  }

  if (group.note) {
    const note = document.createElement('div');
    note.className = 'token-note';
    note.textContent = group.note;
    body.appendChild(note);
  }
}

function renderEffectsTokens(group, body) {
  const radii = group.items.filter(i => i.type === 'radius');
  const extraRadii = group.items.filter(i => i.type === 'radius-circle');
  const borders = group.items.filter(i => ['border', 'border-width', 'focus-ring'].includes(i.type));
  const shadows = group.items.filter(i => i.type === 'shadow');

  if (radii.length) {
    const label = document.createElement('div');
    label.className = 'effects-section-label';
    label.textContent = 'Радиусы';
    body.appendChild(label);

    const wrap = document.createElement('div');
    wrap.className = 'spacing-preview radius-preview';
    radii.forEach(item => {
      const bar = document.createElement('div');
      bar.className = 'sp-bar';
      const previewPx = item.px >= 100 ? 20 : Math.min(item.px, 28);
      bar.style.borderRadius = `${previewPx}px`;
      bar.innerHTML = `<span>${item.name.replace('Radius ', '')}</span>`;
      if (item.var) bindTokenCopy(bar, `var(${item.var})`);
      wrap.appendChild(bar);
    });
    body.appendChild(wrap);
  }

  const renderEffectList = (items, sectionTitle) => {
    if (!items.length) return;
    const label = document.createElement('div');
    label.className = 'effects-section-label';
    label.textContent = sectionTitle;
    body.appendChild(label);

    const list = document.createElement('div');
    list.className = 'token-list token-list--effects';
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'token-item';
      let preview = '';
      if (item.type === 'shadow') {
        preview = `<div class="token-swatch token-swatch--shadow${item.shadow === 'none' ? ' token-swatch--flat' : ''}" style="box-shadow:${item.shadow || item.value}"></div>`;
      } else if (item.type === 'focus-ring') {
        preview = `<div class="token-swatch token-swatch--shadow token-swatch--focus" style="box-shadow:${item.shadow || item.value}"></div>`;
      } else if (item.type === 'border') {
        preview = `<div class="token-swatch token-swatch--border" style="border:${item.border || item.value}"></div>`;
      } else if (item.type === 'border-width') {
        preview = `<div class="token-swatch token-swatch--border-width"><span style="height:${item.px}px"></span></div>`;
      } else if (item.type === 'radius-circle') {
        preview = `<div class="token-swatch token-swatch--circle"></div>`;
      }
      row.innerHTML = `
        ${preview}
        <div class="token-item-body">
          <div class="token-name">${item.name}</div>
          ${tokenVarHtml(item)}
          <div class="token-desc">${item.desc || ''}</div>
        </div>
        <div class="token-value token-value--compact">${item.value}</div>
      `;
      if (item.var) bindTokenCopy(row, `var(${item.var})`);
      list.appendChild(row);
    });
    body.appendChild(list);
  };

  if (extraRadii.length) renderEffectList(extraRadii, 'Особые радиусы');
  renderEffectList(borders, 'Границы');
  renderEffectList(shadows, 'Тени');

  const scrollbars = group.items.filter(i => i.type === 'scrollbar');
  if (scrollbars.length) {
    const label = document.createElement('div');
    label.className = 'effects-section-label';
    label.textContent = 'Scrollbars';
    body.appendChild(label);
    const list = document.createElement('div');
    list.className = 'token-list token-list--effects';
    scrollbars.forEach(item => {
      const row = document.createElement('div');
      row.className = 'token-item';
      const preview = item.scrollSize
        ? `<div class="token-swatch token-swatch--scrollbar"><div class="token-swatch-scroll" style="width:${item.scrollSize}px"></div></div>`
        : `<div class="token-swatch token-swatch--scrollbar" style="background:${item.scrollKind === 'track' ? item.value : 'transparent'}"><div class="token-swatch-scroll" style="background:${item.scrollKind === 'thumb' ? item.value : 'var(--scrollbar-thumb)'}"></div></div>`;
      row.innerHTML = `
        ${preview}
        <div class="token-item-body">
          <div class="token-name">${item.name}</div>
          ${tokenVarHtml(item)}
          <div class="token-desc">${item.desc || ''}</div>
        </div>
        <div class="token-value token-value--compact">${item.value}</div>
      `;
      if (item.var) bindTokenCopy(row, `var(${item.var})`);
      list.appendChild(row);
    });
    body.appendChild(list);
  }
}

function scrollToComponent(comp) {
  const pageId = componentPageIdFor(comp);
  navigateTo(pageId);
  setTimeout(() => {
    const target = document.getElementById(componentDomId(comp));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('is-search-hit');
      setTimeout(() => target.classList.remove('is-search-hit'), 1800);
    }
  }, 120);
}

function renderTokenComponents(group, { full = false } = {}) {
  if (!group.components?.length) return null;

  const section = document.createElement('div');
  section.className = 'token-components';

  const title = document.createElement('h4');
  title.className = 'token-components-title';
  title.textContent = group.type === 'showcase' ? 'Каталог компонентов' : 'Связанные компоненты';
  section.appendChild(title);

  const chips = document.createElement('div');
  chips.className = 'token-component-chips';
  group.components.forEach(name => {
    const comp = uniqueComponentsList.find(c => c.name === name);
    if (!comp) return;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'token-comp-chip';
    chip.textContent = comp.name;
    chip.addEventListener('click', () => scrollToComponent(comp));
    chips.appendChild(chip);
  });
  section.appendChild(chips);

  const previewNames = full ? group.components : group.components.slice(0, 4);
  const previews = document.createElement('div');
  previews.className = 'token-component-previews';
  previewNames.forEach(name => {
    const comp = uniqueComponentsList.find(c => c.name === name);
    if (!comp) return;
    const card = document.createElement('article');
    card.className = 'token-comp-preview';
    const cat = categoryOrder.find(ct => [ct.key, ...(ct.extraKeys || [])].includes(comp.category));
    card.innerHTML = `
      <div class="token-comp-preview-head">
        <strong>${comp.name}</strong>
        <span>${cat?.label || comp.category}</span>
      </div>
      <div class="token-comp-preview-demo">${comp.demo}</div>
      <button type="button" class="token-comp-preview-link">Открыть компонент →</button>
    `;
    card.querySelector('.token-comp-preview-link').addEventListener('click', () => scrollToComponent(comp));
    previews.appendChild(card);
  });
  section.appendChild(previews);

  return section;
}


function buildPropRows(params) {
  if (!params) return [];
  return params.split('·').map(part => part.trim()).filter(Boolean).map(raw => {
    let name = raw;
    let type = 'string | number | boolean';
    if (raw.includes(':')) {
      const pieces = raw.split(':');
      name = pieces.shift().trim();
      type = pieces.join(':').trim();
    } else if (raw.includes('(')) {
      name = raw.split('(')[0].trim();
      type = raw.match(/\((.*?)\)/)?.[1] || raw;
    } else if (raw.includes('|')) {
      type = raw;
    }
    const cleanName = name.replace(/\[\]|\?/g, '').trim();
    return {
      name: name || raw,
      type,
      desc: propDescriptionMap[cleanName] || 'Параметр компонента.'
    };
  });
}

function renderPropTable(comp) {
  const rows = buildPropRows(comp.params);
  if (!rows.length) return '';
  return `
    <h4 class="comp-props-title">Prop Table</h4>
    <table class="comp-props-table">
      <thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            <td><code>${row.name}</code></td>
            <td><code>${row.type}</code></td>
            <td class="prop-desc">${row.desc}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ${renderA11yChecklist(comp)}
  `;
}

function renderA11yChecklist(comp) {
  const name = comp.name.toLowerCase();
  const items = [
    { label: 'Keyboard support', ok: /(tabs|select|slider|combobox|autocomplete|pagination|steps|button|checkbox|radio|switch|modal|drawer|menu|command)/i.test(comp.name) },
    { label: 'ARIA roles/attributes', ok: /(tabs|slider|modal|dialog|progress|pagination|steps|select|combobox|tooltip)/i.test(comp.name) },
    { label: 'focus-visible', ok: true },
    { label: 'color contrast', ok: true },
    { label: 'screen reader label', ok: /(button|input|select|modal|toast|snackbar|loader|attachment|userselect)/i.test(comp.name + comp.category) }
  ];
  return `<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;font-size:12px;color:var(--text-secondary)">
    ${items.map(i => `<span class="tag ${i.ok ? 'tag-success' : 'tag-warning'}">${i.ok ? '✓' : '!'} ${i.label}</span>`).join('')}
  </div>`;
}

function getVariantDemoHtml(item) {
  const demo = item.querySelector('.navbar-demo, .tabs-demo, .bc-demo, .pg-demo, .showcase-demo');
  return demo ? demo.outerHTML : item.innerHTML;
}

function getFavoriteVariantDemoHtml(comp, variantId) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = comp.demo;
  const item = wrapper.querySelector(`[data-variant-id="${variantId}"]`);
  return item ? item.outerHTML : comp.demo;
}
window.getFavoriteVariantDemoHtml = getFavoriteVariantDemoHtml;

function buildShowcaseActionsHtml(comp, variant) {
  const fav = isFavorite(comp.name, variant.id);
  const aiButton = variant.aiPrompt || comp.aiPrompt
    ? `<button type="button" class="showcase-action showcase-action--ai" data-showcase-ai aria-label="Промт для ИИ-агента">AI Prompt</button>`
    : '';
  const previewButton = comp.category === 'Typography' ? '' : `<button type="button" class="showcase-action showcase-action--preview" data-showcase-preview aria-label="Preview">${icon('monitor', 14)} Preview</button>`;
  return `
    <button type="button" class="showcase-action showcase-action--fav${fav ? ' is-active' : ''}" data-showcase-fav aria-label="В закладки" title="В закладки">${icon('heart', 14)}</button>
    ${aiButton}
    <button type="button" class="showcase-action showcase-action--code" data-showcase-code aria-label="Копировать код">Copy Code</button>
    ${previewButton}
  `;
}

function setShowcasePreviewSize(demo, controls, size) {
  demo.dataset.previewSize = size;
  ['360', '768', '1024', '1440'].forEach(s => demo.classList.toggle(`size-${s}`, s === size));
  controls?.querySelectorAll('[data-preview-size]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.previewSize === size);
  });
}

function toggleShowcasePreview(item) {
  const demo = item.querySelector('.navbar-demo, .tabs-demo, .bc-demo, .pg-demo, .showcase-demo');
  if (!demo) return;

  const previewBtn = item.querySelector('[data-showcase-preview]');

  if (demo.classList.contains('is-responsive-preview')) {
    demo.classList.remove('is-responsive-preview', 'size-360', 'size-768', 'size-1024', 'size-1440');
    delete demo.dataset.previewSize;
    item.classList.remove('is-preview-active');
    item.querySelector('.showcase-preview-controls')?.remove();
    previewBtn?.classList.remove('is-active');
    return;
  }

  const controls = document.createElement('div');
  controls.className = 'comp-responsive-controls showcase-preview-controls';
  controls.innerHTML = `
    <button type="button" class="comp-responsive-btn" data-preview-size="360">360</button>
    <button type="button" class="comp-responsive-btn active" data-preview-size="768">768</button>
    <button type="button" class="comp-responsive-btn" data-preview-size="1024">1024</button>
    <button type="button" class="comp-responsive-btn" data-preview-size="1440">1440</button>
  `;
  demo.insertAdjacentElement('beforebegin', controls);

  demo.classList.add('is-responsive-preview');
  item.classList.add('is-preview-active');
  setShowcasePreviewSize(demo, controls, '768');

  controls.querySelectorAll('[data-preview-size]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      setShowcasePreviewSize(demo, controls, btn.dataset.previewSize);
    });
  });

  previewBtn?.classList.add('is-active');
}

function initShowcaseItemActions(card, comp) {
  if (!comp.variants?.length) return;
  const variantMap = Object.fromEntries(comp.variants.map(v => [v.id, v]));

  card.querySelectorAll('[data-variant-id]').forEach(item => {
    const variant = variantMap[item.dataset.variantId];
    if (!variant || item.querySelector('.showcase-item-actions')) return;

    const demo = item.querySelector('.navbar-demo, .tabs-demo, .bc-demo, .pg-demo, .showcase-demo');
    if (!demo) return;

    const actions = document.createElement('div');
    actions.className = 'showcase-item-actions';
    actions.innerHTML = buildShowcaseActionsHtml(comp, variant);
    demo.insertAdjacentElement('afterend', actions);

    actions.querySelector('[data-showcase-ai]')?.addEventListener('click', () => {
      openAiPrompt(comp, variant);
    });
    actions.querySelector('[data-showcase-code]')?.addEventListener('click', () => {
      openCodeModal(comp, { demoHtml: getVariantDemoHtml(item), label: variant.label });
    });
    actions.querySelector('[data-showcase-preview]')?.addEventListener('click', () => {
      toggleShowcasePreview(item);
    });
    actions.querySelector('[data-showcase-fav]')?.addEventListener('click', e => {
      const btn = e.currentTarget;
      toggleFavorite(comp.name, variant.id);
      const isFav = isFavorite(comp.name, variant.id);
      btn.classList.toggle('is-active', isFav);
      showSiteToast(isFav ? `«${variant.label}» в закладках` : `«${variant.label}» убран из закладок`);
    });
  });
}

function renderSingleComponent(comp) {
  const tpl = document.getElementById('tpl-component');
  const node = tpl.content.cloneNode(true);
  const card = node.querySelector('.comp-card');
  card.id = componentDomId(comp);
  card.dataset.componentName = comp.name;
  card.querySelector('.comp-title').textContent = comp.name;
  card.querySelector('.comp-cat').textContent = comp.category;
  card.querySelector('.comp-desc').innerHTML = comp.desc;
  card.querySelector('.comp-demo').innerHTML = comp.demo;
  card.querySelector('.comp-props').innerHTML = renderPropTable(comp);

  const meta = card.querySelector('.comp-meta');
  const paramsHtml = `<span><strong style="color:var(--text-main)">Параметры:</strong> <code>${comp.params}</code></span>`;
  const statesHtml = `<span><strong style="color:var(--text-main)">Состояния:</strong> <code>${comp.states}</code></span>`;
  const version = comp.version || KIT_VERSION;
  const status = getComponentStatus(comp);
  const statusClass = STATUS_CLASS[status] || 'tag-neutral';
  const fav = isFavorite(comp.name);
  const hasVariants = comp.variants?.length > 0;
  const favHtml = hasVariants ? '' : `<button class="comp-ai-prompt comp-fav-toggle${fav ? ' is-active' : ''}" data-fav-toggle aria-label="Избранное" style="${fav ? '' : 'opacity:0.4'}">${icon('heart', 16)}</button>`;
  const aiButton = !hasVariants && comp.aiPrompt
    ? `<button class="comp-ai-prompt" data-ai-prompt aria-label="Промт для ИИ-агента">AI Prompt</button>`
    : '';
  const copyCodeButton = hasVariants ? '' : `<button class="comp-ai-prompt comp-copy-code" data-copy-code aria-label="Копировать код">Copy Code</button>`;
  const respButton = (hasVariants || comp.category === 'Typography') ? '' : `<button class="comp-ai-prompt" data-responsive-preview>${icon('monitor', 14)} Preview</button>`;
  const versionHtml = `<span style="font-size:11px;color:var(--text-secondary);padding:3px 8px;background:var(--neutral-bg);border-radius:12px;font-weight:700">${version}</span><span class="tag ${statusClass}" style="font-size:11px;padding:3px 8px">${status}</span>`;
  meta.innerHTML = `<div class="comp-meta-info">${versionHtml}${paramsHtml}${statesHtml}</div><div class="comp-meta-actions">${favHtml}${aiButton}${copyCodeButton}${respButton}</div>`;

  if (comp.aiPrompt) {
    const btn = meta.querySelector('[data-ai-prompt]');
    btn?.addEventListener('click', () => openAiPrompt(comp));
  }
  meta.querySelector('[data-copy-code]')?.addEventListener('click', () => openCodeModal(comp));

  initShowcaseItemActions(card, comp);

  const favBtn = meta.querySelector('[data-fav-toggle]');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      toggleFavorite(comp.name);
      const isFav = isFavorite(comp.name);
      favBtn.innerHTML = icon('heart', 16);
      favBtn.classList.toggle('is-active', isFav);
      favBtn.style.opacity = isFav ? '1' : '0.4';
      showSiteToast(isFav ? `«${comp.name}» в избранном` : `«${comp.name}» убран из избранного`);
    });
  }

  const respBtn = meta.querySelector('[data-responsive-preview]');
  if (respBtn) {
    respBtn.addEventListener('click', () => {
      const demo = card.querySelector('.comp-demo');
      if (!demo) return;
      let frame = demo.querySelector('.comp-responsive-frame');
      if (!frame) {
        frame = document.createElement('div');
        frame.className = 'comp-responsive-frame size-768';
        frame.style.margin = '16px auto';
        frame.style.border = '12px solid #111';
        frame.style.borderRadius = '20px';
        frame.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
        frame.innerHTML = `<div style="height:100%;background:#fff;overflow:auto;padding:20px">${demo.innerHTML}</div>`;
        demo.innerHTML = '';
        demo.appendChild(frame);
      }
      const sizes = ['360', '768', '1024', '1440'];
      let current = sizes.indexOf(frame.className.match(/size-(\d+)/)?.[1] || '768');
      current = (current + 1) % sizes.length;
      frame.className = `comp-responsive-frame size-${sizes[current]}`;
    });
  }

  return card;
}
