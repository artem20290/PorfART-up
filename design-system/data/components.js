const components = [
  /* ===== Action / Form ===== */
  {
    name: 'Button',
    category: 'Action',
    status: 'stable',
    desc: '<strong>Кнопки.</strong> 4 view: primary / secondary / ghost / clear. 4 размера (xs/s/m/l). Иконки слева (iconLeft), справа (iconRight) или только иконка (onlyIcon). Полный набор состояний: default · hover · active · focus · disabled.',
    params: 'label · view: primary|secondary|ghost|clear · size: xs|s|m|l · iconLeft · iconRight · onlyIcon · disabled',
    states: 'default · hover · active · focus · disabled',
    aiPrompt: `Создай React-компонент Button в стиле SB Design System.

Требования:
- Пропсы: label, view: 'primary' | 'secondary' | 'ghost' | 'clear', size: 'xs' | 's' | 'm' | 'l', iconLeft?, iconRight?, onlyIcon?, disabled?.
- View primary: фон #008f95, hover #007a85, active #006b74, текст #fff.
- View secondary: белый фон, border #d7dee1, hover border/text #008f95.
- View ghost: прозрачный фон, текст #008f95, hover rgba(0,143,149,0.08).
- View clear: text-only, без рамки, hover text primary.
- Размеры: xs 26px, s 32px, m 40px, l 48px по min-height.
- onlyIcon — квадратная кнопка width = height, иконка по центру.
- Иконки через currentColor, gap 8px.
- Focus-visible: outline 2px primary.
- Шрифт Inter, font-weight 600, border-radius 6px.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'primary', label: 'Primary', aiPrompt: `Создай Button view=primary size=m: фон #008f95, иконки слева/справа, icon-only, disabled. Без внешних библиотек.` },
      { id: 'secondary', label: 'Secondary', aiPrompt: `Создай Button view=secondary: белый фон, border #d7dee1. Без внешних библиотек.` },
      { id: 'ghost', label: 'Ghost', aiPrompt: `Создай Button view=ghost: прозрачный фон, текст primary. Без внешних библиотек.` },
      { id: 'clear', label: 'Clear', aiPrompt: `Создай Button view=clear: text-only без рамки. Без внешних библиотек.` },
      { id: 'sizes', label: 'Sizes', aiPrompt: `Создай Button sizes xs/s/m/l: min-height 26/32/40/48px. Без внешних библиотек.` },
      { id: 'icons', label: 'With icons', aiPrompt: `Создай Button с iconLeft, iconRight и onlyIcon ghost. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="primary">
          <span class="showcase-label">Primary</span>
          <div class="showcase-demo">
            <div class="btn-demo-row">
              <button class="btn btn-primary btn-m">Войти</button>
              <button class="btn btn-primary btn-m">
                Продолжить
                <span class="bi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
              </button>
              <button class="btn btn-primary btn-m btn-icon-only" title="Добавить">
                <span class="bi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg></span>
              </button>
              <button class="btn btn-primary btn-m" disabled>Недоступно</button>
            </div>
          </div>
        </div>
        <div data-variant-id="secondary">
          <span class="showcase-label">Secondary</span>
          <div class="showcase-demo">
            <div class="btn-demo-row">
              <button class="btn btn-secondary btn-m">Читать далее</button>
              <button class="btn btn-secondary btn-m">
                <span class="bi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
                Комментировать
              </button>
              <button class="btn btn-secondary btn-m btn-icon-only" title="Редактировать">
                <span class="bi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></span>
              </button>
            </div>
          </div>
        </div>
        <div data-variant-id="ghost">
          <span class="showcase-label">Ghost</span>
          <div class="showcase-demo">
            <div class="btn-demo-row">
              <button class="btn btn-ghost btn-m">Отмена</button>
              <button class="btn btn-ghost btn-m">
                <span class="bi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
                Настройки
              </button>
              <button class="btn btn-ghost btn-m btn-icon-only" title="Фильтр">
                <span class="bi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg></span>
              </button>
            </div>
          </div>
        </div>
        <div data-variant-id="clear">
          <span class="showcase-label">Clear</span>
          <div class="showcase-demo">
            <div class="btn-demo-row">
              <button class="btn btn-clear btn-m">Развернуть</button>
              <button class="btn btn-clear btn-m">
                <span class="bi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span>
                Скопировать
              </button>
              <button class="btn btn-clear btn-m btn-icon-only" title="В избранное">
                <span class="bi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></span>
              </button>
            </div>
          </div>
        </div>
        <div data-variant-id="sizes">
          <span class="showcase-label">Sizes</span>
          <div class="showcase-demo">
            <div class="btn-demo-row">
              <button class="btn btn-primary btn-xs">XS — маленький</button>
              <button class="btn btn-primary btn-s">S — компактный</button>
              <button class="btn btn-primary btn-m">M — стандартный</button>
              <button class="btn btn-primary btn-l">L — крупный</button>
            </div>
          </div>
        </div>
        <div data-variant-id="icons">
          <span class="showcase-label">With icons</span>
          <div class="showcase-demo">
            <div class="btn-demo-row">
              <button class="btn btn-primary btn-m">
                <span class="bi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg></span>
                Назад
              </button>
              <button class="btn btn-primary btn-m">
                Вперёд
                <span class="bi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
              </button>
              <button class="btn btn-ghost btn-m btn-icon-only" title="Меню">
                <span class="bi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg></span>
              </button>
              <button class="btn btn-ghost btn-m btn-icon-only" title="Календарь">
                <span class="bi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'UserSelect',
    category: 'Form',
    desc: '<strong>Выбор пользователя.</strong> Специализированный комбобокс для выбора людей из списка. Показывает аватар, имя и email. Поддерживает поиск, состояние selected с чекмарком и кастомные placeholder-иконки.',
    params: 'items[] · value · placeholder · searchable · getLabel · getSubLabel · getAvatarUrl · getKey · disabled',
    states: 'default · focused · has-value · error · disabled · searching · empty',
    aiPrompt: `Создай React-компонент UserSelect в стиле SB Design System.

Требования:
- Пропсы: items: { id, label, subLabel?, avatarUrl? }[], value, onChange, placeholder, disabled, error?.
- Поле выбора пользователя с аватаром, именем и email.
- При открытии показывать dropdown с поиском по label и subLabel.
- Если avatarUrl есть — показывать img 36px circle; иначе инициалы на градиенте #008f95 ${icon("chevron-right", 14)} #006b74.
- Selected item подсвечивать rgba(0,143,149,0.15), справа чекмарк.
- Input-wrap: white, border #d7dee1, radius 6px, min-height 48px, focus border #008f95 + glow.
- Error: border #c53b3b, светло-красный фон.
- Disabled: серый фон #f3f6f7, cursor not-allowed.
- Доступность: keyboard ArrowUp/Down, Enter, Escape.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай UserSelect default: два live select с поиском, аватар, email. Без внешних библиотек.` },
      { id: 'selected', label: 'Selected', aiPrompt: `Создай UserSelect с preselected пользователем (data-preselected). Без внешних библиотек.` },
      { id: 'error-disabled', label: 'Error · Disabled', aiPrompt: `Создай UserSelect is-error и is-disabled состояния. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-userselect" id="us-demo-1" data-userselect>
              <div class="sb-userselect-input-wrap">
                <span class="sb-userselect-placeholder" data-us-placeholder>Выберите пользователя</span>
                <div class="sb-userselect-value" data-us-value style="display:none">
                  <div class="us-avatar" data-us-avatar></div>
                  <div class="sb-userselect-info">
                    <span class="us-name" data-us-name></span>
                    <span class="us-email" data-us-email></span>
                  </div>
                </div>
                <button class="sb-userselect-clear" data-us-clear title="Очистить">${icon("close", 14)}</button>
                <div class="sb-userselect-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
              <div class="sb-userselect-dropdown" data-us-dropdown></div>
            </div>
          </div>
        </div>
        <div data-variant-id="selected">
          <span class="showcase-label">Selected</span>
          <div class="showcase-demo">
            <div class="sb-userselect" id="us-demo-2" data-userselect data-preselected="2">
              <div class="sb-userselect-input-wrap">
                <span class="sb-userselect-placeholder" data-us-placeholder>Участник назначен</span>
                <div class="sb-userselect-value" data-us-value style="display:none">
                  <div class="us-avatar" data-us-avatar></div>
                  <div class="sb-userselect-info">
                    <span class="us-name" data-us-name></span>
                    <span class="us-email" data-us-email></span>
                  </div>
                </div>
                <button class="sb-userselect-clear" data-us-clear title="Очистить">${icon("close", 14)}</button>
                <div class="sb-userselect-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
              <div class="sb-userselect-dropdown" data-us-dropdown></div>
            </div>
          </div>
        </div>
        <div data-variant-id="error-disabled">
          <span class="showcase-label">Error · Disabled</span>
          <div class="showcase-demo">
            <div class="sb-us-demo-row">
              <div class="sb-userselect is-error">
                <div class="sb-userselect-label">Ответственный (обязательно)</div>
                <div class="sb-userselect-input-wrap">
                  <span class="sb-userselect-placeholder">Необходимо выбрать</span>
                  <div class="sb-userselect-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
                <div class="sb-us-error">Выберите ответственного за задачу</div>
              </div>
              <div class="sb-userselect is-disabled">
                <div class="sb-userselect-label">Участник</div>
                <div class="sb-userselect-input-wrap">
                  <div class="sb-userselect-value" data-us-value>
                    <div class="us-avatar" data-us-avatar><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face" alt="" /></div>
                    <div class="sb-userselect-info">
                      <span class="us-name" data-us-name>Алексей Волков</span>
                      <span class="us-email" data-us-email>alexey.volkov@sb.local</span>
                    </div>
                  </div>
                  <div class="sb-userselect-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
                <div class="sb-us-error sb-us-error--spacer" aria-hidden="true">&#8203;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'Input / TextField',
    category: 'Form',
    desc: '<strong>Текстовое поле.</strong> Обязательное поле с label, focus-состояние, подсказка.',
    params: 'label · placeholder · hint · error (док.)',
    states: 'default · focus · filled · disabled',
    aiPrompt: `Создай React-компонент Input/TextField в стиле SB Design System.

Требования:
- Однострочный input с label, placeholder, hint, disabled, error.
- Фон white, border 1px #d7dee1, radius 6px, padding 10px 14px.
- Focus: border #008f95, box-shadow 0 0 0 3px rgba(0,143,149,0.15).
- Label: 13px/600, text-main #123a45. Hint: 12px, text-secondary #41636a.
- Шрифт Inter, input font-size 15px.
- Disabled: opacity/серый фон #f3f6f7, cursor not-allowed.
- Error: border #c53b3b, helper text danger.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Input/TextField: label, input, hint. Стили SB. Без внешних библиотек.` },
      { id: 'error', label: 'Error', aiPrompt: `Создай Input с error: border danger, helper text. Без внешних библиотек.` },
      { id: 'disabled', label: 'Disabled', aiPrompt: `Создай Input disabled: серый фон, cursor not-allowed. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="form-group">
              <label class="form-label">Email для связи</label>
              <input class="form-input" type="email" placeholder="example@sb.local" />
              <span class="form-hint">Мы отправляем подтверждение в течение 15 минут</span>
            </div>
          </div>
        </div>
        <div data-variant-id="error">
          <span class="showcase-label">Error</span>
          <div class="showcase-demo">
            <div class="form-group is-error">
              <label class="form-label">Email для связи</label>
              <input class="form-input" type="email" value="invalid-email" />
              <span class="form-hint" style="color:var(--danger)">Введите корректный email</span>
            </div>
          </div>
        </div>
        <div data-variant-id="disabled">
          <span class="showcase-label">Disabled</span>
          <div class="showcase-demo">
            <div class="form-group">
              <label class="form-label">Email для связи</label>
              <input class="form-input" type="email" value="buyer@sb.local" disabled />
              <span class="form-hint">Поле недоступно для редактирования</span>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'Dropdown / Select',
    category: 'Form',
    desc: '<strong>Нативный select.</strong> Список отраслей для B2B-формы.',
    params: 'options[] · label · disabled',
    states: 'default · open · selected',
    aiPrompt: `Создай React-компонент Select (native) в стиле SB Design System.

Требования:
- Обертка с label и native select.
- Пропсы: label, options: { label, value }[], value, onChange, disabled, placeholder?.
- Стили как у input: white, border #d7dee1, radius 6px, padding 10px 14px, font-size 15px.
- Focus: border primary #008f95 + glow rgba(0,143,149,0.15).
- Использовать нативный select, но скрыть грубые дефолтные стили где возможно.
- Disabled: серый фон, text-secondary.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай native Select с label и options. Стили SB. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="form-group">
              <label class="form-label">Отрасль</label>
              <select class="form-select">
                <option>Нефтегазохимия</option>
                <option>Строительство</option>
                <option>Упаковка</option>
                <option>Автомобилестроение</option>
                <option>Медицина</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'Combobox',
    category: 'Form',
    desc: '<strong>Комбобокс — select с поиском и фильтрацией.</strong> Один или мульти-выбор, группировка, поиск по тексту, создание новых значений (onCreate), кастомный рендер, клавиатурная навигация. 5 состояний: default · focused · multi · error · disabled.',
    params: 'items[] · groups[] · value · multi · placeholder · searchable · onCreate · getLabel · getKey · getGroupId · renderItem · renderValue',
    states: 'default · focused · searching · has-value · multi · error · disabled · empty',
    aiPrompt: `Создай React-компонент Combobox в стиле SB Design System.

Требования:
- Select с поиском: single и multiple режимы.
- Пропсы: items, groups?, value, multiple?, placeholder, onChange, onCreate?, getItemLabel, getItemKey, getItemGroupKey, getItemDisabled.
- Dropdown с группами, поиском, empty state и кнопкой создания нового значения.
- Multi: выбранные элементы отображать тегами внутри input-wrap, у тегов кнопка удаления.
- Keyboard: ArrowUp/Down, Enter, Escape.
- Поле: white, border #d7dee1, radius 10px, min-height 48px, focus border #008f95 + glow.
- Option: padding 10px 12px, hover rgba(0,143,149,0.08), selected rgba(0,143,149,0.15).
- Error/disabled состояния.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'single', label: 'Single', aiPrompt: `Создай Combobox single select с поиском. Без внешних библиотек.` },
      { id: 'multi', label: 'Multi', aiPrompt: `Создай Combobox multi select с тегами. Без внешних библиотек.` },
      { id: 'grouped', label: 'Grouped', aiPrompt: `Создай Combobox с группировкой по категориям. Без внешних библиотек.` },
      { id: 'create', label: 'Create', aiPrompt: `Создай Combobox с onCreate для новых значений. Без внешних библиотек.` },
      { id: 'error-disabled', label: 'Error · Disabled', aiPrompt: `Создай Combobox is-error и is-disabled. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="single">
          <span class="showcase-label">Single</span>
          <div class="showcase-demo">
            <div class="sb-combobox" id="cb-demo-1">
              <div class="sb-combobox-wrapper">
                <div class="sb-combobox-input-wrap">
                  <input class="sb-combobox-input" type="text" placeholder="Выберите продукт..." autocomplete="off" />
                  <div class="sb-combobox-arrow">▼</div>
                </div>
                <div class="sb-combobox-dropdown"></div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="multi">
          <span class="showcase-label">Multi</span>
          <div class="showcase-demo">
            <div class="sb-combobox" id="cb-demo-2">
              <div class="sb-combobox-wrapper">
                <div class="sb-combobox-input-wrap">
                  <div class="sb-combobox-tags"></div>
                  <input class="sb-combobox-input" type="text" placeholder="Добавить...ссылоку" autocomplete="off" />
                  <button class="sb-combobox-clear" title="Очистить">${icon("close", 14)}</button>
                  <div class="sb-combobox-arrow">▼</div>
                </div>
                <div class="sb-combobox-dropdown"></div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="grouped">
          <span class="showcase-label">Grouped</span>
          <div class="showcase-demo">
            <div class="sb-combobox" id="cb-demo-3">
              <div class="sb-combobox-wrapper">
                <div class="sb-combobox-input-wrap">
                  <input class="sb-combobox-input" type="text" placeholder="Поиск в категориях..." autocomplete="off" />
                  <button class="sb-combobox-clear" title="Очистить">${icon("close", 14)}</button>
                  <div class="sb-combobox-arrow">▼</div>
                </div>
                <div class="sb-combobox-dropdown"></div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="create">
          <span class="showcase-label">Create</span>
          <div class="showcase-demo">
            <div class="sb-combobox" id="cb-demo-4">
              <div class="sb-combobox-wrapper">
                <div class="sb-combobox-input-wrap">
                  <input class="sb-combobox-input" type="text" placeholder="Введи и создай новое..." autocomplete="off" />
                  <button class="sb-combobox-clear" title="Очистить">${icon("close", 14)}</button>
                  <div class="sb-combobox-arrow">▼</div>
                </div>
                <div class="sb-combobox-dropdown"></div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="error-disabled">
          <span class="showcase-label">Error · Disabled</span>
          <div class="showcase-demo">
            <div style="display:flex;gap:20px;flex-wrap:wrap">
              <div class="sb-combobox is-error">
                <div class="sb-combobox-wrapper">
                  <div class="sb-combobox-input-wrap">
                    <input class="sb-combobox-input" type="text" placeholder="Ошибка" autocomplete="off" />
                    <div class="sb-combobox-arrow">▼</div>
                  </div>
                </div>
                <div class="sb-combobox-error">Это поле обязательно</div>
              </div>
              <div class="sb-combobox is-disabled">
                <div class="sb-combobox-wrapper">
                  <div class="sb-combobox-input-wrap">
                    <input class="sb-combobox-input" type="text" placeholder="Недоступно" autocomplete="off" disabled />
                    <div class="sb-combobox-arrow">▼</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'Slider',
    category: 'Form',
    desc: '<strong>Слайдер / диапазонный инпут.</strong> 7 вариантов: basic · minmax · step · range.',
    params: 'value · min · max · step (number | array) · view: default | division · mode: single | range · valueFrom · valueTo · label · disabled',
    states: 'default · hover · dragging · focus · disabled',
    aiPrompt: `Создай React-компонент Slider в стиле SB Design System.`,
    variants: [
      { id: 'basic', label: 'Basic', aiPrompt: `Создай Slider basic step=1, 0-100. Без внешних библиотек.` },
      { id: 'minmax', label: 'MinMax', aiPrompt: `Создай Slider min=20 max=70. Без внешних библиотек.` },
      { id: 'step-division', label: 'Step division', aiPrompt: `Создай Slider step=10 view=division. Без внешних библиотек.` },
      { id: 'step-array', label: 'Step array', aiPrompt: `Создай Slider step=[15,40,70]. Без внешних библиотек.` },
      { id: 'step-5', label: 'Step 5', aiPrompt: `Создай Slider step=5, max=50. Без внешних библиотек.` },
      { id: 'invalid', label: 'Invalid min/max', aiPrompt: `Создай Slider fallback при min>max. Без внешних библиотек.` },
      { id: 'range', label: 'Range', aiPrompt: `Создай Range Slider mode=range. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="basic">
          <span class="showcase-label">Basic</span>
          <div class="showcase-demo">
            <div class="sb-slider" data-slider data-min="0" data-max="100" data-step="1" data-value="20">
              <div class="sb-slider-label"><span>Значение: <strong class="sl-current">20</strong></span><span class="sl-val">20</span></div>
              <div class="sb-slider-track" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="20">
                <div class="sb-slider-rail"><div class="sb-slider-fill"></div></div>
                <div class="sb-slider-thumb"></div>
              </div>
              <div class="sb-slider-ticks"><span>0</span><span>100</span></div>
            </div>
          </div>
        </div>
        <div data-variant-id="minmax">
          <span class="showcase-label">MinMax</span>
          <div class="showcase-demo">
            <div class="sb-slider" data-slider data-min="20" data-max="70" data-step="1" data-value="50">
              <div class="sb-slider-label"><span>Значение: <strong class="sl-current">50</strong></span><span class="sl-val">50</span></div>
              <div class="sb-slider-track" tabindex="0" role="slider" aria-valuemin="20" aria-valuemax="70" aria-valuenow="50">
                <div class="sb-slider-rail"><div class="sb-slider-fill"></div></div>
                <div class="sb-slider-thumb"></div>
              </div>
              <div class="sb-slider-ticks"><span>20</span><span>70</span></div>
            </div>
          </div>
        </div>
        <div data-variant-id="step-division">
          <span class="showcase-label">Step division</span>
          <div class="showcase-demo">
            <div class="sb-slider is-division" data-slider data-min="0" data-max="100" data-step="10" data-value="20">
              <div class="sb-slider-label"><span>Значение: <strong class="sl-current">20</strong></span><span class="sl-val">20</span></div>
              <div class="sb-slider-track" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="20">
                <div class="sb-slider-rail"><div class="sb-slider-fill"></div></div>
                <div class="sb-slider-divisions"></div>
                <div class="sb-slider-thumb"></div>
              </div>
              <div class="sb-slider-ticks"><span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span></div>
            </div>
          </div>
        </div>
        <div data-variant-id="step-array">
          <span class="showcase-label">Step array</span>
          <div class="showcase-demo">
            <div class="sb-slider is-division" data-slider data-steps='[15,40,70]' data-min="0" data-max="100" data-value="15">
              <div class="sb-slider-label"><span>Значение: <strong class="sl-current">15</strong></span><span class="sl-val">15</span></div>
              <div class="sb-slider-track" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="15">
                <div class="sb-slider-rail"><div class="sb-slider-fill"></div></div>
                <div class="sb-slider-divisions"></div>
                <div class="sb-slider-thumb"></div>
              </div>
              <div class="sb-slider-ticks"><span>0</span><span>50</span><span>100</span></div>
            </div>
          </div>
        </div>
        <div data-variant-id="step-5">
          <span class="showcase-label">Step 5</span>
          <div class="showcase-demo">
            <div class="sb-slider" data-slider data-min="0" data-max="50" data-step="5" data-value="25">
              <div class="sb-slider-label"><span>Шаг 5: <strong class="sl-current">25</strong></span><span class="sl-val">25</span></div>
              <div class="sb-slider-track" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="50" aria-valuenow="25">
                <div class="sb-slider-rail"><div class="sb-slider-fill"></div></div>
                <div class="sb-slider-thumb"></div>
              </div>
              <div class="sb-slider-ticks"><span>0</span><span>50</span></div>
            </div>
          </div>
        </div>
        <div data-variant-id="invalid">
          <span class="showcase-label">Invalid min/max</span>
          <div class="showcase-demo">
            <div class="sb-slider" data-slider data-min="80" data-max="20" data-step="1" data-value="50">
              <div class="sb-slider-label"><span>Значение: <strong class="sl-current">50</strong></span><span class="sl-val">50</span></div>
              <div class="sb-slider-track" tabindex="0" role="slider" aria-valuenow="50">
                <div class="sb-slider-rail"><div class="sb-slider-fill"></div></div>
                <div class="sb-slider-thumb"></div>
              </div>
              <div class="sb-slider-ticks"><span>0</span><span>100</span></div>
            </div>
          </div>
        </div>
        <div data-variant-id="range">
          <span class="showcase-label">Range</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="sb-range-slider" data-range-slider data-min="0" data-max="100" data-from="10" data-to="70" data-step="1">
              <div class="sb-range-slider-meta"><span>0</span><strong data-range-label>10 — 70</strong><span>100</span></div>
              <div class="sb-range-slider-track" tabindex="0">
                <div class="sb-range-slider-rail"></div>
                <div class="sb-range-slider-fill"></div>
                <button type="button" class="sb-range-slider-thumb" data-thumb="from" aria-label="Минимум"></button>
                <button type="button" class="sb-range-slider-thumb" data-thumb="to" aria-label="Максимум"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'Select (Floating Label)',
    category: 'Form',
    desc: '<strong>Кастомный select с плавающим лейблом.</strong> Лейбл уменьшается и поднимается при фокусе / заполнении. 6 состояний: default · hover · focused (open) · filled · error · disabled · skeleton. Кликабельный, открывает выпадающий список вариантов.',
    params: 'title · placeholder · options[] · value · state · error',
    states: 'default · hover · focused · filled · error · disabled · skeleton',
    aiPrompt: `Создай React-компонент Select с floating label в стиле SB Design System.

Требования:
- Пропсы: title, placeholder, items, groups?, value, onChange, error?, disabled?, skeleton?.
- Поле: фон #f3f6f7, border transparent, radius 16px, min-height 52px.
- Focus/filled: белый фон, border primary #008f95, padding 8px 12px 8px 16px, glow rgba(0,143,149,0.12).
- Title в default 16px, в focused/filled 12px/600, цвет primary.
- Dropdown: white, border #d7dee1, radius 12px, shadow, option hover rgba(0,143,149,0.08), selected rgba(0,143,149,0.12).
- Поддержать группы: group label uppercase 11px/700.
- Error: border #c53b3b, розовый фон.
- Disabled и skeleton состояния.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Floating Select default. Без внешних библиотек.` },
      { id: 'filled', label: 'Filled', aiPrompt: `Создай Floating Select filled. Без внешних библиотек.` },
      { id: 'focused', label: 'Focused', aiPrompt: `Создай Floating Select focused open. Без внешних библиотек.` },
      { id: 'error', label: 'Error', aiPrompt: `Создай Floating Select error. Без внешних библиотек.` },
      { id: 'disabled', label: 'Disabled', aiPrompt: `Создай Floating Select disabled. Без внешних библиотек.` },
      { id: 'groups', label: 'Groups', aiPrompt: `Создай Floating Select с группами. Без внешних библиотек.` },
      { id: 'skeleton', label: 'Skeleton', aiPrompt: `Создай Floating Select skeleton. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-select" data-state="default" tabindex="0">
            <div class="sb-input-block">
              <div class="sb-wrap">
                <div class="sb-title">Отрасль</div>
                <div class="sb-placeholder">Выберите...</div>
                <div class="sb-value">—</div>
              </div>
              <div class="sb-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="sb-dropdown">
              <div class="sb-option" data-value="Нефтегазохимия">Нефтегазохимия</div>
              <div class="sb-option" data-value="Строительство">Строительство</div>
              <div class="sb-option" data-value="Упаковка">Упаковка</div>
              <div class="sb-option" data-value="Автомобилестроение">Автомобилестроение</div>
              <div class="sb-option" data-value="Медицина">Медицина</div>
            </div>
          </div>
          </div>
        </div>
        <div data-variant-id="filled">
          <span class="showcase-label">Filled</span>
          <div class="showcase-demo">
            <div class="sb-select is-filled" tabindex="0">
            <div class="sb-input-block">
              <div class="sb-wrap">
                <div class="sb-title">Отрасль</div>
                <div class="sb-placeholder">Выберите...</div>
                <div class="sb-value">Нефтегазохимия</div>
              </div>
              <div class="sb-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div data-variant-id="focused">
          <span class="showcase-label">Focused</span>
          <div class="showcase-demo">
            <div class="sb-select is-focused">
            <div class="sb-input-block">
              <div class="sb-wrap">
                <div class="sb-title">Отрасль</div>
                <div class="sb-placeholder">Выберите...</div>
                <div class="sb-value">Упаковка</div>
              </div>
              <div class="sb-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="sb-dropdown">
              <div class="sb-option">Нефтегазохимия</div>
              <div class="sb-option is-selected">Упаковка</div>
              <div class="sb-option">Строительство</div>
              <div class="sb-option">Медицина</div>
            </div>
          </div>
          </div>
        </div>
        <div data-variant-id="error">
          <span class="showcase-label">Error</span>
          <div class="showcase-demo">
            <div class="sb-select is-error">
            <div class="sb-input-block">
              <div class="sb-wrap">
                <div class="sb-title">Отрасль</div>
                <div class="sb-placeholder">Обязательное поле</div>
              </div>
              <div class="sb-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="sb-error-text">Выберите отрасль</div>
          </div>
          </div>
        </div>
        <div data-variant-id="disabled">
          <span class="showcase-label">Disabled</span>
          <div class="showcase-demo">
            <div class="sb-select is-disabled">
            <div class="sb-input-block">
              <div class="sb-wrap">
                <div class="sb-title">Отрасль</div>
                <div class="sb-placeholder">Недоступно</div>
              </div>
              <div class="sb-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div data-variant-id="groups">
          <span class="showcase-label">Groups</span>
          <div class="showcase-demo">
            <div class="sb-select" data-state="default" tabindex="0">
            <div class="sb-input-block">
              <div class="sb-wrap">
                <div class="sb-title">Значение</div>
                <div class="sb-placeholder">Выберите значение</div>
                <div class="sb-value">—</div>
              </div>
              <div class="sb-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="sb-dropdown">
              <div class="sb-select-group-label">Первая группа</div>
              <div class="sb-option" data-value="Первый">Первый</div>
              <div class="sb-option" data-value="Третий">Третий</div>
              <div class="sb-select-group-label">Вторая группа</div>
              <div class="sb-option" data-value="Второй">Второй</div>
              <div class="sb-option" data-value="Пятый">Пятый</div>
              <div class="sb-select-group-label">Третья группа</div>
              <div class="sb-option" data-value="Четвертый">Четвертый</div>
            </div>
          </div>
          </div>
        </div>
        <div data-variant-id="skeleton">
          <span class="showcase-label">Skeleton</span>
          <div class="showcase-demo">
            <div class="sb-select is-skeleton">
            <div class="sb-input-block">
              <div class="sb-wrap"><div class="sb-title">—</div></div>
              <div class="sb-arrow"></div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'AutoComplete',
    category: 'Form',
    desc: '<strong>Автодополнение с поиском.</strong> Поиск по списку с подсветкой совпадений, группировка, клавиатурная навигация (${icon("chevron-up", 14)}${icon("chevron-down", 14)} Enter Esc), мульти-режим с тегами. 3 формы: default · brick · round.',
    params: 'items[] · groups[] · form: default|brick|round · multi · placeholder · value · getLabel · getKey · getGroupId',
    states: 'default · focused · searching · has-value · error · disabled · loading · empty · multi',
    aiPrompt: `Создай React-компонент AutoComplete в стиле SB Design System.

Требования:
- Пропсы: items, groups?, value, onChange, placeholder, form: 'default' | 'brick' | 'round', multiple?, loading?, disabled?, error?.
- Поиск по label с подсветкой совпадений через mark.
- Dropdown с группировкой, empty state, selected state.
- Form: default radius 12px, brick radius 0, round radius 100px.
- Multi: выбранные значения тегами с remove.
- Input-wrap: фон #f3f6f7, focus white + border primary + glow.
- Keyboard: ArrowUp/Down, Enter, Escape.
- Clear button при has-value, spinner при loading.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай AutoComplete form=default с поиском. Без внешних библиотек.` },
      { id: 'brick', label: 'Brick', aiPrompt: `Создай AutoComplete form=brick. Без внешних библиотек.` },
      { id: 'round', label: 'Round multi', aiPrompt: `Создай AutoComplete form=round multi с тегами. Без внешних библиотек.` },
      { id: 'error', label: 'Error', aiPrompt: `Создай AutoComplete is-error. Без внешних библиотек.` },
      { id: 'disabled', label: 'Disabled', aiPrompt: `Создай AutoComplete is-disabled. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-autocomplete form-default" id="ac-demo-1">
              <div class="sb-ac-input-wrap">
                <input class="sb-ac-input" type="text" placeholder="Найти продукт..." autocomplete="off" />
                <button class="sb-ac-clear" title="Очистить">${icon("close", 14)}</button>
                <div class="sb-ac-spinner"></div>
              </div>
              <div class="sb-ac-dropdown"></div>
            </div>
          </div>
        </div>
        <div data-variant-id="brick">
          <span class="showcase-label">Brick</span>
          <div class="showcase-demo">
            <div class="sb-autocomplete form-brick" id="ac-demo-2">
              <div class="sb-ac-input-wrap">
                <input class="sb-ac-input" type="text" placeholder="Группы..." autocomplete="off" />
                <button class="sb-ac-clear" title="Очистить">${icon("close", 14)}</button>
              </div>
              <div class="sb-ac-dropdown"></div>
            </div>
          </div>
        </div>
        <div data-variant-id="round">
          <span class="showcase-label">Round multi</span>
          <div class="showcase-demo">
            <div class="sb-autocomplete form-round" id="ac-demo-3">
              <div class="sb-ac-input-wrap">
                <div class="sb-ac-tags"></div>
                <input class="sb-ac-input" type="text" placeholder="Мульти..." autocomplete="off" />
                <button class="sb-ac-clear" title="Очистить">${icon("close", 14)}</button>
              </div>
              <div class="sb-ac-dropdown"></div>
            </div>
          </div>
        </div>
        <div data-variant-id="error">
          <span class="showcase-label">Error</span>
          <div class="showcase-demo">
            <div class="sb-autocomplete form-default is-error" id="ac-demo-4">
              <div class="sb-ac-input-wrap">
                <input class="sb-ac-input" type="text" placeholder="Обязательно" autocomplete="off" />
              </div>
              <div class="sb-ac-error">Выберите значение</div>
            </div>
          </div>
        </div>
        <div data-variant-id="disabled">
          <span class="showcase-label">Disabled</span>
          <div class="showcase-demo">
            <div class="sb-autocomplete form-default is-disabled">
              <div class="sb-ac-input-wrap">
                <input class="sb-ac-input" type="text" placeholder="Недоступно" autocomplete="off" disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'Textarea',
    category: 'Form',
    desc: '<strong>Многострочное поле.</strong> Для комментариев, описаний, обратной связи.',
    params: 'rows · maxLength · resize',
    states: 'default · focus · filled',
    aiPrompt: `Создай React-компонент Textarea в стиле SB Design System.

Требования:
- Многострочное поле для комментариев.
- Пропсы: value, onChange, label, placeholder, rows, maxLength?, disabled?, error?, resize?.
- Стили: white background, border 1px #d7dee1, radius 6px, padding 10px 14px, font-size 15px, min-height 80px.
- Focus: border primary #008f95, glow rgba(0,143,149,0.15).
- Поддержать счетчик символов maxLength и helper text.
- Error: border danger #c53b3b, helper text danger.
- Disabled: серый фон #f3f6f7, cursor not-allowed.
- Шрифт Inter, line-height 1.5.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Textarea с label и placeholder. Стили SB. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="form-group">
              <label class="form-label">Комментарий к заявке</label>
              <textarea class="form-textarea" placeholder="Опишите задачу..."></textarea>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'TextField',
    category: 'Form',
    desc: '<strong>Универсальное поле ввода.</strong> Поддерживает 4 типа: <code>text</code> (одна строка), <code>textarea</code> (много строк), <code>number</code> (со степпером), <code>password</code> (с показом/скрытием). Включает label, hint, error, счётчик символов, leading/trailing иконки.',
    params: 'type: text|textarea|number|password · value · placeholder · cols · rows · step · disabled · maxLength · leadingIcon · trailingIcon · onChange',
    states: 'default · focus · filled · error · disabled',
    aiPrompt: `Создай React-компонент TextField в стиле SB Design System.

Требования:
- Универсальное поле: type 'text' | 'textarea' | 'number' | 'password'.
- Пропсы: value, onChange({ value }), placeholder, label?, hint?, error?, disabled?, rows?, cols?, step?, maxLength?, leadingIcon?, trailingIcon?.
- Text: однострочный input; textarea: rows и resize vertical; number: кастомный stepper вверх/вниз; password: кнопка показать/скрыть.
- Base: border #d7dee1, white, radius 6px, min-height 44px, padding 0 12px.
- Focus-within: border primary + glow rgba(0,143,149,0.12).
- Meta: hint слева, counter справа; error красный.
- Disabled и error состояния.
- Шрифт Inter, input 15px.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'text', label: 'Text', aiPrompt: `Создай TextField type=text с leading icon и hint. Без внешних библиотек.` },
      { id: 'textarea', label: 'Textarea', aiPrompt: `Создай TextField type=textarea с counter maxLength. Без внешних библиотек.` },
      { id: 'number', label: 'Number', aiPrompt: `Создай TextField type=number со stepper. Без внешних библиотек.` },
      { id: 'password', label: 'Password', aiPrompt: `Создай TextField type=password с toggle show/hide. Без внешних библиотек.` },
      { id: 'error-disabled', label: 'Error · Disabled', aiPrompt: `Создай TextField is-error и is-disabled. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="text">
          <span class="showcase-label">Text</span>
          <div class="showcase-demo">
            <div class="sb-textfield with-leading" data-textfield>
              <label class="sb-textfield-label">Email для связи</label>
              <div class="sb-textfield-control">
                <span class="sb-textfield-icon leading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input class="sb-tf-input" type="text" placeholder="example@sb.local" data-tf-input />
              </div>
              <div class="sb-textfield-meta"><span class="sb-tf-hint">Мы отправим подтверждение в течение 15 минут</span></div>
            </div>
          </div>
        </div>
        <div data-variant-id="textarea">
          <span class="showcase-label">Textarea</span>
          <div class="showcase-demo">
            <div class="sb-textfield" data-textfield data-maxlength="200">
              <label class="sb-textfield-label">Комментарий к заявке</label>
              <div class="sb-textfield-control">
                <textarea class="sb-tf-textarea" rows="3" placeholder="Опишите вашу задачу..." data-tf-input></textarea>
              </div>
              <div class="sb-textfield-meta">
                <span class="sb-tf-hint">Максимум 200 символов</span>
                <span class="sb-textfield-counter" data-tf-counter>0 / 200</span>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="number">
          <span class="showcase-label">Number</span>
          <div class="showcase-demo">
            <div class="sb-textfield has-stepper" data-textfield data-step="2">
              <label class="sb-textfield-label">Количество</label>
              <div class="sb-textfield-control">
                <input class="sb-tf-input" type="number" step="2" value="0" min="0" placeholder="Здесь цифры" data-tf-input />
                <div class="sb-tf-stepper"><button type="button" data-tf-up>▲</button><button type="button" data-tf-down>▼</button></div>
              </div>
              <div class="sb-textfield-meta"><span class="sb-tf-hint">Шаг = 2</span></div>
            </div>
          </div>
        </div>
        <div data-variant-id="password">
          <span class="showcase-label">Password</span>
          <div class="showcase-demo">
            <div class="sb-textfield with-trailing" data-textfield>
              <label class="sb-textfield-label">Пароль</label>
              <div class="sb-textfield-control">
                <input class="sb-tf-input" type="password" placeholder="Введите пароль" data-tf-input data-tf-password />
                <button type="button" class="sb-textfield-icon trailing" data-tf-toggle-password title="Показать пароль">
                  <svg class="icon-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg class="icon-eye-off" style="display:none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <div class="sb-textfield-meta"><span class="sb-tf-hint">Минимум 8 символов</span></div>
            </div>
          </div>
        </div>
        <div data-variant-id="error-disabled">
          <span class="showcase-label">Error · Disabled</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-direction:column;gap:16px;max-width:360px;width:100%">
              <div class="sb-textfield is-error" data-textfield>
                <label class="sb-textfield-label">Телефон</label>
                <div class="sb-textfield-control"><input class="sb-tf-input" type="tel" value="+7 000 000-00-00" data-tf-input /></div>
                <div class="sb-textfield-meta"><span class="sb-textfield-error">Неверный формат номера</span></div>
              </div>
              <div class="sb-textfield is-disabled" data-textfield>
                <label class="sb-textfield-label">ИНН</label>
                <div class="sb-textfield-control"><input class="sb-tf-input" type="text" value="7704678901" disabled data-tf-input /></div>
                <div class="sb-textfield-meta"><span class="sb-tf-hint">Заполнено автоматически</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'Checkbox',
    category: 'Form',
    desc: '<strong>Чекбокс.</strong> Согласия, множественный выбор. 4 размера: XS, S, M, L.',
    params: 'checked · disabled · indeterminate (док.) · size: xs | s | m | l · label',
    states: 'unchecked · checked · disabled · indeterminate',
    aiPrompt: `Создай React-компонент Checkbox в стиле SB Design System.

Требования:
- Пропсы: checked, onChange, label, disabled?, indeterminate?, size?: 'xs' | 's' | 'm' | 'l' (default 'm').
- Размеры control: xs 14${icon("close", 14)}14, s 16${icon("close", 14)}16, m 18${icon("close", 14)}18, l 22${icon("close", 14)}22; border 2px #d7dee1, radius 4px (l: 5px).
- Label font-size: xs 12px, s 13px, m 15px, l 16px; gap: xs 6px, s 7px, m 8px, l 10px.
- Checked: фон primary #008f95, border primary, белая галочка.
- Indeterminate: фон primary, белая горизонтальная линия.
- Hover: border primary. Focus-visible: ring rgba(0,143,149,0.2).
- Disabled: opacity 0.5, cursor not-allowed.
- Доступность: input type checkbox, label wrapping.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'sizes', label: 'Sizes', aiPrompt: `Создай Checkbox sizes xs/s/m/l. Без внешних библиотек.` },
      { id: 'states', label: 'States', aiPrompt: `Создай Checkbox states: unchecked, checked, disabled. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="sizes">
          <span class="showcase-label">Sizes</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start">
              <label class="checkbox size-xs"><input type="checkbox" checked /><span>Получать новости · XS</span></label>
              <label class="checkbox size-s"><input type="checkbox" checked /><span>Согласен с условиями · S</span></label>
              <label class="checkbox size-m"><input type="checkbox" /><span>Email-уведомления · M</span></label>
              <label class="checkbox size-l"><input type="checkbox" checked /><span>Маркетинговые рассылки · L</span></label>
            </div>
          </div>
        </div>
        <div data-variant-id="states">
          <span class="showcase-label">States</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start">
              <label class="checkbox size-m"><input type="checkbox" /><span>Не выбран</span></label>
              <label class="checkbox size-m"><input type="checkbox" checked /><span>Выбран</span></label>
              <label class="checkbox size-m"><input type="checkbox" disabled /><span>Disabled</span></label>
              <label class="checkbox size-m"><input type="checkbox" checked disabled /><span>Disabled checked</span></label>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'Radio',
    category: 'Form',
    desc: '<strong>Радио-группа.</strong> Единичный выбор: тип контрагента, способ доставки. 4 размера: XS, S, M, L.',
    params: 'name · value · checked · disabled · size: xs | s | m | l · label',
    states: 'default · selected · disabled',
    aiPrompt: `Создай React-компонент Radio / RadioGroup в стиле SB Design System.

Требования:
- RadioGroup props: name, value, onChange, size?: 'xs' | 's' | 'm' | 'l', items: { label, value, disabled? }[].
- Размеры control: xs 14${icon("close", 14)}14, s 16${icon("close", 14)}16, m 18${icon("close", 14)}18, l 22${icon("close", 14)}22; border 2px #d7dee1, круг.
- Внутренний dot при selected: ~44% диаметра, primary #008f95; border тоже primary.
- Label font-size: xs 12px, s 13px, m 15px, l 16px; gap как у Checkbox.
- Hover: border primary; focus-visible ring rgba(0,143,149,0.2).
- Disabled: opacity 0.5, cursor not-allowed.
- Доступность: input type radio, одинаковый name, label wrapping.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'sizes', label: 'Sizes', aiPrompt: `Создай Radio sizes xs/s/m/l. Без внешних библиотек.` },
      { id: 'states', label: 'States', aiPrompt: `Создай Radio states: selected, unselected, disabled. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="sizes">
          <span class="showcase-label">Sizes</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-direction:column;gap:12px">
              <div style="display:flex;flex-wrap:wrap;gap:16px 24px;align-items:center">
                <label class="radio-item size-xs"><input type="radio" name="entity-xs" checked /><span>Юр. лицо · XS</span></label>
                <label class="radio-item size-xs"><input type="radio" name="entity-xs" /><span>Физ. лицо</span></label>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:16px 24px;align-items:center">
                <label class="radio-item size-s"><input type="radio" name="entity-s" checked /><span>Юр. лицо · S</span></label>
                <label class="radio-item size-s"><input type="radio" name="entity-s" /><span>Физ. лицо</span></label>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:16px 24px;align-items:center">
                <label class="radio-item size-m"><input type="radio" name="entity-m" checked /><span>Юр. лицо · M</span></label>
                <label class="radio-item size-m"><input type="radio" name="entity-m" /><span>Физ. лицо</span></label>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:16px 24px;align-items:center">
                <label class="radio-item size-l"><input type="radio" name="entity-l" checked /><span>Юр. лицо · L</span></label>
                <label class="radio-item size-l"><input type="radio" name="entity-l" /><span>Физ. лицо</span></label>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="states">
          <span class="showcase-label">States</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-wrap:wrap;gap:16px 24px;align-items:center">
              <label class="radio-item size-m"><input type="radio" name="entity-st" checked /><span>Выбран</span></label>
              <label class="radio-item size-m"><input type="radio" name="entity-st" /><span>Не выбран</span></label>
              <label class="radio-item size-m"><input type="radio" name="entity-st2" disabled /><span>Disabled</span></label>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'Switch',
    category: 'Form',
    desc: '<strong>Переключатель (Toggle).</strong> Используется для мгновенного изменения настроек. Поддерживает 4 размера (XS, S, M, L), подписи и состояния disabled.',
    params: 'size: xs | s | m | l · label · checked · disabled',
    states: 'checked · unchecked · disabled',
    aiPrompt: `Создай React-компонент Switch в стиле SB Design System.

Требования:
- Пропсы: checked, onChange, label?, size: 'xs' | 's' | 'm' | 'l', disabled?.
- Размеры: xs 28x16, s 36x20, m 44x24, l 52x28.
- Track: border-radius 100px, off #c5d0d3, on primary #008f95.
- Thumb: white circle, shadow 0 2px 4px rgba(0,0,0,0.15), плавный transform.
- Клик по label переключает значение.
- Label: 14px/500, text-main #123a45, gap 10px.
- Disabled: opacity 0.5, cursor not-allowed.
- Доступность: input type checkbox или role switch, aria-checked.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'sizes', label: 'Sizes', aiPrompt: `Создай Switch sizes xs/s/m/l. Без внешних библиотек.` },
      { id: 'states', label: 'States', aiPrompt: `Создай Switch disabled on/off. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="sizes">
          <span class="showcase-label">Sizes</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-direction:column;gap:16px">
              <label class="switch-wrap"><div class="switch size-xs"><input type="checkbox" checked /><span class="slider"></span></div><span class="switch-label">Размер XS</span></label>
              <label class="switch-wrap"><div class="switch size-s"><input type="checkbox" checked /><span class="slider"></span></div><span class="switch-label">Размер S</span></label>
              <label class="switch-wrap"><div class="switch size-m"><input type="checkbox" /><span class="slider"></span></div><span class="switch-label">Размер M</span></label>
              <label class="switch-wrap"><div class="switch size-l"><input type="checkbox" /><span class="slider"></span></div><span class="switch-label">Размер L</span></label>
            </div>
          </div>
        </div>
        <div data-variant-id="states">
          <span class="showcase-label">States</span>
          <div class="showcase-demo">
            <div style="display:flex;gap:32px;flex-wrap:wrap">
              <label class="switch-wrap"><div class="switch size-m is-disabled"><input type="checkbox" disabled /><span class="slider"></span></div><span class="switch-label">Disabled Off</span></label>
              <label class="switch-wrap"><div class="switch size-m is-disabled"><input type="checkbox" checked disabled /><span class="slider"></span></div><span class="switch-label">Disabled On</span></label>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'ChoiceGroup',
    category: 'Form',
    desc: '<strong>Группа переключателей.</strong> Segmented control — выбор одного или нескольких вариантов из фиксированного набора. Поддерживает иконки, 3 формы, 4 размера, 3 вида оформления и мультивыбор.',
    params: 'items[] · value · multiple · form: default|brick|round · size: xs|s|m|l · view: primary|ghost|secondary · width: default|full · getItemLabel · getItemIcon · getItemDisabled',
    states: 'default · selected · hover · active · disabled · focus',
    aiPrompt: `Создай React-компонент ChoiceGroup в стиле SB Design System.

Требования:
- Segmented control для single и multiple выбора.
- Пропсы: items: { label, icon?, disabled? }[], value, onChange, multiple?, form: 'default' | 'brick' | 'round', size: 'xs' | 's' | 'm' | 'l', view: 'primary' | 'ghost' | 'secondary', width: 'default' | 'full'.
- form default radius 12px, brick radius 0, round radius 100px.
- size xs/s/m/l: min-height 28/34/40/48px, padding адаптивный.
- view primary: selected фон #008f95, текст #fff; hover rgba(0,143,149,0.08).
- view secondary: container border #d7dee1, selected белый фон + тень.
- view ghost: без фона контейнера, разделители border-right.
- Icon слева через currentColor.
- Disabled: opacity 0.5, cursor not-allowed.
- Доступность: radio для single, checkbox для multiple, focus-visible.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'primary', label: 'Primary', aiPrompt: `Создай ChoiceGroup view=primary. Без внешних библиотек.` },
      { id: 'round', label: 'Round + icons', aiPrompt: `Создай ChoiceGroup form=round с иконками. Без внешних библиотек.` },
      { id: 'views', label: 'Ghost · Secondary', aiPrompt: `Создай ChoiceGroup view ghost и secondary. Без внешних библиотек.` },
      { id: 'multiple', label: 'Multiple', aiPrompt: `Создай ChoiceGroup multiple checkbox. Без внешних библиотек.` },
      { id: 'full', label: 'Full width', aiPrompt: `Создай ChoiceGroup width=full form=brick. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="primary">
          <span class="showcase-label">Primary</span>
          <div class="showcase-demo">
            <div class="sb-choice-group view-primary form-default size-m" data-choice-group data-single>
              <label class="sb-choice-item is-selected"><input type="radio" name="cg-1" checked /><span>Физ. лицо</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-1" /><span>Юр. лицо</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-1" /><span>ИП</span></label>
          </div>
        </div>
        <div data-variant-id="round">
          <span class="showcase-label">Round + icons</span>
          <div class="showcase-demo">
            <div class="sb-choice-group view-primary form-round size-m" data-choice-group data-single>
              <label class="sb-choice-item is-selected"><input type="radio" name="cg-2" checked /><span class="sb-choice-icon">📄</span><span>Документ</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-2" /><span class="sb-choice-icon">${icon("bar-chart", 16)}</span><span>Отчёт</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-2" /><span class="sb-choice-icon">📈</span><span>Аналитика</span></label>
          </div>
        </div>
        <div data-variant-id="views">
          <span class="showcase-label">Ghost · Secondary</span>
          <div class="showcase-demo">
            <div class="sb-choice-group view-primary form-default size-xs" data-choice-group data-single>
              <label class="sb-choice-item is-selected"><input type="radio" name="cg-3" checked /><span>XS</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-3" /><span>Компактный</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-3" /><span>Маленький</span></label>
            </div>
            <div class="sb-choice-group view-primary form-default size-s" data-choice-group data-single>
              <label class="sb-choice-item is-selected"><input type="radio" name="cg-4" checked /><span>S</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-4" /><span>Малый</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-4" /><span>Средний</span></label>
            </div>
            <div class="sb-choice-group view-primary form-default size-m" data-choice-group data-single>
              <label class="sb-choice-item is-selected"><input type="radio" name="cg-5" checked /><span>M</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-5" /><span>Стандарт</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-5" /><span>Большой</span></label>
            </div>
            <div class="sb-choice-group view-primary form-default size-l" data-choice-group data-single>
              <label class="sb-choice-item is-selected"><input type="radio" name="cg-6" checked /><span>L</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-6" /><span>Крупный</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-6" /><span>Большой</span></label>
            </div>
          </div>
          </div>
        </div>
        <div data-variant-id="multiple">
          <span class="showcase-label">Multiple</span>
          <div class="showcase-demo">
            <div class="sb-choice-group view-secondary form-default size-m" data-choice-group data-single>
              <label class="sb-choice-item is-selected"><input type="radio" name="cg-7" checked /><span>Неделя</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-7" /><span>Месяц</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-7" /><span>Квартал</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-7" /><span>Год</span></label>
            </div>
            <div class="sb-choice-group view-ghost form-default size-m" data-choice-group data-single>
              <label class="sb-choice-item is-selected"><input type="radio" name="cg-8" checked /><span>Список</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-8" /><span>Плитка</span></label>
              <label class="sb-choice-item"><input type="radio" name="cg-8" /><span>Таблица</span></label>
            </div>
          </div>
          </div>
        </div>
        <div data-variant-id="full">
          <span class="showcase-label">Full width</span>
          <div class="showcase-demo">
            <div class="sb-choice-group view-primary form-default size-m" data-choice-group data-multi>
              <label class="sb-choice-item is-selected"><input type="checkbox" name="cg-9" checked /><span class="sb-choice-icon">${icon("mail", 16)}</span><span>Email</span></label>
              <label class="sb-choice-item is-selected"><input type="checkbox" name="cg-9" checked /><span class="sb-choice-icon">${icon('phone', 16)}</span><span>SMS</span></label>
              <label class="sb-choice-item"><input type="checkbox" name="cg-9" /><span class="sb-choice-icon">${icon("bell", 18)}</span><span>Push</span></label>
              <label class="sb-choice-item"><input type="checkbox" name="cg-9" /><span class="sb-choice-icon">📨</span><span>Telegram</span></label>
          </div>
        </div>
      </div>
    `
  },
  {
    name: 'Card Collection',
    category: 'Layout',
    desc: '<strong>Коллекция мини-карточек.</strong> Сетка «Отраслевые решения» и иконки направлений.',
    params: 'cols: 4 · gap: 12 · hover-state',
    states: 'default · hover',
    aiPrompt: `Создай React-компонент CardCollection в стиле SB Design System.

Требования:
- Сетка мини-карточек для отраслевых решений.
- Пропсы: items: { label, icon?, href? }[], cols?: number, gap?: number.
- Карточки: white background, border 1px #d7dee1, radius 6px, padding 14px 10px, text-align center.
- Иконка: 36x36px, фон rgba(0,143,149,0.1), цвет primary #008f95, radius 8px.
- Hover: border primary, text primary, transform translateY(-2px), shadow card.
- Адаптив: desktop 4 колонки, mobile 2 колонки.
- Шрифт Inter, label 12px/600.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай CardCollection: сетка мини-карточек 4 колонки. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="cases">
              <div class="case-mini"><div class="case-icon">${icon("factory", 18)}</div>Нефтегаз</div>
              <div class="case-mini"><div class="case-icon">${icon("layers", 18)}</div>Стройка</div>
              <div class="case-mini"><div class="case-icon">${icon("package", 18)}</div>Упаковка</div>
              <div class="case-mini"><div class="case-icon">${icon("recycle", 18)}</div>Экономика</div>
            </div>
          </div>
        </div>
      </div> `
  },
    {
    name: 'Accordion',
    category: 'Disclosure',
    desc: '<strong>Аккордеон.</strong> Нативный <code style="font-size:11px;background:var(--neutral-bg);padding:1px 4px;border-radius:3px">&lt;details&gt;</code>/<code style="font-size:11px;background:var(--neutral-bg);padding:1px 4px;border-radius:3px">&lt;summary&gt;</code>, без JS.',
    params: 'multiple · open (булевый атрибут)',
    states: 'closed · open',
    aiPrompt: `Создай React-компонент Accordion в стиле SB Design System.

Требования:
- Disclosure-компонент для раскрытия/скрытия контента.
- Пропсы: items: { title, content }[], multiple?: boolean, defaultOpen?: number[].
- Использовать button header и div content (или details/summary), поддержать keyboard.
- Item: white background, border #d7dee1, radius 6px, overflow hidden.
- Summary/header: padding 12px 16px, font-size 14px, font-weight 600, hover background #f7fafa.
- Иконка + справа, при open поворот на 45 градусов.
- Body: padding 0 16px 14px, font-size 13px, text-secondary #41636a.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Accordion на details/summary. Без внешних библиотек.` },
      { id: 'single-open', label: 'Single open', aiPrompt: `Создай Accordion: только один пункт открыт. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="accordion">
              <details open>
                <summary>Что такое полимеры?</summary>
                <div class="acc-body">Высокомолекулярные соединения, состоящие из повторяющихся мономерных звеньев.</div>
              </details>
              <details>
                <summary>Как купить продукцию?</summary>
                <div class="acc-body">Оставьте заявку через форму, менеджер свяжется в течение рабочего дня.</div>
              </details>
              <details>
                <summary>Доставка и логистика</summary>
                <div class="acc-body">Собственный парк цистерн и контейнеров, доставка по РФ и СНГ.</div>
              </details>
            </div>
          </div>
        </div>
        <div data-variant-id="single-open">
          <span class="showcase-label">Single open</span>
          <div class="showcase-demo">
            <div class="accordion">
              <details>
                <summary>Раздел 1</summary>
                <div class="acc-body">Контент первого раздела.</div>
              </details>
              <details open>
                <summary>Раздел 2 · открыт</summary>
                <div class="acc-body">Активный раздел с подробным описанием.</div>
              </details>
              <details>
                <summary>Раздел 3</summary>
                <div class="acc-body">Скрытый контент третьего раздела.</div>
              </details>
            </div>
          </div>
        </div>
      </div> `
  },

  /* ===== Layout / Content ===== */
    /* ===== Content ===== */
  {
    name: 'News Tile',
    category: 'Content',
    desc: '<strong>Плитка новости.</strong> Карточка с обложкой, тегом, датой и заголовком.',
    params: 'tag · date · title · image',
    states: 'default · hover',
    aiPrompt: `Создай React-компонент NewsTile в стиле SB Design System.

Требования:
- Карточка новости с обложкой, тегом, датой и заголовком.
- Пропсы: tag, date, title, imageUrl?, href?.
- Карточка: white background, border #d7dee1, radius 10px, overflow hidden, max-width 300px.
- Изображение: высота 120px, background image/gradient, tag сверху слева.
- Tag: фон accent-orange #e67e22, white text, radius 20px, 11px/600.
- Body: padding 14px, date 12px text-secondary, title 15px/600, line-height 1.35.
- Hover: shadow card, pointer cursor.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай NewsTile: обложка, тег, дата, заголовок. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="news-tile">
              <div class="nt-img"><span class="nt-tag">Пресс-релиз</span></div>
              <div class="nt-body">
                <div class="nt-date">14 марта 2026</div>
                <h4 class="nt-title">SB наращивает выпуск Ecolen с вовлечением вторичного сырья</h4>
              </div>
            </div>
          </div>
        </div>
      </div> `
  },

  /* ===== Navigation ===== */
  {
    name: 'Navbar / Header',
    category: 'Navigation',
    desc: '<strong>Шапка сайта.</strong> Корпоративная навигация SB: 5 вариантов оформления (light · dark · ghost · search · minimal) и 3 размера (S · M · L). Логотип, меню, CTA, опциональный поиск и burger для mobile.',
    params: 'variant: light|dark|ghost|search|minimal · size: s|m|l · logo · links[] · actions · showSearch · sticky',
    states: 'default · dark · ghost · compact · large · with-search · minimal · sticky',
    aiPrompt: `Создай React-компонент Navbar/Header в стиле SB Design System.

Требования:
- Корпоративная шапка сайта с логотипом SB слева, центральным меню и CTA-действиями справа.
- Пропсы: variant: 'light' | 'dark' | 'ghost' | 'search' | 'minimal', size: 's' | 'm' | 'l', logo, links: { label, href }[], actions?, showSearch?, sticky?: boolean.
- Размеры: S (48px) — компактная, M (64px) — стандарт, L (72px) — крупная.
- Варианты: light (белый фон), dark (градиент #003d45${icon("chevron-right", 14)}#006b74), ghost (прозрачная), search (центральный поиск), minimal (логотип + burger + CTA).
- Desktop: горизонтальная навигация. Mobile: burger, drawer.
- Actions: ghost "Войти" + primary "Связаться".
- Стиль SB: primary #008f95, border #d7dee1, Inter 14px.
- Доступность: nav aria-label, burger aria-expanded.
- Без внешних UI-библиотек.`,
    variants: [
      {
        id: 'light-m',
        label: 'Light · size M (default)',
        aiPrompt: `Создай React-компонент Navbar/Header (вариант light, размер M) в стиле SB Design System.

Требования:
- Белый фон, border снизу #d7dee1, min-height 64px, padding 12px 20px.
- Логотип SB слева, центральное меню (4 ссылки, активная — primary), справа ghost «Войти» + primary «Связаться» (btn-s).
- Пропсы: variant="light", size="m", links: { label, href }[], actions.
- Стиль: primary #008f95, Inter 14px, font-weight 500 для ссылок.
- nav aria-label, семантическая разметка.
- Без внешних UI-библиотек.`
      },
      {
        id: 'light-s',
        label: 'Light · size S (compact)',
        aiPrompt: `Создай React-компонент Navbar/Header (вариант light, размер S) в стиле SB Design System.

Требования:
- Компактная шапка: min-height 48px, padding 8px 16px, белый фон.
- Логотип, 3 пункта меню, ghost «Войти» + primary «Связаться» (btn-xs).
- Пропсы: variant="light", size="s".
- Стиль SB: primary #008f95, border #d7dee1.
- Без внешних UI-библиотек.`
      },
      {
        id: 'light-l',
        label: 'Light · size L (large)',
        aiPrompt: `Создай React-компонент Navbar/Header (вариант light, размер L) в стиле SB Design System.

Требования:
- Крупная шапка: min-height 72px, padding 16px 24px, белый фон.
- Логотип (увеличенный), 4 пункта меню, ghost «Войти» + primary «Связаться» (btn-m).
- Пропсы: variant="light", size="l".
- Стиль SB: primary #008f95.
- Без внешних UI-библиотек.`
      },
      {
        id: 'dark-m',
        label: 'Dark · size M',
        aiPrompt: `Создай React-компонент Navbar/Header (вариант dark, размер M) в стиле SB Design System.

Требования:
- Фон: градиент #003d45 → #006b74, белый текст ссылок, активная ссылка — #7ee8ec.
- Ghost-кнопка «Войти»: белый текст, border rgba(255,255,255,0.35). Primary «Связаться» — стандартная.
- min-height 64px, padding 12px 20px.
- Пропсы: variant="dark", size="m".
- Без внешних UI-библиотек.`
      },
      {
        id: 'ghost-m',
        label: 'Ghost · size M',
        aiPrompt: `Создай React-компонент Navbar/Header (вариант ghost, размер M) в стиле SB Design System.

Требования:
- Прозрачный фон, без border, для наложения на hero/изображение.
- Логотип, меню, CTA как в light. Текст тёмный (#123a45).
- Пропсы: variant="ghost", size="m".
- Без внешних UI-библиотек.`
      },
      {
        id: 'search-m',
        label: 'With search · size M',
        aiPrompt: `Создай React-компонент Navbar/Header (вариант search, размер M) в стиле SB Design System.

Требования:
- Логотип слева, центральное поле поиска (input + иконка лупы), CTA справа.
- Поле поиска: фон #f5f9f9, border-radius 8px, placeholder «Поиск по сайту…».
- Пропсы: variant="search", size="m", showSearch.
- Без внешних UI-библиотек.`
      },
      {
        id: 'minimal-s',
        label: 'Minimal · size S',
        aiPrompt: `Создай React-компонент Navbar/Header (вариант minimal, размер S) в стиле SB Design System.

Требования:
- Компактная mobile-first шапка: burger слева, логотип по центру, одна primary CTA «Связаться» справа.
- min-height 48px, без горизонтального меню на desktop в этом варианте.
- Burger: aria-label="Меню", aria-expanded.
- Пропсы: variant="minimal", size="s".
- Без внешних UI-библиотек.`
      }
    ],
    demo: `
      <div class="navbar-showcase">

        <div class="navbar-showcase-item" data-variant-id="light-m">
          <span class="navbar-showcase-label">Light · size M (default)</span>
          <div class="navbar-demo navbar--light navbar--m">
            <div class="navbar-inner">
              <div class="nav-logo"><img src="logo-mark.png" alt="SB" class="nav-logo-mark" width="30" height="30" /><span class="nav-logo-title">SB</span></div>
              <ul class="nav-links">
                <li><a href="#" class="is-active">Компания</a></li>
                <li><a href="#">Продукция</a></li>
                <li><a href="#">Клиентам</a></li>
                <li><a href="#">Карьера</a></li>
              </ul>
              <div class="nav-actions">
                <button type="button" class="btn btn-ghost btn-s">Войти</button>
                <button type="button" class="btn btn-primary btn-s">Связаться</button>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar-showcase-item" data-variant-id="light-s">
          <span class="navbar-showcase-label">Light · size S (compact)</span>
          <div class="navbar-demo navbar--light navbar--s">
            <div class="navbar-inner">
              <div class="nav-logo"><img src="logo-mark.png" alt="SB" class="nav-logo-mark" width="30" height="30" /><span class="nav-logo-title">SB</span></div>
              <ul class="nav-links">
                <li><a href="#">Компания</a></li>
                <li><a href="#">Продукция</a></li>
                <li><a href="#">Клиентам</a></li>
              </ul>
              <div class="nav-actions">
                <button type="button" class="btn btn-ghost btn-xs">Войти</button>
                <button type="button" class="btn btn-primary btn-xs">Связаться</button>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar-showcase-item" data-variant-id="light-l">
          <span class="navbar-showcase-label">Light · size L (large)</span>
          <div class="navbar-demo navbar--light navbar--l">
            <div class="navbar-inner">
              <div class="nav-logo"><img src="logo-mark.png" alt="SB" class="nav-logo-mark" width="30" height="30" /><span class="nav-logo-title">SB</span></div>
              <ul class="nav-links">
                <li><a href="#">Компания</a></li>
                <li><a href="#">Продукция</a></li>
                <li><a href="#">Клиентам</a></li>
                <li><a href="#">Карьера</a></li>
              </ul>
              <div class="nav-actions">
                <button type="button" class="btn btn-ghost btn-m">Войти</button>
                <button type="button" class="btn btn-primary btn-m">Связаться</button>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar-showcase-item" data-variant-id="dark-m">
          <span class="navbar-showcase-label">Dark · size M</span>
          <div class="navbar-demo navbar--dark navbar--m">
            <div class="navbar-inner">
              <div class="nav-logo"><img src="logo-mark.png" alt="SB" class="nav-logo-mark" width="30" height="30" /><span class="nav-logo-title">SB</span></div>
              <ul class="nav-links">
                <li><a href="#" class="is-active">Компания</a></li>
                <li><a href="#">Продукция</a></li>
                <li><a href="#">Клиентам</a></li>
                <li><a href="#">Карьера</a></li>
              </ul>
              <div class="nav-actions">
                <button type="button" class="btn btn-ghost btn-s">Войти</button>
                <button type="button" class="btn btn-primary btn-s">Связаться</button>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar-showcase-item navbar-showcase-item--ghost" data-variant-id="ghost-m">
          <span class="navbar-showcase-label">Ghost · size M</span>
          <div class="navbar-demo navbar--ghost navbar--m">
            <div class="navbar-inner">
              <div class="nav-logo"><img src="logo-mark.png" alt="SB" class="nav-logo-mark" width="30" height="30" /><span class="nav-logo-title">SB</span></div>
              <ul class="nav-links">
                <li><a href="#">Компания</a></li>
                <li><a href="#">Продукция</a></li>
                <li><a href="#">Клиентам</a></li>
                <li><a href="#">Карьера</a></li>
              </ul>
              <div class="nav-actions">
                <button type="button" class="btn btn-ghost btn-s">Войти</button>
                <button type="button" class="btn btn-primary btn-s">Связаться</button>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar-showcase-item" data-variant-id="search-m">
          <span class="navbar-showcase-label">With search · size M</span>
          <div class="navbar-demo navbar--light navbar--m navbar--search">
            <div class="navbar-inner">
              <div class="nav-logo"><img src="logo-mark.png" alt="SB" class="nav-logo-mark" width="30" height="30" /><span class="nav-logo-title">SB</span></div>
              <div class="nav-search">
                <span class="nav-search-icon">${icon("search", 16)}</span>
                <input type="search" class="nav-search-input" placeholder="Поиск по сайту..." aria-label="Поиск" />
              </div>
              <div class="nav-actions">
                <button type="button" class="btn btn-ghost btn-s">Войти</button>
                <button type="button" class="btn btn-primary btn-s">Связаться</button>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar-showcase-item" data-variant-id="minimal-s">
          <span class="navbar-showcase-label">Minimal · size S</span>
          <div class="navbar-demo navbar--minimal navbar--s">
            <div class="navbar-inner">
              <button type="button" class="nav-burger" aria-label="Меню">${icon("menu", 18)}</button>
              <div class="nav-logo"><img src="logo-mark.png" alt="SB" class="nav-logo-mark" width="30" height="30" /><span class="nav-logo-title">SB</span></div>
              <div class="nav-actions">
                <button type="button" class="btn btn-primary btn-s">Связаться</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    `
  },
  {
    name: 'Collapse',
    category: 'Disclosure',
    status: 'stable',
    desc: '<strong>Раскрывающаяся панель.</strong> Одиночный collapse: иконки chevron / plus / caret / без иконки, размеры S/M/L, виды bordered / ghost / filled. Подзаголовок, extra справа.',
    params: 'open · defaultOpen · onToggle · title · subtitle · children · icon: chevron-left|chevron-right|plus|caret|none · size: s|m|l · view: bordered|ghost|filled · extra · disabled',
    states: 'collapsed · open · hover · disabled',
    aiPrompt: `Создай React-компонент Collapse в стиле SB Design System.

Требования:
- Одиночная раскрывающаяся панель (не группа).
- Пропсы: open?, defaultOpen?, onToggle?, title, subtitle?, children, icon?: 'chevron-left'|'chevron-right'|'plus'|'caret'|'none', size?: 's'|'m'|'l', view?: 'bordered'|'ghost'|'filled', extra?: ReactNode, disabled?.
- Trigger: button, aria-expanded, padding s 12${icon("close", 14)}14 / m 16${icon("close", 14)}18 / l 18${icon("close", 14)}20.
- Панель: grid 0fr${icon("chevron-right", 14)}1fr анимация, border-top при open.
- icon chevron-left: SVG справа от иконки слева, rotate 90° при open.
- icon chevron-right: иконка справа, rotate 90°.
- icon plus: + ${icon("chevron-right", 14)} ${icon("close", 14)} (rotate 45°) при open.
- icon caret: ▼ rotate 180° при open.
- view bordered: белый фон, border, radius 10px; open ${icon("chevron-right", 14)} border primary tint + shadow.
- view ghost: без border, hover #f7fafa.
- view filled: фон #f5f9f9.
- extra: бейдж/счётчик справа в header.
- Disabled: opacity 0.5, pointer-events none.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Collapse bordered chevron-left size-m. Без внешних библиотек.` },
      { id: 'icons', label: 'Icon variants', aiPrompt: `Создай Collapse с icon chevron-right/plus/caret/none. Без внешних библиотек.` },
      { id: 'sizes', label: 'Sizes', aiPrompt: `Создай Collapse sizes s/m/l. Без внешних библиотек.` },
      { id: 'views', label: 'Views', aiPrompt: `Создай Collapse view ghost/filled/disabled. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-collapse size-m view-bordered icon-chevron-left" data-collapse>
              <button type="button" class="sb-collapse-trigger" aria-expanded="false">
                <span class="sb-collapse-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg></span>
                <span class="sb-collapse-heading">
                  <span class="sb-collapse-title">Условия поставки</span>
                  <span class="sb-collapse-subtitle">Логистика и сроки отгрузки</span>
                </span>
                <span class="sb-collapse-extra"><span class="cr-badge accent">Актуально</span></span>
              </button>
              <div class="sb-collapse-panel"><div class="sb-collapse-panel-inner"><p>Стандартный срок отгрузки — 3–5 рабочих дней.</p></div></div>
            </div>
          </div>
        </div>
        <div data-variant-id="icons">
          <span class="showcase-label">Icon variants</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-direction:column;gap:10px;max-width:520px;width:100%">
              <div class="sb-collapse size-m view-bordered icon-chevron-right" data-collapse>
                <button type="button" class="sb-collapse-trigger" aria-expanded="false">
                  <span class="sb-collapse-heading"><span class="sb-collapse-title">Chevron справа</span></span>
                  <span class="sb-collapse-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg></span>
                </button>
                <div class="sb-collapse-panel"><div class="sb-collapse-panel-inner"><p>Иконка справа.</p></div></div>
              </div>
              <div class="sb-collapse size-m view-bordered icon-plus" data-collapse>
                <button type="button" class="sb-collapse-trigger" aria-expanded="false">
                  <span class="sb-collapse-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg></span>
                  <span class="sb-collapse-heading"><span class="sb-collapse-title">Plus / minus</span></span>
                </button>
                <div class="sb-collapse-panel"><div class="sb-collapse-panel-inner"><p>Плюс → крестик при open.</p></div></div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="sizes">
          <span class="showcase-label">Sizes</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-direction:column;gap:10px;max-width:520px;width:100%">
              <div class="sb-collapse size-s view-bordered icon-chevron-left" data-collapse>
                <button type="button" class="sb-collapse-trigger" aria-expanded="false">
                  <span class="sb-collapse-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg></span>
                  <span class="sb-collapse-heading"><span class="sb-collapse-title">Size S</span></span>
                </button>
                <div class="sb-collapse-panel"><div class="sb-collapse-panel-inner"><p>Компактный.</p></div></div>
              </div>
              <div class="sb-collapse size-l view-bordered icon-chevron-left" data-collapse>
                <button type="button" class="sb-collapse-trigger" aria-expanded="false">
                  <span class="sb-collapse-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg></span>
                  <span class="sb-collapse-heading"><span class="sb-collapse-title">Size L</span></span>
                </button>
                <div class="sb-collapse-panel"><div class="sb-collapse-panel-inner"><p>Крупный.</p></div></div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="views">
          <span class="showcase-label">Views</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-direction:column;gap:10px;max-width:520px;width:100%">
              <div class="sb-collapse size-m view-ghost icon-chevron-left" data-collapse>
                <button type="button" class="sb-collapse-trigger" aria-expanded="false">
                  <span class="sb-collapse-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg></span>
                  <span class="sb-collapse-heading"><span class="sb-collapse-title">Ghost</span></span>
                </button>
                <div class="sb-collapse-panel"><div class="sb-collapse-panel-inner"><p>Без рамки.</p></div></div>
              </div>
              <div class="sb-collapse size-m view-filled icon-chevron-left" data-collapse>
                <button type="button" class="sb-collapse-trigger" aria-expanded="false">
                  <span class="sb-collapse-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg></span>
                  <span class="sb-collapse-heading"><span class="sb-collapse-title">Filled</span></span>
                </button>
                <div class="sb-collapse-panel"><div class="sb-collapse-panel-inner"><p>С заливкой.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Spoiler',
    category: 'Disclosure',
    status: 'stable',
    desc: '<strong>Спойлер.</strong> Скрытие контента до явного раскрытия: blur, fade-маска или полное скрытие. Блочный и inline-режим, размеры S/M/L, кастомные подписи кнопки.',
    params: 'children · revealed · defaultRevealed · onToggle · view: blur|fade|hidden · size: s|m|l · inline · showLabel · hideLabel',
    states: 'hidden · revealed',
    aiPrompt: `Создай React-компонент Spoiler в стиле SB Design System.

Требования:
- Скрывает контент до клика пользователя (коммерческая тайна, цена, чувствительный текст).
- Пропсы: children, revealed?, defaultRevealed?, onToggle?, view?: 'blur'|'fade'|'hidden', size?: 's'|'m'|'l', inline?: boolean, showLabel?: string (default 'Показать'), hideLabel?: string (default 'Скрыть').
- view blur: filter blur(6px), user-select none до раскрытия.
- view fade: градиентная маска снизу, контент приглушён.
- view hidden: контент display none / placeholder «Скрытое содержимое».
- Toggle: кнопка-ссылка primary, font-weight 600, под контентом (block) или inline.
- inline: в потоке текста, border-radius 4px, padding 0 2px.
- block: карточка border 1px, radius 10px, padding 14–18px.
- is-revealed: снимает маску/blur, меняет текст кнопки, aria-hidden false на контенте.
- Доступность: button aria-expanded, content aria-hidden до раскрытия.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'blur', label: 'Blur', aiPrompt: `Создай Spoiler view=blur block. Без внешних библиотек.` },
      { id: 'fade', label: 'Fade', aiPrompt: `Создай Spoiler view=fade. Без внешних библиотек.` },
      { id: 'hidden', label: 'Hidden', aiPrompt: `Создай Spoiler view=hidden. Без внешних библиотек.` },
      { id: 'inline', label: 'Inline', aiPrompt: `Создай Spoiler inline в тексте. Без внешних библиотек.` },
      { id: 'revealed', label: 'Revealed', aiPrompt: `Создай Spoiler defaultRevealed. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="blur">
          <span class="showcase-label">Blur</span>
          <div class="showcase-demo">
            <div class="sb-spoiler size-m view-blur" data-spoiler>
              <div class="sb-spoiler-content" aria-hidden="true"><p>Коммерческое предложение: скидка 12% при объёме от 500 т.</p></div>
              <button type="button" class="sb-spoiler-toggle" aria-expanded="false">Показать спойлер</button>
            </div>
          </div>
        </div>
        <div data-variant-id="fade">
          <span class="showcase-label">Fade</span>
          <div class="showcase-demo">
            <div class="sb-spoiler size-m view-fade" data-spoiler>
              <div class="sb-spoiler-content" aria-hidden="true"><p>Специальная цена: <strong>88 200 ₽/т</strong>.</p></div>
              <button type="button" class="sb-spoiler-toggle" aria-expanded="false">Показать цену</button>
            </div>
          </div>
        </div>
        <div data-variant-id="hidden">
          <span class="showcase-label">Hidden</span>
          <div class="showcase-demo">
            <div class="sb-spoiler size-m view-hidden" data-spoiler>
              <div class="sb-spoiler-placeholder">Содержимое скрыто</div>
              <div class="sb-spoiler-content" aria-hidden="true"><p>Внутренний комментарий менеджера.</p></div>
              <button type="button" class="sb-spoiler-toggle" aria-expanded="false">Раскрыть</button>
            </div>
          </div>
        </div>
        <div data-variant-id="inline">
          <span class="showcase-label">Inline</span>
          <div class="showcase-demo">
            <p style="font-size:14px;line-height:1.65;margin:0">Отчёт показал рост на 8,3%.
              <span class="sb-spoiler is-inline size-s view-blur" data-spoiler>
                <span class="sb-spoiler-content" aria-hidden="true">Детализация по площадкам.</span>
                <button type="button" class="sb-spoiler-toggle" aria-expanded="false">показать</button>
              </span>
            </p>
          </div>
        </div>
        <div data-variant-id="revealed">
          <span class="showcase-label">Revealed</span>
          <div class="showcase-demo">
            <div class="sb-spoiler size-m view-blur is-revealed" data-spoiler>
              <div class="sb-spoiler-content" aria-hidden="false"><p>Контент изначально виден.</p></div>
              <button type="button" class="sb-spoiler-toggle" aria-expanded="true">Скрыть</button>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Tabs',
    category: 'Navigation',
    desc: '<strong>Pill-tabs.</strong> Переключение между категориями контента. 6 вариантов: pill · compact · underline · boxed · with-icons · full-width.',
    params: 'variant: pill|compact|underline|boxed|icons|full · items[] · activeIndex · onChange',
    states: 'default · active · hover · disabled',
    aiPrompt: `Создай React-компонент Tabs в стиле SB Design System.

Требования:
- Pill-табы: скругленные кнопки на серой подложке (#f0f0f0), активная вкладка — белый фон с тенью.
- Пропсы: items: { label: string, id: string }[], activeIndex: number, onChange: (index) => void.
- Переключение по клику с плавным transition.
- Доступность: role="tablist", role="tab", aria-selected.
- Шрифт Inter, 14px, font-weight 600.
- Цвета из палитры SB: primary #008f95, text-main #123a45, text-secondary #41636a.
- Без внешних UI-библиотек.`,
    variants: [
      {
        id: 'pill',
        label: 'Pill · default',
        aiPrompt: `Создай React-компонент Tabs (вариант pill) в стиле SB Design System.

Требования:
- Pill-табы на серой подложке #f0f0f0, padding 4px, border-radius 40px.
- Активная вкладка: белый фон, box-shadow 0 2px 6px rgba(0,0,0,0.06), цвет text-main.
- Кнопки: padding 8px 18px, font-size 14px, font-weight 600.
- Пропсы: variant="pill", items[], activeIndex, onChange.
- role="tablist", aria-selected. Без внешних UI-библиотек.`
      },
      {
        id: 'compact',
        label: 'Pill · compact',
        aiPrompt: `Создай React-компонент Tabs (вариант compact) в стиле SB Design System.

Требования:
- Компактные pill-табы: padding 2px, кнопки 6px 14px, font-size 13px.
- Пропсы: variant="compact", size="s", items[], activeIndex.
- Стиль SB, aria-атрибуты. Без внешних UI-библиотек.`
      },
      {
        id: 'underline',
        label: 'Underline',
        aiPrompt: `Создай React-компонент Tabs (вариант underline) в стиле SB Design System.

Требования:
- Табы с нижней линией-индикатором, без pill-подложки.
- Активная вкладка: border-bottom 2px solid primary #008f95, цвет primary.
- Неактивные: цвет text-secondary, hover text-main.
- Пропсы: variant="underline", items[], activeIndex.
- Без внешних UI-библиотек.`
      },
      {
        id: 'boxed',
        label: 'Boxed',
        aiPrompt: `Создай React-компонент Tabs (вариант boxed) в стиле SB Design System.

Требования:
- Табы в рамке: border 1px solid #d7dee1, border-radius 10px, padding 4px.
- Активная вкладка: фон primary #008f95, белый текст.
- Пропсы: variant="boxed", items[], activeIndex.
- Без внешних UI-библиотек.`
      },
      {
        id: 'icons',
        label: 'With icons',
        aiPrompt: `Создай React-компонент Tabs (вариант icons) в стиле SB Design System.

Требования:
- Pill-табы с иконкой слева от label (16px SVG, gap 6px).
- items: { label, id, icon }[].
- Пропсы: variant="icons", items[], activeIndex.
- Без внешних UI-библиотек.`
      },
      {
        id: 'full',
        label: 'Full width',
        aiPrompt: `Создай React-компонент Tabs (вариант full) в стиле SB Design System.

Требования:
- Pill-табы на всю ширину контейнера, кнопки flex: 1, text-align center.
- Пропсы: variant="full", items[], activeIndex.
- Без внешних UI-библиотек.`
      }
    ],
    demo: `
      <div class="tabs-showcase">

        <div class="tabs-showcase-item" data-variant-id="pill">
          <span class="tabs-showcase-label">Pill · default</span>
          <div class="tabs-demo">
            <div class="tabs" role="tablist" data-tabs>
              <button type="button" class="active" role="tab" aria-selected="true">Новости</button>
              <button type="button" role="tab" aria-selected="false">Пресс-релизы</button>
              <button type="button" role="tab" aria-selected="false">События</button>
            </div>
            <div class="tabs-status">Активна вкладка: <strong data-tab-status>Новости</strong></div>
          </div>
        </div>

        <div class="tabs-showcase-item" data-variant-id="compact">
          <span class="tabs-showcase-label">Pill · compact</span>
          <div class="tabs-demo">
            <div class="tabs tabs--compact" role="tablist" data-tabs>
              <button type="button" class="active" role="tab" aria-selected="true">Все</button>
              <button type="button" role="tab" aria-selected="false">Активные</button>
              <button type="button" role="tab" aria-selected="false">Архив</button>
            </div>
            <div class="tabs-status">Активна вкладка: <strong data-tab-status>Все</strong></div>
          </div>
        </div>

        <div class="tabs-showcase-item" data-variant-id="underline">
          <span class="tabs-showcase-label">Underline</span>
          <div class="tabs-demo">
            <div class="tabs tabs--underline" role="tablist" data-tabs>
              <button type="button" class="active" role="tab" aria-selected="true">Обзор</button>
              <button type="button" role="tab" aria-selected="false">Характеристики</button>
              <button type="button" role="tab" aria-selected="false">Документы</button>
              <button type="button" role="tab" aria-selected="false">Отзывы</button>
            </div>
            <div class="tabs-status">Активна вкладка: <strong data-tab-status>Обзор</strong></div>
          </div>
        </div>

        <div class="tabs-showcase-item" data-variant-id="boxed">
          <span class="tabs-showcase-label">Boxed</span>
          <div class="tabs-demo">
            <div class="tabs tabs--boxed" role="tablist" data-tabs>
              <button type="button" class="active" role="tab" aria-selected="true">2024</button>
              <button type="button" role="tab" aria-selected="false">2025</button>
              <button type="button" role="tab" aria-selected="false">2026</button>
            </div>
            <div class="tabs-status">Активна вкладка: <strong data-tab-status>2024</strong></div>
          </div>
        </div>

        <div class="tabs-showcase-item" data-variant-id="icons">
          <span class="tabs-showcase-label">With icons</span>
          <div class="tabs-demo">
            <div class="tabs tabs--icons" role="tablist" data-tabs>
              <button type="button" class="active" role="tab" aria-selected="true">${icon('file-text', 16)} Новости</button>
              <button type="button" role="tab" aria-selected="false">${icon('bell', 16)} Уведомления</button>
              <button type="button" role="tab" aria-selected="false">${icon('star', 16)} Избранное</button>
            </div>
            <div class="tabs-status">Активна вкладка: <strong data-tab-status>Новости</strong></div>
          </div>
        </div>

        <div class="tabs-showcase-item" data-variant-id="full">
          <span class="tabs-showcase-label">Full width</span>
          <div class="tabs-demo tabs-demo--full">
            <div class="tabs tabs--full" role="tablist" data-tabs>
              <button type="button" class="active" role="tab" aria-selected="true">Поставка</button>
              <button type="button" role="tab" aria-selected="false">Оплата</button>
              <button type="button" role="tab" aria-selected="false">Доставка</button>
            </div>
            <div class="tabs-status">Активна вкладка: <strong data-tab-status>Поставка</strong></div>
          </div>
        </div>

      </div>
    `
  },
  {
    name: 'Breadcrumbs',
    category: 'Navigation',
    desc: '<strong>Хлебные крошки.</strong> Навигационная цепочка с иконками, выпадающими подменю, кастомными разделителями и текущей страницей. 4 варианта: icons · submenu · dot · long.',
    params: 'items[] · getLabel · getHref · getIcon · getSubMenu · onItemClick · separator: slash | arrow | dot',
    states: 'default · hover · submenu-open · current-page',
    aiPrompt: `Создай React-компонент Breadcrumbs в стиле SB Design System.

Требования:
- Навигационная цепочка со ссылками и текущим пунктом (не кликабельным).
- Пропсы: items: Item[] (label, href?, icon?, subMenu?), separator: 'slash' | 'arrow' | 'dot'.
- Кликабельные пункты — тег &lt;a&gt; с href, hover меняет цвет на primary #008f95.
- Последний пункт — не ссылка, жирный шрифт, цвет text-main #123a45.
- Иконка слева от текста (svg 16x16, opacity 0.7, hover 1).
- Выпадающее подменю (subMenu) для промежуточных пунктов.
- Разделители: / › ● (настраиваемые через separator).
- Доступность: nav с aria-label, корректные href.
- Цвета: primary #008f95, text-main #123a45, text-secondary #41636a, border #d7dee1.
- Шрифт Inter, 14px. Без сторонних UI-библиотек.`,
    variants: [
      {
        id: 'icons',
        label: 'С иконками · slash',
        aiPrompt: `Создай React-компонент Breadcrumbs (вариант icons, separator slash) в стиле SB Design System.

Требования:
- Цепочка с иконками 16x16 слева от каждого пункта, разделитель «/».
- Последний пункт — текущая страница (span, не ссылка), font-weight 600.
- Пропсы: separator="slash", items с icon и label.
- Hover ссылок: primary #008f95. Без внешних UI-библиотек.`
      },
      {
        id: 'submenu',
        label: 'С подменю · arrow',
        aiPrompt: `Создай React-компонент Breadcrumbs (вариант submenu, separator arrow) в стиле SB Design System.

Требования:
- Промежуточный пункт с выпадающим subMenu по клику, стрелка-индикатор.
- Разделитель «›», иконки у пунктов.
- Пропсы: getSubMenu, separator="arrow", onItemClick.
- Дропдаун: белый фон, border, shadow. Без внешних UI-библиотек.`
      },
      {
        id: 'dot',
        label: 'Короткие пути · dot',
        aiPrompt: `Создай React-компонент Breadcrumbs (вариант dot) в стиле SB Design System.

Требования:
- Разделитель — точка (●), компактные цепочки 2–3 уровня.
- Пропсы: separator="dot", items[].
- Иконка только у «Главная». Без внешних UI-библиотек.`
      },
      {
        id: 'long',
        label: 'Длинный путь · slash',
        aiPrompt: `Создай React-компонент Breadcrumbs (вариант long, 6+ уровней) в стиле SB Design System.

Требования:
- Длинная цепочка 6+ пунктов, разделитель «/», overflow-x: auto на мобильных.
- Пропсы: separator="slash", items[].
- Последний пункт — текущая страница. Без внешних UI-библиотек.`
      }
    ],
    demo: `
      <div class="bc-showcase">

        <div class="bc-showcase-item" data-variant-id="icons">
          <span class="bc-showcase-label">С иконками · slash</span>
          <div class="bc-demo">
            <p class="bc-demo-desc">Каждый пункт имеет иконку, последний — текущая страница (не кликабельна).</p>
            <nav class="breadcrumbs sep-slash" aria-label="Хлебные крошки">
              <a href="#">
                <span class="bc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
                Главная
              </a>
              <span class="bc-sep">/</span>
              <a href="#">
                <span class="bc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                Клиентам
              </a>
              <span class="bc-sep">/</span>
              <a href="#">
                <span class="bc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
                Отраслевые решения
              </a>
              <span class="bc-sep">/</span>
              <span class="bc-current">Упаковочные материалы</span>
            </nav>
          </div>
        </div>

        <div class="bc-showcase-item" data-variant-id="submenu">
          <span class="bc-showcase-label">С подменю · arrow</span>
          <div class="bc-demo">
            <p class="bc-demo-desc">Кликните на пункт «Продукция» — появится выпадающий список.</p>
            <nav class="breadcrumbs sep-arrow" data-breadcrumbs aria-label="Хлебные крошки">
              <a href="#">
                <span class="bc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
                Главная
              </a>
              <span class="bc-sep">›</span>
              <div class="bc-has-menu" data-bc-menu>
                <a href="#" class="bc-menu-trigger">
                  <span class="bc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span>
                  Продукция
                </a>
                <div class="bc-dropdown">
                  <a class="bc-dropdown-item" href="#"><span class="bc-di-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></span>Полипропилен</a>
                  <a class="bc-dropdown-item" href="#"><span class="bc-di-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg></span>Полиэтилен</a>
                  <a class="bc-dropdown-item" href="#"><span class="bc-di-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Ecolen (recycled)</a>
                  <a class="bc-dropdown-item" href="#"><span class="bc-di-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>Спецполимеры</a>
                </div>
              </div>
              <span class="bc-sep">›</span>
              <a href="#">
                <span class="bc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>
                Технические характеристики
              </a>
              <span class="bc-sep">›</span>
              <span class="bc-current">Полипропилен PP-H 1200</span>
            </nav>
          </div>
        </div>

        <div class="bc-showcase-item" data-variant-id="dot">
          <span class="bc-showcase-label">Короткие пути · dot</span>
          <div class="bc-demo">
            <nav class="breadcrumbs sep-dot" aria-label="Хлебные крошки">
              <a href="#">
                <span class="bc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
                Главная
              </a>
              <span class="bc-sep"></span>
              <span class="bc-current">Контакты</span>
            </nav>
            <nav class="breadcrumbs sep-dot" aria-label="Хлебные крошки">
              <a href="#">
                <span class="bc-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
                Главная
              </a>
              <span class="bc-sep"></span>
              <a href="#">Карьера</a>
              <span class="bc-sep"></span>
              <span class="bc-current">Вакансии в Екатеринбурге</span>
            </nav>
          </div>
        </div>

        <div class="bc-showcase-item" data-variant-id="long">
          <span class="bc-showcase-label">Длинный путь · slash</span>
          <div class="bc-demo">
            <nav class="breadcrumbs sep-slash" style="overflow-x:auto;padding-bottom:2px" aria-label="Хлебные крошки">
              <a href="#">Главная</a>
              <span class="bc-sep">/</span>
              <a href="#">Продукция</a>
              <span class="bc-sep">/</span>
              <a href="#">Полимеры</a>
              <span class="bc-sep">/</span>
              <a href="#">Полипропилен</a>
              <span class="bc-sep">/</span>
              <a href="#">Гомополимеры</a>
              <span class="bc-sep">/</span>
              <span class="bc-current">PP-H 1200</span>
            </nav>
          </div>
        </div>

      </div>
    `
  },
  {
    name: 'Pagination',
    category: 'Navigation',
    desc: '<strong>Пагинация.</strong> Интерактивная навигация по страницам. 3 варианта: full (First/Last) · compact · short.',
    params: 'items · value · onChange · showFirstPage · showLastPage · visibleCount',
    states: 'default · active · disabled · hover',
    aiPrompt: `Создай React-компонент Pagination в стиле SB Design System.

Требования:
- Пропсы: items (всего страниц), value (текущая), onChange: (page) => void, showFirstPage?, showLastPage?, visibleCount (по умолчанию 7).
- Кнопки: &laquo; (первая), &lsaquo; (предыдущая), номера страниц, &rsaquo; (следующая), &raquo; (последняя).
- Активная страница: фон primary #008f95, цвет #fff, border-radius 6px.
- Эллипсисы &hellip; при items &gt; visibleCount.
- Кнопки: min-width 36px, высота 36px, border 1px solid #d7dee1, font-weight 600, font-size 14px.
- Без внешних UI-библиотек.`,
    variants: [
      {
        id: 'full',
        label: 'Full · First/Last · visibleCount=7',
        aiPrompt: `Создай React-компонент Pagination (вариант full) в стиле SB Design System.

Требования:
- items=15, value=7, visibleCount=7, showFirstPage, showLastPage.
- Кнопки ««» и «»» для первой/последней страницы, «‹» «›» для prev/next.
- Эллипсисы при переполнении. Активная: primary #008f95.
- Без внешних UI-библиотек.`
      },
      {
        id: 'compact',
        label: 'Compact · visibleCount=5',
        aiPrompt: `Создай React-компонент Pagination (вариант compact) в стиле SB Design System.

Требования:
- items=10, visibleCount=5, без First/Last кнопок.
- Только «‹» номера «›». Эллипсисы по краям.
- Без внешних UI-библиотек.`
      },
      {
        id: 'short',
        label: 'Short · все страницы',
        aiPrompt: `Создай React-компонент Pagination (вариант short) в стиле SB Design System.

Требования:
- items=5, все страницы видны без эллипсисов.
- visibleCount=7, value=3. Без First/Last.
- Без внешних UI-библиотек.`
      }
    ],
    demo: `
      <div class="pg-showcase">

        <div class="pg-showcase-item" data-variant-id="full">
          <span class="pg-showcase-label">Full · First/Last · visibleCount=7</span>
          <div class="pg-demo">
            <div class="pagination" data-pagination data-total="15" data-value="7" data-visible="7" data-first="1" data-last="1"></div>
            <div class="pg-status">Текущая страница: <strong data-pagination-label>7</strong> из 15</div>
          </div>
        </div>

        <div class="pg-showcase-item" data-variant-id="compact">
          <span class="pg-showcase-label">Compact · visibleCount=5</span>
          <div class="pg-demo">
            <div class="pagination" data-pagination data-total="10" data-value="1" data-visible="5" data-first="0" data-last="0"></div>
            <div class="pg-status">Текущая страница: <strong data-pagination-label>1</strong> из 10</div>
          </div>
        </div>

        <div class="pg-showcase-item" data-variant-id="short">
          <span class="pg-showcase-label">Short · все страницы</span>
          <div class="pg-demo">
            <div class="pagination" data-pagination data-total="5" data-value="3" data-visible="7" data-first="0" data-last="0"></div>
            <div class="pg-status">Текущая страница: <strong data-pagination-label>3</strong> из 5</div>
          </div>
        </div>

      </div>
    `
  },
  {
    name: 'Steps',
    category: 'Navigation',
    desc: '<strong>Степпер / прогресс шагов.</strong> Статусный процесс и интерактивный wizard. 2 варианта: status · wizard.',
    params: 'items[] · value · onChange · getLabel · getDisabled · getSkipped · getCompleted',
    states: 'default · current · completed · skipped · disabled',
    aiPrompt: `Создай React-компонент Steps (степпер) в стиле SB Design System.

Требования:
- Горизонтальный степпер для пошаговых процессов (5 шагов по умолчанию).
- Пропсы: items (label, disabled?, skipped?, completed?)[], value (текущий шаг), onChange: (item) => void.
- Состояния: default, current, completed, skipped, disabled.
- Линии-коннекторы между кругами. Без внешних библиотек.`,
    variants: [
      {
        id: 'status',
        label: 'Статусный процесс',
        aiPrompt: `Создай React-компонент Steps (вариант status) в стиле SB Design System.

Требования:
- Клик по шагу меняет текущую позицию. Предыдущие — completed, один skipped, недоступные — disabled.
- Круглый индикатор 36px, label 13px/600, meta 11px.
- Без внешних библиотек.`
      },
      {
        id: 'wizard',
        label: 'Интерактивный wizard',
        aiPrompt: `Создай React-компонент Steps (вариант wizard) в стиле SB Design System.

Требования:
- Мастер с кнопками Назад / Пропустить / Далее / Сбросить.
- Skip помечает шаг skipped и переводит дальше.
- Без внешних библиотек.`
      }
    ],
    demo: `
      <div class="component-showcase">

        <div data-variant-id="status">
          <span class="showcase-label">Статусный процесс</span>
          <div class="showcase-demo">
        <div class="sb-steps-card">
          <div class="sb-steps-card-title">Статусный процесс</div>
          <div class="sb-steps-card-desc">Клик по шагу меняет текущую позицию. Предыдущие шаги становятся <code>completed</code>, один шаг может быть <code>skipped</code>, недоступные отмечены как <code>disabled</code>.</div>
          <div class="sb-steps-wrap">
            <div class="sb-steps" data-steps data-steps-mode="status">
              <div class="sb-step is-completed" data-step-index="0">
                <button class="sb-step-btn" type="button">
                  <span class="sb-step-circle" data-step-circle>${icon("check-circle", 18)}</span>
                  <span>
                    <div class="sb-step-label">Заявка</div>
                    <div class="sb-step-meta">Готово</div>
                  </span>
                </button>
              </div>
              <div class="sb-step is-completed" data-step-index="1">
                <button class="sb-step-btn" type="button">
                  <span class="sb-step-circle" data-step-circle>${icon("check-circle", 18)}</span>
                  <span>
                    <div class="sb-step-label">Проверка</div>
                    <div class="sb-step-meta">Готово</div>
                  </span>
                </button>
              </div>
              <div class="sb-step is-current" data-step-index="2">
                <button class="sb-step-btn" type="button">
                  <span class="sb-step-circle" data-step-circle>3</span>
                  <span>
                    <div class="sb-step-label">Договор</div>
                    <div class="sb-step-meta">Текущий</div>
                  </span>
                </button>
              </div>
              <div class="sb-step is-skipped" data-step-index="3">
                <button class="sb-step-btn" type="button">
                  <span class="sb-step-circle" data-step-circle>↷</span>
                  <span>
                    <div class="sb-step-label">Оплата</div>
                    <div class="sb-step-meta">Пропущен</div>
                  </span>
                </button>
              </div>
              <div class="sb-step is-disabled" data-step-index="4">
                <button class="sb-step-btn" type="button">
                  <span class="sb-step-circle" data-step-circle>5</span>
                  <span>
                    <div class="sb-step-label">Доставка</div>
                    <div class="sb-step-meta">Недоступно</div>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div class="sb-steps-value">Текущий шаг: <strong data-steps-current-label>Договор</strong></div>
        </div>
          </div>
        </div>

        <div data-variant-id="wizard">
          <span class="showcase-label">Интерактивный wizard</span>
          <div class="showcase-demo">
        <div class="sb-steps-card">
          <div class="sb-steps-card-title">Интерактивный wizard</div>
          <div class="sb-steps-card-desc">Управление как в мастере оформления. Кнопка <code>Пропустить</code> помечает текущий шаг как <code>skipped</code> и переводит дальше. <code>Назад</code> возвращает на предыдущий доступный шаг.</div>
          <div class="sb-steps-wrap">
            <div class="sb-steps" data-steps data-steps-mode="wizard">
              <div class="sb-step is-current" data-step-index="0">
                <button class="sb-step-btn" type="button">
                  <span class="sb-step-circle" data-step-circle>1</span>
                  <span>
                    <div class="sb-step-label">Профиль</div>
                    <div class="sb-step-meta">Текущий</div>
                  </span>
                </button>
              </div>
              <div class="sb-step" data-step-index="1">
                <button class="sb-step-btn" type="button">
                  <span class="sb-step-circle" data-step-circle>2</span>
                  <span>
                    <div class="sb-step-label">Контакты</div>
                    <div class="sb-step-meta">Ожидание</div>
                  </span>
                </button>
              </div>
              <div class="sb-step" data-step-index="2">
                <button class="sb-step-btn" type="button">
                  <span class="sb-step-circle" data-step-circle>3</span>
                  <span>
                    <div class="sb-step-label">Документы</div>
                    <div class="sb-step-meta">Ожидание</div>
                  </span>
                </button>
              </div>
              <div class="sb-step" data-step-index="3">
                <button class="sb-step-btn" type="button">
                  <span class="sb-step-circle" data-step-circle>4</span>
                  <span>
                    <div class="sb-step-label">Подтверждение</div>
                    <div class="sb-step-meta">Ожидание</div>
                  </span>
                </button>
              </div>
              <div class="sb-step is-disabled" data-step-index="4">
                <button class="sb-step-btn" type="button">
                  <span class="sb-step-circle" data-step-circle>5</span>
                  <span>
                    <div class="sb-step-label">Оплата</div>
                    <div class="sb-step-meta">Disabled</div>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div class="sb-steps-actions">
            <button class="btn btn-secondary btn-s" type="button" data-steps-prev>Назад</button>
            <button class="btn btn-ghost btn-s" type="button" data-steps-skip>Пропустить</button>
            <button class="btn btn-primary btn-s" type="button" data-steps-next>Далее</button>
            <button class="btn btn-clear btn-s" type="button" data-steps-reset>Сбросить</button>
          </div>
          <div class="sb-steps-value">Текущий шаг: <strong data-steps-current-label>Профиль</strong></div>
        </div>
          </div>
        </div>

      </div>
    `
  },

  /* ===== Typography ===== */
  {
    name: 'Text',
    category: 'Typography',
    desc: '<strong>Компонент текста.</strong> 11 размеров от <code>2xs</code> (11px) до <code>6xl</code> (56px) с типографической шкалой. 6 весов от <code>thin</code> (100) до <code>black</code> (900). Поддерживает view (primary/secondary/brand/alert/success/warning), align, transform и decoration.',
    params: 'size: 2xs|xs|s|m|l|xl|2xl|3xl|4xl|5xl|6xl · weight: thin|light|regular|medium|semibold|bold|black · view · align · transform · decoration',
    states: 'default',
    variants: [
      { id: 'sizes', label: 'Sizes', aiPrompt: `Создай Text 11 sizes 2xs–6xl. Без внешних библиотек.` },
      { id: 'weights', label: 'Weights', aiPrompt: `Создай Text weights thin–black. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="sizes">
          <span class="showcase-label">Sizes</span>
          <div class="showcase-demo">
            <div class="sb-text-demo">
              <div class="sb-text-row"><span class="tr-size">2XS</span><p class="sb-text size-2xs">Просто текст</p><span class="tr-spec">11px</span></div>
              <div class="sb-text-row"><span class="tr-size">XS</span><p class="sb-text size-xs">Просто текст</p><span class="tr-spec">12px</span></div>
              <div class="sb-text-row"><span class="tr-size">S</span><p class="sb-text size-s">Просто текст</p><span class="tr-spec">13px</span></div>
              <div class="sb-text-row"><span class="tr-size">M</span><p class="sb-text size-m">Просто текст</p><span class="tr-spec">15px</span></div>
              <div class="sb-text-row"><span class="tr-size">L</span><p class="sb-text size-l">Просто текст</p><span class="tr-spec">17px</span></div>
              <div class="sb-text-row"><span class="tr-size">XL</span><p class="sb-text size-xl">Просто текст</p><span class="tr-spec">20px</span></div>
              <div class="sb-text-row"><span class="tr-size">2XL</span><p class="sb-text size-2xl">Просто текст</p><span class="tr-spec">24px</span></div>
              <div class="sb-text-row"><span class="tr-size">3XL</span><p class="sb-text size-3xl">Просто текст</p><span class="tr-spec">30px</span></div>
              <div class="sb-text-row"><span class="tr-size">4XL</span><p class="sb-text size-4xl">Просто текст</p><span class="tr-spec">36px</span></div>
              <div class="sb-text-row"><span class="tr-size">5XL</span><p class="sb-text size-5xl">Просто текст</p><span class="tr-spec">44px</span></div>
              <div class="sb-text-row"><span class="tr-size">6XL</span><p class="sb-text size-6xl">Просто текст</p><span class="tr-spec">56px</span></div>
            </div>
          </div>
        </div>
        <div data-variant-id="weights">
          <span class="showcase-label">Weights</span>
          <div class="showcase-demo">
            <div class="sb-text-demo">
              <div class="sb-text-row"><span class="tr-size">Thin</span><p class="sb-text size-l weight-thin">Просто текст</p><span class="tr-spec">100</span></div>
              <div class="sb-text-row"><span class="tr-size">Light</span><p class="sb-text size-l weight-light">Просто текст</p><span class="tr-spec">300</span></div>
              <div class="sb-text-row"><span class="tr-size">Regular</span><p class="sb-text size-l weight-regular">Просто текст</p><span class="tr-spec">400</span></div>
              <div class="sb-text-row"><span class="tr-size">Semibold</span><p class="sb-text size-l weight-semibold">Просто текст</p><span class="tr-spec">600</span></div>
              <div class="sb-text-row"><span class="tr-size">Bold</span><p class="sb-text size-l weight-bold">Просто текст</p><span class="tr-spec">700</span></div>
              <div class="sb-text-row"><span class="tr-size">Black</span><p class="sb-text size-l weight-black">Просто текст</p><span class="tr-spec">900</span></div>
            </div>
          </div>
        </div>
      </div> `
  },
  /* ===== Data display ===== */
  {
    name: 'Tag / Chip',
    category: 'Data display',
    desc: '<strong>Теги и статусы.</strong> 5 тонов: neutral, promo, success, warning, danger.',
    params: 'tone · icon (док.) · closable (док.)',
    states: 'default',
    aiPrompt: `Создай React-компонент Tag/Chip в стиле SB Design System.

Требования:
- Небольшие цветные бейджи для отображения статусов и меток.
- Пропсы: label: string, tone: 'neutral' | 'promo' | 'success' | 'warning' | 'danger'.
- Каждый тон: фон и текст в соответствующем цвете.
  * neutral: #eef2f4 / #123a45 (text-main)
  * promo: #fcefe0 / #b5601a
  * success: #def5e8 / #166a3d
  * warning: #fbf0d4 / #8a6411
  * danger: #f7dede / #8b2a2a
- Размер: padding 4px 12px, font-size 12px, font-weight 600, border-radius 20px.
- Поддержка icon (слева) и closable (кнопка ${icon("close", 14)} справа).
- display: inline-flex, gap 6px.
- Шрифт Inter.
- Без внешних библиотек.`,
    variants: [
      { id: 'tones', label: 'Tones', aiPrompt: `Создай Tag/Chip 5 тонов. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="tones">
          <span class="showcase-label">Tones</span>
          <div class="showcase-demo">
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <span class="tag tag-neutral">Базовый</span>
              <span class="tag tag-promo">Промо</span>
              <span class="tag tag-success">Подтверждено</span>
              <span class="tag tag-warning">Внимание</span>
              <span class="tag tag-danger">Ошибка</span>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Chips',
    category: 'Data display',
    status: 'stable',
    desc: '<strong>Чипы.</strong> Интерактивные метки для фильтров, тегов ввода и быстрых действий: выбор, закрытие, иконка. Размеры S/M/L, виды outlined и filled.',
    params: 'items[] · label · selected · closable · icon · size: s|m|l · view: outlined|filled · disabled · onSelect · onClose',
    states: 'default · selected · disabled · closable',
    aiPrompt: `Создай React-компонент Chips / Chip в стиле SB Design System.

Требования:
- Чип — компактная интерактивная метка (фильтры каталога, выбранные теги, категории).
- Пропсы Chip: label, selected?, closable?, icon?, disabled?, size?: 's'|'m'|'l', view?: 'outlined'|'filled', onSelect?, onClose?.
- Chips (группа): items[], multiple?, value | value[], onChange, size, view.
- Размеры: s (26px, 12px), m (32px, 13px), l (38px, 14px); padding горизонтальный 10–16px; gap 8px в группе.
- view outlined: фон #fff, border 1px var(--border), color text-main; selected ${icon("chevron-right", 14)} border primary, bg rgba(0,143,149,0.08), color primary.
- view filled: фон #eef2f4, border transparent; selected ${icon("chevron-right", 14)} bg rgba(0,143,149,0.14), color primary.
- border-radius 100px, font-weight 600, inline-flex, align-items center, gap 6px.
- Кнопка закрытия ${icon("close", 14)}: 18px circle, hover bg rgba(0,0,0,0.06); aria-label «Удалить».
- Иконка слева 14–16px, currentColor.
- Hover (не disabled): border-color primary, лёгкий фон.
- Focus-visible: ring rgba(0,143,149,0.2).
- Disabled: opacity 0.45, pointer-events none.
- Пример: фильтр марок полимеров SB, выбранные теги заявки.
- Без внешних библиотек.`,
    variants: [
      { id: 'filter', label: 'Filter · outlined', aiPrompt: `Создай Chips filter outlined selectable. Без внешних библиотек.` },
      { id: 'filled', label: 'Filled · single', aiPrompt: `Создай Chips filled single select. Без внешних библиотек.` },
      { id: 'closable', label: 'Closable', aiPrompt: `Создай Chips closable tags. Без внешних библиотек.` },
      { id: 'icons', label: 'With icons', aiPrompt: `Создай Chips с иконками. Без внешних библиотек.` },
      { id: 'sizes', label: 'Sizes', aiPrompt: `Создай Chips sizes S/M/L. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="filter">
          <span class="showcase-label">Filter · outlined</span>
          <div class="showcase-demo">
            <div class="sb-chips size-m view-outlined" data-chips-selectable>
              <button type="button" class="sb-chip is-selected">Полипропилен</button>
              <button type="button" class="sb-chip">Полиэтилен</button>
              <button type="button" class="sb-chip is-selected">Ecolen</button>
              <button type="button" class="sb-chip">Сырьё</button>
              <button type="button" class="sb-chip" disabled>Архив</button>
            </div>
          </div>
        </div>
        <div data-variant-id="filled">
          <span class="showcase-label">Filled · single</span>
          <div class="showcase-demo">
            <div class="sb-chips size-m view-filled" data-chips-selectable data-chips-single>
              <button type="button" class="sb-chip is-selected">Все</button>
              <button type="button" class="sb-chip">В наличии</button>
              <button type="button" class="sb-chip">Под заказ</button>
              <button type="button" class="sb-chip">Снят с производства</button>
            </div>
          </div>
        </div>
        <div data-variant-id="closable">
          <span class="showcase-label">Closable</span>
          <div class="showcase-demo">
            <div class="sb-chips size-m view-outlined" data-chips-closable>
              <span class="sb-chip is-closable">PP-H 1200<button type="button" class="sb-chip-close" aria-label="Удалить">${icon("close", 14)}</button></span>
              <span class="sb-chip is-closable">Екатеринбург<button type="button" class="sb-chip-close" aria-label="Удалить">${icon("close", 14)}</button></span>
              <span class="sb-chip is-closable">Срочно<button type="button" class="sb-chip-close" aria-label="Удалить">${icon("close", 14)}</button></span>
            </div>
          </div>
        </div>
        <div data-variant-id="icons">
          <span class="showcase-label">With icons</span>
          <div class="showcase-demo">
            <div class="sb-chips size-m view-outlined">
              <span class="sb-chip"><span class="sb-chip-icon" aria-hidden="true">${icon("package", 16)}</span>Полимер</span>
              <span class="sb-chip is-selected"><span class="sb-chip-icon" aria-hidden="true">${icon("map-pin", 16)}</span>Екатеринбург</span>
              <span class="sb-chip is-closable is-selected"><span class="sb-chip-icon" aria-hidden="true">${icon("check-circle", 16)}</span>Одобрено<button type="button" class="sb-chip-close" aria-label="Удалить">${icon("close", 14)}</button></span>
            </div>
          </div>
        </div>
        <div data-variant-id="sizes">
          <span class="showcase-label">Sizes</span>
          <div class="showcase-demo">
            <div class="sb-chips size-s view-outlined" data-chips-selectable>
              <button type="button" class="sb-chip is-selected">Size S</button>
              <button type="button" class="sb-chip">Компакт</button>
            </div>
            <div class="sb-chips size-m view-outlined" data-chips-selectable style="margin-top:10px">
              <button type="button" class="sb-chip is-selected">Size M</button>
              <button type="button" class="sb-chip">Стандарт</button>
            </div>
            <div class="sb-chips size-l view-outlined" data-chips-selectable style="margin-top:10px">
              <button type="button" class="sb-chip is-selected">Size L</button>
              <button type="button" class="sb-chip">Крупный</button>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Data Table',
    category: 'Data display',
    desc: '<strong>Таблица данных.</strong> Продуктовый каталог: полипропилен, полиэтилен, Ecolen.',
    params: 'columns[] · rows[] · sortable (док.)',
    states: 'default · row hover',
    aiPrompt: `Создай React-компонент Data Table в стиле SB Design System.

Требования:
- Таблица для отображения структурированных данных (продуктовый каталог).
- Пропсы: columns: { label, key }[], rows: { [key]: string, status?: Status }[], sortable?: boolean.
- Заголовки: фон #f5f9f9, font-size 12px, uppercase, font-weight 700, letter-spacing 0.04em, цвет text-secondary #41636a.
  padding 12px 14px, text-align left, border-bottom 1px solid #d7dee1.
- Строки: padding 12px 14px, border-bottom 1px solid #d7dee1.
- Ховер строки: фон #fafcfc.
- Последняя строка без border-bottom.
- Статусы внутри ячеек — компонент Tag (success/promo/warning).
- Шрифт Inter, 14px.
- border и border-radius через table: 1px solid #d7dee1, border-radius 10px, overflow hidden.
- Цвета из палитры SB: primary #008f95, text-main #123a45, text-secondary #41636a, border #d7dee1.
- Пример: продукт, марка, применение, статус.
- Без внешних библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай DataTable каталог продуктов. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <table class="data-table">
              <thead><tr><th>Продукт</th><th>Марка</th><th>Применение</th><th>Статус</th></tr></thead>
              <tbody>
                <tr><td><strong>Полипропилен</strong></td><td>PP-H 1200</td><td>Литьё, плёнки</td><td><span class="tag tag-success">В наличии</span></td></tr>
                <tr><td><strong>Ecolen</strong></td><td>Ecolen rPET</td><td>Пищевая упаковка</td><td><span class="tag tag-promo">Новинка</span></td></tr>
                <tr><td><strong>Полиэтилен</strong></td><td>HDPE PE100</td><td>Трубы, тара</td><td><span class="tag tag-warning">Под заказ</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div> `
  },
  {
    name: 'TreeView',
    category: 'Data display',
    status: 'stable',
    desc: '<strong>Дерево элементов.</strong> Иерархический список с раскрывающимися ветками и выбором узла.',
    params: 'items[] · expanded[] · onToggle · selected · multiSelect',
    states: 'collapsed · expanded · selected',
    aiPrompt: `Создай React-компонент TreeView: иерархия с toggle-стрелками, отступами по уровню, selected, keyboard navigation (arrows, enter, space).`,
    variants: [
      { id: 'interactive', label: 'Interactive', aiPrompt: `Создай TreeView interactive expand/collapse. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div class="live-demo-badge">● Live demo</div>
            <div class="live-tree" data-live-tree>
              <div class="live-tree-item">
                <div class="live-tree-row"><button type="button" class="live-tree-toggle" aria-expanded="true">${icon("chevron-down", 14)}</button><span>Продукция</span></div>
                <div class="live-tree-children">
                  <div class="live-tree-item">
                    <div class="live-tree-row is-selected"><button type="button" class="live-tree-toggle" aria-expanded="true">${icon("chevron-down", 14)}</button><span>Полимеры</span></div>
                    <div class="live-tree-children">
                      <div class="live-tree-item"><div class="live-tree-row"><button type="button" class="live-tree-toggle is-leaf">${icon("chevron-right", 14)}</button><span>PP-H 1200</span></div></div>
                      <div class="live-tree-item"><div class="live-tree-row"><button type="button" class="live-tree-toggle is-leaf">${icon("chevron-right", 14)}</button><span>HDPE PE100</span></div></div>
                    </div>
                  </div>
                  <div class="live-tree-item">
                    <div class="live-tree-row"><button type="button" class="live-tree-toggle" aria-expanded="false">${icon("chevron-right", 14)}</button><span>Эластомеры</span></div>
                    <div class="live-tree-children" hidden>
                      <div class="live-tree-item"><div class="live-tree-row"><button type="button" class="live-tree-toggle is-leaf">${icon("chevron-right", 14)}</button><span>SBS</span></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Avatar',
    category: 'Data display',
    desc: '<strong>Аватар.</strong> Инициалы на градиентной подложке, 3 размера.',
    params: 'initials · size: sm | md | lg · color',
    states: 'default',
    aiPrompt: `Создай React-компонент Avatar в стиле SB Design System. Пропсы: initials, size sm|md|lg, color?. Без внешних библиотек.`,
    variants: [
      { id: 'sizes', label: 'Sizes', aiPrompt: `Создай Avatar sm/md/lg. Без внешних библиотек.` },
      { id: 'orange', label: 'Orange', aiPrompt: `Создай Avatar orange gradient. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="sizes">
          <span class="showcase-label">Sizes</span>
          <div class="showcase-demo">
            <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
              <div class="avatar av-sm">SB</div>
              <div class="avatar">АК</div>
              <div class="avatar av-lg">ПР</div>
            </div>
          </div>
        </div>
        <div data-variant-id="orange">
          <span class="showcase-label">Orange</span>
          <div class="showcase-demo">
            <div class="avatar av-orange">МК</div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Badge',
    category: 'Data display',
    desc: '<strong>Бейдж / счётчик.</strong> Индикатор количества уведомлений или элементов.',
    params: 'count · tone: primary | danger',
    states: 'default',
    aiPrompt: `Создай React-компонент Badge (счётчик уведомлений) в стиле SB Design System.

Требования:
- Маленький счётчик, который отображается поверх другого элемента (аватара, кнопки, иконки).
- Пропсы: count: number | string, max?: number (если count > max показать max+), tone?: 'danger' | 'primary'.
- Размещение: position absolute, top -6px, right -8px относительно родителя.
- Родитель должен иметь position relative и display inline-flex.
- Минимальная ширина 20px, высота 20px, padding 0 6px.
- Фон: danger #c53b3b (по умолчанию) или primary #008f95.
- Текст: #fff, font-size 11px, font-weight 700.
- border-radius: 20px, display flex, align-items center, justify-content center.
- border: 2px solid #fff (чтобы перекрывал границу родителя).
- Шрифт Inter.
- Без внешних библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Badge counter на кнопке и аватаре. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div style="display:flex;gap:32px;align-items:center;flex-wrap:wrap">
              <div class="badge-wrap">
                <button type="button" class="btn btn-secondary">${icon("bell", 18)} Уведомления</button>
                <span class="badge">4</span>
              </div>
              <div class="badge-wrap">
                <div class="avatar">SB</div>
                <span class="badge">12</span>
              </div>
              <div class="badge-wrap">
                <button type="button" class="btn btn-ghost">Сообщения</button>
                <span class="badge" style="background:var(--primary)">99+</span>
              </div>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'BadgeGroup',
    category: 'Data display',
    desc: '<strong>Группа бейджей-тегов.</strong> Набор элементов с различными статусами (normal/success/warning/alert/neutrals/promo), 2 вариантами оформления (filled/stroked) и 3 размерами (s/m/l). Каждый бейдж может содержать иконку слева или справа и кнопку закрытия.',
    params: 'items[] · size: s|m|l · view: filled|stroked · getStatus · getLabel · getIconLeft · getIconRight · as · attributes',
    states: 'normal · success · warning · alert · neutrals · promo',
    aiPrompt: `Создай React-компонент BadgeGroup в стиле SB Design System.

Требования:
- Группа бейджей-тегов, flex-wrap, gap 10px.
- Пропсы: items: { label, status?, iconLeft?, iconRight?, closable? }[], size: 's' | 'm' | 'l', view: 'filled' | 'stroked'.
- Каждый бейдж: display inline-flex, align-items center, border-radius 100px, font-weight 600.
- Статусы и цвета (filled):
  * normal: фон rgba(0,143,149,0.12), цвет #008f95
  * success: фон rgba(31,143,83,0.12), цвет #166a3d
  * warning: фон rgba(226,163,38,0.12), цвет #8a6411
  * alert: фон rgba(197,59,59,0.12), цвет #8b2a2a
  * neutrals: фон #eef2f4, цвет #123a45
  * promo: фон rgba(230,126,34,0.12), цвет #e67e22
- View stroked: transparent фон + border 1px solid с соответствующим цветом (opacity 0.35).
- Размеры: s (24px высота, 12px), m (30px, 13px), l (36px, 14px).
- Иконка слева/справа — inline SVG, масштабируется с size.
- Кнопка закрытия ${icon("close", 14)} (closable) — удаляет бейдж с анимацией scale + opacity.
- Шрифт Inter, цвета из палитры SB.
- Без внешних библиотек.`,
    variants: [
      { id: 'filled', label: 'Filled', aiPrompt: `Создай BadgeGroup view=filled. Без внешних библиотек.` },
      { id: 'stroked', label: 'Stroked', aiPrompt: `Создай BadgeGroup view=stroked. Без внешних библиотек.` },
      { id: 'sizes', label: 'Sizes', aiPrompt: `Создай BadgeGroup sizes s/m/l. Без внешних библиотек.` },
      { id: 'icons', label: 'With icons', aiPrompt: `Создай BadgeGroup с иконками и close. Без внешних библиотек.` },
      { id: 'delivery', label: 'Delivery', aiPrompt: `Создай BadgeGroup tracking example. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="filled">
          <span class="showcase-label">Filled</span>
          <div class="showcase-demo">
            <div class="sb-badge-group view-filled size-m">
              <div class="sb-bg-item sb-bg-status-normal">Нормальный</div>
              <div class="sb-bg-item sb-bg-status-success">Успех</div>
              <div class="sb-bg-item sb-bg-status-warning"><span class="sb-bg-icon">${icon("alert-circle", 14)}</span> Внимание</div>
              <div class="sb-bg-item sb-bg-status-alert">Ошибка</div>
              <div class="sb-bg-item sb-bg-status-promo">Промо</div>
            </div>
          </div>
        </div>
        <div data-variant-id="stroked">
          <span class="showcase-label">Stroked</span>
          <div class="showcase-demo">
            <div class="sb-badge-group view-stroked size-m">
              <div class="sb-bg-item sb-bg-status-normal">Обычный</div>
              <div class="sb-bg-item sb-bg-status-success">Одобрено</div>
              <div class="sb-bg-item sb-bg-status-warning">На проверке</div>
              <div class="sb-bg-item sb-bg-status-alert">Отклонено</div>
              <div class="sb-bg-item sb-bg-status-neutrals">Черновик</div>
            </div>
          </div>
        </div>
        <div data-variant-id="sizes">
          <span class="showcase-label">Sizes</span>
          <div class="showcase-demo">
            <div class="sb-badge-group view-filled size-s"><div class="sb-bg-item sb-bg-status-success">Size S</div></div>
            <div class="sb-badge-group view-filled size-m" style="margin-top:8px"><div class="sb-bg-item sb-bg-status-success">Size M</div></div>
            <div class="sb-badge-group view-filled size-l" style="margin-top:8px"><div class="sb-bg-item sb-bg-status-success">Size L</div></div>
          </div>
        </div>
        <div data-variant-id="icons">
          <span class="showcase-label">With icons</span>
          <div class="showcase-demo">
            <div class="sb-badge-group view-filled size-m" data-badge-group>
              <div class="sb-bg-item sb-bg-status-success"><span class="sb-bg-icon">${icon("check", 14)}</span>Завершено</div>
              <div class="sb-bg-item sb-bg-status-warning"><span class="sb-bg-icon">${icon("alert-circle", 14)}</span>На модерации</div>
              <div class="sb-bg-item sb-bg-status-alert"><span class="sb-bg-icon">${icon("x-circle", 14)}</span>Отклонено<button class="sb-bg-close" data-bg-close>${icon("close", 14)}</button></div>
            </div>
          </div>
        </div>
        <div data-variant-id="delivery">
          <span class="showcase-label">Delivery</span>
          <div class="showcase-demo">
            <div class="sb-badge-group view-stroked size-m">
              <div class="sb-bg-item sb-bg-status-success"><span class="sb-bg-icon">${icon("map-pin", 14)}</span>Доставлено</div>
              <div class="sb-bg-item sb-bg-status-warning"><span class="sb-bg-icon">${icon("truck", 14)}</span>В пути</div>
              <div class="sb-bg-item sb-bg-status-neutrals"><span class="sb-bg-icon">${icon("file-text", 14)}</span>Оформлен</div>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Card',
    category: 'Layout',
    desc: '<strong>Карточка с гибкой настройкой.</strong> Поддерживает: status (normal/success/warning/alert), form (default/round/square), verticalSpace/horizontalSpace (xs-xl/2xl), shadow (включена/выключена). Может содержать header/body/footer слои.',
    params: 'status: normal|success|warning|alert · form: default|round|square · verticalSpace: xs|sm|md|lg|xl|2xl · horizontalSpace: xs|sm|md|lg|xl|2xl · shadow: true|false',
    states: 'default · hover · active',
    aiPrompt: `Создай React-компонент Card в стиле SB Design System.

Требования:
- Универсальная карточка-контейнер.
- Пропсы: children, status: 'normal' | 'success' | 'warning' | 'alert', form: 'default' | 'round' | 'square', verticalSpace: xs|sm|md|lg|xl|2xl, horizontalSpace: xs|sm|md|lg|xl|2xl, shadow?: boolean.
- Base: white background, border #d7dee1, radius 14px, box-shadow 0 8px 20px rgba(24,34,40,.07), display flex column.
- Padding по verticalSpace/horizontalSpace: xs 8px, sm 12px, md 16px, lg 20px, xl 24px, 2xl 32px.
- Status success/warning/alert меняет border-color и легкую цветную тень.
- form round: radius 28px; square: radius 0; default: 14px.
- shadow=false убирает тень.
- Поддержать секции header/body/footer.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'spacing-xs', label: 'Spacing · xs', aiPrompt: `Создай Card space-xs с header/body. Без внешних библиотек.` },
      { id: 'status-alert', label: 'Status · alert', aiPrompt: `Создай Card status-alert. Без внешних библиотек.` },
      { id: 'status-warning', label: 'Status · warning', aiPrompt: `Создай Card status-warning. Без внешних библиотек.` },
      { id: 'status-success', label: 'Status · success', aiPrompt: `Создай Card status-success. Без внешних библиотек.` },
      { id: 'form-round', label: 'Form · round', aiPrompt: `Создай Card form-round. Без внешних библиотек.` },
      { id: 'form-square', label: 'Form · square', aiPrompt: `Создай Card form-square. Без внешних библиотек.` },
      { id: 'spacing-2xl', label: 'Spacing · 2xl', aiPrompt: `Создай Card space-2xl. Без внешних библиотек.` },
      { id: 'no-shadow', label: 'No shadow', aiPrompt: `Создай Card shadow-false. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="spacing-xs">
          <span class="showcase-label">Spacing · xs</span>
          <div class="showcase-demo">
            <div class="sb-card space-xs">
              <div class="sb-card-header">Заголовок карточки</div>
              <div class="sb-card-body"><p style="margin:0;color:var(--text-secondary);line-height:1.5">Компактные отступы xs.</p></div>
            </div>
          </div>
        </div>
        <div data-variant-id="status-alert">
          <span class="showcase-label">Status · alert</span>
          <div class="showcase-demo">
            <div class="sb-card space-md status-alert">
              <div class="sb-card-header"><h4 style="margin:0;font-size:16px;font-weight:700">Внимание!</h4></div>
              <div class="sb-card-body"><p style="margin:0;color:var(--text-secondary)">Опасная карточка с красной обводкой.</p></div>
            </div>
          </div>
        </div>
        <div data-variant-id="status-warning">
          <span class="showcase-label">Status · warning</span>
          <div class="showcase-demo">
            <div class="sb-card space-md status-warning">
              <div class="sb-card-body"><p style="margin:0;color:var(--text-secondary)">Тревожная карточка с жёлтой обводкой.</p></div>
            </div>
          </div>
        </div>
        <div data-variant-id="status-success">
          <span class="showcase-label">Status · success</span>
          <div class="showcase-demo">
            <div class="sb-card space-md status-success">
              <div class="sb-card-body"><p style="margin:0;color:var(--text-secondary)">Успешная карточка с зелёной обводкой.</p></div>
            </div>
          </div>
        </div>
        <div data-variant-id="form-round">
          <span class="showcase-label">Form · round</span>
          <div class="showcase-demo">
            <div class="sb-card space-md form-round">
              <div class="sb-card-body"><p style="margin:0;color:var(--text-secondary)">Карточка с закруглёнными углами.</p></div>
            </div>
          </div>
        </div>
        <div data-variant-id="form-square">
          <span class="showcase-label">Form · square</span>
          <div class="showcase-demo">
            <div class="sb-card space-md form-square">
              <div class="sb-card-body"><p style="margin:0;color:var(--text-secondary)">Прямоугольная карточка без радиуса.</p></div>
            </div>
          </div>
        </div>
        <div data-variant-id="spacing-2xl">
          <span class="showcase-label">Spacing · 2xl</span>
          <div class="showcase-demo">
            <div class="sb-card space-2xl">
              <div class="sb-card-body"><p style="margin:0;color:var(--text-secondary)">Большие внутренние отступы.</p></div>
            </div>
          </div>
        </div>
        <div data-variant-id="no-shadow">
          <span class="showcase-label">No shadow</span>
          <div class="showcase-demo">
            <div class="sb-card space-md shadow-false">
              <div class="sb-card-body"><p style="margin:0;color:var(--text-secondary)">Карточка без тени.</p></div>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Attachment',
    category: 'Data display',
    desc: '<strong>Вложенный файл.</strong> Карточка файла с иконкой формата, именем, описанием (размер + дата) и опциональными действиями (скачать / удалить). Поддерживает pictogram-режим с цветной иконкой под формат файла.',
    params: 'fileName · fileExtension · fileDescription · withPictogram · onDownload · onRemove · loading · error',
    states: 'default · hover · active · loading · error · disabled',
    aiPrompt: `Создай React-компонент Attachment в стиле SB Design System.

Требования:
- Карточка прикреплённого файла для списка вложений.
- Пропсы: fileName: string, fileExtension: string (jpg/pdf/docx/xls/zip), fileDescription?: string (размер + дата), withPictogram?: boolean, onDownload?: () => void, onRemove?: () => void, loading?: boolean, error?: boolean.
- Структура: [pictogram(48${icon("close", 14)}56px)] [инфо: имя + описание] [действия: скачать/удалить].
- Pictogram: цветной «лист бумаги» с загнутым уголком (clip-path). Цвет зависит от расширения:
  * jpg/png/gif/webp — оранжевый градиент #e67e22 ${icon("chevron-right", 14)} #b5601a
  * pdf — красный #d24a4a ${icon("chevron-right", 14)} #b8302f
  * doc/docx/txt — синий #4a7fd1 ${icon("chevron-right", 14)} #2a5fb8
  * xls/xlsx — зелёный #1f8f53 ${icon("chevron-right", 14)} #166a3d
  * zip/rar — серый #6b7280 ${icon("chevron-right", 14)} #4b5563
  Внутри — текст расширения (11px, 700, uppercase).
- Инфо: имя файла (14px, 600, text-main #123a45), подпись (12px, text-secondary #41636a, tabular-nums).
- Действия: кнопки 32${icon("close", 14)}32px, border-radius 8px, hover — фон rgba(0,143,149,0.1), цвет primary.
  удалить: hover фон rgba(197,59,59,0.1), цвет danger #c53b3b.
- Состояния: loading (спиннер + процент), disabled (серый), hover (border primary + тень).
- Карточка: display flex, padding 14px 18px, border 1px solid #d7dee1, border-radius 12px, max-width 360px.
- Drop-area: пунктирная рамка 2px dashed, padding 28px, иконка загрузки 48px, текст.
- Шрифт Inter, цвета из палитры SB.
- Без внешних библиотек.`,
    variants: [
      { id: 'list', label: 'List', aiPrompt: `Создай Attachment list с pictogram. Без внешних библиотек.` },
      { id: 'drop', label: 'Drop area', aiPrompt: `Создай Attachment drop zone. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="list">
          <span class="showcase-label">List</span>
          <div class="showcase-demo">
            <div class="sb-attachment-list">
              <div class="sb-attachment" data-attachment>
                <div class="sb-attachment-pictogram ext-jpg"><span>jpg</span></div>
                <div class="sb-attachment-info"><div class="sb-attachment-name">Фотография</div><div class="sb-attachment-description">1,5 Mб · 19.07.2020</div></div>
                <div class="sb-attachment-actions">
                  <button class="sb-attachment-action" data-download title="Скачать">${icon("download", 18)}</button>
                  <button class="sb-attachment-action is-danger" data-remove title="Удалить">${icon("trash", 18)}</button>
                </div>
              </div>
              <div class="sb-attachment" data-attachment>
                <div class="sb-attachment-pictogram ext-pdf"><span>pdf</span></div>
                <div class="sb-attachment-info"><div class="sb-attachment-name">Спецификация_PP.pdf</div><div class="sb-attachment-description">2,1 Mб · 20.07.2020</div></div>
                <div class="sb-attachment-actions">
                  <button class="sb-attachment-action" data-download title="Скачать">${icon("download", 18)}</button>
                  <button class="sb-attachment-action is-danger" data-remove title="Удалить">${icon("trash", 18)}</button>
                </div>
              </div>
              <div class="sb-attachment" data-attachment data-attachment-state="loading">
                <div class="sb-attachment-pictogram ext-pdf"><span>pdf</span></div>
                <div class="sb-attachment-info"><div class="sb-attachment-name">Технический отчёт</div><div class="sb-attachment-description" style="display:flex;align-items:center;gap:8px"><span class="spinner sp-sm"></span>Загрузка... 64%</div></div>
                <div class="sb-attachment-actions"><button class="sb-attachment-action is-danger" data-remove title="Отменить">${icon("close", 18)}</button></div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="drop">
          <span class="showcase-label">Drop area</span>
          <div class="showcase-demo">
            <div class="sb-attachment-drop" data-drop>
              <div class="sb-attachment-drop-icon">${icon("upload", 22)}</div>
              <div class="sb-attachment-drop-title">Перетащите файлы сюда</div>
              <div class="sb-attachment-drop-hint">или <button type="button" class="sb-attachment-drop-link">выберите на компьютере</button></div>
            </div>
          </div>
        </div>
      </div> `
  },

  /* ===== Overlay / Feedback ===== */
  {
    name: 'Modal / Dialog',
    category: 'Overlay',
    status: 'stable',
    desc: '<strong>Модальный диалог.</strong> Подтверждение действия (например, отправки формы).',
    params: 'title · message · confirmLabel · cancelLabel',
    states: 'default',
    aiPrompt: `Создай React-компонент Modal/Dialog в стиле SB Design System.

Требования:
- Dialog с backdrop, title, message, actions (confirm/cancel).
- Пропсы: open, onClose, title, children/message, confirmLabel, cancelLabel, onConfirm.
- Backdrop: fixed inset 0, rgba(11,42,48,0.6), z-index, центрирование.
- Modal: white, max-width 360-480px, radius 14px, padding 24px, shadow 0 20px 60px rgba(0,0,0,0.2).
- Actions справа, Button secondary + primary.
- Закрытие: Esc, клик по backdrop, close button.
- Доступность: role dialog, aria-modal, focus trap.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'interactive', label: 'Interactive', aiPrompt: `Создай Modal/Dialog interactive: open, confirm, cancel, Esc. Без внешних библиотек.` },
      { id: 'open', label: 'Open', aiPrompt: `Создай Modal open state: backdrop + dialog с actions. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div data-live-modal>
              <button type="button" class="btn btn-primary btn-s" data-live-modal-open>Открыть диалог</button>
              <div class="live-overlay" data-live-modal-panel hidden>
                <div class="live-modal" role="dialog" aria-modal="true" aria-labelledby="live-modal-title">
                  <h4 id="live-modal-title">Отправить заявку?</h4>
                  <p>После отправки менеджер свяжется с вами в течение 15 минут.</p>
                  <div class="modal-actions">
                    <button type="button" class="btn btn-secondary btn-s" data-live-modal-close>Отмена</button>
                    <button type="button" class="btn btn-primary btn-s" data-live-modal-confirm>Отправить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="open">
          <span class="showcase-label">Open</span>
          <div class="showcase-demo">
            <div class="live-overlay-host" style="position:relative;min-height:280px;border-radius:12px;overflow:hidden;border:1px solid var(--border);background:var(--neutral-bg)">
              <div style="padding:16px;font-size:13px;color:var(--text-secondary)">Контент страницы под модальным окном</div>
              <div class="live-overlay live-overlay--scoped">
                <div class="live-modal" role="dialog" aria-modal="true">
                  <h4>Отправить заявку?</h4>
                  <p>После отправки менеджер свяжется с вами в течение 15 минут.</p>
                  <div class="modal-actions">
                    <button type="button" class="btn btn-secondary btn-s">Отмена</button>
                    <button type="button" class="btn btn-primary btn-s">Отправить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Tooltip',
    category: 'Overlay',
    desc: '<strong>Тултип.</strong> Всплывающая подсказка при наведении (статичная демо).',
    params: 'text · position: top | bottom',
    states: 'visible',
    aiPrompt: `Создай React-компонент Tooltip в стиле SB Design System.

Требования:
- Всплывающая подсказка для кнопок/иконок.
- Пропсы: content/text, position: top|bottom|left|right, children, delay?.
- Tooltip: background text-main #123a45, color #fff, padding 6px 12px, radius 6px, font-size 12px.
- Arrow через CSS border.
- Показывать на hover/focus, скрывать на mouseleave/blur.
- Доступность: aria-describedby, role tooltip.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'top', label: 'Top', aiPrompt: `Создай Tooltip position=top на hover/focus. Без внешних библиотек.` },
      { id: 'bottom', label: 'Bottom', aiPrompt: `Создай Tooltip position=bottom. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="top">
          <span class="showcase-label">Top</span>
          <div class="showcase-demo showcase-demo--tooltip">
            <div class="tooltip-wrap">
              <button type="button" class="btn btn-primary">Наведи на меня</button>
              <div class="tooltip" role="tooltip">Подсказка сверху</div>
            </div>
          </div>
        </div>
        <div data-variant-id="bottom">
          <span class="showcase-label">Bottom</span>
          <div class="showcase-demo showcase-demo--tooltip">
            <div class="tooltip-wrap tooltip-wrap--bottom">
              <button type="button" class="btn btn-secondary">Наведи на меня</button>
              <div class="tooltip tooltip--bottom" role="tooltip">Подсказка снизу</div>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Toast / Notification',
    category: 'Feedback',
    desc: '<strong>Toast-уведомление.</strong> Временное сообщение об успехе операции.',
    params: 'title · text · tone: success | error',
    states: 'default · auto-dismiss (док.)',
    aiPrompt: `Создай React-компонент Toast/Notification в стиле SB Design System.

Требования:
- Уведомление с иконкой, title, text и цветовым tone.
- Пропсы: title, text, tone: success|warning|danger|normal, onClose?, autoClose?.
- Контейнер: white, border-left 4px status-color, padding 14px 16px, radius 6px, shadow card.
- Иконка: 28px circle, background status-color, white check/exclamation.
- Title: 14px/600 text-main; text: 13px text-secondary.
- Auto-dismiss optional, slide/fade animation.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'success', label: 'Success', aiPrompt: `Создай Toast tone=success с title и text. Без внешних библиотек.` },
      { id: 'error', label: 'Error', aiPrompt: `Создай Toast tone=error/danger. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="success">
          <span class="showcase-label">Success</span>
          <div class="showcase-demo">
            <div class="toast">
              <div class="toast-icon">${icon("check-circle", 16)}</div>
              <div class="toast-body">
                <p class="toast-title">Заявка отправлена</p>
                <p class="toast-text">Менеджер свяжется в течение 15 минут</p>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="error">
          <span class="showcase-label">Error</span>
          <div class="showcase-demo">
            <div class="toast" style="border-left-color:var(--danger)">
              <div class="toast-icon" style="background:var(--danger)">${icon("x-circle", 16)}</div>
              <div class="toast-body">
                <p class="toast-title">Ошибка сохранения</p>
                <p class="toast-text">Повторите попытку позже</p>
              </div>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'SnackBar',
    category: 'Feedback',
    desc: '<strong>SnackBar — стек уведомлений.</strong> 4 статуса (normal/success/warning/alert), autoClose с таймером (timer/line), кнопки действий, onClose, 3 формы (default/round/brick). Нажимай кнопки ниже, чтобы добавить новые уведомления в стек.',
    params: 'items[] · form: default|round|brick · getItemKey · getItemMessage · getItemStatus · getItemAutoClose · getItemShowProgress · getItemIcon · getItemActions · getItemOnClose',
    states: 'normal · success · warning · alert · autoClose · closing',
    aiPrompt: `Создай React-компонент SnackBar в стиле SB Design System.

Требования:
- Стек уведомлений с несколькими item.
- Item props: key, message, status: normal|success|warning|alert, autoClose?: boolean|number, showProgress?: timer|line, icon?, actions?, onClose?, progress?.
- Form: default radius 10px, round 100px, brick 0.
- Карточка: white, shadow 0 8px 24px rgba(24,34,40,0.12), status stripe 5px слева.
- Иконка 28px circle с цветом статуса.
- Actions кнопками внутри.
- AutoClose: progress line снизу или timer circle SVG.
- Анимации slideIn/slideOut.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'stack', label: 'Stack · interactive', aiPrompt: `Создай SnackBar stack с autoClose, actions, form variants. Без внешних библиотек.` },
      { id: 'success', label: 'Success', aiPrompt: `Создай SnackBar item status=success с action. Без внешних библиотек.` },
      { id: 'warning', label: 'Warning', aiPrompt: `Создай SnackBar item status=warning. Без внешних библиотек.` },
      { id: 'alert', label: 'Alert', aiPrompt: `Создай SnackBar item status=alert с retry. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="stack">
          <span class="showcase-label">Stack · interactive</span>
          <div class="showcase-demo">
            <div class="sb-snack-demo">
              <div class="sb-snack-controls">
                <button class="btn btn-primary btn-s" data-snack-add="normal">+ Normal</button>
                <button class="btn btn-primary btn-s" style="background:var(--success)" data-snack-add="success">+ Success</button>
                <button class="btn btn-primary btn-s" style="background:var(--warning)" data-snack-add="warning">+ Warning</button>
                <button class="btn btn-primary btn-s" style="background:var(--danger)" data-snack-add="alert">+ Alert</button>
                <button class="btn btn-ghost btn-s" data-snack-clear>Очистить все</button>
              </div>
              <div class="sb-snackbar-stack" id="snack-stack"></div>
            </div>
          </div>
        </div>
        <div data-variant-id="success">
          <span class="showcase-label">Success</span>
          <div class="showcase-demo">
            <div class="sb-snackbar status-success form-default" data-snack-item>
              <div class="sb-snackbar-stripe"></div>
              <div class="sb-snackbar-body">
                <div class="sb-snackbar-icon">${icon("check-circle", 16)}</div>
                <div class="sb-snackbar-content">
                  <div class="sb-snackbar-message">Заявка успешно отправлена!</div>
                  <div class="sb-snackbar-actions"><button class="sb-snackbar-action sb-action-primary">Открыть</button></div>
                </div>
              </div>
              <button class="sb-snackbar-close" data-snack-close>${icon("close", 14)}</button>
            </div>
          </div>
        </div>
        <div data-variant-id="warning">
          <span class="showcase-label">Warning</span>
          <div class="showcase-demo">
            <div class="sb-snackbar status-warning form-default" data-snack-item>
              <div class="sb-snackbar-stripe"></div>
              <div class="sb-snackbar-body">
                <div class="sb-snackbar-icon">${icon("alert-circle", 16)}</div>
                <div class="sb-snackbar-content"><div class="sb-snackbar-message">Ecolen rPET под заказ. Срок 14 дней.</div></div>
              </div>
              <button class="sb-snackbar-close" data-snack-close>${icon("close", 14)}</button>
            </div>
          </div>
        </div>
        <div data-variant-id="alert">
          <span class="showcase-label">Alert</span>
          <div class="showcase-demo">
            <div class="sb-snackbar status-alert form-default" data-snack-item>
              <div class="sb-snackbar-stripe"></div>
              <div class="sb-snackbar-body">
                <div class="sb-snackbar-icon">${icon("x-circle", 16)}</div>
                <div class="sb-snackbar-content">
                  <div class="sb-snackbar-message">Ошибка при сохранении.</div>
                  <div class="sb-snackbar-actions"><button class="sb-snackbar-action sb-action-primary">Повторить</button></div>
                </div>
              </div>
              <button class="sb-snackbar-close" data-snack-close>${icon("close", 14)}</button>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Progress Bar',
    category: 'Feedback',
    desc: '<strong>Индикатор прогресса.</strong> Полоса с градиентом и подписью.',
    params: 'value (0–100) · label',
    states: 'default · animated',
    aiPrompt: `Создай React-компонент ProgressBar в стиле SB Design System.

Требования:
- Пропсы: value 0-100, label?, showValue?, animated?.
- Track: height 10px, background #eef2f4, border-radius 10px, overflow hidden.
- Fill: width value%, gradient #008f95 ${icon("chevron-right", 14)} #4db8bd, border-radius 10px, transition width 0.4s.
- Label row: font-size 13px, font-weight 600, justify space-between.
- Доступность: role progressbar, aria-valuemin/max/now.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай ProgressBar value=64 с label. Без внешних библиотек.` },
      { id: 'low', label: 'Low value', aiPrompt: `Создай ProgressBar value=25. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="progress-wrap">
              <div class="progress-label"><span>Загрузка отчёта</span><span>64%</span></div>
              <div class="progress"><div class="progress-bar"></div></div>
            </div>
          </div>
        </div>
        <div data-variant-id="low">
          <span class="showcase-label">Low value</span>
          <div class="showcase-demo">
            <div class="progress-wrap">
              <div class="progress-label"><span>Синхронизация</span><span>25%</span></div>
              <div class="progress"><div class="progress-bar" style="width:25%"></div></div>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Skeleton',
    category: 'Feedback',
    desc: '<strong>Скелетон.</strong> Shimmer-анимация загрузки карточки.',
    params: 'lines · avatar · shimmer',
    states: 'loading',
    aiPrompt: `Создай React-компонент Skeleton в стиле SB Design System.

Требования:
- Loading placeholder с shimmer-анимацией.
- Пропсы: variant: line|circle|rect|card, width, height, lines?, animated?.
- Background gradient: #eef2f4 25%, #f7fafa 50%, #eef2f4 75%; background-size 200% 100%; animation shimmer 1.6s infinite.
- Radius 6px по умолчанию, circle для avatar.
- Card example: avatar circle + несколько строк.
- Доступность: aria-hidden true или role status при необходимости.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Skeleton card с avatar и lines shimmer. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="skeleton-card">
              <div style="display:flex;gap:10px;align-items:center">
                <div class="skeleton" style="width:36px;height:36px;border-radius:50%"></div>
                <div style="flex:1;display:flex;flex-direction:column;gap:6px">
                  <div class="skeleton sk-line w-60"></div>
                  <div class="skeleton sk-line w-40"></div>
                </div>
              </div>
              <div class="skeleton sk-title"></div>
              <div class="skeleton sk-line w-80"></div>
              <div class="skeleton sk-line"></div>
            </div>
          </div>
        </div>
      </div> `
  },
  {
    name: 'Loader / Spinner',
    category: 'Feedback',
    desc: '<strong>CSS-спиннер.</strong> Индикатор загрузки, три размера.',
    params: 'size: sm | md | lg',
    states: 'spinning',
    aiPrompt: `Создай React-компонент Loader/Spinner в стиле SB Design System.

Требования:
- CSS spinner с размерами sm/md/lg.
- Пропсы: size: sm|md|lg, label?, color?, inline?.
- Spinner: border solid #eef2f4, border-top-color primary #008f95, border-radius 50%, animation spin 0.8s linear infinite.
- Размеры: sm 24px border 2px, md 40px border 3px, lg 56px border 4px.
- Доступность: role status, aria-label="Загрузка".
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'sm', label: 'Size · sm', aiPrompt: `Создай Spinner size=sm 24px. Без внешних библиотек.` },
      { id: 'md', label: 'Size · md', aiPrompt: `Создай Spinner size=md 40px. Без внешних библиотек.` },
      { id: 'lg', label: 'Size · lg', aiPrompt: `Создай Spinner size=lg 56px. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="sm">
          <span class="showcase-label">Size · sm</span>
          <div class="showcase-demo"><div class="spinner sp-sm"></div></div>
        </div>
        <div data-variant-id="md">
          <span class="showcase-label">Size · md</span>
          <div class="showcase-demo"><div class="spinner"></div></div>
        </div>
        <div data-variant-id="lg">
          <span class="showcase-label">Size · lg</span>
          <div class="showcase-demo"><div class="spinner sp-lg"></div></div>
        </div>
      </div> `
  },
  {
    name: 'ProgressSpin',
    category: 'Feedback',
    status: 'stable',
    desc: '<strong>Индикатор загрузки (Spin).</strong> Спиннер с подписью, размерами XS–L, вариантами circle / dots / ring, тонами и режимом overlay для блоков.',
    params: 'spinning · tip · size: xs|s|m|l · variant: circle|dots|ring · tone: primary|success|neutral|white · children · fullscreen (док.)',
    states: 'spinning · static',
    aiPrompt: `Создай React-компонент ProgressSpin в стиле SB Design System (аналог Ant Design Spin).

Требования:
- Пропсы: spinning?: boolean (default true), tip?: string, size?: 'xs'|'s'|'m'|'l', variant?: 'circle'|'dots'|'ring', tone?: 'primary'|'success'|'neutral'|'white', children? (обёртка с overlay).
- circle: border spinner, border-top-color primary #008f95.
- dots: 3 точки с bounce-анимацией.
- ring: двойное кольцо, вращение.
- Размеры indicator: xs 16px, s 24px, m 32px, l 48px.
- tip: под спиннером, 12–13px text-secondary, margin-top 10px.
- Overlay: при children + spinning — полупрозрачный фон rgba(255,255,255,0.72), spinner по центру.
- tone white — для тёмного фона.
- role="status", aria-live="polite", aria-busy при spinning.
- Без внешних UI-библиотек.`,
    variants: [
      { id: 'circle', label: 'Circle', aiPrompt: `Создай ProgressSpin variant=circle с tip. Без внешних библиотек.` },
      { id: 'dots', label: 'Dots', aiPrompt: `Создай ProgressSpin variant=dots. Без внешних библиотек.` },
      { id: 'ring', label: 'Ring', aiPrompt: `Создай ProgressSpin variant=ring. Без внешних библиотек.` },
      { id: 'overlay', label: 'Overlay', aiPrompt: `Создай ProgressSpin overlay на контенте. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="circle">
          <span class="showcase-label">Circle</span>
          <div class="showcase-demo">
            <div class="sb-progress-spin size-m variant-circle tone-primary" role="status" aria-label="Загрузка">
              <span class="sb-progress-spin-indicator" aria-hidden="true"></span>
              <span class="sb-progress-spin-tip">Загрузка данных...</span>
            </div>
          </div>
        </div>
        <div data-variant-id="dots">
          <span class="showcase-label">Dots</span>
          <div class="showcase-demo">
            <div class="sb-progress-spin size-m variant-dots tone-primary" role="status" aria-label="Dots">
              <span class="sb-progress-spin-indicator sb-progress-spin-dots" aria-hidden="true"><span></span><span></span><span></span></span>
              <span class="sb-progress-spin-tip">Dots</span>
            </div>
          </div>
        </div>
        <div data-variant-id="ring">
          <span class="showcase-label">Ring</span>
          <div class="showcase-demo">
            <div class="sb-progress-spin size-m variant-ring tone-primary" role="status" aria-label="Ring">
              <span class="sb-progress-spin-indicator" aria-hidden="true"></span>
              <span class="sb-progress-spin-tip">Ring</span>
            </div>
          </div>
        </div>
        <div data-variant-id="overlay">
          <span class="showcase-label">Overlay</span>
          <div class="showcase-demo">
            <div class="sb-progress-spin-wrap is-spinning">
              <div class="sb-progress-spin-overlay" aria-hidden="true">
                <div class="sb-progress-spin size-m variant-dots tone-primary" role="status" aria-busy="true">
                  <span class="sb-progress-spin-indicator sb-progress-spin-dots"><span></span><span></span><span></span></span>
                  <span class="sb-progress-spin-tip">Обновление...</span>
                </div>
              </div>
              <div class="sb-progress-spin-content">
                <div style="font-size:14px;font-weight:600;margin-bottom:8px">Каталог полимеров</div>
                <div style="font-size:13px;color:var(--text-secondary)">Контент затемнён overlay.</div>
              </div>
            </div>
          </div>
        </div>
      </div> `
  },

  /* ===== Новые компоненты — Form ===== */

  { name: 'DatePicker', category: 'Form', status: 'stable', desc: '<strong>Выбор даты.</strong> Календарь для выбора одной даты.', params: 'value · onChange · min · max · placeholder · disabled · error', states: 'default · open · filled · disabled · error', aiPrompt: `Создай DatePicker (React): input + dropdown calendar, мини-календарь с month/year навигацией, выбор дня подсветкой primary #008f95, disabled dates. Формат даты dd.mm.yyyy. Форма/цвета SB: white, border #d7dee1, radius 10px, focus primary.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай DatePicker interactive. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div class="live-demo-badge">● Live demo</div><div class="live-demo-row"><div class="live-field" data-live-datepicker><label class="live-field-label">Дата</label><div class="live-picker-wrap"><button type="button" class="live-field-trigger is-placeholder" data-live-dp-trigger><span data-live-dp-value>Выберите дату</span><span class="live-field-icon">📅</span></button><div class="live-picker-dropdown" data-live-dp-dropdown hidden><div class="live-cal-head"><button type="button" data-live-dp-prev aria-label="Предыдущий месяц">‹</button><span data-live-dp-month></span><button type="button" data-live-dp-next aria-label="Следующий месяц">›</button></div><div class="live-cal-grid" data-live-dp-grid></div></div></div></div><div class="live-field"><label class="live-field-label">Disabled</label><button type="button" class="live-field-trigger is-placeholder" disabled><span>—</span><span class="live-field-icon">📅</span></button></div></div></div></div></div></div>` },

  { name: 'DateRangePicker', category: 'Form', status: 'stable', desc: '<strong>Выбор диапазона дат.</strong> Два календаря для выбора начала и конца периода.', params: 'value · onChange · min · max · placeholder · disabled', states: 'default · open · filled', aiPrompt: `Создай DateRangePicker (React): два input (start/end) с dropdown календарём. Выбранный диапазон подсветка на обоих календарях. Пропсы: value: { from, to }, onChange, min, max, placeholder, disabled. Стили SB.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай DateRangePicker interactive. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div class="live-demo-badge">● Live demo</div><div class="live-field" data-live-daterange><label class="live-field-label">Период</label><div class="live-picker-wrap"><button type="button" class="live-field-trigger" data-live-dr-trigger><span data-live-dr-value>14.03.2026 ${icon("chevron-right", 14)} 21.03.2026</span><span class="live-field-icon">📅</span></button><div class="live-picker-dropdown" data-live-dr-dropdown hidden><div class="live-cal-head"><button type="button" data-live-dr-prev aria-label="Предыдущий месяц">‹</button><span data-live-dr-month></span><button type="button" data-live-dr-next aria-label="Следующий месяц">›</button></div><div class="live-cal-grid" data-live-dr-grid></div><p style="margin:8px 0 0;font-size:11px;color:var(--text-secondary)">Клик 1 — начало, клик 2 — конец диапазона</p></div></div></div></div></div></div></div>` },

  { name: 'TimePicker', category: 'Form', status: 'stable', desc: '<strong>Выбор времени.</strong> Часы/минуты через dropdown или input.', params: 'value · onChange · format · disabled', states: 'default · open · filled · disabled', aiPrompt: `Создай TimePicker (React): input с mask HH:mm, dropdown с часами/минутами. Пропсы: value, onChange, format 'HH:mm'|'hh:mm A', disabled. Стили SB: white, border #d7dee1, radius 10px, focus primary.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай TimePicker interactive. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div class="live-demo-badge">● Live demo</div><div class="live-field" data-live-timepicker><label class="live-field-label">Время</label><div class="live-picker-wrap"><button type="button" class="live-field-trigger" data-live-tp-trigger><span data-live-tp-value>14:30</span><span class="live-field-icon">🕐</span></button><div class="live-picker-dropdown" data-live-tp-dropdown hidden><div class="live-time-columns"><div class="live-time-col" data-live-tp-hours></div><div class="live-time-col" data-live-tp-mins></div></div></div></div></div></div></div></div></div>` },

  { name: 'FileUpload', category: 'Form', status: 'stable', desc: '<strong>Загрузка файлов.</strong> Drag &amp; drop зона, выбор с диска и превью загруженных файлов с прогрессом.', params: 'accept · multiple · maxSize · onUpload · onRemove · showPreview · disabled', states: 'default · dragover · uploading · success · error', aiPrompt: `Создай FileUpload (React): drop-zone с пунктирной рамкой 2px dashed, drag & drop, кнопка выбора. Пропсы: accept, multiple, maxSize, onUpload, onRemove, showPreview, disabled. Список файлов с превью (thumbnail для изображений, иконка для документов), progress bar при загрузке, кнопка удаления. Состояния: default, dragover, uploading, success, error. Стили SB.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай FileUpload drag & drop interactive. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div class="live-demo-badge">● Live demo</div><div class="live-upload" data-live-fileupload><input type="file" data-live-upload-input multiple accept="image/*,.pdf,.xlsx" hidden><div class="live-upload-zone" data-live-upload-zone><div class="live-upload-zone-icon">📤</div><div class="live-upload-zone-title">Перетащите файлы сюда</div><div class="live-upload-zone-hint">или кликните для выбора — PNG, JPG, PDF, XLSX</div></div><div class="live-upload-list" data-live-upload-list></div></div></div></div></div>` },

  { name: 'Transfer List', category: 'Form', status: 'stable', desc: '<strong>Двусторонний список.</strong> Перенос элементов между двумя колонками с чекбоксами.', params: 'leftItems[] · rightItems[] · onMove · selection[] · titles', states: 'default · selected · disabled', aiPrompt: `Создай React-компонент TransferList в стиле SB: две колонки списков, выбор чекбоксами, кнопки переноса вправо/влево, select-all, disabled и selected states. Пропсы: leftItems, rightItems, onMove, titles.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай TransferList interactive. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div class="live-demo-badge">● Live demo</div><div class="live-transfer" data-live-transfer><div class="live-transfer-panel"><div class="live-transfer-title">Доступные</div><div data-live-transfer-left><div class="live-transfer-item is-checked"><label class="checkbox size-s live-transfer-check"><input type="checkbox" checked aria-label="Полипропилен" /></label><span class="live-transfer-item-label">Полипропилен</span></div><div class="live-transfer-item"><label class="checkbox size-s live-transfer-check"><input type="checkbox" aria-label="Полиэтилен" /></label><span class="live-transfer-item-label">Полиэтилен</span></div><div class="live-transfer-item"><label class="checkbox size-s live-transfer-check"><input type="checkbox" aria-label="Ecolen" /></label><span class="live-transfer-item-label">Ecolen</span></div></div></div><div class="live-transfer-actions"><button type="button" class="btn btn-secondary btn-s" data-live-transfer-to-right aria-label="Перенести вправо">${icon("chevron-right", 14)}</button><button type="button" class="btn btn-secondary btn-s" data-live-transfer-to-left aria-label="Перенести влево">${icon("chevron-left", 14)}</button></div><div class="live-transfer-panel"><div class="live-transfer-title">Выбранные</div><div data-live-transfer-right><div class="live-transfer-item"><label class="checkbox size-s live-transfer-check"><input type="checkbox" aria-label="Полистирол" /></label><span class="live-transfer-item-label">Полистирол</span></div></div></div></div></div></div></div>` },

  { name: 'ColorPicker', category: 'Form', status: 'stable', desc: '<strong>Выбор цвета.</strong> Палитра swatch + поле HEX и превью выбранного цвета.', params: 'value · onChange · presets[] · showInput · disabled', states: 'default · selected · hover · open', aiPrompt: `Создай React-компонент ColorPicker: swatch-палитра, input HEX (#008f95), превью цвета, опционально hue/saturation panel. Пропсы: value, onChange, presets[], showInput, disabled. Стили SB.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай ColorPicker interactive. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div class="live-demo-badge">● Live demo</div><div class="live-colorpicker" data-live-colorpicker><div class="live-color-swatches"><button type="button" class="live-color-swatch is-selected" data-color="#008f95" style="background:#008f95" aria-label="Primary"></button><button type="button" class="live-color-swatch" data-color="#e67e22" style="background:#e67e22" aria-label="Orange"></button><button type="button" class="live-color-swatch" data-color="#1f8f53" style="background:#1f8f53" aria-label="Success"></button><button type="button" class="live-color-swatch" data-color="#c53b3b" style="background:#c53b3b" aria-label="Danger"></button><button type="button" class="live-color-swatch" data-color="#123a45" style="background:#123a45" aria-label="Text"></button></div><div class="live-color-preview" data-live-color-preview></div><div class="live-color-hex"><div class="live-color-hex-box" data-live-color-hex-box></div><input type="text" data-live-color-hex-input value="#008f95" maxlength="7" aria-label="HEX"></div></div></div></div></div>` },

  /* ===== Прочие новые компоненты ===== */

  { name: 'SearchInput', category: 'Form', desc: '<strong>Строка поиска.</strong> Input с иконкой лупы и быстрой фильтрацией.', params: 'value · onChange · placeholder · onSearch · loading', states: 'default · focused · has-value · loading', aiPrompt: `Создай SearchInput (React): input с иконкой лупы слева, clear справа. Пропсы: value, onChange, placeholder, onSearch, loading (показывать спиннер). Стили SB: border #d7dee1, radius 100px (pill), focus primary + glow.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай SearchInput pill с иконкой search. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div style="display:flex;flex-direction:column;gap:4px;max-width:320px;width:100%"><div style="background:var(--surface);border:1px solid var(--border);border-radius:100px;padding:10px 16px;display:flex;align-items:center;gap:10px"><span style="color:var(--text-secondary);font-size:16px">${icon("search", 16)}</span><span style="flex:1;font-size:14px;color:var(--text-main)">Найти продукцию...</span></div></div></div></div></div>` },

  { name: 'PasswordInput', category: 'Form', desc: '<strong>Пароль.</strong> Input с toggle show/hind и индикатором сложности.', params: 'value · onChange · showToggle · strength', states: 'default · focused · visible · hidden', aiPrompt: `Создай PasswordInput (React): input type=password с кнопкой-eye toggle. Пропсы: value, onChange, showToggle, strength (weak|medium|strong), disabled. При нажатии на глаз переключается type. Индикатор сложности: полоска с цветом (красный/жёлтый/зелёный). Стили SB.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай PasswordInput с toggle и strength bar. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div style="display:flex;flex-direction:column;gap:4px;max-width:280px;width:100%"><div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:8px"><span style="flex:1;font-size:14px;color:var(--text-main)">••••••••</span><button style="border:0;background:transparent;cursor:pointer;font-size:16px;color:var(--text-secondary)">${icon("eye", 18)}</button></div><div style="height:3px;background:var(--success);border-radius:3px;width:70%"></div><div style="font-size:11px;color:var(--success);font-weight:600">Надёжный</div></div></div></div></div>` },

  { name: 'PhoneInput', category: 'Form', desc: '<strong>Телефон.</strong> Маска ввода + выбор страны/кода.', params: 'value · onChange · country · disabled · error', states: 'default · focused · filled · error', aiPrompt: `Создай PhoneInput (React): input с маской +7 (XXX) XXX-XX-XX, dropdown выбора страны с флагом. Пропсы: value, onChange, country, disabled, error. Маска ввода. Стили SB: border #d7dee1, radius 10px.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай PhoneInput с маской +7. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div style="display:flex;flex-direction:column;gap:4px;max-width:280px;width:100%"><label style="font-size:12px;font-weight:600;color:var(--text-main)">Телефон</label><div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:8px"><span style="font-size:13px;color:var(--text-secondary);padding:4px 8px;background:var(--neutral-bg);border-radius:6px">🇷🇺 +7</span><span style="font-size:14px;color:var(--text-main);flex:1">(912) 345-67-89</span></div></div></div></div></div>` },

  { name: 'PinInput', category: 'Form', desc: '<strong>OTP / PIN.</strong> Код подтверждения из N ячеек.', params: 'length · value · onChange · type: number|text', states: 'default · filled · error', aiPrompt: `Создай PinInput (React): N input-ячеек (по умолчанию 4-6), автофокус следующего ячейки, paste поддержка. Пропсы: length, value, onChange, type. Стили SB: ячейки 48${icon("close", 14)}48px, border #d7dee1, radius 10px, фокус primary.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай PinInput 6 ячеек. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div style="display:flex;gap:8px;justify-content:center"><div style="width:48px;height:48px;border:2px solid var(--primary);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:var(--primary);background:var(--surface)">5</div><div style="width:48px;height:48px;border:2px solid var(--primary);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:var(--primary);background:var(--surface)">8</div><div style="width:48px;height:48px;border:2px solid var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:var(--text-secondary);background:var(--surface)">·</div><div style="width:48px;height:48px;border:2px solid var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:var(--text-secondary);background:var(--surface)">·</div></div></div></div></div>` },

  { name: 'Rating', category: 'Form', desc: '<strong>Оценка.</strong> Звёзды / числа для оценки от 1 до N.', params: 'value · onChange · max · size · readonly', states: 'default · hover · selected · readonly', aiPrompt: `Создай Rating (React): 5 звёзд (или N), hover показывает предварительную оценку, клик устанавливает. Пропсы: value, onChange, max=5, size (sm|md|lg), readonly, color primary #008f95. Disabled state.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай Rating 5 звёзд, value=4. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div style="display:flex;gap:4px;font-size:28px"><span style="color:#e67e22">★</span><span style="color:#e67e22">★</span><span style="color:#e67e22">★</span><span style="color:#e67e22">★</span><span style="color:#d7dee1">★</span></div></div></div></div>` },

  { name: 'Counter / Stepper', category: 'Form', desc: '<strong>Счётчик.</strong> Поле ввода с кнопками +/- и ограничениями.', params: 'value · onChange · min · max · step', states: 'default · disabled', aiPrompt: `Создай Counter (React): input + кнопки - и + по бокам. Пропсы: value, onChange, min, max, step=1, disabled. Кнопки: disabled при min/max. Стили SB: border #d7dee1, radius 8px.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай Counter +/- stepper. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div style="display:flex;align-items:center;border:1px solid var(--border);border-radius:8px;overflow:hidden"><button style="width:40px;height:40px;border:0;background:var(--neutral-bg);cursor:pointer;font-size:18px;font-weight:700">${icon("minus", 16)}</button><div style="width:56px;height:40px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;border-left:1px solid var(--border);border-right:1px solid var(--border)">3</div><button style="width:40px;height:40px;border:0;background:var(--neutral-bg);cursor:pointer;font-size:18px;font-weight:700">+</button></div></div></div></div>` },

  { name: 'FormField', category: 'Form', desc: '<strong>Обёртка формы.</strong> Label + input + hint/error. Унифицирует вертикальные отступы.', params: 'label · hint · error · required · children', states: 'default · error · disabled', aiPrompt: `Создай FormField (React wrapper): label сверху, children (input) по центру, hint/error снизу. Пропсы: label, hint?, error?, required?, children, className. Вертикальный gap 6px. Label 13px/600. Error danger. Hint text-secondary. disabled серый.`, variants: [{ id: 'default', label: 'Default', aiPrompt: `Создай FormField: label, input, hint. Без внешних библиотек.` }, { id: 'error', label: 'Error', aiPrompt: `Создай FormField с error message. Без внешних библиотек.` }], demo: `<div class="component-showcase"><div data-variant-id="default"><span class="showcase-label">Default</span><div class="showcase-demo"><div style="display:flex;flex-direction:column;gap:6px;max-width:280px;width:100%"><label style="font-size:13px;font-weight:600;color:var(--text-main)">Email <span style="color:var(--danger)">*</span></label><div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:15px;color:var(--text-main)">example@mail.ru</div><span style="font-size:12px;color:var(--text-secondary)">Ваш рабочий email</span></div></div></div><div data-variant-id="error"><span class="showcase-label">Error</span><div class="showcase-demo"><div style="display:flex;flex-direction:column;gap:6px;max-width:280px;width:100%"><label style="font-size:13px;font-weight:600;color:var(--text-main)">Email <span style="color:var(--danger)">*</span></label><div style="background:var(--surface);border:1px solid var(--danger);border-radius:8px;padding:10px 14px;font-size:15px">invalid</div><span style="font-size:12px;color:var(--danger)">Введите корректный email</span></div></div></div></div>` },

  // --- Navigation ---
  {
    name: 'Sidebar Navigation',
    category: 'Navigation',
    desc: '<strong>Боковое меню.</strong> Вертикальная навигация с иконками. 2 варианта: expanded · collapsed.',
    params: 'items[] · collapsed · activeItem',
    states: 'default · collapsed · item-active',
    aiPrompt: `Создай SidebarNav (React): вертикальная навигация с иконками и подписями. Пропсы: items, collapsed, activeItem. Стили SB.`,
    variants: [
      { id: 'expanded', label: 'Expanded', aiPrompt: `Создай SidebarNav expanded: иконки + подписи, activeItem с фоном rgba(0,143,149,0.08). Без внешних библиотек.` },
      { id: 'collapsed', label: 'Collapsed', aiPrompt: `Создай SidebarNav collapsed: только иконки 40px, tooltip при hover. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="expanded">
          <span class="showcase-label">Expanded</span>
          <div class="showcase-demo">
            <div style="width:200px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:8px;display:flex;flex-direction:column;gap:2px;font-size:14px">
              <div style="padding:10px 14px;border-radius:8px;font-weight:600;color:var(--primary);background:rgba(0,143,149,0.08);display:flex;gap:10px;align-items:center"><span>${icon("file-text", 16)}</span> Документы</div>
              <div style="padding:10px 14px;border-radius:8px;color:var(--text-main);display:flex;gap:10px;align-items:center"><span>${icon("bar-chart", 16)}</span> Аналитика</div>
              <div style="padding:10px 14px;border-radius:8px;color:var(--text-main);display:flex;gap:10px;align-items:center"><span>${icon("users", 16)}</span> Команда</div>
              <div style="padding:10px 14px;border-radius:8px;color:var(--text-main);display:flex;gap:10px;align-items:center"><span>${icon("settings", 16)}</span> Настройки</div>
            </div>
          </div>
        </div>
        <div data-variant-id="collapsed">
          <span class="showcase-label">Collapsed</span>
          <div class="showcase-demo">
            <div style="width:56px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:8px;display:flex;flex-direction:column;gap:4px;align-items:center">
              <div style="width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--primary);background:rgba(0,143,149,0.08)">${icon("file-text", 16)}</div>
              <div style="width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text-main)">${icon("bar-chart", 16)}</div>
              <div style="width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text-main)">${icon("users", 16)}</div>
              <div style="width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text-main)">${icon("settings", 16)}</div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    name: 'Drawer Menu',
    category: 'Navigation',
    desc: '<strong>Боковая панель.</strong> Выезжает слева или справа. 2 варианта: left · right.',
    params: 'open · onClose · side · width · children',
    states: 'closed · opening · open · closing',
    aiPrompt: `Создай Drawer (React): fixed боковая панель с backdrop. Пропсы: open, onClose, side, width, children. Стили SB.`,
    variants: [
      { id: 'left', label: 'Side · left', aiPrompt: `Создай Drawer side=left: панель слева, backdrop, header + close. Без внешних библиотек.` },
      { id: 'right', label: 'Side · right', aiPrompt: `Создай Drawer side=right: панель справа, backdrop, header + close. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="left">
          <span class="showcase-label">Side · left</span>
          <div class="showcase-demo">
            <div style="position:relative;width:280px;height:180px;background:var(--neutral-bg);border-radius:10px;overflow:hidden;border:1px solid var(--border)">
              <div style="position:absolute;left:0;top:0;bottom:0;width:180px;background:var(--surface);border-right:1px solid var(--border);padding:16px;box-shadow:4px 0 12px rgba(0,0,0,0.08)">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;font-weight:700;font-size:15px">Меню <span style="cursor:pointer;color:var(--text-secondary)">${icon("close", 14)}</span></div>
                <div style="display:flex;flex-direction:column;gap:4px;font-size:13px">
                  <div style="padding:8px 12px;border-radius:6px;background:rgba(0,143,149,0.08);color:var(--primary)">Профиль</div>
                  <div style="padding:8px 12px;border-radius:6px">Настройки</div>
                  <div style="padding:8px 12px;border-radius:6px">Выход</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="right">
          <span class="showcase-label">Side · right</span>
          <div class="showcase-demo">
            <div style="position:relative;width:280px;height:180px;background:var(--neutral-bg);border-radius:10px;overflow:hidden;border:1px solid var(--border)">
              <div style="position:absolute;right:0;top:0;bottom:0;width:180px;background:var(--surface);border-left:1px solid var(--border);padding:16px;box-shadow:-4px 0 12px rgba(0,0,0,0.08)">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;font-weight:700;font-size:15px"><span style="cursor:pointer;color:var(--text-secondary)">${icon("close", 14)}</span> Фильтры</div>
                <div style="display:flex;flex-direction:column;gap:4px;font-size:13px">
                  <div style="padding:8px 12px;border-radius:6px;background:rgba(0,143,149,0.08);color:var(--primary)">Категория</div>
                  <div style="padding:8px 12px;border-radius:6px">Регион</div>
                  <div style="padding:8px 12px;border-radius:6px">Период</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    name: 'Menu / Dropdown',
    category: 'Navigation',
    desc: '<strong>Выпадающее меню.</strong> Дропдаун с пунктами и иконками.',
    params: 'items[] · trigger · position · onSelect',
    states: 'closed · open',
    aiPrompt: `Создай DropdownMenu (React): кнопка-триггер + выпадающий список. Пропсы: items, trigger, position, onSelect. Стили SB.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай DropdownMenu: пункты с иконками, разделитель, danger-пункт «Удалить». Radius 10px, shadow. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo" style="align-items:flex-start">
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:6px;width:160px;box-shadow:0 8px 24px rgba(0,0,0,0.12)">
              <div style="padding:8px 12px;border-radius:6px;font-size:14px;cursor:pointer">${icon("copy", 16)} Копировать</div>
              <div style="padding:8px 12px;border-radius:6px;font-size:14px;cursor:pointer">${icon("edit", 16)} Редактировать</div>
              <div style="height:1px;background:var(--border);margin:4px 0"></div>
              <div style="padding:8px 12px;border-radius:6px;font-size:14px;cursor:pointer;color:var(--danger)">${icon("trash", 16)} Удалить</div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    name: 'Command Palette',
    category: 'Navigation',
    desc: '<strong>Командная палитра.</strong> Ctrl+K поиск по функциям приложения.',
    params: 'open · onClose · commands[] · placeholder',
    states: 'closed · searching · empty',
    aiPrompt: `Создай CommandPalette (React): модал с input и списком команд. Ctrl+K. Стили SB.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай CommandPalette: поиск, категории, shortcut badge ⌘K. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div style="width:100%;max-width:420px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:4px;box-shadow:0 20px 60px rgba(0,0,0,0.2)">
              <div style="padding:12px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)">
                <span style="color:var(--text-secondary)">${icon("search", 16)}</span>
                <span style="font-size:15px;color:var(--text-main)">Поиск команд...</span>
                <span style="margin-left:auto;font-size:11px;background:var(--neutral-bg);padding:2px 6px;border-radius:4px;font-weight:600">⌘K</span>
              </div>
              <div style="padding:8px">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-secondary);padding:6px 12px">Навигация</div>
                <div style="padding:10px 12px;border-radius:8px;font-size:14px;cursor:pointer;background:rgba(0,143,149,0.06)">${icon("home", 16)} На главную</div>
                <div style="padding:10px 12px;border-radius:8px;font-size:14px;cursor:pointer;color:var(--text-main)">${icon("file-text", 16)} К документации</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  {
    name: 'Anchor Navigation',
    category: 'Navigation',
    desc: '<strong>Якорная навигация.</strong> Sticky-меню по секциям страницы. 2 варианта: underline · pills.',
    params: 'items[] · activeId · offset · view',
    states: 'default · active · scrolled',
    aiPrompt: `Создай AnchorNav (React): навигация по секциям страницы. Пропсы: items, activeId, offset. Стили SB.`,
    variants: [
      { id: 'underline', label: 'Underline', aiPrompt: `Создай AnchorNav underline: border-bottom, active — 2px primary. Без внешних библиотек.` },
      { id: 'pills', label: 'Pills', aiPrompt: `Создай AnchorNav pills: pill-кнопки на серой подложке, active — белый фон. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="underline">
          <span class="showcase-label">Underline</span>
          <div class="showcase-demo">
            <nav style="display:flex;gap:24px;border-bottom:1px solid var(--border);font-size:14px">
              <a style="padding-bottom:10px;border-bottom:2px solid var(--primary);color:var(--primary);font-weight:600;text-decoration:none">Обзор</a>
              <a style="padding-bottom:10px;color:var(--text-secondary);text-decoration:none">Токены</a>
              <a style="padding-bottom:10px;color:var(--text-secondary);text-decoration:none">Компоненты</a>
              <a style="padding-bottom:10px;color:var(--text-secondary);text-decoration:none">Контакты</a>
            </nav>
          </div>
        </div>
        <div data-variant-id="pills">
          <span class="showcase-label">Pills</span>
          <div class="showcase-demo">
            <nav style="display:inline-flex;gap:4px;background:var(--neutral-bg);padding:4px;border-radius:40px;font-size:14px">
              <a style="padding:8px 16px;border-radius:40px;background:var(--surface);color:var(--text-main);font-weight:600;text-decoration:none;box-shadow:0 2px 6px rgba(0,0,0,0.06)">Обзор</a>
              <a style="padding:8px 16px;border-radius:40px;color:var(--text-secondary);text-decoration:none">Токены</a>
              <a style="padding:8px 16px;border-radius:40px;color:var(--text-secondary);text-decoration:none">Компоненты</a>
            </nav>
          </div>
        </div>
      </div>
    `
  },

  {
    name: 'Footer Navigation',
    category: 'Navigation',
    desc: '<strong>Подвал сайта.</strong> Многоколоночный или компактный. 2 варианта: columns · compact.',
    params: 'columns[] · copyright · socialLinks',
    states: 'default',
    aiPrompt: `Создай Footer (React): многоколоночный подвал. Пропсы: columns, copyright, socialLinks. Стили SB.`,
    variants: [
      { id: 'columns', label: 'Columns', aiPrompt: `Создай Footer columns: 3 колонки ссылок, border-top. Без внешних библиотек.` },
      { id: 'compact', label: 'Compact', aiPrompt: `Создай Footer compact: одна строка копирайт + ссылки. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="columns">
          <span class="showcase-label">Columns</span>
          <div class="showcase-demo">
            <footer style="border-top:1px solid var(--border);padding:24px;font-size:13px;width:100%">
              <div style="display:flex;gap:24px;flex-wrap:wrap">
                <div><strong style="color:var(--text-main)">Компания</strong><div style="margin-top:8px;color:var(--text-secondary);display:flex;flex-direction:column;gap:4px">О нас · Вакансии · Пресса</div></div>
                <div><strong style="color:var(--text-main)">Продукция</strong><div style="margin-top:8px;color:var(--text-secondary);display:flex;flex-direction:column;gap:4px">Каталог · Документация · Цены</div></div>
                <div><strong style="color:var(--text-main)">Поддержка</strong><div style="margin-top:8px;color:var(--text-secondary);display:flex;flex-direction:column;gap:4px">FAQ · Контакты · SLA</div></div>
              </div>
            </footer>
          </div>
        </div>
        <div data-variant-id="compact">
          <span class="showcase-label">Compact</span>
          <div class="showcase-demo">
            <footer style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:16px;font-size:13px;color:var(--text-secondary);flex-wrap:wrap;gap:8px;width:100%">
              <span>© 2026 SB</span>
              <div style="display:flex;gap:16px"><a style="color:var(--text-secondary);text-decoration:none">Политика</a><a style="color:var(--text-secondary);text-decoration:none">Условия</a></div>
            </footer>
          </div>
        </div>
      </div>
    `
  },

  // --- Overlay / Feedback ---
  { name: 'Drawer / SidePanel', category: 'Overlay', status: 'stable', desc: '<strong>Боковая панель.</strong> Выезжает слева/справа с overlay.', params: 'open · onClose · title · side · width', states: 'closed · open', aiPrompt: `Создай Drawer/SidePanel interactive. Без внешних библиотек.`, variants: [
      { id: 'interactive', label: 'Interactive', aiPrompt: `Создай Drawer interactive open/close. Без внешних библиотек.` },
      { id: 'open', label: 'Open', aiPrompt: `Создай Drawer open state side=left. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div data-live-drawer>
              <button type="button" class="btn btn-secondary btn-s" data-live-drawer-open>Открыть панель</button>
              <div class="live-overlay live-overlay--drawer" data-live-drawer-panel hidden>
                <div class="live-drawer" role="dialog" aria-modal="true">
                  <div class="live-drawer-head"><span>Настройки</span><button type="button" class="live-drawer-close" data-live-drawer-close aria-label="Закрыть">${icon("close", 14)}</button></div>
                  <div class="live-drawer-body"><p>Уведомления, язык, экспорт данных.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="open">
          <span class="showcase-label">Open</span>
          <div class="showcase-demo">
            <div style="position:relative;width:320px;height:180px;border-radius:10px;overflow:hidden;border:1px solid var(--border)">
              <div class="live-overlay live-overlay--drawer" style="position:absolute;inset:0">
                <div class="live-drawer" style="position:absolute;left:0;top:0;bottom:0;width:220px">
                  <div class="live-drawer-head"><span>Настройки</span><span>${icon("close", 14)}</span></div>
                  <div class="live-drawer-body"><p style="margin:0;font-size:13px">Панель открыта.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Popover', category: 'Overlay', status: 'stable', desc: '<strong>Поповер.</strong> Контент привязанный к элементу.', params: 'content · trigger · placement', states: 'closed · open', aiPrompt: `Создай Popover interactive. Без внешних библиотек.`, variants: [
      { id: 'interactive', label: 'Interactive', aiPrompt: `Создай Popover click toggle. Без внешних библиотек.` },
      { id: 'open', label: 'Open', aiPrompt: `Создай Popover open state. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div class="live-popover-wrap" data-live-popover>
              <button type="button" class="btn btn-secondary btn-s" data-live-popover-trigger>Показать поповер</button>
              <div class="live-popover" hidden role="tooltip">Информация о продукте PP-H 1200.</div>
            </div>
          </div>
        </div>
        <div data-variant-id="open">
          <span class="showcase-label">Open</span>
          <div class="showcase-demo">
            <div class="live-popover-wrap">
              <button type="button" class="btn btn-secondary btn-s">Продукт</button>
              <div class="live-popover" role="tooltip" style="display:block;position:relative;margin-top:8px">Информация о продукте PP-H 1200.</div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Confirm Dialog', category: 'Overlay', status: 'stable', desc: '<strong>Подтверждение.</strong> Модалка с вопросом.', params: 'open · onConfirm · danger', states: 'closed · open', aiPrompt: `Создай ConfirmDialog danger. Без внешних библиотек.`, variants: [
      { id: 'interactive', label: 'Interactive', aiPrompt: `Создай ConfirmDialog interactive. Без внешних библиотек.` },
      { id: 'open', label: 'Open', aiPrompt: `Создай ConfirmDialog open danger. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="interactive">
          <span class="showcase-label">Interactive</span>
          <div class="showcase-demo">
            <div data-live-confirm>
              <button type="button" class="btn btn-secondary btn-s" data-live-confirm-open style="color:var(--danger);border-color:var(--danger)">Удалить</button>
              <div class="live-overlay" data-live-confirm-panel hidden>
                <div class="live-modal" role="alertdialog" aria-modal="true">
                  <h4>Удалить элемент?</h4>
                  <p>Данные будут удалены навсегда.</p>
                  <div class="modal-actions">
                    <button type="button" class="btn btn-secondary btn-s" data-live-confirm-cancel>Отмена</button>
                    <button type="button" class="btn btn-s" data-live-confirm-ok style="background:var(--danger);color:#fff;border:0">Удалить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-variant-id="open">
          <span class="showcase-label">Open</span>
          <div class="showcase-demo">
            <div style="position:relative;min-height:180px;border-radius:12px;overflow:hidden;border:1px solid var(--border)">
              <div class="live-overlay" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
                <div class="live-modal" role="alertdialog">
                  <h4>Удалить элемент?</h4>
                  <p>Данные будут удалены навсегда.</p>
                  <div class="modal-actions">
                    <button type="button" class="btn btn-secondary btn-s">Отмена</button>
                    <button type="button" class="btn btn-s" style="background:var(--danger);color:#fff;border:0">Удалить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>` },

    { name: 'Banner', category: 'Overlay', desc: '<strong>Баннер.</strong> Полноширинное уведомление.', params: 'type · text · actionLabel', states: 'default · closed', aiPrompt: `Создай Banner warning full-width. Без внешних библиотек.`, variants: [
      { id: 'warning', label: 'Warning', aiPrompt: `Создай Banner type=warning с action. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="warning">
          <span class="showcase-label">Warning</span>
          <div class="showcase-demo">
            <div style="background:rgba(226,163,38,0.12);border-bottom:1px solid rgba(226,163,38,0.3);padding:12px 16px;display:flex;align-items:center;gap:12px;font-size:14px;width:100%">
              <span>${icon("alert-circle", 18)}</span>
              <span style="flex:1">Система обновится в 02:00 МСК.</span>
              <button style="border:1px solid var(--warning);background:transparent;padding:4px 14px;border-radius:6px;font-size:12px;cursor:pointer;font-weight:600">Подробнее</button>
              <span style="cursor:pointer;color:var(--text-secondary)">${icon("close", 14)}</span>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Empty State', category: 'Overlay', desc: '<strong>Пустое состояние.</strong> Заглушка для пустых списков.', params: 'icon · title · text · actionLabel', states: 'default', aiPrompt: `Создай EmptyState с CTA. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай EmptyState: icon, title, button. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div style="text-align:center;padding:40px 20px">
              <div style="font-size:56px;opacity:0.4;margin-bottom:12px">${icon("inbox", 32)}</div>
              <h3 style="margin:0 0 6px;font-size:18px;font-weight:700">Нет результатов</h3>
              <p style="margin:0 0 16px;font-size:14px;color:var(--text-secondary)">Измените фильтры или создайте элемент</p>
              <button style="border:0;background:var(--primary);color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600">Создать</button>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Error State', category: 'Overlay', desc: '<strong>Ошибка.</strong> Заглушка ошибки загрузки.', params: 'title · onRetry', states: 'default', aiPrompt: `Создай ErrorState с retry. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай ErrorState с кнопкой Повторить. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div style="text-align:center;padding:40px 20px">
              <div style="width:64px;height:64px;border-radius:50%;background:rgba(197,59,59,0.1);display:inline-flex;align-items:center;justify-content:center;color:var(--danger);margin-bottom:12px">${icon("x-circle", 18)}</div>
              <h3 style="margin:0 0 6px;font-size:18px;font-weight:700">Ошибка загрузки</h3>
              <p style="margin:0 0 16px;font-size:14px;color:var(--text-secondary)">Проверьте подключение.</p>
              <button style="border:1px solid var(--border);background:var(--surface);padding:10px 20px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600">Повторить</button>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Success Screen', category: 'Overlay', desc: '<strong>Экран успеха.</strong> Подтверждение действия.', params: 'title · text · actionLabel', states: 'default', aiPrompt: `Создай SuccessScreen с галочкой. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай SuccessScreen. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div style="text-align:center;padding:40px 20px">
              <div class="success-screen-icon">${icon("check-circle", 32)}</div>
              <h3 style="margin:0 0 6px;font-size:18px;font-weight:700">Заявка отправлена!</h3>
              <p style="margin:0 0 16px;font-size:14px;color:var(--text-secondary)">Мы свяжемся с вами в ближайшее время.</p>
              <button style="border:0;background:var(--primary);color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600">На главную</button>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Inline Notification', category: 'Overlay', desc: '<strong>Инлайн-уведомление.</strong> Внутри формы/блока.', params: 'type · text', states: 'default', aiPrompt: `Создай InlineNotification info/warning. Без внешних библиотек.`, variants: [
      { id: 'info', label: 'Info', aiPrompt: `Создай InlineNotification type=info. Без внешних библиотек.` },
      { id: 'warning', label: 'Warning', aiPrompt: `Создай InlineNotification type=warning. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="info">
          <span class="showcase-label">Info</span>
          <div class="showcase-demo">
            <div style="background:rgba(0,143,149,0.08);border-left:3px solid var(--primary);border-radius:6px;padding:10px 14px;font-size:13px;display:flex;gap:8px;align-items:flex-start;width:100%">
              <span style="color:var(--primary)">${icon("info", 18)}</span>
              <span>Форма заполнена корректно. Можно отправлять заявку.</span>
            </div>
          </div>
        </div>
        <div data-variant-id="warning">
          <span class="showcase-label">Warning</span>
          <div class="showcase-demo">
            <div style="background:rgba(226,163,38,0.1);border-left:3px solid var(--warning);border-radius:6px;padding:10px 14px;font-size:13px;display:flex;gap:8px;width:100%">
              <span>${icon("alert-circle", 18)}</span>
              <span>Проверьте объём отгрузки перед отправкой.</span>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Status Page', category: 'Overlay', desc: '<strong>Страница статуса.</strong> 404, 500, maintenance.', params: 'code · title · actionLabel', states: 'default', aiPrompt: `Создай StatusPage 404/500. Без внешних библиотек.`, variants: [
      { id: '404', label: '404', aiPrompt: `Создай StatusPage code=404. Без внешних библиотек.` },
      { id: '500', label: '500', aiPrompt: `Создай StatusPage code=500. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="404">
          <span class="showcase-label">404</span>
          <div class="showcase-demo">
            <div style="text-align:center;padding:40px 20px">
              <div style="font-size:80px;font-weight:900;color:var(--primary);opacity:0.15;line-height:1">404</div>
              <h2 style="margin:8px 0 6px;font-size:24px;font-weight:700">Страница не найдена</h2>
              <p style="margin:0 0 16px;font-size:14px;color:var(--text-secondary)">Запрашиваемая страница не существует.</p>
              <button style="border:0;background:var(--primary);color:#fff;padding:10px 24px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600">На главную</button>
            </div>
          </div>
        </div>
        <div data-variant-id="500">
          <span class="showcase-label">500</span>
          <div class="showcase-demo">
            <div style="text-align:center;padding:40px 20px">
              <div style="font-size:80px;font-weight:900;color:var(--danger);opacity:0.15;line-height:1">500</div>
              <h2 style="margin:8px 0 6px;font-size:24px;font-weight:700">Ошибка сервера</h2>
              <p style="margin:0 0 16px;font-size:14px;color:var(--text-secondary)">Попробуйте обновить страницу позже.</p>
              <button style="border:0;background:var(--primary);color:#fff;padding:10px 24px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600">На главную</button>
            </div>
          </div>
        </div>
      </div>` },

  // --- Data display ---
  { name: 'List', category: 'Data display', desc: '<strong>Список.</strong> Структурированный список элементов.', params: 'items[] · renderItem · size', states: 'default · hover · selected', aiPrompt: `Создай List (React): вертикальный список. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай List selectable items. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-list">
              <div class="sb-list-item is-selected"><span class="sb-list-icon">${icon("mail", 16)}</span><span class="sb-list-text">Заявка #1234</span><span class="sb-list-meta">сегодня</span></div>
              <div class="sb-list-item"><span class="sb-list-icon">${icon("file-text", 16)}</span><span class="sb-list-text">Договор #567</span><span class="sb-list-meta">вчера</span></div>
              <div class="sb-list-item"><span class="sb-list-icon">${icon("package", 16)}</span><span class="sb-list-text">Заказ #890</span><span class="sb-list-meta">3 дня</span></div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Timeline', category: 'Data display', desc: '<strong>Таймлайн.</strong> Хронология событий.', params: 'items[] · orientation', states: 'default', aiPrompt: `Создай Timeline vertical. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Timeline vertical с точками. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-timeline">
              <div class="sb-timeline-item is-done"><div class="sb-timeline-dot"></div><div class="sb-timeline-body"><div class="sb-timeline-date">14 марта 2026</div><div class="sb-timeline-title">Заявка создана</div></div></div>
              <div class="sb-timeline-item is-done"><div class="sb-timeline-dot"></div><div class="sb-timeline-body"><div class="sb-timeline-date">15 марта 2026</div><div class="sb-timeline-title">Одобрено менеджером</div></div></div>
              <div class="sb-timeline-item is-active"><div class="sb-timeline-dot"></div><div class="sb-timeline-body"><div class="sb-timeline-date">16 марта 2026</div><div class="sb-timeline-title">В обработке</div></div></div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'KeyValue', category: 'Data display', desc: '<strong>Пара ключ-значение.</strong> Атрибуты, характеристики.', params: 'items[] · layout', states: 'default', aiPrompt: `Создай KeyValue horizontal. Без внешних библиотек.`, variants: [
      { id: 'horizontal', label: 'Horizontal', aiPrompt: `Создай KeyValue layout=horizontal. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="horizontal">
          <span class="showcase-label">Horizontal</span>
          <div class="showcase-demo">
            <div class="sb-kv">
              <div class="sb-kv-row"><span class="sb-kv-key">Марка</span><strong class="sb-kv-val">PP-H 1200</strong></div>
              <div class="sb-kv-row"><span class="sb-kv-key">МФР</span><span class="sb-kv-val">750 000</span></div>
              <div class="sb-kv-row"><span class="sb-kv-key">Статус</span><span class="tag tag-success">В наличии</span></div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'DescriptionList', category: 'Data display', desc: '<strong>Список описаний.</strong> Детальные характеристики.', params: 'items[] · columns', states: 'default', aiPrompt: `Создай DescriptionList grid. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай DescriptionList 2 columns. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <dl class="sb-desc-list">
              <dt>Продукт</dt><dd>Полипропилен PP-H 1200</dd>
              <dt>Марка</dt><dd>H030 GP</dd>
              <dt>Тип</dt><dd>Гомополимер</dd>
              <dt>Применение</dt><dd>Литьё, плёнки</dd>
            </dl>
          </div>
        </div>
      </div>` },

  { name: 'Metric / KPI', category: 'Data display', desc: '<strong>Метрика.</strong> Число + подпись + тренд.', params: 'label · value · trend', states: 'default', aiPrompt: `Создай Metric KPI block. Без внешних библиотек.`, variants: [
      { id: 'up', label: 'Trend up', aiPrompt: `Создай Metric trend=up. Без внешних библиотек.` },
      { id: 'down', label: 'Trend down', aiPrompt: `Создай Metric trend=down. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="up">
          <span class="showcase-label">Trend up</span>
          <div class="showcase-demo">
            <div class="sb-metric">
              <div class="sb-metric-label">Выручка</div>
              <div class="sb-metric-value">12,4 млн ₽</div>
              <div class="sb-metric-trend is-up"><span class="sb-metric-trend-icon">${icon("chevron-up", 14)}</span> +8,3%</div>
            </div>
          </div>
        </div>
        <div data-variant-id="down">
          <span class="showcase-label">Trend down</span>
          <div class="showcase-demo">
            <div class="sb-metric">
              <div class="sb-metric-label">Отгрузки</div>
              <div class="sb-metric-value">2,18 млн т</div>
              <div class="sb-metric-trend is-down"><span class="sb-metric-trend-icon">${icon("chevron-down", 14)}</span> −2,1%</div>
            </div>
          </div>
        </div>
      </div>` },

  {
    name: 'DonutChart',
    category: 'Data display',
    status: 'stable',
    desc: '<strong>Круговая диаграмма.</strong> Donut-chart для долей категорий: сегменты SVG, легенда, центральная метрика. Размеры S/M/L, hover по легенде, доступность через <code>aria-label</code>.',
    params: 'data[] · valueKey · labelKey · colorKey · size: s|m|l · showLegend · centerLabel · centerValue · thickness',
    states: 'default · hover · active-segment',
    aiPrompt: `Создай React-компонент DonutChart в стиле SB Design System.

Требования:
- Круговая (donut) диаграмма для отображения долей категорий.
- Пропсы: data: { label, value, color? }[], size: 's' | 'm' | 'l', showLegend?: boolean, centerLabel?, centerValue?, thickness?: number (толщина кольца, default 16).
- Рендер через SVG: circle с stroke-dasharray для каждого сегмента, rotate -90deg от 12 часов.
- Цвета по умолчанию из палитры SB: primary #008f95, #4db8bd, success #1f8f53, warning #e2a326, accent-orange #e67e22, neutral #d7dee1.
- Размеры: s 120px, m 160px, l 200px (диаметр).
- Центр: value 20–28px/700, label 11–13px text-secondary.
- Легенда справа или снизу: цветной маркер 10px, label 13px, value 13px/600, процент text-secondary.
- Hover на пункте легенды подсвечивает сегмент (opacity 1 vs 0.35 у остальных).
- Доступность: role="img", aria-label с описанием долей; легенда — список с aria-hidden на декоративных элементах.
- Анимация появления сегментов: stroke-dashoffset transition 0.6s var(--easing).
- Без Chart.js / Recharts — SVG + CSS или чистый React.
- Пример: структура продаж полимеров SB.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай DonutChart interactive demo. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-donut-demo">

        <div class="sb-donut-demo-card">
          <div class="sb-donut-demo-label">Default · size M</div>
          <div class="sb-donut-chart size-m" data-donut-chart role="img" aria-label="Структура отгрузок: Полипропилен 38%, Полиэтилен 27%, Ecolen 20%, Прочее 15%">
            <div class="sb-donut-chart-body">
              <div class="sb-donut-visual">
                <svg class="sb-donut-svg" viewBox="0 0 120 120" aria-hidden="true">
                  <g transform="rotate(-90 60 60)">
                    <circle class="sb-donut-track" cx="60" cy="60" r="40" fill="none" stroke-width="12"/>
                    <circle class="sb-donut-seg" data-seg="0" cx="60" cy="60" r="40" fill="none" stroke="#008f95" stroke-width="12" stroke-dasharray="95.5 251.3" stroke-dashoffset="0"/>
                    <circle class="sb-donut-seg" data-seg="1" cx="60" cy="60" r="40" fill="none" stroke="#4db8bd" stroke-width="12" stroke-dasharray="67.9 251.3" stroke-dashoffset="-95.5"/>
                    <circle class="sb-donut-seg" data-seg="2" cx="60" cy="60" r="40" fill="none" stroke="#1f8f53" stroke-width="12" stroke-dasharray="50.3 251.3" stroke-dashoffset="-163.4"/>
                    <circle class="sb-donut-seg" data-seg="3" cx="60" cy="60" r="40" fill="none" stroke="#e2a326" stroke-width="12" stroke-dasharray="37.7 251.3" stroke-dashoffset="-213.7"/>
                  </g>
                </svg>
                <div class="sb-donut-center">
                  <div class="sb-donut-center-value">2,4 млн т</div>
                  <div class="sb-donut-center-label">Отгрузки</div>
                </div>
              </div>
              <ul class="sb-donut-legend">
                <li class="sb-donut-legend-item is-active" data-seg="0"><span class="sb-donut-legend-swatch" style="background:#008f95"></span><span class="sb-donut-legend-text">Полипропилен</span><span class="sb-donut-legend-val">38%</span></li>
                <li class="sb-donut-legend-item" data-seg="1"><span class="sb-donut-legend-swatch" style="background:#4db8bd"></span><span class="sb-donut-legend-text">Полиэтилен</span><span class="sb-donut-legend-val">27%</span></li>
                <li class="sb-donut-legend-item" data-seg="2"><span class="sb-donut-legend-swatch" style="background:#1f8f53"></span><span class="sb-donut-legend-text">Ecolen</span><span class="sb-donut-legend-val">20%</span></li>
                <li class="sb-donut-legend-item" data-seg="3"><span class="sb-donut-legend-swatch" style="background:#e2a326"></span><span class="sb-donut-legend-text">Прочее</span><span class="sb-donut-legend-val">15%</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="sb-donut-demo-card">
          <div class="sb-donut-demo-label">Compact · size S · без центра</div>
          <div class="sb-donut-chart size-s" data-donut-chart role="img" aria-label="Регионы: Центр 45%, Урал 30%, Сибирь 25%">
            <div class="sb-donut-chart-body sb-donut-chart-body--stack">
              <div class="sb-donut-visual">
                <svg class="sb-donut-svg" viewBox="0 0 120 120" aria-hidden="true">
                  <g transform="rotate(-90 60 60)">
                    <circle class="sb-donut-track" cx="60" cy="60" r="40" fill="none" stroke-width="11"/>
                    <circle class="sb-donut-seg" data-seg="0" cx="60" cy="60" r="40" fill="none" stroke="#008f95" stroke-width="11" stroke-dasharray="113.1 251.3" stroke-dashoffset="0"/>
                    <circle class="sb-donut-seg" data-seg="1" cx="60" cy="60" r="40" fill="none" stroke="#006b74" stroke-width="11" stroke-dasharray="75.4 251.3" stroke-dashoffset="-113.1"/>
                    <circle class="sb-donut-seg" data-seg="2" cx="60" cy="60" r="40" fill="none" stroke="#4db8bd" stroke-width="11" stroke-dasharray="62.8 251.3" stroke-dashoffset="-188.5"/>
                  </g>
                </svg>
              </div>
              <ul class="sb-donut-legend sb-donut-legend--compact">
                <li class="sb-donut-legend-item" data-seg="0"><span class="sb-donut-legend-swatch" style="background:#008f95"></span><span class="sb-donut-legend-text">Центр</span><span class="sb-donut-legend-val">45%</span></li>
                <li class="sb-donut-legend-item" data-seg="1"><span class="sb-donut-legend-swatch" style="background:#006b74"></span><span class="sb-donut-legend-text">Урал</span><span class="sb-donut-legend-val">30%</span></li>
                <li class="sb-donut-legend-item" data-seg="2"><span class="sb-donut-legend-swatch" style="background:#4db8bd"></span><span class="sb-donut-legend-text">Сибирь</span><span class="sb-donut-legend-val">25%</span></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
          </div>
        </div>
      </div> `
  },

  {
    name: 'BarChart',
    category: 'Data display',
    status: 'stable',
    desc: '<strong>Столбчатая диаграмма.</strong> Вертикальные столбцы для сравнения значений: сетка оси Y, подписи категорий, значения при hover. Размеры S/M/L, доступность через <code>aria-label</code>.',
    params: 'data[] · valueKey · labelKey · colorKey · size: s|m|l · showGrid · showValues · maxValue · orientation: vertical|horizontal',
    states: 'default · hover · active-bar',
    aiPrompt: `Создай React-компонент BarChart в стиле SB Design System.

Требования:
- Вертикальная столбчатая диаграмма для сравнения числовых значений по категориям.
- Пропсы: data: { label, value, color? }[], size: 's' | 'm' | 'l', showGrid?: boolean (default true), showValues?: boolean, maxValue?: number (auto из data), orientation?: 'vertical' (default).
- Высота области графика: s 140px, m 200px, l 260px.
- Ось Y слева: 4–5 делений, font 11px text-secondary, tabular-nums.
- Горизонтальная сетка: 1px var(--border), пунктир или solid.
- Столбцы: ширина auto (равномерно), min-width 28px, max-width 56px, border-radius 6px 6px 2px 2px.
- Цвета SB: #008f95, #4db8bd, #1f8f53, #e2a326, #006b74, #e67e22.
- Подпись категории под столбцом: 12px, text-secondary, truncate.
- Hover: активный столбец opacity 1, остальные 0.4; tooltip над столбцом с value.
- Анимация роста столбца: height/transform scaleY 0.6s var(--easing).
- Доступность: role="img", aria-label со списком значений; столбцы focusable.
- Без Chart.js — div/CSS flex или SVG.
- Пример: объёмы отгрузок полимеров по маркам.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай BarChart interactive demo. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-bar-demo">

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Default · size M · с сеткой</div>
          <div class="sb-bar-chart size-m" data-bar-chart role="img" aria-label="Отгрузки по маркам: Полипропилен 842 тыс. т, Полиэтилен 620, Ecolen 415, Прочее 310">
            <div class="sb-bar-chart-inner">
              <div class="sb-bar-chart-y" aria-hidden="true">
                <span>900</span><span>675</span><span>450</span><span>225</span><span>0</span>
              </div>
              <div class="sb-bar-chart-plot">
                <div class="sb-bar-chart-grid" aria-hidden="true"></div>
                <div class="sb-bar-chart-bars">
                  <div class="sb-bar-chart-col" data-bar="0" tabindex="0">
                    <div class="sb-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">842 тыс. т</span>
                      <div class="sb-bar-chart-fill" style="height:93.6%;--bar-color:#008f95"></div>
                    </div>
                    <span class="sb-bar-chart-x">ПП</span>
                  </div>
                  <div class="sb-bar-chart-col" data-bar="1" tabindex="0">
                    <div class="sb-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">620 тыс. т</span>
                      <div class="sb-bar-chart-fill" style="height:68.9%;--bar-color:#4db8bd"></div>
                    </div>
                    <span class="sb-bar-chart-x">ПЭ</span>
                  </div>
                  <div class="sb-bar-chart-col" data-bar="2" tabindex="0">
                    <div class="sb-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">415 тыс. т</span>
                      <div class="sb-bar-chart-fill" style="height:46.1%;--bar-color:#1f8f53"></div>
                    </div>
                    <span class="sb-bar-chart-x">Ecolen</span>
                  </div>
                  <div class="sb-bar-chart-col" data-bar="3" tabindex="0">
                    <div class="sb-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">310 тыс. т</span>
                      <div class="sb-bar-chart-fill" style="height:34.4%;--bar-color:#e2a326"></div>
                    </div>
                    <span class="sb-bar-chart-x">Прочее</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Compact · size S · кварталы</div>
          <div class="sb-bar-chart size-s" data-bar-chart role="img" aria-label="Выручка по кварталам: Q1 4,2 млн, Q2 5,1 млн, Q3 4,8 млн, Q4 6,3 млн">
            <div class="sb-bar-chart-inner">
              <div class="sb-bar-chart-y" aria-hidden="true">
                <span>7</span><span>5</span><span>3</span><span>0</span>
              </div>
              <div class="sb-bar-chart-plot">
                <div class="sb-bar-chart-grid" aria-hidden="true"></div>
                <div class="sb-bar-chart-bars">
                  <div class="sb-bar-chart-col" data-bar="0" tabindex="0">
                    <div class="sb-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">4,2 млн ₽</span>
                      <div class="sb-bar-chart-fill" style="height:60%;--bar-color:#008f95"></div>
                    </div>
                    <span class="sb-bar-chart-x">Q1</span>
                  </div>
                  <div class="sb-bar-chart-col" data-bar="1" tabindex="0">
                    <div class="sb-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">5,1 млн ₽</span>
                      <div class="sb-bar-chart-fill" style="height:73%;--bar-color:#006b74"></div>
                    </div>
                    <span class="sb-bar-chart-x">Q2</span>
                  </div>
                  <div class="sb-bar-chart-col" data-bar="2" tabindex="0">
                    <div class="sb-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">4,8 млн ₽</span>
                      <div class="sb-bar-chart-fill" style="height:69%;--bar-color:#4db8bd"></div>
                    </div>
                    <span class="sb-bar-chart-x">Q3</span>
                  </div>
                  <div class="sb-bar-chart-col" data-bar="3" tabindex="0">
                    <div class="sb-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">6,3 млн ₽</span>
                      <div class="sb-bar-chart-fill" style="height:90%;--bar-color:#1f8f53"></div>
                    </div>
                    <span class="sb-bar-chart-x">Q4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
          </div>
        </div>
      </div> `
  },

  {
    name: 'StackedBarChart',
    category: 'Data display',
    status: 'stable',
    desc: '<strong>Столбчатая диаграмма с накоплением.</strong> Составные столбцы по категориям: несколько серий в одном столбце, легенда серий, hover по серии или столбцу. Размеры S/M/L.',
    params: 'categories[] · series[] · data[][] · colors[] · size: s|m|l · showLegend · showGrid · maxValue',
    states: 'default · hover · active-series · active-column',
    aiPrompt: `Создай React-компонент StackedBarChart в стиле SB Design System.

Требования:
- Вертикальная столбчатая диаграмма с накоплением (stacked bars).
- Пропсы: categories: string[], series: { key, label, color? }[], data: number[][], size: 's'|'m'|'l', showLegend?, showGrid?, maxValue?.
- Каждый столбец — сумма серий; сегменты стекуются снизу вверх flex column-reverse.
- Цвета SB: #008f95, #4db8bd, #1f8f53, #e2a326, #006b74.
- Легенда под графиком: swatch 10px + label 12px.
- Hover на серии в легенде: подсветка всех сегментов серии, остальные opacity 0.35.
- Hover на столбец: tooltip с суммой, подсветка столбца.
- Ось Y и сетка как в BarChart.
- Без Chart.js — CSS flex + div.
- Пример: структура отгрузок полимеров по кварталам.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай StackedBarChart interactive demo. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-bar-demo">

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Default · size M · по кварталам</div>
          <div class="sb-stacked-bar-chart size-m" data-stacked-bar-chart role="img" aria-label="Отгрузки по кварталам: Q1 250, Q2 290, Q3 265, Q4 320 тыс. тонн">
            <div class="sb-bar-chart-inner">
              <div class="sb-bar-chart-y" aria-hidden="true">
                <span>350</span><span>260</span><span>175</span><span>90</span><span>0</span>
              </div>
              <div class="sb-bar-chart-plot">
                <div class="sb-bar-chart-grid" aria-hidden="true"></div>
                <div class="sb-stacked-bar-chart-bars">
                  <div class="sb-stacked-bar-chart-col" data-bar="0" tabindex="0">
                    <div class="sb-stacked-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">250 тыс. т</span>
                      <div class="sb-stacked-bar-chart-stack" style="height:71.4%">
                        <div class="sb-stacked-bar-seg" data-series="0" style="flex:120;--bar-color:#008f95"></div>
                        <div class="sb-stacked-bar-seg" data-series="1" style="flex:80;--bar-color:#4db8bd"></div>
                        <div class="sb-stacked-bar-seg" data-series="2" style="flex:50;--bar-color:#1f8f53"></div>
                      </div>
                    </div>
                    <span class="sb-bar-chart-x">Q1</span>
                  </div>
                  <div class="sb-stacked-bar-chart-col" data-bar="1" tabindex="0">
                    <div class="sb-stacked-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">290 тыс. т</span>
                      <div class="sb-stacked-bar-chart-stack" style="height:82.9%">
                        <div class="sb-stacked-bar-seg" data-series="0" style="flex:140;--bar-color:#008f95"></div>
                        <div class="sb-stacked-bar-seg" data-series="1" style="flex:90;--bar-color:#4db8bd"></div>
                        <div class="sb-stacked-bar-seg" data-series="2" style="flex:60;--bar-color:#1f8f53"></div>
                      </div>
                    </div>
                    <span class="sb-bar-chart-x">Q2</span>
                  </div>
                  <div class="sb-stacked-bar-chart-col" data-bar="2" tabindex="0">
                    <div class="sb-stacked-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">265 тыс. т</span>
                      <div class="sb-stacked-bar-chart-stack" style="height:75.7%">
                        <div class="sb-stacked-bar-seg" data-series="0" style="flex:130;--bar-color:#008f95"></div>
                        <div class="sb-stacked-bar-seg" data-series="1" style="flex:85;--bar-color:#4db8bd"></div>
                        <div class="sb-stacked-bar-seg" data-series="2" style="flex:50;--bar-color:#1f8f53"></div>
                      </div>
                    </div>
                    <span class="sb-bar-chart-x">Q3</span>
                  </div>
                  <div class="sb-stacked-bar-chart-col" data-bar="3" tabindex="0">
                    <div class="sb-stacked-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">320 тыс. т</span>
                      <div class="sb-stacked-bar-chart-stack" style="height:91.4%">
                        <div class="sb-stacked-bar-seg" data-series="0" style="flex:155;--bar-color:#008f95"></div>
                        <div class="sb-stacked-bar-seg" data-series="1" style="flex:100;--bar-color:#4db8bd"></div>
                        <div class="sb-stacked-bar-seg" data-series="2" style="flex:65;--bar-color:#1f8f53"></div>
                      </div>
                    </div>
                    <span class="sb-bar-chart-x">Q4</span>
                  </div>
                </div>
              </div>
            </div>
            <ul class="sb-stacked-bar-legend" aria-hidden="true">
              <li class="sb-stacked-bar-legend-item" data-series="0" tabindex="0"><span class="sb-stacked-bar-legend-swatch" style="background:#008f95"></span>Полипропилен</li>
              <li class="sb-stacked-bar-legend-item" data-series="1" tabindex="0"><span class="sb-stacked-bar-legend-swatch" style="background:#4db8bd"></span>Полиэтилен</li>
              <li class="sb-stacked-bar-legend-item" data-series="2" tabindex="0"><span class="sb-stacked-bar-legend-swatch" style="background:#1f8f53"></span>Ecolen</li>
            </ul>
          </div>
        </div>

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Compact · size S</div>
          <div class="sb-stacked-bar-chart size-s" data-stacked-bar-chart role="img" aria-label="Производство по заводам: Екатеринбург 180, Новосибирск 210, Ярославль 165 тыс. т">
            <div class="sb-bar-chart-inner">
              <div class="sb-bar-chart-y" aria-hidden="true">
                <span>220</span><span>110</span><span>0</span>
              </div>
              <div class="sb-bar-chart-plot">
                <div class="sb-bar-chart-grid" aria-hidden="true"></div>
                <div class="sb-stacked-bar-chart-bars">
                  <div class="sb-stacked-bar-chart-col" data-bar="0" tabindex="0">
                    <div class="sb-stacked-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">180 тыс. т</span>
                      <div class="sb-stacked-bar-chart-stack" style="height:81.8%">
                        <div class="sb-stacked-bar-seg" data-series="0" style="flex:70;--bar-color:#008f95"></div>
                        <div class="sb-stacked-bar-seg" data-series="1" style="flex:60;--bar-color:#006b74"></div>
                        <div class="sb-stacked-bar-seg" data-series="2" style="flex:50;--bar-color:#e2a326"></div>
                      </div>
                    </div>
                    <span class="sb-bar-chart-x">Екатеринбург</span>
                  </div>
                  <div class="sb-stacked-bar-chart-col" data-bar="1" tabindex="0">
                    <div class="sb-stacked-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">210 тыс. т</span>
                      <div class="sb-stacked-bar-chart-stack" style="height:95.5%">
                        <div class="sb-stacked-bar-seg" data-series="0" style="flex:85;--bar-color:#008f95"></div>
                        <div class="sb-stacked-bar-seg" data-series="1" style="flex:70;--bar-color:#006b74"></div>
                        <div class="sb-stacked-bar-seg" data-series="2" style="flex:55;--bar-color:#e2a326"></div>
                      </div>
                    </div>
                    <span class="sb-bar-chart-x">Новосибирск</span>
                  </div>
                  <div class="sb-stacked-bar-chart-col" data-bar="2" tabindex="0">
                    <div class="sb-stacked-bar-chart-col-track">
                      <span class="sb-bar-chart-tip">165 тыс. т</span>
                      <div class="sb-stacked-bar-chart-stack" style="height:75%">
                        <div class="sb-stacked-bar-seg" data-series="0" style="flex:65;--bar-color:#008f95"></div>
                        <div class="sb-stacked-bar-seg" data-series="1" style="flex:55;--bar-color:#006b74"></div>
                        <div class="sb-stacked-bar-seg" data-series="2" style="flex:45;--bar-color:#e2a326"></div>
                      </div>
                    </div>
                    <span class="sb-bar-chart-x">Ярославль</span>
                  </div>
                </div>
              </div>
            </div>
            <ul class="sb-stacked-bar-legend" aria-hidden="true">
              <li class="sb-stacked-bar-legend-item" data-series="0" tabindex="0"><span class="sb-stacked-bar-legend-swatch" style="background:#008f95"></span>ПП</li>
              <li class="sb-stacked-bar-legend-item" data-series="1" tabindex="0"><span class="sb-stacked-bar-legend-swatch" style="background:#006b74"></span>ПЭ</li>
              <li class="sb-stacked-bar-legend-item" data-series="2" tabindex="0"><span class="sb-stacked-bar-legend-swatch" style="background:#e2a326"></span>Прочее</li>
            </ul>
          </div>
        </div>

      </div>
          </div>
        </div>
      </div> `
  },

  {
    name: 'LinearChart',
    category: 'Data display',
    status: 'stable',
    desc: '<strong>Линейная диаграмма.</strong> Тренд значений во времени: SVG-линия, точки данных, сетка, tooltip при hover. Размеры S/M/L, несколько серий (док.).',
    params: 'data[] · xKey · yKey · series[] · size: s|m|l · showGrid · showDots · smooth',
    states: 'default · hover · active-point',
    aiPrompt: `Создай React-компонент LinearChart в стиле SB Design System.

Требования:
- Линейная диаграмма для отображения тренда во времени.
- Пропсы: data: { x, y }[] | series: { key, label, data, color? }[], size: 's'|'m'|'l', showGrid?, showDots?, smooth?: boolean.
- SVG: polyline или path, stroke primary #008f95, stroke-width 2.5, fill none.
- Точки: circle r=4, fill #fff, stroke primary, stroke-width 2; hover r=5.
- Область под линией (optional): gradient fill rgba(0,143,149,0.08).
- Ось X: подписи месяцев/дат 11–12px text-secondary.
- Ось Y слева + горизонтальная сетка.
- Tooltip при hover на точку: значение + дата.
- Высота plot: s 140px, m 200px, l 260px.
- Без Chart.js — чистый SVG.
- Пример: динамика отгрузок полимеров по месяцам.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай LinearChart interactive demo. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-bar-demo">

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Default · size M · тренд отгрузок</div>
          <div class="sb-line-chart size-m" data-line-chart role="img" aria-label="Отгрузки по месяцам: янв 420, фев 480, мар 445, апр 520, май 610, июн 580 тыс. тонн">
            <div class="sb-line-chart-inner">
              <div class="sb-bar-chart-y" aria-hidden="true">
                <span>700</span><span>550</span><span>400</span><span>0</span>
              </div>
              <div class="sb-line-chart-plot">
                <svg class="sb-line-chart-svg" viewBox="0 0 340 170" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="sb-line-fill-1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#008f95" stop-opacity="0.15"/>
                      <stop offset="100%" stop-color="#008f95" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="42" x2="340" y2="42" class="sb-line-chart-grid-line"/>
                  <line x1="0" y1="85" x2="340" y2="85" class="sb-line-chart-grid-line"/>
                  <line x1="0" y1="128" x2="340" y2="128" class="sb-line-chart-grid-line"/>
                  <polygon class="sb-line-chart-area" points="20,131 80,105 140,121 200,88 260,49 320,62 320,150 20,150" fill="url(#sb-line-fill-1)"/>
                  <polyline class="sb-line-chart-line" points="20,131 80,105 140,121 200,88 260,49 320,62"/>
                </svg>
                <div class="sb-line-chart-dots-layer" aria-hidden="true">
                  <div class="sb-line-chart-dot-hit" data-point="0" style="left:5.9%;top:77.1%"><span class="sb-line-chart-tip">420 тыс. т</span></div>
                  <div class="sb-line-chart-dot-hit" data-point="1" style="left:23.5%;top:61.8%"><span class="sb-line-chart-tip">480 тыс. т</span></div>
                  <div class="sb-line-chart-dot-hit" data-point="2" style="left:41.2%;top:71.2%"><span class="sb-line-chart-tip">445 тыс. т</span></div>
                  <div class="sb-line-chart-dot-hit" data-point="3" style="left:58.8%;top:51.8%"><span class="sb-line-chart-tip">520 тыс. т</span></div>
                  <div class="sb-line-chart-dot-hit" data-point="4" style="left:76.5%;top:28.8%"><span class="sb-line-chart-tip">610 тыс. т</span></div>
                  <div class="sb-line-chart-dot-hit" data-point="5" style="left:94.1%;top:36.5%"><span class="sb-line-chart-tip">580 тыс. т</span></div>
                </div>
                <div class="sb-line-chart-x-labels" aria-hidden="true">
                  <span>Янв</span><span>Фев</span><span>Мар</span><span>Апр</span><span>Май</span><span>Июн</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Compact · size S · без заливки</div>
          <div class="sb-line-chart size-s sb-line-chart--plain" data-line-chart role="img" aria-label="Цена PP-H 1200: янв 92, фев 94, мар 91, апр 95 тыс. руб. за тонну">
            <div class="sb-line-chart-inner">
              <div class="sb-bar-chart-y" aria-hidden="true">
                <span>100</span><span>95</span><span>90</span>
              </div>
              <div class="sb-line-chart-plot">
                <svg class="sb-line-chart-svg" viewBox="0 0 280 120" preserveAspectRatio="none" aria-hidden="true">
                  <line x1="0" y1="30" x2="280" y2="30" class="sb-line-chart-grid-line"/>
                  <line x1="0" y1="60" x2="280" y2="60" class="sb-line-chart-grid-line"/>
                  <line x1="0" y1="90" x2="280" y2="90" class="sb-line-chart-grid-line"/>
                  <polyline class="sb-line-chart-line sb-line-chart-line--accent" points="20,75 100,45 180,90 260,30"/>
                </svg>
                <div class="sb-line-chart-dots-layer" aria-hidden="true">
                  <div class="sb-line-chart-dot-hit" data-point="0" style="left:7.1%;top:62.5%"><span class="sb-line-chart-tip">92 тыс. ₽</span></div>
                  <div class="sb-line-chart-dot-hit" data-point="1" style="left:35.7%;top:37.5%"><span class="sb-line-chart-tip">94 тыс. ₽</span></div>
                  <div class="sb-line-chart-dot-hit" data-point="2" style="left:64.3%;top:75%"><span class="sb-line-chart-tip">91 тыс. ₽</span></div>
                  <div class="sb-line-chart-dot-hit" data-point="3" style="left:92.9%;top:25%"><span class="sb-line-chart-tip">95 тыс. ₽</span></div>
                </div>
                <div class="sb-line-chart-x-labels" aria-hidden="true">
                  <span>Янв</span><span>Фев</span><span>Мар</span><span>Апр</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
          </div>
        </div>
      </div> `
  },

  {
    name: 'Area',
    category: 'Data display',
    status: 'stable',
    desc: '<strong>Диаграмма с областями.</strong> Временной ряд с заливкой под линией: градиент, сетка, tooltip на точках. API: <code>data</code>, <code>xField</code>, <code>yField</code>. Размеры S/M/L.',
    params: 'data[] · xField · yField · size: s|m|l · showGrid · smooth · color',
    states: 'default · hover · active-point',
    aiPrompt: `Создай React-компонент Area в стиле SB Design System.

API (как в примере):
\`\`\`tsx
type Item = { Date: string; scales: number };

const data: Item[] = [
  { Date: '2010-01', scales: 1998 },
  { Date: '2010-02', scales: 1850 },
  // ...
];

function AreaExampleOneLine() {
  return <Area data={data} xField="Date" yField="scales" />;
}
\`\`\`

Требования:
- Диаграмма с областью (area chart): заливка под линией + stroke сверху.
- Пропсы: data: Record<string, unknown>[], xField: string, yField: string, size: 's'|'m'|'l', showGrid?, smooth?, color?.
- xField: дата/категория (формат YYYY-MM ${icon("chevron-right", 14)} подпись «янв 10» или MM).
- yField: числовое значение, автошкала Y с 4 делениями.
- Заливка: linearGradient primary #008f95, opacity 0.22 ${icon("chevron-right", 14)} 0.
- Линия: stroke var(--primary), stroke-width 2.5, linecap round.
- Сетка горизонтальная, ось Y слева 11px text-secondary.
- Точки на вершинах (опционально скрытые hit-area) + tooltip с датой и значением.
- Высота plot: s 140px, m 200px, l 260px.
- Без Ant Design Charts / G2 — SVG.
- Пример: объёмы отгрузок полимеров по месяцам.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Area interactive demo. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-bar-demo">

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Default · size M · одна серия · xField Date</div>
          <div class="sb-area-chart size-m" data-area-chart role="img" aria-label="Объёмы отгрузок: 2010-01 1998, 2010-02 1850, 2010-03 1920, 2010-04 2105, 2010-05 1980, 2010-06 2050">
            <div class="sb-area-chart-inner">
              <div class="sb-bar-chart-y" aria-hidden="true">
                <span>2150</span><span>2000</span><span>1850</span><span>1700</span>
              </div>
              <div class="sb-area-chart-plot">
                <svg class="sb-area-chart-svg" viewBox="0 0 340 170" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="sb-area-fill-1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#008f95" stop-opacity="0.28"/>
                      <stop offset="100%" stop-color="#008f95" stop-opacity="0.02"/>
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="40" x2="340" y2="40" class="sb-area-chart-grid-line"/>
                  <line x1="0" y1="77" x2="340" y2="77" class="sb-area-chart-grid-line"/>
                  <line x1="0" y1="113" x2="340" y2="113" class="sb-area-chart-grid-line"/>
                  <polygon class="sb-area-chart-fill" points="20,88 80,119 140,112 200,54 260,93 320,71 320,150 20,150" fill="url(#sb-area-fill-1)"/>
                  <polyline class="sb-area-chart-line" points="20,88 80,119 140,112 200,54 260,93 320,71"/>
                </svg>
                <div class="sb-area-chart-dots-layer" aria-hidden="true">
                  <div class="sb-area-chart-dot-hit" data-point="0" style="left:5.9%;top:51.8%"><span class="sb-area-chart-tip">2010-01 · 1 998</span></div>
                  <div class="sb-area-chart-dot-hit" data-point="1" style="left:23.5%;top:69.7%"><span class="sb-area-chart-tip">2010-02 · 1 850</span></div>
                  <div class="sb-area-chart-dot-hit" data-point="2" style="left:41.2%;top:66.1%"><span class="sb-area-chart-tip">2010-03 · 1 920</span></div>
                  <div class="sb-area-chart-dot-hit" data-point="3" style="left:58.8%;top:31.9%"><span class="sb-area-chart-tip">2010-04 · 2 105</span></div>
                  <div class="sb-area-chart-dot-hit" data-point="4" style="left:76.5%;top:55.0%"><span class="sb-area-chart-tip">2010-05 · 1 980</span></div>
                  <div class="sb-area-chart-dot-hit" data-point="5" style="left:94.1%;top:41.9%"><span class="sb-area-chart-tip">2010-06 · 2 050</span></div>
                </div>
                <div class="sb-area-chart-x-labels" aria-hidden="true">
                  <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Compact · size S · 4 точки</div>
          <div class="sb-area-chart size-s" data-area-chart role="img" aria-label="Динамика scales: апр 2105, май 1980, июн 2050, июл 2010">
            <div class="sb-area-chart-inner">
              <div class="sb-bar-chart-y" aria-hidden="true">
                <span>2100</span><span>1950</span><span>1800</span>
              </div>
              <div class="sb-area-chart-plot">
                <svg class="sb-area-chart-svg" viewBox="0 0 280 120" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="sb-area-fill-2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#006b74" stop-opacity="0.24"/>
                      <stop offset="100%" stop-color="#006b74" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="24" x2="280" y2="24" class="sb-area-chart-grid-line"/>
                  <line x1="0" y1="52" x2="280" y2="52" class="sb-area-chart-grid-line"/>
                  <line x1="0" y1="80" x2="280" y2="80" class="sb-area-chart-grid-line"/>
                  <polygon class="sb-area-chart-fill" points="20,30 100,56 180,40 260,49 260,96 20,96" fill="url(#sb-area-fill-2)"/>
                  <polyline class="sb-area-chart-line sb-area-chart-line--accent" points="20,30 100,56 180,40 260,49"/>
                </svg>
                <div class="sb-area-chart-dots-layer" aria-hidden="true">
                  <div class="sb-area-chart-dot-hit" data-point="0" style="left:7.1%;top:25%"><span class="sb-area-chart-tip">04 · 2 105</span></div>
                  <div class="sb-area-chart-dot-hit" data-point="1" style="left:35.7%;top:46.7%"><span class="sb-area-chart-tip">05 · 1 980</span></div>
                  <div class="sb-area-chart-dot-hit" data-point="2" style="left:64.3%;top:33.3%"><span class="sb-area-chart-tip">06 · 2 050</span></div>
                  <div class="sb-area-chart-dot-hit" data-point="3" style="left:92.9%;top:40.8%"><span class="sb-area-chart-tip">07 · 2 010</span></div>
                </div>
                <div class="sb-area-chart-x-labels" aria-hidden="true">
                  <span>04</span><span>05</span><span>06</span><span>07</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
          </div>
        </div>
      </div> `
  },

  {
    name: 'Stats',
    category: 'Data display',
    status: 'stable',
    desc: '<strong>Изменение значений.</strong> Блоки метрик с текущим значением и динамикой: стрелка вверх/вниз, процент изменения, период сравнения. Размеры S/M/L, тон success/danger/neutral.',
    params: 'items[] · label · value · change · changeType: up|down|neutral · period · size: s|m|l · layout: row|grid',
    states: 'default · up · down · neutral',
    aiPrompt: `Создай React-компонент Stats в стиле SB Design System.

Требования:
- Набор метрик с индикатором изменения значения относительно предыдущего периода.
- Пропсы: items: { label, value, change, changeType: 'up'|'down'|'neutral', period? }[], size: 's'|'m'|'l', layout: 'row'|'grid'.
- Label: 12–13px text-secondary.
- Value: 24–32px/700 text-main, tabular-nums.
- Change badge: стрелка ${icon("chevron-up", 14)}/${icon("chevron-down", 14)}/${icon("chevron-right", 14)} + процент, font 12–13px/600.
  - up: color var(--success), background rgba success 0.1
  - down: color var(--danger), background rgba danger 0.1
  - neutral: color text-secondary, background neutral-bg
- Period: 11px text-secondary под change («к прошлому месяцу»).
- Карточка: white bg, border 1px, radius 10–12px, padding 16–20px.
- Layout row: flex wrap gap 12–16px; grid: repeat(auto-fit, minmax(160px, 1fr)).
- Без анимации счётчика по умолчанию.
- Пример: KPI дашборда продаж полимеров SB.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Stats interactive demo. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-stats-demo">

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Default · size M · row</div>
          <div class="sb-stats size-m layout-row" data-stats>
            <div class="sb-stat">
              <div class="sb-stat-label">Выручка</div>
              <div class="sb-stat-value">12,4 млн ₽</div>
              <div class="sb-stat-change is-up">
                <span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-up", 14)}</span>
                <span class="sb-stat-change-val">+8,3%</span>
              </div>
              <div class="sb-stat-period">к прошлому месяцу</div>
            </div>
            <div class="sb-stat">
              <div class="sb-stat-label">Отгрузки</div>
              <div class="sb-stat-value">2,18 млн т</div>
              <div class="sb-stat-change is-down">
                <span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-down", 14)}</span>
                <span class="sb-stat-change-val">−2,1%</span>
              </div>
              <div class="sb-stat-period">к прошлому кварталу</div>
            </div>
            <div class="sb-stat">
              <div class="sb-stat-label">Новые заявки</div>
              <div class="sb-stat-value">384</div>
              <div class="sb-stat-change is-neutral">
                <span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-right", 14)}</span>
                <span class="sb-stat-change-val">0%</span>
              </div>
              <div class="sb-stat-period">к прошлой неделе</div>
            </div>
            <div class="sb-stat">
              <div class="sb-stat-label">Конверсия</div>
              <div class="sb-stat-value">34,2%</div>
              <div class="sb-stat-change is-up">
                <span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-up", 14)}</span>
                <span class="sb-stat-change-val">+1,4 п.п.</span>
              </div>
              <div class="sb-stat-period">к прошлому месяцу</div>
            </div>
          </div>
        </div>

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Compact · size S · grid</div>
          <div class="sb-stats size-s layout-grid" data-stats>
            <div class="sb-stat">
              <div class="sb-stat-label">ПП H030 GP</div>
              <div class="sb-stat-value">95 200 ₽</div>
              <div class="sb-stat-change is-up">
                <span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-up", 14)}</span>
                <span class="sb-stat-change-val">+3,2%</span>
              </div>
            </div>
            <div class="sb-stat">
              <div class="sb-stat-label">ПЭ HDPE</div>
              <div class="sb-stat-value">88 400 ₽</div>
              <div class="sb-stat-change is-down">
                <span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-down", 14)}</span>
                <span class="sb-stat-change-val">−1,8%</span>
              </div>
            </div>
            <div class="sb-stat">
              <div class="sb-stat-label">Ecolen</div>
              <div class="sb-stat-value">102 600 ₽</div>
              <div class="sb-stat-change is-up">
                <span class="sb-stat-change-icon" aria-hidden="true">${icon("chevron-up", 14)}</span>
                <span class="sb-stat-change-val">+5,6%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
          </div>
        </div>
      </div> `
  },

  {
    name: 'Gauge',
    category: 'Data display',
    status: 'stable',
    desc: '<strong>Датчик (gauge).</strong> Полукруглый индикатор прогресса 0–100%: дуга диапазона, деления оси с подделениями, центральное значение. Цвет диапазона success / primary / warning.',
    params: 'percent · range.color · axis.label.formatter · axis.subTickLine.count · size: s|m|l · label · tone: success|primary|warning',
    states: 'default',
    aiPrompt: `Создай React-компонент Gauge в стиле SB Design System.

API (как в примере):
\`\`\`tsx
export function GaugeExample() {
  const vars = useThemeVars(); // или CSS-переменные: --success, --primary

  const options = {
    percent: 0.75,
    range: {
      color: vars.color.primary['--color-bg-success'], // в SB: var(--success) или rgba(31,143,83,0.15) для track tint
    },
    axis: {
      label: {
        formatter(v: number) {
          return Number(v) * 100; // 0..1 ${icon("chevron-right", 14)} 0..100 на шкале
        },
      },
      subTickLine: {
        count: 3, // 3 подделения между основными (шаг 20% ${icon("chevron-right", 14)} метки 0,20,40,60,80,100)
      },
    },
  };

  return <Gauge {...options} />;
}
\`\`\`

Требования:
- Полукруглая шкала снизу (180°), SVG arc + stroke-dasharray для заполнения percent (0–1).
- Track: stroke var(--neutral-bg), stroke-width 14, linecap round.
- Range (заполнение): stroke var(--success) по умолчанию; tone primary ${icon("chevron-right", 14)} var(--primary), warning ${icon("chevron-right", 14)} var(--warning).
- Ось: 6 основных делений (0–100 шаг 20), между ними subTickLine.count подделений.
- Подписи оси: formatter(v) * 100, font 10–11px text-secondary.
- Центр: значение percent*100 + «%», 22–28px/700; опциональный label снизу 11px.
- Размеры: s 180${icon("close", 14)}120, m 220${icon("close", 14)}140, l 260${icon("close", 14)}160.
- Маркер на конце дуги: круг 6px белый с обводкой цвета range.
- Доступность: role="img", aria-label с процентом.
- Без G2/Ant Design Charts — SVG + CSS.
- Пример: загрузка мощности производственной линии SB.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Gauge interactive demo. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-gauge-demo">

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Default · size M · success · 75%</div>
          <div class="sb-gauge size-m tone-success" data-gauge role="img" aria-label="Выполнение плана: 75 процентов">
            <div class="sb-gauge-visual">
              <svg class="sb-gauge-svg" viewBox="-12 -12 224 132" aria-hidden="true">
                <path class="sb-gauge-track" d="M 12 100 A 88 88 0 0 1 188 100" fill="none" stroke-width="14" pathLength="100"/>
                <path class="sb-gauge-range" d="M 12 100 A 88 88 0 0 1 188 100" fill="none" stroke-width="14" stroke-linecap="round" pathLength="100" stroke-dasharray="75 100"/>
                <line x1="30.0" y1="100.0" x2="12.0" y2="100.0" class="sb-gauge-tick sb-gauge-tick--major"/>
                <text x="-8" y="108" class="sb-gauge-axis-label" text-anchor="start">0</text>
                <line x1="23.0" y1="87.8" x2="13.1" y2="86.2" class="sb-gauge-tick"/>
                <line x1="25.8" y1="75.9" x2="16.3" y2="72.8" class="sb-gauge-tick"/>
                <line x1="30.5" y1="64.6" x2="21.6" y2="60.0" class="sb-gauge-tick"/>
                <line x1="43.4" y1="58.9" x2="28.8" y2="48.3" class="sb-gauge-tick sb-gauge-tick--major"/>
                <text x="12.6" y="36.5" class="sb-gauge-axis-label" text-anchor="middle">20</text>
                <line x1="44.8" y1="44.8" x2="37.8" y2="37.8" class="sb-gauge-tick"/>
                <line x1="54.2" y1="36.9" x2="48.3" y2="28.8" class="sb-gauge-tick"/>
                <line x1="64.6" y1="30.5" x2="60.0" y2="21.6" class="sb-gauge-tick"/>
                <line x1="78.4" y1="33.4" x2="72.8" y2="16.3" class="sb-gauge-tick sb-gauge-tick--major"/>
                <text x="66.6" y="-2.7" class="sb-gauge-axis-label" text-anchor="middle">40</text>
                <line x1="87.8" y1="23.0" x2="86.2" y2="13.1" class="sb-gauge-tick"/>
                <line x1="100.0" y1="22.0" x2="100.0" y2="12.0" class="sb-gauge-tick"/>
                <line x1="112.2" y1="23.0" x2="113.8" y2="13.1" class="sb-gauge-tick"/>
                <line x1="121.6" y1="33.4" x2="127.2" y2="16.3" class="sb-gauge-tick sb-gauge-tick--major"/>
                <text x="133.4" y="-2.7" class="sb-gauge-axis-label" text-anchor="middle">60</text>
                <line x1="135.4" y1="30.5" x2="140.0" y2="21.6" class="sb-gauge-tick"/>
                <line x1="145.8" y1="36.9" x2="151.7" y2="28.8" class="sb-gauge-tick"/>
                <line x1="155.2" y1="44.8" x2="162.2" y2="37.8" class="sb-gauge-tick"/>
                <line x1="156.6" y1="58.9" x2="171.2" y2="48.3" class="sb-gauge-tick sb-gauge-tick--major"/>
                <text x="187.4" y="36.5" class="sb-gauge-axis-label" text-anchor="middle">80</text>
                <line x1="169.5" y1="64.6" x2="178.4" y2="60.0" class="sb-gauge-tick"/>
                <line x1="174.2" y1="75.9" x2="183.7" y2="72.8" class="sb-gauge-tick"/>
                <line x1="177.0" y1="87.8" x2="186.9" y2="86.2" class="sb-gauge-tick"/>
                <line x1="170.0" y1="100.0" x2="188.0" y2="100.0" class="sb-gauge-tick sb-gauge-tick--major"/>
                <text x="208" y="108" class="sb-gauge-axis-label" text-anchor="end">100</text>
                <circle class="sb-gauge-marker" cx="162.2" cy="37.8" r="6"/>
              </svg>
              <div class="sb-gauge-center">
                <div class="sb-gauge-value">75%</div>
                <div class="sb-gauge-label">Выполнение плана</div>
              </div>
            </div>
          </div>
        </div>

        <div class="sb-bar-demo-card">
          <div class="sb-bar-demo-label">Compact · size S · primary · 62%</div>
          <div class="sb-gauge size-s tone-primary" data-gauge role="img" aria-label="Утилизация линии: 62 процента">
            <div class="sb-gauge-visual">
              <svg class="sb-gauge-svg" viewBox="-12 -12 224 132" aria-hidden="true">
                <path class="sb-gauge-track" d="M 12 100 A 88 88 0 0 1 188 100" fill="none" stroke-width="12" pathLength="100"/>
                <path class="sb-gauge-range" d="M 12 100 A 88 88 0 0 1 188 100" fill="none" stroke-width="12" stroke-linecap="round" pathLength="100" stroke-dasharray="62 100"/>
                <line x1="30.0" y1="100.0" x2="14.0" y2="100.0" class="sb-gauge-tick sb-gauge-tick--major"/>
                <line x1="43.4" y1="58.9" x2="30.0" y2="50.0" class="sb-gauge-tick sb-gauge-tick--major"/>
                <line x1="78.4" y1="33.4" x2="74.0" y2="18.0" class="sb-gauge-tick sb-gauge-tick--major"/>
                <line x1="121.6" y1="33.4" x2="126.0" y2="18.0" class="sb-gauge-tick sb-gauge-tick--major"/>
                <line x1="156.6" y1="58.9" x2="170.0" y2="50.0" class="sb-gauge-tick sb-gauge-tick--major"/>
                <line x1="170.0" y1="100.0" x2="186.0" y2="100.0" class="sb-gauge-tick sb-gauge-tick--major"/>
                <text x="-8" y="108" class="sb-gauge-axis-label" text-anchor="start">0</text>
                <text x="66.6" y="-2.7" class="sb-gauge-axis-label" text-anchor="middle">40</text>
                <text x="133.4" y="-2.7" class="sb-gauge-axis-label" text-anchor="middle">60</text>
                <text x="208" y="108" class="sb-gauge-axis-label" text-anchor="end">100</text>
                <circle class="sb-gauge-marker" cx="132.4" cy="18.2" r="5"/>
              </svg>
              <div class="sb-gauge-center">
                <div class="sb-gauge-value">62%</div>
                <div class="sb-gauge-label">Утилизация линии</div>
              </div>
            </div>
          </div>
        </div>

      </div>
          </div>
        </div>
      </div> `
  },

  { name: 'ProductTile', category: 'Data display', desc: '<strong>Карточка продукта.</strong> Превью для каталога.', params: 'name · brand · price · status', states: 'default · hover', aiPrompt: `Создай ProductTile. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай ProductTile catalog card. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-product-tile">
              <div class="sb-product-tile-media">${icon("package", 32)}</div>
              <div class="sb-product-tile-body">
                <div class="sb-product-tile-brand">Полимер</div>
                <div class="sb-product-tile-name">PP-H 1200</div>
                <div class="sb-product-tile-price">от 95 000 ₽/т</div>
                <span class="tag tag-success">В наличии</span>
              </div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'UserCard', category: 'Data display', desc: '<strong>Карточка пользователя.</strong> Аватар + имя + роль.', params: 'name · email · role · status', states: 'default', aiPrompt: `Создай UserCard. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай UserCard online status. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-user-card">
              <div class="sb-user-card-avatar">АК<span class="sb-user-card-status"></span></div>
              <div class="sb-user-card-body">
                <div class="sb-user-card-name">Анна Козлова</div>
                <div class="sb-user-card-email">anna@sb.local</div>
                <span class="tag tag-success">Администратор</span>
              </div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'OrganizationCard', category: 'Data display', desc: '<strong>Карточка организации.</strong> Логотип + ИНН + статус.', params: 'name · inn · logo · status', states: 'default', aiPrompt: `Создай OrganizationCard. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай OrganizationCard active. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-org-card">
              <div class="sb-org-card-logo"><img src="logo-mark.png" alt="SB" width="30" height="30" style="display:block;width:30px;height:30px;object-fit:contain" /></div>
              <div class="sb-org-card-body">
                <div class="sb-org-card-name">SB Нефтехим</div>
                <div class="sb-org-card-inn">ИНН: 7700000000</div>
              </div>
              <span class="tag tag-success">Активен</span>
            </div>
          </div>
        </div>
      </div>` },

  // --- Layout ---
  { name: 'Grid', category: 'Layout', desc: '<strong>Сетка.</strong> Универсальная сетка 1-12 колонок.', params: 'columns · gap · children', states: 'default', aiPrompt: `Создай Grid (React): CSS Grid 1-12 колонок. Без внешних библиотек.`, variants: [
      { id: 'cols-4', label: '4 columns', aiPrompt: `Создай Grid 4 колонки gap 12. Без внешних библиотек.` },
      { id: 'cols-3', label: '3 columns', aiPrompt: `Создай Grid 3 колонки. Без внешних библиотек.` },
      { id: 'cols-2', label: '2 columns', aiPrompt: `Создай Grid 2 колонки mobile-friendly. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="cols-4">
          <span class="showcase-label">4 columns</span>
          <div class="showcase-demo">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
              <div style="background:rgba(0,143,149,0.1);border:1px dashed var(--primary);border-radius:8px;padding:16px;text-align:center;font-size:13px;color:var(--primary)">1 / 4</div>
              <div style="background:rgba(0,143,149,0.1);border:1px dashed var(--primary);border-radius:8px;padding:16px;text-align:center;font-size:13px;color:var(--primary)">2 / 4</div>
              <div style="background:rgba(0,143,149,0.1);border:1px dashed var(--primary);border-radius:8px;padding:16px;text-align:center;font-size:13px;color:var(--primary)">3 / 4</div>
              <div style="background:rgba(0,143,149,0.1);border:1px dashed var(--primary);border-radius:8px;padding:16px;text-align:center;font-size:13px;color:var(--primary)">4 / 4</div>
            </div>
          </div>
        </div>
        <div data-variant-id="cols-3">
          <span class="showcase-label">3 columns</span>
          <div class="showcase-demo">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
              <div style="background:rgba(0,143,149,0.1);border:1px dashed var(--primary);border-radius:8px;padding:16px;text-align:center;font-size:13px;color:var(--primary)">1 / 3</div>
              <div style="background:rgba(0,143,149,0.1);border:1px dashed var(--primary);border-radius:8px;padding:16px;text-align:center;font-size:13px;color:var(--primary)">2 / 3</div>
              <div style="background:rgba(0,143,149,0.1);border:1px dashed var(--primary);border-radius:8px;padding:16px;text-align:center;font-size:13px;color:var(--primary)">3 / 3</div>
            </div>
          </div>
        </div>
        <div data-variant-id="cols-2">
          <span class="showcase-label">2 columns</span>
          <div class="showcase-demo">
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
              <div style="background:rgba(0,143,149,0.1);border:1px dashed var(--primary);border-radius:8px;padding:16px;text-align:center;font-size:13px;color:var(--primary)">1 / 2</div>
              <div style="background:rgba(0,143,149,0.1);border:1px dashed var(--primary);border-radius:8px;padding:16px;text-align:center;font-size:13px;color:var(--primary)">2 / 2</div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Stack', category: 'Layout', desc: '<strong>Стек.</strong> Вертикальная/горизонтальная раскладка.', params: 'direction · gap · align · children', states: 'default', aiPrompt: `Создай Stack (React): flex column/row. Без внешних библиотек.`, variants: [
      { id: 'vertical', label: 'Vertical', aiPrompt: `Создай Stack direction=vertical gap 12. Без внешних библиотек.` },
      { id: 'horizontal', label: 'Horizontal', aiPrompt: `Создай Stack direction=horizontal gap 12. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="vertical">
          <span class="showcase-label">Vertical</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-direction:column;gap:12px">
              <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 16px">Элемент 1</div>
              <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 16px">Элемент 2</div>
              <div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 16px">Элемент 3</div>
            </div>
          </div>
        </div>
        <div data-variant-id="horizontal">
          <span class="showcase-label">Horizontal</span>
          <div class="showcase-demo">
            <div style="display:flex;flex-direction:row;gap:12px">
              <div style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 16px">Элемент 1</div>
              <div style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 16px">Элемент 2</div>
              <div style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 16px">Элемент 3</div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Divider', category: 'Layout', desc: '<strong>Разделитель.</strong> Горизонтальная или вертикальная линия.', params: 'orientation · color', states: 'default', aiPrompt: `Создай Divider horizontal/vertical. Без внешних библиотек.`, variants: [
      { id: 'horizontal', label: 'Horizontal', aiPrompt: `Создай Divider horizontal. Без внешних библиотек.` },
      { id: 'vertical', label: 'Vertical', aiPrompt: `Создай Divider vertical. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="horizontal">
          <span class="showcase-label">Horizontal</span>
          <div class="showcase-demo">
            <div style="font-size:14px;margin-bottom:12px">Содержимое перед</div>
            <div style="height:1px;background:var(--border);margin:12px 0"></div>
            <div style="font-size:14px">Содержимое после</div>
          </div>
        </div>
        <div data-variant-id="vertical">
          <span class="showcase-label">Vertical</span>
          <div class="showcase-demo">
            <div style="display:flex;align-items:center;gap:16px;height:48px">
              <span style="font-size:14px">Слева</span>
              <div style="width:1px;height:100%;background:var(--border)"></div>
              <span style="font-size:14px">Справа</span>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Section', category: 'Layout', desc: '<strong>Секция.</strong> Блок с заголовком и отступами.', params: 'title · description · children · actions', states: 'default', aiPrompt: `Создай Section с title, description, actions. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Section с кнопкой действия. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div style="border-bottom:1px solid var(--border);padding-bottom:16px;display:flex;align-items:center;justify-content:space-between">
              <div><h3 style="margin:0;font-size:18px;font-weight:700">Последние заявки</h3><p style="margin:4px 0 0;font-size:13px;color:var(--text-secondary)">Обновлено 2 минуты назад</p></div>
              <button style="border:0;background:var(--primary);color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600">Все заявки</button>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Container', category: 'Layout', desc: '<strong>Контейнер.</strong> Обёртка с max-width.', params: 'maxWidth · padding · children', states: 'default', aiPrompt: `Создай Container max-width centered. Без внешних библиотек.`, variants: [
      { id: 'w720', label: '720px', aiPrompt: `Создай Container maxWidth=720. Без внешних библиотек.` },
      { id: 'w960', label: '960px', aiPrompt: `Создай Container maxWidth=960. Без внешних библиотек.` },
      { id: 'w1200', label: '1200px', aiPrompt: `Создай Container maxWidth=1200. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="w720">
          <span class="showcase-label">720px</span>
          <div class="showcase-demo">
            <div style="max-width:720px;margin:0 auto;padding:24px;background:var(--surface);border:1px dashed var(--border);border-radius:10px;text-align:center;font-size:14px;color:var(--text-secondary)">Container 720px</div>
          </div>
        </div>
        <div data-variant-id="w960">
          <span class="showcase-label">960px</span>
          <div class="showcase-demo">
            <div style="max-width:960px;margin:0 auto;padding:24px;background:var(--surface);border:1px dashed var(--border);border-radius:10px;text-align:center;font-size:14px;color:var(--text-secondary)">Container 960px</div>
          </div>
        </div>
        <div data-variant-id="w1200">
          <span class="showcase-label">1200px</span>
          <div class="showcase-demo">
            <div style="max-width:1200px;margin:0 auto;padding:24px;background:var(--surface);border:1px dashed var(--border);border-radius:10px;text-align:center;font-size:14px;color:var(--text-secondary)">Container 1200px</div>
          </div>
        </div>
      </div>` },

  { name: 'SplitLayout', category: 'Layout', desc: '<strong>Разделённая раскладка.</strong> Два блока рядом.', params: 'left · right · ratio · children', states: 'default', aiPrompt: `Создай SplitLayout 50-50/60-40/70-30. Без внешних библиотек.`, variants: [
      { id: 'ratio-50', label: '50 · 50', aiPrompt: `Создай SplitLayout ratio 50-50. Без внешних библиотек.` },
      { id: 'ratio-60', label: '60 · 40', aiPrompt: `Создай SplitLayout ratio 60-40. Без внешних библиотек.` },
      { id: 'ratio-70', label: '70 · 30', aiPrompt: `Создай SplitLayout ratio 70-30. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="ratio-50">
          <span class="showcase-label">50 · 50</span>
          <div class="showcase-demo">
            <div style="display:flex;gap:16px">
              <div style="flex:1;background:rgba(0,143,149,0.06);border:1px dashed var(--primary);border-radius:10px;padding:20px;text-align:center;font-size:13px;color:var(--primary)">50%</div>
              <div style="flex:1;background:rgba(0,143,149,0.06);border:1px dashed var(--primary);border-radius:10px;padding:20px;text-align:center;font-size:13px;color:var(--primary)">50%</div>
            </div>
          </div>
        </div>
        <div data-variant-id="ratio-60">
          <span class="showcase-label">60 · 40</span>
          <div class="showcase-demo">
            <div style="display:flex;gap:16px">
              <div style="flex:3;background:rgba(0,143,149,0.06);border:1px dashed var(--primary);border-radius:10px;padding:20px;text-align:center;font-size:13px;color:var(--primary)">60%</div>
              <div style="flex:2;background:rgba(0,143,149,0.06);border:1px dashed var(--primary);border-radius:10px;padding:20px;text-align:center;font-size:13px;color:var(--primary)">40%</div>
            </div>
          </div>
        </div>
        <div data-variant-id="ratio-70">
          <span class="showcase-label">70 · 30</span>
          <div class="showcase-demo">
            <div style="display:flex;gap:16px">
              <div style="flex:7;background:rgba(0,143,149,0.06);border:1px dashed var(--primary);border-radius:10px;padding:20px;text-align:center;font-size:13px;color:var(--primary)">70%</div>
              <div style="flex:3;background:rgba(0,143,149,0.06);border:1px dashed var(--primary);border-radius:10px;padding:20px;text-align:center;font-size:13px;color:var(--primary)">30%</div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'PageHeader', category: 'Layout', desc: '<strong>Заголовок страницы.</strong> Breadcrumbs + title + action.', params: 'title · breadcrumbs · actions', states: 'default', aiPrompt: `Создай PageHeader с breadcrumbs и CTA. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай PageHeader с кнопкой действия. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div style="border-bottom:1px solid var(--border);padding-bottom:20px">
              <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">Главная › <strong style="color:var(--text-main)">Заявки</strong></div>
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
                <h1 style="margin:0;font-size:24px;font-weight:700">Заявки клиентов</h1>
                <button style="border:0;background:var(--primary);color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600">+ Новая заявка</button>
              </div>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Toolbar', category: 'Layout', desc: '<strong>Панель инструментов.</strong> Фильтры и действия.', params: 'children · title', states: 'default', aiPrompt: `Создай Toolbar horizontal bar. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Toolbar с фильтрами и экспортом. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;border:1px solid var(--border);border-radius:10px;background:var(--neutral-bg)">
              <span style="font-weight:600;font-size:14px">Фильтры:</span>
              <div style="padding:5px 12px;border:1px solid var(--border);border-radius:6px;font-size:13px;background:var(--surface)">Все статусы</div>
              <span style="flex:1"></span>
              <span style="font-size:13px;color:var(--text-secondary)">Найдено: 24</span>
              <button style="border:1px solid var(--border);background:var(--surface);padding:5px 12px;border-radius:6px;font-size:13px;cursor:pointer">Экспорт</button>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'FilterPanel', category: 'Layout', desc: '<strong>Панель фильтров.</strong> Боковая панель с фильтрами.', params: 'filters[] · values · onChange · onReset', states: 'default · collapsed', aiPrompt: `Создай FilterPanel vertical filters + reset. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай FilterPanel expanded. Без внешних библиотек.` },
      { id: 'collapsed', label: 'Collapsed', aiPrompt: `Создай FilterPanel collapsed state. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;width:220px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <span style="font-weight:700;font-size:14px">Фильтры</span>
                <button style="border:0;background:transparent;font-size:12px;color:var(--primary);cursor:pointer">Сбросить</button>
              </div>
              <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:6px">Статус</div>
              <label style="display:flex;gap:8px;font-size:14px;margin-bottom:8px"><input type="checkbox" checked /> В наличии</label>
              <label style="display:flex;gap:8px;font-size:14px"><input type="checkbox" /> Под заказ</label>
            </div>
          </div>
        </div>
        <div data-variant-id="collapsed">
          <span class="showcase-label">Collapsed</span>
          <div class="showcase-demo">
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px 16px;width:220px;display:flex;align-items:center;justify-content:space-between">
              <span style="font-weight:700;font-size:14px">Фильтры</span>
              <span style="font-size:12px;color:var(--text-secondary)">2 активных ▾</span>
            </div>
          </div>
        </div>
      </div>` },

  // --- Typography ---
  { name: 'Heading', category: 'Typography', desc: '<strong>Заголовок.</strong> H1–H6 с типографической шкалой.', params: 'level: 1-6 · children · as', states: 'default', aiPrompt: `Создай Heading H1–H6. Без внешних библиотек.`, variants: [
      { id: 'scale', label: 'Scale', aiPrompt: `Создай Heading scale H1–H6. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="scale">
          <span class="showcase-label">Scale</span>
          <div class="showcase-demo">
            <div class="sb-heading-scale">
              <h1 class="sb-heading sb-heading--1">Heading H1</h1>
              <h2 class="sb-heading sb-heading--2">Heading H2</h2>
              <h3 class="sb-heading sb-heading--3">Heading H3</h3>
              <h4 class="sb-heading sb-heading--4">Heading H4</h4>
              <h5 class="sb-heading sb-heading--5">Heading H5</h5>
              <h6 class="sb-heading sb-heading--6">Heading H6</h6>
            </div>
          </div>
        </div>
      </div>` },

  { name: 'Link', category: 'Typography', desc: '<strong>Ссылка.</strong> Инлайн-ссылка с hover и states.', params: 'href · children · view', states: 'default · hover · visited', aiPrompt: `Создай Link views. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Link view=default. Без внешних библиотек.` },
      { id: 'underline', label: 'Underline', aiPrompt: `Создай Link underline. Без внешних библиотек.` },
      { id: 'inline', label: 'Inline', aiPrompt: `Создай Link inline в тексте. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo"><a class="sb-link" href="#">Основная ссылка</a></div>
        </div>
        <div data-variant-id="underline">
          <span class="showcase-label">Underline</span>
          <div class="showcase-demo"><a class="sb-link sb-link--underline" href="#">Подчёркнутая ссылка</a></div>
        </div>
        <div data-variant-id="inline">
          <span class="showcase-label">Inline</span>
          <div class="showcase-demo"><p class="sb-paragraph sb-paragraph--sm">Текст с <a class="sb-link sb-link--underline" href="#">инлайн-ссылкой</a> внутри абзаца.</p></div>
        </div>
      </div>` },

  { name: 'Paragraph', category: 'Typography', desc: '<strong>Абзац.</strong> Блочный текст с типографикой.', params: 'children · size · muted', states: 'default', aiPrompt: `Создай Paragraph sizes. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Paragraph default. Без внешних библиотек.` },
      { id: 'muted', label: 'Muted', aiPrompt: `Создай Paragraph muted secondary. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo"><p class="sb-paragraph">Основной абзац текста. Компания SB — один из крупнейших производителей полимеров.</p></div>
        </div>
        <div data-variant-id="muted">
          <span class="showcase-label">Muted</span>
          <div class="showcase-demo"><p class="sb-paragraph sb-paragraph--muted">Вторичный, приглушённый текст для подписей и дублирующей информации.</p></div>
        </div>
      </div>` },

  { name: 'Caption', category: 'Typography', desc: '<strong>Подпись.</strong> Мелкий текст для мета.', params: 'children · muted', states: 'default', aiPrompt: `Создай Caption. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Caption date + meta. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-caption"><span>Обновлено 14 марта 2026 в 16:30</span><span class="sb-caption--muted">ID заявки: #123456</span></div>
          </div>
        </div>
      </div>` },

  { name: 'Code', category: 'Typography', desc: '<strong>Код.</strong> Инлайн и блочный monospace.', params: 'children · variant', states: 'default', aiPrompt: `Создай Code inline/block. Без внешних библиотек.`, variants: [
      { id: 'inline', label: 'Inline', aiPrompt: `Создай Code variant=inline. Без внешних библиотек.` },
      { id: 'block', label: 'Block', aiPrompt: `Создай Code variant=block. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="inline">
          <span class="showcase-label">Inline</span>
          <div class="showcase-demo"><p class="sb-paragraph sb-paragraph--sm">Используйте <code class="sb-code sb-code--inline">npm install</code> для установки</p></div>
        </div>
        <div data-variant-id="block">
          <span class="showcase-label">Block</span>
          <div class="showcase-demo"><pre class="sb-code sb-code--block"><code>const api = 'https://api.sb.local';</code></pre></div>
        </div>
      </div>` },

  { name: 'Mark', category: 'Typography', desc: '<strong>Выделение.</strong> Highlight текста.', params: 'children · color', states: 'default', aiPrompt: `Создай Mark highlight. Без внешних библиотек.`, variants: [
      { id: 'primary', label: 'Primary', aiPrompt: `Создай Mark color=primary. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="primary">
          <span class="showcase-label">Primary</span>
          <div class="showcase-demo"><p class="sb-paragraph sb-paragraph--sm">Важно: <mark class="sb-mark sb-mark--primary">цены могут отличаться</mark> от актуальных.</p></div>
        </div>
      </div>` },

  { name: 'Quote', category: 'Typography', desc: '<strong>Цитата.</strong> Блочная цитата с автором.', params: 'children · author', states: 'default', aiPrompt: `Создай Quote blockquote. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Quote с cite. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <figure class="sb-quote">
              <blockquote>«Химия — одна из тех областей науки, которая привела к созданию большого количества продуктов, улучшивших качество жизни.»</blockquote>
              <figcaption>— Алексей Морозов, CEO SB</figcaption>
            </figure>
          </div>
        </div>
      </div>` },

  // --- Navigation (дополнительные) ---
  {
    name: 'Footer Navigation (Simple)',
    category: 'Navigation',
    desc: '<strong>Простой футер.</strong> Однорядочный копирайт + ссылки. 2 варианта: default · centered.',
    params: 'links[] · copyright · align',
    states: 'default',
    aiPrompt: `Создай FooterSimple (React): однострочный подвал. Пропсы: links, copyright. Стили SB.`,
    variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай FooterSimple: flex row, copyright слева, ссылки справа, border-top. Без внешних библиотек.` },
      { id: 'centered', label: 'Centered', aiPrompt: `Создай FooterSimple centered: копирайт и ссылки по центру, column на mobile. Без внешних библиотек.` }
    ],
    demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <footer style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:16px;font-size:13px;color:var(--text-secondary);flex-wrap:wrap;gap:8px;width:100%">
              <span>© 2026 SB</span>
              <div style="display:flex;gap:16px">
                <a style="color:var(--text-secondary);text-decoration:none">Политика конфиденциальности</a>
                <a style="color:var(--text-secondary);text-decoration:none">Условия</a>
              </div>
            </footer>
          </div>
        </div>
        <div data-variant-id="centered">
          <span class="showcase-label">Centered</span>
          <div class="showcase-demo">
            <footer style="display:flex;flex-direction:column;align-items:center;gap:10px;border-top:1px solid var(--border);padding-top:16px;font-size:13px;color:var(--text-secondary);width:100%">
              <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
                <a style="color:var(--text-secondary);text-decoration:none">Политика конфиденциальности</a>
                <a style="color:var(--text-secondary);text-decoration:none">Условия</a>
                <a style="color:var(--text-secondary);text-decoration:none">Контакты</a>
              </div>
              <span>© 2026 SB</span>
            </footer>
          </div>
        </div>
      </div>
    `
  },

  { name: 'Branch Timeline', category: 'Data display', desc: '<strong>Ветвящаяся временная шкала.</strong> Процесс с ответвлениями.', params: 'nodes[] · branches[]', states: 'default · branch-active', aiPrompt: `Создай BranchTimeline. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай BranchTimeline с веткой. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <div class="sb-branch-timeline">
              <div class="sb-branch-timeline-item is-done"><span class="sb-branch-timeline-dot"></span><strong>Заявка принята</strong><div class="sb-branch-timeline-date">14 марта</div></div>
              <div class="sb-branch-timeline-item is-active"><span class="sb-branch-timeline-dot"></span><strong>Проверка</strong><div class="sb-branch-timeline-date">15 марта</div><div class="sb-branch-timeline-branch"><div class="sb-branch-timeline-branch-label">Требуется уточнение</div></div></div>
              <div class="sb-branch-timeline-item"><span class="sb-branch-timeline-dot"></span><strong>Договор</strong></div>
            </div>
          </div>
        </div>
      </div>` },
  { name: 'Pre', category: 'Typography', desc: '<strong>Блок кода.</strong> Многострочный preformatted block.', params: 'children · language · wrap', states: 'default', aiPrompt: `Создай Pre/CodeBlock. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Pre JSON block. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <pre class="sb-pre"><code>{
  "product": "PP-H 1200",
  "status": "available",
  "price": 95000
}</code></pre>
          </div>
        </div>
      </div>` },
  { name: 'Blockquote', category: 'Typography', desc: '<strong>Цитата.</strong> Семантический blockquote.', params: 'children · author', states: 'default', aiPrompt: `Создай Blockquote. Без внешних библиотек.`, variants: [
      { id: 'default', label: 'Default', aiPrompt: `Создай Blockquote accent border. Без внешних библиотек.` }
    ], demo: `
      <div class="component-showcase">
        <div data-variant-id="default">
          <span class="showcase-label">Default</span>
          <div class="showcase-demo">
            <blockquote class="sb-blockquote">
              <p>«Развитие продуктов происходит быстрее, когда дизайн-система становится общей платформой для команды.»</p>
              <cite>— Команда SB Digital</cite>
            </blockquote>
          </div>
        </div>
      </div>` },
];
